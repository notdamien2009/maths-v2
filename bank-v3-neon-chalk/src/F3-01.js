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

/* F3-01 Premium Edition: authored fresh to the 2026-10-10 component prompt.
 * Uses ONLY the canonical F0 house API. No private filters, maths drawing primitives or core copies.
 */
const F301_CONFIG={
 id:'F3-01',startMode:'watch',preset:'Y7-015-prime-factorisation',
 rows:3,columns:4,maxRows:12,maxColumns:12,shape:'tile',split:2,
 presets:{'Y7-015-prime-factorisation':{label:'Year 7 · Prime factorisation',rows:3,columns:4,min:2,max:144}},
 events:{value:['rows','columns','product','view','split','pair','primeLeaf','target','challengeTask'],types:['step','correct','hintUsed','mode']},
 challenge:{targets:[24,12,30],maxAttemptsPerTask:0}
};
(function(){'use strict';
const N=window.NOVA,C=window.NovaV2Integration.configuration(F301_CONFIG),E=N.svg.el,H=N.h,id=C.id;
function corePose(p){
 // F0 owns the helper art, placement and motion. Only its universal slots are supplied to its dock.
 const slots=['idle','think','cheer','oops','point','explain','walk','leap'];
 const map={'ruler':'point','point-left':'point','point-right':'point','point-down':'point','show-one':'point','show-two':'point','show-three':'point','count':'point','magnify':'think','idea':'think','compare':'think','high-five':'cheer','celebrate':'cheer','success':'cheer','read-tablet':'think','checking':'think','not-yet':'oops','question':'think','encourage':'cheer'};
 return slots.includes(p)?p:(map[p]||'explain');
}
const speech={
 'build-rows':{pose:'explain',skin:'pip',text:'Count one equal row at a time. The rows must each hold the same number of pieces.'},
 'count-up':{pose:'point-right',skin:'pip',text:'Three rows of four means four plus four plus four. That makes twelve.'},
 'rotate':{pose:'think',skin:'pip',text:'Turn the whole arrangement. The same twelve pieces now form four rows of three.'},
 'split':{pose:'explain-right',skin:'nova',text:'The golden divider separates columns, not the total. Both smaller arrays still make twelve.'},
 'tree':{pose:'idea',skin:'pip',text:'Split twelve into factors. Keep splitting composite branches until the leaves are prime.'},
 'collect':{pose:'celebrate',skin:'pip',text:'The final prime leaves are two, two and three. Multiplying them rebuilds twelve.'}
};
let current={rows:3,cols:4,split:2,view:'array',shape:'tile'},currentStage=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered value event '+key);N.events.emit('value',{engine:id,key,value});}
function sane(n,min,max){return Math.max(min,Math.min(max,Math.round(Number(n)||min)));}
function prime(n){if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}
function leaves(n){const a=[];for(let d=2;d<=n;d++){while(n%d===0){a.push(d);n/=d;}}return a;}
function pairs(n){const p=[];for(let k=1;k*k<=n;k++)if(n%k===0)p.push([k,n/k]);return p;}
function root(alt){return N.svg.root(760,560,alt);}
function txt(p,x,y,t,sz=21,role){return N.chalkText(p,x,y,String(t),{size:sz,role:role||undefined});}
function box(p,x,y,w,h,role='given',text=null,size=20){return N.neonBox(p,x,y,w,h,{role,text,size,r:10});}
function ring(p,x,y,role='focus',r=12){return N.neonRing(p,x,y,{role,r,pulse:false});}
function line(p,x1,y1,x2,y2,role='op',width=3){return N.neonLine(p,x1,y1,x2,y2,{role,width});}
function path(p,d,role='op',width=3){return N.neonPath(p,d,{role,width});}
function hbtn(label,fn,cls='nova-btn'){return H('button',{class:cls,text:label,onclick:fn});}
function titleStage(st,title){N.cap(st,'Mathematical equipment',title);}
function clampCells(r,c){let cell=Math.min(81,460/Math.max(c,1),322/Math.max(r,1));return Math.max(24,cell);}
function createArray(st,o){let r=sane(o.rows,1,C.maxRows),c=sane(o.cols,1,C.maxColumns),cell=clampCells(r,c);
 const w=c*cell,h=r*cell,x=380-w/2,y=278-h/2,svg=root(`${r} rows of ${c} glass neon cells, ${r*c} altogether`);
 const board=E('g',{class:'f301-board'},svg),mode=o.shape||'tile',rowsVisible=o.visibleRows===undefined?r:o.visibleRows;
 N.svg.grid(board,x,y,w,h,cell,{role:'support'});
 const body=E('g',{class:'f301-board-contents'},board);
 for(let i=0;i<r;i++){
   let row=E('g',{class:'f301-row','data-row':i},body);
   for(let j=0;j<c;j++){
     const cx=x+j*cell+cell/2,cy=y+i*cell+cell/2;
     if(i<rowsVisible){
       if(mode==='dot'){ring(row,cx,cy,o.step===1?'focus':'given',Math.min(cell*.21,15));}
       else{box(row,cx-cell*.43,cy-cell*.43,cell*.86,cell*.86,i===r-1&&o.step===1?'focus':'given',null);ring(row,cx,cy,i===r-1&&o.step===1?'focus':'op',Math.max(6,Math.min(cell*.13,11)));}
     }else box(row,cx-cell*.43,cy-cell*.43,cell*.86,cell*.86,'support',null);
   }
   if(o.animate&&i<rowsVisible&&!N.reducedMotion()){N.motion.arrive(row,0,-24-(r-i)*8,440+60*i,N.motion.ease.back);}
 }
 N.svg.brace(svg,x-14,y+2,x-14,y+h-2,{role:'op',depth:13});
 N.svg.brace(svg,x+3,y-13,x+w-3,y-13,{role:'given',depth:13});
 txt(svg,x-38,y+h/2+5,r+' rows',Math.max(18,23), 'op');
 txt(svg,x+w/2,y-43,c+' columns',22,'given');
 if(o.view==='split'){
   const split=sane(o.split||1,1,c-1),bx=x+split*cell;
   N.neonLine(svg,bx,y-7,bx,y+h+6,{role:'focus',width:5});
   N.svg.brace(svg,x,y+h+25,bx,y+h+25,{role:'focus',depth:9});
   N.svg.brace(svg,bx,y+h+25,x+w,y+h+25,{role:'result',depth:9});
   txt(svg,(x+bx)/2,y+h+59,`${r} × ${split}`,19,'focus');
   txt(svg,(bx+x+w)/2,y+h+59,`${r} × ${c-split}`,19,'result');
   if(o.interactive){
     let sl=box(svg,bx-17,y+h/2-24,34,48,'focus','↔',23);
     sl.setAttribute('role','slider');sl.setAttribute('tabindex','0');sl.setAttribute('aria-label','Move golden split to partition the columns');sl.setAttribute('aria-valuemin','1');sl.setAttribute('aria-valuemax',String(c-1));sl.setAttribute('aria-valuenow',String(split));
     sl.addEventListener('keydown',e=>{let d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();o.onSplit(sane(split+d,1,c-1));}});
     N.ui.svgDrag(svg,sl,{box:{x:bx-18,y:y+h/2-27,w:36,h:54},zones:()=>Array.from({length:c-1},(_,k)=>({id:String(k+1),kind:'drop',x:x+(k+1)*cell-cell/2,y:y-30,w:cell,h:h+60})),onDrop:dest=>{o.onSplit(Number(dest));return true;}});
   }
 }
 if(o.view==='rotate'&&!N.reducedMotion()){
   N.motion.tween(580,q=>{const a=-90*(1-q);body.setAttribute('transform',`rotate(${a.toFixed(2)},380,278)`);},N.motion.ease.inOut,()=>body.removeAttribute('transform'));
 }
 if(o.interactive){
  const hx=x+w+18,hy=y+h+12,handle=box(svg,hx-17,hy-17,34,34,'focus','↗',23);
  handle.setAttribute('role','slider');handle.setAttribute('tabindex','0');handle.setAttribute('aria-label','Resize array with arrows or drag the corner. Left/right changes columns; up/down changes rows');
  handle.setAttribute('aria-valuetext',r+' rows by '+c+' columns');
  handle.addEventListener('keydown',e=>{
   const d=e.key==='ArrowRight'?[0,1]:e.key==='ArrowLeft'?[0,-1]:e.key==='ArrowDown'?[1,0]:e.key==='ArrowUp'?[-1,0]:null;
   if(d){e.preventDefault();o.onResize(sane(r+d[0],1,C.maxRows),sane(c+d[1],1,C.maxColumns));}
   if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onResize(r,c);}
  });
  N.ui.svgDrag(svg,handle,{box:{x:hx-19,y:hy-19,w:38,h:38},zones:()=>[
    {id:'row-plus',kind:'drop',x:hx-26,y:hy+35,w:52,h:50},
    {id:'row-minus',kind:'drop',x:hx-26,y:hy-88,w:52,h:48},
    {id:'col-plus',kind:'drop',x:hx+35,y:hy-26,w:54,h:52},
    {id:'col-minus',kind:'drop',x:hx-92,y:hy-26,w:54,h:52}
   ],onDrop:z=>{const nr=sane(r+(z==='row-plus'?1:z==='row-minus'?-1:0),1,C.maxRows),nc=sane(c+(z==='col-plus'?1:z==='col-minus'?-1:0),1,C.maxColumns);o.onResize(nr,nc);return true;}});
 }
 txt(svg,380,522,o.view==='split'?`${r} × ${o.split} + ${r} × ${c-o.split} = ${r*c}`:`${r} × ${c} = ${r*c}`,25,'result');
 return svg;
}
function factorTree(n){
 let ix=0;function make(v,dep){let node={v,dep};if(prime(v)||v===1){node.x=88+ix++*112;node.children=[];}else{
  let f=2;while(v%f!==0)f++;node.children=[make(f,dep+1),make(v/f,dep+1)];node.x=(node.children[0].x+node.children[1].x)/2;
 }return node;}
 const tree=make(n,0),cnt=ix;
 const leavesN=[];function norm(node){node.x=380+(node.x-(88+(cnt-1)*112/2))*Math.min(1,570/Math.max(1,(cnt-1)*112));node.y=90+Math.min(node.dep,4)*92;if(!node.children.length)leavesN.push(node.v);node.children.forEach(norm);}norm(tree);
 return {tree,leaves:leavesN};
}
function createTree(n,o){
 if(n===1){const svg=root('One is neither prime nor composite and has no prime factorisation');txt(svg,380,95,'One is a special case',28,'support');ring(svg,380,285,'focus',46);box(svg,323,246,114,78,'focus','1',45);txt(svg,380,440,'One has no prime factors',28,'result');return svg;}
 const svg=root(`Factor tree for ${n} ending in prime factors ${leaves(n).join(', ')}`);let t=factorTree(n);
 txt(svg,380,42,'Keep splitting until the leaves are prime',22,'support');
 const walk=node=>{
  for(const ch of node.children){path(svg,`M${node.x} ${node.y+23} Q${node.x} ${(node.y+ch.y)/2} ${ch.x} ${ch.y-26}`,'op',3.5);walk(ch);}
  ring(svg,node.x,node.y,prime(node.v)?'result':'focus',25);
  box(svg,node.x-33,node.y-22,66,44,prime(node.v)?'result':'focus',String(node.v),25);
  if(prime(node.v)&&o.animate)N.motion.flash(svg,node.x,node.y,'result',37);
 };walk(t.tree);
 N.svg.brace(svg,130,478,630,478,{role:'result',depth:12});
 txt(svg,380,526,`${n} = ${t.leaves.join(' × ')}`,26,'result');
 if(o.collect&&t.leaves.length&&!N.reducedMotion())N.motion.trail(svg,'M380,425 Q390,470 380,500','result',750);
 return svg;
}
function treeChallengeSvg(st){const svg=root('Complete 30 as prime factors by placing three factor cards on the empty leaf nodes');
 txt(svg,380,42,'Every final leaf must be prime',22,'support');
 const nd=[[380,82,30],[240,208,3],[520,208,10],[430,365,null],[612,365,null]];
 [[380,104,240,184],[380,104,520,184],[520,230,430,340],[520,230,612,340]].forEach(([x1,y1,x2,y2])=>path(svg,`M${x1},${y1} Q${x1},${(y1+y2)/2} ${x2},${y2}`,'op',3.6));
 nd.slice(0,3).forEach(([x,y,v])=>{ring(svg,x,y,prime(v)?'result':'focus',26);box(svg,x-35,y-24,70,48,prime(v)?'result':'focus',v,25);});
 const slots=[{x:240,y:208,value:3,locked:true},{x:430,y:365,value:2},{x:612,y:365,value:5}];
 slots.slice(1).forEach((q,i)=>{const filled=st.placed[i];box(svg,q.x-36,q.y-24,72,48,filled?'result':'unknown',filled||'?',26);const hit=E('rect',{x:q.x-39,y:q.y-28,width:78,height:56,fill:'transparent'},svg);
  hit.setAttribute('role','button');hit.setAttribute('tabindex',i===st.focus?0:-1);hit.setAttribute('aria-label',`Prime leaf ${i+1}: ${filled||'empty'}`);
  hit.addEventListener('focus',()=>{st.focus=i;});hit.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();st.focus=(st.focus+(e.key==='ArrowRight'?1:1))%2;st.draw();}if(e.key==='Enter'||e.key===' '){e.preventDefault();if(st.held!=null)st.place(st.held,i);else if(filled)st.remove(i);}});
  hit.addEventListener('click',()=>{if(st.held!=null)st.place(st.held,i);else if(filled)st.remove(i);});
  if(filled){
   N.ui.svgDrag(svg,hit,{box:{x:q.x-39,y:q.y-28,w:78,h:56},zones:()=>[
     ...slots.slice(1).map((other,k)=>({id:'leaf-'+k,kind:'drop',x:other.x-52,y:other.y-48,w:104,h:96})),
     {id:'tray',kind:'remove',x:126,y:457,w:510,h:72}],removeTo:{x:380,y:488},
     onDrop:z=>{const k=Number(z.split('-')[1]);if(k===i)return true;return st.place([2,5,3].indexOf(filled),k);},
     onRemove:()=>st.remove(i)});
   hit.addEventListener('pointerdown',ev=>{hit._start={x:ev.clientX,y:ev.clientY};});
   hit.addEventListener('pointerup',ev=>{const z=hit._start;if(z&&Math.hypot(ev.clientX-z.x,ev.clientY-z.y)<6){setTimeout(()=>{if(hit.isConnected)st.remove(i);},0);}});
  }
 });
 txt(svg,380,444,'Pick up a prime card, then choose a branch',20,'given');
 const cardValues=[2,5,3];const positions=[240,380,520];
 cardValues.forEach((v,i)=>{let x=positions[i],g=box(svg,x-36,465,72,48,st.held===i?'focus':'given',v,25);
  g.classList.add('f301-tree-card');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`Factor card ${v}, press Enter to pick up`);
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();st.held=i;st.draw();}});
  g.addEventListener('click',()=>{st.held=i;st.draw();});
  N.ui.svgDrag(svg,g,{box:{x:x-38,y:463,w:76,h:52},zones:()=>[
    ...slots.slice(1).map((q,k)=>({id:'leaf-'+k,kind:'drop',x:q.x-52,y:q.y-48,w:104,h:96})),
    {id:'tray',kind:'remove',x:126,y:457,w:510,h:72}],
    removeTo:{x:380,y:488},onDrop:z=>st.place(i,Number(z.split('-')[1])),onRemove:()=>{st.held=null;st.draw();}});
  // Distinguish a tap from a drag: core drag intentionally cancels native click on pointerdown.
  g.addEventListener('pointerdown',ev=>{g._pstart={x:ev.clientX,y:ev.clientY};});
  g.addEventListener('pointerup',ev=>{const q=g._pstart;if(q&&Math.hypot(ev.clientX-q.x,ev.clientY-q.y)<6){setTimeout(()=>{if(g.isConnected){st.held=i;st.draw();}},0);}});
 });
 N.svg.brace(svg,188,528,566,528,{role:'result',depth:9});
 return svg;
}
function scene(stage,o){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
currentStage=stage;stage.innerHTML='';titleStage(stage,o.label||'Array builder');
 const layout=H('div',{class:'f301-scene'});const svg=o.view==='tree'||o.view==='collect'?createTree(o.rows*o.cols,{collect:o.view==='collect',animate:o.animate}):o.view==='treeChallenge'?treeChallengeSvg(o.state):createArray(stage,o);
 svg.classList.add('f301-art');
 if(window.matchMedia('(max-width:600px)').matches&&(!['tree','collect','treeChallenge'].includes(o.view)||leaves(o.rows*o.cols).length<=4)){svg.setAttribute('viewBox','125 48 510 510');}
 layout.appendChild(svg);
 const cards=H('div',{class:'f301-aside'});
 const p=o.rows*o.cols,chip=N.answerChip(o.hideResult?'?':String(p),true);
 const a=N.neonCard([H('span',{class:'f301-kicker',text:o.view==='tree'?'FACTOR TREE':o.view==='split'?'PARTITION PROOF':'ARRAY PRODUCT'}),H('div',{class:'f301-answer'},[H('span',{class:'f301-maths',text:o.hideResult?'Build the structure':`${o.rows} × ${o.cols}`}),chip])],{role:'result'});
 const b=N.neonCard([H('span',{class:'f301-kicker',text:o.view==='tree'||o.view==='collect'?'PRIME LEAVES':'MATHEMATICAL EVIDENCE'}),H('span',{class:'f301-maths',text:o.view==='tree'||o.view==='collect'?leaves(p).join(' × '):o.view==='split'?`${o.rows*o.split} + ${o.rows*(o.cols-o.split)} = ${p}`:o.view==='rotate'?`${o.cols} × ${o.rows} = ${p}`:`${o.rows} equal groups`})],{role:'op'});
 const c=N.neonCard([H('span',{class:'f301-kicker',text:'NOTICE'}),H('div',{class:'f301-note',text:o.note||'The total is determined by the equal rows and columns.'})],{role:'support'});
 cards.append(a,b,c);layout.appendChild(cards);stage.appendChild(layout);
 const s=speech[o.stepName]||speech['build-rows'];
 N.scene.helperStrip(stage,corePose(o.mood||s.pose),o.helper||s.text);
 // Sir Bob's core narration appears below the stage, and is updated by the core Timeline.
 if(o.animate&&o.stepName==='count-up'&&!N.reducedMotion()){chip.textContent='0';N.countUp(chip,0,p,850);}
 return svg;
}
const steps=[
 {name:'build-rows',narration:'We build three equal rows of four. The identical groups tell us why an array shows multiplication.',prompt:'What is the number in each row?',mood:'neutral'},
 {name:'count-up',narration:'Count four, eight, twelve. Three groups of four make twelve. We count every piece once.',prompt:'Why is three times four equal to twelve?',mood:'focus'},
 {name:'rotate',narration:'Turn the same twelve cells through a quarter turn. Four rows of three still make twelve. Multiplication is commutative.',prompt:'What stayed the same when the rows became columns?',mood:'focus'},
 {name:'split',narration:'Put the gold divider between two columns. Three times two and three times two rebuild three times four. Splitting changes the parts, not the total.',prompt:'How do the two smaller arrays make the original?',mood:'think'},
 {name:'tree',narration:'A factor tree starts at twelve. Twelve splits into two times six. Six splits into two times three. Two and three are prime, so their branches cannot split further.',prompt:'How can you tell the final leaves are all prime?',mood:'think'},
 {name:'collect',narration:'Collect the prime leaves. Two times two times three rebuilds twelve. Every prime leaf was needed, and the product is unchanged.',prompt:'What happens when the prime leaves are multiplied?',mood:'celebrate'}
];
const defs=[
 {view:'array',visibleRows:3,note:'Each row contains four glass counters. There are three equal rows.',animate:true},
 {view:'array',visibleRows:3,note:'Repeated addition: four plus four plus four equals twelve.',animate:true},
 {view:'rotate',rows:4,cols:3,note:'The number of counters is unchanged by a quarter turn.'},
 {view:'split',split:2,note:'Two sub-arrays. The partial totals combine to the original product.'},
 {view:'tree',note:'Composite factors branch; prime numbers cannot split into smaller whole-number factors.'},
 {view:'collect',note:'The final prime leaves multiply to rebuild the original product.',animate:true}
];
function drawStep(i,st){const d=defs[i],o={rows:d.rows||3,cols:d.cols||4,split:d.split||2,view:d.view,shape:'tile',step:i,stepName:steps[i].name,animate:d.animate,note:d.note};scene(st,o);}
function taskUI(panel,label,sub,done){panel.innerHTML='';panel.appendChild(H('div',{class:'f301-meter'},[H('b',{text:'CHALLENGE '+(done+1)+' / 3'}),H('span',{text:label})]));
 panel.appendChild(H('p',{class:'f301-prompt',text:sub}));}
