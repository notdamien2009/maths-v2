# NOVA F4-07 — Ratio Bar / Production Run 07

**Status:** Premium review build. Owner visual approval pending, not GOLD.

## Mathematical purpose

Show the multiplicative relationship A:B as two glass bars constructed from identical-width units. Build, remove, transfer and value a unit to prove what it means to simplify or divide a total in a ratio.

- Year 7 lesson Y7-058: simplify 6:9 to 2:3 by dividing BOTH terms by the common factor 3.
- Year 7 lesson Y7-059: share £60 in the ratio 2:3; five equal units; £12/unit; shares £24 and £36.
- Year 8 lesson Y8-034: decimal terms 1.5:2.5 convert to integer ratio 3:5; £64/8=£8/unit; £24 and £40.
- GCSE extension: 3-decimal-place positive ratio terms may be simplified with integer gcd after common decimal scaling. Max 10 equal units per bar in the learner construction UI.

## Representation

- Bar A and bar B use EXACTLY the same width for one equal mathematical unit (never resized independently).
- Mathematical colour roles are F0/F2 roles `given`, `focus`, `op`, `result`, `unknown`, `error`, not arbitrary per-unit rainbow.
- Brace below both bars and counted total connects the quantities.
- Four modes: Watch (8 teaching states), Guided, Explore, Challenge (3 mathematically verified problems).
- The Stage contains source unit cards that physically snap to A or B; a placed unit can move to the other bar or to the red Return zone.
- The one-unit value must be typed and physically placed on the bar before a sharing challenge is accepted.
- Accessible keyboard equivalents: + / − buttons, Enter on source card, Delete on placed unit, ArrowUp/Down to transfer a focused unit, Enter on value chip.
- Wrong answer feedback distinguishes non-simplified ratios, wrong constructed bar unit counts, wrong unit value, unplaced unit value, and incorrectly computed shares.

## Build and delivery contract

- `F4/F4-07-ratio-bar.html` is a completely offline standalone page, with canonical NOVA F0/F2 core inlined.
- `build/F4-07.src.html`, `src/F4-07.js`, `src/F4-07.css`, `build/build-f4-07.py` permit local regeneration.
- The package does **not** ship replacements for `core/nova-core.js` or `.css`. The builder validates their SHA256 before inlining.
- No existing F4 engines, mascot assets, F5 files, master documents or GitHub contents are altered.
- Tutor speech uses existing short helper dock encouragement plus separately narrated mathematical teaching stages.
- No F0-12 game logic added: this is a reusable visual engine.

## Approval gate

Technical automated checks are recorded in the run QA report. Human review at mobile 380px and desktop 1280px, in all four modes, and stress-testing with a real pointing device are required before owner GOLD approval.
