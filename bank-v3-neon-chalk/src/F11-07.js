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

/* F11-07 Regular Polygon Builder — canonical F0/F1 neon/chalk core, isolated geometry.
   Exact vertices on a circumcircle: centre angle = 360/n; each exterior angle = 360/n,
   each interior angle = 180 - 360/n. All draggable vertices remain ON the circle. */
const F117_CONFIG=Object.freeze({id:'F11-07',family:'F11',defaultPreset:'y7',presets:{
 y7:{label:'Y7-044 · Regular pentagon',n:5},
 y8:{label:'Y8-049 · Polygon angle facts',n:6},
 y9:{label:'Y9-026 · Polygon reasoning',n:8},
 triangle:{label:'Equilateral triangle',n:3},square:{label:'Square',n:4},decagon:{label:'Regular decagon',n:10}
},events:{value:['preset','sides','radius','rotation','show','reason','answer','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F117_CONFIG=F117_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F11-07',TAU=Math.PI*2,CFG=window.NovaV2Integration.configuration(F117_CONFIG);
N.premium?.enable?.();
const S={n:5,radius:188,rotation:-90,preset:'y7',show:'all'};
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw Error('Unregistered event '+key);N.events.emit('value',{engine:ID,key,value})};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const round=v=>Math.round(v*100)/100;
const num=v=>Math.abs(v-Math.round(v))<.001?String(Math.round(v)):Number(v.toFixed(2)).toString();
const deg=v=>num(v)+'°';
const shapeName=n=>({3:'TRIANGLE',4:'SQUARE',5:'PENTAGON',6:'HEXAGON',7:'HEPTAGON',8:'OCTAGON',9:'NONAGON',10:'DECAGON',11:'HENDECAGON',12:'DODECAGON'})[n]||`${n}-GON`;
const btn=(txt,fn,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text:txt,onclick:fn});
const prose=txt=>H('p',{class:'f117-explain f117-wide',text:txt});
const chalk=(g,x,y,txt,role='given',size=26,anchor='middle')=>N.chalkText(g,x,y,String(txt),{role,size,anchor});
const line=(g,x1,y1,x2,y2,role='given',width=5)=>N.neonLine(g,x1,y1,x2,y2,{role,width});
const ring=(g,x,y,r=8,role='given')=>N.neonRing(g,x,y,{r,role,pulse:false});
const point=(x,y,a,r)=>[x+r*Math.cos(a),y+r*Math.sin(a)];
const C=window.NovaV2Integration.configuration([366,257]);
function vertices(n,r,rotation){return Array.from({length:n},(_,i)=>point(...C,(rotation+i*360/n)*Math.PI/180,r))}
function calc(n){return {central:360/n,exterior:360/n,interior:180-360/n,total:180*(n-2),triangles:n-2};}
function circle(g,r,role='given',w=4){let [cx,cy]=C,d=`M ${cx-r} ${cy} A ${r} ${r} 0 1 0 ${cx+r} ${cy} A ${r} ${r} 0 1 0 ${cx-r} ${cy}`;N.neonPath(g,d,{role,width:w});}
function arc(g,origin,r,a,span,role='focus',fill=false){let end=a+span,from=point(...origin,a,r),to=point(...origin,end,r),large=span>Math.PI?1:0,d=`M ${from[0]} ${from[1]} A ${r} ${r} 0 ${large} 1 ${to[0]} ${to[1]}`;if(fill)d=`M ${origin[0]} ${origin[1]} L ${from[0]} ${from[1]} A ${r} ${r} 0 ${large} 1 ${to[0]} ${to[1]} Z`;N.neonPath(g,d,{role,width:fill?2.3:4,fill});}
function card(title,value,sub){return H('section',{class:'f117-card'},[H('div',{class:'f117-eyebrow',text:title}),H('div',{class:'f117-main',text:String(value)}),H('p',{class:'f117-sub',text:sub})]);}
function shell(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("shell",arguments);}
stage.replaceChildren();let sec=H('section',{class:'f117-theatre','data-testid':'f117-stage'});sec.append(H('div',{class:'f117-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f117-tag',text:'NOVA · NEON CHALK'})]));let layout=H('div',{class:'f117-layout'}),plane=H('div',{class:'f117-plane'}),svg=N.svg.root(730,530,'Regular polygon inscribed in a neon circle, with equal central angles and chord edges');svg.classList.add('nv-svg','f117-svg');svg.dataset.testid='f117-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','100 4 530 514');plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return{sec,layout,plane,svg};}
function geometry(svg,opt={}){
 let prior=svg.querySelector('[data-testid="f117-geometry"]');prior?.remove();let g=E('g',{'data-testid':'f117-geometry'},svg);let grip=svg.querySelector('[data-testid="f117-rotation-handle"]');if(grip)svg.insertBefore(g,grip);let n=opt.n||5,r=opt.radius||188,rotation=opt.rotation??-90,phase=opt.phase??6,view=opt.show||'all',hide=!!opt.hide,interactive=!!opt.interactive;
 let p=vertices(n,r,rotation),f=calc(n),θ=TAU/n,angle=(rotation*Math.PI/180),verts=Math.min(n,phase<=1?0:phase===2?1:phase===3?Math.min(n,3):n);
 // Layer 1: precision circumcircle, diameter axes and glow without inventing a separate primitive.
 circle(g,r,'given',4);
 if(phase>=1){line(g,C[0]-r-18,C[1],C[0]+r+18,C[1],'given',2);line(g,C[0],C[1]-r-18,C[0],C[1]+r+18,'given',2);ring(g,...C,9,'result');}
 if(phase>=2){
  if(phase>=4){let d='M '+p.map((q,i)=>(i?'L ':'')+q.map(v=>v.toFixed(3)).join(' ')).join(' ')+' Z';N.neonPath(g,d,{role:'given',width:5.5,fill:true});}
  let visibleCount=(phase===2?1:phase===3?Math.min(n,3):n);
  for(let i=0;i<visibleCount;i++){
   let a=p[i],beta=angle+i*θ;
   if(view==='all'||view==='central'||phase<=4)line(g,...C,...a,i<=1?'op':'given',i<=1?4:2.5);
   ring(g,...a,8,i===0?'result':'given');
   let label=point(...C,beta,Math.min(r+27,226));chalk(g,label[0],label[1]+7,String.fromCharCode(65+i),'given',21);
   if(i>0&&phase===3)line(g,...p[i-1],...a,'result',6);
  }
  if(phase===3&&visibleCount===n)line(g,...p[n-1],...p[0],'result',6);
 }
 // The sector really is 360/n of a full revolution.
 if(phase>=5&&(view==='all'||view==='central')){
  arc(g,C,67,angle,θ,'op',true);arc(g,C,73,angle,θ,'op');
  if(!hide){let v=point(...C,angle+θ/2,119);chalk(g,v[0],v[1]+6,deg(f.central),'op',27);}
  chalk(g,C[0],C[1]-17,'O','result',23);
 }
 if(phase>=6&&(view==='all'||view==='interior'||view==='exterior')){
  let v=p[1%n],prev=p[0],next=p[2%n],start=Math.atan2(next[1]-v[1],next[0]-v[0]),end=Math.atan2(prev[1]-v[1],prev[0]-v[0]);
  let span=(end-start+TAU)%TAU;
  // At a convex regular polygon, the smaller sector must be interior.
  if(span>Math.PI){let temp=start;start=end;end=temp;span=TAU-span;}
  if(view!=='exterior'){arc(g,v,35,start,span,'focus',true);arc(g,v,42,start,span,'focus');if(!hide){let lab=point(...v,start+span/2,69);chalk(g,lab[0],lab[1]+5,deg(f.interior),'focus',24)}}
  if(view==='exterior'||view==='all'){
   let incoming=Math.atan2(v[1]-prev[1],v[0]-prev[0]),outgoing=Math.atan2(next[1]-v[1],next[0]-v[0]),ext=(outgoing-incoming+TAU)%TAU;
   let x=point(...v,incoming,75);line(g,...v,...x,'op',3.2);arc(g,v,54,incoming,ext,'op');
   if(!hide){let label=point(...v,incoming+ext/2,94);chalk(g,label[0],label[1]+7,deg(f.exterior),'op',22);}
  }
 }
 if(phase>=7){chalk(g,C[0],45,hide?'BUILD THE POLYGON':`REGULAR ${shapeName(n)}`,'focus',29);}
 if(phase>=8&&!hide){chalk(g,C[0],487,view==='central'?`${n} × ${deg(f.central)} = 360°`:view==='interior'?`INTERIOR = 180° − ${deg(f.exterior)}`:view==='exterior'?`${n} EXTERIOR TURNS = 360°`:`${n} EQUAL SIDES · ${n} EQUAL ANGLES`,'result',25);}
 if(phase<=1)chalk(g,C[0],478,'START WITH ONE CIRCLE','focus',28);
 // Transparent high-priority handles live outside the disposable geometric layer.
 for(const type of ['rotation','radius']){
  let el=svg.querySelector(`[data-testid="f117-${type}-handle"]`);
  if(!interactive){el?.remove();continue;}
  if(!el){el=E('circle',{r:27,fill:'transparent',stroke:'transparent',class:`f117-${type}-handle`,tabindex:0,role:'slider','data-testid':`f117-${type}-handle`,style:'touch-action:none'},svg)}
  let a=type==='rotation'?p[0]:point(...C,0,r);el.setAttribute('cx',a[0]);el.setAttribute('cy',a[1]);el.setAttribute('aria-label',type==='rotation'?'Rotate polygon on the circle. Arrow keys rotate by five degrees.':'Resize the circumcircle. Arrow keys adjust radius.');el.setAttribute('aria-valuemin',type==='rotation'?-180:120);el.setAttribute('aria-valuemax',type==='rotation'?180:200);el.setAttribute('aria-valuenow',String(type==='rotation'?rotation:r));
  // High-contrast ring makes interactive grip discoverable at desktop and mobile.
  ring(g,...a,12,type==='rotation'?'result':'op');
  // Grips remain stationary DOM nodes above the replaced geometry; capture survives each frame.
 }
 return{p,f};
}
function draw(stage,opt={}){
if(window.NovaLessonComponent?.active){[stage,opt]=window.NovaLessonComponent.args("draw",arguments);}
let box=shell(stage),n=opt.n||S.n,r=opt.radius||S.radius,rotation=opt.rotation??S.rotation,phase=opt.phase??8,view=opt.show||'all';
 let aside=H('aside',{class:'f117-aside','data-testid':'f117-aside'});let cards=[card('EQUAL SIDES',String(n),`All ${n} vertices lie on the same circle.`),card('CENTRE ANGLE',!opt.hide&&phase>=5?deg(360/n):'?',`One complete turn is shared equally.`),card('INTERIOR ANGLE',!opt.hide&&phase>=6?deg(180-360/n):'?',`Interior plus exterior is 180°.`),card('EXTERIOR ANGLE',!opt.hide&&phase>=6?deg(360/n):'?',`Equal turns total 360°.`)];aside.append(...cards);box.layout.append(aside);
 const repaint=(next={})=>{Object.assign(opt,next);let f=geometry(box.svg,{...opt,n:opt.n||n,radius:opt.radius||r,rotation:opt.rotation??rotation,phase:opt.phase??phase,show:opt.show||view});for(let i=1;i<=3;i++)cards[i].querySelector('.f117-main').textContent=opt.hide?'?':i===1?(opt.phase??phase)>=5?deg(f.f.central):'?':(opt.phase??phase)>=6?deg(i===2?f.f.interior:f.f.exterior):'?';return f;};
 repaint();N.scene.helperStrip(box.sec,opt.pose||'explain',opt.caption||'Every regular polygon can be built from equally spaced points on a circle.');return{...box,repaint};}
