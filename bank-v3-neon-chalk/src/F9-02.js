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

/* F9-02 · Term-to-term animator · NOVA Neon + Chalk. */
const F902_CONFIG={
 id:'F9-02',family:'F9',startMode:'watch',preset:'Y7-036-sequence-structure',
 presets:{
  'Y7-036-sequence-structure':{label:'Year 7 · +3 pattern',type:'arith',a1:4,step:3,terms:5,focus:'Term-to-term rule'},
  'Y8-019-arithmetic-sequences':{label:'Year 8 · −5 pattern',type:'arith',a1:30,step:-5,terms:5,focus:'Arithmetic sequence'},
  'Y8-020-geometric-sequences':{label:'Year 8 · ×2 pattern',type:'geom',a1:3,ratio:2,terms:5,focus:'Geometric sequence'}
 },
 events:{value:['preset','term','rule','challengeTask','placed'],types:['step','correct','hintUsed','mode']}
};
(function(){'use strict';
const N=window.NOVA,C=window.NovaV2Integration.configuration(F902_CONFIG),E=N.svg.el,H=N.h,id=C.id;
const isSmall=()=>window.innerWidth<=760;
const speech=[
 {name:'notice-terms',preset:'Y7-036-sequence-structure',pose:'explain',skin:'pip',text:'Look at the terms: four, seven, ten. Something is repeating.',prompt:'What changes from one term to the next?'},
 {name:'reveal-hop',preset:'Y7-036-sequence-structure',pose:'point-right',skin:'pip',text:'From four to seven, and seven to ten, we add three each time.',prompt:'Say the term-to-term rule out loud.'},
 {name:'predict-next',preset:'Y7-036-sequence-structure',pose:'idea',skin:'pip',text:'If the rule is add three, the next term after ten is thirteen.',prompt:'Predict the next term before it appears.'},
 {name:'decreasing',preset:'Y8-019-arithmetic-sequences',pose:'think',skin:'pip',text:'A term-to-term rule can also decrease. Here the sequence goes down by five.',prompt:'How do you know the rule is subtract five?'},
 {name:'geometric',preset:'Y8-020-geometric-sequences',pose:'point-right',skin:'nova',text:'Some sequences multiply. Three, six, twelve, twenty-four doubles each time.',prompt:'What makes this different from an arithmetic sequence?'},
 {name:'compare',preset:'Y8-020-geometric-sequences',pose:'celebrate',skin:'pip',text:'Arithmetic sequences add or subtract a fixed amount. Geometric sequences multiply by a fixed factor.',prompt:'Compare add three, subtract five and multiply by two.'}
];
let active=0,currentPreset='Y7-036-sequence-structure',exploreVisible=4,challengeIndex=0;
let challengeState={rule:null,term:null};
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9 event '+key);N.events.emit('value',{engine:id,key,value});}
function seqValue(preset,n){return preset.type==='arith'?preset.a1+(n-1)*preset.step:preset.a1*Math.pow(preset.ratio,n-1);} 
function ruleLabel(preset){if(preset.type==='arith'){return (preset.step>=0?'+':'−')+Math.abs(preset.step);}return '×'+preset.ratio;}
function nextValue(preset,visible){return seqValue(preset,visible+1);} 
function txt(p,x,y,t,size=22,role='given',anchor='middle'){return N.chalkText(p,x,y,String(t),{size,role,anchor});}
function box(p,x,y,w,h,role='given',text=null,size=20){return N.neonBox(p,x,y,w,h,{role,text,size,r:11});}
function hbtn(t,fn,cls='nova-btn'){return H('button',{class:cls,text:t,onclick:fn});}
function stateRoot(alt){let sm=isSmall();let svg=N.svg.root(sm?430:760,sm?520:440,alt);svg.setAttribute('class','nv-svg f902-svg');svg.setAttribute('role','img');return svg;}
function reset(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("reset",arguments);}
stage.innerHTML='';N.cap(stage,'Sequence workshop','Term-to-term animator');}
function sideCard(label,text,cls=''){return H('div',{class:'f902-card '+cls},[H('div',{class:'f902-eyebrow',text:label}),H('div',{class:'f902-maths',text})]);}
function node(svg,x,y,val,role='given',r=16){N.neonRing(svg,x,y,{role,r,pulse:false});txt(svg,x,y+6,val,18,role);} 
function sequenceCoords(W,count){let pad=isSmall()?44:78; let gap=(W-2*pad)/(count-1); return Array.from({length:count},(_,i)=>pad+i*gap);} 
function drawSequence(svg,preset,o={}){
 const W=isSmall()?430:760,sm=isSmall(),baseY=sm?212:198,count=o.count||5,xs=sequenceCoords(W,count);
 if(o.title)txt(svg,W/2,50,o.title,sm?23:26,'support');
 if(o.subtitle)txt(svg,W/2,84,o.subtitle,sm?16:18,'support');
 for(let i=0;i<count-1;i++){
   const label=(o.showRule && i<Math.max(1,(o.visible||count)-1))?ruleLabel(preset):(o.showBlanks?'?':'');
   let role=o.showRule?'focus':'support';
   let hop=N.svg.hop(svg,xs[i]+18,xs[i+1]-18,baseY-40,{role,label:label||null,height:sm?54:64});
   if(o.ruleZone && i===1){ // central rule zone over second hop
     const rx=(xs[i]+xs[i+1])/2-46, ry=hop.peak-20, rw=92,rh=36;
     if(!challengeState.rule){
       E('rect',{x:rx,y:ry,width:rw,height:rh,rx:18,fill:'transparent','class':'f902-dropbtn','data-slot':'rule',tabindex:'0',role:'button','aria-label':'Place the rule on the hop'},svg)
         .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();}});
       N.neonBox(svg,rx,ry,rw,rh,{role:'unknown',text:'Drop rule',size:13,r:18});
     }
   }
 }
 for(let i=0;i<count;i++){
   const show=i < (o.visible||count);
   if(o.hideLast && i===count-1){
     N.neonRing(svg,xs[i],baseY,{role:'unknown',r:18,pulse:false});
     if(o.termZone){
       const rw=62,rh=42,rx=xs[i]-rw/2,ry=baseY+34;
       if(!challengeState.term){
         N.neonBox(svg,rx,ry,rw,rh,{role:'unknown',text:'Next',size:14,r:14});
         E('rect',{x:rx,y:ry,width:rw,height:rh,rx:14,fill:'transparent','class':'f902-dropbtn','data-slot':'term',tabindex:'0',role:'button','aria-label':'Place the next term'},svg)
           .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();}});
       }
     } else txt(svg,xs[i],baseY+7,'?',19,'support');
   } else if(show){
     node(svg,xs[i],baseY,seqValue(preset,i+1), i===o.highlightIndex?'focus':'given', sm?14:16);
     txt(svg,xs[i],baseY+39,'Term '+(i+1),12,'support');
   } else {
     N.neonRing(svg,xs[i],baseY,{role:'support',r:18,pulse:false}); txt(svg,xs[i],baseY+7,'…',18,'support');
   }
 }
 return {xs,baseY};
}
function renderLearning(step,stage){
 const info=speech[Math.min(step,speech.length-1)],preset=C.presets[info.preset],visible=step<2?3:4;
 currentPreset=info.preset; ev('preset',currentPreset); reset(stage);
 const sm=isSmall(),svg=stateRoot('Terms in a sequence connected by hops labelled with a term-to-term rule.');
 const note=step===0?'Spot the change':step===1?'Each hop shows the same rule':step===2?'Use the rule to predict the next term':step===3?'The terms decrease by five':step===4?'Each term doubles': 'Compare the three rule types';
 drawSequence(svg,preset,{title:preset.label,subtitle:note,visible,showRule:step>0,showBlanks:false,highlightIndex:Math.min(2,visible-1)});
 if(step===2){ N.svg.pill(svg,(isSmall()?430:760)/2,355,'Next term = '+nextValue(preset,3),{role:'result',size:18}); }
 if(step===5){
   const W=isSmall()?430:760;
   N.svg.pill(svg,W*.25,352,'+3',{role:'focus',size:18});
   N.svg.pill(svg,W*.5,352,'−5',{role:'focus',size:18});
   N.svg.pill(svg,W*.75,352,'×2',{role:'focus',size:18});
   txt(svg,W/2,394,'Same idea: one fixed rule from term to term',sm?16:18,'support');
 }
 const side=H('aside',{class:'f902-side'});
 side.appendChild(sideCard('RULE',ruleLabel(preset), 'f902-card--gold'));
 side.appendChild(sideCard('NEXT TERM',String(nextValue(preset,visible-1))));
 side.appendChild(H('div',{class:'f902-card f902-card--full'},[
   H('div',{class:'f902-eyebrow',text:'WHAT TO NOTICE'}),
   H('div',{class:'f902-body',text:step<4?'The same change happens between every pair of terms.':'Multiplying by two is different from adding a fixed amount.'})
 ]));
 stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));
 N.scene.helperStrip(stage,info.pose,info.text);
 if(!N.reducedMotion()){
   const hops=[...svg.querySelectorAll('.nv-hop')];
   hops.forEach((el,i)=>{el.style.opacity='0.12'; N.motion.tween(260+120*i,v=>{el.style.opacity=String(.12+.88*v);},N.motion.ease.out);});
 }
}
function renderExplore(stage,panel){
if(window.NovaLessonComponent?.active){[stage,panel]=window.NovaLessonComponent.args("renderExplore",arguments);}

 reset(stage); const preset=C.presets[currentPreset],svg=stateRoot('Explore different term-to-term rules and sequence types.');
 drawSequence(svg,preset,{title:preset.label,subtitle:'Use the preset buttons and slider to compare rules',visible:exploreVisible,showRule:true});
 const side=H('aside',{class:'f902-side'},[
   sideCard('TYPE',preset.type==='arith'?(preset.step>=0?'Arithmetic ↑':'Arithmetic ↓'):'Geometric','f902-card--gold'),
   sideCard('RULE',ruleLabel(preset)),
   sideCard('NEXT TERM',String(nextValue(preset,exploreVisible))),
   H('div',{class:'f902-card f902-card--full'},[H('div',{class:'f902-eyebrow',text:'THINK LIKE BOB'}),H('div',{class:'f902-body',text:preset.type==='arith'?'Compare one term with the next and check that the same amount is added or subtracted each time.':'Check whether each term is multiplied by the same factor.'})])
 ]);
 stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));
 N.scene.helperStrip(stage,preset.type==='geom'?'idea':'point-right',preset.type==='geom'?'This one multiplies each time.':'A term-to-term rule is the same for every hop.');
}
function taskData(i){
 return [
  {preset:'Y7-036-sequence-structure', seqVisible:4, correctRule:'+3', correctTerm:'16', ruleChoices:['+3','+4','×2'], termChoices:['16','15','17'], misconception:{'+4':'That would jump too far. Seven to ten is +3, not +4.','×2':'This sequence is not doubling; it adds the same amount each time.','15':'Add 3 to 13 once more.','17':'You have gone one jump too far.'}, title:'01 · Arithmetic rule and next term', guide:'Sequence: 4, 7, 10, 13, … Drag the correct rule onto the hop and the next term onto the final node.'},
  {preset:'Y8-019-arithmetic-sequences', seqVisible:4, correctRule:'−5', correctTerm:'10', ruleChoices:['−5','+5','÷5'], termChoices:['10','15','5'], misconception:{'+5':'The sequence is decreasing, not increasing.','÷5':'Dividing by 5 would give 6, not 25.','15':'Subtract five again from 15 to get the next term.','5':'That is two steps ahead.'}, title:'02 · Decreasing arithmetic sequence', guide:'Sequence: 30, 25, 20, 15, … Show the subtract-five rule and the next term.'},
  {preset:'Y8-020-geometric-sequences', seqVisible:4, correctRule:'×2', correctTerm:'24', ruleChoices:['×2','+6','+12'], termChoices:['24','18','30'], misconception:{'+6':'The increases are not constant; 6 to 12 is also doubling.','+12':'Adding 12 only works once here. The rule must work every time.','18':'Double 12 to get the next term.','30':'That is too large for one more step.'}, title:'03 · Geometric sequence', guide:'Sequence: 3, 6, 12, … Show the multiply-by-two rule and the next term.'}
 ][i];
}
function clearSlot(slot){challengeState[slot]=null; ev('placed',{slot,value:null});}
function setSlot(slot,value){challengeState[slot]=value; ev('placed',{slot,value});}
function tryPlace(slot,value,api){const t=taskData(challengeIndex); const expected=slot==='rule'?t.correctRule:t.correctTerm; if(value!==expected){api.check(false,t.misconception[value]||'Try again.',{task:challengeIndex,slot,value}); return false;} setSlot(slot,value); return true;}
function challengeTrayItem(svg,opt,slot,x,y,w,h,api){
 const g=E('g',{tabindex:0,role:'button','aria-label':'Choose '+opt+' for the '+slot},svg);
 N.neonBox(g,x,y,w,h,{role:slot==='rule'?'focus':'given',text:opt,size:isSmall()?15:17,r:16});
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); tryPlace(slot,opt,api)&&drawChallenge(api._stage,api);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=> slot==='rule'?[{x:api._ruleZone.x,y:api._ruleZone.y,w:api._ruleZone.w,h:api._ruleZone.h,id:'rule',kind:'drop'},{x:api._removeZone.x,y:api._removeZone.y,w:api._removeZone.w,h:api._removeZone.h,id:'remove',kind:'remove'}]:[{x:api._termZone.x,y:api._termZone.y,w:api._termZone.w,h:api._termZone.h,id:'term',kind:'drop'},{x:api._removeZone.x,y:api._removeZone.y,w:api._removeZone.w,h:api._removeZone.h,id:'remove',kind:'remove'}],
   onDrop:(id)=>{if(id!==slot)return false; const ok=tryPlace(slot,opt,api); if(ok)drawChallenge(api._stage,api); return ok;},
   onRemove:()=>false, removeTo:{x:api._removeZone.x+api._removeZone.w/2,y:api._removeZone.y+api._removeZone.h/2}
 });
}
function placedItem(svg,label,slot,x,y,w,h,api){
 const g=E('g',{tabindex:0,role:'button','aria-label':label+'. Press Delete to remove.'},svg);
 N.neonBox(g,x,y,w,h,{role:'result',text:label,size:isSmall()?15:17,r:16});
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault(); clearSlot(slot); drawChallenge(api._stage,api);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[{x:api._removeZone.x,y:api._removeZone.y,w:api._removeZone.w,h:api._removeZone.h,id:'remove',kind:'remove'}],onDrop:()=>false,onRemove:()=>{clearSlot(slot); drawChallenge(api._stage,api);},removeTo:{x:api._removeZone.x+api._removeZone.w/2,y:api._removeZone.y+api._removeZone.h/2}});
}
function drawChallenge(stage,api){
if(window.NovaLessonComponent?.active){[stage,api]=window.NovaLessonComponent.args("drawChallenge",arguments);}

 api._stage=stage; reset(stage); const t=taskData(challengeIndex), preset=C.presets[t.preset], sm=isSmall(), W=sm?430:760, svg=stateRoot(t.guide);
 const seq=drawSequence(svg,preset,{title:preset.label,subtitle:'Complete the rule and next term',visible:t.seqVisible,showRule:false,showBlanks:false,hideLast:true,ruleZone:true,termZone:true,count:5});
 api._ruleZone={x:(seq.xs[1]+seq.xs[2])/2-46,y:sm?82:72,w:92,h:36};
 api._termZone={x:seq.xs[4]-31,y:seq.baseY+34,w:62,h:42};
 api._removeZone={x:sm?20:180,y:sm?380:344,w:sm?390:390,h:78};
 if(challengeState.rule) placedItem(svg,challengeState.rule,'rule',api._ruleZone.x,api._ruleZone.y,api._ruleZone.w,api._ruleZone.h,api);
 if(challengeState.term) placedItem(svg,challengeState.term,'term',api._termZone.x,api._termZone.y,api._termZone.w,api._termZone.h,api);
 N.neonBox(svg,api._removeZone.x,api._removeZone.y,api._removeZone.w,api._removeZone.h,{role:'error',text:null,r:14});
 txt(svg,W/2,api._removeZone.y+18,'Drag here to remove · Keyboard: Enter to place, Delete to remove',sm?13:15,'support');
 txt(svg,sm?95:118,api._removeZone.y+49,'Rules',15,'focus');
 txt(svg,sm?95:118,api._removeZone.y+88,'Next terms',15,'given');
 const ruleY=api._removeZone.y+28, termY=api._removeZone.y+66, startX=sm?145:245, gap=sm?92:112;
 t.ruleChoices.forEach((opt,i)=>{if(challengeState.rule===opt) return; challengeTrayItem(svg,opt,'rule',startX+i*gap,ruleY,78,32,api);});
 t.termChoices.forEach((opt,i)=>{if(challengeState.term===opt) return; challengeTrayItem(svg,opt,'term',startX+i*gap,termY,78,32,api);});
 const side=H('aside',{class:'f902-side'},[
   sideCard('TARGET RULE',t.correctRule,'f902-card--gold'),
   sideCard('TARGET NEXT TERM',t.correctTerm),
   H('div',{class:'f902-card f902-card--full'},[H('div',{class:'f902-eyebrow',text:'COMMON TRAP'}),H('div',{class:'f902-body',text:challengeIndex===2?'Do not use addition just because the numbers are getting bigger.':'The term-to-term rule must work for every hop, not just one pair.'})])
 ]);
 stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));
 stage.appendChild(H('div',{class:'f902-evidence'},[
  H('span',{text:'Rule'}),H('span',{text:challengeState.rule||'?' }),H('span',{text:'Next'}),H('span',{class:'f902-next',text:challengeState.term||'?'})
 ]));
 N.scene.helperStrip(stage,preset.type==='geom'?'idea':'think',preset.type==='geom'?'Multiplying by the same amount is a geometric rule.':'Look for the same change each time.');
 }
