/**
 * Builds the gallery's display derivatives.
 *
 * Usage: node scripts/build-gallery.mjs
 *
 * Reads photographs from two kinds of source and writes small WebPs into
 * public/gallery/:
 *
 *   1. Loose files at the root of public/ matching <event><n>.(jpg|png) —
 *      the original convention, kept for one-off additions.
 *   2. Whole folders dropped at the root of public/ (e.g. a Google Drive
 *      export), mapped to an event slug by SOURCE_FOLDERS below. Every image
 *      inside is picked up regardless of nesting depth or filename.
 *
 * Originals are read-only here and are never modified, moved, or deleted —
 * they are the masters. This script only ever writes into public/gallery/.
 *
 * Why this exists at all: photographs arrive straight off the camera at
 * 4000-7000px per side and several megabytes each. The canvas renders a frame
 * at roughly 210-300px CSS, so a raw file is more than twenty times larger
 * than needed in each dimension, and the browser still has to decode the full
 * bitmap. Resizing ahead of time is what keeps the pan smooth — see the git
 * history for the numbers from the first pass (37.6MB -> 0.8MB, ~962MB ->
 * ~37MB decoded).
 *
 * A folder dropped straight off a phone or a shared drive can run into the
 * hundreds of files and several gigabytes — one delivery here was six
 * folders, 492 images, 2.5GB. Two limits keep that from becoming the site's
 * problem: SIZE is held small (520px; the previous 900px was already more
 * than a 2x display needs at this render size), and PER_EVENT_CAP bounds how
 * many frames any one event contributes, chosen evenly across the folder
 * rather than just the first N so a cap doesn't mean "only the start of the
 * shoot".
 *
 * Next's image optimizer is not used for these: the canvas positions each
 * frame absolutely inside a transformed world at sizes it cannot infer, so
 * the work is done once here at build time instead of per-request.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Output edge, in pixels.
 *
 * Frames render at 210-300px CSS and scale to 1.05 on hover. 520 covers that
 * on a 2x display with room spare. The previous 900px was sized for a 3x
 * display the canvas never actually renders at — nobody views the gallery at
 * triple pixel density zoomed to fill the panel — and across 492 incoming
 * photographs that difference is the one that matters for load time.
 */
const SIZE = 520;

/**
 * Ceiling on frames kept per event.
 *
 * Picked evenly across the source folder by index (every Nth file) rather
 * than the first PER_EVENT_CAP alphabetically, so a capped set still spans
 * the whole shoot instead of just whatever sorts first.
 */
const PER_EVENT_CAP = 24;

/** Loose files at the root of public/ that belong to the gallery. */
const LOOSE_PATTERN = /^(dinner|movie|technova|unchain|ith-roof)\d+\.(jpe?g|png)$/i;

const IMAGE_EXT = /\.(jpe?g|png)$/i;

/**
 * Folders dropped at the root of public/, mapped to the event slug their
 * photographs belong to. Match is a case-insensitive prefix of the folder
 * name, since Drive appends an export timestamp
 * ("-20261003T004505Z-1-001") that differs per download.
 *
 * Two folders can share a slug — the NFTng dinner night's photographs
 * arrived as two separate exports — and both are swept in.
 */
const SOURCE_FOLDERS = [
  { prefix: "REDOT CLUB 2026 PICTURES", slug: "redots-club-dinner-night" },
  { prefix: "RedDots Club ROOFTOP MEDIA", slug: "redots-nftng-dinner-night" },
  {
    prefix: "REDOTSCLUBxINSIDETHEHIVE DINNER NIGHT PHOTOGRAPHS",
    slug: "redots-nftng-dinner-night",
  },
  {
    prefix: "INSIDETHEHIVE TECHNOVA SUMMIT BOOTH PICTURES",
    slug: "technova",
  },
  { prefix: "movie night", slug: "redots-club-movie-night" },
  {
    prefix: "UNCHAIN SUMMER 26",
    slug: "nftng-unchain-summer",
  },
];

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(DIR, "..", "public");
const OUT = path.join(PUBLIC, "gallery");

