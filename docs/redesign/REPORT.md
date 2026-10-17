# Redesign report

Branch `redesign/capslock` (not pushed), on top of `resume-sync-2026-10`
(31c86cd, the October resume sync). Spec: `docs/redesign/SPEC.md`. Design
rules: `docs/DESIGN.md`.

## Preview locally

```bash
git checkout redesign/capslock
npm ci
npm run build
node scripts/serve-out.mjs        # http://localhost:4173
```

Checks: `npm run lint`, `npx tsc --noEmit`, `npm run verify`,
`node scripts/content-check.mjs compare`.

## Commits

| Commit | What |
|---|---|
| 31c86cd | Your October resume sync, committed on `resume-sync-2026-10` at your request |
| e89dec9 | Brief, content baseline, content-check script |
| fb732b7 | Specification (approved) |
| 759effd | Content check: text runs split at block boundaries; baseline recaptured from 31c86cd |
| c37131b | The redesign |
| 7f61e8b | DESIGN.md, README, verify checks |
| f64dbe3 | Independent-review fixes and the page crossfade |

## Files changed

- **Design system:** `app/globals.css` (rewritten), `app/layout.tsx` (fonts,
  theme colour, pre-paint `js` class), `lib/ogImage.tsx` (light cards, text
  unchanged).
