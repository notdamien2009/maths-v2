# F7-05 Premium Review · Evidence-based QA

| Requirement | Evidence | Status |
|---|---|---|
| Canonical core | F7-04 inlined CSS and JS SHA256 match F0 baseline, reused byte-for-byte; no core files shipped | PASS |
| Shared engine, stable ID | `src/F3-02.js` uses the single registered F3-02 engine; F7-05 entry/manifest alias it | PASS |
| Existing F7-04 preservation | Run04 source used as cumulative base; `tests/f705-qa-results.json` tests its Watch/Explore/Challenge | PASS |
| Eight subject-specific narrated teaching stages | `src/F3-02.js` `F705_STEPS`, `F705_TALK`, `N.scene.helperStrip`, existing `NOVA.motion` | PASS |
| Four modes, responsive | `tests/f705-qa-results.json`: 320/380/768/1280 Watch, Guided, Explore, Challenge; 8 screenshots each 380/1280 | PASS |
| 324 combinations of signed coefficients | `tests/f705-qa-results.json` `maths-324-signed-pairs`, exact distributive expansion at all allowed pairs | PASS |
| Positive/negative visual cues | `src/F3-02.js` `f302-negative-tile` and `NOVA.neonLine` hatch; signed screenshot `shots/F7-05/F7-05-1280-explore-signed-stage.png` | PASS |
| Full challenge, incorrect drop, undo, keyboard | `tests/f705-qa-results.json`: four rounds passed at 380/1280, misplacement springs back | PASS |
| Normal-motion mouse and keyboard | `tests/f705-normal-stress.json`: 8/8 checks at 380/1280 | PASS |
| No console page errors or horizontal overflow | `tests/f705-qa-results.json` mode/width checks | PASS |
| Exclude duplicate component | F7-05 dedicated entry is an alias/preset; F3-02 source updated, not forked | PASS |
| Owner visual approval / full shell lesson integration | Not performed | PENDING |

**Totals:** 92/92 final main checks; 8/8 additional normal-motion physical-interaction checks. The exhaustive 324 signed-pair maths cases are one of the 92 top-level checks. No 100%-of-all-possible-inputs claim is made.

**Scope limitation:** Full screen-reader accessibility audit and production lesson-shell integration have not been performed. Tested standalone browser interface. With shorter laptop viewports, the page may need vertical scrolling to reach the product tray; the component is not a no-scroll integrated lesson shell. The original default F3-02 and prior F7-04 presets still require owner visual approval.
