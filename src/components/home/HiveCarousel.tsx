"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Continuous single-row carousel sitting directly under the hero.
 *
 * The cells are plain rectangles, but each one has its own width and height and
 * they all hang from a common top edge — top-aligned, so the row is flush along
 * the top and ragged along the bottom. That irregularity is the whole idea: a
 * row of identical tiles reads as a component, while a row that varies reads as
 * a contact sheet of real photographs.
 *
 * Same loop mechanism as the partner Marquee: the list is duplicated once and
 * translated -50%, so the seam lands on an identical cell and is invisible.
 * Under reduced motion it becomes a static row — a moving strip of faces is
 * exactly what that preference exists to stop.
 */

/**
 * Five cells span the full width, so each cell's width is a share of the row
 * minus the gaps. GAP_REM is the single source for both the spacing and the
 * widths, so changing it keeps five across the width automatically.
 *
 * The scrolling row is `w-max` — wider than the viewport — so a percentage here
 * would resolve against that row and not against the screen. The section is a
 * size container instead, so cqw resolves against the visible width.
 */
const GAP_REM = 0.7;

/**
 * Per-cell proportions.
 *
 * `width` is each cell's share of the five-across row — the five leading values
 * sum to 1, so the first five still span the viewport exactly and the loop stays
 * seamless. `ratio` is that cell's own aspect (width ÷ height); a smaller number
 * means a taller cell.
 *
 * The spread is deliberately wide — a narrow spread reads as a uniform row with
 * a rendering bug rather than as a designed rhythm. It runs from a landscape
 * cell at 0.30 wide to a narrow portrait at 0.12, and the two extremes sit next
 * to each other so the variation is legible immediately rather than only when
 * the whole row is compared.
 *
 * Alt text is specific per frame — these are real rooms, and "event photo 2" is
 * exactly what the content schema exists to prevent.
 * TODO: replace with the actual event, city and date for each frame once the
 * shot list is confirmed.
 */
const CELLS = [
  // Wide and short — the landscape cell that breaks the portrait rhythm.
  {
    src: "/hive/hive-01.jpg",
    width: 0.26,
    ratio: 1.2,
    alt: "TODO: guests in the room at an Inside The Hive event",
  },
  // The narrowest cell. It still holds a person at readable size — below about
  // 0.17 the frame turns into a sliver and the subject stops being legible.
  {
    src: "/hive/hive-02.jpg",
    width: 0.17,
    ratio: 0.62,
    alt: "TODO: a speaker mid-session on stage",
  },
  {
    src: "/hive/hive-03.jpg",
    width: 0.23,
    ratio: 0.9,
    alt: "TODO: the crowd during a panel",
  },
  {
    src: "/hive/hive-04.jpg",
    width: 0.18,
    ratio: 0.66,
    alt: "TODO: attendees talking between sessions",
  },
  {
    src: "/hive/hive-05.jpg",
    width: 0.16,
    ratio: 0.6,
    alt: "TODO: the room filling up before doors",
  },
  // Sixth cell only ever appears mid-scroll, so its width is free — it is not
  // part of the five that have to sum to the viewport.
  {
    src: "/hive/hive-06.jpg",
    width: 0.24,
    ratio: 1.05,
    alt: "TODO: Redots Club night, Lagos",
  },
];

/**
 * Each cell's width is its share of the row once the four gaps between the five
 * visible cells are taken out.
 */
/**
 * The share is calibrated for a wide screen, where six cells across a desktop
 * row are each comfortably large. The same share on a phone leaves every cell
 * around eighty pixels — too small to read as a photograph.
 *
 * `--cell-scale` widens them there. The row is already wider than the viewport
 * and scrolls, so overshooting the container simply means fewer cells visible
 * at once, which is the right trade on a narrow screen.
 */
function cellWidth(share: number) {
  return `calc((100cqw - ${GAP_REM * 4}rem) * ${share} * var(--cell-scale, 1))`;
}

function Cell({
  cell,
  hidden,
  priority,
}: {
  cell: (typeof CELLS)[number];
  hidden: boolean;
  priority: boolean;
}) {
  return (
    <li
      className="relative shrink-0 overflow-hidden rounded-3xl"
      style={{
        width: cellWidth(cell.width),
        aspectRatio: cell.ratio,
      }}
      // The duplicate half is decorative — screen readers read the set once.
      aria-hidden={hidden}
    >
      <Image
        src={cell.src}
        alt={hidden ? "" : cell.alt}
        fill
        // Portrait sources in cells of varying shape, so cover is the only fit
        // that fills the frame without letterboxing.
        //
        // object-top rather than the default centre: these are photographs of
        // people, and a 2:3 source in a landscape cell has to lose a lot of
        // height. Cropping from the centre takes it off both ends and cuts heads
        // off; anchoring to the top spends the loss on the floor instead.
        className="object-cover object-top"
        sizes="32vw"
        priority={priority}
      />
    </li>
  );
}

export function HiveCarousel() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reduced) {
    return (
      <section
        className="pt-[clamp(0.75rem,2vh,1.5rem)]"
        aria-label="From the room"
        style={{ containerType: "inline-size" }}
      >
        {/* items-start keeps the top edges flush when the row wraps. */}
        <ul
          className="flex flex-wrap items-start justify-center"
          style={{ gap: `${GAP_REM}rem` }}
        >
          {CELLS.map((cell) => (
            <Cell key={cell.src} cell={cell} hidden={false} priority={false} />
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      className="hive-carousel relative overflow-hidden pt-[clamp(0.5rem,1.5vh,1rem)]"
      aria-label="From the room"
      // Fade both edges so the strip reads as continuous rather than clipped.
      // The fade is tight because at five-across the cells are large, and a
      // wide fade would wash out most of the first and last image.
      style={{
        containerType: "inline-size",
        maskImage:
          "linear-gradient(90deg, transparent, black 4%, black 96%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 4%, black 96%, transparent)",
      }}
    >
      <ul
        // items-start is the point of the layout: every cell hangs from the same
        // top edge and the bottoms fall where their own proportions put them.
        //
        // The gap on the list plus a matching left pad on the duplicate half
        // keeps the seam spacing identical to every other gap, so the loop point
        // is invisible rather than showing two cells bunched together.
        className="flex w-max items-start"
        style={{
          gap: `${GAP_REM}rem`,
          paddingLeft: `${GAP_REM}rem`,
          animation: "hive-marquee 48s linear infinite",
        }}
      >
        {[...CELLS, ...CELLS].map((cell, index) => (
          <Cell
            key={`${cell.src}-${index}`}
            cell={cell}
            hidden={index >= CELLS.length}
            // Only the first cell is above the fold on load; the rest scroll in.
            priority={index === 0}
          />
        ))}
      </ul>
    </section>
  );
}
