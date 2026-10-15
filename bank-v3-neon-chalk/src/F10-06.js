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


/* NOVA F10-06 Gradient Visual — signed rise/run, dedicated premium geometry studio. */
const F106_CONFIG={id:'F10-06',family:'F10',defaultPreset:'Y8-022',startMode:'watch',
 presets:{
  'Y8-022':{label:'Y8-022 · Straight-line gradient',kind:'cartesian',A:[-3,-2],B:[1,4],context:'Vertical change per horizontal change',unit:'gradient',xLabel:'x',yLabel:'y'},
  'Y8-023':{label:'Y8-023 · Gradient and intercept',kind:'cartesian',A:[-2,3],B:[2,-1],context:'Falling line; signed rise',unit:'gradient',xLabel:'x',yLabel:'y'},
  'Y8-025':{label:'Y8-025 · Parallel gradients',kind:'cartesian',A:[-3,-4],B:[1,4],context:'Parallel lines share a gradient',unit:'gradient',parallel:true,xLabel:'x',yLabel:'y'},
  'Y8-026':{label:'Y8-026 · Distance–time speed',kind:'distance',A:[1,2],B:[5,10],context:'Distance (km) against time (h)',unit:'km/h',xLabel:'time (h)',yLabel:'distance (km)'},
  'Y8-027':{label:'Y8-027 · Velocity–time acceleration',kind:'velocity',A:[1,4],B:[5,-4],context:'Velocity (m/s) against time (s)',unit:'m/s²',xLabel:'time (s)',yLabel:'velocity (m/s)'},
  'Y8-028':{label:'Y8-028 · Gradient as a real-world rate',kind:'flow',A:[1,5],B:[5,13],context:'Volume (L) against time (min)',unit:'L/min',xLabel:'time (min)',yLabel:'volume (L)'},
  'Y9-017':{label:'Y9-017 · Velocity change and direction',kind:'velocity',A:[1,-3],B:[5,3],context:'Signed velocity and acceleration',unit:'m/s²',xLabel:'time (s)',yLabel:'velocity (m/s)',gcse:false}
 },
 events:{value:['preset','pointA','pointB','gradient','reset','answer'],types:['mode','step','correct','hintUsed']},
 challenge:{tasks:['read-gradient','drag-for-gradient','read-acceleration','read-speed']}};
