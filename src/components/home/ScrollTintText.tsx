"use client";

import { useEffect, useRef } from "react";

/**
 * Body copy that warms from grey to honey as it passes up the viewport.
 *
 * The narrative paragraphs are the quietest thing on the page — small, grey,
 * and set beneath a much louder statement. Tinting them on scroll gives that
 * block a reason to be read: the colour arrives with the reader rather than
 * being applied to the whole passage at once, so the eye follows the change
 * down the column.
 *
 * The tint is per line, not per paragraph. A whole paragraph changing colour
 * at a single threshold reads as a state flip; interpolating each line against
 * its own position in the viewport is what makes it feel like the words are
 * being lit as they are reached.
 *
 * Lines are found by splitting the text into words and measuring where the
 * browser actually broke them, so the effect follows the real wrap at any
 * width rather than a guess about where lines fall.
 */

/** Where in the viewport a line reaches full tint, as a share of the height. */
const FULL_AT = 0.42;

/** Where the tint begins, lower down the screen. */
const START_AT = 0.86;

export function ScrollTintText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Wrap every word so each can be measured and tinted. Done here rather
    // than in the markup so the copy stays plain prose in the source.
    const paragraphs = [...host.querySelectorAll("p")];
    const words: HTMLElement[] = [];

    for (const paragraph of paragraphs) {
      const text = paragraph.textContent ?? "";
      paragraph.textContent = "";
      for (const [index, word] of text.split(/\s+/).filter(Boolean).entries()) {
        if (index > 0) paragraph.append(" ");
        const span = document.createElement("span");
        span.textContent = word;
        // Inherit everything; this element exists only to be measured.
        span.style.transition = "color 220ms linear";
        paragraph.append(span);
        words.push(span);
      }
    }

    if (reduced) {
      // No scrub: the passage simply sits at its resting colour.
      for (const word of words) word.style.color = "";
      return;
    }

    let frame = 0;

    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      const start = vh * START_AT;
      const full = vh * FULL_AT;

      for (const word of words) {
        const { top } = word.getBoundingClientRect();
        // 0 while the word is below the start line, 1 once it has risen past
        // the full line — clamped, so words above stay lit rather than
        // reversing as they leave the top of the screen.
        const progress = Math.min(Math.max((start - top) / (start - full), 0), 1);
        word.style.color =
          progress <= 0
            ? "var(--tint-from)"
            : progress >= 1
              ? "var(--tint-to)"
              : `color-mix(in oklab, var(--tint-to) ${(progress * 100).toFixed(1)}%, var(--tint-from))`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        // The two ends of the ramp, as variables so the markup owns the
        // palette and this component only owns the timing.
        ["--tint-from" as string]: "color-mix(in oklab, var(--color-ink) 55%, transparent)",
        ["--tint-to" as string]: "var(--color-honey)",
      }}
    >
      {children}
    </div>
  );
}
