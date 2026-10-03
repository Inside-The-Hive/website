/**
 * The photographs behind the gallery canvas.
 *
 * ITH's claim is two thousand frames captured; the canvas is where that stops
 * being a number and becomes something you move through. It wants roughly
 * twenty to thirty images to feel populated — below about fifteen the world
 * reads as sparse and the pan has nothing to find.
 *
 * As of the full-folder import (scripts/build-gallery.mjs, SOURCE_FOLDERS),
 * every event now has a real set of its own — 24 frames apiece, evenly
 * sampled from the shoot rather than padded with repeats — so the earlier
 * repeat-to-fill scheme is retired. `galleryPhotos` below is simply the full
 * real set.
 *
 * Filenames with spaces must be percent-encoded here. Next takes these as URLs
 * and a raw space silently fails the request.
 */

export type GalleryPhoto = {
  id: number;
  /** Path under /public. Percent-encoded if it contains spaces. */
  image: string;
  /** Accessible name for the frame. */
  title: string;
  /** Route target: /gallery/<slug>. Matches the event slugs in content/events. */
  slug: string;
  /** True when this entry is a second appearance of an earlier photograph. */
  repeat?: boolean;
};

/**
 * Per-event frame counts and titles.
 *
 * Titles match content/events/*.mdx exactly — they are the accessible name
 * for a link into that event, so the canvas, the event index and the event
 * page itself all name it the same way.
 *
 * Counts come from scripts/build-gallery.mjs's PER_EVENT_CAP (24) applied to
 * each SOURCE_FOLDERS entry; filenames follow the script's own
 * `<slug>-NN.webp` convention, so this list regenerates mechanically — bump
 * COUNT if a future run increases the cap.
 */
const EVENTS: { slug: string; title: string; count: number }[] = [
  {
    slug: "redots-club-dinner-night",
    title: "RedotClub x Inside The Hive Dinner Night 2.0",
    count: 24,
  },
  {
    slug: "redots-nftng-dinner-night",
    title: "Redots Club x Inside The Hive Dinner Night",
    count: 24,
  },
  {
    slug: "technova",
    title: "Inside The Hive @ Technova Summit",
    count: 24,
  },
  {
    slug: "redots-club-movie-night",
    title: "RedotClub Movie Night",
    count: 24,
  },
  {
    slug: "nftng-unchain-summer",
    title: "Inside The Hive x NFTng Unchain Summer",
    count: 24,
  },
];

/** The real frames, grouped by the event they were shot at. */
const REAL: Omit<GalleryPhoto, "id">[] = EVENTS.flatMap(
  ({ slug, title, count }) =>
    Array.from({ length: count }, (_, index) => ({
      image: `/gallery/${slug}-${String(index + 1).padStart(2, "0")}.webp`,
      title,
      slug,
    })),
);

/**
 * How many frames the pannable world canvas scatters.
 *
 * The canvas is a gesture at the full archive, not the archive itself — it
 * wants roughly twenty to thirty images to feel populated (below ~15 it reads
 * as sparse), and every frame placed is decoded and composited on every pan
 * frame, which is the exact cost that made the camera hang before these were
 * resized at build time. REAL now holds 120 real photographs across five
 * events; scattering all of them would undo that fix by volume instead of by
 * file size. The world instead takes an even sample across events, so every
 * event is still represented rather than the canvas being dominated by
 * whichever event happens to sort first.
 */
const WORLD_COUNT = 28;

function evenSample<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  const step = items.length / count;
  return Array.from(
    { length: count },
    (_, index) => items[Math.floor(index * step)],
  );
}

export const galleryPhotos: GalleryPhoto[] = evenSample(
  REAL,
  WORLD_COUNT,
).map((photo, index) => ({
  ...photo,
  id: index,
}));

/**
 * The distinct frames belonging to one event, in the order they were
 * supplied — the full set, not the canvas's sampled subset. An event's own
 * page is where the depth of a 24-frame shoot belongs.
 */
export function photosForEvent(slug: string) {
  return REAL.filter((photo) => photo.slug === slug).map((photo, index) => ({
    ...photo,
    id: index,
  }));
}

/** Event slugs that have at least one frame, in first-appearance order. */
export function galleryEventSlugs() {
  return [...new Set(REAL.map((photo) => photo.slug))];
}
