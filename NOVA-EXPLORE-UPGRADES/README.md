# NOVA Maths V2 — F0–F18 Explore Upgrade Laboratory

**Branch:** `nova/explore-f0-f18-vnext-2026-10-28`  
**Workspace:** `NOVA-EXPLORE-UPGRADES/`  
**Baseline:** `fe64a23dc402f08f5c8c7442c80545fbcb7901d3` (`main`)  
**Scope:** 274 HTML components across F0–F18, plus matching production support and test folders.

## SAFETY / ISOLATION
- This development branch is independent of `main`. Never modify `NOVA-production/` source originals in this branch.
- Edit **only** the copied components in this `NOVA-EXPLORE-UPGRADES/F0`–`NOVA-EXPLORE-UPGRADES/F18` workspace and approved companion code here.
- The live lesson HTML and Vercel production remain unchanged. **Do not merge this branch or deploy it to production** until separately approved and accepted.
- Original baseline paths, blob hashes and sizes are frozen in `BASELINE-MANIFEST.json`.
- Do not automatically replace existing lessons after changing a component; first validate Watch/Explore/Guided and lesson-integrated regression tests.
- Changes to current, locked lesson shells, component hashes, registries and source mapping require a proposed new version and passing QA.

## WORKFLOW
1. Check component against `BASELINE-MANIFEST.json` and the current master mapping.
2. Define a meaningful mathematical Explore improvement; preserve original functioning controls.
3. Version the candidate inside this workspace; do not change its source sibling `NOVA-production/`.
4. Test classroom pedagogy, mathematical result, control states, reset, keyboard, mobile, narration and all supported modes.
5. Maintain a migration manifest mapping old source blob SHA to verified new component blob SHA, routes and lesson IDs.
6. After approval, prepare an independently validated ZIP/patch for lesson integration. No bulk production write without review.

## PILOT ORDER
- F9-01 Matchstick Pattern Builder — build and justify pattern rules.
- F12-14 Area/Perimeter Relationships — compare shapes with fixed constraints.
- F10-05 Graph Explorer — predict gradient and intercept and construct matches.
- F17-03 Probability Simulator — prediction and experimental vs theoretical results.
- F7-08 Balance Scales — preservation/regression benchmark.

**Source note:** The connected repository held 274 current HTML files at baseline; earlier archive planning counted 270. The newer live repository paths take precedence for this laboratory and any mappings/hashes need reconciliation.

No files here are consumed by the live Maths V2 lessons unless a later explicit integration changes those references.
