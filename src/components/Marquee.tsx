"use client";

import { useEffect, useState } from "react";
import { partners } from "@/content/partners";

/**
 * Partner marquee. One row, one instance per page.
 *
 * The current site repeats "Africa's #1 Web3 Podcast 🐝" roughly eighty times
 * and eats a full viewport. This is the corrective: quiet, single-row, and used
 * only where a marquee earns its place — a partner logo row that genuinely has
 * more entries than fit.
 *
 * The list is duplicated once so the -50% translation loops seamlessly. Under
 * reduced motion it renders as a static, wrapped list instead — a moving strip
 * of logos is exactly what that preference exists to stop.
 */

export function Marquee() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reduced) {
    return (
      <ul className="u-gutter flex flex-wrap gap-x-12 gap-y-4">
        {partners.map((partner) => (
          <li key={partner.name} className="u-label text-ink/60">
            {partner.name}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      // Fade both edges so the strip reads as continuous rather than clipped.
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <ul
        // gap-16 on the list plus a matching pl-16 on the duplicate half keeps
        // the seam spacing identical to every other gap, so the loop point is
        // invisible rather than showing two logos bunched together.
        className="flex w-max items-center gap-16 pl-16"
        style={{ animation: "hive-marquee 42s linear infinite" }}
      >
        {[...partners, ...partners].map((partner, index) => (
          <li
            key={`${partner.name}-${index}`}
            className="u-label shrink-0 text-ink/60"
            // The duplicate half is decorative — screen readers read the list once.
            aria-hidden={index >= partners.length}
          >
            {partner.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
