# NOVA F8-13 | Algebraic Index Laws (F3-10 preset)

**Premium review candidate — NOT owner GOLD**. Additive package only; no GitHub files have been changed.

## Open and inspect now
`F8/F8-13-index-laws-in-algebra.html` is the standalone F0-derived premium review preview. It runs without external libraries. It demonstrates six algebraic cases, Watch/Guided/Explore/Challenge, NOVA mascots, factor strips, real drag/undo/reset and misconception feedback.

## Produce the true canonical F3-10 preset
From the existing `bank-v3-neon-chalk` directory, with F3-10 already installed from your GitHub checkout, run:

```bash
python build/extend-f3-10.py
```

This reads **your existing `src/F3-10.js`, `src/F3-10.css`, `build/F3-10.src.html`, `core/nova-core.js` and `core/nova-core.css`**, adds named algebraic presets in memory, and creates a separate launcher:

`F8/F8-13-F3-10-canonical-preset.html`

It **does not modify** the original F3-10 JS/CSS, the F0 core, other F8 components or GitHub, and **does not create another independent production maths engine**: the generated launcher runs the F3-10 engine with algebraic presets. The source patch is deliberately guarded and stops if the canonical F3-10 anchors change.

## What was verified here
The preview passed **378 maths**, **84 browser/Challenge**, **32 real-pointer**, **120 responsive** checks. The current GitHub F3-10 original source and required patch anchors were read and checked. The generated canonical F3-10 launcher was not executed here because the original standalone F3-10 files were not present in the working runtime.

See `docs/F8-13-QA-REPORT.md` for evidence and limitations. Final owner approval requires opening the canonical rebuilt launcher in Edge, comparing it against accepted F0/F2/F3/F12, and stress-testing a real touchscreen.
