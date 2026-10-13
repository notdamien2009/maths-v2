# F8-18 — Algebraic Working and Function Engine: Iteration and Trial-and-Improvement

Source: `bank-v3-neon-chalk/00-master/NOVA-MASTER-FOR-OTHER-AI.md`, section `F8-18`.

- **Purpose:** approximate solutions to increasing continuous equations by trial, evaluation and narrowing a sign-changing interval; justify rounding accuracy.
- **Audience:** GCSE numerical-methods extension. No mapped KS3 lesson is specified in the master; no mapping is invented.
- **Parameters:** expression preset, lower/upper bounds, `f(x)`, target rounding (2 or 3 dp), trial count.
- **Visual:** canonical F0 `NOVA.numberLine` (not custom-drawn), glowing guess ring, live endpoint rings and interval, neon glass trial table (last three rows), named mathematical sign badges, premium chalk labels. No additional drawing primitives or fonts.
- **Teaching progression:** (1) bracket a root (2) choose trial (3) evaluate `f(x)` (4) classify high/low (5) keep the root inside smaller interval (6) agree both endpoint rounding values.
- **Interaction:** drag trial ring on number line, numeric input as touch/keyboard alternative, Enter to test, Undo, Restore defaults, return-to-tray, Hint, final accuracy validation.
- **Four modes:** Watch, Guided, Explore, Challenge, all via canonical NOVA bankMount.
- **Correct:** bracket preserved, at least three trials unless an exact root is obtained, and both endpoints round to same specified precision. Final number must equal that proved value.
- **Misconceptions:** sign of `f(x)` versus direction, rounding prematurely, x cubed versus x times 3, 2x² versus (2x)².
- **Presets:** SQUARE-TWO (1.414 to 3dp), SQUARE-FIVE (2.24 to 2dp), CUBE-FIVE (1.710 to 3dp), CUBIC-X (1.52 to 2dp), DOUBLE-SQUARE (1.871 to 3dp), CUBIC-SUM (1.38 to 2dp).
- **Linked:** F0-02/F0-03/F0-05/F0-07/F0-08; F8-09/F8-11/F8-12.
- **Accessibility:** keyboard move and Enter; labelled numeric inputs; reduced motion; fallbacks and alt descriptions via F0 helper.
- **Mascots:** F0 reusable Sir Bob/Pip/Nova poses and step-specific narration slots. Izaac is available in the canonical Challenge skin when the installed F0 core supplies it.
- **Out of scope:** new maths renderer, new mascot art, replacing F0 core, or future curriculum mapping.
