/* F10 lesson records drive the approved native apparatus (2026-10-17). data.lesson.state = {preset?, ...overrides of that preset's own fields and of the engine's own model fields}.
   The lesson values are written into the native model for the duration of the draw (and re-applied on a width relayout), then the pupil's model is restored.
   Revealed phases use the engine's own renderer; concealed records and early phases use the engine's own Challenge-style view. */
const f10NativeRender=def.render,f10Noop=()=>{},f10Model=()=>(__MODEL__),f10Copy=x=>window.NovaV2Integration.mutable(x);
const f10Ctx=()=>({M:f10Copy(f10Model()),presets:(def.config&&def.config.presets)||{},cur:(()=>{const M=f10Model();return __CUR__;})()});
let f10N=0;const f10Tab=()=>((def.config&&def.config.presets)||{});
function f10Put(s){const M=f10Model(),T=f10Tab();let K=s.preset!=null?s.preset:(__CUR__);const pf=Object.keys(s).filter(k=>k!=='preset'&&!(k in M)&&T[K]&&(k in T[K]));
 if(pf.length){const o={};pf.forEach(k=>o[k]=s[k]);const L='__lesson'+(++f10N);if(f10N>24)delete T['__lesson'+(f10N-24)];Object.defineProperty(T,L,{value:window.NovaF10Runtime.merge(T[K],o),configurable:true,writable:true,enumerable:false});K=L;}
 if(s.preset!=null||pf.length){const P=T[K];__APPLY__;}for(const k of Object.keys(s))if(k!=='preset'&&(k in M))M[k]=f10Copy(s[k]);__AFTER__;}
function f10Lesson(l,stage){return window.NovaF4Runtime.run(def.config,stage,l,(l,p,hidden)=>{const M=f10Model(),snap=f10Copy(M),s=f10Copy(l.state||{}),rm=window.NOVA.reducedMotion,R=window.NovaF10Runtime;
 const back=()=>{for(const k of Object.keys(M))if(!(k in snap))delete M[k];Object.assign(M,f10Copy(snap));};window.NOVA.reducedMotion=()=>true;
 R.ctx={apply:()=>f10Put(s),restore:back};
 try{f10Put(s);if(hidden||p<__REV__){__HID__;}else{__SHOW__;}}finally{R.ctx=null;back();window.NOVA.reducedMotion=rm;}});}
for(const step of def.steps)step.lesson=null;
def.render=function(i,stage){const a=window.NovaLessonComponent?.active,l=(a?.data||a?.nativeData)?.lesson;return l?f10Lesson(l,stage):f10NativeRender.call(def,i,stage);};
