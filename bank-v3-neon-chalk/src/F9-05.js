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

/* F9-05 Linear nth term derivation — NOVA shared core + neon and Chalk; no independent stage background. */
const F905_CONFIG={id:'F9-05',family:'F9',startMode:'watch',preset:'Y7-037-linear-nth-term',presets:{
 'Y7-037-linear-nth-term':{label:'Y7 · 3n + 2',year:'Year 7',a:3,c:2,objective:'Find and use the nth term of an increasing linear sequence'},
 'Y8-019-arithmetic-sequences':{label:'Y8 · 5n − 3',year:'Year 8',a:5,c:-3,objective:'Link the common difference to a linear nth term with negative adjustment'},
 'Y8-019-decreasing-variant':{label:'Y8 · 22 − 4n',year:'Year 8',a:-4,c:22,objective:'Derive a decreasing linear rule using the zero term'}
 },events:{value:['preset','position','difference','zeroTerm','rule','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,C=window.NovaV2Integration.configuration(F905_CONFIG),H=N.h,E=N.svg.el,id=C.id;
const sm=()=>innerWidth<=760,W=()=>sm()?430:760;
const term=(p,n)=>p.a*n+p.c;
const fmt=(v,showSign=false)=>v<0?'−'+Math.abs(v):((showSign?'+':'')+v);
const formula=(p)=>p.a<0?fmt(p.a)+'n '+(p.c<0?'− '+Math.abs(p.c):'+ '+p.c):p.a+'n '+(p.c<0?'− '+Math.abs(p.c):'+ '+p.c);
const steps=[
 {name:'notice-the-term-row',idx:0,pose:'explain',narration:'Look at the positions and their terms. What changes every time the position goes up by one?',prompt:'Read positions one to five. Read the term underneath each.'},
 {name:'find-the-common-difference',idx:1,pose:'count',narration:'The same three is added each time. That is the common difference.',prompt:'Find the equal differences between adjacent terms.'},
 {name:'build-the-dn-row',idx:2,pose:'point-right',narration:'Multiply each position by three. This builds the three n part of the rule.',prompt:'Compare the new row with the original terms.'},
 {name:'find-the-adjustment',idx:3,pose:'think',narration:'The original terms are always two more than three times the position. That missing two is the adjustment.',prompt:'What is the same gap between the original term and three n?'},
 {name:'step-back-to-zero',idx:4,pose:'idea',narration:'Step back one term. Five subtract three gives two. That is the zero term.',prompt:'Why does the zero term tell us what to add? '},
 {name:'write-the-nth-term',idx:5,pose:'celebrate',narration:'Three n gives the growing part. Add two for the starting offset. Our rule is three n plus two.',prompt:'Check the rule at another position; it must work every time.'}
];
let explorePreset='Y7-037-linear-nth-term',exploreCount=5,showZero=true,challengeTask=0,placed={},kbChoice=null,stageRef=null,challengePanel=null,challengeApi=null;
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unknown F905 event '+key);N.events.emit('value',{engine:id,key,value});}
function txt(p,x,y,v,size=18,role='given',anchor='middle'){return N.chalkText(p,x,y,String(v),{size,role,anchor});}
function neonBox(p,x,y,w,h,v,role='given',size=20){return N.neonBox(p,x,y,w,h,{role,text:v,size,r:12});}
function btn(text,click,cls='nova-btn ghost'){return H('button',{class:cls,text,onclick:click});}
function svgRoot(alt,challenge=false){const svg=N.svg.root(W(),sm()?(challenge?885:935):(challenge?885:935),alt);svg.setAttribute('class','nv-svg f905-svg');svg.setAttribute('role','img');return svg;}
function reset(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("reset",arguments);}
stage.innerHTML='';N.cap(stage,'Sequence workshop','Linear nth term derivation');}
function card(label,value,gold=false){return H('div',{class:'f905-card'+(gold?' f905-card--gold':'')},[H('div',{class:'f905-eyebrow',text:label}),H('div',{class:'f905-maths'+(gold?' f905-maths--gold':''),text:String(value)})]);}
function note(label,value){return H('div',{class:'f905-card f905-card--full'},[H('div',{class:'f905-eyebrow',text:label}),H('div',{class:'f905-body',text:value})]);}
function mountScene(stage,svg,cards,pose,speech){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,speech]=window.NovaLessonComponent.args("mountScene",arguments);}
stage.appendChild(H('div',{class:'f905-stage'},[svg,H('aside',{class:'f905-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function drawTable(svg,p,opts={}){
 const width=W(),small=sm(),show=opts.step===undefined?5:opts.step;
 // A vertical proof: each mathematical row has its OWN spacious band.
 // The shared F0 family background is never replaced or overlaid.
 const x0=small?94:140,dx=small?60:120;
 const y={n:158,T:259,diff:394,dn:492,offset:615,zero:734,formula:845};
 txt(svg,width/2,45,opts.title||'READ THE SEQUENCE',small?24:30,'support');
 txt(svg,width/2,81,opts.subtitle||'Compare each position with its term',small?16:19,'support');
 function head(label,top,role='support'){
    txt(svg,width/2,top,label,small?18:21,role);
 }
 head('POSITION n',119);
 for(let i=0;i<5;i++){
   const x=x0+i*dx;
   neonBox(svg,x-25,y.n-25,50,48,String(i+1),'given',small?21:24);
 }
 N.neonLine(svg,x0-42,198,x0+4*dx+43,198,{role:'support',width:1.6});
 head('TERM T(n)',221);
 for(let i=0;i<5;i++){
   const x=x0+i*dx;
   neonBox(svg,x-28,y.T-25,56,49,String(term(p,i+1)),'result',small?22:25);
 }
 N.neonLine(svg,x0-42,301,x0+4*dx+43,301,{role:'support',width:1.6});
 if(show>=1){
   head('THE SAME DIFFERENCE',354,'focus');
   for(let i=0;i<4;i++){
     const x=x0+i*dx;
     // Hops grow from the term cells but don't collide with their labels.
     N.svg.hop(svg,x+18,x+dx-18,335,{role:'focus',height:31});
     txt(svg,x+dx/2,y.diff+9,fmt(p.a,true),small?20:23,'focus');
   }
 }
 if(show>=2){
   head('MULTIPLY THE POSITION BY d',448);
   for(let i=0;i<5;i++){
      const x=x0+i*dx;neonBox(svg,x-28,y.dn-26,56,49,String(p.a*(i+1)),'op',small?21:24);
   }
   N.neonLine(svg,x0-42,535,x0+4*dx+43,535,{role:'support',width:1.6});
 }
 if(show>=3){
   head('COMPARE TERM AND dn',576,'focus');
   for(let i=0;i<5;i++)txt(svg,x0+i*dx,y.offset+8,fmt(p.c,true),small?19:23,'focus');
   N.svg.pill(svg,width/2,667,'T(n) − dn = '+fmt(p.c),{role:'focus',size:small?17:21});
 }
 if(show>=4 || opts.forceZero){
   // The zero term is a separate teaching beat, not a cramped 6th column.
   // This prevents overlap with the position row on 380px screens.
   N.svg.pill(svg,width/2,y.zero,'n = 0  →  T(0) = '+fmt(p.c),{role:'result',size:small?19:23});
   txt(svg,width/2,780,'Reverse the first '+fmt(p.a,true)+' jump to find c',small?15:19,'support');
 }
 if(show>=5){
   N.neonBox(svg,width*.18,y.formula-29,width*.64,59,{role:'result',text:'T(n) = '+formula(p),size:small?26:34,r:18});
 }
 if(!N.reducedMotion()&&!opts.noMotion){
   const cells=[...svg.querySelectorAll('.nv-neon-box,.nv-hop')];
   cells.forEach((el,i)=>{if(i<22){el.style.opacity='0.14';N.motion.tween(300+i*28,v=>{if(el.isConnected)el.style.opacity=String(.14+.86*v);},N.motion.ease.out);}});
 }
}
function learning(index,stage){const step=steps[Math.min(index,steps.length-1)],p=C.presets['Y7-037-linear-nth-term'];reset(stage);const svg=svgRoot('Position-to-term table showing differences, the d times n row and the zero term.');
 drawTable(svg,p,{step:step.idx,subtitle:['Look at the term values','Every next term adds the same amount','Use the difference to build the dn row','Compare the term row and dn row','Step back once to position zero','Write and verify the full linear rule'][step.idx]});
 const side=[card('COMMON DIFFERENCE',step.idx>=1?'+3':'Find it',step.idx>=1),card('ZERO TERM',step.idx>=4?'+2':'Not yet'),note('YOUR NEXT THOUGHT',step.prompt)];
 if(step.idx>=5)side.push(card('NTH TERM','3n + 2',true));
 mountScene(stage,svg,side,step.pose,step.narration);
}
function exploreDraw(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("exploreDraw",arguments);}
const p=C.presets[explorePreset];reset(stage);const svg=svgRoot('Adjust and compare the linear nth-term rule, zero term and term table.');
 drawTable(svg,p,{step:showZero?5:3,limit:exploreCount,forceZero:showZero,title:p.label,subtitle:'Change the preset, then compare the common difference and zero term'});
 const side=[card('DIFFERENCE',fmt(p.a,true),true),card('ZERO TERM',showZero?fmt(p.c,true):'Hidden'),card('RULE',formula(p),true),note('EXPLAIN',p.a<0?'A negative common difference means the terms fall as n increases.':'Stepping back one term finds the value when n is zero.')];
 mountScene(stage,svg,side,p.a<0?'think':'idea','The coefficient is the common difference. The constant is the zero term.');
}
const TASKS=[
 {key:'Y7-037-linear-nth-term',title:'01 · Find the growing rule',guide:'The terms are 5, 8, 11, 14, 17. Build T(n) = dn + c and check the sixth term.',d:['+3','+4','+2'],c:['+2','+5','−2'],next:20,
   traps:{'+4':'Compare 5 to 8: the difference is three, not four.','+2':'The difference between consecutive terms is three.','+5':'Five is the first term, not the zero term.','−2':'Step back from five by three. The zero term is positive two.'}},
 {key:'Y8-019-arithmetic-sequences',title:'02 · Find the negative adjustment',guide:'The terms are 2, 7, 12, 17, 22. Build T(n) = dn + c and check the sixth term.',d:['+5','+2','×5'],c:['−3','+2','+3'],next:27,
   traps:{'+2':'This is the first term, not the common difference.','×5':'Multiplying by five is not the same as adding five.','+2':'Step back from position one using the difference.','+3':'The zero term is less than the first term; check the sign.'}},
 {key:'Y8-019-decreasing-variant',title:'03 · Derive a decreasing rule',guide:'The terms are 18, 14, 10, 6, 2. Build T(n) = dn + c and check the sixth term.',d:['−4','+4','−2'],c:['+22','+18','−22'],next:-2,
   traps:{'+4':'The terms go DOWN by four each time.','−2':'The sequence decreases by four, not two.','+18':'Eighteen is term one. Step back by reversing the minus-four change.','−22':'Step backward from eighteen by adding four, giving a positive zero term.'}}
];
const task=()=>TASKS[challengeTask],needed=(kind,t)=>kind==='d'?fmt(C.presets[t.key].a,true):fmt(C.presets[t.key].c,true);
const zone=(kind)=>kind==='d'?{x:sm()?112:230,y:sm()?557:531,w:sm()?98:116,h:55,id:'d',kind:'drop'}:{x:sm()?254:434,y:sm()?557:531,w:sm()?98:116,h:55,id:'c',kind:'drop'};
const tray=()=>({x:sm()?20:190,y:795,w:sm()?390:370,h:52,id:'remove',kind:'remove'});
function diagnostic(kind,value){const t=task(),p=C.presets[t.key];if(value===needed(kind,t))return '';
 if(kind==='d'){if(p.a<0&&value[0]==='+')return 'The sequence decreases. The common difference must be negative.';if(value==='×5')return 'The rule needs a common DIFFERENCE, not a multiplier.';return t.traps[value]||'Subtract two adjacent terms to find d.';}
 if(value===fmt(term(p,1),true))return 'You chose the first term. Step backward one position to find the zero term.';
 return t.traps[value]||'Check the zero term: c equals the first term minus d.';
}
function place(kind,value){if(value!==needed(kind,task())){challengeApi.check(false,diagnostic(kind,value),{task:challengeTask,slot:kind,answer:value});return false;}
 placed[kind]=value;emit('placed',{slot:kind,value});kbChoice=null;renderChallenge();return true;}
function remove(kind){delete placed[kind];emit('placed',{slot:kind,value:null});renderChallenge();}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pointerId=e.pointerId;let done=false;
  const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
  function move(e){if(done)return;if(N.ui._drag!==drag){clean();return;}if(e.pointerId!==pointerId||g.contains(e.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons}));}
  function up(e){if(e.pointerId!==pointerId)return;if(N.ui._drag===drag&&drag.up)drag.up(e);clean();}
  function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
  window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function source(svg,kind,v,x,y,w,h){const g=E('g',{'data-source':kind+':'+v,tabindex:0,role:'button','aria-label':'Card '+v+' for '+kind+'; press Enter to select'},svg);neonBox(g,x,y,w,h,v,kind==='d'?'focus':'given',sm()?17:19);
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();kbChoice={kind,value:v};updateStatus('Selected '+v+'. Press Enter on the matching gap.');}});
  g.addEventListener('click',()=>{kbChoice={kind,value:v};updateStatus('Selected '+v+'. Press Enter on the matching gap.');});
  N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[zone(kind),tray()],onDrop:(id)=>id===kind?place(kind,v):false,onRemove:()=>{kbChoice=null;updateStatus('Card returned to the tray.');},removeTo:{x:W()/2,y:tray().y+26}});fastBridge(g);
}
function updateStatus(text){const t=challengePanel&&challengePanel.querySelector('.f905-status');if(t)t.textContent=text;}
function placedChip(svg,kind,v){const z=zone(kind),g=E('g',{'data-placed':kind,tabindex:0,role:'button','aria-label':'Placed '+v+' at '+kind+'. Press Delete to remove'},svg);neonBox(g,z.x,z.y,z.w,z.h,v,'result',sm()?20:24);
  g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(kind);}});
  N.ui.svgDrag(svg,g,{box:z,zones:()=>[tray()],onDrop:()=>false,onRemove:()=>remove(kind),removeTo:{x:W()/2,y:tray().y+26}});fastBridge(g);
}
function renderChallenge(){if(!stageRef)return;const p=C.presets[task().key],svg=svgRoot('Find the common difference d and zero term c and drag them into dn plus c.',true),width=W(),small=sm();reset(stageRef);
 // A valid five-term table is visible without publishing the answers in a side card.
 txt(svg,width/2,44,'FIND d AND c',small?24:29,'support');txt(svg,width/2,85,'Position → Term',small?18:20,'support');
 const posX=small?94:158,gap=small?59:104,y1=154,y2=247;
 txt(svg,small?14:28,y1+5,'n',small?17:20,'support','start');txt(svg,small?14:28,y2+5,'T(n)',small?17:20,'support','start');
 for(let i=0;i<5;i++){const x=posX+i*gap;neonBox(svg,x-22,y1-24,44,47,String(i+1),'given',small?20:23);neonBox(svg,x-25,y2-23,50,46,String(term(p,i+1)),'result',small?20:23);}
 N.neonLine(svg,posX-33,y1+33,posX+4*gap+30,y1+33,{role:'support',width:1.6});N.neonLine(svg,posX-33,y2+33,posX+4*gap+30,y2+33,{role:'support',width:1.6});
 for(let i=0;i<4;i++)N.svg.hop(svg,posX+i*gap+12,posX+(i+1)*gap-12,y2-37,{role:'unknown',height:small?32:40,label:'?'});
 txt(svg,width/2,335,'Read every difference. Step back to n = 0.',small?16:20,'support');
 N.svg.pill(svg,width/2,398,'nth term = dn + c',{role:'focus',size:small?20:25});
 txt(svg,width/2,479,'Drag the two numbers into the rule',small?17:21,'support');
 const dz=zone('d'),cz=zone('c');
 txt(svg,dz.x+dz.w/2,520,'d coefficient',small?16:19,'support');txt(svg,cz.x+cz.w/2,520,'c adjustment',small?16:19,'support');
 if(placed.d)placedChip(svg,'d',placed.d);else{neonBox(svg,dz.x,dz.y,dz.w,dz.h,'?','unknown',25);const hit=E('rect',{x:dz.x,y:dz.y,width:dz.w,height:dz.h,rx:12,fill:'transparent','data-slot':'d',tabindex:0,role:'button','aria-label':'Drop coefficient d here; keyboard Enter to place'},svg);hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(kbChoice)place('d',kbChoice.value);else updateStatus('Select a coefficient card first.');}});hit.addEventListener('click',()=>{if(kbChoice)place('d',kbChoice.value);});}
 if(placed.c)placedChip(svg,'c',placed.c);else{neonBox(svg,cz.x,cz.y,cz.w,cz.h,'?','unknown',25);const hit=E('rect',{x:cz.x,y:cz.y,width:cz.w,height:cz.h,rx:12,fill:'transparent','data-slot':'c',tabindex:0,role:'button','aria-label':'Drop adjustment c here; keyboard Enter to place'},svg);hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(kbChoice)place('c',kbChoice.value);else updateStatus('Select an adjustment card first.');}});hit.addEventListener('click',()=>{if(kbChoice)place('c',kbChoice.value);});}
 // Keep source cards below the equation: three coefficient candidates and three offset candidates.
 const chipW=small?90:112,chipGap=small?13:17,x0=small?55:170,topY=650;
 txt(svg,small?18:28,632,'d cards',small?15:18,'support','start');
 task().d.forEach((v,i)=>{if(placed.d===v)return;source(svg,'d',v,x0+i*(chipW+chipGap),topY,chipW,42);});
 txt(svg,small?18:28,727,'c cards',small?15:18,'support','start');
 task().c.forEach((v,i)=>{if(placed.c===v)return;source(svg,'c',v,x0+i*(chipW+chipGap),topY+76,chipW,42);});
 const rz=tray();N.neonBox(svg,rz.x,rz.y,rz.w,rz.h,{role:'error',text:'RED REMOVE TRAY',size:small?16:19,r:14});
 const cards=[card('RULE PIECES',Object.keys(placed).length+' / 2',true),note('HOW TO THINK','Find the repeating difference. Then step back from term one to find the zero term.'),note('KEYBOARD','Select a card with Enter, then Enter on the gap. Delete a placed card to remove.')];
 mountScene(stageRef,svg,cards,challengeTask===2?'think':'point-right','The difference gives d. The zero term gives c. Check the pattern, not just one term.');
}
const def={id,title:'Linear nth term derivation',config:C,
 alt:'A position-to-term table showing constant differences, a multiple-of-position row and zero term. These combine into T(n)=dn+c.',
 staticAlt:'Common difference d is the coefficient of n, zero term c is the constant. For 5, 8, 11, 14, 17 the rule is 3n+2.',
 steps:steps.map((s,i)=>({name:s.name,narration:s.narration,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){learning(i,stage);},
 exploreIntro:'Explore positive, negative and decreasing linear sequences; derive the common difference, zero term and full nth term.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();explorePreset='Y7-037-linear-nth-term';window.NovaLessonComponent?.applyExploreModels();showZero=true;
   window.NovaLessonComponent?.applyExploreModels();const title=H('p',{class:'f905-instruction',text:'Compare three linear rules. Switch the zero-term marker to see where c comes from.'});
   window.NovaLessonComponent?.applyExploreModels();const choices=H('div',{class:'f905-choices'});window.NovaLessonComponent?.applyExploreModels();for(const [key,p] of Object.entries(C.presets))choices.appendChild(btn(p.label,()=>{explorePreset=key;emit('preset',key);exploreDraw(stage);},'nova-btn ghost'));
   window.NovaLessonComponent?.applyExploreModels();const marker=btn('Hide zero-term marker',()=>{showZero=!showZero;marker.textContent=showZero?'Hide zero-term marker':'Show zero-term marker';exploreDraw(stage);},'nova-btn primary');
   window.NovaLessonComponent?.applyExploreModels();panel.append(title,choices,H('div',{class:'f905-control'},[marker]));window.NovaLessonComponent?.applyExploreModels();exploreDraw(stage);
 },
 challenge(panel,api,stage){challengeTask=0;placed={};kbChoice=null;stageRef=stage;challengePanel=panel;challengeApi=api;
   const title=H('h3',{class:'f905-taskhead'}),guide=H('p',{class:'f905-instruction'}),row=H('div',{class:'f905-control'}),status=H('p',{class:'f905-status',role:'status'});
   function load(){const t=task();title.textContent=t.title;guide.textContent=t.guide;row.innerHTML='';status.textContent='Drag the two pieces or use Enter on a card and its target.';api.fb.textContent='';api.fb.className='nova-fb';
     row.append(btn('Check nth term',()=>{const p=C.presets[t.key];
       if(placed.d!==needed('d',t)||placed.c!==needed('c',t)){api.check(false,'Place the correct difference and zero-term cards before checking.',{task:challengeTask});return;}
       const expected=term(p,6);if(expected!==t.next){api.check(false,'Internal maths configuration error. Do not continue.',{task:challengeTask});return;}
       emit('rule',formula(p));api.check(true,'Correct. '+formula(p)+' gives term six = '+fmt(expected)+'.',{task:challengeTask,score:challengeTask+1});
       if(challengeTask===2){title.textContent='All three derivations complete';guide.textContent='You derived rising, adjusted and decreasing linear nth terms.';row.replaceChildren(H('p',{class:'f905-maths f905-maths--gold',text:'3 / 3 · Rules derived'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
       row.append(btn('Continue to challenge '+(challengeTask+2),()=>{challengeTask++;placed={};kbChoice=null;load();},'nova-btn primary'));
     },'nova-btn primary'),btn('Reset cards',()=>{placed={};kbChoice=null;renderChallenge();},'nova-btn ghost'),btn('Hint',()=>{api.hint('d is term 2 minus term 1. c is term 1 minus d.');},'nova-btn ghost'));
     emit('challengeTask',{index:challengeTask});renderChallenge();
   }
   panel.append(title,guide,row,status);load();
 },
 onRestore(){explorePreset='Y7-037-linear-nth-term';challengeTask=0;placed={};kbChoice=null;stageRef=null;challengePanel=null;challengeApi=null;}
};
N.registry.add({id,title:'Linear nth term derivation',topics:['sequences','linear nth term','arithmetic sequences','algebraic rules'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F0-15']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"steps":()=>steps,"TASKS":()=>TASKS},draws:{"reset":["stage"],"mountScene":["stage","svg","cards","pose","speech"],"exploreDraw":["stage"]},exploreFields:{}});
N.bankMount({id,num:'05',title:'Linear nth term derivation · Premium Edition',def,linked:['F9-01','F9-02','F9-03','F9-04'],years:'Year 7 nth term; Year 8 arithmetic sequences; GCSE bridge',spec:{
 purpose:'Derive a linear nth term T(n)=dn+c by recognising the common difference d and zero term c.',
 params:'Integer d (positive/negative), integer c (positive/negative); terms at positions 1–5; zero term via stepping back.',
 presets:'Y7-037 3n+2; Y8-019 5n−3; Y8-019 decreasing variant 22−4n.',
 steps:'Notice terms → first differences → multiples dn → constant gap → zero term → verified nth term.',
 interactions:'Watch, Guided, Explore preset controls, Challenge drag d/c with snap/remove/regrab/keyboard plus misconception feedback.',
 traps:'Using term 1 as c, sign reversal, confusing difference with term value, adding instead of subtracting, negative c and decreasing sequences.',
 gcse:'Foundation for Grade 5+ linear rules, signed common differences, algebraic nth terms and modelling.'
 }});
window.F905_ENGINE=N.engines[id];
const c=document.getElementById(id),s=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);[...c.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>s.appendChild(x));c.appendChild(s);const heading=c.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const setAlt=()=>c.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});setAlt();new MutationObserver(setAlt).observe(c,{childList:true,subtree:true});
})();
