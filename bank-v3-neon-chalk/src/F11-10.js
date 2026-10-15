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

/* NOVA F11-10 — Bearings · Premium review. Built on protected F0/F1 core.
   Compass, bearing arcs, route vectors, reverse bearings and challenge values
   share a single north-clockwise vector model. */
const F110_CONFIG=Object.freeze({id:'F11-10',family:'F11',defaultPreset:'y8_052',presets:{
 y8_052:{label:'Y8-052 · Three-figure bearings',kind:'single',bearing:65},
 y9_039:{label:'Y9-039 · Reverse bearings',kind:'reverse',bearing:65},
 y9_027:{label:'Y9-027 · Intersection of bearings',kind:'intersection',bearing:45},
 y9_route:{label:'Year 9 · Multi-step route',kind:'route',bearing:40,second:125},
 y8_cardinals:{label:'Compass bearings · 090° East',kind:'single',bearing:90},
 y9_obtuse:{label:'Bearings over 180°',kind:'single',bearing:225},
 y9_northwest:{label:'Three-figure bearings · 315°',kind:'single',bearing:315}},
 events:{value:['kind','preset','bearing','second','phase','task','answer','reason','reset'],types:['step','mode','correct','hintUsed']}});
window.F110_CONFIG=F110_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F11-10',CFG=window.NovaV2Integration.configuration(F110_CONFIG),PI=Math.PI;
N.premium?.enable?.();
const DEF={kind:'single',preset:'y8_052',bearing:65,second:125,phase:6};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const br=(v)=>((Math.round(v)%360)+360)%360;
const three=v=>String(br(v)).padStart(3,'0')+'°';
const vec=(b,r)=>({x:Math.sin(b*PI/180)*r,y:-Math.cos(b*PI/180)*r});
const point=(x,y)=>({x,y});const plus=(a,b)=>point(a.x+b.x,a.y+b.y);
const back=b=>br(b+180);
const bearing=(a,b)=>br(Math.atan2(b.x-a.x,-(b.y-a.y))*180/PI);
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw Error('Unknown F11-10 event '+key);N.events.emit('value',{engine:ID,key,value})};
const btn=(s,f,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text:s,onclick:f});
const prose=t=>H('p',{class:'f110-explain f110-wide',text:t});
const line=(g,a,b,role='given',w=4)=>N.neonLine(g,a.x,a.y,b.x,b.y,{role,width:w});
const path=(g,d,role='focus',width=4)=>N.neonPath(g,d,{role,width});
const ring=(g,p,r=8,role='result')=>N.neonRing(g,p.x,p.y,{r,role,pulse:false});
const chalk=(g,x,y,t,role='given',size=25,anchor='middle')=>N.chalkText(g,x,y,String(t),{role,size,anchor});
function circularArc(g,c,r,a,b,role='focus',width=4){let p=plus(c,vec(a,r)),q=plus(c,vec(b,r)),d=(b-a+360)%360;if(d<.001)d=359.999;return path(g,`M${p.x.toFixed(3)} ${p.y.toFixed(3)} A${r} ${r} 0 ${d>180?1:0} 1 ${q.x.toFixed(3)} ${q.y.toFixed(3)}`,role,width)}
function model(st){const kind=st.kind||'single',b=br(st.bearing??65),second=br(st.second??125);
 if(kind==='single')return {kind,bearing:b,O:point(366,293),P:plus(point(366,293),vec(b,190)),reverse:back(b)};
 if(kind==='reverse'){const A=point(272,320),B=plus(A,vec(b,215));return {kind,bearing:b,A,B,reverse:back(b)}};
 if(kind==='route'){const A=point(185,370),B=plus(A,vec(b,186)),C=plus(B,vec(second,183));return{kind,A,B,C,bearing:b,second,direct:bearing(A,C),reverse:back(second)}};
 if(kind==='intersection'){let alpha=clamp(b,30,65),A=point(232,413),B=point(512,413),P=point(372,413-140/Math.tan(alpha*PI/180));return {kind,A,B,P,bearing:alpha,second:360-alpha,reverse:back(alpha)}};
 throw Error('Unsupported bearing scene '+kind)}
