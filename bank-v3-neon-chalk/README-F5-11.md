# NOVA F5-11 Premium Edition review candidate

This archive is a self-contained, **reproducible incremental bank** with the current shared core, all F0+F5 build sources needed by the supplied `build/build.py`, the new F5-11 engine, screenshots and QA tools.

Open `F5/F5-11-fraction-of-an-amount.html` locally to review the engine. Use the top-right mode selector for Watch, Guided, Explore and Challenge. Explore permits dragging group badges into the green answer collection, dragging selected badges back into the red return zone, or using keyboard Enter on focused badges.

For source rebuild, run `python build/build.py` from this root. For QA, run `python tests/qa_f511.py` and `python tests/stress_f511.py` (Python Playwright and Chromium required).

Only F5-11 is newly changed. The earlier F5 source files are included solely as required build inputs, not new owner approvals. Shared core CSS/JS remains byte-identical to the previous run.

**Mathematical note:** 2/3 of 10 = 20/3 = 6 2/3. Every group contains 3 complete units and one third of another unit. In Challenge mode the answer is hidden.

Status: **visual GOLD approval and live lesson integration outstanding**.
