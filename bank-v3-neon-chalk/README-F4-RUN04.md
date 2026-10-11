# NOVA F4 — Run 04: Multi-Step Bar Model (Premium Review)

**Status:** Technical review complete; owner visual sign-off pending.

## Review
Open `F4/F4-04-multi-step-bar-model.html` in Chrome/Edge, Firefox or Safari. This HTML has the approved embedded NOVA F0 neon/chalk shared core and needs no server, installation or network access. It contains Watch / Guided / Explore / Challenge.

This incremental ZIP is rooted at `bank-v3-neon-chalk/` for merging into your own copy of that folder. The ZIP does **not** change F0, F1, F2, F3, F4-01 to F4-03, F5 or the master. The `core/` files are canonical, unchanged, and only needed to reproduce the standalone build.

## Contents
- `F4/F4-04-multi-step-bar-model.html` — final self-contained standalone HTML
- `src/F4-04.js` and `src/F4-04.css` — scoped reusable component source
- `build/F4-04.src.html` and `build/build-f4-04.py` — deterministic build script; hashes core before inlining
- `core/nova-core.js` and `core/nova-core.css` — identical copies of the current GitHub-verified core
- `docs/F4-04-SPEC.md` — teaching, requirements and mathematical validation
- `shots/F4-04/` — 8 review screenshots, 380px and 1280px, four modes
- `tests/` — browser and pointer stress test sources and JSON results
- `QA-REPORT-F4-04.md` — evidence and remaining review gate

## Rebuild
From inside `bank-v3-neon-chalk`, run:

```shell
python build/build-f4-04.py
```

If the core differs from the GitHub-verified version, the build **stops** rather than swapping in an obsolete core.

## Tests
Requires local Python Playwright and Chromium:

```shell
python tests/test_f404.py
python tests/test_f404_drag.py
```

Both may take a short time to capture screenshots. The full browser test recreates eight screenshots.

## Safe merging
Extract into your working maths folder, inspect the component, then push GitHub yourself when satisfied. **Nothing was pushed or committed by this production run.**
