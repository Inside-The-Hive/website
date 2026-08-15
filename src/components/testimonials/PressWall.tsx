import Image from "next/image";
import { testimonials } from "@/content/testimonials";

/**
 * Concept 4 — the press wall.
 *
 * Quotes as physical clippings pinned to a board: each at a slight angle, on
 * off-white stock, with a strip of honey tape across one corner. Hovering
 * straightens a clipping and lifts it off the board.
 *
 * The differentiator here is texture rather than motion. Every other concept in
 * this set moves; this one is a still composition that happens to respond. For
 * a media brand — something that publishes, gets quoted, gets clipped — the
 * press-cutting metaphor is a closer fit than anything animated.
 *
 * It is also the only one of the six that is a server component. No hover state
 * is tracked in JavaScript; the whole interaction is CSS, so it ships no client
 * bundle at all.
 */

/**
 * Per-clipping rotation and vertical offset, in degrees and rem.
 *
 * Hand-set rather than randomised: a random angle changes on every render and
 * cannot be reviewed, and truly random values cluster badly — two clippings at
 * the same angle beside each other look like a mistake rather than a scatter.
 */
const SCATTER = [
  { rotate: -2.4, offset: 0 },
  { rotate: 1.6, offset: 1.5 },
  { rotate: -1.1, offset: 0.4 },
  { rotate: 2.1, offset: 1.9 },
  { rotate: -1.8, offset: 0.2 },
  { rotate: 1.2, offset: 1.2 },
];

export function PressWall() {
  return (
    <section
      aria-labelledby="press-wall-heading"
      data-press-wall
      className="u-section u-rule border-t bg-ash text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="press-wall-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What they <span className="font-script">say</span>
          </h2>
          <p className="u-label max-w-sm text-ink/55">
            Partners and guests, in their own words
          </p>
        </div>

        {/* Columns rather than a grid: clippings are different heights, and a
            grid would force a shared row height and leave gaps under the short
            ones. Columns let them pack tight, which is what a real board looks
            like. */}
        <div className="columns-1 gap-[clamp(1.25rem,2.5vw,2rem)] md:columns-2 lg:columns-3">
          {testimonials.map((item, index) => {
            const { rotate, offset } = SCATTER[index % SCATTER.length];

            return (
              <figure
                key={item.name + item.role}
                className="group relative mb-[clamp(1.25rem,2.5vw,2rem)] break-inside-avoid bg-white p-[clamp(1.25rem,2.2vw,1.9rem)] shadow-[0_1px_2px_rgba(10,10,10,0.06),0_8px_24px_-12px_rgba(10,10,10,0.18)] transition-[transform,box-shadow] duration-(--dur-base) ease-(--ease-out-expo) hover:shadow-[0_2px_4px_rgba(10,10,10,0.08),0_20px_44px_-16px_rgba(10,10,10,0.28)]"
                style={{
                  // Custom property so the hover rule below can zero the
                  // rotation while keeping the offset — a plain `rotate` would
                  // need the whole transform restated.
                  rotate: `${rotate}deg`,
                  marginTop: `${offset}rem`,
                }}
              >
                {/* The tape. Rotated against the clipping so it reads as
                    applied to the board rather than printed on the paper. */}
                <span
                  aria-hidden
                  className="absolute -top-3 left-[12%] h-6 w-[5.5rem] bg-honey/85 shadow-[0_1px_3px_rgba(10,10,10,0.15)]"
                  style={{ rotate: `${-rotate * 2.2}deg` }}
                />

                <blockquote className="text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-ink/85">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-(--color-line) pt-4">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-honey">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover grayscale transition-[filter] duration-(--dur-base) group-hover:grayscale-0"
                      />
                    ) : (
                      <span className="grid size-full place-items-center font-display text-sm font-extrabold text-ink">
                        {item.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={
                        item.isPerson
                          ? "font-script text-[1.35rem] leading-none"
                          : "text-[1rem] leading-none font-medium"
                      }
                    >
                      {item.name}
                    </p>
                    <p className="u-label truncate text-ink/50">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Straightening on hover cannot be expressed in a utility class without
          restating each clipping's own rotation, so it is one rule instead.
          Scoped to this section's own attribute — a bare `.group:hover` here
          would be global and would straighten every hover group on the page. */}
      <style>{`
        @media (hover: hover) {
          [data-press-wall] figure:hover {
            rotate: 0deg !important;
            translate: 0 -0.4rem;
          }
        }
      `}</style>
    </section>
  );
}
