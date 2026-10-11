# NOVA Master Visual Engine F6-05 — Recipe Scaler

**Review candidate — not GOLD.** Grounded in the Family F6-05 prompt, using the unchanged approved F0 v3.6.2 Neon Tube + Chalk core.

## Maths purpose and coverage

Direct proportion: changing serving numbers must multiply EVERY ingredient by the same scale factor, so ingredient quantity per serving is invariant. KS3 Year 7 **Y7-060 Direct proportion**; Year 8/GCSE extensions can add non-integral targets or price/mass constraints.

## Parameters and presets

`minServings=2, maxServings=10`, starting-serving quantity, target-serving quantity, 4 ingredient names, original amounts, units and icon hints. `F605_CONFIG` lists named recipe presets:

- `Y7-060` pancakes 4 → 6, scale 1.5: flour 200→300 g, milk 320→480 ml, eggs 4→6 eggs, berries 120→180 g.
- `Y7-060-double` fruit bowl 4 → 8, scale 2: strawberries 200→400 g, yogurt 240→480 g, oats 80→160 g, bananas 4→8.
- `Y7-060-half` oat bars 6 → 3, scale 0.5: oats 240→120 g, milk 300→150 ml, bananas 6→3, honey 30→15 g.
- `Y7-060-triple` smoothies 3 → 9, scale 3: mango 90→270 g, milk 150→450 ml, yogurt 180→540 g, bananas 3→9.

## Named teaching steps and animation

1. Read the original batch quantities.
2. Change servings without changing recipe balance.
3. Calculate new servings ÷ base servings.
4. Count up the first multiplied ingredient amount.
5. Stagger the remaining ingredient amounts using NOVA.motion.tween / NOVA.motion.delay.
6. Prove proportionality with constant per-serving amount.

Four modes: Watch autoplay, Guided stepped, Explore manipulation, Challenge original answers hidden until correct. Watch and Guided use the shared F0 stage timeline with controls and Sir Bob narration slots. Reduced-motion preference reveals final stage values without animation. No game loop; the F0-12 wrapper remains separate.

## Mathematical interactions

- Draggable SVG servings slider snaps to 2–10 via NOVA.ui.svgDrag. Arrow keys or alternate HTML range control supported.
- 4 ingredient targets accept dragged value chips. Keyboard: focus a chip and press 1–4 for destination row.
- Re-grab placed value and drag to the red return tray, or press Delete. Hints and reset available.
- Explore checking marks all four rows against the same factor; incorrect values receive corrective feedback.
- Challenge requires all four scaled amounts with units displayed, then proceeds to the next of four scenarios. Prevents accidental premature answer reveal.
- Emits `value`, `step`, `correct`, `hintUsed` through F0 events.

## Misconceptions targeted

Adding the serving-count difference instead of multiplying; applying different multipliers; reversing factor (original/new instead of new/original); leaving an ingredient unchanged; losing or mixing units; confusing an amount per person with an entire batch.

## Visual system and dependencies

Exact current F0 premium core SHA-256 hashes enforced by `build/build-f6-05.py`; build renders one fully standalone HTML with embedded fonts, neon drawing and mascot assets. No changes to core; new rules scoped under `#F6-05`. Responsive mobile-first view, colour plus geometric visual distinction, reduced motion, keyboard controls, print fallback. Links to F6-01/02/03/04 and the F0 foundation.
