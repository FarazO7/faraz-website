@AGENTS.md

# Project rules

- **Resume first.** `public/resume/Faraz-Ali-Product-Manager.pdf` is the source
  of truth for headline metrics. Update the PDF, then `lib/content.ts`.
  `npm run check:content` (also run as `prebuild`) enforces it.
- **One current role.** The current role is the single `current: true` entry
  at the top of `experience`; the title, company, tenure, metadata and JSON-LD
  derive from it. Never hardcode identity in `app/` or `components/`.
- **Single source.** All copy lives in `lib/content.ts`; components only render it.
- **Client anonymity.** Zamplitude's client is "a regulated GCC investment
  platform". Never name or infer it in copy, alt text, metadata, slugs,
  filenames or commit messages.
- **Copy style.** New or edited copy is British English with no em dashes (use
  a comma or colon). No site-wide punctuation or spelling pass on untouched copy.
- **Drafted copy.** Anything beyond verbatim resume text or existing content
  carries `// REVIEW(Faraz)`. No invented numbers, durations, team sizes, tools
  or client details.
- **Plan before code.** Write a plan (see `docs/change-orders/`) and get
  Faraz's approval before editing tracked files.
- **Branch, then preview.** Work on a branch and never push; Faraz pushes via
  GitHub Desktop and reviews the Vercel preview before merging to `main`.
- **Design system.** `docs/DESIGN.md` governs: one `.glass` primitive, at most
  6 live `backdrop-filter` elements per viewport, motion via transform, opacity
  and clip-path only, AA contrast on glass, `prefers-reduced-motion` respected.
- **Checks.** `npm run lint`, `npx tsc --noEmit` and `npm run build` pass
  before every commit; run `npm run verify` after UI changes.
