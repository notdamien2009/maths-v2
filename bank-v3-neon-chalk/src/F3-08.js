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

/* NOVA F3-08 Multiples Overlap Tracks. Current canonical F0. No external dependencies. */
const F308_CONFIG={id:'F3-08',preset:'Y7-013',startMode:'watch',parameters:{min:2,max:12,limit:144},
 presets:{
  'Y7-013':{label:'Year 7 · Factors and multiples · 3 and 4',a:3,b:4,lesson:'Y7-013'},
  'Y7-016':{label:'Year 7 · HCF and LCM · 6 and 8',a:6,b:8,lesson:'Y7-016'}},
 challenge:[{a:3,b:4},{a:4,b:6},{a:6,b:8}],
 events:{value:['preset','multipleA','multipleB','trackA','trackB','marker','remove','lcmGuess','proof'],types:['step','correct','hintUsed','mode']}};
window.F308_CONFIG=F308_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F308_CONFIG),ID=C.id;
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' event '+key);N.events.emit('value',{engine:ID,key,value});}
function gcd(a,b){while(b)[a,b]=[b,a%b];return a;}
function lcm(a,b){return a/gcd(a,b)*b;}
function multiples(n,up){let out=[];for(let v=n;v<=up;v+=n)out.push(v);return out;}
function common(a,b,up){return multiples(lcm(a,b),up);}
function limit(a,b){const L=lcm(a,b);return Math.min(C.parameters.limit,Math.max(36,L*3));}
function reason(a,b,v){if(!Number.isInteger(v)||v<=0)return 'Choose a positive whole-number landing point.';
 if(v%a&&v%b)return v+' is on neither jump track. Check both sets of landings.';
 if(v%a)return v+' is on track B only. Track A never lands there.';
 if(v%b)return v+' is on track A only. Track B never lands there.';
 if(v!==lcm(a,b))return v+' is shared, but '+lcm(a,b)+' is the FIRST shared landing.';
 return '';
}
function valid(a,b,v){return reason(a,b,v)==='';}
window.F308_MATH={gcd,lcm,multiples,common,limit,reason,valid};
const SAY={start:'Two jump tracks!',a:'Watch the blue jumps!',b:'Now the orange!',first:'They meet here!',again:'Another match!',finish:'You found it!',explore:'Find the overlap!',ready:'Your turn!',right:'Nicely spotted!',wrong:'Try another!',hint:'Check both lines!',remove:'Have another go!',win:'Brilliant!'};
const POSE={start:'explain',a:'point',b:'count',first:'cheer',again:'point',finish:'cheer',explore:'point',ready:'think',right:'cheer',wrong:'oops',hint:'think',remove:'point',win:'cheer'};
function dock(stage,key){
if(window.NovaLessonComponent?.active){[stage,key]=window.NovaLessonComponent.args("dock",arguments);}
N.scene.helperStrip(stage,POSE[key]||'think',SAY[key]||'Your turn!');}
function chalk(svg,x,y,str,size=53,role='given'){return N.chalkText(svg,x,y,String(str),{size,role});}
function action(text,handler,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:handler});}
const STEPS=[
{name:'Two tracks, one scale',phase:0,say:'start',narration:'These two tracks use exactly the same number scale. We will jump in threes on the upper line and in fours on the lower line.'},
{name:'Jump in threes',phase:1,say:'a',narration:'Count the landings on the upper track: three, six, nine, twelve, fifteen and so on. These are multiples of three.'},
{name:'Jump in fours',phase:2,say:'b',narration:'Now count in fours on the lower track: four, eight, twelve, sixteen and so on. Each jump is the same length within its track.'},
{name:'Spot the first shared landing',phase:3,say:'first',narration:'Both tracks reach twelve. It is the smallest positive number where the jumps meet. Twelve is the lowest common multiple of three and four.'},
{name:'Find further matches',phase:4,say:'again',narration:'Both tracks also land at twenty-four and thirty-six. These are common multiples, but they are not the lowest one.'},
{name:'Prove the lowest common multiple',phase:5,say:'finish',narration:'The first meeting point is twelve. Three times four is twelve, and four times three is twelve. The lowest common multiple is twelve.'}
];
const GEO={x:100,w:820,top:393,bottom:805,mid:586,home:{x:500,y:1095},remove:{x:698,y:1035,w:225,h:100}};
function makeStage(a,b,selected,opt={}){
 const up=limit(a,b),L=lcm(a,b),svg=N.svg.root(1000,1190,`Parallel NOVA number lines: jumps of ${a} above, jumps of ${b} below. Both lines have the same scale from 0 to ${up}. The lowest common multiple is ${L}.`);
 svg.classList.add('f308-svg');svg.dataset.a=a;svg.dataset.b=b;svg.dataset.lcm=L;svg.dataset.limit=up;
 const phase=opt.phase==null?5:opt.phase,interactive=!!opt.interactive,canReveal=!opt.hideAnswers||!!opt.proved,showA=phase>=1,showB=phase>=2,showFirst=phase>=3&&canReveal,showMore=phase>=4&&canReveal;
 const x=v=>GEO.x+GEO.w*v/up, step=up<=36?3:up<=48?4:up<=72?6:up<=96?8:12;
 // Approved F0 single-source number line: core draws all ticks, chalk digits and tube.
 const label=v=>(v===0||v===up||v%step===0)?String(v):null;
 chalk(svg,300,105,`Track A  ·  +${a}`,59,'op');chalk(svg,705,105,`Track B  ·  +${b}`,59,'focus');
 chalk(svg,500,181,'Same distance between equal numbers',47,'given');
 N.numberLine(svg,{x:GEO.x,y:GEO.top,w:GEO.w,min:0,max:up,major:1,label,labelSize:49});
 N.numberLine(svg,{x:GEO.x,y:GEO.bottom,w:GEO.w,min:0,max:up,major:1,label,labelSize:49});
 chalk(svg,65,320,`+${a}`,54,'op');chalk(svg,65,729,`+${b}`,54,'focus');
 function hops(n,y,role,show){if(!show)return;const ms=multiples(n,up);for(let i=0;i<ms.length;i++){
   const v=ms[i],g=N.svg.hop(svg,x(v-n),x(v),y,{height:Math.max(47,Math.min(64,(x(n)-x(0))*.62+22)),role});
   g.dataset.hop=role==='op'?'a':'b';g.dataset.landing=v;
   if(opt.animate&&!N.reducedMotion()&&i<13)N.motion.arrive(g,0,25,280+i*75,N.motion.ease.out);
   N.neonRing(svg,x(v),y,{role,r:10});
 }}
 hops(a,GEO.top,'op',showA);hops(b,GEO.bottom,'focus',showB);
 const shares=common(a,b,up);for(let i=0;i<shares.length;i++){
   if(i===0&&!showFirst)continue;if(i>0&&!showMore)continue;
   const v=shares[i],xx=x(v),role=i===0?'result':'support';
   N.neonLine(svg,xx,GEO.top+21,xx,GEO.bottom-19,{role,width:i===0?5.2:3.7});
   N.neonRing(svg,xx,GEO.top,{role,r:21});N.neonRing(svg,xx,GEO.bottom,{role,r:21});
   const r=N.neonRing(svg,xx,GEO.mid,{role,r:i===0?27:19});
   if(opt.animate&&!N.reducedMotion()){N.motion.pop(r,xx,GEO.mid);if(i===0)N.motion.flash(svg,xx,GEO.mid,'result',54);}
 }
 // Midpoint labels carry numerical evidence, not decorative markers.
 chalk(svg,210,539,'Shared landings',47,'given');
 if(showFirst)chalk(svg,790,540,`${L} is first`,48,'result');
 else chalk(svg,770,540,'Where do they meet?',47,'given');
 if(!showFirst)chalk(svg,500,641,'Look for the same landing on both tracks',46,'given');
 // Footer: answer stays hidden in challenge until the marker/answer have been proved.
 const proved=!!opt.proved;N.neonBox(svg,115,903,768,90,{role:showFirst||proved?'result':'support',r:20});
 chalk(svg,500,960,showFirst||proved?`LCM(${a}, ${b}) = ${L}`:'First common landing = ?',58,showFirst||proved?'result':'given');
 // Interactive marker uses core drag, with all candidate drop zones and a red Remove tray.
 if(interactive){
  const at=selected?{x:x(selected),y:GEO.mid}:GEO.home;
  if(selected){N.neonRing(svg,at.x,at.y,{role:'result',r:34});}
  const mg=E('g',{'aria-label':selected?`Movable marker at ${selected}; drag to remove or choose another landing`:'Drag the glowing ring to the first common landing','data-marker':'1'},svg);
  N.neonBox(mg,at.x-39,at.y-36,78,74,{role:selected?'result':'focus',r:27});N.neonRing(mg,at.x,at.y,{role:selected?'result':'focus',r:24});chalk(mg,at.x,at.y+17,selected||'?',47,'given');
  const zones=()=>selected?[{x:GEO.remove.x,y:GEO.remove.y,w:GEO.remove.w,h:GEO.remove.h,id:'remove',kind:'remove'}]:
    Array.from({length:up},(_,i)=>{const v=i+1,xx=x(v),half=GEO.w/up/2;return {x:xx-half,y:GEO.mid-84,w:2*half,h:165,id:String(v),kind:'drop'};});
  N.ui.svgDrag(svg,mg,{box:{x:at.x-39,y:at.y-36,w:78,h:74},zones,
    onDrop:z=>opt.place(+z),onRemove:()=>opt.remove()});
  // Visible red remove zone is real drop target and part of the board.
  N.neonBox(svg,GEO.remove.x,GEO.remove.y,GEO.remove.w,GEO.remove.h,{role:'error',r:18});
  chalk(svg,GEO.remove.x+GEO.remove.w/2,GEO.remove.y+66,'Remove',47,'error');
  if(!selected){chalk(svg,220,1093,'Drag the ring',47,'focus');}
 }
 return svg;
}
function showStage(stage,a,b,selected,opt={}){
if(window.NovaLessonComponent?.active){[stage,a,b,selected,opt]=window.NovaLessonComponent.args("showStage",arguments);}

 stage.innerHTML='';N.cap(stage,'Multiples Overlap Tracks',opt.caption||'Where do both jumps land together?');
 const row=H('div',{class:'f308-scene'}),aside=H('aside',{class:'f308-side'}),up=limit(a,b),L=lcm(a,b);
 const svg=makeStage(a,b,selected,opt);
 const aText=multiples(a,up).slice(0,8).join(' · ')+(multiples(a,up).length>8?' …':''),bText=multiples(b,up).slice(0,8).join(' · ')+(multiples(b,up).length>8?' …':'');
 const sideCard=(name,value,role)=>N.neonCard([H('span',{class:'f308-sideTitle',text:name}),H('p',{class:'f308-sideValue',text:value})],{role});
 aside.append(sideCard('UPPER TRACK · MULTIPLES OF '+a,aText,'op'),sideCard('LOWER TRACK · MULTIPLES OF '+b,bText,'focus'),sideCard('FIRST SHARED LANDING',opt.hideAnswers&&!opt.proved?'?':String(L),'result'),N.neonCard([H('p',{class:'f308-note',text:'Same scale on both tracks: vertical connections are matching numbers, never approximate positions.'})],{role:'support'}));
 row.append(svg,aside);stage.append(row);dock(stage,opt.say||'explore');return svg;
}
const def={id:ID,title:'Multiples Overlap Tracks',config:C,steps:STEPS,
 alt:'Two parallel, identically scaled number lines. Blue hops mark multiples of one number and orange hops mark multiples of another. Green vertical connectors mark shared landings and the first one is the LCM.',
 staticAlt:'On the upper track, multiples of 3 are 3, 6, 9, 12, 15... On the lower track, multiples of 4 are 4, 8, 12, 16... First common landing is 12; later ones are 24 and 36.',
 render(i,stage){let s=STEPS[i];showStage(stage,3,4,null,{phase:s.phase,caption:s.name,say:s.say,animate:i>0});},
 exploreIntro:'Change both jump lengths. Find their first shared landing.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let pre=C.preset,a=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("a",()=>(C.presets[pre].a)):(C.presets[pre].a)),b=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("b",()=>(C.presets[pre].b)):(C.presets[pre].b)),selected=null,feedback='Place the ring at the first shared landing.',bad=false,speech='explore',revealed=false;
  window.NovaLessonComponent?.applyExploreModels();const preset=H('select',{'aria-label':'Curriculum preset'}),ina=H('input',{type:'number',min:2,max:12,value:a,'aria-label':'Track A jump size'}),inb=H('input',{type:'number',min:2,max:12,value:b,'aria-label':'Track B jump size'}),landing=H('input',{type:'number',min:1,'aria-label':'Candidate landing value'}),status=H('p',{class:'f308-status',role:'status'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([id,v])=>preset.add(new Option(v.label,id)));
  window.NovaLessonComponent?.applyExploreModels();function speak(t,isBad=false,key='right'){feedback=t;bad=isBad;speech=isBad?'wrong':key;}
  window.NovaLessonComponent?.applyExploreModels();function place(v){emit('marker',v);const why=reason(a,b,v);if(why){speak(why,true);status.textContent=feedback;status.classList.add('bad');return false;}
   selected=v;revealed=true;speak('First shared landing found!',false,'right');render();return true;}
  window.NovaLessonComponent?.applyExploreModels();function remove(){selected=null;revealed=false;emit('remove',true);speak('Find the first shared landing again.',false,'remove');render();}
  window.NovaLessonComponent?.applyExploreModels();function reset(){selected=null;revealed=false;speak('Place the marker!',false,'explore');render();}
  window.NovaLessonComponent?.applyExploreModels();function render(){panel.innerHTML='';preset.value=pre;ina.value=a;inb.value=b;showStage(stage,a,b,selected,{caption:'Explore the jump tracks',say:speech,interactive:true,place,remove,hideAnswers:true,proved:revealed});
   panel.append(H('div',{class:'f308-row'},[H('label',{},['Preset',preset]),H('label',{},['Track A',ina]),H('label',{},['Track B',inb])]),
    H('p',{class:'f308-help',text:'Drag the question-mark ring to the first landing shared by both lines. Or enter a landing value.'}),
    H('div',{class:'f308-row'},[H('label',{},['Landing',landing]),action('Place marker',()=>place(+landing.value),true),action('Remove marker',remove),action('Reset',reset)]),status);
   status.textContent=feedback;status.classList.toggle('bad',bad);}
  window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{pre=preset.value;a=C.presets[pre].a;b=C.presets[pre].b;emit('preset',pre);reset();};
  window.NovaLessonComponent?.applyExploreModels();ina.onchange=()=>{a=Math.min(12,Math.max(2,Math.floor(+ina.value||3)));emit('multipleA',a);reset();};
  window.NovaLessonComponent?.applyExploreModels();inb.onchange=()=>{b=Math.min(12,Math.max(2,Math.floor(+inb.value||4)));emit('multipleB',b);reset();};window.NovaLessonComponent?.applyExploreModels();render();},
 challenge(panel,api,stage){let task=0,selected=null,guess='',won=false,feedback='Place the ring and enter the lowest common multiple.',bad=false,speech='ready';
  const input=H('input',{type:'number',min:1,'aria-label':'Lowest common multiple answer'}),landing=H('input',{type:'number',min:1,'aria-label':'Landing to mark'}),status=H('p',{class:'f308-status',role:'status'});
  const cur=()=>C.challenge[task];
  function fail(msg){api.check(false,msg,{task});feedback=msg;bad=true;speech='wrong';render();return false;}
  function place(v){let {a,b}=cur(),why=reason(a,b,v);emit('marker',v);if(why){feedback=why;bad=true;speech='wrong';status.textContent=feedback;status.classList.add('bad');return false;}
   selected=v;feedback='Correct landing. Now prove the number.';bad=false;speech='right';render();return true;}
  function remove(){selected=null;emit('remove',true);feedback='Marker returned. Find the first shared landing.';bad=false;speech='remove';render();}
  function prove(){let {a,b}=cur(),v=Number(input.value);guess=input.value;emit('lcmGuess',v);
   if(selected!==lcm(a,b))return fail('Place the ring on the FIRST shared landing before checking.');
   const why=reason(a,b,v);if(why)return fail(why);
   api.check(true,'LCM proved.',{task,a,b,lcm:v});emit('proof',{task,lcm:v});
   if(task===C.challenge.length-1){won=true;feedback='Three shared landings proved!';speech='win';render();return true;}
   task++;selected=null;guess='';feedback='Next pair of jump tracks!';bad=false;speech='ready';render();return true;
  }
  function render(){panel.innerHTML='';const {a,b}=cur();showStage(stage,a,b,selected,{caption:`Challenge ${task+1} of ${C.challenge.length} · jumps of ${a} and ${b}`,say:speech,interactive:!won,place,remove,hideAnswers:true,proved:won});
   if(won){panel.append(H('div',{class:'f308-win',text:'Brilliant! All three lowest-common-multiple proofs are complete.'}));return;}
   panel.append(H('p',{class:'f308-help',text:`Challenge ${task+1} of 3. Find the earliest positive landing shared by jumps of ${a} and ${b}. Drag the ring or place it by number, then enter the LCM.`}),
   H('div',{class:'f308-row'},[H('label',{},['Landing',landing]),action('Place ring',()=>place(+landing.value)),action('Remove',remove),action('Hint',()=>{api.hint('List each set of landings in order. The first number in both lists is the LCM.');speech='hint';render();})]),
   H('div',{class:'f308-row'},[H('label',{},['LCM answer',input]),action('Check proof',prove,true)]),status);
   input.value=guess;input.oninput=()=>guess=input.value;status.textContent=feedback;status.classList.toggle('bad',bad);
  }render();},onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['multiples','LCM','number lines','common multiples'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F1-01','F3-07']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"dock":["stage","key"],"showStage":["stage","a","b","selected","opt"]},exploreFields:{"a":{"kind":"value","factory":null,"argCount":null},"b":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'08',title:'Multiples Overlap Tracks · Premium Review',def,linked:['F1-01','F3-04','F3-07','F3-09'],years:'Year 7 · Factors and multiples, HCF/LCM',spec:{
 purpose:'Use shared-scale number lines and explicit hops to prove common multiples and the lowest common multiple.',
 params:'Whole-number jump lengths 2–12, same maximum scale for both tracks, displayed up to 144.',
 presets:'Y7-013: jumps 3 and 4; Y7-016: jumps 6 and 8.',
 steps:'Introduce shared scale → hops of first number → hops of second → first coincidence → later coincidences → proof.',
 interactions:'F0 SVG drag ring to first common landing; green target highlight; reject invalid/non-first multiples; remove zone; keyboard number entry; three proofs.',
 traps:'A multiple on only one track is not common; later common multiples are not the lowest; zero is not the positive LCM.',
 gcse:'Extends to cycle/timing and prime-factor LCM problems via F3-07.'}});
// F3-05..07 pointer-capture recovery. Keeps the canonical F0 source byte-for-byte intact.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;
  if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
  d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));
 },true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA mathematics helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{subtree:true,childList:true});
})();
