# F9-05 — Linear Nth Term Derivation · RUN 05 OWNER REVIEW

**Status:** Review build, not GOLD. **GitHub unchanged.**

## Mathematical explanation
- From consecutive term values, find the common difference `d`.
- Write the multiple-of-position row `d × n`.
- Subtract the `dn` row from the term row: the same `c` appears in every column.
- Step back from position 1 to 0: `c = T(1) - d`.
- Derive and validate `T(n) = dn + c` using 1–5 terms.

## Named presets
- Y7-037: 5, 8, 11, 14, 17 → `T(n) = 3n + 2`; sixth term = 20.
- Y8-019 increasing: 2, 7, 12, 17, 22 → `T(n) = 5n − 3`; sixth term = 27.
- Y8-019 decreasing: 18, 14, 10, 6, 2 → `T(n) = −4n + 22`; sixth term = −2.

## Modes
- Watch: 6 maths-first steps; show differences, dn row, constant offset, zero term, nth term.
- Guided: F0 NOVA timeline and prompts with one canonical mascot dock.
- Explore: switch between three named presets; reveal/hide separate zero-term marker.
- Challenge: 3 increasing/different-offset/decreasing patterns; drag the correct `d` and `c` cards into `dn + c`. Wrong cards produce diagnostic feedback; drag snapping, red removal tray, re-grab, keyboard Enter/Deletion, hint, reset, correct checking and full progression. No correct answers are printed in the challenge side cards.

## Style and integration
- Shared original NOVA premium algebra background with x/y/n texture, board border, chalk typography, line/ring/box/hop primitives, and one mascot dock. No custom F9 background and no duplicates.
- Standalone review HTML embeds the **working F3 reference runtime** including authentic mascots and two Chalk fonts.
- Repo checked-in `core/nova-core.js` still lacks certain F3/F2 drag and motion functions. The reproducible builder references `F3/F3-01-array-builder.html`; this integration discrepancy is unresolved and must be reconciled before repo-wide integration. No changes to F0/F1/F2/F3 or shared core.

## QA evidence
- Functional/visual: **70/70 PASS**, 380px and 1280px, 6 Watch steps, 4 modes, three challenge tasks, typography, background and single mascot.
- Pointer/keyboard stress: **22/22 PASS**, 1-step fast drops, wrong drop rejection, snap, red tray removal, keyboard Delete, re-placement, full check, no stranded pointer.
- Screenshots: **18** from both widths (6 Watch + Guided/Explore/Challenge per width).
- Build reproducibility test result: `tests/F9-05-build-reproducibility.txt`.

**Owner review gate:** compare side by side with F9-01 v3 and F0/F1/F2; do not call GOLD without visual sign-off.
