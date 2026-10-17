# NOVA V2 native lesson integration — v1

The approved lesson shell, neon drawings, chalk fonts, original renderer functions, shared core and mascot artwork remain authoritative. Lesson production edits lesson JSON, supported mathematical parameters and teaching text. It must not recreate or replace a renderer.

## Authoritative files

- `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html` — approved shell with repaired integration.
- `integration/component-adapters.json` — catalogue document paths, source identities, available native tables/models/drawing argument names, actual runtime engine IDs and test coverage.
- `integration/nova-v2-lesson-api.js` — the versioned implementation embedded in every executable component document and companion source.
- `lessons/Y7-003-Comparing-and-Ordering-Numbers.html` — end-to-end integration reference.

Use the canonical executable HTML named by the registry. Do not extract components from a gallery, use an older downloaded file, assume that a catalogue ID is its runtime engine ID, or inject new source hooks during lesson assembly. Some catalogue documents are integrated views of another engine. F0-01 through F0-08 are mountable foundation demos with declared native lesson hooks; use their documented mathematical purpose.

## Component API

Every mounted executable exposes `window.NovaLessonComponent` and `def.lesson`. `describe()` returns the actual native step table, configuration, mutable mathematical model, named native tables and supported original drawing arguments. `validate(record)` rejects unknown top-level native state fields, unknown models/tables and unsupported scene argument names. `configure(values)` applies partial changes to actual native configuration. `render(record, stage, animate)` calls the original renderer. `cancel()` releases tracked motion and native dragging; `dispose()` ends the instance.

A record selects an existing `nativeIndex` and supplies `data` in that step's actual schema. For example, the F2-01 chart uses `{v:"6.52",o:{tray:false,intro:false}}`. F1-07 uses `{st:{min:5,max:6,labelStep:0.1,cards:[5.09,5.19,5.9]},n:3,chips:[]}`. These schemas are different deliberately. A generic `v` or `n` must not be sent to an engine that does not read it.

Where a renderer resets from its own model or native story table, use the registry's exact `models`, `tables` or `scene:{function,arguments}` interface. `scene` passes mathematical data to the existing named drawing function; it does not supply replacement SVG, CSS, paths or a renderer. The F3-04 factor target additionally supports `parameters:{n:...}` for integers 2–36. Never invent a field or assume a default-state mounting test verifies an untested parameter.

The template supports `views:[nativeDataA,nativeDataB]` when a teaching comparison needs two instances of the same approved representation. It renders the existing native chart twice and retains one original mascot dock. It does not invent a comparison chart or redraw an apparatus.

## Lesson ownership and timing

Bob, Watch, Examples and assessment captures receive their own explicit record data. Reusing a source does not imply reusing the first concept's numbers. Native rendering tables are preserved separately from lesson narration. Frozen published configuration roots are thawed before native closures capture them; mutable preset aliases are preserved. Per-record changes are restored before the next record or Explore state.

The clock supports both original top-level `NOVA.tween(ms, frame, done)` and `NOVA.motion.tween(ms, frame, ease, done)`. It tracks virtual RAF work, delays, tween completion and cancellation. Bob's existing speech/read timing and the native action completion must both finish before advancing. Examples retain speech-duration overrides and 5–8 second fallback reading time; Watch uses the established 5–6 second dwell. Changing these interfaces does not require changing the approved layout.

## Explore and questions

Explore presets must use the original component's native schema. `nativeConfig` supplies one complete native preset. String presets are supported only by the explicitly mapped place-value, number-expander and Gattegno adapters.

Challenge retains the original F0-12 appearance and scoring, wrong-answer hold, correct-answer automatic advance, confetti and badge. Accepted marking types are numeric/fraction equivalence, mathematical choices/relations, ordered lists and coordinates. Do not encode comparison symbols as arbitrary numbers or weaken an ordering task to smallest/largest because of the checker. Question and answer states are separate: a completed Watch comparison or sorted card arrangement can reveal an independent answer.

Static aids must be produced from the actual approved representation before final delivery. Supply `imageDataURL` on assessment jobs and materialise `visualHtml`; a pending runtime capture job or text fallback is not a finished image. Capture complete SVG/HTML layers, not merely the first SVG.

## Required production checks

