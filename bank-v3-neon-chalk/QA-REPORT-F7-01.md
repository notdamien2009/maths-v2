# F7-01 Algebra Tiles · QA evidence · Run 01

**Status: browser-tested review candidate. NOT owner-approved GOLD.** No repository changes made.

| Gate | Result and evidence |
|---|---|
| Canonical core | Standalone HTML compiled using the original shared F0 core from the F3-15 accepted-source production pack; SHA256 JS `1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21`, CSS `eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4`. No core file included in incremental ZIP. |
| Source reproducibility | `build/F7-01.src.html` + `build/build-f7-01.py` expands placeholders from existing `core` plus `src/F7-01.js`, `src/F7-01.css` and creates `F7/F7-01-algebra-tiles.html`. |
| Mathematical integrity | `src/F7-01.js`: `coefficients()` sums signed x², x, and 1 independently, `expression()` gives signed canonical form, `mistake()` provides individual errors for wrong x²/x/1 and coefficients. Exact four Challenge tasks passed. |
| Mathematical content | `docs/F7-01-SPEC.md`: Y7-029, Y7-031 plus signed and GCSE extensions. Distinct tile dimensions x²=L×L, x=L×u, 1=u×u. |
| Premium drawing | Every shape uses canonical `NOVA.neonBox`, `neonLine`, `chalkText`; second negative-sign cue uses diagonal hatching. Core's F0 mascot and step-specific brief utterances are retained. |
| Modes / responsive | `tests/qa_f701.py` result: **26/26 pass** at widths 380/1280, checking modes, no horizontal overflow, no JavaScript page errors. Eight actual screenshots in `shots/F7-01/`. |
| Keyboard + drag | `tests/interaction_f701.py`: **22/22 pass**, including genuine native SVG tray-to-lane drag, drag-to-flip, Enter/labelled button tile additions, F-key flip, Delete removal, Challenge progression at 380/1280. |
| Stress / challenge | `tests/stress_f701.py`: **29/29 pass** at 320, 380, 768 and 1280 in reduced + normal motion: drag placement, invalid drop, Escape cancellation, no stranded drag, page errors/overflow. Also completes all four Challenge rounds. |
| Hygiene / accessibility | User-facing lessons IDs only in dev specification; tile groups have aria labels; SVG includes alt description; original mascot image alt provided by F0 helper; keyboard actions and print-specific CSS. |
| Owner review | **PENDING**: looks, spacing, speech feel and mouse feel versus F0/F1/F2. No full NOVA lesson-shell integration test claimed. |

## Test command

From the incremental merged bank root, with Playwright + Chromium available:

```
python tests/qa_f701.py
python tests/interaction_f701.py
python tests/stress_f701.py
```

The scripts use Chromium `executable_path='/usr/bin/chromium'` locally; update the executable path to suit Windows. Tests load the self-contained HTML through Playwright `set_content()` so browser network navigation permission is not needed.

**Honesty about scope:** 77/77 assertions reflect the tested local cases and screen widths, not an independent certification of every possible drag path, WCAG conformance or lesson-shell integration.
