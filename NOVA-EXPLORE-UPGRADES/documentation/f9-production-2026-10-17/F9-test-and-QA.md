# F9 test and QA

Executed in headless Google Chrome with Playwright. Reproduce:
`NOVA_SOURCE_ROOT=<root> NODE_PATH=<folder containing playwright> [NOVA_CHROMIUM_PATH=<browser>] tools/f9/run-f9.sh`

`integration/qa/test-f9-production.cjs` is the F7 test with the same checks:
- native page, 4 modes × 390/1024/1440
- template F0-12 Challenge with 6 question states and concealment
- Guided, Bob, multi-view and Explore
- 390 resize redraw, plus a median label ≥ 11 px and a 10th percentile ≥ 8 px

**Pupil state across a resize (Explore and Challenge).** At 1440 the pupil actions are:
- keyboard-place a stage source (drag card) into a slot;
- move the first range input;
- type into answer boxes;
- press a building button.
If those actions leave the state unchanged (some sequences return to the start value), further panel buttons are pressed until the state differs. The test then resizes to 390 and requires all of the following:
- a layout redraw with no mode reset;
- identical panel text and inputs;
- identical svg state data and interactive-object count;
- NEW for F9: after 1440→390→1440, the normalised stage markup is identical to the markup before the resize. Mascot pose and the game host are ignored.

**Bank regression:** `integration/qa/test-components.cjs` passed for all 13 engines (evidence/bank-regression-results.json).

The thresholds are this audit's own bar. A real speech engine, a screen reader and touch devices were not tested.
