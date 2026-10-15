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

/* F3-15 · Surd and exact value builder. All maths drawing via unchanged F0 Neon + Chalk core. */
const F315_CONFIG={id:'F3-15',preset:'Y9-002',startMode:'watch',parameters:{min:2,max:200,integerOnly:true},
 presets:{
  'Y9-002':{label:'Y9 · Powers, roots and exact values',n:72},
  'Y9-002-50':{label:'Y9 · Extract a square factor of 50',n:50},
  'Y9-002-108':{label:'Y9 · Simplify the root of 108',n:108},
  'Y9-002-45':{label:'Y9 · Exact root of 45',n:45},
  'Y9-002-64':{label:'Y9 · Perfect square 64',n:64}},
 challenge:[{n:72,squareChoices:[36,9,4]},{n:50,squareChoices:[25,4,1]},{n:108,squareChoices:[36,9,4]},{n:45,squareChoices:[9,1,4]}],
 events:{value:['preset','number','factor','card','remove','reset','proof','hint'],types:['step','correct','hintUsed','mode']}};
window.F315_CONFIG=F315_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F315_CONFIG),ID=C.id;
const PHRASES={start:'Look carefully!',factor:'Spot the square!',lift:'Lift it out!',root:'Nearly there!',finish:'Brilliant!',explore:'Your turn!',correct:'Nice work!',wrong:'Try again!',hint:'Look for squares!',ready:'Have a go!',remove:'One more try!',win:'You nailed it!'};
const POSES={start:'magnify',factor:'think',lift:'point',root:'count',finish:'cheer',explore:'magnify',correct:'cheer',wrong:'oops',hint:'think',ready:'think',remove:'point',win:'cheer'};
const STEPS=[
 {name:'Start with an exact area',phase:0,say:'start',narration:'The area is seventy-two square units. Its side length is the square root of seventy-two, an exact value.'},
 {name:'Factorise the number',phase:1,say:'factor',narration:'Seventy-two is thirty-six multiplied by two. Thirty-six is the largest perfect-square factor of seventy-two.'},
 {name:'Lift the square factor',phase:2,say:'lift',narration:'We can separate the square-root expression into the square root of thirty-six multiplied by the square root of two.'},
 {name:'Take the exact square root',phase:3,say:'root',narration:'The square root of thirty-six is six. The square root of two remains exact; we do not replace it with a rounded decimal.'},
 {name:'Write simplest surd form',phase:4,say:'finish',narration:'The square root of seventy-two equals six square root two. The number under the root no longer contains a square factor greater than one.'}];
function surd(n){n=Math.max(2,Math.min(200,Math.round(+n||72)));const s=N.mt.surd(n);return {n,a:s.a,b:s.b,square:s.a*s.a,src:s.src,original:'\\sqrt{'+n+'}'};}
function squareFree(b){for(let k=2;k*k<=b;k++)if(b%(k*k)===0)return false;return true;}
function squareChoices(n){const valid=[];for(let k=Math.floor(Math.sqrt(n));k>=1;k--)if(n%(k*k)===0)valid.push(k*k);
 const best=valid[0],candidates=[best];for(const q of valid.slice(1))if(!candidates.includes(q)&&candidates.length<3)candidates.push(q);
 for(const q of [9,4,16,25,1,36])if(candidates.length<3&&!candidates.includes(q))candidates.push(q);
 return candidates;}
