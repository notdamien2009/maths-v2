# F5 individual audit — fractions, decimals, percentages (2026-10-16)

Every component was audited and tested separately against the F0, F1, F2 and F3 standards and the approved lesson template. Evidence: `semantic-browser-F5-XX.json`, `per/F5-XX.log`, `screenshots/`. Bank regression: `bank-regression-results.json`.

## F5-01 — Fraction strips & wall

**File:** `F5/F5-01-fraction-strips-and-wall.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Rail A shows 1/2. How many twelfths make exactly the same length?` → answer 6
**Checks:** 141/141 passed.

## F5-02 — Fraction circles · Precision sector workshop

**File:** `F5/F5-02-fraction-circles.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `1 of 4 equal sectors are shaded. How many more sectors complete the whole circle?` → answer 3
**Checks:** 141/141 passed.

## F5-03 — Fractions · Premium precision area engine

**File:** `F5/F5-03-area-model-fractions.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `2/3 of the columns and 3/4 of the rows are selected. How many cells are in both selections?` → answer 6
**Checks:** 141/141 passed.

## F5-04 — Fractions on a Number Line

**File:** `F5/F5-04-fractions-number-line-preset.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `The ring marks 3/4. Write it with denominator 8. Enter the numerator.` → answer 6
**Checks:** 141/141 passed.

## F5-05 — Equivalent fractions · Precision Splitter

**File:** `F5/F5-05-equivalent-fraction-multiplier.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Multiply the numerator and denominator of 1/2 by 3. Enter the new numerator.` → answer 3
**Checks:** 141/141 passed.

## F5-06 — Fraction Simplifier · Magnetic Group Forge

**File:** `F5/F5-06-fraction-simplifier.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Simplify 6/8 fully. Enter the numerator of the simplest form.` → answer 3
**Checks:** 141/141 passed.

## F5-07 — Add & Subtract Fractions · Equal-Unit Workshop

**File:** `F5/F5-07-add-and-subtract-fractions.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `1/2 + 1/3 written in 6ths. Enter the numerator of the total.` → answer 5
**Checks:** 141/141 passed.

## F5-09 — Divide Fractions · Precision Grouping Lab

**File:** `F5/F5-09-divide-fractions.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `How many groups of 1/4 fit exactly into 1/2?` → answer 2
**Checks:** 141/141 passed.

## F5-10 — Mixed &amp; Improper Fractions · Whole-Builder Forge

**File:** `F5/F5-10-mixed-improper-converter.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Write 7/3 as a mixed number. How many whole ones are there?` → answer 2
**Checks:** 141/141 passed.

## F5-11 — Fraction of an Amount · Equal-Share Studio

**File:** `F5/F5-11-fraction-of-an-amount.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 63 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Find 3/4 of 24.` → answer 18
**Checks:** 144/144 passed.

## F5-12 — Hundred-Square Percentage Studio

**File:** `F5/F5-12-hundred-square-percentage-grid.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 66 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `37 of the 100 cells are shaded. What percentage is NOT shaded?` → answer 63
**Checks:** 147/147 passed.

## F5-13 — FDP Conversion Machine

**File:** `F5/F5-13-fdp-conversion-machine.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 66 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Convert 2/5 to a decimal.` → answer 0.4
**Checks:** 147/147 passed.

## F5-14 — Percentage of an Amount

**File:** `F5/F5-14-percentage-of-an-amount.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 66 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Find 25% of 80.` → answer 20
**Checks:** 147/147 passed.

## F5-15 — Percentage Change & Multipliers

**File:** `F5/F5-15-percentage-change-and-multipliers.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 66 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `80 is increased by 20%. What is the new amount?` → answer 96
**Checks:** 147/147 passed.

## F5-16 — Reverse Percentages

**File:** `F5/F5-16-reverse-percentage-preset.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 66 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `After the change, the amount is 96, which is 120% of the original. Find the original amount.` → answer 80
**Checks:** 147/147 passed.

## F5-17 — Recurring Decimal Explorer

**File:** `F5/F5-17-recurring-decimal-explorer.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Divide 1 by 7. What is the first digit after the decimal point?` → answer 1
**Checks:** 141/141 passed.

## F5-18 — Decimal Sorting Studio

**File:** `F5/F5-18-terminating-recurring-sorter.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `Simplify 6/15 fully. Enter the denominator of the simplest form.` → answer 5
**Checks:** 141/141 passed.

## F5-19 — Pizza & Chocolate Fraction Workshop

**File:** `F5/F5-19-pizza-and-chocolate-fraction-contexts.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks) | PASS | 24 | all passed |
| F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD) | PASS | 24 | all passed |
| F2 chalk typography + no dark frames | PASS | 24 | all passed |
| F3 mascot pack + responsive containment (390/1024/1440) | PASS | 36 | all passed |
| Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore) | PASS | 60 | all passed |
| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | PASS | — | qa results-0.json |

**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).
**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.
**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.
**Multiple views:** two native views mounted independently, no duplicate IDs (tested).
**Example question:** `The whole has 8 equal pieces. How many pieces make 3/4 of it?` → answer 6
**Checks:** 141/141 passed.
