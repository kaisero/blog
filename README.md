# dependencyhell.com

Notes on AI security, Zero Trust and SASE. Hugo + [Blowfish](https://blowfish.page/),
built to [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

## Local development

Requires Hugo **extended** (verified on 0.165.0) and Go (Blowfish is consumed as
a Hugo Module).

```console
$ brew install hugo
$ hugo server -D          # -D includes drafts; http://localhost:1313
```

The sample posts under `content/posts/` are **drafts on purpose**. They exist to
exercise every component in the design system and their technical content is
illustrative scaffolding, not verified research. A plain `hugo server` will show
an empty post list until you publish something real — that is expected. Delete
them once you have your own first post.

Day-to-day authoring notes — front matter, the two per-post SVGs, and what to
check before publishing — are in [`USAGE.md`](USAGE.md).

## Writing a post

```console
$ hugo new content posts/my-post/index.md
```

Front matter that the design system cares about:

```yaml
title: "Sentence case, no trailing period"
summary: "One or two lines. This is what the post row shows — make it earn the line."
date: 2026-08-11
tags: ["ZTNA", "Policy"]   # the seven canonical tags, below
```

Canonical tags — **only these seven**, so the topic list stays a navigation aid
rather than a tag cloud: `ZTNA`, `SASE`, `AI Security`, `NetSec`, `Identity`,
`Policy`, `GlobalProtect`.

Drop `draft: true` when it's ready to publish.

## Layout

```
assets/css/schemes/dependencyhell.css   colour ramps (Blowfish RGB triplets)
assets/css/custom.css                   surfaces, type, density, components
layouts/partials/                       overrides: post row, header, home, related, alert
config/_default/                        site + theme configuration
static/fonts/                           self-hosted Figtree + JetBrains Mono (51 KB)
content/                                posts, about
```

Fonts are self-hosted rather than loaded from Google Fonts — no third-party
request on page load.

## Updating the theme

```console
$ hugo mod get -u github.com/nunocoracao/blowfish/v2
$ hugo mod tidy
```

Blowfish 2.105.0 declares support up to Hugo 0.164.0, so newer Hugo prints a
compatibility warning on build. It is benign — the site builds and renders
correctly — but check the rendering after any theme or Hugo upgrade, since the
design system relies on a handful of the theme's class names.

## Deployment

`.github/workflows/pages.yml` builds and publishes to GitHub Pages on push to
`main`. Before the first deploy, set **Settings → Pages → Source** to
**GitHub Actions**.

The workflow passes the base URL from the Pages API, so it works both on
`*.github.io` and on a custom domain. To attach `dependencyhell.com` later, add
the DNS records, set the custom domain in the Pages settings, and commit a
`static/CNAME` file containing `dependencyhell.com`.
