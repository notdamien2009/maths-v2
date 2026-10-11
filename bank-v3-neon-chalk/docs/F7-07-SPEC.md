# F7-07 · Completing the Square · Premium Review Spec

- **Purpose:** Demonstrate x² + 2nx + c = (x+n)² − (n²−c) by square area; the extra corner units must be subtracted.
- **Age:** KS3 advanced bridge / GCSE algebra extension; no invented KS3 lesson ID.
- **Scope:** monic positive even x coefficient, n = 2, 3 or 4, original c = 0..n². Negative coefficients / negative constants not yet supported by the tile model. Full generalisation is a later extension.
- **Parameters:** n half of the linear coefficient, c original constant, n²−c additional unit squares.
- **Presets:** x²+6x+5; x²+4x+1; x²+8x+12; x²+6x+9; x²+8x+9.
- **Maths layout:** permanent x² square (blue), exactly n rods along right edge and n rods along bottom (cyan), c original corner units (green), and the n²−c newly added units (gold). Rods are x×1, units are 1×1, and the completed area is (x+n)².
- **Steps:** Inspect → split x rods → bottom rods → right rods → count missing corner → fill → read equal edges → subtract added units. Core Watch / Guided stepper, narration slots, reduced-motion handling.
- **Explore:** choose preset, drag and keyboard place tiles in correct shape slots, gold units into corner, undo/reset/hint/return. Valid moves snap; invalid moves recover. Core motion kit.
- **Challenge:** four rounds. Fill all slots, then enter an identity in the form (x+n)²−k. Check exact n and correction k. Incorrect n, incorrect sign and missing correction have specific feedback.
- **GCSE:** positive monic-quadratic bridge only; not a full completing-the-square engine for all coefficients. No fake negative tiles.
- **Linked:** F7-01 algebra tiles, F7-06 factorising tiles, F3-02 area-model multiplication, F0 core.
- **NOVA core:** original F0 stylesheet and JS embedded only into the compiled standalone HTML via build/build-f7-07.py. The incremental ZIP deliberately does not replace the existing core.
