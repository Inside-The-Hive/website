"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * The testimonials as handwritten letters on unrolled scrolls.
 *
 * Same scroll-scrubbed pinned mechanic as the quote stack it replaces — the
 * section pins and a fractional playhead drives the sequence — but each
 * testimonial is now a sheet of parchment rather than a card. The playhead
 * unrolls the next letter as it pushes the current one away.
 *
 * The type is set the way a letter actually is, in two hands: a flourished
 * script for the salutation and the signature, a period serif for the body. A
 * paragraph set entirely in the flourished hand is decoration, not writing, and
 * these quotes exist to be read.
 *
 * Everything here is drawn in CSS — the curl, the aging, the deckled edge. No
 * paper texture image, so there is nothing to download and it stays sharp at
 * any size.
 */

/** Viewport-heights of scroll spent on each letter. */
const SCROLL_PER_LETTER = 0.9;

/** Viewport-heights held before the sequence starts advancing. */
const HOLD_VH = 0.5;

/**
 * Curled height at the top and bottom of the sheet, in rem.
 *
 * The curl is what makes the sheet read as unrolled rather than as a rectangle
 * of beige. Both ends carry one, because a scroll held open is under tension at
 * both ends.
 */
const CURL = 2.4;

/** Salutations, cycled so consecutive letters do not open identically. */
const SALUTATIONS = [
  "Dearest Reader,",
  "To whom it may concern,",
  "My Dear Friend,",
  "Gentle Reader,",
  "To the Hive,",
  "Most Esteemed,",
];

