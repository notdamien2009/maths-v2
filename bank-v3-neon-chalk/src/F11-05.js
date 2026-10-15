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

/* NOVA F11-05 · Parallel Lines Explorer. Only approved F0 helpers; core files unmodified.
   Mathematically exact paired angles for horizontal parallel lines, a variable transversal,
   bearing transfer, live rotary dragging and evidence-based challenges. */
const F115_CONFIG=Object.freeze({id:'F11-05',family:'F11',defaultPreset:'year7',presets:{
 year7:{label:'Y7-042 · Parallel line angle facts',theta:57,kind:'corresponding'},
 year9:{label:'Y9-025 · Multi-step angle chase',theta:64,kind:'cointerior'},
 bearings8:{label:'Y8-052 · Parallel north lines',theta:52,kind:'bearings'},
 bearings9:{label:'Y9-039 · Bearings and transfer',theta:68,kind:'bearings'}
},events:{value:['preset','angle','relation','answer','reason','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F115_CONFIG=F115_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,CFG=window.NovaV2Integration.configuration(F115_CONFIG),ID=CFG.id,RAD=Math.PI/180;
N.premium?.enable?.();
const REL={
 corresponding:{title:'Corresponding angles',pattern:'F',rule:'Equal when two parallel lines are cut by a transversal',reason:'Corresponding angles are equal on parallel lines',name:'corresponding'},
 alternate:{title:'Alternate interior angles',pattern:'Z',rule:'Equal inside the lines on opposite sides of the transversal',reason:'Alternate interior angles are equal on parallel lines',name:'alternate'},
 cointerior:{title:'Co-interior angles',pattern:'C',rule:'Same-side interior angles add up to 180°',reason:'Co-interior angles on parallel lines add to 180°',name:'cointerior'},
 vertically:{title:'Vertically opposite angles',pattern:'X',rule:'Opposite angles at one intersection are equal',reason:'Vertically opposite angles are equal',name:'vertically'},
 bearings:{title:'Parallel north lines',pattern:'N',rule:'Two north lines are parallel; matching clockwise bearings are equal',reason:'Corresponding bearings measured clockwise from parallel north lines are equal',name:'bearings'}
};
const S={preset:'year7',theta:57,kind:'corresponding',mode:'watch'};
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw new Error('Unknown NOVA event '+key);N.events.emit('value',{engine:ID,key,value})};
const clamp=(n,l,h)=>Math.max(l,Math.min(h,n));
const vec=(x,y,a,r)=>[x+Math.cos(a*RAD)*r,y-Math.sin(a*RAD)*r];
const angleText=n=>String(Math.round(n))+'°';
const button=(txt,fn,cls='nova-btn ghost')=>H('button',{class:cls,type:'button',text:txt,onclick:fn});
const prose=txt=>H('p',{class:'f115-explain',text:txt});
const card=(head,big,desc)=>H('section',{class:'f115-card'},[H('div',{class:'f115-eyebrow',text:head}),H('div',{class:'f115-main',text:String(big)}),H('p',{class:'f115-sub',text:desc})]);
const chalk=(s,x,y,t,role='given',size=28)=>N.chalkText(s,x,y,String(t),{role,size,anchor:'middle'});
const line=(s,x1,y1,x2,y2,role='given',w=7)=>N.neonLine(s,x1,y1,x2,y2,{role,width:w});
const ring=(s,x,y,r=9,role='given')=>N.neonRing(s,x,y,{r,role,pulse:false});
function arcPath(x,y,r,start,span){let a=vec(x,y,start,r),b=vec(x,y,start+span,r);return `M ${a[0]} ${a[1]} A ${r} ${r} 0 ${span>180?1:0} 0 ${b[0]} ${b[1]}`}
function sector(s,x,y,r,start,span,role,highlight=true){const a=vec(x,y,start,r),b=vec(x,y,start+span,r),d=`M ${x} ${y} L ${a[0]} ${a[1]} A ${r} ${r} 0 ${span>180?1:0} 0 ${b[0]} ${b[1]} Z`;N.neonPath(s,d,{role,width:highlight?3.5:1.5,fill:true});N.neonPath(s,arcPath(x,y,r,start,span),{role,width:highlight?6:2.5});}
function stageFrame(stage,label){
if(window.NovaLessonComponent?.active){[stage,label]=window.NovaLessonComponent.args("stageFrame",arguments);}
stage.replaceChildren();const scene=H('section',{class:'f115-theatre','data-testid':'f115-stage','data-kind':label});scene.append(H('div',{class:'f115-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f115-tag',text:'NOVA · NEON CHALK'})]));let layout=H('div',{class:'f115-layout'}),plane=H('div',{class:'f115-plane'});let svg=N.svg.root(730,555,'Two precise parallel lines with a transversal and matching interior and exterior angles');svg.classList.add('nv-svg','f115-svg');svg.dataset.testid='f115-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(window.matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','114 58 526 492');plane.append(svg);layout.append(plane);scene.append(layout);stage.append(scene);return {scene,layout,svg,plane};}
function pair(kind){switch(kind){case 'alternate':return [{at:0,q:'SW'},{at:1,q:'NE'}];case 'cointerior':return [{at:0,q:'SE'},{at:1,q:'NE'}];case 'vertically':return [{at:0,q:'NE'},{at:0,q:'SW'}];default:return [{at:0,q:'NE'},{at:1,q:'NE'}];}}
const QUAD={NE:t=>[0,t],NW:t=>[t,180-t],SW:t=>[180,t],SE:t=>[180+t,180-t]};
function valueOf(theta,q){return (q==='NE'||q==='SW')?theta:180-theta}
function intersection(theta){let x0=393,yt=172,yb=357,dx=(yb-yt)/Math.tan(theta*RAD);return {top:[x0,yt],bottom:[x0-dx,yb],xAt:y=>x0+(yt-y)/Math.tan(theta*RAD)};}
function renderDiagram(svg,theta,kind,phase=4,opt={}){
 // Rebuild only the SVG maths sublayer. Stage shell and mascot remain intact.
 const old=svg.querySelector('[data-layer=geometry]');old?.remove();const art=E('g',{'data-layer':'geometry','data-testid':'f115-geometry'},svg);const active=pair(kind),data=intersection(theta),[top,bottom]=[data.top,data.bottom];
 const baseA=phase>=0?1:.25,transOn=phase>=1;
 const b1=E('g',{opacity:String(baseA)},art);line(b1,92,top[1],640,top[1],'given',8);line(b1,92,bottom[1],640,bottom[1],'given',8);
 // Identical chevrons are parallelism marks, always drawn with the core neonLine primitive.
 for(const y of [top[1],bottom[1]]){for(const x of [116,607]){line(art,x-9,y-9,x,y,'focus',2.5);line(art,x-9,y+9,x,y,'focus',2.5)}}
 if(transOn){line(art,data.xAt(72),72,data.xAt(462),462,'op',8);ring(art,...top,9,'result');ring(art,...bottom,9,'result');}
 const labels=[{label:'ℓ₁',y:top[1]-19},{label:'ℓ₂',y:bottom[1]+32}];labels.forEach(t=>chalk(art,621,t.y,t.label,'given',26));
 let arcs=(phase>=2||opt.free||opt.challenge);
 let shows=(phase>=3||opt.free||opt.challenge),result=(phase>=4||opt.free||opt.complete);
 if(arcs){const q1=active[0],q2=active[1];[q1,q2].forEach((q,i)=>{let at=q.at===0?top:bottom,[start,span]=QUAD[q.q](theta),role=i===0?'focus':'result';sector(art,at[0],at[1],65,start,span,role,true);const m=start+span/2,t=vec(at[0],at[1],m,94),v=valueOf(theta,q.q);
 const label=opt.givenOnly&&i===1&&!opt.complete?'x':result||i===0?angleText(v):i===1?'?':'A';if(shows)chalk(art,t[0],t[1]+10,label,role,30);
 E('path',{d:arcPath(at[0],at[1],73,start,span),fill:'none',stroke:'transparent','stroke-width':14,'data-angle-index':String(i),'pointer-events':'none'},art)
 });}
 if(phase>=2||opt.free){let x=148,y=500;chalk(art,x,y,kind==='corresponding'?'F':kind==='alternate'?'Z':kind==='cointerior'?'C':'X','op',44);chalk(art,410,y,REL[kind]?.title||'Matching angles','focus',26)}
 if(opt.free||opt.interactive){
 const pt=vec(...top,theta,window.matchMedia('(max-width:760px)').matches?91:145);
 // Large handle follows the upper transversal ray. Use F0 neon ring for visible target.
 ring(art,pt[0],pt[1],13,'result');let h=svg.querySelector(':scope > [data-testid=f115-handle]');const fresh=!h;if(!h)h=E('circle',{r:26,fill:'transparent',stroke:'none','data-testid':'f115-handle','aria-label':'Rotate transversal. Arrow keys adjust by one degree.','role':'slider',tabindex:0,'aria-valuemin':40,'aria-valuemax':78,class:'f115-angle-handle',style:'touch-action:none'},svg);h.setAttribute('cx',pt[0]);h.setAttribute('cy',pt[1]);h.setAttribute('aria-valuenow',String(theta));h.setAttribute('aria-valuetext',angleText(theta));if(fresh)opt.onHandle?.(h);
 }
 return {data,active};
}
function bearingDiagram(svg,theta,phase=4,opt={}){
 svg.querySelector('[data-layer=geometry]')?.remove();const art=E('g',{'data-layer':'geometry'},svg),ax=212,bx=510,ay=366,by=160;
 for(let x of [ax,bx]){line(art,x,84,x,462,'given',8);chalk(art,x,71,'N','focus',30);line(art,x-12,124,x,107,'focus',3);line(art,x+12,124,x,107,'focus',3);}
 const bearing=(a)=>[a[0]+Math.sin(theta*RAD)*130,a[1]-Math.cos(theta*RAD)*130];
 for(const [i,p] of [[0,[ax,ay]],[1,[bx,by]]]){let q=bearing(p);line(art,...p,...q,'op',7);ring(art,...p,10,'result');if(phase>=2||opt.free){sector(art,p[0],p[1],55,90-theta,theta,'focus',true);let tx=vec(...p,90-theta/2,86);chalk(art,tx[0],tx[1],phase>=4||opt.free?(String(theta).padStart(3,'0')+'°'):(i===0?'bearing':'?'),'focus',27)}}
 chalk(art,355,508,'NORTH LINES ARE PARALLEL','focus',30);
 if(opt.free){let p=bearing([ax,ay]);ring(art,...p,12,'result');let h=svg.querySelector(':scope > [data-testid=f115-handle]');const fresh=!h;if(!h)h=E('circle',{r:25,fill:'transparent','data-testid':'f115-handle',role:'slider',tabindex:0,'aria-valuemin':40,'aria-valuemax':78,'aria-label':'Drag the course ray to change its clockwise bearing',style:'touch-action:none',class:'f115-angle-handle'},svg);h.setAttribute('cx',p[0]);h.setAttribute('cy',p[1]);h.setAttribute('aria-valuenow',String(theta));if(fresh)opt.onHandle?.(h,[ax,ay],'bearing')}
}
function wireFastDrag(handle,svg,theta,onAngle,pivot,kind){let drag=null;function at(e){let p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
 function toAngle(e){let q=at(e);if(kind==='bearing')return clamp(Math.round(Math.atan2(q.x-pivot[0],pivot[1]-q.y)/RAD),40,78);return clamp(Math.round(Math.atan2(pivot[1]-q.y,q.x-pivot[0])/RAD),40,78)}
 handle.addEventListener('pointerdown',e=>{if(N.ui._drag||e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();e.stopPropagation();let id=e.pointerId,saved=Number(handle.getAttribute('aria-valuenow'))||theta,raf=0,next=null;drag={cancel:()=>cancel(),captured:true,moved:true};N.ui._drag=drag;
 const flush=()=>{raf=0;if(next!==null){let x=next;next=null;onAngle(x,false)}};
 const move=ev=>{if(ev.pointerId!==id)return;ev.preventDefault();next=toAngle(ev);if(!raf)raf=requestAnimationFrame(flush)};
 const clean=()=>{cancelAnimationFrame(raf);const savedDrag=drag;drag=null;if(N.ui._drag===savedDrag)N.ui._drag=null;handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{handle.releasePointerCapture(id)}catch(_){}};
 const up=ev=>{if(ev.pointerId!==id)return;let v=toAngle(ev);clean();onAngle(v,true)};
 const cancel=()=>{clean();onAngle(saved,true)};
 const lost=()=>{if(drag)cancel()};const key=ev=>{if(ev.key==='Escape'){ev.preventDefault();cancel()}};
 handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);
 try{handle.setPointerCapture(id)}catch(_){}}
 );
 handle.addEventListener('keydown',e=>{let a=0;if(e.key==='ArrowUp'||e.key==='ArrowRight')a=e.shiftKey?5:1;if(e.key==='ArrowDown'||e.key==='ArrowLeft')a=e.shiftKey?-5:-1;if(a){e.preventDefault();onAngle(clamp((Number(handle.getAttribute('aria-valuenow'))||theta)+a,40,78),true)}});
}
function draw(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("draw",arguments);}
const opt={theta:S.theta,kind:S.kind,phase:4,preset:S.preset,pose:'explain',caption:'Follow the matching angles through both intersections.',free:false,challenge:false,complete:false,givenOnly:false,...o};let {scene,layout,svg}=stageFrame(stage,opt.kind);
 const isBearing=opt.kind==='bearings';let infoLayer=H('aside',{class:'f115-aside'});const rule=REL[opt.kind];const original=isBearing?opt.theta:valueOf(opt.theta,pair(opt.kind)[0].q),second=isBearing?opt.theta:valueOf(opt.theta,pair(opt.kind)[1].q);
 infoLayer.append(card('ANGLE RELATION',opt.phase>=2||opt.free||opt.challenge?rule.title:'DISCOVER THE PAIR',rule.rule),card('FIRST / SECOND',opt.phase>=3||opt.free||opt.challenge?angleText(original)+' / '+(opt.phase>=4||opt.free||opt.complete?angleText(second):'?'):'? / ?',opt.kind==='cointerior'?'These same-side interior angles add to 180°.':'Both highlighted angles have the stated relationship.'),card('MATHEMATICAL REASON',opt.phase>=4||opt.free?rule.reason:'Watch the matching arcs highlight.',isBearing?'Bearing directions use parallel north lines.':'A proof should name the correct angle fact.'));
 layout.append(infoLayer);
 const repaint=t=>{if(isBearing)bearingDiagram(svg,t,opt.phase,opt);else renderDiagram(svg,t,opt.kind,opt.phase,opt)};
 if(opt.free){opt.onHandle=(handle,pivot,bearing)=>wireFastDrag(handle,svg,opt.theta,(v,commit)=>{opt.theta=v;if(commit){S.theta=v;emit('angle',v);}repaint(v);opt.liveValue?.(v)},pivot||intersection(opt.theta).top,bearing);}
 repaint(opt.theta);
 N.scene.helperStrip(scene,opt.pose,opt.caption);
 return {svg,scene};
}
const STEPS=[
 {name:'Notice two parallel lines',theta:57,kind:'corresponding',phase:0,pose:'explain',narration:'These two straight lines stay the same distance apart. They are parallel.'},
 {name:'Add a transversal',theta:57,kind:'corresponding',phase:1,pose:'point-down',narration:'A third line crosses both parallel lines. This is the transversal.'},
 {name:'Find corresponding positions',theta:57,kind:'corresponding',phase:2,pose:'magnify',narration:'Notice the same position at each crossing, like the corners of a letter F.'},
 {name:'Compare corresponding angles',theta:57,kind:'corresponding',phase:3,pose:'compare',narration:'The two highlighted angles sit in corresponding positions. Predict whether they match.'},
 {name:'Prove corresponding angles equal',theta:57,kind:'corresponding',phase:4,pose:'idea',narration:'Corresponding angles on parallel lines are equal. Both highlighted angles measure fifty-seven degrees.'},
 {name:'Look inside the parallel lines',theta:63,kind:'alternate',phase:2,pose:'point-left',narration:'Look for interior angles on opposite sides of the transversal. Trace a letter Z.'},
 {name:'Alternate interior angles match',theta:63,kind:'alternate',phase:4,pose:'show-two',narration:'Alternate interior angles are equal when the crossed lines are parallel.'},
 {name:'Find same-side interior angles',theta:68,kind:'cointerior',phase:3,pose:'think',narration:'These two angles lie inside the parallel lines on the same side of the transversal.'},
 {name:'Co-interior angles total 180°',theta:68,kind:'cointerior',phase:4,pose:'count',narration:'Co-interior angles add to one hundred and eighty degrees: one hundred and twelve and sixty-eight.'},
 {name:'Use vertically opposite angles',theta:74,kind:'vertically',phase:4,pose:'compare',narration:'At one intersection, opposite angles match. This fact works for any pair of crossing lines.'},
 {name:'Change the transversal',theta:51,kind:'alternate',phase:4,pose:'ruler',narration:'Change the crossing direction. The angle values change, but the angle facts remain true.'},
 {name:'Transfer to bearings',theta:52,kind:'bearings',phase:4,pose:'point-down',narration:'North lines are parallel. Corresponding clockwise bearings give us the same three-figure direction.'},
 {name:'Explain the mathematics',theta:64,kind:'cointerior',phase:4,pose:'celebrate',narration:'Always state the mathematical reason: corresponding, alternate, vertically opposite, or co-interior.'}
];
function render(i,stage){let step=STEPS[i]||STEPS[0];draw(stage,{...step,caption:step.narration})}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f115-tools');window.NovaLessonComponent?.applyExploreModels();let state=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("state",()=>({theta:S.theta,kind:S.kind,preset:S.preset})):({theta:S.theta,kind:S.kind,preset:S.preset}));window.NovaLessonComponent?.applyExploreModels();let readout=null;
 window.NovaLessonComponent?.applyExploreModels();function paint(){draw(stage,{...state,phase:4,free:true,pose:'ruler',caption:'Drag the glowing ring to change the angle. Both highlighted angles update immediately. Arrow keys adjust by one degree.',liveValue:v=>{state.theta=v;readout.textContent=angleText(v);range.value=String(v);const h=stage.querySelector('[data-testid=f115-handle]');if(h)h.setAttribute('aria-valuenow',String(v))}})}
 window.NovaLessonComponent?.applyExploreModels();panel.replaceChildren();window.NovaLessonComponent?.applyExploreModels();let select=H('select',{class:'nova-input','data-testid':'f115-preset','aria-label':'Choose a lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([k,v])=>select.append(H('option',{value:k,text:v.label})));window.NovaLessonComponent?.applyExploreModels();select.value=state.preset;
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('label',{class:'f115-span'},['LESSON PRESET',select]));window.NovaLessonComponent?.applyExploreModels();let kinds=H('select',{class:'nova-input','data-testid':'f115-kind','aria-label':'Choose an angle relationship'});window.NovaLessonComponent?.applyExploreModels();Object.entries(REL).forEach(([k,v])=>kinds.append(H('option',{value:k,text:v.title})));window.NovaLessonComponent?.applyExploreModels();kinds.value=state.kind;window.NovaLessonComponent?.applyExploreModels();panel.append(H('label',{},['ANGLE RELATION',kinds]));
 window.NovaLessonComponent?.applyExploreModels();let range=H('input',{type:'range',min:40,max:78,step:1,value:state.theta,'data-testid':'f115-angle-range','aria-label':'Angle of the transversal in degrees'});window.NovaLessonComponent?.applyExploreModels();readout=H('strong',{class:'f115-inline-val','data-testid':'f115-angle-display',text:angleText(state.theta)});window.NovaLessonComponent?.applyExploreModels();panel.append(H('label',{},['TRANSVERSAL ANGLE',range]),readout);
 window.NovaLessonComponent?.applyExploreModels();range.oninput=()=>{state.theta=Number(range.value);S.theta=state.theta;readout.textContent=angleText(state.theta);emit('angle',state.theta);paint()};
 window.NovaLessonComponent?.applyExploreModels();kinds.onchange=()=>{state.kind=kinds.value;S.kind=state.kind;emit('relation',state.kind);paint()};
 window.NovaLessonComponent?.applyExploreModels();select.onchange=()=>{state.preset=select.value;let p=CFG.presets[state.preset];state.theta=p.theta;state.kind=p.kind;S.preset=state.preset;S.theta=state.theta;S.kind=state.kind;range.value=String(state.theta);kinds.value=state.kind;readout.textContent=angleText(state.theta);emit('preset',state.preset);paint()};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('div',{class:'f115-actions f115-span'},[button('Reset example',()=>{state={theta:57,kind:'corresponding',preset:'year7'};S.theta=57;S.kind='corresponding';S.preset='year7';range.value='57';kinds.value='corresponding';select.value='year7';readout.textContent='57°';emit('reset','year7');paint()},'nova-btn primary')]));
 window.NovaLessonComponent?.applyExploreModels();panel.append(prose('The top angle and its partner are calculated from the same exact transversal. For a co-interior pair, the second value is 180° minus the first. Drag the upper glowing handle or use the slider.'));
 window.NovaLessonComponent?.applyExploreModels();paint();
}
const TASKS=[
 {theta:57,kind:'corresponding',given:57,answer:57,reason:'corresponding',question:'Two parallel lines are cut by a transversal. An angle is 57°. Find the corresponding angle.',hint:'The angles occupy the same position at the two crossings.'},
 {theta:63,kind:'alternate',given:63,answer:63,reason:'alternate',question:'Find the alternate interior angle equal to 63°.',hint:'Look for the Z pattern, inside the parallel lines on opposite sides.'},
 {theta:68,kind:'cointerior',given:112,answer:68,reason:'cointerior',question:'A co-interior angle is 112°. Find the adjacent interior partner on the same side.',hint:'Co-interior angles make a straight-angle total: 180°.'},
 {theta:74,kind:'vertically',given:74,answer:74,reason:'vertically',question:'An angle is 74°. Find the vertically opposite angle at the same intersection.',hint:'Angles opposite each other where two lines cross are equal.'},
 {theta:39,kind:'cointerior',given:141,answer:39,reason:'cointerior',question:'One interior angle is 141°. Find its same-side interior partner.',hint:'Subtract 141° from the straight-angle total.'},
 {theta:52,kind:'bearings',given:52,answer:52,reason:'bearings',question:'From two parallel north lines, the first clockwise bearing is 052°. What is the corresponding bearing?',hint:'Corresponding directions measured clockwise from north are equal.'},
 {theta:62,kind:'alternate',given:62,answer:62,reason:'alternate',question:'In the Z pattern, one angle is 62°. Find its alternate interior partner.',hint:'Opposite sides of the transversal, inside the two parallel lines.'},
 {theta:58,kind:'cointerior',given:122,answer:58,reason:'cointerior',question:'In a multi-step angle chase, a co-interior angle is 122°. Find its partner.',hint:'These two angles total 180°.'}
];
function dragReason(btn,text,drop,select){let active=null;btn.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||N.ui._drag)return;let id=e.pointerId,sx=e.clientX,sy=e.clientY,ghost=null,on=false;active={cancel:()=>cancel(),captured:true,moved:true};
 function move(ev){if(ev.pointerId!==id)return;if(Math.hypot(ev.clientX-sx,ev.clientY-sy)>8&&!on){on=true;ghost=H('div',{class:'f115-ghost',text});document.body.append(ghost);N.ui._drag=active}if(on){ev.preventDefault();ghost.style.left=(ev.clientX+12)+'px';ghost.style.top=(ev.clientY+12)+'px';let r=drop.getBoundingClientRect();drop.dataset.hover=String(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)}}
 function clean(){ghost?.remove();drop.dataset.hover='false';if(N.ui._drag===active)N.ui._drag=null;btn.removeEventListener('pointermove',move);btn.removeEventListener('pointerup',up);btn.removeEventListener('pointercancel',cancel);btn.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{btn.releasePointerCapture(id)}catch(_){}active=null}
 function up(ev){if(ev.pointerId!==id)return;let r=drop.getBoundingClientRect(),ok=on&&ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;clean();if(ok)select()}
 function cancel(){clean()}function lost(){if(active)cancel()}function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}btn.addEventListener('pointermove',move);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',cancel);btn.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);try{btn.setPointerCapture(id)}catch(_){}
 });}
