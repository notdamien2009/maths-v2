# NOVA F7 Run 03 — Collecting Like Terms

**Review candidate, not owner-approved GOLD.** F7-01 and F7-02 are unchanged. The archive contains only incremental F7-03 files, plus its screenshots, QA and instructions. No GitHub edits have been made.

## Open the interactive component
Open `F7/F7-03-collecting-like-terms.html` in a local browser. It is fully self-contained and does not load remote libraries, images or fonts.

## Incorporate into an existing `bank-v3-neon-chalk` folder
Copy/merge the `F7`, `src`, `build`, `tests`, `shots` and `docs` folders under the repository's existing `bank-v3-neon-chalk` folder. **Do not replace `core/nova-core.js` or `.css`**; the ZIP does not include them.

For a rebuild: run `python build/build-f7-03.py` from any location. It reads the existing `core/nova-core.css`, `core/nova-core.js` and the F7-03 source/template to recreate the compiled HTML. For a full bank build you can later register the same source in the existing master build workflow *after you review it*.

## Visual and learning controls
Four modes: Watch, Guided, Explore and Challenge. In Explore pupils sort mixed algebra tiles into x², x and unit groups, undo, reset, switch examples and return a tile. Negative terms retain red hatching. Challenge requires sorting **and** a correctly simplified written expression.

Keyboard: focus a tile, then press **1** for x², **2** for x, **3** for units, or **R** to return. The buttons below provide a non-drag alternative. Sir Bob receives per-step narration from the canonical F0 mechanism; mascots retain the F0 helper art and brief captions.

## QA and approval
Run `python tests/qa_f703.py`, `python tests/interaction_f703.py` and `python tests/stress_f703.py`. Requires local Playwright and Chromium. See `QA-REPORT-F7-03.md` for completed results, screenshots and limitations. Only user review can mark this GOLD.
