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

/* F9-03 · Position-to-Term Table · source for the F0-based NOVA bank. */
const F903_CONFIG={
 id:'F9-03', family:'F9', startMode:'watch', preset:'Y7-037-linear-nth-term',
 presets:{'Y7-037-linear-nth-term':{label:'Year 7 · nth term of a linear sequence',a:2,b:3,from:1,to:10,objective:'Use position n to calculate the term directly.'}},
 events:{value:['position','term','rule','challengeTask','placed','coefficient','offset'],types:['step','correct','hintUsed','mode']}
};
(function(){'use strict';
 const N=window.NOVA,C=window.NovaV2Integration.configuration(F903_CONFIG),H=N.h,E=N.svg.el,id=C.id;
 const small=()=>innerWidth<=760;
 const W=()=>small()?360:760, SVG_H=(challenge=false)=>challenge?(small()?835:827):(small()?602:597);
 const value=(a,b,n)=>a*n+b;
 const minus=s=>String(s).replace(/-/g,'−');
 const rule=(a,b)=> (a===1?'n':(a===-1?'−n':String(a)+'n'))+(b>0?' + '+b:(b<0?' − '+Math.abs(b):''));
 const compact=(a,b)=>rule(a,b).replace(/ /g,'');
 const steps=[
  {name:'positions-first',pose:'explain',text:'The top row gives each term its position. Position is not the term itself.',prompt:'Point to position one. What should go beneath it?'},
  {name:'apply-rule',pose:'point-down',text:'For the first position, multiply one by two, then add three.',prompt:'What is two times one, plus three?'},
  {name:'reveal-first-term',pose:'count',text:'That gives five. The first term is five, not one.',prompt:'Which row shows the answer?'},
  {name:'map-several',pose:'point-right',text:'Apply the same rule to every position. Two n plus three makes five, seven, nine, eleven and thirteen.',prompt:'Test the rule using position four.'},
  {name:'jump-to-tenth',pose:'idea',text:'You do not need every term in between. Put ten into the rule to find term twenty-three.',prompt:'Could you calculate term twenty without counting all the way?'},
  {name:'generalise',pose:'celebrate',text:'The two tells us the sequence grows by two. The plus three adjusts the starting value.',prompt:'Why would two n alone give the wrong first term?'}
 ];
 let explore={a:2,b:3,n:4},task=0,placed={},keyboardPick=null,activeDrawing=null;
 function ev(key, val){if(!C.events.value.includes(key))throw Error('Unknown NOVA event '+key);N.events.emit('value',{engine:id,key,value:val});}
 function txt(p,x,y,s,size=20,role='given',anchor='middle'){return N.chalkText(p,x,y,String(s),{size,role,anchor});}
 function nbox(p,x,y,w,h,label,role='given',font=20){return N.neonBox(p,x,y,w,h,{text:String(label),role,textRole:role,size:font,r:12});}
 function btn(label,fn,cls='nova-btn'){return H('button',{class:cls,text:label,onclick:fn});}
 function reset(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("reset",arguments);}
stage.innerHTML='';N.cap(stage,'Sequence workshop','Position-to-term table');}
 function svgRoot(alt,challenge=false){let svg=N.svg.root(W(),SVG_H(challenge),alt);svg.setAttribute('class','nv-svg f903-svg');svg.setAttribute('role','img');return svg;}
 function side(label,val,role){return H('div',{class:'f903-card'+(role==='focus'?' f903-card--gold':'')},[H('div',{class:'f903-eyebrow',text:label}),H('div',{class:'f903-maths'+(role==='focus'?' f903-maths--gold':''),text:String(val)})]);}
 function note(label,s){return H('div',{class:'f903-card f903-card--full'},[H('div',{class:'f903-eyebrow',text:label}),H('div',{class:'f903-body',text:s})]);}
 function layout(){let w=W(),pad=small()?18:64,gap=small()?6:9,cw=(w-2*pad-4*gap)/5,sy=small()?142:130,ty=small()?338:315,h=small()?72:78;
  return {w,pad,gap,cw,sy,ty,h,cx:i=>pad+cw/2+i*(cw+gap),x:i=>pad+i*(cw+gap),ruleY:small()?500:500,poolRuleY:small()?602:593,poolTermY:small()?680:671,removeY:small()?757:746};}
 function putGraphic(svg,opt={}){
  const a=opt.a??2,b=opt.b??3,L=layout(),w=L.w;
  txt(svg,w/2,43,opt.title||'POSITION  →  TERM',small()?22:27,'support');
  txt(svg,w/2,78,opt.subtitle||'Read down a column to match position and term.',small()?16:19,'support');
  txt(svg,w/2,114,'POSITION   n',small()?19:22,'focus');
  txt(svg,w/2,L.ty-26,'TERM   T(n)',small()?19:22,'result');
  for(let i=0;i<5;i++){
    const n=i+1,x=L.x(i),cx=L.cx(i),ready=opt.visible==null?true:n<=opt.visible;
    nbox(svg,x,L.sy,L.cw,L.h,n,'focus',small()?23:29);
    // NOVA primitive arrows, one vertical mapping per column.
    if(opt.mapping!=='off' && (opt.mapping==='all' || i<Math.max(1,(opt.visible||1)))){
      N.svg.arrow(svg,cx,L.sy+L.h+8,cx,L.ty-15,{role:i===opt.emphasise?'focus':'op',width:small()?2.7:3.4});
    }
    const hidden=opt.blankCells?.includes(n);
    const term = ready&&!hidden?value(a,b,n):'?';
    const role=hidden?'unknown':ready?'result':'support';
    nbox(svg,x,L.ty,L.cw,L.h,term,role,small()?22:28);
    if(hidden){ const hit=E('rect',{x,y:L.ty,width:L.cw,height:L.h,rx:12,fill:'transparent',class:'f903-cell-hit','data-slot':'term-'+n,tabindex:0,role:'button','aria-label':'Place the value for position '+n},svg);
     if(opt.onCell)hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onCell(n);}});
     if(opt.onCell)hit.addEventListener('click',()=>opt.onCell(n));
    }
  }
  const y=L.ruleY,form=opt.ruleText===null?'?':opt.ruleText||rule(a,b);
  txt(svg,w/2,y-46,opt.ruleCaption||'MAPPING RULE',small()?16:19,'support');
  nbox(svg,w/2-(small()?66:92),y-21,small()?132:184,49,form,opt.ruleText===null?'unknown':'focus',small()?21:26);
  if(opt.ruleText===null){ const r=E('rect',{x:w/2-(small()?66:92),y:y-21,width:small()?132:184,height:49,rx:12,fill:'transparent','data-slot':'rule',tabindex:0,role:'button','aria-label':'Place the nth-term rule here'},svg);
   if(opt.onRule)r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onRule();}});
   if(opt.onRule)r.addEventListener('click',opt.onRule);
  }
  return L;
 }
 function wrap(stage,svg,cards,pose,caption){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,caption]=window.NovaLessonComponent.args("wrap",arguments);}
