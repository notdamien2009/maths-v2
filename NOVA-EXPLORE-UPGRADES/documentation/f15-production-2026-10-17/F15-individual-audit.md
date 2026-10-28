# F15 individual audit — Pythagoras, trigonometry, unit circle, special triangles, circle parts and theorems, sine/cosine rule, 3D Pythagoras (2026-10-17)

Each component was tested separately against the F0, F1, F2 and F3 standards, the phone-layout requirement and the approved template (F0-12). Raw evidence: `evidence/semantic-browser-F15-XX.json`, `evidence/per/F15-XX.log`, screenshots.

## F15-01 — Pythagoras Squares-on-Sides

**File:** `F15/F15-01-pythagoras-squares-on-sides-PREMIUM-REVIEW.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 390 drawn at 258px; labels (median / 10th percentile) 11.9 / 11.2px.
**Values:** lesson values go through `scene` records using the native draw `board, proof` (arguments merged over the native step-0 arguments).
**Example question:** `A right triangle has shorter sides 3 and 4. What is the area c² of the square on its hypotenuse?` → 25
**Checks:** 172/172 passed.

## F15-02 — Pythagoras Finder

**File:** `F15/F15-02-Pythagoras-Finder.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 70 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 390 drawn at 258px; labels (median / 10th percentile) 12.6 / 11.2px.
**Values:** lesson values go through `scene` records using the native draw `board` (arguments merged over the native step-0 arguments).
**Example question:** `The perpendicular sides are 3 cm and 4 cm. Find the hypotenuse length c in cm.` → 5
**Checks:** 170/170 passed.

## F15-06 — Trig Ratio Builder

**File:** `F15/F15-06-Trig-Ratio-Builder.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 390 drawn at 258px; labels (median / 10th percentile) 11.9 / 10.6px.
**Values:** lesson values go through `scene` records using the native draw `scene` (arguments merged over the native step-0 arguments).
**Example question:** `For θ, opposite = 3 cm, adjacent = 4 cm, hypotenuse = 5 cm. Find sin θ to 2 decimal places.` → 0.6
**Checks:** 172/172 passed.

## F15-07 — Angle Slider and Ratio Table

**File:** `F15/F15-07-Angle-Slider-and-Ratio-Table.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 11.7px.
**Values:** lesson values go through `scene` records using the native draw `graph` (arguments merged over the native step-0 arguments).
**Example question:** `At θ = 30°, find sin θ to 2 decimal places.` → 0.5
**Checks:** 172/172 passed.

## F15-08 — Unit Circle Explorer

**File:** `F15/F15-08-Unit-Circle-Explorer.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 73 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 9.5px.
**Values:** lesson values go through `scene` records using the native draw `scene` (arguments merged over the native step-0 arguments).
**Example question:** `At 30°, what is the y-coordinate of the unit-circle point? Give 2 decimal places.` → 0.5
**Checks:** 173/173 passed.

## F15-09 — Trig Solver

**File:** `F15/F15-09-Trig-Solver.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.1 / 9.2px.
**Values:** lesson values go through `scene` records using the native draw `draw` (arguments merged over the native step-0 arguments).
**Example question:** `Hypotenuse 12 cm, θ = 30°. Find the opposite side in cm to 1 decimal place.` → 6
**Checks:** 172/172 passed.

## F15-10 — Special Triangle Values

**File:** `F15/NOVA-F15-10-Special-Triangle-Values.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; labels (median / 10th percentile) 12.0 / 9.6px.
**Values:** lesson values go through `scene` records using the native draw `draw` (arguments merged over the native step-0 arguments).
**Example question:** `The opposite side of a 30° right triangle is 6 cm. Find its hypotenuse in cm.` → 12
**Checks:** 171/171 passed.

## F15-11 — Circle Parts Diagram

**File:** `F15/F15-11-Circle-Parts-Diagram.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 71 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; labels (median / 10th percentile) n/a (question drawing has no SVG text).
**Values:** lesson values go through `scene` records using the native draw `draw` (arguments merged over the native step-0 arguments).
**Example question:** `A circle has radius 5 cm. What is its diameter in cm?` → 10
**Checks:** 171/171 passed.

## F15-12 — Circle Theorems Explorer

**File:** `F15/F15-12-Circle-Theorems-Explorer.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; labels (median / 10th percentile) 11.4 / 10.8px.
**Values:** lesson values go through `scene` records using the native draw `draw` (arguments merged over the native step-0 arguments).
**Example question:** `The centre angle is 130°. Find the angle at the circumference on the same arc, in degrees.` → 65
**Checks:** 172/172 passed.

## F15-13 — Sine and Cosine Rule

**File:** `F15/F15-13-Sine-and-Cosine-Rule.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 73 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 430 drawn at 258px; labels (median / 10th percentile) 11.4 / 11.4px.
**Values:** lesson values go through `scene` records using the native draw `draw` (arguments merged over the native step-0 arguments).
**Example question:** `In triangle ABC, A = 42°, B = 67°, b = 10 cm. Find a in cm to 2 decimal places.` → 7.27
**Checks:** 173/173 passed.

## F15-14 — 3D Pythagoras and Trigonometry

**File:** `F15/F15-14-3D-Pythagoras-and-Trigonometry.html`  
**Final component status:** PASS WITH LIMITATIONS  
**challengeReady:** true

| Standard | Result | Checks | Evidence |
|---|---|---|---|
| F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks | PASS | 24 | all passed |
| F1 notation: no inline slash fractions in drawings, no TBD | PASS | 24 | all passed |
| F2 chalk typography and no dark frames | PASS | 24 | all passed |
| F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN | PASS | 36 | all passed |
| Phone layout at 390 inside template (resize redraw + label size) | PASS | 6 | all passed |
| Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge | PASS | 11 | all passed |
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 72 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 440 drawn at 258px; labels (median / 10th percentile) 11.1 / 11.1px.
**Values:** lesson values go through `scene` records using the native draw `draw` (arguments merged over the native step-0 arguments).
**Example question:** `A cuboid is 4 by 3 by 5 cm. Calculate its space diagonal in cm to 2 decimal places.` → 7.07
**Checks:** 172/172 passed.
