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

/**
 * Lightness below which an edge-connected pixel counts as a dark background.
 *
 * Studio black is not flat — it carries a lit falloff behind the subject that
 * measures well above zero — so this sits high enough to take the halo while
 * staying under the subject's own black clothing as photographed, which reads
 * lighter than the ground it stands against because it is lit.
 */
const DARK = 70;

/** Alpha at or above this is subject; below it is ground. */
const ALPHA_MID = 128;

/**
 * source file in /public -> output name in /public/crew, and how to cut it.
 *
 * `cut` is "light" by default. "alpha" is for portraits shot on black, where
 * colour cannot separate the subject from the ground and the file's own alpha
 * channel is the only reliable mask. Files that already carry alpha otherwise
 * skip the cut entirely.
 */
const SET = [
  ["feezy-trim.png", "feezy.png"],
  ["anya.png", "anya.png"],
  ["cynthia-trim.png", "cynthia.png"],
  ["danny-trim.png", "danny.png"],
  ["divine-trim.png", "divine.png"],
  ["snazzy.png", "snazzy.png"],
  ["Deon.png", "deon.png"],
  ["000000.png", "crew-8.png", "alpha"],
  ["111111.png", "crew-9.png"],
];

/** Clears an edge-connected light background, returning RGBA raw pixels. */
async function cutBackground(source, mode = "light") {
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
    if (mode === "dark") {
      if (data[i] > DARK || data[i + 1] > DARK || data[i + 2] > DARK) continue;
    } else if (data[i] < LIGHT || data[i + 1] < LIGHT || data[i + 2] < LIGHT) {
      continue;
    }
    seen[p] = 1;
    out[i + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return { buffer: out, width: w, height: h };
}

/**
 * Raises alpha above OPAQUE_FLOOR to fully opaque, leaving softer edges alone.
 */
const OPAQUE_FLOOR = 240;

/**
 * Clears a dark background by flood fill, seeded from already-transparent
 * pixels as well as from the border.
 *
 * A plain border-seeded fill fails on this source: the file carries its own
 * alpha mask over the outer region, so the fill stops at the first transparent
 * pixel and never reaches the lit halo hugging the figure. Seeding from every
 * transparent pixel puts the fill directly against that halo.
 *
 * Connectivity is what makes this safe. The subject wears black that is as
 * dark as the ground, so a global threshold takes the jacket with it — but the
 * jacket is enclosed by the lit face, collar and hands, so no fill reaches it
 * from outside.
 */
/**
 * Uses the file's own alpha channel as the mask, ignoring colour entirely.
 *
 * For a portrait shot on black, colour cannot separate subject from ground —
 * the jacket is as dark as the studio behind it, so a threshold takes both and
 * a flood fill reaches the jacket through any point where the two touch. This
 * source already carries an accurate alpha mask; it is simply soft, sitting at
 * 253 over the figure and feathering at the edges, which renders as a dither
 * against the hard-edged colour panel. Hardening that mask to a clean binary
 * is all this needs.
 */
async function maskByAlpha(source) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 3; i < out.length; i += 4) {
    out[i] = out[i] >= ALPHA_MID ? 255 : 0;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function hardenAlpha(source) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 3; i < out.length; i += 4) {
    if (out[i] >= OPAQUE_FLOOR) out[i] = 255;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const [from, to, cut = "light"] of SET) {
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
    if (cut === "alpha") {
      // Shot on black, where colour cannot tell jacket from background.
      staged = await maskByAlpha(source);
    } else if (meta.hasAlpha) {
      // Harden near-opaque alpha to solid. A cut-out exported from some
      // editors carries the subject at alpha 253 rather than 255 — invisible
      // on its own, but the row renders these over a hard-edged colour panel,
      // and a figure that is uniformly 99% opaque lets the panel's edge show
      // through it as a dither. Anything genuinely translucent (an antialiased
      // outline) is well below this and is left to blend.
      staged = await hardenAlpha(source);
    } else {
      const { buffer, width, height } = await cutBackground(source, cut);
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
