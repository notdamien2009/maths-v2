# F4-11 · Word-Problem Highlighter · Component specification

| Field | Requirement / implementation |
|---|---|
| Purpose | Make children identify mathematical quantities in a word problem, map semantic roles to bar sections, then translate to a correct expression or computation. |
| Lesson coverage | Y7-034 Forming expressions from contexts. Other contexts serve flexible KS3 transfer practice, not verified extra lesson mappings. |
| Parameters | Exactly three semantic phrases, whole / part / extra-or-difference, one–five repeated groups, nonnegative integral known addition, symbolic or numeric whole. |
| Presets | Y7-034 `3x+4`; Year 7 alternative `2x+5`; comparison `19−5`; part–whole `36−11`. |
| Teaching stages | Read story → identify repeated parts → whole and extra → build equal units → add extras once → generalise. Sir Bob has a narration slot per stage. |
| Interactions | Choose highlighter role, tap phrase, SVG phrase token appears, drag onto its mathematical slot or Enter; remove by dragging into red return or Delete; incorrect role/drop gives diagnosis and returns, no piece stranded. |
| Challenge criteria | Every semantic phrase correctly highlighted; all three pieces physically placed on right slots; exact mathematical expression. Empty or mathematically incorrect expressions rejected. Three distinct problems. |
| Misconceptions | Treat 3x as 3+x; multiply extras three times; subtract positive extras; add a known difference rather than subtract it; confuse whole with a part. |
| Accessibility | Selectable controls, named labels, reduced-motion support via core, alt descriptions, keyboard equivalents, print fallback from core. |
| Visual system | NOVA F0/F2 canonical Neon Tube apparatus and chalk-write story, SVG chalk-draw labels, blue whole, mathematical focus part, gold unknown/extra, no independent drawing language. |
| GCSE extension | Translate linear contextual relationships to algebra; comparison and inverse operation word problems. |
| Links | F4-01 part–whole bar, F4-02 comparison bar, F4-08 algebra bar / F4-10 translator. |
| Game | None: use F0-12 wrapper separately. |

**Owner acceptance remains pending.**
