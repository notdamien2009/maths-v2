# F7 individual audit — algebra tiles, balances, bar models, identities (2026-10-16)

Each component was tested separately against the F0, F1, F2 and F3 standards, the phone-layout requirement and the approved template (F0-12). Raw evidence: `evidence/semantic-browser-F7-XX.json`, `evidence/per/F7-XX.log`, screenshots.

## F7-01 — Algebra Tiles

**File:** `F7/F7-01-algebra-tiles.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: False; main SVG viewBox 1000 drawn at 254px; median label 12.2px, 10th percentile 8.4px.
**Values:** lesson values go through `scene` records (native draw `dock, view`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Remove the zero pairs. What is the coefficient of x?` → 2
**Checks:** 162/162 passed.

## F7-02 — Zero-Pair Animation

**File:** `F7/F7-02-zero-pair-animation.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 69 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 620 drawn at 254px; median label 17.6px, 10th percentile 13.9px.
**Values:** lesson values go through `scene` records (native draw `dock, view`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Work out +5 + (−3).` → 2
**Checks:** 164/164 passed.

## F7-03 — Collecting Like Terms

**File:** `F7/F7-03-collecting-like-terms.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 460 drawn at 254px; median label 21.0px, 10th percentile 16.0px.
**Values:** lesson values go through `scene` records (native draw `dock, show`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Collect like terms. How many x terms are there altogether?` → 3
**Checks:** 162/162 passed.

## F7-04 — Expanding Single Brackets

**File:** `F7/F7-04-expanding-single-brackets.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 585 drawn at 244px; median label 11.3px, 10th percentile 11.3px.
**Values:** lesson values go through `scene` records (native draw `scene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Expand 3(x + 4). Enter the constant term.` → 12
**Checks:** 166/166 passed.

## F7-05 — Expanding Double Brackets

**File:** `F7/F7-05-expanding-double-brackets.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 73 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 585 drawn at 244px; median label 11.3px, 10th percentile 11.3px.
**Values:** lesson values go through `scene` records (native draw `scene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Expand (x + 3)(x + 5). Enter the constant term.` → 15
**Checks:** 168/168 passed.

## F7-06 — Factorising with Tiles

**File:** `F7/F7-06-factorising-with-tiles.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 500 drawn at 254px; median label 15.2px, 10th percentile 9.1px.
**Values:** lesson values go through `scene` records (native draw `dock, show`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Factorise 3x + 6 fully. Enter the common factor outside the bracket.` → 3
**Checks:** 162/162 passed.

## F7-07 — Completing the Square

**File:** `F7/F7-07-completing-the-square.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 540 drawn at 254px; median label 15.1px, 10th percentile 12.2px.
**Values:** lesson values go through `scene` records (native draw `show`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Write x² + 6x + 5 as (x + 3)² + q. Enter q.` → -4
**Checks:** 167/167 passed.

## F7-08 — Balance Scales

**File:** `F7/F7-08-balance-scales.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 620 drawn at 254px; median label 12.4px, 10th percentile 12.0px.
**Values:** lesson values go through `scene` records (native draw `dock, renderScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Solve 2x + 3 = 11.` → 4
**Checks:** 162/162 passed.

## F7-09 — Balance with Negatives and Unknowns

**File:** `F7/F7-09-balance-negatives-unknowns.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 620 drawn at 254px; median label 12.4px, 10th percentile 11.1px.
**Values:** lesson values go through `scene` records (native draw `dock, renderScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Solve 2x − 3 = 7.` → 5
**Checks:** 162/162 passed.

## F7-10 — Cups-and-Counters Solver

**File:** `F7/F7-10-cups-and-counters.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 620 drawn at 254px; median label 12.3px, 10th percentile 11.5px.
**Values:** lesson values go through `scene` records (native draw `dock, renderScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `2 cups and 2 counters equal 10 counters. How many counters are in each cup?` → 4
**Checks:** 162/162 passed.

## F7-11 — Bar-Model Equation

**File:** `F7/F7-11-bar-model-equation.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 810 drawn at 240px; median label 14.8px, 10th percentile 12.4px.
**Values:** lesson values go through `scene` records (native draw `helper, present`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `3x + 5 = 26. Find x.` → 7
**Checks:** 162/162 passed.

## F7-12 — Substitution Machine

**File:** `F7/F7-12-substitution-machine.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 73 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 540 drawn at 254px; median label 16.9px, 10th percentile 12.7px.
**Values:** lesson values go through `scene` records (native draw `dock, display`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Find the value of 3x + 2 when x = 5.` → 17
**Checks:** 168/168 passed.

## F7-13 — Difference of Two Squares

**File:** `F7/F7-13-difference-of-two-squares.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: False; main SVG viewBox 700 drawn at 254px; median label 16.3px, 10th percentile 13.4px.
**Values:** lesson values go through `scene` records (native draw `cues, scene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `x² − 9 = (x + a)(x − a). Enter a.` → 3
**Checks:** 162/162 passed.

## F7-14 — Identity Visualiser

**File:** `F7/F7-14-identity-visualiser.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 8 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 640 drawn at 252px; median label 13.8px, 10th percentile 11.8px.
**Values:** lesson values go through `scene` records (native draw `helper, renderStage`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Is 2(x + 3) identical to 2x + 6 for every x? Enter 1 for yes or 0 for no.` → 1
**Checks:** 162/162 passed.
