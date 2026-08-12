import { Hero } from "@/components/home/Hero";
import { HiveCarousel } from "@/components/home/HiveCarousel";
import {
  EventsGrid,
  FeaturedEvent,
  FeaturedPodcast,
  JoinCta,
  Partners,
} from "@/components/home/Sections";
import { StatCounters } from "@/components/home/StatCounters";
import { site } from "@/content/site";
import { getEvents, getFeaturedEpisode } from "@/lib/content";

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
  const featured = events.find((event) => event.featured) ?? events[0] ?? null;
  // The featured event already has the full-bleed slot above; the grid shows
  // what comes after it.
  const rest = events.filter((event) => event.slug !== featured?.slug).slice(0, 5);
  const episode = getFeaturedEpisode();

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

      <Hero event={featured} />
      <HiveCarousel />
      <StatCounters />
      <FeaturedEvent event={featured} />
      <EventsGrid events={rest} total={events.length} />
      <FeaturedPodcast episode={episode} />
      <Partners />
      <JoinCta />
    </>
  );
}
