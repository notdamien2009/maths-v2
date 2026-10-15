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

/* F9-06 Geometric Sequence | inherited NOVA F0/F1/F2/F9-01 v3 visuals, no local shell/mascot overrides. */
const F906_CONFIG={id:'F9-06',family:'F9',startMode:'watch',preset:'Y8-020-geometric-sequences',presets:{
 'Y8-020-geometric-sequences':{label:'Y8 · Doubling',a:2,r:2,terms:5,rule:'×2',context:'Geometric sequences'},
 'Y9-014-exponential-decay':{label:'Y9 · Halving',a:64,r:0.5,terms:5,rule:'÷2',context:'Exponential decay'},
 'Y9-014-exponential-growth':{label:'Y9 · Tripling',a:2,r:3,terms:5,rule:'×3',context:'Exponential growth'}
 },events:{value:['preset','position','ratio','term','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,C=window.NovaV2Integration.configuration(F906_CONFIG),H=N.h,E=N.svg.el,id=C.id;
const small=()=>window.innerWidth<=760,WIDTH=()=>small()?430:760,term=(p,n)=>p.a*Math.pow(p.r,n-1);
const steps=[
 {name:'see-the-first-term',pose:'explain',text:'Start with two. That is term one, not the amount we add each time.',prompt:'Read the first value. What could make it grow?'},
 {name:'multiply-once',pose:'point-right',text:'Multiply two by two to reach four. The bar doubles.',prompt:'Why does multiplication give the next bar?'},
 {name:'multiply-again',pose:'count',text:'Multiply by two again. Four becomes eight.',prompt:'What operation stays the same?'},
 {name:'keep-the-ratio',pose:'think',text:'Every step doubles: two, four, eight, sixteen, thirty-two. The jumps get bigger, but the multiplier is unchanged.',prompt:'Do we add the same number each time?'},
 {name:'halving-contrast',pose:'point-right',text:'Geometric sequences can shrink too. Sixty-four divided by two becomes thirty-two, then sixteen, then eight.',prompt:'How can you tell that each value is halved?'},
 {name:'generalise-the-growth',pose:'celebrate',text:'The next term is found by multiplying by the same factor each time. For doubling, term n is two times two to the power n minus one.',prompt:'Explain why a fixed multiplier is not the same as a fixed difference.'}
];
let presetKey='Y8-020-geometric-sequences',visible=5,challengeIndex=0,placed={},kbChoice=null,stageRef=null,panelRef=null,apiRef=null;
const TASKS=[
 {title:'01 · Double the sequence',guide:'Sequence 3, 6, 12, 24, … Choose the common ratio and the next term.',a:3,r:2,ratio:'×2',next:'48',ratios:['×2','+3','×3'],terms:['48','27','36'],traps:{' +3':'The sequence is not adding a fixed amount.','+3':'Three to six adds three, but six to twelve adds six. The addition changes.','×3':'Three multiplied by three is nine, not six.','27':'Adding three again does not continue the doubling.','36':'Adding twelve is not the rule for every step.','48':'Correct.'}},
 {title:'02 · Multiply by three',guide:'Sequence 2, 6, 18, 54, … Place the common ratio and term five.',a:2,r:3,ratio:'×3',next:'162',ratios:['×3','+4','×2'],terms:['162','58','108'],traps:{'+4':'The increase from 6 to 18 is twelve, not four.','×2':'Two doubled is four, not six.','58':'Adding four does not continue the pattern.','108':'This is twice fifty-four. We need three times fifty-four.'}},
 {title:'03 · A sequence that halves',guide:'Sequence 64, 32, 16, 8, … Drag the shrinking rule and fifth term.',a:64,r:.5,ratio:'÷2',next:'4',ratios:['÷2','−8','×2'],terms:['4','0','16'],traps:{'−8':'Sixty-four to thirty-two is a decrease of thirty-two, not eight.','×2':'Multiplying by two grows the terms. These bars shrink.','0':'Subtracting eight works once only, not for the full sequence.','16':'That repeats the third term. Halve eight to find the fifth.'}}
];
function event(key,value){if(!C.events.value.includes(key))throw Error('Unknown F906 event '+key);N.events.emit('value',{engine:id,key,value});}
function text(svg,x,y,s,size=20,role='given',anchor='middle'){return N.chalkText(svg,x,y,String(s),{size,role,anchor});}
function box(svg,x,y,w,h,s,role='given',size=20){return N.neonBox(svg,x,y,w,h,{role,text:s,size,r:12});}
function btn(label,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:label,onclick:fn});}
function root(alt,challenge=false){let svg=N.svg.root(WIDTH(),challenge?925:795,alt);svg.setAttribute('role','img');svg.setAttribute('class','nv-svg f906-svg');return svg;}
function clear(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("clear",arguments);}
stage.replaceChildren();N.cap(stage,'Sequence workshop','Geometric sequence');}
function card(label,val,gold=false){const math=H('div',{class:'f906-maths'+(gold?' f906-maths--gold':'')});math.appendChild(typeof val==='string'||typeof val==='number'?document.createTextNode(String(val)):val);return H('div',{class:'f906-card'+(gold?' f906-card--gold':'')},[H('div',{class:'f906-eyebrow',text:label}),math]);}
function note(label,val){return H('div',{class:'f906-card f906-card--full'},[H('div',{class:'f906-eyebrow',text:label}),H('div',{class:'f906-body',text:String(val)})]);}
function mount(stage,svg,cards,pose,say){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,say]=window.NovaLessonComponent.args("mount",arguments);}
stage.appendChild(H('div',{class:'f906-stage'},[svg,H('aside',{class:'f906-side'},cards)]));N.scene.helperStrip(stage,pose,say);}
function coords(){const w=WIDTH(),padding=small()?52:100,gap=(w-padding*2)/4;return Array.from({length:5},(_,i)=>padding+i*gap);}
/* Main visual: bars have true relative value within the sequence; the core neonBox provides glass edge, fill, glow and highlights. */
function drawBars(svg,p,count,options={}){
 let x=coords(),base=options.challenge?410:438;
 let max=0;for(let i=1;i<=5;i++)max=Math.max(max,term(p,i));
 let maxH=options.challenge?230:260,barW=small()?34:50;
 let actual=options.challenge?4:count;
 N.neonLine(svg,x[0]-35,base+3,x[4]+35,base+3,{role:'support',width:2});
 for(let i=0;i<5;i++){
    const k=i+1,v=term(p,k),shown=i<actual;
    if(shown){
      let h=Math.max(13,Math.round(maxH*v/max));
      let g=E('g',{'data-bar':String(k)},svg);
      N.neonBox(g,x[i]-barW/2,base-h,barW,h,{role:i===actual-1?'focus':'op',r:9});
      text(svg,x[i],base-h-18,String(v),small()?19:23,i===actual-1?'result':'given');
      text(svg,x[i],base+40,small()?'n = '+k:'Term '+k,small()?20:17,'support');
      if(!N.reducedMotion()&&i===actual-1&&options.animate){
        const g0=g,scale=h;N.motion.tween(470,(v)=>{if(g0.isConnected){g0.style.opacity=String(.08+.92*v);g0.setAttribute('transform','translate(0,'+(base*(1-v)).toFixed(1)+') scale(1,'+v.toFixed(3)+')');}},N.motion.ease.out,()=>g0.removeAttribute('transform'));
      }
    }else if(options.challenge&&i===4){
      N.neonRing(svg,x[i],base-32,{role:'unknown',r:17,pulse:false});
      text(svg,x[i],base-26,'?',small()?23:27,'focus');text(svg,x[i],base+40,small()?'n = 5':'Term 5',small()?20:17,'support');
    }else if(options.ghost){
      N.neonRing(svg,x[i],base-32,{role:'support',r:12,pulse:false});text(svg,x[i],base-26,'?',17,'support');text(svg,x[i],base+40,small()?'n = '+k:'Term '+k,small()?20:17,'support');
    }
 }
 if(options.hops){
  for(let i=0;i<Math.min(actual-1,4);i++){
    // All hops use the canonical NOVA.svg.hop primitive; maths sits BELOW the bar region with no overlaps.
    let hop=N.svg.hop(svg,x[i]+17,x[i+1]-17,base+123,{role:i===actual-2?'focus':'op',height:small()?48:57,label:options.hideRule?'?':p.rule});
    if(options.animate&&i===actual-2&&!N.reducedMotion()){hop.style.opacity='.12';N.motion.tween(440,v=>{if(hop.isConnected)hop.style.opacity=String(.12+.88*v);},N.motion.ease.out);}
  }
 }
 return {x,base};
}
function teach(idx,stage){
 const info=steps[Math.min(idx,steps.length-1)],isDecay=idx===4,
 p=C.presets[isDecay?'Y9-014-exponential-decay':'Y8-020-geometric-sequences'],
 count=idx===0?1:idx===1?2:idx===2?3:idx===3?5:idx===4?4:5;
 clear(stage);const svg=root('Glowing glass bars showing a geometric sequence; curved multiplication hops show the common ratio.');
 text(svg,WIDTH()/2,47,isDecay?'HALVE THE PREVIOUS TERM':'BUILD THE MULTIPLIER',small()?25:31,'support');
 text(svg,WIDTH()/2,87,['Begin with the first term','Multiply to make the next bar','Repeat the same operation','Every step doubles — no fixed addition','A constant ratio can make bars shrink','A fixed multiplier builds a geometric sequence'][idx],small()?16:19,'support');
 drawBars(svg,p,count,{hops:idx>0,ghost:idx<3,animate:true});
 if(idx===3)N.svg.pill(svg,WIDTH()/2,688,'×2 repeated · not +2',{role:'focus',size:small()?18:21});
 else if(idx===4)N.svg.pill(svg,WIDTH()/2,688,'÷2 each time',{role:'focus',size:small()?20:22});
 else if(idx===5){N.neonBox(svg,WIDTH()*.16,649,WIDTH()*.68,77,{role:'result',r:19});text(svg,WIDTH()/2-18,700,'T(n) = 2 × 2',small()?22:27,'result');text(svg,WIDTH()/2+(small()?76:97),676,'n−1',small()?15:17,'result');text(svg,WIDTH()/2,754,'n − 1 counts the number of multiplying steps',small()?17:18,'support');}
 else text(svg,WIDTH()/2,690,idx===0?'What could turn two into four?':idx===1?'Multiply again to predict term three.':idx===2?'The jumps grow: add two, then add four.':'What will happen on the next step?',small()?17:19,'support');
 const cards=[card('COMMON RATIO',idx===0?'Predict it':p.rule,idx>0),card('LATEST TERM',term(p,count)),note('LOOK CLOSELY',idx===4?'Every term is half the previous term. The same operation works for every hop.':idx===3?'The gaps increase by two, four, eight and sixteen; there is no constant difference.':'Read each value and use the same operation to build the next one.')];
 if(idx===5)cards.push(card('POSITION RULE',H('span',{},['2 × 2',H('sup',{text:'n−1'})]),true));
 mount(stage,svg,cards,info.pose,info.text);
}
function explore(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("explore",arguments);}

 const p=C.presets[presetKey];clear(stage);const svg=root('Explore growing and shrinking geometric sequences with true relative-height neon glass bars.');
 text(svg,WIDTH()/2,45,'COMPARE THE RATIOS',small()?25:30,'support');
 text(svg,WIDTH()/2,84,p.label+' · adjust how many terms are revealed',small()?16:19,'support');
 drawBars(svg,p,visible,{hops:true,ghost:true});
 N.svg.pill(svg,WIDTH()/2,687,'Each hop = '+p.rule,{role:'focus',size:small()?19:24});
 const next=term(p,visible+1);
 text(svg,WIDTH()/2,745,'Next term after '+term(p,visible)+' is '+next,small()?17:20,'result');
 const details=p.r<1?'Halving is division by two. A fixed fraction of the previous value is retained, so the bars shrink.':p.r===2?'Doubling increases by different amounts, but every hop multiplies by exactly two.':'Tripling is not adding three; each term is three times the previous one.';
 mount(stage,svg,[card('RATIO',p.rule,true),card('REVEALED',visible+' terms'),card('NEXT TERM',next),note('WHAT TO NOTICE',details)],p.r<1?'think':'idea',p.r<1?'Each hop halves the previous term.':'Multiplication remains the rule, even when the bars grow quickly.');
}
function task(){return TASKS[challengeIndex];}
const ruleZone=()=>({x:small()?43:176,y:595,w:small()?145:160,h:61,id:'ratio',kind:'drop'});
const termZone=()=>({x:small()?244:430,y:595,w:small()?145:160,h:61,id:'term',kind:'drop'});
const removeZone=()=>({x:small()?26:165,y:846,w:small()?378:430,h:52,id:'remove',kind:'remove'});
function status(s){let t=panelRef&&panelRef.querySelector('.f906-status');if(t)t.textContent=s;}
function diagnostic(kind,v){let t=task();if(v===(kind==='ratio'?t.ratio:t.next))return '';
 return t.traps[v]||(kind==='ratio'?'Check all three hops. The same multiplication or division must work each time.':'Apply the ratio once more to the last given term.');
}
function place(kind,v){const t=task(),expected=kind==='ratio'?t.ratio:t.next;
 if(v!==expected){apiRef.check(false,diagnostic(kind,v),{task:challengeIndex,slot:kind,answer:v});status('That choice does not work across the sequence.');return false;}
 placed[kind]=v;kbChoice=null;event('placed',{slot:kind,value:v});drawChallenge();status('Correct card placed. Check the other gap.');return true;
}
function remove(kind){delete placed[kind];kbChoice=null;event('placed',{slot:kind,value:null});drawChallenge();status('Removed. You can replace the card.');}
/* F0 drag uses pointer capture. Keep the same fast-pointer bridge proven on F9-05. */
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pointerId=e.pointerId;let done=false;
  const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
  function move(e){if(done)return;if(N.ui._drag!==drag){clean();return;}if(e.pointerId!==pointerId||g.contains(e.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons}));}
  function up(e){if(e.pointerId!==pointerId)return;if(N.ui._drag===drag&&drag.up)drag.up(e);clean();}
  function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
  window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function source(svg,kind,v,x,y,w,h){const g=E('g',{'data-source':kind+':'+v,tabindex:0,role:'button','aria-label':'Choose '+v+' for '+kind},svg);
 box(g,x,y,w,h,v,kind==='ratio'?'focus':'given',small()?17:20);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();kbChoice={kind,value:v};status('Selected '+v+'. Press Enter on the '+kind+' gap.');}});
 g.addEventListener('click',()=>{kbChoice={kind,value:v};status('Selected '+v+'. Press Enter on the '+kind+' gap.');});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[kind==='ratio'?ruleZone():termZone(),removeZone()],onDrop:(id)=>id===kind?place(kind,v):false,onRemove:()=>{kbChoice=null;status('Card returned to tray.');},removeTo:{x:WIDTH()/2,y:removeZone().y+26}});fastBridge(g);
}
function placedCard(svg,kind,v){const z=kind==='ratio'?ruleZone():termZone(),g=E('g',{'data-placed':kind,tabindex:0,role:'button','aria-label':'Placed '+v+'. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,v,'result',small()?22:24);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(kind);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[removeZone()],onDrop:()=>false,onRemove:()=>remove(kind),removeTo:{x:WIDTH()/2,y:removeZone().y+26}});fastBridge(g);
}
function target(svg,kind){const z=kind==='ratio'?ruleZone():termZone();if(placed[kind]){placedCard(svg,kind,placed[kind]);return;}
 box(svg,z.x,z.y,z.w,z.h,'?','unknown',26);
 const hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':kind,tabindex:0,role:'button','aria-label':'Place the '+kind+' card here'},svg);
 function go(){if(kbChoice){if(kbChoice.kind!==kind){status('Select the matching '+kind+' card.');return;}place(kind,kbChoice.value);}else status('Select a '+kind+' card first.');}
 hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});hit.addEventListener('click',go);
}
function drawChallenge(){
 if(!stageRef)return;
 const t=task(),p={a:t.a,r:t.r,rule:t.ratio},svg=root('Geometric sequence challenge: compare the first four glass bars and place the ratio and fifth term.',true);
 clear(stageRef);
 text(svg,WIDTH()/2,43,'FIND THE COMMON RATIO',small()?24:30,'support');
 text(svg,WIDTH()/2,82,'A fixed multiplier connects every term',small()?16:20,'support');
 drawBars(svg,p,4,{challenge:true,hops:true,hideRule:true});
 text(svg,WIDTH()/2,557,'Choose the rule and predict term five',small()?17:20,'support');
 text(svg,ruleZone().x+ruleZone().w/2,580,'MULTIPLY / DIVIDE',small()?15:18,'support');
 text(svg,termZone().x+termZone().w/2,580,'NEXT TERM',small()?15:18,'support');
 target(svg,'ratio');target(svg,'term');
 text(svg,small()?26:145,684,'RULE CARDS',small()?15:18,'support','start');
 const x0=small()?45:183,w=small()?96:116,gap=small()?27:38;
 t.ratios.forEach((v,i)=>{if(placed.ratio===v)return;source(svg,'ratio',v,x0+i*(w+gap),696,w,43);});
 text(svg,small()?26:145,766,'TERM CARDS',small()?15:18,'support','start');
 t.terms.forEach((v,i)=>{if(placed.term===v)return;source(svg,'term',v,x0+i*(w+gap),776,w,43);});
 const rz=removeZone();box(svg,rz.x,rz.y,rz.w,rz.h,'RED REMOVE TRAY','error',small()?17:19);
 const side=[card('PLACED',Object.keys(placed).length+' / 2',true),note('KEY IDEA','Multiplication uses the same factor for every hop. The amount added will usually change.'),note('KEYBOARD','Press Enter on a card, then Enter on its empty gap. Delete removes a placed card.')];
 mount(stageRef,svg,side,challengeIndex===2?'think':'point-right','Check the operation from term to term. It must work every time.');
}
const def={id,title:'Geometric sequence',config:C,
 alt:'Geometric sequences represented by proportional glowing neon glass bars and multiplication hops.',
 staticAlt:'Doubling: 2, 4, 8, 16, 32; halving: 64, 32, 16, 8, 4. Geometric rules multiply or divide by a constant ratio.',
 steps:steps.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){teach(Math.min(i,5),stage);},
 exploreIntro:'Choose doubling, halving or tripling. Watch how the size changes, but the ratio remains constant.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();presetKey='Y8-020-geometric-sequences';window.NovaLessonComponent?.applyExploreModels();visible=4;
   window.NovaLessonComponent?.applyExploreModels();const info=H('p',{class:'f906-instruction',text:'Switch between growth and decay. Reveal more bars and predict the next value.'});
   window.NovaLessonComponent?.applyExploreModels();const choices=H('div',{class:'f906-choices'});
   window.NovaLessonComponent?.applyExploreModels();for(const [key,p] of Object.entries(C.presets))choices.append(btn(p.label,()=>{presetKey=key;event('preset',key);explore(stage);},'nova-btn ghost'));
   window.NovaLessonComponent?.applyExploreModels();const range=H('input',{type:'range',min:'2',max:'5',value:'4','aria-label':'Number of visible terms'}),out=H('output',{class:'f906-micro',text:'4 terms'});
   window.NovaLessonComponent?.applyExploreModels();range.addEventListener('input',()=>{visible=+range.value;out.textContent=visible+' terms';event('position',visible);explore(stage);});
   window.NovaLessonComponent?.applyExploreModels();panel.append(info,choices,H('div',{class:'f906-control'},[H('label',{},['Reveal terms ',range]),out]));window.NovaLessonComponent?.applyExploreModels();explore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placed={};kbChoice=null;stageRef=stage;panelRef=panel;apiRef=api;
   const heading=H('h3',{class:'f906-taskhead'}),guide=H('p',{class:'f906-instruction'}),actions=H('div',{class:'f906-control'}),help=H('p',{class:'f906-status',role:'status'});
   function load(){const t=task();heading.textContent=t.title;guide.textContent=t.guide;actions.replaceChildren();help.textContent='Drag the two correct cards, or use keyboard Enter.';api.fb.textContent='';api.fb.className='nova-fb';
     actions.append(btn('Check pattern',()=>{
      if(placed.ratio!==t.ratio||placed.term!==t.next){api.check(false,'Place the correct ratio AND term before checking.',{task:challengeIndex});return;}
      // Strict maths check — never allow an inconsistent configured challenge.
      if(String(term(t,5))!==t.next){api.check(false,'Internal configuration error. Stop and report this component.',{task:challengeIndex});return;}
      event('ratio',t.ratio);event('term',Number(t.next));api.check(true,'Correct. The '+t.ratio+' rule produces term five = '+t.next+'.',{task:challengeIndex,score:challengeIndex+1});
      if(challengeIndex===2){heading.textContent='All three patterns complete';guide.textContent='You recognised doubling, tripling and halving as geometric sequences.';actions.replaceChildren(H('p',{class:'f906-maths f906-maths--gold',text:'3 / 3 · Ratios secured'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
      actions.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed={};kbChoice=null;load();},'nova-btn primary'));
     },'nova-btn primary'),btn('Reset cards',()=>{placed={};kbChoice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('Compare term two ÷ term one, then check the SAME rule works for every hop.'),'nova-btn ghost'));
     event('challengeTask',{index:challengeIndex});drawChallenge();
   }
   panel.append(heading,guide,actions,help);load();
 },
 onRestore(){presetKey='Y8-020-geometric-sequences';visible=5;challengeIndex=0;placed={};kbChoice=null;stageRef=null;panelRef=null;apiRef=null;}
};
N.registry.add({id,title:'Geometric sequence',topics:['sequences','geometric sequences','ratio','exponential growth','exponential decay'],deps:['F0-02','F0-04','F0-07','F0-08','F0-13']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"steps":()=>steps,"TASKS":()=>TASKS},draws:{"clear":["stage"],"mount":["stage","svg","cards","pose","say"],"explore":["stage"]},exploreFields:{}});
N.bankMount({id,num:'06',title:'Geometric sequence · Premium Edition',def,linked:['F9-02','F9-04','F9-07','F9-09'],years:'Year 8 geometric sequences · Year 9 exponential contexts · GCSE extension',spec:{
 purpose:'See a constant multiplicative ratio in growing and shrinking geometric sequences using proportional glass bars.',
 params:'Start a; positive ratio r; geometric term T(n)=a×r^(n−1); five terms and three source presets.',
 presets:'Y8-020 doubling 2,4,8,16,32; Y9-014 decay 64,32,16,8,4; Y9-014 growth 2,6,18,54,162.',
 steps:'First term → ratio hop → multiply again → notice changing differences → halve → generalise using n−1 repeated multiplications.',
 interactions:'Watch/Guided/Explore/Challenge; preset buttons, slider, drag rule and fifth-term cards, snap/remove/re-grab, Enter/Delete keyboard, misconceptions.',
 traps:'Confusing additive difference with multiplicative ratio; reversing halving; choosing two-steps-ahead terms or repeating earlier terms.',
 gcse:'Bridge to exponential rules and compound-growth contexts without implying continuous values between discrete terms.'
}});
window.F906_ENGINE=N.engines[id];
const c=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);[...c.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));c.appendChild(dev);
const heading=c.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>c.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(c,{childList:true,subtree:true});
})();
