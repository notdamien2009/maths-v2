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

/* NOVA F16-06 · Dot Plot and Averages. All stage art and interactions use the embedded F0/F2 core. */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,S=NOVA.svg,M=NOVA.motion,ID='F16-06';
const C=window.NovaV2Integration.configuration(window.NOVA_F16_06_CONFIG={preset:'y7-stems',events:['value','step','mode','hintUsed','correct'],presets:{
 'y7-stems':{lesson:'Y7-068',label:'Y7-068 · Read a dot plot',title:'Quiz marks · each dot is one pupil',context:'How do we show repeated scores without losing any?',A:[2,3,3,4,4,4,5,6,6,7,7,8]},
 'y7-averages':{lesson:'Y7-069',label:'Y7-069 · Mean, median, mode, range',title:'Scores in a maths challenge',context:'Read the centre and spread from eleven results.',A:[2,3,4,4,5,6,6,6,7,8,9]},
 'y7-compare':{lesson:'Y7-070',label:'Y7-070 · Compare two distributions',title:'Training results · Teams A and B',context:'Compare two groups using their centres and spread.',A:[3,4,4,5,5,6,6,7,7,8],B:[2,3,4,4,5,5,5,6,7,9]},
 'y8-compare':{lesson:'Y8-069',label:'Y8-069 · Averages and spread',title:'Two science investigations',context:'Which class has the more consistent results?',A:[4,5,5,6,6,6,7,7,8,9,9],B:[3,4,4,5,5,6,6,7,7,8,10]},
 'y9-outliers':{lesson:'Y9-048',label:'Y9-048 · Averages, spread, outliers',title:'Journeys to school · minutes',context:'One very long journey affects the average.',A:[2,3,3,4,4,4,5,5,6,6,12]},
 'y9-compare':{lesson:'Y9-049',label:'Y9-049 · Evidence-based comparison',title:'Reading challenge · two groups',context:'Use centre, range and unusual values to justify a comparison.',A:[4,5,6,6,7,7,8,8,9],B:[1,3,4,6,6,8,9,10,11]}
 }});
