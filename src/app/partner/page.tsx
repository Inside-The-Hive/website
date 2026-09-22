import type { Metadata } from "next";
import Link from "next/link";
import { DoodleField } from "@/components/DoodleField";
import { partners } from "@/content/partners";
import { site, socials, stats } from "@/content/site";

/**
 * Partnering with Inside The Hive.
 *
 * The prompt that used to be the whole ask is a card in the corner of a page —
 * a few lines and a mailto. Anyone it actually persuaded had nowhere to go to
 * find out what partnering means, so this is the page behind it: what the four
 * kinds of partnership are, what has been done already, and one address.
 *
 * Everything here is drawn from what the site can evidence — the services list,
 * the counted stats, the real partner names. No invented case studies, no
 * pricing, no promises about turnaround.
 */

export const metadata: Metadata = {
  title: "Partner with us",
  description:
    "Media partner, event partner, or both. What partnering with Inside The Hive involves, and how to start the conversation.",
  alternates: { canonical: "/partner" },
  openGraph: {
    title: `Partner with us — ${site.name}`,
    description: "Media partner, event partner, or both.",
    url: "/partner",
  },
};

/**
 * What a partner actually gets, per kind of work.
 *
 * The same four the homepage lists as capability, restated as what a partner
 * receives rather than what ITH does — the reader here has already decided
 * they are interested and is asking what it involves.
 */
const OFFERS = [
  {
    title: "Event partnership",
    body: "We host and produce the night with you — room list, run of show, and the people who should be in it. You get an event that happened properly, and the record of it afterwards.",
  },
  {
    title: "Media partnership",
    body: "We come to your event with cameras and cover it on the ground. Photography and video, delivered as work you can use, not as a highlight reel nobody watches twice.",
  },
  {
    title: "On the podcast",
    body: "A long-form conversation with the people building your project, recorded properly and published to the show's own audience.",
  },
  {
    title: "Something else",
    body: "Most of what we have done started as a conversation that did not fit a category. If you have a room that needs filling, say what you are planning.",
  },
];

export default function PartnerPage() {
  const email =
    socials.find((s) => s.label === "Email")?.href ??
    "mailto:insidethehivepod@gmail.com";
  const address = email.replace(/^mailto:/, "");
  const mailto = `mailto:${address}?subject=${encodeURIComponent("Partnering with Inside The Hive")}`;

  // Only the figures that speak to a prospective partner. The podcast and
  // listener counts belong on the show's own page.
  const proof = stats.filter((stat) =>
    ["Events hosted", "Memories captured", "Partnerships secured"].includes(
      stat.label,
    ),
  );

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white text-ink">
        <DoodleField />

        <div className="u-gutter relative z-10 pt-24 pb-[clamp(3rem,8vh,5rem)] md:pt-[9rem]">
          <p className="u-label text-(length:--text-small) text-ink/55">
            Partner with us
          </p>

          <h1 className="mt-6 max-w-[20ch] text-(length:--text-h1) leading-[0.95] font-normal tracking-[-0.03em]">
            Got a room that needs{" "}
            <span className="relative inline-block">
              <span className="font-script">filling</span>
              <span
                aria-hidden
                className="absolute inset-x-[-0.06em] bottom-[0.12em] -z-10 h-[0.3em] bg-honey"
              />
            </span>
            ?
          </h1>

          <p className="mt-8 max-w-prose text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-ink/70">
            We host, cover and document events across the continent — and put
            the people building on the record. Media partner, event partner, or
            both.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={mailto}
              className="u-label inline-flex min-h-12 items-center bg-honey px-7 text-(length:--text-nav) text-ink transition-colors duration-(--dur-fast) hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Start a conversation
            </a>
            <span className="text-(length:--text-nav) text-ink/55">
              {address}
            </span>
          </div>

          {/* The counted record, as the reason to believe the paragraph above.
              These are the site's own figures, not claims written for this
              page. */}
          <dl className="u-rule mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 gap-y-8 border-t pt-10 sm:grid-cols-3">
            {proof.map((stat) => (
              <div key={stat.label}>
                <dt className="u-label text-(length:--text-small) text-ink/55">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-(length:--text-h2) leading-none font-normal tracking-[-0.03em] tabular-nums">
                  {stat.value?.toLocaleString("en-GB")}
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* What partnering actually involves. Hairline rows in the manner of the
          homepage services list, so the page has structure without inventing
          a card grid to carry it. */}
      <section
        aria-labelledby="partner-offers-heading"
        className="u-section u-rule border-t bg-white text-ink"
      >
        <div className="u-gutter">
          <h2
            id="partner-offers-heading"
            className="text-(length:--text-h2) font-normal"
          >
            What that <span className="font-script">looks like</span>
          </h2>

          <ul className="u-rule mt-[clamp(2rem,5vh,3rem)] grid grid-cols-1 border-t md:grid-cols-2">
            {OFFERS.map((offer) => (
              <li
                key={offer.title}
                className="u-rule border-b py-8 md:px-8 md:odd:border-r md:odd:pl-0 md:even:pr-0"
              >
                <h3 className="text-(length:--text-h3) font-normal">
                  {offer.title}
                </h3>
                <p className="mt-3 max-w-prose leading-relaxed text-ink/70">
                  {offer.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who has already done this. Names only — the logo files have not been
          supplied, and a wordmark set in the site's own type is honest where a
          traced logo would not be. */}
      <section
        aria-labelledby="partner-proof-heading"
        className="u-section u-rule border-t bg-white text-ink"
      >
        <div className="u-gutter">
          <h2
            id="partner-proof-heading"
            className="text-(length:--text-h2) font-normal"
          >
            Rooms we have <span className="font-script">been in</span>
          </h2>

          <ul className="mt-[clamp(2rem,5vh,3rem)] flex flex-wrap gap-x-10 gap-y-5">
            {partners.map((partner) => (
              <li
                key={partner.name}
                className="font-mono text-(length:--text-h3) text-ink/45"
              >
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener"
                    className="transition-colors duration-(--dur-fast) hover:text-ink"
                  >
                    {partner.name}
                  </a>
                ) : (
                  partner.name
                )}
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/gallery"
              className="u-label inline-flex items-center gap-2 text-(length:--text-nav) text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
            >
              See the work <span aria-hidden>→</span>
            </Link>
            <Link
              href="/podcast"
              className="u-label inline-flex items-center gap-2 text-(length:--text-nav) text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
            >
              Hear the podcast <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The ask again, at the end, for anyone who read the whole page. */}
      <section className="u-section u-rule border-t bg-ink text-white">
        <div className="u-gutter">
          <h2 className="max-w-[20ch] text-(length:--text-h2) font-normal">
            Tell us what you are <span className="font-script">planning</span>
          </h2>
          <p className="mt-6 max-w-prose leading-relaxed text-white/70">
            One address, and a person reads it. Say what the event is, roughly
            when, and what you want to come out of it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={mailto}
              className="u-label inline-flex min-h-12 items-center bg-honey px-7 text-(length:--text-nav) text-ink transition-colors duration-(--dur-fast) hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start a conversation
            </a>
            <span className="text-(length:--text-nav) text-white/55">
              {address}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
