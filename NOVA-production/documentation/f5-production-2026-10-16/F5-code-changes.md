# F5 code changes (2026-10-16)

All 18 F5 engines (F5-01..F5-07, F5-09..F5-19) were changed by one reproducible script, `tools/f5/patch_f5.py`, applied to the supplied originals (`F5-originals.zip`). No artwork, drawings, fonts, colours, mascot art or layout were replaced. F5-08 is not a separate file: the master defines it as the `multiply` preset of F5-03.

## Shared core and adapter changes (the same in every engine)
1. **Embedded core v1.4 JS brought up to the current F3 core.** This adds six fixes: Watch play after a scrub resumes rather than resetting, pause stops the in-flight tween, `dragSnap` snaps from `min` (not from zero) and is grouped for a11y, and Bob speech goes through `NovaSpeechPolicy`. The core CSS was already identical to F3.
2. **Embedded lesson API replaced with the canonical `integration/nova-v2-lesson-api.js`.** The old F5 copy had no `scope.validate`, Explore control policy, action cancellation or `stepsFor`.
3. **Embedded `nova-explore-policy.js` and `nova-speech-policy.js`**, the same as F3.
4. **New `integration/nova-f5-contracts.js`.** This checks fraction, percentage and count domains in lesson records, so invalid states are rejected before rendering. F5-10 is limited to ceil(n/d) ≤ 4 wholes and denominators 2–12.
5. **New `integration/nova-f5-runtime.js`:**
   - **Challenge concealment:** when the F0-12 controller renders a question with `concealAnswers`, result-role readouts and the private answer are masked to "?". This covers text, matching stacked fractions, titles and aria-labels.
   - A narrow F0-12 question-card layout at 420px or less, plus accessible grouping roles.
   - A reserved `presets.lesson` slot, so lessons can set exact Explore/config values with the native preset schema.

## Component-level changes (original drawing code untouched)
- **F5-07, F5-09:** native steps had `title` but no `name`, so the timeline read "Step 1 of 6 · undefined". `name` now mirrors `title`.
- **F5-11, F5-13, F5-14, F5-15, F5-16, F5-17:** Guided and Watch were hard-coded to one demo example (24 / 1÷3 / 80,25 / 80,20 / 96,120 / 1÷7), so a lesson could not change the numbers (CHECK 03/04 failure). Each native step now carries value fields, with the original demo values as defaults: F5-11 `a,n,d`; F5-13 `input`; F5-14 `amount,percent`; F5-15 `original,change`; F5-16 `known,pct`; F5-17 `n,d`. Guided reads them.
