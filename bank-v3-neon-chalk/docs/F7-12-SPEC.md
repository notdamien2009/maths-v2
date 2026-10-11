# F7-12 · Substitution Machine — Run 12 production specification

**Category:** Year 7 algebra: substitution into expressions and formulae.  The same code powers the provisional shared parent **F8-03 Function Machine**. F7-12 is a named preset, **not a duplicate engine**.

**Maths purpose:** Replace each occurrence of x by an integer, preserve signs, apply powers, multiply coefficients, then combine terms. The visual makes the *input → mathematical rule → output* structure explicit.

**School coverage:** Y7-030 core: integer linear expressions, signed values and formulae. Y8/GCSE bridge: integer squared terms and negatives. Never assumes unapproved F8 GOLD production.

**Public configuration:** `F803_CONFIG` at top of `src/F8-03.js`, with `preset`, `presets`, `parameters`, `challenge`, and declared event keys.

**Presets:** `F7-12-Y7-030`, `Y7-030-subtraction`, `Y7-030-signed`, `Y7-030-squared`, `Y7-030-formula`, `Y8-substitution-bridge`, `F8-03-function-rule`. Defaults: 3x + 2 with x=5 gives 17.

**Four modes:** Watch auto teaching, Guided with the same named steps, Explore with draggable x-value card and value check, Challenge with four distinct tasks and hidden result until a correct submission.

**Eight named teaching beats:** Read expression → drop x-value card → substitute every x → work powers → multiply coefficients → respect signed operations → combine evaluated terms → record input/output pair.

**Interactions:** F0 `NOVA.ui.svgDrag` source → hopper; re-grab loaded card → red Return zone; invalid drops return home; Escape/pointercancel; keyboard Enter/R; undo/reset; Explore presets; Challenge textbox and misconception-specific feedback; input/output table. F0 narration and helper dock, no custom mascot frames.

**Visual contract:** Canonical F0 core CSS/JS embedded in the compiled standalone HTML only. All SVG mathematical drawings through `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText` and `NOVA.svg.root`; no custom neon filter/fonts/number lines. Stage has mobile/desktop SVG layouts.

**Challenge acceptance:** For each question, load the card; evaluate correctly; system validates signed integer output without showing intermediate numeric terms until accepted. Checks include order-of-operations, coefficient-as-addition, negative input, dropped constant, signed terms and powers.

**GCSE flag:** Supported as an extension (monic/simple integer quadratic evaluation). NOT a general symbolic substitution parser or fully implemented F8-03 family. **F8 parent remains a provisional foundation pending its own F8 production round and owner approval**, particularly rule-card drag and inverse/two-way presets F8-02/F8-04.

**Linked components:** F8-03 (shared parent), F0-02 Neon, F7-01 Algebra Tiles, F7-09 signed maths.

**QA gate:** Visual review at 320, 380, 768, 1280; all modes; four Challenges; drag/return/cancel at 380 and 1280 normal/reduced-motion; parent F8-03 smoke. Run independent tests via `tests/qa_f712.py` and `tests/stress_f712.py` after `build/build-f7-12.py`.
