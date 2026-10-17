# NOVA F4 production release (2026-10-16)

F4 holds 11 engine files (F4-01…F4-09, F4-11, F4-12) and 12 component IDs:
- **F4-10** (Bar-to-equation translator) is a preset of F4-08, with an equation overlay on the algebra bar.
- **F4-05** is the F5-11 fraction-of-amount engine run in its bar preset.

All 12 IDs pass in the approved template with the canonical F0-12 controller. The manifest marks `challengeReady: true` for all 12. See `F4-individual-audit.md` for the per-component decisions, `F4-capability-manifest.json` for domains and fields, `F4-configuration-examples.json` for lesson records, `F4-template-integration.md` for the usage contract, and `F4-test-and-QA.md` for the evidence.

Rerun: install Playwright (`npm ci` in `integration/`) and a Chromium or Chrome browser. Set `NOVA_CHROMIUM_PATH` if it is not at `/usr/bin/google-chrome`, then run the two test scripts from the project root. Rebuild any exported lessons, because they embed source snapshots.
