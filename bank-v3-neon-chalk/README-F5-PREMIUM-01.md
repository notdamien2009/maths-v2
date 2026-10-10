# NOVA F5 Premium rebuild — F5-01

First rebuilt component after Grok audit, using the newer supplied v3.6.x bank and F2 Premium benchmark.

## Files
- `F5/F5-01-fraction-strips-and-wall.html` — browser-ready, self-contained engine.
- `build/F5-01.src.html` — editable engine source; uses `@@CSS@@` and `@@JS@@` build placeholders.
- `build/build.py` — supplied bank builder extended with the F5-01 registration and SVG filter checks. F0 sources included so it runs independently.
- `core/nova-core.js|css` — matching bank source; JS has a minimal drag-pointer fallback patch. CSS unchanged.
- `shots/F5/` — 8 browser screenshots, each mode at 380/1280.
- `tests/run_f501_qa.py`, `tests/stress_f501.js`, `tests/f501-qa-results.json` — repeatable automated checks.
- `F5/QA-REPORT-F5-01.md` — results, outstanding items and change note.
- `F5/F5-FRACTION-NOTATION-LOCK.md` — owner's locked fraction typography decision.

## Build and test
From the `bank-v3-neon-chalk/` directory:

```
python3 build/build.py
python3 tests/run_f501_qa.py
```

This package is a **working candidate**, not a replacement of the source bank or owner-approved GOLD. No reference/ directory is shipped. Do not merge its patched core without reviewing the pointer capture fix and regressing F0/F1/F2.
