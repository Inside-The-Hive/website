# Inside The Hive — Design System

Design lead: this document is the rationale. `src/app/globals.css` is the implementation.
If the two disagree, the CSS is wrong.

---

## 1. What we are designing

Inside The Hive is an African Web3 media brand. It is not a publication and must not read as one.
The differentiator is **being in the room and making it look good**. Every design decision below
serves that one sentence.

The closest analogues are a creative studio's portfolio and a festival site — not a blog, not a
SaaS marketing page, not a crypto exchange.

**Hierarchy of proof, in order:**

1. Event coverage — the photography is the argument
2. The podcast — Africa's #1 Web3 podcast, a deep catalogue
3. Written articles — deferred to v2

---

## 2. Reference audit

Both references were fetched and their markup inspected, not recalled from memory.

### stodio.webflow.io — what we take

| Observed | What we take |
|---|---|
| `h1: "Designing the Next Generation of Brands"` — states what the studio does, not what design is | Hero headline states what ITH does, not what Web3 is |
| Project cards: `projects-card` → `projects-thumbnail-image` + `projects-name` + `project-service` | Event card = image + name + role tag. Nothing else. |
| `"All Cases (05)"` — the index count is part of the link label | `All events (12)` — count in the link. Honest, and it scales. |
| `marquee-logo` ×15 in a single `logos-row` | Partner marquee, single row, one instance per page |
| Palette is `#0a0a0a` + `#de322d` + one grey. Two colours doing all the work. | Discipline confirmed. Honey is an accent, never a field. |
| Stat counters built as stacked digit columns (odometer roll) | Adopted for "By the numbers" — see §7 |

### niceatnoon.nl — what we take

| Observed | What we take |
|---|---|
| Only **15 headings on the entire homepage** | Ruthless heading economy. Every `<h*>` must earn its place. |
| `projects_image-wrapper` + `projects_hover-image` — a second image swaps in on hover | Event cards cross-fade to a second frame on hover. Proof there is a real set behind it. |
| `projects_title` + `projects_subtitle` + `projects_services-list` | Title + one kicker line + role tag. Same discipline as Stodio. |
| Nav is four links: Projecten · Over · Contact · (brand) | Our nav stays at four + merch + CTA. No dropdowns. |
| One repeated `padding-section-large` utility governs all rhythm | One `--spacing-section` token. No bespoke section padding anywhere. |

### What we deliberately do **not** take

Stodio is an agency template — it has a pricing table, a testimonial carousel, a services grid,
and a blog teaser. That is a template's job, not ours. We take its typographic confidence and its
card anatomy, and leave the furniture.

---

## 3. Current site audit — what we are correcting

Fetched from `https://www.insidethehive.org/` and its sub-pages.

| Defect found | Evidence | Fix |
|---|---|---|
| **No `<h1>` on the homepage** | Only two headings exist in the DOM: `h2: Events`, `h2: ON X` | Exactly one `<h1>` per page, semantic outline throughout |
| **Canonical points at the wrong domain** | Serves on `.org`, declares `rel=canonical → https://www.insidethehive.com` | `metadataBase` = `https://www.insidethehive.org`; 301 `.com` → `.org` |
| **Alt text is decorative** | `alt="Technova event photo 2"` ×5 | Alt text describes the moment. Required by the content schema. |
| **Marquee repeated ~80×** | "Africa's #1 Web3 Podcast 🐝" eats a viewport | One marquee per page, section-divider scale, partners only |
| **Category tiles are stacked single letters** | `/categories/blockchain` etc., B-L-O-C-K-C-H-A-I-N vertically | Horizontal Space Mono filter chips on `/podcast` |
| **Footer has ~20 undifferentiated links** | Enter the Hive, Become a Bee, About Us, The Team, Events, Causes, Merch, Jobs, Advertise With Us, Disclosures, Join The Hive, Latest Episode, Popular Episodes, All Episodes, Articles, Branding Kit… | Four groups, under 12 links total |
| **Events trapped in a small carousel** | `/events` copy: "open a gallery to see the full set" | Full-bleed. The photography is the product. |
| **Podcast fights events for the fold** | Player sits at top | Events lead, podcast follows |

