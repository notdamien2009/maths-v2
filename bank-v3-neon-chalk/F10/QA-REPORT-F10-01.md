# F10-01 Premium Review · QA Report

Build date: 11 October 2026. Status: **QA PASSED — OWNER APPROVAL PENDING**.

## Evidence-based checks

| Criterion | Evidence and interpretation | Outcome |
|---|---|---|
| Shared core | `F10/F10-01-four-quadrant-grid.html` was assembled from the project F3-01 premium embedded core (NOVA v3 house + v3.6.2 drag). `build/F10-01.src.html` uses `@@CSS@@` / `@@JS@@` for current-repository rebuild. | Pass for review candidate |
| Drawing primitives | `src/F10-01.js`: core `NOVA.neonPlot`, `NOVA.svg.axes`, `NOVA.neonRing`, `NOVA.neonPath`, `NOVA.chalkText`; no new SVG filter/style language introduced. | Pass |
| Typography / palettes | The shared embedded NOVA Chalk and colour-role tokens render at 380 and 1280; screenshots `shots/F10-01-380-explore.png` and `shots/F10-01-1280-explore.png`. | Pass |
| Plot accuracy | Unit axes −5..5, equal x/y mathematical increments, x/y signs verified in rendered guided end state, screenshots `shots/F10-01-380-guided-complete.png`. | Pass |
| Four modes | `tests/f101-results-380.json` and `tests/f101-results-1280.json`: Watch, Guided, Explore, Challenge render at both sizes and under both motion preferences. | Pass |
| Plotting controls | `src/F10-01.js` includes keyboard arrows / Home, x and y steppers, preset switching, reset and re-grabbable point placement. `*-results-*.json` tests keyboard movements and preset switch. | Pass |
| Pointer drag / snap | Tests move A(3,2) to (−1,−2) with browser pointer events in both widths and motion settings. Same tests cancel a second drag with Escape, verifying no stuck core drag. Core pointerup recovery handles detached SVG pointer capture. | Pass |
| Challenge maths | Three targets (−3,2), (4,−2), (−2,−4) solved via real keyboard input, at both widths / both motion modes. Wrong-answer and hint path exercised. | Pass |
| Mascots | Original core artwork and dock for Nova/Pip and Sir Bob; Challenge contains actual Izaac `teen` pack poses, reacting to hints, wrong attempts and 3/3 completion. `shots/F10-01-380-challenge.png`. | Pass |
| Responsive | No document-width overflow at 380 or 1280 across four modes, regular and reduced motion; full-page screenshots. | Pass |
| Build provenance | Component generated via local `assemble.py` from accepted F3 source, source kept separately, and `tools/rebuild_F10-01.py` uses exact current local core. | Pass |
| Interactive print / keyboard | Static fallback in definition; arrow/restore keyboard tests. Print fallback design inherited from core. | Partial evidence: no print-to-paper test |
| Console | No JavaScript `pageerror` in all four mode runs at both screen sizes, with both motion settings. | Pass |
| Physical touch-device trial | Automated Chromium mouse + keyboard tests only. Native touch testing remains for owner stress test. | Pending |
| Owner visual / pedagogy sign-off | Candidate must be visually compared beside F0/F1/F2/F3 in the actual environment. | Pending |

## Automated test totals

- 380px, regular and reduced motion: **32 passed / 32 run**.
- 1280px, regular and reduced motion: **32 passed / 32 run**.
- Overall: **64 passed / 64 run**, no skipped or failed checks in the two completed test files.

The tests report only the checks actually executed. They do not establish physical-device performance or owner GOLD approval.

## Locked master requirements and intentional decisions

- Named visual beats: axes → quadrants → A → B → C → D → read coordinates. This is seven teaching beats, not an arbitrary fixed four.
- Core F0-14 plotting layer supplies grid and axes. Labels are **replaced** with scalable chalk text because F0-14's inherited 10–11px labels are too small for the mobile premium standard; axis tick construction is not replaced.
- All algebraic/scatter variants reuse the same renderer and grid; they are lesson **presets**, not extra engines.
- Project's later F5 fraction lock supersedes old `fraction TBD` language, but F10-01 does not display fractions.
- Any future global plotting-helper changes must be approved and made in core first, not patched privately here.
