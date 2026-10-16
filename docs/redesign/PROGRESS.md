# Redesign progress

Branch: `redesign/capslock`, rebased onto `resume-sync-2026-10` at 31c86cd
(the October resume sync, committed at Faraz's request on 2026-10-16).
Re-read BRIEF.md, SPEC.md and this file before continuing after a break.

- [x] Step 1: set up (branch, BRIEF.md, PROGRESS.md)
- [x] Step 2: inspect project, content baseline, content-check script, Lighthouse, before screenshots, commit
- [x] Step 3: inspect the reference (compiled CSS/JS read; screenshots of home, Solution, Culture, Careers, Contact)
- [x] Step 4: write SPEC.md, commit
- [x] Step 5: checkpoint: approved as written, content base = October sync
- [x] Step 6: implement (one build-passing commit; sections depend on the shared tokens)
- [x] Step 7: run and inspect in the browser (1440, 1024, 768, 390, 320; reduced motion)
- [x] Step 8: fix visual, responsive, a11y and functional issues
- [x] Step 9: verify (build, lint, tsc, content check, verify suite, Lighthouse, reduced motion, after screenshots, independent review and its fixes)
- [x] Step 10: final report (`docs/redesign/REPORT.md`)

## How to re-run the checks

```bash
npm run build
node scripts/content-check.mjs compare          # local build vs baseline, four modes
npm run verify                                  # screenshots, glass budget, axe, keyboard
```

The baseline was recaptured from a build of 31c86cd after the checker's text
runs were fixed (commit 759effd) and re-verified at zero differences.
Screenshots and Lighthouse JSON live in `docs/redesign/screenshots/`
(excluded via `.git/info/exclude`, never committed).

## Notes

- `npm ci` was re-run on 2026-10-16 to clear sync duplicates ("… 2") from
  `node_modules`; untracked duplicates in `app/`, `lib/`, `public/` untouched.
