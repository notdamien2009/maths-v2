# F5-09 — Divide Fractions · Precision Grouping Lab

**Status:** Premium Edition review candidate. Not owner-approved GOLD. Standalone and integrated bank build completed; live NOVA lesson shell integration is not tested.

## Canonical design and engineering

- Based on the same F0/F1 Neon Tube + NOVA Chalk style, embedded assets and v3.6.2 shared core used by the other rebuilt F5 components.
- Traditional stacked Chalk fractions in every teaching drawing. Short `n/d` notation is used only in compact preset controls and test data.
- `NOVA.numberLine` draws the one shared whole scale; both lengths are measured with **identical pixels per whole**, never with independent normalised bar widths.
- `NOVA.ui.svgDrag` powers both the reusable divisor group template and the re-grabbable last placed group with a red return tray; keyboard Enter and a dedicated button are alternatives.
- `NOVA.motion.arrive`, `tween`, `flash` and reduced-motion handling support deliberate mathematical group reveals.
- The exact quotient is `(a/b) ÷ (c/d) = (a*d)/(b*c)`, reduced using integer GCD. Whole-fit and fractional remainder are computed with integers, not approximate floating fractions.
- Green denotes complete divisor-sized groups. Gold denotes the exact fraction of the final divisor group. The ghost remainder is *not* counted as a complete group.
- Fraction quotient zero, improper dividend, partial groups, integer counts and results above one are supported. Input values are validated and a single scene renders at a maximum of 12 groups.

## Files

- `F5/F5-09-divide-fractions.html`: assembled and testable standalone HTML.
- `build/F5-09.src.html`: editable HTML template with `@@CSS@@` and `@@JS@@` placeholders; rebuild via `python build/build.py` from the bank root.
- `core/nova-core.js` and `.css`: **unaltered inherited shared core**, byte-identical to the F5-07 baseline.
- `tests/qa_f509.py`: functional and mathematical tests for desktop and mobile, with full four-mode screenshots.
- `tests/stress_f509.py`: real-pointer, Escape, keyboard, motion, quotient checks at 320px/768px.
- `tests/f509-results.json`, `tests/stress-f509-results.json`: test evidence.
- `shots/F5/F5-09-*`: mode screenshots at 380px/1280px and extra stress visual captures.

## Component contract

- Engine ID `F5-09` remains stable.
- Four modes: Watch, Guided, Explore, Challenge.
- Six teaching states and three marked assessment questions.
- Events: `preset`, `dividendNumerator`, `dividendDenominator`, `divisorNumerator`, `divisorDenominator`, `groupDrag`, `groupKeyboard`, `returnDrag`, `returnKeyboard`, `reset`, `showModel`, plus NOVA core events.
- Linked families `F5-03` (multiplication area model), `F5-07` (addition/subtraction), `F5-09` (division by measurement).

## Open checks

- Owner sign-off on premium visuals and teaching sequence.
- Integration in the NOVA lesson shell and lessons curriculum mapping, which were not available for this test.
- Expanded assistive-technology acceptance testing beyond keyboard navigation and text alternatives.
