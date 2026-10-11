# F6-08 — Direct Proportion Graph · F10-05 preset

**Type:** A named PRESET of **F10-05, y = mx + c explorer**. Not an independent engine. The source repository available for this run does not include F10-05. **Do not insert the preview into the actual production engine registry as a new graph engine.**

## Mathematical purpose

Direct proportion has an invariant multiplier k, so all corresponding points (x, y) satisfy y = kx. The y-intercept is exactly zero. On the graph the line is straight and passes through (0,0). Contrasting y=kx with y=kx+c where c != 0 exposes a common misconception. Given (x,y) with x != 0, k = y/x.

## Preset matrix

| Curriculum | Context | Rule | Domain x | Range y | Known pair | Challenge at x |
| --- | --- | --- | --- | --- | --- | --- |
| Y7-060 | Tickets | y = 2x | 0..6 | 0..12 | (2,4) | 5 → 10 |
| Y8-035 | Stickers | y = 3x | 0..6 | 0..18 | (2,6) | 4 → 12 |
| Y8-036 | Distance | y = 1.5x | 0..8 | 0..12 | (2,3) | 6 → 9 |
| Y9-020 | Rate | y = 0.75x | 0..8 | 0..6 | (4,3) | 6 → 4.5 |

**Parameters:** k/slope, fixed zero intercept, x/y bounds, step intervals, unit labels, known coordinate, target coordinate, context. Named lesson presets are expressed in `presets/F10-05/F6-08-direct-proportion.preset.js`.

## Teaching animation

1. **Plot matching points** — start with (0,0) and a known pair, then add table values to the graph.
2. **Join through origin** — the NOVA Neon Tube line connects corresponding points with c locked to zero.
3. **Read and prove** — use y/x to discover k and explain a new value.

Narration slot per stage, with NOVA mascot poses and caption changes. Any approved F10-05 implementation should use its host timeline, not a second F6 engine timeline.

## Interactions

A pupil can move the large neon ring among valid scaled points; drop value-rings from the table onto matching plotted points; regrab, cancel or move an item to the return tray. There are keyboard alternatives (arrow/Home/End for the marker, Enter to match a table item, Delete to return). The F0 `NOVA.ui.svgDrag` API supplies the pointer semantics. Local guide lines are click-through to avoid masking the draggable ring; F0 is unchanged.

Challenge asks for k and the missing y for the four presets, hiding the solution cards until checked. Feedback distinguishes reversing division, copying y, and adding rather than multiplying. Four user-facing modes use the common F0 shell **in the preview only**.

## Dependency, compatibility, and QA scope

This ZIP contains a **standalone visual demonstrator** to permit design review. It uses embedded copies of the current approved `core/nova-core.js` and `.css` at build time, but the ZIP does **not** replace either file. The F10-05 preset config is production-targeted; its integration hook is intentionally not claimed complete without the actual host source. Once F10-05 exists, register this config inside the parent host and rerun all browser, drag and mathematical checks on that exact integration. No changes to GitHub are authorized.

**Status:** premium review candidate — visual preview QA and source mathematics tested, but **F10-05 host integration and native touchscreen testing not yet completed**, no owner GOLD sign-off.
