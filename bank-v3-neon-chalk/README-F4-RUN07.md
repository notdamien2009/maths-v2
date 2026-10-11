# NOVA KS3 Maths · F4 Run 07 · Ratio Bar · Premium Review

This update contains **only additive F4-07 files**. Extract the contents of `bank-v3-neon-chalk/` **into your existing bank-v3-neon-chalk/ directory**. Do not replace your shared `core/` directory.

## Open now

Double-click `F4/F4-07-ratio-bar.html` in a browser. This standalone HTML embeds the existing NOVA core, chalk fonts, mascots, animation kit and drag system. No internet connection is required.

## Files

- `F4/F4-07-ratio-bar.html`: finished self-contained demonstration page.
- `src/F4-07.js` and `src/F4-07.css`: editable engine additions.
- `build/F4-07.src.html` and `build/build-f4-07.py`: deterministic build; checks SHA256 of current shared NOVA core.
- `docs/F4-07-SPEC.md`: maths purpose, presets, interaction and misconception contract.
- `shots/F4-07/`: actual Chromium screenshots for Watch / Guided / Explore / Challenge at 380 and 1280, plus Y8 decimal proof.
- `tests/test_f407.py`, `tests/test_f407_drag.py`, `tests/extra_shots_f407.py`: repeatable Chromium Playwright checks and screenshots.
- `tests/F4-07-BROWSER-RESULTS.json`, `tests/F4-07-DRAG-RESULTS.json`: individual assertions.
- `QA-REPORT-F4-07.md`: evidence and open owner gate.

## Rebuild

From your `bank-v3-neon-chalk` directory:

```bash
python build/build-f4-07.py
```

The builder refuses to overwrite or silently use a different NOVA core. The shipped standalone HTML can be reviewed immediately without rebuilding.

## Testing

Python Playwright + headless Chromium are used by the supplied QA scripts:

```bash
python tests/test_f407.py
python tests/test_f407_drag.py
```

**Status:** Technical review build. Owner visual review / real mouse stress-test pending. **GitHub was not changed.**
