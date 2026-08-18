"use client";

import { useEffect, useRef } from "react";

/**
 * The reel — a scroll-scrubbed zoom (the Apple-style "expand on scroll").
 *
 * The video's scale is keyed to where it sits in the viewport: it arrives
 * already large, swells to fill the full screen as its centre crosses the
 * viewport's centre, and shrinks again as the reader scrolls on — in either
 * direction, because the driver is position, not scroll direction. Nothing
 * pins; the video travels with the page the whole way.
 *
 * The element's base box is the full viewport and only `transform: scale()`
 * changes, so the scrub never touches layout — it is one composited property
 * per frame, the same discipline the gallery's camera keeps.
 */

/** The reel at its smallest, as a share of the full viewport. */
const MIN_SCALE = 0.72;

/** Corner radius at the smallest scale, in px. Grows to 0 at full bleed. */
const MAX_RADIUS = 28;

const CLIP = { src: "/videos/ITH.mp4" };

export function ShowReel() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // No scrub: the reel simply sits at its resting size.
      frame.style.transform = `scale(${MIN_SCALE})`;
      frame.style.borderRadius = `${MAX_RADIUS}px`;
      return;
    }

    let raf = 0;

    const read = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;

      // How far the element's centre sits from the viewport's centre, as a
      // share of the distance at which it is fully off screen. 0 at dead
      // centre, 1 when the element has left entirely — symmetric, so the
      // zoom breathes the same way scrolling up as scrolling down.
      const centre = rect.top + rect.height / 2 - vh / 2;
      const span = (vh + rect.height) / 2;
      const away = Math.min(Math.abs(centre) / span, 1);

      // Ease the approach so the last stretch into full bleed is gentle
      // rather than linear — the swell reads as arriving, not snapping.
      const t = 1 - away * away;

      const scale = MIN_SCALE + (1 - MIN_SCALE) * t;
      frame.style.transform = `scale(${scale.toFixed(4)})`;
      frame.style.borderRadius = `${(MAX_RADIUS * (1 - t)).toFixed(1)}px`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The clip only needs to run while it is on screen; eighteen seconds of
  // decode is not worth paying while the reader is three sections away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-label="Showreel" className="overflow-x-clip">
      {/* The outer box reserves one viewport of height in the flow; the frame
          inside it is what scales. Base size is the full viewport so full
          bleed is scale(1) — scaling up past 1 would soften the video. */}
      <div className="flex h-svh items-center justify-center">
        <div
          ref={frameRef}
          data-nav-invert
          className="size-full overflow-hidden bg-ink will-change-transform"
          style={{ transform: `scale(${MIN_SCALE})`, borderRadius: `${MAX_RADIUS}px` }}
        >
          <video
            ref={videoRef}
            className="size-full object-cover"
            src={CLIP.src}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            tabIndex={-1}
          />
        </div>
      </div>
    </section>
  );
}
