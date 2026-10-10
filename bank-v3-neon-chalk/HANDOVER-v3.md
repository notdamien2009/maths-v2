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
| F1-01 Configurable number line | APPROVED (v1.1) | Presets: integers, directed −10..10, tenths, hundredths, GCSE thousands, thermometer (F1-04 preset, vertical), comparer (F1-12 preset, two lines), fractions (F5-04, TBD placeholder). v1.1: bigger thermometer. Gap: the fractions preset is only a TBD label. |
| F1-02 Zoomable number line | APPROVED (v1.1) | Stacked lines 0–10 → tenths → hundredths with dashed neon funnels and 'zoom ×10' pills. Presets: 3.47, 2.6, −0.35, GCSE thousandths 0.125, big numbers 0–1000. v1.1: step 1 has extra chips to fill the space. |
| F1-03 Jump-arc operator | APPROVED (v1.1) | Neon hop arcs (right = add in op colour, left = subtract in focus colour), start/end neon rings, alternating arc heights. Presets: −3 + 5, 7 − 9, 48 + 27 split, 4 × 3, 4 − (−3), 2.6 + 0.7, GCSE −12 − 15. v1.1: bigger arrowheads; Explore supports mixed jumps (the stepper adds jumps, the slider sets the last jump). |

| F1-04 Vertical line and thermometer | COVERED by F1-01 | Built as the F1-01 thermometer preset (its prompt says preset, not a separate engine). |
| F1-05 Rounding rolling-ball | BUILT v1, awaiting owner review | A neon hill between the two landmarks peaks at halfway; the ball (neon ring) rolls to the nearer landmark, and halfway rounds up. The line between landmarks has a line at every tenth of the gap. Presets: nearest 10, whole, 1 dp, 100, negatives, GCSE 2 dp. Gap: the roll is a static arrow, not an animated roll. |
| F1-06 Inequality line | BUILT v1, awaiting owner review | Neon ray or segment above the line; open ring = not included, filled glowing disc = included; integer solutions shown as rings; Explore has a test-x ring that turns green or red. Gap: no solve-then-show step (for example 2x + 1 > 7). |
| F1-07 Card-placing line | APPROVED (v1.1) | Neon card boxes with chalk values and stems to their spots, stacked in up to three rows so they never overlap; Explore = drag the ring, Place, off-by chip; Challenge = drag 0.6, furthest left, estimate 70. v1.1: the drag tag hides the value in Challenge and Explore (core dragSnap option hideValue). Gap: the first step has empty space above the line. |
| F1-08 Estimation line | BUILT v1.1, direction approved | Rounds each number to 1 s.f.; the estimate ring (op colour, dashed stem, ≈ pill) and the exact ring (focus) sit on a 0-to-nice-max line with a line at every tenth, plus a bracket for the gap; √n mode shows whole-number landmarks. Explore: presets, sliders, Show exact. Gaps: the bracket is tiny when the estimate is very close; in Challenge the line scale hints at the answer's size. |
| F1-09 Scale reader | BUILT v1.1, direction approved | Horizontal scale, neon measuring jug (liquid as a neonBox) and thermometer, each with a neon line at every division (longer and labelled at the majors), a neon pointer triangle and a brace for each division; bounds mode = error interval with filled and open ends (as in F1-06). Explore: presets, reading slider, gaps stepper. Gaps: no dial or round scales yet; the stage under the horizontal scale is fairly empty. |
| F1-10 Powers-of-ten zoom | BUILT v1.1, direction approved | A powers-of-ten line (a neon line at every power; small raised exponents via an SVG tspan, Unicode superscripts in chips); a dashed neon funnel zooms into one decade drawn from 1 to 10, with a line at every whole and half; compare mode puts two rings on the line. Explore: number-part slider + power stepper. Gaps: in Challenge 1 and 3 the zoom is hidden so it doesn't give the answer, which leaves empty space below the line; the GCSE 10²³ preset has no zoom ordinary-number readout. |

