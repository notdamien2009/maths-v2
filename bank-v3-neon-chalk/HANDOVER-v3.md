# NOVA Bank v3.x — Handover (10 Oct 2026)

## Current state
All 17 F0 foundation engines (F0-01 … F0-17) are built in the locked **Neon Tube + Chalk** house style (core v3.x).

| Status | Engines |
|---|---|
| APPROVED by owner | F0-01, F0-02, F0-03, F0-06, F0-09, F0-10, F0-12, F0-13 |
| Premium pass done, awaiting owner review | F0-04, F0-05, F0-07, F0-08, F0-11, F0-14, F0-15, F0-16, F0-17 |

**Next:** F1 (Number line and scale engine) starts **only when the owner says go**.

## House style (locked)
- **Drawings:** Neon Tube via the core helpers only. No dark frame or box behind diagrams.
- **Two chalk fonts**, both embedded as **NOVA Chalk** (Kalam Bold, SIL OFL 1.1, subset in `core/nova-core.css`):
  - `--nova-font-chalk-draw`: labels inside drawings (numbers, angles, A B C, hop pills). Scratchy, uses the `nv-chalk` texture filter.
  - `--nova-font-chalk-write`: written maths away from drawings (equations, working, questions, answers, feedback). Smooth bold with neon glow (`--nv-chalk-glow`).
- No Inter or serif on stage maths. UI buttons and tabs may stay Inter.
- **Markers:** a neon ring, never a star.
- **Number lines:** a straight neon line at every digit, centred above the label.
- **Role glyphs** (★ ■ ◆ ✓ ◌ ▲) are never attached to maths text or values; colour only. The core maths text renderer does not output them. Glyphs only appear in explicit colour-key legends (F0-01). Feedback ticks and crosses and the F0-12 game stars are allowed.
- **Written maths:** powers and exponents are small and raised top-right of the base, like handwriting (core `.mt-sup`).
- **Helper:** no box behind the helper.
- **Arcs:** the 360° arc draws a full circle, and the slider reaches 360.
- **Triangles:** all three sides are drawn.
- **Fractions:** neutral placeholder tagged "fraction design TBD" (`.nv-frac-tbd` / `.nv-tbd-tag`) until the fraction design is decided.
- **Developer code** (LaTeX / markup) is hidden from pupils behind a collapsed "Developer: show code" toggle (`details.nv-dev`).
- **Pupil-facing screens** must be fully premium in all 4 modes at 380px and desktop: controls, inputs, feedback, ticks and crosses. No empty stage areas, nothing overlapping the maths.
- **Print** (F0-17 and `@media print`) stays clean black and white with no glow.
- **F0-08 narration visuals** must follow the owner's Bob board: `ref/bob-board.html`.

## Core helper API (core/nova-core.js)
- **Neon drawing:** `NOVA.neonLine(p,x1,y1,x2,y2,o)`, `neonPath(p,d,o)`, `neonBox(p,x,y,w,h,o)`, `neonRing(p,x,y,o)`, `neonMark(p,x,y,ok,o)`, `neonPlot(svg,o)` (neon `NOVA.plot.frame`).
- **HTML chips and cards:** `NOVA.neonTile(text,o)`, `neonCard(children,o)`, `answerChip(text,ok)`.
- **SVG chalk text:** `NOVA.chalkText(p,x,y,text,o)`.
- **SVG kit:** `NOVA.svg.root / axes({numberLine}) / hop / arc / pill / point / label`.
- **Maths text:** `NOVA.mt.render / speak / sf / surd`.
- **Controls:** `NOVA.ui.dragSnap / slider / stepper / entry / sort / match / parseNum`. All are styled neon + chalk inside `.nova-panel`.
- **Other shared pieces:**
  - `NOVA.events`, `NOVA.state`, `NOVA.assess` (F0-11)
  - game wrapper (F0-12), worked example (F0-13)
  - `NOVA.mountEngine` / `bankMount`, `NOVA.scene.helperStrip / pointTo`
- **CSS classes:**
  - `nv-dev` (developer code toggle), `nv-tbd-tag` (TBD tag)
  - `nv-keep-cues`: opt-in role cues, colour-key demos only

## Master document
`00-master/nova-master.html`:
- Style Lock section.
- All 17 F0 components carry a "COMPLETED · APPROVED v3.x" badge.
- Every copy-prompt includes the **F0 FOUNDATION LOCK**: build only from approved F0 engines and core helpers, follow every rule above, and never invent a new style or primitive; add it to core first.
- Every copy-prompt also includes the **F0 LESSONS LEARNED** text, shown as a visible panel too.

