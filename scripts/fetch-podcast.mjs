/**
 * Pulls the real catalogue of Inside The Hive With Feezy.
 *
 * Usage: node scripts/fetch-podcast.mjs
 *
 * The show is hosted on Spotify for Podcasters, whose public RSS feed carries
 * every episode with full audio enclosures and per-episode cover art — no API
 * key, no OAuth. The feed URL was recovered through the iTunes Search API,
 * which lists the same catalogue Spotify serves.
 *
 * What this writes:
 *   - public/podcast/art/*.webp   cover art for the newest episodes, resized
 *                                 to 640px — the CDN originals are ~3000px
 *   - content/podcast/feed.json   the data the podcast page renders
 *
 * Audio stays remote. Full episodes run 40-95MB each; committing them would
 * swell the repo past usability, and the player streams the enclosure URLs
 * directly. The CDN sends no CORS headers, so the page's analyser skips the
 * WebAudio graph for these — playback is unaffected.
 *
 * Re-run whenever new episodes drop.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RSS = "https://anchor.fm/s/60225938/podcast/rss";

/** How many episodes get local art and a place on the page. */
const KEEP = 12;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ART_DIR = path.join(DIR, "..", "public", "podcast", "art");
const OUT = path.join(DIR, "..", "content", "podcast", "feed.json");

const UA = { "User-Agent": "Mozilla/5.0 (compatible; ITH-site-build)" };

function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : null;
}

/** Strips markup and squeezes whitespace out of a feed description. */
function toSummary(html, max = 220) {
  if (!html) return "";
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  // Cut at a word, not mid-word.
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** "00:41:12" -> "41:12", "01:09:31" -> "1:09:31", plain seconds pass through. */
function toDuration(raw) {
  if (!raw) return undefined;
  if (/^\d+$/.test(raw)) {
    const s = Number(raw);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  }
  const parts = raw.split(":").map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
  }
  return raw.replace(/^0(\d:)/, "$1");
}

function slugify(title, index) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "episode"}-${index}`;
}

async function fetchArt(url, dest) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`art ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(640, 640, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(dest);
}

async function main() {
  fs.mkdirSync(ART_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const res = await fetch(RSS, { headers: UA });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const head = xml.slice(0, xml.indexOf("<item>"));
  const showArtUrl = head.match(/<itunes:image href="([^"]+)"/)?.[1];

  const items = xml.split("<item>").slice(1);
  console.log(`feed: ${pick(head, "title")} — ${items.length} episodes`);

  const episodes = [];
  for (const [i, item] of items.slice(0, KEEP).entries()) {
    const title = pick(item, "title") ?? `Episode`;
    const enclosure = item.match(/<enclosure[^>]*url="([^"]+)"/)?.[1];
    const artUrl = item.match(/<itunes:image href="([^"]+)"/)?.[1];
    // itunes:episode is the show's own numbering when present; never invented.
    const number = pick(item, "itunes:episode");
    const date = pick(item, "pubDate");
    const slug = slugify(title, items.length - i);

    let art;
    if (artUrl) {
      art = `/podcast/art/${slug}.webp`;
      await fetchArt(artUrl, path.join(ART_DIR, `${slug}.webp`));
    }

    episodes.push({
      slug,
      title,
      date: date ? new Date(date).toISOString() : null,
      duration: toDuration(pick(item, "itunes:duration")),
      summary: toSummary(pick(item, "description")),
      audio: enclosure ? enclosure.replaceAll("&amp;", "&") : undefined,
      cover: art,
      episodeNumber: number ? Number(number) : undefined,
      spotifyUrl: pick(item, "link") ?? undefined,
    });
    console.log(`  [${i}] ${title} ${art ? "(art ok)" : "(no art)"}`);
  }

  let showArt;
  if (showArtUrl) {
    showArt = "/podcast/art/show.webp";
    await fetchArt(showArtUrl, path.join(ART_DIR, "show.webp"));
  }

  const feed = {
    fetchedAt: new Date().toISOString(),
    source: RSS,
    show: {
      title: pick(head, "title"),
      author: pick(head, "itunes:author"),
      art: showArt,
    },
    /** Full catalogue size at fetch time, not just the episodes kept here. */
    total: items.length,
    episodes,
  };

  fs.writeFileSync(OUT, `${JSON.stringify(feed, null, 2)}\n`);
  console.log(`\nwrote content/podcast/feed.json — ${episodes.length} of ${items.length} episodes, art in public/podcast/art/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
