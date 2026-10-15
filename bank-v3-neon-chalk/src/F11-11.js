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

/* NOVA F11-11 · ANGLE CHASE / F11-13 formal proof preset.
   Protected F0/F1 core; mathematical constructions derived from one shared geometry model. */
const F111_CONFIG=Object.freeze({id:'F11-11',family:'F11',defaultPreset:'y7_line',presets:{
 y7_line:{label:'Y7-041 · Angles on a line',kind:'line',angle:65},
 y7_point:{label:'Y7-041 · Around a point',kind:'point',angle:70},
 y7_opposite:{label:'Y7-041 · Vertically opposite',kind:'opposite',angle:73},
 y7_parallel:{label:'Y7-042 · Parallel lines',kind:'parallel',angle:62},
 y7_triangle:{label:'Y7-043 · Triangle angle chase',kind:'triangle',angle:55},
 y8_polygon:{label:'Y8-049 · Polygon angles',kind:'polygon',sides:6},
 y8_congruence:{label:'Y8-056 · Isosceles triangle reasoning',kind:'isosceles',angle:48},
 y9_parallel:{label:'Y9-025 · Multi-step parallel proof',kind:'parallel',angle:58,proof:true},
 y9_polygon:{label:'Y9-026 · Polygon angle proof',kind:'polygon',sides:8,proof:true},
 y9_proof:{label:'F11-13 · Formal geometry proof stepper',kind:'triangle',angle:55,proof:true},
 y9_congruence:{label:'Y9-028 · Equal base angles proof',kind:'isosceles',angle:48,proof:true}},
 events:{value:['preset','kind','angle','sides','phase','task','answer','reason','reset','proof','rotation'],types:['mode','step','hintUsed','correct']}});
window.F111_CONFIG=F111_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F11-11',CFG=window.NovaV2Integration.configuration(F111_CONFIG),PI=Math.PI;
N.premium?.enable?.();
const DEF={kind:'line',preset:'y7_line',angle:65,sides:6,phase:6,proof:false,rotation:0};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),rad=x=>x*PI/180,deg=x=>x*180/PI,fix=x=>Math.round(x*1000000)/1000000;
const p=(x,y)=>({x,y}),add=(a,b)=>p(a.x+b.x,a.y+b.y),vec=(a,r)=>p(Math.cos(rad(a))*r,Math.sin(rad(a))*r);
const line=(g,a,b,role='given',w=4)=>N.neonLine(g,a.x,a.y,b.x,b.y,{role,width:w});
const path=(g,d,role='focus',w=4)=>N.neonPath(g,d,{role,width:w});
const ring=(g,a,r=9,role='result')=>N.neonRing(g,a.x,a.y,{r,role,pulse:false});
const chalk=(g,x,y,s,role='given',size=26,anchor='middle')=>N.chalkText(g,x,y,String(s),{role,size,anchor});
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw Error('F11-11 unexpected event '+key);N.events.emit('value',{engine:ID,key,value})};
const btn=(s,f,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text:s,onclick:f});
function angleAt(a,o,b){let u=p(a.x-o.x,a.y-o.y),v=p(b.x-o.x,b.y-o.y);return deg(Math.acos(clamp((u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y)),-1,1)))}
function ang(pt,o){return deg(Math.atan2(pt.y-o.y,pt.x-o.x))}
// Screen-coordinate angular arcs: specified arc is always the shorter sweep unless explicit clockwise is supplied.
function arc(g,o,r,a,b,role='focus',w=4,clockwise=null){let diff=((b-a)%360+360)%360,cw=clockwise===null?diff<=180:clockwise;
 let travel=cw?diff:360-diff;if(travel<.001)return;
 let s=add(o,vec(a,r)),e=add(o,vec(b,r));return path(g,`M${s.x.toFixed(3)} ${s.y.toFixed(3)} A${r} ${r} 0 ${travel>180?1:0} ${cw?1:0} ${e.x.toFixed(3)} ${e.y.toFixed(3)}`,role,w)}
function shortestArc(g,o,r,a,b,role='focus',w=4){let d=((b-a)%360+360)%360;if(d<=180)return arc(g,o,r,a,b,role,w,true);return arc(g,o,r,a,b,role,w,false)}
function interior(g,O,P,Q,r,name,color='result',hide=false){let a=ang(P,O),b=ang(Q,O);shortestArc(g,O,r,a,b,color,4);let diff=((b-a)%360+360)%360,mid=a+(diff<=180?diff/2:-(360-diff)/2),loc=add(O,vec(mid,r+28));chalk(g,loc.x,loc.y+7,hide?'?':name,color,24)}
function tangent(a,o,b){return p((a.x-o.x)/Math.hypot(a.x-o.x,a.y-o.y)+(b.x-o.x)/Math.hypot(b.x-o.x,b.y-o.y),(a.y-o.y)/Math.hypot(a.x-o.x,a.y-o.y)+(b.y-o.y)/Math.hypot(b.x-o.x,b.y-o.y))}
function triangleWithBase(Adeg,Bdeg){let A=p(225,380),B=p(540,380),h=(B.x-A.x)/(1/Math.tan(rad(Adeg))+1/Math.tan(rad(Bdeg))),C=p(A.x+h/Math.tan(rad(Adeg)),A.y-h);return {A,B,C,a:angleAt(B,A,C),b:angleAt(A,B,C),c:angleAt(A,C,B)}}
function model(st){let k=st.kind||'line',a=clamp(+st.angle||65,25,125),n=clamp(Math.round(+st.sides||6),3,12),rotation=((+st.rotation||0)%360+360)%360;
 if(k==='line')return {kind:k,a,b:180-a,O:p(365,286)};
 if(k==='point')return {kind:k,a,parts:[a,75,110,175-a],O:p(365,270)};
 if(k==='opposite')return{kind:k,a,b:180-a,O:p(365,276)};
 if(k==='parallel')return{kind:k,a,b:180-a,T:p(258,185),B:p(258+182/Math.tan(rad(a)),367)};
 if(k==='triangle')return{kind:k,...triangleWithBase(a,65)};
 if(k==='isosceles')return{kind:k,...triangleWithBase(a,a)};
 if(k==='polygon'){let O=p(378,274),R=171,pts=Array.from({length:n},(_,i)=>add(O,vec(-90+rotation+i*360/n,R)));return{kind:k,n,rotation,O,pts,central:360/n,interior:180-360/n,exterior:360/n,sum:(n-2)*180}};
 throw Error('Unknown geometry '+k)}
