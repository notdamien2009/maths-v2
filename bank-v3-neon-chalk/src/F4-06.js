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

/* NOVA F4-06 · Percentage Bar · Run 06. Exact F0/F2 canonical shared core; independent local engine source. */
const F406_CONFIG={id:'F4-06',startMode:'watch',preset:'Y7-026',
 parameters:{minimumPercent:0,maximumPercent:150,percentageSnap:[1,5,10],moneyDp:2,viewport:380},
 presets:{
  'Y7-026':{kind:'of',base:240,pct:35,label:'Year 7 · 35% of £240',context:'Find 35% of £240. Build the ten-percent units before using five percent.'},
  'Y7-027':{kind:'compare',base:100,part:135,pct:135,label:'Year 7 · 135 as a percentage of 100',context:'The comparison amount is larger than the whole. See why a percentage can exceed 100%.'},
  'Y7-062':{kind:'increase',base:80,pct:25,label:'Year 7 · £80 increased by 25%',context:'Add 25% to the original £80. The new total is 125% of the original.'},
  'Y7-063':{kind:'interest',base:400,pct:5,years:3,label:'Year 7 · 5% simple interest for three years',context:'Simple interest is 5% of the ORIGINAL £400 in each of three years.'},
  'Y8-007':{kind:'decrease',base:200,pct:15,label:'Year 8 · 15% decrease from £200',context:'Subtract 15% of £200. A 15% reduction leaves 85% of the original.'},
  'Y8-008':{kind:'reverse',final:144,pct:120,label:'Year 8 · £144 after a 20% increase',context:'The known £144 is 120%. Work backwards to find 100%.'},
  'Y8-038':{kind:'decrease',base:230,pct:10,label:'Year 8 · 10% off the new £230 base',context:'The second stage of the multi-step route is 90% of £230, not 90% of £200.'}
 },
 challenge:[
  {kind:'of',base:240,pct:35,label:'35% of the whole',context:'Find 35% of £240. Enter the amount and place your chip onto the bar.',unit:'£'},
  {kind:'of',base:80,pct:135,label:'Past 100%',context:'Find 135% of £80. The answer is larger than £80.',unit:'£'},
  {kind:'reverse',final:144,pct:120,label:'Find the original',context:'After a 20% increase the new amount is £144. Find the ORIGINAL amount.',unit:'£'},
  {kind:'interest',base:400,pct:5,years:3,label:'Simple interest over three years',context:'£400 earns 5% SIMPLE interest each year for three years. Find the final total.',unit:'£'}
 ],
 events:{value:['preset','percent','base','amount','answer','placed','removed','check','reset','reveal','method'],types:['step','correct','hintUsed','mode']}
};window.F406_CONFIG=F406_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F406_CONFIG),ID=C.id;
function round(n){return Math.round((Number(n)+Number.EPSILON)*100)/100;}
function percentAmount(base,p){return round(base*p/100);}
function afterIncrease(base,p){return round(base*(1+p/100));}
function afterDecrease(base,p){return round(base*(1-p/100));}
function beforeChange(final,multiplierPercent){return round(final/(multiplierPercent/100));}
function simpleInterest(base,rate,years){return round(base+base*rate*years/100);}
function percentOfPart(part,whole){if(whole<=0)throw Error('Whole must be positive');return round(100*part/whole);}
function selectedPercent(o){if(o.kind==='increase')return 100+o.pct;
 if(o.kind==='decrease')return 100-o.pct;
 if(o.kind==='interest')return 100+o.pct*o.years;
 return o.pct;}
function whole(o){return o.kind==='reverse'?beforeChange(o.final,o.pct):o.base;}
function answer(o){if(o.kind==='reverse')return whole(o);
 if(o.kind==='increase')return afterIncrease(o.base,o.pct);
 if(o.kind==='decrease')return afterDecrease(o.base,o.pct);
 if(o.kind==='interest')return simpleInterest(o.base,o.pct,o.years);
 if(o.kind==='compare')return percentOfPart(o.part,o.base);
 return percentAmount(o.base,o.pct);}
