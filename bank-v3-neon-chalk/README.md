# NOVA Bank v3.0 (Neon + Chalk house style)

See **HANDOVER-v3.md** for house rules, core API, Improve lists, and how to apply to F0-03…F0-17.

Picks: `user-picks.json`.

# NOVA KS3 Maths – Component Bank

## Folder map
- 00-master/ – nova-master.html (master working document, source of truth for prompts)
- prompts/F0/ – verbatim build prompts per F0 component, plus _family-F0.md and _STD.md
- F0/ – built F0 component files (one HTML per component)
- core/ – nova-core.css + nova-core.js (NOVA family core v1.3; see Core versions)
- build/ – page sources (core injected at @@CSS@@ / @@JS@@ to make the standalone files)
- assets/helpers/ – helper art: pip/, teen/, nova-cat/poses/

## F0 status
| ID | Name | Origin | Prompt | Status |
|---|---|---|---|---|
| F0-01 | Design tokens (NOVA colours, fonts, maths colour language) | original | prompts/F0/F0-01-design-tokens-nova-colours-fonts-maths-colour-language.md | built 2026-10-10, rebuilt on core v1.3 · F0/F0-01-design-tokens.html · tested 4 modes x 3 skins, 0 errors, anchor check pass · F0/F0-01-380.png |
| F0-02 | SVG primitives (arrows, braces, arcs, grids, axes, labels) | original | prompts/F0/F0-02-svg-primitives-arrows-braces-arcs-grids-axes-labels.md | built 2026-10-10 · F0/F0-02-svg-primitives.html (core v1.3 inlined) · tested 4 modes x 3 skins, 0 errors, anchor + smooth-scrub checks pass · F0/F0-02-380.png |
| F0-03 | Animation timeline (play/pause/step/scrub, reduced motion) | original | prompts/F0/F0-03-animation-timeline-play-pause-step-scrub-reduced-motion.md | not built in bank yet |
| F0-04 | Interaction kit (drag-snap, slider, stepper, sort, match, entry) | original | prompts/F0/F0-04-interaction-kit-drag-snap-slider-stepper-sort-match-entry.md | not built in bank yet |
| F0-05 | Maths text renderer (fractions, powers, roots, surds, standard form) | original | prompts/F0/F0-05-maths-text-renderer-fractions-powers-roots-surds-standard-form.md | not built in bank yet |
| F0-06 | Seeded randomiser for variants | original | prompts/F0/F0-06-seeded-randomiser-for-variants.md | not built in bank yet |
| F0-07 | State and events API (value, correct, step) | original | prompts/F0/F
## v3.1 audit fixes (10 Oct 2026)
- F0-01 Challenge: tiles use Chalk writing + neon tile glow (as F0-02); bigger tiles and role-chip legend centred in the stage (no empty area).
- Helpers: removed the panel-shine rectangle drawn behind the helper SVG (dock + Sir Bob row are fully transparent).
- F0-02: angle arc draws a full ring at >=359.5 deg (was blank at 360); Explore slider now 0-360.
- F0-02: triangle draws all three sides (BC was missing).

## v3.2 house lock (core 3.0+house3.2)
- Two chalk tokens: --nova-font-chalk-draw (labels inside drawings, scratchy nv-chalk texture, as F0-02) and --nova-font-chalk-write (written maths, smooth bold + neon glow). Both use the embedded "NOVA Chalk" (Kalam) font.
- Removed the dark panel-shine "frame" rect behind every diagram.
- Focus role shape star -> neon pulse ring; new NOVA.neonRing result marker.
- Hop arcs smoother (rounder curve) with neon tube + white core; axes/ticks/plot markers neon by default.
- New helpers: NOVA.chalkText, neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip.
- F0-01: swatches, legends, shapes, equation tiles all neon + chalk; Fonts step shows both chalk tokens; mono row removed; fraction preset marked "fraction design TBD".

