# NOVA F7 — Run 05 · Expanding Double Brackets

**Status:** Premium review (not owner-approved GOLD). No GitHub modifications.

## Maths and component identity
F7-05 is a **preset of F3-02 Area Model of Multiplication**, not a second engine.
The shared F3-02 source already incorporates Run 04 (F7-04 single brackets). Run 05 adds:

- Four term-by-term regions for `(x + a)(x + b)` and an eight-state narrated Watch/Guided lesson;
- `x²`, `ax`, `bx`, `ab`, followed by collecting `ax+bx` into `(a+b)x`;
- Signed cross-term representations with pattern cues, avoiding the false claim that negative numbers are negative physical lengths;
- Named curriculum presets Y8-011, Y9-006 and Y9-008; Explore inputs for integers −9 to 9 (excluding 0);
- Four dedicated Challenge tasks with four dragged/keyboard-placed products each, misconception feedback, answer parser, undo/remove recovery;
- Responsive entry, F0 mascot/narration/motion, and an updated F7 family gallery.

The four Challenge proofs include `(x+2)(x+3)=x²+5x+6`, `(x+4)(x+1)=x²+5x+4`, `(x−3)(x+2)=x²−x−6`, `(x−2)(x−4)=x²−6x+8`.

## Installation into your existing bank

**Apply Run 04 first.** This Run 05 `src/F3-02.js` is a cumulative replacement of the shared F3-02 engine including Run 04 and Run 05; it must replace the previous F3-02 JS rather than be appended.

Unzip into your `bank-v3-neon-chalk` folder preserving relative paths. Replace only these existing files: `src/F3-02.js`, `src/F3-02.css`, `F3/F3-02-area-model-of-multiplication.html`. Add `build/F7-05.entry.src.html`, `build/build-f7-05.py`, `F7/F7-05-expanding-double-brackets.html`, `F7/F7-05-manifest.json`, `F7/F7-gallery.html` and QA/docs. `build/F3-02.src.html` is the matching template from Run 04 (unchanged).

**Never replace F0 core, F7-01, F7-02, F7-03, or F7-04 output.** They are absent from this ZIP. The compiled F3-02 and F7-05 HTML have F0 core inlined exactly as supplied (JS SHA256 `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`, CSS SHA256 `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`). The shared core is not modified or included.

To rebuild after merging: `python build/build-f7-05.py` uses your **existing** `core/nova-core.css/js`. The dedicated preset also opens by navigating to the compiled `F7/F7-05-expanding-double-brackets.html`.

## Acceptance

See `QA-REPORT-F7-05.md` for evidence. All modes passed at 320, 380, 768 and 1280 px. Mouse/keyboard Challenge tested to full completion at 380 and 1280, reduced motion. Normal-motion physical drag checks passed at 380 and 1280. Earlier F7-04 and original F3-02 modes regression-tested. Full NOVA lesson-shell integration and owner GOLD approval remain outstanding.
