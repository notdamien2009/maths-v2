# F9 production upgrade (Sequences), 2026-10-17

Read in this order:
1. status-table.md
2. F9-individual-audit.md
3. F9-template-integration.md
4. F9-code-changes.md
5. F9-test-and-QA.md

**To merge:** add `integration/F9-adapter-rows.json` to component-adapters.json once the earlier families have merged. These rows add `lessonScene` to `draws` and carry the new sha256. The shared file was not edited.

**To rebuild:** run tools/f9/patch_f9.py, which uses tools/f9/lesson and tools/f9/edits.

**To re-run the tests:** run tools/f9/run-f9.sh (see F9-test-and-QA.md).

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

## Open issues
- Lesson values use the new `lessonScene` draw, not the native draw functions, because native F9 draws take SVG/DOM arguments. Its visuals are simpler than the full native scenes.
- The phone label floor (19 units) is applied to engine-owned text helpers. Core-drawn text inherits it only where an engine edit was made (F9-02/F9-06 hop pills, F9-04 plot ticks).
- State is kept by replaying the latest draw calls. Transient animation/hover is not replayed, and a drag in progress is cancelled.
- Concealment of small answers is not strict.
- There has been no real speech, screen-reader or touch-device testing.
