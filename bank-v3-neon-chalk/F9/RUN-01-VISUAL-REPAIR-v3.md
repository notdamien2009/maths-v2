# NOVA F9-01 · Background family alignment · v3 — REVIEW BUILD

**User's visual report:** F9-01 lacked the faint algebraic x/y/n pattern and the original F0/F1/F2 house background. v2 mistakenly removed the entire shared NOVA stage backdrop, making it even plainer. v3 corrects that mistake.

## Source-of-truth change
1. Removed the F9-01-only CSS override that forced `.nova-stage { background:transparent; border:0; box-shadow:none }` and disabled `::before` / `::after`.
2. In the F9-01 HTML skeleton, selected the pre-existing NOVA algebra topic with `<body data-topic="algebra">`. This **inherits** the existing core's algebra x/y/n SVG motif, subtle grain, premium gradient, highlighted border and top caption **without defining a new backdrop or SVG drawing implementation**. Unchanged F0/F1/F2/F3 reference styling is used.
3. Kept v2's removal of second mascot image, retaining one native NOVA dock and its canonical skin selector. There are no inline cat/teen duplicate portraits.
4. Preserved the neon tube stick apparatus, NOVA Chalk text, four modes, teaching values and working interactions. No F9-02 work and no GitHub changes.

## Scope and comparison
- Family background reference: repository's in-core `data-topic="algebra"` CSS motif and `html[data-premium="1"] .nova-stage` inherited style. Visually checked against F2/F3 source screenshots and the owner's x/y/n patterned screenshot.
- Desktop and mobile screenshots of all 4 modes included under `screenshots/F9-01/`.
- Automated v3 visual regression: **10/10 pass** at 380px and 1280px; inherited algebra motif, premium background & border, single helper, zero duplicate portraits, no horizontal overflow and no JS page errors.
- Retested 50 functional assertions: **50/50 pass**.
- Retested 12 drag stress assertions: **12/12 pass**.
- Reproducibility test: rebuilding from the checked F3-01 standalone core via `build/build_f901.py` yields byte-identical HTML (SHA-256 checked).

## Integration note
`core/nova-core.js` on GitHub still lacks later `NOVA.motion` and `NOVA.ui.svgDrag` implementations. The self-contained HTML uses the compatible inlined F3-01 runtime. The incremental ZIP does **not** overwrite existing core files. The builder reads the current F3-01 standalone reference HTML on checkout. This remains a REVIEW build; final upstream core reconciliation is a separate approval gate.

## Deliverable
Unzip over your local `bank-v3-neon-chalk/` folder (the archive contains just this component, source, build helper, tests, and screenshots). No remote writes. Owner visual approval required before F9-02.
