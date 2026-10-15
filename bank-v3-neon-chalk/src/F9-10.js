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

/* F9-10 Pascal's triangle · NOVA premium F0 drawing primitives and F9-01 v3 algebra background. */
const F910_CONFIG={id:'F9-10',family:'F9',startMode:'watch',presets:{
 'KS3-grow':{label:'KS3 · Grow the rows',rows:6,focus:'addition',context:'Each interior cell adds the two directly above.'},
 'KS3-row-sums':{label:'KS3 · Powers of two',rows:7,focus:'sums',context:'The sum of row r is two to the power r.'},
 'KS3-diagonals':{label:'KS3 · Diagonal patterns',rows:7,focus:'diagonal',context:'The third diagonal contains triangular numbers.'}
},events:{value:['preset','row','pattern','answer','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F910_CONFIG),id=C.id;
const small=()=>innerWidth<=760,W=()=>small()?430:760;
const pascal=n=>{let row=[1];for(let r=0;r<n;r++){let a=[1];for(let c=1;c<row.length;c++)a.push(row[c-1]+row[c]);a.push(1);row=a;}return row;};
const STEPS=[
 {name:'one-at-the-top',rows:2,pose:'explain',text:'Start with one. Every new row begins and ends with one.',prompt:'What do you notice at the outer edges?'},
 {name:'two-parents-one-sum',rows:3,focus:[2,1],pose:'point-down',text:'An inside number has two parents. One plus one makes two.',prompt:'Trace the two numbers above the two.'},
 {name:'build-the-fourth-row',rows:4,focus:[3,1],pose:'count',text:'To make three, add the one and two directly above it. Repeat across the row.',prompt:'Can you explain why both middle entries are three?'},
 {name:'build-five-rows',rows:5,focus:[4,2],pose:'idea',text:'Three plus three gives six. The new row is one, four, six, four, one.',prompt:'Find the two parent numbers that make six.'},
 {name:'row-sums-double',rows:6,kind:'sums',pose:'compare',text:'The row totals are one, two, four, eight, sixteen and thirty-two. Each total doubles.',prompt:'Predict the total of the next row.'},
 {name:'triangles-hidden-in-a-triangle',rows:7,kind:'diagonal',pose:'celebrate',text:'Look diagonally. One, three, six, ten, fifteen are triangular numbers hidden inside Pascal’s triangle.',prompt:'Explain why that diagonal grows by one more each step.'}
];
const TASKS=[
 {row:3,col:1,choices:[2,3,4],heading:'01 · Find the first pair sum',guide:'The row with 1, 2, 1 makes a new interior cell. Add its two parents.'},
 {row:4,col:2,choices:[3,6,9],heading:'02 · Make the middle of row four',guide:'Find the middle cell. Its two parents are directly above, one left and one right.'},
 {row:6,col:3,choices:[10,20,30],heading:'03 · Add the two middle parents',guide:'Look at the centre of row six. Both parents are tens: add them.'}
];
let chosenPreset='KS3-grow',visibleRows=6,pattern='addition',challengeIndex=0,placedValue=null,kbChoice=null,stageRef=null,statusRef=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9-10 event '+key);N.events.emit('value',{engine:id,key,value});}
function txt(p,x,y,s,size=19,role='given',anchor='middle'){return N.chalkText(p,x,y,String(s),{size,role,anchor});}
function box(p,x,y,w,h,s,role='given',size=19){return N.neonBox(p,x,y,w,h,{role,text:s,size,r:13});}
function btn(s,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:s,onclick:fn});}
function root(alt,challenge=false){const svg=N.svg.root(W(),challenge?1060:850,alt);svg.setAttribute('class','nv-svg f910-svg');svg.setAttribute('role','img');return svg;}
function clear(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("clear",arguments);}
stage.replaceChildren();N.cap(stage,'Sequence workshop','Pascal’s triangle');}
function card(h,v,gold=false){return H('div',{class:'f910-card'+(gold?' f910-card--gold':'')},[H('div',{class:'f910-eyebrow',text:h}),H('div',{class:'f910-maths'+(gold?' f910-maths--gold':''),text:String(v)})]);}
function note(h,v){return H('div',{class:'f910-card f910-card--full'},[H('div',{class:'f910-eyebrow',text:h}),H('div',{class:'f910-body',text:String(v)})]);}
function mount(stage,svg,cards,pose,speech){
if(window.NovaLessonComponent?.active){[stage,svg,cards,pose,speech]=window.NovaLessonComponent.args("mount",arguments);}
stage.appendChild(H('div',{class:'f910-stage'},[svg,H('aside',{class:'f910-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
// A single glossy hexagon primitive constructed entirely using the existing NOVA neonPath + chalkText helpers.
function hex(p,x,y,value,role='given',radius=27,empty=false){const verts=[];for(let k=0;k<6;k++){const a=Math.PI/3*k+Math.PI/6;verts.push([(x+radius*Math.cos(a)).toFixed(2),(y+radius*Math.sin(a)).toFixed(2)]);}
 const d='M'+verts.map(v=>v.join(',')).join(' L')+' Z',g=E('g',{'class':'f910-hex','data-value':value==null?'?':value},p);N.neonPath(g,d,{role:empty?'unknown':role,width:2.6,fill:true});
 if(value!=null)txt(g,x,y+6,value,value>=10?20:22,role);else txt(g,x,y+6,'?',23,'support');return g;}
function place(r,c){const w=W(),dx=small()?54:87,dy=small()?85:84,cy0=small()?136:139;return {x:w/2+(c-r/2)*dx,y:cy0+r*dy};}
function rowTotal(r){return Math.pow(2,r);}
function tri(svg,rows,{focus=null,pattern='addition',hide=null,animate=false}={}){
 let start=0;
 for(let r=0;r<rows;r++){
  const values=pascal(r);
  for(let c=0;c<values.length;c++){
   const {x,y}=place(r,c),isFocus=focus && focus[0]===r&&focus[1]===c,diagonal=pattern==='diagonal'&&c===2,edge=c===0||c===r;
   const role=diagonal?'focus':isFocus?'result':edge?'support':'given';
   const missing=hide&&hide[0]===r&&hide[1]===c;
   const cell=hex(svg,x,y,missing?null:values[c],role,small()?26:34,missing);
   if(animate && !N.reducedMotion() && r===rows-1){cell.style.opacity='0';N.motion.tween(260+c*75,t=>{if(cell.isConnected)cell.style.opacity=String(t);},N.motion.ease.out);}
  }
 }
 if(focus&&focus[0]>0&&focus[1]>0&&focus[1]<focus[0]){
  const [r,c]=focus,target=place(r,c),a=place(r-1,c-1),b=place(r-1,c),rad=small()?26:34;
  for(const origin of [a,b]){
    N.svg.arrow(svg,origin.x,origin.y+rad*.85,target.x+(origin.x>target.x?8:-8),target.y-rad*.85,{role:'focus',width:2.7,glow:true});
  }
 }
 return rows;
}
function showEvidence(svg,rows,pattern){
 const w=W(),y=small()?746:737;
 if(pattern==='sums'){
  txt(svg,w/2,y,'ROW TOTALS DOUBLE',small()?18:23,'support');
  txt(svg,w/2,y+43,Array.from({length:Math.min(rows,6)},(_,i)=>rowTotal(i)).join('  ·  '),small()?22:28,'result');
  N.svg.pill(svg,w/2,y+83,'Sum of row r = 2ʳ',{role:'focus',size:small()?17:21});
 } else if(pattern==='diagonal'){
  txt(svg,w/2,y,'THIRD DIAGONAL',small()?18:23,'support');
  txt(svg,w/2,y+43,'1  ·  3  ·  6  ·  10  ·  15',small()?21:26,'result');
  N.svg.pill(svg,w/2,y+83,'Add 2, then 3, then 4, then 5',{role:'focus',size:small()?16:20});
 } else {
  txt(svg,w/2,y,'EACH INSIDE CELL = TWO ABOVE',small()?16:22,'support');
  N.svg.pill(svg,w/2,y+62,'Edge = 1   ·   Middle = sum',{role:'focus',size:small()?17:20});
 }
}
function renderLearning(i,stage){const s=STEPS[i],w=W();clear(stage);const svg=root('Pascal triangle. Every edge is one and every interior cell is the sum of the two cells directly above.');
 txt(svg,w/2,45,['START WITH THE EDGES','THE TWO NUMBERS ABOVE','BUILD THE NEXT ROW','THREE PLUS THREE','ROW SUMS DOUBLE','A TRIANGULAR DIAGONAL'][i],small()?20:26,'support');
 txt(svg,w/2,86,['The outside stays one','One plus one makes two','One plus two makes three','Three plus three makes six','1, 2, 4, 8, 16, 32','1, 3, 6, 10, 15, …'][i],small()?18:23,'support');
 tri(svg,s.rows,{focus:s.focus||null,pattern:s.kind||'addition',animate:i===3});showEvidence(svg,s.rows,s.kind||'addition');
 const important=s.focus?pascal(s.focus[0])[s.focus[1]]:s.kind==='sums'?rowTotal(s.rows-1):s.kind==='diagonal'?'1, 3, 6, 10':'1';
 mount(stage,svg,[card('ROW NUMBER',s.rows-1),card(s.kind==='sums'?'ROW SUM':s.kind==='diagonal'?'DIAGONAL':'FOCUS VALUE',important,true),note('REASON',i<4?'Outside entries are one. Each inside entry is the sum of the two directly above.':s.kind==='sums'?'Every row total is twice the previous row total.':'This diagonal forms the triangular-number sequence.'),note('YOUR TURN',s.prompt)],s.pose,s.text);
}
function renderExplore(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("renderExplore",arguments);}
clear(stage);const p=C.presets[chosenPreset],svg=root('Pascal triangle with adjustable rows and highlighted addition, row-sum or diagonal patterns.');
 txt(svg,W()/2,45,'DISCOVER THE HIDDEN PATTERNS',small()?21:26,'support');
 txt(svg,W()/2,86,p.context,small()?16:20,'support');
 const focus=pattern==='addition'&&visibleRows>=3?[visibleRows-1,Math.max(1,Math.floor((visibleRows-1)/2))]:null;
 tri(svg,visibleRows,{focus,pattern});showEvidence(svg,visibleRows,pattern);
 mount(stage,svg,[card('ROWS SHOWN',visibleRows),card('BOTTOM ROW TOTAL',rowTotal(visibleRows-1),true),note('PATTERN',pattern==='addition'?'Look at the pair of cells directly above any interior number.':pattern==='sums'?'Add all entries in the bottom row: the total is a power of two.':'Read the third diagonal, from top-left toward bottom-right.'),note('CHECK IT', 'The bottom row is '+pascal(visibleRows-1).join(' + ')+' = '+rowTotal(visibleRows-1)+'.')],pattern==='diagonal'?'idea':pattern==='sums'?'compare':'point-down',pattern==='diagonal'?'Look at the diagonal sums. New patterns are hiding in the triangle.':pattern==='sums'?'Adding the whole row gives a new power of two.':'Every inside number has two parents. Add them to check it.');
}
function task(){return TASKS[challengeIndex];}
function target(){const t=task(),p=place(t.row,t.col),r=small()?26:34;return {x:p.x-r*.92,y:p.y-r*.88,w:r*1.84,h:r*1.76,id:'cell',kind:'drop'};}
function tray(){return {x:small()?27:157,y:977,w:small()?376:446,h:54,id:'remove',kind:'remove'};}
function status(s){if(statusRef)statusRef.textContent=s;}
function feedback(value){const t=task(),v=pascal(t.row)[t.col],p=pascal(t.row-1),a=p[t.col-1],b=p[t.col];if(value===a||value===b)return 'That is just ONE parent. Add both '+a+' and '+b+'.';if(value===a+b+a)return 'You have counted one parent twice. Use each parent once.';if(value>v)return 'Too many. Only the two cells directly above are added.';return 'Look at the two parents: the new number is their SUM, not their difference.';}
function change(v,api){const t=task(),expected=pascal(t.row)[t.col];if(v!==expected){status(feedback(v));api.check(false,feedback(v),{task:challengeIndex,answer:v});return false;}placedValue=v;kbChoice=null;ev('answer',v);ev('placed',{slot:'cell',value:v});drawChallenge();return true;}
function remove(){placedValue=null;kbChoice=null;ev('placed',{slot:'cell',value:null});status('Cell cleared. Choose another number.');drawChallenge();}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pid=e.pointerId;let done=false;
  const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
  function move(ev){if(done)return;if(N.ui._drag!==drag){clean();return;}if(ev.pointerId!==pid||g.contains(ev.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pid,clientX:ev.clientX,clientY:ev.clientY,buttons:ev.buttons}));}
  function up(ev){if(ev.pointerId!==pid)return;if(N.ui._drag===drag&&drag.up)drag.up(ev);clean();}
  function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
  window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function source(svg,v,x,y){const g=E('g',{'data-source':'value-'+v,tabindex:0,role:'button','aria-label':'Choose number '+v},svg);box(g,x,y,small()?106:150,66,String(v),'given',26);
 const choose=()=>{kbChoice=v;status('Selected '+v+'. Press Enter on the empty hexagon, or drag your card into it.');};
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});g.addEventListener('click',choose);
 N.ui.svgDrag(svg,g,{box:{x,y,w:small()?106:150,h:66},zones:()=>[target(),tray()],onDrop:key=>key==='cell'?change(v,apiRef):false,onRemove:()=>status('Card returned to the tray.'),removeTo:{x:W()/2,y:tray().y+20}});fastBridge(g);
}
let apiRef=null;
function drawChallenge(){if(!stageRef)return;const t=task(),w=W();clear(stageRef);const svg=root('Find the missing Pascal triangle entry by adding its two parent numbers.',true),expected=pascal(t.row)[t.col];
 txt(svg,w/2,44,'FILL THE MISSING HEXAGON',small()?22:27,'support');
 txt(svg,w/2,86,'Add the TWO numbers directly above the gap',small()?17:20,'support');
 tri(svg,t.row+1,{focus:[t.row,t.col],hide:[t.row,t.col]});
 if(placedValue!=null){const p=place(t.row,t.col),rad=small()?26:34,g=E('g',{'data-placed':'cell',tabindex:0,role:'button','aria-label':'Placed '+placedValue+'. Press Delete to remove.'},svg);
   hex(g,p.x,p.y,placedValue,'result',rad);g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove();}});
   N.ui.svgDrag(svg,g,{box:target(),zones:()=>[tray()],onDrop:()=>false,onRemove:remove,removeTo:{x:w/2,y:tray().y+23}});fastBridge(g);
 }else{
   const z=target(),hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent',tabindex:0,role:'button','aria-label':'Place selected number in the empty hexagon','data-slot':'cell'},svg);
   const go=()=>{if(kbChoice!=null)change(kbChoice,apiRef);else status('Choose a number card first.');};hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});hit.addEventListener('click',go);
 }
 txt(svg,w/2,774,'CHOOSE THE SUM',small()?22:26,'support');
 const start=small()?30:118,gap=small()?20:40;
 t.choices.forEach((v,i)=>{if(v===placedValue)return;source(svg,v,start+i*((small()?106:150)+gap),797);});
 const r=tray();box(svg,r.x,r.y,r.w,r.h,'RED REMOVE TRAY','error',small()?18:21);
 mount(stageRef,svg,[card('BUILD ROW',t.row),card('MISSING ENTRY','?',true),note('LOOK UP ONE ROW','The entry is found by adding the two numbers diagonally above it. Edge ones do not move.'),note('KEYBOARD','Enter on a number card, then Enter on the empty hexagon. Delete on a placed value removes it.')],challengeIndex===2?'think':'point-down','Start with the two parents. Count both, not just one.');
}
const def={id,title:'Pascal’s triangle',config:C,
 alt:'Pascal triangle contains a one on every edge and each inner number is the sum of two parent numbers above. Rows begin 1; 1,1; 1,2,1; 1,3,3,1.',
 staticAlt:'Pascal rows zero through six: 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1; 1 5 10 10 5 1; 1 6 15 20 15 6 1. Row sums double and triangular numbers appear in the third diagonal.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){renderLearning(i,stage);},
 exploreIntro:'Build more rows, trace parent pairs, add row totals and discover diagonal number patterns.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();chosenPreset='KS3-grow';window.NovaLessonComponent?.applyExploreModels();visibleRows=6;window.NovaLessonComponent?.applyExploreModels();pattern='addition';
  window.NovaLessonComponent?.applyExploreModels();const info=H('p',{class:'f910-instruction',text:'Choose a pattern, change the number of rows, then trace the pairs that create each new number.'}),presets=H('div',{class:'f910-choices'}),range=H('input',{type:'range',min:3,max:7,value:6,'aria-label':'Number of Pascal triangle rows'}),out=H('output',{class:'f910-micro',text:'6 rows'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,p])=>presets.appendChild(btn(p.label,()=>{chosenPreset=key;pattern=p.focus;visibleRows=p.rows;range.value=String(visibleRows);out.textContent=visibleRows+' rows';ev('preset',key);ev('pattern',pattern);renderExplore(stage);},'nova-btn ghost')));
  window.NovaLessonComponent?.applyExploreModels();range.addEventListener('input',()=>{visibleRows=+range.value;out.textContent=visibleRows+' rows';ev('row',visibleRows);renderExplore(stage);});
  window.NovaLessonComponent?.applyExploreModels();panel.append(info,presets,H('div',{class:'f910-control'},[H('label',{},['Rows ',range]),out,btn('Add a row',()=>{visibleRows=visibleRows===7?3:visibleRows+1;range.value=String(visibleRows);out.textContent=visibleRows+' rows';ev('row',visibleRows);renderExplore(stage);},'nova-btn primary')]));window.NovaLessonComponent?.applyExploreModels();renderExplore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placedValue=null;kbChoice=null;stageRef=stage;apiRef=api;
  const heading=H('h3',{class:'f910-taskhead'}),guide=H('p',{class:'f910-instruction'}),controls=H('div',{class:'f910-control'}),statusEl=H('p',{class:'f910-status',role:'status'});statusRef=statusEl;
  function load(){const t=task();heading.textContent=t.heading;guide.textContent=t.guide;controls.replaceChildren();statusEl.textContent='Drag a number into the empty hexagon, or use Enter.';api.fb.textContent='';api.fb.className='nova-fb';
   controls.append(btn('Check missing number',()=>{
    if(placedValue!==pascal(t.row)[t.col]){api.check(false,'Place the missing number by adding both parents first.',{task:challengeIndex});return;}
    const a=pascal(t.row-1)[t.col-1],b=pascal(t.row-1)[t.col];api.check(true,a+' plus '+b+' makes '+(a+b)+'. Well spotted!',{task:challengeIndex,score:challengeIndex+1});
    if(challengeIndex===2){heading.textContent='All three Pascal sums completed';guide.textContent='You built each missing entry by adding its two parents.';controls.replaceChildren(H('p',{class:'f910-maths f910-maths--gold',text:'3 / 3 · Triangle mastered'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
    controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placedValue=null;kbChoice=null;load();},'nova-btn primary'));
   },'nova-btn primary'),btn('Reset card',()=>{placedValue=null;kbChoice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('Look diagonally above the empty cell. Add exactly those two numbers. Remember: outer edges stay one.'),'nova-btn ghost'));
   ev('challengeTask',{index:challengeIndex});drawChallenge();
  }
  panel.append(heading,guide,controls,statusEl);load();
 },
 onRestore(){chosenPreset='KS3-grow';visibleRows=6;pattern='addition';challengeIndex=0;placedValue=null;kbChoice=null;stageRef=null;statusRef=null;apiRef=null;}
};
N.registry.add({id,title:'Pascal’s triangle',topics:['sequences','Pascal triangle','triangular numbers','binomial patterns','number patterns'],deps:['F0-02','F0-04','F0-07','F0-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"STEPS":()=>STEPS,"TASKS":()=>TASKS},draws:{"clear":["stage"],"mount":["stage","svg","cards","pose","speech"],"renderExplore":["stage"]},exploreFields:{}});
N.bankMount({id,num:'10',title:'Pascal’s triangle · Premium Edition',def,linked:['F9-07','F9-08','F9-09','F9-11'],years:'KS3 Year 8–9 enrichment and GCSE extension',spec:{
 purpose:'Construct Pascal triangle by summing two parent entries, discover powers-of-two row sums and triangular-number diagonals.',
 params:'Rows 0–6; border cells one; interior C(r,k)=C(r−1,k−1)+C(r−1,k); row total 2^r.',
 presets:'KS3 Grow the rows; KS3 Powers of two; KS3 Diagonal patterns (unassigned lesson IDs).',
 steps:'Start edge ones → add first parents → build row 3 → build row 4 → row sums double → triangular diagonal.',
 interactions:'Watch, Guided, Explore preset selector and row slider, Challenge 3 drag-to-fill hexagons with keyboard and removal tray.',
 traps:'Copying only one parent, subtracting, doubling one parent, summing the wrong pair and forgetting edge ones.',
 gcse:'Extension to binomial coefficients and combinations; linked to F9-07 and F9-08.'
}});
window.F910_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const heading=component.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
