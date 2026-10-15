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

/* NOVA F6-01 Ratio Table — uses approved F0/F2 house helpers only. */
const F601_CONFIG={
 id:'F6-01',startMode:'watch',preset:'Y7-060',
 parameters:{relation:['direct','inverse'],minimumFactor:.25,maximumFactor:6,precision:3},
 presets:{
 'Y7-058':{label:'Y7 · Ratio notation',a:'Red beads',b:'Blue beads',a0:3,b0:5,f:2,type:'direct',unitA:'',unitB:''},
 'Y7-060':{label:'Y7 · Direct proportion',a:'Tickets',b:'Cost',a0:2,b0:6,f:3,type:'direct',unitA:'',unitB:'£'},
 'Y7-061':{label:'Y7 · Unit price and best buy',a:'Cans',b:'Cost',a0:4,b0:12,f:.25,type:'direct',unitA:'',unitB:'£'},
 'Y8-034':{label:'Y8 · Fractional/decimal ratios',a:'Paint A (L)',b:'Paint B (L)',a0:.5,b0:1.5,f:4,type:'direct',unitA:'',unitB:''},
 'Y8-035':{label:'Y8 · Tables and equations',a:'Input x',b:'Output y',a0:2,b0:7.5,f:3,type:'direct',unitA:'',unitB:''},
 'Y8-036':{label:'Y8 · Direct proportion graphs',a:'Horizontal x',b:'Vertical y',a0:1,b0:3,f:5,type:'direct',unitA:'',unitB:''},
 'Y8-037':{label:'Y8 · Inverse proportion contrast',a:'Workers',b:'Hours',a0:2,b0:12,f:3,type:'inverse',unitA:'',unitB:''}
 },
 events:{value:['preset','factor','factorA','factorB','tile','answer','reset','remove','hint','relation'],types:['step','correct','hintUsed','mode']}
};window.F601_CONFIG=F601_CONFIG;
(function(){'use strict';
const C=window.NovaV2Integration.configuration(F601_CONFIG),N=window.NOVA,H=N.h,E=N.svg.el,ID=C.id;
// F6-01 local pointer-release safety net. Does not modify the locked shared F0 core.
// SVG pointer capture can miss a fast release after a long drag. Let the F0
// handler process it first; complete only a still-active drag of this engine.
window.addEventListener?.('pointerup',ev=>{const d=N.ui._drag;
 if(!d||!(d.el?.closest?.('svg.f601-svg')))return;
 Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});
},true);

