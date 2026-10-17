# Change order V4: site fixes and improvements (17 October 2026)

- Source: Faraz's brief "Portfolio site: fixes and improvements" (11 items, 18 screenshots).
- Base: `redesign/capslock` at `a824903`. Proposed branch: `site-fixes-2026-10`, cut from it, **changes left uncommitted** (brief: don't commit, push or deploy).
- Status: **approved 17 October 2026** with the recommended answers: Q1 the open Built card stays open when the pointer leaves the list; Q2 no whole-card link for Zomato, its documents toggle stays; Q3 no dates on certificate cards; Q4 branch `site-fixes-2026-10` cut from `redesign/capslock`, everything left uncommitted.

---

## 0. A root cause behind several screenshots

The screenshots come from the dev server on `http://192.168.29.90:3000` (this Mac's LAN address). **Next 16 blocks dev assets requested from any origin other than `localhost`** (`allowedDevOrigins`, `node_modules/next/dist/docs/.../allowedDevOrigins.md`). On that address the page's JavaScript never loads. So:

- the GitHub graph sits on its loading skeleton forever (Screenshot 11);
- the hero shows its pre-paint scroll-stage layout without the client code that drives it. The copy stays pinned while you scroll, and the stat cards never appear, leaving the big gap above the bio (Screenshot 1);
- no reveals, odometers or nav behaviour run.

**Fix:** in `next.config.ts`, set `allowedDevOrigins` to this machine's LAN IPv4 addresses, read from `os.networkInterfaces()`. It works on any network without hard-coding `192.168.29.90`, and has no effect on the static build or on Vercel.

## 1. Shared building blocks (built once, reused)

| Block | Used by | What it is |
|---|---|---|
| **Link helper** `lib/links.ts` | Items 2, 3, 6, 9, 10, 11 | `linkProps(href)` adds `target="_blank" rel="noopener noreferrer"` to `mailto:` and external `http(s)` links. It leaves `tel:`, `#anchors` and same-site paths alone. `identity.emailHref` holds the email address once, for every mailto link and the copy pill. |
| **Contact row** `components/ContactRow.tsx` (replaces `ContactLinks`) | Items 3, 11 | Two text pills (phone, email-copy) and two round icon buttons (LinkedIn, GitHub), with a `tone="light" \| "dark"` variant. |
| **Carousel** `components/Carousel.tsx` | Items 6, 10 | A native horizontal scroll-snap track with prev/next, pause/play, autoplay and pause rules, and a still row when everything fits. No library. |
| **Italic-figure room** (CSS, `app/globals.css`) | Items 5, 9 | One rule giving italic serif figures room past their advance width, in `em`, with a comment explaining why. |
| **Accordion card** (inside `BuiltProjects.tsx`) | Item 9 | Hover intent, a button header, and a `grid-template-rows` open/close. |

No new dependencies. No new fonts.

## 2. Items

### Item 1: bio as an editorial "About" intro
- **Root cause.** `Hero.tsx` renders `identity.bio` as one centred `t-lead` paragraph (`max-w-[60ch]` at 18 to 24px, so 80 to 90 characters a line), with the contact row under it and no label or section rhythm.
- **Change.**
  - A "✦ About" kicker (the existing `.kicker`).
  - The block moves into `.wrap`, left-aligned at about 62ch, with section spacing above and below.
  - The bio is split after its first sentence, at render time; the wording is unchanged.
  - Lead paragraph (near-black, lead size): "regulated fintech", "edtech growth" and "e-commerce operations" in the serif italic. "(KYC/AML)" and "(WMS, OMS)" stay sans.
  - Second paragraph: body size, `--muted`, line-height 1.65. "first PM hire at Zamplitude", "nearly doubled sign-up conversion" and "build AI prototypes myself" in ink.
  - The phrases live in `lib/content.ts` (`bioAccents`, `bioEmphasis`).
  - The contact row leaves this spot (Item 3).
  - Fade-up via the existing `data-reveal="up"` (none under reduced motion).
- **Safeguard.** The content guard (`scripts/check-content.ts`, run on every build) fails if a styled phrase no longer appears in the bio, so a bio edit can't silently drop the styling.
- **Files.** `components/Hero.tsx`, `lib/content.ts`, `scripts/check-content.ts`.

### Item 2: "Get in touch" replaces the site with Gmail
- **Root cause.** The mailto anchors (hero, contact row, case-page email button) have no `target`. Your browser has Gmail registered as its `mailto:` handler, so following the link navigates the current tab to Gmail compose. Each link builds `` `mailto:${identity.email}` `` separately, and external links set `target`/`rel` by hand in about a dozen places, so nothing keeps them consistent.
- **Change.** Every mailto and external link goes through `linkProps()`: case-study PDFs and documents, Live demo, View repo, LinkedIn, GitHub, certificates. `tel:` and in-page links stay in the same tab. Gmail is not hard-coded.
- **Safeguards.**
  - The content guard fails the build if `app/` or `components/` contain a literal `target="_blank"` or `mailto:` outside `lib/links.ts`.
  - `npm run verify` checks the rendered pages: every `mailto:` and external link has `target="_blank"` and `rel="noopener noreferrer"`.
- **To verify by hand.** Chrome closes the temporary tab when a mailto link goes to a desktop mail app. Safari and Firefox I can only confirm on your machine (headless browsers have no mail handler).
- **Files.** `lib/links.ts` (new), `lib/content.ts`, `components/HeroStage.tsx`, `CaseStudies.tsx`, `BuiltProjects.tsx`, `app/impact/[slug]/page.tsx`, the new contact row, `scripts/check-content.ts`, `scripts/verify-site.mjs`.

### Item 3: contact details on the first screen
- **Root cause.** `ContactLinks` sits under the bio, below the hero stage, as underlined inline text.
- **Change.**
  - `ContactRow` goes directly under the two hero buttons, inside `.hero-copy`. It fades with the copy in the scroll stage, and the stage's fit test already measures it.
  - Styling: nav-bar style (white, hairline border, soft shadow), 36px pills on desktop and 44px on phones, clearly smaller than the hero buttons.
  - Phone and email are icon-and-text pills. LinkedIn and GitHub are round icon buttons with an accessible name and a hover/focus tooltip.
  - Hover or focus gives a 2px lift and a blue-to-pink gradient border (the hero button gradients). The focus ring stays visible.
  - **Email pill = copy button.** It copies the address and shows "Copied" for about 2s, announced through an `aria-live="polite"` region.
  - Clipboard: `navigator.clipboard` exists only in secure contexts, and `http://192.168.29.90` is not one. So there is a fallback, a hidden-textarea `execCommand("copy")`, and copying works on both addresses.
- **Fit (estimated, to be measured).**
  - 1440×785: content about 690px.
  - 1366×768: about 680px.
  - 390×844: about 725px.
  - All fit. If a size runs short, the hero's top padding (the nav-to-photo gap) shrinks first; name and photo sizes don't change.
- **New UI text:** "Copied", "Copy email address" (accessible name), tooltip labels "LinkedIn" and "GitHub" (these already exist as names).
- **Files.** `components/ContactRow.tsx` (new), `components/ContactLinks.tsx` (removed), `HeroStage.tsx`, `Hero.tsx`, `Footer.tsx`, `app/globals.css`.

### Item 4: Experience and Education, one line each
- **Root cause.**
  - `Credibility` puts the two groups side by side (`lg:grid-cols-[1.6fr_1fr]`), and each group wraps inside its column.
  - The Newton School file `public/logos/newton-school.png` is a 1200×771 white canvas with the mark in the middle third (content box 276–881 × 80–685). `object-contain` shrinks it to about half the size of the other, full-bleed square logos.
- **Change.**
  - Groups are stacked (Experience row, then Education row), labels above as now, at the same panel width and pill size.
  - Each group is one row (`flex-nowrap`) from tablet up, and two per row (`grid-cols-2`) on phones.
  - Education is newest first: MDI Murshidabad, then KIIT University (array order in `lib/content.ts`, as the brief asks).
  - **Logo:** crop the existing PNG to a square around its mark (same artwork, no new download), so it fills its circle like the others.
- **Safeguard.** The content guard checks every logo in `credibility` is a square image.
- **Files.** `components/Credibility.tsx`, `components/LogoTile.tsx` (unchanged unless sizing needs a tweak), `lib/content.ts`, `public/logos/newton-school.png`, `scripts/check-content.ts`.

### Item 5: Impact tabs and chopped numbers
- **A. Tabs.**
  - **Root cause.** I replaced your tablist with two stacked bento groups in the redesign, so the Newton School block sits a full screen below Zamplitude.
  - **Change.**
    - Restore the WAI-ARIA tablist: `tablist`/`tab`/`tabpanel`, `aria-selected`, roving tabindex, ←/→/Home/End.
    - Logic comes from the pre-redesign `Metrics.tsx` (31c86cd), restyled.
    - Tabs are pills showing company and date range. The active tab has the "Get in touch" gradient; Zamplitude is the default.
    - The block headers and divider lines are removed.
    - Both panels share one grid cell, so the section is always as tall as the taller panel and switching never moves the page.
    - The panel cross-fades (opacity 0.4s); the inactive panel is `visibility:hidden` and `inert`.
    - Switching replays the odometer (cards remount and reveal); under reduced motion the values show at once.
- **B. Chopped numbers.**
  - **Root cause.** `.odo` (each odometer digit) is an inline-block with `overflow: hidden` at all times, sized to the digit's advance width. Instrument Serif italic digits lean past that box, so their right edges are cut (the 8 in 68%, the 0s in 30+ and ~120h, the 2 in 12%). It happens with or without JS, which is why it shows on the LAN address.
  - **Fix.** Give `.odo` room in `em`: `padding-inline-end: 0.15em; margin-inline-end: -0.15em`, so the clip box extends past the glyph without changing spacing. Keep the clip only while the roll is running (`overflow: hidden` moves under the reveal state), with a comment saying why the room is there.
  - The same room goes on the product index numbers (Item 9). I'll check every figure: 68%, 61%, 30+, ~120h, 30h, 12%, 19.1%, −99% and 01–04, in Chrome and Safari (WebKit via Playwright).
- **Files.** `components/Metrics.tsx`, `components/Numeral.tsx`, `components/RevealController.tsx` (an exported `revealNow()` so a remounted panel can replay), `app/globals.css`, `scripts/verify-site.mjs` (tablist keyboard check returns).

### Item 6: Selected Work previews and carousel
- **Root cause.** The previews are 800×449 (16:9). The frames are 4:3 with `object-fit: cover; object-position: top`, so their sides are cut.
- **Change.**
  - The frame aspect becomes 800/449 (from the files) with `object-fit: contain` on `--surface-3`, so anything off-shape is letterboxed, never cropped. `width`/`height` are set on the `img` to prevent layout shift.
  - The staggered grid becomes the shared Carousel:
    - **Layout:** about two cards plus a peek on desktop, one plus a peek on phones. Cards are equal height, with "Open case study" aligned at the bottom.
    - **Autoplay:** one card about every 4s, looping to the first. It pauses on hover, focus, touch or manual scroll, resumes after about 5 idle seconds, and stops off-screen (IntersectionObserver) or in a hidden tab (`visibilitychange`).
    - **Controls:** a visible pause/play button, and prev/next buttons. Scrolling is native with snap.
    - **Lenis:** the track carries `data-lenis-prevent-horizontal`, so sideways trackpad gestures scroll the carousel and vertical scrolling is untouched.
    - **Card link:** each card has one stretched link (the "Open case study" link, new tab) over the whole card, with no nested links.
    - **Fallbacks:** with reduced motion there's no autoplay. If all cards fit, it's a still row with no arrows, button or movement.
- **New UI text (accessible names):** "Previous", "Next", "Pause carousel", "Play carousel".
- **Files.** `components/Carousel.tsx` (new), `components/CaseStudies.tsx`, `app/globals.css`.

### Item 7: remove the GitHub section
- **Remove:**
  - `GitHubSection.tsx`, `ContributionCalendar.tsx`, `RepoCards.tsx`, `lib/github.ts`;
  - `curatedRepos`, `CuratedRepo` and `identity.githubUsername` from `lib/content.ts`;
  - `formatTooltipDate` from `lib/utils.ts`;
  - the `--gh-*` colour tokens;
  - the GitHub nav link;
  - the calendar fixture and filters in `scripts/content-check.mjs`;
  - the GitHub stops in `verify-site.mjs`;
  - mentions in README and DESIGN.md.
- **Keep:** the GitHub profile link (contact row) and "View repo" in Built.
- **Environment variables:** the section used none. The code reads only `NEXT_PUBLIC_BASE_PATH`, which is unrelated. If Vercel has a GitHub token set, nothing in the code uses it.
- **Dependencies:** none are specific to this section.
- **Files.** As listed; `app/page.tsx`; `lib/content.ts` (`navLinks`).

### Item 8: remove the Skills intro line
- `skillsIntro` and its paragraph go. Nothing else uses the sentence: the meta description and link previews use the separate `identity.positioning`. The section's usual heading-to-content gap applies.
- **Files.** `components/Skills.tsx`, `lib/content.ts`.

### Item 9: Built as expanding cards
- **Root cause.** It isn't a bug: the redesign deliberately kept every panel open.
- **Change.**
  - **Closed state (default for all cards):** the name in the serif italic, and a large, faint index number on the right.
  - **Open state:** today's full content, now uncropped. That's the tagline, subtitle and year, description, bullets, "Live demo" and "View repo", and the Signal screenshot.
  - **The card header is a `<button aria-expanded>`.** Enter and Space toggle it. The content is `inert` when closed, so its links are only reachable when open.
  - **Opening:**
    - Hover opens a card after 150ms of real pointer movement (`pointermove` with movement), so it won't open or close when the page scrolls under a still cursor.
    - Only one card is open at a time.
    - On touch, a tap toggles the card, with a "+" that rotates when open.
  - **Animation.** `grid-template-rows: 0fr → 1fr` (1.2s, the reference's ease), with the content's opacity and transform. The wash and slowly drifting circles fade in, and the index number turns accent blue.
  - Under reduced motion it opens instantly, with no drift.
  - **Rule change.** `DESIGN.md` currently allows only transform, opacity and clip-path animation. I'll record this `grid-template-rows` animation as an exception you asked for.
  - The other three cards stop being one big link. "View repo" becomes an ordinary link inside the open card, so those links' accessible names get shorter.
- **Files.** `components/BuiltProjects.tsx`, `app/globals.css`, `docs/DESIGN.md`.

### Item 10: Recognition into a Certifications carousel
- **Remove** `Achievements.tsx`, `achievements` and `Achievement`. NextLeap Top Fellow moves into Certifications; the IIM Rohtak entry is dropped.
- **Certifications:**
  - The seven certificates, in your order, in `lib/content.ts`: name, issuer, URL and a local image.
  - Shown in the shared Carousel with the "✦ Certifications" label.
  - Each card: image (contained, never cropped, consistent 4:3 frame), name, and issuer on its own line. The whole card links to the URL in a new tab.
- **Images** are downloaded once, after approval, into `public/certifications/` and converted to WebP (about 800px):

| # | Card name | Issuer line | Image source |
|---|---|---|---|
| 1 | Top Fellow, Product Management | NextLeap | the badge PNG (400×500, 106 KB) |
| 2 | Lean Six Sigma | KPMG | page 1 of the Drive PDF (public, 494 KB), rendered with the existing `pdfjs-dist` + `@napi-rs/canvas` |
| 3 | Business Analytics with Excel | Johns Hopkins University · Coursera | Coursera's certificate image (public JPEG, 339 KB) |
| 4 | Google Analytics 4 | Google · Skillshop | Skillshop's Open Graph image |
| 5 | SQL for Data Science | University of California, Davis · Coursera | Coursera certificate image (345 KB) |
| 6 | Business Analysis & Process Management | Coursera | Coursera certificate image (404 KB) |
| 7 | Get Started with Jira | Coursera | Coursera certificate image (399 KB) |

- **Link check (done).** All seven open without signing in (HTTP 200, no login redirect). The Drive file is shared publicly.
- **Issuers and dates.** I read them from each certificate; see §5 for the details. **Dates stay off.** The NextLeap badge carries no date, and your rule is all or none (Q3).
- **Files.** `components/Skills.tsx`, `lib/content.ts`, `public/certifications/*` (new), `app/page.tsx`, `components/Achievements.tsx` (removed).

### Item 11: compact footer and auto-hiding nav
- **Root cause.**
  - The footer stacks a heading, large contact rows, the wordmark and a menu.
  - The nav hides only after one full viewport *and* only while scrolling down. Its `.glass` (white 70%, blur 8px) turns muddy grey over the ink footer.
- **Footer.**
  - About a third of the current height: "Get in touch" at `--fs-h2` with "Product Manager · Bengaluru, India" (left), and "Download Resume" (right).
  - Below them, `ContactRow tone="dark"`.
  - Remove the wordmark, the "Menu" label (`footerMenuLabel`) and the footer links.
  - It stacks on phones.
- **Nav.**
  - At the top of the page it's visible.
  - Past about 80px it slides up.
  - **Desktop (hover + fine pointer):**
    - A `pointermove` near the top of the window (nav height plus margin, about 90px) shows it after 150ms. If the pointer leaves the window within that time (heading for the browser tabs), it stays hidden.
    - It stays while hovered and hides 400ms after the pointer leaves.
  - **Touch:** it shows on scroll up and hides on scroll down.
  - Keyboard focus shows it (`:focus-within`).
  - Under reduced motion it shows and hides without sliding.
  - Background: white 92% with a 16px blur and a hairline, so it reads cleanly over the ink footer.
  - Section anchors keep `scroll-margin-top` so headings land below the nav.
  - Links: Impact, Work, Built, Experience, Skills, Contact, plus Download Resume.
- **Files.** `components/Footer.tsx`, `components/Nav.tsx`, `app/globals.css`, `lib/content.ts`.

## 3. Verification
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm run verify` with the updated checks (tablist, link targets, carousel controls, mobile menu).
- **Playwright on the dev server at both `http://localhost:3000` and `http://192.168.29.90:3000`,** at 1440×785, 1366×768 and 390×844, for every item. That covers no console errors, no horizontal overflow, the first-screen fit, tabs, carousels and cards. WebKit runs for the italic figures.
- **Content check.** The redesign baseline will report what this order removes or rewords:
  - the GitHub section;
  - the Skills intro;
  - Recognition;
  - the footer wordmark and menu;
  - the old certification names;
  - the repo-card link names;
  - the mailto targets.

  I'll confirm the differences are exactly those, list them, then recapture the baseline from the new build (uncommitted) so later checks guard the new state.

## 4. Questions

1. **Built cards (Item 9):** when the pointer leaves the list, does the open card stay open or close?
   - Recommendation: **stay open** until another card is hovered or its header is clicked, as on the reference. Closing on leave makes the page below jump every time the mouse crosses the list.
2. **Zomato in the carousel (Item 6):** it has four documents, not one "Open case study" link.
   - Recommendation: **no whole-card link for Zomato**; its "View 4 documents" toggle stays its action. While open, the documents list makes the carousel row taller.
3. **Certificate dates (Item 10):** the NextLeap badge has no date, so by your rule no card shows one.
   - Should I use **2024**, the year on the site's current Achievements entry, so all seven can show dates?
   - Recommendation: leave dates off unless you confirm 2024.
4. **Branch:** OK to cut `site-fixes-2026-10` from `redesign/capslock` and leave everything uncommitted there?

## 5. Inconsistencies noticed (not changed)

- **Certificate titles differ from your names.** I'll use your names as given.
  - #1's badge reads "Top Fellow · Product Manager Fellowship".
  - #2 is a Green Belt programme.
  - #3 is "Business Analytics with Excel: Elementary to Advanced".
  - #4 is titled "Google Analytics Certification" and expires 15 Mar 2027.
  - #7 is "Get started with Jira".
- **Resume vs site.** The October resume lists two certifications; the site will list seven.
- **Repo dropped.** `lighthouse-qa-monitor` disappears from the site with the GitHub section. It appeared nowhere else.
- **Sync duplicates.** The folder keeps sprouting "… 2" files: new today are `docs/redesign/BRIEF 2.md`, `PROGRESS 2.md`, `baseline/* 2.json` and `scripts/content-check 2.mjs`. They're untracked and I won't touch them. Moving the repo out of iCloud Drive would stop this.

---

## 6. Outcome (17 October 2026)

All eleven items implemented on `site-fixes-2026-10`, uncommitted.

- **Checks:** `npm run lint`, `npx tsc --noEmit`, `npm run build` (content
  guard a to k) and `npm run verify` pass. The new verify checks cover the
  Impact tablist, the Built cards (Enter/Space), and new-tab behaviour on all
  32 mailto/external links. axe: 0 issues on home; the moderate "skip-link"
  heuristic remains on case pages (`/#…` links), as before.
- **Dev server, both addresses:** checked with Playwright at 1440×785,
  1366×768 and 390×844 on `http://localhost:3000` and
  `http://192.168.29.90:3000`: JS loads on both, no console errors, no
  horizontal overflow, and the first screen shows name, title, both buttons
  and the contact row at all three sizes.
- **Content check:** the comparison against the redesign baseline showed
  exactly the removals and rewordings this order asked for. The baseline was
  then recaptured from the new build and reads zero differences in all four
  modes, with 0 blocks hidden without JS.
- **Found during the work:**
  - The Carousel's first version never advanced: card offsets included the
    track's focus-ring padding, so "next" snapped back to the first card.
    Fixed by measuring from the first card.
  - The certificate frame cropped the portrait NextLeap badge (`height:100%`
    doesn't resolve in an auto-sized grid). Fixed by pinning the image to
    the frame.
  - `public/logos/mdi.png` was a JPEG with a `.png` name. Re-saved as a real
    PNG (same pixels); the new logo guard caught it.
  - iCloud sync keeps duplicating folders (" 2", " 3") inside
    `node_modules/@types` and `.next/types`, which breaks `tsc`. `npm ci` and
    deleting `.next` fixed it twice in two days.
- **Not verified here:** Safari/WebKit rendering of the italic figures
  (Playwright's WebKit isn't installed); whether a mailto link leaves an empty
  tab in Safari or Firefox (headless browsers have no mail handler).
