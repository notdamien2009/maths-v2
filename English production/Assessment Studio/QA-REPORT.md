# NOVA English Assessment Studio — Template v1.0 QA

**Decision:** WORKING REVIEW CANDIDATE; not GOLD-certified, not website-deployed.

## Verified 25 October 2026

| Test | Result |
|---|---|
| Template student JS and adult reviewer JS parsed by Node (`node --check`) | PASS |
| Four pupil papers have validated schema, unique IDs, sources, exact question-mark totals | PASS |
| Four adult-only schemes match paper IDs/versions/question maxima and have target and look-for criteria | PASS |
| Pupil file separates private scheme content; browser rejects papers containing private scoring field names | PASS (static plus code inspection) |
| Y7-015 student Begin → answer → navigate → review → locally submit | PASS |
| Question state remains while navigating without page reload | PASS |
| 1440px desktop: no horizontal document overflow, no observed page errors | PASS |
| 390px mobile: no horizontal document overflow, no observed page errors | PASS after shared layout repair |
| 390px mobile source view button opens/hides reading source | PASS |
| Load alternative poem, creative-writing, and drama profiles via public API | PASS |
| Adult reviewer loads student attempt and private guide, marks with partial credits, totals marks, enables report export only after all marked | PASS |
| Source `The Bell in the Reeds` and editing paragraph are original demonstration material | Authored for this template, not external publication-verified |

### Root-cause repair
Initial 390px paper overflow traced to CSS grid implicit minimum track sizing: the inner question navigation made the single-column layout expand to >600px. The shared breakpoint now uses `minmax(0,1fr)` and explicit min-width controls, not per-paper hacks. Re-tested zero overflow.

### Known open gates

- Persistent reload recovery on a real browser origin (automated browser sandbox blocked file/localhost navigation; its blank-page context denies localStorage). Browser-local save code is implemented but **not end-to-end reload-certified**.
- Actual school sign-in / adult role restriction / child cannot fetch adult keys. Source files are separated, but **not backed by authentication or backend API**.
- Deployed hand-in and server progress integration; the local submit is only a preview lock and exported attempt.
- Accessibility assistive-tech audit and exhaustive keyboard checks; tested responsive CSS and labels only.
- 18 actual curricular paper content sets have not been authored/audited; this is the reusable engine and four representative demos.
- Timer guidance is non-blocking. No enforced exam clock.
- Spoken-language recording and image evidence profiles are not implemented.

No site changes or Git pushes.