function stageShell(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("stageShell",arguments);}
stage.replaceChildren();const sec=H('section',{class:'f110-theatre','data-testid':'f110-stage'}),head=H('div',{class:'f110-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f110-tag',text:'NOVA · NEON CHALK'})]);sec.append(head);const layout=H('div',{class:'f110-layout'}),plane=H('div',{class:'f110-plane'}),svg=N.svg.root(730,530,'Bearing compass: north-reference rays and correctly measured clockwise angle arcs');svg.classList.add('nv-svg','f110-svg');svg.dataset.testid='f110-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','137 12 475 507');plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return {sec,layout,plane,svg}}
function azimuth(g,at,len=135){let n=plus(at,vec(0,len));line(g,at,n,'focus',3.2);chalk(g,n.x,n.y-10,'N','focus',26);let ax=point(n.x,n.y-3);path(g,`M${ax.x-7} ${ax.y+13} L${ax.x} ${ax.y} L${ax.x+7} ${ax.y+13}`,'focus',3)}
function rose(g,O,R=190){ // rings and compass lettering are pure core drawing helpers
 circularArc(g,O,R,0,180,'given',1.6);circularArc(g,O,R,180,359.9,'given',1.6);
 for(let k=0;k<12;k++){let t=k*30;let a=plus(O,vec(t,R-4)),b=plus(O,vec(t,R+(k%3===0?10:4)));line(g,a,b,k%3===0?'focus':'given',k%3===0?3:1.6)}
 for(const [a,s] of [[0,'N'],[90,'E'],[180,'S'],[270,'W']]){let p=plus(O,vec(a,a===180?R-26:R+29));chalk(g,p.x,p.y+8,s,a===0?'focus':'given',27)} }
