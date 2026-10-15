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

/* F16-02 · Bar Chart Builder · extension scene built on exact NOVA F0/F2/F14 shared runtime. */
(function(){'use strict';
const H=NOVA.h, S=NOVA.svg, E=S.el, MOT=NOVA.motion, ID='F16-02';
const CFG=window.NovaV2Integration.configuration(window.NOVA_F16_02_CONFIG={preset:'books',events:['value','step','mode','hintUsed','correct'],presets:{
 books:{label:'Y7-066 · Bar charts and pictograms',name:'Books borrowed this week',cats:['Owls','Foxes','Bears','Lions'],values:[6,9,4,7],max:12,minor:1,unit:'books',question:'Which class borrowed the most books?'},
 mislead:{label:'Y7-071 · Misleading graphs',name:'Visits to the sports club',cats:['Mon','Tue','Wed','Thu'],values:[5,6,7,8],max:10,minor:1,unit:'visits',question:'Does this difference look bigger if we crop the scale?'}
},_explore:null,_challenge:null});
const STEPS=[
 {name:'Read the collected data',pose:'explain',narration:'We begin with a table of counts. Each category gets one bar. Every bar must use the same numerical scale.',prompt:'Which categories will appear along the bottom?'},
 {name:'Set a fair scale',pose:'ruler',narration:'Read the frequency axis first. For an ordinary bar chart, begin at zero and use equal-sized intervals.',prompt:'Where is zero, and what does one grid interval represent?'},
 {name:'Build the first bar',pose:'count',narration:'The first bar rises from zero to the first frequency, without crossing the category boundary.',prompt:'Read the first value using the y-axis.'},
 {name:'Build the second bar',pose:'point-down',narration:'Leave a clear gap. The height of the second bar, not its width or colour, shows its frequency.',prompt:'Is the second frequency larger or smaller?'},
 {name:'Complete the third bar',pose:'compare',narration:'A third column uses the same scale. Changing the scale between columns would invalidate the comparison.',prompt:'Which of the first three columns is shortest?'},
 {name:'Complete the fourth bar',pose:'point-down',narration:'Four categories, four non-touching columns. Count the intervals to check the bar heights.',prompt:'How many observations are shown altogether?'},
 {name:'Find the important comparison',pose:'magnify',narration:'The marker identifies the tallest bar. Compare its value against the shortest bar and read the difference.',prompt:'How much higher is the tallest bar than the shortest?'},
 {name:'Interpret the chart carefully',pose:'idea',narration:'Always check the vertical-axis baseline. If the chart starts above zero, the heights exaggerate small differences.',prompt:'How can a missing zero make a bar chart misleading?'}
];
function P(){const mob=innerWidth<=540;return mob?{mob,W:450,H:740,L:66,T:156,plotW:354,plotH:395,barW:52,labelY:584,pill:20,tick:18}: {mob,W:770,H:650,L:112,T:122,plotW:565,plotH:390,barW:85,labelY:550,pill:23,tick:20};}
function pre(){return CFG.presets[CFG.preset]};
function state(){return {v:pre().values.slice(),baseline:0,message:'',selected:0};}
let ex=state(),ch=state();
function say(sv,x,y,t,role,size,align){return NOVA.chalkText(sv,x,y,String(t),{role:role||'given',size:size||21,anchor:align||'middle'});}
function emit(k,v){NOVA.events.emit('value',{engine:ID,key:k,control:k,value:v});}
function roleFor(i){return ['given','op','focus','result'][i%4]};
function box(sv,x,y,w,h,txt,role,fs){return NOVA.neonBox(sv,x,y,w,h,{role:role||'given',text:txt,size:fs||19});}
function geometry(pre0,st,phase,options){const a=P(),baseline=st.baseline||0,top=pre0.max;
 const X=(i)=>a.L + ((i+.5)/4)*a.plotW, Y=(v)=>a.T+a.plotH-(v-baseline)/(top-baseline)*a.plotH;
 return {a,baseline,top,X,Y,showBars:options.interactive?4:Math.max(0,Math.min(4,phase-1))};}
function draw(stage,opt){
if(window.NovaLessonComponent?.active){[stage,opt]=window.NovaLessonComponent.args("draw",arguments);}
opt=opt||{};const data=opt.data||pre(),st=opt.state||state(),phase=opt.phase===undefined?7:opt.phase;stage.innerHTML='';
 const g=geometry(data,st,phase,opt),a=g.a,X=g.X,Y=g.Y,bl=g.baseline;
 const sv=S.root(a.W,a.H,'NOVA bar chart '+data.name+'. Counts '+st.v.join(', ')+'. The vertical axis '+(bl===0?'begins at zero.':'is cropped at '+bl+'.'));
 sv.classList.add('f16b-plot');sv.setAttribute('role','img');
 say(sv,a.W/2,43,data.name,'given',a.mob?25:28);
 if(phase===0){say(sv,a.W/2,116,'Source frequencies','support',a.mob?20:22);}
 // NOVA core graph and its coordinate conversion form the scale used for every column.
 const plot=NOVA.neonPlot(sv,{x0:a.L,y0:a.T,w:a.plotW,h:a.plotH,x:[0,4],y:[bl,data.max],xStep:1,yStep:1,categories:true,grid:true});
 plot.g.classList.add('f16b-coreplot');
 // In the first teaching state, show the four separate source counts as large neon cards over the blank graph.
 // Values are not chart bars; they are the evidence the pupils will transfer to scaled columns.
 if(phase===0){data.cats.forEach((name,i)=>{const mob=a.mob;const cx=mob?(i%2===0?160:331):(i%2===0?249:526);
   const cy=mob?(i<2?286:418):(i<2?264:411);const cw=mob?135:194;const chh=mob?103:114;
   NOVA.neonBox(sv,cx-cw/2,cy-chh/2,cw,chh,{role:roleFor(i)});
   say(sv,cx,cy-12,name,'given',mob?20:24);
   say(sv,cx,cy+30,data.values[i]+' '+data.unit,'result',mob?24:29);
 });}
 if(phase===1){ // reveal how unit intervals relate to heights before drawing any bars
   const yy0=Y(0),yy2=Y(2),xx=a.L+65;
   NOVA.neonLine(sv,xx,yy0,xx,yy2,{role:'focus',width:5});
   NOVA.neonRing(sv,xx,yy0,{role:'result',r:8,pulse:false});
   NOVA.neonRing(sv,xx,yy2,{role:'result',r:8,pulse:false});
   box(sv,a.mob?185:335,a.mob?275:254,a.mob?205:260,70,'Equal-sized intervals','unknown',a.mob?19:23);
   say(sv,a.W/2,a.mob?405:388,'Start every honest bar at zero','result',a.mob?22:27);
 }
 // Premium overlay of ONLY approved neon primitives. The core graph remains the hit-test and scale authority.
 NOVA.neonLine(sv,a.L,Y(bl),a.L+a.plotW+8,Y(bl),{role:'support',width:3.4});
 NOVA.neonLine(sv,a.L,a.T-6,a.L,Y(bl),{role:'support',width:3.4});
 const tick=(a.mob?2:2);for(let value=bl;value<=data.max;value+=tick){const yy=Y(value);
   NOVA.neonLine(sv,a.L-9,yy,a.L+1,yy,{role:'support',width:2.2});
   say(sv,a.L-23,yy+6,value,bl>0&&value===bl?'error':'given',a.tick,'end');}
 say(sv,a.L,a.T-25,'Frequency','support',a.mob?17:19,'start');
 for(let i=0;i<4;i++){const x=X(i),value=st.v[i];
  say(sv,x,a.labelY,data.cats[i],'given',a.mob?21:23);
  if(i>=g.showBars)continue;
  const barTop=Y(Math.max(value,bl));const base=Y(bl),bh=Math.max(0,base-barTop);
  if(bh>0){ // All fill and luminous outlines come from the shared NOVA neonPath primitive.
    const d=`M${x-a.barW/2},${base} L${x-a.barW/2},${barTop} Q${x-a.barW/2},${barTop-4} ${x-a.barW/2+7},${barTop-4} L${x+a.barW/2-7},${barTop-4} Q${x+a.barW/2},${barTop-4} ${x+a.barW/2},${barTop} L${x+a.barW/2},${base} Z`;
    const glass=NOVA.neonPath(sv,d,{role:roleFor(i),width:3.6,fill:true});glass.setAttribute('data-bar',String(i));
    if(bh>25){NOVA.neonLine(sv,x-a.barW/2+11,barTop+15,x-a.barW/2+11,base-10,{role:roleFor(i),width:1.6});}
  }
  if(!opt.hideValue)say(sv,x,barTop-(opt.interactive?32:18),value,'result',a.mob?24:26);
  if(opt.interactive){const gripY=Y(value)-17;const token=E('g',{'data-bar-handle':String(i),role:'button',tabindex:'0','aria-label':'Adjust '+data.cats[i]+' bar height. Currently '+value+'. Use up and down arrow keys to change by one.'},sv);
    NOVA.neonBox(token,x-27,gripY-13,54,28,{role:'unknown'});
    say(token,x,gripY+7,'↕','focus',a.mob?23:25);
    // Use integer snapping zones tied precisely to shared plot mapping.
    const zones=[];for(let v=bl;v<=data.max;v++){
      const y=Y(v);const half=Math.abs(Y(v)-Y(v+1))/2;
      zones.push({x:x-45,y:y-half,w:90,h:half*2,id:'value:'+v,kind:'drop'});
    }
    NOVA.ui.svgDrag(sv,token,{box:{x:x-27,y:gripY-13,w:54,h:28},zones:()=>zones,onDrop:function(id){const v=Number(id.split(':')[1]);if(!Number.isInteger(v))return false;st.v[i]=v;emit('bar:'+i,v);if(opt.update)opt.update(i);return true;}});
    // The core reparents the group for lift; restore capture to its new SVG ancestry.
    token.addEventListener('pointerdown',ev=>{try{token.setPointerCapture(ev.pointerId)}catch(_){}});
    token.addEventListener('keydown',ev=>{let n=null;if(ev.key==='ArrowUp'||ev.key==='ArrowRight')n=Math.min(data.max,st.v[i]+1);if(ev.key==='ArrowDown'||ev.key==='ArrowLeft')n=Math.max(bl,st.v[i]-1);if(ev.key==='Home')n=bl;if(ev.key==='End')n=data.max;
      if(n===null)return;ev.preventDefault();st.v[i]=n;emit('bar:'+i,n);opt.update&&opt.update(i);
    });
  }
 }
 // Ground truth marker on a completed diagram, positioned through exact chart co-ordinates.
 if(phase>=6){const greatest=Math.max(...st.v),idx=st.v.indexOf(greatest);
  NOVA.neonRing(sv,X(idx),Y(greatest)-(opt.interactive?53:41),{role:'result',r:11,pulse:true});
  if(!opt.interactive)say(sv,X(idx),Y(greatest)-67,'Highest','result',a.mob?17:20);
 }
 // Honest vs cropped baseline must be stated visibly, never silently change graph axis.
 const baselineText=bl?'Scale starts at '+bl+' · Warning: cropped baseline':'Scale starts at 0 · Equal intervals';
 box(sv,a.mob?42:166,a.mob?649:593,a.mob?366:438,48,baselineText,bl?'error':'result',a.mob?18:20);
 if(opt.interactive){say(sv,a.W/2,a.mob?619:572,'Drag the glowing grips on the bar tops','support',a.mob?18:20);}
 else if(phase<2){say(sv,a.W/2,a.mob?619:572,'Start from zero; intervals must be equal','support',a.mob?18:20);}
 if(phase===7||opt.interactive){const maxi=Math.max(...st.v),mini=Math.min(...st.v);
   say(sv,a.W/2,a.mob?723:646,'Difference: '+(maxi-mini)+' '+data.unit,'result',a.mob?22:23);
 }
 stage.appendChild(sv);
 if(phase===0){const strip=H('div',{class:'f16b-values'});strip.appendChild(NOVA.neonTile('Survey total: '+data.values.reduce((s,v)=>s+v,0),{role:'result'}));stage.appendChild(strip);}
 if(phase>=6){const strip=H('div',{class:'f16b-values'});strip.appendChild(NOVA.neonTile('Highest: '+data.cats[st.v.indexOf(Math.max(...st.v))],{role:'result'}));strip.appendChild(NOVA.neonTile('Lowest: '+data.cats[st.v.indexOf(Math.min(...st.v))],{role:'focus'}));stage.appendChild(strip);}
 NOVA.scene.helperStrip(stage,opt.pose||'compare',opt.speech||'Look at the scale, then compare the column heights.');
 if(opt.animate&&phase>=2&&phase<=5){const idx=phase-2,bar=sv.querySelector('[data-bar="'+idx+'"]');if(bar){bar.style.opacity='.38';MOT.tween(550,t=>{if(bar.isConnected)bar.style.opacity=String(.38+.62*t)},MOT.ease.out);}}
 return sv;
}
function watch(phase,stage){const data=pre();const s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.s",(...a)=>state(...a),[]):(state())); // An honest baseline is the teaching default; truncation shown only when explicitly toggled.
 const speeches=[
 'These are the observed counts. Each category gets its own bar.',
 'Every interval on the frequency scale is the same size.',
 'Draw the first bar up to '+s.v[0]+' '+data.unit+'.',
 'The second bar rises to '+s.v[1]+'; keep a visible gap.',
 'The third value is '+s.v[2]+'. Read its height from the axis.',
 'The last count is '+s.v[3]+'. All four bars share a scale.',
 'Find the greatest height. The ring marks the tallest bar.',
 'Compare the greatest and least counts. Notice that a cropped axis can distort the story.'
 ];draw(stage,{data,state:s,phase,pose:STEPS[phase].pose,speech:speeches[phase],animate:phase>1&&phase<6});}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();ex=state();
 window.NovaLessonComponent?.applyExploreModels();const menu=H('select',{class:'nova-input','aria-label':'Statistics preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([k,v])=>menu.appendChild(H('option',{value:k,text:v.label})));window.NovaLessonComponent?.applyExploreModels();menu.value=CFG.preset;
 window.NovaLessonComponent?.applyExploreModels();const baseline=H('select',{class:'nova-input','aria-label':'Bar-chart baseline'});
 window.NovaLessonComponent?.applyExploreModels();baseline.appendChild(H('option',{value:'0',text:'Honest axis · Start at zero'}));window.NovaLessonComponent?.applyExploreModels();baseline.appendChild(H('option',{value:'4',text:'Truncated axis · Start at four'}));
 window.NovaLessonComponent?.applyExploreModels();const choice=H('select',{class:'nova-input','aria-label':'Choose bar'});
 window.NovaLessonComponent?.applyExploreModels();const count=H('input',{class:'nova-input',type:'number',min:0,max:12,step:1,'aria-label':'Set exact frequency'});
 window.NovaLessonComponent?.applyExploreModels();const status=H('p',{class:'f16b-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();function populate(){choice.innerHTML='';pre().cats.forEach((c,i)=>choice.appendChild(H('option',{value:i,text:c})));choice.value='0';count.value=String(ex.v[0]);count.max=pre().max;}
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){draw(stage,{data:pre(),state:ex,phase:7,interactive:true,pose:ex.baseline?'think':'ruler',speech:ex.baseline?'The axis starts at four. Compare this with the honest chart before trusting the visual difference.':'Move any handle. Every full interval represents one observation.',update:paint});
 status.textContent='Values: '+ex.v.join(' · ')+' | Total: '+ex.v.reduce((a,b)=>a+b,0)+' | Axis minimum: '+ex.baseline;
 if(document.activeElement===count){}else count.value=String(ex.v[+choice.value]);
 if(focus!==undefined){const item=stage.querySelector('[data-bar-handle="'+focus+'"]');item?.focus({preventScroll:true});}
 }
 window.NovaLessonComponent?.applyExploreModels();menu.onchange=()=>{CFG.preset=menu.value;ex=state();baseline.value='0';populate();emit('preset',CFG.preset);paint();};
 window.NovaLessonComponent?.applyExploreModels();baseline.onchange=()=>{ex.baseline=+baseline.value;emit('baseline',ex.baseline);paint();};
 window.NovaLessonComponent?.applyExploreModels();choice.onchange=()=>{count.value=String(ex.v[+choice.value]);};
 window.NovaLessonComponent?.applyExploreModels();function apply(v){const n=Number(v);if(!Number.isInteger(n)||n<ex.baseline||n>pre().max){status.textContent='Frequency must be a whole number between '+ex.baseline+' and '+pre().max+'.';return;}ex.v[+choice.value]=n;emit('bar:'+(+choice.value),n);paint();}
 window.NovaLessonComponent?.applyExploreModels();const tools=H('div',{class:'f16b-controls'});
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('label',{class:'f16b-label'},['Lesson context',menu]));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('label',{class:'f16b-label'},['Axis view',baseline]));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('label',{class:'f16b-label'},['Selected column',choice]));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('label',{class:'f16b-label'},['Frequency',count]));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('button',{class:'nova-btn primary',text:'Set height',onclick:()=>apply(count.value)}));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('button',{class:'nova-btn',text:'Decrease −1',onclick:()=>apply(ex.v[+choice.value]-1)}));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('button',{class:'nova-btn',text:'Increase +1',onclick:()=>apply(ex.v[+choice.value]+1)}));
 window.NovaLessonComponent?.applyExploreModels();tools.appendChild(H('button',{class:'nova-btn ghost',text:'Reset chart',onclick:()=>{ex=state();baseline.value='0';populate();paint()}}));
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('p',{class:'f16b-instruction',text:'Drag a glowing grip on a bar to a whole-number grid level. Or use the exact frequency field, plus/minus buttons or arrow keys. Toggle the baseline to see how cropping exaggerates differences.'}));
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(tools);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();populate();window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CFG._explore={values:()=>ex.v.slice(),baseline:()=>ex.baseline,setPreset(k){menu.value=k;menu.onchange()},paint};
}
function challenge(panel,api,stage){const data=pre();ch=state();ch.v[0]=Math.max(0,data.values[0]-2);ch.baseline=0;
 let taskIndex=0;const pick=H('select',{class:'nova-input','aria-label':'Choose challenge bar'}),numeric=H('input',{class:'nova-input',type:'number',step:1,min:0,max:data.max,'aria-label':'Set challenge bar frequency'});
 data.cats.forEach((s,i)=>pick.appendChild(H('option',{value:i,text:s})));
 function paint(t){taskIndex=t;if(t===0){draw(stage,{data,state:ch,phase:7,interactive:true,pose:'count',speech:'The source count is '+data.values[0]+'. Set the first column to that exact height.',update:()=>paint(0)});}else if(t===1){const s=state();s.baseline=4;draw(stage,{data,state:s,phase:7,pose:'think',speech:'This axis begins at four, not at zero. Decide whether it tells a fair story.'});}else{draw(stage,{data,state:state(),phase:7,pose:'compare',speech:'Read the highest and lowest bar heights before you subtract.'});}}
 const controls=H('div',{class:'f16b-controls'});
 controls.appendChild(H('label',{class:'f16b-label'},['Choose column',pick]));controls.appendChild(H('label',{class:'f16b-label'},['Frequency',numeric]));
 controls.appendChild(H('button',{class:'nova-btn',text:'Apply value',onclick:()=>{const n=Number(numeric.value);if(!Number.isInteger(n)||n<0||n>data.max)return;ch.v[+pick.value]=n;emit('challenge-bar',n);paint(0)}}));
 panel.appendChild(H('p',{class:'f16b-instruction',text:'Build a mathematically correct bar chart, detect a misleading axis and interpret a difference. Drag the top grip for Task 1, or use the input controls.'}));panel.appendChild(controls);
 const opts=(list)=>NOVA.choiceTask(list,ID);
 const target=data.values[0];const difference=Math.max(...data.values)-Math.min(...data.values);
 const tasks=[
  {q:'The survey table gives '+data.cats[0]+' = '+target+' '+data.unit+'. Set the first bar to this frequency, using the grip or the exact-value controls.',build:()=>()=>ch.v[0],check(v){const ok=v===target;return [ok,ok?'Correct. The bar reaches '+target+' above the zero baseline.':v===target-1?'One interval too low: read every unit on the scale.':v===target+1?'One interval too high: stop at the observed frequency.':'The bar must reach '+target+' on the frequency axis, not just look similar.'];},hint:'Read the '+data.cats[0]+' source value in the question, then count upward from zero.',solve(){ch.v[0]=target;paint(0)}},
  {q:'In the shown graph, the frequency axis starts at four. What is the most accurate criticism?',build:opts([{label:'It exaggerates differences between bars.',value:'cropped'},{label:'All bars should touch each other.',value:'touch'},{label:'The colours make the counts inaccurate.',value:'colour'},{label:'It is always best to start at four.',value:'always'}]),check(v){const ok=v==='cropped';return [ok,ok?'Correct. Truncating the axis at four makes the height differences appear much larger.':v==='touch'?'These are separate categories, so the bars should have gaps.':'The key issue is a missing zero baseline, not the colour or the bar spacing.'];},hint:'Check the number at the foot of the vertical axis.',solve(ctl){ctl.querySelector('.rs-opts button')?.click()}},
  {q:'From the original source data, what is the difference between the highest and lowest categories?',build:NOVA.entryTask('Difference in '+data.unit,ID),check(v){const ok=v===difference;return [ok,ok?'Correct. '+Math.max(...data.values)+' minus '+Math.min(...data.values)+' equals '+difference+'.':v===Math.max(...data.values)?'You found the highest value but did not subtract the lowest.':'Subtract the smallest frequency from the greatest frequency.'];},hint:'Read the top of the highest bar and the top of the lowest bar, then subtract.',solve(ctl){const i=ctl.querySelector('input');if(i){i.value=String(difference);i.dispatchEvent(new Event('input',{bubbles:true}));}}}
 ];
 NOVA.challengeRun(panel,api,tasks,paint,CFG);
 CFG._challengeState=()=>ch.v.slice();
}
const DEF={id:ID,title:'Bar chart builder',config:CFG,steps:STEPS,render:watch,alt:'Neon bar chart with four spaced glass columns, labelled categorical x axis and frequency y axis with equal numerical steps.',staticAlt:'A bar chart uses separate columns of equal width. The height is the category frequency. A usual honest frequency axis begins at zero. Truncating the axis exaggerates differences.',
 exploreIntro:'Resize glowing bar columns in real time, then compare a zero baseline against a cropped one.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","opt"]},exploreFields:{"watch.s":{"kind":"factory","factory":"state","argCount":0}}});
NOVA.bankMount({id:ID,num:'F16·02',title:'Bar chart builder',def:DEF,years:'Year 7 KS3, with Year 8–9/GCSE interpretation extensions.',linked:['F0-02','F0-03','F0-04','F16-01','F16-03','F16-14'],spec:{purpose:'Turn a categorical frequency table into an accurately scaled bar chart, then evaluate the visual effect of a truncated baseline.',params:'Four named categories, integer frequencies 0–12, equal interval y-axis and optional explicitly labelled baseline starting at four.',presets:'Y7-066 Books borrowed by four classes · Y7-071 Sports-club visits and misleading graph scale.',steps:'Read counts → Set equal scale → Build four separated bars → Compare tallest → Detect axis cropping → Interpret.',interactions:'Core SVG drag grip snapping to integer chart values, keyboard arrow keys, exact-value controls, honest/truncated axis toggle.',traps:'Unequal scales, bars touching for separate categories, wrong height vs frequency, nonzero baseline distorting comparisons.',gcse:'Critique misleading bar charts; read chart differences and describe baseline manipulation.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4500)};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>{log.textContent='';}}
})();