/** Every image file under `root`, any depth, sorted for a stable pick order. */
function walkImages(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (IMAGE_EXT.test(entry.name)) out.push(full);
    }
  }
  out.sort();
  return out;
}

/** Evenly-spaced selection of `cap` items from `items`, order preserved. */
function sample(items, cap) {
  if (items.length <= cap) return items;
  const step = items.length / cap;
  const picked = [];
  for (let i = 0; i < cap; i += 1) picked.push(items[Math.floor(i * step)]);
  return picked;
}

/** A filesystem-safe, lowercase slug for a source path, used as the output name. */
function nameFor(slug, index) {
  return `${slug}-${String(index + 1).padStart(2, "0")}.webp`;
}

async function convert(sourcePath, destPath) {
  await sharp(sourcePath)
    // EXIF orientation first — a phone portrait crops wrongly otherwise.
    .rotate()
    .resize(SIZE, SIZE, {
      fit: "cover",
      // Anchor to the top of the source, not the bottom. Sharp's "position"
      // names the edge of the SOURCE the crop window is pinned against, so
      // "south" keeps the bottom of the frame and discards the top — which
      // is backwards from what was wanted here and cut people's faces off a
      // portrait shot where the subject fills the upper frame. "north" pins
      // the window to the top instead, so a crop always removes pixels from
      // the bottom and the top of the frame — where faces and heads are —
      // is never the part that gets cut.
      position: "north",
    })
    .webp({ quality: 80, effort: 5 })
    .toFile(destPath);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  let before = 0;
  let after = 0;
  let total = 0;

  // ---- Pass 1: loose files at the root, original convention. ----
  const loose = fs.readdirSync(PUBLIC).filter((f) => LOOSE_PATTERN.test(f));
  for (const file of loose) {
    const src = path.join(PUBLIC, file);
    const dest = path.join(OUT, `${path.parse(file).name.toLowerCase()}.webp`);
    before += fs.statSync(src).size;
    await convert(src, dest);
    after += fs.statSync(dest).size;
    total += 1;
    console.log(`${file} -> gallery/${path.basename(dest)}`);
  }

  // ---- Pass 2: whole folders, grouped and capped per event. ----
  const bySlug = new Map();
  for (const entry of fs.readdirSync(PUBLIC, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const match = SOURCE_FOLDERS.find((f) =>
      entry.name.toLowerCase().startsWith(f.prefix.toLowerCase()),
    );
    if (!match) continue;
    const images = walkImages(path.join(PUBLIC, entry.name));
    const list = bySlug.get(match.slug) ?? [];
    list.push(...images);
    bySlug.set(match.slug, list);
  }

  // Sorted by slug so the output is deterministic across runs regardless of
  // directory-listing order.
  const newGalleryEntries = [];
  for (const slug of [...bySlug.keys()].sort()) {
    const all = bySlug.get(slug).sort();
    const picked = sample(all, PER_EVENT_CAP);
    console.log(
      `\n${slug}: ${all.length} photographs found, keeping ${picked.length}`,
    );
    // Run this event's conversions in parallel, but await before moving to
    // the next event so console output stays grouped and readable.
    await Promise.all(
      picked.map(async (src, index) => {
        const dest = path.join(OUT, nameFor(slug, index));
        before += fs.statSync(src).size;
        newGalleryEntries.push({ slug, dest: path.basename(dest) });
        await convert(src, dest);
        after += fs.statSync(dest).size;
        total += 1;
        console.log(`  ${path.basename(src)} -> gallery/${path.basename(dest)}`);
      }),
    );
  }

  const mb = (bytes) => (bytes / 1048576).toFixed(1);
  console.log(
    `\n${total} frames: ${mb(before)}MB -> ${mb(after)}MB ` +
      `(${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
  );

  if (newGalleryEntries.length) {
    console.log(
      "\nNew entries from folders — add these to content/gallery.ts:",
    );
    const bySlugOut = new Map();
    for (const { slug, dest } of newGalleryEntries) {
      const l = bySlugOut.get(slug) ?? [];
      l.push(dest);
      bySlugOut.set(slug, l);
    }
    for (const [slug, files] of bySlugOut) {
      console.log(`  ${slug}: ${files.length} files (${files[0]} .. ${files[files.length - 1]})`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
