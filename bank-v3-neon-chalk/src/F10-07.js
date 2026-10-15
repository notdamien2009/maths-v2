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


/* NOVA F10-07 — Parallel and Perpendicular Lines; owner-review component.
   Uses embedded canonical F0/F1 NOVA Core. All actual line angles are drawn
   on EQUAL-SCALE coordinate axes, not distorted into decorative right angles. */
const F107_CONFIG={id:'F10-07',family:'F10',defaultPreset:'Y8-025',startMode:'watch',
 presets:{
  'Y8-025':{label:'Y8-025 · Parallel lines and gradient',m:2,c:-1,c2:2,context:'Matching steepness · rise 2, run 1',year:8},
  'Y9-010':{label:'Y9-010 · Straight-line equations',m:-2,c:1,c2:-1,context:'From equations to right-angle proofs',year:9},
  'Y9-040':{label:'Y9-040 · Coordinate geometry',m:.5,c:-1,c2:2,context:'Fractional gradient · reciprocal reasoning',year:9}
 },
 events:{value:['preset','gradient2','intercept2','relation','answer','reset','edge'],types:['mode','step','correct','hintUsed']},
 challenge:{tasks:['parallel-slope','perpendicular-slope','drag-parallel','drag-perpendicular','horizontal-vertical']}};
