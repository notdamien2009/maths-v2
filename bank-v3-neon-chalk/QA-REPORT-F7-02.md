# F7-02 Zero-Pair Animation — evidence-based QA

**Build:** Premium review candidate, NOT owner-approved GOLD. The full standalone HTML was generated from `build/F7-02.src.html` with `build/build-f7-02.py`, reading the locked bank core without modifying it.

| Gate | Evidence | Outcome |
|---|---|---|
| Canonical F0 core | `core/nova-core.js` SHA-256 `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`; CSS `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`; matches F7-01 reference | PASS |
| Styles and helpers | `src/F7-02.js`: all mathematical tiles and the zero ring are made with `NOVA.neonBox`, `neonLine`, `neonRing`, `chalkText`. `src/F7-02.css` changes only local layout. | PASS |
| Mathematical zero-pair invariant | `src/F7-02.js`, `undoPair()` and `proof()`: a cancellation requires one +1 and one −1; `pair()` verifies net unchanged and emits one pair event. Also checked in `tests/interaction_f702.py`. | PASS |
| Four-mode browser render | `tests/qa_f702.py` plus `tests/f702-browser-results.json`: two widths × four modes. Eight browser captures in `shots/F7-02/`; no observed overflow or uncaught page exception. | **28/28** |
| Native drag, keyboard, undo, removal, Challenge | `tests/interaction_f702.py`, `tests/f702-interaction-results.json`: real Playwright mouse moves in SVG, drag opposite pairs, red return tray, invalid same-sign target, Escape, Enter, reset and four signed Challenge results at two widths. | **46/46** |
| Fast motion stress | `tests/stress_f702.py`, `tests/f702-stress-results.json`: 320/768, normal/reduced motion, single-step high-speed flicks, invalid returns, Escape and no stranded pointers. | **28/28** |
| Visual stage captures | `shots/F7-02/F7-02-{380,1280}-{watch,explore,challenge}-STAGE.png`; F0 Chalk font, two distinct sign-encoded tile styles, visible zero ring, matched pairs animate into it. | Browser captures produced; owner visual sign-off still required |
| Mascot and narration | F0 helper dock uses engine-specific changing short speech and poses in `src/F7-02.js`. Five distinct `STEPS[].narration` strings for Sir Bob. Helper alt text is guarded. | Implemented, voice playback not independently auditioned |
| Print, reduced motion and keyboard | `src/F7-02.css` print fallback; `src/F7-02.js` Enter/Space for signed-tile selection and drag source, Delete for Explore return, buttons for cancellation/Undo/Reset; F0 reduced-motion tween handling. | Tested in browser; no full accessibility certification claimed |
| GOLD acceptance | Need owner side-by-side comparison against F2-01/02/03 and real pupil stress test. Full NOVA lesson-shell integration not performed. | **PENDING** |

**Combined completed test assertions: 102 PASS / 102 executed.** This count covers scripted tests, not an independent mathematical formal proof or full screen-reader audit.

## Guard notes

- Correct signed notation in all worked examples. No fractions used; F5 fraction notation lock remains untouched.
- The Explore equation readout updates with placed and removed tiles; Challenge hides the value until verification.
- Developer details are collapsed; mathematical lesson mappings are not visible on stage.
- No GitHub changes, no changes to F0/F1/F2/F3/F5 or existing F7-01 source.
