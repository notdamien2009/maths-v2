## F9-11 Spot-the-rule puzzle

```
Build NOVA Master Visual Engine component F9-11: "Spot-the-rule puzzle" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-036 Sequence rules and structure (objective: Generate and recognise common sequence structures using precise term-to-term rules.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Mystery sequence cards with hidden rule; rule cards to test.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): reveal terms > test rule > match glows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag rule cards onto sequence.
- Correct in Challenge: rule correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip question, idea; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```