const STEPS=[
 {name:'Collect the original observations',pose:'count',narration:'Each number is one observation. Do not discard repeated values.',prompt:'Which values repeat?'},
 {name:'Choose an even number scale',pose:'ruler',narration:'The horizontal number line uses equal steps of one. A dot sits above its number.',prompt:'Why must every interval be the same width?'},
 {name:'Plot the first observations',pose:'point-down',narration:'Put one mark above the exact value for each observation.',prompt:'Where would the next dot go?'},
 {name:'Stack repeated values',pose:'count',narration:'When a value repeats, stack another dot directly above the first one.',prompt:'How does the tallest stack help us?'},
 {name:'Complete the data display',pose:'compare',narration:'Count all the dots; each one still represents a single original observation.',prompt:'Does the number of dots equal the sample size?'},
 {name:'Identify the most common value',pose:'magnify',narration:'The mode is the value with the largest frequency. There may be more than one mode.',prompt:'Which column is tallest?'},
 {name:'Find the middle observation',pose:'think',narration:'The median sits in the middle of the sorted data. If there are two middle values, find their average.',prompt:'Where is the centre of the ordered observations?'},
 {name:'Balance the data for a mean',pose:'idea',narration:'The mean is the sum of every value divided by the number of observations. It may fall between the ticks.',prompt:'Does the mean have to be a value in the data?'},
 {name:'Compare spread and outliers',pose:'compare',narration:'Range is largest minus smallest. Look for unusual values that pull the mean away from the median.',prompt:'How could one extreme value change the mean?'},
 {name:'Make an evidence-based conclusion',pose:'celebrate',narration:'Explain the pattern with numbers from the data: centre, spread, and any unusual observation.',prompt:'Which measures support your conclusion?'}
];
const data=()=>C.presets[C.preset], groups=d=>d.B?['A','B']:['A'];
const med=v=>{let a=v.slice().sort((x,y)=>x-y),n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2;};
const mean=v=>v.reduce((s,x)=>s+x,0)/v.length;
const range=v=>Math.max(...v)-Math.min(...v);
const modes=v=>{const counts=new Map();v.forEach(x=>counts.set(x,(counts.get(x)||0)+1));let mx=Math.max(...counts.values());return mx===1?[]:[...counts].filter(e=>e[1]===mx).map(e=>e[0]).sort((a,b)=>a-b);};
const fmt=x=>Number.isInteger(x)?String(x):String(+x.toFixed(2));
function stats(d,g){const a=d[g];return {n:a.length,mean:mean(a),median:med(a),mode:modes(a),range:range(a)};}
function fresh(d=data()){return {A:d.A.slice(),...(d.B?{B:d.B.slice()}:{})};}
let ex=fresh(),ch=fresh();
function emit(k,v){NOVA.events.emit('value',{engine:ID,key:k,control:k,value:v});}
const txt=(svg,x,y,v,role='given',size=24,anchor='middle')=>NOVA.chalkText(svg,x,y,String(v),{role,size,anchor});
function layout(){let mobile=innerWidth<=540;return mobile?{mobile,W:450,H:840,x:43,w:364,base:430,baseA:300,baseB:610,tray:686,remove:755,title:48}: {mobile,W:770,H:795,x:95,w:580,base:385,baseA:275,baseB:565,tray:642,remove:722,title:48};}
function valuesAt(v){let z={};v.forEach((n,i)=>{(z[n]||(z[n]=[])).push(i);});return z;}
function activeValues(d,s,g,phase,interactive,challenge){let vals=s[g];if(interactive||challenge)return vals;return phase===0?[]:phase===1?[]:phase===2?vals.slice(0,4):phase===3?vals.slice(0,7):vals;}
// Use the sole approved NOVA.numberLine for every horizontal scale. No hand-drawn tick or axis replacements.
function drawAxis(svg,a,y){let o=NOVA.numberLine(svg,{x:a.x,y,w:a.w,min:0,max:12,major:1,labelSize:a.mobile?23:25,arrows:false});return o.s;}
function dot(svg,x,y,role='given',move=false,id,handleLabel){const g=E('g',{class:'f16d-dot',...(move?{'data-dot':id,tabindex:'0',role:'button','aria-label':handleLabel}:{} )},svg);
 NOVA.neonRing(g,x,y,{role,r:12,pulse:false});return g;}
