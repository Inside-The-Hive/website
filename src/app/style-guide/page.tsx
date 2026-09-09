import type { Metadata } from "next";
import { HiveId } from "@/components/HiveId";
import { HiveMedia } from "@/components/HiveMedia";
import { contrastRatio, grade } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const TOKENS = [
  { name: "white", hex: "#FFFFFF", use: "Page base" },
  { name: "ink", hex: "#0A0A0A", use: "All body and display text; inverted sections" },
  { name: "ash", hex: "#F4F4F2", use: "Raised surfaces, media skeletons" },
  { name: "line", hex: "#E2E0DC", use: "Hairline rules" },
  { name: "honey", hex: "#F0A202", use: "Logo, fills, active marks. Never text." },
  { name: "propolis", hex: "#6B2D0E", use: "Warm emphasis, used sparingly" },
];

const PAIRS = [
  {
    fg: "#0A0A0A",
    bg: "#FFFFFF",
    label: "ink on white",
    note: "All body and display text",
  },
  {
    fg: "#FFFFFF",
    bg: "#0A0A0A",
    label: "white on ink",
    note: "Inverted sections and CTAs",
  },
  {
    fg: "#0A0A0A",
    bg: "#F0A202",
    label: "ink on honey",
    note: "Buttons and the hive ID chip on hover",
  },
  {
    fg: "#6B2D0E",
    bg: "#FFFFFF",
    label: "propolis on white",
    note: "Warm emphasis, used sparingly",
  },
  {
    fg: "#0A0A0A",
    bg: "#F4F4F2",
    label: "ink on ash",
    note: "Text over a raised surface",
  },
  {
    fg: "#F0A202",
    bg: "#FFFFFF",
    label: "honey on white",
    note: "NEVER USE — yellow never carries text",
  },
];

const TYPE = [
  {
    token: "--text-mega",
    label: "Mega / Inter Tight 800",
    sample: "In the room",
    font: "font-display font-extrabold",
  },
  {
    token: "--text-h1",
    label: "H1 / Inter Tight 800",
    sample: "Africa's Web3, covered",
    font: "font-display font-extrabold",
  },
  {
    token: "--text-h2",
    label: "H2 / Inter Tight 800",
    sample: "Latest event recap",
    font: "font-display font-extrabold",
  },
  {
    token: "--text-h3",
    label: "H3 / Inter Tight 800",
    sample: "Redots Club Dinner",
    font: "font-display font-extrabold",
  },
  {
    token: "--text-body",
    label: "Body / Inter 400",
    sample: "We host the room, cover the room, and put a microphone in it.",
    font: "font-body",
  },
  {
    token: "--text-small",
    label: "Small / Inter 400",
    sample: "Secondary copy, captions and meta.",
    font: "font-body",
  },
  {
    token: "--text-label",
    label: "Label / Inter 600 tracked",
    sample: "Media partner",
    font: "font-body font-semibold tracking-[0.08em]",
  },
];

