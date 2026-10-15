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


/* NOVA Maths F10-19 · Trigonometric Graph Explorer · canonical F0 core / F10 single board */
const F119_CONFIG=Object.freeze({
 id:'F10-19',family:'F10',startMode:'watch',defaultPreset:'GCSE-SINE',
 bounds:{angle:[0,360],y:[-2,2]},
 presets:{
  'GCSE-SINE':{label:'GCSE · Sine wave',type:'sin',A:1,B:1,P:0,D:0,angle:60,context:'Start with sin: the height around a circle.'},
  'GCSE-COSINE':{label:'GCSE · Cosine wave',type:'cos',A:1,B:1,P:0,D:0,angle:60,context:'Cosine starts at a maximum.'},
  'GCSE-TANGENT':{label:'GCSE · Tangent and gaps',type:'tan',A:1,B:1,P:0,D:0,angle:45,context:'Tangent is undefined where cosine is zero.'},
  'GCSE-COMPARE':{label:'GCSE · Compare sin and cos',type:'both',A:1,B:1,P:0,D:0,angle:90,context:'Sine and cosine are related by a quarter-turn.'},
  'GCSE-AMPLITUDE':{label:'GCSE · Change the amplitude',type:'sin',A:1.5,B:1,P:0,D:0,angle:90,context:'Amplitude changes height, not the length of a cycle.'},
  'GCSE-PERIOD':{label:'GCSE · Two cycles',type:'sin',A:1,B:2,P:0,D:0,angle:45,context:'A greater frequency compresses the graph horizontally.'},
  'GCSE-PHASE':{label:'GCSE · Phase and translation',type:'cos',A:1,B:1,P:90,D:.5,angle:90,context:'Move the graph horizontally and vertically; preserve its wave shape.'}
 },events:{value:['preset','angle','amplitude','frequency','phase','shift','reset','point','challengeValue'],types:['mode','step','correct','hintUsed']}
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F119_CONFIG),ID=C.id;
N.premium?.enable?.();
const S={preset:C.defaultPreset,type:'sin',A:1,B:1,P:0,D:0,angle:60,correct:false,mode:'watch'};
const rad=d=>d*Math.PI/180,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),fmt=v=>{let n=Math.round(v*1000)/1000;return String(Object.is(n,-0)?0:n).replaceAll('-','−')},nearest=(v,a)=>Math.round(v/a)*a;
const emit=(key,value)=>N.events.emit('value',{engine:ID,key,value});
function setPreset(id=C.defaultPreset,notify=true){let p=C.presets[id]||C.presets[C.defaultPreset];S.preset=C.presets[id]?id:C.defaultPreset;for(let k of ['type','A','B','P','D','angle'])S[k]=p[k];S.correct=false;if(notify)emit('preset',S.preset)}
setPreset(C.defaultPreset,false);
const trig=(kind,theta)=>kind==='cos'?Math.cos(rad(theta)):kind==='tan'?Math.tan(rad(theta)):Math.sin(rad(theta));
function valueAt(angle,kind=S.type){let t=S.B*(angle-S.P);if(kind==='tan'&&Math.abs(Math.cos(rad(t)))<1e-8)return null;let v=S.A*trig(kind,t)+S.D;return Math.abs(v)>3000?null:v}
function curveTypes(){return S.type==='both'?['sin','cos']:[S.type]}
const period=kind=>((kind==='tan'?180:360)/S.B);
const typeName=kind=>kind==='cos'?'COSINE':kind==='tan'?'TANGENT':kind==='both'?'SINE + COSINE':'SINE';
const GEO={w:820,h:710,left:103,top:76,plotW:630,plotH:494,ymin:-2,ymax:2};
const XY=(a,v)=>[GEO.left+a*GEO.plotW/360,GEO.top+(GEO.ymax-v)*GEO.plotH/(GEO.ymax-GEO.ymin)];
const chalk=(svg,x,y,txt,role='support',size=33,anchor='start')=>N.chalkText(svg,x,y,String(txt),{size,role,anchor});
const path=(svg,d,role,width=4,dash)=>N.neonPath(svg,d,{role,width,dash});
const ROLE={sin:'focus',cos:'op',tan:'unknown'};
function graphSVG({phase=9,interactive=false,challenge=false,correct=false}={}){
 const svg=N.svg.root(GEO.w,GEO.h,'Trigonometric coordinate graph, angle in degrees along the horizontal axis and output on the vertical axis. Continuous sine and cosine curves, separate tangent branches with asymptote gaps.');
 svg.classList.add('nv-svg','f119-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('viewBox','20 1 785 700');svg.dataset.testid='f119-graph';
 const frame={x0:GEO.left,y0:GEO.top,w:GEO.plotW,h:GEO.plotH,x:[0,360],y:[-2,2],xStep:45,yStep:.5};
 let gr=N.neonPlot(svg,frame);gr?.g?.classList.add('f119-grid');gr?.g?.querySelectorAll('text').forEach(t=>t.remove());
 // The shared F0 axes primitive owns the plotted coordinate geometry.
 const axes=N.svg.axes(svg,{x:GEO.left,y:GEO.top,w:GEO.plotW,h:GEO.plotH,xmin:0,xmax:360,ymin:-2,ymax:2,ticks:45});axes?.g?.classList.add('f119-core-axes');axes?.g?.querySelectorAll('text').forEach(t=>t.remove());
 for(let x=0;x<=360;x+=45){let [px]=XY(x,0);chalk(svg,px,GEO.top+GEO.plotH+42,x+'°','support',32,'middle')}
 for(let y=-2;y<=2;y+=.5){let [,py]=XY(0,y);chalk(svg,GEO.left-19,py+9,fmt(y),'support',32,'end')}
 chalk(svg,GEO.left,GEO.top-33,'OUTPUT · y','op',38);
 chalk(svg,GEO.left+GEO.plotW/2,GEO.top+GEO.plotH+92,'ANGLE · degrees','op',38,'middle');
 const defs=E('defs',{},svg),clip=E('clipPath',{id:'f119-clip'},defs);E('rect',{x:GEO.left,y:GEO.top,width:GEO.plotW,height:GEO.plotH},clip);
 const ink=E('g',{'clip-path':'url(#f119-clip)'},svg);
 const visible=phase<=0?[]:phase===1?['sin']:curveTypes();
 // Show dashed asymptotes, but never join tangent branches across them.
 if(visible.includes('tan')&&phase>=2){for(let degree=0;degree<=360;degree+=.5){let t=S.B*(degree-S.P);if(Math.abs(Math.cos(rad(t)))<.005){let px=XY(degree,0)[0];path(ink,`M${px},${GEO.top}L${px},${GEO.top+GEO.plotH}`,'unknown',2,'8 8')}}}
 for(let kind of visible){let d='',last=null,segments=[];for(let x=0;x<=360.0001;x+=.5){let y=valueAt(x,kind),inside=y!==null&&y>=GEO.ymin&&y<=GEO.ymax;
  if(kind==='tan'&&Math.abs(Math.cos(rad(S.B*(x-S.P))))<.025)inside=false;
  if(!inside){if(d){segments.push(d);d=''}last=null;continue}
  let p=XY(x,y),q=`${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  if(last&&Math.abs(y-last.y)>1.15){if(d)segments.push(d);d='M'+q;} else d+=(d?'L':'M')+q;
  last={x,y};}
  if(d)segments.push(d);
  for(let seg of segments){let line=path(ink,seg,ROLE[kind],5.5);line.classList.add('f119-curve');line.dataset.curve=kind;
   if(phase===2&&!N.reducedMotion())try{N.motion.trail(ink,seg,ROLE[kind],400)}catch(_){}}
 }
 const first=curveTypes()[0],current=valueAt(S.angle,first),markY=current===null?0:current,
       [px,py]=XY(S.angle,markY);
 if(phase>=3||interactive||challenge){
   path(ink,`M${px},${GEO.top}L${px},${GEO.top+GEO.plotH}`,'support',2,'8 7');
   for(let kind of visible){let v=valueAt(S.angle,kind);if(v!==null&&v>=-2&&v<=2){let [mx,my]=XY(S.angle,v);N.neonRing(ink,mx,my,{r:10,role:ROLE[kind],pulse:correct});}}
 }
 if(interactive){const hit=E('g',{class:'f119-angle-handle',tabindex:'0',role:'slider','aria-label':'Graph angle in degrees','aria-valuemin':'0','aria-valuemax':'360','aria-valuenow':String(S.angle),'data-testid':'f119-angle-handle'},svg);
  N.neonRing(hit,px,py,{r:16,role:'result'});E('circle',{cx:px,cy:py,r:25,fill:'transparent','data-drag':'1'},hit);
  hit.addEventListener('keydown',ev=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(ev.key))return;ev.preventDefault();let dx=ev.key==='Home'?-1000:ev.key==='End'?1000:['ArrowRight','ArrowUp'].includes(ev.key)?5:-5;S.angle=clamp(nearest(S.angle+dx,5),0,360);emit('angle',{value:S.angle,source:'keyboard'});refreshExplore?.()});
  if(N.ui.svgDrag){const box={x:px-22,y:py-22,w:44,h:44};N.ui.svgDrag(svg,hit,{box,zones:()=>[{id:'graph',kind:'drop',x:GEO.left-20,y:GEO.top-25,w:GEO.plotW+40,h:GEO.plotH+40},{id:'remove',kind:'remove',x:GEO.left+70,y:GEO.top+GEO.plotH+48,w:GEO.plotW-140,h:50}],onDrop:()=>{let mx=hit.getAttribute('transform')||'';let curX=px;let match=mx.match(/translate\(\s*([-\d.]+)/);if(match)curX+=Number(match[1]);S.angle=clamp(nearest((curX-GEO.left)*360/GEO.plotW,5),0,360);emit('angle',{value:S.angle,source:'drag'});refreshExplore?.();return true},onRemove:()=>{setPreset(S.preset);refreshExplore?.()},removeTo:{x:GEO.left+GEO.plotW/2,y:GEO.top+GEO.plotH+80}})}
 }
 return svg;
}
function unitCircle(){const svg=N.svg.root(250,240,'Unit circle: the horizontal coordinate is cosine and the vertical coordinate is sine; radius rotates with the selected angle.');svg.classList.add('f119-circle');svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('viewBox','0 0 250 240');const cx=124,cy=117,r=77,theta=rad(S.B*(S.angle-S.P));
 path(svg,`M${cx-r-23},${cy}L${cx+r+23},${cy}`,'support',2);
 path(svg,`M${cx},${cy-r-25}L${cx},${cy+r+22}`,'support',2);
 path(svg,`M${cx+r},${cy}A${r},${r} 0 1 1 ${cx-r},${cy}A${r},${r} 0 1 1 ${cx+r},${cy}`,'support',5);
 const tx=cx+Math.cos(theta)*r,ty=cy-Math.sin(theta)*r;
 path(svg,`M${cx},${cy}L${tx},${ty}`,'focus',5);
 path(svg,`M${tx},${ty}L${tx},${cy}`,'op',3,'5 5');path(svg,`M${tx},${cy}L${cx},${cy}`,'result',3,'5 5');
 N.neonRing(svg,tx,ty,{r:9,role:'result'});
 chalk(svg,229,cy+18,'x','support',20,'middle');chalk(svg,cx-13,18,'y','support',20,'middle');
 chalk(svg,cx,236,'unit radius = 1','support',21,'middle');return svg}
function ruleString(){let typ=S.type==='both'?'sin x and cos x':S.type,coeff=S.A===1?'':fmt(S.A)+' ',angle=(S.B===1?'':fmt(S.B))+'x'+(S.P?' − '+fmt(S.B*S.P)+'°':''),shift=S.D?(S.D>0?' + '+fmt(S.D):' − '+fmt(-S.D)):'';return S.type==='both'?'y = sin x and y = cos x':'y = '+coeff+typ+'('+angle+')'+shift}
function stat(header,val,note,role){return H('div',{class:'f119-stat',...(role?{'data-role':role}:{})},[H('div',{class:'f119-stat-label',text:header}),H('div',{class:'f119-stat-val',text:val}),H('div',{class:'f119-stat-note',text:note})])}
function scene(stage,opt={}){
if(window.NovaLessonComponent?.active){[stage,opt]=window.NovaLessonComponent.args("scene",arguments);}
const q={phase:9,editable:false,challenge:false,correct:false,pose:'explain',caption:'The unit circle and graph follow the same angle.',...opt};stage.replaceChildren();
 const theatre=H('section',{class:'f119-theatre','data-testid':'f119-theatre'});
 theatre.append(H('div',{class:'f119-topline'},[H('span',{text:'F10 · TRIGONOMETRIC GRAPH STUDIO'}),H('span',{class:'f119-brand',text:'NOVA · NEON CHALK'})]));
 const layout=H('div',{class:'f119-layout'}),plane=H('div',{class:'f119-plane'});
 plane.append(graphSVG({phase:q.phase,interactive:q.editable,challenge:q.challenge,correct:q.correct}));
 let title=q.phase===0?'One angle. Three related graphs.':q.phase===1?'The sine wave rises and falls':q.phase===2?'Trace the full wave':q.phase<5?'The circle gives the graph value':q.phase<9?'Compare the curves and their periods':'Explore how the graph changes';
 if(q.editable)title='Turn the angle · follow the moving point';if(q.challenge)title='Read the graph and decide what is true';
 plane.append(H('h3',{class:'f119-chalk-title',text:title}));
 const st=q.phase===0?'The graph starts with an angle measured in degrees.':q.phase<3?'Angles are measured on the horizontal axis; output is on the vertical.':q.challenge?'Check the scale, turning points and gaps before answering.':'Follow the rotating radius and the matching point on the curve.';
 plane.append(H('p',{class:'f119-chalk-sub',text:st}));layout.append(plane);
 const info=H('aside',{class:'f119-info','aria-label':'Trigonometric graph mathematical evidence'}),show=q.phase>=2||q.editable||q.challenge,hidden=q.challenge&&!q.correct;
 const circle=H('div',{class:'f119-unit'});circle.append(H('div',{class:'f119-unit-label',text:'UNIT CIRCLE · SAME ANGLE'}),unitCircle());info.append(circle);
 if(show){const ty=S.type==='both'?'sin / cos':S.type;
  info.append(stat('GRAPH RULE',hidden?'Identify the curve':ruleString(),S.type==='tan'?'Tangent has missing values at odd quarter-turns.':'The graph repeats in a regular cycle.'));
  const k=S.type==='both'?'sin':S.type,periodV=period(k),read=valueAt(S.angle,k);
  if(q.phase>=4||q.editable||q.challenge)info.append(stat('PERIOD',hidden?'How long is one repeat?':fmt(periodV)+'°',k==='tan'?'Tangent repeats every half-turn at B = 1.':'Sine and cosine repeat every full turn at B = 1.'));
  if(q.phase>=5||q.editable||q.challenge)info.append(stat('ANGLE · '+fmt(S.angle)+'°',hidden?'Read from the curve':read===null?'undefined':fmt(read),read===null?'This output does not exist at an asymptote.':'Read the curve at the selected angle.','result'));
 }
 layout.append(info);theatre.append(layout);stage.append(theatre);N.scene.helperStrip(stage,q.correct?'cheer':q.pose,q.caption);return stage}
const STORY=[
 ['Meet the angle','explain','Graphs of sine, cosine and tangent use angle on the horizontal axis. The output is read vertically.','GCSE-SINE',0,0,'Which axis measures degrees?'],
 ['First sine rise','point','Sine starts at zero and rises to one at a quarter-turn. Watch the glowing curve grow.','GCSE-SINE',1,90,'What is sine of ninety degrees?'],
 ['Trace one wave','count','Sine rises, falls to zero, becomes negative, then returns to zero after a full turn.','GCSE-SINE',2,180,'Where does one complete cycle end?'],
 ['Link the circle','magnify','As the unit radius turns, its vertical coordinate gives sine. The graph uses exactly that height.','GCSE-SINE',3,60,'Is sine read from the vertical or horizontal coordinate?'],
 ['Quarter turn','point','At ninety degrees the vertical coordinate is one, the maximum sine value.','GCSE-SINE',4,90,'What is the highest value of sine?'],
 ['Half turn','count','At one hundred and eighty degrees, the point returns to the horizontal axis. Sine is zero.','GCSE-SINE',5,180,'What is the sine value at half a turn?'],
 ['Three-quarter turn','magnify','At two hundred and seventy degrees the sine point is at minus one.','GCSE-SINE',6,270,'Does sine become negative?'],
 ['Read the cosine','point','Cosine starts at one. Its unit-circle coordinate is the horizontal position.','GCSE-COSINE',7,0,'Where does cosine start?'],
 ['Compare the waves','count','Sine and cosine have the same wave shape, but their peaks occur at different angles.','GCSE-COMPARE',8,90,'Are the sine and cosine peaks at the same angle?'],
 ['Meet tangent','point','Tangent is sine divided by cosine. It is undefined where cosine is zero.','GCSE-TANGENT',9,45,'What causes a tangent gap?'],
 ['Spot an asymptote','magnify','At ninety degrees tangent has no value. A dashed vertical guide shows the asymptote.','GCSE-TANGENT',10,90,'Should we join the tangent branches across this gap?'],
 ['Repeat tangent','count','Tangent repeats every one hundred and eighty degrees, a half-turn.','GCSE-TANGENT',11,135,'What is the tangent period?'],
 ['Change amplitude','point','Amplitude stretches the height of sine, but the cycle still occupies a full turn.','GCSE-AMPLITUDE',12,90,'Does changing amplitude change the period?'],
 ['Change period','magnify','When the angle is doubled inside sine, two cycles fit into one full turn.','GCSE-PERIOD',13,45,'How many complete cycles are shown?'],
 ['Shift the graph','point','A phase shift moves a wave horizontally. A vertical translation raises or lowers the midline.','GCSE-PHASE',14,90,'Which parameter moves the midline?'],
 ['Your own experiment','cheer','Now use Explore. Turn the circle and change the amplitude, frequency, phase or vertical shift.','GCSE-SINE',15,60,'How can you check a graph prediction?']
];
const STEPS=STORY.map(([name,mood,narration,,,prompt])=>({name,mood,narration,prompt}));
function render(i,stage){let row=STORY[i];setPreset(row[3],false);S.angle=row[5];scene(stage,{phase:row[4],pose:row[1],caption:row[2]})}
let refreshExplore=null;
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();S.mode='explore';window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f119-controls');
 window.NovaLessonComponent?.applyExploreModels();function redraw(){panel.replaceChildren();let pre=H('select',{class:'nova-input',id:'f119-select','data-testid':'f119-preset','aria-label':'Choose graph preset'});
 for(let [id,p] of Object.entries(C.presets))pre.append(H('option',{value:id,text:p.label}));pre.value=S.preset;pre.onchange=()=>{setPreset(pre.value);redraw()};
 panel.append(H('label',{class:'f119-wide f119-control-label'},[H('strong',{text:'CHOOSE A TRIGONOMETRIC GRAPH'}),pre]));
 function slider(name,k,min,max,step,suffix=''){const val=H('strong',{text:fmt(S[k])+suffix}),r=H('input',{type:'range',min:String(min),max:String(max),step:String(step),value:String(S[k]),'aria-label':name,'data-testid':'f119-'+k});r.oninput=()=>{S[k]=Number(r.value);emit(k,{value:S[k],source:'slider'});redraw()};return H('label',{class:'f119-control-label'},[H('span',{class:'f119-control-head'},[H('span',{text:name}),val]),r])}
 panel.append(slider('ANGLE', 'angle',0,360,5,'°'),slider('AMPLITUDE','A',.5,1.5,.25),slider('FREQUENCY','B',.5,2,.5),slider('PHASE','P',0,180,15,'°'),slider('VERTICAL SHIFT','D',-1,1,.25));
 const row=H('div',{class:'f119-actions f119-wide'});
 row.append(H('button',{type:'button',class:'nova-btn','data-testid':'f119-prev',text:'−5°',onclick:()=>{S.angle=clamp(S.angle-5,0,360);emit('angle',{value:S.angle,source:'button'});redraw()}}));
 row.append(H('button',{type:'button',class:'nova-btn','data-testid':'f119-next',text:'+5°',onclick:()=>{S.angle=clamp(S.angle+5,0,360);emit('angle',{value:S.angle,source:'button'});redraw()}}));
 row.append(H('button',{type:'button',class:'nova-btn','data-testid':'f119-reset',text:'↶ Restore preset',onclick:()=>{setPreset(S.preset);redraw()}}));panel.append(row);
 panel.append(H('p',{class:'f119-help f119-wide',text:'Drag or keyboard-focus the graph marker to change the angle. The unit circle moves with the graph. At a tangent asymptote, the output is undefined.'}));
 const k=S.type==='both'?'sin':S.type,v=valueAt(S.angle,k);
 scene(stage,{phase:15,editable:true,pose:'point',caption:v===null?'At this angle tangent is undefined. Do not join the two sides.':'At '+fmt(S.angle)+' degrees the '+k+' value is '+fmt(v)+'. Watch the point and unit circle move together.'})}
 window.NovaLessonComponent?.applyExploreModels();refreshExplore=redraw;window.NovaLessonComponent?.applyExploreModels();redraw()}
const TASKS=[
 {pre:'GCSE-SINE',ang:0,answer:'0',q:'Read sin 0°. What is the output?',hint:'The sine graph starts on the horizontal axis.',wrong:'Sine starts at zero, not one.'},
 {pre:'GCSE-SINE',ang:90,answer:'1',q:'What is sin 90°?',hint:'Read the first peak at a quarter-turn.',wrong:'Sine reaches positive one at ninety degrees.'},
 {pre:'GCSE-SINE',ang:270,answer:'-1',q:'What is sin 270°?',hint:'This is the trough below the x axis.',wrong:'The third-quarter-turn sine value is negative one.'},
 {pre:'GCSE-COSINE',ang:0,answer:'1',q:'What is cos 0°?',hint:'Cosine starts at the top of the graph.',wrong:'Cosine starts at positive one; sine starts at zero.'},
 {pre:'GCSE-COSINE',ang:180,answer:'-1',q:'What is cos 180°?',hint:'Read the cosine trough at half a turn.',wrong:'Cosine at half a turn is minus one.'},
 {pre:'GCSE-TANGENT',ang:45,answer:'1',q:'What is tan 45°?',hint:'Sine and cosine have the same value at forty-five degrees.',wrong:'Tangent at forty-five degrees is positive one.'},
 {pre:'GCSE-TANGENT',ang:90,answer:'undefined',q:'What is tan 90°? Type “undefined”.',hint:'Cosine is zero here; division by zero is undefined.',wrong:'Tangent has a vertical asymptote and no value at ninety degrees.'},
 {pre:'GCSE-TANGENT',ang:180,answer:'0',q:'What is tan 180°?',hint:'The tangent branch crosses the horizontal axis here.',wrong:'Tangent is zero at a half-turn.'},
 {pre:'GCSE-SINE',ang:360,answer:'360',q:'What is the period of y = sin x in degrees?',hint:'One entire wave repeats after a complete turn.',wrong:'Sine repeats after three hundred and sixty degrees.'},
 {pre:'GCSE-TANGENT',ang:180,answer:'180',q:'What is the period of y = tan x in degrees?',hint:'Tangent repeats after a half-turn.',wrong:'Tangent repeats every one hundred and eighty degrees.'},
 {pre:'GCSE-PERIOD',ang:90,answer:'180',q:'For y = sin(2x), what is the period in degrees?',hint:'Two waves fit into one full turn. Divide three hundred and sixty by two.',wrong:'Doubling the angle halves the period to one hundred and eighty degrees.'},
 {pre:'GCSE-AMPLITUDE',ang:90,answer:'1.5',q:'For y = 1.5 sin x, what is the amplitude?',hint:'Amplitude is the distance from the midline to a peak.',wrong:'Amplitude is one and a half; it is not the peak-to-trough distance.'},
 {pre:'GCSE-PHASE',ang:90,answer:'0.5',q:'For the shifted cosine preset, what is its vertical shift?',hint:'Read the horizontal midline, not the maximum.',wrong:'The graph’s midline is raised by one half.'}
];
function challenge(panel,api,stage){S.mode='challenge';let ts=TASKS.map((t,i)=>({q:t.q,build:ctl=>{setPreset(t.pre,false);S.angle=t.ang;const f=H('input',{type:'text',class:'nova-input','data-testid':'f119-answer',placeholder:'Number or undefined','aria-label':'Graph answer'});ctl.append(H('label',{class:'f119-task'},[H('span',{text:'YOUR ANSWER'}),f]));f.oninput=()=>emit('challengeValue',{task:i,value:f.value});return()=>f.value},check:v=>{let raw=String(v??'').toLowerCase().trim().replace('−','-'),target=t.answer,ok=target==='undefined'?['undefined','not defined','does not exist'].includes(raw):(raw!==''&&Math.abs(Number(raw)-Number(target))<.005);
  if(ok){S.correct=true;N.events.emit('correct',{engine:ID,key:'challenge',value:{task:i,answer:v}});scene(stage,{phase:15,challenge:true,correct:true,pose:'cheer',caption:'Correct. The unit-circle relationship and graph agree.'})}
  return[ok,ok?'Correct. '+t.q+' Answer: '+target+'.':raw===''?'Enter your answer first.':t.wrong]},hint:t.hint,solve:()=>{S.correct=true;scene(stage,{phase:15,challenge:true,correct:true,pose:'explain',caption:'The correct answer is '+t.answer+'. Follow the axes and angle.'})}}));
 N.challengeRun(panel,api,ts,i=>{const t=TASKS[i];setPreset(t.pre,false);S.angle=t.ang;S.correct=false;scene(stage,{phase:15,challenge:true,pose:'think',caption:'Check the graph at the stated angle. Remember sine and cosine differ, and tangent can be undefined.'})},C)}
const def={id:ID,title:'Trigonometric Graph Explorer (sin, cos, tan)',config:C,steps:STEPS,render,explore,challenge,
 alt:'NOVA trigonometric graphs on neon coordinate axes. A glowing sine, cosine or tangent curve is linked to a rotating unit-circle radius, with open discontinuities at tangent asymptotes.',
 staticAlt:'At zero degrees sine = 0 and cosine = 1. At ninety degrees sine = 1 and cosine = 0, so tangent is undefined. Sine and cosine period 360°; tangent period 180°. Sine and cosine range from minus one to one.',
 exploreIntro:'Select sine, cosine, tangent or a transformation preset. Turn the unit-circle angle and change amplitude, frequency, phase or shift. The graph and point update together.',onRestore:()=>setPreset(C.defaultPreset)};
N.registry.add({id:ID,title:'Trigonometric Graph Explorer',family:'F10',topics:['sine graph','cosine graph','tangent graph','unit circle','amplitude','period','phase shift','asymptote'],deps:['F0-02','F0-14','F10-18']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"STORY":()=>STORY,"TASKS":()=>TASKS},draws:{"scene":["stage","opt"]},exploreFields:{}});
N.bankMount({id:ID,num:'19',title:'Trigonometric Graph Explorer · Premium Edition',def,linked:['F0-14','F10-18'],years:'GCSE EXTENSION · sin, cos, tan',spec:{purpose:'Link the unit circle to sine, cosine and tangent graphs; explain values, periods, shifts and tangent asymptotes.',params:'Angle (0–360°), graph type, amplitude A, frequency B, phase P and vertical shift D.',presets:'Seven GCSE graph configurations: sine, cosine, tangent, comparison, amplitude, period and phase.',steps:'16 narrated teaching stages plus Explore and 13 marked Challenge questions.',interactions:'Four modes; rotating unit circle, graph angle handle, keyboard adjustment, slider edits, step narration, reset, assessments.',traps:'Sine and cosine start at different heights; tangent is undefined at quarter-turns and curves must not cross its asymptotes; period is not amplitude.',gcse:'This entire component is a clearly labelled GCSE extension; it has no KS3 lesson mapping in the F10 master.'}});
window.addEventListener('load',()=>document.querySelectorAll('#F10-19 img').forEach(img=>{if(!img.alt)img.alt='NOVA maths tutor mascot'}),{once:true});
})();

