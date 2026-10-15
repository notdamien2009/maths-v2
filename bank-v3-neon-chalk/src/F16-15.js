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

/* NOVA F16-15 · Sampling Visual. Pure component code; pinned family core unchanged. */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,ID='F16-15';
const CFG=window.NovaV2Integration.configuration(window.NOVA_F16_15_CONFIG={preset:'y7-065',events:['value','selected','removed','method','preset','step','correct','hintUsed','mode','reset'],presets:{
 'y7-065':{lesson:'Y7-065',label:'Y7-065 · Collecting data',title:'Who did we ask?',description:'A school has 60 pupils wearing three team colours. Which 12 could we ask?',groups:['Blue','Orange','Cyan'],counts:[30,18,12],context:'team colours',warning:'A sample only represents the pupils it reaches.'},
 'y9-052':{lesson:'Y9-052',label:'Y9-052 · Sampling and bias',title:'Do we represent the school?',description:'Of 60 journeys to school, 30 walk, 18 use the bus and 12 cycle.',groups:['Walk','Bus','Cycle'],counts:[30,18,12],context:'travel choices',warning:'Asking only at the cycle shelter gives a biased sample.'}
 }});
const preset=()=>CFG.presets[CFG.preset];
const ROLES=['given','focus','op'];const SIZE=12, POP=60;
const groupOf=id=>id<30?0:id<48?1:2;
const quotas=q=>{const raw=q.counts.map(v=>v*SIZE/POP),a=raw.map(Math.floor);let left=SIZE-a.reduce((x,y)=>x+y,0);let order=raw.map((v,i)=>({i,r:v-Math.floor(v)})).sort((x,y)=>y.r-x.r||x.i-y.i);for(let i=0;i<left;i++)a[order[i].i]++;return a;};
const REPS={balanced:[2,7,13,20,24,29,31,37,42,46,49,56],convenience:Array.from({length:SIZE},(_,i)=>48+i)};
function randomDraw(seed){let a=Array.from({length:POP},(_,i)=>i),v=(seed>>>0)||12345;for(let i=a.length-1;i>0;i--){v=(Math.imul(v,1664525)+1013904223)>>>0;let j=v%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,SIZE).sort((a,b)=>a-b);}
function stratifiedDraw(){const a=[],q=quotas(preset());for(let c=0;c<3;c++){let start=c===0?0:c===1?30:48;let width=preset().counts[c];for(let k=0;k<q[c];k++)a.push(start+Math.floor((k+.5)*width/q[c]));}return a.sort((x,y)=>x-y);}
const STEPS=[
{name:'Meet the population',pose:'count',narration:'These sixty pupils are the whole population for this question. Each ring stands for one pupil.',prompt:'Who belongs to the population?'},
{name:'Count the groups',pose:'point-down',narration:'We record thirty in the first group, eighteen in the second and twelve in the third.',prompt:'How many people are in each group?'},
{name:'Choose a smaller sample',pose:'show-one',narration:'A sample is a smaller group selected from the population. Our sample will contain twelve pupils.',prompt:'Why might we use a sample?'},
{name:'Take a random sample',pose:'question',narration:'In a simple random sample, every pupil should have an equal chance of selection.',prompt:'Could chance still produce an uneven sample?'},
{name:'Compare the proportions',pose:'compare',narration:'Compare the proportion in the sample with the proportion in the whole population.',prompt:'Are the proportions exactly the same?'},
{name:'Use stratified sampling',pose:'count',narration:'If the groups are important, we can sample proportionally from each: six, four and two pupils.',prompt:'Why do proportional samples match the groups?'},
{name:'See a convenient sample',pose:'magnify',narration:'If we ask only pupils in the final group, we fail to include the other groups.',prompt:'Who is missing from the sample?'},
{name:'Identify the sampling bias',pose:'think',narration:'This convenience sample has a systematic bias. It does not represent the whole population.',prompt:'Is this evidence about everyone?'},
{name:'Improve the method',pose:'ruler',narration:'Choose fairly across the population, record how you selected pupils and check whom you left out.',prompt:'How would you improve the survey?'},
{name:'Give a careful conclusion',pose:'celebrate',narration:'Describe the sampled group, its method and any uncertainty before making a claim about the population.',prompt:'What can the evidence support?'}
];
const say=(svg,x,y,t,role='given',size=27,anchor='middle')=>NOVA.chalkText(svg,x,y,String(t),{role,size,anchor});
const box=(svg,x,y,w,h,role='given',r=12)=>NOVA.neonBox(svg,x,y,Math.max(2,w),Math.max(2,h),{role,r});
const line=(svg,x,y,X,Y,role='given',w=3)=>NOVA.neonLine(svg,x,y,X,Y,{role,width:w});
function emit(key,value){NOVA.events.emit('value',{engine:ID,key,value});}
function L(){const m=innerWidth<=540,W=m?450:800;return {m,W,H:m?1270:1240,x0:m?72:185,dx:m?34:47,dy:m?48:50,gridTop:m?327:319,legendTop:m?175:169,tray:{x:m?51:163,y:684,w:m?348:475,h:145},remove:{x:m?315:648,y:856,w:m?111:120,h:67},slotX:m?64:183,slotDX:m?55:75,slotW:m?49:66,slotH:47,slotY:698,compareTop:m?993:988};}
function counts(selected){const c=[0,0,0];for(const i of selected)c[groupOf(i)]++;return c;}
function ratio(c){return c.map(v=>Math.round(100*v/Math.max(c.reduce((a,b)=>a+b,0),1)));}
function shortLines(s,max){let rows=[''];for(const word of s.split(' ')){let j=rows.length-1,add=(rows[j]+' '+word).trim();if(add.length>max)rows.push(word);else rows[j]=add;}return rows;}
const svgRoot=l=>{let svg=NOVA.svg.root(l.W,l.H,'Sampling 60 pupils: colour-coded population of dots and selected sample of twelve, with proportion comparisons.');svg.setAttribute('class','nv-svg f1615-svg');svg.setAttribute('role','img');return svg;};
function popPos(id,l){return {x:l.x0+(id%10)*l.dx,y:l.gridTop+Math.floor(id/10)*l.dy};}
function summaryCaption(svg,l,selected,kind,phase){const q=preset(),a=counts(selected),n=selected.length,p=ratio(a);
 let yy=l.compareTop-26;say(svg,l.W/2,yy,n?'Sample shares versus the population':'Population proportions', 'focus',l.m?23:29);
 const baseY=l.compareTop+16;
 q.groups.forEach((name,i)=>{let y=baseY+i*(l.m?67:68),x=l.m?50:121,w=l.m?275:462;
  say(svg,x,y+12,name,'support',l.m?22:26,'start');
  const by=y+23,full=Math.round(w*q.counts[i]/POP),samp=Math.round(w*a[i]/Math.max(n,1));
  box(svg,x,by,w,12,'given',5);box(svg,x,by,Math.max(2,full),12,ROLES[i],5);
  if(n)box(svg,x,by+20,Math.max(2,samp),11,'result',5);
  say(svg,l.m?397:668,by+13,`${Math.round(q.counts[i]/POP*100)}%`,ROLES[i],l.m?22:26,'end');
  if(n)say(svg,l.m?397:668,by+38,`${p[i]}%`, 'result',l.m?21:25,'end');
 });

}
function stageScene(stage,{selected=[],interactive=false,method='manual',phase=9,challenge=false,challengeTask=0,update=()=>{},speech,pose}={}){
window.NovaLessonComponent?.applyModels();

 stage.innerHTML='';const l=L(),q=preset();let shown=selected;
 const svg=svgRoot(l);let title=q.title;if(title.length>26&&l.m)title='Choosing a fair sample';say(svg,l.W/2,56,title,'focus',l.m?32:39);
 shortLines(q.description,l.m?29:56).slice(0,2).forEach((s,i)=>say(svg,l.W/2,106+i*32,s,'support',l.m?22:26));
 const legendW=l.m?114:175,gap=l.m?8:12,left=(l.W-(legendW*3+gap*2))/2;
 q.groups.forEach((g,i)=>{const x=left+i*(legendW+gap),y=l.legendTop;box(svg,x,y,legendW,81,ROLES[i],14);say(svg,x+legendW/2,y+35,g,ROLES[i],l.m?23:27);say(svg,x+legendW/2,y+68,`${q.counts[i]} / 60`,'given',l.m?22:27);});
 say(svg,l.W/2,l.gridTop-44,'Population · 60 pupils','focus',l.m?27:32);
 let selectedSet=new Set(selected);
 const regions={sample:{id:'sample',kind:'drop',...l.tray},remove:{id:'remove',kind:'remove',...l.remove}};
 // Population: original 60 observations always remain visible and unique.
 for(let id=0;id<POP;id++){
  const pos=popPos(id,l),isSelected=selectedSet.has(id),cat=groupOf(id);
  const g=E('g',{},svg);g.setAttribute('data-person-id',id);g.setAttribute('role','button');g.setAttribute('tabindex',interactive&&id===(CFG._focusPerson||0)?'0':'-1');g.setAttribute('aria-label',`${q.groups[cat]} pupil ${id+1}. ${isSelected?'Selected':'Not selected'}. Press Space to ${isSelected?'remove':'add'}.`);
  if(isSelected)box(g,pos.x-(l.m?18:23),pos.y-(l.m?18:23),l.m?36:46,l.m?36:46,'result',11);
  NOVA.neonRing(g,pos.x,pos.y,{role:ROLES[cat],r:l.m?12:15});
  if(interactive){
   g.addEventListener('focus',()=>CFG._focusPerson=id);
   g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='ArrowDown'){
    e.preventDefault();const inc={ArrowRight:1,ArrowLeft:-1,ArrowUp:-10,ArrowDown:10}[e.key];let n=Math.max(0,Math.min(59,id+inc));CFG._focusPerson=n;svg.querySelectorAll('[data-person-id]').forEach(node=>node.setAttribute('tabindex',node.getAttribute('data-person-id')===String(n)?'0':'-1'));svg.querySelector(`[data-person-id="${n}"]`)?.focus();return;}
    if(e.key===' '||e.key==='Enter'){e.preventDefault();if(isSelected)update('remove',id);else update('add',id);}});
   NOVA.ui.svgDrag(svg,g,{box:{x:pos.x-(l.m?14:18),y:pos.y-(l.m?14:18),w:l.m?28:36,h:l.m?28:36},zones:()=>[regions.sample,regions.remove],onDrop:dest=>{if(dest!=='sample')return false;return update('add',id);},onRemove:()=>update('remove',id)});
   g.addEventListener('pointerdown',ev=>{try{g.setPointerCapture(ev.pointerId)}catch(_){}});
  }
 }
 say(svg,l.W/2,642,`Selected ${selected.length} of ${SIZE}`,'result',l.m?29:34);
 box(svg,l.tray.x,l.tray.y,l.tray.w,l.tray.h,'given',17);
 // Build all sample slots; selected people can be re-grabbed from these placements.
 for(let i=0;i<SIZE;i++){
  const col=i%6,row=Math.floor(i/6),x=l.slotX+col*l.slotDX,y=l.slotY+row*61,id=selected[i],filled=id!==undefined;
  if(filled){const g=E('g',{},svg);g.dataset.sampleId=String(id);g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`${q.groups[groupOf(id)]} sample card ${id+1}. Press Space to remove; drag to Remove.`);
   box(g,x,y,l.slotW,l.slotH,ROLES[groupOf(id)],10);say(g,x+l.slotW/2,y+32,String(id+1),'given',l.m?22:25);
   if(interactive){g.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();update('remove',id);}});
    NOVA.ui.svgDrag(svg,g,{box:{x,y,w:l.slotW,h:l.slotH},zones:()=>[regions.remove],onDrop:()=>false,onRemove:()=>update('remove',id)});
    g.addEventListener('pointerdown',ev=>{try{g.setPointerCapture(ev.pointerId)}catch(_){}});
   }
  }else{box(svg,x,y,l.slotW,l.slotH,'given',10);say(svg,x+l.slotW/2,y+32,'·','support',l.m?23:26);}
 }
 box(svg,l.remove.x,l.remove.y,l.remove.w,l.remove.h,'op',14);
 say(svg,l.remove.x+l.remove.w/2,l.remove.y+39,'Remove','op',l.m?23:28);
 if(interactive&&!selected.length)say(svg,l.m?153:265,904,'Drop pupils into sample','support',l.m?20:25);
 const stats=counts(selected),pcts=ratio(stats);

 summaryCaption(svg,l,selected,method,phase);
 stage.append(svg);
 const tags=H('div',{class:'f1615-readouts'});tags.append(NOVA.neonTile(`${selected.length} / 12 selected`,{role:'result'}),NOVA.neonTile(method==='stratified'?'Proportional sample':method==='random'?'Random sample':method==='convenience'?'Convenience sample':'Build your sample',{role:method==='convenience'?'op':'focus'}));stage.append(tags);
 NOVA.scene.helperStrip(stage,pose||'count',speech||'Look at who was selected. Does the sample reflect the whole population?');return svg;
}
function sampleByStep(i){if(i<2)return [];if(i===2)return [2,51];if(i===3)return randomDraw(31).slice(0,5);if(i===4)return randomDraw(31);if(i===5)return stratifiedDraw();if(i===6||i===7)return REPS.convenience;if(i===8||i===9)return stratifiedDraw();return [];}
function stepMethod(i){return i===5||i>=8?'stratified':i===6||i===7?'convenience':i>=3?'random':'manual';}
function watch(i,stage){stageScene(stage,{selected:sampleByStep(i),method:stepMethod(i),phase:i,pose:STEPS[i].pose,speech:STEPS[i].narration});}
function choice(label,arr){let s=H('select',{class:'nova-input','aria-label':label});arr.forEach(([v,t])=>s.append(H('option',{value:v,text:t})));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let picked=[],method='manual',seed=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("seed",()=>(31)):(31));
 window.NovaLessonComponent?.applyExploreModels();const lesson=choice('Lesson preset',Object.entries(CFG.presets).map(([id,p])=>[id,p.label]));window.NovaLessonComponent?.applyExploreModels();lesson.value=CFG.preset;
 window.NovaLessonComponent?.applyExploreModels();const randomBtn=H('button',{class:'nova-btn',text:'Random 12'}),stratBtn=H('button',{class:'nova-btn primary',text:'Proportional 12'}),conBtn=H('button',{class:'nova-btn',text:'Convenience 12'}),clearBtn=H('button',{class:'nova-btn ghost',text:'Clear sample'}),status=H('p',{role:'status',class:'f1615-status'});
 window.NovaLessonComponent?.applyExploreModels();function render(){stageScene(stage,{selected:picked,interactive:true,method,phase:9,pose:method==='convenience'?'not-yet':picked.length===SIZE?'compare':'count',speech:method==='convenience'?preset().warning:method==='stratified'?'Six, four and two pupils preserve the population proportions approximately.':picked.length===SIZE?'Read the counts. Which groups were over- or under-represented?':'Drag coloured pupils into the sample, or focus a pupil and press Space.',update:modify});let a=counts(picked);status.textContent=`${picked.length} of 12 selected · ${preset().groups.map((g,i)=>`${g}: ${a[i]}`).join(' · ')}`;}
 window.NovaLessonComponent?.applyExploreModels();function modify(type,id){const has=picked.includes(id);if(type==='add'&&!has&&picked.length<SIZE){picked=[...picked,id];method='manual';emit('selected',{id,count:picked.length});render();return true;}if(type==='remove'&&has){picked=picked.filter(v=>v!==id);method='manual';emit('removed',{id,count:picked.length});render();return true;}return false;}
 window.NovaLessonComponent?.applyExploreModels();lesson.onchange=()=>{CFG.preset=lesson.value;picked=[];method='manual';render();emit('preset',CFG.preset)};
 window.NovaLessonComponent?.applyExploreModels();randomBtn.onclick=()=>{picked=randomDraw(++seed*97);method='random';emit('method',method);render();};window.NovaLessonComponent?.applyExploreModels();stratBtn.onclick=()=>{picked=stratifiedDraw();method='stratified';emit('method',method);render();};window.NovaLessonComponent?.applyExploreModels();conBtn.onclick=()=>{picked=[...REPS.convenience];method='convenience';emit('method',method);render();};window.NovaLessonComponent?.applyExploreModels();clearBtn.onclick=()=>{picked=[];method='manual';emit('reset',true);render();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f1615-help',text:'Every dot is one person. Drag a pupil into the outlined sample, or press Space on a focused dot. Drag a sample card to the red Remove zone to take it out. Compare random, proportional and convenient samples.'}),H('div',{class:'f1615-controls'},[H('label',{},['Lesson',lesson]),randomBtn,stratBtn,conBtn,clearBtn]),status);window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,selected:[...picked],counts:counts(picked),method,quota:quotas(preset()),size:picked.length}),setLesson:k=>{lesson.value=k;lesson.onchange()},setMethod:m=>({random:randomBtn,stratified:stratBtn,convenience:conBtn,clear:clearBtn})[m]?.click(),add:id=>modify('add',id),remove:id=>modify('remove',id)};
}
function challenge(panel,api,stage){let picked=[],task=0;const q=preset(),quota=quotas(q);
 function modify(type,id){let yes=picked.includes(id);if(type==='add'&&!yes&&picked.length<SIZE){picked=[...picked,id];emit('selected',{challenge:true,id,count:picked.length});render();return true;}if(type==='remove'&&yes){picked=picked.filter(v=>v!==id);emit('removed',{challenge:true,id,count:picked.length});render();return true;}return false;}
 function render(){stageScene(stage,{selected:task===2?REPS.convenience:picked,interactive:task===0,method:task===2?'convenience':'manual',challenge:true,challengeTask:task,pose:task===2?'think':task===0?'count':'compare',speech:task===0?'Build a twelve-person sample that represents all three groups in proportion.':task===1?'Use the whole population, not only the people who were sampled.':'A sample from only one group does not justify claims about everyone.',update:modify});}
 const tasks=[
 {q:'Create a proportional sample of 12. Select pupils to reflect all three groups, then Check.',build:ctl=>{ctl.append(H('p',{class:'f1615-help',text:'Use the population dots and the sample tray above. The population is 30 : 18 : 12.'}));return ()=>counts(picked);},check:a=>{if(picked.length!==SIZE)return [false,`Select exactly twelve pupils first. You have ${picked.length}.`];let diff=a.map((n,i)=>n-quota[i]);if(diff.every(v=>v===0))return [true,'Correct. Six, four and two give a proportional twelve-person sample.'];let n=diff.findIndex(v=>v>0);return [false,n>=0?`You selected too many from ${q.groups[n]}. Compare its share of 60 with the sample of twelve.`:'One group has too few pupils. Multiply its population proportion by twelve.'];},hint:'Work out 30 ÷ 60 × 12, 18 ÷ 60 × 12 and 12 ÷ 60 × 12. Round fairly so the three counts total 12.',solve:()=>{}},
 {q:`What percentage of the entire population belongs to ${q.groups[1]}?`,build:NOVA.entryTask('Population percentage',ID),check:v=>[Math.abs(Number(v)-30)<1e-9,Number(v)===18?'18 is the frequency, not the percentage. Divide by 60 then multiply by 100.':Number(v)===30?'Correct. 18 of 60 is thirty percent.':'Use the population count: 18 out of 60, not 18 out of the sample.'],hint:'18 divided by 60, multiplied by 100.',solve:()=>{}},
 {q:q.lesson==='Y9-052'?'A survey asks only cyclists at the cycle shelter. What is justified?':'A survey interviews only Cyan-team pupils. Which conclusion is justified?',build:ctl=>{let opts=[['','Choose a conclusion…'],['0','The whole school must have the same preference'],['1','The survey describes that one group, not the full school'],['2','A larger share means no bias is possible']];let sel=choice('Evidence-based conclusion',opts);sel.setAttribute('data-bias-choice','1');ctl.append(H('label',{class:'f1615-choice'},['Select the defensible conclusion',sel]));return ()=>sel.value;},check:v=>[v==='1',v==='1'?'Correct. One convenient subgroup cannot represent every pupil.':'A survey of a single group gives no reliable school-wide percentage.'],hint:'Who could not have been selected at this location?',solve:()=>{}}
 ];
 panel.append(H('p',{class:'f1615-help',text:'Use real pupils in the population grid; the selected sample is checked by category and size. A convenient sample is not automatically representative.'}));NOVA.challengeRun(panel,api,tasks,k=>{task=k;render();},CFG);render();CFG._challengeState=()=>({preset:CFG.preset,task,selected:[...picked],counts:counts(picked),quota});}
