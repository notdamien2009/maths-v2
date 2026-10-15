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


/* F13-02 · NET FOLDER. Uses the unchanged, user-approved NOVA F0/F1/F12 core. */
var NOVA_F13_02_CONFIG={startMode:'watch',preset:'cube',fold:0,
 presets:{cube:'Cube',cuboid:'Cuboid',prism:'Triangular prism',pyramid:'Square-based pyramid'}};
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F13_02_CONFIG),EN='F13-02';
var INFO={cube:{name:'Cube',faces:6,edges:12,vertices:8,hinges:5,desc:'Six equal squares can close into six faces.',hint:'All six squares remain joined by five folding hinges.'},
 cuboid:{name:'Cuboid',faces:6,edges:12,vertices:8,hinges:5,desc:'Three matching pairs of rectangles fold into a cuboid.',hint:'Opposite faces have equal dimensions.'},
 prism:{name:'Triangular prism',faces:5,edges:9,vertices:6,hinges:4,desc:'Two triangular ends and three rectangular faces form a prism.',hint:'Three rectangles wrap round the triangular cross-section.'},
 pyramid:{name:'Square-based pyramid',faces:5,edges:8,vertices:5,hinges:4,desc:'Four triangular faces rise from a square base to one apex.',hint:'Four triangles share the square base.'}};
