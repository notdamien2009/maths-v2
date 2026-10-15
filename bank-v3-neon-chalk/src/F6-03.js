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

/* NOVA F6-03 · Sharing in a Ratio · additive, approved F0 neon/chalk core only. */
const F603_CONFIG={
 id:'F6-03',startMode:'watch',preset:'Y7-059',
 parameters:{total:30,ratioA:2,ratioB:3,unit:'£',positiveWholeRatios:true,integerShares:true},
 presets:{
  'Y7-059':{label:'Y7-059 · Share thirty pounds',a:2,b:3,total:30,symbol:'£',names:['Ava','Ben'],context:'Ava and Ben share thirty pounds in the ratio two to three.'},
  'Y7-059-sweets':{label:'Y7-059 · Sweets',a:3,b:2,total:45,symbol:'',names:['Kim','Leo'],context:'Kim and Leo share forty-five sweets in the ratio three to two.'},
  'Y7-059-time':{label:'Y7-059 · Study time',a:1,b:4,total:60,symbol:'',names:['Art','Maths'],context:'Sixty study minutes are shared in the ratio one to four.'},
  'Y7-059-points':{label:'Y7-059 · Team points',a:5,b:7,total:96,symbol:'',names:['Blue','Teal'],context:'Ninety-six points are shared by Blue and Teal in the ratio five to seven.'}
 },
 events:{value:['preset','part','shareAssign','shareRemove','unitPlace','reset','answer','hint','stage'],types:['step','mode','correct','hintUsed']}
};window.F603_CONFIG=F603_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=window.NovaV2Integration.configuration(F603_CONFIG),ID=C.id;
// F6-03-only safety net: some Chromium/Windows SVG pointer captures do not deliver
// pointerup to an SVG group after a very fast pointer exit. Defer to the F0 handler
// first; if that handler never saw the event, finish the shared drag safely.
window.addEventListener('pointerup',e=>{const drag=N.ui._drag;if(!drag||!drag.el?.classList.contains('f603-drag'))return;
 Promise.resolve().then(()=>{if(N.ui._drag===drag)drag.up(e);});},true);

const STEPS=[
 {name:'Deal counters into ratio groups',narration:'The ratio two to three tells us to make two equal parts for Ava and three equal parts for Ben. These are parts, not pounds yet.',caption:'Count the parts first!',pose:'count'},
 {name:'Build the equal-part bar',narration:'Every outlined box stands for the same quantity. Ava gets two boxes and Ben gets three. None is worth more than another.',caption:'All boxes have equal value.',pose:'point'},
 {name:'Count the whole and total parts',narration:'Two parts plus three parts gives five parts altogether. Those five equal parts make the full thirty pounds.',caption:'How many boxes altogether?',pose:'count'},
 {name:'Find the value of one part',narration:'Divide the total thirty pounds by five equal parts. One part is worth six pounds. Every box is worth the same six pounds.',caption:'Total divided by parts.',pose:'idea'},
 {name:'Build the first share',narration:'Ava has two equal parts. Two lots of six pounds makes twelve pounds for Ava.',caption:'Two parts make twelve.',pose:'point'},
 {name:'Build the second share',narration:'Ben has three equal parts. Three lots of six pounds makes eighteen pounds for Ben.',caption:'Three parts make eighteen.',pose:'count'},
 {name:'Prove the total and ratio',narration:'Twelve pounds plus eighteen pounds gives thirty pounds. And twelve to eighteen simplifies to two to three. Both tests agree.',caption:'Both checks agree!',pose:'celebrate'}
];
function unit(p){return p.total/(p.a+p.b);}function shares(p){return [p.a*unit(p),p.b*unit(p)];}
function fmt(p,v){return p.symbol+String(v);}function parts(p){return p.a+p.b;}
function validate(p){return Number.isInteger(p.a)&&Number.isInteger(p.b)&&p.a>0&&p.b>0&&Number.isInteger(p.total)&&p.total>0&&p.total%(p.a+p.b)===0;}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unknown F6-03 value event: '+key);N.events.emit('value',{engine:ID,key,value});}
function chalk(svg,x,y,t,role='given',size=27){return N.chalkText(svg,x,y,String(t),{role,size});}
// Keep the counter-count labels ABOVE the unit bars with a real clearance in every preset.
// The original bars began at y268 / y258 while the part labels ended near y276 / y272.
// A dedicated label-to-bar breathing band also protects 5:7 (two counter rows on mobile).
function geom(mobile){return mobile?
 {W:470,H:1210,x:24,w:422,top:340,cellH:145,braceY:520,totalY:578,slotsY:727,slotW:198,slotH:164,slotGap:12,chipY:984,chipW:94,chipH:82,counterY:153,letterY:669,returnX:151,returnY:1092,returnW:168,returnH:61,captionY:640}:
 {W:1130,H:990,x:103,w:916,top:318,cellH:155,braceY:513,totalY:586,slotsY:664,slotW:365,slotH:166,slotGap:32,chipY:866,chipW:150,chipH:66,counterY:149,letterY:619,returnX:920,returnY:864,returnW:166,returnH:65,captionY:640};}
