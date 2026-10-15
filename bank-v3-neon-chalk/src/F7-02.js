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

/* NOVA F7-02 · Zero Pair Animation · F0 canonical Neon Tube + NOVA Chalk APIs. */
const F702_CONFIG={id:'F7-02',startMode:'watch',preset:'Y7-011',parameters:{maxPerSign:14,unitValue:1,integerOnly:true},
 presets:{
  'Y7-011':{label:'Year 7 · −3 + 5',expression:'−3 + 5',pos:5,neg:3,why:'Five positive units and three negative units leave two positive units.'},
  'NEGATIVE':{label:'Addition · −5 + 2',expression:'−5 + 2',pos:2,neg:5,why:'Two zero pairs disappear, leaving three negative units.'},
  'ZERO':{label:'Additive inverse · 4 + (−4)',expression:'4 + (−4)',pos:4,neg:4,why:'Four opposite pairs cancel completely to give zero.'},
  'SUBTRACT':{label:'Subtract negative · 3 − (−2)',expression:'3 − (−2)',pos:5,neg:0,why:'Subtracting two negative units is adding two positives: three plus two gives five.'},
  'SUBTRACT_POS':{label:'Subtract positive · 2 − 5',expression:'2 − 5',pos:2,neg:5,why:'Subtracting five is adding five negative units. Two opposite pairs cancel; three negative units remain.'},
  'GCSE':{label:'GCSE bridge · −7 + 5',expression:'−7 + 5',pos:5,neg:7,why:'Cancel five pairs; the extra two negative tiles give minus two.'}
 },
 challenge:[
  {text:'3 + (−2)',pos:3,neg:2,answer:1,explain:'One positive tile remains.'},
  {text:'−4 + 3',pos:3,neg:4,answer:-1,explain:'One negative tile remains.'},
  {text:'5 + (−5)',pos:5,neg:5,answer:0,explain:'All pairs cancel, so nothing remains.'},
  {text:'−2 − (−4)',pos:4,neg:2,answer:2,explain:'Subtracting negative four is adding positive four. Two positive tiles remain.'}
 ],events:{value:['preset','add','remove','pair','undo','reset','keyboard','answer','challenge','proof'],types:['step','correct','hintUsed','mode']}};
window.F702_CONFIG=F702_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F702_CONFIG),ID=C.id;
const SAY={intro:'Opposites on the mat!',lay:'Line up the tiles!',notice:'Spot the opposites!',pair:'One plus, one minus!',vanish:'They make zero!',remain:'Count what remains!',explore:'Try a new mix!',add:'Another tile!',cancel:'Pair cleared!',remove:'Tile returned!',undo:'Back one step!',wrong:'Check the signs!',ready:'Find zero pairs!',hint:'Match the opposites!',right:'You found the value!',win:'Fantastic work!'};
const POSE={intro:'explain',lay:'point',notice:'think',pair:'count',vanish:'cheer',remain:'count',explore:'point',add:'count',cancel:'cheer',remove:'point',undo:'think',wrong:'oops',ready:'think',hint:'think',right:'cheer',win:'cheer'};
const STEPS=[
 {name:'Meet signed units',say:'intro',narration:'Each bright positive square is worth plus one. Each diagonally striped negative square is worth minus one. Their shapes are equal, but their signs are opposites.'},
 {name:'Represent the calculation',say:'lay',narration:'Take three negative units and add five positive units. We now have five positive tiles and three negative tiles on the same mat.'},
 {name:'Find a zero pair',say:'notice',narration:'Match one positive tile with one negative tile. Plus one added to minus one makes exactly zero, so the pair can be removed without changing the total.'},
 {name:'Cancel opposite pairs',say:'vanish',narration:'There are three opposite pairs. Remove all three pairs, one at a time. The total stays the same throughout because each removed pair is worth zero.'},
 {name:'Read the remaining tiles',say:'remain',narration:'After cancelling, two positive units remain. Negative three plus positive five is positive two. The remaining tiles prove our answer.'}
 ];
