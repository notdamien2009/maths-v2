# Combined release: executed results

All checks passed in installed Microsoft Edge through Playwright on Windows. The lessons were loaded directly as local files, using the packaged HTML and inline original apparatus.

| Check | Result |
|---|---|
| Three random-number lessons: engines, challenges, reset, Guided, Bob, navigation and viewport fit | 255/255 |
| Assessment marking, written review, incomplete Exit protection and reload persistence | 18/18 |
| Independent number editing, isolated reset and custom Watch states/reset | 13/13 |
| Local lesson with networking disabled | PASS; no failed resource requests or runtime errors |
| Challenge questions completed against independent numeric keys | 54 |
| Start/Practice/Exit responses entered and checked | 90; written responses correctly sent for review |
| Guided configured selections rendered | 36 |
| Bob configured slides rendered | 36 |
| Viewports | 1440, 1024 and 390 pixels |
| Portable generator reproduces tested lesson byte-for-byte | PASS |
| Packaged registry | 57 entries, every source path present |
| 57 component files match current working bank | PASS |
| Every sample lesson's embedded F1/F2/F3 source matches the packaged source | PASS |

The three lessons use F1-01 number-line distances, F2-07 multiplication grids and F3-01 arrays with different generated values (seeds 16317, 72841, 90523). Each has six rounds per component and three independent game sessions. A wrong answer holds its question and reduces lives; six subsequent correct answers produce 85 points and the victory sticker; New game restores score/lives/question and clears stale red feedback. This last cleanup was found during visual review and fixed in the canonical controller and template before the final rerun.

Editing evidence: F1 value changed with the keyboard; F2 grid changed to 23 × 11 = 253; F3 array changed to 7 × 4 = 28. Other families' drawings stayed unchanged. Resetting F2 retained the F1/F3 edits. Watch moved between custom records and restored its starting mathematical state in each family.

The mouse test explicitly scrolls controls below the sticky parent header before clicking. Initial test harness failures caused by clicks under that header, changing generated SVG IDs and the author's first assessment slot counts were corrected; they were not passed off as product successes. The final reports contain successful reruns against the corrected generated lesson and shared feedback fix.

Raw evidence is under test-lessons. Historical family-level evidence is under documentation; its hashes refer to those earlier audit runs. source-hashes.json pins the current combined release, including the changed template/controller. The generator uses the original shell's fixed assessment slot types and counts.

These results cover the named mixed apparatus and supplied random values. They do not certify every possible mixed component combination, every voice/device or newly authored question. The individual family guides document numerical bounds. Future lesson exports still require their own end-to-end review.

## F4
F4 (2026-10-16, Chrome 154 headless, Linux, Playwright 1.62.1): 396/396 template assertions and 126/126 native regression, drag and axe assertions.

| ID | Component | Status | challengeReady | Template | Native |
|---|---|---|---|---|---|
| F4-01 | Part–whole bar | PASS | true | 33/33 | 12/12 |
| F4-02 | Comparison bar | PASS | true | 33/33 | 12/12 |
| F4-03 | Cuisenaire rod builder | PASS WITH LIMITATIONS | true | 33/33 | 12/12 |
| F4-04 | Multi-step bar model | PASS WITH LIMITATIONS | true | 33/33 | 9/9 |
| F4-05 | Fraction of an amount bar (preset of F5-11) | PASS WITH LIMITATIONS | true | 33/33 | 12/12 |
| F4-06 | Percentage bar | PASS WITH LIMITATIONS | true | 33/33 | 12/12 |
| F4-07 | Ratio bar | PASS WITH LIMITATIONS | true | 33/33 | 12/12 |
| F4-08 | Algebra bar | PASS | true | 33/33 | 12/12 |
| F4-09 | Before-and-after bar | PASS | true | 33/33 | 12/12 |
| F4-10 | Bar-to-equation translator (preset of F4-08) | PASS WITH LIMITATIONS | true | 33/33 | 12/12 |
| F4-11 | Word-problem highlighter | PASS WITH LIMITATIONS | true | 33/33 | 9/9 |
| F4-12 | Rates tape diagram | PASS | true | 33/33 | 12/12 |


## F5 test results (2026-10-16/17)

