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

**Light theme.** White page, black text, yellow reserved for the logo and small accent marks.

| Token | Hex | Role |
|---|---|---|
| `white` | `#FFFFFF` | Page base |
| `ink` | `#0A0A0A` | All body and display text; inverted sections |
| `ash` | `#F4F4F2` | Raised surfaces, media skeletons |
| `line` | `#E2E0DC` | Hairline rules |
| `honey` | `#F0A202` | Logo, fills, active marks. **Never text.** |
| `propolis` | `#6B2D0E` | Warm emphasis, used sparingly |

**Measured contrast** (computed by `src/lib/contrast.ts`, rendered live on `/style-guide`):

| Pair | Ratio | Grade |
|---|---|---|
| `ink` on `white` | 19.80:1 | AAA |
| `white` on `ink` | 19.80:1 | AAA |
| `ink` on `ash` | 17.98:1 | AAA |
| `propolis` on `white` | 10.46:1 | AAA |
| `ink` on `honey` | 9.31:1 | AAA |
| `ink/70` on `white` | 8.45:1 | AAA |
| `ink/55` on `white` | 4.74:1 | AA (lightest permitted text) |
| **`honey` on `white`** | **2.13:1** | **FAIL** |

**Rules, non-negotiable:**

- **Yellow never carries text.** At 2.13:1 on white it fails AA badly. It appears as the logo
  mark, as button and chip fills with ink text on top (9.31:1), as the active-nav underline, and
  as the placeholder slot marks in "By the numbers".
- Body and display text is `ink`. Secondary copy bottoms out at `ink/55` (4.74:1).
- `propolis` is the only warm colour permitted to carry text, and only on white.
- One inverted section per page maximum — the Join CTA — so the white scroll has a hard stop at
  the point of conversion.

---

## 5. Type

**One family: Inter.** Hierarchy comes from weight and size, not from switching typefaces.

- **Display — Inter Tight, weight 800**, tracking `-0.03em`, line-height 0.92. Very large.
  Inter Tight's narrower widths let the headline hold at 12rem without the letterspacing looking
  accidental.
- **Body — Inter, weight 400.**
- **Labels — Inter, weight 600**, uppercase, `0.08em` tracking, small. Eyebrows, dates, hive IDs,
  counts, filter chips. Marks everything that is *data about the thing* as distinct from the thing.

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
| `--text-label` | `0.75rem` | Uppercase, tracked |

Measured at 360px, `--text-mega` resolves to 56px and the headline ends at x=340 inside a 360px
viewport — verified with a real browser, not assumed.

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

- Resting: `ink` fill with `white` text — it sits on photography, so it carries its own ground.
- Hover on the parent card: image desaturates to ~60% and the second gallery frame cross-fades
  in (the NiceAtNoon move); the chip fills `honey` with `ink` text (9.31:1).
- Transition `--dur-fast` on the chip, `--dur-base` on the image. The chip snapping before the
  image settles is what makes it feel mechanical rather than soft.

**Paired with:** a 2px `honey` scroll-progress line pinned to the top of the viewport, driven by
Lenis. Together they read as one idea — *the site is an indexed archive you are moving through*.

This is where the boldness is spent. Everything else stays quiet.

---

## 8. The one risk: the hero load sequence

The display type sets **before** the hero media resolves behind it.

1. `0ms` — white field. Nothing.
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

Photography and video are not delivered yet. Until they land, `<HiveMedia>` renders a warm
honey-tinted panel at the correct aspect ratio with a slow shimmer sweep, a "Photography coming"
caption, and the hive ID chip in place.
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
