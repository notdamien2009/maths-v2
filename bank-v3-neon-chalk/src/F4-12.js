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

/* NOVA F4-12 Rates Tape Diagram · Run 11. All drawing and dragging through canonical NOVA F0/F2 core. */
const F412_CONFIG={id:'F4-12',startMode:'watch',preset:'Y8-041',parameters:{maxUnits:6,minUnits:1,positiveRate:true,decimalPlaces:2},
 presets:{
  'Y8-041':{label:'Y8-041 · Find the speed',kind:'rate',units:3,rate:50,total:150,u:'h',q:'km',rateUnit:'km/h',context:'A train covers 150 km in 3 hours. What is its average speed in kilometres per hour?',lesson:'Y8-041'},
  'DIST-4H':{label:'Distance · 65 km/h for 4 hours',kind:'amount',units:4,rate:65,total:260,u:'h',q:'km',rateUnit:'km/h',context:'A coach travels at 65 km/h for 4 hours. How far does it travel?'},
  'TIME-210':{label:'Time · 210 km at 70 km/h',kind:'units',units:3,rate:70,total:210,u:'h',q:'km',rateUnit:'km/h',context:'A vehicle covers 210 km at an average speed of 70 km/h. How many hours did the journey take?'},
  'SPEED-DECIMAL':{label:'Rate · 7.5 km in 3 hours',kind:'rate',units:3,rate:2.5,total:7.5,u:'h',q:'km',rateUnit:'km/h',context:'A walker covers 7.5 km in 3 hours. How many kilometres are travelled each hour?'}
 },
 challenge:[
  {label:'Find a rate from a total',kind:'rate',units:3,rate:60,total:180,u:'h',q:'km',rateUnit:'km/h',context:'A van drives 180 km in 3 hours. Find its speed.'},
  {label:'Find a total from a rate',kind:'amount',units:4,rate:55,total:220,u:'h',q:'km',rateUnit:'km/h',context:'A car travels at 55 km/h for 4 hours. Find the distance.'},
  {label:'Find the number of units',kind:'units',units:3,rate:80,total:240,u:'h',q:'km',rateUnit:'km/h',context:'A lorry travels 240 km at 80 km/h. How long does the journey take?'}
 ],events:{value:['preset','ratePlaced','rateRemoved','divider','answer','check','reset'],types:['step','correct','hintUsed','mode']}};
