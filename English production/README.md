# NOVA English Production — KS3 (Years 7–9)

**Latest shared production candidate: v2.2 (review branch).** Start 5 warm-ups, Practice 15 questions, Exit 5 questions. One paragraph remains one question. Existing v2.0 master remains available for older lessons.

This is the English production area in the Maths V2 repository. The separate English pipeline lives here; the existing `NOVA-Y7-001-AUDITED.html` is kept untouched.

## Production workflow

1. Read `00-START-HERE.md` and **`NOVA-ENGLISH-GLOBAL-LESSON-PRODUCTION-CONTRACT-v2.2.md`**.
2. Use the NOVA English curriculum and lesson plan as the canonical lesson sequence (256 numbered lessons).
3. Use `CHALLENGE-ALLOCATION-NORMALIZED-v1.2-DRAFT.json` to plan a lesson-specific Challenge; this mapping is a draft and must be reviewed, not chosen at random.
4. Follow Run 1 (Architect), Run 2 (Teaching and Assessment), Run 3 (HTML build), Run 4 (strict QA).
5. Build from the clean empty v2.0 master, preserve the royal-blue theme, Bob Board's 750px fixed desktop height and boxed mascot design, and never silently copy Y7-001 lesson content.

## CGP references

Three CGP KS3 books (Complete Study & Practice, English Workbook, SPaG Workbook) are available in the user's private ChatGPT Library folder `/NOVA-ENGLISH-PRODUCTION/`. Use their teaching approaches for inspiration and write **original** content; do not reproduce CGP text or artwork. The source PDFs are intentionally **not stored in this public GitHub repository**.

## Approval status

This is a controlled production candidate, not a GOLD-certified system. Specialist Challenge family pilots, live narration, deployed hand-in and full accessibility QA remain to be verified. Do not modify the Maths engine to accommodate English changes.

## v2.2 protected rollout

- **Use together:** `NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.2.html` and `NOVA-ENGLISH-INSERT-AND-VALIDATE-v2.2.py`. Do not mix one with an old v2.0 version.
- **Source:** `NOVA-KS3-English-Curriculum.html`, `NOVA-KS3-English-Lesson-Plan-1.html`, Challenge allocation v1.2 and the three privately stored CGP teaching references.
- **Assessment:** 5 Start warm-ups, exactly 15 Practice questions, exactly 5 Exit questions. A longer paragraph/extended response is one numbered item and one credit with rubric and honest pending review, not an inflated question count or automatic exact-string mark.
- **Challenge QA:** the shared `section.rd-mission-panel` must be a vertical reading/writing panel, never use `.rd-mission` navigation-button flex styles. Test choice, evidence line, writing and spelling tasks at 1360px, 1024px, 768px, and 390px, including submission/retry and keyboard focus.
- **Release:** v2.2 is a candidate pending merge/review; no claim of audited live website hand-in or audible Ryan narration. Older standalone lessons continue to use their frozen engine; rebuild/migrate them before changing their assessment count. Do not overwrite the 2.0 master or replace an approved live lesson blindly.
