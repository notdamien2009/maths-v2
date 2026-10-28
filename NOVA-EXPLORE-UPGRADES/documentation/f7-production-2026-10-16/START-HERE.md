# F7 production upgrade (Algebra), 2026-10-16/17 (revised 2026-10-17: stray "Lesson values" Explore preset removed)

Read in this order:
1. status-table.md
2. F7-individual-audit.md (per-component F0/F1/F2/F3, phone-layout, state-on-resize and template checklists)
3. F7-template-integration.md
4. F7-code-changes.md
5. F7-test-and-QA.md

**To merge:** add the rows in integration/F7-adapter-rows.json to component-adapters.json once F6 has merged. That file was deliberately not edited here.

**To rebuild the engines:** run tools/f7/patch_f7.py. It takes the originals, the F3 core and the integration scripts, and applies the per-engine phone-layout edits in tools/f7/narrow/.

**To re-run the tests:** set NOVA_SOURCE_ROOT (production root), NODE_PATH (a Playwright node_modules folder) and optionally NOVA_CHROMIUM_PATH, then run tools/f7/run-f7.sh.

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

## Open issues
- The 390 label measurement uses the first lesson question. For F7-04/05 that view has only one SVG label (the footer); the other values are HTML cards.
- Pupil state across a resize is kept by replaying the latest stage draw calls. Any transient animation or hover state is not replayed, and a drag in progress is cancelled.
- Captions and labels must be supplied in the scene arguments.
- Concealment of small answers is not strict.
- There has been no real speech, screen-reader or touch-device testing.
