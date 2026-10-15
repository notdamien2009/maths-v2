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

/* NOVA F3-06 Prime Factor Ladder — canonical F0 core only; no private drawing or mascot system. */
const F306_CONFIG={id:'F3-06',startMode:'watch',preset:'Y7-015-60',parameters:{min:2,max:420,primeCandidates:[2,3,5,7,11,13,17,19]},
 presets:{
  'Y7-015-60':{label:'Year 7 · Prime decomposition of 60',n:60,lesson:'Y7-015'},
  'Y7-015-90':{label:'Year 7 · Prime decomposition of 90',n:90,lesson:'Y7-015'},
  'Y7-016-180':{label:'Year 7 · HCF/LCM preparation: 180',n:180,lesson:'Y7-016'},
  'Y8-004-84':{label:'Year 8 · Prime decomposition of 84',n:84,lesson:'Y8-004'},
  'Y8-004-420':{label:'Year 8 · Extended number: 420',n:420,lesson:'Y8-004'}},
 events:{value:['preset','target','primeDivisor','quotient','rung','undoRung','indexExponent','challengeTask'],types:['step','correct','hintUsed','mode']},
 challenge:[{n:60},{n:84},{n:180}]};
window.F306_CONFIG=F306_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F306_CONFIG),ID=C.id;
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F3-06 event '+key);N.events.emit('value',{engine:ID,key,value});}
function prime(v){if(!Number.isInteger(v)||v<2)return false;for(let i=2;i*i<=v;i++)if(v%i===0)return false;return true;}
function smallestPrime(n){if(!Number.isInteger(n)||n<2)return null;for(let i=2;i<=n;i++)if(n%i===0)return i;return null;}
function factorise(n){if(!Number.isInteger(n)||n<C.parameters.min||n>C.parameters.max)throw Error('Value out of bounds');let r=n,out=[];while(r>1){const p=smallestPrime(r);out.push(p);r/=p;}return out;}
function exponents(factors){const out={};for(const p of factors)out[p]=(out[p]||0)+1;return out;}
function indexPlain(ff){return Object.entries(exponents(ff)).map(([p,v])=>p+(v>1?'^'+v:'')).join(' × ');}
function verifyLadder(n,parts){if(!Number.isInteger(n)||n<2||n>C.parameters.max)return false;let r=n;for(const p of parts){if(!prime(p)||p!==smallestPrime(r))return false;r/=p;}return r===1;}
function validNext(n,parts,p){if(!prime(p))return {ok:false,why:'Only a prime number can go in the divisor slot.'};let r=n;for(const q of parts)r/=q;if(r===1)return {ok:false,why:'You have already reached one.'};if(r%p!==0)return {ok:false,why:p+' does not divide '+r+' exactly. Try another prime.'};if(p!==smallestPrime(r))return {ok:false,why:'Start with the smallest prime divisor: '+smallestPrime(r)+'.'};return {ok:true,remainder:r/p};}
function quotient(n,parts){return parts.reduce((r,p)=>r/p,n);}
window.F306_MATH={prime,smallestPrime,factorise,exponents,indexPlain,verifyLadder,validNext,quotient};
function txt(parent,x,y,t,size=40,role='given'){return N.chalkText(parent,x,y,String(t),{size,role});}
function btn(t,f,main=false){return H('button',{text:t,class:main?'nova-btn primary':'nova-btn',onclick:f});}
const SPEECH={start:'Start at the top!',first:'Try two first!',second:'Down we go!',third:'Keep dividing!',fourth:'Almost there!',five:'One more!',one:'We reached one!',collect:'Collect the primes!',index:'Spot the powers!',explore:'Pick a prime!',ready:'Your turn!',right:'Nice work!',wrong:'Try another!',hint:'Look closely!',almost:'Finish the proof!',win:'Brilliant work!',undo:'Try again!'};
const POSE={start:'explain',first:'point',second:'point',third:'point',fourth:'count',five:'count',one:'cheer',collect:'count',index:'think',explore:'point',ready:'think',right:'cheer',wrong:'oops',hint:'think',almost:'think',win:'cheer',undo:'point'};
function dock(stage,key){
if(window.NovaLessonComponent?.active){[stage,key]=window.NovaLessonComponent.args("dock",arguments);}
N.scene.helperStrip(stage,POSE[key]||'think',SPEECH[key]||'Your turn!');}
const STEPS=[
 {name:'Begin with sixty',rungs:0,phase:'start',say:'start',narration:'Prime factorisation means writing sixty as a multiplication of prime numbers. We start with sixty at the top of the division ladder.'},
 {name:'Divide by two',rungs:1,phase:'divide',say:'first',narration:'Two is the smallest prime divisor of sixty. Sixty divided by two is thirty. We write two on the left and thirty on the right.'},
 {name:'Divide by two again',rungs:2,phase:'divide',say:'second',narration:'Thirty is still divisible by two. Divide thirty by two and write fifteen on the next rung.'},
 {name:'Divide by three',rungs:3,phase:'divide',say:'third',narration:'Fifteen is no longer divisible by two. Three is its smallest prime divisor, giving five.'},
 {name:'Finish with five',rungs:4,phase:'divide',say:'one',narration:'Five is prime. Divide five by five to reach one. The prime ladder is complete only when the final quotient is one.'},
 {name:'Collect the prime divisors',rungs:4,phase:'collect',say:'collect',narration:'Read the prime numbers in the left column: two, two, three and five. Multiplying them gives sixty.'},
 {name:'Write index form',rungs:4,phase:'index',say:'index',narration:'Two appears twice, so write two squared. Three and five each appear once. Sixty equals two squared times three times five.'}
];
// All main neon objects use canonical F0 SVG helper functions and draw/chalk fonts.
function diagram(n,parts,opt={}){
 const svg=N.svg.root(940,1050,'Division ladder for '+n+'. Prime divisors on the left and successive quotients on the right, followed by their product in index form.');svg.classList.add('f306-svg');svg.setAttribute('data-target-number',n);
 const all=factorise(n),complete=quotient(n,parts)===1,showProduct=opt.phase==='collect'||opt.phase==='index'||opt.forceProduct||complete;
 const slotTop=190,step=Math.min(107,570/Math.max(5,all.length+1)),filled=parts.length;
 // The top glass capsule anchors the entire mathematical proof.
 N.neonBox(svg,312,24,315,92,{role:'support',r:22});txt(svg,470,86,n,69,'given');
 txt(svg,231,163,'Prime',44,'op');txt(svg,625,163,'Quotient',44,'given');
 // Fixed outer rail is core path, not a custom SVG line implementation.
 N.neonPath(svg,'M 472 128 L 472 '+(slotTop+(Math.max(filled+1,2))*step+10),{role:'support',width:4});
 for(let i=0;i<filled;i++){
  const p=parts[i],q=quotient(n,parts.slice(0,i+1)),y=slotTop+i*step,seen=opt.phase==='divide'&&i===filled-1;
  const g=E('g',{'data-rung':i,'aria-label':'Prime '+p+', quotient '+q},svg);
  N.neonBox(g,140,y,192,82,{role:seen?'focus':'op',r:18});
  N.neonBox(g,482,y,309,82,{role:q===1?'result':'given',r:18});
  N.neonRing(g,233,y+41,{role:'op',r:29,pulse:false});
  txt(g,233,y+58,p,57,'op');txt(g,635,y+58,q,59,q===1?'result':'given');
  if(i===filled-1&&opt.animate&&!N.reducedMotion())N.motion.arrive(g,0,-25,480,N.motion.ease.back);
  if(opt.undo){N.ui.svgDrag(svg,g,{box:{x:140,y,w:192,h:82},zones:()=>[{id:'remove',kind:'remove',x:314,y:962,w:310,h:60}],onRemove:()=>opt.undo(i)});}
 }
 const next=quotient(n,parts),ghostY=slotTop+filled*step;
 // Unfilled rungs remain visible as a neon ladder scaffold, not as an empty band.
 // These are generic slots, not revealed factors or quotients.
 if(!complete){
  for(let j=filled+1;j<Math.max(5,filled+2);j++){
   const y=slotTop+j*step;if(y>688)break;
   const g=E('g',{'aria-hidden':'true'},svg);g.style.opacity=String(.34-Math.min(2,j-filled-1)*.07);
   N.neonBox(g,147,y,178,69,{role:'support',r:16});N.neonBox(g,489,y,293,69,{role:'support',r:16});
   txt(g,237,y+46,'?',48,'support');txt(g,632,y+46,'?',48,'support');
  }
  N.neonRing(svg,470,690,{role:'result',r:28,pulse:false});
  txt(svg,521,707,'1',45,'result');
 }
 if(!complete&&ghostY<720){
  N.neonBox(svg,140,ghostY,192,82,{role:'unknown',r:18});N.neonBox(svg,482,ghostY,309,82,{role:'support',r:18});
  txt(svg,233,ghostY+57,'?',62,'focus');txt(svg,635,ghostY+57,'?',62,'focus');
  if(opt.add){N.neonRing(svg,233,ghostY+41,{role:'focus',r:34,pulse:false});}
 }
 const prodY=754;
 N.neonBox(svg,104,prodY,732,86,{role:showProduct?'result':'support',r:18});
 if(!showProduct){txt(svg,470,817,parts.length?'Keep dividing to one':'Prime product appears here',41,'given');}
 else {
  const exp=exponents(parts),items=Object.entries(exp),widths=items.map(([p,k])=>k>1?98:66),gap=36,
  total=widths.reduce((a,b)=>a+b,0)+(items.length-1)*gap,
  first=470-total/2;let x=first;
  items.forEach(([p,k],i)=>{
   txt(svg,x+widths[i]/2-5,819,p,54,'result');
   if(k>1)txt(svg,x+widths[i]/2+28,798,k,42,'result');
   x+=widths[i];if(i<items.length-1){txt(svg,x+gap/2,817,'×',46,'given');x+=gap;}
  });
  if(opt.phase==='index')N.neonRing(svg,742,802,{role:'result',r:27,pulse:false});
 }
 // Interactive glass card tray; no hidden CSS/HTML SVG painting shortcuts.
 const choices=[2,3,5,7,11,13,17,19];if(prime(next)&&!choices.includes(next))choices.push(next);
 const show=choices.slice(0,9),x0=47,w=76,gap=17,y=867;
 if(opt.add){show.forEach((p,i)=>{
  const x=x0+i*(w+gap),g=E('g',{'data-prime-card':p,'aria-label':'Drag prime '+p+' into divisor slot'},svg);
  N.neonBox(g,x,y,w,64,{role:p===smallestPrime(next)?'focus':'op',r:14});txt(g,x+w/2,y+45,p,48,'given');
  N.ui.svgDrag(svg,g,{box:{x,y,w,h:64},zones:()=>[{id:'next',kind:'drop',x:122,y:ghostY-6,w:237,h:100},{id:'remove',kind:'remove',x:314,y:962,w:310,h:60}],onDrop:()=>opt.add(p)});
 });}
 if(opt.undo){N.neonBox(svg,314,959,312,64,{role:'error',r:14});txt(svg,470,1002,'Remove / undo',42,'error');}
 return svg;
}
function assemble(stage,n,parts,opt={}){
if(window.NovaLessonComponent?.active){[stage,n,parts,opt]=window.NovaLessonComponent.args("assemble",arguments);}

 stage.innerHTML='';N.cap(stage,'Prime factor ladder',opt.caption||'Divide by the smallest prime until you reach one');
 const row=H('div',{class:'f306-scene'}),side=H('aside',{class:'f306-side'}),svg=diagram(n,parts,opt),remaining=quotient(n,parts);
 side.append(
  N.neonCard([H('span',{class:'f306-kicker',text:'NEXT QUOTIENT'}),H('p',{class:'f306-ink',text:String(remaining)})],{role:remaining===1?'result':'op'}),
  N.neonCard([H('span',{class:'f306-kicker',text:'PRIMES COLLECTED'}),H('p',{class:'f306-ink',text:parts.length?parts.join(' × '):'Choose a prime'})],{role:'result'}),
  N.neonCard([H('span',{class:'f306-kicker',text:'THE CHECK'}),H('p',{class:'f306-detail',text:remaining===1?'Every factor is prime and the product recreates '+n+'.':'Choose the smallest prime that divides '+remaining+' exactly.'})],{role:'support'})
 );row.append(svg,side);stage.append(row);dock(stage,opt.say||'explore');return svg;
}
function expControls(parts,values,on){const wrap=H('div',{class:'f306-exp-form','aria-label':'Index form powers'});Object.keys(exponents(parts)).forEach(p=>{
 const inp=H('input',{type:'number',min:0,max:12,step:1,value:values[p]??0,'aria-label':'Power of '+p});inp.onchange=()=>on(p,+inp.value);
 wrap.append(H('label',{},[H('span',{text:'Power of '+p}),inp]));
 });return wrap;}
