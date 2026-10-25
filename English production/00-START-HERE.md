## Mandatory first check — normal lesson OR assessment

Before any Year 7–9 English production, read [NOVA English Production Router v1.0](./Assessment%20Studio/NOVA-ENGLISH-PRODUCTION-ROUTER-v1.0.md) and [Assessment Unit Map](./Assessment%20Studio/ASSESSMENT-UNIT-MAP.json). If the numbered lesson is an assessment, use the **Assessment Studio** four-run prompts and student/parent assessment templates instead of this teaching lesson pack. Year 7 Lesson 015 is an assessment. Always confirm against the actual numbered curriculum, not merely the map. The assessment engine is a review candidate; protect real private mark schemes and pupil data from this public repository. Other English lessons continue using the existing seven-stage master and v2.5 answer-key gate.

---

# NOVA Academy English — Four-Run Production Pack v2.2

## v2.5 — AUTHORITATIVE PARENT ANSWER-KEY GATE (review branch)
Read **`NOVA-ENGLISH-PARENT-ANSWER-KEY-CONTRACT-v2.5.md`** before running any of the four prompts. This new contract supersedes older v2.0/v2.2 phrasing on answers, written marking and parent reviews. For every new lesson, all 25 Start/Practice/Exit questions and every Challenge mission need source-verified keys, with actual `parentGuide` examples and criteria for judgement responses. Run `NOVA-ENGLISH-ANSWER-KEY-VALIDATOR-v2.5.py` on Run 2 JSON; inspect outputs manually. Do not start bulk production or claim GOLD until a compatible parent-review renderer/master and server-authorised parent access have been approved and tested. This review branch does **not** replace the production v2.2 empty master.


**Status: controlled production CANDIDATE, not GOLD.** Date 24 October 2026. These prompts build original, full KS3 teaching lessons, **not CGP replicas or revision summaries**.

## Production inputs — retrieve and inspect, never guess

1. `NOVA-KS3-English-Curriculum.html`: authoritative programme scope and year progression (Y7 83, Y8 92, Y9 81).
2. `NOVA-KS3-English-Lesson-Plan-1.html`: numbered objectives, unit structure, adjacent lessons and intended activity types. These two files outrank any CGP ordering.
3. `CHALLENGE-ALLOCATION-NORMALIZED-v1.2-DRAFT.json`: suggested one-primary-Challenge-per-lesson routing. **Draft**, not automatically approved; lesson objective can override with documented reason. Original v1.1 IDs used `spelling-lab` and `speaking-studio`; normalized to validator's `spelling-word-study` and `speaking-argument`.
4. `NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.2.html`: exact approved-design **candidate** engine to populate; do not redesign or embed lesson content inside engine code.
5. `NOVA-ENGLISH-GLOBAL-LESSON-PRODUCTION-CONTRACT-v2.2.md` and `NOVA-ENGLISH-INSERT-AND-VALIDATE-v2.2.py`: common contracts/structural validator.
6. Three CGP KS3 study/workbook PDFs — use **as teaching approach references** only; see `CGP-REFERENCE-MAP-AND-COPYRIGHT.md`. Their actual files live in the user's Library; do not reupload full books to a public GitHub repository.
7. `NOVA-ENGLISH-Y7-001-READING-DETECTIVE-CHALLENGE-v1.0-REVIEW.html`: separate optional example of the user-reviewed layout/reading pathway; not a source for copied lesson passages.

Run in order **01 Architect → 02 Teaching/Assessment → 03 Build HTML → 04 GOLD Quality Audit**. Maintain structured handover artifacts between runs. All four runs may be completed in a single user request, but **all four gates must still be executed and evidenced**, and QA cannot be claimed if browser/audio/live site checks were not possible.

## Lessons and exact contract

Seven stages: **Start → Learn (one Bob Board) → Explore → Examples → Challenge → Practice → Exit**. Learn 3–5 concepts, exactly 4 meaningful beats each. Explore one distinct interaction per concept. Examples 3–5 progressive models. Start five warm-up diagnostics, Practice fifteen questions, Exit five questions. One objective-aligned Challenge family, including optional Spelling & Word Study. English royal blue; desktop Bob Board 750px locked with non-moving controls; Pip/Nova/Izaac boxed stationery mascots (no lines/roaming); Ryan voice when available, with visible text fallback.

**Asset and source rule:** never use a generic source, fake reference, CGP screenshot, CGP workbook passage, or placeholder as completed lesson content. Fresh text, concrete feedback, original visuals, valid literary permissions. Challenge extended writing requires rubric/human or validated site review, no fake auto mark.

**Git policy:** Repo `notdamien2009/maths-v2` is public; use branch/PR review for production docs, not a direct commit to main. No full CGP PDFs or pupil data in GitHub. Published maths component code is not to be modified by this English pack.

## v2.2 mandatory build/QA rules (user decision)

**Count individual prompts**, not answer lines or writing rubric rows: five Start warm-ups, fifteen Practice questions, five independent Exit questions. A paragraph question counts once; it may require a longer answer with genuine success criteria and deferred review. Each Practice/Exit item is one credit. Any Run 2 data with Exit 10 or weighted question substitutions must fail validation rather than silently render.

**Challenge QA is a release gate, not optional polish:** inspect the vertically stacked mission panel for every task kind (choice, line, writing, spelling) across desktop/tablet/mobile. Include screenshots of writing with textarea and rubric/checklist, plus runtime tests wrong→feedback→retry, correct→advance and writing→pending review. The v2.2 shared template uses `.rd-mission-panel` for task content instead of the colliding `.rd-mission` button style; do not reintroduce the selector collision.