const STEPS=[
 {name:'Begin with a circle',n:5,phase:0,pose:'explain',narration:'Start with one circle. Every point on its edge is the same distance from the centre.'},
 {name:'Locate the centre',n:5,phase:1,pose:'point-down',narration:'Mark the centre and see two diameters cross. The entire turn around the centre is three hundred and sixty degrees.'},
 {name:'Place the first vertex',n:5,phase:2,pose:'show-one',narration:'Place the first vertex on the circumference. Its distance from the centre is the radius.'},
 {name:'Place equal steps',n:5,phase:3,pose:'count',narration:'Space the vertices equally around the circle, then join neighbouring points with straight segments.'},
 {name:'Join every neighbour',n:5,phase:4,pose:'ruler',narration:'Five equal chord lengths make a regular pentagon. Each corner has the same interior angle.'},
 {name:'Reveal one centre sector',n:5,phase:5,pose:'magnify',narration:'Five identical centre sectors share one complete revolution. Each centre angle is seventy-two degrees.'},
 {name:'Five equal sectors',n:5,phase:6,pose:'show-three',narration:'Each sector contains two equal radii. Every centre angle is the same, so every chord is equal.'},
 {name:'Interior angles',n:5,phase:7,pose:'think',narration:'The inside angle of a regular pentagon is one hundred and eight degrees.'},
 {name:'Exterior angles',n:5,phase:8,show:'exterior',pose:'point-right',narration:'Each exterior turn is seventy-two degrees. Five identical turns make three hundred and sixty degrees.'},
 {name:'Build a triangle',n:3,phase:8,show:'central',pose:'compare',narration:'Three equal centre sectors measure one hundred and twenty degrees each, making an equilateral triangle.'},
 {name:'Build a square',n:4,phase:8,show:'interior',pose:'count',narration:'A square has four equal right angles, each ninety degrees.'},
 {name:'Build a hexagon',n:6,phase:8,show:'all',pose:'idea',narration:'Six equal centre angles are sixty degrees each. The inside angles are each one hundred and twenty degrees.'},
 {name:'Generalise for n sides',n:8,phase:8,show:'all',pose:'ruler',narration:'For any regular polygon, divide three hundred and sixty by the number of sides for its centre and exterior angles.'},
 {name:'Prove the interior angle',n:10,phase:8,show:'interior',pose:'celebrate',narration:'An interior angle is one hundred and eighty minus the exterior angle. That works for every regular polygon.'}
];
function render(i,stage){let s=STEPS[i]||STEPS[0];draw(stage,{...s,radius:188,rotation:-90,hide:false,caption:s.narration});}
function svgPt(svg,ev){let p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;let m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):p;}
function fastDrag(handle,svg,getState,project,update){let active=null;
 handle.addEventListener('pointerdown',ev=>{if((ev.pointerType==='mouse'&&ev.button!==0)||N.ui._drag)return;ev.preventDefault();let id=ev.pointerId,start=getState(),pending=null,raf=0,drag={cancel:()=>cancel(),captured:true,moved:true};active=drag;N.ui._drag=drag;
 const apply=()=>{raf=0;if(pending!==null){update(pending,true);pending=null}};
 const move=e=>{if(e.pointerId!==id)return;e.preventDefault();pending=project(svgPt(svg,e));if(!raf)raf=requestAnimationFrame(apply)};
 const clear=()=>{cancelAnimationFrame(raf);active=null;if(N.ui._drag===drag)N.ui._drag=null;handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);try{handle.releasePointerCapture(id)}catch(_){}};
 const up=e=>{if(e.pointerId!==id)return;let last=project(svgPt(svg,e));clear();update(last,false)};
 const cancel=()=>{clear();update(start,false)};const lost=()=>{if(active)cancel()};const key=e=>{if(e.key==='Escape'){e.preventDefault();cancel()}};
 handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);handle.setPointerCapture(id);
 });
 handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const delta=['ArrowLeft','ArrowDown'].includes(e.key)?-1:1;update(getState()+delta*(handle.dataset.testid==='f117-radius-handle'?5:5),false)});
}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f117-tools');window.NovaLessonComponent?.applyExploreModels();let state=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("state",()=>({...S})):({...S}));
 window.NovaLessonComponent?.applyExploreModels();let preset=H('select',{class:'nova-input','data-testid':'f117-preset','aria-label':'Choose lesson or polygon preset'});
 window.NovaLessonComponent?.applyExploreModels();for(const [key,p] of Object.entries(CFG.presets))preset.append(H('option',{value:key,text:p.label}));window.NovaLessonComponent?.applyExploreModels();preset.value=state.preset;
 window.NovaLessonComponent?.applyExploreModels();let count=H('input',{type:'range',min:'3',max:'12',step:'1',value:String(state.n),'data-testid':'f117-sides'}),countRead=H('span',{class:'f117-value',text:String(state.n)});
 window.NovaLessonComponent?.applyExploreModels();let radius=H('input',{type:'range',min:'120',max:'200',step:'1',value:String(state.radius),'data-testid':'f117-radius'}),radiusRead=H('span',{class:'f117-value',text:String(state.radius)});
 window.NovaLessonComponent?.applyExploreModels();let rotation=H('input',{type:'range',min:'-180',max:'180',step:'5',value:String(state.rotation),'data-testid':'f117-rotation'}),rotationRead=H('span',{class:'f117-value',text:deg(state.rotation)});
 window.NovaLessonComponent?.applyExploreModels();let view=H('select',{class:'nova-input','data-testid':'f117-view'},['all','central','interior','exterior'].map(k=>H('option',{value:k,text:k==='all'?'Show all angles':k==='central'?'Centre sector only':k==='interior'?'Interior angle only':'Exterior turn only'})));
 window.NovaLessonComponent?.applyExploreModels();let choices=H('div',{class:'f117-actions f117-wide'});
 window.NovaLessonComponent?.applyExploreModels();const wrap=(txt,control)=>H('label',{},[txt,control]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(wrap('Lesson preset',preset),wrap('Sides (n)',H('div',{class:'f117-explorebar'},[count,countRead])),wrap('Circle radius',H('div',{class:'f117-explorebar'},[radius,radiusRead])),wrap('Polygon rotation',H('div',{class:'f117-explorebar'},[rotation,rotationRead])),wrap('Angle highlight',view),choices,prose('Drag the gold vertex to rotate the whole polygon, or the orange radius grip to resize the circle. Every vertex remains equally spaced on the circumference. Arrow keys work on both grips.'));
 window.NovaLessonComponent?.applyExploreModels();let box;window.NovaLessonComponent?.applyExploreModels();function repaint(){countRead.textContent=state.n;radiusRead.textContent=state.radius;rotationRead.textContent=deg(state.rotation);let p=calc(state.n);if(!box){box=draw(stage,{...state,phase:8,interactive:true,free:true,caption:'The circle divides into equal sectors; change the number of sides or drag a vertex.'});}else box.repaint({...state,n:state.n,phase:8,interactive:true,free:true,hide:false});
 box.sec.querySelector('.f117-card .f117-main').textContent=state.n;box.sec.querySelector('.f117-card .f117-sub').textContent=`All ${state.n} vertices lie on the same circle.`;
 const rotHandle=box.svg.querySelector('[data-testid="f117-rotation-handle"]'),radiusHandle=box.svg.querySelector('[data-testid="f117-radius-handle"]');
 if(rotHandle&&!rotHandle.dataset.ready){rotHandle.dataset.ready='true';fastDrag(rotHandle,box.svg,()=>state.rotation,p=>{let a=Math.atan2(p.y-C[1],p.x-C[0])*180/Math.PI;return clamp(Math.round(a/5)*5,-180,180)},v=>{state.rotation=v;rotation.value=v;rotationRead.textContent=deg(v);box.repaint({...state,n:state.n,phase:8,interactive:true});emit('rotation',v)});}
 if(radiusHandle&&!radiusHandle.dataset.ready){radiusHandle.dataset.ready='true';fastDrag(radiusHandle,box.svg,()=>state.radius,p=>clamp(Math.round(Math.hypot(p.x-C[0],p.y-C[1])),120,200),v=>{state.radius=v;radius.value=v;radiusRead.textContent=v;box.repaint({...state,n:state.n,phase:8,interactive:true});emit('radius',v)});}
 }
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{state.preset=preset.value;state.n=CFG.presets[state.preset].n;count.value=state.n;emit('preset',state.preset);repaint()};
 window.NovaLessonComponent?.applyExploreModels();count.oninput=()=>{state.n=Number(count.value);emit('sides',state.n);repaint()};window.NovaLessonComponent?.applyExploreModels();radius.oninput=()=>{state.radius=Number(radius.value);emit('radius',state.radius);repaint()};window.NovaLessonComponent?.applyExploreModels();rotation.oninput=()=>{state.rotation=Number(rotation.value);emit('rotation',state.rotation);repaint()};window.NovaLessonComponent?.applyExploreModels();view.onchange=()=>{state.show=view.value;emit('show',state.show);repaint()};
 window.NovaLessonComponent?.applyExploreModels();choices.append(btn('Triangle',()=>{count.value=3;count.oninput()},'nova-btn ghost'),btn('Hexagon',()=>{count.value=6;count.oninput()},'nova-btn ghost'),btn('Decagon',()=>{count.value=10;count.oninput()},'nova-btn ghost'),btn('Restore circle',()=>{state={n:5,radius:188,rotation:-90,show:'all',preset:'y7'};preset.value='y7';count.value=5;radius.value=188;rotation.value=-90;view.value='all';emit('reset','y7');repaint()},'nova-btn primary'));
 window.NovaLessonComponent?.applyExploreModels();repaint();}