function shapeCounter(svg,x,y,role,size,animation){const grp=E('g',{class:'f603-counter','aria-hidden':'true'},svg);N.neonRing(grp,x,y,{role,r:size,pulse:false});if(animation&&!N.reducedMotion())M.arrive(grp,-21,0,410,M.ease.spring);return grp;}
function drawGroups(svg,p,G,step){const gap=G.W<=470?35:45,base=G.W<=470?60:338,r=G.W<=470?10:13;
 chalk(svg,G.W/2,55,'ONE WHOLE · TWO SHARES','given',G.W<=470?26:43);
 chalk(svg,G.W/2,96,p.a+' : '+p.b,'focus',G.W<=470?44:57);
 chalk(svg,G.W/2,124,'COUNT THE PARTS','op',G.W<=470?22:30);
 const first=G.W<=470?58:290,second=G.W<=470?270:795;
 for(let side=0;side<2;side++){
  const count=side===0?p.a:p.b,role=side===0?'given':'op';const cx=side===0?first:second;
  chalk(svg,cx,G.counterY+8,side===0?p.names[0]:p.names[1],role,G.W<=470?22:32);
  for(let j=0;j<count;j++){const cols=G.W<=470?Math.min(count,5):Math.min(count,7),col=j%cols,row=Math.floor(j/cols),xx=cx+(col-(cols-1)/2)*(G.W<=470?24:37),yy=G.counterY+49+row*(G.W<=470?29:36);shapeCounter(svg,xx,yy,role,r,step===0);}
  chalk(svg,cx,G.counterY+123,count+' '+(count===1?'part':'parts'),role,G.W<=470?22:31);
 }
}
function box(svg,x,y,w,h,role,opts){opts=opts||{};const g=N.neonBox(svg,x,y,w,h,{role,r:12});g.classList.add('f603-unit');if(opts.step===1&&!N.reducedMotion())M.arrive(g,0,23,330,M.ease.out);return g;}
function stageScene(stage,p,o){
if(window.NovaLessonComponent?.active){[stage,p,o]=window.NovaLessonComponent.args("stageScene",arguments);}

 const mob=window.innerWidth<=760,G=geom(mob),u=unit(p),[aVal,bVal]=shares(p),n=parts(p);stage.innerHTML='';
 N.cap(stage,'F6-03 · SHARING IN A RATIO',o.challenge?'YOUR TURN':o.interactive?'BUILD & EXPLORE':'HOW SHARES WORK');
 const frame=H('div',{class:'f603-layout'}),art=H('div',{class:'f603-art'}),side=H('aside',{class:'f603-cards','aria-label':'Ratio evidence cards'});
 const sceneH=o.interactive?G.H:o.challenge?(mob?937:875):(mob?997:930);
 const svg=N.svg.root(G.W,sceneH,'NOVA ratio bar with equal-value neon boxes, an overall total brace and two share trays for sorting values.');svg.classList.add('f603-svg');
 svg.dataset.preset=o.preset||C.preset;svg.dataset.parts=n;svg.dataset.unit=u;
 const step=o.step??6,showBoxes=step>=1||o.interactive||o.challenge,showTotal=step>=2||o.interactive||o.challenge,showUnit=step>=3&&!o.challenge,showA=step>=4&&!o.challenge,showB=step>=5&&!o.challenge,showProof=step>=6&&!o.challenge;
 drawGroups(svg,p,G,step);
 if(showBoxes){
  const w=G.w/n;
  for(let i=0;i<n;i++){
    const role=i<p.a?'given':'op',xx=G.x+i*w;
    box(svg,xx+3,G.top,w-6,G.cellH,role,{step});
    chalk(svg,xx+w/2,G.top+49,role==='given'?'A':'B',role,Math.min(mob?25:36,w*.66));
    if(showUnit){const cellText=mob&&n>8?String(u):fmt(p,u),fitSize=Math.min(mob?23:34,(w-10)/(Math.max(1,cellText.length)*.66));chalk(svg,xx+w/2,G.top+109,cellText,role,fitSize);}
    else chalk(svg,xx+w/2,G.top+112,'?', 'unknown',mob?24:29);
  }
  if(p.a>0&&p.b>0){N.neonLine(svg,G.x+p.a*w,G.top-10,G.x+p.a*w,G.top+G.cellH+13,{role:'focus',width:4});}
  N.svg.brace(svg,G.x,G.braceY,G.x+G.w,G.braceY,{role:'given',depth:19});
  chalk(svg,G.W/2,G.totalY,showTotal?fmt(p,p.total)+' = '+n+' EQUAL PARTS':'WHOLE AMOUNT',showTotal?'focus':'given',mob?29:40);
  if(showUnit)chalk(svg,G.W/2,G.captionY,fmt(p,p.total)+' ÷ '+n+' = '+fmt(p,u)+' PER PART','result',mob?27:35);
  else chalk(svg,G.W/2,G.captionY,'FIND ONE EQUAL PART','unknown',mob?25:32);
 } else{chalk(svg,G.W/2,G.top+66,'TWO GROUPS','focus',mob?32:53);chalk(svg,G.W/2,G.top+130,'SAME-SIZE PARTS','op',mob?26:35);}
 const slotX1=G.x+(G.w-(G.slotW*2+G.slotGap))/2,slotX2=slotX1+G.slotW+G.slotGap;
 const assigned=o.assigned||[null,null],revealed=o.challenge?!!o.solved:true;
 const outputs=[assigned[0]!=null?assigned[0]:(o.challenge&&o.solved||!o.interactive&&showA)?aVal:null,assigned[1]!=null?assigned[1]:(o.challenge&&o.solved||!o.interactive&&showB)?bVal:null];
 for(let k=0;k<2;k++){
  const xx=k===0?slotX1:slotX2,role=k===0?'given':'op',v=outputs[k],canSee=v!=null&&(revealed||!o.challenge);
  box(svg,xx,G.slotsY,G.slotW,G.slotH,role,{step:Math.max(2,step)});
  const slotLabel=p.names[k]+' · '+(k===0?p.a:p.b)+' PARTS';chalk(svg,xx+G.slotW/2,G.slotsY+41,slotLabel,role,Math.min(mob?22:34,(G.slotW-27)/(slotLabel.length*.66)));
  chalk(svg,xx+G.slotW/2,G.slotsY+110,canSee?fmt(p,v):'?','unknown',mob?37:53);
  if(o.interactive||o.challenge){
   E('rect',{x:xx+12,y:G.slotsY+8,width:G.slotW-24,height:G.slotH-16,rx:16,css:'fill:transparent;stroke:none;pointer-events:none','data-slot':String(k)},svg);
   if(assigned[k]!=null){const move=E('g',{class:'f603-drag','data-assigned':String(k),role:'button',tabindex:0,'aria-label':'Assigned value '+assigned[k]+' for '+p.names[k]+'. Drag to return or move to the other share.'},svg);N.neonRing(move,xx+G.slotW-34,G.slotsY+G.slotH-24,{role:'result',r:13,pulse:false});
    move.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();o.onRemove(k);}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();o.onAssign(k===0?1:0,assigned[k]);}});
    N.ui.svgDrag(svg,move,{box:{x:xx+G.slotW-61,y:G.slotsY+G.slotH-47,w:57,h:47},zones:()=>[{id:'a',kind:'drop',x:slotX1,y:G.slotsY,w:G.slotW,h:G.slotH},{id:'b',kind:'drop',x:slotX2,y:G.slotsY,w:G.slotW,h:G.slotH},{id:'return',kind:'remove',x:G.returnX,y:G.returnY,w:G.returnW,h:G.returnH}],onDrop:id=>{Promise.resolve().then(()=>o.onAssign(id==='a'?0:1,assigned[k],k));return true;},onRemove:()=>o.onRemove(k)});
   }
  }
 }
 if(showProof&&!o.interactive&&!o.challenge)chalk(svg,G.W/2,G.slotsY+G.slotH+39,fmt(p,aVal)+' + '+fmt(p,bVal)+' = '+fmt(p,p.total),'result',mob?26:40);
 if(o.interactive){
  const opts=[u,aVal,bVal,Math.max(1,p.total-p.a),Math.max(1,p.total-p.b)];
  // Value chips: the first is one-part evidence; others represent the shares or plausible errors.
  const unique=[...new Set(opts)];const x0=mob?21:40,spacing=mob?Math.min(102,(G.W-40)/unique.length):Math.min(180,(G.W-80)/unique.length);
  unique.forEach((val,k)=>{
   const xx=x0+k*spacing,role=k===0?'focus':k===1?'given':k===2?'op':'unknown';
   const ch=E('g',{class:'f603-drag','data-chip':String(val),role:'button',tabindex:0,'aria-label':'Value chip '+fmt(p,val)+'. Press A or B to assign to that share; U to reveal one-part value.'},svg);
   N.neonBox(ch,xx,G.chipY,Math.min(G.chipW,spacing-6),G.chipH,{role,r:14});
   chalk(ch,xx+Math.min(G.chipW,spacing-6)/2,G.chipY+G.chipH/2+9,fmt(p,val),role,mob?24:32);
   ch.addEventListener('keydown',e=>{if('aAbB'.includes(e.key)){e.preventDefault();o.onAssign(e.key.toLowerCase()==='a'?0:1,val);}else if('uU'.includes(e.key)){e.preventDefault();o.onUnit(val);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onAssign(o.active||0,val);}});
   const barZones=[];const ww=G.w/n;
   for(let z=0;z<n;z++)barZones.push({id:'unit:'+z,kind:'drop',x:G.x+z*ww,y:G.top,w:ww,h:G.cellH});
   N.ui.svgDrag(svg,ch,{box:{x:xx,y:G.chipY,w:Math.min(G.chipW,spacing-6),h:G.chipH},zones:()=>[{id:'a',kind:'drop',x:slotX1,y:G.slotsY,w:G.slotW,h:G.slotH},{id:'b',kind:'drop',x:slotX2,y:G.slotsY,w:G.slotW,h:G.slotH},...barZones,{id:'return',kind:'remove',x:G.returnX,y:G.returnY,w:G.returnW,h:G.returnH}],onDrop:id=>{Promise.resolve().then(()=>id.startsWith('unit:')?o.onUnit(val,Number(id.slice(5))):o.onAssign(id==='a'?0:1,val));return true;},onRemove:()=>o.onRemoveChip(val)});
  });
  N.neonBox(svg,G.returnX,G.returnY,G.returnW,G.returnH,{role:'error',r:11,text:'RETURN',size:mob?23:29});
  if(o.unitPlaced){const ix=o.unitIndex??0,xx=G.x+(ix+.5)*G.w/n;
   N.neonRing(svg,xx,G.top+G.cellH/2,{role:o.unitPlaced===u?'result':'error',r:mob?27:40});
   chalk(svg,G.W/2,G.chipY-18,'ONE PART = '+fmt(p,o.unitPlaced),o.unitPlaced===u?'result':'error',mob?26:32);
  }
  chalk(svg,G.W/2,G.H-8,'DRAG VALUES TO SHARES · RED TO REMOVE','op',mob?20:27);
 }
 svg.dataset.renderStep=String(step);svg.dataset.ratio=p.a+':'+p.b;svg.dataset.shareA=String(outputs[0]??'');svg.dataset.shareB=String(outputs[1]??'');
 art.appendChild(svg);
 const reveal=(text,role,subtitle)=>N.neonCard([H('p',{class:'f603-card-head',text:text}),H('p',{class:'f603-card-val',text:role}),H('p',{class:'f603-card-sub',text:subtitle})],{role:text==='PARTS'?'focus':text===p.names[0]?'given':text===p.names[1]?'op':'result'});
 side.append(reveal('PARTS',n+' equal','Count '+p.a+' + '+p.b),reveal(p.names[0],o.interactive?(assigned[0]!=null?fmt(p,assigned[0]):'?'):(!o.challenge&&showA||o.solved)?fmt(p,aVal):'?',p.a+' groups'),reveal(p.names[1],o.interactive?(assigned[1]!=null?fmt(p,assigned[1]):'?'):(!o.challenge&&showB||o.solved)?fmt(p,bVal):'?',p.b+' groups'));
 frame.append(art,side);stage.appendChild(frame);N.scene.helperStrip(stage,o.pose||'explain',o.caption||'How many boxes altogether?');
 return svg;
}
function teach(i,stage){const t=STEPS[i],p=C.presets[C.preset],u=unit(p),a=p.a*u,b=p.b*u;
 const dyn=[
  'The ratio '+p.a+' to '+p.b+' means '+p.a+' equal parts for '+p.names[0]+' and '+p.b+' equal parts for '+p.names[1]+'. We are counting parts, not amounts yet.',
  'Each neon box is the same size and stands for exactly the same amount. We have '+p.a+' boxes for '+p.names[0]+' and '+p.b+' for '+p.names[1]+'.',
  'Add '+p.a+' and '+p.b+'. That makes '+parts(p)+' equal parts. All '+parts(p)+' parts together are worth '+p.total+'.',
  'Divide '+p.total+' by the '+parts(p)+' equal parts. Each box must be worth '+u+' in this example.',
  p.names[0]+' has '+p.a+' parts, each worth '+u+'. That gives a share of '+a+'.',
  p.names[1]+' has '+p.b+' parts, each worth '+u+'. That gives a share of '+b+'.',
  'Check the whole: '+a+' plus '+b+' is '+p.total+'. Both shares have the same value per part, so the ratio is '+p.a+' to '+p.b+'.'
 ];
 t.narration=dyn[i];stageScene(stage,p,{step:i,pose:t.pose,caption:t.caption});}

