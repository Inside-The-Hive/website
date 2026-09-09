"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Concept 6 — the spotlight grid.
 *
 * Every quote is on the page at once but nearly invisible. The cursor drags a
 * soft light across the wall, and whatever falls inside the beam resolves to
 * full contrast. Reading the section is hunting through it.
 *
 * The lighting is done with a CSS mask driven by a single custom property pair,
 * not by measuring each card against the pointer: one `radial-gradient` mask on
 * a duplicated bright layer means the beam costs two composited layers total
 * regardless of how many quotes are on the wall, and the falloff is a real
 * gradient rather than a per-card opacity step.
 *
 * Touch has no cursor, so there is nothing to drag a beam with. Below the hover
 * breakpoint the bright layer is simply shown in full — the section degrades to
 * a plain legible grid rather than to an unreadable one.
 */

/** Beam radius in px. Wide enough to catch two cards, so the reader gets context. */
const RADIUS = 260;

/** Easing applied to the beam's chase, per frame. Lower drags more. */
const FOLLOW = 0.16;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function Wall({ bright }: { bright?: boolean }) {
  return (
    <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item) => (
        <figure
          key={item.name + item.role}
          className="flex flex-col justify-between gap-6 bg-ink p-[clamp(1.5rem,2.5vw,2.25rem)]"
        >
          <blockquote
            className={
              bright
                ? "text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-white"
                : "text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-white/[0.08]"
            }
          >
            &ldquo;{item.quote}&rdquo;
          </blockquote>
          <figcaption>
            <p
              className={[
                item.isPerson
                  ? "font-script text-[1.5rem]"
                  : "text-[1.05rem] font-medium",
                "leading-none",
                bright ? (item.isPerson ? "text-honey" : "text-white") : "text-white/10",
              ].join(" ")}
            >
              {item.name}
            </p>
            <p
              className={
                bright ? "u-label mt-2 text-white/60" : "u-label mt-2 text-white/10"
              }
            >
              {item.role}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function SpotlightGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const [hasPointer, setHasPointer] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // A coarse pointer gets the fully-lit fallback. Checked here rather than in
    // CSS because the bright layer's mask has to be dropped entirely, not
    // merely restyled.
    setHasPointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!hasPointer || reduced) return;

    const section = sectionRef.current;
    const beam = beamRef.current;
    if (!section || !beam) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let seeded = false;
    let inside = false;

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      if (!seeded) {
        current.x = target.x;
        current.y = target.y;
        seeded = true;
      }
      inside = true;
    };

    const onLeave = () => {
      inside = false;
      seeded = false;
    };

    const tick = () => {
      current.x += (target.x - current.x) * FOLLOW;
      current.y += (target.y - current.y) * FOLLOW;
      // One mask, moved. The bright wall underneath never re-renders.
      const mask = `radial-gradient(${RADIUS}px circle at ${current.x}px ${current.y}px, #000 0%, rgba(0,0,0,0.85) 42%, transparent 72%)`;
      beam.style.maskImage = mask;
      beam.style.webkitMaskImage = mask;
      beam.style.opacity = inside ? "1" : "0";
      frame = requestAnimationFrame(tick);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [hasPointer, reduced]);

  const lit = !hasPointer || reduced;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="spotlight-grid-heading"
      data-nav-invert
      className="u-section relative bg-ink text-white"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="spotlight-grid-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What they <span className="font-script">say</span>
          </h2>
          <p className="u-label max-w-sm text-white/50">
            {lit ? "Partners and guests" : "Move the light to read"}
          </p>
        </div>

        <div className="relative">
          {/* Dim layer. This is the accessible copy — it holds the real text in
              the document, so the quotes are readable to a screen reader and to
              search whether or not a beam ever moves over them. */}
          <Wall />

          {/* Bright layer, masked to the beam. aria-hidden because it is a
              pixel-for-pixel duplicate of the layer above; without it every
              testimonial would be announced twice. */}
          {!lit && (
            <div
              ref={beamRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-(--dur-base)"
              style={{ willChange: "mask-image, opacity" }}
            >
              <Wall bright />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
