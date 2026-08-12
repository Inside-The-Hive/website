import { HiveMedia } from "@/components/HiveMedia";
import type { Event } from "@/lib/content/schema";

/**
 * The one real risk: an orchestrated load sequence where the display type sets
 * before the hero media resolves in behind it.
 *
 *   0ms    ink field, nothing
 *   120ms  headline sets line by line, each clipped and rising from its own
 *          baseline, 80ms stagger
 *   560ms  hero media fades up from black behind the type
 *
 * It dramatises the brand claim — the words arrive, then the room arrives
 * behind them — and turns a heavy media load into the point rather than a gap.
 *
 * Nothing else on the site animates this hard. Under reduced motion the global
 * rule in globals.css collapses every duration, so the whole sequence is simply
 * present at 0ms.
 *
 * Pure CSS: no JS gate, so it cannot block interaction or shift layout.
 */

const LINES = ["We were", "in the room."];

export function Hero({ event }: { event: Event | null }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Media resolves in behind the type. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          animation: "hive-media-resolve var(--dur-slow) var(--ease-out-expo) 560ms both",
        }}
      >
        <HiveMedia
          src={event?.heroMedia.src}
          alt={
            event?.heroMedia.alt ??
            "Inside The Hive covering an event on the ground in Nigeria"
          }
          priority
          fill={false}
          sizes="100vw"
          className="h-full w-full"
        />
        {/* Legibility scrim. Type must hold over any frame we drop in later. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-ink) 8%, color-mix(in srgb, var(--color-ink) 55%, transparent) 45%, color-mix(in srgb, var(--color-ink) 25%, transparent) 100%)",
          }}
        />
      </div>

      <div className="u-gutter pb-[clamp(3rem,10vh,7rem)]">
        <p
          className="u-label mb-8 text-honey"
          style={{
            animation:
              "hive-media-resolve var(--dur-base) var(--ease-out-expo) 120ms both",
          }}
        >
          African Web3 media
        </p>

        <h1 className="text-(length:--text-mega) text-wax">
          {/* The visible lines are split for the stagger, which would otherwise
              concatenate into "We werein the room." for assistive tech and for
              search engines. The accessible sentence is provided once here and
              the decorative split is hidden from the tree. */}
          <span className="sr-only">{LINES.join(" ")}</span>
          <span aria-hidden>
            {LINES.map((line, index) => (
              // Each line is its own clipping mask so the rise reads as type
              // setting, not as a block sliding.
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span
                  className="block"
                  style={{
                    animation: `hive-line-rise var(--dur-base) var(--ease-out-expo) ${120 + index * 80}ms both`,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <p
          className="mt-8 max-w-xl text-wax/80"
          style={{
            animation:
              "hive-media-resolve var(--dur-base) var(--ease-out-expo) 640ms both",
          }}
        >
          We host events, cover them on the ground, and run Africa&apos;s #1 Web3 podcast.
        </p>
      </div>
    </section>
  );
}
