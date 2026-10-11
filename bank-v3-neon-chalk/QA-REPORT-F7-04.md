# F7-04 · Premium Review QA Evidence

| Gate | Result | Evidence |
|---|---|---|
| Core unchanged | PASS | core CSS SHA256 eaf043ca9db0…; core JS SHA256 1e3a118ed3a3…; both match F0 original; no core changes or core files in ZIP. |
| Preset sharing / stable engine ID | PASS | F7 entry and F3 file use a single F302_CONFIG id=F3-02, with F7-04 preset selector flag; src/F3-02.js. |
| Mathematical validity | PASS | F704_PRESET_MATH.single(factor,constant) and same model() used by scene; examples 2(x+3)=2x+6, 3(x+2)=3x+6, 4(x+5)=4x+20, 5(x+1)=5x+5. |
| Six subject-specific narrated steps | PASS | src/F3-02.js F704_STEPS and F704_TALK; all use same F0 timeline/narration. |
| Drag, invalid, keyboard, challenge | PASS | tests/f704-interaction-results.json: 39/39 passes at 380px and 1280px, normal/reduced motion, rerun after canonical F3 source alignment. |
| All 4 modes and width smoke | PASS | tests/f704-browser-results.json original sweep 73/73 across 320/380/768/1280. Following alignment to current F3 source, final_smoke_f704.py passed 25/25, including F3 baseline regression. The first sweep is supplemental, not counted as a post-patch rerun. |
| Responsive visual evidence | PASS | shots/F7-04/ includes 380/1280 final F0-aligned stage captures in all four modes; desktop and mobile owner review still pending. |
| Challenges and non-leakage | PASS | Challenge stage hides calculated total and partial results until learner places 2 product cards. tests/interaction_f704.py completes all 4 tasks. |
| Owner GOLD approval | PENDING | User must evaluate feel, look and mathematics in actual lessons. |

**Known limitation:** On some laptop-height viewports the full stage requires normal page scrolling to reach the lower drag tray; native mouse dragging works with the stage in view. It is not a fixed-height no-scroll lesson shell.

**Integration note:** The canonical F3-02 engine must be replaced with this targeted revised source for the F7 preset to work in the main family gallery. Do not install F7 entry while leaving the previous F3 source unchanged if the goal is shared-preset behaviour.

**GitHub provenance:** reconstructed current F3-02 baseline JS git object `79d8292a8a7232a52549eea41c54a7e86bbf4341` and unchanged F3-02 CSS git object `3e2be5ce30689c6e52d5b035a1b0b096f9e33346`, both validated by `git hash-object` against current GitHub object IDs. `docs/F7-04-TARGETED-DIFF.patch` records the complete JS change.
