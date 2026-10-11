# NOVA F4 — Run 09 · Before-and-After Bar

## View now
Open `F4/F4-09-before-and-after-bar.html` in Chrome/Edge. This is a **self-contained** production-review HTML with the approved F0 core, assets and fonts already inlined; it needs no network or build tools.

## Merge this ZIP into your existing `bank-v3-neon-chalk`
Extract the ZIP at the parent folder and merge only its new F4-09 files. No previous F4 engines and no `core/nova-core.js` or `core/nova-core.css` are shipped or modified. The build script reads the **existing** canonical core and stops with a SHA256 mismatch if that core differs.

Source: `src/F4-09.js`, `src/F4-09.css`, `build/F4-09.src.html`.
Rebuild after merge: `python build/build-f4-09.py` from the `bank-v3-neon-chalk` folder. It writes `F4/F4-09-before-and-after-bar.html`.

Quality evidence: `QA-REPORT-F4-09.md`, `tests/F4-09-*-RESULTS.json`, and `shots/F4-09/*.png` (mobile and desktop).

Status: **Premium Review only, not GOLD/owner approved.**

GitHub was not changed. You review locally, then decide when to push.
