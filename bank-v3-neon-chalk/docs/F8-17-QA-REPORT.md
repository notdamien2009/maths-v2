# F8-17 Evidence-backed QA — Premium REVIEW, not GOLD

Date: 12 October 2026. Source: `src/F8-17.js` SHA256 `810211e2a03bf4c567868d92a0bb8d7fc91140a3e08760ee28fb67b540b5d0c1`; standalone HTML SHA256 `e42e6eac8002aa5250f6850f9d2232d7a57ea6b9c5e8115455e3888d82332050`.

## Recorded automated checks

| Suite | Passed | Test evidence |
|---|---:|---|
| Browser | 23/23 | `tests/F8-17-browser-results.json` and corresponding `tests/*.py` |
| Challenge | 20/20 | `tests/F8-17-challenge-results.json` and corresponding `tests/*.py` |
| Desktop | 16/16 | `tests/F8-17-desktop-results.json` and corresponding `tests/*.py` |
| Math | 1519/1519 | `tests/F8-17-math-results.json` and corresponding `tests/*.py` |
| Pointer | 10/10 | `tests/F8-17-pointer-results.json` and corresponding `tests/*.py` |
| Recovery | 20/20 | `tests/F8-17-recovery-results.json` and corresponding `tests/*.py` |
| Width | 64/64 | `tests/F8-17-width-results.json` and corresponding `tests/*.py` |

**Total 1672/1672 recorded checks passed**, across independent mathematical identities, all-six Challenge completion, mobile/desktop browser flow, pointer placement/recovery, and four additional responsive widths.

## Master Build Guard — Evidence and qualification

1. **Current F0 core:** Editable `src/F8-17.js` only calls F0 `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.svg.root`, `NOVA.motion.arrive`, `NOVA.ui.svgDrag`, `NOVA.scene.helperStrip` and `NOVA.bankMount`; see the source `draw()`, `interactive()` and `N.bankMount()`. `build/build-f8-17.py` loads **your current local** `core/nova-core.js/.css` and fails if they are missing. The included self-contained review HTML still embeds the earlier F0-derived review runtime and has NOT been verified against the current GitHub-main core; this is an explicit remaining integration gate.
2. **Shared primitives:** Statement/justification shapes use `NOVA.neonBox`; connectors use `NOVA.neonLine`; all mathematical text uses `NOVA.chalkText`. No custom number line, tick or unrelated SVG diagram appears. Source `draw()` is the drawing contract.
3. **Fractions:** No mathematical fraction is drawn in this component, so no placeholder notation is present or required. Other family components retain the approved stacked-fraction lock.
4. **Premium visual depth:** Review screenshots `shots/F8-17-380-guided-board.png`, `shots/F8-17-1280-guided-board.png`, `shots/F8-17-380-challenge-complete.png` show full-scale neon proof cards, glowing connectors, chalk labels, and resolved completed state. Responsive geometry: `src/F8-17.js` SVG 960 coordinate space, scaled by the existing core. A human side-by-side aesthetic acceptance check remains outstanding.
5. **Dragging and recovery:** Actual browser pointer moves and drops are recorded in `tests/F8-17-pointer-results.json` and `tests/F8-17-recovery-results.json` using `tests/pointer_f817.py`, `tests/recovery_f817.py`. Statement and justification chips drop to matching slots; wrong-type drops reject, `NOVA.ui._drag` clears, off-target recovery, keyboard placement, undo and reset were exercised. No real phone/tablet touchscreen was available.
6. **Mascots:** `NOVA.scene.helperStrip()` is used, with different stage poses and brief mathematical reactions, plus existing Sir Bob `steps[].narration`. Mascot drawing is NOT invented or replaced. Image alt repair applies to the mounted card; source `alt()`.
7. **Component contract:** `window.F817_CONFIG` declares fixed events. `emit()` uses `{engine,key,value}`. No pupil-visible developer IDs inside stages; gallery metadata stays inside the host. `window.F817_TEST` is a test interface, not a pupil control. No external dependencies are required for the standalone HTML.
8. **QA evidence:** Independent truth tests run 1,519 checks. Challenge suite completes all six investigations; mobile/desktop/browser and multi-width files are included. Screenshots are archived, with no unsubstantiated blanket PASS.
9. **Owner acceptance:** **Not yet accepted.** Windows Edge double-click, local-core recompile, actual physical touchscreen gestures and owner visual approval are not certified by this package. Do NOT classify as GOLD.

## Mathematical safeguards

- Proof structure contains exactly four statements and three justifications. Every link must match the valid formal proof; wrong statements (`SX`) and wrong reasons (`JX`) are rejected.
- General claims concern integer variables. The board includes formal symbolic reasons; sampled numerical tests in the maths suite are independent regression tests, **not** a substitution for a proof.
- Scope: one F8-17 algebraic proof component, six presets, no fabricated KS3 lesson mapping (master describes it as an audited GCSE extension).

## Source and package hygiene

- Files are additive: F8-17 source, builder, spec, tests, screenshots and preview only. No `core/` directory, previous F8 builds, sample reference HTML or unused helper asset packs.
- GitHub untouched. Recompile locally before integration and obtain explicit owner approval.
