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

/* NOVA F3-05 — Prime Sieve & Factor Tree.
   Canonical F0 shared core; reusable parameterised maths, not a private engine shell.
   Character captions deliberately brief (F0/F1 reaction pattern); Bob narrates mathematical detail. */
const F305_CONFIG={id:'F3-05',startMode:'watch',preset:'Y7-014-sieve',parameters:{sieveMax:100,minTree:2,maxTree:144},
 presets:{
  'Y7-014-sieve':{label:'Y7 · Prime numbers to 100',view:'sieve',limit:100,lesson:'Y7-014'},
  'Y7-014-early':{label:'Y7 · Prime numbers to 30',view:'sieve',limit:30,lesson:'Y7-014'},
  'Y7-015-tree60':{label:'Y7 · Prime factorisation: 60',view:'tree',n:60,lesson:'Y7-015'},
  'Y7-015-tree90':{label:'Y7 · Prime factorisation: 90',view:'tree',n:90,lesson:'Y7-015'},
  'Y8-004-tree84':{label:'Y8 · Prime factors: 84',view:'tree',n:84,lesson:'Y8-004'}},
 events:{value:['preset','representation','sievePrime','sieveUndo','sieveCell','targetNumber','factorNode','factorDivisor','factorSplit','factorUndo','challengeTask'],types:['step','correct','hintUsed','mode']},
 challenge:[{kind:'sieve',limit:100,find:97},{kind:'tree',n:60},{kind:'tree',n:84}]};
