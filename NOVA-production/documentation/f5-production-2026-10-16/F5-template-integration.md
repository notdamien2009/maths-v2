# F5 template integration contract

Mount through `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html`, which is unchanged. Each record picks a native step with `nativeIndex` and supplies `data` in that step's schema (see `F5-capability-manifest.json` → `nativeFieldsByStep`).

- **Values:** every number shown in Watch, Guided, Bob or Challenge must be a step field in the record.
  - F5-01 `a,b,pick` {n,d}; F5-02 `n,d`; F5-03 `a,b,c,d,phase`; F5-04 `o:{n,d,min,max,factor}`; F5-05 `n,d,k`; F5-06 `n,d,g`
  - F5-07 `a,b,c,d,op,ready,show`; F5-09 `a,b,c,d,show`; F5-10 `n,d,sgn,p`; F5-11 `a,n,d,stage`; F5-12 `n`; F5-13 `input,state`
  - F5-14 `amount,percent,level`; F5-15 `original,change,level`; F5-16 `known,pct,level`; F5-17 `n,d,shown`; F5-18 `items,proofStep`; F5-19 `preset,selected`
- **Captions:** native captions describe the demo numbers, so the lesson must supply `caption` (F5-04: `helper`) whenever it changes the values.
- **Challenge:** 6–8 questions per concept, each a record plus `prompt`, `privateAnswer`, `answerType`, `hint` and feedback. Use an unanswered phase (examples are in `F5-configuration-examples.json`). The F0-12 controller renders with `concealAnswers`, and the F5 runtime masks result readouts.
- **Explore:** use exploreBindings, or `config:{presets:{lesson:{...}},preset:'lesson'}`.
- **Multiple views:** `views:[recordA,recordB]` was tested.
- **Fractions:** NOVA Chalk stacked fractions (numerator / neon vinculum / denominator). Inline a/b appears only in compact controls and prompts.
- **Speech:** decimal numerals containing digit 4 stay caption-only.
