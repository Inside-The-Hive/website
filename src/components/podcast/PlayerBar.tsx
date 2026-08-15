"use client";

import { EpisodeCover } from "./EpisodeCover";
import { usePlayer } from "./player-context";

/**
 * The docked transport — the player's hands, pinned to the foot of the page.
 *
 * The stage above shows what is playing; this is where it is driven from. It
 * stays put while the listener browses the ledger or reads the panels, so
 * pressing pause never means scrolling back to find the player.
 */

function clock(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const KEY =
  "grid size-10 place-items-center rounded-full text-white/65 transition-colors " +
  "duration-(--dur-fast) hover:text-white focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-white";

export function PlayerBar() {
  const {
    current, playing, time, duration, volume, shuffle, repeat,
    toggle, next, previous, seek, setVolume, toggleShuffle, cycleRepeat,
  } = usePlayer();

  const stated = duration || 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 text-white backdrop-blur-md">
      <div className="mx-auto grid max-w-[100rem] grid-cols-[1fr_auto] items-center gap-x-4 px-[var(--spacing-gutter)] py-3 md:grid-cols-[1fr_auto_1fr] md:gap-x-8">
        {/* What's on. */}
        <div className="flex min-w-0 items-center gap-3">
          <EpisodeCover
            episode={current}
            compact
            className="size-12 shrink-0 rounded-sm text-[1rem]"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{current.title}</p>
            <p className="truncate text-sm text-white/50">
              Episode {current.episodeNumber} · Inside The Hive
            </p>
          </div>
        </div>

        {/* Transport with its own seek — one column, centred. */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleShuffle}
              aria-pressed={shuffle}
              aria-label="Shuffle"
              className={`${KEY} hidden sm:grid`}
              style={shuffle ? { color: "var(--color-honey)" } : undefined}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 6h3.5c4.5 0 6 12 11 12H21M3 18h3.5c1.6 0 2.8-1.5 3.9-3.4M21 6h-3.5c-1.7 0-3 1.7-4.1 3.7" />
                <path d="m18.5 3.5 2.5 2.5-2.5 2.5M18.5 15.5 21 18l-2.5 2.5" />
              </svg>
            </button>

            <button type="button" onClick={previous} aria-label="Previous episode" className={KEY}>
              <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden>
                <path d="M6 5h2v14H6zM20 5.8v12.4c0 .8-.9 1.3-1.6.9l-9.6-6.2a1 1 0 0 1 0-1.7l9.6-6.2c.7-.5 1.6 0 1.6.8Z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="mx-1 grid size-11 place-items-center rounded-full bg-white text-ink transition-transform duration-(--dur-fast) hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                  <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
                  <path d="M7 4.8v14.4c0 .9 1 1.4 1.7.9l11-7.2a1.1 1.1 0 0 0 0-1.8l-11-7.2c-.7-.5-1.7 0-1.7.9Z" />
                </svg>
              )}
            </button>

            <button type="button" onClick={next} aria-label="Next episode" className={KEY}>
              <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden>
                <path d="M16 5h2v14h-2zM4 5.8v12.4c0 .8.9 1.3 1.6.9l9.6-6.2a1 1 0 0 0 0-1.7L5.6 5c-.7-.5-1.6 0-1.6.8Z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={cycleRepeat}
              aria-label={
                repeat === "off" ? "Repeat off" : repeat === "all" ? "Repeat all" : "Repeat one"
              }
              className={`${KEY} relative hidden sm:grid`}
              style={repeat !== "off" ? { color: "var(--color-honey)" } : undefined}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12V9a3 3 0 0 1 3-3h13M20 12v3a3 3 0 0 1-3 3H4" />
                <path d="m17.5 3.5 2.5 2.5-2.5 2.5M6.5 15.5 4 18l2.5 2.5" />
              </svg>
              {repeat === "one" && (
                <span className="absolute top-0 right-0 grid size-3.5 place-items-center rounded-full bg-honey text-[0.5rem] font-semibold text-ink">
                  1
                </span>
              )}
            </button>
          </div>

          <div className="hidden w-[min(36rem,44vw)] items-center gap-3 md:flex">
            <span className="w-10 text-right text-xs text-white/45 tabular-nums">
              {clock(time)}
            </span>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={stated || 1}
              step={0.1}
              value={Math.min(time, stated || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              className="hive-rail flex-1"
              style={{ ["--fill" as string]: `${stated ? (time / stated) * 100 : 0}%` }}
            />
            <span className="w-10 text-xs text-white/45 tabular-nums">
              {stated ? clock(stated) : (current.duration ?? "—")}
            </span>
          </div>
        </div>

        {/* Volume, far right, desktop only. */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          <svg viewBox="0 0 24 24" className="size-4 text-white/45" fill="currentColor" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="hive-rail w-24"
            style={{ ["--fill" as string]: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