function challenge(panel,api,stage){panel.classList.add('f115-tools');let index=0;
 function paint(){let t=TASKS[index];panel.replaceChildren();panel.append(H('div',{class:'pr-task f115-span',text:`CHALLENGE ${index+1} / ${TASKS.length}`}));panel.append(prose(t.question));
 let inp=H('input',{class:'nova-input','data-testid':'f115-answer',type:'number',step:1,min:0,max:180,placeholder:'Angle in degrees','aria-label':'Answer in degrees'});panel.append(H('label',{class:'f115-span'},['ANGLE (°)',inp]));
 let options=H('div',{class:'f115-reasons f115-span'}),drop=H('div',{class:'f115-drop f115-span','data-testid':'f115-reason-drop',text:'Select or drag a mathematical reason here'}),chosen='';
 let choose=k=>{chosen=k;emit('reason',k);drop.textContent=REL[k].reason;drop.dataset.set='true';options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))};
 for(let [k,v] of Object.entries(REL)){let b=H('button',{class:'f115-reason',type:'button','aria-pressed':'false','data-reason':k,text:v.reason,onclick:()=>choose(k)});options.append(b);dragReason(b,v.reason,drop,()=>choose(k))}
 panel.append(options,drop);let actions=H('div',{class:'f115-actions f115-span'});panel.append(actions);
 const paintStage=done=>draw(stage,{theta:t.theta,kind:t.kind,phase:done?4:3,challenge:true,givenOnly:true,complete:done,pose:done?'celebrate':'think',caption:done?'Correct. You used the matching angle fact and a sound mathematical reason.':'Follow the coloured angle sectors, calculate the unknown value and select the reason.'});
 actions.append(button('Check angle + reason',()=>{const ans=Number(inp.value);let msg='';if(!inp.value.trim()||!Number.isFinite(ans))msg='Enter your numerical angle in degrees.';else if(ans!==t.answer){if(ans===180-t.answer)msg='You used the supplementary angle instead of the required pair. Inspect the highlighted positions.';else if(ans===180)msg='180° is a straight-angle total, not this particular angle.';else msg=t.kind==='cointerior'?'Co-interior angles total 180°. Subtract the given angle.':'The highlighted angles are equal. Recheck the two arc positions.';}else if(chosen!==t.reason)msg='Your angle is correct, but the mathematical reason does not justify this pair.';
 if(msg){api.check(false,msg,{task:index+1});paintStage(false);return}api.check(true,`${t.given}° ${t.kind==='cointerior'?'and':'matches'} ${t.answer}°. ${REL[t.reason].reason}.`,{task:index+1,answer:t.answer,reason:chosen});emit('answer',{task:index+1,value:ans});paintStage(true);actions.replaceChildren();if(index===TASKS.length-1)actions.append(H('p',{class:'f115-complete',text:'8 / 8 · ANGLE REASONING MASTERED'}));else actions.append(button('Next challenge →',()=>{index++;emit('task',index+1);paint()},'nova-btn primary'))},'nova-btn primary'),button('Hint',()=>api.hint(t.hint)));
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')actions.querySelector('button')?.click()});paintStage(false)
 }paint();}
