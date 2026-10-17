# F6 code changes
Every upgraded file (F6-01…07, 09, 10, 11, 14) gets the following. `tools/f6/build6.py` makes the changes and stops if an anchor is missing or appears twice.
1. **Lesson API:** canonical `integration/nova-v2-lesson-api.js`, plus support scripts (`nova-explore-policy`, `nova-speech-policy`, `nova-f6-contracts`, `nova-f4-runtime`, `nova-f6-runtime`), embedded inline.
2. **F3 core fixes:** timeline reset, drag-snap, speech and game scoring hunks, the same set F4 used (`f3-core-hunks.json` [8:18]).
3. **Lesson hook** (`tools/f6/hook.js`):
   - `data.lesson.state` is merged over the native preset.
   - The engine's own step renderer draws `phase`.
   - Concealed records, and phases before the engine's reveal step (`hidden.json`), use the engine's own Challenge draw call with the lesson preset. No new artwork.
4. **Contracts** (`integration/nova-f6-contracts.js`):
   - Only native preset keys are allowed.
   - Positive finite numbers (zero only where a native preset uses zero).
   - Per-engine maths rules: divisible totals, raw×clear = whole, legs that sum to the totals, widths that divide the area, and so on.
5. **Runtime** (`integration/nova-f6-runtime.js`):
   - Width relayout, shared with F5 fix3: the last draw is replayed on a breakpoint crossing, which keeps pupil state and the F0-12 host.
   - Accessibility tidy: removes `null`/`undefined` attribute strings and slider values on `role=img`; labelled `g` → `role=group`.
   - Phone-label floor: SVG labels under 11 px at narrow widths are enlarged, up to 2.4×.
6. **Engine-specific fixes:**
   - F6-03 step 5–6 and F6-14 step 4–5 captions are computed from the drawn ratio. The words stay the same for the default preset, so native regression is unchanged.
F6-08, F6-12 and F6-13 are config-only presets whose host engines (F10-05, F18-02, F14-11) do not exist yet, so they are delivered unchanged.
