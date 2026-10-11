# F7 Run 04 — Expanding Single Brackets (F3-02 named preset)

**Status:** Premium review candidate; owner GOLD approval pending. **No GitHub changes.**

## Purpose & mathematical contract

Y7-031 · Expanding a single bracket. Use one symbolic area rectangle, partitioned into x and a fixed unit length; the outside factor is the shared height. Distinct areas represent kx and kc, so k(x+c)=kx+kc. The unknown x is symbolic, so drawn widths are schematic, not claimed numerically to scale.

**Configuration:** `factor` and `constant` are positive whole numbers 1–12. Presets include 3(x+2), 2(x+3), 4(x+5), 5(x+1) and the original Y7-031. Negative factors are NOT presented as physical positive areas; those require signed tile work and are out of scope for this preset. GCSE bridge: distributive law and reverse factorisation via existing F3-02.

**Teaching timeline:** 6 dedicated Watch/Guided narrated states: whole bracket → x and unit sides → k×x → k×c → add unlike areas → distributive law. Explore changes coefficients by form inputs and the native F3-02 SVG partition handle. Changing dimensions intentionally changes the expression (unlike original constant-product numeric partition mode).

**Challenge:** four tasks. Drag both possible partial products into the corresponding two area cells; incorrect placements spring back. Then enter expanded expression. Includes specific feedback for forgetting to multiply the unit term, treating unlike terms as combinable, or confusing x and unit areas. Mouse, keyboard and reduced-motion operation preserved.

## Preset, not duplicate

The underlying registered engine is **F3-02** in both files, using the SAME `src/F3-02.js`, `src/F3-02.css` and byte-for-byte unchanged bank F0 core.

- `F3/F3-02-area-model-of-multiplication.html` is the existing engine with the new preset integrated. This replaces only the existing F3-02 file when merged. Its default numeric modes remain unchanged.
- `F7/F7-04-expanding-single-brackets.html` is a dedicated **entry page for the F3-02 preset**, not a second engine implementation. This is the convenient self-contained F7 preview.
- The adapter can also be selected by opening F3-02 with `?preset=F7-04`.
- `docs/F7-04-TARGETED-DIFF.patch` is the reviewable source patch against the GitHub F3-02 baseline (SHA1 `79d8292a8a7232a52549eea41c54a7e86bbf4341`).
- `build/build-f7-04.py` inlines existing `core/nova-core.js/css` and the updated F3-02 source into both entry points.
- Do not replace or modify F0/F1/F2/F7-01/F7-02/F7-03. No new math drawing primitive or style has been introduced.

## Files to merge

1. `src/F3-02.js` (targeted preset improvement of existing source).
2. `src/F3-02.css` (exact current GitHub stylesheet, SHA1 `3e2be5ce30689c6e52d5b035a1b0b096f9e33346`; not changed).
3. `build/F3-02.src.html` (reproducible source with F0 inline placeholders).
4. `build/F7-04.entry.src.html` and `build/build-f7-04.py`.
5. `F3/F3-02-area-model-of-multiplication.html` and `F7/F7-04-expanding-single-brackets.html`.

The shared F0 core is not included in this incremental ZIP. The two finished HTML files are fully standalone, and the supplied build script uses your EXISTING `core/nova-core.js/css`. Their checksums were verified against the F0 original; never replace the core when installing this pack.

## QA and acceptance

See `QA-REPORT-F7-04.md` and `tests/*.json`; mobile 320/380, tablet 768 and desktop 1280 modes have been tested. Final visual approval, narration feel and full live lesson-shell integration remain the owner's review tasks.
