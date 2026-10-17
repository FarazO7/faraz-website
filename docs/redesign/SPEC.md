# Redesign specification: CapsLock-referenced portfolio

Status: **approved 2026-10-16 and implemented** on `redesign/capslock`
(content base: the October resume sync, committed as 31c86cd). Results and
the final report are in `docs/redesign/REPORT.md`.

Evidence key: **[M]** measured from the reference's compiled CSS/JS or
rendered pages; **[O]** observed in the browser (screenshots in
`docs/redesign/screenshots/reference/`, not committed); **[I]** inferred or
chosen by me, not taken from the reference.

---

## 0. Decisions needed before implementation

1. **Which content is the baseline.** The working tree carries an uncommitted
   October 2026 resume sync (`lib/content.ts`, five components, `lib/hooks.ts`,
   `docs/DESIGN.md`, two scripts, the resume PDF). The live site and `main`
   still show the September content. BRIEF.md describes the live site
   ("Products I've shipped", five skill groups, "All skills (92)", five
   certifications, three achievements); the local tree has "Prototypes I've
   built", four skill groups, no skills index, two certifications and two
   achievements (§7 lists every difference). The live site also still carries
   client-identifying detail that the October sync retires (see
   `RETIRED_CLAIMS` in `scripts/check-content.ts`).
   **Recommendation:** commit the October sync on `resume-sync-2026-10`, then
   I rebase `redesign/capslock` onto it (my two commits touch only new files,
   so the rebase is clean). The baseline in `docs/redesign/baseline/` was
   captured from that local state and already reports zero differences.
2. **Uncommitted files I must edit** (BRIEF §16): `components/Achievements.tsx`,
   `BuiltProjects.tsx`, `Reveal.tsx`, `Skills.tsx`, `Timeline.tsx`,
   `lib/hooks.ts`, `docs/DESIGN.md` (the design system it governs changes) and
   `scripts/verify-site.mjs` (its tablist, glass-budget and screenshot checks
   follow the old design). Committing the sync first (item 1) removes the
   conflict.
3. **Light theme.** The reference is a white site with near-black type and
   pastel blue/pink accents. Following it replaces the dark cosmic theme,
   the WebGL galaxy and the orbs. `docs/DESIGN.md` gets rewritten to the
   new system.
4. **Impact tabs → two stacked groups.** All eight metrics visible at once
   (two employer groups, each with name and dates) instead of a tablist that
   hides four. Content and links unchanged; the tab interaction goes away.
5. **Dependencies.** No new runtime dependency. Lenis stays (the reference
   uses it). `framer-motion` and `ogl` are removed once nothing uses them.
