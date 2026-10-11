# NOVA F4-08 Algebra Bar · component specification and F4-10 preset

Status: **Premium Review**, awaiting owner's independent visual/interaction sign-off; not GOLD.

## Mathematical purpose
Show how an additive whole is partitioned into *n* equal unknown x-parts plus one known term; translate that evidence into `nx + b = total`; subtract b from both sides; distribute the remainder equally into n groups; verify by substitution. F4-10 **Bar-to-equation translator is a preset of F4-08, not an extra engine**.

## Learners and mappings
- `Y7-034` Forming expressions from contexts: `2x + 4` (no equals sign or numeric x inferred)
- `Y7-035` Forming and solving equations: `3x + 5 = 26`; remainder 21; x = 7
- `F4-10` Bar-to-equation translator: `2x + 5 = 19`; remainder 14; x = 7
The IDs are candidate mappings originating in the master; lesson-content approval is a separate gate.

## Source API
- `window.F408_CONFIG`: bounded integer parameters, named presets, mode, fixed event-key registry.
- `window.F408_MATH`: `solve`, `terms`, `parseExpression`, `checkMath`. Error and misconception cases are explicitly checked.
- NOVA canonical F0 core: `NOVA.svg.root`, `NOVA.neonBox`, `NOVA.neonPath`, `NOVA.chalkText`, `NOVA.motion.arrive/flash`, `NOVA.ui.svgDrag`, `NOVA.bankMount`, `NOVA.scene.helperStrip`.
- No new SVG primitives, self-defined fonts, glow filters, game logic or external dependencies.

## Modes and 8 named teaching steps
1. Notice the whole; 2. Make equal unknown parts; 3. Show the known amount; 4. Build the equation; 5. Subtract the same known amount from **both** sides; 6. Share the remainder equally; 7. Reveal x; 8. Substitute to check.
Watch autoplays; Guided offers step-by-step; Explore offers Y7-034 / Y7-035 / F4-10; Challenge assesses expression, equation and translator consecutively. Core playback provides pause, skip, scrub, reset and narration. Bob narrates full steps; mascot strips give short encouragement.

## Interaction and correct conditions
- From the tray, drag or Enter an x-unit (up to 5); one blue known-value block; drag placed tiles to the red return zone / Delete to remove.
- A target is accepted only after the actual F2-core `svgDrag` drop rules are satisfied. Cancel via Escape without changing counts. Required feedback for mathematical or interaction failures.
- Equation mode requires (a) correct n-unknown physical bar, (b) physical known b block, (c) action subtracting b from both sides, (d) numeric remainder `total-b`, (e) dividing remainder among all n x-blocks, and (f) exact x; all six conditions are checked.
- Expression mode requires the bar and correct `nx+b`, **never displays a non-existent total or value of x**.
- F4-10 displays three equation slots; source chips (`nx`, `+b`, `=total`) drag to slots with snapping or are placed through the keyboard-equivalent button; wrong mapping is rejected.

## Visual and accessibility
- Locked Neon Tube objects and NOVA Chalk labels. Unknown x sections gold, known blocks blue, proved results green. Blue/green distinctions are repeated as algebraic text.
- F0 mascots, bob speech, dark shell, three matching side cards, no unapproved creative primitives.
- Tested Chromium at 380 and 1280 pixels, normal and reduced motion, with pointer and keyboard alternatives, and no horizontal overflow. Mobile heading/art/cards/controls are stacked. Print fallback uses canonical monochrome F0 CSS.
- Developer-only specifications moved behind a collapsed developer toggle.

## GCSE extension
Foundation: single-variable equations through equal groups and inverse operations; Higher: use conceptual equal-group model before negative, fractional or multi-variable symbolic methods. Current numerical stage intentionally constrains to positive integer solution cases; do not overclaim support for negatives/fractions.
