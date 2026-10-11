# NOVA F4-09 · Evidence-Based QA Report

**Run:** 09 · **Component:** Before-and-After Bar · **Review status:** NOT GOLD until owner approval.

## Results
- Browser/Mathematical: **128/128 PASS** (`tests/F4-09-BROWSER-RESULTS.json`). Actual Chromium at 380px and 1280px, all four modes; four complete challenge flows per width; error messages; accessible keyboard control; no page errors or horizontal overflow.
- Physical drag: **32/32 PASS** (`tests/F4-09-DRAG-RESULTS.json`). Normal and reduced motion × 380/1280; change drag-to-zone, invalid-area spring-back, red return, keyboard button equivalent, missing-value drag-to-zone and proof check.
- Pointer cancel: **20/20 PASS** (`tests/F4-09-CANCEL-RESULTS.json`). Escape and blur during live mouse drag, no stranded pieces or lingering active drag state, at both widths and motion preferences.
- Screenshots: **24 actual Chromium PNGs** at `shots/F4-09/`, including four modes plus four solved/unsolved mathematical contexts at both widths.

## Build guard evidence
| Guard | Evidence | Result |
| --- | --- | --- |
| Canonical F0 core only | `build/build-f4-09.py` SHA check; `F4-09-MANIFEST.json` hashes of actual existing F0 core JS/CSS | PASS; no core modified |
| Drawing language | `src/F4-09.js`: `N.svg.root`, `N.neonBox`, `N.neonPath`, `N.svg.arrow`, `N.chalkText` | PASS |
| Mathematics | `F409_MATH` exact before/after/percentage multipliers; four positive/negative challenge outcomes; reverse division; visible original-whole rule | PASS |
| Drag behavior | `src/F4-09.js`: `N.ui.svgDrag` zones + red remove + Escape/blur; actual Chromium tests in `F4-09-DRAG-RESULTS.json` and `F4-09-CANCEL-RESULTS.json` | PASS |
| Responsive legibility | `shots/F4-09/F4-09-380-challenge.png`, `F4-09-380-reverse-decrease-proved.png`, `F4-09-1280-watch.png`, no horizontal scroll | REVIEW |
| Mascot | `N.scene.helperStrip` and purpose-written short caption states in `src/F4-09.js`; Sir Bob narration slot each step | PASS |
| Four modes and hygiene | Eight-steps; Watch/Guided/Explore/Challenge, typed + keyboard alternatives, print CSS, no lesson/dev identifiers in pupil artwork, developer spec in collapsed toggle | PASS |
| Reproducible standalone build | `build/F4-09.src.html`, `build/build-f4-09.py`; generated HTML sha256 `15defab68def8446e21a72f184b1e90dba73642e8f98e0087446a6eacab0b6ad` | PASS |
| Owner acceptance | Side-by-side visual judgement and real-world stress by owner | **PENDING** |

## Notes
The original F0 core remains unchanged; source and references to it are included for local rebuilding, but the ZIP deliberately contains **no core/ files** to prevent overwrites. The preceding F4 components are untouched.

No GitHub commit, push or repository modification occurred.
