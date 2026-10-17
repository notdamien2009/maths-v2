# v37.3 TEMPLATE PREFLIGHT — APPROVED CHALLENGE LAYOUT TARGET

Template: `NOVA-MATHS-LESSON-LAYOUT-TEMPLATE-v37.3.html`, revision from v37 final. Source hash in `MANIFEST-v37.3.json`. Unchanged: 7 pages, navigation 4+3, Learn Bob area 700px desktop, S1/S2 & P1/P2/P6/P11 aid slots, Start5/Practice15/Exit5 and 25 assessment count. Original F0/F2/F5 source archives not modified.

## The original template bug
The role-based iframe preparation function previously treated the F0 game controller as a mathematical SVG frame, forcing `html,body{width:760px}` inside it. Combined with two separate nested game/visual surfaces, this left the original controller at ~3/4 width and a contrasting outer container. The v37.2 lesson was repaired by a lesson-local override but the canonical v37 template still invited the same regression.

## v37.3 contract
`challengeController` gets a responsive, full-width original source iframe with native HUD/question/results. `challengeVisual` gets a full-width original apparatus host. Both are inside `#novaLessonGame` and dark `#071929`, including input/feedback; the outer shell uses a single subtle blue border, no off-green card. No manually triggered challenge-start gate; `renderChallenge()` automatically starts on first page entry when a valid lesson bank and original F0 source exist. Template placeholder without original source must not fake a game.

## Required acceptance check
In a populated lesson compare bounding boxes: `#novaLessonGame`, `iframe.nova-f012-native-controller`, `.nova-challenge-visual-area` and iframe document `html` all match inner available width within 2px. Use 1280×900 and 390×844. Native F0 `hud`/`qcard` fill iframe width and are visibly rendered. Check same `rgb(7,25,41)` background across controller and component host. Exactly one controller; zero `#novaChallengeBegin`; no duplicate HUD. Use screenshots at Question 1, after wrong and after correct. Completion and Stretch separately. All real QA required, not a structural-only success.

The template contains **the routing/container infrastructure, not a replacement F0-12 game**. In Run 3 embed the actual original verified `F0-12.html` and mathematical component sources from original NOVA Production archives. Never assert the generic unpopulated template itself implements a playable Challenge.
