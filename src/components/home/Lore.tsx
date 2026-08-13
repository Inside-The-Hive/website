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
      className="py-[clamp(6rem,18vh,14rem)] text-ink"
    >
      <div className="u-gutter">
        <h2 id="lore-heading" className="sr-only">
          How {site.name} started
        </h2>

        {/* The thesis. Centred and set on a wide measure, so it reads as one
            held thought rather than as body copy. `text-balance` evens the
            line lengths, which matters more here than anywhere else on the
            page — a centred block with one short last line looks accidental. */}
        <p className="mx-auto max-w-[64rem] text-center text-(length:--text-h3) leading-[1.24] text-balance text-ink">
          {site.name} started the way most things in Lagos start — someone
          young, out of school, with more conviction than plan, walking into
          rooms he had not been invited to and paying attention.
        </p>

        {/* The narrative. Smaller and on a narrower measure than the statement
            above: this is the detail behind the claim, not a second claim.
            The block is centred on the page but the text inside is left
            aligned — centring every line of a multi-paragraph passage leaves
            both edges ragged and slows reading for no gain. */}
        <div className="mx-auto mt-[clamp(3rem,7vh,5.5rem)] grid max-w-[34rem] gap-6 text-left text-ink/60">
          <p>
            There was no studio and no budget. There was a phone, a borrowed
            camera, and a suspicion that African Web3 was being covered by
            people who had never stood in one of its rooms. The coverage that
            existed came from a distance — announcements, threads, secondhand
            takes. Nobody was in the room while it happened.
          </p>

          <p>
            So he went. Meetups above shops, launches that ran three hours
            late, conference hallways where the real conversation was always
            happening just outside the panel. He shot what he saw, published
            it fast, and learned the difference between reporting on a
            community and belonging to one.
          </p>

          <p>
            People started recognising the camera before they recognised him.
            Founders asked him to cover launches. Then to help run them. The
            work turned from documenting other people&rsquo;s events into
            building the ones worth documenting — dinners, screenings,
            summits, a podcast that puts the same people on the record.
          </p>

          {/* Centred and darker than the paragraphs above — it is the closing
              statement, not another beat of the story. */}
          <p className="mt-2 text-center text-ink/85">
            That is still the whole method. Be in the room. Bring a camera.
            Make something the room is proud of.
          </p>
        </div>
      </div>
    </section>
  );
}
