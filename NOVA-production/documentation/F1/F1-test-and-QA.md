# F1 test and QA evidence

Executed locally on Windows using installed Microsoft Edge through Playwright. No checks are passed solely because a file parses or opens.

- 230 purpose-specific assertions across ten approved-template fixtures: two distinct configured states, six independent Challenge questions, incorrect retry/lives/streaks, correct progression/scoring, hints/reset/confetti/badge, four Guided states, four Bob beats and desktop/tablet/mobile containment.
- 30 Challenge screenshots at 1440, 1024 and 390 pixels. Native mathematical tests inspect rendered text, SVG accessibility descriptions, values and original geometry.
- Game boundaries on all ten components: hints, loss, no false completion, reset; eight-question completion additionally exercised on F1-09.
- mathematical-interaction-checks.json: 45 checks, 45 passed. See exact named checks and measurements in the ZIP.
- motion-instance-checks.json: 47 checks, 47 passed. See exact named checks and measurements in the ZIP.
- touch-performance.json: 6 checks, 6 passed. See exact named checks and measurements in the ZIP.
- real-speech-coordination.json: 4 checks, 4 passed. See exact named checks and measurements in the ZIP.
- guided-examples.json: 6 checks, 6 passed. See exact named checks and measurements in the ZIP.
- All ten engines: native keyboard mode navigation, focused Explore hiding/disable smoke, reduced-motion endpoint, accessibility-tree capture and no automated WCAG-tagged axe violations. Incomplete axe checks, including contrast checks where reported, are retained for human review. This is not human screen-reader certification.
- Native baseline: 64 original stages. Sixty text/SVG-count states match exactly; four intentional changes remove withheld answer text from SVG titles in F1-02/F1-11. All original style blocks and font data remain unchanged.
- Actual speech start/boundary/end events, pause/resume and stop were observed with original F1-03 native motion. Guided additionally verifies future-result concealment, pause, progression and reset. This is coordination evidence, not certification of pronunciation for all voices.
- Mobile touch is browser/CDP emulation on F1-01/F1-07, with actual mathematical changes and pointer cancellation. Per-update timing samples are recorded; no universal physical-device performance claim is made.
- Every source has original motion completion/cancellation, start preview and rows/columns checks. Two original F1-01 live instances additionally exercise independent starts, pointer/keyboard interaction, reset, mobile stacking and disposal. All ten F1 sources additionally passed different live starting values, left/right keyboard isolation and exact independent reset (40 checks); one mixed original F1-01/F1-09 engine/configuration check passed. This is not every possible mixed-source combination.
- F0-03/F0-04 targeted host regression passed after adding F1 motion previews; the rest of F0 was not rerun in this family audit.

Restrictions: decimal spoken numerals containing digit 4 remain suppressed pending verified pronunciation; source-specific limits in the capability manifest apply. New authored questions require their own numerical/visual review. Tests cover the executed browser/viewport matrix, not every possible device, schema combination or future question.

Final source/template SHA-256 identities accompany the evidence. Intermediate failing runs are not included as final passes; the code-change report records actual defects repaired.
- all-independent-instances.json: 41 checks, all passed.


Fraction correction: the notation was already settled by the 14 October production release. F1-01 now uses the existing F5-04 stacked chalk/neon construction with editable n/d and exact partition snapping. The prior placeholder restriction was an audit mistake and is withdrawn. See F1-fraction-correction.md for new evidence.
