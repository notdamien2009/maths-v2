# NOVA Family F4 / F4-02 Comparison Bar — Run 02

**Status:** Premium review, not owner-approved GOLD. **Source authority:** bank-v3-neon-chalk 2026-10-10 handover and `00-master/nova-master-updated.html` F4-02 specification. Core is identical to the GitHub `maths-v2` current `core` and was not modified.

## Maths purpose

- Quantities are separate bars aligned at the same left origin, rather than one whole subdivided into parts (F4-01).
- The shared length is common to both bars; the gold unmatched extension is the difference.
- Difference = larger group − smaller group; correct answers are checked by smaller + difference = larger.
- A missing shorter group is found by reversing the comparison: longer − difference = smaller.
- The geometry is proportional to each quantity under a **single** per-view scale. No distorted nonlinear bar lengths.

## Parameters and presets

- Explore: whole units 1–24, bar A and B independently resizable by draggable end handles; key ArrowLeft/Right/Home/End or A±1/B±1 buttons.
- Year 7 adding/subtracting numbers: 15 versus 9, answer 6.
- Reverse comparison preset: 8 versus 17, answer 9.
- Close comparison preset: 20 versus 18, answer 2.
- Equal groups preset: 12 versus 12, answer 0.
- Challenge 1: 15 − 9 = 6; challenge 2: 24 − 17 = 7; challenge 3: 27 − 8 = 19, with smaller group hidden until checked.
- Challenge extends to 27 even though Explore drag track is limited to 24, because challenge bars scale for their supplied range.

## Named teaching animation

1. Shared starting point — common origin, upper bar.
2. Show second quantity — lower aligned bar appears.
3. Identify shared segment — highlight length common to both.
4. Isolate unmatched gap — gold segment and difference brace.
5. Choose subtraction — use larger minus smaller, do not add the group totals.
6. Check by addition — smaller + gap = larger.

Sir Bob narrates each step. Pip/Nova helper dock and short encouragement use F0 core's embedded helpers and pose mapping. Separate expanded manifest art was not present in the uploaded Git repository snapshot.

## Interaction

- NOVA `svgDrag` for bar-end resize with valid snap zones and cancellation, candidate selection into the actual gold region, and a separate draggable `MARK GAP` brace in Explore. Keyboard alternatives for each.
- Selected candidate can be returned to red RETURN tray by pointer drag or Delete/Backspace. Clear button is also available.
- Guard against pointer capture loss after canonical svgDrag temporarily reparents the dragged SVG group: after the drag kit's own pointerdown, this component reacquires capture on the same group. No core patch and no private drag implementation; all snapping/highlight/return/reduced-motion logic remains in canonical F2 kit.
- No embedded standalone game: F0-12 owns games.

## Common structure

- Responsive stage at 380px mobile / 1280px desktop, three side evidence cards, dark NOVA palette, Neon Tube mathematical bars, Chalk mathematical text.
- Dedicated `F4-02` scope ensures no styles or events leak into other families.
- Configuration exposed as `window.F402_CONFIG` and pure maths interface as `window.F402_MATH`.
- All value events use a fixed declared event key list; code is hidden in a collapsed developer details section.

## Misconception traps

- Adding two group totals instead of finding the difference.
- Treating either known group total as the unmatched part.
- Returning a negative comparison length / using reversed sign.
- Adding the known difference rather than subtracting it to find a smaller group.
- Choosing a number that underfills or overfills the gap.

## GCSE and extensions

- Foundation comparison problems and algebraic missing quantities; transfer into F4-08 algebra bar and later rates/ratio tape.
- Proper stacked NOVA Chalk fractions are locked for relevant future components; no fractions occur in F4-02.
