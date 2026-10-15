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

/* NOVA F6-08 gallery PREVIEW of a F10-05 PRESET, not an independent production graph engine.
 * The eventual host remains F10-05. All diagram primitives and state come from existing F0 core.
 */
(function(){'use strict';
const N=window.NOVA,P=window.NOVA_F608_PRESET,H=N.h,E=N.svg.el,M=N.motion, ID='F6-08';
const C=window.NovaV2Integration.configuration({id:ID,preset:'Y7-060',startMode:'watch',presets:P.presets,previewOnly:true,parentEngine:'F10-05'});
const STEPS=[
 {name:'Plot the matching points',pose:'count',caption:'Every x has its matching y.',narration:'First, use the table to plot pairs. Start with the origin. Each extra step in x brings a matching increase in y.',prompt:'Notice what stays the same between each pair.'},
 {name:'Draw through the origin',pose:'point',caption:'The line must pass through zero.',narration:'Join the plotted pairs with a straight line. Direct proportion always gives a straight line through zero, zero.',prompt:'Check whether the plotted line goes through the origin.'},
 {name:'Read and explain the rule',pose:'checking',caption:'Find the multiplier, then test it.',narration:'To find the multiplier, divide the matching y by x when x is not zero. The same multiplier works for every point on this line.',prompt:'Use any non-zero point to check the multiplier.'}
];
const near=(a,b,t=.001)=>Math.abs(a-b)<t;
// Local fast-release defence: never alter the shared F0 drag engine.
window.addEventListener('pointerup',e=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f608-point'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(e);});},true);
const fmt=n=>Number(Number(n).toFixed(4)).toString();
function emit(name,data){N.events.emit(name,Object.assign({engine:ID,preset:C.preset},data||{}));}
function cfg(id){return C.presets[id||C.preset]||C.presets['Y7-060'];}
function shape(p,x,y,v,role,size,anchor){return N.chalkText(p,x,y,fmt(v),{role:role||'given',size:size||26,anchor:anchor||'middle'});}
function txt(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,String(t),{role:role||'given',size:size||26,anchor:anchor||'middle'});}
function metric(title,v,desc,role){return N.neonCard([H('p',{class:'f608-lbl',text:title}),H('p',{class:'f608-num',text:v}),H('p',{class:'f608-desc',text:desc})],{role:role||'given'});}
function geom(mob){return mob?{w:480,h:945,x:64,y:195,plotW:351,plotH:330,tableX:58,tableY:634,tableW:365,tableH:240,footerY:902,retX:345,retY:854}:
 {w:1080,h:828,x:79,y:188,plotW:584,plotH:474,tableX:720,tableY:195,tableW:320,tableH:476,footerY:766,retX:820,retY:693};}
function tableau(svg,p,g,state,mod){
 const X=g.tableX,Y=g.tableY,W=g.tableW,mob=g.w===480;
 const head=txt(svg,X+W/2,Y-25,'MATCHED PAIRS','given',mob?31:32);if(head)head.setAttribute('data-layout','table-heading');
 const gap=mob?41:77, rows=mob?[0,1,2,3]:[0,1,2,3,4],top=Y+(mob?14:12);
 rows.forEach((n,i)=>{const rowY=top+i*gap;N.neonBox(svg,X,rowY,W,gap-(mob?5:9),{role:n===state.selected?'focus':'given',r:mob?9:12});
 const c1=X+W*.22,c2=X+W*.75,val=n*p.slope;
 txt(svg,c1,rowY+(mob?28:43),fmt(n),'given',mob?23:31);
 if(mod==='challenge'&&n===p.queryX&&!state.solved)txt(svg,c2,rowY+(mob?29:44),'?','unknown',mob?29:37);
 else txt(svg,c2,rowY+(mob?28:43),fmt(val),'result',mob?23:31);
 // A tiny repeated horizontal split is mathematical structure, not a decorative marker.
 N.neonLine(svg,X+W*.46,rowY+8,X+W*.46,rowY+gap-14,{role:'op',width:2});
 if(mod==='explore'&&n>0&&n<=3){const cx=c2,cy=rowY+(mob?20:32);
  const hit=E('g',{class:'f608-point f608-tablechip',role:'button',tabindex:'0','aria-label':'Drag table value '+fmt(val)+' onto the corresponding graph point '+n+','+fmt(val), 'data-evidence':n},svg);
  N.neonRing(hit,cx+35,cy+2,{role:'result',r:9,pulse:false});
  // Zone maps a table value to its actual mathematical graph point.
  const pp=state.plot,px=pp.X(n),py=pp.Y(val);
  N.ui.svgDrag(svg,hit,{box:{x:cx+16,y:cy-17,w:38,h:35},zones:()=>[
   {id:'point:'+n,x:px-26,y:py-28,w:52,h:56,kind:'drop'},
   {id:'remove',x:g.retX-62,y:g.retY-27,w:124,h:57,kind:'remove'}],
   onDrop:id=>{const ok=id==='point:'+n;if(ok){state.evidence[n]=true;state.feedback='Matched table pair '+n+' to ('+n+', '+fmt(val)+').';emit('value',{evidence:n,correct:true});state.repaint('checking','Good match: table to graph.');}return ok;},
   onRemove:()=>{delete state.evidence[n];state.feedback='Table value returned to its row.';emit('value',{returned:n});state.repaint('point','Try matching the point again.');}});
  hit.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();state.evidence[n]=true;state.feedback='Matched '+fmt(val)+' to x = '+n+'.';emit('value',{evidence:n,keyboard:true});state.repaint('checking','The table matches the plot.');}else if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();delete state.evidence[n];state.repaint('point','Value returned to the table.');}});
 }
 });
 txt(svg,X+W*.22,top-12,'x','given',mob?19:24);
 txt(svg,X+W*.75,top-12,'y','result',mob?19:24);
}
function draw(stage,p,o){
if(window.NovaLessonComponent?.active){[stage,p,o]=window.NovaLessonComponent.args("draw",arguments);}
stage.innerHTML='';const mode=o.mode||'watch',step=o.step==null?2:o.step,mob=innerWidth<=760,g=geom(mob),svg=N.svg.root(g.w,g.h,'Direct proportion graph '+p.label+'. A straight line through the origin with matching points '+p.context+'.');
 svg.classList.add('nv-svg','f608-svg');const wrap=H('div',{class:'f608-grid'}),art=H('div',{class:'f608-art'}),side=H('aside',{class:'f608-aside'});
 art.append(svg);wrap.append(art,side);stage.append(wrap);
 txt(svg,g.w/2,63,'EVERY PAIR · ONE RULE','given',mob?40:45);
 const equation=txt(svg,g.w/2,120,'y = kx','focus',mob?43:52);if(equation)equation.setAttribute('data-layout','equation');
 const plot=N.neonPlot(svg,{x0:g.x,y0:g.y,w:g.plotW,h:g.plotH,x:[0,p.xMax],y:[0,p.yMax],xStep:p.xStep,yStep:p.yStep,xLabel:p.xLabel,yLabel:p.yLabel});
 const state={selected:o.selected||p.knownX,solved:!!o.solved,evidence:o.evidence||{},feedback:o.feedback||'',plot:plot,repaint:o.repaint||(()=>{})};
 const showPoints=mode==='explore'||mode==='challenge'||step>=0,showLine=mode==='explore'||mode==='challenge'||step>=1,showRead=mode==='explore'||(mode==='challenge'&&o.solved)||step>=2;
 const values=[0,1,2,3,4,5,6,7,8].filter(n=>n<=p.xMax&&n*p.slope<=p.yMax);
 if(showLine){const d=`M${plot.X(0)},${plot.Y(0)} L${plot.X(p.xMax)},${plot.Y(p.slope*p.xMax)}`;
  const line=N.neonPath(svg,d,{role:'focus',width:4.3});line.classList.add('f608-line');line.setAttribute('data-maths','y-kx-line');
 }
 if(showPoints)values.forEach(x=>{if(step===0&&mode!=='explore'&&mode!=='challenge'&&![0,1,p.knownX].includes(x))return;
 const y=p.slope*x;if(mode==='challenge'&&!state.solved&&x===p.queryX)return;
 N.neonRing(svg,plot.X(x),plot.Y(y),{role:x===state.selected?'result':'given',r:8.2,pulse:x===state.selected&&mode!=='challenge'});
 });
 if(mode==='explore'){
  const selected=state.selected,val=p.slope*selected,px=plot.X(selected),py=plot.Y(val);
  const marker=E('g',{class:'f608-point f608-selector',tabindex:'0',role:'slider','aria-label':'Point on graph, x = '+selected+', y = '+fmt(val)+'. Use arrow keys to move.','aria-valuemin':'1','aria-valuemax':String(p.xMax),'aria-valuenow':String(selected),'data-maths':'moving-point'},svg);
  N.neonRing(marker,px,py,{role:'result',r:16});
  N.ui.svgDrag(svg,marker,{box:{x:px-23,y:py-23,w:46,h:46},zones:()=>[
   ...values.filter(x=>x>0).map(x=>({id:'x:'+x,x:plot.X(x)-27,y:plot.Y(p.slope*x)-27,w:54,h:54,kind:'drop'})),
   {id:'remove',x:g.retX-62,y:g.retY-25,w:124,h:55,kind:'remove'}],
   onDrop:id=>{if(!id.startsWith('x:'))return false;state.repaint('point','The same rule holds at every point.',Number(id.slice(2)));emit('value',{x:Number(id.slice(2)),y:p.slope*Number(id.slice(2)),source:'drag'});return true;},
   onRemove:()=>{state.repaint('count','Point returned to the first non-zero position.',1);emit('value',{removed:'point'});}});
  marker.addEventListener('keydown',ev=>{let x=selected;if(ev.key==='ArrowRight'||ev.key==='ArrowUp')x++;else if(ev.key==='ArrowLeft'||ev.key==='ArrowDown')x--;else if(ev.key==='Home')x=1;else if(ev.key==='End')x=p.xMax;else if(ev.key==='Delete')x=1;else return;ev.preventDefault();x=Math.max(1,Math.min(p.xMax,x));state.repaint('point','Changing x changes y by the same multiplier.',x);emit('value',{x,y:p.slope*x,keyboard:true});});
  N.neonBox(svg,g.retX-62,g.retY-25,124,55,{role:'error',r:9});txt(svg,g.retX,g.retY+9,'RETURN','error',mob?23:25);
  const guideX=N.neonLine(svg,px,py,px,plot.Y(0),{role:'unknown',width:1.8,dash:'6 9'});
  const guideY=N.neonLine(svg,plot.X(0),py,px,py,{role:'unknown',width:1.8,dash:'6 9'});
  // Evidence guides must never intercept the pupil's draggable point.
  [guideX,guideY].forEach(el=>{if(el&&el.style)el.style.pointerEvents='none';});
 }
 if(showRead){const x=state.selected,y=p.slope*x;
  const coord=txt(svg,plot.X(Math.max(1,p.xMax*.45)),g.y-6,`(${x}, ${fmt(y)})`,'result',mob?27:32);if(coord)coord.setAttribute('data-layout','coordinate');
 }
 tableau(svg,p,g,state,mode);
 // Scientific evidence, visually separated from the table and axes.
 if(mode==='watch'||mode==='guided')txt(svg,g.w/2,g.footerY,'THROUGH (0,0) · CONSTANT MULTIPLIER','op',mob?24:31);
 else if(mode==='challenge')txt(svg,g.w/2,g.footerY,'READ THE LINE · FIND k','op',mob?27:30);
 else txt(svg,g.w/2,g.footerY+(mob?17:0),'DRAG THE RING · MATCH THE TABLE','op',mob?22:28);
 const v=mode==='challenge'&&!o.solved?'?':fmt(p.slope),r=mode==='challenge'&&!o.solved?'?':fmt(p.slope*p.queryX);
 side.append(metric('THE RULE',mode==='challenge'&&!o.solved?'y = ?x':'y = '+v+'x','The graph must cross the origin.','focus'));
 side.append(metric('MATCHED PAIR','x = '+fmt(p.knownX),'Look for y = '+fmt(p.knownX*p.slope)+'.','given'));
 side.append(metric('READ AT x = '+fmt(p.queryX),'y = '+r,mode==='challenge'&&!o.solved?'Read from the graph.':'Multiply x by k.','result'));
 N.scene.helperStrip(stage,o.pose||'point',o.caption||'One multiplier.');
 return {svg,plot,state,g};
}
function teach(i,stage){const p=cfg();STEPS[2].narration='Use a non-zero point such as ('+p.knownX+', '+fmt(p.knownX*p.slope)+'). Dividing y by x gives the multiplier '+fmt(p.slope)+'. The rule y = '+fmt(p.slope)+'x works for every point and the line goes through the origin.';
 emit('step',{index:i,name:STEPS[i].name});const v=draw(stage,p,{mode:'watch',step:i,pose:STEPS[i].pose,caption:STEPS[i].caption});if(i===1){const l=v.svg.querySelector('.f608-line');if(l&&!N.reducedMotion())M.arrive(l,0,10,390);}if(i===2)M.flash(v.svg,v.plot.X(p.knownX),v.plot.Y(p.knownX*p.slope),'result',35);}
