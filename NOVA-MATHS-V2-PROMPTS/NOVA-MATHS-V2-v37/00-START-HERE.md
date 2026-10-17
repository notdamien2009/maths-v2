# NOVA MATHS V2 — LESSON-FIRST PRODUCTION v37.0
**Release:** 17 October 2026 · initial trial prompt pack · replaces the old v35.3/v35.4 prompt workflow for NEW lesson builds.

## The production principle
**The curriculum decides WHAT mathematics to teach. The lesson architect decides HOW to teach it. The NOVA Production components provide the mathematical apparatus. The approved seven-page template provides the lesson structure.**

This is a fresh workflow, NOT another override pasted on top of the old strict-fidelity prompts. Do not concatenate v35.3/v35.4 prompts with v37.0; they contain superseded five-stage, per-concept Challenge and assessment instructions. Retain only the uncontradicted protections of source quality, mathematical correctness, accessibility, F0-12 authenticity and original styles.

## Source locations (saved ChatGPT Library)
`/NOVA-MATHS-V2-PRODUCTION-SNAPSHOT-2026-10-17/QUICK-ACCESS/`
- `NOVA-MASTER-CURRICULUM-LOCKED.html` — curriculum and objective.
- `MASTER-COMPONENT-MAPPING-LOCKED.json` — MAP / AL original component identities and presets.
- `NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html` — approved seven-page v37 FINAL shell; locked 700px Bob Board.
- Older derived v35.1 template and v35.3 prompts are LEGACY reference, **not** the v37 build shell or production instructions.

`/NOVA-MATHS-V2-PRODUCTION-SNAPSHOT-2026-10-17/SOURCE-ARCHIVES/`
- Archived original NOVA-production F0–F18 component library, original F0-12 controller and supporting runtime. Use local verified sources; do not pull live GitHub to build each lesson.
- Do not modify these source archives or the originals in Library/GitHub. No direct Git pushes; user reviews deliverables before any repository update.

## Execute ONE RUN per user command
Read `00-SHARED-LESSON-CONTRACT-v37.md` plus exactly the requested run prompt and the relevant previous run outputs.
1. `01-RUN1-LESSON-ARCHITECT.txt` → lesson plan and visual route.
2. `02-RUN2-TEACHING-AND-ASSESSMENT.txt` → complete instructional scripts and question/data pack.
3. `03-RUN3-BUILD-HTML.txt` → single full lesson review HTML and build/provenance records.
4. `04-RUN4-GOLD-QA.txt` → test, repair and deliver final lesson HTML with honest test evidence.

Keep **one lesson per chat by default** for quality. Never advance to the next run or lesson without a request. Output separate files for each run. Do not report a file as created unless it genuinely exists and has been linked.

## Final template compatibility — resolved on 17 October 2026
The canonical `NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html` has been repaired in BOTH GitHub template locations and in Library QUICK-ACCESS, and is also saved in this v37 production pack.
The template now directly supports Start 5 (S1,S2 visuals; S2,S3 MCQ), Practice **15 split 5/5/5** (visuals P1,P2,P6,P11), Exit **5 split 2/2/1** (zero visuals), one Challenge of 10 plus five optional Stretch, exactly five completed Learn/Bob concepts, 4–6 Bob beats per concept, and the desktop Bob Watch board remains **700px**.
All relevant template JSON contracts, validator assertions, question slots, tier splits, progress counters and Exit guidance have been updated. The top-level assessment progress counter is **25** for Start + Practice + Exit; Challenge tracks its 10 or 15 game rounds separately through F0-12.

**Important:** Run 3 MUST NOT reapply an old 10-to-15 practice compatibility patch or bypass these validators. Clone the current verified template and populate lesson-specific data only. See `05-TEMPLATE-COMPATIBILITY-AND-PREFLIGHT.md` for regression checks.

## Deliverable naming
For lesson `Y7-001` (substitute actual code):
- Run 1: `Y7-001-R1-ARCHITECTURE.md` and `Y7-001-R1-COMPONENT-ROUTE.json`
- Run 2: `Y7-001-R2-TEACHING.md` and `Y7-001-R2-LESSON-DATA.json`
- Run 3: `Y7-001-R3-REVIEW.html`, `Y7-001-R3-BUILD-REPORT.md`, `Y7-001-R3-PROVENANCE.json`
- Run 4: `Y7-001-FINAL.html`, `Y7-001-R4-QA-REPORT.md`, `Y7-001-R4-EVIDENCE.json`

Status is **TRIAL / REVIEW** until the lesson passes Run 4. There is no automatic GOLD designation.