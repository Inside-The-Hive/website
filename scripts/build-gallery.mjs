/**
 * Builds the gallery's display derivatives.
 *
 * Usage: node scripts/build-gallery.mjs
 *
 * Reads every `<event><n>` file at the root of public/ and writes a square
 * WebP into public/gallery/. Originals are read-only here and are never
 * modified or moved — they are the masters.
 *
 * Why this exists at all: the photographs arrive straight off the camera at
 * around 6720x4480. The canvas renders them at roughly 250px, so a raw file is
 * some twenty-seven times larger than needed in each dimension, and the browser
 * still has to decode the full bitmap — about 115MB in memory per image, near a
 * gigabyte across the set once each appears twice. Panning then has to composite
 * all of it every frame, which is what made the camera hang and skip. Resizing
 * ahead of time cut the set from 37.6MB to 0.8MB on the wire, and from ~962MB to
 * ~37MB decoded, which took the pan from dropping frames to a clean sixty.
 *
 * Next's image optimizer is not used for these: the canvas positions each frame
 * absolutely inside a transformed world at sizes it cannot infer, so the work is
 * done once here at build time instead of per-request.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Output edge, in pixels.
 *
 * Frames render at 210-300px CSS and scale to 1.05 on hover. 900 covers that on
 * a 3x display with room spare, and still decodes to only ~3MB each.
 */
const SIZE = 900;

/** Files at the root of public/ that belong to the gallery. */
const PATTERN = /^(dinner|movie|technova|unchain)\d+\.(jpe?g|png)$/i;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(DIR, "..", "public");
const OUT = path.join(PUBLIC, "gallery");

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs.readdirSync(PUBLIC).filter((f) => PATTERN.test(f));
  if (files.length === 0) {
    console.error("No source photographs matched at the root of public/.");
    process.exit(1);
  }

  let before = 0;
  let after = 0;

  for (const file of files) {
    const out = path.join(OUT, `${path.parse(file).name.toLowerCase()}.webp`);
    before += fs.statSync(path.join(PUBLIC, file)).size;

    await sharp(path.join(PUBLIC, file))
      // EXIF orientation first — a phone portrait crops wrongly otherwise.
      .rotate()
      // `attention` picks the crop window around the busiest region, which on
      // event photography is reliably the people rather than the ceiling.
      .resize(SIZE, SIZE, { fit: "cover", position: "attention" })
      .webp({ quality: 82, effort: 5 })
      .toFile(out);

    after += fs.statSync(out).size;
    console.log(`${file} -> gallery/${path.basename(out)}`);
  }

  const mb = (bytes) => (bytes / 1048576).toFixed(1);
  console.log(
    `\n${files.length} frames: ${mb(before)}MB -> ${mb(after)}MB ` +
      `(${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
  );
  console.log("Add the new paths to content/gallery.ts.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
