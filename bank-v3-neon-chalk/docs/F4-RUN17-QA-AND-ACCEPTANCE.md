# F4 Run 17 — QA harness repair and guarded acceptance

## Why this repair exists

The earlier `tests/f4-run16-physical-verify.py` attempted `len(checks)` on historical reports with integer `checks`, such as the F4-04, F4-06 and F4-07 drag suites. This could classify genuinely passing original checks as failed. It was a **verifier defect**, not evidence of a mathematical-engine defect.

## Repairs

1. New `tests/f4_run17_report_schema.py` accepts the three F4 report formats and verifies detailed evidence against totals. A contradictory count or malformed file blocks acceptance.
2. `tests/f4-run16-physical-verify.py` is replaced by a parser-corrected implementation; exact-core guards and temporary test isolation are retained. A blocked attempt actively overwrites its previous output with a BLOCKED result so a stale green result is not reused.
3. `tests/f4-run17-acceptance.py` independently verifies stage SHA, current-core Git blobs, every staged engine SHA, all five current-core Run15 groups, all 12 Run16 physical-test cases, presence of F4-05 and F4-08, and freshness of the reports. It writes only to `review/` and never returns GOLD.
4. `RUN-F4-RUN17-FINAL-GATE.bat` runs parser selftest → Run14 staging → Run15 browser/maths → Run16 physical drag → final acceptance. On failure it leaves production sources untouched.

## Verified **in this Run17 development workspace**

| Gate | Outcome | Interpretation |
| --- | --- | --- |
| Offline parser invariant tests | **18/18 passed** | New report reader behaves correctly with list, integer and results-array reports and invalid report shapes |
| Real historical F4 archived QA reports parsed | **23/23**, containing **1,580 previously recorded checks** | Historical QA evidence is readable; **NOT** a fresh re-execution of 1,580 checks |
| Run17 verifier Python syntax and CLI invocation | PASS | Source parses and command-line help loads |
| Final acceptance with missing current-core evidence | Correctly BLOCKED, exit 1 | No accidental approval when files or live results are missing |
| Exact current GitHub core live browser + physical drag | **PENDING YOUR LOCAL RUN** | No claim of an exact-core pass |
| Owner visual/GOLD approval | **PENDING** | Must not be inferred from the test harness |

## Exact core baseline

- GitHub: `notdamien2009/maths-v2`
- Snapshot: `48a7eb7309cb37e6f23efea5204152704f42f03c`
- `nova-core.js` Git blob: `ac0b40a0bf19246ec3a9824798bd67dfe738c91c`
- `nova-core.css` Git blob: `1830cd68b3a345cbeefae69782bf2b309765d5fa`

## Merge safety

This ZIP contains **no `core/`, `F4/`, `src/` or production `build/` paths**. The only replacement is the existing Run16 test-runner file; the rest are new files. It does not commit, push or otherwise change GitHub. The existing Run14, Run15 and Run16 scripts and original engine files must already be installed in the local folder.

**Recommended next action:** run `RUN-F4-RUN17-FINAL-GATE.bat` on the Windows Git checkout and send back `review/F4-RUN17-ACCEPTANCE.json` plus the Run15/Run16 results if blocked. Do not start another speculative repair run until we have that evidence.