function assertMath(st){let m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("assertMath.m",(...a)=>model(...a),[st]):(model(st)));if(m.kind==='triangle'||m.kind==='isosceles'){if(Math.abs(m.a+m.b+m.c-180)>1e-7)throw Error('Triangle sum wrong')}if(m.kind==='point'&&Math.abs(m.parts.reduce((x,y)=>x+y,0)-360)>1e-7)throw Error('Full turn wrong');return m}
function proofRows(m){switch(m.kind){
 case'line':return ['Given an angle of '+Math.round(m.a)+'°','Adjacent angles on a straight line total 180°',`${Math.round(m.a)}° + x = 180°`,`x = ${Math.round(m.b)}°`];
 case'point':return ['Angles meet at one point','One complete turn is 360°','Add the known sectors and subtract from 360°',`Missing sector = ${Math.round(m.parts?.[3]??0)}°`];
 case'opposite':return [`Two straight lines intersect`,`Vertically opposite angles are equal`,`Corresponding pairs have the same angle`,`x = ${Math.round(m.a)}°`];
 case'parallel':return ['Given two parallel lines and a transversal','Alternate/corresponding angles are equal','Co-interior angles sum to 180°',`Equal angle ${Math.round(m.a)}°; partner ${Math.round(m.b)}°`];
 case'triangle':return [`Given base angles ${Math.round(m.a)}° and ${Math.round(m.b)}°`,'Interior angles of a triangle total 180°',`${Math.round(m.a)}° + ${Math.round(m.b)}° + x = 180°`,`x = ${Math.round(m.c)}°`];
 case'isosceles':return ['Two equal sides give two equal base angles','Base angles are equal in an isosceles triangle',`2 × ${Math.round(m.a)}° + x = 180°`,`x = ${Math.round(m.c)}°`];
 case'polygon':return [`A regular polygon has ${m.n} sides`,'The exterior angles total 360°',`Exterior = 360° ÷ ${m.n}; interior = 180° − exterior`,`Interior = ${Math.round(m.interior*100)/100}°`];}}
function headInfo(m,opts){let ready=(opts.phase>=6&&!opts.hide),proof=!!opts.proof,rows=proofRows(m);
 const data={line:['STRAIGHT LINE','SUPPLEMENTARY',`${Math.round(m.b)}°`,'Adjacent angles total 180°'],point:['FULL TURN','AROUND A POINT',`${Math.round(m.parts?.[3]??0)}°`,'Angles at a point total 360°'],opposite:['INTERSECTING LINES','OPPOSITE ANGLES',`${Math.round(m.a)}°`,'Vertically opposite angles are equal'],parallel:['PARALLEL LINES','MATCHING PAIRS',`${Math.round(m.a)}°`,'Corresponding and alternate angles are equal'],triangle:['TRIANGLE','THIRD ANGLE',`${Math.round(m.c)}°`,'Angles inside a triangle total 180°'],isosceles:['ISOSCELES TRIANGLE','APEX ANGLE',`${Math.round(m.c)}°`,'Equal sides give equal opposite base angles'],polygon:['REGULAR POLYGON','INTERIOR ANGLE',`${+(m.interior??0).toFixed(3)}°`,'Exterior angles total 360°']}[m.kind];
 return{cards:[['GEOMETRIC FIGURE',data[0],data[3]],['WHY IT WORKS',proof?'REASON → RESULT':data[1],ready?rows[1]:'Look for a known angle fact.'],['UNKNOWN ANGLE',ready?data[2]:'?',ready?rows[3]:'Solve before revealing the angle.']],rows};}
function stageShell(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("stageShell",arguments);}
stage.replaceChildren();let sec=H('section',{class:'f111-theatre','data-testid':'f111-stage'}),top=H('div',{class:'f111-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f111-tag',text:'NOVA · NEON CHALK'})]);sec.append(top);
 let layout=H('div',{class:'f111-layout'}),plane=H('div',{class:'f111-plane'}),svg=N.svg.root(730,500,'Angle-chase geometry: exact angle constructions, highlighted sectors and interactive angle facts');svg.classList.add('nv-svg','f111-svg');svg.dataset.testid='f111-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','98 5 550 490');plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return{sec,layout,plane,svg}}
