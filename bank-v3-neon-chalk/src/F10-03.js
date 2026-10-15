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


/* NOVA F10-03 Midpoint and Distance · canonical F0 core / approved F10-02 presentation */
const F103_CONFIG={
 id:'F10-03',family:'F10',startMode:'watch',preset:'Y8-045',bounds:[-5,5],gridStep:1,
 presets:{
  'Y8-045':{label:'Y8 · Pythagoras: unknown side',a:[-3,-2],b:[1,1],context:'3–4–5 right triangle'},
  'Y8-046':{label:'Y8 · Pythagoras problem solving',a:[-4,2],b:[2,-3],context:'Shortest route across the grid'},
  'Y9-010':{label:'Y9 · Equation of a straight line',a:[-4,-3],b:[4,1],context:'Gradient and coordinate distance'},
  'Y9-040':{label:'Y9 · Coordinate geometry',a:[-3,3],b:[3,-1],context:'Midpoint, distance and reasoning'},
  'F15-03':{label:'F15-03 · Pythagoras on a grid',a:[-2,-3],b:[2,0],context:'4 horizontal and 3 vertical units'}
 },
 events:{value:['preset','point','selection','construction','reset','midpoint','challengeValue'],types:['step','correct','hintUsed','mode']},
 challenge:{tasks:['midpoint','distance-345','distance-surds'],maxAttemptsPerTask:0}
};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F103_CONFIG),ID=C.id;
if(N.premium&&N.premium.enable)N.premium.enable();
const B={W:632,H:556,left:90,top:52,size:446,lo:-5,hi:5};
const T=[
 {name:'plot-A',pose:'explain',caption:'Start with point A. Read across first, then up or down.',prompt:'Which is the x-coordinate of A?',view:'points',a:[-3,-2],b:[1,1]},
 {name:'plot-B',pose:'point',caption:'Plot B on the same grid. Two points fix one straight segment.',prompt:'Where is B?',view:'line',a:[-3,-2],b:[1,1]},
 {name:'horizontal-change',pose:'count',caption:'Count four squares horizontally. This is the run, Δx = 4.',prompt:'How far across is B from A?',view:'run',a:[-3,-2],b:[1,1]},
 {name:'vertical-change',pose:'point',caption:'Now count three squares vertically. This is the rise, Δy = 3.',prompt:'How much higher is B?',view:'triangle',a:[-3,-2],b:[1,1]},
 {name:'pythagoras-proof',pose:'think',caption:'The right triangle has legs four and three. Four squared plus three squared is twenty-five.',prompt:'What is the distance AB?',view:'distance',a:[-3,-2],b:[1,1]},
 {name:'halfway-x',pose:'explain',caption:'The midpoint is halfway in x: negative three and one average to negative one.',prompt:'What is the midpoint x-coordinate?',view:'half-x',a:[-3,-2],b:[1,1]},
 {name:'halfway-y',pose:'point',caption:'Average the y-coordinates too. Negative two and one average to negative one half.',prompt:'What is the midpoint y-coordinate?',view:'midpoint',a:[-3,-2],b:[1,1]},
 {name:'generalise',pose:'cheer',caption:'Midpoint averages coordinates. Distance uses the horizontal and vertical differences.',prompt:'How do these two methods work for any pair of points?',view:'all',a:[-3,-2],b:[1,1]}
];
const Q=[
 {id:'midpoint',type:'mid',a:[-3,-2],b:[1,2],q:'Move midpoint M to the exact halfway coordinate between A and B.',hint:'Average the x-coordinates, then average the y-coordinates. M may sit halfway between grid lines.',answer:[-1,0],exp:'M = (−1, 0)'},
 {id:'distance-345',type:'dist',a:[-3,-2],b:[1,1],q:'Find the distance AB. Enter its length in grid units.',hint:'The horizontal leg is four, the vertical leg is three. Square each, add, then take the square root.',answer:5,exp:'4² + 3² = 25, so AB = 5'},
 {id:'distance-surds',type:'dist',a:[-3,-1],b:[3,3],q:'Find AB to two decimal places, or enter an equivalent exact surd.',hint:'Here Δx = 6 and Δy = 4. AB² = 36 + 16 = 52. Take the square root.',answer:Math.sqrt(52),exp:'AB = √52 = 2√13 ≈ 7.21'}
];
function point(v){return {x:Number(v[0]),y:Number(v[1])};}
function xycopy(p){return {x:p.x,y:p.y};}
const S={preset:'Y8-045',a:point(C.presets['Y8-045'].a),b:point(C.presets['Y8-045'].b),selected:'A',construction:'all',task:0,marker:{x:0,y:0},wrong:0,solved:false,challengeEntry:''};
function emit(k,v){if(!C.events.value.includes(k))throw Error('Unregistered F10-03 event: '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
function fmt(n){if(!Number.isFinite(n))return '?';return Number.isInteger(n)?String(n):String(+n.toFixed(3));}
function signed(n){return n<0?'−'+fmt(Math.abs(n)):fmt(n);}
function coord(p){return '('+signed(p.x)+', '+signed(p.y)+')';}
function clamp(n,step=1){return Math.max(-5,Math.min(5,Math.round((Number(n)||0)/step)*step));}
function xpx(n){return B.left+(n+5)*B.size/10;}
function ypx(n){return B.top+(5-n)*B.size/10;}
function maths(a,b){let dx=b.x-a.x,dy=b.y-a.y;return {dx,dy,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,d2:dx*dx+dy*dy,d:Math.hypot(dx,dy),slope:dx?dy/dx:null};}
function decimal(n){return fmt(Math.round(n*100)/100);}
function text(svg,x,y,s,size=27,role='given',other){const mobile=window.matchMedia&&matchMedia('(max-width:760px)').matches;const sz=mobile?Math.max(34,Math.round(size*1.10)):size;return N.chalkText(svg,x,y,String(s),Object.assign({size:sz,role},other||{}));}
function line(svg,x1,y1,x2,y2,role='op',width=3,other){return N.neonLine(svg,x1,y1,x2,y2,Object.assign({role,width},other||{}));}
function path(svg,d,role='op',width=3,other){return N.neonPath(svg,d,Object.assign({role,width},other||{}));}
function resetPreset(){const p=C.presets[S.preset];S.a=point(p.a);S.b=point(p.b);S.selected='A';}
function grid(svg){
 const g=N.neonPlot(svg,{x0:B.left,y0:B.top,w:B.size,h:B.size,x:[-5,5],y:[-5,5],xStep:1,yStep:1});
 g.g.classList.add('f103-grid');g.g.querySelectorAll('text').forEach(e=>e.remove());
 const axes=N.svg.axes(svg,{x:B.left,y:B.top,w:B.size,h:B.size,xmin:-5,xmax:5,ymin:-5,ymax:5,ticks:1});
 axes.g.classList.add('f103-grid');axes.g.querySelectorAll('text').forEach(e=>e.remove());
 for(let n=-5;n<=5;n++){if(n===0)continue;text(svg,xpx(n),ypx(0)+(window.matchMedia&&matchMedia('(max-width:760px)').matches?47:32),signed(n),26,'support');text(svg,xpx(0)-20,ypx(n)+7,signed(n),26,'support',{anchor:'end'});}
 text(svg,xpx(0)-19,ypx(0)+(window.matchMedia&&matchMedia('(max-width:760px)').matches?68:52),'0',25,'support',{anchor:'end'});text(svg,B.left+B.size+25,ypx(0)-10,'x',33,'op');text(svg,xpx(0)+17,B.top-17,'y',33,'op');
 return g;
}
function mark(svg,p,lab,role,editable,onMove,half=false){
 const X=xpx(p.x),Y=ypx(p.y),g=E('g',{class:'f103-point', 'data-testid':'f103-'+lab,role:editable?'slider':undefined,'aria-label':lab+' '+coord(p)},svg);
 N.neonRing(g,X,Y,{role,r:lab==='M'?13:12,pulse:false});E('circle',{class:'f103-focus',cx:X,cy:Y,r:24},g);
 const nearTop=Y<B.top+55,nearRight=X>B.left+B.size-55;
 if(lab==='M'){const mobile=window.matchMedia&&matchMedia('(max-width:760px)').matches;text(svg,mobile?X-24:X-24,mobile?Y-43:Y+34,'M',30,role,{anchor:'end'});}
 else text(svg,X+(nearRight?-23:23),Y+(nearTop?32:-19),lab,30,role,{anchor:nearRight?'end':'start'});
 if(editable){
  g.tabIndex=0;g.setAttribute('aria-valuenow',String(p.x));g.setAttribute('aria-valuemin','-5');g.setAttribute('aria-valuemax','5');g.setAttribute('aria-description','Drag to a grid point; use arrows to move by '+(half?'one half':'one')+' unit.');
  g.addEventListener('keydown',e=>{
   const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;
   e.preventDefault();e.stopPropagation();const step=half?.5:1;
   const nx=clamp(p.x+d[0]*step,step),ny=clamp(p.y+d[1]*step,step);
   if(onMove(nx,ny,'keyboard')!==false)queueMicrotask(()=>{const node=document.querySelector('#'+ID+' [data-testid="f103-'+lab+'"]');if(node)node.focus();});
  });
  N.ui.svgDrag(svg,g,{box:{x:X-19,y:Y-19,w:38,h:38},zones:()=>{
   const arr=[],s=half?.5:1,cw=B.size/10*s;
   for(let a=-5;a<=5;a+=s)for(let b=-5;b<=5;b+=s)arr.push({id:a+','+b,kind:'drop',x:xpx(a)-cw/2,y:ypx(b)-cw/2,w:cw,h:cw});
   return arr;
  },onDrop:id=>{const [x,y]=id.split(',').map(Number);return onMove(x,y,'pointer')!==false;}});
 }
 return g;
}
function rightAngle(svg,c,dx,dy){
 // Mathematical right-angle annotation drawn exclusively with approved neonPath primitive.
 const x=xpx(c.x),y=ypx(c.y),sx=dx<0?-1:1,sy=dy<0?1:-1,k=16;
 path(svg,`M${x+sx*k},${y} L${x+sx*k},${y+sy*k} L${x},${y+sy*k}`,'focus',2.3);
}
function construction(svg,a,b,view,hideResult=false){
 const m=maths(a,b),corner={x:b.x,y:a.y};
 const showLine=view!=='points',showLeg=['run','triangle','distance','half-x','midpoint','all','challenge-dist'].includes(view),showVert=['triangle','distance','half-x','midpoint','all','challenge-dist'].includes(view),showDistance=['distance','midpoint','all'].includes(view),showMid=['half-x','midpoint','all'].includes(view);
 if(showLine)line(svg,xpx(a.x),ypx(a.y),xpx(b.x),ypx(b.y),showDistance?'result':'given',showDistance?5.2:4.8);
 if(showLeg){line(svg,xpx(a.x),ypx(a.y),xpx(b.x),ypx(a.y),'op',4.6);const tx=(a.x+b.x)/2;
  if(!(window.matchMedia&&matchMedia('(max-width:760px)').matches))text(svg,xpx(tx),ypx(a.y)+((a.y<-4)?-18:36),'Δx = '+signed(m.dx),26,'op',{anchor:'middle'});}
 if(showVert){line(svg,xpx(b.x),ypx(a.y),xpx(b.x),ypx(b.y),'support',4.6);const yLab=clamp((a.y+b.y)/2+(m.dy>=0?1.25:-1.25),.5),xLab=clamp(b.x+(b.x>=3?-1.7:1.35),.5);if(!(window.matchMedia&&matchMedia('(max-width:760px)').matches))text(svg,xpx(xLab),ypx(yLab),'Δy = '+signed(m.dy),23,'support',{anchor:b.x>=3?'end':'start'});rightAngle(svg,corner,m.dx,m.dy);}
 if(showDistance&&!hideResult){
  const labelDist='AB = '+decimal(m.d);text(svg,xpx(3.25),ypx(4),labelDist,29,'result',{anchor:'end'});
 }
 if(showMid){let p={x:m.mx,y:m.my};
   if(view==='half-x'){
    path(svg,`M${xpx(m.mx)},${ypx(a.y)} L${xpx(m.mx)},${ypx(b.y)}`,'focus',2.2,{dash:'7 6'});
    mark(svg,{x:m.mx,y:a.y},'H','focus',false);
   }else{mark(svg,p,'M','result',false);}
 }
 return m;
}
function info(a,b,view,{challenge=false,type=null,completed=false}={}){
 const m=maths(a,b),aside=H('aside',{class:'f103-info','aria-label':'Coordinate evidence'});
 const card=(heading,body,role)=>{const c=N.neonCard([H('div',{class:'f103-eyebrow',text:heading}),...body],{role});aside.appendChild(c);return c;};
 const coords=H('div',{class:'f103-gridbox'},[
  H('div',{},[H('span',{text:'A'}),H('strong',{text:coord(a)})]),
  H('div',{},[H('span',{text:'B'}),H('strong',{text:coord(b)})])
 ]);
 card('Given coordinate points',[coords], 'given');
 const legVisible=['run','triangle','distance','half-x','midpoint','all','challenge-dist'].includes(view);
 const body=H('div',{class:'f103-gridbox'},[
  H('div',{},[H('span',{text:'Horizontal change'}),H('strong',{text:legVisible?fmt(Math.abs(m.dx)):'Find it'})]),
  H('div',{},[H('span',{text:'Vertical change'}),H('strong',{text:legVisible&&view!=='run'?fmt(Math.abs(m.dy)):'Find it'})])
 ]);
 card('The right-triangle evidence',[body], 'op');
 const showAnswer=!challenge||completed;
 const value=type==='mid'?'M = '+coord({x:m.mx,y:m.my}):'AB = '+decimal(m.d);
 const question=type==='mid'?'M = ( ? , ? )':type==='dist'?'AB = ?':'Two rules, one grid';
 const formula=(view==='points'||view==='line'||view==='run')?'Count across and up':(view==='triangle'?'Distance comes from a right triangle':(view==='half-x'||view==='midpoint'||view==='all'?'Midpoint: average the two x values and the two y values':'Distance: √(Δx² + Δy²)'));
 card(challenge?'Your goal':'Mathematical conclusion',[
  H('div',{class:'f103-metric'+(challenge&&!showAnswer?' is-question':'')},[H('strong',{text:showAnswer?(challenge?value:(view==='half-x'?'Midpoint x = '+signed(m.mx):view==='midpoint'||view==='all'?'M = '+coord({x:m.mx,y:m.my}):view==='distance'?'AB = '+decimal(m.d):'Show each step')):question})]),
  H('p',{class:'f103-meta',text:challenge&&!showAnswer?'Use the plotted evidence. The answer is hidden until you check.':formula})
 ],'result');
 return aside;
}
function scene(stage,o){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}

 stage.innerHTML='';const p=Object.assign({a:S.a,b:S.b,view:'all',edit:false,challenge:false,type:null,correct:false,pose:'explain',caption:'Two points, one midpoint, one exact distance.'},o||{});
 const a=xycopy(p.a),b=xycopy(p.b),m=maths(a,b);
 const theatre=H('div',{class:'f103-theatre','data-topic':'geometry','data-correct':String(!!p.correct)});
 theatre.appendChild(H('div',{class:'f103-topline'},[H('span',{text:'F10 · COORDINATE GEOMETRY STUDIO'}),H('span',{class:'f103-tag',text:p.challenge?'SOLVE WITH EVIDENCE':'NEON · CHALK · PRECISION'})]));
 const layout=H('div',{class:'f103-layout'}),left=H('div',{class:'f103-plane'});
 const svg=N.svg.root(B.W,B.H,'Four quadrant grid: point A '+coord(a)+' and B '+coord(b)+'. Horizontal difference '+fmt(Math.abs(m.dx))+' vertical difference '+fmt(Math.abs(m.dy))+'.');
 svg.setAttribute('class','nv-svg f103-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('data-testid','f103-coordinate-board');
 if(window.matchMedia&&matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','40 24 555 515');
 grid(svg);
 const v=p.challenge?(p.type==='mid'?'challenge-mid':'challenge-dist'):p.view;
 // Challenge-specific midpoint answer is NOT drawn before success.
 construction(svg,a,b,v,p.challenge&&!p.correct);
 const active=(lab,nx,ny,how)=>{
  const k=lab.toLowerCase(),other=k==='a'?S.b:S.a;if(nx===other.x&&ny===other.y)return false;
  S[k]={x:nx,y:ny};emit('point',{point:lab,x:nx,y:ny,how});scene(stage,{...p,a:S.a,b:S.b});return true;
 };
 mark(svg,a,'A','given',p.edit&&!p.challenge,(x,y,how)=>active('A',x,y,how));
 if(p.view!=='points'||p.challenge)mark(svg,b,'B','given',p.edit&&!p.challenge,(x,y,how)=>active('B',x,y,how));
 if(p.challenge&&p.type==='mid'){
  // Marker is a learner hypothesis; never draw the correct midpoint until successful.
  if(p.correct)mark(svg,{x:m.mx,y:m.my},'M','result',false);
  else mark(svg,S.marker,'M','focus',true,(x,y,how)=>{
   S.marker={x,y};emit('midpoint',{x,y,how,task:S.task});scene(stage,{...p});return true;
  },true);
 }
 left.appendChild(svg);
 const pills=H('div',{class:'f103-stage-pills'},[
  N.neonTile('A '+coord(a),{role:'given'}),N.neonTile('B '+coord(b),{role:'given'}),
  N.neonTile(p.challenge?'Find the unknown':p.view==='all'?'Midpoint + distance':p.view.replace(/-/g,' '),{role:'op'})
 ]);
 left.appendChild(pills);layout.appendChild(left);layout.appendChild(info(a,b,p.view,{challenge:p.challenge,type:p.type,completed:p.correct}));theatre.appendChild(layout);
 const visible=Math.abs(m.dx)+Math.abs(m.dy)>0;
 const insight=p.challenge?'Use the grid to reason. <em>Check your calculation before submitting.</em>':p.view==='points'?'Read ordered pairs accurately: <em>x first, then y.</em>':p.view==='run'?'Horizontal difference: <em>subtract the x-coordinates.</em>':p.view==='triangle'?'Vertical difference: <em>subtract the y-coordinates.</em>':p.view==='distance'?'Distance: <em>square the two legs, add, then square root.</em>':p.view==='half-x'?'Midpoint x: <em>average the x-coordinates.</em>':'Midpoint and distance: <em>two different rules for the same pair of points.</em>';
 theatre.appendChild(H('div',{class:'f103-takeaway',html:visible?insight:'Choose two different grid points.'}));
 if(p.challenge){const peer=N.helperImg(p.correct?'cheer':S.wrong>=2?'oops':'think','teen');theatre.appendChild(H('div',{class:'f103-peer'},[H('img',{src:peer.src,alt:'Izaac '+(p.correct?'celebrating the correct solution':'thinking about coordinate geometry')}),H('span',{text:p.correct?'Izaac: Great result! Your reasoning checks out.':S.wrong>=2?'Izaac: check the coordinate changes, not just the picture.':'Izaac: use the right triangle or halfway rule.'})]));}
 stage.appendChild(theatre);N.scene.helperStrip(stage,p.pose,p.caption);
 return svg;
}
function render(i,stage){
 const t=T[i],a=point(t.a),b=point(t.b),svg=scene(stage,{a,b,view:t.view,pose:t.pose,caption:t.caption,teaching:true,step:i});
 if(!N.reducedMotion()){
  N.motion.flash(svg,xpx(i>=6?(a.x+b.x)/2:a.x),ypx(i>=6?(a.y+b.y)/2:a.y),'focus',20);
  if(i>=1&&i<=4)N.motion.trail(svg,`M${xpx(a.x)},${ypx(a.y)} L${xpx(b.x)},${ypx(b.y)}`,'result',480);
 }
}
function stepper(name,n,cb){const l=H('label',{},[name]),row=H('div',{class:'f103-stepper'});row.append(H('button',{class:'nova-btn ghost',text:'−',onclick:()=>cb(clamp(n-1))}),H('strong',{text:signed(n)}),H('button',{class:'nova-btn ghost',text:'+',onclick:()=>cb(clamp(n+1))}));l.appendChild(row);return l;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.innerHTML='';window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f103-controls');
 window.NovaLessonComponent?.applyExploreModels();function paint(){scene(stage,{a:S.a,b:S.b,view:S.construction,edit:true,pose:'explain',caption:'Move A or B. The triangle, midpoint and distance recalculate from your points.'});}
 window.NovaLessonComponent?.applyExploreModels();function rebuild(){panel.innerHTML='';
  const preset=H('select',{class:'nova-input','aria-label':'Lesson preset'});Object.entries(C.presets).forEach(([id,v])=>preset.appendChild(H('option',{value:id,text:v.label})));preset.value=S.preset;
  preset.onchange=()=>{S.preset=preset.value;resetPreset();emit('preset',S.preset);rebuild();paint();};panel.appendChild(H('label',{class:'f103-span'},['Lesson preset',preset]));
  const con=H('select',{class:'nova-input','aria-label':'Construction view'});[['all','Show all evidence'],['distance','Distance triangle'],['midpoint','Midpoint construction'],['line','Points and segment']].forEach(([v,t])=>con.appendChild(H('option',{value:v,text:t})));con.value=S.construction;
  con.onchange=()=>{S.construction=con.value;emit('construction',con.value);paint();};panel.appendChild(H('label',{class:'f103-span'},['What to investigate',con]));
  const sel=H('select',{class:'nova-input','aria-label':'Choose point'});['A','B'].forEach(v=>sel.appendChild(H('option',{value:v,text:v+' '+coord(S[v.toLowerCase()])})));sel.value=S.selected;sel.onchange=()=>{S.selected=sel.value;emit('selection',sel.value);rebuild();paint();};panel.appendChild(H('label',{class:'f103-span'},['Adjust a coordinate point',sel]));
  const p=S[S.selected.toLowerCase()];
  for(const axis of ['x','y'])panel.appendChild(stepper(axis==='x'?'x · horizontal':'y · vertical',p[axis],val=>{const other=S[S.selected==='A'?'b':'a'];if((axis==='x'?val:p.x)===other.x&&(axis==='y'?val:p.y)===other.y)return;S[S.selected.toLowerCase()]={...p,[axis]:val};emit('point',{point:S.selected,axis,value:val,how:'stepper'});rebuild();paint();}));
  panel.appendChild(H('div',{class:'f103-span f103-actions'},[H('button',{class:'nova-btn ghost',text:'Reset to preset',onclick:()=>{resetPreset();emit('reset',S.preset);rebuild();paint();}}),H('button',{class:'nova-btn ghost',text:'Switch A ↔ B',onclick:()=>{S.selected=S.selected==='A'?'B':'A';emit('selection',S.selected);rebuild();paint();}})]));
  panel.appendChild(H('div',{class:'f103-span f103-hint',text:'Drag the bright point rings onto grid intersections, or focus a ring and use arrow keys. The midpoint is calculated; it is not freely draggable in Explore.'}));
 }window.NovaLessonComponent?.applyExploreModels();rebuild();window.NovaLessonComponent?.applyExploreModels();paint();
}
function challenge(panel,api,stage){
 const tasks=Q.map((t,index)=>({q:t.q,
  build:ctl=>{
   S.task=index;S.wrong=0;S.solved=false;S.marker={x:0,y:0};S.challengeEntry='';
   if(t.type==='mid'){
    ctl.appendChild(H('p',{class:'f103-task',text:'Drag the orange M ring, or focus it and use arrow keys in half-unit steps. Then press Check.'}));
    return ()=>xycopy(S.marker);
   }
   const row=H('div',{class:'f103-challenge-row'}),entry=H('input',{class:'nova-input',type:'text','inputmode':'decimal','aria-label':'Distance answer',placeholder:'Length or √52'});
   entry.addEventListener('input',()=>{S.challengeEntry=entry.value;emit('challengeValue',{task:index,value:entry.value});});
   row.appendChild(entry);ctl.appendChild(row);ctl.appendChild(H('p',{class:'f103-hint',text:'Use grid units. Approximate answers are accepted to two decimal places for non-integer lengths.'}));
   return ()=>S.challengeEntry;
  },
  check:value=>{
   let correct=false,feedback='';
   if(t.type==='mid'){
    correct=Math.abs(value.x-t.answer[0])<.001&&Math.abs(value.y-t.answer[1])<.001;
    feedback=correct?'Correct. '+t.exp+'.':Math.abs(value.x-t.answer[0])>.001?'Check the horizontal halfway position: average the two x-coordinates.':'The x-coordinate is right. Now average the two y-coordinates.';
   }else{
    const s=String(value||'').trim().toLowerCase().replace(/\s+/g,'').replace(/,/g,'.');
    let numeric=Number(s);
    if(s==='√52'||s==='sqrt(52)'||s==='sqrt52'||s==='2√13'||s==='2sqrt(13)'||s==='2sqrt13')numeric=Math.sqrt(52);
    if(s==='√25'||s==='sqrt25'||s==='sqrt(25)')numeric=5;
    correct=s!==''&&Number.isFinite(numeric)&&Math.abs(numeric-t.answer)<=.025;
    feedback=correct?'Correct. '+t.exp+'.':!s?'Enter a distance before checking.':index===1?'Check your Pythagoras calculation: square both legs before adding.':'The two legs make a right triangle. Find the sum of their squares, then square root.';
   }
   if(!correct)S.wrong++;
   else{S.solved=true;scene(stage,{a:point(t.a),b:point(t.b),view:t.type==='mid'?'midpoint':'distance',challenge:true,type:t.type,correct:true,pose:'cheer',caption:'You proved the result using coordinates.'});}
   return [correct,feedback];
  },hint:t.hint,
  solve:()=>{
   S.solved=true;if(t.type==='mid')S.marker={x:t.answer[0],y:t.answer[1]};else S.challengeEntry=String(t.answer);
   scene(stage,{a:point(t.a),b:point(t.b),view:t.type==='mid'?'midpoint':'distance',challenge:true,type:t.type,correct:true,pose:'cheer',caption:'Correct reasoning: '+t.exp+'.'});
  }
 }));
 N.challengeRun(panel,api,tasks,i=>{S.task=i;S.wrong=0;S.solved=false;S.marker={x:0,y:0};scene(stage,{a:point(Q[i].a),b:point(Q[i].b),view:Q[i].type==='mid'?'midpoint':'distance',challenge:true,type:Q[i].type,pose:'think',caption:Q[i].type==='mid'?'Midpoint is halfway in both directions.':'Use Pythagoras on the two grid legs.'});},C);
}
const def={id:ID,title:'Midpoint and distance',config:C,
 steps:T.map(x=>({name:x.name,narration:x.caption,prompt:x.prompt,mood:x.pose})),render,explore,challenge,
 alt:'Two coordinate points plotted on a four-quadrant grid with a right triangle to establish their distance and a midpoint ring at the arithmetic average.',
 staticAlt:'For A (−3,−2) and B (1,1): Δx=4, Δy=3; AB=√(4²+3²)=5; M=(−1,−0.5).',
 exploreIntro:'Drag either endpoint or change a coordinate. See the triangle and midpoint update from the same two points.',
 onRestore:()=>{S.preset='Y8-045';resetPreset();S.task=0;S.construction='all';S.marker={x:0,y:0};}
};
N.registry.add({id:ID,title:'Midpoint and distance',family:'F10',topics:['coordinates','midpoint','distance','Pythagoras','geometry'],deps:['F0-02','F0-03','F0-04','F0-14','F10-01','F10-02']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"T":()=>T,"Q":()=>Q},draws:{"scene":["stage","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'03',title:'Midpoint and distance · Premium Edition',def,linked:['F0-14','F10-01','F10-02','F15-03'],years:'Y8 Pythagoras and Y9 coordinate geometry',spec:{
 purpose:'Connect a pair of coordinate points to a right-triangle distance construction and calculate their midpoint, showing what each calculation means.',
 params:'Two ordered pairs in −5 to 5; named Year 8–9 lesson presets; core graph plotting; editable endpoints; view of midpoint/distance/both.',
 presets:'Y8-045 · Y8-046 · Y9-010 · Y9-040 · F15-03 (Pythagoras on a grid is a preset, not a separate build)',
 steps:'Locate A → locate B → horizontal run → vertical rise → Pythagoras proof → halfway in x → halfway in y → generalise both rules.',
 interactions:'Drag both endpoints to intersections (with re-grab/snap/Escape/keyboard arrows); numeric stepper alternate; Challenge midpoint ring half-grid snap + two distance evaluations.',
 traps:'Swapping x/y; ignoring negative signs; adding coordinate differences rather than squaring them; omitting square root; averaging x with y or rounding a half midpoint incorrectly.',
 gcse:'Exact surd distance and algebraic straight-line reasoning; linked to F15-03 Pythagoras on a grid and F10-06 gradient.'
}});
const card=document.getElementById(ID);
if(card){const details=H('details',{class:'nv-dev'});details.appendChild(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(n=>details.appendChild(n));card.appendChild(details);const title=card.querySelector('h3');if(title)title.textContent='Interactive coordinate geometry workshop';const fix=()=>card.querySelectorAll('.face img').forEach(im=>{if(!im.alt)im.alt='Sir Bob, maths tutor';});fix();new MutationObserver(fix).observe(card,{childList:true,subtree:true});}
})();

