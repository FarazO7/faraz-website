# Faraz Ali: Portfolio

Dark-glassmorphism portfolio for Faraz Ali, Product Manager.
Next.js (App Router) + TypeScript strict + Tailwind CSS v4, fully static
(`output: 'export'`): no server, no CMS, no database. Hosted on Vercel at
https://faraz-website.vercel.app.

## Sections

- **Hero**: local headshot, name, current title, bio, resume download,
  contact row, and the Experience & Education credibility strip.
- **Impact**: role-segmented metric tiles. A tab per role (current role
  first; arrow keys, Home and End), four count-up tiles per tab, each linking
  to its impact page.
- **Selected Work**: four case-study cards, each topped with a rendered
  preview of the PDF's first page.
- **Built**: Signal as the flagship (subtitle, year, resume highlights, live
  demo) plus three project cards.
- **Experience + Education**: a Domains strip, then one shared vertical
  timeline. Bullets with an impact page end in a "Read the case" link.
- **Recognition**: a scroll-pinned Achievements section (framer-motion).
- **GitHub**: live contribution calendar and a curated repo grid.
- **Skills**: an intro line, five hub cards with brand logos, an "All skills"
  index holding the resume's full taxonomy, and Certifications.
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
- **Skills:** `skills` (the five hubs) and `skillsIndex` (the resume's six
  groups verbatim). `domains` feeds both the Experience strip and the index.

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

Locked tokens in [`app/globals.css`](app/globals.css): ink `#070B14`, text
`#E8ECF5`, muted `#9AA4B8`, indigo/teal/amber accents, GitHub green scale, plus
four V2 support tokens (`--space-deep`, `--nebula-orchid`, `--star-blue`,
`--solar-gold`). One glass primitive (`.glass`). At most 6 elements with live
`backdrop-filter` per viewport: dense grids (case studies, repo cards, skills
hubs) add `.glass-nested`, the same recipe without its own blur.

The background is a WebGL star field
([`ReactiveGalaxy.tsx`](components/ReactiveGalaxy.tsx), `ogl`) behind drifting
nebula orbs, skipped under reduced motion and on mobile. Metric numerals use
an amber→solar-gold gradient (AA-safe on glass). Hovers animate
transform/border/shadow only; count-ups, scroll reveals, smooth scrolling, the
orbital ring and the Achievements pin are all disabled under
`prefers-reduced-motion`. Fonts (Sora / Inter / JetBrains Mono) are self-hosted
via `next/font`. See [`docs/DESIGN.md`](docs/DESIGN.md).

## Hosting

**Vercel** is the only host: Production deploys from `main` to
https://faraz-website.vercel.app, and every pushed branch gets a preview URL.
`output: 'export'` builds a static site that Vercel serves from its CDN.
`NEXT_PUBLIC_BASE_PATH` and `withBase` remain for subpath hosting; leave the
variable unset on Vercel.

## Architecture map

An interactive map of this codebase, generated with graphify, is committed at
[`public/graphify-out/graph.html`](public/graphify-out/graph.html) and served
at `/graphify-out/graph.html`. Nothing on the site links to it.
