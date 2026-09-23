# Change order V3: resume sync (September 2026)

- Branch: `resume-sync-2026-09`, cut from `main` at `adec0d9`
- Plan written: 23 September 2026
- Status: **approved 23 September 2026.** Outcomes: S5 Faraz is based in Bengaluru, India, and the Zamplitude role reads "Remote, Dubai" (the office is in Dubai; Faraz works remotely). S8 **match the resume**: Newton's employer reads "Newton School" everywhere. S9 **match the resume**: HealthKart "unlocked SOC-2 compliance". S1 to S4, S6, S7 and S10 to S13 as recommended; C6 allow-list accepted.
- Source of truth: `~/Downloads/Faraz_Ali_Product_Manager_Resume.pdf` (2 pages, SHA-1 `1659643a`). The PDF deployed at `public/resume/Faraz-Ali-Product-Manager.pdf` is the previous edition (no Zamplitude; Newton "Mar 2025 – Present").

---

## 1. Recon findings

### 1.0 Bootstrap (Phase 0)

| Step | Result |
|---|---|
| 0.1 Workspace | `~/Documents/GitHub` did not exist (Part A4 not run; the session opened in another project). Created it. No prior `faraz-website`. |
| 0.2 Clone | Cloned `main` at `adec0d9` (30 Jun). Branch created. Remote `portfolio-pm-polish` is identical to `main` (0 ahead, 0 behind): stale, safe to delete. |
| 0.3 Identity | GitHub ID 164416297 confirmed. Repo-local `user.name` and `user.email` set. |
| 0.4 Runtime | System Node is v24.19.0. With Faraz's approval, installed `node@22` (v22.23.2) via Homebrew as a keg-only formula, used for this repo by PATH prefix. Global default unchanged. `npm ci` clean. |
| 0.5 Toolchain | uv 0.12.18 (Homebrew). graphify installed (`uv tool install graphifyy`); `graphify install` wrote `~/.claude/skills/graphify/` and created `~/.claude/CLAUDE.md`. ECC `common` and `typescript` rules copied to `~/.claude/rules/ecc/` (15 files). **Plugins superpowers, ECC and ui-ux-pro-max are not installed**, so this plan was written without writing-plans. |
| 0.6 Reading | Done. `CLAUDE.md` is `@AGENTS.md`. `AGENTS.md` says Next 16.2.9 differs from training data and to read `node_modules/next/dist/docs/` before writing code; I will do that for metadata, `next/link` and route files. Conflicts with this order are listed in 1.6. |

### 1.1 Known state, checked against code

| Claim | Verdict |
|---|---|
| `identity`: old title, Incanus company, "Present" tenure, "2+ years" in positioning and bio, old title in `headshotAlt` | Confirmed |
| `experience`: Newton `current: true`, "Mar 2025 – Present"; "Healthkart"; "Click-Up"; waitlist bullet absent | Confirmed |
| `metrics`: four Newton tiles linked to impact pages; `referral-growth` meta "Timeline: Mar 2025 – Present" | Confirmed |
| `educationTimeline`: both `dates` empty with TODO(Faraz) | Confirmed |
| `projects`: Signal flagship, repo and demo as stated | Confirmed |
| `skills`: four hubs, 30 nodes (10, 8, 5, 7) | Confirmed, **but there is no constellation** (C1) |
| Hosting: Vercel canonical, `deploy.yml` still targets Pages | Confirmed (1.3) |
| README drift | Established in code, below |

README against code:
- Title line still reads "Associate Product Manager".
- **Repo cards:** README describes a live newest-pushed fetch with a localStorage cache. Code (`RepoCards.tsx`, since `847ea19`) renders the hand-curated `curatedRepos` list with no fetch. `content.ts` is right.
- **Contribution calendar:** live, as README says (jogruber API, then ghchart image, then profile link).
- **Avatar:** README describes a GitHub-first fallback chain. Code renders the local `/images/faraz-ali.webp` only (the Avatar component was removed in `a5046aa`). `content.ts` is right.
- Also stale in README: `StarField.tsx` (deleted in `679399c`, replaced by the WebGL `ReactiveGalaxy.tsx`); "~30 skill-constellation nodes"; the footer architecture-map link (removed in `d60c473`); the GitHub Pages deployment section.
- `identity.companyShort` and `identity.tenure` have no consumers anywhere.

### 1.2 Stale-string sweep

