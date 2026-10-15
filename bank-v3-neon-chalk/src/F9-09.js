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

/* NOVA F9-09 Quadratic Sequence · 2nd differences and a n² + b n + c. */
const F909_CONFIG={id:'F9-09',family:'F9',startMode:'watch',presets:{
 'Y8-021-quadratic-spotting':{label:'Y8 · Spot second differences',a:2,b:3,c:1,context:'First differences change. Second differences stay at four.'},
 'Y9-008-quadratic-structure':{label:'Y9 · Quadratic structure',a:1,b:-2,c:4,context:'The linear remainder can be negative.'},
 'KS3-perfect-squares':{label:'KS3 · Square pattern',a:1,b:2,c:1,context:'The square numbers 4, 9, 16, 25, 36 also form a quadratic sequence.'}
 },events:{value:['preset','position','coefficient','difference','remainder','challengeTask','placed'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F909_CONFIG),id=C.id;
const small=()=>innerWidth<=760, W=()=>small()?430:760;
const val=(p,n)=>p.a*n*n+p.b*n+p.c;
const signed=(n)=>n<0?'−'+Math.abs(n):'+'+n;
const eq=(p)=>`${p.a===1?'':p.a}n² ${p.b<0?'−':'+'} ${Math.abs(p.b)===1?'':Math.abs(p.b)}n ${p.c<0?'−':'+'} ${Math.abs(p.c)}`;
const ps=Object.keys(C.presets);const lead=C.presets[ps[0]];
const STEPS=[
 {name:'read-the-terms',preset:ps[0],phase:0,pose:'explain',text:'Six, fifteen, twenty-eight, forty-five, sixty-six. Notice how the gaps grow.',prompt:'Compare each pair of terms. Do the gaps stay the same?'},
 {name:'find-first-differences',preset:ps[0],phase:1,pose:'count',text:'The jumps are nine, thirteen, seventeen and twenty-one. The first differences are changing.',prompt:'What is happening to the jumps?'},
 {name:'constant-second-differences',preset:ps[0],phase:2,pose:'point-down',text:'The jumps increase by four each time. That constant second difference signals a quadratic pattern.',prompt:'Find the constant second difference.'},
 {name:'find-the-squared-part',preset:ps[0],phase:3,pose:'idea',text:'The second difference is twice the n-squared coefficient. Half of four is two.',prompt:'Why is the n-squared coefficient two, not four?'},
 {name:'subtract-the-squared-part',preset:ps[0],phase:4,pose:'think',text:'Take two n squared away from each term. The remainder is four, seven, ten, thirteen, sixteen.',prompt:'What simple linear rule remains?'},
 {name:'build-the-general-rule',preset:ps[0],phase:5,pose:'celebrate',text:'The remainder is three n plus one. Add back two n squared: that is the complete rule.',prompt:'Check the rule by finding the fifth term.'}
];
const TASKS=[
 {preset:ps[2],heading:'01 · Find the square pattern rule',guide:'4, 9, 16, 25, 36. Find a from the second differences, then find b and c.',options:{a:[1,2,3],b:[1,2,4],c:[0,1,2]}},
 {preset:ps[0],heading:'02 · Identify the quadratic coefficients',guide:'6, 15, 28, 45, 66. Use the second differences, then subtract a n².',options:{a:[2,4,1],b:[3,4,2],c:[0,2,1]}},
 {preset:ps[1],heading:'03 · Include the negative linear term',guide:'3, 4, 7, 12, 19. The remainder after removing n² is decreasing.',options:{a:[1,2,3],b:[-1,-2,2],c:[2,3,4]}}
];
let presetKey=ps[0],termCount=5,stepIndex=0,challengeIndex=0,placed={a:null,b:null,c:null},choice=null,stageRef=null,apiRef=null,statusRef=null;
function ev(k,v){if(!C.events.value.includes(k))throw Error('Unregistered F9-09 event '+k);N.events.emit('value',{engine:id,key:k,value:v});}
function txt(p,x,y,s,size=20,role='given',anchor='middle'){return N.chalkText(p,x,y,String(s),{size,role,anchor});}
function box(p,x,y,w,h,s,role='given',size=18){return N.neonBox(p,x,y,w,h,{role,text:s,size,r:12});}
function btn(s,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:s,onclick:fn});}
function root(alt,challenge=false){const svg=N.svg.root(W(),small()?(challenge?1115:940):(challenge?970:775),alt);svg.setAttribute('class','nv-svg f909-svg');svg.setAttribute('role','img');return svg;}
function clear(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("clear",arguments);}
stage.replaceChildren();N.cap(stage,'Sequence workshop','Quadratic sequence');}
function card(h,v,gold=false){return H('div',{class:'f909-card'+(gold?' f909-card--gold':'')},[H('div',{class:'f909-eyebrow',text:h}),H('div',{class:'f909-maths'+(gold?' f909-maths--gold':''),text:String(v)})]);}
function note(h,v){return H('div',{class:'f909-card f909-card--full'},[H('div',{class:'f909-eyebrow',text:h}),H('div',{class:'f909-body',text:String(v)})]);}
function mount(stage,svg,cards,pose,speech){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,speech]=window.NovaLessonComponent.args("mount",arguments);}
stage.appendChild(H('div',{class:'f909-stage'},[svg,H('aside',{class:'f909-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function numbers(p,count=5){return Array.from({length:count},(_,i)=>val(p,i+1));}
function differences(xs){return xs.slice(1).map((v,i)=>v-xs[i]);}
function chalkCell(svg,x,y,w,h,text,role='given',size=18){box(svg,x,y,w,h,text,role,size);}
function table(svg,p,phase,n=5,{challenge=false}={}){
 const sm=small(),w=W(),cw=sm?58:80,labelW=sm?100:134,x0=(w-labelW-5*cw)/2,top=sm?117:99,rowH=sm?62:56,gap=sm?8:8;
 const values=numbers(p),d1=differences(values),d2=differences(d1);
 const remainder=values.map((v,i)=>v-p.a*(i+1)*(i+1));
 const rows=[{label:'Position n',v:[1,2,3,4,5],seen:true,role:'given'},
 {label:'Term',v:values,seen:true,role:'given'},
 {label:'First Δ',v:d1,seen:phase>=1,role:'focus'},
 {label:'Second Δ',v:d2,seen:phase>=2,role:'result'},
 {label:'a n²',v:values.map((v,i)=>p.a*(i+1)*(i+1)),seen:phase>=3,role:'focus'},
 {label:'Remainder',v:remainder,seen:phase>=4,role:'result'}];
 rows.forEach((r,ri)=>{
  const y=top+ri*(rowH+gap),fs=sm?15:18,show=r.seen;
  chalkCell(svg,x0,y,labelW-5,rowH,r.label,'support',ri>=2&&sm?13:fs);
  r.v.forEach((v,ci)=>{const ix=x0+labelW+ci*cw;
   let text=show&&ci<n?String(v):'·'; if((ri===2&&ci>=4)||(ri===3&&ci>=3))text='';
   if(challenge && ri>=3 && !show)text='?';
   if(text)chalkCell(svg,ix,y,cw-6,rowH,text,show?r.role:'unknown',sm?18:21);
  });
 });
 return {x0,yEnd:top+rows.length*(rowH+gap)-gap,values,d1,d2,remainder};
}
function dot(svg,x,y,role='op',radius=4.5){return N.neonRing(svg,x,y,{role,r:radius,pulse:false});}
function squareDots(svg,x0,y0,n,role,spacing){for(let r=0;r<n;r++)for(let c=0;c<n;c++)dot(svg,x0+c*spacing,y0+r*spacing,role,4.3);}
function evidence(svg,p,phase,{position=2}={}){
 const sm=small(),w=W(),startY=sm?585:527;
 // The dot evidence is a concrete decomposition for n = 2. The square term uses a×(n×n) dots.
 if(phase<3){
  txt(svg,w/2,startY,'DOT PATTERN AT POSITION TWO',sm?20:23,'support');
  const dots=val(p,2),cols=5,spacing=22,rows=Math.ceil(dots/cols),x0=w/2-2*spacing,y0=startY+48;
  for(let i=0;i<dots;i++)dot(svg,x0+(i%cols)*spacing,y0+Math.floor(i/cols)*spacing,'op',4.2);
  txt(svg,w/2,startY+132,'Position 2 has '+dots+' dots',sm?18:22,'support');
  return;
 }
 txt(svg,w/2,startY,'A QUADRATIC HAS AN n² PART',sm?20:23,'support');
 const n=2, layers=p.a,delta=sm?72:82,startX=w/2-(layers*delta)/2+14;
 for(let layer=0;layer<Math.min(layers,3);layer++){
   const x=startX+layer*delta-14;
   squareDots(svg,x,startY+57,n,phase>=3?'focus':'op',22);
 }
 txt(svg,w/2,startY+132,`${p.a===1?'One':'Two'} 2 × 2 ${p.a===1?'square':'squares'} = ${p.a*4} dots`,sm?17:20,'support');
 if(phase>=4){
  txt(svg,w/2,startY+177,'Subtract a n² from the terms',sm?17:20,'support');
  const r1=val(p,1)-p.a,r2=val(p,2)-4*p.a;
  txt(svg,w/2,startY+219,`Remainder: ${r1}, ${r2}, ${val(p,3)-9*p.a}, ...`,sm?18:22,'result');
 }
 if(phase>=5){N.svg.pill(svg,w/2,startY+280,'T(n) = '+eq(p),{role:'focus',size:sm?18:23});}
}
function renderLearning(i,stage){stepIndex=i;const s=STEPS[i],p=C.presets[s.preset],w=W();clear(stage);
 const svg=root('Quadratic term table with first and second difference rows, square-dot evidence and a quadratic nth-term rule.');
 txt(svg,w/2,43,'LOOK FOR A CONSTANT SECOND DIFFERENCE',small()?19:25,'support');
 txt(svg,w/2,77,['Read each term','Compare the first jumps','Now compare the jumps','Half the second difference','Subtract the square part','Complete the nth-term rule'][i],small()?16:20,'support');
 const tb=table(svg,p,s.phase,5);
 evidence(svg,p,s.phase);
 const cards=[card('FIRST DIFFERENCES',i>=1?tb.d1.join(', '):'Not yet'),card('SECOND DIFFERENCE',i>=2?String(2*p.a):'Discover it',i>=2),note('WHY THIS WORKS',i<2?'An arithmetic sequence has constant first differences. This one does not.':i<4?'For T(n)=an²+bn+c, the second difference is always 2a.':i===4?'The remaining values form a linear sequence once an² is removed.':'Now T(n)=' + eq(p) + '. Check by substitution.')];
 if(i>=4)cards.splice(2,0,card('REMAINDER',tb.remainder.slice(0,4).join(', '),true));
 mount(stage,svg,cards,s.pose,s.text);
 if(!N.reducedMotion() && i>=1){
 const rows=[...svg.querySelectorAll('.nv-neon-box')].slice(6+Math.max(0,i-1)*5,11+Math.max(0,i-1)*5);
 rows.forEach((node,k)=>{node.style.opacity='.08';N.motion.tween(290+k*92,v=>{if(node.isConnected)node.style.opacity=String(.08+.92*v);},N.motion.ease.out);});
 }
}
function renderExplore(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("renderExplore",arguments);}
clear(stage);const p=C.presets[presetKey],w=W(),svg=root('Explore quadratic sequences and their first and second differences.');
 txt(svg,w/2,43,'CHANGE THE TERMS · KEEP THE STRUCTURE',small()?19:25,'support');
 txt(svg,w/2,77,p.context,small()?15:19,'support');
 const tb=table(svg,p,5,termCount);
 evidence(svg,p,5);
 mount(stage,svg,[card('CONSTANT SECOND Δ',2*p.a,true),card('COEFFICIENT a',p.a),note('SQUARE PART',p.a+' × n²'),note('LINEAR REMAINDER',p.b+'n '+signed(p.c)+'. The remainder changes by '+p.b+' each time.'),note('CHECK',`T(${termCount}) = ${val(p,termCount)}`)],'point-down','Take away the square part. The leftover terms follow a linear rule.');
 ev('position',termCount);ev('preset',presetKey);
}
function currentTask(){return TASKS[challengeIndex];}
function currentP(){return C.presets[currentTask().preset];}
function slotPos(k){const sm=small(),w=W(),slotW=sm?98:140,gap=sm?18:35,x0=w/2-(1.5*slotW+gap),y=sm?620:558,idx={a:0,b:1,c:2}[k];return {x:x0+idx*(slotW+gap),y,w:slotW,h:60,id:k,kind:'drop'};}
function removeZone(){const sm=small();return {x:sm?23:135,y:sm?1051:898,w:sm?384:490,h:58,id:'remove',kind:'remove'};}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pid=e.pointerId;let done=false;
 const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
 function move(ev){if(done)return;if(N.ui._drag!==drag){clean();return;}if(ev.pointerId!==pid||g.contains(ev.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pid,clientX:ev.clientX,clientY:ev.clientY,buttons:ev.buttons}));}
 function up(ev){if(ev.pointerId!==pid)return;if(N.ui._drag===drag&&drag.up)drag.up(ev);clean();}
 function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function setStatus(s){if(statusRef)statusRef.textContent=s;}
function errorFor(k,v){const p=currentP(),correct=p[k];if(k==='a')return v===2*p.a?'Second difference is 2a. Divide it by two to find a.':'The coefficient a is half the constant second difference, not a first difference.';
 if(k==='b')return v===-correct?'Check the direction of the linear remainder. The sign of b matters.':'After subtracting a n², find the difference between consecutive remainders. That is b.';
 return v===val(p,1)?'c is not the first term. Subtract a and b at position one.':'Use term one: T(1) = a + b + c. Subtract a and b to find c.';}
function choose(k,v){choice={k,v};setStatus('Chosen '+k+' = '+v+'. Select the corresponding gap with Enter, or drag the card.');}
function place(k,v){const p=currentP();if(p[k]!==v){if(apiRef)apiRef.check(false,errorFor(k,v),{task:challengeIndex,coefficient:k,chosen:v});setStatus(errorFor(k,v));return false;}
 placed[k]=v;ev('placed',{slot:k,value:v});ev('coefficient',{k,v});drawChallenge();return true;}
function remove(k){placed[k]=null;ev('placed',{slot:k,value:null});drawChallenge();setStatus('Removed '+k+'. Drag or choose another card.');}
function source(svg,k,v,x,y,w,h){const g=E('g',{tabindex:0,role:'button','data-source':k+'-'+v,'aria-label':'Choose '+k+' equals '+v},svg);box(g,x,y,w,h,String(v),'focus',small()?21:25);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(k,v);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[slotPos(k),removeZone()],onDrop:z=>z===k&&place(k,v),onRemove:()=>{setStatus('Use the red tray for cards already in the rule.');},removeTo:{x:W()/2,y:removeZone().y+20}});fastBridge(g);
}
function target(svg,k){const z=slotPos(k),v=placed[k];if(v!==null){const g=E('g',{tabindex:0,role:'button','data-placed':k,'aria-label':'Placed '+k+' equals '+v+'. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,String(v),'result',small()?24:29);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(k);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[removeZone()],onDrop:()=>false,onRemove:()=>remove(k),removeTo:{x:W()/2,y:removeZone().y+20}});fastBridge(g);return;}
 box(svg,z.x,z.y,z.w,z.h,'?', 'unknown',small()?24:29);
 const hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':k,tabindex:0,role:'button','aria-label':'Place selected '+k+' coefficient here'},svg);
 function insert(){if(choice&&choice.k===k){place(k,choice.v);}else setStatus('Choose a card for '+k+' first.');}
 hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();insert();}});hit.addEventListener('click',insert);
}
function drawChallenge(){if(!stageRef)return;const p=currentP(),t=currentTask(),w=W();clear(stageRef);const svg=root('Quadratic sequence coefficient puzzle with draggable a, b and c cards.',true);
 txt(svg,w/2,43,'BUILD T(n) = an² + bn + c',small()?23:28,'support');
 txt(svg,w/2,81,'First differences → second differences → coefficient a',small()?15:20,'support');
 table(svg,p,2,5,{challenge:true});
 const start=small()?590:531;
 txt(svg,w/2,start,'FIT ALL THREE COEFFICIENTS',small()?19:25,'support');
 ['a','b','c'].forEach(k=>target(svg,k));
 txt(svg,w/2,small()?715:650,'CHOOSE A VALUE FOR EACH SLOT',small()?19:23,'support');
 const sm=small(),srcX=sm?24:116,cardW=sm?112:150,gap=sm?21:39;
 const config=[['a',t.options.a,small()?744:681],['b',t.options.b,small()?846:761],['c',t.options.c,small()?948:841]];
 config.forEach(([k,opts,y])=>{
  txt(svg,sm?27:117,y-8,k+'  ·  '+(k==='a'?'SQUARED':k==='b'?'LINEAR':'CONSTANT'),sm?15:18,'support','start');
  opts.forEach((v,j)=>{if(placed[k]===v)return;source(svg,k,v,srcX+j*(cardW+gap),y,cardW,54);});
 });
 const bin=removeZone();box(svg,bin.x,bin.y,bin.w,bin.h,'RED REMOVE TRAY','error',sm?18:20);
 mount(stageRef,svg,[card('SECOND DIFFERENCE',2*p.a,true),note('YOUR METHOD','Find a by halving the second difference. Then subtract a n² and find the linear remainder.'),note('KEYBOARD','Enter on a candidate, then Enter on a gap. Press Delete on a placed number to remove it.'),note('FINAL CHECK','Your three coefficients must recreate all five sequence terms.')],challengeIndex===2?'think':'point-down','The second difference fixes the squared part. Find the linear part next.');
}
const def={id,title:'Quadratic sequence',config:C,
 alt:'Quadratic sequence table showing terms, first differences, second differences, n squared contribution and linear remainder.',
 staticAlt:'For T(n)=an²+bn+c, the constant second difference equals 2a. Subtract an² from terms, then find b and c from the remaining linear sequence.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){renderLearning(i,stage);},
 exploreIntro:'Switch quadratic patterns and reveal how constant second differences determine the squared coefficient.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();presetKey=ps[0];window.NovaLessonComponent?.applyExploreModels();termCount=5;window.NovaLessonComponent?.applyExploreModels();const pre=H('div',{class:'f909-choices'}),info=H('p',{class:'f909-instruction',text:'Choose a sequence, then vary the number of revealed terms to compare differences and the rule.'});
  window.NovaLessonComponent?.applyExploreModels();const rng=H('input',{type:'range',min:3,max:5,value:5,'aria-label':'Visible number of terms'}),out=H('output',{class:'f909-micro',text:'5 terms'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,p])=>pre.appendChild(btn(p.label,()=>{presetKey=k;renderExplore(stage);},'nova-btn ghost')));
  window.NovaLessonComponent?.applyExploreModels();rng.addEventListener('input',()=>{termCount=+rng.value;out.textContent=termCount+' terms';renderExplore(stage);});
  window.NovaLessonComponent?.applyExploreModels();panel.append(info,pre,H('div',{class:'f909-control'},[H('label',{},['Terms ',rng]),out,btn('Show five terms',()=>{termCount=5;rng.value='5';out.textContent='5 terms';renderExplore(stage);},'nova-btn primary')]));window.NovaLessonComponent?.applyExploreModels();renderExplore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placed={a:null,b:null,c:null};choice=null;stageRef=stage;apiRef=api;
  const heading=H('h3',{class:'f909-taskhead'}),guide=H('p',{class:'f909-instruction'}),controls=H('div',{class:'f909-control'}),status=H('p',{class:'f909-status',role:'status'});statusRef=status;
  function load(){const t=currentTask(),p=currentP();heading.textContent=t.heading;guide.textContent=t.guide;controls.replaceChildren();status.textContent='Build the expression by placing a, b and c.';api.fb.textContent='';api.fb.className='nova-fb';
   controls.append(btn('Check nth-term rule',()=>{
    if(['a','b','c'].some(k=>placed[k]!==p[k])){api.check(false,'Complete all three coefficient gaps. Check the second difference and the linear remainder.',{task:challengeIndex});return;}
    const verified=Array.from({length:5},(_,i)=>{const n=i+1;return placed.a*n*n+placed.b*n+placed.c===val(p,n);}).every(Boolean);
    if(!verified){api.check(false,'Check your rule against every position.',{task:challengeIndex});return;}
    api.check(true,'Correct. The full nth term is '+eq(p)+'. It matches all five terms.',{task:challengeIndex,score:challengeIndex+1});
    if(challengeIndex===2){heading.textContent='All three quadratic rules proven';guide.textContent='You found the constant second difference, isolated an² and completed each rule.';controls.replaceChildren(H('p',{class:'f909-maths f909-maths--gold',text:'3 / 3 · Quadratic rules proven'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
    controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed={a:null,b:null,c:null};choice=null;load();},'nova-btn primary'));
   },'nova-btn primary'),btn('Reset coefficients',()=>{placed={a:null,b:null,c:null};choice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('The second difference is twice a. Remove an² first; the remainder gives b and c.'),'nova-btn ghost'));
   ev('challengeTask',{index:challengeIndex});drawChallenge();
  }
  panel.append(heading,guide,controls,status);load();
 },
 onRestore(){presetKey=ps[0];termCount=5;challengeIndex=0;placed={a:null,b:null,c:null};choice=null;stageRef=null;apiRef=null;statusRef=null;}
};
N.registry.add({id,title:'Quadratic sequence',topics:['sequences','second differences','quadratic patterns','nth term'],deps:['F0-02','F0-04','F0-07','F0-08','F0-13']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"clear":["stage"],"mount":["stage","svg","cards","pose","speech"],"renderExplore":["stage"]},exploreFields:{}});
N.bankMount({id,num:'09',title:'Quadratic sequence · Premium Edition',def,linked:['F9-04','F9-05','F9-07','F9-08'],years:'Y8 quadratic spotting, Y9 quadratic structure and GCSE foundation bridge',spec:{
 purpose:'Identify constant second differences, derive a from 2a, subtract an² to find a linear remainder, then build T(n)=an²+bn+c.',
 params:'Integer a>0, integer b and c, positions 1–5; first differences and second differences; visual square-dot evidence.',
 presets:'Y8-021 Quadratic pattern spotting; Y9-008 Quadratic pattern structure; KS3 Square pattern (unnumbered extension).',
 steps:'Term row → first differences → constant second differences → a n² → linear remainder → full nth term.',
 interactions:'Watch, Guided, Explore presets/term reveal, Challenge draggable a/b/c coefficients with remove/re-grab/keyboard and three tasks.',
 traps:'Mistaking the second difference for a (instead of 2a), wrong sign of b, assuming c is term 1, stopping at an².',
 gcse:'Bridge to deriving quadratic nth terms via difference tables and checking the quadratic expression against terms.'
}});
window.F909_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const heading=component.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
