> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# NOVA F8-12 — Quadratic Solve Routes · Component Specification

**Status:** PREMIUM REVIEW CANDIDATE — not GOLD, not owner-approved, not production-integrated.
**Family:** F8 · Algebraic Working and Function Engine.
**Master source:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md` → `F8-12 Quadratic solve routes`.

## Learning purpose
Make the same two roots visible through three correct mathematical representations:
1. factorise the original quadratic and use the zero-product rule;
2. substitute `a`, `b`, and `c` into the traditional *stacked* quadratic formula;
3. identify the two x-axis intersections of the same quadratic in the core Cartesian plot.

## Presets

| Preset | Quadratic | Roots | Vertex | Discriminant |
|---|---|---|---|---|
| Y8-031-A | x² − 4 | −2 and 2 | (0, −4) | 16 |
| Y8-031-B | x² − 4x + 3 | 1 and 3 | (2, −1) | 4 |
| Y9-011-A | −x² + 2x + 3 | −1 and 3 | (1, 4) | 16 |
| Y9-011-B | x² + 2x − 3 | −3 and 1 | (−1, −4) | 16 |
| Y9-011-C | 2x² − 2x − 4 | −1 and 2 | (0.5, −4.5) | 36 |

## Animation and pedagogy
Seven named teaching steps: meet the quadratic → build factor pair → zero-product rule → read the quadratic formula → evaluate the discriminant → locate graph roots → verify both solutions.
The mathematical chart uses `NOVA.neonPlot` with a curve composed using `NOVA.neonPath`, the factor/evidence panels use `NOVA.neonBox`, and writing uses `NOVA.chalkText`. The fraction bar uses `NOVA.neonLine` and is **not** the deprecated fraction-TBD placeholder. Step narration and mascot reaction vary appropriately.

## Interaction
Root rings are NOVA neon rings. Drag onto either x-axis intercept; re-grab, remove into the red tray, or use arrow keys in 0.5 increments. Choose a route (factor / formula / graph), enter two x-values and check. Rings and answers can be entered in either order. Rejects incomplete work, vertex-as-root error, sign errors and incorrect ordered root sets. After success, the factorisation and numerical formula work become visible; no early answer in Challenge.

## GCSE extension and dependencies
The negative-leading-coefficient and non-monic cases extend the work to GCSE factorisation/formula. Core shared dependencies: F0-02/03/04/05/07/08/14; representations draw on F3-02, F7-04, F8-10.

## Rebuild
Keep the `bank-v3-neon-chalk` folder name and contents. Merge this ZIP **without replacing `core/`**. From the bank folder, run `python build/build-f8-12.py`. This compiles the self-contained HTML from the owner's own `core/nova-core.js` and `core/nova-core.css` and F8-12 source. The packaged standalone HTML is for preview; the rebuild against the user's current repo core has not been executed in this environment.
