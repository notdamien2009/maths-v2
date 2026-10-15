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

/* NOVA F3-03 — partitioned grid; fresh Oct 10 master; mathematically complete interactive studio.
   No author-defined SVG filters, primitives or fonts: all drawings use the canonical F0 house core. */
const F303_CONFIG={id:'F3-03',startMode:'watch',preset:'Y7-009-whole',
 presets:{
  'Y7-009-whole':{label:'Year 7 · whole numbers',a:23,b:14,partitionA:[20,3],partitionB:[10,4]},
  'Y7-009-decimals':{label:'Year 7 · tenths',a:2.3,b:1.4,partitionA:[2,.3],partitionB:[1,.4]},
  'Y7-009-large':{label:'Year 7 · larger factors',a:37,b:26,partitionA:[30,7],partitionB:[20,6]},
  'Y7-009-decimal-and-whole':{label:'Year 7 · decimal × whole',a:3.6,b:12,partitionA:[3,.6],partitionB:[10,2]}
 },
 events:{value:['preset','factorA','factorB','partsA','partsB','selectedCard','placedCell','removedCell','answer','challengeTask'],types:['step','correct','hintUsed','mode']},
 challenge:{tasks:['whole','tenths','decimal-and-whole']}
};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F303_CONFIG),id=C.id;
function corePose(p){
 // F0 owns the helper art, placement and motion. Only its universal slots are supplied to its dock.
 const slots=['idle','think','cheer','oops','point','explain','walk','leap'];
 const map={'ruler':'point','point-left':'point','point-right':'point','point-down':'point','show-one':'point','show-two':'point','show-three':'point','count':'point','magnify':'think','idea':'think','compare':'think','high-five':'cheer','celebrate':'cheer','success':'cheer','read-tablet':'think','checking':'think','not-yet':'oops','question':'think','encourage':'cheer'};
 return slots.includes(p)?p:(map[p]||'explain');
}
const fmt=n=>String(Number(Number(n).toFixed(7))),eq=(a,b)=>Math.abs(Number(a)-Number(b))<1e-7;
const copy=o=>JSON.parse(JSON.stringify(o));
function math(p){const xs=p.partitionA,ys=p.partitionB; if(!xs||!ys||xs.length!==2||ys.length!==2)throw Error('Two partitions on each factor required');
 const A=+(xs[0]+xs[1]).toFixed(8),B=+(ys[0]+ys[1]).toFixed(8),products=[ys[0]*xs[0],ys[0]*xs[1],ys[1]*xs[0],ys[1]*xs[1]].map(v=>+v.toFixed(8));
 const sums=[+(products[0]+products[1]).toFixed(8),+(products[2]+products[3]).toFixed(8)];const total=+(sums[0]+sums[1]).toFixed(8);
 if(!(A>0&&B>0)||!eq(A,p.a)||!eq(B,p.b)||!eq(A*B,total))throw Error('Grid partition does not reconstruct both factors');
 return {headers:[...xs,...ys],products,rowSums:sums,total,A,B};}
