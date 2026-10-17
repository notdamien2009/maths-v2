# F9 template integration contract

Mount through the unchanged `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html`.

Native F9 steps carry teaching text. **Lesson values go through `{nativeIndex:0, scene:{function:'lessonScene', arguments:{p}}}`.** They are validated by `NovaF9Contracts.validate(id,record)` before drawing:
- F9-01 `{stage 1–5, ask 6–40}`: matchstick count at a later stage
- F9-02 `{kind:'arith', a1, step≠0 | kind:'geom', a1 1–20, ratio 2–5, visible 3–4}`: next term
- F9-03 `{a 1–9, b −9..20, ask 6–50}`: T(ask)
- F9-04 `{linear a≠0 | quadratic a 1–3, visible 3–4}`: next plotted term
- F9-05 `{a −9..9 ≠0, c −20..30}`: constant c
- F9-06 `{a 1–100, r ∈ {2,3,4,0.5}, shown 2–4}`: next bar
- F9-07 `{kind square|triangle|cube|fibonacci, n ≤4, ask 5–6}`
- F9-08 `{n 2–6, ask 5–20 > n}`
- F9-09 `{a 1–3, b −6..6, c −6..10}`: T(5)
- F9-10 `{ask:'centre', rows 3|5|7 | ask:'nextSum', rows 3–6}`
- F9-11 `{kind:'add', first −20..120, |k| 6–15}`: the rule amount
- F9-12 `{add | multiply}`: term 5
- F9-13 `{sierpinski|koch, n 0–2, ask 2–4 > n}`

**Challenge:** 6–8 records per concept, each with prompt / privateAnswer / answerType / hint / feedback. Examples are in `F9-configuration-examples.json`; there are six per engine and every answer has been checked.
