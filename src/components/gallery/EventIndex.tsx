import Image from "next/image";
import Link from "next/link";
import { photosForEvent } from "@/content/gallery";
import { formatEventDate, getEvents } from "@/lib/content";

/**
 * The events the frames come from, listed under the canvas.
 *
 * The canvas is a gesture — it shows that there is more here than fits on a
 * screen, but it cannot tell you what any of it is. This is the map: four
 * events, dated, each opening onto its own contact sheet.
 *
 * It also gives the page somewhere to go for anyone who scrolls rather than
 * moves the pointer, which on a trackpad is most people.
 */
export function EventIndex() {
  // Every event in the catalogue, not only those that already have frames. A
  // night ITH covered is part of the record whether or not its photographs
  // have been supplied yet; the card says so plainly rather than hiding it.
  const events = getEvents()
    // Newest first, matching how the events sequence on the homepage reads.
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <section
      aria-labelledby="gallery-events-heading"
      className="u-section relative z-10 bg-white text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-4">
          <h2
            id="gallery-events-heading"
            className="text-(length:--text-h2) font-normal"
          >
            Every room we have <span className="font-script">been in</span>
          </h2>
          <p className="u-label max-w-sm text-ink/55">
            {events.length} events · shot on the ground
          </p>
        </div>

        {/* Spaced tiles rather than a hairline grid. At this size the frames
            are the content, and butting them edge to edge made two unrelated
            rooms read as one photograph. */}
        <ul className="grid grid-cols-1 gap-[clamp(1.5rem,3vw,2.75rem)] md:grid-cols-2">
          {events.map((event) => {
            const photos = photosForEvent(event.slug);
            const cover = photos[0];

            return (
              <li key={event.slug} className="bg-white">
                <Link
                  href={`/gallery/${event.slug}`}
                  className="group block h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ash">
                    {cover ? (
                      <Image
                        src={cover.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:scale-[1.04]"
                      />
                    ) : (
                      // No frames supplied for this night yet. An empty ash
                      // panel is honest; a borrowed photograph from another
                      // event would not be.
                      <span className="grid size-full place-items-center px-6 text-center text-sm text-ink/40">
                        Photographs from this night are on the way
                      </span>
                    )}

                    {/* The count sits on the image rather than under it: it is
                        a property of the picture set, and putting it in the
                        text block below would read as part of the event's
                        description instead. */}
                    {photos.length > 0 && (
                      <span className="u-label absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 text-ink backdrop-blur-sm">
                        {photos.length}{" "}
                        {photos.length === 1 ? "frame" : "frames"}
                      </span>
                    )}
                  </div>

                  <div className="p-[clamp(1.25rem,2.5vw,2rem)]">
                    <p className="u-label text-ink/45">
                      {formatEventDate(event.date)} · {event.location}
                    </p>
                    <h3 className="mt-3 text-(length:--text-h3) font-normal">
                      {event.title}
                    </h3>
                    <p className="mt-3 max-w-prose text-ink/65">
                      {event.summary}
                    </p>
                    <span className="u-label mt-5 inline-flex items-center gap-2 text-ink transition-[gap] duration-(--dur-fast) group-hover:gap-3">
                      {photos.length > 0 ? "See the frames" : "About this night"}{" "}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