const REASONS={centre:'A full 360° revolution is divided equally among n centre sectors',straight:'Interior and exterior angles form a straight angle of 180°',turn:'The n equal exterior turns of a regular polygon total 360°',triangles:'An n-sided polygon can be divided into n − 2 triangles'};
const TASKS=[
 {n:3,kind:'central',answer:120,reason:'centre',q:'A regular triangle is made from three equal sectors. What is the angle at the centre?',hint:'Share 360° among three sectors.'},
 {n:5,kind:'central',answer:72,reason:'centre',q:'Find one central angle in a regular pentagon.',hint:'360° divided by five.'},
 {n:6,kind:'interior',answer:120,reason:'straight',q:'A regular hexagon has an exterior angle of 60°. Find the interior angle.',hint:'Subtract the exterior from 180°.'},
 {n:8,kind:'exterior',answer:45,reason:'turn',q:'Find one exterior angle of a regular octagon.',hint:'Eight equal turns make 360°.'},
 {n:10,kind:'central',answer:36,reason:'centre',q:'Ten equally spaced vertices make a decagon. What is the central angle?',hint:'Divide 360° by ten.'},
 {n:7,kind:'total',answer:900,reason:'triangles',q:'What is the sum of all interior angles in a heptagon?',hint:'Divide it into n − 2 triangles.'},
 {n:9,kind:'interior',answer:140,reason:'straight',q:'A regular nonagon has an exterior turn of 40°. What is its interior angle?',hint:'An inside angle and its exterior turn add to 180°.'},
 {n:12,kind:'exterior',answer:30,reason:'turn',q:'Find one exterior turn of a regular 12-sided polygon.',hint:'Twelve identical exterior turns total 360°.'}
];
function cardDrag(el,txt,target,choose){el.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;const id=e.pointerId,x=e.clientX,y=e.clientY;let ghost=null,drag={cancel:()=>cancel(),captured:true,moved:true};
 function move(ev){if(ev.pointerId!==id)return;if(!ghost&&Math.hypot(ev.clientX-x,ev.clientY-y)>7){ghost=H('div',{class:'f117-ghost',text:txt});document.body.append(ghost);N.ui._drag=drag;}if(ghost){ghost.style.left=ev.clientX+12+'px';ghost.style.top=ev.clientY+12+'px';const b=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom);ev.preventDefault();}}
 function clear(){ghost?.remove();target.dataset.hover='false';if(N.ui._drag===drag)N.ui._drag=null;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',cancel);el.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);try{el.releasePointerCapture(id)}catch(_){}}
 function up(ev){if(ev.pointerId!==id)return;const b=target.getBoundingClientRect(),hit=ghost&&ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom;clear();if(hit)choose()}
 function cancel(){clear()};function lost(){clear()};function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}
 el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',cancel);el.addEventListener('lostpointercapture',lost);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);try{el.setPointerCapture(id)}catch(_){}
 });}
