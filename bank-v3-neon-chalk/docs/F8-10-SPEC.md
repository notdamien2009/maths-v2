# NOVA F8-10 · Simultaneous Equations — Component Specification

**Status:** Premium review candidate, not GOLD. **Source:** master prompt `00-master/NOVA-MASTER-FOR-OTHER-AI.md` F8-10; owner house style F0 Neon Tube + Chalk; approved F5 stacked fraction notation retained (this particular component contains no fractions in its displayed presets).

## Teaching purpose and lesson coverage

Show that the solution of two simultaneous linear equations is the coordinate pair where their two graphical relationships intersect, and demonstrate the same result by algebraic elimination. The engine is reusable and is not hard-coded to one lesson.

- Year 8 `Y8-029`: graphical simultaneous equations. Presets A (first-quadrant crossing), B (negative x), C (negative y).
- Year 9 `Y9-009`: coordinates and algebra. Presets A (negative x and y), B (half-unit x intersection).
- Extension: signed gradients, algebraic elimination with negative coefficients, half-unit roots and checking both original equations.

## Mathematical kernel

Two linear rules `y = m₁x + c₁`, `y = m₂x + c₂` with `m₁ ≠ m₂`.

- Graph intersection: `x = (c₂ − c₁)/(m₁ − m₂)`, `y = m₁x + c₁`.
- Equivalent simultaneous system: `y − m₁x = c₁`, `y − m₂x = c₂`.
- Multiply the two equations by `+1` and `−1` (or reverse) so the y terms cancel. Combine: `−m₁x + m₂x = c₁ − c₂`.
- Accept a Challenge only when BOTH multipliers are valid opposites, the graph ring is at the common coordinate, AND pupil-entered `x` and `y` match the actual solution. In all other cases, give misconception-specific feedback without accepting the response.
- Numerical calculation is deterministic; no eval, remote maths library or external data.

## Visual and animation contract

- Graph: `NOVA.neonPlot` (F0-14) generates the Cartesian axes, grid and coordinate mapper. Two straight line segments are clipped mathematically at the graph bounds, drawn through the core plot line and premium `NOVA.neonPath` layers. Blue and cyan distinguish independent rules; algebra cards and solution ring reuse F0 colour roles.
- Main board: premium F0 `NOVA.neonBox` and `NOVA.chalkText` with existing house colours, chalk labels and role glow. No novel drawing helper or font added.
- Elimination: two independent glass equations with attached multiplier slots, a proof card and a pair of signed multiplier cards. Same mathematical state feeds both graph and proof.
- Seven teaching stages: understand, plot A, plot B, find crossing, select multipliers, eliminate/solve, verify. The animation timeline and Sir Bob narration use the standard F0 mount and timeline.
- `Watch`, `Guided`, `Explore`, `Challenge` all implemented; paper/print fallback and reduced motion inherited.
- Mobile: tall stacked board at <=760px, desktop: graph at left and equation/proof cards to right. Main drawing occupies the stage and does not leave empty bands.

## Interaction contract

- Drag the answer ring to an x,y grid location; snap its coordinates to 0.5 units; arrow keys move it in half-unit steps. A small RED return target by the plot allows a mobile pupil to return the ring without a long scroll; Delete or Backspace also return it.
- Drag signed cards into Equation A/B multiplier sockets; one card cannot occupy both. Keyboard Enter or Space places a card; Delete/Backspace removes a placed card. Wrong drops spring back; pointer capture is cleaned up.
- Undo/reset, hints, independently entered x/y fields, Challenge marking, five consecutive tasks, next-task gating, stage-specific mascot captions.
- Only one in-board mascot appears; duplicated cat graphic beside the Bob narration panel is hidden for this engine. Standard Bob portrait stays.

## Source and shared core

The working source is `src/F8-10.js` and `src/F8-10.css`. The wrapper `build/F8-10.src.html` accepts the current local shared F0 runtime using `build/build-f8-10.py`. The preview currently embeds an F0-derived working runtime (SHA-256 `48400e5a068d3d3a36d76318e31accfb499a9fa7efe886498e5dc0caad6dc78b`). The ZIP deliberately **does not contain shared core replacements**. Current GitHub-main F0 compatibility is an owner integration gate.
