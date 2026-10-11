## F6-13 Proportion in geometry

```
Add a PRESET to NOVA Master Visual Engine component F14-11 "Similar shapes": F6-13 "Proportion in geometry" (Family F6).
Reason it is a preset: scale factors on similar shapes.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F14-11), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-064 Scale drawings and maps (objective: Use scale factors to interpret and construct scale drawings.)
- Y8-057 Similarity (objective: Use scale factors with similar shapes.)
- Y9-021 Scale factors and maps (objective: Use scale factors across drawings, maps and similar figures.)
- Y9-023 Density (objective: Solve density, mass and volume problems.)
- Y9-029 Similarity reasoning (objective: Use similarity to calculate missing lengths and justify relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two similar shapes (neonPath) with corresponding sides colour-matched and scale-factor pill.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): overlay > scale > matching sides glow > missing side.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a side length card onto the matching side.
- Correct in Challenge: missing length correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```
