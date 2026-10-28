# Editing F4 lessons

Use the approved `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html` (combined F0–F3 copy) and the source paths in `integration/component-adapters.json`. Map each alias in `P.sourceIds` and embed the current complete native HTML in `novaV2Sources`. Exported lessons embed source snapshots, so rebuild them to pick up these changes.

The reusable record is the same as F3:

```js
{source:'SRC', nativeIndex:0,
 data:{lesson:{state:{/* complete mathematical state */}, phase:0, title:'optional stage heading'}}}
```

Omitted state keys fall back to the engine's default preset. Supply a complete state anyway, because `NovaF4Contracts` validates what you send.

| ID | `data.lesson.state` | Phases |
|---|---|---|
| F4-01 | `whole`, `known:[k]` or `[k1,k2]` | 0–5 |
| F4-02 | `a`, `b`, `mode` (`difference`/`shorter`), `knownDiff` when shorter | 0–5 |
| F4-03 | `a:[rods]`, `b:[rods]` (1–10, ≤ 10 units per train) | 0–6 |
| F4-04 | `start`, `changes:[p1,p2]` | 0–7 |
| F4-05 (on F5-11) | `a`, `n`, `d` | 0–5 |
| F4-06 | `kind`, `base` (or `final` for reverse), `pct`, `part`, `years` | 0–7 |
| F4-07 | `mode` (`share`/`simplify`), `a`, `b`, `total`, `names:[..,..]` | 0–7 |
| F4-08 | `mode` (`expression`/`equation`/`bar-equation`), `n`, `b`, `total` | 0–7 |
| F4-10 (preset of F4-08) | `mode:'translator'`, `n`, `b`, `total`; plus `lesson.overlay:'equation'` | 0–3 |
| F4-09 | `kind`, `before`, `rate`, `unknown` (`before`/`after`/`change`) | 0–7 |
| F4-11 | `kind`, `n`, `extra`, `total`, `expected`, `segments` (must mark `whole`, `part` and `difference`) | 0–5 |
| F4-12 | `kind` (`rate`/`amount`/`units`), `units`, `rate`, `total`, `u`, `q`, `rateUnit` | 0–6 |

Custom Watch, Guided and Bob motion: set `animated:true` and `lesson.motion:{from:0,to:N,durationMs:4000}`. Static preview shows `from`; reduced motion shows `to`. The Watch pause, resume and reset controls are honoured. Make `storedDur` at least as long as the motion plus reading time. Narration and captions must describe the current numbers.

Challenge: give 6–8 records under `manifest.challenge`, each with its own `data.lesson.state`, `prompt`, `privateAnswer`, `answerType`, `hint`, `wrongFeedback` and `correctFeedback`. The canonical F0-12 controller (`integration/nova-lesson-challenge.js`) renders each record with `concealAnswers:true`. The F4 runtime then draws the unanswered native phase and strips answer-bearing `data-*` attributes. F4-06 also masks the interior amount-scale labels. Lives, hints, streak, score, automatic advance, confetti and the badge all come from the canonical F0-12 controller.

Answer types: use numeric where possible. `text` answers (F4-10 equations, F4-11 expressions) must match exactly, so the prompt has to state the format, e.g. `3x+5=26`.

F4-10 equation overlay example (Y7-035):

```js
{source:'SRC',nativeIndex:0,animated:true,
 data:{lesson:{state:{mode:'translator',n:3,b:5,total:26},overlay:'equation',motion:{from:0,to:3,durationMs:3600}}}}
```

Master mapping (from the user's master document): Y7-007 F4-02 · Y7-019 F4-03 · Y7-026/027/062/063, Y8-007/008/038/040, Y9-005 F4-06 · Y7-034 F4-08 + F4-11 · Y7-035 F4-10 + F4-01 · Y7-058/059, Y8-034 F4-07 · Y8-008 F4-09 · Y8-038 F4-04 · Y8-041 F4-12. F4-05 is used through F5-11 lessons.

Full examples (six Challenge records, one Watch, Guided stages and four Bob beats per component) are in `F4-configuration-examples.json`.
