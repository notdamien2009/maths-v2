# NOVA F4 — Run 13 · Targeted Repair and Core-Compatibility Finding

**Date:** 11 October 2026  
**Status:** **Premium Review — owner GOLD approval pending.**  
**Scope:** F4-06 annotation spacing, F4-12 caption clipping, read-only core compatibility diagnostic. **Not** a family-wide redesign, and **not** a core migration.  
**GitHub operations:** **NONE**. Latest inspected Git push: `notdamien2009/maths-v2` commit `48a7eb7309cb37e6f23efea5204152704f42f03c`.

## Source provenance

- F4-06 starts from the actual Run 06 production ZIP, not a newly invented renderer. Its repository copy exists at `F4/F4-06-percentage-bar.html`.
- F4-12 starts from the actual Run 11 production ZIP, which is **local-only relative to the Git HEAD above**. Merge Run 11 before this repair if it has not already been installed.
- The only implementation changes are in `src/F4-06.js` and `src/F4-12.js`. The two standalone review HTML files were deterministically rebuilt using the original F4 core inherited from prior ZIPs. Shared core files themselves were **not changed**.
- F4-06: move the mobile contextual heading upward and drop the redundant `PERCENT` text (each scale tick is already explicitly marked `%`). The amount axis, teaching steps, challenge rules and drag controls remain unchanged.
- F4-12: replace overly long stage annotations with `Distance = rate × time`, `Match each hour to its distance`, and `Drop the rate in the first box`. Bar dimensions, arithmetic and interactions remain unchanged.

## Actual QA performed against Run 13 final HTML

| Check | Result | Evidence |
|---|---:|---|
| Two-engine mode/viewport visual smoke, source-caption existence and no JS/overflow | **48/48 pass** | `tests/F4-RUN13-VISUAL-REGRESSION.json` |
| F4-12 detailed browser maths and modes (380/1280) | **48/48 pass** | `tests/F4-12-BROWSER-RESULTS.json` *rechecked, not shipped* |
| F4-12 mathematical model assertions | **42/42 pass** | `tests/F4-12-MATH-RESULTS.json` *rechecked, not shipped* |
| F4-12 complete Challenge flows | **52/52 pass** | `tests/F4-12-CHALLENGE-RESULTS.json` *rechecked, not shipped* |
| F4-12 physical pointer/keyboard at mobile, reduced motion | **14/14 pass** | `tests/F4-RUN13-F412-DRAG-380.json` |
| F4-12 physical pointer/keyboard at desktop, reduced motion | **14/14 pass** | `tests/F4-RUN13-F412-DRAG-1280.json` |
| F4-06 physical pointer/keyboard at mobile, reduced motion | **14/14 pass** | `tests/F4-RUN13-F406-DRAG-380.json` |

**Fresh checks: 232/232 passing** for the checks listed above. The original comprehensive F4-06 browser/drag scripts and a complete four-configuration F4-12 drag rerun stalled in the test environment; **they are not counted as freshly passed**. Existing archived reports document those earlier passes, but they are not represented as Run 13 re-executions. Actual screenshots demonstrate the narrower captions and percentage-bar header at 380px and 1280px.

## Compatibility issue — NOT automatically fixed

The canonical core in the inspected Git HEAD differs from the core embedded in the earlier F4 review builds and expected by their pinned rebuild scripts:

| Core file | Core used by the original F4 HTML / builders (SHA256) | Core on current Git push (Git blob SHA) |
|---|---|---|
| `core/nova-core.js` | `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21` | `ac0b40a0bf19246ec3a9824798bd67dfe738c91c` |
| `core/nova-core.css` | `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4` | `1830cd68b3a345cbeefae69782bf2b309765d5fa` |

**Do not overwrite `core/` from Run 04 / Run 08 ZIPs. Do not remove or bypass SHA guards just to force a rebuild.** These delivered standalone HTML pages will open as built; updating source then running an older `build-f4-xx.py` against the newer Git core may intentionally refuse to proceed. A **separate approved core-compatibility migration and regression** is required before repinning the F4 family to the latest core. `tools/inspect-f4-core.py` is read-only and reports which baseline is installed; it does not fix or modify it.

## Remaining approval gates

- Real pupil-device viewing and owner visual judgement at 380px and desktop.
- Full normal-motion fast-pointer drag and touch-device re-verification following any future runtime/core migration.
- Full F4 builder compatibility after review against current core (not part of this targeted repair).
- No GOLD label until owner approval.
