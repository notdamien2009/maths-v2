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

/* F3-13 Division Sharing and Grouping · NOVA F0 source-only visual language. */
const F313_CONFIG={id:'F3-13',startMode:'watch',preset:'Y7-010-Share',parameters:{minCounters:2,maxCounters:36,maxDivisor:6},
 presets:{
  'Y7-010-Share':{label:'Sharing · 20 ÷ 4',units:20,divisor:4,method:'sharing',unitValue:1},
  'Y7-010-Group':{label:'Grouping · 24 ÷ 6',units:24,divisor:6,method:'grouping',unitValue:1},
  'Y7-010-Remain':{label:'Remainder · 26 ÷ 4',units:26,divisor:4,method:'grouping',unitValue:1},
  'Y7-010-Decimal':{label:'Tenths · 3.6 ÷ 4',units:36,divisor:4,method:'sharing',unitValue:0.1}
 },
 challenge:[{units:20,divisor:4,method:'sharing',unitValue:1},{units:26,divisor:4,method:'grouping',unitValue:1},{units:36,divisor:4,method:'sharing',unitValue:0.1}],
 events:{value:['preset','units','divisor','method','place','remove','reset','answer','proof','hint','undo'],types:['mode','correct','hintUsed','step']}};
window.F313_CONFIG=F313_CONFIG;
(function(){'use strict';const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F313_CONFIG),ID=C.id;
const SPEECH={start:'Look closely!',deal:'One at a time!',group:'Count the groups!',equal:'Even groups!',rem:'What is left?',done:'Nice work!',explore:'Your turn!',ready:'Have a go!',wrong:'Try again!',hint:'Look again!',right:'Great thinking!',win:'Brilliant!',undo:'Try again!'};
const POSES={start:'point',deal:'show-one',group:'count',equal:'cheer',rem:'think',done:'cheer',explore:'point',ready:'think',wrong:'oops',hint:'think',right:'cheer',win:'cheer',undo:'point'};
const FW=1080,FH=1080,REMOVE={id:'remove',kind:'remove',x:783,y:969,w:238,h:81};
function evt(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+key);N.events.emit('value',{engine:ID,key,value});}
function bt(text,fn,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});}
function ch(parent,x,y,val,size=44,role='given'){return N.chalkText(parent,x,y,String(val),{size,role});}
function ring(parent,x,y,role='op',r=17){return N.neonRing(parent,x,y,{role,r});}
function box(parent,x,y,w,h,role='op',r=22){return N.neonBox(parent,x,y,w,h,{role,r});}
function hoop(parent,x,y,r=107,role='op'){
 const p=`M${x-r} ${y} A${r} ${r} 0 1 0 ${x+r} ${y} A${r} ${r} 0 1 0 ${x-r} ${y}`;
 return N.neonPath(parent,p,{role,width:4});
}
function fmt(n){return Number(n.toFixed(5)).toString();}
function result(s){const q=Math.floor(s.units/s.divisor),r=s.units%s.divisor;return {q,r,quotient:fmt(q*s.unitValue),remainder:fmt(r*s.unitValue),groups:s.method==='sharing'?s.divisor:q,unitValue:s.unitValue};}
function target(s){const r=result(s);return s.method==='sharing'?r.q*s.divisor:r.q;}
function countProgress(s,p){return Math.max(0,Math.min(target(s),Math.floor(p||0)));}
function groupCount(s,p,idx){if(s.method==='sharing'){if(idx>=s.divisor)return 0;return Math.max(0,Math.ceil((p-idx)/s.divisor));}return idx<p?s.divisor:0;}
function status(s,p){const r=result(s),allocated=s.method==='sharing'?p:p*s.divisor,unplaced=s.units-allocated;
 return{...r,allocated,unplaced,complete:p===target(s),remainingAfterCompletion:r.r,progress:p};}
