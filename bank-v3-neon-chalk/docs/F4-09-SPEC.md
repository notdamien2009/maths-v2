# NOVA F4-09 — Before-and-After Bar

**Family**: F4 Bar Models and Part–Whole · **Run**: 09 · **Status**: Premium Review; owner approval pending.

## Mathematical purpose
Use two bars with one common left origin to make percentage increase/decrease visible and recover an unknown original/after amount. A percentage change is always calculated from the **before/original 100% whole**. The bar's changed segment is the geometrical difference between the lengths.

## Approved source rules
- Reuses canonical F0/F2 core; no private helpers, fonts, filters, or palette changes.
- Main apparatus drawn using `NOVA.svg.root`, `NOVA.neonBox`, `NOVA.neonPath`, `NOVA.svg.arrow` and `NOVA.chalkText`; pointer interaction uses `NOVA.ui.svgDrag` with a keyboard alternative. Movement is driven by canonical core drag/motion helpers.
- Premium glass lift and glow, NOVA Chalk writing, F0 mascot dock, Sir Bob narration slots, four modes, reduced-motion support, text descriptions and monochrome print styling.
- F4-06 percentage bar and F4-04 multi-step bars are conceptual links; F4-09 is a different, dedicated before/after comparison tool.

## Parameters & representative presets
| ID | Type | Before | Rate | After | Unknown |
| --- | --- | ---: | ---: | ---: | --- |
| `Y8-008` | Increase / reverse | £150 | 20% | £180 | Before |
| `INC-15` | Increase | £200 | 15% | £230 | After |
| `DEC-15` | Decrease | £180 | 15% | £153 | After |
| `REV-DEC` | Decrease / reverse | £160 | 15% | £136 | Before |

The curriculum-mapped lesson in the master is **Y8-008 Reverse percentages**. Other demonstration presets are mathematical contexts only, not fabricated curriculum mappings.

## Teaching sequence (eight steps)
1. Original whole is 100%.
2. Name percentage change relative to original.
3. Compare aligned bars and lengths.
4. Identify the extra or missing segment.
5. Connect after percentage to original 100%.
6. Use the inverse multiplier for reverse problems.
7. Reveal original amount.
8. Check using percentage change from the original amount.

## Interaction & assessment
- Explore: choose a context; enter the missing amount; physically drag the change tile to the difference region and the value tile to its correct before/after bar; Check only succeeds if both the amount and diagram are correct.
- Physical cancellation: invalid drops spring back; Escape / blur clears the interaction; red RETURN tray accepts previously placed tiles; Enter places / Delete removes; labelled buttons provide non-drag access.
- Challenges: increase to £250; decrease to £204; reverse increase original £150; reverse decrease original £200.
- Error feedback catches arithmetic sign reversal, confusing change with final amount, or computing a reverse percentage by subtracting the rate from the *final* value.
- No game/scoring logic is embedded; F0-12 is responsible for games.

## Acceptance
Check mobile 380px and desktop 1280px all four modes; manually stress fast pointer dragging; compare typography, mascot size and glow depth side-by-side with premium F2-01..F2-03 and F4-01..F4-08; owner must explicitly approve GOLD status.
