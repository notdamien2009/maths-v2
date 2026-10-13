# F8-12 Quadratic Solve Routes — Evidence-based QA

**Status:** PREMIUM REVIEW. This is not a GOLD sign-off or proof of actual NOVA lesson integration.

| Acceptance area | Evidence | Outcome |
|---|---|---|
| Exact master prompt | `docs/F8-12-SPEC.md`, `src/F8-12.js`; required three distinct representations, five named lesson presets | Implemented |
| Mathematical correctness | `tests/math_f812.py` and `tests/F8-12-math-results.json`: factor identities at 101 points/preset; discriminants; zero substitution; vertices; wrong-answer traps; factor, graph and formula choices | **585 / 585 pass** |
| Four modes & Challenges | `tests/browser_f812.py` + `tests/F8-12-browser-results.json`: five complete real-browser Challenges at 380 and 1280, answer initially hidden, correct values and solution evidence visible only upon success | **96 / 96 pass** |
| Real pointer + keyboard stress | `tests/stress_f812.py` + `tests/F8-12-stress-results.json`: real drag to left and right crossing, re-grab and reposition, Delete, state cleanup, both widths; page scrolled to draggable before drag | **18 / 18 pass** |
| Mobile/desktop layout | `tests/width_f812.py` + `tests/F8-12-width-results.json`: 380, 430, 760, 1024, 1280 and 1920 pixels × Watch/Guided/Explore/Challenge; verifies page width, SVG fit, in-bounds text and no page exceptions | **102 / 102 pass** |
| Visual evidence | `shots/F8-12-380-{guided,watch,explore,challenge}-stage.png`, 1280 equivalents; Challenge completion screenshots for both widths and all presets | Captured in Chromium |
| Fonts, colour & maths formatting | `src/F8-12.css`, `src/F8-12.js`: F0-derived neon + chalk, stacked quadratic formula, correct coloured glass panels, no raw `n/d` as teaching fractions | Code + screenshot inspected |
| Interaction bug resolution | Source order in `src/F8-12.js` puts return-tray glass **before** draggable rings; the original hit-test obstruction was corrected then the 18-pointer suite rerun | Fixed, verified |
| Shared core | `build/build-f8-12.py` inlines current local `core/` on owner's machine. Package deliberately does **not** contain core files. | Local-core integration pending |
| Developer data hygiene | Developer log in collapsed `details.nv-dev`; no raw component JSON/LaTeX in the teaching stage | Static inspection |
| Accessibility | Arrow-key alternatives, button labels, focusable rings, reduced-motion CSS, print CSS and screen-reader-friendly SVG description | Static/browser smoke; physical assistive-tech test pending |

## Limits / open approval gates
- Browser tests ran in automated headless Chromium with `set_content`, not by double-clicking a file in Windows Edge.
- The packaged preview uses an **F0-derived review runtime**, not independently downloaded/currently fingerprinted GitHub-main F0 core. Owner must rebuild locally and test the result.
- Physical touch devices, screen readers and complete NOVA lesson integration are not yet checked.
- Owner must compare F8-12 directly with the canonical F0 / premium F2 / F3 / F7 / F12 reference components and sign off.
- No GitHub changes made.
