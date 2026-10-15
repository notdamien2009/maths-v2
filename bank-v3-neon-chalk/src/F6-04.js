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

/* NOVA F6-04 · Simplifying Ratios · Uses original F0 core without modifying it. */
const F604_CONFIG={
 id:'F6-04',startMode:'watch',preset:'Y7-058',
 parameters:{ratioA:6,ratioB:9,stage:'group/collapse/verify',positiveValues:true,decimalAndFractionPresets:true},
 presets:{
 'Y7-058':{label:'Y7-058 · Counters 6 : 9',context:'Six blue counters to nine teal counters.',display:['6','9'],raw:[6,9],whole:[6,9],clear:1,units:'counters',lesson:'Y7-058'},
 'Y7-058-extend':{label:'Y7-058 · Bundles 12 : 18',context:'Twelve blue counters to eighteen teal counters.',display:['12','18'],raw:[12,18],whole:[12,18],clear:1,units:'counters',lesson:'Y7-058'},
 'Y8-034-decimals':{label:'Y8-034 · Decimals 1.5 : 2.25',context:'A decimal ratio of one point five to two point two five.',display:['1.5','2.25'],raw:[1.5,2.25],whole:[6,9],clear:4,units:'quantities',lesson:'Y8-034'},
 'Y8-034-fractions':{label:'Y8-034 · Fractions ¾ : ½',context:'A ratio of three quarters to one half.',display:['3/4','1/2'],raw:[0.75,0.5],whole:[3,2],clear:4,units:'fraction units',lesson:'Y8-034'}
 },
 events:{values:['preset','lasso','ratioDrop','ratioRemove','answer','hint','reset','stage'],types:['value','step','correct','hintUsed']}
};window.F604_CONFIG=F604_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=window.NovaV2Integration.configuration(F604_CONFIG),ID=C.id;
// F6-04 local fast-pointer-release safety. F0 remains exactly unchanged.
window.addEventListener('pointerup',e=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f604-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(e);});},true);
const STEPS=[
 {name:'Notice the two quantities',caption:'Keep the same comparison.',pose:'explain',narration:'A ratio compares two quantities in order. Six blue counters and nine teal counters make a ratio of six to nine.'},
 {name:'Represent equal-sized bundles',caption:'Can we make equal bundles?',pose:'count',narration:'We can organise both collections into bundles of the same size. Each bundle must contain an equal number of counters.'},
 {name:'Find the common factor',caption:'Group both sides alike.',pose:'point',narration:'Three is a common factor of six and nine. There are two bundles on one side and three on the other.'},
 {name:'Collapse equal bundles',caption:'One bundle becomes one part.',pose:'idea',narration:'Count bundles instead of individual counters. The comparison has not changed because both sides used groups of three.'},
 {name:'State the simplest ratio',caption:'Both sides change together.',pose:'point',narration:'Six to nine simplifies to two to three. Both parts were divided by the same positive common factor.'},
 {name:'Prove the equivalent ratio',caption:'Check the same multiplier.',pose:'celebrate',narration:'Multiply both parts of two to three by three and you return to six to nine. The ratio is equivalent and the new pair has no common factor above one.'}
];
function gcd(a,b){a=Math.round(Math.abs(a));b=Math.round(Math.abs(b));while(b){const t=a%b;a=b;b=t;}return a||1;}
function result(p){const g=gcd(...p.whole);return {a:p.whole[0]/g,b:p.whole[1]/g,g,scaled:p.clear>1};}
function candidate(p){const r=result(p),a=p.whole[0],b=p.whole[1];const v=[[r.a,r.b],[a,b],[r.b,r.a],[r.a,r.b+1],[Math.max(1,a-r.a),Math.max(1,b-r.b)]];return [...new Map(v.map(([a,b])=>[a+':'+b,[a,b]])).values()].slice(0,5);}
function emit(k,v){N.events.emit('value',{engine:ID,key:k,value:v});}
function chalk(parent,x,y,txt,role='given',size=26){return N.chalkText(parent,x,y,String(txt),{role,size});}
function svgFraction(svg,x,cy,text,role,size){const [n,d]=text.split('/');const g=E('g',{class:'f604-fraction'},svg);chalk(g,x,cy-15,n,role,size);N.neonLine(g,x-23,cy,x+23,cy,{role,width:2.6});chalk(g,x,cy+24,d,role,size);return g;}
function geom(mobile){return mobile?{w:480,h:1130,aX:240,bX:240,aY:222,bY:455,aW:410,aH:177,bW:410,bH:177,factorY:645,resultY:735,chipY:870,chipH:68,chipW:78,chipGap:7,dropY:752,dropW:239,returnY:1038,returnX:314,returnW:143,returnH:64}:
 {w:1130,h:1040,aX:311,bX:818,aY:257,bY:257,aW:458,aH:251,bW:458,bH:251,factorY:539,resultY:565,chipY:803,chipH:64,chipW:160,chipGap:12,dropY:663,dropW:245,returnY:938,returnX:950,returnW:146,returnH:65};}
