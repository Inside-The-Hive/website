"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site";

/**
 * Counters that roll up from zero the first time the section enters the
 * viewport, then stop. Counting on load would mean the animation is over before
 * anyone scrolls to it, and re-counting on every re-entry turns a detail into a
 * distraction.
 *
 * Figures are large and light rather than large and bold — at this size weight
 * 800 reads as shouting, and the numbers are already the loudest thing in the
 * section by virtue of their size.
 *
 * Under reduced motion the final value is simply present. Where a figure is
 * still null the slot renders a honey placeholder, matching how the rest of the
 * site holds space for pending data rather than inventing it.
 */

const DURATION_MS = 1600;

/**
 * Ease-out cubic. The count decelerates into its final value instead of
 * stopping dead, which is what makes it read as settling rather than as a
 * number field being written.
 */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number | null, start: boolean, reduced: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null || !start) return;

    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, reduced]);

  return value;
}

function Stat({
  stat,
  start,
  reduced,
}: {
  stat: (typeof stats)[number];
  start: boolean;
  reduced: boolean;
}) {
  const value = useCountUp(stat.value, start, reduced);

  return (
    <div className="u-rule border-t pt-6">
      <dd className="font-display text-(length:--text-h1) leading-[0.85] font-normal tracking-[-0.04em] text-ink tabular-nums">
        {stat.value === null ? (
          // No invented statistics. A honey underscore holds the slot until the
          // real figure arrives — it reads as a blank waiting to be filled, not
          // as a broken value.
          <span className="inline-block h-[0.12em] w-[0.55em] translate-y-[-0.28em] bg-honey" />
        ) : (
          <>
            {value.toLocaleString("en-US")}
            {stat.suffix}
          </>
        )}
      </dd>
      <dt className="u-label mt-4 text-ink/55">{stat.label}</dt>
    </div>
  );
}

export function StatCounters() {
  const sectionRef = useRef<HTMLElement>(null);
  const [start, setStart] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Older Safari and any environment without IntersectionObserver still needs
    // to see the numbers, so fall back to showing them straight away.
    if (typeof IntersectionObserver === "undefined") {
      setStart(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStart(true);
        // Once is the whole point — disconnect so scrolling back up does not
        // replay it.
        observer.disconnect();
      },
      // A little of the section has to actually be on screen, so the count is
      // not already finished by the time it is properly in view.
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const allPending = stats.every((stat) => stat.value === null);

  return (
    <section ref={sectionRef} className="u-section text-ink">
      <div className="u-gutter">
        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <Stat
              key={stat.label}
              stat={stat}
              start={start}
              reduced={reduced}
            />
          ))}
        </dl>

        {allPending && (
          <p className="u-label mt-10 text-ink/40">
            Figures pending — see content/site.ts
          </p>
        )}
      </div>
    </section>
  );
}