function drawGeometry(svg,opts){const m=assertMath(opts),ph=opts.phase??6,complete=ph>=6&&!opts.hide,edit=!!opts.editable;
 svg.querySelector('[data-testid=f111-geometry]')?.remove();let g=E('g',{'data-testid':'f111-geometry',style:'pointer-events:none'},svg);let handle=svg.querySelector('[data-testid=f111-angle-handle]');if(handle)svg.insertBefore(g,handle);
 const createRay=(o,a,l=175,role='given',width=5)=>{let q=add(o,vec(a,l));line(g,o,q,role,width);return q};
 let hit=null;let labelState=opts.hide;let stagePart=opts.target||'primary';
 if(m.kind==='line'){
  let O=m.O,R=createRay(O,0,220,'given'),L=createRay(O,180,220,'given'),Q=add(O,vec(360-m.a,190));
  if(ph>=1){ring(g,O,12,'result');chalk(g,L.x-10,L.y+33,'A');chalk(g,R.x+10,R.y+33,'C');}
  if(ph>=2){line(g,O,Q,'op',6);ring(g,Q,10,'result');hit=Q}
  if(ph>=3){arc(g,O,71,360-m.a,360,'op',5,true);let where=add(O,vec(360-m.a/2,119));chalk(g,where.x,where.y+6,`${Math.round(m.a)}°`,'op',27)}
  if(ph>=4){arc(g,O,83,180,360-m.a,'result',5,true);let where=add(O,vec(270-m.a/2,120));chalk(g,where.x,where.y+8,complete?`${Math.round(m.b)}°`:'x','result',26)}
  if(ph>=5){chalk(g,365,452,complete?`${Math.round(m.a)}° + ${Math.round(m.b)}° = 180°`:'Adjacent angles = 180°','focus',29)}
 }else if(m.kind==='point'){
  let O=m.O,a0=0;ring(g,O,12,'result');for(let j=0;j<4;j++){let a1=a0+m.parts[j];if(ph>=1)createRay(O,a0,184,j===3?'op':'given',4);if(ph>=2+j){arc(g,O,51+j*10,a0,a1,j===3?'result':j===0?'op':'focus',4,true);let mid=(a0+a1)/2,pos=add(O,vec(mid,106));chalk(g,pos.x,pos.y+8,j===3?(complete?`${Math.round(m.parts[j])}°`:'x'):`${Math.round(m.parts[j])}°`,j===3?'result':'given',24)}a0=a1}
  hit=add(O,vec(m.a,184));
  if(ph>=5)chalk(g,372,484,complete?'FOUR ANGLES = 360°':'One full turn = 360°','focus',27)
 }else if(m.kind==='opposite'){
  let O=m.O,U=add(O,vec(-m.a,200)),D=add(O,vec(180-m.a,200));
  if(ph>=1){createRay(O,0,218,'given');createRay(O,180,218,'given');}
  if(ph>=2){line(g,D,U,'op',5);ring(g,O,9);ring(g,U,8,'op');hit=U;}
  if(ph>=3){arc(g,O,66,360-m.a,360,'focus',4,true);arc(g,O,66,180-m.a,180,'focus',4,true);chalk(g,O.x+110,O.y-37,`${Math.round(m.a)}°`,'op',27);chalk(g,O.x-97,O.y+48,complete?`${Math.round(m.a)}°`:'x','result',27)}
  if(ph>=4){arc(g,O,88,180,360-m.a,'result',4,true);arc(g,O,88,0,180-m.a,'result',4,true)}
  if(ph>=5)chalk(g,360,457,complete?'OPPOSITE ANGLES ARE EQUAL':'Opposite angles = equal','focus',25);
 }else if(m.kind==='parallel'){
  let {T,B}=m,u=p(Math.cos(rad(m.a)),Math.sin(rad(m.a))),lt=p(u.x*143,u.y*143),top1=p(110,T.y),top2=p(615,T.y),bot1=p(110,B.y),bot2=p(615,B.y);
  if(ph>=1){line(g,top1,top2,'given',5);line(g,bot1,bot2,'given',5);chalk(g,119,T.y-16,'ℓ₁','given',23);chalk(g,119,B.y+30,'ℓ₂','given',23)}
  if(ph>=2){let X=add(T,p(-lt.x,-lt.y)),Y=add(B,lt);line(g,X,Y,'op',5);ring(g,T,10,'result');ring(g,B,10,'result');hit=add(B,p(u.x*82,u.y*82))}
  if(ph>=3){arc(g,T,58,0,m.a,'op',5,true);let q=add(T,vec(m.a/2,92));chalk(g,q.x,q.y+10,`${Math.round(m.a)}°`,'op',24)}
  if(ph>=4){arc(g,B,61,0,m.a,'result',4,true);arc(g,B,88,180,180+m.a,'focus',4,true);let q=add(B,vec(m.a/2,111));chalk(g,q.x,q.y+7,complete?`${Math.round(m.a)}°`:'x','result',24)}
  if(ph>=5){arc(g,B,114,180+m.a,360,'focus',3,true);chalk(g,420,486,complete?`CO-INTERIOR ${Math.round(m.a)}° + ${Math.round(m.b)}° = 180°`:'Same-side interior angles = 180°','focus',23)}
 }else if(m.kind==='triangle'||m.kind==='isosceles'){
  let {A,B,C}=m;if(ph>=1){line(g,A,B,'given',5);line(g,B,C,'op',5);line(g,C,A,'op',5);ring(g,A,9);ring(g,B,9);ring(g,C,9);chalk(g,A.x-22,A.y+32,'A');chalk(g,B.x+20,B.y+32,'B');chalk(g,C.x,C.y-22,'C')}
  if(ph>=2)interior(g,A,B,C,53,`${Math.round(m.a)}°`,'focus');
  if(ph>=3)interior(g,B,A,C,55,`${Math.round(m.b)}°`,'op');
  if(ph>=4)interior(g,C,A,B,69,`${Math.round(m.c)}°`,'result',!complete);
  if(ph>=5){if(m.kind==='isosceles'){let mid=p((A.x+B.x)/2,(A.y+B.y)/2);path(g,`M${mid.x} ${mid.y-7}l-5 -5m5 5l5 -5`,'result',3)}chalk(g,380,477,complete?`${Math.round(m.a)}° + ${Math.round(m.b)}° + ${Math.round(m.c)}° = 180°`:'Three interior angles = 180°','focus',25)}
  hit=C;
 }else if(m.kind==='polygon'){
  let {O,pts,n}=m;
  if(ph>=1){for(let i=0;i<n;i++)line(g,pts[i],pts[(i+1)%n],'given',4);pts.forEach((v,i)=>ring(g,v,i===0?9:5,i===0?'result':'given'))}
  if(ph>=2){let P=pts[0];line(g,O,P,'op',4);line(g,O,pts[1],'op',4);ring(g,O,9);shortestArc(g,O,70,ang(P,O),ang(pts[1],O),'focus',5);chalk(g,O.x+81,O.y-15,complete?`${+m.central.toFixed(3)}°`:'?','focus',25)}
  if(ph>=3){let P=pts[0],prev=pts[n-1],next=pts[1];interior(g,P,prev,next,49,`${+(m.interior??0).toFixed(3)}°`,'result',!complete)}
  if(ph>=4){let P=pts[0],prev=pts[n-1],next=pts[1],v=p(P.x-prev.x,P.y-prev.y),ext=add(P,p(v.x/Math.hypot(v.x,v.y)*80,v.y/Math.hypot(v.x,v.y)*80));line(g,P,ext,'focus',4);chalk(g,510,180,complete?`EXTERIOR ${+m.exterior.toFixed(3)}°`:'Exterior = 360° ÷ n','focus',23)}
  if(ph>=5)chalk(g,370,486,complete?`SUM ${m.sum}° · ${n-2} TRIANGLES`:'Interior sum = (n − 2) × 180°','result',23);
  hit=pts[0];
 }
 if(edit&&hit){let h=svg.querySelector('[data-testid=f111-angle-handle]');if(!h)h=E('circle',{r:32,fill:'transparent',stroke:'transparent',role:'slider',tabindex:0,class:'f111-handle','data-testid':'f111-angle-handle',style:'touch-action:none;pointer-events:all'},svg);h.setAttribute('cx',hit.x);h.setAttribute('cy',hit.y);h.setAttribute('aria-label',m.kind==='polygon'?'Rotate the regular polygon using the gold handle. The side count is changed by the side count control':'Drag to change the displayed angle; use arrow keys for precise adjustments');h.setAttribute('aria-valuenow',m.kind==='polygon'?m.rotation:Math.round(m.a));h.setAttribute('aria-valuemin',m.kind==='polygon'?0:25);h.setAttribute('aria-valuemax',m.kind==='polygon'?355:m.kind==='point'?110:125);ring(g,hit,13,'result');}
 else svg.querySelector('[data-testid=f111-angle-handle]')?.remove();
 return m;
}
function card(label,value,desc){return H('section',{class:'f111-card'},[H('div',{class:'f111-eyebrow',text:label}),H('div',{class:'f111-main',text:value}),H('p',{class:'f111-sub',text:desc})])}
function draw(stage,opts={}){
if(window.NovaLessonComponent?.active){[stage,opts]=window.NovaLessonComponent.args("draw",arguments);}
const box=stageShell(stage),aside=H('aside',{class:'f111-aside','data-testid':'f111-aside'}),cards=[];for(let i=0;i<3;i++){let c=card('','','');cards.push(c);aside.append(c)}box.layout.append(aside);
 let proof=H('div',{class:'f111-proofline',role:'status','data-testid':'f111-proofline'});box.sec.append(proof);
 function repaint(o={}){Object.assign(opts,o);let m=drawGeometry(box.svg,opts),data=headInfo(m,opts);data.cards.forEach((d,i)=>{cards[i].querySelector('.f111-eyebrow').textContent=d[0];cards[i].querySelector('.f111-main').textContent=d[1];cards[i].querySelector('.f111-sub').textContent=d[2]});let steps=opts.proof?Math.min(4,Math.max(1,(opts.phase||1)-1)):0;
 proof.style.display=opts.proof&&!opts.hide?'block':'none';if(steps){proof.replaceChildren();proof.append(H('strong',{text:`PROOF · ${steps}/4` }));const names=['GIVEN','ANGLE FACT','CALCULATION','CONCLUSION'];for(let k=0;k<steps;k++){proof.append(H('div',{class:'f111-proofrow'},[H('b',{text:`${k+1}. ${names[k]}  ·  `}),document.createTextNode(data.rows[k])]));}}return m}
 repaint();N.scene.helperStrip(box.sec,opts.pose||'explain',opts.caption||'Find the known angle, name the fact and explain the result.');return{...box,repaint};}