window.F303_MATH={compute:math,fmt,validPartition:p=>{try{math(p);return true;}catch(e){return false;}}};
function event(key,v){if(!C.events.value.includes(key))throw Error('Undeclared F3-03 value event '+key);N.events.emit('value',{engine:id,key,value:v});}
function text(g,x,y,v,size=30,role='given'){return N.chalkText(g,x,y,String(v),{size,role});}
function box(g,x,y,w,h,role='given'){return N.neonBox(g,x,y,w,h,{role,r:14});}
function chip(g,x,y,v,role='given',w=105,h=56){const a=box(g,x,y,w,h,role);text(a,x+w/2,y+h/2+11,v,30,role);return a;}
const POS=[
 {x:272,y:116,w:159,h:78,kind:'header',name:'first top header'},
 {x:441,y:116,w:159,h:78,kind:'header',name:'second top header'},
 {x:116,y:209,w:141,h:139,kind:'header',name:'top left header'},
 {x:116,y:360,w:141,h:139,kind:'header',name:'bottom left header'},
 {x:272,y:209,w:159,h:139,kind:'product',name:'top-left product'},
 {x:441,y:209,w:159,h:139,kind:'product',name:'top-right product'},
 {x:272,y:360,w:159,h:139,kind:'product',name:'bottom-left product'},
 {x:441,y:360,w:159,h:139,kind:'product',name:'bottom-right product'}
];
const SAY={
 'split':{person:'pip',pose:'point-right',say:'Break each factor into tens and ones. The first row will multiply ten by both parts of twenty-three.'},
 'cell-0':{person:'pip',pose:'count',say:'Ten groups of twenty makes two hundred. That product belongs only in the top-left cell.'},
 'cell-1':{person:'nova',pose:'checking',say:'Ten groups of three makes thirty. Both products in this row have a height of ten.'},
 'cell-2':{person:'pip',pose:'show-two',say:'Four groups of twenty makes eighty. We must include this part as well.'},
 'cell-3':{person:'pip',pose:'think',say:'Four groups of three makes twelve. That fourth cell is easily forgotten.'},
 'row-0':{person:'nova',pose:'explain-right',say:'Add across the first row: two hundred and thirty. That is ten times twenty-three.'},
 'row-1':{person:'pip',pose:'idea',say:'The other row gives ninety-two. That is four times twenty-three.'},
 'total':{person:'pip',pose:'celebrate',say:'Add the two row sums, two hundred and thirty and ninety-two. We have proved three hundred and twenty-two.'},
 'explore':{person:'pip',pose:'idea',say:'Change the factors or their splits. Every product cell must recalculate so the four parts still equal the whole.'},
 'challenge':{person:'teen',pose:'think',say:'Place the split numbers into the matching headers, then multiply each row and column pair.'},
 'success':{person:'pip',pose:'celebrate',say:'Every header, product and total agrees. You have proved the multiplication.'}
};
function makeArt(p,opt={}){
 const m=math(p),isChallenge=!!opt.challenge;
 const svg=N.svg.root(740,isChallenge?842:694,'NOVA partitioned multiplication grid: two number partitions along the top and left, four partial product cells, row sums and final whole total.');
 svg.classList.add('f303-art');
 if(window.matchMedia('(max-width:720px)').matches){svg.setAttribute('viewBox',isChallenge?'95 107 622 741':'95 107 622 501');svg.setAttribute('width','622');svg.setAttribute('height',isChallenge?'741':'501');}
 // Every cell and heading uses canonical glass-neon boxes. No custom SVG strokes or filter definitions.
 const role=['given','focus','op','result'];
 const headlineY=95;
 if(opt.showHeaders!==false){text(svg,165,154,'×',48,'op');}
 else text(svg,165,154,'×',48,'op');
 const makeSlot=(j,value,revealed=true)=>{
  const b=POS[j],g=E('g',{'data-slot':String(j),class:'f303-slot','data-filled':isChallenge&&opt.placements?.[j]!=null?'true':'false','role':'button','aria-label':b.name+(revealed?': '+fmt(value):', empty')},svg);
  box(g,b.x,b.y,b.w,b.h,j<4?(j<2?'given':'focus'):role[j-4]);
  if(revealed){text(g,b.x+b.w/2,b.y+b.h/2+12,fmt(value),33,j<4?'given':role[j-4]);}
  else {text(g,b.x+b.w/2,b.y+b.h/2+12,'?',37,'unknown');N.neonRing(g,b.x+b.w/2,b.y+b.h/2+33,{role:'focus',r:5,pulse:false});}
  if(isChallenge){const filled=opt.placements?.[j]!=null;
   g.setAttribute('tabindex',j===(opt.focusSlot??0)?'0':'-1');g.setAttribute('aria-label',b.name+(filled?' filled with '+fmt(value):' empty')+'. Press Enter to place selected card, Delete to remove.');
   g.addEventListener('click',ev=>{ev.stopPropagation();opt.onSlot?.(j);});
   g.addEventListener('keydown',ev=>{if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(ev.key)){ev.preventDefault();let ni=ev.key==='ArrowRight'?(j+1)%8:ev.key==='ArrowLeft'?(j+7)%8:ev.key==='ArrowDown'?(j+2)%8:(j+6)%8;opt.onFocus?.(ni);}
    else if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();opt.onSlot?.(j);}else if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();opt.onRemove?.(j);}});
   N.ui.svgDrag(svg,g,{box:b,zones:()=>[{id:'remove',kind:'remove',x:220,y:772,w:310,h:55}],canStart:()=>filled,onRemove:()=>opt.onRemove?.(j)});
  }
  return g;
 };
 const hvals=m.headers,pr=m.products;
 [0,1,2,3].forEach(j=>makeSlot(j,hvals[j],isChallenge?opt.placements?.[j]!=null:opt.step>=0));
 const revealed=opt.step==null?4:Math.max(0,Math.min(4,opt.step));
 [0,1,2,3].forEach(j=>makeSlot(j+4,pr[j],isChallenge?opt.placements?.[j+4]!=null:j<revealed));
 // Right-hand sum column: its two values are intentionally not a fifth multiplication cell.
 box(svg,614,116,100,78,'support');text(svg,664,166,'Σ',40,'result');
 [0,1].forEach((r)=>{box(svg,614,r===0?209:360,100,139,'support');const visible=isChallenge?[0,1].every(k=>opt.placements?.[4+r*2+k]!=null):opt.step>=5+r;if(visible)text(svg,664,r===0?293:445,fmt(m.rowSums[r]),33,'result');else text(svg,664,r===0?293:445,'·',35,'unknown');});
 box(svg,116,515,598,79,'result');
 text(svg,202,563,'Total',32,'given');
 const showTotal=!isChallenge&&opt.step>=7;
 if(showTotal){N.neonRing(svg,417,555,{role:'result',r:21,pulse:!N.reducedMotion()});text(svg,527,565,fmt(m.total),47,'result');}
 else text(svg,535,564,'?',40,'unknown');
 if(isChallenge){
  const values=[...m.headers,...m.products];
  // Choice tray is part of the mathematical stage: the red strip is the remove target.
  values.forEach((value,i)=>{
   if(Object.values(opt.placements||{}).includes(i))return;
   const col=i%4,row=Math.floor(i/4),x=116+150*col,y=613+73*row;
   const card=E('g',{'data-card':String(i),'class':'f303-source-card','tabindex':'0',role:'button','aria-label':'Select '+(i<4?'header':'partial product')+' '+fmt(value)},svg);
   box(card,x,y,134,60,i<4?'given':role[i-4]);text(card,x+67,y+42,fmt(value),32,i<4?'given':role[i-4]);
   card.addEventListener('click',ev=>{ev.stopPropagation();opt.onSelect?.(i);});
   card.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();opt.onSelect?.(i);}});
   N.ui.svgDrag(svg,card,{box:{x,y,w:134,h:60},zones:()=>POS.map((b,j)=>({id:String(j),kind:'drop',x:b.x,y:b.y,w:b.w,h:b.h})),onDrop:z=>opt.onPlace?.(i,Number(z))||false});
   if(opt.selected===i)N.neonRing(card,x+123,y+8,{role:'focus',r:8,pulse:false});
  });
  box(svg,220,772,310,55,'error');text(svg,375,811,'Remove / undo',29,'error');
 }
 if(opt.animate&&!N.reducedMotion()&&!isChallenge){svg.querySelectorAll('.nv-neon-box').forEach((g,i)=>{if(i>4&&i<18)N.motion.arrive(g,0,-9,250+(i*47),N.motion.ease.back);});}
 return svg;
}
function scene(stage,p,opt={}){
if(window.NovaLessonComponent?.active){[stage,p,opt]=window.NovaLessonComponent.args("scene",arguments);}

 stage.innerHTML='';N.cap(stage,'Grid method',opt.heading||'Every row–column pair creates one partial product');
 const grid=H('div',{class:'f303-scene'}),svg=makeArt(p,opt);grid.appendChild(svg);
 const m=math(p),side=H('aside',{class:'f303-aside'});
 const head=N.neonCard([H('span',{class:'f303-flag',text:'FACTORS'}),H('p',{class:'f303-maths',text:fmt(m.A)+' × '+fmt(m.B)})],{role:'given'});
 const finalChip=opt.step>=7&&!opt.challenge?N.answerChip(fmt(m.total),true):H('p',{class:'f303-maths',text:'Part by part'});
 const result=N.neonCard([H('span',{class:'f303-flag',text:'REBUILD THE PRODUCT'}),finalChip],{role:'result'});
 const why=N.neonCard([H('span',{class:'f303-flag',text:'MATHEMATICAL EVIDENCE'}),H('p',{class:'f303-detail',text:opt.challenge?'Place the headers and products, then calculate the sum.':(opt.step>=7?'The four products: '+m.products.map(fmt).join(' + ')+' = '+fmt(m.total):'Each row adds its two products. The final two row sums make the whole.')})],{role:'op'});
 side.append(head,result,why);grid.appendChild(side);stage.appendChild(grid);
 const s=SAY[opt.stepName]||SAY.explore;N.scene.helperStrip(stage,corePose(opt.success?'cheer':s.pose),opt.helper||s.say);
 return svg;
}
const steps=[
 {name:'split',prompt:'Why do the split numbers still equal each original factor?',narration:'Split twenty-three into twenty and three. Split fourteen into ten and four. The grid headers must rebuild both original factors.'},
 {name:'cell-0',prompt:'Why is the first partial product two hundred?',narration:'Ten times twenty makes two hundred. Put it in the upper-left product cell.'},
 {name:'cell-1',prompt:'Which two parts produce thirty?',narration:'Ten times three makes thirty, completing the first row.'},
 {name:'cell-2',prompt:'Where does eighty come from?',narration:'Four times twenty makes eighty. It belongs in the lower-left cell.'},
 {name:'cell-3',prompt:'Why is twelve essential?',narration:'Four times three makes twelve. All four pairs of parts are now multiplied.'},
 {name:'row-0',prompt:'What is the sum across row one?',narration:'Across the upper row, two hundred plus thirty equals two hundred and thirty.'},
 {name:'row-1',prompt:'How does the second row contribute?',narration:'Across the lower row, eighty plus twelve equals ninety-two.'},
 {name:'total',prompt:'Why does adding the two row sums give the correct answer?',narration:'Two hundred and thirty plus ninety-two equals three hundred and twenty-two. The grid method accounts for every partial product.'}
];
const btn=(t,f,kind='nova-btn')=>H('button',{text:t,class:kind,onclick:f});
const def={id,title:'Partitioned grid method',config:C,steps,
 alt:'Neon and chalk partitioned multiplication grid with header row, left header column, four partial products, row sum column and final total.',
 staticAlt:'23 × 14 = (20 + 3)(10 + 4): 200 + 30 + 80 + 12 = 230 + 92 = 322.',
 render(i,stage){const p=copy(C.presets['Y7-009-whole']);scene(stage,p,{step:i,stepName:steps[i].name,animate:true,heading:i===0?'Split both factors into equal-place parts':i<5?'Multiply the row and column headers':'Add the products: row sums, then total'});},
 exploreIntro:'Choose whole-number or decimal factors. Adjust their partitions and watch every grid product recalculate.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let key='Y7-009-whole',p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",(...a)=>copy(...a),[C.presets[key]]):(copy(C.presets[key])));window.NovaLessonComponent?.applyExploreModels();const intro=H('p',{class:'f303-prompt',text:'Choose factors and friendly partitioned parts, then prove all four products.'}),sel=H('select',{'aria-label':'Grid preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,v])=>sel.add(new Option(v.label,k)));
 window.NovaLessonComponent?.applyExploreModels();const fields=H('div',{class:'f303-inputs'}),bar=H('div',{class:'f303-inputs'}),info=H('p',{class:'f303-info'});
 window.NovaLessonComponent?.applyExploreModels();function render(){fields.innerHTML='';
  const allowDecimal=key.includes('decimal');
  [['a','First factor'],['b','Second factor']].forEach(([k,title])=>{const inp=H('input',{type:'number','aria-label':title,min:'0.1',max:'99.9',step:allowDecimal?'0.1':'1',value:p[k]});inp.onchange=()=>{let v=+(+inp.value).toFixed(1);v=Math.max(allowDecimal?.2:2,Math.min(99.9,v));if(!allowDecimal)v=Math.round(v);p[k]=v;
    const big=allowDecimal?Math.floor(v):Math.floor(v/10)*10;const smaller=+(v-big).toFixed(8);p[k==='a'?'partitionA':'partitionB']=[big||Math.floor(v/2),big?smaller:v-Math.floor(v/2)];if(p[k==='a'?'partitionA':'partitionB'].some(n=>n<=0)){p[k==='a'?'partitionA':'partitionB']=[+(v/2).toFixed(5),+(v/2).toFixed(5)];}
    event(k==='a'?'factorA':'factorB',v);render();};fields.appendChild(H('label',{},[title,inp]));});
  [['partitionA','Top left','Top right','partsA'],['partitionB','Side top','Side bottom','partsB']].forEach(([k,l0,l1,ev])=>{const pair=p[k],orig=k==='partitionA'?p.a:p.b;pair.forEach((v,i)=>{const inp=H('input',{type:'number','aria-label':i===0?l0:l1,min:'0.1',max:orig,step:allowDecimal?'0.1':'1',value:fmt(v)});inp.onchange=()=>{const n=Math.max(.1,Math.min(orig-.1,+inp.value||.1)),x=+(i===0?n:orig-n).toFixed(8);p[k]=i===0?[x,+(orig-x).toFixed(8)]:[+(orig-x).toFixed(8),x];event(ev,p[k]);render();};fields.appendChild(H('label',{},[i===0?l0:l1,inp]));});});
  const m=math(p);info.textContent=fmt(m.products[0])+' + '+fmt(m.products[1])+' + '+fmt(m.products[2])+' + '+fmt(m.products[3])+' = '+fmt(m.total)+'; the partitions still give '+fmt(m.A)+' × '+fmt(m.B)+'.';scene(stage,p,{step:7,stepName:'explore',heading:'Adjust any part — the product must remain consistent'});
 }
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=()=>{key=sel.value;p=copy(C.presets[key]);event('preset',key);render();};window.NovaLessonComponent?.applyExploreModels();bar.append(H('label',{},['Preset / lesson range',sel]));window.NovaLessonComponent?.applyExploreModels();panel.append(intro,bar,fields,info);window.NovaLessonComponent?.applyExploreModels();render();
 },
 challenge(panel,api,stage){let task=0,wrong=0,focusSlot=0,chosen=null,placements={},answerText='';
 const cases=[C.presets['Y7-009-whole'],C.presets['Y7-009-decimals'],C.presets['Y7-009-decimal-and-whole']];
 let message='Select a card. Then select the correct header or product cell—or drag it onto the cell.';
 function fail(msg){wrong++;message=msg;api.check(false,msg,{task,wrong});show();}
 function remove(j){if(placements[j]==null)return;delete placements[j];chosen=null;event('removedCell',j);message='Card returned to the tray. You can move it again.';show();}
 function place(i,j){if(i==null||j<0||j>=8)return false;const p=cases[task],m=math(p),vals=[...m.headers,...m.products];
  if(placements[j]!=null){message='Remove the existing card first (Delete or drag to red Remove).';const status=panel.querySelector('.f303-status');if(status)status.textContent=message;return false;}
  if(!eq(vals[i],vals[j])||(i<4)!==(j<4)){message=j<4?'Check the position: column headers belong across the top, row headers down the left.':'Multiply the value above this cell by the value on its left. This card is not that product.';wrong++;api.check(false,message,{task,wrong});const status=panel.querySelector('.f303-status');if(status)status.textContent=message;return false;}
  Object.keys(placements).forEach(k=>{if(placements[k]===i)delete placements[k];});placements[j]=i;chosen=null;event('placedCell',{slot:j,value:vals[i]});message='Correct placement. Keep going until every cell is filled.';focusSlot=Array.from({length:8},(_,k)=>k).find(k=>placements[k]==null)??0;show();stage.querySelector('[data-slot="'+focusSlot+'"]')?.focus();return true;
 }
 function select(i){chosen=i;event('selectedCard',i);message='Selected '+fmt([...math(cases[task]).headers,...math(cases[task]).products][i])+'. Place it into the corresponding position.';show();stage.querySelector('[data-slot="'+focusSlot+'"]')?.focus();}
 function focus(j){focusSlot=j;show();stage.querySelector('[data-slot="'+j+'"]')?.focus();}
 function check(){const p=cases[task],m=math(p),vals=[...m.headers,...m.products],all=Array.from({length:8},(_,i)=>placements[i]!=null&&eq(vals[placements[i]],vals[i])&&((placements[i]<4)===(i<4))).every(Boolean);if(!all){fail('Fill all four number headers and all four partial-product cells before calculating the final total.');return;}
  if(!eq(+answerText,m.total)||!answerText.trim()){fail('The headers and products are correct. Add the two row sums: '+fmt(m.rowSums[0])+' + '+fmt(m.rowSums[1])+' = ?');return;}
  api.check(true,'The factor headers, four products and the total all match.',{task});
  if(task===2){panel.innerHTML='';scene(stage,p,{step:7,stepName:'success',success:true,helper:'Three proofs completed, including decimal place value. Every cell agrees with the total.'});panel.append(H('h3',{text:'Three complete grid proofs'}),H('p',{text:'You correctly partitioned both factors, multiplied every row-column pair and added the partial products.'}),H('span',{class:'f303-badge',text:'Multiplicative structure mastered'}));return;}
  task++;event('challengeTask',task);wrong=0;focusSlot=0;chosen=null;placements={};answerText='';message='New proof. Start with the header cards.';show();
 }
 function show(){const p=cases[task],m=math(p);panel.innerHTML='';const titles=['Whole numbers · 23 × 14','Tenths · 2.3 × 1.4','Decimal × whole · 3.6 × 12'];
  panel.append(H('p',{class:'f303-prompt',text:'Proof '+(task+1)+' / 3 · '+titles[task]}),H('p',{class:'f303-info',text:'First place the two top headers and two left headers. Then drag each partial product into its matching grid cell. Use Enter to place, arrow keys to move between cells and Delete to undo.'}));
  const inp=H('input',{type:'text','aria-label':'Final total','placeholder':'Final total',value:answerText});inp.oninput=()=>{answerText=inp.value;event('answer',answerText);};
  const line=H('div',{class:'f303-inputs'},[H('label',{},['Whole answer',inp]),btn('Check proof',check,'nova-btn primary'),btn('Hint',()=>{api.hint(task===1?'For tenths: 0.3 × 0.4 = 0.12, not 1.2.':'Each cell multiplies one top header by one left header. Add all four cells to finish.');message='Check the headers before doing the arithmetic.';show();})]);
  panel.append(line,H('p',{class:'f303-status',role:'status',text:message}));scene(stage,p,{challenge:true,stepName:'challenge',placements,selected:chosen,focusSlot,heading:'Build the complete multiplication proof',onSelect:select,onSlot:j=>place(chosen,j),onPlace:place,onRemove:remove,onFocus:focus});
 }
 event('challengeTask',task);show();
 },onRestore(){}
};
N.registry.add({id,title:def.title,topics:['grid method','multiplication','decimals','place value'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(id,def,{models:{},tables:{"POS":()=>POS,"steps":()=>steps},draws:{"scene":["stage","p","opt"]},exploreFields:{"p":{"kind":"factory","factory":"copy","argCount":1}}});
N.bankMount({id,num:'03',title:'Partitioned grid method · Premium Review',def,linked:['F3-01','F3-02','F2-03'],years:'KS3 Year 7, with Years 8–9 consolidation',spec:{
 purpose:'Show how splitting both factors makes four smaller multiplications and the row sums reconstruct the product.',
 params:'Whole or decimal factors; two partition parts per factor; four partial products, two row sums and total.',
 presets:'One curriculum-linked Y7-009 group with four named reusable contexts: whole, tenths, larger whole numbers, mixed decimal × whole.',
 steps:'Split headers → four cell products, one at a time → first row sum → second row sum → answer chip.',
 interactions:'Four editable factors/partition controls in Explore; eight draggable cards in Challenge; green correct drop, spring-back on incorrect drop, red remove tray, keyboard equivalent and roving focus.',
 traps:'Omitting cross products, swapping header positions, adding rather than multiplying, placing decimal digits incorrectly and overlooking the second row.',
 gcse:'Place-value groundwork for polynomial multiplication; algebra is intentionally handled by F3-02/F7 rather than invented here.'
}});
// F2 pointer capture edge case: forward native pointer release to canonical drag controller.
window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(d?.captured&&d.el?.isConnected&&document.getElementById(id)?.contains(d.el)&&!d.el.contains(e.target))d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons,bubbles:false}));});
window.addEventListener('pointerup',e=>{const d=N.ui._drag;if(d?.el&&document.getElementById(id)?.contains(d.el)){if(!d.el.contains(e.target))d.up(e);if(N.ui._drag)N.ui.cancelDrag();}});
window.addEventListener('pointercancel',()=>{if(N.ui._drag?.el&&document.getElementById(id)?.contains(N.ui._drag.el))N.ui.cancelDrag();});
const card=document.getElementById(id),dev=H('details',{class:'nv-dev'});dev.appendChild(H('summary',{text:'Developer: component specification'}));[...card.querySelectorAll('details.nova-spec,p.purpose')].forEach(x=>dev.appendChild(x));card.appendChild(dev);
let hh=card.querySelector('h3');if(hh)hh.textContent='Interactive mathematics';
function bobAlt(){card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.alt='Sir Bob Maximus, mathematics tutor';});}bobAlt();new MutationObserver(bobAlt).observe(card,{childList:true,subtree:true});
})();
