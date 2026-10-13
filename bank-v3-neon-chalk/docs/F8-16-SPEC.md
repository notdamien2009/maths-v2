# F8-16 — Premium studio spec and implementation summary

## Origin

Authoritative master: `bank-v3-neon-chalk/00-master/NOVA-MASTER-FOR-OTHER-AI.md`, section `F8-16 Modelling cycle stepper`.
F8-16 is a new component added by the earlier master audit, **not a preset** of another engine.

## Purpose and year groups

Year 9 KS3 mathematical modelling, linked to Y9-007 (expressions and formulae) and Y9-018 (graphical solutions and modelling). GCSE extension: linear relationship comparison, constraints and interpretation.

## Visual design

One four-stage clockwise modelling ring, with four premium neon-glass cards and a central tube ring. Stage labels and numbered steps encode order beyond colour. Original NOVA Chalk drawn lettering, F0 canvas, F0 core helpers, existing mascot dock. Mobile uses a two-by-two card layout with a two-row operation tray; desktop positions the ring and four cards side by side. Mathematical evidence has its own panel.

## Four teaching stages

1. **Understand**: quantities, fixed/variable data and the question.
2. **Model**: a formula, equality or target-value rule that represents the context.
3. **Solve**: work using the selected rule.
4. **Check**: contextual value, units and at least one modelling assumption.

The Watch/Guided timeline reveals these stages consecutively; Explore permits independent arrangements; Challenge requires cycle order, the correct algebraic rule and numerical result.

## Required interactions

- Drag and drop every named modelling-stage card onto numbered slots via `NOVA.ui.svgDrag`.
- Re-grab a placed card to move it, return to tray or undo.
- Keyboard and ordinary-button alternatives for selection, placement and removal/undo.
- Wrong drop does not place or strand a card.
- Model choices are validated numerically from independent equation data, not text comparison.
- Answer/assumptions are concealed until a correct Challenge submission.
- Sir Bob narrative slots and short NOVA mascot reactions; Izaac/other helper presentation depends on the active F0 helper skin.

## Presets

| Preset | Task | Rule | Solution |
|---|---|---|---|
| Y9-007-A | Taxi fare, 6 miles | C = 3 + 2.5m | £18 |
| Y9-007-B | 8 m × 5 m garden perimeter | P = 2l + 2w | 26 m |
| Y9-007-C | 4 event tickets plus fixed booking fee | C = 5 + 7n | £33 |
| Y9-018-A | Equal cost of two travel routes | 12 + 3m = 4 + 5m | 4 miles |
| Y9-018-B | Depth falls to 8 cm | d = 18 − 2t | 5 min |
| Y9-018-C | Two moving objects meet | 4t = 12 + 2t | 6 hours |

## Misconception traps

Fixed fee applied once versus repeated, perimeter versus area, incorrect sign for a falling quantity, mixing fixed intercept with gradient, confusing unequal travel cost models, incorrect solution units, checking the calculation without checking the situation.

## Shared source and QA

No new background, fonts, mascot artwork or standalone drawing primitives. The HTML preview is standalone, while an additive source/builder supports the current local F0 runtime. See the actual test JSON files before owner sign-off.