| Component | Upgraded | F5 tests | Bank regression | challengeReady | Status |
|---|---|---|---|---|---|
| F5-01 Fraction strips & wall | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-02 Fraction circles · Precision sector workshop | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-03 Fractions · Premium precision area engine | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-04 Fractions on a Number Line | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-05 Equivalent fractions · Precision Splitter | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-06 Fraction Simplifier · Magnetic Group Forge | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-07 Add & Subtract Fractions · Equal-Unit Workshop | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-09 Divide Fractions · Precision Grouping Lab | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-10 Mixed &amp; Improper Fractions · Whole-Builder Forge | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-11 Fraction of an Amount · Equal-Share Studio | yes | 144/144 | pass | true | PASS WITH LIMITATIONS |
| F5-12 Hundred-Square Percentage Studio | yes | 147/147 | pass | true | PASS WITH LIMITATIONS |
| F5-13 FDP Conversion Machine | yes | 147/147 | pass | true | PASS WITH LIMITATIONS |
| F5-14 Percentage of an Amount | yes | 147/147 | pass | true | PASS WITH LIMITATIONS |
| F5-15 Percentage Change & Multipliers | yes | 147/147 | pass | true | PASS WITH LIMITATIONS |
| F5-16 Reverse Percentages | yes | 147/147 | pass | true | PASS WITH LIMITATIONS |
| F5-17 Recurring Decimal Explorer | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-18 Decimal Sorting Studio | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |
| F5-19 Pizza & Chocolate Fraction Workshop | yes | 141/141 | pass | true | PASS WITH LIMITATIONS |

F5 production test 141–147 checks per component, all passing; bank regression test-components.cjs 18/18. Limitations: see documentation/f5-production-2026-10-16/F5-test-and-QA.md.


## Fix pass 2026-10-17
See FIX-NOTES.md: F4-10 band removed, F4-05 aligned to F5-11, F5 resize fixed (288/288 resize, 2571/2571 F5 checks).

# F6 test results (2026-10-17)

| Component | Upgraded | F6 tests | Native regression | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|---|
| F6-01 Ratio table | yes | 47/47 | 12/12 | pass | true | 12.5 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-02 Double number line | yes | 47/47 | 12/12 | pass | true | 11.9 / 11.9px | yes | PASS WITH LIMITATIONS |
| F6-03 Sharing in a ratio | yes | 47/47 | 12/12 | pass | true | 12.1 / 11.1px | yes | PASS WITH LIMITATIONS |
| F6-04 Simplifying ratios | yes | 47/47 | 12/12 | pass | true | 11.3 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-05 Recipe scaler | yes | 47/47 | 12/12 | pass | true | 11.4 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-06 Best-buy comparer | yes | 47/47 | 12/12 | pass | true | 11.9 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-07 Map and scale drawing | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-08 Direct proportion graph | no (preset of F10-05, host missing) | – | – | – | false | – | – | PRESET ONLY |
| F6-09 Inverse proportion rectangle | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-10 Speed-distance-time | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-11 Rates-of-change tank | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-12 Currency and unit bridges | no (preset of F18-02, host missing) | – | – | – | false | – | – | PRESET ONLY |
| F6-13 Proportion in geometry | no (preset of F14-11, host missing) | – | – | – | false | – | – | PRESET ONLY |
| F6-14 Ratio and fraction translator | yes | 47/47 | 12/12 | pass | true | 12.4 / 11.0px | yes | PASS WITH LIMITATIONS |

Totals: semantic 517/517, native regression 132/132, resize 132/132. Details: documentation/f6-production-2026-10-17/F6-test-and-QA.md

## F7 test results (2026-10-16/17)

| Component | Upgraded | F7 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F7-01 Algebra Tiles | yes | 162/162 | pass | true | 12.2 / 8.4px | yes | PASS WITH LIMITATIONS |
| F7-02 Zero-Pair Animation | yes | 164/164 | pass | true | 17.6 / 13.9px | yes | PASS WITH LIMITATIONS |
| F7-03 Collecting Like Terms | yes | 162/162 | pass | true | 21.0 / 16.0px | yes | PASS WITH LIMITATIONS |
| F7-04 Expanding Single Brackets | yes | 166/166 | pass | true | 11.3 / 11.3px | yes | PASS WITH LIMITATIONS |
| F7-05 Expanding Double Brackets | yes | 168/168 | pass | true | 11.3 / 11.3px | yes | PASS WITH LIMITATIONS |
| F7-06 Factorising with Tiles | yes | 162/162 | pass | true | 15.2 / 9.1px | yes | PASS WITH LIMITATIONS |
| F7-07 Completing the Square | yes | 167/167 | pass | true | 15.1 / 12.2px | yes | PASS WITH LIMITATIONS |
| F7-08 Balance Scales | yes | 162/162 | pass | true | 12.4 / 12.0px | yes | PASS WITH LIMITATIONS |
| F7-09 Balance with Negatives and Unknowns | yes | 162/162 | pass | true | 12.4 / 11.1px | yes | PASS WITH LIMITATIONS |
| F7-10 Cups-and-Counters Solver | yes | 162/162 | pass | true | 12.3 / 11.5px | yes | PASS WITH LIMITATIONS |
| F7-11 Bar-Model Equation | yes | 162/162 | pass | true | 14.8 / 12.4px | yes | PASS WITH LIMITATIONS |
| F7-12 Substitution Machine | yes | 168/168 | pass | true | 16.9 / 12.7px | yes | PASS WITH LIMITATIONS |
| F7-13 Difference of Two Squares | yes | 162/162 | pass | true | 16.3 / 13.4px | yes | PASS WITH LIMITATIONS |
| F7-14 Identity Visualiser | yes | 162/162 | pass | true | 13.8 / 11.8px | yes | PASS WITH LIMITATIONS |

