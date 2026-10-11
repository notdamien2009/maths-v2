# NOVA F7 · RUN 01 · F7-01 Algebra Tiles

**Built and tested. Owner visual review pending. Not GOLD.**

## Preview first
Open `F7/F7-01-algebra-tiles.html` in Chrome/Edge. It is a complete standalone HTML with original F0 core CSS, fonts, JS and mascot helper strip already embedded; internet access is not needed.

The four modes work: Watch, Guided, Explore, Challenge. Explore's six tile trays drag into the correct x²/x/1 lanes. Placed tiles drag to Flip sign or Remove. Challenge has four graded algebra proofs. Keyboard support is also included.

## Updating the repo yourself (no automatic Git operations)
Copy only these paths into the **existing** `bank-v3-neon-chalk` folder, preserving the top-level directory:

- `F7/F7-01-algebra-tiles.html`
- `src/F7-01.js`, `src/F7-01.css`
- `build/F7-01.src.html`, `build/build-f7-01.py`
- `docs/F7-01-SPEC.md`
- `tests/qa_f701.py`, `tests/interaction_f701.py`, `tests/stress_f701.py` and JSON test results
- `shots/F7-01/` plus `QA-REPORT-F7-01.md` and this README

**Do not overwrite** `core/nova-core.js`, `core/nova-core.css`, F0, F1, F2, F3, F4, F5 or existing `build/build.py`. This ZIP includes none of those.

To recompile F7-01 from its editable source on the destination PC, run from the bank root:

```
python build/build-f7-01.py
```

The incremental builder reuses the bank's **current** canonical core automatically. No duplicate core files are shipped. A later family integration build may register F7 sources in the master build workflow after review.

## Review checks
Compare typography, glass depth, tile size, maths signs, animations, helper strips and all four modes at 380px and desktop. Only once you approve the engine is it GOLD. F7-02 is the next separate prompt/run.
