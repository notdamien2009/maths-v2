/* NOVA V2 native lesson API 1.0.0. Original renderers, artwork and core are authoritative. */
(function(w){'use strict';
const copy=x=>clone(x,new WeakMap());
function clone(x,seen){if(x===null||typeof x!=='object'||x.nodeType)return x;if(seen.has(x))return seen.get(x);let out;if(x instanceof Set){out=new Set();seen.set(x,out);for(const v of x)out.add(clone(v,seen));return out;}if(x instanceof Map){out=new Map();seen.set(x,out);for(const[k,v]of x)out.set(clone(k,seen),clone(v,seen));return out;}if(x instanceof Date)return new Date(x);if(ArrayBuffer.isView(x))return x.slice?x.slice():x;if(x instanceof ArrayBuffer)return x.slice(0);out=Array.isArray(x)?[]:Object.create(Object.getPrototypeOf(x));seen.set(x,out);for(const[k,v]of Object.entries(x))out[k]=clone(v,seen);return out;}

function hydrate(original,value){if(typeof original==='function'&&value!==original)throw Error('Native functions cannot be replaced by lesson data');if(original instanceof Set){if(!(value instanceof Set)&&!Array.isArray(value))throw Error('A native set expects an array of values');return new Set([...value].map(copy));}if(original instanceof Map){if(!(value instanceof Map)&&!Array.isArray(value))throw Error('A native map expects entries');return new Map([...value]);}if(Array.isArray(value))return value.map((v,i)=>hydrate(Array.isArray(original)?original[i]:undefined,v));if(value&&typeof value==='object'&&!value.nodeType){const out=original&&typeof original==='object'?copy(original):{};for(const[k,v]of Object.entries(value)){if(!['__proto__','prototype','constructor'].includes(k))out[k]=hydrate(original?.[k],v);else throw Error('Unsafe state key');}return out;}return copy(value);}
const safe=k=>!['__proto__','prototype','constructor'].includes(k);
function patch(t,v,path='state',extra=false){if(!v||typeof v!=='object'||Array.isArray(v))throw Error(path+' must be an object');for(const[k,x]of Object.entries(v)){if(!safe(k)||(!extra&&!(k in t)))throw Error('Unsupported '+path+'.'+k);const descriptor=Object.getOwnPropertyDescriptor(t,k);if(descriptor?.get&&!descriptor.set){if(extra)continue;throw Error('Read-only '+path+'.'+k);}if(x&&typeof x==='object'&&!Array.isArray(x)&&!(x instanceof Set)&&!(x instanceof Map)&&t[k]&&typeof t[k]==='object'&&!Array.isArray(t[k])&&!(t[k] instanceof Set)&&!(t[k] instanceof Map))patch(t[k],x,path+'.'+k,extra);else t[k]=hydrate(t[k],x);}return t;}
const registry={};w.NovaV2Integration={version:'1.0.0',mutable:copy,configuration:x=>Object.isFrozen(x)||!Object.isExtensible(x)?{...x}:x,registry,register(id,def,scope){
 const steps=def.steps,draw=def.render,explore=def.explore,config=def.config||{},models=scope.models||{},tables=scope.tables||{},draws=scope.draws||{};let active=null,clock=null,disposed=false,pendingRestore=null,exploring=false,exploreBinding={};const exploreInitials={};const scenes={},events=[];
 const getModels=()=>Object.fromEntries(Object.entries(models).map(([k,get])=>[k,copy(get())]).filter(([,v])=>v&&typeof v==='object'&&!Array.isArray(v)));
 function applyModels(){for(const[k,v]of Object.entries(active?.models||{})){if(!models[k])throw Error(id+': unsupported model '+k);patch(models[k](),v,'models.'+k);}}
 function args(name,a){a=Array.from(a);if(!scenes[name])scenes[name]={parameters:draws[name],sample:a.map((v,i)=>i===0&&v?.nodeType?'[native stage]':copy(v))};applyModels();if(active?.scene&&(!active.scene.function||active.scene.function===name))for(const[k,v]of Object.entries(active.scene.arguments||{})){const i=draws[name]?.indexOf(k);if(i==null||i<1)throw Error(id+': unsupported scene argument '+k);a[i]=hydrate(a[i],v);}return a;}
 function validate(r){let errors=[],i=r.nativeIndex??r.nativeStep??0,d=r.data??r.nativeData??{};if(!Number.isInteger(i)||i<0||i>=steps.length)errors.push('Invalid native index '+i);if(!d||typeof d!=='object'||Array.isArray(d))errors.push('Native data must be an object');else for(const k of Object.keys(d))if(!safe(k)||!(k in(steps[i]||{})))errors.push('Unsupported native field '+k);if(d?.name!==undefined&&d.name!==steps[i]?.name)errors.push('Native step names are renderer keys; use the lesson title for teaching text');for(const k of Object.keys(r.models||{}))if(!models[k])errors.push('Unsupported model '+k);for(const k of Object.keys(r.tables||{}))if(!tables[k])errors.push('Unsupported table '+k);if(r.scene){const f=r.scene.function;if(!draws[f])errors.push('Declare a supported scene function');else for(const k of Object.keys(r.scene.arguments||{}))if(draws[f].indexOf(k)<1)errors.push('Unsupported scene argument '+k);}if(r.config&&Object.keys(r.config).some(k=>k.startsWith('_')))errors.push('Private runtime fields are not lesson configuration');
if(id==='F2-01'&&d.v!==undefined&&d.v!==''&&(!/^\d{1,4}(?:\.\d{0,3})?$/.test(String(d.v))))errors.push('This chart supports non-negative values up to thousands and thousandths');
if(id==='F1-07'&&d.st){const st=d.st;if(st.min!==undefined&&st.max!==undefined&&!(st.min<st.max))errors.push('Card-line minimum must be below maximum');if(st.labelStep!==undefined&&!(st.labelStep>0))errors.push('Card-line steps must be positive');if(st.cards&&(!Array.isArray(st.cards)||st.cards.some(x=>!Number.isFinite(Number(x)))))errors.push('Cards must contain numerical values');if(st.labels&&(!Array.isArray(st.labels)||st.labels.length!==st.cards?.length||st.labels.some((x,i)=>String(x).trim()===''||Number(x)!==Number(st.cards[i]))))errors.push('Card labels must represent their actual numerical positions');}
if(r.parameters){if(id!=='F3-04'||Object.keys(r.parameters).some(k=>k!=='n')||!Number.isInteger(r.parameters.n)||r.parameters.n<2||r.parameters.n>36)errors.push('Unsupported mathematical parameters');}return{valid:!errors.length,errors};}
 function configure(v){if(v&&Object.keys(v).length)patch(config,v,'config');}
 function configureExplore(binding={}){for(const k of Object.keys(binding.variables||{}))if(!(k in(scope.exploreFields||{})))throw Error(id+': unsupported Explore variable '+k);for(const k of Object.keys(binding.tables||{}))if(!tables[k])throw Error(id+': unsupported Explore table '+k);for(const k of Object.keys(binding.models||{}))if(!models[k])throw Error(id+': unsupported Explore model '+k);exploreBinding=copy(binding);}
 function applyExploreModels(){if(exploring)for(const[k,v]of Object.entries(exploreBinding.models||{}))patch(models[k](),v,'explore.models.'+k);}
 function exploreInit(name,factory,args){const binding=exploring?exploreBinding.variables?.[name]:null;if(binding?.factoryArgs&&!args)throw Error(id+': '+name+' is not a native state factory');const value=args?factory(...(binding?.factoryArgs||args)):factory();if(!(name in exploreInitials))exploreInitials[name]=copy(value);applyExploreModels();return binding&&Object.prototype.hasOwnProperty.call(binding,'value')?hydrate(value,binding.value):value;}
 function runExplore(args){api.cancel();exploring=true;try{for(const[k,v]of Object.entries(exploreBinding.tables||{})){const table=tables[k]();if(Array.isArray(table)){if(!Array.isArray(v))throw Error(k+' expects an array');table.splice(0,table.length,...copy(v));}else patch(table,v,'explore.tables.'+k,true);}applyExploreModels();return explore?.apply(def,args);}finally{exploring=false;}}
 function render(r,stage,animate=true){if(disposed)throw Error(id+': disposed');const check=validate(r);if(!check.valid)throw Error(id+': '+check.errors.join('; '));api.cancel();let i=r.nativeIndex??r.nativeStep??0,d=r.data??r.nativeData??{},saved=copy(steps[i]),oldSteps=def.steps,oldModels=getModels(),oldTables={},oldConfig={},rm=w.NOVA.reducedMotion;active=r;let restored=false;const restore=()=>{if(restored)return;restored=true;steps[i]=saved;patch(config,oldConfig,'config restore',true);for(const[k,v]of Object.entries(oldTables)){let t=tables[k]();if(Array.isArray(t))t.splice(0,t.length,...v);else patch(t,v,'restore',true);}for(const[k,v]of Object.entries(oldModels))patch(models[k](),v,'restore',true);};pendingRestore=restore;
 try{for(const k of Object.keys(r.config||{}))if(k in config)oldConfig[k]=copy(config[k]);configure(r.config);for(const[k,v]of Object.entries(r.tables||{})){const t=tables[k]();oldTables[k]=copy(t);if(Array.isArray(t)){if(!Array.isArray(v))throw Error(k+' expects array');t.splice(0,t.length,...copy(v));}else patch(t,v,'tables.'+k);}
 steps[i]={...saved,...copy(d)};def.steps=steps;applyModels();if(!animate)w.NOVA.reducedMotion=()=>true;draw.call(def,i,stage);
 const text=stage.textContent;for(const value of r.assertions?.contains||[])if(!text.includes(String(value)))throw Error(id+': visual missing '+value);for(const value of r.assertions?.excludes||[])if(text.includes(String(value)))throw Error(id+': visual unexpectedly reveals '+value);
 events.push({index:i,text,at:Date.now()});if(events.length>16)events.shift();
 }catch(error){restore();pendingRestore=null;active=null;throw error;}finally{def.steps=oldSteps;w.NOVA.reducedMotion=rm;}if(!animate){restore();pendingRestore=null;}
 return(clock?.idle()||Promise.resolve()).finally(()=>{if(pendingRestore===restore){restore();pendingRestore=null;}if(active===r)active=null;});}
 const api={id,version:'1.0.0',nativeSteps:steps,nativeRender:draw,config,args,applyModels,validate,configure,configureExplore,applyExploreModels,exploreInit,render,models:getModels,scenes,events,get active(){return active;},get clock(){return clock;},set clock(v){clock=v;},describe(){return{id,version:this.version,stepCount:steps.length,steps:copy(steps),config:copy(config),models:getModels(),tables:Object.fromEntries(Object.entries(tables).map(([k,get])=>[k,copy(get())])),draws,exploreFields:scope.exploreFields||{},exploreInitials:copy(exploreInitials)};},cancel(){clock?.cancel();const restore=pendingRestore;pendingRestore=null;restore?.();active=null;w.NOVA.ui?.cancelDrag?.();},dispose(){api.cancel();disposed=true;},explore(...a){return runExplore(a);}};
 def.explore=function(...a){return runExplore(a);};const onRestore=def.onRestore;def.onRestore=function(...a){api.cancel();return onRestore?.apply(def,a);};registry[id]=api;def.lesson=api;w.NovaLessonComponent=api;if(w.parent!==w&&typeof w.parent.NovaLessonNativeSetup==='function')w.parent.NovaLessonNativeSetup(w,def,config,steps);return api;
}};
})(window);

