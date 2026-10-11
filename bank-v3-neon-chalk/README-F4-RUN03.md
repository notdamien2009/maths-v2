# NOVA F4 Run 03 · Cuisenaire-Rod Builder

**Deliverable:** `F4/F4-03-cuisenaire-rod-builder.html`, complete standalone HTML with inline CSS/JS and original NOVA core embedded.

**Install into existing bank:** Extract this ZIP and merge the enclosed `bank-v3-neon-chalk/` folder into your local master folder. This ZIP adds only F4-03 paths, supporting tests, screenshots, spec and report. It **does not** replace any of your F0/F1/F2/F3/F5 files or `core/nova-core.js` / `.css`.

**Review:** Double click the standalone HTML file. Review Watch, Guided, Explore and Challenge. Test pointer dragging rods onto the two tracks, reordering and returning rods to the red zone; use the keyboard alternatives. Check the three challenges.

**Rebuild after extraction:** `python build/build-f4-03.py` from the merged bank. The builder verifies canonical core Git blob hashes (`45b41ce9...` and `aad5139b...`) before assembling the page. It deliberately stops if the shared core differs. Never paste an older F5 core into this folder.

**Testing:** With local Chromium and Python Playwright installed, run `python tests/test_f403.py` and `python tests/test_f403_drag.py`. Expected evidence and 8 screenshots are bundled.

**Source:** `src/F4-03.js`, `src/F4-03.css`, `build/F4-03.src.html` and `build/build-f4-03.py`. The other files are outputs and QA evidence.

**Ownership:** Technical review build only. Nothing has been pushed or changed on GitHub. You control local replacement and the later Git push.
