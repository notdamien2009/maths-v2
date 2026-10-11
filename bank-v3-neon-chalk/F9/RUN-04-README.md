# F9-04 — Sequence on a Graph · Run 04 REVIEW

Status: owner visual review required. This is not GOLD acceptance. No GitHub files changed.

## Mathematical purpose
Graph discrete sequence terms as (position n, term T(n)), see constant first differences for linear sequences, and growing first / constant second differences for quadratic sequences. Dashed connecting guides are visual trend aids; only integer n points are the sequence terms.

## Named lesson presets
- Y7-037: T(n)=2n+1; points (1,3) ... (5,11), +2 first difference
- Y8-019: T(n)=14−2n; points (1,12) ... (5,4), −2 first difference
- Y8-021: T(n)=n²+1; points (1,2) ... (5,26), first differences +3,+5,+7,+9 and second differences +2
- Y9-008: T(n)=n²−n+2; points (1,2) ... (5,22), second differences +2

## Modes / interactions
- Watch: 6 deliberate teaching states; positions → plot points → differences → straight trend → decrease → quadratic growth
- Guided: same Bob teaching steps controlled by the shared engine
- Explore: choose all four lesson presets; show 2–5 terms; toggle trend guide
- Challenge: plot two missing points in each of three tasks; drag coordinate cards onto correct plotted positions; re-grab placed points and drag into red remove zone; keyboard Enter on source then Enter on graph target, Delete to remove; hint and misconception feedback
- One canonical NOVA mascot dock and shared background texture / premium stage. No local F9 shell override.

## Packaging
Standalone HTML includes the **working F3 reference core** with embedded chalk fonts and mascots, plus F9-04 component source. The checked-in core/nova-core.js still lacks newer F3/F2 motion/drag functions. The reproducible `build/build_f904.py` therefore requires the repository's `F3/F3-01-array-builder.html`; this temporary integration compatibility must be reconciled before release. It does not modify shared core.

## Verified QA on this package
- Functional + visual tests: **72/72 PASS** at 380px and 1280px.
- Pointer and keyboard stress tests: **18/18 PASS**, including 1-frame fast drag, wrong drops, removal and successful re-placement.
- Screenshots: **18** covering Watch stages 1–6, Guided, Explore and Challenge at both widths.
- The colour tokens, chalk typography, neon plotting primitives, algebra background motif and mascot artwork all originate in the shared NOVA runtime.

## Open review gate
Owner must inspect visual consistency with F0 / F1 / F2 and F9-01 v3. Do not mark GOLD automatically. Do not produce or integrate F9-05 until the owner requests the next run.
