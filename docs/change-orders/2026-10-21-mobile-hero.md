# Change order V7: mobile hero and layout (21 October 2026)

- Source: Faraz's brief "Fix the mobile hero animation and mobile layout issues" (phases 1 to 3).
- Base: branch `mobile-fixes-2026-10`, cut from `origin/main` at `1a4954c` (PR #2 merged); working tree clean apart from 23 untracked iCloud copies (`* 2`, `* 3`), which stay untouched.
- Status: **approved 21 October 2026** as proposed: pinned compact stage, 540px gate target (560px fallback), static layout without the ring and sphere. 3f items 2, 5 and 7 are approved for phase 3.
- Missing inputs: the brief's screenshot paths, iPhone model, iOS version and Reduce Motion setting are still placeholders. The diagnosis below doesn't depend on them, but please send the model and the Reduce Motion setting.
- Evidence lives in `.scratch/mobile/`, which is git-excluded. It holds the scripts `diag.mjs`, `audit.mjs`, `audit2.mjs` and `proto.mjs`, the data `diag.json` and `proto.json`, and screenshots in `before/`. Measurements used Playwright 1.63 WebKit with its iPhone profiles, which apply Safari's visible viewport, and Chromium for Pixel 7, all against the production build (`out/`).
- No Xcode is installed (only the Command Line Tools), so the iOS Simulator isn't available. Real-Safari checks are left to you, with the checklist after each phase.

## 1. Diagnosis

### Root cause (confirmed)
The scroll stage only runs where the screen is at least 750px tall. iPhone Safari's visible viewport is shorter than that on every current model except the 16 Pro Max. So the stage never starts, and you get the static layout: the portrait stays in the hero and an empty sphere sits in the ring with the cards below. That is screenshot B.

| Profile (WebKit unless noted) | Visible viewport | Gate | Mode |
|---|---|---|---|
| iPhone SE (1st gen) | 320×568 | false | static |
| iPhone 13 Mini | 375×629 | false | static |
| iPhone 13 / 14 | 390×664 | false | static |
| iPhone 15 Pro | 393×659 | false | static |
| iPhone 14 Pro Max | 430×740 | false | static |
| iPhone 16 Pro Max | 440×763 | **true** | live |
| iPhone 13 landscape | 750×342 | false | static |
| Pixel 7 (Chromium) | 412×839 | **true** | live |
| Laptop | 1366×650 | false | static |
| Desktop | 1440×900 | true | live |

The old checks passed because they used screen sizes (390×844), not Safari's visible viewport.

### Answers to the five questions
1. **The gate.**
   - CSS: `.js` plus `@media (prefers-reduced-motion: no-preference) and (min-height: 750px)` (`app/globals.css`, Hero stage). JS: `HERO_LIVE_QUERY` in `HeroStage.tsx` is the identical string. Wherever JS runs, `.js` is present too.
   - Both test the media-query viewport height. In WebKit, Blink and Gecko alike, that is the initial containing block, which the CSS working group resolved to be the **small viewport**: the height with Safari's toolbar showing ([csswg-drafts#6453](https://github.com/w3c/csswg-drafts/issues/6453); Chrome's [URL bar resizing](https://developer.chrome.com/blog/url-bar-resizing) notes it matches Safari).
   - So the result shouldn't change as the toolbar collapses. I can't confirm that on a device here, so the new gate is also chosen not to sit between any common iPhone's toolbar-shown and toolbar-hidden heights (section 2).
2. **Progress and range.**
   - Where the stage is live, progress runs cleanly from 0 to 1. On the iPhone 16 Pro Max at 0, 25, 50, 75 and 100% of the stage:

     | Stage | `--pc` | `--pm` | `--pr` | `--k0` | `--k4` |
     |---|---|---|---|---|---|
     | 0% | 0 | 0 | 0 | 0 | 0 |
     | 25% | 1 | 0.75 | 0 | 0 | 0 |
     | 50% | 1 | 1 | 1 | 0.60 | 0 |
     | 75% | 1 | 1 | 1 | 1 | 0.65 |
     | 100% | 1 | 1 | 1 | 1 | 1 |

     `--dy` is 5px and `--sc` 1.329. Pixel 7, a 390×844 probe and desktop 1440×900 behave the same.
   - Where the stage is static, no variables are set at all.
   - The range is never zero or negative: the stage is 190svh tall, and `innerHeight` stays below 1.9 times the small viewport.
   - **Second defect:** the range is `stage height − innerHeight`. `innerHeight` grows by about 80 to 100px when Safari's toolbar collapses, so progress would jump mid-scroll. For example, 300px into the stage on a 16 Pro Max reads 0.44 with the toolbar showing and 0.50 with it hidden.
3. **`html.js` at first paint.** Yes. An init script recorded `html.js` on the first animation frame in every case. The class is set by the synchronous inline script in `<head>`.
4. **Scroll source.**
   - Lenis is off on touch devices (`pointer: coarse` matched on every phone profile; no `lenis` class). HeroStage listens to native `scroll` events on `window`, one update per animation frame.
   - iOS Safari fires those during touch and momentum scrolling. The last event lands at rest, so the final state is reached after a flick.
   - On desktop, Lenis moves the native scroll position, so the same listener runs there too.
5. **Timing and errors.**
   - Geometry is measured once after hydration, then on every `resize` and on a gate change. The portrait and ring have fixed CSS sizes.
   - The portrait's resting position depends on the hero copy's height, which can shift a few pixels when the web fonts swap in. The code doesn't re-measure on `document.fonts.ready`.
   - Nothing is swallowed: there's no try/catch in the path, and no page errors on any profile.

## 2. Proposed changes

### 3a. Hero scroll stage on phones (phase 2)
- **Compact phone composition** (under 560px wide), prototyped with injected CSS in `.scratch/mobile/proto.mjs`. Hierarchy is unchanged: portrait, greeting, name, title, both buttons, contact row.
  - **Opening:** tighter top clearance (just under the nav), portrait 112 → 96px, smaller gaps between the lines, and buttons side by side where they fit (390px and up).
  - **Final:** ring `min(11rem, 44vw)`, so the portrait scales about 1.1×, and compact strength cards.
  - **Sticky frame:** `100svh`, so Safari's `vh` (the toolbar-hidden height) isn't used for layout.
- **Measured heights** (opening includes the nav clearance):

  | Width | Opening needs | Final needs |
  |---|---|---|
  | 320px | 607px (contact pills in three rows) | 540px |
  | 340 to 375px | 555px | 510 to 527px |
  | 390 to 440px | 499px | 522 to 540px |

- **New gate.** The desktop clause is unchanged; a phone clause is added:

  ```
  (prefers-reduced-motion: no-preference) and (min-height: 750px),
  (prefers-reduced-motion: no-preference) and (orientation: portrait)
    and (min-width: 340px) and (max-width: 559px) and (min-height: 540px)
  ```

  - **540px:** I'll trim the composition to fit 375×540 so that the iPhone SE (3rd gen), at about 375×548 visible, is included.
  - **No straddling:** no common iPhone then straddles the gate, even if Safari ever measured the toolbar-hidden height. Every model except the SE has at least 629px with the toolbar showing.
  - **Static:** 320px widths (the original SE, Display Zoom) and all landscape phones get the static layout.
  - If the trimmed composition can't fit 540 cleanly, the fallback is 560 with the SE static. The final values and reasoning go in DESIGN.md.
  - The CSS media query and `HERO_LIVE_QUERY` change together and stay identical.
- **Stable progress.**
  - The range becomes `stage height − sticky frame height`, both in `svh`, so toolbar-only height changes can't move progress.
  - Geometry is recomputed on width or orientation changes, on gate changes and on `document.fonts.ready`; height-only resizes are ignored. The portrait's destination stays measured from the ring's geometry.
- **Shorter pin on phones:** the stage is 150svh instead of 190svh, about 330px of pinned scroll on an iPhone 13 instead of 600px. Desktop stays at 190svh.
- **Desktop unchanged:** every phone rule sits under `max-width: 559px` or in the new gate clause.

#### Pinned compact stage vs non-pinned scroll-linked version (phones)

| | Pinned compact stage (recommended) | Non-pinned, scroll-linked |
|---|---|---|
| Portrait into ring | Native: the frame is still, only transforms change | Needs JS to counter-translate the portrait against the scroll. iOS scrolls on the compositor ahead of the main thread, so it jitters during momentum. |
| Toolbar collapse | Stable with `svh` frame and range | Positions shift with the dynamic viewport |
| Code | CSS gate and phone composition plus the range fix; same component | New animation path for phones only |
| Recruiter cost | About 330px of pinned scroll | No pin, but the portrait can't land in the ring without the same tricks |

I recommend the pinned compact stage. It is the same mechanism desktop already proves, it is native-smooth on iOS, and it costs only a short pin.

#### Static layout (reduced motion, short or narrow screens, landscape, no JS)
- **No empty sphere:** the ring and sphere are hidden, and the five cards follow the hero as a deliberate centred grid.
  - Phones: two per row, the fifth across both columns, and one column under 340px.
  - Wider screens: three then two, centred.
- **Laptops:** 1366×650 currently shows the empty sphere (`before/laptop-1366x650-motion-2-orbit.png`) and gets the same grid.
- **Visible regardless:** the cards never depend on JS to be shown.

### 3b. Strength cards on phones (phase 2)
- **Order and grid:** content and order are unchanged, and the ring stays in the same grid as the cards.
- **Sizing:** cards size to their content (titles 20px serif italic, tags 14px), with no empty band between ring and grid.
- **Slide-in:** on phones the cards rise from below only, with no sideways slide, so nothing can extend past the viewport. That's checked with `scrollWidth` on every profile.

### 3c. Experience and Education tiles (phase 3)
- **Evidence** (`audit.mjs`; `before/tiles-390.png`):
  - At 320, 375 and 390px each pill is 114, 137 or 144px wide around a 40px logo.
  - "Newton School", "MDI Murshidabad" and "KIIT University" take two lines.
  - "E-commerce" breaks at its hyphen.
- **Proposal:**
  - one column under 480px, so every name and descriptor fits on one line;
  - two columns from 480px, and the current flex row from 640px;
  - logos 40 → 36px with tighter gap and padding, keeping their aspect ratio and alignment;
  - descriptors set to `white-space: nowrap`;
  - names keep their weight and size over the descriptors.

### 3d. Impact descriptions (phase 3)
- **Evidence:** single-word or orphaned last lines.

  | Width | Orphaned last lines |
  |---|---|
  | 320px | 30+ "access.", 19.1% "effort." |
  | 375px | 12% "tests." |
  | 390px | 68% "8.", 30+ "access.", 12% "tests." |
  | 430px | −99% "handling." |

- **Proposal:**
  - `text-wrap: pretty` on the descriptions, as progressive enhancement;
  - a small render helper in `Metrics.tsx` that wraps number-and-unit pairs in a non-breaking span, for example "under 8", "72 hours", "3 weeks", "0 to 1" and "A/B tests";
  - the DOM text stays identical (spans only), and normal wrapping is kept where a pair can't fit.
- All eight descriptions will be re-checked at 320, 375, 390 and 430px.

### 3e. Mobile typography and spacing (phase 3)
- **About phrases:**
  - The `bioEmphasis` phrases wrap today: "build AI prototypes myself" at 320 to 430px, and "nearly doubled sign-up conversion" at 375 and 390px.
  - The widest phrase is 251px against a 277px column at 320px, so they can all take `white-space: nowrap`, as the `bioAccents` phrases already do.
- **Contact row:** at 320px it wraps to three rows in the hero and the footer (GitHub alone on the last row). Slightly narrower pill padding under 360px gives two rows and keeps the 44px tap height.
- **Headings:** none is wider than its box at any width, and the italic word masks keep their 0.12em/0.1em room.
- **Safe areas:** the viewport meta has no `viewport-fit=cover`, so Safari keeps content inside the safe areas. No change.

### 3f. Other sections: findings (fix only what you approve)

| # | Section | Finding (evidence) | Proposal |
|---|---|---|---|
| 1 | Nav anchors | On touch, anchors scroll natively (Lenis off). `.section` has `scroll-margin-top: 5.5rem`. After a jump from the menu the heading sits at 152 to 194px; the nav pill (68px) hides on downward scroll. | No change |
| 2 | Impact tabs | Each tab takes its own row at every phone width (320 to 430px), about 120px together before the tiles. | Optional: two tabs side by side from 360px, with the dates on a second line |
| 3 | Selected Work carousel | Fits; card 238px at 320px; controls inside the column; drifts or pauses as designed. | No change |
| 4 | Built cards | Tap opens each card (no hover needed); no clipping at 320, 375, 390 or 430px (open 412/386/360/300px). | No change |
| 5 | Experience timeline | At 320px the Domains pills stack one per row for Zamplitude and HealthKart (three rows). | Optional: pill text 14 → 13px under 360px |
| 6 | Education, Skills, Certifications | No overflow; cards fit. | No change |
| 7 | Footer | GitHub alone on a third row at 320px. | Same as the 3e contact-row fix |
| 8 | Whole page | `scrollWidth` equals `clientWidth` on every profile. | No change |

## 3. Phases
- **Phase 2** (after approval): 3a and 3b, with DESIGN.md (gate values and reasoning), then verify and commit on `mobile-fixes-2026-10`. No push.
- **Phase 3:** 3c, 3d, 3e and the approved 3f items, then verify, commit, and write the final report.

## 4. Verification plan
- **Profiles:** WebKit iPhone SE, SE 3rd gen (375×548 custom), 13 Mini, 13, 15 Pro, 14 Pro Max, 16 Pro Max, a 320px Display Zoom case, iPhone 13 landscape, and Pixel 7 (Chromium). Each runs with motion allowed and with `reducedMotion: 'reduce'`.
- **Toolbar simulation:** shrink the viewport height by about 90px mid-scroll and back. Pass: no mode flip, and no jump in progress or portrait position.
- **Desktop:**
  - 1440×900 before and after screenshots at the same scroll positions, which must match;
  - 1366×650 static layout.
- **Overflow:** `scrollWidth` vs `clientWidth` on every viewport, naming any offending element.
- **Checks:** `npm run check:content`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run verify` and `node scripts/content-check.mjs compare` (zero missing or changed). The baseline was recaptured on 18 October and the build matches it, so no new baseline is needed.
- **Screenshots:** `.scratch/mobile/before/` and `.scratch/mobile/after/`.

## 5. Questions
1. Approve the pinned compact stage and the gate above (540px target, 560px fallback)?
2. Approve the static layout without the ring and sphere?
3. Which 3f items should I fix: 2 (tabs side by side), 5 (Domains pill size), 7 (footer contact row, included with 3e)?
4. Your iPhone model and Reduce Motion setting, to add to the checklist.

## 6. Phase 2 outcome (21 October 2026)

3a and 3b are implemented in `app/globals.css` (hero block) and `components/HeroStage.tsx`, with the measured gate recorded in DESIGN.md ("Hero gate").

- **Gate:**
  - The phone clause is final at 360 to 559px wide, 540px tall, portrait.
  - The 340px width from the plan moved to 360: below 360px the buttons wrap and the opening clips at 540px.
  - The CSS media query and `HERO_LIVE_QUERY` are identical.
- **Profiles** (`.scratch/mobile/verify2.mjs`, WebKit plus Chromium for Android; each run with motion allowed and with reduced motion): 22 cases plus 5 corner cases at 540px tall, no failures.
  - **Live:** SE (3rd gen) at 375×548; 13 Mini; 13; 15 Pro; 14 Pro Max; 16 Pro Max; Android 360×640; Pixel 7.
  - **Static:** 320px widths; landscape; every reduced-motion run.
  - **Results:** the opening and final composition sit inside the viewport and clear of the nav, and no card touches the ring. The portrait is centred in the ring to within 2px, and all five cards are fully shown at the end. A fast flick still ends at progress 1, and nothing overflows sideways.
- **Toolbar:**
  - A Safari-style change (`innerHeight` +90px with a `resize` event, layout unchanged) leaves progress unchanged in every live case.
  - Resizing the emulator viewport by −90px and back returns the same state. The mode only flips where the reduced height falls below the 540px gate, which a real toolbar can't do, because the gate reads the small viewport.
- **Desktop:**
  - At 1440×900, every stage position (0 to 100%) is pixel-identical before and after.
  - The About section differs by no pixel over 16/255 (anti-aliasing in a 219×32px box).
  - 1366×650 shows the new static layout: the hero, then three cards and two, with no ring or empty sphere.
- **Pinned scroll:** 274 to 420px on phones (50svh), against 600 to 760px before.
- **Screenshots:** `.scratch/mobile/before/` and `.scratch/mobile/after/`.
- **Environment:** iCloud "Optimise Mac Storage" had offloaded 29,239 files in `node_modules`, plus source files, `.git` objects and `.next`, and wasn't restoring them on request. Repository files were brought back by reading them, `node_modules` was reinstalled with `npm ci` from the lockfile (no new dependencies), and `.next` was cleared.