window.F305_CONFIG=F305_CONFIG;
(function(){'use strict';
const N=window.NOVA,E=N.svg.el,H=N.h,C=window.NovaV2Integration.configuration(F305_CONFIG),ID=C.id;
const role=['op','given','focus','result','support'];
function emit(key,value){if(!C.events.value.includes(key))throw Error(ID+' undeclared event: '+key);N.events.emit('value',{engine:ID,key,value});}
function prime(n){if(!Number.isInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}
function primeList(max){return Array.from({length:Math.max(0,max-1)},(_,i)=>i+2).filter(prime);}
function sieveState(limit,steps){const used=(steps||[]).filter((p,i,a)=>prime(p)&&p*p<=limit&&a.indexOf(p)===i);const crossed=new Set();used.forEach(p=>{for(let v=p*p;v<=limit;v+=p)crossed.add(v);});return {crossed,used,primes:primeList(limit),left:Array.from({length:limit},(_,i)=>i+1).filter(v=>v>1&&!crossed.has(v))};}
let nextID=1;
function tree(n){if(!Number.isInteger(n)||n<2||n>144)throw Error('Tree value must be an integer 2–144.');return {id:'n'+(nextID++),v:n,children:null};}
function findNode(root,id){if(root.id===id)return root;for(const c of root.children||[]){const r=findNode(c,id);if(r)return r;}return null;}
function leaves(root){return root.children?root.children.flatMap(leaves):[root];}
function composites(root){return leaves(root).filter(o=>!prime(o.v));}
function split(root,id,d){const node=findNode(root,id);if(!node||node.children||!Number.isInteger(d)||d<2||d>=node.v||node.v%d!==0)return false;
 const other=node.v/d;node.children=[tree(d),tree(other)];return true;}
function undo(root,id){const n=findNode(root,id);if(!n||!n.children)return false;n.children=null;return true;}
function factors(root){return leaves(root).map(n=>n.v).sort((a,b)=>a-b);}
function isDone(root){return leaves(root).every(n=>prime(n.v))&&leaves(root).reduce((a,n)=>a*n.v,1)===root.v;}
function normalFactorisation(n){const a=[];for(let d=2;n>1;d++)while(n%d===0){a.push(d);n/=d;}return a;}
window.F305_MATH={prime,primeList,sieveState,tree,findNode,leaves,composites,split,undo,factors,isDone,normalFactorisation};
function txt(p,x,y,v,size=38,r='given'){return N.chalkText(p,x,y,String(v),{size,role:r});}
function btn(s,on,primary=false){return H('button',{text:s,class:primary?'nova-btn primary':'nova-btn',onclick:on});}
const SAY={welcome:'Find the primes!',two:'Start with two!',twos:'Watch them disappear!',three:'Three next!',threes:'Keep going!',five:'Spot the fives!',seven:'Last sweep!',sieveDone:'Brilliant detective work!',root:'Follow the branches!',split:'Try a factor!',leaves:'Nearly there!',collect:'All prime!',exploreSieve:'What stays standing?',exploreTree:'Choose a split!',challengeSieve:'You can do it!',challengeTree:'Show your proof!',wrong:'Have another go!',hint:'Look closely!',correct:'Nice one!',victory:'Amazing work!'};
const poses={welcome:'explain',two:'point',twos:'cheer',three:'point',threes:'think',five:'point',seven:'count',sieveDone:'cheer',root:'think',split:'point',leaves:'think',collect:'cheer',exploreSieve:'think',exploreTree:'point',challengeSieve:'think',challengeTree:'think',wrong:'oops',hint:'think',correct:'cheer',victory:'cheer'};
function dock(stage,key){
if(window.NovaLessonComponent?.active){[stage,key]=window.NovaLessonComponent.args("dock",arguments);}
N.scene.helperStrip(stage,poses[key]||'explain',SAY[key]||'Your turn!');}
const STEPS=[
 {name:'Start with one and two',kind:'sieve',num:0,say:'welcome',narration:'A prime is a whole number greater than one with exactly two positive factors. One is not prime. Two is the first prime.'},
 {name:'Circle two',kind:'sieve',num:0,say:'two',narration:'Circle two: it is prime. All other even numbers are multiples of two and will be removed.'},
 {name:'Cross multiples of two',kind:'sieve',num:1,say:'twos',narration:'Cross out four, six, eight and all the other multiples of two. Leave two standing, because two itself is prime.'},
 {name:'Cross multiples of three',kind:'sieve',num:2,say:'three',narration:'The next uncrossed number is three. It is prime. Cross its multiples starting at nine; six was already crossed by two.'},
 {name:'Cross multiples of five',kind:'sieve',num:3,say:'five',narration:'Five is the next uncrossed prime that still has new composite multiples to eliminate. Begin at twenty-five.'},
 {name:'Cross multiples of seven',kind:'sieve',num:4,say:'seven',narration:'Seven is the final needed sieve prime up to one hundred. Cross multiples beginning at forty-nine. Every remaining number above one is prime.'},
 {name:'Start a factor tree',kind:'tree',level:0,say:'root',narration:'Switch to a factor tree for sixty. A composite number can be divided into two smaller whole-number factors.'},
 {name:'Split into six and ten',kind:'tree',level:1,say:'split',narration:'Sixty can be split into six times ten. This is an exact product, but both branches are still composite.'},
 {name:'Split six and ten',kind:'tree',level:2,say:'leaves',narration:'Split six into two and three, and ten into two and five. The leaves are all prime numbers.'},
 {name:'Collect prime factors',kind:'tree',level:3,say:'collect',narration:'The prime factorisation of sixty is two times two times three times five, or two squared times three times five. Multiplying the leaves must recover the starting number.'}
];
function glassSieve(limit,used,opt={}){
 const svg=N.svg.root(940,984,'A one-to-one-hundred neon prime sieve: primes stay highlighted while composite multiples are crossed out.');svg.classList.add('f305-svg');
 const state=sieveState(limit,used),colW=84,rowH=68,cellW=78,cellH=59,x0=44,y0=120,usedSet=new Set(used),gridMax=100;
 N.neonBox(svg,245,24,450,66,{role:'support',r:18});txt(svg,470,71,'Prime sieve · 1 to '+limit,38,'given');
 const cellNodes=[];
 for(let v=1;v<=gridMax;v++){
  const index=v-1,c=index%10,r=Math.floor(index/10),x=x0+c*colW,y=y0+r*rowH,inside=v<=limit,isCrossed=state.crossed.has(v),picked=inside&&usedSet.has(v),isPrime=prime(v);
  const g=E('g',{'data-value':v,role:'gridcell',tabindex:v===(opt.focusCell||1)?'0':'-1','aria-label':v===1?'1 is neither prime nor composite':v+' '+(isCrossed?'crossed composite':picked?'selected prime':isPrime?'prime candidate':'composite candidate')},svg);
  g.setAttribute('aria-selected',String((opt.focusCell||1)===v));
  if(!inside)g.style.opacity='.20';else if(isCrossed)g.style.opacity='.53';
  N.neonBox(g,x,y,cellW,cellH,{role:!inside?'support':picked?'result':isCrossed?'support':v===1?'unknown':'given',r:11});
  if(picked)N.neonRing(g,x+cellW/2,y+cellH/2,{role:'result',r:22,pulse:false});
  txt(g,x+cellW/2,y+41,v,42,v===1?'support':picked?'result':isCrossed?'support':'given');
  if(isCrossed)N.neonMark(g,x+cellW-13,y+13,false,{size:8,width:3});
  if(opt.onCell&&inside){g.style.cursor='pointer';g.addEventListener('click',()=>opt.onCell(v));g.addEventListener('keydown',e=>{
   let to=0;if(e.key==='ArrowRight')to=v+1;else if(e.key==='ArrowLeft')to=v-1;else if(e.key==='ArrowDown')to=v+10;else if(e.key==='ArrowUp')to=v-10;
   if(to){e.preventDefault();to=Math.max(1,Math.min(limit,to));const q=svg.querySelector('[data-value="'+to+'"]');if(q){g.tabIndex=-1;q.tabIndex=0;q.focus();}}
   else if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onCell(v);}
  });}
  // Watch animation: newly eliminated multiples settle by the approved F0 motion tween.
  if(opt.animate&&isCrossed&&used.length&&!N.reducedMotion()){
    const last=used.at(-1),before=sieveState(limit,used.slice(0,-1)).crossed;
    if(v>=last*last&&v%last===0&&!before.has(v)){
      g.style.opacity='1';N.motion.tween(380+(v%10)*28,t=>{g.style.opacity=String(1-.47*t);},N.motion.ease.out);
    }
  }
  cellNodes.push(g);
 }
 N.neonBox(svg,88,815,764,118,{role:'support',r:17});txt(svg,206,855,'Prime sweep',36,'given');
 const cards=[2,3,5,7],pos=[294,416,538,660];
 cards.forEach((p,i)=>{
  const x=pos[i],y=846,g=E('g',{'aria-label':'Drag prime '+p+' onto grid','data-prime-card':p},svg);
  N.neonBox(g,x,y,80,65,{role:usedSet.has(p)?'result':p===opt.next?'focus':'op',r:16});txt(g,x+40,y+45,p,49,usedSet.has(p)?'result':'given');
  if(opt.onPrime){N.ui.svgDrag(svg,g,{box:{x,y,w:80,h:65},zones:()=>[{id:'sieve',kind:'drop',x:32,y:115,w:858,h:687},{id:'remove',kind:'remove',x:93,y:923,w:260,h:48}],onDrop:()=>opt.onPrime(p),onRemove:()=>opt.onUndo?.(p)});
  }
 });
 N.neonBox(svg,96,933,244,44,{role:'error',r:12});txt(svg,219,963,'Remove / undo',32,'error');
 if(opt.solved){N.neonRing(svg,776,66,{role:'result',r:28,pulse:false});}
 return {svg,state};
}
function layoutTree(root){let i=0;const lf=leaves(root).length;
 function walk(n,depth){let x;if(!n.children)x=lf===1?470:115+(i++)*(710/Math.max(1,lf-1));else {const c=n.children.map(v=>walk(v,depth+1));x=c.reduce((a,b)=>a+b._x,0)/c.length;}
  n._x=x;n._y=155+depth*145;return n;}
 walk(root,0);return root;}
function glassTree(root,opt={}){
 const svg=N.svg.root(940,984,'A branching prime factor tree with neon connecting tubes and prime leaves highlighted green.');svg.classList.add('f305-svg');layoutTree(root);
 N.neonBox(svg,260,22,420,63,{role:'support',r:18});txt(svg,470,68,root.v+' · factor tree',39,'given');
 const nodes=[];function traverse(n){nodes.push(n);(n.children||[]).forEach(traverse);}traverse(root);
 for(const n of nodes){for(const ch of n.children||[]){N.neonPath(svg,'M '+n._x+' '+(n._y+32)+' C '+n._x+' '+(n._y+82)+' '+ch._x+' '+(ch._y-84)+' '+ch._x+' '+(ch._y-40),{role:prime(ch.v)?'result':'op',width:5});}}
 // The opening state is an unfinished mathematical model, not an empty canvas.
 // Ghost pair slots are predictions, never a prematurely given factorisation.
 if(nodes.length===1&&!prime(root.v)){
  N.neonPath(svg,'M 470 188 Q 470 295 247 412',{role:'support',width:4,dash:'13 12'});
  N.neonPath(svg,'M 470 188 Q 470 295 693 412',{role:'support',width:4,dash:'13 12'});
  N.neonBox(svg,175,411,145,82,{role:'unknown',r:18});
  N.neonBox(svg,620,411,145,82,{role:'unknown',r:18});
  txt(svg,247,467,'?',62,'focus');txt(svg,693,467,'?',62,'focus');
  N.neonBox(svg,245,555,450,86,{role:'support',r:18});
  txt(svg,470,613,'? × ? = '+root.v,51,'given');
 }
 else if(nodes.length===3&&composites(root).length){
  N.neonBox(svg,213,548,514,77,{role:'support',r:18});
  txt(svg,470,598,'Split composite leaves next',42,'given');
 }
 for(const n of nodes){
  const g=E('g',{'data-node':n.id,'aria-label':n.v+(prime(n.v)?' prime':' composite')},svg);
  N.neonBox(g,n._x-55,n._y-35,110,70,{role:prime(n.v)?'result':n.children?'support':opt.active===n.id?'focus':'op',r:20});
  if(prime(n.v))N.neonRing(g,n._x,n._y,{role:'result',r:36,pulse:false});
  txt(g,n._x,n._y+16,n.v,49,prime(n.v)?'result':n.children?'support':'given');
  if(opt.animate&&n!==root&&!N.reducedMotion())N.motion.arrive(g,0,-15,470,N.motion.ease.back);
  if(!n.children&&!prime(n.v)&&opt.setActive){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.style.cursor='pointer';g.addEventListener('click',()=>opt.setActive(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.setActive(n.id);}});}
  if(n.children&&opt.onUndo){N.ui.svgDrag(svg,g,{box:{x:n._x-55,y:n._y-35,w:110,h:70},zones:()=>[{id:'remove',kind:'remove',x:651,y:933,w:236,h:46}],onRemove:()=>opt.onUndo(n.id)});}
 }
 const f=factors(root),complete=isDone(root);N.neonBox(svg,100,748,736,91,{role:complete?'result':'support',r:19});
 txt(svg,469,782,'Prime leaves',33,complete?'result':'given');txt(svg,469,817,complete?f.join(' × '):'Split the composite leaves',39,complete?'result':'given');
 N.neonBox(svg,651,935,236,42,{role:'error',r:12});txt(svg,768,965,'Remove / undo',31,'error');
 const ds=[2,3,4,5,6,7,10],start=98,gap=111;
 ds.forEach((d,i)=>{const x=start+i*gap,y=859,g=E('g',{'aria-label':'Drag factor '+d+' to a composite node','data-factor-card':d},svg);
  N.neonBox(g,x,y,74,62,{role:prime(d)?'op':'support',r:14});txt(g,x+37,y+44,d,48,'given');
  if(opt.onSplit)N.ui.svgDrag(svg,g,{box:{x,y,w:74,h:62},zones:()=>composites(root).map(n=>({id:n.id,kind:'drop',x:n._x-60,y:n._y-50,w:120,h:96})),onDrop:id=>opt.onSplit(id,d)});
 });
 return svg;
}
function assemble(stage,kind,data,opt={}){
if(window.NovaLessonComponent?.active){[stage,kind,data,opt]=window.NovaLessonComponent.args("assemble",arguments);}

 stage.innerHTML='';N.cap(stage,kind==='sieve'?'Prime sieve':'Factor tree',opt.caption||'Prime numbers have exactly two factors');
 const row=H('div',{class:'f305-scene'}),side=H('aside',{class:'f305-side'}),isSieve=kind==='sieve',art=isSieve?glassSieve(data.limit,data.used||[],opt).svg:glassTree(data.root,opt);
 side.append(
  N.neonCard([H('span',{class:'f305-kicker',text:isSieve?'CROSS-OUT RULE':'SPLIT RULE'}),H('p',{class:'f305-ink',text:isSieve?'Start at p²':'Exact products'})],{role:'op'}),
  N.neonCard([H('span',{class:'f305-kicker',text:isSieve?'PRIMES LEFT':'PRIME LEAVES'}),H('p',{class:'f305-ink',text:isSieve?String(sieveState(data.limit,data.used||[]).left.length):String(factors(data.root).filter(prime).length)})],{role:'result'}),
  N.neonCard([H('span',{class:'f305-kicker',text:'MATHEMATICAL CHECK'}),H('p',{class:'f305-detail',text:isSieve?'One is not prime. Do not cross out the chosen prime. Only multiples are removed.':'Every split must multiply back to its parent. Every final leaf must be prime.'})],{role:'support'})
 );row.append(art,side);stage.append(row);dock(stage,opt.say||'exploreSieve');return art;
}
function prescribedTree(level){const rt=tree(60);if(level>=1)split(rt,rt.id,6);if(level>=2){const a=rt.children;split(rt,a[0].id,2);split(rt,a[1].id,2);}return rt;}
const def={id:ID,title:'Prime sieve & factor tree',config:C,steps:STEPS,alt:'A premium neon one-to-one-hundred prime sieve and a dynamically branching prime factor tree.',staticAlt:'Sieve the multiples of 2, 3, 5 and 7 to obtain the 25 primes up to 100. Factor tree: 60 = 2 × 2 × 3 × 5.',
 render(i,stage){const s=STEPS[i];if(s.kind==='sieve')assemble(stage,'sieve',{limit:100,used:[2,3,5,7].slice(0,s.num)},{say:s.say,caption:s.name,animate:true,solved:i===5});
  else assemble(stage,'tree',{root:prescribedTree(s.level)},{say:s.say,caption:s.name,animate:true});},
 exploreIntro:'Switch between the sieve and factor tree. Every action must prove a mathematical fact.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let preset=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("preset",()=>(C.preset)):(C.preset)),view='sieve',limit=100,used=[],root=tree(60),active=root.id,focusCell=1,say='exploreSieve',message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Start with prime two.')):('Start with prime two.')),bad=false;
  window.NovaLessonComponent?.applyExploreModels();const choice=H('select',{'aria-label':'Curriculum preset'}),type=H('select',{'aria-label':'Representation'}),num=H('input',{type:'number',min:2,max:144,step:1,value:60,'aria-label':'Target number'}),primeChoice=H('select',{'aria-label':'Prime to sweep'}),nodeChoice=H('select',{'aria-label':'Composite tree node'}),divChoice=H('select',{'aria-label':'Factor divisor'}),status=H('p',{class:'f305-status',role:'status'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,o])=>choice.add(new Option(o.label,key)));
  window.NovaLessonComponent?.applyExploreModels();['sieve','tree'].forEach(x=>type.add(new Option(x==='sieve'?'Prime sieve':'Factor tree',x)));
  window.NovaLessonComponent?.applyExploreModels();[2,3,5,7].forEach(x=>primeChoice.add(new Option(String(x),x)));window.NovaLessonComponent?.applyExploreModels();[2,3,4,5,6,7,10].forEach(x=>divChoice.add(new Option(String(x),x)));
  window.NovaLessonComponent?.applyExploreModels();function feedback(m,error=false,k='wrong'){message=m;bad=error;say=error?k:'correct';status.textContent=message;status.classList.toggle('error',error);}
  window.NovaLessonComponent?.applyExploreModels();function sweep(p){const need=[2,3,5,7].filter(v=>v*v<=limit);if(used.includes(p))return false;
   if(need[used.length]!==p){feedback('Try the next uncrossed prime in order.',true);return false;}
   used.push(p);emit('sievePrime',p);feedback('Multiples crossed. '+sieveState(limit,used).left.length+' numbers remain.');if(used.length===need.length)say='sieveDone';render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function unsweep(p){if(!used.length||used.at(-1)!==p)return false;used.pop();emit('sieveUndo',p);feedback('Last sweep undone.');render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function doSplit(id,d){emit('factorDivisor',d);if(!split(root,id,d)){feedback('That factor does not make an exact split. Try another.',true);return false;}
   emit('factorSplit',{id,divisor:d});active=composites(root)[0]?.id||root.id;feedback('Exact split!');if(isDone(root))say='collect';render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function doUndo(id){if(!undo(root,id))return false;active=id;emit('factorUndo',id);feedback('Split removed. Try another way.');render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function selectCell(v){focusCell=v;emit('sieveCell',v);const s=sieveState(limit,used);if(v===1)feedback('One is neither prime nor composite.',false,'hint');else if(s.crossed.has(v))feedback(v+' is composite; it was crossed out.');else if(prime(v))feedback(v+' is a prime candidate.');else feedback('Keep sieving before deciding.',false,'hint');render();}
  window.NovaLessonComponent?.applyExploreModels();function render(){panel.innerHTML='';type.value=view;choice.value=preset;num.value=root.v;
   const c=H('div',{class:'f305-row'},[H('label',{},['Preset',choice]),H('label',{},['Representation',type])]);
   const q=H('div',{class:'f305-row'}),intro=H('p',{class:'f305-intro',text:view==='sieve'?'Cross multiples in prime order. Leave the chosen prime standing.':'Split composite numbers; finish only when every leaf is prime.'});
   if(view==='sieve'){
    q.append(H('label',{},['Prime',primeChoice]),btn('Sweep multiples',()=>sweep(+primeChoice.value),true),btn('Undo sweep',()=>unsweep(used.at(-1))),btn('Reset',()=>{used=[];feedback('Try two first.');render();}));
    assemble(stage,'sieve',{limit,used},{say,next:[2,3,5,7][used.length],focusCell,onPrime:sweep,onUndo:unsweep,onCell:selectCell,solved:used.length===[2,3,5,7].filter(p=>p*p<=limit).length});
   }else{
    nodeChoice.innerHTML='';composites(root).forEach(n=>nodeChoice.add(new Option('Split '+n.v,n.id)));if(composites(root).some(n=>n.id===active))nodeChoice.value=active;
    q.append(H('label',{},['Target',num]),H('label',{},['Composite leaf',nodeChoice]),H('label',{},['Factor',divChoice]),btn('Split node',()=>doSplit(nodeChoice.value,+divChoice.value),true),btn('Undo last',()=>{let usedNodes=[];(function walk(n){if(n.children)usedNodes.push(n);(n.children||[]).forEach(walk);})(root);if(usedNodes.length)doUndo(usedNodes.at(-1).id);}),btn('Reset',()=>{root=tree(root.v);active=root.id;feedback('Start at the root.');render();}));
    assemble(stage,'tree',{root},{say,onSplit:doSplit,onUndo:doUndo,setActive:id=>{active=id;emit('factorNode',id);render();},active});
   }
   panel.append(intro,c,q,status);status.textContent=message;status.classList.toggle('error',bad);
  }
  window.NovaLessonComponent?.applyExploreModels();choice.onchange=()=>{preset=choice.value;const p=C.presets[preset];view=p.view;if(view==='sieve'){limit=p.limit;used=[];}else {root=tree(p.n);active=root.id;}emit('preset',preset);emit('representation',view);say=view==='sieve'?'exploreSieve':'exploreTree';feedback('Ready for your next proof.');render();};
  window.NovaLessonComponent?.applyExploreModels();type.onchange=()=>{view=type.value;emit('representation',view);say=view==='sieve'?'exploreSieve':'exploreTree';render();};
  window.NovaLessonComponent?.applyExploreModels();num.onchange=()=>{const n=Math.max(2,Math.min(144,Math.round(+num.value||60)));root=tree(n);active=root.id;emit('targetNumber',n);feedback('Find the prime leaves.');render();};
  window.NovaLessonComponent?.applyExploreModels();render();},
 challenge(panel,api,stage){let task=0,used=[],root=tree(60),active=root.id,focusCell=1,wrong=0,won=false,say='challengeSieve',message='Sweep 2, 3, 5 and 7 in order, then identify a prime.',bad=false;
  const primeSelect=H('select',{'aria-label':'Prime to sweep'}),nodeSelect=H('select',{'aria-label':'Composite leaf'}),divSelect=H('select',{'aria-label':'Divisor'}),pick=H('select',{'aria-label':'Identify prime'}),status=H('p',{class:'f305-status',role:'status'});
  [2,3,5,7].forEach(p=>primeSelect.add(new Option(String(p),p)));[2,3,4,5,6,7,10].forEach(d=>divSelect.add(new Option(String(d),d)));
  [1,11,21,49,97].forEach(v=>pick.add(new Option(String(v),v)));pick.value='97';
  function setMessage(m,error=false){message=m;bad=error;say=error?'wrong':'correct';}
  function incorrect(m){wrong++;setMessage(m,true);api.check(false,m,{task,wrong});render();return false;}
  function advance(){api.check(true,'Proof complete.',{task});if(task===C.challenge.length-1){won=true;say='victory';message='Three prime proofs complete!';render();return true;}
   task++;used=[];root=tree(C.challenge[task].n);active=root.id;say=task===0?'challengeSieve':'challengeTree';message='Build a complete prime factor tree.';emit('challengeTask',task);render();return true;}
  function sieveDo(p){if(task!==0||won)return false;const need=[2,3,5,7];if(p!==need[used.length])return incorrect('Choose the next uncrossed prime.');used.push(p);emit('sievePrime',p);setMessage('Good sweep!');if(used.length===4)message='Now identify a prime left standing.';render();return true;}
  function checkPrime(v){if(used.length!==4)return incorrect('Finish the four prime sweeps first.');if(!prime(v))return incorrect(v===1?'One is not prime.':'That value has more than two factors.');if(v!==97)return incorrect('That is prime, but the target to identify is 97.');return advance();}
  function splitDo(id,d){if(task===0||won)return false;emit('factorDivisor',d);if(!split(root,id,d))return incorrect('That split is not an exact product.');emit('factorSplit',{id,divisor:d});active=composites(root)[0]?.id||root.id;setMessage('Valid factor pair.');if(isDone(root)){if(factors(root).reduce((a,v)=>a*v,1)!==root.v)return incorrect('Multiply the leaves to check your tree.');return advance();}render();return true;}
  function undoDo(id){if(!undo(root,id))return false;active=id;emit('factorUndo',id);setMessage('Undo complete.');render();return true;}
  function render(){panel.innerHTML='';if(won){assemble(stage,'tree',{root},{say:'victory',caption:'All prime leaves verified'});panel.append(H('p',{class:'f305-complete',text:'Complete · three mathematical prime proofs'}));return;}
   const t=C.challenge[task],intro=H('p',{class:'f305-intro',text:'Proof '+(task+1)+' / 3 · '+(t.kind==='sieve'?'Sieve to 100 and identify 97':'Prime factorise '+t.n)}),controls=H('div',{class:'f305-row'});
   if(t.kind==='sieve'){
    controls.append(H('label',{},['Next prime',primeSelect]),btn('Cross multiples',()=>sieveDo(+primeSelect.value),true),H('label',{},['Identify 97',pick]),btn('Check prime',()=>checkPrime(+pick.value)),btn('Hint',()=>{api.hint('Cross multiples beginning at the prime squared.');say='hint';render();}));
    assemble(stage,'sieve',{limit:100,used},{say,onPrime:sieveDo,focusCell,onCell:v=>{focusCell=v;emit('sieveCell',v);setMessage(v===1?'One is not prime.':prime(v)?'Prime candidate!':'Composite candidate.');render();},next:[2,3,5,7][used.length],solved:used.length===4});
   }else{
    nodeSelect.innerHTML='';composites(root).forEach(n=>nodeSelect.add(new Option('Split '+n.v,n.id)));if(composites(root).some(n=>n.id===active))nodeSelect.value=active;
    controls.append(H('label',{},['Composite leaf',nodeSelect]),H('label',{},['Divisor',divSelect]),btn('Split',()=>splitDo(nodeSelect.value,+divSelect.value),true),btn('Undo last',()=>{let n=[];(function walk(v){if(v.children)n.push(v);(v.children||[]).forEach(walk);})(root);if(n.length)undoDo(n.at(-1).id);}),btn('Hint',()=>{api.hint('Try a factor that divides exactly.');say='hint';render();}));
    assemble(stage,'tree',{root},{say,onSplit:splitDo,onUndo:undoDo,active,setActive:id=>{active=id;emit('factorNode',id);render();}});
   }
   panel.append(intro,H('p',{class:'f305-note',text:t.kind==='sieve'?'The number 1 is never prime. Drag a prime card to the grid or use the keyboard controls.':'Drag a factor card onto a composite node, or use Split. Undo any branch by dragging its parent to Remove.'}),controls,status);
   status.textContent=message;status.classList.toggle('error',bad);
  }
  emit('challengeTask',task);render();},onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['prime numbers','sieve of Eratosthenes','prime factors','factor tree'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F3-04']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"role":()=>role,"STEPS":()=>STEPS},draws:{"dock":["stage","key"],"assemble":["stage","kind","data","opt"]},exploreFields:{"preset":{"kind":"value","factory":null,"argCount":null},"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'05',title:'Prime sieve and factor tree · Premium Review',def,linked:['F3-01','F3-04','F3-06','F3-07'],years:'Year 7: Y7-014 and Y7-015 · Year 8: Y8-004',spec:{
 purpose:'Contrast a complete 1–100 prime sieve with proof by prime factor tree.',params:'Sieve limit 30 or 100; composite tree roots 2–144; valid exact factor splits.',presets:'Y7-014 sieve (30/100), Y7-015 factor tree (60/90), Y8-004 factor tree (84).',steps:'Prime 2 → sweep → 3 → 5 → 7 → tree root → composite split → prime leaves → verified product.',interactions:'Drag prime cards to the sieve; drag divisor cards onto composite nodes; drag split nodes to red Undo; grid arrow keys and panel controls.',traps:'One is not prime; the chosen prime must stay; p² crossing rule; composite leaves are not a finished factorisation; prime factors must multiply to original.',gcse:'Prime decomposition and checking by product support HCF/LCM and number-theoretic reasoning.'}});
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
function bobAlt(){card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.alt='Sir Bob Maximus, mathematics tutor';});}bobAlt();new MutationObserver(bobAlt).observe(card,{childList:true,subtree:true});
})();
