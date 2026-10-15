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

/* NOVA Maths Visual Engine F9-13 — Fractal Generators.
 * Core-only geometry: NOVA.neonPath, NOVA.neonRing, NOVA.neonBox, NOVA.chalkText;
 * motion: NOVA.motion; draggable interaction: NOVA.ui.svgDrag.
 * Sierpinski S(n) = 3^n surviving triangles; Koch K(n) = 4^n segments.
 * If original Koch length is 9 cm, stage n=2 length is 16 cm.
 */
const F913_CONFIG={id:'F9-13',family:'F9',startMode:'watch',maxIteration:4,
 presets:{'sierpinski-triangle':{label:'Sierpiński · triangle',kind:'sierpinski',factor:3,initial:1,max:4},'koch-curve':{label:'Koch · curve',kind:'koch',factor:4,initial:1,max:4,baseCm:9}},
 events:{value:['preset','iteration','count','length','placed','challengeTask'],types:['step','correct','hintUsed','mode']},
 challenge:{types:['sierpinski-count','koch-count','koch-length']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F913_CONFIG),ID=C.id;
const mobile=()=>window.innerWidth<=760,W=()=>mobile()?430:760,HGT=()=>760;
const PRE=C.presets;
const STORIES=[
 {name:'whole-triangle',preset:'sierpinski-triangle',iteration:0,pose:'explain',text:'We begin with one whole triangle. That is iteration zero.',question:'How many triangles can you see before anything changes?',detail:'Iteration 0: one whole triangle'},
 {name:'split-and-remove',preset:'sierpinski-triangle',iteration:1,pose:'point-right',text:'Keep the three corner triangles. The middle triangle is removed.',question:'Count only the remaining corner triangles.',detail:'Iteration 1: three smaller triangles'},
 {name:'repeat-the-rule',preset:'sierpinski-triangle',iteration:2,pose:'count',text:'Repeat that same step for every triangle. Each one leaves three new triangles.',question:'How many remain after each of the three triangles is split?',detail:'Iteration 2: nine smaller triangles'},
 {name:'generalise-the-pattern',preset:'sierpinski-triangle',iteration:3,pose:'idea',text:'One, three, nine, twenty-seven. The number of triangles triples each time.',question:'Explain why the number is three to the power of the iteration.',detail:'Iteration 3: twenty-seven smaller triangles'},
 {name:'koch-four-for-one',preset:'koch-curve',iteration:1,pose:'point-right',text:'Now watch a different fractal. Each straight section becomes four short sections.',question:'Count the four new sections in place of the original one.',detail:'Koch iteration 1: four segments'},
 {name:'koch-repeat-length',preset:'koch-curve',iteration:2,pose:'celebrate',text:'Each of the four sections becomes four more. Four times four makes sixteen sections.',question:'If the first line was nine centimetres, explain why iteration two totals sixteen centimetres.',detail:'Koch iteration 2: sixteen segments'}
];
const TASKS=[
 {preset:'sierpinski-triangle',iteration:3,title:'01 · Count the surviving triangles',guide:'After three Sierpiński iterations, how many of the smallest triangles remain?',options:[27,9,81],answer:27,suffix:'triangles',traps:{9:'Nine is iteration two. Repeat the three-for-one rule once more.',81:'Eighty-one is iteration four. You have repeated the rule one step too far.'}},
 {preset:'koch-curve',iteration:2,title:'02 · Count the Koch sections',guide:'The Koch curve is at iteration two. How many short straight sections does it have?',options:[16,8,12],answer:16,suffix:'segments',traps:{8:'Eight assumes only two new sections per previous section. Each becomes four.',12:'Twelve treats the growth as adding a fixed number. Multiply by four each time.'}},
 {preset:'koch-curve',iteration:2,title:'03 · Find the total length',guide:'The original Koch line was 9 cm. After two iterations, what is its TOTAL length?',options:[16,9,36],answer:16,suffix:'cm',traps:{9:'The total length is not unchanged: each segment is replaced by four third-length pieces.',36:'Thirty-six multiplies the length by four without accounting for each new piece being one third as long.'}}
];
let chosen='sierpinski-triangle',iteration=2,challengeIndex=0,placed=null,selected=null,challengeStage=null,challengeApi=null;
// F9-13 local pointer-release safeguard: Chrome may report SVG <g> capture without
// dispatching the final pointerup to the captured <g> when its child is reparented.
// The core drag object owns the authoritative zone detection, cancellation and snap.
// This forwards only releases of F9-13 draggables; no shared NOVA core modification.
window.addEventListener('pointerup',e=>{const d=N.ui._drag;if(d&&d.el&&d.el.hasAttribute('data-f913-drag'))d.up(e);},true);
// Mouseup fallback is needed when browsers lose a captured SVG <g> pointer release.
window.addEventListener('mouseup',e=>{const d=N.ui._drag;if(d&&d.el&&d.el.hasAttribute('data-f913-drag'))d.up(e);},true);
window.addEventListener('pointercancel',()=>{const d=N.ui._drag;if(d&&d.el&&d.el.hasAttribute('data-f913-drag'))N.ui.cancelDrag();},true);
function emit(k,v){if(!C.events.value.includes(k))throw Error('F9-13 unregistered event '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
function count(p,n){return Math.pow(p.factor,n);} // n=0 → one piece
function lengthCm(n,base=9){return base*Math.pow(4/3,n);} // accurate Koch total length
function btn(s,fn,cl='nova-btn ghost'){return H('button',{class:cl,text:s,onclick:fn});}
function txt(svg,x,y,s,z=22,role='support',anchor='middle'){return N.chalkText(svg,x,y,String(s),{size:z,role,anchor});}
function tile(svg,x,y,w,h,s,role='given',sz=20){return N.neonBox(svg,x,y,w,h,{role,r:12,text:s,size:sz});}
function svgRoot(desc){const q=N.svg.root(W(),HGT(),desc);q.setAttribute('class','nv-svg f913-svg');q.setAttribute('role','img');return q;}
function clear(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("clear",arguments);}
stage.replaceChildren();N.cap(stage,'Sequence workshop','Fractal generators');}
function card(k,v,focus=false){return H('div',{class:'f913-card'+(focus?' f913-card--focus':'')},[H('div',{class:'f913-eyebrow',text:k}),H('div',{class:'f913-maths',text:String(v)})]);}
function aside(k,v){return H('div',{class:'f913-card f913-card--full'},[H('div',{class:'f913-eyebrow',text:k}),H('div',{class:'f913-body',text:String(v)})]);}
function mount(stage,svg,cards,pose,speech){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,speech]=window.NovaLessonComponent.args("mount",arguments);}
stage.appendChild(H('div',{class:'f913-stage'},[svg,H('aside',{class:'f913-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function triPath(a,b,c){return 'M'+a[0].toFixed(2)+','+a[1].toFixed(2)+'L'+b[0].toFixed(2)+','+b[1].toFixed(2)+'L'+c[0].toFixed(2)+','+c[1].toFixed(2)+'Z';}
function midpoint(a,b){return [(a[0]+b[0])/2,(a[1]+b[1])/2];}
function splitTriangles(a,b,c,n,out){if(n===0){out.push([a,b,c]);return;}
 const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);
 splitTriangles(a,ab,ca,n-1,out);splitTriangles(ab,b,bc,n-1,out);splitTriangles(ca,bc,c,n-1,out);
}
function kochPoints(n){let pts=[[0,0],[1,0]];for(let level=0;level<n;level++){
 let next=[pts[0]];
 for(let i=0;i<pts.length-1;i++){
  const a=pts[i],b=pts[i+1],dx=(b[0]-a[0])/3,dy=(b[1]-a[1])/3;
  const one=[a[0]+dx,a[1]+dy],three=[a[0]+2*dx,a[1]+2*dy];
  const peak=[one[0]+dx*.5+dy*Math.sqrt(3)/2, one[1]+dy*.5-dx*Math.sqrt(3)/2];
  next.push(one,peak,three,b);
 }
 pts=next;
}return pts;}
function drawFractal(svg,preset,n,opt={}){
 const sm=mobile(),w=W(),kind=preset.kind;
 const g=E('g',{class:'f913-fractal','data-fractal':kind,'data-iteration':n},svg);
 txt(svg,w/2,51,kind==='sierpinski'?'SIERPIŃSKI TRIANGLE':'KOCH CURVE',sm?24:29,'support');
 txt(svg,w/2,91,opt.title||'Repeat the SAME transformation',sm?17:19,'support');
 if(kind==='sierpinski'){
  let edge=sm?352:430,base=sm?445:477,top=base-edge*Math.sqrt(3)/2,
      a=[w/2,top],b=[(w-edge)/2,base],c=[(w+edge)/2,base],tris=[];
  splitTriangles(a,b,c,n,tris);
  let all='';
  for(let i=0;i<tris.length;i++) all+=triPath(...tris[i]);
  // One core neonPath call ensures consistent F0 tube glow without creating hundreds of filter instances.
  N.neonPath(g,all,{role:n===0?'op':'focus',width:n>=3?1.6:n===2?2.3:4,fill:false});
  // Colour-shadow outline identifies the complete original geometric boundary.
  if(n>0)N.neonPath(g,triPath(a,b,c),{role:'support',width:1.8});
  if(n===0)N.neonRing(g,w/2,top,{role:'focus',r:7,pulse:false});
  g.setAttribute('data-pieces',String(tris.length));
 }else{
  let pts=kochPoints(n),x0=sm?37:90,width=sm?356:580,y0=sm?338:325,scale=width;
  let path=pts.map((p,i)=>(i?'L':'M')+(x0+p[0]*scale).toFixed(2)+','+(y0+p[1]*scale).toFixed(2)).join('');
  N.neonPath(g,path,{role:'op',width:n>=3?2.8:n>=2?4.0:6.3});
  N.neonRing(g,x0,y0,{role:'focus',r:7,pulse:false});N.neonRing(g,x0+width,y0,{role:'result',r:7,pulse:false});
  g.setAttribute('data-pieces',String(pts.length-1));
  txt(svg,w/2,445,'Every straight segment becomes FOUR smaller ones',sm?16:19,'support');
 }
 return g;
}
function renderCountRow(svg,preset,n,challenge=false){
 const w=W(),sm=mobile(),y=sm?543:554,countValues=[0,1,2,3,4];
 txt(svg,w/2,y-54,'ITERATION  →  '+(challenge?'FIND THE NEXT COUNT':'NUMBER OF PIECES'),sm?18:22,'support');
 for(let i=0;i<5;i++){
  let xc=sm?55+i*80:115+i*131,wd=sm?65:100;
  const unknown=challenge&&i>=2;
  tile(svg,xc-wd/2,y,wd,59,unknown?'?':String(i), i===n?'focus':'given',sm?21:24);
  txt(svg,xc,y+91,unknown?'?':String(count(preset,i)),sm?18:21,unknown?'support':'result');
 }
}
function attachIterationDrag(svg,onValue,n){
 const sm=mobile(),w=W(),y=sm?669:667,x0=sm?59:124,x1=w-x0,step=(x1-x0)/4;
 N.neonLine(svg,x0,y,x1,y,{role:'support',width:5});
 for(let i=0;i<5;i++){N.neonRing(svg,x0+i*step,y,{role:i===n?'focus':'support',r:5,pulse:false});txt(svg,x0+i*step,y+44,String(i),sm?17:18,'support');}
 const cx=x0+n*step,handle=E('g',{'data-iteration-handle':'true','data-f913-drag':'1','role':'slider','aria-label':'Iteration slider','aria-valuemin':'0','aria-valuemax':'4','aria-valuenow':String(n),'tabindex':'0'},svg);
 N.neonRing(handle,cx,y,{role:'focus',r:15,pulse:false});
 handle.addEventListener('keydown',e=>{let next=null;if(e.key==='ArrowLeft'||e.key==='ArrowDown')next=Math.max(0,n-1);if(e.key==='ArrowRight'||e.key==='ArrowUp')next=Math.min(4,n+1);if(e.key==='Home')next=0;if(e.key==='End')next=4;if(next!==null){e.preventDefault();onValue(next);}});
 const zones=()=>Array.from({length:5},(_,i)=>({id:String(i),kind:'drop',x:x0+i*step-step*.47,y:y-39,w:step*.94,h:78}));
 // Reset tray: also provided as an ordinary keyboard control below the diagram.
 const reset={id:'reset',kind:'remove',x:sm?21:205,y:729,w:sm?388:350,h:28};
 N.neonBox(svg,reset.x,reset.y,reset.w,reset.h,{role:'error',text:'Reset iteration',size:sm?13:15,r:10});
 N.ui.svgDrag(svg,handle,{box:{x:cx-19,y:y-19,w:38,h:38},zones:()=>[...zones(),reset],onDrop:id=>{const v=Number(id);if(!Number.isInteger(v)||v<0||v>4)return false;onValue(v);return true;},onRemove:()=>onValue(0),removeTo:{x:w/2,y:sm?741:716}});
}
function sceneDraw(stage,presetName,n,opts={}){
if(window.NovaLessonComponent?.active){[stage,presetName,n,opts]=window.NovaLessonComponent.args("sceneDraw",arguments);}

 clear(stage);const p=PRE[presetName],sm=mobile(),svg=svgRoot('Fractal iteration '+n+' of '+p.label+'. '+count(p,n)+' pieces.');
 drawFractal(svg,p,n,{title:opts.title});
 renderCountRow(svg,p,n,false);
 if(opts.drag)attachIterationDrag(svg,opts.onIteration||((v)=>{chosen=presetName;iteration=v;emit('iteration',v);emit('count',count(p,v));sceneDraw(stage,chosen,iteration,{drag:true,title:'Move the ring to change iterations'});}),n);
 else N.svg.pill(svg,W()/2,sm?694:668,'Iteration '+n+' · '+count(p,n)+' '+(p.kind==='koch'?'segments':'small triangles'),{role:'focus',size:sm?17:21});
 const hint=p.kind==='sierpinski'?'The number of surviving little triangles TRIPLES at each iteration.':'The number of straight sections is multiplied by FOUR each iteration.';
 const cards=[card('FRACTAL',p.kind==='sierpinski'?'Sierpiński triangle':'Koch curve'),card('ITERATION',String(n)),card('PIECES',String(count(p,n)),true),aside('REPEAT THE RULE',hint)];
 if(opts.step&&p.kind==='koch')cards.push(card('9 CM ORIGINAL → LENGTH',n===1?'12 cm':n===2?'16 cm':'9 cm',true));
 if(p.kind==='koch')cards.push(aside('LENGTH IS DIFFERENT','The number of pieces grows by four; each new piece is one third the length.'));
 else cards.push(aside('WHAT CHANGES?','The smallest visible triangles become more numerous and smaller each time.'));
 const step=opts.step;
 mount(stage,svg,cards,step?step.pose:(p.kind==='koch'?'point-right':'count'),step?step.text:(p.kind==='koch'?'Four smaller pieces replace each straight one.':'Count only the surviving triangles.'));
 if(!N.reducedMotion()&&n>0){const g=svg.querySelector('.f913-fractal');g.style.opacity='.15';N.motion.tween(460,v=>{if(g.isConnected)g.style.opacity=String(.15+.85*v);},N.motion.ease.out);}
}
function targetBox(){return {id:'answer',kind:'drop',x:W()/2-77,y:505,w:154,h:68};}
function removeBox(){return {id:'remove',kind:'remove',x:mobile()?37:180,y:mobile()?689:679,w:mobile()?356:400,h:58};}
function pickValue(v){if(selected!==null)selected=null;selected=v;}
function changeAnswer(v){placed=v;selected=null;emit('placed',v);drawChallenge(challengeStage,challengeApi);}
function wrongMessage(t,v){return t.traps[v]||'Look at how the repeated step changes the count.';}
function checkCandidate(v,api){const t=TASKS[challengeIndex];if(v!==t.answer){api.check(false,wrongMessage(t,v),{task:challengeIndex,answer:v});return false;}changeAnswer(v);return true;}
function sourceCard(svg,v,i,t,api){
 const sm=mobile(),w=W(),bw=sm?94:122,bh=49,gap=sm?115:165,xx=w/2-gap+(i*gap)-bw/2,yy=sm?618:610;
 const g=E('g',{'data-source':String(v),'data-f913-drag':'1',tabindex:0,role:'button','aria-label':'Choose '+v+(t.suffix==='cm'?' centimetres': ' '+t.suffix)},svg);
 tile(g,xx,yy,bw,bh,String(v)+(t.suffix==='cm'?' cm':''),'given',sm?20:24);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=v;g.setAttribute('aria-pressed','true');}});
 const tb=targetBox(),rm=removeBox();
 N.ui.svgDrag(svg,g,{box:{x:xx,y:yy,w:bw,h:bh},zones:()=>[tb,rm],onDrop:id=>id==='answer'?checkCandidate(v,api):false,onRemove:()=>{selected=null;},removeTo:{x:w/2,y:rm.y+rm.h/2}});
}
function placedCard(svg,value){const b=targetBox();const g=E('g',{'data-placed':String(value),'data-f913-drag':'1',role:'button',tabindex:0,'aria-label':'Placed '+value+'. Press Delete to remove.'},svg);
 tile(g,b.x,b.y,b.w,b.h,String(value)+(TASKS[challengeIndex].suffix==='cm'?' cm':''),'result',23);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();changeAnswer(null);}});
 const rm=removeBox();N.ui.svgDrag(svg,g,{box:{x:b.x,y:b.y,w:b.w,h:b.h},zones:()=>[rm],onDrop:()=>false,onRemove:()=>changeAnswer(null),removeTo:{x:W()/2,y:rm.y+rm.h/2}});
}
function drawChallenge(stage,api){
if(window.NovaLessonComponent?.active){[stage,api]=window.NovaLessonComponent.args("drawChallenge",arguments);}
challengeStage=stage;challengeApi=api;clear(stage);const t=TASKS[challengeIndex],p=PRE[t.preset],sm=mobile(),w=W(),svg=svgRoot(t.guide);
 drawFractal(svg,p,t.iteration,{title:'Inspect this iteration carefully'});
 const tgt=targetBox(),rm=removeBox();
 txt(svg,w/2,468,t.suffix==='cm'?'What is the TOTAL length?':'How many smallest pieces?',sm?20:23,'support');
 if(placed===null)tile(svg,tgt.x,tgt.y,tgt.w,tgt.h,'Drop here','unknown',sm?20:24);
 // The keyboard/drop target is BELOW the placed card in SVG paint order.
 // Otherwise its transparent hit area intercepts re-grabs of a placed answer.
 E('rect',{x:tgt.x,y:tgt.y,width:tgt.w,height:tgt.h,rx:13,fill:'transparent','data-slot':'answer',role:'button',tabindex:0,'aria-label':'Answer drop target. Enter places the selected number.'},svg)
 .addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&selected!==null){e.preventDefault();checkCandidate(selected,api);}});
 if(placed!==null)placedCard(svg,placed);
 txt(svg,w/2,587,'CHOOSE A NUMBER',sm?18:21,'support');
 t.options.forEach((v,i)=>{if(v!==placed)sourceCard(svg,v,i,t,api);});
 const rmDraw=tile(svg,rm.x,rm.y,rm.w,rm.h,'Remove / reset','error',sm?17:19);rmDraw.setAttribute('data-remove-zone','1');
 const cards=[card('QUESTION',String(challengeIndex+1)+' of 3'),card('ITERATION',t.iteration,true),aside('WHAT TO CHECK',challengeIndex===0?'Three pieces replace every surviving triangle. Count how many repetitions occur.':challengeIndex===1?'Each segment becomes four. Counting sections is not the same as measuring length.':'Each new segment is one third as long, although there are four times as many.')];
 mount(stage,svg,cards,challengeIndex===2?'think':'point-right',challengeIndex===0?'Look at each layer of the triangle.':challengeIndex===1?'Count the sections, not the corner points.':'Be careful: segment count and total length are different.');
 stage.appendChild(H('div',{class:'f913-progress'},[H('span',{text:'01 · Triangle'}),H('span',{text:'02 · Segments'}),H('span',{text:'03 · Length'})].map((x,i)=>{if(i===challengeIndex)x.classList.add('f913-progress-active');return x;})));
}
const def={id:ID,title:'Fractal generators',config:C,
 alt:'Sierpiński triangles and Koch curves demonstrate recursive sequences. Surviving triangle count triples; Koch segment count quadruples.',
 staticAlt:'Sierpiński iteration 0,1,2,3 has 1,3,9,27 surviving triangles. Koch curve iteration 0,1,2 has 1,4,16 segments. Starting at 9 cm, the Koch iteration 2 total length is 16 cm.',
 steps:STORIES.map((s,i)=>({name:s.name,narration:s.text,prompt:s.question,mood:i===5?'pleased':'focus'})),
 render(i,stage){const story=STORIES[i];sceneDraw(stage,story.preset,story.iteration,{step:story,title:story.detail});emit('iteration',story.iteration);},
 exploreIntro:'Change the fractal, then drag the gold ring or adjust the iteration slider to watch repeated multiplication.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();chosen='sierpinski-triangle';window.NovaLessonComponent?.applyExploreModels();iteration=2;
 window.NovaLessonComponent?.applyExploreModels();const select=H('div',{class:'f913-presetbar'}),native=H('input',{type:'range',min:0,max:4,value:2,'aria-label':'Fractal iteration from zero to four'}),readout=H('output',{text:'Iteration 2'});
 window.NovaLessonComponent?.applyExploreModels();const update=(v)=>{iteration=Math.max(0,Math.min(4,Number(v)));native.value=String(iteration);readout.textContent='Iteration '+iteration;emit('iteration',iteration);emit('count',count(PRE[chosen],iteration));sceneDraw(stage,chosen,iteration,{drag:true,title:'Change the iteration to grow the fractal',onIteration:update});};
 window.NovaLessonComponent?.applyExploreModels();Object.entries(PRE).forEach(([key,p])=>select.appendChild(btn(p.label,()=>{chosen=key;emit('preset',key);update(iteration);},'nova-btn ghost')));
 window.NovaLessonComponent?.applyExploreModels();native.addEventListener('input',()=>update(native.value));
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f913-instruction',text:'Pick the triangle or curve. Drag the gold iteration ring, use arrow keys, or adjust the slider below.'}),select,H('div',{class:'f913-controls'},[H('label',{},['Iteration ',native]),readout,btn('Reset to 0',()=>update(0),'nova-btn ghost'),btn('Next iteration',()=>update(iteration===4?0:iteration+1),'nova-btn primary')]));
 window.NovaLessonComponent?.applyExploreModels();update(2);
 },
 challenge(panel,api,stage){challengeIndex=0;placed=null;selected=null;
 const heading=H('h3',{class:'f913-taskhead'}),description=H('p',{class:'f913-instruction'}),controls=H('div',{class:'f913-controls'}),status=H('p',{class:'f913-status',role:'status'});
 function load(){const t=TASKS[challengeIndex];heading.textContent=t.title;description.textContent=t.guide;controls.replaceChildren();api.fb.textContent='';api.fb.className='nova-fb';
 controls.append(btn('Check answer',()=>{
  if(placed===null){api.check(false,'Choose a value and place it in the answer slot first.',{task:challengeIndex});return;}
  if(placed!==t.answer){api.check(false,wrongMessage(t,placed),{task:challengeIndex});return;}
  api.check(true,challengeIndex===0?'Yes: 3 × 3 × 3 gives 27 surviving triangles.':challengeIndex===1?'Correct: 4 × 4 makes 16 short sections.':'Correct: nine centimetres grows to sixteen centimetres after two Koch iterations.',{task:challengeIndex,score:challengeIndex+1});
  if(challengeIndex===2){heading.textContent='All three challenges complete';description.textContent='You distinguished triangle count, segment count and Koch length.';controls.replaceChildren(H('p',{class:'f913-maths',text:'3 / 3 · Fractal rules proven'}));N.moment&&N.moment(document.getElementById(ID),'correct',{ms:1100});return;}
  controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed=null;selected=null;emit('challengeTask',challengeIndex);load();},'nova-btn primary'));
 },'nova-btn primary'),btn('Clear answer',()=>{placed=null;selected=null;drawChallenge(stage,api);},'nova-btn ghost'),btn('Hint',()=>api.hint(challengeIndex===0?'At iteration two there are 9 triangles. Triple that count once more.':challengeIndex===1?'Start with one straight segment, then multiply the number by four twice.':'Nine centimetres becomes twelve after iteration one. Each new length grows by four thirds.'),'nova-btn ghost'));
 drawChallenge(stage,api);
 }
 panel.append(heading,description,controls,status);emit('challengeTask',challengeIndex);load();
 },
 onRestore(){chosen='sierpinski-triangle';iteration=2;challengeIndex=0;placed=null;selected=null;}
};
N.registry.add({id:ID,title:'Fractal generators',topics:['sequences','fractal','recursive patterns','multiplicative sequences','geometry'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STORIES":()=>STORIES,"TASKS":()=>TASKS},draws:{"clear":["stage"],"mount":["stage","svg","cards","pose","speech"],"sceneDraw":["stage","presetName","n","opts"],"drawChallenge":["stage","api"]},exploreFields:{}});
N.bankMount({id:ID,num:'13',title:'Fractal generators · Premium Edition',def,linked:['F9-06','F9-07','F9-10'],years:'KS3 Years 7–9 extension and GCSE geometric-sequences bridge',spec:{
 purpose:'Explore recursive geometric structures, connect iterations to multiplicative sequences and distinguish piece count from total length.',
 params:'Sierpiński triangle or Koch curve; iteration 0–4; original Koch length defaults to 9 cm; mobile-first stage.',
 presets:'Sierpiński triangle (×3 surviving pieces) and Koch curve (×4 segments, total length growth by four-thirds).',
 steps:'Whole triangle → remove middle → repeat → generalise counts → Koch four-for-one → compare Koch counts and length.',
 interactions:'Watch, Guided, Explore two presets and draggable iteration slider; Challenge three drag-answer tasks with re-grab, removal, keyboard fallback and specific misconception feedback.',
 traps:'Mixing up removed pieces and survivors, adding rather than multiplying, counting vertices as segments, multiplying length by four while forgetting one-third length.',
 gcse:'Extension to geometric nth terms, index notation, scale factors, growth and fractal perimeter reasoning.'
}});
window.F913_ENGINE=N.engines[ID];
const c=document.getElementById(ID),details=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...c.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>details.appendChild(x));c.appendChild(details);
const x=c.querySelector('h3');if(x)x.textContent='Interactive maths workshop';
const fixAlt=()=>c.querySelectorAll('.face img').forEach(im=>{if(!im.getAttribute('alt'))im.setAttribute('alt','Sir Bob Maximus, maths tutor');});fixAlt();new MutationObserver(fixAlt).observe(c,{childList:true,subtree:true});
})();
