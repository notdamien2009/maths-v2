# F4-06 — NOVA Percentage Bar · Premium Review specification

Source authority: `00-master/nova-master-updated.html` → Family F4 → F4-06 Percentage Bar. Use `HANDOVER-v3.md`, especially the F0/F2 core and F5 audit guard. Existing reference sources are NOT modified.

## Mathematical purpose
The user can see a 100% bar divided into ten equal sections, with one shared position on a percentage number line and a second amount number line. The same coordinate represents the selected percentage and its amount. Models extend to 150%, and demonstrate reverse percentages without leaking the unknown original value.

## Parameters and presets
`F406_CONFIG.parameters`: range 0–150%, snapping 1/5/10%, two-decimal money calculations.

| Preset | Intended mathematics |
|---|---|
| `Y7-026` | 35% of £240 → £84 |
| `Y7-027` | 135 compared with a whole of 100 → 135% (extend beyond 100%) |
| `Y7-062` | £80 + 25% → £100 / 125% of original |
| `Y7-063` | £400 at 5% simple interest for 3 years → £460 / 115% total |
| `Y8-007` | £200 decreased 15% → £170 / 85% original |
| `Y8-008` | £144 represents 120% → original £120, divide by 1.20 |
| `Y8-038` | 90% of the *new* £230 amount → £207; links to F4-04 multi-step bar |

The separate F5-16 reverse percentage requirement maps to the **Y8-008 reverse preset** of this F4-06 engine; no duplicate engine is created.

## Modes
- **Watch:** 8 named mathematically distinct teaching steps, including the whole, tenths, one percent, 35%, matching amount, aligned scales and misconception.
- **Guided:** existing F0 animation timeline, step navigation, Sir Bob narration and named prompts.
- **Explore:** selectable lessons and 1/5/10% snap; draggable neon-ring percentage handle; keyboard arrows, input; draggable value chip with target zone/return; arithmetic validation.
- **Challenge:** four independent tests: 35% of £240; 135% of £80; original before a 20% increase; simple interest. Mathematical answer **and** placing its chip are both required.

## Interactions and misconceptions
Core `NOVA.ui.svgDrag`: lift, valid green target glow, invalid-drop spring-back, red return zone, re-grab, Escape, touch/capture recovery, keyboard Enter/Delete. All F0 drawing, `NOVA.numberLine`, `NOVA.neonBox`, `NOVA.neonRing`, `NOVA.chalkText`, NOVA cards and Bob/mastcot dock are used without modifying canonical core. No native canvas/image replacements, custom SVG glow filters, or alternate style systems.

Misconceptions include:
1. Treating percentage as a raw additive number rather than parts per hundred.
2. Taking only the percentage *change* as the increased/decreased final amount.
3. Reversing an increase by subtracting the percentage instead of dividing by its multiplier.
4. Applying simple interest as compound interest.
5. Treating percentages over 100% as invalid or impossible.

## Assessment and accessibility
Fixed declared `CONFIG.events` keys, `correct`, `hintUsed`, `step`, `mode`, and `value` through the existing F0 event infrastructure. Keyboard focus and accessible form labels. CSS two embedded NOVA Chalk fonts inherited from core. Responsive 380px / 1280px; reduced motion; core print fallback. Helper dock's text remains short while Sir Bob delivers the narrative.

## Acceptance
Technical checks recorded in `QA-REPORT-F4-06.md`; owner review pending. This ZIP deliberately omits unmodified core files. Requires existing `bank-v3-neon-chalk/core` to rebuild the HTML but the standalone HTML runs without fetching those files.
