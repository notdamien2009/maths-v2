# NOVA KS3 Maths: Master Run Prompts (portable copy for other AIs)

Generated 2026-10-10 from 00-master/nova-master.html. Each component prompt is self-contained: paste ONE prompt per build run. Do not invent anything the prompt does not say; if a helper is missing, propose a core addition first.

## Build Guard / Lessons from F5

BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.

## Shared standard (included at the end of every prompt)

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.


# Family F0: Foundation layer

## Family run prompt

```
Build NOVA Master Visual Engine Family F0: Foundation layer as a gallery plus components.
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

Components, in order (items marked preset are modes of another engine, not separate builds):
F0-01 Design tokens (NOVA colours, fonts, maths colour language)
F0-02 SVG primitives (arrows, braces, arcs, grids, axes, labels)
F0-03 Animation timeline (play/pause/step/scrub, reduced motion)
F0-04 Interaction kit (drag-snap, slider, stepper, sort, match, entry)
F0-05 Maths text renderer (fractions, powers, roots, surds, standard form)
F0-06 Seeded randomiser for variants
F0-07 State and events API (value, correct, step)
F0-08 Bob narration hooks
F0-09 Registry and lesson manifest
F0-10 Gallery page shell
F0-11 Assessment engine (question types, marking, mark scheme, results by objective)
F0-12 Game wrapper (rounds, scoring, lives, hints, Bob reactions, results)
F0-13 Worked-example stepper (generic I do, we do, you do)
F0-14 Axes and plotting primitive (Cartesian, scatter, bars)
F0-15 Interactive table primitive (fill, link to graph, highlight)
F0-16 Geometry canvas primitive (snap grid, points, lines, angles, measure)
F0-17 Static and print renderer (fallback image and worksheet export)

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F0-01 Design tokens (NOVA colours, fonts, maths colour language)

```
Build NOVA Master Visual Engine component F0-01: "Design tokens (NOVA colours, fonts, maths colour language)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-02 SVG primitives (arrows, braces, arcs, grids, axes, labels)

```
Build NOVA Master Visual Engine component F0-02: "SVG primitives (arrows, braces, arcs, grids, axes, labels)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-03 Animation timeline (play/pause/step/scrub, reduced motion)

```
Build NOVA Master Visual Engine component F0-03: "Animation timeline (play/pause/step/scrub, reduced motion)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-04 Interaction kit (drag-snap, slider, stepper, sort, match, entry)

```
Build NOVA Master Visual Engine component F0-04: "Interaction kit (drag-snap, slider, stepper, sort, match, entry)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-05 Maths text renderer (fractions, powers, roots, surds, standard form)

```
Build NOVA Master Visual Engine component F0-05: "Maths text renderer (fractions, powers, roots, surds, standard form)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-06 Seeded randomiser for variants

```
Build NOVA Master Visual Engine component F0-06: "Seeded randomiser for variants" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-07 State and events API (value, correct, step)

```
Build NOVA Master Visual Engine component F0-07: "State and events API (value, correct, step)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-08 Bob narration hooks

```
Build NOVA Master Visual Engine component F0-08: "Bob narration hooks" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-09 Registry and lesson manifest

```
Build NOVA Master Visual Engine component F0-09: "Registry and lesson manifest" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-10 Gallery page shell

