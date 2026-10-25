# RUN 4 — Independent Editorial, Examination & Product QA
**Role:** critical KS3 English chief examiner plus accessibility/engineering QA. Do not automatically approve the author's work. Report evidenced results and limitations.

## 1. Unit and validity audit
- Re-read assessment objective and Run 1 coverage matrix. Sample against the actual completed lesson output in the unit (and the full inventory). Ensure every assessed technique was taught; distinguish planning-only skills and cumulative transfer.
- Use a mark-by-skill table and verify central assessment skill holds the intended emphasis. Remove redundant/irrelevant 1-mark filler. Do not count a different genre task as aligned merely because it references reading.
- Independently assess year appropriateness, source complexity, accessibility, reading load, time/load plausibility, originality and ethical presentation.

## 2. Unseen authenticity and duplication audit — CRITICAL GATE
- Confirm exact list and checksums/versions of **all actual unit lessons**, previous formal assessment papers, and engine demonstrations examined. If any missing, say **FULL ORIGINALITY NOT VERIFIED**.
- Compare new text and every question to prior sources and Start/Explore/Challenge/Practice/Exit/writing prompts, previous papers and demo via exact strings + similarity detection. Inspect high-risk flags and close them with reauthoring, not merely name replacement.
- Conduct a human **semantic audit**: source theme, unusual scenario, character role/decisions, question concept+format+wording, order of inferential steps, specific textual evidence, model answers, editing error sequence, distractors. Check whether a child could answer from memory of prior activity without understanding a new source.
- Check that a sample mark scheme does not accidentally include the same distinctive phrases/text as the earlier demo or lesson solutions. Verify licensed/non-copied text; track original authorship; do not claim legal uniqueness from an algorithm alone.

## 3. Question-by-question examination check
For **every** question produce one QA record:
`id | link-to-taught-skill | prompt sound? | independent solved answer | marks fair? | all alternatives credited? | source refs exact? | type supported? | originality vs nearest item | bias/access? | PASS/REWORK`.
- Recalculate `maxMarks`, all criteria caps, mark bands and partial marks. Nothing negative/double-counted, no extra credit not declared. Check model supports full-credit possible answer but does not act as an exact-string requirement.
- Cross-check source line/quote punctuation and textual interpretation. Accept multiple evidence choices/alternative reasonable analyses. Correct ambiguous MCQs and grammar/discussion issues; avoid giving one answer away in earlier questions or feedback.
- Verify no hint sentence starters, clue labels, formatting emphasis, visible explanations/solutions, pre-selected answers or premature correctness scores in student paper.
- Compare genuinely different question reasoning, not just unique wording; remove duplicate inference prompts where only detail changes.

## 4. Product/technical QA
- Run provided `validate_assessment_pack.py` against paper+scheme and `assessment_novelty_gate.py` with verified actual lessons + prior papers and demos. Record what similarity script did/did not prove.
- Check content's precise supported `nova-english-assessment/v1` schema; no unsupported widget/new renderer; student runtime remains unchanged; no teacher/parent scheme fields, answers or loaded private JSON present in pupil HTML/pack.
- Browser on desktop ~1440px and mobile 390px at minimum: Brief, source readability, answer box sizing, source/question switching, every question navigation, blank answer, long essay input, unicode punctuation/paragraphs, drafts, Review, Edit and Submit. Wrong/partial marking path in parent interface with correct total, and export report.
- Reopen/reload test autosave only when available on a trusted origin; do not infer working reload persistence from a same-page navigation test. Keyboard, labels and focus, zoom, reduced motion, assistive technology if possible; note untested.
- If deployed, separately verify authentication, student cannot obtain private scheme via devtools/API, attempt identity/storage, idempotent hand-in, parent read rights, results release. If untested, hold production release.

## 5. Genuine output status
A short QA report includes:
1. **Table** `curriculum/pedagogy, originality, marks, reading/writing quality, supported type/schema, desktop, mobile, keyboard, autosave, hand-in, private marking, accessible results`, with PASS/FAIL/NOT TESTED and evidence.
2. Specific severity-ranked defects; fixes to system/template vs one-paper data; retest after edits. No 'perfect 10/10' or GOLD if tests missing.
3. Novelty corpus manifest (file names/versions), unresolved gaps, nearest suspicious tasks and decisions.
4. Integrity: original HTML template unchanged except paper JSON; all output paths; SHA-256 hashes if possible; public/private clear split.
5. Clear result: `BLOCKED`, `REVIEW CANDIDATE`, or `GOLD` (only with full end-to-end evidence).

**Never repair a cross-paper renderer flaw separately in 18 generated papers. Fix and pilot the shared engine, then regenerate/retest affected papers. Do not push directly to GitHub.**