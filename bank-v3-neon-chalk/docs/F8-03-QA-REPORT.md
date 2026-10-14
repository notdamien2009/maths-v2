> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# F8-03 — QA Report · Run 02

**Status: PREMIUM REVIEW CANDIDATE. NOT APPROVED GOLD.**

Fresh production from the F8-03 prompt. No existing F0–F7/F12 file is modified and no rejected F8 code is reused. The ZIP contains no `core/` replacement files.

| Gate | Reproducible evidence | Result |
|---|---|---|
| JS parse | `node --check src/F8-03.js` | PASS |
| Lesson coverage | `src/F8-03.js` → `lessons`, `window.F803_CONFIG` | Four lesson presets |
| Mathematical accuracy | `tests/math_f803.py` + `tests/F8-03-math-results.json`, including negative values, inverse round-trip and challenge targets | 610 / 610 PASS |
| Four modes at 380 and 1280 | `tests/qa_f803.py` + `tests/F8-03-qa-results.json`; captures in `shots/F8-03-*-stage.png` | 98 / 98 PASS |
| Additional screen widths | `tests/F8-03-extra-width-results.json` at 430/760/1024; Watch/Guided/Explore/Challenge | 12 / 12 PASS |
| Real SVG pointer stress | `tests/stress_f803.py` + `tests/F8-03-stress-results.json` | 22 / 22 PASS, 0 stranded |
| Source safeguards | `build/build-f8-03.py` embeds the `core` present in the local bank; no writes to `core/` or other families | Checked in preview environment |
| Actual F0 mascots | Core `NOVA.scene.helperStrip`; step-specific scripted captions and Bob narration; Izaac from inline teen helper in Challenge | Browser captured, manual reviewed |
| Visual consistency | 8 mode/width screenshots; compared against F0-02 and F2-01 reference screenshots from repository | Premium review candidate |
| Accessibility | Keyboard Enter on input/rule cards; Delete/backspace on placed cards; labelled inputs and choice cards | Browser scripted; physical screen reader not tested |
| Fraction notation | Not applicable to these four presets | N/A |
| Owner approval / lesson integration | Owner review requested; not yet integrated into NOVA live lessons | PENDING |

## Current GitHub core provenance

The standalone HTML is built with an F0-derived runtime recovered from the previously supplied NOVA F3 gallery (the same base as Run F8-01); this permits an offline preview. It has **not been proven byte-identical to the newer GitHub core**, which includes subsequent changes. To recompile with the exact current checked-out core, extract the ZIP into the folder containing `bank-v3-neon-chalk/` and execute `python build/build-f8-03.py` inside the bank. Re-run browser QA with that compiled HTML before declaring integration-ready.

## Known remaining limits

- Not tested on physical touch devices or screen readers.
- Not built into the live NOVA lesson shell.
- The dependent F8-02 inverse flowchart and F8-04 two-way presentation will receive their separate preset presentations in subsequent review runs; the fundamental inverse maths and operation model already reside in F8-03.
- Tests in the managed container run using Chromium `set_content`, not navigation to a `file://` page; user should double-click and confirm locally.
- Short Bob dialogue may require personal narration listening tests in addition to the visual checks.

**No GitHub push or remote edit.**
