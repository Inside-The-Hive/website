import Link from "next/link";
import { HexPrism } from "@/components/HexPrism";
import { HiveId } from "@/components/HiveId";
import { episodeCategories, podcastPlatforms } from "@/content/site";
import type { Episode } from "@/lib/content/schema";

/**
 * The podcast section.
 *
 * The problem this solves: cover art has not been delivered. A podcast section
 * built around artwork would be a section built around five shimmer skeletons.
 * So the dimensional interest has to come from something we own outright — the
 * honeycomb. An isometric extruded cell is the brand's own geometry, and it
 * needs no photography to look finished.
 *
 * The comb is inverted (ink ground) because it is the second of the two
 * inverted moments the design permits, and it separates the podcast from the
 * white event scroll above it. Events lead, podcast follows — the change of
 * ground is what marks the handover.
 *
 * Restraint: the comb is the one bold element. The episode list beside it is
 * deliberately plain — rules, numbers and type, no cards, no borders, no
 * chips. Everything competing with the comb was removed.
 */

const categoryLabel = new Map(episodeCategories.map((c) => [c.slug, c.label]));

/**
 * Ink-ground honey tones. Lightest face first: top, right wall, left wall.
 * All three are steps down the same hue — propolis in the shadow slot muddied
 * it, because a hue shift reads as two materials rather than one lit solid.
 */
const HONEY: [string, string, string] = ["#F0A202", "#C07E02", "#7A4F01"];

/**
 * Unlit cells. Dark enough to stay subordinate to the lit one, but with the
 * three faces far enough apart in lightness that each cell still reads as a
 * solid — too close together and the comb flattens into a grey smear.
 */
const DIM: [string, string, string] = ["#2A2A28", "#1E1E1C", "#121211"];

/**
 * The comb.
 *
 * Seven cells in the classic honeycomb arrangement: one centre, six around it.
 * Columns overlap horizontally by a quarter and offset vertically by half so
 * the cells tessellate the way real comb does rather than sitting in a grid.
 *
 * Only the centre cell is lit. A wall of uniformly bright cells would be
 * noise; one lit cell in a dim comb is a focal point, and it points at the
 * featured episode.
 */
