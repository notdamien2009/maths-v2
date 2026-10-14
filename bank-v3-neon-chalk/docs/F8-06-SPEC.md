> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# NOVA Maths · F8-06 Rearranging Formulae

**Status: premium review candidate, NOT owner GOLD.** Fresh engine built from F8-06 master run prompt on 11 October 2026. GitHub not modified.

## Curriculum and presets

| Preset | Objective | Teaching equation | Subject | Operations |
|---|---|---|---|---|
| Y8-016-L | Year 8, change subject | P = 2l + 2w | l | −2w → ÷2 → swap |
| Y8-016-G | Year 8, reverse a linear rule | y = 3x + 5 | x | −5 → ÷3 → swap |
| Y8-016-A | Year 8, triangle area | A = bh/2 | h | ×2 → ÷b → swap (b ≠ 0) |
| Y9-019-D | Year 9, inverse proportion | k = xy | y | ÷x → swap (x ≠ 0) |
| Y9-019-R | Year 9, inverse proportion | y = k/x | k | ×x → swap (x ≠ 0) |

All maths visible to the pupil uses F0 neon tube drawings and NOVA Chalk text. Fraction displays are traditional **stacked fractions** rather than the old superseded TBD placeholder.

## Visual design

- A small neon ring marks the target subject, with the target variable letter beside it.
- Premium linked formula panels separate left and right expressions and show the equality sign.
- A central neon socket represents the same inverse operation acting on both sides.
- The chalk working ladder shows progressively revealed equivalent equations. A new row becomes available only after the prior operation has been applied.
- Mobile 380px: a tall board with legible mathematically formatted working. Desktop: enlarged drawing with room for evidence and controls. No extra coloured frame behind the mathematics.
- Sir Bob narration changes by preset and step; helpers change short caption/pose, and Izaac appears in Challenge.

## Behaviour

Four modes: Watch, Guided, Explore, Challenge. Watch/Guided use the common NOVA F0 playback system, named six-beat teaching timeline and reduced motion. Explore lets the pupil select a preset, apply operations in the prescribed teaching route, undo and reset. SVG operation cards use F0 `NOVA.ui.svgDrag`, with tap/Enter alternatives; placed cards can be regrabbed and returned. Wrong operations receive misconception feedback without advancing the state.

Challenge requires (1) the valid rearrangement steps; (2) selection of a mathematically correct final symbolic formula; and (3) its evaluated target value for supplied known quantities. Answers remain hidden until the step sequence is complete. Incorrect operation/formula/number responses trigger separate feedback.

**Note:** There can be more than one mathematically valid route to a final formula. This engine assesses the explicitly modelled NOVA teaching route rather than claiming that any different but valid route is mathematically false.

## Maths correctness and restrictions

Each intermediate equation is represented by pair of numerical functions of all variables. Tests verify that the difference (left−right) transforms under the requested operation by its correct nonzero scalar, for random positive and negative values, independently of whether the starting equality is satisfied. They additionally verify that the solved context satisfies every row and that each challenge has a single correct final formula.

Division by b or x is performed only when the divisor is non-zero; this restriction is shown in the relevant presets. The teaching model does not assume that division by zero is valid.

## Build and integration contract

Editable source: `src/F8-06.js`, `src/F8-06.css`. Source shell: `build/F8-06.src.html`. Builder: `build/build-f8-06.py`. Output: `F8/F8-06-rearranging-formulae.html`. Uses only existing `core/nova-core.js` + `.css` **on the user's local bank**, does not modify either. Tests and screenshot evidence included.

The standalone HTML in this review pack was compiled against a local prior-F8 working copy of an F0-derived runtime; its Git blob identity is **not identical** to current GitHub main `core/nova-core.js`. Before owner GOLD sign-off, rebuild with `python build/build-f8-06.py` after extracting the pack into the **current** `bank-v3-neon-chalk` folder and re-run browser/visual tests. The ZIP intentionally contains **no** `core/` replacement, no prior F8 files and no GitHub update.

## Known review limits

This candidate has not been physically tested on iOS/Android touchscreen or against the newly rebuilt exact GitHub-main core. Interactive screen-reader testing and integration into the full NOVA lesson application are not yet complete. Browser/Playwright results in the pack are local review evidence, not GOLD status.