window.F412_CONFIG=F412_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F412_CONFIG),ID=C.id;
const btn=(txt,fn,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text:txt,onclick:fn});
function chalk(p,x,y,s,size=42,role='given'){return N.chalkText(p,x,y,String(s),{size,role});}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' value '+key);N.events.emit('value',{engine:ID,key,value});}
function round2(n){return Math.round((n+Number.EPSILON)*100)/100;}
function pretty(n){return Number.isInteger(n)?String(n):round2(n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');}
function math(o){if(!Number.isInteger(o.units)||o.units<1||o.units>6||!Number.isFinite(o.rate)||o.rate<=0||!Number.isFinite(o.total)||Math.abs(o.units*o.rate-o.total)>1e-8)throw Error('Bad rate-tape numbers');
 return {unitRate:o.total/o.units,units:o.units,total:o.total,answer:o.kind==='rate'?o.rate:o.kind==='amount'?o.total:o.units};}
function misconception(o,x){if(!Number.isFinite(x)||x<=0)return 'Use a positive number for a rate, distance or time.';
 if(o.kind==='rate'){
  if(Math.abs(x-o.total*o.units)<.00001)return 'That multiplies distance by hours. Speed means distance for ONE hour: divide by the number of hours.';
  if(Math.abs(x-o.total)<.00001)return 'That is the total distance, not the distance covered in one hour.';
  return `The ${pretty(o.total)} ${o.q} is spread evenly across ${o.units} one-${o.u} sections. Divide, rather than copy the total into each section.`;
 }
 if(o.kind==='amount'){
  if(Math.abs(x-o.rate+o.units)<.00001)return 'Adding a rate to a number of hours mixes different units. Copy the distance for ONE hour into EVERY section.';
  if(Math.abs(x-o.rate)<.00001)return `That is the distance for one ${o.u}, not all ${o.units} ${o.u}.`;
  return `Each ${o.u} adds ${pretty(o.rate)} ${o.q}. Count ${o.units} equal sections and multiply the rate by the number of units.`;
 }
 if(Math.abs(x-o.total*o.rate)<.00001)return 'To find time, divide the total distance by the distance for ONE hour; do not multiply them.';
 if(Math.abs(x-o.total)<.00001)return 'That is the distance in kilometres, not the number of hours.';
 return `How many groups of ${pretty(o.rate)} ${o.q} fit into ${pretty(o.total)} ${o.q}? Divide distance by speed.`;
}
function validate(o,raw,ratePlaced,count){if(String(raw).trim()==='')return {ok:false,kind:'empty',message:'Enter the unknown rate, distance or time first.'};
 const x=Number(raw),m=math(o);if(!Number.isFinite(x)||x<=0||Math.abs(x*100-Math.round(x*100))>1e-6)return {ok:false,kind:'format',message:'Enter a positive number with at most two decimal places.'};
 if(Math.abs(x-m.answer)>0.005)return {ok:false,kind:'math',message:misconception(o,x)};
 if(!ratePlaced)return {ok:false,kind:'rate',message:'That number is correct. Now physically place the one-unit rate onto the matching distance tape.'};
 if(count!==o.units)return {ok:false,kind:'divider',message:`Use the divider to show ${o.kind==='units'?'the correct number of one-hour sections':'the time interval stated in the problem'}. Each distance section must match one time section.`};
 return {ok:true,kind:'proved',message:`Correct. ${pretty(o.total)} ${o.q} ÷ ${o.units} ${o.u} = ${pretty(o.rate)} ${o.rateUnit}. The aligned tapes show ${o.units} equal unit pairs.`};}
window.F412_MATH={math,pretty,misconception,validate};
const helper={start:['explain','Compare the tapes!'],time:['point','Count equal hours!'],rate:['show-one','Find one unit!'],fill:['count','Repeat the rate!'],total:['point-down','Add each section!'],equation:['idea','Join the evidence!'],proof:['celebrate','The tapes agree!'],explore:['ruler','Try the tape!'],ready:['think','Your turn!'],placed:['point','Snapped into place!'],wrong:['not-yet','Check one unit!'],right:['celebrate','Good rate thinking!'],hint:['idea','Find the unit rate!'],remove:['oops','Try another go!']};
function mascot(stage,key){
if(window.NovaLessonComponent?.active){[stage,key]=window.NovaLessonComponent.args("mascot",arguments);}
const x=helper[key]||helper.ready;N.scene.helperStrip(stage,x[0],x[1]);}
function card(label,value,description,role='given'){return N.neonCard([H('p',{class:'f412-label',text:label}),H('p',{class:'f412-value',text:value}),H('p',{class:'f412-help',text:description})],{role});}
function drag(svg,el,opts){N.ui.svgDrag(svg,el,opts);el.addEventListener('pointerdown',ev=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(ev.pointerId);}catch(_){}}});}
const G={w:1000,h:935,x:126,yTime:252,yDist:465,width:753,barH:108,slotX:137,slotY:606,returnX:731,returnY:744};
function scene(o,v){const m=math(o),interactive=!!v.interactive&&!v.won,step=v.step??6,reveal=!!v.won||(!v.interactive&&step>=6),count=interactive?(v.count||2):o.units;
 const cells=interactive?count:step<=0?1:step===1?1:o.units,oneWidth=G.width/Math.max(1,cells),unknown=o.kind;
 const svg=N.svg.root(G.w,G.h,'Two precisely aligned tapes show how each one-hour time cell corresponds to an equal distance cell. A movable unit-rate chip connects one hour to its distance, and the divider adjusts the number of units.');
 svg.classList.add('f412-svg');if(window.innerWidth<=760)svg.setAttribute('viewBox','106 0 794 935');svg.dataset.mode=v.task?'challenge':interactive?'explore':'watch';svg.dataset.count=String(count);svg.dataset.ratePlaced=String(!!v.ratePlaced);svg.dataset.won=String(!!v.won);
 chalk(svg,500,66,'ONE UNIT GIVES HOW MUCH?',50,'given');
 chalk(svg,500,126,o.kind==='rate'?'DISTANCE ÷ TIME = RATE':o.kind==='amount'?'RATE × TIME = DISTANCE':'DISTANCE ÷ RATE = TIME',42,'op');
 chalk(svg,G.x+G.width/2,207,`TIME  ·  EACH BOX IS 1 ${o.u}`,41,'given');
 // Each block and subdivision is a core neonBox; no custom SVG line/arrow/filter is invented.
 for(let i=0;i<cells;i++){
  const x=G.x+i*oneWidth;
  const showTime=!(interactive&&unknown==='units')||reveal;
  const timeRole=i===0?'given':'focus';
  const a=N.neonBox(svg,x+3,G.yTime,oneWidth-6,G.barH,{role:timeRole,r:12});
  if(!interactive&&step===2&&i>0)N.motion.arrive(a,0,23);
  chalk(svg,x+oneWidth/2,G.yTime+71,showTime?`1 ${o.u}`:'?',Math.max(32,Math.min(49,300/Math.max(cells,1))),showTime?'given':'unknown');
 }
 // Core neon path proof indicates matching cell boundaries across the two tapes.
 for(let i=0;i<=cells;i++){const x=G.x+i*oneWidth;if((!interactive&&step>=2)||interactive)N.neonPath(svg,`M${x},${G.yTime+G.barH+12} v23`,{role:'op',width:2});}
 chalk(svg,500,428,`DISTANCE  ·  MATCH EACH ${o.u} TO ITS ${o.q}`,40,'given');
 if(interactive||step>=3){for(let i=0;i<cells;i++){
   const x=G.x+i*oneWidth,a=N.neonBox(svg,x+3,G.yDist,oneWidth-6,G.barH,{role:i===0?'focus':'given',r:12});
   if(!interactive&&step===4&&i>0)N.motion.arrive(a,0,25);
   const showRate=reveal||(interactive&&unknown!=='rate'&&v.ratePlaced)||(!interactive&&step>=4);
   const txt=showRate?`${pretty(o.rate)} ${o.q}`:'?';
   const fs=Math.max(28,Math.min(46,260/Math.max(cells,1)));
   chalk(svg,x+oneWidth/2,G.yDist+69,txt,fs,showRate?'focus':'unknown');
  }}
 chalk(svg,500,625,interactive?'Drop the rate in the first box':(step>=5?'Distance = rate × time':'Match each hour to its distance'),37,'given');
 if(interactive){
  // Drop zone for a real one-unit value on the first distance unit.
  const zRate={x:G.x+5,y:G.yDist+3,w:Math.max(130,oneWidth-10),h:G.barH-3,id:'rate',kind:'drop'};
  const red={x:G.returnX,y:G.returnY,w:160,h:83,id:'remove',kind:'remove'};
  N.neonBox(svg,red.x,red.y,red.w,red.h,{role:'error',r:13});chalk(svg,red.x+80,red.y+54,'RETURN',36,'error');
  const hasInput=String(v.raw||'').trim()!=='';
  const canChip=o.kind!=='rate'||hasInput;
  if(canChip){const placed=!!v.ratePlaced,from=placed?{x:zRate.x+12,y:zRate.y+13,w:Math.max(100,zRate.w-24),h:80}:{x:G.slotX,y:G.returnY,w:248,h:82};
   const label=o.kind==='rate'?`${hasInput?pretty(Number(v.raw)):'?'} ${o.rateUnit}`:`${pretty(o.rate)} ${o.rateUnit}`;
   const tile=E('g',{class:'f412-drag',role:'button',tabindex:'0','data-item':'rate','data-placed':String(placed),'aria-label':'Unit-rate chip. '+(placed?'Press Delete or drag to red Return.':'Press Enter or drag to first distance cell.')},svg);
   N.neonBox(tile,from.x,from.y,from.w,from.h,{role:'op',r:11});chalk(tile,from.x+from.w/2,from.y+from.h/2+15,label,35,'op');
   drag(svg,tile,{box:from,zones:()=>[placed?red:zRate],onDrop:id=>{if(id!=='rate')return false;Promise.resolve().then(()=>v.onRate(true));return true;},onRemove:()=>Promise.resolve().then(()=>v.onRate(false)),removeTo:{x:red.x+80,y:red.y+42}});
   tile.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!placed){e.preventDefault();v.onRate(true);}if((e.key==='Backspace'||e.key==='Delete')&&placed){e.preventDefault();v.onRate(false);}});
  }else chalk(svg,G.slotX+125,G.returnY+27,'ENTER RATE',38,'unknown');
  // A physical divider is a mathematical tool: its six valid target positions encode how many equal unit cells are required.
  const n=Math.min(6,Math.max(1,count)),px=G.x+G.width;const div=E('g',{class:'f412-drag',role:'slider',tabindex:'0','data-item':'divider','aria-label':`Number of equal one-hour sections: ${n}. Drag to one of six numbered positions, or use left/right arrows.`,'aria-valuemin':'1','aria-valuemax':'6','aria-valuenow':String(n)},svg);
  N.neonBox(div,440,647,128,69,{role:'unknown',r:12});chalk(div,504,689,`${n} ${o.u}`,42,'unknown');
  const dz=[];for(let k=1;k<=6;k++){dz.push({x:105+(k-1)*128,y:835,w:122,h:65,id:'n'+k,kind:'drop'});}
  for(let k=1;k<=6;k++){chalk(svg,166+(k-1)*128,881,String(k),36,k===n?'result':'given');}
  drag(svg,div,{box:{x:440,y:647,w:128,h:69},zones:()=>dz,onDrop:id=>{if(!/^n[1-6]$/.test(id))return false;Promise.resolve().then(()=>v.onCount(Number(id.slice(1))));return true;}});
  div.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const to=e.key==='Home'?1:e.key==='End'?6:Math.max(1,Math.min(6,n+(e.key==='ArrowLeft'?-1:1)));v.onCount(to);}});
  chalk(svg,405,811,'UNITS 1–6',38,'given');
  // Responsive physical targets are in drawing coordinates and never overlap the model or mascot row.
 }else if(reveal){const eq=unknown==='rate'?`${pretty(o.total)} ÷ ${o.units} = ${pretty(o.rate)} ${o.rateUnit}`:unknown==='amount'?`${pretty(o.rate)} × ${o.units} = ${pretty(o.total)} ${o.q}`:`${pretty(o.total)} ÷ ${pretty(o.rate)} = ${o.units} ${o.u}`;
   chalk(svg,500,702,eq,45,'result');N.neonRing(svg,500,774,{role:'result',r:20});chalk(svg,500,846,'THE UNITS MATCH',37,'result');
 }else if(step>=4)chalk(svg,500,715,'CAN YOU SEE EACH ONE-UNIT SHARE?',36,'op');
 return svg;
}
function present(stage,o,v){
if(window.NovaLessonComponent?.active){[stage,o,v]=window.NovaLessonComponent.args("present",arguments);}
stage.innerHTML='';N.cap(stage,'Rates · unit-to-unit tape',v.task?'CHALLENGE':v.interactive?'UNIT RATE WORKSHOP':v.heading||'Read · Copy · Prove');
 const wrap=H('div',{class:'f412-layout'}),art=H('div',{class:'f412-art'}),side=H('div',{class:'f412-side'});art.append(scene(o,v));
 const visible=!!v.won||(!v.interactive&&(v.step??0)>=6),one=o.kind==='rate'&&!visible?'?':`${pretty(o.rate)} ${o.rateUnit}`,time=o.kind==='units'&&!visible?'?':`${o.units} ${o.u}`,distance=o.kind==='amount'&&!visible?'?':`${pretty(o.total)} ${o.q}`;
 side.append(card('TIME · FIRST TAPE',time,'One equal hour in each upper section',o.kind==='units'&&!visible?'unknown':'given'));
 side.append(card('RATE · PER ONE UNIT',one,'Distance travelled during just one hour',o.kind==='rate'&&!visible?'unknown':'focus'));
 side.append(card('TOTAL · SECOND TAPE',distance,'Rate multiplied by the number of hours',o.kind==='amount'&&!visible?'unknown':'result'));
 wrap.append(art,side);stage.append(wrap);mascot(stage,v.pose||'ready');
}
const STEPS=[
 {name:'Read the two quantities',narration:'Speed connects distance and time. Read both quantities with their units before calculating.',prompt:'What is measured in hours, and what is measured in kilometres?'},
 {name:'One time unit',narration:'One upper section means one hour. Every section must represent the same time.',prompt:'What does one equal time section represent?'},
 {name:'Copy equal time units',narration:'The three hours make three equal sections, each one hour wide.',prompt:'Why should all three time sections be equal?'},
 {name:'Match the distance tape',narration:'Draw the distance tape directly underneath. Each distance box matches one hour above.',prompt:'What must be true about matching time and distance divisions?'},
 {name:'Find the distance for one hour',narration:'Share one hundred and fifty kilometres across three hours. Each hour represents fifty kilometres.',prompt:'What division gives the distance in one hour?'},
 {name:'Read the complete tape',narration:'Three copies of fifty kilometres give a total of one hundred and fifty kilometres.',prompt:'How can we check the unit rate by multiplication?'},
 {name:'Generalise the unit rate',narration:'Speed equals distance divided by time. One hundred and fifty divided by three gives fifty kilometres per hour.',prompt:'Why is the unit kilometres per hour?'}
];
function workshop(panel,stage,task,api){let o={...(task||C.presets[C.preset])},raw='',ratePlaced=false,count=o.kind==='units'?2:o.units,won=false,feedback='Use equal time sections. Find the unit rate and connect the tapes.',pose='ready';
 function update(t,p='ready'){feedback=t;pose=p;redraw();}
 function onCount(v){if(won)return;count=Math.max(1,Math.min(6,Number(v)));ratePlaced=false;emit('divider',count);update(`${count} equally-sized time and distance cells are shown. Compare with the given information.`,'time');}
 function onRate(value){if(won)return false;if(value&&o.kind==='rate'&&!String(raw).trim()){update('Calculate the unit rate before placing its chip.','wrong');return false;}ratePlaced=value;emit(value?'ratePlaced':'rateRemoved',{rate:o.kind==='rate'?Number(raw):o.rate,placed:value});update(value?'The unit-rate chip connects one hour to one matching distance cell.':'The rate chip returned to the tray.',value?'placed':'remove');return true;}
 function check(){const res=validate(o,raw,ratePlaced,count);emit('check',{ok:res.ok,kind:res.kind});api?.check(res.ok,res.message);if(res.ok){won=true;update(res.message,'right');}else update(res.message,'wrong');return res.ok;}
 function hint(){const t=o.kind==='rate'?'Divide total distance by the number of hours to find one hour.':o.kind==='amount'?'Copy the one-hour distance once for each hour, then add or multiply.':'Count how many groups of the one-hour distance fit into the total distance.';api?.hint(t);update(t,'hint');}
 function reset(){raw='';ratePlaced=false;count=o.kind==='units'?2:o.units;won=false;emit('reset',true);update('New attempt. Identify one unit before changing the tape.','ready');}
 function select(id){if(!C.presets[id])return;C.preset=id;o={...C.presets[id]};emit('preset',id);reset();}
 function redraw(){panel.innerHTML='';present(stage,o,{interactive:!won,task:!!task,won,ratePlaced,raw,count,pose,onRate,onCount});
 if(!task){const sel=H('select',{'aria-label':'Choose rates tape example'});Object.entries(C.presets).forEach(([k,p])=>sel.add(new Option(p.label,k)));sel.value=C.preset;sel.onchange=()=>select(sel.value);panel.append(H('label',{class:'f412-field'},['Example / lesson preset',sel]));}
 panel.append(H('p',{class:'f412-prompt',text:o.context}));
 if(!won){const lab=o.kind==='rate'?`Unknown speed (${o.rateUnit})`:o.kind==='amount'?`Unknown distance (${o.q})`:`Unknown time (${o.u})`;
  const input=H('input',{type:'number',step:'0.01',min:'0',value:raw,'aria-label':lab});input.oninput=e=>{raw=e.target.value;emit('answer',raw);ratePlaced=false;};input.onchange=e=>{raw=e.target.value;ratePlaced=false;update('Answer recorded. Place the unit-rate chip on its distance cell.','ready');};
  const row=H('div',{class:'f412-controls'});row.append(H('label',{class:'f412-field'},[lab,input]));
  if(o.kind==='units'){const sel=H('select',{'aria-label':'Number of unit divisions'});for(let k=1;k<=6;k++)sel.add(new Option(`${k} equal time sections`,String(k)));sel.value=String(count);sel.onchange=()=>onCount(Number(sel.value));row.append(H('label',{class:'f412-field'},['Number of time sections',sel]));}
  panel.append(row);
  panel.append(H('div',{class:'f412-controls'},[btn(ratePlaced?'Return rate chip':'Place rate chip',()=>onRate(!ratePlaced)),btn('Check my tape',check,true),btn('Hint',hint),btn('Reset',reset)]));
  panel.append(H('p',{class:'f412-note',text:'Drag the one-unit rate chip to the first distance cell. Its target glows green. Drag back to red RETURN or press Delete to remove. Move the gold unit divider to numbered drop zones or use its arrow keys. Both units and the calculated answer must agree.'}));
 }else panel.append(H('p',{class:'f412-done',text:'The matching time and distance tapes, the unit-rate chip, and the calculation have all been proved.'}));
 panel.append(H('p',{class:'f412-status'+(pose==='wrong'?' bad':pose==='right'?' good':''),role:'status',text:feedback}));
 }
 redraw();return {select,onRate,onCount,check,reset,hint,setAnswer:s=>{raw=String(s);ratePlaced=false;redraw();},state:()=>({o,raw,count,ratePlaced,won})};
}
const def={id:ID,title:'Rates Tape Diagram',config:C,steps:STEPS,
 alt:'Two aligned neon-glass tapes. The upper tape divides time into one-hour units. Equal divisions in the lower tape prove distance per hour; a draggable rate chip connects the two quantities.',
 staticAlt:'150 km in 3 hours. 150 ÷ 3 = 50 km for each hour. Rate = 50 km/h. At 65 km/h for 4 hours, the distance is 260 km.',
 render(i,stage){present(stage,C.presets['Y8-041'],{step:i,pose:['start','time','time','rate','fill','total','proof'][i],heading:STEPS[i].name});},
 exploreIntro:'Choose a speed, distance or time context and demonstrate the relationship using corresponding tape segments.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();window.F412_WORKSHOP=workshop(panel,stage,null,null);},
 challenge(panel,api,stage){let idx=0;function next(){panel.innerHTML='';if(idx>=C.challenge.length){present(stage,C.presets['Y8-041'],{step:6,won:true,pose:'right',heading:'All rates proved'});panel.append(H('p',{class:'f412-done',text:'All three rate, distance and time problems have been proved with matching unit tapes.'}));return;}
  if(idx>0){api.fb.textContent='';api.fb.className='nova-fb';api.bob('Match the units before calculating.',{mood:'think'});}
  const o={...C.challenge[idx]};panel.append(H('p',{class:'f412-prompt',text:`Challenge ${idx+1} of ${C.challenge.length} · ${o.label}`}));const slot=H('div');panel.append(slot);
  const proxy={hint:s=>api.hint(s),check:(ok,s)=>{api.check(ok,s,{challenge:idx+1});if(ok)Promise.resolve().then(()=>slot.append(H('div',{class:'f412-next'},[btn(idx+1<C.challenge.length?'Next problem →':'Finish challenges →',()=>{idx++;next();},true)])));}};
  window.F412_WORKSHOP=workshop(slot,stage,o,proxy);
 }next();}
};
N.registry.add({id:ID,title:'Rates Tape Diagram',topics:['rate','speed','distance','time','compound measures'],deps:['F0-01','F0-02','F0-08','F4-07','F18-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"mascot":["stage","key"],"present":["stage","o","v"]},exploreFields:{}});
N.bankMount({id:ID,num:'12',title:'Rates Tape Diagram · Run 11 Review',def,years:'Year 8 · Speed (Y8-041), Year 9 / GCSE speed–distance–time reasoning',linked:['F4-07','F18-08','F18-02'],spec:{purpose:'Show distance travelled per equal unit of time, and relate speed, distance and time using two genuinely aligned tapes.',params:'1–6 whole-hour divisions, rates up to 100 km/h (sample contexts), positive distances and two-decimal values.',presets:'Y8-041 150 km in 3 hours; distance 65 km/h ×4 h; time 210 km ÷ 70 km/h; decimal speed 7.5 km ÷ 3 h.',steps:'Read quantities → one hour → copy equal time units → align distance → determine one-hour rate → read the whole → generalise.',interactions:'F2 svgDrag one-unit chip into first distance section, red return tray, movable numbered unit-divider target (1–6) and keyboard equivalents; answer input and checking.',traps:'Confusing total distance with a unit rate; adding rate to time instead of multiplying; multiplying when finding time; mixing units.',gcse:'Speed–distance–time as a compound unit and conversion to further rates.'}});
const root=document.getElementById(ID);if(root){const dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(e=>dev.append(e));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});}
})();
