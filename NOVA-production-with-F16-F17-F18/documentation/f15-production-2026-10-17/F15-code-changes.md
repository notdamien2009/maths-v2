# F15 code changes (2026-10-17)

All 11 engines in the F15 pack (F15-01, 02, 06–14; the pack has no F15-03/04/05, and F15-10 is named `NOVA-F15-10-Special-Triangle-Values.html`) were rebuilt from the supplied originals (`F15-originals.zip`) by `tools/f15/patch_f15.py`. No drawings, fonts, colours, mascots, maths or desktop layouts were replaced.

1. **Embedded core v1.4 JS updated to the current F3 core**, the same as in F5–F13. The embedded lesson API was replaced with the canonical `integration/nova-v2-lesson-api.js`, and `nova-explore-policy.js` and `nova-speech-policy.js` are embedded.
2. **No new draw function, and no lessonScene.** F15 native draws are already value-driven: `(stage, state, options)`, where the state is a plain object such as `{a, b}`, `{theta}`, `{family, angle}` or `{L, W, H}` and the options carry the engines' own Challenge switches (`challenge:true`, `readout:false`, `level`, `step`). Lesson values therefore go through `scene` records naming the native draw.
   - **Correction found during F15:** the canonical API *merges* each scene argument over the native step-0 argument (`hydrate` copies the native object, then overwrites the keys the record gives). It does not replace it wholesale. Keys the record leaves out keep their native value. That matters in F15-12, where the native step 0 passes `timeline:true`, which makes the draw ignore the theorem and show the Watch sequence. The F15 records therefore set `timeline:false`, and every record sets every key its drawing reads. (The F13 documentation says "wholesale"; that wording is wrong. F13 records give full state objects, so its tested behaviour is not affected.)
3. **New `integration/nova-f15-contracts.js`:** finite numbers, plus per-engine checks taken from the engines' presets and Explore controls. Examples:
   - positive sides;
   - acute angles 1°–89° for right-triangle trig (F15-07/09);
   - angles 0°–360° (F15-08);
   - special-triangle family 3060 (30°/60°) or 4545 (45°) (F15-10);
   - radius 3–9 and separation 30°–180° (F15-11);
   - a known theorem with arc 30°–180° (F15-12);
   - a sine or cosine rule triangle whose angles total under 180° and whose sides obey the triangle inequality (F15-13);
   - cuboid edges 0–30 (F15-14).
4. **New `integration/nova-f15-runtime.js`**, derived from the F13 runtime: wrapping and replay of the adapter draws, `onRelayout` hooks, the narrow F0-12 layout, and layout-class redraw at 480/500/540/600/700/720/760/820/1024. F15-01/02 switch to their phone layout at `innerWidth <= 500` and the others at `<= 540`. There is no "Lesson values" preset wrapper.
   - **Answer hiding, numeric for F15.** F15 drawings and tables print computed values such as "c = 13", "0.500", "−1.000", "36.87°" or "?° 0.600". While a template question is unanswered, every number token *numerically equivalent* to the answer is replaced with "?" in stage text and in aria-labels and titles. A token with d decimals matches when |token − answer| ≤ ½·10⁻ᵈ. A more precise token matches when it equals the answer, or rounds to it for a rounded answer. Whole-number tokens match only whole-number answers, and U+2212 minus is read as a sign. Numbers the prompt gives are never hidden, and nothing is hidden if the answer itself is in the prompt.
   - **Layout repaint inside the Challenge game.** The F0-12 game moves the stage drawing into its own chart area. Before this fix, a resize repainted the stage behind the game, so at 390 the game kept showing the desktop drawing and a second copy was left underneath. The repaint now moves the new drawing into the game's chart area, as the game does. Every connected stage that shows a record is also repainted.
5. **F0 foundation:** the F13 glow-filter fix (objectBoundingBox → the core's `userSpaceOnUse` region) is kept in the patcher, but no F15 engine has such a filter (0 matches), so nothing changed there.
6. **Phone typography (sized for the 390 template frame; the 420/440-unit phone viewBox is drawn about 258 px wide):**
   - **F15-07:** the chalk-text helper lifts labels of 14 characters or fewer (table values, angle ticks, headings) to 19 units (about 11.7 px) and longer captions to 14 units, on the phone layout only.
   - **F15-14** (`tools/f15/edits/F15-14.py`): the Challenge card's second line and the two working-panel lines go from 16–18 to 19 units on the phone layout.
   - The other F15 engines already met the 390 bar.
   - Side-by-side checks at 390 showed no new overlaps.
