# F11 code changes (2026-10-17)

All 11 engines (F11-01..F11-11) were rebuilt from the supplied originals (`F11-originals.zip`) by `tools/f11/patch_f11.py`. No drawings, fonts, colours, mascots, maths or desktop layouts were replaced.

1. **Embedded core v1.4 JS updated to the current F3 core**, the same as F5/F7/F9. The embedded lesson API was replaced with the canonical `integration/nova-v2-lesson-api.js`, and `nova-explore-policy.js` and `nova-speech-policy.js` are embedded.
2. **No new draw function.** F11 native draws are already value-driven: each takes `(stage, options)`, where the options are plain numbers and flags such as `challenge`/`hide`/`revealed`. Lesson values therefore go through `scene` records naming the native draw. The answer stays hidden through the engine's own challenge/hide flags.
3. **New `integration/nova-f11-contracts.js`:** finite numbers, plus per-engine option ranges. Examples:
   - F11-01 angle 0–180° with base right/left;
   - F11-04 two given angles summing below 180°;
   - F11-06/07 3–12 sides;
   - F11-10 bearings 0–359°.
4. **New `integration/nova-f11-runtime.js`**, derived from the F9 runtime: concealment, the narrow F0-12 layout, and layout-class redraw at 480/600/700/720/760/820/1024.
   - The adapter `draws` are wrapped and replayed, as in F9.
   - **NEW, the relayout hook `NovaF11Runtime.onRelayout(key, fn, alive)`:** F11-06..F11-11 Explore keep a live drawing handle (`box`) with drag handles bound after drawing, so a plain replay would leave those closures pointing at a detached drawing. Their Explore now registers a hook (`tools/f11/edits/`) that rebuilds the handle from the pupil's live state, so drags and controls keep working after a resize.
   - There is no "Lesson values" preset wrapper.
5. **F11-06:** a repaint keeps the geometry layer in its original place, below the drag handle. Before this change a repaint drew it over the handle's hit area.
6. **Phone typography (frame ≤ 480 px, sized for the 390 template frame):**
   - F11-02 short chalk labels get a 38-unit floor and F11-04 a 36-unit floor (about 11.8 px). Values, angles and letters of 8 characters or fewer are lifted; long captions keep their native size.
   - F11-07 phone chalk gets a 27-unit floor.
   - The other engines already met the bar with their native phone layouts.