function interpret(s,quotient,remainder){let r=result(s),q=Number(quotient),rem=Number(remainder);
 if(!Number.isFinite(q)||!Number.isFinite(rem))return'Enter the quotient AND the remainder.';
 if(Math.abs(q-Number(r.quotient))<1e-8&&Math.abs(rem-Number(r.remainder))<1e-8)return'';
 if(q===s.divisor)return'Sharing: the divisor is how many groups we make, not automatically how many each receives. Grouping: count full groups, not the group size.';
 if(Math.abs(q-s.units/s.divisor*s.unitValue)<1e-8&&r.r)return'Only count complete groups. The leftover counters form the remainder.';
 if(rem===0&&r.r)return'Look for the amber counters left over. They have not disappeared.';
 if(rem===r.r&&s.unitValue===.1)return'Each counter is one tenth. Convert the remainder to its decimal value.';
 if(q===s.units*s.unitValue)return'Dividing does not leave the original amount unchanged. Count the completed hoops.';
 if(q===fmt(s.units/s.divisor)&&s.unitValue===.1)return'Each counter represents one tenth, not one whole. Include the unit value.';
 return s.method==='sharing'?'Count the counters in EACH hoop, then count any leftover counters.':'Count the FULL hoops, then count any leftover counters.';
}
window.F313_MATH={result,target,countProgress,groupCount,status,interpret};
const STEPS=[
 {name:'Start with a collection',phase:0,say:'start',narration:'We have twenty counters to share equally between four hoops. Division begins with equal groups.'},
 {name:'Deal one counter at a time',phase:1,say:'deal',narration:'Give each hoop one counter before starting the next round. Keep dealing in the same order.'},
 {name:'Equal groups are complete',phase:2,say:'equal',narration:'After five rounds, each of the four hoops has five counters. Twenty divided by four is five.'},
 {name:'Check for a remainder',phase:3,say:'rem',narration:'If there are counters that cannot make another equal round, set them aside as a remainder.'},
 {name:'Explain the division',phase:4,say:'done',narration:'Sharing asks how many in each group. Grouping asks how many groups we can make. Both can give the same division answer.'}
];
function sharePositions(k){let cols=Math.min(k,4),rows=Math.ceil(k/4);let xs=cols===4?[154,411,668,925]:cols===3?[214,540,866]:[330,750];let y=rows===1?[396]:[311,582];let ans=[];for(let i=0;i<k;i++)ans.push({x:xs[i%cols],y:y[Math.floor(i/cols)],r:cols===4?107:113});return ans;}
function groupedPositions(q){let cols=q>4?3:Math.min(2,q),xs=cols===3?[205,539,873]:cols===2?[304,777]:[539];let rows=Math.ceil(q/cols),ys=rows===1?[433]:rows===2?[304,571]:rows===3?[269,468,666]:[225,384,543,702];return Array.from({length:q},(_,i)=>({x:xs[i%cols],y:ys[Math.floor(i/cols)],r:cols===3?125:145}));}
function innerDots(n,cx,cy,r){const c=n<=4?2:n<=9?3:4,cols=Math.min(n,c),rows=Math.ceil(n/cols),gap=n>9?37:45,spots=[];
 for(let i=0;i<n;i++)spots.push({x:cx+(i%cols-(cols-1)/2)*gap,y:cy+(Math.floor(i/cols)-(rows-1)/2)*gap});return spots;}
