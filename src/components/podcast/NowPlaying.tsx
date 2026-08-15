"use client";

import { useEffect, useState } from "react";
import { EpisodeCover, themeFor } from "./EpisodeCover";
import { Meter } from "./Meter";
import { usePlayer } from "./player-context";

/**
 * The now-playing stage and the panels that scroll over it.
 *
 * The stage is the full first viewport: the episode's cover art centred on a
 * flat tinted ground, the tint taken from the cover's own colourway so each
 * episode changes the room's light. It pins while the detail panels — about,
 * credits, up next — scroll up over it, dimming the art behind them.
 *
 * Flat tint, deliberately. The dimming overlay is a plain black veil driven by
 * scroll, not a gradient wash.
 */

export function NowPlaying() {
  const { current, episodes, index, tune } = usePlayer();
  const [veil, setVeil] = useState(0);

  // The stage dims as the panels arrive over it.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const vh = window.innerHeight;
      setVeil(Math.min(window.scrollY / (vh * 0.9), 0.72));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const theme = themeFor(current.category);
  const upNext = episodes[(index + 1) % episodes.length];
  const hasGuest =
    current.guest && !current.guest.startsWith("TODO") ? current.guest : null;

  return (
    <div className="relative" data-nav-invert>
      {/* The stage. Sticky so the panels scroll over it, the way a fullscreen
          player sits behind its own detail cards. */}
      <div
        className="sticky top-0 flex h-svh flex-col items-center justify-center transition-colors duration-(--dur-slow)"
        style={{ backgroundColor: theme.stage }}
      >
        {/* Show name, quiet, where a playlist title would sit. */}
        <p className="absolute top-24 left-[var(--spacing-gutter)] text-sm text-white/55">
          Inside The Hive · the podcast
        </p>

        <EpisodeCover
          episode={current}
          className="w-[min(56vh,26rem,84vw)] text-[min(3.4vh,1.6rem)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        />

        {/* The live meter under the art — the one moving thing, and only
            when sound moves. */}
        <Meter className="mt-8 h-10 w-[min(56vh,26rem,84vw)]" />

        {/* The veil the panels pull over the stage. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: veil }}
        />
      </div>

      {/* The panels. They begin a little before the stage's end so they read
          as sliding over the art rather than after it. */}
      <div className="relative z-10 mx-auto w-full max-w-[80rem] px-[var(--spacing-gutter)] pb-[clamp(4rem,10vh,7rem)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* About — the guest when one is on record, the episode until then. */}
          <section
            aria-label={hasGuest ? "About the guest" : "About this episode"}
            className="rounded-lg bg-ink/90 p-[clamp(1.5rem,3vw,2.5rem)] text-white backdrop-blur-md"
          >
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {hasGuest ? "About the guest" : "About this episode"}
            </h2>
            {hasGuest ? (
              <>
                <p className="mt-6 text-xl font-medium">{current.guest}</p>
                {current.guestRole && !current.guestRole.startsWith("TODO") && (
                  <p className="mt-1 text-white/55">{current.guestRole}</p>
                )}
                <p className="mt-5 leading-relaxed text-white/75">{current.summary}</p>
              </>
            ) : (
              <>
                <p className="mt-6 leading-relaxed text-white/80">{current.summary}</p>
                <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/50">
                  <span>Episode {current.episodeNumber}</span>
                  <span aria-hidden>·</span>
                  <span>{current.dateLabel}</span>
                  <span aria-hidden>·</span>
                  <span>{current.duration ?? "—"}</span>
                </p>
              </>
            )}
          </section>

          <div className="flex flex-col gap-4">
            {/* Credits — only what is actually on record. */}
            <section
              aria-label="Credits"
              className="rounded-lg bg-ink/90 p-[clamp(1.5rem,3vw,2.5rem)] text-white backdrop-blur-md"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Credits
              </h2>
              <dl className="mt-6 space-y-4">
                {hasGuest && (
                  <div>
                    <dt className="text-white/90">{current.guest}</dt>
                    <dd className="text-sm text-white/50">Guest</dd>
                  </div>
                )}
                <div>
                  <dt className="text-white/90">Inside The Hive</dt>
                  <dd className="text-sm text-white/50">Production</dd>
                </div>
                <div>
                  <dt className="text-white/90">{current.categoryLabel}</dt>
                  <dd className="text-sm text-white/50">Filed under</dd>
                </div>
                <div>
                  <dt className="text-white/90">{current.hiveId}</dt>
                  <dd className="text-sm text-white/50">Catalogue</dd>
                </div>
              </dl>
            </section>

            {/* Up next — one card, the queue's head. The full queue is the
                ledger below the stage. */}
            <section
              aria-label="Next in queue"
              className="rounded-lg bg-ink/90 p-[clamp(1.5rem,3vw,2.5rem)] text-white backdrop-blur-md"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Next in queue
                </h2>
              </div>
              <button
                type="button"
                onClick={() => tune((index + 1) % episodes.length)}
                className="mt-6 flex w-full items-center gap-4 rounded-md p-2 -m-2 text-left transition-colors duration-(--dur-fast) hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <EpisodeCover
                  episode={upNext}
                  compact
                  className="size-12 shrink-0 rounded-sm text-[1rem]"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{upNext.title}</span>
                  <span className="block text-sm text-white/50">
                    Episode {upNext.episodeNumber} · {upNext.duration ?? "—"}
                  </span>
                </span>
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
