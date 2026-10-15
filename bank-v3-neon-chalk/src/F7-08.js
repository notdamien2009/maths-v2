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

/* F7-08 Balance Scales · canonical F0 house core · engine + F7-09/F7-10 presets. */
const F708_CONFIG={id:'F7-08',startMode:'watch',preset:document.body?.dataset.entryPreset||'Y7-033-one-step',parameters:{a:'integer',b:'integer',c:'integer',d:'integer',solution:'integer'},
 presets:{
  'Y7-033-one-step':{label:'Y7 · One-step equation',a:1,b:3,c:0,d:7,skin:'bags',context:'One mystery bag and three weights balance seven weights.'},
  'Y7-035-context':{label:'Y7 · Bags in a story',a:2,b:2,c:0,d:8,skin:'bags',context:'Two bags and two weights equal eight weights.'},
  'Y8-013-brackets':{label:'Y8 · Brackets first',a:2,b:4,c:0,d:10,skin:'bags',display:'2(x + 2) = 10',context:'Expand the bracket before removing equal weights.'},
  'Y8-014-both-sides':{label:'Y8 · Unknown on both sides',a:2,b:3,c:1,d:8,skin:'bags',context:'Both pans contain mystery bags; cancel one from each.'},
  'F7-09-negatives':{label:'F7-09 · Negative balloons',a:2,b:-3,c:1,d:2,skin:'balloons',context:'Negative balloons lift up. Keep both sides equal.'},
  'F7-09-signed-unit':{label:'F7-09 · Signed one-step',a:1,b:-2,c:0,d:4,skin:'balloons',context:'Add two weights to each pan to cancel two negative balloons.'},
  'F7-09-unknowns-both':{label:'F7-09 · Signed unknowns on both pans',a:3,b:-2,c:2,d:4,skin:'balloons',context:'Remove two x bags on each side, then cancel negative balloons.'},
  'F7-09-negative-x':{label:'F7-09 · Negative unknown',a:-1,b:8,c:0,d:3,skin:'balloons',context:'A negative x bag lifts: −x + 8 = 3. Remove equal units and reverse the sign.'},
  'F7-10-cups':{label:'F7-10 · Cups and counters',a:2,b:2,c:0,d:10,skin:'cups',context:'Two mystery cups and two counters have the same value as ten counters.'},
  'F7-10-one-cup':{label:'F7-10 · One mystery cup',a:1,b:3,c:0,d:7,skin:'cups',context:'Remove three counters from both sides to reveal one cup.'},
  'F7-10-three-cups':{label:'F7-10 · Three cups',a:3,b:3,c:0,d:12,skin:'cups',context:'Remove three counters from both sides, then share nine between three cups.'},
  'F7-10-context':{label:'F7-10 · Equal-share story',a:2,b:4,c:0,d:12,skin:'cups',context:'Two sealed cups and four loose counters match twelve counters.'}
 },challenge:[
  {a:1,b:3,c:0,d:7,skin:'bags'},
  {a:2,b:2,c:0,d:8,skin:'bags'},
  {a:2,b:3,c:1,d:8,skin:'bags'},
  {a:2,b:-3,c:1,d:2,skin:'balloons'}
 ],cupsChallenge:[
  {a:1,b:3,c:0,d:7,skin:'cups'},
  {a:2,b:2,c:0,d:10,skin:'cups'},
  {a:3,b:3,c:0,d:12,skin:'cups'},
  {a:2,b:4,c:0,d:12,skin:'cups'}
 ],signedChallenge:[
  {a:2,b:-3,c:1,d:2,skin:'balloons'},
  {a:1,b:-2,c:0,d:4,skin:'balloons'},
  {a:3,b:-2,c:2,d:4,skin:'balloons'},
  {a:-1,b:8,c:0,d:3,skin:'balloons'}
 ],events:{value:['preset','operation','pending','paired','restore','answer','round','reset','undo','add','remove','keyboard','state','zeroPair','zeroCancel','share','unshare'],types:['step','correct','hintUsed','mode']}};