```
Build NOVA Master Visual Engine component F0-10: "Gallery page shell" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-11 Assessment engine (question types, marking, mark scheme, results by objective)

```
Build NOVA Master Visual Engine component F0-11: "Assessment engine (question types, marking, mark scheme, results by objective)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.
(New component added by the audit.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-12 Game wrapper (rounds, scoring, lives, hints, Bob reactions, results)

```
Build NOVA Master Visual Engine foundation component F0-12: "Game wrapper".
Used by every one of the 199 KS3 maths lessons.

This is the NOVA game wrapper: the shared shell that turns any visual component into a playable lesson game, so no lesson builds its own game code.
One JSON config per game: title; lesson ID; core components (IDs plus presets); rounds and questions per round; difficulty levels with parameter ramps; win and lose rules; scoring (points, streak multiplier, accuracy bonus); timer (OFF by default, optional per round, a no-timer mode always available); lives (optional); hint ladder (nudge, bigger hint, show the worked step, each with a points cost); instant feedback with misconception-specific messages keyed to wrong answers; Sir Bob reaction slots (start, correct, wrong, streak, hint, win, lose); results screen (score, accuracy, mastery per teaching point, replay weakest point); pause, restart, exit; best score saved locally.
Contracts: the wrapper calls component.reset(params) and component.setPreset(name), and listens to component events (correct, wrong, step, value, hint used). Components never contain game logic. Reduced-motion, keyboard, colour-blind-safe cues, 380px mobile, sound off by default.
Deliver: the wrapper file, a config schema document, and a demo game that uses two existing components (for example F1-01 and F2-01).

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-13 Worked-example stepper (generic I do, we do, you do)

```
Build NOVA Master Visual Engine component F0-13: "Worked-example stepper (generic I do, we do, you do)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.
(New component added by the audit.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-14 Axes and plotting primitive (Cartesian, scatter, bars)

```
Build NOVA Master Visual Engine component F0-14: "Axes and plotting primitive (Cartesian, scatter, bars)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.
(New component added by the audit.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-15 Interactive table primitive (fill, link to graph, highlight)

```
Build NOVA Master Visual Engine component F0-15: "Interactive table primitive (fill, link to graph, highlight)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.
(New component added by the audit.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-16 Geometry canvas primitive (snap grid, points, lines, angles, measure)

```
Build NOVA Master Visual Engine component F0-16: "Geometry canvas primitive (snap grid, points, lines, angles, measure)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.
(New component added by the audit.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F0-17 Static and print renderer (fallback image and worksheet export)

```
Build NOVA Master Visual Engine component F0-17: "Static and print renderer (fallback image and worksheet export)" (Family F0: Foundation layer).
Family covers: design tokens, SVG primitives, animation timeline, interaction kit, shared APIs.
(New component added by the audit.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F1: Number Line and Scale Engine

## Family run prompt

```
Build NOVA Master Visual Engine Family F1: Number Line and Scale Engine as a gallery plus components.
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.

Components, in order (items marked preset are modes of another engine, not separate builds):
F1-01 Configurable number line
F1-02 Zoomable number line
F1-03 Jump-arc operator
F1-04 Vertical line and thermometer [preset of F1-01]
F1-05 Rounding rolling-ball
F1-06 Inequality line
F1-07 Card-placing line
F1-08 Estimation line
F1-09 Scale reader
F1-10 Powers-of-ten zoom
F1-11 Error-interval line
F1-12 Number-line comparer [preset of F1-01]

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F1-01 Configurable number line

```
Build NOVA Master Visual Engine component F1-01: "Configurable number line" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y7-003 Comparing and ordering numbers (objective: Compare and order positive integers and decimals using place value.)
- Y7-004 Number lines and negative values (objective: Use a number line to locate and order positive and negative values.)
- Y7-005 Rounding whole numbers and decimals (objective: Round whole numbers and decimals to a stated place value using landmarks and midpoint reasoning.)
- Y7-011 Adding and subtracting negative numbers (objective: Model signed changes and calculate with negative numbers.)
- Y7-019 Fractions as numbers (objective: Interpret proper, improper and mixed fractions as numbers.)
- Y7-021 Comparing and ordering fractions (objective: Compare fractions using common denominators, benchmarks or equivalent forms.)
- Y7-024 Dividing fractions (objective: Interpret division by a fraction and calculate quotients.)
- Y7-025 Converting fractions, decimals and percentages (objective: Move accurately between common fractions, terminating decimals and percentages.)
- plus 1 more lessons

This engine must also provide these presets or modes (do not build them separately): F1-04 Vertical line and thermometer; F1-12 Number-line comparer; F5-04 Fractions on a number line.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-02 Zoomable number line

```
Build NOVA Master Visual Engine component F1-02: "Zoomable number line" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y7-002 Scaling by powers of 10 (objective: Use place value to explain scaling by 10, 100 and 1000.)
- Y7-005 Rounding whole numbers and decimals (objective: Round whole numbers and decimals to a stated place value using landmarks and midpoint reasoning.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-03 Jump-arc operator

```
Build NOVA Master Visual Engine component F1-03: "Jump-arc operator" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y7-007 Adding and subtracting whole numbers (objective: Use efficient mental and formal written methods for addition and subtraction of whole numbers.)
- Y7-011 Adding and subtracting negative numbers (objective: Model signed changes and calculate with negative numbers.)
- Y7-012 Multiplying and dividing negative numbers (objective: Calculate products and quotients involving negative numbers and explain sign patterns.)
- Y7-050 Time, clocks and timetables (objective: Calculate with time using 12-hour and 24-hour clocks, timetables and elapsed time.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-04 Vertical line and thermometer

```
Add a PRESET to NOVA Master Visual Engine component F1-01 "Configurable number line": F1-04 "Vertical line and thermometer" (Family F1).
Reason it is a preset: vertical orientation preset.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F1-01), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-004 Number lines and negative values (objective: Use a number line to locate and order positive and negative values.)
- Y7-011 Adding and subtracting negative numbers (objective: Model signed changes and calculate with negative numbers.)

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-05 Rounding rolling-ball

```
Build NOVA Master Visual Engine component F1-05: "Rounding rolling-ball" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y7-005 Rounding whole numbers and decimals (objective: Round whole numbers and decimals to a stated place value using landmarks and midpoint reasoning.)
- Y7-006 Estimation and order of magnitude (objective: Use rounding to predict the approximate size of a calculation.)
- Y8-009 Significant figures and estimation (objective: Round to significant figures and use that rounding to estimate calculations.)
- Y9-004 Measurement error and estimation (objective: Use error intervals and estimation to reason about the possible accuracy of measurements and calculated results.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-06 Inequality line

```
Build NOVA Master Visual Engine component F1-06: "Inequality line" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y8-017 Linear inequalities and number-line solutions (objective: Solve simple linear inequalities and represent their solution sets on number lines.)
- Y8-018 Multi-step and compound inequalities (objective: Solve and interpret multi-step linear inequalities.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-07 Card-placing line

```
Build NOVA Master Visual Engine component F1-07: "Card-placing line" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y7-003 Comparing and ordering numbers (objective: Compare and order positive integers and decimals using place value.)
- Y7-004 Number lines and negative values (objective: Use a number line to locate and order positive and negative values.)
- Y7-021 Comparing and ordering fractions (objective: Compare fractions using common denominators, benchmarks or equivalent forms.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-08 Estimation line

```
Build NOVA Master Visual Engine component F1-08: "Estimation line" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y7-006 Estimation and order of magnitude (objective: Use rounding to predict the approximate size of a calculation.)
- Y8-009 Significant figures and estimation (objective: Round to significant figures and use that rounding to estimate calculations.)
- Y9-001 The real number system (objective: Classify integers, rational numbers and irrational numbers within the real numbers.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-09 Scale reader

```
Build NOVA Master Visual Engine component F1-09: "Scale reader" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y8-010 Error intervals and bounds in context (objective: Describe possible values represented by rounded measurements and use those intervals in context.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-10 Powers-of-ten zoom

```
Build NOVA Master Visual Engine component F1-10: "Powers-of-ten zoom" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y8-003 Standard form and comparing standard-form numbers (objective: Represent, compare and order large and small numbers in standard form.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-11 Error-interval line

```
Build NOVA Master Visual Engine component F1-11: "Error-interval line" (Family F1: Number Line and Scale Engine).
Family covers: integers, directed numbers, decimals, rounding, ordering, inequalities, estimation, scale reading.
Used in these KS3 lessons:
- Y8-010 Error intervals and bounds in context (objective: Describe possible values represented by rounded measurements and use those intervals in context.)
- Y9-004 Measurement error and estimation (objective: Use error intervals and estimation to reason about the possible accuracy of measurements and calculated results.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F1-12 Number-line comparer

```
Add a PRESET to NOVA Master Visual Engine component F1-01 "Configurable number line": F1-12 "Number-line comparer" (Family F1).
Reason it is a preset: two lines stacked on one engine.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F1-01), and its entry in the family gallery.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F2: Place Value and Number Structure

## Family run prompt

```
Build NOVA Master Visual Engine Family F2: Place Value and Number Structure as a gallery plus components.
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.

Components, in order (items marked preset are modes of another engine, not separate builds):
F2-01 Place-value chart slider
F2-02 Counters on place-value grid
F2-03 Base-ten blocks
F2-04 Decimal base-ten blocks [preset of F2-03]
F2-05 Abacus / Gattegno chart
F2-06 Column add and subtract animator
F2-07 Multiplication and division layouts
F2-08 Number expander
F2-09 Standard form scaler
F2-10 Powers and roots builder
F2-11 BIDMAS collapsing tree
F2-12 Negative place value
F2-13 Number bonds and ten frames
F2-14 Hundred-square explorer
F2-15 Binary and other bases
F2-16 Number-set classifier (natural to real, rational and irrational)

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F2-01 Place-value chart slider

```
Build NOVA Master Visual Engine component F2-01: "Place-value chart slider" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-001 Place value in integers and decimals (objective: Understand the base-10 place-value system on both sides of the decimal point.)
- Y7-002 Scaling by powers of 10 (objective: Use place value to explain scaling by 10, 100 and 1000.)
- Y7-003 Comparing and ordering numbers (objective: Compare and order positive integers and decimals using place value.)
- Y7-008 Adding and subtracting decimals (objective: Add and subtract decimals by aligning equal-sized places.)
- Y8-003 Standard form and comparing standard-form numbers (objective: Represent, compare and order large and small numbers in standard form.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-02 Counters on place-value grid

```
Build NOVA Master Visual Engine component F2-02: "Counters on place-value grid" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-002 Scaling by powers of 10 (objective: Use place value to explain scaling by 10, 100 and 1000.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-03 Base-ten blocks

```
Build NOVA Master Visual Engine component F2-03: "Base-ten blocks" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-001 Place value in integers and decimals (objective: Understand the base-10 place-value system on both sides of the decimal point.)
- Y7-007 Adding and subtracting whole numbers (objective: Use efficient mental and formal written methods for addition and subtraction of whole numbers.)
- Y7-008 Adding and subtracting decimals (objective: Add and subtract decimals by aligning equal-sized places.)
- Y7-010 Dividing whole numbers and decimals (objective: Use grouping, sharing and place-value reasoning to divide whole numbers and decimals.)

This engine must also provide these presets or modes (do not build them separately): F2-04 Decimal base-ten blocks.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-04 Decimal base-ten blocks

```
Add a PRESET to NOVA Master Visual Engine component F2-03 "Base-ten blocks": F2-04 "Decimal base-ten blocks" (Family F2).
Reason it is a preset: decimal blocks are a preset of base-ten blocks.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F2-03), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-001 Place value in integers and decimals (objective: Understand the base-10 place-value system on both sides of the decimal point.)
- Y7-008 Adding and subtracting decimals (objective: Add and subtract decimals by aligning equal-sized places.)
- Y7-010 Dividing whole numbers and decimals (objective: Use grouping, sharing and place-value reasoning to divide whole numbers and decimals.)

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-05 Abacus / Gattegno chart

```
Build NOVA Master Visual Engine component F2-05: "Abacus / Gattegno chart" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-06 Column add and subtract animator

```
Build NOVA Master Visual Engine component F2-06: "Column add and subtract animator" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-007 Adding and subtracting whole numbers (objective: Use efficient mental and formal written methods for addition and subtraction of whole numbers.)
- Y7-008 Adding and subtracting decimals (objective: Add and subtract decimals by aligning equal-sized places.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-07 Multiplication and division layouts

```
Build NOVA Master Visual Engine component F2-07: "Multiplication and division layouts" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-009 Multiplying whole numbers and decimals (objective: Use place-value reasoning and efficient written methods to multiply whole numbers and decimals.)
- Y7-010 Dividing whole numbers and decimals (objective: Use grouping, sharing and place-value reasoning to divide whole numbers and decimals.)

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-08 Number expander

```
Build NOVA Master Visual Engine component F2-08: "Number expander" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-001 Place value in integers and decimals (objective: Understand the base-10 place-value system on both sides of the decimal point.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Number card expanding into place-value neonCards (e.g. 3 000 + 400 + 20 + 5) on the F2-01 place colours, with brace back to the number.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): number > digits lift out into cards > cards spread > recombine.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag place cards back onto the number slots; drag missing parts.
- Correct in Challenge: expanded/compact form correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-09 Standard form scaler

```
Build NOVA Master Visual Engine component F2-09: "Standard form scaler" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y8-003 Standard form and comparing standard-form numbers (objective: Represent, compare and order large and small numbers in standard form.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. F2-01 place chart with digits sliding by powers of ten and an x10^n pill; standard-form chip with small raised power.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): number > slide to a x 10^n (1<=a<10) > power counts moves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the decimal point/digits along the chart.
- Correct in Challenge: standard form correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-10 Powers and roots builder

```
Build NOVA Master Visual Engine component F2-10: "Powers and roots builder" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-017 Squares, cubes and roots (objective: Use square/cube numbers and associated roots.)
- Y8-001 Index notation and repeated multiplication (objective: Use index notation to represent repeated multiplication.)
- Y8-002 Laws of indices (objective: Use multiplication and division laws for powers with the same base.)
- Y9-003 Fractional indices (objective: Interpret and calculate with unit-fraction and fractional indices as roots and powers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass squares/cubes and repeated-factor strips building powers; root as side length.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): factor strip > collapse to power > reverse to root.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag factor tiles into strip; drag root side handle.
- Correct in Challenge: power/root correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-11 BIDMAS collapsing tree

```
Build NOVA Master Visual Engine component F2-11: "BIDMAS collapsing tree" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-018 Priority of operations (objective: Apply brackets, powers, roots, reciprocals and operation priority correctly.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. BIDMAS expression tree (neonPath + neonRing nodes) collapsing from the deepest operation.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): highlight next operation > subtree collapses with glow > value chip > repeat.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the next-operation ring onto a node.
- Correct in Challenge: order and value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-down, oops on wrong order; Izaac idea.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-12 Negative place value

```
Build NOVA Master Visual Engine component F2-12: "Negative place value" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. F2-01 chart extended with negative zone and core number line below; counters with sign.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): place > cross zero > value reading.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters across zero; zero pairs cancel.
- Correct in Challenge: value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-13 Number bonds and ten frames

```
Build NOVA Master Visual Engine component F2-13: "Number bonds and ten frames" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass ten frames and part-whole bond circles (neonRing) linked.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): fill frame > split into bond > partner glows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters into frames; drag partner number.
- Correct in Challenge: bond correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova show-two.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-14 Hundred-square explorer

```
Build NOVA Master Visual Engine component F2-14: "Hundred-square explorer" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
Used in these KS3 lessons:
- Y7-013 Factors and multiples (objective: Distinguish factors from multiples and find them systematically.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. 10x10 hundred square glass grid with roving tabindex; +1/+10 arrows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): highlight > move by tens and ones > land.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a ring marker; drag jump pills.
- Correct in Challenge: landing number correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova point-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-15 Binary and other bases

```
Build NOVA Master Visual Engine component F2-15: "Binary and other bases" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Base-b place chart (powers of b) with on/off glass bulbs for binary.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): choose base > fill places > convert to denary with count-up.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters into places (max b-1).
- Correct in Challenge: conversion correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F2-16 Number-set classifier (natural to real, rational and irrational)

```
Build NOVA Master Visual Engine component F2-16: "Number-set classifier (natural to real, rational and irrational)" (Family F2: Place Value and Number Structure).
Family covers: place value, decimals, powers of ten, standard form, column methods, BIDMAS.
(New component added by the audit.)
Used in these KS3 lessons:
- Y9-001 The real number system (objective: Classify integers, rational numbers and irrational numbers within the real numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Nested set rings N within Z within Q within R with irrational region; number cards.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): rings draw > cards drop > region glows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag number cards into the smallest correct set.
- Correct in Challenge: classification correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count, celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F3: Arrays, Area Models and Multiplicative Structure

## Family run prompt

```
Build NOVA Master Visual Engine Family F3: Arrays, Area Models and Multiplicative Structure as a gallery plus components.
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.

Components, in order (items marked preset are modes of another engine, not separate builds):
F3-01 Array builder
F3-02 Area model of multiplication
F3-03 Partitioned grid method
F3-04 Factor-pair rainbow
F3-05 Prime sieve and factor tree
F3-06 Prime factor ladder
F3-07 HCF and LCM Venn
F3-08 Multiples overlap tracks
F3-09 Square and cube builders
F3-10 Index law animator
F3-11 Root finder
F3-12 Divisibility explorer
F3-13 Division sharing and grouping
F3-14 Multiplication-table explorer
F3-15 Surd and exact-value builder

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F3-01 Array builder

```
Build NOVA Master Visual Engine component F3-01: "Array builder" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-015 Prime factorisation (objective: Express integers as products of prime factors.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Stage at 380: the array fills ~65% of the stage height, controls strip below. Draw a rows x cols array of glass neonTile cells (dots mode = neonRing dots) on a faint snap grid; a row brace (NOVA.svg.brace) on the left and a column brace on top with chalkText labels (rows, cols, and the product as an answerChip); a draggable split-line (neonLine, gold) that partitions the array into two sub-arrays showing a factor pair / distributive split; a factor-tree view (toggle) built from neonPath branches with each node a neonRing, primes ringed in result-green and composites in amber, leaves collected into a prime-factor product strip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): build-rows (cells drop in row by row, staggered pop) > count-up (NOVA.countUp on the product chip) > rotate (array turns 90 deg to show commutativity) > split (split-line slides, two sub-array braces appear) > tree (product node branches into a factor pair, recursing until all leaves are prime, primes ring-flash) > collect (leaves fly to the product strip).
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the array's bottom-right corner handle to resize rows x cols (snaps to whole cells, max from CONFIG); drag the split-line along grid lines (snaps between rows/cols); in tree mode drag factor cards from a tray onto an empty branch node (valid pair glows green, wrong pair springs back); re-grab any card; tray = red remove zone; keyboard: arrows resize/move, Enter picks/drops.
- Correct in Challenge: Challenge: build an array for a given product, find all factor pairs (each found pair adds a ringed card), or complete a factor tree whose leaves multiply to the target with every leaf prime; marked on structure, not just the final number. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip guides: explain (intro), count (build-rows), point-down (braces), compare (rotate), magnify (tree leaves), celebrate on correct, not-yet + encourage on wrong; Nova dock explain-right on split, checking in Challenge; Izaac read-tablet while a Challenge is open, idea on hint, victory after 3/3. Speech intent: 'rows times columns', 'same total turned round', 'keep splitting until every branch is prime'. Sir Bob narrates why area = rows x cols and why a prime cannot split.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-02 Area model of multiplication

```
Build NOVA Master Visual Engine component F3-02: "Area model of multiplication" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-009 Multiplying whole numbers and decimals (objective: Use place-value reasoning and efficient written methods to multiply whole numbers and decimals.)
- Y7-022 Adding and subtracting fractions (objective: Add and subtract fractions by creating equal-sized parts first.)
- Y7-023 Multiplying fractions (objective: Multiply fractions and interpret a fraction of a fraction.)
- Y7-031 Expanding a single bracket (objective: Use the distributive law to expand a single bracket.)
- Y7-032 Factorising a common factor (objective: Reverse expansion by taking out a common factor.)
- Y8-005 Adding and subtracting mixed-number fractions (objective: Add and subtract fractions and mixed numbers accurately.)
- Y8-011 Expanding and simplifying double brackets (objective: Expand products of two binomials and simplify the resulting expression.)
- Y9-006 Algebraic equivalence (objective: Recognise and prove simple algebraic equivalence.)
- plus 1 more lessons

This engine must also provide these presets or modes (do not build them separately): F5-03 Area-model fractions; F7-04 Expanding single brackets; F7-05 Expanding double brackets.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass rectangle split into neonBox place-value parts (e.g. 20+3 by 10+4), each part a different maths colour with its partial product chalk label; side braces show the partitioned factors; total answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): outline > partition sides > fill parts one by one > partial products count up > sum to total.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag partition handles on each side to choose the split; drag partial-product cards into their part.
- Correct in Challenge: the partial products and total are correct for the target product. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-two on partition, count on partials, celebrate; Nova explain-left. Speech: 'split each side into friendly parts'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-03 Partitioned grid method

```
Build NOVA Master Visual Engine component F3-03: "Partitioned grid method" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-009 Multiplying whole numbers and decimals (objective: Use place-value reasoning and efficient written methods to multiply whole numbers and decimals.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Grid-method table drawn as glass neonBox cells with header row/column of partitioned numbers; partial products appear in cells; sum column.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): headers split > cells multiply in sequence (glow sweep) > column add > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag number cards into header cells and products into grid cells; wrong cell springs back.
- Correct in Challenge: every cell product and the total correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-right along rows, thumbs-up; Nova checking. Speech: 'multiply each pair, then add'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-04 Factor-pair rainbow

```
Build NOVA Master Visual Engine component F3-04: "Factor-pair rainbow" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-013 Factors and multiples (objective: Distinguish factors from multiples and find them systematically.)
- Y7-014 Prime numbers (objective: Recognise prime and composite numbers from their factor structure.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Number line (NOVA.numberLine 1..n) with neonPath rainbow arcs joining factor pairs above it; the centre (square root) marked with a neonRing.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): list 1 and n > arc appears > step through candidates (non-factors flash amber and fade) > arcs meet at the middle.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag an arc end onto a number to propose a pair; a valid pair locks with glow.
- Correct in Challenge: all factor pairs found, none extra. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler, idea when arcs meet; Nova point-up. Speech: 'factors come in pairs, stop at the middle'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-05 Prime sieve and factor tree

```
Build NOVA Master Visual Engine component F3-05: "Prime sieve and factor tree" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-014 Prime numbers (objective: Recognise prime and composite numbers from their factor structure.)
- Y7-015 Prime factorisation (objective: Express integers as products of prime factors.)
- Y8-004 Prime factors, HCF and LCM (objective: Use prime factorisation to solve HCF and LCM problems efficiently.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Toggle: 1-100 sieve grid of glass neonTile cells (multiples cross out in each prime's colour) / factor tree from neonPath + neonRing nodes with primes ringed green.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): sieve: pick 2 > multiples sweep out > next uncrossed > repeat; tree: split > split > leaves collect into a product.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a prime onto the grid to strike its multiples; drag factor cards onto tree nodes.
- Correct in Challenge: primes identified / tree leaves all prime and multiply to n. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip magnify, count; Nova think; Izaac idea on hint. Speech: 'the first number left standing is prime'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-06 Prime factor ladder

```
Build NOVA Master Visual Engine component F3-06: "Prime factor ladder" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-015 Prime factorisation (objective: Express integers as products of prime factors.)
- Y7-016 HCF and LCM (objective: Use factors and prime decomposition to find highest common factors and lowest common multiples.)
- Y8-004 Prime factors, HCF and LCM (objective: Use prime factorisation to solve HCF and LCM problems efficiently.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Division ladder: n at top, each rung a neonBox with the prime divisor on the left (ringed) and quotient on the right, stepping down to 1; product strip of primes with index form.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): divide by smallest prime > rung drops > repeat to 1 > primes gather into index form (powers small, raised).
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a prime card to the divisor slot of the next rung (non-divisor springs back).
- Correct in Challenge: ladder reaches 1 using only primes; index form correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-down per rung, celebrate; Nova checking. Speech: 'always try the smallest prime first'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-07 HCF and LCM Venn

```
Build NOVA Master Visual Engine component F3-07: "HCF and LCM Venn" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-016 HCF and LCM (objective: Use factors and prime decomposition to find highest common factors and lowest common multiples.)
- Y7-032 Factorising a common factor (objective: Reverse expansion by taking out a common factor.)
- Y8-004 Prime factors, HCF and LCM (objective: Use prime factorisation to solve HCF and LCM problems efficiently.)
- Y8-012 Factorising common factors (objective: Factorise expressions by taking out a common factor.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two overlapping glass neonPath circles (A, B) with prime-factor cards; shared primes in the overlap; HCF answerChip = product of overlap, LCM = product of all.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): factorise both > common primes slide into the overlap > HCF multiplies > LCM multiplies.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag prime cards into A only, B only or overlap; wrong region springs back.
- Correct in Challenge: regions correct and HCF/LCM correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare, show-two; Nova explain-right; Izaac read-tablet. Speech: 'shared factors live in the middle'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-08 Multiples overlap tracks

```
Build NOVA Master Visual Engine component F3-08: "Multiples overlap tracks" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-013 Factors and multiples (objective: Distinguish factors from multiples and find them systematically.)
- Y7-016 HCF and LCM (objective: Use factors and prime decomposition to find highest common factors and lowest common multiples.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two parallel NOVA.numberLine tracks with hops of a and b (NOVA.svg.hop arcs); common multiples lit by a vertical neonLine and neonRing.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): hops along track A > hops along B > first coincidence flashes (LCM) > further ones.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a ring marker to the first common landing point.
- Correct in Challenge: LCM / common multiple identified. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-right, idea; Nova think. Speech: 'where do both jumps land together?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-09 Square and cube builders

```
Build NOVA Master Visual Engine component F3-09: "Square and cube builders" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-017 Squares, cubes and roots (objective: Use square/cube numbers and associated roots.)
- Y8-001 Index notation and repeated multiplication (objective: Use index notation to represent repeated multiplication.)
- Y9-002 Powers, roots and exact values (objective: Use integer powers and associated roots and distinguish exact from approximate values.)
- Y9-003 Fractional indices (objective: Interpret and calculate with unit-fraction and fractional indices as roots and powers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Isometric glass cube stack (neonBox faces with lift) building n x n squares and n x n x n cubes; side braces with chalk n; value chip with small raised power.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): place row > fill square > stack layers > count-up total.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag unit cubes from a tray onto the build grid (snap); remove to tray.
- Correct in Challenge: built shape matches n^2 or n^3 for the target. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip count, show-three; Nova point-up. Speech: 'a square is n by n, a cube adds the height'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-10 Index law animator

```
Build NOVA Master Visual Engine component F3-10: "Index law animator" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y8-001 Index notation and repeated multiplication (objective: Use index notation to represent repeated multiplication.)
- Y8-002 Laws of indices (objective: Use multiplication and division laws for powers with the same base.)
- Y9-003 Fractional indices (objective: Interpret and calculate with unit-fraction and fractional indices as roots and powers.)

This engine must also provide these presets or modes (do not build them separately): F8-13 Index laws in algebra.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Expanded factor strips of base tiles (neonTile) showing a^m x a^n as joined strips, a^m / a^n as cancelling tiles, (a^m)^n as repeated groups; index chips small and raised.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): expand > join or cancel (pairs fade with glow) > recount > compressed index form.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag strips together to multiply, drag tiles onto partners to cancel.
- Correct in Challenge: resulting index correct for each law. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain, count; Nova checking; Izaac idea. Speech: 'count the factors, do not multiply the powers'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-11 Root finder

```
Build NOVA Master Visual Engine component F3-11: "Root finder" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-017 Squares, cubes and roots (objective: Use square/cube numbers and associated roots.)
- Y9-002 Powers, roots and exact values (objective: Use integer powers and associated roots and distinguish exact from approximate values.)
- Y9-003 Fractional indices (objective: Interpret and calculate with unit-fraction and fractional indices as roots and powers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass square of area n (neonBox) with adjustable side on a NOVA.numberLine; for cube roots an isometric cube; side estimate ring between two integers.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): area given > side grows > overshoot/undershoot flash > settle between bounds.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the side handle along the number line to estimate the root.
- Correct in Challenge: estimate within tolerance / exact root for perfect squares. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler, think; Nova point-left. Speech: 'which square is just below and just above?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-12 Divisibility explorer

```
Build NOVA Master Visual Engine component F3-12: "Divisibility explorer" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-014 Prime numbers (objective: Recognise prime and composite numbers from their factor structure.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Number card with divisibility test lenses (neonCard per rule 2,3,4,5,6,9,10); digit-sum chain and last-digit highlight in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): pick rule > highlight digits > compute (sum chain) > lens lights green or amber.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the number onto each test lens / drag rule cards into 'divides' or 'does not' bins.
- Correct in Challenge: sort correct for all rules. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip magnify, thumbs-up; Nova checking. Speech: 'look at the last digit' / 'add the digits'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-13 Division sharing and grouping

```
Build NOVA Master Visual Engine component F3-13: "Division sharing and grouping" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-010 Dividing whole numbers and decimals (objective: Use grouping, sharing and place-value reasoning to divide whole numbers and decimals.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Counters (neonRing) and group hoops (neonPath); sharing mode deals counters into k hoops; grouping mode lassoes groups of k; remainder counters glow amber.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): deal one by one (stagger) > groups complete > remainder set aside > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters into hoops (snap), drag a hoop around k counters.
- Correct in Challenge: correct quotient and remainder. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-one per deal, count; Nova explain-right. Speech: 'sharing asks how many each, grouping asks how many groups'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-14 Multiplication-table explorer

```
Build NOVA Master Visual Engine component F3-14: "Multiplication-table explorer" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
Used in these KS3 lessons:
- Y7-012 Multiplying and dividing negative numbers (objective: Calculate products and quotients involving negative numbers and explain sign patterns.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. 12x12 glass multiplication grid (neonTile cells, roving tabindex) with row/column highlight crosshair; selected product shown as a sub-array overlay.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): select row > select column > crosshair glows > sub-array fills > product chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a crosshair handle; drag product cards onto cells.
- Correct in Challenge: products placed correctly. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-down, high-five; Nova idea. Speech: 'spot the patterns along the diagonal'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F3-15 Surd and exact-value builder

```
Build NOVA Master Visual Engine component F3-15: "Surd and exact-value builder" (Family F3: Arrays, Area Models and Multiplicative Structure).
Family covers: multiplication, division, factors, multiples, primes, HCF, LCM, indices.
(New component added by the audit.)
Used in these KS3 lessons:
- Y9-002 Powers, roots and exact values (objective: Use integer powers and associated roots and distinguish exact from approximate values.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass square of area n split into a perfect-square factor tile and remainder tile; surd chip root(n) = a root(b) with the root sign drawn by the maths renderer; exact-value cards.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): factorise n > largest square factor lifts out > root taken > simplified form.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag square-factor tiles out of n; drag simplified cards to match.
- Correct in Challenge: simplest surd form correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip magnify, celebrate; Nova checking. Speech: 'find the biggest square factor'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F4: Bar Models and Part-Whole

## Family run prompt

```
Build NOVA Master Visual Engine Family F4: Bar Models and Part-Whole as a gallery plus components.
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.

Components, in order (items marked preset are modes of another engine, not separate builds):
F4-01 Part-whole bar
F4-02 Comparison bar
F4-03 Cuisenaire-rod builder
F4-04 Multi-step bar model
F4-05 Fraction-of-amount bar [preset of F5-11]
F4-06 Percentage bar
F4-07 Ratio bar
F4-08 Algebra bar
F4-09 Before-and-after bar
F4-10 Bar-to-equation translator [preset of F4-08]
F4-11 Word-problem highlighter
F4-12 Rates tape diagram

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F4-01 Part-whole bar

```
Build NOVA Master Visual Engine component F4-01: "Part-whole bar" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-035 Forming and solving equations from contexts (objective: Translate contextual relationships into linear equations and solve them.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass whole bar (neonBox) on top with brace and total chip; parts bar beneath split into labelled glass segments; unknown part as a gold placeholder.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): whole appears > splits into parts > known parts fill > unknown pulses > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag part-length cards onto segments; drag a divider handle to resize parts.
- Correct in Challenge: unknown part found and bar adds to the whole. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-down, show-two, celebrate; Nova explain-right. Speech: 'whole = part + part'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-02 Comparison bar

```
Build NOVA Master Visual Engine component F4-02: "Comparison bar" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-007 Adding and subtracting whole numbers (objective: Use efficient mental and formal written methods for addition and subtraction of whole numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two stacked glass bars on a shared left edge with a gold difference segment and brace; value chips on each.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): bar A grows > bar B grows > difference segment lights > difference value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the end of a bar to set its length; drag the difference brace onto the gap.
- Correct in Challenge: difference / missing quantity correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare, ruler; Nova point-right. Speech: 'line them up, then look at the gap'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-03 Cuisenaire-rod builder

```
Build NOVA Master Visual Engine component F4-03: "Cuisenaire-rod builder" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-019 Fractions as numbers (objective: Interpret proper, improper and mixed fractions as numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Tray of coloured glass Cuisenaire rods (neonBox, lengths 1-10, each colour + length label) and a build track on a 1-unit snap grid.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): rods slide in > train forms > equal-length trains glow > relation shown.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag rods from the tray onto the track (snap end to end), re-order, drag back to remove.
- Correct in Challenge: train matches target length / relation. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler, count; Nova checking. Speech: 'which rods make the same length?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-04 Multi-step bar model

```
Build NOVA Master Visual Engine component F4-04: "Multi-step bar model" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y8-038 Percentage-change problem solving (objective: Solve multi-step increase/decrease and original-value problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Stack of 2-3 linked glass bars, each step's result feeding the next (connector neonPath arrows via NOVA.svg.arrow); unknowns gold.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): step 1 bar > result carried down > step 2 bar > final answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag result chips from one bar to the next bar's slot.
- Correct in Challenge: each step value and final answer correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain, point-down; Izaac read-tablet. Speech: 'solve one bar, then use it in the next'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-05 Fraction-of-amount bar

```
Add a PRESET to NOVA Master Visual Engine component F5-11 "Fraction of an amount": F4-05 "Fraction-of-amount bar" (Family F4).
Reason it is a preset: same fraction-of-amount picture.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F5-11), and its entry in the family gallery.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Preset of F5-11: bar of n glass units split into d equal sections, k shaded.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): split > shade > one part value > k parts.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the shading handle; drag value chips into parts.
- Correct in Challenge: fraction of amount correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-three; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-06 Percentage bar

```
Build NOVA Master Visual Engine component F4-06: "Percentage bar" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-026 Percentage of an amount (objective: Find a percentage of a quantity using multiplicative methods.)
- Y7-027 One quantity as a percentage of another (objective: Express one quantity as a percentage of another and interpret percentages above 100%.)
- Y7-062 Percentage increase, decrease and multipliers (objective: Use percentage change and multipliers to increase or decrease quantities.)
- Y7-063 Simple interest (objective: Calculate and interpret simple interest.)
- Y8-007 Percentage multipliers (objective: Use multipliers for increase and decrease.)
- Y8-008 Reverse percentages (objective: Find an original amount from a final amount after percentage change.)
- Y8-038 Percentage-change problem solving (objective: Solve multi-step increase/decrease and original-value problems.)
- Y8-040 Wages, deductions and budgeting (objective: Solve problems about earnings, deductions and budgets using percentages and unit prices.)
- plus 1 more lessons

This engine must also provide these presets or modes (do not build them separately): F5-16 Reverse percentage.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. 100% glass bar split into 10 tenths (neonBox cells) with a percent NOVA.numberLine above and amount line below (double line); known/unknown chips.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): 100% = amount > split tenths > 10% value > build p% > answer.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the % handle along the bar (snaps to 1/5/10%); drag value chips to cells.
- Correct in Challenge: p% of amount / missing original correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler, count; Nova checking. Speech: 'find 10% first, then build'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-07 Ratio bar

```
Build NOVA Master Visual Engine component F4-07: "Ratio bar" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-058 Ratio notation and simplifying ratios (objective: Represent multiplicative comparisons with ratio notation and simplify ratios without changing the relationship.)
- Y7-059 Sharing in a ratio (objective: Divide a quantity in a given ratio.)
- Y8-034 Ratio with fractions and decimals (objective: Use ratios involving fractional and decimal quantities.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Ratio bars: one glass bar per share with equal unit boxes; total brace; one-unit value chip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): boxes appear per ratio > total brace > one unit = total / units > shares fill.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag unit boxes onto each person's bar; drag the unit value into a box.
- Correct in Challenge: share values correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-two, celebrate; Nova explain-right. Speech: 'count the boxes, find one box'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-08 Algebra bar

```
Build NOVA Master Visual Engine component F4-08: "Algebra bar" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-034 Forming expressions from contexts (objective: Translate verbal and geometric relationships into algebraic expressions.)
- Y7-035 Forming and solving equations from contexts (objective: Translate contextual relationships into linear equations and solve them.)

This engine must also provide these presets or modes (do not build them separately): F4-10 Bar-to-equation translator; F7-11 Bar-model equation.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Bar of x-boxes (glass, gold x label) and number boxes equal to a total bar; balance with equation chip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): build expression bar > match total > remove knowns > x revealed.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag x-boxes and number boxes onto the bar; drag knowns off to the tray.
- Correct in Challenge: x value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip think, idea; Izaac idea on hint. Speech: 'take away what you know'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-09 Before-and-after bar

```
Build NOVA Master Visual Engine component F4-09: "Before-and-after bar" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y8-008 Reverse percentages (objective: Find an original amount from a final amount after percentage change.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Before and after bars stacked with change segment (green increase / red decrease) and arrow via NOVA.svg.arrow.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): before bar > change segment animates > after bar > relation.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the change segment; drag values into before/after.
- Correct in Challenge: unknown before/after/change correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare; Nova point-down. Speech: 'what stayed the same?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-10 Bar-to-equation translator

```
Add a PRESET to NOVA Master Visual Engine component F4-08 "Algebra bar": F4-10 "Bar-to-equation translator" (Family F4).
Reason it is a preset: equation overlay on the algebra bar.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F4-08), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-035 Forming and solving equations from contexts (objective: Translate contextual relationships into linear equations and solve them.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Preset of F4-08: bar model on the left, equation chips on the right, linked by glowing connectors.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): bar > each part maps to a term > equation assembles.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag terms from the bar into the equation slots.
- Correct in Challenge: equation matches the bar. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-right; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-11 Word-problem highlighter

```
Build NOVA Master Visual Engine component F4-11: "Word-problem highlighter" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y7-034 Forming expressions from contexts (objective: Translate verbal and geometric relationships into algebraic expressions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Word problem in chalk-write with tap/drag highlighter colours (whole, part, difference); highlighted phrases fly into an empty bar model.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): read > highlight quantities > phrases fly to bar > bar labelled.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag highlighted phrases onto bar slots.
- Correct in Challenge: each quantity in the right role. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip read, magnify; Nova explain-left. Speech: 'what is the whole here?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F4-12 Rates tape diagram

```
Build NOVA Master Visual Engine component F4-12: "Rates tape diagram" (Family F4: Bar Models and Part-Whole).
Family covers: four operations, comparison, fractions, ratio, percentage, algebra word problems.
Used in these KS3 lessons:
- Y8-041 Speed (objective: Use speed as a compound unit and solve speed–distance–time problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Tape diagram: two aligned glass tapes (quantity 1 per unit, quantity 2) with unit dividers and rate chip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): unit tape > copy units > read matching amount.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the unit divider; drag rate chip onto tape.
- Correct in Challenge: rate / amount correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler; Nova point-up. Speech: 'one unit gives how much?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F5: Fractions, Decimals and Percentages

## Family run prompt

```
Build NOVA Master Visual Engine Family F5: Fractions, Decimals and Percentages as a gallery plus components.
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.

Components, in order (items marked preset are modes of another engine, not separate builds):
F5-01 Fraction strips and wall
F5-02 Fraction circles
F5-03 Area-model fractions [preset of F3-02]
F5-04 Fractions on a number line [preset of F1-01]
F5-05 Equivalent-fraction multiplier
F5-06 Simplifier
F5-07 Add and subtract fractions
F5-08 Multiply fractions
F5-09 Divide fractions
F5-10 Mixed and improper converter
F5-11 Fraction of an amount
F5-12 10x10 percentage grid
F5-13 FDP conversion machine
F5-14 Percentage of an amount
F5-15 Percentage change and multipliers
F5-16 Reverse percentage [preset of F4-06]
F5-17 Recurring decimal explorer
F5-18 Terminating or recurring sorter
F5-19 Pizza and chocolate-bar contexts

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F5-01 Fraction strips and wall

```
Build NOVA Master Visual Engine component F5-01: "Fraction strips and wall" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-019 Fractions as numbers (objective: Interpret proper, improper and mixed fractions as numbers.)
- Y7-020 Equivalent and simplified fractions (objective: Recognise, generate and simplify equivalent fractions without changing their value.)
- Y7-021 Comparing and ordering fractions (objective: Compare fractions using common denominators, benchmarks or equivalent forms.)
- Y7-022 Adding and subtracting fractions (objective: Add and subtract fractions by creating equal-sized parts first.)
- Y7-024 Dividing fractions (objective: Interpret division by a fraction and calculate quotients.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass fraction wall (neonBox glass like F2-03 blocks): 1 whole then 1/2..1/12 rows; at 380 rows 1,2,3,4,6,8 with an 'all rows' toggle; compare rail under the wall; labels via TBD fraction placeholder >= 14px.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): split (whole splits row by row, staggered with glow sweep) > compare (two equal-length rows light up).
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a piece from any row onto the compare rail (lift, snap, length readout); equal end-to-end pieces flash green 'equal length'.
- Correct in Challenge: equivalent pieces identified. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler measuring, celebrate on match; Nova point-down in dock.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-02 Fraction circles

```
Build NOVA Master Visual Engine component F5-02: "Fraction circles" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-019 Fractions as numbers (objective: Interpret proper, improper and mixed fractions as numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass circle with neon wedge sectors (neonPath arcs); tray of sector pieces 1/2..1/8; two circles side by side at 1280, stacked at 380.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): explode (sectors spin apart) > rejoin > equal shaded areas get a glow-ring outline.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag sectors into the circle (snap to next free angle), back to tray to remove; overflow refused and springs back.
- Correct in Challenge: shaded fraction / equivalence correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-two or compare; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-03 Area-model fractions

```
Add a PRESET to NOVA Master Visual Engine component F3-02 "Area model of multiplication": F5-03 "Area-model fractions" (Family F5).
Reason it is a preset: fractions in the area model.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F3-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-022 Adding and subtracting fractions (objective: Add and subtract fractions by creating equal-sized parts first.)
- Y7-023 Multiplying fractions (objective: Multiply fractions and interpret a fraction of a fraction.)
- Y8-005 Adding and subtracting mixed-number fractions (objective: Add and subtract fractions and mixed numbers accurately.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Area model: glass rectangle, column selection and row selection; overlap in result-green glow fill (no check glyphs); includes F5-08 multiply preset.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): column sweep across > row sweep down > overlap cells pulse and count up (NOVA.countUp).
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag column and row handles along the edges to set a and c; keyboard arrows do the same.
- Correct in Challenge: overlap fraction correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip magnify, count; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-04 Fractions on a number line

```
Add a PRESET to NOVA Master Visual Engine component F1-01 "Configurable number line": F5-04 "Fractions on a number line" (Family F5).
Reason it is a preset: fractions are a labelling preset.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F1-01), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-019 Fractions as numbers (objective: Interpret proper, improper and mixed fractions as numbers.)
- Y7-021 Comparing and ordering fractions (objective: Compare fractions using common denominators, benchmarks or equivalent forms.)
- Y7-024 Dividing fractions (objective: Interpret division by a fraction and calculate quotients.)
- Y7-025 Converting fractions, decimals and percentages (objective: Move accurately between common fractions, terminating decimals and percentages.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. F1-01 fractions preset: NOVA.numberLine({min,max,major:1,minor:1/d}) top and bottom (d and d x k).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): hop from 0 (NOVA.svg.hop trail) > lower line re-partitions with animated split while the ring stays.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a neon ring along the line, snapping to minor values; stepper key 'numerator'.
- Correct in Challenge: position / equivalence correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-down; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-05 Equivalent-fraction multiplier

```
Build NOVA Master Visual Engine component F5-05: "Equivalent-fraction multiplier" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-020 Equivalent and simplified fractions (objective: Recognise, generate and simplify equivalent fractions without changing their value.)
- Y8-015 Equations with fractions (objective: Solve linear equations containing simple fractional coefficients.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass strip with shaded parts and a 'split x k' handle; numerator/denominator TBD tags.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): split (every part splits into k, staggered glow) > tags pulse x k together; shaded endpoint ring stays fixed.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the split handle (or stepper).
- Correct in Challenge: equivalent fraction built. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip count while splitting; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-06 Simplifier

```
Build NOVA Master Visual Engine component F5-06: "Simplifier" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-020 Equivalent and simplified fractions (objective: Recognise, generate and simplify equivalent fractions without changing their value.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Shaded pieces on a glass bar, grouped into groups of g (F2-02 exchange style).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): gather > flash-merge > bigger piece appears; one-line captions.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag to lasso a group; engine checks it is a common factor.
- Correct in Challenge: simplest form reached. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare, celebrate; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-07 Add and subtract fractions

```
Build NOVA Master Visual Engine component F5-07: "Add and subtract fractions" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-022 Adding and subtracting fractions (objective: Add and subtract fractions by creating equal-sized parts first.)
- Y8-005 Adding and subtracting mixed-number fractions (objective: Add and subtract fractions and mixed numbers accurately.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two source bars and an empty result bar on a shared whole.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): make-same-size (both bars re-partition) > pieces combine > result.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag pieces onto the result bar; different sizes refused with hint until re-partitioned; subtraction drags pieces off to the tray.
- Correct in Challenge: sum/difference correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-08 Multiply fractions

```
Build NOVA Master Visual Engine component F5-08: "Multiply fractions" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-023 Multiplying fractions (objective: Multiply fractions and interpret a fraction of a fraction.)
- Y8-006 Multiplying and dividing mixed-number fractions (objective: Multiply and divide fractions and mixed numbers accurately.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Preset of F5-03 (multiply fractions); no separate engine.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): as F5-03.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): as F5-03.
- Correct in Challenge: product correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): as F5-03.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-09 Divide fractions

```
Build NOVA Master Visual Engine component F5-09: "Divide fractions" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-024 Dividing fractions (objective: Interpret division by a fraction and calculate quotients.)
- Y8-006 Multiplying and dividing mixed-number fractions (objective: Multiply and divide fractions and mixed numbers accurately.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Both bars on ONE scale (the group bar truly sized against the unit).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): group bar steps along the unit dropping count tiles > partial fit in gold; no '?' in Watch.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the group bar along the unit (snaps, drops a count tile at each fit).
- Correct in Challenge: quotient correct incl. fractional group. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-10 Mixed and improper converter

```
Build NOVA Master Visual Engine component F5-10: "Mixed and improper converter" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y8-005 Adding and subtracting mixed-number fractions (objective: Add and subtract fractions and mixed numbers accurately.)
- Y8-006 Multiplying and dividing mixed-number fractions (objective: Multiply and divide fractions and mixed numbers accurately.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass parts and whole bars (F2-03 rod fuse style).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): fuse (parts fuse into wholes with glow sweep) > break (a whole fans into parts).
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag parts onto the 'whole' slot; auto-fuse at d.
- Correct in Challenge: mixed/improper conversion correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip count, celebrate; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-11 Fraction of an amount

```
Build NOVA Master Visual Engine component F5-11: "Fraction of an amount" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-023 Multiplying fractions (objective: Multiply fractions and interpret a fraction of a fraction.)

This engine must also provide these presets or modes (do not build them separately): F4-05 Fraction-of-amount bar.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Counters (neonRing) and d group hoops; answer zone with count-up.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): counters fly into d equal groups (stagger and spring) > n groups highlighted > count up.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag n groups into the answer zone.
- Correct in Challenge: fraction of amount correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-three; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-12 10x10 percentage grid

```
Build NOVA Master Visual Engine component F5-12: "10x10 percentage grid" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-025 Converting fractions, decimals and percentages (objective: Move accurately between common fractions, terminating decimals and percentages.)
- Y7-026 Percentage of an amount (objective: Find a percentage of a quantity using multiplicative methods.)
- Y7-027 One quantity as a percentage of another (objective: Express one quantity as a percentage of another and interpret percentages above 100%.)
- Y7-067 Pie charts (objective: Construct and interpret pie charts using fractions, percentages and angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. 10x10 glass percentage grid, labels >= 14px, % pill.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): fill-cascade in Watch with % pill counting up.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): paint drag across cells; one roving tabindex with arrow keys.
- Correct in Challenge: shaded % matches target. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip count, thumbs-up; Nova point-down.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-13 FDP conversion machine

```
Build NOVA Master Visual Engine component F5-13: "FDP conversion machine" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-025 Converting fractions, decimals and percentages (objective: Move accurately between common fractions, terminating decimals and percentages.)
- Y7-073 Probability scale and complements (objective: Represent likelihood on the 0–1 scale and use complementary probabilities.)
- Y9-005 Fractions, decimals and percentages as operators (objective: Move flexibly between fractions, decimals and percentages and use them as multiplicative operators.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Neon machine: input hopper, gear (neonPath rotating via NOVA.motion), three output trays F/D/P; long division as remainder tiles stepping down.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): card enters > gear turns > three forms emerge > remainder tiles step down.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a value card into the hopper; drag outputs into matching trays.
- Correct in Challenge: all three forms correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Nova checking; Pip explain.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-14 Percentage of an amount

```
Build NOVA Master Visual Engine component F5-14: "Percentage of an amount" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-026 Percentage of an amount (objective: Find a percentage of a quantity using multiplicative methods.)
- Y7-027 One quantity as a percentage of another (objective: Express one quantity as a percentage of another and interpret percentages above 100%.)
- Y7-063 Simple interest (objective: Calculate and interpret simple interest.)
- Y8-068 Frequency trees (objective: Represent changing totals through categories using frequency trees.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. 100% tape (cells) with amount pill and NOVA.svg.brace under the tape; no dead band.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): tape fills cell by cell to p% > amount pill slides > brace value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the % handle along the tape.
- Correct in Challenge: p% of amount correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-15 Percentage change and multipliers

```
Build NOVA Master Visual Engine component F5-15: "Percentage change and multipliers" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-062 Percentage increase, decrease and multipliers (objective: Use percentage change and multipliers to increase or decrease quantities.)
- Y8-007 Percentage multipliers (objective: Use multipliers for increase and decrease.)
- Y8-038 Percentage-change problem solving (objective: Solve multi-step increase/decrease and original-value problems.)
- Y8-040 Wages, deductions and budgeting (objective: Solve problems about earnings, deductions and budgets using percentages and unit prices.)
- Y9-005 Fractions, decimals and percentages as operators (objective: Move flexibly between fractions, decimals and percentages and use them as multiplicative operators.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Ghost 100% outline with after-bar growing/shrinking from it, x m op pill and core arrows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): ghost > bar grows/shrinks > multiplier pill > new value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the end of the bar to set the change.
- Correct in Challenge: multiplier / new amount correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-16 Reverse percentage

```
Add a PRESET to NOVA Master Visual Engine component F4-06 "Percentage bar": F5-16 "Reverse percentage" (Family F5).
Reason it is a preset: percentage bar with an unknown original.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F4-06), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-062 Percentage increase, decrease and multipliers (objective: Use percentage change and multipliers to increase or decrease quantities.)
- Y8-008 Reverse percentages (objective: Find an original amount from a final amount after percentage change.)
- Y8-038 Percentage-change problem solving (objective: Solve multi-step increase/decrease and original-value problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. F4-06 preset: known 120% bar animating back to 100% with a division op pill and gold unknown-original placeholder.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): known bar > shrink to 100% > original revealed.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the 100% marker into place.
- Correct in Challenge: original correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip think, idea; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-17 Recurring decimal explorer

```
Build NOVA Master Visual Engine component F5-17: "Recurring decimal explorer" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y9-001 The real number system (objective: Classify integers, rational numbers and irrational numbers within the real numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Long-division chalk stepper beside a remainder ring cycle (neonRing nodes on a circle); repeating digits get a neon dot/bar.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): divide > remainder > repeat detected (cycle closes, glow) > recurring notation.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the recurring bar over the repeating block.
- Correct in Challenge: recurring block identified. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip magnify, idea; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-18 Terminating or recurring sorter

```
Build NOVA Master Visual Engine component F5-18: "Terminating or recurring sorter" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y9-001 The real number system (objective: Classify integers, rational numbers and irrational numbers within the real numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Denominator prime-factor cards (neonCard) and two bins 'terminates' / 'recurs'.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): factorise denominator > only 2s and 5s glow green > card slides to bin.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag fraction cards into the correct bin.
- Correct in Challenge: all sorted correctly. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare, thumbs-up; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F5-19 Pizza and chocolate-bar contexts

```
Build NOVA Master Visual Engine component F5-19: "Pizza and chocolate-bar contexts" (Family F5: Fractions, Decimals and Percentages).
Family covers: equivalence, operations, conversion, percentage change, recurring decimals.
Used in these KS3 lessons:
- Y7-019 Fractions as numbers (objective: Interpret proper, improper and mixed fractions as numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Context pictures drawn in neon: a pizza (sector circle) and chocolate bar (glass grid), split by the core fraction engines.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): whole appears > cut into equal parts > portions taken > fraction tag.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag slices/squares to people or plates.
- Correct in Challenge: portions match the fraction. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-one, celebrate; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F6: Ratio, Proportion and Rates

## Family run prompt

```
Build NOVA Master Visual Engine Family F6: Ratio, Proportion and Rates as a gallery plus components.
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.

Components, in order (items marked preset are modes of another engine, not separate builds):
F6-01 Ratio table
F6-02 Double number line
F6-03 Sharing in a ratio
F6-04 Simplifying ratios
F6-05 Recipe scaler
F6-06 Best-buy comparer
F6-07 Map and scale drawing
F6-08 Direct proportion graph [preset of F10-05]
F6-09 Inverse proportion rectangle
F6-10 Speed-distance-time
F6-11 Rates-of-change tank
F6-12 Currency and unit bridges [preset of F18-02]
F6-13 Proportion in geometry [preset of F14-11]
F6-14 Ratio and fraction translator

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F6-01 Ratio table

```
Build NOVA Master Visual Engine component F6-01: "Ratio table" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-058 Ratio notation and simplifying ratios (objective: Represent multiplicative comparisons with ratio notation and simplify ratios without changing the relationship.)
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)
- Y7-061 Unit price and best buy (objective: Compare value using unit rates.)
- Y8-034 Ratio with fractions and decimals (objective: Use ratios involving fractional and decimal quantities.)
- Y8-035 Direct proportion with tables and equations (objective: Represent direct proportion using scale factors, tables and equations of the form y = kx.)
- Y8-036 Direct proportion graphs (objective: Recognise and use straight-line graphs through the origin for direct proportion.)
- Y8-037 Inverse proportion in tables and graphs (objective: Recognise and represent inverse proportional relationships in practical, numerical and graphical forms.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass ratio table (neonBox cells, roving tabindex) with x k / divide k arrow pills (NOVA.svg.arrow) on both sides of rows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): base row > scale arrow > new row fills > missing cell resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag multiplier pills onto row gaps; drag values into empty cells.
- Correct in Challenge: missing values correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking. Speech: 'do the same to both columns'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-02 Double number line

```
Build NOVA Master Visual Engine component F6-02: "Double number line" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)
- Y8-007 Percentage multipliers (objective: Use multipliers for increase and decrease.)
- Y8-035 Direct proportion with tables and equations (objective: Represent direct proportion using scale factors, tables and equations of the form y = kx.)
- Y8-039 Currency conversion (objective: Convert currencies using given exchange rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two aligned core NOVA.numberLine tracks (quantity A over B) with matching tick pairs joined by faint neonLines.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): pair 0-0 > known pair > scale along > unknown ring.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a neonRing pair marker along the lines (snaps to scaled points).
- Correct in Challenge: matching value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right. Speech: 'the lines stretch together'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-03 Sharing in a ratio

```
Build NOVA Master Visual Engine component F6-03: "Sharing in a ratio" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-059 Sharing in a ratio (objective: Divide a quantity in a given ratio.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Ratio bar boxes per share with total brace (as F4-07) plus counters dealt into shares.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): deal counters in ratio > boxes fill > one-box value > shares.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters/box values into shares.
- Correct in Challenge: each share correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right. Speech: 'how many boxes altogether?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-04 Simplifying ratios

```
Build NOVA Master Visual Engine component F6-04: "Simplifying ratios" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-058 Ratio notation and simplifying ratios (objective: Represent multiplicative comparisons with ratio notation and simplify ratios without changing the relationship.)
- Y8-034 Ratio with fractions and decimals (objective: Use ratios involving fractional and decimal quantities.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two groups of neonRing counters arranged in common-factor groups; ratio chips.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): group by factor > groups collapse > simplest ratio.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a lasso around common groups; drag ratio chip to simplest slot.
- Correct in Challenge: simplest ratio correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-05 Recipe scaler

```
Build NOVA Master Visual Engine component F6-05: "Recipe scaler" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Recipe neonCard with ingredient rows and neon icons; servings stepper; scale-factor pill.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): servings change > factor pill > each row scales with count-up.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the servings slider; drag scaled amounts onto rows.
- Correct in Challenge: scaled amounts correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-left. Speech: 'find the scale factor first'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-06 Best-buy comparer

```
Build NOVA Master Visual Engine component F6-06: "Best-buy comparer" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-061 Unit price and best buy (objective: Compare value using unit rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two product neonCards with price/quantity; unit-price bars side by side.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): compute unit price > bars grow > cheaper glows green.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the 'best buy' ring onto a card.
- Correct in Challenge: best buy correct with unit price. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-07 Map and scale drawing

```
Build NOVA Master Visual Engine component F6-07: "Map and scale drawing" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-064 Scale drawings and maps (objective: Use scale factors to interpret and construct scale drawings.)
- Y9-021 Scale factors and maps (objective: Use scale factors across drawings, maps and similar figures.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Neon map with scale bar (NOVA.numberLine) and ruler; real distance chip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): measure > scale > real distance.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag ruler ends between map points; drag scale bar copies.
- Correct in Challenge: distance correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler; Nova point-up.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-08 Direct proportion graph

```
Add a PRESET to NOVA Master Visual Engine component F10-05 "y = mx + c explorer": F6-08 "Direct proportion graph" (Family F6).
Reason it is a preset: proportion graph is y = mx with c = 0.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F10-05), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)
- Y8-035 Direct proportion with tables and equations (objective: Represent direct proportion using scale factors, tables and equations of the form y = kx.)
- Y8-036 Direct proportion graphs (objective: Recognise and use straight-line graphs through the origin for direct proportion.)
- Y9-020 Direct and inverse proportion graphs (objective: Recognise graphical signatures of proportional relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. core axes with straight line through origin (neonPlot), table link.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): plot points > line through (0,0) > read value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a point along the line; drag table values onto points.
- Correct in Challenge: k / reading correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-09 Inverse proportion rectangle

```
Build NOVA Master Visual Engine component F6-09: "Inverse proportion rectangle" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y8-037 Inverse proportion in tables and graphs (objective: Recognise and represent inverse proportional relationships in practical, numerical and graphical forms.)
- Y9-013 Reciprocal graphs in context (objective: Interpret reciprocal-shaped relationships from given graphs.)
- Y9-019 Inverse proportion algebraically (objective: Represent simple inverse proportion with constant-product relationships.)
- Y9-020 Direct and inverse proportion graphs (objective: Recognise graphical signatures of proportional relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass rectangle of fixed area with draggable corner; xy chip constant; trail of hyperbola points.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): stretch > squash > area stays > curve traced.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the corner (snaps), area held.
- Correct in Challenge: inverse values correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-10 Speed-distance-time

```
Build NOVA Master Visual Engine component F6-10: "Speed-distance-time" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y8-041 Speed (objective: Use speed as a compound unit and solve speed–distance–time problems.)
- Y9-016 Distance–time problem solving (objective: Analyse complex journeys using distance–time graphs.)
- Y9-022 Speed and rates (objective: Solve multi-step problems involving speed and other rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. S-D-T formula triangle neonPath + journey track with moving neonRing and time NOVA.numberLine.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): journey runs > distance and time readouts > formula covers unknown.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the unknown cover onto the triangle; drag the car along the track.
- Correct in Challenge: S/D/T value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip ruler; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-11 Rates-of-change tank

```
Build NOVA Master Visual Engine component F6-11: "Rates-of-change tank" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y8-028 Gradient as rate of change (objective: Use graph gradient to interpret rates in real contexts.)
- Y8-041 Speed (objective: Use speed as a compound unit and solve speed–distance–time problems.)
- Y8-042 Density (objective: Use density as mass per unit volume.)
- Y9-022 Speed and rates (objective: Solve multi-step problems involving speed and other rates.)
- Y9-023 Density (objective: Solve density, mass and volume problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass tank filling (neon water with glow) beside a live depth-time graph.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): flow on > depth rises > graph traces > rate chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the tap rate slider; drag graph shape cards to tanks.
- Correct in Challenge: rate/graph match correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-12 Currency and unit bridges

```
Add a PRESET to NOVA Master Visual Engine component F18-02 "Unit-conversion bridges": F6-12 "Currency and unit bridges" (Family F6).
Reason it is a preset: same conversion bridge.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F18-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-039 Currency conversion (objective: Convert currencies using given exchange rates.)
- Y8-043 Compound-unit conversion (objective: Convert and compare rates expressed with compound units.)
- Y9-024 Mixed compound units (objective: Solve unfamiliar problems involving compound rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Bridge of linked unit pills (neonCard) with conversion factors on arcs (NOVA.svg.arc).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): start unit > cross each bridge (x factor) > end value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag factor pills onto bridges.
- Correct in Challenge: converted value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-13 Proportion in geometry

```
Add a PRESET to NOVA Master Visual Engine component F14-11 "Similar shapes": F6-13 "Proportion in geometry" (Family F6).
Reason it is a preset: scale factors on similar shapes.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F14-11), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-064 Scale drawings and maps (objective: Use scale factors to interpret and construct scale drawings.)
- Y8-057 Similarity (objective: Use scale factors with similar shapes.)
- Y9-021 Scale factors and maps (objective: Use scale factors across drawings, maps and similar figures.)
- Y9-023 Density (objective: Solve density, mass and volume problems.)
- Y9-029 Similarity reasoning (objective: Use similarity to calculate missing lengths and justify relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two similar shapes (neonPath) with corresponding sides colour-matched and scale-factor pill.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): overlay > scale > matching sides glow > missing side.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a side length card onto the matching side.
- Correct in Challenge: missing length correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F6-14 Ratio and fraction translator

```
Build NOVA Master Visual Engine component F6-14: "Ratio and fraction translator" (Family F6: Ratio, Proportion and Rates).
Family covers: ratio, direct and inverse proportion, scaling, rates, speed.
Used in these KS3 lessons:
- Y7-059 Sharing in a ratio (objective: Divide a quantity in a given ratio.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Ratio bar linked to fraction-of-whole bar with TBD fraction placeholders.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): ratio boxes > total > each part as a fraction of whole.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag fraction tags to ratio parts.
- Correct in Challenge: translation correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F7: Algebra Tiles and Balance

## Family run prompt

```
Build NOVA Master Visual Engine Family F7: Algebra Tiles and Balance as a gallery plus components.
Family covers: forming, simplifying, expanding, factorising, solving equations.

Components, in order (items marked preset are modes of another engine, not separate builds):
F7-01 Algebra tiles
F7-02 Zero-pair animation
F7-03 Collecting like terms
F7-04 Expanding single brackets [preset of F3-02]
F7-05 Expanding double brackets [preset of F3-02]
F7-06 Factorising with tiles
F7-07 Completing the square
F7-08 Balance scales
F7-09 Balance with negatives and unknowns [preset of F7-08]
F7-10 Cups-and-counters solver [preset of F7-08]
F7-11 Bar-model equation [preset of F4-08]
F7-12 Substitution machine [preset of F8-03]
F7-13 Difference of two squares
F7-14 Identity visualiser

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F7-01 Algebra tiles

```
Build NOVA Master Visual Engine component F7-01: "Algebra tiles" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y7-029 Collecting like terms (objective: Simplify expressions by combining like terms only.)
- Y7-031 Expanding a single bracket (objective: Use the distributive law to expand a single bracket.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass algebra tiles (x^2 square, x rod, unit square; positive and negative colours with pattern second cue) on a mat.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): tiles enter > arrange > expression readout.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag tiles from tray to mat; flip sign by drop on flip zone; tray removes.
- Correct in Challenge: mat matches expression. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right. Speech: 'each tile has a name and a size'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-02 Zero-pair animation

```
Build NOVA Master Visual Engine component F7-02: "Zero-pair animation" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y7-011 Adding and subtracting negative numbers (objective: Model signed changes and calculate with negative numbers.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Positive/negative unit tiles pairing on the mat with a zero-pair glow.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): pair up > glow > vanish (pop) > remainder.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a tile onto its opposite to cancel.
- Correct in Challenge: simplified result correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip show-two, celebrate; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-03 Collecting like terms

```
Build NOVA Master Visual Engine component F7-03: "Collecting like terms" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y7-029 Collecting like terms (objective: Simplify expressions by combining like terms only.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Mat with tile groups sorted into like-term zones.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): scatter > sort into zones > count each zone > simplified expression.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag tiles into like-term zones.
- Correct in Challenge: collected expression correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-down.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-04 Expanding single brackets

```
Add a PRESET to NOVA Master Visual Engine component F3-02 "Area model of multiplication": F7-04 "Expanding single brackets" (Family F7).
Reason it is a preset: single bracket is a one-term area model.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F3-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-031 Expanding a single bracket (objective: Use the distributive law to expand a single bracket.)
- Y7-032 Factorising a common factor (objective: Reverse expansion by taking out a common factor.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Area frame: multiplier on left edge, bracket terms on top, tiles fill the rectangle.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): frame > fill each region > read expanded form.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag tiles into the frame regions.
- Correct in Challenge: expansion correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-05 Expanding double brackets

```
Add a PRESET to NOVA Master Visual Engine component F3-02 "Area model of multiplication": F7-05 "Expanding double brackets" (Family F7).
Reason it is a preset: double bracket is the area model.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F3-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-011 Expanding and simplifying double brackets (objective: Expand products of two binomials and simplify the resulting expression.)
- Y9-006 Algebraic equivalence (objective: Recognise and prove simple algebraic equivalence.)
- Y9-008 Quadratic pattern structure (objective: Recognise simple quadratic patterns through second differences and visual growth.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Area frame with two-term edges (x + a)(x + b) and 4 regions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): edges > 4 regions fill (staggered) > collect like terms.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag tiles into regions; negatives use the patterned tiles.
- Correct in Challenge: expanded quadratic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-06 Factorising with tiles

```
Build NOVA Master Visual Engine component F7-06: "Factorising with tiles" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y7-032 Factorising a common factor (objective: Reverse expansion by taking out a common factor.)
- Y8-012 Factorising common factors (objective: Factorise expressions by taking out a common factor.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Given tiles to assemble into a rectangle; edge braces read the factors.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): tiles scattered > form rectangle > edges read off.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag tiles into a rectangle frame (snaps); edge chips filled.
- Correct in Challenge: factorised form correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip think, idea; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-07 Completing the square

```
Build NOVA Master Visual Engine component F7-07: "Completing the square" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. x^2 and x rods arranged into an incomplete square with the missing corner glowing gold.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): split rods in half > arrange round square > missing corner > completed form.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag half-rods onto square sides; drag corner units.
- Correct in Challenge: completed-square form correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-08 Balance scales

