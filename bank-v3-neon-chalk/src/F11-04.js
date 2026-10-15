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

/* NOVA F11-04 — Triangle angle-sum tear-off. Additive F0/F1 component; core unchanged.
   Geometry is calculated from the vertices. Corner wedges retain their exact angular measure.
*/
const F114_CONFIG=Object.freeze({id:'F11-04',family:'F11',defaultPreset:'scalene',presets:{
 scalene:{label:'Y7-043 · Unequal-sided triangle',points:[[154,317],[568,317],[360,71]]},
 right:{label:'Y7-043 · Right-angled triangle',points:[[161,317],[572,317],[161,84]]},
 isosceles:{label:'Y7-043 · Isosceles triangle',points:[[151,317],[573,317],[362,65]]},
 obtuse:{label:'Y7-043 · Obtuse triangle',points:[[142,316],[578,316],[251,190]]},
 quad:{label:'Y7-044 · Quadrilateral angle sum',quad:true,points:[[178,348],[538,348],[570,125],[269,79]]}
},events:{value:['preset','corner','angle','answer','reason','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F114_CONFIG=F114_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,CFG=window.NovaV2Integration.configuration(F114_CONFIG),ID=CFG.id,PI=Math.PI,DEG=180/PI;
N.premium?.enable?.();
const AKEY=['A','C','B'],palette=['op','focus','result'];
const S={preset:'scalene',placed:[false,false,false],taskIndex:0,wrong:0,reason:'',mode:'watch',last:'',challengeDone:false};
function emit(key,value){if(!CFG.events.value.includes(key))throw new Error('Undeclared event '+key);N.events.emit('value',{engine:ID,key,value})}
function vec(x,y,a,r){return [x+Math.cos(a/DEG)*r,y-Math.sin(a/DEG)*r]}
function angle(from,to){return Math.atan2(from[1]-to[1],to[0]-from[0])*DEG}
function clamp(a,min,max){return Math.max(min,Math.min(max,a))}
function xy(pt){return pt.map(n=>+n.toFixed(4))}
function triangle(points){const [A,B,C]=points;const cross=(B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0]);if(Math.abs(cross)<.001)throw Error('Degenerate triangle');
 const da=Math.acos(clamp(((B[0]-A[0])*(C[0]-A[0])+(B[1]-A[1])*(C[1]-A[1]))/(Math.hypot(B[0]-A[0],B[1]-A[1])*Math.hypot(C[0]-A[0],C[1]-A[1])),-1,1))*DEG;
 const db=Math.acos(clamp(((A[0]-B[0])*(C[0]-B[0])+(A[1]-B[1])*(C[1]-B[1]))/(Math.hypot(A[0]-B[0],A[1]-B[1])*Math.hypot(C[0]-B[0],C[1]-B[1])),-1,1))*DEG;
 const dc=180-da-db;if(!(da>0&&db>0&&dc>0))throw Error('Bad angle geometry');
 // Each wedge uses the rays of the original triangle; a rigid rotation maps these into the straight row.
 const starts=[angle(A,B),angle(C,A),angle(B,C)],spans=[da,dc,db];
 return {points,angles:[da,db,dc],pieces:[
  {key:'A',pt:A,start:starts[0],span:da,endStart:0,role:'op'},
  {key:'C',pt:C,start:starts[1],span:dc,endStart:da,role:'focus'},
  {key:'B',pt:B,start:starts[2],span:db,endStart:da+dc,role:'result'}
 ]};}
function format(a){return String(Math.round(a*10)/10).replace(/\.0$/,'')+'°'}
function prose(s){return H('p',{class:'f114-explain',text:s})}
function button(text,onClick,cls='nova-btn ghost'){return H('button',{type:'button',class:cls,onclick:onClick,text})}
function info(head,big,desc){return H('section',{class:'f114-card'},[H('div',{class:'f114-eyebrow',text:head}),H('div',{class:'f114-main',text:big}),H('p',{class:'f114-sub',text:desc})])}
function chalk(svg,x,y,value,role='given',size=35){return N.chalkText(svg,x,y,value,{role,size,anchor:'middle'})}
function line(svg,x1,y1,x2,y2,role='given',width=7){return N.neonLine(svg,x1,y1,x2,y2,{role,width})}
function ring(svg,x,y,r=8,role='given'){return N.neonRing(svg,x,y,{r,role,pulse:false})}
function arcPath(cx,cy,r,s,d){const a=vec(cx,cy,s,r),b=vec(cx,cy,s+d,r);return `M ${a[0]} ${a[1]} A ${r} ${r} 0 ${d>180?1:0} 0 ${b[0]} ${b[1]}`}
function wedgePath(r,s,d){const a=vec(0,0,s,r),b=vec(0,0,s+d,r);return `M 0 0 L ${a[0]} ${a[1]} A ${r} ${r} 0 ${d>180?1:0} 0 ${b[0]} ${b[1]} Z`}
function createWedge(svg,r,start,span,role){N.neonPath(svg,wedgePath(r,start,span),{role,width:5,fill:true}); // F0 neonPath owns visual stroke, glass and glow
 const shape=E('path',{d:wedgePath(r,start,span),fill:'#a4ecff09',stroke:'none','pointer-events':'fill'},svg);return shape}
function stageFrame(stage,tag){
if(window.NovaLessonComponent?.active){[stage,tag]=window.NovaLessonComponent.args("stageFrame",arguments);}
stage.replaceChildren();const scene=H('section',{class:'f114-theatre','data-testid':'f114-stage','data-kind':tag});scene.append(H('div',{class:'f114-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f114-tag',text:'NOVA · NEON CHALK'})]));const layout=H('div',{class:'f114-layout'}),plane=H('div',{class:'f114-plane'});const svg=N.svg.root(730,555,'Accurate triangle with separate corner angle sectors that can be moved to meet on a 180-degree straight line');svg.classList.add('nv-svg','f114-svg');svg.setAttribute('data-testid','f114-svg');svg.removeAttribute('width');svg.removeAttribute('height');plane.append(svg);layout.append(plane);scene.append(layout);stage.append(scene);return {scene,layout,svg,plane}}
function placeSector(g,geom,index,amount=1){const part=geom.pieces[index],pivot=[361,460];const destRotate=part.endStart-part.start;let x=part.pt[0]+(pivot[0]-part.pt[0])*amount,y=part.pt[1]+(pivot[1]-part.pt[1])*amount;
 g.setAttribute('transform',`translate(${x} ${y}) rotate(${destRotate*amount})`);const lbl=g.querySelector('[data-counter-rotate]');if(lbl)lbl.setAttribute('transform',`rotate(${-destRotate*amount} ${lbl.dataset.cx} ${lbl.dataset.cy})`);g.dataset.placed=String(amount===1);return [x,y]}
function fromScenePoint(svg,event){const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function installDraggable(g,svg,index,geom,placed,onCommit){let active=null;g.style.touchAction='none';g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`Corner ${AKEY[index]}. Drag to the 180 degree line or press Enter to position it.`);g.classList.add('f114-draggable');g.setAttribute('data-testid',`f114-piece-${AKEY[index]}`);
 const initial=()=>placed[index];
 g.addEventListener('pointerdown',e=>{if(active||N.ui._drag||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();e.stopPropagation();const was=initial(),p0=fromScenePoint(svg,e),pos0=was?[361,460]:geom.pieces[index].pt,id=e.pointerId;let cur=[...pos0],last=null,raf=0;active={cancel};N.ui._drag=active;
 function refresh(){raf=0;if(!active||!last)return;const q=last;last=null;cur=[pos0[0]+q[0]-p0.x,pos0[1]+q[1]-p0.y];const delta=was?1:0;const part=geom.pieces[index],rot=delta*(part.endStart-part.start);g.setAttribute('transform',`translate(${cur[0]} ${cur[1]}) rotate(${rot})`)}
 function move(ev){if(ev.pointerId!==id)return;ev.preventDefault();const q=fromScenePoint(svg,ev);last=[q.x,q.y];if(!raf)raf=requestAnimationFrame(refresh);let inside=Math.hypot(q.x-361,q.y-460)<110;svg.dataset.dropActive=inside?'true':'false'}
 function cleanup(){if(!active)return;cancelAnimationFrame(raf);active=null;if(N.ui._drag?.cancel===cancel)N.ui._drag=null;svg.dataset.dropActive='false';g.removeEventListener('pointermove',move);g.removeEventListener('pointerup',up);g.removeEventListener('pointercancel',cancel);g.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{if(g.hasPointerCapture(id))g.releasePointerCapture(id)}catch(_){} }
 function up(ev){if(ev.pointerId!==id)return;const q=fromScenePoint(svg,ev);const snap=Math.hypot(q.x-361,q.y-460)<110;cleanup();onCommit(index,snap?true:was)}
 function cancel(){const value=was;cleanup();onCommit(index,value)}
 function lost(){if(active)cancel()}
 function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}
 g.addEventListener('pointermove',move);g.addEventListener('pointerup',up);g.addEventListener('pointercancel',cancel);g.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);
 try{g.setPointerCapture(id)}catch(_){};
 });
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onCommit(index,!placed[index]);}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();onCommit(index,false)}});
}
function taskTriangle(givens){const [alpha,beta]=givens,base=330,ax=192,bx=ax+base,by=331;if(alpha===90){const height=base*Math.tan(beta/DEG);return [[ax,by],[bx,by],[ax,by-height]];}const ca=1/Math.tan(alpha/DEG),cb=1/Math.tan(beta/DEG),height=base/(ca+cb);return [[ax,by],[bx,by],[ax+height*ca,by-height]]}
function drawTriangle(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("drawTriangle",arguments);}
const opts={preset:S.preset,placed:[...S.placed],phase:0,interactive:false,pose:'ruler',caption:'Study the triangle. Its angles are fixed even when the corners move.',showLabels:true,challenge:false,task:null,...o};
 const [A,B,C]=opts.task?.type==='missing'?taskTriangle(opts.task.given):CFG.presets[opts.preset].points;const geom=triangle([A,B,C]);const {scene,layout,svg}=stageFrame(stage,'triangle');const sketch=E('g',{},svg);
 // Canonical maths linework is F0 neonPath, never hand-built stroke styling.
 const d=`M ${A[0]} ${A[1]} L ${B[0]} ${B[1]} L ${C[0]} ${C[1]} Z`;
 N.neonPath(sketch,d,{role:'given',width:7,fill:true});if(opts.placed.some(Boolean))sketch.style.opacity='.45';
 // A translucent ghost remains to show origin vertices when wedges detach.
 for(let [i,pt] of [A,B,C].entries()){ring(sketch,pt[0],pt[1],8,'given');let lbl=['A','B','C'][i];chalk(svg,pt[0]+(i===1?20:i===0?-22:0),pt[1]+(i===2?-16:32),lbl,'given',29)}
 const sum=geom.angles.reduce((t,a)=>t+a,0);
 // Central assembly target: each corner is rotated rigidly, with no shape distortion, to exactly fill this half-turn.
 const target=E('g',{'data-testid':'f114-target','pointer-events':'none'},svg);line(target,150,460,574,460,'given',6);N.neonPath(target,arcPath(361,460,101,0,180),{role:'focus',width:2});ring(target,361,460,7,'result');chalk(svg,361,530,'STRAIGHT LINE · 180°','op',30);
 if(opts.phase>0||opts.interactive)chalk(svg,361,345,'BRING THE CORNERS HERE','focus',27);
 // Copy the REAL interior sectors from each vertex. Rotating them does not alter their angles.
 const sectors=[];
 geom.pieces.forEach((piece,i)=>{const g=E('g',{'data-part':piece.key,'data-angle':String(piece.span)},svg);let moved=opts.placed[i],amount=moved?1:0;
 // During staged teaching, reveal corners progressively, never put the result on first frame.
 if(opts.phase===0&&!opts.interactive)g.style.opacity='.14';
 createWedge(g,98,piece.start,piece.span,piece.role);
 const mid=piece.start+piece.span/2,label=vec(0,0,mid,60);
 const labelGroup=E('g',{'data-counter-rotate':'true','data-cx':label[0],'data-cy':label[1]+7},g);let sectorText=opts.challenge&&opts.task?.type==='missing'?(i===0?format(opts.task.given[0]):i===2?format(opts.task.given[1]):opts.phase>=5?format(piece.span):'?'):opts.showLabels?format(piece.span):piece.key;chalk(labelGroup,label[0],label[1]+7,sectorText,piece.role,28);
 placeSector(g,geom,i,amount);sectors.push(g);
 });
 const side=H('aside',{class:'f114-aside'});const count=opts.placed.filter(Boolean).length;if(count===3)scene.classList.add('f114-complete-layout');
 side.append(info('TRIANGLE CORNERS',opts.interactive?`${count} / 3 JOINED`:opts.phase<2?'3 ANGLES':opts.phase<5?`${count} MOVED`:'3 JOINED',opts.interactive?'Move each corner into the common central point.':'The corner sectors preserve their original sizes.'),info('THE ANGLE TOTAL',opts.phase>=5||opts.interactive&&count===3?'180°':'? + ? + ?',opts.phase>=5?'The three angles form a straight line.':opts.interactive?'Put all corners together before revealing the total.':'Watch the interior corners move without bending.'),info('EVIDENCE',opts.phase>=5?geom.angles.map(format).join(' + '):'SAME THREE CORNERS',opts.phase>=5?`${geom.angles.map(v=>v.toFixed(1)).join(' + ')} = ${sum.toFixed(1)} degrees`:'Sliding and rotating a corner does not change its angle.'));
 layout.append(side);
 if(opts.interactive){sectors.forEach((g,i)=>installDraggable(g,svg,i,geom,opts.placed,(ix,val)=>opts.onToggle?.(ix,val)));}
 N.scene.helperStrip(scene,opts.pose,opts.caption);
 return {scene,svg,geom,sectors};
}
function drawQuadrilateral(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("drawQuadrilateral",arguments);}
const {scene,layout,svg}=stageFrame(stage,'quadrilateral');const pts=CFG.presets.quad.points;const path='M '+pts.map(p=>p.join(' ')).join(' L ')+' Z';N.neonPath(svg,path,{role:'given',width:8,fill:true});line(svg,...pts[0],...pts[2],'op',6);
 const t1=triangle([pts[0],pts[1],pts[2]]),t2=triangle([pts[0],pts[2],pts[3]]);
 for(let [i,p] of pts.entries()){ring(svg,p[0],p[1],9,'result');chalk(svg,p[0]+(i===1?24:i===0?-21:0),p[1]+(i<2?30:-20),String.fromCharCode(65+i),'given',29)}
 chalk(svg,352,274,'180°','focus',39);chalk(svg,351,161,'180°','op',39);
 chalk(svg,370,500,o.reveal?'180° + 180° = 360°':'HOW MANY TRIANGLES?','op',31);
 const side=H('aside',{class:'f114-aside'});side.append(info('DIVIDE THE POLYGON','2 TRIANGLES','A diagonal splits any simple convex quadrilateral into two triangles.'),info('TOTAL INTERIOR ANGLES',o.reveal?'360°':'?','Each triangle adds 180°, so the quadrilateral totals 360°.'),info('REASON',o.reveal?'2 × 180°':'FOLLOW THE DIAGONAL','No stretching or estimating is involved.'));
 layout.append(side);N.scene.helperStrip(scene,o.pose||'idea',o.caption||'A quadrilateral can be split into two triangles, each with an angle total of one hundred and eighty degrees.');return {scene,svg,t1,t2};}
