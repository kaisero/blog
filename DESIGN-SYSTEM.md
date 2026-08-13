# dependencyhell.net — design system

Version 1.0. The prose form of `dependencyhell.net Design System.dc (1).html`.

Every value here is **normative**. Build to it; don't reinterpret it. If a value
needs to change, change it here first, then in the CSS.

**Stack:** Hugo + Blowfish v2 · scheme `dependencyhell` · Figtree + JetBrains
Mono · dark-first, no auto-switch.

## Where it lives

| Concern | File |
| --- | --- |
| Colour ramps (Blowfish RGB triplets) | `assets/css/schemes/dependencyhell.css` |
| Surfaces, type, density, components | `assets/css/custom.css` |
| Post row, header, homepage, related | `layouts/partials/…` |
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
- **Buttons** — mono, uppercase, height 42px, radius 6. Primary = cyan-500 fill
  with `#001D2B` ink. The stroke variant keeps the same box by trading 2px of
  padding for the border.
- **Tags** — mono 9.5px, uppercase, +.12em, transparent fill always, 1px
  `rgba(0,192,232,.18)` border, radius 5. Hover goes cyan.
- **Post row** — the workhorse. Date column, 22px title, summary, tags, reading
  time. Hover: title goes cyan-400, **nothing else moves** (150ms colour only).
- **Code block** — line numbers in a gutter (a separate table cell, so copying
  the code never picks them up). Inline code is cyan-300 on a 10% cyan wash.
- **TOC** — 182px, sticky, 2px left indicator; cyan when active.
- **Pull quote** — 2px cyan rule, upright, never italic.
- **Table** — ruled, dense, **no zebra**.
- **Alert / advisory** — 3px cyan bar, hairline border, cyan-wash gradient.

## 06 Rules

**Do**

- One cyan accent per view — the thing you most want clicked.
- Gradients linear, single hue, low alpha, stacked for depth.
- Rules and borders as cyan hairlines, never filled grey panels.
- Dense lists with a date column; summaries earn their line.
- Mono for anything a machine produced.

**Don't**

- Radial or multi-hue gradients, glows, or drop shadows.
- Image cards on lists — `cardView` stays false everywhere.
- A border alpha reused as a text colour (`#6B94A3` is the dark floor).
- Hover effects that move layout — colour only, 150ms.
- A second accent hue. Status colours are content, not chrome.

**Accessibility floors**

- Body text ≥ 4.5:1. `#C4E2EC` on canvas measures **15.13:1**.
- Meta ≥ 4.5:1 too — it is small, not decorative. `#6B94A3` on canvas
  measures **6.26:1**.
- Focus ring: 2px cyan-500, offset 2px. **Never removed.**
- Logo mark ≥ 20px; drop the core dot at ≤ 32px.
- The light appearance must stay buildable: muted = `#4C7B8B`.
