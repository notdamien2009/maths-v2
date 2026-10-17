# F5 production audit — start here

**Engines:** `F5/` (18 files; F5-08 = F5-03 `multiply` preset). **Status:** PASS WITH LIMITATIONS for all 18, and challengeReady is true for all 18 (see `status-table.md`).

**Read:**
- `F5-individual-audit.md`: per-component compliance checklist covering F0, F1, F2, F3, template and bank regression, each pass/fail with evidence.
- `F5-capability-manifest.json`, `F5-configuration-examples.json`, `F5-code-changes.md`, `F5-test-and-QA.md`, `F5-template-integration.md`.

**Evidence:** `evidence/` (raw JSON, logs), `screenshots/native` (216 JPEGs: 18 × 4 modes × 3 widths), `screenshots/challenge` (template F0-12 at 390/1024/1440), `../../test-lessons/f5/` (the executed template fixture lessons).

**Reproduce:** from the project root, with `integration/node_modules` installed, run `tools/f5/run-f5.sh`. Edit its `cd`/`NODE_PATH` lines first, and set `NOVA_CHROMIUM_PATH` if Chrome is not at /usr/bin/google-chrome. To rebuild the engines, run `tools/f5/patch_f5.py` against the originals in `F5-originals.zip`.

Exported lessons embed source snapshots, so they must be regenerated to pick up these engines.
