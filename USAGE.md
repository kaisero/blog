# Writing for dependencyhell.com

Day-to-day authoring notes. For the visual rules themselves see
[`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

## A new post

```console
$ hugo new content posts/my-post/index.md
$ hugo server -D          # -D includes drafts
```

Front matter the design cares about:

```yaml
title: "Sentence case, no trailing period"
summary: "One or two lines. This is what the card shows — make it earn the line."
date: 2026-08-14
tags: ["ZTNA", "Policy"]   # the seven canonical tags
draft: true                # drop this when it's ready
```

Canonical tags, and only these seven: `ZTNA`, `SASE`, `AI Security`, `NetSec`,
`Identity`, `Policy`, `GlobalProtect`.

## The two images

A post can carry two SVGs. **They are not interchangeable** — they are seen at
different sizes, through different pipelines, and art that works as one will
fail as the other.

```
content/posts/my-post/
├── index.md
├── feature.svg      → the card thumbnail
└── background.svg   → the article hero backdrop
```

Both are optional and both degrade quietly: without `feature.svg` the card shows
a plain gradient plate, without `background.svg` the article simply has no hero.

The theme picks the hero image by filename, matching **`*background*` first**,
then `*feature*`, `*cover*`, `*thumbnail*`. That ordering is why the two can
coexist — drop the `background.svg` and the hero would silently fall back to your
thumbnail, which is not drawn for it.

### `feature.svg` — the card thumbnail

Seen at roughly 400px wide, sharp, inside a card.

- `viewBox="0 0 600 400"` (3:2, matching `thumbnailAspectRatio`)
- Root element gets `class="dh-thumb"`
- **Inlined into the page**, not referenced with `<img>` — that is what lets the
  stylesheet reach inside and theme it
- Hairlines are fine here. Detail survives.

Colour comes from classes, which resolve to tokens and follow the light/dark
appearance:

| Class | Role |
| --- | --- |
| `t-grid` | the faint background grid |
| `t-line` | secondary strokes, boxes, dashed paths |
| `t-edge` | connecting lines between nodes |
| `t-accent` | the main subject, in the brand cyan |
| `t-deep` | a recessed accent behind the subject |
| `t-ghost` | something drawn as absent |
| `t-ink` / `t-ink-stroke` | the brightest fill / stroke |
| `t-plate` | an opaque panel |
| `t-rule` | the short 120×1 rule |

Keep the presentation attributes (`stroke="…"`, `fill="…"`) alongside the class.
They are the lowest-priority styling in CSS, so the real rules still win when the
file is inlined — but they mean the file also renders on its own, which matters
if it is ever loaded as a plain image.

### `background.svg` — the article hero

Seen full-bleed, **blurred**, under a heavy scrim, behind the article title.

- `viewBox="0 0 1600 900"`
- Loaded as `<img>`, so the stylesheet **cannot** reach it — every colour must be
  written into the file
- **Large forms only.** Hairlines disappear entirely once blurred and scrimmed.
  Think broad bands, wide wedges, thick arcs — 30px strokes and up.
- **Mid-tone.** The scrim is canvas-coloured, so it darkens the art in dark mode
  and lightens it in light. Art built around `#0A4E5E`–`#0196B3` reads in both,
  which is why one file serves both appearances.
- Give each file's gradients **unique ids** (`pcBase`, `agBeam`, …). Two files
  sharing an id will collide if they ever render on one page.

Linear gradients and one hue only, same as everywhere else. No radial, no glow.

### Why they differ

A thumbnail is read; a hero is felt. The thumbnail carries the idea of the post
at legible size, so it can afford 1px detail. The hero is atmosphere behind text
— it is blurred and largely covered by scrim, so anything delicate is simply not
there. Trying to reuse one file for both gives you either a mushy thumbnail or an
invisible hero.

## Appearance

Dark by default for every reader. The switch in the footer offers light, and that
choice is remembered per browser. There is no OS-following — see the note in
`config/_default/params.toml` if you ever want to change that, because the
obvious configuration silently does the wrong thing.

Check both appearances before publishing. The light one has less contrast
headroom, and art that reads well on black can disappear on white.

## Before publishing

- Drop `draft: true`
- Read it at mobile width; the card grid goes 3 → 2 → 1
- Check both appearances with the footer switch
- `hugo --minify --gc` should build clean