| Hit | Class | Fixed in |
|---|---|---|
| `README.md:3` "Associate Product Manager" | Stale | 9.2 |
| `docs/DESIGN.md:9` "Associate Product Manager" | Stale | 9.4 |
| `content.ts:8` `identity.title` | Stale | 3.2, 4.1 (derived) |
| `content.ts:10` `identity.company` (Incanus) | Stale | 3.2, 4.1 (derived) |
| `content.ts:11` `identity.tenure` "Present" | Stale | 3.2, 4.1 (derived) |
| `content.ts:13`, `:17` "2+ years" | Stale | 5.1 |
| `content.ts:28` `headshotAlt` | Stale | 5.1 |
| `content.ts:125` Newton role title | Legitimate | |
| `content.ts:126` Newton company "Incanus Technologies (Newton School)" | Legitimate | S8 |
| `content.ts:128` Newton "Mar 2025 – Present" | Stale | 4.2 |
| `content.ts:137` "Click-Up" | Stale | 4.2 |
| `content.ts:142` "Healthkart" | Stale | 4.3 |
| `content.ts:427` referral meta Company "Newton School (Incanus Technologies)" | Legitimate | |
| `content.ts:429` referral meta Role "Associate Product Manager" | Legitimate | |
| `content.ts:431` referral meta "Timeline: Mar 2025 – Present" | Stale | 3.3 |

Identity literals in `app/` and `components/` (3.6g): `components/Nav.tsx:22` (the back-to-top aria-label hardcodes "Faraz Ali"), `app/impact/[slug]/page.tsx:94` ("Newton School" in the footer). Both fixed in Phase 3.

### 1.3 Hosting

- **Vercel connected: yes.** `vercel[bot]` creates a Production deployment from `main` on every push (latest `adec0d9`, 30 Jun), plus previews. https://faraz-website.vercel.app returns 200, and the repo homepage points there.
- **`deploy.yml` failing: yes, every run.** 6 of 6 runs failed (13 Jun to 30 Jun). The public repo shows a red cross on every commit.
- **GitHub Pages copy live: no.** https://farazo7.github.io/faraz-website/ returns 404; `has_pages: false`. A `github-pages` environment exists with stale deployment records.
- S6 conditions are met. No "disable Pages" hand-off action is needed; deleting the `github-pages` environment is optional tidying.

### 1.4 Assets

- All seven root-relative paths in `content.ts` exist. All four `public/previews/{slug}.webp` exist. **No gaps.**
- `public/graphify-out/graph.html` is committed and deployed, but nothing links to it now (C3).
- Logo files: HealthKart 512×512; Healthmug, KIIT and MDI 225×225; Newton 1200×771. A Zamplitude logo should be a square PNG of at least 225 px.

### 1.5 Baseline

Lint, typecheck and build all **pass** on Node 22 (19 static routes, four impact pages). No pre-existing failures.

Pre-existing quirk: `prebuild` regenerates `public/previews/*.webp` on every build, and the output differs byte for byte, so each local build dirties four tracked files. I restored them after the baseline and will do so before every commit. I am not fixing this (out of scope).

**Lighthouse** (v12, headless Chrome). The local preview server was blocked by this session's permission classifier, so the baseline ran against production, which serves the same commit (`adec0d9`). JSON is in `.review/baseline/`.

| Page | Perf | A11y | Best practices | SEO | LCP |
|---|---|---|---|---|---|
| `/` mobile | **81** | 96 | 100 | 100 | 4.1 s |
| `/` desktop | 100 | 96 | 100 | 100 | 0.7 s |
| `/impact/referral-growth` mobile | 98 | 100 | 100 | 100 | 2.5 s |
| `/impact/referral-growth` desktop | 100 | 100 | 100 | 100 | 0.6 s |

Pre-existing failures:
1. Home mobile Performance is 81. The LCP element is the hero bio paragraph (simulated TTFB 1.6 s, render delay 2.5 s).
2. Colour contrast: the "Get in touch" button is white on `#4F7CFF`, 3.71:1 against the AA threshold of 4.5:1. Signal's "Live demo" button uses the same classes. See S11.

**npm audit, production:** five advisories: one critical (`next`), three high (`sharp`, `postcss`, `nanoid`), one moderate. Upgrading `next` from 16.2.9 to 16.3.6 (not a major) fixes all but `nanoid`. The advisories target server features (the image optimisation API, server actions, middleware, Windows hosting). This site is a static export with unoptimised images, so none is reachable in production, but 11.5 requires resolving criticals. See S10.

Other checks:
- simple-icons 16.23.0 has `siClickup` (`#7B68EE`) and `siNotion`. Notion's brand hex is `#000000`, which would be invisible on the dark UI (handled in Phase 8).
- Dry run of 3.6d: all eight `resumeEvidence` phrases (6.2, 6.3) pass the specified normalisation against the new PDF text.
- Every string the order quotes (Z1 to Z5, the waitlist bullet, positioning, skills intro, both Signal highlights, all six skill groups) matches the PDF apart from punctuation. The one exception is C7.