window.F708_CONFIG=F708_CONFIG;
(function(){'use strict';
const N=window.NOVA,E=N.svg.el,H=N.h,C=window.NovaV2Integration.configuration(F708_CONFIG),ID=C.id;
const IS_SIGNED_ENTRY=document.body?.dataset.entryVariant==='F7-09';
const IS_CUPS_ENTRY=document.body?.dataset.entryVariant==='F7-10';
const START_PRESET=C.preset;
const CHALLENGES=IS_CUPS_ENTRY?C.cupsChallenge:(IS_SIGNED_ENTRY?C.signedChallenge:C.challenge);
const MESSAGES={load:['compare','Are the pans equally heavy?'],balanced:['point','Both sides must stay equal.'],subtract:['count','Take the same away on BOTH sides.'],isolate:['idea','The mystery bag is on its own!'],solve:['cheer','We kept the balance!'],explore:['compare','Keep it balanced!'],pending:['oops','Only one pan changed. Find its partner!'],wrong:['oops','Check both pans!'],hint:['think','Do the same on each side.'],correct:['cheer','Equation balanced!'],finish:['cheer','All balances solved!'],zero:['point','A positive and negative pair has zero total!'],cancel:['cheer','Zero pairs cancel without changing equality!'],cups:['point','A cup hides the unknown!'],share:['count','Make equal piles, one for each cup!'],shared:['cheer','Equal piles show the value inside each cup!'],balloons:['think','A negative balloon lifts up!']};
function dock(stage,cue){
if(window.NovaLessonComponent?.active){[stage,cue]=window.NovaLessonComponent.args("dock",arguments);}
const [pose,caption]=MESSAGES[cue]||MESSAGES.load;N.scene.helperStrip(stage,pose,caption);}
function emit(key,value){if(!C.events.value.includes(key))throw Error('F7-08 event not declared: '+key);N.events.emit('value',{engine:ID,key,value});}
function txt(g,x,y,s,role='given',size=34,anchor='middle'){return N.chalkText(g,x,y,String(s),{role,size,anchor});}
function box(g,x,y,w,h,role='given',r=12){return N.neonBox(g,x,y,w,h,{role,r});}
function line(g,x,y,X,Y,role='op',width=3.4){return N.neonLine(g,x,y,X,Y,{role,width});}
function path(g,d,role='given',width=3.3){return N.neonPath(g,d,{role,width});}
function ring(g,x,y,role='focus',r=10){return N.neonRing(g,x,y,{role,r,pulse:false});}
const btn=(t,fn,primary=false)=>H('button',{class:'nova-btn'+(primary?' primary':''),text:t,onclick:fn});
const copy=m=>({a:m.a,b:m.b,c:m.c,d:m.d,skin:m.skin||'bags',display:m.display||'',context:m.context||''});
function solution(p){const k=p.a-p.c;if(!Number.isInteger(k)||k===0)throw Error('No unique x');const x=(p.d-p.b)/k;if(!Number.isInteger(x)||x<0||x>12)throw Error('Unsupported solution');return x;}
function equation(m){const side=(a,b)=>{const terms=[];if(a!==0)terms.push(a===1?'x':a===-1?'−x':a+'x');if(b!==0)terms.push((b<0?'− ':'+ ')+Math.abs(b));if(terms.length===0)return '0';const s=terms.join(' ').replace(/^\+ /,'');return s;};return side(m.a,m.b)+' = '+side(m.c,m.d);}
function countArray(n){return Array.from({length:Math.abs(n)},(_,i)=>i);}
function items(m,side,pending){const a=side==='left'?m.a:m.c,b=side==='left'?m.b:m.d,res=[];countArray(a).forEach((i)=>res.push({id:`${side}-x-${i}`,side,type:'x',sign:Math.sign(a)}));countArray(b).forEach((i)=>res.push({id:`${side}-u-${i}`,side,type:'unit',sign:Math.sign(b)}));if(pending&&pending.action==='remove'&&pending.side===side){const i=res.findIndex(x=>x.type===pending.type&&x.sign===pending.sign);if(i>=0)res.splice(i,1);}if(pending&&pending.action==='add'&&pending.side===side)res.push({id:side+'-new-'+pending.type,side,type:pending.type,sign:pending.sign});return res;}
function difference(m,pending){const x=solution(m),val=s=>items(m,s,pending).reduce((a,t)=>a+(t.type==='x'?x:1)*t.sign,0);return val('left')-val('right');}
function mathOp(m,kind,count){const r=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("mathOp.r",(...a)=>copy(...a),[m]):(copy(m)));if(kind==='unit'){r.b+=count;r.d+=count;}else if(kind==='x'){r.a+=count;r.c+=count;}else if(kind==='negate'){for(const k of ['a','b','c','d'])r[k]=-r[k];}else if(kind==='divide'){if(count<=0||[r.a,r.b,r.c,r.d].some(v=>v%count!==0))return null;for(const k of ['a','b','c','d'])r[k]/=count;}else return null;return r;}
function isIsolated(m){return(m.a===1&&m.b===0&&m.c===0)||(m.c===1&&m.d===0&&m.a===0);}
function answerFeedback(v,m){const n=Number(String(v).trim().replace(/^x\s*=\s*/i,'')),x=solution(m);if(!String(v).trim()||!Number.isFinite(n))return 'Write a number for x. Check that both sides are equal.';if(n===x)return'';if(n===m.d-m.b)return'You found the difference in the unit weights, but forgot to share it between the x bags.';if(n===-x)return'The sign is reversed. A negative balloon represents a negative value, not the value of x.';if(n===m.d||n===m.b)return'You copied the number of weights from one pan. Isolate the x bag first.';return`Try replacing each x bag with ${n} units: one pan would be heavier. Keep both sides equal.`;}
function zeroPairTokens(side,amount){const z=[];for(let i=0;i<Math.min(3,Math.max(0,amount||0));i++){z.push({id:`${side}-zero-plus-${i}`,side,type:'unit',sign:1,zeroPair:true});z.push({id:`${side}-zero-minus-${i}`,side,type:'unit',sign:-1,zeroPair:true});}return z;}
function geometry(){const small=innerWidth<=720,W=small?620:1000,V=small?785:725,cx=W/2,pivotY=218,dx=small?164:283,panW=small?257:332,panY=399;return{small,W,V,cx,pivotY,dx,panW,panY,trayY:small?544:548,coin:small?45:51,spacing:small?47:56};}
function tiltAngle(m,pending){const diff=difference(m,pending);return Math.max(-7.5,Math.min(7.5,-diff*1.8));}
function token(parent,t,x,y,z,skin,roleOverride){const g=E('g',{},parent);const c=t.sign<0?'error':t.type==='x'?'op':'result',role=roleOverride||c,w=z,h=z*1.03;
 if(t.type==='x'&&skin==='cups'){path(g,`M ${x+5} ${y+5} L ${x+w-5} ${y+5} L ${x+w-13} ${y+h-7} Q ${x+w/2} ${y+h+4} ${x+13} ${y+h-7} Z`,role,3.1);line(g,x+4,y+5,x+w-4,y+5,role,3.2);txt(g,x+w/2,y+h*.68,'x',role,Math.max(29,z*.69));}
 else if(t.type==='x'){path(g,`M ${x+8} ${y+9} Q ${x+z/2} ${y-7} ${x+z-8} ${y+9} L ${x+z-4} ${y+z*.84} Q ${x+z/2} ${y+z+5} ${x+4} ${y+z*.84} Z`,role,3.4);line(g,x+z*.30,y+7,x+z*.70,y+7,role,2.1);if(t.sign<0){line(g,x+z*.22,y+z*.23,x+z*.78,y+z*.43,'error',2.1);line(g,x+z*.22,y+z*.39,x+z*.65,y+z*.55,'error',2.1);}
 txt(g,x+z/2,y+z*.73,t.sign<0?'−x':'x',role,Math.max(29,z*.65));}
 else if(t.sign<0){N.neonRing(g,x+w/2,y+h*.46,{role:'error',r:z*.42,pulse:false});line(g,x+w/2,y+h*.87,x+w/2-8,y+h*1.10,'error',2.3);line(g,x+w/2-8,y+h*1.10,x+w/2+3,y+h*1.20,'error',2.3);txt(g,x+w/2,y+h*.66,'−1','error',Math.max(27,z*.55));}
 else if(skin==='cups'){N.neonRing(g,x+w/2,y+h*.5,{role:'result',r:z*.42,pulse:false});txt(g,x+w/2,y+h*.69,'1','result',Math.max(30,z*.72));}
 else{box(g,x+2,y+4,z-4,z-6,role,Math.max(7,z*.19));line(g,x+11,y+15,x+z-11,y+15,role,2);txt(g,x+z/2,y+z*.77,'1',role,Math.max(29,z*.67));}
 return g;}
/* F7-10 preset skin: a separate cups-and-counters board, NOT a second engine. */
function cupsSvg(m,opts={}){
 const small=innerWidth<=720,W=small?620:1000,V=small?775:705,mid=W/2;
 const pending=opts.pending||null,distribution=Array.isArray(opts.distribution)?opts.distribution:[],placed=distribution.reduce((a,b)=>a+b,0);
 const leftItems=items(m,'left',pending),rightItems=items(m,'right',pending);
 const shareReady=!!opts.interactive&&!pending&&m.a>=1&&m.b===0&&m.c===0&&m.d>=0&&m.d%m.a===0;
 const cap=Math.max(1,m.a),xValue=m._transition?0:solution(m),perCup=m.a>0?m.d/m.a:0;
 const svg=N.svg.root(W,V,'Cups-and-counters equation board. Mystery x cups and one-unit counters lie either side of a vertical neon equality divider. Drag matched counters to RETURN to remove one from each side, then distribute the remaining right-hand counters equally into cups.');
 svg.classList.add('f708-svg','f710-svg');svg.dataset.skin='cups';svg.dataset.equation=m._transition?m.display:equation(m);svg.dataset.solution=String(m._transition?'transition':xValue);svg.dataset.pending=pending?`${pending.action}-${pending.side}-${pending.type}-${pending.sign}`:'';
 svg.dataset.shared=String(placed);svg.dataset.shareReady=String(shareReady);svg.dataset.shareCounts=distribution.join(',');svg.dataset.left=String(leftItems.length);svg.dataset.right=String(rightItems.length);
 txt(svg,24,49,'CUPS & COUNTERS','given',small?37:48,'start');
 txt(svg,24,97,opts.caption&&opts.caption.length<42?opts.caption:'Both sides represent the same amount.','support',small?25:29,'start');
 txt(svg,mid,158,m._transition?(m.display||'Build the equation'):equation(m),'given',small?39:48);
 // Divider and visual equality evidence. Never fabricate a tilted beam for the cup model.
 line(svg,mid,208,mid,small?555:540,'focus',5);
 txt(svg,mid,216,'=','focus',30);
 const leftCx=mid-(small?153:255),rightCx=mid+(small?153:255);
 txt(svg,leftCx,217,'LEFT SIDE','given',small?28:35);
 txt(svg,rightCx,217,'RIGHT SIDE','given',small?28:35);
 line(svg,25,550,mid-24,550,'op',4);line(svg,mid+24,550,W-25,550,'result',4);
 const cupUnit=small?64:75,cupXs=[],slots=small?3:4;
 const cups=leftItems.filter(t=>t.type==='x');const lc=leftItems.filter(t=>t.type==='unit');
 cups.forEach((t,i)=>{
  const cols=Math.min(slots,cups.length),row=Math.floor(i/slots),col=i%slots,perRow=Math.min(slots,cups.length-row*slots);
  const x=leftCx-(perRow-1)*(cupUnit+8)/2+col*(cupUnit+8)-cupUnit/2,y=269+row*93;
  cupXs.push({x,y,i,cx:x+cupUnit/2,cy:y+cupUnit/2});
  const g=E('g',{'data-f710-cup':i,'data-f708-token':t.id,'data-side':'left','data-type':'x','data-sign':t.sign,tabindex:opts.interactive?0:-1,role:'button','aria-label':`Mystery cup ${i+1}. Press Delete to remove a cup from the left side. Drop equal-share counters into this cup after isolating the cups.`},svg);
  token(g,t,x,y,cupUnit,'cups');if(opts.enter&&!N.reducedMotion())N.motion.arrive(g,0,-15,180+i*68);
  if(opts.interactive){g.addEventListener('keydown',e=>{if(['Delete','Backspace','r','R'].includes(e.key)){e.preventDefault();opts.remove('left','x',t.sign,'keyboard');}});
   N.ui.svgDrag(svg,g,{box:{x,y,w:cupUnit,h:cupUnit},zones:()=>[{id:'return',kind:'remove',x:mid-77,y:V-131,w:154,h:79}],onRemove:()=>opts.remove('left','x',t.sign,'drag')});}
  if(distribution[i]>0){txt(svg,x+cupUnit/2,y+cupUnit+28,`${distribution[i]} counter${distribution[i]===1?'':'s'}`,'result',small?23:28);}
 });
 const u=Math.min(47,small?40:47),gap=small?43:49;
 lc.forEach((t,i)=>{const perRow=small?4:5,row=Math.floor(i/perRow),col=i%perRow,width=Math.min(perRow,lc.length-row*perRow),x=leftCx-(width-1)*gap/2+col*gap-u/2,y=399+row*49;
 const g=E('g',{'data-f708-token':t.id,'data-side':'left','data-type':'unit','data-sign':t.sign,tabindex:opts.interactive?0:-1,role:'button','aria-label':'Left loose counter. Press Delete to remove a matching counter from both sides.'},svg);token(g,t,x,y,u,'cups');
 if(opts.interactive){g.addEventListener('keydown',e=>{if(['Delete','Backspace','r','R'].includes(e.key)){e.preventDefault();opts.remove('left','unit',t.sign,'keyboard');}});
  N.ui.svgDrag(svg,g,{box:{x,y,w:u,h:u},zones:()=>[{id:'return',kind:'remove',x:mid-77,y:V-131,w:154,h:79},{id:'right',kind:'drop',x:mid+26,y:234,w:mid-53,h:318}],onRemove:()=>opts.remove('left','unit',t.sign,'drag'),onDrop:id=>opts.transfer('left',id,'unit',t.sign)});}
 });
 // Grouping is a REARRANGEMENT of loose right-hand counters, not subtraction from one side.
 const rightLoose=rightItems.filter(t=>t.type==='unit').slice(placed);const rightCups=rightItems.filter(t=>t.type==='x');
 rightCups.forEach((t,i)=>{const x=rightCx-40+(i%3-1)*80,y=273+Math.floor(i/3)*85;const g=E('g',{'data-f708-token':t.id,'data-side':'right','data-type':'x','data-sign':t.sign,tabindex:opts.interactive?0:-1,role:'button','aria-label':'Right unknown cup. Press Delete to remove a matching cup.'},svg);token(g,t,x,y,cupUnit,'cups');if(opts.interactive){g.addEventListener('keydown',e=>{if(['Delete','Backspace','r','R'].includes(e.key)){e.preventDefault();opts.remove('right','x',t.sign,'keyboard');}});N.ui.svgDrag(svg,g,{box:{x,y,w:cupUnit,h:cupUnit},zones:()=>[{id:'return',kind:'remove',x:mid-77,y:V-131,w:154,h:79}],onRemove:()=>opts.remove('right','x',t.sign,'drag')});}});
 const rc=rightLoose.length,gapR=small?45:52,sizeR=small?41:47,rowSize=small?4:5;
 rightLoose.forEach((t,i)=>{const row=Math.floor(i/rowSize),col=i%rowSize,perRow=Math.min(rowSize,rc-row*rowSize),x=rightCx-(perRow-1)*gapR/2+col*gapR-sizeR/2,y=273+row*(small?54:59);
 const g=E('g',{'data-f708-token':t.id,'data-side':'right','data-type':'unit','data-sign':t.sign,'data-f710-loose':true,tabindex:opts.interactive?0:-1,role:'button','aria-label':'Right loose counter. Press Delete to remove a matching counter. After removing knowns, drop this counter into a cup to share equally.'},svg);token(g,t,x,y,sizeR,'cups');if(opts.enter&&!N.reducedMotion()&&i<11)N.motion.arrive(g,0,-13,200+i*37);
 if(opts.interactive){g.addEventListener('keydown',e=>{if(/^[1-4]$/.test(e.key)&&shareReady){e.preventDefault();opts.share(Number(e.key)-1);}if(['Delete','Backspace','r','R'].includes(e.key)){e.preventDefault();opts.remove('right','unit',t.sign,'keyboard');}});
 N.ui.svgDrag(svg,g,{box:{x,y,w:sizeR,h:sizeR},zones:()=>[...cupXs.map(c=>({id:'cup-'+c.i,kind:'drop',x:c.x-11,y:c.y-11,w:cupUnit+22,h:cupUnit+22})),{id:'return',kind:'remove',x:mid-77,y:V-131,w:154,h:79},...(!shareReady?[{id:'left',kind:'drop',x:25,y:234,w:mid-53,h:318}]:[])],onDrop:id=>id.startsWith('cup-')?opts.share(Number(id.slice(4))):opts.transfer('right',id,'unit',t.sign),onRemove:()=>opts.remove('right','unit',t.sign,'drag')});}}
 );
 if(shareReady){const ready=placed===m.d;txt(svg,rightCx,526,ready?`x = ${perCup}`:`SHARE ${m.d-placed} COUNTERS`,'result',small?26:34);if(ready)ring(svg,rightCx,489,'result',17);}
 // Clearly marked source and return are spatially separate on narrow screens.
 const tray=V-132;box(svg,mid-81,tray,162,78,'error',16);txt(svg,mid,tray+50,'RETURN','error',small?30:34);
 if(opts.interactive){const source=[{type:'unit',sign:1},{type:'x',sign:1}],spots=small?[{x:47,y:V-115},{x:W-97,y:V-115}]:[{x:130,y:V-115},{x:W-185,y:V-115}];
 source.forEach((t,i)=>{const v=spots[i],g=E('g',{'data-f708-source':t.type,tabindex:0,role:'button','aria-label':`Source ${t.type==='x'?'cup':'counter'}. Press L to add left or R to add right.`},svg);token(g,t,v.x,v.y,48,'cups');txt(svg,v.x+24,v.y+69,t.type==='x'?'+x':'+1','given',small?26:30);
 g.addEventListener('keydown',e=>{if(['l','r'].includes(e.key.toLowerCase())){e.preventDefault();opts.add(e.key.toLowerCase()==='l'?'left':'right',t.type,1,'keyboard');}});
 N.ui.svgDrag(svg,g,{box:{x:v.x,y:v.y,w:48,h:48},zones:()=>[{id:'left',kind:'drop',x:26,y:245,w:mid-52,h:305},{id:'right',kind:'drop',x:mid+26,y:245,w:mid-52,h:305}],onDrop:id=>opts.add(id,t.type,1,'drag')});});}
 if(pending){ring(svg,mid,206,'error',15);txt(svg,mid,236,'MATCH','error',small?23:28);}else{ring(svg,mid,206,'result',13);}
 if(opts.celebrate)N.motion.flash(svg,mid,205,'result',55);
 return svg;
}
function makeSvg(m,opts={}){if(m.skin==='cups')return cupsSvg(m,opts);const F=geometry(),pending=opts.pending||null,angle=opts.forceTilt==null?tiltAngle(m,pending):opts.forceTilt,
 svg=N.svg.root(F.W,F.V,'Neon balance scale: x bags and unit weights are shown on left and right pans. Equal values keep the beam level; removing only one weight temporarily tilts the beam.');svg.classList.add('f708-svg');svg.dataset.equation=m._transition?m.display:equation(m);svg.dataset.tilt=String(angle);svg.dataset.pending=pending?`${pending.action}-${pending.side}-${pending.type}-${pending.sign}`:'';svg.dataset.solution=String(m._transition?"transition":solution(m));svg.dataset.left=String(items(m,'left',pending).length);svg.dataset.right=String(items(m,'right',pending).length);svg.dataset.zeroLeft=String(opts.zeroPairs?.left||0);svg.dataset.zeroRight=String(opts.zeroPairs?.right||0);
 txt(svg,24,46,IS_SIGNED_ENTRY?'SIGNED BALANCE':'BALANCE SCALES','given',F.small?37:48,'start');txt(svg,24,93,F.small?(pending?'One pan changed!':'Keep both sides equal.'):(pending?'ONE PAN CHANGED — MATCH THE OTHER!':(opts.caption||'Equal weight means equal value.')),pending?'error':'support',F.small?29:34,'start');txt(svg,F.cx,155,m._transition?m.display:equation(m),'given',F.small?43:54);
 // Fulcrum, foot, sculpted neon stand: all drawing via canonical helpers.
 path(svg,`M ${F.cx} ${F.pivotY+14} L ${F.cx-43} 516 L ${F.cx+43} 516 Z`,'support',5);box(svg,F.cx-69,516,138,18,'given',9);ring(svg,F.cx,F.pivotY,'focus',17);
 const radial=angle*Math.PI/180,location=side=>{const s=side==='left'?-1:1;return{x:F.cx+s*F.dx*Math.cos(radial),y:F.pivotY+s*F.dx*Math.sin(radial)};};
 const L=location('left'),R=location('right');
 // The neon beam is physically angled by unequal signed totals. Pans remain level and hung by cords.
 line(svg,L.x,L.y,R.x,R.y,'given',10);line(svg,L.x,L.y-4,R.x,R.y-4,'focus',3);ring(svg,L.x,L.y,'op',12);ring(svg,R.x,R.y,'op',12);
 for(const side of ['left','right']){const p=location(side),left=side==='left',x=p.x,panY=F.panY+(p.y-F.pivotY)*.38,w=F.panW;
 line(svg,x,p.y+14,x-w*.36,panY-11,'support',3.2);line(svg,x,p.y+14,x+w*.36,panY-11,'support',3.2);
 path(svg,`M ${x-w*.49} ${panY-10} Q ${x} ${panY+47} ${x+w*.49} ${panY-10}`,'op',5.5);
 line(svg,x-w*.49,panY-10,x+w*.49,panY-10,'op',3);
 const z=items(m,side,pending).concat(zeroPairTokens(side,opts.zeroPairs?.[side]||0)),max=F.small?5:6,spacing=F.spacing,unit=F.coin;
 // Five / six-place rows keep values distinct without overcrowding either pan.
 z.forEach((t,i)=>{const row=Math.floor(i/max),col=i%max,cols=Math.min(max,z.length-row*max),xp=x-(cols-1)*spacing/2+col*spacing-unit/2,yp=panY-16-(Math.ceil(z.length/max)-row)*57-(row===0?1:0);const holder=E('g',{'data-f708-token':t.id,'data-side':side,'data-type':t.type,'data-sign':t.sign,'data-zero-pair':t.zeroPair?'true':'false',tabindex:opts.interactive?0:-1,role:'button','aria-label':t.zeroPair?`${side} zero-pair unit. Press Delete to cancel its +1 / −1 pair.`:`${left?'Left':'Right'} pan, ${t.sign<0?'negative ':''}${t.type==='x'?'unknown x bag':'one unit weight'}; press Delete to remove from this pan.`},svg);
 token(holder,t,xp,yp-(t.sign<0&&m.skin==='balloons'?10:0),unit,m.skin);if(opts.enter&&!N.reducedMotion()&&i<10)N.motion.arrive(holder,0,-16,180+i*25);
 if(opts.interactive){holder.addEventListener('keydown',e=>{if(['Delete','Backspace','r','R'].includes(e.key)){e.preventDefault();t.zeroPair?opts.cancelPair?.(side):opts.remove(side,t.type,t.sign,'keyboard');}});
 N.ui.svgDrag(svg,holder,{box:{x:xp,y:yp,w:unit,h:unit*1.06},zones:()=>[{id:'return',kind:'remove',x:F.W/2-84,y:F.trayY+16,w:168,h:77},{id:'left',kind:'drop',x:L.x-F.panW/2,y:F.panY-164,w:F.panW,h:180},{id:'right',kind:'drop',x:R.x-F.panW/2,y:F.panY-164,w:F.panW,h:180}],onDrop:id=>t.zeroPair?false:opts.transfer(side,id,t.type,t.sign),onRemove:()=>t.zeroPair?opts.cancelPair?.(side):opts.remove(side,t.type,t.sign,'drag')});}
 });
 txt(svg,x,panY+78,side==='left'?'LEFT PAN':'RIGHT PAN','given',F.small?30:34);
 if(opts.zeroPairs?.[side])txt(svg,x,panY+114,`${opts.zeroPairs[side]} × (+1 − 1) = 0`,'result',F.small?25:29);}
 const trayY=F.trayY;box(svg,F.cx-89,trayY+12,178,87,'error',15);txt(svg,F.cx,trayY+65,'RETURN','error',F.small?33:37);
 // Drag source tokens onto either pan. A single-sided addition tilts until matched on the other pan.
 if(opts.interactive){const source=[{type:'unit',sign:1},{type:'unit',sign:-1},{type:'x',sign:1}];const bw=F.small?70:94,offs=F.small?[31,F.W-102,F.cx-43]:[90,F.W-184,F.cx+143];for(let i=0;i<source.length;i++){const t=source[i],x=offs[i],y=trayY+(F.small&&i===2?111:28),g=E('g',{'data-f708-source':`${t.type}-${t.sign}`,tabindex:0,role:'button','aria-label':`Source ${t.sign<0?'negative ':''}${t.type==='x'?'x bag':'unit weight'}; press L or R to add to left or right pan.`},svg);
 token(g,t,x,y,F.small?44:49,m.skin);g.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='l'||e.key.toLowerCase()==='r'){e.preventDefault();opts.add(e.key.toLowerCase()==='l'?'left':'right',t.type,t.sign,'keyboard');}});
 txt(svg,x+25,y+82,t.type==='x'?'+x':t.sign>0?'+1':'−1',t.sign<0?'error':'support',F.small?25:29);
 N.ui.svgDrag(svg,g,{box:{x,y,w:F.small?44:49,h:F.small?44:49},zones:()=>[{id:'left',kind:'drop',x:L.x-F.panW/2,y:F.panY-164,w:F.panW,h:180},{id:'right',kind:'drop',x:R.x-F.panW/2,y:F.panY-164,w:F.panW,h:180}],onDrop:id=>opts.add(id,t.type,t.sign,'drag')});}
 }
 if(Math.abs(angle)>.01){ring(svg,F.cx,F.pivotY,'error',11);txt(svg,F.cx,194,'NOT EQUAL','error',F.small?27:32);}
 else {ring(svg,F.cx,F.pivotY,'result',10);txt(svg,F.cx,193,'BALANCED','result',F.small?28:34);}
 if(opts.zeroCancel&&!N.reducedMotion())N.motion.flash(svg,F.cx,F.pivotY,'result',42);
 if(opts.celebrate)N.motion.flash(svg,F.cx,F.pivotY,'result',50);
 return svg;}
