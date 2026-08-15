import type { Metadata } from "next";
import { EventIndex } from "@/components/gallery/EventIndex";
import { GalleryCanvas } from "@/components/gallery/GalleryCanvas";
import { PartnerCta } from "@/components/gallery/PartnerCta";

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
          This reserves the scroll distance the handoff interpolates across.

          One viewport, not two. The handoff finishes at 0.9vh, so a taller
          spacer left the canvas gone and the next section not yet arrived —
          a full screen of white between them, which is exactly what made the
          transition feel broken. At this height the event index begins rising
          into frame while the canvas is still receding behind it. */}
      <div className="h-[100svh]" aria-hidden />

      <EventIndex />

      <PartnerCta />
    </>
  );
}
