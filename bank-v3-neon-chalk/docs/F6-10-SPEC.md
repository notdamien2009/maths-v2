# F6-10 Speed–Distance–Time — implementation specification

**Status:** Premium review candidate, awaiting owner visual review and live lesson integration. The locked F0 files are unchanged.

## Teaching purpose
Connect distance, elapsed time, and average speed using one coherent journey model and the traditional D/S/T formula triangle. Distance = speed × time; speed = total distance ÷ total time; time = distance ÷ speed.

## Parameters, modes, named presets
- `F610_CONFIG`: lesson ID, context, `distance` in km, `time` in hours, `target` speed/distance/time, and ordered legs `{d,t}`.
- `Y8-041`: 90 km in 1.5 h, speed unknown (60 km/h).
- `Y9-016`: three legs of 60 km / 1 h, 30 km / 1 h, and 90 km / 1 h; total 180 km in 3 h, average speed unknown (60 km/h). The graph position uses actual leg-time durations.
- `Y9-022-distance`: 72 km/h for 2.5 h, distance unknown (180 km).
- `Y9-022-time`: 165 km at 55 km/h, duration unknown (3 h).
- Watch: seven named stages, Sir Bob narration slots, F0 motion and reduced-motion fallback.
- Guided: core step/play/pause/scrub controls, prompts and state transitions.
- Explore: draggable neon vehicle progress ring (five snap stops) and formula-cover ring (drop on D/S/T), with red return tray and keyboard arrow/Delete alternatives.
- Challenge: four sequential calculations with numerical answers and units, diagnostic marking, hint support and celebration.

## Visual geometry and dependencies
Stage uses original F0 `NOVA.neonPath`, `neonLine`, `neonBox`, `neonRing`, `chalkText`, `numberLine`, `neonCard`, `ui.svgDrag`, `motion`, `scene.helperStrip` and `bankMount`. Color semantics are inherited; no independent neon filters, fonts or shapes are introduced. The existing F0 core JS and CSS are inlined only into the standalone preview, and are deliberately NOT shipped as replacement core files.

## Interaction contract
Emits `step`, `value`, `correct`, and `hintUsed`. Invalid drops spring home; re-grab works; matching F0 release fallback is **component-local**. For the Y9 multi-leg journey the live position on the timeline is calculated from leg time (not naive proportional distance); Challenge never reveals the missing value or corresponding unit result before marking.

## Misconception traps
Reversed speed fraction, using multiplication to find speed, dividing to find distance, choosing wrong time units, using only one leg instead of whole journey, treating average speed as a simple mean across unequal-length time segments.

## GCSE extension flag
Compound measures, journey stage gradients, average speed with nonuniform legs and multi-step rates.

## Accessibility & output
380/430/768/1280px layout checks; SVG alternative descriptions; keyboard and reduced motion; black-and-white print CSS; no external scripts or images; no game logic. Full browser QA results are in `tests/`. Native touch and lesson shell integration are not claimed as tested.