## Core fix (10 Oct 2026, v3.4e)
SVG glow filters (nv-neon, nv-neon-soft, nv-neon-halo, nv-glow, nv-shadow) now use filterUnits=userSpaceOnUse. Before this, perfectly straight horizontal or vertical lines had a zero-height bounding box, so filtered axes, grid and tick lines did not render (F0-14/F0-15 graphs, number-line arrowheads, the horizontal side of F0-16 triangles). **Rule: never apply bbox glow filters to straight lines.** All glow filters are userSpaceOnUse. `build/build.py` runs a self-check and exits with an error if any glow filter in core, an engine source or the master document lacks filterUnits=userSpaceOnUse.

## Open items
- **F0-11:** some empty space at the bottom of the Watch stage.
- **F0-14:** the dashed read-off guides need a proper neon treatment.
- **F0-16:** 3D solids are outlines only; a shaded neon 3D primitive is still to add to core.
- **F0-07:** Bob's wording and the event text still mention "3 of 4 parts / target 3/4". It needs rewording for the number-line hop sample.
- **F0-04:** the quarters number line only has digit lines at labelled values, not every 0.25 step.
- **F0-05:** the Challenge stage has empty space under the maths.
- **Light theme:** the sort and match chips stay dark neon.
- **F0-08:** align its visuals with `ref/bob-board.html`.

## Folder map
```
bank-v3/
  build/F0-xx.src.html   engine sources (@@CSS@@ / @@JS@@ placeholders)
  build/build.py         inlines core into every engine -> F0/
  core/nova-core.js|css  shared core (fonts embedded in the CSS)
  F0/*.html              built, self-contained engine pages (deliverables)
  00-master/nova-master.html  master document + prompts
  ref/bob-board.html     owner's Bob board (F0-08 visual reference)
  assets/helpers/        helper art (Nova, Pip, Izaac)
  shots/                 screenshots (f04, f05, f07, f11, f12, f14 …)
  README.md, HANDOVER-v3.md
```

## Build
```
cd bank-v3 && python3 build/build.py        # rebuilds all 17 F0 pages + F0-02 PREMIUM
```
- Edit `build/*.src.html` for one engine, or `core/*` for all engines, then rebuild.
- **Screenshots:** headless Chrome. Inject a tab click for each mode and disable animations, then capture at 380 and 1280 with `--virtual-time-budget`.
- **Delivery zip:** `/workspace/nova-f0/v3-update.zip` with `bank-v3-neon-chalk/{F0, core, README.md, HANDOVER-v3.md, 00-master/nova-master.html, ref/bob-board.html}`.

## Do not
- Invent drawing styles, fonts, filters or primitives outside core.
- Show raw markup to pupils.
- Put role glyphs on values.
- Use stars as markers.
- Put a frame behind diagrams.
- Start F1 without the owner's go-ahead.

## F1 progress / next engine
Owner gave the go-ahead for F1 (10 Oct 2026). Build ONE engine at a time, in order, from `prompts/F1/<id>-*.md` + `prompts/F1/_family-F1.md` + `prompts/F0/_STD.md`, obeying the F0 Foundation Lock. Source: `build/F1-xx.src.html` (copy the F1-01 structure: CONFIG block, ENGINE IIFE, `NOVA.bankMount`). Add the engine to the `F1=[...]` list in `build/build.py`. Output goes to `F1/`. Screenshots go to `shots/F1/`.

| Engine | Status | Notes |
|---|---|---|
| F1-01 Configurable number line | BUILT v1, awaiting owner review | Presets: integers, directed −10..10, tenths, hundredths, GCSE thousands, thermometer (F1-04 preset, vertical), comparer (F1-12 preset, two lines), fractions (F5-04, TBD placeholder). Gaps: thermometer drawing is small at 1280; the fractions preset is only a TBD label. |
| F1-02 Zoomable number line | BUILT v1, awaiting owner review | Stacked lines 0–10 → tenths → hundredths with dashed neon funnels and 'zoom ×10' pills. Presets: 3.47, 2.6, −0.35, GCSE thousandths 0.125, big numbers 0–1000. Gap: the one-line first step leaves space below because the stage is sized to the tallest (3-line) step. |
| F1-03 Jump-arc operator | BUILT v1, awaiting owner review | Neon hop arcs (right = add in op colour, left = subtract in focus colour), start/end neon rings, alternating arc heights. Presets: −3 + 5, 7 − 9, 48 + 27 split, 4 × 3, 4 − (−3), 2.6 + 0.7, GCSE −12 − 15. Gaps: hop arrowheads are very small; the Explore jump slider sets every jump to one size (no mixed jumps in Explore). |

