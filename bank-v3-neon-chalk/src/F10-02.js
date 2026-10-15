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


/* NOVA F10-02 · Shape on grid. Uses canonical embedded F0/2/3 core only. */
const F102_CONFIG={
 id:'F10-02',family:'F10',startMode:'watch',preset:'Y7-052',bounds:[-5,5],step:1,
 presets:{
  'Y7-038':{label:'Y7 · Coordinates and shapes',op:'identity',dx:0,dy:0},
  'Y7-052':{label:'Y7 · Reflection and translation',op:'translate',dx:3,dy:-2},
  'Y7-053':{label:'Y7 · Rotation',op:'ccw',dx:0,dy:0},
  'Y7-054':{label:'Y7 · Enlargement',op:'enlarge',dx:0,dy:0},
  'Y8-053':{label:'Y8 · Reflection and translation',op:'reflect-y',dx:0,dy:0}
 },
 events:{value:['preset','operation','translation','vertex','selection','reset','challengeVertex'],types:['step','correct','hintUsed','mode']},
 challenge:{tasks:['reflection','translation','rotation'],maxAttemptsPerTask:0}
};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F102_CONFIG),ID=C.id;
if(N.premium&&N.premium.enable)N.premium.enable();
const B={W:622,H:536,left:88,top:46,size:436,lo:-5,hi:5};
const BASE=[{id:'A',x:-2,y:1},{id:'B',x:-1,y:2},{id:'C',x:1,y:1}];
const S={preset:C.preset,op:'translate',dx:3,dy:-2,vertices:copy(BASE),active:'A',task:0,answers:copy(BASE),wrong:0,complete:0};
const tasks=[
 {name:'Reflection',op:'reflect-y',dx:0,dy:0,q:'Reflect triangle ABC in the y-axis. Move A′, B′ and C′ to their correct positions.',hint:'Reflecting in the y-axis changes the sign of x only. y stays the same.'},
 {name:'Translation',op:'translate',dx:2,dy:-3,q:'Translate ABC two right and three down. Place all three image vertices.',hint:'Add two to every x-coordinate. Subtract three from every y-coordinate.'},
 {name:'Rotation',op:'ccw',dx:0,dy:0,q:'Rotate ABC 90° anticlockwise about the origin. Place A′, B′ and C′.',hint:'For a 90° anticlockwise turn about the origin, (x, y) becomes (−y, x).'}
];
const teaching=[
 {name:'source',pose:'explain',desc:'Start with the original triangle ABC. Each vertex sits at an exact grid intersection.',prompt:'Where is vertex A?',op:'identity',dest:false},
 {name:'vertices',pose:'point',desc:'Read every vertex x first, then y. Those coordinates define the triangle exactly.',prompt:'What is the ordered pair for B?',op:'identity',dest:false},
 {name:'reflect',pose:'think',desc:'Reflect in the y-axis. Each image vertex is the same distance across the mirror line.',prompt:'Which coordinate changes sign?',op:'reflect-y',dest:true},
 {name:'translate',pose:'point',desc:'Translate every vertex three right and two down. Keep the same shape and orientation.',prompt:'Which coordinate changes when you move down?',op:'translate',dx:3,dy:-2,dest:true},
 {name:'rotate',pose:'explain',desc:'Turn the entire triangle 90 degrees anticlockwise around the origin.',prompt:'What happens to the point (2, 1)?',op:'ccw',dest:true},
 {name:'enlarge',pose:'think',desc:'Double each distance from the origin. The new sides are twice as long.',prompt:'Where will A move when the scale factor is two?',op:'enlarge',dest:true},
 {name:'compare',pose:'cheer',desc:'Check every image vertex. A shape transformation has a rule you can prove.',prompt:'How can coordinates prove a transformation?',op:'reflect-y',dest:true}
];
function copy(x){return JSON.parse(JSON.stringify(x));}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unknown value event '+key);N.events.emit('value',{engine:ID,key,value});}
function clamp(n){return Math.max(-5,Math.min(5,Math.round(Number(n)||0)));}
function fmt(n){return Number.isInteger(n)?String(n):Number(n).toFixed(1).replace(/\.0$/,'');}
function signed(n){return n<0?'−'+Math.abs(n):fmt(n);}
function coord(p){return '('+signed(p.x)+', '+signed(p.y)+')';}
function xpx(n){return B.left+(n-B.lo)*B.size/(B.hi-B.lo);}
function ypx(n){return B.top+(B.hi-n)*B.size/(B.hi-B.lo);}
function label(svg,x,y,s,size,role,extra){return N.chalkText(svg,x,y,String(s),Object.assign({size:size||27,role:role||'given'},extra||{}));}
function opName(op){return {identity:'Same coordinates',translate:'Translation', 'reflect-y':'Reflect in y-axis','reflect-x':'Reflect in x-axis',cw:'Rotate 90° clockwise',ccw:'Rotate 90° anticlockwise',enlarge:'Enlarge ×2',shrink:'Enlarge ×½'}[op]||op;}
function transform(p,o){const x=p.x,y=p.y;switch(o.op){case 'translate':return {id:p.id,x:x+(o.dx||0),y:y+(o.dy||0)};case 'reflect-y':return {id:p.id,x:-x,y};case 'reflect-x':return {id:p.id,x,y:-y};case 'cw':return {id:p.id,x:y,y:-x};case 'ccw':return {id:p.id,x:-y,y:x};case 'enlarge':return {id:p.id,x:x*2,y:y*2};case 'shrink':return {id:p.id,x:x/2,y:y/2};default:return {...p};}}
function mapped(base,o){return base.map(p=>transform(p,o));}
function inside(p){return p.x>=-5&&p.x<=5&&p.y>=-5&&p.y<=5;}
function polygon(svg,arr,role,opacity,outline){const q=arr.filter(inside);if(q.length!==3)return null;const d=arr.map((p,i)=>(i?'L':'M')+xpx(p.x).toFixed(1)+','+ypx(p.y).toFixed(1)).join(' ')+' Z';const g=N.neonPath(svg,d,{role,width:outline?2.5:4.2,fill:!outline});g.setAttribute('opacity',String(opacity==null?1:opacity));if(outline){g.querySelectorAll('path').forEach(e=>{e.setAttribute('stroke-dasharray','8 7');});}return g;}
function grid(svg){
 const P=N.neonPlot(svg,{x0:B.left,y0:B.top,w:B.size,h:B.size,x:[-5,5],y:[-5,5],xStep:1,yStep:1});
 P.g.classList.add('f102-grid');P.g.querySelectorAll('text').forEach(x=>x.remove());
 const ax=N.svg.axes(svg,{x:B.left,y:B.top,w:B.size,h:B.size,xmin:-5,xmax:5,ymin:-5,ymax:5,ticks:1});
 ax.g.classList.add('f102-grid');ax.g.querySelectorAll('text').forEach(x=>x.remove());
 for(let i=-5;i<=5;i++){if(!i)continue;label(svg,xpx(i),ypx(0)+32,signed(i),26,'support');label(svg,xpx(0)-20,ypx(i)+8,signed(i),26,'support',{anchor:'end'});}
 label(svg,xpx(0)-16,ypx(0)+59,'0',24,'support',{anchor:'end'});label(svg,B.left+B.size+22,ypx(0)-12,'x',31,'op');label(svg,xpx(0)+17,B.top-12,'y',31,'op');
 return P;
}
function guide(svg,start,end,mode){
 if(mode==='translate'){
   N.neonPath(svg,'M'+xpx(start.x)+','+ypx(start.y)+' L'+xpx(end.x)+','+ypx(start.y),{role:'support',width:2,dash:'7 7'});
   N.neonPath(svg,'M'+xpx(end.x)+','+ypx(start.y)+' L'+xpx(end.x)+','+ypx(end.y),{role:'support',width:2,dash:'7 7'});
 }else{N.neonPath(svg,'M'+xpx(start.x)+','+ypx(start.y)+' L'+xpx(end.x)+','+ypx(end.y),{role:'support',width:1.8,dash:'5 9'});}
}
function vertex(svg,p,role,editable,change,primed){
 const x=xpx(p.x),y=ypx(p.y),g=E('g',{class:'f102-point',role:editable?'slider':undefined,'aria-label':(primed?p.id+' prime':p.id)+' '+coord(p),'data-testid':(primed?'image-':'source-')+p.id},svg);
 N.neonRing(g,x,y,{role,r:12,pulse:false});E('circle',{class:'f102-focus',cx:x,cy:y,r:24},g);
 const align=p.x>=4?'end':'start',dx=p.x>=4?-23:23;
 label(svg,x+dx,y+(p.y>=4?30:-22),p.id+(primed?'′':''),29,role,{anchor:align});
 if(editable){
  g.setAttribute('tabindex','0');g.setAttribute('aria-valuenow',String(p.x));g.setAttribute('aria-valuemin','-5');g.setAttribute('aria-valuemax','5');
  g.setAttribute('aria-description','Use arrow keys to move by one grid square, or drag to a grid intersection.');
  g.addEventListener('keydown',ev=>{const dir={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[ev.key];if(dir){ev.preventDefault();ev.stopPropagation();change(clamp(p.x+dir[0]),clamp(p.y+dir[1]),'keyboard');queueMicrotask(()=>document.querySelector('#'+ID+' [data-testid="'+(primed?'image-':'source-')+p.id+'"]').focus());}if(ev.key==='Home'){ev.preventDefault();change(0,0,'keyboard');}});
  N.ui.svgDrag(svg,g,{box:{x:x-18,y:y-18,w:36,h:36},zones:()=>{
    const out=[],cell=B.size/10;for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++)out.push({id:a+','+b,kind:'drop',x:xpx(a)-cell/2,y:ypx(b)-cell/2,w:cell,h:cell});return out;
  },onDrop:id=>{const [a,b]=id.split(',').map(Number);return change(a,b,'pointer')!==false;}});
 }
 return g;
}
function info(op,base,target,show,challengeFlag){
 const aside=H('aside',{class:'f102-info','aria-label':'Transformation facts'}),points=base.map((p,i)=>[p,target[i]]),mk=(heading,children,role)=>{
 const c=N.neonCard([H('div',{class:'f102-eyebrow',text:heading}),...children],{role});aside.appendChild(c);return c;};
 mk('Transformation', [H('div',{class:'f102-proof',text:opName(op.op)}),H('p',{class:'f102-meta',text:op.op==='translate'?`Move ${Math.abs(op.dx||0)} ${op.dx>=0?'right':'left'}, ${Math.abs(op.dy||0)} ${op.dy>=0?'up':'down'}.`:'Each vertex follows the same exact rule.'})],'op');
 mk(challengeFlag?'Your current image positions':'Image coordinate evidence',[H('div',{class:'f102-mapping'},points.slice(0,show?3:1).map(([a,b])=>H('div',{},[H('span',{text:a.id+' '+coord(a)}),'  →  '+a.id+'′ '+coord(b)])))],'given');
 mk('Mathematical check',[H('div',{class:'f102-proof',html:'<strong>Same rule</strong> for every vertex'}),H('p',{class:'f102-meta',text:'Reflect, translate and rotate: matching sides stay equal. Enlargement changes lengths by the scale factor.'})],'support');
 return aside;
}
function scene(stage,o){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}

 stage.innerHTML='';const use=Object.assign({op:S.op,dx:S.dx,dy:S.dy,base:S.vertices,showImage:true,showLabels:true,editable:false,challenge:false,active:'A',highlight:false,teaching:false,step:0,pose:'point',caption:'Every vertex follows the transformation rule.'},o||{});
 const source=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("scene.source",(...a)=>copy(...a),[use.base]):(copy(use.base))),target=use.challenge?copy(S.answers):mapped(source,use),theatre=H('div',{class:'f102-theatre', 'data-topic':'geometry'});
 theatre.appendChild(H('div',{class:'f102-topline'},[H('span',{text:'F10 · COORDINATE TRANSFORMATION STUDIO'}),H('span',{class:'f102-tag',text:use.challenge?'PLACE THE IMAGE':'NEON · CHALK · PRECISION'})]));
 const layout=H('div',{class:'f102-layout'}),left=H('div',{class:'f102-plane'}),svg=N.svg.root(B.W,B.H,'Four quadrant coordinate grid showing triangle ABC and its transformation. Source: '+source.map(p=>p.id+' '+coord(p)).join('; '));
 svg.setAttribute('class','nv-svg f102-svg');svg.removeAttribute('width');svg.removeAttribute('height');if(window.matchMedia&&matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','45 20 545 495');svg.setAttribute('data-testid','f102-coordinate-board');
 // Premium studio shadow and panel belong to the stage: all actual mathematical lines come from F0 core.
 grid(svg);
 if(use.showImage&&use.op==='reflect-y')N.neonPath(svg,'M'+xpx(0)+','+ypx(5)+' L'+xpx(0)+','+ypx(-5),{role:'focus',width:3,dash:'8 8'});
 if(use.showImage&&use.op==='reflect-x')N.neonPath(svg,'M'+xpx(-5)+','+ypx(0)+' L'+xpx(5)+','+ypx(0),{role:'focus',width:3,dash:'8 8'});
 if(use.showImage&&!use.challenge)source.forEach((p,i)=>guide(svg,p,target[i],use.op));
 polygon(svg,source,'given',use.challenge?.36:1,false);
 if(use.showImage)polygon(svg,target,use.challenge?'focus':'result',1,false);
 source.forEach(p=>vertex(svg,p,'given',use.editable&&!use.challenge,(x,y,how)=>{
  if(!inside(transform({id:p.id,x,y},use)))return false;S.vertices=S.vertices.map(v=>v.id===p.id?{...v,x,y}:v);emit('vertex',{vertex:p.id,x,y,how});scene(stage,{...use,base:S.vertices});return true;
 },false));
 if(use.showImage)target.forEach(p=>vertex(svg,p,use.challenge?'focus':'result',use.challenge,(x,y,how)=>{
  S.answers=S.answers.map(v=>v.id===p.id?{...v,x,y}:v);emit('challengeVertex',{vertex:p.id,x,y,how,task:S.task});scene(stage,{...use,challenge:true});
 },true));
 left.appendChild(svg);
 const pills=H('div',{class:'f102-stage-pills'},[N.neonTile('ABC → A′B′C′',{role:'given'}),N.neonTile(opName(use.op),{role:'result'})]);left.appendChild(pills);
 layout.appendChild(left);layout.appendChild(info(use,source,target,use.showImage,use.challenge));theatre.appendChild(layout);
 theatre.appendChild(H('div',{class:'f102-takeaway',html:use.challenge?'Move all three orange image vertices. <em>Check the coordinates, not just the appearance.</em>':`<em>Maths evidence:</em> ${use.op==='translate'?'add the same horizontal and vertical shift to each point':use.op==='reflect-y'?'change the sign of x; preserve y':use.op==='reflect-x'?'change the sign of y; preserve x':use.op==='cw'?'map (x, y) to (y, −x)':use.op==='ccw'?'map (x, y) to (−y, x)':use.op==='enlarge'?'multiply both coordinates by two':use.op==='shrink'?'halve each coordinate':'read and plot ordered pairs accurately'}.`}));
 if(use.challenge){const peer=N.helperImg('think','teen');theatre.appendChild(H('div',{class:'f102-peer'},[H('img',{src:peer.src,alt:'Izaac checking the challenge coordinates'}),H('span',{text:'Izaac: place all three image vertices, then check your coordinates.'})]));}
 stage.appendChild(theatre);N.scene.helperStrip(stage,use.pose||'explain',use.caption);
 return svg;
}
function render(i,stage){const t=teaching[i],show=i>=2;const opts={op:t.op,dx:t.dx||0,dy:t.dy||0,base:BASE,showImage:show,pose:t.pose,caption:t.desc,teaching:true,step:i};const svg=scene(stage,opts);
 if(!N.reducedMotion()){const rings=svg.querySelectorAll('.nv-ring');if(rings.length)N.motion.flash(svg,xpx(BASE[Math.min(i%3,2)].x),ypx(BASE[Math.min(i%3,2)].y),'focus',24);}
}
function field(name,val,delta,on){const outer=H('label',{},[name]),wrap=H('div',{class:'f102-stepper'}),display=H('strong',{text:signed(val)});wrap.append(H('button',{class:'nova-btn ghost',text:'−',onclick:()=>on(val-delta)}),display,H('button',{class:'nova-btn ghost',text:'+',onclick:()=>on(val+delta)}));outer.appendChild(wrap);return outer;}
function resetToPreset(){const p=C.presets[S.preset];S.op=p.op;S.dx=p.dx;S.dy=p.dy;S.vertices=copy(BASE);S.active='A';}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.innerHTML='';window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f102-controls');
 window.NovaLessonComponent?.applyExploreModels();function paint(){scene(stage,{op:S.op,dx:S.dx,dy:S.dy,base:S.vertices,showImage:true,editable:true,pose:'explain',caption:'Drag a source vertex. The transformed image updates from the same rule.'});}
 window.NovaLessonComponent?.applyExploreModels();function rebuild(){panel.innerHTML='';const pre=H('select',{class:'nova-input','aria-label':'Lesson preset'});Object.entries(C.presets).forEach(([key,p])=>pre.appendChild(H('option',{value:key,text:p.label})));pre.value=S.preset;pre.onchange=()=>{S.preset=pre.value;resetToPreset();emit('preset',pre.value);rebuild();paint();};panel.appendChild(H('label',{class:'f102-span'},['Lesson preset',pre]));
 const opt=H('select',{class:'nova-input','aria-label':'Transformation rule'});['identity','translate','reflect-y','reflect-x','cw','ccw','enlarge','shrink'].forEach(k=>opt.appendChild(H('option',{value:k,text:opName(k)})));opt.value=S.op;opt.onchange=()=>{S.op=opt.value;emit('operation',S.op);rebuild();paint();};panel.appendChild(H('label',{class:'f102-span'},['Transformation',opt]));
 if(S.op==='translate'){
  panel.appendChild(field('Horizontal translation',S.dx,1,v=>{S.dx=Math.max(-3,Math.min(3,v));emit('translation',{x:S.dx,y:S.dy});rebuild();paint();}));
  panel.appendChild(field('Vertical translation',S.dy,1,v=>{S.dy=Math.max(-3,Math.min(3,v));emit('translation',{x:S.dx,y:S.dy});rebuild();paint();}));
 }
 const verts=H('select',{class:'nova-input','aria-label':'Choose source vertex'});S.vertices.forEach(p=>verts.appendChild(H('option',{value:p.id,text:p.id+' '+coord(p)})));verts.value=S.active;verts.onchange=()=>{S.active=verts.value;emit('selection',S.active);rebuild();paint();};panel.appendChild(H('label',{class:'f102-span'},['Choose vertex for keyboard or buttons',verts]));
 const p=S.vertices.find(v=>v.id===S.active)||S.vertices[0];
 for(const axis of ['x','y'])panel.appendChild(field(axis==='x'?'x · across':'y · up/down',p[axis],1,v=>{const n=clamp(v);S.vertices=S.vertices.map(a=>a.id===p.id?{...a,[axis]:n}:a);emit('vertex',{vertex:p.id,axis,value:n,how:'button'});rebuild();paint();}));
 const row=H('div',{class:'f102-actions f102-span'},[H('button',{class:'nova-btn ghost',text:'Reset original triangle',onclick:()=>{S.vertices=copy(BASE);emit('reset','source');rebuild();paint();}}),H('button',{class:'nova-btn ghost',text:'Back to lesson preset',onclick:()=>{resetToPreset();emit('reset',S.preset);rebuild();paint();}})]);panel.appendChild(row);
 panel.appendChild(H('div',{class:'f102-hint f102-span',text:'Drag the cyan vertices on the grid or focus one and use arrow keys. Every drop snaps to an exact grid intersection.'}));
 }window.NovaLessonComponent?.applyExploreModels();rebuild();window.NovaLessonComponent?.applyExploreModels();paint();
}
function challenge(panel,api,stage){
 const CTasks=tasks.map((t,i)=>({
   q:t.q,
   build:ctl=>{S.task=i;S.answers=copy(BASE);S.wrong=0;ctl.appendChild(H('p',{class:'f102-task',text:'Move A′, B′ and C′ to the exact image coordinates.'}));return ()=>copy(S.answers);},
   check:arr=>{const want=mapped(BASE,t),faults=want.filter((p,j)=>arr[j].x!==p.x||arr[j].y!==p.y);const ok=!faults.length;const msg=ok?'Correct. Every vertex matches the rule for '+t.name.toLowerCase()+'.':faults.length===1?'Check '+faults[0].id+'′. '+(t.op==='reflect-y'?'Reflect in the y-axis, not the x-axis.':t.op==='translate'?'Both coordinates move by the same translation vector.':'Remember the direction: anticlockwise.'):faults.length+' vertices are not yet at their mathematically correct image positions. '+t.hint;
   if(!ok)S.wrong++;
   return [ok,msg];},hint:t.hint,
   solve:()=>{S.answers=mapped(BASE,t);scene(stage,{...t,base:BASE,showImage:true,challenge:true,pose:'cheer',caption:'Every image vertex follows the same rule.'});}
 }));
 N.challengeRun(panel,api,CTasks,i=>{S.task=i;S.answers=copy(BASE);scene(stage,{...tasks[i],base:BASE,showImage:true,challenge:true,pose:'think',caption:'Start with A′. Use the rule, then plot B′ and C′.'});},C);
}
const def={id:ID,title:'Shape on grid',config:C,steps:teaching.map(t=>({name:t.name,narration:t.desc,prompt:t.prompt,mood:t.pose})),render,explore,challenge,
 alt:'Coordinate geometry transformation studio. Drag polygon vertices, calculate their image under translation, reflection, rotation or enlargement.',
 staticAlt:'Original triangle ABC: A (−2,1), B (−1,2), C (1,1). Reflection in the y-axis maps (x,y) to (−x,y); a 90-degree anticlockwise rotation maps (x,y) to (−y,x).',
 exploreIntro:'Move triangle vertices and select the transformation. The image always comes from a correct rule.',
 onRestore:()=>{S.preset='Y7-052';resetToPreset();S.task=0;S.answers=copy(BASE);}
};
N.registry.add({id:ID,title:'Shape on grid',family:'F10',topics:['coordinates','reflection','translation','rotation','enlargement'],deps:['F0-02','F0-03','F0-04','F0-14','F10-01']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"BASE":()=>BASE,"tasks":()=>tasks,"teaching":()=>teaching},draws:{"scene":["stage","o"]},exploreFields:{"scene.source":{"kind":"factory","factory":"copy","argCount":1}}});
N.bankMount({id:ID,num:'02',title:'Shape on grid · Premium Edition',def,linked:['F0-02','F0-14','F10-01','F10-03'],years:'Years 7–8 transformations; Year 9 coordinate reasoning',spec:{
 purpose:'Manipulate and transform a triangle on an exact Cartesian grid, proving image coordinates for reflection, translation, 90-degree rotation and enlargement.',
 params:'Grid −5 to 5; base triangle vertices A, B, C; transformation rule; translation vector; named lesson presets.',
 presets:'Y7-038 · Y7-052 · Y7-053 · Y7-054 · Y8-053',
 steps:'Identify ABC → read vertices → reflection in y → translation (+3,−2) → 90° anticlockwise rotation → enlargement ×2 → check correspondence.',
 interactions:'Four modes. Explore draggable source vertices with snapped positions, keyboard arrows and numeric steppers, rule controls; Challenge three independent drag-to-image tasks with per-vertex exact marking.',
 traps:'Reflection over the wrong axis, swapping ordered pairs, treating translation as one vertex only, clockwise versus anticlockwise, scaling distances inconsistently.',
 gcse:'Correct algebraic maps transferable to GCSE enlargement from other centres and coordinate proofs.'}});
const card=document.getElementById(ID);
if(card){const extra=H('details',{class:'nv-dev'});extra.appendChild(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(e=>extra.appendChild(e));card.appendChild(extra);const h3=card.querySelector('h3');if(h3)h3.textContent='Interactive shape transformation workshop';const fix=()=>card.querySelectorAll('.face img').forEach(im=>{if(!im.alt)im.alt='Sir Bob, maths tutor';});fix();new MutationObserver(fix).observe(card,{subtree:true,childList:true});}
})();

