# F7 test and QA

Executed in headless Google Chrome with Playwright. Reproduce from the project root:
`NOVA_SOURCE_ROOT=<root> NODE_PATH=<folder containing playwright> [NOVA_CHROMIUM_PATH=<browser>] tools/f7/run-f7.sh`
Set `NOVA_SOURCE_DIR=originals` to run the same test against original files.

`integration/qa/test-f7-production.cjs` checks, per component:
- **Native page**, 4 modes × 390/1024/1440 with full-page screenshots:
  - glow filters use userSpaceOnUse; no ★☆■◆✓◌▲ leaks; no inline slash fractions in drawings; no TBD
  - chalk font on SVG labels; no dark full-width frame; mascot from the embedded approved pack
  - no horizontal overflow; no visible undefined/NaN
- **Template fixture lesson:**
  - 6 question-specific F0-12 Challenge states: distinct, given values rendered, answer not shown as a readout or "= answer"; strict absence when the answer is ≥13, negative or a decimal
  - wrong hold, auto-advance, scoring, badge/confetti, reset, hint cost
  - 4 Guided and 4 Bob states; two independent views with no duplicate IDs; Explore mounts
  - lesson and apparatus width at 1440/1024/390
- **Phone layout:** render at 1440, resize to 390, then require the same layout as a fresh 390 load, median SVG label ≥ 11 CSS px, 10th percentile ≥ 8 px, and no overflow.
- **Pupil state across a resize:** on the native page at 1440, in Explore and in Challenge, the test keyboard-activates up to two stage tiles or sources, types into the answer boxes and presses a building button. It checks that this changed the state, then resizes to 390. It requires a layout redraw without a mode reset, identical panel text and input values, and identical stage state (svg data-* state attributes, ignoring layout coordinates, plus the count of interactive objects).
- **Explore presets:** in the template, Explore must show no "Lesson values" button (added 2026-10-17).
- **Bank regression:** `integration/qa/test-components.cjs`.

The 11 px median and 8 px 10th-percentile thresholds are this audit's own readability bar; the master defines no number. A real speech engine, human screen reader and physical touch devices were not tested.
