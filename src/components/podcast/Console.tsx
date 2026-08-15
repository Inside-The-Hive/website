"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./player-context";

/**
 * The listening instrument.
 *
 * One dark console, built from the language of broadcast rather than of web
 * audio players: an on-air lamp, a meter that only moves when sound actually
 * moves, a transport of physical keys, and a tuning dial along the bottom with
 * the episodes laid out as stops.
 *
 * The restraint is deliberate. The page around this is quiet; the console is
 * the one place the design spends its depth — and even here, nothing animates
 * until the listener makes sound. A meter dancing over silence is decoration;
 * one that answers the audio is an instrument.
 */

/** Formats seconds as m:ss. NaN-safe for the moment before metadata. */
function clock(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * The meter. Reads the analyser each frame and draws honey bars on ink.
 *
 * Drawn on canvas rather than as DOM bars: sixty updates a second across
 * dozens of elements is layout work the compositor never needed to do.
 */
function Meter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyser, playing } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const styles = getComputedStyle(canvas);
    const honey = styles.getPropertyValue("--color-honey").trim() || "#f0a202";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const bins = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth: w, clientHeight: h } = canvas;
      if (canvas.width !== w * dpr) canvas.width = w * dpr;
      if (canvas.height !== h * dpr) canvas.height = h * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, w, h);

      const count = 48;
      const gap = 3;
      const bar = (w - gap * (count - 1)) / count;

      for (let i = 0; i < count; i += 1) {
        let level = 0.06; // the resting floor: the meter exists even in silence
        if (analyser && bins && playing && !reduced) {
          analyser.getByteFrequencyData(bins);
          // Speech lives low in the spectrum: spread the strip across the
          // bottom quarter of the bins so a voice moves most of the bars
          // rather than only the leftmost few.
          const bin = Math.floor((i / count) * bins.length * 0.25);
          level = Math.max(level, (bins[bin] / 255) * 0.95);
        }
        const height = Math.max(2, level * h);
        context.fillStyle = honey;
        context.globalAlpha = playing ? 0.9 : 0.35;
        context.fillRect(
          i * (bar + gap),
          (h - height) / 2, // grows from the centre line, like a VU strip
          bar,
          height,
        );
      }

      frame = requestAnimationFrame(draw);
    };

    if (playing && !reduced) {
      frame = requestAnimationFrame(draw);
    } else {
      draw(); // one static pass so the strip is present, just still
      cancelAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(frame);
  }, [analyser, playing]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="h-[clamp(3rem,8vh,5rem)] w-full"
    />
  );
}

