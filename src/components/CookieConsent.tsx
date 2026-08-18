"use client";

import { useEffect, useState } from "react";

/**
 * Cookie consent.
 *
 * The site loads Google Analytics, which sets cookies, so this is a real gate
 * rather than a notice: the choice is stored and read by the analytics loader,
 * and declining means the script never runs.
 *
 * Bottom right, small, and dismissible — a full-width banner over a page whose
 * whole argument is photography would cover the thing the visitor came for.
 * Nothing is blocked while the choice is open; the page is usable either way.
 */

export const CONSENT_KEY = "ith-cookie-consent";

/** Reads the stored choice. Server-safe — returns null before mount. */
export function readConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function CookieConsent() {
  // Null until the effect runs, so the server and the first client render
  // agree — reading localStorage during render would mismatch and throw.
  const [choice, setChoice] = useState<"granted" | "denied" | null | "pending">(
    "pending",
  );

  useEffect(() => {
    setChoice(readConsent());
  }, []);

  const decide = (value: "granted" | "denied") => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setChoice(value);
    // The analytics loader listens for this rather than polling storage, so a
    // grant takes effect immediately instead of on the next page load.
    window.dispatchEvent(new CustomEvent("ith-consent", { detail: value }));
  };

  if (choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      // Above the page, below any modal. Fixed to the corner on desktop and
      // full-width on a phone, where a floating card would crowd the screen.
      //
      // The partner prompt shares this corner, so both are laid out in one
      // flex column via the shared wrapper below rather than being pinned
      // independently — pinned, the prompt covered this card and swallowed
      // the clicks meant for its buttons.
      className="pointer-events-auto w-full sm:max-w-sm"
    >
      <div className="u-rule border bg-white p-5 shadow-[0_18px_50px_-14px_rgba(10,10,10,0.28)]">
        <p className="text-sm leading-relaxed text-ink/75">
          We use cookies to measure how the site is used. Nothing is shared and
          nothing tracks you across other sites.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => decide("granted")}
            className="inline-flex min-h-10 items-center bg-ink px-5 text-sm font-medium text-white transition-colors duration-(--dur-fast) hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => decide("denied")}
            className="u-rule inline-flex min-h-10 items-center border px-5 text-sm font-medium text-ink transition-colors duration-(--dur-fast) hover:bg-ash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
