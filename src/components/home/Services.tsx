"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { services } from "@/content/team";

/**
 * What Inside The Hive does.
 *
 * The events sequence proves the track record and the lore explains the
 * reason; neither answers the question a prospective partner actually arrives
 * with, which is "what can you do for me". This states the capability
 * directly.
 *
 * A list rather than a card grid. Cards would imply four interchangeable
 * options; a list reads as one offering with four parts, and the hairline
 * rules carry the separation without drawing a box around anything.
 *
 * Hovering a row lifts a photograph under the cursor. That image is the
 * evidence for the claim on the row it belongs to, which is why it is real
 * work rather than an illustration — the list asserts, the image proves. It
 * follows the pointer rather than sitting in a fixed slot so the connection to
 * the specific row being read is never ambiguous.
 */

/** How much of the pointer's movement the image carries, per frame. */
const FOLLOW = 0.14;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export function Services() {
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  /**
   * The follow is driven straight from a rAF loop against refs rather than
   * from React state. A pointermove that set state would re-render the whole
   * list on every mouse event; this touches one transform per frame instead,
   * and the easing toward the target is what gives the image its drag.
   */
  useEffect(() => {
    if (reduced) return;

    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let seeded = false;

    const onMove = (event: PointerEvent) => {
      const rect = list.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      // First move inside the list places the image rather than flying it in
      // from wherever it was last left.
      if (!seeded) {
        current.x = target.x;
        current.y = target.y;
        seeded = true;
      }
    };

    const onLeave = () => {
      seeded = false;
    };

    const tick = () => {
      current.x += (target.x - current.x) * FOLLOW;
      current.y += (target.y - current.y) * FOLLOW;
      preview.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section
      aria-labelledby="services-heading"
      className="u-section u-rule border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          {/* Weight 400 against the global heading rule's 800. Overridden here
              rather than in globals.css because other sections still want the
              heavier display setting. */}
          <h2 id="services-heading" className="text-(length:--text-h2) font-normal">
            What <span className="font-script">we do</span>
          </h2>
          <p className="u-label max-w-sm text-ink/55">
            Media partner, event partner, or both
          </p>
        </div>

        <ol ref={listRef} className="relative grid">
          {/* The preview. One element reused across every row — the source
              swaps as the active row changes, so there is a single image in
              the DOM rather than one per service. Pointer-events off so it
              never interrupts the hover it is responding to. */}
          {!reduced && (
            <div
              ref={previewRef}
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 z-20 hidden w-[min(32vw,30rem)] md:block"
              style={{ willChange: "transform" }}
            >
              <div
                className="relative aspect-[3/4] overflow-hidden transition-[opacity,scale] duration-(--dur-base) ease-(--ease-out-expo)"
                style={{
                  opacity: active === null ? 0 : 1,
                  scale: active === null ? "0.92" : "1",
                }}
              >
                {services.map((service, index) => (
                  <Image
                    key={service.title}
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 32vw, 0px"
                    className="object-cover transition-opacity duration-(--dur-base)"
                    style={{ opacity: active === index ? 1 : 0 }}
                  />
                ))}
              </div>
            </div>
          )}

          {services.map((service, index) => (
            <li
              key={service.title}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
              // A rule per row, with the last one closing the list. Separation
              // comes from the hairline and the space, never from a container.
              className="u-rule border-t py-[clamp(1.75rem,3.5vh,2.75rem)] transition-colors duration-(--dur-fast) last:border-b"
            >
              <div
                className="grid items-baseline gap-x-8 gap-y-3 transition-opacity duration-(--dur-fast) md:grid-cols-12"
                // Rows other than the hovered one recede. The dimming is what
                // makes the list feel like it is responding as one object
                // rather than four independent hover targets.
                style={{
                  opacity: active === null || active === index ? 1 : 0.35,
                }}
              >
                <h3 className="text-(length:--text-h3) font-normal text-ink md:col-span-5">
                  {service.title}
                </h3>

                <p className="max-w-prose text-ink/60 md:col-span-5">
                  {service.description}
                </p>

                {/* The proof, right-aligned so the figures form their own
                    column down the edge of the list. */}
                <span className="u-label text-ink md:col-span-2 md:text-right">
                  {service.note}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
