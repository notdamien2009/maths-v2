# F8-04 · Two-way Function Machine — production specification

**Type:** presentation preset of F8-03, not a second engine.  **Master lesson:** Y8-016, rearranging formulae. **Review:** 11 October 2026.

## Core mathematical question
Given an input x and two operations in sequence, can the pupil obtain y and then recover the same x by applying the inverse operations in reverse order?

Presets share the **same** F8-03 operation dictionary, `apply`, `calc`, drawing primitives, gear construction and `NOVA.bankMount` shell. Only the view, teaching script, four ordered operation slots, response validation and context are added. The registry remains `F8-03`.

## Approved house-style reference
F0 Neon Tube + NOVA Chalk; F2-01–F2-03 depth benchmark; F3/F4 teaching layouts and F12 mathematics markings. Four modes, no developer code visible outside collapsed details. Mascot speech is concise and varied; Sir Bob has one explanation per teaching stage. Izaac uses an existing teen pose (think / celebrate), not a nonexistent tablet pose. The source F0 core is **not** replaced.

## Three variations within the named Y8-016 preset
| ID | Forward composite | Inverse composite | Guided input/output | Challenge x/y |
|---|---|---|---|---|
| Y8-016 | y = 5x − 4; ×5, −4 | +4, ÷5 | 5 → 21 | 7 → 31 |
| Y8-016-b | y = 2x + 3; ×2, +3 | −3, ÷2 | 6 → 15 | 8 → 19 |
| Y8-016-c | y = 5(x + 4); +4, ×5 | ÷5, −4 | 2 → 30 | 3 → 35 |

## Six teaching steps
1. Notice the input and the two operation machines.
2. Apply machine one and reveal the intermediate result.
3. Apply machine two and reveal y.
4. Read the reverse route and identify which operation to undo first.
5. Undo the **last** forward operation first and reveal intermediate.
6. Undo the **first** forward operation last; check recovered x against original.

The same F0 timeline supports Watch autoplay and Guided step control. Native NOVA motion highlights the active gear where reduced motion is not requested.

## Explore and Challenge
Explore accepts finite input in [-1000,1000]. Eight reusable operation cards can be dragged into **four target machine wells**. Key `1–4` places a focused card; `Enter` fills the next empty well; placed cards are removable with `Delete`, `Backspace`, `Enter` or drag into red return area. Drag outside valid zones springs back. The answer panel shows current composite and recovered x only when enough cards have been placed.

Challenge uses three successive task variations. The input is known; numerical results remain unknown. The pupil must correctly place all four operations **and** enter both y and recovered x. Incorrect order and incorrect numerical values are independently rejected with misconception feedback. No answer reveal before a correct check.

## Pedagogical / technical locks
- An inverse composition must reverse operation order, not merely replace plus with minus at the same position.
- Brackets are evaluated first; do not incorrectly present `5(x + 4)` as `5x + 4`.
- F8-04 is a **preset**, never a second standalone registry entry.
- Core `NOVA.neonBox`, `NOVA.neonPath`, `NOVA.svg.arrow`, `NOVA.chalkText`, `NOVA.ui.svgDrag`, `NOVA.motion.flash` only; no new global primitive.
- Stage geometry is distinct for 380px and desktop. High-density mobile artwork stays within core filter bounds, no empty bands or horizontal overflow.
- Visual GOLD signoff remains with the owner.