1. Read `describe()` or the recorded native descriptor and choose an actual supported state/action.
2. Connect every written/spoken numerical value to its native fields, model, table or drawing arguments.
3. Render every Bob beat, Watch state, Explore preset, Guided step and unanswered Challenge through this exact template.
4. Assert that the visual contains the intended values and does not reveal independent answers. Optional `assertions:{contains:[],excludes:[]}` makes explicit visible-text checks executable.
5. Check mathematical keys independently, including ties, zero placeholders, ordering direction, equivalent fractions and units.
6. Verify correct auto-advance, wrong hold, reset, navigation during animation, actual fit and keyboard/pointer interactions.
7. Deliver finished static images, no placeholders/internal notes, no page errors, and matching source/template/API versions.

A passing representative value-change test proves that recorded binding only. It is not proof of every possible state, boundary, gesture, screen reader, voice or mathematical question. Preserve the test's scope and run lesson-specific semantic checks on every new payload.

## Explore bindings and native table controls

`production.exploreBindings[conceptIndex]` supports `{variables,models,tables}`. Call `describe()` for the actual `exploreFields` keys. A variable accepts `{value:...}`; a native state-factory variable can instead accept `{factoryArgs:[...]}`. Values are installed before the original controls render, then the pupil uses the original interactions. Table/model overrides must retain native mathematical schemas. Limit the visible native preset choices through `componentConfigs`; retain dictionary entries referenced by the native renderer.

Native step names are semantic renderer keys and cannot be rewritten as Bob headings. Store teaching text in the lesson record. F1-01 accepts `data.o.unanswered:true` for a neutral comparison. F1-07 accepts `data.st.labels` matching the numerical cards, preserving labels such as 3.50. Use `data.n:0` for an unplotted question state, and supply the unsorted given cards in the approved question area. F9-03 reads its mapping coefficients from the selected native preset; its original table and geometry are retained. Function-machine families expose their native lesson/preset tables and active models. Never replace operation functions with lesson data.

## Commands and evidence

From `bank-v3-neon-chalk/integration`, run `npm install` and `npx playwright install chromium`. Run `node validate-lesson.cjs ../lessons/LESSON.html --browser`. This checks that the shell outside the three JSON insertion blocks is unchanged, original embedded source hashes match the registry, question states carry explicit visual expectations, and each planned record renders the expected values. Supply independent expectations from the written plan rather than generating expectations from the renderer output.

For the bank regression, run `NOVA_SHARD=0 node qa/test-components.cjs`, then shards 1 and 2 (or run them in separate processes). Results are written to the current working directory. Set `NOVA_ONLY_IDS=F2-01,F1-07` for targeted rechecks. The checked-in QA evidence records this release's integration coverage; it does not certify arbitrary future lesson data or every possible parameter combination. New lessons must pass their own visual and mathematical checks. Existing fast-drag implementation and chalk styling are preserved.

## Native F0-12 wrapper and mascot placement

The template embeds `integration/nova-f0-12-game-wrapper.js`, extracted directly from the original F0-12 executable. Call its native `hud`, `qcard`, `pts` and `results` renderers; do not recreate the HUD or substitute a Retries cell for the original Lives display. Lesson questions still supply their own text, typed marking and neutral original visuals. Preserve correct auto-advance, wrong hold and the approved celebration.

For multiple native chart views, retain one original mascot dock and append it directly to the native `.nova-stage` after the chart views. Its original right-alignment and responsive sizing depend on that direct parent. Do not leave the dock nested inside an individual view, move it left, or redraw/resize the mascot.


## F0 completion R2

F0 Explore policies, native phase motion, isolated interactive instances, Guided narration and automatic original F0-12 integration are documented in `audit/f0-completion-2026-10-16/F0-template-integration.md`. The R2 manifest and executed evidence supersede initial F0 readiness notes. Other families retain their existing audit scope.


## F1 production audit — 16 October 2026

F1 records, native motion endpoints, unanswered flags, focused controls and numerical limits are documented in `audit/f1-production-2026-10-16/F1-template-integration.md`. This extends the original apparatus and automatically uses the canonical original F0-12 wrapper. F1-01 now uses the settled NOVA stacked fraction notation.


### F1 fraction notation correction

Fraction notation was already settled by the current production master. F1-01 now reuses F5-04 stacked chalk/neon fractions with `notation:"fraction"`, integer `n`, denominator `d` from 1–12 and whole-number bounds. The obsolete TBD wording is not an active approval restriction. See `audit/f1-fraction-correction-2026-10-16/F1-fraction-correction.md`.
