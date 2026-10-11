# NOVA Maths F4 — Run 14: Core Compatibility & Guarded Rebuild

**Date:** 11 October 2026  
**Scope:** F4 family only. **Status: REVIEW CANDIDATE — CURRENT GITHUB CORE NOT YET BROWSER-VERIFIED.**  
**Repository:** `notdamien2009/maths-v2` at commit `48a7eb7309cb37e6f23efea5204152704f42f03c`.  
**GitHub changes:** NONE.

## Executive finding

This is a **real runtime API mismatch**, not merely a build checksum difference. The GitHub `core/nova-core.js` in the recorded push contains the F12 shape kit, but **does not define** the shared `NOVA.numberLine`, `NOVA.motion`, `NOVA.ui.svgDrag`, or `NOVA.place` APIs used by approved F0/F2/F4 patterns. The corresponding stylesheet lacks `.nv-dragging` and the place-value drag presentation rules. Simply allowing the new SHA in an old builder would risk broken F4 interactions.

This run supplies a **review-only, explicit compatibility overlay**, drawn from the prior canonical F0/F2 core, plus a **separate staging builder**. It **never changes or replaces** either shared core file, any approved engine/source, or GitHub. No permanent repinning of previous individual F4 builders is performed. Unknown versions are rejected rather than blindly accepted.

## Exactly identified core revisions

| Source | JavaScript Git blob SHA | CSS Git blob SHA |
|---|---|---|
| Former F0/F2 core (legacy F4 build baseline) | `45b41ce94d27ed63e877faac6023e483855da76d` | `aad5139b1a5de01983efcb78dee6aabf917ea0a4` |
| GitHub commit `48a7eb7` (F12 core) | `ac0b40a0bf19246ec3a9824798bd67dfe738c91c` | `1830cd68b3a345cbeefae69782bf2b309765d5fa` |

**Important:** These are Git *blob* SHA-1 values, not SHA-256. The original F4 manifests use separate SHA-256: `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21` (JS) and `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4` (CSS).

The active GitHub core version was verified directly against the repository connector. Its missing helpers were independently checked in the retrieved code, not assumed from filename or file size. The earlier core content is verified against the original F4 review pack and its Git blob SHA.

## Review-only compatibility approach

- `compat/nova-f4-f2-compat.js` restores the previous approved v3.5 number-line and v3.6 place/motion/SVG-drag helpers **only inside the generated F4 HTML** when the GitHub F12 core is detected. It is a scoped copy of the old canonical helper implementation, not an invented renderer.
- `compat/nova-f4-f2-compat.css` restores previous place-colour and drag/drop presentation styles **only inside these generated F4 pages**.
- `build/build-f4-run14.py` recognises **only** the two specific version pairs above. A different JS or CSS blob, or mismatched versions, causes a hard failure. It never disables an integrity check.
- If the older approved core is present, no overlay is injected and the review HTML retains the older core behaviour.
- If the exact GitHub F12 core is present, the supplemental functions are inserted into the *generated page* without modifying `core/`.
- The builder stages ten engines under `review/F4-RUN14-stage/`. Existing `F4/*.html`, `src/*`, and `core/*` are never overwritten.
- F4-05 remains the already built F5-11 presentation preset with its embedded runtime; the F5 source is untouched. F4-10 is part of F4-08, not a duplicate build.

## Safe local instructions (Windows)

1. Extract this ZIP into the folder containing your existing `bank-v3-neon-chalk` directory. **Do not copy a `core/` folder: there is none in this ZIP.**
2. Ensure the current core and the original component sources from Run 01–11 plus the F4-06/F4-12 Run 13 repairs are in your local bank.
3. In Command Prompt, `cd` into the `bank-v3-neon-chalk` folder and execute:

   ```bat
   python build\build-f4-run14.py
   ```

   The builder verifies actual Git blob identities and writes **only** `review\F4-RUN14-stage\`.
4. To perform the Chromium browser smoke tests, install Playwright if necessary and execute:

   ```bat
   python -m pip install playwright
   python -m playwright install chromium
   python tests\f4-run14-smoke.py
   ```

   It checks Watch, Guided, Explore and Challenge at 380px and 1280px across all ten staged HTML engines. Expected **80** mode/viewport checks. Running in smaller batches if Chromium stalls is supported:

   ```bat
   python tests\f4-run14-smoke.py --engines F4-01 F4-02 F4-03 F4-04 --report-name F4-RUN14-BATCH-A.json
   python tests\f4-run14-smoke.py --engines F4-06 F4-07 F4-08 --report-name F4-RUN14-BATCH-B.json
   python tests\f4-run14-smoke.py --engines F4-09 F4-11 F4-12 --report-name F4-RUN14-BATCH-C.json
   ```

5. Open the staged pages and independently review the visuals, drag interactions, keyboard controls and challenge answers. **Do not replace the old F4 pages yet** unless the real-current-core tests, your visual stress test and mathematics are satisfactory. Copying staged HTML into `F4/` is an owner decision, not an automatic step.

## QA — verified in this run

| Verification | Result | What it actually proves |
|---|---|---|
| Ten candidate HTML engines staged from original approved core | **10/10** | Build placeholder consistency and correct F4 source/preset mapping |
| Legacy F0/F2-core Chromium smoke, 380px and 1280px × four modes | **80/80** | Existing-core rebuilds load with SVG, helper APIs and no horizontal overflow/JS page errors |
| Scoped overlay against **synthetic** core with old F2 helpers removed | **24/24** | F4-01, F4-08 and F4-12 at both widths/four modes run with the overlay in the missing-helper scenario |
| JavaScript syntax across local F4 source files | **11/11** | Node syntax check only, not full interaction correctness |
| Guard rejects unrecognised core identity | **PASS** | A source mismatch cannot be silently accepted |
| Exact GitHub F12-core Chromium rebuild at user's local checkout | **NOT YET RUN** | This is the remaining critical proof; a simulated core is not the exact live one |
| Exhaustive mathematics / physical touch / normal-motion fast drag under migrated core | **NOT YET RUN** | Earlier run-specific QA does not transfer automatically to a new runtime |
| Owner GOLD visual approval | **PENDING** | Automated checks alone do not grant approval |

The *synthetic* core fixture used in QA is deliberately not distributed as the actual GitHub core. It reproduces the missing-helper condition only, not every difference in the genuine F12 core. The 24/24 result must not be described as GitHub-core validation.

## Known limits and next decision

- This is a safe, reversible **compatibility staging path**, not a global correction to GitHub's shared core. Future F0/F1/F2 components may also need separate compatibility evaluation against the F12 core; Run 14 does not modify them.
- The original per-engine `build-f4-xx.py` scripts retain their old integrity pins. Run 14 supplies `build-f4-run14.py` as a new independent build path rather than weakening those historical guards.
- F4-05's F5-11 preset is purposely frozen to avoid copying or altering F5-11. Verify it remains usable in its standalone page.
- The overlay uses exact approved helper code from the former core, so it is intentionally not a “new visual style.” The established NOVA neon glass/chalk, mathematical colour meaning, mascot dock and accessible interaction practices remain unchanged.
- If the user's actual local core is **neither** recognised Git SHA, the builder must stop. Investigate the source history; do not turn off the guard.

**Decision gate:** Run the guarded stage builder and `tests/f4-run14-smoke.py` against the exact local checkout, inspect selected mobile/desktop maths interactions, and then decide whether to adopt the newly staged pages. **No changes were pushed to GitHub during this run.**