F7 production test per component (native 4 modes × 390/1024/1440, template F0-12 Challenge with 6 question states, concealment, Guided, Bob, multi-view, 390 resize redraw and label size, pupil state kept across a 1440→390 redraw in native Explore and Challenge) plus bank regression test-components.cjs. Details: documentation/f7-production-2026-10-16/F7-test-and-QA.md.

## F9 test results (2026-10-17)

| Component | Upgraded | F9 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F9-01 Matchstick Pattern Builder | yes | 169/169 | pass | true | 14.4 / 14.4px | yes | PASS WITH LIMITATIONS |
| F9-02 Term-to-term Animator | yes | 168/168 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-03 Position-to-Term Table | yes | 169/169 | pass | true | 15.8 / 13.6px | yes | PASS WITH LIMITATIONS |
| F9-04 Sequence on a Graph | yes | 167/167 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-05 Linear nth Term Derivation | yes | 165/165 | pass | true | 12.6 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-06 Geometric Sequence | yes | 168/168 | pass | true | 12.0 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-07 Special Sequences | yes | 168/168 | pass | true | 13.2 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-08 Triangular Numbers Dot Arrays | yes | 169/169 | pass | true | 12.6 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-09 Quadratic Sequence | yes | 169/169 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-10 Pascal’s Triangle | yes | 167/167 | pass | true | 13.2 / 13.2px | yes | PASS WITH LIMITATIONS |
| F9-11 Spot-the-Rule Puzzle | yes | 165/165 | pass | true | 13.8 / 11.4px | yes | PASS WITH LIMITATIONS |
| F9-12 Sequence Continuer | yes | 168/168 | pass | true | 15.0 / 12.0px | yes | PASS WITH LIMITATIONS |
| F9-13 Fractal Generators | yes | 168/168 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |

F9 production test per component (native 4 modes × 390/1024/1440, template F0-12 Challenge with 6 question states, concealment, Guided, Bob, multi-view, 390 resize redraw and label size, pupil state kept across a 1440→390 redraw in native Explore and Challenge) plus bank regression test-components.cjs. Details: documentation/f9-production-2026-10-17/F9-test-and-QA.md.

## F11 test results (2026-10-17)

| Component | Upgraded | F11 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F11-01 Protractor | yes | 171/171 | pass | true | 11.2 / 10.6px | yes | PASS WITH LIMITATIONS |
| F11-02 Angle Estimator | yes | 171/171 | pass | true | 11.8 / 9.0px | yes | PASS WITH LIMITATIONS |
| F11-03 Angle Facts | yes | 169/169 | pass | true | 11.3 / 10.0px | yes | PASS WITH LIMITATIONS |
| F11-04 Triangle Angle-Sum Tear-Off | yes | 170/170 | pass | true | 11.6 / 8.7px | yes | PASS WITH LIMITATIONS |
| F11-05 Parallel Lines Explorer | yes | 167/167 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F11-06 Polygon Angles Turtle | yes | 171/171 | pass | true | 11.6 / 11.6px | yes | PASS WITH LIMITATIONS |
| F11-07 Regular Polygon Builder | yes | 171/171 | pass | true | 12.0 / 12.0px | yes | PASS WITH LIMITATIONS |
| F11-08 Compass Constructions | yes | 171/171 | pass | true | 13.5 / 11.6px | yes | PASS WITH LIMITATIONS |
| F11-09 Locus Builder | yes | 169/169 | pass | true | 11.1 / 11.1px | yes | PASS WITH LIMITATIONS |
| F11-10 Bearings | yes | 171/171 | pass | true | 13.4 / 12.4px | yes | PASS WITH LIMITATIONS |
| F11-11 Angle Chase | yes | 169/169 | pass | true | 11.2 / 11.2px | yes | PASS WITH LIMITATIONS |