| F1-11 Error-interval line | BUILT v1, awaiting owner review | Measured value as a focus ring, dashed halfway marks, interval as a neon segment with a filled lower end and an open upper end (same as F1-06); presets for 1 dp, nearest 10, nearest cm, 2 dp, truncated, GCSE perimeter bounds. Challenge lines are labelled only at whole units, so they don't show the answer. Gap: area/speed bounds are not a preset yet. |
| F1-12 Number-line comparer | COVERED by F1-01 | Its prompt says "add a PRESET to F1-01, do NOT build a separate engine"; F1-01 already has the comparer preset (two stacked lines). |

v1.1 gap fixes (10 Oct): F1-08 'off by' pill under the bracket, fixed Challenge scales (0–3000, 0–1); F1-09 round dial (new preset + Dial step), jug capped at 340px, bigger horizontal scale; F1-10 neutral 1–10 neon line in Challenge when the zoom is hidden, GCSE 10²³ ordinary-number readout.

**F1 FAMILY COMPLETE (v1).** Next family: **F2**, only after the owner says go. Extract prompts/F2 from the master the same way as F1.

**Zip note (10 Oct 2026):** v3-update.zip now leaves out F0/*.html (unchanged; it is in the earlier full zip) and ref/bob-board.html, to keep the zip under 24 MB. Every HTML file inlines the same ~1 MB core, so a full zip would be about 28 MB.


## F2 progress / next engine

Prompts: prompts/F2/ (_family-F2.md + one file per component, taken from the master). Visual reference: ref/pv-chart.html (the owner's Column Transit Grid), redrawn with core neon helpers. Build sources: build/F2-xx.src.html; build.py list F2 → output bank-v3/F2/. Colour use: chambers and columns are 'given' blue, the active or moving digit is focus, result digits are result green, placeholder zeros are unknown gold, and the decimal point is a dashed op line (no place-by-place rainbow, so the locked maths colour language keeps its meaning).

| Engine | Status | Notes |
|---|---|---|
| F2-01 Place-value chart slider | PREMIUM v2 APPROVED | Option A place cards (place colours, chalk digit, live worth line, gold highlight, dotted decimal divider, key) + digit tray. Drag tiles onto cards / drag off to remove; keyboard: focus card, type 0–9, Delete, arrows. × ÷ 10/100/1000: digits glide on arcs with glow trails, gold placeholder zeros drop in with a flash; refuses shifts off the chart. Challenge: build 4.06 (read from chart), 0.38×100, worth of 7 (worth lines hidden). |


## Number line lock (10 Oct 2026, v3.5)

- One number line only: core `NOVA.numberLine(p,{x,y,w,min,max,major,minor,label,labelSize,vertical,side,arrows})`. It is the approved F0-03 style: neon glass tube with arrowheads at both ends, a straight, evenly sized neon line at every major value, minor values as shorter straight lines in the same style (no dots or beads), chalk-draw digits centred under the lines. `label` can return a string or `{base:'10',sup:e}` for powers.
- `NOVA.svg.axes({numberLine:true, ticks, minor})` now hands off to it, so all F0/F1 engines share it.
- Refactored: F1-01 thermometer (vertical), F1-08 √ mode, F1-09 scales and jug (vertical), F1-10 power line and both zoom lines, F1-11 minor lines. The F1-09 round dial is exempt (a curved instrument, marked `/*nl-ok*/`), as are the F0-11 bar hatching and the F0-16 grid.
- build.py now FAILS if an engine draws its own ticks (a for-loop drawing lines, or a short line crossing a number line's baseline).
- Check screenshots: shots/F1-lock/ (every F1 at 1280 Watch + F1-01 thermometer).
| F2-02 Counters on place-value grid | PREMIUM v2 APPROVED | Place-coloured neon columns H..h, tray; drag counters in, between, off. Column ≥10 pulses + Exchange! pill; exchange = 10 gather, flash-merge, 1 flies to next column on trail; break = 1 flies right, flashes, fans into 10 (spring). Auto-exchange checkbox. Keyboard: focus column + − E B, arrows. Challenge: make 2.05 (from grid), tenths after break (12), regroup (0.53). |
| F2-03 Base-ten blocks | PREMIUM v2 APPROVED | Polished neon glass blocks on a 3-zone mat (place colours). Drag from tray, drag off to remove. 10 units slide in (back easing, staggered) and snap into a rod + glow sweep, rod flies to tens; 10 rods slide together and fuse into a flat; break flat→10 rods, rod→10 units. Exchange! alerts + auto-exchange; scale switch (decimal = F2-04 preset). Keyboard: focus zone + − E B. Challenge counts hidden. |
| F2-04 Decimal base-ten blocks | COVERED by F2-03 | Its prompt says preset; it is F2-03's decimal scale (flat = 1, rod = 0.1, unit = 0.01) with 3 presets (1.46, 0.5 vs 0.45, 2.07). |


**Next F2 engine:** F2-05 Abacus / Gattegno chart (resume here; stopped after 3 new engines for owner review).

## Place colours + motion (v3.6)
- `NOVA.place` / `NOVA.placeColour(p)` / `--pv-*` / `NOVA.placeKey(places)`: PLACE identity colours only (Th purple, H indigo, T blue, O teal, t violet, h pink, th orange). Never use them as maths roles; gold/green keep role meaning.
- `NOVA.motion`: tween(ms,fn,ease,done), ease.out/inOut/spring/back, seq, delay, trail(svg,d,colour), flash(svg,x,y,colour,r), arrive(el,dx,dy), pop(el,cx,cy). Reduced motion = instant. Test hook: set `NOVA.motion.raf` to a 16 ms setTimeout clock for headless frame capture.
- `NOVA.ui.svgDrag(svg,el,{onDrop(x,y)->bool})`: pointer drag in SVG units, spring-back on refusal. Each engine adds keyboard equivalents.
- Pattern: each F2 premium engine owns one retained scene object (Chart/Grid/Mat) killed when a new one is built (`dead` flag) so delayed Watch animations never write into another mode.
- Tests: drags verified with synthetic PointerEvents + keydown (reduced motion) for all three; frame strips via Chrome DevTools (`/tmp/f04/cdp.js`) in `shots/F2-premium/`.
- Next: owner review of F2-01..03 premium; then F2-05 onward on go-ahead.
- v3.6.1 drag audit (owner feedback): F2-01 placed digits are NOT draggable (pointer-events none, no grab cursor); digits change only by dropping a tray tile onto a card (replaces) or Clear chart / Delete key. F2-02 counters: drag = move to another column or remove off-grid (both visible results); F2-03 placed blocks: drag off mat = remove. Tray items in all three add. Rule: every drag must have a purposeful visible result or not exist.

## F2 drag rules (v3.6.2, core `NOVA.ui.svgDrag`)
- API: `svgDrag(svg, el, {box, zones()->[{x,y,w,h,id,kind:'drop'|'remove'}], onDrop(id)->bool, onRemove(), removeTo, canStart()})`.
- Every drop resolves to exactly ONE outcome: drop zone (engine snaps + pops + updates count), remove zone (tray; fade-to-tray then onRemove), or spring back to origin and back into its original group. Nothing is ever left outside the grid/tray.
- Only valid targets highlight while dragging (green glow); the tray glows red as the remove zone; invalid areas show nothing.
- Pickup: lift (scale 1.12 + shadow), moved to top z-order, follows with slight lag + tilt (exact under reduced motion). Transparent hit rect from `box` (bigger on coarse pointers), touch-action none.
- One drag at a time (second pointer ignored). pointercancel, lostpointercapture, window blur, scroll, Escape all cancel back to origin; window pointerup fallback if capture fails. `canStart` blocks pickup during exchange/break animations.
- F2-01: only tray tiles drag (cards are drop zones; placed digits not draggable). F2-02: tray counter → column; placed counter → another column or tray(remove). F2-03: tray block → its own zone only; placed block → tray(remove).
- Stress tests: `tests/stress_common.js` + `tests/stress_f201|f202|f203.js` (run via `tests/drag.sh F2 <page> "$(cat ...)"`): empty space, off-stage, own/wrong zone, tray remove, re-grab, double drag, flicks, release outside window, pointercancel, blur, Escape, touch, mid-exchange. All pass (0 fails), no stranded elements, counts correct.

| F2-05 Abacus / Gattegno chart | PREMIUM v2, awaiting owner review | Abacus: glass beads on place-coloured neon rods, top bead re-grabbable (drag to rod / tray remove), auto-exchange 10→1 with squeeze+flash+flying bead (cascades 199+1→200), break B. Gattegno: 6 rows × 9 tiles, tap or drag tile into build bar (one per row, replaces), live sum 3000 + 40 + 0.5 = 3040.5, ×/÷10 glides tiles a row. Keyboard both. Stress test tests/stress_f205.js 0 fails. Next: F2-06. |

| F2-06 Column add and subtract animator | PREMIUM v2, awaiting owner review | Place-coloured columns (centred), gold placeholder zeros drop in to align decimals, columns worked right→left: carry digit flies to carry row, subtraction exchange strikes digit (red), new digit gold, '1' flies across; chains across zeros (4000−1). Your turn: tray tiles → answer/carry cells (drop replaces, placed digits not draggable, Reset clears), Check marks cells green/red; keyboard type in cells. All 7 presets verified. Stress tests/stress_f206.js 0 fails. Next: F2-07. |

| F2-07 Multiplication and division layouts | PREMIUM v2, awaiting owner review | Grid method: place-value partitions in place colours, cells pop in one by one, parts fly into the sum bar (200 + 30 + 80 + 12 = 322); decimals (2.3 × 1.4 = 3.22). Short division bus stop: place-coloured columns, quotient digit springs in, remainder flies to the next digit, gold placeholder zeros extend decimals (7 ÷ 4 = 1.75), zero in quotient (832 ÷ 4 = 208). Your turn: tray → quotient cells, Check. All 8 presets verified. Stress tests/stress_f207.js 0 fails. NEXT: owner review of F2-05..07, then F2-08 number expander on go-ahead. |

## 2026-10-10 · Build Guard + WHAT TO BUILD specs (after the F5 audit)
- Every prompt now carries the BUILD GUARD / LESSONS FROM F5 (prompts/specs/guard.txt). Every component from F2-08 to F18 has a WHAT TO BUILD spec. Source: prompts/specs/s*.py, built by `python3 prompts/specs/gen.py`, which updates specs.json, the master's SPEC block and the .md prompts.
- Portable master for other AIs: 00-master/NOVA-MASTER-FOR-OTHER-AI.md. Mascot packs: assets/helpers/pip/pack80/manifest.json, assets/helpers/nova-cat/pack60/manifest.json, assets/helpers/izaac/.

| F2-08 Number expander | PREMIUM v2, awaiting owner review | Place-coloured digit cards stretch apart (draggable gold handle, back-ease snap to compact/expanded; arrows/Home/End) into parts 3000 + 40 + 0.5 + 0.007; zero digits fade, gold placeholder zeros grow inside parts; forms: parts / digit × place / powers of ten / words. Build from parts: drag part tiles into combine zone (drop) or back to tray (remove), Enter on keyboard. Stress tests/stress_f208.js 0 fails. Core v3.6.3: helper alt text fixed. NEXT: F2-09. |

| F2-09 Standard form scaler | PREMIUM v2, awaiting owner review | Place strip 10⁶…10⁻⁶ (place colours), gold point hops place by place with hop counter to convert (45 000 → 4.5 × 10⁴, 0.00062 → 6.2 × 10⁻⁴); power handle on core NOVA.numberLine (labels 10ⁿ) drags + snaps to whole powers, clamps to valid range, digits glide with trails; compare marks A/B. Keyboard arrows. Stress tests/stress_f209.js 0 fails. NEXT: F2-10. |

| F2-10 Powers and roots builder | PREMIUM v2, awaiting owner review | Drag the gold corner to grow a neon tile square (tiles pop in) or isometric neon cube; root presets show a dashed target (hidden in Challenge); factor tiles drag into a chain zone (2 × 2 × 2 × 2 = 2⁴) and back to tray to remove (Enter/Delete); laws: × chains join with trails, ÷ pairs cancel with red strikes; 8^(1/3) = 2 cube. Reduced motion shows final states. Stress tests/stress_f210.js 0 fails. NEXT: F2-11. |

| F2-11 BIDMAS collapsing tree | PREMIUM v2, awaiting owner review | Expression parsed (+ − × ÷ ^ brackets, ≤ 7 ops) into a neon tree; ready ring pulses gold; tap/Enter collapses: branches glide up with trails, flash, pop into a green result while the chalk expression updates; brackets = dashed groups; strict order mode shakes + explains wrong picks; equal priority left to right. No drags (tap only). Challenge 1 shows a flat row (no tree give-away). Stress tests/stress_f211.js 0 fails. NEXT: F2-12 onward on owner go-ahead. |

| F2-12 Negative place value | PREMIUM v2, awaiting owner review | Neon mat with filled + (teal) and hollow − (red) counters over core NOVA.numberLine −10…10; drag from tray sources onto mat, mat counters back to tray to remove; zero pairs pulse, Cancel pairs slides each pair together, flash, '0', fade; Zero pair button for subtraction; gold marker hops with a trail and flashes when crossing zero. F2-01 decimal chart not repeated (negatives on mat + line). Stress tests/stress_f212.js 0 fails. NEXT: F2-13. |

| F2-13 Number bonds and ten frames | PREMIUM v2, awaiting owner review | Glass neon ten frame(s) (1 or 2), counters worth 1 / 0.1 / 10; drag counters from tray into frame, frame counters back to tray; part-whole neon rings (whole gold, part teal, partner violet); empty cells pulse as the partner; drag partner tile onto the partner ring (wrong springs back with shake + misconception message); Enter/Delete keyboard. Stress tests/stress_f213.js 0 fails. NEXT: F2-14. |

| F2-14 Hundred square explorer | PREMIUM v2, awaiting owner review | Glass neon 10×10 grid (roving tabindex: arrows/Home/End, Enter sets marker); gold ring drags to any cell (per-cell green target glow); jump pills +1 −1 +10 −10 +9 +11 drag onto the square: marker moves down by tens then across by ones with trails, lands with flash, pill springs home; off-square jumps shake + explain; multiples light green (staggered, corner dot), factors of marker gold. Stress tests/stress_f214.js 0 fails. Zip now ships only F2-08+ shots (resized 1000px). NEXT: F2-15. |

| F2-15 Binary and other bases | PREMIUM v2, awaiting owner review | Base-b place chart (headers bⁿ + value), bases 2/3/5/8/10; binary: glass bulbs tap/Enter toggle (gold fill + filament vs grey outline); other bases: counters stack (max b−1); drag counter from tray to a place (per-place glow), a full place carries with flash + trail chain; place counters back to tray; denary sum counts up; Show in this base input. Stress tests/stress_f215.js 0 fails. NEXT: F2-16. |

| F2-16 Number set classifier | PREMIUM v2, awaiting owner review | Nested neon rings ℕ⊂ℤ⊂ℚ⊂ℝ + dashed irrational region; rings draw (dash tween), cards drop (arrive + trail), region glows; drag card into smallest set (innermost zone wins; wrong springs back with a misconception-specific reason), keys N/Z/Q/I; placed cards back to tray. ℕ starts at 1 (config). Fractions shown as decimals (3/4 fraction TBD). Stress tests/stress_f216.js 0 fails. F2 family built to F2-16; NEXT: owner review, then F3 on go-ahead. |
