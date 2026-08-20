/**
 * The doodle texture, as a tiled background layer.
 *
 * The client's own line-work artwork, used behind the hero and the gallery
 * canvas. Shared rather than repeated so the two never drift apart — the
 * opacity and tile size are the whole treatment, and both are easy to get
 * subtly wrong in a copy.
 *
 * Two things tame the source. It is solid black at close to full density, so
 * the layer sits very low: at 7% the darkest the ground reaches is about
 * #ededed, which leaves ink type over it at roughly 17:1. And it is tiled
 * rather than stretched, because the artwork is portrait (736x977) and the
 * surfaces it sits behind are landscape — fitting one to the other would
 * distort every mark.
 *
 * Tile size is held near the source's own width. Drawn much smaller, every
 * mark shrinks with it and the field reads far denser than the artwork
 * actually is.
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
        backgroundImage: "url(/hero-doodle.webp)",
        backgroundRepeat: "repeat",
        backgroundSize: "clamp(340px, 38vw, 620px) auto",
      }}
    />
  );
}
