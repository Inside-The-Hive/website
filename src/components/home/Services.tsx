import { services } from "@/content/team";

/**
 * What Inside The Hive does.
 *
 * The events sequence proves the track record and the lore explains the
 * reason; neither answers the question a prospective partner actually arrives
 * with, which is "what can you do for me". This states the capability
 * directly.
 *
 * A numbered list rather than a card grid. The numbering is not decoration —
 * these are the four things the brand does, and a set small enough to count is
 * a set worth counting. Cards would imply they are interchangeable options;
 * a list reads as a single offering with four parts.
 *
 * Each row carries a proof figure pulled from the same numbers the counters
 * section shows, so the claim and the evidence sit on the same line.
 */
export function Services() {
  return (
    <section
      aria-labelledby="services-heading"
      className="u-section u-rule border-t text-ink"
    >
      <div className="u-gutter">
        <div className="mb-[clamp(3rem,7vh,5rem)] flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="services-heading" className="text-(length:--text-h2)">
            What we do
          </h2>
          <p className="u-label max-w-sm text-ink/55">
            Media partner, event partner, or both
          </p>
        </div>

        <ol className="grid">
          {services.map((service, index) => (
            <li
              key={service.title}
              // A rule per row, with the last one closing the list. Separation
              // comes from the hairline and the space, never from a container.
              className="u-rule group border-t py-[clamp(1.75rem,3.5vh,2.75rem)] last:border-b"
            >
              {/* Below md the twelve-column grid collapses, so the number and
                  the title share one flex row rather than stacking — a lone
                  index on its own line reads as a stray figure. */}
              <div className="grid items-baseline gap-x-8 gap-y-3 md:grid-cols-12">
                <div className="flex items-baseline gap-4 md:col-span-5 md:gap-8">
                  {/* Tabular so the column stays true as it counts. */}
                  <span className="u-label shrink-0 text-ink/35 tabular-nums md:w-8">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-(length:--text-h3) text-ink">
                    {service.title}
                  </h3>
                </div>

                <p className="max-w-prose text-ink/60 md:col-span-5">
                  {service.description}
                </p>

                {/* The proof, right-aligned so the figures form their own
                    column down the edge of the list. */}
                <span className="u-label text-ink md:col-span-2 md:text-right">
                  {service.note}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
