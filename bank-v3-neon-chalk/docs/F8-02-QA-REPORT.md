# NOVA F8 Run 03 — QA Evidence: F8-02 Inverse-operations Flowchart

**Status: PREMIUM REVIEW CANDIDATE — NOT GOLD.** Fresh presentation preset of the original F8-03 source; never a new registry engine.

## Automated tests (executed on this exact compiled output)

| Test | Evidence | Result |
|---|---|---|
| Mathematical operations and inverses | `tests/math_f802.py`, `tests/F8-02-math-results.json`: round-trip on positive/negative/decimal values; exact forward/reverse mappings; incorrect-rule proof rejection | **4816/4816 PASS** |
| Browser, modes and challenge | `tests/qa_f802.py`, `tests/F8-02-browser-results.json`: Guided/Watch/Explore/Challenge across 380 and 1280; both lesson presets, keyboard placement/delete, wrong rule & wrong value rejected | **86/86 PASS** |
| Real pointer stress | `tests/stress_f802.py`, `tests/F8-02-stress-results.json`: real rapid mouse gestures, exact slot snap, drag re-grab/return, invalid drop rejection, no active stray drag state | **24/24 PASS** |
| Responsive and assets | `tests/width_f802.py`, `tests/F8-02-width-results.json`: viewport widths 380/430/760/1280 × 4 modes; zero overflow or broken inline images; 380/1280 full-page captures | **16/16 PASS** |
| JS/HTML completeness | `build/build-f8-02.py` expands all tokens and creates `F8/F8-02-inverse-operations-flowchart.html` | PASS |

## Source provenance and independent-engine avoidance

- Base engine: `src/F8-03.js`, SHA-256 `0ac7273a5d04f8393ec692a7c2dc34f90113a5a7892792ee2def72e8a6c17843` (read from Run 02 review, not modified).
- Compiled preview core: `core/nova-core.js`, SHA-256 `48400e5a068d3d3a36d76318e31accfb499a9fa7efe886498e5dc0caad6dc78b` from Run 02 review.
- The new incremental ZIP deliberately excludes core files and excludes any replacement F8-03 source; `build/build-f8-02.py` reads the owner's installed versions when recompiling.
- Browser assertion checks exactly one F8-family registered engine (`F8-03`) and no `F8-02` standalone registry entry. Manifest declares `kind=presentation-preset` and `engine=F8-03`.

## Visual, mascot and accessibility evidence

- `shots/F8-02-380-guided-stage.png`, `shots/F8-02-1280-guided-stage.png`: forward route above, reverse route below; maths evidence cards fill stage; gradient glass and tube glow through F0 helpers.
- `shots/F8-02-380-explore-stage.png`, `shots/F8-02-1280-explore-stage.png`: tray/drop targets/return zone, neon frame lines and readable Chalk maths.
- `shots/F8-02-380-challenge-stage.png`, `shots/F8-02-1280-challenge-stage.png`: unrevealed answer, number field outside SVG, F0 mascot strip and Izaac Challenge peer in full-page mode; only the canonical existing `think`/`celebrate` teen poses are selected, not unsupported `read-tablet`.
- `shots/F8-02-380-guided-full-page.png`, `shots/F8-02-1280-guided-full-page.png`: F0 mode tabs, Sir Bob teaching, no mascot black background, responsive full page.
- SVG interactive groups use role/button/tabindex/aria-label, keyboard Enter and Delete and F0 pointercancel/Escape safety. Theme and print remain from current F0 core.

## Limits / remaining owner gate

- A direct `file://` open could **not** be tested by the managed Chromium because it returned `ERR_BLOCKED_BY_ADMINISTRATOR`; all functional browser tests used the fully compiled inline HTML via `page.set_content`, which correctly executes its embedded resources. The owner should double-click the HTML on the target Windows/Edge computer before signoff.
- Native touchscreen QA, physical screen-reader use and integration into the full NOVA lesson engine have NOT been performed.
- Owner must compare real rendered output with approved F0/F2/F3/F4/F5/F6/F7/F12 benchmark and approve it. No GitHub writes, no shared core edits.
