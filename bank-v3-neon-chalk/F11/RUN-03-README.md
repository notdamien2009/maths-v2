# NOVA Maths F11-03 — Angle Facts — Premium Review Candidate

**Status:** Built for the owner to inspect. **NOT GOLD-approved. GitHub untouched.**

## Production basis
- Uses the same embedded, *unchanged* `core/nova-core.css` and `core/nova-core.js` as the repaired F11-01/02 build. Core source is **not included in this incremental ZIP**; the complete standalone HTML already embeds the core.
- Neon Tube apparatus / NOVA Chalk drawing and working text; NOVA core shapes, arcs, lines, rings, scene helper, engine mount, four modes and Sir Bob hook.
- Canonical main-stage navy/teal background; large **F9-scale** Nova helper stays **INSIDE** the stage (desktop 150px dock figure, mobile 109px), with the dock bubble in-frame. No duplicate second stage mascot.
- The source is additive; no shared font, drawing helper, drag engine or shell override. Rotary drag is component-scoped and uses pointer capture + rAF updates, not the delayed tile easing.

## Learning interactions
- **12 teaching stages** from straight-line totals to proof, each with purpose-written narration and a relevant helper pose.
- **7 named presets:** straight line; full turn around a point; vertically opposite angles; corresponding/alternate angles in parallel lines; triangle interior angles; three-figure bearings; geometric reasoning/proof.
- **Explore:** rotate a ray/whole crossing line/transversal/bearing arm, or move the triangle apex. Mathematical geometry redraws on release; the live moving shape follows immediately during drag. Arrow keys and range sliders where appropriate.
- **Challenge:** eight tasks requiring both exact numerical answer and valid angle reason. Cards work by direct pointer drag onto the answer target OR click/keyboard choice. Misconception-specific feedback includes supplements mistaken for opposite/corresponding, and wrong totals.
- Captured pointer, direct live movement, Escape cancellation and release with no stranded pieces.

## Output files
- `F11/F11-03-angle-facts.html` — immediately openable self-contained HTML, fully offline.
- `src/F11-03.js` / `src/F11-03.css` — editable component files.
- `build/F11-03.src.html` / `build/build-F11-03.py` — reproducible builder using the existing installed NOVA shared core.
- `tests/*.py`, `tests/*.json` — browser QA scripts and evidence.
- `shots/F11-03/*.png` — desktop/mobile images of each mode and representative presets.

## Install after approval only
Extract the ZIP so its top directory merges with your existing `bank-v3-neon-chalk/`. Do not copy any new `core/` files; no core files are included. From the bank root, rebuild (only this engine):

```
python build/build-F11-03.py
```

The builder reads the current locally installed `core/nova-core.js` and `core/nova-core.css`; do not replace them. Inspect and stress-test the standalone engine first, then decide whether to push GitHub yourself.

## Quality checks
- `test_F11_03.py`: **96/96**
- `test_F11_03_drag_cards.py`: **12/12**
- `test_F11_03_fast_drag_all.py`: **32/32**
- **Total 140/140 scripted checks**, at 380px and 1280px.
- Tests include no JS errors, inherited chalk font/background, all four modes, stage/mascot containment, seven presets, live fast drag and cancellation, eight exact answer/reason submissions, drop zone selection, incorrect-reason rejection, and full-solve completion.

## Scope boundaries
- This is **F11-03**, not the full F11-11 angle chase or F11-13 proof stepper (future separate engines/presets).
- Needs owner visual and real-device stress test before GOLD status. The screenshot captures are evidence, not owner approval.
