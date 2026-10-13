# NOVA F6-07 Map and Scale Drawing — Technical / Teaching Specification

**Premium review build; NOT owner-approved GOLD.** Exact immutable F0 core reused at its verified SHA-256.

## Maths purpose and lesson references
- **Y7-064:** scale drawings and maps; read and use simple scale factors.
- **Y9-021:** scales and similar drawings in multi-step contexts.
- Linked engines: F0-02 neon SVG, F0-03/F1-01 approved number-line apparatus, F0-04 interactions, F6-02 double number line. F4-07 referenced only as planned family connection.
- GCSE extension: 1:n map scales, compound unit conversions, similarity, scale-area/volume, bearings.

## Parameters, named presets, and mathematically verified values
`F607_CONFIG.presets` stores endpoints as the two orthogonal route displacements `dx`/`dy` in map centimetres and a rate `scale` in kilometres per map centimetre. Mathematically, `mapCm = hypot(dx,dy)` and `realKm = mapCm * scale`. SVG model scales physically with the exact same centimetre-to-pixel factor as the dedicated map ruler.

| Preset | dx,dy (cm) | Measured map cm | Scale km/cm | Correct distance km |
|---|---|---|---|---|
| Y7-064 school to park | 4,0 | 4 | 0.5 | 2 |
| Y7-064-library library to sports | 3,4 | 5 | 0.4 | 2 |
| Y9-021 country trail | 6,8 | 10 | 1.25 | 12.5 |
| Y9-021-urban museum to bridge | 5,0 | 5 | 0.75 | 3.75 |

## Mathematical visual apparatus
- Glass-frame neon schematic map with two named endpoints and an exact straight-line distance, plus subtle map grid and geographic wayfinding cues.
- **Graduated map-centimetre ruler** and **real-kilometres scale bar both use the *existing* `NOVA.numberLine`**, with true straight ticks and NOVA chalk digits. No home-grown number-line tick graphics.
- On narrow screens, long 10 cm rulers reduce numbered labels to even positions while retaining all physical ticks and correct interval spacing.
- Orange scale proof: 1 cm on map = `scale` km in real life. Result green, endpoint and scale identity remains labelled and uses separate visual roles.
- Scene resizes with mathematically exact pixels-per-centimetre so diagonal routes fit above the ruler at 380 and 1280 widths. Compass repositioned after overlap QA.

## Six Sir Bob narration/animation stages
1. Locate the two landmarks.
2. Join and measure between the *centres* of the markers.
3. Read the ruler in centimetres.
4. Read the first scale-bar division as kilometres per centimetre.
5. Multiply centimetres by kilometres per centimetre.
6. Justify the real-world distance in kilometres.

## Controls, assessment, events and misconceptions
Four full NOVA modes: Watch (F0 auto timeline), Guided (F0 narration + steps), Explore (three real physical drag elements), Challenge (four sequential two-field assessments). Explore provides separate draggable A/B ruler endpoints, snap zones on map markers, and a draggable 1 cm scale copy onto the scale-bar interval. Red return tray removes/snaps back, drag re-grabs after placement; keyboard shortcuts 1, 2, S, Delete and Escape supported. Fast-drag pointer release safeguard scoped to `.f607-drag`, **not** the F0 core. Expected events include `value`, `step`, `correct`, `hintUsed`.

Challenge asks for both map centimetres and distance in kilometres. Wrong feedback diagnoses: horizontal-only measurement on diagonal map, centimetre/kilometre unit confusion, dividing rather than multiplying, writing metres when kilometres were asked, empty/wrong entries. Numeric result is hidden until the solution is correct. Mathematical ruler ticks are intentionally available to measure, without leaking the final kilometre answer.

## QA / known limits
See `F6/QA-REPORT-F6-07.md` and `tests/` results for exact check counts. The real user-facing screenshot evidence is under `shots/F6-07/` for 380/1280 Watch, Guided, Explore, Challenge and the three further presets. Native touchscreen hardware and screen-reader device tests are not complete; neither is full lesson-shell integration. Parent/family gallery can integrate this additive F6-07 source after owner review.
