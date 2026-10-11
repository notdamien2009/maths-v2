# NOVA F10 — Run 02 / F10-02 Shape on grid

**Status: Premium review candidate. Not GOLD-approved. GitHub untouched.**

Open `F10/F10-02-shape-on-grid.html` in your browser to test. This is an offline, self-contained page with the approved NOVA core embedded into it at build time. Original shared core is NOT duplicated or modified in this ZIP.

## Install after owner approval

Copy `build/F10-02.src.html` and `src/F10-02.*` into the same paths in your repository. To rebuild with the current repository core, copy `build/rebuild_F10-02.py` and run from the bank root:

```bash
python build/rebuild_F10-02.py
```

This creates `F10/F10-02-shape-on-grid.html` and does not push to GitHub. Do not replace existing core files; the component is designed to use your approved local core.

## Modes and lessons

- Watch/Guided: seven mathematical teaching stages, original triangle and four transformations.
- Explore: control translation, reflections, quarter-turn rotations, enlargement/shrinkage and individual source vertices. Pointer drag and keyboard arrows snap to the exact coordinates.
- Challenge: place all three *image* vertices for three exact mathematical transformations. Feedback targets misconception errors; right-side evidence shows current answers only. Izaac peer mascot.
- Presets: Y7-038, Y7-052, Y7-053, Y7-054, Y8-053.

## Design inspection

Compare its coordinate studio against the F0-02 SVG Primitives benchmark at 380 and 1280 px. Source controls, framing, background, geometry motif and existing Pip/Nova/Izaac helper art must remain visually cohesive with F0/F1/F2/F3. The new F10-02 studio adds no external fonts, images, or new SVG drawing primitive.

## Known limitation

F10-01 from Run 01 has an inadequate maths-stage background and is separately flagged for an owner-requested correction; do not use the old F10-01 appearance as the benchmark for this component.
