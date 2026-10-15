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

/* NOVA F4-03 · Cuisenaire-Rod Builder · Run 03 Premium Review.
   Canonical F0/F2 core, unchanged. All diagram shapes and maths use NOVA drawing helpers. */
const F403_CONFIG={
 id:'F4-03',startMode:'watch',preset:'Y7-019',
 parameters:{minRod:1,maxRod:10,maxTrainUnits:10,unitPixels:76},
 presets:{
 'Y7-019':{label:'Year 7 · Equal partitions of a whole',a:[6],b:[2,2,2],prompt:'A six-unit whole equals three equal two-unit parts.'},
 'five':{label:'Five in two different ways',a:[5],b:[2,3],prompt:'Two plus three makes the same length as five.'},
 'ten':{label:'Ten made from two and five',a:[10],b:[5,5],prompt:'Two five-unit rods match one ten-unit rod.'},
 'fraction':{label:'One half by matching lengths',a:[5,5],b:[2,3],prompt:'The shorter five-unit train is half as long as the ten-unit train.'}
 },
 challenge:[
 {title:'Three equal parts',context:'Top: make 6 with one rod. Bottom: make the same 6 with THREE equal rods.',a:6,b:6,kind:'three-equal'},
 {title:'Different ways to make eight',context:'Top: make 8 with TWO different rods. Bottom: match it with a SINGLE 8 rod.',a:8,b:8,kind:'two-different'},
 {title:'Exactly one half',context:'Bottom: build 10. Top: build HALF its length using at least TWO rods.',a:5,b:10,kind:'half'}
 ],
 events:{value:['preset','activeTrain','rodAdd','rodMove','rodRemove','rodOrder','reset','proof','answer'],types:['step','correct','hintUsed','mode']}
};window.F403_CONFIG=F403_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F403_CONFIG),ID=C.id;
const W=1100,T={x:177,w:760,unit:76,a:225,b:416,h:91},TRAY={left:71,gap:194,y1:675,y2:834,w:174,h:144},RET={x:448,y:1002,w:210,h:103};
const ROLES=['given','focus','op','support','unknown','result','focus','given','op','support','result'];
const rRole=n=>ROLES[n];
const total=a=>a.reduce((s,r)=>s+(typeof r==='number'?r:r.n),0);
const lengths=a=>a.map(r=>typeof r==='number'?r:r.n);
const equal=(a,b)=>total(a)===total(b);
const within=(a,n=0)=>Number.isInteger(n)&&total(a)+n<=C.parameters.maxTrainUnits;
const asTrain=a=>a.map((n,i)=>({id:i+1,n}));
function checkTask(ch,s){
 const a=lengths(s.a),b=lengths(s.b),ta=total(a),tb=total(b);
 if(ta!==ch.a||tb!==ch.b)return {ok:false,text:ch.kind==='half'?`Bottom must be ten units and top exactly half as long. Your lengths: A = ${ta}, B = ${tb}.`:`Measure both trains. A must be ${ch.a} units and B ${ch.b} units. Right now: A = ${ta}, B = ${tb}.`};
 if(ch.kind==='three-equal'&&(a.length!==1||b.length!==3||!b.every(n=>n===b[0])))return {ok:false,text:'The whole needs one rod; below, use three rods of EQUAL length.'};
 if(ch.kind==='two-different'&&(a.length!==2||a[0]===a[1]||b.length!==1||b[0]!==8))return {ok:false,text:'Top: two rods with different lengths. Bottom: a single eight-unit rod.'};
 if(ch.kind==='half'&&(a.length<2||tb!==2*ta))return {ok:false,text:'The five-unit top train must use at least two rods and measure half of the bottom train.'};
 return {ok:true,text:ch.kind==='half'?'Ten is twice five: the shorter train is one half of the longer.':ch.kind==='three-equal'?'Two + two + two equals six: three equal parts fit the whole.':'Two different pieces can equal a single eight-unit rod.'};
}
function hintTask(ch,s){if(ch.kind==='three-equal')return 'Try a six-unit rod above. Which rod fits exactly THREE times below it?';if(ch.kind==='two-different')return 'Choose two different lengths that add to eight. Use one eight below.';return 'Half of ten is five. Which two rods can make five?';}
function emit(key,value){if(!C.events.value.includes(key))throw Error(ID+' unknown event '+key);N.events.emit('value',{engine:ID,key,value});}
function b(text,fn,primary){return H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});}
function chalk(p,x,y,v,size=49,role='given'){return N.chalkText(p,x,y,String(v),{role,size});}
function drag(svg,el,opt){N.ui.svgDrag(svg,el,opt);el.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});return el;}
function mascot(stage,step){
if(window.NovaLessonComponent?.active){[stage,step]=window.NovaLessonComponent.args("mascot",arguments);}
const M={start:['explain','Make a whole!'],whole:['show-one','Here is six!'],part:['count','One part is two!'],build:['count','Keep building!'],finish:['celebrate','The ends line up!'],relate:['idea','Three equal parts!'],explore:['point','Try new trains!'],choose:['think','Pick a rod!'],placed:['point','Snap it in!'],moved:['ruler','Same length, new place!'],remove:['oops','Try another!'],wrong:['not-yet','Check the lengths!'],right:['celebrate','Perfect match!'],reset:['explain','Start fresh!'],hint:['idea','Look at the units!']};const z=M[step]||M.choose;N.scene.helperStrip(stage,z[0],z[1]);}
function srcZone(){return [{id:'return',kind:'remove',...RET}];}
function zones(s,from=null){const z=[];
 for(const lane of ['a','b']){
  const dest=s[lane],hasSelf=from?.lane===lane;
  if(total(dest)+(hasSelf?0:from?.n||0)>10)continue;
  for(let k=0;k<10;k++)z.push({kind:'drop',id:`${lane}:${k}`,x:T.x+k*T.unit,y:T[lane]-34,w:T.unit+1,h:T.h+72});
 }
 return z.concat(srcZone());
}
function insertionIndex(a,unit){let acc=0;for(let i=0;i<a.length;i++){const len=a[i].n;if(unit<acc+len/2)return i;acc+=len;}return a.length;}
function caps(side,heading,value,note,role){return N.neonCard([H('p',{class:'f403-side-label',text:heading}),H('div',{class:'f403-side-value',text:value}),H('p',{class:'f403-side-note',text:note})],{role});}
function trackDrawing(svg,lane,list,o){const y=T[lane],sum=total(list),left=T.x,end=left+sum*T.unit;
 chalk(svg,102,y+57,lane.toUpperCase(),61,lane==='a'?'given':'op');
 // A one-unit snap grid from the approved F0 svg.grid helper, not a handmade number line.
 N.svg.grid(svg,left,y-8,T.w,T.h+17,T.unit);
 N.neonLine(svg,left-10,y+T.h+16,left+T.w+12,y+T.h+16,{role:lane==='a'?'given':'op',width:3});
 N.neonRing(svg,left-6,y+T.h+16,{role:'given',r:7,pulse:false});
 if(o.target){const target=o.target[lane];N.svg.pill(svg,left+T.w-66,y-42,'TARGET '+(o.task?.kind==='half'&&lane==='a'?'?':target),{role:'unknown',size:25});}
 else chalk(svg,left+T.w-85,y-38,sum+' UNITS',37,lane==='a'?'given':'op');
 let used=0;
 for(const r of list){const x=T.x+used*T.unit,w=r.n*T.unit,group=E('g',{class:'f403-rod','data-lane':lane,'data-length':r.n,'data-id':r.id,'aria-label':'Train '+lane.toUpperCase()+' rod length '+r.n,role:o.interactive?'button':'img',tabindex:o.interactive?0:-1},svg);
  const plate=N.neonBox(group,x+3,y+4,w-6,T.h-8,{role:rRole(r.n),r:15});
  chalk(group,x+w/2,y+63,r.n,Math.min(w<90?59:67,67),rRole(r.n));
  // Mathematical marking: the given length, plus a tactile boundary at every rod end.
  N.neonLine(group,x+w-3,y+12,x+w-3,y+T.h-8,{role:'given',width:2.7});
  if(o.interactive){const from={lane,id:r.id,n:r.n};drag(svg,group,{box:{x:x+3,y:y+4,w:w-6,h:T.h-8},zones:()=>zones(o.s,from),onDrop:dest=>{if(dest==='return')return false;Promise.resolve().then(()=>o.onMove(from,dest));return true;},onRemove:()=>o.onRemove(lane,r.id),removeTo:{x:RET.x+RET.w/2,y:RET.y+RET.h/2}});
   group.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();o.onRemove(lane,r.id);}else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();o.onReorder(lane,r.id,e.key==='ArrowLeft'?-1:1);}else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();o.onSwitch(lane,r.id);}});
  }
  if(o.animated&&o.fresh===r.id)N.motion.arrive(plate,-32,0);
  used+=r.n;
 }
 return end;
}
function mainSvg(s,o){const svg=N.svg.root(W,o.interactive?1190:o.step>=6?925:840,'Two ten-unit tracks accept Cuisenaire rods. Each rod is labelled by its length, and matching train endpoints prove equal lengths.');svg.classList.add('f403-svg');svg.dataset.a=String(total(s.a));svg.dataset.b=String(total(s.b));svg.dataset.rodsA=lengths(s.a).join('+');svg.dataset.rodsB=lengths(s.b).join('+');
 const ta=total(s.a),tb=total(s.b);
 chalk(svg,550,74,o.interactive?'BUILD AND COMPARE LENGTHS':'SAME WHOLE · DIFFERENT PARTS',49,'given');
 chalk(svg,548,134,'EACH SQUARE MARKS ONE UNIT',38,'op');
 const ea=trackDrawing(svg,'a',s.a,{...o,s}),eb=trackDrawing(svg,'b',s.b,{...o,s});
 const relationship=o.interactive?ta&&tb?ta===tb?'MATCHING LENGTHS':ta*2===tb?'A IS HALF OF B':tb*2===ta?'B IS HALF OF A':'COMPARE THE ENDS':'BUILD TWO TRAINS':o.step>=5?'EQUAL ENDPOINTS · EQUAL LENGTHS':'WATCH THE SECOND TRAIN GROW';
 if(ta&&tb&&ta===tb){N.neonLine(svg,ea,T.a-4,eb,T.b+T.h+4,{role:o.won?'result':'focus',width:3});if(o.won||(!o.interactive&&o.step>=5))N.neonRing(svg,ea,350,{role:'result',r:13});}
 else if(ta&&tb){N.neonRing(svg,ea,351,{role:'given',r:9});N.neonRing(svg,eb,351,{role:'op',r:9});}
 chalk(svg,550,565,relationship,43,ta===tb&&ta>0?'result':'focus');
 if(!o.interactive&&o.step===6){N.svg.brace(svg,T.x,T.b+T.h+122,T.x+2*T.unit,T.b+T.h+122,{role:'unknown',depth:15});chalk(svg,550,696,'ONE OF THREE EQUAL PARTS',40,'unknown');}
 if(o.interactive){chalk(svg,550,641,'CHOOSE A ROD · SNAP IT INTO A TRAIN',39,'given');
   for(let i=0;i<=9;i++){const n=i+1,col=i%5,row=i>=5?1:0,x=TRAY.left+col*TRAY.gap,y=row?TRAY.y2:TRAY.y1;
    const g=E('g',{class:'f403-rod f403-tray','data-length':n,role:'button',tabindex:0,'aria-label':'Add rod '+n+' units to active train'},svg);
    N.neonBox(g,x,y,TRAY.w,TRAY.h,{role:rRole(n),r:15});
    N.neonBox(g,x+11,y+41,n*12.7,59,{role:rRole(n),r:8});
    chalk(g,x+151,y+88,n,n===10?39:52,rRole(n));
    drag(svg,g,{box:{x,y,w:TRAY.w,h:TRAY.h},zones:()=>zones(s,{n}),onDrop:id=>{if(id==='return')return false;Promise.resolve().then(()=>o.onAdd(n,id));return true;}});
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onAdd(n,o.active+':10');}});
   }
   N.neonBox(svg,RET.x,RET.y,RET.w,RET.h,{role:'error',r:11,text:'RETURN ROD',size:36});
   chalk(svg,550,1150,'DRAG HERE TO REMOVE',33,'error');
 } else if(o.step>=5){
    chalk(svg,550,o.step>=6?782:715,`${ta} UNITS = ${tb} UNITS`,55,'result');
    if(o.step>=6)chalk(svg,550,866,'THREE PARTS OF TWO MAKE SIX',41,'unknown');
 }
 return svg;}
