# RUN 2 — Original English Teaching + Assessment Authoring (Global)

## v2.5 ADDITIONAL MANDATORY RUN 2 GATE
**Write answer keys as part of lesson authoring, not as post-processing.** Exactly 5 Start + 15 Practice + 5 Exit plus each Challenge mission must have a verifiable target and source. Correct choice/line/spelling indices, accepted equivalent answers, question-specific right/wrong feedback and a reason from the actual source are mandatory.
For `marking:"judgement"` and Challenge `kind:"writing"`, include in the lesson JSON:
`parentGuide: {exampleAnswer, lookFor:[2–5 specific checks], acceptAlternatives, commonMistakes:[...], nextStep}`.
The model must **answer the specific question** at the intended pupil level with real source quotation/reasoning. No generic "check against rubric", unexplained word-count grading or copying CGP content. Preserve Practice exact/live vs judgement/deferred, Exit independent. Produce a **private** `Y{year}-{NNN}-R2-PARENT-ANSWER-KEY-MANIFEST.json` with a row for each question and Challenge task, source reference, correct response/model and key misconception. Validate against the actual passage and run the v2.5 answer-key validator; a structural pass cannot certify English interpretations.


## Required inputs
Read complete Run 1 architecture/route, current master/contract and canonical curriculum/lesson plan and normalized Challenge map; consult the three CGP books as **teaching method references** as directed. Do NOT imitate CGP text, artwork, quirky wording or question sequence. Build a full teaching lesson from the beginning, not a compressed revision summary. No HTML engine edits during this run.

## Teaching / scripting
1. For each of **3–5 concepts**, write **exactly four distinct, age-appropriate Bob Board beats** with exact `beat` name, original lesson narration (`speech`), specific `visualHTML`/`mathHTML` as required by v2.0 insertion schema, `focus`, and a fixed-box mascot cue `{pose,action,target?}`. Show the source BEFORE the evidence highlight and animate only a genuine reasoning step. Do not narrate something different from what the pupil sees.
2. Use the CGP-like *explanatory discipline*: clear definition, concrete worked step, 'why it works', realistic misconception and guided transfer. Improve beyond revision books with original demonstration and real student interaction. Avoid teacher-facing instructions in pupil copy.
3. Author one distinct **Explore** per concept: `conceptId`, original source `lines`, thoughtful tasks/missions with valid `correct` index, specific `why` and `wrong`, retry/feedback and a different cognitive action as planned. Some activities may require a specialised engine pilot; **flag as BLOCKER** instead of faking interactivity through generic choice forms.
4. Author **3–5 worked Examples**, with original passage (`visualHtml`), 3–5 `steps`, correct explanations and `mascotCues` aligned one-to-one with steps. Examples must extend, not simply repeat, the Board's sources.
5. Challenge: one primary family from normalized allocation; `id`, `type`, `title`, `intro`, original `source` where needed and meaningful `tasks` of kind `choice`, `line`, `writing` or `spelling`, consistent with actual supported renderer. For extended writing use a rubric, an editing opportunity and pending-review path. For spelling teach the pattern, meaning and use, save unique bank ID and isolate website replay. Do not claim all family interfaces are tested.
6. Start **5** exactly: `S1 core short`; `S2 core visual-mcq`; `S3 secure mcq`; `S4 secure visual-short`; `S5 stretch written`. Use only justified prior-knowledge diagnostic content; plan helpful non-answer-leaking original visuals.
7. Practice **15 questions**, with actual thinking progression (not 15 trivial variations), unique IDs and specific wrong answer/misconception feedback. Exit **5 questions**, genuine new passages and tasks, no hints/live checking. Extended responses must have **meaningful criteria and human/validated review** rather than keyword marking.
8. All passages written independently with source/rights metadata, faithful quotations where licensed, no CGP reproduction. Make calculations, timings, grammatical rules, word meanings, quotations, answer keys and associated highlights agree.

## Output / Handover
Create `Y{year}-{NNN}-R2-LESSON-DATA.json` following **exact** empty master schema, and `Y{year}-{NNN}-R2-TEACHING-QA.md`: all answers independently rechecked, duplicate tests, source/quotation audit, difficulty and writing rubric, glossary, animation/audio script cues. **Validate JSON** and run the structural validator on data before Run 3. If it fails or a planned interaction is unsupported, repair the data or explicitly block release — do not bypass the engine. Do not label content GOLD on authorship alone.

**v2.2 counting and writing rule:** Enforce 5/15/5 actual question objects; every Practice/Exit question has one credit. A 100-word paragraph can be one question, assessed by a rubric and pending review, not an exact-keyword score. Check prompt clarity, writing space, save-on-input and review actions; do not split an extended answer into multiple numbered credits.

