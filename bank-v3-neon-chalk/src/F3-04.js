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

/* NOVA F3-04 · Factor-Pair Rainbow · 2026-10-10 revised master.
   Canonical core drawing ONLY; no custom glyph/tick/line/filter/font primitives. */
const F304_CONFIG={id:'F3-04',startMode:'watch',preset:'Y7-013-factors',parameters:{min:2,max:36},
 presets:{
  'Y7-013-factors':{label:'Factors and multiples · 24',n:24,lesson:'Y7-013'},
  'Y7-013-square':{label:'Square number · 36',n:36,lesson:'Y7-013'},
  'Y7-013-small':{label:'Factor pairs · 12',n:12,lesson:'Y7-013'},
  'Y7-014-prime':{label:'Prime number · 13',n:13,lesson:'Y7-014'},
  'Y7-014-composite':{label:'Composite number · 21',n:21,lesson:'Y7-014'}},
 events:{value:['preset','number','candidate','proposedPartner','acceptedPair','removedPair','nonfactor','challengeTask'],types:['step','correct','hintUsed','mode']},
 challenge:{numbers:[12,18,13]}};
window.F304_CONFIG=F304_CONFIG;
(function(){'use strict';const N=window.NOVA,E=N.svg.el,H=N.h,C=window.NovaV2Integration.configuration(F304_CONFIG),id=C.id;
function corePose(p){
 // F0 owns the helper art, placement and motion. Only its universal slots are supplied to its dock.
 const slots=['idle','think','cheer','oops','point','explain','walk','leap'];
 const map={'ruler':'point','point-left':'point','point-right':'point','point-down':'point','show-one':'point','show-two':'point','show-three':'point','count':'point','magnify':'think','idea':'think','compare':'think','high-five':'cheer','celebrate':'cheer','success':'cheer','read-tablet':'think','checking':'think','not-yet':'oops','question':'think','encourage':'cheer'};
 return slots.includes(p)?p:(map[p]||'explain');
}
function analyse(n){n=Number(n);if(!Number.isInteger(n)||n<2||n>36)throw Error('F3-04 supports integer n from 2 to 36.');
 const pairs=[];for(let a=1;a*a<=n;a++)if(n%a===0)pairs.push({a,b:n/a});
 const factors=[...new Set(pairs.flatMap(p=>[p.a,p.b]))].sort((a,b)=>a-b);
 return {n,pairs,factors,prime:pairs.length===1,square:Number.isInteger(Math.sqrt(n)),root:Math.sqrt(n),limit:Math.floor(Math.sqrt(n)),multiples:Array.from({length:3},(_,i)=>n*(i+1))};}
window.F304_MATH={analyse,validPair:(n,a,b)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=1&&b>=a&&a*b===n,
complete:(n,accepted,nonFactors)=>{let m=analyse(n);return Array.from({length:m.limit},(_,i)=>i+1).every(a=>n%a===0?accepted.includes(a):nonFactors.includes(a));}};
function emit(key,value){if(!C.events.value.includes(key))throw Error('F3-04 undeclared event '+key);N.events.emit('value',{engine:id,key,value});}
const txt=(g,x,y,v,size=38,role='given')=>N.chalkText(g,x,y,String(v),{size,role});
const btn=(v,fn,cl='nova-btn')=>H('button',{text:v,class:cl,onclick:fn});
const speech={
 ends:{pose:'ruler',who:'pip',say:'One and the number itself are always a factor pair. Look across the whole line.'},
 outer:{pose:'point-right',who:'pip',say:'Join one to twenty-four. Their product is twenty-four, so the first arch is valid.'},
 two:{pose:'count',who:'pip',say:'Two times twelve makes twenty-four. This second arch sits inside the first.'},
 three:{pose:'show-three',who:'pip',say:'Three times eight also makes twenty-four. Each curve shows two exact factors.'},
 four:{pose:'idea',who:'pip',say:'Four times six is twenty-four. See how the two ends are moving closer together.'},
 fail:{pose:'think',who:'nova',say:'Five does not divide twenty-four exactly. Do not draw an arch for a remainder.'},
 root:{pose:'magnify',who:'pip',say:'Stop testing after the square root. Every later partner is a repeat in reverse order.'},
 proof:{pose:'celebrate',who:'pip',say:'All the arches are here. Read each endpoint once to collect every factor.'},
 explore:{pose:'compare',who:'nova',say:'Change the target number. Connect only exact factor pairs; non-factors leave remainders.'},
 challenge:{pose:'read-tablet',who:'teen',say:'I need evidence for every candidate up to the square root. Prove each pair or show it cannot divide exactly.'},
 success:{pose:'high-five',who:'pip',say:'Every candidate has been checked. The factor-pair list is complete.'}
};
const steps=[
 {name:'ends',target:'factor-number-line',prompt:'Which two whole numbers always multiply to the target?',narration:'Begin with one and twenty-four. Every positive whole number is divisible by one, so one times twenty-four equals twenty-four.'},
 {name:'outer',target:'factor-arches',prompt:'Where do the ends of the widest arch land?',narration:'Draw one arch from one to twenty-four. Its two endpoints multiply to twenty-four.'},
 {name:'two',prompt:'Does twenty-four divide evenly into groups of two?',narration:'Two times twelve is twenty-four. Add the next factor arch, linking two and twelve.'},
 {name:'three',prompt:'Which partner belongs with three?',narration:'Three times eight is twenty-four. Draw an inner arch for this exact pair.'},
 {name:'four',prompt:'Why are the endpoints moving closer together?',narration:'Four times six is twenty-four. As one factor increases, its partner decreases.'},
 {name:'fail',prompt:'Is five a factor of twenty-four? Explain the remainder.',narration:'Five cannot divide twenty-four exactly. Four groups of five leave four, so five is not a factor.'},
 {name:'root',target:'factor-square-root',prompt:'Why can we stop after four?',narration:'The square root of twenty-four lies between four and five. Any factor bigger than this has a smaller partner already checked.'},
 {name:'proof',prompt:'List every factor without duplicating a partner.',narration:'The factors of twenty-four are one, two, three, four, six, eight, twelve and twenty-four. They divide exactly. Multiples of twenty-four begin twenty-four, forty-eight and seventy-two.'}
];
function makeDrawing(n,opt={}){
 const m=analyse(n),challenge=!!opt.challenge,explore=!!opt.explore,full=challenge||explore;
 const svg=N.svg.root(840,690,'NOVA factor-pair rainbow showing the number line from 0 to '+n+', factor-pair arches, and the square-root stopping point.');svg.classList.add('f304-svg');
 const lineY=450,x0=94,span=650,xx=v=>x0+v/n*span;
 let shown=opt.showPairs||[],rootVisible=!!opt.rootVisible;
 // Glowing glass status cards are mathematically meaningful, not a backing frame behind the arcs.
 N.neonBox(svg,61,39,718,79,{role:'support',r:19});
 txt(svg,268,92,full?'Find every pair':(opt.step===0?'Start with the endpoints':'Join factors in pairs'),40,'given');
 N.neonRing(svg,683,79,{role:'result',r:26,pulse:false});txt(svg,683,92,n,42,'result');
 // Every integer tick is numbered. Use F0's canonical numberLine renderer for
 // the axis, ticks AND chalk values: do not introduce custom SVG labels.
 // The type scale shrinks for higher targets so adjacent 2-digit values fit.
 const showLabels=v=>String(v);
 const everyValueSize=n<=12?29:n<=18?25:n<=24?21:n<=30?18:21;
 // The canonical helper alone draws the number line, all ticks, endpoint arrows and chalk labels.
 const numberLine=N.numberLine(svg,{x:x0,y:lineY,w:span,min:0,max:n,major:1,label:showLabels,labelSize:everyValueSize});numberLine.g.setAttribute('data-maths','factor-number-line');
 // For the densest 31–36 scales, retain *every* F0-generated chalk number,
 // alternating its baseline to keep neighbouring two-digit numbers separated.
 // The x coordinate is unchanged: each value remains centered on its exact tick.
 if(n>=31)numberLine.g.querySelectorAll('text').forEach((node,i)=>{
   if(i%2)node.setAttribute('y',String(lineY+66));
 });

 // Each pair is an actual multiplicative proof. Larger span = taller nested arch.
 function arc(p,j){const x1=xx(p.a),x2=xx(p.b),width=x2-x1,peak=68+(width/span)*184;
  const role=['op','given','support','result','focus'][j%5];
  if(p.a===p.b){N.neonRing(svg,x1,lineY-3,{role:'result',r:22,pulse:false});txt(svg,x1,lineY-42,p.a+' × '+p.b,41,'result');return;}
  const d='M '+x1.toFixed(2)+' '+(lineY-7)+' Q '+((x1+x2)/2).toFixed(2)+' '+(lineY-7-peak*2).toFixed(2)+' '+x2.toFixed(2)+' '+(lineY-7);
  let g=N.neonPath(svg,d,{role,width:5});g.classList.add('f304-arch');g.setAttribute('data-maths','factor-arches');g.dataset.pair=p.a+'-'+p.b;
  N.neonRing(svg,x1,lineY-8,{role,r:10,pulse:false});N.neonRing(svg,x2,lineY-8,{role,r:10,pulse:false});
  const xm=(x1+x2)/2;let labelX=xm,labelY=lineY-peak-16;
  if(m.pairs.length>=4&&j===1){labelX=xm+58;labelY-=14;}
  if(m.pairs.length>=4&&j===2){labelX=xm+190;labelY-=10;}
  if(m.pairs.length>=4&&j===3){labelX=xm-56;labelY+=7;}
  txt(svg,labelX,labelY,p.a+' × '+p.b,41,role);
  if(opt.animate&& !N.reducedMotion())N.motion.arrive(g,0,-16,500+90*j,N.motion.ease.back);
 }
 shown.forEach((a,i)=>{const p=m.pairs.find(p=>p.a===a);if(p)arc(p,i);});
 if(opt.step===0){N.neonRing(svg,xx(1),lineY-8,{role:'focus',r:14,pulse:false});N.neonRing(svg,xx(n),lineY-8,{role:'result',r:14,pulse:false});txt(svg,410,260,'1 × '+n+' = '+n,48,'focus');}
 if(opt.testFail){const a=opt.testFail;N.neonRing(svg,xx(a),lineY-8,{role:'focus',r:20,pulse:!N.reducedMotion()});txt(svg,460,363,a+' leaves a remainder',41,'focus');if(!N.reducedMotion())N.motion.flash(svg,xx(a),lineY-8,'focus',38);}
 if(rootVisible){const x=xx(m.root);const rootRing=N.neonRing(svg,x,lineY-3,{role:'result',r:19,pulse:!N.reducedMotion()});if(rootRing)rootRing.setAttribute('data-maths','factor-square-root');
  const desc=m.square?'√'+n+' = '+m.root:'√'+n+' ≈ '+m.root.toFixed(1);
  if(!full)txt(svg,Math.max(190,Math.min(647,x+90)),lineY+135,desc,42,'result');}
 if(opt.step===7){txt(svg,419,643,'Factors: '+m.factors.join(', '),41,'result');}
 if(full){
  const a=opt.candidate||1;
  N.neonBox(svg,60,535,330,69,{role:'focus'});
  txt(svg,225,581,(a+' × ? = '+n),42,'focus');
  if(opt.locked?.includes(a))txt(svg,584,578,'Paired',42,'result');
  else if(opt.nonFactors?.includes(a))txt(svg,584,578,'No partner',42,'support');
  else {
   // The open, dashed arch represents a proposed but NOT YET proven pair.
   // Its free end is the real draggable target; no guessed partner is marked on the number line.
   const fx=620,fy=302,xFrom=xx(a),d='M '+xFrom.toFixed(2)+' '+(lineY-14)+' Q '+((xFrom+fx)/2).toFixed(2)+' 250 '+fx+' '+fy;
   N.neonPath(svg,d,{role:'focus',width:5,dash:'13 12'});
   // The open neon end and the exact-product statement supply the instruction without overlapping arches.
   const s=E('g',{'data-pair-end':String(a),role:'button',tabindex:'0','aria-label':'Drag open arc end to the correct tick, or press Enter for keyboard partner controls'},svg);
   N.neonRing(s,fx,fy,{role:'focus',r:33,pulse:false});txt(s,fx,fy+12,'?',45,'focus');
   s.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();opt.focusPartner?.();}});
   N.ui.svgDrag(svg,s,{box:{x:fx-36,y:fy-36,w:72,h:72},zones:()=>Array.from({length:n},(_,i)=>({id:String(i+1),kind:'drop',x:xx(i+1)-Math.max(8,span/n*.43),y:417,w:Math.max(16,span/n*.86),h:70})),onDrop:z=>opt.propose?.(Number(z))||false});
  }
  N.neonBox(svg,335,615,260,56,{role:'error'});txt(svg,465,652,'Remove / undo',39,'error');
  if(opt.locked?.length){opt.locked.forEach(a=>{const pair=m.pairs.find(p=>p.a===a);if(!pair)return;const x=xx(pair.b),h=E('g',{'data-locked-end':String(a),role:'button',tabindex:'0','aria-label':'Remove pair '+a+' and '+pair.b+'; press Delete to undo'},svg);
   N.neonRing(h,x,lineY-8,{role:'result',r:18,pulse:false});
   h.addEventListener('keydown',ev=>{if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();opt.remove?.(a);}});
   N.ui.svgDrag(svg,h,{box:{x:x-22,y:lineY-29,w:44,h:44},zones:()=>[{id:'remove',kind:'remove',x:335,y:615,w:260,h:56}],onRemove:()=>opt.remove?.(a)});
  });}
 }
 return svg;
}
function scene(stage,n,opt={}){
if(window.NovaLessonComponent?.active){[stage,n,opt]=window.NovaLessonComponent.args("scene",arguments);}
const m=analyse(n);stage.innerHTML='';N.cap(stage,'Factor-pair rainbow',opt.caption||'Two endpoints form one exact multiplication');
 const sceneEl=H('div',{class:'f304-scene'}),art=makeDrawing(n,opt),side=H('aside',{class:'f304-side'});
 const pairs=m.pairs.map(x=>x.a+' × '+x.b);
 side.append(N.neonCard([H('span',{class:'f304-kicker',text:'TARGET NUMBER'}),H('p',{class:'f304-ink',text:String(n)})],{role:'given'}),
 N.neonCard([H('span',{class:'f304-kicker',text:'EXACT FACTOR PAIRS'}),H('p',{class:'f304-ink',text:opt.step===0?'Start at 1':(opt.challenge?'Prove them one by one':pairs.join('   ·   '))})],{role:'op'}),
 N.neonCard([H('span',{class:'f304-kicker',text:'MATHEMATICAL TEST'}),H('p',{class:'f304-small',text:m.prime?'Only 1 and '+n+' divide exactly. This number is prime.':m.square?'A square number has a centre pair '+m.root+' × '+m.root+'.':'Test candidates only through '+m.limit+'. Larger factor partners have already appeared.'}),H('p',{class:'f304-small',text:'Factors divide '+n+' exactly. Multiples grow: '+m.multiples.join(', ')+'.'})],{role:'result'}));
 sceneEl.append(art,side);stage.append(sceneEl);
 const s=speech[opt.say||'explore'];N.scene.helperStrip(stage,corePose(opt.success?'cheer':s.pose),opt.helper||s.say);return art;}
