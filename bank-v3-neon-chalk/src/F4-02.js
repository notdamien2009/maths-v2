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


/* NOVA F4-02 · Comparison Bar · Run 02 review.
   Canonical core immutable. Bar models use N.neonBox, N.neonPath, N.neonLine, N.chalkText and F2 svgDrag. */
const F402_CONFIG={id:'F4-02',startMode:'watch',preset:'Y7-007',parameters:{min:1,max:24,integerOnly:true},
 presets:{
  'Y7-007':{label:'Year 7 · Comparing 15 and 9',a:15,b:9,context:'Two groups start together. Find how many more are in the longer group.'},
  'reverse':{label:'When the lower quantity is larger',a:8,b:17,context:'The lower bar is longer. Difference is always the gap, not a negative length.'},
  'close':{label:'Close values · 20 and 18',a:20,b:18,context:'The gap can be small even if both totals are large.'},
  'equal':{label:'Equal values · 12 and 12',a:12,b:12,context:'Aligned bars of equal length have no gap.'}
 },
 challenge:[
  {a:15,b:9,mode:'difference',label:'How many more?',context:'Team A has 15 counters and Team B has 9. How many more does A have?'},
  {a:24,b:17,mode:'difference',label:'Find the difference',context:'One shelf holds 24 books and another holds 17. What is the difference?'},
  {a:27,b:19,mode:'shorter',knownDiff:8,label:'Find the smaller group',context:'Team A has 27 points, which is 8 more than Team B. How many points does B have?'}
 ],
 events:{value:['preset','longer','shorter','difference','part','brace','remove','resize','answer','proof','reset'],types:['mode','step','correct','hintUsed']}
};window.F402_CONFIG=F402_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F402_CONFIG),ID=C.id;
const G={x:104,full:790,ay:171,by:371,h:105};
function math(s){return {large:Math.max(s.a,s.b),small:Math.min(s.a,s.b),difference:Math.abs(s.a-s.b)};}
function expected(s){return s.mode==='shorter'?s.b:math(s).difference;}
function valid(s){return Number.isInteger(s.a)&&Number.isInteger(s.b)&&s.a>=0&&s.b>=0&&s.a<=150&&s.b<=150;}
function correct(s,v){return valid(s)&&Number.isInteger(v)&&v===expected(s);}
function mistake(s,v){if(v===null||v===undefined||v==='')return 'Choose a card or enter a number first.';if(!Number.isFinite(Number(v)))return 'Enter a number that can be checked against the bars.';if(!Number.isInteger(Number(v)))return 'Both groups contain whole units. Use a whole number.';
 v=Number(v);if(v<0)return 'A comparison amount cannot be negative. Compare the longer and shorter groups.';
 if(v===expected(s))return '';
 if(s.mode==='shorter'){
  if(v===s.a+s.knownDiff)return 'Adding the difference makes Team B bigger, but we know it is smaller. Subtract the gap.';
  if(v===s.knownDiff)return 'Eight is the gap between the groups, not the number in Team B.';
  if(v===s.a)return 'That is Team A. Team B has eight fewer.';
  return v>expected(s)?'Too many for B: A must have exactly eight more.':'Too few for B: the gap would be more than eight.';
 }
 if(v===s.a+s.b)return 'You added the two groups together. The difference compares their lengths.';
 if(v===s.a||v===s.b)return 'That is a group total. Find only the unpaired part beyond the shorter bar.';
 return v>expected(s)?'Too large: the gold gap is shorter than that difference.':'Too small: that leaves some of the gold gap uncounted.';
}
function options(s){const t=expected(s);const a=[t,t+2,s.mode==='shorter'?s.knownDiff:s.a+s.b,Math.max(0,t-2),s.mode==='shorter'?s.a:s.b,s.a+s.b];let out=[...new Set(a)].filter(x=>Number.isInteger(x)&&x>=0);let i=1;while(out.length<4)if(!out.includes(t+i))out.push(t+i);else i++;
 return [out[1],out[2],out[0],out[3]];}
function btn(label,fn,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text:label,onclick:fn});}
function evt(key,value){if(!C.events.value.includes(key))throw Error(ID+' undeclared value '+key);N.events.emit('value',{engine:ID,key,value});}
/* Shared F2 drag kit: re-acquire pointer capture after its z-order reparent.
   Some Chromium pointer implementations drop a capture set before appendChild.
   Core and its snap/cancel APIs stay byte-for-byte unchanged. */
