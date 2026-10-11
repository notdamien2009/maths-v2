# F6 Family Audit — Run 16 Update (2026-10-11)

**F6-01 and F6-02 outstanding browser/drag gate is now CLOSED in the local Chromium QA environment.** The section below records historical Run 15 findings; its first pending-QA finding is superseded by this update.

- Tests re-executed in Run 16: **196/196** browser, four-mode, physical pointer drag, keyboard, Challenge, and responsive checks across **380, 430, 768, 1280px**. Evidence: `tests/f6-run16-browser-results.json`.
- Independent maths retested: **1,039/1,039** F6-01 and **7,630/7,630** F6-02. Registration tests pass.
- Repaired a fast pointer release/capture edge case **within F6-01 and F6-02 only**; unchanged F0 JavaScript hash `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`.
- Repaired F6-02 keyboard focus loss after a marker movement redraw, enabling consecutive arrows and Delete without a second click.
- **Still pending:** owner GOLD review, actual native touch-screen behaviour and in-lesson integration; F6-08/F10-05, F6-12/F18-02, and F6-13/F14-11 parent-engine integrations.
- To update the previous combined family extraction, extract `NOVA-F6-RUN16-F6-01-02-QA-CLOSURE.zip` over it. No GitHub files were changed.

---

# F6 Family — Run 15 Consolidation and Audit

**Review status:** Production artefact inventory and gallery ready; **NOT** owner-approved GOLD. Audit date 2026-10-11.

## What was inspected
- All **14** prior F6 ZIPs opened successfully with ZIP integrity checks; **406 distinct file paths** across those packages, **0 conflicts**.
- F6-03 **layout fix v1.1** was chosen, not the earlier overlapping Run 03 file.
- All 14 engine/preview HTML files, editable JavaScript/CSS sources and their per-run test record files found.
- Byte-for-byte exact F0 core embedded in all 14? **True**. If false, see manifest for exact per-engine check.
- All 14 HTML bundles lack external script/stylesheet imports? **True**.
- Recorded per-run QA totals are **not a replacement for a fresh end-to-end multi-engine integration test**.

## Audit findings / release gate
1. F6-01 and F6-02: mathematical/registration checks recorded. **Full browser functional, responsive layout and physical drag suites were not completed in those production runs**; two *new visual smoke screenshots* do not close this gate.
2. F6-03: ensure **v1.1 replaces v1.0** when consolidating, to preserve the repaired ratio-bar label spacing.
3. F6-08 is a **F10-05 preset**, F6-12 a **F18-02 preset**, and F6-13 a **F14-11 preset**. Current gallery HTML files are demonstrators; they must not be promoted as integrated production engines until their actual parent engines exist and pass integration QA.
4. Owner review and GOLD approval **pending for all 14**. Native mobile touchscreen, real device voice/speech and live lesson embedding also remain out of scope.
5. Fraction notation: Run 14 follows the newer **stacked NOVA Chalk fraction lock**; the older 'fraction TBD' phrase in the portable master is superseded.
6. F6-13 has a Y9-023 cross-curricular volume/density extension; **density itself remains mass/volume and does not multiply by a geometry scale factor**.

## Recorded checks from prior build reports (not re-executed in Run 15)

| Type | Total recorded passing checks |
|---|---:|
| Maths | 946,932 |
| Browser/functional | 1,085 |
| Drag-stress | 480 |
| Layout/overlap | 771 |

## Deliveries
- **Run 15 incremental ZIP**: only new `F6/F6-FAMILY-GALLERY.html`, `F6/F6-FAMILY-MANIFEST.json`, `F6/F6-FAMILY-AUDIT.md`, `F6/RUN-15-README.md` and `F6/gallery-assets/*.webp`; does not replace any component.
- **Optional full consolidated ZIP**: original 14 HTML engines/previews, source, build scripts, test scripts/results, docs, presets and gallery (excluding duplicated high-resolution per-run screenshots, which remain in the original run ZIPs). Run 03 v1.1 replaces older Run 03. Neither ZIP writes GitHub.

## Run 15 gallery smoke QA
- Fresh Chromium page-content rendering and UI tests **on the extracted full consolidated package** at **380px, 768px, and 1280px** passed: all 14 thumbnails loaded; filtering 14/11/3, search, modal display, launch link assignment, Escape close and no horizontal overflow.
- Visual screenshots: `shots/F6-gallery/F6-gallery-380.png` and `shots/F6-gallery/F6-gallery-1280.png`.
- Local in-frame **file navigation did not complete in this managed browser environment**. The HTML links have been checked against the actual component files in the combined pack. User should test opening a component from the extracted gallery in their browser.
- Script: `tests/qa_f6_gallery.py` and recorded results: `tests/f6-gallery-results.json` (requires Python Playwright). This is gallery smoke testing, not a full re-execution of the 14 component QA suites.

## Audit interpretation
The Run 15 gallery displays the original screenshot evidence and launches the original HTML builds; it is **not a newly rebuilt maths engine**. Claims about recorded tests originate from the previous run packages. Extract the ZIP so linked engine files are available beside the gallery in `bank-v3-neon-chalk/F6/`.
