/**
 * The photographs behind the gallery canvas.
 *
 * ITH's claim is two thousand frames captured; the canvas is where that stops
 * being a number and becomes something you move through. It wants roughly
 * twenty to thirty images to feel populated — below about fifteen the world
 * reads as sparse and the pan has nothing to find.
 *
 * Twelve real frames across four events, each appearing twice to reach a
 * populated world. Repeats carry `repeat: true` and the layout shuffles before
 * placing, so a frame and its double land far apart rather than side by side.
 * Adding more photographs below automatically reduces the repetition — the
 * padding stops as soon as the real set is large enough on its own.
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
 * The real frames, grouped by the event they were shot at.
 *
 * Titles name the event rather than describing the picture: they are the
 * accessible name for a link into that event, so what matters is where the
 * frame leads, not what is in it.
 */
const REAL: Omit<GalleryPhoto, "id">[] = [
  {
    image: "/gallery/dinner1.webp",
    title: "Redotpay x Inside The Hive Dinner Night",
    slug: "redots-club-dinner",
  },
  {
    image: "/gallery/dinner2.webp",
    title: "Redotpay x Inside The Hive Dinner Night",
    slug: "redots-club-dinner",
  },
  {
    image: "/gallery/dinner3.webp",
    title: "Redotpay x Inside The Hive Dinner Night",
    slug: "redots-club-dinner",
  },
  {
    image: "/gallery/movie1.webp",
    title: "Redots Club Movie Night",
    slug: "redots-club-movie-night",
  },
  {
    image: "/gallery/movie2.webp",
    title: "Redots Club Movie Night",
    slug: "redots-club-movie-night",
  },
  {
    image: "/gallery/movie3.webp",
    title: "Redots Club Movie Night",
    slug: "redots-club-movie-night",
  },
  {
    image: "/gallery/technova1.webp",
    title: "TechNova Summit",
    slug: "technova",
  },
  {
    image: "/gallery/technova2.webp",
    title: "TechNova Summit",
    slug: "technova",
  },
  {
    image: "/gallery/technova3.webp",
    title: "TechNova Summit",
    slug: "technova",
  },
  {
    image: "/gallery/unchain1.webp",
    title: "UNCHAIN Summer x NFT NG",
    slug: "nftng-unchain-summer",
  },
  {
    image: "/gallery/unchain2.webp",
    title: "UNCHAIN Summer x NFT NG",
    slug: "nftng-unchain-summer",
  },
  {
    image: "/gallery/unchain3.webp",
    title: "UNCHAIN Summer x NFT NG",
    slug: "nftng-unchain-summer",
  },
];

/**
 * How many frames the world holds.
 *
 * Twenty-four is two clean passes over the twelve real photographs. An odd
 * target would leave the last pass partial, so some frames would appear twice
 * and others three times for no reason the reader could see.
 */
const TARGET_COUNT = 24;

export const galleryPhotos: GalleryPhoto[] = Array.from(
  { length: TARGET_COUNT },
  (_, index) => ({
    ...REAL[index % REAL.length],
    id: index,
    repeat: index >= REAL.length,
  }),
);
