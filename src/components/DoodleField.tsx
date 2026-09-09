/**
 * The doodle texture, as a tiled background layer.
 *
 * The client's own line-work artwork, used behind the hero and the gallery
 * canvas. Shared rather than repeated so the two never drift apart — the
 * opacity and tile size are the whole treatment, and both are easy to get
 * subtly wrong in a copy.
 *
 * The artwork is landscape (1448x1086), close enough to the shape of the
 * surfaces it sits behind that one tile covers most of a screen on its own —
 * the portrait source it replaces had to repeat several times across a wide
 * hero, and every seam was a visible break in the field.
 *
 * It is still `repeat` rather than `cover`, because `cover` would scale the
 * tile to the tallest surface and blow the marks up on a phone. Tiling at a
 * fixed width keeps every mark the same size everywhere and simply repeats
 * further down a long page.
 *
 * The source is solid black line work, so the layer sits very low: at 7% the
 * darkest the ground reaches is about #ededed, leaving ink type over it at
 * roughly 17:1.
 */
export function DoodleField({
  /** Stacking order within the parent. Callers own their own layering. */
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.07] ${className}`}
      style={{
        backgroundImage: "url(/doodle-field.webp)",
        backgroundRepeat: "repeat",
        // Near the artwork's own proportions at each end of the range: one
        // tile spans a phone and about two-thirds of a desktop hero, so the
        // marks read at their drawn size rather than shrunk into a denser
        // field.
        backgroundSize: "clamp(560px, 82vw, 1400px) auto",
      }}
    />
  );
}