function framedCounter(svg,x,y,role,r,animate){const c=N.neonRing(svg,x,y,{role,r,pulse:false});c.classList.add('f604-counter');if(animate&&!N.reducedMotion())M.arrive(c,0,-16,360,M.ease.out);return c;}
function bundles(svg,p,G,k,step,grouped){
 const cx=k===0?G.aX:G.bX,cy=k===0?G.aY:G.bY,bW=k===0?G.aW:G.bW,bH=k===0?G.aH:G.bH,role=k===0?'given':'op',num=p.whole[k],factor=result(p).g;
 const mobile=G.w<600,visualGroups=(step>=2||grouped)&&factor>1,collapsed=step>=4&&!grouped;
 N.neonBox(svg,cx-bW/2,cy-31,bW,bH,{role,r:18});
 chalk(svg,cx-bW/2+77,cy+7,k===0?'QUANTITY A':'QUANTITY B',role,mobile?22:28);
 chalk(svg,cx+bW/2-62,cy+7,step>0?String(num):p.display[k],role,mobile?24:31);
 if(visualGroups){
   const count=num/factor,groupW=Math.min(mobile?117:133,(bW-38)/count-9),gap=mobile?9:13;
   for(let group=0;group<count;group++){
     const gcx=cx+(group-(count-1)/2)*(groupW+gap),top=cy+(mobile?30:43),height=mobile?70:119;
     N.neonBox(svg,gcx-groupW/2,top,groupW,height,{role:'focus',r:12});
     if(collapsed){
       const ring=framedCounter(svg,gcx,top+height/2,role,mobile?18:22,false);
       ring.setAttribute('data-bundle',String(group));
     }else{
       const cols=Math.min(3,factor),rows=Math.ceil(factor/cols),dx=mobile?26:31,dy=mobile?27:34;
       for(let v=0;v<factor;v++){
         const row=Math.floor(v/cols),col=v%cols;
         const x=gcx+(col-(cols-1)/2)*dx,y=top+height/2+(row-(rows-1)/2)*dy;
         framedCounter(svg,x,y,role,mobile?8.4:10,false).dataset.counter=k+':'+(group*factor+v);
       }
     }
   }
   chalk(svg,cx,cy+bH-(mobile?46:46),count+' '+(count===1?'BUNDLE':'BUNDLES')+' OF '+factor,'focus',mobile?21:28);
 }else{
   const cols=Math.min(mobile?9:9,Math.max(3,num)),rows=Math.ceil(num/cols),sep=mobile?32:39;
   const rowGap=mobile?30:35,yy=cy+(mobile?70:87)-(rows-1)*rowGap/2;
   for(let i=0;i<num;i++){
     const row=Math.floor(i/cols),col=i%cols,items=Math.min(cols,num-row*cols);
     const x=cx+(col-(items-1)/2)*sep,y=yy+row*rowGap;
     framedCounter(svg,x,y,role,mobile?9.7:11,step===1&&i>0).dataset.counter=k+':'+i;
   }
   if(step>0)chalk(svg,cx,cy+bH-39,'COUNT THE EQUAL PARTS','unknown',mobile?19:23);
 }
 return {x:cx-bW/2,y:cy-31,w:bW,h:bH};
}
function valueDisplay(svg,x,y,txt,role,size){if(txt.includes('/'))return svgFraction(svg,x,y-8,txt,role,size-2);return chalk(svg,x,y+9,txt,role,size);}
function infoCard(title,value,note,role){return N.neonCard([H('p',{class:'f604-card-head',text:title}),H('p',{class:'f604-card-val',text:value}),H('p',{class:'f604-card-sub',text:note})],{role});}
function scene(stage,p,o){
if(window.NovaLessonComponent?.active){[stage,p,o]=window.NovaLessonComponent.args("scene",arguments);}

 const mobile=window.innerWidth<=760,G=geom(mobile),st=o.step??5,explore=!!o.explore,challenge=!!o.challenge;
 const r=result(p),ratio=r.a+':'+r.b,showScaled=st>=1,groupA=st>=2||o.grouped?.[0],groupB=st>=2||o.grouped?.[1],showSimple=st>=4&&!challenge&&!explore||o.assigned!=null||o.solved;
 stage.innerHTML='';N.cap(stage,ID,'SIMPLIFYING RATIOS',challenge?'YOUR TURN':explore?'BUILD & EXPLORE':'EQUIVALENT GROUPS');
 const frame=H('div',{class:'f604-layout'}),art=H('div',{class:'f604-art'}),aside=H('aside',{class:'f604-cards','aria-label':'Mathematical evidence'});
 const svg=N.svg.root(G.w,G.h,'Two sets of blue and teal glowing counters showing the same proportional comparison before and after grouping. Lasso or drag a ratio chip to simplify.');svg.classList.add('f604-svg');svg.dataset.preset=o.preset||C.preset;svg.dataset.stage=st;svg.dataset.ratio=p.display.join(':');svg.dataset.answerRevealed=String(!!showSimple);
 chalk(svg,G.w/2,p.display[0].includes('/')?(mobile?42:46):(mobile?52:58),'SAME COMPARISON · FEWER PARTS','given',mobile?26:43);
 if(p.display[0].includes('/')){
  svgFraction(svg,G.w/2-(mobile?77:109),mobile?110:122,p.display[0],'given',mobile?21:25);
  chalk(svg,G.w/2,mobile?129:143,':','focus',mobile?35:48);
  svgFraction(svg,G.w/2+(mobile?77:109),mobile?110:122,p.display[1],'op',mobile?21:25);
 }else{
  chalk(svg,G.w/2,mobile?114:144,p.display[0]+' : '+p.display[1],'focus',mobile?43:58);
 }
 const aa=bundles(svg,p,G,0,st,groupA),bb=bundles(svg,p,G,1,st,groupB);
 if(p.clear>1){chalk(svg,G.w/2,mobile?176:200,'MULTIPLY BOTH ORIGINAL PARTS BY '+p.clear,'focus',mobile?21:29);}else chalk(svg,G.w/2,mobile?158:193,'THE SAME FACTOR ON BOTH SIDES','op',mobile?23:31);
 let label;
 if(st<2&&!explore&&!challenge)label='LOOK FOR EQUAL-SIZE BUNDLES';
 else if((explore||challenge)&&!(o.grouped?.[0]&&o.grouped?.[1]))label=challenge?'USE THE SAME FACTOR':'GROUP BOTH COLLECTIONS';
 else if(r.g>1)label='÷ '+r.g+' ON BOTH SIDES';
 else label='NO FURTHER COMMON FACTOR';
 N.neonPath(svg,mobile?`M92 ${G.factorY-22} L388 ${G.factorY-22}`:`M308 ${G.factorY-18} L821 ${G.factorY-18}`,{role:'focus',width:2.8});
 chalk(svg,G.w/2,G.factorY+17,label,'focus',mobile?29:38);
 chalk(svg,G.w/2,G.factorY+61,challenge?'WRITE THE SIMPLEST WHOLE-NUMBER RATIO':(explore?'DROP THE SIMPLEST RATIO INTO THE SLOT':st>=4?'THE BUNDLES KEEP THE COMPARISON':'DIVIDE BOTH QUANTITIES TOGETHER'),challenge?'unknown':'given',mobile?21:27);
 const slotY=G.dropY,slotW=mobile?302:320,slotX=(G.w-slotW)/2;
 N.neonBox(svg,slotX,slotY,slotW,mobile?88:91,{role:explore?'unknown':showSimple?'result':'unknown',r:14});
 chalk(svg,G.w/2,slotY+30,'SIMPLEST RATIO','given',mobile?20:24);
 chalk(svg,G.w/2,slotY+75,showSimple?ratio:'? : ?',showSimple?'result':'unknown',mobile?36:45);
 if(!explore&&!challenge&&st>=5){N.neonRing(svg,G.w/2+slotW/2-24,slotY+58,{role:'result',r:12,pulse:false});chalk(svg,G.w/2,G.h-36,'PROOF · '+r.a+' × '+r.g+' = '+p.whole[0]+'     '+r.b+' × '+r.g+' = '+p.whole[1],'result',mobile?23:31);}
 if(explore){
  const tokens=candidate(p),totalW=tokens.length*(G.chipW+G.chipGap)-G.chipGap,x0=(G.w-totalW)/2;
  tokens.forEach((v,i)=>{const x=x0+i*(G.chipW+G.chipGap),val=v.join(':');
   const g=E('g',{class:'f604-drag',role:'button',tabindex:0,'data-chip':val,'aria-label':'Ratio '+val+'; press Enter to place in simplest-ratio slot.'},svg);
   N.neonBox(g,x,G.chipY,G.chipW,G.chipH,{role:i===0?'result':i===1?'given':i===2?'op':'unknown',r:12});
   chalk(g,x+G.chipW/2,G.chipY+43,val,i===0?'result':i===1?'given':i===2?'op':'unknown',mobile?26:32);
   g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '||e.key.toLowerCase()==='s'){e.preventDefault();o.onRatio(val);}});
   N.ui.svgDrag(svg,g,{box:{x,y:G.chipY,w:G.chipW,h:G.chipH},zones:()=>[{id:'simplest',kind:'drop',x:slotX,y:slotY,w:slotW,h:90},{id:'return',kind:'remove',x:G.returnX,y:G.returnY,w:G.returnW,h:G.returnH}],onDrop:id=>{if(id==='simplest'){Promise.resolve().then(()=>o.onRatio(val));return true;}return false;},onRemove:()=>o.onRemove()});
  });
  // Lasso token can be dragged onto either side and changed via keyboard A/B.
  const lassoX=mobile?65:105,lassoY=G.returnY,lasso=E('g',{class:'f604-drag','data-lasso':'1',tabindex:0,role:'button','aria-label':'Common factor lasso. Drag onto either counter collection, or press A / B.'},svg);
  N.neonRing(lasso,lassoX+34,lassoY+30,{role:'focus',r:20,pulse:false});
  N.neonPath(lasso,`M${lassoX+17} ${lassoY+24} Q${lassoX+32} ${lassoY-4} ${lassoX+53} ${lassoY+25} Q${lassoX+60} ${lassoY+43} ${lassoX+40} ${lassoY+50}`,{role:'focus',width:3});
  chalk(svg,lassoX+98,lassoY+38,'LASSO','focus',mobile?21:27);
  lasso.addEventListener('keydown',e=>{if('aAbB'.includes(e.key)){e.preventDefault();o.onGroup(e.key.toLowerCase()==='a'?0:1);}});
  N.ui.svgDrag(svg,lasso,{box:{x:lassoX+10,y:lassoY+5,w:63,h:60},zones:()=>[{id:'a',kind:'drop',...aa},{id:'b',kind:'drop',...bb},{id:'return',kind:'remove',x:G.returnX,y:G.returnY,w:G.returnW,h:G.returnH}],onDrop:id=>{if(id==='a'||id==='b'){Promise.resolve().then(()=>o.onGroup(id==='a'?0:1));return true;}return false;},onRemove:()=>o.onRemove()});
  // A placed value can be re-grabbed and returned to the red removal tray.
  if(o.assigned!=null){const assigned=E('g',{class:'f604-drag','data-placed':o.assigned,role:'button',tabindex:0,'aria-label':'Placed ratio '+o.assigned+'; Delete returns it.'},svg);
   N.neonRing(assigned,slotX+slotW-24,slotY+62,{role:'result',r:17,pulse:false});
   assigned.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'||e.key==='Escape'){e.preventDefault();o.onRemove();}});
   N.ui.svgDrag(svg,assigned,{box:{x:slotX+slotW-51,y:slotY+37,w:50,h:49},zones:()=>[{id:'return',kind:'remove',x:G.returnX,y:G.returnY,w:G.returnW,h:G.returnH}],onRemove:()=>o.onRemove(),onDrop:()=>false});
  }
  N.neonBox(svg,G.returnX,G.returnY,G.returnW,G.returnH,{role:'error',r:11,text:'RETURN',size:mobile?22:28});
  chalk(svg,G.w/2,mobile?G.returnY-44:G.returnY-26,'GROUP BOTH SIDES · DROP A RATIO CHIP', 'op',mobile?20:26);
 }
 art.appendChild(svg);
 const cleaned=(p.clear>1?p.whole.join(' : '):p.display.join(' : '));
 aside.append(infoCard('ORIGINAL',p.display[0]+' : '+p.display[1],p.lesson+' · ordered comparison','given'),
  infoCard('WHOLE-NUMBER FORM',(!challenge&&st>=1||explore)?cleaned:'? : ?',p.clear>1?'Multiply each original term by '+p.clear:'Same starting values','op'),
  infoCard('COMMON FACTOR',(!challenge&&st>=2||o.grouped?.some(Boolean))?String(r.g):'?',r.g===1?'Already in lowest whole-number terms':'Divide BOTH whole numbers','focus'),
  infoCard('SIMPLIFIED',showSimple?ratio:'? : ?',showSimple?'No shared whole-number factor remains':'Keep the relationship equal','result'));
 frame.append(art,aside);stage.appendChild(frame);N.scene.helperStrip(stage,o.pose||'explain',o.caption||'Both parts change together.');
 return svg;
}
function teach(i,stage){const p=C.presets[C.preset],r=result(p),original=p.display.join(' to '),whole=p.whole.join(' to ');
 const script=[
  'Start with the comparison '+original+'. A ratio keeps the left and right quantities in the same order.',
  p.clear>1?'Multiply both original parts by '+p.clear+' so their values are whole numbers: '+whole+'. Multiplying BOTH sides preserves the ratio.':'Both sides are whole numbers already. Use groups that have the same number of counters.',
  r.g>1?'The greatest common factor of '+p.whole[0]+' and '+p.whole[1]+' is '+r.g+'. Group BOTH amounts into bundles of '+r.g+'.':'These whole numbers have no common factor greater than one. The whole-number ratio is already simplest.',
  r.g>1?'The '+p.whole[0]+' counters make '+r.a+' equal bundles, and the '+p.whole[1]+' counters make '+r.b+' equal bundles. Count the bundles.':'There is no bundle factor to remove. Each original whole-number unit already represents one ratio part.',
  'The simplest ratio is '+r.a+' to '+r.b+'. Neither term has a common whole-number factor above one.',
  'Check by multiplying BOTH terms of '+r.a+' to '+r.b+' by '+r.g+'. We recover '+whole+'. The comparison is unchanged.'
 ];
 STEPS[i].narration=script[i];emit('stage',{index:i,preset:C.preset});scene(stage,p,{step:i,pose:STEPS[i].pose,caption:STEPS[i].caption});
}
function btn(txt,cb,cls='nova-btn'){return H('button',{class:cls,text:txt,onclick:cb});}
function explore(panel,stage){
 window.NovaLessonComponent?.applyExploreModels();let id=C.preset,grouped=[false,false],assigned=null,message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Use the lasso on both counter groups, then drag the simplest ratio into the answer slot.')):('Use the lasso on both counter groups, then drag the simplest ratio into the answer slot.'));
 window.NovaLessonComponent?.applyExploreModels();const select=H('select',{'aria-label':'Choose a ratio preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,p])=>select.append(H('option',{value:key,text:p.label})));window.NovaLessonComponent?.applyExploreModels();select.value=id;
 window.NovaLessonComponent?.applyExploreModels();const controls=H('div',{class:'f604-controls'}),status=H('p',{class:'f604-message','aria-live':'polite'}),actions=H('div',{class:'f604-controls'});
 window.NovaLessonComponent?.applyExploreModels();controls.append(H('label',{class:'f604-field'},['Example',select]));
 window.NovaLessonComponent?.applyExploreModels();const check=btn('Check simplest ratio',()=>verify(),'nova-btn primary'),hint=btn('Hint',()=>getHint()),remove=btn('Return chip',()=>onRemove()),reset=btn('Reset',()=>onReset());
 window.NovaLessonComponent?.applyExploreModels();actions.append(check,hint,remove,reset);window.NovaLessonComponent?.applyExploreModels();panel.append(controls,actions,H('p',{class:'f604-instruction',text:'Drag the lasso onto BOTH counter collections (keyboard A/B). Drag a ratio chip to the answer slot (keyboard Enter). Regrab the result ring and drag to the red return tray (or Delete).'}),status);
 window.NovaLessonComponent?.applyExploreModels();function p(){return C.presets[id];}window.NovaLessonComponent?.applyExploreModels();function draw(pose='count',caption='Group both sides alike.'){status.textContent=message;scene(stage,p(),{explore:true,step:1,grouped,assigned,preset:id,onGroup,onRatio,onRemove,pose,caption});}
 window.NovaLessonComponent?.applyExploreModels();function onGroup(k){grouped[k]=true;emit('lasso',{preset:id,side:k,factor:result(p()).g});message='Grouped quantity '+(k===0?'A':'B')+'. Both quantities must use a common positive factor.';draw('point','Group BOTH sides.');const l=stage.querySelector('[data-lasso]');if(l)l.focus({preventScroll:true});}
 window.NovaLessonComponent?.applyExploreModels();function onRatio(v){assigned=v;emit('ratioDrop',{preset:id,ratio:v});message='You placed '+v+'. Check that it keeps the original comparison and cannot be simplified further.';draw('point','Check BOTH terms.');}
 window.NovaLessonComponent?.applyExploreModels();function onRemove(){assigned=null;emit('ratioRemove',id);message='Chip returned. Choose a ratio you can prove.';draw('not-yet','Try another ratio.');}
 window.NovaLessonComponent?.applyExploreModels();function getHint(){const r=result(p());emit('hint',{preset:id});N.events.emit('hintUsed',{engine:ID,preset:id});message=p().clear>1?'First clear the decimals or denominators by multiplying BOTH terms by '+p().clear+'. Then check common factors.':'Find the greatest common factor of '+p().whole[0]+' and '+p().whole[1]+'. Use the SAME factor on both terms.';draw('idea','Both terms must change equally.');}
 window.NovaLessonComponent?.applyExploreModels();function verify(){const r=result(p()),expected=r.a+':'+r.b,good=assigned===expected;let msg='';
 if(!assigned)msg='Drop a ratio chip in the simplest-ratio slot first.';
 else if(good)msg='Correct! '+p().display.join(' : ')+' is equivalent to '+expected+'. The terms share no factor greater than one.';
 else if(assigned===p().whole.join(':'))msg='That ratio is equivalent, but it is NOT simplest. Divide both whole numbers by their greatest common factor.';
 else if(assigned===r.b+':'+r.a)msg='The order has been reversed. The first term must still represent the first quantity.';
 else msg='Those two parts do not preserve the original multiplicative comparison. Keep both sides scaled equally.';
 message=msg;emit('answer',{preset:id,value:assigned,correct:good});N.events.emit('correct',{engine:ID,correct:good,mode:'explore'});draw(good?'celebrate':'not-yet',good?'Perfect equivalence!':'Keep the relationship.');status.classList.toggle('good',good);status.classList.toggle('bad',!good);
 if(good){const svg=stage.querySelector('.f604-svg');if(svg)M.flash(svg,240,geom(window.innerWidth<=760).dropY+55,'result',70);}
 }
 window.NovaLessonComponent?.applyExploreModels();function onReset(){grouped=[false,false];assigned=null;message='Reset. Count both sides and group them by one shared factor.';emit('reset',id);status.classList.remove('good','bad');draw('explain','Start from the comparison.');}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=()=>{id=select.value;C.preset=id;emit('preset',id);onReset();};
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:id,grouped:[...grouped],assigned}),group:onGroup,place:onRatio,remove:onRemove,check:verify,hint:getHint,reset:onReset,setPreset:x=>{select.value=x;select.onchange();}};window.NovaLessonComponent?.applyExploreModels();draw();
}
function challenge(panel,api,stage){let i=0,ok=false,done=0,attempts=0;const keys=Object.keys(C.presets);
 const question=H('p',{class:'f604-question'}),fields=H('div',{class:'f604-controls'}),a=H('input',{type:'text',inputmode:'numeric',placeholder:'First part','aria-label':'First part of simplest ratio'}),b=H('input',{type:'text',inputmode:'numeric',placeholder:'Second part','aria-label':'Second part of simplest ratio'}),status=H('p',{class:'f604-message','aria-live':'polite'}),progress=H('p',{class:'f604-progress'}),buttons=H('div',{class:'f604-controls'});
 fields.append(H('label',{class:'f604-field'},['First part',a]),H('label',{class:'f604-field'},['Second part',b]));
 const check=btn('Check ratio',verify,'nova-btn primary'),hint=btn('Hint',getHint),next=btn('Next ratio',advance);next.disabled=true;buttons.append(check,hint,next);panel.append(question,fields,buttons,status,progress);
 function p(){return C.presets[keys[i]];}function parse(e){const s=e.value.trim();if(!s)return null;const n=Number(s);return Number.isFinite(n)?n:null;}
 function draw(){question.textContent='Challenge '+(i+1)+' / '+keys.length+' · '+p().context+' Write the smallest equivalent ratio using WHOLE-NUMBER parts.';progress.textContent='Correctly simplified: '+done+' / '+keys.length;scene(stage,p(),{challenge:true,step:ok?5:1,solved:ok,preset:keys[i],pose:ok?'celebrate':'think',caption:ok?'Excellent simplification!':'Keep both quantities in order.'});}
 function explain(x,y){const data=p(),r=result(data);if(x==null||y==null)return 'Enter two numbers, in their original order.';
 if(x<=0||y<=0||!Number.isInteger(x)||!Number.isInteger(y))return 'The simplest form uses positive WHOLE-NUMBER parts.';
 if(x===r.b&&y===r.a)return 'The order has been reversed; the first quantity stays first.';
 if(x===data.whole[0]&&y===data.whole[1])return r.g>1?'Equivalent, but you have not simplified: both whole numbers still share a factor.':'This is the simplest form.';
 if(x*data.whole[1]!==y*data.whole[0])return 'Not equivalent: the two terms must change by the SAME scale factor.';
 return 'Equivalent, but both of your terms still share a common factor. Divide them again.';}
 function verify(){if(ok)return;const x=parse(a),y=parse(b),r=result(p()),good=x===r.a&&y===r.b;
 if(x===null||y===null){status.textContent='Enter BOTH ratio parts before checking.';return;}
 attempts++;const feedback=good?'Correct! '+p().display.join(' : ')+' simplifies to '+r.a+' : '+r.b+'.':explain(x,y);
 api.check(good,feedback,{preset:keys[i],answer:[x,y],task:i});emit('answer',{preset:keys[i],values:[x,y],correct:good});status.textContent=feedback;status.classList.toggle('good',good);status.classList.toggle('bad',!good);
 if(good){ok=true;done++;check.disabled=true;next.disabled=false;draw();}}
 function getHint(){const data=p();const t=data.clear>1?'Multiply BOTH parts by '+data.clear+' first to make the terms whole numbers. Then simplify.':'Find a common factor of '+data.whole[0]+' and '+data.whole[1]+', then divide BOTH by it.';api.hint(t);emit('hint',keys[i]);status.textContent=t;}
 function advance(){if(!ok)return;if(i===keys.length-1){question.textContent='All four ratio challenges complete.';fields.hidden=true;buttons.hidden=true;stage.innerHTML='';N.cap(stage,ID,'FOUR CHALLENGES COMPLETED');N.scene.helperStrip(stage,'celebrate','Excellent ratio reasoning!');status.textContent='You preserved each comparison and simplified it fully.';return;}
 i++;ok=false;attempts=0;a.value='';b.value='';check.disabled=false;next.disabled=true;status.textContent='Start by making both parts whole numbers, where needed.';status.classList.remove('good','bad');draw();}
 [a,b].forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter')verify();}));C._challenge={get:()=>({index:i,done,ok,attempts,status:status.textContent}),setAnswers:(x,y)=>{a.value=x;b.value=y;},check:verify,next:advance,hint:getHint};status.textContent='Find the simplest whole-number ratio.';draw();
}
const DEF={id:ID,title:'Simplifying Ratios · Equivalent Groups',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'Two large neon-glass regions hold blue and teal counter rings. Equal bundles reveal a shared factor. A lasso groups either region and ratio chips are moved to the simplest-ratio slot.',
 staticAlt:'A:B is equivalent to (A÷g):(B÷g), where g is the greatest common factor after first clearing fractions or decimals with the SAME multiplier. Example: 6:9 → 2:3.',
 spec:{purpose:'Make ratio simplification concrete with grouped neon counters, proving the same multiplicative relationship survives a shared scale factor.',params:'Positive nonzero quantities, labels, rational input (whole numbers, terminating decimals or stacked fractions), numerator/denominator clearance factor, greatest common factor.',presets:'Y7-058 6:9 and 12:18; Y8-034 1.5:2.25 and traditional stacked 3/4 : 1/2.',steps:'Notice the comparison → make equal bundles → identify shared factor → collapse bundles → simplest whole-number ratio → prove equivalence.',interactions:'Re-grabbable F0 svgDrag lasso for either group; draggable ratio chips; green snap zone, red return zone, keyboard A/B/Enter/Delete; reset, hint and feedback.',traps:'Dividing only one side, preserving quantity order, stopping at a non-simplest equivalent ratio, treating decimals as whole numbers, reversing ratio.',gcse:'Extend to algebraic ratios, three-part comparisons and fractional or decimal terms, always clearing denominators consistently.'}};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","p","o"]},exploreFields:{"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F6·04',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 7 and 8; GCSE extension',linked:['F0-02','F0-03','F0-04','F0-05','F0-08','F2-03','F6-01','F6-03']});
})();
