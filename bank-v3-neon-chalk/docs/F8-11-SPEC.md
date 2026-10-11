# F8-11 · Inequality Solver — Premium Production Specification

**Source prompt:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, component F8-11.  **Family:** F8 Algebraic Working and Function Engine. **Review status:** NOT GOLD.

## Mathematical purpose
Solve single-variable linear and compound inequalities, show every reversible algebraic step, then represent the exact solution set on the **canonical F0 `NOVA.numberLine`**. The rendering includes an open ring for strict bounds, a closed ring for inclusive bounds, a directed neon ray or bounded interval, and mathematical evidence before the solution is revealed.

## Lesson mapping and named presets

| Preset | Original problem | Correct set | Trap |
|---|---|---|---|
| Y8-017-A | `2x + 3 < 11` | `x < 4` | open endpoint and left ray |
| Y8-017-B | `5 - 3x ≥ -7` | `x ≤ 4` | reverse sign on division by a negative |
| Y8-017-C | `7x - 2 ≤ 19` | `x ≤ 3` | inclusive ring for ≤ |
| Y8-018-A | `-2(x - 1) > 8` | `x < -3` | distribute negative over brackets; flip sign |
| Y8-018-B | `-1 ≤ 2x + 3 < 9` | `-2 ≤ x < 3` | act on all three parts; mixed endpoints |
| Y8-018-C | `1 < 3x - 2 ≤ 10` | `1 < x ≤ 4` | mixed endpoints and compound inequality |

## Interactive specification

- **Watch:** seven narrated steps; advance algebra, number-line boundary and shading in sequence.
- **Guided:** seven navigable steps; hold the line, mark endpoints, make inclusion and shading evidence explicit.
- **Explore:** manipulable endpoints, editable inclusion states, ray direction controls for single bounds, keyboard movement at 0.5 increments, reset, undo and test.
- **Challenge:** six consecutive tasks; checks plotted boundary/boundaries, endpoint openness, ray direction where needed and typed numerical boundaries. No solution or final working shown until success.
- **Drag:** use F0 `NOVA.ui.svgDrag`, lift and zone highlights. Drop on canonical number line snaps to a half-unit, invalid drops return; placed markers remain regrabbable, red return tray supports removal, `Escape`/`Delete` returns marker, pointerup recovery ensures no stranded state.
- **Chalk and glass:** all plotted lines and teaching geometry from approved F0 helpers (`NOVA.numberLine`, `neonLine`, `neonBox`, `neonRing`, `chalkText`, `svg.root`). No new font or decorative SVG drawing system.
- **Mascots:** F0 helper dock uses step-specific brief Pip/Nova reactions, Sir Bob narration is provided per teaching beat; Izaac Challenge peer uses an existing pose in F0 helper runtime.
- **Accessibility:** keyboard equivalents, aria labels, live challenge feedback, reduced-motion preference, no reliance on hue alone, grayscale print inherited from F0.

## Source contract

- `src/F8-11.js` declares a new standalone F8-11 engine and fixed event keys; `src/F8-11.css` contains only component-scoped CSS.
- `build/F8-11.src.html` is the uncompiled shell; `build/build-f8-11.py` inlines the **local existing** F0 JS and CSS at build time. The ZIP intentionally **does not** include `core/`.
- Standalone HTML is a precompiled preview using the F0-derived runtime from the prior approved-looking review pack. Rebuild with the owner's exact current GitHub-main core and run regression tests before integration.
- Dependencies: F0-02, F0-03, F0-04, F0-05, F0-07, F0-08, F1-01, F1-06, F8-05.

## GCSE extension
Compound bounds and negative coefficients with sign reversal. The numerical kernel also supports negative affine coefficients in generic compound inequalities, including the reversal of endpoint order and inclusion.