function present(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("present",arguments);}
stage.innerHTML='';N.cap(stage,'Cuisenaire Rods',o.challenge?'CHALLENGE':o.interactive?'BUILD & EXPLORE':o.subtitle||'Equal length · different partitions');
 const layout=H('div',{class:'f403-layout'}),apparatus=H('div',{class:'f403-apparatus'}),side=H('aside',{class:'f403-side','aria-label':'Train length evidence'});
 apparatus.append(mainSvg(s,o));const a=total(s.a),bTotal=total(s.b);
 side.append(caps(side,'TRAIN A',a+' units',s.a.length?lengths(s.a).join(' + '):'Empty · choose a rod','given'),caps(side,'TRAIN B',bTotal+' units',s.b.length?lengths(s.b).join(' + '):'Empty · choose a rod','op'),caps(side,'RELATION',a&&bTotal?a===bTotal?'EQUAL':a*2===bTotal?'HALF':bTotal*2===a?'B IS HALF':'NOT YET':'?',a&&bTotal?a===bTotal?'The ends align.':'Compare both lengths.':'Build both trains.','result'));
 layout.append(apparatus,side);stage.append(layout);if(!o.interactive&&o.step===6&&!o.won){const fraction=H('div',{class:'f403-fraction-equation'});fraction.append(N.mt.render('\\frac{2}{6}=\\frac{1}{3}'));stage.append(fraction);}if(o.won)stage.append(H('p',{class:'f403-proof',text:o.proof||'Lengths proven.'}));mascot(stage,o.pose||'choose');}