**Assets recovered from the live site** (real, not invented): event slugs `technova`,
`redotspay`, `redotsmovienight`, `redotsdinner`; socials `@InsideDHive` (X),
`instagram.com/insidedhive`, `t.me/insidethehive`, `contact@insidedhive.com`;
five podcast categories: blockchain, crypto, web3, nft, creator-and-socialfi.

Episode titles, guests, team names and statistics are **client-rendered** and could not be
extracted. They are `TODO:` in the content files, never in components.

---

## 4. Colour

Warm-black base, honey accent, beeswax light sections, one deep propolis brown so the palette
is not a flat black-and-yellow cliché.

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0E0D0F` | Page base, dark sections |
| `carbon` | `#1A181C` | Raised surfaces, scrolled nav, skeletons |
| `honey` | `#F0A202` | Primary accent, CTAs, active states |
| `pollen` | `#FFE08A` | Soft highlight, hover tints, focus rings |
| `wax` | `#F3EDE3` | Light-section base, body text on dark |
| `propolis` | `#6B2D0E` | Rules, section breaks, hover fills |

**Rules, non-negotiable:**

- Honey is an accent. Never a large field, never a background for body copy.
- **Never honey text on wax** — 2.1:1, fails AA. Use `ink` on wax, or `propolis` for warm emphasis.
- On `ink`: body text is `wax`; secondary is `wax` at 80% (`#F3EDE3CC` ≈ 12.4:1, passes).
- `honey` on `ink` is 9.7:1 — safe for large display and for small utility text alike.
- `propolis` is a *structural* colour: rules, dividers, hover fills. Not a text colour on ink
  (3.0:1 — fails), only on wax (7.9:1 — passes).

Contrast was checked, not assumed. The failing combinations are documented so nobody
rediscovers them.

---

## 5. Type

Three families. A fourth would dilute the voice.

**Display — Bricolage Grotesque.** Variable, with optical-size and width axes. This is the
personality. The wonky, slightly-imperfect grotesque reads as *made by people who were there*
rather than *rendered by a brand agency*. Hero at `--text-mega`, weight 800, tracking `-0.03em`.
Tight tracking is essential — at 12rem, default tracking looks accidental.

**Body — Instrument Sans.** Warm, humanist, and specifically *not Inter*. Inter is the default
that makes every site look like every other site.

**Utility — Space Mono.** Eyebrows, dates, hive IDs, index numbers, nav, filter chips.
Uppercase, `0.08em` tracking, small. The mono is doing real work: it marks everything that is
*data about the thing* as distinct from *the thing itself*.

### Scale

Fluid, clamp-based, capped so 2560px does not become absurd.

| Token | Clamp | Use |
|---|---|---|
| `--text-mega` | `clamp(3.5rem, 13vw, 12rem)` | Hero only. One per site. |
| `--text-h1` | `clamp(2.75rem, 7vw, 6rem)` | Page titles |
| `--text-h2` | `clamp(2rem, 4.5vw, 3.75rem)` | Section headings, mobile menu items |
| `--text-h3` | `clamp(1.5rem, 2.5vw, 2.25rem)` | Card titles |
| `--text-body` | `clamp(1rem, 1.1vw, 1.125rem)` | Body |
| `--text-small` | `0.875rem` | Secondary |
| `--text-label` | `0.75rem` | Space Mono, uppercase, tracked |

At 360px, `--text-mega` resolves to 3.5rem (56px). A four-word headline wraps to three lines and
does not overflow — this is the case that must be tested first, and it is why the floor is 3.5rem
and not larger.

---

## 6. Layout

**Big type, big images, lots of air, very few boxes.**

- No card shadows. No border radius above 4px. No icon-in-a-circle grids.
- Separation comes from **space and hairline `propolis` rules**, not from containers.
- Two rhythms only: `--spacing-gutter` for horizontal, `--spacing-section` for vertical.
- Full-bleed means full-bleed — images touch the viewport edge, no max-width container.
- Grid: 12 columns at desktop, 6 at tablet, 4 at mobile. Event cards break the grid
  asymmetrically (7/5, then 5/7) so the page never reads as a uniform tile wall.

