# NOVA MATHS V2 — F0–F18 PRODUCTION RELEASE

**Status: APPROVED FOR LESSON PRODUCTION**  
**Approval date:** 14 October 2026  
**Scope:** Entire F0–F18 Maths V2 component library, including intentional preset/shared-engine mappings.  
**Approved by:** Project owner following their manual testing and the GitHub drag-repair regression.

## Binding release decision

F0 through F18 are APPROVED as the canonical NOVA Maths V2 visual component library for lesson production. Previous *pending approval*, *blocked until audit*, *hold for manual sign-off*, *not GOLD yet*, provisional release statuses, and outstanding **component-library approval gates** in historical planning documents are SUPERSEDED by this decision.

Do not treat an old checklist, previous audit finding, family-by-family stage gate, or historical build prompt as an active reason to block lesson production.

**Fraction notation is settled, not TBD.** Use properly stacked mathematical fractions with numerator above a horizontal bar and denominator below, in NOVA Chalk handwriting and existing mathematical colour roles. Compact inline a/b is permissible for space-constrained inputs and controls only; it is not the main teaching representation. The old `nv-frac-tbd` convention is obsolete and must not be newly used.

## Canonical implementation rules retained

- Use the actual F0–F18 components in this repository rather than inventing replacements or reverting to obsolete prototypes.
- Keep NOVA Neon Tube mathematical artwork, NOVA Chalk typography and annotations, existing maths role/column colours, accurate notation, Bob, Izaac/Pip, and the approved placement and speech rules.
- Preserve Watch / Guided / Explore / Challenge, component interfaces, lesson presets, valid drag/drop and reset, keyboard alternatives and accessibility.
- Preserve functional quality checks and regression tests: these are **engineering safeguards**, not historical approvals or production blockers. A newly introduced defect should still be corrected.
- F0-02 canonical selection and F14-01 canonical PREMIUM file must follow current `main`, not outdated duplicate/review filenames.
- A lesson may still require its own teaching QA, visual QA, navigation/answer audit and learner test. This library release does not waive lesson-level quality controls.

## Audit evidence

- Full prior component smoke/deep audit: 255 inspected engines in four modes (historical audit snapshot).
- Drag repair in `main`: PR #2, merge commit `35ff0338e08ddcceb8ae81df701212208858d5d4`.
- Fast drag regression: 254 paths tested, 39 draggable engines, 52 candidate drag modes; two reported flags were addressed via correct F14-01 inventory reference and F3-03 source-card-focused follow-up.
- Follow-up Chromium browser test passed for F14-01 and F3-03 on 14 October 2026.
- **Final manual approval:** explicitly granted by the project owner on 14 October 2026.

The test suite does not claim every possible custom drag action or device was covered; approval reflects the owner's final acceptance alongside the stated evidence.

## Document-precedence rule

This release notice and the current canonical implementation supersede conflicting older approval/hold/TBD statements. Historical reports and snapshots remain for traceability; their obsolete gate labels are not current blockers.

**Final state: F0–F18 RELEASED / APPROVED / READY FOR NOVA MATHS LESSON PRODUCTION.**