function groupChart(svg,a,d,s,g,base,phase,o){let chartValues=activeValues(d,s,g,phase,!!o.interactive,!!o.challenge);const xpos=drawAxis(svg,a,base);const stacks=valuesAt(chartValues);
 txt(svg,a.W/2,base-(d.B?160:197),d.B?`Team ${g} · ${chartValues.length} observations`:`${chartValues.length} observations · one dot each`,g==='B'?'op':'support',a.mobile?23:25);
 const plotTop=base-(d.B?143:184);
 NOVA.neonLine(svg,a.x,plotTop,a.x+a.w,plotTop,{role:'support',width:1.4}).style.opacity='.16';
 for(let i=0;i<=12;i++){if(i%2!==0)continue;let line=NOVA.neonLine(svg,xpos(i),plotTop+8,xpos(i),base-13,{role:'support',width:1});line.style.opacity='.12';}
 for(let i=0;i<chartValues.length;i++){
  const n=chartValues[i];const k=chartValues.slice(0,i).filter(v=>v===n).length;const h=d.B?34:36;
  const x=xpos(n),y=base-35-k*h;const marker=dot(svg,x,y,g==='B'?'op':'focus',!!o.interactive||!!o.challenge,`${g}:${i}`,`Move observation ${i+1} of team ${g}, currently ${n}. Arrow keys adjust it. Delete removes.`);
  if(o.interactive||o.challenge){
   const zone=[];for(let j=0;j<=12;j++){zone.push({id:'value:'+j,kind:'drop',x:xpos(j)-a.w/24,y:plotTop-6,w:a.w/12,h:base-plotTop+24});}
   zone.push({id:'remove',kind:'remove',x:a.mobile?280:530,y:a.remove,w:a.mobile?138:163,h:50});
   NOVA.ui.svgDrag(svg,marker,{box:{x:x-16,y:y-16,w:32,h:32},zones:()=>zone,onDrop:id=>{
    let val=Number(id.split(':')[1]);if(!id.startsWith('value:')||!Number.isInteger(val)||val<0||val>12)return false;
    s[g][i]=val;emit('observation',{group:g,index:i,value:val});o.update&&o.update();return true;
   },onRemove:()=>{if(s[g].length<=1)return;s[g].splice(i,1);emit('remove',{group:g,index:i});o.update&&o.update();},removeTo:{x:a.mobile?347:610,y:a.remove+24}});
   // Capturing after core lift prevents Chromium losing a quickly moved SVG pointer.
   marker.addEventListener('pointerdown',e=>{try{marker.setPointerCapture(e.pointerId)}catch(_){}});
   marker.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Delete','Backspace','Escape'].includes(e.key))return;
    e.preventDefault();if(['Delete','Backspace'].includes(e.key)){if(s[g].length<=1)return;s[g].splice(i,1);emit('remove',{group:g,index:i});}
    else if(e.key==='Escape')return;else{s[g][i]=e.key==='Home'?0:e.key==='End'?12:Math.max(0,Math.min(12,n+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:1)));emit('observation',{group:g,index:i,value:s[g][i]});}
    o.update&&o.update();
   });
  }else if(o.phase>1&&o.phase<5){M.arrive(marker,0,11,320);}
 }
 // Mean/median/mode are placed in a separate scale-aligned marker strip to avoid covering data dots.
 if(phase>=5||o.interactive||o.challenge){
   const st=stats(s,g);const summaryY=base+74;
   if(phase>=5||o.interactive||o.challenge){
    if(st.mode.length>2){txt(svg,a.mobile?63:129,summaryY-10,'Modes','op',a.mobile?21:24,'start');txt(svg,a.mobile?63:129,summaryY+17,st.mode.join(', '),'op',a.mobile?20:23,'start');}
    else txt(svg,a.mobile?63:129,summaryY,`${st.mode.length===2?'Modes':'Mode'} ${st.mode.length?st.mode.join(', '):'none'}`,'op',a.mobile?21:24,'start');
   }
   if(phase>=6||o.interactive||o.challenge)txt(svg,a.mobile?216:355,summaryY,`Median ${fmt(st.median)}`,'focus',a.mobile?20:24,'middle');
   if(phase>=7||o.interactive||o.challenge)txt(svg,a.mobile?427:653,summaryY,`Mean ${fmt(st.mean)}`,'result',a.mobile?20:24,'end');
   // On the number line a mean marker sits exactly at the fractional mean, not at a rounded integer.
   if(phase>=7||o.interactive||o.challenge){let mu=xpos(st.mean);NOVA.neonRing(svg,mu,base+22,{role:'result',r:8,pulse:phase===7});}
   if(phase>=6||o.interactive||o.challenge){let xm=xpos(st.median);NOVA.neonRing(svg,xm,base+47,{role:'focus',r:7,pulse:false});}
 }
 return xpos;
}
function detailedMath(svg,a,s){
 // Four large chalk-and-glass reasoning cards occupy the lower graph stage in single-group mode.
 const st=stats(s,'A'),v=s.A, sum=v.reduce((z,x)=>z+x,0), sorted=v.slice().sort((x,y)=>x-y);
 const max=Math.max(...v),min=Math.min(...v),m1=sorted[Math.floor((v.length-1)/2)],m2=sorted[Math.floor(v.length/2)];
 const w=a.mobile?198:266, gap=a.mobile?12:19, x0=(a.W-2*w-gap)/2;
 const y1=a.mobile?526:457,y2=a.mobile?605:532,hh=a.mobile?63:60;
 const cards=[
  {x:x0,y:y1,role:'result',label:'MEAN · balance point',math:`${sum} ÷ ${v.length} = ${fmt(st.mean)}`},
  {x:x0+w+gap,y:y1,role:'focus',label:'MEDIAN · middle',math:v.length%2?`${fmt(st.median)} (middle)`:`(${m1} + ${m2}) ÷ 2 = ${fmt(st.median)}`},
  {x:x0,y:y2,role:'op',label:'MODE · most frequent',math:st.mode.join(' and ')||'No mode'},
  {x:x0+w+gap,y:y2,role:'given',label:'RANGE · spread',math:`${max} − ${min} = ${st.range}`}
 ];
 cards.forEach(c=>{NOVA.neonBox(svg,c.x,c.y,w,hh,{role:c.role});txt(svg,c.x+w/2,c.y+23,c.label,c.role,a.mobile?20:22);txt(svg,c.x+w/2,c.y+hh-12,c.math,c.role,a.mobile?20:25);});
}
function raw(svg,a,d){txt(svg,a.W/2,128,'Every number is one observation','support',a.mobile?22:28);
 const gs=groups(d);gs.forEach((g,gi)=>{let v=d[g];let order=v.map((x,i)=>i).sort((i,j)=>((i*7+5)%v.length)-((j*7+5)%v.length));
 txt(svg,a.W/2,gs.length?178+gi*254:180,`Team ${g} · ${v.length} raw results`,g==='B'?'op':'given',a.mobile?24:27);
 const cols=a.mobile?5:6,cw=a.mobile?74:84,x0=a.W/2-((cols-1)*cw)/2;
 order.forEach((i,k)=>{const x=x0+(k%cols)*cw,y=(gs.length?222+gi*254:235)+Math.floor(k/cols)*67;
  NOVA.neonBox(svg,x-29,y-23,58,46,{role:g==='B'?'op':'given'});txt(svg,x,y+8,v[i],g==='B'?'op':'given',a.mobile?24:27);});});
 txt(svg,a.W/2,a.H-48,'Next: place one luminous dot above each value','result',a.mobile?20:24);
}
function missingCard(svg,a,d,o){
 const v=o.missing,cy=a.remove-39,cx=a.mobile?106:210,w=a.mobile?139:163,h=45;
 const box=E('g',{'data-missing':'1',tabindex:'0',role:'button','aria-label':`Place missing observation ${v} at value ${v}. Press Enter as a keyboard alternative.`},svg);
 NOVA.neonBox(box,cx-w/2,cy-h/2,w,h,{role:'op'});txt(box,cx,cy+8,`Missing ${v}`,'op',a.mobile?22:25);
 const base=d.B?a.baseA:a.base,top=base-(d.B?143:184),zones=[];
 for(let n=0;n<=12;n++)zones.push({id:'value:'+n,kind:'drop',x:a.x+n*a.w/12-a.w/24,y:top-5,w:a.w/12,h:base-top+35});
 NOVA.ui.svgDrag(svg,box,{box:{x:cx-w/2,y:cy-h/2,w,h},zones:()=>zones,onDrop:id=>{if(id!=='value:'+v)return false;o.restore();return true;}});
 box.addEventListener('pointerdown',e=>{try{box.setPointerCapture(e.pointerId)}catch(_){}});
 box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.restore();}});
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
const d=o.data||data(),s=o.state||fresh(d),a=layout(),phase=o.phase===undefined?9:o.phase;stage.innerHTML='';
 const svg=S.root(a.W,a.H,'NOVA dot plot of '+d.title+'. Each observed value is a separate dot. Numeric scale zero to twelve.');svg.classList.add('f16d-plot');svg.setAttribute('role','img');
 txt(svg,a.W/2,a.title,d.title,'given',a.mobile?27:32);
 txt(svg,a.W/2,a.title+35,d.context,'support',a.mobile?18:23);
 if(phase===0&&!o.interactive&&!o.challenge)raw(svg,a,d);
 else if(d.B){groupChart(svg,a,d,s,'A',a.baseA,phase,o);groupChart(svg,a,d,s,'B',a.baseB,phase,o);}
 else{groupChart(svg,a,d,s,'A',a.base,phase,o);}
 if((phase>=7||o.interactive||o.challenge)&&!d.B){detailedMath(svg,a,s);}
 if(o.challenge&&o.missing!==undefined&&o.missing!==null)missingCard(svg,a,d,o);
 if(o.interactive||o.challenge){NOVA.neonBox(svg,a.mobile?280:530,a.remove,a.mobile?138:163,49,{role:'error'});txt(svg,a.mobile?349:611,a.remove+31,'Remove dot','error',a.mobile?21:24);txt(svg,a.mobile?30:92,a.remove+30,'Drag any dot here','support',a.mobile?19:21,'start');}
 else if(phase>=8){txt(svg,a.W/2,a.H-34,d.B?`A range ${range(s.A)}  ·  B range ${range(s.B)}`:`Range ${range(s.A)} · highest ${Math.max(...s.A)} · lowest ${Math.min(...s.A)}`,'result',a.mobile?21:25);}
 stage.appendChild(svg);
 if(phase>=4||o.interactive||o.challenge){let caps=H('div',{class:'f16d-caps'});let ss=groups(d).map(g=>({g,...stats(s,g)}));
 ss.forEach(z=>caps.appendChild(NOVA.neonTile((d.B?'Team '+z.g+' · ':'')+`n ${z.n} · range ${z.range}`,{role:z.g==='B'?'op':'given'})));
 if(phase>=7||o.interactive||o.challenge)caps.appendChild(NOVA.neonTile(d.B?`Mean A ${fmt(ss[0].mean)} · B ${fmt(ss[1].mean)}`:`Mean = ${fmt(ss[0].mean)}`,{role:'result'}));stage.appendChild(caps);}
 NOVA.scene.helperStrip(stage,o.pose||'count',o.speech||'Each separate dot is one observation. Read the centre and spread.');return svg;
}
function watch(i,stage){let d=data(),s=fresh(d),p=STEPS[i];let messages=[
 `Here are the original results. ${d.B?'There are two groups to compare.':'Repeated measurements are not mistakes; keep every observation.'}`,
 'Mark a number scale using equal intervals. Each dot must line up above its value.',
 'Plot the first four observations. Go straight up from their number on the scale.',
 'Values can repeat. Stack one dot directly above another, never side by side.',
 `Now the complete dot plot contains ${d.A.length}${d.B?' values in Team A and '+d.B.length+' in Team B':' observations'}.`,
 `The mode ${d.B?'for Team A ':' '}is ${modes(d.A).length?modes(d.A).join(' and '):'not unique because no value repeats'}. Look for the tallest stacks.`,
 `The median ${d.B?'for Team A ':' '}is ${fmt(med(d.A))}. Find the middle after ordering every value.`,
 `The mean ${d.B?'for Team A ':' '}is ${fmt(mean(d.A))}. Divide the sum of the data by ${d.A.length}.`,
 d.B?`Team A ranges across ${range(d.A)} while Team B ranges across ${range(d.B)}. Spread is not the same thing as average.`:`The range is ${Math.max(...d.A)} minus ${Math.min(...d.A)}: ${range(d.A)}. An outlier can affect mean and range.`,
 d.B?`Compare the median of ${fmt(med(d.A))} with ${fmt(med(d.B))}, alongside both ranges.`:`Report mean ${fmt(mean(d.A))}, median ${fmt(med(d.A))}, mode ${modes(d.A).join(' and ')||'none'} and range ${range(d.A)}.`
 ];scene(stage,{data:d,state:s,phase:i,pose:p.pose,speech:messages[i]});}
