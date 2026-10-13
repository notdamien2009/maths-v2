# NOVA F10-19 — Trigonometric Graph Explorer (sin, cos, tan)

**Status:** Premium review build; pending visual sign-off. **GitHub:** not modified.

## Master scope
Family F10: Coordinates and Graphs. F10-19 is a **GCSE extension** added during the audit. Unlike earlier family engines, the F10-19 master does not assign a Year 7–9 lesson mapping. Do not describe it as an existing KS3 lesson.

## Mathematical purpose
Link the rotating unit-circle angle to the sine, cosine and tangent graphs. Read exact special angles, investigate amplitude, period, phase and vertical displacement, and recognise that tangent is undefined wherever cosine equals zero.

## Parameters and named presets
- Angle `0° ≤ x ≤ 360°` in 5° increments; graph output window from −2 to 2.
- Model `y = A f(B(x − P)) + D`, where `f` is sine, cosine or tangent.
- Presets: GCSE-SINE, GCSE-COSINE, GCSE-TANGENT, GCSE-COMPARE, GCSE-AMPLITUDE, GCSE-PERIOD, GCSE-PHASE.
- For sine and cosine, `period = 360°/B`; for tangent, `period = 180°/B`.
- Tangent is undefined at angles satisfying `cos(B(x−P)) = 0`. No visual stroke is drawn across a discontinuity.
- Unit circle depicts the *normalised underlying trigonometric angle* even when amplitude or vertical shift changes the plotted output. Its horizontal coordinate is cosine, vertical coordinate is sine.

## Teaching design and interactions
- 16 named, narrated Sir Bob steps in Watch/Guided modes, from axes to sine, cosine, tangent and transformations.
- Explore: seven preset selectors; angle, amplitude, frequency, phase and shift sliders; 5-degree nudge; keyboard-adjustable/draggable graph marker and preset restore.
- Challenge: 13 questions with correct/incorrect feedback, hints and solutions; accepts `undefined` for tan 90°.
- Uses approved NOVA neon mathematical apparatus, chalk labels, F0 SVG plotting utilities, `NOVA.ui.svgDrag`, and shared `NOVA.challengeRun`.
- Announces value, correct, mode, step and hint events via core APIs.
- Reduced-motion handling and print stylesheet retained from the master.

## Misconceptions addressed
- Sine and cosine have different values at 0°, even though their shapes match.
- A peak, a period and an amplitude are different graph features.
- Tangent branches must *not* be connected through x=90° or x=270° (B=1, P=0).
- Frequency affects period inversely; horizontal phase shift is not a vertical translation.

## Locked F10 single-board layout
- Exactly one continuous outer frame with neon border/background pattern.
- Helper mascot and speech are direct children of the outer learning stage, not inside a second bordered panel.
- Plain chalk headings and teaching annotations directly on the board. Supporting mathematical evidence cards remain as established in F10-18.
- Self-contained HTML with embedded current shared NOVA core, fonts, scripts, SVG and styles; no external network assets.

## Linked components
F0-02 SVG drawing primitives, F0-14 axes and plotting, F10-18 graph interpretation. GCSE extension flag: YES.