stage.appendChild(H('div',{class:'f903-stage'},[svg,H('aside',{class:'f903-side'},cards)]));N.scene.helperStrip(stage,pose,caption);}
 function renderLearning(index,stage){
  const lessonMath=C.presets[C.preset]||C.presets[Object.keys(C.presets)[0]],a=lessonMath.a,b=lessonMath.b;reset(stage);let s=steps[index],g=svgRoot('Two-row position-to-term table: position n maps to term T(n) using '+rule(a,b)+'.');
  let captions=['First identify the positions','Multiply, then add','Reveal the first term','Use the SAME rule each time','Jump straight to the tenth term','The difference and adjustment'];
  let visible=[0,0,1,5,5,5][index],showRule=index>0;
  putGraphic(g,{visible,title:index<5?'POSITION  →  TERM':'FIND THE GENERAL RULE',subtitle:captions[index],a,b,mapping:index===0?'off':index>=3?'all':undefined,ruleText:showRule?rule(a,b):null,emphasise:index<3?0:index===3?3:4});
  if(index===4){ const w=W();txt(g,w/2,small()?568:556,'Position 10   →   '+a+' × 10 '+(b<0?'− '+Math.abs(b):'+ '+b)+' = '+value(a,b,10),small()?18:23,'result');}
  if(index===5){ const w=W();txt(g,w/2,small()?548:520,'Difference: '+(a>=0?'+':'')+a+'     Starting adjustment: '+(b>=0?'+':'')+b,small()?16:21,'support');}
  const cards=[side('CURRENT POSITION',index===4?'10':index>=3?'1–5':'1'),side('RULE',showRule?rule(a,b):'Find it','focus')];
  cards.push(note('WHY IT WORKS',index===0?'Positions tell us WHERE a term sits. The second row will tell us its VALUE.':index<3?'Multiply position n by '+a+', then '+(b<0?'subtract '+Math.abs(b):'add '+b)+'.':index===4?'Use the position directly: no need to list terms one to nine.':'The coefficient '+a+' gives the constant difference; the adjustment '+b+' shifts the sequence.'));
  wrap(stage,g,cards,s.pose,s.text);
  // Explicit position → rule → term reveal; use the shared motion kit, not CSS-keyframed drifting layers.
  if(!N.reducedMotion()&&index>0){let arrows=[...g.querySelectorAll('.nv-neon-tube')];for(let j=0;j<Math.min(arrows.length,5);j++){let el=arrows[j];el.style.opacity='0.18';N.motion.tween(320+j*110,v=>{el.style.opacity=String(.18+.82*v);},N.motion.ease.out);}}
 }
 const tasks=[
  {title:'01 · Map a growing sequence',a:2,b:3,choices:[11,13,10,12,14,16],rules:['2n+3','2n','3n+2'],correct:[11,13],rule:'2n+3',known:[5,7,9],hint:'The rule is 2 times the position, then add 3. Position 4 is not the fourth jump.',trap:{'2n':'Two n has the right difference, but it misses the plus three.','3n+2':'Look at the jump from five to seven. It is plus two, not plus three.','10':'You may have counted a jump rather than substituting n = 4.','12':'Check two times four, then add three.','14':'Recheck which column you are filling.','16':'Sixteen is one of the choices, but it is not this term.'}},
  {title:'02 · The adjustment can be negative',a:3,b:-2,choices:[10,13,7,12,15,16],rules:['3n−2','3n+2','2n−3'],correct:[10,13],rule:'3n−2',known:[1,4,7],hint:'The terms rise by three, but the first term is one. Try 3n minus 2.',trap:{'3n+2':'The adjustment is minus two, not plus two.','2n−3':'The coefficient must match the +3 difference.','7':'Seven is the third term. Use position four.','12':'Remember to subtract two after multiplying.','15':'Three times five is fifteen; subtract the adjustment.','16':'You have added rather than subtracted the adjustment.'}},
  {title:'03 · Work with a larger difference',a:4,b:1,choices:[17,21,16,20,22,25],rules:['4n+1','4n','n+4'],correct:[17,21],rule:'4n+1',known:[5,9,13],hint:'The terms increase by four. What must be added to 4n to produce five at n = 1?',trap:{'4n':'The difference four is right, but the extra one is missing.','n+4':'The coefficient is not one: each term increases by four.','16':'Four times four is sixteen. What is the adjustment?','20':'Four times five is twenty. Add one.','22':'Try substituting position five precisely.','25':'This is not the next term from twenty-one.'}}
 ];
 let challengePanel=null,challengeApi=null,challengeStage=null,challengeComplete=false;
 const expected=(slot,t)=>slot==='rule'?t.rule:t.correct[slot==='term-4'?0:1];
 function friendly(slot){return slot==='rule'?'the rule':slot==='term-4'?'position four':'position five';}
 function resetChallenge(){placed={};keyboardPick=null;challengeComplete=false;}
 function failMessage(t,slot,val){
   if(slot.startsWith('term-')&&t.correct.includes(Number(val))&&Number(val)!==expected(slot,t))return 'That term belongs in the OTHER column. Check the position number above this cell.';
   return t.trap[String(val)]||('Check '+friendly(slot)+'. Substitute the position into the same nth-term rule.');
 }
 function place(slot,val){
  const t=tasks[task]; if(slot!=='rule'&&!['term-4','term-5'].includes(slot))return false;
  const correct=String(expected(slot,t))===String(val);
  if(!correct){challengeApi.check(false,failMessage(t,slot,val),{task,slot,attempt:val});return false;}
  if(Object.values(placed).includes(String(val))&&slot!=='rule')return false;
  placed[slot]=String(val);keyboardPick=null;ev('placed',{slot,value:val});drawChallenge();return true;
 }
 function pickup(value,kind){keyboardPick={value:String(value),kind};let status=challengePanel.querySelector('.f903-feedback');if(status)status.textContent='Selected '+value+'. Now choose '+(kind==='rule'?'the rule slot':'one of the empty term cells')+'.';}
 function keyboardDrop(slot){if(!keyboardPick){let status=challengePanel.querySelector('.f903-feedback');if(status)status.textContent='Select a card first, then press Enter on the empty slot.';return;}
  if(keyboardPick.kind!==(slot==='rule'?'rule':'term')){challengeApi.check(false,'A rule card goes in the rule slot; a number goes in a term cell.',{task,slot});return;}
  place(slot,keyboardPick.value);
 }
 function remove(slot){if(!placed[slot])return;delete placed[slot];ev('placed',{slot,value:null});drawChallenge();}
 function reinforceFastDrag(group){
  // Scoped bridge for Chromium SVG <g> pointer-capture gaps on single-frame fast mouse moves.
  // NOVA.ui.svgDrag remains the only drag implementation; this only forwards missed
  // move/up events to its existing session. No shared core is modified.
  group.addEventListener('pointerdown',e=>{
   const active=N.ui._drag,id=e.pointerId;
   if(!active||active.el!==group)return;
   let ended=false;
   const cleanup=()=>{if(ended)return;ended=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);window.removeEventListener('keydown',key,true);};
   function move(q){if(ended)return;if(N.ui._drag!==active){cleanup();return;}if(q.pointerId!==id)return;
    if(q.target===group||group.contains(q.target))return;
    group.dispatchEvent(new PointerEvent('pointermove',{pointerId:id,pointerType:q.pointerType||'mouse',clientX:q.clientX,clientY:q.clientY,buttons:q.buttons,bubbles:false}));}
   function up(q){if(ended||q.pointerId!==id)return;
    if(N.ui._drag===active && q.target!==group && !group.contains(q.target))active.up(q);
    cleanup();}
   function cancel(){if(N.ui._drag===active)active.cancel();cleanup();}
   function key(e){if(e.key==='Escape')cancel();}
   window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);window.addEventListener('keydown',key,true);
  });
 }
 function addItem(svg,val,kind,x,y,w,h,L){
  const group=E('g',{'data-source':kind+'-'+val,tabindex:0,role:'button','aria-label':'Select '+val+' as a '+(kind==='rule'?'rule':'term')+' card'},svg);
  nbox(group,x,y,w,h,val,kind==='rule'?'focus':'given',small()?16:19);
  group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pickup(val,kind);}});
  group.addEventListener('click',()=>pickup(val,kind));
  N.ui.svgDrag(svg,group,{box:{x,y,w,h},zones:()=>[
    ...(kind==='rule'?[{x:L.w/2-(small()?66:92),y:L.ruleY-21,w:small()?132:184,h:49,id:'rule',kind:'drop'}]:[4,5].map(n=>({x:L.x(n-1),y:L.ty,w:L.cw,h:L.h,id:'term-'+n,kind:'drop'}))),
    {x:12,y:L.removeY,w:L.w-24,h:48,id:'remove',kind:'remove'}],
   onDrop:target=>place(target,String(val)),onRemove:()=>{},removeTo:{x:L.w/2,y:L.removeY+24}});
  reinforceFastDrag(group);
 }
 function addPlaced(svg,slot,val,L){
   let x,y,w,h;if(slot==='rule'){x=L.w/2-(small()?66:92);y=L.ruleY-21;w=small()?132:184;h=49;}
   else{x=L.x(Number(slot.split('-')[1])-1);y=L.ty;w=L.cw;h=L.h;}
   const g=E('g',{'data-placed':slot,tabindex:0,role:'button','aria-label':val+' placed at '+friendly(slot)+'. Delete to remove.'},svg);
   nbox(g,x,y,w,h,val,'result',small()?20:25);
   g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(slot);}});
   N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[{x:12,y:L.removeY,w:L.w-24,h:48,id:'remove',kind:'remove'}],onDrop:()=>false,onRemove:()=>remove(slot),removeTo:{x:L.w/2,y:L.removeY+24}});
  reinforceFastDrag(g);
 }
 function drawChallenge(){
  if(!challengeStage)return;const t=tasks[task],stage=challengeStage;reset(stage);const svg=svgRoot('Complete two position-to-term cells by dragging number cards. Select the correct algebra rule for the rule slot.',true);
  const L=putGraphic(svg,{a:t.a,b:t.b,title:'COMPLETE THE TABLE',subtitle:'Position n determines the value in the term row.',visible:5,mapping:'all',blankCells:[4,5],ruleText:null,onCell:n=>keyboardDrop('term-'+n),onRule:()=>keyboardDrop('rule')});
  // Cover the unknown labels with correctly placed, removable cards.
  Object.entries(placed).forEach(([slot,val])=>addPlaced(svg,slot,val,L));
  txt(svg,L.w/2,L.poolRuleY-12,'CHOOSE THE RULE',small()?16:19,'support');
  const rp=small()?27:120,rw=small()?94:156,rGap=small()?10:25;
  t.rules.forEach((v,i)=>addItem(svg,v,'rule',rp+i*(rw+rGap),L.poolRuleY,rw,40,L));
  txt(svg,L.w/2,L.poolTermY-12,'CHOOSE TERM VALUES',small()?16:19,'support');
  const vp=small()?13:50,vw=small()?49:93,vGap=small()?8:21;
  t.choices.forEach((v,i)=>addItem(svg,String(v),'term',vp+i*(vw+vGap),L.poolTermY,vw,37,L));
  // Removal zone is always present and is NOT a custom backdrop.
  N.neonBox(svg,12,L.removeY,L.w-24,48,{role:'error',text:'REMOVE / RESET',size:small()?17:20,r:14});
  const cards=[side('FILLED CELLS',Object.keys(placed).filter(k=>k.startsWith('term-')).length+' / 2'),side('RULE CARD',placed.rule||'Not placed','focus'),note('CHECK THE MATHEMATICS','Each column maps a POSITION on top to the TERM VALUE below. Use exactly one rule for all columns.')];
  wrap(stage,svg,cards,placed.rule&&placed['term-4']&&placed['term-5']?'celebrate':'think','Choose a rule that works for every column, then match each missing term.');
 }
 function challengeLoad(){let t=tasks[task];challengeComplete=false;resetChallenge();challengePanel.querySelector('.f903-taskhead').textContent=t.title;
  challengePanel.querySelector('.f903-instruction').textContent='Fill the two missing term cells and the rule. Drag the cards or select a card then its slot with Enter.';
  const buttons=challengePanel.querySelector('.f903-controls');buttons.innerHTML='';
  buttons.append(btn('Check all three',()=>{
    if(placed.rule!==t.rule||placed['term-4']!==String(t.correct[0])||placed['term-5']!==String(t.correct[1])){
      challengeApi.check(false,'You need the correct rule and both missing terms before checking.',{task});return;
    }
    challengeApi.check(true,'Correct. The same nth-term rule works for every position.',{task,score:task+1});
    N.moment&&N.moment(document.getElementById(id),'correct',{ms:1000});
    if(task===2){challengeComplete=true;challengePanel.querySelector('.f903-taskhead').textContent='All three tables completed';challengePanel.querySelector('.f903-instruction').textContent='You mapped positions directly to terms using three different linear rules.';
     buttons.replaceChildren(H('div',{class:'f903-maths f903-maths--gold',text:'3 / 3 · Position to term secured'}));return;}
    buttons.append(btn('Continue to challenge '+(task+2),()=>{task++;challengeLoad();},'nova-btn primary'));
   },'nova-btn primary'),btn('Reset cards',()=>{resetChallenge();drawChallenge();},'nova-btn ghost'),btn('Hint',()=>challengeApi.hint(t.hint),'nova-btn ghost'));
  ev('challengeTask',task);drawChallenge();
 }
 const def={id,title:'Position-to-term table',config:C,
  alt:'A two-row position-to-term mapping table. Positions one through five map down to terms using a single linear nth-term rule.',
  staticAlt:'Rule two n plus three gives position one term five, position two term seven, position three term nine, position four term eleven and position five term thirteen.',
  steps:steps.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
  render(i,stage){renderLearning(Math.min(i,steps.length-1),stage);},
  exploreIntro:'Change the coefficient, adjustment or position and watch the two-row table update.',
  explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();explore={a:2,b:3,n:4}; window.NovaLessonComponent?.applyExploreModels();const label=H('p',{class:'f903-instruction',text:'Change the coefficient and adjustment. Every position must use the same formula.'});
   window.NovaLessonComponent?.applyExploreModels();const sliders=H('div',{class:'f903-controls'});
   window.NovaLessonComponent?.applyExploreModels();const a=H('input',{type:'range',min:1,max:5,step:1,value:2,'aria-label':'Multiplier a'}),b=H('input',{type:'range',min:-5,max:8,step:1,value:3,'aria-label':'Adjustment b'}),n=H('input',{type:'range',min:1,max:12,step:1,value:4,'aria-label':'Target position n'}),out=H('output',{text:''});
   window.NovaLessonComponent?.applyExploreModels();function draw(){explore={a:+a.value,b:+b.value,n:+n.value};reset(stage);const svg=svgRoot('Position to term table with rule '+rule(explore.a,explore.b));putGraphic(svg,{a:explore.a,b:explore.b,mapping:'all',visible:5,title:'TEST THE NTH-TERM RULE',subtitle:'Change the parameters, then choose any position.'});
    txt(svg,W()/2,small()?568:556,'Position '+explore.n+'  →  '+explore.a+' × '+explore.n+(explore.b>=0?' + ':' − ')+Math.abs(explore.b)+' = '+value(explore.a,explore.b,explore.n),small()?17:22,'result');
    wrap(stage,svg,[side('RULE',rule(explore.a,explore.b),'focus'),side('POSITION',explore.n),side('RESULT',value(explore.a,explore.b,explore.n)),note('NOTICE','The top row is the position, not the term. Substitute n into your selected rule to calculate its value.')],'point-down','Follow the arrow from the position through the rule to the term.');
    out.textContent='Rule '+rule(explore.a,explore.b)+'  ·  T('+explore.n+') = '+value(explore.a,explore.b,explore.n);
    ev('coefficient',explore.a);ev('offset',explore.b);ev('position',explore.n);ev('term',value(explore.a,explore.b,explore.n));}
   window.NovaLessonComponent?.applyExploreModels();for(const item of [a,b,n])item.addEventListener('input',draw);
   window.NovaLessonComponent?.applyExploreModels();sliders.append(H('label',{},['Multiplier ',a]),H('label',{},['Adjustment ',b]),H('label',{},['Position ',n]),out,btn('Reset',()=>{a.value=2;b.value=3;n.value=4;draw();},'nova-btn ghost'));
   window.NovaLessonComponent?.applyExploreModels();panel.append(label,sliders);window.NovaLessonComponent?.applyExploreModels();draw();
  },
  challenge(panel,api,stage){task=0;challengePanel=panel;challengeApi=api;challengeStage=stage;
   panel.append(H('h3',{class:'f903-taskhead'}),H('p',{class:'f903-instruction'}),H('div',{class:'f903-controls'}),H('p',{class:'f903-feedback',role:'status','aria-live':'polite'}));challengeLoad();
  },
  onRestore(){explore={a:2,b:3,n:4};task=0;resetChallenge();challengePanel=null;challengeApi=null;challengeStage=null;}
 };
 N.registry.add({id,title:'Position-to-term table',topics:['sequence','nth term','linear rule','position-to-term'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F0-15']});
 
/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"steps":()=>steps,"tasks":()=>tasks},draws:{"reset":["stage"],"wrap":["stage","svg","cards","pose","caption"]},exploreFields:{}});
N.bankMount({id,num:'03',title:'Position-to-term table · Premium Edition',def,linked:['F9-01','F9-02','F9-05','F9-12'],years:'Y7-037 Nth term of a linear sequence; Year 8 recap / GCSE bridge',spec:{
  purpose:'Map position n to term T(n) with a single nth-term linear rule, distinguishing the position from the term value.',
  params:'Five-column table, n=1–12, coefficient a=1–5, adjustment b=−5 to 8, T(n)=an+b.',
  presets:'Y7-037 Nth term of a linear sequence (2n+3); challenge variants 3n−2 and 4n+1.',
  steps:'Name position → reveal rule → calculate first term → complete columns → jump to tenth term → generalise coefficient and adjustment.',
  interactions:'Watch / Guided stages, Explore multiplier/adjustment/position sliders, Challenge card drag into two term cells and rule slot, keyboard placement, removal and reset.',
  traps:'Confusing position with value, omitting the adjustment, switching addition/subtraction, off-by-one, swapping table columns.',
  gcse:'Bridge to algebraic nth-term derivations (F9-05), graphs (F9-04), and linear-function tables.'
 }});
 window.F903_ENGINE=N.engines[id];
 const card=document.getElementById(id),spec=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
 [...card.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>spec.appendChild(x));card.appendChild(spec);
 const gc=card.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
 const patchBobAlt=()=>card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});patchBobAlt();new MutationObserver(patchBobAlt).observe(card,{childList:true,subtree:true});
})();