const STEPS=[
 {name:'Notice three different corners',p:'scalene',place:[],phase:0,mood:'explain',narration:'This triangle has three interior corners. How might we find their total without measuring? '},
 {name:'Reveal the true interior angles',p:'scalene',place:[],phase:1,mood:'magnify',narration:'Each coloured sector is the angle inside one corner of the triangle.'},
 {name:'Lift off corner A',p:'scalene',place:[0],phase:2,mood:'point-left',narration:'Move corner A. The angle sector is rigid; it does not change size.'},
 {name:'Lift off the top corner C',p:'scalene',place:[0,1],phase:3,mood:'point-down',narration:'Place the top angle beside the first. The two arcs meet with no overlap.'},
 {name:'Lift off the final corner B',p:'scalene',place:[0,1,2],phase:4,mood:'count',narration:'The last interior corner completes the row. Check the ends of the assembled sectors.'},
 {name:'Discover the straight angle',p:'scalene',place:[0,1,2],phase:5,mood:'idea',narration:'All three corners make one straight angle. A straight angle is one hundred and eighty degrees.'},
 {name:'Try a right-angled triangle',p:'right',place:[],phase:1,mood:'ruler',narration:'This triangle has a right angle. Will the three corners still make a straight line?'},
 {name:'Reassemble the right triangle',p:'right',place:[0,1,2],phase:5,mood:'compare',narration:'Yes. A different triangle still has one hundred and eighty degrees in its three corners.'},
 {name:'Try an obtuse triangle',p:'obtuse',place:[0,1,2],phase:5,mood:'think',narration:'Even a wide obtuse triangle gives the same total. Its angles change, but the sum does not.'},
 {name:'Transfer to a quadrilateral',p:'quad',quad:true,phase:0,mood:'ruler',narration:'A diagonal divides a quadrilateral into two triangles. What will their combined angle total be?'},
 {name:'Prove the quadrilateral total',p:'quad',quad:true,phase:5,mood:'celebrate',narration:'Two triangles make two lots of one hundred and eighty degrees. The quadrilateral has three hundred and sixty degrees.'}
];
function render(i,stage){const s=STEPS[i]||STEPS[0];if(s.quad)return drawQuadrilateral(stage,{reveal:s.phase>=5,pose:s.mood,caption:s.narration});const placed=[0,1,2].map(j=>s.place.includes(j));return drawTriangle(stage,{preset:s.p,placed,phase:s.phase,pose:s.mood,caption:s.narration,showLabels:s.phase>=1});}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f114-tools');window.NovaLessonComponent?.applyExploreModels();let state=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("state",()=>({p:S.preset==='quad'?'scalene':S.preset,placed:[...S.placed]})):({p:S.preset==='quad'?'scalene':S.preset,placed:[...S.placed]}));
 window.NovaLessonComponent?.applyExploreModels();function paint(){const c=state.placed.filter(Boolean).length;drawTriangle(stage,{preset:state.p,placed:state.placed,interactive:true,showLabels:true,phase:c===3?5:2,pose:c===3?'celebrate':'ruler',caption:c===3?'Your three corners meet exactly to form a straight line! Now change the triangle.':'Drag each coloured corner to the glowing centre of the straight line. Press Enter on a selected corner as a keyboard alternative.',onToggle:(i,yes)=>{state.placed[i]=yes;S.placed=[...state.placed];emit('corner',{corner:AKEY[i],placed:yes});paint()}})}
 window.NovaLessonComponent?.applyExploreModels();function controls(){panel.replaceChildren();let select=H('select',{class:'nova-input','data-testid':'f114-preset','aria-label':'Choose a triangle preset'});Object.entries(CFG.presets).filter(([k,v])=>!v.quad).forEach(([k,v])=>select.append(H('option',{value:k,text:v.label})));select.value=state.p;select.onchange=()=>{state.p=select.value;state.placed=[false,false,false];S.preset=state.p;S.placed=[...state.placed];emit('preset',state.p);controls();paint()};panel.append(H('label',{class:'f114-span'},['CHOOSE A TRIANGLE',select]));
 let actions=H('div',{class:'f114-actions f114-span'});actions.append(button('Assemble all three corners',()=>{state.placed=[true,true,true];emit('corner',{all:true});paint()},'nova-btn primary'),button('Return all corners',()=>{state.placed=[false,false,false];emit('reset',state.p);paint()}));panel.append(actions);
 panel.append(prose('Each section is a mathematically exact corner sector. Move it with the pointer, or Tab to a corner and press Enter. Delete returns it to its triangle. Escape cancels a drag.'));paint()}
 window.NovaLessonComponent?.applyExploreModels();controls();}