function drawGeometry(svg,opts){let st=opts,ph=opts.phase??6,hide=!!opts.hide,editable=!!opts.editable,m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("drawGeometry.m",(...a)=>model(...a),[st]):(model(st))),kind=m.kind;svg.querySelector('[data-testid=f110-geometry]')?.remove();const g=E('g',{'data-testid':'f110-geometry',style:'pointer-events:none'},svg);let h=svg.querySelector('.f110-handle');if(h)svg.insertBefore(g,h);let target=null,origin=null;let reveal=ph>=6&&!hide;
 if(kind==='single'){
  const O=m.O,P=m.P;origin=O;target=P;
  if(ph>=1){rose(g,O,183);ring(g,O,11,'result');chalk(g,342,316,'O','result',25)}
  if(ph>=2){line(g,O,plus(O,vec(0,174)),'focus',3.2);}
  if(ph>=3){line(g,O,P,'op',6);ring(g,P,9,'op')}
  if(ph>=4){circularArc(g,O,67,0,m.bearing,'result',5)}
  if(ph>=5){let ap=plus(O,vec(m.bearing/2,99));chalk(g,ap.x,ap.y+7,'CLOCKWISE','result',25)}
  if(reveal)chalk(g,370,510,`BEARING  ${three(m.bearing)}`,'result',31);
 }else if(kind==='reverse'){
  let{A,B}=m;origin=A;target=B;
  if(ph>=1){line(g,A,B,'op',6);ring(g,A,10,'result');ring(g,B,10,'result');chalk(g,A.x-23,A.y+20,'A','given',28);chalk(g,B.x+24,B.y-9,'B','given',28)}
  if(ph>=2)azimuth(g,A,118);
  if(ph>=3){circularArc(g,A,56,0,m.bearing,'focus',5);azimuth(g,B,110)}
  if(ph>=4)circularArc(g,B,57,0,m.reverse,'result',5);
  if(ph>=5){chalk(g,225,477,'A → B','focus',27);chalk(g,523,477,'B → A','result',27)}
  if(reveal){chalk(g,224,510,three(m.bearing),'focus',26);chalk(g,524,510,three(m.reverse),'result',26)}
 }else if(kind==='route'){
  let {A,B,C}=m;origin=A;target=B;
  if(ph>=1){ring(g,A,10,'result');chalk(g,A.x-19,A.y+30,'A','given',26);azimuth(g,A,102)}
  if(ph>=2){line(g,A,B,'op',6);ring(g,B,10,'result');chalk(g,B.x-12,B.y-16,'B','given',26);circularArc(g,A,45,0,m.bearing,'focus',4)}
  if(ph>=3){azimuth(g,B,92);line(g,B,C,'result',6);ring(g,C,10,'result');chalk(g,C.x+16,C.y+26,'C','given',26)}
  if(ph>=4){circularArc(g,B,47,0,m.second,'result',4);}
  if(ph>=5){let dash=E('path',{d:`M${A.x} ${A.y} L${C.x} ${C.y}`,fill:'none',stroke:'#b38eff','stroke-width':2.8,'stroke-dasharray':'8 9',opacity:'.8'},g);chalk(g,(A.x+C.x)/2+10,(A.y+C.y)/2+22,'DIRECT','result',24)}
  if(reveal){chalk(g,227,500,`A → B  ${three(m.bearing)}`,'focus',25);chalk(g,500,500,`B → C  ${three(m.second)}`,'result',25)}
 }else if(kind==='intersection'){
  let {A,B,P}=m;origin=A;target=plus(A,vec(m.bearing,200));
  if(ph>=1){ring(g,A,10,'result');ring(g,B,10,'result');chalk(g,A.x-22,A.y+28,'A','given');chalk(g,B.x+19,B.y+28,'B','given');}
  if(ph>=2){azimuth(g,A,120);azimuth(g,B,120);}
  if(ph>=3){line(g,A,P,'op',5);circularArc(g,A,60,0,m.bearing,'focus',4);}
  if(ph>=4){line(g,B,P,'result',5);circularArc(g,B,60,0,m.second,'result',4);}
  if(ph>=5){ring(g,P,12,'result');chalk(g,P.x,P.y-20,'P','result',29)}
  if(reveal){chalk(g,219,507,three(m.bearing),'focus',26);chalk(g,521,507,three(m.second),'result',26)}
 }
 // Keep handle node outside replaceable geometry layer, preserving pointer capture during a live drag.
 if(editable&&target){let handle=svg.querySelector('[data-testid=f110-angle-handle]');if(!handle)handle=E('circle',{r:30,fill:'transparent',stroke:'transparent',tabindex:0,role:'slider',class:'f110-handle','data-testid':'f110-angle-handle',style:'touch-action:none'},svg);handle.setAttribute('cx',target.x);handle.setAttribute('cy',target.y);handle.setAttribute('aria-label','Rotate the bearing ray clockwise from north. Arrow keys adjust by five degrees.');handle.setAttribute('aria-valuemin',kind==='intersection'?30:kind==='route'?25:kind==='reverse'?20:0);handle.setAttribute('aria-valuemax',kind==='intersection'?65:kind==='route'?80:kind==='reverse'?145:355);handle.setAttribute('aria-valuenow',m.bearing);ring(g,target,12,'result');}
 if(!editable)svg.querySelector('[data-testid=f110-angle-handle]')?.remove();
 if(editable&&kind==='route'){
  let h=svg.querySelector('[data-testid=f110-second-handle]');if(!h)h=E('circle',{r:31,fill:'transparent',stroke:'transparent',tabindex:0,role:'slider',class:'f110-handle','data-testid':'f110-second-handle',style:'touch-action:none'},svg);
  h.setAttribute('cx',m.C.x);h.setAttribute('cy',m.C.y);h.setAttribute('aria-label','Change second leg bearing, clockwise from north');h.setAttribute('aria-valuemin','90');h.setAttribute('aria-valuemax','155');h.setAttribute('aria-valuenow',m.second);ring(g,m.C,11,'result');
 }else svg.querySelector('[data-testid=f110-second-handle]')?.remove();
 return m;
}
function info(st){let m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("info.m",(...a)=>model(...a),[st]):(model(st))),full=(st.phase??6)>=6&&!st.hide;switch(m.kind){
 case 'single':return ['North is zero','CLOCKWISE FROM NORTH',full?three(m.bearing):'?','Angles are always measured clockwise from the north line.'];
 case 'reverse':return ['Opposite directions','ADD OR SUBTRACT 180°',full?three(m.reverse):'?','The reverse bearing differs by exactly a half-turn.'];
 case 'route':return ['Two linked journey legs','RESTART AT EACH POINT',full?three(m.direct):'?','Each new leg is measured from north at its own starting point.'];
 case 'intersection':return ['Two starting stations','MEETING BEARINGS',full?'MEET AT P':'?','Both rays must point to the same intersection P.'];}
}
function card(label,value,desc){return H('section',{class:'f110-card'},[H('div',{class:'f110-eyebrow',text:label}),H('div',{class:'f110-main',text:value}),H('p',{class:'f110-sub',text:desc})])}
function draw(stage,opts={}){
if(window.NovaLessonComponent?.active){[stage,opts]=window.NovaLessonComponent.args("draw",arguments);}
let box=stageShell(stage),aside=H('aside',{class:'f110-aside','data-testid':'f110-aside'}),cards=[];for(let i=0;i<3;i++){let c=card('','','');cards.push(c);aside.append(c)}box.layout.append(aside);
function repaint(values={}){Object.assign(opts,values);let m=drawGeometry(box.svg,opts),values2=info(opts),data=[['COMPASS REFERENCE',values2[0],values2[3]],['MATHEMATICAL RULE',values2[1],'One complete clockwise revolution is 360°.'],['BEARING OR RESULT',values2[2],'Three-figure bearings include a leading zero.']];if(opts.hide)data[2][1]='?';data.forEach((d,i)=>{cards[i].querySelector('.f110-eyebrow').textContent=d[0];cards[i].querySelector('.f110-main').textContent=d[1];cards[i].querySelector('.f110-sub').textContent=d[2]});return m}
repaint();N.scene.helperStrip(box.sec,opts.pose||'explain',opts.caption||'A bearing is an angle measured clockwise from north.');return {...box,repaint}}
const STEPS=[
{kind:'single',phase:1,name:'Find north',pose:'point-down',narration:'At a location, first look for the north arrow. North is our zero direction.'},
{kind:'single',phase:2,name:'Start on the north ray',pose:'ruler',narration:'Place the zero line along north, not east or south.'},
{kind:'single',phase:3,name:'Choose the direction',pose:'point-right',narration:'The blue ray shows the direction you are travelling.'},
{kind:'single',phase:4,name:'Measure clockwise',pose:'count',narration:'Travel clockwise from north until you reach the blue ray.'},
{kind:'single',phase:5,name:'Keep the reference visible',pose:'compare',narration:'The angle starts from north even when the destination sits to the right.'},
{kind:'single',phase:6,name:'Write three figures',pose:'idea',narration:'Write the bearing with three figures. Sixty-five degrees is zero six five degrees.'},
{kind:'single',bearing:90,phase:6,name:'East is ninety degrees',pose:'point-right',narration:'East is a clockwise quarter-turn: zero nine zero degrees.'},
{kind:'single',bearing:180,phase:6,name:'South is one eighty',pose:'point-down',narration:'South is the clockwise half-turn, one hundred and eighty degrees.'},
{kind:'single',bearing:270,phase:6,name:'West is two seventy',pose:'point-left',narration:'West is reached after three clockwise quarter-turns.'},
{kind:'single',bearing:315,phase:6,name:'Cross past west',pose:'compare',narration:'Northwest has bearing three hundred and fifteen degrees, not forty-five.'},
{kind:'reverse',phase:1,name:'Two destinations',pose:'show-two',narration:'Bearings describe a direction from one specified starting point.'},
{kind:'reverse',phase:2,name:'North at A',pose:'point-down',narration:'For A to B, measure clockwise from north at A.'},
{kind:'reverse',phase:3,name:'Use north at B',pose:'ruler',narration:'To travel back, restart at B and measure from north again.'},
{kind:'reverse',phase:4,name:'Turn through a half-circle',pose:'compare',narration:'Opposite directions always differ by one hundred and eighty degrees.'},
{kind:'reverse',phase:6,name:'Calculate the back bearing',pose:'idea',narration:'Add one hundred and eighty, or subtract it if the first bearing is greater than one hundred and eighty.'},
{kind:'route',phase:1,name:'Start the journey',pose:'explain',narration:'A multi-stage route begins at A.'},
{kind:'route',phase:2,name:'First leg A to B',pose:'point-right',narration:'Measure the first leg clockwise from north at A.'},
{kind:'route',phase:3,name:'Second leg B to C',pose:'ruler',narration:'At B, draw another north line before measuring towards C.'},
{kind:'route',phase:4,name:'Check the second turn',pose:'compare',narration:'The second bearing starts at north at B, not at the end of the previous ray.'},
{kind:'route',phase:5,name:'Compare direct travel',pose:'idea',narration:'The direct line from A to C is different from either individual leg.'},
{kind:'route',phase:6,name:'Read both three-figure bearings',pose:'celebrate',narration:'Label each leg with its own clockwise bearing and the correct starting location.'},
{kind:'intersection',phase:1,name:'Two fixed stations',pose:'show-two',narration:'Two bearings from different locations can locate a meeting point.'},
{kind:'intersection',phase:2,name:'North at both stations',pose:'ruler',narration:'Draw north at A and at B. These north lines must be parallel.'},
{kind:'intersection',phase:3,name:'First bearing ray',pose:'point-right',narration:'From A, construct a line at the stated clockwise bearing.'},
{kind:'intersection',phase:4,name:'Second bearing ray',pose:'point-left',narration:'From B, construct the second ray with its own clockwise bearing.'},
{kind:'intersection',phase:5,name:'Find the crossing',pose:'point-down',narration:'Their intersection gives the location satisfying both directions.'},
{kind:'intersection',phase:6,name:'Verify from both sides',pose:'celebrate',narration:'Check the clockwise angles from both stations to the same point.'}
];
function render(i,stage){let p=STEPS[i]||STEPS[0];draw(stage,{...DEF,...p,caption:p.narration})}
function svgPt(svg,e){let p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;let m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):p}
function dragHandle(h,svg,get,project,set){h.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||N.ui._drag)return;e.preventDefault();let id=e.pointerId,start=get(),active=true,raf=0,pending=null;const drag={cancel:()=>finish(true),captured:true,moved:true};N.ui._drag=drag;
function frame(){raf=0;if(pending!==null){let v=pending;pending=null;set(v,true)}}
function move(ev){if(!active||ev.pointerId!==id)return;ev.preventDefault();pending=project(svgPt(svg,ev));if(!raf)raf=requestAnimationFrame(frame)}
function finish(cancel,ev){if(!active)return;let val=cancel?start:ev?project(svgPt(svg,ev)):pending??get();active=false;cancelAnimationFrame(raf);pending=null;h.removeEventListener('pointermove',move);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',abort);h.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',abort);try{h.releasePointerCapture(id)}catch(_){}if(N.ui._drag===drag)N.ui._drag=null;set(val,false)}
function up(e){if(e.pointerId===id)finish(false,e)}function abort(){finish(true)}function lost(){if(active)finish(true)}function key(e){if(e.key==='Escape'){e.preventDefault();finish(true)}}
h.addEventListener('pointermove',move);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',abort);h.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',abort);try{h.setPointerCapture(id)}catch(e){finish(true)}});
h.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();let lo=Number(h.getAttribute('aria-valuemin')),hi=Number(h.getAttribute('aria-valuemax'));set(clamp(get()+(['ArrowUp','ArrowRight'].includes(e.key)?5:-5),lo,hi),false)})}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f110-tools');window.NovaLessonComponent?.applyExploreModels();let st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",()=>({...DEF})):({...DEF})),box;
window.NovaLessonComponent?.applyExploreModels();const preset=H('select',{class:'nova-input f110-preset-select','data-testid':'f110-preset','aria-label':'Choose bearings lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([k,p])=>preset.append(H('option',{value:k,text:p.label})));window.NovaLessonComponent?.applyExploreModels();preset.value=st.preset;
window.NovaLessonComponent?.applyExploreModels();const kind=H('select',{class:'nova-input','data-testid':'f110-kind','aria-label':'Select bearing scene'});window.NovaLessonComponent?.applyExploreModels();for(const [k,v]of Object.entries({single:'Single three-figure bearing',reverse:'Reverse bearing between points',route:'Multi-leg route A–B–C',intersection:'Intersection of two bearings'}))kind.append(H('option',{value:k,text:v}));
window.NovaLessonComponent?.applyExploreModels();panel.append(H('label',{class:'f110-wide'},['Lesson preset',preset]),H('label',{class:'f110-wide'},['Construction scene',kind]));
window.NovaLessonComponent?.applyExploreModels();function range(id,title,min,max,step){let input=H('input',{type:'range',min:String(min),max:String(max),step:String(step),value:String(st[id]),'data-testid':'f110-'+id}),out=H('span',{class:'f110-value',text:three(st[id])});let row=H('label',{class:'f110-control'},[title,H('div',{class:'f110-explorebar'},[input,out])]);panel.append(row);return{row,input,out}}
window.NovaLessonComponent?.applyExploreModels();let fields={bearing:range('bearing','Bearing clockwise from north',0,355,5),second:range('second','Second leg (B to C)',90,155,5),phase:range('phase','Construction reveal step',1,6,1)};
window.NovaLessonComponent?.applyExploreModels();panel.append(prose('Drag the gold compass-ray handle to rotate immediately. Use the arrow keys for exact five-degree changes; Escape cancels a drag.'));
window.NovaLessonComponent?.applyExploreModels();const actions=H('div',{class:'f110-actions f110-wide'});window.NovaLessonComponent?.applyExploreModels();panel.append(actions);
window.NovaLessonComponent?.applyExploreModels();function updateControls(){kind.value=st.kind;for(let [k,f]of Object.entries(fields)){f.row.style.display=k==='second'&&st.kind!=='route'?'none':'grid';f.input.min=k==='bearing'?({route:25,reverse:20,intersection:30,single:0}[st.kind]):k==='second'?'90':'1';f.input.max=k==='bearing'?({route:80,reverse:145,intersection:65,single:355}[st.kind]):k==='second'?'155':'6';f.input.value=String(st[k]);f.out.textContent=k==='phase'?String(st[k]):three(st[k])}}
window.NovaLessonComponent?.applyExploreModels();function paint(){updateControls();const opt={...st,editable:true,hide:false,caption:'Measure clockwise from the north reference. The diagram and value agree.'};if(!box)box=draw(stage,opt);else box.repaint(opt);for(let id of ['angle','second']){let h=box.svg.querySelector(`[data-testid=f110-${id}-handle]`);if(!h||h.dataset.bound)continue;h.dataset.bound='1';let key=id==='angle'?'bearing':'second';let get=()=>st[key],project=p=>{let m=model(st),base=id==='second'?m.B:st.kind==='single'?m.O:st.kind==='reverse'?m.A:st.kind==='route'?m.A:m.A;let v=bearing(base,p),low=Number(h.getAttribute('aria-valuemin')),high=Number(h.getAttribute('aria-valuemax'));return clamp(Math.round(v/5)*5,low,high)},set=value=>{st[key]=value;emit(key,value);box.repaint({...st,editable:true,hide:false});updateControls()};dragHandle(h,box.svg,get,project,set)}}
window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{let p=CFG.presets[preset.value];Object.assign(st,{preset:preset.value,kind:p.kind,bearing:p.bearing??65,second:p.second??125,phase:6});emit('preset',st.preset);paint()};
window.NovaLessonComponent?.applyExploreModels();kind.onchange=()=>{st.kind=kind.value;st.phase=6;let lim={single:[0,355],reverse:[20,145],route:[25,80],intersection:[30,65]}[st.kind];st.bearing=clamp(st.bearing,...lim);emit('kind',st.kind);paint()};
window.NovaLessonComponent?.applyExploreModels();for(let[k,f]of Object.entries(fields))f.input.oninput=()=>{st[k]=+f.input.value;emit(k,st[k]);paint()};
window.NovaLessonComponent?.applyExploreModels();actions.append(btn('Complete diagram',()=>{st.phase=6;emit('phase',6);paint()},'nova-btn primary'),btn('Restart teaching',()=>{st.phase=1;emit('phase',1);paint()}),btn('Restore defaults',()=>{Object.assign(st,DEF);preset.value=st.preset;emit('reset',st.preset);paint()}));window.NovaLessonComponent?.applyExploreModels();paint()}
const REASONS={clockwise:'Bearings are measured clockwise from north.',reverse:'Reverse bearings differ by 180 degrees.',origin:'Each leg has its own north reference at its starting point.',three:'Bearings must be written as three figures.',intersection:'Both bearing rays meet at the same point.',route:'The second bearing is measured from north at B.'};
const TASKS=[
{kind:'single',bearing:90,answer:90,reason:'clockwise',q:'A boat heads due east. What is its clockwise bearing from north (degrees)?',hint:'North to east is a clockwise quarter-turn.',wrong:'Check the clockwise quarter-turn from north.'},
{kind:'single',bearing:65,answer:65,reason:'three',q:'A direction is 65° clockwise from north. Enter the numerical value of its three-figure bearing.',hint:'Write 065° rather than 65° in your written answer.',wrong:'It is measured clockwise; three-figure writing includes a leading zero.'},
{kind:'reverse',bearing:65,answer:245,reason:'reverse',q:'The bearing from A to B is 065°. What is the bearing from B to A?',hint:'Add a half-turn of 180°.',wrong:'To reverse direction, add 180° and wrap at 360°.'},
{kind:'single',bearing:315,answer:315,reason:'clockwise',q:'A direction is northwest, 45° anticlockwise from north. What is its clockwise bearing?',hint:'Measure the longer clockwise route: 360° minus 45°.',wrong:'A northwest bearing is greater than 270°, not 045°.'},
{kind:'reverse',bearing:105,answer:285,reason:'reverse',q:'A traveller moves from A to B on a bearing of 105°. Give the reverse bearing.',hint:'The return path faces the opposite direction.',wrong:'Add 180° to the original direction.'},
{kind:'route',bearing:40,second:125,answer:125,reason:'route',q:'A→B is 040° and B→C is 125°. What is the bearing on the second leg?',hint:'Use the north line at B; do not add the two bearings.',wrong:'Bearings of route legs do not add together.'},
{kind:'reverse',bearing:105,answer:105,reason:'origin',q:'The bearing from B to A is 285°. What is the bearing from A to B?',hint:'Subtract 180° because 285° exceeds 180°.',wrong:'Subtract 180° from the return bearing.'},
{kind:'intersection',bearing:45,answer:45,reason:'intersection',q:'A bearing ray of 045° from A and 315° from B meet at P. What is the bearing from A to P?',hint:'The north line at A is the start of the angle.',wrong:'Use the ray that begins at A, not the one at B.'}
];
function dragReason(el,target,onDrop){el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||N.ui._drag)return;let id=e.pointerId,startX=e.clientX,startY=e.clientY,ghost=null;let d={cancel:clear,moved:true,captured:true};N.ui._drag=d;function move(ev){if(ev.pointerId!==id)return;if(!ghost&&Math.hypot(ev.clientX-startX,ev.clientY-startY)>7){ghost=H('div',{class:'f110-ghost',text:el.textContent});document.body.append(ghost)}if(ghost){ghost.style.left=(ev.clientX+12)+'px';ghost.style.top=(ev.clientY+12)+'px';let r=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)}}function clear(){el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',abort);window.removeEventListener('blur',abort);window.removeEventListener('keydown',key);target.dataset.hover='false';ghost?.remove();try{el.releasePointerCapture(id)}catch(_){}if(N.ui._drag===d)N.ui._drag=null}function up(ev){if(ev.pointerId!==id)return;let r=target.getBoundingClientRect(),hit=ghost&&ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;clear();if(hit)onDrop()}function abort(){clear()}function key(e){if(e.key==='Escape'){e.preventDefault();clear()}}el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',abort);window.addEventListener('blur',abort);window.addEventListener('keydown',key);try{el.setPointerCapture(id)}catch(e){clear()}})}
function challenge(panel,api,stage){panel.classList.add('f110-tools');let idx=0;function show(){let t=TASKS[idx];panel.replaceChildren();panel.append(H('div',{class:'pr-task f110-wide',text:`CHALLENGE ${idx+1} / ${TASKS.length}`}),prose(t.q));let input=H('input',{class:'nova-input',type:'number',step:'any',placeholder:'Bearing in degrees','data-testid':'f110-answer'});panel.append(H('label',{class:'f110-wide'},['YOUR BEARING · DEGREES',input]));let choices=H('div',{class:'f110-reasons f110-wide'}),drop=H('div',{class:'f110-drop f110-wide','data-testid':'f110-reason-drop',text:'Choose or drag the matching mathematical reason here'});let selected=null;
function choose(k){selected=k;drop.textContent=REASONS[k];drop.dataset.set='true';emit('reason',k);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))}
for(let [key,reason]of Object.entries(REASONS)){let b=H('button',{type:'button',class:'f110-reason','data-reason':key,'aria-pressed':'false',text:reason,onclick:()=>choose(key)});dragReason(b,drop,()=>choose(key));choices.append(b)}panel.append(choices,drop);let actions=H('div',{class:'f110-actions f110-wide'}),feedback=H('p',{class:'f110-wide f110-finish','aria-live':'polite'});panel.append(actions,feedback);let setup={...DEF,...t,phase:6,hide:true,pose:'think',caption:'Look from north at the correct starting point. Give the bearing and its mathematical reason.'};draw(stage,setup);
let check=btn('Check answer + reason',()=>{let value=Number(input.value),err='';if(input.value.trim()===''||!Number.isFinite(value))err='Enter a numerical bearing in degrees.';else if(Math.abs(value-t.answer)>1e-7)err=t.wrong;else if(selected!==t.reason)err='The value is right, but the reason does not justify it.';if(err){api.check(false,err,{task:idx+1});feedback.textContent=err;return}api.check(true,`${three(t.answer)}. ${REASONS[t.reason]}`,{task:idx+1,answer:t.answer,reason:selected});emit('answer',{task:idx+1,answer:value,reason:selected});draw(stage,{...setup,hide:false,pose:'celebrate',caption:'Correct. Clockwise from north, using the right starting point.'});actions.replaceChildren();feedback.textContent=`Correct · ${three(t.answer)}`;if(idx===TASKS.length-1)actions.append(H('strong',{class:'f110-finish',text:'8 / 8 · BEARINGS MASTERY'}));else actions.append(btn('Next challenge →',()=>{idx++;emit('task',idx+1);show()},'nova-btn primary'))},'nova-btn primary');actions.append(check,btn('Hint',()=>api.hint(t.hint)));input.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()})}show()}
const def={id:ID,title:'Bearings',config:CFG,steps:STEPS,render,explore,challenge,alt:'Three-figure compass bearings measured clockwise from north with draggable rays, reverse directions and navigation routes.',staticAlt:'Start at the north line at the specified location, rotate clockwise towards the destination, and write a three-digit angle. For opposite bearings add or subtract 180 degrees.',exploreIntro:'Choose a bearing scenario and drag the gold handle to adjust the direction in real time.',onRestore:()=>emit('reset',DEF.preset)};
N.registry.add({id:ID,title:'Bearings',family:'F11',topics:['three figure bearings','clockwise from north','reverse bearings','multi-leg routes','bearing intersections'],deps:['F0-02','F0-04','F0-16','F11-05','F11-09']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"DEF":()=>DEF},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"stageShell":["stage"],"draw":["stage","opts"]},exploreFields:{"st":{"kind":"value","factory":null,"argCount":null},"drawGeometry.m":{"kind":"factory","factory":"model","argCount":1},"info.m":{"kind":"factory","factory":"model","argCount":1}}});
N.bankMount({id:ID,num:'10',title:'Bearings · Premium Edition',def,linked:['F11-05','F11-09','F11-11'],years:'Year 8–9 · Bearings and multi-stage navigation',spec:{purpose:'Measure and construct clockwise three-figure bearings from north and reason about reverse directions and route origins.',params:'Bearing, second leg direction, scenario, reveal phase.',presets:'Y8-052, Y9-039, Y9-027, multi-leg and cardinal-point variations.',steps:'Progressive states for single, reverse, multi-leg and intersecting bearings.',interactions:'Live ray handles, keyboard, reason-card drag, reveal and eight assessed tasks.',traps:'Measuring anticlockwise, measuring from east, forgetting north at the next point, and incorrect reverse bearings.',gcse:'Multi-step bearings; intersecting bearing lines'}});
window.__F110_MATH__={bearing,vec,back,model,TASKS,STEPS,three};
})();
