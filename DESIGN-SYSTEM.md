# dependencyhell.com — design system

Version 1.5. The prose form of `dependencyhell.net Design System.dc (1).html`.

**Changed in 1.5** — articles carry a blurred background hero, and the author
byline is shown. See §05 and §07.

**Changed in 1.4** — the domain is dependencyhell.com. The hero lockup was
re-fitted, since the wordmark's width is what the tagline is matched against.

**Changed in 1.3** — the light appearance is built, not just buildable. The site
follows the reader's OS preference with a manual override in the footer. See
§07.

**Changed in 1.2** — the homepage masthead is replaced by an animated hero
(§05). The wordmark is now the page `h1`; the keywords moved down to the eyebrow.

**Changed in 1.1** — lists moved from dense rows to three-up cards with
thumbnails. v1.0 forbade image cards outright; that rule is withdrawn and
replaced by the card spec in §05. The row is retained as a primitive but is no
longer what the list templates use.

Every value here is **normative**. Build to it; don't reinterpret it. If a value
needs to change, change it here first, then in the CSS.

**Stack:** Hugo + Blowfish v2 · scheme `dependencyhell` · Figtree + JetBrains
Mono · dark-first, no auto-switch.

## Where it lives

| Concern | File |
| --- | --- |
| Colour ramps (Blowfish RGB triplets) | `assets/css/schemes/dependencyhell.css` |
| Surfaces, type, density, components | `assets/css/custom.css` |
| Post card and row, header, homepage, related | `layouts/partials/…` |
| Theme switches (cardView, TOC, appearance) | `config/_default/params.toml` |

`custom.css` is deliberately **unlayered**. Blowfish ships its Tailwind build
inside `@layer theme/base/components/utilities`, and unlayered rules beat layered
ones regardless of specificity — so no rule in `custom.css` needs `!important`.

## 01 Surfaces & gradients

Depth comes from stacked low-alpha cyan. **Linear only, one hue, never radial.**

| Role | Value |
| --- | --- |
| canvas | `#000406` |
| card / page shell | `linear-gradient(168deg, #011A26 0%, #00090E 46%, #000508 100%)` |
| header bar | `linear-gradient(96deg, rgba(0,192,232,.11), rgba(1,26,38,.72) 46%, rgba(0,8,14,.72))` |
| code / inset panel | `linear-gradient(158deg, #01202E 0%, #00070C 100%)` |

Hairlines — never grey boxes:

- structural `rgba(0,192,232,.15)`
- card border `rgba(0,192,232,.14)`
- list divider `rgba(232,246,250,.08)`
- section rule `56×1`, `linear-gradient(90deg, #00C0E8, transparent)`

Radius: **16** card · **10** panel · **6** button · **5** tag.

**No drop shadows anywhere.** Elevation is a 1px inset cyan highlight on the top
edge (`inset 0 1px 0 rgba(0,192,232,.16)`) — the only permitted lighting cue.

## 02 Colour

The accent is `#00C0E8` (primary-500), and there is only one. Ramp: `#ECFCFF`
50 · `#7FE4F7` 300 · `#56D6F4` 400 · `#00C0E8` 500 · `#0196B3` 700 · `#0A4E5E`
900. The `secondary` ramp mirrors `primary` so Blowfish components can never
introduce a second hue.

Text ladder:

| Role | Value | Use |
| --- | --- | --- |
| heading | `#E8F6FA` | headings, row titles |
| body | `#C4E2EC` | running text, 16px floor |
| secondary | `#A9CCD8` | summaries and dek |
| muted | `#7FA8B5` | tag labels, captions |
| meta | `#6B94A3` | dates, reading time |
| link | `#56D6F4` | body links, 1px underline |

`#6B94A3` is the meta floor: 5.12:1 on the lightest defined surface (the code
panel), 6.26:1 on canvas. **Quote the worst-case surface, never the canvas.**
`#4C7B8B` is the light-appearance muted value only. **Never take a border alpha
and use it as a text colour.**

Status colours — `#00CC66` allow, `#FFCB06` step-up, `#DD6652` block — carry
verdicts **inside content only** (tables, code output). They are never chrome,
never a brand accent, never a second gradient hue. This is why every admonition
type renders in the same cyan advisory style.

