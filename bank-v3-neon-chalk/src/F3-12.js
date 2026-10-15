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

/* F3-12 — Divisibility Explorer. Only canonical F0 rendering, events, motion, drag and mascots. */
const F312_CONFIG={id:'F3-12',startMode:'watch',preset:'Y7-014',parameters:{min:10,max:9999,rules:[2,3,4,5,6,9,10]},
 presets:{'Y7-014':{label:'Year 7 · Prime and composite numbers',number:234},'Y7-Digits':{label:'Digit sum and final digits · 135',number:135},'Y7-All':{label:'Multiple rules · 360',number:360},'Y7-Edge':{label:'No basic tests pass · 437',number:437}},
 challenge:[{number:234},{number:135},{number:437}],
 events:{value:['preset','number','rule','classification','remove','answer','proof','reset','hint'],types:['step','correct','hintUsed','mode']}};
window.F312_CONFIG=F312_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F312_CONFIG),ID=C.id,R=C.parameters.rules;
const SPEECH={pick:'Pick a lens!',digits:'Read the digits!',sum:'Add them up!',decide:'Does it divide?',other:'Test another!',explore:'Look closely!',right:'Well spotted!',wrong:'Try again!',hint:'Check the digits!',ready:'Your turn!',win:'Brilliant!',undo:'Try again!',complete:'All seven!'};
const POSE={pick:'magnify',digits:'point',sum:'count',decide:'think',other:'magnify',explore:'point',right:'cheer',wrong:'oops',hint:'think',ready:'think',win:'cheer',undo:'point',complete:'cheer'};
function dock(stage,k){
if(window.NovaLessonComponent?.active){[stage,k]=window.NovaLessonComponent.args("dock",arguments);}
N.scene.helperStrip(stage,POSE[k]||'think',SPEECH[k]||'Your turn!');}
function chalk(svg,x,y,t,size=50,role='given'){return N.chalkText(svg,x,y,String(t),{size,role});}
function evt(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F3-12 event '+key);N.events.emit('value',{engine:ID,key,value});}
function button(t,fn,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text:t,onclick:fn});}
function digits(n){return String(n).split('').map(Number);}
function digitSum(n){return digits(n).reduce((a,b)=>a+b,0);}
function evidence(n,rule){const d=digits(n),last=d.at(-1),tail=n%100,sum=digitSum(n),divides=n%rule===0;
 const dict={
  2:{headline:'Check the last digit',line:`${last} is ${last%2===0?'even':'odd'}`,detail:'A final digit of 0, 2, 4, 6 or 8 works.',high:[d.length-1]},
  3:{headline:'Add every digit',line:`${d.join(' + ')} = ${sum}`,detail:`${sum} ${sum%3===0?'is':'is not'} a multiple of 3.`,high:d.map((_,i)=>i)},
  4:{headline:'Look at the last two digits',line:`Last two digits = ${String(tail).padStart(2,'0')}`,detail:`${String(tail).padStart(2,'0')} ${tail%4===0?'is':'is not'} a multiple of 4.`,high:d.map((_,i)=>i).slice(-2)},
  5:{headline:'Check the last digit',line:`Last digit = ${last}`,detail:last===0||last===5?'It ends in 0 or 5.':'It must end in 0 or 5.',high:[d.length-1]},
  6:{headline:'Two tests must both pass',line:`Last digit ${last} · Digit sum ${sum}`,detail:`Even: ${last%2===0?'yes':'no'} · ÷3: ${sum%3===0?'yes':'no'}`,high:d.map((_,i)=>i)},
  9:{headline:'Add every digit',line:`${d.join(' + ')} = ${sum}`,detail:`${sum} ${sum%9===0?'is':'is not'} a multiple of 9.`,high:d.map((_,i)=>i)},
  10:{headline:'Check the last digit',line:`Last digit = ${last}`,detail:last===0?'It ends in zero.':'Only numbers ending in zero pass.',high:[d.length-1]}
 };
 return {number:n,rule,divides,...dict[rule]};}
