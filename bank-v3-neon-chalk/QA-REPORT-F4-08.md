# F4-08 premium review: evidence-based quality gate

**Status:** Coded and machine-tested; owner visual and learner stress approval **PENDING**. Do not classify as final GOLD.

| Check | Source evidence | Outcome |
|---|---|---|
| Canonical NOVA core unchanged | `core/nova-core.js` SHA256 `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`; CSS SHA256 `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`; `build/build-f4-08.py` refuses changed hashes | Verified |
| Neon Tube & Chalk | `src/F4-08.js` uses `N.neonBox`, `N.neonPath`, `N.chalkText`; CSS is scoped to `#F4-08`; 12 real-browser screenshots in `shots/F4-08` | Verified in screenshots; subjective review pending |
| Mathematical validity & misconception feedback | `window.F408_MATH.checkMath` enforces correct x-part count, known b, balanced subtract, remainder, equal division, x and F4-10 mapping; tests validate both positive and negative paths | 110/110 browser/maths/accessibility checks |
| No invented expression value | `checkMath` does not request x for `Y7-034`; `diagram` never reveals a value or nonexistent total for expression mode; browser test specifically rejects `null` displayed to pupils | Verified |
| F4-10 is preset, not duplicate engine | `window.F408_CONFIG.presets.F4-10`; drag ordered semantic equation terms into three real slots; no standalone F4-10 HTML | Verified |
| Drag, snap, regrab, return, cancellation | `N.ui.svgDrag`; `tests/test_f408_drag.py` verifies actual pointer events on 380px/1280px both normal and reduced motion. Red return zone, fast flicks, invalid drops, Escape, equation-term snapping | 52/52 drag checks |
| Mobile and desktop | `shots/F4-08/F4-08-380-*.png` and `F4-08-1280-*.png`; browser checks for no horizontal overflow, one SVG/mascot dock and three cards | Verified |
| Real playback/modes | F0 `bankMount` 8-step Watch/Guided timeline, Explore preset selector, Challenge sequence, Bob slot and existing mascot dock | Verified; audio TTS playback is environment-dependent |
| Keyboard and reduced motion | Keyboard Enter adds and Delete removes; F4-10 button places matching equation terms; SVG focus/labels; reduced-motion tests | Verified for listed paths |
| No game logic / dev leakage | No local game scoring, `N.events` allowlisted, specs hidden under `details.nv-dev`, standard F0 shell | Verified |
| Self-contained reproducible build | `build/F4-08.src.html` + files build into `F4/F4-08-algebra-bar.html` deterministic, independent of internet and previous F4 source | Verified via SHA256 rebuild test |
| Owner acceptance | Direct comparison with accepted F0, F1, F2, F5; manual learner usability and intended GOLD signoff | **PENDING** |

### Mathematical proof examples
`3x + 5 = 26` → subtract 5 from both sides → `3x = 21` → divide three equal groups → `x = 7` → substitute `3 × 7 + 5 = 26`. Forming an expression (`2x + 4`) does not imply a numerical solution; `F4-10` translates the visual `2x + 5 = 19` into three exact terms before the model accepts `x=7`.

### QA totals
- `tests/F4-08-BROWSER-RESULTS.json`: **110/110** passed; 0 recorded JavaScript errors, 0 detected horizontal overflows in tested views.
- `tests/F4-08-DRAG-RESULTS.json`: **52/52** passed under both motion settings and two screen widths.
- **Grand total: 162/162 passed.** These are the implemented tests, not a claim of exhaustive cross-device verification.

No GitHub modifications were made.