function proposed(n){const s=surd(n),alts=[{a:s.a,b:s.b,src:s.src,id:s.a+':'+s.b}];
 if(s.b!==1){ // alternatives include equivalent but unsimplified and numerically wrong values
  const equivalent=s.a>1?{a:1,b:s.n,src:'\\sqrt{'+n+'}',id:'1:'+n}:{a:s.a+1,b:s.b,src:(s.a+1)+'\\sqrt{'+s.b+'}',id:(s.a+1)+':'+s.b};
  alts.push(equivalent);
  let other={a:s.a+1,b:s.b,src:(s.a+1)+'\\sqrt{'+s.b+'}',id:(s.a+1)+':'+s.b};
  if(!alts.some(t=>t.id===other.id))alts.push(other);
 }else{alts.push({a:1,b:n,src:'\\sqrt{'+n+'}',id:'1:'+n});alts.push({a:s.a-1,b:1,src:String(s.a-1),id:(s.a-1)+':1'});}
 for(const t of [{a:2,b:n,src:'2\\sqrt{'+n+'}'},{a:1,b:n+1,src:'\\sqrt{'+(n+1)+'}'},{a:3,b:n,src:'3\\sqrt{'+n+'}'}]){let id=t.a+':'+t.b;if(alts.length>=3)break;if(!alts.some(x=>x.id===id))alts.push({...t,id});}
 return alts.slice(0,3);}
function errorFactor(n,v){const s=surd(n);if(!Number.isInteger(v)||v<=0)return'Choose a positive perfect-square number.';if(Math.sqrt(v)%1!==0)return'That number is not a perfect square.';if(n%v!==0)return v+' does not divide '+n+' exactly. Check the factors.';if(v!==s.square)return v===1?'One is a square factor, but it does not simplify this surd. Find a larger one.':v+' is a square factor, but not the largest. The root would still need simplifying.';return ''}
function errorResult(n,card){const s=surd(n);if(card.a===s.a&&card.b===s.b)return '';
 if(card.a*card.a*card.b===n)return'Equivalent value, but not simplest form. Extract every remaining square factor.';
 if(card.b===n&&card.a===1)return'The original root is exact, but it can still be simplified.';
 if(card.b===1&&s.b!==1)return'A rounded number is not the exact surd. Keep the remaining root.';
 return'Check the factor pair: the coefficient squared, multiplied by the radicand, must equal '+n+'.';}