F11 production test per component (native 4 modes × 390/1024/1440, template F0-12 Challenge with 6 question states, concealment, Guided, Bob, multi-view, 390 resize redraw and label size, pupil state kept across a 1440→390 redraw in native Explore and Challenge) plus bank regression test-components.cjs. Details: documentation/f11-production-2026-10-17/F11-test-and-QA.md.

# F8 test results (2026-10-17)

| Component | Upgraded | F8 tests | Native regression | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|---|
| F8-01 Step by step working animator | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-02 Inverse operations flowchart | yes | 47/47 | 12/12 | pass | true | 12.9 / 11.7px | yes | PASS WITH LIMITATIONS |
| F8-03 Function machine | yes | 47/47 | 12/12 | pass | true | 14.7 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-04 Two way function machine | yes | 47/47 | 12/12 | pass | true | 12.3 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-05 Both sides equation solver | yes | 47/47 | 12/12 | pass | true | 11.7 / 11.1px | yes | PASS WITH LIMITATIONS |
| F8-06 Rearranging formulae | yes | 47/47 | 12/12 | pass | true | 11.7 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-07 Expression builder | yes | 47/47 | 12/12 | pass | true | 13.5 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-08 Equivalence checker | yes | 47/47 | 12/12 | pass | true | 13.5 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-09 Substitution table | yes | 47/47 | 12/12 | pass | true | 16.4 / 11.1px | yes | PASS WITH LIMITATIONS |
| F8-10 Simultaneous equations | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-11 Inequality solver | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-12 Quadratic solve routes | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-13 Index laws in algebra | yes | 47/47 | 12/12 | pass | true | 14.6 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-14 Algebraic fraction simplifier | yes | 47/47 | 9/9 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-15 Misconception spotter | yes | 47/47 | 12/12 | pass | true | 11.8 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-16 Modelling cycle stepper | yes | 47/47 | 12/12 | pass | true | 13.5 / 11.2px | yes | PASS WITH LIMITATIONS |
| F8-17 Algebraic proof builder | yes | 47/47 | 12/12 | pass | true | 11.3 / 11.0px | yes | PASS WITH LIMITATIONS |
| F8-18 Iteration trial and improvement | yes | 47/47 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |

Totals: semantic 846/846, native regression 213/213, resize 216/216, bank 18/18. Details: documentation/f8-production-2026-10-17/F8-test-and-QA.md

# F10 test results (2026-10-17)

| Component | Upgraded | F10 tests | Native regression | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|---|
| F10-01 Four Quadrant Grid | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-02 Shape on Grid | yes | 48/48 | 12/12 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F10-03 Midpoint and Distance | yes | 48/48 | 12/12 | pass | true | 15.1 / 15.1px | yes | PASS WITH LIMITATIONS |
| F10-04 Table to Graph Plotter | yes | 48/48 | 12/12 | pass | true | 13.2 / 13.2px | yes | PASS WITH LIMITATIONS |
| F10-05 y = mx + c Explorer | yes | 48/48 | 12/12 | pass | true | 12.4 / 12.4px | yes | PASS WITH LIMITATIONS |
| F10-06 Gradient Visual | yes | 48/48 | 12/12 | pass | true | 13.0 / 13.0px | yes | PASS WITH LIMITATIONS |
| F10-07 Parallel and Perpendicular Lines | yes | 48/48 | 12/12 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |
| F10-08 Graph Intersections | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-09 Real Life Graph Interpreter | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-10 Distance Time Graph | yes | 48/48 | 12/12 | pass | true | 12.1 / 12.1px | yes | PASS WITH LIMITATIONS |
| F10-11 Speed Time Graph | yes | 48/48 | 12/12 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F10-12 Quadratic Grapher | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-13 Cubic Reciprocal Exponential | yes | 48/48 | 12/12 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F10-14 Graph Transformer | yes | 48/48 | 12/12 | pass | true | 14.4 / 14.4px | yes | PASS WITH LIMITATIONS |
| F10-15 Inequality Region Shader | yes | 48/48 | 12/12 | pass | true | 11.3 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-16 circle on a grid | yes | 48/48 | 12/12 | pass | true | 12.6 / 12.6px | yes | PASS WITH LIMITATIONS |
| F10-17 graph matching sorter | yes | 48/48 | 12/12 | pass | true | 11.3 / 11.3px | yes | PASS WITH LIMITATIONS |
| F10-18 Piecewise and Non standard Graph Builder | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-19 Trigonometric Graph Explorer | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F10-20 Tangent and Area under Curve Estimator | yes | 48/48 | 12/12 | pass | true | 11.0 / 11.0px | yes | PASS WITH LIMITATIONS |
| F6-08 Direct proportion (preset row) | hosted by F10-05 | see F10-05 | n/a | n/a | true | see F10-05 | see F10-05 | PASS (via host) |