const def={id,title:'Factor-pair rainbow',config:C,steps,alt:'Number line with neon rainbow arches joining exactly multiplying factors and a ring at the square root.',
 staticAlt:'For 24, the factor pairs are 1 × 24, 2 × 12, 3 × 8 and 4 × 6. We only need test possible smaller factors through 4.',
 render(i,stage){const reveal=[[],[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]];
  scene(stage,def.lesson.active?.parameters?.n??24,{step:i,showPairs:reveal[i],testFail:i===5?5:null,rootVisible:i>=6,animate:true,say:steps[i].name,caption:['Test one and the number','Join 1 and 24','Next: 2 and 12','Next: 3 and 8','Next: 4 and 6','Try a non-factor','Stop near the square root','Complete factor proof'][i]});},
 exploreIntro:'Pick a target and connect a candidate to its exact partner. A non-factor must leave a remainder.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let n=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("n",()=>(24)):(24)),preset=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("preset",()=>(C.preset)):(C.preset)),candidate=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("candidate",()=>(2)):(2)),locked=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("locked",()=>([1])):([1])),nonFactors=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("nonFactors",()=>([])):([])),message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Two times twelve makes twenty-four. Drag the ? to twelve, or use the partner selector.')):('Two times twelve makes twenty-four. Drag the ? to twelve, or use the partner selector.'));
 window.NovaLessonComponent?.applyExploreModels();const heading=H('p',{class:'f304-intro',text:'Test every whole-number candidate up to the square root. Connect valid factor pairs.'}),choice=H('select',{'aria-label':'Factor-pair preset'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,v])=>choice.add(new Option(v.label,k)));
 window.NovaLessonComponent?.applyExploreModels();const num=H('input',{type:'number','aria-label':'Target number',min:2,max:36,step:1,value:24});
 window.NovaLessonComponent?.applyExploreModels();const candidateSelect=H('select',{'aria-label':'Candidate to test'}),partnerSelect=H('select',{'aria-label':'Proposed factor partner'});
 window.NovaLessonComponent?.applyExploreModels();const status=H('p',{class:'f304-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();function reset(){locked=[1];nonFactors=[];candidate=Math.min(2,analyse(n).limit);message='The first arch connects 1 and '+n+'. Find all the other pairs.';emit('number',n);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function propose(b){emit('proposedPartner',{candidate,partner:b});if(candidate*b!==n||b<candidate){message=b<candidate?'This is the same pair in reverse. Test candidates only up to the square root.':candidate+' × '+b+' is '+candidate*b+', not '+n+'. '+(n%candidate?'There is a remainder.':'Try the exact matching factor.');status.dataset.kind='error';status.textContent=message;return false;}
  if(!locked.includes(candidate))locked.push(candidate);emit('acceptedPair',{a:candidate,b});message='Correct! '+candidate+' × '+b+' = '+n+'. The arch is exact.';status.dataset.kind='';redraw();return true;}
 window.NovaLessonComponent?.applyExploreModels();function noPartner(){if(n%candidate===0){message='This candidate does have an exact partner: '+(n/candidate)+'.';status.dataset.kind='error';status.textContent=message;return;}
  if(!nonFactors.includes(candidate))nonFactors.push(candidate);emit('nonfactor',candidate);message=candidate+' is not a factor: '+n+' ÷ '+candidate+' leaves remainder '+n%candidate+'.';status.dataset.kind='';redraw();}
 window.NovaLessonComponent?.applyExploreModels();function remove(a){locked=locked.filter(k=>k!==a);if(a===1)locked.push(1);emit('removedPair',a);candidate=a;message='Removed that arch. Retest the pair.';redraw();}
 window.NovaLessonComponent?.applyExploreModels();function redraw(){candidateSelect.innerHTML='';const limit=analyse(n).limit;for(let k=1;k<=limit;k++)candidateSelect.add(new Option('Try '+k,k));candidate=Math.min(candidate,limit);candidateSelect.value=String(candidate);
  partnerSelect.innerHTML='';for(let k=1;k<=n;k++)partnerSelect.add(new Option(k,k));partnerSelect.value=String(Math.min(n,Math.round(n/candidate)));
  num.value=n;status.textContent=message;status.dataset.kind='';scene(stage,n,{explore:true,candidate,locked,nonFactors,showPairs:locked,rootVisible:true,say:'explore',caption:'Find every exact pair and explain the remainder',propose,remove,focusPartner:()=>partnerSelect.focus()});}
 window.NovaLessonComponent?.applyExploreModels();choice.onchange=()=>{preset=choice.value;n=C.presets[preset].n;emit('preset',preset);reset();};
 window.NovaLessonComponent?.applyExploreModels();num.onchange=()=>{n=Math.max(2,Math.min(36,Math.round(+num.value||24)));choice.value=Object.keys(C.presets).find(k=>C.presets[k].n===n)||'Y7-013-factors';reset();};
 window.NovaLessonComponent?.applyExploreModels();candidateSelect.onchange=()=>{candidate=+candidateSelect.value;emit('candidate',candidate);message='Try '+candidate+'. An exact factor has a whole-number partner.';redraw();};
 window.NovaLessonComponent?.applyExploreModels();const group=H('div',{class:'f304-row'},[H('label',{},['Preset',choice]),H('label',{},['Target n',num])]);
 window.NovaLessonComponent?.applyExploreModels();const group2=H('div',{class:'f304-row'},[H('label',{},['Test candidate',candidateSelect]),H('label',{},['Partner',partnerSelect]),btn('Connect pair',()=>propose(+partnerSelect.value),'nova-btn primary'),btn('No exact partner',noPartner),btn('Show complete factor proof',()=>{const m=analyse(n);locked=m.pairs.map(p=>p.a);nonFactors=Array.from({length:m.limit},(_,i)=>i+1).filter(a=>n%a);message='Proved: '+m.factors.join(', ')+(m.prime?'. Only 1 and itself: prime.':'. Composite: more than two factors.');redraw();})]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(heading,H('p',{class:'f304-note',text:'Factors divide the target exactly. Multiples come from multiplying the target by 1, 2, 3 and onward.'}),group,group2,status);window.NovaLessonComponent?.applyExploreModels();redraw();},
 challenge(panel,api,stage){const challenges=C.challenge.numbers;let task=0,candidate=1,locked=[],nonFactors=[],message='Start with 1 and '+challenges[0]+'. Place the arc end at its exact partner.',wrong=0,completed=false;
 const status=H('p',{class:'f304-status',role:'status'}),partner=H('select',{'aria-label':'Choose matching factor'});
 const taskHeading=H('p',{class:'f304-intro'}),descr=H('p',{class:'f304-note',text:'A factor divides the target exactly (unlike its multiples). Drag the glowing ? endpoint to a tick, or choose a partner with the keyboard controls. Use “No exact partner” for remainders.'});
 function n(){return challenges[task];}
 function fail(t){message=t;wrong++;api.check(false,t,{task,wrong,candidate});status.textContent=message;status.dataset.kind='error';return false;}
 function done(){const m=analyse(n());if(!window.F304_MATH.complete(n(),locked,nonFactors))return false;
  api.check(true,'All candidates tested, with every exact pair and no extras.',{task,number:n()});
  if(task===challenges.length-1){completed=true;render();return true;}
  task++;candidate=1;locked=[];nonFactors=[];wrong=0;message='Next proof. Find every factor pair of '+n()+'.';emit('challengeTask',task);render();return true;}
 function advance(){const limit=analyse(n()).limit;candidate=Array.from({length:limit},(_,i)=>i+1).find(a=>!locked.includes(a)&&!nonFactors.includes(a))||limit+1;if(candidate>limit){done();}else{emit('candidate',candidate);message='Now test '+candidate+'. Find an exact partner, or show a remainder.';render();}}
 function propose(b){if(completed)return false;emit('proposedPartner',{candidate,partner:b});const v=candidate*b;
  if(b<candidate)return fail('You have already tested that mirrored pair. Look at candidates up to the square root.');
  if(v!==n())return fail(candidate+' × '+b+' = '+v+', not '+n()+'. '+(n()%candidate?'This candidate leaves a remainder.':'Try a different partner.'));
  if(locked.includes(candidate))return false;locked.push(candidate);emit('acceptedPair',{a:candidate,b});message='Exact pair: '+candidate+' × '+b+' = '+n()+'.';N.motion.flash(stage.querySelector('.f304-svg'),683,79,'result',35);advance();return true;}
 function noPartner(){if(completed)return;if(n()%candidate===0){fail(candidate+' divides '+n()+' exactly. Its missing partner is '+(n()/candidate)+'.');return;}
  if(!nonFactors.includes(candidate))nonFactors.push(candidate);emit('nonfactor',candidate);message='Correct: '+n()+' ÷ '+candidate+' leaves remainder '+n()%candidate+'.';advance();}
 function remove(a){locked=locked.filter(x=>x!==a);emit('removedPair',a);candidate=a;message='That arch was removed. Show its exact partner again.';render();}
 function render(){panel.innerHTML='';const m=analyse(n());
  if(completed){scene(stage,n(),{step:7,showPairs:m.pairs.map(p=>p.a),rootVisible:true,success:true,say:'success',caption:'Every factor pair proven'});
   panel.append(H('p',{class:'f304-complete',text:'Three complete factor proofs · composites and prime numbers'}),H('p',{class:'f304-note',text:'12: 1 × 12, 2 × 6, 3 × 4. 18: 1 × 18, 2 × 9, 3 × 6, and 4 is not a factor. 13: only 1 × 13; 2 and 3 are non-factors.'}));return;}
  const isNon=n()%candidate!==0;taskHeading.textContent='Proof '+(task+1)+' / 3 · '+n()+(m.prime?' (prime test)':' (factor hunt)')+' · Candidate '+candidate+' / '+m.limit;
  partner.innerHTML='';for(let k=1;k<=n();k++)partner.add(new Option(String(k),String(k)));
  partner.value=String(isNon?Math.min(n(),Math.floor(n()/candidate)):n()/candidate);
  const controls=H('div',{class:'f304-row'},[H('label',{},['Proposed partner',partner]),btn('Join endpoints',()=>propose(+partner.value),'nova-btn primary'),btn('No exact partner',noPartner),btn('Hint',()=>{api.hint('Use multiplication to test '+candidate+'. If '+n()+' ÷ '+candidate+' gives a remainder, say no partner. Stop at the square root.');})]);
  const undo=H('div',{class:'f304-row'},[btn('Undo last pair',()=>{if(locked.length)remove(locked.at(-1));else{message='No completed pair to undo.';status.textContent=message;}}),H('span',{class:'f304-quiet',text:'Remove a glowing endpoint by dragging it into the red tray, or pressing Delete.'})]);
  panel.append(taskHeading,descr,controls,undo,status);status.textContent=message;status.dataset.kind='';scene(stage,n(),{challenge:true,candidate,locked,nonFactors,showPairs:locked,rootVisible:true,say:'challenge',caption:'Drag the arc end to its matching number',propose,remove,focusPartner:()=>partner.focus()});
 }
 emit('challengeTask',task);render();},onRestore(){}
};
N.registry.add({id,title:def.title,topics:['factors','factor pairs','prime numbers','composite numbers'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F1-01']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"steps":()=>steps},draws:{"scene":["stage","n","opt"]},exploreFields:{"n":{"kind":"value","factory":null,"argCount":null},"preset":{"kind":"value","factory":null,"argCount":null},"candidate":{"kind":"value","factory":null,"argCount":null},"locked":{"kind":"value","factory":null,"argCount":null},"nonFactors":{"kind":"value","factory":null,"argCount":null},"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id,num:'04',title:'Factor-pair rainbow · Premium Review',def,linked:['F1-01','F3-01','F3-05','F3-07'],years:'KS3 Year 7: Y7-013 and Y7-014 · Years 8–9 consolidation',spec:{
 purpose:'Show the complete set of factor pairs as nested exact-product arches on the approved number line, distinguishing factors and primes.',
 params:'Integer n from 2 to 36; exact factor pairs; dynamic square-root stopping position; composite, square and prime examples.',
 presets:'Curriculum-linked Y7-013 factors (24, 36, 12) and Y7-014 prime/composite (13, 21). No unverified lesson IDs.',
 steps:'Endpoints → 1 × n arch → candidate tests for 2, 3 and 4 → non-factor five → square-root stopping criterion → complete factor proof.',
 interactions:'Pick a candidate; F2-style drag the glowing arc end to a numbered tick; green correct snap, incorrect spring-back; remove a proven endpoint via red tray or Delete; keyboard partner selector and no-partner classification.',
 traps:'Missing 1 and n, confusing factors with multiples, reversing the same pair, accepting a number with a remainder, believing prime numbers have no factors, missing the square-centre pair.',
 gcse:'Square-root divisor bound and systematic trial division support prime-factor decomposition, HCF/LCM, and later algebraic factorisation.'
}});
// Canonical pointer-capture safety adapter: never edits or duplicates the shared core.
window.addEventListener('pointermove',ev=>{const d=N.ui._drag;if(d?.captured&&d.el?.isConnected&&document.getElementById(id)?.contains(d.el)&&!d.el.contains(ev.target))d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:ev.pointerId,clientX:ev.clientX,clientY:ev.clientY,buttons:ev.buttons,bubbles:false}));});
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(d?.el&&document.getElementById(id)?.contains(d.el)){if(!d.el.contains(ev.target))d.up(ev);if(N.ui._drag)N.ui.cancelDrag();}});
const card=document.getElementById(id),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(e=>dev.append(e));card.append(dev);const title=card.querySelector('h3');if(title)title.textContent='Interactive mathematics';
function bobAlt(){card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.alt='Sir Bob Maximus, mathematics tutor';});}bobAlt();new MutationObserver(bobAlt).observe(card,{childList:true,subtree:true});
})();
