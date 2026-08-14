import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { Hero } from "@/components/home/Hero";
import { HiveCarousel } from "@/components/home/HiveCarousel";
import { Lore } from "@/components/home/Lore";
import { Services } from "@/components/home/Services";
import { Team } from "@/components/home/Team";
import {} from // EventsGrid,
// JoinCta,
// Partners,
"@/components/home/Sections";
import { PodcastSection } from "@/components/home/PodcastSection";
import { StatCounters } from "@/components/home/StatCounters";
import { site } from "@/content/site";
import { formatEventDate, getEpisodes, getEvents } from "@/lib/content";

/**
 * Section order is the strategy, set in the brief and not rearranged:
 * hero → positioning → featured event → events grid → podcast → partners →
 * numbers → join → footer.
 *
 * The hex carousel sits between hero and positioning as a visual bridge — it
 * adds imagery, not a new argument, so the section order above still holds.
 *
 * Events lead. The podcast follows. That ordering is the whole argument.
 */

export default function Home() {
  const events = getEvents();
  const heroEvent = events.find((event) => event.featured) ?? events[0] ?? null;
  // The featured sequence carries the whole set — it is the events section, not
  // a teaser in front of one, so there is no featured/rest split here. Capped
  // at eight because the section pins for a viewport-height per event and a
  // longer sequence would hold the reader too long.
  //
  // The date is formatted here rather than inside the sequence: that is a
  // client component, and the content loader reads from disk.
  const featuredEvents = events.slice(0, 8).map((event) => ({
    ...event,
    dateLabel: formatEventDate(event.date),
  }));

  const episodes = getEpisodes();
  const featuredEpisode = episodes.find((item) => item.featured) ?? episodes[0] ?? null;
  // The featured episode has the comb above; the list shows what follows it.
  const restEpisodes = episodes
    .filter((item) => item.slug !== featuredEpisode?.slug)
    .slice(0, 4);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    sameAs: [
      "https://x.com/InsideDHive",
      "https://instagram.com/insidedhive",
      "https://t.me/insidethehive",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <Hero event={heroEvent} />
      <HiveCarousel />
      <Lore />

      <FeaturedEvents events={featuredEvents} />
      {/* The sequence is the proof; the lore is the reason. In that order the
          claim is demonstrated before it is explained. */}
      {/* <StatCounters /> */}
      {/* Capability after proof: the sequence and the counters establish the
          track record, so "what we do" is read as a summary of demonstrated
          work rather than as a claim. The crew follows it — the offering,
          then the people behind it. */}
      <Services />
      <Team />
      {/* <PodcastSection
        featured={featuredEpisode}
        episodes={restEpisodes}
        total={episodes.length}
      /> */}
      {/* <EventsGrid events={rest} total={events.length} />
      <Partners />
      <JoinCta /> */}
    </>
  );
}
