# NOVA Maths F4 — Run 15: Final Core Compatibility Gate

**Run type:** additive QA + release-gate verification. **Status: review candidate, not GOLD.**

**Scope:** `notdamien2009/maths-v2` commit `48a7eb7309cb37e6f23efea5204152704f42f03c`, plus the F4 Run 01–14 review files. The tested synthetic fixture is NOT the exact GitHub F12 core.

## Why this run is needed

Run 14 supplied an isolated compatibility shim and SHA-guarded staging builder. The current GitHub shared core replaced the F2 helpers with F12 geometry kit functions and no longer defines `NOVA.numberLine`, `NOVA.motion`, `NOVA.ui.svgDrag` and the F2 place-colour helper API. Silent repinning could break F4 interactions. Run 15 adds rigorous per-engine maths checks, a Windows launch command, and **five short, individually timeout-bounded QA batches**.

## QA that was actually executed here

| Check | Result | Limit |
|---|---:|---|
| Simulated missing-helper core: 380px and 1280px, four modes, ten independent engines | **80 / 80 pass** | Does not constitute verification with exact GitHub core bytes |
| Targeted mathematics: part-whole, comparison, rods, compound percentages, % amounts, ratios, algebra, before/after, word problem and rates | **18 / 18 pass** | Sample invariants, not exhaustive proof |
| Group A through E | **5 / 5 complete** | Five raw JSON files shipped under `tests/` |
| Exact GitHub F12 core browser validation | **NOT PERFORMED** | Must run using local `core/` |
| Real fast pointer, cancellation, touch under migrated core | **NOT PERFORMED** | Separate required acceptance gate |
| Owner visual approval and NOVA lesson integration | **PENDING** | Not GOLD |

The original combined synthetic run stalled inside Chromium after six engines; independent batches A–E subsequently passed, and their full machine-readable reports are included. Failure or timeout must always be reported, never hidden or marked PASS.

## How to run against the actual GitHub core

1. Ensure your local repository has the latest `core/nova-core.js` and `.css` from commit `48a7eb7`. **Do not replace your core with an older F4 ZIP's copies.**
2. Merge the Run14 staging pack followed by Run15. Neither ZIP contains a replacement `core/`.
3. Confirm the individual F4 run source files and Run13 mobile fixes are installed.
4. From inside your `bank-v3-neon-chalk` directory in Windows, double-click `RUN-F4-RUN15-VERIFY.bat` or run:

   ```bat
   python build\build-f4-run14.py
   python tests\f4-run15-all.py
   ```

5. Review `review/F4-RUN15-ALL-RESULTS.json` and `review/F4-RUN15-BATCH-A.json` through `...-E.json`. Verify all groups passed **and** `exact_github_core: true` in every batch. A current-core mismatch **must stop** the run. Do not bypass the guard.
6. Manually inspect 380px and desktop mode screens, physically drag parts, return them, cancel midway, change presets, solve Challenge tasks, and compare against the accepted F2/F4 style. This is still required after browser/maths scripts pass.

If Playwright is unavailable, install locally using `python -m pip install playwright` then `python -m playwright install chromium`.

## Non-destructive contract

- The supplied scripts only **read** `core/`, `src/`, `F4/` and `build/` source files.
- The Run14 builder writes only into `review/F4-RUN14-stage/`. Run15 writes only to `review/F4-RUN15-*.json`.
- No existing standalone F4 engine, F5-11, source, test, master, handover, core or GitHub file is overwritten by this ZIP.
- F4-05 remains F5-11’s integrated/frozen fractional preset. F4-10 is an integrated F4-08 preset.
- `--diagnostic --allow-fixture` is a **testing-only** pathway; it can never mark the exact GitHub core verified.
- The `--timeout` group cap is intended to record a stalled browser as a **blocker**, not a pass.

## Remaining decision gate

The family can be considered a **GOLD candidate** only after the exact-current-core stage and all five Run15 groups pass, physical interaction regression is completed, and the owner visually approves it. Passing sample mathematics and smoke checks does not replace that sign-off.
