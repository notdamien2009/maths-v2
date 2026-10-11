# NOVA F4 · Run 02 — Comparison Bar (F4-02)

**Download is a merge-ready ZIP, not a GitHub commit.** Component is **Premium Review**, not owner-approved GOLD.

## Local install

1. Extract `NOVA-F4-RUN02-F4-02-PREMIUM-REVIEW-v1.zip`.
2. Open the contained `bank-v3-neon-chalk` directory, then **copy its contents** into your existing `bank-v3-neon-chalk`, merging `F4/`, `build/`, `src/`, `docs/`, `shots/`, and `tests/`.
3. The ZIP **does not contain** or overwrite any `core/` file, previous F0/F1/F2/F3/F5 component, or Run 01 F4-01 file.
4. Double-click `F4/F4-02-comparison-bar.html` (offline self-contained review build) and test Watch, Guided, Explore and Challenge.
5. If you wish to reproduce the HTML from source in your merged local project, run `python build/build-f4-02.py` from the main bank folder. Its SHA check refuses a mismatched core instead of overwriting it.
6. Review `shots/F4-02/` and `QA-REPORT-F4-02.md` before deciding whether to push any GitHub update yourself.

## Engine

- Two neon-glass comparison bars share a left origin and display proportional lengths. A highlighted matched part and gold extension explain **how many more / difference**.
- Watch: 6 mathematical construction/teaching beats with Bob narration and F0 motion controls.
- Guided: same maths stages, named prompts and step controls.
- Explore: drag either bar end, use buttons/keyboard for independent resizing, add and remove a candidate, drag the difference brace onto the gold gap, or use numeric input.
- Challenge: 3 checked problems, including finding a missing smaller group from a known difference. Incorrect responses trigger targeted mathematical explanations; answers stay concealed before completion.
- Inherited NOVA mascot dock and chalk/neon styling remain unchanged; no dependency on network access.

## Technical guard

- Current canonical core SHA (not included): JS `45b41ce94d27ed63e877faac6023e483855da76d`, CSS `aad5139b1a5de01983efcb78dee6aabf917ea0a4`.
- Fully self-contained HTML embeds **that exact** NOVA core unaltered.
- F4-02 is isolated: `build/build-f4-02.py`, `src/F4-02.js`, `src/F4-02.css`, `docs/F4-02-SPEC.md`, and its own QA JSON. Does not overwrite Run 01 files.
- Tests with Chromium/Playwright (both widths) and true mouse pointer drag in both reduced/normal motion. See QA report.

**GitHub remains unchanged; only you decide when to push.**
