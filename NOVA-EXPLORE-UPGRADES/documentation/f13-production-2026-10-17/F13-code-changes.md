# F13 code changes (2026-10-17)

All 14 engines (F13-01..F13-14) were rebuilt from the supplied originals (`F13-originals.zip`) by `tools/f13/patch_f13.py`. No drawings, fonts, colours, mascots, maths or desktop layouts were replaced.

1. **Embedded core v1.4 JS updated to the current F3 core**, the same as in F5/F7/F9/F11. The embedded lesson API was replaced with the canonical `integration/nova-v2-lesson-api.js`, and `nova-explore-policy.js` and `nova-speech-policy.js` are embedded.
2. **No new draw function, and no lessonScene.** F13 native draws are already value-driven: each takes `(stage, state, message, pose, …)`, where the state is a plain object such as `{shape, l, w, ht}`, `{r, ht}` or `{grid}`. Lesson values therefore go through `scene` records naming the native draw. Scene arguments are merged over the native defaults: the lesson API copies the native argument and overlays the question values key by key (nested objects merge the same way), so a record only needs the keys it changes; `F13-template-integration.md` lists the keys.
3. **New `integration/nova-f13-contracts.js`:** finite numbers, plus per-engine checks against the engines' own tables and Explore control ranges. Examples:
   - known solids, nets and presets;
   - 4 × 4 unit-cube grids with heights 0–4 (F13-03..05);
   - whole l, w, h 1–6 (F13-07);
   - r 1–4 and h 1–6 (F13-08);
   - base and height 2–8 (F13-09);
   - r 2–8 (F13-10);
   - plane position −1..1 (F13-11);
   - fill 0–1 (F13-12);
   - scale factor 0.5–3 (F13-14).
4. **New `integration/nova-f13-runtime.js`**, derived from the F11 runtime: wrapping and replay of the adapter draws, `onRelayout` hooks, the narrow F0-12 layout, and layout-class redraw at 480/**580**/600/700/720/760/820/1024. The 580 breakpoint was added because the F13 engines switch to their phone layout at `innerWidth <= 580`. There is no "Lesson values" preset wrapper.
   - **Answer hiding, extended for F13.** F13 drawings print their own computed results, such as "30 units³", "16π units²", "350 mL", or a strip tile. While a template question is unanswered, any whole-number token equal to the answer is replaced with "?" in stage text and in aria-labels/titles, unless the prompt itself gives that number. This applies to both SVG and HTML text. The working, for example "5 × 3 × 2" or "4π × 4", stays visible.
   - **Live tile formatting.** Several engines update a neon strip tile with `textContent` after a control change. That left a stale `aria-label` (screen readers heard the old value) and plainer formatting than a full render. The runtime now re-renders such tiles with the core formatter (`NOVA.mt.render`).
5. **F0 foundation (F13-07..F13-12):** engine-local glow filters used objectBoundingBox percentages. They now use the core's `userSpaceOnUse` region (−400/1600), which keeps the look.
6. **Live caption (F13-06..F13-14):** a control change redrew only the SVG, so the stage caption kept the values of the last full render. For example, "CUBOID 4 × 3 × 2" stayed after the length slider moved to 5. Each refresh now rewrites the caption from the live state.
7. **Per-engine fixes (`tools/f13/edits/`):**
   - **F13-03:** the drawing's accessible name and title now follow the live cube count.
   - **F13-06:** at 390 the Explore cross-section select pushed the page 24 px wide. It is now capped at the row width.
   - **F13-09:** every refresh appended another clipPath to `<defs>`, an unbounded leak. The old copy is now replaced.
   - **F13-10:** the "area ÷ π" strip tile showed "16π" after a live update, though a full render shows 16. The live update now matches the full render. Display only; the maths is unchanged.
   - **F13-14 Challenge:** the first render showed the masked k² and k³ factors in the strip. It now honours `masked`.
8. **Phone typography (frame ≤ 580 px, sized for the 390 template frame).** The 420-unit phone viewBox is drawn about 258 px wide, so one unit is about 0.61 px.
   - Engine chalk-text helpers lift labels of 14 characters or fewer (values, units, axis names, card headings) to 19 units (about 11.7 px), and longer captions or formula lines to 14 units (about 8.6 px).
   - F13-03/04 call the core chalk text directly, so their axis names and level numbers get phone sizes by explicit edits.
   - Side-by-side checks against the originals at 390 showed no new overlaps. The overlaps that remain, such as F13-06 "SLICE" over the prism edge, are present in the original art and were left alone.
