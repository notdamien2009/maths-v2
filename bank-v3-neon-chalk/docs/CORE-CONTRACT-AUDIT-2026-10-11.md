# NOVA Core Contract Audit (local checkout)

Generated UTC: 2026-10-11T22:06:45+00:00

This is a static API-presence check, NOT a substitute for browser regression, keyboard, mobile or mathematical QA.

| Contract | Checked-in core | F3-01 compiled review reference |
|---|---|---|
| Number-line constructor | **ABSENT** | Present |
| Drag-and-drop API | **ABSENT** | Present |
| Motion API | **ABSENT** | Present |
| House-style lock | Present | Present |
| Narration hook | Present | Present |
| Native helper dock | Present | Present |

**Interpretation:** A compiled preview can work because it contains a later embedded runtime while `core/nova-core.js` still lacks some APIs. 
Do not copy the entire compiled F3 runtime over the central core. Its implementation diverges from the checked-in shared core; a replacement requires a focused reconciliation, tests and owner approval.

**Next step:** Treat missing APIs as an explicit integration blocker for new builds, not as permission to invent fresh drag/number-line primitives. Recover the exact approved implementation from the reference and review a minimal compatibility patch separately.

This repair pack changes no canonical core bytes and produces no new standalone engine.
