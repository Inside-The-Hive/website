"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * The one audio pipeline behind the podcast page.
 *
 * A single <audio> element lives here and every surface — the console, the
 * dial, the episode ledger — drives it through this context. One element,
 * because two surfaces each owning their own player is how a page ends up
 * playing two episodes at once.
 *
 * The element is also the analyser's source, so the context owns the Web Audio
 * graph too. The AudioContext is created lazily on the first play: browsers
 * refuse to start one before a user gesture, and creating it at mount would
 * leave it permanently suspended.
 */

/** What the page needs to know about an episode. Serialisable — no Dates. */
export type PlayerEpisode = {
  slug: string;
  title: string;
  episodeNumber: number;
  hiveId: string;
  category: string;
  /** Pre-formatted for display; the loader owns date formatting. */
  dateLabel: string;
  /** Stated runtime from the catalogue, shown before metadata loads. */
  duration?: string;
  /** Path under /public. Absent means the episode plays elsewhere. */
  audio?: string;
  summary: string;
};

export type RepeatMode = "off" | "all" | "one";

type PlayerState = {
  episodes: PlayerEpisode[];
  index: number;
  current: PlayerEpisode;
  playing: boolean;
  time: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  /** True once the listener has interacted — gates the analyser. */
  engaged: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  tune: (index: number, autoplay?: boolean) => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  /** The analyser node, present once audio has started. */
  analyser: AnalyserNode | null;
};

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const state = useContext(PlayerContext);
  if (!state) throw new Error("usePlayer must sit inside PlayerProvider");
  return state;
}

export function PlayerProvider({
  episodes,
  children,
}: {
  episodes: PlayerEpisode[];
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [engaged, setEngaged] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  /**
   * Refs mirror the state the `ended` handler needs. The handler is attached
   * once; reading state directly would freeze its first render's values.
   */
  const modeRef = useRef({ shuffle, repeat, index });
  modeRef.current = { shuffle, repeat, index };

  const graphRef = useRef<{ context: AudioContext } | null>(null);

  /** Builds the analyser graph on first play. Safe to call repeatedly. */
  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || graphRef.current) return;

    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const node = context.createAnalyser();
    // 64 bins is plenty for a decorative meter, and the small FFT keeps the
    // per-frame read cheap.
    node.fftSize = 128;
    node.smoothingTimeConstant = 0.82;
    source.connect(node);
    node.connect(context.destination);

    graphRef.current = { context };
    setAnalyser(node);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !episodes[modeRef.current.index]?.audio) return;
    ensureGraph();
    graphRef.current?.context.resume();
    setEngaged(true);
    void audio.play();
  }, [episodes, ensureGraph]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) play();
    else pause();
  }, [play, pause]);

  const tune = useCallback(
    (nextIndex: number, autoplay = true) => {
      const bounded = ((nextIndex % episodes.length) + episodes.length) % episodes.length;
      setIndex(bounded);
      setTime(0);
      // The element's src changes on render; play must wait for it.
      requestAnimationFrame(() => {
        if (autoplay) play();
      });
    },
    [episodes.length, play],
  );

  const pickNext = useCallback(() => {
    const { shuffle: shuffled, index: at } = modeRef.current;
    if (!shuffled) return at + 1;
    if (episodes.length < 2) return at;
    // Random, but never the one already playing.
    let candidate = at;
    while (candidate === at) {
      candidate = Math.floor(Math.random() * episodes.length);
    }
    return candidate;
  }, [episodes.length]);

  const next = useCallback(() => tune(pickNext()), [tune, pickNext]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    // The convention every player shares: early in a track, go back one;
    // otherwise restart the one playing.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    tune(modeRef.current.index - 1);
  }, [tune]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setTime(seconds);
  }, []);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((value) => !value), []);

  const cycleRepeat = useCallback(
    () =>
      setRepeat((mode) => (mode === "off" ? "all" : mode === "all" ? "one" : "off")),
    [],
  );

  // Element events are the single source of truth for playing/time — state
  // follows the element rather than trying to predict it.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      const { repeat: mode, index: at } = modeRef.current;
      if (mode === "one") {
        audio.currentTime = 0;
        void audio.play();
        return;
      }
      const isLast = at === episodes.length - 1;
      if (isLast && mode === "off" && !modeRef.current.shuffle) {
        setPlaying(false);
        return;
      }
      // Everything else advances: repeat-all wraps, shuffle draws again.
      const target = modeRef.current.shuffle
        ? (() => {
            let candidate = at;
            while (candidate === at && episodes.length > 1) {
              candidate = Math.floor(Math.random() * episodes.length);
            }
            return candidate;
          })()
        : (at + 1) % episodes.length;
      setIndex(target);
      setTime(0);
      requestAnimationFrame(() => void audio.play());
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
    // volume is set imperatively in setVolume; only the element binding matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes.length]);

  const current = episodes[index];

  const value = useMemo<PlayerState>(
    () => ({
      episodes,
      index,
      current,
      playing,
      time,
      duration,
      volume,
      shuffle,
      repeat,
      engaged,
      play,
      pause,
      toggle,
      tune,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      cycleRepeat,
      analyser,
    }),
    [
      episodes, index, current, playing, time, duration, volume, shuffle,
      repeat, engaged, play, pause, toggle, tune, next, previous, seek,
      setVolume, toggleShuffle, cycleRepeat, analyser,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {/* The element itself. crossOrigin not needed — same-origin files. */}
      {/* biome-ignore lint/a11y/useMediaCaption: podcast audio; transcript
          lives with the episode's show notes, not as a caption track. */}
      <audio ref={audioRef} src={current?.audio} preload="metadata" />
      {children}
    </PlayerContext.Provider>
  );
}