function dragKit(svg,el,opt){
 N.ui.svgDrag(svg,el,opt);
 el.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});
 return el;
}
function chalk(p,x,y,v,size=53,role='given'){return N.chalkText(p,x,y,String(v),{size,role});}
function helper(stage,state){
if(window.NovaLessonComponent?.active){[stage,state]=window.NovaLessonComponent.args("helper",arguments);}
const states={align:['ruler','Start at the same line.'],a:['count','Look at the first group!'],b:['compare','Now compare both.'],pair:['point','Match the shared amount.'],gap:['think','What is the extra part?'],minus:['idea','Longer minus shorter!'],check:['cheer','The difference is proved!'],explore:['ruler','Move the ends!'],ready:['think','Find the gap!'],wrong:['oops','Compare, don’t add.'],right:['cheer','That’s the difference!'],resize:['ruler','Watch the gap change.'],place:['point','Does that card fit?'],remove:['point','Try another one.'],brace:['idea','You’ve marked the gap!']};const a=states[state]||states.ready;N.scene.helperStrip(stage,a[0],a[1]);}
function tickBrace(p,x1,x2,y,role='unknown'){
 if(x2-x1<9){N.neonRing(p,x1,y,{r:10,role});return;}
 const mid=(x1+x2)/2;
 N.neonPath(p,`M${x1} ${y-15}v19q0 8 10 8h${Math.max(0,mid-x1-20)}q10 0 10 11q0 -11 10 -11h${Math.max(0,x2-mid-20)}q10 0 10 -8v-19`,{role,width:3});
}
function svgScene(s,o){
 const step=o.step===undefined?5:o.step,m=math(s),interactive=!!o.interactive,reveal=!!o.won||(!interactive&&step>=5),scale=G.full/(o.resize?C.parameters.max:Math.max(10,m.large)),wa=s.a*scale,wb=s.b*scale;
 const svg=N.svg.root(1000,880,'Two neon glass quantity bars start at the same position. Their aligned portion matches, and the gold extension shows the difference between them.');svg.classList.add('f402-svg');svg.dataset.a=String(s.a);svg.dataset.b=String(s.b);svg.dataset.difference=String(m.difference);svg.dataset.animate=String(!!o.animate);
 const left=G.x,endA=left+wa,endB=left+wb,shorterEnd=Math.min(endA,endB),longerEnd=Math.max(endA,endB),gapWidth=longerEnd-shorterEnd,gapY=wa>=wb?G.by:G.ay;
 chalk(svg,500,78,'COMPARE THE LENGTHS',44,'given');
 // All diagrams share the same NOVA neon vocabulary, but comparison uses two aligned lanes rather than a split whole.
 N.neonLine(svg,left,135,left,520,{role:'given',width:5});
 N.neonRing(svg,left,145,{role:'given',r:10});chalk(svg,left+102,129,'SAME START',44,'given');
 if(step>=0){
  const barA=N.neonBox(svg,left,G.ay,wa,G.h,{role:'given',r:18});
  if(o.animate&&step===0)N.motion.arrive(barA,-40,0,480,N.motion.ease.out);
  chalk(svg,62,G.ay+69,'A',57,'given');
  chalk(svg,left+wa/2,G.ay+68,String(s.a),Math.max(39,Math.min(66,wa*.28)),'given');

 }
 if(step>=1){
  const groupB=N.neonBox(svg,left,G.by,wb,G.h,{role:s.mode==='shorter'&&!reveal?'unknown':'op',r:18});
  if(o.animate&&step===1)N.motion.arrive(groupB,-36,0,470,N.motion.ease.out);
  chalk(svg,62,G.by+69,'B',57,'op');
  const showB=s.mode==='shorter'&&!reveal?'?':String(s.b);
  chalk(svg,left+wb/2,G.by+68,showB,Math.max(42,Math.min(66,wb*.28)),s.mode==='shorter'&&!reveal?'unknown':'op');

 }
 if(step>=2){
  // Shared overlap proven by vertical alignment, not decoration: aligned quantities have the same origin.
  const shared=shorterEnd-left;
  N.neonBox(svg,left,299,shared,24,{role:'focus',r:10});
  N.neonLine(svg,shorterEnd,291,shorterEnd,489,{role:'focus',width:2.8});
  chalk(svg,left+Math.max(85,shared/2),291,'MATCHING LENGTH',44,'focus');
 }
 if(step>=3){
  if(gapWidth>0){const g=N.neonBox(svg,shorterEnd,gapY,gapWidth,G.h,{role:reveal?'result':'unknown',r:gapWidth<55?7:13});if(o.animate&&step===3)N.motion.arrive(g,0,-22,410,N.motion.ease.out);}
  else N.neonRing(svg,shorterEnd,530,{role:'result',r:13});
  const role=reveal?'result':'unknown';tickBrace(svg,shorterEnd,longerEnd,527,role);
  const text=s.mode==='shorter'?String(s.knownDiff||m.difference):reveal?String(m.difference):o.selected!==null&&o.selected!==undefined?String(o.selected):'?';
  chalk(svg,Math.min(880,Math.max(120,(shorterEnd+longerEnd)/2)),588,text,56,role);
  if(o.animate&&step===3)N.motion.flash(svg,(shorterEnd+longerEnd)/2,gapY+G.h/2,'unknown',38);
 }
 if(step>=4){
  const sentence=s.mode==='shorter'?`${s.a} − ${s.knownDiff||m.difference} = ${reveal?s.b:'?'}`:
   `${m.large} − ${m.small} = ${reveal?m.difference:o.selected!==null&&o.selected!==undefined?o.selected:'?'}`;
  chalk(svg,500,667,sentence,54,reveal?'result':'unknown');
 }
 if(step>=5&&!interactive){
  chalk(svg,500,757,'COMPARE, THEN SUBTRACT',43,'given');
  const y=813;N.neonBox(svg,147,y-43,220,79,{role:'op',r:17});N.neonBox(svg,397,y-43,220,79,{role:'result',r:17});N.neonBox(svg,647,y-43,205,79,{role:'given',r:17});
  chalk(svg,258,y+10,String(m.small),56,'op');chalk(svg,381,y+10,'+',53,'given');chalk(svg,507,y+10,String(m.difference),56,'result');chalk(svg,634,y+10,'=',53,'given');chalk(svg,748,y+10,String(m.large),56,'given');
 }
 if(o.interactive&&!o.won){
  // Explore only: handles for both quantity ends; only valid numeric snap zones glow (same v3.6.2 core).
  if(o.resize){[['a',endA,G.ay,s.a],['b',endB,G.by,s.b]].forEach(([which,end,y,v])=>{
   const h=E('g',{class:'f402-handle','data-which':which,role:'slider',tabindex:0,'aria-label':'Resize bar '+which.toUpperCase(),'aria-valuemin':1,'aria-valuemax':C.parameters.max,'aria-valuenow':v,'aria-valuetext':v+' units'},svg);
   N.neonBox(h,end-21,y-8,42,G.h+16,{role:'focus',r:13});N.neonRing(h,end,y-31,{role:'focus',r:16});
   const zones=()=>Array.from({length:C.parameters.max},(_,i)=>({kind:'drop',id:which+':'+(i+1),x:G.x+(i+.5)*G.full/C.parameters.max,y:y-50,w:G.full/C.parameters.max+1,h:G.h+105}));
   dragKit(svg,h,{box:{x:end-25,y:y-42,w:50,h:G.h+61},zones,onDrop:id=>{const next=Number(id.split(':')[1]);if(next<1||next>C.parameters.max)return false;Promise.resolve().then(()=>o.onResize(which,next));return true;}});
   h.addEventListener('keydown',e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d||e.key==='Home'||e.key==='End'){e.preventDefault();o.onResize(which,e.key==='Home'?1:e.key==='End'?C.parameters.max:Math.max(1,Math.min(C.parameters.max,v+d)));}});
  });}
  const unknownZone=s.mode==='shorter'?{x:G.x+wb*.36,y:G.by-14,w:Math.max(55,wb*.4),h:G.h+26}:{x:shorterEnd,y:gapY-9,w:Math.max(54,gapWidth),h:G.h+23};
  const vals=options(s),slotW=173,pad=15,leftTray=(1000-(vals.length*slotW+(vals.length-1)*pad))/2;
  chalk(svg,o.resize?302:500,718,s.mode==='shorter'?'FIND THE SHORTER GROUP':o.resize?'PLACE A VALUE':'DRAG A CARD TO GAP',42,'given');
  vals.forEach((v,i)=>{const x=leftTray+i*(slotW+pad),y=746;const tile=E('g',{class:'f402-card',role:'button',tabindex:0,'data-value':v,'aria-label':'Place candidate '+v},svg);
   N.neonBox(tile,x,y,slotW,73,{role:'focus',r:17,text:String(v),size:53});
   dragKit(svg,tile,{box:{x,y,w:slotW,h:73},zones:()=>[{id:'answer',kind:'drop',...unknownZone},{id:'remove',kind:'remove',x:391,y:838,w:218,h:44}],onDrop:id=>{if(id!=='answer')return false;Promise.resolve().then(()=>o.onPlace(v));return true;},onRemove:o.onRemove,removeTo:{x:500,y:855}});
   tile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onPlace(v);}});
  });
  N.neonBox(svg,391,838,218,40,{role:'error',r:12,text:'RETURN',size:39});
  if(o.selected!==null&&o.selected!==undefined){
   const tx=unknownZone.x+Math.min(unknownZone.w-20,Math.max(20,unknownZone.w*.85)),ty=unknownZone.y+23;
   const picked=E('g',{class:'f402-placed',role:'button',tabindex:0,'aria-label':'Remove placed comparison card'},svg);
   N.neonRing(picked,tx,ty,{role:'focus',r:14});
   dragKit(svg,picked,{box:{x:tx-23,y:ty-23,w:46,h:46},zones:()=>[{id:'remove',kind:'remove',x:391,y:838,w:218,h:40}],onRemove:o.onRemove,removeTo:{x:500,y:858}});
   picked.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();o.onRemove();}});
  }
  if(o.resize&&s.mode!=='shorter'&&gapWidth>10){const br=E('g',{class:'f402-brace',role:'button',tabindex:0,'aria-label':'Mark the difference gap'},svg);
   N.neonBox(br,695,682,195,43,{role:'unknown',r:10,text:'MARK GAP',size:38});
   dragKit(svg,br,{box:{x:695,y:682,w:195,h:43},zones:()=>[{id:'brace',kind:'drop',x:shorterEnd,y:gapY,w:Math.max(52,gapWidth),h:G.h}],onDrop:()=>{Promise.resolve().then(o.onBrace);return true;}});
   br.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onBrace();}});
  }
 }
 return svg;
}
function sideCard(k,v,desc,role){return N.neonCard([H('p',{class:'f402-sidek',text:k}),H('div',{class:'f402-sidev',text:v}),H('p',{class:'f402-sidesub',text:desc})],{role});}
function present(stage,s,o={}){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("present",arguments);}

 stage.innerHTML='';N.cap(stage,'Comparison Bars',o.challenge?'CHALLENGE':o.interactive?'EXPLORE':o.subtitle||'Line up and compare');
 const root=H('div',{class:'f402-layout'}),drawing=H('div',{class:'f402-apparatus'}),side=H('aside',{class:'f402-side','aria-label':'Comparison evidence'});
 drawing.appendChild(svgScene(s,o));const m=math(s),reveal=o.won||(!o.interactive&&o.step>=5);
 side.append(sideCard('GROUP A',String(s.a),'First quantity.','given'),sideCard('GROUP B',s.mode==='shorter'&&!reveal?'?':String(s.b),'Second quantity.','op'),sideCard('DIFFERENCE',s.mode==='shorter'?String(s.knownDiff):reveal?String(m.difference):o.selected===null?'?':String(o.selected),'Only the unpaired amount.','unknown'));
 root.append(drawing,side);stage.append(root);
 if(o.won){const proof=s.mode==='shorter'?`${s.b} + ${s.knownDiff} = ${s.a}`:`${m.small} + ${m.difference} = ${m.large}`;
 stage.append(H('p',{class:'f402-proof',text:'Check: '+proof+'. The two bars agree.'}));}
 helper(stage,o.pose||'ready');return drawing;
}
function live(panel,stage,seed,challenge=false,api=null){let s={...seed},selected=null,entry='',won=false,message=challenge?'Read the story, align the bars, and work out the unknown.':'Adjust either quantity and compare the gold gap.',pose='explore',marked=false,attempts=0;
 const status=H('p',{class:'f402-status',role:'status'});
 function place(v){if(won)return;selected=v;evt('part',v);update('You placed '+v+'. Check whether it matches the comparison.','place');}
 function remove(){if(won)return;selected=null;entry='';evt('remove',true);update('The candidate has been removed.','remove');}
 function resize(which,v){if(challenge||won||!Number.isInteger(v)||v<C.parameters.min||v>C.parameters.max)return;s[which]=v;selected=null;entry='';evt('resize',{which,value:v});update('Bar '+which.toUpperCase()+' now measures '+v+'. Look at the new gap.','resize');}
 function reset(){selected=null;entry='';marked=false;won=false;attempts=0;evt('reset',true);update('Reset the comparison. Find only the unpaired amount.','ready');}
 function hint(){const msg=s.mode==='shorter'?'Team B is smaller. Subtract the known difference from Team A.':'Both bars start together. Find the extra length beyond the shorter one; subtract shorter from longer.';api?.hint(msg);update(msg,'gap');}
 function check(){const v=entry.trim()?Number(entry):selected;attempts++;evt('answer',v);if(entry.trim()&&selected!==null&&Number(v)!==selected){const m='Your entered value and chosen card disagree. Use one matching value.';api?.check(false,m);update(m,'wrong');return false;}
  const bad=mistake(s,v);if(bad){api?.check(false,bad);update(bad,'wrong');return false;}
  if(!correct(s,Number(v))){const m='That is not the comparison result.';api?.check(false,m);update(m,'wrong');return false;}
  selected=Number(v);won=true;const result=s.mode==='shorter'?`${s.a} − ${s.knownDiff} = ${s.b}`:`${math(s).large} − ${math(s).small} = ${math(s).difference}`;
  evt('proof',{a:s.a,b:s.b,result,correct:true});api?.check(true,'Correct: '+result);update('Correct: '+result+'. Addition proves it backwards.','right');return true;
 }
 function setPreset(k){C.preset=k;s={...C.presets[k]};evt('preset',k);reset();}
 function update(m,p){message=m;pose=p;render();}
 function render(){panel.innerHTML='';present(stage,s,{step:5,interactive:!won,challenge,won,selected,pose,resize:!challenge,onResize:resize,onPlace:place,onRemove:remove,onBrace:()=>{marked=true;evt('brace',true);update('The gold segment marks the unpaired length.','brace');}});
  if(!challenge){const select=H('select',{'aria-label':'Comparison example'});Object.entries(C.presets).forEach(([k,v])=>select.add(new Option(v.label,k)));select.value=C.preset;select.onchange=()=>setPreset(select.value);panel.append(H('label',{class:'f402-field'},['Choose a comparison',select]));}
  panel.append(H('p',{class:'f402-instruction',text:s.context}));
  const row=H('div',{class:'f402-controls'}),field=H('label',{class:'f402-field'},[s.mode==='shorter'?'Smaller group':'Difference',H('input',{type:'number',min:0,step:1,'aria-label':'Comparison answer'})]);const inp=field.querySelector('input');inp.value=entry;inp.oninput=()=>{entry=inp.value;};
  if(!won){row.append(field,btn('Place answer',()=>{if(inp.value.trim()&&Number.isInteger(Number(inp.value)))place(Number(inp.value));}),btn('Check',check,true),btn('Hint',hint),btn('Clear',remove));}else row.append(btn('Try again',reset),H('span',{class:'f402-complete',text:'Comparison proved'}));panel.append(row);
  if(!challenge){panel.append(H('div',{class:'f402-controls'},[btn('A −1',()=>resize('a',Math.max(1,s.a-1))),btn('A +1',()=>resize('a',Math.min(C.parameters.max,s.a+1))),btn('B −1',()=>resize('b',Math.max(1,s.b-1))),btn('B +1',()=>resize('b',Math.min(C.parameters.max,s.b+1)))]));panel.append(H('p',{class:'f402-help',text:'Explore: drag either glowing bar end; use arrow keys or the buttons if you prefer. Drag MARK GAP onto the gold region.'}));}
  status.className='f402-status'+(pose==='wrong'?' bad':pose==='right'?' good':'');status.textContent=message;panel.append(status);
 }
 render();return {check,place,resize,getState:()=>({a:s.a,b:s.b,answer:expected(s),selected,won,marked,attempts})};
}
const STEPS=[
 {name:'Start at the same line',narration:'To compare two amounts, begin both bars at exactly the same starting line.',prompt:'Why do the bars need the same starting point?'},
 {name:'Bring in the second group',narration:'The upper group has fifteen. The lower group has nine. Both are measured from the same start.',prompt:'Which bar reaches farther?'},
 {name:'Match the common amount',narration:'The nine units in the smaller bar match nine units in the longer one. Notice the shared length.',prompt:'What part of the two groups matches?'},
 {name:'Find the extra length',narration:'The unmatched part extends beyond the shorter bar. That gap is the difference, not the total.',prompt:'What does the gold part represent?'},
 {name:'Subtract the smaller amount',narration:'We want how many more. Subtract nine from fifteen to measure only the extra part.',prompt:'Why would adding be the wrong operation?'},
 {name:'Prove by matching again',narration:'Fifteen minus nine equals six. Check it: nine plus six equals fifteen. The bars line up exactly.',prompt:'How can addition prove your comparison?'}
];
const def={id:ID,title:'Comparison Bar',config:C,steps:STEPS,alt:'Two quantity bars with a shared left alignment line, a highlighted matching length and a gold extension showing the difference.',staticAlt:'Compare 15 and 9: 15 minus 9 equals 6. Check 9 plus 6 equals 15.',
 render(i,stage){const poses=['align','b','pair','gap','minus','check'];present(stage,C.presets['Y7-007'],{step:i,selected:null,pose:poses[i],subtitle:STEPS[i].name,animate:true});},
 exploreIntro:'Drag the bar ends to compare, then mark the unmatched amount.',explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();live(panel,stage,C.presets[C.preset],false,null);},
 challenge(panel,api,stage){let index=0;function next(){panel.innerHTML='';if(index>=C.challenge.length){const s=C.challenge.at(-1);present(stage,s,{step:5,selected:expected(s),won:true,pose:'right',subtitle:'All three comparisons proved'});panel.append(H('div',{class:'f402-finish',text:'All three comparisons complete: you aligned, subtracted and checked with addition.'}));return;}
 const task=C.challenge[index],round=H('div');panel.append(H('p',{class:'f402-progress',text:`Problem ${index+1} of ${C.challenge.length} · ${task.label}`}),round);
 const localApi={hint:m=>api.hint(m),check:(ok,m)=>{api.check(ok,m,{task:index+1});if(ok)Promise.resolve().then(()=>round.append(H('div',{class:'f402-next'},[btn('Next problem →',()=>{index++;next();},true)])));}};live(round,stage,task,true,localApi);
 }next();}
};
N.registry.add({id:ID,title:'Comparison Bar',topics:['comparison','difference','more than','fewer than','subtraction'],deps:['F0-01','F0-02','F0-08','F0-13']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"helper":["stage","state"],"present":["stage","s","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'02',title:'Comparison Bar · Run 02 Review',def,years:'Year 7 · Adding and subtracting whole numbers, with later KS3 comparison applications.',linked:['F0-02','F1-03','F2-06','F4-01','F4-03'],spec:{
 purpose:'Make additive comparison visible as matched and unmatched lengths, not total quantities.',params:'Two independent whole-number quantities; adjustable 1–30 in Explore; shared starting line; difference and missing shorter amount.',presets:'Year 7 quantities 15 and 9, reverse 8 and 17, close 20 and 18, equal 12 and 12.',
 steps:'Same starting line → second group → common matched amount → unmatched gap → subtract → check by addition.',interactions:'Drag bar end handles to resize; drag MARK GAP onto the mismatch; drop a candidate into the unknown region; keyboard alternatives; numeric answer; three checked challenge tasks.',traps:'Adding instead of comparing, treating a group total as the difference, subtracting in the wrong direction, reversing known gap to find the shorter group.',gcse:'Comparison equations and missing quantities, reverse-addition and contextual inequalities.'}});
window.F402_MATH={math,expected,valid,correct,mistake,options};
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));card.append(dev);
card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();

