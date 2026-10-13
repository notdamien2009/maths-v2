# F10-08 Graph Intersections — premium Build Guard QA

**Review status:** PASS for automated implementation checks; **owner review still required**. This is not GOLD approval. No GitHub update.

## Results against the exact packaged HTML

| Test matrix | Passed | Failed |
|---|---:|---:|
| 380px, regular motion | 34 / 34 | 0 |
| 380px, reduced motion | 34 / 34 | 0 |
| 1280px, regular motion | 34 / 34 | 0 |
| 1280px, reduced motion | 34 / 34 | 0 |
| Teaching sequence: 10 steps × 2 widths | 20 / 20 | 0 |
| Responsive: 4 modes × 320/380/768/1280px | 16 / 16 | 0 |
| **Total** | **172 / 172** | **0** |

## Visual and interaction checks

- Real browser captures produced for Watch, Guided, Explore and Challenge; at 320, 380 and 1280 widths. 
- F0/F1-aligned neon-framed mathematical teaching stage; navy patterned background; existing embedded NOVA helpers; no empty background omission seen in previous F10-01.
- The intersection coordinates are visible on mobile in Explore and hidden before marking in Challenge.
- Five lesson preset equations matched independently against their exact or approximate intersections.
- Quadratic roots, tangent single touch, no real crossing, parallel-no-solution and coincident-infinite cases tested.
- Explore reading marker: native NOVA SVG drag with snapping; keyboard arrows; Escape cancellation and recovery.
- Equation-to-graph cards: correct and incorrect matching, click/keyboard fallback, **real pointer drag into target and back to the red tray**; no card left stranded.
- Challenge: incorrect x/y ordering, two x roots, contextual positive time, approximate positive line/quadratic crossing, and extrapolation. No answer-chip leaks before marking.
- No JavaScript page errors were captured during completed test suites. No horizontal document overflow in responsive testing.
- Exact offline HTML rebuilt **byte for byte** from the source template and JS/CSS with the known matching F0/F1 shared core.

## Pedagogical safeguards

- A solution coordinate must satisfy **both** plotted functions; exact line-line cases have correct results.
- Roots of y = x² − 4 are (−2, 0) and (2, 0); (0, −4) is the turning point, **not** a root.
- The positive Y9-018 intersection is approximately (2.56, 4.56), with numerical marking tolerance 0.055.
- Y9-051 trend threshold is x = 4, **outside** measured x = 0…3; it is a cautious extrapolation rather than a certain measured fact.
- For coincident curves, describe infinitely many shared points, not an extra parallel no-solution case.
- Reduced motion is honoured in the core animation calls; the drawing's final mathematical state remains available.

## Integration / outstanding notes

1. This self-contained review HTML is the tested build and works offline. The editable source rebuild **requires** a local `core/nova-core.js` with the NOVA SVG drag, axes, motion and premium APIs already used by the newer self-contained F10 files. If your checked-in core lacks one, `build/rebuild_F10-08.py` deliberately refuses rather than silently changing the visual renderer. This is an integration dependency, not an untested missing file in the ZIP.
2. The drag-card matching zones use a mobile-friendly native pointer interaction and accessible click/keyboard alternative, while the mathematical SVG reading-marker drag uses `NOVA.ui.svgDrag`. No separate duplicate graph renderer is registered.
3. Visual judgement and final learner stress-test remain with the owner. Automated QA does not certify teaching GOLD quality; it supplies reproducible evidence for owner approval.

## Evidence

See `QA-INTERACTIONS-*.json`, `QA-STEPS.json`, `QA-RESPONSIVE.json`, their test scripts and the `screenshots/` directory.
