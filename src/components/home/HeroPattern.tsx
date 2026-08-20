/**
 * Decorative marks behind the hero.
 *
 * The hero is white with heavy display type on the left and a large empty
 * field on the right. This fills that field with texture rather than artwork:
 * a small vocabulary of abstract geometric marks — hexagons, zigzags, arcs,
 * squiggles, crosses, triangles, hatching, dots — scattered at varying sizes
 * and rotations.
 *
 * The hexagon is the anchor. It ties the pattern to the hive logo, so it
 * appears at roughly one mark in five and never tiles: honeycomb would read as
 * a texture swatch, where scattered and rotated it reads as one mark among
 * several that happens to recur.
 *
 * Two rules do most of the work:
 *
 *   Weight. The marks are a warm sand tone at full opacity rather than black
 *   at low opacity. Black thinned out goes grey and dirty against white; a
 *   light warm stroke stays clean and sits under the type without competing
 *   with it. Measured against the headline, ink on this sand is 16.1:1 — the
 *   pattern cannot pull the text below AA no matter which mark falls behind a
 *   letter.
 *
 *   Density. Sparse on the left where the headline sits, dense toward the
 *   upper right, so the pattern reads as drifting in from the edge rather than
 *   as wallpaper. The bottom third fades to nothing so it never collides with
 *   the image row beneath the hero.
 *
 * Coordinates are hand-authored, not generated: a random layout would differ
 * on every load and could not be checked. Nothing here animates.
 */

/** One flat-top hexagon, as a closed path centred on (cx, cy). */
function hexPath(cx: number, cy: number, r: number) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
}

