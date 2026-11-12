# Change order V7: two new prototypes, Built above Work (12 November 2026)

- Source: Faraz's brief (3 items).
- Base: a new branch `built-prototypes-2026-11` from `main`, so it lands apart from the open resume PR (`resume-update-2026-10`). Uncommitted until Faraz confirms; never pushed.
- Status: **approved 12 November 2026**.

## 1. Items

### Item 1: ProofFlow, second card
- **Data.** A new entry in `projects` (`lib/content.ts`), after Signal. Cards already render from that array, so no markup is hand-written. `Project` gains three optional fields, used by ProofFlow only:
  - `links`: secondary links as `{ label, href }` ("Client view (no login)").
  - `mcpEndpoint`: the connector URL.
  - `login`: `{ email, password }` for the shared demo workspace.
- **Description (drafted, `REVIEW(Faraz)`), from the repo README:** "An MCP server built with Next.js that takes a milestone from delivered to accepted: the customer's own Claude reads contracts and writes acceptance packs through its tools, and ProofFlow keeps the record down to the date payment falls due." Tagline (kept in the data, not shown, like the others): "MCP · Milestone acceptance".
- **Card.** The same `ProjectCard`, nothing new visually for the existing cards:
  - Row 1, as on Signal: **Live demo** (`btn-primary`) and **View repo** (`btn-ghost`), then "Client view (no login)" as a small text link with the same arrow. It sits beside the buttons on desktop and wraps under them on a phone.
  - Below, two small muted lines: "MCP endpoint" with the URL in small monospace (wraps anywhere, so it never overflows at 375px) and a copy icon button; "Test login:" email / password, each in monospace with its own copy icon button.
  - Copy buttons reuse ContactRow's `copyText` (clipboard, with the plain-http fallback): the icon turns to a tick for 2 seconds and "Copied" is announced to screen readers. Each has an accessible name ("Copy MCP endpoint", "Copy test email", "Copy test password").
  - All links go through `linkProps` (new tab, `noopener noreferrer`) and carry the "(opens in a new tab)" screen-reader text.

### Item 2: Vocab Coach, third card
- A new entry after ProofFlow, demo and repo links only, so it looks exactly like Signal.
- **Description (drafted, `REVIEW(Faraz)`):** "A voice-agent vocabulary coach for IELTS, PTE and DET speaking: it introduces words in conversation, asks for them again with a ladder of hints, and brings them back on a spaced-repetition schedule." Tagline: "Voice agent · Vocabulary".
- Order becomes Signal, ProofFlow, Vocab Coach, engagR, Cairn, Application Desk. Index numbers (01 to 06) follow automatically.

### Item 3: Built above Work
- `app/page.tsx`: `<BuiltProjects />` moves above `<CaseStudies />`. Section IDs (`#built`, `#work`) are unchanged, so old links and the impact pages' "/#work" link still work.
- `navLinks`: Impact, Built, Work, Experience, Skills, Contact. Desktop and mobile menus both read this list.
- Sections have no backgrounds or dividers of their own (only the footer is dark), so nothing alternates; the check is that the gaps between Impact, Built, Work and Experience stay equal.
- `docs/DESIGN.md`: the page-order list and "four expanding cards" updated to match.

## 2. Side effects to accept
- **One open height.** Every card opens to the tallest card's content (`--built-open`, DESIGN.md), so the list doesn't jump between cards. ProofFlow becomes the tallest, so the other cards open taller, with more space under their buttons. Kept as designed.
- **Tones.** Card washes cycle blue, teal, lilac, sand by position, so engagR, Cairn and Application Desk change tint.
- **Public demo access.** The MCP endpoint and the client-view link carry access tokens, and the test password will be on the public site. All three are as Faraz supplied; the password is already in the public README.

## 3. Verification
Lint, `tsc`, `npm run build` and `npm run verify`, then 375px and 1440px on http://localhost:3000: section and nav order, every new link opens in a new tab with the right URL, the three copy buttons put the right text on the clipboard, nothing overflows or crowds at 375px.

## 4. Outcome (13 November 2026)

Implemented as approved on `built-prototypes-2026-11`, uncommitted. Lint, `tsc`, `npm run build` and `npm run verify` pass (6 Built cards toggle by keyboard; 79 external links open in a new tab; axe 0 serious). Checked at 375px and 1440px on http://localhost:3000 with a clean console.

| Item | Result |
|---|---|
| 1 | ProofFlow is card 02. The endpoint stays on one line, cut in the middle so ".../mcp" shows; on phones its label sits above it. The login wraps only between the label, the email and the password. The three copy buttons write the full endpoint, the email and the password, switch to a tick and announce "Copied". No horizontal scroll at 375px. |
| 2 | Vocab Coach is card 03 and matches Signal. |
| 3 | Sections run Impact, Built, Work, Experience; both menus read Impact, Built, Work, Experience, Skills, Contact. Every section has the same 86px top and bottom padding and no background, so the gaps are unchanged. |

- **Links:** live demos, both repos and the MCP endpoint respond (the endpoint answers an MCP `initialize` as ProofFlow). **The client-view link returns 404** on the ProofFlow app itself, probably a review link reset with the demo data. It needs a fresh URL from Faraz.
- **Open height:** 243px at 1440 and 486px at 375 for every card (ProofFlow's content).
