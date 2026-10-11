# NOVA F4 Run 06 · F4-06 Percentage Bar · Premium Review

**Status:** Complete review candidate, awaiting owner GOLD approval. Do not modify or push GitHub without specific owner instruction.

## Merge into your local folder
Extract `bank-v3-neon-chalk/` into the same existing local `bank-v3-neon-chalk/` folder. The archive includes **only F4-06 additions** and leaves F0, F1, F2, F3, F4-01..05, F5 and the shared `core/` untouched. Open `F4/F4-06-percentage-bar.html` in a browser (self-contained, no network needed).

## Included
- `F4/F4-06-percentage-bar.html`: offline-ready standalone visual engine with inlined canonical core.
- `src/F4-06.js`, `src/F4-06.css`: editable local component source.
- `build/F4-06.src.html`, `build/build-f4-06.py`: deterministic source build (expects the **already present** verified F0 core at `core/nova-core.js|css`).
- `docs/F4-06-SPEC.md`: build and lesson intent; `QA-REPORT-F4-06.md`: actual QA results and gates.
- `shots/F4-06/`: screenshot evidence for Watch/Guided/Explore/Challenge at 380/1280, plus >100% and reverse.
- `tests/test_f406.py`, `tests/test_f406_drag.py` plus machine-readable results.

## Rebuild (optional)
From the merged local `bank-v3-neon-chalk/` directory:
```
python build/build-f4-06.py
```
The script verifies the exact core JS/CSS SHA-256 values. It refuses to silently replace or use a different core. If your local core has changed since the source reference was locked, review compatibility first.

## Dependencies and ownership
No new styles, external libraries or mascots. F0 and the F2 neon/chalk representation remain the canonical dependencies. Owner reviews HTML and ZIP and personally controls any Git push. **The review status is not GOLD.**
