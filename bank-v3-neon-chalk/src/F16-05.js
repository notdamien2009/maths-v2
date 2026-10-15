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

/* NOVA F16-05 · Stem-and-leaf plot · additive data lesson, F0/F2 canonical shared core unchanged. */
(function(){'use strict';
const H=NOVA.h,S=NOVA.svg,E=S.el,MOT=NOVA.motion,ID='F16-05';
const C=window.NovaV2Integration.configuration(window.NOVA_F16_05_CONFIG={preset:'construct',events:['value','step','mode','hintUsed','correct'],presets:{
 construct:{label:'Y7-068 · Construct a stem-and-leaf',title:'Mathematics quiz scores',context:'Sixteen pupils took a maths quiz.',A:[12,14,14,18,21,23,25,26,26,31,33,34,37,41,43,48],chips:{A:[2,7,14]},two:false},
 compare:{label:'Y7-070 · Compare distributions',title:'Two teams · training scores',context:'Compare fifteen scores for each team.',A:[12,14,18,21,23,25,26,31,33,34,37,41,43,45,48],B:[11,15,19,20,22,27,28,29,30,32,36,38,40,42,44],chips:{A:[6,12],B:[4,11]},two:true}
 }});
const STEPS=[
 {name:'Meet the raw data',pose:'count',narration:'Start with unsorted measurements. Every number must appear once in the diagram.',prompt:'Which numbers belong in the same tens group?'},
 {name:'Create the stems',pose:'point-down',narration:'Write a stem for each tens group in numerical order. Each stem represents a set of tens.',prompt:'What would a stem of three represent?'},
 {name:'Split tens and units',pose:'explain',narration:'The tens digit goes on the stem. The units digit becomes a leaf. Twenty six becomes stem two and leaf six.',prompt:'What are the stem and leaf for thirty seven?'},
 {name:'Add the first rows',pose:'count',narration:'Put each unit leaf beside its correct tens stem. Never omit an observation, even when numbers repeat.',prompt:'Where should a repeated fourteen be recorded?'},
 {name:'Sort every row',pose:'compare',narration:'Order the leaves from smallest to largest. In a back to back diagram, the left side is read outward from the stem.',prompt:'Why must the units be in order?'},
 {name:'Read the key',pose:'ruler',narration:'The key is essential. Two stroke six means twenty six, not two point six or two hundred and six.',prompt:'How do we read three stroke seven?'},
 {name:'Find the centre',pose:'magnify',narration:'Read the middle values using the ordered observations. With an even number of values, average the two middle values.',prompt:'Where is the median in an ordered set?'},
 {name:'Compare the spread',pose:'compare',narration:'Find the range by subtracting the smallest value from the largest. Compare centres and spreads fairly.',prompt:'What do the median and range tell us?'},
 {name:'Explain the completed plot',pose:'celebrate',narration:'Check the key, count all leaves and explain what the ordered data shows.',prompt:'Do the number of leaves and number of observations agree?'}
];
function preset(){return C.presets[C.preset];}
function data(d,g){return d[g]||[];}
function chipDefs(d){return Object.entries(d.chips).flatMap(([g,ids])=>ids.map(i=>({id:g+'-'+i,group:g,value:d[g][i],index:i})));}
function fresh(d=preset()){return {placed:Object.fromEntries(chipDefs(d).map(c=>[c.id,false])),selected:'A'};}
let exploreState=fresh(),challengeState=fresh();
function emit(key,value){NOVA.events.emit('value',{engine:ID,key,control:key,value});}
function median(a){let b=a.slice().sort((x,y)=>x-y),n=b.length;return n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2;}
function range(a){return Math.max(...a)-Math.min(...a);}
function ctext(p,x,y,t,role='given',size=23,anchor='middle'){return NOVA.chalkText(p,x,y,String(t),{role,size,anchor});}
function frame(){const mobile=innerWidth<=540;return mobile?{W:450,H:877,mobile,ty:43,head:170,rowYs:[220,305,390,475],center:225,trayY:656,removeY:736,keyY:545,bottomY:850}:{W:770,H:804,mobile,ty:43,head:140,rowYs:[181,259,337,415],center:385,trayY:586,removeY:673,keyY:492,bottomY:765};}
function isChip(d,g,i){return(d.chips[g]||[]).includes(i);}
function included(d,s,g,i,phase,interactive){if(interactive)return !isChip(d,g,i)||!!s.placed[g+'-'+i];return phase>=4||(phase===3&&Math.floor(d[g][i]/10)<=2)||(phase===2&&Math.floor(d[g][i]/10)===1);}
function leaves(d,s,g,stem,phase,interactive){return data(d,g).map((v,i)=>({v,i,g})).filter(z=>Math.floor(z.v/10)===stem&&included(d,s,g,z.i,phase,interactive)).sort((a,b)=>a.v-b.v||a.i-b.i);}
function valueX(a,d,g,k){if(!d.two)return a.mobile?179+k*43:250+k*59;return a.mobile?(g==='A'?186-35*k:264+35*k):(g==='A'?338-53*k:432+53*k);}
function leafWidth(a,d){return d.two?(a.mobile?30:42):(a.mobile?36:49);}
function centerX(a,d){return d.two?a.center:(a.mobile?122:193);}
function drawPlot(svg,a,d,s,phase,interactive,update,challenge=false){
 const cx=centerX(a,d),top=a.rowYs[0]-46,bottom=a.rowYs[3]+47,lo=a.mobile?28:68,hi=a.W-lo;
 // Core neon lines construct the table; core glass panels contain stems and the movable leaf numbers.
 NOVA.neonLine(svg,lo,top,hi,top,{role:'support',width:2.8});NOVA.neonLine(svg,lo,bottom,hi,bottom,{role:'support',width:2.8});
 NOVA.neonLine(svg,cx-(d.two?29:39),top,cx-(d.two?29:39),bottom,{role:'focus',width:2.6});NOVA.neonLine(svg,cx+(d.two?29:39),top,cx+(d.two?29:39),bottom,{role:'focus',width:2.6});
 for(let n=1;n<4;n++)NOVA.neonLine(svg,lo,a.rowYs[n]-43,hi,a.rowYs[n]-43,{role:'support',width:1.4});
 if(d.two){ctext(svg,a.mobile?112:212,top-20,'Team A','given',24);ctext(svg,cx,top-20,'Stem','focus',22);ctext(svg,a.mobile?344:563,top-20,'Team B','result',24);}
 else{ctext(svg,cx,top-20,'Stem','focus',23);ctext(svg,a.mobile?304:479,top-20,'Ordered leaves','given',24);}
 [1,2,3,4].forEach((stem,k)=>{
  const y=a.rowYs[k];NOVA.neonBox(svg,cx-27,y-24,54,49,{role:'focus'});ctext(svg,cx,y+9,stem,'focus',31);
  if(phase<2&&!interactive)return;
  for(const g of (d.two?['A','B']:['A'])){
   const ll=leaves(d,s,g,stem,phase,interactive);ll.forEach((ob,i)=>{
    const x=valueX(a,d,g,i),w=leafWidth(a,d),h=a.mobile?44:46,id=g+'-'+ob.i,isMovable=interactive&&isChip(d,g,ob.i),role=isMovable?'result':g==='B'?'op':'given';
    const group=E('g',{class:'f16s-leaf',...(isMovable?{'data-chip':id,tabindex:'0',role:'button','aria-label':`Move ${ob.v} from ${g} stem ${stem} or remove it`}:{} )},svg);
    NOVA.neonBox(group,x-w/2,y-h/2,w,h,{role});ctext(group,x,y+8,ob.v%10,role,a.mobile?24:27);
    if(isMovable)enableDrag(group,svg,a,d,s,{id,group:g,value:ob.v},x,y,w,h,update);
    else if(!interactive&&phase>=3&&phase<=4&&ob.i===0)MOT.arrive(group,0,9,300);
   });
  }
 });
}
function enableDrag(el,sv,a,d,s,chip,x,y,w,h,update){
 const zones=[1,2,3,4].map(stem=>({id:`stem:${chip.group}:${stem}`,kind:'drop',...dropZone(a,d,chip.group,stem)}));zones.push({id:'remove',kind:'remove',x:a.mobile?277:532,y:a.removeY,w:a.mobile?144:161,h:47});
 NOVA.ui.svgDrag(sv,el,{box:{x:x-w/2,y:y-h/2,w,h},zones:()=>zones.filter(z=>z.kind==='remove'||Number(z.id.split(':')[2])===Math.floor(chip.value/10)),onDrop:id=>{
  if(id!==`stem:${chip.group}:${Math.floor(chip.value/10)}`)return false;
  s.placed[chip.id]=true;emit('placement',{id:chip.id,value:chip.value,stem:Math.floor(chip.value/10)});update();return true;
 },onRemove:()=>{s.placed[chip.id]=false;emit('remove',chip.id);update();},removeTo:{x:a.mobile?349:612,y:a.removeY+23}});
 el.addEventListener('pointerdown',e=>{try{el.setPointerCapture(e.pointerId)}catch(_){}});
 el.addEventListener('keydown',e=>{if(!['Enter',' ','ArrowUp','ArrowDown','Delete','Backspace','Escape'].includes(e.key))return;
 e.preventDefault();if(['Delete','Backspace','Escape'].includes(e.key)){s.placed[chip.id]=false;emit('remove',chip.id);}else{s.placed[chip.id]=true;emit('placement',{id:chip.id,value:chip.value});}update();});
}
function dropZone(a,d,g,stem){let cx=centerX(a,d),w,y=a.rowYs[stem-1]-37,h=73;
 if(d.two){const x=g==='A'?(a.mobile?25:65):cx+32;w=a.mobile?cx-58:cx-100;return {x,y,w,h};}
 return {x:cx+39,y,w:a.W-(a.mobile?30:70)-(cx+39),h};}
function drawTray(svg,a,d,s,update){
 const chips=chipDefs(d),len=chips.length,m=a.mobile,sep=m?97:133,off=a.W/2-(len-1)*sep/2,w=m?76:91;
 ctext(svg,m?26:70,a.trayY-43,'Unplaced data cards', 'support',m?20:23,'start');
 chips.forEach((chip,i)=>{if(s.placed[chip.id])return;
  const x=off+i*sep,y=a.trayY,h=47,el=E('g',{'data-chip':chip.id,tabindex:'0',role:'button','aria-label':`Drag ${chip.value} from team ${chip.group} to its tens stem`},svg);
  NOVA.neonBox(el,x-w/2,y-h/2,w,h,{role:chip.group==='B'?'op':'given'});
  ctext(el,x,y+8,(d.two?chip.group+'·':'')+chip.value,chip.group==='B'?'op':'given',m?22:26);
  enableDrag(el,svg,a,d,s,chip,x,y,w,h,update);
 });
 NOVA.neonBox(svg,m?277:532,a.removeY,m?144:161,47,{role:'error'});ctext(svg,m?349:612,a.removeY+31,'Remove','error',m?23:26);
 ctext(svg,m?27:70,a.removeY+31,'Drag placed leaves here','support',m?17:20,'start');
}
function drawRaw(svg,a,d){
 const groups=d.two?['A','B']:['A'],mobile=a.mobile;
 groups.forEach((g,gi)=>{
  const values=d[g],order=values.length===16?[7,0,13,4,10,2,15,5,1,11,8,14,6,3,12,9]:[6,12,1,9,14,4,0,10,3,11,7,2,13,5,8];
  const cols=d.two?5:4,stepX=d.two?(mobile?83:100):(mobile?101:150),left=d.two?(mobile?58:185):(mobile?73:161);
  const firstY=d.two?(mobile?199+gi*290:181+gi*286):(mobile?206:199),stepY=d.two?(mobile?67:69):(mobile?120:113);
  ctext(svg,a.W/2,firstY-53,d.two?`Team ${g} · ${values.length} raw scores`:`${values.length} unsorted quiz scores`,g==='B'?'op':'given',mobile?24:27);
  order.forEach((k,i)=>{
   const col=i%cols,row=Math.floor(i/cols),x=left+col*stepX,y=firstY+row*stepY,w=mobile?63:77;
   NOVA.neonBox(svg,x-w/2,y-24,w,49,{role:g==='B'?'op':'given'});
   ctext(svg,x,y+9,values[k],g==='B'?'op':'given',mobile?24:27);
  });
 });
 NOVA.neonBox(svg,a.W/2-(mobile?170:227),a.bottomY-117,mobile?340:454,49,{role:'result'});
 ctext(svg,a.W/2,a.bottomY-86,d.two?'Two complete datasets · 30 observations':'Count every repeated score','result',mobile?21:26);
 ctext(svg,a.W/2,a.bottomY-12,'Next: group by tens and order the unit leaves','support',mobile?18:24);
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}

 const d=o.data||preset(),s=o.state||fresh(d),a=frame(),phase=o.phase??8,interactive=!!o.interactive;
 stage.innerHTML='';let svg=S.root(a.W,a.H,`Stem-and-leaf diagram: ${d.title}. The key two stroke six means twenty six. ${d.two?'Team A and Team B share stems.':'Leaves ascend from left to right.'}`);
 svg.classList.add('f16s-plot');svg.setAttribute('role','img');
 ctext(svg,a.W/2,a.ty,d.title,'given',a.mobile?29:33);
 ctext(svg,a.W/2,a.ty+38,d.two?'Back-to-back · shared tens stems':'One digit per leaf · repeated values kept','support',a.mobile?21:24);
 if(phase===0&&!interactive)drawRaw(svg,a,d);
 else{
  drawPlot(svg,a,d,s,phase,interactive,o.update||(()=>{}),!!o.challenge);
  if(phase>=5||interactive){NOVA.neonBox(svg,a.mobile?119:273,a.keyY,a.mobile?211:220,41,{role:'result'});ctext(svg,a.W/2,a.keyY+27,'Key: 2 | 6 = 26','result',a.mobile?24:26);}
  if(phase>=6&&!interactive){let aMed=median(d.A),aRange=range(d.A);ctext(svg,a.W/2,a.trayY+9,d.two?`A median ${aMed} · B median ${median(d.B)}`:`Median ${aMed}  ·  Range ${aRange}`,'given',a.mobile?22:26);if(d.two)ctext(svg,a.W/2,a.trayY+48,`A range ${aRange} · B range ${range(d.B)}`,'support',a.mobile?21:25);}
  if(interactive)drawTray(svg,a,d,s,o.update||(()=>{}));
  if(!interactive&&phase===1){ctext(svg,a.W/2,a.trayY+22,'Stems show tens · leaves will show units','support',a.mobile?23:26);}
  if(interactive||phase>=5){ctext(svg,a.W/2,a.bottomY-5,d.two?'Team A  ←  Stem  →  Team B':'Stem tens | leaf units','support',a.mobile?18:23);}
 }
 stage.appendChild(svg);
 const strips=H('div',{class:'f16s-values'});
 if(phase>0||interactive){strips.append(NOVA.neonTile(`${d.A.length} observations${d.two?' in A':''}`,{role:'given'}),NOVA.neonTile(d.two?`${d.B.length} observations in B`:`Smallest ${Math.min(...d.A)}`,{role:'support'}),NOVA.neonTile(interactive?`${Object.values(s.placed).filter(Boolean).length} cards placed`:'Key 2 | 6 = 26',{role:'result'}));stage.appendChild(strips);}
 NOVA.scene.helperStrip(stage,o.pose||'count',o.speech||'The stem is the tens digit. The leaf is the units digit.');return svg;
}
function watch(i,stage){const d=preset(),st=fresh(d),s=STEPS[i];let msg=[
 'First look at the unsorted raw scores. Every repeated score is still a separate observation.',
 'A stem of one covers numbers from ten to nineteen, two from twenty to twenty nine, and so on.',
 'Twelve splits into stem one and leaf two. Twenty six splits into stem two and leaf six.',
 'Place the observations into the correct tens row, including two leaves for duplicate scores.',
 'Now put each set of leaf digits in ascending order, keeping repeated digits.',
 'Always include the key: two stroke six means twenty six.',
 `In ${d.title}, the median of ${d.two?'Team A':'the scores'} is ${median(d.A)}. Order the observations before finding the middle.`,
 d.two?`Team A ranges across ${range(d.A)} points and Team B across ${range(d.B)}. Compare both middle and spread.`:`The range is ${Math.max(...d.A)} minus ${Math.min(...d.A)} which equals ${range(d.A)}.`,
 'Check that all the leaves are present and that each row is ordered. Read the key again.'
 ][i];scene(stage,{data:d,state:st,phase:i,pose:s.pose,speech:msg});}
function select(label,entries){const el=H('select',{class:'nova-input','aria-label':label});entries.forEach(([id,name])=>el.appendChild(H('option',{value:String(id),text:String(name)})));return el;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let d=preset();window.NovaLessonComponent?.applyExploreModels();exploreState=fresh(d);
 window.NovaLessonComponent?.applyExploreModels();const pre=select('Lesson preset',Object.entries(C.presets).map(([k,v])=>[k,v.label])),card=select('Data card',[]),row=select('Tens stem',[[1,'1 (10–19)'],[2,'2 (20–29)'],[3,'3 (30–39)'],[4,'4 (40–49)']]),status=H('p',{class:'f16s-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();pre.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();function paint(){d=preset();card.innerHTML='';chipDefs(d).forEach(k=>card.appendChild(H('option',{value:k.id,text:(d.two?`Team ${k.group}: `:'')+k.value+(exploreState.placed[k.id]?' · placed':' · tray')})));
  scene(stage,{data:d,state:exploreState,interactive:true,pose:'point-down',speech:'Drag each score into its correct tens row. The leaf digits sort automatically; drag a placed leaf to Remove if you want to try again.',update:paint});
  status.textContent=`${Object.values(exploreState.placed).filter(Boolean).length} of ${chipDefs(d).length} data cards placed. `+(d.two?`Team A median ${median(d.A)}, range ${range(d.A)}; Team B median ${median(d.B)}, range ${range(d.B)}.`:`The completed dataset has median ${median(d.A)} and range ${range(d.A)}.`);
 }
 window.NovaLessonComponent?.applyExploreModels();function place(){const ch=chipDefs(d).find(x=>x.id===card.value),stem=Number(row.value);if(!ch)return;
  if(Math.floor(ch.value/10)!==stem){status.textContent=`${ch.value} belongs with stem ${Math.floor(ch.value/10)}; you chose stem ${stem}. The tens digit determines the row.`;emit('invalidStem',{value:ch.value,attempt:stem});return;}
  exploreState.placed[ch.id]=true;emit('placement',{id:ch.id,value:ch.value,stem});paint();}
 window.NovaLessonComponent?.applyExploreModels();pre.onchange=()=>{C.preset=pre.value;exploreState=fresh();emit('preset',C.preset);paint()};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f16s-instruction',text:'Drag glowing number cards into the matching tens row. Re-grab a placed leaf or drag it to the red Remove zone. Every placement is sorted automatically. The controls below provide a keyboard alternative.'}),H('div',{class:'f16s-controls'},[
  H('label',{class:'f16s-label'},['Lesson',pre]),H('label',{class:'f16s-label'},['Data card',card]),H('label',{class:'f16s-label'},['Target stem',row]),
  H('button',{class:'nova-btn primary',text:'Place card',onclick:place}),H('button',{class:'nova-btn',text:'Remove selected',onclick:()=>{exploreState.placed[card.value]=false;emit('remove',card.value);paint();}}),
  H('button',{class:'nova-btn ghost',text:'Reset diagram',onclick:()=>{exploreState=fresh();emit('reset',true);paint();}})
 ]),status);window.NovaLessonComponent?.applyExploreModels();paint();
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({placed:{...exploreState.placed},preset:C.preset,values:A=>data(preset(),A).slice()}),selectPreset:v=>{pre.value=v;pre.onchange()},place:(id,stem)=>{card.value=id;row.value=String(stem);place()},remove:id=>{exploreState.placed[id]=false;paint()},reset:()=>{exploreState=fresh();paint()}};
}
function challenge(panel,api,stage){const d=preset(),chips=chipDefs(d),target=chips.find(z=>Math.floor(z.value/10)===2)||chips[0];
 challengeState=fresh(d);Object.keys(challengeState.placed).forEach(k=>challengeState.placed[k]=true);challengeState.placed[target.id]=false;
 let task=0;const keyTarget=37,compare=d.two,answer2=compare?median(d.A)-median(d.B):median(d.A),label=compare?'How many points greater is Team A’s median than Team B’s median?':'What is the median of the complete dataset?';
 const kb=H('div',{class:'f16s-controls'},[H('button',{class:'nova-btn',text:`Place ${target.value} in stem ${Math.floor(target.value/10)}`,onclick:()=>{challengeState.placed[target.id]=true;emit('placement',{value:target.value});if(task===0)paint(0);}})]);
 panel.append(H('p',{class:'f16s-instruction',text:'Build the correctly ordered diagram first, then read a value using the key and interpret the middle of the distribution. Task 1 can be completed with a genuine mouse drag or the keyboard button.'}),kb);
 function paint(t){task=t;kb.style.display=t===0?'flex':'none';scene(stage,{data:d,state:challengeState,interactive:t===0,phase:8,challenge:true,pose:t===0?'think':t===1?'ruler':'compare',speech:t===0?`The missing score is ${target.value}. Drag it to its correct tens stem.`:t===1?'Read the stem, then attach the leaf to form one complete number.':'Order all values before working out the median.',update:()=>paint(0)});}
 const tasks=[
  {q:`Place missing score ${target.value} into its correct tens stem. Confirm the score appears among the ordered leaves.`,build:()=>()=>challengeState.placed[target.id],check:v=>[v===true,v===true?`Correct. ${target.value} is stem ${Math.floor(target.value/10)} and leaf ${target.value%10}.`:`${target.value} is missing. Its tens digit is ${Math.floor(target.value/10)}; drag the score to that row, not to the units digit row.`],hint:`Look at the tens digit in ${target.value}. The units digit appears as the leaf.`,solve:()=>{challengeState.placed[target.id]=true;paint(0)}},
  {q:'The key is 2 | 6 = 26. What value does 3 | 7 represent?',build:NOVA.entryTask('Whole number represented by 3 | 7',ID),check:v=>[v===keyTarget,v===keyTarget?'Correct: 3 tens and 7 ones is 37.':v===3.7?'This is not a decimal plot: 3 | 7 is 37, not 3.7.':v===10?'Combine the stem as tens and the leaf as ones; do not add the digits.':'Three is the tens digit and seven is the units digit.'],hint:'3 tens plus 7 units.'},
  {q:label,build:NOVA.entryTask(compare?'Difference between median scores':'Median score',ID),check:v=>[v===answer2,v===answer2?compare?`Correct: Team A median ${median(d.A)} minus Team B median ${median(d.B)} is ${answer2}.`:`Correct: the two middle scores average to ${answer2}.`:compare?`Compare the middle value in each team, then subtract: ${median(d.A)} and ${median(d.B)}.`:`You have ${d.A.length} scores. For an even number, average values ${d.A.length/2} and ${d.A.length/2+1} in the ordered list.`],hint:compare?'Find each team’s median separately before subtracting.':'There are two middle observations when the number of scores is even.'}
 ];
 NOVA.challengeRun(panel,api,tasks,paint,C);C._challengeState=()=>({task,placed:{...challengeState.placed},expectedMedian:answer2,expectedKey:keyTarget});
}
const DEF={id:ID,title:'Stem-and-leaf plot',config:C,steps:STEPS,render:watch,
 alt:'High-fidelity neon stem-and-leaf diagram showing correct tens stems, ordered unit leaves and key. A back-to-back comparison preset is included.',
 staticAlt:'The tens digit is the stem, the units digit is the leaf. Duplicate leaves are retained. A key such as 2 | 6 = 26 explains the notation.',
 exploreIntro:'Drag each raw score into its correct tens stem. Check the ordered leaves and the key.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·05',title:'Stem-and-leaf plot',def:DEF,years:'Year 7 KS3 and later data distributions; GCSE back-to-back comparison.',linked:['F0-02','F0-03','F0-04','F16-01','F16-06','F16-07','F16-08'],spec:{
 purpose:'Construct a mathematically correct stem-and-leaf diagram from individual observations, including repeated values, and interpret the median, range and back-to-back comparison.',
 params:'Tens stems 1–4; units leaves 0–9; integer scores; stable repeated values; one or two distributions; draggable missing observations.',
 presets:'Y7-068 Maths quiz scores · Y7-070 Two teams, back-to-back stem-and-leaf.',
 steps:'Read data → Create stems → Separate tens/units → Place leaves → Sort ascending → Explain key → Median → Range → Interpret.',
 interactions:'Drag unsorted number cards into valid tens rows, re-grab and remove, auto-sort with preserved duplicates, keyboard place/remove, reset and preset switch.',
 traps:'Unordered leaves, dropped repeated scores, incorrect tens rows, interpreting 2 | 6 as 2.6, ignoring the key and using the wrong two middle values.',
 gcse:'Back-to-back distributions, compare medians, compare spread and identify what the diagram does and does not show.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4200);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>{log.textContent='';};}
})();