const TASKS=[
 {type:'missing',p:'scalene',given:[48,67],answer:65,reason:'sum',text:'A triangle has two interior angles of 48° and 67°. What is the third angle?',hint:'Subtract both angles from 180°.',why:'180 − 48 − 67 = 65°.'},
 {type:'missing',p:'right',given:[90,31],answer:59,reason:'sum',text:'A right-angled triangle has another angle of 31°. Find the missing interior angle.',hint:'The total is still 180°, including the 90° right angle.',why:'180 − 90 − 31 = 59°.'},
 {type:'total',p:'isosceles',answer:180,reason:'tear',text:'When you tear off all three corners of an isosceles triangle, how many degrees do they form?',hint:'The three corners lie along one straight line.',why:'The assembled corners form a straight angle: 180°.'},
 {type:'missing',p:'obtuse',given:[111,28],answer:41,reason:'sum',text:'A triangle has angles of 111° and 28°. Find the last angle.',hint:'An obtuse triangle still has the same interior angle sum.',why:'180 − 111 − 28 = 41°.'},
 {type:'quad',p:'quad',answer:360,reason:'quad',text:'A diagonal splits a convex quadrilateral into two triangles. Find its interior angle sum.',hint:'Each of the two triangles has an angle sum of 180°.',why:'2 × 180° = 360°.'}
];
const REASONS={tear:'The three corner sectors form a straight angle',sum:'Interior angles of a triangle total 180°',quad:'A diagonal makes two triangles with 180° each',point:'Angles around a point total 360°'};
function challenge(panel,api,stage){panel.classList.add('f114-tools');let index=0;
 function paint(){const task=TASKS[index];S.taskIndex=index;panel.replaceChildren();const label=H('div',{class:'pr-task f114-span',text:`CHALLENGE ${index+1} / ${TASKS.length}`});panel.append(label,prose(task.text));
 const answer=H('input',{class:'nova-input','data-testid':'f114-answer',type:'number',min:0,max:360,step:1,placeholder:'Enter the angle in degrees','aria-label':'Answer in degrees'});panel.append(H('label',{class:'f114-question f114-span'},['YOUR ANGLE (°)',answer]));
 let chosen='',buttons=H('div',{class:'f114-reasons f114-span'}),drop=H('div',{class:'f114-drop f114-span',text:'Select or drag the correct mathematical reason here','data-testid':'f114-reason-drop'});
 function select(k){chosen=k;S.reason=k;emit('reason',k);drop.textContent=REASONS[k];drop.dataset.set='true';buttons.querySelectorAll('[data-reason]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))}
 Object.entries(REASONS).forEach(([k,t])=>{let btn=H('button',{class:'f114-reason',type:'button','data-reason':k,'aria-pressed':'false',text:t,onclick:()=>select(k)});buttons.append(btn);
  let active=null;btn.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||N.ui._drag)return;const id=e.pointerId,sx=e.clientX,sy=e.clientY;let ghost=null,dragging=false;active={cancel};
   function move(ev){if(ev.pointerId!==id)return;const distance=Math.hypot(ev.clientX-sx,ev.clientY-sy);if(!dragging&&distance>8){dragging=true;ghost=H('div',{class:'f114-ghost',text:t});document.body.append(ghost);N.ui._drag=active}if(dragging){ev.preventDefault();ghost.style.left=(ev.clientX+12)+'px';ghost.style.top=(ev.clientY+12)+'px';let r=drop.getBoundingClientRect();drop.dataset.hover=String(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)}}
   function cleanup(){ghost?.remove();drop.dataset.hover='false';if(N.ui._drag===active)N.ui._drag=null;btn.removeEventListener('pointermove',move);btn.removeEventListener('pointerup',up);btn.removeEventListener('pointercancel',cancel);btn.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{if(btn.hasPointerCapture(id))btn.releasePointerCapture(id)}catch(_){}active=null}
   function up(ev){if(ev.pointerId!==id)return;let r=drop.getBoundingClientRect();let ok=dragging&&ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;cleanup();if(ok)select(k)}function cancel(){cleanup()}function lost(){if(active)cancel()}function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}
   btn.addEventListener('pointermove',move);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',cancel);btn.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);try{btn.setPointerCapture(id)}catch(_){}
  });
 });panel.append(buttons,drop);const actions=H('div',{class:'f114-actions f114-span'});panel.append(actions);
 function draw(done=false){if(task.type==='quad')drawQuadrilateral(stage,{reveal:done,pose:done?'celebrate':'think',caption:done?'You used two triangles to justify three hundred and sixty degrees.':'Work out how many triangles make up the quadrilateral.'});else drawTriangle(stage,{preset:task.p,task,placed:done?[true,true,true]:[false,false,false],phase:done?5:1,challenge:true,pose:done?'celebrate':'think',showLabels:true,caption:done?'Correct. The three corner sectors always make a straight line.':'Identify the missing or total angle and give the matching mathematical reason.'})}
 actions.append(button('Check angle + reason',()=>{const n=Number(answer.value);let msg='';if(!answer.value.trim()||!Number.isFinite(n))msg='Enter a numerical answer in degrees.';else if(n!==task.answer)msg=n===task.given?.reduce((a,b)=>a+b,0)?'That is the sum of the given angles. Subtract it from 180°.':`That does not satisfy the ${task.type==='quad'?'two triangle':'triangle'} angle sum. Recheck your total.`;else if(chosen!==task.reason)msg='Your angle is correct, but your reason does not prove it. Pick the appropriate fact.';
 if(msg){S.wrong++;api.check(false,msg,{task:index+1});draw(false);return}api.check(true,task.why,{task:index+1,answer:task.answer,reason:chosen});emit('answer',{task:index+1,value:n});draw(true);actions.replaceChildren();if(index===TASKS.length-1)actions.append(H('p',{class:'f114-complete',text:'5 / 5 · ANGLE SUMS MASTERED'}));else actions.append(button('Next construction →',()=>{index++;paint()},'nova-btn primary'))},'nova-btn primary'),button('Hint',()=>api.hint(task.hint)));
 answer.addEventListener('keydown',e=>{if(e.key==='Enter')actions.querySelector('button')?.click()});draw(false);
 }
 paint();}
