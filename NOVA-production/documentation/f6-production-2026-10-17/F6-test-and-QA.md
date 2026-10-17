# F6 test and QA
All tests ran in real Chrome (Playwright 1.63, headless Google Chrome) against the repo root with the canonical template, at 1440, 1024 and 390 px.
| Suite | File | Result |
|---|---|---|
| Semantic production (47 checks per engine) | integration/qa/test-f6-production.cjs | 517/517 |
| Native regression (default presets, original vs upgraded, axe-core criticals) | integration/qa/test-native-regression.cjs | 132/132 |
| Resize 390/1024/1440 (layout after resize = fresh load, learn + challenge) | integration/qa/test-f6-resize.cjs | 132/132 |
| Bank regression (repo component test: modes, steps, data.lesson hook changes the view, invalid data rejected, guided, Bob) | integration/qa/test-components.cjs with NOVA_ONLY_IDS | 11/11 |

What the semantic suite checks:
- Contract rejects impossible data; two distinct question states, each drawn with its own values.
- Answer concealed in text, aria and data attributes; every Challenge round draws its own apparatus with no reveal.
- Wrong answer holds the round and costs a life; six correct answers auto-advance and complete with canonical score 85, badge and confetti; reset; hint cost.
- Guided stages: stage 1 hides the answer.
- Style locks: userSpaceOnUse glow, Chalk font, no duplicate IDs.
- Width checks at 1440/1024/390.
- **Pupil state kept on resize:** native Explore and the live F0-12 Challenge are changed by pupil actions, then resized 1440→390→1440. Panel text, inputs, stage values and buttons must all match, and the F0-12 host must survive.
- **Phone labels:** after 1440→390 and on a fresh 390 load, SVG label median ≥ 11 px and smallest 10% ≥ 8 px, with no horizontal overflow.

Run: `bash tools/f6/run-f6.sh` from the repo root. Needs `integration/node_modules/playwright` (not shipped).

Evidence:
- `evidence/per/semantic-browser-F6-xx.json`
- `evidence/native-regression.json`
- `evidence/resize-390-1024-1440.json`
- `evidence/bank-regression-results.json`
- screenshots in `screenshots/` (`resize/` holds the 390 post-resize phone shots).
