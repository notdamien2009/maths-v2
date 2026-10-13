# F11-05 — Parallel Lines Explorer · Premium Review

**Status:** Browser-tested premium review candidate, awaiting owner approval. **GitHub unchanged.**

## Included
- `F11/F11-05-parallel-lines-explorer.html`: standalone, completely offline HTML with approved NOVA shared core inlined.
- `src/F11-05.js` and `src/F11-05.css`: engine-specific code only; all drawing uses approved core helpers.
- `build/F11-05.src.html` and `build/build-F11-05.py`: reproducible build that reads the current repository's `core/nova-core.js` and `core/nova-core.css`. Copy into the existing `bank-v3-neon-chalk` tree and run `python build/build-F11-05.py`.
- `tests/F11-05-QA.json`, `tests/F11-05-DRAG-QA.json`: browser QA results.
- `tests/test_f115.py`, `tests/test_extra.py`: Playwright scripts, read the HTML from this tree after adding necessary Chromium/Playwright runtime.
- `shots/F11-05`: 380 and 1280 pixel captures for Watch, Guided, Explore, Challenge, alternate, co-interior and bearings.

## Maths and interactions
The engine covers corresponding (equal), alternate interior (equal), co-interior (sum 180°), vertically opposite (equal), and bearings transferred between parallel north lines. Calculations are based on an exact acute transversal angle. In Explore, rotating the ray updates the geometry and values immediately. The handle uses live pointer capture and keyboard arrows without the deliberately lagged draggable-tile behaviour of F0.

**Presets:** Y7-042, Y8-052, Y9-025 and Y9-039. **Teaching:** 13 steps. **Challenge:** 8 reason-and-answer tasks.

## Acceptance checks
All 72 primary tests and all 10 supplementary drag tests passed at 380px and 1280px, including live drag, pointer release, Escape, keyboard arrows, challenge marking, reason card drag, no stranded drag and mascot containment. Full manual owner review is still required. Independent browser QA was performed on the self-contained HTML with the copied approved F11-04 shared core; **no files in `core/` are included in the review ZIP, modified or pushed to GitHub**.

## Known scope
The movable handle uses a direct precision-rotation interaction instead of F0's lagged tile-follow motion. Reason cards support both click-to-select and drop-to-target; they are not dropped directly onto the angle sectors. The dedicated F11-10 Bearings engine will provide deeper bearing problems.
