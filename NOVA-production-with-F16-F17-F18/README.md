# NOVA production pack with F16, F17 and F18 added

Extract the whole ZIP, then double-click START-HERE.html and choose a test lesson. Use Microsoft Edge for the tested browser. Each lesson is a self-contained HTML file; no server or npm installation is needed to use it.

## Families in this pack

Included: the supplied F0–F11, F13 and F15, plus the newly upgraded F16–F18. **Pending: F12 and F14**, which were not included as completed families in the supplied archive. F6-08 is now hosted by F10-05 (challengeReady). F6-12 remains a config-only gallery reference; its canonical host F18-02 is now available with currency presets. F6-13 remains pending its F14-11 host. See MERGE-NOTES.md for this merge.

## Contents

- F0: 17 foundation files, including the original F0-12 game wrapper.
- F1: 10 canonical component files; supported aliases stay inside their original components.
- F2: 15 canonical component files.
- F3: 15 canonical component files.
- 00-master: the approved lesson shell with the shared feedback cleanup described below, plus the master production release.
- core and integration: the supplied runtime and registry, extended with the 41 new components; pending-family rows remain identified separately.
- documentation: family audits, integration guides, numerical limits, configuration examples and historical test evidence.
- test-lessons: three random-number versions of one coherent lesson connecting number-line distance, grid multiplication and equal groups. Each uses F1-01, F2-07 and F3-01 together, with automatic F0-12 challenges. There are 18 challenge questions and 30 assessment questions per lesson. Answer keys and current test evidence are included.

## Test it yourself

1. Open START-HERE.html, then lesson 16317.
2. Start → Learn with Bob. Change slides and concepts; Continue to Learn opens all three apparatus.
3. Use Watch, then Explore. Change F1's value, F2's two factors and F3's rows/columns. Edits should remain independent.
4. Challenge: give a wrong answer, use a hint, finish the six rounds, collect the sticker and select New game. Check score, lives and clean feedback.
5. Examples contains three sets of four configured examples. Practice and Exit test lesson marking. Written explanations require review; they are not given a false automatic mastery score.
6. Repeat with either other seed. Resize the browser or use a phone-sized viewport.

## Produce a new lesson

Use 00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html, not an older exported lesson. Follow documentation/F1/F1-template-integration.md and the corresponding F2/F3 guides. Supply novaLessonData, novaProductionData and novaV2Sources; use the exact native source IDs and per-component schemas. Each concept's Learn, Watch, Challenge, Guided and Bob source must agree. The shell requires exactly 5 Start, 15 Practice and 10 Exit questions with its existing slot types/checking rules; concept and example counts can vary. Give every lesson a unique meta.curriculumCode so saved answers cannot collide.

The template automatically supplies F0-12 to hosted challenges. Do not add another wrapper to the same challenge. Editing a source file does not update previously generated self-contained lessons: rebuild them.

For another reproducible version of this sample lesson, install Python and run `python tools/build-random-lessons.py 12345` from this folder. It writes Random-lesson-12345.html and its challenge answer key under test-lessons. This generator illustrates three components; consult the individual manifests for other apparatus. New seed outputs need their own test before release.

## Shared controller correction in this release

Mixed-lesson visual review found stale red feedback remained after New game. The canonical challenge controller and its embedded copy in the template now clear that feedback when drawing a fresh round. The original component files and drawings are unchanged. Historical family audit template hashes describe the earlier template; source-hashes.json and the combined test reports describe this release.

## Reproduce the automated checks

Install Node.js and Microsoft Edge. Run `npm ci --prefix integration`, then `node tools/test-combined.cjs`, `node tools/test-combined-assessment.cjs` and `node tools/test-combined-editing.cjs`. Tests use real Edge through Playwright and load the self-contained lesson files directly from disk. The mouse test scrolls controls below the sticky header before clicking. Test reports are written into test-lessons.

These tests cover the three named apparatus together and the supplied random values. Earlier family audits cover each component individually. This does not certify every possible combination, voice, physical device or future authored question. Check each finished lesson end to end before using it with pupils. Existing speech safeguards remain in place.

- **F4: Bar models** (F4-01…F4-12; F4-10 is a preset of F4-08, and F4-05 is the F5-11 bar preset). Lesson-controlled through `data.lesson`, with the canonical F0-12 Challenge built in. Status: PASS WITH LIMITATIONS; all 12 are `challengeReady`. See `documentation/F4-START-HERE.md`.


## F5 — Fractions, decimals and percentages (production audit 2026-10-16)
18 engines in `F5/` (F5-01..07, F5-09..19; F5-08 is the F5-03 `multiply` preset). They were brought up to the current core and canonical lesson API, with F5 contracts and runtime (`integration/nova-f5-*.js`), lesson-owned values in Guided/Watch for F5-11 and F5-13..17, and Challenge answer concealment. Status: PASS WITH LIMITATIONS, challengeReady true for all 18. Docs are in `documentation/f5-production-2026-10-16/`.

