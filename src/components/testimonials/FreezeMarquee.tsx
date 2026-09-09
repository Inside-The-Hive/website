"use client";

import Image from "next/image";
import { useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Concept 3 — the marquee that stops.
 *
 * Two rows drifting in opposite directions, continuously. Hovering any card
 * freezes both rows, lifts the hovered card to full colour and scale, and
 * desaturates everything else.
 *
 * The freeze is the whole idea. A marquee that only scrolls is wallpaper; one
 * that stops dead under the cursor turns a passive band into something the
 * reader is controlling, and the stop is what makes the card feel picked rather
 * than merely hovered.
 *
 * Direction is set per row, and the track is duplicated so the -50% keyframe
 * lands exactly on the seam and loops without a jump.
 */

/** Seconds for one full pass. Long — a fast marquee reads as an ad banner. */
const DURATION = 48;

type RowProps = {
  items: typeof testimonials;
  reverse?: boolean;
  frozen: boolean;
  activeKey: string | null;
  onActivate: (key: string | null) => void;
};

function MarqueeRow({ items, reverse, frozen, activeKey, onActivate }: RowProps) {
  // Duplicated so the loop seam is invisible. aria-hidden on the copy so a
  // screen reader hears each testimonial once, not twice.
  return (
    <div className="flex overflow-hidden">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="flex shrink-0 gap-6 pr-6"
          style={{
            animation: `hive-marquee ${DURATION}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: frozen ? "paused" : "running",
          }}
        >
          {items.map((item) => {
            const key = item.name + item.role;
            const isActive = activeKey === key;
            const dimmed = activeKey !== null && !isActive;

            return (
              <article
                key={`${copy}-${key}`}
                onPointerEnter={() => copy === 0 && onActivate(key)}
                onPointerLeave={() => copy === 0 && onActivate(null)}
                className="u-rule flex w-[min(78vw,26rem)] shrink-0 flex-col justify-between border bg-white p-[clamp(1.25rem,2.5vw,2rem)]"
                style={{
                  scale: isActive ? "1.04" : "1",
                  filter: dimmed ? "saturate(0.1) opacity(0.45)" : "none",
                  transition:
                    "scale var(--dur-base) var(--ease-out-expo), filter var(--dur-base) var(--ease-out-expo), border-color var(--dur-fast)",
                  borderColor: isActive ? "var(--color-honey)" : undefined,
                }}
              >
                <p className="text-[clamp(0.95rem,1.3vw,1.1rem)] leading-relaxed text-ink/80">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-honey">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid size-full place-items-center font-display text-sm font-extrabold text-ink">
                        {item.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={
                        item.isPerson
                          ? "font-script text-[1.35rem] leading-none"
                          : "text-[1rem] leading-none font-medium"
                      }
                    >
                      {item.name}
                    </p>
                    <p className="u-label truncate text-ink/50">{item.role}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function FreezeMarquee() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const half = Math.ceil(testimonials.length / 2);

  return (
    <section
      aria-labelledby="freeze-marquee-heading"
      className="u-section u-rule border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="freeze-marquee-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What they <span className="font-script">say</span>
          </h2>
          <p className="u-label max-w-sm text-ink/55">Hover to hold a card</p>
        </div>
      </div>

      {/* Full-bleed: the rows must run off both edges or the loop reads as a
          carousel with hidden ends rather than a continuous band. */}
      <div className="u-bleed flex flex-col gap-6">
        <MarqueeRow
          items={testimonials.slice(0, half)}
          frozen={activeKey !== null}
          activeKey={activeKey}
          onActivate={setActiveKey}
        />
        <MarqueeRow
          items={testimonials.slice(half)}
          reverse
          frozen={activeKey !== null}
          activeKey={activeKey}
          onActivate={setActiveKey}
        />
      </div>
    </section>
  );
}
