<!-- HISTORICAL RUN NOTE: The current production authority is 00-master/nova-master.html and HANDOVER-v4.md (11 October 2026). Old statements that a build was not yet on GitHub describe the original ZIP delivery only. Owner review/GOLD status must be rechecked; this file is retained for provenance. -->

# NOVA Maths · F10-01 Four-quadrant Grid · Premium Edition REVIEW

Status: **BUILT / QA-PASSED / AWAITING OWNER APPROVAL**. No GitHub changes have been made.

## Preview

Open `F10/F10-01-four-quadrant-grid.html` directly in a browser. This is a fully self-contained HTML file with the authentic embedded NOVA core, fonts and helper artwork taken from the current premium F3-01 project reference. No network connection or development server is required for playback.

The editable build source is `build/F10-01.src.html`. It uses `@@CSS@@` and `@@JS@@` placeholders, exactly as in the project build architecture. Rebuilding it inside your local repository with `tools/rebuild_F10-01.py` embeds **your own current** `core/nova-core.css` and `core/nova-core.js` and writes the finished HTML into `F10/`. No modifications to any F0–F3 file, central core, or `build/build.py` are required.

## Approved house references

- F0-01: token and maths-colour language.
- F0-02: neon-tube drawing and NOVA Chalk writing.
- F0-03: timeline and NOVA motion, reduced-motion fallback.
- F0-04 and F2 v3.6.2: core `svgDrag` with snap/cancel recovery.
- F0-07/08/11: events, Bob and checking.
- F0-14: plotting and axes; NOVA.svg.axes / NOVA.neonPlot.
- F2-01..03 and F3-01: premium stage depth, mascot dock, layouts and pupil controls.

## Built teaching purpose

Explain how to read and plot ordered pairs `(x, y)` in all four quadrants. Learners see the positive/negative axes; move from the origin **across first, then up/down**; plot A(3,2), B(−4,3), C(−2,−3), D(4,−2); then read every plotted point. The grid has exact unit spacing and correct signs.

### Four lesson presets

| Preset | Visual |
|---|---|
| Y7-038 | Four-quadrant coordinate practice |
| Y8-024 | Straight-line points and an overlaid graph |
| Y8-066 | Scatter points and best-fit trend, with secondary points |
| Y9-009 | Coordinates linked to a negative-gradient algebraic relationship |

Watch and Guided teach the canonical Year 7 four-quadrant story. Explore switches the named lesson presets. Challenge checks three exact-coordinate placement tasks.

## Functional controls

- Four integrated core modes: **Watch, Guided, Explore, Challenge**.
- Seven named teaching steps with Bob narration, core timeline replay/step/scrub and context-specific mascot text.
- F2-style core draggable point with grid-centre snap; arrow-key and Home alternatives; explicit coordinate steppers and resets.
- Three scored coordinate placements, misconception-specific feedback, hints and Izaac Challenge reactions.
- Keyboard-operable tabs, selectable presets, accessible point descriptions and F0-style print fallback.
- Correct `value`, `step`, `mode`, `correct`, `hintUsed` events.

## Local installation (nothing is pushed)

Extract the ZIP and copy the **contents** of its `bank-v3-neon-chalk/` folder into your existing local folder of the same name. Preview the HTML under `F10/` before updating GitHub. When ready to use the latest local core, run from the project root:

```bash
python tools/rebuild_F10-01.py
```

The installer deliberately does **not** edit the central build registry or Git. Any registry integration happens only after approval.

## QA evidence

`QA-REPORT-F10-01.md` links each acceptance gate to evidence. Automated Playwright/Chromium QA executed 32/32 passing checks at 380px and 32/32 passing checks at 1280px (regular + reduced motion). Script `tests/f101-qa.py` is included; tests may need Playwright + Chromium installed locally.

**Owner sign-off remains pending.** This is a premium review candidate, not an automatically approved GOLD component.
