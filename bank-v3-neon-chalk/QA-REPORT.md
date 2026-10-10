# NOVA F3-11 — Evidence-based QA Report

**Production status:** Premium Review (NOT GOLD). Build generated from `build/F3-11.src.html` using `build/build.py`.

| Master guard | Evidence / result |
|---|---|
| **1 Canonical core** | `core/nova-core.js` SHA256 `1e3a118ed3a38a087517…` and `core/nova-core.css` SHA256 `eaf043ca9db09bee17c0…` match the ORIGINAL supplied `bank-v3-neon-chalk/core` byte-for-byte. `build/build.py` inlines them using the two placeholder tokens in `build/F3-11.src.html`. |
| **2 Helpers only** | `src/F3-11.js` uses `NOVA.neonBox`, `NOVA.neonPath`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.numberLine`, `NOVA.motion.flash`, `NOVA.ui.svgDrag`. The number-line code is at `src/F3-11.js:75`; there are no separate custom tick loops. |
| **3 Fractions** | `src/F3-11.js` fractional preset rendered by canonical `NOVA.neonTile` + `NOVA.mt.render` syntax `125^{\frac{1}{3}}=5`; actual stacked fraction visible in `shots/F3-11-380-cube-stage.png`. |
| **4 Premium glass + mobile** | Main glass square/cube from canonical neon helpers. `shots/F3-11-380-square-stage.png`, `shots/F3-11-380-cube-stage.png`, `shots/F3-11-1280-square-stage.png` and `shots/F3-11-1280-cube-stage.png` show the board. Eight screen/mode checks in `tests/BROWSER-RESULTS.json`: 8/8 passed. No horizontal page overflow. Chalk labels in SVG are 27–63 SVG units, scaling to readable mobile sizes. |
| **5 Drag and keyboard** | `src/F3-11.js:80–96` core drag handle, discrete snap zones along the actual line and red Remove zone. `tests/fast_drag.py` verifies one-step cursor jump, rapid reversals, wrong drop, Escape, Remove at both 380px and 1280px with normal and reduced motion. **20/20 passed, zero stranded drags.** Slider/Arrow/Home/End and ±0.1 buttons are alternatives. |
| **6 Mascots & Sir Bob** | `src/F3-11.js:13–18` F0 helper strip with short prompts and F0 helper poses; Watch `STEPS` has dedicated detailed Sir Bob narration. All actual helper images derive from F0 and are observed for alt-text. Expanded pack80/pack60 pose manifests unavailable: **exact pose names not independently verified.** |
| **7 Hygiene/events** | `src/F3-11.js:2–10` fixed `CONFIG.events` key list; `evt()` asserts keys. Developer/spec details moved under `details.nv-dev` at file end; no visible developer labels. No game logic in engine. |
| **8 Evidence and QA** | `tests/MATH-RESULTS.json`: **1792 assertions, 0 failures**. `tests/CHALLENGE-RESULTS.json`: **10/10** browser proofs incl. full 4-question sequence at two widths. `tests/DRAG-RESULTS.json`: **20/20** physical drag checks. `tests/BROWSER-RESULTS.json`: **8** mode/width checks. `shots/` includes visual evidence. |
| **9 Acceptance** | **Awaiting owner side-by-side visual and interaction approval versus F2-01..F2-03. NOT marked GOLD.** |

## Mathematical tests

`tests/math_sweep.py` tests all target areas 2–144, all cube volumes 8–216, sqrt/cbrt, bracketing, allowed domain, numerical comparison, 0.1 quantisation, perfect-root accuracy and specific misconception feedback. **1792 passed, 0 failed.**

## Limitations

The drag implementation adds a narrow pointer-capture recovery handler in `src/F3-11.js`, because F0's SVG reparenting may lose capture in Chromium at fast speed. **The canonical core itself has not been altered.** The mobile and desktop appearance passed automated checks; the owner's visual sign-off is still required. Core F0 still has its available original mascot art; no extra manifest artwork was fabricated.
