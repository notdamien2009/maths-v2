# Actual Production Source Map — 11 October 2026

This replaces assumptions from older prompts that refer to directories which are **not** present in the audited GitHub tree.

| Previous reference | Reality in the checkout | Safe current source |
|---|---|---|
| `prompts/specs/s1-s6.py`, `guard.txt` | Not tracked | `00-master/nova-master.html` contains the embedded `SPEC` object and production guard; `prompts/specs/gen.py` extracts that exact object |
| `prompts/specs/gen.py` | Missing before the repair | The repair pack supplies a deterministic extractor, **not** a recreation of missing editorial source scripts |
| `assets/helpers/pip/pack80/manifest.json` | Absent | Native core Pip helper skin, `NOVA.helperImg`/`NOVA.scene.helperStrip`; virtual registry in `assets/helpers/registry.json` |
| `assets/helpers/nova-cat/pack60/manifest.json` | Absent | Native core Nova helper skin; no external sprite pack is presumed |
| `assets/helpers/teen/` or `assets/helpers/izaac/` | Absent | Native core Izaac skin; pose/character artwork lives in embedded runtime and approved review HTML |
| `core/nova-core.js`/`.css` | Present | Canonical shared F0 foundation, but has an API/version gap vs compiled review engines |
| `src/F*.js`/`.css`, `build/F*.src.html` | Many present | Editable component source and build adapters; some newer builds use component-specific scripts |
| `F*/F*-*.html` | Present by family | Self-contained review/demo output; passing locally does not imply core/source parity |
| `F*/...manifest.json` | Present selectively | Integration metadata and approved dependency/preset declarations where applicable |
| `tests/`, `shots/`, `screenshots/` | Present | QA evidence/artifacts; keep selectively, archive historical bulk separately |

This repair avoids fabricating missing imagery or pretending an external manifest is a usable sprite pack. The virtual helper registry is an accurate *mapping* to current core-native slots, not physical PNG/SVG assets. Historical asset requests for 80/60 poses cannot be fulfilled from the repo as external image files without a separate recovery/design run.

**Future rebuild rules:** Verify that the actual core supports required APIs. `tools/core_contract_audit.py` compares the checked-in core against a compiled F3 reference without editing either. Do not silently swap or copy a 1MB inlined runtime into the shared core.
