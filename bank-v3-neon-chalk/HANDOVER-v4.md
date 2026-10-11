# NOVA Maths Visual Bank — Current Handover v4

**Audit snapshot:** 11 October 2026, `main` tree `da475d2753ea97c784be7705a9d72902024de48e` (before this local repair).  
**Ownership:** local-first; the owner checks ZIPs and decides whether and when to push to GitHub. Do not push or overwrite approved visual engines without explicit permission.

## Authoritative production documents

1. **ONE editable master:** `00-master/nova-master.html` — 19 families, 281 visual IDs, 202 lesson entries, 18 assessment briefs.
2. `00-master/nova-master-updated.html` — redirect only. **Never edit this as a second master.**
3. `00-master/NOVA-MASTER-FOR-OTHER-AI.md` — generated portable export. `node tools/export_master_prompts.js` recreates the entire prompt document from the canonical HTML, and embeds its SHA-256. `node tools/export_master_prompts.js --check` detects drift.
4. `F5/F5-FRACTION-NOTATION-LOCK.md` — definitive fraction design decision. The older fraction-TBD instructions are obsolete.
5. `docs/README.md`, `docs/MASTER-GOVERNANCE.md`, `docs/PRODUCTION-SOURCE-MAP.md` — current project navigation and source rules.

## Immutable visual and mathematics design

- Approved design reference: F0 foundational core, especially F0-02; premium family references include F1/F2 and the reviewed F3 components. Preserve the premium stage, background, Neon Tube apparatus and NOVA Chalk written maths, original NOVA colours, mascot dock and four teaching modes.
- **Fractions are LOCKED:** show traditional mathematical fractions, with numerator above a horizontal fraction bar and denominator below; use NOVA Chalk and approved mathematical colours. Inline n/d only in space-constrained controls, not for primary mathematics or equations. Existing owner lock supersedes any earlier TBD reference.
- Number lines and draggable mathematical objects must use accepted shared-core implementations, not improvised replacements. There are known divergence risks between checked-in `core/` and compiled reference previews; see `docs/CORE-INTEGRATION-GATE.md`.
- Pip, Nova and Izaac poses in reviewed engines are native helper artwork embedded through the core. Historical prompts reference unavailable source folders (`assets/helpers/pip/pack80/`, etc.). Use only the native core helper API until external pose packs are sourced and approved; see `assets/helpers/registry.json`.

## Current tracked-production snapshot (file inventory, NOT GOLD certification)

| Family | Engine-ID state as tracked | Qualification |
|---|---|---|
| F0 | 17 files present | Baseline foundation; prior owner approval is recorded for certain components |
| F1 | 10 canonical engine files present | F1-04 and F1-12 are presets of F1-01 |
| F2 | 15 canonical engine files present | F2-04 is a preset; F2 ongoing polish/review independent of source inventory |
| F3 | 15 files present | High-quality review builds, stress testing pending/ongoing; NOT blanket GOLD |
| F4 | 10 canonical engines present | F4-05, F4-10 are designated presets |
| F5 | 15/16 canonical standalone files present | F5-08 is represented by F5-03 shared-engine metadata, but the HTML master still lists it separately. Resolve its ID/alias contract before claiming completion |
| F6 | 10/11 canonical engines present | F6-07 physical engine absent; F6-08, -12, -13 are dependent presets with preview/integration records |
| F7 | 7/8 canonical engines present | F7-06 physical engine absent; other designated IDs are presets |
| F8 | 6/15 canonical standalone engines present | F8-01..08 tracked including F8-02/-04 presets; remainder not yet present |
| F9 | 2/13 present | Work underway, review builds |
| F10 | 2/20 present | F10-01 and -02 review builds; no blanket approval; styling/integration concerns documented |
| F11 | 0/11 canonical engines | Planned; 2 IDs are presets |
| F12 | 15/15 engines present | Physical files complete; no blanket GOLD status inferred |
| F13–F18 | Not yet populated as canonical engines | Planned future production; some ids mapped as presets elsewhere |

### Caution about preset IDs

The master defines 281 IDs, of which 26 are aliases/presets. Only 255 canonical standalone engines are expected. Do not mark a preset 'missing' solely because it has no separate HTML. Do **not** conflate a gallery preview with an integrated parent engine. The file inventory at the audit snapshot contained 124 of 255 canonical engines; that is a stocktake, not approval or browser-QA evidence.

## Runtime/core concern requiring a separate gate

The checked-in `core/nova-core.js` predates functionality used by compiled F2/F3/F9/F10 review pages (notably `NOVA.numberLine`, `NOVA.ui.svgDrag` and a motion API). A review HTML embeds a different/later runtime and cannot be assumed to rebuild byte-identically from the current checked-in core.

This repair pack **does not modify** the central core, any F0–F18 engine HTML or the running JS/CSS of existing lessons. It ships a static API-presence test, the authoritative reference paths, and a generated audit report. Reconcile missing APIs from approved source and run maths/browser/drag/keyboard/responsive regression before any later integration. Do not use an invented compatibility shim merely to make a check pass.

## Production and QA procedure

1. Read canonical master + fraction lock + current handover.
2. Design/build a single requested visual ID or small micro-batch, grounded in actual F0/F1/F2/F3 files.
3. Output the replacement files as a ZIP for local owner review. Never push without express permission.
4. Test mathematical correctness, Watch/Guided/Explore/Challenge, 380px/1280px, pointer drag/re-grab/cancel, keyboard, mobile layout, mascot state, narration and reduced motion.
5. Keep QA evidence for review and provenance but archive old screenshots/ZIP packages separately when retired. A QA JSON or a `PASS` line by itself does not certify GOLD.
6. After editing the master: `node tools/export_master_prompts.js`; `python prompts/specs/gen.py`; then run their `--check` options. This prevents master/export divergence.

## Historical documentation

`HANDOVER-v3.md`, run-specific READMEs and dated QA reports are provenance, not current build instructions. The original descriptions of pending uploads and F1 yet to start are historical. `docs/README.md` is now the up-to-date navigation file. Never discard original acceptance/testing evidence without archiving it.
