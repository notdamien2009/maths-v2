# NOVA F8 — Run 11 · Inequality Solver

**Premium review candidate — NOT GOLD. GitHub was not modified.**

## Installing

Extract this ZIP into the folder holding your existing `bank-v3-neon-chalk/` directory. It adds only the F8-11 component and associated proof/QA artifacts. It does **not** include or replace `core/`, previous F8 files, the master document or any approved components.

1. Open `bank-v3-neon-chalk/F8/F8-11-inequality-solver.html` to inspect the standalone preview (tested in headless in-memory Chromium; Windows Edge `file://` requires your confirmation).
2. To compile against your actual existing local F0 core: `python build/build-f8-11.py` from the bank directory. That program uses `core/nova-core.js` and `core/nova-core.css` without changing them.
3. Review Watch / Guided / Explore / Challenge and the six named presets. Inspect mobile and desktop screenshots under `shots/F8-11/`.
4. Rerun tests from the existing bank root (or adapt paths) using `python tests/math_f811.py`, `python tests/browser_f811.py`, `python tests/stress_f811.py`, `python tests/traps_f811.py`, `python tests/width_f811.py`.
5. Do not treat the component as GOLD until you approve and test against your current GitHub-main core.

## Key files

- `F8/F8-11-inequality-solver.html` — standalone compiled preview.
- `src/F8-11.js` and `src/F8-11.css` — editable engine and component style.
- `build/F8-11.src.html` and `build/build-f8-11.py` — deterministic local-F0 compiler.
- `F8/F8-11-manifest.json` / `F8/F8-11-gallery-entry.json` — registry/gallery metadata, no master file overwrite.
- `docs/F8-11-SPEC.md`, `docs/F8-11-QA-REPORT.md` — design and evidence.
- `tests/F8-11-*-results.json`, `shots/F8-11/*` — verification output.

Fraction notation uses the already approved traditional stacked NOVA Chalk rule if fractions are later added; no old TBD placeholder is included.
