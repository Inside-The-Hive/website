"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

/**
 * Transparent over the hero, then a blurred translucent bar once scrolled.
 *
 * Hides on scroll down and returns on scroll up. Full-height sections — the
 * featured-events sequence in particular — need the whole viewport, and a bar
 * permanently pinned over the top of one eats into it. Reversing direction is
 * also the moment someone is looking for navigation, so tying the bar to
 * direction puts it there exactly when it is wanted.
 */

/**
 * Movement required before the bar reacts, in px. Without it, the sub-pixel
 * jitter of a trackpad or a momentum scroll flickers the bar on and off.
 */
const DIRECTION_THRESHOLD = 8;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  /** True while the bar sits over a section that marks itself as inverted. */
  const [onDark, setOnDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;

      setScrolled(y > 8);

      if (Math.abs(delta) >= DIRECTION_THRESHOLD) {
        // Never hide at the very top: the bar would vanish on the first
        // downward flick of a page the reader has not started yet.
        setHidden(delta > 0 && y > window.innerHeight * 0.35);
        last = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /**
   * Flips the bar's text to white while an inverted section sits behind it.
   *
   * The bar has no fill, so its text sits directly on whatever is under it.
   * Over an inverted section that would be ink on near-black — invisible.
   *
   * This measures the marked sections rather than sampling a pixel. An earlier
   * version called `elementsFromPoint` at the centre of the bar from inside the
   * scroll handler, which failed twice over: it never ran on a page that loads
   * dark and is never scrolled, and a section narrower than the viewport, or
   * simply not crossing the centre line, was missed entirely.
   *
   * Rechecked on scroll, on resize, and whenever the DOM changes, so a section
   * that mounts late — or a route that renders a different page under the same
   * bar — is picked up without the reader having to move.
   */
  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const header = document.querySelector("header");
      // Sample just below the bar's own bottom edge: the question is what the
      // text is sitting on, not what the bar overlaps by a pixel.
      const probe = (header?.getBoundingClientRect().height ?? 72) * 0.5;

      const sections = document.querySelectorAll("[data-nav-invert]");
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom >= probe && rect.height > 0) {
          setOnDark(true);
          return;
        }
      }
      setOnDark(false);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Sections can mount after this effect runs — a client component that
    // renders its dark branch only once the viewport has been measured, for
    // one. Without this the bar keeps whatever colour it started with.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // A route change can leave the bar hidden on a page the reader just opened.
  useEffect(() => setHidden(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[transform,background-color,border-color,backdrop-filter]",
        "duration-(--dur-fast) ease-(--ease-out-expo)",
        // Translated rather than faded: the bar leaves the frame entirely, so
        // it cannot sit half-visible over the top of a full-height section.
        hidden ? "-translate-y-full" : "translate-y-0",
        // No fill — the blur alone separates the bar from the page, so it
        // frosts whatever passes underneath rather than laying a white panel
        // over it. No saturate filter either: that pushes the colour of the
        // content behind through the glass and tints it.
        // Text flips to white over inverted sections. Set as a CSS variable so
        // every link, the wordmark and the rule read from one value rather
        // than each carrying its own conditional.
        onDark
          ? "[--nav-fg:var(--color-white)] [--nav-line:rgba(255,255,255,0.18)]"
          : "[--nav-fg:var(--color-ink)] [--nav-line:var(--color-line)]",
        "text-(--nav-fg)",
        // No bottom rule — the blur alone separates the bar from the page.
        scrolled && "backdrop-blur-xl",
        // Under reduced motion the bar simply is or is not there.
        "motion-reduce:transition-none",
      )}
    >
      <nav
        aria-label="Primary"
        className="u-gutter flex items-center justify-between gap-6 py-2"
      >
        {/* The logo already sets "Inside The Hive" as type, so the wordmark is
            the image alone — repeating the name beside it would say it twice.
            The accessible name comes from `alt`, which keeps the link readable
            to a screen reader and to search. */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/Logo.png"
            alt={site.name}
            width={500}
            height={500}
            priority
            // Large for a nav mark, because the logo sets its own name in a
            // ring of small type — below this it stops resolving as words and
            // reads as a smudge. The bar's padding tightens to compensate.
            className="h-16 w-auto md:h-[4.5rem]"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "u-label inline-flex min-h-11 items-center",
                      "transition-colors duration-(--dur-fast) ease-(--ease-out-expo)",
                      // Active is full-strength ink with a honey underline;
                      // resting is muted. Yellow marks state without ever
                      // carrying the text itself.
                      active
                        ? "text-(--nav-fg) underline decoration-honey decoration-2 underline-offset-8"
                        : "opacity-60 hover:opacity-100",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Merch, visually separated by the rule.
              Internal while the store is being built: site.storeUrl points at
              a subdomain that does not resolve, so on the live domain this was
              a 404 in the primary navigation. /merch says the same thing
              honestly. Restore the outbound link — target, rel, arrow and the
              merch-outbound analytics hook — when the store exists. */}
          <div className="flex items-center gap-4 border-l border-(--nav-line) pl-8">
            <Link
              href="/merch"
              className="u-label inline-flex min-h-11 items-center gap-1 opacity-60 transition-opacity duration-(--dur-fast) hover:opacity-100"
            >
              Merch
            </Link>

            {/* Yellow as a fill with ink text — 19.3:1, and the one loud
                element in the bar. */}
            <Link
              href="/join"
              // Hover inverts to the bar's own foreground, so the button stays
              // visible whether the ground behind it is white or ink.
              className="u-label inline-flex min-h-11 items-center bg-honey px-5 text-ink transition-colors duration-(--dur-fast) hover:bg-(--nav-fg) hover:text-ink"
            >
              Join the Hive
            </Link>
          </div>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
}
