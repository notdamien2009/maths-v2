# NOVA MATHS V2 v37 FINAL — TEMPLATE COMPATIBILITY VERIFIED

**Canonical template:** `NOVA-production/00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html` and the mirror inside `NOVA-MATHS-V2-PROMPTS/NOVA-MATHS-V2-v37/master/` are byte-identical. The saved Library QUICK-ACCESS template is also identical.

**Authoritative Git blob SHA-1:** `fdafd7041240ea6d0a2603eef6ccddc66ed3bc95`.

## Verified final structure
- Seven independent sections: Start, Learn, Explore, Examples, Challenge, Practice, Exit; four-over-three navigation.
- Desktop Bob Board Watch region stays locked to exactly 700px. Page scroll is permitted; no browser zoom-out required.
- Start: 5 slots, visuals S1/S2, MCQs S2/S3.
- Learn/Bob: five concepts each in completed lessons, 4–6 beats per Bob concept; Watch-only Learn.
- Explore: separate interactive page. Examples: at most five Guided presentations.
- Challenge: one original F0-12 game; 10 core rounds and 5 available optional Stretch rounds across all concepts.
- Practice: 15 slots = Core P1–P5, Secure P6–P10, Stretch P11–P15. **Visual aids only P1, P2, P6, P11.**
- Exit: 5 slots = Core X1/X2, Secure X3/X4, Stretch X5; no visuals, hints or immediate marking.
- Header progress: **25 assessable Start/Practice/Exit questions**; F0-12 tracks Challenge rounds separately.
- JSON source contracts, slot definitions, browser validator, placeholder bank, marking and pupil-facing Exit text agree with the new counts.

## Tested on 17 October 2026
Structural assertions and Chromium rendering at 1280×900 and 390×844 passed: 7 navigation buttons, 5 Start cards, 15 Practice cards, 5 Exit cards, 4 Practice visuals, 700px desktop Bob board, standalone Challenge stage, no page JavaScript exceptions. This establishes **template-shell compatibility**, not lesson-specific numerical accuracy, full narration quality, or Challenge component binding; every lesson still needs the full Run 4 checks.

## Mandatory lesson production behaviour
Never copy the old v36.5 template or reapply a 'Practice 10 → 15' patch inside new lessons. Read the current v37 template from QUICK-ACCESS. Use original components only as immutable sources, adapt local copies to the mathematics, preserve NOVA neon/chalk styles, and run lesson-specific browser QA.

The old v35.1 derived shell and v35.3/v35.4 prompt workflow are LEGACY. Original mathematical F0–F18 source ZIPs remain unchanged. No additional named games.