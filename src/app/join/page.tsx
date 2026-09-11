import type { Metadata } from "next";
import Link from "next/link";
import { DoodleField } from "@/components/DoodleField";
import { site, socials } from "@/content/site";

/**
 * Join the Hive, when the Hive is not hiring.
 *
 * The button has sat in the nav since v1 pointing at nothing — it 404ed on
 * the old site too. Rather than remove the call to action or send it to the
 * events page (which answers a question nobody asked by clicking "Join"),
 * this answers it directly: no roles open, here is how to be first to know,
 * here is what we are actually doing.
 *
 * No form and no applicant pipeline, because neither exists. One address,
 * which is the same one the rest of the site uses.
 */

export const metadata: Metadata = {
  title: "Join the Hive",
  description:
    "No open roles at Inside The Hive right now. How to reach us, and where to see what we are working on.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: `Join the Hive — ${site.name}`,
    description: "No open roles right now — here is how to stay close.",
    url: "/join",
  },
};

export default function JoinPage() {
  const email =
    socials.find((s) => s.label === "Email")?.href ??
    "mailto:insidethehivepod@gmail.com";
  const address = email.replace(/^mailto:/, "");

  return (
    <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-white text-ink">
      <DoodleField />

      <div className="u-gutter relative z-10 py-24">
        <p className="u-label text-ink/55">Join the Hive</p>

        <h1 className="mt-6 max-w-[18ch] text-(length:--text-h1) leading-[0.95] font-normal tracking-[-0.03em]">
          No roles open{" "}
          <span className="relative inline-block">
            <span className="font-script">right now</span>
            <span
              aria-hidden
              className="absolute inset-x-[-0.06em] bottom-[0.12em] -z-10 h-[0.3em] bg-honey"
            />
          </span>
        </h1>

        <p className="mt-8 max-w-prose text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-ink/70">
          The crew is small and we are not hiring at the moment. When that
          changes it is posted here first. If you shoot, edit, write or produce
          and you want to be on the list for when it does, send us your work —
          we do read them.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${address}?subject=${encodeURIComponent("Working with Inside The Hive")}`}
            className="u-label inline-flex min-h-12 items-center bg-honey px-6 text-ink transition-colors duration-(--dur-fast) hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Send us your work
          </a>
          <span className="text-ink/55">{address}</span>
        </div>

        {/* Somewhere to go instead of a dead end — the same closing move the
            merch page makes. Partnership is the other reason people click a
            call to action like this one, so it is named here rather than left
            for them to find. */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/gallery"
            className="u-label inline-flex items-center gap-2 text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
          >
            See the work <span aria-hidden>→</span>
          </Link>
          <Link
            href="/podcast"
            className="u-label inline-flex items-center gap-2 text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
          >
            Hear the podcast <span aria-hidden>→</span>
          </Link>
          <a
            href={`mailto:${address}?subject=${encodeURIComponent("Partnering with Inside The Hive")}`}
            className="u-label inline-flex items-center gap-2 text-ink/55 transition-colors duration-(--dur-fast) hover:text-ink"
          >
            Partner with us <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
