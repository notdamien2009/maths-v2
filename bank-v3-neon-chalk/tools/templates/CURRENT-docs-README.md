# NOVA Maths Bank — Documentation Index

**Current handover:** [`../HANDOVER-v4.md`](../HANDOVER-v4.md)  
**Editable master:** [`../00-master/nova-master.html`](../00-master/nova-master.html)  
**Approved fraction rule:** [`../F5/F5-FRACTION-NOTATION-LOCK.md`](../F5/F5-FRACTION-NOTATION-LOCK.md)

## Important working documents

| File | Role |
|---|---|
| `../00-master/nova-master.html` | **One authoritative visual production master** |
| `../00-master/nova-master-updated.html` | Redirect to the master; never an independent editable copy |
| `../00-master/NOVA-MASTER-FOR-OTHER-AI.md` | Generated portable prompt export; SHA-256-linked to the master |
| `../HANDOVER-v4.md` | Current project state and next-run guidance |
| `MASTER-GOVERNANCE.md` | How to keep master, export and trackers in sync |
| `PRODUCTION-SOURCE-MAP.md` | Actual checked-in files vs obsolete historical references |
| `CORE-INTEGRATION-GATE.md` | Shared-core mismatch, recovery and QA guardrails |
| `CORE-CONTRACT-AUDIT-2026-10-11.md` | Locally generated API-presence evidence (created by repair installer) |
| `../assets/helpers/registry.json` | Native in-core Pip/Nova/Izaac slots; not external sprite packs |
| `../prompts/specs/specs.json` | Generated extraction of the canonical SPEC object |

The `F*-SPEC.md`, `F*-QA-REPORT.md`, `F*-RUN*.md` and JSON results are evidence and run-specific specifications. They are **not** an alternative master; dated results must never be represented as current post-change QA without rerunning the tests.

## After any edit of the canonical master

From the `bank-v3-neon-chalk` directory:

```sh
node tools/export_master_prompts.js
python prompts/specs/gen.py
node tools/export_master_prompts.js --check
python prompts/specs/gen.py --check
```

For a local source/core audit (without changing runtime):

```sh
python tools/core_contract_audit.py
```

## Status and provenance

This documentation index reflects the GitHub tree audited on **11 October 2026** plus local-only documentation repair. It does not mean F3/F6/F7/F8/F9/F10 previews are owner-signed GOLD. No GitHub writes are performed by this pack.
