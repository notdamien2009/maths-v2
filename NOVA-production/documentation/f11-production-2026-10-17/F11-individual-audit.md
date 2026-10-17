# F11 individual audit — angles, protractor, polygons, constructions, loci, bearings (2026-10-17)

Each component was tested separately against the F0, F1, F2 and F3 standards, the phone-layout requirement and the approved template (F0-12). Raw evidence: `evidence/semantic-browser-F11-XX.json`, `evidence/per/F11-XX.log`, screenshots.

## F11-01 — Protractor

**File:** `F11/F11-01-protractor.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: False; main SVG viewBox 760 drawn at 236px; median label 11.2px, 10th percentile 10.6px.
**Values:** lesson values go through `scene` records using the native draw `drawing` with its option object.
**Example question:** `Measure the marked angle with the protractor. The starting ray points right.` → 47
**Checks:** 171/171 passed.

## F11-02 — Angle Estimator

**File:** `F11/F11-02-angle-estimator.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: False; main SVG viewBox 760 drawn at 236px; median label 11.8px, 10th percentile 9.0px.
**Values:** lesson values go through `scene` records using the native draw `geom` with its option object.
**Example question:** `Estimate the size of the angle in degrees (within 10°).` → 62
**Checks:** 171/171 passed.

## F11-03 — Angle Facts

**File:** `F11/F11-03-angle-facts.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: False; main SVG viewBox 730 drawn at 236px; median label 11.3px, 10th percentile 10.0px.
**Values:** lesson values go through `scene` records using the native draw `renderFigure` with its option object.
**Example question:** `One angle on a straight line is 132°. Find the adjacent angle x.` → 48
**Checks:** 169/169 passed.

## F11-04 — Triangle Angle-Sum Tear-Off

**File:** `F11/F11-04-triangle-angle-sum-tear-off.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 73 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: False; main SVG viewBox 730 drawn at 236px; median label 11.6px, 10th percentile 8.7px.
**Values:** lesson values go through `scene` records using the native draw `stageFrame, drawTriangle, drawQuadrilateral` with its option object.
**Example question:** `Two angles of the triangle are 52° and 73°. Find the third angle.` → 55
**Checks:** 170/170 passed.

## F11-05 — Parallel Lines Explorer

**File:** `F11/F11-05-parallel-lines-explorer.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 69 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 526 drawn at 236px; median label 11.7px, 10th percentile 11.7px.
**Values:** lesson values go through `scene` records using the native draw `stageFrame, draw` with its option object.
**Example question:** `An angle is 54°. Find the corresponding angle.` → 54
**Checks:** 167/167 passed.

## F11-06 — Polygon Angles Turtle

**File:** `F11/F11-06-polygon-angles-turtle.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 507 drawn at 236px; median label 11.6px, 10th percentile 11.6px.
**Values:** lesson values go through `scene` records using the native draw `frame, draw` with its option object.
**Example question:** `This regular polygon has 5 sides. What is one exterior angle?` → 72
**Checks:** 171/171 passed.

## F11-07 — Regular Polygon Builder

**File:** `F11/F11-07-regular-polygon-builder.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 530 drawn at 236px; median label 12.0px, 10th percentile 12.0px.
**Values:** lesson values go through `scene` records using the native draw `shell, draw` with its option object.
**Example question:** `A regular polygon with 4 sides is drawn in a circle. What is one angle at the centre?` → 90
**Checks:** 171/171 passed.

## F11-08 — Compass Constructions

**File:** `F11/F11-08-compass-constructions.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 490 drawn at 236px; median label 13.5px, 10th percentile 11.6px.
**Values:** lesson values go through `scene` records using the native draw `stageShell, draw` with its option object.
**Example question:** `An angle of 84° is bisected with compasses. What is each half?` → 42
**Checks:** 171/171 passed.

## F11-09 — Locus Builder

**File:** `F11/F11-09-locus-builder.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 508 drawn at 236px; median label 11.1px, 10th percentile 11.1px.
**Values:** lesson values go through `scene` records using the native draw `stageShell, draw` with its option object.
**Example question:** `P is on the locus of points 150 units from A. What is AP?` → 150
**Checks:** 169/169 passed.

## F11-10 — Bearings

**File:** `F11/F11-10-bearings.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 475 drawn at 236px; median label 13.4px, 10th percentile 12.4px.
**Values:** lesson values go through `scene` records using the native draw `stageShell, draw` with its option object.
**Example question:** `Give the bearing of P from O (enter the number of degrees).` → 72
**Checks:** 171/171 passed.

## F11-11 — Angle Chase

**File:** `F11/F11-11-angle-chase.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 550 drawn at 236px; median label 11.2px, 10th percentile 11.2px.
**Values:** lesson values go through `scene` records using the native draw `stageShell, draw` with its option object.
**Example question:** `The marked angle on the straight line is 58°. Find the neighbouring angle.` → 122
**Checks:** 169/169 passed.
