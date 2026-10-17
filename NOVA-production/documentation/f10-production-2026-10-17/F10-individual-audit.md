# F10 individual audit (2026-10-17)
Each component was rebuilt from the F10 pack file (F10.zip; originals in `F10-originals.zip`). The upgrade adds hooks and keeps the original artwork, apparatus and mascot placement. Where a native bug or an answer give-away was found, a minimal anchored engine patch is listed under build changes. The status table is in `status-table.md`.

## F10-01 Four Quadrant Grid: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: all points plotted with letter labels; coordinates are not written beside the points) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Questions ask for horizontal/vertical distances, perimeters and areas read from plotted points; the pupil reads coordinates from the grid, which is the skill. The concealed view is the native board with the helper text only (no measurements).

## F10-02 Shape on Grid: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.7 px, p10 11.7 px after resize (fresh load 11.7 / 11.7). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: source shape and rule only; the image is not drawn) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Image coordinates are asked as "x, y" (answerType coordinates). Source vertices are visible by design; questions were chosen so no answer coordinate appears in the source labels or evidence panel.

## F10-03 Midpoint and Distance: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 15.1 px, p10 15.1 px after resize (fresh load 15.1 / 15.1). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: both points and the segment; no construction, midpoint or distance) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Midpoint and distance answers use decimals or values off the axis labels; reading the end points is the skill. Concealed view shows the line only.

## F10-04 Table to Graph Plotter: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 13.2 px, p10 13.2 px after resize (fresh load 13.2 / 13.2). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: rule, table rows and plotted points; the asked value lies outside the table) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Table values are given; the hidden column is the plotted point set. Native step renderer forces its own preset, so Guided phases use a custom call into the same scene function.

## F10-05 y = mx + c Explorer: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 12.4 px, p10 12.4 px after resize (fresh load 12.4 / 12.4). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; engine patch: Challenge task-0 rule text is built from the drawn gradient (was fixed to y = −x + c; identical for m = −1); relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view (line and crossing, values hidden); direct-proportion presets use the F6-08 'y = kx' view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Hosts all four F6-08 presets (Y7-060, Y8-035, Y8-036, Y9-020) natively; Challenge rounds 1-4 are those F6-08 rounds. Engine patch: the task-0 caption now prints the lesson's own gradient (native always printed y = −x + c). Proportion presets force c = 0 in the contract. F6-08 hosting is also checked by a dedicated host test (test-f6-08-host.cjs).

## F10-06 Gradient Visual: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 13.0 px, p10 13.0 px after resize (fresh load 13.0 / 13.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: line through A and B, rise/run triangle hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Gradient is read from two marked points on the grid; rise and run are hidden until marking. The concealed caption with A and B coordinates shows in a standalone mount, but the template game hides the helper-strip caption, so in the game the pupil reads A and B from the grid (all at whole-number grid points). Rounds 1-3 (and 4-5) share the same visible text and differ only in the plotted points; the 'each round shows its own apparatus' check therefore counts drawn SVG geometry as well as text.

## F10-07 Parallel and Perpendicular Lines: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.4 px, p10 11.4 px after resize (fresh load 11.4 / 11.4). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: line A only, line B hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Parallel/perpendicular gradients are asked from the given line; the comparison line is not drawn in the concealed view.

## F10-08 Graph Intersections: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: both graphs drawn, intersection markers hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Intersections are asked as "x, y" (coordinates). Reading the crossing from the graph is the skill, so an accurate drawing necessarily shows it; the numeric evidence panel is hidden.

## F10-09 Real Life Graph Interpreter: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: graph and units, data markers and read-off guides hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Real-life graph readings; the graph must be visible to read. The native geometry is fixed at load from matchMedia (760 px); relayout replays the draw, covered by the resize suite.

## F10-10 Distance Time Graph: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 12.1 px, p10 12.1 px after resize (fresh load 12.1 / 12.1). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: the whole journey, no read-off guide) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Distance-time speeds and stops; reading the graph is the skill. Round titles come from the lesson title field. Geometry fixed at load from matchMedia (760 px), replayed on relayout.

## F10-11 Speed Time Graph: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.7 px, p10 11.7 px after resize (fresh load 11.7 / 11.7). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: graph and signed areas, no read-off) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Speed-time accelerations and distances (area); reading the graph is the skill. Geometry fixed at load from matchMedia, replayed on relayout.

## F10-12 Quadratic Grapher: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: the curve, with roots, vertex and symmetry line hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Quadratic turning points/roots/values; the curve is visible, so roots can be read from the graph (the skill). Numeric evidence hidden until marking.

