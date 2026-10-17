# F10 template integration
- **Mount:** mount the F10 file as the lesson component (same as F4 to F8). `integration/F10-adapter-rows.json` holds the 20 rows for `integration/component-adapters.json`: replace the F10 rows with them. Replace the F6-08 row with `integration/F6-08-adapter-row.F10.json`.
- **Lesson record:** `{nativeIndex:0, data:{lesson:{state:{preset?:'<native key>', ...overrides}, phase:n, motion?:{from,to,durationMs}, title?}}, prompt, privateAnswer, answerType}`. See `F10-configuration-examples.json`. answerType: numeric for most rounds; coordinates ("x, y") for F10-02, F10-08 and some F10-14 rounds; ordered ("a, b") for some F10-18/F10-19 rounds; text for yes/no (F10-15), undefined (F10-19) and over/under (F10-20); choice with choices ["A","B","C"] for F10-17.
- **F6-08:** mount F10-05 with `state.preset` one of Y7-060, Y8-035, Y8-036, Y9-020.
- **Challenge:** the F0-12 controller renders each round with `concealAnswers:true`, which draws the engine's own Challenge view for the lesson state.
- **Validation:** `NovaLessonComponent.validate(record)` uses the F10 contracts and rejects impossible states before anything is drawn.