## 03 Typography

Figtree for everything readable; JetBrains Mono for anything machine-adjacent
(dates, tags, verdicts, code, buttons, eyebrows).

| Role | Size / leading | Weight | Tracking |
| --- | --- | --- | --- |
| display | 40 / 1.02 | 700 | −.045em |
| h1 article | 34 / 1.08 | 700 | −.04em |
| h2 | 23 / 1.22 | 700 | −.03em, preceded by the 56×1 rule |
| list title | 22 / 1.2 | 700 | −.03em |
| body | 16 / 1.62 | 400 | 74ch measure |
| summary | 15 / 1.6 | 400 | 66ch, `#A9CCD8` |
| meta / eyebrow | mono 10.5–11 | 400 | uppercase, +.12–.20em |

Floors: body never below 16px · meta never below 10.5px · **no italics outside
citations**. Weight 800 is reserved for `hell` in the wordmark.

## 04 Layout & density

Data-efficient: information per screen beats breathing room.

- **post row** — 96px date column · 18px gap · 1fr content
- **article** — 1fr content · 32px gap · 182px sticky TOC
- **page padding** — 40px desktop · 24px tablet · 18px mobile
- **measure** — 74ch prose, 66ch summaries

Spacing scale: 4 (icon gaps) · 8 (inside a title block) · 14 (heading to body) ·
20 (between post rows) · 28 (between blocks) · 40 (page padding). Always `gap`
on a flex/grid parent, **never per-child margins**.

Below 900px the TOC collapses above the article and the date column stacks onto
the title row.

## 05 Components

- **Site header** — fixed, hairline, blurred. Height 54px. Mark at 26px with the
  core dot dropped (the ≤32px rule). Active nav item = full-strength text + 2px
  cyan underline. The wordmark is excluded from the active rule.
- **Homepage hero** — one plate, 440px tall, card surface. Traffic lanes carry
  packets under an inspection beam that brightens a dot field as it passes. The
  composition rule is that art never crosses copy: lanes running behind the text
  are masked back, the lanes above and below run edge to edge. The wordmark is
  the `h1` — 48.12px word, 43px mark, sized so the lockup and the tagline share
  a right edge. Re-measure if *either* string changes: renaming .net to .com
  alone made the lockup 23.9px wider. No buttons: the card grid is
  immediately below them. Lane positions are percentages, never pixels, so they
  track the lanes at any hero height. Motion is transform and mask-position
  only, and stops entirely under `prefers-reduced-motion`.
- **Article background hero** — a full-bleed image behind the article header,
  blurred and faded into the canvas. It uses a dedicated `background.svg` per
  post, **not** the card thumbnail: the theme matches `*background*` ahead of
  `*feature*`. The two are drawn differently on purpose — a thumbnail is read at
  400px and can carry hairlines, a hero is read blurred under a heavy scrim and
  needs large mid-tone forms or it disappears. Mid-tone also means one file
  serves both appearances. The body background goes transparent on these pages,
  or it would paint over the image everywhere except the page margins.
- **Buttons** — mono, uppercase, height 42px, radius 6. Primary = cyan-500 fill
  with `#001D2B` ink. The stroke variant keeps the same box by trading 2px of
  padding for the border.
- **Tags** — mono 9.5px, uppercase, +.12em, transparent fill always, 1px
  `rgba(0,192,232,.18)` border, radius 5. Hover goes cyan.
- **Post card** — what every list renders. Three per row on desktop, two below
  1024px, one below 640px, 20px gutters. Thumbnail at 3:2 above a hairline, then
  mono meta, a 19px title, a three-line clamped summary, and tags pinned to the
  bottom. One hit area covers the card. Hover: title goes cyan-400 and the border
  brightens — **nothing moves**. Cards keep the shared surface language: card
  gradient, 1px cyan border, 16px radius, inset top edge, no shadow.
- **Post row** — retained for dense contexts. Date column, 22px title, summary,
  tags, reading time. Hover: title goes cyan-400, **nothing else moves**.
