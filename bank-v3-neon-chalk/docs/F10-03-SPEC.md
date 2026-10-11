# F10-03 Midpoint and Distance — production spec

## Canonical source
`00-master/NOVA-MASTER-FOR-OTHER-AI.md`, `Family F10`, `F10-03 Midpoint and distance`; implemented as one component and the existing `F15-03 Pythagoras on a grid` preset (no duplicate engine).

## Purpose and years
- Year 8: Pythagoras through horizontal/vertical changes and a right triangle. Lesson Y8-045, Y8-046.
- Year 9: midpoint, distance and coordinate geometry reasoning. Lesson Y9-010, Y9-040.
- F15-03: Pythagoras on a coordinate grid, mapped to the same engine.

## Parameters, lessons and correct computations
- Config exposed as `F103_CONFIG`; editable A/B point coordinates in the domain [−5,5] with unit snap and midpoint half-grid snap.
- Named lesson presets: `Y8-045`, `Y8-046`, `Y9-010`, `Y9-040`, `F15-03`.
- For A(x1,y1), B(x2,y2), midpoint M=((x1+x2)/2,(y1+y2)/2), distance AB=sqrt((x2−x1)²+(y2−y1)²).
- Default A=(−3,−2), B=(1,1), changes 4 across and 3 up. Exact distance 5, midpoint (−1,−0.5).
- Y8-046 A=(−4,2), B=(2,−3), AB=sqrt(61), M=(−1,−0.5).
- Y9-010 A=(−4,−3), B=(4,1), gradient 1/2, AB=sqrt(80), M=(0,−1).
- Y9-040 A=(−3,3), B=(3,−1), AB=sqrt(52), M=(0,1).
- F15-03 A=(−2,−3), B=(2,0), 3–4–5 construction.

## Eight teaching beats
Plot A → plot B → horizontal distance → vertical distance → Pythagoras proof → halfway x → halfway y → generalise midpoint and distance. Sir Bob narration/prompt is distinct for every beat. F0 motion used for flashes and trails.

## Four modes
- Watch and Guided: eight named steps with Bob narration hooks and cues.
- Explore: pick a lesson preset, drag A or B with green-highlight snap targets, arrow-key re-grab and cancellation, toggle proof constructions, adjust coordinates with +/- buttons.
- Challenge: (1) drag M to midpoint (−1,0) with 0.5-grid snap, (2) evaluate integer distance 5 from a 3–4–5 triangle, (3) evaluate sqrt(52) as 7.21 or the exact surd 2√13. Misconception-specific marking, hints and Izaac peer. Do not leak expected values in the stage during active Challenge.

## Visual and inclusion guard
Uses only embedded canonical F0/F1/F2/F3 shared core APIs: NOVA.neonPlot, NOVA.svg.axes, NOVA.neonLine, NOVA.neonPath, NOVA.neonRing, NOVA.chalkText, NOVA.scene.helperStrip, NOVA.ui.svgDrag, NOVA.motion, NOVA.bankMount. Premium studio reuses accepted F10-02 background as F0 visual comparison, not sparse F10-01 appearance. No new custom font, SVG filter, maths drawing primitive, mascot, external library or duplicate core copy in source. Responsive 320/380/768/1280. Print uses clean simplified treatment.

## Acceptance
Owner review candidate, not GOLD approved. No GitHub changes. QA evidence included separately.
