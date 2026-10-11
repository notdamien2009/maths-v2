# F6-03 · Sharing in a Ratio — component specification

**Build status:** Premium review candidate; owner approval pending. **Source:** F6-03 WHAT TO BUILD prompt in the master. **Theme:** exact current F0 foundation, NOVA Neon Tube mathematics + NOVA Chalk labels, numbers and writing. F0 core is NOT modified or included in this incremental ZIP.

## Purpose
Introduce ratio sharing as equal-part reasoning before calculation. A continuous neon ratio tape shows `a` unit boxes for the first recipient and `b` for the second. A core neon brace groups the whole `T`; neon counter groups support counting the parts. Each equal unit has value `T/(a+b)`; resulting shares are `a*T/(a+b)` and `b*T/(a+b)`.

## Configuration
`window.F603_CONFIG` at start of `src/F6-03.js` declares all parameters, lesson presets and events. Four named Y7-059 practice contexts extend the same verified objective:

| Preset | Ratio | Whole | Unit | Share A | Share B |
|---|---:|---:|---:|---:|---:|
| Y7-059 | 2:3 | £30 | £6 | £12 | £18 |
| Y7-059-sweets | 3:2 | 45 | 9 | 27 | 18 |
| Y7-059-time | 1:4 | 60 | 12 | 12 | 48 |
| Y7-059-points | 5:7 | 96 | 8 | 40 | 56 |

The component currently supports *positive whole-number* ratios with whole-valued shares, using author-controlled presets. GCSE extension: three-way sharing, ratio fractions, reverse sharing and variable totals (future work; not claimed implemented).

## Watch and Guided
Seven named learning states: (1) deal counters into the ratio groups; (2) build same-size boxes; (3) count total parts and whole; (4) divide to find the value of one equal part; (5) obtain the first share; (6) obtain the second share; (7) verify whole and ratio. F0 Timeline provides play/pause, step, scrub, reset and narration, and reduced-motion-safe sequences. Sir Bob narration updates to the active preset rather than narrating fixed wrong values.

## Explore
Use the F0 drag system to drag neon numeric chips into the two labeled share targets. Drag a one-unit chip onto a unit cell in the ratio tape. Regrab a placed chip to transfer or remove it; a red RETURN zone removes it. Keyboard alternative: focus a value chip, press `A`/`B` to assign, `U` to place one unit; focus a placed marker and press `Delete` or `Backspace` to remove it. Buttons allow reset, hint and checking. The two answer values are not pre-filled before pupils assign chips.

## Challenge
Four answer tasks (same Y7 objective in varied contexts). Both shares must be numerically correct; the tape's resulting amounts are hidden until success. Misconception-specific feedback distinguishes dividing by the wrong part count, confusing one part with a share, swapping the two recipients, and satisfying the total without matching the ratio.

## F0 contract
Only `NOVA.neonBox`, `NOVA.neonRing`, `NOVA.neonLine`, `NOVA.svg.brace`, `NOVA.chalkText`, `NOVA.motion`, `NOVA.ui.svgDrag`, `NOVA.scene.helperStrip`, `NOVA.bankMount` and established F0 styles. No new primitive, neon filter, mascot artwork, maths font or shared core modification. The stage uses 380px and 1280px tailored geometry and colour plus grouping and labels as dual cues. `F4-07 Ratio bar` is **a later cross-family reference**, not a file that has been silently fabricated or imported.

## Events
F0 wrapper emits `step`, `mode`, `correct`, `hintUsed`, plus typed `value` events for `preset`, `shareAssign`, `shareRemove`, `unitPlace`, `hint`, `answer`, `reset`.

## Testing / acceptance
Maths invariants, live Chromium rendering at 380 and 1280 all 4 modes, physical drag and keyboard, fast re-grab, red removal, invalid-drop recovery, no orphan active drag, screenshot review. Owner sign-off and in-lesson integration are **not yet** complete.