## v3.3 — APPROVED (10 Oct 2026)
- Number-line ticks: every integer gets a straight vertical neon line through the full tube, extending below towards its digit; equal length, evenly spaced, label centred under it (core `axes`, inherited by all engines). Fixed: ticks were invisible/uneven because a glow filter on zero-width lines dropped them.
- **F0-01 Design tokens: APPROVED (v3.3)**
- **F0-02 SVG primitives: APPROVED (v3.3)**
- **F0-03 Animation timeline: APPROVED (v3.3)**

## v3.4 (10 Oct 2026) — F0-04 + F0-05 premium passes
- Core: drag-snap handle is now a neon stem + neon ring (no pin/star). Panel controls are neon + chalk: glowing slider track/thumb, chalk outputs, dashed-neon entry boxes, neon sort/match chips, neon-bordered feedback (tick/cross/ring).
- Core: written maths powers/subscripts are small and raised top-right like handwriting; role markers (dashed circles, squares, underlines) removed from written maths everywhere (colour only). Opt back in with class `nv-keep-cues` for colour-key teaching demos.
- Core: `details.nv-dev` "Developer: show code" toggle; `.nv-tbd-tag` placeholder tag.
- F0-04: control strips and match pairs use neon tiles / answer chips; Explore and Challenge stages show live value chips (no empty stage).
- F0-05: raw markup, Explore markup textarea and cheat-sheet hidden behind "Developer: show code"; all stage text in chalk; fractions tagged "fraction design TBD".
- Screenshots: shots/f04/, shots/f05/.
- v3.4b: role glyphs (★ ■ ◆ ✓ ◌ ▲) are never attached to maths values: the core maths text no longer outputs them at all, and the CSS glyph prefixes were removed in F0-06/07/08/09/10/13/15. Feedback ticks/crosses, F0-12 game stars and F0-01 colour-key tiles stay. F0-07 sample is now a neon number-line hop (0 to 4, +1 hops, ring on landing) instead of a fraction bar.

## Approval status (10 Oct 2026)
APPROVED: F0-01, F0-02, F0-03, F0-06, F0-09, F0-10, F0-12, F0-13.
- v3.4c F0-11 premium pass: question neon cards with chalk-write prompts, answers as answer chips with neon tick/cross, neon mark-scheme rows (chalk maths, neon ✓/✖), neon "Misconception" callout, neon objective bars with chalk-draw labels (▽△ glyphs removed), marks/objective chips fill the scheme column, fractions tagged "fraction design TBD".
- F0-12 / F0-13 premium touch-up (layout unchanged): HUD, questions, answers, points, results, worked lines, blanks and "why" notes are neon boxes with chalk text. Game rating stars kept (score, not role glyphs).
- v3.4d F0-14 (neonPlot: neon grid/axes/lines, neon circle markers, chalk-draw axis labels, neon step cards), F0-15 (neon grid table, chalk cells/headers, neon blanks/highlights, ✖ glyph removed, neonPlot graph), F0-16 (neon shape lines/angles, chalk-draw labels, neon info cards), F0-17 (neon on-screen preview + side cards, chalk worksheet text; print = plain black-and-white, no glow) premium passes.
- 00-master: all 17 F0 components marked COMPLETED · APPROVED v3.x; every prompt carries the F0 FOUNDATION LOCK + F0 LESSONS LEARNED; visible lessons-learned panel under the Style Lock.
- Progress: F0-01..F0-17 premium complete. F0-04, F0-05, F0-07, F0-08, F0-11, F0-14..F0-17 awaiting owner review. Next: F1 only on owner go-ahead. See HANDOVER-v3.md.

## F1 status
- F1-01 Configurable number line: built v1, awaiting review.
- F1-02 Zoomable number line: built v1, awaiting review.
- F1-03 Jump-arc operator: built v1, awaiting review. Next: F1-05 (F1-04 is the F1-01 thermometer preset). Paused for owner review.
- v3.4e core fix: glow filters use userSpaceOnUse, so straight axes, grid and tick lines render on every PC (F0-14/15/16 graphs).

## F12 (added 10 Oct 2026)
`F12/` holds F12-01 to F12-08 (Runs 1 and 2). `prompts/F12/` holds the regenerated prompts for all 15 F12 engines. Core is v3.6 (shape kit + run-2 helpers). See HANDOVER-v3.md, section "F12 RUN 1".
