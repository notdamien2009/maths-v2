> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# NOVA F8-02 · Inverse-operations Flowchart

**Run 03 — F8-03 presentation preset, not a separately registered engine.** Fresh build from the F8-02 master prompt. No rejected F8 prototype used.

## Mathematical purpose

Show explicitly how a two-step input→output machine reverses. To recover `x` from a known output, **undo the final forward operation first, then undo the earlier forward operation**. Prove the recovered value by replaying the original rule forwards.

## Lesson contexts

| Preset | Forward | Guided output | Reverse evidence | Original input | Challenge |
|---|---|---|---|---|---|
| Y7-033 | ×2 then +3 | 15 | 15 − 3 = 12; 12 ÷ 2 = 6 | x = 6 | 2x + 3 = 19 → x = 8 |
| Y8-016 | ×5 then −4 | 21 | 21 + 4 = 25; 25 ÷ 5 = 5 | x = 5 | 5x − 4 = 31 → x = 7 |

Year 7 and Year 8; extends to GCSE inverse functions, composition and change of subject.

## Visual representation

- **Top/forward row:** real mathematical values/unknowns in glass neon boxes, links via canonical `NOVA.svg.arrow`; the two forward rules are fixed, clearly labelled, and reflect the shared F8-03 operation dictionary.
- **Lower/reverse row:** same output at the right, then undo slot 1, intermediate value, undo slot 2 and recovered input at left; arrows run right-to-left. Distinct operation cues are used without new colours or custom glow filters.
- **Guided/Watch:** five steps, then three illustrated working lines beneath the two routes (no unfilled stage band). Steps hide results until their evidence is due.
- **Explore/Challenge:** drag cards from the bottom tray into the two undo slots; red return/clear zone. The tray holds two valid inverses and two misconception distractors.
- **Responsive:** 380px narrow three-node rows; 1280px wide rows. Shared helper/mascot strip, Bob narration and four NOVA modes all inherited from F0.

## Mode contract

- **Watch:** five narrated forward/reverse/proof teaching beats.
- **Guided:** pupil-controlled steps with misconceptions addressed during discovery, no premature reveal.
- **Explore:** switch Year 7/Year 8 lesson preset, edit known output, add/remove/reorder inverse rules and see the resulting recovered input; the forward check only appears when the chain is correct.
- **Challenge:** requires both inverse cards correctly ordered **and** numerically correct recovered input; no premature answer shown. Misconception-specific feedback for wrong order, forward operation used in reverse, and incorrect arithmetic.

## Accessibility and implementation

- Same F0 core, `NOVA.ui.svgDrag`, `NOVA.chalkText`, `NOVA.neonBox`, `NOVA.svg.arrow`, `NOVA.motion`, `NOVA.scene.helperStrip`, `NOVA.bob`, `NOVA.events` as F8-03.
- Keyboard Enter selects rules, Delete removes from a placed slot; drag returns to tray or springs back on invalid drop. Escape/pointercancel/blur handled by F0.
- Short mascot captions; Pip/Nova chosen via shared helper, Izaac in Challenge using available **think** and **celebrate** source poses (the F0 review runtime does not contain a tablet-reading pose). No boxed mascot backdrop added.
- Mathematical cues are not represented by role glyphs or star markers. Static explanation available for print; no game logic.
- Values and event keys reuse the existing F8-03 contract; only one shared `F8-03` registration exists.

## Engineering integration

`build/build-f8-02.py` injects the preset source **inside a temporary copy of the F8-03 source string before `bankMount`**. It does not overwrite the existing F8-03 source or shared F0 core. The compiled F8-02 HTML contains the existing F8-03 runtime once plus the F8-02 presentation route. It is an owner-review candidate, not approved GOLD.
