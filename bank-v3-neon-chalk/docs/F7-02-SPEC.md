# F7-02 — Zero-Pair Animation — Run 02 specification

**Family:** F7 Algebra Tiles and Balance  
**Master objective:** Y7-011 — Adding and subtracting negative numbers: model signed changes and calculate with negative numbers.  
**Status:** Premium Review Candidate; owner approval is required before GOLD.

## Maths purpose

A positive one and a negative one represent equal magnitude in opposite directions. Together they make zero, so cancelling them preserves the signed total. The pupil sees, performs and proves this invariant rather than memorising sign rules.

## Configuration

Integer signed-unit tokens; zero to fourteen of each sign. Presets: Y7-011 `−3 + 5`, `−5 + 2`, `4 + (−4)`, `3 − (−2)`, `2 − 5` and GCSE extension `−7 + 5`. The subtraction presets first convert subtraction to addition of the opposite; tiles never pretend to represent subtraction without that conversion.

## Apparatus and visual design

Two distinct neon-glass mathematical lanes represent +1 (green positive tile) and −1 (red negative tile, repeated slanted hatch marking and printed minus sign). They use canonical `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText` and F0 helper dock. A shared central zero ring is the meeting point. No new font, filter or math drawing primitive is introduced.

## Teaching sequence

1. **Identify units:** opposite signs, equal sized square tiles.
2. **Represent:** five +1 units and three −1 units stand for `−3 + 5`.
3. **Predict and pair:** matching one +1 and one −1 gives zero.
4. **Cancel:** matched pairs visually travel into the zero ring and disappear while leaving the signed total invariant.
5. **Conclude:** two positive units remain, proving `−3 + 5 = +2`.

Sir Bob has distinct narration for each stage; helper speaks short, changing encouragement. All four core modes inherit F0 narration/timeline controls.

## Interactions

- **Explore:** drag a +1 or −1 source tile to its respective mathematical lane; drag any placed tile onto any opposite tile to make a zero pair; drag to the red Remove tray to remove a single tile. Keyboard Enter on the first and opposite second tile is equivalent. Buttons: Add +1, Add −1, Cancel one pair, Undo, Reset and preset selection.
- **Challenge:** four fixed starting representations, all pairs must be cancelled before entering a signed integer. Cannot delete tiles to cheat. Enter a result to check; sign-specific feedback when wrong; four rounds to complete.
- Dragging to wrong targets springs home; rapid pointer movement, Escape, lost capture and reduced-motion operation are handled by F0's canonical `NOVA.ui.svgDrag` plus the F7-01-established pointer recovery adapter. No core edits.

## Mathematical misconception checks

- `−3 + 5` is not −8; each matched pair contributes zero.
- Adding negatives is not automatically making the answer negative; surviving units determine sign.
- `3 − (−2)` is modelled as three positive units **plus** two positives.
- A positive result given as negative (or vice versa) gets sign-specific feedback.
- Challenge cannot be solved merely by typing the numerical answer without cancelling pairs.

**GCSE extension:** The same invariant applies to unlike sign coefficients of the same algebraic term, linking F7-01 signed algebra tiles to future F7-03 collecting like terms. Zero pair cancellation does not allow cancelling unrelated algebraic tile types.

## Acceptance gates

Mobile-first at 380px; desktop 1280px; 320px and 768px stress; Watch, Guided, Explore, Challenge; native SVG pointer tests; cancellation invariant; no JS exceptions or horizontal overflow; F0 canonical core unchanged; visual comparison to F2-01..03; owner sign-off pending.
