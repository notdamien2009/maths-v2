# Editing F2 lessons

Use 00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html and the original source entry from integration/component-adapters.json. Embed the current complete source in novaV2Sources and map aliases to component IDs in novaProductionData.sourceIds. Existing exported lessons must be regenerated because their sources are inline snapshots.

The reusable record is {source:'SRC',nativeIndex:0,data:{lesson:{...}}}. Supply complete native mathematical state: do not copy a demonstration's hardcoded result, label, plan or answer chip. F2 does not share F1's data.chips field. The manifest lists each actual native schema and action whitelist. Native data/scene interfaces remain available for advanced apparatus-specific stages; preserve native step names as renderer keys and use lesson title/teaching fields for captions.

Examples:

```js
// Place values / ×10. Static preview shows 2.35; animated playback performs the native shift.
{source:'SRC', nativeIndex:0, animated:true,
 data:{lesson:{value:'2.35',actions:[{method:'shift',args:[1]}]}}}

// Native decimal base-ten blocks: total 1.35, with editable individual block counts.
{source:'SRC', nativeIndex:0,
 data:{lesson:{state:{sc:'decimal',c:{f:1,r:3,u:5}}}}}

// Carry/borrow calculation rebuilt from actual operands.
{source:'SRC', nativeIndex:0, animated:true,
 data:{lesson:{a:'4000',b:'1',op:'-',actions:[{method:'play'}]}}}

// Custom expression. Brackets, powers and left-to-right peers are resolved natively.
{source:'SRC', nativeIndex:0, animated:true,
 data:{lesson:{expression:'(2+3)*4^2',actions:[{method:'auto'}]}}}
```

Set animated:true on a Watch/Guided/Bob record that plays actions. Omit actions for a static scene. data.lesson.upto selects an already-completed working stage for column/grid/short-division apparatus. Static previews omit future actions; normal playback uses their native callbacks and waits for the host clock. Each action supports delayMs and, for instant operations, waitMs. The host clock coordinates pause, resume and cancellation. Reduced-motion playback reaches the same native result without movement.

Explore initial values belong in P.exploreBindings[conceptIndex].variables, each as {value:...}. Most F2 components use st. F2-06 uses a/b; F2-07 uses k/a/b; F2-11 uses expression/strict. Use the manifest's exact exploreFields. Reset restores the lesson's configured initial state, including each independent instance.

Control restrictions use native accessible labels from the manifest: controls:{'Example':{hidden:true,disabled:true},'Top number':{value:'278'}}. Policies support hidden, disabled, min/max/step, value, allowedValues and selector. They survive redraw. Set the native initial value as well as the allowed control range. HTML text operands still use their mathematical validators; hiding a selector does not change a number's scale.

For native lesson presets, put {nativeConfig:...} objects in P.manifest.explorePresets[conceptIndex]. The template creates lesson preset entries. For example F2-05's nativeConfig can be {label:'Decimals',view:'gattegno',g:{'-1':3,'-2':5}}. Existing preset entries may be overridden through componentConfigs. Arbitrary new preset keys should use the template's nativeConfig path.

F2-01 and F2-02 accept config.visiblePlaces to focus native columns; F2-05 accepts the native row/rod subset. Values retain their original powers of ten. Example F2-01: {config:{visiblePlaces:[-1,-2,-3]},data:{lesson:{value:'0.507'}}}. Focus is not a new scale: do not put nonzero lesson quantities outside a focused view unless that is deliberate teaching. Keep native places/rods/rows identities unchanged.

Two simultaneous original scenes use views:[{record:first},{record:second}] and layout:'rows'/'columns'; SVG IDs are scoped. Independent pupil controls use exploreInstances:[{source,config,explore,title,instructions},...] (1–4 frames). Each frame owns its state and reset. Separate input in both directions and exact reset were checked for every F2 component. Mixed different-family combinations and all 3–4-instance combinations were not exhaustively tested.

Put challenge game settings on D.learn[conceptIndex].challengeGame. Put six to eight independent questions in P.manifest.challenge. Each question needs source/nativeIndex/data, prompt, privateAnswer, answerType, hint and feedback. The original F0-12 wrapper mounts automatically; retain its lives, retry, hint cost, streak, score, celebration and reset behaviour. Challenge automatically conceals lesson readouts and actions. The drawn question must still match its independent key. Question-given values remain visible where pupils need them to calculate.

F2-16 cards use approved stacked chalk/neon fractions; finite decimals and exact roots classify mathematically. Use explicit recurring notation, not a truncated decimal advertised as an exact surd. Natural numbers start at 1 by default; naturalStartsAt:0 selects the other convention. Keep tray/region occupancy within the original layout; the manifest records this restriction.

Opt in to Guided speech with P.narration.examples=true. Bob uses the existing TTS controls. Use a suitable ttsDurationMs for the actual spoken sentence. Captions remain authoritative, sound may need a user gesture, and decimal numerals containing digit 4 remain caption-only until pronunciation is verified. Real speech start/boundary/end, pause/resume/reset/stop were tested on F2-08. Other installed voices are not all certified.

Every native engine has a finite numerical domain. In particular short division supports exact terminating answers through thousandths; other quotients need a different apparatus. Signed counter mats are limited to ten counters of each sign; this does not restrict signed arithmetic in other families. Read the per-component contract before generating new questions.