function miniBtn(text,onClick,cls='nova-btn'){return H('button',{class:cls,text,onclick:onClick});}
function explore(panel,stage){
 window.NovaLessonComponent?.applyExploreModels();let preset=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("preset",()=>(C.preset)):(C.preset)),assigned=[null,null],unitPlaced=null,unitIndex=0,active=0,message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Drag each amount to the matching share. Every unit box has the same value.')):('Drag each amount to the matching share. Every unit box has the same value.'));
 window.NovaLessonComponent?.applyExploreModels();const pMsg=H('p',{class:'f603-message','aria-live':'polite'});window.NovaLessonComponent?.applyExploreModels();const controls=H('div',{class:'f603-controls'}),pick=H('select',{'aria-label':'Choose a sharing example'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([id,p])=>pick.append(H('option',{value:id,text:p.label})));window.NovaLessonComponent?.applyExploreModels();pick.value=preset;
 window.NovaLessonComponent?.applyExploreModels();const selectWrap=H('label',{class:'f603-field'},['Example',pick]);window.NovaLessonComponent?.applyExploreModels();controls.append(selectWrap);
 window.NovaLessonComponent?.applyExploreModels();const buttons=H('div',{class:'f603-controls'}),activeBtn=miniBtn('Assign to: '+C.presets[preset].names[0],()=>{active=1-active;activeBtn.textContent='Assign to: '+C.presets[preset].names[active];}),checkBtn=miniBtn('Check shares',()=>check()),hintBtn=miniBtn('Hint',()=>hint()),resetBtn=miniBtn('Reset',()=>reset());window.NovaLessonComponent?.applyExploreModels();buttons.append(activeBtn,checkBtn,hintBtn,resetBtn);
 window.NovaLessonComponent?.applyExploreModels();const expl=H('p',{class:'f603-instruction',text:'Drag a value chip onto either share. Drag the one-part chip onto any equal bar box. Regrab an assigned value to move or return it. Keyboard: focus chip, press A/B/U; Delete removes assigned values.'});window.NovaLessonComponent?.applyExploreModels();panel.append(controls,buttons,expl,pMsg);
 window.NovaLessonComponent?.applyExploreModels();function p(){return C.presets[preset];}
 window.NovaLessonComponent?.applyExploreModels();function draw(pose='point',caption='How many boxes altogether?'){activeBtn.textContent='Assign to: '+p().names[active];pMsg.textContent=message;stageScene(stage,p(),{interactive:true,step:6,assigned,unitPlaced,unitIndex,pose,caption,preset,active,onAssign,onUnit,onRemove,onRemoveChip});}
 window.NovaLessonComponent?.applyExploreModels();function onAssign(k,val,from){if(from!=null&&from!==k)assigned[from]=null;assigned[k]=val;emit('shareAssign',{preset,share:k,value:val});message=fmt(p(),val)+' assigned to '+p().names[k]+'. Check by counting equal parts.';draw('point','Same unit value in every box.');}
 window.NovaLessonComponent?.applyExploreModels();function onUnit(val,idx=0){unitPlaced=val;unitIndex=idx;emit('unitPlace',{value:val,index:idx});message=val===unit(p())?'One part is '+fmt(p(),val)+'. Now multiply by each share count.':'Check the total divided by all '+parts(p())+' parts.';draw('count','One equal part at a time.');}
 window.NovaLessonComponent?.applyExploreModels();function onRemove(k){assigned[k]=null;emit('shareRemove',k);message='Share '+p().names[k]+' cleared. Try another amount.';draw('oops','Try another share.');}
 window.NovaLessonComponent?.applyExploreModels();function onRemoveChip(val){message='Value '+fmt(p(),val)+' returned to the tray.';draw('point','You can try another amount.');}
 window.NovaLessonComponent?.applyExploreModels();function hint(){const txt='Add the ratio numbers: '+p().a+' + '+p().b+' = '+parts(p())+'. Divide '+fmt(p(),p().total)+' by '+parts(p())+' before calculating each share.';emit('hint',preset);message=txt;draw('idea','How many boxes altogether?');}
 window.NovaLessonComponent?.applyExploreModels();function check(){const [a,b]=shares(p());let text='',success=false;
  if(assigned[0]==null||assigned[1]==null)text='Put a value in BOTH share boxes before checking.';
  else if(assigned[0]===a&&assigned[1]===b){success=true;text='Correct! '+fmt(p(),a)+' + '+fmt(p(),b)+' = '+fmt(p(),p().total)+' and the amounts are in ratio '+p().a+':'+p().b+'.';}
  else if(assigned[0]===b&&assigned[1]===a)text='You swapped the shares. Match the '+p().a+'-part group to '+p().names[0]+'.';
  else if(assigned[0]+assigned[1]!==p().total)text='The two shares do not add up to the whole '+fmt(p(),p().total)+'.';
  else text='The total matches, but the ratio is different. Each individual part must be worth the same.';
  message=text;N.events.emit('correct',{engine:ID,correct:success,mode:'explore'});draw(success?'celebrate':'not-yet',success?'Excellent sharing!':'Recount the equal parts.');pMsg.classList.toggle('good',success);pMsg.classList.toggle('bad',!success);
 }
 window.NovaLessonComponent?.applyExploreModels();function reset(){assigned=[null,null];unitPlaced=null;active=0;message='Shares reset. Start by counting equal boxes.';emit('reset',{preset});draw('explain','How many boxes altogether?');}
 window.NovaLessonComponent?.applyExploreModels();pick.onchange=()=>{preset=pick.value;C.preset=preset;emit('preset',preset);reset();};
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset,assigned:assigned.slice(),unitPlaced}),assign:onAssign,placeUnit:onUnit,remove:onRemove,check,reset,setPreset(id){pick.value=id;pick.onchange();}};window.NovaLessonComponent?.applyExploreModels();draw();
}
function challenge(panel,api,stage){
 let i=0,passed=false,wrong=0,complete=0;const ids=Object.keys(C.presets),prompt=H('p',{class:'f603-question'}),row=H('div',{class:'f603-controls'});
 const aInput=H('input',{type:'text',inputmode:'numeric','aria-label':'Amount for first share',placeholder:'First share'}),bInput=H('input',{type:'text',inputmode:'numeric','aria-label':'Amount for second share',placeholder:'Second share'});
 const aLabel=H('label',{class:'f603-field'},['First share',aInput]),bLabel=H('label',{class:'f603-field'},['Second share',bInput]);row.append(aLabel,bLabel);
 const actions=H('div',{class:'f603-controls'}),checkBtn=miniBtn('Check both shares',check,'nova-btn primary'),hintBtn=miniBtn('Hint',hint),nextBtn=miniBtn('Next challenge',next);nextBtn.disabled=true;actions.append(checkBtn,hintBtn,nextBtn);
 const status=H('p',{class:'f603-message','aria-live':'polite'}),progress=H('p',{class:'f603-progress'});panel.append(prompt,row,actions,status,progress);
 function p(){return C.presets[ids[i]];}
 function num(input){let s=input.value.trim().replace(/[£, ]/g,'');return s&&Number.isFinite(Number(s))?Number(s):null;}
 function draw(){const data=p();prompt.textContent='Challenge '+(i+1)+' / '+ids.length+' · '+data.context;progress.textContent='Verified shares: '+complete+' / '+ids.length;stageScene(stage,data,{challenge:true,step:6,solved:passed,pose:passed?'celebrate':wrong>1?'think':'point',caption:passed?'Correct shares!':'How many boxes altogether?',preset:ids[i]});}
 function feedback(v1,v2){const data=p(),u=unit(data),[aa,bb]=shares(data);
  if(v1===bb&&v2===aa)return 'The values have been swapped. Check who gets '+data.a+' parts and who gets '+data.b+'.';
  if(v1===data.total/data.a||v2===data.total/data.b)return 'Do not divide by one person’s part-count. Add BOTH ratio numbers first.';
  if(v1===u||v2===u)return 'You found one part. Multiply it by each person’s number of parts.';
  if(v1+v2!==data.total)return 'Check the whole: your shares must add to '+fmt(data,data.total)+'.';
  if(v1/data.a!==v2/data.b)return 'The total is right but the unit size is not equal in both shares.';
  return 'Count '+parts(data)+' equal parts and find the value of ONE part.';
 }
 function check(){if(passed)return;const a=num(aInput),b=num(bInput);if(a===null||b===null){status.textContent='Enter both numbers, then check.';return;}
  wrong++;const [aa,bb]=shares(p()),ok=a===aa&&b===bb;
  emit('answer',{preset:ids[i],values:[a,b],correct:ok});api.check(ok,ok?'Correct. The total AND the ratio are both satisfied.':feedback(a,b),{preset:ids[i],values:[a,b],task:i});
  status.textContent=ok?fmt(p(),aa)+' + '+fmt(p(),bb)+' = '+fmt(p(),p().total)+'. Equal-part value: '+fmt(p(),unit(p()))+'.':feedback(a,b);
  status.classList.toggle('good',ok);status.classList.toggle('bad',!ok);
  if(ok){passed=true;complete++;nextBtn.disabled=false;checkBtn.disabled=true;draw();}
  else draw();
 }
 function hint(){const h='First add '+p().a+' + '+p().b+' to find the number of equal parts. Then divide '+fmt(p(),p().total)+' by this number.';api.hint(h);emit('hint',ids[i]);status.textContent=h;}
 function next(){if(!passed)return;if(i>=ids.length-1){prompt.textContent='All four sharing challenges complete.';status.textContent='You checked both shares, the total and the ratio.';row.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'FOUR CHALLENGES COMPLETED');N.scene.helperStrip(stage,'celebrate','Excellent reasoning!');return;}
  i++;wrong=0;passed=false;checkBtn.disabled=false;nextBtn.disabled=true;aInput.value='';bInput.value='';status.textContent='The values are hidden until both answers are checked.';status.classList.remove('good','bad');draw();}
 [aInput,bInput].forEach(x=>x.addEventListener('keydown',e=>{if(e.key==='Enter')check();}));
 C._challenge={get:()=>({i,complete,passed,wrong,status:status.textContent}),setAnswers:(a,b)=>{aInput.value=a;bInput.value=b;},check,next,hint};
 status.textContent='Divide by the TOTAL number of ratio parts, then multiply for each share.';draw();
}
const DEF={id:ID,title:'Sharing in a Ratio · Equal-Part Studio',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'A neon bar subdivided into equal sized unit boxes for each share; a brace shows the combined total, counters show the ratio, and coloured share cards display the allocations.',
 staticAlt:'To share T in ratio a:b, count a+b equal parts, calculate one part T/(a+b), then allocate a parts and b parts; verify their sum T.',
 spec:{purpose:'Help Year 7 pupils discover why sharing in a ratio uses equal parts, then calculate and verify two shares of a total.',params:'Positive integer ratio a:b; whole total divisible by a+b; unit symbols and person labels; equal-part bar with total brace and counter groups.',presets:'Y7-059 primary £30 in ratio 2:3; three additional Y7-059 classroom contexts, including 3:2, 1:4 and 5:7.',steps:'Deal ratio counters → build equal unit boxes → show total → find one-box value → build first share → build second share → prove both.',interactions:'Drag re-grabbable value chips into shares or one-unit bar cells; remove by red tray; keyboard A, B, U; reset, hint and check; independent challenge answers.',traps:'Dividing by one ratio number; treating 2:3 as two equal shares; swapping share labels; finding one part but not multiplying; satisfying total without the ratio.',gcse:'Extend to three-way ratio sharing, fractions in a ratio, reverse problems and variable totals.'}
};
/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"stageScene":["stage","p","o"]},exploreFields:{"preset":{"kind":"value","factory":null,"argCount":null},"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F6·03',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Year 7; GCSE extension',linked:['F0-02','F0-03','F0-04','F0-05','F0-08','F2-06','F4-07 (reference, not yet built)','F6-01']});
})();
