> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# F8-06 · QA Evidence Report

**Review status:** Premium review candidate, owner GOLD sign-off outstanding.

## Executed tests (11 Oct 2026)

| Gate | Passed | Failed | Evidence |
|---|---:|---:|---|
| Math | 1817/1817 | 0 | `tests/F8-06-math-results.json` + `tests/math_f806.py` |
| Browser | 228/228 | 0 | `tests/F8-06-browser-results.json` + `tests/qa_f806.py` |
| Stress | 24/24 | 0 | `tests/F8-06-stress-results.json` + `tests/stress_f806.py` |
| Width | 60/60 | 0 | `tests/F8-06-width-results.json` + `tests/width_f806.py` |

## Build Guard / source evidence

- **Source:** `src/F8-06.js` contains the `F806_CONFIG` with named presets, expected events and dependency declarations; exact master prompt read from `00-master/NOVA-MASTER-FOR-OTHER-AI.md`.
- **F0 helpers:** `src/F8-06.js` uses `NOVA.svg.root`, `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.ui.svgDrag`, `NOVA.scene.helperStrip` and F0 `NOVA.bankMount`. No private drawing toolkit.
- **Drawing, fractions:** `math()` in `src/F8-06.js` renders stacked fractions with chalk numerator and denominator above/below an F0 neon fraction bar; no deprecated TBD fractions.
- **Mascot:** `draw()` uses existing F0 helper strip and native Izaac helper image in Challenge, with alt text.
- **Modes:** `DEF.render`, `DEF.explore`, `DEF.challenge` plus bankMount supply Watch, Guided, Explore, Challenge.
- **Maths proof:** `difference()`, `ratioAt()`, `validate()` in `src/F8-06.js`; random symbolic-equivalence and solution-satisfaction checks documented in `tests/math_f806.py`. Non-zero divisor restrictions included.
- **Drags:** `NOVA.ui.svgDrag` integrated on each operation card and on the placed card; mouse stress covers fast placement, invalid drops, removal, regrab, reset at 380 and 1280. Keyboard `Enter` also checked.
- **Accessibility:** full card aria-labels, keyboard alternatives, aria-live feedback, reduced-motion CSS and JS, clean print CSS. Physical screen-reader operation not checked.
- **Desktop/mobile:** browser captures under `shots/`, including `F8-06-380-Y8-016-A-complete.png`, `F8-06-1280-guided-stage.png`, `F8-06-380-challenge-gated.png`; width matrix includes 360, 380, 430, 760, 1024, 1280.
- **Pupil hygiene:** development/spec information remains behind a collapsed details element, no raw markup on pupil stage.
- **Isolation:** additive pack excludes `core/`, all prior F8 files and any GitHub write.

## Manual review required

- Rebuild from current main-branch shared F0 core; the standalone currently uses the previous F8 local F0-derived runtime.
- Confirm physical touchscreen behaviour, iOS Safari scrolling/dragging, screen reader operation and full NOVA lesson integration.
- Owner review at 380px and 1280px in all four modes remains mandatory before GOLD.

## Screenshot inventory

- `shots/F8-06-1280-Y8-016-A-complete.png`
- `shots/F8-06-1280-Y8-016-L-complete.png`
- `shots/F8-06-1280-Y9-019-D-complete.png`
- `shots/F8-06-1280-challenge-full.png`
- `shots/F8-06-1280-challenge-gated.png`
- `shots/F8-06-1280-challenge-stage.png`
- `shots/F8-06-1280-explore-stage.png`
- `shots/F8-06-1280-guided-stage.png`
- `shots/F8-06-1280-watch-stage.png`
- `shots/F8-06-380-Y8-016-A-complete.png`
- `shots/F8-06-380-Y8-016-L-complete.png`
- `shots/F8-06-380-Y9-019-D-complete.png`
- `shots/F8-06-380-challenge-full.png`
- `shots/F8-06-380-challenge-gated.png`
- `shots/F8-06-380-challenge-stage.png`
- `shots/F8-06-380-explore-stage.png`
- `shots/F8-06-380-guided-stage.png`
- `shots/F8-06-380-watch-stage.png`
