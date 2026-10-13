# NOVA Maths V2 — F14-01 Reflection (review build)

## Scope
Family F14: Transformations and Symmetry. First engine: reflection. This is a **standalone interactive review file**, not a repository commit and not yet a GOLD-approved canonical-core build.

## Source specification reviewed
- `bank-v3-neon-chalk/00-master/NOVA-MASTER-FOR-OTHER-AI.md` → Family F14, F14-01.
- `bank-v3-neon-chalk/HANDOVER-v3.md` → core conventions and helper dock.
- `bank-v3-neon-chalk/F0/F0-02-svg-primitives-PREMIUM.html` and `build/F0-02.src.html` → premium stage and neon geometry direction.
- `bank-v3-neon-chalk/build/F1-01.src.html` → four-mode structure.
- `bank-v3-neon-chalk/core/nova-core.css` → geometry motif, premium stage styling and mascot dock boundaries.
- `bank-v3-neon-chalk/core/nova-core.js` → original procedural Pip geometry and helper dock pattern.

## Functionality
1. Watch — six named explanatory states, timeline play/pause/previous/next, scrub, reset.
2. Guided — named manual steps with Bob narration slot and reflection prompts.
3. Explore — presets `x = 0`, `x = 1`, `y = 0`, `y = x`; image translation and mirror manipulation with integer grid snapping.
4. Challenge — three tasks: drag image to correct reflection in the y-axis; reflect A(-3,2) in x=1 yielding (5,2); reflect A(-2,3) in y=x yielding (3,-2).
5. Mathematical model — `(x,y) -> (2k-x,y)` for x=k; `(x,y) -> (x,2k-y)` for y=k; `(x,y) -> (y,x)` for y=x.
6. Pointer/touch — one active drag at a time, pointer capture, frame-batched rendering, cancellation, Escape rollback, snap to integer unit, outside-grid rollback.
7. Keyboard — Tab focus to image/mirror target; arrows move by one unit; focus restored after redraw.
8. Accessibility — labels, tab selection, speech announcements, reduced motion completion, print stylesheet.

## Browser checks
See `QA-RESULTS.json`. Chromium screenshots at 380 and 1280 across Watch, Guided, Explore, Challenge.

- 53 automated checks passed, 0 failures.
- No JavaScript page errors in checked modes.
- One mascot docked within stage at both sizes.
- No page-wide horizontal scroll at 380 and 1280.
- Geometrical coordinate checks and three Challenge tasks passed.
- Fast drag, keyboard navigation, Escape rollback, mode cycling and reduced-motion behaviour checked.

## Owner review points / known limitations
**Do not treat this standalone preview as fully integrated or GOLD.** Although F0/F1/F2 visual conventions were inspected and mirrored and the original procedural Pip geometry was used, the HTML does **not** inline the repository's current `nova-core.js` and `nova-core.css`. The repo's connected GitHub data was readable for inspection but could not be mounted as local source bytes in the build environment. As a result, this file uses compact local SVG drawing helpers and a local chalk-style fallback font rather than invoking the canonical F0 primitive engine and bundled Chalk font. It will need an in-repo canonical-core integration pass before production acceptance.

The image artwork is the mathematical vector scene, not a fixed bitmap. Screenshots are review evidence, not substitutes for opening and interacting with the HTML. Existing repo files were read only. Nothing was pushed to GitHub.
