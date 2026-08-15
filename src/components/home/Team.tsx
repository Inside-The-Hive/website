import Image from "next/image";
import Link from "next/link";
import {
  EmailIcon,
  TelegramIcon,
  XIcon,
} from "@/components/SocialIcons";
import { team } from "@/content/team";
import { cn } from "@/lib/cn";

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
 * One social mark.
 *
 * Renders as a link when a URL exists and as plain marked-up icon when it does
 * not, so the row of three is visually complete before the handles are
 * supplied without offering anything that leads nowhere. The placeholder is
 * hidden from assistive tech and cannot be focused — a keyboard user should
 * not land on a mark that does nothing.
 */
function SocialMark({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  const tone = "text-ink/45 transition-colors duration-(--dur-fast)";

  if (!href) {
    return (
      <span aria-hidden className={cn(tone, "opacity-55")}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener"}
      aria-label={label}
      className={cn(tone, "hover:text-ink")}
    >
      {children}
    </Link>
  );
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
/**
 * One entry per position in the row.
 *
 * `z` ascends strictly left to right, so each person overlaps the one before
 * them and the row reads as a single receding line rather than a set of
 * arbitrary layer collisions.
 */
const PANELS = [
  { color: "var(--color-honey)", z: 1 },
  { color: "var(--color-propolis)", z: 2 },
  { color: "var(--color-honey)", z: 3 },
  { color: "var(--color-propolis)", z: 4 },
  { color: "var(--color-honey)", z: 5 },
];

/**
 * How far each item is lifted, as a share of the box.
 *
 * Applied to the whole list item so the figure and its panel move together —
 * the person stays standing on their own colour, and the pair rises as one
 * unit. Alternating means every other member sits slightly proud of their
 * neighbours, so the row rests on a broken line rather than a flat one.
 */
const LIFTS = ["-6%", "0%", "-6%", "0%", "-6%"];

/**
 * Per-person scale correction, for when a cut-out is framed differently from
 * the rest.
 *
 * `object-contain` fits to whichever axis runs out first, so a crop framed
 * differently from the rest renders at a different scale. All five currently
 * sit at 0.59–0.74, so every value is 1; a replacement cropped tighter or
 * wider would need correcting here.
 */
const SCALES = [1, 1, 1, 1, 1];

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
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="team-heading" className="text-(length:--text-h2) font-normal">
            The <span className="font-script">Dream</span> Team
          </h2>
        </div>

        {/* The row. Items overlap by a negative margin so the portraits break
            across each other's panels — that interlock is the composition, and
            an even gap would read as four separate cards. */}
        {/* Scrolls horizontally below md. Four overlapping figures across a
            390px screen leaves each about 90px wide, which is not a portrait
            — swiping keeps them at a readable size and suits a row that is
            already one continuous composition rather than a grid. */}
        {/* `items-start`, not `items-end`: bottom-aligning would pin every
            item to one line and cancel the per-item lift. Top padding is the
            room the lifted items rise into. */}
        {/* Centred once the row fits: the items overlap heavily, so the group
            is far narrower than four full-width columns and would otherwise
            sit hard against the left gutter with its first figure clipped. */}
        <ul className="-mx-[var(--spacing-gutter)] flex items-start overflow-x-auto px-[var(--spacing-gutter)] pt-[7%] pb-2 [scrollbar-width:none] md:mx-0 md:justify-center md:overflow-visible md:px-0 md:pb-0">
          {members.map((member, index) => {
            const pending = isPending(member.name);

            return (
              <li
                key={index}
                // Items overlap hard by a negative margin — the boxes are
                // wider than the people inside them, so a small overlap leaves
                // the visible figures separated and the row reads as pasted
                // cut-outs. At this depth each person genuinely passes in
                // front of their neighbour, which is what the ascending
                // z-index resolves. Hover jumps above every static value so
                // the scaling portrait is never clipped.
                className="group relative -mx-[5%] w-[62%] shrink-0 hover:z-20 sm:w-[38%] md:w-[26%]"
                // `translateY`, not `top`: a percentage `top` on a relative
                // item resolves against the containing block's height, and the
                // flex row's height is derived from these items — so the
                // percentage had nothing to resolve against and collapsed to
                // zero. A transform percentage is measured against the
                // element's own box, which is what makes the lift land.
                //
                style={{
                  zIndex: PANELS[index % PANELS.length].z,
                  translate: `0 ${LIFTS[index % LIFTS.length]}`,
                }}
              >
                {/* Panel and figure share one box and one bottom line.
                    Previously the panel was sized off the list item and the
                    figure off its own aspect box — 440px against 324px, offset
                    58px apart — so the colour sat beside the person rather
                    than behind them. Both are now absolute children of the
                    same grounded container, which is what keeps them
                    registered to each other at every width. */}
                {/* Sized between the crops it has to hold. The cut-outs range
                    from 0.74 to 1.35 in ratio; a box much taller than that
                    range shrinks the wide ones to fit its width and leaves
                    them floating small above the panel's base. */}
                <div className="relative aspect-[3/3.2]">
                  {/* The panel. Identical on every item — same size, same
                      baseline — and inset from the figure's edges so the
                      person overhangs it slightly on both sides.

                      It starts below the top of the box, leaving room for the
                      figures to rise into: a taller crop breaks above the
                      colour, a shorter one sits inside it, and that is where
                      the row's irregularity comes from now that the shapes
                      themselves are uniform. */}
                  {/* The panel. Bottom-anchored on one baseline with a fixed
                      height, so every shape is geometrically identical — the
                      reference keeps its parallelograms uniform and lets the
                      people carry the variation. Its top offset only sets how
                      far the colour rises behind the figure. */}
                  <span
                    aria-hidden
                    className="absolute right-[8%] bottom-[4%] left-[8%] h-[82%]"
                    style={{
                      background: PANELS[index % PANELS.length].color,
                      clipPath: SLANT,
                    }}
                  />

                  {/* The figure, standing on the same bottom line as its
                      panel. */}
                  {/* Bottom-inset to match the panels' own base, so the
                      figures stand on the colour rather than below it. The
                      per-person drop varies the head heights while every
                      figure keeps the same ground line. */}
                  {/* Fills its box top to bottom. The row's vertical variation
                      is the item's own lift, which carries the panel with it,
                      so nothing moves the figure independently of the colour
                      it stands on. */}
                  <div className="absolute inset-x-0 top-0 bottom-[4%] origin-bottom transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:scale-[1.05] motion-reduce:transition-none">
                    <Image
                      src={member.photo!}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      // Cut-outs are trimmed to their subject's bounding box,
                      // so the file's edges are the person's edges, and
                      // `contain` keeps each person whole rather than cropping
                      // heads and shoulders to fill.
                      //
                      // The per-person scale sits here rather than on the
                      // wrapper, which already owns the hover transform and
                      // would overwrite it. Bottom origin so a scaled figure
                      // stays on the shared ground line.
                      className="origin-bottom object-contain object-[35%_bottom] grayscale transition-[filter] duration-(--dur-base) group-hover:grayscale-0"
                      style={{ scale: String(SCALES[index % SCALES.length]) }}
                    />
                  </div>

                  {/* The label. Hidden until the figure is hovered, so the
                      row reads as one composition at rest and only names a
                      person when you point at them.

                      Sits inside the figure's box rather than below the row,
                      and alternates corner down the line so the labels never
                      form a horizontal band. `pointer-events-none` keeps it
                      from interrupting the hover it responds to. */}
                  {!pending && (
                    <div
                      className={cn(
                        // Sits in the white wedge the slant leaves beside the
                        // panel, aligned to the actual cut rather than to a
                        // guessed percentage.
                        //
                        // The panel spans 8%–92% of the item and the clip runs
                        // 30%–100% along its top, 0%–70% along its bottom. In
                        // item coordinates that puts the colour's top edge at
                        // 33.2% and its bottom edge at 66.8% — so the free
                        // wedges are 0–33.2% above the lean and 66.8–100%
                        // below it. Anything else overlaps the colour.
                        // `whitespace-nowrap` so a two-word name keeps to one
                        // line — wrapping pushes the role down onto the
                        // colour, and the wedge is wide enough to hold it.
                        "pointer-events-none absolute z-30 translate-y-1 whitespace-nowrap opacity-0 transition-[opacity,transform] duration-(--dur-base) ease-(--ease-out-expo) group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none",
                        member.labelAt === "top"
                          ? "-top-[6%] right-[68%] text-right"
                          : "-bottom-[9%] left-[68%] text-left",
                      )}
                    >
                      {/* Sacramento, the one place the site leaves Inter — a
                          signature reads as the person signing their own
                          portrait rather than as a caption. Script faces run
                          small for their point size, so this sits well above
                          the role beneath it. */}
                      <p className="font-script text-4xl leading-none font-normal text-ink">
                        {member.url ? (
                          <Link
                            href={member.url}
                            target="_blank"
                            rel="noopener"
                            className="pointer-events-auto"
                          >
                            {member.name}
                          </Link>
                        ) : (
                          member.name
                        )}
                      </p>
                      <p className="mt-1.5 text-base leading-tight font-normal text-ink/55">
                        {member.role}
                      </p>

                      {/* Personal accounts. All three marks always show, so
                          the label's design is settled before the handles
                          arrive; each becomes a real link the moment its URL
                          is filled in.

                          `pointer-events-auto` overrides the label's own
                          `pointer-events-none` — the label must not intercept
                          the hover that reveals it, but these do need to be
                          clickable once it is showing. */}
                      <div
                        className={cn(
                          "pointer-events-auto mt-3 flex items-center gap-3.5",
                          member.labelAt === "top" && "justify-end",
                        )}
                      >
                        <SocialMark
                          href={member.x}
                          label={`${member.name} on X`}
                        >
                          <XIcon className="size-[18px]" />
                        </SocialMark>
                        <SocialMark
                          href={member.telegram}
                          label={`${member.name} on Telegram`}
                        >
                          <TelegramIcon className="size-[19px]" />
                        </SocialMark>
                        <SocialMark
                          href={member.email && `mailto:${member.email}`}
                          label={`Email ${member.name}`}
                        >
                          <EmailIcon className="size-[19px]" />
                        </SocialMark>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