### 1.6 Conflicts between this order and the repo

- **C1 The skills constellation no longer exists.** The 20 June redesign (`679399c`) deleted `SkillsConstellation.tsx` and `StarField.tsx`. `Skills.tsx` now renders each hub as a `.glass` card with flat chips; its own comment calls it a "static, scannable replacement for the animated constellation". The `.glass-solid` and `.float-node` CSS is orphaned. The arcs, cluster overlap, float animation and off-screen pause in 8.1 have nothing to apply to. Proposal in S3.
- **C2 Where the metrics live.** The tiles sit in their own `#impact` section (`Metrics.tsx`), not in the hero panel, and use `.glass`, not `.glass-nested`. The tablist goes in that section.
- **C3 Architecture map.** 11.6 says to confirm the footer link resolves, but that link was removed deliberately in `d60c473` ("not recruiter-useful"). Proposal in S12.
- **C4 Location.** S5 says the hero reads "Bengaluru, India", but the hero does not render location at all. It appears in the footer ("{title} · {location}") and in the Person JSON-LD (`addressLocality: "Bengaluru"`, hardcoded in `app/page.tsx`). The resume header no longer shows a location.
- **C5 Metadata is mostly done already.** `metadataBase` is set in `app/layout.tsx`; the canonical `/` and the Person JSON-LD are in `app/page.tsx`. The JSON-LD lacks `url`. There is no `app/sitemap.ts`, so the sitemap step is a no-op.
- **C6 Em-dash audit against the verbatim footer.** 3.3 keeps the Newton confidentiality text verbatim, and that text contains an em dash. Moving it into `content.ts` makes it an added line, so the 11.7 grep would print it. Proposal: allow-list that one moved line in 11.7, since R4 covers new or edited strings only.
- **C7 The acquisition bullet is not verbatim resume text.** The resume says "raising sign-up conversion 91%". The 4.2 text keeps the site's "10% → 19.1% (+91%)". The figures agree (19.1 / 10 = 1.91), and both numbers already exist in `content.ts`, so R2 holds. The `signup-conversion` page draws on the same source.
- **C8 Lighthouse gate.** 11.4 asks for 95 or above in all four categories, but home mobile Performance is 81 before any change. Proposal in S13.
- **C9 Node on this Mac.** The global Node is v24. Once `.nvmrc` and `engines` land, `npm ci` on v24 will warn. Hand-off note in section 6.

---

## 2. Resume parity matrix

Key: **Present** (on the site and consistent) · **Updated** · **Added** · **Excluded** (with reason).

### Header

| Resume element | Site location | Action |
|---|---|---|
| Name | `identity.name` | Present |
| Title "Product Manager" | `identity.title`, derived from the current role: hero h2, footer, `<title>`, OG and Twitter cards, JSON-LD | Updated (3.2, 4.1) |
| Phone, email, LinkedIn, GitHub | `identity.*` → `ContactLinks` | Present |
| "Website" (links to faraz-website.vercel.app) | `metadataBase`, canonical | Present |

### Summary

| Resume element | Site location | Action |
|---|---|---|
| Sentence 1, "Product Manager who builds AI, fintech, and growth products end-to-end…" | `identity.positioning`: meta description, OG subtitle | Updated (5.1; em dashes become commas) |
| Sentence 2, "Fluent in product discovery…" | Skills intro line | Added (8.3) |

### Zamplitude: Product Manager, Remote, Dubai, Mar 2026 – Present

| Resume element | Site location | Action |
|---|---|---|
| Role header | `experience[0]`, `current: true` | Added (4.1) |
| Z1 KYC review workflow, first-pass approval 91% | Bullet → `/impact/kyc-review-workflow`; tile 91% | Added |
| Z2 Compliance dashboard, 5 days to same-day | Bullet → `/impact/compliance-dashboard` (no tile) | Added |
| Z3 Risk scoring, 68% auto-cleared, 72 h to under 8 | Bullet → `/impact/risk-scoring`; tile 68% | Added |
| Z4 Roles and Permissions, audit prep down 60% | Bullet → `/impact/roles-permissions`; tile −60% | Added |
| Z5 AML mock service, about 120 h rework averted | Bullet → `/impact/aml-mock-service`; tile 120 h | Added |
| (Credibility strip) | Zamplitude, "Fintech" | Added (5.2) |

### Newton School: Associate Product Manager, Bengaluru, India, Mar 2025 – Mar 2026