function selectedAmount(o){return percentAmount(whole(o),selectedPercent(o));}
function wrongReason(o,v){const expected=answer(o);if(!Number.isFinite(v))return 'Enter a number before checking.';
 if(o.kind==='reverse'){
   if(Math.abs(v-(o.final*(o.pct/100)))<.011)return 'That multiplies by 120% again. Undo the multiplier: divide £144 by 1.20.';
   if(Math.abs(v-(o.final-(o.pct-100)))<.011)return 'Twenty percent means a proportion, not taking 20 pounds away.';
   return '£144 represents 120%. Divide by 1.20 to recover the original 100%.';
 }
 if(o.kind==='interest'){
   const compound=round(o.base*Math.pow(1+o.pct/100,o.years));
   if(Math.abs(v-compound)<.011&&Math.abs(v-expected)>.011)return 'That compounds the interest. SIMPLE interest uses the original £400 every year.';
   if(Math.abs(v-percentAmount(o.base,o.pct))<.011)return 'That is only one year of interest, without the original balance.';
   return 'Find one year’s interest on the original, multiply by the years, then add the original.';
 }
 if(o.kind==='increase'||o.kind==='decrease'){
   if(Math.abs(v-percentAmount(o.base,o.pct))<.011)return 'You found the percentage CHANGE. The question asks for the amount AFTER the change.';
   return 'Start with the 100% amount, then '+(o.kind==='increase'?'add':'subtract')+' the percentage change.';
 }
 if(o.kind==='of'){
   if(Math.abs(v-o.base*o.pct)<.011)return 'You have not divided by 100. Percent means per hundred.';
   if(Math.abs(v-(o.base+o.pct))<.011)return 'Do not add a percentage number to a money amount. Use equal parts of the whole.';
   return 'Find 10% or 1% of the whole, then build the required number of parts.';
 }
 return 'Compare the part with the whole: part ÷ whole × 100.';
}
function validate(o,raw,placed){if(raw===null||raw===undefined||String(raw).trim()==='')return {ok:false,text:'Enter a value first.'};
 const value=Number(raw),exp=answer(o);if(!Number.isFinite(value)||value<0)return {ok:false,text:'Enter a non-negative numeric value.'};
 if(Math.abs(value*100-Math.round(value*100))>1e-6)return {ok:false,text:'Use no more than two decimal places.'};
 if(Math.abs(value-exp)>.005)return {ok:false,text:wrongReason(o,value)};
 if(!placed)return {ok:false,text:'Your number is correct. Now place your value chip onto the bar to show where it belongs.'};
 return {ok:true,text:o.kind==='reverse'?'Correct: £144 ÷ 1.20 = £120. That is the original 100%.':
  o.kind==='interest'?'Correct: £400 + (5% of £400 × 3) = £460. Simple interest always uses the original.':
  'Correct: '+displayPercent(o)+' aligns with '+money(selectedAmount(o))+' on the amount scale.'};
}
const money=v=>'£'+round(v).toFixed(2).replace(/\.00$/,'');
const displayPercent=o=>Number(selectedPercent(o).toFixed(2))+'%';
function ev(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' event: '+key);N.events.emit('value',{engine:ID,key,value});}
const btn=(text,fn,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});
function chalk(p,x,y,value,size=40,role='given'){return N.chalkText(p,x,y,String(value),{role,size});}
function helper(stage,key){
if(window.NovaLessonComponent?.active){[stage,key]=window.NovaLessonComponent.args("helper",arguments);}
const states={begin:['explain','Start with the whole!'],split:['count','Equal tenths!'],unit:['show-one','Find one part!'],one:['idea','Try one percent!'],shade:['point','Build the share!'],amount:['show-two','Count the parts!'],link:['compare','Lines match!'],check:['think','Check the base!'],explore:['point','Move the marker!'],ready:['think','Your turn!'],entry:['show-one','Now place it!'],placed:['point-down','In the right spot!'],remove:['oops','Try again!'],wrong:['not-yet','Check the whole!'],right:['celebrate','You proved it!'],hint:['idea','One part first!']};let a=states[key]||states.ready;N.scene.helperStrip(stage,a[0],a[1]);}
const card=(head,val,note,role)=>N.neonCard([H('p',{class:'f406-card-label',text:head}),H('p',{class:'f406-card-value',text:val}),H('p',{class:'f406-card-note',text:note})],{role});
function dim(){const mobile=window.innerWidth<=600;return {mobile,w:mobile?780:1110,h:885,x:mobile?70:150,barW:mobile?640:800,pctY:197,barY:301,barH:126,amtY:533,slotY:636,trayY:748};}
function renderGraphic(o,p){const S=dim(),pct=Math.max(0,Math.min(150,Number(p.pct??selectedPercent(o)))),max=pct>100?150:100,unitW=S.barW/max,wholeW=unitW*100,
 bx=S.x,by=S.barY,selectedW=unitW*pct,knownWhole=!(o.kind==='reverse'&&p.interactive&&!p.won),knownSelected=(!p.interactive||p.won)&&p.step>=5,
 base=whole(o),amt=selectedAmount(o), major=max===150?25:20,labelSize=S.mobile?32:28,svg=N.svg.root(S.w,S.h,'Percentage bar connecting the 100 percent whole and tenths to an aligned percentage scale and amount scale, with a movable marker and value-placement slot.');
 svg.classList.add('f406-svg');svg.dataset.mode=p.task?'challenge':p.interactive?'explore':'watch';svg.dataset.percent=String(pct);svg.dataset.placed=String(!!p.placed);svg.dataset.won=String(!!p.won);
 const header=p.interactive?'ALIGN THE TWO SCALES':'ONE WHOLE  =  100%';chalk(svg,S.w/2,76,header,S.mobile?49:46,'given');
 chalk(svg,S.w/2,S.mobile?116:132,p.interactive?(o.kind==='reverse'?'KNOWN: '+money(o.final)+' IS '+displayPercent(o):'PERCENTAGE BAR · '+displayPercent({...o,pct:o.pct})):'BUILD THE PARTS OF THE WHOLE',S.mobile?34:30,'focus');
 // Percentage axis already uses % on every tick; removing its redundant caption prevents collision with the context header.
 const perc=N.numberLine(svg,{x:bx,y:S.pctY,w:S.barW,min:0,max,major,minor:10,label:v=>`${v}%`,labelSize,arrows:true});
 // Projection: a mathematical correspondence, not a second hand-drawn number line.
 const markerX=perc.s(pct);if((!p.interactive||p.placed||p.won)&&p.step>=4){N.neonLine(svg,markerX,S.pctY+45,markerX,S.amtY-37,{role:'focus',width:2.2,dash:'7 8'});}
 // The 100% glass apparatus: ten equal neon units, plus up to five extension units.
 for(let k=0;k<(max===150?15:10);k++){
  const x=bx+k*unitW*10;const cellW=unitW*10;const filled=pct>(k*10);
  if(k>=10&&k>=Math.ceil(pct/10)&&max===150)continue;
  const role=k>=10?'op':'given';N.neonBox(svg,x+2,by,cellW-4,S.barH,{role,r:10});
  if(p.step>=4||p.interactive){const proportion=Math.min(1,Math.max(0,(pct-k*10)/10));if(proportion>0.001){
    N.neonBox(svg,x+6,by+10,Math.max(10,(cellW-12)*proportion),S.barH-20,{role:p.won?'result':'focus',r:6});
  }}
 }
 if(!p.interactive&&p.step<1){N.neonBox(svg,bx+1,by,wholeW-2,S.barH,{role:'given',r:15});}
 if(p.step>=2||p.interactive){N.neonBox(svg,bx,by-53,Math.max(138,unitW*10),43,{role:'op',r:10});chalk(svg,bx+Math.max(138,unitW*10)/2,by-22,'10%',S.mobile?30:28,'op');}
 if(p.step>=4||p.interactive){N.neonRing(svg,markerX,by+S.barH+22,{role:'focus',r:15,pulse:!p.won});}
 const centerWhole=bx+wholeW/2;
 if(knownWhole)chalk(svg,centerWhole,by+S.barH/2+18,`100% = ${money(base)}`,S.mobile?38:38,'given');
 else chalk(svg,centerWhole,by+S.barH/2+18,'100% = ?',S.mobile?40:40,'unknown');
 if(p.step>=3&&!p.interactive&&p.step<5){chalk(svg,S.w/2,by+S.barH+124,`1% = ${money(base/100)}`,S.mobile?36:37,'op');}
 if(p.step>=5||p.interactive){const bubbleText=(knownSelected&&!(p.task&&!p.won))?`${pct}% = ${money(percentAmount(base,pct))}`:`${pct}% = ?`;
   chalk(svg,Math.min(S.w-165,Math.max(157,markerX)),S.amtY-63,bubbleText,S.mobile?36:34,knownSelected?'result':'unknown');}
 chalk(svg,bx+83,S.amtY-36,'AMOUNT',S.mobile?35:32,'given');
 const maxAmt=base*max/100;const amtline=N.numberLine(svg,{x:bx,y:S.amtY,w:S.barW,min:0,max:maxAmt,major:maxAmt/(max===150?6:5),
  label:v=>!knownWhole?(Math.abs(v)<.001?'0':'?'):((Math.abs(v)<.001)?'0':money(v)),labelSize:S.mobile?28:25,arrows:true});
 if(!p.interactive&&p.step>=6){N.neonRing(svg,amtline.s(amt),S.amtY,{role:'result',r:15});}
 if(p.interactive){
   const slot={x:S.x+S.barW*.56-118,y:S.slotY,w:238,h:94};
   N.neonBox(svg,slot.x,slot.y,slot.w,slot.h,{role:p.placed?'result':'unknown',r:14});chalk(svg,slot.x+slot.w/2,slot.y+62,p.placed?(p.raw===''?'PLACED':(o.kind==='compare'?p.raw+'%':money(Number(p.raw)))):'PLACE VALUE',S.mobile?39:36,p.placed?'result':'unknown');
   if(p.raw!==''&&!p.won){const at=p.placed?{x:slot.x+13,y:slot.y+13,w:slot.w-26,h:slot.h-26}:{x:S.x+12,y:S.trayY,w:246,h:76};
    const g=E('g',{class:'f406-chip',tabindex:0,role:'button','aria-label':p.placed?'Placed value. Drag to return tray or press Delete.':'Drag the entered value into the marked slot.','data-placed':p.placed?'true':'false'},svg);
    N.neonBox(g,at.x,at.y,at.w,at.h,{role:'focus',r:12});chalk(g,at.x+at.w/2,at.y+at.h/2+13,o.kind==='compare'?p.raw+'%':money(Number(p.raw)),S.mobile?42:39,'focus');
    const remove={id:'remove',kind:'remove',x:S.x+S.barW*.73,y:S.trayY,w:S.barW*.25,h:94};
    drag(svg,g,{box:at,zones:()=>[{id:'slot',kind:'drop',...slot},...(p.placed?[remove]:[])],onDrop:id=>{if(id!=='slot')return false;Promise.resolve().then(()=>p.onPlace(true));return true;},onRemove:()=>p.onPlace(false),removeTo:{x:remove.x+remove.w/2,y:remove.y+remove.h/2}});
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.onPlace(true);}else if((e.key==='Delete'||e.key==='Backspace')&&p.placed){e.preventDefault();p.onPlace(false);}});
   }
   if(p.placed){const rx=S.x+S.barW*.73,ry=S.trayY;N.neonBox(svg,rx,ry,S.barW*.25,94,{role:'error',r:12});chalk(svg,rx+S.barW*.125,ry+60,'RETURN',S.mobile?35:32,'error');}
   else{chalk(svg,S.x+138,S.trayY+123,p.raw!==''?'DRAG VALUE UP · OR PRESS PLACE':'ENTER A VALUE BELOW',S.mobile?31:31,'given');}
   if(p.editPct){
     const hx=markerX,hy=by-17,handle=E('g',{class:'f406-handle',role:'slider',tabindex:0,'aria-label':'Percentage marker. Use left and right arrows in the selected percent increments.','aria-valuemin':'0','aria-valuemax':String(max),'aria-valuenow':String(pct)},svg);
     N.neonRing(handle,hx,hy,{role:'focus',r:18});
     // Active bar zones snap in 5% increments; core drag handles spring-back, cancellation, touch and pointer capture.
     const steps=[];for(let x=0;x<=max;x+=(p.snap||5)){const xx=bx+x*unitW;steps.push({id:'percent:'+x,kind:'drop',x:xx-S.barW/max*(p.snap||5)/2,y:by-80,w:S.barW/max*(p.snap||5),h:230});}
     drag(svg,handle,{box:{x:hx-24,y:hy-25,w:48,h:51},zones:()=>steps,onDrop:id=>{if(!id.startsWith('percent:'))return false;Promise.resolve().then(()=>p.onPercent(Number(id.split(':')[1])));return true;}});
     handle.addEventListener('keydown',e=>{const d=e.key==='ArrowLeft'?-(p.snap||5):e.key==='ArrowRight'?(p.snap||5):0;if(d){e.preventDefault();p.onPercent(Math.max(0,Math.min(max,pct+d)),true);}});
   }
 }else if(p.step>=7){chalk(svg,S.w/2,773,knownWhole?`${displayPercent(o)} = ${money(amt)}`:'FIND THE ORIGINAL WHOLE',S.mobile?40:43,'result');chalk(svg,S.w/2,853,'PERCENT MEANS PARTS OF ONE HUNDRED',S.mobile?33:33,'given');}
 return svg;
}
function drag(svg,el,o){N.ui.svgDrag(svg,el,o);el.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});return el;}
function present(stage,data,opt){
if(window.NovaLessonComponent?.active){[stage,data,opt]=window.NovaLessonComponent.args("present",arguments);}
stage.innerHTML='';N.cap(stage,'Percentage Bar',opt.task?'CHALLENGE':opt.interactive?'EXPLORE & BUILD':opt.heading||'One whole · matching percentage and amount scales');
 const layout=H('div',{class:'f406-layout'}),appar=H('div',{class:'f406-apparatus'}),aside=H('div',{class:'f406-side'}),pct=selectedPercent(data),base=whole(data),show=(!opt.interactive||opt.won),knownWhole=show||data.kind!=='reverse';
 appar.append(renderGraphic(data,{pct:opt.percent??pct,step:opt.step??7,interactive:!!opt.interactive,task:opt.task,placed:opt.placed,won:opt.won,raw:opt.raw??'',editPct:opt.editPct,onPercent:opt.onPercent,onPlace:opt.onPlace}));
 aside.append(card('WHOLE = 100%',knownWhole?money(base):'?',data.kind==='reverse'?'Recover the original': 'The reference quantity','given'));
 aside.append(card('SELECTED SHARE',Number(opt.percent??pct)+'%',data.kind==='interest'?'Original plus annual interest':pct>100?'Extends beyond one whole':'Built from equal tenths','op'));
 aside.append(card('MATCHING AMOUNT',show?money(selectedAmount(data)):(data.kind==='reverse'?'KNOWN: '+money(data.final):'?'),'Each position aligns on both scales',show?'result':'unknown'));
 layout.append(appar,aside);stage.append(layout);helper(stage,opt.pose||'ready');}
