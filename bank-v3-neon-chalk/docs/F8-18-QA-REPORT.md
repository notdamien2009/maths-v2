# F8-18 QA report — Run 18 Premium Review Candidate

This is **not owner-approved GOLD**. Screenshots and browser tests exercised the inlined **F0-derived review runtime**; rebuilding with the latest GitHub-main F0 files and local Edge/touchscreen verification remain outstanding.

## Recorded completed tests

| Evidence | Result | Checks |
|---|---|---:|
| `tests/F8-18-math-results.json` / `tests/math_f818.py` | PASS — independent oracle for six equations, bracket sign and rounding | 2,696 |
| `tests/F8-18-browser-results.json` / `tests/browser_f818.py` | PASS — all four modes at 380 and 1280; undo and bracket direction | 48 |
| `tests/F8-18-challenge-results.json` / `tests/challenge_f818.py` | PASS — all six Challenges completed end to end | 140 |
| `tests/F8-18-pointer-results.json` / `tests/pointer_f818.py` | PASS — real pointer movement, F0 drag state release, undo/reset at both widths | 12 |
| `tests/F8-18-keyboard-results.json` / `tests/keyboard_f818.py` | PASS — keyboard ring movement and Enter, undo, hint, reset | 5 |
| `tests/F8-18-width-results.json` / `tests/width_f818.py` | PASS — six widths × four modes, no horizontal page scroll/errors | 120 |
| `tests/return_f818.py` | PASS — return zone drop clears F0 drag state at 380 and 1280 (two completed observations) | 2 |
| **Total** | **PASS** | **3,023** |

The six-preset Challenge suite verifies that entering a rounded answer before adequate bracketing fails; midpoint trials preserve the root, reduce interval width, and lead to the correct final rounded answer. It uses `data-certified` and `data-trials` from the actual in-browser engine.

## Source/visual checks

- `src/F8-18.js`: F0 helpers `NOVA.numberLine`, `NOVA.neonBox`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.ui.svgDrag`, `NOVA.scene.helperStrip`, `NOVA.motion` used. No private new rendering primitive.
- `src/F8-18.css`: component-scoped styles only. Existing fonts and colour roles. Reduced-motion and print overrides.
- `shots/F8-18-380-explore-stage.png`, `shots/F8-18-1280-explore-stage.png`: mobile/desktop board.
- `shots/F8-18-380-SQUARE-TWO-completed.png`: completed 3dp solution with a sign-changing final bracket.
- `build/build-f8-18.py`: resolves local core and writes only the F8-18 standalone HTML.
- No core JS/CSS replacement files in ZIP. No direct GitHub update.

## Issues found and addressed

1. Opening board too dense on 380px: increased SVG height, chalk sizes, interval spacing and table gutters.
2. Return-zone chalk text clipped by the F0 SVG glow filter at extended drawing coordinates: removed the filter **only on the return-zone label and box** while keeping NOVA's approved red/error role and chalk font.
3. Fast return-zone drag could strand the internal F0 drag object: local pointer capture recovery forwards release to F0 helper. Retested at both widths.
4. Final-answer leak: Challenge checks a proved bracket instead of accepting an unsubstantiated decimal answer.

## Not claimed

- No claim of a live rebuild against GitHub-main core (not provided as a local checkout in this ZIP).
- No claim of physical touchscreen testing or Windows Edge double-click testing.
- No claim of user sign-off. Owner stress-test and visual approval are mandatory before GOLD.