const def={id:ID,title:'Prime factor ladder',config:C,steps:STEPS,
 alt:'A prime division ladder showing an integer being divided by successively smaller prime factors until the quotient is one.',
 staticAlt:'60 ÷ 2 = 30; 30 ÷ 2 = 15; 15 ÷ 3 = 5; 5 ÷ 5 = 1. So 60 = 2² × 3 × 5.',
 render(i,stage){const s=STEPS[i],parts=factorise(60).slice(0,s.rungs);assemble(stage,60,parts,{phase:s.phase,caption:s.name,say:s.say,animate:i>0});},
 exploreIntro:'Build and check your own prime factor ladders.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let preset=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("preset",()=>(C.preset)):(C.preset)),n=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("n",()=>(C.presets[preset].n)):(C.presets[preset].n)),parts=[],say='explore',feedback='Choose the smallest prime factor.',bad=false;
  window.NovaLessonComponent?.applyExploreModels();const pre=H('select',{'aria-label':'Curriculum preset'}),number=H('input',{type:'number',min:C.parameters.min,max:C.parameters.max,step:1,value:n,'aria-label':'Starting whole number'}),choose=H('select',{'aria-label':'Prime divisor'}),status=H('p',{class:'f306-status',role:'status'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,v])=>pre.add(new Option(v.label,key)));
  window.NovaLessonComponent?.applyExploreModels();function options(){const rem=quotient(n,parts);const a=[...new Set([...C.parameters.primeCandidates,...(prime(rem)?[rem]:[])])].sort((a,b)=>a-b);choose.innerHTML='';a.forEach(p=>choose.add(new Option(String(p),p)));}
  window.NovaLessonComponent?.applyExploreModels();function report(m,error=false,kind='right'){feedback=m;bad=error;say=error?'wrong':kind;}
  window.NovaLessonComponent?.applyExploreModels();function add(p){emit('primeDivisor',p);const v=validNext(n,parts,p);if(!v.ok){report(v.why,true);render();return false;}parts.push(p);emit('quotient',v.remainder);emit('rung',parts.length);report(v.remainder===1?'All rungs complete!':'Exact prime division!');render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function undo(i){if(i<0||i>=parts.length)return false;parts=parts.slice(0,i);emit('undoRung',i);report('Those rungs have been removed.',false,'undo');render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function render(){panel.innerHTML='';options();pre.value=preset;number.value=n;
   assemble(stage,n,parts,{say,caption:'Build the prime division ladder',phase:quotient(n,parts)===1?'index':'divide',add:quotient(n,parts)>1?add:null,undo});
   const bar=H('div',{class:'f306-row'},[H('label',{},['Preset',pre]),H('label',{},['Number',number]),H('label',{},['Prime divisor',choose])]);
   panel.append(H('p',{class:'f306-intro',text:'Divide by a prime. Check the quotient. Keep going to one.'}),bar,H('div',{class:'f306-row'},[
    btn('Add rung',()=>add(+choose.value),true),btn('Undo last',()=>undo(parts.length-1)),btn('Reset',()=>{parts=[];report('Start at the top!',false,'start');render();})]),status);
   status.textContent=feedback;status.classList.toggle('error',bad);
  }
  window.NovaLessonComponent?.applyExploreModels();pre.onchange=()=>{preset=pre.value;n=C.presets[preset].n;parts=[];emit('preset',preset);emit('target',n);report('Ready for a new ladder.',false,'start');render();};
  window.NovaLessonComponent?.applyExploreModels();number.onchange=()=>{n=Math.max(C.parameters.min,Math.min(C.parameters.max,Math.floor(+number.value||60)));parts=[];emit('target',n);report('Start dividing!',false,'start');render();};window.NovaLessonComponent?.applyExploreModels();render();},
 challenge(panel,api,stage){let task=0,parts=[],exps={},wrong=0,won=false,say='ready',feedback='Build a ladder with the smallest prime at every rung.',bad=false;
  const choose=H('select',{'aria-label':'Choose a prime for the next rung'}),status=H('p',{class:'f306-status',role:'status'});
  function cur(){return C.challenge[task].n;}
  function report(s,error=false,pose='right'){feedback=s;bad=error;say=error?'wrong':pose;}
  function fail(s){wrong++;report(s,true);api.check(false,s,{task,wrong});render();return false;}
  function options(){const rem=quotient(cur(),parts);choose.innerHTML='';[...new Set([...C.parameters.primeCandidates,...(prime(rem)?[rem]:[])])].sort((a,b)=>a-b).forEach(p=>choose.add(new Option(String(p),p)));}
  function add(p){const n=cur();emit('primeDivisor',p);const v=validNext(n,parts,p);if(!v.ok)return fail(v.why);parts.push(p);emit('rung',parts.length);emit('quotient',v.remainder);report(v.remainder===1?'Now prove the powers!':'Correct prime divisor!');render();return true;}
  function undo(i){if(i<0||i>=parts.length)return false;parts=parts.slice(0,i);exps={};emit('undoRung',i);report('Undo complete.',false,'undo');render();return true;}
  function indexCheck(){const need=exponents(parts);const badKey=Object.keys(need).find(p=>Number(exps[p])!==need[p]);if(badKey)return fail('Count the '+badKey+' factors again. The power gives their frequency.');
   if(!verifyLadder(cur(),parts))return fail('The ladder must end at one with prime divisors.');
   api.check(true,'Complete prime factorisation proved.',{task,parts,index:indexPlain(parts)});
   if(task===C.challenge.length-1){won=true;report('Three prime ladders proved!',false,'win');render();return true;}
   task++;parts=[];exps={};emit('challengeTask',task);report('New ladder. Start with the smallest prime!',false,'ready');render();return true;}
  function render(){panel.innerHTML='';const n=cur(),complete=quotient(n,parts)===1;options();
   assemble(stage,n,parts,{caption:'Proof '+(task+1)+' of 3 · '+n,phase:complete?'index':'divide',say,add:complete?null:add,undo});
   if(won){panel.append(H('p',{class:'f306-complete',text:'Complete · three ladders and three index-form proofs'}));return;}
   panel.append(H('p',{class:'f306-intro',text:'Proof '+(task+1)+' / 3 · Prime-factorise '+n+' using the ladder, then verify the index form.'}));
   if(!complete)panel.append(H('div',{class:'f306-row'},[
    H('label',{},['Choose prime',choose]),btn('Divide',()=>add(+choose.value),true),btn('Undo last',()=>undo(parts.length-1)),btn('Hint',()=>{api.hint('Try the smallest prime that divides '+quotient(n,parts)+' exactly.');say='hint';render();})]));
   else panel.append(H('p',{class:'f306-note',text:'Each prime base has an exponent: enter how many times that prime appears in your ladder.'}),expControls(parts,exps,(p,v)=>{exps[p]=v;emit('indexExponent',{prime:+p,power:v});}),H('div',{class:'f306-row'},[
    btn('Check index form',indexCheck,true),btn('Undo rung',()=>undo(parts.length-1)),btn('Hint',()=>{api.hint('The exponent counts repeated primes. For example, two twos make two squared.');say='hint';render();})]));
   status.textContent=feedback;status.classList.toggle('error',bad);panel.append(status);
  }
  emit('challengeTask',task);render();},onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['prime decomposition','prime ladder','factorisation','index form','HCF and LCM'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F3-05']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"dock":["stage","key"],"assemble":["stage","n","parts","opt"]},exploreFields:{"preset":{"kind":"value","factory":null,"argCount":null},"n":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'06',title:'Prime factor ladder · Premium Review',def,linked:['F3-05','F3-07','F3-10'],years:'Year 7: Y7-015 and Y7-016 · Year 8: Y8-004',spec:{
 purpose:'Construct a descending division ladder where each divisor is prime, each quotient is exact, and the end value is one.',
 params:'Whole numbers 2–420; named curriculum presets; user can set any integer within range.',
 presets:'Y7-015: 60/90; Y7-016: 180; Y8-004: 84/420.',
 steps:'Start at 60 → divide by 2 → divide by 2 → divide by 3 → divide by 5 → gather primes → write 2² × 3 × 5.',
 interactions:'Native F0 draggable prime cards; an exact target slot; draggable completed rungs to red Remove; keyboard prime selection, add, undo; index-form exponent fields.',
 traps:'A composite number is not prime; a prime must divide exactly; choose the smallest prime first; a ladder is complete only at one; the exponent counts repetitions.',
 gcse:'Directly supports prime power notation, HCF and LCM using prime decompositions.'}});