6. **New links and labels** (for the content check's "new" list): nav strip
   and footer added to the ten case pages; footer gains a "Menu" label with
   the seven anchors. No other new visible text is planned.

---

## 1. Routes (verified against source and build)

| Route | Source | Notes |
|---|---|---|
| `/` | `app/page.tsx` | 12 sections, see §4 |
| `/impact/risk-scoring/` | `app/impact/[slug]/page.tsx` | linked from Impact card and Experience |
| `/impact/kyc-review-workflow/` | same | card + Experience |
| `/impact/roles-permissions/` | same | card + Experience |
| `/impact/aml-mock-service/` | same | card + Experience |
| `/impact/compliance-dashboard/` | same | **Experience "Read the case" only** |
| `/impact/ai-proctoring/` | same | card + Experience |
| `/impact/referral-growth/` | same | card + Experience |
| `/impact/signup-conversion/` | same | card + Experience (local); Experience only on live |
| `/impact/razorpay-route/` | same | card + Experience |
| `/impact/waitlist-automation/` | same | **Experience only** (local); card on live |
| `/opengraph-image`, `/twitter-image`, `/impact/*/opengraph-image`, `/impact/*/twitter-image` | `lib/ogImage.tsx` | restyled to the new palette, text unchanged |
| `/_not-found` | Next default | inherits the new body styles |

Static export (`output: "export"`, trailing slashes), Next 16.3.6 with
Turbopack, React 19.2.4, Tailwind v4, TypeScript strict, npm.

---

## 2. Reference audit (CapsLock)

### 2.1 Stack [M]
- Astro with view transitions (`astro-view-transitions-fallback: animate`).
- GSAP 3.15 core, ScrollTrigger, SplitText, CustomEase.
- **Lenis 1.3.23** smooth scroll, `duration: 1.5`, default easing
  `t => min(1, 1.001 - 2^(-10t))`, **disabled on touch devices**, driven by
  the GSAP ticker. So BRIEF §4.6 applies: keep Lenis (already installed,
  same version).
- A mouse-follower cursor (pointer:fine only) and a 0.6 s loader fade-out.
- Reduced motion: the only rule is `::view-transition-*{animation:none}`.

### 2.2 Colour [M]
| Token | Value | Where the reference uses it |
|---|---|---|
| bg | `#ffffff` | page |
| surface | `#fbfcff` | capability panels, listing cards |
| surface-2 | `#f8f9fc` | stat tile |
| surface-3 | `#f0f3fa` | stat tile |
| fill | `#edeff2` | inputs, fills |
| blue-50 | `#dfe9fa` | stat tile, gradient start, mobile panel |
| pink-50 | `#fdf3f6` | stat tile |
| ink | `#111212` | text, footer background |
| black | `#000000` | inverted stat tiles |
| primary | `#76a8f3` | accents, numerals, sparkles |
| secondary | `#ffa3b8` | sparkles, nav dots |
| teal / lilac / sand | `#93c8cf` / `#c3c4f5` / `#d5c3a2` | panel numerals 02–04 |
| gradient-primary | `linear-gradient(90deg,#dfe9fa -27.15%,#76a8f3 112.02%)` | primary pill button |
| gradient-secondary | `linear-gradient(270deg,#ffa3b8 0%,#fadee5 100%)` | secondary pill, nav dot |
| gradient-border | `linear-gradient(90deg,#77a9f3,#e2edff)` 1px, mask-composite | cards |
| gradient-ring | `linear-gradient(264.59deg,#ffa3b8 -15%,#72a6f3 109.07%)` | orbit ring |
| wash | `linear-gradient(180deg,#fff,#dfe9fa4d)` | section backgrounds |
| strip | `#ffffffb3` + `1px rgba(230,233,239,.5)` + `blur(8px)` | navbar |
| glass card | `linear-gradient(232.63deg,#cfe4ff66 14.38%,#f0f0f566 71.65%)` + `blur(16px)` | hero stat cards |
| theme-color | `#000` | meta |

Footer: `#111212` with white text; labels at opacity .4; giant wordmark at
opacity .1. Links inherit the text colour with an underline offset of .25em
and drop the underline on hover.

### 2.3 Typography [M]
- **Suisse Intl** 300–700 (commercial, Swiss Typefaces) for everything.
  Headers at weight 400, nav at 500.
- **PP Eiko Regular Italic** (commercial, Pangram Pangram) for the set-apart
  words (`<i>` inside headers, nudged up .06em) and every stat numeral.
- Fluid root: `html{font-size:2.6667vw}` below 768px (10px at 375),
  `.5208vw` from 768px (7.5px at 1440, 10px at 1920), fixed 10px from 1920.

| Style | Mobile | ≥768 (rem) | px at 1440 | Line height | Tracking |
|---|---|---|---|---|---|
| Header xl | 4.4rem | 12.4rem | 93 | 90% | -.04em |
| Header lg | 3.6rem | 7rem | 52.5 | 100% | -.03em |
| Header | 3.6rem | 5.4rem | 40.5 | 105% | -.03em |
| Panel title | 2.4rem | 4.8rem | 36 | 120% | -.02em |
| Text (lead) | 1.4rem | 2.4rem | 18 | 120% | — |
| Body | 1.4rem | 1.4rem | 10.5 | normal | — |
| Footer links | 1.8rem | 1.8rem | 13.5 | 115–130% | -.02em |

Headers use `text-wrap: balance` and are centred on the homepage, left on
inner pages.

### 2.4 Layout [M]
- Container: side padding 2.5rem mobile (25px at 375), **31rem** from 768
  (232px a side at 1440, so 976px of content), max 1920 at ≥1600.
- One breakpoint does almost all the work: 768px. Extras at 1600/1920.
- Sections pad 8rem; headers sit 4–6.6rem above their content.
- Radii: cards 1.6rem (2.3rem on desktop panels), pills 99999px, strip 2.5rem.
- Buttons: pill, height 4.8rem, min-width 14rem, padding 0 2.4rem, label in
  ink on a pastel gradient.
- Navbar: a floating centred pill (top 3rem) holding logo, three links with a
  pink counter badge, and the gradient CTA. Mobile: full-width pill with a
  two-bar toggle; it expands in place into a menu with 3.6rem links.

### 2.5 Motion [M unless marked]
| Pattern | Trigger | What moves | Timing |
|---|---|---|---|
| Header reveal | scroll in, once | SplitText words in masks, y 100%→0 | 2.5s expo.out, stagger total .2–.3s |
| Text reveal | scroll in, once | words in masks, y 100%→0 | 1.2s expo.out, stagger total .6s |
| Items | scroll in, batched | opacity 0→1 | 1s, stagger .1 |
| Slide | scroll in | y 70px→0 (2s expo.out), opacity (1s) | stagger .1 |
| Image reveal ("bg") | scroll in | scale 1.15→1, opacity 0→1 | 3s expo.out |
| Buttons | scroll in | scale .8→1, opacity | 3s expo.out, stagger .1 |
| Divider | scroll in | SVG line scaleX 0→1 | 3s expo.out |
| Divider bend | mouse move / leave | quadratic curve follows the pointer, springs back | follow .1s; release 2s elastic.out(1,.2) |
| Number | scroll in | counts 0→value, keeps decimals and commas | 1.5s power2.inOut |
| Digits | scroll in | odometer: each digit column rolls to its value | 2s power4.out, stagger total .1 |
| Navbar enter | load | strip y -180%→0 | 2s expo.out |
| Navbar on scroll | scroll | compact after 10px; hidden when scrolling down past one viewport, back on scroll up | top .8s cubic-bezier(.16,1,.3,1) |
| Nav link hover | hover | label rolls up and a copy scales .7→1; pink dot scales in | 1.2s cubic-bezier(.16,1,.3,1); .4s |
| Footer link hover | hover | pink dot scales in, label shifts 1.4rem | .4s |
| Button hover | hover | scaleX 1.02 with overshoot, ripple circle | .6s cubic-bezier(.34,5.56,.64,1); .7s |
| Hero entrance | load | planet/insets fly in; header at .6s, title at .8s | 2s expo.out |
| Hero scroll | scrub .4 | headline fades by 10%; sphere moves down and scales ×2.11 (40%, power1.out); insets parallax; stat cards fade in at 30% (stagger .05); ring fades and scales .7→1 | sticky stage |
| Capability panels | hover | active panel: background fades in, blurred spheres rise, numeral recolours, accordion opens | bg .4s in/.8s out; spheres 4–7s cubic-bezier(.2,0,0,1); accordion 1.2s cubic-bezier(.16,1,.3,1) |
| Team carousel | wheel/drag, continuous | curved, tilted, draggable marquee; cards flip on hover; caption cycles with blurred chars | chars opacity 0, blur 10px, .4s, stagger .03 |
| Footer wordmark | scroll in, once | logo paths scale 0→1 from the bottom | 1.5s `gl.inOut` (= cubic-bezier(.2,0,0,1)), stagger .05 from edges |
| Page change | navigation | view-transition crossfade | browser default |

Custom eases [M]: `gl.inOut` = cubic-bezier(.2,0,0,1). CSS transitions use
cubic-bezier(.16,1,.3,1) as the expo-out stand-in.

### 2.6 Inner pages worth borrowing [O]
- **Solution, "The Numbers Speak For Themselves":** a bento grid of stat tiles
  cycling `#dfe9fa`, `#000`, `#fdf3f6`, `#000`, `#f0f3fa`, `#f8f9fc`; italic
  serif numerals top-left, label bottom-left.
- **Solution, "Our Performance Pillars":** numbered accordion panels; the open
  one turns ink-dark with four sub-cards.
- **Careers listing:** wide cards (`#fbfcff`, gradient border, 1.6rem radius)
  with title, pill chips and a round arrow button (`#dfe9fa4d`).
- **Careers, "What To Expect":** sticky heading on the left; on the right,
  numbered steps in outlined circles joined by a blue line.
- **Culture, "Unique in every way":** pastel cards with an icon disc, italic
  plus sans title and sparkle-bulleted lists.

### 2.7 Character [O]
Bright, airy and calm. Large regular-weight sans headlines with one italic
serif phrase, centred on generous white space. Colour comes from soft pastel
washes and blurred spheres, never from saturated fills. Ink-black is kept for
emphasis (inverted tiles, footer). Motion is slow and eased (expo-out
everywhere), arriving in masked lines rather than fades, and it settles fast.

---

## 3. Design system for the portfolio

### 3.1 Fonts (next/font/google, self-hosted, `display: swap`)
| Role | Reference | Substitute | Why |
|---|---|---|---|
| Sans, all UI and body | Suisse Intl (commercial) | **Geist** (OFL), 400 and 500 | Closest freely licensed Swiss neo-grotesk by eye: similar proportions, flat terminals, tight spacing at display sizes |
| Accent words and numerals | PP Eiko Italic (commercial) | **Instrument Serif Italic** (OFL) | Closest free match by eye: a high-contrast, slightly condensed display italic |

Sora, Inter and JetBrains Mono are dropped (three families become two).
Mono labels become small sans labels, as on the reference.

### 3.2 Type tokens [I, slopes from the reference]
The reference's vw-scaled root makes text tiny between 768 and 1280 (body
≈10px at 1024). I keep its proportions at 1440 to 1920 and add floors:

