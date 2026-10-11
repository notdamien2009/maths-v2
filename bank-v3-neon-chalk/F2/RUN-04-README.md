<!-- HISTORICAL RUN NOTE: The current production authority is 00-master/nova-master.html and HANDOVER-v4.md (11 October 2026). Old statements that a build was not yet on GitHub describe the original ZIP delivery only. Owner review/GOLD status must be rechecked; this file is retained for provenance. -->

# F2-05 — Abacus / Gattegno Chart — Premium Review (Run 4)

**Status:** Premium Review for owner testing, NOT GOLD. GitHub has not been changed.

## Installation

For visual review, open `F2/F2-05-abacus-gattegno-chart.html` in a modern browser.
If accepted, copy **only this HTML** into the matching `bank-v3-neon-chalk/F2/` folder. All other files in `review/F2-05/` are traceable sources and QA evidence, not replacements for the NOVA shared core.

## Premium maths-teaching changes

- Exchange ten beads for one on the next rod in four *real* controllable physical stages: count, collect and hold `10 = 1`, fly to the next place and confirm the unchanged total. Reverse breakdown makes one larger bead into ten smaller ones.
- Step-synchronised mathematical captions and optional Why? explanation. Live chalk-style place-value breakdown and standard-form total stay linked to the original NOVA glass beads.
- Abacus per-rod reset, keyboard + / − / E / B and focus retention, drag between rods, tray flicks, undo/redo and optional automatic cascading exchange.
- Gattegno tiles update selected contributions and the combined value. ×10 and ÷10 genuinely move tiles between place-value rows; invalid shifts are rejected with explanation. Tap, drag and keyboard all work.
- Optional Show value, Before/after, guidance reduction, 0.5×/1×/2× speed, pause/play, step and replay. Event history is collapsed and expressed in human-readable language.
- Original NOVA neon drawing functions, colours, chalk font data, glass beads, Gattegno tiles, helper imagery and Watch/Guided/Explore/Challenge remain in place.

## QA — executed, not asserted

**83/83 tests pass**, with zero JavaScript errors. `review/F2-05/QA/qa-results.json` contains the results and `tests/qa_f205.py` provides the browser regression script. Captures include all four modes at 380px and 1280px, plus the real paused exchange phases. The tests cover integer/decimal equivalence, carry and reverse exchange, keyboard tap/drag, fast diagonal flicks, Escape cancellation, pointer release, undo/redo, mouse interaction, playback, replay, no horizontal overflow, and Challenge marking availability.

Run locally from the `review/F2-05/` folder (requires installed Python Playwright and Chromium):

```
python build/build_f205.py
python tests/qa_f205.py
python tests/capture_phases.py
```

## Provenance and limitations

- Base file from the user's older `bank-v3-neon-chalk` archive. During production, the F2-05 engine script and embedded core were checked against current GitHub; they matched the current engine/core code fingerprints. Some surrounding HTML bytes may differ from the latest Git version. The base source is included in `review/F2-05/source/F2-05-original.html` and the build manifest includes SHA-256 values.
- All modifications apply to the F2-05 standalone file only. No repository, GitHub or other engines were changed.
- Full mobile visual clarity of the *original* 54-cell Gattegno SVG remains constrained by its original 600-wide diagram. The user requested no drawing/layout rework in this upgrade, so we have not redesigned those cells.
- Automated browser QA is a review gate, not a substitute for owner visual/stress-test approval.