/** Shared shell for the small transport keys. */
const KEY =
  "grid size-11 place-items-center rounded-full border border-white/15 text-white/70 " +
  "transition-[background-color,color,border-color,translate] duration-(--dur-fast) " +
  "hover:border-white/40 hover:text-white active:translate-y-px " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function Console() {
  const {
    current, episodes, index, playing, time, duration, volume,
    shuffle, repeat, toggle, tune, next, previous, seek, setVolume,
    toggleShuffle, cycleRepeat,
  } = usePlayer();

  const stated = duration || 0;

  return (
    <section
      aria-label="Podcast player"
      data-nav-invert
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      <div className="u-gutter py-[clamp(3rem,8vh,6rem)]">
        {/* The record itself. The numeral is the largest thing on the page —
            episode number is the one fact the whole console is organised
            around, so it carries the display weight. */}
        <div className="flex flex-wrap items-end gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-6">
          <p
            aria-hidden
            className="font-display text-[clamp(6rem,16vw,13rem)] leading-[0.8] font-extrabold tracking-[-0.05em] text-white/[0.13]"
          >
            {String(current.episodeNumber).padStart(2, "0")}
          </p>
          <div className="min-w-[16rem] flex-1 pb-2">
            <h2 className="max-w-[24ch] text-(length:--text-h2) leading-[1.02] font-normal text-balance">
              {current.title}
            </h2>
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/45">
              <span>Episode {current.episodeNumber}</span>
              <span aria-hidden>·</span>
              <span>{current.dateLabel}</span>
              <span aria-hidden>·</span>
              <span>{current.categoryLabel}</span>
            </p>
          </div>
        </div>

        {/* The meter, full width — the console's horizon line. */}
        <div className="mt-[clamp(1.5rem,4vh,3rem)]">
          <Meter />
        </div>

        {/* Seek. A thin rail directly under the meter, so the moving needle
            and the sound it measures read as one object. */}
        <div className="mt-3 flex items-center gap-4">
          <span className="w-11 text-sm text-white/45 tabular-nums">
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
            style={{
              // The filled portion, painted into the track by the CSS below.
              ["--fill" as string]: `${stated ? (time / stated) * 100 : 0}%`,
            }}
          />
          <span className="w-11 text-right text-sm text-white/45 tabular-nums">
            {stated ? clock(stated) : (current.duration ?? "—")}
          </span>
        </div>

        {/* Transport. One large physical key; everything else stays quiet. */}
        <div className="mt-[clamp(2rem,5vh,3rem)] flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleShuffle}
              aria-pressed={shuffle}
              aria-label="Shuffle"
              className={KEY}
              style={shuffle ? { color: "var(--color-honey)", borderColor: "rgba(240,162,2,0.5)" } : undefined}
            >
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 6h3.5c4.5 0 6 12 11 12H21M3 18h3.5c1.6 0 2.8-1.5 3.9-3.4M21 6h-3.5c-1.7 0-3 1.7-4.1 3.7" />
                <path d="m18.5 3.5 2.5 2.5-2.5 2.5M18.5 15.5 21 18l-2.5 2.5" />
              </svg>
            </button>

            <button type="button" onClick={previous} aria-label="Previous episode" className={KEY}>
              <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden>
                <path d="M6 5h2v14H6zM20 5.8v12.4c0 .8-.9 1.3-1.6.9l-9.6-6.2a1 1 0 0 1 0-1.7l9.6-6.2c.7-.5 1.6 0 1.6.8Z" />
              </svg>
            </button>

            {/* The key. Honey, raised, and it physically presses — depth is
                spent here and nowhere else. */}
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="group grid size-[clamp(4.25rem,8vw,5.5rem)] place-items-center rounded-full bg-honey text-ink transition-[translate,box-shadow,background-color] duration-(--dur-fast) hover:bg-[#ffb41f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{
                boxShadow:
                  "0 6px 0 rgba(107,45,14,0.9), 0 14px 32px -8px rgba(240,162,2,0.45)",
                translate: "0 0",
              }}
              onPointerDown={(event) => {
                (event.currentTarget as HTMLElement).style.translate = "0 4px";
                (event.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 0 rgba(107,45,14,0.9), 0 8px 18px -8px rgba(240,162,2,0.4)";
              }}
              onPointerUp={(event) => {
                (event.currentTarget as HTMLElement).style.translate = "0 0";
                (event.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 0 rgba(107,45,14,0.9), 0 14px 32px -8px rgba(240,162,2,0.45)";
              }}
              onPointerLeave={(event) => {
                (event.currentTarget as HTMLElement).style.translate = "0 0";
                (event.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 0 rgba(107,45,14,0.9), 0 14px 32px -8px rgba(240,162,2,0.45)";
              }}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
                  <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden>
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
              className={`${KEY} relative`}
              style={repeat !== "off" ? { color: "var(--color-honey)", borderColor: "rgba(240,162,2,0.5)" } : undefined}
            >
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12V9a3 3 0 0 1 3-3h13M20 12v3a3 3 0 0 1-3 3H4" />
                <path d="m17.5 3.5 2.5 2.5-2.5 2.5M6.5 15.5 4 18l2.5 2.5" />
              </svg>
              {repeat === "one" && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-honey text-[0.55rem] font-semibold text-ink">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Volume, kept small and to the side — a trim knob, not a feature. */}
          <div className="flex items-center gap-3">
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
              className="hive-rail w-28"
              style={{ ["--fill" as string]: `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* The dial. Episodes as stops on a tuning band — the queue, the
            browser and the "what else is there" in one ruler. The needle
            sits over whatever is tuned. */}
        <div className="mt-[clamp(2.5rem,6vh,4rem)] border-t border-white/10 pt-6">
          <p className="text-sm text-white/40">The dial</p>
          <div className="relative mt-5 overflow-x-auto pb-2" data-lenis-prevent>
            <div className="relative min-w-[34rem]">
              {/* Minor ticks: the ruler's texture. */}
              <div
                aria-hidden
                className="h-3 w-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(255,255,255,0.18) 0 1px, transparent 1px calc(100% / 60))",
                }}
              />
              {/* Major stops: one per episode, laid with space-between so the
                  band always spans the full rule. The tuned stop's own tick is
                  the needle — taller and lit — which keeps needle and stop
                  perfectly aligned by construction. */}
              <div className="mt-3 flex items-start justify-between">
                {episodes.map((episode, at) => {
                  const tuned = at === index;
                  return (
                    <button
                      key={episode.slug}
                      type="button"
                      onClick={() => tune(at)}
                      aria-label={`Tune to episode ${episode.episodeNumber}: ${episode.title}`}
                      aria-current={tuned ? "true" : undefined}
                      className="group flex flex-col items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span
                        aria-hidden
                        className={
                          tuned
                            ? "h-5 w-0.5 bg-honey"
                            : "h-4 w-px bg-white/35 transition-colors group-hover:bg-white/70"
                        }
                      />
                      <span
                        className={
                          tuned
                            ? "font-display text-xl font-extrabold text-honey"
                            : "font-display text-xl font-extrabold text-white/30 transition-colors group-hover:text-white/70"
                        }
                      >
                        {String(episode.episodeNumber).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
