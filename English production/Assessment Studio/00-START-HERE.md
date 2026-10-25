# NOVA English KS3 — Assessment Production Pack v1.0
**Created:** 25 October 2026 · **Status:** production-prompt candidate / assessment engine v1.0 is a standalone review prototype, not deployed or GOLD.

## Purpose
Produce **unseen end-of-unit assessments**, not seven-stage teaching lessons and not rearrangements of previous lesson exercises. Unit content and curriculum objectives decide what is tested; the assessment's stated outcome decides the emphasis and paper profile. Reuse *skills*, NEVER reuse *questions, specific answer tasks, distinctive stories, examples, imagery or solutions* from lessons, previous papers or the Assessment Studio demonstration.

## Canonical sources (read real files, don't guess)
1. `NOVA-KS3-English-Lesson-Plan-1.html` (numbered lessons and explicit assessment objectives) and `NOVA-KS3-English-Curriculum.html`, in ChatGPT Library `/NOVA-ENGLISH-PRODUCTION/`. The numbered plan contains 18 assessments, though the introduction incorrectly says 9.
2. Latest actual **approved** student lesson HTML/lesson data for **every lesson in the unit window**, including sources, Start, Practice, Exit, Challenges, and writing tasks. Prefer the latest approved variants; reconcile duplicated versions. Read previous assessment(s) and forthcoming lesson(s) for progression, but don't use later lessons to set unknown prior learning.
3. The **real, working** `NOVA-ENGLISH-ASSESSMENT-STUDIO-TEMPLATE-v1.0.html`, `NOVA-ENGLISH-ASSESSMENT-PARENT-REVIEW-TEMPLATE-v1.0.html`, example `PAPER-*.json`, `PRIVATE-MARK-SCHEME-*.json` and `validate_assessment_pack.py` from the 25 October 2026 Assessment Studio v1.0 template pack. These are schema/design/functional references, **never content libraries**.
4. Current accepted NOVA English royal-blue palette/branding. CGP English guides may inform depth/progression, never serve as text or question-copy sources.
5. Higher priority for later explicit user approvals and a newer validated assessment template if available; log differences rather than silently using older assets.

## Four-run pipeline — execute 1→4, with gates
- `01-RUN1-UNIT-AUDIT.md`: Actual taught unit, mastery/coverage, missing evidence, paper blueprint.
- `02-RUN2-UNSEEN-AUTHORING.md`: All-new passages, tasks, valid answer keys and private marking rubric.
- `03-RUN3-ASSESSMENT-BUILD.md`: Build **public pupil** paper JSON/standalone HTML, **separate private** marking JSON; run structural validator.
- `04-RUN4-STRICT-QA.md`: Trace questions to taught skills, prove novelty to the extent possible, check marks/interpretations, test interactions.

Read `00-ASSESSMENT-CONTRACT.md` first. Never use the normal seven-stage lesson Run 1–4 prompts for a formal assessment.

## Unit boundary rule
By default audit all numbered teaching lessons since the immediately preceding numbered assessment up to the lesson before this assessment. For Year 7 Lesson 015, inspect **Y7-001 through Y7-014**. Some assessments are cumulative; if so, explicitly add relevant earlier skills and explain the reason. The exact source-of-truth curriculum can narrow or expand this window. Do not mistake a unit title for evidence that a skill was actually taught.

`ASSESSMENT-UNIT-MAP.json` gives all 18 *default* assessment windows and titles from the numbered plan. Each needs a real-lesson audit before a final assessment is written.

## One-call launch prompt
> Produce NOVA English KS3 Year {YEAR} Assessment Lesson {NNN}. Read the latest approved Assessment Studio engine and `/NOVA-ENGLISH-PRODUCTION/` canonical sources. Execute assessment Runs 1–4 from this pack. Audit every actual lesson in the assessment window, build a skill coverage matrix, and test each taught skill through **wholly new, previously unseen** sources, stems, response demands and scenarios; do not reuse lesson/assessment/demo material. Respect the assessment's main objective. Create a pupil-safe paper JSON, private adult-only marking JSON, a standalone pupil assessment HTML (student engine with data script replaced only), coverage/originality logs and an honest QA report. Validate marks, schema, authenticity, mobile and marking. If prior lesson files are missing, mark originality comparison incomplete; do not claim GOLD or full novelty verification. No GitHub push and no Library upload without approval.

## Outputs per assessment
1. `Y{YEAR}-{NNN}-R1-UNIT-AUDIT.md` and `Y{YEAR}-{NNN}-R1-COVERAGE-MATRIX.csv`.
2. `PAPER-Y{YEAR}-{NNN}.json` **PUBLIC pupil-safe**; `PRIVATE-MARK-SCHEME-Y{YEAR}-{NNN}.json` **ADULT-ONLY**; `Y{YEAR}-{NNN}-R2-EDITORIAL-REVIEW.md`.
3. `NOVA-ENGLISH-Y{YEAR}-{NNN}-ASSESSMENT.html` **PUBLIC pupil HTML** and build/validation log.
4. `Y{YEAR}-{NNN}-R4-QA.md`, optionally `Y{YEAR}-{NNN}-ORIGINALITY-FLAGS.json`; ZIP only if it does **not** mix student distribution files with the marking scheme in a publishable pupil bundle.

**Protection note:** in standalone v1.0, public/private separation is by independent files, not account permissions; real parent/teacher role enforcement and safe server-side delivery remain website integration blockers.