# F2 executed QA

Browser: installed Microsoft Edge through Playwright on Windows. Actual approved local lesson template and original native component HTML were used, including the automatic original F0-12 challenge wrapper.

- 345/345 lesson assertions: 23 per component. Two distinct unanswered maths states, duplicated native views/scoped IDs, Explore, six-question wrong/retry/score/hint/reset/confetti/badge, four Guided selections, four Bob beats, no runtime errors, and page/frame containment at 1440/1024/390.
- 52/52 targeted maths assertions: weighted regrouping, decimal/whole block scales, focused place identities, carry/borrow chains, decimal products and division, native numerical rejection, standard-form significands, powers and stacked fractional index, bracket/power/left-to-right expression evaluation, signed-pair cancellation, bonds, hundred-square boundaries, binary carry and exact set classification.
- 60/60 independent-instance assertions: two lesson-configured starts, independent edits in both directions and exact reset for each of the 15 components.
- 60/60 native-action assertions: static preview, actual host-clock completion, paused maths and cancellation for each component.
- 15/15 Explore accessibility runs: zero automated axe WCAG A/AA violations, keyboard mode switching, reduced motion and focused-control restriction. Axe incomplete items remain documented for human review; no full screen-reader certification is claimed.
- 9/9 mobile-emulated touch assertions on F2-08/09/10: continuous touch across SVG redraw, release and native width containment.
- 6/6 Guided narration/preview/progression/reset/future-result assertions on F2-08, with real browser speech events.
- 4/4 Bob real speech coordination assertions on F2-08, with start/boundary/end, pause/resume and stop.
- All 15 challenge loss/hint/reset boundaries passed; an eight-question F2-09 game also completed with canonical score.
- All 84 original native stages mounted. 77 preserve exact extracted text and SVG counts. Seven intentional changes are the corrected F2-10 fractional-index stage and six F2-13 accessible unknown-partner titles. This text/SVG-count regression is not a pixel-diff certification of every animation frame. Native CSS/source identity and screenshots provide additional evidence.

Mobile screenshots were visually reviewed as a contact sheet and representative full-size images. Touch uses browser emulation, not a physical-device lab. Responsive tests check containment; dense apparatus still uses the original scaled native drawings. Layout/content checks remain necessary for future lessons, especially high card counts or many simultaneous apparatus frames.

A–I scenario coverage per component: A/I original 84-stage baseline and CSS identity; B alternative exact values; C four Watch records and custom native action; D focused restriction and independent configured Explore; E two distinct unanswered states plus six question keys; F four Guided states; G two scenes plus independent edited frames; H approved template mounting. Detailed scope is recorded in each component's 18-check table. No mathematically irrelevant scenario is used to conceal an unperformed check.

Reproduce with npm ci in integration/, Microsoft Edge installed, then node integration/qa/test-f2-production.cjs and the audit test-*.cjs scripts. test-f2-production.cjs accepts NOVA_ONLY_IDS and NOVA_REPORT_SHARD for separate outputs. capture-current.cjs does not overwrite the original baseline. Test sources and raw JSON logs are included. final-source-hashes.json and package-integrity.json tie evidence and package bytes to this release.
