## F6-12 Currency and unit bridges

```
Add a PRESET to NOVA Master Visual Engine component F18-02 "Unit-conversion bridges": F6-12 "Currency and unit bridges" (Family F6).
Reason it is a preset: same conversion bridge.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F18-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-039 Currency conversion (objective: Convert currencies using given exchange rates.)
- Y8-043 Compound-unit conversion (objective: Convert and compare rates expressed with compound units.)
- Y9-024 Mixed compound units (objective: Solve unfamiliar problems involving compound rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Bridge of linked unit pills (neonCard) with conversion factors on arcs (NOVA.svg.arc).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): start unit > cross each bridge (x factor) > end value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag factor pills onto bridges.
- Correct in Challenge: converted value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

