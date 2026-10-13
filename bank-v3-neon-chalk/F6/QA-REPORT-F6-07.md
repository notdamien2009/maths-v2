# NOVA F6 Run 07 — Verified QA Report

**Status: Premium review candidate. No owner GOLD claim and no live lesson integration.**

## Verified test results

- Math: **131,320/131,320 PASS** — `tests/f607-math-results.json`
- Browser: **74/74 PASS** — `tests/f607-browser-results.json`
- Stress: **56/56 PASS** — `tests/f607-stress-results.json`
- Layout: **48/48 PASS** — `tests/f607-layout-results.json`

- **14 genuine Chromium screenshots** at 380px and 1280px (four modes and three additional presets), saved under `shots/F6-07/`.
- `node --check src/F6-07.js`: PASS.
- Exact inherited F0 CSS and JS SHA-256 checked; no shared-core changes.
- Standalone HTML compiled from the exact core and additive F6 source. No external libraries required.
- Real browser mouse dragging: 56/56 checks, including A/B endpoint marker snapping, snapping 1 cm copy to scale, re-grabbing A and dropping it into red return area. Verifies no stranded pointer state.
- Layout: 48/48 collision/overflow checks across 380px, 430px, 768px and 1280px with all four presets. SVG text bounding-box pairs are inspected for overlapping pupil labels.
- Browser: includes Watch, Guided, Explore, Challenge; keyboard controls; all four Challenge values; no early kilometre-answer reveal and no JS page errors.
- Mathematical assertions: includes diagonal Pythagorean route calculations and proportion scales; four named preset outputs additionally confirmed via actual browser Challenge.

## Limits

Native touchscreen/assistive technology hardware QA and integration into the current v21 NOVA lesson shell were not performed. All QA uses a local headless Chromium page loaded via in-memory page content because filesystem URL navigation is restricted by the browser policy. Review in user's actual environment is required before GOLD approval.

No GitHub edits/commits/branches. ZIP contains only incremental F6-07 files, no `core/` replacement or earlier family files.