export default function StyleGuide() {
  return (
    <div className="u-gutter u-section">
      <header className="max-w-3xl">
        <p className="u-label text-propolis">Internal reference</p>
        <h1 className="mt-4 text-(length:--text-h1)">Style guide</h1>
        <p className="mt-6 text-ink/70">
          Every token the site is built from. This page is noindex and exists so the team
          can check work against the system. Contrast ratios below are computed at render
          time, not written by hand.
        </p>
      </header>

      {/* ---- Colour ---- */}
      <Section title="Colour" number="01">
        <div className="u-rule grid gap-px border bg-[color-mix(in_srgb,var(--color-propolis)_60%,transparent)] sm:grid-cols-2 lg:grid-cols-3">
          {TOKENS.map((token) => (
            <div key={token.name} className="bg-white p-6">
              <div
                className="u-rule h-24 w-full border"
                style={{ background: token.hex }}
              />
              <p className="u-label mt-4 text-ink">{token.name}</p>
              <p className="u-label mt-1 text-ink/55">{token.hex}</p>
              <p className="mt-3 text-small text-ink/70">{token.use}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Contrast ---- */}
      <Section title="Contrast" number="02">
        <p className="mb-8 max-w-2xl text-ink/70">
          AA requires 4.5:1 for body text and 3:1 for large text. The two failing pairs
          are documented so nobody rediscovers them.
        </p>
        <ul className="u-rule flex flex-col gap-px border bg-[color-mix(in_srgb,var(--color-propolis)_60%,transparent)]">
          {PAIRS.map((pair) => {
            const ratio = contrastRatio(pair.fg, pair.bg);
            const result = grade(ratio);
            return (
              <li
                key={pair.label}
                className="flex flex-wrap items-center justify-between gap-4 bg-white p-5"
              >
                <div className="flex items-center gap-5">
                  <span
                    className="inline-flex min-w-32 items-center justify-center px-4 py-3"
                    style={{ background: pair.bg, color: pair.fg }}
                  >
                    Sample
                  </span>
                  <span>
                    <span className="u-label block text-ink">{pair.label}</span>
                    <span className="mt-1 block text-small text-ink/60">{pair.note}</span>
                  </span>
                </div>
                <span className="u-label flex items-center gap-3">
                  <span className="text-ink/60">{ratio.toFixed(2)}:1</span>
                  <span
                    className={
                      result === "FAIL"
                        ? "bg-propolis px-2 py-1 text-white"
                        : "bg-honey px-2 py-1 text-ink"
                    }
                  >
                    {result}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ---- Type ---- */}
      <Section title="Type" number="03">
        <ul className="flex flex-col">
          {TYPE.map((entry) => (
            <li key={entry.token} className="u-rule border-t py-8 first:border-t-0">
              <div className="u-label mb-4 flex gap-4 text-ink/55">
                <span>{entry.label}</span>
                <span>{entry.token}</span>
              </div>
              <p
                className={`${entry.font} text-ink`}
                style={{ fontSize: `var(${entry.token})` }}
              >
                {entry.sample}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- Hive ID ---- */}
      <Section title="Hive ID chip" number="04">
        <p className="mb-8 max-w-2xl text-ink/70">
          The signature element. Resting, then hover the card below to see it fill honey
          and invert while the media desaturates behind it.
        </p>
        <div className="flex flex-wrap items-start gap-10">
          <div>
            <p className="u-label mb-3 text-ink/55">Resting</p>
            <HiveId id="HIVE/2026/007" />
          </div>
          <div className="group">
            <p className="u-label mb-3 text-ink/55">On card hover</p>
            <HiveId id="HIVE/2026/007" />
          </div>
        </div>
      </Section>

      {/* ---- Buttons ---- */}
      <Section title="Buttons" number="05">
        <div className="flex flex-wrap items-center gap-6">
          <button className="u-label inline-flex min-h-11 items-center bg-honey px-5 text-ink transition-colors duration-(--dur-fast) hover:bg-ink hover:text-white">
            Primary
          </button>
          <button className="u-label u-rule inline-flex min-h-11 items-center border px-5 text-ink transition-colors duration-(--dur-fast) hover:border-honey hover:text-propolis">
            Secondary
          </button>
          <button
            disabled
            className="u-label u-rule inline-flex min-h-11 cursor-not-allowed items-center border px-5 text-ink/40"
          >
            Disabled
          </button>
        </div>
      </Section>

      {/* ---- Event card ---- */}
      <Section title="Event card" number="06">
        <p className="mb-8 max-w-2xl text-ink/70">
          Card anatomy: media, hive ID, title, one kicker line, role tag. Nothing else.
          Media renders its designed skeleton until real photography is delivered.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
          <a href="#" className="group block">
            <div className="relative">
              <HiveMedia
                alt="Sample event card in its pending-media state"
                ratio="4/5"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              <HiveId id="HIVE/2026/007" className="absolute top-4 left-4" />
            </div>
            <h3 className="mt-5 text-(length:--text-h3)">Sample event</h3>
            <p className="mt-2 text-small text-ink/70">
              One kicker line, under 120 characters.
            </p>
            <p className="u-label mt-4 text-propolis">Media partner</p>
          </a>
        </div>
      </Section>

      {/* ---- Motion ---- */}
      <Section title="Motion" number="07">
        <ul className="flex flex-col gap-3">
          {[
            [
              "--ease-out-expo",
              "cubic-bezier(0.16, 1, 0.3, 1)",
              "Everything. One curve.",
            ],
            ["--dur-fast", "200ms", "Chips, links, nav"],
            ["--dur-base", "500ms", "Card hovers, image cross-fades"],
            ["--dur-slow", "900ms", "Hero media resolve only"],
          ].map(([token, value, use]) => (
            <li
              key={token}
              className="u-rule flex flex-wrap gap-x-8 gap-y-1 border-t pt-3"
            >
              <span className="u-label min-w-40 text-ink">{token}</span>
              <span className="u-label text-ink/55">{value}</span>
              <span className="text-small text-ink/70">{use}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <section className="u-rule mt-24 border-t pt-10">
      <div className="mb-10 flex items-baseline gap-4">
        <span className="u-label text-propolis">{number}</span>
        <h2 className="text-(length:--text-h3)">{title}</h2>
      </div>
      {children}
    </section>
  );
}