const STEPS=[
 {kind:'line',phase:1,name:'See the straight line',pose:'explain',narration:'A straight line is a half turn. The entire angle is one hundred and eighty degrees.'},
 {kind:'line',phase:2,name:'Add another ray',pose:'point-down',narration:'The extra ray splits the half turn into two adjacent angles.'},
 {kind:'line',phase:3,name:'Label what we know',pose:'count',narration:'Measure the known angle first and keep that label next to the matching arc.'},
 {kind:'line',phase:4,name:'Find the unknown',pose:'think',narration:'The second sector occupies what remains of the one hundred and eighty degree straight angle.'},
 {kind:'line',phase:6,name:'Justify the subtraction',pose:'idea',narration:'Subtract the known angle from one hundred and eighty, then state the straight-line rule.'},
 {kind:'point',phase:1,name:'Look around a point',pose:'show-one',narration:'A full turn travels all the way around the central point.'},
 {kind:'point',phase:3,name:'Separate known sectors',pose:'compare',narration:'Different coloured angle sectors meet at the same point without overlapping.'},
 {kind:'point',phase:5,name:'Find the missing sector',pose:'question',narration:'Add the known sectors and find the gap left by a complete turn.'},
 {kind:'point',phase:6,name:'Make the total 360°',pose:'celebrate',narration:'All angles around one point sum to three hundred and sixty degrees.'},
 {kind:'opposite',phase:1,name:'Begin with a line',pose:'ruler',narration:'Start with one straight line passing through the vertex.'},
 {kind:'opposite',phase:2,name:'Intersect it',pose:'show-two',narration:'A second straight line creates four angles at one intersection.'},
 {kind:'opposite',phase:3,name:'Match opposite sectors',pose:'compare',narration:'The opposite angles are equal, even when one side of the diagram is rotated.'},
 {kind:'opposite',phase:6,name:'Name the angle fact',pose:'idea',narration:'Vertically opposite angles are equal. Neighbouring angles form a straight line.'},
 {kind:'parallel',phase:1,name:'Spot parallel lines',pose:'ruler',narration:'Two lines remain parallel: they never meet.'},
 {kind:'parallel',phase:2,name:'Draw a transversal',pose:'point-right',narration:'The transversal crosses both parallel lines, creating eight angles.'},
 {kind:'parallel',phase:3,name:'Identify the first angle',pose:'count',narration:'Start from a known sector at the upper intersection.'},
 {kind:'parallel',phase:4,name:'Track a matching sector',pose:'compare',narration:'Corresponding angles and alternate interior angles are equal.'},
 {kind:'parallel',phase:6,name:'Complete the angle chain',pose:'idea',narration:'Co-interior angles sum to one hundred and eighty degrees. Give the fact for every step.'},
 {kind:'triangle',phase:1,name:'Recognise the triangle',pose:'show-three',narration:'A triangle has three interior angles, one at each corner.'},
 {kind:'triangle',phase:2,name:'First given angle',pose:'point-left',narration:'Mark the first given base angle clearly.'},
 {kind:'triangle',phase:3,name:'Second given angle',pose:'point-right',narration:'Mark the second angle. Now both known values are visible.'},
 {kind:'triangle',phase:4,name:'Find the missing apex',pose:'think',narration:'The remaining angle completes the triangle total of one hundred and eighty degrees.'},
 {kind:'triangle',phase:6,name:'Write a full explanation',pose:'idea',narration:'Add the two known angles, subtract from one hundred and eighty, and state the triangle angle-sum fact.'},
 {kind:'isosceles',phase:6,name:'Equal sides imply equal angles',pose:'compare',narration:'An isosceles triangle has two equal base angles. Use that fact before finding the apex.'},
 {kind:'polygon',sides:6,phase:1,name:'Draw a regular polygon',pose:'ruler',narration:'Equal side lengths and equal corner angles define a regular polygon.'},
 {kind:'polygon',sides:6,phase:2,name:'Find the central angle',pose:'count',narration:'Equal central angles fill a full turn: three hundred and sixty divided by the number of sides.'},
 {kind:'polygon',sides:6,phase:3,name:'Compare interior and exterior',pose:'compare',narration:'An interior angle and the adjacent exterior turn add to a straight angle.'},
 {kind:'polygon',sides:6,phase:6,name:'Generalise the polygon rule',pose:'idea',narration:'Interior angle sum equals the number of sides minus two, multiplied by one hundred and eighty degrees.'},
 {kind:'parallel',angle:58,proof:true,phase:2,name:'Formal proof — give the facts',pose:'ruler',narration:'A geometric proof starts with given facts and an accurate diagram.'},
 {kind:'parallel',angle:58,proof:true,phase:3,name:'Formal proof — select a reason',pose:'think',narration:'Choose a proven angle fact rather than guessing a number.'},
 {kind:'parallel',angle:58,proof:true,phase:4,name:'Formal proof — calculate',pose:'count',narration:'Use the rule to calculate and show one logical step at a time.'},
 {kind:'parallel',angle:58,proof:true,phase:6,name:'Formal proof — conclude',pose:'celebrate',narration:'End your argument with the result and the reason that makes it true.'}
];
function render(i,stage){let s=STEPS[i]||STEPS[0];draw(stage,{...DEF,...s,caption:s.narration})}
function svgPt(svg,e){let pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;let m=svg.getScreenCTM();return m?pt.matrixTransform(m.inverse()):pt}
function dragHandle(h,svg,get,project,set){h.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||N.ui._drag)return;e.preventDefault();let id=e.pointerId,start=get(),active=true,raf=0,pending=null;
 const drag={cancel:()=>finish(true),captured:true,moved:true};N.ui._drag=drag;
 function frame(){raf=0;if(pending!==null){let next=pending;pending=null;set(next,true)}}
 function move(ev){if(!active||ev.pointerId!==id)return;ev.preventDefault();pending=project(svgPt(svg,ev));if(!raf)raf=requestAnimationFrame(frame)}
 function finish(cancel,ev){if(!active)return;let value=cancel?start:ev?project(svgPt(svg,ev)):pending??get();active=false;cancelAnimationFrame(raf);pending=null;h.removeEventListener('pointermove',move);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',abort);h.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',abort);try{h.releasePointerCapture(id)}catch(_){}if(N.ui._drag===drag)N.ui._drag=null;set(value,false)}
 function up(ev){if(ev.pointerId===id)finish(false,ev)}function abort(){finish(true)}function lost(){if(active)finish(true)}function key(e){if(e.key==='Escape'){e.preventDefault();finish(true)}}
 h.addEventListener('pointermove',move);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',abort);h.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',abort);try{h.setPointerCapture(id)}catch(_){finish(true)} });
 h.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();let lo=+h.getAttribute('aria-valuemin'),hi=+h.getAttribute('aria-valuemax');set(clamp(get()+(['ArrowUp','ArrowRight'].includes(e.key)?5:-5),lo,hi),false)})}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f111-tools');window.NovaLessonComponent?.applyExploreModels();let st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",()=>({...DEF})):({...DEF})),box;
 window.NovaLessonComponent?.applyExploreModels();const preset=H('select',{class:'nova-input f111-preset-select','data-testid':'f111-preset','aria-label':'Choose an angle-chase preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([k,v])=>preset.append(H('option',{value:k,text:v.label})));window.NovaLessonComponent?.applyExploreModels();preset.value=DEF.preset;
 window.NovaLessonComponent?.applyExploreModels();const kind=H('select',{class:'nova-input','data-testid':'f111-kind','aria-label':'Choose angle relationship'});window.NovaLessonComponent?.applyExploreModels();for(const [k,v]of Object.entries({line:'Angles on a straight line',point:'Around a point',opposite:'Vertically opposite angles',parallel:'Parallel lines and transversal',triangle:'Triangle angle sum',isosceles:'Equal base angles',polygon:'Regular polygon angle chase'}))kind.append(H('option',{value:k,text:v}));
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('label',{class:'f111-wide'},['Curriculum preset',preset]),H('label',{class:'f111-wide'},['Geometry construction',kind]));
 window.NovaLessonComponent?.applyExploreModels();function range(key,title,min,max,step){let input=H('input',{type:'range',min:String(min),max:String(max),step:String(step),value:String(st[key]),'data-testid':'f111-'+key}),out=H('span',{class:'f111-value',text:String(st[key])});let row=H('label',{class:'f111-control'},[title,H('div',{class:'f111-explorebar'},[input,out])]);panel.append(row);return{row,input,out}}
 window.NovaLessonComponent?.applyExploreModels();const angle=range('angle','Rotate geometric ray / base angle',25,125,5),sides=range('sides','Number of polygon sides',3,12,1),rotation=range('rotation','Rotate regular polygon',0,355,5),phase=range('phase','Proof and diagram reveal',1,6,1);
 window.NovaLessonComponent?.applyExploreModels();const proofToggle=H('input',{type:'checkbox','data-testid':'f111-proof'});window.NovaLessonComponent?.applyExploreModels();panel.append(H('label',{class:'f111-wide'},[proofToggle,' Show formal proof steps (F11-13)']));
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f111-explain f111-wide',text:'Drag a gold angle handle to change the geometry live. Arrows adjust by five degrees (or one polygon side). Escape restores the starting shape. The full proof is revealed in order.'}));
 window.NovaLessonComponent?.applyExploreModels();const actions=H('div',{class:'f111-actions f111-wide'});window.NovaLessonComponent?.applyExploreModels();panel.append(actions);
 window.NovaLessonComponent?.applyExploreModels();function update(){kind.value=st.kind;angle.row.style.display=st.kind==='polygon'?'none':'grid';sides.row.style.display=st.kind==='polygon'?'grid':'none';rotation.row.style.display=st.kind==='polygon'?'grid':'none';for(const [key,f]of Object.entries({angle,sides,rotation,phase})){f.input.value=String(st[key]);f.out.textContent=String(st[key])+(key==='angle'?'°':'')}angle.input.max=st.kind==='point'?'110':st.kind==='triangle'?'75':st.kind==='isosceles'?'75':st.kind==='parallel'?'75':'125';angle.input.min=st.kind==='parallel'?'35':st.kind==='triangle'?'35':st.kind==='isosceles'?'30':'25';proofToggle.checked=!!st.proof}
 window.NovaLessonComponent?.applyExploreModels();function paint(){update();let opt={...st,editable:true,hide:false,caption:st.proof?'Justify each line of the proof before writing the conclusion.':'Follow the highlighted angle sectors and explain the matching angle rule.'};if(!box)box=draw(stage,opt);else box.repaint(opt);
 let h=box.svg.querySelector('[data-testid=f111-angle-handle]');if(h&&!h.dataset.bound){h.dataset.bound='yes';let get=()=>st.kind==='polygon'?st.rotation:st.angle,project=at=>{if(st.kind==='polygon'){let mm=model(st),r=(deg(Math.atan2(at.y-mm.O.y,at.x-mm.O.x))+90+360)%360;return (Math.round(r/5)*5)%360}let mm=model(st),o=mm.O||mm.T||mm.C||p(385,280);if(mm.kind==='triangle'||mm.kind==='isosceles'){let y=clamp(at.y,110,285);return clamp(Math.round(deg(Math.atan2(380-y,at.x-225))/5)*5,+h.getAttribute('aria-valuemin'),+h.getAttribute('aria-valuemax'))}let raw=((deg(Math.atan2(o.y-at.y,at.x-o.x))%360)+360)%360;if(raw>180)raw=360-raw;return clamp(Math.round(raw/5)*5,+h.getAttribute('aria-valuemin'),+h.getAttribute('aria-valuemax'))};
 let set=(v)=>{let key=st.kind==='polygon'?'rotation':'angle';st[key]=v;emit(key,v);box.repaint({...st,editable:true,hide:false});update()};dragHandle(h,box.svg,get,project,set)} }
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{let v=CFG.presets[preset.value];Object.assign(st,{...DEF,...v,preset:preset.value,phase:6});emit('preset',st.preset);paint()};
 window.NovaLessonComponent?.applyExploreModels();kind.onchange=()=>{st.kind=kind.value;st.phase=6;let limits={parallel:[35,75],triangle:[35,75],isosceles:[30,75],point:[25,110],line:[25,125],opposite:[25,125],polygon:[25,125]}[st.kind];st.angle=clamp(st.angle,...limits);emit('kind',st.kind);paint()};
 window.NovaLessonComponent?.applyExploreModels();for(const [k,f]of Object.entries({angle,sides,rotation,phase}))f.input.oninput=()=>{st[k]=+f.input.value;emit(k,st[k]);paint()};
 window.NovaLessonComponent?.applyExploreModels();proofToggle.onchange=()=>{st.proof=proofToggle.checked;emit('proof',st.proof);paint()};
 window.NovaLessonComponent?.applyExploreModels();actions.append(btn('Show complete reasoning',()=>{st.phase=6;emit('phase',6);paint()},'nova-btn primary'),btn('Restart proof',()=>{st.phase=1;emit('phase',1);paint()}),btn('Restore defaults',()=>{Object.assign(st,DEF);preset.value=st.preset;emit('reset',st.preset);paint()}));window.NovaLessonComponent?.applyExploreModels();paint();}
