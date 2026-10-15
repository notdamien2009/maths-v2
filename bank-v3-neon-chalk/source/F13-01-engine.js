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


/* NOVA F13-01 · 3-D Solid Viewer · geometry engine only.
   Core shell, F0 primitives, fonts, gradients, NOVA helpers and docking inherited verbatim
   from the user-supplied F12-03 premium production HTML. */
var NOVA_F13_01_CONFIG={startMode:'watch',preset:'cube',show:'all',xray:false,
 presets:{cube:'Cube',cuboid:'Cuboid',triPrism:'Triangular prism',pyramid:'Square-based pyramid',cylinder:'Cylinder',cone:'Cone',sphere:'Sphere'}};
(function(){
'use strict';
var h=NOVA.h,S=NOVA.svg,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F13_01_CONFIG),EN='F13-01';
var DATA={
 cube:{name:'Cube',faces:6,edges:12,vertices:8,desc:'Six equal square faces. Every edge has the same length.',phrase:'Each corner joins three edges.',unit:'Each face is a square'},
 cuboid:{name:'Cuboid',faces:6,edges:12,vertices:8,desc:'Six rectangular faces arranged in three matching pairs.',phrase:'Opposite faces match.',unit:'The faces are rectangles'},
 triPrism:{name:'Triangular prism',faces:5,edges:9,vertices:6,desc:'Two identical triangular ends and three rectangular side faces.',phrase:'The triangular cross-section stays the same.',unit:'Three rectangle side faces'},
 pyramid:{name:'Square-based pyramid',faces:5,edges:8,vertices:5,desc:'One square base and four triangular faces meeting at an apex.',phrase:'Four triangular faces rise to one apex.',unit:'One square and four triangles'},
 cylinder:{name:'Cylinder',faces:3,edges:2,vertices:0,desc:'Two flat circular faces, one curved surface, two circular edges.',phrase:'The circular edges are curved, not straight.',unit:'Includes one curved surface'},
 cone:{name:'Cone',faces:2,edges:1,vertices:1,desc:'One circular base, one curved surface, one apex.',phrase:'The apex is its single vertex.',unit:'Includes one curved surface'},
 sphere:{name:'Sphere',faces:1,edges:0,vertices:0,desc:'One continuous curved surface; there are no edges or corners.',phrase:'A sphere has no flat faces.',unit:'One continuous curved surface'}
};
var STEPS=[
 {name:'Meet the solid',solid:'cube',yaw:-.68,pitch:.41,show:'none',narration:'This is a cube. Unlike a flat square, it has length, width and height. Turn it and notice that every side is a square.',prompt:'Which part of this solid is flat?'},
 {name:'Find a face',solid:'cube',yaw:-.68,pitch:.41,show:'faces',narration:'A face is a flat surface. A cube has six square faces: top and bottom, front and back, left and right.',prompt:'How many faces does a cube have?'},
 {name:'Follow an edge',solid:'cube',yaw:-.68,pitch:.41,show:'edges',narration:'An edge is where two faces meet. Trace all twelve edges. Some hide behind the cube, so rotate it to check.',prompt:'Where do two flat faces meet?'},
 {name:'Spot the vertices',solid:'cube',yaw:-.68,pitch:.41,show:'vertices',narration:'A vertex is a corner. Three edges meet at each corner of a cube. There are eight vertices altogether.',prompt:'What do we call a corner?'},
 {name:'Change the dimensions',solid:'cuboid',yaw:-.63,pitch:.44,show:'all',narration:'A cuboid stretches the cube along its length. Its faces are rectangles, but it still has six faces, twelve edges and eight vertices.',prompt:'Did stretching the solid change its number of corners?'},
 {name:'A different solid',solid:'triPrism',yaw:-.62,pitch:.34,show:'all',narration:'A triangular prism has two matching triangular ends and three rectangles around the sides. That makes five faces, nine edges and six vertices.',prompt:'How many triangular ends does this prism have?'},
 {name:'Check your counting',solid:'pyramid',yaw:-.65,pitch:.46,show:'all',narration:'This pyramid has a square base and four triangular sides. It has five faces, eight edges and five vertices. Now explore the other solids.',prompt:'Does the point at the top count as a vertex?'}
];
var colors={cyan:'#2bdcf3',purple:'#9d7cff',blue:'#4f9fff',gold:'#ffae5d',green:'#55efae',white:'#eefaff'};
function n(v){return Math.round(v*100)/100;}
function esc(s){return String(s).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x];});}
function V(x,y,z){return [x,y,z];}
function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function norm(a){var d=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/d,a[1]/d,a[2]/d];}
function average(A){return A.reduce(function(s,p){return add(s,p);},[0,0,0]).map(function(x){return x/A.length;});}
function makeFace(pts,role,typ){var c=average(pts),no=norm(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])));if(dot(no,c)<0){pts=pts.slice().reverse();no=no.map(function(x){return -x;});}return {pts:pts,normal:no,role:role||'cyan',typ:typ||'plane'};}
function mesh(shape){var fs=[],r=1.12,i,ang,a,b;
 function f(pts,role,typ){fs.push(makeFace(pts,role,typ));}
 if(shape==='cube'||shape==='cuboid'){
  var X=shape==='cube'?1.1:1.52,Y=shape==='cube'?1.1:.91,Z=shape==='cube'?1.1:1.01;
  f([V(-X,Y,-Z),V(X,Y,-Z),V(X,Y,Z),V(-X,Y,Z)],'cyan');
  f([V(-X,-Y,Z),V(X,-Y,Z),V(X,-Y,-Z),V(-X,-Y,-Z)],'purple');
  f([V(-X,Y,Z),V(X,Y,Z),V(X,-Y,Z),V(-X,-Y,Z)],'blue');
  f([V(X,Y,-Z),V(-X,Y,-Z),V(-X,-Y,-Z),V(X,-Y,-Z)],'gold');
  f([V(X,Y,Z),V(X,Y,-Z),V(X,-Y,-Z),V(X,-Y,Z)],'purple');
  f([V(-X,Y,-Z),V(-X,Y,Z),V(-X,-Y,Z),V(-X,-Y,-Z)],'cyan');
 }else if(shape==='triPrism'){
  var A=[V(-1.18,-.94,1.14),V(1.18,-.94,1.14),V(0,1.14,1.14)], B=A.map(function(q){return V(q[0],q[1],-1.14);});
  f(A,'blue');f(B,'purple');f([A[0],A[1],B[1],B[0]],'cyan');f([A[1],A[2],B[2],B[1]],'gold');f([A[2],A[0],B[0],B[2]],'purple');
 }else if(shape==='pyramid'){
  var p=V(0,1.38,0),c=[V(-1.16,-1,-1.16),V(1.16,-1,-1.16),V(1.16,-1,1.16),V(-1.16,-1,1.16)];
  f(c,'cyan');for(i=0;i<4;i++)f([c[i],c[(i+1)%4],p],['purple','blue','gold','cyan'][i]);
 }else if(shape==='cylinder'||shape==='cone'){
  var count=48,base=shape==='cylinder'?-1.1:-1.15,top=1.1;
  for(i=0;i<count;i++){
   a=i/count*Math.PI*2;b=(i+1)/count*Math.PI*2;
   var p1=V(r*Math.cos(a),base,r*Math.sin(a)),p2=V(r*Math.cos(b),base,r*Math.sin(b));
   if(shape==='cone')f([p1,p2,V(0,1.36,0)],'blue','curved');
   else f([p1,p2,V(r*Math.cos(b),top,r*Math.sin(b)),V(r*Math.cos(a),top,r*Math.sin(a))],'blue','curved');
  }
  f(Array.from({length:count},function(_,j){var t=j/count*2*Math.PI;return V(r*Math.cos(t),base,r*Math.sin(t));}),'purple','cap');
  if(shape==='cylinder')f(Array.from({length:count},function(_,j){var t=j/count*2*Math.PI;return V(r*Math.cos(t),top,r*Math.sin(t));}),'cyan','cap');
 }
 return fs;
}
function rotate(p,yaw,pitch){var cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);var x=p[0]*cy+p[2]*sy, z=p[2]*cy-p[0]*sy;return [x,p[1]*cp-z*sp,p[1]*sp+z*cp];}
function proj(p,st){var q=rotate(p,st.yaw,st.pitch),pers=1+q[2]*.055;return [st.cx+q[0]*st.scale*pers,st.cy-q[1]*st.scale*pers,q[2]];}
function E(parent,tag,a){return S.el(tag,a,parent);}
function path(A){return 'M'+A.map(function(p){return n(p[0])+','+n(p[1]);}).join(' L')+' Z';}
function linePath(A){return 'M'+A.map(function(p){return n(p[0])+','+n(p[1]);}).join(' L');}
function hatch(sv){var defs=sv.querySelector('defs')||E(sv,'defs',{});var g=E(defs,'linearGradient',{id:'f13-shine',x1:'4%',x2:'91%',y1:'0%',y2:'100%'});E(g,'stop',{offset:'0%','stop-color':'#ffffff','stop-opacity':'.40'});E(g,'stop',{offset:'24%','stop-color':'#bafcff','stop-opacity':'.18'});E(g,'stop',{offset:'65%','stop-color':'#0c215b','stop-opacity':'.05'});E(g,'stop',{offset:'100%','stop-color':'#000d24','stop-opacity':'.60'});
 var g2=E(defs,'radialGradient',{id:'f13-orb',cx:'30%',cy:'22%',r:'88%'});[['0%','#e7ffff','1'],['10%','#83d8fd','.98'],['28%','#3082e6','.98'],['55%','#293e93','1'],['81%','#130c4e','1'],['100%','#070e25','1']].forEach(function(q){E(g2,'stop',{offset:q[0],'stop-color':q[1],'stop-opacity':q[2]});});
 var c=E(defs,'clipPath',{id:'f13-sphere-clip'});E(c,'circle',{cx:0,cy:0,r:1});}
