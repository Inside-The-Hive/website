/**
 * Prepares crew portraits for the team row.
 *
 * Usage: node scripts/build-crew.mjs
 *
 * Reads the sources listed in SET from /public, writes processed files to
 * /public/crew. Originals are read-only here and are never modified.
 *
 * Three passes, in order:
 *
 *   1. Cut — where a portrait still carries its studio background, flood-fill
 *      inward from the edges and clear anything light that the fill reaches.
 *      Edge-connected only, so a light pixel enclosed by the subject (a shirt,
 *      a lens, a logo) is never touched.
 *   2. Trim — crop to the subject's alpha bounding box, so the file's edges
 *      are the person's edges.
 *   3. Normalise — pad onto one shared aspect ratio, anchored to the bottom.
 *
 * The third pass is what keeps the row even, and it is the one that is easy to
 * skip. The layout gives every person an identical box and fits the portrait
 * with `object-contain`, which scales to whichever axis runs out first. A
 * portrait trimmed to a narrower box than its neighbours therefore renders
 * smaller than them, and one whose subject is cropped at a different height
 * stands at a different level. Normalising here removes both at the source
 * rather than correcting them per person in the component.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(DIR, "..", "public");
const OUT = path.join(PUBLIC, "crew");

/**
 * Shared aspect ratio, width over height.
 *
 * The median of the row as supplied — chosen so most portraits are padded only
 * slightly, and none has to be padded so far that the figure floats in its box.
 */
const TARGET_RATIO = 0.648;

/**
 * Lightness above which an edge-connected pixel counts as background. Set
 * below the darkest studio white measured across these files (about 244) with
 * room to spare, and far above anything in the subjects, who wear black.
 */
const LIGHT = 232;

/** source file in /public -> output name in /public/crew */
const SET = [
  ["feezy-trim.png", "feezy.png"],
  ["anya.png", "anya.png"],
  ["cynthia-trim.png", "cynthia.png"],
  ["danny-trim.png", "danny.png"],
  ["divine-trim.png", "divine.png"],
  ["snazzy.png", "snazzy.png"],
  ["Deon.png", "deon.png"],
];

/** Clears an edge-connected light background, returning RGBA raw pixels. */
async function cutBackground(source) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const out = Buffer.from(data);
  const seen = new Uint8Array(w * h);
  const stack = [];

  for (let x = 0; x < w; x += 1) stack.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y += 1) stack.push([0, y], [w - 1, y]);

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (seen[p]) continue;
    const i = p * 4;
    if (data[i] < LIGHT || data[i + 1] < LIGHT || data[i + 2] < LIGHT) continue;
    seen[p] = 1;
    out[i + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return { buffer: out, width: w, height: h };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const [from, to] of SET) {
    const source = path.join(PUBLIC, from);
    if (!fs.existsSync(source)) {
      console.error(`missing: public/${from}`);
      process.exitCode = 1;
      continue;
    }

    const meta = await sharp(source).metadata();

    // Only cut when the file has no alpha to begin with. A portrait that
    // arrived already cut out is left alone — re-running the fill on it would
    // do nothing useful and risks eating a light edge.
    let staged;
    if (meta.hasAlpha) {
      staged = await sharp(source).png().toBuffer();
    } else {
      const { buffer, width, height } = await cutBackground(source);
      staged = await sharp(buffer, { raw: { width, height, channels: 4 } })
        .png()
        .toBuffer();
    }

    const trimmed = await sharp(staged).trim({ threshold: 1 }).png().toBuffer();
    const t = await sharp(trimmed).metadata();

    // Pad the short axis only — never crop, or a head loses its crown.
    let w = t.width;
    let h = t.height;
    if (w / h > TARGET_RATIO) h = Math.round(w / TARGET_RATIO);
    else w = Math.round(h * TARGET_RATIO);

    const dest = path.join(OUT, to);
    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      // South, so every figure stands on the same ground line.
      .composite([{ input: trimmed, gravity: "south" }])
      .png({ compressionLevel: 9 })
      .toFile(dest);

    const done = await sharp(dest).metadata();
    console.log(
      `${from} -> crew/${to}`.padEnd(38),
      `${done.width}x${done.height}`.padEnd(12),
      `ratio ${(done.width / done.height).toFixed(3)}`,
    );
  }

  console.log("\nPoint content/team.ts at the files in /public/crew.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
