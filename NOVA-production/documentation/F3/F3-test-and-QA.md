# F3 executed QA

Installed Microsoft Edge through Playwright on Windows, using actual native source documents and the approved local template with the original automatic F0-12 controller.

- 345/345 template assertions: 23 per component. Distinct rendered mathematical givens, duplicated original scenes/scoped IDs, Explore, six-question retry/lives/hint/streak/score/reset/confetti/badge, four Guided selections, four Bob beats, no runtime errors, and 1440/1024/390 page/frame containment.
- 56/56 targeted maths assertions, including full mathematical sweeps of supported factor targets, ladder targets 2–420, signed bracket constants, sign combinations in the 12×12 table, exact surds 2–200, and sampled HCF/LCM/divisibility ranges. These are mathematical-function checks plus selected rendered cases, not screenshots of every numerical combination.
- 60/60 independent-instance assertions: different starts, edits isolated in both directions, and exact lesson reset for each source.
- 60/60 native teaching-motion assertions: preview, host-clock completion, paused maths and settled cancellation for each component.
- 15 Explore axe runs with zero automated WCAG A/AA violations, keyboard mode switching, focused control restriction and reduced motion. Incomplete axe items are retained for human review; human screen-reader certification is not claimed.
- 9/9 mobile-emulated touch assertions on F3-03, F3-11 and F3-14: native card/marker/crosshair drag changes maths, releases capture and fits the frame.
- 6/6 Guided checks on F3-09, using real speech, native stages, future-result concealment and reset.
- 4/4 Bob real speech checks on F3-09: actual start/boundary/end, pause/resume and stop.
- 4/4 actual Learn Watch playback checks on F3-09: pause, resume, initial-stage reset and mode-change cancellation. The separate clock test covers all fifteen native phase sequences.
- Loss/hint/reset boundaries passed for all fifteen game wrappers; an eight-question F3-09 game also completed with the canonical score.
- All 94 original native stages mounted. 86 retain identical extracted text and SVG counts; eight intentional differences are six HCF/LCM accessible titles and two square/cube partial-build/readout corrections. This is not a pixel-diff certification of every frame. Native source/CSS identity and screenshots provide additional evidence.

A–I coverage: original baseline/regression; alternative numerical contexts; custom Watch/phase sequences; focused Explore; distinct unanswered question states; sequential Guided; duplicate/independently edited apparatus; actual template mounting. Each component has its own 18-check table and decision in the individual audit.

Mobile screenshots were reviewed in a contact sheet and representative full-size images. Touch is browser emulation, not a physical-device lab. All mixed-family combinations, every installed voice and every future question are not certified. Future lesson builds still require their own end-to-end question/answer/navigation/teaching/layout test.

Reproduce: npm ci in integration/ with Microsoft Edge installed, then node integration/qa/test-f3-production.cjs and the supplied audit test-*.cjs scripts. NOVA_ONLY_IDS and NOVA_REPORT_SHARD support separate test outputs. capture-current.cjs preserves the original baseline. Original backup, raw logs, runnable fixtures and final-source-hashes.json are included; package-integrity.json verifies the released ZIP separately.

Mixed-family evidence: six checks passed with the native F3-01 array and F2-07 multiplication grid, including separate engines, matching initial product, isolated edits, isolated reset and mobile stacking. F2-07 is included in the ZIP for reproducing this example; its source was not changed.

Apparatus screenshots hide parent fixed/sticky navigation bars only for capture, to keep the complete question visible. Actual template-flow and page-width checks ran with the normal navigation present.