| Resume element | Site location | Action |
|---|---|---|
| Role header | `experience[1]` | Updated: dates, `current: false`, company "Newton School" (S8; the referral page's Company row follows). Location stays city-only, as for every existing role |
| N1 referral, conversion +32% | Existing "Referral growth module…" bullet (site wording, same figure) → `/impact/referral-growth`; tile +32% | Present, now linked (4.2) |
| N2 acquisition funnel, sign-up conversion +91% | Bullet replaced (4.2) → `/impact/signup-conversion` | Updated (C7) |
| N3 AI proctoring, effort −70% over 15,000+ sessions | Existing "AI exam monitoring…" bullet → `/impact/ai-proctoring`; tile −70% | Present, now linked |
| N4 Razorpay, 100% real-time accuracy, manual effort −99% | Existing "Razorpay Route integration…" bullet → `/impact/razorpay-route`; tile −99% | Present, now linked |
| N5 waitlist, 30% converted, zero vacant seats | New bullet after Razorpay → `/impact/waitlist-automation`; tile 30% | Added (4.2) |
| (Site only: Mixpanel and CleverTap, RICE rescheduling, Agile and JIRA) | Kept; "Click-Up" becomes "ClickUp" | Present |

### HealthKart: Product Management Trainee, Gurugram, India, Aug 2024 – Mar 2025

| Resume element | Site location | Action |
|---|---|---|
| Role header | `experience[2]` | Updated: "Healthkart" becomes "HealthKart" (4.3) |
| H1 new category worth 5% of revenue | Existing bullet, first clause | Present (same figure) |
| H2 "unlocked SOC-2 compliance" | Existing bullet said "**toward** SOC-2 compliance" | Updated: "that unlocked SOC-2 compliance" (S9) |

### Healthmug: Category Management Intern, New Delhi, India, Apr 2023 – Jul 2023

| Resume element | Site location | Action |
|---|---|---|
| Role header | `experience[3]` | Present |
| M1 repeat purchases +25% | Bullet | Present |
| M2 assortment +18%, 35% month-over-month growth | Bullet | Present |

### Projects

| Resume element | Site location | Action |
|---|---|---|
| Signal name, repo, live demo | `projects[0]` (flagship) | Present |
| Subtitle "AI Product Feedback Intelligence Platform" | `Project.subtitle` | Added (7) |
| Year 2026 | `Project.year` | Added (7) |
| Highlights 1 and 2 | `Project.highlights`, flagship card only | Added (7) |
| Resume's "View on GitHub" for Signal | The resume links to the GitHub profile, not the Signal repo; the site links the repo | Resume-side note for Faraz |

### Skills

| Resume group | Site location | Action |
|---|---|---|
| Product Management (25) | `skillsIndex`; 13 in the Core PM hub | Added (8.1, 8.4) |
| Delivery & Programme (14) | `skillsIndex`; new hub with 11 nodes | Added (S3) |
| Growth & Analytics (15) | `skillsIndex`; Data & Analytics hub (11) | Added |
| AI & Automation (11) | `skillsIndex`; AI & Automation hub (8) | Added |
| Domains (10) | `domains` strip in Experience; `skillsIndex` reuses the same constant | Added (4.5) |
| Technical & Tools (17) | `skillsIndex`; Tools hub (10), plus SQL, Python and Mixpanel in Data & Analytics | Added. Power BI, SAP and Advanced Excel appear in the index only (S4) |

### Education

| Resume element | Site location | Action |
|---|---|---|
| MDI Murshidabad, PGDM Marketing & Supply Chain Management, 2022 – 2024 | `educationTimeline[0]` | Updated: dates (4.4) |
| KIIT University, B.Tech Electronics & Telecommunication Engineering, 2014 – 2018 | `educationTimeline[1]` | Updated: dates (4.4) |

### Certifications

| Resume element | Site location | Action |
|---|---|---|
| NextLeap Product Manager Top Fellow (2024) | `achievements[0]` | Present |
| Lean Six Sigma (KPMG); Google Analytics Certification; SQL for Data Science (Coursera); Business Analytics with Excel (Coursera); Business Analysis & Process Management | `certifications` | Present. The site also names Coursera as provider of the last one; the resume omits a provider. Out of scope (R10) |
| (Site only: IIM Rohtak runner-up; Founder's Recommendation Letter) | `achievements` | Present, kept (R10) |

Nothing on the resume is unaccounted for.

---

## 3. File-by-file change list

One commit per phase (R7). Before each commit: `git restore public/previews/` (see 1.5), then lint, `tsc --noEmit` and build (R9). Nothing is pushed.

**Phase 2 commit** (after approval): `docs: add V3 resume-sync change-order plan`. This file only.

### Phase 3: `refactor(content): derive current role, org-linked impact pages, content guard`

| File | Change |
|---|---|
| `public/resume/Faraz-Ali-Product-Manager.pdf` | Overwrite from Downloads; check that page 1 contains "Zamplitude" (3.1) |
| `.gitignore` | Add `.review/` |
| `lib/content.ts` | `OrgId`; `Role.id`; optional `Role.companyShort`; `type Bullet = string \| { text; impact? }`; `Role.bullets: Bullet[]`. Move `Role` and `experience` above `identity`; export `currentRole` plus a `getRole(org)` lookup; derive `identity.title`, `company`, `companyShort` and `tenure`. `ImpactDetail.org: ImpactOrg`, where `ImpactOrg` is `"zamplitude" \| "newton"`, a subset of `OrgId`, so the footer lookup type-checks. Add `org: "newton"` to the four pages; delete the referral "Timeline" row. Add `confidentiality: Record<ImpactOrg, string>` (Newton verbatim; Zamplitude per 3.3). Replace `metrics` with `metricGroups`: one Newton group whose four tiles carry the 6.3 `resumeEvidence`. Add `id: "mdi"` and `id: "kiit"` to education. |
| `components/Timeline.tsx` | Render both bullet shapes. A linked bullet gets a "Read the case" `next/link` with aria-label "Read the case: {page metric}". Key bullets by text. |
| `app/impact/[slug]/page.tsx` | Append a "Tenure" row from `getRole(detail.org).dates`; footer text from `confidentiality[detail.org]` |
| `components/Metrics.tsx` | Read `metricGroups`. With one group it renders exactly as today |
| `components/Nav.tsx` | aria-label built from `identity.name` (3.6g) |
| `scripts/check-content.ts` (new), `package.json` | Assertions a to h. `npm run check:content`. `tsx` as a devDependency. Not chained into `prebuild` yet |
| `.nvmrc` (new), `package.json` | `22`; `"engines": { "node": "22.x" }` |
| This file | Append the guard's first-run failures as the implementation checklist (expected: e, education dates; h, "2+ years") |

Visible change: the impact pages gain a "Tenure" row (3.3), which still reads "Mar 2025 – Present" until Phase 4. Nothing else.

### Phase 4: `feat(experience): add Zamplitude role, update Newton, education years, domains`

| File | Change |
|---|---|
| `lib/content.ts` | Prepend Zamplitude (4.1), which switches the derived identity. Newton: `current: false`, dates, acquisition bullet replaced, waitlist bullet inserted after Razorpay, "ClickUp". Link the four bullets whose pages already exist (referral, proctoring, Razorpay, waitlist). HealthKart spelling. Education dates, TODOs removed. `export const domains`. |
| `components/Experience.tsx` | Mono "Domains" label with flat chips at the top of the section |

Sequencing: Z1 to Z5 and the acquisition bullet ship **without** `impact` in Phase 4 and get their slugs in Phase 6, alongside the pages. That way no phase commit contains a link to a page that does not exist.

### Phase 5: `feat(identity): positioning, bio, credibility and metadata`

| File | Change |
|---|---|
| `lib/content.ts` | Positioning; bio with `// REVIEW(Faraz)` (S1); `headshotAlt`; Zamplitude credibility entry, with `logo` only if S7 finds an official asset |
| `public/logos/zamplitude.png` | Only if S7 succeeds |
| `app/page.tsx` | JSON-LD: add `url`; `jobTitle` and `worksFor` from `currentRole`; address per S5 |
| `app/layout.tsx` | Already derives title and description and sets `metadataBase`; no change expected (C5) |

### Phase 6: `feat(impact): role-segmented metrics and six impact pages`

| File | Change |
|---|---|
| `lib/content.ts` | Zamplitude group first (6.2); five Zamplitude pages and `signup-conversion` (6.5), with the Problem lines marked `// REVIEW(Faraz)`; attach the six new slugs to Z1 to Z5 and the acquisition bullet |
| `components/Metrics.tsx` | WAI-ARIA tabs (6.1). Both panels share one CSS grid cell, so the section is always as tall as the taller panel and switching causes no shift. The inactive panel is `visibility: hidden` plus `inert`: not painted, not focusable, out of the accessibility tree. Tiles are keyed by tab so the count-up replays; under reduced motion it is instant. Labels and tenure come from content |
| OG and Twitter image routes | No edit; they pick up the new slugs through `generateStaticParams` |

### Phase 7: `feat(built): Signal subtitle, year and highlights`

| File | Change |
|---|---|
| `lib/content.ts` | Optional `subtitle`, `year` and `highlights` on `Project`; Signal values (7) |
| `components/BuiltProjects.tsx` | The flagship card renders the subtitle, year and a highlights list |

### Phase 8: `feat(skills): five hubs, intro line and full skills index`

| File | Change |
|---|---|
| `lib/content.ts` | Five hubs (8.1, amended by S3). GA relabelled GA4. `slug: "clickup"` and `slug: "notion"`. `skillsIntro`. `skillsIndex` with the six groups verbatim; its Domains group reuses `domains` |
| `lib/skillIcons.ts` | Import `siClickup` and `siNotion` |
| `components/Skills.tsx` | Five hub cards (S3 layout), intro line, native `<details>` "All skills" (flat, no glass). Brand marks darker than a set luminance render in the foreground colour, so Notion's black mark stays visible; its official mark is monochrome anyway |

### Phase 9: `chore: wire content guard into prebuild; update docs`

| File | Change |
|---|---|
| `package.json` | `"prebuild": "tsx scripts/check-content.ts && node scripts/generate-previews.mjs"` |
| `README.md` | Per 9.2. Also corrects the drift in 1.1: curated repos, local headshot, `ReactiveGalaxy`, no footer map link, Vercel-only hosting |
| `CLAUDE.md` | Keep `@AGENTS.md`; add a "Project rules" section (9.3) |
| `docs/DESIGN.md` | Tablist, five-hub card layout and glass count, Domains chips, skills index; fix the stale title on line 9 |

### Phase 10: `ci: replace GitHub Pages deploy with verify workflow` (S6)

Delete `.github/workflows/deploy.yml`; add `.github/workflows/ci.yml` exactly as in the order. Keep `withBase`. No Pages hand-off is needed (1.3).

### Phase 11: `test: site verification, dependency and contrast fixes`

| File | Change |
|---|---|
| `scripts/verify-site.mjs` (new), `package.json` | `npm run verify`. `playwright` and `@axe-core/playwright` as devDependencies |
| `package.json`, `package-lock.json` | S10: `next` and `eslint-config-next` to 16.3.6 |
| `components/Hero.tsx`, `components/BuiltProjects.tsx` | S11: primary buttons on `#3D6AF0` (4.65:1), hover `#2F5BE0` (5.69:1) |
| `public/graphify-out/graph.html` | S12: regenerate |

R7 puts S10 and S11 in the Phase 11 commit. Say if you want them as separate commits so each can be reverted alone.

---

## 4. Sign-off items

| # | Item | Recommendation and reason |
|---|---|---|
| S1 | Bio rewrite (5.1 draft) | **Adopt.** It retires the "2+ years" claim and names the current role, and every clause traces to Z1, Z2 or the existing bio. It carries `REVIEW(Faraz)`. Note: the bio is the home page's LCP element and grows from 53 to 77 words; checked in 11.4. |
| S2 | Role-segmented metrics, Zamplitude tab first, four tiles per tab | **Adopt.** The newest outcomes lead, and four visible tiles plus the nav is five live blurs. Implementation as in Phase 6. |
| S3 | Fifth hub, Delivery & Programme, with UAT moved into it | **Adopt the taxonomy, amended for C1:** apply it to the existing static hub cards, not a restored constellation. Five `.glass` hub cards plus the nav is six live blurs when all are on screen, exactly the budget; chips stay flat. Layout: a 2-column grid with Core PM (13 nodes) spanning both columns, then 2 × 2; mobile stacks the five cards (it already does). Drop the arc, overlap, float and off-screen-pause requirements, which have nothing to apply to. Restoring the constellation would reverse the June redesign and is out of scope. |
| S4 | Power BI, SAP and Advanced Excel in the skills index only | **Adopt.** Keeps the V2 curation and gives resume parity. |
| S5 | Location: "Bengaluru, India" site-wide; Zamplitude role "Remote, Dubai" | **Faraz to confirm.** Per C4, the site location shows in the footer and JSON-LD, not the hero. |
| S6 | Retire the Pages workflow; Vercel only | **Adopt.** Confirmed: 6 of 6 runs failed, Vercel production is live from `main`, no Pages site exists. |
| S7 | Zamplitude logo: official asset only, else the monogram | **Adopt.** Square PNG of at least 225 px, matched to the existing tiles. |
| S8 | Newton company label: the resume says "Newton School"; the site says "Incanus Technologies (Newton School)" | Recommended keeping the legal name. **Decided: match the resume.** "Newton School" in the role and on the referral page; "Incanus" leaves the site. |
| S9 | HealthKart: the site says "toward SOC-2 compliance"; both resume editions say "unlocked SOC-2 compliance" | **Decided: match the resume** ("…migration requirements that unlocked SOC-2 compliance"). |
| S10 | Security: upgrade `next` and `eslint-config-next` from 16.2.9 to 16.3.6 | **Adopt.** 11.5 requires resolving the critical. None is reachable on a static export, but a red audit on a public portfolio repo reads badly, and this is not a major bump. Run `npm audit fix` for the remaining non-breaking highs. Full check suite afterwards. |
| S11 | Primary-button contrast, pre-existing: 3.71:1 against 4.5:1 | **Adopt.** R5 requires AA. The fix reuses the existing hover shade `#3D6AF0` (4.65:1) for the resting state and adds a darker hover. `--accent-a` and the palette are untouched. Optional, since it is outside the resume scope. |
| S12 | Architecture map (C3) | **Regenerate** `public/graphify-out/graph.html` and link it from the README only. Do not restore the footer link, which you removed on purpose. Alternative: delete the orphaned file. |
| S13 | Lighthouse gate (C8) | **Amend 11.4** to: 95 or above in every category whose baseline is 95 or above, and no drop of more than 2 points anywhere. Log home mobile Performance (81) as pre-existing and take it up as a separate performance task. Compare the local branch against a local `main` build on the same machine, then the Vercel preview against the production baseline (12.3). |

---

## 5. Risks and verification plan

### Risks

| Risk | Mitigation |
|---|---|
| Glass budget where the GitHub repo cards and the Skills hubs share a viewport | Measure the GitHub-to-Skills boundary as well as the three positions in 11.3. If it goes over 6, give the hub cards `.glass-nested` (same look, no blur). |
| The hidden tab panel counted by the glass check | The inactive panel is `visibility: hidden` and so not painted. The check counts only painted, in-viewport elements, and the plan records this. |
| Layout shift on tab switch | Stacked grid panels share one height; CLS is measured in 11.4. |
| A longer bio on the LCP element | Home LCP compared against baseline in 11.4 (S1, S13). |
| Links to pages that do not exist yet | Sequencing in Phase 4 and Phase 6. |
| PDF text extraction drift in future resume editions | The dry run passes today. The guard fails loudly with the field name and the fix. |
| Notion's black brand mark | Low-luminance marks render in the foreground colour. |
| Next 16 APIs differ from training data (`AGENTS.md`) | Read `node_modules/next/dist/docs/` for metadata, `Link` and route conventions before editing. |
| Client anonymity (R3) | Slugs, alt text, metadata and commit messages carry no client name. "GCC" and "Nafath" appear only because they are on the resume. |
| Local builds rewrite the preview WebPs | `git restore public/previews/` before each commit. |
| The `next` upgrade changes build output | Full suite rerun after S10. |

### Verification (Phase 11, as ordered, with amendments)

1. Lint, typecheck and build green at every phase. `check:content` green from Phase 9. Prove the guard bites (change one tile value, build fails with a clear message, revert, never commit).
2. linkinator over the served `out/`: zero broken internal links; retry external failures once.
3. `verify-site.mjs`: screenshots at 375, 768, 1024 and 1440 px (both tabs, Experience, Skills, `/impact/risk-scoring`, `/impact/referral-growth`, plus a reduced-motion set); glass budget; zero serious or critical axe violations on `/` and both impact pages; keyboard checks on the tablist, the "Read the case" links and `<details>`.
4. Lighthouse under the S13 gate.
5. `npm audit --omit=dev` clean of criticals (S10).
6. graphify regeneration (S12).
7. The em-dash grep in 11.7 prints nothing, with **C6 allow-listing the one moved Newton footer line**. Then a manual read of every added line against R2, R3 and R4.

Serving `out/`: the preview tool was blocked in this session. After approval I will retry from the repo. If it is blocked again, I will ask you to allow it, or to run `npx serve out -l 4173` in a terminal tab.

---

## 6. Actions for Faraz before execution

1. Reply **"approved"**, or amend by item number. S5 needs an explicit answer.
2. **Plugins (Part A5) are not installed.** Run the A5 lines from a terminal `claude` session, since `/plugin` may not be available in the desktop app. Not blocking.
3. Optional: to make Node 22 your shell default, add `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"` to `~/.zshrc`. I have not changed your shell configuration.
4. Optional: delete the stale remote branch `portfolio-pm-polish`, and the `github-pages` environment after Phase 10.

## 7. Execution record (Phase 12)

### Commits (branch `resume-sync-2026-09`, not pushed)

| Phase | Commit |
|---|---|
| 2 | `7c1ef8d` docs: add V3 resume-sync change-order plan |
| 3 | `07e1e52` refactor(content): derive current role, org-linked impact pages, content guard |
| 4 | `e57aa8c` feat(experience): add Zamplitude role, update Newton, education years, domains |
| 5 | `2d6bef4` feat(identity): positioning, bio, credibility and metadata |
| 6 | `a719297` feat(impact): role-segmented metrics and six impact pages |
| 7 | `32788a5` feat(built): Signal subtitle, year and highlights |
| 8 | `14c28dd` feat(skills): five hubs, intro line, full skills index; glass budget |
| 9 | `f8aaf4c` chore: wire content guard into prebuild; update docs |
| 10 | `438042d` ci: replace GitHub Pages deploy with verify workflow |
| 11 | `e53832f` test: site verification, security upgrade, contrast and map |

### Checks

| Check | Result |
|---|---|
| Lint, `tsc --noEmit`, build (every phase from 3) | Pass |
| `npm run check:content` (a to h), now in `prebuild` | Pass: 8 tiles, 10 impact pages |
| Guard bites (11.1): risk-scoring tile set to 69 | Build failed with `[c] metricGroups[zamplitude].risk-scoring.value`; reverted, never committed |
| Links (11.2) | 0 broken internal. 18 external "failures" are production URLs of the six new pages (canonical, og:url, OG images); they resolve once `main` deploys |
| Screenshots (11.3) | `.review/screens/`: 4 widths × (hero, both tabs, Experience, Skills, 2 impact pages), plus reduced motion |
| Glass budget (11.3) | Pass at every width: hero 1 to 2, Impact 6, GitHub 2, GitHub-to-Skills 1, Skills 1 (`main`: up to 10) |
| axe (11.3) | 0 violations on `/`, `/impact/risk-scoring/`, `/impact/referral-growth/` (`main`: 1 serious, button contrast) |
| Keyboard (11.3) | Pass: tablist arrows/Home/End with focus; Tab lands in the active panel; 10 "Read the case" links with unique names; `<details>` toggles with Enter |
| Lighthouse (11.4, S13 gate) | Pass, see below |
| `npm audit` (11.5) | 0 vulnerabilities (was 1 critical, 7 high). ECC plugin not installed, so no ECC scan |
| Architecture map (11.6) | Regenerated (417 nodes, code-only, no LLM); served at `/graphify-out/graph.html`; no footer link (S12) |
| Copy audit (11.7) | Only em dash on added `content.ts` lines is the allow-listed Newton footer (C6). No client identity in copy, slugs, filenames or commit messages |

### Lighthouse

Production baseline (live site, `adec0d9`): home mobile 81 / 96 / 100 / 100; home desktop 100 / 96 / 100 / 100; referral mobile 98 / 100 / 100 / 100; referral desktop 100s.

Branch, local static server (single run): home mobile 79 / **100** / 100 / 100; home desktop 99 / **100** / 100 / 100; risk-scoring mobile 91 / 100 / 100 / 100; risk-scoring desktop 100s; referral mobile 97 / 100 / 100 / 100; referral desktop 100s.

Like-for-like mobile Performance, three-run medians on the same machine: home **85 branch vs 85 `main`**; referral **97 vs 96**; risk-scoring **96** (the single 91 was a cold first run). No regression; Accessibility 96 → 100. Home mobile Performance remains the pre-existing gap: LCP is the bio text repainting when the webfont swaps in.

### Decisions taken during execution

- **S7:** zamplitude.com (a software firm serving the UAE, KSA and EMEA) publishes no logo asset: its header mark is a stock Lucide icon and it has no favicon. The strip shows the "Z" monogram. Nothing was downloaded.
- **Glass budget (asked and approved):** case-study cards, repo cards and skills hubs use `.glass-nested`, which fixed the overruns already on the live site as well as the new hub.
- **Tooling:** the preview pane could not start this repo's server, so `scripts/serve-out.mjs` serves `out/` for `npm run verify`. Playwright drives the installed Chrome; `npm ci` downloads no browsers.
- **Spelling:** British spelling applied to the HealthKart bullet edited for S9 ("optimisation"). Untouched copy keeps its spelling (R4).

### Open REVIEW(Faraz) items

- `identity.bio` (S1).
- Problem lines on the six new pages: `kyc-review-workflow`, `compliance-dashboard`, `risk-scoring`, `roles-permissions`, `aml-mock-service`, `signup-conversion`.
- Pre-existing, untouched: the MakeMyTrip, Zepto and Zomato case-study summaries.

### Notes for Faraz (not acted on)

- Resume: Signal's "View on GitHub" links to your GitHub profile, not the Signal repo. The waitlist bullet spells "enrollment" (American); the site keeps it verbatim.
- Confluence's dark navy mark is faint on the dark skill cards (pre-existing).
- Home mobile Performance (about 81 to 85) needs a separate performance pass on the font-swap LCP.

## Appendix: content-guard checklist

First `npm run check:content` run, end of Phase 3 (a, b, c, d, f, g pass; d already finds all four Newton phrases in the new PDF):

| Check | Field | Fixed in |
|---|---|---|
| e | `educationTimeline[mdi].dates` empty | 4.4 |
| e | `educationTimeline[kiit].dates` empty | 4.4 |
| h | `lib/content.ts` "2+ years" in `identity.positioning` | 5.1 |
| h | `lib/content.ts` "2+ years" in `identity.bio` | 5.1 |
