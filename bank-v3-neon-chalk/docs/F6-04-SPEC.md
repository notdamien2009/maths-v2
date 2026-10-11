# F6-04 Component Specification — Simplifying Ratios

**Stage:** KS3 Year 7 + Year 8, with GCSE extensions. **Status:** owner review candidate; not GOLD.

## Mathematics and learning purpose
- Present ratio as an ordered multiplicative comparison, not subtraction or additive gaps.
- Draw two colour-distinct quantities using approved NOVA.neonRing apparatus.
- Show the same positive common factor acting on both quantities; display explicit counter bundles and reduce to one ring per bundle for the finished ratio.
- If a ratio has rational parts, first clear BOTH denominators (or decimal places) with the SAME multiplier. Produce a simplest positive integer ratio.
- Check equivalence and irreducibility, not just visual resemblance.

## Config parameters and presets
- `ratioA`, `ratioB`, `positiveValues`, `decimalAndFractionPresets`, `stage`.
- `Y7-058`: 6:9 → 2:3. `Y7-058-extend`: 12:18 → 2:3.
- `Y8-034-decimals`: 1.5:2.25 → 2:3, multiply both starting terms by four then simplify.
- `Y8-034-fractions`: stacked 3/4 : 1/2 → 3:2, multiply both starting terms by four.

## 6 teaching beats
1. Notice the comparison and the original quantities.
2. Build both counters and visualise equal bundles.
3. Find and apply one shared factor.
4. Collapse each equivalent bundle to one representative part.
5. State the simplest whole-number ratio.
6. Prove it via multiplying both parts back.

## Modes and interactions
- **Watch:** auto-timed teaching storyboard, play/pause/step/scrub/reset from F0.
- **Guided:** F0 stepped teaching and Sir Bob narration slots.
- **Explore:** draggable lasso onto quantity A/B, ratio chips dragged into a snapped answer slot, red return tray, re-grabbed chips, keyboard A/B/Enter/Delete and hint/reset.
- **Challenge:** four examples; require ordered positive whole-number ratio, diagnose unsimplified equivalents, reversal, unequal scaling, and missing/non-integer values. Before checking, no ratio bundles or answers are disclosed.

## Style & reusable interfaces
- Original shared F0 core and embedded neon/chalk fonts; no copied/invented house primitives.
- Numeric role colours and coloured counter rings; text and separated groups are secondary non-colour cues.
- Drags call `NOVA.ui.svgDrag`; slides use `NOVA.motion`; events include `value`, `correct`, `step`, `hintUsed`.
- SVG alt text, keyboard operation, reduced-motion support and print fallback via shared core.
- Embedded helper/mascot supplied by original F0, not redrawn.

## Misconception feedback
- Changing only one ratio term; reversal; an equivalent-but-not-simplest answer; decimal/fraction clearing error; additive rather than multiplicative comparison.

**GCSE flag:** extend to three-part ratios, algebraic coefficients, decimals and fractional terms using consistent clearing factors.

**Linked:** F0 foundation, F2-03, F6-01, F6-03.
