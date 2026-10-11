# NOVA KS3 Maths · F4 Run 05 · Fraction-of-Amount Bar

**Status: PREMIUM REVIEW — awaiting owner visual acceptance.**

## Install into your existing source folder

Extract the zip at the level containing `bank-v3-neon-chalk/`, then merge its contents into your existing `bank-v3-neon-chalk/` folder. This package ADDS the new `F4/F4-05-fraction-of-amount-bar.html`; it **does not overwrite the approved F5-11, any F0–F4 component, or shared core**.

Open `F4/F4-05-fraction-of-amount-bar.html` directly in a modern browser. No network or external libraries are required.

## Design

F4-05 is an **F5-11 presentation preset**, not a second mathematical engine. The standalone HTML is derived from the exact approved F5-11 standalone source (Git blob `4282e9b62175b51b0fd3dc65bb0a10b9ae5765d6`), with a local bar-view renderer. It intentionally retains `F5-11` as the underlying engine ID, mathematical model, challenges, grading and event contract. This keeps the code compatible with the existing core and avoids conflicting implementations.

The bar represents the original amount as one length partitioned into `d` equally sized portions. The numerator `n` chooses portions. Each portion has exact value `amount ÷ d`, using existing F5 rational arithmetic, including fractional amounts. In guided mode, a staged reveal shows whole, partition, one part, selected parts, and exact result. Explore has snap-and-return of segment handles, a unit-value chip, adjustable numerator, denominator and amount, and keyboard equivalents. Challenge inherits three assessed problems from F5-11, with results hidden until correctly answered. Supports Watch, Guided, Explore, Challenge, reduced motion, and 380px/1280px.

The existing Sir Bob narration comes from F5-11; the F4-05 mascot dock uses short task-specific encouragement.

## Files delivered

- `F4/F4-05-fraction-of-amount-bar.html` — **self-contained review build**.
- `src/F4-05.bar-preset.js` — additive presentation adapter, no independent mathematics engine.
- `build/build-f4-05.py` — deterministic builder using existing local `F5a/NOVA-F5-11-PREMIUM-REBUILD-v1.html`.
- `shots/F4-05/` — eight actual Chromium screenshots (four modes × two widths).
- `tests/` — browser, exact-maths, challenge, keyboard, normal/reduced-motion, fast-drag and cancellation tests; JSON evidence.
- `docs/F4-05-SPEC.md`, `QA-REPORT-F4-05.md` — specification and acceptance evidence.

## Rebuild

From `bank-v3-neon-chalk/`:

```bash
python build/build-f4-05.py
python tests/test_f405.py
python tests/test_f405_drag.py
```

Rebuild requires your original `F5a/NOVA-F5-11-PREMIUM-REBUILD-v1.html`. The source file is **not duplicated in this ZIP**. If it is missing or has changed, the builder stops rather than silently importing a different engine. The standalone F4-05 HTML works independently of the builder.

## Owner acceptance

This is a technical-review deliverable, **not yet GOLD**. Inspect actual maths/visual size, mascot continuity and mouse feel side by side with F0/F2/F4 benchmarks at 380px and 1280px before approval. No GitHub files have been edited.
