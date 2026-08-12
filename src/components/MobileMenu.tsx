"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks, site, socials } from "@/content/site";

/**
 * Full-screen overlay menu, items set in display type at --text-h2, in the
 * manner of the NiceAtNoon menu.
 *
 * Traps focus while open, closes on Escape, locks background scroll, and
 * returns focus to the trigger on close.
 */

export function MobileMenu() {
  const [open, setOpen] = useState(false);
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
        className="u-label -mr-2 inline-flex min-h-11 min-w-11 items-center justify-end text-ink md:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="u-gutter fixed inset-0 z-50 flex flex-col justify-between bg-white pt-24 pb-10 md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 font-display text-(length:--text-h2) leading-[0.92] font-extrabold tracking-[-0.03em] text-ink transition-colors duration-(--dur-fast) hover:text-ink"
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
                className="block py-2 font-display text-(length:--text-h2) leading-[0.92] font-extrabold tracking-[-0.03em] text-ink transition-colors duration-(--dur-fast) hover:text-ink"
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

            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    className="u-label inline-flex min-h-11 items-center text-ink/70 hover:text-ink"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
