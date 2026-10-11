# Repair Package QA

- Audited GitHub main tree ID: `da475d2753ea97c784be7705a9d72902024de48e`.
- Verified required canonical-master anchor strings directly against GitHub: both old fraction rule locations, shared `STD` declaration, F0 section anchor, `SPEC` block, and prompt functions.
- Compared checked-in core byte signatures against F3-01 compiled preview to confirm API-contract drift.
- Executed Python syntax compilation on the repair, core-audit and studio-spec scripts.
- Executed Node.js syntax validation on the master exporter.
- Ran isolated smoke test verifying the master patch replaces obsolete fractions and inserts the owner-approved rule.
- Ran synthetic end-to-end `node tools/export_master_prompts.js`, `--check`, `python prompts/specs/gen.py`, `--check` with 19 families, 202 lessons, 18 assessments and 160 studio specs. All passed.

**Limit:** It has NOT been run against your full local 630 KB master or 849 KB portable Markdown, because the repair package is distributed as a safe, checksum-guarded overlay that patches your own exact local copies. The installer aborts before touching the master if its Git blob hashes do not match the audited checkout, and backs up all target documents outside Git before writing. Post-install verification runs locally. No browser QA on F0–F18 is implied or claimed.
