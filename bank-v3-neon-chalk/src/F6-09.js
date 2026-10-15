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

/* F6-09 Inverse Proportion Rectangle — additive component; F0 core unmodified. */
const F609_CONFIG={id:'F6-09',preset:'Y8-037',startMode:'watch',parameters:{areaFixed:true,allowAreaZero:false,displayPrecision:3},presets:{
 'Y8-037':{label:'Y8-037 · Fixed area, 24 squares',title:'AREA STAYS THE SAME',k:24,xs:[2,3,4,6,8,12],initial:4,context:'A 24-square-unit rectangle changes shape without changing its area.'},
 'Y9-013':{label:'Y9-013 · Reciprocal curve, 36',title:'RECIPROCAL CURVE',k:36,xs:[3,4,6,9,12],initial:6,context:'Trace a reciprocal curve from the exact constant-product pairs.'},
 'Y9-019':{label:'Y9-019 · xy = 48',title:'INVERSE FORMULA',k:48,xs:[4,6,8,12,16],initial:8,context:'Use xy = 48 to find the height for each width.'},
 'Y9-020':{label:'Y9-020 · Direct or inverse?',title:'DIRECT OR INVERSE?',k:30,xs:[2,3,5,6,10,15],initial:5,context:'A shrinking height and growing width make a curved, not straight, graph.'}
},events:['value','correct','step','hintUsed']};window.F609_CONFIG=F609_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=window.NovaV2Integration.configuration(F609_CONFIG),ID=C.id;
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f609-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
const STEPS=[
 {name:'Start with fixed area',pose:'explain',caption:'Count the same area.',narration:'We have a rectangle made from equal square units. The area is its width multiplied by its height.'},
 {name:'Stretch the width',pose:'point',caption:'Wider means shorter.',narration:'Stretching the width changes the height. The height must shrink if the area is to remain the same.'},
 {name:'Squash the width',pose:'count',caption:'Shorter means taller.',narration:'Now make the rectangle narrower. The height grows to keep exactly the same area.'},
 {name:'Prove the constant',pose:'checking',caption:'Multiply to check.',narration:'Whatever rectangle we choose, width times height stays equal to the same number.'},
 {name:'Plot the pairs',pose:'point-down',caption:'A pair is one point.',narration:'Each width and matching height gives a coordinate. Mark the pairs on the graph.'},
 {name:'Trace the reciprocal curve',pose:'celebrate',caption:'Curved, not straight.',narration:'Joining the matching pairs traces a curve. When one number goes up, the other goes down. This is inverse proportion.'}
];
function fmt(v){return Number(v.toFixed(3)).toString();}function pFor(id){return C.presets[id||C.preset];}
function emit(type,data){N.events.emit(type,{engine:ID,...data});}function chalk(svg,x,y,t,role='given',size=25){return N.chalkText(svg,x,y,String(t),{role,size});}
function pill(title,value,desc,role){return N.neonCard([H('p',{class:'f609-label',text:title}),H('p',{class:'f609-value',text:value}),H('p',{class:'f609-desc',text:desc})],{role});}
function dims(mob,p){const ym=Math.max(...p.xs.map(x=>p.k/x)),maxX=Math.max(...p.xs),u=Math.min(mob?340/maxX:425/maxX,mob?315/ym:420/ym);return mob?
 {mob:true,w:480,h:1380,x0:75,y0:600,u,graphX:85,graphY:1195,graphW:280,graphH:250,railY:728,returnX:242,returnY:826,graphTop:945,insY:1346}:
 {mob:false,w:1120,h:1010,x0:95,y0:685,u,graphX:663,graphY:691,graphW:345,graphH:350,railY:815,returnX:560,returnY:814,graphTop:341,insY:961};}