| Token | Value | 390 | 1440 | Line height | Tracking |
|---|---|---|---|---|---|
| `--fs-display` | clamp(2.75rem, 6.46vw, 7.75rem) | 44 | 93 | .9 | -.04em |
| `--fs-h1` | clamp(2.25rem, 3.65vw, 4.375rem) | 36 | 52.5 | 1.0 | -.03em |
| `--fs-h2` | clamp(2.25rem, 2.81vw, 3.375rem) | 36 | 40.5 | 1.05 | -.03em |
| `--fs-h3` | clamp(1.5rem, 2.5vw, 3rem) | 24 | 36 | 1.2 | -.02em |
| `--fs-numeral` | clamp(3rem, 4.2vw, 5rem) | 48 | 60 | 1.0 | -.02em |
| `--fs-lead` | clamp(1.125rem, 1.25vw, 1.5rem) | 18 | 18 | 1.35 | -.01em |
| `--fs-body` | 1rem (1.0625rem ≥1280) | 16 | 17 | 1.6 | 0 |
| `--fs-label` | .875rem | 14 | 14 | 1.4 | -.01em |
| `--fs-nav` | clamp(.9375rem, .83vw, 1rem) | 15 | 15 | 1 | 0, weight 500 |

Long-form text (bullets, case summaries, impact narratives) uses
`--fs-body` at a 68ch maximum measure: the BRIEF §3 reading rule, not the
reference's 14px.

