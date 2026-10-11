## F6-03 Sharing in a ratio

```
Build NOVA Master Visual Engine component F6-03: "Sharing in a ratio" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-059 Sharing in a ratio (objective: Divide a quantity in a given ratio.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Ratio bar boxes per share with total brace (as F4-07) plus counters dealt into shares.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): deal counters in ratio > boxes fill > one-box value > shares.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters/box values into shares.
- Correct in Challenge: each share correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from core-native helper poses (assets/helpers/registry.json), core-native helper poses (assets/helpers/registry.json), core-native helper poses (assets/helpers/registry.json); see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right. Speech: 'how many boxes altogether?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

