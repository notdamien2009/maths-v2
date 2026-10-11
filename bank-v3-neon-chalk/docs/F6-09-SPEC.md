# F6-09 — Inverse Proportion Rectangle

## Engine purpose
NOVA KS3 Maths family F6. Make inverse proportion visible and mathematically provable: **width × height = fixed area**, so **height = K / width**. Different rectangles have the same number of equal square units. Plotting the same (x,y) pairs yields the reciprocal curve.

## Presets / curriculum
| Preset | Fixed area K | Permitted widths | Default width × height |
|---|---:|---|---|
| Y8-037 inverse tables | 24 | 2,3,4,6,8,12 | 4 × 6 |
| Y9-013 reciprocal graph | 36 | 3,4,6,9,12 | 6 × 6 |
| Y9-019 algebraic inverse | 48 | 4,6,8,12,16 | 8 × 6 |
| Y9-020 direct vs inverse | 30 | 2,3,5,6,10,15 | 5 × 6 |

Each preset labels and computes width, height and area correctly; no fixed-area rectangle can have nonpositive dimensions.

## NOVA compatibility
The exact approved F0 JS/CSS is not modified and not included in this incremental ZIP. Its immutable SHA-256 is asserted by `build/build-f6-09.py`. Neon drawings use NOVA.neonBox, neonLine, neonPath, neonRing, chalkText and numberLine (both horizontal and vertical graph axes). The graph uses the exact K/x coordinates. Fonts and semantic role colours come only from approved F0. Six distinct teaching stages and captions; the helper strip uses existing F0 poses.

## Four modes
- **Watch:** Six Sir Bob stages: identify constant area → stretch → squash → show invariant → plot pairs → trace reciprocal curve. Narration text per step; NOVA core timeline handles play, pause, stepping, scrub, reset and reduced motion.
- **Guided:** Same six stages, through NOVA core guided timeline.
- **Explore:** Grab neon corner and drag to one of the labelled widths, with green snap feedback and red return zone; keyboard ArrowLeft/ArrowRight, Delete/Escape, check/hint/reset. Counter rectangle stretches/squashes but exact product remains constant; graph and side cards re-render with the new pair.
- **Challenge:** One two-value question for each four presets; calculate missing height and verify area. Missing height intentionally hidden before marking. Diagnose direct-multiplication, mistaken equal sides, subtraction, empty answer, wrong invariant. Emits value/step/correct/hintUsed events.

## GCSE extension
Reciprocal functions, proportionality constants, interpreting inverse models, contrast with y=kx. Games remain in the F0-12 wrapper rather than engine.

## Acceptance status
Tested mathematically, in headless Chromium on 380px and 1280px, and responsive collision checks at 380,430,768,1280; real physical mouse drag on 380/1280. Owner visual approval and native touch/lesson integration remain outstanding. Full evidence and screenshots included.