/* F11-02 · ANGLE ESTIMATOR · NOVA canonical F0/F1 core (no overrides). */
const F112_CONFIG=Object.freeze({id:'F11-02',family:'F11',startMode:'watch',defaultPreset:'acute',presets:{
 acute:{label:'Acute · less than a right angle',angle:63,base:'right',benchmark:90,why:'Compare the opening with a right angle, then estimate the part of that quarter turn.'},
 obtuse:{label:'Obtuse · between 90° and 180°',angle:132,base:'right',benchmark:90,why:'A wide angle is more than one quarter turn but less than a half turn.'},
 right:{label:'Right angle · quarter turn',angle:90,base:'right',benchmark:90,why:'A quarter turn is exactly ninety degrees.'},
 straight:{label:'Straight angle · half turn',angle:180,base:'right',benchmark:180,why:'A half turn forms a straight line: one hundred and eighty degrees.'},
 left:{label:'Left-starting baseline',angle:147,base:'left',benchmark:180,why:'The angle is the opening between rays. Rotating its baseline does not change its size.'},
 reflex:{label:'Reflex · more than a half turn',angle:238,base:'right',benchmark:180,why:'The marked direction sweeps past a straight angle. That is more than one hundred and eighty degrees.'},
 gcse:{label:'GCSE · fine estimation',angle:107,base:'right',benchmark:90,why:'The opening is just past ninety degrees: estimate the overshoot before measuring.'}
},events:{value:['preset','angle','estimate','benchmark','reason','task','accuracy','reset'],types:['step','mode','correct','hintUsed']}});
window.F112_CONFIG=F112_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F112_CONFIG),ID=C.id,rad=Math.PI/180;
if(N.premium?.enable)N.premium.enable();
const S={preset:'acute',angle:63,base:'right',estimate:55,benchmark:90,revealed:false,reason:'',task:0,wrong:0,answered:false,snap:1};
const X=380,Y=297,R=200,clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const STEPS=[
 {name:'See the opening',mood:'explain',narration:'An angle is the amount of turn between two rays. Before you measure, look at the opening.'},
 {name:'Find the quarter turn',mood:'point-right',narration:'A right angle is ninety degrees. Does this angle open less than, exactly, or more than a right angle?'},
 {name:'Compare a half turn',mood:'count',narration:'A straight angle is one hundred and eighty degrees. That half turn is twice a right angle.'},
 {name:'Notice halfway',mood:'magnify',narration:'Half of a right angle is forty-five degrees. Use this useful midway landmark to improve your estimate.'},
 {name:'Make an estimate',mood:'think',narration:'This angle looks larger than forty-five degrees, but smaller than ninety. Predict a sensible number.'},
 {name:'Test your estimate',mood:'ruler',narration:'Now compare your estimate with the measured angle. The difference tells you how close you were.'},
 {name:'Estimate an obtuse angle',mood:'compare',narration:'This angle is more than ninety degrees but less than one hundred and eighty. Think of ninety plus a little more.'},
 {name:'Rotate the starting ray',mood:'point-left',narration:'The rays may point left, right, up or down. Angle size depends on the turn, not the position on the page.'},
 {name:'Consider a reflex turn',mood:'idea',narration:'A reflex angle continues past a half turn. Two hundred and forty degrees is two thirds of a full turn.'},
 {name:'Estimate, check, improve',mood:'celebrate',narration:'Use landmarks, predict before measuring and check the size of your error. Next time, aim to improve it.'}
];
function emit(k,v){if(!C.events.value.includes(k))throw Error('Undeclared F11-02 event '+k);N.events.emit('value',{engine:ID,key:k,value:v})}
function setPreset(k){if(!C.presets[k])k='acute';S.preset=k;S.angle=C.presets[k].angle;S.base=C.presets[k].base;S.benchmark=C.presets[k].benchmark;S.estimate=45;S.revealed=false;S.reason='';emit('preset',k)}
function pt(a,r=R,base=S.base){let th=((base==='left'?180-a:a))*rad;return [X+Math.cos(th)*r,Y-Math.sin(th)*r]}
function swept(a,r=65,base=S.base){const cnt=Math.ceil(Math.max(1,a)/3),q=['M',...pt(0,r,base)];let d='M '+q[1].toFixed(2)+' '+q[2].toFixed(2);for(let i=1;i<=cnt;i++){const t=pt(a*i/cnt,r,base);d+=' L '+t[0].toFixed(2)+' '+t[1].toFixed(2)}return d}
function chalk(svg,x,y,text,role='given',size=32,opts={}){return N.chalkText(svg,x,y,String(text),{role,size,anchor:'middle',...opts})}
function card(k,t,desc){return H('section',{class:'f112-card'},[H('div',{class:'f112-eyebrow',text:k}),H('div',{class:'f112-big',text:t}),H('p',{class:'f112-hint',text:desc})])}
function btn(s,fn,cls='nova-btn ghost'){return H('button',{type:'button',class:cls,text:s,onclick:fn})}