window.F315_MATH={surd,squareChoices,proposed,errorFactor,errorResult,squareFree};
function evt(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F3-15 event '+key);N.events.emit('value',{engine:ID,key,value});}
function btn(t,fn,primary){return H('button',{class:'nova-btn'+(primary?' primary':''),text:t,onclick:fn});}
function ch(p,x,y,t,size=52,role='given'){return N.chalkText(p,x,y,String(t),{size,role});}
function box(p,x,y,w,h,role='support',r=19){return N.neonBox(p,x,y,w,h,{role,r});}
function mathFo(parent,x,y,w,h,src,cls=''){let fo=E('foreignObject',{x,y,width:w,height:h},parent);let d=document.createElement('div');d.className='f315-card-math '+cls;d.append(N.mt.render(src));fo.append(d);return fo;}
function sceneArt(n,options={}){
 const s=surd(n),phase=options.phase??4,challenge=!!options.challenge,selected=options.selectedFactor??null,choice=options.selectedCard??null,won=!!options.won;
 const svg=N.svg.root(1040,1180,'Glass square with area '+n+', its largest square factor and remaining factor, and matching exact surd cards.');svg.classList.add('f315-svg');svg.dataset.number=String(n);svg.dataset.phase=String(phase);
 // Area n is a whole area, separate from the multiplicative factor tiles; do not misrepresent factorisation as area subtraction.
 box(svg,55,119,515,510,'given',22);
 ch(svg,311,199,'Area = '+n,67,'given');
 ch(svg,312,369,n,145,'focus');
 ch(svg,312,447,'square units',57,'given');
 ch(svg,312,560,'Unknown side',52,'focus');
 if(phase>=1||challenge||options.interactive){
  // Explicit multiplication of factors: (square factor) × (remaining factor) = n.
  box(svg,634,147,346,214,selected!==null?'result':'focus',24);
  ch(svg,805,203,'Square factor',54,'given');
  ch(svg,805,290,selected===null?'?':String(selected),91,selected!==null?'result':'focus');
  ch(svg,805,405,'×',80,'given');
  box(svg,634,442,346,179,'op',22);
  ch(svg,805,492,'Other factor',54,'given');
  ch(svg,805,573,selected?String(n/selected):'?',76,'op');
 }else{box(svg,634,147,346,472,'support',22);ch(svg,805,343,'Find the',62,'given');ch(svg,805,433,'square factor',58,'focus');}
 // A core drawn connecting arrow, mathematical evidence and no new custom SVG primitives.
 if(challenge||options.interactive){if(selected!==null){N.svg.arrow(svg,570,401,628,401,{role:'focus'});ch(svg,313,741,`${selected} × ${n/selected} = ${n}`,56,'given');}}
 else if(phase>=2||selected!==null){N.svg.arrow(svg,570,401,628,401,{role:'focus'});ch(svg,511,741,`${selected??s.square} × ${selected?n/selected:s.b} = ${n}`,60,'given');}
 else ch(svg,511,741,phase===0?'Find a perfect-square factor':'Find the largest square factor',52,'given');
 if(challenge){
  if(selected===null){
   ch(svg,515,811,'Choose the largest square factor',45,'focus');
   (options.factorOptions||squareChoices(n)).forEach((v,i)=>{let xx=52+i*332,y=855,w=310,h=121,g=E('g',{'data-factor':v},svg);box(g,xx,y,w,h,'op',20);ch(g,xx+w/2,y+82,String(v),77,'given');if(options.onFactor)N.ui.svgDrag(svg,g,{box:{x:xx,y,w,h},zones:()=>[{kind:'drop',id:'factor',x:634,y:147,w:346,h:214},{kind:'remove',id:'remove',x:771,y:1047,w:224,h:96}],onDrop:()=>options.onFactor(v),onRemove:()=>options.onRemove?.()});});
  }else if(choice===null){
   ch(svg,520,817,'Choose the simplest exact form',48,'focus');
   const solutions=options.answers||proposed(n);
   solutions.forEach((t,i)=>{let xx=52+i*332,y=855,w=310,h=130,g=E('g',{'data-answer':t.id},svg);box(g,xx,y,w,h,'op',20);mathFo(g,xx+6,y+4,w-12,h-8,t.src);if(options.onCard)N.ui.svgDrag(svg,g,{box:{x:xx,y,w,h},zones:()=>[{kind:'drop',id:'exact',x:634,y:638,w:346,h:143},{kind:'remove',id:'remove',x:771,y:1047,w:224,h:96}],onDrop:()=>options.onCard(t),onRemove:()=>options.onRemove?.()});});
  }else {ch(svg,518,858,'Exact-value card placed',54,'result');}
  box(svg,634,637,346,144,choice!==null?'result':'focus',21);
  if(choice!==null){let placed=E('g',{'data-placed-answer':choice.id},svg);box(placed,637,640,340,137,'result',21);mathFo(placed,650,645,315,124,choice.src);if(options.onRemove)N.ui.svgDrag(svg,placed,{box:{x:637,y:640,w:340,h:137},zones:()=>[{id:'remove',kind:'remove',x:771,y:1047,w:224,h:96}],onRemove:options.onRemove});}
  else ch(svg,805,727,'Exact form',53,'given');
  box(svg,771,1047,224,96,'error',16);ch(svg,884,1111,'Remove',59,'error');
 }else if(options.interactive){
  ch(svg,515,802,'Extract the square factor',50,'focus');
  const choices=squareChoices(n);
  choices.forEach((v,i)=>{const xx=51+i*332,y=860,w=312,h=114,g=E('g',{'data-factor':v},svg);box(g,xx,y,w,h,'op',19);ch(g,xx+w/2,y+76,String(v),75,'given');N.ui.svgDrag(svg,g,{box:{x:xx,y,w,h},zones:()=>[{id:'factor',kind:'drop',x:634,y:147,w:346,h:214},{id:'remove',kind:'remove',x:771,y:1046,w:224,h:95}],onDrop:()=>options.onFactor?.(v),onRemove:options.onRemove});});
  box(svg,771,1046,224,95,'error',15);ch(svg,883,1110,'Remove',58,'error');
 }else{
  if(phase>=3){box(svg,70,855,900,174,'support',23);ch(svg,522,924,phase===3?'Take the square root of the square factor':'Keep the remaining root exact',51,phase===4?'result':'given');}
  if(phase===4){N.neonRing(svg,900,924,{role:'result',r:20,pulse:false});}
 }
 if(options.celebrate&&!N.reducedMotion())N.motion.flash(svg,805,718,'result',39);
 return svg;
}
function view(stage,n,options={}){
if(window.NovaLessonComponent?.active){[stage,n,options]=window.NovaLessonComponent.args("view",arguments);}

 stage.innerHTML='';N.cap(stage,'Surd and Exact-Value Builder',options.caption||'Find the biggest square factor.');
 const scene=H('div',{class:'f315-scene'}),side=H('aside',{class:'f315-side'}),svg=sceneArt(n,options),s=surd(n);
 const known=options.selectedFactor!==null&&options.selectedFactor!==undefined||(!options.challenge&&!options.interactive&&(options.phase??0)>=1);
 side.append(N.neonCard([H('strong',{text:'Exact, not rounded'}),H('p',{text:'A root may be irrational. Keep its exact value using surd notation unless an approximation is requested.'})],{role:'op'}),N.neonCard([H('strong',{text:'Why the factors multiply'}),H('p',{text:known?`${n} = ${options.selectedFactor??s.square} × ${n/(options.selectedFactor??s.square)}. Taking a square root extracts the perfect-square factor.`:'Look for a perfect-square factor that divides the area exactly. The two factors must multiply, not add.'})],{role:'focus'}));
 scene.append(svg,side);stage.append(scene);
 let expr=options.expression||s.original,formula=H('div',{class:'f315-formula'+(options.won?' result':'')});
 const factor=options.selectedFactor;
 if(options.challenge){if(options.won)expr=s.original+' = '+s.src;else if(options.selectedCard)expr=s.original+' = '+options.selectedCard.src;else expr=s.original+' = ?';}
 else if(options.interactive){expr=s.original+' = '+(factor?`\\sqrt{${factor}} \\times \\sqrt{${n/factor}}`: '?');}
 else if((options.phase??4)===1)expr=s.original+' = '+`\\sqrt{${s.square} \\times ${s.b}}`;
 else if((options.phase??4)===2)expr=s.original+' = '+`\\sqrt{${s.square}} \\times \\sqrt{${s.b}}`;
 else if((options.phase??4)===3)expr=s.original+' = '+s.a+'\\sqrt{'+s.b+'}';
 else if((options.phase??4)>=4)expr=s.original+' = '+s.src;
 formula.append(N.mt.render(expr));stage.append(H('div',{class:'f315-top-proof'},[formula,H('div',{class:'f315-stage-desc',text:options.helper||'A square factor leaves the root; the remaining factor stays inside.'})]));
 N.scene.helperStrip(stage,POSES[options.say||'explore']||'think',PHRASES[options.say||'explore']||'Your turn!');return svg;
}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let n=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("n",()=>(C.presets[C.preset].n)):(C.presets[C.preset].n)),selected=null,message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Find the largest square factor.')):('Find the largest square factor.')),saying='explore',bad=false;
 window.NovaLessonComponent?.applyExploreModels();let preset=H('select',{'aria-label':'Choose surd preset'}),number=H('input',{type:'number',min:2,max:200,step:1,'aria-label':'Area to simplify'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,v])=>preset.add(new Option(v.label,k)));
 window.NovaLessonComponent?.applyExploreModels();function pick(v){let why=errorFactor(n,v);evt('factor',v);if(why){message=why;bad=true;saying='wrong';render();return false;}selected=v;message=`${n} = ${v} × ${n/v}. Its square root can be taken outside.`;bad=false;saying='correct';render();return true;}
 window.NovaLessonComponent?.applyExploreModels();function reset(){selected=null;message='Find the largest square factor.';saying='explore';bad=false;evt('reset',true);render();}
 window.NovaLessonComponent?.applyExploreModels();function render(){const s=surd(n);view(stage,n,{interactive:true,selectedFactor:selected,onFactor:pick,onRemove:()=>{reset();},say:saying,caption:'Explore square factors',helper:'Choose the largest perfect-square factor.'});
 panel.innerHTML='';preset.value=Object.entries(C.presets).find(([k,v])=>v.n===n)?.[0]||C.preset;number.value=n;
 panel.append(H('div',{class:'f315-form'},[H('label',{},['Preset',preset]),H('label',{},['Area',number]),btn('Find factor',()=>pick(s.square),true),btn('Reset',reset)]));
 panel.append(H('p',{class:'f315-info',text:'Drag a numbered square-factor tile to the glowing factor slot, or use the buttons below. Square factors multiply with the remaining factor; they do not add.'}));
 panel.append(H('div',{class:'f315-form'},squareChoices(n).map(v=>btn('Use '+v,()=>pick(v)))));
 if(selected!==null){const fo=H('div',{class:'f315-formula result'});fo.append(N.mt.render(s.original+' = '+s.src));panel.append(fo);}
 panel.append(H('p',{role:'status',class:'f315-status'+(bad?' bad':''),text:message}));
 preset.onchange=()=>{n=C.presets[preset.value].n;evt('preset',preset.value);selected=null;bad=false;message='Find the square factor.';saying='explore';render();};
 number.onchange=()=>{n=Math.max(2,Math.min(200,Math.round(Number(number.value)||72)));evt('number',n);selected=null;bad=false;message='Find the square factor.';render();};
 }window.NovaLessonComponent?.applyExploreModels();render();}
