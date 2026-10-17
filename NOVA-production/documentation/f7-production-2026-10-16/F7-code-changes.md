# F7 code changes (2026-10-16)

All 14 engines (F7-01..F7-14) were rebuilt from the supplied originals (`F7-originals.zip`) by `tools/f7/patch_f7.py`. The pack's `F7-gallery.html` is unchanged and not shipped. No drawings, fonts, colours, mascots or layouts were replaced.

1. **Embedded core v1.4 JS updated to the current F3 core** (taken from the approved F3-01). It fixes Watch resume after a scrub, pause stopping the in-flight tween, `dragSnap` snapping from `min` plus grouping, and Bob speech through `NovaSpeechPolicy`.
2. **Embedded lesson API replaced with the canonical `integration/nova-v2-lesson-api.js`.** This adds scope validation, Explore control policy and action cancellation.
3. **Embedded `nova-explore-policy.js` and `nova-speech-policy.js`.**
4. **New `integration/nova-f7-contracts.js`.** It rejects invalid lesson records before drawing: non-finite numbers, non-integer coefficients and tile counts, and bad tile type or sign. It also enforces each engine's native limits:
   - F7-06: k≤4, a≤3, b≤4, at most 18 tiles.
   - F7-07: n 2–4, 0≤c≤n².
   - F7-13: b 1–5, demo > b+1.
5. **New `integration/nova-f7-runtime.js`:**
   - **Challenge concealment** while the F0-12 controller shows an unanswered question. It masks the private answer where it appears as a standalone label, a matching stacked fraction, a title/aria-label, or an "= answer" readout. Result colour alone is not treated as an answer, because green is the positive-tile colour in F7.
   - **Layout-class redraw:** when the frame crosses 480/600/700/720/820/1024px, a debounced handler (resize event + ResizeObserver, 180 ms) redraws the current lesson record into its stage. Any F0-12 game host inside the stage is kept, so score, question and lives survive. Native Watch/Guided redraw the current step. Native Explore/Challenge keep the pupil's state: every stage draw function named in the adapter's `draws` is wrapped (`NovaF7Runtime.wrapDraw`, outermost calls only), the latest call of each is remembered with its live arguments, and a layout redraw replays those calls in their original order. The panel (inputs, selections, progress, feedback) is never rebuilt, and an in-progress drag is cancelled first. The runtime emits `value:statePreservedRedraw`. A full re-mount is used only if no draw call was recorded.
   - **Phone layouts (tools/f7/narrow/F7-XX.py, applied by patch_f7.py as exact replacements):**
     - F7-02: a new 620-unit phone board with 5 tiles per row, taller lanes, stacked add/remove trays and phone-sized chalk.
     - F7-04/F7-05: the existing 585-unit phone crop now uses phone-sized chalk (×1.42) and bigger card text; long notes wrap onto two lines, and the challenge footer is shortened and moved below the cards.
     - F7-06: taller tray chips, so the miniature tile labels stay readable.
     - F7-11: the bar board is cropped to its 810-unit working area, with chalk ×1.14 capped to fit the width.
     - The desktop drawings, mathematics, style and mascots are unchanged.
   - Narrow F0-12 card layout and accessible grouping, the same as the F5 runtime.

**Revision 2026-10-17:** the reserved `presets.lesson` configuration wrapper was removed from `nova-f7-runtime.js`. It had added a stray "Lesson values" button to the Explore preset lists. No lesson record used it, because lesson values go through `scene` records. All 14 engines were rebuilt with `tools/f7/patch_f7.py`.
