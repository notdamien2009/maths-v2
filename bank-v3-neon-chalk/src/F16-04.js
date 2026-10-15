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

/* NOVA F16-04 · Pie Chart Builder · unchanged F0/F2 shared NOVA runtime. */
(function(){'use strict';
const H=NOVA.h,S=NOVA.svg,E=S.el,ID='F16-04',MOT=NOVA.motion;
const CONFIG=window.NovaV2Integration.configuration(window.NOVA_F16_04_CONFIG={
 preset:'clubs',events:['value','step','mode','hintUsed','correct'],
 presets:{
  clubs:{label:'Y7-067 · After-school clubs',title:'Favourite school clubs',context:'Twenty pupils each choose their favourite club.',names:['Sport','Art','Music','Coding'],counts:[8,6,4,2],short:['Sport','Art','Music','Code']},
  travel:{label:'Y7-067 · Travel to school',title:'Journeys to school',context:'Twenty pupils report how they usually travel.',names:['Walk','Bus','Car','Cycle'],counts:[6,5,5,4],short:['Walk','Bus','Car','Cycle']},
  lunch:{label:'Y7-067 · Lunch choices',title:'Most popular lunches',context:'Twenty pupils choose one lunch each.',names:['Sandwich','Pasta','Salad','Jacket potato'],counts:[9,4,4,3],short:['Sandwich','Pasta','Salad','Potato']}
 },_explore:null,_challenge:null
});
const ROLES=['given','focus','support','result'];
const STEPS=[
 {name:'Collect frequency data',pose:'count',narration:'A pie chart starts with counts. Each person or item belongs in exactly one category.',prompt:'What does one frequency count represent?'},
 {name:'Find the total frequency',pose:'explain',narration:'Add every category. There are twenty responses in total. The whole circle represents those twenty responses.',prompt:'Why must all categories add to the same total?'},
 {name:'Convert frequency into angles',pose:'ruler',narration:'One response occupies eighteen degrees because three hundred and sixty degrees divided by twenty is eighteen.',prompt:'How many degrees does one response contribute?'},
 {name:'Draw the first sector',pose:'point-right',narration:'Multiply the frequency of the first category by the degrees per response. Draw that sector precisely.',prompt:'How does a larger frequency affect the sector angle?'},
 {name:'Build the second sector',pose:'count',narration:'Measure the second category angle. Begin its sector exactly where the first sector ends.',prompt:'Should sectors overlap or leave gaps?'},
 {name:'Draw the third sector',pose:'compare',narration:'Convert the third category frequency into its correct angle. Its size remains proportional to the count.',prompt:'Does a count of four take one fifth of the circle?'},
 {name:'Complete the full circle',pose:'point-down',narration:'Complete the fourth sector. Every sector fits the circle, with no gaps or overlaps, and the angles total three hundred and sixty degrees.',prompt:'What total should the sector angles always have?'},
 {name:'Compare percentages',pose:'magnify',narration:'Convert each category into a percentage of all twenty responses, then check they total one hundred percent.',prompt:'Why do the percentages add up to one hundred?'},
 {name:'Read and check the chart',pose:'celebrate',narration:'Read the coloured sectors alongside the frequency key. Check that all frequencies, angles and percentages agree.',prompt:'How can you check your finished pie chart?'}
];
const preset=()=>CONFIG.presets[CONFIG.preset];
const stateFrom=(d=preset())=>({counts:d.counts.slice(),selected:0});
let exploration=stateFrom(),chall=stateFrom();
const total=s=>s.counts.reduce((a,b)=>a+b,0);
const ang=(n,t)=>n*360/t;
const percent=(n,t)=>n*100/t;
function emit(key,value){NOVA.events.emit('value',{engine:ID,key,control:key,value});}
function chalk(svg,x,y,txt,role='given',size=22,anchor='middle'){return NOVA.chalkText(svg,x,y,String(txt),{role,size,anchor});}
function box(svg,x,y,w,h,text,role='given',size=21){const g=NOVA.neonBox(svg,x,y,w,h,{role});if(text!==undefined)chalk(svg,x+w/2,y+h/2+size*.32,String(text),role,size);return g;}
function layout(){return innerWidth<=540?{mobile:true,W:450,H:752,cx:225,cy:301,r:174,titleY:44,readY:491,legendY:534,legendW:207,legendH:52,formulaY:656,resetY:704}:{mobile:false,W:770,H:655,cx:267,cy:327,r:185,titleY:43,readY:550,legendY:146,legendW:221,legendH:67,formulaY:516,resetY:598};}
function pos(a,deg,r=a.r){const rad=(deg-90)*Math.PI/180;return{x:a.cx+r*Math.cos(rad),y:a.cy+r*Math.sin(rad)};}
function wedge(a,start,end){const p0=pos(a,start),p1=pos(a,end);const sweep=end-start;const large=sweep>180?1:0;return `M${a.cx},${a.cy} L${p0.x.toFixed(3)},${p0.y.toFixed(3)} A${a.r},${a.r} 0 ${large},1 ${p1.x.toFixed(3)},${p1.y.toFixed(3)} Z`;}
function addRing(svg,a,role='support'){let d=`M${a.cx-a.r},${a.cy} a${a.r},${a.r} 0 1,0 ${2*a.r},0 a${a.r},${a.r} 0 1,0 ${-2*a.r},0`;return NOVA.neonPath(svg,d,{role,width:3});}
function freqLabels(svg,a,d,s,showCount,active,editable){
 const t=total(s);for(let i=0;i<4;i++){
  const x=a.mobile?(i%2?233:12):501,y=a.mobile?a.legendY+Math.floor(i/2)*60:a.legendY+i*81;
  const w=a.mobile?a.legendW:a.legendW,h=a.mobile?a.legendH:a.legendH;
  const freq=showCount?String(s.counts[i]):'?',txt=(!showCount?'collecting...':`${s.counts[i]}  ·  ${percent(s.counts[i],t).toFixed(0)}%  ·  ${ang(s.counts[i],t).toFixed(0)}°`);
  const card=NOVA.neonBox(svg,x,y,w,h,{role:i===active?'result':ROLES[i]});card.setAttribute('data-legend',String(i));
  const bx=x+20,by=y+21;
  NOVA.neonRing(svg,bx,by,{role:ROLES[i],r:6,pulse:i===active});
  chalk(svg,x+36,y+22,d.short[i],ROLES[i],a.mobile?23:24,'start');
  chalk(svg,x+36,y+(a.mobile?43:51),showCount?txt:'count '+freq,i===active?'result':'given',a.mobile?22:19,'start');
  if(editable){const hit=E('rect',{x,y,width:w,height:h,rx:9,fill:'transparent',css:'pointer-events:all;cursor:pointer'},svg);hit.setAttribute('role','button');hit.setAttribute('tabindex','0');hit.setAttribute('aria-label',`Select ${d.names[i]} sector`);hit.addEventListener('click',()=>editable(i));hit.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();editable(i);}});}
 }
}
function pie(svg,a,d,s,shown,active,interactive,update){const t=total(s);let currentDeg=0;addRing(svg,a,'support');
 if(!shown){NOVA.neonLine(svg,a.cx,a.cy,a.cx,a.cy-a.r,{role:'given',width:3});return;}
 for(let i=0;i<shown;i++){
  const width=ang(s.counts[i],t),start=currentDeg,end=start+width;
  const group=NOVA.neonPath(svg,wedge(a,start,end),{role:ROLES[i],fill:true,width:i===active?4.8:3.1});group.setAttribute('data-sector',String(i));
  if(!interactive && shown>=1 && shown<=4 && i===shown-1)MOT.arrive(group,0,10,430);
  if(interactive){const hit=E('path',{d:wedge(a,start,end),fill:'transparent',css:'pointer-events:all;cursor:pointer'},svg);hit.setAttribute('aria-label',`Select ${d.names[i]}`);hit.addEventListener('click',()=>update(i));}
  let labelAngle=start+width/2,pt=pos(a,labelAngle,a.r*.62);
  if(width>=30){chalk(svg,pt.x,pt.y+6,Math.round(percent(s.counts[i],t))+'%',i===active?'result':'given',a.mobile?23:25);}
  currentDeg=end;
 }
 addRing(svg,a,'given');
 if(shown===4){let boundary=0;for(let i=0;i<3;i++){
  boundary+=ang(s.counts[i],t);const p=pos(a,boundary,a.r);
  if(interactive){const handle=E('g',{'data-boundary':String(i),tabindex:'0',role:'slider','aria-label':`Adjust boundary between ${d.names[i]} and ${d.names[i+1]}`,'aria-valuemin':'1','aria-valuemax':String(s.counts[i]+s.counts[i+1]-1),'aria-valuenow':String(s.counts[i])},svg);
   NOVA.neonRing(handle,p.x,p.y,{role:'result',r:12,pulse:i===active||i+1===active});
   const joint=s.counts[i]+s.counts[i+1],lo=1,hi=joint-1;
   // The only legal targets are integer response boundaries. Both neighbouring sectors stay positive.
   const zs=()=>{const start=360*s.counts.slice(0,i).reduce((a,b)=>a+b,0)/t;const arr=[];
    for(let n=lo;n<=hi;n++){const q=pos(a,start+360*n/t,a.r);arr.push({id:`edge:${i}:${n}`,kind:'drop',x:q.x-19,y:q.y-19,w:38,h:38});}
    arr.push({id:'restore',kind:'remove',x:a.mobile?145:516,y:a.resetY,w:a.mobile?160:220,h:42});return arr;};
   NOVA.ui.svgDrag(svg,handle,{box:{x:p.x-16,y:p.y-16,w:32,h:32},zones:zs,onDrop:id=>{
    const parts=id.split(':'),n=Number(parts[2]);if(parts[0]!=='edge'||n<1||n>=joint)return false;
    s.counts[i]=n;s.counts[i+1]=joint-n;s.selected=i;emit('sector',{index:i,count:n,other:joint-n});update(i);return true;
   },onRemove:()=>{s.counts=d.counts.slice();s.selected=0;emit('reset',true);update(0);},removeTo:{x:a.W/2,y:a.resetY+20}});
   // The canonical drag routine reparents the lifted node. Recapture on the new SVG parent.
   handle.addEventListener('pointerdown',e=>{try{handle.setPointerCapture(e.pointerId)}catch(_){}});
   handle.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowLeft'||e.key==='ArrowDown')n=Math.max(lo,s.counts[i]-1);
    if(e.key==='ArrowRight'||e.key==='ArrowUp')n=Math.min(hi,s.counts[i]+1);if(e.key==='Home')n=lo;if(e.key==='End')n=hi;
    if(n===null)return;e.preventDefault();s.counts[i+1]+=s.counts[i]-n;s.counts[i]=n;s.selected=i;emit('sector',{index:i,count:n});update(i);});
  }else NOVA.neonRing(svg,p.x,p.y,{role:i===active?'result':'focus',r:6});
 }}
}
function scene(stage,opt={}){
if(window.NovaLessonComponent?.active){[stage,opt]=window.NovaLessonComponent.args("scene",arguments);}
const d=opt.data||preset(),s=opt.state||stateFrom(d),phase=opt.phase??8,interactive=!!opt.interactive;
 const a=layout(),t=total(s),active=typeof opt.active==='number'?opt.active:s.selected;
 stage.innerHTML='';let sv=S.root(a.W,a.H,`Pie chart for ${d.title}, categories ${d.names.map((n,i)=>n+' '+s.counts[i]).join(', ')}. Total ${t}.`);
 sv.classList.add('f16p-plot');sv.setAttribute('role','img');
 chalk(sv,a.W/2,a.titleY,d.title,'given',a.mobile?27:30);
 if(a.mobile)chalk(sv,a.W/2,79,t+' responses  ·  360° circle','support',20);
 else chalk(sv,a.W/2,77,t+' responses make one whole circle','support',23);
 const shown=interactive?4:(phase<3?0:phase===3?1:phase===4?2:phase===5?3:4);
 const change=i=>{s.selected=i;opt.onChange&&opt.onChange(i);};
 pie(sv,a,d,s,shown,active,interactive,change);
 if(phase>=7&&!interactive){let b=0;for(let i=0;i<active;i++)b+=ang(s.counts[i],t);
  const spot=pos(a,b+ang(s.counts[active],t)/2,a.r*.8);NOVA.neonRing(sv,spot.x,spot.y,{role:'result',r:14,pulse:true});}
 if(a.mobile){box(sv,96,a.readY,258,35,`${shown? 'All sectors':'Frequency'} · ${t} total`,'result',18);}
 else {box(sv,515,99,210,36,`Total frequency: ${t}`,'result',19);}
 freqLabels(sv,a,d,s,phase>0||interactive,active,interactive?change:null);
 // Angles and percentages are exact proportional conversions, never hand-drawn approximations.
 if(a.mobile){const txt=interactive?`${d.short[active]}: ${s.counts[active]} × ${360/t}° = ${Math.round(ang(s.counts[active],t))}°`:
  phase>=2?`Each response = ${360/t}°`:'Collect the data, then add';
  box(sv,56,a.formulaY,338,37,txt,'result',interactive?20:21);
 }else{
  chalk(sv,612,a.formulaY,interactive?`${d.short[active]}: ${s.counts[active]} × ${360/t}°`:phase>=2?`Each response = ${360/t}°`:'Read every frequency','support',23);
  box(sv,522,a.formulaY+15,202,43,interactive?`= ${Math.round(ang(s.counts[active],t))}°`:'Whole = 360°','result',23);
 }
 if(interactive){box(sv,a.mobile?146:517,a.resetY,a.mobile?158:218,42,'RESET CHART','error',19);}
 stage.appendChild(sv);
 const strip=H('div',{class:'f16p-values'});
 strip.append(NOVA.neonTile(`Total ${t}`,{role:'given'}),NOVA.neonTile(`Angles ${s.counts.reduce((v,n)=>v+ang(n,t),0).toFixed(0)}°`,{role:'result'}),NOVA.neonTile(`Percent 100%`,{role:'focus'}));
 stage.appendChild(strip);
 NOVA.scene.helperStrip(stage,opt.pose||'compare',opt.speech||'Each sector shows its category’s share of the same whole.');
 return sv;
}
function watch(i,stage){i=Math.max(0,Math.min(STEPS.length-1,i));const d=preset(),s=stateFrom(d),t=total(s);
 const script=[
  'First, collect one frequency for each choice. Each response can be counted only once.',
  'Add the frequencies: '+s.counts.join(' plus ')+' equals '+t+'.',
  'Divide three hundred and sixty degrees by '+t+'. Each response occupies '+360/t+' degrees.',
  d.names[0]+' has '+s.counts[0]+' responses. Multiply by '+360/t+' to get '+ang(s.counts[0],t)+' degrees.',
  d.names[1]+' has '+s.counts[1]+' responses, so it fills '+ang(s.counts[1],t)+' degrees.',
  d.names[2]+' has '+s.counts[2]+' responses, so it fills '+ang(s.counts[2],t)+' degrees.',
  d.names[3]+' fills '+ang(s.counts[3],t)+' degrees and closes the circle with no gap.',
  'Now compare the four percentages. They total one hundred percent.',
  'Every category matches its count, its percentage and its sector angle.'
 ];scene(stage,{data:d,state:s,phase:i,pose:STEPS[i].pose,speech:script[i],active:i===8?0:Math.max(0,Math.min(3,i-3))});
}
function chooser(label,opts){const s=H('select',{class:'nova-input','aria-label':label});for(const [id,value]of opts)s.appendChild(H('option',{value:String(id),text:value}));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();exploration=stateFrom();window.NovaLessonComponent?.applyExploreModels();const presetCtl=chooser('Dataset',Object.entries(CONFIG.presets).map(([k,v])=>[k,v.label]));window.NovaLessonComponent?.applyExploreModels();presetCtl.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();const selectedCtl=chooser('Selected sector',preset().names.map((n,i)=>[i,n]));
 window.NovaLessonComponent?.applyExploreModels();const countCtl=H('input',{class:'nova-input',type:'number',min:1,max:17,step:1,'aria-label':'Set selected sector frequency'});
 window.NovaLessonComponent?.applyExploreModels();const status=H('p',{class:'f16p-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();const info=H('p',{class:'f16p-instructions',text:'Drag the glowing dot on a sector boundary to another valid snapped position. One category gains responses as the neighbouring category loses them. The total remains unchanged. Use the keyboard arrows or frequency control as alternatives.'});
 window.NovaLessonComponent?.applyExploreModels();function sync(){const d=preset();selectedCtl.innerHTML='';d.names.forEach((n,i)=>selectedCtl.appendChild(H('option',{value:i,text:n})));selectedCtl.value=String(exploration.selected);presetCtl.value=CONFIG.preset;
 const ix=exploration.selected,j=ix===3?2:ix;const available=exploration.counts[j]+exploration.counts[j+1];countCtl.max=String(available-1);countCtl.min='1';countCtl.value=String(exploration.counts[ix]);}
 window.NovaLessonComponent?.applyExploreModels();function paint(){const d=preset(),t=total(exploration);sync();scene(stage,{data:d,state:exploration,interactive:true,active:exploration.selected,pose:'ruler',speech:'Drag a sector boundary around the circle. Every valid position represents one complete response, and all four sectors still make three hundred and sixty degrees.',onChange:()=>paint()});
 status.textContent=d.names.map((n,i)=>n+' '+exploration.counts[i]+' ('+Math.round(percent(exploration.counts[i],t))+'%)').join(' · ')+'. Total: '+t+'.';}
 window.NovaLessonComponent?.applyExploreModels();function setCount(n){n=Number(n);const i=exploration.selected,j=i===3?2:i,other=j+1,sum=exploration.counts[j]+exploration.counts[other];let target=i===3?sum-n:n;
 if(!Number.isInteger(n)||target<1||target>=sum){status.textContent='Choose a whole-number frequency that leaves at least one response in each neighbouring sector.';return;}
 exploration.counts[j]=target;exploration.counts[other]=sum-target;emit('sector',{index:j,count:target});paint();}
 window.NovaLessonComponent?.applyExploreModels();presetCtl.onchange=()=>{CONFIG.preset=presetCtl.value;exploration=stateFrom();emit('preset',CONFIG.preset);paint()};
 window.NovaLessonComponent?.applyExploreModels();selectedCtl.onchange=()=>{exploration.selected=Number(selectedCtl.value);paint()};
 window.NovaLessonComponent?.applyExploreModels();const controls=H('div',{class:'f16p-controls'},[
  H('label',{class:'f16p-label'},['Dataset',presetCtl]),H('label',{class:'f16p-label'},['Selected sector',selectedCtl]),H('label',{class:'f16p-label'},['Frequency',countCtl]),
  H('button',{class:'nova-btn primary',text:'Set frequency',onclick:()=>setCount(countCtl.value)}),
  H('button',{class:'nova-btn',text:'Decrease −1',onclick:()=>setCount(exploration.counts[exploration.selected]-1)}),
  H('button',{class:'nova-btn',text:'Increase +1',onclick:()=>setCount(exploration.counts[exploration.selected]+1)}),
  H('button',{class:'nova-btn ghost',text:'Restore original',onclick:()=>{exploration=stateFrom();emit('reset',true);paint();}})
 ]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(info,controls,status);window.NovaLessonComponent?.applyExploreModels();paint();
 window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:()=>({counts:exploration.counts.slice(),selected:exploration.selected,total:total(exploration)}),setPreset:k=>{presetCtl.value=k;presetCtl.onchange()},setCount:(i,n)=>{exploration.selected=i;setCount(n)},reset:()=>{exploration=stateFrom();paint()}};
}
function challenge(panel,api,stage){const d=preset();chall=stateFrom(d);const target=d.counts[1],before=d.counts[1]-1;chall.counts[1]=before;chall.counts[2]+=1;chall.selected=1;
 let currentTask=0;const input=H('input',{class:'nova-input',type:'number',min:1,max:18,step:1,'aria-label':'Set corrected Art frequency'});
 input.value=String(before);
 const ctrl=H('div',{class:'f16p-controls'},[H('label',{class:'f16p-label'},['Correct frequency for '+d.names[1],input]),H('button',{class:'nova-btn primary',text:'Set corrected frequency',onclick:()=>{if(currentTask!==0)return;const n=Number(input.value),sum=chall.counts[1]+chall.counts[2];if(!Number.isInteger(n)||n<1||n>=sum)return;chall.counts[1]=n;chall.counts[2]=sum-n;paint(0);}})]);
 panel.append(H('p',{class:'f16p-instructions',text:'Repair the pie chart using the source frequencies. Then calculate the exact sector angle and interpret the chart. Task 1 accepts a real boundary drag or exact numeric input.'}),ctrl);
 function paint(task){currentTask=task;ctrl.style.display=task===0?'flex':'none';if(task===0){scene(stage,{data:d,state:chall,interactive:true,active:1,pose:'think',speech:'The second category is one response too small. Restore the correct frequency by sliding the boundary between its sector and the next.',onChange:()=>{input.value=String(chall.counts[1]);paint(0);}});}
 else scene(stage,{data:d,state:stateFrom(d),phase:8,active:task===1?1:2,pose:task===1?'ruler':'compare',speech:task===1?'Use frequency divided by total, then multiply by three hundred and sixty degrees.':'Find the category whose frequency is one fifth of the total.'});}
 const t=total(stateFrom(d)),theAngle=ang(d.counts[1],t);const oneFifth=t/5;
 const tasks=[
 {q:`Source table: ${d.names[1]} has ${target} responses. Its drawn sector currently shows ${before}. Drag the boundary or correct the frequency to match the source.`,build:()=>()=>chall.counts[1],check:n=>[n===target,n===target?`Correct. ${target} responses makes ${theAngle}°, and the total is still ${t}.`:n===target-1?'One response is still missing from this category. Move the boundary by one response.':`Read the given ${target} responses. Moving a boundary changes only two neighbouring frequencies.`],hint:`Set ${d.names[1]} to ${target}; its neighbour must change by the opposite amount.`,solve:()=>{chall.counts[1]=target;chall.counts[2]=d.counts[2];paint(0);}},
 {q:`A complete circle is 360°. The category ${d.names[1]} contains ${target} of ${t} responses. What is its sector angle in DEGREES?`,build:ctl=>{const v=H('input',{class:'nova-input',type:'number',step:1,'aria-label':'Sector angle in degrees'});ctl.appendChild(v);return()=>Number(v.value)},check:n=>[n===theAngle,n===theAngle?`Correct: ${target} × ${360/t}° = ${theAngle}°.`:n===target?'You entered the frequency, not an angle. Multiply by degrees per response.':n===percent(target,t)?'That is the percentage, not the sector angle. Multiply by 360°, not 100.':`Find one response's angle first: 360° ÷ ${t} = ${360/t}°.`],hint:`Divide 360° by ${t}, then multiply by ${target}.`,solve:()=>{}},
 {q:`Which category represents exactly ONE FIFTH of all ${t} responses?`,build:NOVA.choiceTask(d.names.map((n,i)=>({label:n,value:i})),ID),check:v=>{const n=Number(v);const ok=n>=0&&n<4&&d.counts[n]===oneFifth;return[ok,ok?`Correct: ${oneFifth} of ${t} responses is 20% of the full circle.`:Number.isInteger(n)&&n>=0&&n<4?`That category has ${d.counts[n]} responses. One fifth of ${t} equals ${oneFifth}.`:'Choose a category before checking.'];},hint:`Divide the total ${t} into five equal shares.`,solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,tasks,paint,CONFIG);CONFIG._challenge=()=>({counts:chall.counts.slice(),task:currentTask,expectedAngle:theAngle});
}
const DEF={id:ID,title:'Pie Chart Builder',config:CONFIG,steps:STEPS,render:watch,
 alt:'Neon pie chart with four labelled sectors proportional to a frequency table. Four modes: Watch, Guided, Explore and Challenge.',
 staticAlt:'The angles of pie sectors show their category frequency as a proportion of the whole. All sector angles total 360 degrees.',
 exploreIntro:'Move the boundary handles to redistribute whole responses between adjacent sectors without changing the total.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"ROLES":()=>ROLES,"STEPS":()=>STEPS},draws:{"scene":["stage","opt"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·04',title:'Pie chart builder',def:DEF,
 years:'Year 7 KS3; Year 8–9 and GCSE proportional interpretation and misleading visual comparisons.',linked:['F0-02','F0-03','F0-04','F16-01','F16-02','F16-14'],
 spec:{purpose:'Construct an accurate pie chart from category frequencies; convert to angles and percentages and read sector proportions.',
 params:'Four distinct categories; 20 responses; sector angles 18 degrees per response; full 360 degree circle; integer frequency reallocations.',
 presets:'Y7-067 Clubs · Travel to school · Lunch choices, with different category distributions.',
 steps:'Collect counts → Add total → Convert each response to degrees → Draw four sectors → Compare percentages → Validate the full 360 degrees.',
 interactions:'Adjust sector boundaries by fast pointer drag and constrained snap; keyboard arrows; input frequencies; return to original; category selection.',
 traps:'Confusing frequency and percentage; using 100 instead of 360 when finding an angle; counting one person twice; sector-angle totals not 360.',
 gcse:'Explore proportional changes, sector-angle precision and how sector size supports relative comparison.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>{log.textContent='';};}
})();