var STEPS=[
 {name:'Discover the flat net',shape:'cube',fold:0,focus:'all',pose:'explain',narration:'A cube begins as six equal flat squares, linked together. This arrangement is called a net.',prompt:'How many squares can you count?'},
 {name:'Find the hinges',shape:'cube',fold:.02,focus:'hinges',pose:'point-right',narration:'The five coloured joins are fold lines. The faces turn around these hinges; they do not stretch.',prompt:'How many joins hold six squares together?'},
 {name:'Lift the side walls',shape:'cube',fold:.38,focus:'side',pose:'explain',narration:'Now the four walls begin to stand up. Follow the moving edges as they rise.',prompt:'Which faces are lifting around the base?'},
 {name:'Bring the corners together',shape:'cube',fold:.72,focus:'edges',pose:'think',narration:'As the walls approach one another, their free edges line up. They must meet without overlapping.',prompt:'What will happen to the free edges?'},
 {name:'Close the cube',shape:'cube',fold:1,focus:'all',pose:'celebrate',narration:'The last face closes the cube. Its six square faces now form one three-dimensional solid.',prompt:'How many faces does the completed cube have?'},
 {name:'Change to a cuboid',shape:'cuboid',fold:.62,focus:'all',pose:'explain',narration:'This cuboid uses different rectangles, but matching opposite faces still meet.',prompt:'Which two faces have the same size?'},
 {name:'Fold a prism',shape:'prism',fold:.8,focus:'all',pose:'point-right',narration:'The triangular prism has three rectangular sides and two triangular ends. Watch both ends close.',prompt:'How many triangles are in its net?'},
 {name:'Build a pyramid',shape:'pyramid',fold:1,focus:'all',pose:'celebrate',narration:'Four triangles fold towards a single point above the square base, making a pyramid.',prompt:'Why does this solid have five faces?'}
];
var palette=['#2bdcf3','#967dff','#ffb566','#52e9a8','#ffda75','#4b9eff'];
function num(x){return Math.round(x*100)/100;}
function vec(x,y,z){return [x,y,z||0];}
function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function mul(a,t){return [a[0]*t,a[1]*t,a[2]*t];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function mid(pts){return mul(pts.reduce(add,[0,0,0]),1/pts.length);}
function rect(x,y,X,Y){return [[x,y],[X,y],[X,Y],[x,Y]];}
function face(id,poly,parent,a,b,degrees){return {id:id,poly:poly,parent:parent===undefined?-1:parent,a:a||null,b:b||null,degrees:degrees||90};}
function boxNet(a,b,z,variant){var x=-a/2,X=a/2,y=-b/2,Y=b/2,fs=[
 face('BASE',rect(x,y,X,Y)),
 face('NORTH',rect(x,y-z,X,y),0,[x,y],[X,y]),
 face('SOUTH',rect(x,Y,X,Y+z),0,[x,Y],[X,Y]),
 face('WEST',rect(x-z,y,x,Y),0,[x,y],[x,Y]),
 face('EAST',rect(X,y,X+z,Y),0,[X,y],[X,Y])];
 if(variant==='side')fs.push(face('LID',rect(X+z,y,X+z+a,Y),4,[X+z,y],[X+z,Y]));
 else fs.push(face('LID',rect(x,y-z-b,X,y-z),1,[x,y-z],[X,y-z]));
 return fs;}
function makeNet(shape,variant){
 if(shape==='cube')return boxNet(2,2,2,variant==='side'?'side':'cross');
 if(shape==='cuboid')return boxNet(3,2,1,'cross');
 if(shape==='prism'){
   var L=2.62,s=1.74,x=-L/2,X=L/2,y=-s/2,Y=s/2,A=s*Math.sqrt(3)/2;
   return [face('RECTANGLE A',rect(x,y,X,Y)),face('RECTANGLE B',rect(x,y-s,X,y),0,[x,y],[X,y],120),face('RECTANGLE C',rect(x,y-2*s,X,y-s),1,[x,y-s],[X,y-s],120),face('TRIANGLE L',[[x,y],[x,Y],[x-A,0]],0,[x,y],[x,Y],90),face('TRIANGLE R',[[X,y],[X,Y],[X+A,0]],0,[X,y],[X,Y],90)];
 }
 var sl=Math.sqrt(3.25),angle=Math.acos(-1/sl)*180/Math.PI;
 return [face('SQUARE BASE',rect(-1,-1,1,1)),face('NORTH',[[-1,-1],[1,-1],[0,-1-sl]],0,[-1,-1],[1,-1],angle),face('SOUTH',[[-1,1],[1,1],[0,1+sl]],0,[-1,1],[1,1],angle),face('WEST',[[-1,-1],[-1,1],[-1-sl,0]],0,[-1,-1],[-1,1],angle),face('EAST',[[1,-1],[1,1],[1+sl,0]],0,[1,-1],[1,1],angle)];
}
function spin(p,a,b,angle){var v=sub(b,a),len=Math.hypot(v[0],v[1],v[2])||1,u=mul(v,1/len),q=sub(p,a),ca=Math.cos(angle),sa=Math.sin(angle);return add(a,add(add(mul(q,ca),mul(cross(u,q),sa)),mul(u,dot(u,q)*(1-ca))));}
function foldedFaces(shape,progress,variant){var fs=makeNet(shape,variant),cache={};
 function apply(p,i){if(i<0)return p;var f=fs[i];if(f.parent<0)return p;var pc=mid(fs[f.parent].poly.map(function(q){return vec(q[0],q[1]);})),fc=mid(f.poly.map(function(q){return vec(q[0],q[1]);})),dx=f.b[0]-f.a[0],dy=f.b[1]-f.a[1];var side=Math.sign(dx*(fc[1]-pc[1])-dy*(fc[0]-pc[0]))||1;return apply(spin(p,vec(f.a[0],f.a[1]),vec(f.b[0],f.b[1]),side*f.degrees*Math.PI/180*progress),f.parent);}
 return fs.map(function(f,i){var pts=f.poly.map(function(p){return apply(vec(p[0],p[1]),i);}),cent=mid(pts);return {id:f.id,pts:pts,center:cent,parent:f.parent,hinge:f.parent<0?null:[apply(vec(f.a[0],f.a[1]),f.parent),apply(vec(f.b[0],f.b[1]),f.parent)],source:i};});
}
function camera(p,st){
 // The net starts as a face-on 2-D plan. As it folds, the camera gently tilts
 // into a real isometric view with the solid's z-axis pointing UP on the page.
 var blend=Math.min(1,st.fold*2.4),ca=Math.cos(st.yaw),sa=Math.sin(st.yaw),co=Math.cos(st.pitch),si=Math.sin(st.pitch);
 var u=p[0]*ca-p[1]*sa,v=p[0]*sa+p[1]*ca;
 return [p[0]*(1-blend)+u*blend,
         p[1]*(1-blend)+(p[2]*co+v*si)*blend,
         (p[2]*si-v*co)*blend];
}
function calcFrame(fs,st,W,H){var front=fs.map(function(f){return {f:f,pts:f.pts.map(function(p){return camera(p,st);}),center:camera(f.center,st)};});var all=front.reduce(function(a,f){return a.concat(f.pts);},[]),xs=all.map(function(x){return x[0];}),ys=all.map(function(x){return x[1];}),minx=Math.min.apply(null,xs),maxx=Math.max.apply(null,xs),miny=Math.min.apply(null,ys),maxy=Math.max.apply(null,ys),ww=Math.max(.1,maxx-minx),hh=Math.max(.1,maxy-miny),small=W<500;
 var scale=Math.min((small?360:640)/ww,(small?355:355)/hh,small?155:148),cx=(minx+maxx)/2,cy=(miny+maxy)/2;var centreX=W/2,centreY=small?252:224;
 function at(p){return [centreX+(p[0]-cx)*scale,centreY-(p[1]-cy)*scale,p[2]];}
 var global=mul(front.reduce(function(a,f){return add(a,f.center);},[0,0,0]),1/front.length);
 front.forEach(function(e){e.ps=e.pts.map(at);e.centre=at(e.center);var nor=cross(sub(e.pts[1],e.pts[0]),sub(e.pts[2],e.pts[0]));var out=dot(nor,sub(e.center,global))>=0?1:-1;e.visible=nor[2]*out>=-.005;});
 return {faces:front,at:at,scale:scale,centerX:centreX,centerY:centreY};
}
function svgE(par,tag,attrs){return S.el(tag,attrs,par);}
function polygon(pts){return 'M'+pts.map(function(p){return num(p[0])+','+num(p[1]);}).join(' L')+' Z';}
function fnText(g,x,y,t,role,size){return NOVA.chalkText(g,x,y,t,{size:size||17,role:role||'op',anchor:'middle'});}
function defs(sv){var d=sv.querySelector('defs')||svgE(sv,'defs',{});
 var roles=[['cyan','#bafcff','#16457b'],['purple','#ddd0ff','#30246b'],['gold','#ffe6b1','#6d3e24'],['green','#cbffed','#174d56'],['yellow','#fff1b3','#625037'],['blue','#d1e5ff','#172e72']];
 roles.forEach(function(col,i){var g=svgE(d,'linearGradient',{id:'f13n-'+i,x1:'10%',x2:'90%',y1:'5%',y2:'100%'});svgE(g,'stop',{offset:'0%','stop-color':col[1],'stop-opacity':.73});svgE(g,'stop',{offset:'16%','stop-color':palette[i],'stop-opacity':.42});svgE(g,'stop',{offset:'78%','stop-color':col[2],'stop-opacity':.85});svgE(g,'stop',{offset:'100%','stop-color':'#070e28','stop-opacity':.86});});
 var halo=svgE(d,'radialGradient',{id:'f13n-stage',cx:'50%',cy:'50%',r:'54%'});svgE(halo,'stop',{offset:'0%','stop-color':'#2bbdf3','stop-opacity':'.21'});svgE(halo,'stop',{offset:'100%','stop-color':'#2bbdf3','stop-opacity':0});
}
function background(sv,W,H){svgE(sv,'ellipse',{cx:W/2,cy:H*.53,rx:W*.43,ry:H*.42,fill:'url(#f13n-stage)',opacity:.95});
 var g=svgE(sv,'g',{opacity:.28});for(var i=0;i<8;i++){var y=H*.83+i*9;svgE(g,'path',{d:'M'+(W*.12-i*5)+','+y+' Q'+(W/2)+','+(y+12)+' '+(W*.88+i*5)+','+y,stroke:i===0?'#2188a6':'#23536e','stroke-width':i===0?1.4:.75,fill:'none'});}for(var j=-6;j<=6;j++){svgE(g,'path',{d:'M'+(W/2+j*24)+','+(H*.89)+' L'+(W/2+j*8)+','+(H*.80),fill:'none',stroke:'#23779c','stroke-width':.7});}
 for(var k=0;k<2;k++){var xx=(k?W*.91:W*.09),yy=H*.45;svgE(g,'path',{d:'M'+(xx-8)+','+yy+'h16 M'+xx+','+(yy-8)+'v16',stroke:'#58d3f8','stroke-width':1.1,opacity:.8});}
}
function renderFaces(root,st,W,H){root.replaceChildren();background(root,W,H);
 var original=foldedFaces(st.shape,st.fold,st.variant),fr=calcFrame(original,st,W,H),parts=fr.faces,nearly=st.fold>.94;
 var geo=svgE(root,'g',{class:'f13-net-geometry','data-maths':'hinged-net'}),parent=svgE(geo,'g',{class:'f13-net-faces'});
 parts.sort(function(a,b){return a.centre[2]-b.centre[2];});
 parts.forEach(function(e){if(nearly&&!e.visible)return;
 var f=e.f,i=f.source,isMissing=st.detached&&st.shape==='cube'&&st.fold<.05&&f.id==='LID',c=palette[i%palette.length],pts=e.ps;
 if(isMissing)return;
 var active=st.focus==='all'||(st.focus==='side'&&i>0)||(st.focus==='base'&&i===0)||(st.focus==='edges'&&i>0)||(st.focus==='hinges'&&f.parent>=0);
 var opa=st.focus==='all'?1:active?1:.45;
 var gr=svgE(parent,'g',{'data-face':f.id,'data-face-number':i+1,opacity:opa});
 svgE(gr,'path',{d:polygon(pts),fill:'url(#f13n-'+(i%6)+')',stroke:c,'stroke-width':st.selected===f.id?4.4:2.6,'stroke-linejoin':'round',opacity:nearby(nearly,st,i)?'.95':'.87',filter:'url(#nv-neon-soft)'});
 svgE(gr,'path',{d:polygon(pts),fill:'none',stroke:c,'stroke-width':1.5,'stroke-linejoin':'round',opacity:.96});
 if(st.selected===f.id){svgE(gr,'path',{d:polygon(pts),fill:'none',stroke:'#fff6d8','stroke-width':3.6,opacity:.75,filter:'url(#nv-glow)'});}
 if(st.fold<.57&&st.showNumbers){var label=e.centre;fnText(gr,label[0],label[1]+6,String(i+1),'given',st.fold<.12?21:18);}
 if(st.focus==='hinges'&&f.hinge){var a=fr.at(camera(f.hinge[0],st)),b=fr.at(camera(f.hinge[1],st));svgE(gr,'path',{d:'M'+num(a[0])+','+num(a[1])+' L'+num(b[0])+','+num(b[1]),stroke:'#ffe58c','stroke-width':5.3,'stroke-linecap':'round',filter:'url(#nv-glow)'});}
 });
 // Detached cube lid plus ghost hinge target are projected in a reserved part of the same scene.
 if(st.detached&&st.shape==='cube'&&st.fold<.05){var ghost=parts.filter(function(f){return f.f.id==='LID';})[0];if(ghost){var c=ghost.centre,xx=fr.centerX>210?W*.77:W*.75,yy=H*.22;st.target=[c[0],c[1]];st.tray=[xx,yy];
 svgE(geo,'path',{d:polygon(ghost.ps),fill:'#34efa914',stroke:'#64ffba','stroke-width':3.3,'stroke-dasharray':'10 6','stroke-linejoin':'round',filter:'url(#nv-glow)'});
 fnText(geo,c[0],c[1]+6,'SNAP HERE','result',13);
 var tilePts=ghost.ps.map(function(p){return [p[0]-c[0]+xx,p[1]-c[1]+yy,p[2]];});var drag=svgE(geo,'g',{'data-face-drag':'lid',tabindex:'0',role:'button','aria-label':'Detached square. Drag onto the green target or press Enter to snap.','class':'f13-loose-face'});
 svgE(drag,'path',{d:polygon(tilePts),fill:'url(#f13n-4)',stroke:'#ffcc58','stroke-width':3.2,filter:'url(#nv-neon-soft)'});
 fnText(drag,xx,yy+6,'6','given',23);
 svgE(geo,'rect',{x:xx-65,y:yy-65,width:130,height:130,fill:'transparent','data-drag-hit':'lid','pointer-events':'all'});
 fnText(geo,xx,Math.min(H-24,yy+94),'LOOSE FACE','focus',15);
 } }
}
function nearby(closed,st,i){return closed&&i===0;}
function counts(stage,st){
if(window.NovaLessonComponent?.active){[stage,st]=window.NovaLessonComponent.args("counts",arguments);}
var x=INFO[st.shape];F.strip(stage,st.focus==='hinges'?[['faces',String(x.faces),'given'],['HINGES',String(x.hinges),'focus'],['net','fold lines','op']]:[['faces',String(x.faces),'given'],['HINGES',String(x.hinges),'focus'],['fold',Math.round(st.fold*100)+'%','result']]);}
function scene(stage,st,caption,pose,interact){
if(window.NovaLessonComponent?.active){[stage,st,caption,pose,interact]=window.NovaLessonComponent.args("scene",arguments);}
if(stage._f13Cleanup)stage._f13Cleanup();stage.replaceChildren();NOVA.cap(stage,'NET FOLDER · '+INFO[st.shape].name,st.fold>.99?'folded solid':st.fold<.01?'flat net':Math.round(st.fold*100)+'% folded');var mobile=window.innerWidth<=580,W=mobile?420:760,H=mobile?510:465;
 var sv=S.root(W,H,'Net folder for '+INFO[st.shape].name+'. Fold '+Math.round(st.fold*100)+' percent. Drag to rotate, arrow keys to rotate.');sv.classList.add('f13-net-svg');sv.setAttribute('tabindex','0');sv.setAttribute('role','group');sv.style.touchAction='none';defs(sv);var layer=svgE(sv,'g',{'data-net-root':'true'});stage.appendChild(sv);
 var press=-1,sx=0,sy=0,dragFace=null,active=false,offX=0,offY=0;
 function paint(){renderFaces(layer,st,W,H);}
 paint();
 if(interact){
  var abortEvents=new AbortController();stage._f13Cleanup=function(){abortEvents.abort();};
  function updateSoon(){if(active)return;active=true;requestAnimationFrame(function(){active=false;paint();});}
  function resetGrab(){press=-1;dragFace=null;offX=offY=0;sv.classList.remove('f13-grabbing');}
  sv.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;press=e.pointerId;sx=e.clientX;sy=e.clientY;dragFace=!!(e.target.closest&&e.target.closest('[data-face-drag="lid"],[data-drag-hit="lid"]'));sv.setPointerCapture(e.pointerId);sv.classList.add('f13-grabbing');e.preventDefault();});
  sv.addEventListener('pointermove',function(e){if(e.pointerId!==press)return;var dx=e.clientX-sx,dy=e.clientY-sy;sx=e.clientX;sy=e.clientY;
   if(dragFace){offX+=dx;offY+=dy;var g=layer.querySelector('[data-face-drag]');if(g){g.style.transform='translate('+num(offX)+'px,'+num(offY)+'px)';g.style.filter='drop-shadow(0 0 8px #55efae)';}return;}
   if(st.fold>.05){st.yaw+=dx*.012;st.pitch=NOVA.clamp(st.pitch-dy*.007,-.82,1.1);updateSoon();}
  });
  function finish(e,cancel){if(e.pointerId!==press)return;if(dragFace&&!cancel){var rect=sv.getBoundingClientRect(),k=W/rect.width,m=H/rect.height,dx=offX*k,dy=offY*m,rx=(st.tray[0]+dx)-st.target[0],ry=(st.tray[1]+dy)-st.target[1];if(Math.hypot(rx,ry)<Math.max(64,W*.13)){st.detached=false;st.selected='LID';NOVA.events.emit('value',{engine:EN,control:'attached',value:true});if(st.onAttached)st.onAttached();}else {NOVA.events.emit('value',{engine:EN,control:'attachMiss',value:true});if(st.onMiss)st.onMiss();}}resetGrab();paint();}
  sv.addEventListener('pointerup',function(e){finish(e,false);});sv.addEventListener('pointercancel',function(e){finish(e,true);});sv.addEventListener('lostpointercapture',function(){if(press>=0){resetGrab();paint();}});
  sv.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){if(st.detached){e.preventDefault();st.detached=false;st.selected='LID';paint();if(st.onAttached)st.onAttached();}return;}var key={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,.12],ArrowDown:[0,-.12]}[e.key];if(key){e.preventDefault();st.yaw+=key[0];st.pitch=NOVA.clamp(st.pitch+key[1],-.82,1.1);paint();NOVA.events.emit('value',{engine:EN,control:'keyboardRotation',value:[num(st.yaw),num(st.pitch)]});}else if(e.key==='Escape'){resetGrab();paint();}});
  window.addEventListener('blur',function(){if(press>=0){resetGrab();paint();}},{signal:abortEvents.signal});
  sv.f13Refresh=paint;
 }
 counts(stage,st);NOVA.scene.helperStrip(stage,pose||'explain',caption||INFO[st.shape].hint);return sv;
}
function makeState(shape,fold,focus){return {shape:shape||'cube',fold:fold||0,focus:focus||'all',showNumbers:true,selected:'',yaw:-.65,pitch:.67,variant:'cross',detached:false};}
function animateFold(st,to,refresh,onDone){var from=st.fold,begin=performance.now(),ms=700,done=false,id=st._animId=(st._animId||0)+1;
 function tick(now){if(st.disposed||id!==st._animId)return;var t=Math.min(1,(now-begin)/ms),ease=t*t*(3-2*t);st.fold=from+(to-from)*ease;refresh();if(t<1)requestAnimationFrame(tick);else if(!done){done=true;if(onDone)onDone();}}requestAnimationFrame(tick);}
