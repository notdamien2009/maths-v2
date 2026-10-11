## F6-08 Direct proportion graph

```
Add a PRESET to NOVA Master Visual Engine component F10-05 "y = mx + c explorer": F6-08 "Direct proportion graph" (Family F6).
Reason it is a preset: proportion graph is y = mx with c = 0.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F10-05), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)
- Y8-035 Direct proportion with tables and equations (objective: Represent direct proportion using scale factors, tables and equations of the form y = kx.)
- Y8-036 Direct proportion graphs (objective: Recognise and use straight-line graphs through the origin for direct proportion.)
- Y9-020 Direct and inverse proportion graphs (objective: Recognise graphical signatures of proportional relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. core axes with straight line through origin (neonPlot), table link.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): plot points > line through (0,0) > read value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a point along the line; drag table values onto points.
- Correct in Challenge: k / reading correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from core-native helper poses (assets/helpers/registry.json), core-native helper poses (assets/helpers/registry.json), core-native helper poses (assets/helpers/registry.json); see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