const def={id,title:'Term-to-term animator',config:C,
 alt:'Sequence terms are connected by hops labelled with a rule such as +3, −5 or ×2. The next term follows the same term-to-term rule.',
 staticAlt:'Examples compare arithmetic and geometric sequences using repeated term-to-term rules.',
 steps:speech.map((d,i)=>({name:d.name,narration:d.text,prompt:d.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){active=Math.min(i,speech.length-1); renderLearning(active,stage);},
 exploreIntro:'Compare arithmetic and geometric sequences using reusable term-to-term rules.',
 explore(panel,stage,api){
   window.NovaLessonComponent?.applyExploreModels();currentPreset='Y7-036-sequence-structure'; window.NovaLessonComponent?.applyExploreModels();exploreVisible=4;
   window.NovaLessonComponent?.applyExploreModels();const start=H('p',{class:'f902-instruction',text:'Pick a preset, then change how many terms you can see. Compare the rule and the next term.'});
   window.NovaLessonComponent?.applyExploreModels();const presetBar=H('div',{class:'f902-presetbar'});
   window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,p])=>presetBar.appendChild(hbtn(p.label,()=>{currentPreset=key; renderExplore(stage,panel); ev('preset',key);},'nova-btn ghost')));
   window.NovaLessonComponent?.applyExploreModels();const slide=H('input',{type:'range',min:'3',max:'5',value:'4','aria-label':'Visible terms from 3 to 5'}),out=H('output',{class:'f902-micro',text:'Visible terms: 4'});
   window.NovaLessonComponent?.applyExploreModels();function redraw(){out.textContent='Visible terms: '+exploreVisible; renderExplore(stage,panel); ev('term',exploreVisible);} 
   window.NovaLessonComponent?.applyExploreModels();slide.addEventListener('input',()=>{exploreVisible=Number(slide.value); redraw();});
   window.NovaLessonComponent?.applyExploreModels();panel.append(start,presetBar,H('div',{class:'f902-control'},[H('label',{},['Terms ',slide]),out,hbtn('Next preset',()=>{const ks=Object.keys(C.presets);let idx=(ks.indexOf(currentPreset)+1)%ks.length; currentPreset=ks[idx]; renderExplore(stage,panel);},'nova-btn primary')]));
   window.NovaLessonComponent?.applyExploreModels();redraw();
 },
 challenge(panel,api,stage){
   challengeIndex=0; challengeState={rule:null,term:null};
   const header=H('h3',{class:'f902-taskhead'}),guide=H('p',{class:'f902-instruction'}),controls=H('div',{class:'f902-control'}),status=H('p',{class:'f902-status',role:'status'});
   function load(){ const t=taskData(challengeIndex); header.textContent=t.title; guide.textContent=t.guide; controls.innerHTML=''; api.fb.textContent=''; api.fb.className='nova-fb';
     controls.append(hbtn('Check answer',()=>{
       if(challengeState.rule!==t.correctRule || challengeState.term!==t.correctTerm){
         api.check(false, !challengeState.rule||!challengeState.term ? 'Place both the rule and the next term first.' : 'One or both choices are still wrong. Recheck the pattern.',{task:challengeIndex}); return;
       }
       api.check(true, challengeIndex===2?'Correct. ×2 gives the next term 24.':'Correct. The same term-to-term rule works across the whole sequence.',{task:challengeIndex,score:challengeIndex+1});
       if(challengeIndex===2){ header.textContent='All three challenges complete'; guide.textContent='You identified increasing, decreasing and multiplicative sequence rules.'; controls.replaceChildren(H('p',{class:'f902-maths f902-maths--gold',text:'3 / 3 · Rules secured'})); N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100}); return; }
       controls.append(hbtn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++; challengeState={rule:null,term:null}; load();},'nova-btn primary'));
     },'nova-btn primary'), hbtn('Reset placements',()=>{challengeState={rule:null,term:null}; drawChallenge(stage,api);},'nova-btn ghost'), hbtn('Hint',()=>{api.hint(challengeIndex===2?'Check whether each term doubles.':'Compare one term with the next, then use the same step again.');},'nova-btn ghost'));
     drawChallenge(stage,api); ev('challengeTask',{index:challengeIndex});
   }
   panel.append(header,guide,controls,status); load();
 },
 onRestore(){currentPreset='Y7-036-sequence-structure'; exploreVisible=4; challengeIndex=0; challengeState={rule:null,term:null};}
};
N.registry.add({id,title:'Term-to-term animator',topics:['sequences','term-to-term','arithmetic sequences','geometric sequences'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"speech":()=>speech},draws:{"reset":["stage"],"renderExplore":["stage","panel"],"drawChallenge":["stage","api"]},exploreFields:{}});
N.bankMount({id,num:'02',title:'Term-to-term animator · Premium Edition',def,linked:['F9-01','F9-03','F9-04','F9-05'],years:'Year 7 and Year 8 sequences, GCSE bridge',spec:{
 purpose:'Recognise and apply term-to-term rules in arithmetic and geometric sequences, then predict the next term.',
 params:'Arithmetic +3, arithmetic −5, geometric ×2; visible terms 3–5; next-term prediction linked to the rule.',
 presets:'Y7-036 Sequence rules and structure; Y8-019 Arithmetic sequences; Y8-020 Geometric sequences.',
 steps:'Notice terms → reveal hop rule → predict next term → decreasing sequence → geometric sequence → compare rule types.',
 interactions:'Watch, Guided, Explore preset buttons and slider, Challenge drag-and-drop rule and next-term cards with keyboard placement/removal.',
 traps:'Using the wrong operation, using a rule that works only once, treating geometric sequences like additive patterns, jumping too many steps.',
 gcse:'Bridge to nth term and special-sequence work; links to F9-03, F9-04 and F9-05.'
}});
window.F902_ENGINE=N.engines[id];
const card=document.getElementById(id),spec=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...card.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>spec.appendChild(x));card.appendChild(spec);
const gc=card.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const patchBobAlt=()=>card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});patchBobAlt();new MutationObserver(patchBobAlt).observe(card,{childList:true,subtree:true});
})();