/* F11 rotary-angle interaction: an additive F0/F1 pointer adapter, not a shared-core replacement.
   The shared F0 tile-drag intentionally eases by .38; that delay is inappropriate for a
   radial degree handle. This adapter previews geometry via one rAF / frame, retains the
   SVG and pointer capture, and commits state once on release. No whole-stage repaint on move. */
function f11RotaryDrag(svg,handle,o){
 let active=null;
 handle.style.touchAction='none';handle.style.cursor='grab';
 handle.addEventListener('pointerdown',e=>{
  if(active||N.ui._drag||(e.pointerType==='mouse'&&e.button!==0))return;
  e.preventDefault();e.stopPropagation();
  const matrix=svg.getScreenCTM();if(!matrix)return;
  const inv=matrix.inverse(),id=e.pointerId,initial=o.start();
  const state={id,initial,angle:initial,raf:0,point:null,captured:false};active=state;
  function angleOf(ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const pt=p.matrixTransform(inv);return o.fromPoint(pt.x,pt.y)}
  function flush(){state.raf=0;if(active!==state)return;if(state.point!=null){const n=state.point;state.point=null;if(n!==state.angle){state.angle=n;o.preview(n);handle.setAttribute('aria-valuenow',String(n));}}}
  function move(ev){if(active!==state||ev.pointerId!==id)return;ev.preventDefault();state.point=angleOf(ev);if(!state.raf)state.raf=requestAnimationFrame(flush)}
  function clean(){if(active!==state)return;active=null;cancelAnimationFrame(state.raf);state.raf=0;
   handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);
   handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);
   window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);
   window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);
   window.removeEventListener('scroll',cancel,true);
   if(N.ui._drag===guard)N.ui._drag=null;
   try{if(handle.hasPointerCapture(id))handle.releasePointerCapture(id)}catch(_){}
   handle.style.cursor='grab';}
  function up(ev){if(active!==state||ev.pointerId!==id)return;ev.preventDefault();
   state.point=angleOf(ev);flush();const angle=state.angle;clean();o.commit(angle);}
  function cancel(){if(active!==state)return;clean();o.cancel(state.initial);}
  function lost(){if(active===state)cancel()}
  function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}
  const guard={cancel,up,get captured(){return state.captured},get moved(){return state.angle!==initial}};
  N.ui._drag=guard;
  handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);
  handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);
  window.addEventListener('blur',cancel);window.addEventListener('keydown',key);
  window.addEventListener('scroll',cancel,true);
  try{handle.setPointerCapture(id);state.captured=handle.hasPointerCapture(id)}catch(_){}
  if(!state.captured){window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
  handle.style.cursor='grabbing';
 });
}

