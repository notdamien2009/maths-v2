# NOVA F7-03 — Evidence-based QA · 11 October 2026

**Status:** Premium review, **NOT GOLD**. Local source build and scripted browser QA are complete; live NOVA lesson integration and owner approval remain pending.

## Core integrity / foundation lock
- Canonical bank JavaScript SHA-256: `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`.
- Canonical bank CSS SHA-256: `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`.
- Checksums copied unchanged from F7-02. This incremental archive deliberately **omits core/** to prevent overwrites. Its compiled standalone HTML embeds the exact source core through `build/build-f7-03.py`.

| Mandatory guard | Direct evidence | Result |
|---|---|---|
| F0 original design and maths language | `src/F7-03.js:63–88`, `.css`; real screenshots `shots/F7-03/F7-03-{380,1280}-{watch,guided,explore,challenge}-STAGE.png` | PASS: Neon Tube / NOVA Chalk preserved |
| Four working modes, two screen formats | `tests/qa_f703.py`, `tests/f703-browser-results.json`; screenshots at 380 and 1280 plus render checks at 320 and 768 | **76/76 PASS** |
| Actual tile evidence rather than decoration | `src/F7-03.js:29–46` (coefficients, parser and misconceptions), `:51–81` (three families), `tests/stress_f703.py` | PASS; all five presets and four Challenge source expressions mathematically verified |
| Mouse SVG drag, invalid drop, undo and Escape | `src/F7-03.js:71–77`, `:94–103`, `:129–137`; `tests/interaction_f703.py` | PASS at 380 and 1280, including no stranded tiles |
| True Challenge checking, no answer leaked in visible stage | `src/F7-03.js:105–125`; four challenge rounds in `tests/interaction_f703.py` | PASS; rejected uncollected, wrong-sign, unlike-term and missing-square answers |
| Extended widths, signed presets, reduced/normal motion | `tests/stress_f703.py`, `tests/f703-stress-results.json` | **56/56 PASS**, 320, 380, 768, 1280 |
| Canonical mascots / narration | `src/F7-03.js:21–26`, `:83`, F0 helper strip and tutor timeline | PASS: four distinct short helper cues; original embedded helpers |
| Accessibility and print | Keyboard 1/2/3/R; `aria-label` on SVG tile controls; alt-text monitor; `src/F7-03.css` print and reduced-motion through F0 | Browser checks PASS; independent accessibility certification still pending |
| Production hygiene | Standalone HTML, editable isolated source, package top directory, no external libraries / no F0 modifications | PASS |
| Owner acceptance | Human design and interaction review | PENDING; not GOLD |

## Recorded automated results
- `tests/f703-browser-results.json`: **76/76 passed**.
- `tests/f703-interaction-results.json`: **50/50 passed**.
- `tests/f703-stress-results.json`: **56/56 passed**.
- **Combined completed checks: 182/182 PASS.** The first extended suite reached a runner time limit before printing its summary; the same suite was rerun to completion, giving the 56/56 result above. This is not counted twice.

## Remaining QA gates
- Owner's side-by-side visual and interaction approval relative to F0, F1, F2, F7-01 and F7-02.
- Integration within the full NOVA lesson shell; no claim of production release.
- Broader assistive-technology review on actual hardware remains outstanding.
