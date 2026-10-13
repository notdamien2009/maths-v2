# NOVA F8-14 — Evidence-based Premium REVIEW QA

**Approval:** review only; current-core integration, Windows direct-file opening and physical touchscreen verification are outstanding.

**F8-14 source SHA-256 prefix:** `2349c3041f07c423`

| Test suite | Passed | Test evidence |
|---|---:|---|
| Independent algebra and misconception tests | 181/181 | `tests/F8-14-math-results.json` |
| Mode and Challenge UI walkthrough | 112/112 | `tests/F8-14-browser-results.json` |
| Physical pointer + regrab / return / invalid-drop | 14/14 | `tests/F8-14-stress-results.json` |
| Responsive widths and four modes | 96/96 | `tests/F8-14-width-results.json` |

**Total verified checks: 403/403.**

## Production guard evidence
- **F0 canonical core, no private core replacement:** `build/build-f8-14.py` imports only `core/nova-core.js`/`.css` from the owner checkout. The delivered ZIP excludes `core/` entirely.
- **Neon + Chalk drawing:** `src/F8-14.js`: `bx` delegates to `NOVA.neonBox`, `ln` to `NOVA.neonLine`, `txt` to `NOVA.chalkText`; screenshot `shots/F8-14-380-explore-stage.png`.
- **Proper fraction design:** `src/F8-14.js` renders the numerator, neon fraction bar and denominator at independent y positions; final fractional results use `answerInTray`, which also stacks components. No fraction-TBD placeholder.
- **Exact factor matching:** `pairs` maps whole factors by equality with unique denominator positions; `cancel` requires a valid uncancelled pair and factorised state; `verdict` requires all pairs cancelled. Tests: `tests/F8-14-math-results.json`.
- **Domain preservation:** each preset declares `exclude`, and `verdict` checks exclusion using the original denominator. Cross-verified via 19 x-values across every preset and 11 independent y-values. Screenshots of completed Challenge in `shots/F8-14-380-challenge-complete.png`.
- **Four modes:** `NOVA.bankMount` uses existing F0 Watch/Guided control and local Explore/Challenge callbacks. Evidence `tests/F8-14-browser-results.json`, stage captures for both widths.
- **Drag state and keyboard:** `NOVA.ui.svgDrag` with matching-drop and red-return/remove zones; keyboard Enter/Space and Delete; pointer suite `tests/F8-14-stress-results.json` validates real mouse movement, return and invalid-drop cleanup at 380 and 1280.
- **Responsive and reduced motion:** Six viewport widths 360/380/430/768/1024/1280, four modes; tests `tests/F8-14-width-results.json` include horizontal overflow and page errors. Test browser sets prefers-reduced-motion.
- **Mascots:** stage uses `NOVA.scene.helperStrip` (Pip/Nova via core) and `NOVA.helperImg` teen Challenge pose; no invented asset. Screenshot `shots/F8-14-1280-challenge-stage.png`.
- **Sir Bob teaching:** per-preset six-line narration array feeds F0 stepper, with a separate visible teaching evidence panel. `src/F8-14.js` declares `beats` and scene explanation.
- **Developer hygiene:** reusable config and declared event keys; full developer event log collapsed in `details.nv-dev` in `build/F8-14.src.html`.

## Limitations / follow-up
- Verified within a headless Chromium DOM against the F0-derived runtime available at build time, **not** yet the user’s current GitHub `main` runtime.
- Tests do not substitute for physical touchscreen, Windows Edge double-click open, tutor TTS audio listening, colour-blind testing or final teaching QA.
- The six presets are bridge/GCSE examples because the F8-14 master prompt does not provide lesson IDs; none are represented as final curriculum mappings.
- No production acceptance is claimed. Owner approves or requests corrections before Run 15.
