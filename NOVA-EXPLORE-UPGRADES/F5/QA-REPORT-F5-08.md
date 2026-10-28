# NOVA F5-08 — BUILD GUARD & PREMIUM QA EVIDENCE

**Status:** Review candidate, not GOLD. **Canonical engine:** F5-03. **Standalone alias:** F5-08.

## 1 · Official core
core/nova-core.js SHA256 940ccb34d0bb19b2564cb0e6ed32b17f353cf725b0876c7cabcbd173a6223418; core/nova-core.css SHA256 eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4. Source placeholders: build/F5-03.src.html lines 3, 18. No private core shipped; current bank core embedded during compile.

## 2 · Shared helpers
F5-03 source grip/snap via NOVA.ui.svgDrag (line 94), NOVA.neonBox/neonRing (line 90, 192); no custom number lines or separate F5-08 renderer.

## 3 · Fraction notation
Owner-approved stacked NOVA Chalk fractions replace older TBD placeholder. stack(...) in build/F5-03.src.html line 42; stage inputs shown with chalk numerator, horizontal fraction bar and denominator.

## 4 · Premium layout
Responsive viewBox 420×880 on mobile and 1100×714 desktop, F5-03 source line 110; evidence shots/F5-08/F5-08-y7-023-380-explore.png and F5-08-y8-006-1280-explore.png; image-stage >60% as tested.

## 5 · Drag & keyboard
Native svgDrag zones and keyboard controls: source lines 94 / 92; tests/stress_f508.py + tests/f508-stress-results.json: 28/28 real pointer valid, invalid, Escape, focus and stranded-object checks.

## 6 · Tutor & mascots
Six named narration/pose steps in source line 140; Izaac via helperImg/alt at lines 175, 178; F0 Bob narration is called by core timeline, no duplicated TTS.

## 7 · Hygiene & reuse
One canonical F5-03 renderer. Named presets and event key contract at top source, lesson selector at lines 209. Current F0-12 game controller remains external. Developer specifications in collapsed native spec card.

## 8 · QA with evidence
tests/f508-results.json 152/152, f508-stress-results.json 28/28, f508-extra-results.json 28/28, f508-challenge-results.json 14/14. Screenshots all 4 modes at 380/1280 for each lesson; tests were executed on Chromium with reduced motion. Live navigation unavailable; content set in an isolated browser document.

## 9 · Acceptance
Automated quality gates met in test environment. F2-01..F2-03 direct side-by-side visual comparison NOT performed: reference F2 executable pages were not in the supplied F5-03 production package. Owner approval and NOVA lesson-shell integration remain pending.

## Mathematical coverage
Y7-023: 2/3 × 3/4 = 1/2 and unit/non-unit examples. Y8-006: 5/4 × 3/2 = 15/8, 9/4 × 3/2 = 27/8; one unit square always has b×d equal cells. Division of mixed numbers is the linked F5-09 engine and is intentionally not represented as multiplication. Equivalent exact product submissions are accepted; incorrect inputs receive error-specific feedback.

## Known limitations
F2 premium side-by-side reference pages unavailable for direct comparison; owner GOLD sign-off is not claimed. Only individual component operation checked, not NOVA full lesson-shell integration.
