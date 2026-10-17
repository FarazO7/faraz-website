# Faraz Ali: Portfolio

Light, editorial portfolio for Faraz Ali, Product Manager, with its visual
language taken from capslock.global (see `docs/DESIGN.md` and
`docs/redesign/SPEC.md`).
Next.js (App Router) + TypeScript strict + Tailwind CSS v4, fully static
(`output: 'export'`): no server, no CMS, no database. Hosted on Vercel at
https://faraz-website.vercel.app.

## Sections

- **Hero**: headshot, name, current title, Get in touch, Download Resume and
  the contact row; with motion, a scroll stage carries the portrait into a
  ring with five strength cards around it. Then the "About" intro and the
  Experience and Education logo rows.
- **Impact**: a tab per company (current role first; arrow keys, Home and
  End), four tiles each with odometer numerals, every tile linking to its
  impact page.
- **Selected Work**: a full-width, drifting carousel of four case studies,
  each with a rendered preview of the PDF's first page.
- **Built**: "Prototypes I've built" as four expanding cards, Signal first;
  open, each shows its description and links.
- **Experience**: a sticky heading beside a numbered timeline; from lg the
  sticky side shows the Domains of the role being read. Each role shows the
  resume's company descriptor, its domains and, where the resume has one,
  its one-line summary. Bullets with an impact page end in a "Read the case"
  link.
- **Education**: its own section on the same two columns, nothing pinned:
  each entry reads degree, then institution (no years).
- **Skills**: the resume's four skill groups as pastel cards with brand logos
  (2×2), then a Certifications carousel (images in `public/certifications/`).
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
- **Skills:** `skills`, the resume's four groups verbatim. `certifications`
  feeds the carousel (name, issuer, link, local image).
- **Domains:** each role's `domains` in `experience`; **hero cards:**
  `heroStrengths`.
- **Links:** render `mailto:` and external links with `linkProps()` from
  `lib/links.ts`; the content guard enforces it.

The resume PDF lives at `public/resume/Faraz-Ali-Product-Manager.pdf` (a
fixed path, so shared links keep working). Every Download Resume link comes
from `resumeLinkProps()` in `lib/links.ts`: it adds `?v=` with
`identity.resumeVersion`, the first 8 characters of the PDF's SHA-256, and
downloads as `identity.resumeFileName`. After replacing the PDF, run
`npm run check:content`: check m prints the new version to paste in.

## Content guard

[`scripts/check-content.ts`](scripts/check-content.ts) runs before every build,
so Vercel and CI fail fast on drift. It checks:

- **a.** Exactly one current role, listed first, with dates ending "Present".
- **b.** Every tile and bullet link resolves to an impact page, and every
  impact page is linked from somewhere.
- **c.** Each tile's number appears in its page's metric or Results.
- **d.** Each tile's `resumeEvidence` appears in the resume PDF (compared
  lowercase, with dashes and hyphens as spaces).
- **e.** Retired (October 2026): education shows no years.
- **f.** Every root-relative asset path in content exists under `public/`.
- **g.** No identity literals (name, titles, employers) are hardcoded in
  `app/` or `components/`.
- **h.** No retired claims (listed in `RETIRED_CLAIMS` in the script) in
  content, `app/`, `components/` or this README.
- **i.** No hand-written `target="_blank"` or `mailto:` in `app/` or
  `components/`: links go through `linkProps()` in `lib/links.ts`.
- **j.** Every phrase in `bioAccents` and `bioEmphasis` still appears in the
  bio.
- **k.** Every logo in `credibility` is a square PNG.
- **l.** No component renders a `<script>` (React never runs it on the
  client).
- **m.** `identity.resumeVersion` matches the resume PDF's fingerprint, so a
  new PDF always gets a new download URL.

Each failure names the field and the fix. **Rule: update the resume PDF first,
then `content.ts`.** A new metric fails check d until the PDF carries it.

## Headshot

A local WebP, `public/images/faraz-ali.webp` (1024 × 1024, about 40 KB),
loaded eagerly as the hero image. Nothing is fetched from GitHub.

## Local dev on the network address

`next dev` blocks its own assets for origins other than `localhost`;
`next.config.ts` allows this machine's LAN IPv4 addresses
(`allowedDevOrigins`), so the dev site also works at e.g.
`http://192.168.x.x:3000` from a phone. Copy-to-clipboard falls back to a
textarea there, because `navigator.clipboard` needs a secure context.

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
stage ([`HeroStage.tsx`](components/HeroStage.tsx)), which CSS alone switches
on (motion allowed, screen at least 750px tall). Nothing is hidden
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
