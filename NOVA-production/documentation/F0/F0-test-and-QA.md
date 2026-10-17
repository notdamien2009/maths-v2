# F0 completion R2 â€” executed QA

All 17 original F0 components were exercised in the approved local lesson template using installed Microsoft Edge through Playwright on Windows. Exact final source/template identities are recorded in the manifest and source inventory.

| Suite | Executed evidence |
|---|---|
| Lesson integration | 392 assertions across 17 components; all passed |
| Completion contracts | 29 checks; all passed |
| Independent instances/layouts | 25 checks; all passed |
| Accessibility/motion | All 17: keyboard modes, reduced motion, no automated WCAG-tagged axe violations; native-button hiding checked on 16 (F0-02 has no panel button in that state) |
| Pointer/touch | 6 checks; all passed |
| Playback/speech/assessment | 20 checks passed plus one real speech event probe (observational, not a pronunciation certification) |
| Narration coordination | 7 checks; all passed |
| Real speech coordination | 4 checks; all passed |
| Guided examples | 8 checks; all passed |
| Native interactions/guards | 18 checks; all passed |
| Mathematical fidelity | 11 checks; all passed |
| Original native regression | All 17 stage text/SVG-count comparisons matched |
| Game boundaries | All 17: hint deduction, life exhaustion, reset; F0-12 eight-round completion |

The final browser evidence includes distinct configured question states, six-question games, Watch, Explore, four Guided selections, four Bob beats and 1440/1024/390 viewport captures per component. F0-03 was rechecked after its final nonzero-start expression correction; the merged evidence retains matching source/template hashes for all 17.

Native style blocks match the original backup. Mathematical invariants include signed/fractional jumps, fraction bars, plotting/table rules and triangle geometry. Future worked answers remain concealed until reached. Real speech start/boundary/end and pause/resume/cancel were observed; simulated speech separately checks stalled-service fallback and word-cue timing.

Limits: decimal numerals containing digit 4 remain caption-only until pronunciation is verified. Automated accessibility and accessibility-tree checks do not certify a human screen-reader experience. Touch emulation and measured timing samples are not a claim about every physical device. Unsupported mathematical inputs are rejected; new lesson content still requires its own answer/render review. Existing exported lesson HTML must be regenerated to receive embedded updates.

Evidence JSON, reproducible test scripts, fixtures and screenshots are included in the ZIP. Initial R1 reports are superseded by this release.

Axe also reported incomplete checks requiring human review (including colour contrast); zero violations is an automated result, not a complete accessibility sign-off.

Axe also reported incomplete checks requiring human review (including colour contrast); zero violations is an automated result, not a complete accessibility sign-off.
