import type { Metadata } from "next";
import { GalleryCanvas } from "@/components/gallery/GalleryCanvas";

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

export default function GalleryPage() {
  return (
    <>
      <GalleryCanvas />

      {/* The canvas is `fixed`, so it is out of flow and contributes no height.
          This reserves the scroll distance the fade interpolates across, and it
          has to clear a full viewport-height *past* the point the fade ends —
          otherwise the page bottoms out mid-fade and the canvas never reaches
          zero, so it keeps intercepting clicks. */}
      <div className="h-[200svh]" aria-hidden />

      <section className="u-section relative bg-white text-ink">
        <div className="u-gutter">
          <h2 className="text-(length:--text-h2) font-normal">
            Every room we have <span className="font-script">been in</span>
          </h2>
          <p className="mt-6 max-w-prose text-ink/70">
            Dinners, screenings, summits. Shot on the ground, at the events
            themselves — the same nights the rest of this site is about.
          </p>
          {/* TODO(client): twelve real frames, each appearing twice to fill the
              world. Adding more to content/gallery.ts reduces the repetition
              automatically; at twenty-four real photographs it stops entirely. */}
        </div>
      </section>
    </>
  );
}