- **New components:** `HeroStage` (scroll stage), `Words` (word masks),
  `Numeral` (odometer), `RevealController` (one observer for all reveals),
  `Divider` (drawn, elastic line), `PageTransition` (crossfade);
  `lib/heroFit.ts`; `react-canary.d.ts` (types for React's ViewTransition).
- **Restyled:** every section component, `Nav`, `Footer`, `SmoothScroll`,
  `app/page.tsx`, `app/impact/[slug]/page.tsx`.
- **Removed:** `BackgroundFX`, `ReactiveGalaxy` (WebGL), `Reveal`,
  `lib/hooks.ts`.
- **Content (`lib/content.ts`):** `heroStats` and `metricLabel` (reuse
  existing tiles and labels), Signal's screenshot path and alt text, the
  footer "Menu" label. The last two carry `REVIEW(Faraz)`.
- **Assets:** `public/previews/signal.webp`, a real screenshot of the live
  demo (16 Oct 2026).
- **Scripts and docs:** `scripts/content-check.mjs` (new),
  `scripts/verify-site.mjs` (tablist check replaced), `docs/DESIGN.md`,
  `README.md`, `docs/redesign/*`.

## Dependencies

- **Added:** none. The content check uses Playwright, already a
  devDependency.
- **Removed:** `framer-motion` and `ogl`. Nothing uses them any more.
- **Kept:** `lenis`. The reference uses Lenis 1.3.23 with `duration: 1.5`,
  so the site now uses those settings.

## Font substitutions

| Reference (commercial) | Used (OFL, via next/font) |
|---|---|
| Suisse Intl | Geist |
| PP Eiko Regular Italic | Instrument Serif Italic |

Sora, Inter and JetBrains Mono are gone; the site loads two families instead
of three.

## Deliberate deviations from the reference

See SPEC.md §5. In short:
- **Left out:** the loader, the custom cursor, the planet videos and team
  photos, and the draggable photo carousel.
- **Panels:** they never collapse; only their surface animates.
- **Timing:** entrance animation is shortened so the first screen settles in
  about 1.5 seconds.
- **Reading and contrast:** body text is at least 16px with AA greys, and the
  pastel accents are decorative only.
- **Navbar:** no compaction, because it animates layout.
- **Case studies:** no hover zoom, because the previews aren't links.
- **Stat cards:** they use the single glass primitive (8px blur, not 16px).
- **Theme colour:** white rather than black.

## Content check (final run)

`node scripts/content-check.mjs compare`, final build, four modes (reduced
and full motion at 1440px, reduced motion at 390px, no JavaScript):

- **0 missing or changed items on all 11 routes**, in every mode.
- **0 text blocks visible with JS but hidden without it** (was 152 on the
  old home page).
- **Approved change:** `theme-color` (#070B14 → #ffffff).

New items for your approval:

| Where | New | Note |
|---|---|---|
| Home | "Menu" | label over the footer's copy of the seven section links |
| Home | image `/previews/signal.webp`, alt "The Signal live demo: a sample-data run and a CSV upload for turning feedback into a prioritised roadmap brief" | drafted alt text, marked REVIEW(Faraz) |
| All ten case pages | nav (FA, seven section links as `/#…`, Download Resume) and the site footer (Get in touch, title and location, phone, email, LinkedIn, GitHub, the name wordmark, Menu, ©) | everything here already exists on the home page; only the case-page copies are new |

The mobile menu's links now stay in the HTML when it is closed (hidden and
inert), so they also appear as duplicates. No other new visible text.

## Lighthouse (median of 3, local static export)

| Page, preset | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home, mobile | 85 → **91** | 100 → 100 | 100 → 100 | 100 | 4.34s → 3.18s | 30 → 151ms | 0 → 0 |
| Home, desktop | 99 → **100** | 100 → 100 | 100 → 100 | 100 | 0.85s → 0.65s | 0 → 0ms | 0 → 0 |
| risk-scoring, mobile | 97 → 96 | 100 → 100 | 100 → 100 | 100 | 2.67s → 2.29s | 25 → 150ms | 0 → 0 |
| risk-scoring, desktop | 100 → 100 | 100 → 100 | 100 → 100 | 100 | 0.59s → 0.50s | 0 → 0ms | 0 → 0 |

Targets from BRIEF §15:
- Accessibility and Best Practices are not below the baseline (100 throughout).
- Performance is no more than 5 points lower (home +6, case page −1).
- CLS stays at or under 0.1 (0 throughout).

Mobile Total Blocking Time rose from about 30ms to 150ms; LCP improved on
every page. The extra blocking time is the price of the client-side motion
(reveal observer, hero stage, view transitions). An earlier run in this
session, before the review fixes, measured 93 and 99 on mobile, so expect a
few points of run-to-run variance.

## Other verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build`: pass.
- `npm run verify`: pass.
  - Glass budget: at most 1 live blur at the measured positions, and 4 while
    the hero's stat cards are on screen (nav plus three cards); the limit is 6.
  - axe: 0 serious or critical issues.
  - Keyboard: Impact tiles, "Read the case" links, the Zomato documents
    toggle, and the mobile menu (Escape closes it and returns focus).
- No console errors and no horizontal overflow at 1440, 1024, 768, 390 and
  320px.
- **Navigation:** a metric tile opens its case page and "Back to portfolio"
  lands on Selected Work. Loading `/#experience` lands 88px from the top,
  just under the nav. The crossfade adds no measurable delay (38–63ms against
  51ms before).
- **Reduced motion:** a static layout with everything visible.
- **Failed JavaScript bundle:** the hero headline and buttons stay visible and
  clickable.
- **Independent review:** a subagent reviewed the diff against the brief and
  spec in a fresh context. Its correctness findings are fixed in f64dbe3:
  - phone taps blocked under the nav
  - invisible focus rings
  - the skip link not moving focus
  - reduced-motion gaps
  - hero layout flipping on toolbar resize
  - print showing placeholder digits
  - a second glass style
  - the hero buttons before hydration

## Screenshots (not committed)

`docs/redesign/screenshots/`:
- `before/` and `after/`: home at 1440, 1024, 768, 390 and 320px, and
  `/impact/risk-scoring/` at 1440 and 390px, each as a first-viewport and a
  full-page shot.
- `reference/`: CapsLock home and inner pages.
- `lighthouse-before/` and `lighthouse-after/`: the raw Lighthouse JSON.

## Pre-existing issues

- This folder is synced (likely iCloud), which creates "… 2" duplicate files.
  866 of them in `node_modules` broke `tsc` until a clean `npm ci`. Untracked
  duplicates remain in `app/`, `lib/` and `public/`, and I left them alone;
  `lib/ogImage 2.tsx` differs from `lib/ogImage.tsx`. Moving the repo out of
  the synced folder would stop this.
- Local Node is 24.15; the project pins 22.
- The live site still shows the September content, including client wording
  the October sync removed. Deploying this branch replaces it.
- The PDF preview script prints "TT: undefined function" warnings (harmless).
- No environment variables are needed. The contribution calendar uses a
  public API client-side, and `NEXT_PUBLIC_BASE_PATH` is only for GitHub Pages.

## Known limitations

- Your notes in BRIEF §5 were still placeholders, so the motion is my reading
  of the reference's compiled code. Worth checking the feel on the Vercel
  preview.
- The hero scroll stage switches off on screens under 560px tall, or where
  the hero doesn't fit one screen, and falls back to the static layout.
- The crossfade needs the View Transitions API (Chromium 125+, recent Safari
  and Firefox); other browsers swap pages instantly.
- Odometer digits are proportional italics, so a wide digit can be clipped
  for a moment mid-roll. They are exact at rest.
- On case pages, axe flags the `/#…` links as "skip links" (moderate). The
  existing "Back to portfolio" link already did; the Lighthouse accessibility
  score is 100.
- Lighthouse's informational "label-content-name-mismatch" lists the
  aria-labelled metric tiles and the FA monogram (labels unchanged from
  before).
- The Signal screenshot is a snapshot and won't follow later changes to the
  demo.
