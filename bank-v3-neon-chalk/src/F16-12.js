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

/* NOVA F16-12 Histogram · original F0/F2 shared core, local component scene only */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,M=NOVA.motion,ID='F16-12';
const C=window.NovaV2Integration.configuration(window.NOVA_F16_12_CONFIG={preset:'y8-frequency',events:['value','frequency','density','preset','mode','step','correct','hintUsed','reset'],presets:{
 'y8-frequency':{lesson:'Y8-064',label:'Y8-064 · Class intervals',title:'Journey durations',context:'Grouped journey times show why different class widths need frequency density.',bounds:[0,5,15,20,40],frequencies:[4,8,6,10],unit:'min'},
 'y8-mean':{lesson:'Y8-065',label:'Y8-065 · Grouped estimates',title:'Travel times and estimates',context:'Read uneven class widths and use midpoints for an estimated mean.',bounds:[0,10,20,40,60],frequencies:[5,9,12,4],unit:'min'},
 'y9-represent':{lesson:'Y9-047',label:'Y9-047 · Represent grouped data',title:'Study time distribution',context:'Compare unequal-width histogram bars by area, rather than height alone.',bounds:[0,5,15,35,50],frequencies:[3,12,10,6],unit:'min'}
}});
const STEPS=[
 {name:'Collect continuous measurements',pose:'count',narration:'We have measurements recorded on a continuous scale. We need class boundaries so every observation is counted exactly once.',prompt:'What does a measurement tell us?'},
 {name:'Define class boundaries',pose:'ruler',narration:'These classes have different widths. Each value goes in one interval, including its lower boundary but excluding its upper boundary.',prompt:'Which class contains a value exactly on a boundary?'},
 {name:'Build the frequency table',pose:'point-down',narration:'Count every measurement once. The frequency tells us how many are in each class.',prompt:'Which column counts observations?'},
 {name:'Calculate class widths',pose:'compare',narration:'Subtract the lower class boundary from the upper. These intervals do not all have the same width.',prompt:'How wide is the first class?'},
 {name:'Calculate frequency density',pose:'think',narration:'Divide frequency by class width. Frequency density is the correct vertical axis for a histogram with unequal class widths.',prompt:'How do you calculate the height of a bar?'},
 {name:'Build the histogram',pose:'point-right',narration:'The bars touch, and each bar stretches across its actual class interval. Its height is frequency density, not frequency.',prompt:'Which bars are wider?'},
 {name:'Verify bar area',pose:'count',narration:'A rectangle area is class width times frequency density. That area gives the frequency.',prompt:'How many observations does the widest bar represent?'},
 {name:'Read and compare',pose:'idea',narration:'A tall narrow bar can contain fewer observations than a lower wide bar. Compare areas for frequency, not bar heights.',prompt:'Which bar has the largest area?'},
 {name:'Explain what the histogram means',pose:'celebrate',narration:'A correct histogram has a continuous horizontal scale, bars that touch, and frequency density on the vertical axis. Area represents frequency.',prompt:'What is the difference between a histogram and a bar chart?'}
];
const pr=()=>C.presets[C.preset],sum=a=>a.reduce((x,y)=>x+y,0),width=(p,i)=>p.bounds[i+1]-p.bounds[i],mid=(p,i)=>(p.bounds[i+1]+p.bounds[i])/2,fmt=x=>Number(x.toFixed(2)).toString(),density=(p,f,i)=>f[i]/width(p,i),weighted=(p,f)=>f.reduce((v,n,i)=>v+n*mid(p,i),0),mean=(p,f)=>sum(f)?weighted(p,f)/sum(f):0,range=(p,i)=>`${p.bounds[i]}–${p.bounds[i+1]}`;
const maxFor=(p,i)=>Math.min(20,Math.floor(2.4*width(p,i))),fresh=()=>({freq:pr().frequencies.slice(),removed:0}),emit=(key,value)=>NOVA.events.emit('value',{engine:ID,key,value});
const txt=(sv,x,y,t,role='given',size=26,anchor='middle')=>NOVA.chalkText(sv,x,y,String(t),{role,size,anchor});
const bx=(sv,x,y,w,h,role='given',r=10)=>NOVA.neonBox(sv,x,y,w,h,{role,r});
const line=(sv,x1,y1,x2,y2,role='given',w=2.5)=>NOVA.neonLine(sv,x1,y1,x2,y2,{role,width:w});
function layout(){const mobile=innerWidth<=540;return mobile?{mobile,W:450,H:1225,table:{x:24,y:132,w:402,row:57,head:54},chart:{x:74,y:565,w:342,h:280},remove:{x:298,y:1076,w:124,h:63},tray:{x:23,y:1068,w:257,h:78}}:{mobile,W:790,H:885,table:{x:26,y:181,w:340,row:66,head:58},chart:{x:446,y:242,w:294,h:338},remove:{x:602,y:791,w:143,h:58},tray:{x:49,y:783,w:526,h:72}};}
function rawData(p){const all=[];p.frequencies.forEach((f,i)=>{let w=width(p,i);for(let k=0;k<f;k++)all.push(p.bounds[i]+Math.floor(1+(k+.5)*(w-1)/Math.max(f,1)));}); // mixing classes must look genuinely unsorted
 const shuffled=[];let left=all.slice(),k=1;while(left.length){k=(k+11)%left.length;shuffled.push(left.splice(k,1)[0]);}return shuffled;}
