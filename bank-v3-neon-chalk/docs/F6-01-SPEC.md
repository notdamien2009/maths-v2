# F6-01 · Ratio Table — component contract

**Source authority:** NOVA-MASTER-FOR-OTHER-AI.md / Family F6 / F6-01. Owner-approved fraction lock, canonical F0/F2 Neon Tube + NOVA Chalk house style. **Status:** Premium review candidate, not GOLD.

## Maths purpose
A ratio table holds related quantities in aligned columns. It shows the known pair, operation applied to each column, and the new pair. Direct proportion preserves the ratio by multiplying both columns by the same factor. The inverse contrast preserves the product when one column is multiplied and the other divided by that factor. Demonstrate reversibility; never teach inverse using direct scaling.

## Presets
- Y7-058 ratio notation: 3:5 → 6:10.
- Y7-060 direct proportion: 2 tickets / £6 → 6 tickets / £18.
- Y7-061 unit price: 4 cans / £12 → 1 can / £3.
- Y8-034 decimal ratios: 0.5:1.5 → 2:6.
- Y8-035 y=kx: x=2, y=7.5 → x=6, y=22.5.
- Y8-036 direct proportion graph bridge: 1:3 → 5:15 (table representation, graph elsewhere).
- Y8-037 inverse comparison: 2 workers / 12 hours → 6 workers / 4 hours; x·y constant.

## Four modes
- **Watch:** six narrated Sir Bob steps using the canonical Watch timeline; disclosure grows with the mathematical explanation.
- **Guided:** step/back/scrub with prompts and stepwise proof.
- **Explore:** drag multiplier cards to A/B operation lanes, drag values into both result cells, re-grab filled values and drag to red Return zone; keyboard operation selection, equivalent input controls, Undo and Reset.
- **Challenge:** four questions including ratio, unit rate, inverse and decimal scaling; correct answer hidden until response, distractors with misconception-specific feedback and next progression.

## Visual continuity
All mathematical stage strokes are core NOVA.neonBox, NOVA.neonLine, NOVA.neonRing, NOVA.svg.arrow, NOVA.chalkText. Glass Neon Tube with no extra foreign shapes, filters or font. Uses inherited F0 mascot helperStrip, Sir Bob timeline and NOVA drag kit. Responsive 420/1120 SVG canvases with stage-sized layouts. The stage is in the original F0 dark maths palette, unlike a new style experiment.

## Events and config
Public `F601_CONFIG` and `NOVA.bankMount({id:'F6-01'})`. Strict value event keys; events are in a collapsed developer-only console. No randomisation/game loop. Linked: F0-02/03/04; F2-02; future F4-07; F6-02; F6-09.

## Integration
Copy run files into existing `bank-v3-neon-chalk/`, preserving all earlier components. The zip intentionally includes **no F0 core and no replacement build/build.py**. The self-contained HTML preview was built by inlining the exact F0 source inherited from F4 production. For future rebuilding against the user's current bank core, run `python build/build-f6-01.py`.

## QA limits
Static JS checks, source builder, and maths sweep passed. Browser execution was attempted but denied by the environment’s managed Chromium policy (`ERR_BLOCKED_BY_ADMINISTRATOR`). Browser screenshots and pointer-drag stress tests are **not passed** until independently run. No visual GOLD sign-off or lesson-shell integration claimed.
