"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Concept 5 — the stage.
 *
 * One quote at full size, a row of faces beneath it. Selecting a face scrambles
 * the quote through a run of random glyphs and resolves it into the new one,
 * while the portrait cross-fades.
 *
 * The scramble is doing real work rather than decoration: a plain cross-fade
 * between two blocks of text at this size reads as a glitch, because the eye
 * cannot track which words changed. Resolving character by character gives the
 * change a direction, so the new quote arrives as an event.
 *
 * This is the most confident of the six and the least busy, but it shows one
 * testimonial at a time — it sells the quality of a quote rather than the
 * volume of them.
 */

/** Glyphs the scramble draws from while a character is unresolved. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\*<>[]{}#%&";

/** Ms between scramble frames. */
const TICK = 28;

/** Frames a character stays scrambled before locking, per index. */
const LOCK_RATE = 0.55;

export function StageQuote() {
  const [index, setIndex] = useState(0);
  const [rendered, setRendered] = useState(testimonials[0].quote);
  const frameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /**
   * Seeded per transition rather than per frame: `Math.random` inside the tick
   * would reshuffle every unresolved character on every frame *and* re-roll its
   * lock time, so nothing would ever settle predictably.
   */
  const seedsRef = useRef<number[]>([]);

  useEffect(() => {
    const target = testimonials[index].quote;
    // A fresh reveal order for each transition, so the resolve does not sweep
    // strictly left to right every time.
    seedsRef.current = Array.from(
      { length: target.length },
      (_, i) => i * LOCK_RATE + Math.random() * 8,
    );

    let frame = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      frame += 1;
      frameRef.current = frame;

      let settled = true;
      const next = target
        .split("")
        .map((char, i) => {
          // Whitespace never scrambles — it is what preserves the shape of the
          // paragraph while the glyphs churn.
          if (char === " " || char === "\n") return char;
          if (frame >= seedsRef.current[i]) return char;
          settled = false;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setRendered(next);

      if (settled && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, TICK);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index]);

  const active = testimonials[index];

  return (
    <section
      aria-labelledby="stage-quote-heading"
      data-nav-invert
      className="u-section bg-ink text-white"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="stage-quote-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What they <span className="font-script">say</span>
          </h2>
          <p className="u-label text-white/50">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

        {/* min-height holds the block steady across quotes of different lengths
            — without it the faces below jump every time the quote changes. */}
        <blockquote className="mx-auto min-h-[clamp(14rem,32vh,22rem)] max-w-[52rem] text-center">
          {/* aria-live announces the resolved quote to a screen reader; the
              scrambling text itself is never what gets read out, because the
              live region only fires when the value settles. */}
          <p
            aria-live="polite"
            className="text-[clamp(1.4rem,3.4vw,2.9rem)] leading-[1.15] font-normal text-balance"
          >
            &ldquo;{rendered}&rdquo;
          </p>
        </blockquote>

        <div className="mt-[clamp(2rem,5vh,3rem)] text-center">
          <p
            className={
              active.isPerson
                ? "font-script text-[clamp(2rem,4vw,3rem)] leading-none text-honey"
                : "text-[clamp(1.25rem,2.2vw,1.75rem)] leading-none font-medium text-honey"
            }
          >
            {active.name}
          </p>
          <p className="u-label mt-3 text-white/55">{active.role}</p>
        </div>

        {/* The face row. Buttons, not a listbox — each is an independent
            control and the selected one is marked with aria-current. */}
        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-center justify-center gap-4">
          {testimonials.map((item, i) => {
            const selected = i === index;
            return (
              <button
                key={item.name + item.role}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={selected ? "true" : undefined}
                aria-label={`${item.name}, ${item.role}`}
                className="relative size-[clamp(3rem,5vw,4.25rem)] shrink-0 overflow-hidden rounded-full bg-honey transition-[scale,opacity] duration-(--dur-base) ease-(--ease-out-expo) hover:opacity-100"
                style={{
                  scale: selected ? "1.12" : "1",
                  opacity: selected ? 1 : 0.4,
                  outline: selected ? "2px solid var(--color-honey)" : "none",
                  outlineOffset: "3px",
                }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="68px"
                    className="object-cover transition-[filter] duration-(--dur-base)"
                    style={{ filter: selected ? "none" : "grayscale(1)" }}
                  />
                ) : (
                  <span className="grid size-full place-items-center font-display font-extrabold text-ink">
                    {item.name.charAt(0)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
