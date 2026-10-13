# F8-16 — Production QA evidence

**Status:** PREMIUM REVIEW, not owner-approved GOLD.

## Test summary

| Suite | Checks | Evidence |
|---|---:|---|
| Independent model mathematics | 342/342 | `tests/F8-16-math-results.json` |
| Browser and end-to-end Challenges | 146/146 | `tests/F8-16-browser-results.json` |
| Real-pointer and recovery | 20/20 | `tests/F8-16-pointer-results.json` |
| Responsive and four-mode display | 120/120 | `tests/F8-16-width-results.json` |

**Total 628/628 automated checks passed**, with outputs saved for inspection.

## Requirements checked

| Requirement | Concrete evidence |
|---|---|
| F0-only rendering / controls | `src/F8-16.js:49` uses `NOVA.neonPath`; `src/F8-16.js:62` uses the shared SVG drag kit. |
| Six algebraically checked models | `src/F8-16.js:16` solver and `src/F8-16.js:19` preset validation; 342 recorded maths checks. |
| Complete mathematical cycle | `src/F8-16.js:25` placement and `src/F8-16.js:30` three-gate Challenge marking. |
| Drag, re-grab, undo, return | `src/F8-16.js:26` and the two `NOVA.ui.svgDrag` call sites; 20 real-pointer checks. |
| Animations and reduced motion | `src/F8-16.js:69` conditional F0 motion, `src/F8-16.css` @media reduced motion. |
| Mascot and short reactions | `src/F8-16.js:69` reuses F0 helper strip; `src/F8-16.js:100` verifies alt text. |
| 360/380/430/760/1024/1280 px | `tests/F8-16-width-results.json`; `shots/F8-16-380-*.png`, `shots/F8-16-1280-*.png`. |
| Four modes and challenge answer hiding | `tests/F8-16-browser-results.json` and staged screenshot comparisons in `shots/`. |
| Self-contained preview and additive local-core builder | `F8/F8-16-modelling-cycle-stepper.html`, `build/build-f8-16.py`; no core replacement included in ZIP. |

## Visual evidence

Representative `shots/F8-16-380-guided-board.png`, `shots/F8-16-380-explore-board.png`, `shots/F8-16-380-challenge-complete.png`, plus their 1280px equivalents. The initial empty-stage layout was revised to include numbered neon guide markers and two-column source cards on mobile; the desktop evidence overlap was corrected.

## Acceptance limitations

1. The reviewed standalone preview uses the prior F0-derived embedded runtime (`core` locally used for compilation is NOT shipped as a replacement). The GitHub `main` core was not fully integration-tested.
2. Real-pointer tests used Chromium mouse events at desktop/mobile widths, not a physical touchscreen.
3. The owner must compare against F0/F2 GOLD and approve before this component is treated as production GOLD.
4. This is an additional component; no GitHub branch or remote file has been modified.
