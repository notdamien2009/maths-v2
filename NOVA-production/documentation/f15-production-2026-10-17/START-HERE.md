# F15 production upgrade (Pythagoras, trigonometry and circles), 2026-10-17

The F15 pack has 11 engines: F15-01, 02, 06–14. There is no F15-03/04/05; F15-10's file is `NOVA-F15-10-Special-Triangle-Values.html`.

Read in this order:
1. status-table.md
2. F15-individual-audit.md
3. F15-template-integration.md
4. F15-code-changes.md
5. F15-test-and-QA.md

**To merge:** add `integration/F15-adapter-rows.json` to component-adapters.json once the earlier families have merged. The shared file was not edited.

**To rebuild:** run tools/f15/patch_f15.py, which uses tools/f15/edits.

**To regenerate the test:** run tools/f15/gen_test_f15.py. It needs the F13 test as its base.

**To re-run the tests:** run tools/f15/run-f15.sh.

| Component | Upgraded | F15 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |
|---|---|---|---|---|---|---|---|
| F15-01 Pythagoras Squares-on-Sides | yes | 172/172 | pass | true | 11.9 / 11.2px | yes | PASS WITH LIMITATIONS |
| F15-02 Pythagoras Finder | yes | 170/170 | pass | true | 12.6 / 11.2px | yes | PASS WITH LIMITATIONS |
| F15-06 Trig Ratio Builder | yes | 172/172 | pass | true | 11.9 / 10.6px | yes | PASS WITH LIMITATIONS |
| F15-07 Angle Slider and Ratio Table | yes | 172/172 | pass | true | 11.7 / 11.7px | yes | PASS WITH LIMITATIONS |
| F15-08 Unit Circle Explorer | yes | 173/173 | pass | true | 11.7 / 9.5px | yes | PASS WITH LIMITATIONS |
| F15-09 Trig Solver | yes | 172/172 | pass | true | 11.1 / 9.2px | yes | PASS WITH LIMITATIONS |
| F15-10 Special Triangle Values | yes | 171/171 | pass | true | 12.0 / 9.6px | yes | PASS WITH LIMITATIONS |
| F15-11 Circle Parts Diagram | yes | 171/171 | pass | true | n/a (question drawing has no SVG text) | yes | PASS WITH LIMITATIONS |
| F15-12 Circle Theorems Explorer | yes | 172/172 | pass | true | 11.4 / 10.8px | yes | PASS WITH LIMITATIONS |
| F15-13 Sine and Cosine Rule | yes | 173/173 | pass | true | 11.4 / 11.4px | yes | PASS WITH LIMITATIONS |
| F15-14 3D Pythagoras and Trigonometry | yes | 172/172 | pass | true | 11.1 / 11.1px | yes | PASS WITH LIMITATIONS |

## Open issues
- **Answer hiding is numeric, but the working stays visible.** Givens, the other table columns and quotients the prompt implies stay on screen. Examples: in F15-07 "Opp 5.0 / Hyp 10.0" next to an unknown sin 30°, and "sin θ = 0.700" when the prompt gives 7 and 10. In F15-07 a masked table row ("?°") sits between its neighbours. A small whole-number answer also hides an unrelated label with the same value.
- **Scene arguments are merged, not replaced.** The canonical API merges each record argument over the native step-0 argument. F15 records set every key they need, including `timeline:false` for F15-12. The F13 documentation's "replaced wholesale" wording is wrong. F13's tested behaviour is not affected, because its records give full state objects, but that sentence should be corrected when the families are merged. F13 was not edited.
- **F15-11:** the Challenge question drawing (a circle with no labels, so it cannot give the measure away) has no SVG text, so the 390 label-size check has nothing to measure. It is reported as n/a, not as a pass on size.
- **Narrow label margins:** the 390 label medians for F15-09 and F15-14 are 11.1 px. They pass, but with little margin.
- **Locked-art overlaps, left alone** (present in the original artwork):
  - F15-06, F15-07 and F15-09: the "θ …°" angle label sits on the angle arc and hypotenuse end.
  - F15-10: "√3" / "√2" / "1" touch the "Adjacent" / "Hypotenuse" words at both 390 and desktop.
- **Pack hashes:** the supplied F15 pack files differ from the hashes recorded in the bank's adapter rows. The pack was used as the source; its hashes are recorded as `originalSha256` in the capability manifest.
- **State on resize** is kept by replaying the latest draw call with the live state object. Transient animation is not replayed, and a drag in progress is cancelled.
- There has been no real speech, screen-reader or touch-device testing.
