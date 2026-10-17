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
- Links: every `mailto:` and external link renders through `lib/links.ts`
  (new tab, `noopener noreferrer`); the content guard fails the build on a
  hand-written `target="_blank"` or `mailto:` in `app/` or `components/`.

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

- **One glass primitive.** `.glass` (white 88%, 1px hairline, blur 16px, so
  the nav stays clean over the ink footer) is used by the nav and its mobile
  menu. The hero's strength cards carry the reference's tint without a blur.
  At most 6 live `backdrop-filter` elements per viewport. `npm run verify`
  enforces it.
- **Motion via transform, opacity and clip-path.** One exception, requested
  in the October 2026 site brief: the Built cards open with
  `grid-template-rows: 0fr → 1fr` (instant under reduced motion).
- **Nothing hidden without JavaScript.** Load animations run only under
  `html.js` (set by an inline head script before first paint). That is the
  only hand-written script: components render none (content guard check l),
  so the hero's layout is decided in CSS. Scroll reveals
  hide content only after `RevealController` adds `reveal-ready`, and it marks
  anything already on screen as revealed first. With no JS, a failed bundle,
  or under reduced motion, every word renders visible.
  `scripts/content-check.mjs` reports any text visible with JS but hidden
  without it; the target is 0.
- **Reduced motion:** no load or scroll animation, no hero scroll stage, no
  odometer, no divider bend, no carousel drift, cards, tabs and Domains pills
  switch instantly, the nav shows and hides without sliding, Lenis off.
- **Italic figures get room.** Instrument Serif italic digits lean past their
  advance width: anything that clips them (odometer digits) gets 0.15em of
  room in `em`, and the clip only applies while a roll runs.
- **Content preservation.** Visual splitting never changes DOM text: heading
  words stay real text in inline masks; odometer digits keep the real digit
  and roll a pseudo-element; panel numerals and the nav label roll are CSS
  generated content. Whole-card links keep their inner text order, so their
  accessible names don't change.
- **AA contrast** on every surface, including pastel tiles and the ink footer.

## Page architecture (top → bottom)

1. **Nav:** floating centred glass pill; visible at the top, slides away past
   ~80px. With a mouse it returns when the pointer reaches the top of the
   window (150ms delay) and leaves 400ms after the pointer does; on touch it
   shows on scroll up. Keyboard focus always shows it. Below lg: full-width
   pill, menu opens in place (clip-path), Escape closes it.
2. **Hero:** portrait, greeting, "*I am* Faraz Ali.", title, Get in touch and
   Download Resume, then the contact row (phone and copy-email pills,
   LinkedIn and GitHub icon buttons). With motion and a screen at least
   750px tall (CSS: `html.js` plus a media query, before first paint), a
   sticky scroll stage carries the portrait into a gradient ring while five
   strength cards (`heroStrengths`) fade in one after another, sliding from
   their outer edge. The ring and cards share one CSS grid, so no card can
   cover the portrait: two cards either side and one below on desktop, the
   ring above the cards two per row on phones. Then the "About" intro (the
   bio in two full-width paragraphs, styled phrases from
   `bioAccents`/`bioEmphasis` that never wrap) and the Experience and
   Education logo rows, side by side from 1280px.
3. **Impact:** a tablist, one tab per company with its dates; each panel is
   a bento of four tiles on five columns (3 + 2, then 2 + 3) with odometer
   numerals, every tile linking to its impact page. Heading, tabs and tiles
   fit one screen at 1366×768. Panels share one grid cell, so switching never
   moves the page.
4. **Selected Work:** a full-width carousel (`Carousel.tsx`: a continuous
   drift at `DRIFT_PX_PER_S` over aria-hidden, inert copies, prev/next,
   pause/play, with the pause rules) of case-study cards; card widths follow
   the column (`cqw`); previews contained, never cropped; one stretched link
   per card, except Zomato, which keeps its four-document toggle.
5. **Built:** four expanding cards; closed, the name and a faint index; open
   (hover intent, or the header button), the description above the links,
   every card at one measured height (`--built-open`). One open at a time;
   it stays open when the pointer leaves.
6. **Experience:** sticky heading and, from lg, the Domains of the role at
   the reading line (40% down the viewport), changing with a FLIP animation
   (`DomainPills.tsx`); a numbered timeline on the right, its active circle
   in blue. The sticky column's grid ends with the last role, so the panel
   scrolls away with it. On phones each role lists its own domains.
   "Read the case" links keep their "Read the case: {metric}" names.
7. **Education:** its own section on the same two columns (heading and line
   on the left, the numbered entries on the right), nothing pinned, no years.
8. **Skills & Credentials:** heading without a label, four pastel group cards
   with pill chips, then the Certifications carousel (local certificate
   images, each card a link).
9. **Footer:** a compact ink block: Get in touch with the title and location,
   Download Resume, the contact row and the copyright line.

`/impact/[slug]`: same nav and footer; metric heading with the figure in the
serif italic, outcome, pastel meta tiles, two-column narrative rows split by
drawn dividers, confidentiality note on an ink tile.

## Checks

- `npm run lint`, `npx tsc --noEmit`, `npm run build` before every commit.
- `npm run verify` after UI changes (screenshots, glass budget, axe,
  keyboard: Impact tiles, case links, documents toggle, mobile menu;
  carousel copies and drift; no hero script).
- `node scripts/content-check.mjs compare` after any change that touches
  rendered output: zero missing or changed items on every route.
