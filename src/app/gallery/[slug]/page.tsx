import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSheet } from "@/components/gallery/ContactSheet";
import { PartnerCta } from "@/components/gallery/PartnerCta";
import { galleryEventSlugs, photosForEvent } from "@/content/gallery";
import { formatEventDate, getEvent, getEvents } from "@/lib/content";

/**
 * One event's frames.
 *
 * The canvas is the doorway and this is what it opens onto. It is deliberately
 * a plain contact sheet rather than a second piece of choreography — the
 * gallery already spent its motion budget on the pan, and someone who clicked
 * a specific photograph came to look at pictures, not to be moved through
 * another sequence.
 *
 * Event metadata comes from content/events, so the date, partner and location
 * on this page are the same ones the event's own page states. Nothing here is
 * written twice.
 */

type Params = { params: Promise<{ slug: string }> };

/** Only the four events that actually have frames get a route. */
export function generateStaticParams() {
  return galleryEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Gallery" };

  return {
    title: `${event.title} — Gallery`,
    description: event.summary,
  };
}

export default async function GalleryEventPage({ params }: Params) {
  const { slug } = await params;
  const photos = photosForEvent(slug);
  const event = getEvent(slug);

  // A slug with no frames is a 404 even if the event exists — this route is
  // the photographs, and an empty contact sheet is not a page.
  if (!event || photos.length === 0) notFound();

  // Neighbouring events with frames, so the page has somewhere to go next.
  const others = getEvents()
    .filter((item) => item.slug !== slug && galleryEventSlugs().includes(item.slug))
    .slice(0, 3);

  return (
    <>
      <header className="u-gutter pt-[9rem] pb-[clamp(2.5rem,6vh,4rem)]">
        <Link
          href="/gallery"
          className="u-label inline-flex items-center gap-2 text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
        >
          <span aria-hidden>←</span> All frames
        </Link>

        <h1 className="mt-6 text-(length:--text-h1) font-normal">
          {event.title}
        </h1>

        {/* The facts, as one line of small type. These are the event's own
            metadata, not a caption written for the gallery. */}
        <div className="u-label mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/55">
          <span>{formatEventDate(event.date)}</span>
          <span aria-hidden>·</span>
          <span>{event.location}</span>
          <span aria-hidden>·</span>
          <span>{event.role}</span>
          <span aria-hidden>·</span>
          <span>
            {photos.length} {photos.length === 1 ? "frame" : "frames"}
          </span>
        </div>

        <p className="mt-6 max-w-prose text-[clamp(1.05rem,1.5vw,1.35rem)] text-ink/70">
          {event.summary}
        </p>
      </header>

      <section aria-label="Photographs" className="u-gutter">
        <ContactSheet frames={photos} eventTitle={event.title} />
      </section>

      {/* Back into the site rather than a dead end. */}
      <section className="u-section u-gutter">
        {others.length > 0 && (
          <div>
            <h2 className="u-label text-ink/55">More events</h2>
            <ul className="mt-6 grid gap-px bg-(--color-line) sm:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug} className="bg-white">
                  <Link
                    href={`/gallery/${item.slug}`}
                    className="group block py-6 transition-opacity duration-(--dur-fast) hover:opacity-70 sm:px-6"
                  >
                    <p className="u-label text-ink/45">
                      {formatEventDate(item.date)}
                    </p>
                    <p className="mt-2 text-(length:--text-h3) font-normal">
                      {item.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <PartnerCta />
    </>
  );
}
