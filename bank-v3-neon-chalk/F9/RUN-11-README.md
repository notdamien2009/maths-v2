# NOVA F9-11 · Spot-the-Rule Puzzle — Run 11 premium review

**Status: review build, not GOLD. GitHub unchanged.**

## Spec card
- **Maths purpose:** Spot and prove a term-to-term rule by applying it to every pair of consecutive terms, rather than selecting a rule based on a single coincidental jump.
- **Year:** Y7-036 sequence rules and structure; early Y8 arithmetic/multiplicative extension.
- **Parameters:** Five terms; additive +3 and −4, multiplicative ×2; reveal slider 3–5 terms; one tested rule per trial.
- **Named lesson preset:** Y7-036 with three sub-presets (increasing, decreasing, doubling). No unverified lesson IDs.
- **Watch animations:** reveal terms → check differences → reject false doubling → reveal +3 proof → subtract-four example → multiplication contrast. Only NOVA.motion used; reduced motion resolves instantly.
- **Interactive contract:** Drag rule cards to one target socket; correct card snaps, wrong card springs home, red tray removes a placed card, keyboard Enter/Enter places and Delete removes; Escape and pointer cancel supported.
- **Challenge success:** Same rule correct on all four hops in each of three mysteries (+3, −4, ×2). Incorrect choices receive operation-specific feedback.
- **GCSE flag:** Foundational; links to F9-02, F9-03, F9-09 and F9-12. No advanced GCSE formula invented here.

## Teaching and gameplay
- Watch: 6 named, concept-linked teaching beats; no immediate reveal of rule on first step.
- Guided: 6-step F0 core timeline.
- Explore: three presets; reveal 3–5 terms; test +3, +4, −4, ×2 or +2 rule against a sequence.
- Challenge: three progressive puzzles. Correct answers are NOT shown in the sidebar before the learner solves them.
- A rule is shown as proven only after verifying the sequence; challenge cards accept only correct rule choice.
- One original NOVA helper/mascot dock only. No extra mascot pictures.
- Exact shared F0/F1/F2 algebra x/y/n stage motif; original neonBox, neonRing, svg.hop and chalkText primitives only; no custom stage backdrop.

## Browser tests
- Functional/visual **122/122** passed (380px, 1280px; Watch×6, Guided, Explore, Challenge; full challenge progression).
- Pointer and keyboard stress **28/28** passed (rapid wrong/correct drops, red removal, re-grab, Delete, Escape, no stranded drag).
- 18 screenshots included (Watch 6 + Guided + Explore + Challenge, at both viewport widths).
- Independent verification of every rule and six incorrect challenge candidate operations.
- Reproducible build matched the HTML byte-for-byte.

## Integration note
Like F9-01 through F9-10, this component relies on premium motion/drag facilities in the F3 reference standalone runtime, not on the older checked-in shared JS, which is missing these routines. The incremental build helper takes its runtime from the existing local F3/F3-01-array-builder.html. No shared core files are replaced and no GitHub writes occur.

## Install
Extract ZIP into the root of your LOCAL `bank-v3-neon-chalk/` directory. Keep the existing F3 reference file there for rebuilding. Inspect this review before promoting to GOLD.