### 3.3 Colour tokens
All of §2.2 [M], plus [I] additions for accessibility:
- `--muted: #5b6066` for secondary text (6.4:1 on white). The reference's
  light greys fail AA for body text.
- `--on-dark-muted: rgba(255,255,255,.64)` (≥7:1 on `#111212`); the
  reference's .4 fails AA.
- `#76a8f3` and the pastel numeral colours are **decorative only** (2.5:1);
  metric numerals stay ink, as in the reference's bento.
- Links: ink with a .25em-offset underline that drops on hover [M]. No blue
  link text is needed.
- Focus: `2px solid currentColor`, 3px offset, so it shows on white,
  pastel and ink [I].
- `theme-color: #ffffff` [I]. The reference uses `#000`; white matches the
  first viewport and the status bar on phones.
- Contribution levels: `#edeff2`, `#dfe9fa`, `#b0ccfc` [M], `#76a8f3` [M],
  `#3d6fd1` [I].

### 3.4 Layout tokens
- Gutter [M/I]: `6.67vw` (min 16px) below 768; `8vw` from 768 to 1279 [I,
  to give the denser sections room]; `16.15vw` (= 31rem) from 1280 [M];
  content capped at 1300px [M].
- Section padding: clamp(4rem, 6vw, 6.5rem) [I, ≈ reference 8rem].
- Radius: cards clamp(1rem, 1.2vw, 1.4375rem) [M range]; pills 9999px [M].
- Buttons: 48px pill, min-width 140px, padding 0 24px [M at 1920], ink label
  on gradient-primary (primary) or gradient-secondary (secondary).
