# RUN 3 — Assemble Lesson HTML with NOVA English v2.0 (Global)

## Source of truth
Use **unmodified** `NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.2.html`, the approved Run 2 full JSON, `NOVA-ENGLISH-INSERT-AND-VALIDATE-v2.2.py`, Run 1 route, and v2.0 global contract. Verify input hashes and source version. Never use the filled Y7-001 HTML as a base for another lesson, and never substitute screenshots of broken activity engines for interactions.

## Build
- Preflight `meta.year`, `meta.lesson`, `meta.websiteRef`, `meta.templateMode=false`; confirm exact lesson scope and accepted canonical `challenge.type` from the normalized map (review any Run1 override).
- Populate only the `novaLessonData` JSON slot via the included insertion script. Avoid ad-hoc search/replacement across JS/CSS that damages unrelated lessons. Keep valid HTML/JSON escaping.
- Preserve exact original **seven-page structure**, one Bob Board; 750px locked desktop board with controls fixed; the approved royal-blue theme; no pale passage boxes; no double Learn; keep native Explore and Examples workbenches and their controls.
- Preserve one website-controllable mascot selector and fixed boxed Pip/Nova/Izaac positions inside Bob Board, Explore, Examples and appropriate Challenges. Correct approved Nova reading sprite; no pointer SVG line or roaming actor. Cue actions must be data-driven and not inherit Y7-001 text.
- Keep Ryan TTS preference and existing narration controls; report if actual speech playback/sync cannot be evaluated. No claim of voice QA based on static script syntax.
- A specialised studio family that cannot represent the planned task **must be piloted as a shared-engine candidate**; do not write a weak substitute inside lesson JSON and call it done. Keep current master unchanged until regression-tested and user-approved.
- Protect assessment type, responses, hints, scored attempts and pending-review writing semantics. Preserve website-facing student progress IDs / spelling bank IDs without claiming live sync.

## Execute / output
Example command:
`python NOVA-ENGLISH-INSERT-AND-VALIDATE-v2.2.py --template NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.2.html --data Y7-008-R2-LESSON-DATA.json --output NOVA-ENGLISH-Y7-008-R3-REVIEW.html`

Produce standalone `.html` plus `Y{year}-{NNN}-R3-BUILD-REPORT.md` containing input names + SHA256, route, validation output, asset/runtime integrity, known untested behaviours and stop conditions. Run local JS syntax, DOM smoke checks and every page. Build is not GOLD without Run 4.

**v2.2 assembly gate:** Confirm exactly 5 Start warm-ups, 15 Practice and 5 Exit individual tasks; enforce one credit per Practice/Exit question. Insert data using the matching v2.2 validator/master pair only. On Challenge render inspect the `.rd-mission-panel` vertical layout: source above task, full-width textarea for writing, checklist below, action buttons and feedback visible. Include all four task kinds in shared-engine regression before releasing an updated master; check 1360/1024/768/390 widths. A paragraph is one question. Never work around a shared CSS defect by mutating per-lesson HTML.

