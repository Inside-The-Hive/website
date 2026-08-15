"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

/**
 * One event's frames as a contact sheet, each opening into the viewer.
 *
 * A hairline grid rather than gapped cards: these are frames from one roll, and
 * separating them into tiles would imply they are unrelated things.
 *
 * Each frame is a button rather than a div with a click handler, so it is
 * reachable by keyboard and announced as something that can be activated. The
 * photographs themselves are ordinary images in the document either way — the
 * viewer enlarges them, it is not what makes them visible.
 */

type Frame = {
  id: number;
  image: string;
};

export function ContactSheet({
  frames,
  eventTitle,
}: {
  frames: Frame[];
  eventTitle: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const photos = frames.map((frame, index) => ({
    image: frame.image,
    alt: `${eventTitle} — photograph ${index + 1}`,
  }));

  return (
    <>
      <div className="grid gap-px bg-(--color-line) sm:grid-cols-2 lg:grid-cols-3">
        {frames.map((frame, index) => (
          <figure key={frame.id} className="relative bg-white">
            <button
              type="button"
              onClick={() => setOpenAt(index)}
              aria-label={`Open photograph ${index + 1} of ${frames.length}`}
              className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden"
            >
              <Image
                src={frame.image}
                alt={photos[index].alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:scale-[1.03]"
              />

              {/* A wash on hover, so the frame reads as something that responds
                  rather than as a flat picture that happens to be clickable. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-ink/0 transition-colors duration-(--dur-base) group-hover:bg-ink/15"
              />
            </button>
          </figure>
        ))}
      </div>

      <Lightbox
        photos={photos}
        openAt={openAt}
        onClose={() => setOpenAt(null)}
        onNavigate={setOpenAt}
        caption={eventTitle}
      />
    </>
  );
}
