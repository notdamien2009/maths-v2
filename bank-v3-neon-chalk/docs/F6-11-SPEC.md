# NOVA F6-11 — Rates-of-Change Tank / specification card

**Maths purpose:** Link a physical accumulation model to its graph gradient and units; develop transfer to compound speed and density without swapping axes incorrectly.

**Year groups:** Y8-028 gradient; Y8-041 speed; Y8-042 density; Y9-022 compound speed/rates; Y9-023 density and mass-volume reasoning. GCSE extension: positive constant gradients, proportional reasoning, compound units.

**Parameters:** lesson preset, rate multiplier (0.5, 1, 1.5, 2), baseline rate, independent variable maximum and units, graph progress, answer correctness. Core `window.F611_CONFIG` is exposed.

**Animation/storyboard:** eight Sir Bob stages: notice the tank → open tap → compare intervals → depth rises → graph traces → calculate rate → test a new rate → check tank/graph evidence. F0 playback and reduced motion apply; verbal slot per step in `STEPS`.

**Drawing:** F0 neon boxes/rings/paths and approved chalk labels. Fill level proportion `rate × interval / maximum capacity`. Graph uses inherited `NOVA.svg.axes`, with reduced tick density. Maths drawing and draggable controls are separate F0 SVGs to avoid inherited glow clipping on mobile.

**Explore:** Drag F0 tap-rate ring to 4 rate targets; drag one of 4 geometrically distinct slope cards into green MATCH HERE zone. Wrong and right comparisons have targeted feedback; red RETURN removes graph selection. Keyboard arrows and Enter/Delete alternatives.

**Challenge:** Five assessed problems requiring numerical gradient, correct compound units and correct graph slope. Correct answers hidden before submission; explanations and revealed proof after success. Wrong-answer traps: rate inversion, total change rather than rate, incompatible units and wrong gradient.

**Preset contexts:** Y8-028 depth(cm) vs time(min), Y8-041 distance(km) vs time(min), Y8-042 mass(kg) vs volume(L), Y9-022 distance(km) vs time(min), Y9-023 mass(kg) vs volume(L). F6-11 is a conceptual tank/metre visualization: the two speed contexts use the same accumulating-quantity analogy, not a literal vehicle in a tank.

**Linked components:** F0-02, F0-04, F6-09, F6-10, later F10-05/F18-08. Not a game; F0-12 wraps games externally.

**Accessibility:** Keyboard alternatives, svg alt text, print fallback from original F0, reduced motion, geometrically different graph slopes as a non-colour cue.

**Owner acceptance:** Premium review, not GOLD; native touchscreen and integrated lesson-shell QA outstanding.
