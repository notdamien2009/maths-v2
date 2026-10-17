# F9 code changes (2026-10-17)

All 13 engines (F9-01..F9-13) were rebuilt from the supplied originals (`F9-originals.zip`) by `tools/f9/patch_f9.py`. No drawings, fonts, colours, mascots, maths or desktop layouts were replaced.

1. **Embedded core v1.4 JS updated to the current F3 core**, the same as F5/F7.
2. **Embedded lesson API replaced with the canonical `integration/nova-v2-lesson-api.js`**, plus the embedded `nova-explore-policy.js` and `nova-speech-policy.js`.
3. **New value-driven draw `lessonScene(stage,p)` in every engine** (`tools/f9/lesson/F9-XX.js`). F9 native draw functions take DOM/SVG arguments that a lesson record cannot carry, so each engine gets a small draw that renders a question from plain numbers in the engine's own helpers and style. The answer is never drawn. `def.render` checks `scene.function==='lessonScene'` first, and `lessonScene` is listed in the adapter `draws`.
4. **New `integration/nova-f9-contracts.js`.** It rejects non-finite numbers and enforces per-engine ranges for `p`. Examples: F9-02 arithmetic step ≠ 0 or geometric ratio 2–5; F9-06 r ∈ {2,3,4,0.5}; F9-10 3/5/7 rows for a hidden centre; F9-13 n 0–2 with ask > n.
5. **New `integration/nova-f9-runtime.js`**, derived from the F7 runtime:
   - Challenge concealment, the narrow F0-12 card layout and layout-class redraw. The breakpoints are 480/600/700/720/760/820/1024; 760 was added because F9 engines switch to their phone layout at ≤760.
   - Pupil state across a resize: it wraps the adapter `draws` plus each engine's state-rebuilding roots (for example renderExplore/drawChallenge) and replays the latest calls. It emits `value:statePreservedRedraw`.
   - The reserved `presets.lesson` wrapper from F7 was **removed**, because it added a stray "Lesson values" button to Explore preset lists.
6. **Phone typography:** in the phone layout, each engine's own text helpers get a minimum size of 19 units (≈11.4 CSS px at the 390 template scale). It is applied by patch_f9.py.
   - Per-engine edits (`tools/f9/edits/`):
     - F9-02: larger value rings, and the hop rule pill drawn at size 20.
     - F9-03: the explore draw is wrapped before its listeners are attached.
     - F9-04: the plot tick labels are raised to 19 units in this engine only.
     - F9-06: the hop rule pill is drawn at size 20.
   - The core is untouched.
