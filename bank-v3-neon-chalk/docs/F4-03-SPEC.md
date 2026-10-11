# F4-03 · Cuisenaire-Rod Builder · Run 03 specification

**Status:** Premium implementation for owner visual review, not owner-approved GOLD.

**Purpose:** Different rod partitions can express the same whole length. A 6-unit rod aligns with three 2-unit rods. Each 2-unit rod is one of three equal parts of the whole. Fraction notation is rendered as stacked `\frac{2}{6}=\frac{1}{3}` using current `NOVA.mt.render`.

**Relevant KS3 mapping:** Year 7 Y7-019, Fractions as Numbers. Supports later equivalence, fractions of quantities and ratio. Lesson mapping is a candidate until curriculum verification.

**Parameters:** length `1–10` per rod; two snap tracks, each up to 10 unit lengths; 1 unit is 76 SVG units; source tray 10 labelled rods (miniature bars proportional to length).

**Modes:** Watch (7 teaching steps; narration), Guided (same stepped evidence), Explore (build and rearrange two trains), Challenge (3 mathematically checked constructions).

**Interactions:** F2 canonical svgDrag with valid green zones / red remove zone, snap, cancel, high-speed mouse movements, keyboard Enter to add; Delete/Backspace to remove; Left/Right reorder; Up/Down switch tracks when the target length fits. Buttons permit rod selection and adding without mouse.

**Challenge problems:**

1. Upper 6 from a single rod, lower 6 from three identical rods. Correct example `[6]` vs `[2,2,2]`; rejects `[1,2,3]`.
2. Upper 8 from two rods of different lengths, lower 8 from a single rod. Correct example `[3,5]` vs `[8]`; rejects `[4,4]`.
3. Bottom 10, top *half* its length, top uses at least two rods. Correct example `[2,3]` vs `[10]`; rejects `[5]` vs `[10]`. The half target is hidden (`TARGET ?`) until learner reasoning.

**Misconceptions:** counting rods rather than total unit lengths, confusing equal number of rods with equal lengths, treating unequal partitions as thirds, and treating a single 5-unit rod as a 2-rod decomposition in Challenge 3.

**Drawing and typography:** Existing F0-approved core unchanged: `N.svg.root/grid/brace/pill`, `N.neonBox/neonLine/neonRing`, `N.chalkText`, `N.mt.render`. Every length carries a printed number as a second colour cue. Do not import a different drawing style or background.

**Acceptance:** Compare with F4-01/F4-02 and F2 Premium at 380 and 1280 for all four modes, check actual mouse/touch feel, and obtain owner GOLD sign-off. Physical assistive technology testing remains pending.
