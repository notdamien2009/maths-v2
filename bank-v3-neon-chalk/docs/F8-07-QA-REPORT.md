> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# F8-07 Expression Builder — QA Evidence Report

**Status:** PREMIUM REVIEW CANDIDATE — not approved GOLD, not integrated into live NOVA lessons.

## Executed automated evidence
| Gate | Result | Evidence |
|---|---:|---|
| Symbolic and numerical maths | **1,014 / 1,014 PASS** | `tests/math_f807.py`, `tests/F8-07-math-results.json` |
| Four-mode browser/Challenge | **118 / 118 PASS** | `tests/qa_f807.py`, `tests/F8-07-browser-results.json` |
| Real Chrome pointer/drag recovery | **14 / 14 PASS** | `tests/stress_f807.py`, `tests/F8-07-stress-results.json` |
| Keyboard (Enter / Arrow / Delete) | **10 / 10 PASS** | `tests/keyboard_f807.py`, `tests/F8-07-keyboard-results.json` |
| Responsive width/mode matrix | **72 / 72 PASS** | `tests/width_f807.py`, `tests/F8-07-width-results.json` |

No failing checks were recorded. The browser runs are Chromium desktop emulation and do not substitute for physical device testing.

## What was actually checked
- **Maths:** the expression compiler in `src/F8-07.js` uses exact polynomial keys for integer coefficients and symbolic variable products; each lesson expression was cross-checked with independently coded arithmetic at 200 random input samples. Mutation tests reject altered signs; equivalent expanded expressions for the Year 7 perimeter and both Year 9 models are accepted. Unbalanced bracket inputs are refused.
- **Browser:** real clicks complete all five Challenge presets at **380px and 1280px**; verifies answer gating, empty-answer rejection, tab switches, console cleanliness and horizontal-overflow absence.
- **Pointer:** real mouse movements, including 1-step fast pointer moves into rail slots and off-target drops; placed-tile state and `NOVA.ui._drag` release checked on 380px and 1280px. Specific event-recovery code is local to F8-07, not core.
- **Keyboard:** Choose Year 9 eight-token preset; Enter places tile, Arrow Right reorders the placed tile, Delete removes; both viewport widths.
- **Width:** 360, 380, 430, 760, 1024 and 1280 widths, Watch/Guided/Explore/Challenge, checking SVG visibility, document horizontal overflow and page errors.
- **Drawings:** uses only F0 `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.svg.root`, F0 helper dock and motion hook; all stage text in NOVA Chalk, dark shell and role colours from existing core.
- **Narration/mascots:** `STEPS` includes six script stages and step-specific Sir Bob narration; F0 helper dock changes pose; native Izaac peer appears during Challenge.
- **Visual captures:** `shots/F8-07-380-*-completed.png` and `shots/F8-07-1280-*-completed.png` show every preset, plus guided/explore/challenge stage screens at both widths.
- **Isolation:** the ZIP includes no shared `core/` files and does not replace earlier F8/F0–F7/F12 components. No Github writes.

## Remaining acceptance gates
- Recompile this build from the owner's **current GitHub-main local F0 core** and retest all modes: the standalone review HTML embeds an earlier **F0-derived** preview runtime rather than proving byte-identical integration with current GitHub.
- Review touch scrolling, mobile Safari, native Windows Edge and physical assistive technology.
- Owner to decide whether to approve GOLD after inspecting all presets/modes.
