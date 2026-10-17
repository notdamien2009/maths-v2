# Editing F3 lessons

Use the approved 00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html and the source paths in integration/component-adapters.json. Map source aliases in P.sourceIds and embed the current complete native HTML in novaV2Sources. Rebuild existing exported lessons because they contain source snapshots.

The preferred reusable record is:

```js
{source:'SRC', nativeIndex:0,
 data:{lesson:{state:{/* complete mathematical state */},phase:0}}}
```

State schemas:

| ID | Native lesson state |
|---|---|
| F3-01 | rows, cols; optional view (array/rotate/split/tree/collect), split, shape (tile/dot) |
| F3-02 | kind numeric: x:[part,part], y:[part,part]; single/factorise: factor,constant; double: xConst,yConst; fraction-product: a,b,c,d; fraction-add: den,a,b,op |
| F3-03 | a,b,partitionA:[part,part],partitionB:[part,part] |
| F3-04 | n |
| F3-05 | kind tree,n; or kind sieve,limit |
| F3-06 | n |
| F3-07 | a,b |
| F3-08 | a,b |
| F3-09 | n,power (2/3); optional filled and fractional |
| F3-10 | kind (multiply/divide/power/fraction),base,m,n |
| F3-11 | kind (square/cube),target,estimate (or initial) |
| F3-12 | n,rule |
| F3-13 | units,divisor,unitValue,method (sharing/grouping) |
| F3-14 | row,col,rowSign,colSign |
| F3-15 | n |

Read numericDomain in the manifest before choosing values. Supply numeric values as JSON numbers. F3-02/F3-03 partitions support whole numbers and tenths. Fractions use integer numerator/denominator state, then the existing native stacked renderer. Signed double-bracket constants are nonzero integers. Native parameter bounds cannot be redefined to evade these limits.

For custom Watch/Guided/Bob motion, set animated:true and supply lesson.motion:{from:0,to:4,durationMs:2400}. This advances original teaching phases, rather than inventing another drawing. Static preview shows from; reduced-motion playback shows to. phase selects one static native stage. Use a suitable Watch storedDur at least as long as the motion plus reading time; a short timer must not move on before the teaching finishes. Use a suitable Guided ttsDurationMs for the actual sentence. Narration/captions must describe the current numbers; do not reuse fixed demonstration narration after changing them.

Examples:

```js
// Area multiplication: (2 + 0.3)(1 + 0.4) = 3.22.
{source:'SRC',nativeIndex:0,animated:true,
 data:{lesson:{state:{kind:'numeric',x:[2,0.3],y:[1,0.4]},
 motion:{from:0,to:4,durationMs:2400}}}}

// Native complete ladder for 84, one prime divisor per phase.
{source:'SRC',nativeIndex:0,animated:true,
 data:{lesson:{state:{n:84},motion:{from:0,to:4,durationMs:2400}}}}

// Sharing 2.4 among four gives 0.6 per hoop.
{source:'SRC',nativeIndex:0,
 data:{lesson:{state:{units:24,divisor:4,unitValue:0.1,method:'sharing'},phase:6}}}

// Grouping 2.4 into amounts of 0.4 gives six groups.
{source:'SRC',nativeIndex:0,
 data:{lesson:{state:{units:24,divisor:4,unitValue:0.1,method:'grouping'},phase:6}}}
```

The native phase meanings are apparatus-specific. F3-01 builds visible rows; F3-02 reveals partial products; F3-03 uses its existing 0–7 grid working stages; F3-04 reveals factor arches; F3-05 sweeps primes or splits composite leaves; F3-06 adds prime ladder rungs; F3-07 places tokens then reveals products; F3-08 reveals tracks/meetings; F3-09 goes from a row to a layer to the full shape; F3-10 follows native law stages; F3-11 shows root comparisons/bounds; F3-12 shows evidence/verdict; F3-13 allocates rounds/groups; F3-14 reveals the signed-table proof; F3-15 extracts the square factor. A phase is not always one unit or one second. Use the examples and inspect the selected output.

Explore bindings go in P.exploreBindings[conceptIndex].variables, each value as {value:...}. Preferred variables: F3-01/02/05/10/11/13/14 use state; F3-03 uses p; F3-04/06/12/15 use n; F3-07/08 use a,b; F3-09 uses n,p (p is the power). F3-05 Explore state uses native view:'tree'/'sieve', plus n/limit. F3-11 Explore state uses initial for its starting estimate. Preserve the full state schema when binding compound data. Additional native fields remain listed in the manifest.

Focused controls use the original accessible labels from the manifest, for example controls:{'Area model preset':{hidden:true,disabled:true}}. The policy supports hidden/disabled, min/max/step, value, allowedValues and selector, and survives redraw. Bind mathematical initial state as well as restricting its controls. Selectors do not change units or mathematical meaning.

For native presets, use P.manifest.explorePresets[conceptIndex]=[{nativeConfig:{...}}]. The template creates lesson preset keys. Existing keys can also be overridden through componentConfigs. Some original demonstration renderers are intentionally fixed; data.lesson is the supported route for arbitrary lesson-specific Watch/Guided/Bob values.

Multiple scenes use views:[{record:first},{record:second}] with layout:'rows'/'columns'; SVG references are scoped. Independent editing uses exploreInstances:[{source,config,explore,title,instructions},...] (1–4 frames). Each owns its maths, controls and reset. Two independently edited instances and reset were tested for every F3 source. All mixed-family and 3–4-frame combinations were not exhaustively tested.

Challenge settings belong on D.learn[conceptIndex].challengeGame, and independent question states/keys belong in P.manifest.challenge. Supply 6–8 questions with source/nativeIndex/data, prompt, privateAnswer, answerType, hint and feedback. The original F0-12 wrapper is already automatic for every F3 challenge mounted through this template: lives, score, streak, hints, retry, reset, badge and confetti. Standalone source pages retain their original native Challenge exercises as well.

Question rendering conceals computed lesson readouts and future phases, while keeping the mathematical givens/apparatus. A drawn array or table may help a pupil calculate; that is different from exposing a final answer annotation. Ensure your question really matches its independent answer key. Do not use a fully worked teaching record as an unanswered question. F3 does not use F1's data.chips field.

Guided speech is opt-in with P.narration.examples=true; Bob uses its existing TTS control. Actual start/boundary/end, pause/resume/reset/stop were tested on F3-09. Decimal numerals containing digit 4 remain caption-only under the existing pronunciation policy. Captions remain authoritative and every installed voice is not certified.

Original drawings/fonts/colours/mascots are retained. Native area/grid diagrams can be schematic when partitions are strongly unequal; high-density fraction/card/combined views need lesson-level visual review. Native bounds and whole-number/decimal requirements are engineering limits, not unsettled approval gates.

Mixed-family evidence: six checks passed with the native F3-01 array and F2-07 multiplication grid, including separate engines, matching initial product, isolated edits, isolated reset and mobile stacking. F2-07 is included in the ZIP for reproducing this example; its source was not changed.

Apparatus screenshots hide parent fixed/sticky navigation bars only for capture, to keep the complete question visible. Actual template-flow and page-width checks ran with the normal navigation present.
