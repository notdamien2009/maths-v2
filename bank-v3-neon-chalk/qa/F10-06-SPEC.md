# NOVA Maths F10-06 — Gradient Visual — premium review spec

**Authoritative prompt:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, heading `F10-06 Gradient visual`.
**Review status:** premium review build, not GOLD or owner-approved.

## Mathematical purpose and scope

Use a visible right-angle triangle on a straight line to teach gradient as **signed vertical change divided by signed horizontal change**, then transfer that relationship to speed on distance–time graphs and acceleration on velocity–time graphs. A vertical line has zero horizontal change and an undefined gradient. A negative velocity–time gradient measures negative acceleration, *not* necessarily negative velocity.

### Seven named KS3 presets, drawn from the master prompt

| Preset | Points A → B | Rise | Run | Gradient/rate | Context |
|---|---|---:|---:|---:|---|
| Y8-022 | (−3,−2) → (1,4) | +6 | 4 | +1.5 | Straight-line gradient |
| Y8-023 | (−2,3) → (2,−1) | −4 | 4 | −1 | Negative gradient, intercept |
| Y8-025 | (−3,−4) → (1,4) | +8 | 4 | +2 | Parallel lines have equal gradient |
| Y8-026 | (1,2) → (5,10) | +8 km | 4 h | 2 km/h | Distance–time speed |
| Y8-027 | (1,4) → (5,−4) | −8 m/s | 4 s | −2 m/s² | Velocity–time acceleration |
| Y8-028 | (1,5) → (5,13) | +8 L | 4 min | 2 L/min | Flow/rate of change |
| Y9-017 | (1,−3) → (5,3) | +6 m/s | 4 s | +1.5 m/s² | Signed velocity and acceleration |

Year 9 is a KS3-to-GCSE bridge, not an additional GCSE-only preset.

## Nine teaching stages

1. The coordinate studio / scales
2. Read points A and B
3. Horizontal run first
4. Vertical rise or fall
5. Show signed changes Δy and Δx
6. Build the traditional stacked gradient fraction
7. Compare gradients / parallels
8. Interpret gradient in context and units
9. Generalise to new coordinate examples

Each stage has its own teacher cue and mascot pose. Watch and Guided use the NOVA lesson engine; Explore is draggable; Challenge checks four different mathematical claims.

## Interactive and marking contract

- Explore: choose preset, drag either endpoint with snap zones to actual grid coordinates, adjust 4 sliders, focus endpoints and move with keyboard arrows, cancel with Escape, restore points or make a horizontal line.
- Challenges: (1) gradient `1.5` accepted within 0.001; (2) move B to `(2, −1)` (A fixed at `(−2,3)`) so gradient is `−1`; (3) acceleration `−2` m/s²; (4) speed `2` km/h. Correct answers and rise/run measurements are hidden in the challenge evidence panels before submission.
- Errors distinguish reversing the gradient fraction, dropping a negative sign, confusing velocity with acceleration, and using totals rather than differences.
- Correct checks reveal the mathematical evidence with a green ring, a NOVA mentor celebration pose and a positive outcome chip.
- An impossible zero-run configuration displays *undefined* and does not divide by zero.

## Rendering and integration

Self-contained HTML contains original NOVA shared core, CSS, embedded NOVA Chalk and authentic mascot assets. Uses `NOVA.svg.axes`, `NOVA.neonPlot`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.ui.svgDrag`, `NOVA.motion` and `NOVA.scene.helperStrip`.

The original F0-style premium navy stage with glass framing and neon/chalk annotations is reused exactly in design direction from the previous reviewed F10-02 through F10-05 family builds. Responsive widths cover 320, 380, 768 and 1280 pixels; lower controls and helper dock do not cover the mathematical graphic.

**Linked family:** F0-02, F0-14, F10-05, F10-07, F10-10 and F10-11 (F15-03 as a conceptual link). No GitHub writes.

### Known scope distinction

The master has generic instructions to drop cards onto matching graphs and to drag items into a red removal tray. These are not built in this engine: its meaningful interactive objects are the two continuous geometric endpoint markers, and removing them would destroy the gradient. Native grid snap, cancel, re-grab and keyboard equivalents are implemented. Do not label the generic card/tray sub-requirements as passed without further owner review.
