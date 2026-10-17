# F15 test and QA

Executed in headless Google Chrome with Playwright. Reproduce:
`NOVA_SOURCE_ROOT=<root> NODE_PATH=<folder containing playwright> [NOVA_CHROMIUM_PATH=<browser>] tools/f15/run-f15.sh`

`integration/qa/test-f15-production.cjs` is generated from the F13 test by `tools/f15/gen_test_f15.py` with the F15 payload inlined. It makes all the F13 checks:
- native page, 4 modes × 390/1024/1440;
- template F0-12 Challenge with 6 question states and concealment;
- Guided, Bob, multi-view and Explore;
- 390 resize redraw, with a median label ≥ 11 px and a 10th percentile ≥ 8 px;
- pupil state kept across a resize in Explore and Challenge, including the 1440→390→1440 round trip giving identical stage markup;
- the stage still responds after the round trip, including keyboard drawings;
- the pressed state is part of the fingerprint;
- no "Lesson values" button.

F15 changes to the test:
- **Stricter concealment check.** The F13 check looked for the exact answer token, so "0.50" or "−1.000" would not count as showing 0.5 or −1. The F15 check normalises U+2212 and fails on any token numerically equivalent to the answer (same rule as the runtime). It applies to answers ≥ 13, negative answers and decimal answers. Small whole numbers are still not checked strictly, because they coincide with scale labels.
- **New 390 checks:**
  - the Challenge game's drawing is repainted in the phone layout (viewBox narrower than 600);
  - no second drawing is left outside the game.
  - Up to 3 s are allowed for the debounced layout repaint.
  - Both checks failed before the runtime fix described in F15-code-changes.md.
- **Resize panel-text comparison ignores whitespace only.** In F15-10/11 the Challenge choice buttons wrap differently at 390, so `innerText` gains spaces between the same words. The words, inputs and pressed states must still be identical.

**Bank regression:** `integration/qa/test-components.cjs` was run from a fresh `qa-after` folder for all 11 engines (evidence/bank-regression-results.json).

**Payload:** six numeric questions per engine (`tools/f15/f15payload.js`), adapted from each engine's own Challenge questions. The answers are computed in the payload and rounded to the dp the prompt asks for. They were checked by hand and against the engines' own Challenge answers, which were captured from the original pages with `_challenge.solve()`. Decimal answers carry a tolerance of ½ unit in the last asked place. F15-10's exact-value questions (√3/2 and so on) are not numeric, so its six questions are side lengths. F15-11's vocabulary questions are choices, so its six are measures.

Visual review: every question state of all 11 engines was rendered and inspected at 1000 px, and the 390 game screenshots were inspected after the fix.

The thresholds are this audit's own bar. A real speech engine, a screen reader and touch devices were not tested.
