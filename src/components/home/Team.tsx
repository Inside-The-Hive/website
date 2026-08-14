import Image from "next/image";
import Link from "next/link";
import { team } from "@/content/team";

/**
 * The crew.
 *
 * The lore says "someone young, out of school, with a camera" but never shows
 * who — and a media brand is its people. This closes that gap: the faces
 * behind the coverage, named, with what they actually do rather than a job
 * title.
 *
 * Portrait frames on a warm ground, echoing the poster treatment in the events
 * sequence so the two read as the same brand rather than two designs.
 *
 * Names are TODO until the client supplies them. Rather than render four rows
 * of "TODO(client)" to a visitor, unconfirmed members fall back to a numbered
 * placeholder cell — the layout is complete and reviewable, and nothing on the
 * page claims to be a person who has not been confirmed.
 */

function isPending(value: string) {
  return !value || value.startsWith("TODO");
}

/**
 * Rotations cycled across the grid.
 *
 * Irregular on purpose — a repeating alternation reads as a pattern, which is
 * the opposite of prints laid out by hand. Kept under a degree and a half so
 * the row still scans as a row.
 */
const TILTS = ["-1.4deg", "0.9deg", "-0.6deg", "1.3deg"];

/**
 * One print on the line.
 *
 * The list item carries the string and stays square to the page; the tilt goes
 * on an inner wrapper. Rotating the item itself would rotate its line with it,
 * and four tilted line segments do not join into one straight string.
 */
function Hanger({
  children,
  tilt,
  ...rest
}: {
  children: React.ReactNode;
  tilt: string;
} & React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className="relative" {...rest}>
      {/* Stretched well past the item on both sides rather than using
          `.u-bleed`, whose 100vw + 50% margin is measured against this narrow
          list item and pushes the page into horizontal scroll. The overflow is
          clipped by the section, so the line still runs edge to edge. */}
      <span
        aria-hidden
        className="absolute -inset-x-[100vw] top-0 border-t border-dashed border-ink/25"
      />
      <div style={{ rotate: tilt }}>{children}</div>
    </li>
  );
}

/**
 * A Polaroid print.
 *
 * White border on all four sides with a deep bottom margin, which is the
 * proportion that actually reads as instant film — the caption sits in that
 * margin the way a handwritten one would. The image well is square, again
 * following the format rather than a web crop.
 *
 * The card lifts and straightens on hover, so a grid of scattered prints
 * becomes momentarily legible when you point at one.
 */
function Polaroid({
  children,
  caption,
  sub,
  url,
}: {
  children: React.ReactNode;
  caption?: string;
  sub?: string;
  url?: string;
}) {
  return (
    // The bottom margin is deeper than the other three whether or not a
    // caption fills it — that asymmetry is what reads as instant film, so it
    // holds on the placeholder cards too.
    //
    // Hover lifts the print toward the line rather than straight up, and the
    // origin sits at the peg so it swings from where it is pinned instead of
    // sliding.
    <div className="group relative origin-top bg-white p-3 pb-14 shadow-[0_2px_10px_rgba(10,10,10,0.10),0_12px_28px_rgba(10,10,10,0.08)] transition-[transform,box-shadow] duration-(--dur-base) ease-(--ease-out-expo) hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_4px_14px_rgba(10,10,10,0.14),0_20px_44px_rgba(10,10,10,0.12)] motion-reduce:transition-none">
      {/* The peg. Sits above the print's top edge so it straddles the line
          the row hangs from. Honey, because it is the one small brand mark
          this section carries. */}
      <span
        aria-hidden
        className="absolute -top-5 left-1/2 h-6 w-2 -translate-x-1/2 rounded-[1px] bg-honey shadow-[0_1px_2px_rgba(10,10,10,0.25)]"
      />
      {/* Square well, as on the real format. */}
      <div className="relative aspect-square overflow-hidden bg-ash">
        {children}
      </div>

      {/* The caption sits in the print's bottom margin. Centred, because a
          handwritten Polaroid caption is. */}
      {caption && (
        // Absolutely placed inside the reserved margin rather than added below
        // it, so a captioned print and an empty one are exactly the same
        // height and the row of prints stays aligned.
        <div className="absolute inset-x-3 bottom-3 text-center">
          {/* Sized to the margin it sits in, not to the page's h3 scale — a
              caption on a print is small by nature. */}
          <h3 className="text-lg leading-tight font-normal text-ink">
            {url ? (
              <Link
                href={url}
                target="_blank"
                rel="noopener"
                className="transition-colors duration-(--dur-fast) hover:text-propolis"
              >
                {caption} <span aria-hidden>↗</span>
              </Link>
            ) : (
              caption
            )}
          </h3>
          {sub && <p className="u-label mt-1.5 text-ink/55">{sub}</p>}
        </div>
      )}
    </div>
  );
}

export function Team() {
  const confirmed = team.filter(
    (member) => !isPending(member.name) && !isPending(member.role),
  );
  const pendingCount = team.length - confirmed.length;

  return (
    // Clips the over-wide washing lines so they read as running off both edges
    // without putting the page into horizontal scroll.
    <section
      aria-labelledby="team-heading"
      className="u-section u-rule overflow-x-clip border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          {/* Weight 400 against the global heading rule's 800, matching the
              services section. */}
          <h2 id="team-heading" className="text-(length:--text-h2) font-normal">
            The crew
          </h2>
        </div>

        {/* The washing line.

            Drawn per grid row rather than once for the section: the grid wraps
            to two rows on mobile, and a single line left the bottom pair
            pegged to nothing. Each <li> carries its own full-bleed rule at its
            top edge, so every row gets a string no matter how the grid wraps.

            Full-bleed rather than gutter-to-gutter because a line that stops
            at the text margin reads as a divider; one that runs off both edges
            reads as string strung across a room. */}
        <div className="relative">
          {/* Prints hang from the line, so the row is aligned to its top edge
              and each card is pushed down by its own peg. */}
          <ul className="grid grid-cols-2 items-start gap-x-8 gap-y-16 pt-4 md:grid-cols-4 md:gap-x-12">
          {confirmed.map((member, index) => (
            <Hanger key={member.name} tilt={TILTS[index % TILTS.length]}>
              <Polaroid
                caption={member.name}
                sub={member.role}
                url={member.url}
              >
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 22vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  // No photo yet. The initial rather than a grey silhouette.
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center font-display text-(length:--text-h1) text-ink/12"
                  >
                    {member.name.charAt(0)}
                  </span>
                )}
              </Polaroid>
            </Hanger>
          ))}

          {/* Placeholder cards for members not yet confirmed. Quiet on
              purpose — a page in front of a visitor should read as composed
              rather than unfinished, so these hold the grid's shape without
              announcing that something is missing. */}
          {Array.from({ length: pendingCount }).map((_, index) => {
            const position = confirmed.length + index;
            return (
              <Hanger
                key={`pending-${index}`}
                tilt={TILTS[position % TILTS.length]}
                aria-hidden
              >
                <Polaroid>
                  <span className="u-label absolute inset-0 grid place-items-center text-ink/15">
                    {String(position + 1).padStart(2, "0")}
                  </span>
                </Polaroid>
              </Hanger>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
