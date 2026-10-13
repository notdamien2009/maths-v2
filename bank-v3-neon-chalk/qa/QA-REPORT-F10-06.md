# F10-06 · Gradient Visual — Run 06 Premium Review QA

**Review status:** Premium review build. Owner has not yet given GOLD approval.
**Source:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, exact F10-06 prompt, and the existing F0/F1 drawing principles / accepted F10-02 to F10-05 review builds.

## Automated browser evidence

| Viewport | Motion preference | Passed | Failed |
|---|---|---:|---:|
| 380px | regular | 29/29 | 0 |
| 380px | reduced | 29/29 | 0 |
| 1280px | regular | 29/29 | 0 |
| 1280px | reduced | 29/29 | 0 |
| **All interaction checks** | | **116/116** | **0** |

**Additional responsive mode checks: 16/16 passed**, covering 320, 380, 768, 1280px in Watch, Guided, Explore and Challenge. No browser errors detected by those tests; SVG visibility >=60% of drawing plane; no horizontal page overflow. The visual QA package includes actual screenshot evidence of all modes and the relevant context graphs.

### Tested behaviours (repeated at each 380/1280 × motion combination)

- Watch, Guided, Explore and Challenge mount the premium framed navy mathematical stage with authentic helper images and no horizontal page overflow.
- All seven named lesson presets calculate the exact expected signed rise, run and slope or context rate.
- Endpoints A and B support keyboard movement; moving B up/down updates the fractional rise/run display without any stale result.
- Restore resets endpoints; horizontal lines show gradient 0. Vertical lines (zero run) are guarded in the implementation and show undefined (static rule check).
- Pointer dragging snaps B to a genuine 0.5-y-step grid target; Escape cancels an in-progress drag and allows re-grabbing without leaving a stray drag handle.
- Challenge values are not printed in the evidence panel ahead of marking. Incorrect answers receive specific feedback.
- Four challenge tasks independently mark (1) 1.5, (2) moving B to (2, −1) for gradient −1, (3) −2 m/s², and (4) 2 km/h. The task transition no longer imports stale Explore controls.
- Reduced-motion mode and desktop/mobile combinations complete with no browser errors.
- The original shared core + editable source reproduce the distributed offline HTML byte-for-byte; no external fetches are needed to view it.

### F0/F1 visual-quality comparison

- Checked rendered results, not solely CSS variables, against F0-02 and earlier F10-02/F10-05 benchmark layouts.
- Layered navy background motif and defined glass-framed teaching stage are present. Graph, axes, line, glowing endpoints, perpendicular rise/run steps and stacked chalk fraction are visually separate.
- Mobile axis-label collision next to the zero was corrected; 320px, 380px and desktop screenshots were rechecked after the correction.
- Distance–time is labeled speed in km/h. Velocity–time is labeled acceleration in m/s²; a descending line does not automatically mean negative velocity. Both formulas were shortened to readable teaching notation.

### Rebuild audit

- Standalone HTML file SHA-256: `a39da297a5b3a928295c4f450940ebb18c241b760005891c23cdbdea3e21fa17`.
- Local rebuild against supplied established NOVA shared core was byte-for-byte identical to the standalone file.
- The rebuild script refuses to fall back if the recipient's repository lacks `NOVA.ui.svgDrag`, `NOVA.neonPlot`, `NOVA.scene.helperStrip`, or the established bank renderer.

### Known limitations / approval gates

- The master prompt includes generic card-to-graph matching and red removal-tray interactions. They are **not implemented**; dragging endpoints onto a mathematical snap grid, cancellation, re-grabbing and keyboard interactions are implemented. Removing one of the two defining line endpoints would make the gradient undefined, so a removable tray was not inserted merely for decoration. If literal card/tray interactions are mandatory for F10-06, request a targeted follow-up run.
- No direct push to GitHub; no changes to the shared F0 core. F10-01's separate background correction remains outstanding.
- Visual approval rests with the owner; these results do not automatically designate F10-06 as GOLD.
