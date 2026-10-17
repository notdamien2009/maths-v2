# F4 changes

All 11 F4 source documents now embed, once, the same canonical code as F3. That covers the lesson API (`integration/nova-v2-lesson-api.js`), the Explore policy and the speech policy. The new `integration/nova-f4-contracts.js` and `integration/nova-f4-runtime.js` are added as `data-nova-f4-support` scripts. The runtime is the F3 runtime with an added `conceal()`, which removes answer-bearing `data-*` attributes when `concealAnswers` is set. The original renderers stay authoritative. A new `data.lesson` record (state, phase or motion, title, overlay) drives each engine's own `present()`/`render()`, and the native `def.render` remains the default path.

Shared core fixes are applied verbatim from the F3 release (`f3-core-hunks.json`):
- Timeline pause/resume.
- `dragSnap`: snap from the minimum, plus pointer-cancel and lost-capture release.
- `NovaSpeechPolicy` guard in Bob and persona speech.
- `assess` multi/order type guards.
- Game option validation and `retryWrong`.

Drawing-file changes, each small and in the original style:
- **F4-03:** the step-6 fraction is now computed from the trains. It was hard-coded `2/6 = 1/3` for every state; the native default still renders 2/6 = 1/3.
- **F4-06:** a `maskAmount` option hides the MATCHING AMOUNT card in lesson phases before the amount step. A `maskScale` option shows the interior amount-scale labels as "?" in Challenge.
- **F4-08 / F4-10:** new translator lesson sequence (bar → x-term → known term → equation) with glowing `NOVA.neonPath` connectors and `neonRing` terminals from each bar part to its equation slot. The `maskTerms` option hides the printed equation until it is assembled.

Adapter and registry changes:
- `integration/component-adapters.json`: F4 rows have new `sha256` values and `verification.audit20261016F4`. New row `F4-10` (`presetOf: F4-08`, `lessonDefaults: {state: {mode: 'translator'}, overlay: 'equation'}`).
- `integration/nova-lesson-challenge.js` and the template were taken from the combined F0–F3 release; they are unchanged by F4.

Not changed: original head CSS, artwork, mascot placement, fonts and palette, F0–F3 sources, and the canonical core API. `source-changes.patch` is a readable diff of the script blocks against `originals.zip`, with the 1 MB core block summarised; `build.py` and `hooks.py` reproduce the exact output from the originals.
