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

/* F6-10 Speed–Distance–Time — additive NOVA component. F0 CORE REMAINS UNCHANGED. */
const F610_CONFIG={id:'F6-10',preset:'Y8-041',startMode:'watch',parameters:{distanceUnit:'km',timeUnit:'h',speedUnit:'km/h',allowZeroTime:false,precision:3},presets:{
 'Y8-041':{label:'Y8-041 · Find the speed',title:'A JOURNEY AT STEADY SPEED',distance:90,time:1.5,target:'speed',legs:[{d:45,t:.75},{d:45,t:.75}],context:'A coach travels 90 kilometres in 1.5 hours. Find its average speed.'},
 'Y9-016':{label:'Y9-016 · Read a whole journey',title:'THE COMPLETE JOURNEY',distance:180,time:3,target:'speed',legs:[{d:60,t:1},{d:30,t:1},{d:90,t:1}],context:'A journey has three stages. The whole route covers 180 kilometres in 3 hours. Find the average speed.'},
 'Y9-022-distance':{label:'Y9-022 · Find the distance',title:'HOW FAR DID IT TRAVEL?',distance:180,time:2.5,target:'distance',legs:[{d:72,t:1},{d:108,t:1.5}],context:'A vehicle travels at 72 kilometres per hour for 2.5 hours. Find its distance.'},
 'Y9-022-time':{label:'Y9-022 · Find the time',title:'HOW LONG IS THE JOURNEY?',distance:165,time:3,target:'time',legs:[{d:55,t:1},{d:110,t:2}],context:'A vehicle travels 165 kilometres at 55 kilometres per hour. Find its time.'}
 },events:['value','correct','step','hintUsed']};window.F610_CONFIG=F610_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=window.NovaV2Integration.configuration(F610_CONFIG),ID='F6-10';
// Local pointer-release fallback: no change to the locked shared F0 system.
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f610-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
const STEPS=[
 {name:'See the journey',pose:'explain',caption:'What do we know?',narration:'A journey has a distance and a time. We use these together to find its average speed.'},
 {name:'Watch the movement',pose:'point',caption:'Follow the route.',narration:'Watch the position ring move along the route. Distance grows as the journey continues.'},
 {name:'Measure the distance',pose:'count',caption:'Read the distance.',narration:'Distance tells us how far the journey travels. We measure the complete route, not just a short part.'},
 {name:'Measure the time',pose:'checking',caption:'Read the clock.',narration:'Time is how long the complete journey takes. Match the distance with the same time interval.'},
 {name:'Choose the unknown',pose:'think',caption:'What is missing?',narration:'Cover the quantity you need to calculate in the formula triangle. Distance equals speed multiplied by time.'},
 {name:'Show the calculation',pose:'point-down',caption:'Use the correct units.',narration:'To find average speed, divide the total distance by the total time. To find distance, multiply speed by time. To find time, divide distance by speed.'},
 {name:'Check the answer',pose:'celebrate',caption:'Does the journey fit?',narration:'Check the units and put the result back into the formula. The three quantities must agree.'}
];
function pFor(id){return C.presets[id||C.preset];}
function fmt(n){return Number(Number(n).toFixed(3)).toString();}
function emit(type,obj){N.events.emit(type,{engine:ID,...obj});}
function value(p,t){return t==='speed'?p.distance/p.time:t==='time'?p.time:p.distance;}
function units(t){return t==='speed'?'km/h':t==='distance'?'km':'h';}
function label(t){return t==='speed'?'SPEED':t==='time'?'TIME':'DISTANCE';}
function chalk(svg,x,y,text,role='given',size=25){return N.chalkText(svg,x,y,String(text),{role,size});}
function card(title,big,desc,role='given'){return N.neonCard([H('p',{class:'f610-card-label',text:title}),H('p',{class:'f610-card-number',text:big}),H('p',{class:'f610-card-desc',text:desc})],{role});}
function dims(mob){return mob?{mob:true,w:480,h:1250,head:48,trackX:57,trackW:365,trackY:650,tickY:1040,triX:244,triTop:191,triH:248,returnX:77,returnY:330,chipY:1030,insY:1180}:
 {mob:false,w:1120,h:1045,head:61,trackX:105,trackW:545,trackY:435,tickY:820,triX:869,triTop:238,triH:250,returnX:888,returnY:821,chipY:655,insY:987};}
