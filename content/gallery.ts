/**
 * The photographs behind the gallery canvas.
 *
 * ITH's claim is two thousand frames captured; the canvas is where that stops
 * being a number and becomes something you move through. It wants 20-30 images
 * to feel populated — below about fifteen the world reads as sparse and the pan
 * has nothing to find.
 *
 * TODO(client): the repository currently holds five real event photographs, so
 * the list below repeats them to fill the world. Repeats are marked so they are
 * obviously scaffolding rather than a deliberate edit. Drop real files into
 * `public/gallery/` and replace this list; nothing else needs to change.
 *
 * Filenames with spaces must be percent-encoded here. Next's image optimizer
 * takes these as URLs, and a raw space silently fails the request.
 */

export type GalleryPhoto = {
  id: number;
  /** Path under /public. Percent-encoded. */
  image: string;
  /** Used as the accessible name and shown on hover. */
  title: string;
  /** Route target: /gallery/<slug>. */
  slug: string;
  /** True while this is a duplicate standing in for a photo not yet supplied. */
  placeholder?: boolean;
};

/** The five real frames. Everything below is built from these. */
const REAL: Omit<GalleryPhoto, "id">[] = [
  {
    image: "/redot%20x%20ith%20x%20dinner.jpg",
    title: "Redotpay x Inside The Hive Dinner Night",
    slug: "redots-club-dinner",
  },
  {
    image: "/Technova.jpg",
    title: "TechNova Summit",
    slug: "technova",
  },
  {
    image: "/unchainsummer.jpg",
    title: "UNCHAIN Summer",
    slug: "nftng-unchain-summer",
  },
  {
    image: "/UNCHAIN%20SUMMER%20x%20NFT%20NG%20x%20ITH%20(93%20of%2051).jpg",
    title: "UNCHAIN Summer x NFT NG",
    slug: "nftng-unchain-summer",
  },
  {
    image: "/movienight.jpg",
    title: "Redots Club Movie Night",
    slug: "redots-club-movie-night",
  },
];

/** How many frames the world holds. Twenty-five sits in the spec's range. */
const TARGET_COUNT = 25;

export const galleryPhotos: GalleryPhoto[] = Array.from(
  { length: TARGET_COUNT },
  (_, index) => {
    const source = REAL[index % REAL.length];
    return {
      ...source,
      id: index,
      // Only the first pass through the real set is genuine; everything after
      // it is the same frame appearing again.
      placeholder: index >= REAL.length,
    };
  },
);
