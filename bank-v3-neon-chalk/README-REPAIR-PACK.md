# NOVA Maths — 11 October 2026 Repository Governance Repair

**LOCAL OVERLAY + ONE-TIME REPAIR. NO GITHUB OPERATIONS. NO CHANGES TO F0–F18 ENGINE HTML OR THE SHARED CORE.**

## Installation (Windows)

1. Finish your current local repo work and make a backup or note any uncommitted edits.
2. Extract the ZIP at the `maths-v2` folder level. Merge its `bank-v3-neon-chalk` folder with the EXISTING `bank-v3-neon-chalk` folder. It adds new scripts/docs. The installer backs up and then replaces `docs/README.md` with the current documentation index.
3. Inside `bank-v3-neon-chalk`, double-click **`APPLY-NOVA-REPAIRS.cmd`**. This safely patches the existing full-size master in place, replaces `nova-master-updated.html` with a redirect, generates fresh full portable prompts from the canonical master, extracts the studio SPEC JSON, and clearly marks the historical handover/run READMEs.
4. Run **`VERIFY-NOVA-REPAIRS.cmd`**. Open `00-master/nova-master.html`, `HANDOVER-v4.md`, and `docs/CORE-CONTRACT-AUDIT-2026-10-11.md`. Inspect the Git diff before deciding whether to push.

Python 3 and Node.js are required to build the generated portable prompt copy from the existing master. The script stops BEFORE modifying master files if Node.js is unavailable or if the four guarded master/handover files do not match the audited tree. It does not run `git`, push, overwrite core code, or delete files.

A **local safety backup outside your Git repository** is created under `~/NOVA-MATHS-REPAIR-BACKUPS/` before anything is patched, so historical evidence is preserved without uploading backups into GitHub.

## What is repaired

- Owner-locked fraction display is reflected in the master/shared prompt rules: **NOVA Chalk stacked numerator/bar/denominator**, no TBD. This honours the existing approved F5 rule; it does not reopen design.
- A single canonical master; the second HTML name becomes a redirect and Markdown prompts regenerate automatically from the same canonical prompt functions, with source SHA-256 and `--check`.
- Rebuilds the exact studio `SPEC` output (`prompts/specs/specs.json`) from the master, and documents missing old source scripts truthfully.
- Adds a virtual helper-art API registry, avoiding misleading references to external pack80/pack60 folders that are not tracked. This does not invent art files.
- Creates a current handover v4, replaces the outdated docs index, and labels v3 and the run READMEs as historical.
- Creates a static core-vs-reference compatibility report. **It does not attempt unsafe changes to missing motion, drag or number-line APIs.** Those require a separate approved runtime/QA task.

## What remains intentionally outside this scope

- No F0–F18 component engine, CSS, shared JS core or maths behaviour is rewritten.
- No replacement mascot poses are invented.
- No completed preview is silently declared GOLD-approved.
- No bulk screenshot/ZIP files are deleted or Git history rewritten.
- No speculative F5/F6/F7 missing-engine or alias changes are made.

The audited baseline master is exact `main` Git tree `da475d2753ea97c784be7705a9d72902024de48e`. If your local master differs, installer refuses to overwrite it; review and reconcile the change first.
