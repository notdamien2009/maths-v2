# F13 production upgrade (3D shapes, volume and surface area), 2026-10-17

Read in this order:
1. status-table.md
2. F13-individual-audit.md
3. F13-template-integration.md
4. F13-code-changes.md
5. F13-test-and-QA.md

**To merge:** add `integration/F13-adapter-rows.json` to component-adapters.json once the earlier families have merged. The shared file was not edited.

**To rebuild:** run tools/f13/patch_f13.py, which uses tools/f13/edits.

**To re-run the tests:** run tools/f13/run-f13.sh.

| Component | Upgraded | F13 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F13-01 3D solid viewer | yes | 165/165 | pass | true | 11.1 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-02 Net folder | yes | 165/165 | pass | true | n/a (question drawing has no SVG text) | yes | PASS WITH LIMITATIONS |
| F13-03 Isometric drawing studio | yes | 165/165 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F13-04 Plans and elevations | yes | 165/165 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F13-05 Cube-stacking volume | yes | 168/168 | pass | true | 11.7 / 9.2px | yes | PASS WITH LIMITATIONS |
| F13-06 Prism volume slicer | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-07 Cuboid volume and surface area | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-08 Cylinder unroll | yes | 169/169 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-09 Pyramid and cone fill | yes | 170/170 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-10 Sphere volume and surface area | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-11 Cross-sections explorer | yes | 165/165 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-12 Capacity and volume conversion | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-13 Surface-area unfolder | yes | 171/171 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |
| F13-14 Solid enlargement | yes | 167/167 | pass | true | 11.7 / 8.6px | yes | PASS WITH LIMITATIONS |

## Open issues
- **Answer hiding is token-based.** Result readouts show "?", but the working stays visible. Examples: "5 × 3 × 2", "4π × 4", and in F13-08 the total "24π" next to "2 ends 8π", from which the curved area can be found by subtraction. For small answers (< 13) an unrelated label with the same value is also hidden (for example "max height ?" in F13-04).
- **F13-02:** the question drawing (a flat net, face numbers off so they cannot give the count away) has no SVG text, so the 390 label-size check has nothing to measure. It is reported as n/a, not as a pass on size.
- **The 390 label median for F13-01 is 11.1 px:** it passes, but with little margin. The 10th percentile is 8.6 px for most engines, because long captions and formula lines were lifted only to 14 units.
- **Locked-art overlaps, left alone:** F13-06 "SLICE" sits over the prism edge, and F13-07 "length" touches the cuboid edge. Both are in the original artwork at 390.
- **Live-update fixes:** captions, tile aria-labels, the F13-03 accessible name, the F13-09 clipPath leak, the F13-10 "area ÷ π" tile and the F13-14 masked strip are correctness fixes to the native code. They are listed in F13-code-changes.md.
- **Pack hashes:** the supplied F13 pack files differ from the `original_sha256` recorded in the bank's adapter rows. The pack was used as the source; its hashes are recorded as `originalSha256` in the capability manifest.
- **State on resize** is kept by replaying the latest draw call with the live state object. Transient animation is not replayed, and a drag in progress is cancelled.
- There has been no real speech, screen-reader or touch-device testing.
