import { cn } from "@/lib/cn";

/**
 * An isometric extruded hexagonal cell.
 *
 * The podcast section's dimensional language comes from the honeycomb, not from
 * a 3D library. A flat-top hexagon squashed vertically by tan(30°) is a true
 * isometric projection; extruding two of its lower edges downward and shading
 * the three resulting faces at different lightnesses produces a solid prism
 * from nothing but polygons. No WebGL, no canvas, no runtime cost.
 *
 * Geometry is computed once at module scope against a 100×100 top face. The
 * squash lands every vertex on an exact quarter coordinate, which is why the
 * points below are round numbers rather than long decimals.
 *
 * The three faces read as one light source at the upper left: the top catches
 * the most light, the left wall falls into shadow, the right wall sits between
 * them. Shifting only those three lightnesses is what makes the cell appear to
 * turn under the light on hover — the geometry itself never moves.
 */

/** Depth of the extrusion, in the same user units as the 100-wide top face. */
const DEPTH = 34;

/** Flat-top hexagon, isometric. Vertices at 0°, 60° … 300°, y scaled by tan(30°). */
const TOP = "100,50 75,75 25,75 0,50 25,25 75,25";

/** Lower-right edge (vertex 0→1) dropped by DEPTH. */
const WALL_RIGHT = `100,50 75,75 75,${75 + DEPTH} 100,${50 + DEPTH}`;

/** Lower edge (vertex 1→2) dropped by DEPTH. This face reads as the front. */
const WALL_FRONT = `75,75 25,75 25,${75 + DEPTH} 75,${75 + DEPTH}`;

/** Lower-left edge (vertex 2→3) dropped by DEPTH. */
const WALL_LEFT = `25,75 0,50 0,${50 + DEPTH} 25,${75 + DEPTH}`;

const VIEW_BOX = `0 0 100 ${75 + DEPTH + 1}`;

export function HexPrism({
  className,
  /**
   * Face tones, lightest first. Defaults to a honey cell. Passing three tones
   * of a single hue is what keeps it reading as one solid under one light.
   */
  tones = ["#F0A202", "#C68402", "#8A5C01"],
  /** Lifts the cell on parent hover, as if the light source swung across it. */
  interactive = false,
}: {
  className?: string;
  tones?: [string, string, string];
  interactive?: boolean;
}) {
  const [top, right, left] = tones;

  return (
    <svg
      viewBox={VIEW_BOX}
      className={cn(
        "block h-auto w-full",
        // The whole solid lifts, never the top face alone — moving one plane
        // independently tears a notch open along the wall seam.
        interactive &&
          "transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:-translate-y-[2.5%]",
        className,
      )}
      aria-hidden
      focusable="false"
    >
      {/* Walls first so the top face overlaps their upper edges cleanly and no
          seam shows between the three planes. */}
      <polygon points={WALL_LEFT} fill={left} />
      <polygon points={WALL_FRONT} fill={left} />
      <polygon points={WALL_RIGHT} fill={right} />
      <polygon points={TOP} fill={top} />
    </svg>
  );
}
