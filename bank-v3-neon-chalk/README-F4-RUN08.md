# NOVA F4 · Run 08 · Algebra Bar + F4-10 translator preset

**PREMIUM REVIEW — NOT OWNER-APPROVED GOLD**

Open **`F4/F4-08-algebra-bar.html`** in Chrome, Edge or Firefox. It is a single self-contained file and does not require internet, installing libraries or running a server.

## Install in the main maths bank
Merge the contents of `bank-v3-neon-chalk/` into your local same-named maths bank directory. This pack adds F4-08 and F4-10's mode inside F4-08. It does not replace any previous F0, F1, F2, F3, F4 or F5 HTML pages. The copied `core/` files are **byte-identical** to the GitHub canonical core (verified by `build/build-f4-08.py`). Do not manually replace working core files with a different version.

## Files
- `F4/F4-08-algebra-bar.html` — complete standalone HTML for pupil review
- `src/F4-08.js`, `src/F4-08.css` — editable component source
- `build/F4-08.src.html`, `build/build-f4-08.py` — strict, deterministic builder (does not modify shared canonical bank builds)
- `core/nova-core.js`, `.css` — exact canonical core snapshots for reproducible building; not changed
- `shots/F4-08/*.png` — 380px / 1280px mode and proof screenshots
- `tests/*.py`, `tests/*RESULTS.json` — actual Chromium QA and pointer drag evidence
- `docs/F4-08-SPEC.md`, `QA-REPORT-F4-08.md`, `F4-08-MANIFEST.json` — production documentation and verification

## Rebuild
From inside this pack's `bank-v3-neon-chalk` folder run: `python build/build-f4-08.py`. If the core has changed, the build **refuses to proceed**, rather than silently changing the visual system.

## Smoke test
Open F4-08, switch all four modes and try 3x + 5 = 26. Build three x blocks and a +5 known block; subtract 5 from both sides, enter 21, divide into three equal groups, enter x=7, then check. In F4-10 drag equation chips into the three matching slots.

**GitHub was treated as read-only.** You review, merge and push your own updates when satisfied.
