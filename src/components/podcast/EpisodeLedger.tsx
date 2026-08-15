"use client";

import { usePlayer } from "./player-context";

/**
 * The catalogue, as a ledger.
 *
 * Rows under hairline rules rather than cards: episodes are entries in one
 * ongoing record, and the site already separates content with rules and space
 * everywhere else. Each row is a control — pressing it tunes the console and
 * plays — so the list is not a menu pointing at a player somewhere else; it is
 * the player, continued.
 *
 * The playing row is marked by a small live meter (three CSS bars) rather than
 * a "now playing" badge. The mark answers the audio: paused, the bars stand
 * still.
 */

export function EpisodeLedger() {
  const { episodes, index, playing, tune, toggle } = usePlayer();

  // Ledger reads newest first, like the rest of the site's catalogues. The
  // player's own order stays chronological — this is only a view.
  const rows = [...episodes].reverse();

  return (
    <section
      aria-labelledby="ledger-heading"
      className="u-section relative z-10 bg-white text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="ledger-heading" className="text-(length:--text-h2) font-normal">
            Every conversation
          </h2>
          <p className="text-sm text-ink/50">
            {episodes.length} episodes · more on the way
          </p>
        </div>

        <ol className="u-rule border-t">
          {rows.map((episode) => {
            const at = episodes.indexOf(episode);
            const active = at === index;

            return (
              <li key={episode.slug} className="u-rule border-b">
                <button
                  type="button"
                  onClick={() => (active ? toggle() : tune(at))}
                  aria-label={
                    active
                      ? playing
                        ? `Pause episode ${episode.episodeNumber}`
                        : `Play episode ${episode.episodeNumber}`
                      : `Play episode ${episode.episodeNumber}: ${episode.title}`
                  }
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.25rem,3vh,2rem)] text-left transition-colors duration-(--dur-fast) hover:bg-ash/60 md:grid-cols-[3.5rem_1fr_auto_auto_3rem]"
                >
                  {/* The number anchors the row — it is the same numeral the
                      dial uses, so the two surfaces read as one catalogue. */}
                  <span
                    className={
                      active
                        ? "font-display text-lg font-extrabold text-honey tabular-nums"
                        : "font-display text-lg font-extrabold text-ink/30 tabular-nums transition-colors group-hover:text-ink/60"
                    }
                  >
                    {String(episode.episodeNumber).padStart(2, "0")}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={
                        active
                          ? "block text-(length:--text-h3) leading-tight font-normal"
                          : "block text-(length:--text-h3) leading-tight font-normal transition-colors"
                      }
                    >
                      {episode.title}
                    </span>
                    <span className="mt-2 block max-w-prose text-ink/55">
                      {episode.summary}
                    </span>
                  </span>

                  <span className="hidden text-sm text-ink/45 md:block">
                    {episode.categoryLabel}
                  </span>

                  <span className="hidden text-sm text-ink/45 tabular-nums md:block">
                    {episode.duration ?? "—"}
                  </span>

                  {/* Row state: live bars while this row is the one on air,
                      a play glyph in reserve for every other row. */}
                  <span className="justify-self-end self-center">
                    {active && playing ? (
                      <span aria-hidden className="flex h-4 items-end gap-0.5">
                        <span className="hive-eq w-0.5 bg-honey" />
                        <span className="hive-eq w-0.5 bg-honey [animation-delay:0.18s]" />
                        <span className="hive-eq w-0.5 bg-honey [animation-delay:0.34s]" />
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className={
                          active
                            ? "grid size-9 place-items-center rounded-full border border-honey text-honey"
                            : "grid size-9 place-items-center rounded-full border border-(--color-line) text-ink/40 transition-colors duration-(--dur-fast) group-hover:border-ink/40 group-hover:text-ink"
                        }
                      >
                        <svg viewBox="0 0 24 24" className="ml-0.5 size-3.5" fill="currentColor">
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
    </section>
  );
}
