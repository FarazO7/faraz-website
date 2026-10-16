# Redesign progress

Branch: `redesign/capslock` (cut from `resume-sync-2026-10` at 25a6f8a).
Re-read BRIEF.md, SPEC.md and this file before continuing after a break.

- [x] Step 1: set up (branch, BRIEF.md, PROGRESS.md)
- [x] Step 2: inspect project, content baseline, content-check script, Lighthouse, before screenshots, commit (439faad)
- [x] Step 3: inspect the reference (compiled CSS/JS read; screenshots of home, Solution, Culture, Careers, Contact)
- [x] Step 4: write SPEC.md, commit
- [ ] Step 5: checkpoint, **waiting for Faraz's approval** (SPEC.md §0 lists the decisions)
- [ ] Step 6: implement, commit per major section
- [ ] Step 7: run and inspect in the browser
- [ ] Step 8: fix visual, responsive, a11y and functional issues
- [ ] Step 9: verify (build, lint, tsc, content check, Lighthouse, reduced motion, after screenshots, independent review), commit
- [ ] Step 10: final report

## How to re-run the checks

```bash
npm run build
node scripts/content-check.mjs compare          # local build vs baseline, four modes
node scripts/content-check.mjs compare --url=https://faraz-website.vercel.app
```

Screenshots and Lighthouse JSON go to `docs/redesign/screenshots/` (excluded
via `.git/info/exclude`, never committed). The screenshot and Lighthouse
helpers lived in the session scratchpad: Playwright, viewport 900px tall,
home at 1440/1024/768/390/320 and `/impact/risk-scoring/` at 1440/390,
scrolled through before the full-page shot; Lighthouse 12, three runs per
page and preset, medians.

## Notes

- Faraz's uncommitted October resume sync sits in the working tree. Never
  stage those files. Decision pending (SPEC.md §0).
- `npm ci` was re-run on 2026-10-16 to clear sync duplicates ("… 2") from
  `node_modules`; untracked duplicates in `app/`, `lib/`, `public/` untouched.
