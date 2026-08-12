# Inside The Hive — Build Plan

Branch: `feat/site-v1` → PR into `main`. Conventional commits, small logical units.
Never commit to `main`.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript, `src/`, Turbopack dev |
| Styling | Tailwind CSS v4 — tokens in an `@theme` block in CSS, no JS config |
| Smooth scroll | Lenis |
| Fonts | `next/font/google` — self-hosted at build, no external requests |
| Analytics | `@next/third-parties/google` (GA4 only) |
| Sitemap/robots | Native `sitemap.ts` / `robots.ts` — no package |
| Content | MDX + `gray-matter` + `next-mdx-remote`, validated with Zod |
| Utilities | `clsx`, `tailwind-merge`, `motion` (scroll reveals only), `sharp` |

**Not used:** any component library, CSS-in-JS, GSAP, jQuery, any analytics beyond GA4.

Node 20+ (building on 24.13.0). Lockfile committed.

---

## Stage 1 — Design plan ✅

`docs/DESIGN.md` + `docs/PLAN.md`. **Awaiting approval before any scaffolding.**

Both reference sites and the current ITH site were fetched and their markup inspected —
findings are in `DESIGN.md` §2 and §3, with the current site's defects evidenced rather than
asserted.

---

## Stage 2 — Scaffold, tokens, style guide

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm
npm i lenis @next/third-parties/google clsx tailwind-merge motion zod \
  gray-matter next-mdx-remote
npm i -D prettier prettier-plugin-tailwindcss @types/node sharp
```

- `globals.css` — full `@theme` block, commented, complete before any component exists
- `src/lib/fonts.ts` — Bricolage Grotesque, Instrument Sans, Space Mono via `next/font/google`,
  `display: "swap"`, size-adjust fallbacks to prevent CLS
- `/style-guide` (noindex) — every colour swatch with hex **and contrast ratio against both
  grounds**, every type size in display and body, button states, the hive ID chip in all states,
  the event card in all states, the media skeleton
- Prettier, ESLint, `.editorconfig`, `.env.example`

`git commit -m "chore: scaffold Next 15 with Tailwind v4 and design tokens"`

---

## Stage 3 — Layout shell

- `SmoothScroll.tsx` — Lenis on rAF, cleanup on unmount, **fully disabled** under
  `prefers-reduced-motion`, scroll progress exposed via context
- `ScrollProgress.tsx` — 2px honey line, consumes that context
- `Nav.tsx` — wordmark left; `Events · Podcast · About · Partner` right; visually separated
  `Merch ↗` (`target=_blank rel="noopener"`); honey `Join the Hive` CTA.
  Transparent over hero → `carbon` with hairline `propolis` bottom border past 80vh
- `MobileMenu.tsx` — full-screen overlay, items at `--text-h2` in display type, focus trap,
  `Esc` to close, scroll lock
- `Footer.tsx` — four groups (Explore / Listen / Company / Social), **under 12 links total**
- Skip-to-content link

**Known bug to test explicitly:** Lenis + App Router route changes must reset scroll to top, and
in-page anchors must still work. This is the standard failure mode — it gets a manual test, not
an assumption.

`git commit -m "feat: layout shell with Lenis smooth scroll and scroll progress"`

---

## Stage 4 — Content model

```
content/
  events/     2026-technova.mdx, 2026-redots-club-dinner.mdx
  episodes/   sample episodes pending catalogue export
  partners.ts  team.ts  site.ts
