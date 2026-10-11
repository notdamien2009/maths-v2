# NOVA Maths F6 · Run 01 — Ratio Table

**Status: built · REVIEW CANDIDATE · owner GOLD approval pending.**

## Open and review
Open `F6/F6-01-ratio-table.html` in your local browser. The HTML is self-contained and includes F0 Neon Tube + NOVA Chalk assets and runtime.

## Install this run into your existing repository folder (do not overwrite the core)
Extract this ZIP and merge the top-level `bank-v3-neon-chalk` folder into your current bank. All files are additive: `F6/`, `src/`, `build/build-f6-01.py`, `build/F6-01.src.html`, `tests/`, `docs/` and `prompts/F6/`. It DOES NOT contain `core/`, `build/build.py`, other families or old screenshots. No GitHub operations have been performed.

For a bank-core-specific rebuild, from inside your bank root run:

```bash
python build/build-f6-01.py
```

The builder will use your existing `core/nova-core.js` and `.css` without modifying them.

## How the engine works
- **Watch:** 6 narrated steps, staged ratio-table evidence.
- **Guided:** back/next/replay/scrub using the shared F0 timeline.
- **Explore:** seven presets; drag ×/÷ multipliers onto each column, drag number tiles into answer cells, remove via red zone, keyboard Enter and buttons, Undo and Reset.
- **Challenge:** four independently marked tasks; multiple possible errors produce specific guidance rather than revealing answers.
- Inverse preset explicitly uses multiplication on one side and division on the other, preserving the product.

## QA that is actually confirmed
- Syntax check: `node --check src/F6-01.js` — PASS.
- Registration: `node tests/test_f601_registration.js` — PASS (seven presets and six steps).
- Mathematical sweep: `python tests/math_f601.py` — **1039/1039 PASS**.
- Build: F6 standalone HTML successfully built against the inherited NOVA F0 runtime.

## QA awaiting execution
- The supplied environment enforces Chromium `URLBlocklist=*`. Attempted file and localhost browser navigation returned `ERR_BLOCKED_BY_ADMINISTRATOR`, so there are **no genuine browser screenshots or pointer-drag test passes** in this run.
- On a normal browser environment, run `python tests/qa_f601.py` (Playwright required); this saves 8 real screenshots under `shots/F6/` and checks modes and basic answer handling.
- See `F6/QA-REPORT.md` for a candid acceptance list. Owner sign-off and lesson shell integration remain outstanding.

Do not proceed to F6-02 until this run is visually reviewed and accepted.