## F10-13 Cubic Reciprocal Exponential: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.7 px, p10 11.7 px after resize (fresh load 11.7 / 11.7). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: the curve, numerical landmarks hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Cubic/reciprocal/exponential values at stated x; the curve is visible. Expected text uses the native equation labels.

## F10-14 Graph Transformer: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 14.4 px, p10 14.4 px after resize (fresh load 14.4 / 14.4). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [350, 760]; F10 data.lesson hook (concealed view: native Challenge view: ghost and transformed curves, turning point and roots hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Transformation answers: turning point as "x, y" or y at a stated x. The equation is shown (it is the given); turning point, symmetry, roots and intercept readouts are hidden.

## F10-15 Inequality Region Shader: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.3 px, p10 11.0 px after resize (fresh load 11.3 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; engine patch: inequality text uses the sign of the constant (native showed y ≤ −x − 2 for y ≤ −x + 2); the test-point verdict is hidden in an unmarked Challenge; engine patch: inequality text uses the sign of the constant (native showed y ≤ −x − 2 for y ≤ −x + 2); the test-point verdict is hidden in an unmarked Challenge; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: boundary only (phase 1), no shading or membership label) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Yes/no membership of a test point. The concealed view draws the boundary only (no shading). Engine patches: inequality text now uses the sign of the constant (native printed y ≤ −x − 2 for y ≤ −x + 2), and the test-point verdict is hidden in an unmarked Challenge.

## F10-16 circle on a grid: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 12.6 px, p10 12.6 px after resize (fresh load 12.6 / 12.6). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: r = ? and no distance readout) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Radius is read from the grid (r = ? in the concealed view); questions ask for diameter, area or circumference. Two rounds share a preset with different radii, so 5 of 6 rounds have distinct text (the drawing differs in all 6).

## F10-17 graph matching sorter: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.3 px, p10 11.3 px after resize (fresh load 11.3 / 11.3). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; engine patch: focus trail now receives the path data (native passed the SVG group, logging an SVG error per draw); relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: no match marks, no selected graph, no proof caption) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Choice answers (A, B or C). The answer letter is necessarily one of the visible graph labels, so concealment is checked as: no matched, focused or selected graph and no proof text. Lessons choose a preset only. Engine patch: the focus trail receives path data (native passed an SVG group and logged an SVG error on every draw).

## F10-18 Piecewise and Non standard Graph Builder: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; engine patch: segment trail now receives the path data (native passed the SVG group, logging an SVG error per draw); relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: gradients m = ? and the reading line hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Piecewise readings use half-step x values; open/closed endpoint questions ask for "a, b" (ordered). Engine patch: segment trail receives path data (native logged an SVG error on every draw).

## F10-19 Trigonometric Graph Explorer: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; engine patch: the asymptote note is hidden in an unmarked Challenge (it gave away tan 90° = undefined); relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: angle readout and values hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Trig values to 2 d.p., max/min as "a, b", and tan 90° = undefined (text). Engine patch: the asymptote note is hidden in an unmarked Challenge (it gave away "undefined").

## F10-20 Tangent and Area under Curve Estimator: PASS WITH LIMITATIONS
- Tests: semantic 48/48 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F10 support scripts; engine patch: the over/under note is hidden in an unmarked Challenge (it gave away the concave answer); relayout: 1 draw(s) recorded, breakpoints [760]; F10 data.lesson hook (concealed view: native Challenge view: tangent gradient, trapezium estimate, true area and error hidden) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Tangent gradients, trapezium estimates and over/under (text). The native scene had no draw hook, so it is recorded for relayout via the build's rec list. Engine patch: the over/under note is hidden in an unmarked Challenge. Area and over/under questions use revealed phase 9/12 so their revealed views show the trapezia (phase 5 showed only the tangent and made two views identical).

## F6-08 Direct proportion (preset row): hosted by F10-05
- F6-08 is a configuration-only preset. Its four presets (Y7-060, Y8-035, Y8-036, Y9-020) are native presets of F10-05 and are mounted with `data.lesson.state.preset`.
- F10-05 Challenge rounds 1-4 are exactly these presets (answers 18, 24, 15, 9; the concealed view shows y = kx). challengeReady: **true** (follows F10-05).
- Dedicated host test `integration/qa/test-f6-08-host.cjs`: 22/22 (host handshake, preset parity with the F6-08 file, each preset mounts through the template as y = kx through the origin, concealed view shows y = kx, c ≠ 0 rejected).
- Row patch: `integration/F6-08-adapter-row.F10.json`.
