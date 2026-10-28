# F11 test and QA

Executed in headless Google Chrome with Playwright. Reproduce:
`NOVA_SOURCE_ROOT=<root> NODE_PATH=<folder containing playwright> [NOVA_CHROMIUM_PATH=<browser>] tools/f11/run-f11.sh`

`integration/qa/test-f11-production.cjs` makes the same checks as the F9 test:
- native page, 4 modes × 390/1024/1440
- template F0-12 Challenge with 6 question states and concealment (strict absence for answers ≥ 13)
- Guided, Bob, multi-view and Explore
- 390 resize redraw, with a median label ≥ 11 px and a 10th percentile ≥ 8 px
- pupil state kept across a resize in Explore and Challenge, including the 1440→390→1440 round trip giving identical stage markup

New for F11:
- **Explore must have no "Lesson values" preset button.**
- **The stage still responds to the pupil after the round trip.** In Explore the test presses an arrow key on the stage handle, or moves a visible range control, and requires the stage to change. This check is not generated for engines without such a control (F11-03 and F11-09).

**Bank regression:** `integration/qa/test-components.cjs` passed for all 11 engines (evidence/bank-regression-results.json).

The thresholds are this audit's own bar. A real speech engine, a screen reader and touch devices were not tested.
