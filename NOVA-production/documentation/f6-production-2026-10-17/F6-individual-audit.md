# F6 individual audit (2026-10-17)
Each component was rebuilt from the pack file `/workspace/codex-f6/f6pack.zip`; the upgrade adds hooks only and keeps the original artwork and apparatus. The **status table** is in `status-table.md`.

## F6-01 Ratio table — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 12.5 px, p10 11.0 px after resize (fresh load 12.5 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [689]; F6 data.lesson hook (concealed view: step cap 1) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native step-1 view (capped there), which shows only the known pair and "?" cells. The relationship card shows y/x as a rate, which is a given, not the answer.

## F6-02 Double number line — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.9 px, p10 11.9 px after resize (fresh load 11.9 / 11.9). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [680]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Phase 0 and the concealed view use the native Challenge view, which labels only 0 and the known pair on the bottom line. From native step 3 ("both lines stretch") onwards the full bottom scale is labelled by design, so the answer is visible from phase 2.

## F6-03 Sharing in a ratio — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 12.1 px, p10 11.1 px after resize (fresh load 12.1 / 11.1). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; step 5/6 captions computed from the ratio (were fixed to the 2:3 £30 example); 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view (total and parts, shares "?"). The step 5 and 6 captions now come from the drawn ratio; they had been fixed to the 2:3 / £30 example.

## F6-04 Simplifying ratios — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.3 px, p10 11.0 px after resize (fresh load 11.3 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view at step 2. Answers are text (for example 2:3).

## F6-05 Recipe scaler — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.4 px, p10 11.0 px after resize (fresh load 11.4 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view (start and target servings, factor, every new amount "?").

## F6-06 Best-buy comparer — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.9 px, p10 11.0 px after resize (fresh load 11.9 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view. The lesson answer is pack A’s pence per comparison amount; the native verdict (best buy) is not used as an answer.

## F6-07 Map and scale drawing — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view. The ruler and scale bar stay visible (they are the apparatus), so the questions avoid answers that appear as ruler or scale-bar numbers.

## F6-08 Direct proportion graph — PRESET ONLY – NOT RUNNABLE
- Config-only preset for F10-05. That host engine is not in this codebase, so there is nothing to mount, wire into F0-12 or test. The file is delivered unchanged.
- challengeReady: **false**. productionReady: **false**.

## F6-09 Inverse proportion rectangle — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [1000]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Phase 0 and the concealed view use the native Challenge view; native step 0 states y for the start width. The questions avoid answers that appear as axis numbers.

## F6-10 Speed-distance-time — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [1000]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Phase 0 and the concealed view use the native Challenge view (the covered unknown). The leg values come from the lesson state. The native view shows the vehicle 60% of the way along (for example 90 km at 1.8 h). That position is consistent with the question but is not the answer, so the speed can still be worked out from it.

## F6-11 Rates-of-change tank — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 11.0 px, p10 11.0 px after resize (fresh load 11.0 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [1000]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; 10 F3 core fixes applied.
- Limitations / notes: Phase 0 and the concealed view use the native Challenge view. The graph end-point (for example 64 cm at 8 min) is a given, so pupils can work out the gradient.

## F6-12 Currency and unit bridges — PRESET ONLY – NOT RUNNABLE
- Config-only preset for F18-02. That host engine is not in this codebase, so there is nothing to mount, wire into F0-12 or test. The file is delivered unchanged.
- challengeReady: **false**. productionReady: **false**.

## F6-13 Proportion in geometry — PRESET ONLY – NOT RUNNABLE
- Config-only preset for F14-11. That host engine is not in this codebase, so there is nothing to mount, wire into F0-12 or test. The file is delivered unchanged.
- challengeReady: **false**. productionReady: **false**.

## F6-14 Ratio and fraction translator — PASS WITH LIMITATIONS
- Tests: semantic 47/47 · native regression 12/12 · resize 390/1024/1440 12/12.
- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **true**.
- Phone (390): label median 12.4 px, p10 11.0 px after resize (fresh load 12.4 / 11.0). Pupil state kept on 1440→390→1440 in Explore and Challenge: yes.
- Build changes: canonical lesson API + F6 support scripts; relayout: 1 draw(s) recorded, breakpoints [760]; F6 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind; step 4/5 captions computed from the ratio (were fixed to 2:3); 10 F3 core fixes applied.
- Limitations / notes: Concealed view is the native Challenge view with the fraction dock hidden, so no option shows the answer. The step 4 and 5 captions now come from the ratio; they had been fixed to 2:3.
