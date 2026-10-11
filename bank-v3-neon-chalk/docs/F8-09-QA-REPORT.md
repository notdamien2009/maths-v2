# F8-09 · Premium Review QA Report (11 October 2026)

**Status:** REVIEW CANDIDATE; not GOLD. No GitHub writes, no core replacements.

## Evidence summary

| Check | Recorded outcome | Evidence |
| --- | --- | --- |
| Maths | **550/550 passed** | `tests/F8-09-math-results.json`, `tests/math_f809.py` |
| Browser + Challenge | **150/150 passed** | `tests/F8-09-browser-results.json`, `tests/browser_f809.py` |
| Pointer + keyboard | **18/18 passed** | `tests/F8-09-stress-results.json`, `tests/stress_f809.py` |
| Responsive | **96/96 passed** | `tests/F8-09-width-results.json`, `tests/width_f809.py` |

## Visual, maths and interaction review

- Source follows exact F8-09 master specification: five input columns, glass output table, named presets for five mapped KS3 lessons, Watch/Guided/Explore/Challenge modes (`src/F8-09.js`; `docs/F8-09-SPEC.md`).
- Visual references: F0 shared SVG helpers `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.svg.root`, shared helper strip; component CSS only scopes F8-09.
- Mathematics: linear and quadratic output generation tested over 101 integers per preset, plus preset card, negative input, state transitions and marking checks (`tests/math_f809.py`).
- Challenge requires all five output cells. Each cell is marked against the exact rule; missing and wrong cells cannot pass. The numeric calculation is hidden until solved (`src/F8-09.js` `working` and `draw`).
- Real pointer: physical mouse events in Chromium drag a card to the first output zone; then re-grab and return to the red tray; keyboard Enter/Delete and non-completion marking checked (`tests/stress_f809.py`).
- Screenshots: 18 Chromium captures, all four modes at 380px and 1280px and all five completed challenges at both widths (`shots/F8-09-*.png`).
- Additional widths: 360, 380, 430, 760, 1280, 1600px, all four modes, overflow/render/JS checks (`tests/width_f809.py`).
- Reduced motion: named-step flow remains readable when motion is disabled. Print CSS removes neon glow.
- All script syntactic checks pass (`node --check src/F8-09.js`). Standalone is self-contained; no remote libraries.
- F0 core is **not included** in the incremental ZIP. Builder uses whichever current approved F0 source exists in the local bank (`build/build-f8-09.py`).

## Outstanding owner acceptance gates

1. Rebuild against the current **GitHub-main F0 core** and run an integration regression; the compiled review HTML uses an earlier F0-derived copy.
2. Open by double-click in Windows Edge; `file://` navigation was not exercised in the managed browser.
3. Physically test touchscreen dragging, keyboard and assistive technology on the target devices.
4. Owner approves premium appearance and learning experience against F2-01 through F2-03.

**This report records the checks actually executed, not a claim of final GOLD approval.**
