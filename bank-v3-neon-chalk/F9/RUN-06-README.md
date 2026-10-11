# F9-06 — Geometric Sequence · RUN 06 PREMIUM REVIEW

**Status:** Owner review build, not GOLD. **GitHub unchanged.**

## Mathematical purpose
Show how a geometric sequence repeats a fixed **multiplicative ratio**. Bars use relative value heights and the original NOVA neon glass primitives. A repeated ratio is not a repeated addition.

## Presets
- **Y8-020:** doubling 2, 4, 8, 16, 32; ratio ×2; T(n) = 2 × 2^(n−1).
- **Y9-014 (decay):** halving 64, 32, 16, 8, 4; ratio ÷2.
- **Y9-014 (growth):** tripling 2, 6, 18, 54, 162; ratio ×3.

## Modes and instruction
- Watch: six distinct teaching beats: see first term; multiply; multiply again; see nonconstant additive differences; compare halving; derive repeated-power nth term.
- Guided: step-by-step NOVA timeline with the single canonical helper dock.
- Explore: switch among the named presets and reveal two through five terms using a slider.
- Challenge: 3 tasks: doubling 3,6,12,24→48; tripling 2,6,18,54→162; halving 64,32,16,8→4. Drag ratio + next-term cards; no answers shown in Challenge side cards. Wrong answers receive operation-specific misconception feedback. Fast drag, spring-back, snap, remove tray, keyboard Enter/Delete, hints, reset and full progression implemented.

## Visual lock
- F9-01 v3/F0/F1/F2 background inherited from **unmodified shared NOVA styles**, including the algebra motif.
- All mathematical drawing uses the existing NOVA neonBox, neonLine, neonRing, svg.hop and chalkText helpers. No new SVG filters/drawing rules or custom shell.
- One mascot dock; no additional inline mascots. One consistent Chalk font family and original embedded mascot art.
- Proper exponent placement (superscript), not raw caret markup, in the finished teaching display.

## QA evidence
- Functional/visual: **74/74 passed**, includes six teaching stages and all modes at 380px and 1280px.
- Drag/keyboard stress: **22/22 passed**, including fast pointer moves, wrong drop rejection, snap, red removal tray, Delete key and re-placement.
- **18** screenshots, both target widths; tests and reports in `tests/`.
- Three mathematically verified fifth-term results; byte-for-byte reproducible build.

## Shared core integration note
The repository's checked-in `core/nova-core.js` lacks some newer F2/F3 drag and motion helpers. This self-contained HTML uses the working F3 reference runtime already used in F9-01 v3. The rebuild script requires `F3/F3-01-array-builder.html` and uses its original embedded fonts, mascots and helpers. Reconcile the checked-in shared core before a final full-family build. No GitHub files were modified.

**Approval gate:** open the standalone HTML, visually compare with approved F9-01 v3/F0/F1/F2, stress-test if wanted, and sign off before proceeding to F9-07.
