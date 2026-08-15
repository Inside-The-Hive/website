import type { GalleryPhoto } from "@/content/gallery";

/**
 * World layout for the gallery canvas.
 *
 * Photographs are scattered across a coordinate space several times larger than
 * the viewport, and the camera pans across it. This module owns where each one
 * lands; the component owns how the camera moves.
 *
 * Kept as a pure function in its own file for one reason: it must run exactly
 * once. Re-running reshuffles the entire world, which is the single worst bug
 * this feature can have — the photographs jump under the reader's cursor on
 * every unrelated state change. A pure function with no React imports makes
 * that easy to see and hard to get wrong.
 */

/**
 * Frame size.
 *
 * Below the spec's 300-400 because the world's extent is driven by the photos
 * plus their margins, and at 400 a set of twenty-five spreads wide enough that
 * only three or four are ever on screen. Smaller frames pull the world in
 * without touching the separation that keeps them from overlapping.
 */
const MIN_IMAGE_SIZE = 210;
const MAX_IMAGE_SIZE = 300;

/**
 * Personal space around each photo, rolled per image rather than fixed.
 *
 * Two photographs are kept apart by the sum of *both* their margins, so the
 * gaps come out irregular. A single global margin would space everything
 * identically and the scatter would read as a grid with jitter.
 */
/**
 * Held at the spec's values. Tightening these to pull the world in packs the
 * circles close enough that their square corners begin to overlap — the
 * circle test passes and the rendered photographs still touch. Density has to
 * come from more photographs, not from less space between them.
 */
const MARGIN_MIN = 60;
const MARGIN_MAX = 80;

/** Gap between the outermost photo and the world edge. */
const CANVAS_PADDING = 100;

/**
 * Starting world size before any growth.
 *
 * Set generously on purpose. Growth is what makes the finished world's size
 * unpredictable — an unlucky packing run grows twice and lands 50% wider than a
 * lucky one, and the reader gets a noticeably emptier gallery for no reason
 * they can see. Starting wide enough that growth effectively never fires makes
 * the result consistent, and shrink-wrap then pulls the world back to whatever
 * the photographs actually occupy.
 */
const INITIAL_WORLD = 3400;

/** How much the world grows when a photo cannot find a home. */
const WORLD_GROWTH = 1200;

/** Random positions tried per photo before the world grows. */
const PLACEMENT_TRIES = 800;

/** Growth rounds allowed before giving up, so a bad config cannot hang. */
const MAX_ATTEMPTS = 15;

export type PlacedPhoto = GalleryPhoto & {
  /** World coordinates, centred on the origin. */
  x: number;
  y: number;
  size: number;
  margin: number;
};

export type World = {
  photos: PlacedPhoto[];
  width: number;
  height: number;
};

/**
 * Everything spatial scales together off the viewport width.
 *
 * A 4500px world of 400px photographs is right on a desktop and absurd on a
 * tablet, and scaling one value without the others changes the density rather
 * than the size.
 */
export function scaleFor(viewportWidth: number) {
  if (viewportWidth >= 1280) return 1;
  if (viewportWidth >= 1024) return 0.75;
  return 0.6;
}

function shuffle<T>(items: T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function generatePositions(
  data: GalleryPhoto[],
  viewportWidth: number,
): World {
  const scale = scaleFor(viewportWidth);
  const padding = CANVAS_PADDING * scale;

  let worldWidth = INITIAL_WORLD * scale;
  let worldHeight = INITIAL_WORLD * scale;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const placed: PlacedPhoto[] = [];
    let failed = false;

    for (const photo of shuffle(data)) {
      const size =
        (MIN_IMAGE_SIZE + Math.random() * (MAX_IMAGE_SIZE - MIN_IMAGE_SIZE)) *
        scale;
      const radius = size / 2;
      const margin =
        (MARGIN_MIN + Math.random() * (MARGIN_MAX - MARGIN_MIN)) * scale;

      const availableWidth = worldWidth - padding * 2 - size;
      const availableHeight = worldHeight - padding * 2 - size;

      let seated = false;

      for (let tries = 0; tries < PLACEMENT_TRIES; tries += 1) {
        const x = (Math.random() - 0.5) * availableWidth;
        const y = (Math.random() - 0.5) * availableHeight;

        // Circle against circle, even though these render as rounded squares:
        // it is a single distance check, and the looseness left at the corners
        // reads as natural spacing rather than as a packing artefact.
        const collides = placed.some((other) => {
          const distance = Math.hypot(other.x - x, other.y - y);
          const required =
            other.size / 2 + radius + other.margin + margin;
          return distance < required;
        });

        if (!collides) {
          placed.push({ ...photo, x, y, size, margin });
          seated = true;
          break;
        }
      }

      if (!seated) {
        failed = true;
        break;
      }
    }

    if (failed) {
      // One photo could not be seated, so the whole pass is discarded — keeping
      // a partial layout would bias the survivors toward the early draws.
      worldWidth += WORLD_GROWTH * scale;
      worldHeight += WORLD_GROWTH * scale;
      continue;
    }

    return shrinkWrap(placed, padding);
  }

  // Every attempt exhausted. Returning the last world unpacked would overlap
  // photographs, so the set is thinned instead: fewer frames, still correct.
  return generatePositions(data.slice(0, Math.max(1, data.length - 4)), viewportWidth);
}

/**
 * Snap the world down to what the photographs actually occupy, and re-centre.
 *
 * Load-bearing rather than cosmetic. The camera derives its pan limits from the
 * world's size, so a world left larger than its contents lets the camera travel
 * into empty margins the reader has no reason to visit.
 */
function shrinkWrap(placed: PlacedPhoto[], padding: number): World {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const photo of placed) {
    const half = photo.size / 2;
    minX = Math.min(minX, photo.x - half);
    maxX = Math.max(maxX, photo.x + half);
    minY = Math.min(minY, photo.y - half);
    maxY = Math.max(maxY, photo.y + half);
  }

  const offsetX = (minX + maxX) / 2;
  const offsetY = (minY + maxY) / 2;

  return {
    photos: placed.map((photo) => ({
      ...photo,
      x: photo.x - offsetX,
      y: photo.y - offsetY,
    })),
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}