function emit(key,value){if(!C.events.value.includes(key))throw Error('F7-02 undeclared value event '+key);N.events.emit('value',{engine:ID,key,value});}
function chalk(p,x,y,text,role='given',size=48,anchor='middle'){return N.chalkText(p,x,y,String(text),{size,role,anchor});}
function button(text,cb,primary=false){return H('button',{class:'nova-btn'+(primary?' primary':''),text,onclick:cb});}
function glass(g,x,y,w,h,role='given',r=18){return N.neonBox(g,x,y,w,h,{role,r});}
let nextId=0;
function makeTiles(pos,neg){if(!Number.isInteger(pos)||!Number.isInteger(neg)||pos<0||neg<0||pos>C.parameters.maxPerSign||neg>C.parameters.maxPerSign)throw Error('Invalid signed unit count');return [...Array.from({length:pos},()=>({id:'z'+(++nextId),sign:1})),...Array.from({length:neg},()=>({id:'z'+(++nextId),sign:-1}))];}
function counts(a){return {pos:a.filter(t=>t.sign===1).length,neg:a.filter(t=>t.sign===-1).length,net:a.reduce((n,t)=>n+t.sign,0)};}
function hasPair(a){const c=counts(a);return c.pos>0&&c.neg>0;}
function undoPair(a,posId,negId){const pos=a.find(x=>x.id===posId),neg=a.find(x=>x.id===negId);if(!pos||!neg||pos.sign===neg.sign)return null;return a.filter(x=>x.id!==posId&&x.id!==negId);}
function proof(a,initialNet){return counts(a).net===initialNet;}
function correctAfterCancellation(a,guess,expected){if(hasPair(a))return'Opposite tiles are still on the mat. Make every zero pair disappear before checking.';
 if(!Number.isInteger(guess))return'Enter a whole-number result, including a minus sign if needed.';
 if(guess===expected)return'';
 if(guess===Math.abs(expected)&&expected<0)return'These remaining tiles are negative: include the minus sign.';
 if(guess===-expected&&expected>0)return'The remaining tiles are positive, not negative.';
 if(guess===-expected&&expected===0)return'';
 return`Look at the remaining tiles. The answer must be ${expected>0?'positive':expected<0?'negative':'zero'}, and each surviving tile is worth one.`;
}
function fmt(n){return n<0?'−'+Math.abs(n):'+'+n;}
const posLane={x:35,y:146,w:930,h:207},negLane={x:35,y:420,w:930,h:207};
const removeZone={id:'return',kind:'remove',x:700,y:766,w:265,h:81};
const laneFor=sg=>sg===1?posLane:negLane;
function unitPos(sg,i){return {x:83+(i%7)*121,y:(sg===1?223:497)+Math.floor(i/7)*72};}
function unitDrawing(g,sg,x,y){const size=64,role=sg===1?'result':'error';glass(g,x,y,size,size,role,12);
 N.neonLine(g,x+10,y+10,x+size-10,y+10,{role,width:2.4,opacity:.78});
 if(sg===-1){for(let k=0;k<3;k++){N.neonLine(g,x+43,y+20+k*15,x+57,y+6+k*15,{role:'error',width:2.5,opacity:.8});N.neonLine(g,x+7,y+38+k*9,x+17,y+28+k*9,{role:'error',width:1.6,opacity:.5});}}
 chalk(g,x+size/2,y+45,sg===1?'+1':'−1',role,43);
 return {x,y,w:size,h:size};}
