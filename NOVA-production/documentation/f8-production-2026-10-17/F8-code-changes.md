# F8 code changes
All 18 engine files (F8-01 to F8-18) get the changes below. `tools/f8/build8.py` makes them, using per-engine settings from `hooks8.py`, and stops if an anchor is missing or appears twice. F8-gallery.html is unchanged.
1. **Lesson API:** canonical `integration/nova-v2-lesson-api.js` plus the support scripts (`nova-explore-policy`, `nova-speech-policy`, `nova-f8-runtime`, `nova-f8-contracts`, `nova-f4-runtime`), embedded inline.
2. **F3 core fixes:** the timeline reset, drag-snap, speech and game-scoring hunks, the same set F4 and F6 used (`f3-core-hunks.json` [8:18]).
3. **Lesson hook** (`tools/f8/hook.js`):
   - `data.lesson.state.preset` picks a native preset. The other state keys override that preset's data fields: objects are merged and lists are replaced.
   - The merged preset is registered under a hidden key (`__lessonN`, not enumerable, last 24 kept), so the engine's own code draws it.
   - `phase` is drawn by the engine's own step renderer in Guided mode.
   - Concealed records and phase 0 use the engine's own Challenge draw call with that preset. No new artwork.
   - Active preset and mode are restored afterwards, so the native Guided, Explore and Challenge modes are unchanged.
4. **Contracts** (`integration/nova-f8-contracts.js`):
   - Only native keys are accepted, with the native value types. No functions, no markup, |numbers| ≤ 500, phase 0 to 12.
   - Per-engine maths rules, checked with a small algebra evaluator (`NovaF8Algebra`). For example: every working line is equivalent to the previous one; function-machine output matches the gears; both-sides rows keep the same solution; simultaneous lines intersect on the drawable grid; inequality steps agree; quadratics have two real roots; index-law kinds and ranges; fraction simplification is equal and the excluded value makes the denominator zero; the engine's own `validPreset` for F8-18.
5. **Runtime** (`integration/nova-f8-runtime.js`): this is the F6 runtime with a recursive `merge`.
   - Width relayout: on a 760 px breakpoint crossing, the last draw is replayed. This keeps pupil state and the F0-12 host.
   - Accessibility tidy-up.
   - Phone-label floor: SVG labels under 11 px at narrow widths are enlarged, up to 2.4×.
