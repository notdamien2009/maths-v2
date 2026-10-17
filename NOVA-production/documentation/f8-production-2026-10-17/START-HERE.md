# F8 production (2026-10-17)
- All 18 F8 algebra engines (F8-01 to F8-18) have been upgraded with lesson data, contracts, resize-safe relayout, the phone-label floor and the F0-12 Challenge. 18 of 18 have challengeReady = true (see status-table.md).
- F8-gallery.html is unchanged.

Read in this order:
1. status-table.md
2. F8-individual-audit.md
3. F8-capability-manifest.json
4. F8-template-integration.md
5. F8-code-changes.md
6. F8-test-and-QA.md

Merge: copy `NOVA-F0-F3-production/` over the repo root, then replace the F8 rows in `integration/component-adapters.json` with `integration/F8-adapter-rows.json`. See `../../../MERGE-NOTES.md`.
