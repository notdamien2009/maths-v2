# NOVA F5-18 · Premium Edition review candidate

Terminating or Recurring Decimal Sorter. This candidate keeps F0/F1 Neon Tube + NOVA Chalk, v3.6.2 shared core, and locked stacked fractions. Not GOLD until owner approval.

## Files
- `F5/F5-18-terminating-recurring-sorter.html`: standalone interactive HTML, no external assets.
- `build/F5-18.src.html`: page source and component-specific CSS with core placeholders.
- `src/F5-18.js`: editable engine logic.
- `build/build_f5_18.py`: self-contained reproducible build using the supplied core.
- `build/build.py`: **NOT included**; append the integration snippet below to the existing bank builder instead of overwriting it.
- `core/nova-core.js`, `.css`: matching official v3.6.2 core, unchanged from F5-17 bank.
- `shots/`: four modes at 380px and 1280px, plus sorted examples.
- `tests/`: portable Playwright QA scripts and test outputs.

## Mathematical contract
Reduce n/d first. A rational decimal terminates precisely when the denominator in lowest terms is `2^a × 5^b` (a,b ≥ 0), including denominator 1. Any other prime factor makes it recurring. Classifier uses integer arithmetic, never floating-point decimal comparisons. Interactive decks include unreduced fractions that catch the unreduced-denominator misconception.

## Interaction contract
- Explore: drag fractions to the correct glass bin; an incompatible bin rejects and springs back. Sorted cards can be re-grabbed and dragged to the red-marked original tray; keyboard arrow keys and Enter also work.
- Investigation: reduce, prime-factorise, classify in three progressively revealed stages.
- Challenge: three questions, answers hidden until submitted; Izaac reaction and teacher feedback.
- Six Watch/Guided stages, per-step helper captions and narration; reduced motion supported.
- Original bank and GitHub are not edited by this pack.

## Build
Run `python build/build_f5_18.py` in the extracted top-level `bank-v3-neon-chalk` folder. This uses `src/F5-18.js`, the page shell and the core. For integration into a full bank, add the block in `build/INTEGRATION-F5-18.txt` at the end of the existing `build/build.py`.

## QA
Final 380/1280 functional QA: 200/200 passed. Additional 320/768 normal-motion responsive tests: 34/34 passed. Drag-to-correct, drag-to-wrong, return, Escape, keyboard and three Challenge questions verified. No uncaught JS errors or horizontal overflow in completed runs. This is not a substitute for owner visual GOLD approval or live NOVA lesson-shell integration.
