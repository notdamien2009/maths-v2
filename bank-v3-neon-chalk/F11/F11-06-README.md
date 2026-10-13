# NOVA F11-06 · Polygon Angles Turtle · Premium Review

**Owner approval is pending. GitHub was not modified.**

## Deliverables
- `F11/F11-06-polygon-angles-turtle.html` — standalone offline HTML with embedded NOVA core, component CSS/JS and mascot assets.
- `src/F11-06.js` and `src/F11-06.css` — editable component-only sources, isolated from the shared core.
- `build/F11-06.src.html` and `build/build-F11-06.py` — reproducible builder. Copy these files into the existing `bank-v3-neon-chalk/` bank and run `python build/build-F11-06.py` **only when the original core is present**.
- `tests/test_f116.py`, QA JSON and manifest — evidence and reproducible browser/math tests.
- `shots/F11-06/` — screenshots of all four modes at 380px and 1280px plus irregular manipulation.

## Purpose and visual treatment
- Teaches the turtle's **exterior turns** around a polygon, distinct from its **interior angles**.
- Computes polygon vertices and exact exterior-turn angles with vector geometry; verified regular polygons from 3 through 10 sides, plus a draggable irregular convex quadrilateral.
- Shows one 360° circuit. Interior-angle total is `(n−2)×180°`; at one vertex interior plus exterior is 180°.
- Contains 14 narrative stages, Explore controls (presets/sides, turtle dragging, walk-by-vertex steps, irregular vertex dragging), and 8 Challenge questions with numerical answers and mathematical reasons.
- Turtle drag is directly captured and repainted each animation frame; a second vertex drag on the irregular quadrilateral retains Escape rollback, convexity protection, and keyboard arrows. Reason cards are also draggable.
- Same F0/F1 embedded CSS/JS core as reviewed F11-05, plus the repaired F11 background/container and larger F9-style mascot. All mascot/speech elements stay inside the theatre.

## QA and known scope
- **120/120 automated checks passed** across 380px and 1280px using desktop Chromium.
- Tests cover 3–10 side exterior sums, interior sums, regular equal turns, irregular convexity and angle totals, turtle and vertex pointer dragging, keyboard input, Escape rollback, all 4 learning modes, no pre-answer numeric card leaks, reason card drops and all 8 Challenge solutions.
- Screenshots and design QA completed, but owner stress testing remains required before GOLD approval.
- The irregular vertex is deliberately limited to a convex quadrilateral: concave polygons and multi-vertex dragging are outside F11-06's specified coverage.
- No separate audio media; F0 narration hooks and Sir Bob's named script slots are retained.

## Files unchanged
No `core/*`, old engines or GitHub files have been edited. Deliverables are additive F11-06 files only.
