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
 * Requires cut-out photography: each portrait is a PNG with a transparent
 * ground, trimmed to the subject's bounding box so the file's edges are the
 * person's edges. A photo that still carries its background renders as a
 * rectangle over its panel and the composition collapses, and an untrimmed
 * cut-out seats at the wrong scale — see content/team.ts.
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
  { color: "var(--color-honey)", top: "16%" },
  { color: "var(--color-propolis)", top: "4%" },
  { color: "var(--color-honey)", top: "22%" },
  { color: "var(--color-propolis)", top: "10%" },
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
                {/* Panel and figure share one box and one bottom line.
                    Previously the panel was sized off the list item and the
                    figure off its own aspect box — 440px against 324px, offset
                    58px apart — so the colour sat beside the person rather
                    than behind them. Both are now absolute children of the
                    same grounded container, which is what keeps them
                    registered to each other at every width. */}
                <div className="relative aspect-[3/3.9]">
                  {/* The panel. Inset from the figure's edges so the person
                      overhangs it slightly on both sides, and shorter, so they
                      stand out of the top of the colour. Its own top offset
                      staggers the row. */}
                  <span
                    aria-hidden
                    className="absolute right-[-8%] bottom-0 left-[-8%]"
                    style={{
                      top: PANELS[index % PANELS.length].top,
                      background: PANELS[index % PANELS.length].color,
                      clipPath: SLANT,
                    }}
                  />

                  {/* The figure, standing on the same bottom line as its
                      panel. */}
                  <div className="absolute inset-x-0 bottom-0 top-[6%] origin-bottom transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:scale-[1.05] motion-reduce:transition-none">
                    <Image
                      src={member.photo!}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      // Cut-outs are trimmed to their subject's bounding box,
                      // so the file's edges are the person's edges. `contain`
                      // with a bottom anchor then stands the whole figure on
                      // the panel's base without cropping their feet or head.
                      className="object-contain object-[center_bottom] grayscale transition-[filter] duration-(--dur-base) group-hover:grayscale-0"
                    />
                  </div>
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
