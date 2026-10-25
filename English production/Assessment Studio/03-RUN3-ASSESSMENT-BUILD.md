# RUN 3 — Build Standalone Pupil Assessment + Private Parent Guide
**Role:** product engineer. Assemble validated authored content into the *existing* Assessment Studio engine. Do not rebuild the teaching lesson template or redesign approved royal-blue UI.

## Input preflight
- Run 1 verified unit skill coverage and Run 2 final public paper/private scheme. Confirm target ID, actual paper profile and latest approved template. Report if there is a more recent approved engine than v1.0.
- Read existing `NOVA-ENGLISH-ASSESSMENT-STUDIO-TEMPLATE-v1.0.html`, `NOVA-ENGLISH-ASSESSMENT-PARENT-REVIEW-TEMPLATE-v1.0.html`, `validate_assessment_pack.py` **from the real template pack** and at least one matching demonstration JSON for structure only. The demo material must not enter the final new paper.
- Check `schema` is exactly `nova-english-assessment/v1` and `nova-english-mark-scheme/v1`; `paperVersion` and `assessmentId` align. All questions belong to one or more declared sections; marks sum; references exist; question and source IDs are unique.

## Prepare data
Use explicit supported components only. Each public question must have `id, type, prompt, marks, sourceRefs`; optional `options:[{id,text}]`, `original`, `allowPlan`, `aoTags`, `wordGuide` as suited. Source lines use `{n,text}` with optional stanza/speaker only where the actual engine accepts it. Use `instructions` for neutral conduct, never coaching. `duration:{mode:'guidance',minutes:N}` until actual timed experience is approved. `maxMarks` equals the sum of *all* question marks; do not copy demonstration total indiscriminately. IDs like `ENG-Y7-015-A`, version `1.0.0`, and question IDs like `A1` are allowed, but must be consistent and genuinely new.

Private scheme should include `schema`, `assessmentId`, `paperVersion`, `rubricVersion`, `private:true`, `questions`, with each question's `id, marks, method, model/lookFor/acceptable/guidance`; no student-facing schema private fields. Within current v1.0 parent UI, human assignment of partial marks is the supported marking mechanism. Do not claim server-side automatic scoring is implemented.

## Required commands and assembly
1. Validate content against the **copied original** `validate_assessment_pack.py`:
   `python validate_assessment_pack.py PAPER-Y7-015.json PRIVATE-MARK-SCHEME-Y7-015.json`
2. Compare against originals and demo using the included `assessment_novelty_gate.py` (flagging only; semantic human review still required). Include an inventory of paths compared.
3. Duplicate the existing student engine HTML to a **new file**, leave CSS/JS/layout unchanged, replace **only** JSON text within `<script id="novaAssessmentPaper" type="application/json">…</script>` with `PAPER-...json` (use included `embed_paper.py` after validation if useful). Guard against `</script>` in source text, unexpected HTML and unsupported embedded media. Verify HTML script contains only public paper text.
4. Keep the adult review HTML separate and load the `PRIVATE-MARK-SCHEME-...json` **only inside the adult interface**. No parent scheme inside public HTML, ZIP deployed for pupil, base64 string, JS comment or network asset served to pupil.
5. Build product names: `NOVA-ENGLISH-Y{YEAR}-{NNN}-ASSESSMENT.html`, `PAPER-Y{YEAR}-{NNN}.json`, `PRIVATE-MARK-SCHEME-Y{YEAR}-{NNN}.json`, editorial/QA evidence. Version both paper and private guide. Do not touch global master or approved lesson files.
6. For local pilot the parent loads exported attempt and private scheme in standalone reviewer. This is **not** automatic website hand-in or secure auth. Record those open integration gates for future deployment.

## Screen QA for assembly
Test assessment Brief→Begin→source panel→multiple question types→draft editing→Review→return to a question→Submit in the pupil browser. Check the browser's chosen storage behaviour if available; distinguish saved in same session from survive-reload. On mobile, test the source switch, font sizes, no clipped controls/overflows, typing and resumption. Check all links to the correct source and exact question IDs. Separate parent reviewer loads and marks the exact exported attempt, supports 0 and partial marks and computes correct totals, with no premature release of marking criteria.

## Deliverables
- Public `NOVA-ENGLISH-Y{YEAR}-{NNN}-ASSESSMENT.html` + `PAPER-...json`.
- Private `PRIVATE-MARK-SCHEME-...json` and unchanged parent review shell (reference or copy as appropriate).
- `Y{YEAR}-{NNN}-R3-BUILD-LOG.md` including source template/hash, validator result, no runtime edits, actual browser tests, unknowns, and public/private delivery boundaries.
- No direct GitHub push, no Library save, no production-ready label without Run 4 evidence.

## Gate
`READY FOR RUN 4` only if valid data embeds into original engine, no student markup includes private keys, mark totals/IDs align and the standalone HTML is functional. Otherwise return to Run 2/3 for a systemic fix; avoid per-lesson HTML patches.