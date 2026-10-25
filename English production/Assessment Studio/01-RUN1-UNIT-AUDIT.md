# RUN 1 — Unit Forensic Audit & Assessment Blueprint
**Role:** KS3 English curriculum architect and independent assessment designer. **No paper questions or HTML edits in this run.**

## Mandatory retrieval
1. Resolve Year/NNN from user's request. Read canonical `NOVA-KS3-English-Lesson-Plan-1.html`, `NOVA-KS3-English-Curriculum.html` and current Assessment Studio template contract.
2. Determine assessment **title, main outcome, genre, source/response format** from its exact numbered item. Identify the previous assessment and the teaching window between it and this assessment using `ASSESSMENT-UNIT-MAP.json`; verify against the plan.
3. Retrieve **the latest actual approved student-facing HTML and lesson data for each teaching lesson in that window**, from current uploads/Library/GitHub (`notdamien2009/maths-v2`, English production area) if available. Do not treat a plan title, historical screenshot or older revision as a substitute for real content. If multiple versions conflict, use latest explicit approved version and document selections.
4. From every lesson inspect Start diagnostic, Bob Board Learn concepts, Explore, Examples, Challenge, Practice, Exit, **original source passages**, assessment questions, answer scaffolds and pre-existing question patterns. Inspect earlier formal assessments and the template's 4 demos for duplication risks. Prior lesson questions are solely for a **do-not-copy database**, never text to reuse.
5. If files absent, request nothing routinely: extract the verified curriculum-level skill plan and prepare a draft audit, but mark actual `TAUGHT` coverage and anti-copy check as **INCOMPLETE**. Do not invent prior lesson content or call the paper unseen-verified.

## Construct two matrices
### Unit mastery matrix (every numbered lesson must have a row)
`lessonId | approvedSource/version | plannedSkill | explicitlyTaughtSkill | prerequisiteKnowledge | evidence(stage/quote or paraphrase) | lessonQuestionTypes | commonMisconceptions | cumulativeRole | verificationStatus`.
Separate the three statuses: `TAUGHT_VERIFIED`, `PLAN_ONLY`, `NOT_IN_SCOPE`. One row per lesson minimum; split multiple materially different skills into separate rows if needed.

### Exam specification & traceability matrix
`assessedCriterionId | targetSkill | sourceLessonIds | assessmentObjective | weightingMarks | cognitiveLevel | questionType | unseenContext | anticipatedValidEvidence | risk | status`.
- Include `ASSESSMENT_PRIMARY_OUTCOME` as an explicit entry and reserve the greatest weight for it where appropriate.
- Choose 3–7 main criteria, not 14 equal-weight questions just because the unit has 14 lessons.
- Prioritise concepts explicitly taught and genuinely relevant to the objective. Some skills are transferred within an extended response (planning, vocabulary, formal accuracy); they needn't each become their own small question.
- Set appropriate marks and duration (with visible rationale: reading amount, evidence search, writing/ editing volume), not blindly reproduce demo's 40 marks/60 minutes.
- Ensure core→secure→stretch reasoning and a chance to show advanced understanding without inaccessible trick questions.

## Decide paper format
Choose one existing `profile`: `short-story-response`, `unseen-reading`, `poetry-analysis`, `comparison`, `shakespeare-drama`, `creative-writing`, or `mixed-paper`. Check **actual** supported source display/question controls, not hypothetical specialized tools. Define number of original source(s), paragraph/line/stanza/speaker formatting, section count, answer widget types, mark budget, anticipated answers and acceptable alternatives. Choose a separate adult marking criterion structure before wording questions.

## Declare fresh-material boundaries
Build a `DO-NOT-REUSE` inventory of prior plots, distinctive objects/locations/relationships, passages/poem imagery, quotation snippets, teaching examples, practice and exit stems, earlier assessment scenarios, Assessment Studio demo plots (`The Bell in the Reeds`, `After the Storm`, `First Light` etc.). Include **semantic near-duplicates**, not just exact wording. Draft genuinely different stimulus premises.

## Y7-015 anchor (verify live sources first)
Canonical unit is Y7-001…014, *Reading & Writing Foundations*. Y7-015 is *Assessment: extended response to a short story*. Core outcome is independent close reading and **developed analytical writing based on an original unseen short story**. Earlier unit includes reading meaning, inference+evidence, purpose/audience/context, structured paragraph, narrative opening, description, sentence types/punctuation, nuanced word choice, speaking/listening, rereading, revision/editing, register and nonfiction comparison. Not all require standalone marks here: speaking may be deliberately excluded because this is a **written** assessment. Ensure the assessed question sequence emphasises short-story reading, quotation selection, careful inference and sustained explanation, rather than treating it as a full SPaG recap or replicating the previous demo's questions.

## Run 1 deliverables
- `Y{YEAR}-{NNN}-R1-UNIT-AUDIT.md`: exact unit bounds and texts/files reviewed, conflict log, objectives, material/genre choices, gap report, chosen paper profile, timing/marks, six risks.
- `Y{YEAR}-{NNN}-R1-COVERAGE-MATRIX.csv`: unit mastery + mark-to-lesson mapping, with explicit verified/plan-only flags.
- `Y{YEAR}-{NNN}-R1-ORIGINALITY-EXCLUSIONS.md`: banned reused tasks/themes/passages and nearest previous examples that new tasks must avoid.
- `Y{YEAR}-{NNN}-R1-BLUEPRINT.json`: planned skills, marks, sections, source requirements, question format and fairness notes; this is NOT student paper JSON.

## Gate
`READY FOR RUN 2` only if objective is exact, blueprint sums, named skills are verified taught and source inventory is known. If actual lesson outputs are missing: `PROVISIONAL — NOT CERTIFIABLE` and continue *only as an editorial draft* with explicitly outstanding lesson-level comparison. Never gloss over this.