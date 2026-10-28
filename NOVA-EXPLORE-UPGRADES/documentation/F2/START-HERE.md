# NOVA F2 production release

All 15 F2 source documents have been upgraded in the working CODEX folder. F2-04 is not a separate source: F2-03 includes decimal base-ten blocks.

Read F2-individual-audit.md for each component's 18 checks and decision. F2-capability-manifest.json records exact source hashes, native signatures, controls, supported actions and mathematical limits. F2-configuration-examples.json supplies six independent questions, four Watch records, four Guided records and four Bob records for each component.

The source ZIP preserves project-relative paths: F2/, core/, integration/, 00-master/ and audit/f2-production-2026-10-16/. The approved template and original F0-12 controller are included. No GitHub was used. The starting files already contained older lesson hooks; originals.zip preserves the exact supplied working bytes, not a claim of untouched upstream provenance.

To reproduce, extract into a new folder, run npm ci in integration/, and run the supplied Node scripts from the extracted project root with Microsoft Edge installed. Runtime HTML is self-contained; node_modules is a development dependency and is omitted from the ZIP. Do not overwrite baseline-browser.json by rerunning capture-baseline.cjs; original baseline evidence is preserved. Generated lessons embed source snapshots and need rebuilding to receive these updates.

The 14 October master release settled approval and stacked NOVA Chalk/neon fraction notation. No fraction placeholder or approval gate applies. Local deliverables are provided; no ChatGPT Library upload tool was available.
