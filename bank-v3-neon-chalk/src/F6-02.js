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

/* F6-02 · Double Number Line · F0 NEON TUBE / NOVA CHALK · additive source. */
const F602_CONFIG={
 id:'F6-02',startMode:'watch',preset:'Y7-060',
 parameters:{xMin:0,snap:'aligned proportional marks',linkedScale:true,roundingDp:4},
 presets:{
  'Y7-060':{label:'Y7 · Tickets and cost',a:'Tickets',b:'Cost (£)',unitA:'',unitB:'£',known:2,knownB:6,target:8,max:10,major:2,minor:1,steps:10,context:'Two tickets cost six pounds. What do eight tickets cost?'},
  'Y8-007':{label:'Y8 · Increase by 25%',a:'Original (£)',b:'Increased (£)',unitA:'£',unitB:'£',known:40,knownB:50,target:60,max:80,major:20,minor:10,steps:8,context:'Forty pounds becomes fifty pounds. What does sixty pounds become at the same multiplier?'},
  'Y8-035':{label:'Y8 · Equation y = kx',a:'Input x',b:'Output y',unitA:'',unitB:'',known:3,knownB:7.5,target:9,max:12,major:3,minor:1.5,steps:8,context:'Three maps to seven point five. Find the value for nine.'},
  'Y8-039':{label:'Y8 · Pound to euro conversion',a:'Pounds',b:'Euros',unitA:'£',unitB:'€',known:5,knownB:6,target:15,max:20,major:5,minor:2.5,steps:8,context:'At the given classroom rate, five pounds equals six euros. How many euros for fifteen pounds?'}
 },
 events:{value:['preset','mark','markerRemoved','restore','reset','answer','hint','undo','step','showFactor'],types:['step','correct','hintUsed','mode']}
};
window.F602_CONFIG=F602_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=window.NovaV2Integration.configuration(F602_CONFIG),ID=C.id;
// F6-02 local pointer-release safety net. Does not modify the locked shared F0 core.
// SVG pointer capture can miss a fast release after a long drag. Let the F0
// handler process it first; complete only a still-active drag of this engine.
window.addEventListener?.('pointerup',ev=>{const d=N.ui._drag;
 if(!d||!(d.el?.classList?.contains('f602-pair')))return;
 Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});
},true);

