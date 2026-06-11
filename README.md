# Faraz Ali — Portfolio

Dark-glassmorphism personal portfolio for Faraz Ali, Associate Product Manager.
Next.js (App Router) + TypeScript strict + Tailwind CSS v4, fully static
(`output: 'export'`) — no server, no CMS, no database.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

## Editing content

**All copy and data lives in [`lib/content.ts`](lib/content.ts).** Components only
render it — change text, metrics, case studies, skills, or links there without
touching any component. The typed structure tells you exactly what each section
expects.

Two files you supply (paths are wired and ready):

| File | Where to put it |
| --- | --- |
| Resume PDF | `public/resume/Faraz-Ali-Product-Manager.pdf` |
| Headshot | `public/images/faraz-ali.jpg` (square crop works best) |

Until the headshot exists, the hero renders an "FA" monogram in the same glass
ring — nothing breaks. The Download Resume buttons link to the PDF path either way.

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

## Design system

Locked tokens in [`app/globals.css`](app/globals.css): ink `#070B14`, text
`#E8ECF5`, muted `#9AA4B8`, indigo/teal/amber accents, GitHub green scale. One
glass primitive (`.glass`), reserved for nav, hero panel, metric tiles, case-study
cards, calendar container, and repo cards — everything else is flat. Hovers animate
transform/border/shadow only; orb drift, count-ups, and entrance reveals are all
disabled under `prefers-reduced-motion`. Fonts (Sora / Inter / JetBrains Mono) are
self-hosted via `next/font`. See [`docs/DESIGN.md`](docs/DESIGN.md).

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