// F3 pointer-tracking compatibility guard. The approved F0 SVG drag helper reorders
// the grabbed SVG child after requesting pointer capture. Some Chromium builds
// discard that capture on reparent/reorder. Relay ONLY missed document moves to
// the existing F0 drag listener; never replace its snap, maths, or motion logic.
(function installPointerRecovery(){
 const host=document.getElementById(ID);let activePointer=null;
 window.addEventListener('pointerdown',e=>{
   const hit=e.target.closest?.('[data-drag="1"]');
   if(hit&&host.contains(hit))activePointer=e.pointerId;
 },true);
 window.addEventListener('pointermove',e=>{
   const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||activePointer!==e.pointerId)return;
   if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
   // Non-bubbling prevents a relay loop; st.move uses the original client coordinates.
   d.el.dispatchEvent(new PointerEvent('pointermove',{
     pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,
     clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,
     bubbles:false,cancelable:false
   }));
 },true);
 window.addEventListener('pointerup',e=>{
   if(activePointer!==e.pointerId)return;
   const d=N.ui._drag;
   if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);
   activePointer=null;
   // If the pointerup originated on the card, F0 resolves the drop at target phase.
 },true);
 window.addEventListener('pointercancel',e=>{
   if(activePointer!==e.pointerId)return;activePointer=null;
   const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();
 },true);
 window.addEventListener('blur',()=>{activePointer=null;});
})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(e=>dev.append(e));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA mathematics helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{childList:true,subtree:true});
})();
