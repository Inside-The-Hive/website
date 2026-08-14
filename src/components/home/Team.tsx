import Image from "next/image";
import Link from "next/link";
import { team } from "@/content/team";

/**
 * The crew.
 *
 * The lore says "someone young, out of school, with a camera" but never shows
 * who — and a media brand is its people. This closes that gap.
 *
 * Each person stands against an angled colour panel, the row overlapping into
 * one composition rather than four portraits in boxes. The panels are cut with
 * a clip-path rather than rotated, so the colour leans while the person stays
 * upright. Portraits are greyscale, which leaves the brand's own two fill
 * colours as the only colour in the section; hovering lifts one back to
 * full colour and scales it forward.
 *
 * REQUIRES CUT-OUT PHOTOGRAPHY. Each portrait must be a PNG with a
 * transparent ground and the subject standing full-height in frame. A photo
 * that still has its background renders as a rectangle sitting on top of its
 * panel and the composition collapses — that cannot be fixed in CSS, the
 * cutting out happens before the file arrives. The images wired up now are
 * event stills standing in, so the section is showing exactly that failure
 * until real portraits replace them.
 */

function isPending(value: string) {
  return !value || value.startsWith("TODO");
}

/**
 * One panel per person.
 *
 * Colour, height and vertical offset all vary. That irregularity is the whole
 * composition — panels sharing a baseline and a height read as a chart, and
 * the reference works precisely because no two start or end in the same place.
 *
 * `top` is a share of the row's height; `height` likewise. Figures stand in
 * front, so a panel that starts lower leaves more of the person above the
 * colour.
 */
const PANELS = [
  { color: "var(--color-honey)", top: "10%", height: "90%" },
  { color: "var(--color-propolis)", top: "0%", height: "96%" },
  { color: "var(--color-honey)", top: "16%", height: "84%" },
  { color: "var(--color-propolis)", top: "5%", height: "93%" },
];

/**
 * The slant, as a clip-path parallelogram.
 *
 * Cut from the panel rather than applied as a rotation: rotating would tilt
 * the portrait in front of it too, and the person needs to stay upright while
 * the panel behind them leans. Raked hard — a shallow lean reads as a
 * rectangle that has gone slightly wrong rather than as a deliberate shape.
 */
const SLANT = "polygon(30% 0, 100% 0, 70% 100%, 0 100%)";

export function Team() {
  const members = team.filter((member) => member.photo);
  if (members.length === 0) return null;

  return (
    // Clips the panels where they run past the gutter.
    <section
      aria-labelledby="team-heading"
      className="u-section u-rule overflow-x-clip border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="team-heading" className="text-(length:--text-h2) font-normal">
            The crew
          </h2>
          <p className="u-label max-w-sm text-ink/55">The people in the room</p>
        </div>

        {/* The row. Items overlap by a negative margin so the portraits break
            across each other's panels — that interlock is the composition, and
            an even gap would read as four separate cards. */}
        {/* Scrolls horizontally below md. Four overlapping figures across a
            390px screen leaves each about 90px wide, which is not a portrait
            — swiping keeps them at a readable size and suits a row that is
            already one continuous composition rather than a grid. */}
        <ul className="-mx-[var(--spacing-gutter)] flex items-end overflow-x-auto px-[var(--spacing-gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          {members.map((member, index) => {
            const pending = isPending(member.name);

            return (
              <li
                key={index}
                // Raised on hover so the scaling portrait rises above its
                // neighbours rather than being clipped by the next panel.
                // Fixed width while the row scrolls, a quarter share once it
                // fits. `shrink-0` stops flex from compressing them back down
                // inside the scroller.
                className="group relative -mx-[3%] w-[62%] shrink-0 first:ml-0 last:mr-0 hover:z-10 sm:w-[38%] md:w-1/4"
              >
                {/* The panel. Its own height and offset, so the row is a set
                    of staggered shapes rather than a line of identical ones. */}
                <span
                  aria-hidden
                  // Wider than the item and pulled left, so the parallelogram's
                  // body — not its slanted corner — sits behind the figure.
                  // A panel spanning exactly the item leaves the person on the
                  // cut-away edge rather than against the colour.
                  className="absolute -left-[18%] w-[136%]"
                  style={{
                    top: PANELS[index % PANELS.length].top,
                    height: PANELS[index % PANELS.length].height,
                    background: PANELS[index % PANELS.length].color,
                    clipPath: SLANT,
                  }}
                />

                {/* The figure. Taller than its panel and bottom-aligned, so a
                    cut-out stands out of the top of the colour rather than
                    being contained by it — that break across the panel edge is
                    what makes the row read as people in front of shapes. */}
                <div className="relative aspect-[3/3.4] origin-bottom transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:scale-[1.06] motion-reduce:transition-none">
                  <Image
                    src={member.photo!}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    // `contain` so a cut-out keeps its own proportions rather
                    // than being cropped, and anchored bottom-centre so the
                    // figure sits on the body of the parallelogram behind it.
                    // Bottom-left would leave the person beside their panel
                    // instead of in front of it, since the slant cuts the
                    // colour away from the lower-left corner.
                    className="object-contain object-[center_bottom] grayscale transition-[filter] duration-(--dur-base) group-hover:grayscale-0"
                  />
                </div>

                {/* Names sit below the row so the composition itself stays
                    clear of type. */}
                {!pending && (
                  <div className="relative mt-5 text-center">
                    <h3 className="text-lg leading-tight font-normal text-ink">
                      {member.url ? (
                        <Link
                          href={member.url}
                          target="_blank"
                          rel="noopener"
                          className="transition-colors duration-(--dur-fast) hover:text-propolis"
                        >
                          {member.name} <span aria-hidden>↗</span>
                        </Link>
                      ) : (
                        member.name
                      )}
                    </h3>
                    <p className="u-label mt-1.5 text-ink/55">{member.role}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