const REASONS={straight:'Angles on a straight line add to 180°.',point:'Angles around a point add to 360°.',opposite:'Vertically opposite angles are equal.',alternate:'Alternate interior angles on parallel lines are equal.',corresponding:'Corresponding angles on parallel lines are equal.',cointerior:'Co-interior angles on parallel lines add to 180°.',triangle:'The three interior angles of a triangle add to 180°.',isosceles:'The base angles of an isosceles triangle are equal.',polygon:'The interior angle sum is (n − 2) × 180°.',exterior:'Exterior angles of a polygon add to 360°.'};
const TASKS=[
 {preset:'y7_line',answer:115,reason:'straight',q:'The marked angle is 65°. What is the neighbouring angle on the straight line?',hint:'Subtract from one hundred and eighty.',wrong:'Adjacent angles on a straight line must total 180°.'},
 {preset:'y7_point',answer:105,reason:'point',q:'Around a point the known angles are 70°, 75° and 110°. Find the missing angle.',hint:'Take the sum of the given angles away from a full 360° turn.',wrong:'The complete turn is 360°, not 180°.'},
 {preset:'y7_opposite',answer:73,reason:'opposite',q:'Two lines cross. One angle is 73°. Find its vertically opposite angle.',hint:'Opposite sectors match without subtracting.',wrong:'Vertically opposite angles are equal, not supplementary.'},
 {preset:'y7_parallel',answer:62,reason:'alternate',q:'Parallel lines are cut by a transversal. If one alternate interior angle is 62°, find its partner.',hint:'Find the Z-shaped pair.',wrong:'Alternate interior angles on parallel lines are equal.'},
 {preset:'y9_parallel',answer:122,reason:'cointerior',q:'Parallel lines have a co-interior angle of 58°. Find the other co-interior angle.',hint:'They are supplementary.',wrong:'Co-interior angles must sum to 180°.'},
 {preset:'y7_triangle',answer:60,reason:'triangle',q:'Triangle base angles are 55° and 65°. Calculate the apex angle.',hint:'Use the sum of three interior angles.',wrong:'Add the two given angles, then subtract from 180°.'},
 {preset:'y8_congruence',answer:84,reason:'isosceles',q:'An isosceles triangle has equal base angles of 48°. Calculate the apex.',hint:'Both base angles are equal; subtract twice 48° from 180°.',wrong:'Count both equal base angles before subtracting.'},
 {preset:'y8_polygon',answer:120,reason:'exterior',q:'A regular hexagon has equal exterior turns. What is one interior angle?',hint:'Exterior = 360° ÷ 6; interior and exterior add to 180°.',wrong:'A regular hexagon has exterior 60°, so its interior is supplementary.'},
 {preset:'y9_polygon',answer:1080,reason:'polygon',q:'Write the total interior angle sum for a regular octagon.',hint:'Divide the octagon into n − 2 triangles.',wrong:'Use six triangles, each with 180°.'},
 {preset:'y9_proof',answer:60,reason:'triangle',q:'Formal proof: given 55° and 65° at the base of a triangle, prove the third angle.',hint:'Start with the angle-sum fact, substitute both values, then conclude.',wrong:'A proof needs a valid triangle angle-sum calculation.'}
];
function dragReason(el,target,onDrop){el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||N.ui._drag)return;let id=e.pointerId,x=e.clientX,y=e.clientY,ghost=null;
 const drag={cancel:clear,moved:true,captured:true};N.ui._drag=drag;
 function move(ev){if(ev.pointerId!==id)return;if(!ghost&&Math.hypot(ev.clientX-x,ev.clientY-y)>7){ghost=H('div',{class:'f111-ghost',text:el.textContent});document.body.append(ghost)}if(ghost){ghost.style.left=ev.clientX+12+'px';ghost.style.top=ev.clientY+12+'px';let r=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)}}
 function clear(){el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',abort);window.removeEventListener('blur',abort);window.removeEventListener('keydown',key);target.dataset.hover='false';ghost?.remove();try{el.releasePointerCapture(id)}catch(_){}if(N.ui._drag===drag)N.ui._drag=null}
 function up(ev){if(ev.pointerId!==id)return;let r=target.getBoundingClientRect(),hit=ghost&&ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;clear();if(hit)onDrop()}
 function abort(){clear()}function key(e){if(e.key==='Escape'){e.preventDefault();clear()}}
 el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',abort);window.addEventListener('blur',abort);window.addEventListener('keydown',key);try{el.setPointerCapture(id)}catch(_){clear()}})}
function challenge(panel,api,stage){panel.classList.add('f111-tools');let idx=0;
 function show(){let t=TASKS[idx],s=CFG.presets[t.preset],m=model({...DEF,...s});panel.replaceChildren();panel.append(H('div',{class:'pr-task f111-wide',text:`CHALLENGE ${idx+1} / ${TASKS.length}${s.proof?' · F11-13 FORMAL PROOF':''}`}),H('p',{class:'f111-explain f111-wide',text:t.q}));
 let input=H('input',{class:'nova-input',type:'number',step:'any',placeholder:'Unknown angle / total in degrees','data-testid':'f111-answer'});panel.append(H('label',{class:'f111-wide'},['YOUR NUMERICAL ANSWER · DEGREES',input]));
 let choices=H('div',{class:'f111-reasons f111-wide'}),drop=H('div',{class:'f111-drop f111-wide','data-testid':'f111-reason-drop',text:'Choose or drag the mathematical reason here'}),selected=null;
 const reasons=Object.keys(REASONS);function choose(key){selected=key;drop.textContent=REASONS[key];drop.dataset.set='true';emit('reason',key);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===key)))}
 for(const key of reasons){let b=H('button',{type:'button',class:'f111-reason','data-reason':key,'aria-pressed':'false',text:REASONS[key],onclick:()=>choose(key)});dragReason(b,drop,()=>choose(key));choices.append(b)}panel.append(choices,drop);
 const actions=H('div',{class:'f111-actions f111-wide'}),feedback=H('p',{class:'f111-wide f111-complete','aria-live':'polite'});panel.append(actions,feedback);
 const opts={...DEF,...s,phase:6,hide:true,proof:!!s.proof,pose:'think',caption:'Use the given diagram and justify each step before checking.'};draw(stage,opts);
 let check=btn('Check answer + reason',()=>{let v=Number(input.value),err='';if(!input.value.trim()||!Number.isFinite(v))err='Enter a numerical answer.';else if(Math.abs(v-t.answer)>1e-7)err=t.wrong;else if(selected!==t.reason)err='The numerical value is right but that reason does not justify the step.';
 if(err){api.check(false,err,{task:idx+1});feedback.textContent=err;return}
 api.check(true,`${t.answer}°. ${REASONS[t.reason]}`,{task:idx+1,answer:v,reason:selected});emit('answer',{task:idx+1,answer:v,reason:selected});draw(stage,{...opts,hide:false,pose:'celebrate',caption:'Correct angle and valid justification. Now explain the next stage.'});feedback.textContent=`Correct · ${t.answer}° · ${REASONS[t.reason]}`;actions.replaceChildren();if(idx===TASKS.length-1)actions.append(H('strong',{class:'f111-complete',text:`${TASKS.length} / ${TASKS.length} · ANGLE CHASE MASTERY`}));else actions.append(btn('Next challenge →',()=>{idx++;emit('task',idx+1);show()},'nova-btn primary'));},'nova-btn primary');
 actions.append(check,btn('Hint',()=>api.hint(t.hint)));input.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()});}
 show();}
