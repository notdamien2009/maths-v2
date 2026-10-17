# F15 template integration contract

Mount through the unchanged `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html`. Lesson values go through `{nativeIndex:0, scene:{function, arguments}}` using the native draws. They are validated by `NovaF15Contracts.validate(id, record)`.

**Scene arguments are merged over the native step-0 arguments:** the keys you give replace native ones, and keys you omit keep the native value. Give every key the drawing reads, and switch native-only flags off where needed. Use the engines' own Challenge options so that the drawing hides the unknown (`challenge:true`, `readout:false`, `level`, `step`), and pass `animate:false`.

| Engine | Scene function | Arguments used by the checked examples |
|---|---|---|
| F15-01 | `board` / `proof` | `{st:{a,b}, o:{level:5, unknown:'a'/'c', grid, readout:false, tag, cap, say, pose, animate:false}}` |
| F15-02 | `board` | `{st:{a,b,c,unknown,unit,dp,scene:'geometry'/'ladder'/'ramp'}, o:{level:3, work:false, readout:false, …}}` |
| F15-06 | `scene` | `{st:{a,o,unit,target:'sin'/'cos'/'tan',kind:'ratio'/'solve',unknown:'o'/'a'/'h'}, o:{step:4, …}}` |
| F15-07 | `graph` | `{st:{theta,c,unit,ratio,placed:{}}, o:{step:10, …}}` |
| F15-08 | `scene` | `{st:{theta,placed:{}}, o:{step:16, …}}` |
| F15-09 | `draw` | `{st:{mode:'side',theta,known,given,unknown,unit,dp} or {mode:'angle',a,o,known,second,unit,dp,fixedHyp}, opt:{step:7, …}}` |
| F15-10 | `draw` | `{st:{family:'3060'/'4545',angle,scale:1}, opt:{step:7, …}}` |
| F15-11 | `draw` | `{st:{label,radius,theta,delta,emphasis:'all'}, op:{step, challenge:true, …}}` |
| F15-12 | `draw` | `{st:{label,kind,arc,p}, opt:{timeline:false, step:15, challenge:true, kind, …}}` (**`timeline:false` is required**) |
| F15-13 | `draw` | `{st:{label,method,a/b/c,A/B,find,unit}, opt:{challenge:true, given:[…], step:0, kind:method, …}}` |
| F15-14 | `draw` | `{p:{label,L,W,H,zoom,ranges,focus,unit}, opt:{challenge:true, step:0, given:[…], …}}` |

**Answer hiding:** while a question is unanswered, the runtime replaces every number token numerically equivalent to `privateAnswer` with "?" in stage text and in aria-labels and titles, unless the prompt contains that number. It looks at the printed precision, so "0.500" is hidden for 0.5, "−1.000" for −1, and "36.87" for 36.9. The working stays visible: the given sides, the other table columns, and "sin θ = 0.700" when the prompt gives 7 and 10. If a lesson must not show the working, choose the record accordingly. A small whole-number answer also hides an unrelated label with the same value.

**Prompts must give what the drawing does not.** F15-06/11/12/14 Challenge drawings deliberately show few or no measurements, and F15-10 draws the unit triangle (1, 2, √3), not the prompt's lengths.

**Ranges (enforced by the contracts):**
- F15-07: θ 1°–89°;
- F15-08: θ 0°–360°;
- F15-09: acute θ, and a hypotenuse longer than each leg;
- F15-11: radius 3–9;
- F15-12: arc 30°–180°, p 25–155;
- F15-13: angles totalling under 180°, with the triangle inequality;
- F15-14: edges ≤ 30.

**Challenge:** 6–8 numeric records per concept, each with prompt / privateAnswer / answerType / tolerance (for decimals) / hint / feedback. Examples are in `F15-configuration-examples.json`; there are six per engine and every answer has been checked.
