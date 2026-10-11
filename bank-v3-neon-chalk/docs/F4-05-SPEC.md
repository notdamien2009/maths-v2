# F4-05 · Fraction-of-Amount Bar — specification card

- **Family:** F4 · Bar Models and Part–Whole.
- **Implementation:** presentation preset/alias of F5-11 `Fraction of an Amount`, not a new maths engine.
- **Purpose:** show that `n/d of A` means `A` shared in `d` equal parts with `n` of those parts chosen. Preserve exact rational totals.
- **Year groups:** KS3 Year 7–9; GCSE Foundation groundwork.
- **Parameters:** positive integer amount `0–48`; numerator `0–denominator`; denominator `2–8`. F5-11 enforces input validation.
- **Presets:** same seven F5-11 presets: 3/4 of 24, 2/3 of 18, 5/6 of 30, 2/3 of 10, 1/2 of 7, 0/5 of 20, 5/5 of 20. Includes fractional results.
- **Mathematical demonstration:** whole > equal bars > one part > choose n parts > exact total. Uses existing F5-11 Watch/Guided six-step timeline.
- **Interactions:** Explore/Challenge: move neon part-ring into green answer zone; selected part may move back into red return zone; reveal one part's value using drag or keyboard; selectors and existing F5-11 keyboard-equivalent buttons.
- **Challenge correctness:** F5-11's exact rational parser and validation. Three original assessed tasks (18, 10, 6 2/3). Check controls and feedback from F5-11; no local game loop.
- **Misconceptions addressed:** divide by numerator instead of denominator, unequal groups, using fraction as decimal approximation, counting all parts as chosen, confusing the original with selected amount.
- **Mascots:** F5-11 Sir Bob narration and dock; F4-05 short, stage-specific encouragement. No new character artworks.
- **Source policy:** no modifications to F0, F1, F2, F3, F4-01–04, F5-11 or shared core. All maths and challenge logic inherited from F5-11; only the representation differs.
- **Additional QA gate:** owner review of relative bar sizes, fraction legibility, 380px controls, normal fast-drag feel and stage-to-stage teaching clarity.
