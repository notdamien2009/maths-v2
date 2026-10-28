# F11 production upgrade (Angles and constructions), 2026-10-17

Read in this order:
1. status-table.md
2. F11-individual-audit.md
3. F11-template-integration.md
4. F11-code-changes.md
5. F11-test-and-QA.md

**To merge:** add `integration/F11-adapter-rows.json` to component-adapters.json once the earlier families have merged. The shared file was not edited.

**To rebuild:** run tools/f11/patch_f11.py, which uses tools/f11/edits.

**To re-run the tests:** run tools/f11/run-f11.sh.

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

## Open issues
- The 390 label medians are close to the 11 px bar for F11-01, 03, 09 and 11 (11.1–11.3 px). They pass, but with little margin.
- F11-04: in the native artwork, the caption "BRING THE CORNERS HERE" overlaps the A/B vertex labels at every width. It was left unchanged, because the art is locked.
- The supplied F11 pack files differ from the `original_sha256` recorded in the bank's adapter rows. The pack was used as the source; its hashes are recorded as `originalSha256` in the capability manifest.
- State is kept by replay or a relayout hook. Transient animation/hover is not replayed, and a drag in progress is cancelled.
- Concealment of small answers (<13) is not strict.
- There has been no real speech, screen-reader or touch-device testing.
