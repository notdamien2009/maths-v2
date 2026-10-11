# NOVA Maths F8 Run 05 — evidence-backed QA

**Status: PREMIUM REVIEW CANDIDATE; NOT GOLD.** No GitHub changes and no independent mascot/source-core files delivered.

| Gate | Evidence | Result |
|---|---|---|
| Mathematical invariant | `tests/math_f805.py`, `tests/F8-05-math-results.json` — model equivalence of all 10 teaching/Challenge chains and 21 integer-sample x values per line across 5 lessons | **748/748 passed** |
| Browser and pedagogy | `tests/qa_f805.py`, `tests/F8-05-browser-results.json` — two widths, four modes, five presets, wrong-operation rejection, all Challenge tasks, answer gating, keyboard, undo, reset and no browser exceptions | **216/216 passed** |
| Pointer stress | `tests/stress_f805.py`, `tests/F8-05-stress-results.json` — real Chromium pointer movements at 380/1280, fast drop, re-grab to return, invalid drop, reapply, second step, reset and bracket operation | **26/26 passed** |
| Extra widths | `tests/width_f805.py`, `tests/F8-05-width-results.json` — 430/760/1024/1920 px, Guided/Explore/Challenge, horizontal overflow, valid track and 4-line two-sided unknown equation | **44/44 passed** |
| Actual renders | `shots/F8-05-[380,1280]-[watch,guided,explore,challenge]-stage.png`, plus 380px screenshots of the 3 complex Y8 presets | **11 screenshot files** |
| Source and JS syntax | `src/F8-05.js`, `src/F8-05.css`, `build/F8-05.src.html`, `node --check`, F0 helper-only SVG, custom F8 scoped CSS | **Pass** |
| Fraction lock | `src/F8-05.js`: `math()` emits traditional stacked fractions with `NOVA.chalkText` and `NOVA.neonLine` | **Pass** |
| Shared core protection | ZIP contains no `core/` replacement; `build/build-f8-05.py` reads your existing local core, never writes to it | **Pass** |
| No old F8 drift | New standalone engine ID `F8-05`; no rejected F8 files or old private drawing/filter implementation copied | **Pass** |

## Important release limits

1. This review HTML was compiled with the F0-derived **Run 02 local runtime** rather than the currently installed GitHub `main` files. Reference core SHA-256: JS `48400e5a068d3d3a36d76318e31accfb499a9fa7efe886498e5dc0caad6dc78b`, CSS `3534489c0b22bcdde43eab79fdc9d354c951e7330aac257970b205bbe5f3a4a6`. Rebuild and repeat QA on the user's approved F0 checkout before GOLD approval.
2. Real browser automation was Chromium desktop with 380px simulated mobile viewport. Physical touchscreen, Windows Edge double-click launch, physical screen reader, and NOVA lesson-engine integration remain **untested**.
3. Mascot pose source manifests described by the master do not appear independently in the currently mounted local bank; this preview reuses the existing F0 helper sprites and poses already embedded in core. Do not claim all requested pose-pack states have been audited.
4. Automated test counts are from the supplied JSON output (no unverified success claims). Owner controls final acceptance.

## User review focus

Check all four modes and the five lesson presets. Pay particular attention to Y8-014 both-sides removal, Y8-015 stacked fraction, tap-to-apply alternative and rapid mouse movement on operation pills. None of the four prior F8 runs is changed by this package except the family gallery link addition.
