# F5-03 · NOVA Premium Precision Area Model

## Production status
Premium review candidate. Owner visual GOLD approval and lesson-shell integration are still outstanding.

## Source and bank
Uses F0/F1 Neon Tube + Chalk system and current v3.6.2 bank core (including the tested pointer-capture fix from F5-01). The supplied bank was **not** modified. `build/F5-03.src.html` uses `@@CSS@@` and `@@JS@@` placeholders. Merge the source with your current bank, append F5-03 to `F5` in `build/build.py`, then run that build. `build/build.py` here is an updated integration version from the current bank; the bundle deliberately does not duplicate all of F0/F2.

## Mathematical contract
One rectangle represents a fixed whole partitioned into b equal columns and d equal rows. Amber selected width = a/b, cyan selected height = c/d, green intersection = ac/(bd), never the union. Product simplifies by gcd(ac,bd). The display uses proper stacked NOVA Chalk fractions. Presets include the F5-08 fraction multiplication use. F5-08 remains a stable public ID and is mapped to this same underlying renderer; no duplicate multiplication engine is delivered.

## Interaction contract
Watch, Guided, Explore and Challenge. Each physical edge-handle calls native `NOVA.ui.svgDrag` with exact bounded snap zones. Keyboard Arrow keys and Home/End work repeatedly. Drag invalid drops spring home; Escape resets. Green cell reveal animates via `NOVA.motion.tween` and intersection counts via `NOVA.countUp`. Reduced motion finishes instantly.

## Visual quality
Retained precision-framed grid with amber width, cyan height, green intersection. On mobile the diagram is larger and cards do not collide with the handles. Result is hidden for Challenge.

## QA status
- Integrated bank `build/build.py`: **PASS** after F5-03 registration; compiled HTML byte-identical to standalone.
- 380px and 1280px reduced motion: **52/52** including exact cell counts, 6 teaching steps, 3 Challenge responses, two genuine SVG drags at each size, keyboard and Escape.
- 320px and 768px normal motion: first full 44/44 test suite passed before final motion adjustment. Post-adjustment extended run was interrupted by the browser runner timeout; do not count it as a fresh complete pass. Targeted post-adjustment normal-motion test at 320px and 768px: **PASS**, six green cells, no page errors or overflow.
- No owner approval or live lesson integration claimed.
