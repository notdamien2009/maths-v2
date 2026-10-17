# F7 template integration contract

Mount through the unchanged `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html`.

Native F7 steps carry only teaching text (name/narration/cue/prompt). **All lesson values go through `scene:{function,arguments}` records**, using the draw function and argument names listed in `F7-adapter-rows.json` → `draws`:
- F7-01 `view(tiles,opt)`; F7-02 `view(tiles,o)`; F7-03 `show(tiles,opt)`
  - tiles are `{id,type:'x2'|'x'|'one',sign:±1}`; F7-03 also needs `home:'scatter'`
- F7-04/05 `scene(p:{label,kind:'single'|'double',factor,constant|xConst,yConst})`
- F7-06 `show(p:{label,title,k,a,b})`; F7-07 `show(p:{label,n,c})`
- F7-08/09/10 `renderScene(m:{a,b,c,d,skin:'bags'|'balloons'|'cups',display,_transition:true})`
- F7-11 `present(o:{mode,n,b,total,context,names},v:{task:true,…})`
- F7-12 `display(p:{a,b,c,power,x},opt:{hideResult:true})`
- F7-13 `scene(p:{label,b,demo})`
- F7-14 `renderStage(p:{left,right,A,B},ts:[],o:{reveal:false})`

Labels and captions are scene arguments. Supply them whenever the numbers change, because the native labels describe the demo values.

**Challenge:** 6–8 such records per concept, each with prompt / privateAnswer / answerType / hint / feedback. Examples are in `F7-configuration-examples.json`.
