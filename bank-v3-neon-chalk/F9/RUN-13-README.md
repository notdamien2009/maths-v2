# NOVA F9-13 · Fractal Generators — Run 13 premium review

**Status:** Owner review build, **not GOLD**. GitHub remains completely unchanged.

## Spec card
- **Maths purpose:** Explore repeated geometric changes as sequences, and distinguish the number of surviving triangles, number of curve segments, and total curve length.
- **Year groups:** KS3 Years 7–9 mathematical extension, with an optional GCSE geometric-sequences bridge. No invented lesson IDs or claims of syllabus requirements.
- **Parameters:** fractal type, iteration 0–4, Sierpiński piece factor 3, Koch segment factor 4, Koch initial length 9 cm.
- **Presets:** `sierpinski-triangle` (1, 3, 9, 27, 81) and `koch-curve` (1, 4, 16, 64, 256).
- **Six named teaching steps:** whole triangle → remove the middle → repeat subdivision → generalise count → Koch four-for-one → Koch repeated counting and length.
- **Correct responses:** task 1 (Sierpiński iteration 3) = 27 small triangles; task 2 (Koch iteration 2) = 16 segments; task 3 (Koch iteration 2 starting at 9 cm) = 16 cm total length.
- **Interaction:** Watch and Guided use the normal F0 timeline. Explore offers a genuine SVG iteration-ring drag using `NOVA.ui.svgDrag`, keyboard arrows, native range and removal/reset tray. Challenge allows drag/drop, wrong-answer explanations, keyboard source/target selection, answer re-grab, red removal tray and Escape cancellation.
- **Misconception traps:** counting removed triangles, adding rather than multiplying, confusing segment length with total length, counting one iteration too far or short.
- **GCSE flag:** extension/bridge, not a separate GCSE engine.
- **Links:** F9-06, F9-07, F9-10.

## Design continuity and QA
- Shared approved NOVA F9-01 v3 algebra-pattern background, premium frame, original Chalk writing, F0 neonPath/ring/box, one existing canonical mascot dock only; no custom replacement backdrop or new drawing primitives.
- 18 desktop/mobile screenshots (6 Watch steps + Guided/Explore/Challenge at each of 380px and 1280px).
- **164/164** checks pass: visual consistency, mathematics, presets, step navigation, modes, keyboard, and all Challenge tasks.
- **28/28** rapid pointer drag checks pass, including slider-to-iteration, range sync, wrong/right snap, re-grab/remove and Escape.
- Byte-identical standalone rebuild confirmed using the original working F3 runtime; reproducibility evidence included.

## Integration guard
The checked-in older `core/nova-core.js` is not yet in step with the premium F3 reference, particularly `NOVA.motion` and `NOVA.ui.svgDrag`. This bundle deliberately does not overwrite shared core files. Its build helper expects the locally available `F3/F3-01-array-builder.html` and extracts its existing core. Reconcile core as a SEPARATE authorised task, never silently as part of F9.

Extract the ZIP over your local `bank-v3-neon-chalk/` tree, test the standalone HTML, and review the screenshots. Do not mark GOLD until inspected and approved.
