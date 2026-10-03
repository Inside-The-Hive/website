import { ScrollTintText } from "@/components/home/ScrollTintText";
import { site } from "@/content/site";

/**
 * The origin story.
 *
 * Sits directly after the events sequence: the sequence is the proof, this is
 * the reason. Reading it in that order means the claim has already been
 * demonstrated before it is explained.
 *
 * Two tiers, both centred. The opening statement is set large and holds a
 * short measure so it reads as a thesis rather than as a paragraph; the
 * narrative beneath is set small and indented past it, so the eye takes the
 * statement first and the detail only if it wants it. That contrast in scale
 * is the whole structure — there is no rule, no card, no box.
 *
 * Copy note: everything here is written from what the brand demonstrably does
 * — events, coverage, a podcast, work across Nigerian cities. The specifics
 * that only the client can confirm (the founder's name, the year, the first
 * event) are marked TODO in `content/site.ts` rather than invented, because
 * this is a real company's history and a plausible-sounding fabrication is
 * worse here than an obvious blank.
 */
export function Lore() {
  return (
    <section
      aria-labelledby="lore-heading"
      // The 6rem floor was set for desktop and applied everywhere: on a phone
      // the 18vh middle term never wins, so the section opened and closed with
      // a near-empty screen either side of the copy. Held to 3rem below the
      // breakpoint, where the reader has far less height to spend.
      className="py-12 text-ink md:py-[clamp(6rem,18vh,14rem)]"
    >
      <div className="u-gutter">
        <h2 id="lore-heading" className="sr-only">
          How {site.name} started
        </h2>

        {/* The thesis. Wide and heavy — at this size the statement carries the
            section on its own, which is what makes the copy beneath read as a
            footnote to it rather than a second paragraph of equal weight.
            Centred on the page, as is the narrative below it. */}
        <p className="mx-auto max-w-[62ch] text-[clamp(1.5rem,3.05vw,2.75rem)] leading-[1.18] font-normal tracking-[-0.02em] text-ink">
          {site.name} started with a phone in hand, no studio, no budget, a
          borrowed camera and a laser-focused view on telling the true African
          Web3 story from the inside.
        </p>

        {/* The narrative. Small and on a short measure, centred on the page
            rather than offset from the statement above — both blocks share the
            page's centre line, so the section reads as one column of differing
            widths instead of two blocks nudged against each other.

            Left-aligned inside that block: centring every line of a
            multi-paragraph passage leaves both edges ragged and slows reading
            for no gain. */}
        <ScrollTintText className="mx-auto mt-[clamp(1.75rem,4vh,3rem)] grid max-w-[65ch] gap-6 text-left text-[clamp(1.125rem,2.08vw,1.5rem)] leading-[1.42]">
          <p>
            A story often overlooked by people who had barely any interest in
            looking deeper. Too often the story was being told from a distance,
            but the conversations, communities, builders and moments shaping
            the ecosystem were happening somewhere else. The African Web3
            ecosystem needed a change, and the birth of {site.name} presented
            that change.
          </p>

          <p>
            From grassroots meetups and project launches to conferences and
            community dinners where unfiltered conversations happen outside the
            panel, {site.name} has covered, published and presented the outside
            world with a closer view into the stories shaping the African Web3
            ecosystem.
          </p>

          <p>
            Today {site.name} is bigger, better and more committed than ever to
            capturing the people, ideas, projects and moments shaping
            Africa&rsquo;s Web3 ecosystem — and turning those stories into
            content, conversations and experiences that travel beyond the room.
          </p>

          {/* Darker than the paragraphs above — it is the closing statement,
              not another beat of the story. It tints with the rest: stopping
              the ramp one paragraph short would read as the effect breaking
              rather than as emphasis. */}
          <p className="mt-2">
            Trusted by builders, founders, communities and ecosystems pushing
            the industry forward, {site.name} exists for one reason: to tell
            the story of a thriving African Web3 ecosystem from the inside.
          </p>
        </ScrollTintText>
      </div>
    </section>
  );
}