function makeSVG(stage,p,o={}){
if(window.NovaLessonComponent?.active){[stage,p,o]=window.NovaLessonComponent.args("makeSVG",arguments);}

 const mob=window.innerWidth<=1000,g=dims(mob),mode=o.mode||'watch',step=o.step??6,solved=!!o.solved,challenge=mode==='challenge',target=challenge?p.target:(o.cover||p.target),cover=o.cover||p.target,progress=Math.min(1,Math.max(0,o.progress??(step===0?0:step===1?.68:1))),show=(v)=>!challenge||solved||p.target!==v;
 stage.innerHTML='';N.cap(stage,ID,challenge?'SOLVE THE UNKNOWN':mode==='explore'?'EXPLORE THE JOURNEY':'THE SPEED–DISTANCE–TIME CONNECTION');
 const layout=H('div',{class:'f610-layout'}),art=H('div',{class:'f610-art'}),aside=H('aside',{class:'f610-aside','aria-label':'Journey evidence'});
 const svg=N.svg.root(g.w,g.h,'Neon journey track with movable car, labelled time number line and speed-distance-time formula triangle.');svg.classList.add('f610-svg');svg.dataset.mode=mode;svg.dataset.preset=o.id||C.preset;svg.dataset.progress=fmt(progress);svg.dataset.cover=cover;
 chalk(svg,g.w/2,g.head,challenge?'FIND THE MISSING QUANTITY':'ONE JOURNEY · THREE QUANTITIES','given',mob?30:41);
 chalk(svg,g.w/2,g.head+52,'DISTANCE = SPEED × TIME','focus',mob?22:29);
 // The geometry follows the house NEON primitives; labels use genuine NOVA chalk text.
 const cx=g.triX,ty=g.triTop,h=g.triH,tri=`M ${cx} ${ty} L ${cx-136} ${ty+h} L ${cx+136} ${ty+h} Z`;
 chalk(svg,cx,ty-34,'FORMULA TRIANGLE','given',mob?23:29);
 N.neonPath(svg,tri,{role:'given',width:3.1});N.neonLine(svg,cx-75,ty+114,cx+75,ty+114,{role:'op',width:2.2});N.neonLine(svg,cx,ty+114,cx,ty+h-5,{role:'op',width:2.2});
 const points={distance:[cx,ty+84],speed:[cx-60,ty+199],time:[cx+60,ty+199]};
 const mask=function(k){return cover===k&&(challenge&&!solved||mode==='explore');};
 ['distance','speed','time'].forEach(k=>{
  const [xx,yy]=points[k];if(mask(k)){N.neonRing(svg,xx,yy-11,{role:'focus',r:27,pulse:false});chalk(svg,xx,yy,'?','focus',38);}else chalk(svg,xx,yy,k==='distance'?'D':k==='speed'?'S':'T',k==='distance'?'result':k==='speed'?'given':'op',36);
 });
 const hintY=ty+h+43;
 chalk(svg,cx,hintY,cover==='distance'?'D = S × T':cover==='speed'?'S = D ÷ T':'T = D ÷ S','focus',mob?26:30);
 // NEON distance route and clear spatial progression.
 const x0=g.trackX,x1=x0+g.trackW,yy=g.trackY,carX=x0+progress*g.trackW;
 chalk(svg,x0+g.trackW/2,yy-(mob?127:148),challenge?'MEASURE THE JOURNEY':'THE JOURNEY TRACK','given',mob?25:32);
 N.neonBox(svg,x0-13,yy-68,g.trackW+26,112,{role:'given',r:18});
 N.neonLine(svg,x0,yy,x1,yy,{role:'given',width:4});
 if(progress>0)N.neonLine(svg,x0,yy,carX,yy,{role:'result',width:5});
 N.neonRing(svg,x0,yy,{role:'op',r:11,pulse:false});N.neonRing(svg,x1,yy,{role:'result',r:11,pulse:false});
 chalk(svg,x0+21,yy+79,'START','given',mob?22:24);
 chalk(svg,x1-18,yy+79,'FINISH','result',mob?22:24);
 // Genuine meaningful progress ring (not a star-shaped positional glyph).
 // Leg checkpoints model a whole journey; Y9 journeys have different gradients per leg.
 if(p.legs.length>1){let dist=0;p.legs.slice(0,-1).forEach((leg,i)=>{dist+=leg.d;const xx=x0+dist/p.distance*g.trackW;N.neonRing(svg,xx,yy,{role:'op',r:9,pulse:false});chalk(svg,xx,yy-83,mob?`L${i+1}`:`LEG ${i+1}`,'op',mob?22:21);});}
 // The active position marker is drawn last so checkpoint rings cannot intercept pointer input.
 let car=E('g',{class:'f610-car'+(mode==='explore'?' f610-drag':''),'data-car':'1',role:mode==='explore'?'button':null,tabindex:mode==='explore'?0:null,'aria-label':mode==='explore'?'Drag the journey marker to a progress stop. Use left and right arrows; Delete resets.':'Position on journey'},svg);
 N.neonRing(car,carX,yy,{role:'focus',r:22,pulse:false});N.neonRing(car,carX,yy,{role:'given',r:6,pulse:false});

 const covered=p.distance*progress,elapsed=p.time*(p.legs.length>1?(function(){let remaining=covered,t=0;for(const leg of p.legs){const share=Math.min(remaining,leg.d);t+=share/leg.d*leg.t;remaining-=share;if(remaining<=.00001)break;}return t/p.time;})():progress);
 const dataX=x0+g.trackW/2;
 chalk(svg,dataX,yy+144,challenge&&!solved&&p.target==='distance'?'DISTANCE · ? km':`DISTANCE · ${fmt(covered)} km`, 'result',mob?22:26);
 // Time numberline must be F0 primitive. For unknown time it has proportional stages not answer-revealing hour labels.
 const timeMax=challenge&&!solved&&p.target==='time'?1:p.time;
 const majors=timeMax===1?.25:timeMax===1.5?.5:timeMax===2.5?.5:timeMax===3?.5:1;
 chalk(svg,dataX,g.tickY-87,challenge&&!solved&&p.target==='time'?'TIME PROGRESS (FRACTION)':'TIME ELAPSED IN HOURS','given',mob?22:27);
 N.numberLine(svg,{x:x0,y:g.tickY,w:g.trackW,min:0,max:timeMax,major:majors,minor:0,labelSize:mob?22:21,arrows:true});
 // The timeline is honest: progress marker is the time of the actual journey, not distance fraction.
 const fractionTime=p.time?elapsed/p.time:0;
 N.neonRing(svg,x0+fractionTime*g.trackW,g.tickY,{role:'focus',r:12,pulse:false});
 chalk(svg,dataX,g.tickY+78,challenge&&!solved&&p.target==='time'?'FIND THE TOTAL HOURS':`ELAPSED · ${fmt(elapsed)} h`,'op',mob?22:25);
 if(mode==='explore'){
  // Drag help is visible in the accessible Explore instructions below the SVG.
  const zones=[0,.25,.5,.75,1].map((v,i)=>({id:String(v),kind:'drop',x:x0+v*g.trackW-23,y:yy+145,w:46,h:64}));
  zones.forEach((z,i)=>{const px=x0+(i/4)*g.trackW;N.neonRing(svg,px,yy+172,{role:Math.abs(i/4-progress)<.01?'result':'unknown',r:11,pulse:false});chalk(svg,px,yy+216,`${i*25}%`,'focus',mob?22:19);});
  N.neonBox(svg,g.returnX-76,g.returnY-29,152,58,{role:'error',r:12});chalk(svg,g.returnX,g.returnY+9,'RETURN','error',24);
  zones.push({id:'return',kind:'remove',x:g.returnX-76,y:g.returnY-29,w:152,h:58});
  car.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();o.onProgress(Math.max(0,Math.min(1,Math.round(progress*4+(e.key==='ArrowRight'?1:-1))/4)));}if(e.key==='Delete'||e.key==='Escape'){e.preventDefault();o.onReset();}});
  N.ui.svgDrag(svg,car,{box:{x:carX-26,y:yy-26,w:52,h:52},zones:()=>zones,onDrop:id=>{const v=Number(id);if(Number.isFinite(v)){Promise.resolve().then(()=>o.onProgress(v));return true;}return false;},onRemove:()=>o.onReset()});
  // Second, independent draggable object: unknown cover, with honest triangle slots and red return zone.
  const selection=E('g',{class:'f610-drag f610-cover','data-cover':'1',role:'button',tabindex:0,'aria-label':'Move unknown cover to D, S or T on the formula triangle. Left and right arrows choose. Delete removes the cover.'},svg);
  const coverX=mob?408:727,coverY=mob?330:572;
  N.neonRing(selection,coverX,coverY,{role:'focus',r:24,pulse:false});chalk(selection,coverX,coverY+11,'?','focus',31);
  ['distance','speed','time'].forEach((k,i)=>{let [px,py]=points[k];N.neonRing(svg,px,py-11,{role:k===cover?'result':'unknown',r:29,pulse:false});});
  selection.addEventListener('keydown',e=>{let names=['distance','speed','time'],ix=names.indexOf(cover);if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();o.onCover(names[(ix+(e.key==='ArrowRight'?1:2))%3]);}if(e.key==='Delete'||e.key==='Escape'){e.preventDefault();o.onCover(p.target);}});
  const z2=['distance','speed','time'].map(k=>({id:k,kind:'drop',x:points[k][0]-35,y:points[k][1]-50,w:70,h:70}));z2.push({id:'remove',kind:'remove',x:g.returnX-76,y:g.returnY-29,w:152,h:58});
  N.ui.svgDrag(svg,selection,{box:{x:coverX-26,y:coverY-26,w:52,h:52},zones:()=>z2,onDrop:k=>{if(points[k]){Promise.resolve().then(()=>o.onCover(k));return true;}return false;},onRemove:()=>o.onCover(p.target)});
 }
 chalk(svg,g.w/2,g.insY,challenge&&!solved?'CHOOSE THE FORMULA AND SHOW YOUR UNITS':'THE THREE QUANTITIES MUST AGREE','focus',mob?22:25);
 const key=t=>show(t)?fmt(value(p,t))+' '+units(t):'? '+units(t);
 aside.append(card('DISTANCE · D',key('distance'),'Total route travelled, in kilometres.','result'),card('SPEED · S',key('speed'),'Average distance per hour.','given'),card('TIME · T',key('time'),'Duration of the complete route.','op'),card('RELATIONSHIP',cover==='distance'?'D = S × T':cover==='time'?'T = D ÷ S':'S = D ÷ T','Use the same journey interval each time.','focus'));
 layout.append(art,aside);art.append(svg);stage.append(layout);N.scene.helperStrip(stage,o.pose||'checking',o.caption||'Match the distance with the time.');return {svg,car,progress,g,carX,x0};
}
function teach(i,stage){const p=pFor();const r=makeSVG(stage,p,{mode:'watch',step:i,progress:i===0?0:i===1?.7:1,cover:i<=3?'speed':p.target,pose:STEPS[i].pose,caption:STEPS[i].caption});
 if(i===1&&!N.reducedMotion()){
  // NOVA.motion timeline, with reduced-motion instant fallback and stale-DOM guard.
  const car=r.car,svg=r.svg;
  M.tween(720,t=>{if(!car.isConnected)return;const dx=(1-.7)*r.g.trackW*t;car.setAttribute('transform',`translate(${dx.toFixed(2)},0)`);},M.ease.inOut);
 }
 if(i===6)M.flash(r.svg,r.g.triX,r.g.triTop+85,'result',38);
 emit('step',{preset:C.preset,index:i,name:STEPS[i].name});}
