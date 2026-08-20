import Image from "next/image";
import { DoodleField } from "@/components/DoodleField";
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
/**
 * Each line is a list of parts so one of them can be artwork rather than type.
 * `mark` renders the painted "Biggest" lockup in place of the word; everything
 * else sets as text. The accessible sentence is assembled from `text` and read
 * once, so the swap changes nothing for a screen reader or for search.
 */
const LINES: { text: string; mark?: boolean }[][] = [
  [{ text: "Africa's " }, { text: "biggest", mark: true }],
  [{ text: "web3 media" }],
  [{ text: "brand." }],
];

/** The sentence, for assistive tech and for search. */
const HEADLINE = LINES.map((parts) => parts.map((p) => p.text).join("")).join(" ");

export function Hero({ event }: { event: Event | null }) {
  const src = event?.heroMedia.src;
  const hasMedia = Boolean(src) && !src?.startsWith("TODO");

  return (
    // Type sits low in the frame so the media above it carries the top of the
    // viewport — the room arrives behind the words, which is the whole point of
    // the load sequence.
    <section
      className={
        hasMedia
          // `isolate` keeps the layering below local to the hero.
          // Top padding is generous on a wide screen, where the media carries
          // the upper half, and modest on a phone, where the same share of the
          // viewport reads as an empty band above the headline.
          ? "relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden pt-[22svh] md:pt-[30svh]"
          // Full height on a phone so the doodle layer reaches the fold — at
          // 82svh it stopped short and left a bare white band above the
          // photographs. The type centres rather than sitting at the bottom:
          // pinned low on a full-height section it fell past the fold, and
          // the screen opened on nothing but texture.
          // On a phone the type sits just under the bar rather than centred:
          // centring left a band of empty texture above the headline and a
          // larger one below it, and the carousel was pushed off the fold.
          // The section also stops filling the whole screen, so the strip
          // below sits directly under the words.
          // No height floor on a phone: the section is as tall as the type
          // plus its padding, so the strip below sits directly under the
          // words. A floor here left a band of empty texture between them.
          : "relative isolate flex flex-col justify-start overflow-hidden pt-[6.5rem] pb-[1.75rem] md:min-h-[82svh] md:justify-end md:pt-[18svh] md:pb-0"
      }
    >
      {/* Media resolves in behind the type.

          Ordered before the pattern deliberately. This layer fills the hero
          whether or not a media file exists, so with the pattern beneath it
          the marks were covered and painted nothing — the layer rendered
          correctly and was simply never on screen. */}
      <div
        className="absolute inset-0 z-[1]"
        style={
          // Nothing to resolve in until real media lands; animating an empty
          // white frame just reads as a flash.
          hasMedia
            ? {
                animation:
                  "hive-media-resolve var(--dur-slow) var(--ease-out-expo) 560ms both",
              }
            : undefined
        }
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
            the inverse of a dark-theme scrim. Only applied once real media
            exists; over the empty white frame it would just tint the page. */}
        {hasMedia && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--color-white) 6%, color-mix(in srgb, var(--color-white) 82%, transparent) 38%, color-mix(in srgb, var(--color-white) 35%, transparent) 100%)",
            }}
          />
        )}
      </div>

      {/* Doodle texture behind the headline. Above the media layer, which
          fills the hero even when no media file exists and would otherwise
          cover this entirely; the content sits above both at z-10. */}
      <DoodleField className="z-[2]" />

      {/* Above both the pattern and the media layer. */}
      <div className="relative z-10 u-gutter pb-[1.25rem] md:pb-[clamp(3rem,10vh,7rem)]">
        {/* Weight 400 with looser tracking. At mega size the light weight is
            the statement — 800 read as shouting, and Inter Tight holds its
            shape at 400 far better than a grotesque would. Overrides the
            weight-800 base rule for h1/h2/h3 in globals.css. */}
        {/* Tighter than the global 0.92 for h1 — at mega size the three-line
            stack wants to read as a block. 0.88 is about as tight as it goes:
            measured clearance between the "biggest" descenders and the "web3
            media" ascenders is 0.107em at 360px, and 0.84 halves that. */}
        <h1 className="text-mega font-normal leading-[0.8] tracking-[-0.02em] text-ink">
          {/* The visible lines are split for the stagger, which would otherwise
              concatenate without a space ("Africa's Biggestweb3 media brand.")
              for assistive tech and for search engines. The accessible sentence
              is provided once here and the decorative split is hidden. */}
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden>
            {LINES.map((parts, index) => (
              // Each line is its own clipping mask so the rise reads as type
              // setting, not as a block sliding.
              //
              // The mask clips to the line box, which sits above the descender
              // depth, so without extra room below the baseline it cuts the
              // tails of "gg" in "biggest". 0.22em clears Inter's descender.
              <span
                key={parts.map((part) => part.text).join("")}
                className="block overflow-hidden pb-[0.22em]"
              >
                <span
                  className="block"
                  style={{
                    animation: `hive-line-rise var(--dur-base) var(--ease-out-expo) ${120 + index * 80}ms both`,
                  }}
                >
                  {parts.map((part) =>
                    part.mark ? (
                      // Sized in em so the lockup tracks the headline at every
                      // breakpoint rather than needing its own clamp. The
                      // negative margins pull the brush's own transparent
                      // padding back in, so the mark sits on the line where
                      // the word did instead of pushing it wider.
                      <Image
                        key={part.text}
                        src="/biggest.webp"
                        alt=""
                        width={1200}
                        height={463}
                        // Part of the largest element on the page, so it is
                        // fetched with the document rather than lazily.
                        priority
                        className="-my-[0.14em] -mx-[0.04em] inline-block h-[1.02em] w-auto align-baseline"
                      />
                    ) : (
                      part.text
                    ),
                  )}
                </span>
              </span>
            ))}
          </span>
        </h1>

      </div>
    </section>
  );
}