function panelCard(label,content,role='support'){return N.neonCard([H('p',{class:'f708-kicker',text:label}),H('div',{class:'f708-maths',text:content})],{role});}
function renderScene(stage,m,opt={}){
if(window.NovaLessonComponent?.active){[stage,m,opt]=window.NovaLessonComponent.args("renderScene",arguments);}
stage.innerHTML='';N.cap(stage,m.skin==='cups'?'Cups and counters':'Equation balance',opt.heading||'Equal changes preserve equality.');const wrap=H('div',{class:'f708-layout'}),svg=makeSvg(m,opt);wrap.append(svg);
 const sides=H('aside',{class:'f708-side'},[panelCard(m.skin==='cups'?'ON THE MAT':'ON THE BEAM',m._transition?m.display:equation(m),'given'),panelCard('THE RULE',opt.pending?'One-sided change: not balanced yet.':opt.zeroPairs?.left||opt.zeroPairs?.right?'(+1) + (−1) = 0. Cancel the pair.':m.skin==='cups'?'Keep both sides equal.':'Keep the pans equal.','op'),panelCard('READ THE UNKNOWN',m.skin==='cups'&&opt.distribution?.reduce((a,b)=>a+b,0)===m.d&&m.a>0?`x = ${solution(m)}`:isIsolated(m)?`x = ${solution(m)}`:'Apply the same change to each side.','result')]);wrap.append(sides);stage.append(wrap);dock(stage,opt.cue||'balanced');return svg;}
