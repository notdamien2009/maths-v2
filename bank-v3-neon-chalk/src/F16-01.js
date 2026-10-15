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

/* NOVA F16-01 — Tally, frequency table and pictogram. Uses canonical recovered F0/F2 shared runtime. */
(function(){'use strict';
var H=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion, ID='F16-01';
var C=window.NovaV2Integration.configuration(window.NOVA_F16_01_CONFIG={startMode:'watch',preset:'collect',events:['value','step','mode','hintUsed','correct'],presets:{
 collect:{label:'Y7-065 · Collect and organise data',title:'Favourite fruit survey',cats:['Apples','Pears','Bananas','Grapes'],base:[4,2,6,4],icon:'fruit',context:'pupils',key:2},
 picture:{label:'Y7-066 · Bar charts and pictograms',title:'Books borrowed by class',cats:['Owls','Foxes','Bears','Lions'],base:[6,4,8,2],icon:'book',context:'books',key:2},
 stem:{label:'Y7-068 · Preparing data for stem-and-leaf',title:'Travel times to school',cats:['0–9','10–19','20–29','30–39'],base:[3,5,7,3],icon:'clock',context:'journeys',key:2},
 grouped:{label:'Y8-064 · Grouped frequency tables',title:'Reading minutes per day',cats:['0–9','10–19','20–29','30–39'],base:[5,7,4,2],icon:'book',context:'pupils',key:2}
}});
var STEP=[
 {name:'Meet the observations',pose:'explain',mood:'neutral',narration:'We begin with observations. Every response is one piece of data; we must count each response once.',prompt:'What are the four categories in this survey?'},
 {name:'Organise the categories',pose:'point-down',mood:'think',narration:'Put similar responses in the same row. A clear frequency table has one row for each category.',prompt:'Which row would you use for each observation?'},
 {name:'Build tally groups',pose:'count',mood:'focus',narration:'Count with four upright tally marks. The fifth crosses the four, making a group of five.',prompt:'Find a crossed group of five. Why is it faster to count?'},
 {name:'Write the frequencies',pose:'compare',mood:'neutral',narration:'Frequency is how many observations are in each group. Count the tallies, including the cross-stroke.',prompt:'Compare each tally group with its number.'},
 {name:'Make the pictogram',pose:'point-down',mood:'focus',narration:'Our pictogram key says one picture stands for two observations. One extra observation needs half a picture.',prompt:'Can you find an odd frequency and its half-picture?'},
 {name:'Read and check',pose:'celebrate',mood:'cheer',narration:'Add the frequencies to check the total. The table and pictogram must represent the same data.',prompt:'Which category has the greatest frequency? Check the total.'}
];
function p(){return window.innerWidth<=540?{W:390,H:730,x:16,right:374,divA:132,divB:274,divC:326,startY:95,rowH:63,axisY:374,iconX:145,iconGap:36,footY:665,size:18.5,cardW:80,cardGap:10}:{W:700,H:655,x:35,right:665,divA:236,divB:493,divC:570,startY:84,rowH:59,axisY:354,iconX:238,iconGap:63,footY:595,size:21,cardW:130,cardGap:16};}
function cfg(){return C.presets[C.preset];}
function clone(v){return JSON.parse(JSON.stringify(v));}
function emptyState(){return {placed:[null,null,null,null],sel:null,feedback:'',guided:false};}
var exploreState=emptyState(), chState=emptyState(), activeMode='watch';
function send(key,value){NOVA.events.emit('value',{engine:ID,key:key,control:key,value:value});}
function calc(st,pre){var a=pre.base.slice();st.placed.forEach(function(v){if(v!==null)a[v]++;});return a;}
function total(a){return a.reduce(function(n,x){return n+x;},0);}
function ch(parent,x,y,str,role,size,anchor){return NOVA.chalkText(parent,x,y,str,{role:role||'given',size:size||19,anchor:anchor||'middle'});}
function frame(sv,pr){ // Approved NOVA primitives only; no invented paint system.
 var ys=[pr.startY-22,pr.startY+pr.rowH*4-14];
 NOVA.neonLine(sv,pr.x,ys[0],pr.right,ys[0],{role:'support',width:2.5});
 for(var r=1;r<=4;r++)NOVA.neonLine(sv,pr.x,pr.startY+r*pr.rowH-17,pr.right,pr.startY+r*pr.rowH-17,{role:'support',width:1.2});
 for(var j of [pr.divA,pr.divB,pr.divC])NOVA.neonLine(sv,j,ys[0],j,ys[1],{role:'support',width:1.4});
}
function tmarks(sv,x,y,n,pr){var per=pr.W===390?19:22,gap=pr.W===390?8:10,initial=x;var group=0;
 for(var i=0;i<n;i++){
  var q=i%5;if(q===0&&i>0){group++;} var base=initial+group*(per*3.0);
  if(q<4)NOVA.neonLine(sv,base+q*gap,y-14,base+q*gap,y+12,{role:'op',width:3.3});
  else NOVA.neonLine(sv,base-4,y+12,base+3*gap+4,y-14,{role:'focus',width:3.7});
 }
}
function symbol(parent,cx,cy,kind,half,role){var g=E('g',{'aria-label':half?'Half a picture':'One picture',class:'f16-icon'},parent);
 var d=kind==='book'?'M'+(cx-13)+','+(cy-12)+' Q'+cx+','+(cy-14)+' '+cx+','+(cy-9)+' Q'+cx+','+(cy-14)+' '+(cx+13)+','+(cy-12)+' L'+(cx+13)+','+(cy+12)+' Q'+cx+','+(cy+8)+' '+cx+','+(cy+13)+' Q'+cx+','+(cy+8)+' '+(cx-13)+','+(cy+12)+' Z':
 kind==='clock'?'M'+(cx-13)+','+cy+' a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 M'+cx+','+(cy-9)+' L'+cx+','+cy+' L'+(cx+7)+','+(cy+4):
 'M'+(cx-1)+','+(cy-9)+' C'+(cx-18)+','+(cy-22)+' '+(cx-19)+','+(cy+12)+' '+(cx-2)+','+(cy+14)+' C'+(cx+18)+','+(cy+16)+' '+(cx+21)+','+(cy-17)+' '+(cx+3)+','+(cy-9)+' M'+cx+','+(cy-11)+' Q'+(cx+3)+','+(cy-19)+' '+(cx+12)+','+(cy-19);
 if(half){var clipID='f16clip'+(++symbol.seq);var defs=svDefs(parent);var clip=E('clipPath',{id:clipID},defs);E('rect',{x:cx-20,y:cy-22,width:20,height:44},clip);g.setAttribute('clip-path','url(#'+clipID+')');}
 NOVA.neonPath(g,d,{role:role||'result',width:2.5,fill:kind!=='clock'});
 if(half)NOVA.neonLine(parent,cx,cy-18,cx,cy+17,{role:'focus',width:2.3});return g;
}symbol.seq=0;
function svDefs(node){var svg=node.ownerSVGElement||node;var defs=svg.querySelector('defs');if(!defs)defs=E('defs',{},svg);return defs;}
function render(stage,o){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("render",arguments);}
o=o||{};var pre=o.pre||cfg(),st=o.st||emptyState(),pr=p();stage.innerHTML='';var values=o.values||calc(st,pre),maxN=Math.max.apply(null,values),sv=S.root(pr.W,pr.H,'A tally frequency table and pictogram showing '+pre.title+', with '+total(values)+' observations.');sv.classList.add('f16-plot');sv.setAttribute('role','img');
 var phase=o.phase==null?6:o.phase;
 ch(sv,pr.W/2,32,pre.title,'given',pr.size+4);
 if(phase>=1){frame(sv,pr);ch(sv,(pr.x+pr.divA)/2,pr.startY-29,'Category','support',pr.size);ch(sv,(pr.divA+pr.divB)/2,pr.startY-29,'Tally','support',pr.size);ch(sv,(pr.divB+pr.divC)/2,pr.startY-29,'Freq.','support',pr.size-1);ch(sv,(pr.divC+pr.right)/2,pr.startY-29,'Add','support',pr.size-2);}
 for(var i=0;i<4&&phase>=1;i++){var y=pr.startY+i*pr.rowH+10,cat=pre.cats[i];
  if(phase>=2||o.forceCats)ch(sv,(pr.x+pr.divA)/2,y+4,cat,'given',pr.size, 'middle');
  if(phase>=3)tmarks(sv,pr.divA+12,y,values[i],pr);
  if(phase>=4){NOVA.neonBox(sv,pr.divB+9,y-21,pr.divC-pr.divB-18,43,{role:'result'});ch(sv,(pr.divB+pr.divC)/2,y+7,String(values[i]),'result',pr.size+7);}
 }
 // Raw observations use the approved neon ring marker. Here one ring = one response, not the pictogram key.
 if(phase===0){ch(sv,pr.W/2,86,'Starting observations','given',pr.size+3);
   pre.cats.forEach(function(cat,i){var yy=141+i*(pr.W===390?111:101);
    NOVA.neonBox(sv,pr.x,yy-30,pr.W===390?105:170,57,{role:'given',text:cat,size:pr.size});
    for(var k=0;k<pre.base[i];k++){var dx=pr.W===390?31:43,cx=(pr.W===390?150:250)+dx*k;NOVA.neonRing(sv,cx,yy,{role:'op',r:pr.W===390?9:11,pulse:false});}
   });ch(sv,pr.W/2,pr.W===390?625:580,'One ring = one response','unknown',pr.size+2);
 }
 if(phase>=1&&phase<5){
   ch(sv,pr.x+9,pr.axisY,'Raw responses · 1 ring = 1', 'given',pr.size+2,'start');
   pre.cats.forEach(function(cat,i){var yy=pr.axisY+37+i*(pr.W===390?48:43);
    ch(sv,pr.x+10,yy+5,cat,'given',pr.size,'start');
    for(var k=0;k<pre.base[i];k++){NOVA.neonRing(sv,(pr.W===390?146:240)+k*(pr.W===390?27:43),yy,{role:'op',r:pr.W===390?8:10,pulse:false});}
   });
   ch(sv,pr.W/2,pr.W===390?625:580,'Same data, new representation','unknown',pr.size+2);
 }
 // Pictogram panel: shared primitive neon rows, symbology and key; no decorative enclosing box.
 if(phase>=5){ch(sv,pr.x+8,pr.axisY,'Pictogram','given',pr.size+4,'start');ch(sv,pr.right-5,pr.axisY,'1 picture = '+pre.key,'unknown',pr.size-1,'end');
  for(var i=0;i<4;i++){var yy=pr.axisY+34+i*(pr.W===390?42:38);ch(sv,pr.x+18,yy+5,pre.cats[i],'given',pr.size,'start');for(var k=0;k<Math.ceil(values[i]/pre.key);k++){symbol(sv,pr.iconX+pr.iconGap*k,yy,pre.icon,k===Math.floor(values[i]/pre.key)&&values[i]%pre.key===1,'result');}}
  ch(sv,pr.W/2,pr.W===390?582:533,'Total = '+total(values)+' '+pre.context,'result',pr.size+3);
 }
 if(o.interactive){
  // Visible dark-red remove zone and a row of four draggable observation tokens; all hit-testing is supplied by NOVA.ui.svgDrag.
  var remove={x:pr.W===390?298:569,y:pr.footY-(pr.W===390?66:75),w:pr.W===390?77:96,h:43,id:'remove',kind:'remove'};
  NOVA.neonBox(sv,remove.x,remove.y,remove.w,remove.h,{role:'error'});ch(sv,remove.x+remove.w/2,remove.y+27,'Remove','error',pr.size-2);
  ch(sv,pr.x,pr.W===390?pr.footY-45:pr.footY-20,'Move a data card into a row', 'support',pr.size-1,'start');
  st.placed.forEach(function(loc,i){
   var inRow=loc!==null,yy=inRow?pr.startY+loc*pr.rowH+8:pr.footY+8;
   var xx=inRow?(pr.divC+pr.right)/2:(pr.W===390?54:105)+i*(pr.cardW+pr.cardGap);
   // In-row markers are small enough for their own column and move off the table while dragging.
   if(inRow){var previous=st.placed.slice(0,i).filter(function(v){return v===loc;}).length;xx+=(previous*3);}
   var wid=inRow?pr.W===390?35:42:pr.W===390?64:103;
   if(inRow)xx=(pr.divC+pr.right)/2;
   var token=E('g',{'data-card':String(i),tabindex:'0',role:'button','aria-label':pre.cats[i]+' observation card; drag or press Enter and choose a row'},sv);
   NOVA.neonBox(token,xx-wid/2,yy-20,wid,39,{role:inRow?'result':'unknown'});
   ch(token,xx,yy+6,inRow?'+1':pre.cats[i],inRow?'result':'given',inRow?pr.size+1:pr.size-2);
   // Drop targets cover entire respective rows. Remove zone evaluated last and never overlaps rows.
   var zones=[0,1,2,3].map(function(k){return {x:pr.x,y:pr.startY+k*pr.rowH-20,w:pr.right-pr.x,h:pr.rowH-2,id:'row:'+k,kind:'drop'};});zones.push(remove);
   NOVA.ui.svgDrag(sv,token,{box:{x:xx-wid/2,y:yy-20,w:wid,h:39},zones:function(){return zones;},onDrop:function(id){var to=Number(id.split(':')[1]);if(st.placed.some(function(v,j){return j!==i&&v===to;}))return false;st.placed[i]=to;send('placed',st.placed.slice());o.update();return true;},onRemove:function(){st.placed[i]=null;send('placed',st.placed.slice());o.update();},removeTo:{x:remove.x+remove.w/2,y:remove.y+remove.h/2}});
   // Reassert native pointer capture after the F2 kit lifts/reparents this SVG group.
   // Without this, Chromium can release capture during appendChild even though the core records captured=true.
   token.addEventListener('pointerdown',function(ev){try{token.setPointerCapture(ev.pointerId);}catch(_){}});
   token.addEventListener('keydown',function(e){if(['Enter',' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Delete','Backspace','Escape'].indexOf(e.key)<0)return;e.preventDefault();if(e.key==='Delete'||e.key==='Backspace'||e.key==='Escape'){st.placed[i]=null;}else if(e.key==='ArrowUp'){st.placed[i]=Math.max(0,(st.placed[i]===null?4:st.placed[i])-1);}else if(e.key==='ArrowDown'){st.placed[i]=Math.min(3,(st.placed[i]===null?-1:st.placed[i])+1);}else if(e.key==='ArrowRight'||e.key==='Enter'||e.key===' '){st.placed[i]=i;}else if(e.key==='ArrowLeft'){st.placed[i]=null;}send('placed',st.placed.slice());o.update(i);});
  });
 }
 stage.appendChild(sv);
 if(phase===0){var chips=H('div',{class:'f16-flow'});pre.cats.forEach(function(x,i){chips.appendChild(NOVA.neonTile(x+': '+pre.base[i],{role:i%2?'unknown':'given'}));});stage.appendChild(chips);}
 if(phase>=4){var a=H('div',{class:'f16-flow'});a.appendChild(NOVA.neonTile('Count: '+total(values),{role:'result'}));if(phase>=6)a.appendChild(NOVA.neonTile('Greatest: '+pre.cats[values.indexOf(maxN)],{role:'focus'}));stage.appendChild(a);}
 NOVA.scene.helperStrip(stage,o.pose||'count',o.say||'Each tally is one observation.');
 if(o.animate&&phase>=3){var nodes=[].slice.call(sv.querySelectorAll('.nv-neon-box,.f16-icon'));nodes.forEach(function(n,j){n.style.opacity='0.35';});M.tween(680,function(t){nodes.forEach(function(n,j){if(n.isConnected)n.style.opacity=String(Math.max(.35,Math.min(1,(t-j*.018)*1.7)));});},M.ease.inOut);}
 return sv;
}
function dance(phase,stage){return render(stage,{phase:phase,pose:STEP[phase].pose,say:[
 'Every response is one observation. We begin with the data.',
 'Give every category its own row.',
 'Four upright lines — cross them for five.',
 'The frequency must equal the total tally marks.',
 'The key matters: a half picture means one.',
 'Add the frequencies to check the survey.'
 ][phase],animate:phase>=2&&phase<=5});}
function controls(panel,stage,st,pre,opts){opts=opts||{};var status=H('p',{class:'f16-status',role:'status'});
 function paint(focus){render(stage,{pre:pre,st:st,interactive:true,phase:6,pose:'count',say:'Put each observation in the matching category. Move a placed card again if needed.',update:paint});var a=calc(st,pre),placed=st.placed.filter(function(q){return q!==null;}).length;status.textContent='Cards placed: '+placed+' of 4 · Total observations: '+total(a);if(focus!=null){var el=stage.querySelector('[data-card="'+focus+'"]');if(el)el.focus({preventScroll:true});}}
 var sel=H('select',{class:'nova-input','aria-label':'Statistics lesson preset'});Object.keys(C.presets).forEach(function(k){sel.appendChild(H('option',{value:k,text:C.presets[k].label}));});sel.value=C.preset;
 if(!opts.lockPreset){panel.appendChild(H('label',{class:'nova-row'},['Lesson preset ',sel]));sel.onchange=function(){C.preset=sel.value;pre=C.presets[C.preset];st.placed=[null,null,null,null];send('preset',C.preset);paint();};}
 var keyboard=H('div',{class:'f16-keys'});var pick=H('select',{class:'nova-input','aria-label':'Select observation card'});var target=H('select',{class:'nova-input','aria-label':'Select target category'});function fillTargets(){target.innerHTML='';pre.cats.forEach(function(c,i){target.appendChild(H('option',{value:String(i),text:c}));});}
 pre.cats.forEach(function(cat,i){pick.appendChild(H('option',{value:String(i),text:cat}));});fillTargets();
 keyboard.appendChild(pick);keyboard.appendChild(target);keyboard.appendChild(H('button',{class:'nova-btn',text:'Place card',onclick:function(){st.placed[+pick.value]=+target.value;send('placed',st.placed.slice());paint(+pick.value);}}));keyboard.appendChild(H('button',{class:'nova-btn ghost',text:'Return card',onclick:function(){st.placed[+pick.value]=null;send('placed',st.placed.slice());paint(+pick.value);}}));
 panel.appendChild(H('p',{class:'f16-instruction',text:'Drag a card into a category row. Drag an already placed card again, or move it to the red Remove area. Use the selectors and buttons for keyboard access.'}));panel.appendChild(keyboard);
 panel.appendChild(status);paint();return {paint:paint,setPreset:function(k){pre=C.presets[k];C.preset=k;st.placed=[null,null,null,null];sel.value=k;paint();},state:st};
}
var def={id:ID,title:'Tally, frequency table and pictogram',config:C,steps:STEP,render:function(i,stage){activeMode='watch';dance(i,stage);},alt:'Premium neon table with grouped tally marks, exact frequencies and pictogram symbols. One picture represents two observations.',staticAlt:'Tally marks are grouped in fives: four vertical, the fifth diagonal. Frequency is the tally count. With key one image = two observations, an odd count uses half an image.',
 exploreIntro:'Move an observation card into its category row and watch the tallies and pictogram update. The table and pictogram must always agree.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();activeMode='explore';window.NovaLessonComponent?.applyExploreModels();exploreState=emptyState();window.NovaLessonComponent?.applyExploreModels();var ref=controls(panel,stage,exploreState,cfg());window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){return exploreState;},paint:ref.paint,select:ref.setPreset};},
 challenge:function(panel,api,stage){activeMode='challenge';chState=emptyState();var pre=cfg();var tasks=[
  {q:'Drag the first '+pre.cats[0]+' observation card into its correct category row. One new response changes the frequency by one.',build:function(ctl){ctl.appendChild(H('p',{class:'f16-instruction',text:'Use the diagram drag cards or the keyboard selectors underneath it.'}));return function(){return chState.placed[0];};},check:function(v){var ok=v===0;return [ok,ok?'Correct. One '+pre.cats[0]+' response adds exactly one tally and one to the frequency.':v===null?'The card is still in the tray. Drop it into the first category.':'That card belongs in the '+pre.cats[0]+' row, not '+pre.cats[v]+'.'];},hint:'Read the category written on the observation card; it matches one table row.',solve:function(){chState.placed[0]=0;repaint(0);}},
  {q:'A row has seven tally marks: a crossed group of five and two extra. What is its frequency?',build:NOVA.choiceTask([{label:'7',value:'7'},{label:'6',value:'6'},{label:'12',value:'12'},{label:'5',value:'5'}],ID),check:function(v){var ok=v==='7';return [ok,ok?'Exactly. Five in the bundle and two single marks make seven.':v==='6'?'The crossing stroke is the fifth mark, not just decoration.':'Count five in the crossed bundle, then two more marks.'];},hint:'Every crossed group represents five, not four or six.',solve:function(ctl){ctl.querySelectorAll('button')[0].click();}},
  {q:'With key 1 picture = 2 '+pre.context+', how many pictures show a frequency of 7?',build:NOVA.choiceTask([{label:'3½ pictures',value:'3.5'},{label:'7 pictures',value:'7'},{label:'4 pictures',value:'4'},{label:'2½ pictures',value:'2.5'}],ID),check:function(v){var ok=v==='3.5';return [ok,ok?'Correct. Three whole pictures show six, and one half-picture shows one.':v==='7'?'You used one picture for one observation and ignored the key.':v==='4'?'Four whole pictures would represent eight, not seven.':'Divide seven by two: include one half-picture.'];},hint:'Three pictures = six observations. What represents the seventh?',solve:function(ctl){ctl.querySelectorAll('button')[0].click();}}
 ];
 function repaint(k){if(k===0){render(stage,{pre:pre,st:chState,interactive:true,phase:6,pose:'think',say:'Read the card. Place it in the row with the same name.',update:function(i){repaint(0);if(i!=null){var el=stage.querySelector('[data-card="'+i+'"]');if(el)el.focus();}}});}else{render(stage,{pre:pre,st:chState,phase:6,pose:k===1?'count':'compare',say:k===1?'A crossed group of five is five tally marks.':'Remember to use the key: each picture counts as two.'});}}
 var kb=H('div',{class:'f16-keys'}),tg=H('select',{class:'nova-input','aria-label':'Choose category row'});pre.cats.forEach(function(cat,i){tg.appendChild(H('option',{value:String(i),text:cat}));});kb.appendChild(tg);kb.appendChild(H('button',{class:'nova-btn',text:'Place first card',onclick:function(){chState.placed[0]=+tg.value;repaint(0);}}));kb.appendChild(H('button',{class:'nova-btn ghost',text:'Remove first card',onclick:function(){chState.placed[0]=null;repaint(0);}}));panel.appendChild(H('p',{class:'f16-instruction',text:'Three checks: classify a response, interpret a tally group, and use a pictogram key.'}));panel.appendChild(kb);NOVA.challengeRun(panel,api,tasks,repaint,C);C._challengeState=chState;
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEP":()=>STEP},draws:{"render":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·01',title:'Tally, frequency table and pictogram',def:def,years:'Year 7–8 (KS3); GCSE extensions in grouped frequency and interpreting keys.',linked:['F0-02','F0-03','F0-04','F0-15','F16-02','F16-05','F16-09'],spec:{purpose:'Collect raw observations, group tally marks in fives, record numerical frequency, and map each frequency to a pictogram using an explicit key.',params:'Four categories or grouped intervals; integer counts and observations; key value 2 with half-symbol support; lesson context and symbol type.',presets:'Y7-065 collecting · Y7-066 pictograms · Y7-068 stem-and-leaf preparation · Y8-064 grouped intervals.',steps:'Meet observations → Organise categories → Build tally groups → Write frequencies → Make pictogram → Read and check.',interactions:'Four NOVA modes; drag/re-grab/remove cards with core svgDrag; keyboard and button alternatives; exact tally and pictogram updates; three checked challenges.',traps:'Five tally marks mistaken for four or six; frequency confused with a tally mark; pictogram key ignored; half-symbol forgotten; categories mixed up.',gcse:'Grouped frequency tables and comparison of distributions; interpret pictogram scaling.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
