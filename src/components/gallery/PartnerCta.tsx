import Link from "next/link";

/**
 * The ask, at the foot of the gallery.
 *
 * Everything above this is the argument — rooms filled, nights documented,
 * frames that hold up at full size. The page made that case and then stopped
 * without asking for anything, which is the one thing a portfolio must not do.
 *
 * Inverted, because it is the end of the page and should read as a different
 * kind of block from the photographs above it rather than as one more section
 * of them.
 */
export function PartnerCta() {
  return (
    <section
      aria-labelledby="gallery-cta-heading"
      data-nav-invert
      className="u-section relative z-10 bg-ink text-white"
    >
      <div className="u-gutter">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] md:grid-cols-12">
          <div className="md:col-span-7">
            <h2
              id="gallery-cta-heading"
              className="text-(length:--text-h2) font-normal"
            >
              Want your event <span className="font-script">documented</span>{" "}
              like this?
            </h2>
            <p className="mt-6 max-w-prose text-white/65">
              We cover events on the ground — photography and video that treats
              a night as something that happened to people, not as content.
              Media partner, event partner, or both.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-4 md:col-span-5 md:justify-end">
            {/* Yellow as a fill with ink text — the one loud element here, and
                the same treatment the nav gives its primary action. */}
            <Link
              href="/partner"
              className="u-label inline-flex min-h-12 items-center bg-honey px-7 text-ink transition-colors duration-(--dur-fast) hover:bg-white"
            >
              Partner with us
            </Link>
            <Link
              href="/events"
              className="u-label inline-flex min-h-12 items-center border border-white/25 px-7 text-white transition-colors duration-(--dur-fast) hover:border-white hover:bg-white/5"
            >
              See the events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
