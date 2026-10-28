# NOVA Explore VNext — Pilot Batch 001 (development)

**Branch:** `nova/explore-f0-f18-vnext-2026-10-28`  
**Workspace:** `NOVA-EXPLORE-UPGRADES/`  
**Status:** Code added; source and pure-maths checks PASSED; integrated browser testing PENDING. **NOT production-approved.**

## Components upgraded
- **F9-01** — next-stage numerical prediction, deliberate wrong-answer feedback, shared-side reasoning selection, keyboard Enter to check, change-of-stage resets; original stage slider, diagram, Watch, Guided and Challenge retained.
- **F12-14** — native-controls investigations: greatest area at fixed whole-number perimeter, least perimeter at fixed area/whole-number sides, and same-area/different-perimeter counterexample; mode changes update task; Watch, Guided and Challenge retained.

## Source fidelity evidence
- F9-01: original 1221958 chars → candidate 1226035 chars; unchanged source following Challenge entry, original title intact, one Explore mission and one scoped stylesheet verified.
- F12-14: original 1229079 chars → candidate 1232937 chars; unchanged source following Challenge entry, original title intact, one Explore mission and one scoped stylesheet verified.

- Original files under `NOVA-production/` were **not** edited. Both changes exist in the independent candidate copies only.
- `BASELINE-MANIFEST.json` remains a snapshot of original production blobs. `WORKING-STATE.json` records candidate blob SHAs and current development status.
- These are additive Explore-only tasks; no dependency on a hosted API or new fetch is required.

## Tests performed
1. Source/tree inspection and new mission presence: PASS.
2. Original Challenge function and all downstream file bytes: unchanged: PASS.
3. Next-stage 3n+1 totals (stages 1–8): PASS.
4. Fixed-perimeter maximum-area search for all seven allowed perimeters: PASS.
5. Fixed-area factor-pair search for all five allowed areas: PASS.
6. A=8×2 and B=4×4 counterexample: PASS.

## Tests still required before acceptance
- Syntax execution and real browser interaction through native component host.
- Visible/usable in the actual Maths V2 Explore tab; no duplicate UI from remount or Restore.
- Keyboard focus order, screen-reader label/status and reduced-motion.
- Small-mobile and tablet controls, no overlap/cropping or horizontal scrolling.
- Original native Watch, Guided, Challenge regression in representative lessons.
- State cleanup and rerender semantics on mode and preset changes.
- Narration/audio where invoked; no interference with Bob Board.
- Real integration and version/hash updates via a **separate approved** lesson-upgrade process.

## Next batch
Resolve any pilot issues before extending the shared mission pattern to F1/F5/F10 and remaining F0–F18. The full original library remains available as rollback.