---

## 7. The signature: the hive ID chip

Every event and every episode carries a monospace identifier — `HIVE / 2026 / 007` — set in
Space Mono in the corner of its card, and repeated at the head of its detail page.

**Why this and not something decorative:** it encodes something true. ITH's claim is *we were
there, and we have the archive to prove it*. A sequential, year-scoped catalogue number is what
an archive actually looks like. It makes the body of work feel indexed and real — and it gets
more convincing as the catalogue grows, which is the opposite of how decoration ages.

**Behaviour:**

- Resting: `wax` text, hairline `propolis` border, transparent fill.
- Hover on the parent card: image desaturates to ~60% and the second gallery frame cross-fades
  in (the NiceAtNoon move); the chip fills `honey` and the text inverts to `ink`.
- Transition `--dur-fast` on the chip, `--dur-base` on the image. The chip snapping before the
  image settles is what makes it feel mechanical rather than soft.

**Paired with:** a 2px `honey` scroll-progress line pinned to the top of the viewport, driven by
Lenis. Together they read as one idea — *the site is an indexed archive you are moving through*.

This is where the boldness is spent. Everything else stays quiet.

---

## 8. The one risk: the hero load sequence

The display type sets **before** the hero media resolves behind it.

1. `0ms` — `ink` field. Nothing.
2. `120ms` — headline sets line by line, each line clipped and rising from its own baseline,
   80ms stagger, `--ease-out-expo`.
3. `560ms` — hero media fades up from black behind the type, `--dur-slow`, and the honey progress
   line draws across the top.
4. Settled. Nothing on the page animates that hard again.

**Why it is the right risk:** it dramatises the brand claim. The words arrive, then the room
arrives behind them. It also solves a real problem — event footage is heavy, and this turns the
load into the point rather than into a gap.

**Cost control:** it runs once per session (`sessionStorage`), it is CSS-driven so it cannot
block interaction, and under `prefers-reduced-motion` everything is simply present at `0ms`.
No other section animates beyond a 300ms opacity/translate reveal.

### Media skeletons

Photography and video are not delivered yet. Until they land, `<HiveMedia>` renders a `carbon`
block at the correct aspect ratio with a slow honey shimmer sweep and the hive ID chip in place.
The layout is therefore final and testable now, and swapping in real assets is a content-file
change with zero component edits. The skeleton is a deliberate, designed state — not a grey box.

---

## 9. Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Everything. One curve. |
| `--dur-fast` | `200ms` | Chips, links, nav |
| `--dur-base` | `500ms` | Card hovers, image cross-fades |
| `--dur-slow` | `900ms` | Hero media resolve only |

Lenis handles smooth scroll and **disables itself entirely** under `prefers-reduced-motion`.
The marquee, the progress line, and every scroll reveal check the same query.

---

## 10. Quality floor

360px → 2560px. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
Keyboard navigable with visible `pollen` focus rings, skip-to-content link, 44px minimum touch
targets, AA contrast on all text, no CLS on font load.

---

## 11. Portability

Every token lives in the `@theme` block in `globals.css` and nowhere else. No JS config, no
hardcoded hex in any component. Lifting that block into a shared `@ith/tokens` package for the
`store` repo is a copy-paste. We are not building that package now — we are just not making it
hard later.

---

## 12. Open items

Blocked on the client, tracked so nothing gets invented:

1. **Brand kit** — the Drive folder is JS-gated and could not be read. Wordmark ships as
   Bricolage 800 with tightened tracking, marked provisional.
2. **Podcast catalogue** — episodes are client-rendered on the current site. Need an export:
   title, guest, date, category, platform URLs, duration.
3. **Statistics** — no real numbers found on the live site. "By the numbers" ships with the
   section built and the figures as `TODO:`.
4. **Event metadata** — four real slugs recovered; dates, locations, partner URLs still needed.
5. **Team** — names and roles are client-rendered. Not extractable.
6. **Merch URL** — `https://store.insidethehive.org` placeholder, confirmed not yet live.
