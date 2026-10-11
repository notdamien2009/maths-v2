# NOVA F4 · Run 01 — Part–Whole Bar

**Deliverable:** `F4/F4-01-part-whole-bar.html` — standalone, offline-ready, fully inlined NOVA F0/F2 core, NOVA Chalk fonts, maths SVG and interactive logic.

**Status:** PREMIUM REVIEW. Not owner-approved GOLD. GitHub has **not** been changed.

## Install in your current maths folder

1. Extract this ZIP. Open its top `bank-v3-neon-chalk` folder.
2. Copy **its contents** into your existing local `bank-v3-neon-chalk` folder, merging `F4/`, `src/`, `build/`, `tests/`, `shots/` and `docs/`.
3. No existing F0/F1/F2/F3/F5 engine or `core/` file is supplied or overwritten by this package.
4. Double-click `F4/F4-01-part-whole-bar.html` to review the self-contained engine locally. It works without internet access.
5. For an optional reproducible rebuild with **your existing** exact core, run from your `bank-v3-neon-chalk` directory: `python build/build-f4.py`. This script fails with a clear error if your core is different; it will not silently alter the core.
6. Review the screenshots and QA report. Only push to GitHub **yourself**, when you approve.

## Four learning modes

- **Watch:** six meaningful teacher-led evidence beats, from known whole to an algebra-ready addition proof; play/pause/step/scrub from canonical F0.
- **Guided:** same step sequence with a step prompt and Sir Bob narration.
- **Explore:** change the preset; drag a candidate value into the missing segment; resize the single known segment using the gold divider (drag, arrows, Home/End, or buttons); type values; receive mathematical explanations. Correct maths is reflected by accurate bar proportions.
- **Challenge:** three increasingly complex missing-part problems; drag/keyboard or type the missing amount, Check, receive misconception-specific feedback, Hint, then advance. Answers are hidden until checked correctly.

## Acceptance and quality

Built for 380px mobile and 1280px desktop using the existing Neon Tube + Chalk design. Rendering uses canonical `NOVA.neonBox`, `NOVA.neonPath`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.motion`, `NOVA.ui.svgDrag`, `NOVA.scene.helperStrip`, and F0's Watch/Guided/Explore/Challenge controls. Interactive elements use F2 v3.6.2 drag cancellation. Maths behaviour is specified and independently checked. No game loop; compatible with the F0-12 game wrapper.

**Canonical core — verified against the repo tree, untouched:**

- `core/nova-core.js`: Git SHA `45b41ce94d27ed63e877faac6023e483855da76d`
- `core/nova-core.css`: Git SHA `aad5139b1a5de01983efcb78dee6aabf917ea0a4`

**Note:** Extended stand-alone Pip/Nova/Izaac pose-manifest folders named by the planning master are not in the repository snapshot. Run 01 uses mascot artwork and pose mappings already embedded in the canonical F0 core. Proper traditional stacked fractions remain the approved NOVA notation, but F4-01 itself does not display fractions.

## Included files

- `F4/F4-01-part-whole-bar.html` — finished standalone preview/review engine
- `src/F4-01.js` and `.css` — editable component source
- `build/F4-01.src.html`, `build/build-f4.py` — reproducible build assets, **without** touching existing build files
- `docs/F4-01-SPEC.md` — maths purpose, schema, animation, interactions, mistakes, integration
- `shots/F4-01/` — browser-captured Watch/Guided/Explore/Challenge at 380px and 1280px
- `tests/test_f401.py`, `tests/BROWSER-RESULTS.json` — automated browser evidence
- `QA-REPORT-F4-01.md` — evidence, exceptions and remaining acceptance gates
