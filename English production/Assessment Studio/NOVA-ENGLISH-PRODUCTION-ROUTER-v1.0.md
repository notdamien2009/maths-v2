# NOVA English — Mandatory Lesson/Assessment Production Router v1.0

**Scope:** Every user request for English production in Year 7, 8 or 9, including shorthand such as `English production yr7 - 030`, `next`, `run 2`, or `make Lesson 015` in a continuing production conversation.

## Mandatory FIRST action, before choosing prompts or HTML
1. Resolve the exact **year and three-digit lesson number** from the current request and its unambiguous inherited context. If the request is `next`, increment the last produced lesson; check the new ID independently.
2. Read the authoritative numbered `English production/NOVA-KS3-English-Lesson-Plan-1.html` and the versioned `English production/Assessment Studio/ASSESSMENT-UNIT-MAP.json`. The map is an **index**, not permission to skip actual curriculum checking. If they conflict, use the latest approved numbered curriculum and FLAG the routing discrepancy before authoring.
3. Look up `(year, lesson)` in the 18-entry assessment map. Explicit `assessment` lesson designation in the curriculum also triggers an assessment route. Do not infer type from a title alone or from a chat memory.
4. If an assessment, route to **ASSESSMENT**: `English production/Assessment Studio/00-START-HERE.md`, `00-ASSESSMENT-CONTRACT.md`, and `01-RUN1-UNIT-AUDIT.md` through `04-RUN4-STRICT-QA.md`; use the *Assessment Studio* **STUDENT** HTML engine and **separate** **PARENT** review engine. Do **not** use 7-stage teaching prompts, Bob Board or the teaching master.
5. Otherwise route to **TEACHING LESSON**: current `English production/00-START-HERE.md` and its approved `01-RUN1`…`04-RUN4` teaching prompts, the current approved `NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.2.html`, and parent-answer-key contract. Do **not** use the assessment engine for ordinary lessons.
6. Confirm route at start of production: `Y{year}-{NNN}: ASSESSMENT | TEACHING`, canonical title, target unit, selection evidence and template filename. Do not ask user to decide whether a numbered lesson is an assessment when the approved curriculum already decides it.

## Canonical assessment numbers — indexed from numbered curriculum, verify on use
- Y7: **015, 030, 044, 058, 071, 083**
- Y8: **016, 031, 046, 061, 076, 091**
- Y9: **014, 030, 042, 057, 069, 080**

## Assessment-specific source and originality gates
- Run 1 reads **the actual completed lessons of the preceding unit**, not just the lesson plan. Its report records tested objectives, stage evidence and whether material was really taught.
- Run 2 authors new passages, prompts, questions, task situations, answers and rubrics. Do not reuse or cosmetically modify any previous Start/Explore/Challenge/Practice/Exit or old assessment. An automatic similarity check is only a first filter; independently inspect semantic duplication.
- Run 3 produces the **public pupil paper JSON and HTML** separately from **private adult marking JSON**; preserve royal-blue student template and its locked functionality. `English production/Assessment Studio/` contains generic schema/demo content only, NEVER live pupil responses or real current papers' secret answer keys.
- Run 4 verifies originality, teacher-coverage alignment, sources, all mark totals, rubric alignment, desktop/mobile keyboard/accessibility and submission/parent marking paths. Do not claim GOLD on a standalone preview.

## Canonical reference assets
- **Assessment:** `English production/Assessment Studio/NOVA-ENGLISH-ASSESSMENT-STUDIO-TEMPLATE-v1.0.html` and `NOVA-ENGLISH-ASSESSMENT-PARENT-REVIEW-TEMPLATE-v1.0.html`.
- **Normal teaching:** `English production/NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.2.html` and latest approved English teaching contracts.
- **Reviewer warning:** Both assessment v1.0 and teaching v2.2 are candidates until full browser/website QA. The parent's HTML by itself does **not** enforce server authorisation. Actual private keys must never be checked into the public repository.

## Examples
- `English production yr7 - 014` → **TEACHING LESSON**.
- `English production yr7 - 015` → **ASSESSMENT**; audit lessons 001–014.
- `English production yr7 - 016` → **TEACHING LESSON** (the novel unit begins).
- `English production yr8 - 046` → **ASSESSMENT**; audit previous poetry unit.
- `English production yr9 - 080` → **ASSESSMENT**; combined paper.

## Source-control rule
Never push to `main` directly. Make reviewed changes on a dedicated branch/PR only after user directs GitHub upload. Existing English teaching prompts, lesson files and master remain unchanged except for a narrowly scoped routing entry-point note after review.