- **Code block** — line numbers in a gutter (a separate table cell, so copying
  the code never picks them up). Inline code is cyan-300 on a 10% cyan wash.
- **TOC** — 182px, sticky, 2px left indicator; cyan when active.
- **Pull quote** — 2px cyan rule, upright, never italic.
- **Table** — ruled, dense, **no zebra**.
- **Alert / advisory** — 3px cyan bar, hairline border, cyan-wash gradient.

## 07 The light appearance

Dark values live in `:root`; `html:not(.dark)` overrides every
appearance-dependent token. A page that never receives the `.dark` class — no
JavaScript, or a light OS preference — therefore lands in light.

Two things are **not** a straight inversion:

1. **The accent splits.** `#00C0E8` measures 2.2:1 on a light canvas, so it
   cannot carry text or borders there. `--dh-accent` darkens to `#0A7089`
   (5.5:1) for anything with a contrast obligation, while `--dh-accent-fill`
   keeps the bright cyan for filled buttons, where ink sits on top of it.
   `--dh-brand-cyan` is a third role: the logo stroke, which only darkens enough
   (`#0196B3`) to clear the 3:1 non-text floor.
2. **The inset top highlight is removed.** It is a lighting cue that only reads
   on a dark surface. On light the hairline carries the edge — it is *not*
   replaced by a shadow, which §01 forbids.

Status colours get their own light values (`#0A7A42`, `#8A6A00`, `#B3382A`); the
dark ones are all under 3:1 on a light surface.

Light text ladder — heading `#001D2B`, body `#0A2530`, secondary `#2F5B6B`,
muted `#3E6B79`, meta `#4C7B8B`, link `#0A7089`. The canvas is `#FAFDFE` rather
than a deeper tint precisely so `#4C7B8B` clears 4.5:1 (it measures 4.55:1).

Measured minimums: **6.26:1** in dark, **4.55:1** in light.

Two things the light appearance needs beyond the tokens:

- Blowfish paints its own muted text with Tailwind's `neutral` utilities, which
  resolve to the scheme's fixed values and therefore do **not** switch with the
  appearance. `neutral-500` measures 3.47:1 on the light canvas, so those
  utilities are re-pointed at the tokens.
- `#4C7B8B` sits exactly on the floor against the canvas, so it has no headroom.
  Anything that darkens the surface under it — the background hero drops it to
  2.79:1 — must step the muted tokens down. The article header does this locally
  (`#244C59`, 5.60:1 measured against the worst backdrop pixel).

**Art carries no colour of its own.** The hero lanes, dot field and every card
thumbnail resolve their strokes and fills to tokens, which is why SVG thumbnails
are inlined rather than referenced with `<img>` — a stylesheet cannot reach
inside an image.

**Config trap.** `autoSwitchAppearance = true` only follows the OS if
`defaultAppearance = "light"`. The theme's `appearance.js` adds `.dark`
unconditionally when the default is `dark` and no choice is stored, and its
auto-switch branch only ever *adds* dark on load — so a light-preferring visitor
would still get dark.

## 06 Rules

**Do**

- One cyan accent per view — the thing you most want clicked.
- Gradients linear, single hue, low alpha, stacked for depth.
- Rules and borders as cyan hairlines, never filled grey panels.
- Dense lists with a date column; summaries earn their line.
- Mono for anything a machine produced.

**Don't**

- Radial or multi-hue gradients, glows, or drop shadows.
- Thumbnails that are photography or stock art. Card art is generated,
  geometric and single-hue, or the card carries no image at all.
- A border alpha reused as a text colour (`#6B94A3` is the dark floor).
- Hover effects that move layout — colour only, 150ms.
- A second accent hue. Status colours are content, not chrome.

**Accessibility floors**

- Body text ≥ 4.5:1. `#C4E2EC` on canvas measures **15.13:1**.
- Meta ≥ 4.5:1 too — it is small, not decorative. `#6B94A3` on canvas
  measures **6.26:1**.
- Focus ring: 2px cyan-500, offset 2px. **Never removed.**
- Logo mark ≥ 20px; drop the core dot at ≤ 32px.
- The light appearance is held to the same floors; see §07.