```
Build NOVA Master Visual Engine component F7-08: "Balance scales" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y7-033 Solving one-step and two-step equations (objective: Solve one-step and two-step linear equations by maintaining equality and using inverse operations.)
- Y7-035 Forming and solving equations from contexts (objective: Translate contextual relationships into linear equations and solve them.)
- Y8-013 Equations with brackets (objective: Solve linear equations that require expanding brackets first.)
- Y8-014 Unknowns on both sides (objective: Solve linear equations with the unknown on both sides.)

This engine must also provide these presets or modes (do not build them separately): F7-09 Balance with negatives and unknowns; F7-10 Cups-and-counters solver.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Neon balance scale (neonPath beam tilting with NOVA.motion) with x-bags and unit weights in pans.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): load pans > beam balances > do same to both sides > x isolated.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag weights/bags on and off pans; one-sided removal tilts and is undone.
- Correct in Challenge: x correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip compare, celebrate; Nova explain-right. Speech: 'keep it balanced'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-09 Balance with negatives and unknowns

```
Add a PRESET to NOVA Master Visual Engine component F7-08 "Balance scales": F7-09 "Balance with negatives and unknowns" (Family F7).
Reason it is a preset: negative and unknown weights are a mode.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F7-08), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-013 Equations with brackets (objective: Solve linear equations that require expanding brackets first.)
- Y8-014 Unknowns on both sides (objective: Solve linear equations with the unknown on both sides.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Balance with negative balloons (lift) and positive weights; zero pairs cancel.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): load > add balloons > cancel pairs > solve.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag balloons/weights onto pans.
- Correct in Challenge: x correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-10 Cups-and-counters solver

