# NOVA F9-12 · Sequence Continuer — Run 12 premium review

**Status: review build, not GOLD. GitHub unchanged.**

## Production specification
- **Purpose:** Continue five-term sequences by applying a constant term-to-term rule in the correct order; fill two consecutive missing terms.
- **Years:** Year 7 sequence structure. Decreasing and multiplicative presets extend the representation, not unapproved lesson IDs.
- **Parameters:** first term, positive/negative difference or multiplicative ratio, sequence length 5, two missing slots, 3–5 revealed terms in Explore.
- **Presets:** `Y7-036-sequence-structure` (+3), `Y7-036-decreasing` (−4), `Y7-036-doubling` (×2).
- **Named teaching beats:** Notice terms → compare repeated hops → fill term four → fill term five → subtract four → multiply by two.
- **Interactions:** Watch/Guided F0 timeline; Explore change sequence and reveal terms; Challenge drag two independent number cards to two slots, snap, re-grab, remove in red tray, cancel with Escape, use keyboard Enter/Enter/Delete.
- **Answer rule:** Both positions must be correct and in sequence order; task one [13,16], task two [12,8], task three [16,32]. Wrong rules, repeated terms and swapped positions have misconception feedback.
- **GCSE extension:** Precursor to nth-term and more complex sequence construction; no unsupported GCSE content added.
- **Links:** F9-01, F9-02, F9-03, F9-11.

## Visual lock / QA
- Shared NOVA core draws all neon boxes, hops, rings, pills and Chalk text. F0/F1/F2 algebra-pattern background inherited without F9-specific overrides; canonical single helper dock only.
- 6 Watch teaching slides, Guided, Explore and Challenge with **132/132** browser/visual checks passed at 380px and 1280px.
- **32/32** fast pointer, wrong-drop, red removal, keyboard, Escape, post-cancel and no-stranding checks passed.
- 18 separate screenshot previews, independent maths checks, and the byte-for-byte rebuild verification supplied.

## Integration caution
The current checked-in `core/nova-core.js` still lacks the recent shared drag/motion functions that exist in the reviewed F3 standalone build. F9-12 therefore uses that working F3 core without a custom replacement. The component's incremental build script uses `F3/F3-01-array-builder.html` locally. **Do not replace or edit the shared core from this ZIP.** The shared integration inconsistency must be handled as a separate authorised repo repair.

## Install and review
Extract this ZIP over your LOCAL `bank-v3-neon-chalk/` folder, inspect the HTML and screenshots and test all four modes. This run does not modify GitHub and is NOT marked GOLD until owner acceptance.