function layoutShelf(n){const col=12,gap=70,x0=155,ys=[798,857,912];return Array.from({length:n},(_,i)=>({x:x0+(i%col)*gap,y:ys[Math.floor(i/col)]}));}
function draw(s,p,o={}){const r=result(s),st=status(s,p),sharing=s.method==='sharing';const svg=N.svg.root(FW,FH,sharing?`Sharing ${fmt(s.units*s.unitValue)} among ${s.divisor} equal hoops`:`Grouping ${fmt(s.units*s.unitValue)} into sets of ${fmt(s.divisor*s.unitValue)}`);svg.classList.add('f313-svg');svg.dataset.method=s.method;svg.dataset.progress=String(p);
 box(svg,60,37,960,128,'support',24);ch(svg,540,98,`${fmt(s.units*s.unitValue)} ÷ ${s.divisor} = ${o.reveal?st.quotient:'?'}`,58,'given');
 ch(svg,540,145,sharing?'How many in each hoop?':'How many full groups?',48,'focus');
 const places=sharing?sharePositions(s.divisor):groupedPositions(r.q);const zones=[];
 places.forEach((pt,i)=>{const cnt=groupCount(s,p,i),isActive=sharing?p<target(s)&&i===p%s.divisor:i===p&&p<r.q,drawn=sharing?cnt:s.divisor;
   if(!sharing){box(svg,pt.x-pt.r-16,pt.y-pt.r*.78-24,2*(pt.r+16),pt.r*1.58+48,'support',22);}
   if(sharing||p>i){const h=hoop(svg,pt.x,sharing?pt.y:pt.y-25,sharing?pt.r:76,p>i||cnt>0?'result':isActive?'focus':'op');if(o.interactive&&!sharing&&i===p-1){N.ui.svgDrag(svg,h,{box:{x:pt.x-95,y:pt.y-120,w:190,h:190},zones:()=>[REMOVE],onRemove:()=>o.remove()});}}
   const pts=innerDots(drawn,pt.x,sharing?pt.y:pt.y-25,pt.r);pts.forEach((xy,j)=>{const dot=ring(svg,xy.x,xy.y,sharing?'result':p>i?'result':'op',13);if(o.interactive&&sharing&&p>0&&i===(p-1)%s.divisor&&j===cnt-1){N.ui.svgDrag(svg,dot,{box:{x:xy.x-22,y:xy.y-22,w:44,h:44},zones:()=>[REMOVE],onRemove:()=>o.remove()});}if(o.animate&&sharing&&!N.reducedMotion()&&p>0){const index=j*s.divisor+i;setTimeout(()=>{if(dot.isConnected)N.motion.arrive(dot,0,155,490,N.motion.ease.spring);},Math.max(0,index)*36);}});
   ch(svg,pt.x,pt.y+(sharing?pt.r+41:98),sharing?`${i+1}: ${cnt}`:`Set ${i+1}`,48,p>i||cnt?'result':'given');
   if(isActive&&!o.challenge)hoop(svg,pt.x,sharing?pt.y:pt.y-25,sharing?pt.r+7:82,'focus');
   zones.push({id:'hoop-'+i,kind:'drop',x:pt.x-(sharing?118:pt.r),y:pt.y-(sharing?120:pt.r),w:sharing?236:pt.r*2,h:sharing?240:pt.r*2});
 });
 // The reserve tray and remainder are always separated visually: amber remains only when equal sets are complete.
 box(svg,65,724,950,225,'support',25);
 ch(svg,540,768,st.complete?(r.r?'Left over · remainder':'Every counter allocated'):sharing?'Counters still waiting':'Circle one full set',49,st.complete&&r.r?'focus':'given');
 const spare=sharing?st.unplaced:r.r,coords=layoutShelf(spare),isRem=st.complete&&r.r>0;
 coords.forEach((pt,i)=>{const g=E('g',{'data-counter':String(i)},svg);ring(g,pt.x,pt.y,isRem?'focus':'op',15);
   if(o.interactive&&sharing&&!st.complete&&i===0){N.ui.svgDrag(svg,g,{box:{x:pt.x-23,y:pt.y-23,w:46,h:46},zones:()=>[...zones,REMOVE],onDrop:id=>o.place(id),onRemove:()=>o.remove()});}
 });
 if(!sharing&&!st.complete){ // reusable lasso, parked below all source rows and offered for every unfilled group
   const gx=540,gy=873;const g=E('g',{'data-hoop-tool':'1'},svg);hoop(g,gx,gy,42,'focus');ch(g,gx,gy+10,'Set',48,'focus');
   if(o.interactive&&!st.complete){N.ui.svgDrag(svg,g,{box:{x:gx-51,y:gy-53,w:102,h:106},zones:()=>[...zones,REMOVE],onDrop:id=>o.place(id),onRemove:()=>o.remove()});}
 }
 box(svg,REMOVE.x,REMOVE.y,REMOVE.w,REMOVE.h,'error',14);ch(svg,902,1021,'Remove',48,'error');
 box(svg,71,969,689,81,st.complete?'result':'op',16);
 const proof=o.challenge&&!o.reveal?'Build, then answer':st.complete?`Quotient ${st.quotient} · Remainder ${st.remainder}`:sharing?`${p} dealt · ${spare} waiting`:`${p} groups · ${st.unplaced} waiting`;
 ch(svg,415,1020,proof,48,st.complete&&o.reveal?'result':'given');
 // Animation on the mathematical object, not only the prose.
 if(o.animate&&!N.reducedMotion()){const pt=sharing?places[(Math.max(1,p)-1)%s.divisor]:places[Math.max(0,Math.min(places.length-1,p-1))];N.motion.flash(svg,pt.x,pt.y,'result',37);}
 return svg;
}
function show(stage,s,p,o={}){
if(window.NovaLessonComponent?.active){[stage,s,p,o]=window.NovaLessonComponent.args("show",arguments);}
stage.innerHTML='';N.cap(stage,'Division Sharing and Grouping',o.caption||'Equal sets make division visible');const area=H('div',{class:'f313-scene'}),svg=draw(s,p,o),side=H('aside',{class:'f313-side'});
 side.append(N.neonCard([H('strong',{text:s.method==='sharing'?'Sharing':'Grouping'}),H('p',{text:s.method==='sharing'?'Equal groups are given. Count how many each receives.':'Group size is given. Count how many full groups fit.'})],{role:'op'}),N.neonCard([H('strong',{text:`${fmt(s.units*s.unitValue)} ÷ ${s.divisor}`}),H('p',{text:s.unitValue===0.1?'Each small counter is one tenth.':'Each bright counter is one whole unit.'})],{role:'focus'}));
 area.append(svg,side);stage.append(area);N.scene.helperStrip(stage,POSES[o.say||'explore']||'think',SPEECH[o.say||'explore']);return svg;}
