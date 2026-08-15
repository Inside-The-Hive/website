"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

/**
 * Full-screen viewer for one event's frames.
 *
 * A 900px square in a grid is a thumbnail, not a photograph. This is where the
 * picture is actually looked at — filling the viewport, with the rest of the
 * set a keypress away.
 *
 * The grid renders as plain figures and this wraps them, so the photographs
 * remain in the document whether or not the viewer ever opens. Nothing here is
 * required to see the pictures; it only makes them bigger.
 */

export type LightboxPhoto = {
  image: string;
  alt: string;
};

type Props = {
  photos: LightboxPhoto[];
  /** Index to show, or null when closed. */
  openAt: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Shown in the corner, e.g. the event's title. */
  caption?: string;
};

export function Lightbox({
  photos,
  openAt,
  onClose,
  onNavigate,
  caption,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  /** Element focused before opening, restored on close. */
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const open = openAt !== null;

  const go = useCallback(
    (delta: number) => {
      if (openAt === null) return;
      // Wraps, so the set is a loop rather than a strip with dead ends.
      onNavigate((openAt + delta + photos.length) % photos.length);
    },
    [openAt, photos.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    // The page behind must not scroll while the viewer is over it. Padding
    // compensates for the scrollbar's width so the layout does not jump as it
    // disappears.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab") {
        // The viewer covers the page, so focus has to stay inside it —
        // otherwise Tab walks into the grid underneath, which is hidden.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose, go]);

  if (!open || openAt === null) return null;

  const photo = photos[openAt];

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: the backdrop
    // is a click-to-dismiss surface; keyboard dismissal is Escape, handled above.
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={caption ? `${caption} — photograph viewer` : "Photograph viewer"}
      tabIndex={-1}
      // Clicking the ground closes. The image and the controls stop the event,
      // so only the empty area around the photograph dismisses.
      onClick={onClose}
      // Above the nav, which is z-50 and fixed — at a lower layer it showed
      // through the viewer's ground and the site's own links sat over the
      // photograph.
      className="fixed inset-0 z-[100] flex flex-col bg-ink outline-none"
    >
      {/* Top bar: caption on the left, position and close on the right. */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2.5vh,1.75rem)]">
        {caption && (
          <p className="u-label truncate text-white/55">{caption}</p>
        )}
        <div className="flex items-center gap-4">
          <p className="u-label text-white/55">
            {String(openAt + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            aria-label="Close viewer"
            className="grid size-11 place-items-center rounded-full text-white/70 transition-colors duration-(--dur-fast) hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* The photograph. `contain` rather than `cover`: this is the one place
          the whole frame should be visible, uncropped. */}
      <div className="relative min-h-0 flex-1">
        <Image
          key={photo.image}
          src={photo.image}
          alt={photo.alt}
          fill
          sizes="100vw"
          priority
          className="object-contain"
          onClick={(event) => event.stopPropagation()}
        />
      </div>

      {/* Controls sit below the image rather than over it, so they never cover
          part of the photograph being examined. */}
      <div className="flex shrink-0 items-center justify-center gap-3 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2.5vh,1.75rem)]">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            go(-1);
          }}
          aria-label="Previous photograph"
          className="grid size-12 place-items-center rounded-full border border-white/20 text-white/75 transition-colors duration-(--dur-fast) hover:bg-white/10 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            go(1);
          }}
          aria-label="Next photograph"
          className="grid size-12 place-items-center rounded-full border border-white/20 text-white/75 transition-colors duration-(--dur-fast) hover:bg-white/10 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