const ROUND=(v)=>Number(Number(v).toFixed(4));
function value(p,x){return ROUND(x*p.knownB/p.known);}
function equal(a,b){return Math.abs(a-b)<=Math.max(1,Math.abs(a),Math.abs(b))*1e-8;}
function f(v){return String(ROUND(v));}
function fmt(v,u){return (u==='£'||u==='€'?u:'')+f(v);}
function scale(p){return p.knownB/p.known;}
function indexOf(p,x){return Math.round(x/p.max*p.steps);}
function fromIndex(p,i){return ROUND(p.max*i/p.steps);}
function limitIndex(p,i){return Math.max(0,Math.min(p.steps,Math.round(i)));}
function valueMessage(p,x){return fmt(x,p.unitA)+' links to '+fmt(value(p,x),p.unitB)+'.';}
function emit(k,v){if(!C.events.value.includes(k))throw Error('Undeclared F6-02 value event: '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
const STEPS=[
 {name:'Start with zero on both lines',narration:'Both number lines start from zero. The top counts the first quantity and the bottom counts the matching quantity. Their zero marks must line up.',pose:'explain',cat:'explain',caption:'Line up both zeros.'},
 {name:'Show one known pair',narration:'Read a pair at the same position on both lines. Two tickets match six pounds. Both rings sit directly one above the other.',pose:'point',cat:'checking',caption:'One place, two values.'},
 {name:'Scale both lines together',narration:'Move along the top number line from two tickets to eight tickets. That is four times as many. The bottom number line stretches by the same factor.',pose:'count',cat:'point',caption:'Both lines stretch together!'},
 {name:'Find the matching unknown',narration:'The ring at eight tickets connects to twenty-four pounds. The vertical linking line proves the two values go together.',pose:'think',cat:'think',caption:'Follow the linked marks.'},
 {name:'Check the constant relationship',narration:'Six divided by two is three pounds per ticket. Twenty-four divided by eight is also three. The rate stayed constant.',pose:'cheer',cat:'success',caption:'Same rate. Great work!'}
];
const CHALLENGES=[
 {preset:'Y7-060',target:8,hint:'The first quantity goes from two to eight: multiply by four. Apply the same factor to the cost.'},
 {preset:'Y8-007',target:60,hint:'The ratio fifty divided by forty is one point two five. Multiply the new original by this factor.'},
 {preset:'Y8-035',target:9,hint:'Work out the constant k by dividing seven point five by three.'},
 {preset:'Y8-039',target:15,hint:'Five pounds equals six euros. One pound is one point two euros; scale to fifteen pounds.'}
];
let currentScene=null;
function chalk(svg,x,y,t,role='given',size=30){return N.chalkText(svg,x,y,String(t),{role,size});}
function glass(svg,x,y,w,h,t,role='op',fs=24){N.neonBox(svg,x,y,w,h,{role,r:13});chalk(svg,x+w/2,y+h/2+fs*.32,t,role,fs);}
function geom(mob){return mob?{
 W:440,H:930,x:56,w:328,top:277,bottom:512,markerR:18,chipX:36,chipW:368,
 barY:104,upperNameY:209,lowerNameY:456, proofY:665,ret:{x:266,y:790,w:135,h:67},
 statX:25,statY:626,statW:390,statH:120,mini:true
 }:{W:1120,H:750,x:87,w:682,top:271,bottom:477,markerR:21,chipX:870,chipW:210,
 barY:104,upperNameY:191,lowerNameY:454,proofY:580,ret:{x:865,y:612,w:208,h:78},
 statX:833,statY:239,statW:250,statH:315,mini:false};}
function makeScene(stage,p,opt={}){
if(window.NovaLessonComponent?.active){[stage,p,opt]=window.NovaLessonComponent.args("makeScene",arguments);}

 if(currentScene)currentScene.dead=true;const live={dead:false};currentScene=live;
 const mob=window.innerWidth<=680,G=geom(mob);stage.innerHTML='';
 N.cap(stage,'DOUBLE NUMBER LINE · F6-02',opt.challenge?'YOUR TURN':opt.explore?'EXPLORE':'WATCH THE LINK');
 const svg=N.svg.root(G.W,G.H,'Two aligned F0 neon-glass number lines; a shared pair marker joins equivalent top and bottom positions at the same horizontal coordinate.');svg.classList.add('f602-svg');
 const rate=scale(p),maxB=value(p,p.max),knownX=G.x+G.w*p.known/p.max,targetX=G.x+G.w*p.target/p.max;
 const state=opt.step??4,selected=opt.challenge?p.target:state===0?0:state<=1?p.known:opt.selected??p.target;
 const ix=indexOf(p,selected),markX=G.x+G.w*ix/p.steps, markA=fromIndex(p,ix),markB=value(p,markA);
 const revealBottom=opt.challenge?!!opt.reveal:state>=3||opt.explore;
 chalk(svg,G.W/2,50,'TWO SCALES · ONE RELATIONSHIP','support',mob?24:30);
 glass(svg,G.chipX,G.barY,G.chipW,mob?57:62, mob?'Linked scale = '+f(rate):'Rate ×'+f(rate),'focus',mob?25:27);
 // Two calibrated core lines. No component-owned tick rendering or private line primitives.
 const lineA=N.numberLine(svg,{x:G.x,y:G.top,w:G.w,min:0,max:p.max,major:p.major,minor:p.minor,arrows:true,
 labelSize:mob?21:20,label:function(v){return fmt(v,p.unitA);}});
 const lineB=N.numberLine(svg,{x:G.x,y:G.bottom,w:G.w,min:0,max:maxB,major:value(p,p.major),minor:value(p,p.minor),arrows:true,
 labelSize:mob?21:20,label:function(v){if(!opt.challenge)return fmt(v,p.unitB);return equal(v,0)||equal(v,p.knownB)?fmt(v,p.unitB):'';}});
 chalk(svg,G.x+G.w/2,G.upperNameY,p.a,'given',mob?28:31);
 chalk(svg,G.x+G.w/2,G.lowerNameY,p.b,'op',mob?28:31);
 // Aligned evidence guides connect the same proportional position in both lanes.
 for(const at of [0,p.known,p.max]){const u=G.x+G.w*at/p.max;
   N.neonLine(svg,u,G.top+29,u,G.bottom-31,{role:'support',width:2,dash:'7 12'});
 }
 // Known anchor pair stays visible during challenge; the answer position remains unlabelled.
 if(state>=1||opt.challenge||opt.explore){
   N.neonRing(svg,knownX,G.top,{role:'given',r:14,pulse:false});
   N.neonRing(svg,knownX,G.bottom,{role:'given',r:14,pulse:false});
   N.neonLine(svg,knownX,G.top+18,knownX,G.bottom-19,{role:'given',width:2,dash:'8 11'});
   if(mob){glass(svg,16,G.top+52,162,57,fmt(p.known,p.unitA),'given',25);glass(svg,258,G.bottom+45,166,57,fmt(p.knownB,p.unitB),'given',25);}
   else{glass(svg,32,343,205,62,'Known '+fmt(p.known,p.unitA),'given',24);glass(svg,425,351,248,62,'Matches '+fmt(p.knownB,p.unitB),'given',24);}
 }
 if(opt.challenge){
   N.neonRing(svg,targetX,G.top,{role:'focus',r:22,pulse:false});
   N.neonRing(svg,targetX,G.bottom,{role:revealBottom?'result':'unknown',r:23,pulse:false});
   N.neonLine(svg,targetX,G.top+27,targetX,G.bottom-29,{role:'focus',width:3,dash:'9 13'});
   chalk(svg,targetX,G.top-42,fmt(p.target,p.unitA),'focus',mob?30:36);
   chalk(svg,targetX,G.bottom-42,revealBottom?fmt(value(p,p.target),p.unitB):'?','unknown',mob?31:35);
 }else if(state>=0 && (opt.visible!==false)){
   const moving=E('g',{class:'f602-pair',tabindex:opt.explore?0:null,role:opt.explore?'slider':'img',
    'aria-label':opt.explore?'Linked marker. Arrow keys to move. Delete to remove.':`Linked marker ${valueMessage(p,markA)}`,
    'aria-valuemin':opt.explore?'0':null,'aria-valuemax':opt.explore?String(p.steps):null,
    'aria-valuenow':opt.explore?String(ix):null,'data-pair-index':String(ix)},svg);
   N.neonLine(moving,markX,G.top+21,markX,G.bottom-22,{role:'result',width:4});
   N.neonRing(moving,markX,G.top,{role:'focus',r:G.markerR,pulse:false});
   N.neonRing(moving,markX,G.bottom,{role:'result',r:G.markerR,pulse:false});
   chalk(moving,markX,G.top-40,fmt(markA,p.unitA),'focus',mob?28:36);
   chalk(moving,markX,G.bottom-40,revealBottom?fmt(markB,p.unitB):'?','result',mob?28:36);
   if(opt.explore){
    function change(to,kind){if(live.dead)return;opt.onMove?.(limitIndex(p,to),kind);
     // Rerender replaces the SVG <g>. Restore the keyboard focus to the
     // successor marker so a second arrow or Delete works immediately.
     if(kind==='keyboard')Promise.resolve().then(()=>stage.querySelector('.f602-pair')?.focus({preventScroll:true}));
    }
    moving.addEventListener('keydown',e=>{
     const k=e.key;if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();change(ix+1,'keyboard');}
     else if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();change(ix-1,'keyboard');}
     else if(k==='Home'){e.preventDefault();change(0,'keyboard');}
     else if(k==='End'){e.preventDefault();change(p.steps,'keyboard');}
     else if(k==='Delete'||k==='Backspace'){e.preventDefault();opt.onRemove?.('keyboard');}
    });
    const stepPx=G.w/p.steps;
    N.ui.svgDrag(svg,moving,{box:{x:markX-31,y:G.top-25,w:62,h:G.bottom-G.top+54},
     zones:()=>Array.from({length:p.steps+1},(_,i)=>({id:String(i),kind:'drop',x:G.x+i*stepPx-stepPx*.48,y:G.top-64,w:stepPx*.96,h:G.bottom-G.top+128})).concat([{id:'return',kind:'remove',...G.ret}]),
     onDrop:id=>{if(live.dead)return false;Promise.resolve().then(()=>{if(!live.dead)change(Number(id),'drag');});return true;},
     onRemove:()=>Promise.resolve().then(()=>{if(!live.dead)opt.onRemove?.('drag');})});
   }
   if(opt.animate && !N.reducedMotion() && state===2){
    const oldX=knownX,delta=oldX-markX;M.arrive(moving,delta,0,900,M.ease.inOut);
    M.trail(svg,`M${oldX} ${G.top} L${markX} ${G.top}`,'focus',850);
    M.trail(svg,`M${oldX} ${G.bottom} L${markX} ${G.bottom}`,'result',850);
   }
 }
 if(opt.explore){
   glass(svg,G.ret.x,G.ret.y,G.ret.w,G.ret.h,'RETURN','error',mob?23:29);
   if(!opt.visible)glass(svg,mob?55:205,mob?767:610,mob?166:230,70,'MARKER REMOVED','unknown',mob?22:26);
 }
 const annotation=opt.challenge?'Match the top value to its bottom value.':state===0?'First align the zero marks.':state===1?'Both values belong to one marked pair.':state===2?'Move the markers by the same factor.':state===3?'Read the second line under your mark.':'Confirm the multiplier from both pairs.';
 if(mob){
   glass(svg,G.statX,G.statY,G.statW,G.statH, opt.challenge?'TOP '+fmt(p.target,p.unitA)+' → BOTTOM ?':opt.explore?'Move the paired neon rings':'Same position = matching values','support',opt.challenge?23:22);
 }else{
   glass(svg,G.statX,G.statY,G.statW,90,opt.challenge?'FIND THE PAIR':'LINKED QUANTITIES','given',24);
   glass(svg,G.statX,G.statY+112,G.statW,85,'Factor ×'+f(rate),'focus',28);
   chalk(svg,G.statX+G.statW/2,G.statY+261,opt.challenge?'Unknown value hidden':(opt.explore?valueMessage(p,markA):'A / B remains linked'),'result',18);
 }
 if(!opt.challenge&&!opt.explore&&state>=4){chalk(svg,mob?220:434,mob?861:670,fmt(p.knownB,p.unitB)+' ÷ '+fmt(p.known,p.unitA)+' = '+f(rate),'result',mob?22:26);}
 stage.appendChild(svg);
 N.scene.helperStrip(stage,opt.pose||'explain',opt.caption||'Track the matched positions.');
 return {svg,live,geometry:G,markIndex:ix,selected:markA,markB};
}
function teach(i,stage){const p=C.presets[C.preset],t=STEPS[i];makeScene(stage,p,{step:i,animate:i===2,pose:t.pose,caption:t.caption});}
function controls(parent){return (tag,attr,kids)=>{let x=H(tag,attr,kids);parent.appendChild(x);return x;};}
function explore(panel,stage){
 window.NovaLessonComponent?.applyExploreModels();let presetId=C.preset;
 window.NovaLessonComponent?.applyExploreModels();const add=controls(panel),status=add('p',{class:'f602-status','aria-live':'polite',text:'Move the linked rings. Both values must move together.'});
 window.NovaLessonComponent?.applyExploreModels();const head=add('div',{class:'f602-controls'}),pick=H('select',{'aria-label':'Choose a proportional relationship'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([id,p])=>pick.appendChild(H('option',{value:id,text:p.label})));window.NovaLessonComponent?.applyExploreModels();pick.value=presetId;
 window.NovaLessonComponent?.applyExploreModels();head.appendChild(H('label',{},['Relationship',pick]));
 window.NovaLessonComponent?.applyExploreModels();const jump=H('input',{type:'number',step:1,min:0,max:C.presets[presetId].steps,value:indexOf(C.presets[presetId],C.presets[presetId].known),'aria-label':'Marker position on top scale'});
 window.NovaLessonComponent?.applyExploreModels();head.appendChild(H('label',{},['Marker step',jump]));
 window.NovaLessonComponent?.applyExploreModels();const actions=add('div',{class:'f602-actions'}),minus=H('button',{class:'nova-btn',text:'← One mark'}),plus=H('button',{class:'nova-btn',text:'One mark →'}),returnBtn=H('button',{class:'nova-btn',text:'Remove marker'}),restore=H('button',{class:'nova-btn',text:'Restore marker'}),undo=H('button',{class:'nova-btn',text:'Undo'}),reset=H('button',{class:'nova-btn',text:'Reset'});
 window.NovaLessonComponent?.applyExploreModels();actions.append(minus,plus,returnBtn,restore,undo,reset);
 window.NovaLessonComponent?.applyExploreModels();add('p',{class:'f602-help',text:'Drag the connected neon rings to another aligned mark on either line, or use Arrow keys and the controls. The green and gold rings stay vertically matched. Drag to the red RETURN tray to remove.'});
 window.NovaLessonComponent?.applyExploreModels();let index=indexOf(C.presets[presetId],C.presets[presetId].known),visible=true,history=[];
 window.NovaLessonComponent?.applyExploreModels();function snapshot(){history.push({index,visible});if(history.length>50)history.shift();}
 window.NovaLessonComponent?.applyExploreModels();function render(){const p=C.presets[presetId];jump.max=p.steps;jump.value=index;
  makeScene(stage,p,{explore:true,selected:fromIndex(p,index),visible,pose:index===0?'explain':'point',caption:visible?'Same place on both scales.':'Restore the pair to explore again.',
   onMove:(next,kind)=>{snapshot();index=next;visible=true;emit('mark',{preset:presetId,index,valueA:fromIndex(p,index),valueB:value(p,fromIndex(p,index)),method:kind});status.textContent=valueMessage(p,fromIndex(p,index));render();},
   onRemove:kind=>{snapshot();visible=false;emit('markerRemoved',{method:kind});status.textContent='The pair marker has been returned. Restore it to continue.';render();}});
 }
 window.NovaLessonComponent?.applyExploreModels();function move(to){const p=C.presets[presetId];snapshot();index=limitIndex(p,to);visible=true;emit('mark',{index,method:'button',valueA:fromIndex(p,index),valueB:value(p,fromIndex(p,index))});status.textContent=valueMessage(p,fromIndex(p,index));render();}
 window.NovaLessonComponent?.applyExploreModels();pick.onchange=()=>{presetId=pick.value;history=[];index=indexOf(C.presets[presetId],C.presets[presetId].known);visible=true;emit('preset',presetId);status.textContent='Now inspect the '+pick.selectedOptions[0].textContent+' scale.';render();};
 window.NovaLessonComponent?.applyExploreModels();jump.onchange=()=>move(Number(jump.value));window.NovaLessonComponent?.applyExploreModels();minus.onclick=()=>move(index-1);window.NovaLessonComponent?.applyExploreModels();plus.onclick=()=>move(index+1);
 window.NovaLessonComponent?.applyExploreModels();returnBtn.onclick=()=>{snapshot();visible=false;emit('markerRemoved',{method:'button'});status.textContent='Pair returned.';render();};
 window.NovaLessonComponent?.applyExploreModels();restore.onclick=()=>{snapshot();visible=true;emit('restore',index);status.textContent='Pair restored.';render();};
 window.NovaLessonComponent?.applyExploreModels();undo.onclick=()=>{const h=history.pop();if(!h)return;index=h.index;visible=h.visible;emit('undo',{index,visible});status.textContent='Previous position restored.';render();};
 window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{snapshot();index=indexOf(C.presets[presetId],C.presets[presetId].known);visible=true;emit('reset',true);status.textContent='Back to the known pair.';render();};
 window.NovaLessonComponent?.applyExploreModels();C._explore={setPreset(id){pick.value=id;pick.onchange();},setMark(i){move(i);},remove(){returnBtn.click();},get(){const p=C.presets[presetId];return {preset:presetId,index,visible,a:fromIndex(p,index),b:value(p,fromIndex(p,index)),status:status.textContent};}};
 window.NovaLessonComponent?.applyExploreModels();render();
}
function challenge(panel,api,stage){
 const add=controls(panel),question=add('p',{class:'f602-status','aria-live':'polite'}),row=add('div',{class:'f602-challenge'}),answer=H('input',{type:'text',inputmode:'decimal',placeholder:'Value','aria-label':'Missing bottom line value'}),check=H('button',{class:'nova-btn primary',text:'Check value'}),hint=H('button',{class:'nova-btn',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next challenge',disabled:true});row.append(answer,check,hint,next);
 const feedback=add('p',{class:'f602-status','aria-live':'polite'}),peer=add('div',{class:'f602-peer'}),avatar=H('img',{alt:'Izaac considering the paired number lines'}),peerText=H('span',{text:'Izaac is checking your matching value.'});peer.append(avatar,peerText);
 let i=0,wrong=0,solved=0,passed=false;
 function pose(name,text){const q=N.helperImg(name,'teen');avatar.src=q.src;avatar.alt=q.alt;peerText.textContent=text;}
 function task(){return CHALLENGES[i];}
 function p(){return C.presets[task().preset];}
 function draw(){const q=task(),data=p();question.textContent='Challenge '+(i+1)+' of '+CHALLENGES.length+' · '+data.context;
  makeScene(stage,Object.assign({},data,{target:q.target}),{challenge:true,reveal:passed,pose:wrong>1?'think':'point',caption:passed?'Correct match!':'Look vertically: the marks link.'});}
 function respond(){const data=p(),str=answer.value.trim().replace(/[£€\s,]/g,''),v=Number(str);
  if(str===''||!Number.isFinite(v)){feedback.textContent='Enter a numerical value.';return;}
  const right=value(data,task().target),ok=equal(v,right);
  api.check(ok,ok?'Correct. Both lines preserve the same multiplicative relationship.':wrongReason(data,v,right),{task:i,value:v,preset:task().preset});
  emit('answer',{task:i,correct:ok,value:v});
  if(ok){passed=true;solved++;next.disabled=false;check.disabled=true;feedback.textContent='Correct. '+fmt(task().target,data.unitA)+' matches '+fmt(right,data.unitB)+'.';pose('cheer','Matching value confirmed.');draw();}
  else{wrong++;feedback.textContent=wrongReason(data,v,right);pose(wrong>1?'oops':'think','Try the matching scale factor.');}
 }
 function wrongReason(data,v,right){
   if(equal(v,task().target))return 'You copied the top number. Use the ratio between the two lines.';
   if(equal(v,data.knownB))return 'That is the known bottom value. The new top mark needs a new matching bottom value.';
   if(equal(v,ROUND(data.knownB+(task().target-data.known))))return 'An additive step is not the correct multiplicative scale factor.';
   if(equal(v,ROUND(data.knownB*data.known/task().target)))return 'You divided in the opposite direction. Compare the top values carefully.';
   return 'Find the rate from the known pair, then apply it to the target on the top line.';
 }
 check.onclick=respond;
 answer.onkeydown=e=>{if(e.key==='Enter'&&!check.disabled)respond();};
 hint.onclick=()=>{api.hint(task().hint);emit('hint',i);feedback.textContent=task().hint;pose('think','Find the unit rate first.');};
 next.onclick=()=>{if(i===CHALLENGES.length-1){question.textContent='All four comparisons complete.';feedback.textContent='You kept both number lines aligned through every challenge.';stage.innerHTML='';N.cap(stage,'F6-02','COMPLETE');N.scene.helperStrip(stage,'cheer','You linked every pair!');next.disabled=true;return;}
  i++;wrong=0;passed=false;answer.value='';check.disabled=false;next.disabled=true;feedback.textContent='The matching value is hidden until you answer.';pose('think','Izaac is ready for the next problem.');draw();};
 pose('think','Izaac is checking your matching value.');feedback.textContent='The answer on the bottom line is hidden until you answer.';draw();
 C._challenge={get:()=>({i,solved,wrong,passed,feedback:feedback.textContent}),setAnswer:v=>{answer.value=String(v);},check:respond,next:()=>next.click()};
}
const DEF={id:ID,title:'Double Number Line · Linked Scale Observatory',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'Two NOVA neon-glass number lines with proportional marks vertically aligned. The connected paired rings can be dragged along the lines, and the matching values update together.',
 staticAlt:'Known matching values provide a fixed rate. At any new top value x, the corresponding bottom value is x times the same rate.',
 spec:{purpose:'Show direct proportion by aligning two numerical scales with one multiplicative mapping; apply to prices, percentage multipliers, equations and exchange rates.',params:'Two aligned scales, rate > 0, step size and major/minor lines, re-grabbable linked ring with snap and return zone.',presets:'Y7-060 tickets/cost; Y8-007 +25%; Y8-035 y=kx; Y8-039 pound/euro.',steps:'Zero pair → known pair → synchronized scale → unknown mark → verify constant rate.',interactions:'Drag or keyboard-move linked pair to aligned scale positions, Remove/Restore, Undo, Reset; check unrevealed Challenge value.',traps:'Reading only one line; assuming a constant additive difference; applying the ratio upside down; copying the known pair without scaling.',gcse:'Extend to y=kx, calibration, percentage multiplier and currency-rate questions.'}}

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS,"CHALLENGES":()=>CHALLENGES},draws:{"makeScene":["stage","p","opt"]},exploreFields:{}});
N.bankMount({id:ID,num:'F6·02',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 7–9',linked:['F0-02','F0-03','F0-04','F1-01','F2-02','F5-15','F6-01','F6-08 (future preset)']});
})();