Challenge game at 390 px (no stale desktop drawing, no hidden copy): 20/20. F6-08 host test: 22/22.

Totals: semantic 960/960, native regression 240/240, resize 240/240, bank 20/20. Details: documentation/f10-production-2026-10-17/F10-test-and-QA.md

## F13 test results (2026-10-17)

| Component | Upgraded | F13 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F13-01 3D solid viewer | yes | 165/165 | pass | true | 11.1 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-02 Net folder | yes | 165/165 | pass | true | n/a (question drawing has no SVG text) | yes | PASS WITH LIMITATIONS |
| F13-03 Isometric drawing studio | yes | 165/165 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F13-04 Plans and elevations | yes | 165/165 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F13-05 Cube-stacking volume | yes | 168/168 | pass | true | 11.7 / 9.2px | yes | PASS WITH LIMITATIONS |
| F13-06 Prism volume slicer | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-07 Cuboid volume and surface area | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-08 Cylinder unroll | yes | 169/169 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-09 Pyramid and cone fill | yes | 170/170 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-10 Sphere volume and surface area | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-11 Cross-sections explorer | yes | 165/165 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-12 Capacity and volume conversion | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-13 Surface-area unfolder | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-14 Solid enlargement | yes | 167/167 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |

F13 production test per component (native 4 modes × 390/1024/1440, template F0-12 Challenge with 6 question states, concealment, Guided, Bob, multi-view, 390 resize redraw and label size, pupil state kept across a 1440→390 redraw in native Explore and Challenge) plus bank regression test-components.cjs. Details: documentation/f13-production-2026-10-17/F13-test-and-QA.md.

## F15 test results (2026-10-17)

| Component | Upgraded | F15 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F15-01 Pythagoras Squares-on-Sides | yes | 172/172 | pass | true | 11.9 / 11.2px | yes | PASS WITH LIMITATIONS |
| F15-02 Pythagoras Finder | yes | 170/170 | pass | true | 12.6 / 11.2px | yes | PASS WITH LIMITATIONS |
| F15-06 Trig Ratio Builder | yes | 172/172 | pass | true | 11.9 / 10.6px | yes | PASS WITH LIMITATIONS |
| F15-07 Angle Slider and Ratio Table | yes | 172/172 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F15-08 Unit Circle Explorer | yes | 173/173 | pass | true | 11.7 / 9.5px | yes | PASS WITH LIMITATIONS |
| F15-09 Trig Solver | yes | 172/172 | pass | true | 11.1 / 9.2px | yes | PASS WITH LIMITATIONS |
| F15-10 Special Triangle Values | yes | 171/171 | pass | true | 12.0 / 9.6px | yes | PASS WITH LIMITATIONS |
| F15-11 Circle Parts Diagram | yes | 171/171 | pass | true | n/a (question drawing has no SVG text) | yes | PASS WITH LIMITATIONS |
| F15-12 Circle Theorems Explorer | yes | 172/172 | pass | true | 11.4 / 10.8px | yes | PASS WITH LIMITATIONS |
| F15-13 Sine and Cosine Rule | yes | 173/173 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |
| F15-14 3D Pythagoras and Trigonometry | yes | 172/172 | pass | true | 11.1 / 11.1px | yes | PASS WITH LIMITATIONS |

F15 production test per component (native 4 modes × 390/1024/1440, template F0-12 Challenge with 6 question states, concealment, Guided, Bob, multi-view, 390 resize redraw and label size, Challenge game drawing repainted in the phone layout, pupil state kept across a 1440→390 redraw in native Explore and Challenge) plus bank regression test-components.cjs. Details: documentation/f15-production-2026-10-17/F15-test-and-QA.md.