window.F107_CONFIG=F107_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F107_CONFIG),ID=C.id;
if(N.premium?.enable)N.premium.enable();
const BOX={w:640,h:548,left:96,top:51,width:440,height:440},D={xmin:-5,xmax:5,ymin:-5,ymax:5};
const STORIES=[
 ['A coordinate studio','explain','Two straight lines share a coordinate grid. We can test their relationship using gradient.','Which direction does the x-axis measure?'],
 ['The first line','point','Study line A. Gradient describes its signed rise for every one step to the right.','Is A climbing or falling as x increases?'],
 ['Build its gradient','count','Count the run and rise of A. The order matters: vertical change over horizontal change.','What is the gradient of line A?'],
 ['Make a parallel partner','point','Shift the second line without changing its gradient. Equal gradients mean equal steepness.','Do these two separate lines ever meet?'],
 ['Prove the parallel test','magnify','Parallel lines share a gradient. Different intercepts move the lines but do not change their direction.','Can lines with equal gradient and equal intercept be two distinct lines?'],
 ['A different direction','think','For a perpendicular partner, reverse the gradient fraction and change the sign.','What is the negative reciprocal of the first gradient?'],
 ['Check the right angle','point','At the crossing, these lines meet at 90 degrees. Their gradients multiply to negative one.','Does m1 times m2 equal negative one?'],
 ['Use the negative reciprocal','count','If one gradient is two, the perpendicular gradient is negative one half. Both tests use gradients, not intercepts.','Would merely changing the intercept make a perpendicular line?'],
 ['The horizontal exception','magnify','Horizontal has gradient zero. Its perpendicular partner is vertical and its gradient is undefined.','Can you divide negative one by zero?'],
 ['Transfer the reasoning','cheer','Compare gradients for parallels; use negative reciprocals for perpendiculars. Check the special horizontal case.','How would you prove a new pair of lines is perpendicular?']
];
const STEPS=STORIES.map((v,i)=>({name:v[0],narration:v[2],prompt:v[3],mood:v[1],view:i}));
const TASKS=[
 {preset:'Y8-025',type:'number',relation:'parallel',q:'Line A is y = 2x − 1. What gradient must a different parallel line have?',answer:2,hint:'Parallel lines have the same vertical change for each unit of horizontal change.',explain:'The second gradient is 2. Its intercept can be different.'},
 {preset:'Y9-010',type:'number',relation:'perpendicular',q:'Line A has gradient −2. Give the gradient of a perpendicular line.',answer:.5,hint:'Flip the fraction and reverse the sign: the negative reciprocal of −2 is positive one half.',explain:'(−2) × (0.5) = −1, so the lines are perpendicular.'},
 {preset:'Y9-040',type:'drag',relation:'parallel',q:'Move the green line B handle until B is parallel to A, which has gradient 0.5.',answer:.5,hint:'The green line must climb one unit for every two units to the right, exactly as A does.',explain:'Both lines have gradient 0.5 and different intercepts: parallel.'},
 {preset:'Y8-025',type:'drag',relation:'perpendicular',q:'Drag B until it is perpendicular to A, where A has gradient 2.',answer:-.5,hint:'The negative reciprocal of 2 is −1/2. Drag the green point until B falls by one for every two to the right.',explain:'2 × (−0.5) = −1. The crossing is a right angle.'},
 {preset:'Y9-040',type:'choice',relation:'edge',q:'A is a horizontal line. What direction must its perpendicular partner have?',answer:'vertical',hint:'A horizontal line has gradient zero. Its perpendicular partner has an undefined gradient.',explain:'Horizontal and vertical lines make 90°. The vertical gradient is undefined—not infinity as a number.'}
];
const S={preset:C.defaultPreset,m2:2,c2:2,edge:false,task:0,wrong:0,solved:false,entry:''};
const emit=(k,v)=>{if(!C.events.value.includes(k))throw Error('Undeclared event '+k);N.events.emit('value',{engine:ID,key:k,value:v})};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const round=(n,step=.25)=>Math.round(n/step)*step;
const fmt=n=>!Number.isFinite(n)?'undefined':(Math.abs(n)<1e-8?'0':String(Math.round(Math.abs(n)*1000)/1000).replace(/^/,(n<0?'−':'')));
const within=(a,b,tol=.0001)=>Math.abs(a-b)<tol;
const pset=()=>C.presets[S.preset];
function reset(k=C.defaultPreset){S.preset=k;S.m2=C.presets[k].m;S.c2=C.presets[k].c2;S.edge=false;S.solved=false;S.entry='';emit('preset',k)}
reset();
const mobile=()=>window.matchMedia('(max-width:760px)').matches;
const pixel=(x,y)=>[BOX.left+(x-D.xmin)/(D.xmax-D.xmin)*BOX.width,BOX.top+(D.ymax-y)/(D.ymax-D.ymin)*BOX.height];
const text=(svg,x,y,t,sz=24,role='given',opts={})=>N.chalkText(svg,x,y,String(t),{size:mobile()?Math.max(25,sz):sz,role,...opts});
const tube=(svg,x1,y1,x2,y2,role='op',width=3,opt={})=>N.neonLine(svg,x1,y1,x2,y2,{role,width,...opt});
function lineEnds(m,c){if(!Number.isFinite(m))return [[c,D.ymin],[c,D.ymax]];
 let pts=[];const push=(x,y)=>{if(x>=D.xmin-1e-7&&x<=D.xmax+1e-7&&y>=D.ymin-1e-7&&y<=D.ymax+1e-7&&!pts.some(([a,b])=>Math.abs(x-a)<1e-6&&Math.abs(y-b)<1e-6))pts.push([x,y])};
 push(D.xmin,m*D.xmin+c);push(D.xmax,m*D.xmax+c);if(Math.abs(m)>1e-9){push((D.ymin-c)/m,D.ymin);push((D.ymax-c)/m,D.ymax)}
 if(pts.length<2)return null;let best=[pts[0],pts[1]],mx=-1;for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const h=(pts[i][0]-pts[j][0])**2+(pts[i][1]-pts[j][1])**2;if(h>mx){mx=h;best=[pts[i],pts[j]]}}return best;
}
function line(svg,m,c,role='result',width=5){const ends=lineEnds(m,c);if(ends){const a=pixel(...ends[0]),b=pixel(...ends[1]);tube(svg,...a,...b,role,width);return [a,b]}return null}
function fraction(a,b){return H('span',{class:'f107-fraction','aria-label':a+' over '+b},[H('span',{text:a}),H('span',{text:b})])}
function grid(svg){const g=N.neonPlot(svg,{x0:BOX.left,y0:BOX.top,w:BOX.width,h:BOX.height,x:[-5,5],y:[-5,5],xStep:1,yStep:1});g.g.classList.add('f107-grid');g.g.querySelectorAll('text').forEach(t=>t.remove());
 const z=N.svg.axes(svg,{x:BOX.left,y:BOX.top,w:BOX.width,h:BOX.height,xmin:-5,xmax:5,ymin:-5,ymax:5,ticks:1});z.g.classList.add('f107-grid');z.g.querySelectorAll('text').forEach(t=>t.remove());
 const [ox,oy]=pixel(0,0),stride=mobile()?2:1;
 for(let x=-4;x<=4;x++){if(Math.abs(x)<1.5||(Math.abs(x)%stride!==0))continue;text(svg,pixel(x,0)[0],oy+30,fmt(x),24,'support',{anchor:'middle'})}
 for(let y=-4;y<=4;y++){if(!y||(Math.abs(y)%stride!==0))continue;text(svg,ox-17,pixel(0,y)[1]+7,fmt(y),24,'support',{anchor:'end'})}
 text(svg,ox-19,oy+28,'0',24,'support',{anchor:'end'});text(svg,BOX.left+BOX.width+19,oy-13,'x',31,'op');text(svg,ox+19,BOX.top-15,'y',31,'op');
}
function relationship(m1,m2,c1,c2,edge){if(edge)return m1===0?'perpendicular':'invalid';if(within(m1,m2))return within(c1,c2)?'coincident':'parallel';if(within(m1*m2,-1))return 'perpendicular';return 'other'}
function baseline(options){const p=pset();if(options.challenge){return {m1:options.task===4?0:p.m,c1:options.task===4?-1:p.c,m2:S.m2,c2:S.c2,edge:options.task===4?true:S.edge}}
 if(options.editable)return {m1:S.edge?0:p.m,c1:S.edge?-1:p.c,m2:S.m2,c2:S.c2,edge:S.edge};
 const i=options.step;
 if(i===8)return {m1:0,c1:-1,m2:Infinity,c2:1,edge:true};
 const parallel=i<=4;return {m1:p.m,c1:p.c,m2:parallel?p.m:(p.m===0?Infinity:-1/p.m),c2:p.c2,edge:false};
}
function triangle(svg,m,c,role,atX){if(!Number.isFinite(m)||Math.abs(m)<1e-6)return;
 const maxRun=Math.abs(m)>1.5?1:2,run= maxRun, x=atX;let y=m*x+c;
 if(x+run>4.7||x<-4.7||y>4.5||y<-4.5||m*(x+run)+c>4.5||m*(x+run)+c<-4.5)return;
 const A=pixel(x,y),B=pixel(x+run,y),C=pixel(x+run,y+m*run);
 E('path',{d:`M${A[0]} ${A[1]}L${B[0]} ${B[1]}L${C[0]} ${C[1]}Z`,fill:role==='result'?'rgba(47,255,177,.11)':'rgba(255,203,95,.10)',stroke:'none'},svg);
 tube(svg,...A,...B,role,2.7,{dash:'6 6'});tube(svg,...B,...C,role,2.7,{dash:'6 6'});
 if(!mobile()){text(svg,(A[0]+B[0])/2,B[1]+30,'run '+fmt(run),23,'op',{anchor:'middle'});text(svg,B[0]+15,(B[1]+C[1])/2,'rise '+fmt(m*run),23,role)}
}
function rightAngle(svg,a,b){
 if(a.edge&&within(a.m1,0)&&a.m2===Infinity){const [px,py]=pixel(a.c2,a.c1);E('path',{d:`M${px+17},${py} L${px+17},${py-17} L${px},${py-17}`,stroke:'#ffce6d','stroke-width':3.3,'stroke-linecap':'round',strokeLinejoin:'round',fill:'none'},svg);N.neonRing(svg,px,py,{role:'focus',r:18,pulse:false});if(!mobile())text(svg,px+23,py-23,'90°',24,'focus');return;}
 if(!Number.isFinite(a.m2)||!within(a.m1*a.m2,-1)||within(a.m1,a.m2))return;
 const ix=(a.c2-a.c1)/(a.m1-a.m2),iy=a.m1*ix+a.c1;
 if(Math.abs(ix)>4.7||Math.abs(iy)>4.7)return;
 const [px,py]=pixel(ix,iy);const u=[1,-a.m1],v=[1,-a.m2],normalize=t=>{const h=Math.hypot(...t);return t.map(x=>x*16/h)};
 const d=normalize(u),e=normalize(v);E('path',{d:`M${px+d[0]},${py+d[1]} L${px+d[0]+e[0]},${py+d[1]+e[1]} L${px+e[0]},${py+e[1]}`,stroke:'#ffce6d','stroke-width':3.3,'stroke-linecap':'round','stroke-linejoin':'round',fill:'none',filter:'drop-shadow(0 0 5px #f4aa3d)'},svg);
 N.neonRing(svg,px,py,{role:'focus',r:19,pulse:false});
 if(!mobile())text(svg,px+22,py+53,'90°',24,'focus');
}
function marker(svg,x,y,label,role='result'){N.neonRing(svg,x,y,{role,r:14,pulse:false});E('circle',{cx:x,cy:y,r:4.5,fill:'#eaffff'},svg);if(!mobile()&&label)text(svg,x+14,y-18,label,24,role)}
function handle(svg,a,onChange){if(a.edge)return;const x=1,y=a.m2+a.c2;if(y<-5||y>5)return;const [cx,cy]=pixel(x,y);
 const g=E('g',{class:'f107-handle',role:'slider',tabindex:'0','aria-label':'Line B gradient handle; gradient '+fmt(a.m2),'aria-valuemin':'-3','aria-valuemax':'3','aria-valuenow':String(a.m2),'data-testid':'f107-handle'},svg);
 E('circle',{cx,cy,r:24,fill:'rgba(10,133,175,.19)'},g);N.neonRing(g,cx,cy,{role:'result',r:16,pulse:false});E('circle',{cx,cy,r:25,class:'f107-focus'},g);
 const update=(gradient,origin)=>{S.m2=round(clamp(gradient,-3,3),.25);emit('gradient2',{value:S.m2,origin});onChange()};
 g.addEventListener('keydown',e=>{const step=e.key==='ArrowUp'?.25:e.key==='ArrowDown'?-.25:e.key==='ArrowRight'?.25:e.key==='ArrowLeft'?-.25:null;if(step===null)return;e.preventDefault();e.stopPropagation();update(S.m2+step,'keyboard');queueMicrotask(()=>document.querySelector('#F10-07 [data-testid="f107-handle"]')?.focus())});
 const zones=[];for(let m=-3;m<=3.01;m+=.25){const posY=m+S.c2;if(posY<-5||posY>5)continue;const q=pixel(1,posY);zones.push({id:String(round(m,.25)),kind:'drop',x:q[0]-14,y:q[1]-5,w:28,h:10})}
 N.ui.svgDrag(svg,g,{box:{x:cx-19,y:cy-19,w:38,h:38},zones:()=>zones,onDrop:id=>{update(Number(id),'pointer');return true}});
}
function scene(stage,args={}){
if(window.NovaLessonComponent?.active){[stage,args]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';const o={step:9,editable:false,challenge:false,correct:false,showTarget:true,pose:'explain',caption:'Compare the two gradients.',...args};const a=baseline(o),rel=relationship(a.m1,a.m2,a.c1,a.c2,a.edge),hide=o.challenge&&!o.correct,showB=!hide||o.task===2||o.task===3;
 const frame=H('section',{class:'f107-theatre','data-topic':'geometry','data-testid':'f107-premium-theatre','data-correct':String(o.correct)});
 frame.appendChild(H('div',{class:'f107-topline'},[H('span',{text:'F10 · TWO-LINE GEOMETRY STUDIO'}),H('span',{class:'f107-tag',text:o.challenge?'CHALLENGE · JUSTIFY THE LINES':a.edge?'HORIZONTAL ↔ VERTICAL':'NOVA · NEON CHALK'})]));
 const layout=H('div',{class:'f107-layout'}),left=H('div',{class:'f107-plane'}),svg=N.svg.root(BOX.w,BOX.h,'Equal scale four-quadrant coordinate graph with parallel and perpendicular lines.');svg.classList.add('nv-svg','f107-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f107-coordinate-board';if(mobile())svg.setAttribute('viewBox','53 7 542 529');
 grid(svg);
 if(o.step>=1||o.editable||o.challenge){line(svg,a.m1,a.c1,'focus',5.6);const q=pixel(0,a.c1);if(a.c1>=-5&&a.c1<=5)marker(svg,...q,'','focus')}
 if(!hide&&o.step>=2&&!a.edge)triangle(svg,a.m1,a.c1,'focus',-1.5);
 if(showB&&(o.step>=3||o.editable||o.challenge)){line(svg,a.m2,a.c2,'result',5.4);if(Number.isFinite(a.m2)){const pt=pixel(1,a.m2+a.c2);if(pt[1]>=BOX.top&&pt[1]<=BOX.top+BOX.height)marker(svg,...pt,'B','result')}}
 if(o.step>=4&&!hide&&!a.edge&&Number.isFinite(a.m2)&&within(a.m1,a.m2)&&!o.editable)triangle(svg,a.m2,a.c2,'result',-1.5);
 if(showB&&(o.step>=6||o.editable||o.challenge)&&rel==='perpendicular'){rightAngle(svg,a)}
 if(!a.edge&&(o.editable||(o.challenge&&S.task>=2&&S.task<=3&&!o.correct))){handle(svg,a,()=>{scene(stage,{...o});if(o.editable)window.NOVA_F107_REFRESH?.()})}
 if(o.correct){const B=pixel(0,a.c1);N.neonRing(svg,...B,{role:'result',r:27,pulse:true})}
 left.append(svg,H('div',{class:'f107-pills'},[N.neonTile('A · REFERENCE',{role:'focus'}),N.neonTile('B · COMPARE',{role:'result'}),N.neonTile('∟ · 90° TEST',{role:'op'})]));layout.appendChild(left);
 const side=H('aside',{class:'f107-info','aria-label':'Gradient comparison evidence'});
 const card=(label,content)=>{const el=H('div',{class:'f107-card'},[H('div',{class:'f107-eyebrow',text:label}),content]);side.appendChild(el)};
 const relationTxt=hide?'Prove the relationship':rel==='parallel'?'PARALLEL':rel==='perpendicular'?'PERPENDICULAR':rel==='coincident'?'SAME LINE · COINCIDENT':'NOT PARALLEL OR PERPENDICULAR';
 card('THE LINE RELATIONSHIP',H('div',{class:'f107-formula','data-testid':'f107-relation',text:relationTxt}));
 const grA=H('div',{class:'f107-detail'},[H('span',{text:'A · m₁ = '}),H('strong',{text:fmt(a.m1)})]);
 const grB=H('div',{class:'f107-detail'},[H('span',{text:'B · m₂ = '}),H('strong',{'data-testid':'f107-m2',text:hide?'?':fmt(a.m2)})]);
 card('COMPARE THE GRADIENTS',H('div',{class:'f107-coords'},[grA,grB]));
 const equation=a.edge?H('div',{class:'f107-rule',text:'Horizontal: m = 0 · Vertical: m is undefined'}):rel==='perpendicular'?H('div',{class:'f107-rule'},[H('span',{text:'m₂ = −'}),fraction('1',fmt(a.m1)),H('small',{text:'   m₁ × m₂ = −1'})]):H('div',{class:'f107-rule',text:'Parallel: m₁ = m₂ · perpendicular: m₁ × m₂ = −1'});
 card('THE MATHEMATICAL TEST',hide?H('div',{class:'f107-context',text:'Check the gradients without revealing B’s answer.'}):equation);
 card('EVIDENCE',H('div',{class:'f107-context',text:hide?'Use the graph and your own working. The answer appears after checking.':a.edge?'A horizontal and vertical line cross at a right angle. The vertical gradient is undefined.':rel==='parallel'?'Same gradient and different intercepts: constant separation.':rel==='perpendicular'?'The product of gradients is −1. The right-angle marking is geometrically exact.':rel==='coincident'?'Identical gradient AND identical intercept means one coincident line, not two separate parallels.':'These two gradients do not satisfy either special relationship.'}));
 layout.appendChild(side);frame.appendChild(layout);
 frame.appendChild(H('div',{class:'f107-takeaway',html:hide?'Your job: decide the <em>second gradient</em> and explain why.':a.edge?'Horizontal and vertical are <em>perpendicular</em>, but vertical gradient is undefined.':rel==='parallel'?'Two distinct parallel lines have the <em>same gradient</em> but different intercepts.':rel==='perpendicular'?'Perpendicular slopes are <em>negative reciprocals</em>; their product is −1.':'Compare gradients carefully: equal intercepts can make lines coincide.'}));
 if(o.challenge){const img=N.helperImg(o.correct?'cheer':S.wrong>0?'oops':'think','teen');frame.appendChild(H('div',{class:'f107-izaac'},[H('img',{src:img.src,alt:o.correct?'Izaac celebrating correct gradient reasoning':'Izaac studying the coordinate diagram'}),H('span',{text:o.correct?'Izaac: Your gradient test is mathematically proven.':S.wrong?'Izaac: Check the gradient signs and reciprocals.':'Izaac: Use the gradients to prove the relationship.'})]));}
 stage.appendChild(frame);N.scene.helperStrip(stage,o.pose,o.caption);return svg;
}
function render(i,stage){const t=STEPS[i];const svg=scene(stage,{step:i,pose:t.mood,caption:t.narration});if(i>0&&!N.reducedMotion()){const a=baseline({step:i}),q=pixel(0,a.c1);N.motion.flash(svg,...q,i<5?'focus':'result',20);if(i===3||i===5){const ends=lineEnds(a.m2,a.c2);if(ends){const A=pixel(...ends[0]),B=pixel(...ends[1]);N.motion.trail(svg,`M${A[0]},${A[1]} L${B[0]},${B[1]}`,'result',540)}}}}
function controls(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f107-controls');window.NovaLessonComponent?.applyExploreModels();const draw=()=>{panel.innerHTML='';const sel=H('select',{class:'nova-input','data-testid':'f107-preset','aria-label':'Lesson preset'});Object.entries(C.presets).forEach(([k,v])=>sel.appendChild(H('option',{value:k,text:v.label})));sel.value=S.preset;sel.onchange=()=>{reset(sel.value);draw();scene(stage,{editable:true,pose:'point',caption:'Explore the relationship by changing B.'})};panel.appendChild(H('label',{class:'f107-span'},['Lesson preset',sel]));
 const actions=H('div',{class:'f107-actions f107-span'});const button=(label,onClick)=>actions.appendChild(H('button',{class:'nova-btn ghost',text:label,onclick:onClick}));
 button('Make parallel',()=>{S.edge=false;S.m2=pset().m;S.c2=within(S.c2,pset().c)?clamp(pset().c+2,-2,2):S.c2;emit('relation','parallel');draw();scene(stage,{editable:true,pose:'point',caption:'The two lines share a gradient: they are parallel.'})});
 button('Make perpendicular',()=>{S.edge=false;S.m2=-1/pset().m;emit('relation','perpendicular');draw();scene(stage,{editable:true,pose:'point',caption:'The second gradient is the negative reciprocal. Look at the right angle.'})});
 button('Horizontal ↔ vertical',()=>{S.edge=true;S.m2=Infinity;S.c2=1;emit('edge',true);draw();scene(stage,{editable:true,pose:'magnify',caption:'Zero gradient meets undefined gradient at a right angle.'})});
 button('Restore preset',()=>{reset(S.preset);emit('reset',S.preset);draw();scene(stage,{editable:true,pose:'explain',caption:'Preset gradients and intercepts restored.'})});
 panel.appendChild(actions);
 if(!S.edge){const sliders=[{key:'m2',label:'Gradient of B · m₂',min:-3,max:3,step:.25},{key:'c2',label:'Y-intercept of B · c₂',min:-2,max:2,step:.5}];for(const s of sliders){const label=H('label',{}),row=H('div',{class:'f107-ctl-head'},[H('span',{text:s.label}),H('span',{class:'f107-slider-value',text:fmt(S[s.key])})]),input=H('input',{type:'range',min:String(s.min),max:String(s.max),step:String(s.step),value:String(S[s.key]),'data-testid':'f107-slider-'+s.key,'aria-label':s.label});input.oninput=()=>{S[s.key]=Number(input.value);emit(s.key==='m2'?'gradient2':'intercept2',S[s.key]);row.lastChild.textContent=fmt(S[s.key]);scene(stage,{editable:true,pose:'point',caption:'Observe how B changes. The axis scales stay equal.'})};label.append(row,input);panel.appendChild(label)}}
 panel.appendChild(H('div',{class:'f107-note f107-span',text:S.edge?'Horizontal gradient is zero; a vertical gradient is undefined. Restore to explore finite gradients.':'Drag B’s green handle along x = 1 to change its gradient, or use arrow keys and sliders. Escape cancels a drag. Different y-intercepts shift lines without changing their gradients.'}));};
 window.NovaLessonComponent?.applyExploreModels();window.NOVA_F107_REFRESH=draw;window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();scene(stage,{editable:true,pose:'point',caption:'Choose a relationship, drag B, and prove it using the gradients.'});}
function challenge(panel,api,stage){const tasks=TASKS.map((task,i)=>({q:task.q,build:ctl=>{S.task=i;S.wrong=0;S.solved=false;S.entry='';reset(task.preset);if(task.type==='drag'){S.m2=i===2?-1.5:1.5;S.c2=i===2?2:0;ctl.appendChild(H('div',{class:'f107-note',text:'Drag the green gradient handle or focus it and use arrow keys. Aim for the exact relationship; the proof is hidden until marking.'}));return ()=>S.m2}
 if(task.type==='choice'){const select=H('select',{class:'nova-input','aria-label':'Choose perpendicular line direction'},[H('option',{value:'',text:'Choose a direction'}),H('option',{value:'horizontal',text:'Horizontal'}),H('option',{value:'vertical',text:'Vertical'}),H('option',{value:'diagonal',text:'Diagonal'}),H('option',{value:'undefined',text:'No perpendicular exists'})]);select.addEventListener('change',()=>S.entry=select.value);ctl.appendChild(select);return ()=>S.entry;}
 const box=H('div',{class:'f107-ans'}),input=H('input',{class:'nova-input',inputmode:'decimal',placeholder:'Enter the gradient','aria-label':'Enter gradient of the second line'});input.addEventListener('input',()=>{S.entry=input.value;emit('answer',{task:i,value:S.entry})});box.appendChild(input);ctl.appendChild(box);return ()=>S.entry;},
 check:v=>{let good=false,feedback='';if(task.type==='choice'){good=v==='vertical';feedback=good?task.explain:'A horizontal line meets a vertical line at 90°. The vertical slope is undefined.'}
 else if(task.type==='drag'){good=Number.isFinite(v)&&within(v,task.answer,.001)&&!within(pset().c,S.c2);feedback=good?task.explain:task.relation==='parallel'?'Check the line A gradient. Move B to exactly the same gradient; the intercepts must differ.':'Reverse the gradient fraction AND reverse its sign. Changing only the intercept does not make a right angle.';}
 else{const raw=String(v??'').trim().replace(/−/g,'-');const val=Number(raw);good=raw!==''&&Number.isFinite(val)&&within(val,task.answer,.001);feedback=good?task.explain:raw===''?'Enter a gradient before checking.':task.relation==='parallel'?'A parallel slope is equal to the reference slope. Do not negate it.':'Perpendicular means negative reciprocal: switch the fraction AND its sign.'}
 if(good){S.solved=true;if(task.type==='number')S.m2=task.answer;if(task.type==='choice')S.edge=true;scene(stage,{challenge:true,correct:true,task:i,pose:'cheer',caption:task.explain});}else S.wrong++;
 return [good,feedback]},hint:task.hint,solve:()=>{S.solved=true;if(task.type==='choice'){S.edge=true;S.m2=Infinity;S.c2=1;}else S.m2=task.answer;scene(stage,{challenge:true,correct:true,task:i,pose:'cheer',caption:task.explain})}}));
 N.challengeRun(panel,api,tasks,i=>{reset(TASKS[i].preset);S.task=i;S.wrong=0;S.solved=false;S.entry='';if(TASKS[i].type==='drag'){S.m2=i===2?-1.5:1.5;S.c2=i===2?2:0;}if(i===4){S.edge=true;S.m2=Infinity;S.c2=1;}scene(stage,{challenge:true,correct:false,task:i,pose:'think',caption:'Study the reference line. Test a gradient relationship without seeing the answer.'})},C);
}
const def={id:ID,title:'Parallel and perpendicular lines',config:C,steps:STEPS,render,explore:controls,challenge,
 alt:'Equal-scale NOVA coordinate grid with two distinct neon straight lines and a mathematically exact right-angle marker.',
 staticAlt:'Parallel lines have equal gradients. Perpendicular nonvertical gradients have product negative one. Horizontal and vertical are perpendicular.',
 exploreIntro:'Choose a lesson, construct a parallel or perpendicular partner, then drag the green handle or use accessible sliders.',
 onRestore:()=>{reset();S.wrong=0;S.solved=false;S.task=0}};
N.registry.add({id:ID,title:'Parallel and Perpendicular Lines',family:'F10',topics:['linear equations','parallel gradients','perpendicular negative reciprocal','coordinate geometry'],deps:['F0-02','F0-14','F10-05','F10-06']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"STORIES":()=>STORIES,"TASKS":()=>TASKS},draws:{"scene":["stage","args"]},exploreFields:{}});
N.bankMount({id:ID,num:'07',title:'Parallel & Perpendicular · Premium Edition',def,linked:['F0-14','F10-05','F10-06','F10-08'],years:'Y8-025 · Y9-010 · Y9-040',spec:{
 purpose:'Prove parallel and perpendicular relationships using gradients, distinct intercepts and a genuine right-angle diagram.',
 params:'Reference m₁ and c₁; movable second gradient m₂ and intercept c₂; equal-scale coordinates from −5 to 5; vertical exception.',
 presets:'Y8-025 · Y9-010 · Y9-040, plus horizontal–vertical exploration.',
 steps:'Coordinate grid → line A → rise/run → displaced partner → equal gradients → negative reciprocal → 90° → signed reciprocal → vertical exception → transfer.',
 interactions:'Watch, Guided, Explore, Challenge; movable B handle, sliders, lesson switch, snap, keyboard arrows and Escape cancellation.',
 traps:'Equal gradients and equal intercepts give coincident lines; changing intercept does not change slope; perpendicular slopes require negative reciprocals; zero gradient gives vertical perpendicular.',
 gcse:'Year 9 straight-line equations provide GCSE-ready negative-reciprocal reasoning; no advanced tangent geometry.'}});
const card=document.getElementById(ID);if(card){const h=card.querySelector('h3');if(h)h.textContent='Prove parallel and perpendicular from gradient';card.querySelectorAll('.face img').forEach(img=>{if(!img.alt)img.alt='NOVA teaching mascot'})}
})();