function btn(t,fn,cls='nova-btn'){return H('button',{class:cls,text:t,onclick:fn});}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let id=C.preset,progress=.5,cover=pFor(id).target,message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Drag the journey marker to a percentage stop, then select the unknown in the formula triangle.')):('Drag the journey marker to a percentage stop, then select the unknown in the formula triangle.'));
 window.NovaLessonComponent?.applyExploreModels();const sel=H('select',{'aria-label':'Journey preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,v])=>sel.append(H('option',{value:k,text:v.label})));window.NovaLessonComponent?.applyExploreModels();sel.value=id;
 window.NovaLessonComponent?.applyExploreModels();const tools=H('div',{class:'f610-controls'}),fb=H('p',{class:'f610-feedback','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();tools.append(H('label',{class:'f610-choice'},['Choose journey',sel]),btn('Check formula',check,'nova-btn primary'),btn('Hint',hint),btn('Reset',reset));
 window.NovaLessonComponent?.applyExploreModels();panel.append(tools,H('p',{class:'f610-info',text:'Drag the position ring to a journey stop. Drag the ? ring to D, S or T. Keyboard: Left/Right on each ring; Delete returns it.'}),fb);
 window.NovaLessonComponent?.applyExploreModels();function paint(pose='checking',caption='Notice what changes.') {makeSVG(stage,pFor(id),{mode:'explore',id,progress,cover,onProgress:setProgress,onCover:setCover,onReset:reset,pose,caption});fb.textContent=message;}
 window.NovaLessonComponent?.applyExploreModels();function setProgress(v){if(v<0||v>1)return;progress=v;message='Position '+fmt(progress*100)+'% of the route. The distance and elapsed time move together.';emit('value',{preset:id,progress,distance:fmt(pFor(id).distance*progress)});paint('count','Follow the route.');}
 window.NovaLessonComponent?.applyExploreModels();function setCover(v){if(!['distance','speed','time'].includes(v))return;cover=v;message='Cover '+label(v)+'. '+(v==='distance'?'Multiply speed by time.':v==='time'?'Divide distance by speed.':'Divide distance by time.');emit('value',{preset:id,cover:v});paint('point-down','Choose the right calculation.');}
 window.NovaLessonComponent?.applyExploreModels();function reset(){progress=.5;cover=pFor(id).target;message='Both markers have returned to their starting values.';paint('explain','Start with the givens.');}
 window.NovaLessonComponent?.applyExploreModels();function check(){const correct=cover===pFor(id).target;message=correct?'Correct. '+label(cover)+' is missing. Use '+(cover==='distance'?'S × T.':cover==='speed'?'D ÷ T.':'D ÷ S.'): 'That covers a different quantity. Choose the value asked for in this journey.';fb.classList.toggle('good',correct);fb.classList.toggle('bad',!correct);emit('correct',{preset:id,correct});paint(correct?'celebrate':'not-yet',correct?'Well chosen!':'Find the unknown.');}
 window.NovaLessonComponent?.applyExploreModels();function hint(){message='Distance equals speed multiplied by time. Cover the unknown, then choose the matching calculation.';emit('hintUsed',{preset:id});paint('point','Use the formula triangle.');}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=()=>{id=sel.value;C.preset=id;progress=.5;cover=pFor(id).target;message=pFor(id).context;paint('explain','A different journey.');};
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({id,progress,cover,message}),setProgress,setCover,reset,check,hint,setPreset:v=>{sel.value=v;sel.onchange();}};window.NovaLessonComponent?.applyExploreModels();paint();}
function challenge(panel,api,stage){const ids=Object.keys(C.presets);let index=0,solved=false,correctCount=0,attempts=0;
 const question=H('p',{class:'f610-question'}),inputs=H('div',{class:'f610-inputs'}),numeric=H('input',{type:'text',inputmode:'decimal',placeholder:'Enter your answer','aria-label':'Numeric answer'}),unitSelect=H('select',{'aria-label':'Unit of the answer'});
 ['km/h','km','h','m/s','min'].forEach(v=>unitSelect.append(H('option',{text:v,value:v})));
 inputs.append(H('label',{class:'f610-field'},[H('span',{text:'YOUR ANSWER'}),numeric]),H('label',{class:'f610-field'},[H('span',{text:'UNIT'}),unitSelect]));
 const controls=H('div',{class:'f610-controls'}),checkBtn=btn('Check answer',check,'nova-btn primary'),hintBtn=btn('Hint',hint),nextBtn=btn('Next journey',next);nextBtn.disabled=true;controls.append(checkBtn,hintBtn,nextBtn);
 const fb=H('p',{class:'f610-feedback','aria-live':'polite'}),count=H('p',{class:'f610-progress'});panel.append(question,inputs,controls,fb,count);
 function current(){return C.presets[ids[index]];}
 function paint(){const p=current();question.textContent=`Journey ${index+1} of ${ids.length}. ${p.context} Enter the missing ${p.target} and its correct unit.`;count.textContent='Journeys solved: '+correctCount+' / '+ids.length;makeSVG(stage,p,{mode:'challenge',id:ids[index],cover:p.target,progress:solved?1:.6,solved,pose:solved?'celebrate':'think',caption:solved?'You used the correct formula.':'Use the givens and units.'});}
 function parse(){const s=numeric.value.trim().replace(',','.');return s&&Number.isFinite(Number(s))?Number(s):null;}
 function check(){if(solved)return;attempts++;const p=current(),val=parse(),u=unitSelect.value,exp=value(p,p.target),rightUnit=units(p.target);let ok=false,msg='';
 if(val===null)msg='Enter a number to complete this calculation.';
 else if(u!==rightUnit)msg='Check the unit. '+label(p.target)+' is measured in '+rightUnit+'.';
 else if(Math.abs(val-exp)<=.005){ok=true;msg='Correct! '+(p.target==='speed'?fmt(p.distance)+' ÷ '+fmt(p.time):p.target==='time'?fmt(p.distance)+' ÷ '+fmt(p.distance/p.time):fmt(p.distance/p.time)+' × '+fmt(p.time))+' = '+fmt(exp)+' '+rightUnit+'.';}
 else if(p.target==='speed'&&Math.abs(val-p.time/p.distance)<=.01)msg='The division is reversed. Speed is distance divided by time, not time divided by distance.';
 else if(p.target==='speed'&&Math.abs(val-p.distance*p.time)<=.01)msg='That is multiplication. To find speed, divide distance by the same journey time.';
 else if(p.target==='time'&&Math.abs(val-p.distance*(p.distance/p.time))<=.01)msg='You multiplied instead of dividing. Time is distance divided by speed.';
 else if(p.target==='distance'&&Math.abs(val-(p.distance/p.time)/p.time)<=.01)msg='You divided. Distance is speed multiplied by time.';
 else msg='Not yet: cover '+label(p.target)+' in the formula triangle, then calculate using the given quantities.';
 api.check(ok,msg,{preset:ids[index],target:p.target,attempt:val,unit:u});fb.textContent=msg;fb.classList.toggle('good',ok);fb.classList.toggle('bad',!ok);emit('correct',{preset:ids[index],correct:ok,value:val,unit:u});if(ok){solved=true;correctCount++;checkBtn.disabled=true;nextBtn.disabled=false;paint();M.flash(stage.querySelector('svg'),240,240,'result',40);}}
 function hint(){const p=current();const msg=p.target==='speed'?'Speed = distance ÷ time.':p.target==='distance'?'Distance = speed × time.':'Time = distance ÷ speed.';api.hint(msg);fb.textContent=msg;emit('hintUsed',{preset:ids[index]});}
 function next(){if(!solved)return;if(index>=ids.length-1){question.textContent='All journeys completed!';inputs.hidden=true;controls.hidden=true;stage.innerHTML='';N.cap(stage,ID,'SPEED · DISTANCE · TIME COMPLETE');N.scene.helperStrip(stage,'celebrate','Your units and calculations match.');fb.textContent='Brilliant! You matched each unknown to its correct relationship.';return;}index++;solved=false;numeric.value='';unitSelect.value=units(current().target);checkBtn.disabled=false;nextBtn.disabled=true;fb.textContent='';paint();}
 numeric.addEventListener('keydown',e=>{if(e.key==='Enter')check();});unitSelect.value=units(current().target);
 C._challenge={get:()=>({index,solved,correctCount,attempts,feedback:fb.textContent}),setAnswers:(v,u)=>{numeric.value=String(v);unitSelect.value=u;},check,hint,next};paint();}
const DEF={id:ID,title:'Speed–Distance–Time',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'Neon journey track with moving position ring, a core NOVA time number line and a labelled speed-distance-time formula triangle. Drag the journey ring and unknown cover in Explore.',
 staticAlt:'Speed = total distance divided by total time. Distance = speed times time. Time = distance divided by speed. Use km, h and km/h appropriately. A full journey can have legs with different speeds but only one average speed.',
 spec:{purpose:'Link distance, elapsed time and average speed through a moving journey and formula triangle.',params:'Total kilometres, hours, journey segments, target unknown D/S/T, timeline position, units.',presets:'Y8-041 speed; Y9-016 whole-journey average; Y9-022 distance; Y9-022 time.',steps:'See journey → watch movement → read distance → read time → cover unknown → calculate → verify.',interactions:'Drag the neon position ring between journey progress stops and drag the unknown cover onto D/S/T; red return tray, keyboard arrows and Delete, four task Challenge.',traps:'Swapped division, multiplying instead of dividing, not using whole journey, confusing speed/time/distance units.',gcse:'Compound measures, multiple-leg journeys, average speed, multi-step speed calculations.'}};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"makeSVG":["stage","p","o"]},exploreFields:{"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F6·10',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 8 and 9; GCSE compound measures',linked:['F0-02','F0-03','F0-04','F6-02','F6-09','F18-08']});
})();
