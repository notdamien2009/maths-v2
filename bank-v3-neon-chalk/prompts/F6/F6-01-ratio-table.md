## F6-01 Ratio table

```
Build NOVA Master Visual Engine component F6-01: "Ratio table" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-058 Ratio notation and simplifying ratios (objective: Represent multiplicative comparisons with ratio notation and simplify ratios without changing the relationship.)
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)
- Y7-061 Unit price and best buy (objective: Compare value using unit rates.)
- Y8-034 Ratio with fractions and decimals (objective: Use ratios involving fractional and decimal quantities.)
- Y8-035 Direct proportion with tables and equations (objective: Represent direct proportion using scale factors, tables and equations of the form y = kx.)
- Y8-036 Direct proportion graphs (objective: Recognise and use straight-line graphs through the origin for direct proportion.)
- Y8-037 Inverse proportion in tables and graphs (objective: Recognise and represent inverse proportional relationships in practical, numerical and graphical forms.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass ratio table (neonBox cells, roving tabindex) with x k / divide k arrow pills (NOVA.svg.arrow) on both sides of rows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): base row > scale arrow > new row fills > missing cell resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag multiplier pills onto row gaps; drag values into empty cells.
- Correct in Challenge: missing values correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking. Speech: 'do the same to both columns'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