const STEPS=[
 {name:'Identify the whole',narration:'The whole is two hundred and forty pounds. That is one hundred percent.',prompt:'What does 100 percent represent?'},
 {name:'Split into equal tenths',narration:'Split one whole into ten equal parts. Each part is ten percent.',prompt:'How many equal tenths fill 100 percent?'},
 {name:'Find one tenth',narration:'Ten percent of two hundred and forty pounds is twenty four pounds.',prompt:'Why do we divide by ten?'},
 {name:'Find one percent',narration:'One percent is a hundredth of the original. It is two pounds and forty pence.',prompt:'How does 1% relate to 10%?'},
 {name:'Build thirty five percent',narration:'Use three tenths and another half of one tenth. That makes thirty five percent.',prompt:'What is half of ten percent?'},
 {name:'Find the selected amount',narration:'Thirty percent is seventy two pounds, and five percent is twelve pounds. Together that is eighty four pounds.',prompt:'Why do both amounts come from the same whole?'},
 {name:'Link both scales',narration:'The same vertical position means thirty five percent on the top and eighty four pounds below.',prompt:'Which labels match across the two scales?'},
 {name:'Check the relationship',narration:'Thirty five percent means thirty five hundredths of the whole, not adding thirty five to the whole.',prompt:'Explain why £84 is less than £240.'}
];
function live(panel,stage,task,api){let data={...(task||C.presets[C.preset])},raw='',placed=false,won=false,snapStep=5,percent=selectedPercent(data),feedback=task?'Find the missing value; then show it belongs on the bar.':'Change the model or enter an amount to prove the matching point.',status='ready';
 const isCompare=data.kind==='compare';
 function redraw(){panel.innerHTML='';present(stage,data,{interactive:!won,won,task:task||null,raw,percent,placed,pose:status,editPct:!task&&!won,snap:snapStep,onPercent:setPercent,onPlace:setPlace});
  if(!task){const select=H('select',{'aria-label':'Choose percentage context'});Object.entries(C.presets).forEach(([id,p])=>select.add(new Option(p.label,id)));select.value=C.preset;select.onchange=()=>setPreset(select.value);panel.append(H('label',{class:'f406-field'},['Choose the teaching context',select]));}
  panel.append(H('p',{class:'f406-prompt',text:data.context}));
  if(!won){const controls=H('div',{class:'f406-controls'}),label=isCompare?'Percentage (%)':data.kind==='reverse'?'Original amount (£)':'Matching amount (£)';
   const input=H('input',{type:'number',step:'0.01',min:'0',placeholder:'?',value:raw,'aria-label':label});input.onchange=()=>assign(input.value);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();input.blur();}};controls.append(H('label',{class:'f406-field'},[label,input]));
   if(!task){const pctIn=H('input',{type:'number',min:'0',max:'150',step:String(snapStep),value:String(percent),'aria-label':'Selected percentage'});pctIn.onchange=()=>setPercent(Number(pctIn.value));controls.append(H('label',{class:'f406-field'},['Selected share (%)',pctIn]));
    const snapSelect=H('select',{'aria-label':'Marker snap interval'});for(const step of C.parameters.percentageSnap)snapSelect.add(new Option(step+'% increments',String(step)));snapSelect.value=String(snapStep);snapSelect.onchange=()=>{snapStep=Number(snapSelect.value);ev('method','snap '+snapStep+'%');say('The marker now snaps in '+snapStep+'% steps.','explore');};controls.append(H('label',{class:'f406-field'},['Marker snap',snapSelect]));}
   controls.append(btn(placed?'Place again':'Place value →',()=>setPlace(true)),btn('Check answer',check,true),btn('Hint',hint),btn('Reset',reset));if(placed)controls.append(btn('Return value',()=>setPlace(false)));panel.append(controls);
  }else panel.append(H('p',{class:'f406-success',text:'Correct mathematical value and placement verified.'}));
  panel.append(H('p',{class:'f406-guide',text:'A value is proved in two ways: the calculation is correct AND its value chip is placed on the aligned bar. Use mouse/touch drag or the keyboard Place button. Explore: drag the percent ring or use the arrows.'}));
  panel.append(H('p',{class:'f406-status'+(status==='wrong'?' bad':status==='right'?' good':''),role:'status',text:feedback}));
 }
 function say(t,k){feedback=t;status=k;redraw();}
 function assign(v){raw=v;placed=false;ev('amount',v);say('Value entered. Place its chip on the bar, then check your reasoning.','entry');}
 function setPlace(next){if(won)return false;if(next&&raw===''){say('Enter an amount before placing the chip.','wrong');return false;}placed=!!next;ev(next?'placed':'removed',true);say(next?'Value placed. Check the mathematical relationship.':'Value returned to the tray.','placed');return true;}
 function setPercent(next,focus){if(!Number.isFinite(next))return;percent=Math.max(0,Math.min(150,Math.round(next/snapStep)*snapStep));placed=false;raw='';
  if(!task){
    if(data.kind==='of')data.pct=percent;
    else if(data.kind==='compare'){data.pct=percent;data.part=percentAmount(data.base,percent);}
    else if(data.kind==='increase'||data.kind==='decrease') {data.kind=percent>=100?'increase':'decrease';data.pct=Math.abs(percent-100);}
    else if(data.kind==='reverse'){percent=Math.max(5,percent);data.pct=percent;}
    else if(data.kind==='interest'){data={kind:'of',base:data.base,pct:percent,context:'Freely explore the selected percentage of the original. To return to annual simple interest, reselect its preset.'};}
  }
  ev('percent',percent);say('Marker moved to '+percent+'%. Find its matching amount on the lower scale.','explore');if(focus){const el=stage.querySelector('.f406-handle');if(el)el.focus();}}
 function setPreset(id){if(!(id in C.presets))return;C.preset=id;data={...C.presets[id]};percent=selectedPercent(data);raw='';placed=false;won=false;ev('preset',id);say(data.context,'begin');}
 function check(){ev('answer',{value:raw,placed});const valid=task?validate(task,raw,placed):(data.kind==='of'?validate({...data,pct:percent},raw,placed):validate(data,raw,placed));ev('check',valid.ok);if(!valid.ok){api?.check(false,valid.text);say(valid.text,'wrong');return false;}won=true;api?.check(true,valid.text);say(valid.text,'right');return true;}
 function hint(){const hintText=data.kind==='reverse'?'The known final amount represents 120%. Divide by 1.20, do not subtract 20%.':data.kind==='interest'?'Each year adds 5% of the ORIGINAL balance. Three years means three identical amounts.':'Find 10% of the whole first, then use a further 5% or 1% as needed.';api?.hint(hintText);say(hintText,'hint');}
 function reset(){raw='';placed=false;won=false;ev('reset',true);say('Ready to solve it again.','begin');}
 redraw();return {assign,setPlace,check,reset,setPercent,setPreset,state:()=>({raw,placed,won,percent,preset:C.preset})};}
