# F4-03 · Run 03 · Evidence-Based QA Report

**Status:** Implemented; automated browser and drag QA passed. Owner premium/GOLD approval pending. GitHub unmodified.

| Build guard | Concrete evidence | Status |
|---|---|---|
| 1. Current canonical core | `build/build-f4-03.py` validates Git object SHA `45b41ce94d27ed63e877faac6023e483855da76d` (JS) and `aad5139b1a5de01983efcb78dee6aabf917ea0a4` (CSS); output is a self-contained HTML built from placeholders. Zip does not replace the canonical core. | PASS |
| 2. Core helpers only | `src/F4-03.js` uses `N.svg.root/grid/brace/pill`, `N.neonBox/neonLine/neonRing`, `N.chalkText`, `N.mt.render`, `N.ui.svgDrag`, `N.scene.helperStrip`, `N.bankMount`; no new filters, primitives or custom number lines. | PASS |
| 3. Proper fraction notation | Watch final step uses the F0 mathematics renderer for stacked `2/6 = 1/3` (not raw slash text or the obsolete `fraction design TBD` marker). | PASS |
| 4. Premium Neon Tube + Chalk | `shots/F4-03/F4-03-{380,1280}-{watch,guided,explore,challenge}.png`: 8 full engine screenshots; 10 glass rods, numbered grid, distinct rod lengths, active green drop zones from core. | Implemented; owner visual review pending |
| 5. Drag physics, recovery, keyboard | `tests/test_f403_drag.py`, `tests/F4-03-DRAG-RESULTS.json`: 44 checks, both viewports, reduced/normal animation, add to A/B, move between tracks, red return, reject over capacity, 1-step fast drag, Escape and no stranded transforms. `tests/test_f403.py` also checks keyboard reorder, remove and switch. | **44/44 PASS** |
| 6. Mascots and narration | Seven Sir Bob teaching narrations in `STEPS`, and short pose/caption dock states via canonical `N.scene.helperStrip`. Embedded original F0 mascot assets reused; no independent external pose manifest substituted. | PASS for inheritance; extended manifest audit pending |
| 7. Hygiene, events, accessibility | Declared fixed value event key list, no pupil-visible dev spec (collapsed `details.nv-dev`), labelled SVGS/keyboard controls, no overflow, reduced-motion fallback, print fallback inherited from core. | Verified in automated paths |
| 8. QA with evidence | `tests/test_f403.py`, `tests/F4-03-BROWSER-RESULTS.json`: 100 checks for all modes and viewports, six arithmetic/misconception conditions, all 3 challenge rounds and keyboard actions; no JS errors. | **100/100 PASS** |
| 9. Owner acceptance | Side-by-side against F2/F4-01/F4-02 at desktop and mobile, real-world mouse/touch and styling judgement. | **PENDING — not GOLD** |

## Mathematical proofs

- 6 = 2 + 2 + 2, so one 2-unit piece is one third of the 6-unit whole; 2/6 = 1/3.
- 3 + 5 = 8; two unequal pieces can match one 8-unit rod.
- 2 + 3 = 5, and 5 is half of 10.
- All train lengths must stay within 0–10 units. No rod can be stranded outside its tray or a valid track.

## Limitations

- Desktop and responsive Chromium checks are automated; target learner device and assistive-technology checks remain outstanding.
- Mascot poses are those in the current embedded F0 core; the separately named external pose packs are not in this GitHub upload.
- This is a Cuisenaire-inspired teaching apparatus following the established NOVA role-colour palette, not a promise to reproduce every conventional physical rod colour.