function plot(svg,p,g,xCur,step,challenge,solved){const xMax=Math.max(...p.xs),yMax=Math.max(...p.xs.map(x=>p.k/x)),sx=x=>g.graphX+x/xMax*g.graphW,sy=y=>g.graphY-y/yMax*g.graphH;
 chalk(svg,g.graphX+g.graphW/2,g.graphTop-42,'MATCHING WIDTH AND HEIGHT','given',g.mob?23:27);
 N.numberLine(svg,{x:g.graphX,y:g.graphY,w:g.graphW,min:0,max:xMax,major:xMax>12?4:2,minor:0,labelSize:g.mob?17:19,arrows:true});
 N.numberLine(svg,{vertical:true,x:g.graphX,y:g.graphTop,w:g.graphH,min:0,max:yMax,major:yMax>12?4:2,side:'left',labelSize:g.mob?16:18,arrows:true});
 chalk(svg,g.graphX+g.graphW/2,g.graphY+65,'WIDTH  x','given',g.mob?23:26);
 chalk(svg,g.graphX+95,g.graphTop+42,'HEIGHT  y','op',g.mob?20:23);
 const visible=challenge?solved:step>=4;
 if(visible){p.xs.forEach(x=>N.neonRing(svg,sx(x),sy(p.k/x),{role:x===xCur?'focus':'op',r:x===xCur?11:6,pulse:false}));}
 if(step>=5||solved){let path='';const samples=65,xlo=p.xs[0]*.76;for(let i=0;i<=samples;i++){let x=xlo+(xMax-xlo)*i/samples,y=p.k/x;if(y>yMax*1.08)continue;path+=(path?' L':'M')+sx(x).toFixed(2)+' '+sy(y).toFixed(2);}N.neonPath(svg,path,{role:'focus',width:3.2});}
 // Area proof is in the permanent NOVA side card: no text overlapping the curve.
 return {sx,sy};}
