# F8-11 · Premium Review QA Report

**Status: PREMIUM REVIEW CANDIDATE — NOT GOLD.** Tested without modifying GitHub or the F0 shared core.

## Actual verified checks

| Gate | Checks passed | Evidence |
|---|---:|---|
| Mathematics (independent generated affine & compound cases) | **1818/1818** | `tests/math_f811.py` and `tests/F8-11-math-results.json` |
| All modes / end-to-end six Challenges | **88/88** | `tests/browser_f811.py` and `tests/F8-11-browser-results.json` |
| Actual rapid pointer / return / keyboard | **22/22** | `tests/stress_f811.py` and `tests/F8-11-stress-results.json` |
| Wrong-boundary and misconception feedback | **14/14** | `tests/traps_f811.py` and `tests/F8-11-traps-results.json` |
| 360–1600px responsive layout | **112/112** | `tests/width_f811.py` and `tests/F8-11-width-results.json` |

**Total: 2054/2054 recorded checks passed.** This is automated evidence, not owner sign-off.

**Screenshots:** 20 PNG captures in `shots/F8-11/`, including 380px/1280px all four modes and all 12 completed-Challenge states.

## Design and pedagogy evidence

- **One shared F0 number line:** `src/F8-11.js` calls `NOVA.numberLine` for every tick, label and axis; no hand-drawn replacement ruler.
- **NOVA drawing:** `neonBox`, `neonLine`, `neonRing` and `chalkText` draw premium glass algebra cards, working steps, marker rings and shaded rays. No new filters or fonts.
- **Mathematically verified direction:** a negative affine coefficient reverses inequality direction. Unicode `≤` and `≥` were tested explicitly; one initial direction bug was found and fixed before release.
- **Compound values:** supports two independently movable boundaries, open/closed endpoint combinations and interval shading.
- **Challenge protection:** worked results are masked before correct submission; six tasks use same numerical kernel as the renderer. Separate wrong-answer tests confirm tailored feedback and no premature progress.
- **Drag cleanup:** F0 SVG drag helper plus local component-only pointerup release safeguard. Real invalid-drop, fast-drop, placed-marker removal, keyboard movement and ray selection were tested at 380px/1280px.
- **Responsive:** 360, 380, 430, 760, 1024, 1280 and 1600px, all four teaching modes, no page errors/overflow.
- **Mascots and speech:** short helper dock reactions, Bob narrated teaching beats, Izaac peer in Challenge, using images embedded in the F0 runtime.

## Build/source status

- F0-derived preview JS SHA-256: `48400e5a068d3d3a36d76318e31accfb499a9fa7efe886498e5dc0caad6dc78b`.
- F0-derived preview CSS SHA-256: `3534489c0b22bcdde43eab79fdc9d354c951e7330aac257970b205bbe5f3a4a6`.
- Compiler `build/build-f8-11.py` reads the EXISTING local `core/nova-core.js` / `core/nova-core.css`, and never modifies them. Local review `core/` is deliberately excluded from the ZIP.
- No external CDNs or network dependencies in compiled HTML. `node --check src/F8-11.js` passed and the precompiled preview has no unresolved template placeholders.
- Test browser: headless local Chromium via in-memory HTML, because direct `file://` testing is blocked in this environment.

## Limits / outstanding sign-off

1. Recompile with the exact latest GitHub-main F0 core and regression-test before integrating.
2. Confirm direct opening in your Windows Edge environment (not verified here).
3. Verify physical touchscreen and screen reader behaviour on real devices.
4. Owner visual review against F0, F2 and relevant F7/F12 benchmark screenshots; GOLD status is not asserted.
5. This review package is additive; it does not alter F0, other F8 builds, the master document, or GitHub.