function updateMode(s){s.units=Math.max(2,Math.min(36,Math.floor(+s.units||20)));s.divisor=Math.max(2,Math.min(6,Math.floor(+s.divisor||4)));s.unitValue=s.unitValue===0.1?0.1:1;s.method=s.method==='grouping'?'grouping':'sharing';if(s.method==='grouping'&&Math.floor(s.units/s.divisor)>6)s.units=6*s.divisor;return s;}
function controls(panel,stage,start,challenge=false,api=null,roundLabel=''){let s=updateMode({...start}),p=0,said='ready',feedback='Place counters or a hoop. Use the buttons for keyboard access.',bad=false,won=false,answerQ='',answerR='';const preset=H('select',{'aria-label':'Choose preset'}),units=H('input',{type:'number',min:2,max:36,'aria-label':'Number of counters'}),divisor=H('input',{type:'number',min:2,max:6,'aria-label':'Number of hoops or group size'}),method=H('select',{'aria-label':'Sharing or grouping'}),targetSelect=H('select',{'aria-label':'Target hoop'}),qInput=H('input',{type:'number',step:'any','aria-label':'Quotient'}),remInput=H('input',{type:'number',step:'any','aria-label':'Remainder'}),statusEl=H('p',{class:'f313-status',role:'status'});
 Object.entries(C.presets).forEach(([k,v])=>preset.add(new Option(v.label,k)));[['sharing','Sharing'],['grouping','Grouping']].forEach(([k,v])=>method.add(new Option(v,k)));
 function note(msg,kind='explore',err=false){feedback=msg;said=kind;bad=err;}
 function reset(){p=0;won=false;answerQ='';answerR='';evt('reset',true);note('Build equal groups. Watch what is left over.','explore');render();}
 function place(id){if(won||p>=targetCount())return false;const i=Number(String(id).split('-')[1]);if(!Number.isInteger(i))return false;
  const expected=s.method==='sharing'?p%s.divisor:p;
  if(i!==expected){note(s.method==='sharing'?'Share in rounds: give each hoop one before returning to the first.':'Place the hoop around the next complete set.','wrong',true);render();return false;}
  p++;evt('place',{method:s.method,group:i,progress:p});note(p===targetCount()?'All full groups complete. Check the remainder.':s.method==='sharing'?'One counter shared!':'One full set collected!',p===targetCount()?'rem':'right');render();return true;}
 function targetCount(){return target(s);}
 function remove(){if(p<=0||won)return false;p--;evt('remove',p);note('One move taken back.','undo');render();return true;}
 function step(){const id='hoop-'+(s.method==='sharing'?p%s.divisor:p);return place(id);}
 function check(){answerQ=qInput.value;answerR=remInput.value;evt('answer',{quotient:answerQ,remainder:answerR});if(p!==targetCount()){note('Complete all equal groups first.','wrong',true);api?.check(false,feedback);render();return false;}
  let err=interpret(s,answerQ,answerR);if(err){note(err,'wrong',true);api?.check(false,err);render();return false;}
  won=true;evt('proof',{...result(s),method:s.method});note('Both the quotient and the remainder are correct!','win');api?.check(true,feedback,{...result(s),method:s.method});render();return true;}
 function hint(){const r=result(s),msg=s.method==='sharing'?`Divide the ${s.units} counters between ${s.divisor} hoops, one at a time.`:`Circle full sets of ${s.divisor} counters. Any extras are remainders.`;evt('hint',msg);api?.hint(msg);note(msg,'hint');render();}
 function render(){panel.innerHTML='';show(stage,s,p,{caption:challenge?roundLabel:`${s.method==='sharing'?'Sharing':'Grouping'} · ${fmt(s.units*s.unitValue)} ÷ ${s.divisor}`,say:said,interactive:!won,challenge,reveal:won,place,remove});
  preset.value=Object.entries(C.presets).find(([k,v])=>JSON.stringify(v.units)+v.method+v.divisor+v.unitValue===JSON.stringify(s.units)+s.method+s.divisor+s.unitValue)?.[0]||C.preset;
  units.value=s.units;divisor.value=s.divisor;method.value=s.method;let groups=s.method==='sharing'?s.divisor:result(s).q;
  targetSelect.innerHTML='';for(let i=0;i<groups;i++)targetSelect.add(new Option(s.method==='sharing'?`Hoop ${i+1}`:`Set ${i+1}`,`hoop-${i}`));targetSelect.value=`hoop-${s.method==='sharing'?Math.min(s.divisor-1,p%s.divisor):Math.min(groups-1,p)}`;
  if(!challenge)panel.append(H('div',{class:'f313-row'},[H('label',{},['Preset',preset]),H('label',{},['Counters',units]),H('label',{},['Divisor',divisor]),H('label',{},['Method',method])]));
  panel.append(H('p',{class:'f313-hint',text:challenge?'Build the groups, then enter a quotient and remainder. Each counter is worth '+(s.unitValue===0.1?'one tenth.':'one whole.'):`${s.method==='sharing'?'Drag a counter into each hoop, in turn.':'Drag the lasso to circle each full set.'} Red Remove tray takes one move back. Each counter = ${s.unitValue===0.1?'0.1':'1'}.`}),
   H('div',{class:'f313-row'},[H('label',{},['Next target',targetSelect]),bt(s.method==='sharing'?'Deal one':'Make one group',()=>place(targetSelect.value),true),bt('Undo',remove),bt('Reset',reset),bt('Hint',hint)]));
  const st=status(s,p);panel.append(H('div',{class:'f313-readout'},[H('span',{text:s.method==='sharing'?`${p} dealt`:`${p} full groups`}),H('span',{text:`${st.unplaced} counters waiting`}),H('span',{text:`${st.complete?'Remainder '+st.remainder:'Keep building'}`})]));
  if(challenge&&!won){qInput.value=answerQ;remInput.value=answerR;panel.append(H('div',{class:'f313-row'},[H('label',{},['Quotient',qInput]),H('label',{},['Remainder',remInput]),bt('Check proof',check,true)]));qInput.oninput=()=>answerQ=qInput.value;remInput.oninput=()=>answerR=remInput.value;}
  if(won)panel.append(H('div',{class:'f313-win',text:'Proof complete! '+fmt(s.units*s.unitValue)+' ÷ '+s.divisor+' = '+st.quotient+(st.r?` remainder ${st.remainder}`:'')+'.'}));
  statusEl.textContent=feedback;statusEl.classList.toggle('bad',bad);panel.append(statusEl);
  preset.onchange=()=>{s=updateMode({...C.presets[preset.value]});evt('preset',preset.value);reset();};units.onchange=()=>{s.units=+units.value;updateMode(s);evt('units',s.units);reset();};divisor.onchange=()=>{s.divisor=+divisor.value;updateMode(s);evt('divisor',s.divisor);reset();};method.onchange=()=>{s.method=method.value;updateMode(s);evt('method',s.method);reset();};
 }
 render();return {step,place,remove,check,progress:()=>p,expected:()=>result(s),complete:()=>won};}