function graphic(stage,p,o={}){
if(window.NovaLessonComponent?.active){[stage,p,o]=window.NovaLessonComponent.args("graphic",arguments);}
const mob=window.innerWidth<=1000,g=dims(mob,p),mode=o.mode||'watch',challenge=mode==='challenge',solved=!!o.solved,step=o.step??5,x=o.x||p.initial,y=p.k/x,drawHeight=solved||!challenge,view= o.scene||'default';
 stage.innerHTML='';N.cap(stage,ID,challenge?'FIND THE MISSING HEIGHT':mode==='explore'?'DRAG TO CHANGE THE WIDTH':'ONE CONSTANT AREA');
 const layout=H('div',{class:'f609-layout'}),art=H('div',{class:'f609-art'}),aside=H('aside',{class:'f609-aside','aria-label':'Inverse proportion evidence'});
 const svg=N.svg.root(g.w,g.h,'Fixed-area neon rectangle and coordinate graph showing reciprocal inverse proportion.');svg.classList.add('f609-svg');svg.dataset.mode=mode;svg.dataset.step=String(step);svg.dataset.x=fmt(x);svg.dataset.preset=o.id||C.preset;
 chalk(svg,g.w/2,56,challenge?'FIND THE UNKNOWN HEIGHT':'INVERSE PROPORTION','given',mob?33:48);
 chalk(svg,g.w/2,111,'THE AREA NEVER CHANGES','focus',mob?22:29);
 if(!mob){chalk(svg,310,180,'ONE AREA · MANY RECTANGLES','given',30);chalk(svg,826,180,'ONE CURVE · MANY PAIRS','given',30);}else chalk(svg,240,175,'STRETCH IT · SQUASH IT','given',26);
 let top=g.y0-y*g.u,width=x*g.u,height=y*g.u;N.neonBox(svg,g.x0,top,width,height,{role:'given',r:8});
 // Unit-square division grid = actual mathematical evidence; each unit is a matching physical square.
 // Use F0 neon tubes for unit lines. No custom glow filters and no palette overrides.
 if(step>=0){for(let i=1;i<x;i++)N.neonLine(svg,g.x0+i*g.u,top+2,g.x0+i*g.u,g.y0-2,{role:'given',width:1.1});
   for(let j=1;j<y;j++)N.neonLine(svg,g.x0+2,g.y0-j*g.u,g.x0+width-2,g.y0-j*g.u,{role:'op',width:1.1});}
 N.neonLine(svg,g.x0,g.y0+20,g.x0+width,g.y0+20,{role:'given',width:2.5});
 chalk(svg,mob?g.x0+width/2:535,mob?g.y0+34:663,'x = '+fmt(x),'given',mob?24:29);
 if(!challenge||solved||mode==='explore'){
  chalk(svg,top<(mob?340:355)?Math.min(g.w-85,g.x0+width+68):g.x0+width/2,top<(mob?340:355)?top+75:top-26,'y = '+fmt(y),'op',mob?23:28);
 }else chalk(svg,top<(mob?340:355)?Math.min(g.w-85,g.x0+width+68):g.x0+width/2,top<(mob?340:355)?top+75:top-26,'y = ?','focus',mob?24:29);
 N.neonBox(svg,g.mob?100:205,g.mob?226:239,g.mob?280:285,57,{role:'focus',r:13});chalk(svg,g.mob?240:347.5,g.mob?265:278,'AREA = '+fmt(p.k)+' square units','focus',mob?23:26);
 // A distinct constant chip visually reinforces the invariant; it never changes as x moves.

 if(mode==='explore'){
  const handle=E('g',{class:'f609-drag','data-corner':'1',role:'button',tabindex:0,'aria-label':'Draggable top-right rectangle corner. Press left or right arrow to select a narrower or wider width. Delete resets.'},svg);
  N.neonRing(handle,g.x0+width,top,{role:'focus',r:20,pulse:false});
  handle.addEventListener('keydown',ev=>{let ix=p.xs.indexOf(x);if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();let j=Math.max(0,Math.min(p.xs.length-1,ix+(ev.key==='ArrowRight'?1:-1)));o.onMove(p.xs[j]);}else if(ev.key==='Delete'||ev.key==='Escape'){ev.preventDefault();o.onReset();}});
  const slots=p.xs.map((v,i)=>{const cx=g.x0+27+i*(g.mob?55:64);return {id:String(v),kind:'drop',x:cx-23,y:g.railY-29,w:46,h:54};});
  slots.forEach((z,i)=>{N.neonRing(svg,z.x+23,g.railY-3,{role:p.xs[i]===x?'result':'unknown',r:14,pulse:false});chalk(svg,z.x+23,g.railY+45,fmt(p.xs[i]),'focus',mob?18:22);});
  chalk(svg,g.mob?230:290,g.railY-69,'SNAP CORNER TO A WIDTH','given',mob?21:26);
  N.neonBox(svg,g.returnX-81,g.returnY-30,162,61,{role:'error',r:12});chalk(svg,g.returnX,g.returnY+9,'RETURN','error',25);
  const zones=[...slots,{id:'return',kind:'remove',x:g.returnX-81,y:g.returnY-30,w:162,h:61}];
  N.ui.svgDrag(svg,handle,{box:{x:g.x0+width-28,y:top-28,w:56,h:56},zones:()=>zones,onDrop:v=>{if(p.xs.includes(+v)){Promise.resolve().then(()=>o.onMove(+v));return true;}return false;},onRemove:()=>o.onReset()});
  chalk(svg,g.w/2,g.insY,'THE PRODUCT NEVER CHANGES','focus',mob?22:30);
 }else if(mob){chalk(svg,g.w/2,g.insY,challenge&&!solved?'USE x × y = AREA':'WHEN x GROWS, y SHRINKS','focus',22);}else chalk(svg,300,g.insY,challenge&&!solved?'FIND y FROM x × y = AREA':'WIDTH × HEIGHT = CONSTANT','focus',27);
 plot(svg,p,g,x,step,challenge,solved);
 const show=!challenge||solved;
 aside.append(pill('WIDTH · x',fmt(x)+' units','Choose a width from the available slots.','given'),pill('HEIGHT · y',show?fmt(y)+' units':'? units','Height changes whenever the width changes.','op'),pill('FIXED AREA · xy',fmt(p.k)+' square units','This product stays the same.','focus'),pill('PATTERN',show?fmt(x)+' × '+fmt(y)+' = '+fmt(p.k):'x × y = '+fmt(p.k),'An inverse relationship traces a curve.','result'));
 layout.append(art,aside);art.append(svg);stage.append(layout);N.scene.helperStrip(stage,o.pose||'checking',o.caption||'Same area, different shape.');return {svg,g,x,y};}
function teach(i,stage){const p=pFor(),xs=p.xs;let x=p.initial;if(i===1)x=xs[xs.length-2];if(i===2)x=xs[0];if(i>=3)x=p.initial;
 STEPS[0].narration='Look at the rectangle. Width '+fmt(x)+' times height '+fmt(p.k/x)+' is exactly '+fmt(p.k)+' square units.';
 STEPS[3].narration='For this rectangle, width '+fmt(x)+' times height '+fmt(p.k/x)+' makes '+fmt(p.k)+'. The area stays constant.';
 emit('step',{preset:C.preset,index:i});const r=graphic(stage,p,{mode:'watch',step:i,x,pose:STEPS[i].pose,caption:STEPS[i].caption});if(i===3||i===5)M.flash(r.svg,r.g.x0+65,r.g.y0-70,i===5?'result':'focus',37);}
