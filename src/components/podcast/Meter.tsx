"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./player-context";

/**
 * The live meter — honey bars that answer the audio through the analyser.
 *
 * Canvas rather than DOM bars: sixty updates a second across dozens of
 * elements is layout work the compositor never needed to do. At rest it holds
 * a dim floor; under reduced motion it never animates.
 */
export function Meter({ className = "" }: { className?: string }) {
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
        let level = 0.06;
        if (analyser && bins && playing && !reduced) {
          analyser.getByteFrequencyData(bins);
          // Speech lives low in the spectrum — spread the strip across the
          // bottom quarter of the bins so a voice moves most of the bars.
          const bin = Math.floor((i / count) * bins.length * 0.25);
          level = Math.max(level, (bins[bin] / 255) * 0.95);
        }
        const height = Math.max(2, level * h);
        context.fillStyle = honey;
        context.globalAlpha = playing ? 0.9 : 0.35;
        context.fillRect(i * (bar + gap), (h - height) / 2, bar, height);
      }

      frame = requestAnimationFrame(draw);
    };

    if (playing && !reduced) {
      frame = requestAnimationFrame(draw);
    } else {
      draw();
      cancelAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(frame);
  }, [analyser, playing]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
