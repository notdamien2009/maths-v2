# F13 test and QA

Executed in headless Google Chrome with Playwright. Reproduce:
`NOVA_SOURCE_ROOT=<root> NODE_PATH=<folder containing playwright> [NOVA_CHROMIUM_PATH=<browser>] tools/f13/run-f13.sh`

`integration/qa/test-f13-production.cjs` is the F11 test with the F13 payload. It makes the same checks:
- native page, 4 modes × 390/1024/1440;
- template F0-12 Challenge with 6 question states and concealment (strict absence for answers ≥ 13);
- Guided, Bob, multi-view and Explore;
- 390 resize redraw, with a median label ≥ 11 px and a 10th percentile ≥ 8 px;
- pupil state kept across a resize in Explore and Challenge, including the 1440→390→1440 round trip giving identical stage markup;
- the stage still responds to the pupil after the round trip;
- no "Lesson values" preset button.

F13 additions (these widen the test, they do not relax it):
- **Pupil actions and the round-trip responds check also use the keyboard-operable drawing.** Many F13 solids are driven from the SVG itself (`role=group`, `tabindex=0`): arrow keys turn the solid or move the target, and Enter adds a cube. The responds check therefore now also runs for F13-01, 03 and 04.
- **The state fingerprint includes the pressed/checked state of panel choice buttons.** Choosing an answer in a multiple-choice Challenge (F13-01/02) counts as a pupil action, and it must survive the resize.
- **Label size with no SVG text:** the F13-02 question drawing (a net with face numbers off, so they cannot give the count away) has no SVG text at all. The 390 label checks treat a count of 0 as "nothing to read" and record the count. This is reported, not hidden: see the per-engine audit.

**Bank regression:** `integration/qa/test-components.cjs` was run from a fresh `qa-after` folder for all 14 engines (evidence/bank-regression-results.json).

Every payload answer was checked by hand. It was also checked against the original engines' own readouts in fresh, timeline-paused renders, and all values sit within the engines' Explore ranges.

The thresholds are this audit's own bar. A real speech engine, a screen reader and touch devices were not tested.
