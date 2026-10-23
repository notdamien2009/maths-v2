# NOVA Maths V2 — Bob Board Watch-only v1.4 QA

## Result
**CANDIDATE: 40/40 Watch-only component beats passed, with no observed clipping, no script errors, no duplicated native control rows.** Ten different F families (F1–F10), four beats each. This is not full GOLD certification of F0–F18 or an end-to-end lesson.

## Corrected defect
The v1.3 geometry fix preserved the original `.nova-engine`, but the engine also retained Guided or mode tabs, Restore defaults, a second player/timeline, a panel and Bob helper UI. As a result the actual maths shrank and the board had duplicated play controls.

v1.4 changes **only the Bob mount role**:
- Set the original engine's mode to **Watch**, and lock Bob mounts to Watch via its existing API.
- Preserve the complete `.nova-engine` ancestry and original `.nova-stage` (essential for original component styling).
- Hide ONLY the sibling controls of `.nova-stage` within its actual parent, not the parent itself. The component's original maths container, internal panels, mascot and geometric arrangement are untouched.
- Pause the embedded native timeline so **Bob Board is the sole transport**; Bob's outer play controller continues to call original native rendering.
- Measure actual visible native engine geometry rather than including the initial 1000px iframe loading height. This increases readable size while retaining proportional fit/no crop.
- Other roles (Learn, Explore, Examples, Challenge) remain on their original code paths.

## Desktop contract
- Outer Bob Board: **1150 × 750 px**.
- Maths viewport: **1140 × 700 px**, unchanged.
- Bob transport remains outside the maths viewport.
- Proportional scaling only, original source never edited, no iframe scrolling.

## Browser evidence
- 40/40 slides in original Watch mode.
- 40/40 embedded mode tab groups hidden.
- 40/40 embedded timeline/play sections hidden.
- 40/40 embedded panels hidden.
- 40/40 native maths stages visible and populated.
- 40/40 frame geometries within the viewport.
- 0 page JavaScript errors across both desktop fixtures.
- Transport checked: start, Next during autoplay, pause, Next while paused, resume, cross-concept Next.
- Responsive checks: 980px and 660px viewports with both fixtures, no observed clipping.
- Embedded originals in F1–F10 fixture files have **identical SHA-256** before/after this repair.

## Remaining evidence needed before production certification
- Test with all F0–F18 production members and real lesson-specific recorded configurations, not just these 10 test families.
- Test authentic Ryan speech output and motion/audio synchronization.
- Re-verify Learn, Explore, Examples and Challenge in a full lesson after adopting this shared template.
- Current prompt pack still pins the previous template; update its reference only after accepting this candidate.

## Artifact
Template SHA-256: `c69d5c41a301c06983e2d1c8a10a4947190b9890513efaed037a898757418fd9`

No GitHub push or Library save performed.