**Next engine:** F1-04 is a PRESET of F1-01 (already provided as the thermometer preset), so the next build is **F1-05 Rounding rolling-ball**. First run stopped after F1-03 as instructed: wait for the owner's review before continuing.


---
## F12 · 2D shapes, perimeter and area — RUN 1 (built 10 Oct 2026)

**Status (updated after Run 4): FAMILY F12 COMPLETE.** All 15 engines (F12-01 to F12-15) are built and awaiting owner review. Run 1 detail: F12-01 Shape family tree · F12-02 Property sorter · F12-03 Geoboard builder · F12-04 Perimeter tracer are BUILT and awaiting owner review (like F1-01 to 03). F12-05 to F12-15 are NOT built. Run plan, numeric order: Run 2 = F12-05 to 08, Run 3 = F12-09 to 12, Run 4 = F12-13 to 15. Prompts for all 15 engines (regenerated from the master document) are in `prompts/F12/F12-all-engine-prompts.txt`.

**Core v3.5 additions (additive, in `core/nova-core.js` + `.css`; older engines unchanged):**
- `NOVA.neonShape(p,pts,{role,hatch,open,dash,fill})` closed neon polygon with gradient fill and an optional hatch (diag / cross / dots) as the colour-blind second cue.
- `NOVA.neonCells(p,x,y,cols,rows,cell,{cells,role,hatch})` unit-square grid with filled cells.
- `NOVA.rightAngle`, `NOVA.eqTick` (1 to 3 equal-side ticks, no end caps), `NOVA.parTick` (chevrons, `at` position), `NOVA.dimLine` (offset dimension line with pill).
- `NOVA.f12` shared helpers: `SHAPES` (12 library shapes with equal-side, parallel and right-angle data and property counts), `draw`, `classify`, `fit`, `outward`, `pip`, `area`, `perim`, `strip`, `fmt`, `clone`.
- CSS: `.f12-strip`, `.f12-sv`, `.f12-board` (pointer-events off on glow layers so pegs stay clickable). The family-wide `.pr-row` / `.pr-task` styles now live in core.

**Build:** `python3 build/build.py` now builds F0 (17) + F1 (3) + F12 (4) and runs the glow-filter self-check (colour-vision simulation filters `cvd-*` are exempt). F12 sources are `build/F12-0x.src.html`; the engine JS is kept in `build/F12-0x.src.html` only (the `f12src/` working copies were folded in). F1 sources `build/F1-0x.src.html` were recovered from the built pages.

**Checks run:** no console or page errors at 380 and 1280 px in all four modes for all 4 engines; F0-02, F0-16, F1-01, F1-03 re-checked after the core change (no errors). Interactions tested: all challenge tasks solve and check; geoboard mouse build, close, self-crossing refusal and keyboard build; perimeter trace slider; sorter Carroll and ring; tree tap. Screenshots in `shots/F12/` (modes at 380 and 1280, steps at 380).

**Lessons from this run (apply to every F12 engine):**
1. Glow, ring and label layers sit on top of pegs and eat clicks: always set `pointer-events:none` on them for any clickable board.
2. Chalk tiles break words anywhere. Keep chip text short (the sorter has a `short` label per property) and let strips use `NBSP + ZWSP` spaces.
3. A hyphen in a neon tile is drawn as a coloured minus: strips swap `-` for a non-breaking hyphen.
4. Draw marks on the same side at different positions (equal ticks at the midpoint, parallel chevrons at 27%).
5. Crop each step's SVG height to what is revealed so the stage has no big empty gap.
6. Keep node and label sizes big enough at 380 px (tree labels 15 px in a 440-wide viewBox).

**Open items for the owner:** F0-16 geometry canvas still unreviewed; F12 uses its own shape library rather than F0-16 labels. Trapezium is shown with the exclusive definition (exactly one pair of parallel sides); an inclusive-definition switch is a GCSE-extension option to add later.


## F12 · RUN 2 (built 10 Oct 2026): F12-05 Area by counting · F12-06 Parallelogram shear · F12-07 Triangle area by doubling · F12-08 Trapezium area
Built and awaiting owner review. All four: no console errors at 380 and 1280 px in all four modes; all 3 Challenge tasks per engine solve and check; every Explore preset, slider and select exercised; F0-02, F1-01 and F12-01/03 re-checked after the core change.

**Core v3.6 additions (additive):** `NOVA.f12.map(unionPts,W,H,margin,maxScale)` (one stable fit for every state, so shapes never jump), `rot(P,centre,deg)`, `cent(P)`, `dash(p,a,b,role,w)`, `hmark(sv,apex,foot,baseA,baseB,label,o)` (dashed perpendicular height, dotted base extension when the foot is outside the base, right-angle corner, pill).

