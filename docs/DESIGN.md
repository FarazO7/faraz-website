# Design Doc — Faraz Ali Portfolio

Derived directly from the approved build spec. The spec answers the brainstorming
questions (subject, audience, palette, structure, content); this doc records the
decisions as implemented plus the implementation plan.

## Mission

Single-page portfolio for an Associate Product Manager whose proof points are metrics.
Audience: recruiters and hiring managers at product companies. One job: get a visitor
to scan the impact numbers, open a case study, and make contact.

## Architecture

- Next.js (App Router) + TypeScript strict + Tailwind CSS v4, `output: 'export'` —
  fully static, zero server. Deployable to Vercel or GitHub Pages.
- All GitHub data fetched client-side (CORS-open APIs) with a layered fallback chain.
- All copy lives in `lib/content.ts` (typed). Components only render it.
- Fonts self-hosted via `next/font`: Sora (display), Inter (body), JetBrains Mono
  (metric numerals, language tags, contribution counts) — the spec's sanctioned
  fallback pairing, since the UI UX Pro Max skill was unavailable in this environment.

## Design system (locked tokens from spec §3)

- Base `#070B14`; text `#E8ECF5`; muted `#9AA4B8`; accents indigo `#4F7CFF` (links,
  focus), teal `#18C6B4` (positive/kickers), amber `#FFB454` (metric numerals — the
  page's signature); GitHub green scale `#161B22 → #39D353`.
- Background is a designed environment: three drifting radial-gradient orbs
  (indigo/teal/violet, 13–16% opacity, 44–60s transform-only loops) + 2.5% noise.
  Killed under `prefers-reduced-motion`.
- One glass primitive (`.glass` in `globals.css`): 7% white tint, `blur(14px)
  saturate(160%)`, 14% white border, top-left rim light, solid fallback when
  `backdrop-filter` is unsupported.
- Glass budget: nav, hero panel, four metric tiles, case-study cards, contribution
  calendar container, repo cards. Everything else flat. Hovers animate
  transform/border/shadow only — never `backdrop-filter`.
- Budget enforcement: the metric tiles sit inside the already-blurred hero panel,
  so they use `.glass-nested` (full glass recipe, blur layer off) — a second
  backdrop-filter there is GPU cost with no visual gain, and dropping it keeps
  every viewport at ≤6 active backdrop-filters (measured: hero 4, work 6,
  github 6 at 1440×900).

## Page architecture (top → bottom)

Nav (glass, fixed) → Hero (avatar in glass ring, name, positioning, 4 metric tiles
with count-up, contact row) → Selected Work (4 glass cards, Zomato expandable) →
Experience (flat timeline, glass only on current role) → GitHub (live contribution
calendar + repo cards) → Skills/Achievements/Certifications/Education (quiet chips,
dense lists) → Footer (flat: contact repeat, architecture-map link, copyright).

## GitHub integration degradation chain

- Calendar: jogruber API → custom 53×7 grid; on error → `ghchart.rshah.org` image;
  on error → quiet link to the GitHub profile. Never an empty box or endless spinner.
- Repos: fresh localStorage cache (≤60 min) → live API (forks filtered, `pushed_at`
  desc, max 8, cached on success) → stale cache → static snapshot in `content.ts`.
  Skeletons cap at 2s before fallback engages; live data replaces fallback if it
  arrives later.

## Implementation plan (file order)

1. `next.config.ts` — export mode, basePath via `NEXT_PUBLIC_BASE_PATH`, unoptimized images
2. `app/globals.css` — tokens, `.glass`, orbs, noise, rise/skeleton animations, reduced-motion kill-switch
3. `app/layout.tsx`, `app/icon.svg`, `components/BackgroundFX.tsx` — fonts, metadata, environment
4. `lib/content.ts`, `lib/utils.ts`, `lib/github.ts`, `lib/hooks.ts` — data + clients
5. `components/Section.tsx`, `components/Nav.tsx`, `components/ContactLinks.tsx`
6. `components/Hero.tsx`, `components/Metrics.tsx`
7. `components/CaseStudies.tsx`, `components/Experience.tsx`
8. `components/ContributionCalendar.tsx`, `components/RepoCards.tsx`, `components/GitHubSection.tsx`
9. `components/Skills.tsx`, `components/Footer.tsx`, `app/page.tsx`
10. `.github/workflows/deploy.yml`, `README.md`, public placeholders
11. Verify: build, breakpoints, reviews, architecture map, acceptance table

## Acceptance criteria (from spec Phase 1)

Lighthouse ≥95 ×4; WCAG AA contrast measured on glass; zero console errors /
hydration warnings; clean strict TS build; responsive at 375/768/1024/1440;
reduced-motion respected; GitHub section degrades gracefully.
