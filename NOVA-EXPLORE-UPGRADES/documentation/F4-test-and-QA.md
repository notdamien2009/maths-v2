# F4 executed QA

Run headless with Google Chrome 154 on Linux, through Playwright 1.62.1 (`integration/node_modules`). Tests used the actual upgraded native files, the original files from `originals.zip` for regression, and the approved lesson template: the combined F0–F3 copy carrying the canonical F0-12 controller. The F0–F3 audits used Microsoft Edge on Windows. Set `NOVA_CHROMIUM_PATH` to rerun with a different browser.

- **396/396 template assertions** (`test-f4-production.cjs` → `semantic-browser.json`). There are 33 per component across 12 IDs, with F4-10 run through the F4-08 file as its preset. They cover:
  - contract accept and reject;
  - two distinct question states, with the givens rendered and the answer concealed in visible text, aria and `data-*`;
  - `userSpaceOnUse` glow filters and NOVA Chalk fonts on SVG text;
  - two original views with no duplicate IDs;
  - native Explore and lesson-authored Watch motion advancing phases;
  - the full six-question F0-12 game: a wrong answer holds and costs a life, five automatic advances, canonical score 85 with 2 lives and best streak 6, badge and confetti, reset, hint cost, and a retry resetting the streak;
  - every round showing its own apparatus with no answer revealed;
  - four Guided stages, with stage 1 hiding the answer, and four Bob beats;
  - page and frame containment at 1440, 1024 and 390, with no runtime errors.
- **126/126 native assertions** (`test-native-regression.cjs` → `native-regression.json`):
  - Every original Watch step (all native steps, all 11 files) renders identical text and SVG node counts before and after the upgrade.
  - The native page has no horizontal scroll at 1440, 1024 and 390.
  - Explore exposes keyboard-focusable controls.
  - A pointer drag of the first SVG drag handle to the stage centre leaves nothing stranded and no live drag state. F4-04 and F4-11 are the exception: their drag only appears after the first native action, so it was not exercised automatically.
  - Native Challenge still mounts.
  - axe-core on the stage found no critical violations. Non-critical findings are retained for human review: [].
- **Screenshots** (`screenshots/`): `<id>-challenge-{1440,1024,390}.png` for the F0-12 host, `<id>-native-watch-{1440,1024,390}.png`, `<id>-guided-1440`, `<id>-bob-1440`, `<id>-badge-1440`, and `F4-10-overlay-phase{1,3}-{1440,390}.png`.
- **Fixtures** (`fixtures/<id>.html`): complete, reproducible template lessons, each with six Challenge records, four Watch records, four Guided stages and four Bob beats.

A–I coverage for every ID:
- A/I: baseline and regression via native-regression.
- B: alternative lesson, six different numerical states.
- C: custom Watch, via phases and motion.
- D: focused Explore, via the shared Explore policy (native controls).
- E: question-specific Challenge.
- F: Guided.
- G: multiple instances.
- H: template mounting.

Not covered:
- Human screen-reader testing.
- Real-device touch.
- Real speech playback for F4.
- An F4 Watch pause/resume UI test; the shared runtime behaviour is tested on F3-09.
- Pixel diffs.
- Exhaustive sweeps of every numerical combination.

Reproduce from the project root: `node audit/f4-production-2026-10-16/test-f4-production.cjs`, then `node audit/f4-production-2026-10-16/test-native-regression.cjs`, then `python3 audit/f4-production-2026-10-16/build-reports.py`.
