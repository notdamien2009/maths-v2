# F10 code changes
All 20 engine files (F10-01 to F10-20) get the changes below. `tools/f10/build10.py` makes them, using per-engine settings from `hooks10.py`, and stops if an anchor is missing or appears twice.
1. **Lesson API:** canonical `integration/nova-v2-lesson-api.js` plus the support scripts (`nova-explore-policy`, `nova-speech-policy`, `nova-f10-runtime`, `nova-f10-contracts`, `nova-f4-runtime`), embedded inline.
2. **F3 core fixes:** the timeline reset, drag-snap, speech and game-scoring hunks, the same set F4, F6 and F8 used (`f3-core-hunks.json` [8:18]).
3. **Lesson hook** (`tools/f10/hook.js`):
   - `data.lesson.state.preset` picks a native preset. Other state keys override either the engine's model fields or that preset's fields (a merged preset is registered under a hidden, non-enumerable `__lessonN` key, last 24 kept).
   - The engine model is snapshotted before the lesson draw and restored afterwards, so native Guided, Explore and Challenge are unchanged.
   - Concealed records (and phases before the reveal) use the engine's own Challenge draw call. Other phases use the engine's own scene/step renderer with short generic captions. No new artwork.
   - The lesson apply/restore pair is recorded with the draw, so a width relayout replays the lesson values.
4. **Contracts** (`integration/nova-f10-contracts.js`): only native keys with native value types; no functions or markup; |numbers| ≤ 500; phase 0 to 12. Per-engine rules (`rules10.js`) follow each engine's own drag/slider/drawing limits, for example whole-number grid points, distinct ids, increasing x for graphs, a non-zero quadratic coefficient, radius within the grid, a < b for the trapezium interval, and c = 0 for direct-proportion presets in F10-05.
5. **Runtime** (`integration/nova-f10-runtime.js`): the F8 runtime with the lesson context replay. Width relayout on breakpoint crossings (760 px; F10-14 also 350 px) replays the last draw, keeping pupil state and the F0-12 host. Accessibility tidy-up and the phone-label floor (SVG labels under 11 px at narrow widths are enlarged, up to 2.4×).
6. **Engine patches (anchored, minimal):**
   - F10-05: the task-0 caption prints the lesson's own gradient (native always printed y = −x + c).
   - F10-15: inequality text uses the sign of the constant (native showed y ≤ −x − 2 for y ≤ −x + 2); the test-point verdict is hidden in an unmarked Challenge.
   - F10-17, F10-18: motion trails receive path data (native passed an SVG group, logging an SVG error on every draw).
   - F10-19: the asymptote note is hidden in an unmarked Challenge.
   - F10-20: the over/under note is hidden in an unmarked Challenge; the scene is recorded for relayout (it had no draw hook).
