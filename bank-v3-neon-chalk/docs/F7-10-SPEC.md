# NOVA F7-10 — Cups-and-Counters Solver · Premium review specification

**Architecture:** Preset/skin of F7-08 (shared JS, CSS, F0 core), not an independent mathematical engine. Entry `F7/F7-10-cups-and-counters.html` selects `F7-10-cups` and `F7-10` variant. F7-08 and F7-09 standalone entries rebuilt with same shared source; default and signed mode unchanged.

**Maths purpose:** Translate `ax + b = d` into equal-value counters separated by a neon divider. A cup is `x`; a coin is 1. Removing the same unit count from both sides keeps equality, then sharing `d / a` counters evenly across `a` cups solves x. Challenge accepts `x` only when numerically correct and gives targeted misconception feedback.

**Year groups and presets:** Year 7 one-step and two-step equations, Y7 contextual examples; Year 8 equal-sharing / bracket bridge. `F7-10-cups` = `2x + 2 = 10`; `F7-10-one-cup` = `x + 3 = 7`; `F7-10-three-cups` = `3x + 3 = 12`; `F7-10-context` = `2x + 4 = 12`. A shared Explore selector retains all original F7-08/F7-09 presets.

**Parameters:** `{a,b,c,d,skin:'cups',context}`. Algebra validator in F7-08 `solution()` demands integer nonnegative x and unique solution. Model rendering dynamically counts cups and counters. Shared math operations preserve `ax+b=cx+d` equality.

**Watch/Guided seven teaching stages:** Reveal x cups; load `2x+2=10`; remove 2 from both sides; form two equal shares of 8; fill first cup; fill second cup; check by substitution `2×4+2=10`. Stages use F0 NOVA motion and named narration/prompt/mascot cues.

**Interactions:** F0 `NOVA.ui.svgDrag` for counter-to-RETURN, matching operation on opposing side, and right-counter-to-cup when unknowns isolated. Both sides preserve equality; intermediate one-sided action is pending and automatically restored. Sharing displays counts and removes loose counters as they are grouped without changing the stored equation. Native keyboard Delete/R removes, L/R adds, 1/2/3 shares onto selected cup. Undo/Reset/Hint and share buttons are accessible alternatives. ESC and pointercancel recover. No custom SVG brush/filter; only F0 neon helpers.

**Modes:** Watch, Guided, Explore, Challenge. Four dedicated F7-10 challenge equations: `x+3=7`, `2x+2=10`, `3x+3=12`, `2x+4=12`; expected answers 4,4,3,4.

**Misconception feedback:** Subtracting from only one side, forgetting to divide total by coefficient, treating total as a cup, sharing unequally, choosing nonexistent cup, changing quantity while redistributing. Fair-share cap prevents overfilling a single cup.

**GCSE flag:** Foundational model for integer linear equations; negative and unknown-on-both-sides handled by F7-09/F7-08. Fractions/general symbolic division outside this preset's scope. F7-09 signed view remains a separate preset in the same shared engine.

**Linked components:** F7-08 (host), F7-09 (signed), F7-01 (x tiles), F7-03 (collecting terms), F4-08 (equation bars). No changes to the F0 core.

**Status:** Automated review build, NOT owner GOLD approval; not live lesson integrated.
