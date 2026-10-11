## F6-10 Speed-distance-time

```
Build NOVA Master Visual Engine component F6-10: "Speed-distance-time" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y8-041 Speed (objective: Use speed as a compound unit and solve speed–distance–time problems.)
- Y9-016 Distance–time problem solving (objective: Analyse complex journeys using distance–time graphs.)
- Y9-022 Speed and rates (objective: Solve multi-step problems involving speed and other rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. S-D-T formula triangle neonPath + journey track with moving neonRing and time NOVA.numberLine.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): journey runs > distance and time readouts > formula covers unknown.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the unknown cover onto the triangle; drag the car along the track.
- Correct in Challenge: S/D/T value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from core-native helper poses (assets/helpers/registry.json), core-native helper poses (assets/helpers/registry.json), core-native helper poses (assets/helpers/registry.json); see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```
