# Shared Core Integration Gate

**Evidence from GitHub (11 October 2026):** the checked-in `core/nova-core.js` contains the existing premium house style and native helper dock, but has **no** `NOVA.numberLine` or `NOVA.ui.svgDrag` definition and no `NOVA.motion = ...` API. A self-contained `F3/F3-01-array-builder.html` *does* contain those APIs. It contains a modified copy of the core body, not merely a small append-only addon (even its number-line axes path differs from the checked-in core).

Therefore, **do not patch blindly** by replacing the shared F0 core with the entire runtime in a compiled review HTML. That could alter established F0/F1/F2/F3 behaviour, violate the locked primitives and invalidate QA.

## What this repair supplies

- `tools/core_contract_audit.py` — readable, deterministic comparison of the checked-in core against the F3-01 compiled reference; creates `docs/CORE-CONTRACT-AUDIT-2026-10-11.md` in the local checkout.
- `assets/helpers/registry.json` — truthful virtual helper API/pose mapping to core-native artwork rather than fake external pose files.
- `docs/PRODUCTION-SOURCE-MAP.md` — fixes broken source assumptions for later runs.
- A consolidated handover and deterministic master export. **No modifications to central core or approved engine runtime.**

## Gate before runtime integration

1. Identify the exact owner-reviewed working version of `NOVA.numberLine`, `NOVA.ui.svgDrag` and `NOVA.motion` from the canonical F2/F3 reference (not a new API invention).
2. Compare and patch the small, reviewed API changes into a candidate copy of core. Avoid wholesale runtime replacement.
3. Rebuild F0 benchmark + F1 number line + F2 drag + F3 array + affected F9/F10 scenes against candidate core; verify visual and functional parity at mobile/desktop widths.
4. Run arithmetic/maths correctness, pointer capture, fast drag, snap, cancel/blur, keyboard and reduced-motion tests. Verify original helper dock and fraction notation survive.
5. Submit a **separate** candidate core patch/ZIP to the owner for explicit sign-off, then perform local installation/push only after authorisation.

Static API-presence is just the first gate; these steps are not yet complete and the repair pack does not certify the core as integrated.
