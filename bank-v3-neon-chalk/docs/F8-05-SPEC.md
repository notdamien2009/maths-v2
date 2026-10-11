# NOVA F8-05 — Both-sides Equation Solver · Premium review candidate

**Source:** GitHub `notdamien2009/maths-v2` → `bank-v3-neon-chalk/00-master/NOVA-MASTER-FOR-OTHER-AI.md`, exact F8-05 prompt. This is a fresh build, not the rejected F8 code.

## Mathematical purpose

Make the equality invariant visible: the same operation is performed on each side of a linear equation. The worked column records equivalent equations; a neon balance beam shows both sides, and the single centre socket applies the operation simultaneously to both sides. Expanding a bracket is explicitly modelled as an **equivalent rewrite of one expression**, not as an inverse operation to both sides. The original expression and expanded expression have equal values.

## Lesson presets

| Preset | Teaching example | Named operations | Challenge variation |
|---|---|---|---|
| Y7-033 | `3x + 5 = 20` | subtract 5, divide 3 | `4x + 7 = 31`, x=6 |
| Y7-035 | 2 tickets plus £6 fee = £18 | subtract 6, divide 2 | `3x + 4 = 22`, x=6 |
| Y8-013 | `2(x + 3) = 18` | expand, subtract 6, divide 2 | `3(x + 2) = 24`, x=6 |
| Y8-014 | `5x + 3 = 2x + 21` | subtract 2x, subtract 3, divide 3 | `6x + 5 = 2x + 29`, x=6 |
| Y8-015 | x/3 + 2 = 7 | subtract 2, multiply 3 | x/4 + 3 = 8, x=20 |

Both teaching and Challenge have an actual affine coefficient model `(ax+b = cx+d)` behind each visible line. Automated checks assert every transformation and the equality's unique solution. Fractions are traditional stacked NOVA Chalk notation, in line with the owner-approved F5 fraction lock. The Y8-014 unknowns on both sides are genuinely reduced from both sides, not merely moved visually.

## Visual and interaction contract

- F0 Neon Tube drawing primitives for all linework, coloured glass equation surfaces, neon balance beam and pivot, styled socket, proof cards and operation tiles.
- Chalk drawing for equations, results, labels and operation pills; UI text retains canonical interface style.
- Five presets; six timeline stages; four modes, reset, accessible keyboard operation and tap-to-select alternative.
- Drag operation cards onto the balance socket; re-grab the placed operation and return it to the removal zone; invalid drops spring back.
- Applying an incorrect operation does **not** replace the equation with a wrong mathematical statement. Challenge gives misconception-specific feedback and requires the correct transformation sequence **and** independently checked numerical x value.
- No premature reveal of the Challenge solution. The final written step retains `x = ?` until the solution is checked.
- Brief NOVA mascot captions, six-stage Sir Bob narration slots, Izaac peer visual in Challenge.
- F0 reduced-motion behaviour and black-and-white print fallback inherited, with scoped print rules for additions.

## Dependencies and release

The standalone review HTML compiles with a local F0-derived runtime from the earlier F8 production workspace. Its runtime has **not been byte-reconciled to the latest GitHub core**; the delivery ZIP deliberately excludes all `core/` replacement files. Extract into your existing `bank-v3-neon-chalk/`, run `python build/build-f8-05.py`, and QA the recomputed HTML against the actual current local core before integration. Do not claim owner GOLD until reviewed.
