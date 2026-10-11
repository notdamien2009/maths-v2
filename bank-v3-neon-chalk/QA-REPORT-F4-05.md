# NOVA F4-05 · Run 05 · Evidence-Based QA

**Status:** Technical checks passed; premium visual / GOLD acceptance **PENDING OWNER REVIEW**.

| Gate | Evidence | Result |
|---|---|---|
| Exact existing F5-11 engine | `build/build-f4-05.py` sha256 guard `dd92a126208246716ef653058e447122edfd356e6426e0044c8507bd3468a6dd`; matches Git blob `4282e9b62175b51b0fd3dc65bb0a10b9ae5765d6` (1184109 bytes) | Verified |
| No duplicate engine mathematics | `src/F4-05.bar-preset.js` implements presentation only; F5-11 `model`, `rat`, `challenge`, and `parseAnswer` remain; `window.F405_PRESET.parentEngine === 'F5-11'` | Verified |
| Drawing continuity | `src/F4-05.bar-preset.js` calls `N.neonBox`, `N.neonLine`, `N.neonRing`, `N.chalkText`, `N.ui.svgDrag`, `N.scene.helperStrip`; `F4/F4-05-fraction-of-amount-bar.html` contains F5-11 runtime | Verified in code |
| Exact fractions | Traditional stacked fraction function inherited from F5-11; `tests/F4-05-BROWSER-RESULTS.json` includes half-seven, five-sixths, zero and 6 2/3 Challenge | Passed |
| Four modes and responsive | `shots/F4-05/F4-05-{380,1280}-{watch,guided,explore,challenge}.png` captured with Chromium; `tests/F4-05-BROWSER-RESULTS.json` | Passed |
| Challenge grade and hiding | `tests/test_f405.py` exercises three actual F5-11 Challenge checks and hidden stage | Passed |
| Keyboard | `tests/test_f405.py` explores selection, reset, unit reveal and exact model | Passed |
| Drag, cancel and reduced motion | `tests/test_f405_drag.py` performs invalid and fast drop, return, normal drag, keyboard remove and Escape at two widths × two motion settings | Passed |
| Self-contained HTML | `F4/F4-05-fraction-of-amount-bar.html` contains inline source and core; requires no network | Verified |
| Source/core mutation | ZIP intentionally omits `core/`, `F5a/`, and previous F4 engines. GitHub read only. | Verified in ZIP manifest |
| Owner review | Side-by-side against accepted NOVA F0/F2/F4 design and real mouse feel | **PENDING** |

- Browser and maths regression: **104/104 passed** (`tests/F4-05-BROWSER-RESULTS.json`).
- Pointer / keyboard / motion regression: **36/36 passed** (`tests/F4-05-DRAG-RESULTS.json`).
- Total: **140/140 programmatic assertions passed**.

This does **not** certify GOLD; owner acceptance remains mandatory.
