# F6 production (2026-10-17)
- 11 F6 engines upgraded with the F0-12 Challenge wired in: F6-01…07, 09, 10, 11, 14. All have challengeReady = true.
- F6-08, F6-12 and F6-13 are config-only presets of the host engines F10-05, F18-02 and F14-11, which do not exist yet. They are delivered unchanged, with challengeReady = false.
- F6-FAMILY-GALLERY.html is unchanged.

Read in this order:
1. status-table.md
2. F6-individual-audit.md
3. F6-capability-manifest.json
4. F6-template-integration.md
5. F6-code-changes.md
6. F6-test-and-QA.md

Merge: copy `NOVA-F0-F3-production/` over the repo root, then replace the 14 F6 rows in `integration/component-adapters.json` with `integration/F6-adapter-rows.json`. See `../../../MERGE-NOTES.md`.
