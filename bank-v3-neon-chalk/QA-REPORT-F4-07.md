# NOVA F4-07 — Evidence-Based Quality Report

**Status:** Technical QA passed; owner visual approval **PENDING** (not GOLD).

| QA criterion | Evidence and outcome |
|---|---|
| Exact canonical shared core | Build checks source `core/nova-core.js` SHA256 `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21` and CSS `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`. Matches locked reference. No core modification. |
| Single self-contained HTML | `F4/F4-07-ratio-bar.html` SHA256 `fab50eade00f25ac76e31352f6000df81c11b74f581d12a1f399a11bf920414c`; built by `python build/build-f4-07.py` from source and existing core. |
| Drawing standard | `src/F4-07.js` calls shared `N.svg.root`, `N.neonBox`, `N.neonLine`, `N.neonPath`, `N.chalkText`, `N.ui.svgDrag`, `N.scene.helperStrip`; no new filters, colour families or fonts. |
| Maths correctness | `tests/F4-07-BROWSER-RESULTS.json`: verifies 6:9→2:3; 1.5:2.5→3:5; £60→£24+£36; £64→£24+£40, wrong physical construction, missing unit chip, all three challenge flows. |
| Cross-mode / responsive | `tests/test_f407.py` runs all four modes at **380 and 1280 px** and captures `shots/F4-07/F4-07-<width>-<mode>.png`, verifying no horizontal overflow, 3 cards, one SVG, one dock, and no JS page errors. |
| Fast physical drag, cancellation | `tests/test_f407_drag.py`: real Chromium mouse pointer drag of new units, transfers, red remove zone, invalid target rebound, fast 2-step drag, Escape cancellation; keyboard add/delete; chip drag. Run at 380/1280 and normal/reduced motion. |
| Challenge answer integrity | No share values disclosed before the learner demonstrates the model; mathematical check requires canonical integer counts and one-unit value placement, not merely matching colour. |
| Display quality | Responsive neon-glass bars with NOVA Chalk labels, stage labels and existing F0 mascots. Actual Y8 stage/screenshots under `shots/F4-07/`; owner subjectively judges Premium/GOLD. |
| Game wrapper | No game scoring implemented. F0-12 remains external. |

### Recorded runs

- Browser, keyboard and mathematical tests: **128/128 passed**, zero failures.
- Native pointer drag and cancellation: **52/52 passed**, zero failures.
- **Total: 180/180 passed.**
- Rebuilt standalone SHA256: `fab50eade00f25ac76e31352f6000df81c11b74f581d12a1f399a11bf920414c`.

### Outstanding

1. Owner review at 380 and 1280 against accepted F2 premium visual depth, colour language and mascot continuity.
2. Real-device pointer feel / pupil usability review.
3. Expansion to ratio-with-fractions and complex GCSE ratio chains is **not** part of these three approved lesson presets.