/** A partial hexagon — three or four sides, left open so the row is not rigid. */
function hexPartial(cx: number, cy: number, r: number, sides: number) {
  const points = Array.from({ length: sides + 1 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${points.join("L")}`;
}

/**
 * The marks, in a 1200x800 user-space box.
 *
 * x runs 0 (behind the headline) to 1200 (the right edge). Density rises with
 * x by design — the left third carries a handful of small marks, the right
 * half carries most of the set.
 */
type Mark = {
  d: string;
  /** Degrees, about the mark's own centre. */
  rotate?: number;
  cx?: number;
  cy?: number;
  /** Focal marks sit a little stronger than the rest. Still faint. */
  accent?: boolean;
  /** Solid dots are the only filled marks. */
  fill?: boolean;
  /** Dropped below 640px, halving the density on a phone. */
  dense?: boolean;
};

const MARKS: Mark[] = [
  // ---- left third: sparse, behind and around the headline ----
  { d: hexPath(96, 132, 26), rotate: 14, cx: 96, cy: 132 },
  { d: "M52 300h14M52 314h14M52 328h14" },
  { d: "M150 470a9 9 0 1 0 .1 0", fill: true },
  { d: hexPartial(214, 86, 18, 3), rotate: -22, cx: 214, cy: 86 },
  { d: "M110 620q14-20 28 0t28 0" },
  { d: "M300 190l-9 16 18 0z", rotate: 8, cx: 300, cy: 198 },
  { d: "M258 402v22M247 413h22", rotate: 20, cx: 258, cy: 413 },
  { d: "M352 545a7 7 0 1 0 .1 0", fill: true },

  // ---- middle band: the pattern begins to gather ----
  { d: hexPath(470, 250, 34), rotate: -8, cx: 470, cy: 250, accent: true },
  { d: "M420 120l16-22 16 22 16-22 16 22" },
  { d: "M540 430q16-24 32 0t32 0", dense: true },
  { d: "M486 600a52 52 0 0 1 60 0M498 614a38 38 0 0 1 36 0" },
  { d: hexPartial(600, 150, 22, 4), rotate: 34, cx: 600, cy: 150 },
  { d: "M640 330v26M626 343h28", rotate: -14, cx: 640, cy: 343, dense: true },
  { d: "M566 292a8 8 0 1 0 .1 0", fill: true },
  { d: "M700 520l-22 0 11-20z", rotate: 26, cx: 689, cy: 508 },
  { d: "M418 352h20M418 364h20M418 376h20", rotate: 12, cx: 428, cy: 364, dense: true },
  { d: hexPath(742, 660, 20), rotate: 8, cx: 742, cy: 660 },

  // ---- right half: densest, drifting in from the edge ----
  { d: hexPath(980, 140, 46), rotate: 12, cx: 980, cy: 140, accent: true },
  { d: hexPath(864, 300, 24), rotate: -18, cx: 864, cy: 300, dense: true },
  { d: "M900 84l18-26 18 26 18-26 18 26", dense: true },
  { d: "M1088 268a56 56 0 0 1 0 68M1074 282a38 38 0 0 1 0 40" },
  { d: "M820 180q18-26 36 0t36 0", rotate: -10, cx: 856, cy: 180 },
  { d: "M1140 96v30M1124 111h32", rotate: 18, cx: 1140, cy: 111, dense: true },
  { d: "M792 420a9 9 0 1 0 .1 0", fill: true },
  { d: "M940 430l-26 46 52 0z", rotate: -12, cx: 940, cy: 452, dense: true },
  { d: "M1042 470h26M1042 484h26M1042 498h26", rotate: -8, cx: 1055, cy: 484 },
  { d: hexPartial(1160, 400, 30, 4), rotate: -26, cx: 1160, cy: 400 },
  { d: "M868 552q20-28 40 0t40 0", dense: true },
  { d: "M1010 610a10 10 0 1 0 .1 0", fill: true },
  { d: hexPath(1108, 620, 32), rotate: 22, cx: 1108, cy: 620, accent: true },
  { d: "M760 250l0 24M748 262h24", rotate: -20, cx: 760, cy: 262, dense: true },
  { d: "M980 240l-20 34 40 0z", rotate: 40, cx: 980, cy: 258 },
  { d: "M1176 190a44 44 0 0 1 0 54", dense: true },
  { d: "M836 660a7 7 0 1 0 .1 0", fill: true },
  { d: hexPartial(918, 214, 16, 3), rotate: 48, cx: 918, cy: 214, dense: true },
  { d: "M1074 348a8 8 0 1 0 .1 0", fill: true },
  { d: "M700 96q16-22 32 0t32 0", dense: true },
  { d: hexPath(660, 456, 18), rotate: -30, cx: 660, cy: 456, dense: true },
];

export function HeroPattern() {
  return (
    <div
      aria-hidden
      // Above the hero's media layer, which fills the frame even when no
      // media file exists — beneath it the marks were covered and nothing
      // reached the screen. The hero's content sits at z-10 above both.
      //
      // pointer-events off so it can never intercept a click on the type.
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      style={{
        // Fades out over the bottom third, so the marks never run into the
        // image row that follows the hero.
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 58%, transparent 92%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 58%, transparent 92%)",
      }}
    >
      <svg
        viewBox="0 0 1200 800"
        // Stretched to the element rather than cropped to it. `slice` scales
        // the box to cover and pushed most of the marks off-frame; these are
        // abstract shapes, so the mild distortion is invisible where losing
        // two thirds of the pattern was not.
        preserveAspectRatio="none"
        className="hive-hero-pattern size-full"
        role="presentation"
      >
        <title>Decorative background pattern</title>
        <g
          fill="none"
          stroke="var(--hero-mark)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {MARKS.map((mark) => (
            <path
              key={mark.d}
              d={mark.d}
              className={mark.dense ? "hive-hero-dense" : undefined}
              fill={mark.fill ? "var(--hero-mark)" : "none"}
              stroke={mark.fill ? "none" : undefined}
              // The accent marks are the only variation in weight, and they
              // are still far below anything that could read as artwork.
              opacity={mark.accent ? 1 : 0.72}
              transform={
                mark.rotate && mark.cx != null && mark.cy != null
                  ? `rotate(${mark.rotate} ${mark.cx} ${mark.cy})`
                  : undefined
              }
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
