# F10 test and QA
All tests ran in real Chrome (Playwright, headless Google Chrome) against the repo root with the canonical template, at 1440, 1024 and 390 px.

| Suite | File | Result |
|---|---|---|
| Semantic production (48 checks per engine) | integration/qa/test-f10-production.cjs | 960/960 |
| Native regression (default presets, original vs upgraded, axe-core criticals) | integration/qa/test-f10-native-regression.cjs | 240/240 |
| Resize 390/1024/1440 (layout after resize = fresh load, learn + challenge) | integration/qa/test-f10-resize.cjs | 240/240 |
| Bank regression (repo component test: modes, steps, data.lesson hook changes the view, invalid data rejected, guided, Bob) | integration/qa/test-components.cjs with NOVA_ONLY_IDS | 20/20 |

The semantic suite is the F8 suite plus one check: each engine's own rule must reject an impossible engine-specific state (generic limits alone are not enough). It also checks:
- Two distinct question states each draw their given values; the answer is concealed in text, aria and data attributes (for F10-17 choice rounds: no matched, focused or selected graph and no proof text).
- Every Challenge round draws its own apparatus with no reveal. A wrong answer holds the round and costs a life. Six correct answers auto-advance and complete with score 85, a badge and confetti. Reset and hint cost work.
- Guided stage 1 hides the answer; Guided and Bob show at least 3 distinct stages.
- Style locks: userSpaceOnUse glow, Chalk font, no duplicate IDs. Widths 1440, 1024 and 390.
- Pupil state kept on resize (Explore and live F0-12 Challenge, 1440→390→1440).
- Phone labels: after 1440→390 and on a fresh 390 load, SVG label median ≥ 11 px and 10th percentile ≥ 8 px, no horizontal overflow.

Before the browser suites, `tools/f10/probe10.cjs` rendered all 120 questions concealed and at phases 0/2/4/6 and checked validity, answer leaks (including unicode-minus forms), expected givens, distinct rounds and bad-state rejection. Answers equal to axis labels were redesigned (decimals, off-axis values, "x, y" or "a, b" answers).

Run: `bash tools/f10/chain.sh` (place it in `audit/f10-production-2026-10-17/` with the QA files) or `bash tools/f10/run-f10.sh`. It needs `integration/node_modules/playwright` and axe-core, which are not shipped.

## Extra checks
- Challenge game at 390 px (`integration/qa/test-f10-game-390.cjs`, evidence `evidence/f10-game-390.json`): 20/20 engines pass. After 1440→390 the game repaints in the narrow layout (viewBoxes and widths match a fresh 390 load), with no hidden copy of the drawing in the game or the page.
- F6-08 hosted by F10-05 (`integration/qa/test-f6-08-host.cjs`, evidence `evidence/f6-08-host.json`): 22/22.