export function LetterScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [playhead, setPlayhead] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const holdShare =
        HOLD_VH / (HOLD_VH + SCROLL_PER_LETTER * testimonials.length);
      const advanced = Math.max(progress - holdShare, 0) / (1 - holdShare);
      setPlayhead(advanced * (testimonials.length - 1));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const current = Math.round(playhead);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="letter-scroll-heading"
      data-nav-invert
      className="relative bg-ink text-white"
      style={{
        height: `${(HOLD_VH + SCROLL_PER_LETTER * testimonials.length + 0.5) * 100}vh`,
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="u-gutter">
          <div className="mb-[clamp(1.5rem,4vh,2.5rem)] flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="letter-scroll-heading"
              className="text-(length:--text-h2) font-normal"
            >
              What they <span className="font-script">say</span>
            </h2>
            <p className="u-label text-white/50">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </p>
          </div>

          {/* Portrait, because a letter is. The width is driven off the
              available height rather than set independently, so the sheet keeps
              its proportion instead of going landscape on a short window. */}
          <div className="relative mx-auto h-[min(64vh,36rem)] w-full max-w-[min(90vw,29rem)]">
            {testimonials.map((item, index) => {
              const offset = index - playhead;
              if (offset < -1 || offset > 2) return null;

              const leaving = offset < 0;
              const depth = Math.max(offset, 0);

              return (
                <article
                  key={item.name + item.role}
                  aria-hidden={index !== current}
                  className="absolute inset-0"
                  style={{
                    zIndex: testimonials.length - index,
                    transform: leaving
                      ? `translateY(${offset * 16}%) scale(${1 + -offset * 0.1})`
                      : `translateY(${depth * -5}%) scale(${1 - depth * 0.05})`,
                    opacity: leaving
                      ? Math.max(1 + offset * 1.6, 0)
                      : depth > 1.6
                        ? 0
                        : 1 - depth * 0.4,
                    filter: leaving ? "none" : `blur(${depth * 2}px)`,
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {/* The sheet. Padded top and bottom by the curl height so the
                      writing never runs under a curled edge. */}
                  <div
                    className="relative flex h-full flex-col justify-center overflow-hidden px-[clamp(1.5rem,5vw,4.5rem)]"
                    style={{
                      paddingTop: `${CURL}rem`,
                      paddingBottom: `${CURL}rem`,
                      // Aged paper is never one flat tone. Two soft radial
                      // pools darken opposite corners, and the linear base
                      // carries a slight warm gradient down the sheet.
                      background: `
                        radial-gradient(120% 80% at 8% 0%, rgba(160,120,58,0.16), transparent 55%),
                        radial-gradient(120% 80% at 92% 100%, rgba(160,120,58,0.2), transparent 55%),
                        linear-gradient(175deg, var(--color-parchment) 0%, #efe2c9 48%, var(--color-parchment) 100%)
                      `,
                      // Deep shadow under the sheet, plus a tight inner shadow
                      // at the edges so the paper looks like it has thickness.
                      boxShadow: `
                        0 24px 60px -20px rgba(0,0,0,0.75),
                        0 4px 12px rgba(0,0,0,0.4),
                        inset 0 0 46px rgba(140,102,45,0.22)
                      `,
                    }}
                  >
                    {/* The two curled ends. Each is a strip of the darker
                        parchment tone with a gradient running into the sheet,
                        which is what sells it as paper rolling away from the
                        reader rather than as a printed band. */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0"
                      style={{
                        height: `${CURL}rem`,
                        // A roll is read from three bands, not one: the lit
                        // ridge where the paper turns toward the light, the
                        // shaded underside behind it, and the shadow the roll
                        // casts down onto the flat sheet.
                        background: `linear-gradient(to bottom,
                          #b99f70 0%,
                          #d9c49a 14%,
                          #f7efdd 34%,
                          #e6d5b2 52%,
                          rgba(150,116,60,0.35) 74%,
                          transparent 100%)`,
                        borderRadius: "0 0 40% 40% / 0 0 1.4rem 1.4rem",
                        boxShadow:
                          "inset 0 2px 3px rgba(255,248,232,0.75), 0 6px 10px -6px rgba(70,48,16,0.55)",
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0"
                      style={{
                        height: `${CURL}rem`,
                        background: `linear-gradient(to top,
                          #b99f70 0%,
                          #d9c49a 14%,
                          #f7efdd 34%,
                          #e6d5b2 52%,
                          rgba(150,116,60,0.35) 74%,
                          transparent 100%)`,
                        borderRadius: "40% 40% 0 0 / 1.4rem 1.4rem 0 0",
                        boxShadow:
                          "inset 0 -2px 3px rgba(255,248,232,0.75), 0 -6px 10px -6px rgba(70,48,16,0.55)",
                      }}
                    />

                    {/* Salutation, in the flourished hand. */}
                    <p
                      className="font-hand text-[clamp(1.75rem,3.6vw,2.9rem)] leading-none"
                      style={{ color: "var(--color-iron-gall)" }}
                    >
                      {SALUTATIONS[index % SALUTATIONS.length]}
                    </p>

                    {/* The letter itself, in the plain hand so it reads.
                        Italic, because a letter is written rather than set. */}
                    <p
                      className="font-letter mt-[clamp(0.75rem,2vh,1.35rem)] text-[clamp(1rem,1.35vw,1.3rem)] leading-[1.65] italic"
                      style={{ color: "var(--color-iron-gall)" }}
                    >
                      {item.quote}
                    </p>

                    {/* Signature block, right-aligned the way a letter signs
                        off. The rule above it is the flourish under the sign
                        off, not a divider. */}
                    <div className="mt-[clamp(1rem,3vh,2rem)] flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p
                          className="font-letter text-[clamp(0.7rem,1.1vw,0.85rem)] tracking-wide"
                          style={{ color: "rgba(46,33,19,0.6)" }}
                        >
                          {item.role}
                        </p>
                        <p
                          className="font-hand mt-1 text-[clamp(2rem,4.4vw,3.4rem)] leading-none"
                          style={{ color: "var(--color-iron-gall)" }}
                        >
                          {item.name}
                        </p>
                      </div>

                      {/* The wax seal, with the hive's own hexagon struck into
                          it. The emblem is drawn rather than photographed so it
                          takes the same lighting as the wax around it: lit from
                          the top left, with the impression itself picked out by
                          a dark inset and a highlight on its lower edge, which
                          is what makes it read as pressed in rather than
                          printed on. */}
                      <div
                        aria-hidden
                        className="relative grid size-[clamp(3.25rem,6vw,4.5rem)] shrink-0 place-items-center rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 32% 26%, #e05a18 0%, #b83a08 42%, #7d2405 100%)",
                          boxShadow: `
                            0 4px 10px rgba(60,20,4,0.55),
                            inset 0 -4px 9px rgba(0,0,0,0.45),
                            inset 0 3px 7px rgba(255,196,156,0.4)
                          `,
                          // Wax squeezes out unevenly under the stamp, so the
                          // rim is not a clean circle.
                          borderRadius: "48% 52% 51% 49% / 50% 48% 52% 50%",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-[55%]"
                          fill="none"
                          stroke="rgba(60,18,2,0.55)"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                          style={{
                            filter:
                              "drop-shadow(0 1px 0 rgba(255,190,150,0.28))",
                          }}
                        >
                          <path d="M12 2.6 20.1 7.3v9.4L12 21.4 3.9 16.7V7.3z" />
                          <path d="M12 8.2 16 10.5v4.6L12 17.4 8 15.1v-4.6z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-[clamp(1.25rem,3vh,2rem)] h-px w-full max-w-[46rem] bg-white/15">
            <div
              className="h-px bg-honey"
              style={{
                width: `${(playhead / Math.max(testimonials.length - 1, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