function geom(stage,opts={}){
if(window.NovaLessonComponent?.active){[stage,opts]=window.NovaLessonComponent.args("geom",arguments);}

 const q={angle:S.angle,base:S.base,estimate:S.estimate,benchmark:S.benchmark,revealed:S.revealed,step:9,challenge:false,pose:'think',caption:'Estimate the opening by comparing it with a right angle.',editable:false,...opts};
 stage.replaceChildren();const theme=q.angle>=180?'reflex':q.angle===90?'right':q.angle>90?'obtuse':'acute';
 const hall=H('section',{class:'f112-theatre','data-testid':'f112-stage','data-theme-angle':theme,'data-revealed':String(!!q.revealed)});
 hall.append(H('div',{class:'f112-top'},[H('span',{text:q.challenge?'ESTIMATE CHALLENGE · NO PROTRACTOR YET':'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'pill',text:'NEON + NOVA CHALK'})]));
 const layout=H('div',{class:'f112-layout'}),plane=H('div',{class:'f112-plane'});
 const svg=N.svg.root(760,580,'Angle estimator showing two neon rays and a comparison ring with 45, 90 and 180 degree benchmarks. A yellow estimate marker is movable.');
 svg.classList.add('nv-svg','f112-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f112-angle-svg';
 const g=E('g',{'aria-hidden':'true'},svg);
 // A ring is a 360° comparator, NOT a measuring protractor. Only standard 45/90/180 landmarks appear.
 E('circle',{cx:X,cy:Y,r:R+29,fill:'none',stroke:'#4195bc','stroke-width':'1.5','stroke-dasharray':'2 10',opacity:'.42','pointer-events':'none'},g);
 for(let a=0;a<360;a+=45){const b=pt(a,R+19,q.base),z=pt(a,R+32,q.base);N.neonLine(g,b[0],b[1],z[0],z[1],{role:a%90===0?'given':'support',width:a%90===0?2.8:1.5})}
 // Visible benchmarks are conceptual reference marks, never a pre-labelled measurement of the unknown.
 if(q.step>=1 || q.editable || q.challenge){const z=pt(90,R+45,q.base),label=pt(90,R+19,q.base);N.neonLine(g,X,Y,...pt(90,R*.89,q.base),{role:'support',width:2,dash:'8 9'});chalk(svg,label[0],label[1], '90°', 'given',32)}
 if(q.step>=2 || q.editable || q.challenge){const z=pt(180,R+47,q.base),label=pt(180,R+76,q.base);chalk(svg,label[0],label[1]+8,'180°','given',27)}
 if(q.step===3 || q.step===4 || q.step===5 || q.editable || q.challenge){const label=pt(45,R+63,q.base);chalk(svg,label[0]+8,label[1]-6,'45°','given',27)}
 const outer=pt(0,236,q.base),second=pt(q.angle,236,q.base);
 // Subtle measured area depth with NOVA paths; no hand-styled SVG substitute for F0 helpers.
 const wedge=(q.step>=1||q.editable||q.challenge)?swept(q.angle,78,q.base):swept(q.angle,58,q.base);
 const wedgeGroup=N.neonPath(g,wedge,{role:'focus',width:6});
 N.neonLine(g,X,Y,outer[0],outer[1],{role:'given',width:8});
 const movingRay=E('g',{'data-live-ray':'true'},svg);
 N.neonLine(movingRay,X,Y,second[0],second[1],{role:'op',width:9});
 N.neonRing(svg,X,Y,{r:10,role:'result',pulse:false});
 N.neonRing(movingRay,second[0],second[1],{r:9,role:'unknown',pulse:false});
 // Explore-only actual-ray handle: low-latency rotary pointer adapter with F0 drawing primitives, separate from the estimate ring.
 if(q.editable && !q.challenge){
  const knob=pt(q.angle,151,q.base),ah=E('g',{role:'slider',tabindex:'0',class:'f112-handle','aria-label':'Actual angle arm. Move by keyboard arrows or drag. Actual measurement stays hidden until reveal.','aria-valuemin':'0','aria-valuemax':'359','aria-valuenow':q.angle,'data-testid':'f112-arm-handle'},svg);
  E('circle',{cx:knob[0],cy:knob[1],r:16,fill:'#43eefa40',stroke:'#69e8fb','stroke-width':3},ah);
  E('circle',{cx:knob[0],cy:knob[1],r:26,class:'f112-focus'},ah);
  const startAngle=q.angle;
  const rotation=n=>(q.base==='right'?-1:1)*(n-startAngle);
  const preview=n=>{
    const turn=rotation(n);
    movingRay.setAttribute('transform',`rotate(${turn} ${X} ${Y})`);
    ah.setAttribute('transform',`rotate(${turn} ${X} ${Y})`);
    const next=swept(n,78,q.base);
    wedgeGroup.querySelectorAll('path').forEach(path=>path.setAttribute('d',next));
  };
  const move=(a,via)=>{S.angle=clamp(a,0,359);S.revealed=false;S.estimate=clamp(S.estimate,0,S.angle>180?359:180);emit('angle',{degrees:S.angle,via});if(q.onAngle)q.onAngle(S.angle,via);else geom(stage,{...q,angle:S.angle,revealed:false});if(via==='keyboard')stage.querySelector('[data-testid=f112-arm-handle]')?.focus()};
  ah.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const inc=(e.shiftKey?5:1)*S.snap;move(e.key==='Home'?0:e.key==='End'?359:q.angle+((e.key==='ArrowLeft'||e.key==='ArrowDown')?-inc:inc),'keyboard')});
  f11RotaryDrag(svg,ah,{start:()=>startAngle,
   fromPoint:(x,y)=>{let a=(Math.atan2(Y-y,x-X)/rad+360)%360;if(q.base==='left')a=(180-a+360)%360;return clamp(Math.round(a/S.snap)*S.snap,0,359)},
   preview,commit:n=>move(n,'pointer'),cancel:()=>preview(startAngle)});
 }
 const labelAt=pt(q.angle,151,q.base);
 if(q.revealed && !q.challenge){chalk(svg,labelAt[0],labelAt[1]-12,q.angle+'°','result',37)}
 if(q.revealed && q.challenge){chalk(svg,labelAt[0],labelAt[1]-14,q.angle+'°','result',38)}
 else if(!q.revealed){chalk(svg,X,565,'HOW WIDE IS THE TURN?','focus',29)}
 if(q.revealed){const d=Math.abs(q.estimate-q.angle);chalk(svg,X,561,Math.round(d)+'° '+(d===0?'EXACT': 'DIFFERENCE'),'result',30)}
 // Estimate marker on outer ring. It moves independently from the TRUE ray; comparing the two is the lesson.
 if(q.editable){
  const mark=pt(q.estimate,R+32,q.base);const markerGroup=E('g',{'data-live-estimate':'true'},svg);N.neonRing(markerGroup,mark[0],mark[1],{r:13,role:'focus',pulse:false});
  const h=E('g',{class:'f112-handle',role:'slider',tabindex:'0','aria-label':'Estimate marker. Use Left and Right arrows to change the estimate.','aria-valuemin':0,'aria-valuemax':q.angle>180?359:180,'aria-valuenow':q.estimate,'data-testid':'f112-estimate-handle'},markerGroup);
  E('circle',{cx:mark[0],cy:mark[1],r:24,fill:'#ffa93b29',stroke:'#ffdf83','stroke-width':2.8},h);
  E('circle',{cx:mark[0],cy:mark[1],r:33,class:'f112-focus'},h);
  const first=q.estimate;
  const preview=n=>{const turn=(q.base==='right'?-1:1)*(n-first);markerGroup.setAttribute('transform',`rotate(${turn} ${X} ${Y})`);
    const out=hall.querySelector('.f112-card:nth-child(2) .f112-big');if(out)out.textContent=n+'°';};
  const commit=(n,via)=>{S.estimate=clamp(Math.round(n/S.snap)*S.snap,0,q.angle>180?359:180);S.revealed=false;emit('estimate',{degrees:S.estimate,via});if(typeof q.onEstimate==='function')q.onEstimate(S.estimate,via);else geom(stage,{...q,estimate:S.estimate,revealed:false});if(via==='keyboard')stage.querySelector('[data-testid=f112-estimate-handle]')?.focus()};
  h.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();let m=e.shiftKey?5:1;commit(e.key==='Home'?0:e.key==='End'?(q.angle>180?359:180):q.estimate+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-m:m)*S.snap,'keyboard')});
  f11RotaryDrag(svg,h,{start:()=>first,
   fromPoint:(x,y)=>{let a=(Math.atan2(Y-y,x-X)/rad+360)%360;if(q.base==='left')a=(180-a+360)%360;return clamp(Math.round(a/S.snap)*S.snap,0,q.angle>180?359:180)},
   preview,commit:n=>commit(n,'pointer'),cancel:()=>preview(first)});
 }
 plane.append(svg);layout.append(plane);
 const info=H('aside',{class:'f112-info','aria-label':'Estimation evidence'});
 const measured=q.revealed?q.angle+'°':'NOT SHOWN YET';
 info.append(card('ACTUAL ANGLE',measured,q.revealed?'The angle has now been measured. Compare with your estimate.':'Look first. Estimation works only if the answer stays hidden.'));
 info.append(card('YOUR ESTIMATE',q.estimate+'°',q.challenge?'Use the marker or numeric field.':'Estimate first, then choose Reveal to check.'));
 info.append(card('BENCHMARK',q.benchmark+'°',q.angle>180?'Reflex: the turning direction passes 180°.':q.angle>90?'Compare with 90° and 180°.':'Compare with 45° and 90°.'));
 layout.append(info);hall.append(layout);
 if(q.challenge){const m=N.helperImg(q.revealed?'cheer':S.wrong?'oops':'think','teen');hall.append(H('div',{class:'f112-izaac'},[H('img',{src:m.src,alt:'Izaac NOVA peer '+(q.revealed?'celebrating':'thinking')}),H('span',{text:q.revealed?'Izaac: You tested the size of your estimate against the true angle.':S.wrong?'Izaac: Use forty-five, ninety and one hundred and eighty as landmarks.':'Izaac: Make a reasoned estimate BEFORE you check the exact angle.'})]));}
 stage.append(hall);N.scene.helperStrip(hall,q.pose,q.caption);
 return svg;
}
function render(i,stage){const rows=[{a:63,b:'right',est:55,bench:90},{a:63,b:'right',est:55,bench:90},{a:180,b:'right',est:170,bench:180},{a:45,b:'right',est:40,bench:45},{a:63,b:'right',est:55,bench:90},{a:63,b:'right',est:55,bench:90},{a:132,b:'right',est:125,bench:90},{a:147,b:'left',est:145,bench:180},{a:240,b:'right',est:230,bench:180},{a:107,b:'right',est:100,bench:90}];const o=rows[i]||rows[9];geom(stage,{step:i,angle:o.a,base:o.b,estimate:o.est,benchmark:o.bench,revealed:i===5||i===9,pose:STEPS[i].mood,caption:STEPS[i].narration})}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f112-tools');
 window.NovaLessonComponent?.applyExploreModels();function update(){panel.replaceChildren();const pre=H('select',{class:'nova-input','aria-label':'Angle context','data-testid':'f112-preset'});Object.keys(C.presets).forEach(k=>pre.append(H('option',{value:k,text:C.presets[k].label})));pre.value=S.preset;pre.onchange=()=>{setPreset(pre.value);update()};panel.append(H('label',{class:'f112-span'},['ANGLE CONTEXT',pre]));
 const angleOut=H('span',{class:'f112-value',text:'Hidden until reveal'}),angleRange=H('input',{type:'range',min:0,max:359,step:1,value:S.angle,'aria-label':'Change actual angle', 'data-testid':'f112-actual-slider'});angleRange.classList.add('f112-range');angleRange.oninput=()=>{S.angle=+angleRange.value;S.revealed=false;S.estimate=clamp(S.estimate,0,S.angle>180?359:180);estRange.max=String(S.angle>180?359:180);estRange.value=String(S.estimate);estOut.textContent=S.estimate+'°';panel.querySelectorAll('.f112-accuracy').forEach(x=>x.remove());angleOut.textContent='Hidden until reveal';emit('angle',S.angle);paint()};panel.append(H('label',{class:'f112-span'},['CHANGE ANGLE TO INVESTIGATE ',angleOut,angleRange]));
 const estOut=H('span',{class:'f112-value',text:S.estimate+'°'}),estRange=H('input',{type:'range',min:0,max:S.angle>180?359:180,step:1,value:S.estimate,'aria-label':'Change estimate in degrees','data-testid':'f112-estimate-slider'});estRange.classList.add('f112-range');estRange.oninput=()=>{S.estimate=+estRange.value;S.revealed=false;panel.querySelectorAll('.f112-accuracy').forEach(x=>x.remove());estOut.textContent=S.estimate+'°';emit('estimate',{degrees:S.estimate,via:'slider'});paint()};panel.append(H('label',{class:'f112-span'},['YOUR PREDICTION ',estOut,estRange]));
 const bench=H('div',{class:'f112-benchbar f112-span'});[[45,'45° / halfway'],[90,'90° / right'],[180,'180° / straight']].forEach(([num,t])=>bench.append(H('button',{type:'button',class:'f112-bench','aria-pressed':String(S.benchmark===num),text:t,onclick:()=>{S.benchmark=num;emit('benchmark',num);update()}})));panel.append(bench);
 const base=H('select',{class:'nova-input','aria-label':'Choose starting-ray orientation'});[['right','Right-starting ray'],['left','Left-starting ray']].forEach(([v,t])=>base.append(H('option',{value:v,text:t})));base.value=S.base;base.onchange=()=>{S.base=base.value;paint()};panel.append(H('label',{},['STARTING DIRECTION',base]));
 const snap=H('select',{class:'nova-input','aria-label':'Estimate step size'});[[1,'1° steps'],[5,'5° steps']].forEach(([v,t])=>snap.append(H('option',{value:v,text:t})));snap.value=String(S.snap);snap.onchange=()=>{S.snap=+snap.value;paint()};panel.append(H('label',{},['MARKER PRECISION',snap]));
 const act=H('div',{class:'f112-actions f112-span'});act.append(btn('Reveal + compare',()=>{S.revealed=true;angleOut.textContent=S.angle+'°';emit('accuracy',{actual:S.angle,estimate:S.estimate,error:Math.abs(S.estimate-S.angle)});paint();const msg=H('div',{class:'f112-accuracy'},[H('span',{text:'ESTIMATION ERROR'}),H('strong',{text:Math.abs(S.estimate-S.angle)+'°'})]);panel.querySelectorAll('.f112-accuracy').forEach(x=>x.remove());act.after(msg)},'nova-btn primary'),btn('Hide angle again',()=>{S.revealed=false;update()}),btn('Reset preset',()=>{setPreset(S.preset);emit('reset',S.preset);update()}));panel.append(act);
 panel.append(H('p',{class:'f112-explain f112-span',text:'Compare with a quarter turn, half turn or halfway landmark. Move the outer gold estimate marker by drag, keyboard or slider. Reveal the exact number only after predicting.'}));
 paint();}
 window.NovaLessonComponent?.applyExploreModels();function paint(){geom(stage,{editable:true,pose:S.revealed?'celebrate':'ruler',caption:S.revealed?'Compare the true turn with your estimate. The absolute difference is your estimation error.':'Make your prediction by eye first. The gold marker is your estimate, not the actual angle.',onAngle:(n,via)=>{const input=panel.querySelector('[data-testid=f112-actual-slider]');if(input){input.value=String(n);input.closest('label').querySelector('.f112-value').textContent='Hidden until reveal'};const pred=panel.querySelector('[data-testid=f112-estimate-slider]');if(pred){pred.max=String(S.angle>180?359:180);pred.value=String(S.estimate);pred.closest('label').querySelector('.f112-value').textContent=S.estimate+'°'};panel.querySelectorAll('.f112-accuracy').forEach(x=>x.remove());paint()},onEstimate:(n,via)=>{panel.querySelectorAll('.f112-accuracy').forEach(x=>x.remove());const input=panel.querySelector('[data-testid=f112-estimate-slider]');if(input){input.value=String(n);input.closest('label').querySelector('.f112-value').textContent=n+'°'};paint()}})}
 window.NovaLessonComponent?.applyExploreModels();update();}
