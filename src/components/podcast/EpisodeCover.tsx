import type { PlayerEpisode } from "./player-context";

/**
 * Episode cover art.
 *
 * Real artwork first: the catalogue's own per-episode covers, pulled from the
 * show's feed by scripts/fetch-podcast.mjs and served locally. The typographic
 * duotone — episode numeral as the artwork, title as the caption — remains as
 * the fallback for any entry that arrives without art, so a missing image
 * degrades to something designed rather than to a grey square.
 */

type Theme = {
  /** Cover ground and artwork ink. */
  ground: string;
  art: string;
  /** A flat dark tint derived from the colourway, for surfaces behind it. */
  stage: string;
};

/** All values are drawn from the site palette or darkened versions of it. */
export const CATEGORY_THEMES: Record<string, Theme> = {
  web3: { ground: "#fbc903", art: "#0a0a0a", stage: "#241903" },
  crypto: { ground: "#0a0a0a", art: "#fbc903", stage: "#121212" },
  nft: { ground: "#6b2d0e", art: "#f2e8d5", stage: "#1a0b04" },
  "creator-and-socialfi": { ground: "#f2e8d5", art: "#6b2d0e", stage: "#191308" },
  blockchain: { ground: "#141414", art: "#ffffff", stage: "#101010" },
};

const FALLBACK: Theme = { ground: "#0a0a0a", art: "#fbc903", stage: "#121212" };

export function themeFor(category?: string) {
  return (category && CATEGORY_THEMES[category]) || FALLBACK;
}

export function EpisodeCover({
  episode,
  /** Compact drops the caption row — a thumbnail is too small for it. */
  compact = false,
  className = "",
}: {
  episode: PlayerEpisode;
  compact?: boolean;
  className?: string;
}) {
  // The real cover, when the catalogue supplies one. Sized by the caller's
  // class; a plain img because the files are pre-resized local webp.
  if (episode.cover) {
    return (
      <div
        aria-hidden
        className={`relative aspect-square overflow-hidden bg-ash ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized local asset */}
        <img
          src={episode.cover}
          alt=""
          loading="lazy"
          className="size-full object-cover"
          draggable={false}
        />
      </div>
    );
  }

  const theme = themeFor(episode.category);
  const numeral =
    episode.episodeNumber != null
      ? String(episode.episodeNumber).padStart(2, "0")
      : "—";

  return (
    <div
      aria-hidden
      className={`relative flex aspect-square flex-col justify-between overflow-hidden ${className}`}
      style={{ background: theme.ground, color: theme.art }}
    >
      {compact ? (
        <span className="grid size-full place-items-center font-display text-[2em] leading-none font-semibold">
          {numeral}
        </span>
      ) : (
        <>
          <div className="flex items-baseline justify-between p-[6%]">
            <span className="text-[0.6em] font-medium">Inside The Hive</span>
            {episode.hiveId && (
              <span className="text-[0.55em] opacity-70">{episode.hiveId}</span>
            )}
          </div>

          <span className="text-center font-display text-[5.2em] leading-[0.85] font-semibold tracking-tight">
            {numeral}
          </span>

          <div className="flex items-end justify-between gap-[4%] p-[6%]">
            <span className="max-w-[70%] text-[0.7em] leading-snug font-medium text-balance">
              {episode.title}
            </span>
            {episode.categoryLabel && (
              <span className="text-[0.55em] whitespace-nowrap opacity-70">
                {episode.categoryLabel}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
