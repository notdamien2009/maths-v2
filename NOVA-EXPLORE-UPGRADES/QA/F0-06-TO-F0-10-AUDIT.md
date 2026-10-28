# NOVA Maths V2 — Sequential Explore Upgrade Audit F0-06 to F0-10

**Status:** Development candidates only; NOT production approved.  
**Branch:** `nova/explore-f0-f18-vnext-2026-10-28`  
**Master protection:** All edits exclusively under `NOVA-EXPLORE-UPGRADES/`; no edits to `NOVA-production/`.

## File-by-file findings and changes

| Component | What was improved |
|---|---|
| F0-06 | Reroll selection limited to visible questions; duplicate-safe deterministic rerolls; reproduce-set experiment. |
| F0-07 | Predict shaded numerator from fraction and total parts; handle impossible subdivisions; cancel pending redraw timers and listeners on teardown. |
| F0-08 | Predict rounding result with existing rounding model; correct stale aria-pressed when preset and narration line change. |
| F0-09 | Validation feedback in Explore now unscored; exercise invalid mode and repair, report all manifest errors and restore. |
| F0-10 | Topic-aware search, clear-filters, empty-results message, live count, print toggle sync. |

## Verified source identities

- **F0-06** `F0-06-seeded-randomiser.html`: original Git blob `331526453d23e4121cfaf84c42f5553ebdf5b461`; upgraded Git blob `7c3b90e6da5ab734e35609ca03b1785290c86a55`.
- **F0-07** `F0-07-state-events.html`: original Git blob `4d471bcbcddeac525ea429c9170841791cb268e6`; upgraded Git blob `ebc24b93bb40113ed8fbb929733e76ffd6339cd7`.
- **F0-08** `F0-08-narration-hooks.html`: original Git blob `3a6255c6d732bf06d49286be862cacdea0c234c6`; upgraded Git blob `019d838ccb59021fcd2589c113bed1be34358f84`.
- **F0-09** `F0-09-registry-manifest.html`: original Git blob `a5591652c1de1656070e182db1f15aeca780cae8`; upgraded Git blob `abfd50348f73f71970e2e67114bb15c20efd6824`.
- **F0-10** `F0-10-gallery-shell.html`: original Git blob `aa2243a1b841958277a6b3788e28e5f5eb05ed24`; upgraded Git blob `3c70d38a9ef953d16c70157bdda578f58a4a962b`.

- Current GitHub source blobs matched archived original bytes before each edit.
- All five candidate blob SHA values exactly matched the locally browser-tested HTML.
- All Challenge functions and all downstream bytes after Challenge begin were preserved.
- All other source components in this batch's branch remain unchanged.

## Browser QA actually completed

Tested each candidate standalone in Chromium using desktop **1100px** and mobile **390px** viewports. No page-script exceptions; no document-level horizontal overflow. All four native tabs (Watch, Guided, Explore, Challenge) opened and Explore could reopen.

**F0-06:** Re-roll Q3 altered Q3 alone (Q1, Q2, Q4–6 untouched); Verify same seed reproduced six questions; reducing count disabled out-of-range re-roll options. Passed at both widths.

**F0-07:** Enter-key prediction correctly accepted three shaded out of four for target 3/4; incorrect two-shaded answer received targeted feedback; native shade and Check remained accessible. Passed at both widths.

**F0-08:** 65 rounded to the nearest 10 = 70 accepted through Enter; chosen 100 unit reflected aria-pressed; changed preset synchronised round-to selection; Say line synchronised line selection. Passed at both widths.

**F0-09:** Valid manifest recognised; deliberate invalid mode flagged; selecting watch repaired it; restore preset returned valid state. Passed at both widths. Explore validation intentionally no longer uses `api.check()` (no score for investigation).

**F0-10:** An unknown query displayed no-results and count 0; Clear filters restored 17 components; topic text search returned matching components; controls functioned at both widths.

## Acceptance gates not yet completed

- Screen-reader manual/automated accessibility audit, full keyboard pathways, physical touch/device testing.
- Audio and speech-synthesis behaviour, especially F0-08 narration.
- Cross-browser checks beyond headless Chromium.
- All mathematics/control state permutations across every preset and configuration.
- Maths V2 lesson-embedded runtime integration, hand-in/results and persistence regression.

Do not mark GOLD or transfer into live lessons before these gates pass.

## Next sequential batch

F0-11 Assessment → F0-12 Game Wrapper → F0-13 Worked Examples → F0-14 Axes/Plotting → F0-15 Interactive Table.