const DEF={id:ID,title:'Sampling Visual',config:CFG,steps:STEPS,render:watch,alt:'Sixty colour-coded pupil dots with selected sample, sample slots and population-vs-sample comparison bars.',staticAlt:'Sampling can be random or stratified; convenience methods overrepresent pupils who are easier to access. Samples cannot prove population proportions.',exploreIntro:'Build a sample by dragging actual pupils and compare random, proportional and biased selections.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"ROLES":()=>ROLES,"STEPS":()=>STEPS},draws:{},exploreFields:{"seed":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:ID,num:'F16·15',title:'Sampling Visual',def:DEF,years:'Years 7 and 9 KS3 · GCSE sampling extension',linked:['F0-02','F0-04','F16-01','F16-14'],spec:{purpose:'Teach sample, population, selection methods, representativeness and biased inference.',params:'Two lesson presets; 60 people (30/18/12); sample size 12; random, stratified, convenience and manual selection.',presets:'Y7-065 collecting data, Y9-052 sampling and bias',steps:'Introduce population → count groups → sample → random selection → compare proportions → stratify → convenient sample → bias → improve → conclude.',interactions:'Drag pupil dots into a 12-slot sample tray; regrab placed cards to remove; pointer cancellation and keyboard selection; change sampling method.',traps:'A convenient group is the whole population; a sample always precisely matches population proportions; sample count confused with population percentage.',gcse:'Systematic sampling bias, proportional allocation and uncertainty of inference.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,3500)};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
