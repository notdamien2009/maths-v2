# F4-12 Rates Tape Diagram — specification

**Family:** F4 Bar Models and Part–Whole | **Master component:** F4-12 | **Lesson mapping:** Y8-041 Speed

## Mathematical purpose
Show that a rate is the quantity corresponding to one unit of another quantity. In speed contexts, distance = rate × time. The equal divisions of the time and distance tapes align exactly. The total distance, number of hours, and per-hour distance remain distinct and must carry the correct units.

## Parameters and named presets
- Equal divisions: 1–6, each one hour in the current set of speed examples.
- `kind` controls the hidden unknown: `rate`, `amount` (distance), or `units` (time).
- `Y8-041`: 150 km in 3 hours => 50 km/h.
- `DIST-4H`: 65 km/h for 4 hours => 260 km.
- `TIME-210`: 210 km at 70 km/h => 3 hours.
- `SPEED-DECIMAL`: 7.5 km in 3 hours => 2.5 km/h.
- Challenge tasks: 180/3=60 km/h, 55×4=220 km, 240/80=3 h.
- Additional examples are **context presets**, not assertions of verified curriculum lesson IDs.

## Teaching evidence
Seven stages: Read quantities -> One unit -> Copy equal units -> Match time/distance tapes -> Find distance for one hour -> Total distance -> Generalise speed = distance / time. Mathematical quantities are revealed only when the teaching stage reaches them. In the three Challenge tasks, the respective unknown is hidden until verified.

## Four modes
- Watch and Guided: 7 named step animations + Sir Bob narration.
- Explore: change context, calculate the unknown, drag the rate chip, and adjust the number of subdivisions where appropriate.
- Challenge: three distinct types of unknown, with mathematical and diagram evidence checks and misconception-specific feedback.

## Interactions
Canonical `NOVA.ui.svgDrag` only, no fork. The rate chip physically snaps to the first matched distance segment (green target), can be re-grabbed, and returns to the red tray. The gold unit divider snaps to one of six numbered targets. Keyboard equivalents: Enter places rate, Delete removes, arrow/Home/End controls unit-divider. Escape, invalid drops and pointer cancellation revert safely. One pointer at a time.

## Pedagogy and misconceptions
- Whole distance is *not* speed; per-hour distance requires division by hours.
- A rate added to an hour count is dimensionally invalid; multiply rate by hours for total distance.
- Time requires division of distance by rate.
- Each lower distance cell corresponds to exactly one upper time cell; a correct numerical answer does not by itself prove the diagram.

## Drawing, accessibility and reuse
NOVA `neonBox`, `neonPath`, `chalkText`, `neonRing`, `motion`, `scene.helperStrip` and canonical F0/F2 renderer. No CSS colour, glyph, filter, chalk face, mascot system or shared core change. Labels and motion preserve dark NOVA maths house style. Keyboard, semantics, reduced-motion, SVG alternative descriptions and print rules inherited from canonical core. The engine contains no game mechanics (F0-12 remains the games wrapper).

## Acceptance
Premium review build; QA screenshots at 380 and 1280 across all modes, mathematical checks, real mouse drag tests under normal and reduced motion, zero stranded pieces and deterministic rebuild. Owner visual acceptance and target learner testing remain outstanding: **do not claim GOLD**.