```
Add a PRESET to NOVA Master Visual Engine component F7-08 "Balance scales": F7-10 "Cups-and-counters solver" (Family F7).
Reason it is a preset: cups and counters is a skin.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F7-08), and its entry in the family gallery.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Cups (x) and counters on both sides of a neon divider line.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): set up > remove matching counters > share counters among cups.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag counters into cups/off sides.
- Correct in Challenge: x correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-11 Bar-model equation

```
Add a PRESET to NOVA Master Visual Engine component F4-08 "Algebra bar": F7-11 "Bar-model equation" (Family F7).
Reason it is a preset: same bar-to-equation idea.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F4-08), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-034 Forming expressions from contexts (objective: Translate verbal and geometric relationships into algebraic expressions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Equation as a bar model: x-boxes + units = total bar.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): bar > subtract knowns > divide > x.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag knowns to tray; drag x value.
- Correct in Challenge: x correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-down.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-12 Substitution machine

```
Add a PRESET to NOVA Master Visual Engine component F8-03 "Function machine": F7-12 "Substitution machine" (Family F7).
Reason it is a preset: substitution is a function machine.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F8-03), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-030 Substitution into expressions and formulae (objective: Substitute numerical values into expressions and formulae accurately.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Function-machine style substitution: expression card, x-value card dropped in, terms light and evaluate in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): drop value > each term evaluates > sum.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag value cards into the variable slots.
- Correct in Challenge: value correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-13 Difference of two squares

```
Build NOVA Master Visual Engine component F7-13: "Difference of two squares" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y9-006 Algebraic equivalence (objective: Recognise and prove simple algebraic equivalence.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. x^2 square with b^2 corner cut and moved to make a rectangle (x+b)(x-b).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): cut corner > slide strip > rotate > rectangle.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the cut strip to its new place.
- Correct in Challenge: factorisation correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova idea.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F7-14 Identity visualiser

```
Build NOVA Master Visual Engine component F7-14: "Identity visualiser" (Family F7: Algebra Tiles and Balance).
Family covers: forming, simplifying, expanding, factorising, solving equations.
Used in these KS3 lessons:
- Y9-006 Algebraic equivalence (objective: Recognise and prove simple algebraic equivalence.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two expressions as tile mats side by side; equal mats glow.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): build both > compare tile by tile > identity flashes.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag tiles to either mat.
- Correct in Challenge: identity/not identified. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F8: Algebraic Working and Function Engine

## Family run prompt

```
Build NOVA Master Visual Engine Family F8: Algebraic Working and Function Engine as a gallery plus components.
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.

Components, in order (items marked preset are modes of another engine, not separate builds):
F8-01 Step-by-step working animator
F8-02 Inverse-operations flowchart [preset of F8-03]
F8-03 Function machine
F8-04 Two-way function machine [preset of F8-03]
F8-05 Both-sides equation solver
F8-06 Rearranging formulae
F8-07 Expression builder
F8-08 Equivalence checker
F8-09 Substitution table
F8-10 Simultaneous equations
F8-11 Inequality solver
F8-12 Quadratic solve routes
F8-13 Index laws in algebra [preset of F3-10]
F8-14 Algebraic fraction simplifier
F8-15 Misconception spotter
F8-16 Modelling cycle stepper
F8-17 Algebraic proof builder
F8-18 Iteration and trial-and-improvement

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F8-01 Step-by-step working animator

```
Build NOVA Master Visual Engine component F8-01: "Step-by-step working animator" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-018 Priority of operations (objective: Apply brackets, powers, roots, reciprocals and operation priority correctly.)
- Y8-011 Expanding and simplifying double brackets (objective: Expand products of two binomials and simplify the resulting expression.)
- Y8-012 Factorising common factors (objective: Factorise expressions by taking out a common factor.)
- Y8-015 Equations with fractions (objective: Solve linear equations containing simple fractional coefficients.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Chalk working column, each line a neonCard with the operation pill on the right; changes highlighted.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): line 1 > operation applies (glow on changed terms) > next line.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag operation pills between lines.
- Correct in Challenge: each step valid. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-02 Inverse-operations flowchart

```
Add a PRESET to NOVA Master Visual Engine component F8-03 "Function machine": F8-02 "Inverse-operations flowchart" (Family F8).
Reason it is a preset: inverse flowchart is the machine reversed.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F8-03), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-033 Solving one-step and two-step equations (objective: Solve one-step and two-step linear equations by maintaining equality and using inverse operations.)
- Y8-016 Rearranging formulae (objective: Change the subject of formulae using one or more inverse steps.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Forward flowchart of neon boxes with arrows (NOVA.svg.arrow); inverse chain beneath runs backwards.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): forward > output > reverse arrows > input.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag inverse operation cards onto reversed boxes.
- Correct in Challenge: input found. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-03 Function machine

```
Build NOVA Master Visual Engine component F8-03: "Function machine" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-028 Algebraic notation and mathematical language (objective: Read and write algebraic notation and distinguish expressions, equations, identities and formulae.)
- Y7-030 Substitution into expressions and formulae (objective: Substitute numerical values into expressions and formulae accurately.)
- Y7-033 Solving one-step and two-step equations (objective: Solve one-step and two-step linear equations by maintaining equality and using inverse operations.)
- Y8-016 Rearranging formulae (objective: Change the subject of formulae using one or more inverse steps.)

This engine must also provide these presets or modes (do not build them separately): F7-12 Substitution machine; F8-04 Two-way function machine; F8-02 Inverse-operations flowchart.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Neon function machine (hopper, operation gears, output chute) with input/output table.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): input card drops > gears turn > output appears > table row.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag input cards into hopper; drag rule cards onto the machine.
- Correct in Challenge: rule/output correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip point-right; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-04 Two-way function machine

```
Add a PRESET to NOVA Master Visual Engine component F8-03 "Function machine": F8-04 "Two-way function machine" (Family F8).
Reason it is a preset: two-way mode of the machine.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F8-03), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-016 Rearranging formulae (objective: Change the subject of formulae using one or more inverse steps.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two machines chained or forward/inverse pair with mapping arrows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): input > machine 1 > machine 2 > output; reverse.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag operation cards onto machines.
- Correct in Challenge: composite/inverse correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-05 Both-sides equation solver

```
Build NOVA Master Visual Engine component F8-05: "Both-sides equation solver" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-033 Solving one-step and two-step equations (objective: Solve one-step and two-step linear equations by maintaining equality and using inverse operations.)
- Y7-035 Forming and solving equations from contexts (objective: Translate contextual relationships into linear equations and solve them.)
- Y8-013 Equations with brackets (objective: Solve linear equations that require expanding brackets first.)
- Y8-014 Unknowns on both sides (objective: Solve linear equations with the unknown on both sides.)
- Y8-015 Equations with fractions (objective: Solve linear equations containing simple fractional coefficients.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Balance-backed equation with unknowns both sides; step lines in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): remove smaller x term both sides > constants > divide.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag terms across to apply operations to both sides.
- Correct in Challenge: solution correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-06 Rearranging formulae

```
Build NOVA Master Visual Engine component F8-06: "Rearranging formulae" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y8-016 Rearranging formulae (objective: Change the subject of formulae using one or more inverse steps.)
- Y9-019 Inverse proportion algebraically (objective: Represent simple inverse proportion with constant-product relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Formula as linked term cards; subject ring highlights target variable.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): choose subject > undo outermost operation > repeat > rearranged.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag operation cards to both sides.
- Correct in Challenge: rearranged formula correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-07 Expression builder

```
Build NOVA Master Visual Engine component F8-07: "Expression builder" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-028 Algebraic notation and mathematical language (objective: Read and write algebraic notation and distinguish expressions, equations, identities and formulae.)
- Y7-034 Forming expressions from contexts (objective: Translate verbal and geometric relationships into algebraic expressions.)
- Y9-007 Modelling with expressions and formulae (objective: Translate complex contexts into algebraic expressions or formulae.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Term cards (coefficients, variables, operators) building into an expression on a neon rail.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): cards snap > expression reads > meaning chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cards onto rail slots.
- Correct in Challenge: expression matches description. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-down.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-08 Equivalence checker

```
Build NOVA Master Visual Engine component F8-08: "Equivalence checker" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-029 Collecting like terms (objective: Simplify expressions by combining like terms only.)
- Y9-006 Algebraic equivalence (objective: Recognise and prove simple algebraic equivalence.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two expressions with a substitution test table; equal rows glow.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): substitute values > compare outputs > verdict.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag value cards into the test.
- Correct in Challenge: equivalence verdict correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-09 Substitution table

```
Build NOVA Master Visual Engine component F8-09: "Substitution table" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-028 Algebraic notation and mathematical language (objective: Read and write algebraic notation and distinguish expressions, equations, identities and formulae.)
- Y7-030 Substitution into expressions and formulae (objective: Substitute numerical values into expressions and formulae accurately.)
- Y7-039 Tables of values and straight-line graphs (objective: Generate coordinate pairs from simple rules and use them to plot straight-line graphs.)
- Y8-030 Quadratic tables and graphs (objective: Generate values for simple quadratic functions and plot smooth quadratic graphs.)
- Y9-007 Modelling with expressions and formulae (objective: Translate complex contexts into algebraic expressions or formulae.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Glass table with x row and expression row; values fill per column.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): choose x > evaluate > fill cell.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag values into cells.
- Correct in Challenge: table correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-10 Simultaneous equations

```
Build NOVA Master Visual Engine component F8-10: "Simultaneous equations" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y8-029 Simultaneous equations graphically (objective: Find and interpret approximate solutions to pairs of linear relationships from their graph intersection.)
- Y9-009 Coordinates and algebra (objective: Connect coordinate patterns with algebraic relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two lines on core axes (neonPlot) with intersection ring, and elimination stepper.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): plot both > intersection > elimination steps.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a ring to the intersection; drag multiplier pills to equations.
- Correct in Challenge: (x,y) correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-11 Inequality solver

```
Build NOVA Master Visual Engine component F8-11: "Inequality solver" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y8-017 Linear inequalities and number-line solutions (objective: Solve simple linear inequalities and represent their solution sets on number lines.)
- Y8-018 Multi-step and compound inequalities (objective: Solve and interpret multi-step linear inequalities.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Core NOVA.numberLine with open/closed neonRing and shaded ray; solving steps above.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solve steps > boundary ring > ray shades.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the ring and ray direction.
- Correct in Challenge: solution set correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-12 Quadratic solve routes

```
Build NOVA Master Visual Engine component F8-12: "Quadratic solve routes" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y8-031 Features of quadratic graphs (objective: Identify and interpret roots, intercepts, turning points and symmetry on simple quadratic graphs.)
- Y9-011 Features of quadratic graphs (objective: Use quadratic graphs to estimate roots and intercepts and identify turning points and symmetry.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Three routes side by side: factorise tiles, formula, graph roots.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): choose route > steps animate > roots ring on axis.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag root rings onto x-axis.
- Correct in Challenge: roots correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-13 Index laws in algebra

```
Add a PRESET to NOVA Master Visual Engine component F3-10 "Index law animator": F8-13 "Index laws in algebra" (Family F8).
Reason it is a preset: algebraic bases in the index animator.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F3-10), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-002 Laws of indices (objective: Use multiplication and division laws for powers with the same base.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Algebraic factor strips (as F3-10 with letters).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): expand > combine > index form.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag strips to join/cancel.
- Correct in Challenge: index correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-14 Algebraic fraction simplifier

```
Build NOVA Master Visual Engine component F8-14: "Algebraic fraction simplifier" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Fraction (approved NOVA Chalk stacked notation) numerator/denominator factor cards; common factors cancel with glow.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): factorise > common factors highlight > cancel > simplified.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag common factor pairs to cancel.
- Correct in Challenge: simplified correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-15 Misconception spotter

