# F7-01 Algebra Tiles · Premium Review · Run 01

## Maths purpose
Concrete representation of three different algebraic tile values: x² is an L×L area square, x is an L×u rod, and 1 is a u×u square. Learners form expressions, group like terms and distinguish signed coefficients. Tile dimensions are a consistent geometric model; `x` is not assigned a numerical value by this component.

## KS3 curriculum presets
- Y7-029 **Collecting like terms:** x + 1 + x + 1 + 1 → 2x + 3.
- Y7-031 **Expanding a single bracket:** 3(x + 2) → 3x + 6, with three x tiles and six unit tiles.
- Signed terms extension: cancellation of opposite tile coefficients.
- GCSE bridge: x², x and constants deliberately separated.

## Parameters / controls
- Three tile types (`x2`, `x`, `one`), two signs (`+`, `−`), max 18 tiles.
- Positive: green glow. Negative: red glow **and** diagonal hatching.
- Five-step Watch/Guided teaching sequence: identify → place → sort → count → read proof.
- Explore: add, remove, flip, undo, reset; switch among the four presets.
- Challenge: four progressively harder rounds; exact signed coefficients required.
- Physical pointer dragging uses the *existing* `NOVA.ui.svgDrag` zones. Tray → matching lane; placed tile → flip or red remove zone. Invalid drop springs home. Keyboard: Enter on tray, F/Delete on a placed tile; clickable labelled add buttons.
- Mathematical proof: vector coefficients for x², x, constants; misconception-specific feedback for mismatching tile families or signs.
- Event contract: declared `value` keys (`preset`, `tile`, `remove`, `flip`, `reset`, `answer`, `undo`, `keyboard`, `challenge`, `proof`) plus engine-provided `step`, `correct`, `hintUsed`, `mode`.

## Connections
F3-02 area model of multiplication, F7-02 signed zero pairs, F7-03 collecting like terms, F7-04/05 expanding brackets as F3-02 presets.

## Style and reusable foundations
Uses original NOVA F0 Neon Tube + Chalk core CSS/JS exactly; `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.neonRing`, `NOVA.motion`, `NOVA.ui.svgDrag`, `NOVA.bankMount`, `NOVA.mt.render`, `NOVA.scene.helperStrip`; no alternate draw kit or private core. Core mascot strip retains owner-selected images and short, step-specific encouragement, with full mathematical narration stored in Watch steps. Supports 380px and 1280px review, reduced-motion fallback and print styling.

## Approval
Review candidate, **not GOLD**. The owner must sign off aesthetics and interactive feel before F7-02.