function watchScene(i){const snaps=[{a:[],b:[]},{a:[6],b:[]},{a:[6],b:[2]},{a:[6],b:[2,2]},{a:[6],b:[2,2,2]},{a:[6],b:[2,2,2]},{a:[6],b:[2,2,2]}];return {a:asTrain(snaps[i].a),b:asTrain(snaps[i].b)};}
let seq=100;
function live(panel,stage,task,api){let s={a:[],b:[]},active='a',message=task?'Make the stated lengths and arrangement. Then prove they match.':'Choose a rod in the bottom tray; drag it onto A or B.',state='explore',won=false,attempts=0,lastProof='';
 const done=()=>({a:lengths(s.a),b:lengths(s.b),ta:total(s.a),tb:total(s.b),won,attempts,active});
 function useAdd(n,id){if(won)return false;const [lane,k]=id.split(':');const index=Number(k);if(!['a','b'].includes(lane)||!Number.isInteger(n)||n<1||n>10||!within(s[lane],n))return false;
  const at=insertionIndex(s[lane],index);s[lane].splice(at,0,{id:++seq,n});active=lane;emit('rodAdd',{lane,length:n,at});redraw(`Snapped a ${n}-unit rod into Train ${lane.toUpperCase()}.`,'placed');return true;}
 function useMove(source,id){if(won)return false;const [dest,k]=id.split(':');if(!['a','b'].includes(dest))return false;const orig=s[source.lane],i=orig.findIndex(r=>r.id===source.id);if(i<0)return false;const v=orig[i];if(source.lane!==dest&&!within(s[dest],v.n))return false;
  orig.splice(i,1);let at=insertionIndex(s[dest],Number(k));s[dest].splice(at,0,v);active=dest;emit('rodMove',{from:source.lane,to:dest,length:v.n,at});redraw(`Moved the ${v.n}-unit rod. Check the length again.`,'moved');return true;}
 function remove(lane,id){if(won)return;const i=s[lane].findIndex(r=>r.id===id);if(i===-1)return;const n=s[lane].splice(i,1)[0].n;emit('rodRemove',{lane,length:n});redraw('Rod returned to the tray. Choose another length.','remove');}
 function reorder(lane,id,delta){if(won)return;const arr=s[lane],i=arr.findIndex(x=>x.id===id);if(i<0)return;const to=Math.max(0,Math.min(arr.length-1,i+delta));if(i!==to)arr.splice(to,0,arr.splice(i,1)[0]);emit('rodOrder',{lane,id,index:to});redraw('Rod order changed. The total length stays the same.','moved');}
 function switchLane(lane,id){if(won)return;const arr=s[lane],i=arr.findIndex(r=>r.id===id);if(i<0)return;const n=arr[i].n,to=lane==='a'?'b':'a';if(!within(s[to],n)){redraw('That rod would take Train '+to.toUpperCase()+' beyond ten units.','wrong');return;}useMove({lane,id},to+':10');}
 function changeActive(v){active=v;emit('activeTrain',v);redraw('Adding rods to Train '+v.toUpperCase()+'.','choose');}
 function reset(){s={a:[],b:[]};won=false;attempts=0;emit('reset',true);redraw('Both trains are empty. Build them again.','reset');}
 function hint(){const v=task?hintTask(task,s):'Each small grid square is one unit. Add the rod lengths to compare both endpoints.';api?.hint(v);redraw(v,'hint');}
 function check(){attempts++;emit('answer',{a:lengths(s.a),b:lengths(s.b)});
  const result=task?checkTask(task,s):{ok:total(s.a)>0&&total(s.a)===total(s.b),text:total(s.a)===total(s.b)&&total(s.a)>0?'Both trains have exactly the same length. Different parts can make the same whole.':'Both trains need a positive length and their right ends must align.'};
  if(!result.ok){api?.check(false,result.text);redraw(result.text,'wrong');return false;}
  won=true;lastProof=result.text;emit('proof',{a:lengths(s.a),b:lengths(s.b),correct:true});api?.check(true,result.text);redraw(result.text,'right');return true;}
 function redraw(m,p){message=m;state=p;render();}
 function render(){panel.innerHTML='';present(stage,s,{interactive:!won,won,challenge:!!task,pose:state,active,proof:lastProof,task,target:task?{a:task.a,b:task.b}:null,onAdd:useAdd,onMove:useMove,onRemove:remove,onReorder:reorder,onSwitch:switchLane});
  if(!task){const preset=H('select',{'aria-label':'Rod comparison preset'});Object.entries(C.presets).forEach(([key,v])=>preset.add(new Option(v.label,key)));preset.value=C.preset;preset.onchange=()=>{C.preset=preset.value;const pp=C.presets[C.preset];s={a:asTrain(pp.a),b:asTrain(pp.b)};redraw(pp.prompt,'choose');emit('preset',C.preset);};panel.append(H('label',{class:'f403-field'},['Try a preset',preset]));}
  panel.append(H('p',{class:'f403-prompt',text:task?task.context:'Build two trains up to 10 units each. Can you make the ends align?'}));
  if(!won){const row=H('div',{class:'f403-controls'}),radioA=H('label',{class:'f403-choice'},[H('input',{type:'radio',name:'f403-active',value:'a',checked:active==='a',onchange:()=>changeActive('a')}),'Add to A']),radioB=H('label',{class:'f403-choice'},[H('input',{type:'radio',name:'f403-active',value:'b',checked:active==='b',onchange:()=>changeActive('b')}),'Add to B']);
   const choice=H('select',{'aria-label':'Choose rod length'});for(let n=1;n<=10;n++)choice.add(new Option(n+' units',String(n)));choice.value='2';const fld=H('label',{class:'f403-field'},['Rod length',choice]);radioA.querySelector('input').checked=active==='a';radioB.querySelector('input').checked=active==='b';row.append(radioA,radioB,fld,b('Add rod',()=>useAdd(Number(choice.value),active+':10')),b('Check',check,true),b('Hint',hint),b('Reset trains',reset));panel.append(row);
  }else panel.append(H('div',{class:'f403-controls'},[H('span',{class:'f403-proof',text:'Length relationship proved!'}),...(!task?[b('Build again',reset)]:[])]));
  panel.append(H('p',{class:'f403-help',text:'Drag a numbered rod from the tray into either track. Drag built rods to reorder or move them. Return a rod to the red zone, or use Delete, arrows and Add rod.'}));
  panel.append(H('p',{class:'f403-status'+(state==='wrong'?' bad':state==='right'?' good':''),role:'status',text:message}));
 }
 render();return {getState:done,useAdd,useMove,remove,reorder,switchLane,check,reset};
}
const STEPS=[
 {name:'What is one whole?',narration:'A Cuisenaire rod represents a length. Count the equal unit spaces on the track to measure it.',prompt:'What does one grid square represent?'},
 {name:'A whole rod of six',narration:'This rod covers six equal unit spaces. The full length is our whole.',prompt:'How long is the upper rod?'},
 {name:'First smaller part',narration:'This shorter rod covers two spaces. It is one part of the same whole.',prompt:'Could several of these fit?'},
 {name:'Build another equal part',narration:'A second two-unit rod snaps exactly next to the first. That makes four units so far.',prompt:'How many more units are needed?'},
 {name:'Complete the train',narration:'A third two-unit rod fits the remaining gap. Two plus two plus two equals six.',prompt:'Count the equal parts.'},
 {name:'Equal lengths, different parts',narration:'Both trains end at the same unit. Their lengths are equal, even though one uses one rod and the other uses three.',prompt:'Do the right ends line up?'},
 {name:'Name the fraction relationship',narration:'Each two-unit rod is one of three equal parts of the six-unit whole. That means each is one third of the whole.',prompt:'Why must the three parts be equal?'}
];
const watchPose=['start','whole','part','build','build','finish','relate'];
const def={id:ID,title:'Cuisenaire-Rod Builder',config:C,steps:STEPS,alt:'Two measured rod trains align on a shared unit grid. Three two-unit rods match one six-unit rod; the fraction relation is one third.',staticAlt:'6 units = 2 + 2 + 2 units; each rod is one of three equal parts.',
 render(i,stage){present(stage,watchScene(i),{step:i,interactive:false,subtitle:STEPS[i].name,pose:watchPose[i],animated:true});},
 exploreIntro:'Build, drag, compare, and check equal lengths.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();live(panel,stage,null,null);},
 challenge(panel,api,stage){let index=0;function next(){panel.innerHTML='';if(index>=C.challenge.length){present(stage,{a:asTrain([5]),b:asTrain([10])},{interactive:false,step:6,won:true,pose:'right',subtitle:'All three challenges complete',proof:'Equal trains, different partitions and one-half relationship proven.'});panel.append(H('p',{class:'f403-finish',text:'You have built equal lengths, used different partitions and proved one-half with real unit lengths.'}));return;}
  let ch=C.challenge[index],wrap=H('div');panel.append(H('p',{class:'f403-progress',text:`Problem ${index+1} of ${C.challenge.length} · ${ch.title}`}),wrap);
  const remote={hint:msg=>api.hint(msg),check:(ok,msg)=>{api.check(ok,msg,{task:index+1});if(ok)Promise.resolve().then(()=>wrap.append(H('div',{class:'f403-next'},[b('Next problem →',()=>{index++;next();},true)])));}};live(wrap,stage,ch,remote);
 }next();}
};
N.registry.add({id:ID,title:'Cuisenaire-Rod Builder',topics:['fractions','equivalent lengths','composition','part-whole'],deps:['F0-01','F0-02','F0-08','F0-13']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"ROLES":()=>ROLES,"STEPS":()=>STEPS,"watchPose":()=>watchPose},draws:{"mascot":["stage","step"],"present":["stage","s","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'03',title:'Cuisenaire Rods · Run 03 Review',def,years:'Year 7 · Fractions as numbers; supports Years 8–9 proportion and equivalence.',linked:['F4-01','F4-02','F5-01','F5-11'],spec:{purpose:'Prove equivalence, composition, and fractions as equal partitions through measured rod trains.',params:'Rod lengths 1–10, unit snap grid, up to 10 whole units per track; two trains; keyboard reordering and removal.',presets:'Y7-019: six = two+two+two. Five = two+three. Ten = five+five. Five is half of ten.',steps:'Show unit track → reveal whole rod → construct repeated equal parts → align endpoints → generalise fraction.',interactions:'Drag from tray onto either rail, reorder/switch built rods, drop into red return zone, keyboard Add/Delete/arrows, Explore presets and three checked challenges.',traps:'Assuming larger number of rods means longer total; unequal unit lengths; mistaking one third for one of two parts; confusing matching length with identical rod count.',gcse:'Equal partitions and fractional multiples; gateway to equivalent fractions and ratios.'}});
window.F403_MATH={total,lengths,equal,within,checkTask,hintTask,insertionIndex,asTrain};
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));card.append(dev);
card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