function challenge(panel,api,stage){panel.classList.add('f117-tools');let index=0;
 function show(){let t=TASKS[index];panel.replaceChildren();panel.append(H('div',{class:'pr-task f117-wide',text:`CHALLENGE ${index+1} / ${TASKS.length}`}),prose(t.q));
 let answer=H('input',{class:'nova-input','data-testid':'f117-answer',type:'number',step:'any',placeholder:'Degrees','aria-label':'Answer in degrees'});panel.append(H('label',{class:'f117-wide'},['ANGLE / TOTAL (°)',answer]));
 let choices=H('div',{class:'f117-reasons f117-wide'}),drop=H('div',{class:'f117-drop f117-wide','data-testid':'f117-reason-drop',text:'Choose or drag the correct mathematical reason here'}),chosen=null;
 let pick=k=>{chosen=k;drop.textContent=REASONS[k];drop.dataset.set='true';emit('reason',k);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))};
 for(const [k,s] of Object.entries(REASONS)){let b=H('button',{class:'f117-reason',type:'button','data-reason':k,'aria-pressed':'false',text:s,onclick:()=>pick(k)});choices.append(b);cardDrag(b,s,drop,()=>pick(k));}
 panel.append(choices,drop);let buttons=H('div',{class:'f117-actions f117-wide'});panel.append(buttons);
 function diagram(reveal=false){draw(stage,{n:t.n,radius:188,rotation:-90,phase:8,show:t.kind==='total'?'all':t.kind==='central'?'central':t.kind==='interior'?'interior':'exterior',hide:!reveal,pose:reveal?'celebrate':'think',caption:reveal?'Your value and mathematical reason are correct.':'Count the equal sectors or angles; give both your answer and its reason.'})}
 let check=btn('Check angle + reason',()=>{let a=Number(answer.value),msg='';if(!answer.value.trim()||!Number.isFinite(a))msg='Enter a numerical angle in degrees.';else if(Math.abs(a-t.answer)>.01){if(Math.abs(a-(180-t.answer))<.01)msg='You found the supplementary angle instead. Check the question.';else if(a===360&&t.kind!=='total')msg='360° is one complete revolution; you need one equal angle.';else if(a===180*t.n)msg='For an interior-angle total, use n minus two triangles.';else msg=t.kind==='total'?'Split into n minus two triangles; each adds 180°.':'Check whether to divide 360° or subtract the exterior from 180°.'}else if(chosen!==t.reason)msg='That value is correct, but the chosen reason does not prove it.';
 if(msg){api.check(false,msg,{task:index+1});return;}api.check(true,`${deg(t.answer)}. ${REASONS[t.reason]}.`,{task:index+1,answer:t.answer,reason:chosen});emit('answer',{task:index+1,answer:a,reason:chosen});diagram(true);buttons.replaceChildren();if(index===TASKS.length-1)buttons.append(H('strong',{class:'f117-complete',text:'8 / 8 · REGULAR POLYGONS MASTERED'}));else buttons.append(btn('Next challenge →',()=>{index++;emit('task',index+1);show()},'nova-btn primary'))},'nova-btn primary');
 buttons.append(check,btn('Hint',()=>api.hint(t.hint)));answer.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()});diagram(false);
 }show();}