const def={id:ID,title:'Parallel Lines Explorer',config:CFG,steps:STEPS,render,explore,challenge,alt:'Interactive parallel lines with a movable transversal, precisely marked corresponding, alternate, co-interior, vertically opposite and bearing angle pairs.',staticAlt:'On parallel lines, corresponding and alternate interior angles are equal. Co-interior angles add to 180°. Vertically opposite angles at each intersection are equal. Parallel north lines transfer corresponding bearings.',exploreIntro:'Rotate the transversal and discover which angle relations stay equal and which total 180°.',onRestore:()=>{S.theta=57;S.kind='corresponding';S.preset='year7';emit('reset','year7')}};
N.registry.add({id:ID,title:'Parallel Lines Explorer',family:'F11',topics:['parallel lines','transversal','alternate','corresponding','co-interior','bearings'],deps:['F0-02','F0-04','F0-07','F0-08','F11-03']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"S":()=>S},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"stageFrame":["stage","label"],"draw":["stage","o"]},exploreFields:{"state":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'05',title:'Parallel Lines Explorer · Premium Edition',def,linked:['F11-03','F11-04','F11-10','F11-11'],years:'Year 7–9 · Angle relationships and bearings',spec:{purpose:'Discover and prove precise angle relationships on parallel lines and transfer to bearings.',params:'Transversal acute angle 40°–78°, given/unknown sectors, relation, preset.',presets:'Y7-042 corresponding/alternate/co-interior, Y8-052 parallel north, Y9-025 proof chains, Y9-039 bearings.',steps:'Thirteen progressive teaching steps: identify parallel lines and transversal, prove F/Z/C/X patterns, bearings, and formal reason.',interactions:'Fast pointer-captured transversal rotation and keyboard control, angular slider, preset/relation selection, numerical checking and draggable reason cards.',traps:'Confusing equal and supplementary pairs, using angles at the wrong intersection, reading north clockwise incorrectly.',gcse:'Multi-step formal explanations using intersecting parallel lines and bearings.'}});
})();
