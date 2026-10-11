# NOVA F4 Run 16 — Physical-drag acceptance and exact-core gate

**Status: TEST HARNESS DELIVERED — exact current-core acceptance PENDING. Not owner GOLD.**

## Purpose
Runs the *original* F4 pointer-drag and cancellation regression scripts against Run 14's **staged**, SHA-checked HTML, in independent temporary directories. Also chains the full Run 15 browser and maths checks. No test rewrites `F4/`, `core/`, `src/`, `build/F4*.src.html`, or GitHub.

## Exact source baseline required for official acceptance

- Git repository: `notdamien2009/maths-v2`
- Inspected Git commit: `48a7eb7309cb37e6f23efea5204152704f42f03c`
- `core/nova-core.js` Git blob: `ac0b40a0bf19246ec3a9824798bd67dfe738c91c`
- `core/nova-core.css` Git blob: `1830cd68b3a345cbeefae69782bf2b309765d5fa`
- The SHA guard refuses unknown core revisions. If GitHub is updated, **stop and audit**; do not bypass or edit hash values.

## Contents (incremental)

- `tests/f4-run16-physical-verify.py`: SHA-guarded test runner, per-test deadlines, temporary isolation and machine-readable report.
- `tests/f4-run16-cases/`: original owner review test scripts from prior F4 production ZIPs (11 pointer and cancellation scripts, plus F4-01's combined QA script), copied unchanged. Chromium launch path is adapted only inside the temporary runtime copy for Windows compatibility.
- `RUN-F4-RUN16-PHYSICAL-VERIFY.bat`: runs Run 14 build, Run 15 exact-core browser/maths batch suite, then Run 16 real pointer suite.
- `docs/F4-RUN16-CASES.json`: test provenance and engine mapping.

## Existing artifacts required

Run 14 and Run 15 must already be merged into the local bank. Run 13 repaired F4-06 and F4-12 should also be present. The staging build must contain F4-01..F4-04, F4-06..F4-09, F4-11 and F4-12. F4-05 remains the F5-11 preset and is deliberately not rebuilt by Run 14. F4-10 is integrated into F4-08.

## Windows execution

1. Back up the local `bank-v3-neon-chalk` folder or work on a copy.
2. Install Python Playwright and its Chromium once if not installed: `python -m pip install playwright` then `python -m playwright install chromium`.
3. Double-click `RUN-F4-RUN16-PHYSICAL-VERIFY.bat` in the bank root.
4. Review `review/F4-RUN15-ALL-RESULTS.json` and `review/F4-RUN16-PHYSICAL-RESULTS.json`. A timeout, absent result, nonzero exit status, changed staged SHA or unknown core is a BLOCKER.
5. Inspect the staged HTML yourself and stress the pointer interaction on your physical Windows mouse/touch devices. Automated passes are not GOLD approval.

For a targeted check after staging: `python tests/f4-run16-physical-verify.py --engines F4-02 F4-08 F4-12`.

`--diagnostic` is **not** a release acceptance mode. It may be used to examine the known older core locally, with clearly labelled results.

## New checks completed in the working environment

- Runner and all 12 packaged historical test scripts: Python syntax compilation passes.
- Original/ZIP provenance: 10 physical-test groups, 12 supplied test files, correctly mapped to the engines.
- Real Chromium sanity against **legacy core staging**, F4-02 Explore at 380px with reduced motion: physically dragged bar A end to 18; SVG `data-a` became `18`, and `window.NOVA.ui._drag` cleared. **One focused diagnostic case passed.**
- Attempted complete F4-02 historical pointer suite on legacy staging with 20-second deadline: **timed out**. Not counted as passed; original suite contains multiple widths/motion settings and needs a longer timeout, 160 s by default.
- Exact current GitHub-core browser/maths + physical pointer execution in this environment: **NOT PERFORMED** (GitHub core bytes were not materialised here). Must run against user Git checkout.

## Acceptance constraints

A successful Windows batch means only the staged current-core browser/maths and original physical pointer suites completed without recorded failures, and does not attest that the site lesson engine or native mobile touchscreen was verified. No shared core or existing production engine is included in this ZIP. No GitHub commit or push was made.
