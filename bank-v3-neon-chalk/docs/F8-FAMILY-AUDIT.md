# NOVA Maths F8 — FAMILY REVIEW AUDIT (not GOLD)

## Verified facts

- All **18** original standalone review ZIP archives are present and pass ZIP integrity checks.
- Consolidation produced **18** distinct compiled HTML reviews, source and builder files, preserved screenshots, test scripts, and manifests.
- Preset dependency: **F8-02 → F8-03; F8-04 → F8-03; F8-13 → F3-10**. Only **15** independent maths engines are intended.
- GitHub `main` shows **10 exact-matching** standalone HTML components in their current positions: **F8-01, F8-02, F8-03, F8-04, F8-05, F8-06, F8-07, F8-08, F8-09, F8-11**. Eight standalone components from the review archive are not in `main` as of this audit.
- No `core/nova-core.js` or `core/nova-core.css` replacement is included. GitHub was not changed.
- ZIP consolidation by relative path found **two collisions**, both preserved and resolved; details below.

## Conflicts resolved

1. F8 gallery: Runs 04 and 05 supplied different `F8/F8-gallery.html` files. Both originals are preserved in `audit/original-galleries/`; this pack supplies one complete eighteen-entry `F8/F8-gallery.html`.
2. First render QA script: Runs 06 and 07 supplied different `tests/first_render.py` scripts. Both are preserved as `tests/legacy-first-render-run06.py` and `tests/legacy-first-render-run07.py`. In old per-run reports the relative paths may mention the old filename.

## Review blockers / NOT A GOLD sign-off

- Current GitHub-main F0 source and the canonical F3-10 extension have not been rebuilt/browser-verified as one integrated family.
- F8-02 and F8-04 are separate HTML views of the same engine F8-03; do not mount all three pages into one JS registry at once.
- F8-13 preview is NOT the canonical preset integration; use guarded F3-10 extension builder on your local checkout.
- At least 8 compiled HTML reviews are not yet present in GitHub main (current main has exact matches for 10).
- All original QA counts were recorded in individual runs; family-level end-to-end interactions must still be checked against the rebuilt local core.

## Recommended acceptance sequence

1. Back up/branch or stage in a separate folder rather than extract over approved sources.
2. Copy the consolidated package into a **copy** of the `bank-v3-neon-chalk` folder, so the real F0 core, F3-10 and previous approved files stay unchanged.
3. Run the F8 builders in `build/` against the exact current local core. First build F8-03; F8-02/F8-04 depend on it. F8-13 requires the existing F3-10 files and its guarded extension script.
4. Inspect the rebuilt `F8/F8-gallery.html` visual comparisons at 380px and 1280px, across Watch, Guided, Explore and Challenge.
5. Re-run component maths and pointer tests on those rebuilt outputs; stress test fast drag/drop, re-grab, return-to-tray, Escape, pointercancel, keyboard and responsive layouts.
6. Check collision-free registration in the actual lesson integration and get owner sign-off.

## Scope and evidence quality

This audit verifies supplied archive structure, component source integrity and recorded per-run QA evidence. It does **not** assert that all 18 were tested together in the user's production lesson host, that the current F0 core is byte-identical to previews, or that the user approved these builds.


## Fresh consolidated QA run — 12 October 2026

- The **18 ZIP archives** were re-checked for ZIP integrity.
- **18/18 component JavaScript sources** (including the 2 F8-03-dependent `.preset.js` sources) passed `node --check`.
- **All `build/*.py` scripts** passed Python compilation checks; these were *syntax checks*, not full current-core integration builds.
- The 18 compiled preview files share **the same normalized, F0-derived runtime JavaScript**. Trivial leading/trailing whitespace variations aside, it is byte-identical. This does *not* establish identity with today's GitHub-main canonical F0 runtime.
- **36/36 fresh Chromium standalone render checks** passed (18 HTML previews × 380px and 1280px): rendered SVG, no JS page errors and no horizontal overflow. Evidence `docs/F8-FAMILY-BROWSER-SMOKE.json`.
- **72/72 fresh Chromium mode-switch checks** passed (18 previews × Watch/Guided/Explore/Challenge, at 380px). Evidence `docs/F8-FAMILY-MODE-AUDIT.json`.
- Both F8-02 and F8-04 patches match the required integration anchors in the staged F8-03 source. Actual local-builder execution remains outstanding.
- The gallery has **18/18 valid local HTML links** and **18/18 local screenshot thumbnails**.
- No `core/nova-core.js` or `core/nova-core.css` replacement is included.

**This is a family-level packaging, preview-render and mode-switch audit. It is not the same as running all mathematical and drag stress tests against a newly rebuilt production core or real lesson host.**
