"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Testimonials as portrait cards: the person on the left at full bleed, and
 * what they said on a panel of dark glass over the right of their own photo.
 *
 * Always open — there is nothing to expand and nothing to dismiss. The card is
 * the content rather than a trigger for it, so the quote is readable the moment
 * it enters the frame.
 *
 * The panel sits *over* the photograph rather than beside it. A side-by-side
 * split would read as two things placed next to each other; the overlap makes
 * the words belong to the face they are covering, and the gradient that fades
 * the glass out to the left is what keeps the subject clear of the type.
 *
 * One card is shown at a time and advanced by the counter beneath it. The row
 * of thumbnails doubles as the control, so the choice is always a face rather
 * than a dot.
 */

/** Ms between automatic advances. Long, because these take time to read. */
const DWELL = 9000;

export function PortraitPanel() {
  const [index, setIndex] = useState(0);
  /** Paused while the pointer is over the card, so a read is never cut off. */
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(
      () => setIndex((i) => (i + 1) % testimonials.length),
      DWELL,
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  return (
    <section
      aria-labelledby="portrait-panel-heading"
      data-nav-invert
      className="u-section bg-ink text-white"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="portrait-panel-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What they <span className="font-script">say</span>
          </h2>
          <p className="u-label text-white/50">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

        {/* Capped well short of the gutter. The reference runs nearly edge to
            edge, which pushes the quote's measure past what is comfortable to
            read — at this width the line length stays in range. */}
        <div
          className="relative mx-auto w-full max-w-[64rem]"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink md:aspect-[16/8]">
            {testimonials.map((item, i) => {
              const active = i === index;

              return (
                <figure
                  key={item.name + item.role}
                  aria-hidden={!active}
                  className="absolute inset-0 transition-opacity duration-(--dur-slow) ease-(--ease-out-expo)"
                  style={{
                    opacity: active ? 1 : 0,
                    // Inert while hidden, so a keyboard tab never lands inside
                    // a card the reader cannot see.
                    pointerEvents: active ? "auto" : "none",
                  }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 64rem, 100vw"
                      className="object-cover object-center"
                      // Held slightly larger and drifting while active, so a
                      // still photograph does not sit completely dead.
                      style={{
                        scale: active ? "1.04" : "1",
                        transition: "scale 9s linear",
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-propolis to-ink" />
                  )}

                  {/* The glass. Fades out to the left so it never cuts a hard
                      vertical edge down the middle of the subject's face. */}
                  <div
                    className="absolute inset-y-0 right-0 flex w-full flex-col justify-center p-[clamp(1.5rem,4vw,3.5rem)] backdrop-blur-md md:w-[58%] md:p-[clamp(2rem,3.5vw,3.5rem)]"
                    style={{
                      background: `linear-gradient(to right,
                        rgba(10,10,10,0.35) 0%,
                        rgba(10,10,10,0.78) 26%,
                        rgba(10,10,10,0.9) 100%)`,
                      // The blur has to fade with the fill, or its edge shows
                      // as a seam where the frosted area stops.
                      maskImage:
                        "linear-gradient(to right, transparent 0%, #000 22%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, #000 22%)",
                    }}
                  >
                    <p className="u-label text-white/45">Overview</p>

                    <p className="mt-3 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none font-extrabold tracking-[-0.03em]">
                      {item.name}
                    </p>
                    <p className="mt-2 text-[clamp(0.85rem,1.1vw,1rem)] text-white/55">
                      {item.role}
                    </p>

                    <blockquote className="mt-[clamp(1.25rem,2.5vh,2rem)] text-[clamp(1rem,1.55vw,1.4rem)] leading-[1.45] text-white/95">
                      {item.quote}
                    </blockquote>

                    {/* The signature. Script here is the one place it belongs —
                        a person signing their own words. Brands get their name
                        set rather than signed, so they take the plain hand. */}
                    <p
                      className={
                        item.isPerson
                          ? "font-script mt-[clamp(1.25rem,3vh,2.25rem)] text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-white/75"
                          : "u-label mt-[clamp(1.25rem,3vh,2.25rem)] text-white/45"
                      }
                    >
                      {item.name}
                    </p>
                  </div>
                </figure>
              );
            })}
          </div>

          {/* Faces as the control. */}
          <div className="mt-[clamp(1.25rem,3vh,2rem)] flex flex-wrap items-center justify-center gap-3">
            {testimonials.map((item, i) => {
              const selected = i === index;
              return (
                <button
                  key={item.name + item.role}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={selected ? "true" : undefined}
                  aria-label={`${item.name}, ${item.role}`}
                  className="relative size-[clamp(2.5rem,4vw,3.25rem)] shrink-0 overflow-hidden rounded-full bg-propolis transition-[scale,opacity] duration-(--dur-base) ease-(--ease-out-expo)"
                  style={{
                    scale: selected ? "1.1" : "1",
                    opacity: selected ? 1 : 0.35,
                    outline: selected ? "2px solid var(--color-honey)" : "none",
                    outlineOffset: "3px",
                  }}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="52px"
                      className="object-cover"
                      style={{ filter: selected ? "none" : "grayscale(1)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
