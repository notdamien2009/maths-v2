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


var NOVA_F5_04_CONFIG={startMode:'guided',preset:'quarters',events:['preset','numerator','denominator','factor','dragPosition','jump','reset'],presets:{
 quarters:{label:'Three quarters',n:3,d:4,min:0,max:2,factor:2},
 halves:{label:'One half',n:1,d:2,min:0,max:2,factor:2},
 thirds:{label:'Two thirds',n:2,d:3,min:0,max:2,factor:3},
 improper:{label:'Five thirds (beyond one)',n:5,d:3,min:0,max:2,factor:2},
 negative:{label:'Minus two thirds',n:-2,d:3,min:-1,max:1,factor:2},
 eighths:{label:'Seven eighths',n:7,d:8,min:0,max:2,factor:2},
 aboveTwo:{label:'Seven thirds (above two)',n:7,d:3,min:0,max:3,factor:2}
 }};
(function(){'use strict';
var N=NOVA,S=N.svg,E=S.el,H=N.h,M=N.motion,C=window.NovaV2Integration.configuration(NOVA_F5_04_CONFIG),ID='F5-04',live=null;
function send(key,value){if(C.events.indexOf(key)<0)throw Error('unregistered value key '+key);N.events.emit('value',{engine:ID,key:key,value:value});}
function lab(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,String(t),{role:role||'support',size:size||22,anchor:anchor||'middle'});}
function stack(p,x,y,n,d,role,size){var g=E('g',{'aria-label':(n<0?'minus ':'')+Math.abs(n)+' over '+d},p),z=size||26;
 if(d===1){lab(g,x,y+6,n,role,z);return g;}
 lab(g,x,y-z*.34,n,role,z);N.neonLine(g,x-z*.66,y+2,x+z*.66,y+2,{role:role,width:2});lab(g,x,y+z*.88,d,role,z);return g;}
function dataOf(key){var p=C.presets[key]||C.presets.quarters;return {n:p.n,d:p.d,min:p.min,max:p.max,factor:p.factor};}
function norm(o){var d=Math.max(2,Math.min(8,Math.round(o.d))),n=Math.max(o.min*d,Math.min(o.max*d,Math.round(o.n))),factor=Math.max(2,Math.min(3,Math.round(o.factor)));return {n:n,d:d,min:o.min,max:o.max,factor:factor};}
function readFraction(o){return (o.n<0?'minus ':'')+Math.abs(o.n)+' over '+o.d;}
function mkGlow(s){var defs=E('defs',{},s);var g=E('linearGradient',{id:'fnl-metal',x1:'0%',y1:'0%',x2:'0%',y2:'100%'},defs);[['0%','#93b5cb'],['21%','#2c5977'],['46%','#102640'],['85%','#234861'],['100%','#a2c2d7']].forEach(function(a){E('stop',{offset:a[0],'stop-color':a[1]},g);});}
function draw(stage,state,opt){
if(window.NovaLessonComponent?.active){[stage,state,opt]=window.NovaLessonComponent.args("draw",arguments);}
opt=opt||{};if(live)live.dead=true;var current={dead:false};live=current;
 var o=norm(state),small=window.innerWidth<=670,W=small?420:1100,V=small?790:662;
 stage.innerHTML='';N.cap(stage,'F5-04 · '+(opt.caption||'Fraction positions'),'PREMIUM');
 var svg=S.root(W,V,'F1-01 number-line fractions preset. Two aligned NOVA.numberLine axes use '+o.d+' and '+(o.d*o.factor)+' equal intervals per whole. The rings mark '+readFraction(o)+'.');svg.classList.add('fnl-svg');mkGlow(svg);
 var x=small?58:180,w=small?308:748,y1=small?257:234,y2=small?477:429,center=small?210:550,px=function(n){return x+w*(n-o.min*o.d)/(o.d*(o.max-o.min));},where=px(o.n),hidden=!!opt.hide,phase=opt.phase||'same';
 lab(svg,center,small?44:46,'One scale · two partitions','support',small?25:31);
 lab(svg,center,small?88:92,'A finer scale does not move the number','given',small?19:22);
 // Allow the top stacked-fraction callout its own clear area; do not place a panel behind it.
 if(phase==='whole')lab(svg,center,small?168:176,'Equal gaps · fixed unit','focus',small?18:20);
 var first=E('g',{'data-scale':'primary'},svg),second=E('g',{'data-scale':'refined'},svg);
 // Both scales use the single v3.5-locked NOVA.numberLine primitive, never custom tick loops.
 var top=N.numberLine(first,{x:x,y:y1,w:w,min:o.min,max:o.max,major:1,minor:1/o.d,labelSize:small?20:19});
 var bottom=N.numberLine(second,{x:x,y:y2,w:w,min:o.min,max:o.max,major:1,minor:1/(o.d*o.factor),labelSize:small?20:19});
 lab(svg,x-3,small?231:206,o.d+' equal parts / whole','focus',small?18:19,'start');
 lab(svg,x-3,small?432:380,(o.d*o.factor)+' equal parts / whole','result',small?18:19,'start');
 // The same endpoint x proves numerical equality on the shared scale.
 if(phase!=='whole'){
  // Same origin and same endpoint: these are genuine equal distances, not a palette comparison.
  if(Math.abs(top.s(0)-where)>1){N.neonLine(svg,top.s(0),y1-15,where,y1-15,{role:'focus',width:2.8});N.neonLine(svg,bottom.s(0),y2-15,where,y2-15,{role:'result',width:2.8});}
  N.neonLine(svg,where,y1-24,where,y2+20,{role:'op',width:2});
  var high=E('g',{'data-marker':'top',class:'fnl-handle',role:opt.interactive?'slider':'img',tabindex:opt.interactive?0:null,'aria-label':'Fraction position marker, numerator '+o.n+', denominator '+o.d,'aria-valuemin':o.min*o.d,'aria-valuemax':o.max*o.d,'aria-valuenow':o.n},svg);
  N.neonRing(high,where,y1,{role:'focus',r:small?11:13,pulse:false});N.neonRing(svg,where,y2,{role:'result',r:small?11:13,pulse:false});
  if(hidden){lab(svg,center,y1-82,'Find the right tick','unknown',small?18:20);}else{
   N.neonBox(svg,Math.max(x-6,Math.min(x+w-136,where-68)),y1-128,136,65,{role:'focus',r:13});
   stack(svg,Math.max(x+62,Math.min(x+w-68,where)),y1-94,o.n,o.d,'focus',small?24:26);
   // The refined stacked fraction is already displayed in the result strip below.
   // Keeping it there avoids a floating card colliding with the lower axis/result border.
  }
  if(opt.jump&&!opt.interactive){var zero=top.s(0);if(Math.abs(zero-where)>1){var j=S.hop(svg,zero,where,y1-18,{role:'op',height:Math.min(small?38:57,Math.abs(zero-where)*.21+17)});j.setAttribute('data-jump','yes');}}
  if(opt.interactive){
   var zones=[];for(var k=o.min*o.d;k<=o.max*o.d;k++){var zx=px(k),gw=Math.max(12,Math.min(28,w/(o.d*(o.max-o.min))*0.86));zones.push({id:'numerator:'+k,kind:'drop',x:zx-gw/2,y:y1-37,w:gw,h:70});}
   high.addEventListener('keydown',function(e){var step=e.key==='ArrowRight'||e.key==='ArrowUp'?1:e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:0;
    if(step||e.key==='Home'||e.key==='End'){e.preventDefault();var next=e.key==='Home'?o.min*o.d:e.key==='End'?o.max*o.d:Math.max(o.min*o.d,Math.min(o.max*o.d,o.n+step));opt.change(next,'keyboard');}});
   N.ui.svgDrag(svg,high,{box:{x:where-17,y:y1-17,w:34,h:34},canStart:function(){return !current.dead;},zones:function(){return zones;},onDrop:function(id){opt.change(+id.split(':')[1],'drag');return true;}});
  }
  if(opt.animate){second.style.opacity='0';M.tween(1050,function(e){if(!current.dead)second.style.opacity=String(e);},M.ease.inOut,function(){if(!current.dead)M.flash(svg,where,y2,'result',38);});}
 }else{second.style.opacity='0.17';}
 var ry=small?638:596;N.neonBox(svg,small?36:199,small?566:539,small?348:705,small?169:105,{role:phase==='whole'?'support':'result',r:16});
 if(phase==='whole'){lab(svg,center,small?606:583,'Each 0 → 1 gap represents one whole','support',small?19:21);lab(svg,center,small?642:619,'Each matching gap has equal length','focus',small?18:19);}
 else{lab(svg,center,small?603:572,hidden?'Both marks use one position':'Equivalent positions · equal distance','result',small?19:21);
  if(hidden)lab(svg,center,small?646:612,'Count the equal intervals from zero','support',small?17:19);
  else if(small){stack(svg,132,694,o.n,o.d,'focus',24);lab(svg,207,699,'=', 'support',27);stack(svg,298,694,o.n*o.factor,o.d*o.factor,'result',24);}
  else{stack(svg,443,616,o.n,o.d,'focus',21);lab(svg,545,619,'=', 'support',29);stack(svg,648,616,o.n*o.factor,o.d*o.factor,'result',21);}
 }
 stage.appendChild(svg);
 N.scene.helperStrip(stage,opt.pose||'point',opt.helper||'The rings share one position.');
 return {svg:svg,where:where,o:o};
}
var steps=[
 {name:'Fix the whole',o:{n:0,d:2,min:0,max:2,factor:2},phase:'whole',mood:'neutral',pose:'explain',helper:'The gap from zero to one is one whole.',prompt:'Which tick is exactly one whole?',narration:'Look at the whole numbers. The distance from zero to one is one whole. No matter how many parts we choose, that whole length never changes.'},
 {name:'Partition into halves',o:{n:1,d:2,min:0,max:2,factor:2},phase:'position',mood:'focus',pose:'point',helper:'One of two equal steps reaches one half.',prompt:'Is one half exactly midway?',narration:'Cut the whole into two equal parts. One half is one equal step after zero, exactly in the middle.'},
 {name:'Count quarter steps',o:{n:3,d:4,min:0,max:2,factor:2},phase:'position',mood:'think',pose:'count',helper:'Count three small steps after zero.',prompt:'Why is the ring at three quarters?',narration:'Each gap now represents one quarter. Count three quarter steps from zero. The marker sits at three quarters.'},
 {name:'Refine the partitions',o:{n:3,d:4,min:0,max:2,factor:2},phase:'same',animate:true,mood:'focus',pose:'compare',helper:'The point stays fixed as eighths appear.',prompt:'Why does three quarters equal six eighths?',narration:'Divide each quarter into two equal parts. The bottom number line now has eighths. Six eighths lies at exactly the same position as three quarters.'},
 {name:'Move past one',o:{n:5,d:3,min:0,max:2,factor:2},phase:'same',mood:'think',pose:'point',helper:'Keep counting beyond one whole.',prompt:'Why is five thirds greater than one?',narration:'Three thirds makes one whole. Two more thirds takes us to five thirds, beyond one.'},
 {name:'Travel left of zero',o:{n:-2,d:3,min:-1,max:1,factor:2},phase:'same',mood:'cheer',pose:'compare',helper:'Negative fractions are to the left of zero.',prompt:'How do negative two thirds and positive two thirds differ?',narration:'From zero, count two third-steps left. The fraction is negative two thirds. A negative fraction has a direction as well as a size.'}
];
function guided(i,stage){var t=steps[i];draw(stage,t.o,{caption:t.name,phase:t.phase,animate:!!t.animate,jump:i===2||i===4||i===5,pose:t.pose,helper:t.helper});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var o=dataOf(C.preset),summary=H('p',{class:'fnl-feedback'}),pre=H('select',{class:'nova-input','aria-label':'Choose fraction number-line preset'}),den=H('select',{class:'nova-input','aria-label':'Denominator'}),fact=H('select',{class:'nova-input','aria-label':'Subdivision factor'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){pre.appendChild(H('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();[2,3,4,5,6,8].forEach(function(d){den.appendChild(H('option',{value:d,text:d+' parts per whole'}));});window.NovaLessonComponent?.applyExploreModels();[2,3].forEach(function(f){fact.appendChild(H('option',{value:f,text:'×'+f+' finer'}));});
 window.NovaLessonComponent?.applyExploreModels();var controls=H('div',{class:'fnl-controls'}),dec=H('button',{class:'nova-btn',text:'−','aria-label':'One fraction step left'}),inc=H('button',{class:'nova-btn',text:'+','aria-label':'One fraction step right'}),reset=H('button',{class:'nova-btn ghost',text:'Reset position'});
 window.NovaLessonComponent?.applyExploreModels();function setN(n,src){o.n=Math.max(o.min*o.d,Math.min(o.max*o.d,n));send(src==='drag'?'dragPosition':'numerator',o.n);paint(src==='keyboard');}
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){o=norm(o);summary.textContent='At '+readFraction(o)+' of the whole; refine by ×'+o.factor+' and the ring remains at the same mathematical position.';
  draw(stage,o,{caption:'Explore · snap to an equal part',interactive:true,jump:true,pose:'compare',helper:'Drag the upper ring, or use the arrow keys.',change:setN});
  if(focus){var el=stage.querySelector('[data-marker="top"]');if(el)el.focus();}}
 window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){C.preset=pre.value;o=dataOf(C.preset);den.value=o.d;fact.value=o.factor;send('preset',C.preset);paint();};
 window.NovaLessonComponent?.applyExploreModels();den.onchange=function(){var current=o.n/o.d;o.d=+den.value;o.n=Math.max(o.min*o.d,Math.min(o.max*o.d,Math.round(current*o.d)));send('denominator',o.d);paint();};
 window.NovaLessonComponent?.applyExploreModels();fact.onchange=function(){o.factor=+fact.value;send('factor',o.factor);paint();};
 window.NovaLessonComponent?.applyExploreModels();dec.onclick=function(){setN(o.n-1,'stepper');};window.NovaLessonComponent?.applyExploreModels();inc.onclick=function(){setN(o.n+1,'stepper');};window.NovaLessonComponent?.applyExploreModels();reset.onclick=function(){o.n=0;send('reset',true);paint();};
 window.NovaLessonComponent?.applyExploreModels();controls.appendChild(H('label',{text:'Example'}));window.NovaLessonComponent?.applyExploreModels();controls.appendChild(pre);window.NovaLessonComponent?.applyExploreModels();controls.appendChild(H('label',{text:'Partition'}));window.NovaLessonComponent?.applyExploreModels();controls.appendChild(den);window.NovaLessonComponent?.applyExploreModels();controls.appendChild(H('label',{text:'Refine'}));window.NovaLessonComponent?.applyExploreModels();controls.appendChild(fact);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(controls);
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('div',{class:'fnl-controls'},[dec,inc,reset]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(summary);
 window.NovaLessonComponent?.applyExploreModels();den.value=o.d;window.NovaLessonComponent?.applyExploreModels();fact.value=o.factor;window.NovaLessonComponent?.applyExploreModels();C._explore={get:function(){return Object.assign({},o);},set:function(n,d,min,max,factor){o={n:n,d:d,min:min,max:max,factor:factor||2};den.value=o.d;fact.value=o.factor;paint();},place:setN};window.NovaLessonComponent?.applyExploreModels();paint();
}
function challenge(panel,api,stage){var tasks=[
 {min:0,max:2,d:4,n:3,question:'Place the ring at three quarters. Count the quarter steps from zero.',hint:'Three quarter-length gaps after zero.'},
 {min:0,max:2,d:3,n:5,question:'Place the ring at five thirds, beyond one whole.',hint:'Count three thirds to one, then two thirds more.'},
 {min:-1,max:1,d:3,n:-2,question:'Place the ring at negative two thirds, to the left of zero.',hint:'Count two third-steps to the left from zero.'}
 ],ix=0,o,wrong=0,taskText=H('p',{class:'fnl-feedback'}),status=H('p',{class:'fnl-feedback',role:'status','aria-live':'polite'}),peerImg=H('img',{src:N.helperImg('read-tablet','teen').src,alt:N.helperImg('read-tablet','teen').alt}),peerText=H('span',{text:'Izaac is watching your number line.'}),bMinus=H('button',{class:'nova-btn',text:'−'}),bPlus=H('button',{class:'nova-btn',text:'+'}),check=H('button',{class:'nova-btn primary',text:'Check position'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'});
 function pose(k,text){var p=N.helperImg(k,'teen');peerImg.src=p.src;peerImg.alt=p.alt;peerText.textContent=text;}
 function change(n,src){o.n=n;paint(src==='keyboard');}
 function paint(focus){draw(stage,o,{caption:'Challenge · place the fraction',interactive:true,hide:true,pose:'think',helper:'Read the task; find the correct tick.',change:change});if(focus){var el=stage.querySelector('[data-marker="top"]');if(el)el.focus();}}
 function load(){var t=tasks[ix];wrong=0;o={min:t.min,max:t.max,d:t.d,n:0,factor:2};taskText.textContent='Challenge '+(ix+1)+' of 3 · '+t.question;status.textContent='Move the ring, then check your position.';pose('read-tablet','Izaac is following your selection.');api.fb.textContent='';paint();}
 bMinus.onclick=function(){change(Math.max(o.min*o.d,o.n-1),'stepper');};bPlus.onclick=function(){change(Math.min(o.max*o.d,o.n+1),'stepper');};
 hint.onclick=function(){api.hint(tasks[ix].hint);pose('idea','Izaac has a clue.');status.textContent=tasks[ix].hint;};
 check.onclick=function(){var t=tasks[ix],ok=o.n===t.n;api.check(ok,ok?'Correct. The ring is '+readFraction(o)+' from zero.':'Try again. Count the fraction-sized gaps from zero.');if(ok){pose(ix===2?'proud':'idea','Exactly the right position.');status.textContent='Correct: the point is exactly where it belongs.';if(ix<2){ix++;M.delay(560,load);}else{pose('victory','Three out of three. Excellent!');check.disabled=true;}}
 else{wrong++;if(wrong>=2)pose('worried','Count the little gaps, not the large ticks.');}};
 panel.appendChild(taskText);panel.appendChild(H('div',{class:'fnl-controls'},[bMinus,bPlus,check,hint]));panel.appendChild(status);panel.appendChild(H('div',{class:'fnl-peer'},[peerImg,peerText]));
 C._challenge={get:function(){return {task:ix,n:o.n,d:o.d};},place:function(n){change(n,'api');},task:function(){return ix;}};load();}
var DEF={id:ID,title:'Fractions on a Number Line · F1-01 fractions preset',config:C,steps:steps,render:guided,explore:explore,challenge:challenge,
 alt:'F1-01 locked neon number lines have identical whole-number scale. One has denominator d and the other denominator d times a factor. Two connected neon rings align at exactly the same numerical position.',
 staticAlt:'Three quarters and six eighths sit at the same position. Five thirds lies beyond one; negative two thirds is left of zero.',
 exploreIntro:'Move the top marker by drag, arrows or the stepper. Both equivalent rings stay vertically aligned on the same whole-number scale.'};
N.registry.add({id:ID,title:DEF.title,kind:'preset-adapter',family:'F5',topics:['fraction positions','equivalent fractions','number line'],deps:['F1-01','F0-02','F0-04','F0-05']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","state","opt"]},exploreFields:{}});
N.bankMount({id:ID,num:'F5·04',title:DEF.title,def:DEF,years:'KS3 Years 7–9',linked:['F1-01','F5-02','F5-05'],
 spec:{purpose:'Fraction positions as equal units on one locked v3.5 number-line scale. F5-04 maps to F1-01 as its fractions preset, not a separate maths drawing primitive.',
 params:'Signed integer numerator, denominator 2–8, factor ×2 or ×3, exact rational tick snapping, whole-number bounds −1..1 / 0..2 / 0..3.',
 presets:'Halves, thirds, quarters, eighths, improper fractions above one/two, negative fractions.',
 steps:'Whole length → halves → quarters → fixed-point equivalence → improper fractions → negative fractions.',
 interactions:'Watch/Guided timeline; Explore drag-snap ring using NOVA.ui.svgDrag; keyboard/stepper; Challenge 3 guided point placements; event value keys declared.',
 traps:'Confusing denominator with a whole number; changing the endpoint during subdivision; placing an improper fraction inside 0..1; wrong sign/direction.',
 gcse:'Signed rational numbers, ordering and equivalent rational representations. Implementation uses NOVA.numberLine twice, which is the locked shared primitive. F1-01 original source remains unmodified; this F5-04 page is a separately mountable adapter, not a patched F1-01 view.'}});
var log=document.getElementById('log'),appendLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,3800);};N.events.history().forEach(appendLog);N.events.on('*',appendLog);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();