const def={id:ID,title:'Division Sharing and Grouping',config:C,steps:STEPS,
 alt:'Two division models: sharing sends individual neon counters into equal hoops; grouping places a neon lasso around complete equal sets. Amber counters show a remainder.',
 staticAlt:'Twenty shared into four equal hoops gives five in each. Twenty-six grouped into fours gives six complete groups and two left over.',
 render(i,stage){const s=C.presets['Y7-010-Share'];const progress=[0,1,12,20,20][i];show(stage,s,progress,{caption:STEPS[i].name,say:STEPS[i].say,reveal:i===4,animate:i>0});},
 exploreIntro:'Share counters or make equal groups; count full sets, then find any remainder.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();controls(panel,stage,C.presets[C.preset]);},
 challenge(panel,api,stage){let index=0,done=false;function next(){panel.innerHTML='';if(done){const s=C.challenge.at(-1);show(stage,s,target(s),{caption:'All three proofs completed',say:'win',reveal:true});panel.append(H('div',{class:'f313-win',text:'All three division proofs complete: sharing, grouping with remainder, and division using tenths.'}));return;}
 const task=C.challenge[index];panel.append(H('p',{class:'f313-hint',text:`Proof ${index+1} of ${C.challenge.length} · ${task.method==='sharing'?'Sharing':'Grouping'} · ${fmt(task.units*task.unitValue)} ÷ ${task.divisor}`}));const inner=H('div');panel.append(inner);
 const roundApi={hint:api.hint.bind(api),check(ok,msg,extra){api.check(ok,msg,{round:index,...extra});if(ok){index++;done=index>=C.challenge.length;Promise.resolve().then(next);}}};controls(inner,stage,task,true,roundApi,`Proof ${index+1} of ${C.challenge.length}`);
 }next();},onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['sharing','grouping','division','quotient','remainder','decimal division'],deps:['F0-02','F0-03','F0-04','F0-08','F3-01','F3-03']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"show":["stage","s","p","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'13',title:'Division Sharing and Grouping · Premium Review',def,linked:['F3-01','F3-03','F3-09'],years:'Year 7 · Division of whole numbers and decimals',spec:{
 purpose:'Connect two distinct division interpretations: number in each equal share and number of full groups; keep the remainder visible.',
 params:'2–36 counters; divisors 2–6; sharing or grouping; units of one or one tenth.',
 presets:'Y7-010 sharing, grouping, remainder and decimal-tenths demonstrations.',
 steps:'Start collection → staggered deal → equal groups complete → remainder set aside → quotient and remainder.',
 interactions:'Drag counters to sharing hoops, drag a lasso around grouping sets, keyboard place/undo/check, reject wrong targets, spring back and remove.',
 traps:'Do not confuse number of groups with number in each; do not ignore remainder; count decimal tenths at the correct place value.',
 gcse:'Division structures extend to rational-number and algebraic models.'}});
// Recover rapid movement when F0 reorders SVG draggable elements and pointer capture is lost. Do not edit the core.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA maths helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{subtree:true,childList:true});
})();
