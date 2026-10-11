# F4-04 · Multi-Step Bar Model — Run 04 production specification

## Purpose
Teach that the intermediate result of one multiplicative percentage change is the base for the next change. Linked bars provide a concrete original → intermediate → final representation. This is a mathematical model, not an animation that decorates the answer.

## Grounding
- `HANDOVER-v3.md`: F0 Neon Tube apparatus, NOVA Chalk writing, standard Sir Bob and mascot dock, one shared F2 drag kit.
- `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, Family F4, F4-04 WHAT TO BUILD: two or three linked bars, neon connectors, unknowns, draggable result chips, misconception checking, mobile-first layouts.
- `core/nova-core.js` / `.css`: exact GitHub blob IDs JS `45b41ce94d27ed63e877faac6023e483855da76d`, CSS `aad5139b1a5de01983efcb78dee6aabf917ea0a4`.
- F2 premium depth and F4-01–03 layout/dock/4-mode precedent, without editing those engines.

## Interactions
- Watch: eight conceptual states including the original amount, equal tenths, the first adjustment, transfer to next base, the second adjustment and cumulative proof.
- Guided: the same named steps and narrated rationale with the canonical NOVA controls.
- Explore: choose a context, enter two amounts, drag the intermediate-value chip to the next bar, or use the keyboard/Carry button; re-grab or return a carried chip; Reset.
- Challenge: three independent problems; check both mathematical values and carry evidence. Challenge bars are explicitly schematic, to avoid revealing hidden values from proportional scale.

## Correct-answer definitions
1. `£200 × 1.15 = £230`; then `£230 × 0.90 = £207`.
2. `£80 × 0.75 = £60`; then `£60 × 0.90 = £54`.
3. Given final `£90`: undo the 25% reduction to obtain `£120` after the first step; undo the preceding 20% increase to obtain `£100` originally.

## Safeguards
- All graphics use existing `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.motion`, `NOVA.ui.svgDrag`.
- No custom neon SVG primitive or theme created. No external libraries or network calls. One self-contained HTML.
- Interactive drop zones use native F2 snapping, cancellation and invalid-drop recovery, keyboard equivalent; dedicated red return zone for placed chip.
- No replacement of canonical `core/`, F0, F1, F2, F3, F4-01–03 or F5 sources. The packaged `core/` copies are byte-identical to the GitHub source and are included only so the local rebuild can verify/inline them.
- Multi-step percentage teaching is separate from one-step F4-06 Percentage Bar, and does not replace it.
- Age-appropriate short Pip/Nova mascot prompts and full Sir Bob steps; no unapproved character art introduced.
- Black-and-white print and reduced motion are supplied by the existing F0 core.

## Owner acceptance
Technical QA is not approval. Inspect 380px and 1280px Watch/Guided/Explore/Challenge views, test mouse/touch drag and decide whether the design is visually GOLD before proceeding.