**Method notes:**
- Doubling engines (F12-07, F12-08) half-turn a copy about the midpoint of a side, using `F.rot`. F12-07 turns about the midpoint of side BC, so a right-angled triangle makes a rectangle (turning about AC made a leaning parallelogram and did not match the narration).
- Include the copy at 45, 90 and 135 degrees in the fit union so the turning copy never leaves the frame; do NOT do this in a static view (the mean-width view shrank).
- F12-05 whole and half squares come from a 6 by 6 sample per cell; half squares are exact only for 45 degree edges, which is why the triangle preset is a right isosceles triangle. The Pythagoras preset draws squares on all three sides for any legs a, b (hypotenuse square is tilted, area a squared plus b squared) and has an enclosing-square view ((a+b) squared minus four triangles).
- Move the base dimension line with a moving piece (F12-06: under the rectangle, x offset t times lean).
- Put a height pill on the side away from the nearest viewBox edge.

**Still open:** exclusive vs inclusive trapezium definition (F12-08 uses a, b parallel sides generally, with no claim about parallelograms being trapezia); F0-16 unreviewed.


## F12 · RUN 3 (built 11 Oct 2026): F12-09 Kite and rhombus area · F12-10 Compound shape decomposer · F12-11 Circumference unrolling · F12-12 Circle area unwrap
Built and awaiting owner review. No core changes this run. All four: no console errors at 380 and 1280 px in all four modes; all 3 Challenge tasks per engine solve and check; every Explore preset, slider and select exercised.

**Lessons (apply to F12-13 to 15, which are all circles):**
1. Do NOT use `NOVA.neonRing` for a big circle: it draws a thick marker ring with a solid white centre disc and scales badly. Draw circles with `NOVA.neonPath` and an SVG arc (`M cx-R,cy a R,R 0 1,0 2R,0 a R,R 0 1,0 -2R,0`); keep `neonRing` for small markers (r about 7) only.
2. Leave room for a ghost start position (rolling circle): span = circumference + 2R must fit the 440 viewBox (R 46 works).
3. Rolling-circle trail: material point at offset phi sits at centre + (-R sin(theta - phi), R cos(theta - phi)) for rolled angle theta (screen y down).
4. Use even-odd fill for shapes with holes (`fill-rule:evenodd`, outer plus hole subpaths in one path); hole edge labels go INSIDE the hole (`F.outward(hole, i, -15)`).
5. F12-12 slice strip: apexes alternate up/down, spaced R sin(180/n) apart; slices over 16 are drawn as plain thin paths (no glow filters) for speed.
6. Use the 3.14 value where the narration quotes a rounded answer (override text, e.g. `ctext` in F12-11), and accept both 3.14 and calculator-pi answers in Challenge checks (tolerance).
7. Shrink the `F.map` margin (30 to 44) and raise `maxS` so shapes fill the stage; labels on a 380 px phone must stay at 12 px or more in viewBox units.

**Open items:** F0-16 unreviewed. Run 4 = F12-13 Arc and sector explorer, F12-14 Area and perimeter relationship, F12-15 Units of area grid.


## F12 · RUN 4 (built 11 Oct 2026): F12-13 Arc and sector explorer · F12-14 Area and perimeter relationship · F12-15 Units of area grid  → F12 COMPLETE
No core changes this run. All three: no console errors at 380 and 1280 px in all four modes; all 3 Challenge tasks per engine solve and check; every Explore control exercised. Final regression: all 15 F12 pages plus F0-02, F0-16, F1-01, F1-03 load and run with no errors; run 1 and run 2 interaction tests re-run clean.

**Notes:**
- F12-13: sector drawn symmetric about the upward direction; the fraction bar and angle marker are the second cue to the filled sector. Challenge answers accept calculator-pi and 3.14.
- F12-14: bar chart lists every whole-number rectangle (square first for the fixed-area list); chips use short verdicts ("A is longer") because long chip text breaks mid-word.
- F12-15: for n of 100 or more the grid shows 100 blocks and zooms into one block; area factor is the length factor squared. Chips put the unit in the label so the value stays short.

**F12 totals:** 15 engines, 45 Challenge tasks, core v3.6. Master document statuses (the per-component tracker inside `00-master/nova-master.html`) were NOT edited: mark F12-01 to F12-15 as built in your own tracker when you sign each one off.

**Suggested review order for the owner:** F12-03 (touch the geoboard on a real device), F12-12 (interlocked slices at 8 slices on a phone), F12-10 (semicircle perimeter wording), then F0-16 (still unreviewed, F12 does not depend on it).
