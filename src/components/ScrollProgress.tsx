"use client";

import { useEffect, useState } from "react";
import { useScrollProgress } from "./SmoothScroll";

/**
 * 2px honey line pinned to the top of the viewport. Pairs with the hive ID
 * chip: together they read as "this is an indexed archive you are moving
 * through".
 *
 * Consumes progress from SmoothScroll when Lenis is running. Under reduced
 * motion Lenis never starts, so this falls back to a passive scroll listener —
 * the bar still works, it just does not animate.
 */

export function ScrollProgress() {
  const lenisProgress = useScrollProgress();
  const [fallback, setFallback] = useState<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!query.matches) return;

    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      setFallback(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = fallback ?? lenisProgress;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden>
      <div
        className="h-full origin-left bg-honey"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