function challenge(panel,api,stage){let idx=0,total=0,selected=null,answer=null,said='ready',message='Start by extracting the largest square factor.',wrong=false,timeout=null;
 api.onCleanup(()=>{if(timeout)clearTimeout(timeout);});
 function finish(){panel.innerHTML='';view(stage,72,{phase:4,won:true,say:'win',caption:'Four exact values proved',celebrate:true});panel.append(H('p',{class:'f315-banner',text:'Four exact surd proofs complete! You extracted every square factor and kept the exact values.'}));evt('proof',{complete:true,total});}
 function current(){return C.challenge[idx];}
 function pickFactor(v){const n=current().n,why=errorFactor(n,v);evt('factor',{round:idx,value:v});if(why){wrong=true;said='wrong';message=why;api.check(false,why,{round:idx,phase:'factor'});update();return false;}selected=v;answer=null;said='correct';wrong=false;message='Square factor correct. Now choose the simplest exact surd.';render();return true;}
 function pickCard(t){const n=current().n;if(selected===null){message='Find the square factor before placing the answer.';wrong=true;update();return false;}let why=errorResult(n,t);evt('card',{round:idx,id:t.id});if(why){wrong=true;said='wrong';message=why;api.check(false,why,{round:idx,phase:'form'});update();return false;}answer=t;wrong=false;said='correct';message='Exact-value card placed. Press Check proof, or drag it to Remove.';render();return true;}
 function remove(){selected=null;answer=null;said='remove';wrong=false;message='Removed. Find the largest square factor again.';evt('remove',{round:idx});render();return true;}
 function confirm(){if(selected===null){wrong=true;message='First extract the largest square factor.';update();return false;}if(answer===null){wrong=true;message='Place a simplest-form surd card before checking.';update();return false;}if(errorFactor(current().n,selected)||errorResult(current().n,answer)){wrong=true;message='Recheck the factor and exact form.';update();return false;}
 total++;evt('proof',{round:idx,value:answer.src});api.check(true,'Correct: exact simplified form.',{round:idx});view(stage,current().n,{phase:4,won:true,celebrate:true,say:'finish',caption:'Simplification proved'});
 panel.innerHTML='';let fo=H('div',{class:'f315-formula result'});fo.append(N.mt.render(surd(current().n).original+' = '+surd(current().n).src));panel.append(fo);timeout=setTimeout(()=>{idx++;selected=null;answer=null;said='ready';wrong=false;message='Start by extracting the largest square factor.';if(idx>=C.challenge.length)finish();else render();},1050);return true;}
 function render(){if(idx>=C.challenge.length){finish();return;}const t=current();view(stage,t.n,{challenge:true,phase:4,selectedFactor:selected,selectedCard:answer,factorOptions:t.squareChoices,answers:proposed(t.n),onFactor:pickFactor,onCard:pickCard,onRemove:remove,say:said,caption:'Proof '+(idx+1)+' of '+C.challenge.length,helper:'Square factor first, then simplest exact form.'});update();}
 function update(){if(idx>=C.challenge.length)return;const t=current(),s=surd(t.n);
 panel.innerHTML='';panel.append(H('p',{class:'f315-info',text:`Proof ${idx+1} of ${C.challenge.length}. Find the simplest exact form of the square root of ${t.n}.`}),
  H('div',{class:'f315-form'},selected===null?t.squareChoices.map(v=>btn('Square factor '+v,()=>pickFactor(v))):proposed(t.n).map(a=>{let b=H('button',{class:'nova-btn',onclick:()=>pickCard(a)});b.append(N.mt.render(a.src));return b;})),
  H('div',{class:'f315-form'},[btn('Remove / restart',remove),btn('Check proof',confirm,true),btn('Hint',()=>{const hint=selected===null?'Find the largest square that divides '+t.n+'.':`The square root of ${selected} is ${Math.sqrt(selected)}. Keep the other factor under the root.`;evt('hint',hint);api.hint(hint);message=hint;said='hint';wrong=false;update();})]),
  H('p',{class:'f315-status'+(wrong?' bad':''),role:'status',text:message}));
 }
 render();}
