# F8-15 — evidence-based automated QA (premium review, not GOLD)

## Overall result

**353/353 executed automated checks passed**, based on JSON records in `tests/`. A local F0-derived review runtime was used. Manual owner approval is not implied.

| Gate | Evidence | Result |
|---|---|---|
| Mathematics | `tests/math_f815.py`, `tests/F8-15-math-results.json` | 77/77 |
| Browser, presets, modes and Challenge | `tests/browser_f815.py`, `tests/F8-15-browser-results.json` | 146/146 |
| Real mouse pointer / dragging | `tests/stress_f815.py`, `tests/F8-15-stress-results.json` | 18/18 |
| Responsive / no horizontal overflow | `tests/width_f815.py`, `tests/F8-15-width-results.json` | 112/112 |

## What was checked

1. **Maths:** Each of the six curated worked examples has exactly four lines and one incorrect mathematical line. Each has three correction choices and exactly one correct choice. Pure engine tests reject the wrong line and correction, accept the right pair, and validate independent arithmetic witnesses, sign rules and inequality boundary logic. Source: `src/F8-15.js`, `tests/math_f815.py`.
2. **Core drawing provenance:** `src/F8-15.js` uses F0's `NOVA.neonBox`, `NOVA.neonRing`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.svg.root` and `NOVA.scene.helperStrip`; the local builder embeds the existing core rather than overriding any shared `core/` file.
3. **Teaching:** Six `STEPS` with per-preset Sir Bob narration; 4 F0 modes confirmed in browser. Watch/Guided reveal the error then correction as teaching progresses; Challenge requires learner identification before correction choices appear.
4. **Interaction:** F0 `NOVA.ui.svgDrag` drives both the lens and correction cards. Real Playwright mouse movement places the lens, rejects invalid steps and correction cards, correctly accepts the valid card, and ends with no stranded `NOVA.ui._drag` at 380 and 1280 px. The pointer test uses 380×1500 viewport to keep both targets visible during a full physical drag; narrower 380×850 mode/layout checks were run separately.
5. **Accessibility:** Row Enter/Space, Inspect buttons, correction-card Enter, correction buttons, Undo/Reset/Hint, aria-labels, svg title and feedback live region; `prefers-reduced-motion` included. Physical touch and screen-reader audit are not represented as automated passes.
6. **Mobile/Desktop:** Each of Watch, Guided, Explore and Challenge tested at 360, 380, 414, 760, 1024, 1280 and 1536 px with no document horizontal overflow and no JavaScript page errors.
7. **Visual evidence:** Actual final render screenshots include `shots/F8-15-380-explore-board.png`, `shots/F8-15-1280-guided-board.png`, `shots/F8-15-380-pointer-complete.png`, `shots/F8-15-1280-pointer-complete.png` and 22 other PNG captures.
8. **Packaging:** Standalone HTML compiled successfully with `build/build-f8-15.py`; static JS syntax check passed with Node. ZIP archive integrity tested. No old F8 implementation, external libraries, or separate replacement shared-core source is included.

## Remaining approval and known limits

- The included standalone review HTML is built against the locally available F0-derived review core, not an independently verified latest GitHub-main core checkout. Rebuild against your own checked-out `core/` and re-run QA.
- No actual Windows Edge double-click, iOS/Android touchscreen, screen-reader manual audit or owner sign-off was performed.
- The Challenge-peer helper uses available F0 persona/pose selection; any absent bespoke Izaac pose is not claimed as independently produced.
- The six datasets intentionally have the incorrect line in position 3. The error-finding mechanic is reusable; a future difficulty variation should randomise the faulty position with mathematically validated models, not merely shuffle existing assertions.
