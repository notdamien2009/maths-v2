# NOVA KS3 MATHS · F10-17 Graph-Matching Sorter

Status: Premium REVIEW only · GitHub not edited · Final visual approval remains with user.

## What is included
- A completely standalone HTML with approved F0 embedded core, NOVA neon/chalk typography and visuals, mascot and narration.
- Source CSS and JavaScript to allow later local replacement and incremental development.
- Screenshot evidence at 380px and 1280px for each of Watch, Guided, Explore and Challenge.
- Automated QA results in JSON and an HTML report.

## Source and specification
NOVA-MASTER-FOR-OTHER-AI.md, F10-17 graph-matching-sorter section, read from notdamien2009/maths-v2 (read-only).
Uses the corrected F10-16 single-board structure, with the cat and speech inside the main framed patterned board.
New rule: ordinary teaching writing is naked NOVA Chalk text; coloured/bordered cards are limited to actual graph apparatus and draggable equation/story cards.

## Presets (all six required)
- Y8-023 · Y-intercept and y=mx+c
- Y8-032 · Comparing linear and quadratic relationships
- Y8-033 · Graphical problem solving
- Y9-012 · Linear versus quadratic modelling
- Y9-015 · Piecewise and non-standard graphs
- Y9-020 · Direct and inverse proportion

Each preset has three genuine Cartesian graphs and three matching equation/story cards: 18 matching pairings in total.

## Modes
- Watch · 15 animated/narrated named demonstration stages using the shared NOVA shell timeline.
- Guided · same stages with step navigation and prompts.
- Explore · six selectable matching sets; drag, choose card/graph with keyboard, remove to red tray, re-grab matched items; move on-graph read-point marker via keyboard or core SVG drag.
- Challenge · 12 marked tasks with graph A/B/C selection, drag-to-graph support, hints and misconception-specific feedback.

## Accessibility / quality
- Diagram axes and data correspond to actual mathematical rules.
- Keyboard matching via select card followed by matching graph; token shortcuts 1/2/3; Escape cancels dragging; pin moves with left/right arrows.
- On mobile, cards auto-scroll the page during a held drag near the screen edge, allowing the tray below the scene to reach graph targets above.
- One mascot dock directly in stage, no second framed learning row.
- No horizontal overflow at 320,380,768,1280 widths; respects reduced-motion.
- Static printable rule descriptions available via print CSS.

## Automated evidence
- Responsive/mode/stress checks: 80/80 passed
- 18 curriculum matches, completeness, keyboard, drag, JS checks: 29/29 passed
- Every delivery is a REVIEW. These tests do not replace user visual and device stress tests.
