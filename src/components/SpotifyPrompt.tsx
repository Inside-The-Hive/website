"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { podcastPlatforms } from "@/content/site";

/**
 * The Spotify follow modal.
 *
 * Centre of the page, unlike the corner cards — this one is a real modal with
 * a backdrop, which is the client's call: the follow ask is the site's one
 * direct conversion and gets the one interruption the site permits. Everything
 * else about its manners matches the partner prompt: earned by scrolling
 * rather than shown on arrival, once per visitor, gone for good when dismissed
 * or acted on, and never shown to a reader who asked for reduced motion.
 *
 * It shares the body's `data-ith-prompt` flag with the partner prompt so the
 * two never appear at once: whichever fires first claims it, the other keeps
 * listening and takes its turn on a later scroll after the first is closed.
 *
 * Portaled to the body — inside any transformed ancestor `fixed` would pin to
 * that ancestor instead of the viewport, the same trap the mobile menu hit.
 */

const SEEN_KEY = "ith-spotify-prompt";

/** Share of the page behind the reader before this appears. */
const TRIGGER = 0.35;

const SPOTIFY =
  podcastPlatforms.find((p) => p.label === "Spotify" && p.confirmed)?.href ??
  "https://open.spotify.com/show/0wOOX8mdQUoRP1adnxV9VD";

export function SpotifyPrompt({
  cover,
  episodeTitle,
}: {
  /** Newest episode's art, passed down from the server layout. */
  cover?: string;
  episodeTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(SEEN_KEY, "1");
    delete document.body.dataset.ithPrompt;
    setOpen(false);
    returnFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(SEEN_KEY)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable < window.innerHeight * 0.5) return;
      // Another prompt holds the reader's attention — wait for a later scroll.
      if (document.body.dataset.ithPrompt) return;
      if (window.scrollY / scrollable >= TRIGGER) {
        // Claimed synchronously, before React renders anything, so two
        // prompts whose thresholds are both behind the reader cannot open in
        // the same frame.
        document.body.dataset.ithPrompt = "spotify";
        returnFocusRef.current = document.activeElement as HTMLElement;
        setOpen(true);
        window.removeEventListener("scroll", schedule);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // A modal owns the page while it is open: the scroll behind it locks (the
  // same body-overflow lock the mobile menu uses), focus moves in and is
  // trapped, Escape closes, and focus returns to whatever held it.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    cardRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = cardRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, dismiss]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-70 grid place-items-center p-4">
      {/* Backdrop. Click-away is a dismissal, same as Escape. */}
      <button
        type="button"
        aria-label="Close"
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-[2px]"
      />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="spotify-prompt-heading"
        tabIndex={-1}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-ink text-white shadow-[0_32px_80px_-20px_rgba(10,10,10,0.7)] outline-none"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full text-white/50 transition-colors duration-(--dur-fast) hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium text-honey">The podcast</p>

          <div className="mt-4 flex items-center gap-5">
            {cover && (
              /* Real cover art, not an illustration — the newest episode is
                 the evidence for the ask. Plain img: a local webp already
                 sized close to this rendering. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={episodeTitle ? `Cover art: ${episodeTitle}` : "Episode cover art"}
                className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
              />
            )}
            <h2
              id="spotify-prompt-heading"
              className="max-w-[16ch] text-[clamp(1.5rem,2.6vw,2rem)] leading-snug font-normal text-balance"
            >
              Take the <span className="font-script">conversation</span> with
              you
            </h2>
          </div>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/65">
            Follow Inside The Hive on Spotify and every new episode lands in
            your library the day it drops.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={SPOTIFY}
              target="_blank"
              rel="noreferrer"
              onClick={dismiss}
              className="inline-flex min-h-11 items-center bg-honey px-6 text-sm font-medium text-ink transition-colors duration-(--dur-fast) hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Follow on Spotify
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-11 items-center border border-white/25 px-6 text-sm font-medium text-white/80 transition-colors duration-(--dur-fast) hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
