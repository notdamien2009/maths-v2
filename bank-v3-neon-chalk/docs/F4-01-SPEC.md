# F4-01 Part–Whole Bar — implementation specification

## Purpose and correctness

Teach `whole = sum(knownParts) + missingPart`. The top whole and bottom partitions share the same geometric width; each partition's width is exactly `(part / whole) × totalWidth`. Learners can infer, subtract and then verify by addition. A numerical answer is correct only if it is a non-negative integer, matches the dependent missing part and the parts sum to the whole. The entire drawing and the proof line follow the same data, not two unrelated displays.

**Reusability:** independent of one lesson; configuration object `F401_CONFIG` exposes the engine's preset, integer limits, named KS3 presets, named challenge tasks and fixed `events` keys. `window.F401_MATH` publishes pure `sum`, `missing`, `valid`, `checkPart`, `trap`, `choices` functions for unit-level checks. Candidate lesson mapping Y7-035; mathematical links to Y7-007 and to the later F4-08 algebra bar.

## Named teaching beats

1. Notice the whole — 18 is the total.
2. Split the whole — two parts must have the same combined length.
3. Name the known part — 7 known, unknown hidden.
4. Predict the missing part — identify the gap as a quantity.
5. Subtract what is known — set up 18 − 7.
6. Prove with addition — 18 − 7 = 11, and 7 + 11 = 18.

The F0 timeline handles Watch auto-play/pause/step/scrub and Guided. The bottom proof strip progresses from `? + ? = whole` to the complete checked equality. Part arrival, whole growth, focus flashes and success motion use `NOVA.motion` and respect the reduced-motion setting.

## Explore and Challenge interaction contract

- **Candidate part tile:** source placed in the bottom tray; `NOVA.ui.svgDrag` accepts the proportional unknown-bar region as a drop target. A tile can be placed using Enter/Space instead of pointer dragging. A wrong release springs back; a valid release shows the proposed part, but only checking can confirm success.
- **Placed part:** a reusable grab target in the gold segment; drag it to the red Return tray to remove it. Delete/Backspace performs the same action.
- **Divider:** in Explore single-known-part mode, drag it to a snapped integer part length, or focus and use Left/Right/Home/End. Visual widths, the calculated unknown, the side evidence and the answer feedback update together. The divider is deliberately disabled in Challenge to prevent altering the givens.
- **Keyboard and touch:** F2 `NOVA.ui.svgDrag` pointer-capture/recovery rules, Escape cancellation and button/input alternatives. No two active drags, no stranded parts.
- **Three Challenge tasks:** 18 = 7 + 11; 30 = 8 + 5 + 17; 120 = 48 + 27 + 45. Check gives specific misconceptions for whole-as-part, known-as-unknown, adding instead of subtracting, omitting a known part, and total overrun.
- **Events:** fixed value keys `preset`, `whole`, `known`, `part`, `remove`, `resize`, `answer`, `reset`, `proof`; mode, step, correct, hintUsed handled by F0.

## Visual rules

One canonical core only; no new fonts, colours, SVG drawing primitives, number-line duplication, role glyphs or decorative frames. Main apparatus drawn with F0 helpers, no bespoke shadows. NOVA Chalk math numerals and evidence labels, with gold for unknown, blue/teal for given and operations, and result green only after proof. Helper dock changes caption and pose with the teacher beat; Sir Bob narration is specific to the actual maths. Text is readable on 380px mobile. Print uses F0 black-and-white conventions. Responsive layout shifts side evidence cards beneath the drawing on mobile, with no horizontal overflow.

## GCSE extensions and follow-up

This bar provides the representation; the future **F4-08 Algebra Bar** handles more formal equations (`3x + 4 = 19`) and **F4-10** is its equation-translation preset. For non-integer parts/fractions, the approved stacked-fraction renderer should be used by the appropriate future engine. F4-05 remains an F5-11 preset and should not be duplicated.
