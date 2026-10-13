# NOVA F11-01 + F11-02 — Stage / Drag Repair (12 October 2026)

## Status
**Premium repair candidates — awaiting owner stress-test and approval.** Both originals replaced in this ZIP. **GitHub unchanged.** The F0/F1 shared core, the shell, fonts, visual tokens, themes, Bob tutor and four modes remain intact.

## Fix 1 — mascot inside blue learning stage
The *existing F0/NOVA helper strip* is now mounted within `.f111-theatre` / `.f112-theatre`, not outside the teal-framed learning stage. Stage-scoped CSS reserves a dock row at the bottom within the outline for the speech bubble and mascot, at both 380px and desktop. There is no unwanted central row; all mathematical cards and control sections remain otherwise unchanged.

## Fix 2 — genuinely responsive angle dragging
The old implementation called `NOVA.ui.svgDrag` — the shared **tile** drag helper with an intentional 38% easing offset and an update only after drop. That makes a rotating arm feel laggy and disconnected from its mathematical drawing.

The new **component-scoped rotary adapter** retains the canonical core's SVG apparatus and drawing functions, but uses pointer capture plus one `requestAnimationFrame` update per video frame to preview the **whole ray/arc/handle geometry while moving**. It commits the snapped angle once on pointerup, updates linked UI values, and supports 1° or 5° snapping and keyboard arrows. Pointercancel, Escape, blur, and scroll restore the previous value. The pointer stays captured across quick changes of direction, including fast jumps. No F0 core functions are overridden, and no new shared graphics/style primitives have been invented.

- **F11-01**: Explore and construction-task movable protractor arm; linked stage readout, Explore slider, and Challenge slider stay synchronised.
- **F11-02**: Explore actual-angle arm and independent estimate marker, plus Challenge estimate marker; prediction stays hidden until reveal or answer checking.

## Installation
Extract this ZIP into your local **maths-v2** repository so its `bank-v3-neon-chalk/` folder merges into the matching folder. Replace only these F11-01 and F11-02 files. **Do not copy/replace the `core/` directory** — none is included in this ZIP. The built self-contained HTML files work directly in a browser. The included builders are for your existing approved shared core and intentionally refuse to rebuild without that core present.

## Quality assurance
- **82 / 82** base desktop/mobile checks passed: all four modes, within-frame docks, non-stranded live fast drag, pointer capture release, Escape rollback, and no uncaught browser errors.
- **14 / 14** additional Challenge tests passed: mouse-drag construction of 110° in F11-01, mouse-drag estimate of 63° in F11-02, both accepted by the assessment engine, plus control-state synchronisation on both viewport widths.
- Screenshots included for Watch / Explore / Challenge at **380px and 1280px** for both engines.

**Known separate feature**: The reason explanations in Challenge remain native accessible selection controls; drag-and-drop reason cards are not added by this focused repair. This ZIP repairs existing mathematical arm/marker dragging rather than changing the Challenge user interface.

## Extracted files
- `F11/F11-01-protractor.html`
- `F11/F11-02-angle-estimator.html`
- `src/F11-01.js`, `src/F11-01.css`
- `src/F11-02.js`, `src/F11-02.css`
- `build/F11-01.src.html`, `build/build-F11-01.py`
- `build/F11-02.src.html`, `build/build-F11-02.py`
- `shots/F11-01/*-fixed.png`, `shots/F11-02/*-fixed.png`
- `tests/F11-01-F11-02-REPAIR-QA.json`, `tests/test_f11_repair.py`, `tests/test_f11_challenge_drag.py`
- `F11/F11-01-02-REPAIR-README.md`, `tests/F11-01-02-REPAIR-MANIFEST.json`

### Approval
Do not label this GOLD or push it to GitHub until it is owner-approved. If anything still feels slow on the user's own browser or touch device, send back that exact condition and repair only the observed issue.