const STEPS=[
 {name:'Meet the two pans',narration:'A mystery bag has value x. Unit weights each have a value of one. Watch what happens when we build a balanced equation.',prompt:'What does the x bag stand for?',cue:'load'},
 {name:'Load the left pan',narration:'Put the x bag and three unit weights onto the left. The balance tips because the right pan is still empty.',prompt:'Is it equal yet?',cue:'load'},
 {name:'Load the right pan',narration:'Now add seven unit weights on the right. Both pans balance. One x bag plus three has the same value as seven.',prompt:'What makes the two sides equal?',cue:'balanced'},
 {name:'Remove one from both',narration:'Take one unit weight away from each side. The pans remain equal: x plus two equals six.',prompt:'Why not take one weight from only the left?',cue:'subtract'},
 {name:'Remove two more from both',narration:'Remove two more weights from each pan. Only x remains on the left and four weights remain on the right.',prompt:'What is x now?',cue:'isolate'},
 {name:'Read the balanced solution',narration:'The unknown x is four. Check it by replacing the x bag with four units: four plus three equals seven.',prompt:'How can you check your answer?',cue:'solve'}
];
const SIGNED_STEPS=[
 {name:'Load signed weights',narration:'Two mystery bags and three negative unit balloons sit on the left. A negative balloon pulls upwards. The left side represents two x minus three.',prompt:'How does a negative balloon change the total?',cue:'balloons'},
 {name:'Balance both pans',narration:'One mystery bag and two positive units sit on the right. Both sides represent equal values: two x minus three equals x plus two.',prompt:'What must x be to balance these signed pans?',cue:'balanced'},
 {name:'Remove x from both',narration:'Remove one x bag from both pans. Because the same thing was removed twice, the equation stays equal. One x minus three equals two.',prompt:'What remains on the left?',cue:'subtract'},
 {name:'Add three to both',narration:'Add three positive units to each pan. On the left, each positive unit and negative balloon forms a zero pair. Three zero pairs are worth nothing.',prompt:'Why does a positive one and a negative one cancel?',cue:'zero'},
 {name:'Cancel the zero pairs',narration:'Remove the three zero pairs from the left. Nothing changes in value: the positive and negative units cancel. The left pan now has only x; the right pan holds five units.',prompt:'What value is left for x?',cue:'cancel'},
 {name:'Check with substitution',narration:'Replace x with five. Two times five minus three equals seven, and five plus two equals seven. Both pans balance.',prompt:'How do both sides give seven?',cue:'solve'}
];
const CUPS_STEPS=[
 {name:'Reveal the mystery cups',narration:'Each covered cup hides the same unknown number of counters. We call that value x. The divider says both sides have equal total value.',prompt:'What does every mystery cup represent?',cue:'cups'},
 {name:'Build the equality',narration:'Two mystery cups and two loose counters on the left have the same value as ten counters on the right. We write two x plus two equals ten.',prompt:'Why do two cups mean two x?',cue:'balanced'},
 {name:'Remove two from each side',narration:'Remove the two loose counters from the left and exactly two from the right. Both sides lose the same value, so they remain equal.',prompt:'How many counters remain on the right?',cue:'subtract'},
 {name:'Match one pile to each cup',narration:'Two x equals eight. Split the eight counters into two equal groups, one group for each cup. The groups must be the same size.',prompt:'How many counters belong in each equal group?',cue:'share'},
 {name:'Fill the first cup',narration:'Place four counters into the first mystery cup, using the four counters from the right side. Four more remain for the second cup.',prompt:'Does each cup have to hold the same number?',cue:'share'},
 {name:'Fill the second cup',narration:'The final four counters belong to the second cup. Both cups now contain four: x equals four.',prompt:'What value does x have?',cue:'shared'},
 {name:'Check by substitution',narration:'Replace each cup with four counters. Two groups of four plus two makes ten, the same as the ten counters on the right. The solution is correct.',prompt:'Can you check the equation using four?',cue:'correct'}
];
function cupsWatch(i,stage){const b=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("cupsWatch.b",(...a)=>copy(...a),[C.presets['F7-10-cups']]):(copy(C.presets['F7-10-cups'])));let m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("cupsWatch.m",(...a)=>copy(...a),[b]):(copy(b))),dist=[],forceTilt=0;
 if(i===0)m={...m,a:1,b:0,c:0,d:0,_transition:true,display:'x = mystery cup'};
 if(i===2){m={...m,b:0,d:8};}
 if(i>=3){m={...m,b:0,d:8};}
 if(i===4)dist=[4,0];
 if(i>=5)dist=[4,4];
 renderScene(stage,m,{caption:CUPS_STEPS[i].name,heading:CUPS_STEPS[i].name,cue:CUPS_STEPS[i].cue,distribution:dist,enter:i>0,celebrate:i===6});
}
function signedWatch(i,stage){const initial=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("signedWatch.initial",(...a)=>copy(...a),[C.presets['F7-09-negatives']]):(copy(C.presets['F7-09-negatives'])));let m=initial,zeroPairs=null,zeroCancel=false;
 if(i===0)m={...initial,c:0,d:0,display:'2x − 3',_transition:true};
 if(i===2)m={...initial,a:1,b:-3,c:0,d:2};
 if(i===3)m={...initial,a:1,b:0,c:0,d:5,display:'x + (−3 + 3) = 5',_transition:true};
 if(i===3)zeroPairs={left:3,right:0};
 if(i>=4)m={...initial,a:1,b:0,c:0,d:5};
 if(i===4)zeroCancel=true;
 renderScene(stage,m,{heading:SIGNED_STEPS[i].name,caption:SIGNED_STEPS[i].name,cue:SIGNED_STEPS[i].cue,enter:i>0,forceTilt:i===0?-6:0,zeroPairs,zeroCancel,celebrate:i===5});}
