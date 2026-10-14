> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# F6-02 — Double Number Line · specification

**Status: built as an additive premium review candidate. NOT approved GOLD.**

## Mathematical purpose
Direct proportion is represented by two calibrated NOVA.numberLine tracks that share one x-coordinate map. If a pair (a,b) is known, the constant rate is k=b/a. At x on the top line, the matching value is y=kx. The two rings stay on the same vertical line, making the relationship visible rather than using additive jumps or uncalibrated labels.

## Exact curriculum presets
| Preset | Given pair | Target | Expected | Learning point |
|---|---|---|---|---|
| Y7-060 | 2 tickets ↔ £6 | 8 tickets | £24 | Direct proportion; unit cost £3 |
| Y8-007 | £40 original ↔ £50 increased | £60 original | £75 | 25% increase; multiplier 1.25 |
| Y8-035 | x=3 ↔ y=7.5 | x=9 | y=22.5 | y=2.5x |
| Y8-039 | £5 ↔ €6 | £15 | €18 | Classroom rate, €1.20/£1 |

Currency values are **illustrative fixed lesson rates**, not current live foreign-exchange quotations.

## Teaching motion
1. Zero–zero origin aligned.
2. One known pair marked and joined vertically.
3. Both linked rings move to a new proportionally matched position.
4. Reveal the value under the target mark.
5. Divide each matching pair to verify the rate stays the same.

For clarity, the fixed Watch narration teaches the tickets-and-cost example. The four named lesson presets are selectable in Explore and appear in four Challenge questions; switching Explore presets does not corrupt the Watch narration.

## Visual and interaction contracts
- **Canonical geometry only:** both rails are created by `NOVA.numberLine(svg,…)`, not a new SVG rail renderer. Major and minor tick intervals match proportional positions exactly. Connectors use `NOVA.neonLine`; positions use `NOVA.neonRing`; all stage values and labels use `NOVA.chalkText`.
- **Responsiveness:** standalone tall 440×930 SVG at narrow widths with large math labels; desktop 1120×750 layout with canonical side glass proof cells. No new fonts/filters/standalone mascot drawings.
- **Explore:** one retained linked pair. The upper and lower rings are connected and dragged together through `NOVA.ui.svgDrag`. Snap targets occupy valid positions on both scales. Invalid release springs home; the red RETURN zone removes the linked marker; Restore and keyboard arrows provide accessibility. Undo/Reset included.
- **Challenge:** four tests require the precise lower value, with upper target and known calibration visible; the missing lower label is hidden until a correct response. Premature answer revelation is not allowed. Specific misconception messages for copied values, additive reasoning and inverse operation.
- **Accessibility:** semantic config, narrated steps via original NOVA Bob hooks, helper dock captions, accessible form labels, reduced-motion via NOVA.motion, per-slide SVG alt text, keyboard fallback and high-contrast focus rings.
- **Games:** none inside this engine; any future games must use F0-12.

## Shared-core continuity
The delivered ZIP does NOT contain replacement core code, F0/F1/F2/F3/F4/F5 engines, or an overwrite of the existing `build/build.py`. It includes a standalone HTML compiled using the embedded F0 core from prior F4 package and a deterministic builder that re-inlines the owner's **current installed** core in place. This prevents old and new F0 variants from becoming separate house styles.

## Acceptance gates
- Formal maths/geometry tests, JS syntax and registration, and standalone compilation: completed and logged.
- Real browser screenshots across Watch/Guided/Explore/Challenge at 380 and 1280, fast pointer stress with cancellation, actual mascot pose inspection: **pending in an unrestricted local browser.**
- Owner side-by-side design sign-off and lesson-shell integration: **pending**.
