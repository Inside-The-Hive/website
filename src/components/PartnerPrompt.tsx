"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { socials } from "@/content/site";

/**
 * The partner prompt.
 *
 * Appears once the visitor has read most of a page — by then they have seen
 * the work and the ask is earned, where the same card on arrival would be an
 * interruption. It offers the one thing a prospective partner actually wants,
 * which is a way to start the conversation.
 *
 * Deliberately restrained about when it shows: once per visitor, never on the
 * first screen, never twice in a session, and dismissed for good once closed
 * or acted on. A prompt that returns after being sent away is an advert.
 */

const SEEN_KEY = "ith-partner-prompt";

/** Share of the page that must be behind the reader before this appears. */
const TRIGGER = 0.62;

const EMAIL =
  socials.find((s) => s.label === "Email")?.href.replace("mailto:", "") ??
  "contact@insidedhive.com";

export function PartnerPrompt() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(SEEN_KEY, "1");
    delete document.body.dataset.ithPrompt;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(SEEN_KEY)) return;
    // A visitor who has asked for less motion has also, in effect, asked not
    // to be surprised by things arriving on their own.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const scrollable = document.body.scrollHeight - window.innerHeight;
      // A page too short to scroll has no "deep" to reach.
      if (scrollable < window.innerHeight * 0.5) return;
      // The corner is single-occupancy: if the Spotify prompt (or any other)
      // holds it, keep listening and take a later scroll instead. The flag is
      // claimed synchronously before render so two prompts whose thresholds
      // are both behind the reader cannot open in the same frame — see
      // SpotifyPrompt for the shared contract.
      if (document.body.dataset.ithPrompt) return;
      if (window.scrollY / scrollable >= TRIGGER) {
        document.body.dataset.ithPrompt = "partner";
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

  // Focus moves into the card, is trapped while it is open, and returns to
  // whatever held it before. Escape closes, as every dialog should.
  useEffect(() => {
    if (!open) return;
    cardRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
        returnFocusRef.current?.focus();
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
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    // Not a modal: the page behind stays scrollable and readable. The reader
    // did not ask for this, so it must not take the page hostage.
    <div
      ref={cardRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="partner-prompt-heading"
      tabIndex={-1}
      // Laid out by the shared corner wrapper, not pinned on its own: pinned,
      // this card sat over the cookie choice and intercepted its clicks.
      className="pointer-events-auto w-full outline-none sm:max-w-md"
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-[0_24px_60px_-16px_rgba(10,10,10,0.55)] sm:p-7">
        <button
          type="button"
          onClick={() => {
            dismiss();
            returnFocusRef.current?.focus();
          }}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-white/50 transition-colors duration-(--dur-fast) hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="text-sm font-medium text-honey">Partner with us</p>

        <h2
          id="partner-prompt-heading"
          className="mt-3 max-w-[20ch] text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug font-normal text-balance"
        >
          Got a room that needs <span className="font-script">filling</span>?
        </h2>

        <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/65">
          We host, cover and document events across the continent — and put the
          people building on the record. Tell us what you are planning.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Partnering with Inside The Hive")}`}
            onClick={dismiss}
            className="inline-flex min-h-11 items-center bg-honey px-6 text-sm font-medium text-ink transition-colors duration-(--dur-fast) hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start a conversation
          </a>
          <button
            type="button"
            onClick={() => {
              dismiss();
              returnFocusRef.current?.focus();
            }}
            className="inline-flex min-h-11 items-center border border-white/25 px-6 text-sm font-medium text-white/80 transition-colors duration-(--dur-fast) hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
