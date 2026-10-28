# NOVA Explore VNext — Sequential Audit Batch F0-01–F0-05

## Scope
Inspected the five **current GitHub main-branch sources**, not only older archive names. Sources were checked byte-identical to Library October 17 copies before use. Changes apply solely to copied paths under `NOVA-EXPLORE-UPGRADES/F0/`. Permanent `NOVA-production/` is unchanged.

## File-by-file verdict

| Component | Audit / finding | Development action |
|---|---|---|
| F0-01 Design Tokens | The `focus` role declares a `ring` shape but glyph() had no `ring` rendering; UI printed `undefinedfocus`. | Add focus ring SVG shape. Tested focus button contains no undefined markup. |
| F0-02 SVG Primitives | The active Explore number line provides sliders but little independent reasoning. | Add signed-inverse challenge: predict which signed hop brings the current start to zero; use the real slider to test. Example 2→0 needs −2; 1→0 needs −1; 0.2→0 needs −0.2. |
| F0-03 Animation Timeline | Explore can animate while controls/preset change; Play did not honour reduced-motion preference. | Stop active tween on jumps, size or preset change; reduced-motion Play goes straight to end; add final landing prediction from start + jumps×size. |
| F0-04 Interaction Kit | Stepper button update left its own output stale. Sort event handler accumulated on Explore remount. | Always update stepper output; register matching `api.onCleanup(offSort)` using event bus unsubscribe. |
| F0-05 Maths Text | Already has live notation markup, standard form and surd exploration. | Preserve unchanged until deeper pedagogy and narration testing. |

## Source integrity

- F0-01: original `04a816b8c251a0d851e24af2efacf2c299ae5935` → development `a6b7b8a84c4885d395193674ca819aa926483c2b` (new Git blob).
- F0-02: original `e932dba290e4b3c066593188c7b3d65eb6f78c76` → development `b68853d0a1a3206db28858ebbc97fd7bbf0fc154` (new Git blob).
- F0-03: original `a3e4a2c3541df625486f410a53d2831085332e74` → development `1adcaa062e42a5be21805f941e07e45bd39b6482` (new Git blob).
- F0-04: original `e3e33ce33a3cc4d1e3014650240fa05e0ba96b35` → development `da1c539c07572ea008792e0fb03e0ca4f7085ab4` (new Git blob).
- F0-05: original `6d7bcbc5c96776d58035f7c14480edc8bc834732` → development `6d7bcbc5c96776d58035f7c14480edc8bc834732` (unchanged).

The Git blob SHA values of all edited source HTML were independently matched to the exact local files tested in Chromium. Each edit is localised to its intended component code: source beginning at the Challenge function and following remained byte-for-byte unchanged.

## Tests actually executed

- Chromium (standalone component HTML): all five files loaded without page-script exceptions.
- Tab transitions: Guided → Explore → Challenge → Watch → Explore across five components at **390px** and **1100px** wide; 0 page script exceptions; no page-level horizontal overflow.
- F0-01 focus glyph now renders with defined SVG rather than undefined text.
- F0-02 browser Enter-key check: signed hop to zero passed for starts 2, 1, 0.2. Correct and incorrect feedback paths verified in earlier candidate testing.
- F0-03 browser Enter-key check: predicted final 12 (0+3×4), 2 (20+3×(−6)), 2 (0+4×0.5) accepted; reduced-motion Play sets final frame index.
- F0-04 UI stepper button increased 0.75 → 1 in the visible output; source uses event-bus unsubscribe on teardown.
- F0-05 passed standalone tab-navigation smoke; audio/TTS not validated.
- Original Watch/Guided/Challenge logic preserved structurally, but **full assessment and narration behaviours were not exhaustively tested**.

## Pending before production acceptance

Run through representative Maths V2 lesson integrations, check focus order and screen reader output, test live narration/audio, cross-browser touch and draggable control behaviour, restore/reset persistence, actual lesson saving and feedback semantics. This batch is **development candidate**, not GOLD / production-ready.

## Next checkpoint

F0-06 seeded randomiser → F0-07 state/events → F0-08 narration hooks → F0-09 registry manifest → F0-10 gallery shell.
