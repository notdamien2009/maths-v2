# NOVA F7-13 — Difference of Two Squares

**Status:** Premium-review candidate (not owner GOLD approval). **Family:** F7 Algebra Tiles and Balance. **Lesson:** Y9-006 Algebraic equivalence. **Linked:** F7-06 Factorising with Tiles, F7-07 Completing the Square, F3-02 Area Model.

## Short spec card

| Property | F7-13 specification |
|---|---|
| Maths purpose | Preserve area when converting `x² − b²` into `(x + b)(x − b)` |
| Year groups | Year 9 KS3, GCSE extension |
| Parameters | Positive integer `b` 1–5; illustrative side length `x` greater than `b`; actual symbolic proof generalises to positive `x>b` |
| Presets | Y9-006: `x²−9`; and `x²−1`, `x²−4`, `x²−16`, `x²−25` |
| Watch stages | Full x² square → cut b² corner → identify remaining strip → slide → rotate 90° → read the two rectangle edges → prove identity |
| Modes | Watch (paced), Guided (narrated steps), Explore (move/return/undo/reset/presets), Challenge (four area constructions + factorisations) |
| Core interactions | F2-style SVG lifted drag to target; red Return drop; invalid-drop spring home; Escape recovery; Enter to place/R to return; buttons provide alternative |
| Correct answer | Physically relocate the strip, then supply two complete factors `(x+b)(x-b)` in either order |
| Misconceptions | Equal signs in both factors; putting `b²` instead of `b` inside brackets; incorrectly changing the area; forgetting the second bracket |
| GCSE flag | Yes — factorisation of quadratic differences, general algebraic equivalence |
| Events | Config-defined value keys `preset,move,return,undo,reset,answer,hint,round,proof,keyboard` plus standard `step,correct,hintUsed,mode` |

## Correct visual geometry

Start with an x-by-x square; remove its lower-right b-by-b corner. What remains consists of an **x-by-(x−b) left rectangle** and a **b-by-(x−b) top-right strip**. Rotate the strip 90 degrees and move it immediately below the left rectangle, producing one rectangle **(x−b) wide by (x+b) high**. Neither retained piece changes area. The red cut-out stays explicitly outside the final rectangle.

Worked illustration, `x=9` and `b=3`: the original area is `81−9=72` square units. The rearranged rectangle is `(9−3)(9+3)=6×12=72`. This numeric instance illustrates the general symbolic construction; x remains an algebraic variable in pupil-facing explanations.

## Accessibility / scope

The core supplies Sir Bob's narration slot and original mascot dock. SVG carries accessible text; the movable strip has button role, tabindex and keyboard controls; interactive buttons have minimum mobile touch sizing; print CSS suppresses interaction panels. Reduced-motion uses the core's existing behaviour. This component intentionally does **not** build any games, duplicate F0 helpers or alter F7-01–12.
