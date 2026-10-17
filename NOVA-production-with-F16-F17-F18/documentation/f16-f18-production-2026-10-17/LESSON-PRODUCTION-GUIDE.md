# F16–F18 lesson production guide

Use the canonical F16/F17/F18 HTML sources and the supplied approved master template. Each source is self-contained. Microsoft Edge is the tested browser. Original native drawings, chalk typography and neon primitives remain in use.

## Start here

Open `test-lessons/f16-f18/Class-trip-F16-F17-F18.html` for the combined example. Every component also has its own `Fxx-xx-test-lesson.html` in the same directory. The combined example keeps the approved 5 diagnostic, 15 practice and 10 exit slots, uses three independent apparatus and has 18 example challenge questions. Assessment images were captured from the original component renderers.

## Edit a lesson

1. Select a canonical source using the capability manifest. Read that component's numerical limits.
2. Copy a tested record from its family configuration examples. Set the scene function and arguments exactly as declared in `draws`. Change data and any matching configuration together. Do not edit private fields beginning with `_` or replace native JavaScript predicates with JSON.
3. Recalculate the answer independently. Update the prompt, units, captions, native context, narration, feedback and hints to match. Strings do not automatically rewrite themselves when numbers change.
4. Use the same native scene records for Watch, Guided and Bob; turn on the appropriate reveal options for teaching. Challenge records keep computed answers concealed while retaining necessary givens. Do not mark an input as an answer simply because its number happens to equal the key.
5. Configure Explore through `componentConfigs` and `exploreBindings` for each concept. Exposed variables are listed per component. Supply arrays for native Sets and arrays of entries for Maps; the API hydrates their native types. Start with a concept question, a prediction and a relationship to investigate. Keep the native controls and drawing language.
6. Validate and play the generated lesson in the template. Test wrong answer, hint, correct answer, end-of-game, reset, responsive resize, independent controls, teaching and all assessment aids. A completed component audit does not validate arbitrary new lesson content.

The included six-question banks per component are QA examples. They are not the separate requested 38-question production banks or a random 6–8 sampler. That prompt-pack upgrade was not part of this F16–F18 component completion.

## Important native boundaries

F16 has sixteen components, F17 fourteen and F18 eleven. There is deliberately no separate F18-09 file: currency exchange is housed in F18-02 (euro/dollar presets), as in the original bank. For currency lessons use F18-02 directly with a stated illustrative rate. The older F6-12 gallery remains a preset reference; it has not been silently promoted to a new engine.

F17 event predicates remain original native functions. Use a compatible native preset when changing outcome labels; changing display text alone does not redefine the mathematical event. F17-13 Explore assumes a £1 stake. Statistics use the documented native quartile convention. Interest rounds to pence annually. Money/payroll/currency scenarios are classroom examples with supplied rules, not live financial or payroll guidance.

The decimal-digit-4 speech restriction is preserved. Decimal numerals containing digit 4 require pronunciation verification before speech; captions remain available. The audit tests policy logic and reduced-motion rendering, not every installed voice or every narration by ear. Automated accessibility scans do not replace a screen-reader review or testing every physical device.

## Verification and reruns

See `release-summary.json`, the three individual audit files and their capability manifests. Raw current evidence: `audit/f16-f18-production-2026-10-17/release-browser.json`. Earlier pilot reports are development history and can contain failures subsequently fixed.

To rerun browser QA, install the dependencies declared in `integration/package.json` and run `node integration/qa/test-f16-f18-production.cjs` from the pack root. Microsoft Edge must be installed. Supporting test scripts and exact question data are under `audit/f16-f18-production-2026-10-17`. Native source backups and repeatable patches are preserved there. Do not rerun the intermediate case generators over the final corrected `lesson-cases.json`.

The supplied F0–F15 component, core and template files are hash-checked for byte preservation. F12 and F14 were absent/pending in the supplied archive and remain pending. This release adds F16–F18; it does not certify every previous family or promise that every future lesson build is error-free.

## Final touch guard verification

The full 7,012 desktop/viewport template checks ran before the final isolated coarse-pointer CSS guard. The final delta only prevents browser page panning over interactive SVGs on touch devices. Removing that one style reproduces the exact fully tested source hash for all 41 components; see `touch-css-equivalence.json`. All 41 final sources then passed six-scene rendering and touch-guard checks under a coarse-pointer phone context. Trusted touch drags were additionally exercised on the bar chart, Venn and ruler; this is representative testing, not every physical device.

Individual component HTML lessons are apparatus integration fixtures for Watch, Guided, Explore, Challenge and Bob; their other teaching sections retain template content. The combined class-trip lesson is the populated full-shell example. F12/F14 source files exist in the older bank but were excluded from the supplied production archive; this update does not determine that paperwork is their only remaining work.