const def={id:ID,title:'Triangle Angle-Sum Tear-Off',config:CFG,steps:STEPS,render,explore,challenge,alt:'A precision-drawn triangle with three independent interior angle sectors. Drag the three corners to a common vertex on a straight line. Correct angles always total 180 degrees.',staticAlt:'In every triangle, the three interior angles add to 180 degrees. Reassembling the three intact corner sectors forms a straight angle. Two triangles make a quadrilateral interior angle sum of 360 degrees.',exploreIntro:'Tear off all three exact corner angles and fit them together without gaps or overlaps.',onRestore:()=>{S.preset='scalene';S.placed=[false,false,false]}};
N.registry.add({id:ID,title:'Triangle Angle-Sum Tear-Off',family:'F11',topics:['triangles','angle sum','tear-off','quadrilateral','geometry'],deps:['F0-02','F0-04','F0-07','F0-08','F11-03']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"AKEY":()=>AKEY,"palette":()=>palette,"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"stageFrame":["stage","tag"],"drawTriangle":["stage","o"],"drawQuadrilateral":["stage","o"]},exploreFields:{"state":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'04',title:'Triangle Angle-Sum Tear-Off · Premium Edition',def,linked:['F11-03','F11-05','F12-01','F12-03'],years:'Years 7–8 · Triangle and quadrilateral interior angle totals',spec:{purpose:'Prove the triangle angle sum by moving exactly drawn, rigid interior-angle sectors onto a straight line; transfer to quadrilaterals.',params:'Triangle vertices, interior angle measures, corner piece positions, wedge orientation, shape preset.',presets:'Y7-043 scalene, right, isosceles and obtuse triangles; Y7-044 quadrilateral from two triangles.',steps:'Eleven stages from revealing the corners, to tear-off, assembly, different triangles and quadrilateral transfer.',interactions:'Direct fast pointer-captured corner drags, 180 degree snap target, keyboard Enter/Delete, Escape cancel, task checking and draggable reason cards.',traps:'Assuming only equilateral triangles total 180°, adding just two angles, confusing the quadrilateral 360° total with the triangle 180° total.',gcse:'Early geometric proof: a diagonal divides a convex quadrilateral into two triangles.'}});
})();