const def={id:ID,title:'Regular Polygon Builder',config:CFG,steps:STEPS,render,explore,challenge,alt:'Regular polygon from equal points on a circumscribed circle, with accurate central, interior and exterior angle relationships.',staticAlt:'A regular n-gon has equal central and exterior angles 360 divided by n degrees. Each interior angle is 180 degrees minus 360 divided by n.',exploreIntro:'Change the number of sides, rotate or resize the regular polygon, and highlight central, interior and exterior angles.',onRestore:()=>{Object.assign(S,{n:5,radius:188,rotation:-90,preset:'y7',show:'all'});emit('reset','y7')}};
N.registry.add({id:ID,title:'Regular Polygon Builder',family:'F11',topics:['regular polygon','central angles','exterior angles','interior angles','circle','construction'],deps:['F0-02','F0-04','F0-07','F0-08','F11-06']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"C":()=>C,"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"shell":["stage"],"draw":["stage","opt"]},exploreFields:{"state":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'07',title:'Regular Polygon Builder · Premium Edition',def,linked:['F11-06','F11-11','F12-01'],years:'Year 7–9 · Regular polygons and angular reasoning',spec:{purpose:'Build exact regular polygons by equally spaced points on a circle and derive the centre, interior and exterior angles.',params:'Side count 3–12, circumradius 120–200, rotation, centre/interior/exterior view.',presets:'Y7-044 regular pentagon; Y8-049 hexagon; Y9-026 octagon; triangle; square; decagon.',steps:'14 sequential construction and proof states.',interactions:'Pointer-captured rotation and radius handles, keyboard and slider equivalents, answer-and-reason challenges.',traps:'Confusing central and interior angles, using 360° without division, forgetting n−2 triangles.',gcse:'Generalising for arbitrary n and multi-step polygon problems.'}});
})();
