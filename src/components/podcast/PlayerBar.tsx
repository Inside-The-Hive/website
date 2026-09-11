"use client";

import { EpisodeCover } from "./EpisodeCover";
import { Meter } from "./Meter";
import { usePlayer } from "./player-context";

/**
 * The docked transport — a floating pill at the foot of the page.
 *
 * Reference layout: what's playing on the left, the keys in the middle, and a
 * live waveform running through the centre. The waveform is the seek bar —
 * an invisible range input sits over the meter, so clicking or dragging
 * anywhere on it scrubs, with the keyboard and screen-reader semantics of a
 * real slider rather than a click handler on a canvas.
 */

/** The show's presenter, as supplied by the client. */
const HOST = "Feezy";

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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-[var(--spacing-gutter)] pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="pointer-events-auto mx-auto flex max-w-[64rem] items-center gap-3 rounded-2xl border border-white/10 bg-ink/95 px-4 py-3 text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md md:gap-5 md:px-6">
        {/* What's on. */}
        <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:basis-56">
          <EpisodeCover
            episode={current}
            compact
            className="size-11 shrink-0 rounded-lg text-[0.95rem]"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{current.title}</p>
            <p className="truncate text-(length:--text-small) text-white/50">{HOST}</p>
          </div>
        </div>

        {/* Keys. */}
        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" onClick={previous} aria-label="Previous episode" className={KEY}>
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d="M6 5h2v14H6zM20 5.8v12.4c0 .8-.9 1.3-1.6.9l-9.6-6.2a1 1 0 0 1 0-1.7l9.6-6.2c.7-.5 1.6 0 1.6.8Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid size-11 place-items-center rounded-full bg-honey text-ink transition-transform duration-(--dur-fast) hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden>
                <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 size-4.5" fill="currentColor" aria-hidden>
                <path d="M7 4.8v14.4c0 .9 1 1.4 1.7.9l11-7.2a1.1 1.1 0 0 0 0-1.8l-11-7.2c-.7-.5-1.7 0-1.7.9Z" />
              </svg>
            )}
          </button>
          <button type="button" onClick={next} aria-label="Next episode" className={KEY}>
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d="M16 5h2v14h-2zM4 5.8v12.4c0 .8.9 1.3 1.6.9l9.6-6.2a1 1 0 0 0 0-1.7L5.6 5c-.7-.5-1.6 0-1.6.8Z" />
            </svg>
          </button>
        </div>

        {/* The waveform, which is also the seek. */}
        <div className="relative hidden min-w-0 flex-1 items-center md:flex">
          <Meter className="h-9 w-full" />
          <input
            type="range"
            aria-label="Seek"
            min={0}
            max={stated || 1}
            step={0.1}
            value={Math.min(time, stated || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            // Transparent and full-bleed over the meter: the meter is the
            // visual, this carries the interaction and the semantics.
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </div>

        <p className="hidden shrink-0 text-(length:--text-small) text-white/50 tabular-nums md:block">
          {clock(time)} / {stated ? clock(stated) : (current.duration ?? "—")}
        </p>

        {/* Trim controls. */}
        <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
          <button
            type="button"
            onClick={toggleShuffle}
            aria-pressed={shuffle}
            aria-label="Shuffle"
            className={KEY}
            style={shuffle ? { color: "var(--color-honey)" } : undefined}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 6h3.5c4.5 0 6 12 11 12H21M3 18h3.5c1.6 0 2.8-1.5 3.9-3.4M21 6h-3.5c-1.7 0-3 1.7-4.1 3.7" />
              <path d="m18.5 3.5 2.5 2.5-2.5 2.5M18.5 15.5 21 18l-2.5 2.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={cycleRepeat}
            aria-label={
              repeat === "off" ? "Repeat off" : repeat === "all" ? "Repeat all" : "Repeat one"
            }
            className={`${KEY} relative`}
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

        {/* Volume, desktop only. */}
        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
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
            className="hive-rail w-20"
            style={{ ["--fill" as string]: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