function watch(i,stage){if(IS_CUPS_ENTRY)return cupsWatch(i,stage);if(IS_SIGNED_ENTRY)return signedWatch(i,stage);const base=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.base",(...a)=>copy(...a),[C.presets['Y7-033-one-step']]):(copy(C.presets['Y7-033-one-step'])));let m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.m",(...a)=>copy(...a),[base]):(copy(base))),forceTilt=0;switch(i){case 0:m={...m,a:0,b:0,c:0,d:0};break;case 1:m={...m,c:0,d:0};forceTilt=-7;break;case 3:m={...m,b:2,d:6};break;case 4:case 5:m={...m,b:0,d:4};break;}
 // Watch's intentionally empty/unbalanced transitional pan does not have a solvable equation.
 if(i===0||i===1){m={...m,display:i===0?'Load the pans':'x + 3',_transition:true};}
 renderScene(stage,m,{caption:STEPS[i].name,cue:STEPS[i].cue,forceTilt,enter:i===1||i===2||i===3,celebrate:i===5});}
function workspace(panel,stage,mode,api){let preset=C.preset,round=0,m=null,pending=null,history=[],timer=null,cue='explore',status='',bad=false,finished=false,zeroPairs={left:0,right:0},zeroCancel=false,distribution=[],shareHistory=[];
 const presets=C.presets;
 function clearPending(restoreMessage=false){if(timer){clearTimeout(timer);timer=null;}if(pending){pending=null;if(restoreMessage){status='The unmatched one-sided change was undone. Both sides are equal again.';cue='balanced';emit('restore',{mode,round});}}}
 function load(){clearPending();zeroPairs={left:0,right:0};zeroCancel=false;distribution=[];shareHistory=[];m=copy(mode==='challenge'?CHALLENGES[round]:presets[preset]);solution(m);history=[];bad=false;status=mode==='challenge'?(m.skin==='cups'?'Use equal counters to reason, then enter x.':'Use the scale to reason, then enter the value of x.'):(m.skin==='cups'?'Remove the same counters from each side; then share the remainder equally between cups.':'Remove equal quantities from each pan. You can drag or use the buttons.');cue=m.skin==='cups'?'cups':m.skin==='balloons'?'balloons':'explore';}
 function scheduleRollback(){if(timer)clearTimeout(timer);timer=setTimeout(()=>{clearPending(true);render();},4800);}
 function gesture(side,type,sign,action,method='drag'){if(finished)return false;const old=copy(m);const matching=()=>{const opposite=side==='left'?'right':'left';const list=items(m,opposite,null);return action==='add'||list.some(t=>t.type===type&&t.sign===sign);};if(action==='remove'&&!items(m,side,pending).some(t=>t.type===type&&t.sign===sign)){status='That weight is no longer on this pan.';bad=true;render();return false;}
 if(!pending){if(!matching()){status='There is no matching piece on the opposite pan. A one-sided removal cannot solve the equation.';bad=true;cue='wrong';render();return false;}
  pending={side,type,sign,action};bad=false;cue='pending';status='One side has changed, so the beam tips. Do the same on the other side, or use Undo to restore it.';emit('pending',{side,type,sign,action,method});scheduleRollback();render();return true;}
 if(pending.side===side||pending.type!==type||pending.sign!==sign||pending.action!==action){clearPending(true);bad=true;cue='wrong';status='Different operations do not keep the balance equal. Your first change was restored.';render();return false;}
 clearPending();const v=action==='remove'?-sign:sign;const next=mathOp(m,type,v);if(!next){status='That operation is not allowed in this model.';bad=true;render();return false;}history.push(old);m=next;distribution=[];shareHistory=[];status=`Equal ${action==='remove'?'removal':'addition'} on both pans: ${equation(m)}.`;bad=false;cue=isIsolated(m)?'isolate':'balanced';emit('paired',{type,change:v,operation:action,method,equation:equation(m)});render();return true;}
 function remove(side,type,sign,method){emit('remove',{side,type,sign,method});return gesture(side,type,sign,'remove',method);}
 function add(side,type,sign,method){emit('add',{side,type,sign,method});return gesture(side,type,sign,'add',method);}
 function transfer(from,to,type,sign){if(to===from)return true;clearPending(true);status='Moving a weight between pans changes both totals in different directions. Use matching operations instead.';bad=true;cue='wrong';render();return false;}
 function addZeroPair(side){clearPending();if(!IS_SIGNED_ENTRY && m.skin!=='balloons'){status='Choose a signed balance preset to explore zero pairs.';render();return;}if(zeroPairs[side]>=3){status='Three zero pairs are visible. Cancel them to continue.';render();return;}history.push({m:copy(m),zeros:{...zeroPairs}});zeroPairs[side]++;cue='zero';bad=false;status=`Added +1 and −1 on the ${side} pan. Net change is zero, so the beam stays balanced.`;emit('zeroPair',{side,amount:zeroPairs[side],equation:equation(m)});render();}
 function cancelZeroPair(side){if(zeroPairs[side]<=0){status='No zero pair is waiting on that pan. Add a pair first.';cue='hint';render();return;}history.push({m:copy(m),zeros:{...zeroPairs}});zeroPairs[side]--;zeroCancel=true;cue='cancel';bad=false;status=`Cancelled one +1 / −1 pair on the ${side}. The equation stays unchanged.`;emit('zeroCancel',{side,remaining:zeroPairs[side],equation:equation(m)});render();zeroCancel=false;}
 function operation(type,count){clearPending();const next=mathOp(m,type,count);if(!next){status='Divide only when every term divides exactly, or choose another operation.';bad=true;cue='wrong';render();return;}history.push(copy(m));m=next;distribution=[];shareHistory=[];bad=false;cue=isIsolated(m)?'isolate':'subtract';status=`Same operation on each side: ${equation(m)}.`;emit('operation',{type,count,equation:equation(m)});render();}
 function undo(){if(distribution.reduce((a,b)=>a+b,0)>0){const previous=shareHistory.pop();distribution=previous||[];status='Returned the most recently shared counter.';cue='cups';emit('unshare',{counts:distribution.slice()});render();return;}if(pending){clearPending(true);render();return;}if(history.length){const prev=history.pop();if(prev&&prev.m){m=prev.m;zeroPairs=prev.zeros;}else m=prev;status='Undid the last paired operation.';cue='balanced';bad=false;emit('undo',{equation:equation(m)});render();}}
 function share(cupIndex){if(finished)return false;const allowed=m.skin==='cups'&&m.a>=1&&m.b===0&&m.c===0&&m.d>=0&&m.d%m.a===0&&!pending;
 if(!allowed){status='First remove the same loose counters from both sides until only cups and equal counters remain.';cue='hint';bad=true;render();return false;}
 if(!Number.isInteger(cupIndex)||cupIndex<0||cupIndex>=m.a){status='Choose an existing mystery cup.';bad=true;render();return false;}
 const count=distribution.reduce((a,b)=>a+b,0),each=m.d/m.a;
 if(count>=m.d){status='All counters have already been shared. Read the value inside one cup.';render();return false;}
 if((distribution[cupIndex]||0)>=each){status='That cup already has its fair share. Choose another cup.';bad=true;cue='wrong';render();return false;}
 shareHistory.push(distribution.slice());distribution[cupIndex]=(distribution[cupIndex]||0)+1;
 const complete=distribution.reduce((a,b)=>a+b,0)===m.d;
 status=complete?`Every cup has ${each} counters. That proves x = ${each}.`:`Shared ${count+1} of ${m.d} counters. Keep every cup equal.`;
 cue=complete?'shared':'share';bad=false;emit('share',{cup:cupIndex,counts:distribution.slice(),complete,x:each});render();return true;
}
function reset(){load();emit('reset',{mode,round});render();}
 function hint(){const x=solution(m);let message='';if(pending)message='The beam is tilted. Complete the matching move on the other pan, or press Undo.';else if(m.c!==0)message='Remove one x bag from each pan to move the unknown onto one side.';else if(m.a===-1&&m.b===0&&m.c===0)message='Multiply both sides by negative one. This turns negative x into x without changing equality.';else if(m.b!==0)message=`Use the inverse operation on both pans to cancel ${m.b<0?'negative':'positive'} units.`;else if(m.skin==='cups'&&m.a>=2&&m.c===0&&m.b===0)message=`Distribute the ${m.d} counters into ${m.a} cups, one at a time. Every cup needs ${m.d/m.a}.`;else if(Math.abs(m.a)>1)message=`Share both pans into ${Math.abs(m.a)} equal groups to isolate one x bag.`;else message=`Try x = ${x}. Check by putting ${x} units in place of each x bag.`;status=message;cue='hint';bad=false;api?.hint(message);emit('answer',{hint:true,round});render(panel.querySelector('#f708-answer')?.value||'');}
 function check(){const answer=panel.querySelector('#f708-answer')?.value||'',q=CHALLENGES[round],why=answerFeedback(answer,q);emit('answer',{round,answer});if(why){status=why;bad=true;cue='wrong';api?.check(false,why,{round});render(answer);return;}api?.check(true,`Correct: x = ${solution(q)}. Substituting keeps both pans equal.`,{round});round++;emit('round',{round,complete:round===CHALLENGES.length});if(round===CHALLENGES.length){clearPending();finished=true;cue='finish';render();}else{load();render();}}
 function controls(answer=''){panel.innerHTML='';if(finished){panel.append(H('p',{class:'f708-win',text:'All four balances solved! You kept equality through each operation.'}),btn('Restart challenges',()=>{round=0;finished=false;load();render();}));return;}
 if(mode==='explore'){const sel=H('select',{'aria-label':'Equation balance preset'});Object.entries(presets).forEach(([k,v])=>sel.add(new Option(v.label,k)));sel.value=preset;sel.onchange=()=>{preset=sel.value;C.preset=preset;emit('preset',preset);load();render();};panel.append(H('div',{class:'f708-tools'},[H('label',{},['Teaching preset',sel]),btn('Undo',undo),btn('Reset',reset),btn('Hint',hint)]));}
 else{const q=CHALLENGES[round],inp=H('input',{id:'f708-answer',type:'text',class:'nova-input','aria-label':'Value of x',placeholder:'x = ?',value:answer});inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check();}});panel.append(H('p',{class:'f708-direction',text:`Challenge ${round+1} of 4: ${q.skin==='cups'?'Cups and counters · ':q.skin==='balloons'?'Signed balance · ':''}${equation(q)}. Solve for x and justify the same operation on both sides.`}),H('div',{class:'f708-tools'},[H('label',{},['Your value of x',inp]),btn('Check x',check,true),btn('Hint',hint),btn('Undo',undo),btn('Reset round',reset)]));}
 if(IS_SIGNED_ENTRY||m.skin==='balloons')panel.append(H('div',{class:'f708-tools f708-zero-bar','aria-label':'Zero pair workshop'},[btn('Add +1/−1 left',()=>addZeroPair('left')),btn('Cancel left pair',()=>cancelZeroPair('left')),btn('Add +1/−1 right',()=>addZeroPair('right')),btn('Cancel right pair',()=>cancelZeroPair('right'))]),H('p',{class:'f708-direction',text:'A positive unit and negative balloon together have zero total. Build and cancel pairs on either pan without changing equality.'}));
 if(m.skin==='cups'){panel.append(H('div',{class:'f708-tools f710-share-bar'},[H('strong',{text:'Equal sharing'}),btn('Share next → cup 1',()=>share(0)),...(m.a>1?[btn('Share next → cup 2',()=>share(1))]:[]),...(m.a>2?[btn('Share next → cup 3',()=>share(2))]:[]),btn('Undo sharing',undo)]),H('p',{class:'f708-direction',text:'After removing matched loose counters, drag a right-hand counter into any cup to share. Or use the numbered keyboard keys 1–3 while focused on a counter. Each cup must receive the same number.'}));}
 panel.append(H('div',{class:'f708-tools f708-action-bar'},[btn('−1 each side',()=>operation('unit',-1)),btn('+1 each side',()=>operation('unit',1)),btn('−x each side',()=>operation('x',-1)),btn('+x each side',()=>operation('x',1)),btn('÷2 both',()=>operation('divide',2)),btn('÷3 both',()=>operation('divide',3)),btn('×(−1) both',()=>operation('negate',-1))]));
 panel.append(H('p',{class:'f708-direction',text:m.skin==='cups'?'Remove matching loose counters from both sides via the red RETURN zone, then drop the right-hand counters into the mystery cups. Keys: Delete/R to remove; L/R to add a source token; number keys to share. Unmatched removal restores automatically.':'Drag a pan weight to RETURN, then remove an equal weight from the other pan. One-sided changes tilt and automatically restore after a short interval. Drag source tokens onto both pans to add equally. Keyboard: Delete/R to remove a selected pan token, L/R to add a source token.'}),H('p',{class:'f708-status'+(bad?' bad':''),role:'status',text:status}));}
 function render(answer=''){renderScene(stage,m,{interactive:!finished,heading:mode==='challenge'?`Challenge ${round+1} · solve the equation`:'Explore · keep both sides equal',caption:pending?'The beam tilts — match the other side':m.context||'Explore the balance.',pending,cue,remove,add,transfer,celebrate:finished,zeroPairs,zeroCancel,cancelPair:cancelZeroPair,distribution,share});controls(answer);}
 load();render();}
