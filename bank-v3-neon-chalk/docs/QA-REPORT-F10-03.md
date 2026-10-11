# NOVA F10 — Run 03 / F10-03 Midpoint and Distance QA

**Status:** Premium review candidate, awaiting owner approval. GitHub untouched.

## Baseline, background, fonts, mascot
- Directly derived premium studio framework from the accepted review build `F10-02`, which was compared previously against F0-02 and F1 reference presentations. Navy gradient, cyan neon frame, mathematical motif, controlled depth, original NOVA chalk font and original helper/teen artwork.
- Checked screenshots: `screenshots/{watch,guided,explore,challenge}-{380,1280}.png`, plus 320px mobile mode screenshots.
- Core API draw: `NOVA.neonPlot`, `NOVA.svg.axes`, `NOVA.neonLine`, `NOVA.neonPath`, `NOVA.neonRing`, `NOVA.chalkText`; no private drawing primitives or modified core assets.

## Browser results
- Final complete automated runner: **84/84 PASS** across 380px/1280px × normal/reduced motion, on the actual final HTML after the mobile-label corrections. See `tests/QA-INTERACTIONS-ALL.json` and `tests/qa-final.log`. Earlier timeout/retry evidence remains in archive logs for transparency.
- 320px and 768px responsive smoke on the final HTML: **8/8 PASS** across all four modes; see `tests/QA-RESPONSIVE.json`. Desktop and 380px screenshots also regenerated from final HTML.
- No horizontal overflow, all illustrated mascot images have alt text, no JS exceptions in tested modes.
- Native SVG drag/snap, re-grab and Escape cancellation tested on 380/1280 in both motion settings; no `NOVA.ui._drag` stranded state.
- Coordinates and presets tested: Y8-045, Y9-040, F15-03, five exposed presets total.
- Challenge: wrong attempt and hint event, midpoint on half-grid, distance 5, exact surd 2√13. Correct answer withheld from cards until successful submission. 3/3 challenges solved in all test modes.

## Mathematical acceptance checks
- Default: A(−3,−2), B(1,1). Δx=4, Δy=3, 4²+3²=25, AB=5, M=(−1,−0.5).
- Challenge1: A(−3,−2), B(1,2), M=(−1,0).
- Challenge2: A(−3,−2), B(1,1), AB=5.
- Challenge3: A(−3,−1), B(3,3), AB=sqrt(52)=2sqrt(13)≈7.21. Input accepts decimal within 0.025 units, exact surd forms.

## Outstanding
- Owner visual sign-off and manual touch-device testing outstanding; not marked GOLD.
- Source uses current embedded reference core from F3 premium pack for standalone preview. Rebuild script points to the repository's canonical `core` rather than shipping or replacing shared core.
- Run 01 F10-01's earlier background remains a separate uncorrected issue; this run does not touch it.