window.F106_CONFIG=F106_CONFIG;
(function(){'use strict';
 const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F106_CONFIG),ID=C.id;
 if(N.premium?.enable)N.premium.enable();
 const BOX={w:640,h:548,left:86,top:61,width:464,height:420};
 const STORIES=[
  ['The coordinate studio','explain','Begin with a horizontal x-axis and a vertical y-axis. The scale matters.','What is measured along each axis?'],
  ['Two precise points','point','A and B sit on the same straight line. Read their positions carefully.','Which point is further to the right?'],
  ['First: measure the run','count','Travel horizontally from A to the level directly below or above B.','How many units right is the run?'],
  ['Now: measure the rise','point','Move vertically from the end of that run to B. It can rise or fall.','If the line falls, is the rise positive?'],
  ['Give changes their signs','magnify','Subtract the earlier coordinates from the later ones: Δy and Δx.','Why does a falling line have negative Δy?'],
  ['Build the gradient fraction','explain','Gradient is change in y over change in x, not the other way round.','Which change goes on top of the fraction?'],
  ['Compare and predict','think','Lines with the same gradient are parallel. A flat line has gradient zero.','Would shifting a line change its gradient?'],
  ['Interpret the units','point','In context, gradient means a rate: distance-time gives speed; velocity-time gives acceleration.','Does negative acceleration always mean negative velocity?'],
  ['Generalise and transfer','cheer','Rise divided by run measures signed rate of change. Keep the axis units.','Can you justify a gradient using two new points?']
 ];
 const STEPS=STORIES.map((a,i)=>({name:a[0],narration:a[2],prompt:a[3],mood:a[1],view:i}));
 const TASKS=[
  {preset:'Y8-022',type:'number',q:'A is (−3, −2) and B is (1, 4). What is the gradient?',answer:1.5,hint:'Calculate change in y: 4 − (−2). Then change in x: 1 − (−3). Divide rise by run.',explain:'Rise = 6, run = 4. Gradient = 6 over 4 = 1.5.'},
  {preset:'Y8-023',type:'drag',q:'Move point B vertically until the gradient is −1. A is (−2, 3); keep B at x = 2.',target:[2,-1],hint:'The run is four. A gradient of −1 needs a rise of −4, so move B below A.',explain:'Run = 4 and rise = −4, so the gradient is −1.'},
  {preset:'Y8-027',type:'number',q:'On a velocity–time graph, velocity goes from 4 m/s at 1 s to −4 m/s at 5 s. What is the acceleration in m/s²?',answer:-2,hint:'Acceleration is change in velocity divided by elapsed time; (−4 − 4) over (5 − 1).',explain:'Change in velocity = −8 m/s in 4 s, so acceleration = −2 m/s².'},
  {preset:'Y8-026',type:'number',q:'Distance increases from 2 km at 1 h to 10 km at 5 h. What is the speed in km/h?',answer:2,hint:'Speed is change in distance divided by change in time, not total distance divided by total clock time.',explain:'The distance changed by 8 km over 4 h, so speed = 2 km/h.'}
 ];
 const S={preset:C.defaultPreset,A:null,B:null,task:0,wrong:0,solved:false,entry:''};
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const fmt=v=>!Number.isFinite(v)?'undefined':String(Math.round(Math.abs(v)*1000)/1000).replace(/^/,(v<0?'−':''));
 const round=(v,st=.5)=>Math.round(v/st)*st;
 const key=(point)=>point.map(fmt).join(', ');
 const emit=(k,v)=>{if(!C.events.value.includes(k))throw Error('Undeclared F10-06 event '+k);N.events.emit('value',{engine:ID,key:k,value:v});};
 const preset=()=>C.presets[S.preset];
 function reset(k=C.defaultPreset){S.preset=k;S.A=[...C.presets[k].A];S.B=[...C.presets[k].B];S.entry='';S.solved=false;emit('preset',k);}
 reset();
 function domain(p){return p.kind==='cartesian'?{xmin:-5,xmax:5,ymin:-8,ymax:8,stepX:1,stepY:2}:p.kind==='velocity'?{xmin:0,xmax:8,ymin:-8,ymax:8,stepX:1,stepY:2}:{xmin:0,xmax:8,ymin:0,ymax:16,stepX:1,stepY:2};}
 const pixel=(x,y,d)=>[BOX.left+(x-d.xmin)/(d.xmax-d.xmin)*BOX.width,BOX.top+(d.ymax-y)/(d.ymax-d.ymin)*BOX.height];
 const mobile=()=>window.matchMedia('(max-width:760px)').matches;
 function txt(svg,x,y,t,sz=27,role='given',opts={}){return N.chalkText(svg,x,y,String(t),{size:mobile()?Math.max(30,sz):sz,role,...opts})}
 const neon=(svg,x1,y1,x2,y2,role='op',width=3,opt={})=>N.neonLine(svg,x1,y1,x2,y2,{role,width,...opt});
 function gr(){const dx=S.B[0]-S.A[0],dy=S.B[1]-S.A[1];return {dx,dy,m:Math.abs(dx)<1e-8?NaN:dy/dx}}
 function graph(svg,d,p){
  const g=N.neonPlot(svg,{x0:BOX.left,y0:BOX.top,w:BOX.width,h:BOX.height,x:[d.xmin,d.xmax],y:[d.ymin,d.ymax],xStep:d.stepX,yStep:d.stepY});g.g.classList.add('f106-grid');g.g.querySelectorAll('text').forEach(t=>t.remove());
  const axes=N.svg.axes(svg,{x:BOX.left,y:BOX.top,w:BOX.width,h:BOX.height,xmin:d.xmin,xmax:d.xmax,ymin:d.ymin,ymax:d.ymax,ticks:1});axes.g.classList.add('f106-grid');axes.g.querySelectorAll('text').forEach(t=>t.remove());
  const [zx,zy]=pixel(0,0,d);
  const skip=mobile()?2:1;
  for(let x=d.xmin;x<=d.xmax+1e-6;x+=d.stepX){if(Math.abs(x)<1.5||Math.round((x-d.xmin)/d.stepX)%skip!==0)continue;txt(svg,pixel(x,0,d)[0],zy+30,fmt(x),26,'support',{anchor:'middle'});}
  for(let y=d.ymin;y<=d.ymax+1e-6;y+=d.stepY){if(Math.abs(y)<1e-8)continue;txt(svg,zx-19,pixel(0,y,d)[1]+8,fmt(y),26,'support',{anchor:'end'});}
  txt(svg,zx-18,zy+33,'0',28,'support',{anchor:'end'});
  txt(svg,BOX.left+BOX.width+19,zy-11,p.kind==='cartesian'?'x':'t',32,'op');
  txt(svg,zx+20,BOX.top-17,p.kind==='cartesian'?'y':p.kind==='velocity'?'v':'d',32,'op');
 }
 function lineEntire(svg,d,A,B,role='result',width=5.6){
  const dx=B[0]-A[0],dy=B[1]-A[1];const pts=[];
  const push=(x,y)=>{if(x>=d.xmin-1e-8&&x<=d.xmax+1e-8&&y>=d.ymin-1e-8&&y<=d.ymax+1e-8&&!pts.some(q=>Math.abs(q[0]-x)<1e-6&&Math.abs(q[1]-y)<1e-6))pts.push([x,y]);};
  if(Math.abs(dx)<1e-10){push(A[0],d.ymin);push(A[0],d.ymax)}
  else{const m=dy/dx,c=A[1]-m*A[0];push(d.xmin,m*d.xmin+c);push(d.xmax,m*d.xmax+c);if(Math.abs(m)>1e-8){push((d.ymin-c)/m,d.ymin);push((d.ymax-c)/m,d.ymax)}}
  if(pts.length<2)return;
  let best=[pts[0],pts[1]],big=-1;for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const h=(pts[i][0]-pts[j][0])**2+(pts[i][1]-pts[j][1])**2;if(h>big){big=h;best=[pts[i],pts[j]]}}
  const a=pixel(...best[0],d),b=pixel(...best[1],d);neon(svg,...a,...b,role,width);
 }
 function marker(svg,x,y,t,role='result',hideCoord=false){N.neonRing(svg,x,y,{role,r:12,pulse:false});E('circle',{cx:x,cy:y,r:4,fill:'#edffff'},svg);if(!mobile()&&!hideCoord)txt(svg,x+18,y-18,t,26,role);}
 function posLabels(svg,a,b){if(mobile())return;const ta=pixel(...a,domain(preset())),tb=pixel(...b,domain(preset()));txt(svg,ta[0]+17,ta[1]+34,'A',26,'given');txt(svg,tb[0]+18,tb[1]-16,'B',26,'result');}
 function handle(svg,d,which,cb,challengeLocked=false){
  const arr=which==='A'?S.A:S.B;const [cx,cy]=pixel(...arr,d);
  const shape=E('g',{class:'f106-handle',role:'slider',tabindex:'0','aria-label':'Point '+which+'; x '+fmt(arr[0])+', y '+fmt(arr[1]),'aria-valuetext':'('+key(arr)+')','data-testid':'f106-point-'+which},svg);
  E('circle',{cx,cy,r:23,fill:'rgba(22,105,180,.16)'},shape);N.neonRing(shape,cx,cy,{role:which==='A'?'focus':'result',r:15,pulse:false});E('circle',{cx,cy,r:24,class:'f106-focus'},shape);
  const next=(x,y,source)=>{const p=[clamp(x,d.xmin,d.xmax),clamp(y,d.ymin,d.ymax)];if(which==='A'){S.A=p;emit('pointA',{p,source})}else{S.B=p;emit('pointB',{p,source})}cb();};
  shape.addEventListener('keydown',e=>{let dx=0,dy=0;if(e.key==='ArrowUp')dy=.5;else if(e.key==='ArrowDown')dy=-.5;else if(e.key==='ArrowRight')dx=1;else if(e.key==='ArrowLeft')dx=-1;else return;
   e.preventDefault();e.stopPropagation();if(challengeLocked)dx=0;next(round(arr[0]+dx,1),round(arr[1]+dy,.5),'keyboard');queueMicrotask(()=>document.querySelector('#F10-06 [data-testid="f106-point-'+which+'"]').focus());});
  const target=[];for(let x=d.xmin;x<=d.xmax+.01;x+=1){if(challengeLocked&&Math.abs(x-arr[0])>.001)continue;for(let y=d.ymin;y<=d.ymax+.01;y+=.5){const z=pixel(x,y,d);target.push({id:x+','+y,kind:'drop',x:z[0]-14,y:z[1]-5,w:28,h:10});}}
  N.ui.svgDrag(svg,shape,{box:{x:cx-18,y:cy-18,w:36,h:36},zones:()=>target,onDrop:id=>{const [x,y]=id.split(',').map(Number);next(x,y,'pointer');return true}});
 }
 function fraction(num,den){return H('span',{class:'f106-fraction','aria-label':num+' over '+den},[H('span',{text:num}),H('span',{text:den})]);}
 function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}

  stage.innerHTML='';const options={step:8,editable:false,challenge:false,correct:false,pose:'explain',caption:'Observe the rise and run.',...o},p=preset(),d=domain(p),z=gr(),step=options.challenge?8:options.step;
  const hide=options.challenge&&!options.correct;
  const frame=H('section',{class:'f106-theatre','data-topic':'geometry','data-testid':'f106-premium-theatre','data-correct':String(!!options.correct)});
  frame.appendChild(H('div',{class:'f106-topline'},[H('span',{text:'F10 · GRADIENT MEASUREMENT STUDIO'}),H('span',{class:'f106-tag',text:options.challenge?'CHALLENGE · FIND THE RATE':p.kind==='velocity'?'SIGNED VELOCITY':'NOVA · NEON CHALK'})]));
  const layout=H('div',{class:'f106-layout'}),left=H('div',{class:'f106-plane'}),svg=N.svg.root(BOX.w,BOX.h,'A precise NOVA coordinate diagram showing a straight line and the signed rise-over-run triangle.');svg.classList.add('nv-svg','f106-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f106-coordinate-board';
  if(mobile())svg.setAttribute('viewBox',p.kind==='cartesian'?'32 20 572 522':'0 20 611 522');
  graph(svg,d,p);
  if(step>=1){lineEntire(svg,d,S.A,S.B,'result',5.6);const a=pixel(...S.A,d),b=pixel(...S.B,d);marker(svg,...a,'A','focus',true);marker(svg,...b,'B','result',true);posLabels(svg,S.A,S.B);}
  const A=pixel(...S.A,d),B=pixel(...S.B,d),corner=pixel(S.B[0],S.A[1],d);
  if(step>=2&&!hide){
   const shape=E('path',{d:`M${A[0]},${A[1]} L${corner[0]},${corner[1]} L${B[0]},${B[1]} Z`,fill:'rgba(34,163,225,.13)',stroke:'none'},svg);
   neon(svg,...A,...corner,'op',3.6,{dash:'8 5'});
   if(step>=3)neon(svg,...corner,...B,z.dy>=0?'result':'focus',4.2,{dash:'8 5'});
   if(step>=4&&!mobile()){
    txt(svg,(A[0]+corner[0])/2,A[1]+(A[1]>BOX.top+BOX.height-40?-23:33),'run '+fmt(z.dx),25,'op',{anchor:'middle'});
    if(Math.abs(z.dy)>1e-9)txt(svg,corner[0]+24,(B[1]+corner[1])/2,'rise '+fmt(z.dy),25,z.dy>=0?'result':'focus');
   }
   if(step>=5){N.neonRing(svg,...corner,{role:'focus',r:9,pulse:false})}
  }
  if(step>=6&&!hide&&p.parallel){lineEntire(svg,d,[S.A[0],S.A[1]+2],[S.B[0],S.B[1]+2],'op',2.8)}
  if(options.editable||options.challenge&&S.task===1&&!options.correct){const change=()=>{scene(stage,{...options});if(options.editable)window.NOVA_F106_REFRESH?.()};if(options.editable)handle(svg,d,'A',change);handle(svg,d,'B',change,options.challenge&&S.task===1)}
  if(options.correct)N.neonRing(svg,...B,{role:'result',r:25,pulse:true});
  left.append(svg,H('div',{class:'f106-pills'},[N.neonTile('A · START',{role:'focus'}),N.neonTile('B · FINISH',{role:'result'}),N.neonTile('Δ · CHANGE',{role:'op'})]));layout.appendChild(left);
  const side=H('aside',{class:'f106-info','aria-label':'Rise run and gradient evidence'});
  const card=(name,content)=>{const c=H('div',{class:'f106-card'},[H('div',{class:'f106-eyebrow',text:name}),content]);side.appendChild(c);return c};
  card(p.kind==='cartesian'?'THE GRADIENT':'MEASURE THE RATE',H('div',{class:'f106-formula',text:hide?'Find the missing rate':p.kind==='distance'?'Speed = Δd ÷ Δt':p.kind==='velocity'?'Acceleration = Δv ÷ Δt':p.kind==='flow'?'Rate = ΔV ÷ Δt':'Gradient = Δy ÷ Δx'}));
  const eq=H('div',{class:'f106-eqrow'},[fraction(hide?'?':fmt(z.dy),hide?'?':fmt(z.dx)),H('span',{class:'f106-eqsign',text:'='}),H('strong',{class:'f106-formula','data-testid':'f106-gradient-value',text:hide?'Find it':fmt(z.m)})]);
  card(options.challenge?'USE THE TWO POINTS':'RISE OVER RUN',eq);
  const changeBoxes=H('div',{class:'f106-deltaval'},[
   H('div',{},[H('span',{text:'VERTICAL · Δy'}),H('strong',{'data-testid':'f106-rise',text:hide?'?':fmt(z.dy)})]),
   H('div',{},[H('span',{text:'HORIZONTAL · Δx'}),H('strong',{'data-testid':'f106-run',text:hide?'?':fmt(z.dx)})])]);
  card('THE TWO CHANGES',changeBoxes);
  card('MEANING & UNITS',H('div',{class:'f106-context',text:hide?'Read change from the graph, then keep the axis units.':p.kind==='velocity'?'A velocity–time gradient is acceleration ('+p.unit+'). Negative acceleration does not always mean negative velocity.':p.kind==='distance'?'A distance–time gradient is speed ('+p.unit+'); distance does not decrease in this straight-line example.':p.kind==='flow'?'The graph shows '+p.unit+'; change in volume divided by elapsed time.':p.parallel?'The second parallel line shows the same rise per run.':'The gradient is signed vertical change divided by horizontal change.'}));
  layout.appendChild(side);frame.append(layout);
  frame.appendChild(H('div',{class:'f106-takeaway',html:hide?'Use the coordinates to find the <em>vertical change</em> and <em>horizontal change</em>.':Number.isFinite(z.m)?'The <em>gradient = rise ÷ run</em>. A descent gives a negative rise; read units from the axis labels.':'A vertical line has <em>zero run</em>, so its gradient is undefined. Never divide by zero.'}));
  if(options.challenge){const img=N.helperImg(options.correct?'cheer':S.wrong>1?'oops':'think','teen');frame.appendChild(H('div',{class:'f106-izaac'},[H('img',{src:img.src,alt:options.correct?'Izaac celebrates a correct gradient':'Izaac reads the graph carefully'}),H('span',{text:options.correct?'Izaac: the change and its units agree.':S.wrong>1?'Izaac: read the two differences, then keep their signs.':'Izaac: measure the change between two points, not from zero.'})]));}
  stage.appendChild(frame);N.scene.helperStrip(stage,options.pose,options.caption);return svg;
 }
 function render(i,stage){const t=STEPS[i];const svg=scene(stage,{step:i,pose:t.mood,caption:t.narration});if(i>0&&!N.reducedMotion()){const d=domain(preset()),a=pixel(...S.A,d),b=pixel(...S.B,d);N.motion.flash(svg,...(i<4?a:b),i<4?'focus':'result',20);if(i===5)N.motion.trail(svg,`M${a[0]},${a[1]} L${b[0]},${b[1]}`,'result',490)}}
 function controls(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f106-controls');window.NovaLessonComponent?.applyExploreModels();const draw=()=>{panel.innerHTML='';const sel=H('select',{class:'nova-input','aria-label':'Lesson preset'});Object.entries(C.presets).forEach(([key,v])=>sel.appendChild(H('option',{value:key,text:v.label})));sel.value=S.preset;sel.onchange=()=>{reset(sel.value);draw();scene(stage,{editable:true,pose:'point',caption:'Move A or B. Explain why the gradient changes.'})};panel.appendChild(H('label',{class:'f106-span'},['Lesson preset',sel]));
  const d=domain(preset());const slider=(point,axis)=>{const current=S[point][axis==='x'?0:1];const wrapper=H('label',{}),heading=H('div',{class:'f106-ctl-head'},[H('span',{text:'Point '+point+' · '+axis}),H('span',{class:'f106-slider-value',text:fmt(current)})]);const input=H('input',{type:'range',min:String(axis==='x'?d.xmin:d.ymin),max:String(axis==='x'?d.xmax:d.ymax),step:String(axis==='x'?1:.5),value:String(current),'aria-label':'Point '+point+' '+axis+' value'});input.oninput=()=>{const v=Number(input.value);S[point][axis==='x'?0:1]=v;emit(point==='A'?'pointA':'pointB',{p:[...S[point]],source:'slider'});heading.lastChild.textContent=fmt(v);scene(stage,{editable:true,pose:'point',caption:'Read the signed rise and run. Watch the result update.'})};wrapper.append(heading,input);return wrapper};
  panel.append(slider('A','x'),slider('A','y'),slider('B','x'),slider('B','y'));
  panel.appendChild(H('div',{class:'f106-actions f106-span'},[H('button',{class:'nova-btn ghost',text:'Restore preset',onclick:()=>{const k=S.preset;reset(k);draw();scene(stage,{editable:true,pose:'point',caption:'The original gradient is restored.'})}}),H('button',{class:'nova-btn ghost',text:'Make horizontal',onclick:()=>{S.B[1]=S.A[1];emit('gradient',{value:0});draw();scene(stage,{editable:true,pose:'point',caption:'A horizontal line has rise zero: gradient zero.'})}})]));
  panel.appendChild(H('div',{class:'f106-note f106-span',text:'Drag either luminous point to a grid intersection, or focus it and use arrow keys. Horizontal movement changes x by 1; vertical movement changes y by 0.5. Escape cancels a drag.'}));};
  window.NovaLessonComponent?.applyExploreModels();window.NOVA_F106_REFRESH=draw;window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();scene(stage,{editable:true,pose:'point',caption:'Drag A or B and predict the signed gradient.'});
 }
 function challenge(panel,api,stage){const tasks=TASKS.map((task,i)=>({q:task.q,build:ctl=>{
   S.task=i;S.wrong=0;S.solved=false;S.entry='';reset(task.preset);
   if(task.type==='drag'){
    S.B=[2,3];ctl.appendChild(H('div',{class:'f106-note',text:'Drag the green B marker up or down; you can also focus it and press the arrow keys. Keep x = 2.'}));return ()=>[...S.B];
   }
   const box=H('div',{class:'f106-ans'}),input=H('input',{class:'nova-input',inputmode:'decimal',placeholder:'Enter a number','aria-label':'Enter gradient or rate'});input.addEventListener('input',()=>{S.entry=input.value;emit('answer',{task:i,value:S.entry})});box.appendChild(input);ctl.appendChild(box);return ()=>S.entry;
  },check:v=>{let good=false,feedback='';if(task.type==='drag'){
    good=Math.abs(v[0]-2)<.001&&Math.abs(v[1]+1)<.001;feedback=good?task.explain:Math.abs(v[0]-2)>.01?'Keep the horizontal x-coordinate at 2. Only move B vertically.':'The line must fall four units over a run of four; watch the negative sign.';
   }else{const raw=String(v??'').trim().replace(/−/g,'-');const n=Number(raw);good=raw!==''&&Number.isFinite(n)&&Math.abs(n-task.answer)<.001;feedback=good?task.explain:raw===''?'Enter the number from the graph first.':i===0?'Gradient is rise divided by run, not run divided by rise. Subtract the coordinates in the same order.':i===2?'A velocity–time gradient is acceleration. Include the sign of the velocity change.':'Subtract the starting distance and starting time; the slope is not total distance divided by total clock time.'}
   if(good){S.solved=true;scene(stage,{challenge:true,correct:true,pose:'cheer',caption:'Correct! Your signed gradient agrees with the graph.'});}else S.wrong++;
   return [good,feedback]
  },hint:task.hint,solve:()=>{S.solved=true;if(task.type==='drag')S.B=[...task.target];scene(stage,{challenge:true,correct:true,pose:'cheer',caption:task.explain})}}));
  N.challengeRun(panel,api,tasks,(i)=>{reset(TASKS[i].preset);S.task=i;S.wrong=0;S.solved=false;S.entry='';if(TASKS[i].type==='drag')S.B=[2,3];scene(stage,{challenge:true,correct:false,pose:'think',caption:'Study both points. Prove the gradient with signed changes.'})},C);
 }
 const def={id:ID,title:'Gradient visual',config:C,steps:STEPS,render,explore:controls,challenge,
  alt:'Neon gradient studio showing two points, a signed rise and run triangle, coordinate axes and a stacked rise-over-run fraction.',
  staticAlt:'Gradient equals vertical change divided by horizontal change. Distance-time gives speed; velocity-time gives acceleration.',
  exploreIntro:'Choose a lesson context. Drag endpoints A and B or use accessible sliders. Compare the horizontal and vertical changes.',
  onRestore:()=>{reset('Y8-022');S.task=0;S.wrong=0;S.solved=false;S.entry='';}};
 N.registry.add({id:ID,title:'Gradient Visual',family:'F10',topics:['gradient','rise run','speed','acceleration','velocity-time','distance-time'],deps:['F0-02','F0-14','F10-05','F10-07','F10-10','F10-11']});
 
