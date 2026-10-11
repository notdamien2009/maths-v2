# F7-09 · Balance with negatives and unknowns — review specification

**Component identity:** named F7-09 preset/entry of **F7-08 Balance Scales**, *not* a second registered engine. The same `F708_CONFIG`, `NOVA.bankMount`, core F0 drawings and maths functions power both F7-08 and F7-09. The F7-09 standalone HTML is a different **entry point** that sets `data-entry-variant="F7-09"` and `data-entry-preset="F7-09-negatives"` before loading the shared engine.

**Mathematical purpose:** Represent signed integers as positive unit weights and negative balloons, and unknowns as marked x-bags on both sides. Pupils maintain `ax+b=cx+d` by applying the same operation to each side. Negative coefficients show as patterned `−x` bags. A positive and negative unit placed on the same pan are a zero pair with unchanged net value.

**KS3 links:** Y8-013 equations with brackets; Y8-014 unknowns on both sides; Y7-033 inverse-operation scaffold. GCSE extension: signed coefficients and equations requiring `×(−1)` on both sides. **Scope:** integer coefficients and non-negative integer solutions within the engine's supported range; negative or fractional solutions are not asserted to work.

**Named presets:** `F7-09-negatives` 2x−3=x+2; `F7-09-signed-unit` x−2=4; `F7-09-unknowns-both` 3x−2=2x+4; `F7-09-negative-x` −x+8=3. Original F7-08 presets including F7-10 cups remain available.

**Watch / Guided stages:** 1. Load signed weights (2x−3). 2. Balance both pans (2x−3=x+2). 3. Remove x on each side (x−3=2). 4. Add three positive units to each side; visualize three +1/−1 zero pairs on left and five positive units on right. 5. Cancel zero pairs (x=5). 6. Substitute x=5 into the original equation (7=7).

**Explore:** pick signed preset; drag x-bags and weights on/off pans; one-sided change tilts until mirrored or rolled back; use paired inverse-operation buttons, zero-pair add/cancel buttons, keyboard alternatives, undo/reset and ×(−1) both sides. A zero pair adds two visible units of opposite signs *to the same pan* without changing mathematical coefficients, and cancellation removes both. Zero-pair state is tracked separately from simplified coefficient state, including undo.

**Challenge:** four signed equations, solutions 5 / 6 / 6 / 5, with misconception-specific feedback, hint and verification by substitution.

**Visual lock:** canonical F0 Neon Tube primitive drawings, NOVA Chalk, positive and negative shape/sign redundancy, premium glass/lift/glow, existing F0 helper dock, Sir Bob narration slot. No new filters, fonts or mathematical primitive APIs. Screen widths: 320/380/768/1280. Motion-reduction support.

**Events:** existing `F708_CONFIG.events` keys plus declared `zeroPair` and `zeroCancel` for side / count / original equation. No change to F0 core.

**Acceptance:** technical candidate passed browser and physical pointer checks; still requires owner side-by-side design review and actual NOVA lesson integration. Do not label GOLD yet.