const def={id:ID,title:'Angle Chase',config:CFG,steps:STEPS,render,explore,challenge,alt:'Angle chase geometry and step-by-step proof: angles on lines, at points, parallel-line transversals, triangles and polygons.',staticAlt:'Use an established angle fact, carry out an exact calculation, and justify the unknown angle. Straight line: 180 degrees. Point: 360 degrees. Triangle: 180 degrees.',exploreIntro:'Choose a type of geometry, drag the gold handle and follow each angle relation. Formal proof is included as the F11-13 preset.',onRestore:()=>emit('reset',DEF.preset)};
N.registry.add({id:ID,title:'Angle Chase',family:'F11',topics:['angle chase','geometric proof','straight line','vertical angles','parallel lines','triangle angles','polygon angles'],deps:['F0-02','F0-04','F0-16','F11-03','F11-05']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"DEF":()=>DEF},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"stageShell":["stage"],"draw":["stage","opts"]},exploreFields:{"st":{"kind":"value","factory":null,"argCount":null},"assertMath.m":{"kind":"factory","factory":"model","argCount":1}}});
N.bankMount({id:ID,num:'11',title:'Angle Chase · Premium Edition',def,linked:['F11-03','F11-05','F11-07','F11-13'],years:'Year 7–9 · Angle reasoning and geometric proofs',spec:{purpose:'Use given angles and valid geometric facts to deduce unknown angles, then construct short deductive proofs.',params:'Diagram type, given angle, polygon side count, formal proof reveal phase.',presets:'Seven teaching scenes and F11-13 formal geometry proof stepper.',steps:'Named gradual drawing, highlighting, selection of facts, calculation, conclusion.',interactions:'Fast ray handle, accessible reasons/drag drop, keyboard, proof stepping and assessed angle calculations.',traps:'Confusing supplementary with equal angles, using 360° for triangles, and missing parallel-line preconditions.',gcse:'Multi-step angle chase, formal reasons and polygon angle proofs.'}});
window.__F111_MATH__={model,triangleWithBase,angleAt,assertMath,proofRows,TASKS,STEPS};
})();