- Full-height stages use `svh` (BRIEF §14).
- `.glass` (the single primitive, per CLAUDE.md) becomes the reference
  strip: white 70%, 1px hairline, blur 8px. Budget: nav plus three hero stat
  cards = 4 live blurs at most per viewport (rule: ≤ 6).

### 3.5 Motion tokens and rules
- `--ease-out: cubic-bezier(.16,1,.3,1)` [M], `--ease-gl: cubic-bezier(.2,0,0,1)` [M],
  `--ease-overshoot: cubic-bezier(.34,5.56,.64,1)` [M].
- Durations: hover .4s [M]; text reveal 1.2s, stagger total .6s [M]; section
  headers 1.6s [I, shortened from 2.5s; expo-out is visually settled by
  ~.5s]; image reveal 2s [I, from 3s]; odometer 2s [M]; hero entrance 1.2s,
  everything settled by 1.5s [I, BRIEF §3].
- Transform, opacity and clip-path only (DESIGN.md rule). That rules out the
  reference's `grid-template-rows` accordion (see §5).
- **No hidden state without JS:** an inline `<head>` script adds `js` to
  `<html>` before first paint; hero entrance keyframes run only under
  `.js`. Scroll reveals hide content only after a client controller adds
  `reveal-ready`, so a failed bundle leaves everything visible. The content
  check's no-JS run must report 0 hidden blocks (today: 152, from `Reveal`'s
  server-rendered `opacity: 0`).
- **Reduced motion:** no transforms, no scrub, no sticky stage, Lenis off,
  view transitions off, numbers static, all content visible at once.
- Implementation: CSS keyframes and transitions driven by one shared
  IntersectionObserver (the existing `useInView` pattern), and a small rAF
  scroll handler for the hero. No GSAP: every measured pattern above is
  transform/opacity work CSS can do, and GSAP plus its plugins would add
  roughly 50 KB gzipped.
- Words are split at render time into inline mask spans. The words stay real
  text (no aria-hidden), so screen readers and the content check read the
  same sentence.
