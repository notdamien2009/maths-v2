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

/* NOVA F9-12 · Sequence Continuer · Neon drawings + Chalk writing, established F3 runtime. */
const F912_CONFIG={id:'F9-12',family:'F9',startMode:'watch',presets:{
 'Y7-036-sequence-structure':{label:'Y7-036 · Add three',operation:'add',first:4,step:3,terms:5},
 'Y7-036-decreasing':{label:'Y7-036 · Subtract four',operation:'add',first:24,step:-4,terms:5},
 'Y7-036-doubling':{label:'Y7-036 · Double each term',operation:'multiply',first:2,factor:2,terms:5}},
 events:{value:['preset','term','reveal','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F912_CONFIG),id=C.id;
const sm=()=>innerWidth<=760,W=()=>sm()?430:760;
const STEPS=[
 {name:'look-for-a-pattern',preset:'Y7-036-sequence-structure',visible:3,hop:0,kind:'notice',pose:'question',text:'Four, seven, ten. What would you expect to come next?',prompt:'Find what changes between each pair of numbers.'},
 {name:'check-the-same-hop',preset:'Y7-036-sequence-structure',visible:3,hop:2,kind:'compare',pose:'point-right',text:'Four plus three is seven. Seven plus three is ten. Same hop, twice.',prompt:'Explain why the rule adds three each time.'},
 {name:'fill-the-next-slot',preset:'Y7-036-sequence-structure',visible:4,hop:3,kind:'first-fill',pose:'count',text:'Ten plus three gives thirteen. The first empty slot is filled.',prompt:'Predict the next term before it appears.'},
 {name:'continue-again',preset:'Y7-036-sequence-structure',visible:5,hop:4,kind:'complete',pose:'idea',text:'Now thirteen plus three makes sixteen. We continued the same sequence twice.',prompt:'How could you check both new terms?'},
 {name:'continue-a-decrease',preset:'Y7-036-decreasing',visible:5,hop:4,kind:'decreasing',pose:'point-down',text:'A sequence can shrink. Subtract four again to continue this pattern.',prompt:'Why is twelve followed by eight?'},
 {name:'continue-a-double',preset:'Y7-036-doubling',visible:5,hop:4,kind:'doubling',pose:'celebrate',text:'Doubling is different from adding. Two, four, eight, sixteen, thirty-two.',prompt:'Explain why a fixed addition cannot generate every term.'}
];
const TASKS=[
 {preset:'Y7-036-sequence-structure',title:'01 · Finish the growing sequence',guide:'4, 7, 10, __, __. Use the same add-three rule for both spaces.',options:[13,16,14,17,10],expected:[13,16],trap:{14:'Fourteen is four more than ten. This rule adds three, not four.',17:'Seventeen is four more than thirteen. Check the hop size.',10:'Ten is already the third term. Continue forward, not backwards.'}},
 {preset:'Y7-036-decreasing',title:'02 · Keep subtracting four',guide:'24, 20, 16, __, __. Both missing terms must keep the same subtraction.',options:[12,8,10,4,20],expected:[12,8],trap:{10:'Sixteen subtract four gives twelve, not ten.',4:'Four is too many steps ahead. Continue one hop at a time.',20:'Twenty already appears as term two. Continue downwards.'}},
 {preset:'Y7-036-doubling',title:'03 · Double to continue',guide:'2, 4, 8, __, __. Check what happens to the multiplication rule each time.',options:[16,32,12,24,18],expected:[16,32],trap:{12:'Eight plus four gives twelve, but the sequence doubles instead.',24:'Twenty-four is eight more than sixteen. Doubling gives thirty-two.',18:'Eighteen is not twice eight. Try multiplication by two.'}}
];
let chosen='Y7-036-sequence-structure',termReveal=3,stageRef=null,apiRef=null,statusRef=null,task=0,placed={3:null,4:null},selected=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered NOVA F9-12 event '+key);N.events.emit('value',{engine:id,key,value});}
function value(p,n){return p.operation==='add'?p.first+(n-1)*p.step:p.first*Math.pow(p.factor,n-1);}
function values(p){return Array.from({length:5},(_,i)=>value(p,i+1));}
function rule(p){return p.operation==='multiply'?'×'+p.factor:p.step<0?'−'+Math.abs(p.step):'+'+p.step;}
function txt(p,x,y,t,size=22,role='given'){return N.chalkText(p,x,y,String(t),{size,role});}
function box(p,x,y,w,h,label,role='given',size=23){return N.neonBox(p,x,y,w,h,{role,text:label,size,r:15});}
function btn(t,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:t,onclick:fn});}
function root(alt){const v=N.svg.root(W(),sm()?730:660,alt);v.setAttribute('class','nv-svg f912-svg');v.setAttribute('role','img');return v;}
function clear(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("clear",arguments);}
stage.replaceChildren();N.cap(stage,'Sequence workshop','Sequence continuer');}
function card(title,val,focus=false){return H('div',{class:'f912-card'+(focus?' f912-card--gold':'')},[H('div',{class:'f912-eyebrow',text:title}),H('div',{class:'f912-maths'+(focus?' f912-maths--gold':''),text:String(val)})]);}
function note(head,content){return H('div',{class:'f912-card f912-card--full'},[H('div',{class:'f912-eyebrow',text:head}),H('div',{class:'f912-body',text:content})]);}
function mount(stage,svg,cards,pose,speech){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,speech]=window.NovaLessonComponent.args("mount",arguments);}
stage.appendChild(H('div',{class:'f912-stage'},[svg,H('aside',{class:'f912-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function center(i){return (sm()?48:86)+i*((W()-(sm()?96:172))/4);}
function row(svg,p,{visible=3,hop=0,challenge=false,title='CONTINUE THE SEQUENCE',showRule=false}={}){
 const y=sm()?244:249,w=sm()?69:112,h=sm()?92:96,arr=values(p);
 txt(svg,W()/2,56,title,sm()?25:30,'support');
 txt(svg,W()/2,100,challenge?'Find both missing terms, one hop at a time':showRule?'Every hop follows the SAME rule':'Notice what changes from term to term',sm()?17:20,'support');
 for(let i=0;i<4;i++){
  const a=center(i)+9,b=center(i+1)-9;
  const arc=N.svg.hop(svg,a,b,y-h/2-9,{role:i<hop?'focus':'support',height:sm()?36:47});
  if(i<hop&&showRule)N.svg.pill(svg,(center(i)+center(i+1))/2,y-(sm()?100:110),rule(p),{role:'focus',size:sm()?14:18});
  if(i>=2&&i>=hop&&!challenge)arc.classList.add('f912-unrevealed-hop');
 }
 for(let i=0;i<5;i++){
  const known=challenge?i<3:i<visible;
  const g=E('g',{'class':'f912-term','data-term':i+1,'data-value':known?arr[i]: '?'},svg);
  box(g,center(i)-w/2,y-h/2,w,h,known?String(arr[i]):'?',known?i>2?'result':'given':'unknown',sm()?27:33);
  txt(svg,center(i),y+h/2+38,'Term '+(i+1),sm()?20:18,'support');
  if(i<3||known&&i>=3)N.neonRing(svg,center(i),y-h/2-13,{role:i>2?'result':'support',r:sm()?6:8,pulse:i>2});
 }
 return {y,w,h,arr};
}
function stepDraw(i,stage){const d=STEPS[i],p=C.presets[d.preset],w=W();clear(stage);
 const svg=root('A five-term sequence linked with repeated jump arrows. Empty slots become correct next terms.');
 row(svg,p,{visible:d.visible,hop:d.hop,showRule:i>0,title:i<4?'GROWING BY THREE':i===4?'DECREASING PATTERN':'MULTIPLYING PATTERN'});
 if(i===0){txt(svg,w/2,423,'What could the missing terms be?',sm()?21:27,'support');box(svg,w*.18,459,w*.64,67,'4   →   7   →   10','support',sm()?23:28);}
 if(i===1){txt(svg,w/2,420,'TEST THE CHANGE TWICE',sm()?21:26,'support');box(svg,w*.07,456,w*.40,76,'7 − 4 = 3','focus',sm()?21:26);box(svg,w*.53,456,w*.40,76,'10 − 7 = 3','focus',sm()?21:26);}
 if(i===2){txt(svg,w/2,421,'FILL THE FIRST SPACE',sm()?21:26,'support');box(svg,w*.16,460,w*.68,73,'10 + 3 = 13','result',sm()?25:30);}
 if(i===3){txt(svg,w/2,420,'CHECK BOTH NEW TERMS',sm()?20:26,'support');box(svg,w*.04,460,w*.44,74,'10 + 3 = 13','result',sm()?20:26);box(svg,w*.52,460,w*.44,74,'13 + 3 = 16','result',sm()?20:26);}
 if(i===4){txt(svg,w/2,420,'THE SAME STEP, BUT BACKWARDS',sm()?17:25,'support');box(svg,w*.07,460,w*.40,74,'16 − 4 = 12','result',sm()?19:25);box(svg,w*.53,460,w*.40,74,'12 − 4 = 8','result',sm()?20:25);}
 if(i===5){txt(svg,w/2,420,'MULTIPLY, DO NOT ADD A FIXED GAP',sm()?17:23,'support');box(svg,w*.06,460,w*.41,74,'8 × 2 = 16','result',sm()?21:25);box(svg,w*.53,460,w*.41,74,'16 × 2 = 32','result',sm()?20:25);}
 N.svg.pill(svg,w/2,sm()?625:590,i===0?'Two empty slots waiting':i===1?'Rule found: +3':i===2?'First slot complete':i===3?'Both slots correct':i===4?'Rule found: −4':'Rule found: ×2',{role:i===0?'unknown':i===1?'focus':'result',size:sm()?17:21});
 let cards=[card('SEQUENCE',values(p).slice(0,d.visible).join('   ·   ')),card('REPEATED RULE',i===0?'Discover it':rule(p),i>0),note('LOOK CLOSELY',i===0?'Do not guess from one jump. Compare the first three terms.':i===1?'The same addition must work between all consecutive terms.':i===2?'You filled term four using the rule. Keep it for term five.':i===3?'Both new terms can be checked by the same operation.':i===4?'Every next term is four less than the previous one.':'Multiplying by two gives each next term; adding a constant does not.'),note('YOUR TURN',d.prompt)];
 mount(stage,svg,cards,d.pose,d.text);
 if(!N.reducedMotion()){
  [...svg.querySelectorAll('.f912-term')].slice(0,d.visible).forEach((g,j)=>{g.style.opacity='0';N.motion.tween(250+j*100,t=>{if(g.isConnected)g.style.opacity=String(t);},N.motion.ease.out);});
 }
}
function exploreDraw(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("exploreDraw",arguments);}
const p=C.presets[chosen];clear(stage);const svg=root('Explore an additive, subtractive or multiplicative sequence with five terms and two missing continuation positions.');
 row(svg,p,{visible:termReveal,hop:Math.max(0,termReveal-1),showRule:true,title:'SEQUENCE EXPLORER'});
 txt(svg,W()/2,427,'CONTINUE WITH THE SAME RULE',sm()?20:26,'support');
 box(svg,W()*.17,463,W()*.66,70,'Term '+(termReveal+1)+' = '+(termReveal===5?'?':value(p,termReveal+1)),termReveal===5?'unknown':'result',sm()?20:25);
 N.svg.pill(svg,W()/2,sm()?625:590,''+rule(p)+'  ·  every term',{role:'focus',size:sm()?19:24});
 mount(stage,svg,[card('PATTERN',p.label),card('RULE',rule(p),true),card('FIVE-TERM SERIES',values(p).join(' · ')),note('CHECK','Find the difference, or check whether each term multiplies by the same number.')],'point-right','Keep the operation the same as the pattern grows.');
}
function status(text){if(statusRef)statusRef.textContent=text;}
function target(n){return {id:String(n),kind:'drop',x:center(n)-(sm()?36:61),y:(sm()?244:249)-(sm()?48:50),w:sm()?72:122,h:sm()?96:100};}
function removeZone(){return {id:'remove',kind:'remove',x:sm()?30:155,y:sm()?625:563,w:sm()?370:448,h:62};}
function guardFast(g){/* Supplement for very fast mouse movement escaping an SVG element's capture boundary. */
 g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pointer=e.pointerId;let done=false;
 function clean(){if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);}
 function move(e2){if(done)return;if(N.ui._drag!==drag){clean();return;}if(e2.pointerId!==pointer||g.contains(e2.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pointer,clientX:e2.clientX,clientY:e2.clientY,buttons:e2.buttons}));}
 function up(e2){if(e2.pointerId!==pointer)return;if(N.ui._drag===drag&&drag.up)drag.up(e2);clean();}
 function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });
}
function fail(v,slot){const t=TASKS[task],p=C.presets[t.preset],right=t.expected[slot-3],earlier=slot===4?placed[3]:value(p,3),d=p.operation==='multiply'?'multiply by two':p.step<0?'subtract four':'add three';
 if(t.trap[v])return t.trap[v];
 if(v===t.expected[1-(slot-3)])return 'That value belongs in the OTHER empty slot. Continue in order, one term at a time.';
 if(slot===4&&placed[3]===null)return 'Fill term four first, then continue from it to term five.';
 if(v===earlier)return 'This repeats the previous term. You need to '+d+' to continue.';
 return 'Check term '+(slot+1)+'. You should '+d+' from the previous term to get '+right+'.';
}
function place(v,slot){if(placed[slot]!==null)return false;if(slot===4&&placed[3]===null){let msg='Complete the first empty slot before the second one.';status(msg);apiRef.check(false,msg,{task,slot,value:v});return false;}
 if(v!==TASKS[task].expected[slot-3]){const msg=fail(v,slot);status(msg);apiRef.check(false,msg,{task,slot,value:v});return false;}
 placed[slot]=v;selected=null;ev('placed',{slot,value:v});status('Term '+(slot+1)+' placed. '+(slot===3?'Now complete the second space.':'Both terms are ready to check.'));drawChallenge();return true;
}
function unplace(slot){N.ui.cancelDrag();if(placed[slot]===null)return;placed[slot]=null;if(slot===3&&placed[4]!==null){placed[4]=null;ev('placed',{slot:4,value:null});}selected=null;ev('placed',{slot,value:null});status('Card removed. Place the terms in sequence order.');drawChallenge();}
function source(svg,v,x,y){const bw=sm()?70:104,bh=66,g=E('g',{tabindex:0,role:'button','data-source':'term-'+v,'aria-label':'Select term '+v},svg);
 box(g,x,y,bw,bh,String(v),'focus',sm()?23:30);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=v;status('Term '+v+' selected. Press Enter on the first available empty slot.');}});
 g.addEventListener('click',()=>{selected=v;status('Term '+v+' selected. Press Enter on an empty slot.');});
 N.ui.svgDrag(svg,g,{box:{x,y,w:bw,h:bh},zones:()=>[target(3),target(4),removeZone()],onDrop:slot=>slot==='3'||slot==='4'?place(v,Number(slot)):false,onRemove:()=>status('Card returned to the choice tray.'),removeTo:{x:W()/2,y:removeZone().y+30}});guardFast(g);
}
function challengeSlot(svg,n){let z=target(n);if(placed[n]===null){box(svg,z.x,z.y,z.w,z.h,'?','unknown',sm()?31:37);
 E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':String(n),tabindex:0,role:'button','aria-label':'Place selected term in empty slot '+(n+1)},svg)
 .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(selected===null)status('Select a number card first.');else place(selected,n);}});
 }else{let g=E('g',{tabindex:0,role:'button','data-placed':String(n),'aria-label':'Placed term '+placed[n]+' in slot '+(n+1)+'. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,String(placed[n]),'result',sm()?29:35);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();unplace(n);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[removeZone()],onDrop:()=>false,onRemove:()=>unplace(n),removeTo:{x:W()/2,y:removeZone().y+30}});guardFast(g);
 }
}
function drawChallenge(){if(!stageRef)return;const t=TASKS[task],p=C.presets[t.preset],svg=root('Complete the two empty positions by dragging the next-term cards into the gaps.'),w=W();clear(stageRef);
 txt(svg,w/2,57,'FINISH THE NUMBER PATTERN',sm()?22:30,'support');
 txt(svg,w/2,100,'Fill term four, then term five',sm()?18:23,'support');
 const y=sm()?244:249,ww=sm()?69:112,hh=sm()?92:96;
 for(let i=0;i<4;i++){
  const arc=N.svg.hop(svg,center(i)+9,center(i+1)-9,y-hh/2-9,{role:'support',height:sm()?36:47});
  if(i<2)N.svg.pill(svg,(center(i)+center(i+1))/2,y-(sm()?100:110),'?',{role:'unknown',size:sm()?15:18});
 }
 for(let i=0;i<3;i++){
  let g=E('g',{'class':'f912-term','data-term':i+1},svg);
  box(g,center(i)-ww/2,y-hh/2,ww,hh,String(value(p,i+1)),'given',sm()?27:33);
  txt(svg,center(i),y+hh/2+38,'Term '+(i+1),sm()?20:18,'support');
 }
 for(let n=3;n<=4;n++){challengeSlot(svg,n);txt(svg,center(n),y+hh/2+38,'Term '+(n+1),sm()?20:18,'support');}
 txt(svg,w/2,412,'CHOOSE THE NEXT TERMS',sm()?20:27,'support');
 const bw=sm()?70:104,bh=66,dx=sm()?13:55,gap=sm()?16:36;
 for(let i=0;i<t.options.length;i++){
  const v=t.options[i];if(Object.values(placed).includes(v))continue;
  source(svg,v,dx+i*(bw+gap),450);
 }
 const rz=removeZone();box(svg,rz.x,rz.y,rz.w,rz.h,'RED TRAY · REMOVE','error',sm()?18:23);
 N.svg.pill(svg,w/2,sm()?708:643,placed[3]!==null&&placed[4]!==null?'Two terms ready to check':'Choose each term in order',{role:placed[3]!==null&&placed[4]!==null?'result':'unknown',size:sm()?15:19});
 mount(stageRef,svg,[card('TERMS GIVEN',values(p).slice(0,3).join('   ·   ')),card('TERMS ADDED',(placed[3]===null?0:1)+(placed[4]===null?0:1)+' of 2',placed[3]!==null&&placed[4]!==null),note('WHAT TO DO','Use the first three terms to find the rule. Fill the next two terms in sequence order.'),note('KEYBOARD','Enter on a number card, Enter on the slot. Delete on a placed card to remove.')],placed[3]!==null&&placed[4]!==null?'celebrate':'think',placed[3]!==null&&placed[4]!==null?'Both new terms follow the pattern. Check them!':'Use the same step from one term to the next.');
 stageRef.appendChild(H('div',{class:'f912-evidence'},[H('span',{text:'Find the rule'}),H('span',{text:'Continue twice'}),H('span',{class:'f912-focus',text:'Check both terms'})]));
}
const def={id,title:'Sequence continuer',config:C,
 alt:'A five-term sequence with neon number slots and hop arcs. Work out the operation between known terms and fill two missing terms.',
 staticAlt:'Examples: 4,7,10,13,16; 24,20,16,12,8; 2,4,8,16,32. Continue each sequence with the same term-to-term rule.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){stepDraw(i,stage);},
 exploreIntro:'Compare sequences that grow by addition, shrink by subtraction or double by multiplication.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();chosen='Y7-036-sequence-structure';window.NovaLessonComponent?.applyExploreModels();termReveal=3;
  window.NovaLessonComponent?.applyExploreModels();const h=H('p',{class:'f912-instruction',text:'Choose a sequence. Reveal terms gradually, then use the rule to predict the next one.'});
  window.NovaLessonComponent?.applyExploreModels();const buttons=H('div',{class:'f912-choices'}),range=H('input',{type:'range',min:3,max:5,value:3,'aria-label':'How many terms are revealed'}),output=H('output',{text:'3 terms'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,p])=>buttons.appendChild(btn(p.label,()=>{chosen=key;ev('preset',key);exploreDraw(stage);},'nova-btn ghost')));
  window.NovaLessonComponent?.applyExploreModels();range.addEventListener('input',()=>{termReveal=+range.value;output.textContent=termReveal+' terms';ev('reveal',termReveal);exploreDraw(stage);});
  window.NovaLessonComponent?.applyExploreModels();panel.append(h,buttons,H('div',{class:'f912-controls'},[H('label',{},['Reveal terms ',range]),output,btn('Show next term',()=>{termReveal=termReveal===5?3:termReveal+1;range.value=String(termReveal);output.textContent=termReveal+' terms';exploreDraw(stage);},'nova-btn primary')]));
  window.NovaLessonComponent?.applyExploreModels();exploreDraw(stage);
 },
 challenge(panel,api,stage){task=0;placed={3:null,4:null};selected=null;stageRef=stage;apiRef=api;
  const header=H('h3',{class:'f912-taskhead'}),guide=H('p',{class:'f912-instruction'}),controls=H('div',{class:'f912-controls'}),statusEl=H('p',{class:'f912-status',role:'status'});statusRef=statusEl;
  function load(){const t=TASKS[task];header.textContent=t.title;guide.textContent=t.guide;controls.replaceChildren();api.fb.textContent='';api.fb.className='nova-fb';status('Fill term four, then term five.');
    controls.append(btn('Check both terms',()=>{if(placed[3]!==t.expected[0]||placed[4]!==t.expected[1]){api.check(false,'Place both missing terms in the correct order before checking.',{task});return;}
      api.check(true,'Exactly. Both new terms follow the same rule.',{task,score:task+1});
      if(task===2){header.textContent='All three sequences continued';guide.textContent='You continued growing, decreasing and doubling patterns correctly.';controls.replaceChildren(H('p',{class:'f912-maths f912-maths--gold',text:'3 / 3 · Sequences continued'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
      controls.append(btn('Continue to challenge '+(task+2),()=>{task++;placed={3:null,4:null};selected=null;load();},'nova-btn primary'));
    },'nova-btn primary'),btn('Reset cards',()=>{placed={3:null,4:null};selected=null;status('Cards cleared. Start with term four.');drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint(task===0?'Compare four and seven, then seven and ten. Apply the same difference again.':task===1?'The sequence gets four smaller each time.':'The numbers double each time. Multiply by two again.'),'nova-btn ghost'));
    ev('challengeTask',{index:task});drawChallenge();
  }
  panel.append(header,guide,controls,statusEl);load();
 },
 onRestore(){chosen='Y7-036-sequence-structure';termReveal=3;stageRef=null;apiRef=null;statusRef=null;task=0;placed={3:null,4:null};selected=null;}
};
N.registry.add({id,title:'Sequence continuer',topics:['sequences','missing terms','arithmetic rules','multiplicative patterns'],deps:['F0-02','F0-04','F0-07','F0-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"clear":["stage"],"mount":["stage","svg","cards","pose","speech"],"exploreDraw":["stage"]},exploreFields:{}});
N.bankMount({id,num:'12',title:'Sequence continuer · Premium Edition',def,linked:['F9-01','F9-02','F9-03','F9-11'],years:'Year 7 sequence rules and structure, Year 8 extension',spec:{
 purpose:'Continue number sequences accurately by applying the same term-to-term rule to successive missing slots.',
 params:'Five terms, two missing terms, positive and negative constant differences, simple geometric doubling.',
 presets:'Y7-036 Sequence rules and structure with growing, decreasing and doubling sub-presets.',
 steps:'Notice terms → verify repeated hop → fill next slot → fill another → subtracting sequence → doubling sequence.',
 interactions:'Four modes; Explore preset/reveal controls; Challenge drag number cards into two empty slots with keyboard access and red removal tray.',
 traps:'Adding an incorrect gap, applying the second term too early, repeating a term, confusing addition with multiplication.',
 gcse:'Preparation for linear term-to-term generalisation, nth-term rules and geometric sequences.'
}});
window.F912_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const gc=component.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
