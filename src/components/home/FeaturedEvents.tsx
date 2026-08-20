"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Event } from "@/lib/content/schema";

/**
 * Events with their date already formatted.
 *
 * The content loader reads from disk, so it cannot be imported here — this is a
 * client component. The page formats the date on the server and passes the
 * string down.
 */
export type FeaturedEvent = Event & { dateLabel: string };

/**
 * Featured events — a pinned, scroll-scrubbed sequence.
 *
 * The section pins and scroll position drives the playhead: no autoplay, no
 * dots. Scrolling back rewinds it exactly, so the sequence can never advance
 * past something still being read, nor stall waiting on a timer.
 *
 * The poster is the centrepiece. Each step advances it like a film strip —
 * the outgoing frame rises and dims to half while the incoming frame rises
 * from below the fold and scales up into place. Two frames moving in the same
 * direction at once is what makes it read as a strip advancing rather than as
 * a cross-fade, and it is the reason the section feels physical.
 *
 * The title runs *behind* the poster. That overlap is deliberate: it binds the
 * two layers into one composition instead of leaving a column of type beside a
 * picture.
 *
 * All internal measurements are expressed in `--u`, a viewport-derived unit, so
 * every proportion — type size, poster, insets, the progress bar — scales with
 * the window as one system rather than each having its own breakpoint.
 */

/**
 * Viewport-heights of scroll per transition. Larger means a longer, gentler
 * scrub between one event and the next.
 */
const SCROLL_PER_EVENT = 1.1;

/**
 * Viewport-heights the section holds, pinned and still, before the sequence
 * starts moving. Without this the first event begins dissolving the instant
 * the section reaches the top of the screen, so it is never seen at rest.
 */
const HOLD_VH = 1;

/**
 * A partnership always reads as ITH alongside the other party, never as the
 * partner alone — the section's claim is that we were in the room with them.
 *
 * Applied here rather than typed into each content file: it is a presentation
 * rule that holds for every event, and baking it into frontmatter would mean
 * re-typing the brand name on every entry and hard-coding it into the data.
 */
function partnership(partner: string) {
  return `Inside The Hive x ${partner}`;
}

/**
 * Splits a title into two lines.
 *
 * Breaks on the collaboration separator when there is one — "Redotpay x Inside
 * The Hive Dinner Night" divides at the `x`, which is where the name divides
 * in meaning too. That also keeps each line short enough to set at display
 * size; a purely balanced split puts too many words on the first line and it
 * wraps again into a third.
 *
 * Falls back to the midpoint by word count for names with no separator.
 */