function correct(n,r){return n%r===0;}
function full(n,map){return R.length===Object.keys(map).length&&R.every(r=>map[r]===(correct(n,r)?'yes':'no'));}
function misconception(n,r,choice){const e=evidence(n,r),last=n%10,sum=digitSum(n),pass=e.divides;
 if(choice===(pass?'yes':'no'))return '';
 if(r===6)return `Six requires BOTH conditions: last digit ${last} is ${last%2===0?'even':'odd'}, and digit sum ${sum} ${sum%3===0?'is':'is not'} divisible by three. The number ${pass?'does':'does not'} divide exactly by six.`;
 if(r===4)return `Test the last TWO digits (${String(n%100).padStart(2,'0')}). They ${n%4===0?'are':'are not'} divisible by four, so ${n} ${pass?'passes':'fails'}.`;
 if(r===3||r===9)return `The digit sum is ${sum}. ${sum} ${sum%r===0?'is':'is not'} divisible by ${r}, so ${n} ${pass?'passes':'fails'} the test.`;
 if(r===2)return `The last digit ${last} is ${last%2===0?'even':'odd'}. So ${n} ${pass?'is':'is not'} divisible by two.`;
 if(r===5)return `The last digit is ${last}. Five requires zero or five, so ${n} ${pass?'passes':'fails'}.`;
 return `The last digit is ${last}. Ten requires zero, so ${n} ${pass?'passes':'fails'}.`;
}
window.F312_MATH={digits,digitSum,evidence,correct,full,misconception};
const STEPS=[
 {name:'Choose a divisibility rule',rule:3,phase:0,say:'pick',narration:'Our number is two hundred and thirty-four. Choose a divisibility rule to test without long division.'},
 {name:'Highlight the relevant digits',rule:3,phase:1,say:'digits',narration:'For divisibility by three, look at every digit in two hundred and thirty-four: two, three and four.'},
 {name:'Calculate the digit sum',rule:3,phase:2,say:'sum',narration:'Add two, three and four to make nine. Nine is a multiple of three.'},
 {name:'Confirm the verdict',rule:3,phase:3,say:'decide',narration:'Because the digit sum is a multiple of three, two hundred and thirty-four is divisible by three. The rule gives evidence.'},
 {name:'Try a different rule',rule:4,phase:3,say:'other',narration:'Now test divisibility by four. The last two digits are thirty-four. Thirty-four is not a multiple of four, so the number does not divide exactly by four.'}
];
const SIZE={w:1000,h:1100};
const POS={yes:{x:84,y:759,w:397,h:234},no:{x:519,y:759,w:397,h:234},remove:{x:760,y:1015,w:198,h:67}};
function tokenPosition(rule,map){const i=R.indexOf(rule),where=map[rule];if(where){const arr=R.filter(r=>map[r]===where),index=arr.indexOf(rule),cols=4;return{x:(where==='yes'?125:560)+(index%cols)*92,y:863+Math.floor(index/cols)*76};}return{x:200+(i%4)*200,y:i<4?552:676};}
function svgArtwork(n,focus,opt={}){
 const phase=opt.phase??3,challenge=!!opt.challenge,placed=opt.placed||{},ev=evidence(n,focus),alt=`Divisibility test for ${n}; rule ${focus}; digit sum ${digitSum(n)}; ${ev.headline}.`;
 const svg=N.svg.root(SIZE.w,SIZE.h,alt);svg.classList.add('f312-svg');svg.dataset.number=String(n);svg.dataset.focus=String(focus);svg.dataset.challenge=challenge?'1':'0';
 // One prominent number card: positions and highlights are all through the F0 neonBox primitive.
 N.neonBox(svg,113,56,774,212,{role:'op',r:24});
 const ds=digits(n),dx=Math.min(140,570/ds.length),start=500-(ds.length-1)*dx/2;
 ds.forEach((d,i)=>{const active=phase>=1&&ev.high.includes(i);const x=start+i*dx;N.neonBox(svg,x-58,95,116,130,{role:active?'focus':'given',r:18});chalk(svg,x,187,d,96,active?'focus':'given');});
 // Evidence panel remains visible in mobile mode, not hidden in desktop-only cards.
 N.neonBox(svg,84,302,832,159,{role:phase>=2?'result':'support',r:20});
 chalk(svg,500,358,phase===0?'Choose one of the seven rules':phase===1?ev.headline:ev.line,phase===0?49:50,phase>=2?'focus':'given');
 chalk(svg,500,422,challenge?'Use the clue to decide':(phase<=1?'Look for the deciding digits':ev.detail),46,!challenge&&phase===3&&ev.divides?'result':'given');
 if(!challenge&&phase>=3){N.neonRing(svg,871,345,{role:ev.divides?'result':'focus',r:19});}
 if(challenge){
  N.neonBox(svg,POS.yes.x,POS.yes.y,POS.yes.w,POS.yes.h,{role:'result',r:24});
  N.neonBox(svg,POS.no.x,POS.no.y,POS.no.w,POS.no.h,{role:'focus',r:24});
 }
 // The seven lenses are genuine movable items in challenge and configurable inspections in Explore.
 R.forEach(r=>{
 const p=tokenPosition(r,challenge?placed:{}),sorted=!!placed[r],g=E('g',{'aria-label':`Rule ${r}${sorted?'; sorted':''}`,'data-rule':String(r)},svg);
 const role=sorted?(placed[r]==='yes'?'result':'focus'):(!challenge&&r===focus?'focus':'op');
 N.neonBox(g,p.x-88,p.y-52,176,103,{role,r:17});chalk(g,p.x,p.y+16,`÷ ${r}`,53,role);
 if(!challenge&&r===focus&&phase>=3){N.neonRing(g,p.x+69,p.y-37,{role:ev.divides?'result':'focus',r:12});}
 if(opt.interactive){N.ui.svgDrag(svg,g,{box:{x:p.x-89,y:p.y-54,w:178,h:108},zones:()=>sorted?[{id:'remove',kind:'remove',...POS.remove}]:[{id:'yes',kind:'drop',...POS.yes},{id:'no',kind:'drop',...POS.no}],onDrop:dest=>opt.sort(r,dest),onRemove:()=>opt.remove(r)});}
 });
 if(challenge){
  // Core neon boxes distinguish the two evidence-based bins with wording + colour.
  chalk(svg,281,801,'Divides exactly',46,'result');chalk(svg,717,801,'Does not divide',46,'focus');
  N.neonBox(svg,POS.remove.x,POS.remove.y,POS.remove.w,POS.remove.h,{role:'error',r:17});chalk(svg,859,1062,'Remove',46,'error');
  if(!full(n,placed))chalk(svg,375,1060,'Sort all seven tests',46,'given');
  else chalk(svg,375,1060,opt.reveal?'All seven proved!':'Now check all seven',46,opt.reveal?'result':'given');
 }else{
  N.neonBox(svg,95,793,810,165,{role:phase>=3&&ev.divides?'result':'support',r:24});
  chalk(svg,500,854,phase<3?'Will the rule divide exactly?':ev.divides?`${n} is divisible by ${focus}`:`${n} is not divisible by ${focus}`,49,phase>=3?(ev.divides?'result':'focus'):'given');
  chalk(svg,500,919,phase<3?'Read the evidence first':ev.divides?`${n} ÷ ${focus} = ${n/focus}`:`Remainder ${n%focus} when divided by ${focus}`,46,'given');
 }
 if(opt.animate&&!N.reducedMotion())N.motion.flash(svg,500,360,ev.divides?'result':'focus',29);
 return svg;
}
function show(stage,n,focus,opt={}){
if(window.NovaLessonComponent?.active){[stage,n,focus,opt]=window.NovaLessonComponent.args("show",arguments);}

 stage.innerHTML='';N.cap(stage,'Divisibility Explorer',opt.caption||'Read the digits and test a rule');
 const area=H('div',{class:'f312-scene'}),svg=svgArtwork(n,focus,opt),side=H('aside',{class:'f312-side'});
 R.forEach(r=>{const e=evidence(n,r),isFocus=r===focus;
  side.append(N.neonCard([H('span',{class:'f312-side-head',text:`Rule ${r}`}),H('p',{class:'f312-side-value',text:isFocus&&!opt.challenge?e.headline:'Test the digits'}),H('p',{class:'f312-side-desc',text:isFocus&&!opt.challenge?(opt.phase>=3?(e.divides?'Divides exactly':'Not divisible'):'Inspect the highlighted digits'):'Choose this lens to investigate'})],{role:isFocus?'focus':'op'}));});
 area.append(svg,side);stage.append(area);dock(stage,opt.say||'explore');return svg;
}
function selectRules(active,on){const row=H('div',{class:'f312-row'});R.forEach(r=>{const b=H('button',{class:'f312-rule',type:'button',text:`÷ ${r}`,'aria-pressed':r===active?'true':'false',onclick:()=>on(r)});row.append(b)});return row;}
function live(panel,stage){window.NovaLessonComponent?.applyExploreModels();let preset=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("preset",()=>(C.preset)):(C.preset)),n=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("n",()=>(C.presets[preset].number)):(C.presets[preset].number)),focus=3,said='explore',feedback='Choose a rule. The lenses reveal the arithmetic evidence.',bad=false;
 window.NovaLessonComponent?.applyExploreModels();const presetEl=H('select',{'aria-label':'Curriculum preset'}),number=H('input',{type:'number',min:10,max:9999,'aria-label':'Number to test'}),status=H('p',{class:'f312-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,v])=>presetEl.add(new Option(v.label,k)));
 window.NovaLessonComponent?.applyExploreModels();function setRule(r){focus=Number(r);evt('rule',focus);said='digits';feedback=evidence(n,focus).headline;bad=false;render();}
 window.NovaLessonComponent?.applyExploreModels();function choose(nv){n=Math.max(10,Math.min(9999,Math.floor(Number(nv)||234)));evt('number',n);said='explore';feedback='New number. Test all seven rules!';bad=false;render();}
 window.NovaLessonComponent?.applyExploreModels();function render(){panel.innerHTML='';presetEl.value=preset;number.value=n;
  show(stage,n,focus,{caption:`Investigate ${n} · test ${focus}`,say:said,phase:3});
  panel.append(H('div',{class:'f312-row'},[H('label',{},['Preset',presetEl]),H('label',{},['Number',number])]),selectRules(focus,setRule),
    H('p',{class:'f312-help',text:'Choose any lens to highlight the relevant digits. Use the sum or last digits to justify the result. The highlighted rule changes the evidence panel.'}),
    button('Another number',()=>choose(n+1)),status);
  status.textContent=feedback;status.classList.toggle('bad',bad);
 }
 window.NovaLessonComponent?.applyExploreModels();presetEl.onchange=()=>{preset=presetEl.value;evt('preset',preset);choose(C.presets[preset].number)};
 window.NovaLessonComponent?.applyExploreModels();number.onchange=()=>choose(number.value);window.NovaLessonComponent?.applyExploreModels();render();
}
function challenge(panel,api,stage){let round=0,placed={},focus=3,wrong=0,said='ready',message='Sort each of the seven test lenses into the correct bin.',bad=false,won=false,revealed=false;
 const ruleSelect=H('select',{'aria-label':'Rule card to place'}),binSelect=H('select',{'aria-label':'Divisibility bin'}),status=H('p',{class:'f312-status',role:'status'});
 R.forEach(r=>ruleSelect.add(new Option(`Divide by ${r}`,String(r))));
 [['yes','Divides exactly'],['no','Does not divide']].forEach(([k,v])=>binSelect.add(new Option(v,k)));
 const current=()=>C.challenge[round].number;
 function fail(rule,choice){wrong++;const msg=misconception(current(),rule,choice);message=msg;bad=true;said='wrong';api.check(false,msg,{rule,choice,round});render();return false;}
 function sort(rule,choice){rule=Number(rule);focus=rule;if(!R.includes(rule)||!['yes','no'].includes(choice)||placed[rule])return false;
  if(choice!==(correct(current(),rule)?'yes':'no'))return fail(rule,choice);
  placed[rule]=choice;revealed=false;said=full(current(),placed)?'complete':'right';bad=false;message=full(current(),placed)?'All seven placed. Press Check all seven.':'Correct bin!';evt('classification',{number:current(),rule,choice});render();return true;}
 function remove(rule){if(!placed[rule])return false;delete placed[rule];focus=rule;evt('remove',rule);revealed=false;said='undo';message='Rule card returned to the tray.';bad=false;render();return true;}
 function check(){evt('answer',{number:current(),placed:{...placed}});
  if(!full(current(),placed)){message='Place all seven rule cards correctly before checking.';bad=true;said='wrong';render();return false;}
  const n=current();evt('proof',{number:n,rules:[...R]});api.check(true,`All seven divisibility tests for ${n} are correctly classified.`,{round,number:n});revealed=true;bad=false;
  if(round===C.challenge.length-1){won=true;said='win';message='All three numbers proved!';render();return true;}
  round++;placed={};focus=3;said='ready';message=round===2?'None of these seven tests passes for 437. That alone does not mean 437 is prime.':'Next number. Find all seven results.';render();return true;
 }
 function hint(){const n=current(),r=R.find(x=>!placed[x])??R[0],e=evidence(n,r);focus=r;said='hint';message=`Test ${r}: ${e.line}. ${e.detail}`;evt('hint',{round,rule:r});api.hint(message);render();}
 function render(){panel.innerHTML='';const n=current();
  show(stage,n,focus,{caption:won?'All three proofs completed':`Proof ${round+1} of ${C.challenge.length} · ${n}`,say:said,challenge:true,placed,reveal:revealed,interactive:!won,sort,remove,phase:3});
  if(won){panel.append(H('div',{class:'f312-win',text:'All three challenges completed. Failing these seven tests does not prove primality: 437 = 19 × 23 is composite.'}));return;}
  ruleSelect.innerHTML='';R.forEach(r=>{const o=new Option(`Divide by ${r}${placed[r]?' (placed)':''}`,String(r));o.disabled=!!placed[r];ruleSelect.add(o)});if(!placed[focus])ruleSelect.value=String(focus);
  panel.append(H('p',{class:'f312-help',text:`Number ${n}: drag each neon rule card into “Divides exactly” or “Does not divide”. You can also use the keyboard controls. Do not assume a number is prime just because none of these seven tests passes.`}),
    H('div',{class:'f312-row'},[H('label',{},['Rule card',ruleSelect]),H('label',{},['Bin',binSelect]),button('Place rule',()=>sort(+ruleSelect.value,binSelect.value),true),button('Undo last',()=>remove(+Object.keys(placed).at(-1))),button('Hint',hint)]),
    H('div',{class:'f312-row'},[button('Check all seven',check,true),button('Reset this number',()=>{placed={};said='undo';message='Start again.';evt('reset',n);render();})]),status);
  ruleSelect.onchange=()=>{focus=Number(ruleSelect.value);said='digits';message=evidence(n,focus).headline;bad=false;render();};
  status.textContent=message;status.classList.toggle('bad',bad);
 }render();
}
const def={id:ID,title:'Divisibility Explorer',config:C,steps:STEPS,
 alt:'A large chalk-number card, seven neon divisibility lenses, coloured digit and digit-sum evidence, and bins for exact divisibility.',
 staticAlt:'234 has digit sum 9. It is divisible by 2, 3, 6 and 9, but not by 4, 5 or 10.',
 render(i,stage){let s=STEPS[i];show(stage,234,s.rule,{caption:s.name,say:s.say,phase:s.phase,animate:i>=2});},
 exploreIntro:'Choose a number and inspect its last digits or digit sum through seven different lenses.',
 explore:live,challenge,onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['divisibility rules','prime numbers','composite numbers','digit sum','last digit'],deps:['F0-02','F0-03','F0-04','F0-08','F3-05']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"dock":["stage","k"],"show":["stage","n","focus","opt"]},exploreFields:{"preset":{"kind":"value","factory":null,"argCount":null},"n":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'12',title:'Divisibility Explorer · Premium Review',def,linked:['F3-04','F3-05','F3-06'],years:'Year 7 · Prime numbers and factors',spec:{
 purpose:'Use digit evidence to test exact divisibility by 2, 3, 4, 5, 6, 9 and 10, supporting prime and composite classification without assuming these tests are exhaustive.',
 params:'Whole-number input 10–9999; seven fixed test lenses and repeated interactive card sorting.',
 presets:'Y7-014 prime and composite structure, with three additional number-context examples within the same lesson.',
 steps:'Choose rule → highlight decisive digits → calculate digit-sum or last-digit evidence → confirm exact division or remainder → test another rule.',
 interactions:'Switch lenses, configure number, drag individual rule cards into evidence bins, remove and re-grab, keyboard selection and place/undo/check.',
 traps:'Rule 4 uses two final digits; rule 6 requires both 2 and 3; rule 9 uses digit sum; failing these seven tests does not prove primality.',
 gcse:'Supports efficient prime/composite screening and numerical factor work.'}});
// Preserve canonical F0 drag API; recover high-speed cursor movements if SVG reordering loses capture.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function altAll(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA maths helper');});}altAll();new MutationObserver(altAll).observe(card,{subtree:true,childList:true});
})();
