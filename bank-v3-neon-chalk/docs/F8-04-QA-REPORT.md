# F8-04 · Two-way Function Machine — evidence-based QA report

**Status: PREMIUM REVIEW CANDIDATE. NOT owner GOLD. Not yet integrated into the NOVA live lesson engine.**

## Evidence and test results

| Gate | Evidence | Outcome |
|---|---|---|
| Mathematical rule correctness | `tests/math_f804.py`, `tests/F8-04-math-results.json`; -50 to +50 in half-step increments, three presets and reverse-order counterexamples | **1209/1209 PASS** |
| Live Chromium modes & interaction | `tests/qa_f804.py`, `tests/F8-04-browser-results.json`; Watch/Guided/Explore/Challenge, all six teaching steps, keyboard placement/removal, 3 challenge rounds, both 380px and 1280px | **130/130 PASS** |
| Fast real-pointer stress | `tests/stress_f804.py`, `tests/F8-04-stress-results.json`; real pointer 1–3-step drags, four wells, regrab, return zone, invalid-drop spring back, reset, clean internal drag state at 380px and 1280px | **34/34 PASS** |
| Additional widths | `tests/width_f804.py`, `tests/F8-04-width-results.json` at 430, 760 and 1920px in three modes | **9/9 PASS** |
| Render proof | `shots/F8-04-380-[watch,guided,explore,challenge]-stage.png` and 1280px equivalents | **8 mode screenshots captured** |
| Original engine identity | Built from **unmodified** `src/F8-03.js` whose SHA-256 is `0ac7273a5d04f8393ec692a7c2dc34f90113a5a7892792ee2def72e8a6c17843`; `build/build-f8-04.py` adds a preset only to its in-memory compilation | F8-03 source unchanged |
| Canonical drawing helpers | F8-03 `gear` reused; F0 `neonBox`, `neonPath`, `svg.arrow`, `chalkText`, `ui.svgDrag` and `motion.flash` called from `src/F8-04.preset.js` | No new core helpers, font or style system |
| Family gallery | `F8/F8-gallery.html` links F8-01, F8-02, F8-03 and the new F8-04 with its PRESET label | Included |
| Pupil screen hygiene | No developer code displayed outside `details.nv-dev`; mathematical values on NOVA Chalk canvas; step narration/mascot caption changes per step | Static and browser-checked |
| Mascots and narration | `NOVA.scene.helperStrip` with step-specific speech; `NOVA.helperImg('think'/'celebrate','teen')` for Izaac; timeline narration slot for each teaching stage | Source and browser checked |
| Accessibility | Card keyboard `1–4`, Enter, Delete, Backspace; numeric labelled inputs, reduced-motion checks, alt text on existing mascot sprites | Browser-checked; no physical screen-reader signoff |

## Notable implementation decisions

- **Preset, not engine:** F8-04 shares the F8-03 operation definitions, numeric evaluator, core helpers, engine ID, and renderer shell. In a standalone preview only the F8-04 presentation is mounted. It does not register a separate `F8-04` maths engine.
- **Mathematically accurate inverse:** the reverse route undoes machine 2 before machine 1. The `y=5(x+4)` variation explicitly demonstrates that brackets must come first.
- **Mobile board height:** compressed to remain within the shared core's SVG neon filter region, preventing low-stage glow and text disappearance at 380px. The main stage fills its allocated space with proof cards rather than blank bands.
- **Challenge gating:** input x is provided. y and recovered x are hidden until the four-operation sequence and both numerical entries have passed the check.
- **Local build:** ZIP contains no core replacement or F8-03 duplication. `build/build-f8-04.py` reads those four files from the already-installed working tree.

## Outstanding / GOLD blockers

1. Owner to open the standalone HTML in Windows Edge/Chrome, stress-test real touch/mouse, and approve its visual and interaction quality.
2. The preview runtime is the **Run 02 F8-03 local core snapshot** (SHA-256 `48400e5a068d3d3a36d76318e31accfb499a9fa7efe886498e5dc0caad6dc78b`), not yet byte-reconciled to the head of the GitHub `bank-v3-neon-chalk/core` directory. After extraction, rebuild with the owner's approved local core and rerun the tests. No shared-core changes are included or performed.
3. Native device touchscreen, physical screen reader and lesson-engine integration have **not** been verified.
4. `F8-03` and `F8-02` are previously delivered review builds; **none** is implicitly owner GOLD through this ZIP.

**No GitHub write was performed.**
