# F5 test and QA

Browser: Google Chrome (headless) via Playwright from `integration/node_modules`. Executed 2026-10-16/17.

1. **`integration/qa/test-f5-production.cjs`** (run per component by `tools/f5/run-f5.sh`), 141–147 checks per component, **all 18 passing**.
   - **Native standards:** 4 modes × widths 390/1024/1440 with full-page screenshots. Checks: glow filters use userSpaceOnUse; no ★☆■◆✓◌▲ leaks; no inline slash fractions in drawings; no TBD; chalk font on SVG labels; no dark full-width frame; mascot from the embedded approved pack; no horizontal overflow; no visible 'undefined'/'NaN'.
   - **Template:** fixture lesson from the approved template with 6 question-specific Challenge records, plus 4 Watch / 4 Guided / 4 Bob records.
     - The 6 states are distinct and render their given values.
     - No result-role readout appears before answering. The answer value is not visible where the check can be strict (answer ≥ 13 or a decimal).
     - Two independent views with no duplicate IDs.
     - Explore mounts.
     - F0-12: wrong answer holds the question and costs a life; 6 correct answers auto-advance to completion; score is 85 after one retry; badge and confetti; reset; hint cost.
     - Lesson page and apparatus frame stay within 1440/1024/390.
2. **`integration/qa/test-components.cjs`** (bank regression, unchanged): all 18 pass for native modes, invalid-state rejection, value binding, and template Learn/Explore/Challenge wrong-hold/correct-advance/Examples/Bob. Results: `evidence/bank-regression-results.json`.

## Not covered (honest scope)
- Real speech output and human screen-reader testing were not done.
- Physical touch devices were not tested.
- Concealment of small-integer answers relies on result-role masking, because scale labels can legitimately contain the same digit.
- Engines choose phone or desktop layout at render time. Resizing an already-rendered page does not re-layout until the next render, so a lesson must render after its iframe is sized. The template Challenge screenshots at 390 were resized after rendering and show the desktop layout.
- Only the generated fixture lessons were tested, not real lessons. Each new lesson still needs its own maths and layout check.