const def={id:ID,title:'Percentage Bar',config:C,steps:STEPS,
 alt:'Ten equal glass segments represent 100%. Percentage and amount number lines share aligned coordinates, with an extending bar for amounts over 100%.',
 staticAlt:'For 35% of £240, 10%=£24, 5%=£12, therefore 35%=£84. Reverse example: £144 divided by 1.20 equals £120.',
 render(i,stage){present(stage,C.presets['Y7-026'],{step:i,heading:STEPS[i].name,pose:['begin','split','unit','one','shade','amount','link','check'][i]});},
 exploreIntro:'Move the percentage marker and link a percentage to its share of the original.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();live(panel,stage,null,null);},
 challenge(panel,api,stage){let i=0;function next(){panel.innerHTML='';if(i>=C.challenge.length){present(stage,C.presets['Y7-026'],{step:7,won:true,pose:'right',heading:'Four challenges complete'});panel.append(H('div',{class:'f406-finish',text:'You solved parts of a whole, amounts above 100%, reverse percentages and simple interest.'}));return;}
 const task={...C.challenge[i]};if(i>0){api.fb.textContent='';api.fb.className='nova-fb';api.bob('New challenge. Identify the whole before you calculate.',{mood:'think'});}panel.append(H('p',{class:'f406-progress',text:`Challenge ${i+1} of ${C.challenge.length} · ${task.label}`}));const body=H('div');panel.append(body);
 const remote={hint:msg=>api.hint(msg),check:(ok,msg)=>{api.check(ok,msg,{task:i+1});if(ok)Promise.resolve().then(()=>body.append(H('div',{class:'f406-next'},[btn('Next problem →',()=>{i++;next();},true)])));}};
 live(body,stage,task,remote);
 }next();}
};
N.registry.add({id:ID,title:'Percentage Bar',topics:['percentage of an amount','percentages over 100','multipliers','reverse percentages','simple interest','ratio'],deps:['F0-01','F0-02','F0-08','F0-13']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"helper":["stage","key"],"present":["stage","data","opt"]},exploreFields:{}});
N.bankMount({id:ID,num:'06',title:'Percentage Bar · Run 06 Review',def,years:'Years 7–9 · Percentage change, original value, simple interest; GCSE extension.',linked:['F4-01','F4-04','F4-05','F4-09','F5-12','F5-14','F5-16'],spec:{purpose:'Connect percentages to their amounts using a common whole and geometrically aligned number lines. Represent values above 100% and inverse multipliers.',params:'100% whole, percent 0–150, amount scale, changing whole, increase/decrease, reverse, simple interest.',presets:'Y7-026, Y7-027, Y7-062, Y7-063, Y8-007, Y8-008, Y8-038.',steps:'Whole → equal tenths → 10% → 1% → selected percentage → amount → aligned scales → misconception.',interactions:'5% snapping draggable marker, keyboard arrows, value-chip drag into slot/return, accessible controls and challenges.',traps:'Percent as a raw amount, wrong 100% base, omitting original on increase, compounding simple interest, reversing by subtraction.',gcse:'Multipliers above 100%, reverse percentage, exact proportional reasoning, interest.'}});
window.F406_MATH={round,percentAmount,afterIncrease,afterDecrease,beforeChange,simpleInterest,percentOfPart,selectedPercent,whole,answer,selectedAmount,wrongReason,validate};
const root=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
