# NOVA F4-06 — Evidence-based QA report · Run 06

**Current status:** Automated checks passed. Owner's visual GOLD approval **pending**. GitHub read only; no commit or push performed.

## Test results

| Test | Evidence | Result |
|---|---|---|
| Browser + maths + challenge flows | `tests/test_f406.py`, `tests/F4-06-BROWSER-RESULTS.json` | **148/148 passed** |
| Real mouse drag + cancellation | `tests/test_f406_drag.py`, `tests/F4-06-DRAG-RESULTS.json` | **56/56 passed** |
| Mobile + desktop screenshots | `shots/F4-06/F4-06-{380,1280}-{watch,guided,explore,challenge}.png` | 8 rendered captures, no horizontal overflow |
| Extended percentage and inverse mode | `shots/F4-06/F4-06-{380,1280}-{135percent,reverse}.png` | 4 extra rendered captures |
| Build and immutable shared core | `build/build-f4-06.py`, SHA-256 verification | Core untouched; reproducible inline build |

**Total passed: 204 / 204 automated checks**, independently executed in headless Chromium. This is technical evidence, not owner approval.

## Nine F5 build guards

1. **Current core**: all visual features use the source core whose JS SHA-256 is `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21` and CSS SHA-256 is `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`. The build script checks both. The existing core is NOT shipped for overwrite.
2. **Helpers only**: `src/F4-06.js` uses `NOVA.numberLine` twice, `NOVA.neonBox`, `NOVA.neonRing`, `NOVA.neonLine` for mathematical correspondence, `NOVA.chalkText`, `NOVA.ui.svgDrag`, `NOVA.scene.helperStrip`, `NOVA.neonCard`. No handcrafted number-line ticks or new SVG primitive.
3. **Fractions**: this percentage engine expresses percentages with `%` and amount labels; it does not render raw inline fraction teaching notations or the deprecated fraction-TBD placeholder. Approved NOVA stacked fraction notation remains authoritative for future F4/F5 integrations.
4. **Neon depth and stage**: `src/F4-06.js` stage uses core glass/neon apparatus and NOVA Chalk. `shots/F4-06/` contains mobile and desktop visual evidence with ten complete segmented cells and an aligned amount scale.
5. **Drag**: `tests/test_f406_drag.py` checks real pointer moves, 2-step fast drag, placement, valid/red target, invalid spring-back, Escape, re-grab, keyboard Enter/Delete and arrows in both motion settings, 380 and 1280 pixels. **56/56 pass**.
6. **Mascots**: source uses `NOVA.scene.helperStrip` with the existing approved F0 artwork, short contextual speech and changing poses. Sir Bob handles detailed narration in `STEPS`; later challenges reset stale feedback using the engine's existing `api.bob`.
7. **Hygiene**: event keys fixed in `F406_CONFIG.events`; developer specification enclosed in `details.nv-dev`; no scoring code; all pupil-facing controls have accessible labels.
8. **Self-QA with evidence**: `tests/F4-06-BROWSER-RESULTS.json` and `tests/F4-06-DRAG-RESULTS.json` log named pass/fail entries. Screenshots cover all modes at two widths; the extra reverse screenshot proves hidden original amount.
9. **Owner acceptance**: still **PENDING**. Side-by-side visual review against approved F2 premium examples and a final user's mouse/touch test are required before changing status to GOLD.

## Verified mathematical routes
- 35% × £240 = **£84**; 135% × £80 = **£108**, requiring a visible extension beyond 100%.
- £144 is 120% of original → £144 ÷ 1.2 = **£120**; amount axis hides unknown original until solution.
- £400 at 5% simple interest for three years → £400 + 3 × £20 = **£460**, *not* compounded growth.
- 40% of £240 = £96; 37% = £88.80 with 1% snap; 33% with 10% snap resolves to 30% = £72.
- Other presets: +25% of £80 is £100, −15% of £200 is £170, 90% of £230 is £207.

## Outstanding
Owner's design/interaction sign-off. No evidence of real pupils using the engine was gathered. Do not label GOLD until approved by owner.