## F6 (ratio and proportion), revision 2026-10-17
- Upgraded with lesson data, F0-12 Challenge, contracts, resize-safe relayout and phone-label floor: F6-01…07, 09, 10, 11, 14 (challengeReady true).
- Presets only, delivered unchanged: F6-08 (hosted by F10-05 since the F10 merge, challengeReady true, host test 22/22), F6-12 (F18-02) and F6-13 (F14-11), still challengeReady false until their host engines are built.
- Docs: documentation/f6-production-2026-10-17/START-HERE.md · Adapter rows: integration/F6-adapter-rows.json · Test lessons: test-lessons/f6/

## F7 Algebra (production upgrade 2026-10-16/17)
14 engines in F7/, all PASS WITH LIMITATIONS and all with challengeReady true. Phone layouts meet the 390 label checks. Pupil state is kept across a resize in Explore/Challenge. See documentation/f7-production-2026-10-16/START-HERE.md. Adapter rows are in integration/F7-adapter-rows.json and are merged into integration/component-adapters.json. Revised 2026-10-17: the stray "Lesson values" Explore preset button was removed.

## F8 (algebra), revision 2026-10-17
- All 18 engines (F8-01 to F8-18) have been upgraded with lesson data (`state.preset` plus overrides), the F0-12 Challenge, contracts, resize-safe relayout and the phone-label floor. challengeReady is true for 18 of 18.
- F8-02 and F8-04 run the F8-03 engine (`NovaLessonComponent.id` F8-03).
- Docs: documentation/f8-production-2026-10-17/START-HERE.md · Adapter rows: integration/F8-adapter-rows.json (merged into integration/component-adapters.json) · Test lessons: test-lessons/f8/

## F9 Sequences (production upgrade 2026-10-17)
13 engines in F9/, all PASS WITH LIMITATIONS and all with challengeReady true. Phone layouts meet the 390 label checks. Pupil state is kept across a resize in Explore/Challenge. See documentation/f9-production-2026-10-17/START-HERE.md. Adapter rows are in integration/F9-adapter-rows.json and are merged into integration/component-adapters.json.

## F10 (graphs and coordinates), revision 2026-10-17
- All 20 engines (F10-01 to F10-20) have been upgraded with lesson data (`state.preset` plus overrides), the F0-12 Challenge, contracts, resize-safe relayout and the phone-label floor. challengeReady is true for 20 of 20.
- F6-08 is hosted by F10-05 (row patch `integration/F6-08-adapter-row.F10.json`, challengeReady true).
- Docs: documentation/f10-production-2026-10-17/START-HERE.md · Adapter rows: integration/F10-adapter-rows.json (merged into integration/component-adapters.json) · Test lessons: test-lessons/f10/

## F11 Angles and constructions (production upgrade 2026-10-17)
11 engines in F11/, all PASS WITH LIMITATIONS and all with challengeReady true. They use the native value-driven draws. Phone layouts meet the 390 label checks. Pupil state is kept across a resize in Explore/Challenge, and controls keep working afterwards. See documentation/f11-production-2026-10-17/START-HERE.md. Adapter rows are in integration/F11-adapter-rows.json and are merged into integration/component-adapters.json.

## F13 3D shapes, volume and surface area (production upgrade 2026-10-17)
14 engines in F13/, all PASS WITH LIMITATIONS and all with challengeReady true. They use the native value-driven draws with lesson values merged over the native defaults, and the runtime hides answer readouts. Phone layouts meet the 390 label checks (F13-02's question drawing has no SVG text). Pupil state is kept across a resize in Explore/Challenge, and controls keep working afterwards. See documentation/f13-production-2026-10-17/START-HERE.md. Adapter rows are in integration/F13-adapter-rows.json and are merged into integration/component-adapters.json.

## F15 Pythagoras, trigonometry and circles (production upgrade 2026-10-17)
11 engines in F15/ (F15-01, 02, 06–14), all PASS WITH LIMITATIONS and all with challengeReady true.
- They use the native value-driven draws with each engine's own Challenge options.
- The runtime hides every number numerically equivalent to the answer.
- Phone layouts meet the 390 label checks; F15-11's question drawing has no SVG text, so its check is n/a.
- The Challenge game's drawing is repainted in the phone layout on resize.
- Pupil state is kept across a resize in Explore and Challenge.

See documentation/f15-production-2026-10-17/START-HERE.md. Adapter rows are in integration/F15-adapter-rows.json and are merged into integration/component-adapters.json.

## Merge of F6, F7, F9 and F11 (2026-10-17)
See MERGE-NOTES.md. The adapter rows are merged into integration/component-adapters.json.

## Merge of F8 (2026-10-17)
F8 added; F6 adapter rows re-applied in normalized form. See MERGE-NOTES.md.

## Merge of F10, F13 and F15 (2026-10-17)
F10, F13 and F15 added; the F6-08 row now points at its F10-05 host. See MERGE-NOTES.md.


## F16–F18 update, 17 October 2026

41 additional components: F16 (16), F17 (14), F18 (11). Open `test-lessons/f16-f18/Class-trip-F16-F17-F18.html` for the combined template test, or any individual test lesson in that folder. Read `documentation/f16-f18-production-2026-10-17/LESSON-PRODUCTION-GUIDE.md` and the release summary before creating new lessons.

The example banks contain six cases per component for verification. New numbers, event rules and narration still require lesson-specific validation.
