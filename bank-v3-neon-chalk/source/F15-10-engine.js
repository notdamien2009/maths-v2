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


/* F15-10 Special Triangle Values. Unmodified NOVA family shared core is embedded separately. */
(function(){'use strict';
var H=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion,ID='F15-10',ROOT3=Math.sqrt(3),ROOT2=Math.sqrt(2);
var C=window.NovaV2Integration.configuration(window.NOVA_F15_10_CONFIG={startMode:'watch',preset:'equilateral',events:['value','step','mode','hintUsed','correct','preset','label','scale','reference'],presets:{
 equilateral:{label:'30° · Split an equilateral triangle',family:'3060',angle:30,scale:1},
 angle60:{label:'60° · The other acute angle',family:'3060',angle:60,scale:1},
 square:{label:'45° · Diagonal of a square',family:'4545',angle:45,scale:1},
 scaled30:{label:'Year 9 · Scaled 30° sides',family:'3060',angle:30,scale:1.2},
 scaled45:{label:'Year 9 · Scaled 45° sides',family:'4545',angle:45,scale:1.15},
 gcse30:{label:'GCSE · Exact 30° ratios',family:'3060',angle:30,scale:1},
 gcse60:{label:'GCSE · Exact 60° ratios',family:'3060',angle:60,scale:1}
 }});
var STEPS=[
 {name:'Spot the special shape',pose:'explain',prompt:'What familiar shape could give us this right triangle?'},
 {name:'Build from a square or equilateral triangle',pose:'magnify',prompt:'Look for the parent shape: square or equilateral triangle.'},
 {name:'Make the accurate diagonal or altitude',pose:'ruler',prompt:'Split the parent shape with a precisely placed line.'},
 {name:'Confirm the right angle',pose:'point-down',prompt:'Find the 90-degree angle made by the split.'},
 {name:'Compare side lengths',pose:'compare',prompt:'Which sides are equal, and which side is longest?'},
 {name:'Derive the missing root',pose:'idea',prompt:'Use Pythagoras to find the exact length containing a square root.'},
 {name:'Choose the reference angle',pose:'point-left',prompt:'30°, 60°, or 45° — angle choice determines opposite and adjacent.'},
 {name:'Name opposite, adjacent and hypotenuse',pose:'show-three',prompt:'Opposite faces the chosen angle. Hypotenuse faces the right angle.'},
 {name:'Write sine as an exact fraction',pose:'show-one',prompt:'Opposite divided by hypotenuse. Keep the surd exact.'},
 {name:'Write cosine as an exact fraction',pose:'show-two',prompt:'Adjacent divided by hypotenuse. Do not swap side roles.'},
 {name:'Write tangent as an exact fraction',pose:'count',prompt:'Opposite divided by adjacent, with a rationalised form when appropriate.'},
 {name:'Compare and generalise',pose:'celebrate',prompt:'Side ratios stay the same even if the triangle changes size.'}
];
function fmt(n,p){return Number(n.toFixed(p==null?2:p)).toString();}
function exact(n){var k=Math.round(n*10000)/10000;if(Math.abs(k-1)<1e-8)return '1';if(Math.abs(k-2)<1e-8)return '2';if(Math.abs(k-ROOT2)<.0001)return '√2';if(Math.abs(k-ROOT3)<.0001)return '√3';if(Math.abs(k-2*ROOT3)<.0001)return '2√3';return fmt(n,2);}
function clone(t){return JSON.parse(JSON.stringify(t));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function roles(st){return {base:st.angle===60?'Opposite':'Adjacent',height:st.angle===60?'Adjacent':'Opposite',hyp:'Hypotenuse'};}
function lengths(st){var u=st.family==='3060'?{base:ROOT3,height:1,hyp:2}:{base:1,height:1,hyp:ROOT2};return {base:u.base*st.scale,height:u.height*st.scale,hyp:u.hyp*st.scale};}
function ratio(st){return st.angle===30?{sin:['1','2',.5],cos:['√3','2',ROOT3/2],tan:['√3','3',1/ROOT3]}:st.angle===60?{sin:['√3','2',ROOT3/2],cos:['1','2',.5],tan:['√3','1',ROOT3]}:{sin:['√2','2',ROOT2/2],cos:['√2','2',ROOT2/2],tan:['1','1',1]};}
window.NOVA_F15_10_MATH={lengths:lengths,ratios:ratio,presets:C.presets,roles:roles};
function emit(k,v){NOVA.events.emit('value',{engine:ID,key:k,value:v,control:k});}
function chalk(p,x,y,t,role,sz,anch){return NOVA.chalkText(p,x,y,String(t),{role:role||'unknown',size:sz||18,anchor:anch||'middle'});}
function line(p,a,b,role,w){return NOVA.neonPath(p,'M'+fmt(a[0],2)+' '+fmt(a[1],2)+' L'+fmt(b[0],2)+' '+fmt(b[1],2),{role:role||'op',width:w||3});}
function path(p,d,role,w,fill){return NOVA.neonPath(p,d,{role:role||'op',width:w||4,fill:!!fill});}
function box(p,x,y,w,h,role){return NOVA.neonBox(p,x,y,w,h,{role:role||'op'});}
function button(txt,fn){return H('button',{class:'nova-btn',text:txt,onclick:fn});}
function row(p,a){p.appendChild(H('div',{class:'f1510-row'},a));}
function geom(st,mob){var w=mob?430:820,h=mob?845:590,x=mob?96:141,y=mob?375:383,ks=mob?116:148;if(st.family==='4545')ks=mob?158:196;
 var u=lengths(st),r={x:x,y:y},A={x:x+u.base*ks,y:y},B={x:x,y:y-u.height*ks};
 return {w:w,h:h,r:r,A:A,B:B,mid:{base:{x:(r.x+A.x)/2,y:r.y},height:{x:r.x,y:(r.y+B.y)/2},hyp:{x:(A.x+B.x)/2,y:(A.y+B.y)/2}},u:u,ks:ks};}
function narration(st,i){var fam=st.family==='3060',l=lengths(st),rr=roles(st),ang=st.angle;var lines=[
 fam?'Our right triangle will come from an equilateral triangle, where each whole side has length two.':'Our right triangle comes from drawing a diagonal across a square with sides of length one.',
 fam?'An equilateral triangle has three equal sides and three 60-degree angles.':'A square has four equal sides and four square corners.',
 fam?'The altitude splits the base into two halves of length one each.':'The diagonal splits the square into two equal right-angled triangles.',
 'The corner marker is ninety degrees. That is why Pythagoras applies.',
 fam?'The hypotenuse is two. One shorter side is one. The other must be a square root.':'Both shorter sides have length one, because they came from a square.',
 fam?'The missing side squared is four minus one. That gives three, so the exact length is root three.':'The diagonal squared is one plus one, so its exact length is root two.',
 'Our chosen reference angle is '+ang+' degrees. The side names depend on this angle.',
 'From this angle, '+rr.base.toLowerCase()+' is the horizontal side, '+rr.height.toLowerCase()+' is the vertical side, and the sloping side is the hypotenuse.',
 'Sine is opposite over hypotenuse. For '+ang+' degrees, the exact fraction is '+ratio(st).sin[0]+' over '+ratio(st).sin[1]+'.',
 'Cosine is adjacent over hypotenuse. For '+ang+' degrees, the exact fraction is '+ratio(st).cos[0]+' over '+ratio(st).cos[1]+'.',
 'Tangent is opposite over adjacent. Rationalise a root in the denominator when needed.',
 'Change the size: all three side lengths scale together, but their ratios do not change. That is the link to similar triangles.'
];return lines[i]||lines[0];}
function drawFraction(p,x,y,num,den,role){chalk(p,x,y-3,num,role,23);line(p,[x-40,y+10],[x+40,y+10],role,3);chalk(p,x,y+35,den,role,23);}
function draw(stage,st,opt){
if(window.NovaLessonComponent?.active){[stage,st,opt]=window.NovaLessonComponent.args("draw",arguments);}
opt=opt||{};stage.textContent='';var mob=window.innerWidth<=540,g=geom(st,mob),n=opt.step==null?11:opt.step,interactive=!!opt.interactive,V=g.u,rol=roles(st);if(mob&&!interactive)g.h=n<=7?645:n===8?695:n===9?770:g.h;var sv=S.root(g.w,g.h,'Neon mathematical proof of the '+st.angle+' degree special triangle. Sides and exact values can be explored.');sv.classList.add('f1510-svg');
 var grid=E('g',{style:'opacity:.13;pointer-events:none'},sv);for(var j=0;j<8;j++){line(grid,[39+j*43,85],[39+j*43,mob?385:415],'support',.65);}for(j=0;j<8;j++)line(grid,[42,88+j*44],[mob?385:440,88+j*44],'support',.65);
 chalk(sv,mob?215:250,53,st.family==='3060'?'30° · 60° · 90°':'45° · 45° · 90°','unknown',mob?23:27);
 // Visual derivation, not decorative geometry: mirror across the altitude for the equilateral proof,
 // or complete the square. Only show the source construction during the reveal beats.
 if(n>=1&&n<=3&&!interactive){
  if(st.family==='3060'){
   // The horizontal leg is the altitude: reflect the upper half across it.
   var lower={x:g.B.x,y:2*g.r.y-g.B.y};
   path(sv,'M'+g.A.x+' '+g.A.y+' L'+lower.x+' '+lower.y+' L'+g.B.x+' '+g.B.y+' Z','support',2.5,false);
   line(sv,[g.r.x,g.r.y],[lower.x,lower.y],'support',2.1);
  }else{
   var corner={x:g.A.x,y:g.B.y};
   path(sv,'M'+g.B.x+' '+g.B.y+' L'+corner.x+' '+corner.y+' L'+g.A.x+' '+g.A.y,'support',2.5,false);
  }
 }
 // Glass outline of actual right triangle from canonical NOVA neonPath with fill and halo.
 var triangle='M'+g.r.x+' '+g.r.y+' L'+g.A.x+' '+g.A.y+' L'+g.B.x+' '+g.B.y+' Z';path(sv,triangle,'op',4.6,true);
 line(sv,[g.r.x,g.r.y],[g.A.x,g.A.y],rol.base==='Opposite'?'support':'given',5.5);
 line(sv,[g.r.x,g.r.y],[g.B.x,g.B.y],rol.height==='Opposite'?'support':'given',5.5);
 line(sv,[g.A.x,g.A.y],[g.B.x,g.B.y],'result',5.5);
 path(sv,'M'+(g.r.x+20)+' '+g.r.y+' L'+(g.r.x+20)+' '+(g.r.y-20)+' L'+g.r.x+' '+(g.r.y-20),'focus',3);
 // Angle indication at A or B, maintaining true geometry.
 var ang=st.angle, ref=ang===60?g.B:g.A,ox=ang===60?g.B.x:g.A.x,oy=ang===60?g.B.y:g.A.y;
 if(n>=6||interactive){NOVA.neonRing(sv,ref.x,ref.y,{r:6,role:'focus'});chalk(sv,ang===60?g.B.x+44:g.A.x-52,ang===60?g.B.y+45:g.A.y-23,ang+'°','focus',21);}
 if(n>=3){NOVA.neonRing(sv,g.r.x,g.r.y,{r:5,role:'focus'});chalk(sv,g.r.x-28,g.r.y+27,'90°','focus',17);}
 // Vertex labels & carefully offset length labels, preserving exact radicals.
 if(n>=4||interactive){
  chalk(sv,g.mid.base.x,g.mid.base.y+30,exact(V.base),'given',20);
  chalk(sv,g.mid.height.x-21,g.mid.height.y,exact(V.height),'support',20,'end');
  chalk(sv,g.mid.hyp.x+19,g.mid.hyp.y-12,exact(V.hyp),'result',21,'start');
 }
 if(n>=7||interactive){
  var pl=st.placed||{};
  [['base',rol.base],["height",rol.height],["hyp",'Hypotenuse']].forEach(function(x){var mid=g.mid[x[0]],offset=x[0]==='base'?[0,38]:x[0]==='height'?[-35,-10]:[38,15];if(!interactive||!pl[x[0]])chalk(sv,mid.x+offset[0],mid.y+offset[1],x[1],x[0]==='hyp'?'result':x[1]==='Adjacent'?'given':'support',mob?16:18,x[0]==='height'?'end':'middle');});
 }
 // The proof below diagram is a visible teaching diagram, not a decorative subtitle.
 var py=mob?447:468;
 if(n>=5||interactive){box(sv,mob?18:34,py,mob?393:398,54,'focus');var proof=st.scale!==1?'All sides scale × '+fmt(st.scale,2)+' · ratios stay fixed':st.family==='3060'?'2² = 1² + (√3)²':'(√2)² = 1² + 1²';chalk(sv,mob?215:232,py+34,proof,'focus',mob?21:22);}
 if(!mob&&n<8&&!interactive){
  box(sv,497,152,284,137,'given');
  chalk(sv,638,188,n<3?'Build from a parent shape':n<5?'Locate the 90° corner':'Use exact side lengths','given',20);
  chalk(sv,638,223,n<3?'Equilateral or square':n<5?'Why Pythagoras works':'Do not round √2 or √3','support',17);
  chalk(sv,638,254,'Name the sides from θ','result',17);
 }
 var RR=ratio(st);if(mob){var gy=519;[['sin',8],['cos',9],['tan',10]].forEach(function(x,i){if(n<x[1]&&!interactive)return;var y=gy+i*89;box(sv,20,y,390,76,i===0?'given':i===1?'support':'result');chalk(sv,100,y+42,x[0]+' '+ang+'° =',i===0?'given':i===1?'support':'result',19,'middle');drawFraction(sv,235,y+27,RR[x[0]][0],RR[x[0]][1],i===0?'given':i===1?'support':'result');chalk(sv,337,y+41,'= '+fmt(RR[x[0]][2],3),i===0?'given':i===1?'support':'result',16);});}
 else{var xx=495;[['sin',8],['cos',9],['tan',10]].forEach(function(x,i){if(n<x[1]&&!interactive)return;var y=110+i*114;box(sv,xx,y,290,101,i===0?'given':i===1?'support':'result');chalk(sv,xx+65,y+55,x[0]+' '+ang+'° =',i===0?'given':i===1?'support':'result',20);drawFraction(sv,xx+202,y+34,RR[x[0]][0],RR[x[0]][1],i===0?'given':i===1?'support':'result');});}
 if(interactive){ // NOVA core F2 SVG drag system with sampled constrained vertex destinations and three role cards.
  var b=g.B,a=g.A,base=geom(Object.assign({},st,{scale:1}),mob),sample=[];for(var z=0.7;z<=1.301;z+=.05){var sampleGeo=geom(Object.assign({},st,{scale:+z.toFixed(2)}),mob);sample.push({v:+z.toFixed(2),A:sampleGeo.A,B:sampleGeo.B});}
  [['a',a,'given'],['b',b,'support']].forEach(function(t){var point=t[1],handle=E('g',{role:'slider',tabindex:'0','data-vertex':t[0],'aria-label':'Drag constrained triangle vertex to change size while keeping angles exact'},sv);NOVA.neonRing(handle,point.x,point.y,{r:12,role:t[2]});var targets=sample.map(p=>{var loc=t[0]==='a'?p.A:p.B;return {x:loc.x-11,y:loc.y-11,w:22,h:22,id:String(p.v),kind:'drop'};});NOVA.ui.svgDrag(sv,handle,{box:{x:point.x-13,y:point.y-13,w:26,h:26},zones:function(){return targets;},onDrop:function(id){opt.setScale(+id);return true;}});
    handle.addEventListener('keydown',function(e){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();var n=e.key==='Home'?.7:e.key==='End'?1.3:clamp(st.scale+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-0.05:0.05),.7,1.3);opt.setScale(+n.toFixed(2),'vertex-'+t[0]);});});
  var pairs=[['base',rol.base,'given'],['height',rol.height,'support'],['hyp','Hypotenuse','result']];var trayY=mob?794:520,tx=mob?15:446,bw=mob?127:114;
  pairs.forEach(function(pair,j){var key=pair[0],placed=!!(st.placed&&st.placed[key]),mid=g.mid[key],x=placed?clamp(mid.x-bw/2,9,g.w-bw-7):tx+j*(bw+7),y=placed?clamp(mid.y-31,75,g.h-72):trayY;
  var el=E('g',{tabindex:'0',role:'button','data-label':key,'aria-label':'Drag '+pair[1]+' to correct triangle side, or press Enter to place or remove'},sv);box(el,x,y,bw,36,pair[2]);chalk(el,x+bw/2,y+25,pair[1],pair[2],mob?16:17);
  var zones=pairs.map(function(b){var p=g.mid[b[0]];return {x:p.x-39,y:p.y-35,w:78,h:70,id:b[0],kind:'drop'};});if(placed)zones.push({x:tx-7,y:trayY-8,w:3*bw+38,h:53,id:'remove',kind:'remove'});
  NOVA.ui.svgDrag(sv,el,{box:{x:x,y:y,w:bw,h:36},zones:function(){return zones;},onDrop:function(id){if(id!==key){st.feedback='That is not the '+pair[1].toLowerCase()+' side. Identify it relative to '+ang+' degrees.';opt.update();return false;}st.placed[key]=true;st.feedback=pair[1]+' correctly placed.';emit('label',key);opt.update();return true;},onRemove:function(){st.placed[key]=false;st.feedback=pair[1]+' returned to tray.';opt.update();}});
  el.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;e.preventDefault();st.placed[key]=!st.placed[key];emit('label',key);opt.update(key);});});
 }
 stage.appendChild(sv);NOVA.scene.helperStrip(stage,opt.pose||'explain',opt.say||narration(st,n));if(opt.animate&&!NOVA.reducedMotion()){var neon=sv.querySelector('.nv-neon-tube');if(neon){neon.style.opacity='.28';M.tween(400,function(t){if(neon.isConnected)neon.style.opacity=String(.28+.72*t);},M.ease.out,()=>{if(neon.isConnected)neon.style.opacity='1';});}}return sv;
}
function render(i,stage){draw(stage,clone(C.presets[C.preset]),{step:i,pose:STEPS[i].pose,say:narration(C.presets[C.preset],i),animate:true});}
var DEF={id:ID,title:'Special Triangle Values',config:C,steps:STEPS,render:render,alt:'Interactive neon exact-value right triangles, geometric constructions, and proper stacked trig fractions.',staticAlt:'30-60-90 side ratio 1:root 3:2. 45-45-90 side ratio 1:1:root 2. Sine opposite over hypotenuse, cosine adjacent over hypotenuse, tangent opposite over adjacent.',
 exploreIntro:'Build a special triangle from its parent shape. Drag either constrained vertex to change size without changing the angles; label the three sides and compare exact trigonometric ratios.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[C.presets[C.preset]]):(clone(C.presets[C.preset])));window.NovaLessonComponent?.applyExploreModels();st.placed={};window.NovaLessonComponent?.applyExploreModels();st.feedback='Build and label your triangle; both special angle families keep their exact side ratios.';
 window.NovaLessonComponent?.applyExploreModels();var sel=H('select',{class:'nova-input','aria-label':'Choose special triangle or lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(k=>sel.appendChild(H('option',{value:k,text:C.presets[k].label})));window.NovaLessonComponent?.applyExploreModels();sel.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();var range=H('input',{type:'range',min:'0.7',max:'1.3',step:'.05',value:String(st.scale),'aria-label':'Triangle size multiplier; exact angles remain fixed'});window.NovaLessonComponent?.applyExploreModels();var output=H('div',{class:'f1510-out','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();function update(focus){range.value=String(st.scale);draw(stage,st,{step:11,interactive:true,pose:Object.values(st.placed).filter(Boolean).length===3?'celebrate':'ruler',say:st.feedback,update:update,setScale:setScale});var d=lengths(st),r=ratio(st);output.textContent='θ '+st.angle+'° · sides '+exact(d.height)+' : '+exact(d.base)+' : '+exact(d.hyp)+' · sin '+fmt(r.sin[2],3)+' · cos '+fmt(r.cos[2],3)+' · tan '+fmt(r.tan[2],3)+'. '+st.feedback;
 if(focus){var target=stage.querySelector('[data-label="'+focus+'"], [data-vertex="'+String(focus).replace('vertex-','')+'"]');if(target)target.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();function setScale(n,focus){st.scale=clamp(Math.round(n*20)/20,.7,1.3);st.feedback='Side lengths rescaled by '+fmt(st.scale,2)+'; angles and ratios are unchanged.';emit('scale',st.scale);update(focus);}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=function(){C.preset=sel.value;st=clone(C.presets[C.preset]);st.placed={};st.feedback='Fresh parent construction loaded; check the 90° corner.';emit('preset',C.preset);update();};window.NovaLessonComponent?.applyExploreModels();range.oninput=function(){setScale(+range.value);};
 window.NovaLessonComponent?.applyExploreModels();row(panel,[H('label',{text:'Construction'}),sel]);window.NovaLessonComponent?.applyExploreModels();row(panel,[H('label',{text:'Scale (same angles)'}),range]);window.NovaLessonComponent?.applyExploreModels();row(panel,[button('Smaller',()=>setScale(st.scale-.05)),button('Larger',()=>setScale(st.scale+.05)),button('30° triangle',()=>{sel.value='equilateral';sel.onchange();}),button('60° triangle',()=>{sel.value='angle60';sel.onchange();}),button('45° triangle',()=>{sel.value='square';sel.onchange();}),button('Reset',()=>{sel.value='equilateral';sel.onchange();})]);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(output);window.NovaLessonComponent?.applyExploreModels();update();window.NovaLessonComponent?.applyExploreModels();C._explore={state:()=>st,select:k=>{sel.value=k;sel.onchange();},setScale:setScale,paint:update};
 },
 challenge:function(panel,api,stage){var Q=[
 {family:'3060',angle:30,type:'exact',ratio:'sin',ans:'1/2',q:'Exactly what is sin 30°?',hint:'Opposite has length 1. Hypotenuse has length 2.'},
 {family:'3060',angle:30,type:'exact',ratio:'cos',ans:'√3/2',q:'Exactly what is cos 30°?',hint:'Adjacent has length √3; hypotenuse is 2.'},
 {family:'3060',angle:30,type:'exact',ratio:'tan',ans:'√3/3',q:'Exactly what is tan 30° in rationalised form?',hint:'1/√3 becomes √3/3 after rationalisation.'},
 {family:'3060',angle:60,type:'exact',ratio:'sin',ans:'√3/2',q:'Exactly what is sin 60°?',hint:'Angle changes which leg is opposite.'},
 {family:'3060',angle:60,type:'exact',ratio:'cos',ans:'1/2',q:'Exactly what is cos 60°?',hint:'Adjacent to 60° is the short leg 1.'},
 {family:'3060',angle:60,type:'exact',ratio:'tan',ans:'√3',q:'Exactly what is tan 60°?',hint:'Opposite √3 divided by adjacent 1.'},
 {family:'4545',angle:45,type:'exact',ratio:'sin',ans:'√2/2',q:'Exactly what is sin 45° in rationalised form?',hint:'1/√2 = √2/2.'},
 {family:'4545',angle:45,type:'exact',ratio:'cos',ans:'√2/2',q:'Exactly what is cos 45°?',hint:'Equal legs give equal sine and cosine.'},
 {family:'4545',angle:45,type:'exact',ratio:'tan',ans:'1',q:'Exactly what is tan 45°?',hint:'Opposite and adjacent legs are both 1.'},
 {family:'3060',angle:30,type:'num',ans:12,dp:0,q:'The opposite side of a 30° triangle is 6 cm. Find its hypotenuse in cm.',hint:'The special side ratio is 1 : √3 : 2. Double the short leg.'},
 {family:'4545',angle:45,type:'num',ans:7*ROOT2,dp:2,q:'A 45° right triangle has shorter sides 7 cm. Find its hypotenuse to 2 decimal places.',hint:'The diagonal of a unit square is √2. Multiply 7 by √2.'},
 {family:'3060',angle:60,type:'num',ans:8*ROOT3,dp:2,q:'In a 30°–60° triangle the shortest side is 8 cm. Find the longer leg to 2 decimal places.',hint:'The longer leg is the short leg multiplied by √3.'}
 ];
 var choices=['1/2','√3/2','√3/3','√3','√2/2','1','√2','2'];
 function show(i){var q=Q[i],st={family:q.family,angle:q.angle,scale:1};draw(stage,st,{step:7,pose:'think',say:'Identify the reference angle and the exact side ratio; do not round until instructed.'});}
 function check(q,v){if(q.type==='exact'){if(v===q.ans)return [true,'Correct exact value: '+q.ans+'. Your side order is right.'];if(v==null)return [false,'Select one exact value before checking.'];if(v==='√2/2'&&q.family==='3060')return [false,'√2 comes from the 45° square-diagonal triangle, not the 30°–60° family.'];if(v==='√3/3'&&q.ans==='√3')return [false,'The fraction is upside down. For 60°, opposite is the longer √3 leg.'];return [false,'Check which leg is opposite and which is adjacent to '+q.angle+'°. The hypotenuse stays longest.'];}
 if(!Number.isFinite(v))return [false,'Enter a finite numeric length without units.'];var lim=Math.pow(10,-q.dp)/2+1e-8;if(Math.abs(q.ans-v)<lim)return [true,'Correct: '+q.ans.toFixed(q.dp)+' cm. Exact values were kept until the end.'];if(Math.abs(v-q.ans*q.ans)<.15)return [false,'You squared the side instead of finding its length.'];if(Math.abs(v-q.ans/2)<.15)return [false,'You used half the required length. Revisit the side ratio.'];return [false,'Use the exact special-triangle side ratio first, then round the final answer.'];}
 var tasks=Q.map(function(q){return {q:q.q,build:q.type==='exact'?NOVA.choiceTask(choices,ID):NOVA.entryTask('Answer in cm, no unit',ID),check:v=>check(q,v),hint:q.hint,solve:function(ctl){if(q.type==='exact'){var g=ctl.querySelector('.rs-opts');if(g)g.set(q.ans);}else{var inp=ctl.querySelector('input');if(inp){inp.value=q.ans.toFixed(q.dp);inp.dispatchEvent(new Event('change',{bubbles:true}));}}}};});NOVA.challengeRun(panel,api,tasks,show,C);C._challengeQuestions=Q;C._check=check;
 }};
// Preserve pointer continuity from the approved-style F15 engines. Original NOVA shared core remains byte-identical.
(function(){function active(){var d=NOVA.ui._drag;return d&&d.el&&d.el.closest&&d.el.closest('#'+ID)?d:null;}
 document.addEventListener('pointermove',function(e){if(!e.isTrusted)return;var d=active();if(d)d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons,bubbles:false,cancelable:true}));},true);
 document.addEventListener('pointerup',function(e){var d=active();if(d)d.up(e);},true);
 document.addEventListener('pointercancel',function(e){var d=active();if(d)d.cancel(e);},true);
 window.addEventListener('blur',function(){var d=active();if(d)d.cancel();});})();

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","st","opt"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:ID,num:'F15·10',title:'Special Triangle Values',def:DEF,
 years:'Year 9 lessons 032 and 033; GCSE exact trig values.',linked:['F0-02','F0-03','F12-07','F15-06','F15-07','F15-08','F15-09'],spec:{purpose:'Derive exact special-angle values from a bisected equilateral triangle and a bisected square; connect lengths to sine, cosine and tangent.',params:'30°–60°–90° or 45°–45°–90° family, chosen reference angle, scale multiplier, exact root notation.',presets:'30° equilateral proof; 60° inverse reference; 45° square diagonal; Year 9 scaled cases and GCSE exact ratios.',steps:'12 conceptual states from construction through Pythagoras, side naming, stacked exact fractions, all three trig ratios and similarity.',interactions:'Four modes; playable animated sequence; constrained vertex drag/keyboard, side-label snap/remove, scale controls, 12 Challenge problems.',traps:'Swapping 30° and 60°; wrong opposite/adjacent; approximating roots too early; mixing √2 and √3 triangles; leaving irrational denominators.',gcse:'Exact surd forms and rationalisation of tangent 30°; full precision until final numerical answer.'}});
var lg=document.getElementById('log');if(lg){function f(e){lg.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+lg.textContent.slice(0,4500);}NOVA.events.history().forEach(f);NOVA.events.on('*',f);document.getElementById('clearlog').onclick=function(){lg.textContent='';};}
})();

