# NOVA Maths F6 Run 06 — QA Report

**Status: premium review candidate. Not owner-GOLD and not live-lesson integrated.**

## Actual verified checks

- **Math**: **100,025/100,025 PASS** (see `tests/f606-math-results.json` and corresponding Python test file)
- **Browser**: **100/100 PASS** (see `tests/f606-browser-results.json` and corresponding Python test file)
- **Stress**: **44/44 PASS** (see `tests/f606-stress-results.json` and corresponding Python test file)
- **Layout**: **32/32 PASS** (see `tests/f606-layout-results.json` and corresponding Python test file)

- **10 actual Chromium screenshots** at 380px and 1280px, covering Watch, Guided, Explore, Challenge, plus secondary soap and equal-value scenarios.
- JavaScript `node --check` PASS.
- Exact approved F0 source SHA-256 validated by standalone build script (no shared F0 edits).
- Standalone HTML compiled with current F0 CSS/JS including embedded fonts and helpers.
- Responsive checks include 380, 430, 760 and 1280 widths, product separation, side-card position, page overflow and SVG viewport bounds.
- Real mouse drag tests include drop-on-A/B, fast drags, regrab-to-RETURN, keyboard A/E/Delete and invalid drops. Browser scrolls the draggable ring into view *before* pointerdown, matching user behaviour on long pages.
- Challenge tests confirm no premature unit-price reveal, no numerical answer clues in placeholders, varied misconception feedback and gated progression.

## Deliberate limits

Native device touchscreen QA, physical screen-reader operation and integration into the full NOVA lesson engine have **not** been performed. These results are evidence for review, not a GOLD claim.

## Safety and integration

ZIP contains only F6-06 materials and no `core/` replacement. It is an incremental update. Prior families and previous F6 runs remain unchanged. **No GitHub write was performed.**