```

- `src/lib/content/schema.ts` — Zod schemas for event + episode frontmatter.
  **Alt text is a required field with a minimum length**, so `"event photo 2"` cannot ship.
- `src/lib/content/index.ts` — read, parse, validate at build time; fail the build on invalid
  frontmatter rather than rendering something broken
- `HiveMedia.tsx` — `next/image` with AVIF/WebP, correct `sizes`, `priority` only on hero;
  renders the designed skeleton when `src` is absent
- Episode schema carries `category` (blockchain · crypto · web3 · nft · creator-and-socialfi —
  the five real categories from the live site) and platform URLs for all six platforms
- Content model stays extensible for `/articles` in v2. `/articles` is **not** built.

All unknown values are `TODO:` in content files. Never in components.

`git commit -m "feat: typed content model with Zod validation"`

---

## Stage 5 — Homepage

Section order is the strategy. Not rearranged.

1. Hero — full-bleed media, orchestrated load sequence, one `<h1>`
2. Positioning line — one large sentence on `wax`, plenty of air
3. Latest event recap — one featured event, full-bleed, huge
4. Events grid — 3–5 image-led cards with hive ID chips → `/events`
5. Podcast — one featured episode + platform links
6. Partners — logo marquee, single row, quiet. **The only marquee on the page.**
7. By the numbers — odometer digit roll; figures `TODO:` pending real data
8. Join the Hive — community CTA
9. Footer

**Stop here for review.**

`git commit -m "feat: homepage sections"`

---

## Stage 6 — Events

- `/events` — grid, filterable by year, `All events (n)` count in the heading
- `/events/[slug]` — hero media, hive ID chip, gallery, partner, role, narrative MDX,
  social embeds

---

## Stage 7 — Podcast

Built to hold a **large catalogue**, not four sample episodes.

- `/podcast` — all episodes, Space Mono filter chips across the five real categories,
  paginated or windowed so 100+ episodes stay fast
- `/podcast/[slug]` — player embed, show notes, guest, platform links
- Outbound platform clicks fire GA4 custom events

---

## Stage 8 — Static pages

`/about`, `/team`, `/join`, `/partner` (was "Advertise With Us"), `/contact`.
Copy is placeholder in content files, clearly marked, pending client input.

---

## Stage 9 — SEO and analytics

- Root `metadata`: title template `%s — Inside The Hive`,
  `metadataBase = https://www.insidethehive.org`, full OpenGraph + Twitter
  (`summary_large_image`, `@InsideDHive`)
- `generateMetadata` on every dynamic route, from frontmatter
- `opengraph-image.tsx` per route via `ImageResponse` — event title in Bricolage over the hero,
  honey accent bar. **No single static `og.png`.**
- `sitemap.ts` + `robots.ts` generated from the content directory
- JSON-LD: `Organization` (home), `Event` (event pages), `PodcastSeries` / `PodcastEpisode`
- Canonical on every page. `.org` is primary — 301 `.com` → `.org` (deploy-side, documented in
  the README).
- GA4 id from `NEXT_PUBLIC_GA_ID`, never hardcoded

---

## Stage 10 — Quality pass

Lighthouse mobile ≥ 90 / ≥ 95 / 100. Keyboard walkthrough. `prefers-reduced-motion` verified on
Lenis, marquee, hero sequence and all reveals. Screenshots at 360 / 768 / 1440.
Hero type checked at 360px for overflow first.

---

## Stage 11 — Docs and PR

`README.md`, `docs/CONTENT.md` (how a non-developer adds an event or episode),
`.github/workflows/ci.yml` (lint · typecheck · build), `.github/PULL_REQUEST_TEMPLATE.md`.
Open PR into `main`.

---

## Checkpoints

- **After Stage 1** — approve design direction ← *we are here*
- **After Stage 5** — review the homepage

---

## Blocked on you

Building around all of these; none block the scaffold.

| # | Item | Interim |
|---|---|---|
| 1 | Brand kit (Drive folder is JS-gated) | Type-only wordmark, marked provisional |
| 2 | Podcast catalogue export | Schema built; needs title, guest, date, category, platform URLs |
| 3 | Real statistics | Section built, figures `TODO:` |
| 4 | Event dates, locations, partner URLs | Four real slugs recovered from the live site |
| 5 | Team names and roles | `TODO:` in `team.ts` |
| 6 | Photography and video | Designed skeleton state |
