"use client";

import Image from "next/image";
import { useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Concept 1 — the comb wall.
 *
 * Testimonials as cells in a honeycomb. The hive is the brand's own metaphor,
 * so the section's structure carries meaning before a word of it is read.
 *
 * Hovering a cell expands it out of the grid and unfolds the quote inside the
 * hexagon; its neighbours desaturate and shrink slightly so the expansion reads
 * as the wall making room rather than one cell simply growing.
 *
 * Geometry: a hex grid is not a CSS grid. Pointy-top hexagons tile when every
 * other row is offset by half a cell and the rows overlap vertically by a
 * quarter of the cell height, which is what the negative row margin below is
 * doing. Cells are positioned by hand rather than by grid placement because the
 * offset row has to hang off the left edge, and no `grid-template` expresses
 * that without a fractional column.
 */

/** Fraction of a cell's height that consecutive rows overlap. */
const ROW_OVERLAP = 0.25;

/**
 * Cells per row.
 *
 * Two equal rows, with the lower one shifted half a cell sideways so the two
 * interlock. An earlier 3/2/1 tapered to a point and read as a triangle rather
 * than as a section cut out of a larger comb.
 *
 * Equal rows rather than the 3/2 a real honeycomb would use: with six
 * testimonials, 3/2 strands the sixth on a row of its own.
 */
const ROW_SIZES = [3, 3];

/** Rows at an odd index are shifted half a cell right, which builds the tiling. */
const ROW_SHIFT = 0.5;

/**
 * A cell's width as a fraction of the wall. Three per row, so a third — the
 * row shift and the cell's own width both derive from this rather than each
 * carrying its own number and drifting apart.
 */
const CELL_W = 1 / 3;

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/** Splits the flat list into the row structure above. */
function toRows<T>(items: T[], sizes: number[]) {
  const rows: T[][] = [];
  let cursor = 0;
  for (const size of sizes) {
    if (cursor >= items.length) break;
    rows.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  // Anything past the declared rows joins the last one rather than vanishing.
  if (cursor < items.length && rows.length) {
    rows[rows.length - 1].push(...items.slice(cursor));
  }
  return rows;
}

export function CombWall() {
  const [active, setActive] = useState<number | null>(null);
  const rows = toRows(testimonials, ROW_SIZES);
  let index = -1;

  return (
    <section
      aria-labelledby="comb-wall-heading"
      className="u-section u-rule border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="comb-wall-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What they <span className="font-script">say</span>
          </h2>
          <p className="u-label max-w-sm text-ink/55">
            Partners and guests, in their own words
          </p>
        </div>

        {/* The wall is centred and capped: past about 68rem the hexagons grow
            larger than the quotes inside them need, and the composition stops
            reading as a comb and starts reading as six big shapes. */}
        {/* The offset row is shifted half a cell right, so the wall's own box
            has to end half a cell short of the gutter or that row overhangs the
            viewport. Narrowing the wall rather than clipping it keeps the
            hover expansion — which also grows past the box — visible. */}
        <div
          className="mx-auto w-full max-w-[58rem] pb-[6%]"
          style={{ paddingRight: `${ROW_SHIFT * CELL_W * 100}%` }}
          onPointerLeave={() => setActive(null)}
        >
          {rows.map((row, rowIndex) => (
            <div
              // Index as key is safe here: rows are a fixed structural
              // constant, never reordered or filtered.
              key={rowIndex}
              className="flex justify-center"
              style={{
                // Rows interlock rather than stack: they overlap vertically by
                // a quarter of a cell and the lower one shifts half a cell
                // sideways. Both together are what make this tile as a comb
                // rather than as a brick wall.
                marginTop: rowIndex === 0 ? 0 : `${-ROW_OVERLAP * 26}%`,
                // Half of one cell. A cell is CELL_W of the wall, so the shift
                // is that fraction halved — stated against the wall's width, so
                // it stays exactly half a cell at every viewport.
                translate:
                  rowIndex % 2 === 1 ? `${ROW_SHIFT * CELL_W * 100}%` : "0",
              }}
            >
              {row.map((item) => {
                index += 1;
                const cellIndex = index;
                const isActive = active === cellIndex;
                const dimmed = active !== null && !isActive;

                return (
                  <div
                    key={item.name + item.role}
                    className="relative shrink-0 px-[0.35%]"
                    style={{
                      width: `${CELL_W * 100}%`,
                      zIndex: isActive ? 20 : 1,
                    }}
                  >
                    <button
                      type="button"
                      onPointerEnter={() => setActive(cellIndex)}
                      onFocus={() => setActive(cellIndex)}
                      onBlur={() => setActive(null)}
                      aria-expanded={isActive}
                      className="group relative block w-full cursor-default text-left"
                      style={{
                        // The expansion happens on the cell itself so the
                        // hexagon and its contents scale as one object.
                        scale: isActive ? "1.18" : dimmed ? "0.94" : "1",
                        transition:
                          "scale var(--dur-base) var(--ease-out-expo), filter var(--dur-base) var(--ease-out-expo), opacity var(--dur-base) var(--ease-out-expo)",
                        filter: dimmed ? "saturate(0.15)" : "none",
                        opacity: dimmed ? 0.5 : 1,
                      }}
                    >
                      {/* aspect-[1/1.1547] is the pointy-top hexagon's true
                          ratio — 2/√3. Any other value and the tiling leaves
                          gaps between rows. */}
                      <div
                        className="relative aspect-[1/1.1547] w-full overflow-hidden bg-ink"
                        style={{ clipPath: HEX }}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 17rem, 30vw"
                            className="object-cover transition-[opacity,scale] duration-(--dur-base) ease-(--ease-out-expo)"
                            style={{
                              opacity: isActive ? 0.22 : 0.75,
                              scale: isActive ? "1.08" : "1",
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-honey" />
                        )}

                        {/* Resting state: just the attribution, centred. The
                            quote is what the hover reveals, so the wall reads
                            as faces first and words second. */}
                        <div
                          className="absolute inset-0 grid place-items-center px-[14%] text-center transition-opacity duration-(--dur-fast)"
                          style={{ opacity: isActive ? 0 : 1 }}
                        >
                          <span className="u-label text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                            {item.name}
                          </span>
                        </div>

                        {/* Expanded state: the quote unfolds inside the hex.
                            Inset heavily — a hexagon's usable text area is its
                            middle band, and copy set to the full width would
                            run out through the angled corners. */}
                        <div
                          className="absolute inset-0 flex flex-col justify-center gap-3 px-[16%] text-center transition-opacity duration-(--dur-base)"
                          style={{ opacity: isActive ? 1 : 0 }}
                        >
                          <p className="text-[clamp(0.6rem,1.05vw,0.9rem)] leading-snug text-white">
                            &ldquo;{item.pull}&rdquo;
                          </p>
                          <p className="u-label text-[0.55rem] text-honey">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* The full quote for whichever cell is open. The hexagon can only hold
            the pull; putting the whole thing below means the shape stays a
            shape and the copy stays readable. */}
        {/* Reserved height, so opening a cell does not shove the page below it
            downward. Sized to the longest quote at each end of the range
            rather than to a single value — at 390px these run to six lines. */}
        <div className="mx-auto mt-[clamp(1.5rem,5vh,3.5rem)] min-h-[4.5rem] max-w-[46rem] text-center md:min-h-[7rem]">
          <p
            className="text-(length:--text-h3) leading-tight font-normal text-balance transition-opacity duration-(--dur-base)"
            style={{ opacity: active === null ? 0 : 1 }}
          >
            {active !== null && `“${testimonials[active].quote}”`}
          </p>
          <p
            className="u-label mt-4 text-ink/55 transition-opacity duration-(--dur-base)"
            style={{ opacity: active === null ? 0 : 1 }}
          >
            {active !== null && testimonials[active].role}
          </p>
        </div>
      </div>
    </section>
  );
}