```
Build NOVA Master Visual Engine component F8-15: "Misconception spotter" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
Used in these KS3 lessons:
- Y7-012 Multiplying and dividing negative numbers (objective: Calculate products and quotients involving negative numbers and explain sign patterns.)
- Y7-018 Priority of operations (objective: Apply brackets, powers, roots, reciprocals and operation priority correctly.)
- Y8-018 Multi-step and compound inequalities (objective: Solve and interpret multi-step linear inequalities.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Worked solution cards with one wrong step; magnifier lens.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): read steps > lens scans > error glows amber > corrected.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the lens/ring onto the wrong line; drag the fix card.
- Correct in Challenge: error found and fixed. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip magnify, oops; Izaac idea.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-16 Modelling cycle stepper

```
Build NOVA Master Visual Engine component F8-16: "Modelling cycle stepper" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
(New component added by the audit.)
Used in these KS3 lessons:
- Y9-007 Modelling with expressions and formulae (objective: Translate complex contexts into algebraic expressions or formulae.)
- Y9-018 Graphical solutions and modelling (objective: Use graphs to find approximate solutions and evaluate models.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Cycle of four neonCards (understand, model, solve, check) on a neon ring path.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): each stage lights in turn with its working.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cards into cycle order.
- Correct in Challenge: order and model correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-17 Algebraic proof builder

```
Build NOVA Master Visual Engine component F8-17: "Algebraic proof builder" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
(New component added by the audit, GCSE extension.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Proof chain of statement cards linked by justification arrows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): premise > each link > conclusion glows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag statements/justifications into chain slots.
- Correct in Challenge: valid proof order. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F8-18 Iteration and trial-and-improvement

```
Build NOVA Master Visual Engine component F8-18: "Iteration and trial-and-improvement" (Family F8: Algebraic Working and Function Engine).
Family covers: substitution, rearranging, solving, inequalities, formulae, functions.
(New component added by the audit, GCSE extension.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Trial table plus core number line narrowing interval with brackets.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): guess > evaluate > too high/low > interval shrinks.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag guess ring on the line.
- Correct in Challenge: answer to required accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F9: Sequences and Patterns

## Family run prompt

```
Build NOVA Master Visual Engine Family F9: Sequences and Patterns as a gallery plus components.
Family covers: term-to-term, nth term, special sequences, generalising patterns.

Components, in order (items marked preset are modes of another engine, not separate builds):
F9-01 Matchstick pattern builder
F9-02 Term-to-term animator
F9-03 Position-to-term table
F9-04 Sequence on a graph
F9-05 Linear nth term derivation
F9-06 Geometric sequence
F9-07 Special sequences
F9-08 Triangular numbers dot arrays
F9-09 Quadratic sequence
F9-10 Pascal's triangle
F9-11 Spot-the-rule puzzle
F9-12 Sequence continuer
F9-13 Fractal generators

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F9-01 Matchstick pattern builder

```
Build NOVA Master Visual Engine component F9-01: "Matchstick pattern builder" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-036 Sequence rules and structure (objective: Generate and recognise common sequence structures using precise term-to-term rules.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Matchstick patterns drawn as neonLine sticks, stage 1..n side by side; term table under.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): stage builds stick by stick > added sticks glow > count > table row.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag sticks from tray to build next stage (snap to grid).
- Correct in Challenge: next stage / count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count. Speech: 'what gets added each time?'.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-02 Term-to-term animator

```
Build NOVA Master Visual Engine component F9-02: "Term-to-term animator" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-036 Sequence rules and structure (objective: Generate and recognise common sequence structures using precise term-to-term rules.)
- Y8-019 Arithmetic sequences (objective: Generate arithmetic sequences and connect difference to algebraic rules.)
- Y8-020 Geometric sequences (objective: Recognise and generate geometric sequences.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Terms as neonRing nodes on a row with hop arcs (NOVA.svg.hop) labelled +d or x r.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): term > hop > next term > rule pill.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag rule pill onto hops; drag next-term card.
- Correct in Challenge: rule/next term correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-03 Position-to-term table

```
Build NOVA Master Visual Engine component F9-03: "Position-to-term table" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-037 Nth term of a linear sequence (objective: Find and use the nth term of a linear sequence.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Two-row glass table position n / term with mapping arrows down and rule pill.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): position > rule > term.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag term cards into cells; drag rule card.
- Correct in Challenge: nth term values correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-04 Sequence on a graph

```
Build NOVA Master Visual Engine component F9-04: "Sequence on a graph" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-037 Nth term of a linear sequence (objective: Find and use the nth term of a linear sequence.)
- Y8-019 Arithmetic sequences (objective: Generate arithmetic sequences and connect difference to algebraic rules.)
- Y8-021 Quadratic pattern spotting (objective: Recognise patterns with constant second differences.)
- Y9-008 Quadratic pattern structure (objective: Recognise simple quadratic patterns through second differences and visual growth.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Core axes with sequence points (neonMark) and trend line.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): plot terms > line/curve appears > gradient = difference.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points into place.
- Correct in Challenge: plot correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-05 Linear nth term derivation

```
Build NOVA Master Visual Engine component F9-05: "Linear nth term derivation" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-037 Nth term of a linear sequence (objective: Find and use the nth term of a linear sequence.)
- Y8-019 Arithmetic sequences (objective: Generate arithmetic sequences and connect difference to algebraic rules.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Table with difference row; difference d becomes dn, zero term found by stepping back.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): differences > dn row > compare > + c > nth term.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the d and c cards into dn + c.
- Correct in Challenge: nth term correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova idea.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-06 Geometric sequence

```
Build NOVA Master Visual Engine component F9-06: "Geometric sequence" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y8-020 Geometric sequences (objective: Recognise and generate geometric sequences.)
- Y9-014 Exponential graphs in context (objective: Interpret rapidly increasing/decreasing relationships from given graphs.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Terms as growing glass squares/bars with x r arcs.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): term > multiply arc > next term grows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag ratio card onto arcs.
- Correct in Challenge: ratio/term correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova explain-left.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-07 Special sequences

```
Build NOVA Master Visual Engine component F9-07: "Special sequences" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-036 Sequence rules and structure (objective: Generate and recognise common sequence structures using precise term-to-term rules.)
- Y8-020 Geometric sequences (objective: Recognise and generate geometric sequences.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Dot/square patterns for square, cube, triangular, Fibonacci (neonRing dots).
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): pattern grows > numbers below.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag sequence cards to pattern.
- Correct in Challenge: matched correctly. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova compare.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-08 Triangular numbers dot arrays

```
Build NOVA Master Visual Engine component F9-08: "Triangular numbers dot arrays" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Triangle dot arrays (neonRing) and doubled-into-rectangle view.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): rows add > copy flips > rectangle n(n+1).
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag rows of dots to build next.
- Correct in Challenge: triangular number correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova show-two.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-09 Quadratic sequence

```
Build NOVA Master Visual Engine component F9-09: "Quadratic sequence" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y8-021 Quadratic pattern spotting (objective: Recognise patterns with constant second differences.)
- Y9-008 Quadratic pattern structure (objective: Recognise simple quadratic patterns through second differences and visual growth.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Table with first and second difference rows; dot pattern beside.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): first diff > second diff constant > an^2 > remainder linear.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag a, b, c cards.
- Correct in Challenge: nth term correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-10 Pascal's triangle

```
Build NOVA Master Visual Engine component F9-10: "Pascal's triangle" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Pascal's triangle of glass hex cells; sums flow down with neonPath arrows.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): row builds > pairs add > patterns highlight.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag sum cards into cells.
- Correct in Challenge: entries correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-11 Spot-the-rule puzzle

```
Build NOVA Master Visual Engine component F9-11: "Spot-the-rule puzzle" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-036 Sequence rules and structure (objective: Generate and recognise common sequence structures using precise term-to-term rules.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Mystery sequence cards with hidden rule; rule cards to test.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): reveal terms > test rule > match glows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag rule cards onto sequence.
- Correct in Challenge: rule correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip question, idea; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-12 Sequence continuer

```
Build NOVA Master Visual Engine component F9-12: "Sequence continuer" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.
Used in these KS3 lessons:
- Y7-036 Sequence rules and structure (objective: Generate and recognise common sequence structures using precise term-to-term rules.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Sequence row with empty slots and hop arcs.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): show terms > slots pulse > fill.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag next-term cards into slots.
- Correct in Challenge: terms correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F9-13 Fractal generators

```
Build NOVA Master Visual Engine component F9-13: "Fractal generators" (Family F9: Sequences and Patterns).
Family covers: term-to-term, nth term, special sequences, generalising patterns.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Fractal (Sierpinski, Koch) drawn with neonPath, iteration stepper; count table.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): iteration 0 > 1 > 2 > count grows.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the iteration slider.
- Correct in Challenge: count/length at stage n correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F10: Coordinates and Graphs

## Family run prompt

