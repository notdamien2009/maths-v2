# F8-08 — Equivalence Checker · Fresh premium review

**Master:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, Family F8 / F8-08.
**Lessons:** Year 7 Y7-029 (collecting like terms), Year 9 Y9-006 (algebraic equivalence).
**Visual system:** existing F0 Neon Tube + NOVA Chalk, current F0 native SVG helpers, stage caption and mascot dock. No private drawing style, new font, or global core changes.

## Five parameterised presets
| ID | Expression A | Expression B | Truth | Teaching focus |
|---|---|---|---|---|
| Y7-029-A | 3x + 2x | 5x | Equivalent | Collect like terms |
| Y7-029-B | 4x + 3 | 7x | Different | Accidental agreement at x=1 |
| Y9-006-A | 2(x + 3) | 2x + 6 | Equivalent | Distributivity |
| Y9-006-B | (x + 2)(x + 3) | x² + 5x + 6 | Equivalent | Double expansion |
| Y9-006-C | x² | x | Different | Matching at x=0 and x=1 insufficient |

## Drawing and interactions
- Two glass-depth neon expression panels over a three-row substitution table, highlighted matching/mismatching outputs.
- Five draggable x-values (-2,0,1,2,3); place three distinct values; placed values may be re-grabbed and returned to the red REMOVE tray. Tap, Enter, Delete and undo work as alternatives.
- Watch/Guided named stages: compare, choose test, evaluate, vary, counterexample, justify. Existing F0 step/playback controls and Sir Bob narration slots.
- Explore allows choosing a named preset, manipulating the table and submitting a verdict.
- Challenge cycles through all five presets; hidden truth, three tests, verdict, misconception-specific marking, and a counterexample for non-equivalence.
- Exact integer-coefficient symbolic polynomial comparison makes the final verdict correct independently of substitution samples: a few matching samples can never prove equivalence. For non-equivalence the pupil must also show one mismatching substitution.
- F0 Pip/Nova helper dock, Izaac Challenge peer; preview uses only pose keys already supported by the runtime.

## Dependencies and integration
Editable source: `src/F8-08.js`, `src/F8-08.css` and `build/F8-08.src.html`.
Rebuild: `python build/build-f8-08.py` **from the existing bank root** after extracting the ZIP.
Builder reads `core/nova-core.css` and `core/nova-core.js` already installed locally and refuses absent sources. No core replacement is shipped.
Self-contained review HTML includes the **F0-derived preview runtime from the earlier F8 review builds**. Current GitHub-main byte identity has NOT been verified; final owner-side integration must rebuild with the approved local core.

## Acceptance limits
Premium review candidate only. Physical touch, native Edge, Safari and direct `file://` load cannot be confirmed from this controlled browser environment. Final owner signoff required.
