# NOVA F7-08 · Balance Scales — Premium Review specification

## Purpose and target lessons
Teaches equality, inverse operations and checking a linear equation. Coverage: Y7-033, Y7-035, Y8-013, Y8-014, with presets F7-09 (negative balloons and unknown on both sides) and F7-10 (cups and counters). GCSE bridge: signed linear equations.

## Parameters and mathematical contract
`F708_CONFIG.presets` contain integer `a,b,c,d` representing `ax+b = cx+d` and optional `skin` / display context. Only a unique **nonnegative integer** solution is accepted for the physically counted tiles. `F708_MATH.solution()` validates each preset. `F708_MATH.mathOp()` applies the **same** addition or subtraction to both sides, or divides **all four coefficients** by an integer when every coefficient divides exactly; answer checking uses substitution. This is not a general-purpose symbolic algebra solver.

## Modes and animation
Watch (six steps): empty pans → left load and visible physical tilt → right load at equality → subtract one from both → subtract two more from both → substitute x=4. Guided shares the named, narrated sequence with Bob slot, forward/back/scrub/play/reset from the core. Explore lets pupils select presets and manipulate tokens. Challenge asks for x in four equations, including a negative-units case.

## Interaction and misconception guard
- The x bag and one-unit weight have **different shapes**; a negative unit is a ring/balloon with a negative numeral and tail. Cups-and-counters is a visual preset, not a new engine.
- Core `NOVA.ui.svgDrag` handles lift, green valid zones, red Return zone, invalid drop recovery, Escape/pointercancel and keyboard equivalents. Click/keyboard buttons also add/subtract equal unit or x quantities or divide both sides when legitimate.
- Removing or adding one token starts a **staged unbalanced state**: the beam dips towards the heavier side, the stage reports why equality is broken, and the pupil can make the matching change on the other pan; otherwise the staged unilateral change restores automatically after ~4.8 seconds.
- Only matched side operations persist in the state and history; Undo reverses them. Wrong operations and invalid targets do not commit false mathematics.
- Misconception-specific feedback distinguishes copying a pan total, forgetting coefficient sharing, reversing a sign and changing only one side.

## Named presets
- Y7-033: `x+3=7`.
- Y7-035: `2x+2=8`.
- Y8-013: `2(x+2)=10` (physical representation is expanded `2x+4=10`).
- Y8-014: `2x+3=x+8`.
- F7-09: `2x−3=x+2` and `x−2=4`, with distinct negative balloons.
- F7-10: `x+2=6`, cups and counters skin.

## Dependencies
Canonical NOVA F0 core in `core/nova-core.js` and `core/nova-core.css`, identical SHA-256 to F7-07. The ZIP deliberately **does not contain copies of that core**. Rebuild only by placing this incremental ZIP into the existing canonical bank and running `python build/build-f7-08.py`. Standalone HTML already has immutable F0 core inlined.

## Owner acceptance gate
Review at 380px and 1280px with F2-01..03 benchmark side by side; stress-test for your device input and touch screen. Owner must approve GOLD status. No GitHub writes were made.
