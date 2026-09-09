import type { Metadata } from "next";
import { CombWall } from "@/components/testimonials/CombWall";
import { FreezeMarquee } from "@/components/testimonials/FreezeMarquee";
import { QuoteStack } from "@/components/testimonials/QuoteStack";
import { SpotlightGrid } from "@/components/testimonials/SpotlightGrid";
import { StageQuote } from "@/components/testimonials/StageQuote";

/**
 * Six candidate testimonial sections, on one page, for comparison.
 *
 * This is a working page, not a shipped one: it exists so the concepts can be
 * judged in the browser at real widths against real type, rather than from
 * descriptions. Once one is chosen it moves to the homepage and this route and
 * the five rejected components are deleted.
 *
 * noindex because the copy is placeholder and the page is internal.
 */

export const metadata: Metadata = {
  title: "Testimonial concepts — internal",
  robots: { index: false, follow: false },
};

const CONCEPTS = [
  {
    n: 1,
    name: "The comb wall",
    note: "Hexagon grid. Hover expands a cell and unfolds the quote inside it. The hive metaphor as the layout itself.",
    Component: CombWall,
  },
  {
    n: 2,
    name: "The quote stack",
    note: "Pins and scroll-scrubs, same motion language as the featured-events sequence. Cards sit in depth and are pushed forward one at a time.",
    Component: QuoteStack,
  },
  {
    n: 3,
    name: "The freeze marquee",
    note: "Two rows drifting opposite ways. Hovering any card stops both rows dead and lifts that card.",
    Component: FreezeMarquee,
  },
  // Concept 4, the press wall, was cut after review — too quiet against the
  // rest of the site. Numbering is left as it was so the remaining concepts
  // keep the labels they were reviewed under.
  {
    n: 5,
    name: "The stage",
    note: "One quote at full size. Picking a face scrambles the text and resolves it into the next one.",
    Component: StageQuote,
  },
  {
    n: 6,
    name: "The spotlight",
    note: "Wall of near-invisible quotes. The cursor drags a beam that lights whatever it crosses.",
    Component: SpotlightGrid,
  },
];

export default function TestimonialConceptsPage() {
  return (
    <>
      {/* Padded past the fixed nav, which would otherwise sit over the banner. */}
      <div className="u-gutter pt-[9rem] pb-[clamp(3rem,8vh,6rem)]">
        <p className="u-label text-honey">Internal — not linked, not indexed</p>
        <h1 className="mt-4 text-(length:--text-h1) font-normal">
          Testimonial <span className="font-script">concepts</span>
        </h1>
        <p className="mt-6 max-w-prose text-ink/70">
          Six builds of the same section. Same copy in all six, so the
          comparison is design and behaviour only. Pick one and the other five
          get deleted along with this page.
        </p>

        {/* The placeholder warning is the important part of this page. Every
            quote below is invented, attributed to a real partner brand, and
            must not reach production unreplaced. */}
        <div className="mt-8 border-l-2 border-honey bg-ash py-4 pl-5">
          <p className="u-label text-ink">Placeholder copy</p>
          <p className="mt-2 max-w-prose text-ink/70">
            Nobody has said any of these words. The quotes exist to test the
            layouts at realistic length and are attributed to real partner names
            so the designs are tested against the name lengths that will
            actually appear. Replace every entry in{" "}
            <code className="bg-white px-1.5 py-0.5 text-[0.9em]">
              content/testimonials.ts
            </code>{" "}
            before this ships.
          </p>
        </div>
      </div>

      {CONCEPTS.map(({ n, name, note, Component }) => (
        <div key={n}>
          <div className="u-gutter u-rule border-t bg-ash py-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="u-label text-honey">
                Concept {String(n).padStart(2, "0")}
              </span>
              <h2 className="text-(length:--text-h3) font-normal">{name}</h2>
            </div>
            <p className="mt-2 max-w-prose text-ink/60">{note}</p>
          </div>
          <Component />
        </div>
      ))}
    </>
  );
}
