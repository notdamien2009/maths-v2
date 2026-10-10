# NOVA F3-09 · Evidence-Based Quality Report

**Status:** Technical QA passed; visual GOLD approval **pending owner review**.

| Build Guard | Evidence | Outcome |
|---|---|---|
| 1. Current canonical core, build placeholders | `core/nova-core.js` / `.css` SHA256 are `1e3a118e...` / `eaf043ca...`, identical byte-for-byte to the original current core used by F3-08; `build/F3-09.src.html` and `build/build.py` inline these into a self-contained HTML | Verified |
| 2. Only core drawing and interaction helpers | `src/F3-09.js:29,40–101`: `N.svg.root`, `N.neonPath`, `N.neonBox`, `N.neonRing`, `N.chalkText`, `N.ui.svgDrag`, `N.motion.arrive`, `N.scene.helperStrip`. The 3D shapes are isometric polygon data rendered through core `N.neonPath`; no handmade SVG filter, no new core style | Verified |
| 3. Mathematical fractions | `src/F3-09.js:106–109` uses `N.mt.render` on `27^{\\frac{1}{3}}=3` (proper stacked fraction), also visible on mobile in `.f309-frac`. Screenshot `shots/F3-09-380-fractional-index-stage.png`; numerator measured at 21.3px | Verified against approved fraction notation |
| 4. Premium neon depth and 380px layout | Core `N.neonPath`/`N.neonBox` give glass fill and glow. Actual stage screenshots `shots/F3-09-380-square-stage.png`, `shots/F3-09-380-cube-stage.png`, `shots/F3-09-380-challenge-complete-stage.png`, `shots/F3-09-1280-explore.png`. Stage responsive and no horizontal overflow in `tests/BROWSER-RESULTS.json` | Implemented; visual size/quality owner gate pending |
| 5. F0/F2-style pointer drag, removal, keyboard and recovery | `src/F3-09.js:85–95,122–147,165–174`; `tests/DRAG-RESULTS.json`, `tests/DRAG-NORMAL-RESULTS.json`: fast source placement, wrong drop, remove tile, Escape and isometric cube placement in both widths, all passed. `tests/CANCEL-RESULTS.json`: reversal/blur cancellation passes in both widths with zero stranded pieces | Verified for tested paths |
| 6. Mascots | `src/F3-09.js:26–29` routes **short** prompts and F0 pose states through `N.scene.helperStrip`; `shots/F3-09-380-challenge-complete-stage.png` shows the F0 bottom-right dock; Sir Bob narrations `src/F3-09.js:32–38`; F0 already embeds permitted character artwork | Canonical system used; expanded external pose manifests still unverified |
| 7. Hygiene | `src/F3-09.js:2–11` declares fixed event keys, `emit` rejects unknown keys; developer specs move under collapsed `details.nv-dev` at `src/F3-09.js:177–179`; labelled input and alternative buttons; no local game scoring; ready for F0-12 wrapper | Verified |
| 8. Self QA with evidence | `tests/BROWSER-RESULTS.json`: 8 mode/viewport checks with one SVG and one dock, no JS errors or page overflow. `tests/STRESS-RESULTS.json`: 188 mathematical assertions × 2 widths, 0 failures; complete 4, 8, 27 proofs at each width. `tests/DRAG-RESULTS.json`: 14 checks passed; `DRAG-NORMAL-RESULTS.json`: 14 checks passed. `CANCEL-RESULTS.json`: 2 width cases with active fast-reversal and clean blur cancellation. | Verified |
| 9. Owner acceptance | Side-by-side judgement against F2-01–03 and mouse feel must be signed off by owner. Exact expanded pose-manifest requirements cannot be verified from the supplied core. | **Not yet GOLD** |

## Mathematical review

- Both-dimensional volume is computed as **n³ = n × n × n**, square area as **n² = n × n** (`src/F3-09.js:12–23`).
- Each unit has a unique slot with index `z*n*n+r*n+c`, so the final figure is a solid volume, not 27 duplicates stacked into one position.
- The shape must be complete **and** the correct total supplied for Challenge (`src/F3-09.js:141–149`).
- A bug found in initial stress testing was fixed: for n=2,p=2, n×p equals n² accidentally; correct totals now take precedence over misconception rules (`src/F3-09.js:20`).
- Challenge numbers 4, 8 and 27 completed using keyboard at both viewport widths.

## Regression notes

The native fast-drag review caught an SVG label blocking pickup of a placed square. Setting the label to non-intercepting fixed re-grab and actual removal. Both normal motion and reduced motion runs were rerun and passed. No canonical F0 file was edited.

## Outstanding

1. Owner's visual review against F2 Premium Edition (including subjective appearance, spacing and stage-size target).
2. Optional exact pose-manifest verification if those extended asset packs are supplied.
3. Additional manual testing in the target learner environment is recommended before GOLD sign-off.
