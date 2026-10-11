# NOVA Maths — F8-01 Step-by-step Working Animator

**Status:** Fresh premium review candidate. NOT owner-GOLD and not lesson integrated.

## Source
`00-master/NOVA-MASTER-FOR-OTHER-AI.md` > Family F8 > F8-01. Uses canonical F0 runtime and existing NOVA house style; no F8 legacy files reused.

## Teaching purpose
Make each valid algebraic transformation transparent. A learner must see what changes, why, and which terms do not change. Applications: Y7-018, Y8-011, Y8-012, Y8-015.

## Presets
- Y7-018 — order of operations, including bracket and multiplication priority.
- Y8-011 — expanding double brackets, identifying all four products and collecting like terms.
- Y8-012 — taking out the highest common factor and verifying an identity.
- Y8-015 — solving an equation with a fraction using inverse operations and substitution check.

## Seven teaching states
Opening line → highlight first operation → first valid transformed line → highlight second operation → second valid line → identify last operation → complete and verify fourth line. The final step of the factorisation and equation presets is a **verification**, not a redundant algebraic simplification.

## Modes
- Watch: core auto-play timeline and Bob narration.
- Guided: pupil-advanced working; operation focus, valid equivalent lines and narration.
- Explore: drag operation pills onto the next line, undo/regrab and reset; four lesson presets.
- Challenge: four progressive tasks, each with three valid transformations; operation choice + equivalent next line, misconception feedback, hint and next task.

## Drawing and interaction
Neon-glass working cards, chalk mathematical writing, SVG fractions stacked by drawing numerator, proper horizontal bar and denominator, core NOVA motion and SVG drag. The F0 helper/mascot strip is reused unaltered.

## Integration
Unzip at the existing `bank-v3-neon-chalk/` directory. Files are additive: `src/F8-01.js`, `src/F8-01.css`, `build/F8-01.src.html`, `build/build-f8-01.py`, `F8/F8-01-step-by-step-working-animator.html`, plus docs/tests/screenshots. **Do not replace core/**. After installing, run `python build/build-f8-01.py` to regenerate the standalone HTML from your current exact F0 core. The packaged HTML is a review preview generated using an earlier F0-derived production gallery runtime; the local rebuild removes that source-version uncertainty.

## QA acceptance
Inspect Watch, Guided, Explore, Challenge at 380px and 1280px. Confirm dropdown/presets, forward/back/play/pause/reset, fast-drags/return/undo, keyboard, math validity, no raw markup, no overlap, no console errors. Only owner review can designate GOLD.
