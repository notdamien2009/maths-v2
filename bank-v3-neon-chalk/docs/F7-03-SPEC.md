# F7-03 — Collecting Like Terms · Engineering and Teaching Spec

**Status:** Premium review candidate; requires the owner's visual and interaction approval. **Not GOLD.**

## Curriculum and mathematical purpose
- **Y7-029** — Collecting like terms: simplify an expression by combining only terms whose variables and powers are identical.
- Year 7 signed coefficient extension; Year 8 consolidation; GCSE quadratic extensions are reusable presets, not newly asserted curriculum IDs.
- Mathematical invariant: sorting tiles does not change their type, sign, or signed coefficient. x², x and constants are never combined with each other.

## Four-mode contract
- **Watch:** four named teaching steps with canonical NOVA timeline and Sir Bob narration slots. Mixed expression → sort matching types → count each signed type → write the equivalent expression.
- **Guided:** same sequence under the canonical step/back/scrub controls.
- **Explore:** five numbered presets, drag individual tiles to x², x or 1 groups, R/Return-to-tray, undo and reset. Incorrect group drops spring back with a misconception-specific message.
- **Challenge:** four progressively harder signed/algebraic examples; the answer stays hidden until all tile types are sorted and a *collected* expression is entered. Terms may be reordered but repeated, uncollected terms are rejected. No separate game code.

## Parameters and presets
- Three tile types: x² (large square), x (long rod) and 1 (unit square); signed positive green and negative red/hatch. Up to ten terms in an expression, eight per single group. The shapes are symbolic evidence of distinct powers rather than a numerical substitution for x.
- Presets: `Y7-029` → `3x + 4`; `Y7-SIGNED` → `2x + 2`; `Y8-REVISIT` → `x + 4`; `GCSE-X2` → `2x² + x + 2`; `GCSE-SIGNS` → `−x² + 2x + 2`.
- Four Challenge rounds: `3x + 4`, `2x + 2`, `−2x + 3`, `2x² + x + 1`.
- Challenge traps: collecting x² with x; adding units to an x coefficient; dropping negative signs; leaving two uncollected x terms.

## Implementation
- Reuses **unaltered** F0 foundation `core/nova-core.js`/`.css`, same Neon Tube depth, NOVA Chalk, maths colour roles, and helper strip as F7-01/F7-02.
- Main apparatus fills the primary stage: desktop uses three equal type lanes under a mixed pool, mobile stacks the three lanes and keeps the Return tray visible.
- All stages use `NOVA.svg.root`, `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.motion`, `NOVA.ui.svgDrag`; `NOVA.scene.helperStrip` provides the canonical character visuals and short, step-specific prompts.
- Keyboard keys **1/2/3** place a focused tile in x²/x/unit, **R** returns it, **Enter** selects its own valid mathematical group. Accessible normal HTML buttons include an optional “Sort next matching tile” for pupils who cannot drag. Parent bank Watch/Guided timeline, events, motion reduction and printing remain untouched.
- Source files: `src/F7-03.js`, `src/F7-03.css`, `build/F7-03.src.html`; deterministic build script `build/build-f7-03.py`. Standalone `F7/F7-03-collecting-like-terms.html` embeds the unchanged F0 core.

## Acceptance and limitations
- Benchmarks: F2-01 to F2-03 premium neon depth plus actual F7-01/F7-02 local screenshots, all four modes at mobile/desktop.
- Automated QA alone cannot certify accessibility or human look-and-feel. Owner stress test, visual sign-off and live lesson-shell integration remain pending.
- Existing family F7-01 and F7-02, their sources, core, and GitHub have not been modified.
