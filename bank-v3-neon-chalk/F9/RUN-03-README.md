# F9-03 · Position-to-Term Table — RUN 03 (Premium owner review)

**Source**: `NOVA-MASTER-FOR-OTHER-AI.md`, section F9-03, Y7-037.
**GitHub**: untouched. All files are local replacements only. **Approval status**: REVIEW, not GOLD.

## Specification card
- **Purpose**: Make the direct mapping from position `n` to term `T(n)` visible. Learners apply `T(n)=an+b` to a table; position and term are distinct quantities.
- **Years**: Year 7 lesson Y7-037; Year 8 recap/GCSE bridge.
- **Preset**: `Y7-037-linear-nth-term`, `2n + 3`, values 5,7,9,11,13. Additional challenge variants `3n−2`, `4n+1`; Explore sliders `a=1..5`, `b=−5..8`, `n=1..12`.
- **Stages**: identify position → reveal rule → reveal term → map columns → jump to tenth position → generalise coefficient/adjustment.
- **Interactions**: Watch, Guided, Explore and Challenge. In Challenge, drag rule card into rule slot and term cards into cells at positions 4 and 5. Wrong drops spring home with misconception feedback. Red tray removes placed cards, re-grab supported; Enter to pick a card, Enter on empty cell to place, Delete/Backspace on placed card to remove, Escape cancels.
- **Correct**: three challenge tables solved (rule + 2 terms each), no answer leaked by side cards.
- **Misconceptions**: confuse term with position; omit `+b`; use difference as the full rule; swap positions 4 and 5; mistake the sign of the adjustment.
- **Links**: F9-01, F9-02, F9-05, F9-12. GCSE extension: `an+b` to more advanced linear rules.

## Approved visual contract followed
- Existing F0–F3 neon/chalk house drawing helpers and font; no custom SVG maths primitive or new page background.
- `data-topic=algebra` shared x/y/n texture, NOVA premium stage gradient/border and single mascot dock, matching F9-01 v3.
- Responsive two-row glass table, mapping arrows and rule pill. No duplicated helper portraits.
- The code adds **only an F9-03-scoped pointer-event compatibility bridge** for very fast mouse movement across Chrome SVG-group captures. `NOVA.ui.svgDrag` remains responsible for dragging, validation, spring-return and remove; no shared API is replaced. This resolved the observed fast-mouse stranded-card case and is documented in source.

## QA evidence
- Browser functional: **50/50 PASS**, 380px and 1280px (includes 6 teaching stages, 4 modes, backgrounds, mascot, responsive overflow, Explore and keyboard challenge checks).
- Drag/assessment stress: **24/24 PASS** at 380px and 1280px (fast pointer, wrong-rule return, remove, keyboard re-place, and complete task 1–3).
- Screenshots: all four modes at 380px and 1280px, plus all six Watch steps, in `screenshots/F9-03/`.
- The build uses `F3/F3-01-array-builder.html` for the known-working inlined shared runtime. **Do not substitute the stale standalone `core/nova-core.js`** until the upstream runtime mismatch is reconciled.
- The Python build helper is a local-only rebuild; it does not write to GitHub, nor change F0/F1/F2/F3 files.

## Install
Extract this ZIP into the existing repo so the archive's `bank-v3-neon-chalk/` directory merges with your local `bank-v3-neon-chalk/`. Open `F9/F9-03-position-to-term-table.html`. For a rebuild after installing, run `python build/build_f903.py` inside the repository. Review and approve before treating as GOLD.