function pick(label,arr){const s=H('select',{class:'nova-input','aria-label':label});arr.forEach(([val,name])=>s.appendChild(H('option',{value:String(val),text:String(name)})));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();ex=fresh();window.NovaLessonComponent?.applyExploreModels();const preset=pick('Lesson preset',Object.entries(C.presets).map(([key,v])=>[key,v.label])),team=pick('Dataset',groups(data()).map(g=>[g,`Team ${g}`])),index=pick('Observation',[]),nextVal=H('input',{class:'nova-input',type:'number',min:0,max:12,step:1,'aria-label':'New dot value'}),status=H('p',{class:'f16d-status',role:'status'});window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();function repop(){let d=data();team.innerHTML='';groups(d).forEach(g=>team.appendChild(H('option',{value:g,text:!d.B?'Data':'Team '+g})));index.innerHTML='';ex[team.value].forEach((v,i)=>index.appendChild(H('option',{value:i,text:`Observation ${i+1} · ${v}`})));index.value='0';nextVal.value=ex[team.value][0]??0;}
 window.NovaLessonComponent?.applyExploreModels();function paint(){let d=data();scene(stage,{data:d,state:ex,interactive:true,pose:'point-down',speech:'Drag any dot horizontally to change its value. Stack repeats exactly over the matching number. Remove a dot with the red zone, or use the numbered controls.',update:paint});status.textContent=groups(d).map(g=>{let s=stats(ex,g);return `${g}: n ${s.n} · mean ${fmt(s.mean)} · median ${fmt(s.median)} · mode ${s.mode.join(', ')||'none'} · range ${s.range}`;}).join('   |   ');}
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{C.preset=preset.value;ex=fresh();repop();emit('preset',C.preset);paint();};
 window.NovaLessonComponent?.applyExploreModels();team.onchange=()=>{index.innerHTML='';ex[team.value].forEach((v,i)=>index.appendChild(H('option',{value:i,text:`Observation ${i+1} · ${v}`})));index.value='0';nextVal.value=ex[team.value][0];};window.NovaLessonComponent?.applyExploreModels();index.onchange=()=>{nextVal.value=ex[team.value][+index.value];};
 window.NovaLessonComponent?.applyExploreModels();function set(){let g=team.value,i=+index.value,n=Number(nextVal.value);if(!Number.isInteger(n)||n<0||n>12){status.textContent='Use a whole number between 0 and 12.';return;}ex[g][i]=n;emit('observation',{group:g,index:i,value:n});paint();team.onchange();}
 window.NovaLessonComponent?.applyExploreModels();function remove(){let g=team.value,i=+index.value;if(ex[g].length<=1){status.textContent='Keep at least one observation in each dataset.';return;}ex[g].splice(i,1);emit('remove',{group:g,index:i});paint();team.onchange();}
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f16d-guidance',text:'Move an existing dot to another number, or drag it into the red Remove zone. Mean, median, mode and range update from the observed values. The controls below are an equivalent keyboard method.'}),H('div',{class:'f16d-controls'},[
  H('label',{class:'f16d-label'},['Lesson',preset]),H('label',{class:'f16d-label'},['Team',team]),H('label',{class:'f16d-label'},['Dot to change',index]),H('label',{class:'f16d-label'},['New value',nextVal]),
  H('button',{class:'nova-btn primary',text:'Move dot',onclick:set}),H('button',{class:'nova-btn',text:'Remove dot',onclick:remove}),H('button',{class:'nova-btn ghost',text:'Reset data',onclick:()=>{ex=fresh();repop();paint();emit('reset',true);}})]),status);
 window.NovaLessonComponent?.applyExploreModels();repop();window.NovaLessonComponent?.applyExploreModels();paint();
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:C.preset,values:structuredClone(ex),A:stats(ex,'A'),...(ex.B?{B:stats(ex,'B')}:{})}),selectPreset:key=>{preset.value=key;preset.onchange();},set:(g,i,n)=>{ex[g][i]=n;paint();},remove:(g,i)=>{ex[g].splice(i,1);paint();},reset:()=>{ex=fresh();paint();}};
}
function challenge(panel,api,stage){const d=data();ch=fresh();let indexTask=0;const target=d.A.indexOf(Math.max(...d.A));let missing=ch.A[target];ch.A.splice(target,1);
 const answerMedian=med(d.A),answerRange=range(d.A),taskIndex=target;
 const row=H('div',{class:'f16d-controls'},[H('button',{class:'nova-btn',text:`Restore observation ${missing}`,onclick:()=>{if(!ch.A.includes(missing)||ch.A.length<d.A.length){ch.A.splice(taskIndex,0,missing);emit('observation',{group:'A',value:missing});draw(0);}}})]);
 panel.append(H('p',{class:'f16d-guidance',text:'Prove the graph uses every observation. Drag the missing orange data card to its correct number, or press Restore as a keyboard alternative. Then calculate the median and range.'}),row);
 function draw(k){indexTask=k;row.style.display=k===0?'flex':'none';scene(stage,{state:ch,data:d,challenge:k===0,phase:9,pose:k===0?'think':k===1?'ruler':'compare',speech:k===0?`A ${missing} is missing from Team A. Drag the missing card to its number or press Restore, then check every observation.`:k===1?'The median is the middle ordered value. For an even sample, average the two middle values.':'Range is largest minus smallest, not the number of values.',missing:k===0&&ch.A.length<d.A.length?missing:null,restore:()=>{if(ch.A.length<d.A.length){ch.A.splice(taskIndex,0,missing);emit('observation',{group:'A',value:missing});draw(0);}},update:()=>draw(0)});}
 const tasks=[
 {q:`The original dataset has ${d.A.length} values. Restore the missing observation ${missing} before checking the dot plot.`,build:()=>()=>JSON.stringify(ch.A.slice().sort((x,y)=>x-y))===JSON.stringify(d.A.slice().sort((x,y)=>x-y)),check:v=>[v===true,v?`Correct. The missing ${missing} is now included.`:`Count all dots and check their positions. Each value, including ${missing}, must occur exactly as often as in the original data.`],hint:'Use Restore observation, or recreate the missing value using the plotted observations.',solve:()=>{ch.A.splice(taskIndex,0,missing);draw(0)}},
 {q:`Find the median of Team A's ${d.A.length} original scores.`,build:NOVA.entryTask('Median of Team A',ID),check:v=>[v===answerMedian,v===answerMedian?`Correct: the middle value is ${fmt(answerMedian)}.`:v===mean(d.A)?'That is the mean, not the median. Order the observations and find the middle.':'The median is determined by the sorted positions, not the tallest stack.'],hint:'Sort every observation, retaining repeated values.'},
 {q:'What is the range of Team A?',build:NOVA.entryTask('Range of Team A',ID),check:v=>[v===answerRange,v===answerRange?`Correct: ${Math.max(...d.A)} − ${Math.min(...d.A)} = ${answerRange}.`:v===d.A.length?'That is the sample size, not the range.':'Subtract the smallest observed value from the largest observed value.'],hint:'Read the leftmost and rightmost occupied positions on the number line.'}
 ];
 NOVA.challengeRun(panel,api,tasks,draw,C);C._challengeState=()=>({task:indexTask,values:ch.A.slice(),target:missing,median:answerMedian,range:answerRange});
}
const DEF={id:ID,title:'Dot plot and averages',config:C,steps:STEPS,render:watch,
 alt:'Neon dot plot on the canonical NOVA number line. Dots stack by whole-number values; mean and median positions are shown accurately on the line.',staticAlt:'Every dot is one observation. Mode is the most frequent value, median the middle sorted value, mean the sum divided by count, and range is maximum minus minimum.',exploreIntro:'Drag observations across the number line and watch the statistics change in real time.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·06',title:'Dot plot and averages',def:DEF,years:'Years 7–9 KS3 and GCSE data interpretation.',linked:['F0-02','F0-03','F0-04','F16-05','F16-07','F16-08','F16-14'],spec:{
 purpose:'Visualise repeated observations and develop meaningful statistical comparisons using dot stacks, mean, median, mode, range and outliers.',
 params:'Six datasets; values are whole numbers from 0 to 12, one or two groups; drag/remove observations; live statistics.',
 presets:'Y7-068, Y7-069, Y7-070, Y8-069, Y9-048, Y9-049.',
 steps:'Read observations → Number scale → Plot → Stack duplicates → Complete → Mode → Median → Mean → Range/outliers → Interpret.',
 interactions:'Real SVG pointer dragging, moving/re-grabbing dots, red remove zone, arrow-key positioning, numerical alternatives, six presets, reset and exact statistical readouts.',
 traps:'Repeated values forgotten, median vs mean, mode mistaken for largest number, dividing by number of different values, and range confused with sample size.',
 gcse:'Compare two data sets, consider the influence of outliers and support conclusions with numerical evidence.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>{log.textContent='';};}
})();
