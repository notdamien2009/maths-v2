# NOVA F5-06 — Fraction Simplifier · Magnetic Group Forge

Next Premium Edition review candidate after F5-05. Retains the locked NOVA Neon Tube + Chalk look and F0/F1/F2 shared helpers.

## Files
- `F5/F5-06-fraction-simplifier.html` — open directly in a browser; self-contained.
- `build/F5-06.src.html` — template using `@@CSS@@` and `@@JS@@` for the current shared core.
- `src/F5-06.js` and `src/F5-06.css` — editable component logic and local styling.
- `build/build.py` — registers F5-06 alongside existing F5-01…F5-05.
- `tests/qa_f506.py`, `tests/stress_f506.py` and JSON results — browser QA scripts/evidence.
- `shots/F5/F5-06-*.png` — browser screenshots.

## Teaching
Amber = original fraction parts; green = regrouped larger pieces; cyan = draggable lasso and common-factor selection. The upper and lower bars have the same whole width, the same shaded endpoint and mathematically exact grouping. A factor is refused unless both the numerator and denominator divide exactly. Challenge hides the answer and asks for simplest form.

## Rebuild
From bank root run `python build/build.py` (the original F0 templates in this package are provided to support the builder).

## Status
Functional browser QA passed; awaiting owner GOLD review. Do not overwrite prior approved F5 source or push to GitHub without explicit permission.