function splitTitle(title: string): [string, string] {
  const words = title.split(" ");
  if (words.length < 2) return [title, ""];

  // Break at the separator only when it leaves both halves a similar length.
  // "Redotpay | x Inside The Hive Dinner Night" splits at the right place in
  // meaning but strands 30 characters on the second line, which wraps again
  // into a third — so a lopsided separator break is rejected in favour of the
  // balanced one.
  const separator = words.findIndex((word) => word === "x" || word === "@");
  if (separator > 0) {
    const head = words.slice(0, separator).join(" ");
    const tail = words.slice(separator).join(" ");
    if (Math.abs(head.length - tail.length) <= title.length * 0.34) {
      return [head, tail];
    }
  }

  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Reads the motion preference during render rather than in an effect.
 *
 * An effect would paint the pinned section first and swap it for the static
 * list a frame later — exactly the movement the preference asks us not to
 * produce. The server snapshot is `false`, so SSR renders the animated markup
 * and the client corrects on hydration.
 */
function subscribe(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export function FeaturedEvents({ events }: { events: FeaturedEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  /**
   * Continuous playhead in event units: 0 is the first event fully settled,
   * 1.5 is exactly halfway between the second and third.
   *
   * Fractional rather than a whole index, because the layers interpolate
   * against it. Rounding here is what made the sequence feel stuck — nothing
   * moved at all until the scroll crossed a threshold, and then everything
   * jumped at once.
   */
  const [playhead, setPlayhead] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || events.length === 0) return;

    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;

      const scrolled = Math.min(Math.max(-rect.top / travel, 0), 1);

      // The first viewport-height of travel is a hold: the section is pinned
      // and fully readable before anything begins to move. Only the remainder
      // drives the sequence.
      const holdFraction = HOLD_VH / (HOLD_VH + events.length * SCROLL_PER_EVENT);
      const after = Math.max(scrolled - holdFraction, 0) / (1 - holdFraction);

      setPlayhead(after * (events.length - 1));
    };

    // Reading layout inside the scroll handler would force a synchronous
    // reflow per event; deferring to rAF keeps it to one read per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, events.length]);

  if (events.length === 0) return null;
  if (reduced) return <FeaturedEventsStatic events={events} />;

  return (
    <section
      ref={sectionRef}
      aria-label="Featured events"
      // One viewport for the sticky frame, one for the opening hold, then a
      // stretch per transition. Transitions, not events: four events need
      // three hand-offs.
      style={{
        height: `${100 + (HOLD_VH + (events.length - 1) * SCROLL_PER_EVENT) * 100}vh`,
      }}
      // `u-fluid` carries --u and --u-title, which need a media query and so
      // cannot live in a style attribute. See globals.css.
      data-nav-invert
      className="u-fluid relative bg-ink text-white"
    >
      {/* A flex column, not a stack of absolutely-positioned layers: the
          progress row is a real flow sibling below the captions, so it can
          never land on top of a long title the way an absolute bottom offset
          does. The poster stays absolute — it is meant to overlap. */}
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <Backdrop events={events} playhead={playhead} />
        <Posters events={events} playhead={playhead} />

        <p
          className="text-2xl u-label relative z-20 shrink-0 text-white"
          style={{
            paddingLeft: "calc(var(--u) * var(--u-inset))",
            // The nav hides on scroll down, so this no longer has to clear a
            // permanently pinned bar and the section gets the full viewport.
            paddingTop: "calc(var(--u) * 5)",
          }}
        >
          Featured events
        </p>

        <Captions events={events} playhead={playhead} />
        <Progress events={events} playhead={playhead} />
      </div>
    </section>
  );
}

/**
 * The backdrop: event footage, oversized well past the viewport so the scale
 * never exposes an edge, under a flat black wash that keeps type legible over
 * any frame.
 *
 * Video only. Until an event carries a `backdropVideo` the frame stays black —
 * a still here would read as the section's subject rather than as atmosphere
 * behind it, and the poster in front is already carrying the imagery.
 */
function Backdrop({
  events,
  playhead,
}: {
  events: FeaturedEvent[];
  playhead: number;
}) {
  const clips = events.filter(
    (event) => event.backdropVideo?.src && !event.backdropVideo.src.startsWith("TODO"),
  );

  if (clips.length === 0) return null;

  const active = Math.round(playhead);

  /**
   * When every event points at the same clip there is nothing to cross-fade
   * between — the transition would be invisible and four `<video>` elements
   * would decode the same file at once. One persistent element instead.
   */
  const sources = new Set(clips.map((event) => event.backdropVideo!.src));
  const shared = sources.size === 1 ? clips[0].backdropVideo! : null;

  if (shared) {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[150vh] w-[150vw] -translate-x-1/2 -translate-y-1/2">
          <video
            src={shared.src}
            poster={shared.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            // Source is portrait and the frame is wide, so cover crops the top
            // and bottom rather than letterboxing.
            className="h-full w-full object-cover"
          />
          {/* Heavy enough that the footage reads as atmosphere behind the
              type rather than as the subject competing with it. */}
          <div className="absolute inset-0 bg-black/82" />
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 h-[150vh] w-[150vw] -translate-x-1/2 -translate-y-1/2">
        {events.map((event, i) => {
          const video = event.backdropVideo;
          if (!video?.src || video.src.startsWith("TODO")) return null;
          // Full at its own position, gone one step either side, and scrubbed
          // continuously in between.
          const opacity = Math.max(0, 1 - Math.abs(playhead - i));

          return (
            <div
              key={event.slug}
              className="absolute inset-0"
              style={{ opacity }}
            >
              <video
                src={video.src}
                poster={video.poster}
                muted
                loop
                playsInline
                // Only the visible clip loads eagerly; the rest stay at
                // metadata so every loop does not download at once.
                preload={i === active ? "auto" : "metadata"}
                // Always autoplay rather than only while current: a clip that
                // starts when its event arrives is always seen from frame one
                // mid-fade, which reads as a stutter. Muted and looping, so a
                // clip running behind a fully transparent layer costs nothing
                // visible.
                autoPlay
                // The source is portrait (1080x1920) and the frame is wide, so
                // cover crops the top and bottom rather than letterboxing.
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
        {/* Flat wash, not a gradient — the type sits over the centre of frame
            as often as the edge, so directional shading would fail there.
            Heavy enough that the footage reads as atmosphere behind the type
            rather than as the subject competing with it. */}
        <div className="absolute inset-0 bg-black/82" />
      </div>
    </div>
  );
}

/**
 * The poster strip.
 *
 * Three states per frame: waiting below the fold, current, and spent above.
 * The spent frame keeps half its opacity as it rises, so for the length of a
 * transition two frames are visible at once and the strip reads as continuous.
 */
function Posters({
  events,
  playhead,
}: {
  events: FeaturedEvent[];
  playhead: number;
}) {
  return (
    <div
      aria-hidden
      // Rounded, unlike the rest of the site. DESIGN.md caps radius at 4px,
      // which is a rule about cards and chips on white; this is a large
      // photographic frame floating over footage, and a hard corner at this
      // scale reads as a crop mark rather than as a considered edge.
      className="absolute z-10 overflow-hidden rounded-xl"
      style={{
        left: "var(--u-poster-left)",
        bottom: "var(--u-poster-bottom)",
        width: "calc(var(--u) * var(--u-poster-w))",
        height: "calc(var(--u) * var(--u-poster-h))",
      }}
    >
      {events.map((event, i) => {
        const src = event.poster?.src;
        const pending = !src || src.startsWith("TODO");

        /**
         * Distance from this frame to the playhead: 0 while it is current,
         * −1 once fully spent, +1 while still waiting below.
         *
         * Driving the transform from this rather than from a three-way state
         * is what makes the strip track the scroll wheel. Frames more than one
         * step away are parked and cheap.
         */
        const d = Math.max(-1, Math.min(1, playhead - i));

        // Travel is a share of the poster's own height so the incoming frame
        // clears the box at any size: 111% below when waiting, −50% when
        // spent, matching the reference's 53.2/−24 against a 48-unit poster.
        const translate = d >= 0 ? d * -50 : d * -111;
        const scale = 1 + 0.1 * (1 - Math.abs(d));
        const opacity = d > 0 ? 1 - 0.5 * d : 1;

        return (
          <div
            key={event.slug}
            className="absolute inset-0"
            style={{
              transform: `translateY(${translate}%) scale(${scale})`,
              opacity,
              // Frames off either end of the strip must not intercept clicks.
              visibility: Math.abs(playhead - i) > 1.05 ? "hidden" : "visible",
            }}
          >
            {pending ? (
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(160deg, color-mix(in srgb, var(--color-honey) 26%, var(--color-ink)), var(--color-ink))",
                }}
              />
            ) : (
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 759px) 70vw, 26vw"
                className="object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The text layer. Sits behind the poster and is allowed to run under it.
 *
 * Only the current event is exposed to assistive tech — the rest are inert, so
 * a screen reader gets one event at a time rather than all of them stacked.
 */
function Captions({
  events,
  playhead,
}: {
  events: FeaturedEvent[];
  playhead: number;
}) {
  const active = Math.round(playhead);

  return (
    // Grows to fill the space between the eyebrow and the progress row. The
    // slides inside are absolute so they can cross-fade in place, but the
    // block itself is in flow and therefore reserves its own room.
    //
    // Above the poster: the display type crossing the image is the whole
    // composition, so it has to win the stacking order.
    <div
      className="relative z-20 min-h-0 grow"
      style={{
        paddingLeft: "calc(var(--u) * var(--u-inset))",
      }}
    >
      {events.map((event, i) => {
        const d = playhead - i;
        const distance = Math.abs(d);

        /**
         * Copy fades out faster than it fades in, so the outgoing text has
         * cleared before the incoming text arrives and the two are never
         * legible on top of each other mid-scrub.
         */
        const opacity = Math.max(0, 1 - distance * 1.6);

        return (
          <div
            key={event.slug}
            inert={i !== active}
            className="absolute left-[calc(var(--u)*var(--u-inset))]"
            style={{
              // The reference sets its eyebrow at 50 and its title block at
              // 116 — a 66px gap at 1440. This has to sit on the slide, not on
              // the parent: the slides are absolutely positioned, so the
              // parent's padding does not move them.
              top: "calc(var(--u) * 6.6)",
              // Held to the measure explicitly. Inside a flex column the slide
              // would otherwise shrink to its parent's content width and the
              // title would wrap far earlier than intended.
              width: "calc(var(--u) * var(--u-title-w))",
              opacity,
              // A short rise as it settles, so the copy arrives rather than
              // simply appearing.
              transform: `translateY(${d * -1.5}rem)`,
              visibility: distance > 1 ? "hidden" : "visible",
            }}
          >
            {/* Weight 500, not black. At this size the extra weight closes up
                the counters and the type stops being readable over footage —
                scale is already carrying the emphasis, so the stroke does not
                need to. */}
            {/* `text-wrap: normal` overrides the global balance rule for
                display headings: balancing redistributes words to even out
                line lengths, which at this size pushes a long word past the
                measure instead of breaking it. */}
            <h2
              className="font-display font-semibold text-honey/85"
              style={{
                fontSize: "var(--u-title)",
                width: "calc(var(--u) * var(--u-title-w))",
                // Looser than the 0.92 the global heading rule sets. That
                // tightness is right for a headline on white; here the lines
                // stack over an image and need air between them to stay
                // separable. The reference runs `normal` (~1.2) for the same
                // reason.
                lineHeight: 1.06,
                letterSpacing: "-0.045em",
                textWrap: "normal",
              }}
            >
              <Link
                href={`/events/${event.slug}`}
                // Inline by default, so it would not wrap inside the measure
                // and the title would overflow the box rather than break.
                className="block transition-colors duration-(--dur-fast) hover:text-white"
              >
                {/* Broken explicitly rather than left to wrap: an automatic
                    break lands wherever the measure runs out, which strands a
                    single word on the second line and moves with the viewport.
                    Two balanced lines hold at every width. */}
                {splitTitle(event.title).map((line, lineIndex) =>
                  line ? (
                    <span key={lineIndex} className="block">
                      {line}
                    </span>
                  ) : null,
                )}
              </Link>
            </h2>

            {/* Role, partner and place — the three facts that say what ITH
                actually did there, which is the claim the section makes.

                Held to the poster's left edge. Our values are longer than the
                reference's one-word ones, and without this cap they run under
                the poster and get cut in half. */}
            <dl
              className="grid"
              style={{
                // Wider than the reference's 1.0/1.7 pairing. Its metadata is
                // one word per row; ours is phrases, and phrases need more
                // separation to read as three distinct facts rather than a
                // paragraph.
                gap: "calc(var(--u) * 1.8)",
                marginTop: "calc(var(--u) * 3.4)",
                maxWidth: "var(--u-caption-w)",
              }}
            >
              <Fact label="Role" value={event.role} />
              {event.partner && (
                <Fact label="Partner" value={partnership(event.partner)} />
              )}
              <Fact label="Location" value={event.location} />
            </dl>
          </div>
        );
      })}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline"
      style={{ gap: "calc(var(--u) * 0.9)" }}
    >
      {/* Two steps below the reference's 2.8/4 pairing. Its values are single
          words; ours are phrases like "Media Partner", and at 40px those wrap
          into the poster. The label-to-value ratio is kept. */}
      <dt
        className="shrink-0 font-display font-normal text-white/40"
        style={{ fontSize: "calc(var(--u) * 1.7)", letterSpacing: "-0.03em" }}
      >
        {label}
      </dt>
      <dd
        className="font-display font-medium text-white/80"
        style={{ fontSize: "calc(var(--u) * 2.3)", letterSpacing: "-0.04em" }}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Position in the sequence.
 *
 * The current number is a stack of every number in the set with one visible at
 * a time, rather than a value being rewritten — so it changes the way the rest
 * of the section does, by one layer replacing another.
 */
function Progress({
  events,
  playhead,
}: {
  events: FeaturedEvent[];
  playhead: number;
}) {
  const index = Math.round(playhead);
  // The bar tracks the playhead continuously, so it keeps moving through a
  // transition rather than stepping only when the number changes.
  const progress =
    events.length > 1 ? playhead / (events.length - 1) : 1;
  return (
    // Last in the column and never overlapping what sits above it. The top
    // padding is the guaranteed gap between the caption block and this row.
    <div
      className="relative z-20 grid w-full shrink-0 items-center"
      style={{
        paddingTop: "calc(var(--u) * 4)",
        paddingBottom: "calc(var(--u) * 5)",
        gap: "calc(var(--u) * 1.8)",
        gridTemplateColumns: "1fr calc(var(--u) * var(--u-track)) 1fr",
      }}
    >
      <div
        className="relative text-right"
        style={{ height: "calc(var(--u) * 3.8)" }}
      >
        {events.map((event, i) => (
          <span
            key={event.slug}
            aria-hidden={i !== index}
            className="absolute right-0 font-display font-bold text-white tabular-nums transition-opacity duration-500"
            style={{
              fontSize: "calc(var(--u) * 4)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              opacity: i === index ? 1 : 0,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>

      <div
        className="relative overflow-hidden rounded-full bg-black"
        style={{ height: "calc(var(--u) * 0.4)" }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-honey"
          style={{ width: `${Math.max(progress * 100, 2)}%` }}
        />
      </div>

      <span
        className="font-display font-bold text-white tabular-nums"
        style={{
          fontSize: "calc(var(--u) * 4)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {String(events.length).padStart(2, "0")}
      </span>
    </div>
  );
}

/**
 * Reduced-motion fallback. Same events, same order, no pinning and no
 * transitions — a list that simply scrolls.
 */
function FeaturedEventsStatic({ events }: { events: FeaturedEvent[] }) {
  return (
    <section
      aria-label="Featured events"
      data-nav-invert
      className="u-section bg-ink text-white"
    >
      <div className="u-gutter">
        <p className="u-label mb-12 text-white/60">Featured events</p>

        <ul className="grid gap-16">
          {events.map((event) => (
            <li key={event.slug}>
              <h2 className="text-(length:--text-h2) text-honey">
                <Link href={`/events/${event.slug}`}>{event.title}</Link>
              </h2>
              <dl className="mt-6 grid gap-2">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <dt className="u-label w-20 shrink-0 text-white/45">Role</dt>
                  <dd className="text-white">{event.role}</dd>
                </div>
                {event.partner && (
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="u-label w-20 shrink-0 text-white/45">Partner</dt>
                    <dd className="text-white">{partnership(event.partner)}</dd>
                  </div>
                )}
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <dt className="u-label w-20 shrink-0 text-white/45">Location</dt>
                  <dd className="text-white">
                    {event.location} — {event.dateLabel}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
