# F8 test and QA
All tests ran in real Chrome (Playwright 1.63, headless Google Chrome) against the repo root with the canonical template, at 1440, 1024 and 390 px.

| Suite | File | Result |
|---|---|---|
| Semantic production (47 checks per engine) | integration/qa/test-f8-production.cjs | 846/846 |
| Native regression (default presets, original vs upgraded, axe-core criticals) | integration/qa/test-f8-native-regression.cjs | 213/213 |
| Resize 390/1024/1440 (layout after resize = fresh load, learn + challenge) | integration/qa/test-f8-resize.cjs | 216/216 |
| Bank regression (repo component test: modes, steps, data.lesson hook changes the view, invalid data rejected, guided, Bob) | integration/qa/test-components.cjs with NOVA_ONLY_IDS | 18/18 |

The semantic suite checks:
- The contract rejects impossible data. Two distinct question states each draw their own values.
- The answer is concealed in text, aria and data attributes. Every Challenge round draws its own apparatus with no reveal.
- A wrong answer holds the round and costs a life. Six correct answers auto-advance and complete with the canonical score of 85, a badge and confetti. Reset and hint cost work.
- Guided stage 1 hides the answer.
- Style locks: userSpaceOnUse glow, Chalk font, no duplicate IDs.
- Widths 1440, 1024 and 390.
- **Pupil state kept on resize:** native Explore and the live F0-12 Challenge are changed by pupil actions, then resized 1440→390→1440. Panel text, inputs, stage values and buttons must all match, and the F0-12 host must survive.
- **Phone labels:** after 1440→390 and on a fresh 390 load, the SVG label median is ≥ 11 px and the smallest 10% is ≥ 8 px, with no horizontal overflow.

Before the browser suites, `tools/f8/probe8.cjs` rendered all 108 questions concealed and at phases 0/2/4/6. Each one was checked for validity, answer leaks and expected values. Answers that matched apparatus labels (for example "LINE 3", "Step 3" or a tray value) were redesigned.

Run: `bash tools/f8/run-f8.sh` from the repo root. It needs `integration/node_modules/playwright` and axe-core, which are not shipped.

Evidence:
- `evidence/per/semantic-browser-F8-xx.json`
- `evidence/native-regression.json`
- `evidence/resize-390-1024-1440.json`
- `evidence/bank-regression-results.json`
- `screenshots/`
