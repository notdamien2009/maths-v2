# NOVA Maths F8 — Run 09 · Substitution Table

**STATUS: PREMIUM REVIEW CANDIDATE — NOT OWNER-GOLD.** GitHub has not been edited.

## To preview

Open `F8/F8-09-substitution-table.html` in Edge or Chrome. The file is self-contained with embedded F0-derived runtime, NOVA Chalk fonts and two existing mascot systems. No network or library dependencies.

## To update the local bank

Extract this ZIP into the folder containing your existing `bank-v3-neon-chalk` directory, preserving its relative `F8`, `src`, `build`, `docs`, `tests`, and `shots` paths. This archive contains no `core/` replacement. The builder selects the **existing local** `core/nova-core.js` and `.css` and creates the production HTML with that exact runtime:

`python build/build-f8-09.py`

Do this before final integration to avoid an inherited/outdated core. The packaged HTML has been tested with a review core inherited from Run 02, not the live GitHub-main core.

## Files

- `F8/F8-09-substitution-table.html` — standalone review component
- `F8/F8-09-manifest.json` — engine registry description
- `F8/F8-09-gallery-entry.json` — additive gallery metadata (no existing gallery overwritten)
- `src/F8-09.js` and `src/F8-09.css` — editable scoped code
- `build/F8-09.src.html` and `build/build-f8-09.py` — recompilation
- `docs/F8-09-SPEC.md` and `docs/F8-09-QA-REPORT.md`
- `tests/` — executable maths/browser/drag/responsive checks and their recorded JSON results
- `shots/` — genuine Chromium mobile and desktop mode captures

## Limitations

Final owner visual approval, local current-core rebuild, native touchscreen, physical screen-reader and Windows double-click `file://` opening have not been personally verified here. These require local confirmation. No source was pushed to GitHub.
