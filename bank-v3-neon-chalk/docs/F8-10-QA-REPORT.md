# NOVA F8-10 — Run 10 Premium Review QA

**Status:** REVIEW CANDIDATE — NOT GOLD. **No GitHub changes.** Tested in headless system Chromium from in-memory HTML; this environment prevents direct `file://` browser navigation.

## Recorded tests (actual evidence)

| Gate | Result | Evidence |
|---|---:|---|
| Independent mathematical verification | **4,025 / 4,025 passed** | `tests/math_f810.py`, `tests/F8-10-math-results.json`: 1,000 independently generated distinct pairs and both valid elimination directions; wrong multipliers rejected, marker/undo checked |
| Browser and Challenge | **86 / 86 passed** | `tests/browser_f810.py`, `tests/F8-10-browser-results.json`: 380px and 1280px, four modes, every preset completed with keyboard graph movement and card choice, no JavaScript page exceptions |
| Real pointer/keyboard stress | **26 / 26 passed** | `tests/stress_f810.py`, `tests/F8-10-stress-results.json`: marker fast drag/invalid drop/return, keyboard ring return, multiplier rapid drag, placed-card keyboard removal at both widths |
| Responsive and mode safety | **96 / 96 passed** | `tests/width_f810.py`, `tests/F8-10-width-results.json`: 360, 380, 430, 760, 1280 and 1600 wide across Watch/Guided/Explore/Challenge; stage bounds and no horizontal overflow |
| Compiled output | **pass** | `node --check src/F8-10.js`; `python build/build-f8-10.py`; no unresolved placeholders, no external CDNs |

**Total test assertions recorded: 4,233 / 4,233 passed.** These are automated checks, not an owner GOLD approval.

## Visual comparison and hygiene

- 380px and 1280px Watch, Guided, Explore, Challenge screenshots and 10 completed-Challenge screenshots in `shots/`. Visuals compared against F0 Neon Tube + Chalk and sampled F2 premium layouts in source review.
- Stage: dark NOVA canvas, premium glow and depth, chalk-draw maths, role-coloured equation cards, a mobile-fit elimination stepper and plot axes from `NOVA.neonPlot` (`src/F8-10.js` `draw`, `src/F8-10.css`).
- Graph axes and lines are mathematical plot representations, not custom ruler/number-line primitives. The crossing marker is a neon ring, never a star.
- Challenge: numerical solution never exposed before success; incorrect multiplier direction, missing marker, wrong marker and swapped/missing x/y trigger targeted feedback (`src/F8-10.js` `check`).
- Mascots: existing F0 helper strip, separate Sir Bob narrator, single in-stage helper without duplicate footer cat (`src/F8-10.css`).
- Pointer recovery: marker uses the shared F0 SVG drag helper; a local window pointerup capture correction works around F0 element reparenting. The mobile red return-ring target avoids an impractically long on-screen drag. No F0 core changed.
- Print fallback and reduced-motion support are inherited from F0. No external libraries or network dependencies in the compiled HTML.

## Approval gates not yet verified

1. Recompile and regression-test with the current GitHub-main approved F0 JS/CSS rather than this inherited F0 preview runtime.
2. Open the packaged HTML directly in Windows Edge; local `file://` browser testing was blocked by browser policy here.
3. Physical touchscreen, assistive technology, and learner acceptance.
4. Owner side-by-side GOLD signoff versus F0/F2 canonical benchmarks and appropriate F3–F7/F12 comparison pages.

No approval or source replacement is implied by the recorded test results.
