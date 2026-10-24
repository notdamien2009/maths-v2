# NOVA English Clean Master v2.0 — engineering QA summary

Date: 24 October 2026

## Inputs and scope
- Approved lesson reference: `NOVA-ENGLISH-Y7-001-READING-DETECTIVE-CHALLENGE-v1.0-REVIEW.html`.
- Challenge allocation reference: Y7–Y9 v1.1 Word Study **draft** (256 lessons, including 16 spelling/word-study families).
- User-approved decisions preserved: seven-stage single Learn, 750px desktop Bob Board, royal-blue theme, stationary boxed Pip/Nova/Izaac mascots, full Nova reading sprite, website selection/lock interface.

## Structural checks executed
- Master lesson JSON is valid, has `meta.templateMode=true`, and contains no Y7-001 reading sources/assessments in its lesson data.
- Original Y7-001-specific Practice/Exit passages removed from reusable runtime and replaced by `practiceSources[]` / `exitSources[]` lesson data.
- Original Y7-001-specific Explore cases, mascot model scripts and Reading Detective bank removed from runtime; newly inserted modules use lesson data.
- JavaScript syntax check passed for all embedded executable scripts.
- Empty master in-memory browser rendering passed at 1360px, 1024px and 390px; zero observed browser exceptions and zero horizontal page overflow.
- Populated regression instance loaded all seven lesson stages at 1360px and 390px, with no observed page JavaScript exceptions or horizontal overflow.
- Explore mission: selected option, checked answer, advanced to next concept — passed.
- Challenge: choice, exact-line evidence, submitted writing, criteria self-check, completion with `writingPendingReview=true` — passed.
- Spelling word bank challenge: typed recall on two sample words, completion summary includes stable bank ID — passed.
- Insertion validator: rejected an empty/unready data file; passed structural preflight on a populated four-concept fixture.

## What the tests do NOT prove
- Real audible Ryan narration or beat-level sound sync; student audio/voice controls remain subject to browser and site availability.
- Website-origin persistence, account-scoped progress, role-gated hand-in or spelling retake history; in-memory browser test is not a deployed integration test.
- Full accessibility/keyboard/screen-reader and reduced-motion assistive-technology acceptance.
- Specialist teaching and UX of every other Challenge family — the common renderer has not replaced the need for pilot designs and QA.
- Comprehensive pedagogical/marking audit of future lesson data.

## Release label
**Controlled production candidate — NOT GOLD or mass-production certified**. Use for a second representative lesson pilot after reading its contract and performing Run 1–4. Do not deploy directly or push to Git without user review.
