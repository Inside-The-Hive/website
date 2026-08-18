import type { Metadata } from "next";
import { Dashboard } from "@/components/podcast/Dashboard";
import { PlayerBar } from "@/components/podcast/PlayerBar";
import {
  PlayerProvider,
  type PlayerEpisode,
} from "@/components/podcast/player-context";
import { episodeCategories, podcastPlatforms } from "@/content/site";
import { formatEventDate, getEpisodes, getPodcastFeed } from "@/lib/content";

/**
 * The podcast — a listening dashboard.
 *
 * One screen carries the whole catalogue: the latest episode as a poster, the
 * popular row, every episode as rows, and a now-playing rail with the queue.
 * The transport floats in a docked pill at the foot of the page, so pause is
 * never more than one reach away. The about band and the platform index
 * follow below.
 *
 * The blog deliberately does not live here. No written catalogue exists in
 * the repo yet; when articles exist they get their own destination.
 */

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Long-form conversations with the people building Web3 across Africa. Audio first — from Inside The Hive.",
};

export default function PodcastPage() {
  // The real catalogue, fetched from the show's own feed. The provisional MDX
  // entries only render if the fetch has never been run.
  const feed = getPodcastFeed();

  // Chronological for the player, so "next" moves through the season.
  const episodes: PlayerEpisode[] = feed
    ? [...feed.episodes].reverse().map((episode) => ({
        slug: episode.slug,
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        cover: episode.cover,
        dateLabel: episode.date ? formatEventDate(new Date(episode.date)) : "",
        duration: episode.duration,
        audio: episode.audio,
        summary: episode.summary,
      }))
    : getEpisodes()
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((episode, position) => ({
          slug: episode.slug,
          title: episode.title,
          episodeNumber: episode.episodeNumber ?? position + 1,
          hiveId: episode.hiveId,
          category: episode.category,
          categoryLabel:
            episodeCategories.find((c) => c.slug === episode.category)?.label ??
            episode.category,
          dateLabel: formatEventDate(episode.date),
          duration: episode.duration,
          audio: episode.audio,
          guest: episode.guest,
          guestRole: episode.guestRole,
          summary: episode.summary,
        }));

  const catalogueTotal = feed?.total ?? episodes.length;

  return (
    <PlayerProvider episodes={episodes}>
      {/* Padded at the foot so the docked bar never sits over the last of the
          page's own content. */}
      <div className="pb-28">
        <Dashboard total={catalogueTotal} />

        {/* What the show is. */}
        <section
          aria-labelledby="about-show-heading"
          className="u-section u-rule relative z-10 border-t bg-ash text-ink"
        >
          <div className="u-gutter">
            <h2 id="about-show-heading" className="text-(length:--text-h2) font-normal">
              What this is
            </h2>

            <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-ink/50">The show</h3>
                <p className="mt-4 max-w-prose text-ink/80">
                  Not soundbites — the actual argument. An hour with someone who
                  is building, long enough to get past the pitch and into how it
                  really works.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink/50">The guests</h3>
                <p className="mt-4 max-w-prose text-ink/80">
                  The people doing the work: founders shipping products, creators
                  getting paid onchain, artists and organisers holding the scene
                  together across the continent.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink/50">The listen</h3>
                <p className="mt-4 max-w-prose text-ink/80">
                  Audio first, by design. Take it on a commute, in a queue, over
                  a build — the conversation holds without a screen.
                </p>
              </div>
            </div>

            <div className="u-rule mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t pt-8">
              <span className="text-sm text-ink/45">On the dial</span>
              {episodeCategories.map((category) => (
                <span key={category.slug} className="text-ink/70">
                  {category.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Where else the show lives. */}
        <section
          aria-labelledby="platforms-heading"
          className="u-section relative z-10 bg-white text-ink"
        >
          <div className="u-gutter">
            <h2 id="platforms-heading" className="text-(length:--text-h2) font-normal">
              Listen where you already listen
            </h2>
            <p className="mt-6 max-w-prose text-ink/60">
              Every episode also publishes to the platforms below. Follow on one
              of them and new conversations arrive on their own.
            </p>

            <ul className="u-rule mt-[clamp(2rem,5vh,3rem)] grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
              {podcastPlatforms.map((platform) => {
                const live = platform.href !== "TODO";
                return (
                  <li key={platform.label} className="u-rule border-b">
                    {live ? (
                      <a
                        href={platform.href}
                        target="_blank"
                        rel="noopener"
                        className="group flex items-center justify-between py-6 pr-6 transition-colors duration-(--dur-fast) hover:text-ink"
                      >
                        <span className="text-(length:--text-h3) font-normal">
                          {platform.label}
                        </span>
                        <span
                          aria-hidden
                          className="text-ink/40 transition-transform duration-(--dur-fast) group-hover:translate-x-1 group-hover:text-ink"
                        >
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="flex items-center justify-between py-6 pr-6 text-ink/35">
                        <span className="text-(length:--text-h3) font-normal">
                          {platform.label}
                        </span>
                        <span className="text-sm">Soon</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <PlayerBar />
    </PlayerProvider>
  );
}
