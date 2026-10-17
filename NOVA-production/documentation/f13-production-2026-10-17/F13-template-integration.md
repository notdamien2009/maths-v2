# F13 template integration contract

Mount through the unchanged `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html`. Lesson values go through `{nativeIndex:0, scene:{function, arguments}}` using the native draws. They are validated by `NovaF13Contracts.validate(id, record)`.

**Scene arguments are merged over the native defaults: the lesson API copies the native argument and overlays the question values key by key (nested objects merge the same way), so a record only needs the keys it changes.** Keys you leave out keep their native default values (listed in `F13-configuration-examples.json`). The table below lists every state key that can be set.

| Engine | Scene function | Arguments (state keys) |
|---|---|---|
| F13-01 | `mountStage` | `{st:{shape, yaw, pitch, show, xray}, caption, pose, interactive}` |
| F13-02 | `scene` | `{st:{shape, fold, focus, showNumbers, selected, yaw, pitch, variant, detached}, caption, pose, interact}` |
| F13-03 | `visual` | `{st:{grid, focus, tool, wire, showDots, showAxes, showNumbers, hover, drag, undo, redo, preset, onChange}, caption, pose, interactive}` |
| F13-04 | `renderStage` | `{st:{grid, preset, focus, tool, showHeights, showEdges, view, showViews, selectedView, challengeTarget, drag, undo, redo, paintOnChange}, caption, pose, interactive}` |
| F13-05 | `renderStage` | `{st:{grid, preset, focus, tool, showGhost, showNumbers, reveal, selectedLayer, viewMode, drag, undo, redo, paintOnChange, challengeTarget, _svg}, message, pose, interactive}` |
| F13-06 | `renderStage` | `{st:{shape, length, cut, showSlabs, showFace, showLabels, ghost, azimuth, activeDrag, stage, sv, refresh, step}, message, pose}` |
| F13-07 | `renderStage` | `{st:{preset, l, w, ht, unfold, group, grid, labels, angle, stage, sv, refresh}, message, pose}` |
| F13-08 | `stageBuild` | `{st:{preset, r, ht, unroll, rotation, visible, seams, stage, refresh, svg}, message, pose}` |
| F13-09 | `makeStage` | `{st:{preset, kind, base, ht, pours, phase, flow, showMeasure, showLabels, refresh, cleanup, anim, svg}, message, pose, allowDrag}` |
| F13-10 | `makeStage` | `{s:{preset, r, view, yaw, pitch, cut, showHidden, spin, anim, refresh, cleanup}, msg, pose, interactive}` |
| F13-11 | `makeStage` | `{s:{shape, orient, pos, yaw, pitch, geometry, refresh}, msg, pose, interactive}` |
| F13-12 | `makeStage` | `{s:{preset, mode, fill, yaw, refresh, anim, cleanup, svg}, spoken, pose, interactive}` |
| F13-13 | `makeStage` | `{s:{preset, fold, selected, included, showAreas, yaw, pitch, sv, refresh, raf, animation, finished}, message, pose, allow}` |
| F13-14 | `makeStage` | `{s:{preset, k, focus, yaw, hold, masked, scene, stats, raf, onChange}, msg, pose}` |

**Answer hiding:** F13 drawings print their own computed results. While a question is unanswered, the F13 runtime replaces every whole-number token equal to `privateAnswer` with "?" in stage text and aria-labels/titles, unless the prompt contains that number. The working stays visible, for example "5 × 3 × 2 = ?", "4π × 4", or a total from which a part could be subtracted. If a lesson must not show the working, choose the record accordingly. Small answers (< 13) are hidden the same way, so an unrelated label with the same value (for example "max height 2" when the answer is 2) also shows "?".

**Prompts must give what the drawing does not.** Examples: the F13-11 cut position ("halfway up"), the F13-13 dimensions, and the F13-14 scale factor in words. Use F13-08/09/10 answers of the form kπ, with "Find k".

**Explore ranges (enforced by the contracts):**
- F13-07 l, w, h 1–6;
- F13-08 r 1–4, h 1–6;
- F13-09 base and height 2–8;
- F13-10 r 2–8;
- F13-11 position −1..1;
- F13-12 fill 0–1;
- F13-14 k 0.5–3.

**Challenge:** 6–8 records per concept, each with prompt / privateAnswer / answerType / hint / feedback. Examples are in `F13-configuration-examples.json`; there are six per engine and every answer has been checked.
