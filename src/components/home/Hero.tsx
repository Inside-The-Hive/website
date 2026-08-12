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

/**
 * Hard-split so the break is designed rather than left to the wrap. Each line
 * is its own clipping mask for the stagger, so a line that wraps on its own
 * would break out of its mask — the split has to match what actually fits.
 */
const LINES = ["Africa's biggest", "web3 media", "brand."];

export function Hero({ event }: { event: Event | null }) {
  return (
    // Type sits low in the frame so the media above it carries the top of the
    // viewport — the room arrives behind the words, which is the whole point of
    // the load sequence.
    <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden pt-[30svh]">
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
          quiet
          sizes="100vw"
          className="h-full w-full"
        />
        {/* Legibility scrim. The page is white and the headline is ink, so the
            scrim fades the media to white at the bottom where the type sits —
            the inverse of a dark-theme scrim. Type must hold over any frame we
            drop in later. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-white) 6%, color-mix(in srgb, var(--color-white) 82%, transparent) 38%, color-mix(in srgb, var(--color-white) 35%, transparent) 100%)",
          }}
        />
      </div>

      <div className="u-gutter pb-[clamp(3rem,10vh,7rem)]">
        <p
          className="u-label mb-8 text-ink"
          style={{
            animation:
              "hive-media-resolve var(--dur-base) var(--ease-out-expo) 120ms both",
          }}
        >
          Events · Podcast · Coverage
        </p>

        <h1 className="text-(length:--text-mega) text-ink">
          {/* The visible lines are split for the stagger, which would otherwise
              concatenate without a space ("Africa's biggestweb3 media brand.")
              for assistive tech and for search engines. The accessible sentence
              is provided once here and the decorative split is hidden. */}
          <span className="sr-only">{LINES.join(" ")}</span>
          <span aria-hidden>
            {LINES.map((line, index) => (
              // Each line is its own clipping mask so the rise reads as type
              // setting, not as a block sliding.
              //
              // The mask clips to the line box, which sits above the descender
              // depth, so without extra room below the baseline it cuts the
              // tails of "gg" in "biggest". 0.22em clears Inter's descender.
              <span key={line} className="block overflow-hidden pb-[0.22em]">
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
          className="mt-8 max-w-xl text-ink/70"
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
