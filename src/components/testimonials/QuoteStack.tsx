"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Concept 2 — the scroll-scrubbed quote stack.
 *
 * The same motion language as the featured-events sequence, applied to words
 * instead of footage: the section pins, and scrolling drives a fractional
 * playhead rather than jumping card to card. Cards sit in depth — the front one
 * sharp and legible, the ones behind scaled down, blurred and dimmed — and the
 * playhead pushes the front card away to bring the next forward.
 *
 * The argument for this one is coherence. A visitor who has already scrolled
 * through the events sequence recognises the behaviour immediately, so the site
 * reads as one designed thing rather than a set of separately-styled sections.
 */

/** Viewport-heights of scroll spent on each card. */
const SCROLL_PER_CARD = 0.85;

/** Viewport-heights held at the start before the stack begins advancing. */
const HOLD_VH = 0.5;

/** How many cards behind the front one stay rendered in the depth stack. */
const VISIBLE_BEHIND = 3;

export function QuoteStack() {
  const sectionRef = useRef<HTMLElement>(null);
  /** Fractional position through the stack. 1.5 is halfway from card 1 to 2. */
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

      // How far into the pinned run we are, 0 to 1.
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      // The hold at the front is scroll that advances nothing, so the first
      // card is readable before it starts moving.
      const holdShare = HOLD_VH / (HOLD_VH + SCROLL_PER_CARD * testimonials.length);
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
      aria-labelledby="quote-stack-heading"
      data-nav-invert
      className="relative bg-ink text-white"
      style={{
        // The section is tall; the inner panel pins inside it. Height is what
        // buys the scroll distance the playhead reads from.
        height: `${(HOLD_VH + SCROLL_PER_CARD * testimonials.length + 0.5) * 100}vh`,
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="u-gutter">
          <div className="mb-[clamp(2rem,5vh,3.5rem)] flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="quote-stack-heading"
              className="text-(length:--text-h2) font-normal"
            >
              What they <span className="font-script">say</span>
            </h2>
            <p className="u-label text-white/50">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </p>
          </div>

          {/* The stack. Fixed height so the cards have a shared centre to
              rotate around — with auto height the box would resize per card and
              the depth effect would jitter. */}
          <div className="relative mx-auto h-[min(60vh,30rem)] w-full max-w-[52rem]">
            {testimonials.map((item, index) => {
              // Distance from the playhead, signed. Negative means the card has
              // already been pushed away; positive means it is still behind.
              const offset = index - playhead;

              if (offset < -1 || offset > VISIBLE_BEHIND) return null;

              // Cards ahead of the playhead recede into depth. The one being
              // pushed away (negative offset) flies toward the viewer and
              // fades, which reads as it being discarded rather than reversed.
              const leaving = offset < 0;
              const depth = Math.max(offset, 0);

              return (
                <article
                  key={item.name + item.role}
                  aria-hidden={index !== current}
                  className="absolute inset-0 flex flex-col justify-center border border-white/12 bg-white/[0.04] p-[clamp(1.5rem,4vw,3.5rem)] backdrop-blur-sm"
                  style={{
                    zIndex: testimonials.length - index,
                    // translateY pushes receding cards up so the stack fans
                    // out; scale and blur carry the actual depth.
                    transform: leaving
                      ? `translateY(${offset * 18}%) scale(${1 + -offset * 0.12})`
                      : `translateY(${depth * -6}%) scale(${1 - depth * 0.06})`,
                    opacity: leaving ? Math.max(1 + offset * 1.6, 0) : depth > 2 ? 0 : 1 - depth * 0.28,
                    filter: leaving ? "none" : `blur(${depth * 2.4}px)`,
                    // No CSS transition: the playhead already animates this
                    // frame by frame. A transition on top would lag the scroll.
                    willChange: "transform, opacity, filter",
                  }}
                >
                  <p className="text-[clamp(1.35rem,3.2vw,2.6rem)] leading-[1.15] font-normal text-balance">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="mt-[clamp(1.5rem,3vh,2.5rem)] flex items-center gap-4">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-honey">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-items-center font-display font-extrabold text-ink">
                          {item.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p
                        className={
                          item.isPerson
                            ? "font-script text-[1.6rem] leading-none"
                            : "text-[1.1rem] leading-none font-medium"
                        }
                      >
                        {item.name}
                      </p>
                      <p className="u-label mt-1 text-white/50">{item.role}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Progress track. Continuous rather than stepped, because the
              playhead is continuous — a stepped bar would misreport where the
              reader actually is between two cards. */}
          <div className="mx-auto mt-[clamp(1.5rem,4vh,2.5rem)] h-px w-full max-w-[52rem] bg-white/15">
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
