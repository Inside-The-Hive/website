import type { PlayerEpisode } from "./player-context";

/**
 * Episode cover art, generated rather than uploaded.
 *
 * No artwork files exist for the catalogue yet, and a grid of grey squares
 * would make the whole page feel unfinished. Instead each episode gets a
 * typographic cover built from the brand's own palette — a duotone per
 * category, the episode numeral as the artwork, the title as the caption.
 * Five categories, five colourways, so the shelf reads as one series with
 * distinct spines.
 *
 * When real cover art lands (the schema's `coverImage` field), this component
 * becomes the fallback rather than the default.
 */

type Theme = {
  /** Cover ground and artwork ink. */
  ground: string;
  art: string;
  /** The flat tint the now-playing stage takes behind this cover. */
  stage: string;
};

/** All values are drawn from the site palette or darkened versions of it. */
export const CATEGORY_THEMES: Record<string, Theme> = {
  web3: { ground: "#f0a202", art: "#0a0a0a", stage: "#241903" },
  crypto: { ground: "#0a0a0a", art: "#f0a202", stage: "#121212" },
  nft: { ground: "#6b2d0e", art: "#f2e8d5", stage: "#1a0b04" },
  "creator-and-socialfi": { ground: "#f2e8d5", art: "#6b2d0e", stage: "#191308" },
  blockchain: { ground: "#141414", art: "#ffffff", stage: "#101010" },
};

const FALLBACK: Theme = { ground: "#0a0a0a", art: "#f0a202", stage: "#121212" };

export function themeFor(category: string) {
  return CATEGORY_THEMES[category] ?? FALLBACK;
}

export function EpisodeCover({
  episode,
  /** Compact hides the caption row — the bar's thumbnail is too small for it. */
  compact = false,
  className = "",
}: {
  episode: PlayerEpisode;
  compact?: boolean;
  className?: string;
}) {
  const theme = themeFor(episode.category);

  return (
    <div
      aria-hidden
      className={`relative flex aspect-square flex-col justify-between overflow-hidden ${className}`}
      style={{ background: theme.ground, color: theme.art }}
    >
      {compact ? (
        <span className="grid size-full place-items-center font-display text-[2em] leading-none font-extrabold">
          {String(episode.episodeNumber).padStart(2, "0")}
        </span>
      ) : (
        <>
          <div className="flex items-baseline justify-between p-[6%]">
            <span className="text-[0.6em] font-medium">Inside The Hive</span>
            <span className="text-[0.55em] opacity-70">{episode.hiveId}</span>
          </div>

          <span className="text-center font-display text-[5.2em] leading-[0.85] font-extrabold tracking-tighter">
            {String(episode.episodeNumber).padStart(2, "0")}
          </span>

          <div className="flex items-end justify-between gap-[4%] p-[6%]">
            <span className="max-w-[70%] text-[0.7em] leading-snug font-medium text-balance">
              {episode.title}
            </span>
            <span className="text-[0.55em] whitespace-nowrap opacity-70">
              {episode.categoryLabel}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
