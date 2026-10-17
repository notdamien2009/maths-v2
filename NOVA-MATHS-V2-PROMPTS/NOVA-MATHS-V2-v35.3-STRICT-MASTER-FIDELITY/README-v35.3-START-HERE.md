# NOVA Maths V2 — v35.3 STRICT MASTER / QUESTION-VISUAL FIDELITY

**MASTER SHA256** `992550e1b224ab1846a0e353bdc65bd84e77bbcd82f5f63f23cc648f89e74b19` — copied unchanged as `master/nova-master-LOCKED.html` and parsed into `master/master-curriculum-map-LOCKED.json`. Mapping has 202 teaching lessons, 26 aliases. For an updated master, extract and lock again; never use the snapshot against a different master without comparison.

**Start here:** Read `V35.3-MASTER-AND-VISUAL-FIDELITY-CONTRACT.md` and the matching numbered run prompt (01–04). Source visuals come from the approved local Library snapshot of GitHub `notdamien2009/maths-v2/NOVA-production` (all F0–F18), not the superseded F0–F3 ZIP. GitHub is used to refresh the snapshot, not fetched during individual lesson runs. Use `tools/verify_master_fidelity.py` for immutable map locking and checks. The checker cannot substitute for browser/manual mathematical proof.

**Critical differences from v35.2:** exact `MAP` + `AL` + named `LS` activity are binding; original canonical F0-12 must execute; EVERY displayed diagram in Start, Practice and Exit must show that question's public quantities; Bob Board needs full 4-beat teaching explanations over five linked stages; all modes must preserve original native apparatus and synchronised TTS; hard-fail wrong/absent bindings; don't end runs with fixable defects; owner does year-end audit, not per-lesson QA.

**Production order:** Run 1: lock authoritative map, correct mathematics and assessments; Run 2: exact native state and Bob narration; Run 3: actual executable lesson with source-backed visuals; Run 4: browser proof, repairs and acceptance. Status for Run 3 always REVIEW.

**Test case**: `examples/Y7-001-MASTER-LOCK-EXAMPLE.json` is generated from locked master and full-library snapshot and shows exact 5 IDs and explicit F2-04 alias. If you see just F2-01/F2-03/F2-08, or a custom F0-12 controller, or no Digit Vault, reject the lesson.

**Files:** 4 detailed revised run prompts; v35.3 contract; exact master+parsed map; source reference/docs retained from v35.2; templates; machine checker and examples. The full original executable component library is in the separate `NOVA-production` folder and should be saved as an immutable, hash-verified local Library snapshot before lesson production.


**Upstream source lock (17 October 2026):** `notdamien2009/maths-v2/NOVA-production` supersedes the old F0–F3 ZIP. Preserve the original F0–F18 files, exact LS/MAP/AL mappings and aliases, and F0-12 provenance. `F5-08` is specified as a lesson-configurable multiplication preset of F5-03 Precision Area Model; test that the preset is genuinely present before claiming it works. The current preflight's `--source-zip` input may point to a ZIP made from the complete local Library snapshot, not the superseded subset.
