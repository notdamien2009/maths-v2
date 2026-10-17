# F12/F14 lesson production guide

F12 contains fifteen canonical geometry/area components; F14 contains thirteen transformation/symmetry components. Use the HTML sources in F12 and F14 with the approved master in 00-master. The original neon/chalk drawings and native controls remain in use.

## Try the full lesson

Open test-lessons/f12-f14/Garden-design-F12-F14-F18.html in Microsoft Edge. It connects unit-square area, translation of a plan and scale distance using an existing F18 component. It contains four teaching beats per concept, six example Challenge questions per concept, five diagnostic questions, fifteen practice questions and ten exit questions. Original component drawings are included in the assessment images. The corresponding Answer-key.json is for the teacher.

The individual F12-xx/F14-xx test lessons are apparatus integration fixtures for Watch, Guided, Explore, Challenge and Bob. Other fixture sections retain template content; use the populated garden lesson to test a complete lesson shell.

## Editing a new lesson

1. Choose a canonical component from the family capability manifest. Read its numerical and geometry boundaries.
2. Copy a record from the family configuration examples. Keep the declared scene function and argument names. Update numeric state, data.st where present, configuration, question, answer, units and captions together. Native geometry does not automatically rewrite prose.
3. Recalculate answers independently. Retain necessary givens and hide computed answers in Challenge. In Watch/Guided/Bob use the original native reveal options, animations and narration fields.
4. Configure Explore through componentConfigs and exploreBindings using that component's exposed fields. Pose a concept question, ask for a prediction and specify the relationship to investigate. For example, doubling one rectangle dimension doubles area; translation changes coordinates while preserving area. Pupil controls remain native. Restore returns to the configured lesson start.
5. Preserve native JavaScript shape/property predicates and the original drawing style. JSON display labels alone cannot redefine a shape, congruence rule or symmetry order. Do not patch private fields beginning with an underscore.
6. Test the generated lesson using integration/validate-lesson.cjs and play through its actual template. Check editing, resize, wrong answers, hint, victory, reset, independent apparatus and all assessment aids. Passing a component audit does not validate every possible future lesson.

The included six-question banks are component QA examples. This component completion does not replace the separate request for 38-question production banks with randomly selected 6–8 rounds.

## Native boundaries

Read each component's manifest. Geometry dimensions must be positive and fit the native plot. F12 peg vertices use verts and integer coordinates 0–7. F12-10 L-shape thickness is smaller than its outside dimensions. Circle sector counts remain 8/16/32/64. Unit-area conversion uses the square of the length factor.

F14 polygons use 3–12 vertices on the native coordinate grid. Keep transformed images in view. Similarity area ratio is k squared. Frieze drawings support up to five copies; Explore separation uses 1.8–2.7. The rotational pattern preset keeps its native fixed-angle structure. F6-13 remains an older preset reference; use canonical F14-11 for similarity rather than treating the gallery as a new engine.

The original decimal-digit-4 speech restriction is retained. Decimal numerals containing digit 4 require verified pronunciation before speech; captions remain available. Policy and reduced-motion checks are automated; no claim is made that every narration or installed voice has been heard. Automated accessibility scans retain incomplete SVG contrast checks for human judgement.

## Evidence and reruns

Current exact-source results are in audit/f12-f14-production-2026-10-17/release-browser.json. The release summary lists counts. Earlier pilot and shard reports are development history and can include failures fixed before release. The original sources and repeatable patches are preserved in the audit folder.

Browser coverage uses Microsoft Edge at 390, 1024 and 1440 pixels. Touch rendering checks cover all new components, with trusted touch drags on three representative transformation models. This is not a claim about every physical device. The existing shared core, master and earlier family source bytes are checked against their pre-upgrade hashes.

For QA reruns, install the packages declared in integration/package.json and run node integration/qa/test-f12-f14-production.cjs. Dependency folders are excluded from the ZIP. No installation or server is needed to open the delivered self-contained HTML lessons.
