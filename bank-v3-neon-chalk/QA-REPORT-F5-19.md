# NOVA F5-19 · QA report

**Status:** Production review candidate; NOT GOLD.

## Completed checks

- NOVA shared bank `build.py`: PASS, including `F5-19` registration and current core lock.
- Standalone HTML generated using the unmodified core CSS and JS from the preceding F5-18 bank. Both SHA-256 checksums match.
- Exhaustive suite at 380px: 151 checks completed, no failed assertions.
- Exhaustive suite at 1280px: 151 checks completed, no failed assertions.
- Exhaustive suite at 320px: 145 checks completed, no failed assertions.
- The combined suite reached its 768px section and was interrupted by the browser runner timeout, **so that final section is not counted as a pass**.
- A separate final suite across 320/380/768/1280 in normal and/or reduced motion: 50/50 passed (includes mathematical equivalence and three Challenge tasks).
- Independent real chocolate-piece pointer dragging and return: 8/8 passed at 380px and 1280px.
- Direct pizza slice drag, return and Escape: passed in the exhaustive 380px/1280px tests.
- Additional 320px and 768px all-mode browser smoke: all four modes mounted without horizontal overflow or reported JavaScript exceptions.
- Desktop and mobile visual screenshots: Watch, Guided, Explore, Challenge, with both pizza and chocolate contexts.
- All six presets: correct partition counts, serving, rejection of duplicate selections, complete-whole checks, reset.
- Equivalent-fraction examples: 9/12 = 3/4; 0/n and n/n also supported.
- Keyboard Enter/Space for serving, Delete for returning, real pointer dragging and release; no stranded SVG drag in completed checks.

## Test coverage / limitations

The broad suite records 447 passing assertions across three completed widths, but a single consolidated JSON file was not written because its full run timed out on the fourth width. Supporting browser captures and scripts are provided; this is explicitly **not** an all-width exhaustive QA certification. The narrower final regression is saved as `QUICK-FINAL-QA.json` and chocolate pointer results as `CHOCOLATE-DRAG-RESULTS.json`.

Live lesson-shell integration, full accessibility inspection and independent curriculum mapping remain outstanding. Challenge answers are hidden in the stage until checking. Reduced motion is supported by the NOVA core.
