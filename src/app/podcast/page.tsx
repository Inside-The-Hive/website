import type { Metadata } from "next";
import { Console } from "@/components/podcast/Console";
import { EpisodeLedger } from "@/components/podcast/EpisodeLedger";
import {
  PlayerProvider,
  type PlayerEpisode,
} from "@/components/podcast/player-context";
import { episodeCategories, podcastPlatforms } from "@/content/site";
import { formatEventDate, getEpisodes } from "@/lib/content";

/**
 * The podcast — the home of the audio experience.
 *
 * The page is organised around one act: pressing play. A quiet white opening
 * states what the show is; the console (the signature) is where listening
 * happens; the ledger is the catalogue; the closing bands say what the show
 * believes and where else it lives. Nothing on the page competes with the
 * console for attention — it is the loud thing, and it is only loud when
 * sound is actually moving.
 *
 * The blog deliberately does not live here. No written catalogue exists in the
 * repo yet, and a podcast page that also tries to be a magazine is neither.
 * When articles exist they get their own destination; this page may then take
 * a small "read alongside" strip, not the archive.
 */

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Long-form conversations with the people building Web3 across Africa. Audio first — from Inside The Hive.",
};

export default function PodcastPage() {
  // Chronological for the player: the dial reads left to right like a season.
  // The ledger reverses its own view.
  const episodes: PlayerEpisode[] = getEpisodes()
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
      summary: episode.summary,
    }));

  const confirmedPlatforms = podcastPlatforms.filter((p) => p.confirmed || p.href !== "TODO");

  return (
    <PlayerProvider episodes={episodes}>
      {/* The opening. White, quiet, and short — its whole job is to name the
          show and hand over to the console. */}
      <header className="u-gutter pt-[9rem] pb-[clamp(3rem,8vh,5rem)]">
        <h1 className="max-w-[16ch] text-(length:--text-h1) font-normal text-balance">
          The hive, <span className="font-script">on air</span>
        </h1>
        <p className="mt-8 max-w-prose text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-ink/70">
          Long-form conversations with the people building Web3 across Africa —
          founders, creators, artists, on the record. Audio first: made to be
          listened to, not watched.
        </p>
      </header>

      <Console />
      <EpisodeLedger />

      {/* What the show is. Three short statements under one rule — editorial,
          not a marketing block. */}
      <section
        aria-labelledby="about-show-heading"
        className="u-section u-rule relative z-10 border-t bg-ash text-ink"
      >
        <div className="u-gutter">
          <h2 id="about-show-heading" className="text-(length:--text-h2) font-normal">
            What this is
          </h2>

          <div className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 md:grid-cols-3">
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
                Audio first, by design. Take it on a commute, in a queue, over a
                build — the conversation holds without a screen.
              </p>
            </div>
          </div>

          {/* The territories the catalogue actually covers — the same five
              categories the episodes are filed under. */}
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

      {/* Where else the show lives. Confirmed platforms link out; the rest
          stay named but inert until their URLs land — same convention as the
          crew's social marks. */}
      <section
        aria-labelledby="platforms-heading"
        className="u-section relative z-10 bg-white text-ink"
      >
        <div className="u-gutter">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="platforms-heading" className="text-(length:--text-h2) font-normal">
                Listen where you already listen
              </h2>
              <p className="mt-6 max-w-prose text-ink/60">
                Every episode also publishes to the platforms below. Follow on
                one of them and new conversations arrive on their own.
              </p>
            </div>
          </div>

          <ul className="u-rule mt-[clamp(2rem,5vh,3rem)] grid border-t sm:grid-cols-2 lg:grid-cols-3">
            {podcastPlatforms.map((platform) => {
              const live = platform.href !== "TODO";
              return (
                <li
                  key={platform.label}
                  className="u-rule border-b sm:odd:border-r sm:odd:pr-6 lg:odd:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:pr-6"
                >
                  {live ? (
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center justify-between py-6 transition-colors duration-(--dur-fast) hover:text-ink lg:pl-2"
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
                    <span className="flex items-center justify-between py-6 text-ink/35 lg:pl-2">
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

          {confirmedPlatforms.length === 0 && (
            <p className="mt-6 text-ink/50">
              Platform links are being confirmed — the player above works now.
            </p>
          )}
        </div>
      </section>
    </PlayerProvider>
  );
}
