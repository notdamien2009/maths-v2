# F9 individual audit — sequences, nth term, special sequences, fractals (2026-10-17)

Each component was tested separately against the F0, F1, F2 and F3 standards, the phone-layout requirement and the approved template (F0-12). Raw evidence: `evidence/semantic-browser-F9-XX.json`, `evidence/per/F9-XX.log`, screenshots.

## F9-01 — Matchstick Pattern Builder

**File:** `F9/F9-01-matchstick-pattern-builder.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 14.4px, 10th percentile 14.4px.
**Values:** lesson values go through `scene` records (native draw `reset, renderChallenge, showEquation, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Stage 3 of the pattern is shown. How many sticks are needed for stage 7?` → 22
**Checks:** 169/169 passed.

## F9-02 — Term-to-term Animator

**File:** `F9/F9-02-term-to-term-animator.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 11.4px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `reset, renderExplore, drawChallenge, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `What is the next term of the sequence?` → 16
**Checks:** 168/168 passed.

## F9-03 — Position-to-Term Table

**File:** `F9/F9-03-position-to-term-table.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 360 drawn at 258px; median label 15.8px, 10th percentile 13.6px.
**Values:** lesson values go through `scene` records (native draw `reset, wrap, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `The rule is T(n) = 2n + 3. Find T(10).` → 23
**Checks:** 169/169 passed.

## F9-04 — Sequence on a Graph

**File:** `F9/F9-04-sequence-on-a-graph.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 70 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 11.4px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `reset, wrap, renderExplore, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `The graph shows the first 4 terms. What is term 5?` → 11
**Checks:** 167/167 passed.

## F9-05 — Linear nth Term Derivation

**File:** `F9/F9-05-linear-nth-term-derivation.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 68 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 12.6px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `reset, mountScene, exploreDraw, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `The nth term is 3n + c. Use the table to find c.` → 8
**Checks:** 165/165 passed.

## F9-06 — Geometric Sequence

**File:** `F9/F9-06-geometric-sequence.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 12.0px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, explore, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Each term is multiplied by the same number. What is term 5?` → 48
**Checks:** 168/168 passed.

## F9-07 — Special Sequences

**File:** `F9/F9-07-special-sequences.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 13.2px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, explore, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `How many dots are there at stage 5?` → 25
**Checks:** 168/168 passed.

## F9-08 — Triangular Numbers Dot Arrays

**File:** `F9/F9-08-triangular-numbers-dot-arrays.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 12.6px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, renderExplore, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Stage 4 is shown. How many dots are in stage 6?` → 21
**Checks:** 169/169 passed.

## F9-09 — Quadratic Sequence

**File:** `F9/F9-09-quadratic-sequence.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 11.4px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, renderExplore, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `The first four terms of a quadratic sequence are shown. Find the fifth term.` → 36
**Checks:** 169/169 passed.

## F9-10 — Pascal’s Triangle

**File:** `F9/F9-10-pascals-triangle.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 70 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 13.2px, 10th percentile 13.2px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, renderExplore, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Find the missing number in the bottom row.` → 6
**Checks:** 167/167 passed.

## F9-11 — Spot-the-Rule Puzzle

**File:** `F9/F9-11-spot-the-rule-puzzle.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 68 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 13.8px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, exploreDraw, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `What is added to each term to get the next term? (Use a negative number if the terms go down.)` → 7
**Checks:** 165/165 passed.

## F9-12 — Sequence Continuer

**File:** `F9/F9-12-sequence-continuer.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 15.0px, 10th percentile 12.0px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, exploreDraw, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `Continue the sequence. What is term 5?` → 16
**Checks:** 168/168 passed.

## F9-13 — Fractal Generators

**File:** `F9/F9-13-fractal-generators.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 10 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; median label 11.4px, 10th percentile 11.4px.
**Values:** lesson values go through `scene` records (native draw `clear, mount, sceneDraw, drawChallenge, lessonScene`); captions/labels are scene arguments and must be supplied with new numbers.
**Example question:** `How many small triangles are there at iteration 3?` → 27
**Checks:** 168/168 passed.