function Comb({ episodeNumber }: { episodeNumber?: number }) {
  /**
   * Tessellation, derived rather than eyeballed. For flat-top hexagons the
   * horizontal step is 3/4 of a cell's width and the vertical step is the full
   * height of its top face, with alternate columns dropped by half that. Any
   * other spacing makes the cells overlap into a blob instead of interlocking.
   *
   * Against the 250×209 bounding box those steps resolve to the percentages
   * below: 30% across, 23.923% down, each cell 40% of the box wide.
   *
   * Order matters as much as position. Each cell's art box is taller than its
   * top face — the extruded walls hang below it — so a cell drawn later paints
   * over the walls of the one behind it. Listing them back-to-front (ascending
   * row) is a painter's algorithm, and it is what makes the comb read as a
   * solid stack rather than a pile of overlapping flat shapes.
   */
  const cells = [
    { col: 1, row: 0, lit: false },
    { col: 0, row: 0.5, lit: false },
    { col: 2, row: 0.5, lit: false },
    { col: 0, row: 1.5, lit: false },
    { col: 2, row: 1.5, lit: false },
    { col: 1, row: 2, lit: false },
    // The lit cell paints last, out of depth order. It is the focal point, and
    // a cell in front of it would clip the walls that make it read as solid.
    { col: 1, row: 1, lit: true },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
      {/* 83.6% is the 250×209 box's own ratio — the comb defines its height
          rather than being fitted into an arbitrary one. */}
      <div className="relative pb-[83.6%]">
        {cells.map((cell) => (
          <div
            key={`${cell.col}-${cell.row}`}
            className="group absolute w-[40%]"
            style={{
              left: `${cell.col * 30}%`,
              top: `${cell.row * 23.923}%`,
            }}
          >
            <HexPrism
              tones={cell.lit ? HONEY : DIM}
              interactive={cell.lit}
            />

            {/* The episode number is set into the lit cell — the catalogue
                number the whole site is organised around, given physical
                form. The top face's centre sits at y=50 in a 109-tall art
                box, so 46% lands the digits on that plane rather than on the
                walls below it. */}
            {cell.lit && episodeNumber && (
              <span
                className="u-label absolute inset-x-0 top-[46%] -translate-y-1/2 text-center text-ink"
                aria-hidden
              >
                {String(episodeNumber).padStart(3, "0")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** One row in the episode list. A rule, a number, a title, a runtime. */
function EpisodeRow({ episode }: { episode: Episode }) {
  return (
    <li>
      <Link
        href={`/podcast/${episode.slug}`}
        className="group u-rule flex items-baseline gap-5 border-t border-white/12 py-5 transition-colors duration-(--dur-fast) ease-(--ease-out-expo) hover:border-honey sm:gap-8"
      >
        <span className="u-label shrink-0 text-white/40 tabular-nums transition-colors duration-(--dur-fast) group-hover:text-honey">
          {episode.episodeNumber
            ? String(episode.episodeNumber).padStart(3, "0")
            : "—"}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-white">{episode.title}</span>
          {episode.guest && (
            <span className="u-label mt-1.5 block text-white/40">
              {episode.guest}
              {episode.guestRole ? ` — ${episode.guestRole}` : ""}
            </span>
          )}
        </span>

        <span className="u-label hidden shrink-0 text-white/40 sm:block">
          {categoryLabel.get(episode.category)}
        </span>

        {episode.duration && (
          <span className="u-label w-14 shrink-0 text-right text-white/40 tabular-nums">
            {episode.duration}
          </span>
        )}
      </Link>
    </li>
  );
}

export function PodcastSection({
  featured,
  episodes,
  total,
}: {
  featured: Episode | null;
  /** The rows beneath the featured episode. */
  episodes: Episode[];
  total: number;
}) {
  const platforms = podcastPlatforms.filter((p) => p.href !== "TODO");

  return (
    <section data-nav-invert className="u-section bg-ink text-white">
      <div className="u-gutter">
        <div className="mb-16 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-(length:--text-h2)">The podcast</h2>
          <Link
            href="/podcast"
            className="u-label inline-flex min-h-11 items-center text-white/60 transition-colors duration-(--dur-fast) hover:text-honey"
          >
            All episodes ({String(total).padStart(2, "0")}) →
          </Link>
        </div>

        {featured ? (
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Comb episodeNumber={featured.episodeNumber} />
            </div>

            <div className="lg:col-span-7">
              <HiveId id={featured.hiveId} />
              <h3 className="mt-6 text-(length:--text-h1) text-white">
                {featured.title}
              </h3>
              {featured.guest && (
                <p className="u-label mt-6 text-white/60">
                  {featured.guest}
                  {featured.guestRole ? ` — ${featured.guestRole}` : ""}
                </p>
              )}
              <p className="mt-6 max-w-xl text-white/70">{featured.summary}</p>

              <Link
                href={`/podcast/${featured.slug}`}
                className="u-label mt-10 inline-flex min-h-12 items-center bg-honey px-8 text-ink transition-colors duration-(--dur-fast) ease-(--ease-out-expo) hover:bg-white"
              >
                Play episode
              </Link>
            </div>
          </div>
        ) : (
          <p className="max-w-2xl text-white/55">
            Episodes are being migrated into the new catalogue.
          </p>
        )}

        {episodes.length > 0 && (
          <ul className="mt-24 border-b border-white/12">
            {episodes.map((episode) => (
              <EpisodeRow key={episode.slug} episode={episode} />
            ))}
          </ul>
        )}

        {platforms.length > 0 && (
          <div className="mt-16">
            <p className="u-label mb-5 text-white/40">Listen on</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {platforms.map((platform) => (
                <li key={platform.label}>
                  <a
                    href={platform.href}
                    target="_blank"
                    rel="noopener"
                    data-analytics="podcast-outbound"
                    data-platform={platform.label}
                    className="u-label inline-flex min-h-11 items-center text-white/60 transition-colors duration-(--dur-fast) hover:text-honey"
                  >
                    {platform.label} <span aria-hidden>&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
