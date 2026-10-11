# NOVA F4-01 — Run 01 Evidence-Based QA

**Status:** Technical and automated browser QA passed; **owner GOLD sign-off pending**. No GitHub commits, file modifications or pushes were made.

| F5 Build Guard | Tested evidence | Result |
|---|---|---|
| 1. Current core, no private copy | Exact Git blob SHA for source core: JS `45b41ce94d27ed63e877faac6023e483855da76d`, CSS `aad5139b1a5de01983efcb78dee6aabf917ea0a4`. Standalone build includes precisely these; `build/build-f4.py` verifies the same hashes before building. | Verified |
| 2. Only shared drawing helpers | `src/F4-01.js`: `N.svg.root`, `N.neonBox`, `N.neonPath`, `N.neonRing`, `N.neonMark`, `N.chalkText`; no custom SVG filter, arrow, glyph or font. | Verified by source review |
| 3. Approved stacked fractions | F4-01 is integer-only and contains no fraction display. The old master placeholder is **not** used in this component. | Not applicable |
| 4. Premium visual | Neon glass whole/parts, gold missing segment, explanatory proof strip, result green only after reveal; 8 Chromium captures at 380px/1280px in `shots/F4-01`. No desktop/mobile page overflow in `tests/BROWSER-RESULTS.json`. | Implemented; owner visual judgement required |
| 5. Drag and recovery | Browser test moves the correct candidate into a true drop zone; full Challenge proof validates. Drag cancellation with Escape and removal of any stray SVG transform tested at both widths. Normal-motion divider drag separately checked at 380px and 1280px. | Tested passing |
| 6. Mascots and Bob | F0 `N.scene.helperStrip` and `NOVA.bob` narration are used; beat-specific pose/caption via `dock`. Current core's embedded art is used; extended standalone pose manifests absent from repo. | Core preserved; external manifests pending |
| 7. Hygiene and accessibility | Config lists emitted value keys, no visible developer IDs or code outside `details.nv-dev`, keyboard equivalents for tile placement and resizing, static fallback, F0 reduced-motion behaviour and print CSS. | Implemented; full assistive-technology manual pass pending |
| 8. Automated self-QA | `tests/test_f401.py`: **78 of 78 browser/maths checks passed**, 0 failures; two widths, four modes, screenshots, maths tasks, negative misconception check, pointer drag, keyboard divider, Escape and no page JS errors. | PASS |
| 9. Owner acceptance | Compare against F2-01–03 Premium Edition, inspect 380px and desktop, exercise all four modes, and approve explicitly. | **PENDING — NOT GOLD** |

## Numbers and proof

- 18 − 7 = 11; 7 + 11 = 18.
- 30 − (8 + 5) = 17; 8 + 5 + 17 = 30.
- 120 − (48 + 27) = 45; 48 + 27 + 45 = 120.
- Part geometry is proportional to each quantity: shared whole width = 836 internal SVG units; each known and unknown region uses `836 × part / whole`.
- Wrong check values receive specific mathematical explanations and do not advance progress.

## Remaining review gates

- Teacher/owner check of visual depth, stage balance, chalk legibility, helper poses and mobile tap feel against **the actual F2 Premium Edition engines**.
- External Pip, Nova and Izaac expanded pose manifests should be supplied before claiming exact manifest coverage; this package uses the current core's embedded helpers only.
- The component is **only F4-01**. F4-02 and later remain unbuilt in this ZIP; F4-05 and F4-10 are presets, not separate components.
- QA browser checks used current Chromium via Playwright. Learner-device field testing and assistive-technology manual checks remain to be done.
