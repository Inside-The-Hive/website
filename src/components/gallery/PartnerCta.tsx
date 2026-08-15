import Link from "next/link";

/**
 * The ask, at the foot of the gallery.
 *
 * Everything above this is the argument — rooms filled, nights documented,
 * frames that hold up at full size. The page made that case and then stopped
 * without asking for anything, which is the one thing a portfolio must not do.
 *
 * Footage rather than a flat panel, because the section is asking to be hired
 * to shoot exactly this. A still would have worked, but the page above is
 * already photographs; motion is the one thing the gallery has not shown yet,
 * and it is half of what ITH actually sells.
 *
 * The clip is a room, not a subject: it sits behind type and is dimmed hard, so
 * it wants movement and warmth rather than something in particular to look at.
 */

/** Reused from the events sequence — already transcoded, already shipped. */
const BACKDROP = {
  src: "/videos/redotdinner-loop.mp4",
  poster: "/videos/redotdinner-poster.jpg",
};

export function PartnerCta() {
  return (
    <section
      aria-labelledby="gallery-cta-heading"
      data-nav-invert
      // A floor on the height, so the band reads as a room the copy is standing
      // in rather than as a strip of footage behind a paragraph. Without it the
      // section is only as tall as its text and the clip is cropped to a sliver.
      className="relative z-10 isolate flex min-h-[clamp(28rem,62vh,40rem)] items-center overflow-hidden bg-ink text-white"
    >
      {/* The clip. Muted and inert: no controls, not focusable, and invisible
          to assistive technology, because it carries no information the copy
          does not. `poster` holds the frame while it loads so the band is never
          briefly empty. */}
      <video
        // `motion-reduce:hidden` takes the clip out entirely for anyone who
        // has asked for less movement, leaving the poster underneath. Pausing
        // it would still leave a video element that some browsers resume.
        className="absolute inset-0 -z-10 size-full object-cover object-[50%_35%] motion-reduce:hidden"
        src={BACKDROP.src}
        poster={BACKDROP.poster}
        autoPlay
        muted
        loop
        playsInline
        // Nothing here is worth a data plan on a phone; the poster stands in.
        preload="metadata"
        aria-hidden
        tabIndex={-1}
      />

      {/* The still, behind the clip. It is what shows under reduced motion, and
          what fills the band in the moment before the video has any frames. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-[50%_35%]"
        style={{ backgroundImage: `url(${BACKDROP.poster})` }}
      />

      {/* Scrim. Heavier on the left where the type sits, easing off to the
          right so the footage stays legible as footage rather than being
          flattened into a dark rectangle. The second layer lifts the floor
          across the whole band, which is what holds the body copy at a
          readable contrast wherever the clip happens to be bright. */}
      <div
        aria-hidden
        // Above both the clip and the poster beneath it, below the copy.
        className="absolute inset-0 z-[-5]"
        style={{
          background: `
            linear-gradient(to right, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.82) 42%, rgba(10,10,10,0.55) 100%),
            linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.25) 45%, rgba(10,10,10,0.6) 100%)
          `,
        }}
      />

      <div className="u-gutter w-full">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="u-label text-honey">Coverage</p>

            <h2
              id="gallery-cta-heading"
              className="mt-5 text-(length:--text-h2) font-normal"
            >
              Want your event <span className="font-script">documented</span>{" "}
              like this?
            </h2>
            <p className="mt-6 max-w-prose text-white/75">
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
              // Backdrop blur rather than a flat border: over moving footage a
              // plain outlined button loses its edge whenever a light frame
              // passes behind it.
              className="u-label inline-flex min-h-12 items-center border border-white/30 bg-white/5 px-7 text-white backdrop-blur-sm transition-colors duration-(--dur-fast) hover:border-white hover:bg-white/15"
            >
              See the events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