const TASKS=[
 {a:63,b:'right',tol:10,reason:'acute',question:'Estimate this acute angle without a protractor.',hint:'It is wider than 45° but narrower than 90°. Estimate between those landmarks.',solution:'The true angle is 63°. An estimate within 10° is reasonable.'},
 {a:132,b:'right',tol:10,reason:'obtuse',question:'How wide is this obtuse opening?',hint:'It is about halfway between 90° and 180°.',solution:'The true angle is 132°. The half-turn benchmark rules out acute answers.'},
 {a:44,b:'right',tol:8,reason:'half',question:'Estimate the angle close to half a right angle.',hint:'Half of ninety degrees is forty-five degrees.',solution:'The true angle is 44° — very close to 45°.'},
 {a:147,b:'left',tol:10,reason:'rotate',question:'The starting ray points left. Estimate the angle anyway.',hint:'Rotating a drawing does not change the angle between rays.',solution:'The angle is 147°. Starting left does not alter its size.'},
 {a:238,b:'right',tol:12,reason:'reflex',question:'This is a reflex turn. Estimate beyond 180°.',hint:'Compare with a half turn (180°) and a three-quarter turn (270°).',solution:'The true reflex angle is 238° — past a half turn.'},
 {a:107,b:'right',tol:7,reason:'obtuse',question:'GCSE precision: estimate the angle just wider than a right angle.',hint:'The opening passes 90° by a small amount. Estimate the overshoot.',solution:'The measured angle is 107°; a close estimate should be near 100° to 114°.'}
];
const reasons=[['','Choose the closest mathematical reason'],['acute','The opening is smaller than a right angle (90°).'],['obtuse','It is bigger than 90° but smaller than 180°.'],['half','It is about half of the right-angle benchmark.'],['rotate','Changing the starting-ray direction does not change the opening.'],['reflex','The sweep continues beyond the 180° half turn.']];
function validation(t,v,reason){if(!Number.isFinite(v))return 'Enter a number of degrees, or move the gold prediction ring.';if(v<0||v>=360)return 'Estimate must be between 0° and 359°.';if(t.a>180 && v<=180)return 'This is a reflex angle. Your estimate needs to be greater than 180°.';if(t.a<90&&v>90)return 'The pictured angle is acute. Compare it with a 90° right angle.';if(t.a>90&&t.a<180&&v<90)return 'This angle is obtuse. Your estimate is too small.';if(Math.abs(v-t.a)>t.tol){let diff=Math.abs(v-t.a);return 'Your prediction is '+diff+'° from the true opening — outside the '+t.tol+'° estimation band. Use the benchmark as a reference and try again.'}if(reason!==t.reason)return 'Your estimate is close. Now choose the mathematical comparison that supports it.';return ''}
function challenge(panel,api,stage){let index=0;S.task=0;S.wrong=0;const title=H('div',{class:'pr-task'}),intro=H('p',{class:'f112-explain'}),entry=H('div',{class:'f112-challenge-tools'}),actions=H('div',{class:'f112-actions'});panel.append(title,intro,entry,actions);
 function load(){const t=TASKS[index];S.task=index;S.angle=t.a;S.base=t.b;S.estimate=t.a>180?190:40;S.revealed=false;S.answered=false;S.wrong=0;S.reason='';entry.replaceChildren();actions.replaceChildren();api.fb.className='nova-fb';api.fb.textContent='';title.textContent='Task '+(index+1)+' / '+TASKS.length+' · '+t.question;intro.textContent='First make a visual estimate. Then explain it using a reference angle.';
 const inp=H('input',{type:'number',min:0,max:359,step:1,class:'nova-input',placeholder:'Your estimate in degrees','aria-label':'Estimated angle in degrees','data-testid':'f112-answer'});inp.oninput=()=>{const n=Number(inp.value);if(inp.value!==''&&Number.isFinite(n)){S.estimate=clamp(n,0,359);paint(false)}emit('estimate',{degrees:inp.value,via:'input'})};
 const slide=H('input',{type:'range',min:0,max:t.a>180?359:180,step:1,value:S.estimate,'data-testid':'f112-challenge-slider','aria-label':'Adjust estimate marker'});slide.classList.add('f112-range');slide.oninput=()=>{S.estimate=+slide.value;inp.value=String(S.estimate);emit('estimate',{degrees:S.estimate,via:'slider'});paint(false)};
 const why=H('select',{class:'nova-input','data-testid':'f112-reason','aria-label':'Choose mathematical reason'});reasons.forEach(([v,label])=>why.append(H('option',{value:v,text:label})));why.onchange=()=>{S.reason=why.value;emit('reason',{task:index,value:S.reason})};
 entry.append(H('label',{class:'f112-question'},['YOUR ESTIMATE (°)',inp]),H('label',{class:'f112-question'},['MOVE THE GOLD PREDICTION MARKER',slide]),H('label',{class:'f112-question'},['WHAT LANDMARK SUPPORTS YOUR ESTIMATE?',why]));
 const next=()=>{S.answered=true;S.revealed=true;api.check(true,t.solution,{task:index+1,estimate:S.estimate,error:Math.abs(S.estimate-t.a)});paint(true);actions.replaceChildren();if(index===TASKS.length-1)actions.append(H('p',{class:'f112-value',text:'6 / 6 · ANGLE ESTIMATOR MASTERED'}));else actions.append(btn('Next estimation task →',()=>{index++;load()},'nova-btn primary'))};
 actions.append(btn('Check estimate + reason',()=>{let val=inp.value.trim()===''?NaN:Number(inp.value);let err=validation(t,val,why.value);if(err){S.wrong++;api.check(false,err,{task:index+1});paint(false);return}next()},'nova-btn primary'),btn('Hint',()=>api.hint(t.hint)));
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')actions.querySelector('button')?.click()});paint(false);
 function paint(done){geom(stage,{step:9,challenge:true,angle:t.a,base:t.b,estimate:S.estimate,revealed:done,benchmark:t.a>180?180:t.a>90?90:45,editable:!done,pose:done?'celebrate':S.wrong?'not-yet':'think',caption:done?'Estimate checked: the number of degrees is now revealed.':'No protractor reading yet. Use 45°, 90° or 180° to make an informed estimate.',onEstimate:(a)=>{S.estimate=a;inp.value=String(a);slide.value=String(Math.min(+slide.max,a));}})}
 }
 load();
}
const def={id:ID,title:'Angle Estimator',config:C,steps:STEPS,render,explore,challenge,alt:'Neon angle diagram with 45°, 90°, 180° comparison marks, a movable gold estimate ring marker and two rays. No measuring scale is shown before prediction.',staticAlt:'Estimate angles using a 45° halfway landmark, a 90° quarter turn, a 180° straight angle and a 360° full turn.',exploreIntro:'Estimate first; only reveal the exact angle after you have made a prediction.',onRestore:()=>setPreset('acute')};
N.registry.add({id:ID,title:'Angle Estimator',family:'F11',topics:['angles','estimation','benchmarks','acute','obtuse','reflex'],deps:['F0-02','F0-04','F0-07','F0-08','F11-01']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS,"reasons":()=>reasons},draws:{"geom":["stage","opts"]},exploreFields:{}});
N.bankMount({id:ID,num:'02',title:'Angle Estimator · Premium Edition',def,linked:['F11-01','F11-03','F11-04','F0-16'],years:'Years 7–9 · Estimate angles before using a protractor, GCSE precision extension',spec:{purpose:'Estimate acute, right, obtuse, straight and reflex angles using the reference turns 45°, 90°, 180° and 360°.',params:'0–359° angle; 0–359° prediction; orientation; precision; benchmark reveal; tolerance.',presets:'Acute, obtuse, right, straight, left-starting, reflex and GCSE fine-estimation.',steps:'Ten progressive teaching steps: opening, quarter turn, half turn, midway benchmark, prediction, error, obtuse, rotation, reflex, improve.',interactions:'NOVA Watch/Guided/Explore/Challenge. Draggable and keyboard-operable independent estimate marker; numeric and slider equivalents; six reasoning-based graded tasks.',traps:'Confusing acute/obtuse, treating a rotated starting ray as a different angle, ignoring reflex turns, claiming inaccurate estimates are exact.',gcse:'Tighter seven-degree estimation band on the 107° task.'}});
const imgAlt=()=>document.querySelectorAll('#F11-02 img').forEach(x=>{if(!x.alt)x.alt='NOVA maths helper'});imgAlt();window.addEventListener('load',imgAlt,{once:true});
})();