function button(label,callback,cls='nova-btn'){return H('button',{class:cls,text:label,onclick:callback});}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let id=C.preset,selected=cfg().knownX,evidence={},feedback='Drag the large ring along the line. Match a table value to its plotted point.';
 window.NovaLessonComponent?.applyExploreModels();const select=H('select',{class:'f608-select','aria-label':'Choose proportional relationship'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,p])=>select.append(H('option',{value:k,text:p.label})));window.NovaLessonComponent?.applyExploreModels();select.value=id;
 window.NovaLessonComponent?.applyExploreModels();const options=H('div',{class:'f608-controls'}),actions=H('div',{class:'f608-controls'}),fb=H('p',{class:'f608-fb','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();options.append(H('label',{class:'f608-field'},['Lesson preset',select]));window.NovaLessonComponent?.applyExploreModels();actions.append(button('Check the relationship',check,'nova-btn primary'),button('Hint',hint),button('Reset',reset));
 window.NovaLessonComponent?.applyExploreModels();panel.append(options,actions,H('p',{class:'f608-descsmall',text:'Drag the large ring between plotted points; drag small table-value rings onto matching graph points. Keyboard: focus a ring; use arrow keys or Enter to match, Delete to return.'}),fb);
 window.NovaLessonComponent?.applyExploreModels();function paint(pose='point',caption='Move together, same multiplier.',x){if(x!=null)selected=x;draw(stage,cfg(id),{mode:'explore',selected,evidence,feedback,pose,caption,repaint:paint});fb.textContent=feedback;}
 window.NovaLessonComponent?.applyExploreModels();function check(){const p=cfg(id);const valid=near((p.slope*selected)/selected,p.slope);let evCount=Object.keys(evidence).length;
 feedback=valid?`Correct: (${selected}, ${fmt(p.slope*selected)}) lies on y = ${fmt(p.slope)}x. ${evCount} table matches placed.`:'That point does not follow the same multiplier.';
 emit('correct',{correct:valid,selected});fb.className='f608-fb '+(valid?'good':'bad');paint(valid?'celebrate':'not-yet',valid?'Every point keeps the rule!':'Check both coordinates.');}
 window.NovaLessonComponent?.applyExploreModels();function hint(){feedback='The y coordinate is always '+fmt(cfg(id).slope)+' × the x coordinate. The origin is (0,0).';emit('hintUsed',{});paint('explain','Watch the same multiplier.');}
 window.NovaLessonComponent?.applyExploreModels();function reset(){selected=cfg(id).knownX;evidence={};feedback='Reset: try a different matching point.';paint('point','Start from a known pair.');}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=()=>{id=select.value;C.preset=id;selected=cfg(id).knownX;evidence={};feedback=cfg(id).context+' · '+cfg(id).label;paint('point','A new graph, same idea.');};
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({id,selected,evidence:{...evidence},feedback}),setX:x=>{selected=Math.max(1,Math.min(cfg(id).xMax,x));paint();},setPreset:k=>{select.value=k;select.onchange();},hint,reset,check};window.NovaLessonComponent?.applyExploreModels();paint();}
function challenge(panel,api,stage){const ids=Object.keys(C.presets);let index=0,solved=0,ok=false,attempts=0;
 const question=H('p',{class:'f608-question'}),fields=H('div',{class:'f608-answers'}),k=H('input',{inputmode:'decimal','aria-label':'Multiplier k',placeholder:'Multiplier k'}),y=H('input',{inputmode:'decimal','aria-label':'Missing y value',placeholder:'Missing y'});
 fields.append(H('label',{class:'f608-answer'},[H('span',{text:'FIND THE MULTIPLIER k'}),k]),H('label',{class:'f608-answer'},[H('span',{text:'READ THE MISSING y'}),y]));
 const fb=H('p',{class:'f608-fb','aria-live':'polite'}),actions=H('div',{class:'f608-controls'}),progress=H('p',{class:'f608-descsmall'}),checkBtn=button('Check answers',verify,'nova-btn primary'),nextBtn=button('Next graph',next),hintBtn=button('Hint',hint);nextBtn.disabled=true;
 actions.append(checkBtn,hintBtn,nextBtn);panel.append(question,fields,actions,fb,progress);
 function current(){return cfg(ids[index]);}
 function paint(){const p=current();question.textContent=(index+1)+' / '+ids.length+' · A line passes through the origin and ('+p.knownX+', '+fmt(p.knownX*p.slope)+'). Find k and the y-value when x = '+p.queryX+'.';progress.textContent='Graphs solved: '+solved+' of '+ids.length;draw(stage,p,{mode:'challenge',selected:p.knownX,solved:ok,step:2,pose:ok?'celebrate':'think',caption:ok?'The straight line follows one rule.':'Read the known pair, then multiply.'});}
 function parse(el){const v=el.value.trim().replace(',','.');return v!==''&&Number.isFinite(Number(v))?Number(v):null;}
 function verify(){if(ok)return;attempts++;const p=current(),m=parse(k),v=parse(y),expected=p.slope,answer=p.queryX*expected;let message,pass=false;
 if(m===null||v===null)message='Enter both the multiplier and the missing y value.';
 else if(!near(m,expected)){if(near(m,p.knownX*expected))message='You copied y instead of the multiplier. Divide y by the known non-zero x.';
 else if(near(m,p.knownX/(p.knownX*expected)))message='You divided x by y. To find k, divide y by x.';
 else message='Find k from a known pair: y ÷ x. The graph starts at zero.';}
 else if(!near(v,answer)){if(near(v,p.queryX+expected))message='You added the multiplier to x. Direct proportion uses multiplication.';
 else if(near(v,p.queryX))message='You copied x. The missing y must be k multiplied by x.';
 else message='You found k, now use y = k × '+p.queryX+'.';}
 else{pass=true;message='Correct! y = '+fmt(expected)+'x, and when x = '+fmt(p.queryX)+', y = '+fmt(answer)+'. The line passes through the origin.';}
 api.check(pass,message,{preset:ids[index],expected:{k:expected,y:answer},actual:{k:m,y:v}});emit('correct',{correct:pass,challenge:ids[index]});fb.className='f608-fb '+(pass?'good':'bad');fb.textContent=message;if(pass){ok=true;solved++;checkBtn.disabled=true;nextBtn.disabled=false;paint();const svg=stage.querySelector('svg');if(svg)M.flash(svg,200,240,'result',35);}}
 function hint(){const p=current(),message='Use the known non-zero point. k = y ÷ x. Then multiply k by '+p.queryX+' to read the missing value.';api.hint(message);emit('hintUsed',{});fb.textContent=message;}
 function next(){if(!ok)return;if(index===ids.length-1){question.textContent='All four proportional graphs completed.';fields.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'PROPORTION GRAPHS');N.scene.helperStrip(stage,'celebrate','You proved the rule for every graph.');return;}
 index++;ok=false;k.value='';y.value='';fb.textContent='';checkBtn.disabled=false;nextBtn.disabled=true;paint();}
 [k,y].forEach(el=>el.addEventListener('keydown',ev=>{if(ev.key==='Enter')verify();}));
 C._challenge={get:()=>({index,solved,ok,attempts,feedback:fb.textContent}),setAnswers:(a,b)=>{k.value=a;y.value=b;},check:verify,next,hint};paint();}