function btn(label,fn,cls='nova-btn'){return H('button',{text:label,class:cls,onclick:fn});}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let id=C.preset,x=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("x",()=>(pFor(id).initial)):(pFor(id).initial)),message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Drag the corner to one of the width slots, or use the keyboard arrows.')):('Drag the corner to one of the width slots, or use the keyboard arrows.'));
 window.NovaLessonComponent?.applyExploreModels();const select=H('select',{'aria-label':'Inverse proportion scenario'});window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,v])=>select.append(H('option',{text:v.label,value:k})));window.NovaLessonComponent?.applyExploreModels();select.value=id;
 window.NovaLessonComponent?.applyExploreModels();const tools=H('div',{class:'f609-controls'}),actions=H('div',{class:'f609-controls'}),fb=H('p',{class:'f609-fb','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();tools.append(H('label',{class:'f609-field'},['Choose a scenario',select]));window.NovaLessonComponent?.applyExploreModels();actions.append(btn('Check area',check,'nova-btn primary'),btn('Hint',hint),btn('Reset',reset));window.NovaLessonComponent?.applyExploreModels();panel.append(tools,actions,H('p',{class:'f609-info',text:'Drag the glowing rectangle corner to a numbered width slot. The fixed area changes the height automatically. Keyboard: focus corner, Left/Right to change width, Delete to reset.'}),fb);
 window.NovaLessonComponent?.applyExploreModels();function paint(pose='checking',caption='Keep the product the same.'){graphic(stage,pFor(id),{mode:'explore',id,x,pose,caption,onMove:setWidth,onReset:reset});fb.textContent=message;}
 window.NovaLessonComponent?.applyExploreModels();function setWidth(v){if(!pFor(id).xs.includes(v))return;x=v;message='Width '+fmt(x)+' × height '+fmt(pFor(id).k/x)+' = '+fmt(pFor(id).k)+' square units.';emit('value',{preset:id,width:x,height:pFor(id).k/x,product:pFor(id).k});paint('count','The height must adjust.');}
 window.NovaLessonComponent?.applyExploreModels();function reset(){x=pFor(id).initial;message='The corner has returned to its starting width.';paint('explain','Start with one rectangle.');}
 window.NovaLessonComponent?.applyExploreModels();function check(){const p=pFor(id),ok=Math.abs(x*(p.k/x)-p.k)<1e-9;message=ok?'Correct: the rectangle has '+fmt(p.k)+' square units of area. Every allowed width gives the same product.':'Check width times height against the fixed area.';fb.classList.toggle('good',ok);emit('correct',{preset:id,correct:ok});paint(ok?'celebrate':'not-yet',ok?'Perfect constant product!':'Count equal square units.');}
 window.NovaLessonComponent?.applyExploreModels();function hint(){message='Area equals width × height. Height must be '+fmt(pFor(id).k)+' ÷ width. Try a different width and count the height.';emit('hintUsed',{preset:id});paint('point','Multiply width and height.');}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=()=>{id=select.value;C.preset=id;x=pFor(id).initial;message=pFor(id).context;emit('value',{preset:id});paint('explain','A new fixed area.');};
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({id,x,y:pFor(id).k/x,message}),setWidth,reset,check,hint,setPreset:v=>{select.value=v;select.onchange();}};window.NovaLessonComponent?.applyExploreModels();paint();}
function challenge(panel,api,stage){let ids=Object.keys(C.presets),ix=0,correct=0,solved=false,attempts=0;
 const q=H('p',{class:'f609-question'}),inputs=H('div',{class:'f609-fields'}),height=H('input',{type:'text',inputmode:'decimal',placeholder:'Height in units','aria-label':'Unknown rectangle height'}),product=H('input',{type:'text',inputmode:'decimal',placeholder:'Area in square units','aria-label':'Constant area product'});
 inputs.append(H('label',{class:'f609-answer'},[H('span',{text:'UNKNOWN HEIGHT · y'}),height]),H('label',{class:'f609-answer'},[H('span',{text:'AREA · x × y'}),product]));
 const fb=H('p',{class:'f609-fb','aria-live':'polite'}),prog=H('p',{class:'f609-progress'}),controls=H('div',{class:'f609-controls'}),ck=btn('Check answer',verify,'nova-btn primary'),hint=btn('Hint',giveHint),next=btn('Next rectangle',advance);next.disabled=true;controls.append(ck,hint,next);panel.append(q,inputs,controls,fb,prog);
 function now(){return C.presets[ids[ix]];}function paint(){const p=now();q.textContent=`Rectangle ${ix+1} of ${ids.length}: ${p.context} Width is ${fmt(p.initial)} units. Find its height and prove the constant area.`;prog.textContent='Correct rectangles: '+correct+' / '+ids.length;graphic(stage,p,{mode:'challenge',id:ids[ix],x:p.initial,step:solved?5:0,solved,pose:solved?'celebrate':'think',caption:solved?'The product is constant!':'Use width × height = area.'});}
 function numeric(el){const s=el.value.trim().replace(',','.');return s&&Number.isFinite(Number(s))?Number(s):null;}
 function verify(){if(solved)return;attempts++;const p=now(),v=numeric(height),a=numeric(product),expected=p.k/p.initial;let message='',ok=false;
 if(v===null||a===null)message='Fill in both values. Write a height and the resulting area.';
 else if(Math.abs(a-p.k)>.005)message='The area must remain '+fmt(p.k)+' square units. It is fixed even when the shape changes.';
 else if(Math.abs(v-expected)>.005){if(Math.abs(v-p.k*p.initial)<.005)message='That is direct multiplication. For inverse proportion divide the fixed area by the width.';
 else if(Math.abs(v-p.initial)<.005)message='Width and height do not have to match. The fixed product tells you the height.';
 else if(Math.abs(v-p.k-p.initial)<.005||Math.abs(v-(p.k-p.initial))<.005)message='Subtracting does not preserve area. Multiply width by height to check.';
 else message='Not yet: height = fixed area ÷ width. The plotted point must match that product.';}
 else {ok=true;message='Correct! '+fmt(p.initial)+' × '+fmt(expected)+' = '+fmt(p.k)+'. The fixed product makes this inverse proportion.';}
 api.check(ok,message,{preset:ids[ix],width:p.initial,height:v,area:a});fb.textContent=message;fb.classList.toggle('good',ok);fb.classList.toggle('bad',!ok);emit('correct',{preset:ids[ix],correct:ok});if(ok){solved=true;correct++;ck.disabled=true;next.disabled=false;paint();}}
 function giveHint(){const p=now();const msg='Keep the product '+fmt(p.k)+' unchanged. Calculate height by dividing '+fmt(p.k)+' by width '+fmt(p.initial)+'.';api.hint(msg);fb.textContent=msg;emit('hintUsed',{preset:ids[ix]});}
 function advance(){if(!solved)return;if(ix===ids.length-1){q.textContent='All four inverse-proportion challenges completed!';inputs.hidden=true;controls.hidden=true;stage.innerHTML='';N.cap(stage,ID,'INVERSE PROPORTION COMPLETE');N.scene.helperStrip(stage,'celebrate','You proved a constant product.');fb.textContent='Brilliant: when width grows, height shrinks to keep the same area.';return;}ix++;solved=false;height.value='';product.value='';ck.disabled=false;next.disabled=true;fb.textContent='';paint();}
 [height,product].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')verify();}));C._challenge={get:()=>({index:ix,solved,correct,attempts,feedback:fb.textContent}),setAnswers:(v,a)=>{height.value=v;product.value=a;},check:verify,hint:giveHint,next:advance};paint();}
const DEF={id:ID,title:'Inverse Proportion Rectangle',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'A glass neon rectangle changes shape while retaining constant area. Matching width and height points form a reciprocal curve, and the corner snaps to labelled width targets.',
 staticAlt:'A fixed area K gives y = K divided by x. For example area 24 means width 4 and height 6, width 6 and height 4. When x increases y decreases; xy remains K.',
 spec:{purpose:'Demonstrate inverse proportion using constant-area rectangles and a reciprocal graph.',params:'Fixed area K, finite labelled width positions x, computed height y = K/x, reciprocal plot, decimal precision.',presets:'Y8-037, Y9-013, Y9-019, Y9-020.',steps:'Start with fixed area → stretch → squash → preserve product → plot pairs → trace inverse curve.',interactions:'Drag the neon corner to the labelled width slots with snap/re-grab/red return zone. Keyboard arrows and Delete; numeric two-part Challenge with diagnostic feedback.',traps:'Treating inverse as direct multiplication, assuming constant sum, confusing area and perimeter, plotting a straight line, treating width and height as equal.',gcse:'Reciprocal graphs, k/x, proportionality constants and interpreting inverse models.'}};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"graphic":["stage","p","o"]},exploreFields:{"x":{"kind":"value","factory":null,"argCount":null},"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F6·09',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 8 and 9; GCSE reciprocal graphs',linked:['F0-02','F0-03','F0-04','F0-14','F6-08']});
})();