```
Build NOVA Master Visual Engine Family F10: Coordinates and Graphs as a gallery plus components.
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.

Components, in order (items marked preset are modes of another engine, not separate builds):
F10-01 Four-quadrant grid
F10-02 Shape on grid
F10-03 Midpoint and distance
F10-04 Table-to-graph plotter
F10-05 y = mx + c explorer
F10-06 Gradient visual
F10-07 Parallel and perpendicular lines
F10-08 Graph intersections
F10-09 Real-life graph interpreter
F10-10 Distance-time graph
F10-11 Speed-time graph
F10-12 Quadratic grapher
F10-13 Cubic, reciprocal and exponential
F10-14 Graph transformer
F10-15 Inequality region shader
F10-16 Circle on a grid
F10-17 Graph-matching sorter
F10-18 Piecewise and non-standard graph builder
F10-19 Trig graph explorer (sin, cos, tan)
F10-20 Tangent and area-under-curve estimator

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F10-01 Four-quadrant grid

```
Build NOVA Master Visual Engine component F10-01: "Four-quadrant grid" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y7-038 Coordinates and shapes (objective: Read, plot and reason with coordinates in all four quadrants.)
- Y8-024 Plotting straight-line graphs (objective: Plot lines accurately from equations.)
- Y8-066 Scatter graphs and lines of best fit (objective: Plot and interpret bivariate data and use a sensible line of best fit.)
- Y9-009 Coordinates and algebra (objective: Connect coordinate patterns with algebraic relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: four-quadrant core axes with labelled quadrants, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-02 Shape on grid

```
Build NOVA Master Visual Engine component F10-02: "Shape on grid" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y7-038 Coordinates and shapes (objective: Read, plot and reason with coordinates in all four quadrants.)
- Y7-052 Reflection and translation (objective: Describe and perform reflections and translations on coordinate grids.)
- Y7-053 Rotation (objective: Describe and perform rotations about a given centre.)
- Y7-054 Enlargement (objective: Construct and describe enlargements using a positive scale factor.)
- Y8-053 Reflection and translation (objective: Describe transformations precisely.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: polygon vertices on core axes, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-03 Midpoint and distance

```
Build NOVA Master Visual Engine component F10-03: "Midpoint and distance" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-045 Finding unknown sides with Pythagoras (objective: Use Pythagoras’ theorem to find either the hypotenuse or a shorter side in a right triangle.)
- Y8-046 Pythagoras problem solving (objective: Apply Pythagoras in geometric and contextual problems.)
- Y9-010 Straight-line equations and problem solving (objective: Use y = mx + c to represent, analyse and solve problems involving straight lines.)
- Y9-040 Coordinate geometry (objective: Use coordinates to reason about shape and transformation properties.)

This engine must also provide these presets or modes (do not build them separately): F15-03 Pythagoras on a grid.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: two points, midpoint ring and right-triangle distance, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-04 Table-to-graph plotter

```
Build NOVA Master Visual Engine component F10-04: "Table-to-graph plotter" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y7-039 Tables of values and straight-line graphs (objective: Generate coordinate pairs from simple rules and use them to plot straight-line graphs.)
- Y7-072 Line graphs and trends (objective: Construct and interpret line graphs for changing quantities.)
- Y8-022 Straight-line gradient (objective: Interpret gradient as vertical change per horizontal change.)
- Y8-024 Plotting straight-line graphs (objective: Plot lines accurately from equations.)
- Y8-030 Quadratic tables and graphs (objective: Generate values for simple quadratic functions and plot smooth quadratic graphs.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: table beside core axes, points then line, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-05 y = mx + c explorer

```
Build NOVA Master Visual Engine component F10-05: "y = mx + c explorer" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y7-039 Tables of values and straight-line graphs (objective: Generate coordinate pairs from simple rules and use them to plot straight-line graphs.)
- Y7-060 Direct proportion (objective: Recognise and solve direct proportion problems.)
- Y8-022 Straight-line gradient (objective: Interpret gradient as vertical change per horizontal change.)
- Y8-023 Y-intercept and y = mx + c (objective: Interpret the y-intercept and use y=mx+c.)
- Y8-024 Plotting straight-line graphs (objective: Plot lines accurately from equations.)
- Y8-025 Parallel lines and gradient (objective: Use gradient to recognise and construct parallel lines.)
- Y8-029 Simultaneous equations graphically (objective: Find and interpret approximate solutions to pairs of linear relationships from their graph intersection.)
- Y8-032 Comparing linear and quadratic relationships (objective: Compare how linear and quadratic graphs change.)
- plus 8 more lessons

This engine must also provide these presets or modes (do not build them separately): F6-08 Direct proportion graph.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: line y=mx+c with m and c sliders, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-06 Gradient visual

```
Build NOVA Master Visual Engine component F10-06: "Gradient visual" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-022 Straight-line gradient (objective: Interpret gradient as vertical change per horizontal change.)
- Y8-023 Y-intercept and y = mx + c (objective: Interpret the y-intercept and use y=mx+c.)
- Y8-025 Parallel lines and gradient (objective: Use gradient to recognise and construct parallel lines.)
- Y8-026 Distance–time graphs (objective: Interpret distance–time graphs in context.)
- Y8-027 Velocity–time graphs (objective: Interpret simple velocity–time graphs.)
- Y8-028 Gradient as rate of change (objective: Use graph gradient to interpret rates in real contexts.)
- Y9-017 Velocity–time interpretation (objective: Interpret changing velocity and direction from graphs.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: rise/run step triangle on a line, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-07 Parallel and perpendicular lines

```
Build NOVA Master Visual Engine component F10-07: "Parallel and perpendicular lines" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-025 Parallel lines and gradient (objective: Use gradient to recognise and construct parallel lines.)
- Y9-010 Straight-line equations and problem solving (objective: Use y = mx + c to represent, analyse and solve problems involving straight lines.)
- Y9-040 Coordinate geometry (objective: Use coordinates to reason about shape and transformation properties.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: two lines with parallel/perpendicular gradient chips and right-angle mark, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-08 Graph intersections

```
Build NOVA Master Visual Engine component F10-08: "Graph intersections" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-029 Simultaneous equations graphically (objective: Find and interpret approximate solutions to pairs of linear relationships from their graph intersection.)
- Y8-031 Features of quadratic graphs (objective: Identify and interpret roots, intercepts, turning points and symmetry on simple quadratic graphs.)
- Y8-033 Graphical problem solving (objective: Use graphs to estimate solutions and interpret relationships.)
- Y9-018 Graphical solutions and modelling (objective: Use graphs to find approximate solutions and evaluate models.)
- Y9-051 Lines of best fit and prediction (objective: Use lines of best fit for interpolation and cautious extrapolation.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: two graphs with intersection rings, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-09 Real-life graph interpreter

```
Build NOVA Master Visual Engine component F10-09: "Real-life graph interpreter" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y7-072 Line graphs and trends (objective: Construct and interpret line graphs for changing quantities.)
- Y8-026 Distance–time graphs (objective: Interpret distance–time graphs in context.)
- Y8-027 Velocity–time graphs (objective: Interpret simple velocity–time graphs.)
- Y8-028 Gradient as rate of change (objective: Use graph gradient to interpret rates in real contexts.)
- Y8-033 Graphical problem solving (objective: Use graphs to estimate solutions and interpret relationships.)
- Y9-013 Reciprocal graphs in context (objective: Interpret reciprocal-shaped relationships from given graphs.)
- Y9-014 Exponential graphs in context (objective: Interpret rapidly increasing/decreasing relationships from given graphs.)
- Y9-015 Piecewise and non-standard graphs (objective: Interpret graphs made of different behaviours across intervals.)
- plus 4 more lessons

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: real-life graph with read-off guides, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-10 Distance-time graph

```
Build NOVA Master Visual Engine component F10-10: "Distance-time graph" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-026 Distance–time graphs (objective: Interpret distance–time graphs in context.)
- Y9-016 Distance–time problem solving (objective: Analyse complex journeys using distance–time graphs.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: distance-time graph with moving traveller, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-11 Speed-time graph

```
Build NOVA Master Visual Engine component F10-11: "Speed-time graph" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-027 Velocity–time graphs (objective: Interpret simple velocity–time graphs.)
- Y9-017 Velocity–time interpretation (objective: Interpret changing velocity and direction from graphs.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: speed-time graph with shaded area, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-12 Quadratic grapher

```
Build NOVA Master Visual Engine component F10-12: "Quadratic grapher" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-021 Quadratic pattern spotting (objective: Recognise patterns with constant second differences.)
- Y8-030 Quadratic tables and graphs (objective: Generate values for simple quadratic functions and plot smooth quadratic graphs.)
- Y8-031 Features of quadratic graphs (objective: Identify and interpret roots, intercepts, turning points and symmetry on simple quadratic graphs.)
- Y8-032 Comparing linear and quadratic relationships (objective: Compare how linear and quadratic graphs change.)
- Y9-011 Features of quadratic graphs (objective: Use quadratic graphs to estimate roots and intercepts and identify turning points and symmetry.)
- Y9-012 Linear versus quadratic models (objective: Decide whether a context is better represented linearly or quadratically.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: quadratic curve with roots, vertex and axis of symmetry, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-13 Cubic, reciprocal and exponential

```
Build NOVA Master Visual Engine component F10-13: "Cubic, reciprocal and exponential" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-037 Inverse proportion in tables and graphs (objective: Recognise and represent inverse proportional relationships in practical, numerical and graphical forms.)
- Y9-013 Reciprocal graphs in context (objective: Interpret reciprocal-shaped relationships from given graphs.)
- Y9-014 Exponential graphs in context (objective: Interpret rapidly increasing/decreasing relationships from given graphs.)
- Y9-019 Inverse proportion algebraically (objective: Represent simple inverse proportion with constant-product relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: cubic, reciprocal and exponential curves with asymptote dashes, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-14 Graph transformer

```
Build NOVA Master Visual Engine component F10-14: "Graph transformer" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y9-011 Features of quadratic graphs (objective: Use quadratic graphs to estimate roots and intercepts and identify turning points and symmetry.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: base curve and transformed curve with ghost, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-15 Inequality region shader

```
Build NOVA Master Visual Engine component F10-15: "Inequality region shader" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-017 Linear inequalities and number-line solutions (objective: Solve simple linear inequalities and represent their solution sets on number lines.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: boundary lines and shaded region, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-16 Circle on a grid

```
Build NOVA Master Visual Engine component F10-16: "Circle on a grid" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y9-040 Coordinate geometry (objective: Use coordinates to reason about shape and transformation properties.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: circle x^2+y^2=r^2 with radius handle, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-17 Graph-matching sorter

```
Build NOVA Master Visual Engine component F10-17: "Graph-matching sorter" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
Used in these KS3 lessons:
- Y8-023 Y-intercept and y = mx + c (objective: Interpret the y-intercept and use y=mx+c.)
- Y8-032 Comparing linear and quadratic relationships (objective: Compare how linear and quadratic graphs change.)
- Y8-033 Graphical problem solving (objective: Use graphs to estimate solutions and interpret relationships.)
- Y9-012 Linear versus quadratic models (objective: Decide whether a context is better represented linearly or quadratically.)
- Y9-015 Piecewise and non-standard graphs (objective: Interpret graphs made of different behaviours across intervals.)
- Y9-020 Direct and inverse proportion graphs (objective: Recognise graphical signatures of proportional relationships.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: graph cards and equation/story cards, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-18 Piecewise and non-standard graph builder

```
Build NOVA Master Visual Engine component F10-18: "Piecewise and non-standard graph builder" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
(New component added by the audit.)
Used in these KS3 lessons:
- Y9-015 Piecewise and non-standard graphs (objective: Interpret graphs made of different behaviours across intervals.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: piecewise segments built on axes, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-19 Trig graph explorer (sin, cos, tan)

```
Build NOVA Master Visual Engine component F10-19: "Trig graph explorer (sin, cos, tan)" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
(New component added by the audit, GCSE extension.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: sin/cos/tan curves linked to a unit-circle angle, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F10-20 Tangent and area-under-curve estimator

```
Build NOVA Master Visual Engine component F10-20: "Tangent and area-under-curve estimator" (Family F10: Coordinates and Graphs).
Family covers: coordinates, straight lines, real-life graphs, quadratics and beyond.
(New component added by the audit, GCSE extension.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: curve with tangent line and trapezium strips, all on the core NOVA.svg.axes grid with neonPlot curves, neonMark points and neonRing markers; chalk labels on axes.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): axes appear > points/curve trace (NOVA.motion.trail) > key features ring-flash > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag points/handles (snap to grid or curve); drag cards onto matching graphs.
- Correct in Challenge: coordinates/feature/reading correct within tolerance. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-up on features, magnify on readings; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F11: Angles and Constructions

## Family run prompt

```
Build NOVA Master Visual Engine Family F11: Angles and Constructions as a gallery plus components.
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.

Components, in order (items marked preset are modes of another engine, not separate builds):
F11-01 Protractor
F11-02 Angle estimator
F11-03 Angle facts
F11-04 Triangle angle-sum tear-off
F11-05 Parallel lines explorer
F11-06 Polygon angles turtle
F11-07 Regular polygon builder
F11-08 Compass constructions
F11-09 Locus builder
F11-10 Bearings
F11-11 Angle chase
F11-12 Clock-face angles [preset of F18-03]
F11-13 Geometry proof stepper [preset of F11-11]

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F11-01 Protractor

```
Build NOVA Master Visual Engine component F11-01: "Protractor" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-040 Measuring and drawing angles (objective: Measure and construct angles accurately with a protractor.)
- Y7-041 Angles on lines and at a point (objective: Use angle facts on a straight line, around a point and vertically opposite.)
- Y7-067 Pie charts (objective: Construct and interpret pie charts using fractions, percentages and angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: neon protractor overlaid on an angle, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-02 Angle estimator

```
Build NOVA Master Visual Engine component F11-02: "Angle estimator" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-040 Measuring and drawing angles (objective: Measure and construct angles accurately with a protractor.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: angle arms with an estimate ring, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-03 Angle facts

```
Build NOVA Master Visual Engine component F11-03: "Angle facts" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-041 Angles on lines and at a point (objective: Use angle facts on a straight line, around a point and vertically opposite.)
- Y7-042 Angles in parallel lines (objective: Use corresponding and alternate angle relationships in parallel lines.)
- Y7-043 Angles in triangles (objective: Use the angle sum of a triangle to find unknown angles.)
- Y8-052 Bearings (objective: Measure and use three-figure bearings.)
- Y9-039 Bearings (objective: Solve multi-step bearing problems.)
- Y9-041 Simple geometric proof (objective: Write short deductive arguments using known geometric facts.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: straight-line, point and vertical angles with arc marks, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-04 Triangle angle-sum tear-off

```
Build NOVA Master Visual Engine component F11-04: "Triangle angle-sum tear-off" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-043 Angles in triangles (objective: Use the angle sum of a triangle to find unknown angles.)
- Y7-044 Angles in quadrilaterals and polygons (objective: Use angle properties of quadrilaterals and simple polygons.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: triangle whose corners tear off and line up on a straight line, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-05 Parallel lines explorer

```
Build NOVA Master Visual Engine component F11-05: "Parallel lines explorer" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-042 Angles in parallel lines (objective: Use corresponding and alternate angle relationships in parallel lines.)
- Y8-052 Bearings (objective: Measure and use three-figure bearings.)
- Y9-025 Angle reasoning with parallel lines (objective: Build multi-step angle arguments using line and parallel-line facts.)
- Y9-039 Bearings (objective: Solve multi-step bearing problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: parallel lines with transversal, matching angle colours, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-06 Polygon angles turtle

```
Build NOVA Master Visual Engine component F11-06: "Polygon angles turtle" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-044 Angles in quadrilaterals and polygons (objective: Use angle properties of quadrilaterals and simple polygons.)
- Y8-049 Interior, exterior and regular-polygon angles (objective: Use interior and exterior angle relationships to solve polygon and regular-polygon problems.)
- Y9-026 Polygon angle reasoning (objective: Use interior/exterior angle relationships in polygons.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: turtle walking a polygon, exterior turns as arcs, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-07 Regular polygon builder

```
Build NOVA Master Visual Engine component F11-07: "Regular polygon builder" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-044 Angles in quadrilaterals and polygons (objective: Use angle properties of quadrilaterals and simple polygons.)
- Y8-049 Interior, exterior and regular-polygon angles (objective: Use interior and exterior angle relationships to solve polygon and regular-polygon problems.)
- Y9-026 Polygon angle reasoning (objective: Use interior/exterior angle relationships in polygons.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: regular polygon from a circle with centre angles, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-08 Compass constructions

```
Build NOVA Master Visual Engine component F11-08: "Compass constructions" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-056 Ruler-and-compass constructions (objective: Carry out standard geometric constructions accurately.)
- Y7-057 Introduction to congruence (objective: Recognise congruent shapes as identical in size and shape.)
- Y8-050 Perpendicular and angle-bisector constructions (objective: Perform standard ruler-and-compass constructions.)
- Y8-051 Loci (objective: Describe and construct loci from distance conditions.)
- Y8-056 Triangle congruence (objective: Apply SSS, SAS, ASA and RHS to decide congruence.)
- Y9-027 Loci problems (objective: Solve problems involving intersections of loci.)
- Y9-028 Congruence reasoning (objective: Use triangle congruence to justify equal lengths and angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: compass arcs and straight-edge constructions, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-09 Locus builder

```
Build NOVA Master Visual Engine component F11-09: "Locus builder" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y8-050 Perpendicular and angle-bisector constructions (objective: Perform standard ruler-and-compass constructions.)
- Y8-051 Loci (objective: Describe and construct loci from distance conditions.)
- Y9-027 Loci problems (objective: Solve problems involving intersections of loci.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: locus shading from points/lines, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-10 Bearings

```
Build NOVA Master Visual Engine component F11-10: "Bearings" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y8-052 Bearings (objective: Measure and use three-figure bearings.)
- Y9-027 Loci problems (objective: Solve problems involving intersections of loci.)
- Y9-039 Bearings (objective: Solve multi-step bearing problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: north line, bearing arc and compass rose, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-11 Angle chase

```
Build NOVA Master Visual Engine component F11-11: "Angle chase" (Family F11: Angles and Constructions).
Family covers: measuring, angle facts, parallel lines, polygons, constructions, loci, bearings.
Used in these KS3 lessons:
- Y7-041 Angles on lines and at a point (objective: Use angle facts on a straight line, around a point and vertically opposite.)
- Y7-042 Angles in parallel lines (objective: Use corresponding and alternate angle relationships in parallel lines.)
- Y7-043 Angles in triangles (objective: Use the angle sum of a triangle to find unknown angles.)
- Y7-056 Ruler-and-compass constructions (objective: Carry out standard geometric constructions accurately.)
- Y8-049 Interior, exterior and regular-polygon angles (objective: Use interior and exterior angle relationships to solve polygon and regular-polygon problems.)
- Y8-056 Triangle congruence (objective: Apply SSS, SAS, ASA and RHS to decide congruence.)
- Y9-025 Angle reasoning with parallel lines (objective: Build multi-step angle arguments using line and parallel-line facts.)
- Y9-026 Polygon angle reasoning (objective: Use interior/exterior angle relationships in polygons.)
- plus 2 more lessons

This engine must also provide these presets or modes (do not build them separately): F11-13 Geometry proof stepper.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: diagram with unknown angles solved in chain, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-12 Clock-face angles

```
Add a PRESET to NOVA Master Visual Engine component F18-03 "Analogue clock": F11-12 "Clock-face angles" (Family F11).
Reason it is a preset: angle overlay on the clock.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F18-03), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-040 Measuring and drawing angles (objective: Measure and construct angles accurately with a protractor.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: clock face with hands and angle arc, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F11-13 Geometry proof stepper

```
Add a PRESET to NOVA Master Visual Engine component F11-11 "Angle chase": F11-13 "Geometry proof stepper" (Family F11).
Reason it is a preset: formal-reasons mode of angle chase.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F11-11), and its entry in the family gallery.
Used in these KS3 lessons:
- Y7-056 Ruler-and-compass constructions (objective: Carry out standard geometric constructions accurately.)
- Y8-056 Triangle congruence (objective: Apply SSS, SAS, ASA and RHS to decide congruence.)
- Y9-025 Angle reasoning with parallel lines (objective: Build multi-step angle arguments using line and parallel-line facts.)
- Y9-028 Congruence reasoning (objective: Use triangle congruence to justify equal lengths and angles.)
- Y9-041 Simple geometric proof (objective: Write short deductive arguments using known geometric facts.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: geometry proof with reason cards, drawn with neonPath/neonLine and NOVA.svg.arc angle arcs, angle values in chalk.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): draw figure > highlight relevant angles > reason appears > value resolves.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag arm/vertex handles (snap to 1 or 5 deg); drag reason and value cards onto angles.
- Correct in Challenge: angle/reason correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler on measuring, point-left on reasons; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F12: 2D Shapes, Perimeter and Area

## Family run prompt

```
Build NOVA Master Visual Engine Family F12: 2D Shapes, Perimeter and Area as a gallery plus components.
Family covers: shape properties, perimeter, area, circles.

Components, in order (items marked preset are modes of another engine, not separate builds):
F12-01 Shape family tree
F12-02 Property sorter
F12-03 Geoboard builder
F12-04 Perimeter tracer
F12-05 Area by counting
F12-06 Parallelogram shear
F12-07 Triangle area by doubling
F12-08 Trapezium area
F12-09 Kite and rhombus area
F12-10 Compound shape decomposer
F12-11 Circumference unrolling
F12-12 Circle area unwrap
F12-13 Arc and sector explorer
F12-14 Area and perimeter relationship
F12-15 Units of area grid

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F12-01 Shape family tree

```
Build NOVA Master Visual Engine component F12-01: "Shape family tree" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-045 Properties of 2-D shapes (objective: Classify triangles, quadrilaterals and polygons by properties.)
- Y7-057 Introduction to congruence (objective: Recognise congruent shapes as identical in size and shape.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: family tree of quadrilaterals/triangles as neonCards, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-02 Property sorter

```
Build NOVA Master Visual Engine component F12-02: "Property sorter" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-045 Properties of 2-D shapes (objective: Classify triangles, quadrilaterals and polygons by properties.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shapes and property sorting bins, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-03 Geoboard builder

```
Build NOVA Master Visual Engine component F12-03: "Geoboard builder" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-045 Properties of 2-D shapes (objective: Classify triangles, quadrilaterals and polygons by properties.)
- Y7-046 Perimeter (objective: Calculate and solve perimeter problems with 2-D shapes.)
- Y7-048 Compound area and perimeter (objective: Decompose compound shapes to calculate area and perimeter.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: geoboard pegs with neon elastic polygon, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-04 Perimeter tracer

```
Build NOVA Master Visual Engine component F12-04: "Perimeter tracer" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-046 Perimeter (objective: Calculate and solve perimeter problems with 2-D shapes.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: perimeter tracer ring walking edges, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-05 Area by counting

```
Build NOVA Master Visual Engine component F12-05: "Area by counting" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-047 Area of common 2-D shapes (objective: Calculate areas of rectangles, triangles, parallelograms and trapezia using structure rather than isolated formula memorisation.)
- Y8-044 Pythagoras from square areas (objective: Understand Pythagoras’ theorem as a relationship between square areas.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape on unit-square grid counting squares and halves, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-06 Parallelogram shear

```
Build NOVA Master Visual Engine component F12-06: "Parallelogram shear" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-047 Area of common 2-D shapes (objective: Calculate areas of rectangles, triangles, parallelograms and trapezia using structure rather than isolated formula memorisation.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: parallelogram shearing into rectangle, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-07 Triangle area by doubling

```
Build NOVA Master Visual Engine component F12-07: "Triangle area by doubling" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-047 Area of common 2-D shapes (objective: Calculate areas of rectangles, triangles, parallelograms and trapezia using structure rather than isolated formula memorisation.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: triangle doubled into parallelogram, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-08 Trapezium area

```
Build NOVA Master Visual Engine component F12-08: "Trapezium area" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-047 Area of common 2-D shapes (objective: Calculate areas of rectangles, triangles, parallelograms and trapezia using structure rather than isolated formula memorisation.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: trapezium doubled and rotated into parallelogram, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-09 Kite and rhombus area

```
Build NOVA Master Visual Engine component F12-09: "Kite and rhombus area" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-047 Area of common 2-D shapes (objective: Calculate areas of rectangles, triangles, parallelograms and trapezia using structure rather than isolated formula memorisation.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: kite/rhombus inside rectangle of diagonals, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-10 Compound shape decomposer

```
Build NOVA Master Visual Engine component F12-10: "Compound shape decomposer" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-048 Compound area and perimeter (objective: Decompose compound shapes to calculate area and perimeter.)
- Y9-035 Area of circles and composite shapes (objective: Calculate areas involving circles and composite shapes.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: compound shape split into rectangles, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-11 Circumference unrolling

```
Build NOVA Master Visual Engine component F12-11: "Circumference unrolling" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y8-047 Circumference of a circle (objective: Use circle vocabulary and calculate circumference.)
- Y8-048 Area of a circle (objective: Calculate and solve problems involving circle area.)
- Y8-063 Surface area of cylinders (objective: Calculate the surface area of a cylinder.)
- Y9-034 Circle vocabulary and circumference (objective: Use precise circle vocabulary and solve circumference problems, including reverse problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: circle rolling to unroll its circumference on a number line, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-12 Circle area unwrap

```
Build NOVA Master Visual Engine component F12-12: "Circle area unwrap" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y8-048 Area of a circle (objective: Calculate and solve problems involving circle area.)
- Y8-062 Volume of cylinders (objective: Calculate the volume of a cylinder.)
- Y9-035 Area of circles and composite shapes (objective: Calculate areas involving circles and composite shapes.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: circle cut into sectors rearranged into near-rectangle, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-13 Arc and sector explorer

```
Build NOVA Master Visual Engine component F12-13: "Arc and sector explorer" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y8-047 Circumference of a circle (objective: Use circle vocabulary and calculate circumference.)
- Y8-048 Area of a circle (objective: Calculate and solve problems involving circle area.)
- Y9-034 Circle vocabulary and circumference (objective: Use precise circle vocabulary and solve circumference problems, including reverse problems.)
- Y9-035 Area of circles and composite shapes (objective: Calculate areas involving circles and composite shapes.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: sector with angle handle and arc length, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-14 Area and perimeter relationship

```
Build NOVA Master Visual Engine component F12-14: "Area and perimeter relationship" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-046 Perimeter (objective: Calculate and solve perimeter problems with 2-D shapes.)
- Y7-048 Compound area and perimeter (objective: Decompose compound shapes to calculate area and perimeter.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: fixed-perimeter / fixed-area rectangles compared, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F12-15 Units of area grid

```
Build NOVA Master Visual Engine component F12-15: "Units of area grid" (Family F12: 2D Shapes, Perimeter and Area).
Family covers: shape properties, perimeter, area, circles.
Used in these KS3 lessons:
- Y7-051 Converting units (objective: Convert standard units of length, area and volume.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: 1 m^2 and 1 cm^2 grids scaled, glass neonPath shapes with lift and glow, side braces and chalk dimensions.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): shape appears > decompose/transform step > area or perimeter builds with count-up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices/handles (snap to grid), drag pieces to rearrange, drag cards to bins.
- Correct in Challenge: measure/sort correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, show-two; Nova checking.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F13: 3D Shapes, Volume and Surface Area

## Family run prompt

```
Build NOVA Master Visual Engine Family F13: 3D Shapes, Volume and Surface Area as a gallery plus components.
Family covers: solids, nets, plans and elevations, volume, surface area.

Components, in order (items marked preset are modes of another engine, not separate builds):
F13-01 3D solid viewer
F13-02 Net folder
F13-03 Isometric drawing
F13-04 Plans and elevations
F13-05 Cube-stacking volume
F13-06 Prism volume slicer
F13-07 Cuboid volume and surface area
F13-08 Cylinder unroll
F13-09 Pyramid and cone fill
F13-10 Sphere
F13-11 Cross-sections
F13-12 Capacity and volume conversion
F13-13 Surface-area unfolder
F13-14 Solid enlargement

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F13-01 3D solid viewer

```
Build NOVA Master Visual Engine component F13-01: "3D solid viewer" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-058 Nets and 3-D shapes (objective: Interpret and construct nets of prisms and other solids.)
- Y9-038 3-D solid properties (objective: Use faces, surfaces, edges and vertices of prisms, pyramids, cones and spheres to solve problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: rotatable glass 3D solid with faces, edges, vertices counts, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-02 Net folder

```
Build NOVA Master Visual Engine component F13-02: "Net folder" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-058 Nets and 3-D shapes (objective: Interpret and construct nets of prisms and other solids.)
- Y8-061 Surface area of prisms (objective: Calculate surface area by summing faces or using nets.)
- Y9-038 3-D solid properties (objective: Use faces, surfaces, edges and vertices of prisms, pyramids, cones and spheres to solve problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: net unfolding/folding into a solid, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-03 Isometric drawing

```
Build NOVA Master Visual Engine component F13-03: "Isometric drawing" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-059 Plans and elevations (objective: Construct and interpret plans and elevations.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: isometric dot grid with cube drawing, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-04 Plans and elevations

```
Build NOVA Master Visual Engine component F13-04: "Plans and elevations" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-059 Plans and elevations (objective: Construct and interpret plans and elevations.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: solid with plan, front and side elevation panels, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-05 Cube-stacking volume

```
Build NOVA Master Visual Engine component F13-05: "Cube-stacking volume" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y7-049 Volume of cuboids (objective: Calculate volume of cuboids from layer structure.)
- Y8-059 Plans and elevations (objective: Construct and interpret plans and elevations.)
- Y8-060 Volume of prisms (objective: Calculate volumes of prisms using cross-sectional area × length.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: stacked unit cubes in layers, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-06 Prism volume slicer

```
Build NOVA Master Visual Engine component F13-06: "Prism volume slicer" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-060 Volume of prisms (objective: Calculate volumes of prisms using cross-sectional area × length.)
- Y8-062 Volume of cylinders (objective: Calculate the volume of a cylinder.)
- Y9-036 Volume of prisms and cylinders (objective: Use cross-sectional area × length for prisms and cylinders.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: prism sliced into cross-section layers, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-07 Cuboid volume and surface area

```
Build NOVA Master Visual Engine component F13-07: "Cuboid volume and surface area" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y7-049 Volume of cuboids (objective: Calculate volume of cuboids from layer structure.)
- Y8-042 Density (objective: Use density as mass per unit volume.)
- Y8-060 Volume of prisms (objective: Calculate volumes of prisms using cross-sectional area × length.)
- Y8-061 Surface area of prisms (objective: Calculate surface area by summing faces or using nets.)
- Y9-036 Volume of prisms and cylinders (objective: Use cross-sectional area × length for prisms and cylinders.)
- Y9-037 Surface area (objective: Calculate surface area of prisms and cylinders using nets/face structure.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: cuboid with unit-cube fill and unfolded faces, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-08 Cylinder unroll

```
Build NOVA Master Visual Engine component F13-08: "Cylinder unroll" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-062 Volume of cylinders (objective: Calculate the volume of a cylinder.)
- Y8-063 Surface area of cylinders (objective: Calculate the surface area of a cylinder.)
- Y9-036 Volume of prisms and cylinders (objective: Use cross-sectional area × length for prisms and cylinders.)
- Y9-037 Surface area (objective: Calculate surface area of prisms and cylinders using nets/face structure.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: cylinder unrolling into rectangle and two circles, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-09 Pyramid and cone fill

```
Build NOVA Master Visual Engine component F13-09: "Pyramid and cone fill" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y9-038 3-D solid properties (objective: Use faces, surfaces, edges and vertices of prisms, pyramids, cones and spheres to solve problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: pyramid/cone filling into a prism/cylinder (1/3), isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-10 Sphere

```
Build NOVA Master Visual Engine component F13-10: "Sphere" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y9-038 3-D solid properties (objective: Use faces, surfaces, edges and vertices of prisms, pyramids, cones and spheres to solve problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: sphere with radius and volume/surface chips, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-11 Cross-sections

```
Build NOVA Master Visual Engine component F13-11: "Cross-sections" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y9-038 3-D solid properties (objective: Use faces, surfaces, edges and vertices of prisms, pyramids, cones and spheres to solve problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: solid cut by a plane showing the cross-section, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-12 Capacity and volume conversion

```
Build NOVA Master Visual Engine component F13-12: "Capacity and volume conversion" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y7-049 Volume of cuboids (objective: Calculate volume of cuboids from layer structure.)
- Y7-051 Converting units (objective: Convert standard units of length, area and volume.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: litre cube filled with water, cm^3 and ml links, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-13 Surface-area unfolder

```
Build NOVA Master Visual Engine component F13-13: "Surface-area unfolder" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.
Used in these KS3 lessons:
- Y8-058 Nets and 3-D shapes (objective: Interpret and construct nets of prisms and other solids.)
- Y8-061 Surface area of prisms (objective: Calculate surface area by summing faces or using nets.)
- Y8-063 Surface area of cylinders (objective: Calculate the surface area of a cylinder.)
- Y9-037 Surface area (objective: Calculate surface area of prisms and cylinders using nets/face structure.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: solid unfolding to its net with face areas, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F13-14 Solid enlargement

```
Build NOVA Master Visual Engine component F13-14: "Solid enlargement" (Family F13: 3D Shapes, Volume and Surface Area).
Family covers: solids, nets, plans and elevations, volume, surface area.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: solid and its enlargement with length/area/volume factors, isometric neon (neonPath faces with glass fill per face tint and lift), chalk dimensions, value answerChip.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): solid builds > rotate/unfold/slice step > measure counts up > formula chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag cubes/faces/slice plane (snaps), rotate by drag with keyboard arrows.
- Correct in Challenge: count/volume/area/net correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova magnify, show-three; Izaac read-tablet in Challenge.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F14: Transformations and Symmetry

## Family run prompt

```
Build NOVA Master Visual Engine Family F14: Transformations and Symmetry as a gallery plus components.
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.

Components, in order (items marked preset are modes of another engine, not separate builds):
F14-01 Reflection
F14-02 Rotation
F14-03 Translation
F14-04 Enlargement
F14-05 Combined transformations
F14-06 Describe-the-transformation challenge
F14-07 Line symmetry
F14-08 Rotational symmetry
F14-09 Tessellation maker
F14-10 Congruence tester
F14-11 Similar shapes
F14-12 Vector builder
F14-13 Pattern makers

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F14-01 Reflection

```
Build NOVA Master Visual Engine component F14-01: "Reflection" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-052 Reflection and translation (objective: Describe and perform reflections and translations on coordinate grids.)
- Y8-053 Reflection and translation (objective: Describe transformations precisely.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape and mirror line on grid, reflected image, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-02 Rotation

```
Build NOVA Master Visual Engine component F14-02: "Rotation" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-053 Rotation (objective: Describe and perform rotations about a given centre.)
- Y8-054 Rotation (objective: Perform rotations about a centre.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape rotated about a centre with angle arc, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-03 Translation

```
Build NOVA Master Visual Engine component F14-03: "Translation" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-052 Reflection and translation (objective: Describe and perform reflections and translations on coordinate grids.)
- Y8-053 Reflection and translation (objective: Describe transformations precisely.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape translated by a vector arrow, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-04 Enlargement

```
Build NOVA Master Visual Engine component F14-04: "Enlargement" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-054 Enlargement (objective: Construct and describe enlargements using a positive scale factor.)
- Y7-064 Scale drawings and maps (objective: Use scale factors to interpret and construct scale drawings.)
- Y8-055 Enlargement (objective: Construct enlargements with positive scale factors.)
- Y9-021 Scale factors and maps (objective: Use scale factors across drawings, maps and similar figures.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape enlarged from a centre with ray lines, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-05 Combined transformations

```
Build NOVA Master Visual Engine component F14-05: "Combined transformations" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y8-054 Rotation (objective: Perform rotations about a centre.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: sequence of transformations with ghost stages, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-06 Describe-the-transformation challenge

```
Build NOVA Master Visual Engine component F14-06: "Describe-the-transformation challenge" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-053 Rotation (objective: Describe and perform rotations about a given centre.)
- Y8-054 Rotation (objective: Perform rotations about a centre.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: object/image pair to describe, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-07 Line symmetry

```
Build NOVA Master Visual Engine component F14-07: "Line symmetry" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-055 Symmetry (objective: Identify and construct line and rotational symmetry.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape with movable mirror line, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-08 Rotational symmetry

```
Build NOVA Master Visual Engine component F14-08: "Rotational symmetry" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-055 Symmetry (objective: Identify and construct line and rotational symmetry.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: shape rotating about its centre with order count, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-09 Tessellation maker

```
Build NOVA Master Visual Engine component F14-09: "Tessellation maker" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-055 Symmetry (objective: Identify and construct line and rotational symmetry.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: tile shape repeating into a tessellation, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-10 Congruence tester

```
Build NOVA Master Visual Engine component F14-10: "Congruence tester" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-056 Ruler-and-compass constructions (objective: Carry out standard geometric constructions accurately.)
- Y7-057 Introduction to congruence (objective: Recognise congruent shapes as identical in size and shape.)
- Y8-050 Perpendicular and angle-bisector constructions (objective: Perform standard ruler-and-compass constructions.)
- Y8-055 Enlargement (objective: Construct enlargements with positive scale factors.)
- Y8-056 Triangle congruence (objective: Apply SSS, SAS, ASA and RHS to decide congruence.)
- Y9-028 Congruence reasoning (objective: Use triangle congruence to justify equal lengths and angles.)
- Y9-041 Simple geometric proof (objective: Write short deductive arguments using known geometric facts.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: two triangles overlaid for SSS/SAS/ASA/RHS, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-11 Similar shapes

```
Build NOVA Master Visual Engine component F14-11: "Similar shapes" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y7-054 Enlargement (objective: Construct and describe enlargements using a positive scale factor.)
- Y7-064 Scale drawings and maps (objective: Use scale factors to interpret and construct scale drawings.)
- Y8-055 Enlargement (objective: Construct enlargements with positive scale factors.)
- Y8-057 Similarity (objective: Use scale factors with similar shapes.)
- Y9-021 Scale factors and maps (objective: Use scale factors across drawings, maps and similar figures.)
- Y9-023 Density (objective: Solve density, mass and volume problems.)
- Y9-029 Similarity reasoning (objective: Use similarity to calculate missing lengths and justify relationships.)
- Y9-031 Trigonometric ratios (objective: Understand sine, cosine and tangent as side ratios in similar right triangles.)
- plus 1 more lessons

This engine must also provide these presets or modes (do not build them separately): F6-13 Proportion in geometry; F15-05 Similar triangles.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: similar shapes with scale factor, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-12 Vector builder

```
Build NOVA Master Visual Engine component F14-12: "Vector builder" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.
Used in these KS3 lessons:
- Y8-053 Reflection and translation (objective: Describe transformations precisely.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: column vectors as arrows head-to-tail, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F14-13 Pattern makers

```
Build NOVA Master Visual Engine component F14-13: "Pattern makers" (Family F14: Transformations and Symmetry).
Family covers: reflection, rotation, translation, enlargement, symmetry, tessellation, congruence, similarity.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: pattern generator with repeated transformations, on a core NOVA.svg.grid, object in glass neonPath, image ghost then solid, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): object > transformation guide (mirror, arc, vector, rays) > image traces > description chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag the image (snaps to grid), drag mirror line/centre/vector handles, drag description cards.
- Correct in Challenge: image or description correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova point-right, compare; Izaac idea on hint.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F15: Right-Angled Triangles and Circle Geometry

## Family run prompt

```
Build NOVA Master Visual Engine Family F15: Right-Angled Triangles and Circle Geometry as a gallery plus components.
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.

Components, in order (items marked preset are modes of another engine, not separate builds):
F15-01 Pythagoras squares-on-sides
F15-02 Pythagoras finder
F15-03 Pythagoras on a grid [preset of F10-03]
F15-04 Pythagoras in context [preset of F15-02]
F15-05 Similar triangles [preset of F14-11]
F15-06 Trig ratio builder
F15-07 Angle slider and ratio table
F15-08 Unit circle explorer
F15-09 Trig solver
F15-10 Special triangle values
F15-11 Circle parts diagram
F15-12 Circle theorems explorer
F15-13 Sine and cosine rule
F15-14 3D Pythagoras and trigonometry

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F15-01 Pythagoras squares-on-sides

```
Build NOVA Master Visual Engine component F15-01: "Pythagoras squares-on-sides" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y8-044 Pythagoras from square areas (objective: Understand Pythagoras’ theorem as a relationship between square areas.)
- Y8-045 Finding unknown sides with Pythagoras (objective: Use Pythagoras’ theorem to find either the hypotenuse or a shorter side in a right triangle.)
- Y9-030 Pythagoras mastery (objective: Apply Pythagoras in multi-step 2-D problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: right triangle with glass squares on each side, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-02 Pythagoras finder

```
Build NOVA Master Visual Engine component F15-02: "Pythagoras finder" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y8-044 Pythagoras from square areas (objective: Understand Pythagoras’ theorem as a relationship between square areas.)
- Y8-045 Finding unknown sides with Pythagoras (objective: Use Pythagoras’ theorem to find either the hypotenuse or a shorter side in a right triangle.)
- Y8-046 Pythagoras problem solving (objective: Apply Pythagoras in geometric and contextual problems.)
- Y9-030 Pythagoras mastery (objective: Apply Pythagoras in multi-step 2-D problems.)

This engine must also provide these presets or modes (do not build them separately): F15-04 Pythagoras in context.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: right triangle with unknown side, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-03 Pythagoras on a grid

```
Add a PRESET to NOVA Master Visual Engine component F10-03 "Midpoint and distance": F15-03 "Pythagoras on a grid" (Family F15).
Reason it is a preset: distance on a grid is the same picture.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F10-03), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-045 Finding unknown sides with Pythagoras (objective: Use Pythagoras’ theorem to find either the hypotenuse or a shorter side in a right triangle.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: segment on grid with right-triangle legs, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-04 Pythagoras in context

```
Add a PRESET to NOVA Master Visual Engine component F15-02 "Pythagoras finder": F15-04 "Pythagoras in context" (Family F15).
Reason it is a preset: context scenes are a skin.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F15-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-046 Pythagoras problem solving (objective: Apply Pythagoras in geometric and contextual problems.)
- Y9-030 Pythagoras mastery (objective: Apply Pythagoras in multi-step 2-D problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: context diagram (ladder, ramp) with triangle, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-05 Similar triangles

```
Add a PRESET to NOVA Master Visual Engine component F14-11 "Similar shapes": F15-05 "Similar triangles" (Family F15).
Reason it is a preset: similar triangles are similar shapes.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F14-11), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-057 Similarity (objective: Use scale factors with similar shapes.)
- Y9-029 Similarity reasoning (objective: Use similarity to calculate missing lengths and justify relationships.)
- Y9-031 Trigonometric ratios (objective: Understand sine, cosine and tangent as side ratios in similar right triangles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: pair of similar triangles, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-06 Trig ratio builder

```
Build NOVA Master Visual Engine component F15-06: "Trig ratio builder" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y9-031 Trigonometric ratios (objective: Understand sine, cosine and tangent as side ratios in similar right triangles.)
- Y9-032 Trigonometry: finding sides (objective: Use trigonometric ratios to find unknown side lengths.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: right triangle with opp/adj/hyp labelling, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-07 Angle slider and ratio table

```
Build NOVA Master Visual Engine component F15-07: "Angle slider and ratio table" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y9-031 Trigonometric ratios (objective: Understand sine, cosine and tangent as side ratios in similar right triangles.)
- Y9-033 Trigonometry: finding angles (objective: Use inverse trigonometric functions to find angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: angle slider with live ratio table, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-08 Unit circle explorer

```
Build NOVA Master Visual Engine component F15-08: "Unit circle explorer" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: unit circle with angle radius and projections, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-09 Trig solver

```
Build NOVA Master Visual Engine component F15-09: "Trig solver" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y9-032 Trigonometry: finding sides (objective: Use trigonometric ratios to find unknown side lengths.)
- Y9-033 Trigonometry: finding angles (objective: Use inverse trigonometric functions to find angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: triangle with chosen ratio and unknown, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-10 Special triangle values

```
Build NOVA Master Visual Engine component F15-10: "Special triangle values" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y9-032 Trigonometry: finding sides (objective: Use trigonometric ratios to find unknown side lengths.)
- Y9-033 Trigonometry: finding angles (objective: Use inverse trigonometric functions to find angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: 30-60-90 and 45-45-90 triangles with exact values, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-11 Circle parts diagram

```
Build NOVA Master Visual Engine component F15-11: "Circle parts diagram" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
Used in these KS3 lessons:
- Y8-047 Circumference of a circle (objective: Use circle vocabulary and calculate circumference.)
- Y9-034 Circle vocabulary and circumference (objective: Use precise circle vocabulary and solve circumference problems, including reverse problems.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: circle with radius, chord, tangent, sector, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-12 Circle theorems explorer

```
Build NOVA Master Visual Engine component F15-12: "Circle theorems explorer" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: circle theorem diagrams with moving points, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-13 Sine and cosine rule

```
Build NOVA Master Visual Engine component F15-13: "Sine and cosine rule" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: non-right triangle with sides and angles, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F15-14 3D Pythagoras and trigonometry

```
Build NOVA Master Visual Engine component F15-14: "3D Pythagoras and trigonometry" (Family F15: Right-Angled Triangles and Circle Geometry).
Family covers: Pythagoras, trigonometry, similar triangles, circle theorems.
(New component added by the audit, GCSE extension.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: cuboid with space diagonal triangle, neonPath triangles/circles with glass fill, right-angle marks, chalk side and angle labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): figure > identify sides > rule/ratio applies (squares rearrange or ratio fills) > value.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag vertices (constraints kept), drag label cards onto sides, drag points on circle.
- Correct in Challenge: side/angle correct to stated accuracy. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, magnify; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F16: Data and Statistics

## Family run prompt

```
Build NOVA Master Visual Engine Family F16: Data and Statistics as a gallery plus components.
Family covers: collecting, representing, averages, spread, correlation, interpreting.

Components, in order (items marked preset are modes of another engine, not separate builds):
F16-01 Tally, frequency table and pictogram
F16-02 Bar chart builder
F16-03 Line graph
F16-04 Pie chart builder
F16-05 Stem-and-leaf plot
F16-06 Dot plot and averages
F16-07 Mean explorer
F16-08 Range and spread
F16-09 Grouped frequency
F16-10 Scatter graph and line of best fit
F16-11 Two-way tables
F16-12 Histogram
F16-13 Box plot and cumulative frequency
F16-14 Misleading graph spotter
F16-15 Sampling visual
F16-16 Data-collection designer

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F16-01 Tally, frequency table and pictogram

```
Build NOVA Master Visual Engine component F16-01: "Tally, frequency table and pictogram" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-065 Collecting and organising data (objective: Collect and organise data using tallies and frequency tables.)
- Y7-066 Bar charts and pictograms (objective: Construct and interpret bar charts and pictograms.)
- Y7-068 Stem-and-leaf diagrams (objective: Construct and interpret stem-and-leaf diagrams.)
- Y8-064 Grouped frequency tables (objective: Interpret grouped numerical data in frequency tables.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: tally marks, frequency table and pictogram icons, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-02 Bar chart builder

```
Build NOVA Master Visual Engine component F16-02: "Bar chart builder" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-066 Bar charts and pictograms (objective: Construct and interpret bar charts and pictograms.)
- Y7-071 Misleading graphs (objective: Identify and explain how graph choices can mislead.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: glass bar chart on core axes, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-03 Line graph

```
Build NOVA Master Visual Engine component F16-03: "Line graph" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-071 Misleading graphs (objective: Identify and explain how graph choices can mislead.)
- Y7-072 Line graphs and trends (objective: Construct and interpret line graphs for changing quantities.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: line graph with neonPlot, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-04 Pie chart builder

```
Build NOVA Master Visual Engine component F16-04: "Pie chart builder" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-067 Pie charts (objective: Construct and interpret pie charts using fractions, percentages and angles.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: pie chart with sector angles, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-05 Stem-and-leaf plot

```
Build NOVA Master Visual Engine component F16-05: "Stem-and-leaf plot" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-068 Stem-and-leaf diagrams (objective: Construct and interpret stem-and-leaf diagrams.)
- Y7-070 Comparing distributions (objective: Compare data sets using suitable measures and features.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: stem-and-leaf plot, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-06 Dot plot and averages

```
Build NOVA Master Visual Engine component F16-06: "Dot plot and averages" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-068 Stem-and-leaf diagrams (objective: Construct and interpret stem-and-leaf diagrams.)
- Y7-069 Mean, median, mode and range (objective: Calculate and interpret measures of centre and spread.)
- Y7-070 Comparing distributions (objective: Compare data sets using suitable measures and features.)
- Y8-069 Comparing distributions (objective: Compare data sets using averages and spread.)
- Y9-048 Averages, spread and outliers (objective: Compare distributions using centre and spread.)
- Y9-049 Comparing distributions (objective: Write evidence-based comparisons between data sets.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: dot plot with mean/median/mode markers, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-07 Mean explorer

```
Build NOVA Master Visual Engine component F16-07: "Mean explorer" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-069 Mean, median, mode and range (objective: Calculate and interpret measures of centre and spread.)
- Y8-065 Estimating the mean from grouped data (objective: Estimate a mean using class midpoints.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: mean as levelling towers of cubes, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-08 Range and spread

```
Build NOVA Master Visual Engine component F16-08: "Range and spread" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-069 Mean, median, mode and range (objective: Calculate and interpret measures of centre and spread.)
- Y7-070 Comparing distributions (objective: Compare data sets using suitable measures and features.)
- Y8-069 Comparing distributions (objective: Compare data sets using averages and spread.)
- Y9-048 Averages, spread and outliers (objective: Compare distributions using centre and spread.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: range bracket over ordered data, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-09 Grouped frequency

```
Build NOVA Master Visual Engine component F16-09: "Grouped frequency" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y8-064 Grouped frequency tables (objective: Interpret grouped numerical data in frequency tables.)
- Y8-065 Estimating the mean from grouped data (objective: Estimate a mean using class midpoints.)
- Y9-047 Grouped data representations (objective: Choose and interpret appropriate representations for grouped data.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: grouped frequency table and bars, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-10 Scatter graph and line of best fit

```
Build NOVA Master Visual Engine component F16-10: "Scatter graph and line of best fit" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y8-066 Scatter graphs and lines of best fit (objective: Plot and interpret bivariate data and use a sensible line of best fit.)
- Y9-050 Scatter graphs and correlation (objective: Interpret bivariate data and explain correlation without assuming causation.)
- Y9-051 Lines of best fit and prediction (objective: Use lines of best fit for interpolation and cautious extrapolation.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: scatter graph with line of best fit, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-11 Two-way tables

```
Build NOVA Master Visual Engine component F16-11: "Two-way tables" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-077 Probability from two-way tables (objective: Calculate probabilities from two-way tables.)
- Y8-067 Two-way tables (objective: Complete and interpret two-way tables.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: two-way table, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-12 Histogram

```
Build NOVA Master Visual Engine component F16-12: "Histogram" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y8-064 Grouped frequency tables (objective: Interpret grouped numerical data in frequency tables.)
- Y8-065 Estimating the mean from grouped data (objective: Estimate a mean using class midpoints.)
- Y9-047 Grouped data representations (objective: Choose and interpret appropriate representations for grouped data.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: histogram with frequency density, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-13 Box plot and cumulative frequency

```
Build NOVA Master Visual Engine component F16-13: "Box plot and cumulative frequency" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y8-069 Comparing distributions (objective: Compare data sets using averages and spread.)
- Y9-047 Grouped data representations (objective: Choose and interpret appropriate representations for grouped data.)
- Y9-048 Averages, spread and outliers (objective: Compare distributions using centre and spread.)
- Y9-049 Comparing distributions (objective: Write evidence-based comparisons between data sets.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: box plot linked to cumulative frequency curve, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-14 Misleading graph spotter

```
Build NOVA Master Visual Engine component F16-14: "Misleading graph spotter" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-066 Bar charts and pictograms (objective: Construct and interpret bar charts and pictograms.)
- Y7-071 Misleading graphs (objective: Identify and explain how graph choices can mislead.)
- Y9-049 Comparing distributions (objective: Write evidence-based comparisons between data sets.)
- Y9-050 Scatter graphs and correlation (objective: Interpret bivariate data and explain correlation without assuming causation.)
- Y9-052 Sampling and bias (objective: Evaluate how data-collection choices can bias conclusions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: misleading graph with fault hotspots, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-15 Sampling visual

```
Build NOVA Master Visual Engine component F16-15: "Sampling visual" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-065 Collecting and organising data (objective: Collect and organise data using tallies and frequency tables.)
- Y9-052 Sampling and bias (objective: Evaluate how data-collection choices can bias conclusions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: population of dots with sample picks, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F16-16 Data-collection designer

```
Build NOVA Master Visual Engine component F16-16: "Data-collection designer" (Family F16: Data and Statistics).
Family covers: collecting, representing, averages, spread, correlation, interpreting.
Used in these KS3 lessons:
- Y7-065 Collecting and organising data (objective: Collect and organise data using tallies and frequency tables.)
- Y9-052 Sampling and bias (objective: Evaluate how data-collection choices can bias conclusions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: survey question cards and data-collection sheet, on core axes/tables, glass bars/sectors/markers with lift and glow, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): data enters > chart builds item by item > statistic marker slides in > reading chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag data cards into table/chart, drag bar heights, markers, best-fit line ends.
- Correct in Challenge: chart/statistic correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova count, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F17: Probability and Sets

## Family run prompt

```
Build NOVA Master Visual Engine Family F17: Probability and Sets as a gallery plus components.
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.

Components, in order (items marked preset are modes of another engine, not separate builds):
F17-01 Probability scale
F17-02 Spinner builder
F17-03 Dice and coin simulators
F17-04 Relative-frequency convergence
F17-05 Sample-space grid
F17-06 Systematic listing
F17-07 Tree diagram builder
F17-08 Venn diagram
F17-09 Frequency tree
F17-10 Complement and AND/OR
F17-11 Bag and counter experiments
F17-12 Expected outcomes
F17-13 Fair game tester
F17-14 Combinations and arrangements

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F17-01 Probability scale

```
Build NOVA Master Visual Engine component F17-01: "Probability scale" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-073 Probability scale and complements (objective: Represent likelihood on the 0–1 scale and use complementary probabilities.)
- Y9-042 Probability models (objective: Build theoretical probability models from equally likely outcomes.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: probability scale 0-1 (core number line) with word labels, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-02 Spinner builder

```
Build NOVA Master Visual Engine component F17-02: "Spinner builder" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-075 Combined events (objective: Calculate probabilities from combined-event sample spaces.)
- Y8-073 Experimental and theoretical probability (objective: Compare experimental relative frequencies with theoretical models.)
- Y9-042 Probability models (objective: Build theoretical probability models from equally likely outcomes.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: spinner with editable sectors, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-03 Dice and coin simulators

```
Build NOVA Master Visual Engine component F17-03: "Dice and coin simulators" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-074 Systematic listing and sample spaces (objective: Generate complete sample spaces systematically.)
- Y7-076 Experimental probability and relative frequency (objective: Use experimental results to estimate probability.)
- Y8-073 Experimental and theoretical probability (objective: Compare experimental relative frequencies with theoretical models.)
- Y9-046 Experimental probability and relative frequency (objective: Compare experimental results with theoretical probability and use relative frequency to make predictions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: dice and coins rolling with results tally, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-04 Relative-frequency convergence

```
Build NOVA Master Visual Engine component F17-04: "Relative-frequency convergence" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-076 Experimental probability and relative frequency (objective: Use experimental results to estimate probability.)
- Y8-073 Experimental and theoretical probability (objective: Compare experimental relative frequencies with theoretical models.)
- Y9-042 Probability models (objective: Build theoretical probability models from equally likely outcomes.)
- Y9-046 Experimental probability and relative frequency (objective: Compare experimental results with theoretical probability and use relative frequency to make predictions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: relative-frequency graph converging, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-05 Sample-space grid

```
Build NOVA Master Visual Engine component F17-05: "Sample-space grid" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-074 Systematic listing and sample spaces (objective: Generate complete sample spaces systematically.)
- Y7-075 Combined events (objective: Calculate probabilities from combined-event sample spaces.)
- Y8-070 Combined-event sample spaces and probability (objective: Build structured sample spaces for two events and calculate probabilities from them.)
- Y9-043 Sample spaces and combined-event probability (objective: Generate sample spaces systematically and use them to calculate probabilities for combined events.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: sample-space grid of two events, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-06 Systematic listing

```
Build NOVA Master Visual Engine component F17-06: "Systematic listing" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-074 Systematic listing and sample spaces (objective: Generate complete sample spaces systematically.)
- Y8-070 Combined-event sample spaces and probability (objective: Build structured sample spaces for two events and calculate probabilities from them.)
- Y9-043 Sample spaces and combined-event probability (objective: Generate sample spaces systematically and use them to calculate probabilities for combined events.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: systematic list tree, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-07 Tree diagram builder

```
Build NOVA Master Visual Engine component F17-07: "Tree diagram builder" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-075 Combined events (objective: Calculate probabilities from combined-event sample spaces.)
- Y8-071 Independent tree diagrams (objective: Use tree diagrams for independent repeated events.)
- Y9-043 Sample spaces and combined-event probability (objective: Generate sample spaces systematically and use them to calculate probabilities for combined events.)
- Y9-045 Independent events (objective: Use multiplication for independent events in simple cases.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: probability tree with branches, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-08 Venn diagram

```
Build NOVA Master Visual Engine component F17-08: "Venn diagram" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y8-067 Two-way tables (objective: Complete and interpret two-way tables.)
- Y8-072 Venn diagrams and set notation (objective: Represent sets and events with Venn diagrams and basic set notation.)
- Y9-044 Sets, unions and intersections (objective: Represent probability events with Venn diagrams and set language.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: Venn diagram with set regions, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-09 Frequency tree

```
Build NOVA Master Visual Engine component F17-09: "Frequency tree" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-077 Probability from two-way tables (objective: Calculate probabilities from two-way tables.)
- Y8-067 Two-way tables (objective: Complete and interpret two-way tables.)
- Y8-068 Frequency trees (objective: Represent changing totals through categories using frequency trees.)
- Y8-072 Venn diagrams and set notation (objective: Represent sets and events with Venn diagrams and basic set notation.)
- Y9-044 Sets, unions and intersections (objective: Represent probability events with Venn diagrams and set language.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: frequency tree, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-10 Complement and AND/OR

```
Build NOVA Master Visual Engine component F17-10: "Complement and AND/OR" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-073 Probability scale and complements (objective: Represent likelihood on the 0–1 scale and use complementary probabilities.)
- Y7-077 Probability from two-way tables (objective: Calculate probabilities from two-way tables.)
- Y8-068 Frequency trees (objective: Represent changing totals through categories using frequency trees.)
- Y8-070 Combined-event sample spaces and probability (objective: Build structured sample spaces for two events and calculate probabilities from them.)
- Y8-071 Independent tree diagrams (objective: Use tree diagrams for independent repeated events.)
- Y8-072 Venn diagrams and set notation (objective: Represent sets and events with Venn diagrams and basic set notation.)
- Y9-044 Sets, unions and intersections (objective: Represent probability events with Venn diagrams and set language.)
- Y9-045 Independent events (objective: Use multiplication for independent events in simple cases.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: complement and AND/OR regions, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-11 Bag and counter experiments

```
Build NOVA Master Visual Engine component F17-11: "Bag and counter experiments" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y7-076 Experimental probability and relative frequency (objective: Use experimental results to estimate probability.)
- Y8-071 Independent tree diagrams (objective: Use tree diagrams for independent repeated events.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: bag of counters with draws, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-12 Expected outcomes

```
Build NOVA Master Visual Engine component F17-12: "Expected outcomes" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y9-045 Independent events (objective: Use multiplication for independent events in simple cases.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: expected outcomes from trials, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-13 Fair game tester

```
Build NOVA Master Visual Engine component F17-13: "Fair game tester" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.
Used in these KS3 lessons:
- Y9-046 Experimental probability and relative frequency (objective: Compare experimental results with theoretical probability and use relative frequency to make predictions.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: game outcomes with fairness check, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F17-14 Combinations and arrangements

```
Build NOVA Master Visual Engine component F17-14: "Combinations and arrangements" (Family F17: Probability and Sets).
Family covers: probability scale, experiments, sample spaces, trees, Venn diagrams.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: arrangements as slot boxes, neonPath/neonRing glass objects, probabilities via TBD fraction placeholder or decimals, chalk labels.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): setup > trial/branch animates > outcomes collect > probability chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag events onto scale, sectors/branches/counters into place, cards into regions.
- Correct in Challenge: probability/count correct. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova think, compare; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

# Family F18: Measures, Units, Time and Money

## Family run prompt

```
Build NOVA Master Visual Engine Family F18: Measures, Units, Time and Money as a gallery plus components.
Family covers: measuring, units, compound measures, time, money, bounds.

Components, in order (items marked preset are modes of another engine, not separate builds):
F18-01 Ruler and measuring tools
F18-02 Unit-conversion bridges
F18-03 Analogue clock
F18-04 Timetable reader
F18-05 Money and change
F18-06 Budget and payslip
F18-07 Interest growth chart
F18-08 Compound measures
F18-09 Currency exchange [preset of F18-02]
F18-10 Estimating in context
F18-11 Bounds and accuracy
F18-12 Standard-unit stories

For each engine, give a spec card (maths purpose, parameters, presets, animation steps, interactions, misconception traps, GCSE flag), then the build. Build in runs of 3 to 4 engines and wait for my go-ahead between runs. Share one common family stylesheet and helper set so the components match.

Standards: ONE self-contained HTML file (inline CSS/JS/SVG, no external libraries), mobile-first at 380px wide, NOVA design tokens and the locked NOVA maths colour language, colour-blind safe (shape or pattern as a second cue). Expose a config object at the top with parameters and named presets. Provide four modes: Watch (auto animation), Guided (stepped with prompts), Explore (free manipulation), Challenge (task with checking). Animation is a named step sequence with play, pause, step back/forward, scrub and reset, plus a narration slot per step for the Sir Bob tutor. Emit events (value, correct, step, hint used). Keyboard operable, respects reduced motion, alt text, static fallback for print. Contain NO game logic: games are run by the F0-12 game wrapper. Build the component to be reusable across lessons, not tied to one lesson. Drawing style: use the Drawing Style Lock in the master document (Neon Tube for all maths drawings, Chalk for all writing, labels and numerals) and the core primitives in core/nova-core.js v3.x with core/nova-core.css; F0-02 is the visual reference. Do not invent new drawing styles, filters, line weights or fonts. Draw only through the core primitive functions (NOVA.svg.root, inkLine, arrow, hop, brace, arc, grid, axes, cue, label, pill) and the v3.2 house helpers (NOVA.chalkText, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip). Labels inside drawings use --nova-font-chalk-draw with the chalk texture; written maths uses --nova-font-chalk-write with neon glow. Nothing may overlap the maths, and the helper has no box or background behind it. NUMBER LINE LOCK: draw every number line, scale, power line or zoom line only with core NOVA.numberLine (F0-03 style: neon tube, straight evenly sized major lines, shorter straight minor lines, no dots or beads, chalk-draw digits centred under, end arrows). No custom tick drawing. F0 FOUNDATION LOCK (mandatory for F1 onward): F0-01 to F0-17 are COMPLETED and APPROVED (v3.x). Build ONLY from the approved F0 engines and the core helpers in core/nova-core.js + core/nova-core.css: NOVA.neonLine, neonPath, neonBox, neonRing, neonMark, neonPlot, neonTile, neonCard, answerChip, chalkText (plus NOVA.svg axes/hop/arc, NOVA.mt, NOVA.ui controls, NOVA.assess, game wrapper F0-12, worked example F0-13). Reuse F0 patterns (stage caption, helper strip, side neon cards, four modes). Rules: every drawing is Neon Tube; number lines draw a straight line at every digit; labels inside drawings use --nova-font-chalk-draw, written maths away from drawings uses --nova-font-chalk-write (two chalk fonts, both embedded); result/position markers are a neon ring, never a star; no dark frame or box behind diagrams; no box behind the helper; no role glyphs (★ ■ ◆ ✓ ◌ ▲) attached to maths text or values (colour only; glyphs only in explicit colour-key legends); no overlaps with maths; no empty stage areas; fractions stay a neutral placeholder tagged 'approved NOVA Chalk stacked fractions' until the fraction design is decided. NEVER invent a new drawing style, filter, font, line weight or primitive: if something is missing, first propose a core addition to nova-core.js/css, then use it. FILTER RULE: Never apply bounding-box (objectBoundingBox / percentage) glow filters to straight lines, axes, ticks or grid: every glow filter uses filterUnits=userSpaceOnUse (build.py fails otherwise). F0 LESSONS LEARNED: hide developer/LaTeX/markup code from pupils (behind a collapsed 'Developer: show code' toggle); powers and exponents are small and raised top-right of the base like handwriting; every pupil-facing screen (all 4 modes, 380px and desktop) must be fully premium neon + chalk, including controls, inputs, feedback and ticks/crosses; no Inter/serif on stage maths (UI buttons/tabs may stay Inter); print fallback stays clean black-and-white. BUILD GUARD / LESSONS FROM F5 (mandatory, added 2026-10-10 after the F5 audit). 1 CORE: embed ONLY the CURRENT core, bank-v3/core/nova-core.js + nova-core.css (NOVA.version '3.0+house3.2' with the v3.6.2 drag/motion/number-line rules in HANDOVER-v3.md), inlined by build/build.py from a build/Fx-xx.src.html with @@CSS@@/@@JS@@ placeholders. Never ship a private or old copy of the core (F5 shipped a v3.4e copy with no number line and no drag kit). 2 HELPERS ONLY: draw only through core helpers (NOVA.svg.*, neonLine/Path/Box/Ring/Mark/Plot/Tile/Card, answerChip, chalkText, NOVA.numberLine, NOVA.motion.*, NOVA.ui.svgDrag). Every number line is the single core NOVA.numberLine. Never hand-draw arrows, ticks, bars, tapes or subdivisions; if something is missing, propose a core addition first. 3 FRACTIONS: every fraction value uses the core placeholder (.nv-frac-tbd tagged 'approved NOVA Chalk stacked fractions'); never a raw '3/4' string on stage. 4 PREMIUM NEON TUBE DEPTH: glass fill, lift (soft drop shadow) and glow on every main object, as in F2-01..03; never thin outlines with flat fills. At 380px the main drawing fills at least ~60% of the stage height with no empty band; in-drawing labels are at least 14 css px at 380; no ALL-CAPS micro titles inside the SVG; the stage title appears once. 5 DRAG: F2-style drag and drop wherever the maths allows: pick up (lift + glow), valid targets glow green, drop snaps, the tray is the red remove zone, anything else springs back, pieces can be re-grabbed, one drag at a time, Escape/pointercancel/blur return the piece, nothing is ever stranded, and every drag has a keyboard equivalent; ship tests/stress_<id>.js with 0 fails and 0 stranded. 6 MASCOTS: speech lines written for THIS engine and THIS step (never a generic line repeated across engines); vary poses by step from assets/helpers/pip/pack80/ (manifest.json; e.g. explain, point-left/right/down, count, show-one/two/three, compare, ruler, magnify, idea, think, question, celebrate, high-five, thumbs-up, oops, not-yet, encourage) and assets/helpers/nova-cat/pack60/ (manifest.json; e.g. explain-left/right, point-*, think, checking, success, read-tablet); Izaac (assets/helpers/teen/) is the Challenge peer (read-tablet while a question is open, idea on a hint, victory/proud after 3/3, worried after 2 wrong); Sir Bob narrates each step via NOVA.bob; inline only the poses used; every mascot <img> has alt text. 7 HYGIENE: no pupil-visible dev text (lesson IDs, 'mapping candidate', 'master candidates'; spec details go in details.nv-dev); value events {engine,key,value} with a fixed key list declared in CONFIG.events plus step/correct/hint/mode, never key undefined; grids use one roving tabindex with arrow keys; deliver one lean zip with a top folder (no reference/ copies, no unused assets). 8 SELF-QA WITH EVIDENCE: the QA report checks every rule above one by one with evidence (file + line, screenshot name, test output); a bare 'PASS' is a fail. 9 ACCEPTANCE: an engine is accepted only at Premium Edition quality, judged side by side with F2-01..F2-03 at 380px and 1280px in all 4 modes; the owner signs off each engine before the next is started.
```

## F18-01 Ruler and measuring tools

```
Build NOVA Master Visual Engine component F18-01: "Ruler and measuring tools" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-064 Scale drawings and maps (objective: Use scale factors to interpret and construct scale drawings.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: neon ruler/scales with movable object, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-02 Unit-conversion bridges

```
Build NOVA Master Visual Engine component F18-02: "Unit-conversion bridges" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-050 Time, clocks and timetables (objective: Calculate with time using 12-hour and 24-hour clocks, timetables and elapsed time.)
- Y7-051 Converting units (objective: Convert standard units of length, area and volume.)
- Y8-039 Currency conversion (objective: Convert currencies using given exchange rates.)
- Y8-043 Compound-unit conversion (objective: Convert and compare rates expressed with compound units.)
- Y9-024 Mixed compound units (objective: Solve unfamiliar problems involving compound rates.)

This engine must also provide these presets or modes (do not build them separately): F6-12 Currency and unit bridges; F18-09 Currency exchange.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: unit bridges with conversion factors, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-03 Analogue clock

```
Build NOVA Master Visual Engine component F18-03: "Analogue clock" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-040 Measuring and drawing angles (objective: Measure and construct angles accurately with a protractor.)
- Y7-050 Time, clocks and timetables (objective: Calculate with time using 12-hour and 24-hour clocks, timetables and elapsed time.)

This engine must also provide these presets or modes (do not build them separately): F11-12 Clock-face angles.

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: analogue clock with draggable hands, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-04 Timetable reader

```
Build NOVA Master Visual Engine component F18-04: "Timetable reader" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-050 Time, clocks and timetables (objective: Calculate with time using 12-hour and 24-hour clocks, timetables and elapsed time.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: timetable table with journey line, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-05 Money and change

```
Build NOVA Master Visual Engine component F18-05: "Money and change" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-061 Unit price and best buy (objective: Compare value using unit rates.)
- Y8-040 Wages, deductions and budgeting (objective: Solve problems about earnings, deductions and budgets using percentages and unit prices.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: coins/notes and change counting, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-06 Budget and payslip

```
Build NOVA Master Visual Engine component F18-06: "Budget and payslip" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y8-040 Wages, deductions and budgeting (objective: Solve problems about earnings, deductions and budgets using percentages and unit prices.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: budget/payslip neonCard with deductions, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-07 Interest growth chart

```
Build NOVA Master Visual Engine component F18-07: "Interest growth chart" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-063 Simple interest (objective: Calculate and interpret simple interest.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: simple vs compound interest bars over years, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-08 Compound measures

```
Build NOVA Master Visual Engine component F18-08: "Compound measures" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y8-041 Speed (objective: Use speed as a compound unit and solve speed–distance–time problems.)
- Y8-042 Density (objective: Use density as mass per unit volume.)
- Y8-043 Compound-unit conversion (objective: Convert and compare rates expressed with compound units.)
- Y9-022 Speed and rates (objective: Solve multi-step problems involving speed and other rates.)
- Y9-023 Density (objective: Solve density, mass and volume problems.)
- Y9-024 Mixed compound units (objective: Solve unfamiliar problems involving compound rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: compound measure triangle (density, pressure), glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-09 Currency exchange

```
Add a PRESET to NOVA Master Visual Engine component F18-02 "Unit-conversion bridges": F18-09 "Currency exchange" (Family F18).
Reason it is a preset: currency is a bridge with a rate.
Do NOT build a separate engine. Deliver: the named preset (parameters, labels, defaults, any extra mode code inside F18-02), and its entry in the family gallery.
Used in these KS3 lessons:
- Y8-039 Currency conversion (objective: Convert currencies using given exchange rates.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: currency bridge with rate, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-10 Estimating in context

```
Build NOVA Master Visual Engine component F18-10: "Estimating in context" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-006 Estimation and order of magnitude (objective: Use rounding to predict the approximate size of a calculation.)
- Y8-009 Significant figures and estimation (objective: Round to significant figures and use that rounding to estimate calculations.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: context picture with estimate ring, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-11 Bounds and accuracy

```
Build NOVA Master Visual Engine component F18-11: "Bounds and accuracy" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y8-010 Error intervals and bounds in context (objective: Describe possible values represented by rounded measurements and use those intervals in context.)
- Y9-004 Measurement error and estimation (objective: Use error intervals and estimation to reason about the possible accuracy of measurements and calculated results.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: core number line with bound brackets, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```

## F18-12 Standard-unit stories

```
Build NOVA Master Visual Engine component F18-12: "Standard-unit stories" (Family F18: Measures, Units, Time and Money).
Family covers: measuring, units, compound measures, time, money, bounds.
Used in these KS3 lessons:
- Y7-051 Converting units (objective: Convert standard units of length, area and volume.)

WHAT TO BUILD (NOVA studio spec, follow exactly, do not invent):
- Stage layout at 380px: the main drawing fills at least 60% of the stage height (taller viewBox, stacked), helper strip and controls below, no empty band; at 1280 drawing and side neon cards side by side. Main drawing: story card with unit choices, glass neon objects with lift and glow, chalk values with units.
- Animation steps (named, NOVA.motion only, reduced motion = instant end state): context appears > measure/convert step animates > value counts up > answer chip.
- Drag interactions (NOVA.ui.svgDrag + zones, F2 v3.6.2 rules: lift on pick-up, green target glow, snap, re-grab, tray = red remove zone, spring back, nothing stranded, keyboard equivalent): drag hands, coins, readings, conversion pills, bound markers into place.
- Correct in Challenge: value correct with units. Misconception-specific feedback for each wrong answer.
- Mascots (poses from assets/helpers/pip/pack80/, assets/helpers/nova-cat/pack60/, assets/helpers/teen/; see each manifest.json; caption and pose change every step; alt text on every image): Pip explain/point-down/count and celebrate on correct, not-yet + encourage on wrong; Nova ruler, count; Izaac read-tablet.
- Presets: one named preset for each lesson listed above, covering its number range and context.
- Premium polish: glass fill + lift + glow on every main object, smooth staggered transitions between steps, chalk labels >= 14px at 380, micro-celebration on correct (neonRing pulse + Pip celebrate/high-five + answerChip pop).
- Acceptance: side by side with F2-01..F2-03 at 380 and 1280 in all 4 modes it matches their depth, size, font use and mascot use; stress test 0 fails / 0 stranded; QA report gives evidence per Build Guard rule.

First give a short spec card: maths purpose, year groups, parameters, presets (cover the range the lessons above need), animation steps, interactions and what counts as correct, misconception traps it exposes, GCSE extension flag, linked components. Then build it.

[Shared standard + Build Guard: see top of this document; include it in full when pasting]
```
