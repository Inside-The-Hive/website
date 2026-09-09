import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DoodleField } from "@/components/DoodleField";
import { NotifyForm } from "@/components/merch/NotifyForm";
import { site, socials } from "@/content/site";

/**
 * The store, before there is a store.
 *
 * The nav has carried a Merch link since the first build, pointing at a
 * subdomain that does not resolve yet — so on the day the domain switches
 * that link is a 404 on the live site. This is the honest version of that
 * link: it says the same thing the 404 would, deliberately.
 *
 * Written as one held page rather than a marketing pitch. There is no
 * product, no photography, and no date, so anything beyond "not yet, here is
 * how to hear about it" would be invented — and the rest of the site is
 * built on not inventing things.
 */

export const metadata: Metadata = {
  title: "Merch",
  description: `Inside The Hive merch is on the way. Hear about the first drop before it goes live.`,
  alternates: { canonical: "/merch" },
  openGraph: {
    title: `Merch — ${site.name}`,
    description: "Inside The Hive merch is on the way.",
    url: "/merch",
  },
};

/**
 * What the drop will be, stated as fact rather than as a feature list.
 *
 * Three lines because three is what can be said truthfully: the goods are
 * being made, the runs are small, and the site will carry them. Everything
 * else — prices, dates, garments — is unknown, and a placeholder here would
 * be the same mistake as a placeholder testimonial.
 */
const NOTES = [
  {
    label: "In production",
    body: "Pieces are being made now — cut, printed and checked before anything is listed.",
  },
  {
    label: "Small runs",
    body: "Made in limited numbers rather than held in stock, so the first drop will be finite.",
  },
  {
    label: "Here first",
    body: "The store opens on this site. No third-party marketplace, no resellers.",
  },
];

export default function MerchPage() {
  const email =
    socials.find((s) => s.label === "Email")?.href ??
    "mailto:contact@insidedhive.com";

  return (
    <>
      {/* The held announcement. A full screen given to one sentence — the page
          has one thing to say and says it at the size the hero says its own
          headline, so the wait reads as deliberate rather than as an error
          page dressed up. */}
      <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-white text-ink">
        <DoodleField />

        {/* Two columns from md. The statement had the full width to itself and
            left the right half of a desktop screen empty — the mark fills it
            with the brand's own object rather than with a mocked-up garment
            nobody has made yet. */}
        <div className="u-gutter relative z-10 grid items-center gap-12 py-24 md:grid-cols-[1.15fr_1fr] md:py-0">
          <div>
          <p className="u-label text-ink/55">Inside The Hive</p>

          {/* The wordmark-scale statement. "soon" in the script face for the
              same reason the crew's names are: it is the one word doing the
              emotional work, and the site's script is reserved for exactly
              that. */}
          <h1 className="mt-6 max-w-[16ch] text-(length:--text-h1) leading-[0.95] font-normal tracking-[-0.03em]">
            The merch is coming{" "}
            <span className="relative inline-block">
              <span className="font-script">soon</span>
              {/* The honey mark behind the word rather than a rule under it.
                  Underneath, it detached: the script face carries a deep
                  descender, so a baseline rule floats well clear of the
                  letterforms and reads as a stray bar. Struck through the
                  lower third of the word instead — the same treatment the
                  hero gives "Biggest", and it holds whatever the descender
                  does. */}
              <span
                aria-hidden
                className="absolute inset-x-[-0.06em] bottom-[0.12em] -z-10 h-[0.3em] bg-honey"
              />
            </span>
          </h1>

          <p className="mt-8 max-w-prose text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-ink/70">
            We are making the things people keep asking us for. No date to
            announce yet — when the first drop is ready it goes live here, and
            the people on the list hear about it first.
          </p>

          <div className="mt-10 max-w-md">
            <NotifyForm mailto={email} />
          </div>

          {/* Back into the site rather than a dead end — the same closing move
              every other secondary page makes. */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/gallery"
              className="u-label inline-flex items-center gap-2 text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
            >
              See the gallery <span aria-hidden>→</span>
            </Link>
            <Link
              href="/podcast"
              className="u-label inline-flex items-center gap-2 text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
            >
              Hear the podcast <span aria-hidden>→</span>
            </Link>
          </div>
          </div>

          {/* The hive mark, held large and turning slowly.
              The brand's own object, not a product: there is nothing to
              photograph yet, and a mocked-up garment would be exactly the
              invention this page exists to avoid. Hidden below md, where the
              statement wants the whole screen. */}
          <div
            aria-hidden
            className="relative hidden aspect-square w-full max-w-sm justify-self-center md:block"
          >
            <div className="absolute inset-0 grid place-items-center">
              <Image
                src="/Logo.png"
                alt=""
                width={420}
                height={420}
                priority
                className="w-[72%] animate-[hive-drift_28s_linear_infinite] motion-reduce:animate-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is actually known about the drop. Three hairline-ruled rows in
          the manner of the services list, so the page has a second beat
          without inventing a product grid to fill it. */}
      <section
        aria-labelledby="merch-notes-heading"
        className="u-section u-rule border-t bg-white text-ink"
      >
        <div className="u-gutter">
          <h2 id="merch-notes-heading" className="sr-only">
            What to expect
          </h2>

          <ul className="u-rule grid grid-cols-1 border-t md:grid-cols-3">
            {NOTES.map((note) => (
              <li
                key={note.label}
                className="u-rule border-b px-0 py-8 md:border-r md:px-8 md:last:border-r-0 md:first:pl-0"
              >
                <p className="u-label text-ink/55">{note.label}</p>
                <p className="mt-3 max-w-prose leading-relaxed text-ink/70">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
