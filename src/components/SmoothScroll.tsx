"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Lenis smooth scroll.
 *
 * Disables itself entirely under `prefers-reduced-motion: reduce` — no
 * instance is created at all, so native scrolling is untouched.
 *
 * Exposes scroll progress (0–1) so ScrollProgress can consume it without a
 * second scroll listener.
 */

const ScrollProgressContext = createContext(0);

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Let the browser handle touch scrolling natively; smoothing it fights
      // platform momentum and feels wrong on mobile.
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress: p }: { progress: number }) => {
      setProgress(p);
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    /**
     * In-page anchors. Lenis owns scroll position, so the browser's native
     * anchor jump would be overridden and the link would appear dead.
     */
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
      // Keep the URL and focus behaviour a native anchor would have given.
      history.pushState(null, "", id);
      (target as HTMLElement).focus?.({ preventScroll: true });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * App Router route changes must reset scroll to the top. Next's own scroll
   * restoration does not know about Lenis's internal position, so without this
   * a new route opens mid-page. This is the standard Lenis + App Router bug.
   */
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    setProgress(0);
  }, [pathname]);

  return (
    <ScrollProgressContext.Provider value={progress}>
      {children}
    </ScrollProgressContext.Provider>
  );
}
