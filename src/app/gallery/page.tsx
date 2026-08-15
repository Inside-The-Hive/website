import type { Metadata } from "next";
import { EventIndex } from "@/components/gallery/EventIndex";
import { GalleryCanvas } from "@/components/gallery/GalleryCanvas";
import { stats } from "@/content/site";

/**
 * The gallery.
 *
 * The canvas is fixed to the viewport and fades out as the reader scrolls past
 * it, so the page needs a scrollable run beneath it for that fade to have
 * anywhere to go. The spacer below is that run.
 */

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Two thousand frames from Inside The Hive events — dinners, summits, screenings, shot on the ground.",
};

/**
 * The figures worth stating on this page specifically.
 *
 * Picked from the site-wide stats rather than restated, so a corrected figure
 * in site.ts corrects here too. Spotify listeners and partnerships are left out
 * — true, but not what someone looking at photographs is asking about.
 */
const GALLERY_STATS = stats.filter((stat) =>
  ["Memories captured", "Events hosted", "Podcast episodes"].includes(
    stat.label,
  ),
);

export default function GalleryPage() {
  return (
    <>
      <GalleryCanvas />

      {/* The canvas is `fixed`, so it is out of flow and contributes no height.
          This reserves the scroll distance the handoff interpolates across.

          One viewport, not two. The handoff finishes at 0.9vh, so a taller
          spacer left the canvas gone and the next section not yet arrived —
          a full screen of white between them, which is exactly what made the
          transition feel broken. At this height the stats begin rising into
          frame while the canvas is still receding behind them. */}
      <div className="h-[100svh]" aria-hidden />

      {/* The canvas asserts that there is a great deal of this; the figures say
          how much. Drawn from the same stats the homepage uses, so the two
          cannot drift apart. */}
      {/* z-10 so the arriving content passes over the receding canvas rather
          than under it — the canvas is fixed, so without a stacking context of
          its own this band would slide beneath the photographs. */}
      <section
        aria-label="By the numbers"
        className="u-rule relative z-10 border-b bg-white"
      >
        <div className="u-gutter">
          <dl className="grid grid-cols-1 divide-y divide-(--color-line) sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {GALLERY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="px-[clamp(0.75rem,2vw,2rem)] py-[clamp(2rem,5vh,3.5rem)] first:pl-0 last:pr-0"
              >
                <dt className="u-label text-ink/45">{stat.label}</dt>
                <dd className="mt-3 font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-extrabold tracking-[-0.04em]">
                  {stat.value.toLocaleString("en")}
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <EventIndex />
    </>
  );
}
