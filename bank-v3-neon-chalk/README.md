# NOVA F3-11 — Root Finder · F0 Aligned Premium Review

**Status:** Built and browser-tested; awaiting owner review. **Not GOLD.**

## Open

Open `F3/F3-11-root-finder.html` in a modern browser (offline, complete inline F0 CSS/JS and the F3-11 module). No remote dependencies.

## Curriculum / specification

- Y7-017 — Squares, cubes and associated roots: use a fixed area/volume and change the side/edge to discover the inverse.
- Y9-002 — Exact and approximate roots: show whether side² overshoots/undershoots the fixed target, and bracket the root between consecutive integers.
- Y9-003 — Fractional indices: interpret `125^{1/3}` with a *stacked Chalk fraction* via F0 maths text and an isometric cube.

The drawing contains the **approved NOVA number line** (`NOVA.numberLine`) with actual labelled integer ticks, a draggable estimate ring, a neon-glass square or a geometrically consistent isometric cube, and a live area/volume comparison. F0 mascot dock uses brief encouragement while Sir Bob narrates the five Watch teaching steps.

## Controls and four modes

- **Watch:** Five teaching stages, including an undershoot, overshoot and better estimate. Uses F0 motion and F0 timeline and narration hooks.
- **Guided:** Five controllable stages with step/back/scrub/reset from the F0 shell.
- **Explore:** Three curriculum presets plus shape, area/volume and side controls. Drag, keyboard arrows, ±0.1 buttons, Undo, Reset and the red Remove tray.
- **Challenge:** Four questions (sqrt 25 exact; sqrt 50 approximate to one decimal; cbrt 27; cube root of 125 interpreted as a one-third index). The learner must move the marker and supply a matching numeric answer. Premature answer revealing is prevented.

## Directory

- `F3/F3-11-root-finder.html`: finished standalone build
- `src/F3-11.js` and `src/F3-11.css`: editable component
- `core/nova-core.js` and `.css`: original approved bank core, unchanged
- `build/F3-11.src.html` and `build/build.py`: deterministic core + component inline build
- `shots/`: actual browser snapshots, 380px and 1280px modes and geometry presets
- `tests/`: executable browser and maths suites plus JSON results
- `QA-REPORT.md`: evidence-based gate outcomes

F0 JS SHA256: `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`
F0 CSS SHA256: `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`
These hashes match the supplied bank directly; core files were not edited.

## Review gates

The browser QA does not replace the owner's approval for the exact look, narration feel or mouse feel. Expanded character pose manifests were not present in the supplied bank; only canonical F0 helper poses are used, without invented artwork. This engine has not modified any earlier F3 or other family components.
