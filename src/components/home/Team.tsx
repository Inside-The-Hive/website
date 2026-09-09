import Image from "next/image";
import Link from "next/link";
import {
  EmailIcon,
  TelegramIcon,
  XIcon,
} from "@/components/SocialIcons";
import { team, type TeamMember } from "@/content/team";
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
  onDark = false,
  touch = false,
  children,
}: {
  href?: string;
  label: string;
  /** True when the mark sits on a propolis panel, where ink is unreadable. */
  onDark?: boolean;
  /**
   * True on the stacked mobile card, where the mark is padded out to a 44px
   * tap target. The desktop row keeps the bare glyph — it is revealed by a
   * pointer that is already on it, and padding would break the tight cqw
   * spacing the label is measured in.
   */
  touch?: boolean;
  children: React.ReactNode;
}) {
  const tone = onDark
    ? "text-white/60 transition-colors duration-(--dur-fast)"
    : "text-ink/45 transition-colors duration-(--dur-fast)";
  const box = touch ? "grid size-11 place-items-center" : "";

  if (!href) {
    return (
      <span aria-hidden className={cn(tone, box, "opacity-55")}>
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
      className={cn(tone, box, onDark ? "hover:text-white" : "hover:text-ink")}
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
/**
 * Panel colour and stacking, derived from position rather than listed.
 *
 * A fixed list had to be edited every time the crew changed, and indexing it
 * with a modulo silently broke the alternation once the row grew past its
 * length — the sixth figure repeated the first's colour and lift. Deriving
 * both from the index keeps the pattern correct at any size.
 *
 * Each panel stacks above the one before it, which is what makes the row read
 * as overlapping cards rather than as a flat strip.
 */
function panelFor(index: number) {
  return {
    color: index % 2 === 0 ? "var(--color-honey)" : "var(--color-propolis)",
    z: index + 1,
  };
}

/**
 * Which positions sit lifted. Applied to the whole list item so the figure
 * and its panel move together, and alternating so the row rests on a broken
 * line rather than a flat one.
 */
const isLifted = (index: number) => index % 2 === 0;

/** Lift, as a share of the item's height. */
const LIFT_PCT = 6;

/**
 * Horizontal compensation for the lift — derived, not tuned.
 *
 * The clip edges lean: they run SLANT_RUN of the panel's width over the
 * panel's height. Lifting an item means any shared horizontal line crosses
 * its panel nearer the bottom, where both edges sit further left — so the
 * whole panel reads shifted left by slope x lift. That widens the gap on its
 * right and narrows the one on its left by the same amount, which is exactly
 * the alternating wide/narrow pattern the row showed.
 *
 * Moving the lifted item right by that same distance restores both of its
 * edges at once:
 *
 *   dx = SLANT_RUN x PANEL_W x LIFT / PANEL_H
 *      = 0.30 x 0.84 x 0.06 / 0.82  ~ 1.844% of the item's width
 *
 * The item's height cancels out of the algebra, so the result is a pure
 * percentage of the item's own width — it scales with every viewport, where
 * the fixed-pixel nudges this replaces were only right at one width (about
 * 23px of asymmetry at 2560, 11px at 1280).
 *
 * The constants mirror the classes below: SLANT_RUN from the 30% run in
 * SLANT, PANEL_W from left-[8%]/right-[8%], PANEL_H from h-[82%]. Change
 * those and this recomputes.
 */
const SLANT_RUN = 0.3;
const PANEL_W = 0.84;
const PANEL_H = 0.82;
const LIFT_COMP = (SLANT_RUN * PANEL_W * LIFT_PCT) / PANEL_H; // ~1.844

/**
 * Per-person scale correction, for when a cut-out is framed differently from
 * the rest.
 *
 * `object-contain` fits to whichever axis runs out first, so a crop framed
 * differently from the rest renders at a different scale. All five currently
 * sit at 0.59–0.74, so every value is 1; a replacement cropped tighter or
 * wider would need correcting here.
 */
const FIGURE_SCALE = 1;

/**
 * The slant, as a clip-path parallelogram.
 *
 * Cut from the panel rather than applied as a rotation: rotating would tilt
 * the portrait in front of it too, and the person needs to stay upright while
 * the panel behind them leans. Raked hard — a shallow lean reads as a
 * rectangle that has gone slightly wrong rather than as a deliberate shape.
 */
const SLANT = "polygon(30% 0, 100% 0, 70% 100%, 0 100%)";

/**
 * How deep each junction interlocks, as a share of an item's own width.
 *
 * This is the reference composition's defining ratio. The original five-person
 * layout set items at 26% of the track with a -5% track margin per side, so
 * neighbouring boxes overlapped by 10% of the track — about 38% of an item's
 * width — and every figure genuinely passed in front of the next panel.
 * Held slightly under that here so the interlock reads without the outermost
 * panels burying each other.
 *
 * Both the item width and the margin derive from this one number, so the
 * interlock stays identical at any headcount: adding people shrinks everything
 * proportionally instead of changing how the row fits together.
 */
const INTERLOCK = 0.19;

/**
 * How much of the track the row is allowed to occupy.
 *
 * A little over 100, because the panels are cut on a slant and the outermost
 * ones taper away from the row's own edges — sized to exactly 100 the
 * composition reads as inset from the gutter even when its boxes are flush.
 * The section clips horizontally, so the small excess trims at the gutter.
 *
 * Kept modest: pushed far past this the first and last figures themselves get
 * cut by the gutter rather than just their panels.
 */
const TRACK_FILL = 100;

/**
 * Item width for a row of `count` people, as a percentage of the track.
 *
 * Each item's flow footprint is its width minus the two interlocks it shares,
 * so a row of n spans n x w x (1 - 2 x INTERLOCK) of track. Solving that for
 * w at the target fill keeps the row the same overall width whatever the
 * headcount — only the figures scale as people are added.
 *
 * Derived rather than hardcoded because the fixed 26% this replaces was sized
 * for five people: at seven the row ran past both gutters, pushing the first
 * figure off the left edge and the last past the right.
 */
function crewWidth(count: number) {
  return TRACK_FILL / (count * (1 - 2 * INTERLOCK));
}

/**
 * One person, stacked — the small-screen card.
 *
 * The desktop row is a hover composition, and hover does not exist on a
 * touch screen: below md the names, roles and social marks were unreachable,
 * so the section rendered as anonymous photographs. Here each person gets
 * their own block with the label always showing beneath them, which is the
 * only arrangement that carries the same information without a pointer.
 *
 * The panel, slant, greyscale and bottom-anchored figure are all kept, so
 * this reads as the same design rather than a different section on a phone.
 * What changes is that the panels no longer interlock: at two columns on a
 * 390px screen an overlap would put each figure across their neighbour's
 * label rather than their neighbour's panel.
 */
function CrewCard({ member, index }: { member: TeamMember; index: number }) {
  const pending = isPending(member.name);

  return (
    <li className="flex flex-col">
      <div className="relative aspect-[3/3.2]">
        <span
          aria-hidden
          className="absolute right-[6%] bottom-[4%] left-[6%] h-[82%]"
          style={{ background: panelFor(index).color, clipPath: SLANT }}
        />
        <div className="absolute inset-x-0 top-0 bottom-[4%]">
          <Image
            src={member.photo!}
            alt=""
            fill
            sizes="50vw"
            className="object-contain object-[35%_bottom] grayscale"
          />
        </div>
      </div>

      {!pending && (
        // Under the figure, not over it: on a phone the label is the point of
        // the card, and laying it over the panel would put small type on
        // honey and propolis at the one size where it is least readable.
        <div className="mt-3">
          <p className="font-script text-[1.6rem] leading-none font-normal">
            {member.url ? (
              <Link href={member.url} target="_blank" rel="noopener">
                {member.name}
              </Link>
            ) : (
              member.name
            )}
          </p>
          <p className="mt-1 text-sm leading-tight font-normal text-ink/55">
            {member.role}
          </p>
          {/* Marks are 44px touch targets here rather than the desktop row's
              bare glyphs — a 16px icon is not tappable. */}
          <div className="mt-1 -ml-2.5 flex items-center">
            <SocialMark href={member.x} label={`${member.name} on X`} touch>
              <XIcon className="size-[1.05rem]" />
            </SocialMark>
            <SocialMark
              href={member.telegram}
              label={`${member.name} on Telegram`}
              touch
            >
              <TelegramIcon className="size-[1.1rem]" />
            </SocialMark>
            <SocialMark
              href={member.email && `mailto:${member.email}`}
              label={`Email ${member.name}`}
              touch
            >
              <EmailIcon className="size-[1.1rem]" />
            </SocialMark>
          </div>
        </div>
      )}
    </li>
  );
}

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
            <span className="font-script">Meet </span>The <span className="font-script">Dream</span> Team
          </h2>
        </div>

        {/* Below md: one block per person, label always visible.
            The interlocking row is a hover composition and a touch screen has
            no hover, so on a phone it rendered as unnamed photographs that
            had to be swiped past. Two columns keep each portrait large enough
            to read while the whole crew stays on one screen's scroll. */}
        <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:hidden">
          {members.map((member, index) => (
            <CrewCard key={index} member={member} index={index} />
          ))}
        </ul>

        {/* md and up: the interlocking row. */}
        {/* The row. Items overlap by a negative margin so the portraits break
            across each other's panels — that interlock is the composition, and
            an even gap would read as four separate cards. */}
        {/* `items-start`, not `items-end`: bottom-aligning would pin every
            item to one line and cancel the per-item lift. Top padding is the
            room the lifted items rise into. */}
        {/* Centred once the row fits: the items overlap heavily, so the group
            is far narrower than four full-width columns and would otherwise
            sit hard against the left gutter with its first figure clipped. */}
        <ul
          className="hidden items-start pt-[7%] md:flex md:justify-center"
          // Item width is derived from how many people are in the row, not
          // fixed. Each item overlaps its neighbours by OVERLAP on both sides,
          // so n items occupy n x (w - 2 x OVERLAP) + 2 x OVERLAP of track. Solving
          // that for the full width and capping it keeps the row inside the
          // gutter at any headcount: at the hardcoded 26% the sixth and
          // seventh people pushed the first off the left edge and the last
          // past the right.
          // The margin is a track percentage (CSS margins resolve against the
          // containing block), so the item-relative INTERLOCK is converted
          // through the item's own width here.
          style={{
            ["--crew-w" as string]: `${crewWidth(members.length).toFixed(3)}%`,
            ["--crew-overlap" as string]: `${(-INTERLOCK * crewWidth(members.length)).toFixed(3)}%`,
          }}
        >
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
                className="group relative mx-(--crew-overlap) w-(--crew-w) shrink-0 hover:z-20"
                // `translateY`, not `top`: a percentage `top` on a relative
                // item resolves against the containing block's height, and the
                // flex row's height is derived from these items — so the
                // percentage had nothing to resolve against and collapsed to
                // zero. A transform percentage is measured against the
                // element's own box, which is what makes the lift land.
                //
                style={{
                  zIndex: panelFor(index).z,
                  translate: isLifted(index)
                    ? `${LIFT_COMP.toFixed(3)}% -${LIFT_PCT}%`
                    : "0 0",
                  // The item is a size container so the hover label can be
                  // set in cqw. The label used to be fixed-size type pinned
                  // to percentage offsets: the wedge it aimed for scaled with
                  // the item while the text did not, so on mid-size screens
                  // the words overflowed the item and landed on the
                  // neighbouring figures.
                  containerType: "inline-size",
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
                      background: panelFor(index).color,
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
                      style={{ scale: String(FIGURE_SCALE) }}
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
                        // In the white, never on the colour. Top labels
                        // anchor their bottom edge just above the panel's top
                        // (y 14%) and grow upward into the row's own padding;
                        // bottom labels anchor their top just below the
                        // panel's bottom (y 96%) and grow downward. Both
                        // bands are provably clear of every panel: the
                        // top-labelled items are the lifted ones, so their
                        // unlifted neighbours' colour starts 20% down in
                        // these coordinates, and the lifted neighbours of a
                        // bottom label end at 90% — the strips cannot collide
                        // with anyone's panel at any width.
                        //
                        // Every measure is in cqw — 1% of this item's own
                        // width — so the label scales with the row exactly,
                        // and horizontal fit at one breakpoint is fit at all
                        // of them. Aligned to the panel's own corner (x 8% /
                        // 92%), the text grows inward, so nothing can spill
                        // into the neighbouring slot.
                        "pointer-events-none absolute z-30 translate-y-1 whitespace-nowrap text-ink opacity-0 transition-[opacity,transform] duration-(--dur-base) ease-(--ease-out-expo) group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none",
                        member.labelAt === "top"
                          ? "bottom-[88%] right-[8%] text-right"
                          : "top-[97%] left-[8%] text-left",
                      )}
                    >
                      {/* Sacramento, the one place the site leaves Inter — a
                          signature reads as the person signing their own
                          portrait rather than as a caption. Script faces run
                          small for their point size, so this sits well above
                          the role beneath it. */}
                      <p className="font-script text-[7.5cqw] leading-none font-normal">
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
                      <p className="mt-[1.1cqw] text-[3.6cqw] leading-tight font-normal text-ink/55">
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
                          "pointer-events-auto mt-[1.8cqw] flex items-center gap-[2.4cqw]",
                          member.labelAt === "top" && "justify-end",
                        )}
                      >
                        <SocialMark href={member.x} label={`${member.name} on X`}>
                          <XIcon className="size-[4cqw]" />
                        </SocialMark>
                        <SocialMark
                          href={member.telegram}
                          label={`${member.name} on Telegram`}
                        >
                          <TelegramIcon className="size-[4.2cqw]" />
                        </SocialMark>
                        <SocialMark
                          href={member.email && `mailto:${member.email}`}
                          label={`Email ${member.name}`}
                        >
                          <EmailIcon className="size-[4.2cqw]" />
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
