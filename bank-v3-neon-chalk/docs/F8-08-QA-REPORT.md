# F8-08 Equivalence Checker — evidence-backed QA

**Status: PREMIUM REVIEW CANDIDATE — NOT GOLD / NOT LIVE-INTEGRATED.**

| Gate | Measured result | Verifiable evidence |
|---|---:|---|
| Exact algebra and counterexamples | **325/325 passed** | `tests/math_f808.py`, `tests/F8-08-math-results.json` |
| Four teaching modes and end-to-end Challenge | **110/110 passed** | `tests/browser_f808.py`, `tests/F8-08-browser-results.json` |
| Six mobile/tablet/desktop widths | **72/72 passed** | `tests/width_f808.py`, `tests/F8-08-width-results.json` |
| Pointer, re-grab, keyboard Enter/Delete | **14/14 passed** | `tests/stress_f808.py`, `tests/F8-08-stress-results.json` |
| Script syntax | `node --check` passes | `src/F8-08.js` |
| Existing-core builder against local preview-source copy | passes, SHA-256 recorded | `build/build-f8-08.py`; no `core/` files in ZIP |

All above suites were **re-run after the last visual changes**. Total 521 / 521 tested assertions pass. Browser test uses Chromium `set_content` with embedded self-contained HTML, 380px and 1280px widths, plus width matrix at 360/380/430/760/1024/1280. Independent Python formula calculations checked five presets at 61 integer values each (-30 through 30). Final answers use exact symbolic polynomials, not numeric sampling. An accidental sample match is expressly rejected as proof. Every Challenge preset is completed by actual browser clicks after verifying truth is initially hidden. The stress test uses real mouse movement and returns a placed card to the remove zone, and checks that the F0 drag state clears.

**Visual evidence:** `shots/F8-08-380-*-stage.png`, `shots/F8-08-1280-*-stage.png`, and ten `*-completed.png` files document completed mathematics. The final mobile screenshot `F8-08-380-Y9-006-C-completed.png` displays x² vs x, showing the counterexample at x=2. Neon panels, gradient/glow, chalk text and mascot dock use F0 functions and legacy NOVA artwork.

**Known limits:** The managed Chromium environment blocks direct `file://` page navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`). Desktop/mobile testing used in-memory HTML and was successful, but Windows Edge double-click testing is pending. The standalone preview embeds an earlier F0-derived runtime, not a verified byte-identical checkout of the current GitHub core. Recompile with existing local `bank-v3-neon-chalk/core` and retest before GOLD. Native touchscreen/physical assistive technology and integration with the full lesson engine remain untested. Owner sign-off required.

**Source isolation:** `src/F8-08.js` and `.css` are additive; `F8/F8-08-equivalence-checker.html` is standalone. `F8/F8-08-gallery-entry.json` is an entry suggestion, **not** an overwrite of the owner’s existing gallery. No F0, F7, other F8, or GitHub files changed.
