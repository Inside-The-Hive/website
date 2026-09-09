import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { episodeSchema, eventSchema, type Episode, type Event } from "./schema";

/**
 * Build-time content loader.
 *
 * Reads MDX from /content, validates frontmatter with Zod, and throws on the
 * first invalid file. Server-only — never imported into a client component.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readCollection(dir: string) {
  const full = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(full)) return [];

  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { file: path.join(dir, file), data, body: content };
    });
}

/**
 * Fails the build with the offending file and field, so a content editor sees
 * exactly what to fix rather than a stack trace.
 */
function fail(file: string, error: unknown): never {
  const issues =
    error && typeof error === "object" && "issues" in error
      ? (error as { issues: { path: (string | number)[]; message: string }[] }).issues
          .map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
          .join("\n")
      : String(error);

  throw new Error(`Invalid frontmatter in content/${file}:\n${issues}`);
}

/** Drafts are excluded from production but visible in development. */
const includeDrafts = process.env.NODE_ENV !== "production";

export function getEvents(): Event[] {
  return readCollection("events")
    .map(({ file, data, body }) => {
      const parsed = eventSchema.safeParse(data);
      if (!parsed.success) fail(file, parsed.error);
      return { ...parsed.data, body };
    })
    .filter((event) => includeDrafts || !event.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getEvent(slug: string) {
  return getEvents().find((event) => event.slug === slug) ?? null;
}

export function getFeaturedEvent() {
  const events = getEvents();
  return events.find((event) => event.featured) ?? events[0] ?? null;
}

export function getEpisodes(): Episode[] {
  return readCollection("episodes")
    .map(({ file, data, body }) => {
      const parsed = episodeSchema.safeParse(data);
      if (!parsed.success) fail(file, parsed.error);
      return { ...parsed.data, body };
    })
    .filter((episode) => includeDrafts || !episode.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getEpisode(slug: string) {
  return getEpisodes().find((episode) => episode.slug === slug) ?? null;
}

export function getFeaturedEpisode() {
  const episodes = getEpisodes();
  return episodes.find((episode) => episode.featured) ?? episodes[0] ?? null;
}

/**
 * The real podcast catalogue, written by scripts/fetch-podcast.mjs from the
 * show's own RSS feed. Null when the fetch has never been run — callers fall
 * back to the provisional MDX entries so the page never renders empty.
 */
export type PodcastFeed = {
  fetchedAt: string;
  source: string;
  show: { title: string | null; author: string | null; art?: string };
  total: number;
  episodes: {
    slug: string;
    title: string;
    date: string | null;
    duration?: string;
    summary: string;
    audio?: string;
    cover?: string;
    episodeNumber?: number;
    spotifyUrl?: string;
  }[];
};

export function getPodcastFeed(): PodcastFeed | null {
  const file = path.join(CONTENT_ROOT, "podcast", "feed.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PodcastFeed;
}

/** Years present in the catalogue, newest first. Drives the /events filter. */
export function getEventYears() {
  return [...new Set(getEvents().map((event) => event.date.getFullYear()))].sort(
    (a, b) => b - a,
  );
}

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