/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"STORIES":()=>STORIES,"TASKS":()=>TASKS},draws:{"scene":["stage","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'06',title:'Gradient Visual · Premium Edition',def,linked:['F0-14','F10-05','F10-07','F10-10','F10-11','F15-03'],years:'Y8-022/023/025/026/027/028 and Y9-017',spec:{
  purpose:'Measure gradient as signed vertical change over horizontal change and interpret slope as a contextual rate.',
  params:'A and B on half-unit y grid and integer x grid; Cartesian and real-world axes; zero run is undefined.',
  presets:'Y8-022 · Y8-023 · Y8-025 · Y8-026 · Y8-027 · Y8-028 · Y9-017.',
  steps:'Axes → two points → run → rise → signs → stacked fraction → compare → units → generalise.',
  interactions:'Watch/Guided/Explore/Challenge; draggable endpoints, slider controls, keyboard arrows, snap and Escape recovery.',
  traps:'Reversed rise/run; subtracting in different orders; ignoring negative Δy; mistaking acceleration for velocity; speed versus signed velocity.',
  gcse:'KS3 contexts only in required presets; signed acceleration forms a bridge to later GCSE graphs.'}});
 const card=document.getElementById(ID);if(card){const h=card.querySelector('h3');if(h)h.textContent='Measure rise and run on a real coordinate diagram';card.querySelectorAll('.face img').forEach(i=>{if(!i.alt)i.alt='NOVA maths teaching mascot'})}
})();