const def={id:ID,title:'Surd and Exact-Value Builder',config:C,steps:STEPS,
 alt:'A premium neon square with specified area, a largest-square-factor tile and remaining-factor tile connected by multiplication, with exact surd cards.',
 staticAlt:'To simplify square root of 72, factor 72 as 36 times 2. Square root 36 is 6, so the exact simplest form is 6 square root 2.',
 render(i,stage){const n=C.presets[C.preset].n,s=surd(n);view(stage,n,{phase:i,selectedFactor:i>=1?s.square:null,say:STEPS[i].say,caption:STEPS[i].name,celebrate:i===4});},
 exploreIntro:'Find the biggest square factor, then leave the exact root in simplest form.',explore,challenge,onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['surds','exact roots','square factors','powers','irrational numbers'],deps:['F0-02','F0-05','F0-03','F0-04','F0-08','F3-09','F3-11']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"view":["stage","n","options"]},exploreFields:{"n":{"kind":"value","factory":null,"argCount":null},"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'15',title:'Surd and Exact-Value Builder · Premium Review',def,linked:['F3-09','F3-10','F3-11'],years:'Year 9 · Powers, roots and exact values',spec:{purpose:'Distinguish exact surd values from decimal approximations and extract the largest square factor.',params:'Area n from 2 to 200; largest square factor and square-free radicand.',presets:'Y9-002: 72, 50, 108, 45 and 64, with editable n in Explore.',steps:'Factorise n → isolate largest square factor → separate roots → take the square root → simplest surd form.',interactions:'Drag factor tiles to the factor slot, drag exact-result cards to the proof slot, remove and retry; all drag actions have keyboard buttons.',traps:'Replacing exact value with decimal; using a non-square divisor; confusing multiplication with subtraction; stopping at a non-simplest equivalent surd.',gcse:'Extends to surd simplification, rationalising, exact geometry and algebra with irrational expressions.'}});
// F3-local fast movement recovery: reuse unchanged F0 drag transaction, do not invent a new drag mechanism.
(function(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA maths helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{subtree:true,childList:true});
})();
