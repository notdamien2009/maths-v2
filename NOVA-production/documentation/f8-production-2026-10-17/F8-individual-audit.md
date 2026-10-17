# F8 individual audit (2026-10-17)
Each component was rebuilt from the F8 pack file (F8.zip; originals in `F8-originals.zip`). The upgrade adds hooks only and keeps the original artwork, apparatus and mascot placement. The status table is in `status-table.md`.

## F8-01 Step by step working animator: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. Working lines, operations and focus captions are lesson data checked for equivalence line by line. Teacher narration is the native preset text, which is reused unchanged, so override presets should keep the same kind of method. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-02 Inverse operations flowchart: PASS WITH LIMITATIONS
- This file runs the F8-03 engine (`NovaLessonComponent.id` = F8-03). The manifest records it under its own file id.
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 12.9 px, p10 11.7 px after resize (fresh load 12.9 / 11.7). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 2 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The machine output is computed from the gears. The inverse route has to be the true inverse of the forward route. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-03 Function machine: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 14.7 px, p10 11.0 px after resize (fresh load 14.7 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The concealed view shows the given input (or given output for reverse questions) and "?" for the result. The Guided example input (`chosen`) is lesson data. Challenge Q1/Q2 now use guided input boxes. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-04 Two way function machine: PASS WITH LIMITATIONS
- This file runs the F8-03 engine (`NovaLessonComponent.id` = F8-03). The manifest records it under its own file id.
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 12.3 px, p10 11.0 px after resize (fresh load 12.3 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 2 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Runs on the F8-03 engine configuration (engine id F8-03). Concealed view is the native Challenge view for the lesson preset. The challenge input is drawn and the output stays hidden. The Guided example uses `input`. Challenge Q1/Q2 now use guided input boxes. An earlier full run had one flaky "two original views mounted" failure (the two QA questions drew the same text); after the question set was fixed it reran clean at 47/47 twice. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-05 Both sides equation solver: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.7 px, p10 11.1 px after resize (fresh load 11.7 / 11.1). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The operation tray shows every pool operation label (for example "− 6"), so questions are written so that the answer is not a tray number. Row texts are checked against their a, b, c, d coefficients. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-06 Rearranging formulae: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.7 px, p10 11.0 px after resize (fresh load 11.7 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. Formula rearrangement is checked with the engine's own validate(make()) routine. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-07 Expression builder: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 13.5 px, p10 11.0 px after resize (fresh load 13.5 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The token expression is evaluated with the given values. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-08 Equivalence checker: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 13.5 px, p10 11.0 px after resize (fresh load 13.5 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The equivalence verdict is checked against sample-based evaluation of both sides. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-09 Substitution table: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 16.4 px, p10 11.1 px after resize (fresh load 16.4 / 11.1). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The value tray contains native distractor values, so questions avoid answers that equal a tray value. The rule text is checked against value(). Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-10 Simultaneous equations: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 2 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. By native design, the graph shows both lines. Pupils can read the intersection from the grid, so this Challenge practises reading and checking a solution rather than hiding it. The intersection must be on the drawable grid (half steps). challengeReady is true because the F0-12 flow works, but the answer can be read off the graph. Treat it as a graphical-solution exercise. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-11 Inequality solver: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 2 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The step strings and the original inequality are checked against accepts() over −9 to 9. The native reason captions are reused; they describe the operation words (for example "subtract three"), so overrides should keep the same operations. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-12 Quadratic solve routes: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. By native design, the parabola shows where it crosses the x-axis, so the roots can be read from the graph. Answers are the ordered roots "a, b". challengeReady is true because the F0-12 flow works, but the roots can be read off the graph. Treat it as a graphical-solution exercise. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-13 Index laws in algebra: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 14.6 px, p10 11.0 px after resize (fresh load 14.6 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. The factor-cancel counter shows the second index (n), so questions never ask for n. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-14 Algebraic fraction simplifier: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 9/9 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. Text answers must match exactly (format given in the prompt, for example "x+3" or "(x-4)/2"). The native regression has 9 checks instead of 12 because native Explore has no SVG drag handles (it uses HTML controls), so the three drag and focus checks do not apply. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-15 Misconception spotter: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.8 px, p10 11.0 px after resize (fresh load 11.8 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. Text answers (for example "positive" or "x<-4") must match exactly after trimming. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-16 Modelling cycle stepper: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 13.5 px, p10 11.2 px after resize (fresh load 13.5 / 11.2). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: The concealed view is the native modelling-cycle frame (context title and stage slots). The problem numbers are in the prompt only, because the native Challenge view has no numeric panel. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-17 Algebraic proof builder: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.3 px, p10 11.0 px after resize (fresh load 11.3 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: The concealed view is the native proof frame (title and empty statement/reason slots). The numeric and text questions are in the prompt. It has a fixed layout with no innerWidth breakpoint, so a 760 px breakpoint was added for the phone-label floor. Pupil interaction is select-then-place: tap a card in the HTML bank, then tap an SVG slot. QA used this route, and drag was not tested as the pupil action. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.

## F8-18 Iteration trial and improvement: PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12 · bank regression pass.
- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F8 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view for the lesson preset. It has a fixed layout with no innerWidth breakpoint, so a 760 px breakpoint was added for the phone-label floor. Answers are decimals to the number of places given in the prompt. Common to all engines: at 390 px the phone-label floor enlarges small SVG labels (up to 2.4x) so they reach 11 px. A drag in progress is cancelled when the 760 px breakpoint is crossed, because the redraw replays the last draw; completed pupil state is kept. Real speech output, screen readers and touch devices were not tested on hardware.
