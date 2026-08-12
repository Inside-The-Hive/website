import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { HiveId } from "@/components/HiveId";
import { HiveMedia } from "@/components/HiveMedia";
import { Marquee } from "@/components/Marquee";
import { podcastPlatforms, stats } from "@/content/site";
import { formatEventDate } from "@/lib/content";
import type { Episode, Event } from "@/lib/content/schema";

/**
 * Homepage sections 2–8. Order is the strategy: events lead, podcast follows.
 * Section 1 (Hero) and 9 (Footer) live elsewhere.
 */

/** 2. Positioning — one large sentence on wax, plenty of air. */
export function Positioning() {
  return (
    <section className="u-section bg-wax text-ink">
      <div className="u-gutter">
        <p className="u-label text-propolis">Who we are</p>
        <p className="mt-8 max-w-5xl font-display text-(length:--text-h2) leading-[0.95] font-extrabold tracking-[-0.03em] text-balance">
          Inside The Hive is an African Web3 media brand. We host the room, cover the
          room, and put a microphone in it.
        </p>
      </div>
    </section>
  );
}

/** 3. Latest event recap — one featured event, full-bleed, huge. The proof. */
export function FeaturedEvent({ event }: { event: Event | null }) {
  if (!event) return null;

  return (
    <section className="u-section">
      <div className="u-gutter mb-12 flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="text-(length:--text-h2)">Latest recap</h2>
        <Link
          href={`/events/${event.slug}`}
          className="u-label inline-flex min-h-11 items-center text-honey"
        >
          Read the recap →
        </Link>
      </div>

      <Link href={`/events/${event.slug}`} className="group block">
        <div className="u-bleed relative">
          <HiveMedia
            src={event.heroMedia.src}
            alt={event.heroMedia.alt}
            hoverSrc={event.gallery[0]?.src}
            ratio="16/9"
            sizes="100vw"
          />
          <HiveId
            id={event.hiveId}
            className="absolute top-6 left-[var(--spacing-gutter)]"
          />
        </div>

        <div className="u-gutter mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h3 className="max-w-3xl text-(length:--text-h1) text-wax">{event.title}</h3>
          <div className="shrink-0">
            <p className="u-label text-honey">{event.role}</p>
            <p className="u-label mt-2 text-wax/60">
              {event.location} — {formatEventDate(event.date)}
            </p>
          </div>
        </div>

        <p className="u-gutter mt-6 max-w-2xl text-wax/80">{event.summary}</p>
      </Link>
    </section>
  );
}

/** 4. Events grid — image-led cards with hive ID chips. */
export function EventsGrid({ events, total }: { events: Event[]; total: number }) {
  if (!events.length) return null;

  return (
    <section className="u-section u-rule border-t">
      <div className="u-gutter">
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-(length:--text-h2)">On the ground</h2>
          {/* Count in the link label, the way Stodio does it. Honest, and it
              gets more convincing as the archive grows. */}
          <Link
            href="/events"
            className="u-label inline-flex min-h-11 items-center text-honey"
          >
            All events ({String(total).padStart(2, "0")}) →
          </Link>
        </div>

        {/* Asymmetric so the page never reads as a uniform tile wall. */}
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
          {events.map((event, index) => (
            <EventCard
              key={event.slug}
              event={event}
              ratio={index % 3 === 0 ? "3/2" : "4/5"}
              className={index % 3 === 0 ? "md:col-span-7" : "md:col-span-5"}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** 5. The podcast — one featured episode plus platform links. */
export function FeaturedPodcast({ episode }: { episode: Episode | null }) {
  const platforms = podcastPlatforms.filter((platform) => platform.href !== "TODO");

  return (
    <section className="u-section u-rule border-t">
      <div className="u-gutter">
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-(length:--text-h2)">The podcast</h2>
          <Link
            href="/podcast"
            className="u-label inline-flex min-h-11 items-center text-honey"
          >
            All episodes →
          </Link>
        </div>

        {episode ? (
          <div className="grid gap-10 lg:grid-cols-12">
            <Link href={`/podcast/${episode.slug}`} className="group block lg:col-span-7">
              <div className="relative">
                <HiveMedia
                  src={episode.coverImage?.src}
                  alt={
                    episode.coverImage?.alt ??
                    `Cover art for the episode ${episode.title}`
                  }
                  ratio="16/9"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                <HiveId id={episode.hiveId} className="absolute top-4 left-4" />
              </div>
            </Link>

            <div className="flex flex-col justify-center lg:col-span-5">
              <p className="u-label text-honey">
                {episode.episodeNumber
                  ? `Episode ${String(episode.episodeNumber).padStart(3, "0")}`
                  : "Latest episode"}
              </p>
              <h3 className="mt-4 text-(length:--text-h3) text-wax">{episode.title}</h3>
              {episode.guest && (
                <p className="u-label mt-4 text-wax/60">
                  With {episode.guest}
                  {episode.guestRole ? ` — ${episode.guestRole}` : ""}
                </p>
              )}
              <p className="mt-4 text-wax/80">{episode.summary}</p>
            </div>
          </div>
        ) : (
          <p className="max-w-2xl text-wax/60">
            {/* Deliberate empty state: the catalogue export has not landed yet.
                No invented episodes. */}
            Episodes are being migrated into the new catalogue.
          </p>
        )}

        {platforms.length > 0 && (
          <div className="u-rule mt-14 border-t pt-8">
            <p className="u-label mb-5 text-wax/60">Listen on</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {platforms.map((platform) => (
                <li key={platform.label}>
                  <a
                    href={platform.href}
                    target="_blank"
                    rel="noopener"
                    data-analytics="podcast-outbound"
                    data-platform={platform.label}
                    className="u-label inline-flex min-h-11 items-center text-wax transition-colors duration-(--dur-fast) hover:text-honey"
                  >
                    {platform.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/** 6. Partners — the one place a marquee is allowed. Single row, quiet. */
export function Partners() {
  return (
    <section className="u-section u-rule border-t">
      <p className="u-gutter u-label mb-10 text-wax/60">Trusted by</p>
      <Marquee />
    </section>
  );
}

/**
 * 7. By the numbers.
 *
 * Renders the labels with an em-dash where a figure is missing. No invented
 * statistics — the section proves the shape and waits for real data.
 */
export function ByTheNumbers() {
  return (
    <section className="u-section u-rule border-t">
      <div className="u-gutter">
        <h2 className="text-(length:--text-h2)">By the numbers</h2>
        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="u-rule border-t pt-6">
              <dd className="font-display text-(length:--text-h1) leading-[0.9] font-extrabold tracking-[-0.03em] text-honey">
                {stat.value ?? <span className="text-wax/30">—</span>}
              </dd>
              <dt className="u-label mt-4 text-wax/60">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** 8. Join the Hive. */
export function JoinCta() {
  return (
    <section className="u-section bg-wax text-ink">
      <div className="u-gutter flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="u-label text-propolis">The community</p>
          <h2 className="mt-6 text-(length:--text-h2) text-balance">Become a Bee.</h2>
          <p className="mt-6 max-w-xl text-ink/80">
            Get the recaps, the episodes, and the invites before anyone else.
          </p>
        </div>

        <Link
          href="/join"
          className="u-label inline-flex min-h-12 shrink-0 items-center bg-ink px-8 text-wax transition-colors duration-(--dur-fast) hover:bg-propolis"
        >
          Join the Hive
        </Link>
      </div>
    </section>
  );
}