var def={id:EN,title:'Net folder',config:C,steps:STEPS,
 alt:'An interactive net folding into a three dimensional solid. Six square panels fold along the five shared hinges to form a cube.',
 staticAlt:'Cube: six squares and five hinges. Cuboid: six rectangular faces arranged in three pairs. Triangular prism: three rectangles plus two congruent triangular ends. Square-based pyramid: one square plus four triangular faces.',
 render:function(i,stage){var z=STEPS[i],st=makeState(z.shape,z.fold,z.focus);scene(stage,st,z.name,z.pose,false);},
 exploreIntro:'Open a net and fold it into a solid. Select a shape, drag the slider, rotate the view and try reattaching the loose square.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>makeState(...a),[C.preset,0,'all']):(makeState(C.preset,0,'all'))),sv;window.NovaLessonComponent?.applyExploreModels();if(typeof api.onCleanup==='function')api.onCleanup(function(){st.disposed=true;st._animId=(st._animId||0)+1;if(stage._f13Cleanup)stage._f13Cleanup();});
  window.NovaLessonComponent?.applyExploreModels();function draw(){if(st.disposed)return;sv=scene(stage,st,st.detached?'Drag the loose face onto the green hinge.':INFO[st.shape].hint,st.detached?'think':'explain',true);}
  window.NovaLessonComponent?.applyExploreModels();var selector=h('select',{class:'nova-input','aria-label':'Choose a foldable solid'});window.NovaLessonComponent?.applyExploreModels();Object.keys(INFO).forEach(function(k){selector.appendChild(h('option',{value:k,text:INFO[k].name}));});window.NovaLessonComponent?.applyExploreModels();selector.value=st.shape;
  window.NovaLessonComponent?.applyExploreModels();var layout=h('select',{class:'nova-input','aria-label':'Cube net layout'},[h('option',{value:'cross',text:'Cross net'}),h('option',{value:'side',text:'Side-hinged net'})]);window.NovaLessonComponent?.applyExploreModels();layout.value='cross';window.NovaLessonComponent?.applyExploreModels();layout.disabled=st.shape!=='cube';
  window.NovaLessonComponent?.applyExploreModels();selector.onchange=function(){st._animId=(st._animId||0)+1;st.shape=selector.value;C.preset=st.shape;st.fold=0;st.detached=false;layout.disabled=st.shape!=='cube';range.value='0';output.textContent='0%';draw();NOVA.events.emit('value',{engine:EN,control:'solid',value:st.shape});};
  window.NovaLessonComponent?.applyExploreModels();layout.onchange=function(){st.variant=layout.value;st.fold=0;range.value='0';output.textContent='0%';draw();};
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row f13-panel-row'},[h('label',{},['SOLID ',selector]),h('label',{},[' NET ',layout])]));
  window.NovaLessonComponent?.applyExploreModels();var range=h('input',{type:'range',min:'0',max:'100',value:'0',step:'1',class:'f13-fold-range','aria-label':'Fold from flat net to closed 3D solid'}),output=h('output',{class:'f13-progress',text:'0%'});
  window.NovaLessonComponent?.applyExploreModels();range.oninput=function(){st._animId=(st._animId||0)+1;st.fold=Number(range.value)/100;if(st.fold>.05)st.detached=false;output.textContent=range.value+'%';draw();NOVA.events.emit('value',{engine:EN,control:'fold',value:st.fold});};
  window.NovaLessonComponent?.applyExploreModels();var open=h('button',{class:'nova-btn',text:'Open flat',onclick:function(){st._animId=(st._animId||0)+1;st.fold=0;range.value=0;output.textContent='0%';draw();}}),close=h('button',{class:'nova-btn primary',text:'Fold into solid',onclick:function(){st.detached=false;animateFold(st,1,function(){range.value=String(Math.round(st.fold*100));output.textContent=range.value+'%';draw();});}});
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row f13-panel-row'},[h('label',{},['FOLD ',range]),output,open,close]));
  window.NovaLessonComponent?.applyExploreModels();var check=h('label',{class:'f13-number-label'},[h('input',{type:'checkbox',checked:'checked','aria-label':'Show face numbers',onchange:function(){st.showNumbers=this.checked;draw();}}),' Show face numbers']);
  window.NovaLessonComponent?.applyExploreModels();var focusBar=h('div',{class:'pr-row',role:'group','aria-label':'Net highlighting'});window.NovaLessonComponent?.applyExploreModels();['all','hinges','side','base'].forEach(function(k){var b=h('button',{class:'nova-btn'+(k==='all'?' primary':''),text:({all:'All faces',hinges:'Hinges',side:'Side faces',base:'Base face'})[k],onclick:function(){st.focus=k;focusBar.querySelectorAll('button').forEach(function(q){q.classList.remove('primary');});b.classList.add('primary');draw();}});focusBar.appendChild(b);});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(focusBar);
  window.NovaLessonComponent?.applyExploreModels();var detach=h('button',{class:'nova-btn',text:'Detach final face',onclick:function(){st.shape='cube';selector.value='cube';layout.disabled=false;st.variant='cross';layout.value='cross';st.fold=0;range.value='0';output.textContent='0%';st.detached=true;st.selected='';draw();}}),snap=h('button',{class:'nova-btn ghost',text:'Snap face to hinge',onclick:function(){st.detached=false;st.selected='LID';draw();}}),reset=h('button',{class:'nova-btn ghost',text:'Reset orientation',onclick:function(){st.yaw=-.65;st.pitch=.67;draw();}});
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[check,detach,snap,reset]));
  window.NovaLessonComponent?.applyExploreModels();st.onAttached=function(){api.check(true,'The loose face snapped precisely to its joining edge.',{interaction:'attach'});};
  window.NovaLessonComponent?.applyExploreModels();st.onMiss=function(){api.hint('Move the loose face to the green target; it springs back if you miss.');};
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('p',{class:'f13-teach-note',text:'The flat panels rotate around shared edges. Drag to rotate a partly folded solid or use the arrow keys while the drawing has focus. On the cube, detach the last square and snap it back to the green target.'}));
  window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();C._explore={state:st,load:function(k){selector.value=k;selector.onchange();},foldTo:function(x){range.value=String(Math.round(x*100));range.oninput();},detach:function(){detach.click();}};
 },
 challenge:function(panel,api,stage){var tasks=[
   {shape:'cube',fold:0,focus:'all',q:'Which arrangement can fold to make a cube with NO overlapping faces?',answer:'cross',hint:'All six squares must meet at different faces, without overlapping. A 2 × 3 rectangle cannot fold to a cube.',wrong:'A 2 × 3 rectangle has six squares but cannot fold into a cube without overlapping.',type:'net'},
   {shape:'cuboid',fold:.58,focus:'all',q:'A cuboid is 3 cm × 2 cm × 1 cm. What is its TOTAL surface area in cm²?',answer:22,hint:'Two 3 × 2 rectangles, two 3 × 1 rectangles, and two 2 × 1 rectangles.',wrong:'Volume is not surface area. Add 6 + 6 + 3 + 3 + 2 + 2.',type:'number'},
   {shape:'prism',fold:.7,focus:'all',q:'How many flat FACES are in a triangular prism net?',answer:5,hint:'Two matching triangles plus three rectangles.',wrong:'The triangular prism has two triangular ends and three rectangular faces.',type:'number'}
  ];
  var challengeTasks=tasks.map(function(t,i){return {q:t.q,build:function(ctl){if(t.type==='number')return NOVA.entryTask('Your answer',EN)(ctl);
    function makeThumb(pos){var src=pos==='cross'?[[1,0],[1,1],[1,2],[1,3],[0,1],[2,1]]:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];var thumb=S.root(100,100,pos==='cross'?'Cube net':'2 by 3 grid');thumb.classList.add('f13-thumb-svg');src.forEach(function(x){svgE(thumb,'rect',{x:16+x[0]*22,y:7+x[1]*22,width:20,height:20,rx:2,fill:pos==='cross'?'#123c60':'#48304c',stroke:palette[pos==='cross'?0:2],'stroke-width':2});});return thumb;}
    var choice=h('div',{class:'f13-choices','aria-label':'Choose the valid cube net'}),picked=null;
    [['cross','Cross of six squares'],['rectangle','2 × 3 rectangle']].forEach(function(o){var b=h('button',{class:'nova-btn f13-choice','aria-pressed':'false',onclick:function(){picked=o[0];choice.querySelectorAll('button').forEach(function(c){c.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');NOVA.events.emit('value',{engine:EN,control:'netChoice',value:picked});}},[makeThumb(o[0]),h('span',{text:o[1]})]);choice.appendChild(b);});ctl.appendChild(choice);ctl._select=function(v){picked=v;choice.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.textContent.indexOf(v==='cross'?'Cross':'2 ×')>=0));});};return function(){return picked;};
   },check:function(x){return [x===t.answer,x===t.answer?'Correct. The six-square cross is a valid cube net.':t.wrong];},hint:t.hint,solve:function(ctl){if(ctl._select)ctl._select('cross');else ctl._A.input.value=String(t.answer);}};});
  challengeTasks[1].check=function(x){return [x===22,x===22?'Correct. Two of each rectangle total 22 cm².':tasks[1].wrong];};
  challengeTasks[2].check=function(x){return [x===5,x===5?'Correct. Two triangles plus three rectangles make five faces.':tasks[2].wrong];};
  NOVA.challengeRun(panel,api,challengeTasks,function(i){var t=tasks[i],st=makeState(t.shape,t.fold,t.focus);scene(stage,st,['Which net closes without overlap?','Add the six face areas.','Count the triangles and rectangles.'][i],'think',false);},C);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(EN,def,{models:{},tables:{"INFO":()=>INFO,"STEPS":()=>STEPS,"palette":()=>palette},draws:{"counts":["stage","st"],"scene":["stage","st","caption","pose","interact"]},exploreFields:{"st":{"kind":"factory","factory":"makeState","argCount":3}}});
NOVA.bankMount({id:EN,num:'F13·02',title:'Net folder',def:def,linked:['F0-01','F0-02','F0-03','F0-04','F0-05','F13-01'],
 spec:{purpose:'Premium interactive nets of a cube, cuboid, triangular prism and square-based pyramid. Faces genuinely rotate around connected hinge edges into 3-D solids. For Y8-058, Y8-061 and Y9-038.',
 params:'Solid type; cube net layout; fold angle (0–100%); camera yaw/pitch; face number labels; visual emphasis of hinges, base and side faces.',
 presets:'Cube cross net · Cube side-attached net · Cuboid · Triangular prism · Square-based pyramid.',
 steps:STEPS.map(function(t){return t.name;}).join(' → ')+'. Each step has a corresponding Bob narration and pupil prompt.',
 interactions:'Watch step-by-step; Guided predictions; Explore true 3-D folding slider, pointer capture rotation, keyboard rotation, detached face drag onto green hinge, keyboard snapping and reset. Three marked Challenge tasks.',
 traps:'Six squares are not always a valid cube net · all visible triangles are not necessarily bases · forgetting opposite faces · confusing surface area with volume.',
 gcse:'Extend to surface-area calculations, cuboid nets and prism nets in F13-07 / F13-13.'}});
var log=document.getElementById('log'),addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

