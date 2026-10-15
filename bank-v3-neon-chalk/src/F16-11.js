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

/* F16-11 Two-Way Tables · exact SHA-pinned canonical NOVA shared runtime. */
(function(){'use strict';
const H=NOVA.h,ID='F16-11',E=NOVA.svg.el;
const C=window.NovaV2Integration.configuration(window.NOVA_F16_11_CONFIG={preset:'y8-table',events:['value','cell','preset','mode','step','correct','hintUsed','reset'],presets:{
 'y7-probability':{lesson:'Y7-077',label:'Y7-077 · Probability tables',title:'Travel to school',context:'Students in two classes recorded whether they travelled by bus or walked.',rows:['Class A','Class B'],cols:['Bus','Walk'],counts:[[12,8],[6,14]],question:{type:'joint',row:0,col:0,description:'Class A AND travelled by bus'}},
 'y8-table':{lesson:'Y8-067',label:'Y8-067 · Two-way tables',title:'After-school activities',context:'Two classes recorded their choice of after-school activities.',rows:['Class A','Class B'],cols:['Art','Sport','Music'],counts:[[14,6,5],[8,12,10]],question:{type:'conditional',row:1,col:2,description:'chose Music, among Class B'}}
}});
const STEPS=[
 {name:'Collect two features',pose:'count',narration:'Each observation tells us two things. We sort each person by one row category and one column category.',prompt:'Which two categories describe every observation?'},
 {name:'Build crossed headings',pose:'ruler',narration:'Use row headings for one feature and column headings for the other. Each cell is the intersection of both.',prompt:'Where does a student matching the first row and first column belong?'},
 {name:'Count the first intersections',pose:'point-down',narration:'The inside entries count people who match both the row and column labels.',prompt:'What does the top-left cell tell us?'},
 {name:'Fill all interior cells',pose:'count',narration:'Every observation enters one interior cell only. Do not put a person into two cells.',prompt:'How many interior cells should hold counts?'},
 {name:'Add row totals',pose:'point-right',narration:'Add across each row. A row total counts every person in that row category.',prompt:'How many are in Class A altogether?'},
 {name:'Add column totals',pose:'compare',narration:'Add down each column. This total counts everyone in a column category, across classes.',prompt:'What is the total for the first activity or journey type?'},
 {name:'Check the grand total',pose:'think',narration:'The sum of row totals equals the sum of column totals, and both equal the grand total.',prompt:'Are the two methods giving the same grand total?'},
 {name:'Read the intersection',pose:'point-down',narration:'For an AND question, locate the matching cell at the intersection, not an entire row or column.',prompt:'Which cell matches both conditions?'},
 {name:'Choose the denominator',pose:'idea',narration:'For a joint probability from everyone, divide by the grand total. For a conditional fraction among one class, divide by that class total.',prompt:'What group is the denominator counting?'},
 {name:'Explain and check',pose:'celebrate',narration:'A clear two-way table connects the inside counts to the row, column and grand totals. Always state which group a fraction describes.',prompt:'How can you check that nobody has been counted twice?'}
];
const p=()=>C.presets[C.preset],clone=a=>a.map(r=>r.slice()),fresh=()=>({counts:clone(p().counts),removed:0}),sum=a=>a.reduce((v,x)=>v+x,0),rows=m=>m.map(sum),cols=m=>m[0].map((_,j)=>sum(m.map(r=>r[j]))),total=m=>sum(rows(m)),fmt=v=>String(v);
const emit=(key,value)=>NOVA.events.emit('value',{engine:ID,key,value});
const txt=(v,x,y,t,role='given',size=27,anchor='middle')=>NOVA.chalkText(v,x,y,String(t),{role,size,anchor});
const bx=(v,x,y,w,h,role='given',radius=11)=>NOVA.neonBox(v,x,y,w,h,{role,r:radius});
const ln=(v,x1,y1,x2,y2,role='given',width=3)=>NOVA.neonLine(v,x1,y1,x2,y2,{role,width});
const layout=()=>innerWidth<=540?{mobile:true,W:450,H:883,table:{x:24,y:157,w:402,labelW:112,headH:65,rowH:112,footH:78},remove:{x:307,y:720,w:119,h:63},tray:{x:24,y:716,w:270,h:73}}:{mobile:false,W:790,H:772,table:{x:44,y:151,w:702,labelW:154,headH:76,rowH:112,footH:83},remove:{x:586,y:653,w:154,h:67},tray:{x:52,y:646,w:509,h:78}};
function header(v,l,pr){txt(v,l.W/2,43,pr.title,'focus',l.mobile?36:39);txt(v,l.W/2,85,pr.lesson+' · two categories per observation','given',l.mobile?22:28);}
function originScene(v,l,pr){txt(v,l.W/2,143,`Sample observations (${Math.min(3*pr.cols.length*2,total(pr.counts))} of ${total(pr.counts)})`,'focus',l.mobile?26:34);
 const cards=[],seq=pr.counts.flatMap((row,i)=>row.flatMap((v,j)=>Array.from({length:Math.min(v,3)},()=>({i,j}))));
 // Fixed interleaving shows observations in genuinely unsorted category order.
 const order=[];let left=seq.slice(),k=0;while(left.length){k=(k+7)%left.length;order.push(left.splice(k,1)[0]);}
 const n=order.length,per=l.mobile?3:5,cw=l.mobile?128:132,ch=57,space=9,baseX=(l.W-per*(cw+space)+space)/2,y0=l.mobile?202:192;
 order.forEach((d,i)=>{const x=baseX+(i%per)*(cw+space),y=y0+Math.floor(i/per)*67;bx(v,x,y,cw,ch,i%2?'focus':'given',12);txt(v,x+cw/2,y+22,pr.rows[d.i],'given',l.mobile?21:23);txt(v,x+cw/2,y+47,pr.cols[d.j],'focus',l.mobile?23:25);});
 const y=l.mobile?720:614;bx(v,l.mobile?24:106,y,l.mobile?402:580,100,'result',17);
 txt(v,l.W/2,y+40,'Each record has two features','given',l.mobile?26:31);
 txt(v,l.W/2,y+77,'One observation → one intersection','result',l.mobile?23:28);
}
function paintTable(v,l,o){const pr=p(),m=o.state.counts,n=pr.cols.length,T=l.table,iw=(T.w-T.labelW)/(n+1),x=T.x,y=T.y;
 const phase=o.phase??9,full=o.interactive||o.challenge,visibleInner=full?n*2:phase<2?0:phase===2?Math.min(2,n):n*2,
 showRow=full||phase>=4,showCol=full||phase>=5,showGrand=full||phase>=6;
 let labels={};
 bx(v,x,y,T.labelW,T.headH,'given',13);
 txt(v,x+T.labelW/2,y+T.headH*.43,'Group','given',l.mobile?23:29);
 txt(v,x+T.labelW/2,y+T.headH*.79,'× choice','support',l.mobile?20:24);
 for(let j=0;j<=n;j++){
   const xx=x+T.labelW+j*iw;bx(v,xx,y,iw-3,T.headH,j===n?'result':'focus',11);
   txt(v,xx+(iw-3)/2,y+T.headH*.66,j===n?'Total':pr.cols[j],j===n?'result':'focus',l.mobile?j===n?21:24:28);
 }
 let zones=[];
 for(let i=0;i<2;i++){
   const yy=y+T.headH+i*T.rowH;
   bx(v,x,yy,T.labelW-3,T.rowH-5,'given',13);txt(v,x+(T.labelW-3)/2,yy+T.rowH*.56,pr.rows[i],'given',l.mobile?26:31);
   for(let j=0;j<=n;j++){
     const xx=x+T.labelW+j*iw, w=iw-3, h=T.rowH-5,isTotal=j===n,idx=i*n+j,shown=full||idx<visibleInner;
     bx(v,xx,yy,w,h,isTotal?'result':(i+j)%2?'focus':'given',12);
     const val=isTotal?rows(m)[i]:m[i][j],hide=o.challenge&&o.task===0&&i===0&&j===1;
     let content= isTotal?(showRow?val:'?'):(shown?hide?(o.placed===null?'?':o.placed):val:'·');
     if(hide) {bx(v,xx+7,yy+23,w-17,51,o.placed!==null?'focus':'support',9);}
     const interact= !isTotal && ((o.interactive)||(o.challenge&&hide&&o.placed!==null));
     if(interact){
       const g=E('g',{},v);g.dataset.count=`${i}-${j}`; if(o.challenge)g.dataset.placed='true';
       const xg=xx+w/2,yg=yy+T.rowH*.59;bx(g,xg-25,yg-31,50,53,'focus',11);txt(g,xg,yg+8,content,'focus',l.mobile?32:38);
       g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',o.challenge?`Placed value ${o.placed}. Drag into the red remove zone or press Delete to remove.`:`${pr.rows[i]}, ${pr.cols[j]}: ${val} observations. Drag to another interior cell to transfer one observation. Arrow keys move one; Delete removes one.`);
       NOVA.ui.svgDrag(v,g,{box:{x:xg-27,y:yg-33,w:54,h:57},zones:()=>o.challenge?[{id:'remove',kind:'remove',...l.remove}]:zones.concat([{id:'remove',kind:'remove',...l.remove}]),onDrop:id=>{
          if(o.challenge)return false;
          if(!id.startsWith('cell:'))return false;
          const [a,b]=id.slice(5).split(',').map(Number);
          if((a===i&&b===j)||m[i][j]<1)return false;
          m[i][j]--;m[a][b]++;emit('cell',{from:[i,j],to:[a,b],counts:clone(m)});o.update();return true;
       },onRemove:()=>{
          if(o.challenge){o.setPlaced(null);return;}
          if(m[i][j]<=0||total(m)<=1)return;
          m[i][j]--;o.state.removed++;emit('cell',{removed:[i,j],counts:clone(m)});o.update();
       },removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+l.remove.h/2}});
       g.addEventListener('pointerdown',e=>{try{g.setPointerCapture(e.pointerId)}catch(_){}});
       g.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete'].includes(e.key))return;e.preventDefault();
         if(o.challenge){if(e.key==='Delete')o.setPlaced(null);return;}
         if(e.key==='Delete'){if(m[i][j]>0&&total(m)>1){m[i][j]--;o.state.removed++;o.update();}return;}
         let a=i,b=j;if(e.key==='ArrowUp')a=(i+1)%2;if(e.key==='ArrowDown')a=(i+1)%2;
         if(e.key==='ArrowLeft')b=(j+n-1)%n;if(e.key==='ArrowRight')b=(j+1)%n;
         if((a!==i||b!==j)&&m[i][j]>0){m[i][j]--;m[a][b]++;emit('cell',{from:[i,j],to:[a,b],counts:clone(m)});o.update();}
       });
     }else if(!hide||o.placed===null)txt(v,xx+w/2,yy+T.rowH*.65,content,isTotal?'result':'focus',l.mobile?isTotal?33:37:39);
     if(!isTotal)zones.push({id:`cell:${i},${j}`,kind:'drop',x:xx+5,y:yy+8,w:w-10,h:h-16});
   }
 }
 const fy=y+T.headH+T.rowH*2;
 bx(v,x,fy,T.labelW-3,T.footH,'result',12);txt(v,x+(T.labelW-3)/2,fy+T.footH*.64,'Total','result',l.mobile?29:32);
 const colTotals=cols(m);
 for(let j=0;j<=n;j++){
   const xx=x+T.labelW+j*iw, w=iw-3;bx(v,xx,fy,w,T.footH,j===n?'result':'given',11);
   const vtext=j===n?(showGrand?total(m):'?'):(showCol?colTotals[j]:'?');
   txt(v,xx+w/2,fy+T.footH*.66,vtext,j===n?'result':'given',l.mobile?33:37);
 }
 const lower=fy+T.footH;
 txt(v,l.W/2,lower+(l.mobile?62:65),phase<4&&!full?'Every observation goes into one intersection':phase<7&&!full?'Across = row total · Down = column total':'Row totals = Column totals = Grand total', 'support',l.mobile?22:27);
 if((phase>=7||full)&&!(o.challenge&&o.task===0)){
 const question=pr.question;const ix=question.row*n+question.col,cellX=x+T.labelW+question.col*iw,cellY=y+T.headH+question.row*T.rowH;
 // Single precise intersection highlight, no second apparatus frame.
 NOVA.neonRing(v,cellX+iw-19,cellY+19,{role:'result',r:7});
 }
 return zones;
}
function extra(v,l,o){const t=l.table,fy=t.y+t.headH+t.rowH*2+t.footH,pr=p(),m=o.state.counts,totalN=total(m),phase=o.phase??9;
 const y=l.mobile?661:597;
 if(o.interactive||o.challenge){bx(v,l.remove.x,l.remove.y,l.remove.w,l.remove.h,'error',12);txt(v,l.remove.x+l.remove.w/2,l.remove.y+25,'REMOVE','error',l.mobile?21:26);txt(v,l.remove.x+l.remove.w/2,l.remove.y+51,'−1','error',l.mobile?24:28);}
 else if(phase>=6){txt(v,l.W/2,y+12,`Total observations: ${totalN}`,'result',l.mobile?30:33);}
 if(o.interactive&&l.mobile){txt(v,l.W/2,838,'Drag a cell tile to transfer one observation.','given',22);}
}
function optionTray(v,l,o){const pr=p(),loc=l.tray;
 bx(v,loc.x,loc.y,loc.w,loc.h,'given',12);
 if(o.challenge&&o.task===0){
   txt(v,loc.x+10,loc.y-14,'Place the missing frequency','focus',l.mobile?23:29,'start');
   let choices=pr.lesson==='Y7-077'?[8,12,14]:[6,5,8];const width=l.mobile?72:91,gap=l.mobile?8:14,start=loc.x+12;
   choices.forEach((val,k)=>{if(o.placed!==null)return;const xx=start+k*(width+gap),yy=loc.y+13,g=E('g',{},v);g.dataset.option=String(val);
      bx(g,xx,yy,width,loc.h-25,'given',11);txt(g,xx+width/2,yy+34,val,'given',l.mobile?29:35);
      g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`Frequency card ${val}. Drag into the empty cell, or press Enter to place.`);
      const cx=l.table.x+l.table.labelW+(1.5)*(l.table.w-l.table.labelW)/(pr.cols.length+1),cy=l.table.y+l.table.headH+l.table.rowH*.55;
      const zone={id:'missing',kind:'drop',x:cx-36,y:cy-50,w:72,h:95};
      NOVA.ui.svgDrag(v,g,{box:{x:xx,y:yy,w:width,h:loc.h-25},zones:()=>[zone],onDrop:id=>{if(id!=='missing')return false;o.setPlaced(val);return true;}});
      g.addEventListener('pointerdown',e=>{try{g.setPointerCapture(e.pointerId)}catch(_){}});
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.setPlaced(val);}});
   });
 }else txt(v,loc.x+loc.w/2,loc.y+43,o.challenge?'Answer below to continue':'Live interior cells','focus',l.mobile?22:28);
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';const pr=p(),l=layout(),st=o.state||fresh(),phase=o.phase??9;
 NOVA.cap(stage,pr.context,`${pr.lesson} · TWO-WAY TABLES`);
 const sv=NOVA.svg.root(l.W,l.H,'A two-way table with two row categories, two or three column categories, marginal totals, a grand total and draggable inner frequencies.');sv.classList.add('f1611-svg');
 header(sv,l,pr);
 if(phase===0&&!o.interactive&&!o.challenge)originScene(sv,l,pr);
 else{paintTable(sv,l,{...o,state:st,phase});extra(sv,l,{...o,state:st,phase});if(o.interactive||o.challenge)optionTray(sv,l,{...o,state:st,phase});}
 stage.append(sv);
 const chips=H('div',{class:'f1611-chips'});
 if(phase>=6||o.interactive||o.challenge){chips.append(NOVA.neonTile(`Grand total: ${total(st.counts)}`,{role:'result'}));}
 if((phase>=7||o.interactive)&&!o.challenge){let q=pr.question;chips.append(NOVA.neonTile(`${pr.rows[q.row]} & ${pr.cols[q.col]}: ${st.counts[q.row][q.col]}`,{role:'focus'}));}
 stage.append(chips);
 NOVA.scene.helperStrip(stage,o.pose||'count',o.speech||'Find the intersection. The row and column totals must agree with the grand total.');return sv;
}
function watch(i,stage){scene(stage,{phase:i,state:fresh(),pose:STEPS[i].pose,speech:STEPS[i].narration});}
function selection(label,items){const e=H('select',{class:'nova-input','aria-label':label});items.forEach(([v,t])=>e.append(H('option',{value:String(v),text:t})));return e;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let st=fresh();window.NovaLessonComponent?.applyExploreModels();const pre=selection('Lesson preset',Object.entries(C.presets).map(([key,v])=>[key,v.label])),from=selection('From cell',[]),to=selection('To cell',[]),trans=H('button',{class:'nova-btn primary',text:'Transfer one'}),add=H('button',{class:'nova-btn',text:'Add one'}),del=H('button',{class:'nova-btn',text:'Remove one'}),reset=H('button',{class:'nova-btn',text:'Reset table'}),status=H('p',{class:'f1611-status',role:'status'});window.NovaLessonComponent?.applyExploreModels();pre.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();function cells(){from.innerHTML='';to.innerHTML='';p().rows.forEach((row,i)=>p().cols.forEach((col,j)=>{let v=`${i},${j}`,label=`${row} · ${col}`;from.append(H('option',{value:v,text:label}));to.append(H('option',{value:v,text:label}));}));to.selectedIndex=1;}
 window.NovaLessonComponent?.applyExploreModels();function parse(val){return val.split(',').map(Number);}
 window.NovaLessonComponent?.applyExploreModels();function render(){scene(stage,{phase:9,state:st,interactive:true,pose:'point-down',speech:'Drag a count into another intersection to move one observation. Watch the row, column and grand totals recalculate.',update:render});let m=st.counts;status.textContent=`Rows: ${rows(m).join(', ')} · Columns: ${cols(m).join(', ')} · Grand total: ${total(m)}.`;}
 window.NovaLessonComponent?.applyExploreModels();function move(){let [a,b]=parse(from.value),[c,d]=parse(to.value);if((a===c&&b===d)||st.counts[a][b]===0){status.textContent='Choose different cells, with at least one observation in the source.';return;}st.counts[a][b]--;st.counts[c][d]++;emit('cell',{from:[a,b],to:[c,d],counts:clone(st.counts)});render();}
 window.NovaLessonComponent?.applyExploreModels();trans.onclick=move;window.NovaLessonComponent?.applyExploreModels();add.onclick=()=>{let [i,j]=parse(to.value);st.counts[i][j]++;emit('cell',{added:[i,j]});render();};window.NovaLessonComponent?.applyExploreModels();del.onclick=()=>{let [i,j]=parse(from.value);if(st.counts[i][j]<1||total(st.counts)<=1)return;st.counts[i][j]--;st.removed++;emit('cell',{removed:[i,j]});render();};window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{st=fresh();emit('reset',true);render();};window.NovaLessonComponent?.applyExploreModels();pre.onchange=()=>{C.preset=pre.value;st=fresh();cells();emit('preset',C.preset);render();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f1611-help',text:'Move a glowing interior count to another cell to transfer exactly one person; row and column totals change automatically. Drag to red Remove to take one out of the dataset. Arrow keys, Delete and selectors offer keyboard alternatives.'}),H('div',{class:'f1611-controls'},[H('label',{},['Lesson',pre]),H('label',{},['From cell',from]),H('label',{},['To cell',to]),trans,add,del,reset]),status);window.NovaLessonComponent?.applyExploreModels();cells();window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:C.preset,counts:clone(st.counts),rows:rows(st.counts),columns:cols(st.counts),total:total(st.counts),removed:st.removed}),select:key=>{pre.value=key;pre.onchange();},move:(a,b,c,d)=>{if((a===c&&b===d)||st.counts[a][b]<1)return;st.counts[a][b]--;st.counts[c][d]++;render()},reset:()=>{st=fresh();render()}};
}
function fractionBuild(ctl){const box=H('div',{class:'f1611-frac-answer'}),numer=H('input',{type:'number',min:'0',step:'1','aria-label':'Fraction numerator'}),denom=H('input',{type:'number',min:'1',step:'1','aria-label':'Fraction denominator'});
 const stack=H('div',{class:'f1611-stacked'});stack.append(numer,H('div',{class:'bar'}),denom);box.append(H('span',{class:'f1611-answer-text',text:'Enter a numerator above a denominator:'}),stack);ctl.append(box);return ()=>({numerator:Number(numer.value),denominator:Number(denom.value),both:numer.value.trim()!==''&&denom.value.trim()!==''});}
function challenge(panel,api,stage){const pr=p(),ref=fresh(),answer=ref.counts[0][1];let task=0,placed=null;
 const status=H('p',{class:'f1611-status',role:'status'}),options=selection('Missing cell frequency',pr.lesson==='Y7-077'?[[8,'8'],[12,'12'],[14,'14']]:[[6,'6'],[5,'5'],[8,'8']]),place=H('button',{class:'nova-btn primary',text:'Place selected card'}),clear=H('button',{class:'nova-btn',text:'Remove card'}),controls=H('div',{class:'f1611-controls'},[H('label',{},['Missing frequency card',options]),place,clear]);
 panel.append(H('p',{class:'f1611-help',text:'Complete the missing intersection using row and column totals. Drag the value card onto the outlined cell, or use the keyboard selector. Then read a marginal total and write a mathematical probability using the stacked fraction fields.'}),controls,status);
 function setPlaced(v){placed=v;emit('cell',{placed:v});render();}
 function render(){scene(stage,{phase:9,state:ref,challenge:true,task,placed,setPlaced,pose:task===0?'count':task===1?'compare':'think',speech:task===0?'Use a row total minus the other entries to find the missing intersection.':task===1?'For this total, count down the relevant column.':'Decide whether the denominator is the grand total or only the stated class.',update:render});controls.style.display=task===0?'flex':'none';status.textContent=task===0?placed===null?'Place one card in the missing intersection.':`You placed ${placed}. Check against the row and column totals.`:task===1?'Read the complete marginal total from the table.':'Enter the fraction using its numerator and denominator boxes.';}
 place.onclick=()=>setPlaced(+options.value);clear.onclick=()=>setPlaced(null);
 const targetColumn=pr.lesson==='Y7-077'?0:2,answerTotal=cols(ref.counts)[targetColumn],q=pr.question,num=ref.counts[q.row][q.col],den=q.type==='joint'?total(ref.counts):rows(ref.counts)[q.row];
 const quests=[
 {q:`The ${pr.rows[0]} × ${pr.cols[1]} intersection is missing. Drag or select its frequency using the given totals.`,build:()=>()=>placed,check:v=>[v===answer,v===answer?`Correct. The missing cell is ${answer}; the row and column totals agree.`:v===null?'Place a frequency card first.':`That value makes the row or column total inconsistent. Subtract the known entries from the appropriate total.`],hint:`${pr.rows[0]} has ${rows(ref.counts)[0]} altogether. Subtract the other counts in that row.`,solve:()=>setPlaced(answer)},
 {q:`How many students are in the ${pr.cols[targetColumn]} column altogether?`,build:NOVA.entryTask(`${pr.cols[targetColumn]} column total`,ID),check:v=>[v===answerTotal,v===answerTotal?`Correct: ${answerTotal} across both classes.`:v===ref.counts[0][targetColumn]||v===ref.counts[1][targetColumn]?'That is one cell. Add both class counts in this column.':'Add down the column, not across a row.'],hint:'Column totals are found by adding down through both rows.',solve:()=>{}},
 {q:q.type==='joint'?`Write the probability that a randomly chosen student is in ${pr.rows[q.row]} AND chose ${pr.cols[q.col]}.`:`Among ${pr.rows[q.row]} only, what fraction chose ${pr.cols[q.col]}?`,build:ctl=>fractionBuild(ctl),check:v=>{if(!v.both||!Number.isInteger(v.numerator)||!Number.isInteger(v.denominator)||v.denominator<=0)return [false,'Enter whole-number numerator and a positive denominator.'];const ok=v.numerator*den===num*v.denominator&&v.numerator<=v.denominator;return [ok,ok?'Correct. The numerator is the intersection, and the denominator is the stated sample group. Equivalent fractions are accepted.':v.numerator===num&&v.denominator===(q.type==='joint'?rows(ref.counts)[q.row]:total(ref.counts))?'You have used the wrong denominator: check whether the question means everyone or only the stated class.':'Find the intersection count for the numerator, then choose the correct total for the denominator.'];},hint:q.type==='joint'?'The word AND picks a cell. A randomly chosen student from everyone uses the grand total as denominator.':'Among Class B means the Class B row total is the denominator, not the grand total.',solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,quests,k=>{task=k;render()},C);
 C._challengeState=()=>({preset:C.preset,task,placed,correctMissing:answer,columnTotal:answerTotal,probability:{numerator:num,denominator:den},rows:rows(ref.counts),columns:cols(ref.counts),grand:total(ref.counts)});
}
const DEF={id:ID,title:'Two-Way Tables',config:C,steps:STEPS,render:watch,alt:'Illuminated two-way classification table, row totals, column totals, grand total, draggable interior frequencies, a missing-cell card and an accessible stacked fraction answer.',staticAlt:'Each observation belongs in one intersection cell. Add across for row totals, down for column totals. Joint probability uses the grand total; conditional probability uses the group being conditioned on.',exploreIntro:'Move counted observations between cell intersections, use the totals to check consistency, then distinguish joint and conditional proportions.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·11',title:'Two-Way Tables',def:DEF,years:'KS3 Year 7 and Year 8; GCSE extension.',linked:['F0-02','F0-04','F0-05','F0-15','F16-01','F16-09'],spec:{purpose:'Organise two categorical variables into a cross-tabulation and reason from intersection counts, row/column totals and probabilities.',params:'Two row categories, 2–3 column categories, editable whole-number frequencies, live marginal and grand totals, joint/conditional fractional reads.',presets:'Y7-077 probability from two-way tables; Y8-067 construction and interpretation.',steps:'Collected observations → crossed headings → interior counts → row totals → column totals → grand total → intersection → denominator → explanation.',interactions:'NOVA.ui.svgDrag interior frequency tokens and removable missing-frequency cards; safe transfer, re-grabbing, removal, keyboard arrows and selector equivalents.',traps:'Using a marginal total instead of intersection, counting a record twice, confusing row and column totals, choosing the grand total for a conditional question.',gcse:'Joint and conditional relative frequencies with equivalent fractions and an explicit sample space.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
