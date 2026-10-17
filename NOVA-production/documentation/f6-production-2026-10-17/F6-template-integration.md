# F6 template integration
- **Mount:** mount the F6 file as the lesson component (same as F4/F7). `integration/F6-adapter-rows.json` holds the rows for `integration/component-adapters.json`: replace the 14 F6 rows.
- **Lesson record:** `{nativeIndex:0, data:{lesson:{state:{...native preset keys}, phase:n, motion?:{from,to,durationMs}, title?}}, prompt, privateAnswer, answerType}`. See F6-configuration-examples.json.
- **Challenge:** the F0-12 controller (`NovaLessonChallenge`) renders each round with `concealAnswers:true`, which draws the engine's concealed view.
- **Validation:** `NovaLessonComponent.validate(record)` uses the F6 contracts and rejects impossible maths before anything is drawn.
- **Phone:** engines redraw on breakpoint crossings: F6-01 689 px; F6-02 680; F6-03–07 and F6-14 760; F6-09–11 1000 (iframe width).