- Page transitions: React `<ViewTransition>` ships with Next 16.3's App
  Router with no flag (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`).
  One root crossfade for home ↔ `/impact/*`, ≈300ms, off under reduced motion.

---

## 4. Section mapping

| My section | Reference pattern | Treatment |
|---|---|---|
| Skip link | — | Kept, restyled as an ink pill |
| Nav: FA monogram, 7 anchors, Download Resume | Navbar strip [M] | Floating centred `.glass` pill: FA monogram, 7 anchors (rolling-label hover and pink dot), Download Resume as the gradient CTA. Compacts after 10px; hides on scroll down after one viewport, returns on scroll up. Mobile: full-width pill and two-bar toggle; the menu opens in place with a clip-path reveal and 36px links. Links stay in the DOM when closed (`inert`). Enters with a 1.2s expo-out drop |
| Hero | Hero headline and stat orbit [M/O] | See 4.1 |
| Logo strip (4 employers, 2 schools) | Pill tags [M] | Two labelled rows ("Experience", "Education"). Each org is a white pill with its logo or the Z mark, name and descriptor. Static: no marquee, so recruiters can read it |
| Impact (8 metrics) | Solution bento [O] | Two employer groups, each a heading (employer name, dates) over a 3-column bento of four tiles (spans 2+1 / 1+2, mirrored for the second group). Tiles cycle the measured surfaces, ink tiles inverted. Italic serif numerals roll in as an odometer ending on the exact value; label, detail and a round arrow button. Each tile stays one link with today's `aria-label` |
| Selected Work (4) | Solution "Industries" image grid [O] and the image-reveal pattern [M] | Asymmetric 2×2: right column offset down. 4:3 preview frames (top-anchored) reveal with scale 1.15→1; hover zooms the image 1.04. Below each: subtitle label, title at h3, summary, then "Open case study" or the Zomato docs toggle (same button, same list) |
| Prototypes / Products (4) | Capability panels [M] | Four stacked panels on `#fbfcff` with gradient borders. Name in italic serif at h3, tagline in sans, CSS-counter numeral 01–04 at right in the measured colours. Hover or focus (or scrolling into the centre on touch) activates a panel: pastel wash fades in, blurred spheres rise, numeral recolours. All panels stay expanded (see §5). Signal adds subtitle and year, highlights, a real screenshot of the live demo, and Live demo plus View repo pills. The other three stay single links with today's text order, so their accessible names don't change |
| Experience (Domains + 4 roles) and Education | Careers "What To Expect" [O] | Two columns from 1024: sticky left column (kicker, "Experience", Domains pills); right column is a numbered timeline (outlined circles, italic numerals, 1px blue line). Each role: title, company line exactly as today, dates, summary, sparkle-bulleted body at 16–17px, "Read the case" links. Education repeats the pattern below with its own heading and line. Items slide in once and never dim afterwards |
| Achievements (2) | Statement captions [O/M] | One centred statement per achievement at `--fs-h1`, a pink sparkle and the year beneath. Words blur in (10px→0, .4s, stagger .03; words, not chars). Rendered once: the duplicate pinned copy goes (§6) |
| GitHub | Listing cards [O] | Calendar on a `#fbfcff` panel with gradient border; total as an italic numeral; blue level ramp; data fetching untouched. Five repos as wide listing rows (name, description, View repo, round arrow). Same link texts |
| Skills & Credentials | Culture benefit cards [O] and pill tags [M] | Intro sentence as lead text; four pastel group cards (italic group name, white pill chips with brand marks); certifications as sparkle-bulleted list rows |
| Get in touch + Footer | Footer [M/O] | Ink `#111212` block. "Get in touch" at `--fs-h2` with the title and location line, then the four contact links as large rows (pink dot and shift on hover) and a Download Resume pill. Giant aria-hidden "FARAZ ALI" wordmark at 10% white that rises letter by letter (1.5s `--ease-gl`, stagger .05 from the edges). "Menu" column with the seven anchors, then the © line |
| `/impact/*` | Header + two-column copy + bento [O] | Same nav (anchors become `/#…`) and footer. "Back to portfolio" kept. Metric `h1` at `--fs-h1` with the leading figure in italic serif, outcome as lead text. Meta grid as pastel bento tiles. Narrative sections as two-column rows (heading left, body right) split by drawn dividers. Confidentiality note and contacts on an ink tile |

### 4.1 Hero, first viewport and stat orbit
- **First viewport (1440×900 and 390×844):** nav; a 168px circular portrait
  (gradient ring, soft blue halo) where the reference has its small sphere;
  "Hello there!" as a sparkle label; **"*I am* Faraz Ali."** at
  `--fs-display`, centred; "Product Manager" at `--fs-h3`; **Get in touch**
  (gradient-primary) and **Download Resume** (gradient-secondary) pills.
  The curved horizon arcs behind are pure CSS (BRIEF §4.5).
- **Entrance (≤1.5s):** nav drops in; headline words rise in masks (1.2s,
  stagger total .3s); title and pills fade/scale in from .2s. Name and both
  buttons are legible and clickable by ~0.6s.
- **Scroll stage (motion only):** a sticky 100svh stage, about 180svh tall.
  As you scroll, the headline fades out, the portrait slides down and scales
  ×2.1 into the centre of the gradient orbit ring, and the three stat cards
  (frosted, blur 16px) fade in around it with .05s stagger. This is the
  reference's signature hero, rebuilt with my portrait in place of its planet.
- **Stat strip (BRIEF §4.2), exact values and labels, same links as their cards:**
  1. **68%**: Applications auto-cleared → `/impact/risk-scoring/`
  2. **19.1%**: Sign-up conversion → `/impact/signup-conversion/`
  3. **−99%**: Manual reconciliation effort, with no payment mismatches → `/impact/razorpay-route/`

  (One per lever: compliance automation, growth, payments. Both employers.)
- **Below the stage:** the introduction paragraph as centred lead text (max
  ~60ch), the contact row (phone, email, LinkedIn, GitHub), then the logo
  strip.
- **Static (reduced motion / no JS):** no sticky stage. Hero as above, then a
  static orbit (ring, pastel CSS sphere, three cards), then the intro.

### 4.2 Set-apart words (existing words only, never changed)
"*I am* Faraz Ali.", "Proof in the *numbers*", "Selected *Work*",
"Prototypes I've *built*", "Building *in public*", "Skills *&* Credentials",
"Get *in touch*", and the leading figure of each case-page `h1`. Product
names render in the serif italic. Section kickers become sparkle labels.

### 4.3 Animations to reproduce (approve or strike)
1. Masked word reveal for the hero headline and every section heading.
2. Navbar drop-in, compaction, hide-on-scroll-down, rolling-label hover with
   pink dot.
3. Hero scroll stage: portrait into the orbit ring, stat cards in.
4. Odometer digits on the eight Impact numerals and the three hero stats.
5. Image reveal (scale 1.15→1) on case-study previews and the Signal screenshot.
6. Capability-panel hover state on Products (wash, spheres, numeral colour).
7. Item stagger (opacity, 70px rise) for timeline entries, cards and listing rows.
8. Drawn divider with the elastic pointer bend (pointer:fine only) between
   case-page sections and in the footer.
9. Pill button overshoot hover and ripple.
10. Footer wordmark letters rising.
11. Achievement statements blurring in word by word.
12. Lenis at the measured settings (duration 1.5, off on touch and under
    reduced motion), anchors offset below the nav via `scroll-margin-top`.
13. Crossfade view transition between home and case pages.

---

## 5. Deliberate deviations from the reference
| Reference | Mine | Why |
|---|---|---|
| Loader overlay | none | BRIEF §3 |
| Mouse-follower cursor | none | BRIEF §11E: cursor effects |
| Planet videos, team photos, layered imagery | portrait, CSS arcs and spheres, real Signal screenshot | no such assets; BRIEF §4.4–4.5, §12 |
| Curved draggable photo carousel | static asymmetric grid | a marquee hides and duplicates content |
| Accordion panels (`grid-template-rows`, others collapsed) | always-expanded panels; only the surface animates | discoverability for skimmers; DESIGN.md allows transform/opacity/clip-path only |
| 2.5s header reveals, 2s nav entrance | 1.2–1.6s | first viewport settled by 1.5s (BRIEF §3) |
| 14px body, light-grey copy, vw-only scaling | 16–17px body, AA greys, clamped floors | BRIEF §3 and §14 |
| Char-level blur captions that auto-cycle | word-level blur, once, no cycling | fewer DOM nodes, no constant motion |
| Impact as one grid of six | two employer groups of four | BRIEF §8C keeps grouping by employer |
| Pinned / scrubbed sections other than the hero | none | native scroll, recruiter skim speed |
| theme-color `#000` | `#ffffff` | matches the first viewport |
| Navbar compacts after 10px (animates left/right) | no compaction; drop-in and hide/show kept | the compaction animates layout (DESIGN.md: transform, opacity, clip-path only) |
| Image zoom on hover | none on case-study previews | they are not links (BRIEF §11D) |
| Stat cards blur 16px | the single `.glass` primitive (8px) with the cards' tint | one glass primitive (CLAUDE.md) |

---

## 6. Findings on the current site
- **Achievements rendered twice:** `AchievementsScroll` renders a desktop
  pinned copy (`hidden md:block`) and a mobile copy (`md:hidden`). The hidden
  copy is `display:none`, so already out of the accessibility tree. The
  redesign renders one copy.
- **Hidden without JS:** 152 home-page text blocks are invisible without
  JavaScript (`Reveal` server-renders `opacity:0`). Fixed by §3.5.
- **GitHub calendar:** client-side fetch from a public API with an image and
  link fallback. No environment variable; works locally. Left as is; the
  content check serves it a fixed fixture.
- **No Vercel-only environment variables** are needed: the build passes with
  none (`NEXT_PUBLIC_BASE_PATH` is optional, for GitHub Pages).

---

## 7. Local vs live content (recorded, not resolved)
`node scripts/content-check.mjs compare --url=https://faraz-website.vercel.app`
against the local baseline (reduced motion, 1440): home 95 missing or changed
/ 129 new; case pages 2–16 each. Grouped:
- **Hero intro and meta description:** rewritten in the October sync.
- **Impact cards:** six of eight values or labels differ. Local:
  68%, 61%, 30+, ~120h / 30h, 12%, 19.1%, −99%. Live has different figures
  and labels for the KYC, access, rework, proctoring, referral and
  reconciliation tiles, and a waitlist tile instead of the sign-up tile.
- **Built:** heading "Prototypes I've built" (local) vs "Products I've
  shipped" (live); Signal subtitle and description; Cairn tagline and
  description.
- **Experience:** company lines (descriptor and location), role summaries
  (local only), every bullet reworded, Healthmug role title; Domains chips
  differ.
- **Achievements:** two (local) vs three (live).
- **Skills:** four resume groups (local) vs five hubs plus "All skills (92)"
  across six categories (live); intro sentence differs; certifications two
  (local) vs five (live, per the brief).
- **Repos:** Signal and cairn descriptions differ.
- **Case pages:** every page's meta rows and several headings and sentences
  differ (October restructure).

The live site also carries client-identifying wording the October sync
removes (§0, item 1).

---

## 8. Baseline measurements
- Build, `npm run lint`, `npx tsc --noEmit`: pass after a clean `npm ci`.
  Pre-existing: the folder syncs (likely iCloud) and left 866 "… 2"
  duplicates in `node_modules` that broke `tsc`. A clean reinstall fixed
  that. Untracked duplicates in `app/`, `lib/` and `public/` were left
  alone (`lib/ogImage 2.tsx` differs from `lib/ogImage.tsx`). Local Node is
  24.15; the project pins 22.
- Content check: 0 missing or changed across all four modes (reduced and full
  motion at 1440, reduced at 390, no JS); 152 blocks hidden without JS.
- Lighthouse (median of 3, local static export): see table below.
- Before screenshots: `docs/redesign/screenshots/before/` (home at
  1440/1024/768/390/320, risk-scoring at 1440/390; viewport and full page).

| Page, preset | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home, mobile | 85 | 100 | 100 | 100 | 4.34s | 30ms | 0 |
| Home, desktop | 99 | 100 | 100 | 100 | 0.85s | 0ms | 0 |
| risk-scoring, mobile | 97 | 100 | 100 | 100 | 2.67s | 25ms | 0 |
| risk-scoring, desktop | 100 | 100 | 100 | 100 | 0.59s | 0ms | 0 |

Targets after the redesign (BRIEF §15): Accessibility and Best Practices
stay at 100; Performance no lower than 80 / 94 / 92 / 95; CLS ≤ 0.1.

---

## 9. Could not verify
- Motion "feel" beyond what the compiled code states: Section 5 of the brief
  has no notes yet, so the animation list in §4.3 is my reading of the code
  and screenshots.
- The reference's font files were not downloaded (licence), so the
  substitutes are matched by eye from screenshots.
- Exact grey of the reference's secondary copy (rendered over gradients);
  replaced by an AA token anyway.
