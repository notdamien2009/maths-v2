# F6-01 Ratio Table · Run 01 QA Report

**Status:** PREMIUM REVIEW CANDIDATE — NOT GOLD / NOT INTEGRATED.

| Gate | Evidence | Status |
|---|---|---|
| Canonical house style source | `build/F6-01.src.html` with F0 `@@CSS@@`, `@@JS@@`, `src/F6-01.css/js`; standalone built using the F0 runtime extracted from prior F4 production. No separate core included in ZIP. | BUILT, current GitHub core byte identity not rechecked |
| Maths correctness | `tests/math_f601.py`, 7 presets, 4 challenge answers, 500 random direct/inverse relationships and 500 reversibility checks, 1,039 assertions | **1039/1039 PASS** |
| JS syntax + registration | `node --check src/F6-01.js` and `node tests/test_f601_registration.js`, engine ID, 6 narration steps, 7 preset contracts, all three behaviour methods | PASS |
| Deterministic builder | `build/build-f6-01.py` run successfully on inherited F0 core, no external CDNs, built HTML ~1.18MB | PASS |
| Visual at 380px and 1280px | Browser navigation attempted via file:// and localhost; Chromium policy returned `ERR_BLOCKED_BY_ADMINISTRATOR` | **BLOCKED — NOT TESTED** |
| Four mode browser check | `tests/qa_f601.py` supplied; not executable in this managed browser | **BLOCKED — NOT TESTED** |
| Drag/pointer recovery | `NOVA.ui.svgDrag` wired to factor/value/return zones; keyboard equivalents implemented; real pointer QA unavailable | **BLOCKED — NOT TESTED** |
| Mascot image and narration QA | F0 `NOVA.scene.helperStrip`, authored per-step captions and Sir Bob narration; extended specific pose manifest unavailable | PARTIALLY INSPECTED — VISUAL PENDING |
| Pupil-visible hygiene | Developer event log collapsed in `<details class="nv-dev">`; no game loop; no raw markup or deprecated fraction marker in stage UI | STATIC INSPECTION PASS |
| Source consistency | Uses F0 core helper calls, no new SVG filters/drawing primitives; no custom numberline, no other family source changes | STATIC INSPECTION PASS |
| Owner approval | No user-side screenshot/interaction signoff and no live v21 integration | PENDING |

## Important run limitations
The original prompt demands passing browser snapshots and stress checks before calling an engine fully READY. This run cannot meet that gate under the current Chromium policy. Do not claim it is approved GOLD. Run the included QA on a local Chrome/Chromium + Playwright setup and inspect Watch, Guided, Explore and Challenge at desktop/mobile before acceptance.

## Build source identity
Source reconstructed from the approved F4-03 embedded F0 core; the source GitHub connector was read-only. The small extraction separators may differ from the current GitHub core: rebuilding through the included additive builder in your existing bank is the supported way to guarantee local-core identity.
