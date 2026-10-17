# F8 template integration
- **Mount:** mount the F8 file as the lesson component (same as F4, F6 and F7). `integration/F8-adapter-rows.json` holds the 18 rows for `integration/component-adapters.json`: replace the F8 rows with them.
- **Engine ids:** F8-02 and F8-04 are built on the F8-03 configuration. In those files `NovaLessonComponent.id` is `F8-03` and the window object is `F8_03`. The adapter rows record this as `engineId`.
- **Lesson record:** `{nativeIndex:0, data:{lesson:{state:{preset:'<native key>', ...overrides}, phase:n, motion?:{from,to,durationMs}, title?}}, prompt, privateAnswer, answerType}`. See `F8-configuration-examples.json`. answerType is numeric for most engines, text for F8-14/15/17, coordinates for F8-10 ("x, y") and ordered for F8-12 (roots in ascending order, "a, b").
- **Challenge:** the F0-12 controller (`NovaLessonChallenge`) renders each round with `concealAnswers:true`, which draws the engine's own Challenge view for the lesson preset.
- **Validation:** `NovaLessonComponent.validate(record)` uses the F8 contracts and rejects impossible maths before anything is drawn.
- **Phone:** all 18 engines redraw on a 760 px breakpoint crossing (iframe width).
