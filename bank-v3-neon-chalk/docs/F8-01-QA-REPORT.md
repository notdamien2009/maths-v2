# NOVA F8-01 — Production QA report

**Classification: PREMIUM REVIEW CANDIDATE — NOT OWNER-GOLD.**

Fresh build from the F8-01 specification in `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, keeping F0–F7/F12 files untouched. The previous rejected F8 work was not copied.

## Test evidence

| Gate | Evidence | Outcome |
|---|---|---|
| Lesson coverage | `src/F8-01.js` → four data presets: Y7-018, Y8-011, Y8-012 and Y8-015 | Present |
| Mathematical correctness | `tests/math_f801.py` / `tests/math-results.json` → 214 checks, including 101 values across both symbolic identity sets and equivalent solution sets | 214/214 PASS |
| JS parse | `node --check src/F8-01.js` | PASS |
| Four modes | `tests/screenshots_f801.py` / `tests/screenshots-results.json` → 380px & 1280px, all four modes | 8/8 visual captures; no page errors |
| Layout | `tests/screenshots-results.json`: 8 mode/width combinations; `document.documentElement.scrollWidth>innerWidth+2` false throughout | 8/8 PASS |
| Mascot | `shots/F8-01-380-guided.png`, `shots/F8-01-380-challenge.png`: original F0 helper dock and Bob face; Challenge additionally displays an Izaac peer | Present, visual checked |
| Drag/drop and recovery | `tests/stress_f801.py` / `tests/stress-results.json`: real-pointer movement at 380/1280, no active orphaned drag, operation choices | Included; 56/56 overall checks |
| Keyboard alternatives | `tests/stress-results.json`: operation selection and undo for all four presets at two widths | 8/8 operation checks PASS |
| Challenge flow | `tests/stress-results.json`: 4 tasks × 3 steps at two widths, each advance requires valid operation + equivalent line | 24/24 PASS |
| Fraction typography | `shots/F8-01-380-fractions-complete.png`: stacked numerator, bar and denominator drawn with F0 chalk and neonLine | Visual inspection PASS |
| Pupil hygiene | Developer event details folded under `details.nv-dev`; internal lesson IDs limited to spec/dev area | Static inspection PASS |
| Rebuild integration | `build/build-f8-01.py`: embeds `core/nova-core.js`, `nova-core.css` without rewriting source; local simulated core build completed | PASS with recovered F0-derived gallery core; user's exact current GitHub core rebuild pending |

## Core source provenance — important

The bundled **browser-preview HTML** was assembled with the F0-derived core recovered from a prior NOVA F3 production gallery in the user's Library. This provides a functional standalone preview and maintains the common F0 appearance, sprites, fonts, timeline and drag helper. It was **not proven byte-identical** to the current `maths-v2/main` GitHub core, which has newer F12 additions. The bundle deliberately ships **no separate core files**.

For final integration, extract the ZIP into your existing `bank-v3-neon-chalk/` directory and run `python build/build-f8-01.py`: this recompiles from the actual local current core. Run the included screenshot and stress tests again after this rebuild.

## Known limits / owner review requirements

- Interactive tests used Chromium `page.set_content()` because this managed environment blocks navigation to local `file://` pages. Script execution and actual pointer/keyboard events were tested; local machine direct double-click opening still needs owner verification.
- Native physical touchscreens and physical screen readers have not been tested.
- Exact current GitHub core byte-identity and integrated NOVA lesson pages remain unverified until the local-core rebuild.
- User approval and lesson integration have not been claimed.
- Challenge uses mathematically equivalent **supplied next-line options**; it is not a general symbolic-algebra answer parser.

## Recommended owner stress test

1. Open the standalone preview and test all four modes, including Sir Bob and different mascot selections.
2. Explore all four presets at 380px, including rapid operation drags, Escape, reset, undo and moving to a new preset.
3. Complete all four Challenge exercises, deliberately trying each misconception choice.
4. Rebuild against your checked-out current core, re-run `python tests/stress_f801.py` and compare visually with F2-01 to F2-03 at 380px and 1280px.
5. Approve the component before proceeding to the F8-03 core engine and its F8-02/F8-04 presets.
