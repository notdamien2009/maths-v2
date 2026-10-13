# F7-06 — Factorising with Tiles · Specification card

**Status:** Premium review; awaiting owner GOLD approval.

| Field | F7-06 implementation |
|---|---|
| Maths purpose | Physically reverse distribution by rearranging an expanded expression into **k identical rows**; the side edge is the common factor k, and the top edge is the bracket ax + b. |
| Target years | Year 7 Lesson 032 and Year 8 Lesson 012. |
| Configuration | Positive whole-number common-factor k (2–4), number a of x rods in each row (1–3), number b of unit squares in each row (1–4), maximum 18 source tiles. |
| Named presets | Y7-032 `3x + 6 = 3(x + 2)`; Y7-032-alt `4x + 8 = 4(x + 2)`; Y8-012 `6x + 9 = 3(2x + 3)`; Y8-012-alt `6x + 8 = 2(3x + 4)`. |
| Animation | See original tiles → group x rods → share units → completed rectangle → read both edges → write factorised form. Steps carry distinct Sir Bob narration and F0 helper speech. |
| Interactions | Core F2 svgDrag to correctly sized empty slots; x rods and unit squares have different shapes and roles; drag out into red Return zone; keyboard Enter / R and accessible Next x / Next unit; Undo and Reset. |
| Challenge | Four rounds; every original tile must be placed correctly AND entered factorisation must give the greatest common factor with correct bracket terms. Wrong-answer explanations diagnose distributing only x, an undivided inside constant, miscounted groups or missing x rods. |
| Mathematical traps | You must divide both coefficients by the same common factor; x is not a unit; every tile must be accounted for; the number of equal rows is not the total number of tiles. |
| GCSE flag | Extension path only; this review engine supports positive **linear** expressions, not signed-length geometric models or quadratic tile products. |
| Linked components | F7-01 Algebra Tiles; F7-03 Like Terms; F3-02 Area Model; F7-04 Single Brackets. |

**Visual fidelity:** F0 colour/math language, Neon Tube SVG core drawing only, chalk labels, identical F0 mascot dock, clean printable static SVG, intrinsic 320/380/768/1280 responsive arrangement. Main rectangle uses one consistent unit width equal to its row height: x rod has width x, unit tile is square; rows have no gaps. Source tray remains only when needed. This is a lesson-neutral reusable engine; lessons are named presets, not hard-coded engine identities.

**Future options:** Signed coefficient factorisation and quadratic common-factor models would require separate mathematically truthful signed/multi-power representations. Do not treat those as already implemented.
