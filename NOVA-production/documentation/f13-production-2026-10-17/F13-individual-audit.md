# F13 individual audit — 3D solids, nets, plans and elevations, volume, surface area, cross-sections, capacity, enlargement (2026-10-17)

Each component was tested separately against the F0, F1, F2 and F3 standards, the phone-layout requirement and the approved template (F0-12). Raw evidence: `evidence/semantic-browser-F13-XX.json`, `evidence/per/F13-XX.log`, screenshots.

## F13-01 — 3D solid viewer

**File:** `F13/F13-01-3D-Solid-Viewer-REBUILT.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.1 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `facts, mainDrawing, mountStage` with a full state object.
**Example question:** `How many edges does this cube have?` → 12
**Checks:** 165/165 passed.

## F13-02 — Net folder

**File:** `F13/F13-02-Net-Folder-PREMIUM-CORE.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) n/a (question drawing has no SVG text).
**Values:** lesson values go through `scene` records using the native draw `counts, scene` with a full state object.
**Example question:** `This net folds into a cube. How many faces will the folded solid have?` → 6
**Checks:** 165/165 passed.

## F13-03 — Isometric drawing studio

**File:** `F13/F13-03-Isometric-Drawing-PREMIUM-CORE.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 11.7px.
**Values:** lesson values go through `scene` records using the native draw `visual` with a full state object.
**Example question:** `No cubes are hidden behind others. How many unit cubes make this model?` → 4
**Checks:** 165/165 passed.

## F13-04 — Plans and elevations

**File:** `F13/F13-04-Plans-and-Elevations-PREMIUM-CORE.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 11.7px.
**Values:** lesson values go through `scene` records using the native draw `renderStage` with a full state object.
**Example question:** `How many squares will the TOP PLAN of this model show?` → 2
**Checks:** 165/165 passed.

## F13-05 — Cube-stacking volume

**File:** `F13/F13-05-Cube-Stacking-Volume-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 9.2px.
**Values:** lesson values go through `scene` records using the native draw `renderStage` with a full state object.
**Example question:** `What is the volume of this solid in unit cubes?` → 8
**Checks:** 168/168 passed.

## F13-06 — Prism volume slicer

**File:** `F13/F13-06-Prism-Volume-Slicer-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `renderStage` with a full state object.
**Example question:** `The prism's cross-section has area 6 square units and its length is 7 units. Find its volume.` → 42
**Checks:** 171/171 passed.

## F13-07 — Cuboid volume and surface area

**File:** `F13/F13-07-Cuboid-Volume-and-Surface-Area-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `renderStage` with a full state object.
**Example question:** `A cuboid is 5 by 3 by 2 units. Find its volume in cubic units.` → 30
**Checks:** 171/171 passed.

## F13-08 — Cylinder unroll

**File:** `F13/F13-08-Cylinder-Unroll-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `stageBuild` with a full state object.
**Example question:** `A cylinder has radius 2 and height 4. Its curved surface area is kπ square units. Find k.` → 16
**Checks:** 169/169 passed.

## F13-09 — Pyramid and cone fill

**File:** `F13/F13-09-Pyramid-and-Cone-Fill-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `makeStage` with a full state object.
**Example question:** `A cone has radius 3 and perpendicular height 5. Its volume is kπ cubic units. Find k.` → 15
**Checks:** 170/170 passed.

## F13-10 — Sphere volume and surface area

**File:** `F13/F13-10-Sphere-Volume-and-Surface-Area-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `makeStage` with a full state object.
**Example question:** `A sphere has radius 2. Its surface area is kπ square units. Find k.` → 16
**Checks:** 171/171 passed.

## F13-11 — Cross-sections explorer

**File:** `F13/F13-11-Cross-Sections-Explorer-PREMIUM-CORE.html`  
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
| Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore | PASS | 67 | all passed |
| Bank regression (test-components.cjs) | PASS | — | evidence/bank-regression-results.json |

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `makeStage` with a full state object.
**Example question:** `The cube is cut horizontally. Find the area of the cross-section in square units.` → 9
**Checks:** 165/165 passed.

## F13-12 — Capacity and volume conversion

**File:** `F13/F13-12-Capacity-and-Volume-Conversion-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `makeStage` with a full state object.
**Example question:** `The litre cube is filled to the level shown. How many millilitres of water are inside?` → 350
**Checks:** 171/171 passed.

## F13-13 — Surface-area unfolder

**File:** `F13/F13-13-Surface-Area-Unfolder-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `makeStage` with a full state object.
**Example question:** `This cube is 3 by 3 by 3 units. Find its total surface area in square units.` → 54
**Checks:** 171/171 passed.

## F13-14 — Solid enlargement

**File:** `F13/F13-14-Solid-Enlargement-PREMIUM-CORE.html`  
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

**Phone layout at 390 (iframe 312px):** dedicated narrow layout: True; main SVG viewBox 420 drawn at 258px; labels (median / 10th percentile) 11.7 / 8.6px.
**Values:** lesson values go through `scene` records using the native draw `makeStage` with a full state object.
**Example question:** `The solid is enlarged by scale factor 3. Its volume is multiplied by what number?` → 27
**Checks:** 167/167 passed.
