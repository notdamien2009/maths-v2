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

/* F16-10 · Scatter Graph & Line of Best Fit. Uses unmodified pinned NOVA shared core. */
(function(){'use strict';
const H=NOVA.h, ID='F16-10', M=NOVA.motion;
const C=window.NovaV2Integration.configuration(window.NOVA_F16_10_CONFIG={preset:'y8-scatter',events:['value','point','line','preset','mode','step','hintUsed','correct','reset'],presets:{
 'y8-scatter':{lesson:'Y8-066',label:'Y8-066 · Scatter and best fit',title:'Revision and assessment',context:'Does greater revision time tend to go with a higher assessment score?',xLab:'Revision hours',yLab:'Score (%)',xMax:10,xTick:2,yMax:100,yTick:20,pairs:[[1,22],[2,36],[3,37],[4,51],[5,59],[6,67],[7,74],[8,83],[9,84]],predictX:6,compareX:10,warning:'The points suggest an association, not a guarantee for any pupil.'},
 'y9-correlation':{lesson:'Y9-050',label:'Y9-050 · Correlation',title:'Activity and resting pulse',context:'Look for a negative association, but do not assume one variable causes the other.',xLab:'Activity hours',yLab:'Pulse rate',xMax:10,xTick:2,yMax:100,yTick:20,pairs:[[1,91],[2,82],[3,79],[4,65],[5,70],[6,57],[7,50],[8,45],[9,40]],predictX:5,compareX:10,warning:'Correlation cannot prove cause and effect. Other factors may matter.'},
 'y9-prediction':{lesson:'Y9-051',label:'Y9-051 · Prediction and fit',title:'Distance and delivery cost',context:'Use a reasonable best-fit line for estimates within and beyond the observed distances.',xLab:'Distance (km)',yLab:'Cost (£)',xMax:12,xTick:2,yMax:80,yTick:20,pairs:[[1,13],[2,14],[3,23],[4,23],[5,29],[6,33],[7,33],[8,42],[9,46]],predictX:6,compareX:11,warning:'Predictions outside observed x-values are extrapolations and become less reliable.'}
}});
const pr=()=>C.presets[C.preset],clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),near=(a,b,t=.01)=>Math.abs(a-b)<=t,fmt=n=>Number(n.toFixed(2)).toString();
const calc=pts=>{const n=pts.length, sx=pts.reduce((a,p)=>a+p[0],0),sy=pts.reduce((a,p)=>a+p[1],0),mx=sx/n,my=sy/n;
 const xx=pts.reduce((a,p)=>a+(p[0]-mx)**2,0),yy=pts.reduce((a,p)=>a+(p[1]-my)**2,0),xy=pts.reduce((a,p)=>a+(p[0]-mx)*(p[1]-my),0);
 const slope=xx?xy/xx:0,intercept=my-slope*mx,r=xx*yy>0?xy/Math.sqrt(xx*yy):0;
 return {slope,intercept,r,predict:x=>intercept+slope*x,min:Math.min(...pts.map(p=>p[0])),max:Math.max(...pts.map(p=>p[0]))};};
const ideal=(pairs,preset=pr())=>{const f=calc(pairs);return [f.predict(0),f.predict(preset.xMax)]};
const fresh=()=>{const pairs=pr().pairs.map(p=>p.slice());const best=ideal(pairs);return {pairs,line:best.slice(),removed:0,edited:false};};
const emit=(key,value)=>NOVA.events.emit('value',{engine:ID,key,value});
const txt=(p,x,y,t,role='given',size=25,anchor='middle')=>NOVA.chalkText(p,x,y,String(t),{role,size,anchor});
const box=(p,x,y,w,h,role='given',r=12)=>NOVA.neonBox(p,x,y,w,h,{role,r});
const line=(p,x1,y1,x2,y2,role='given',width=3)=>NOVA.neonLine(p,x1,y1,x2,y2,{role,width});
const L=()=>innerWidth<=540?{mobile:true,W:450,H:956,plot:{x:83,y:176,w:305,h:438},info:{x:25,y:684,w:400,h:100},source:{x:30,y:811,w:144,h:57},remove:{x:277,y:814,w:142,h:55},axisX:83,axisY:176}:{mobile:false,W:790,H:784,plot:{x:100,y:152,w:570,h:430},info:{x:56,y:626,w:677,h:106},source:{x:69,y:733,w:142,h:42},remove:{x:569,y:733,w:158,h:42},axisX:100,axisY:152};
const STEPS=[
 {name:'Meet paired observations',pose:'read-tablet',narration:'Each data point is one observation containing two related measurements.',prompt:'How many pairs of measurements were collected?'},
 {name:'Build two measured axes',pose:'ruler',narration:'The horizontal and vertical axes have their own labels and numerical scales.',prompt:'Which quantity belongs on each axis?'},
 {name:'Plot the first pairs',pose:'point-down',narration:'Read across for the horizontal value, then up for the vertical value.',prompt:'Where would the first coordinate pair be plotted?'},
 {name:'Plot every observation',pose:'count',narration:'Each pair is plotted once, even when several pairs have the same horizontal value.',prompt:'What is the overall direction of the plotted points?'},
 {name:'Describe the association',pose:'compare',narration:'Look for the overall trend rather than demanding every point lie exactly on one line.',prompt:'Is the association positive, negative or absent?'},
 {name:'Balance a sensible line',pose:'point-right',narration:'Choose a straight line through the middle of the points, with a reasonable balance above and below.',prompt:'Should a best-fit line connect every individual dot?'},
 {name:'Check the fitted line',pose:'think',narration:'A sensible line of best fit is an estimate; there may be several reasonable lines.',prompt:'Are the points reasonably balanced around your line?'},
 {name:'Estimate by interpolation',pose:'magnify',narration:'Using an x-value within the observed data range is interpolation.',prompt:'Why is this prediction better supported by the observations?'},
 {name:'Extrapolate with caution',pose:'idea',narration:'Estimating beyond the observed values is extrapolation, and its reliability is uncertain.',prompt:'What happens if the trend changes beyond our collected data?'},
 {name:'Interpret the relationship',pose:'explain',narration:'Association does not prove causation. Interpret what the data can and cannot establish.',prompt:'What other variables could explain the pattern?'}
];
const speech=[
 'Start with paired measurements. Each pair describes one case, not two separate people.',
 'Label the axes and mark equal intervals. The two quantities can have different units.',
 'Plot each dot at its actual ordered pair. An x-value without the right y-value is wrong.',
 'Now the full scatter plot reveals its pattern. Do not join the dots in observation order.',
 'Read the overall direction. There can be variation around a positive or negative trend.',
 'Our neon line balances the cloud. It is a helpful summary, not a path through every dot.',
 'Look for points both above and below the line. Slightly different sensible fits are possible.',
 'Interpolation stays between the smallest and largest observed x-values.',
 'Extrapolation goes beyond the evidence. The line may no longer describe what happens.',
 'Correlation is not proof of cause. We must consider other explanations and reliability.'
];
function sourceScreen(sv,preset,l){
 txt(sv,l.W/2,62,'Paired observations','focus',l.mobile?32:39);
 txt(sv,l.W/2,107,'Each tile is one (x, y) pair.','support',l.mobile?25:31);
 let cols=l.mobile?3:5,ww=l.mobile?121:129,hh=l.mobile?112:105,gap=l.mobile?15:17,overall=cols*ww+(cols-1)*gap,x0=(l.W-overall)/2;
 preset.pairs.forEach((pair,i)=>{let x=x0+(i%cols)*(ww+gap),y=l.mobile?196+Math.floor(i/cols)*145:214+Math.floor(i/cols)*145;
  box(sv,x,y,ww,hh,i%2?'focus':'given',18);
  txt(sv,x+ww/2,y+45,pair[0],i%2?'focus':'given',l.mobile?37:37);
  txt(sv,x+ww/2,y+87,`→ ${pair[1]}`,'support',l.mobile?28:28);
 });
 const yy=l.mobile?699:601;
 box(sv,26,yy,l.W-52,108,'result',20);txt(sv,l.W/2,yy+47,`${preset.pairs.length} paired observations`,'result',l.mobile?27:34);
 txt(sv,l.W/2,yy+84,'Next: build and label the coordinate axes.','given',l.mobile?22:29);
 txt(sv,l.W/2,l.mobile?878:754,'First value = x     Second value = y','focus',l.mobile?24:27);
}
function svgCoords(svg,e){const q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;const m=svg.getScreenCTM();return m?q.matrixTransform(m.inverse()):null;}
function buildGraph(sv,l,o){const p=pr(),P=l.plot,xmax=p.xMax,ymax=p.yMax,obs=o.state.pairs,phase=o.phase,canMove=o.interactive&&!o.challenge;
 const showAxes=phase>=1||o.interactive||o.challenge;
 if(!showAxes)return;
 txt(sv,l.W/2,l.mobile?74:63,p.title,'focus',l.mobile?33:41);
 txt(sv,l.W/2,l.mobile?118:112,'Two quantities, one relationship','support',l.mobile?24:30);
 // Premium plot uses the actual canonical NOVA plot primitive, with NOVA Chalk scale labels layered on top.
 const graph=NOVA.neonPlot(sv,{x0:P.x,y0:P.y,w:P.w,h:P.h,x:[0,xmax],y:[0,ymax],xStep:p.xTick,yStep:p.yTick,grid:true});
 for(let x=0;x<=xmax;x+=p.xTick){txt(sv,graph.X(x),P.y+P.h+36,x,'given',l.mobile?23:25);}
 for(let y=0;y<=ymax;y+=p.yTick){txt(sv,P.x-18,graph.Y(y)+9,y,'support',l.mobile?22:23,'end');}
 line(sv,P.x,P.y+P.h,P.x+P.w+4,P.y+P.h,'given',3.4);
 line(sv,P.x,P.y-4,P.x,P.y+P.h,'given',3.4);
 txt(sv,P.x+P.w/2,P.y+P.h+86,p.xLab,'given',l.mobile?24:28);
 txt(sv,P.x+10,P.y-13,p.yLab,'support',l.mobile?22:25,'start');
 const count=o.interactive||o.challenge?obs.length:phase<2?0:phase===2?Math.min(3,obs.length):phase===3?Math.min(7,obs.length):obs.length;
 const fit=calc(obs.length>1?obs:p.pairs),showLine=o.interactive||o.challenge||phase>=5;
 if(showLine){const a=o.state.line;let xA=0,yA=a[0],xB=xmax,yB=a[1];
  // Draw only inside the plot, using the NOVA neon stroke; clamp visuals, not the underlying statistics.
  const pth=`M ${graph.X(xA)} ${graph.Y(clamp(yA,0,ymax))} L ${graph.X(xB)} ${graph.Y(clamp(yB,0,ymax))}`;
  NOVA.neonPath(sv,pth,{role:'result',width:5});
  if(phase>=6||o.interactive||o.challenge){
   const aY=yA+(yB-yA)*.5;let num=0;
   for(let i=0;i<Math.min(6,count);i++){let xx=obs[i][0],yy=obs[i][1],onLine=yA+(yB-yA)*xx/xmax;
    if(Math.abs(yy-onLine)>2.5){const xe=graph.X(xx);const residual=`M ${xe} ${graph.Y(yy)} L ${xe} ${graph.Y(clamp(onLine,0,ymax))}`;NOVA.neonPath(sv,residual,{role:'support',width:1.5});num++;}}
  }
  if(o.interactive||o.challenge&&o.task===1){
   [0,1].forEach(j=>{let hx=graph.X(j?xmax:0),hy=graph.Y(clamp(a[j],0,ymax));
    let g=box(sv,hx-18,hy-18,36,36,'result',18);txt(g,hx,hy+8,j?'B':'A','result',25);
    g.dataset.lineEnd=String(j);g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`Best fit line endpoint ${j?'B':'A'} height ${fmt(a[j])}. Drag vertically or press arrow keys.`);
    NOVA.ui.svgDrag(sv,g,{box:{x:hx-18,y:hy-18,w:36,h:36},zones:()=>[{id:'plot',kind:'drop',x:P.x,y:P.y,w:P.w,h:P.h}],onDrop:id=>{
      const q=sv._f1610Last;if(id!=='plot'||!q)return false;
      a[j]=clamp(Math.round(graph.toData(q.x,q.y)[1]/2)*2,0,ymax);o.state.edited=true;emit('line',{endpoint:j,values:a.slice()});o.update();return true;}});
    g.addEventListener('pointerdown',e=>{try{g.setPointerCapture(e.pointerId)}catch(_){};});
    g.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();a[j]=clamp(a[j]+(e.key==='ArrowUp'?2:-2),0,ymax);o.state.edited=true;emit('line',{endpoint:j,values:a.slice()});o.update();});
   });
  }
 }
 if(phase>=7&&!o.interactive&&!o.challenge){const at=phase===7?p.predictX:p.compareX,val=fit.predict(at),inside=at>=fit.min&&at<=fit.max;
  if(at<=xmax){const xx=graph.X(at),yy=graph.Y(clamp(val,0,ymax));line(sv,xx,P.y+P.h,xx,yy,'focus',2);NOVA.neonRing(sv,xx,yy,{role:'result',r:9,pulse:false});
   txt(sv,xx,Math.max(P.y+35,yy-19),`≈ ${fmt(val)}`,'result',l.mobile?23:26);}
 }
 const pointZones=()=>[{id:'plot',kind:'drop',x:P.x,y:P.y,w:P.w,h:P.h},{id:'remove',kind:'remove',...l.remove}];
 for(let i=0;i<count;i++){
  const pair=obs[i],px=graph.X(pair[0]),py=graph.Y(pair[1]);
  let marker=NOVA.neonRing(sv,px,py,{role:i%2?'focus':'given',r:9,pulse:false});
  // The ring is the original NOVA apparatus; a precise transparent hit target supports fast pointer movement.
  if(canMove){marker.dataset.point=String(i);marker.setAttribute('tabindex','0');marker.setAttribute('role','button');marker.setAttribute('aria-label',`Observation ${i+1}, ${pair[0]} ${p.xLab}, ${pair[1]} ${p.yLab}. Drag to edit, or use arrow keys.`);
   NOVA.ui.svgDrag(sv,marker,{box:{x:px-14,y:py-14,w:28,h:28},zones:pointZones,onDrop:id=>{const q=sv._f1610Last;if(id!=='plot'||!q)return false;
    const [nx,ny]=graph.toData(q.x,q.y);pair[0]=clamp(Math.round(nx),0,xmax);pair[1]=clamp(Math.round(ny/2)*2,0,ymax);emit('point',{index:i,values:pair.slice()});o.state.edited=true;o.update();return true;},onRemove:()=>{if(obs.length<=3)return;obs.splice(i,1);o.state.removed++;emit('point',{removed:i,count:obs.length});o.update();},removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+l.remove.h/2}});
   marker.addEventListener('pointerdown',e=>{try{marker.setPointerCapture(e.pointerId)}catch(_){};});
   marker.addEventListener('keydown',e=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,2],ArrowDown:[0,-2]}[e.key];if(d){e.preventDefault();pair[0]=clamp(pair[0]+d[0],0,xmax);pair[1]=clamp(pair[1]+d[1],0,ymax);o.state.edited=true;emit('point',{index:i,values:pair.slice()});o.update();}else if(e.key==='Delete'&&obs.length>3){e.preventDefault();obs.splice(i,1);o.state.removed++;emit('point',{removed:i,count:obs.length});o.update();}});
  }
 }
 // Draw the interactive 'new data' token away from the graph and dock, with a distinct removal target.
 if(canMove){box(sv,l.source.x,l.source.y,l.source.w,l.source.h,'focus',14);
  let src=box(sv,l.source.x+6,l.source.y+6,l.source.w-12,l.source.h-12,'given',13);
  txt(src,l.source.x+l.source.w/2,l.source.y+l.source.h*.65,'+ data','focus',l.mobile?25:24);
  src.dataset.source='1';src.setAttribute('tabindex','0');src.setAttribute('role','button');src.setAttribute('aria-label','Drag a new data card onto the scatter graph to add a point, or press Enter to add an observation.');
  NOVA.ui.svgDrag(sv,src,{box:{x:l.source.x+6,y:l.source.y+6,w:l.source.w-12,h:l.source.h-12},zones:()=>[{id:'plot',kind:'drop',x:P.x,y:P.y,w:P.w,h:P.h}],canStart:()=>obs.length<16,onDrop:id=>{
   const q=sv._f1610Last;if(id!=='plot'||!q||obs.length>=16)return false;const [nx,ny]=graph.toData(q.x,q.y);obs.push([clamp(Math.round(nx),0,xmax),clamp(Math.round(ny/2)*2,0,ymax)]);emit('point',{added:obs.at(-1),count:obs.length});o.update();return true;}});
  src.addEventListener('pointerdown',e=>{try{src.setPointerCapture(e.pointerId)}catch(_){};});
  src.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;e.preventDefault();if(obs.length>=16)return;obs.push([Math.round(xmax/2),Math.round(ymax/2)]);emit('point',{added:obs.at(-1),count:obs.length});o.update();});
 }
 if(canMove){box(sv,l.remove.x,l.remove.y,l.remove.w,l.remove.h,'error',13);txt(sv,l.remove.x+l.remove.w/2,l.remove.y+l.remove.h*.65,'Remove dot','error',l.mobile?23:22);}
 // A below-graph interpretation field, not a second unneeded row dividing the mathematical canvas.
 if(phase>=3||o.interactive||o.challenge){const inf=l.info;box(sv,inf.x,inf.y,inf.w,inf.h,'given',18);
  let label=fit.r>.35?'Positive':fit.r<-.35?'Negative':'Weak/no';
  const inference=phase>=8&&!o.interactive&&!o.challenge?'Extrapolation: further from evidence':phase>=7&&!o.interactive&&!o.challenge?'Interpolation stays within observed x-values':`${obs.length} plotted pairs · ${label} association`;
  txt(sv,inf.x+inf.w/2,inf.y+43,inference,'focus',l.mobile?23:29);
  txt(sv,inf.x+inf.w/2,inf.y+78,phase>=9?"Correlation does not prove causation.":o.interactive?'Drag points or line ends. Recalculate the trend.':`Best-fit line: balance above and below.`,'support',l.mobile?21:25);
 }
 }
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';const p=pr(),l=L(),phase=o.phase??9,state=o.state||fresh();
 NOVA.cap(stage,p.context,`${p.lesson} · SCATTER & FIT`);
 const sv=NOVA.svg.root(l.W,l.H,'Scatter graph with labelled horizontal and vertical continuous numerical axes. Neon points and a draggable line of best fit.');sv.classList.add('f1610-svg');
 sv.addEventListener('pointerup',e=>{sv._f1610Last=svgCoords(sv,e)},true);
 if(phase===0&&!o.interactive&&!o.challenge)sourceScreen(sv,p,l);else buildGraph(sv,l,o);
 stage.append(sv);
 const chips=H('div',{class:'f1610-chips'});
 if(phase>=4||o.interactive||o.challenge){const r=calc(state.pairs);chips.append(NOVA.neonTile(`Direction: ${r.r>.35?'positive':r.r<-.35?'negative':'weak'}`,{role:'given'}));}
 if(phase>=6||o.interactive)chips.append(NOVA.neonTile(`Pairs: ${state.pairs.length}`,{role:'focus'}));
 if(phase>=7&&!o.challenge){const x=phase>=8&&!o.interactive?p.compareX:p.predictX;chips.append(NOVA.neonTile(`${x} → ≈ ${fmt(calc(state.pairs).predict(x))}`,{role:'result'}));}
 stage.append(chips);
 NOVA.scene.helperStrip(stage,o.pose||'compare',o.speech||'The line describes a trend. Individual points need not lie on it.');return sv;
}
function watch(i,stage){scene(stage,{phase:i,state:fresh(),pose:STEPS[i].pose,speech:speech[i]});}
function select(label,options){const el=H('select',{class:'nova-input','aria-label':label});options.forEach(([val,name])=>el.append(H('option',{value:String(val),text:name})));return el;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let st=fresh();window.NovaLessonComponent?.applyExploreModels();const preset=select('Lesson preset',Object.entries(C.presets).map(([k,v])=>[k,v.label]));window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();const endA=H('input',{type:'range',min:'0',max:String(pr().yMax),step:'2','aria-label':'Line endpoint A height'}),endB=H('input',{type:'range',min:'0',max:String(pr().yMax),step:'2','aria-label':'Line endpoint B height'});
 window.NovaLessonComponent?.applyExploreModels();const reset=H('button',{class:'nova-btn',text:'Reset observations'}),add=H('button',{class:'nova-btn',text:'Add observation'}),stat=H('p',{class:'f1610-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();function render(){const f=calc(st.pairs);scene(stage,{state:st,interactive:true,phase:9,pose:'point-down',speech:'Drag an observed point to change its coordinates, or drag A and B to reposition the line through the cloud.',update:render});endA.max=String(pr().yMax);endB.max=String(pr().yMax);endA.value=String(clamp(Math.round(st.line[0]/2)*2,0,pr().yMax));endB.value=String(clamp(Math.round(st.line[1]/2)*2,0,pr().yMax));
 stat.textContent=`${st.pairs.length} observations · correlation r ≈ ${fmt(f.r)} · least-squares comparison: y ≈ ${fmt(f.intercept)} ${f.slope<0?'−':'+'} ${fmt(Math.abs(f.slope))}x. A sensible hand-drawn fit may differ.`;}
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{C.preset=preset.value;st=fresh();emit('preset',C.preset);render()};window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{st=fresh();emit('reset',true);render()};window.NovaLessonComponent?.applyExploreModels();add.onclick=()=>{if(st.pairs.length>=16)return;st.pairs.push([Math.round(pr().xMax/2),Math.round(pr().yMax/2)]);emit('point',{added:st.pairs.at(-1),count:st.pairs.length});render()};
 window.NovaLessonComponent?.applyExploreModels();endA.oninput=v=>{st.line[0]=+endA.value;st.edited=true;render()};window.NovaLessonComponent?.applyExploreModels();endB.oninput=v=>{st.line[1]=+endB.value;st.edited=true;render()};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f1610-help',text:'Drag luminous observations within the scatter grid; drag the two line-end handles vertically to balance points above and below. The + data tile adds a new point; the red target removes one. The sliders, Add button and arrow keys give equivalent controls.'}),
 H('div',{class:'f1610-controls'},[H('label',{},['Lesson preset',preset]),H('label',{},['Line at x = 0',endA]),H('label',{},['Line at maximum x',endB]),add,reset]),stat);window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:C.preset,pairs:st.pairs.map(a=>a.slice()),line:st.line.slice(),regression:calc(st.pairs),removed:st.removed}),select:k=>{preset.value=k;preset.onchange()},setPoint:(i,x,y)=>{if(!st.pairs[i])return;st.pairs[i]=[x,y];render()},setLine:(a,b)=>{st.line=[a,b];render()},reset:()=>{st=fresh();render()}};
}
function challenge(panel,api,stage){const p=pr();let task=0,st=fresh();const fit=calc(st.pairs),target=ideal(st.pairs),type=fit.r>.35?'positive':fit.r<-.35?'negative':'none';
 st.line=[clamp(Math.round((target[0]+16)/2)*2,0,p.yMax),clamp(Math.round((target[1]-16)/2)*2,0,p.yMax)];
 const stat=H('p',{class:'f1610-status',role:'status'});let row=H('div',{class:'f1610-controls'}),left=H('input',{type:'range',min:'0',max:String(p.yMax),step:'2','aria-label':'Move left end of best fit line'}),right=H('input',{type:'range',min:'0',max:String(p.yMax),step:'2','aria-label':'Move right end of best fit line'});
 row.append(H('label',{},['Left endpoint',left]),H('label',{},['Right endpoint',right]));panel.append(H('p',{class:'f1610-help',text:'Read the association, fit the line using the two handles, then make a cautious prediction. Dragging or adjusting the sliders changes the same mathematically checked line.'}),row,stat);
 function render(){scene(stage,{phase:9,state:st,challenge:true,task,pose:task===0?'compare':task===1?'ruler':'think',speech:task===0?'Look at the overall direction. It is the pattern, not an exact straight line, that matters.':task===1?'Drag the line ends until the points are balanced fairly around the trend.':'Interpolation lies within the observed values. Extrapolation is less reliable.',update:render});row.style.display=task===1?'flex':'none';left.value=String(st.line[0]);right.value=String(st.line[1]);stat.textContent=task===1?'The line need not pass through every dot; keep each endpoint reasonably near the central trend.':task===2?p.warning:'Consider the overall direction without assuming cause and effect.';}
 left.oninput=()=>{st.line[0]=+left.value;st.edited=true;render()};right.oninput=()=>{st.line[1]=+right.value;st.edited=true;render()};
 const predictionX=p.predictX,targetPrediction=fit.predict(predictionX);
 const questions=[
 {q:'Which direction of correlation is suggested by these paired measurements?',build:NOVA.choiceTask([{label:'Positive',value:'positive'},{label:'Negative',value:'negative'},{label:'Little or none',value:'none'}],ID),check:v=>[v===type,v===type?'Correct: judge the overall direction, allowing for scatter.':'Look at what happens to the y-values as x generally increases. This does not establish causation.'],hint:'If y generally rises as x rises, correlation is positive. If it falls, correlation is negative.',solve:()=>{}},
 {q:'Position the two draggable ends to draw a sensible line through the centre of the scatter points.',build:()=>()=>st.line.slice(),check:v=>{const err0=Math.abs(v[0]-target[0]),err1=Math.abs(v[1]-target[1]);const ok=err0<=10&&err1<=10;return [ok,ok?'Good fit: the line is close to the central trend. Other nearby lines could also be sensible.':(err0>10&&err1>10?'Both line ends are away from the central trend. Balance points above and below.':err0>10?'The left end does not yet balance the points. Move end A toward the cloud.':'The right end does not yet balance the points. Move end B toward the cloud.')];},hint:'Use A and B to balance the plotted points around the line. Arrow keys and sliders work too.',solve:()=>{st.line=target.map(v=>clamp(Math.round(v/2)*2,0,p.yMax));render()}},
 {q:`Using a reasonable fitted trend, estimate ${p.yLab.toLowerCase()} when ${p.xLab.toLowerCase()} is ${predictionX}. Enter a numerical estimate.`,build:NOVA.entryTask('Estimated y-value',ID),check:v=>{let ok=Number.isFinite(v)&&Math.abs(v-targetPrediction)<=5;let msg=ok?`Reasonable interpolation: about ${fmt(targetPrediction)}. A different sensible fit may give a nearby estimate.`:(v===predictionX?'You have repeated the x-value; use the fitted line to read y.':`Read y where x = ${predictionX}, not the nearest plotted observation.`);return [ok,msg];},hint:`${predictionX} lies ${predictionX>=fit.min&&predictionX<=fit.max?'within':'outside'} the observed x-values. Read vertically from x to the fitted line, then across to y.`,solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,questions,k=>{task=k;render()},C);
 C._challengeState=()=>({task,line:st.line.slice(),target:target.slice(),prediction:targetPrediction,direction:type});
}
const DEF={id:ID,title:'Scatter Graph and Line of Best Fit',config:C,steps:STEPS,render:watch,alt:'Continuous scatter plot with original NOVA neon axes, draggable luminous paired observations and line-end handles.',staticAlt:'Scatter plots display paired data. A line of best fit estimates a pattern; interpolation is within the observed range, extrapolation outside it and correlation is not causation.',exploreIntro:'Move paired observations and both best-fit endpoints. Try a new point or remove one to test the trend.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS,"speech":()=>speech},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·10',title:'Scatter Graph & Line of Best Fit',def:DEF,years:'KS3 Year 8–9; GCSE preparation.',linked:['F0-02','F0-03','F0-04','F0-14','F16-03','F16-06'],spec:{purpose:'Plot bivariate data, interpret correlation, position a sensible line of best fit, distinguish interpolation and cautious extrapolation.',params:'Editable (x,y) pairs, independent equal-step numeric axes, two adjustable fitted-line endpoints, trend and predictive reading.',presets:'Y8-066 scatter graph and best fit; Y9-050 correlation without causation; Y9-051 interpolation and extrapolation.',steps:'Pairs → axes → first plot → full cloud → association → best-fit line → balance → interpolation → extrapolation → interpretation.',interactions:'Native NOVA.ui.svgDrag of points, removable data, source card, and best-fit endpoints; keyboard and range-slider equivalents.',traps:'Joining dots, forcing every dot onto the line, confusing negative with no correlation, assuming causation, treating extrapolation as certain.',gcse:'Reasonable best-fit judgement and uncertainty when predicting beyond observed values.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
