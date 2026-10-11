# F8-07 — Expression Builder · Fresh Premium Review Specification

## Identity and origin
- Family F8 — Algebraic Working and Function Engine; component F8-07.
- Source: `bank-v3-neon-chalk/00-master/NOVA-MASTER-FOR-OTHER-AI.md`, F8-07 exact component prompt.
- **Independent visual engine**, not a F8-03 preset. Depends on existing F0 rendering, teaching, drag and assessment helpers.
- Never use the abandoned F8 material. Source and build files were written for this review run.
- Status: **PREMIUM REVIEW**, not owner-approved GOLD.

## Purpose
Convert mathematical descriptions into meaningful expressions, distinguishing variable quantities, their coefficients, one-off constants, operations and nested brackets. Validation compares exact polynomials rather than accepting only one literal string.

## Named presets
| Preset | KS3 objective | Expression | Context |
|---|---|---|---|
| Y7-028 | Algebraic notation | 5n + 3 | Five times a number, then three more |
| Y7-034-T | Form expressions | 7t + 2 | Tickets plus one booking fee |
| Y7-034-P | Form expressions | 2(l + w) | Rectangle perimeter |
| Y9-007-D | Model expressions | 2(3d + 5) | Two taxi journeys including start fee |
| Y9-007-G | Model expressions | n(x + 3) + 4 | Groups of boxed items and additional loose items |

## Visual directions
- F0 standard navy canvas, NOVA neon-tube glass objects, two-mode chalk letterforms and existing mathematical colour roles.
- Input story at top; the central expression rail contains individual coefficients, variables, operators and bracket tiles.
- Underneath: a gated large-format algebra reading, two meaning/evidence cards, numerical substitution, then a manipulable tile tray in Explore/Challenge.
- Mobile uses 440-unit SVG viewBox, stacked stage, four tray columns; desktop uses 1080-unit viewBox, six tray columns.
- Pupil-only content: no raw developer code, no generic star markers, no new font, filters or drawing primitives.
- Existing F0 `NOVA.scene.helperStrip` and Sir Bob narration; Izaac via F0 native helper in Challenge.

## Four modes
- **Watch:** default narrative animation displays tiles progressively.
- **Guided:** manually stepped reveals showing words, multiplying a variable, placing operators/brackets, completing and testing.
- **Explore:** switch between five presets, place/reorder/remove tiles, undo and check equivalence with explanatory feedback.
- **Challenge:** build the expression with no answer displayed, check exact mathematical equivalence; progress through five tasks; successful completion reveals algebra and substitutions.

## Actions and checks
- `NOVA.ui.svgDrag` on tray and placed tiles, with explicit drop zones for every rail slot and a remove zone.
- Scope-limited pointer-up/cancel/blur recovery for lifted SVG cards; no shared-core edits.
- Mouse/touch tap to fill first available slot; keyboard Enter to fill, Arrow Left/Right on a placed tile to reorder, Delete to remove; keyboard undo/reset/check buttons.
- `F807_CONFIG` declares allowed events and preset names.
- `F807_TEST` exports the side-effect-free polynomial parser, exact equivalence and independent numerical evaluation utilities.
- Maths diagnostics include mistaken addition vs multiplication, misapplied booking fees, and brackets omitted when doubling groups.
- Progressive visual disclosure keeps the final correct expression hidden until checked in Challenge.

## GCSE route
Expand and factor algebraically equivalent expressions, including products of variables; distinguish valid alternate arrangements using exact polynomial comparison.

## Dependencies
Canonical local `core/nova-core.js` and `core/nova-core.css` provided by the owner's existing maths bank. Build via `python build/build-f8-07.py` **after extracting the additive files into the existing bank**.

## Acceptance / owner gate
Matches F0/F2/F3/F4/F5/F6/F7/F12 design language. Browser/math/keyboard/pointer checks are reported separately. Must still confirm integration using the currently approved main-branch core, Windows Edge, touchscreen and screen reader before GOLD.
