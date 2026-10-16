# Design Doc — Faraz Ali Portfolio

The October 2026 redesign takes its visual language from capslock.global:
measured palette, type scale, layout and motion, adapted to a dense PM
portfolio. The full audit, section mapping and deviations are in
`docs/redesign/SPEC.md`; this doc is the working rulebook.

## Mission

Single-page portfolio for a Product Manager whose proof points are metrics.
Audience: recruiters and hiring managers who skim. One job: get a visitor to
scan the impact numbers, open a case study, and make contact. Motion never
stands between them and the content.

## Architecture

- Next.js (App Router) + TypeScript strict + Tailwind CSS v4,
  `output: 'export'`: fully static, zero server. Vercel or GitHub Pages.
- All copy lives in `lib/content.ts` (typed). Components only render it.
- Fonts self-hosted via `next/font`: **Geist** (all UI and body) and
  **Instrument Serif Italic** (the set-apart word in headings, every metric
  numeral). They stand in for the reference's commercial Suisse Intl and
  PP Eiko Italic.
- GitHub data: the contribution calendar fetches client-side with a
  fallback chain (API → image → profile link); repos are curated in content.

## Tokens (`app/globals.css`)

- **Colour:** white page; ink `#111212` text and the footer; muted `#5B6066`
  for secondary copy (AA); surfaces `#FBFCFF`, `#F8F9FC`, `#F0F3FA`; pastels
  blue `#DFE9FA` and pink `#FDF3F6`; accents `#76A8F3` and `#FFA3B8` are
  **decorative only** (sparkles, rings, numerals on panels, gradients).
  Gradients: primary button, secondary button, 1px card border, orbit ring.
- **Type:** clamp() tokens `--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`,
  `--fs-numeral`, `--fs-lead`, `--fs-body` (16px, 17px from 1280), `--fs-label`.
  Regular weight headlines, tight tracking (-0.02 to -0.04em), balanced
  wrapping. Long-form copy at body size with a 68ch measure.
- **Layout:** `.wrap` container (gutter 6.67vw on phones, 8vw to 1279px,
  16.15vw from 1280, content capped at 1300px); `.section` vertical rhythm;
  card radius `--radius`; pill buttons 48px tall.
- **Motion:** `--ease-out` cubic-bezier(.16,1,.3,1), `--ease-gl`
  cubic-bezier(.2,0,0,1), `--ease-overshoot` (button hover), `--ease-quint`
  (odometer).

## Rules

- **One glass primitive.** `.glass` (white 70%, 1px hairline, blur 8px) is
  used by the nav, its mobile menu and the three hero stat cards. At most 6
  live `backdrop-filter` elements per viewport; measured at most 4 (hero) at
  375/768/1024/1440. `npm run verify` enforces it.
- **Motion via transform, opacity and clip-path.** One exception: the
  achievement statements blur in word by word (filter, once).
- **Nothing hidden without JavaScript.** Load animations run only under
  `html.js` (set by an inline head script before first paint). Scroll reveals
  hide content only after `RevealController` adds `reveal-ready`, and it marks
  anything already on screen as revealed first. With no JS, a failed bundle,
  or under reduced motion, every word renders visible.
  `scripts/content-check.mjs` reports any text visible with JS but hidden
  without it; the target is 0.
- **Reduced motion:** no load or scroll animation, no hero scroll stage, no
  odometer, no divider bend, Lenis off.
- **Content preservation.** Visual splitting never changes DOM text: heading
  words stay real text in inline masks; odometer digits keep the real digit
  and roll a pseudo-element; panel numerals and the nav label roll are CSS
  generated content. Whole-card links keep their inner text order, so their
  accessible names don't change.
- **AA contrast** on every surface, including pastel tiles and the ink footer.

## Page architecture (top → bottom)

1. **Nav:** floating centred glass pill; drops in on load, hides while
   scrolling down past one viewport, returns on scroll up; label roll and
   pink dot on hover. Below lg: full-width pill, menu opens in place
   (clip-path), Escape closes it.
2. **Hero:** portrait, greeting, "*I am* Faraz Ali.", title, Get in touch and
   Download Resume. With motion, a sticky scroll stage carries the portrait
   into a gradient ring while three stat cards (68%, 19.1%, −99%) fade in.
   Without it, a static stack. Then the introduction, contact row and the
   Experience/Education logo pills.
3. **Impact:** two employer groups (name, dates), each a bento of four
   tiles with odometer numerals; every tile links to its impact page.
4. **Selected Work:** asymmetric two-column grid, PDF-preview images reveal
   by scaling in; Zomato's four documents behind its toggle.
5. **Built:** four numbered panels; hover/focus (always on touch) brings up
   the pastel wash and lifts the spheres. Signal carries a real screenshot
   of the live demo.
6. **Experience + Education:** sticky heading and Domains on the left, a
   numbered timeline on the right; "Read the case" links keep their
   "Read the case: {metric}" names.
7. **Achievements:** centred statement per achievement.
8. **GitHub:** calendar panel, repo listing rows, link to all repositories.
9. **Skills & Credentials:** intro line, four pastel group cards with pill
   chips, certifications list.
10. **Footer:** ink block with Get in touch, contacts, Download Resume, the
    rising name wordmark, the menu and the copyright line.

`/impact/[slug]`: same nav and footer; metric heading with the figure in the
serif italic, outcome, pastel meta tiles, two-column narrative rows split by
drawn dividers, confidentiality note on an ink tile.

## Checks

- `npm run lint`, `npx tsc --noEmit`, `npm run build` before every commit.
- `npm run verify` after UI changes (screenshots, glass budget, axe,
  keyboard: Impact tiles, case links, documents toggle, mobile menu).
- `node scripts/content-check.mjs compare` after any change that touches
  rendered output: zero missing or changed items on every route.
