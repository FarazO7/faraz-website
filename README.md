# Faraz Ali — Portfolio

Dark-glassmorphism personal portfolio for Faraz Ali, Associate Product Manager.
Next.js (App Router) + TypeScript strict + Tailwind CSS v4, fully static
(`output: 'export'`) — no server, no CMS, no database.

## Sections

- **Hero** — GitHub avatar, positioning line, four impact-metric tiles (count-up,
  amber→gold gradient numerals). Each tile links to its own impact detail page.
- **Selected Work** — four case-study cards, each topped with a rendered preview
  of the PDF's first page.
- **Experience + Education** — one shared vertical timeline component.
- **Recognition** — a scroll-pinned Achievements section (framer-motion).
- **GitHub** — live contribution calendar + repo cards.
- **Skills** — a hub-and-spoke constellation with brand logos; Certifications.
- **/impact/[slug]** — a detail page per metric (problem → approach → results).

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run previews   # regenerate case-study preview images (also runs on build)
npm run build      # static export to out/ (prebuild regenerates previews)
```

## Editing content

**All copy and data lives in [`lib/content.ts`](lib/content.ts).** Components only
render it — change text, metrics, case studies, skills, achievements, education,
or the impact-page narratives there without touching any component. The typed
structure tells you exactly what each section expects. Lines marked
`REVIEW(Faraz)` / `TODO(Faraz)` are awaiting your input (case-study summary
wording, education years).

One file you supply (the path is wired and ready):

| File | Where to put it |
| --- | --- |
| Resume PDF | `public/resume/Faraz-Ali-Product-Manager.pdf` |

The headshot is sourced live from GitHub, so there's nothing to upload for it.

### Avatar source chain (Phase 2)

The hero avatar walks a fallback chain on error:

1. `https://github.com/FarazO7.png?size=400` — your current GitHub avatar
2. local `public/images/faraz-ali.jpg` — used only if you add the file
3. an "FA" monogram in the glass ring — if both images fail

It loads eagerly (`fetchpriority="high"`) since it's the hero image.

## Live GitHub section — how the fallbacks behave

Everything is fetched client-side at view time; no manual updates needed when new
repos are pushed.

**Contribution calendar** (custom 53×7 grid):
1. `github-contributions-api.jogruber.de/v4/FarazO7?y=last` → custom grid with
   tooltips, month labels, Less→More legend
2. API error → `ghchart.rshah.org` image inside the same panel
3. Image error → quiet "View contribution activity on GitHub →" link

Never an empty box, never an endless spinner.

**Repository cards** (forks filtered, newest-pushed first, max 8):
1. Fresh `localStorage` cache (≤ 60 min old) → rendered without spending the
   unauthenticated rate limit (60 req/hr)
2. Otherwise live `api.github.com` fetch → cached on success
3. Fetch fails (e.g. 403 rate-limit) → stale cache if one exists
4. No cache at all → static snapshot baked into `content.ts`

Loading skeletons show for at most 2 seconds before the fallback engages; if the
live response lands later, it replaces the fallback. A small caption appears when
stale/snapshot data is being shown.

Note: the snapshot mirrors the live API as captured on 2026-06-11. The
`Product-Management` repo named in the original spec is no longer returned by
the GitHub API, so the snapshot carries `job-apply-assistant-1` instead.

## Case-study previews (Phase 5)

[`scripts/generate-previews.mjs`](scripts/generate-previews.mjs) renders page 1 of
each case-study PDF to an 800px `.webp` in `public/previews/` using `pdfjs-dist` +
`@napi-rs/canvas`. It runs automatically as `prebuild` (so GitHub Actions
regenerates them) and the webps are committed for offline dev. If a download or
render fails for one card, it logs a warning and keeps the committed image —
**it never breaks the build**. Run it on demand with `npm run previews`.

## Design system

Locked tokens in [`app/globals.css`](app/globals.css): ink `#070B14`, text
`#E8ECF5`, muted `#9AA4B8`, indigo/teal/amber accents, GitHub green scale, plus
four V2 support tokens (`--space-deep`, `--nebula-orchid`, `--star-blue`,
`--solar-gold`). One glass primitive (`.glass`) keeps live blur; it's budgeted to
≤6 active `backdrop-filter` elements per viewport, so the ~30 skill-constellation
nodes use the solid `.glass-solid` treatment and only the four hubs keep real blur.

The background is a procedural deep-space environment: a fixed `<canvas>`
([`StarField.tsx`](components/StarField.tsx)) paints three parallax star layers
behind the nebula orbs, on one throttled rAF loop (DPR capped 1.5, paused on
hidden tabs, deferred past LCP). Metric numerals use an amber→solar-gold gradient
(AA-safe on glass). Hovers animate transform/border/shadow only; the star drift,
orb drift, count-ups, scroll reveals, constellation float, and the Achievements
pin are all disabled under `prefers-reduced-motion`. Fonts (Sora / Inter /
JetBrains Mono) are self-hosted via `next/font`. See
[`docs/DESIGN.md`](docs/DESIGN.md).

## Deployment

**Vercel** — zero config. Import the repo; `output: 'export'` builds a static
site that Vercel serves from its CDN (no server functions involved).

**GitHub Pages** — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and deploys `out/` via `actions/deploy-pages` on every push to `main`.
Enable Pages → Source: "GitHub Actions" in repo settings.

- Project site (`https://<user>.github.io/<repo>/`): the workflow already sets
  `NEXT_PUBLIC_BASE_PATH=/<repo-name>` — assets and internal links resolve under
  the subpath automatically.
- User site or custom domain: delete the `env:` block from the workflow
  (`basePath` must be empty there).

## Architecture map

The footer links `graphify-out/graph.html` — an interactive map of this codebase
committed into the repo (and copied into `public/` so the deployed site serves it).
