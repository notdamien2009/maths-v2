/* F8 lesson records drive the approved native apparatus (2026-10-17). data.lesson.state = {preset, ...overrides of that preset's own fields}.
   The merged preset is drawn by the engine's own step renderer; concealed records and phase 0 use the engine's own Challenge view. */
let f8N=0;const f8NativeRender=DEF.render,f8Noop=()=>{},f8Tab=()=>(__TAB__),f8Ctx=()=>({T:f8Tab(),current:__ACT__,X:__X__});
function f8Lesson(l,stage){return window.NovaF4Runtime.run(DEF.config,stage,l,(l,p,hidden)=>{const T=f8Tab(),keep=__ACT__,s=l.state||{},key=s.preset!=null&&Object.keys(T).includes(s.preset)?s.preset:keep;const P=window.NovaF8Runtime.merge(T[key],s);delete P.preset;
 const K='__lesson'+(++f8N);if(f8N>24)delete T['__lesson'+(f8N-24)];Object.defineProperty(T,K,{value:P,configurable:true,writable:true,enumerable:false});__MODESAVE__;__ACT__=K;const rm=window.NOVA.reducedMotion;window.NOVA.reducedMotion=()=>true;
 try{if(hidden||p<1){__HID__;}else{__MODEGUIDED__;f8NativeRender.call(DEF,Math.min(p,DEF.steps.length-1),stage);}}finally{window.NOVA.reducedMotion=rm;__ACT__=keep;__MODERESTORE__;}});}
for(const step of DEF.steps)step.lesson=null;
DEF.render=function(i,stage){const a=window.NovaLessonComponent?.active,l=(a?.data||a?.nativeData)?.lesson;return l?f8Lesson(l,stage):f8NativeRender.call(DEF,i,stage);};