let live=null;
function emit(k,v){if(!C.events.value.includes(k))throw Error('Undeclared F6-01 event '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
function f(n){if(n===null||n===undefined)return '?';const x=Math.round((+n)*1000)/1000;return String(Object.is(x,-0)?0:x);}
function fmt(n,unit){return (unit==='£'?'£':'')+f(n)+(unit&&unit!=='£'?' '+unit:'');}
function approx(a,b){return Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(a),Math.abs(b));}
function pair(p,k){return {a:p.a0*k,b:p.type==='inverse'?p.b0/k:p.b0*k};}
function kword(k){if(k===1)return '×1';return k<1?'÷'+f(1/k):'×'+f(k);}
function opForB(p,k){return p.type==='inverse'?1/k:k;}
const STEPS=[
 {name:'Begin with a known pair',narration:'Start with two related quantities. These numbers describe one complete, known pair.',prompt:'Read both columns before you calculate.',pose:'explain',cat:'checking'},
 {name:'Notice how the quantities connect',narration:'A ratio table preserves the relationship between its quantities. Compare a pair, not isolated numbers.',prompt:'Look across the row to compare quantities.',pose:'point',cat:'think'},
 {name:'Choose the scale factor',narration:'The number of tickets grows from two to six. That is three times as many. We mark the factor clearly.',prompt:'How does the first column change?',pose:'count',cat:'checking'},
 {name:'Apply the same factor',narration:'In direct proportion, the cost must grow by the same factor. Multiply both quantities by three.',prompt:'Direct proportion changes both columns together.',pose:'think',cat:'point'},
 {name:'Reveal the matching value',narration:'Six tickets cost eighteen pounds. Both quantities have tripled, so the relationship is unchanged.',prompt:'Check the new pair against the old pair.',pose:'point',cat:'success'},
 {name:'Prove and transfer',narration:'We can divide each new quantity by three to return to the first row. Try another scale factor yourself.',prompt:'Can you reverse the operation and still keep the relationship?',pose:'cheer',cat:'success'}
];
const CHALLENGES=[
 {title:'Keep the ratio',a:'Red counters',b:'Blue counters',a0:3,b0:5,f:2,type:'direct',unitA:'',unitB:'',hint:'Both parts need the same multiplication factor.'},
 {title:'Find the unit cost',a:'Packs',b:'Cost',a0:4,b0:12,f:.25,type:'direct',unitA:'',unitB:'£',hint:'Four packs become one pack. Divide both quantities by four.'},
 {title:'Inverse comparison',a:'Workers',b:'Hours',a0:2,b0:12,f:3,type:'inverse',unitA:'',unitB:'',hint:'More workers need fewer hours. Multiply x and divide y by the same factor.'},
 {title:'Scale a decimal ratio',a:'Liquid A (L)',b:'Liquid B (L)',a0:.5,b0:1.5,f:4,type:'direct',unitA:'',unitB:'',hint:'The ratio stays equal even with decimals. Use the same factor in both columns.'}
];
function choose(vals,correct){let a=vals.filter(v=>Number.isFinite(v)&&v>=0);a.unshift(correct);let uniq=[];a.forEach(v=>{if(!uniq.some(x=>approx(x,v)))uniq.push(v)});return uniq.slice(0,4);}
function txt(svg,x,y,s,role='given',size=30,anchor='middle'){return N.chalkText(svg,x,y,String(s),{role,size,anchor});}
function box(svg,x,y,w,h,role){return N.neonBox(svg,x,y,w,h,{role,r:12});}
function pill(svg,x,y,w,h,s,role){box(svg,x,y,w,h,role);txt(svg,x+w/2,y+h*.65,s,role,Math.min(h*.40,31));}
function explain(p,k){return p.type==='inverse'?'Second column '+kword(1/k)+' · product stays fixed':'Both columns '+kword(k)+' · ratio stays fixed';}
function layout(mobile){return mobile?{
 W:420,H:1150,x:[35,225],w:160,headY:142,headH:75,oldY:231,oldH:108,opsY:373,newY:528,newH:108,
 c1:115,c2:305, bottom:780, tray:[36,228],target:{A:{x:30,y:522,w:170,h:123},B:{x:219,y:522,w:178,h:123}},ret:{x:133,y:1005,w:156,h:67},right:false
 }:{W:1120,H:910,x:[98,424],w:289,headY:124,headH:67,oldY:209,oldH:115,opsY:350,newY:512,newH:117,
 c1:242,c2:568,bottom:684,tray:[103,427],target:{A:{x:92,y:507,w:302,h:132},B:{x:418,y:507,w:302,h:132}},ret:{x:819,y:749,w:230,h:80},right:true
 }};
function stageScene(stage,p,opt={}){
if(window.NovaLessonComponent?.active){[stage,p,opt]=window.NovaLessonComponent.args("stageScene",arguments);}

 if(live)live.dead=true;const scene={dead:false};live=scene;
 stage.innerHTML='';N.cap(stage,'RATIO LAB · F6-01',opt.mode==='challenge'?'YOUR TURN':opt.mode==='explore'?'EXPLORE':'LEARN & REVEAL');
 const mob=window.innerWidth<690,L=layout(mob),s=N.svg.root(L.W,L.H,'Interactive NOVA ratio table: two quantities, one known row and a linked scaled row; green targets receive multipliers or answer tiles.');s.classList.add('f601-svg');scene.svg=s;
 const state=opt.step==null?5:opt.step,k=opt.factor??p.f,target=pair(p,k);
 const fa=opt.mode==='explore'?(opt.factors?.[0]??k):k, fb=opt.mode==='explore'?(opt.factors?.[1]??opForB(p,fa)):opForB(p,k);
 const actualA=p.a0*fa,actualB=p.b0*fb;
 const haveA=opt.kind==='challenge'?true:state>=3||opt.showA;
 const haveB=opt.kind==='challenge'?!!opt.choice:state>=4||opt.showB;
 const roleA='given',roleB='op';
 txt(s,L.W/2,mob?47:63,opt.kind==='challenge'?'FIND THE MISSING PART':opt.mode==='explore'?'MAKE THE PAIR MATCH':'RATIO TABLE · KEEP THE RELATION','focus',mob?29:45);
 txt(s,L.W/2,mob?82:105,p.type==='inverse'?'MORE IN A → LESS IN B':'SAME FACTOR · BOTH COLUMNS',p.type==='inverse'?'unknown':'result',mob?20:27);
 for(let col=0;col<2;col++){
  let x=L.x[col],w=L.w,cx=x+w/2,lab=col===0?p.a:p.b,role=col===0?'given':'op';
  box(s,x,L.headY,w,L.headH,role);
  txt(s,cx,L.headY+(mob?29:29),col===0?'QUANTITY A':'QUANTITY B','support',mob?17:23);
  txt(s,cx,L.headY+(mob?58:55),lab,'given',Math.min(mob?21:26,lab.length>15?19:28));
  box(s,x,L.oldY,w,L.oldH,role);
  txt(s,cx,L.oldY+(mob?33:33),'Known','support',mob?20:25);
  txt(s,cx,L.oldY+(mob?78:81),fmt(col===0?p.a0:p.b0,col===0?p.unitA:p.unitB),role,mob?35:50);
  N.svg.arrow(s,cx,L.opsY-22,cx,L.opsY+(mob?84:102),{role:col===0?'given':'op',width:4});
  let op=col===0?k:opForB(p,k);
  let applied=opt.kind==='challenge'?true:opt.mode==='explore'?opt.factors&&(col===0?opt.factors[0]:opt.factors[1])!==null:state>=2+(col===1?1:0);
  let opText=(opt.mode==='explore'&&opt.factors)?(opt.factors[col]===null?'?':kword(opt.factors[col])):kword(op);
  pill(s,cx-(mob?58:70),L.opsY+(mob?17:20),mob?116:140,mob?58:63,applied?opText:'?',applied?'focus':'unknown');
  box(s,x,L.newY,w,L.newH,col===1&&!haveB?'unknown':'result');
  txt(s,cx,L.newY+(mob?34:32),'New','support',mob?20:26);
  const got=col===0?haveA:haveB;
  let num=col===0?actualA:opt.kind==='challenge'?opt.choice??null:actualB;
  if(opt.mode==='explore'&&opt.entries)num=opt.entries[col];
  if(opt.kind==='challenge'&&col===0)num=target.a;
  const view=got&&num!==null?fmt(num,col===0?p.unitA:p.unitB):'?';
  txt(s,cx,L.newY+(mob?82:84),view,got?'result':'unknown',mob?39:51);
 }
 if(state>=1||opt.mode==='explore'||opt.kind==='challenge')N.svg.arrow(s,L.c1+L.w/2-25,L.oldY+L.oldH/2,L.c2-L.w/2+25,L.oldY+L.oldH/2,{role:'support',width:3});
 if(state>=4&&opt.kind!=='challenge'&&opt.mode!=='explore')N.svg.arrow(s,L.c1+L.w/2-25,L.newY+L.newH/2,L.c2-L.w/2+25,L.newY+L.newH/2,{role:'result',width:3});
 const tip=opt.mode==='explore'?'Drag an operation to BOTH lanes, then drag a number into each empty cell.':opt.kind==='challenge'?'Choose the missing number, then check it.':'Each row must describe the same relationship.';
 if(mob){txt(s,210,681,p.type==='inverse'?'INVERSE · DIVIDE THE OTHER SIDE':'DIRECT · MATCH THE OPERATIONS','result',19);
 txt(s,210,728,'DRAG THE MATHS TILES','focus',26);}
 else{txt(s,563,676,tip,'support',25);}
 if(L.right){
  pill(s,816,132,251,106,p.type==='inverse'?'x · y = constant':'y / x = constant','focus');
  const invariant=p.type==='inverse'?p.a0*p.b0:p.b0/p.a0;
  txt(s,939,286,'RELATIONSHIP','support',23);txt(s,939,338,p.type==='inverse'?'Product = '+f(invariant):'Rate = '+f(invariant),'result',30);
  txt(s,939,402,'WORK IT BOTH WAYS','focus',24);
  txt(s,939,445,p.type==='inverse'?'× one side':'× the first side','given',24);
  txt(s,939,483,p.type==='inverse'?'÷ the other side':'× the second side','op',24);
  N.neonRing(s,939,555,{role:'result',r:27,pulse:false});
  txt(s,939,619,'PROOF','result',25);
 }
 // A status/proof band is mathematical evidence rather than decorative filler.
 const proofY=mob?657:704;
 if(opt.mode!=='explore'){
  if(mob){txt(s,210,759,opt.kind==='challenge'?'Find B without showing the answer.':'READ · SCALE · CHECK','support',18);}
  else txt(s,554,738,p.type==='inverse'?'B changes in the opposite direction':'Equal factor keeps the ratio equal','result',23);
 }
 if(opt.mode==='explore'){
   txt(s,mob?210:559,mob?765:723,'MULTIPLIER TILES', 'support',mob?20:24);
   const F=opt.factorTiles||[2,3,.5,4];const tw=mob?78:135,tx=mob?[27,132,237,342]:[104,263,422,581],y=mob?808:758,th=mob?65:77;
   F.forEach((val,i)=>{let x=tx[i]-(mob?0:0); if(mob&&i===3)x=317;
     const grp=E('g',{tabindex:0,role:'button','aria-label':'Multiplier '+kword(val)+'; drag to a column lane', 'data-factor':String(val)},s);
     pill(grp,x,y,tw,th,kword(val),'focus');
     function drop(id){if(scene.dead)return false;let col=id==='laneA'?0:1;Promise.resolve().then(()=>{if(!scene.dead)opt.onFactor?.(val,col);});return true;}
     grp.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();opt.onFactor?.(val,opt.selectedColumn?.()??0);}});
     N.ui.svgDrag(s,grp,{box:{x,y,w:tw,h:th},zones:()=>[
      {id:'laneA',kind:'drop',x:L.c1-(mob?74:80),y:L.opsY+4,w:mob?148:160,h:86},
      {id:'laneB',kind:'drop',x:L.c2-(mob?74:80),y:L.opsY+4,w:mob?148:160,h:86},{id:'return',kind:'remove',...L.ret}],onDrop:drop,onRemove:()=>Promise.resolve().then(()=>{if(!scene.dead)opt.onFactorRemove?.(opt.selectedColumn?.()??0);})});
   });
   // Real value tiles: one per result. They are not read-only decoration.
   let nums=[actualA,actualB],yl=mob?901:850;
   nums.forEach((n,col)=>{const x=mob?[61,239][col]:[208,514][col],w=mob?117:135,h=mob?60:67;
     const grp=E('g',{tabindex:0,role:'button','aria-label':'Value tile '+f(n)+' for column '+(col?'B':'A'),'data-tile':String(col)},s);
     pill(grp,x,yl,w,h,fmt(n,col?p.unitB:p.unitA),'result');
     function put(){if(scene.dead)return false;Promise.resolve().then(()=>{if(!scene.dead)opt.onValue?.(col,n);});return true;}
     grp.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();put();}});
     N.ui.svgDrag(s,grp,{box:{x,y:yl,w,h},zones:()=>[{id:'cell',kind:'drop',...L.target[col?'B':'A']},{id:'return',kind:'remove',...L.ret}],onDrop:put,onRemove:()=>Promise.resolve().then(()=>{if(!scene.dead)opt.onRemoveEntry?.(col);})});
   });
   pill(s,L.ret.x,L.ret.y,L.ret.w,L.ret.h,'RETURN / RESET','error');
   // Visible re-grabbable ring handles let a filled value return to the red removal tray.
   if(opt.entries)opt.entries.forEach((n,col)=>{if(n===null)return;const cx=L.x[col]+L.w-(mob?21:26),cy=L.newY+23,g=E('g',{tabindex:0,role:'button','aria-label':'Remove entered value from column '+(col?'B':'A')},s);
      N.neonRing(g,cx,cy,{role:'focus',r:mob?10:12,pulse:false});
      g.addEventListener('keydown',ev=>{if(ev.key==='Delete'||ev.key==='Backspace'||ev.key==='Enter'){ev.preventDefault();opt.onRemoveEntry?.(col);}});
      N.ui.svgDrag(s,g,{box:{x:cx-19,y:cy-19,w:38,h:38},zones:()=>[{id:'return',kind:'remove',...L.ret}],onRemove:()=>Promise.resolve().then(()=>{if(!scene.dead)opt.onRemoveEntry?.(col);})});
   });
   if(opt.onReset){const ret=E('rect',{x:L.ret.x,y:L.ret.y,width:L.ret.w,height:L.ret.h,fill:'transparent',tabindex:0,role:'button','aria-label':'Reset ratio table'},s);ret.addEventListener('keydown',ev=>{if(ev.key==='Enter')opt.onReset();});}
 }
 if(opt.kind==='challenge'){
  txt(s,mob?210:558,mob?757:713,'ANSWER TILES · CHOOSE ONE','focus',mob?21:25);
  const correct=target.b,choices=choose([correct*(p.type==='inverse'?k:1/k),correct*(p.type==='inverse'?1/k:k),p.b0,target.a,correct+2],correct);
  const mobXs=[32,224,32,224],mobYs=[810,810,895,895],desktopXs=[92,258,424,590];
  choices.forEach((n,i)=>{
    const x=mob?mobXs[i]:desktopXs[i],y=mob?mobYs[i]:773,w=mob?164:144,h=mob?66:78;
    const grp=E('g',{tabindex:0,role:'button','aria-label':'Answer tile '+fmt(n,p.unitB),'data-answer':f(n)},s);
    pill(grp,x,y,w,h,fmt(n,p.unitB),opt.choice!==null&&approx(opt.choice,n)?'result':'focus');
    function picked(){if(scene.dead)return false;Promise.resolve().then(()=>{if(!scene.dead)opt.onChoice?.(n);});return true;}
    grp.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();picked();}});
    N.ui.svgDrag(s,grp,{box:{x,y,w,h},zones:()=>[{id:'cell',kind:'drop',...L.target.B},{id:'remove',kind:'remove',...L.ret}],onDrop:picked,onRemove:()=>Promise.resolve().then(()=>{if(!scene.dead)opt.onChoice?.(null);})});
  });
  if(mob)pill(s,L.ret.x,L.ret.y,L.ret.w,L.ret.h,'RETURN TILE','error');
 }
 stage.appendChild(s);N.scene.helperStrip(stage,opt.pose||'point',opt.caption||'Apply the relationship to both columns.');
 if(opt.animate&&!N.reducedMotion()&&(opt.step>=2)){
  const targetEl=s.querySelectorAll('.nv-neon-box')[opt.step>=4?5:2];
  if(targetEl){targetEl.style.opacity='.2';N.motion.tween(540,t=>{if(!scene.dead)targetEl.style.opacity=f(.2+.8*t);});}
 }
 return scene;
}
function nstep(i,stage){const p=C.presets[C.preset],step=STEPS[i];stageScene(stage,p,{step:i,pose:step.pose,caption:i===0?'Start from a known pair.':i===1?'Compare across, then down.':i===2?'Name the factor before calculating.':i===3?'Change both columns together.':i===4?'The linked values agree.':'Reverse to check your answer.',animate:i>=2});}
function controls(panel){return function(tag,attrs,kids){const el=H(tag,attrs,kids);panel.appendChild(el);return el;};}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();const add=controls(panel);window.NovaLessonComponent?.applyExploreModels();let factors=[null,null],entries=[null,null],selected=0,chosen=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("chosen",()=>(2)):(2)),p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(C.presets[C.preset])):(C.presets[C.preset])),status=add('div',{class:'f601-status','aria-live':'polite',text:'Choose an operation. Apply it to each column.'});
 window.NovaLessonComponent?.applyExploreModels();const row=add('div',{class:'f601-controls'}),pres=H('select',{'aria-label':'Select ratio-table preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([id,v])=>pres.appendChild(H('option',{value:id,text:v.label})));window.NovaLessonComponent?.applyExploreModels();pres.value=C.preset;window.NovaLessonComponent?.applyExploreModels();row.appendChild(H('label',{},['Try a preset',pres]));
 window.NovaLessonComponent?.applyExploreModels();const chooseCol=H('select',{'aria-label':'Column to apply a keyboard multiplier'},[H('option',{value:'0',text:'Column A'}),H('option',{value:'1',text:'Column B'})]);window.NovaLessonComponent?.applyExploreModels();row.appendChild(H('label',{},['Keyboard drop target',chooseCol]));
 window.NovaLessonComponent?.applyExploreModels();const buttons=add('div',{class:'f601-actions'}),check=H('button',{class:'nova-btn primary',text:'Check relationship'}),reset=H('button',{class:'nova-btn',text:'Reset table'}),undo=H('button',{class:'nova-btn',text:'Undo last'});window.NovaLessonComponent?.applyExploreModels();buttons.append(check,undo,reset);
 window.NovaLessonComponent?.applyExploreModels();const history=[];
 window.NovaLessonComponent?.applyExploreModels();function snapshot(){history.push({f:[...factors],e:[...entries]});}
 window.NovaLessonComponent?.applyExploreModels();function draw(){p=C.presets[C.preset];let k=factors[0]??p.f;let val=pair(p,k);
  stageScene(stage,p,{mode:'explore',factor:k,factorTiles:[2,3,.5,4],factors,entries,showA:entries[0]!==null,showB:entries[1]!==null,selectedColumn:()=>Number(chooseCol.value),
   onFactor:(n,col)=>{snapshot();factors[col]=n;emit('factor'+(col?'B':'A'),n);emit('factor',n);entries=[null,null];status.textContent='Column '+(col?'B':'A')+' now uses '+kword(n)+'. '+(factors[0]!==null&&factors[1]!==null?'Compare the operators.':'Apply the matching operator to the other column.');draw();},
   onValue:(col,n)=>{snapshot();entries[col]=n;emit('tile',{column:col,value:n});status.textContent='Tile placed in column '+(col?'B':'A')+'. Check both results.';draw();},
   onReset:()=>{resetTable();},
   onFactorRemove:col=>{snapshot();factors[col]=null;entries=[null,null];emit('remove',{kind:'factor',column:col});status.textContent='Operation cleared from column '+(col?'B':'A')+'.';draw();},
   onRemoveEntry:col=>{snapshot();entries[col]=null;emit('remove',{kind:'value',column:col});status.textContent='Value returned from column '+(col?'B':'A')+'.';draw();}});
 }
 window.NovaLessonComponent?.applyExploreModels();function resetTable(){snapshot();factors=[null,null];entries=[null,null];emit('reset',true);status.textContent='Cleared. Apply a multiplier to each lane.';draw();}
 window.NovaLessonComponent?.applyExploreModels();pres.onchange=()=>{C.preset=pres.value;factors=[null,null];entries=[null,null];history.length=0;emit('preset',C.preset);status.textContent=C.presets[C.preset].type==='inverse'?'Inverse example: multiply A but DIVIDE B.':'New preset. Use the same factor in both columns.';draw();};
 window.NovaLessonComponent?.applyExploreModels();reset.onclick=resetTable;
 window.NovaLessonComponent?.applyExploreModels();undo.onclick=()=>{const last=history.pop();if(!last)return;factors=last.f;entries=last.e;emit('reset','undo');status.textContent='Reverted the last move.';draw();};
 window.NovaLessonComponent?.applyExploreModels();check.onclick=()=>{if(factors.some(x=>x===null)){status.textContent='Apply an operation to BOTH columns first.';return;}
 const a=factors[0],b=factors[1],needed=p.type==='inverse'?1/a:a;
 if(!approx(b,needed)){status.textContent=p.type==='inverse'?'Inverse proportion: when A grows, B must shrink so the product stays fixed.':'The two multipliers differ. In direct proportion both columns must use the SAME factor.';emit('answer',{correct:false,kind:'factor'});return;}
 const t=pair(p,a);
 if(entries.some(x=>x===null)){status.textContent='The operations match. Now drag BOTH number tiles to the new row.';return;}
 const ok=approx(entries[0],t.a)&&approx(entries[1],t.b);
 status.textContent=ok?'Correct — both quantities obey the relationship.':(!approx(entries[0],t.a)?'First column: multiply the original value by '+f(a)+'.':'Second column: '+(p.type==='inverse'?'divide by ':'multiply by ')+f(a)+'.');emit('answer',{correct:ok,kind:'explore'});
 };
 // Keyboard-only equivalents to dragging each type of SVG tile and assigning a target.
 window.NovaLessonComponent?.applyExploreModels();const quick=add('div',{class:'f601-actions'});window.NovaLessonComponent?.applyExploreModels();[2,3,.5,4].forEach(n=>quick.appendChild(H('button',{class:'nova-btn',text:kword(n),onclick:()=>{let col=+chooseCol.value;snapshot();factors[col]=n;entries=[null,null];emit('factor'+(col?'B':'A'),n);status.textContent=kword(n)+' applied to column '+(col?'B':'A')+'.';draw();}})));
 window.NovaLessonComponent?.applyExploreModels();quick.appendChild(H('button',{class:'nova-btn',text:'Place A value',onclick:()=>{snapshot();entries[0]=pair(p,factors[0]??p.f).a;emit('tile',{column:0,value:entries[0]});draw();}}));
 window.NovaLessonComponent?.applyExploreModels();quick.appendChild(H('button',{class:'nova-btn',text:'Place B value',onclick:()=>{snapshot();entries[1]=p.b0*(factors[1]??opForB(p,factors[0]??p.f));emit('tile',{column:1,value:entries[1]});draw();}}));
 window.NovaLessonComponent?.applyExploreModels();add('p',{class:'f601-note',text:'Drag multipliers from the tray to the arrows, then drag number tiles into both answer cells. For keyboard use, focus a tile and press Enter or use the matching buttons. Escape cancels a drag.'});
 window.NovaLessonComponent?.applyExploreModels();C._explore={setPreset:id=>{pres.value=id;pres.onchange();},setFactor:(col,k)=>{factors[col]=k;draw();},setValue:(col,v)=>{entries[col]=v;draw();},get:()=>({factors:[...factors],entries:[...entries],status:status.textContent}),check:()=>check.click(),reset:resetTable};window.NovaLessonComponent?.applyExploreModels();draw();
}
function challenge(panel,api,stage){let i=0,choice=null,solved=0,wrong=0,task=CHALLENGES[i],state=controls(panel);
 const question=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("challenge.question",(...a)=>state(...a),['p',{class:'f601-status','aria-live':'polite'}]):(state('p',{class:'f601-status','aria-live':'polite'}))),row=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("challenge.row",(...a)=>state(...a),['div',{class:'f601-challenge-row'}]):(state('div',{class:'f601-challenge-row'}))),answer=H('input',{type:'text',inputmode:'decimal',placeholder:'Number (optional)','aria-label':'Your answer number'}),check=H('button',{class:'nova-btn primary',text:'Check answer'}),hint=H('button',{class:'nova-btn',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next question',disabled:true});row.append(answer,check,hint,next);
 const stat=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("challenge.stat",(...a)=>state(...a),['div',{class:'f601-status','aria-live':'polite'}]):(state('div',{class:'f601-status','aria-live':'polite'})));
 function render(){const q=task;question.textContent='Question '+(i+1)+' / '+CHALLENGES.length+' · '+q.title;stageScene(stage,q,{kind:'challenge',choice,pose:wrong?'think':'point',caption:wrong?'Compare the two operators.':'Keep the relationship mathematically correct.',onChoice:v=>{choice=v;answer.value=v===null?'':f(v);emit('tile',{challenge:i,value:v});render();}});stat.textContent=choice===null?'Drag a number tile to the question-mark cell or type the value.':'Selected '+f(choice)+'. Press Check to verify.';}
 function feedback(q,v){if(q.type==='inverse')return 'Inverse proportion holds the PRODUCT fixed. Increasing A divides B, not multiplies it.';
 if(approx(v,q.b0))return 'This is the OLD quantity. You must scale it to match the new row.';
 if(approx(v,pair(q,q.f).a))return 'That is the value in column A, not column B.';
 if(approx(v,q.b0/q.f))return 'You divided the second column; it must multiply here.';
 return 'Use the same multiplicative factor that links the first column to the new row.';}
 function grade(){let q=task,v=choice;const t=answer.value.trim().replace(/£/g,'');if(t!==''&&Number.isFinite(Number(t)))v=Number(t);if(v===null||!Number.isFinite(v)){stat.textContent='Choose or enter a number first.';return;}
 let expected=pair(q,q.f).b,ok=approx(v,expected);api.check(ok,ok?'Correct. Both quantities keep the required relationship.':feedback(q,v),{task:i,answer:v});emit('answer',{task:i,value:v,correct:ok});
 if(ok){solved++;next.disabled=false;check.disabled=true;stat.textContent='Correct. Go to the next question.';}else{wrong++;stat.textContent=feedback(q,v);}
 }
 check.onclick=grade;
 hint.onclick=()=>{api.hint(task.hint);emit('hint',i);stat.textContent=task.hint;};
 next.onclick=()=>{if(i<CHALLENGES.length-1){i++;task=CHALLENGES[i];choice=null;wrong=0;answer.value='';check.disabled=false;next.disabled=true;render();}else{question.textContent='All four questions complete';next.disabled=true;stage.innerHTML='';N.cap(stage,'F6-01','COMPLETE');stage.appendChild(H('p',{class:'f601-status',text:'Four ratio-table problems completed. Repeat with a new preset in Explore.'}));N.scene.helperStrip(stage,'cheer','Fantastic: you kept the relationships true.');}};
 C._challenge={answer:v=>{choice=v;answer.value=String(v);render();answer.value=String(v);},check:grade,next:()=>next.click(),get:()=>({index:i,solved,wrong,text:stat.textContent})};render();
}
const DEF={id:ID,title:'Ratio Table · Linked Quantities Lab',config:C,steps:STEPS,
 render:nstep,explore,challenge,alt:'Glass neon ratio table. A multiplicative operation carries the first quantity into the next row, and the matching operation preserves direct or inverse proportion.',
 staticAlt:'A pair of values is scaled to a new pair. In direct proportion, multiply both quantities by the same number; in inverse proportion, multiply one and divide the other.',
 exploreIntro:'Drag a multiplier onto each operation lane; then fill and check the new row.',
 spec:{purpose:'Represent and prove equivalent ratios, direct proportion and contrasting inverse proportion without confusing additive and multiplicative reasoning.',params:'Two related quantities; direct or inverse; factor from 0.25 to 6; decimal values; independent keyboard and drag operations.',presets:'Y7-058, Y7-060, Y7-061, Y8-034, Y8-035, Y8-036, Y8-037.',steps:'Known pair → compare → choose factor → apply factor → reveal missing value → reverse/check.',interactions:'Drag multiplier pills to operation lanes, number tiles into cells; keyboard focus + Enter and companion buttons; reset and undo.',traps:'Only scaling one column; unequal factors; adding instead of multiplying; confusing new A with new B; inverse proportion wrongly treated as direct.',gcse:'Extension: equations y=kx, xy=k and ratio proof.'}}

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS,"CHALLENGES":()=>CHALLENGES},draws:{"stageScene":["stage","p","opt"]},exploreFields:{"chosen":{"kind":"value","factory":null,"argCount":null},"p":{"kind":"value","factory":null,"argCount":null},"challenge.question":{"kind":"factory","factory":"state","argCount":2},"challenge.row":{"kind":"factory","factory":"state","argCount":2},"challenge.stat":{"kind":"factory","factory":"state","argCount":2}}});
N.bankMount({id:ID,num:'F6·01',title:DEF.title,spec:DEF.spec,def:DEF,years:'Years 7–9',linked:['F0-02','F0-03','F0-04','F2-02','F4-07 (future)','F6-02','F6-09']});
N.registry.add({id:ID,title:DEF.title,family:'F6',kind:'engine',topics:['ratio','proportion','rates'],deps:['F0-02','F0-03','F0-04']});
})();
