# NOVA F5-05 — Premium Equivalent Fraction Multiplier

One fixed whole, two precision glass strips, meaningful splitting and a draggable ×2/×3/×4 multiplier.

## Open and test
Open `F5/F5-05-equivalent-fraction-multiplier.html` in a browser.

## Edit and build
`build/F5-05.src.html` is the authoritative editable source. `src/F5-05.js` and `.css` are extracted for convenient review. They are not required at runtime because the source template is self-contained apart from `@@JS@@` and `@@CSS@@` placeholders. The bank uses `core/nova-core.js` and `.css` for foundation code and fonts. From the top folder run `python build/build.py` to regenerate F5-05 and all included F0 and F5 pages. The older F1/F2 binaries are reference context, not redistributed here.

## Tests
`python tests/qa_f505.py` and `python tests/stress_f505.py` require Python Playwright and local Chromium at `/usr/bin/chromium` (adjust that executable path for Windows). Other test results and screenshots are included. Test arithmetic and drag snap in Explore; Challenge tests factor plus missing shaded numerator. The original bank and other F5 sources were not modified.

## Integration rule
Merge the **incremental F5-05 source and build registration** into the current bank instead of overwriting a newer shared core with this archive. Keep the master’s locked stacked NOVA Chalk fraction styling.
