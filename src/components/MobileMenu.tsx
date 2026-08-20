"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navLinks, site, socials } from "@/content/site";
import { DoodleField } from "@/components/DoodleField";
import {
  EmailIcon,
  InstagramIcon,
  TelegramIcon,
  XIcon,
} from "@/components/SocialIcons";
import { cn } from "@/lib/cn";

/**
 * The menu's social row is marks rather than words.
 *
 * Keyed by the label in site.ts, so adding an account there without an icon
 * here falls back to its name instead of rendering nothing.
 */
const SOCIAL_ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  X: XIcon,
  Instagram: InstagramIcon,
  Telegram: TelegramIcon,
  Email: EmailIcon,
};

/**
 * Full-screen overlay menu, items set in display type at --text-h2, in the
 * manner of the NiceAtNoon menu.
 *
 * Traps focus while open, closes on Escape, locks background scroll, and
 * returns focus to the trigger on close.
 */

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // The portal target only exists after mount; rendering it during the server
  // pass would reach for a document that is not there.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
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
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel so the first Tab lands somewhere sensible.
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-end text-(--nav-fg) md:hidden"
      >
        {/* Three rules rather than the word. The bars morph into a cross when
            the panel is open, so the same control reads as both affordances
            without swapping elements. */}
        <span aria-hidden className="relative block h-4 w-6">
          {["top-0", "top-1/2 -translate-y-1/2", "bottom-0"].map((position, index) => (
            <span
              key={position}
              className={cn(
                "absolute inset-x-0 block h-[2px] bg-current",
                "transition-[transform,opacity] duration-(--dur-fast) ease-(--ease-out-expo)",
                position,
                open && index === 0 && "top-1/2 -translate-y-1/2 rotate-45",
                open && index === 1 && "opacity-0",
                open && index === 2 && "top-1/2 bottom-auto -translate-y-1/2 -rotate-45",
              )}
            />
          ))}
        </span>
      </button>

      {open &&
        mounted &&
        createPortal(
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          // z-60, above the nav's z-50. At the same level the bar painted over
          // the panel's own header and the close control was unreachable —
          // there was no way out of the menu but the Escape key.
          // Portaled to <body> rather than rendered in place. The nav bar
          // carries a translate for its hide-on-scroll, and a transformed
          // ancestor becomes the containing block for a fixed descendant — so
          // `inset-0` resolved against the 80px bar instead of the viewport,
          // and the panel was an 80px strip with its content pushed above the
          // fold. Everything below the first link fell off-screen.
          className="fixed inset-0 z-60 overflow-hidden bg-white md:hidden"
        >
          {/* The texture carries through the menu, so opening it does not drop
              the reader onto a plain white sheet. It is a sibling of the
              content wrapper rather than a child of the flex column: as a bare
              absolute child it took part in the layout and painted over the
              links, leaving the panel showing one item. */}
          <DoodleField />
          {/* The panel's own dismiss. The trigger in the bar is covered by
              this overlay, so without one the menu can only be left with a
              keyboard. */}
          <div className="u-gutter relative z-10 flex h-full flex-col justify-between pt-24 pb-10">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-[var(--spacing-gutter)] grid size-11 place-items-center text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 font-display text-(length:--text-h2) leading-[0.92] font-medium tracking-[-0.02em] text-ink transition-colors duration-(--dur-fast) hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.storeUrl}
                target="_blank"
                rel="noopener"
                data-analytics="merch-outbound"
                className="block py-2 font-display text-(length:--text-h2) leading-[0.92] font-medium tracking-[-0.02em] text-ink transition-colors duration-(--dur-fast) hover:text-ink"
              >
                Merch <span aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>

          <div className="flex flex-col gap-6">
            <Link
              href="/join"
              className="u-label inline-flex min-h-12 items-center justify-center bg-honey px-6 text-ink"
            >
              Join the Hive
            </Link>

            {/* Marks, not words. Four labels set as text ran the width of the
                panel and read as a second navigation list competing with the
                real one; the glyphs say the same thing in a quarter of the
                space. The 44px box is the tap target — the icon inside it is
                sized for reading, not for touching. */}
            <ul className="-ml-3 flex items-center gap-1">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target={
                        social.href.startsWith("mailto:") ? undefined : "_blank"
                      }
                      rel={
                        social.href.startsWith("mailto:") ? undefined : "noopener"
                      }
                      aria-label={social.label}
                      className={cn(
                        "grid min-h-11 min-w-11 place-items-center text-ink/70 transition-colors duration-(--dur-fast) hover:text-ink",
                        !Icon && "u-label w-auto px-2",
                      )}
                    >
                      {Icon ? <Icon className="size-5" /> : social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
