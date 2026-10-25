# NOVA English Assessment Prompts v1.0 — QA + Handover

**Authored:** 25 October 2026. **Status:** Prompt pack ready for user review; *not* a certified assessment, GOLD engine, or completed Y7-015 paper.

## Sources used
- `/NOVA-ENGLISH-PRODUCTION/NOVA-KS3-English-Lesson-Plan-1.html` — actual numbered assessment objectives and Year 7 unit lesson titles (verified).
- `/NOVA-ENGLISH-PRODUCTION/NOVA-KS3-English-Curriculum.html` — year progression (verified).
- `NOVA-ENGLISH-ASSESSMENT-STUDIO-TEMPLATE-v1.0.html` (student) and `NOVA-ENGLISH-ASSESSMENT-PARENT-REVIEW-TEMPLATE-v1.0.html` (separate adult) — 25 October 2026 working standalone prototype (verified local copies).
- Paper and scheme demonstrations + `validate_assessment_pack.py` — exact implemented schema (read and test-run); demonstration content excluded from authored assessment work.
- Standalone template pack START-HERE and QA notes — product limitations and current integration gaps.

## QA outcomes for this pack
- Canonical numbered plan parsed: **18 assessment lessons, 6 in each year**, with reviewed content windows in `ASSESSMENT-UNIT-MAP.json` and CSV.
- Y7-015 unit scope extracted from real numbered plan: **001–014**, with exactly 14 lesson titles. These are **plan evidence only**: actual lesson outputs need Run 1 retrieval and inspection.
- Public+private schema validator: tested on demonstration content and returned PASS: 6 items, 40 marks. This is schema-check evidence, not approval of that example for use as the final paper.
- Originality tool: compared demonstration paper with itself, correctly emitted HIGH_SIMILARITY_BLOCKED and 8 flagged blocks, exit status 2. It detects surface similarities, not all semantic paraphrase/plot reuse.
- Embedding utility: inserted a different demonstration paper into a copy of the exact student assessment HTML without modifying its original asset and printed source/output SHA-256.
- New scripts compile with Python and document documented dependencies. HTML JavaScript/browser integration on **new production papers not yet tested** (no finished paper authored in this task).
- No GitHub push, no Library save, no source production template edits.

## Remaining checks when producing Y7-015
1. Retrieve full, latest approved **Y7-001…014** real HTML/data and all relevant prior assessment materials; inventory their exact questions and sources. No complete corpus was inspected for this prompt authoring task.
2. Draft unseen story/paper/private guide; conduct human comparison (including meaning and scenario), then run schema + similarity checks.
3. Browser test the specific production assessment student HTML on desktop/mobile; parent reviewer marking/partial credits; check actual save/resume and site protections when deployed.
4. Evaluate timing, mark allocations, alternative interpretations, SEND/accessibility and teacher/parent workflow. Mark release REVIEW CANDIDATE until deployment gates pass.

## Security boundary
Reference mark scheme inside this authoring ZIP is for **staff/authoring QA only**. Never upload the entire prompt ZIP to a pupil-accessible website. The output pupil HTML and public paper JSON should be served separately from private schemes. Proper server-side authorisation is still required for production.