"use client";

import { EpisodeCover } from "./EpisodeCover";
import { usePlayer } from "./player-context";

/**
 * The podcast page as a listening dashboard.
 *
 * One screen, two columns: the catalogue on the left — the latest episode as
 * a poster, the popular row, then every episode as rows — and the now-playing
 * rail on the right with the queue beneath it. The transport lives in the
 * docked bar; everything here selects what the bar plays.
 *
 * Light ground throughout. The page's colour comes from the episode covers
 * themselves, which is what keeps a busy layout looking like one thing.
 */

/** The show's presenter, as supplied by the client. */
const HOST = "Feezy";

/** Live-bars mark for whatever is currently on air. */
function EqBars() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-0.5">
      <span className="hive-eq w-0.5 bg-honey" />
      <span className="hive-eq w-0.5 bg-honey [animation-delay:0.18s]" />
      <span className="hive-eq w-0.5 bg-honey [animation-delay:0.34s]" />
    </span>
  );
}

export function Dashboard({ total }: { total: number }) {
  const { episodes, index, playing, tune, toggle } = usePlayer();

  // Latest drop leads the page; the list below reads newest first.
  const latest = episodes[episodes.length - 1];
  const latestAt = episodes.length - 1;
  const rows = [...episodes].reverse();

  // No play-count data exists, so "popular" is the featured episode first and
  // the rest in catalogue order — an honest ordering, not invented numbers.
  const popular = episodes.slice(0, 4);

  // The queue: what follows the current episode, wrapping, capped at three.
  const queue = Array.from(
    { length: Math.min(3, episodes.length - 1) },
    (_, i) => episodes[(index + 1 + i) % episodes.length],
  );

  return (
    <section
      aria-label="Episodes"
      className="u-gutter pt-24 pb-[clamp(2rem,5vh,4rem)] md:pt-[8.5rem]"
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 items-start gap-[clamp(1.5rem,2.5vw,2.5rem)] lg:grid-cols-[1fr_minmax(17rem,21rem)]">
        {/* ---------------- main column ---------------- */}
        <div className="min-w-0">
          {/* The poster: the newest episode, full width. The "just dropped"
              slot.

              Ink ground with white type, fixed — not the cover's own
              colourway. Those put honey on ink, which rendered the whole
              poster yellow: headline, summary and all. Yellow is a mark and a
              fill on this site, never the voice of a paragraph. */}
          <article className="relative overflow-hidden rounded-2xl bg-ink text-white">
            <div className="grid grid-cols-1 gap-6 p-[clamp(1.5rem,3.5vw,3rem)] sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <p className="text-sm font-medium text-honey">
                  New episode · just dropped
                </p>
                <h1 className="mt-3 max-w-[20ch] text-[clamp(1.6rem,3.1vw,2.6rem)] leading-[1.08] font-normal tracking-[-0.015em] text-white text-balance">
                  {latest.title}
                </h1>
                <p className="mt-4 max-w-prose text-[max(0.95rem,14px)] leading-relaxed text-white/65">
                  {latest.summary}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      latestAt === index ? toggle() : tune(latestAt)
                    }
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white px-6 text-sm font-medium text-ink transition-transform duration-(--dur-fast) hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {latestAt === index && playing ? (
                      <>
                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                          <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                          <path d="M7 4.8v14.4c0 .9 1 1.4 1.7.9l11-7.2a1.1 1.1 0 0 0 0-1.8l-11-7.2c-.7-.5-1.7 0-1.7.9Z" />
                        </svg>
                        Play episode
                      </>
                    )}
                  </button>
                  {/* No "Episode N" here: the feed's itunes:episode is the
                      host's upload counter (97) and disagrees with the show's
                      own numbering printed on the artwork (Ep 92). The art
                      carries the number; the metadata sticks to facts that
                      cannot contradict it. */}
                  <p className="text-sm text-white/55">
                    {latest.duration ?? "—"} · {latest.dateLabel}
                  </p>
                </div>
              </div>

              <EpisodeCover
                episode={latest}
                className="hidden w-[clamp(10rem,16vw,14rem)] rounded-xl text-[0.9rem] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.4)] sm:block"
              />
            </div>
          </article>

          {/* Popular episodes — the reference's artist row, tuned to a
              catalogue. Round covers, one per episode. */}
          <div className="mt-[clamp(2rem,4vh,3rem)]">
            <h2 className="text-lg font-medium">
              Popular episodes
            </h2>
            <ul className="mt-5 flex flex-wrap gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-6">
              {popular.map((episode) => {
                const at = episodes.indexOf(episode);
                const active = at === index;
                return (
                  <li key={episode.slug}>
                    <button
                      type="button"
                      onClick={() => (active ? toggle() : tune(at))}
                      aria-label={`Play ${episode.title}`}
                      className="group flex w-[clamp(5.5rem,9vw,7.5rem)] flex-col items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <span
                        className={
                          active
                            ? "relative block w-full overflow-hidden rounded-full ring-2 ring-honey ring-offset-2"
                            : "relative block w-full overflow-hidden rounded-full transition-transform duration-(--dur-fast) group-hover:scale-[1.04]"
                        }
                      >
                        <EpisodeCover
                          episode={episode}
                          compact
                          className="w-full text-[1.6rem]"
                        />
                      </span>
                      <span className="line-clamp-2 text-center text-sm leading-snug text-ink/80">
                        {episode.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The catalogue, newest first — the reference's "recently played"
              rows kept as they are: cover, title, presenter, duration. */}
          <div className="mt-[clamp(2rem,4vh,3rem)]">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">
                All episodes
              </h2>
              <p className="text-sm text-ink/50">
                Latest {episodes.length} of {total}
              </p>
            </div>
            <ol className="mt-3">
              {rows.map((episode) => {
                const at = episodes.indexOf(episode);
                const active = at === index;
                return (
                  <li
                    key={episode.slug}
                    className="u-rule border-b last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => (active ? toggle() : tune(at))}
                      aria-label={
                        active && playing
                          ? `Pause ${episode.title}`
                          : `Play ${episode.title}`
                      }
                      className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 rounded-lg px-2 py-3.5 text-left transition-colors duration-(--dur-fast) hover:bg-ash sm:grid-cols-[auto_1fr_auto_auto_auto] sm:gap-x-6"
                    >
                      <EpisodeCover
                        episode={episode}
                        compact
                        className="size-11 shrink-0 rounded-lg text-[0.95rem]"
                      />
                      <span className="min-w-0">
                        <span
                          className={
                            active
                              ? "block truncate font-medium text-ink"
                              : "block truncate font-medium text-ink/90"
                          }
                        >
                          {episode.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink/50">
                          {HOST}
                        </span>
                      </span>
                      <span className="hidden text-sm text-ink/45 sm:block">
                        {episode.categoryLabel ?? episode.dateLabel}
                      </span>
                      <span className="text-sm text-ink/50 tabular-nums">
                        {episode.duration ?? "—"}
                      </span>
                      <span className="hidden justify-self-end sm:block">
                        {active && playing ? (
                          <EqBars />
                        ) : (
                          <span
                            aria-hidden
                            className="grid size-8 place-items-center rounded-full border border-(--color-line) text-ink/45 transition-colors duration-(--dur-fast) group-hover:text-ink"
                          >
                            <svg viewBox="0 0 24 24" className="ml-0.5 size-3" fill="currentColor">
                              <path d="M7 4.8v14.4c0 .9 1 1.4 1.7.9l11-7.2a1.1 1.1 0 0 0 0-1.8l-11-7.2c-.7-.5-1.7 0-1.7.9Z" />
                            </svg>
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* ---------------- right rail ---------------- */}
        <aside className="rounded-2xl bg-ash p-[clamp(1.25rem,2vw,1.75rem)] lg:sticky lg:top-24">
          <p className="flex items-center gap-2.5 text-sm font-medium text-ink/70">
            {playing ? (
              <EqBars />
            ) : (
              <span aria-hidden className="flex h-4 items-end gap-0.5">
                <span className="h-1.5 w-0.5 bg-ink/30" />
                <span className="h-3 w-0.5 bg-ink/30" />
                <span className="h-2 w-0.5 bg-ink/30" />
              </span>
            )}
            Now playing
          </p>

          <NowPlayingCard />

          <div className="u-rule mt-6 border-t pt-5">
            <h2 className="text-sm font-medium text-ink/70">In the queue</h2>
            <ul className="mt-4 space-y-1.5">
              {queue.map((episode) => {
                const at = episodes.indexOf(episode);
                return (
                  <li key={episode.slug}>
                    <button
                      type="button"
                      onClick={() => tune(at)}
                      aria-label={`Play next: ${episode.title}`}
                      className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition-colors duration-(--dur-fast) hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <EpisodeCover
                        episode={episode}
                        compact
                        className="size-10 shrink-0 rounded-md text-[0.85rem]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink/90">
                          {episode.title}
                        </span>
                        <span className="block text-(length:--text-small) text-ink/50">{HOST}</span>
                      </span>
                      <span className="text-(length:--text-small) text-ink/45 tabular-nums">
                        {episode.duration ?? "—"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

/** The rail's centrepiece — split out only to keep the columns readable. */
function NowPlayingCard() {
  const { current } = usePlayer();
  return (
    <div className="mt-4">
      <EpisodeCover
        episode={current}
        className="w-full rounded-xl text-[clamp(1rem,1.4vw,1.4rem)]"
      />
      <p className="mt-4 truncate text-[max(1rem,15px)] font-medium">
        {current.title}
      </p>
      <p className="mt-0.5 text-sm text-ink/55">Hosted by {HOST}</p>
    </div>
  );
}