// F6 gallery preview invokes the approved F0 engine shell and primitives, but is explicitly a visual demonstrator.
const DEF={id:ID,title:'Direct Proportion Graph · F10-05 Preset Preview',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'A neon coordinate graph plotting y equals k times x through the origin, with a matching chalk-labelled ratio table and draggable point.',
 staticAlt:'Direct proportion: (0,0), (1,k), (2,2k), (3,3k). y divided by any nonzero x stays constant, k.',
 spec:{purpose:'F6-08 is a named F10-05 graph preset, not a separate NOVA engine; this local preview shows its three required teaching beats.',params:'slope k; intercept c locked at zero; x and y ranges, axis/units labels, known and missing coordinates.',presets:'Y7-060; Y8-035; Y8-036; Y9-020.',steps:'Plot matched points → join through (0,0) → read values and explain k.',interactions:'Point on line, matching table values to points, keyboard alternatives and red remove tray.',traps:'Graph not through origin; confusing x and y; reversing y/x; adding instead of multiplying; unscaled axes.',gcse:'Graphical definition y = kx and tests of proportional versus non-proportional relationships.'}};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","p","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'F6·08',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 7–9; GCSE graph reasoning extension',linked:['F0-02','F0-04','F0-14','F0-15','F6-01','F10-05 (host pending)']});
window.F608_PREVIEW={config:C,math:{y:(x,k)=>x*k,k:(x,y)=>{if(!x)throw Error('Nonzero x required');return y/x;},isDirect:(m,c)=>Number.isFinite(m)&&Math.abs(c)<1e-12}};
})();
