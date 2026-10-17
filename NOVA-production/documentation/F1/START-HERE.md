# NOVA F1 production release

Open F1-individual-audit.md for the ten separate component decisions; F1-capability-manifest.json is the machine-readable production contract. F1-template-integration.md and F1-configuration-examples.json explain lesson editing. F1-test-and-QA.md records executed verification and its limits.

The ZIP preserves project-relative paths. Updated F1 HTML is in F1/, the approved template in 00-master/, shared runtime/adapters in core/ and integration/, and evidence/backups/tests under audit/f1-production-2026-10-16/. It contains no node_modules. To reproduce tests, install the locked development dependencies inside integration using npm ci, then run the supplied Node test scripts from the project root with installed Microsoft Edge available. Do not run capture-baseline.cjs over the preserved baseline evidence; reproduce original baselines from originals.zip in a separate checkout/directory.

The starting working source already contained earlier lesson hooks. Its exact pre-audit bytes and hashes are preserved; “original” means the authoritative supplied working apparatus, not a claim of pristine upstream provenance. No GitHub access or replacement drawing source was used.

This release covers the declared numerical/mode contracts, not arbitrary future lesson content. F1-01 now uses the settled NOVA stacked fraction notation. Decimal-digit-4 speech remains restricted. Existing exported lesson HTML must be regenerated to receive updated inline sources. User-facing deliverables are saved locally with download links; no ChatGPT Library upload capability was available in this session.


Fraction correction: the notation was already settled by the 14 October production release. F1-01 now uses the existing F5-04 stacked chalk/neon construction with editable n/d and exact partition snapping. The prior placeholder restriction was an audit mistake and is withdrawn. See F1-fraction-correction.md for new evidence.
