# Faraz Ali: Portfolio

Light, editorial portfolio for Faraz Ali, Product Manager, with its visual
language taken from capslock.global (see `docs/DESIGN.md` and
`docs/redesign/SPEC.md`).
Next.js (App Router) + TypeScript strict + Tailwind CSS v4, fully static
(`output: 'export'`): no server, no CMS, no database. Hosted on Vercel at
https://faraz-website.vercel.app.

## Sections

- **Hero**: local headshot, name, current title and both actions; with
  motion, a scroll stage carries the portrait into a ring of three stat
  cards. Then the bio, contact row and the Experience & Education pills.
- **Impact**: one bento group per role (current role first, with dates),
  four tiles each with odometer numerals, every tile linking to its impact
  page.
- **Selected Work**: four case studies in an asymmetric grid, each topped
  with a rendered preview of the PDF's first page.
- **Built**: "Prototypes I've built" as four numbered panels, Signal first
  (subtitle, year, resume highlights, live demo, screenshot).
- **Experience + Education**: a sticky heading and Domains strip beside one
  shared numbered timeline. Each role shows the resume's company descriptor and, where the
  resume has one, its one-line summary. Bullets with an impact page end in a
  "Read the case" link.
- **Recognition**: one centred statement per achievement.
- **GitHub**: live contribution calendar and curated repo rows.
- **Skills**: an intro line, the resume's four skill groups as pastel cards
  with brand logos (2×2), and Certifications.
- **/impact/[slug]**: ten detail pages, five for Zamplitude and five for
  Newton School (problem, approach, results). The Tenure row derives from the
  timeline; the confidentiality note is per organisation.

## Setup

Node 22 (pinned in `.nvmrc` and `engines`, matching Vercel).

```bash
npm ci
npm run dev             # http://localhost:3000
npm run check:content   # content guard (also runs before every build)
npm run build           # static export to out/ (prebuild: guard, then previews)
npm run verify          # after a build: screenshots, glass budget, axe, keyboard
```

`npm run verify -- --links` also crawls every link; `--lighthouse=<dir>` also
runs Lighthouse. Output lands in `.review/` (git-ignored). The script uses your
installed Google Chrome, or Playwright's Chromium after
`npx playwright install chromium`. `node scripts/serve-out.mjs` serves `out/`
locally on port 4173.

## Editing content

**All copy and data lives in [`lib/content.ts`](lib/content.ts).** Components
only render it. Lines marked `REVIEW(Faraz)` are drafted copy awaiting review.

- **Current role:** the single `current: true` entry at the top of
  `experience`. The hero title, company, tenure, `<title>`, social cards and
  Person JSON-LD all derive from it, so a job change is one edit.
- **Metrics:** `metricGroups`, one group (tab) per role. Each tile names its
  impact page (`slug`) and quotes the resume phrase that proves the number
  (`resumeEvidence`).
- **Impact pages:** `impactDetails`. Each page names its organisation (`org`)
  for the Tenure row and confidentiality note. A bullet links to a page with
  `{ text, impact: "slug" }`.
- **Skills:** `skills`, the resume's four groups verbatim. `domains` feeds the
  Experience strip.

The resume PDF lives at `public/resume/Faraz-Ali-Product-Manager.pdf`.

## Content guard

[`scripts/check-content.ts`](scripts/check-content.ts) runs before every build,
so Vercel and CI fail fast on drift. It checks:

- **a.** Exactly one current role, listed first, with dates ending "Present".
- **b.** Every tile and bullet link resolves to an impact page, and every
  impact page is linked from somewhere.
- **c.** Each tile's number appears in its page's metric or Results.
- **d.** Each tile's `resumeEvidence` appears in the resume PDF (compared
  lowercase, with dashes and hyphens as spaces).
- **e.** Every education entry has dates.
- **f.** Every root-relative asset path in content exists under `public/`.
- **g.** No identity literals (name, titles, employers) are hardcoded in
  `app/` or `components/`.
- **h.** No retired claims (listed in `RETIRED_CLAIMS` in the script) in
  content, `app/`, `components/` or this README.

Each failure names the field and the fix. **Rule: update the resume PDF first,
then `content.ts`.** A new metric fails check d until the PDF carries it.

## Headshot

A local WebP, `public/images/faraz-ali.webp` (1024 × 1024, about 40 KB),
loaded eagerly as the hero image. Nothing is fetched from GitHub.

## GitHub section: how it behaves

**Contribution calendar** (custom 53×7 grid), fetched client-side at view time:
1. `github-contributions-api.jogruber.de/v4/FarazO7?y=last` → custom grid with
   tooltips, month labels and a Less→More legend
2. API error → `ghchart.rshah.org` image inside the same panel
3. Image error → a quiet "View contribution activity on GitHub" link

Never an empty box, never an endless spinner.

**Repository grid:** a hand-curated, ordered list (`curatedRepos` in
`content.ts`) with hand-written descriptions. There is no live repo fetch, so
the flagships always show regardless of push recency.

## Case-study previews

[`scripts/generate-previews.mjs`](scripts/generate-previews.mjs) renders page 1 of
each case-study PDF to an 800px `.webp` in `public/previews/` using `pdfjs-dist` +
`@napi-rs/canvas`. It runs in `prebuild`, and the webps are committed for
offline dev. If a download or render fails for one card, it logs a warning and
keeps the committed image; **it never breaks the build**. Each local build
rewrites the committed webps byte for byte, so run `git restore public/previews/`
unless you mean to update them. Run it on demand with `npm run previews`.

## Design system

Tokens in [`app/globals.css`](app/globals.css), taken from the reference:
white page, ink `#111212`, AA muted `#5B6066`, pastel surfaces, and blue/pink
accents that stay decorative. One glass primitive (`.glass`), at most 6 live
`backdrop-filter` elements per viewport (measured at most 4). Fonts are Geist
and Instrument Serif Italic, self-hosted via `next/font`.

Motion is CSS driven by one IntersectionObserver
([`RevealController.tsx`](components/RevealController.tsx)): masked word
reveals, odometer numerals, image scale-ins, drawn dividers and the hero scroll
stage ([`HeroStage.tsx`](components/HeroStage.tsx)). Nothing is hidden
without JavaScript or under `prefers-reduced-motion`; smooth scrolling (Lenis)
is off on touch and under reduced motion. See [`docs/DESIGN.md`](docs/DESIGN.md).

`node scripts/content-check.mjs compare` checks every route's text, links,
images and metadata against `docs/redesign/baseline/` (run after a build).

## Hosting

**Vercel** is the only host: Production deploys from `main` to
https://faraz-website.vercel.app, and every pushed branch gets a preview URL.
`output: 'export'` builds a static site that Vercel serves from its CDN.
`NEXT_PUBLIC_BASE_PATH` and `withBase` remain for subpath hosting; leave the
variable unset on Vercel.

**CI:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint,
typecheck and build (content guard included) on every push to `main` and every
pull request. The GitHub Pages workflow is retired.

## Architecture map

An interactive map of this codebase, generated with graphify, is committed at
[`public/graphify-out/graph.html`](public/graphify-out/graph.html) and served
at `/graphify-out/graph.html`. Nothing on the site links to it.