const def={id:ID,title:'Balance Scales',config:C,steps:IS_CUPS_ENTRY?CUPS_STEPS:(IS_SIGNED_ENTRY?SIGNED_STEPS:STEPS),alt:'A neon balance beam suspends two pans with x bags and unit weights; the beam tilts when equality is broken and levels for matching operations.',staticAlt:'x + 3 = 7. Remove three units from each side, leaving x = 4. The rule is to apply the same operation to both sides.',render:watch,exploreIntro:IS_CUPS_ENTRY?'Remove equal loose counters from both sides, then share the remaining counters equally among the cups.':IS_SIGNED_ENTRY?'Build and cancel signed zero pairs, remove matching unknown bags and solve the balance.':'Drag to remove or add matching weights, use equal operations and isolate x.',explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();workspace(panel,stage,'explore');},challenge(panel,api,stage){workspace(panel,stage,'challenge',api);},onRestore(){}};
// Watch steps intentionally show construction states; the area model is not assigned a spurious mathematical solution.
N.registry.add({id:ID,title:'Balance Scales',topics:['algebra','linear equations','inverse operations','balance','negative numbers','cups and counters'],deps:['F0-02','F0-03','F0-04','F0-08','F7-01']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS,"SIGNED_STEPS":()=>SIGNED_STEPS,"CUPS_STEPS":()=>CUPS_STEPS},draws:{"dock":["stage","cue"],"renderScene":["stage","m","opt"]},exploreFields:{"mathOp.r":{"kind":"factory","factory":"copy","argCount":1},"cupsWatch.b":{"kind":"factory","factory":"copy","argCount":1},"cupsWatch.m":{"kind":"factory","factory":"copy","argCount":1},"signedWatch.initial":{"kind":"factory","factory":"copy","argCount":1},"watch.base":{"kind":"factory","factory":"copy","argCount":1},"watch.m":{"kind":"factory","factory":"copy","argCount":1}}});
N.bankMount({id:ID,num:IS_CUPS_ENTRY?'10':IS_SIGNED_ENTRY?'09':'08',title:IS_CUPS_ENTRY?'Cups-and-Counters Solver · Premium Review':IS_SIGNED_ENTRY?'Balance with Negatives & Unknowns · Premium Review':'Balance Scales · Premium Review',def,linked:['F7-01','F7-03','F3-02'],years:'Year 7 equations; Year 8 brackets and unknowns on both sides; GCSE signed extension',spec:{purpose:'Equality and inverse operations: x-bag mass and signed units must have equal total weight on both sides.',params:'ax + b = cx + d with integer coefficients and a unique nonnegative integer solution. Positive unit weights, negative floating balloons and cups/counters skin.',presets:'Y7-033, Y7-035, Y8-013, Y8-014, F7-09 negative/unknown and F7-10 cups/counters, plus four challenge rounds.',steps:'Meet pans → left load → balanced load → remove one from both → remove the remaining two → read/check x.',interactions:'Canonical F0 svgDrag with pans, source tray, removal zone, one-sided tilt pending and rollback, keyboard Delete/L/R, paired inverse operation buttons, undo, reset, hint, input checking.',traps:'One-sided removal, mismatched changes, division of one term only, ignoring negative units, confusing coefficient with solution.',gcse:'Signed balloons and unknown on both sides; advanced rational solutions and full algebraic generality not yet supported.'}});
(function(){const host=document.getElementById(ID);let pointer=null;window.addEventListener('pointerdown',e=>{const el=e.target.closest?.('[data-drag="1"]');if(el&&host.contains(el))pointer=e.pointerId;},true);window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);window.addEventListener('blur',()=>pointer=null);})();
const card=document.getElementById(ID);if(IS_CUPS_ENTRY||IS_SIGNED_ENTRY){const tag=[...card.querySelectorAll('h3')].find(el=>el.textContent?.trim().toLowerCase()==='live demo · f7-08');if(tag)tag.textContent=IS_CUPS_ENTRY?'LIVE DEMO · F7-10 PRESET':'LIVE DEMO · F7-09 PRESET';}const dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);const alt=()=>card.querySelectorAll('img').forEach(x=>{if(!x.hasAttribute('alt'))x.alt='NOVA mathematics helper';});alt();new MutationObserver(alt).observe(card,{childList:true,subtree:true});
window.F708_MATH={solution,equation,countArray,items,difference,mathOp,isIsolated,answerFeedback,geometry,tiltAngle,zeroPairTokens,SIGNED_STEPS,CUPS_STEPS,cupsSvg};
})();
