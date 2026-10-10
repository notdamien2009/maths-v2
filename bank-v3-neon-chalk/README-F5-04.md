# NOVA F5-04 — Premium Fraction Number-Line Preset

Open `F5/F5-04-fractions-number-line-preset.html` directly in a browser. The HTML is self-contained.

This is **F5-04 mapped to F1-01**, using precisely the same shared, locked `NOVA.numberLine` core primitive for both mathematical axes. It does **not** replace or modify the original F1-01 engine's HTML, which has its own earlier user interface and fraction placeholder. Full in-place F1 UI registration is a separate integration step.

## Edit / build
- `build/F5-04.src.html` is the editable source template (`@@CSS@@`, `@@JS@@`).
- `src/F5-04.js` and `src/F5-04.css` are convenience extracts of F5-04-only source. Edit the build template and regenerate these extracts if using them.
- `core/nova-core.js`, `.css` are the v3.6.2 shared engine with earlier drag pointer-capture fix. Never replace a later core automatically.
- `python build/build_f504.py` generates F5-04 standalone from one source and the shared core.
- The supplied `build/build.py` is the INTEGRATED bank builder update and requires the existing bank's F0/F5 source files. Do not run it on this minimal production ZIP by itself. Apply its new F5-04 entry into your full bank.
- `F5/F5-04-PRESET-MAPPING.json` records the canonical F1-01 alias mapping.

## Accepted notation
NOVA Chalk stacked fraction numerals/bar/denominator are locked by owner, replacing the historical TBD placeholder.

## QA
`tests/qa_f504.py`, `tests/stress_f504.py`, test logs and 380/1280 Watch/Guided/Explore/Challenge screenshots are supplied. See `F5/QA-REPORT-F5-04.md` for scope and remaining integration limitations.

Status: owner review candidate, NOT GOLD.