function startScene(v,l,p,phase){const vals=rawData(p),cols=l.mobile?7:8,cw=l.mobile?55:76,wh=l.mobile?53:61,span=cols*cw,x=(l.W-span)/2,y0=l.mobile?203:199;
 txt(v,l.W/2,52,p.title,'focus',l.mobile?35:40);
 txt(v,l.W/2,105,phase===0?'Measurements in their collected order':'Intervals divide a continuous scale','given',l.mobile?27:31);
 const rows=Math.ceil(vals.length/cols),h=rows*(wh+12)+23;
 bx(v,l.mobile?23:61,y0-22,l.mobile?404:668,h+17,'given',21);
 vals.forEach((value,i)=>{const x0=x+(i%cols)*cw+2,y=y0+Math.floor(i/cols)*(wh+12);bx(v,x0,y,cw-5,wh,(i%3===0)?'focus':'given',10);txt(v,x0+(cw-5)/2,y+wh*.68,value,'focus',l.mobile?27:30);});
 const yy=y0+h+43;
 bx(v,l.mobile?27:97,yy,l.mobile?396:598,104,'result',15);
 txt(v,l.W/2,yy+42,phase===0?`${vals.length} measurements`:'Every boundary belongs to one class','given',l.mobile?27:33);
 txt(v,l.W/2,yy+83,phase===0?'Next: organise the values':'Unequal widths need a density scale','result',l.mobile?25:29);
 if(phase===1){const ww=l.mobile?93:139,x0=(l.W-p.frequencies.length*ww)/2,by=yy+142;
  p.frequencies.forEach((_,i)=>{bx(v,x0+i*ww+3,by,ww-6,61,i%2?'focus':'given',10);txt(v,x0+i*ww+ww/2,by+41,range(p,i),'given',l.mobile?27:29);});}
}
function table(v,l,o){const p=pr(),T=l.table,f=o.state.freq,n=f.length,active=o.interactive||o.challenge,ph=o.phase;
 txt(v,T.x+T.w/2,T.y-23,'Continuous class table','focus',l.mobile?28:31);
 bx(v,T.x,T.y,T.w,T.head,'given',11);
 const cs=[.2,.52,.80],sx=k=>T.x+T.w*cs[k];
 txt(v,sx(0),T.y+T.head*.66,'Class','given',l.mobile?22:24);
 txt(v,sx(1),T.y+T.head*.66,'Freq.','focus',l.mobile?23:25);
 txt(v,sx(2),T.y+T.head*.66,'Density','result',l.mobile?22:24);
 const zones=[];
 for(let i=0;i<n;i++)zones.push({id:'class:'+i,kind:'drop',x:T.x+3,y:T.y+T.head+i*T.row+2,w:T.w-6,h:T.row-4});
 for(let i=0;i<n;i++){
  const y=T.y+T.head+i*T.row,shown=active||ph>=3||ph===2&&i<2;
  bx(v,T.x,y,T.w,T.row-3,i%2?'given':'focus',8);
  txt(v,sx(0),y+T.row*.64,range(p,i),'given',l.mobile?23:25);
  if(active){const token=E('g',{},v);token.dataset.token=String(i);token.setAttribute('role','button');token.setAttribute('tabindex','0');token.setAttribute('aria-label',`Class ${range(p,i)}, frequency ${f[i]}. Drag onto another row to transfer one observation, or press arrows. Delete removes one.`);
   bx(token,sx(1)-34,y+11,68,T.row-19,'focus',11);txt(token,sx(1),y+T.row*.66,f[i],'focus',l.mobile?27:30);
   const change=k=>{if(i===k||k<0||k>=n||f[i]<1||f[k]>=maxFor(p,k))return false;f[i]--;f[k]++;emit('frequency',{from:i,to:k,frequencies:f.slice()});o.update();return true;};
   NOVA.ui.svgDrag(v,token,{box:{x:sx(1)-34,y:y+11,w:68,h:T.row-19},zones:()=>zones.concat([{id:'remove',kind:'remove',...l.remove}]),onDrop:id=>id.startsWith('class:')&&change(+id.slice(6)),onRemove:()=>{if(sum(f)<=1||f[i]<1)return;f[i]--;o.state.removed++;emit('frequency',{removed:i,frequencies:f.slice()});o.update();},removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+l.remove.h/2}});
   token.addEventListener('pointerdown',e=>{try{token.setPointerCapture(e.pointerId)}catch(_){}});
   token.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete'].includes(e.key))return;e.preventDefault();if(e.key==='Delete'){if(sum(f)>1&&f[i]>0){f[i]--;o.state.removed++;o.update();}}else change((i+(e.key==='ArrowUp'||e.key==='ArrowLeft'?n-1:1))%n);});
  }else txt(v,sx(1),y+T.row*.66,shown?f[i]:'?', 'focus',l.mobile?27:29);
  txt(v,sx(2),y+T.row*.66,shown&&(active||ph>=4)?fmt(density(p,f,i)):'?', 'result',l.mobile?26:29);
 }
 const y=T.y+T.head+n*T.row+9;
 bx(v,T.x,y,T.w,53,'result',10);txt(v,T.x+T.w*.24,y+36,'Total frequency','given',l.mobile?23:26);txt(v,T.x+T.w*.78,y+36,(active||ph>=3)?sum(f):'?', 'result',l.mobile?27:30);
}
function graph(v,l,o){const p=pr(),f=o.state.freq,g=l.chart,ph=o.phase,active=o.interactive||o.challenge,yMax=2.4;
 const ybottom=g.y+g.h,X=x=>g.x+(x-p.bounds[0])/(p.bounds.at(-1)-p.bounds[0])*g.w,Y=d=>ybottom-(d/yMax)*g.h;
 txt(v,g.x+g.w/2,g.y-64,'Frequency density','focus',l.mobile?29:32);
 // Plot comes directly from the canonical NOVA plotting helper; labels are rendered as NOVA Chalk.
 const P=NOVA.neonPlot(v,{x0:g.x,y0:g.y,w:g.w,h:g.h,x:[p.bounds[0],p.bounds.at(-1)],y:[0,yMax],grid:true,xStep:5,yStep:.4});
 // Keep canonical NOVA axes and grid, replace its 10px generic tick labels with large Chalk numerals.
 if(P&&P.g)P.g.querySelectorAll('text').forEach(t=>t.setAttribute('visibility','hidden'));
 for(let d=0;d<=2.401;d+=.4){const y=Y(d);line(v,g.x-7,y,g.x+g.w,y,'support',1.3);txt(v,g.x-32,y+8,fmt(d),'support',l.mobile?24:25);}
 p.bounds.forEach((b,i)=>{const x=X(b);line(v,x,ybottom,x,ybottom+10,'given',2.3);txt(v,x,ybottom+37,b,'given',l.mobile?25:26);});
 txt(v,g.x+g.w/2,ybottom+(l.mobile?89:55),`Time (${p.unit})`,'given',l.mobile?27:28);
 if(ph<4&&!active)return;
 for(let i=0;i<f.length;i++){
  const shown=active||ph>=5||ph===4&&i===0;
  if(!shown)continue;
  const d=density(p,f,i),x=X(p.bounds[i]),w=X(p.bounds[i+1])-x,y=Y(d),h=ybottom-y,role=i%2?'focus':'given';
  if(h>0.1){const bar=bx(v,x,y,w,h,role,0);bar.classList.add('f1612-hist-bar');if(!active&&ph===5)M.arrive(bar,0,15+i*18,360);
   if(i%2){for(let yy=y+25;yy<ybottom-5;yy+=34)line(v,x+5,yy,x+w-5,yy,'support',1.4);}}
  if(ph>=6||active)txt(v,x+w/2,y-18,fmt(d),'result',l.mobile?26:27);
  if(active){
   const hx=x+w/2,hy=y-12,handle=E('g',{},v);handle.dataset.handle=String(i);handle.setAttribute('tabindex','0');handle.setAttribute('role','button');handle.setAttribute('aria-label',`Resize the histogram bar for class ${range(p,i)}. Frequency ${f[i]}, width ${width(p,i)}, density ${fmt(d)}. Arrow keys change frequency.`);
   bx(handle,hx-18,hy-15,36,30,'result',12);txt(handle,hx,hy+8,'↕','result',26);
   // Density matches a count of observations divided by the class width. Each bar level snaps to a whole frequency.
   const max=Math.min(20,Math.floor(yMax*width(p,i)));
   const zones=()=>Array.from({length:max+1},(_,count)=>{const cy=Y(count/width(p,i));return {id:'height:'+count,kind:'drop',x:x-4,y:cy-Math.max(11,g.h/(yMax*width(p,i))/2),w:w+8,h:Math.max(22,g.h/(yMax*width(p,i)))}});
   const adjust=n=>{if(n===f[i]||n<0||n>max)return false;f[i]=n;emit('density',{class:i,density:fmt(density(p,f,i)),frequency:n});o.update();return true;};
   NOVA.ui.svgDrag(v,handle,{box:{x:hx-18,y:hy-15,w:36,h:30},zones,onDrop:id=>id.startsWith('height:')&&adjust(+id.slice(7))});
   handle.addEventListener('pointerdown',e=>{try{handle.setPointerCapture(e.pointerId)}catch(_){}});
   handle.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();adjust(Math.min(max,Math.max(0,f[i]+(e.key==='ArrowUp'?1:-1))));});
  }
 }
 if(ph>=7||active){const k=(p.lesson==='Y8-064'?3:2),yy=ybottom+(l.mobile?132:95);
  txt(v,g.x+g.w/2,yy,`Area = width × density = frequency`,'result',l.mobile?24:27);
  txt(v,g.x+g.w/2,yy+39,`${width(p,k)} × ${fmt(density(p,f,k))} = ${f[k]} observations`,'focus',l.mobile?25:28);
 }else txt(v,g.x+g.w/2,ybottom+141,'Bars touch; widths follow the class scale','support',l.mobile?24:26);
}
function extras(v,l,o){const ph=o.phase,p=pr(),f=o.state.freq,active=o.interactive||o.challenge;
 if(active){
  bx(v,l.tray.x,l.tray.y,l.tray.w,l.tray.h,'given',15);
  txt(v,l.tray.x+l.tray.w/2,l.tray.y+30,'Move frequency tiles','given',l.mobile?22:28);
  txt(v,l.tray.x+l.tray.w/2,l.tray.y+58,'between class rows','support',l.mobile?21:24);
  bx(v,l.remove.x,l.remove.y,l.remove.w,l.remove.h,'error',11);
  txt(v,l.remove.x+l.remove.w/2,l.remove.y+39,'Remove −1','error',l.mobile?24:25);
 }else if(ph>=2){
  txt(v,l.W/2,l.mobile?1167:865,ph<5?'Width changes the required height':ph===5?'Bars touch with no gaps':`Total observations = ${sum(f)}`,'result',l.mobile?24:29);
 }
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';const p=pr(),l=layout(),state=o.state||fresh(),phase=o.phase??8;
 NOVA.cap(stage,p.context,`${p.lesson} · HISTOGRAM`);
 const sv=NOVA.svg.root(l.W,l.H,'NOVA neon histogram with continuous uneven class widths: bar heights show frequency density and bar area shows frequency. Interactive table frequency tiles, histogram handles and red removal zone.');sv.classList.add('f1612-svg');
 if(phase<=1&&!o.interactive&&!o.challenge)startScene(sv,l,p,phase);
 else{txt(sv,l.W/2,45,p.title,'focus',l.mobile?34:39);txt(sv,l.W/2,87,`${p.lesson} · unequal class widths`,'given',l.mobile?24:28);table(sv,l,{...o,phase,state});graph(sv,l,{...o,phase,state});extras(sv,l,{...o,phase,state});}stage.append(sv);
 const chips=H('div',{class:'f1612-info'});
 if(phase>=3||o.interactive||o.challenge)chips.append(NOVA.neonTile(`Total = ${sum(state.freq)}`,{role:'given'}));
 if(phase>=4||o.interactive||o.challenge)chips.append(NOVA.neonTile('Density = frequency ÷ width',{role:'focus'}));
 if(phase>=7||o.interactive||o.challenge)chips.append(NOVA.neonTile('Area = frequency',{role:'result'}));
 if(C.preset==='y8-mean'&&(phase>=7||o.interactive||o.challenge))chips.append(NOVA.neonTile(`Midpoint mean ≈ ${fmt(mean(p,state.freq))} ${p.unit} (estimate)`,{role:'focus'}));
 stage.append(chips);NOVA.scene.helperStrip(stage,o.pose||'count',o.speech||'In a histogram, a rectangle’s area represents its frequency.');return sv;
}
function watch(i,stage){scene(stage,{phase:i,state:fresh(),pose:STEPS[i].pose,speech:STEPS[i].narration});}
function select(label,items){const el=H('select',{class:'nova-input','aria-label':label});items.forEach(([v,t])=>el.append(H('option',{value:String(v),text:t})));return el;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let st=fresh();window.NovaLessonComponent?.applyExploreModels();const preset=select('Lesson preset',Object.entries(C.presets).map(([k,v])=>[k,v.label])),src=select('Source class',[]),dst=select('Destination class',[]),transfer=H('button',{class:'nova-btn primary',text:'Transfer one'}),plus=H('button',{class:'nova-btn',text:'Add one'}),minus=H('button',{class:'nova-btn',text:'Remove one'}),reset=H('button',{class:'nova-btn',text:'Reset'}),status=H('p',{class:'f1612-status',role:'status'});window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();function opts(){src.innerHTML='';dst.innerHTML='';pr().frequencies.forEach((_,i)=>{src.append(H('option',{value:i,text:range(pr(),i)}));dst.append(H('option',{value:i,text:range(pr(),i)}));});dst.value='1';}
 window.NovaLessonComponent?.applyExploreModels();function render(){scene(stage,{phase:9,state:st,interactive:true,pose:'point-down',speech:'Drag a frequency between table rows or move a bar-height handle. Watch its density and area recalculate when the class width stays fixed.',update:render});status.textContent=`Frequencies: ${st.freq.join(', ')} · Densities: ${st.freq.map((_,i)=>fmt(density(pr(),st.freq,i))).join(', ')} · Total: ${sum(st.freq)}.`;}
 window.NovaLessonComponent?.applyExploreModels();transfer.onclick=()=>{const a=+src.value,b=+dst.value;if(a===b||st.freq[a]<1||st.freq[b]>=maxFor(pr(),b)){status.textContent='Choose different classes with a non-empty source and destination below 20.';return;}st.freq[a]--;st.freq[b]++;emit('frequency',{from:a,to:b,frequencies:st.freq.slice()});render();};
 window.NovaLessonComponent?.applyExploreModels();plus.onclick=()=>{const i=+dst.value,max=Math.min(20,Math.floor(2.4*width(pr(),i)));if(st.freq[i]>=max){status.textContent='This frequency exceeds the vertical density scale.';return;}st.freq[i]++;render();};
 window.NovaLessonComponent?.applyExploreModels();minus.onclick=()=>{const i=+src.value;if(st.freq[i]<1||sum(st.freq)<=1)return;st.freq[i]--;st.removed++;render();};
 window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{st=fresh();emit('reset',true);render();};window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{C.preset=preset.value;st=fresh();opts();emit('preset',C.preset);render();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f1612-help',text:'Move one counted observation between classes or lift each bar handle. The bar width stays equal to class width. Its new height is the recalculated frequency density. The red tray removes observations. Arrow keys and the selectors provide keyboard alternatives.'}),H('div',{class:'f1612-form'},[H('label',{},['Lesson',preset]),H('label',{},['From',src]),H('label',{},['To',dst]),transfer,plus,minus,reset]),status);window.NovaLessonComponent?.applyExploreModels();opts();window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:C.preset,frequencies:st.freq.slice(),density:st.freq.map((_,i)=>density(pr(),st.freq,i)),total:sum(st.freq),areas:st.freq.slice()}),select:key=>{preset.value=key;preset.onchange();},set:(i,f)=>{if(i<0||i>=st.freq.length||!Number.isInteger(f)||f<0||f>maxFor(pr(),i))return;st.freq[i]=f;render();},transfer:(a,b)=>{if(a===b||st.freq[a]<1||st.freq[b]>=maxFor(pr(),b))return;st.freq[a]--;st.freq[b]++;render();},reset:()=>{st=fresh();render();}};
}
function challenge(panel,api,stage){const p=pr(),correct=p.frequencies.slice(),state=fresh();let task=0;
 const status=H('p',{class:'f1612-status',role:'status'}),pick=select('Select histogram class',correct.map((_,i)=>[i,range(p,i)])),down=H('button',{class:'nova-btn',text:'Lower frequency'}),up=H('button',{class:'nova-btn primary',text:'Raise frequency'}),reset=H('button',{class:'nova-btn',text:'Reset heights'}),form=H('div',{class:'f1612-form'},[H('label',{},['Adjust class',pick]),down,up,reset]);
 // challenge uses a deliberate frequency mistake; moving a single bar must repair density and area.
 state.freq[1]=Math.min(20,state.freq[1]+2);
 function render(){scene(stage,{phase:9,state,interactive:true,challenge:true,task,pose:task===0?'count':task===1?'ruler':'think',speech:task===0?'One bar is too tall. Drag its handle or change its frequency until its area represents the original observations.':task===1?'The height comes from frequency divided by class width.':'Frequency comes from bar area: height multiplied by width.',update:render});status.textContent=`Frequencies: ${state.freq.join(', ')} · densities: ${state.freq.map((_,i)=>fmt(density(p,state.freq,i))).join(', ')}`;form.style.display=task===0?'flex':'none';}
 function adjust(delta){const i=+pick.value,max=Math.min(20,Math.floor(2.4*width(p,i)));state.freq[i]=Math.min(max,Math.max(0,state.freq[i]+delta));render();}
 down.onclick=()=>adjust(-1);up.onclick=()=>adjust(1);reset.onclick=()=>{state.freq=correct.slice();state.freq[1]+=2;render();};
 panel.append(H('p',{class:'f1612-help',text:'Restore the incorrect histogram height by dragging its handle or using the keyboard controls. Then calculate density and reconstruct frequency from a rectangle’s area.'}),form,status);
 const k=1,j=2,dk=density(p,correct,k),dj=density(p,correct,j);
 const questions=[
  {q:`One bar is too high. Restore the original histogram so that every class has the intended frequency and its correct density.`,build:()=>()=>state.freq.every((v,i)=>v===correct[i]),check:v=>[v===true,v?'Correct. Every histogram area matches its frequency.':'Only one bar was changed. Check its class width and restore the frequency before calculating density.'],hint:`Class ${range(p,k)} contains ${correct[k]} observations across a width of ${width(p,k)}.`,solve:()=>{state.freq=correct.slice();render();}},
  {q:`Class ${range(p,k)} contains ${correct[k]} observations and has width ${width(p,k)}. What is its frequency density?`,build:NOVA.entryTask('Frequency density',ID),check:v=>{const ok=Number.isFinite(v)&&Math.abs(v-dk)<.011;return [ok,ok?`Correct: ${correct[k]} ÷ ${width(p,k)} = ${fmt(dk)}.`:v===correct[k]?'That is frequency. Histogram height is frequency divided by class width.':'Divide the class frequency by its width, not the other way round.'];},hint:'Frequency density = frequency ÷ class width.',solve:()=>{}},
  {q:`Class ${range(p,j)} has density ${fmt(dj)} and width ${width(p,j)}. What frequency does its area represent?`,build:NOVA.entryTask('Frequency from area',ID),check:v=>{const ok=v===correct[j];return [ok,ok?`Correct: ${fmt(dj)} × ${width(p,j)} = ${correct[j]} observations.`:v===dj?'That is only the height. Multiply by the class width to get frequency.':'Histogram area = class width × frequency density.'];},hint:'Multiply frequency density by class width, not by the total number of classes.',solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,questions,i=>{task=i;render();},C);render();
 C._challengeState=()=>({preset:C.preset,task,frequencies:state.freq.slice(),correct:correct.slice(),density:dk,area:correct[j]});
}
const DEF={id:ID,title:'Histogram',config:C,steps:STEPS,render:watch,alt:'A large neon histogram with unequal class widths, density y axis, touching bars and editable bar heights. Class table and live frequency calculations.',staticAlt:'Histogram area represents frequency. Frequency density = frequency / class width. Continuous class intervals are adjacent on one numeric axis.',exploreIntro:'Move frequencies between unequal-sized classes and adjust histogram bar heights. Notice how width and height combine to determine frequency.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·12',title:'Histogram',def:DEF,years:'Year 8 and Year 9 KS3; GCSE foundation and higher extensions.',linked:['F0-02','F0-03','F0-04','F16-02','F16-09'],spec:{purpose:'Build histograms with unequal-width continuous classes; understand why frequency density is height and area is frequency.',params:'3 lesson datasets; continuous class boundaries, 4 unequal-width intervals, whole-number frequencies, interactive density-linked heights.',presets:'Y8-064 grouped frequency tables; Y8-065 grouped mean estimates; Y9-047 grouped representations.',steps:'Collect → class boundaries → frequencies → widths → density → adjoining bars → area → comparison → explanation.',interactions:'Core NOVA.svgDrag frequency tokens, bar handles and red removal zone; re-grab, cancel, arrow keys, selector buttons.',traps:'Mistaking bar height for frequency; drawing gaps; treating all classes as equal widths; using frequency rather than density on the vertical scale.',gcse:'Unequal-class-width histograms and reconstructing frequencies from areas.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
