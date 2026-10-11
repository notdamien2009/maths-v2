# F10-05 — y = mx + c Explorer — Run 05 premium review spec

**Source of requirements:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, section `F10-05 y = mx + c explorer`; F6-08 exact data from `presets/F10-05/F6-08-direct-proportion.preset.js`.

**Maths purpose.** Link the algebraic line `y = mx + c` to its graphical effect: `m` is rise per one unit run, and `c` is where the line crosses the y-axis at x = 0. Explore positive, zero, fractional, negative gradients, parallel lines, simultaneous-equation crossing and the proportional `c = 0` special case. No erroneous interpretation of an intercept as a point on the horizontal x-axis.

**Year groups.** Y7-039, Y7-060; Y8-022, Y8-023, Y8-024, Y8-025, Y8-029, Y8-032; existing F6-08 host presets Y8-035, Y8-036, Y9-020. The master mentions "plus 8 more lessons" without naming them; their identities are NOT invented in this run. Y9-020 is marked GCSE bridge in original F6-08 config.

**Parameters.** `m` in [-3,3], `c` in [-4,4], increments 0.5 (direct proportion m in [0,3] with c locked at 0). Negative/positive coordinate view: x [-5,5], y [-8,8]. Positive-scale views preserve F6-08 max bounds and y-steps: Tickets [6,12] step 2; Stickers [6,18] step 3; Distance [8,12] step 1.5; Proportion signature [8,6] step .75.

**Storyboard.** 1 Meet axes; 2 Locate zero; 3 Find intercept; 4 Measure one step; 5 Reveal gradient; 6 Change gradient; 7 Change intercept; 8 Generalise the rule. Each step has purpose-specific Bob helper narration/pose and mathematical reveal, with reduced-motion compatibility through NOVA motion.

**Interactive controls.** Watch / Guided / Explore / Challenge; gradient and intercept sliders, drag-and-snap handles based on NOVA.ui.svgDrag, keyboard arrows, reset; origin-lock in F6-08. Explore shows comparative parallel/second straight line/curve where relevant.

**Challenge definitions.** (1) Read c from a line with missing c, numerical exact within 0.001; (2) change line to m = -1 while c = 1, exact half-step placement; (3) y=2x with x=5 implies 10, exact within 0.001. Misconception feedback distinguishes intercept from x-coordinate, slope sign and additive fixed fees in direct proportion. No hidden numerical answer displayed in Challenge captions/side evidence.

**Linked components.** F0-02, F0-14 canonical renderers; F6-08 preset-only host adapter (not a duplicate engine); F10-04 table-to-graph; future F10-06 gradient, F10-07 parallel, F10-08 intersections, F10-12 quadratic.

**Visual contract.** Premium framed layered navy stage with mathematical motif, raised neon equipment, NOVA Chalk annotations, live SVG axes via core, full-size plotting world and original Pip/Nova/Izaac mascot packs. Responsive stack at 320/380; desktop proof cards beside graph at 768/1280. No generated or standalone font files.

**Review status.** Premium REVIEW, awaiting owner approval. No GitHub changes. Separate F10-01 background correction remains open.
