"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

/**
 * Transparent over the hero, then gains a carbon background with a hairline
 * propolis bottom border once scrolled past 80vh.
 */

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-colors duration-(--dur-fast) ease-(--ease-out-expo)",
        scrolled ? "u-rule border-b bg-white" : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="u-gutter flex items-center justify-between gap-6 py-4"
      >
        {/* The wordmark is the one place yellow appears as a brand mark. The
            hive dot carries it; the name stays ink so it always passes AA. */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl leading-none font-extrabold tracking-[-0.03em] text-ink"
        >
          <span
            aria-hidden
            className="inline-block size-3 shrink-0 bg-honey"
            style={{
              clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
            }}
          />
          {site.name}
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
                        ? "text-ink underline decoration-honey decoration-2 underline-offset-8"
                        : "text-ink/60 hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Merch is external and visually separated by the rule. */}
          <div className="u-rule flex items-center gap-4 border-l pl-8">
            <a
              href={site.storeUrl}
              target="_blank"
              rel="noopener"
              data-analytics="merch-outbound"
              className="u-label inline-flex min-h-11 items-center gap-1 text-ink/60 transition-colors duration-(--dur-fast) hover:text-ink"
            >
              Merch <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>

            {/* Yellow as a fill with ink text — 19.3:1, and the one loud
                element in the bar. */}
            <Link
              href="/join"
              className="u-label inline-flex min-h-11 items-center bg-honey px-5 text-ink transition-colors duration-(--dur-fast) hover:bg-ink hover:text-white"
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
