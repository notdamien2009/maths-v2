# NOVA F4-04 — Evidence-based Production QA

**Status:** technical tests PASSED; owner visual approval pending (NOT labelled GOLD).

## Build Guard evidence

| Guard | Source / evidence | Result |
|---|---|---|
| Exact F0 current core | `build/build-f4-04.py` verifies canonical Git blob IDs against `core/nova-core.js` and `.css`; deterministic build | Passed |
| Only approved helpers | `src/F4-04.js`: `N.neonBox`, `N.neonLine`, `N.neonRing`, `N.chalkText`, `N.motion`, `N.ui.svgDrag` (plus F0 scene/dock) | Passed in source inspection |
| Fraction notation | This percentage component uses no fraction notation; no deprecated `nv-frac-tbd` element appears in the eight browser modes | Passed |
| Stage appearance and readability | `shots/F4-04/F4-04-380-*`, `shots/F4-04/F4-04-1280-*`; visual crop corrected, mobile text made legible | Owner appearance gate pending |
| Pointer drag recovery | `tests/test_f404_drag.py`: valid / invalid, fast / slow, red return, Escape, keyboard delete in 380 and 1280 under reduced and normal motion | **40/40** |
| Mascot and tutor | `src/F4-04.js` `helper()` canonical `N.scene.helperStrip`; eight named `STEPS` for Sir Bob; images inherit F0 alt text | Passed source/browser |
| Hygiene, events, accessibility | `F404_CONFIG.events` fixed keys and `evt()` validation; developer spec moved into collapsed `details.nv-dev`; stable UI labels | Passed source/browser |
| Mathematical / browser QA | `tests/test_f404.py`, `tests/F4-04-BROWSER-RESULTS.json`: two viewports, all modes, three challenges, inverse problem, misconceptions, no overflow or console exceptions | **110/110** |
| Owner acceptance | Side-by-side visual and mouse-feel review against F2 premium and F4-01–03 required | PENDING |

## Maths evidence

- `£200 × 1.15 = £230`, `£230 × 0.90 = £207` — **not** £210 (adding percentages as if on the original).
- `£80 × 0.75 = £60`, `£60 × 0.90 = £54` — **not** £52.
- Inverse: final £90 after −25% means the intermediate was £120; preceding +20% means the original was £100.
- Answers cannot be accepted without carrying the intermediate amount into the subsequent stage.
- Initially concealed quantities are not present as answer labels in Challenge SVG; Challenge declares schematic layout.

## Tests run
- `tests/F4-04-BROWSER-RESULTS.json`: **110 passed, 0 failed**.
- `tests/F4-04-DRAG-RESULTS.json`: **40 passed, 0 failed**.
- Browser views: **380px and 1280px** in Watch, Guided, Explore, Challenge.
- Normal motion and reduced motion drag checks complete.
- No push, commit or GitHub write was performed.

## Owner review
Please inspect the visual density, colour continuity, mathematical stage hierarchy, pointer feel and teaching clarity. Any owner-requested changes should be applied to this Run 04 pack only and retested; do not mark GOLD until approved.
