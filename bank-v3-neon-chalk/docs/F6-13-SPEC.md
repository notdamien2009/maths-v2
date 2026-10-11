# F6-13 — Proportion in Geometry · F14-11 Preset Spec

**Kind:** Named preset of F14-11 Similar Shapes, not a standalone engine. Interactive F0-based gallery demonstrator is for review while the parent host is unavailable.

## Maths purpose
Compare corresponding lengths on two similar geometric figures. Prove that each corresponding length is scaled by the same factor k. Show a rectangle and a right-triangle representation using common F0 neon paths, maths-role colours and chalk labels. **Linear dimensions use k; areas use k²; volumes use k³.**

## Curriculum presets
- **Y7-064:** right triangles [3, 4] to [6, 8] cm, k=2, missing side 8 cm.
- **Y8-057:** rectangles [4, 6] to [6, 9] cm, k=1.5, missing side 9 cm.
- **Y9-021:** triangles [2.4, 3.6] to [6, 9] m, k=2.5, missing side 9 m.
- **Y9-023:** rectangular similar tanks [4, 6] to [6, 9] cm, k=1.5; the maths connection to density explicitly uses mass/volume, not linear density scaling. The core Y9-023 density lesson will still need its own density engine; this is an optional geometric extension.
- **Y9-029:** triangles [2, 3] to [5, 7.5] cm, k=2.5, missing side 7.5 cm.

## Teaching sequence
1. Meet the similar figures.
2. Name corresponding sides.
3. Derive the scale factor.
4. Apply the factor to all sides.
5. Predict the missing corresponding length.
6. Prove it using ratios.
7. Consolidate the similarity relationship.

The F14-11 host adapter defines four logical beats; the seven preview stages are a fuller Sir Bob teaching narration. The preview uses F0 `NOVA.motion` for celebration and NOVA's common step controls.

## Interactions
Watch, Guided, Explore and Challenge. A learner drags a proposed length into the highlighted *matching-side dock* linked to the coloured side on the enlarged figure; the card can be replaced, returned to red REMOVE zone, or assigned with Enter and removed with Delete. Challenge requires both a valid numerical length and the matching side tile. Events: `step`, `value`, `correct`, `hintUsed`.

## Misconceptions
Adding a difference instead of multiplying, reversing the enlargement factor, matching the wrong sides, and using k instead of k²/k³ for area or volume. Correct use requires the same factor across both pairs of matching lengths.

## Accessible and visual requirements
Use unmodified locked F0 core, no custom line/filter style, approved neon paths and chalk fonts, printable SVG fallback, reduced-motion support, mouse and keyboard support. Native touch and host integration remain untested. Desktop and mobile visual screenshots are evidence, not owner GOLD approval.
