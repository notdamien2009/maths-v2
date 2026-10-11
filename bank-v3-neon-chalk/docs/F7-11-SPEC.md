# F7-11 · Bar-model equation · Spec card

- **Maths purpose:** Translate a story into an algebraic equation and solve it by reasoning with a whole bar, equal unknown bars, and a known unit part.
- **Year groups:** KS3 Y7-034 (form expressions from contexts); usable for Y7 equations Y7-033/035 and as a GCSE Foundation bridge.
- **Engine identity:** F4-08 Algebra Bar (preset F7-11). Not a separate replacement engine.
- **Parameters:** integer number of unknown groups n=1..5; known unit amount b=0..12; positive exact x and total=n*x+b; default n=3,b=5,total=26.
- **Named presets:** `F7-11` story-based (3x+5=26); source F4-08 presets Y7-034, Y7-035, F4-10 are retained. Four F7-11 challenge tasks vary n, b and total.
- **Steps:** Read story → show equal unknown parts → add known counters → form equation → subtract known from both sides → divide equally → reveal x → substitute/check.
- **Interactions:** drag x/knowns to bar, remove into red return zone, spring-back on invalid drop, drag value chip onto x answer dock; equivalent buttons and keyboard Enter/Delete. Expose correct/step/value/hint events through shared core.
- **Challenge correct:** model has n x parts and the known block, subtraction is balanced, remainder=total−b, equal division performed, x=(total−b)/n. Check original equation before accepting.
- **Misconceptions:** forgetting the known part; 3x read as x+3; subtracting on one side only; dividing total instead of remainder; choosing a whole-bar value as x.
- **GCSE extension:** unknowns on both sides and bracket equations remain available in F7-08 / F3-02, not silently embedded here.
- **Linked components:** F4-08, F4-10, F7-08, F7-09, F7-10.
- **Design:** F0 NOVA Neon Tube mathematical shapes + NOVA Chalk labels; no custom visual core.
