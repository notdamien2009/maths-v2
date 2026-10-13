# F8 Run 13 · Index Laws in Algebra · QA evidence

**Status: PREMIUM REVIEW CANDIDATE; not owner GOLD; original F3-10 source was read from GitHub but was not present in this working container for a direct end-to-end canonical-variant build.**

| Gate | Evidence | Result |
|---|---|---|
| Exact master prompt | `docs/F8-13-SPEC.md`; prompt explicitly says PRESET of F3-10 | Matched |
| Canonical F3-10 integration | `build/extend-f3-10.py`: guarded, read-only source patch; creates separate F8 HTML from local `src/F3-10.js`; reuses its rendering and mathematical state; does not alter any F3-10, F0, F8-01 to F8-12 source. GitHub blob `a35879e84c24356b34e1369ff16a73cd357ee280`, 24,676 chars; all patch anchors and challenge-array match checked. | Source contract CHECKED; canonical compiler NOT EXECUTED here |
| Standalone preview | `F8/F8-13-index-laws-in-algebra.html`, `src/F8-13.js`, `src/F8-13.css`; sourced from the accepted F0-derived reference runtime in prior review packs | Self-contained browser review preview built and executed |
| Maths identities | `tests/math_f813.py` / `tests/F8-13-maths-results.json`: multiplication, division and powers with signed non-zero values, 378 identities | 378 / 378 PASS |
| Four-mode browser, all presets and answer marking | `tests/browser_f813.py` / `tests/F8-13-browser-results.json`: 380 and 1280 widths, all six presets, wrong-answer feedback, six linked Challenge tasks, no page errors or horizontal overflow | 84 / 84 PASS |
| Real pointer/undo/reset | `tests/stress_f813.py` / `tests/F8-13-stress-results.json`: real mouse drag from tile source into target in three mathematical routes, both widths, actual on-screen coordinates, undo, reset, drag state cleanup | 32 / 32 PASS |
| Responsive and modes | `tests/width_f813.py` / `tests/F8-13-width-results.json`: width 360, 380, 430, 760, 1024, 1280; Watch/Guided/Explore/Challenge; visible controls, stage dimensions, no overflow or JS errors | 120 / 120 PASS |
| Visual evidence | `shots/F8-13-380-*-page.png`, `shots/F8-13-1280-*-page.png`, completed challenge and final Explore pages; screenshots from Chromium | Captured |
| Mascots | Core `NOVA.scene.helperStrip`; core `NOVA.helperImg` for Izaac; step-specific Sir Bob captions; embedded core artwork; SVG alt text | Browser-viewable; native accessibility testing pending |
| Windows/Edge touch | No physical mobile or Windows Edge session used here | NOT TESTED |
| Direct canonical F3-10 compiled output | Requires owner to run `python build/extend-f3-10.py` alongside current GitHub `src/F3-10.js` | NOT TESTED in this container; do NOT claim GOLD |

**Automated review-harness total: 614/614 PASS.** This total is not a test count for the canonical F3-10 compiled variant. No core changes or GitHub writes were made.