function peer(mode){return mode==='success'?'celebrate':mode==='hint'?'idea':'think';}
const def={id,title:'Array builder',config:C,steps,alt:'Glass neon tiles arranged in equal rows, turning and splitting into factor models.',
 staticAlt:'Three rows of four counters give twelve. The same twelve rotate to four rows of three. Twelve splits into two times six and then two times two times three; every final leaf is prime.',
 render:drawStep,
 exploreIntro:'Explore equal groups, the commutative turn, distributive splits and prime leaves.',
 explore(panel,stage,api){
  window.NovaLessonComponent?.applyExploreModels();const state=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("state",()=>({rows:C.rows,cols:C.columns,split:C.split,shape:C.shape,view:'array'})):({rows:C.rows,cols:C.columns,split:C.split,shape:C.shape,view:'array'}));
  window.NovaLessonComponent?.applyExploreModels();const heading=H('p',{class:'f301-prompt',text:'Shape the maths. Resize the corner or use the controls, then turn, split or factor.'});
  window.NovaLessonComponent?.applyExploreModels();const bar=H('div',{class:'f301-controller'}),views=H('div',{class:'f301-area'});
  window.NovaLessonComponent?.applyExploreModels();const rows=H('select',{'aria-label':'Rows'}),cols=H('select',{'aria-label':'Columns'});
  window.NovaLessonComponent?.applyExploreModels();for(let k=1;k<=C.maxRows;k++)rows.add(new Option(String(k),String(k)));
  window.NovaLessonComponent?.applyExploreModels();for(let k=1;k<=C.maxColumns;k++)cols.add(new Option(String(k),String(k)));
  window.NovaLessonComponent?.applyExploreModels();const rowl=H('label',{},['Rows',rows]),coll=H('label',{},['Columns',cols]);
  window.NovaLessonComponent?.applyExploreModels();const shapes=H('select',{'aria-label':'Cell view'});window.NovaLessonComponent?.applyExploreModels();shapes.add(new Option('Glass tiles','tile'));window.NovaLessonComponent?.applyExploreModels();shapes.add(new Option('Neon dots','dot'));
  window.NovaLessonComponent?.applyExploreModels();const viewsl=H('label',{},['Model',shapes]);window.NovaLessonComponent?.applyExploreModels();bar.append(rowl,coll,viewsl);
  window.NovaLessonComponent?.applyExploreModels();const viewsList=[['array','Array'],['rotate','Turn'],['split','Split'],['tree','Prime tree']];
  window.NovaLessonComponent?.applyExploreModels();const btns={};window.NovaLessonComponent?.applyExploreModels();viewsList.forEach(([v,t])=>{let b=hbtn(t,()=>{state.view=v;ev('view',v);draw();},'nova-btn f301-submode');views.appendChild(b);btns[v]=b;});
  window.NovaLessonComponent?.applyExploreModels();function resize(r,c){state.rows=r;state.cols=c;state.split=Math.min(Math.max(1,state.split),Math.max(1,c-1));ev('rows',r);ev('columns',c);ev('product',r*c);draw();}
  window.NovaLessonComponent?.applyExploreModels();function draw(){rows.value=String(state.rows);cols.value=String(state.cols);shapes.value=state.shape;viewsList.forEach(([v])=>btns[v].setAttribute('aria-pressed',String(state.view===v)));
   scene(stage,{rows:state.view==='rotate'?state.cols:state.rows,cols:state.view==='rotate'?state.rows:state.cols,split:state.split,view:state.view,shape:state.shape,interactive:state.view!=='tree'&&state.view!=='rotate',stepName:state.view==='array'?'build-rows':state.view==='rotate'?'rotate':state.view==='split'?'split':'tree',
     onResize:resize,onSplit:n=>{state.split=n;ev('split',n);draw();},note:state.view==='tree'?'The composite branches split until every leaf is prime.':state.view==='split'?'Move the gold divider. Both parts still build the same array.':'Change one dimension to see the product change.',helper:state.view==='split'?'Drag the gold divider to change the two parts. The total stays fixed.':'Resize the corner by dragging or using its arrow keys.'});}
  window.NovaLessonComponent?.applyExploreModels();rows.onchange=()=>resize(+rows.value,state.cols);window.NovaLessonComponent?.applyExploreModels();cols.onchange=()=>resize(state.rows,+cols.value);
  window.NovaLessonComponent?.applyExploreModels();shapes.onchange=()=>{state.shape=shapes.value;ev('view',state.shape);draw();};
  window.NovaLessonComponent?.applyExploreModels();panel.append(heading,bar,views,H('p',{class:'f301-instruct',text:'Keyboard: focus the golden corner, then use arrow keys to resize; in Split, focus the divider and use left/right.'}));window.NovaLessonComponent?.applyExploreModels();draw();
 },
 challenge(panel,api,stage){
  let task=0,score=0,wrong=0;const found=new Set(),placed=[null,null];let rows=3,cols=3;const C30=[2,5,3],goalPairs=pairs(12);
  const feedback=H('p',{class:'f301-instruct',role:'status'});
  function accepted(text){score++;api.check(true,text,{task,score});N.motion.flash(stage.querySelector('.f301-art')||stage,380,300,'result',44);if(score===3){showWin();}else{task++;ev('challengeTask',task);renderTask();}}
  function fail(msg){wrong++;api.check(false,msg,{task,wrong});}
  function drawTaskArray(){scene(stage,{rows,cols,view:'array',shape:'tile',hideResult:true,interactive:true,stepName:'build-rows',peer:peer(),note:'The dimensions must multiply to the target. A single number is not enough.',onResize:(r,c)=>{rows=r;cols=c;ev('rows',r);ev('columns',c);ev('product',r*c);const ir=panel.querySelector('select[aria-label="Array rows"]'),ic=panel.querySelector('select[aria-label="Array columns"]');if(ir)ir.value=String(r);if(ic)ic.value=String(c);drawTaskArray();}});}
  function drawTaskPairs(){scene(stage,{rows:3,cols:4,view:'array',shape:'dot',hideResult:true,stepName:'rotate',peer:peer(),note:'Each pair must multiply to twelve. List every possible whole-number pair.'});}
  function drawTaskTree(s){scene(stage,{rows:3,cols:10,view:'treeChallenge',state:s,hideResult:true,stepName:'tree',peer:peer(),note:'Place prime factor cards onto their matching empty branch nodes.'});}
  function showWin(){taskUI(panel,'Proof complete','Three structural challenges solved. The products, factor pairs and prime leaves are all accounted for.',2);panel.appendChild(H('p',{class:'f301-maths',text:'3 / 3 proven'}));scene(stage,{rows:3,cols:10,view:'tree',stepName:'collect',peer:peer('success'),note:'Thirty is two times three times five, and all three factors are prime.'});}
  function renderTask(){
    taskUI(panel,['Build an array','Find every factor pair','Complete the prime tree'][task],[
      'Build an array for 24. Use the row/column controls or drag the corner, then check its structure.',
      'Find ALL factor pairs of 12. Select each pair that makes twelve; a completed set is required.',
      'Place the two missing prime factors of thirty onto the correct tree leaves. Check the whole tree.'
     ][task],task);
    if(task===0){rows=3;cols=3;const rowIn=H('select',{'aria-label':'Array rows'}),colIn=H('select',{'aria-label':'Array columns'});
       for(let i=1;i<=12;i++){rowIn.add(new Option(i,i));colIn.add(new Option(i,i));}
       rowIn.value=String(rows);colIn.value=String(cols);
       const bar=H('div',{class:'f301-controller'},[H('label',{},['Rows',rowIn]),H('label',{},['Columns',colIn]),hbtn('Check structure',()=>{
         if(rows*cols===24&&rows>1&&cols>1)accepted('24 counters, correctly arranged into equal rows and columns.');
         else fail(rows*cols!==24?'The rectangle does not contain 24 equal cells. Multiply rows by columns.':'This product is 24, but show more than one equal row and column.');
       },'nova-btn primary')]);
       rowIn.onchange=()=>{rows=+rowIn.value;ev('rows',rows);drawTaskArray();};colIn.onchange=()=>{cols=+colIn.value;ev('columns',cols);drawTaskArray();};panel.append(bar,feedback);
       drawTaskArray();
    }
    if(task===1){const options=[[2,6],[3,4],[5,7],[1,12],[4,8],[2,8],[6,6],[2,5]],area=H('div',{class:'f301-chiplist'});
      options.forEach(pair=>{const key=pair.join('×'),b=hbtn(pair.join(' × '),()=>{
        if(pair[0]*pair[1]!==12){b.dataset.state='bad';fail('Those two factors multiply to '+pair[0]*pair[1]+', not twelve.');return;}
        if(found.has(key)){api.hint('Already found that pair. Find a different one.');return;}
        found.add(key);ev('pair',pair.slice());b.dataset.state='done';drawTaskPairs();
        if(found.size===goalPairs.length)accepted('All three factor pairs are correct: one and twelve, two and six, three and four.');
      },'f301-chip');area.appendChild(b);});
      panel.append(area,H('p',{class:'f301-instruct',text:'Only unique positive factor pairs count. The correct set has three pairs.'}),feedback);drawTaskPairs();
    }
    if(task===2){const sel=H('p',{class:'f301-node-select',text:'Select a factor card, then a blank leaf; or drag it directly to the leaf.'});
     const pstate={placed,held:null,focus:0,draw:()=>drawTaskTree(pstate),place:(ci,li)=>{
       if(li<0||li>1)return false;const n=C30[ci],expected=li===0?2:5;
       if(n!==expected){fail(n+' cannot fill this leaf: the branch product must remain ten, with prime leaves two and five.');return false;}
       placed[li]=n;ev('primeLeaf',{index:li,value:n});pstate.held=null;pstate.draw();return true;
      },remove:li=>{placed[li]=null;ev('primeLeaf',{index:li,value:null});pstate.draw();}};
     panel.append(sel,hbtn('Check complete tree',()=>{
       if(placed[0]!==2||placed[1]!==5){fail('Every empty prime leaf needs a correct card. Verify that two times five is ten.');return;}
       if(3*placed[0]*placed[1]!==30){fail('The final leaves must multiply back to thirty.');return;}
       if(![3,...placed].every(prime)){fail('A factor tree is only finished when every leaf is prime.');return;}
       accepted('Prime leaves three, two and five multiply to thirty. All leaves are prime.');
     },'nova-btn primary'),hbtn('Hint',()=>{api.hint('Ten splits into two and five. Both are prime.');scene(stage,{rows:3,cols:10,view:'treeChallenge',state:pstate,hideResult:true,stepName:'tree',peer:peer('hint'),note:'Place two and five under ten.'});},'nova-btn'),feedback);
     pstate.draw();
    }
  }
  ev('challengeTask',task);renderTask();
 },
 onRestore(){current={rows:3,cols:4,split:2,view:'array',shape:'tile'};}
};
// Provide a developer contract but no developer mapping clutter in the pupil interface.
N.registry.add({id,title:'Array builder',topics:['multiplication','primes','factorisation'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"steps":()=>steps,"defs":()=>defs},draws:{"scene":["stage","o"]},exploreFields:{"state":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id,num:'01',title:'Array builder · Premium Edition',def,linked:['F0-02','F0-03','F0-04','F0-07','F3-05','F3-13'],years:'Year 7 prime factorisation; transferable into Year 8–9 and GCSE',spec:{
 purpose:'Show multiplication as equal rows; connect commutativity, distributive splitting, factor pairs and the prime leaves of a factor tree.',
 params:'rows 1–12; columns 1–12; tile/dot; orientation; split between columns; tree product 2–144; structured Challenge.',
 presets:'Y7-015 Prime factorisation (2–144; default 3 × 4).',
 steps:'build-rows → count-up → rotate → split → tree → collect.',
 interactions:'Drag corner, move split, manipulate factor cards and leaf nodes; keyboard arrows and Enter; buttons and accessible selects.',
 traps:'Unequal grouping, counting one row twice, assuming rotation changes product, forgetting a split part, leaving composite tree leaves, wrong prime factor pair.',
 gcse:'Extension supported: repeated prime factors, factorisation to 144; use F3-05/06 for more advanced constructions.'
 }});
window.F301_ENGINE=N.engines[id];
// F2 core's mouse capture flag can remain true if native capture releases onto the SVG
// rather than the dragged group. Resolve orphan release via the EXISTING core cancel API.
// A successful drop clears N.ui._drag before this bubbling handler runs.
window.addEventListener('pointerup',()=>{if(N.ui._drag&&N.ui._drag.el&&document.getElementById(id).contains(N.ui._drag.el))N.ui.cancelDrag();});
window.addEventListener('pointercancel',()=>{if(N.ui._drag&&N.ui._drag.el&&document.getElementById(id).contains(N.ui._drag.el))N.ui.cancelDrag();});
// Developer metadata remains accessible, but never appears in the pupil-facing teaching surface.
const engineCard=document.getElementById(id);
const developer=H('details',{class:'nv-dev'});developer.appendChild(H('summary',{text:'Developer: component specification'}));
for(const el of [...engineCard.querySelectorAll('details.nova-spec, p.purpose')])developer.appendChild(el);
engineCard.appendChild(developer);
const galleryCaption=engineCard.querySelector('h3');if(galleryCaption)galleryCaption.textContent='Interactive maths workshop';
// The immutable F0 Bob renderer wraps its illustration in a labelled role=img face;
// provide the nested img its own descriptive alternative without editing the shared core.
const scope=document.getElementById(id);
const fixBobAlt=()=>{scope.querySelectorAll('.face img').forEach(im=>{if(!im.getAttribute('alt'))im.setAttribute('alt','Sir Bob Maximus, maths tutor');});};
fixBobAlt();new MutationObserver(fixBobAlt).observe(scope,{childList:true,subtree:true});
})();