function polygonOutline(g,pts,role,opacity){var d=path(pts);var p=E(g,'path',{d:d,fill:'none',stroke:colors[role]||colors.cyan,'stroke-width':1.9,'stroke-linejoin':'round',opacity:opacity||.8,filter:'url(#nv-neon)'});return p;}
function meshDraw(g,st){
 var fs=mesh(st.shape),paint=[];
 if(st.shape==='cylinder'||st.shape==='cone'){
   var defs=E(g,'defs',{}),grad=E(defs,'linearGradient',{id:'f13-curved-sweep',gradientUnits:'userSpaceOnUse',x1:st.cx-st.scale*1.3,y1:st.cy,x2:st.cx+st.scale*1.3,y2:st.cy});
   [['0%','#101d55'],['19%','#1e68ad'],['40%','#317cca'],['63%','#20559b'],['83%','#162c71'],['100%','#0b153a']].forEach(function(z){E(grad,'stop',{offset:z[0],'stop-color':z[1]});});
 }
 fs.forEach(function(face,i){var N=rotate(face.normal,st.yaw,st.pitch),visible=N[2]>.02,pts=face.pts.map(function(p){return proj(p,st);}),depth=average(pts)[2];if(visible||st.xray)paint.push({face:face,pts:pts,front:visible,depth:depth,N:N,i:i});});
 paint.sort(function(a,b){return a.depth-b.depth;});
 var edgeMap={},vertexMap={};
 paint.forEach(function(v){
   var front=v.front,rr=v.face.role,col=colors[rr]||colors.cyan,brightness=Math.max(.1,Math.min(1,.34+.59*v.N[2]));
   var p=E(g,'path',{d:path(v.pts),fill:v.face.typ==='curved'?'url(#f13-curved-sweep)':col,'fill-opacity':front?(v.face.typ==='curved'?.95:.17):.035,stroke:'none',opacity:front?1:.45});
   if(front&&v.face.typ!=='curved'){E(g,'path',{d:path(v.pts),fill:'url(#f13-shine)',opacity:.53});}
   var poly=path(v.pts);
   if(front&&v.face.typ==='plane'){E(g,'path',{d:poly,fill:'none',stroke:col,'stroke-width':1.2,'stroke-opacity':.45,filter:'url(#nv-neon)'});}
   if(st.show==='faces'&&front&&v.face.typ==='plane'){E(g,'path',{d:poly,fill:col,'fill-opacity':'.13',stroke:col,'stroke-width':3,filter:'url(#nv-neon)'});}
 });
 // Unique exact endpoints from full mesh. Front-facing lines are high-visibility;
 // the back-line option is intentionally dashed, never confused with a visible edge.
 fs.forEach(function(f){for(var i=0;i<f.pts.length;i++){
   var a=f.pts[i],b=f.pts[(i+1)%f.pts.length],aa=a.map(n).join(':'),bb=b.map(n).join(':'),key=[aa,bb].sort().join('|');
   if(!edgeMap[key])edgeMap[key]={a:a,b:b,faces:[]};edgeMap[key].faces.push(f);
   vertexMap[aa]=a;
 }});
 var allEdges=Object.keys(edgeMap).map(function(k){return edgeMap[k];});
 // Smooth solids have many tessellation seams; show only their true boundary silhouettes.
 if(st.shape==='cone'||st.shape==='cylinder'){
   var isCone=st.shape==='cone';var drawn={};
   allEdges.forEach(function(e){var a=e.a,b=e.b,isRing=Math.abs(a[1]-b[1])<.001&&Math.abs(a[1]-(isCone?-1.15:1.1))<.05;
     var isBase=Math.abs(a[1]+(isCone?1.15:1.1))<.05&&Math.abs(b[1]+(isCone?1.15:1.1))<.05;
     var side=!(isBase||isRing);
     if(side&&!isCone)return;
     if(isCone&&side){var front=rotate([a[0],0,a[2]],st.yaw,st.pitch)[2]>0;var front2=rotate([b[0],0,b[2]],st.yaw,st.pitch)[2]>0;if(front===front2)return;}
     else if(!isRing&&!isBase)return;
     if(isBase||isRing){if(rotate([0,a[1]>0?1:-1,0],st.yaw,st.pitch)[2]<0&&!st.xray)return;}
     var A=proj(a,st),B=proj(b,st);E(g,'path',{d:linePath([A,B]),stroke:isRing?colors.cyan:colors.purple,'stroke-width':side?2.8:2.25,'stroke-opacity':'.9',fill:'none',filter:'url(#nv-neon)'});
   });
   // Exact projected silhouette: smooth cylinders have two outline generators,
   // cones have two sloping generators. These are real geometry outlines, not tessellation seams.
   var NN=96,lo=[],hi=[];
   for(var ii=0;ii<NN;ii++){
      var th=ii/NN*Math.PI*2,rr=1.12;
      lo.push(proj([Math.cos(th)*rr,isCone?-1.15:-1.1,Math.sin(th)*rr],st));
      if(!isCone)hi.push(proj([Math.cos(th)*rr,1.1,Math.sin(th)*rr],st));
   }
   var sorted=lo.map(function(q,i){return {p:q,index:i};}).sort(function(a,b){return a.p[0]-b.p[0];});
   var ends=[sorted[0],sorted[sorted.length-1]];
   ends.forEach(function(q){var dest=isCone?proj([0,1.36,0],st):hi[q.index];
      E(g,'path',{d:linePath([q.p,dest]),fill:'none',stroke:'#65f0ff','stroke-width':2.6,filter:'url(#nv-neon)',opacity:.88});
   });
 }else{
   allEdges.forEach(function(e){var vis=e.faces.some(function(face){return rotate(face.normal,st.yaw,st.pitch)[2]>.02;});
     if(!vis&&!st.xray)return;
     var a=proj(e.a,st),b=proj(e.b,st),role=st.show==='edges'?'gold':'cyan';
     E(g,'path',{d:linePath([a,b]),fill:'none',stroke:vis?colors[role]:colors.purple,'stroke-width':vis?3:1.2,'stroke-dasharray':vis?'':'5 6',opacity:vis?'.89':'.38',filter:vis?'url(#nv-neon)':''});
     if(vis)E(g,'path',{d:linePath([a,b]),fill:'none',stroke:'#fff','stroke-width':.68,opacity:.73});
   });
   if(st.show==='vertices'||st.show==='all'){
     Object.keys(vertexMap).forEach(function(k){var a=vertexMap[k],q=proj(a,st),vis=fs.filter(function(f){return f.pts.some(function(z){return z.join('~')===a.join('~');});}).some(function(f){return rotate(f.normal,st.yaw,st.pitch)[2]>.02;});
       if(!vis&&!st.xray)return;
       NOVA.neonRing(g,q[0],q[1],{role:st.show==='vertices'?'focus':'result',r:st.show==='vertices'?5:2.5,pulse:false});
     });
   }
 }
}
function sphereDraw(g,st){var R=st.scale*1.51,cx=st.cx,cy=st.cy;var orb=E(g,'g',{transform:'translate('+cx+','+cy+')'});
 E(orb,'circle',{r:R+7,fill:'none',stroke:'#8b6bf1','stroke-width':11,opacity:.17,filter:'url(#nv-neon-soft)'});
 E(orb,'circle',{r:R,fill:'url(#f13-orb)',stroke:'#47dfff','stroke-width':3.1,filter:'url(#nv-neon)'});
 var lineG=E(orb,'g',{opacity:st.show==='faces'?.6:.33});
 for(var j=-2;j<=2;j++){var t=j*Math.PI/6,ry=R*Math.cos(t),yy=R*Math.sin(t);
  E(lineG,'ellipse',{cx:0,cy:yy,rx:Math.max(2,ry),ry:Math.max(1,ry*.19),fill:'none',stroke:'#c2f5ff','stroke-width':1.4,'stroke-dasharray':'5 8'});}
 for(var k=0;k<4;k++)E(lineG,'ellipse',{cx:0,cy:0,rx:Math.max(4,R*Math.abs(Math.cos(st.yaw+k*Math.PI/4))),ry:R,fill:'none',stroke:'#bcddff','stroke-width':1.15,transform:'rotate('+n((st.yaw+k)*7)+')'});
 E(orb,'ellipse',{cx:-R*.37,cy:-R*.43,rx:R*.25,ry:R*.12,fill:'#e8ffff',opacity:.36,transform:'rotate(-30)'});
 E(orb,'circle',{r:R+1,fill:'none',stroke:'#e7ffff','stroke-width':.8,opacity:.77});
}
function backing(sv,st){var w=st.W,H=st.H,mid=st.cy;
 var gg=E(sv,'g',{'aria-hidden':'true',class:'f13-back'});
 E(gg,'ellipse',{cx:st.cx,cy:st.cy+st.scale*1.45,rx:st.scale*1.68,ry:st.scale*.29,fill:'#0b8bdc',opacity:.10,filter:'url(#nv-neon-soft)'});
 for(var i=0;i<7;i++){var y=mid+145+i*11;E(gg,'path',{d:'M'+n(st.cx-220+i*11)+','+n(y)+' L'+n(st.cx+220-i*11)+','+n(y),stroke:'#258eac','stroke-width':.65,opacity:.13,fill:'none'});}
 for(var j=-5;j<=5;j++)E(gg,'line',{x1:st.cx,y1:mid+115,x2:st.cx+j*39,y2:mid+230,stroke:'#2288be',opacity:.105,'stroke-width':.65});
 E(gg,'ellipse',{cx:st.cx,cy:mid,rx:st.scale*1.70,ry:st.scale*1.74,fill:'none',stroke:'#35bfdc','stroke-dasharray':'2 13','stroke-width':1.1,opacity:.19});
 ['-','+'].forEach(function(c,i){var x=st.cx+(i===0?-1:1)*st.scale*1.8;E(gg,'path',{d:'M'+(x-7)+','+mid+'h14 M'+x+','+(mid-7)+'v14',stroke:'#68cce7','stroke-width':1,opacity:.32});});
}
function label(sv,x,y,text,role,size){return NOVA.chalkText(sv,x,y,text,{size:size||16,role:role||'op',anchor:'middle'});}
function buttonSvg(sv,x,y,txt,role){return S.pill(sv,x,y,txt,{role:role||'op',size:14});}
function facts(stage,st){
if(window.NovaLessonComponent?.active){[stage,st]=window.NovaLessonComponent.args("facts",arguments);}
var D=DATA[st.shape],curved=st.shape==='sphere'||st.shape==='cylinder'||st.shape==='cone',faceWord=curved?'surfaces':'faces',items=st.show==='none'?[['SOLID',D.name,'given']]:st.show==='faces'?[[curved?'SURFACES':'FACES',D.faces,'op'],['SOLID',D.name,'given']]:st.show==='edges'?[['EDGES',D.edges,'focus'],['SOLID',D.name,'given']]:st.show==='vertices'?[['VERTICES',D.vertices,'result'],['SOLID',D.name,'given']]:[[faceWord,D.faces,'op'],['edges',D.edges,'focus'],['vertices',D.vertices,'result']];
 F.strip(stage,items);
}
function mainDrawing(stage,st,interact){
if(window.NovaLessonComponent?.active){[stage,st,interact]=window.NovaLessonComponent.args("mainDrawing",arguments);}
var small=window.innerWidth<=580,W=small?420:760,H=small?510:465,sc=small?113:116;
 st.W=W;st.H=H;st.cx=W/2;st.cy=small?245:226;st.scale=sc;
 var sv=S.root(W,H,'Interactive '+DATA[st.shape].name+'. '+DATA[st.shape].faces+' faces or surfaces, '+DATA[st.shape].edges+' edges and '+DATA[st.shape].vertices+' vertices. Rotate with pointer or arrow keys.');sv.classList.add('f13-svg');sv.style.maxWidth='810px';sv.setAttribute('tabindex','0');sv.setAttribute('role','group');sv.setAttribute('aria-label','3D solid. Drag to turn. Arrow keys turn left, right, up, down.');sv.style.touchAction='none';hatch(sv);backing(sv,st);
 var geo=E(sv,'g',{class:'f13-geo','data-maths':'solid'});
 function repaint(){geo.replaceChildren();if(st.shape==='sphere')sphereDraw(geo,st);else meshDraw(geo,st);}
 repaint();
 var w2=W/2;
 buttonSvg(sv,w2,38,DATA[st.shape].name,'focus');
 if(!small){label(sv,105,124,'3-D SHAPE','given',18);label(sv,650,124,'TURN TO','given',18);label(sv,650,154,'EXPLORE','given',18);}
 else{label(sv,w2,74,'ROTATE · COUNT · DISCOVER','given',18);}
 label(sv,w2,small?463:431,st.shape==='sphere'?'A continuous curved surface':DATA[st.shape].unit,'given',small?18:17);
 // Precision pointer capture. No stage or SVG recreation on move; only geometry layer is repainted.
 if(interact){var active=-1,px=0,py=0,pending=false;
   function drawSoon(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;repaint();});}
   sv.addEventListener('pointerdown',function(e){if(e.button!==0&&e.pointerType!=='touch')return;if(e.target.closest&&e.target.closest('button'))return;active=e.pointerId;px=e.clientX;py=e.clientY;sv.setPointerCapture(e.pointerId);sv.classList.add('f13-grabbing');e.preventDefault();});
   sv.addEventListener('pointermove',function(e){if(active!==e.pointerId)return;var dx=e.clientX-px,dy=e.clientY-py;px=e.clientX;py=e.clientY;st.yaw+=dx*.012;st.pitch=NOVA.clamp(st.pitch-dy*.007,-.82,.88);drawSoon();});
   function end(e){if(active===e.pointerId){active=-1;sv.classList.remove('f13-grabbing');NOVA.events.emit('value',{engine:EN,control:'rotation',value:[n(st.yaw),n(st.pitch)]});}}
   sv.addEventListener('pointerup',end);sv.addEventListener('pointercancel',end);sv.addEventListener('lostpointercapture',function(){active=-1;sv.classList.remove('f13-grabbing');});
   sv.addEventListener('keydown',function(e){var d={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,.12],ArrowDown:[0,-.12]}[e.key];if(!d)return;e.preventDefault();st.yaw+=d[0];st.pitch=NOVA.clamp(st.pitch+d[1],-.82,.88);repaint();NOVA.events.emit('value',{engine:EN,control:'keyboardRotate',value:[n(st.yaw),n(st.pitch)]});});
   sv.f13Refresh=repaint;
 }
 stage.appendChild(sv);return sv;
}
function mountStage(stage,st,caption,pose,interactive){
if(window.NovaLessonComponent?.active){[stage,st,caption,pose,interactive]=window.NovaLessonComponent.args("mountStage",arguments);}
stage.innerHTML='';NOVA.cap(stage,'3-D viewer · '+DATA[st.shape].name,interactive?'drag to rotate':'shape explorer');var sv=mainDrawing(stage,st,interactive);facts(stage,st);NOVA.scene.helperStrip(stage,pose||'explain',caption||DATA[st.shape].phrase);return sv;}
var def={id:EN,title:'3D solid viewer',config:C,steps:STEPS,alt:'Interactive premium 3D viewer. Rotate solids to study faces, edges and vertices.',
 staticAlt:'Cube: 6 faces, 12 edges, 8 vertices. Cuboid: 6, 12, 8. Triangular prism: 5, 9, 6. Square pyramid: 5, 8, 5. Cylinder: 3 surfaces, 2 circular edges, 0 vertices. Cone: 2 surfaces, 1 circular edge, 1 vertex. Sphere: 1 continuous curved surface, 0 edges, 0 vertices.',
 render:function(i,stage){var z=STEPS[i],st={shape:z.solid,yaw:z.yaw,pitch:z.pitch,show:z.show,xray:false};mountStage(stage,st,z.name,i===6?'cheer':'explain',false);},
 exploreIntro:'Rotate the shape with your mouse or finger. Select a different solid, then highlight its faces, edges or vertices.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",()=>({shape:C.preset,yaw:-.68,pitch:.43,show:C.show||'all',xray:C.xray})):({shape:C.preset,yaw:-.68,pitch:.43,show:C.show||'all',xray:C.xray})),sv;
  window.NovaLessonComponent?.applyExploreModels();function paint(){sv=mountStage(stage,st,DATA[st.shape].phrase,'explain',true);}
  window.NovaLessonComponent?.applyExploreModels();var pick=h('select',{class:'nova-input','aria-label':'Choose a 3D solid'});window.NovaLessonComponent?.applyExploreModels();Object.keys(DATA).forEach(function(k){pick.appendChild(h('option',{value:k,text:DATA[k].name}));});window.NovaLessonComponent?.applyExploreModels();pick.value=st.shape;
  window.NovaLessonComponent?.applyExploreModels();pick.onchange=function(){st.shape=pick.value;C.preset=st.shape;paint();NOVA.events.emit('value',{engine:EN,control:'solid',value:st.shape});};
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row f13-panel-row'},[h('label',{},['SOLID ',pick])]));
  window.NovaLessonComponent?.applyExploreModels();var choices=h('div',{class:'pr-row',role:'group','aria-label':'What to highlight'});window.NovaLessonComponent?.applyExploreModels();['all','faces','edges','vertices'].forEach(function(k){var b=h('button',{class:'nova-btn'+(k===st.show?' primary':''),text:k[0].toUpperCase()+k.slice(1),onclick:function(){st.show=k;choices.querySelectorAll('button').forEach(function(v){v.classList.remove('primary');});b.classList.add('primary');paint();}});choices.appendChild(b);});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(choices);
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[h('button',{class:'nova-btn ghost',text:'Show hidden edges',onclick:function(){st.xray=!st.xray;this.setAttribute('aria-pressed',String(st.xray));this.textContent=st.xray?'Hide rear edges':'Show hidden edges';paint();},'aria-pressed':'false'}),h('button',{class:'nova-btn ghost',text:'Reset view',onclick:function(){st.yaw=-.68;st.pitch=.43;paint();}})]));
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('p',{class:'f13-teach-note',text:'Drag the shape to turn it, or focus the drawing and use the arrow keys. For cylinders and cones, curved circular edges count as edges.'}));
  window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();C._explore={load:function(key){st.shape=key;pick.value=key;paint();},get:function(){return {shape:st.shape,yaw:st.yaw,pitch:st.pitch};}};
 },
 challenge:function(panel,api,stage){var tasks=[
   {q:'A cube has six square faces. How many EDGES does it have?',solid:'cube',focus:'edges',list:[{label:'8',value:8},{label:'10',value:10},{label:'12',value:12},{label:'14',value:14}],answer:12,hint:'Count four edges around the top, four around the bottom, and four connecting them.',wrong:function(x){return x===8?'Eight counts the vertices (corners), not the edges.':'Trace the top, bottom and upright edges.';}},
   {q:'How many VERTICES does a triangular prism have?',solid:'triPrism',focus:'vertices',list:[{label:'5',value:5},{label:'6',value:6},{label:'8',value:8},{label:'9',value:9}],answer:6,hint:'There are three corners on each triangular end.',wrong:function(x){return x===9?'Nine is the number of edges. You need corners.':'Three corners at the front and three at the back.';}},
   {q:'How many FACES does a square-based pyramid have, counting its base?',solid:'pyramid',focus:'faces',list:[{label:'4',value:4},{label:'5',value:5},{label:'6',value:6},{label:'8',value:8}],answer:5,hint:'Remember the hidden square base as well as the triangles.',wrong:function(x){return x===4?'Four counts the triangular sides. Do not forget the square base.':'Count all four triangular faces AND the square base.';}}
  ];
  var mapped=tasks.map(function(t){return {q:t.q,build:NOVA.choiceTask(t.list,EN),check:function(x){var ok=x===t.answer;return [ok,ok?'Correct. '+DATA[t.solid].desc:t.wrong(x)];},hint:t.hint,solve:function(ctl){ctl._G.set(t.answer);}};});
  NOVA.challengeRun(panel,api,mapped,function(k){var t=tasks[k],st={shape:t.solid,yaw:-.68,pitch:.41,show:t.focus,xray:false};mountStage(stage,st,'Look closely; turn the solid and count.','think',true);},C);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(EN,def,{models:{},tables:{"DATA":()=>DATA,"STEPS":()=>STEPS},draws:{"facts":["stage","st"],"mainDrawing":["stage","st","interact"],"mountStage":["stage","st","caption","pose","interactive"]},exploreFields:{"st":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:EN,num:'F13·01',title:'3D solid viewer',def:def,linked:['F0-01','F0-02','F0-03','F0-04','F0-05','F1-01','F12-01'],
 spec:{purpose:'Rotatable premium 3D solid with real polyhedral faces and edges for pupils to count faces, edges and vertices. Compare cubes, cuboids, triangular prisms, pyramids, cylinders, cones and spheres.',
 params:'Solid type; yaw and elevation; face / edge / vertex focus; hidden-edge mode. All scene drawing uses the existing NOVA F0 SVG primitives and the geometry palette.',
 presets:'Cube · Cuboid · Triangular prism · Square-based pyramid · Cylinder · Cone · Sphere',
 steps:STEPS.map(function(s){return s.name;}).join(' → ')+'. Each step updates the visual and NOVA helper pose, and includes a Bob explanation and Guided prompt.',
 interactions:'Watch timeline, Guided prompts, Explore shape selector with mouse/touch drag and keyboard arrow rotation, focus highlights and hidden-edge reveal. Challenge counts faces, edges and vertices and explains common errors.',
 traps:'Counting the eight corners as edges · missing hidden faces · forgetting a pyramid base · confusing curved surfaces with flat faces · counting a curved circular edge as a straight edge.',
 gcse:'Euler relation for convex polyhedra (V − E + F = 2); surface area and volume follow-ups in F13-07 to F13-10.'}});
var log=document.getElementById('log'),addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