function scene(tiles,o={}){
 const interactive=!!o.interactive, s=N.svg.root(1000,interactive?866:728,'Two signed-unit lanes hold neon green positive one tiles and red hatched negative one tiles. A positive plus a negative pair makes zero, leaving the net signed value.');
 s.classList.add('f702-svg');const ct=counts(tiles);s.dataset.pos=String(ct.pos);s.dataset.neg=String(ct.neg);s.dataset.net=String(ct.net);s.dataset.pairCount=String(o.pairs||0);
 chalk(s,44,60,'ZERO-PAIR WORKSHOP','given',57,'start');
 chalk(s,44,115,o.headline||'A plus and a minus always make zero.','support',45,'start');
 for(const [sg,z,name] of [[1,posLane,'POSITIVE  +1'],[-1,negLane,'NEGATIVE  −1']]){
   glass(s,z.x,z.y,z.w,z.h,sg===1?'result':'error',22);
   chalk(s,62,z.y+49,name,sg===1?'result':'error',48,'start');
 }
 // Teaching rule is displayed *between* the two distinct lanes, not over a working tile.
 N.neonLine(s,120,388,337,388,{role:'result',width:4});N.neonRing(s,500,389,{role:'unknown',r:31,pulse:false});
 chalk(s,500,402,'0','unknown',48);N.neonLine(s,663,388,878,388,{role:'error',width:4});
 chalk(s,500,676,o.hideResult?'Cancel pairs to reveal the result':o.formula||'Count the uncancelled units',o.hideResult?'given':'result',47);
 if(o.showPairLines&&ct.pos&&ct.neg){const pairs=Math.min(ct.pos,ct.neg,3);for(let i=0;i<pairs;i++){
   const a=unitPos(1,i),b=unitPos(-1,i);
   N.neonPath(s,`M${a.x+32},${a.y+64} C${a.x+32},${a.y+133} ${b.x+32},${b.y-70} ${b.x+32},${b.y}`,{role:'op',width:3.5,dash:'9 9',opacity:.66});
 }}
 const tilesBySign={1:0,'-1':0},positions={};
 for(const u of tiles){const p=unitPos(u.sign,tilesBySign[u.sign]++), g=E('g',{'data-unit-id':u.id,'data-sign':String(u.sign),role:'button',tabindex:interactive?0:-1,'aria-label':(u.sign>0?'Positive one tile.':'Negative one tile.')+' Press Enter to select, or press Delete in Explore to remove.'},s);
  const box=unitDrawing(g,u.sign,p.x,p.y);positions[u.id]={...p,cx:p.x+32,cy:p.y+32,sg:u.sign,el:g};
  if(o.arrive&&!N.reducedMotion())N.motion.arrive(g,0,u.sign===1?-48:48,400);
  if(interactive){g.addEventListener('keydown',ev=>{
    if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();o.onSelect?.(u.id);}
    else if((ev.key==='Delete'||ev.key==='Backspace')&&o.allowRemove){ev.preventDefault();o.onRemove?.(u.id);}
   });
   N.ui.svgDrag(s,g,{box,zones:()=>{
     const z=tiles.filter(t=>t.sign===-u.sign).map(t=>({id:'pair:'+t.id,kind:'drop',x:positions[t.id].x-5,y:positions[t.id].y-5,w:74,h:74}));
     if(o.allowRemove)z.push(removeZone);return z;},
    onDrop:id=>id.startsWith('pair:')?!!o.onPair?.(u.id,id.slice(5)):false,
    onRemove:()=>o.onRemove?.(u.id),canStart:()=>!o.busy?.()});
  }
 }
 if(interactive){
   for(const [sg,x,caption] of [[1,38,'ADD  +1'],[-1,360,'ADD  −1']]){
     const g=E('g',{'data-source':String(sg),tabindex:0,role:'button','aria-label':`Add ${sg===1?'positive':'negative'} unit. Press Enter.`},s);
     glass(g,x,764,285,84,sg===1?'result':'error',18);
     unitDrawing(g,sg,x+12,775);
     chalk(g,x+103,819,caption,sg===1?'result':'error',42,'start');
     g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();o.onAdd?.(sg);}});
     N.ui.svgDrag(s,g,{box:{x,y:764,w:285,h:84},zones:()=>[{id:'mat',kind:'drop',...laneFor(sg)}],onDrop:id=>id==='mat'?!!o.onAdd?.(sg):false,canStart:()=>!o.busy?.()});
   }
   if(o.allowRemove){glass(s,700,766,265,81,'error',16);chalk(s,832,819,'REMOVE','error',47);}else{
     glass(s,700,766,265,81,'given',16);chalk(s,832,819,'MATCH PAIRS','given',35);
   }
 }
 // These are mathematical evidence: flashes/rings mark where equal and opposite units cancel.
 if(o.celebrate)N.motion.flash(s,500,389,'result',76);
 return {svg:s,positions};
}
function dock(stage,k){
if(window.NovaLessonComponent?.active){[stage,k]=window.NovaLessonComponent.args("dock",arguments);}
N.scene.helperStrip(stage,POSE[k]||'think',SAY[k]||'Find the opposites!');}
function view(stage,tiles,o={}){
if(window.NovaLessonComponent?.active){[stage,tiles,o]=window.NovaLessonComponent.args("view",arguments);}

 stage.textContent='';N.cap(stage,'Zero Pairs',o.caption||'Opposites cancel without changing the sum.');
 const layout=H('div',{class:'f702-layout'}), side=H('aside',{class:'f702-aside'}),sc=scene(tiles,o);
 side.append(N.neonCard([H('strong',{text:'+1 and −1 make zero'}),H('p',{text:'Only one positive and one negative of the SAME unit can cancel. Removing a zero pair never changes the value of the expression.'})],{role:'result'}),N.neonCard([H('strong',{text:'Find what remains'}),H('p',{text:'The positive tiles face one direction; red striped negatives face the other. The unmatched tiles prove both the size and the sign.'})],{role:'op'}));
 layout.append(sc.svg,side);stage.append(layout);
 const formula=H('div',{class:'f702-formula'+(o.correct?' won':'')});
 formula.append(H('span',{class:'f702-note',text:o.hideResult?'The answer remains hidden until you cancel and check.':'Signed-value evidence'}));
 if(!o.hideResult)formula.append(H('span',{text:o.mathText??('Net value '+fmt(counts(tiles).net))}));
 stage.append(formula);dock(stage,o.say||'explore');return sc;
}
function watchTiles(i){if(i===0)return makeTiles(1,1);if(i===1||i===2)return makeTiles(5,3);if(i===3)return makeTiles(3,1);return makeTiles(2,0);}
// In Watch/Guided the missing tiles move visibly into the zero ring before vanishing.
// They are two equal/opposite ghost tiles, so the mathematical net remains unchanged at every frame.
function witnessCancellation(svg,positiveOffset,negativeOffset,pairs){
 if(!svg||!svg.isConnected||!pairs)return;
 if(N.reducedMotion()){N.motion.flash(svg,500,390,'result',64);return;}
 const figures=[];
 for(let i=0;i<pairs;i++)for(const [sg,idx] of [[1,positiveOffset+i],[-1,negativeOffset+i]]){
  const p=unitPos(sg,idx),g=E('g',{'aria-hidden':'true'},svg);
  unitDrawing(g,sg,p.x,p.y);figures.push({g,cx:p.x+32,cy:p.y+32});
 }
 N.motion.tween(630,e=>figures.forEach(f=>{
  const dx=(500-f.cx)*e,dy=(389-f.cy)*e,scale=1-.77*e;
  f.g.setAttribute('transform',`translate(${(f.cx+dx).toFixed(2)},${(f.cy+dy).toFixed(2)}) scale(${scale.toFixed(3)}) translate(${-f.cx},${-f.cy})`);
  f.g.style.opacity=String(1-e);
 }),N.motion.ease.inOut,()=>{figures.forEach(f=>f.g.remove());if(svg.isConnected)N.motion.flash(svg,500,389,'result',52);});
}
function watch(i,stage){const a=watchTiles(i), c=counts(a);
 view(stage,a,{caption:STEPS[i].name,headline:['Same-sized units, opposite signs','−3 + 5 · place signed tiles','Find +1 and −1 pairs','Two pairs gone · one more to cancel','Only two positive units remain'][i],formula:i===0?'+1 + (−1) = 0':i>=4?'−3 + 5 = +2':i===3?'Zero pairs keep the net total': '−3 + 5',mathText:i>=4?'−3 + 5 = +2':i===0?'+1 + (−1) = 0':'Cancel opposite pairs to simplify',say:STEPS[i].say,showPairLines:i===2,arrive:i===1,celebrate:i===4,pairs:i===3?2:i===4?3:0});
 if(i===3||i===4){const svg=stage.querySelector('.f702-svg');witnessCancellation(svg,i===3?3:2,i===3?1:0,i===3?2:1);}
}
function workspace(panel,stage,mode,api){let preset=C.preset, idx=0,finished=false,tiles=[],history=[],pairsDone=0,selection=null,active=false,bad=false,say=mode==='explore'?'explore':'ready',message='Drag a positive tile onto a negative tile to cancel their zero pair.';
 const init=()=>{const p=mode==='challenge'?C.challenge[idx]:C.presets[preset];tiles=makeTiles(p.pos,p.neg);pairsDone=0;history=[];selection=null;active=false;bad=false;message='Find +1 and −1 pairs. Each pair is worth zero.';say=mode==='explore'?'explore':'ready';};
 const snapshot=()=>({tiles:tiles.map(t=>({...t})),pairsDone});
 const remember=()=>{history.push(snapshot());if(history.length>45)history.shift();};
 function add(sg){if(active||finished)return false;const c=counts(tiles);if((sg===1?c.pos:c.neg)>=C.parameters.maxPerSign){message='This lane is full. Remove or cancel a pair first.';bad=true;say='wrong';rerender();return false;}remember();tiles.push(...makeTiles(sg===1?1:0,sg===-1?1:0));emit('add',{sign:sg,total:tiles.length});say='add';bad=false;message=(sg===1?'A positive':'A negative')+' unit added to the mat.';rerender();return true;}
 function remove(id){if(active||mode==='challenge'||finished)return false;if(!tiles.some(t=>t.id===id))return false;remember();tiles=tiles.filter(t=>t.id!==id);selection=null;emit('remove',id);bad=false;say='remove';message='Tile returned to the tray. The total has changed by one unit.';rerender();return true;}
 function pair(aid,bid){if(active||finished)return false;const a=tiles.find(t=>t.id===aid),b=tiles.find(t=>t.id===bid);if(!a||!b||a.sign===b.sign||aid===bid)return false;
 remember();active=true;selection=null;bad=false;say='cancel';message='+1 and −1 add to zero. Watch the matched pair disappear.';
 const s=stage.querySelector('.f702-svg'), centers=[aid,bid].map(id=>s.querySelector(`[data-unit-id="${id}"]`));
 // The pair genuinely glides to the central zero ring. Removing these equal/opposite units keeps the net invariant.
 const coords=centers.map(e=>{const r=e.getAttribute('data-unit-id'),t=tiles.filter(x=>x.sign===Number(e.getAttribute('data-sign')));const n=t.findIndex(x=>x.id===r);const p=unitPos(Number(e.getAttribute('data-sign')),n);return {x:p.x+32,y:p.y+32};});
 const glyphs=coords.map((p,i)=>{const g=E('g',{'aria-hidden':'true'},s);unitDrawing(g,i===0?a.sign:b.sign,p.x-32,p.y-32);return g;});
 centers.forEach(e=>e.style.opacity='.25');
 N.motion.tween(420,e=>glyphs.forEach((g,j)=>{const p=coords[j];const x=(500-p.x)*e,y=(390-p.y)*e;g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);g.style.opacity=String(1-e);}),N.motion.ease.inOut,()=>{
  glyphs.forEach(g=>g.remove());const next=undoPair(tiles,aid,bid);if(!next){active=false;return;}
  const before=counts(tiles).net;tiles=next;if(counts(tiles).net!==before)throw Error('Zero-pair invariant broken');pairsDone++;active=false;
  emit('pair',{a:aid,b:bid,value:0,remaining:tiles.length,pairsDone});
  say='cancel';message=`One zero pair cancelled. ${pairsDone} ${pairsDone===1?'pair':'pairs'} removed; the signed total is unchanged.`;
  rerender(true);
 });return true;
 }
 function choose(id){if(active||finished)return;const t=tiles.find(x=>x.id===id);if(!t)return;if(!selection){selection=id;message=`Selected ${t.sign>0?'positive':'negative'} one. Press Enter on an opposite tile to cancel.`;say='notice';bad=false;update();return;}
 if(selection===id){selection=null;message='Selection cleared.';update();return;}
 if(!pair(selection,id)){selection=id;bad=true;message='A zero pair needs ONE positive and ONE negative tile. Choose an opposite.';say='wrong';update();}}
 function cancelOne(){if(active||finished)return;const a=tiles.find(x=>x.sign===1),b=tiles.find(x=>x.sign===-1);if(!a||!b){bad=true;say='wrong';message='No opposite pair remains. Count your surviving tiles.';update();return;}emit('keyboard',{action:'cancel',mode});pair(a.id,b.id);}
 function undo(){if(active||!history.length)return;const old=history.pop();tiles=old.tiles;pairsDone=old.pairsDone;selection=null;bad=false;say='undo';message='Restored the previous signed tiles and pair count.';emit('undo',{pairsDone});rerender();}
 function reset(){if(active)return;init();emit('reset',{mode});rerender();}
 function hint(){if(active||finished)return;const c=counts(tiles);let note=hasPair(tiles)?'Find one green +1 and one striped red −1, then put them together.':c.pos?'Only positive units remain; count them.':c.neg?'Only negative units remain; include the minus sign.':'All units cancelled, so the value is zero.';
 api?.hint(note);say='hint';bad=false;message=note;rerender();}
 function check(){if(active||finished)return;const t=C.challenge[idx],raw=String(panel.querySelector('#f702-answer')?.value||'').trim().replace('−','-');let v=/^[+-]?\d+$/.test(raw)?Number(raw):NaN;emit('answer',{round:idx,answer:Number.isFinite(v)?v:null,pairsDone,uncancelled:tiles.length});
 const error=correctAfterCancellation(tiles,v,t.answer);if(error){bad=true;say='wrong';message=error;api.check(false,error,{round:idx});rerender();return;}
 bad=false;say='right';message='Correct. The surviving unit tiles prove both the size and sign.';api.check(true,message,{round:idx});emit('proof',{round:idx,result:v,pairsDone});idx++;
 if(idx>=C.challenge.length){finished=true;message='All four signed calculations proven!';say='win';rerender(true);return;}
 init();message='Correct. Now solve the next signed expression.';rerender();
 }
 function update(){panel.textContent='';if(finished){panel.append(H('div',{class:'f702-win',text:'Four signed calculations completed. Every zero-pair cancellation preserved the value.'}));return;}
 if(mode==='explore'){
  const pick=H('select',{'aria-label':'Choose signed-number teaching preset'});Object.entries(C.presets).forEach(([k,p])=>pick.add(new Option(p.label,k)));pick.value=preset;
  panel.append(H('div',{class:'f702-controls'},[H('label',{},['Choose calculation',pick]),button('Undo',undo),button('Reset example',reset)]));
  pick.onchange=()=>{preset=pick.value;C.preset=preset;init();emit('preset',preset);rerender();};
  panel.append(H('div',{class:'f702-actions'},[button('Add +1',()=>{emit('keyboard',{action:'add',sign:1});add(1);}),button('Add −1',()=>{emit('keyboard',{action:'add',sign:-1});add(-1);}),button('Cancel one pair',cancelOne,true)]));
  panel.append(H('p',{class:'f702-help',text:'Drag +1 or −1 from the bottom tray to its matching row; drag a placed unit onto any opposite unit to cancel, or return it to REMOVE. Keyboard: Enter on one tile then Enter on the opposite; Delete returns a tile. Undo restores the most recent change.'}));
 }else{
  const t=C.challenge[idx];panel.append(H('p',{class:'f702-help',text:`Challenge ${idx+1} of ${C.challenge.length} · Simplify ${t.text}. Cancel every zero pair, then enter the resulting integer.`}));
  const answer=H('input',{id:'f702-answer',type:'text',inputMode:'numeric','aria-label':'Signed integer result',placeholder:'e.g. −2',autocomplete:'off'});
  answer.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check();}});
  panel.append(H('div',{class:'f702-controls'},[H('label',{},['Signed result',answer])]),H('div',{class:'f702-actions'},[button('Cancel one pair',cancelOne),button('Check result',check,true),button('Start again',reset),button('Hint',hint)]));
  panel.append(H('p',{class:'f702-help',text:'Drag a positive unit onto a negative unit, or select the two opposites with Enter. In Challenge you cannot delete tiles or alter the starting calculation.'}));
 }
 panel.append(H('p',{class:'f702-status'+(bad?' bad':''),role:'status',text:message}));
 }
 function rerender(celebrate=false){if(N.ui._drag)N.ui.cancelDrag();const t=mode==='challenge'?C.challenge[Math.min(idx,C.challenge.length-1)]:C.presets[preset],c=counts(tiles);
 view(stage,tiles,{caption:mode==='challenge'?(finished?'Challenge complete':`Challenge ${idx+1} · ${t.text}`):'Explore · '+t.expression,
 headline:mode==='challenge'?(finished?'Every cancellation preserves the sum':`${t.text} · which units cancel?`):`${t.expression} · find the zero pairs`,
 mathText:mode==='challenge'?(finished?'Signed arithmetic mastered':undefined):`Current mat: +${c.pos} + (−${c.neg}) = ${fmt(c.net)}`,
 formula:mode==='challenge'?'Cancel to reveal the result':'Count the remaining units',hideResult:mode==='challenge'&&!finished,
 interactive:!finished,allowRemove:mode==='explore',say,celebrate,pairs:pairsDone,
 onAdd:add,onRemove:remove,onPair:pair,onSelect:choose,busy:()=>active});
 update();}
 init();rerender();
}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();workspace(panel,stage,'explore',null);}
function challenge(panel,api,stage){workspace(panel,stage,'challenge',api);}
const def={id:ID,title:'Zero-Pair Animation',config:C,steps:STEPS,alt:'Positive glowing glass +1 squares and red diagonal-striped −1 squares, paired into zero with glowing transfer animations.',staticAlt:'An equal positive one and negative one cancel because +1 + (−1) = 0. Remaining uncancelled signed units give the total.',render:watch,exploreIntro:'Drag positive and negative units together; cancel opposite pairs to simplify.',explore,challenge,onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['signed numbers','integer operations','additive inverses','zero pairs','algebra tiles'],deps:['F0-02','F0-03','F0-04','F0-08','F7-01']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"dock":["stage","k"],"view":["stage","tiles","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'02',title:'Zero-Pair Animation · Premium Review',def,linked:['F7-01','F2-12','F7-03'],years:'Year 7 signed-number addition/subtraction (Y7-011); GCSE signed-term bridge',spec:{purpose:'Prove additive inverses: a + (−a) = 0, and explain signed sums through cancellation of equal unit pairs.',params:'Positive and negative unit squares, integer count 0–14 per sign, individually matchable pairs, zero-pair invariant.',presets:'Y7-011 −3+5; −5+2; 4+(−4); 3−(−2); 2−5; −7+5 GCSE bridge.',steps:'Meet positive and negative units → represent expression → discover +1/−1 → cancel opposites → read the remaining value.',interactions:'Drag opposite tiles together to cancel, tray-to-mat add, Explore return-to-tray, keyboard Enter matching, Undo/Reset and Challenge signed entry.',traps:'Confusing −3+5 with −8, deleting unmatched tiles, losing the negative sign, treating subtraction of a negative as subtraction of a positive.',gcse:'Extends to cancelling signed algebraic terms; F7-03 will collect like terms while F7-01 provides the tile grammar.'}});
// F0 pointer capture recovery used by the approved F7-01. Preserve original F0 helper, not a private drag implementation.
(function(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>pointer=null);
})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('alt'))img.setAttribute('alt','NOVA maths helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{childList:true,subtree:true});
window.F702_MATH={makeTiles,counts,hasPair,undoPair,proof,correctAfterCancellation};
})();
