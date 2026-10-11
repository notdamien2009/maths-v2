# F6-06 Best-Buy Comparer — Component specification

**Premium review candidate; not owner-approved GOLD.** Uses exact NOVA F0 v3.6.2 Neon Tube + Chalk CSS/JS without modifying core.

## Maths teaching purpose

Year 7 `Y7-061 Unit price and best buy`. Compare price per **identical quantity**; the pack with the smaller unit price is the best value. A higher shelf price can give better value; equal unit prices mean equal value. GCSE extension: bulk discount, multi-buy, percentages, rates and price per kilogram/litre.

## Config and named presets

`F606_CONFIG.presets`, `F606_CONFIG.parameters`, event types and named scenarios are directly editable. Prices stored as integer **pence** to prevent currency ambiguity. Source amounts and comparison amounts use the same stated unit. Unit-cost formula: `(pricePence / amount) × compareAmount`. Answers are reported to two decimal places in **pence per shared quantity**.

| Preset | A | B | Common amount | Unit cost A | Unit cost B | Correct |
|---|---|---|---|---|---|---|
| Y7-061 pasta | £1.80 / 500g | £2.40 / 750g | 100g | 36p | 32p | B |
| Y7-061-cereal | £2.20 / 400g | £3.00 / 600g | 100g | 55p | 50p | B |
| Y7-061-juice | £1.80 / 1000ml | £2.55 / 1500ml | 100ml | 18p | 17p | B |
| Y7-061-soap | £1.25 / 250ml | £2.20 / 400ml | 100ml | 50p | 55p | A |
| Y7-061-equal | £2.70 / 6 bars | £4.50 / 10 bars | 1 bar | 45p | 45p | Equal |

## Visual apparatus

Two lifted glass-frame product cards (separate package construction for bag, box, carton, bottle and bars) made with `NOVA.neonBox`, `NOVA.neonPath`, `NOVA.neonLine`, and `NOVA.neonRing`. Shelf price and amount use NOVA Chalk drawn labels, with exact F0 role colours. Bars have the **same physical scale** so lengths encode the difference in *pence per 100g/100ml or item* rather than relative pack size. A shorter bar shows lower cost for equal quantity. Mobile version keeps all mathematics legible without a horizontal page scroll. No external JS or CSS, no new maths-drawing primitives.

## Six named Sir Bob teaching stages

1. Read both pack sizes and prices: shelf price alone cannot decide value.
2. Establish a fair common unit for both packs.
3. Calculate Pack A cost per shared amount.
4. Calculate Pack B cost per shared amount.
5. Animate cost bars side by side and compare exact length and price.
6. Justify the correct best buy or show equal value.

## Interaction and assessment

- Watch automatic F0 timeline; Guided manually stepped; Explore free selection; Challenge marks two calculated unit prices **and** pack decision.
- Explore SVG `NOVA.ui.svgDrag` neon best-buy ring with drop zones on product cards, green snap target, red return tray, fast regrab/invalid-drop recovery and local pointer-up defence; no shared-core changes.
- Keyboard selection A/B/E (equal), Delete removes placed ring. The HTML Equal Value button supports pupils who cannot drag. Hint and Reset implemented.
- Challenge does not reveal bars/unit prices or example answers before the solution is correct. Feedback differentiates pounds vs pence, shelf price vs unit price, inverted division, incorrect comparison, missing answers and equal value.
- Event types: `value`, `step`, `correct`, `hintUsed`. NOVA F0 core provides focus, reduced-motion, print fallback, timeline navigation and Sir Bob narration slots. No game logic.

## Accessibility and limits

Four keyboard-operable modes; visual difference uses colour + labelled position/bar lengths; SVG has accessible description. Requires live NOVA lesson integration and native touchscreen/screen-reader checking before final GOLD approval. Presets are Year 7 teaching models, not exhaustive price datasets.
