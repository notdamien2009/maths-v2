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

/* NOVA F6-14 Ratio and Fraction Translator · F0 v3.6.2 original primitives only.
   No changes to the shared F0 core. Owner-approved stacked chalk fractions. */
const F614_CONFIG = {
 id:'F6-14', startMode:'watch',preset:'Y7-059',
 parameters:{a:2,b:3,labels:['Ava','Ben'],fractions:'stacked',normalize:true},
 presets:{
  'Y7-059':{label:'Y7-059 · Sharing two to three',a:2,b:3,names:['Ava','Ben'],context:'Ava and Ben share equal parts in the ratio 2:3.'},
  'Y7-059-garden':{label:'Y7-059 · Garden plots',a:3,b:5,names:['Flowers','Vegetables'],context:'Three parts flowers to five parts vegetables.'},
  'Y7-059-study':{label:'Y7-059 · Study subjects',a:1,b:4,names:['Art','Maths'],context:'One part art to four parts maths.'},
  'Y7-059-points':{label:'Y7-059 · Team points',a:5,b:7,names:['Blue','Teal'],context:'Five parts blue to seven parts teal.'}
 },events:['value','correct','step','hintUsed']
};window.F614_CONFIG=F614_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=window.NovaV2Integration.configuration(F614_CONFIG),ID=C.id;
const STEPS=[
 {name:'Notice the two-part ratio',pose:'explain',caption:'First, count the groups.',narration:'A ratio compares parts. In two to three, the first group has two equal parts and the second has three.'},
 {name:'Build the one-whole bar',pose:'point-down',caption:'Together, they make one whole.',narration:'Join all the equally sized parts into one whole. Each outlined box represents exactly one equal part.'},
 {name:'Count the denominator',pose:'count',caption:'Count every equal box.',narration:'Add two and three. There are five equal parts in the whole. Five becomes the denominator for both fractions.'},
 {name:'Translate the first part',pose:'point',caption:'Ava has two of five.',narration:'The first group owns two of the five equal parts. Its fraction of the whole is two fifths, not two thirds.'},
 {name:'Translate the second part',pose:'count',caption:'Ben has three of five.',narration:'The second group owns the other three parts. Its fraction of the whole is three fifths.'},
 {name:'Prove the whole',pose:'celebrate',caption:'Both fractions make one whole!',narration:'Two fifths plus three fifths equals five fifths, which is one whole. Both fractions use the same denominator.'}
];
const fmt=n=>String(n),total=p=>p.a+p.b,frac=(n,d)=>[n,d],eq=(x,y)=>!!x&&!!y&&x[0]*y[1]===y[0]*x[1];
function options(p){const t=total(p),pairs=[[p.a,t],[p.b,t],[p.a,p.b],[p.b,p.a],[p.a,p.a],[p.b,p.b]];return [pairs[2],pairs[0],pairs[3],pairs[1]];}
function emit(type,data={}){N.events.emit(type,Object.assign({engine:ID,preset:C.preset},data));}
const chalk=(svg,x,y,s,role='given',size=26)=>N.chalkText(svg,x,y,String(s),{role,size});
const button=(s,fn,cls='nova-btn')=>H('button',{text:s,class:cls,onclick:fn});
function fraction(svg,x,y,n,d,role='given',scale=1,unknown=false){
 const g=E('g',{class:'f614-frac',role:'img','aria-label':unknown?'Unknown fraction':n+' over '+d},svg);const ww=75*scale;
 if(unknown){chalk(g,x,y-4,'?',role,35*scale);N.neonLine(g,x-ww*.48,y+11,x+ww*.48,y+11,{role:'unknown',width:2.7*scale});chalk(g,x,y+54*scale,'?',role,35*scale);}
 else {chalk(g,x,y-5,n,role,38*scale);N.neonLine(g,x-ww*.47,y+12*scale,x+ww*.47,y+12*scale,{role,width:3*scale});chalk(g,x,y+56*scale,d,role,38*scale);}
 return g;
}
function equalSegment(svg,x,y,w,h,role,active,i){
 const g=N.neonBox(svg,x+3,y,w-6,h,{role:active?role:'given',r:12});
 if(active){N.neonLine(svg,x+11,y+h-13,x+w-11,y+h-13,{role,width:3});}
 return g;
}
function evidence(head,value,sub,role='given'){const el=H('p',{class:'f614-card-value'});if(value.includes('\\frac'))el.append(N.mt.render(value));else el.textContent=value;return N.neonCard([H('p',{class:'f614-card-head',text:head}),el,H('p',{class:'f614-card-sub',text:sub})],{role});}
function draw(stage,p,o={}){
if(window.NovaLessonComponent?.active){[stage,p,o]=window.NovaLessonComponent.args("draw",arguments);}

 const mobile=window.innerWidth<=760,W=mobile?500:1120,T=total(p),S=o.step??5,teach=o.mode==='watch'||o.mode==='guided',hidden=o.mode==='challenge'&&!o.solved;
 const Ht=mobile?1075:735,svg=N.svg.root(W,Ht,'One whole is split into '+T+' equal neon boxes. The first '+p.a+' belong to '+p.names[0]+' and the last '+p.b+' belong to '+p.names[1]+'. Translate each share into a stacked fraction of the whole.');
 svg.classList.add('f614-svg');svg.dataset.preset=o.preset||C.preset;svg.dataset.mode=o.mode||'watch';svg.dataset.total=String(T);svg.dataset.fracA=hidden?'hidden':p.a+'/'+T;svg.dataset.fracB=hidden?'hidden':p.b+'/'+T;
 stage.innerHTML='';N.cap(stage,ID,hidden?'TRANSLATE THE PARTS':o.mode==='explore'?'MATCH EACH FRACTION':'FROM A RATIO TO FRACTIONS');
 const layout=H('div',{class:'f614-layout'}),art=H('div',{class:'f614-art'}),side=H('aside',{class:'f614-side'});
 chalk(svg,W/2,57,'ONE WHOLE · TWO SHARES','given',mobile?32:48);
 chalk(svg,W/2,113,p.a+' : '+p.b,'focus',mobile?53:61);
 chalk(svg,W/2,mobile?150:147,'COUNT ALL THE EQUAL PARTS','op',mobile?23:28);
 // Bar uses a single equal-length unit throughout, exactly as the mathematical definition requires.
 const barX=mobile?25:80,barW=mobile?450:955,barY=mobile?206:180,barH=mobile?98:96,seg=barW/T;
 for(let i=0;i<T;i++){
  const role=i<p.a?'given':'op';if(S>=1||!teach){const unitBox=equalSegment(svg,barX+i*seg,barY,seg,barH,role,true,i);if(teach&&S===1&&!N.reducedMotion())M.arrive(unitBox,0,-22,270+i*42,M.ease.out);chalk(svg,barX+(i+.5)*seg,barY+59,i<p.a?'A':'B',role,Math.min(mobile?26:33,seg*.65));}
  else {N.neonRing(svg,barX+(i+.5)*seg,barY+49,{role,r:Math.min(seg*.27,18)});}
 }
 N.neonLine(svg,barX+p.a*seg,barY-10,barX+p.a*seg,barY+barH+10,{role:'result',width:4});
 N.svg.brace(svg,barX,barY+barH+33,barX+barW,barY+barH+33,{role:'given',depth:17});
 chalk(svg,W/2,mobile?395:356,S>=2||!teach?T+' EQUAL PARTS = ONE WHOLE':'HOW MANY PARTS IN ALL?',S>=2||!teach?'result':'unknown',mobile?29:38);
 // Separate full-size fraction-of-whole rulers. No decoration; every length is an equal fraction.
 const rows=mobile?[{cy:499,by:620,role:'given',who:p.names[0],n:p.a},{cy:754,by:870,role:'op',who:p.names[1],n:p.b}]:[{cy:436,by:562,role:'given',who:p.names[0],n:p.a},{cy:436,by:562,role:'op',who:p.names[1],n:p.b}];
 rows.forEach((r,k)=>{
  const sectionX=mobile?25:k===0?66:611,sectionW=mobile?450:446,xcenter=sectionX+sectionW/2;
  const show=(!teach||S>=(k===0?3:4))&&!hidden;
  chalk(svg,mobile?102:sectionX+68,r.cy-6,r.who,r.role,mobile?30:31);
  chalk(svg,mobile?147:sectionX+130,r.cy+34,r.n+' PART'+(r.n===1?'':'S'),r.role,mobile?21:24);
  fraction(svg,mobile?351:xcenter+105,r.cy-31,r.n,T,r.role,mobile?.91:.83,!show);
  const h=mobile?78:92,w=sectionW/T;
  for(let i=0;i<T;i++){
   const filled=i<r.n;
   const partBox=N.neonBox(svg,sectionX+i*w+2,r.by,w-4,h,{role:filled?r.role:'given',r:7});if(teach&&S===k+3&&filled&&!N.reducedMotion())M.arrive(partBox,0,18,300+i*48,M.ease.out);
   if(filled&&(S>=k+3||!teach)){N.neonLine(svg,sectionX+i*w+10,r.by+h-13,sectionX+(i+1)*w-10,r.by+h-13,{role:r.role,width:3});}
  }
  /* Both groups already carry explicit equal-part counts above: avoid mobile overlap. */
 });
 const footer=mobile?1039:702;
 chalk(svg,W/2,footer,hidden?'WHICH FRACTIONS MATCH THE GROUPS?':S>=5||!teach?'A PART + B PART = ONE WHOLE':'EVERY PART HAS THE SAME DENOMINATOR',hidden?'unknown':'result',mobile?23:31);
 side.append(evidence('WHOLE',T+' equal parts','Add the ratio parts to count the denominator.','given'));
 side.append(evidence(p.names[0],hidden?'?':'\\frac{'+p.a+'}{'+T+'}',hidden?'First share: choose a fraction.':p.a+' equal parts out of '+T+'.','focus'));
 side.append(evidence(p.names[1],hidden?'?':'\\frac{'+p.b+'}{'+T+'}',hidden?'Second share: choose a fraction.':p.b+' equal parts out of '+T+'.','op'));
 if(!hidden)side.append(evidence('WHOLE CHECK',p.a+' + '+p.b+' = '+T,'Numerators add to the denominator.','result'));
 art.append(svg);layout.append(art,side);stage.append(layout);
 if(o.dock)stage.append(drawDock(p,o));
 N.scene.helperStrip(stage,o.pose||'explain',o.caption||'How many equal parts make one whole?');
 return svg;
}
function drawDock(p,o){const mobile=window.innerWidth<=760,W=mobile?500:1120,Ht=mobile?375:282;
 const svg=N.svg.root(W,Ht,'Move the stacked fraction cards into matching A and B drop targets; red tray returns cards.');svg.classList.add('f614-svg','f614-dock');svg.dataset.kind='fraction-dock';
 chalk(svg,W/2,41,'DRAG A FRACTION TO EACH SHARE','given',mobile?23:30);
 const A=mobile?[143,124]:[234,110],B=mobile?[357,124]:[531,110],R=mobile?[253,233]:[919,110];
 function drop([x,y],label,role,value){N.neonBox(svg,x-91,y-41,182,87,{role,r:15});chalk(svg,x,y-13,label,role,23);
 if(value!=null){const z=o.options[value];fraction(svg,x,y+3,z[0],z[1],role,.62);}else chalk(svg,x,y+24,'PLACE HERE','unknown',21);}
 drop(A,'A PART','focus',o.placed?.[0]);drop(B,'B PART','op',o.placed?.[1]);
 N.neonBox(svg,R[0]-86,R[1]-39,172,81,{role:'error',r:12});chalk(svg,R[0],R[1]+7,'RETURN','error',27);
 const avail=o.options||options(p),xs=mobile?[57,184,311,438]:[132,349,565,781],cy=mobile?334:218;
 avail.forEach(([n,d],i)=>{
  const x=xs[i],g=E('g',{class:'f614-drag','data-chip':i,role:'button',tabindex:0,'aria-label':n+' over '+d+'; press A or B to place; Delete to return'},svg);
  N.neonBox(g,x-51,cy-38,102,72,{role:i===0?'focus':i===1?'op':'given',r:12});fraction(g,x,cy-14,n,d,'given',.72);
  g.addEventListener('keydown',e=>{const ch=e.key.toLowerCase();if(ch==='a'||ch==='b'||e.key==='Enter'||e.key===' '){e.preventDefault();o.onPlace(ch==='b'?1:0,i);}else if(['delete','backspace','escape'].includes(ch)){e.preventDefault();o.onReturn(i);}});
  const zones=[{id:'a',kind:'drop',x:A[0]-91,y:A[1]-41,w:182,h:87},{id:'b',kind:'drop',x:B[0]-91,y:B[1]-41,w:182,h:87},{id:'return',kind:'remove',x:R[0]-86,y:R[1]-39,w:172,h:81}];
  N.ui.svgDrag(svg,g,{box:{x:x-51,y:cy-38,w:102,h:72},zones:()=>zones,
   onDrop:id=>{Promise.resolve().then(()=>o.onPlace(id==='a'?0:1,i));return true;},onRemove:()=>Promise.resolve().then(()=>o.onReturn(i))});
 });return svg;}
window.addEventListener('pointerup',e=>{const v=N.ui._drag;if(!v||!v.el?.classList.contains('f614-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===v)v.up(e);});},true);
function render(step,stage){const s=STEPS[step],p=C.presets[C.preset];const art=draw(stage,p,{mode:'watch',step,pose:s.pose,caption:s.caption});emit('step',{index:step,name:s.name,narration:s.narration});if(step===5&&!N.reducedMotion())M.flash(art,window.innerWidth<=760?250:560,window.innerWidth<=760?390:345,'result',30);}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let id=C.preset,placed=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("placed",()=>([null,null])):([null,null])),message=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("message",()=>('Match each stacked fraction to the correct share of the whole.')):('Match each stacked fraction to the correct share of the whole.'));
 window.NovaLessonComponent?.applyExploreModels();const select=H('select',{'aria-label':'Choose a ratio example'});window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([key,p])=>select.append(H('option',{value:key,text:p.label})));window.NovaLessonComponent?.applyExploreModels();select.value=id;
 window.NovaLessonComponent?.applyExploreModels();const row=H('div',{class:'f614-controls'}),actions=H('div',{class:'f614-controls'}),feedback=H('p',{class:'f614-feedback','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();row.append(H('label',{class:'f614-field'},['Ratio context ',select]));window.NovaLessonComponent?.applyExploreModels();actions.append(button('Check matches',check,'nova-btn primary'),button('Hint',hint),button('Reset',reset));
 window.NovaLessonComponent?.applyExploreModels();panel.append(row,H('p',{class:'f614-tip',text:'Count ALL the parts for the denominator. Drag a fraction into A or B; press A/B from the keyboard, or Delete to return.'}),actions,feedback);
 window.NovaLessonComponent?.applyExploreModels();const p=()=>C.presets[id];window.NovaLessonComponent?.applyExploreModels();const op=()=>options(p());
 window.NovaLessonComponent?.applyExploreModels();function paint(pose='point',caption='Count all parts for the denominator.'){draw(stage,p(),{mode:'explore',preset:id,placed:placed.slice(),options:op(),dock:true,onPlace:place,onReturn:remove,pose,caption});feedback.textContent=message;}
 window.NovaLessonComponent?.applyExploreModels();function place(side,index){placed[side]=index;message=side?'Fraction placed for '+p().names[1]+'.':'Fraction placed for '+p().names[0]+'.';emit('value',{side,index,fraction:op()[index]});paint('point','Now check both fractions.');}
 window.NovaLessonComponent?.applyExploreModels();function remove(i){placed=placed.map(v=>v===i?null:v);message='Fraction returned to tray.';emit('value',{removed:i});paint('explain','Try another fraction.');}
 window.NovaLessonComponent?.applyExploreModels();function check(){let A=placed[0]==null?null:op()[placed[0]],B=placed[1]==null?null:op()[placed[1]],t=total(p()),ok=eq(A,[p().a,t])&&eq(B,[p().b,t]);
  if(!A||!B)message='Put one fraction in BOTH parts before checking.';
  else if(ok)message='Correct! '+p().a+' of '+t+' and '+p().b+' of '+t+' add to the whole.';
  else if(eq(A,[p().b,t])&&eq(B,[p().a,t]))message='You reversed the two shares. Follow the order in the ratio.';
  else if((A[1]===p().b)||(B[1]===p().a))message='The denominator counts ALL parts, not only the opposite group.';
  else message='Not yet. Add the ratio parts and use that SAME denominator for both fractions.';
  feedback.className='f614-feedback '+(ok?'good':'bad');emit('correct',{correct:ok,placed:placed.slice()});paint(ok?'celebrate':'not-yet',ok?'Both parts make one whole!':'Count the denominator again.');}
 window.NovaLessonComponent?.applyExploreModels();function hint(){message='There are '+p().a+' + '+p().b+' = '+total(p())+' equal parts in the whole. Both fractions use '+total(p())+' below the bar.';emit('hintUsed',{preset:id});paint('count','Use all the equal parts.');}
 window.NovaLessonComponent?.applyExploreModels();function reset(){placed=[null,null];message='Reset. Begin with the equal-part boxes.';feedback.className='f614-feedback';paint('explain','Count the whole.');}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=()=>{id=select.value;C.preset=id;reset();};window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({id,placed:placed.slice(),feedback:message}),place,remove,check,hint,reset,setPreset:key=>{select.value=key;select.onchange();}};window.NovaLessonComponent?.applyExploreModels();paint();}
function challenge(panel,api,stage){const ids=Object.keys(C.presets);let idx=0,placed=[null,null],solved=false,completed=0,message='';
 const question=H('p',{class:'f614-question'}),actions=H('div',{class:'f614-controls'}),feedback=H('p',{class:'f614-feedback','aria-live':'polite'}),progress=H('p',{class:'f614-progress'}),checkBtn=button('Check translation',check,'nova-btn primary'),nextBtn=button('Next challenge',next);nextBtn.disabled=true;
 actions.append(checkBtn,button('Hint',hint),nextBtn);panel.append(question,actions,feedback,progress);
 const id=()=>ids[idx],p=()=>C.presets[id()],op=()=>options(p());
 function paint(pose=solved?'celebrate':'think',caption=solved?'Both fractions make one whole!':'Count all parts first.'){
  question.textContent=(idx+1)+' / '+ids.length+' · '+p().context+' Drag the correct fraction onto each labelled part.';
  progress.textContent='Completed: '+completed+' / '+ids.length;
  feedback.textContent=message;
  draw(stage,p(),{mode:'challenge',preset:id(),solved,placed:placed.slice(),dock:!solved,options:op(),onPlace:place,onReturn:remove,pose,caption});}
 function place(side,index){if(solved)return;placed[side]=index;message='Fraction placed. Translate both parts before checking.';emit('value',{mode:'challenge',side,index});paint();}
 function remove(i){if(solved)return;placed=placed.map(v=>v===i?null:v);message='Fraction removed. Try again.';paint();}
 function check(){if(solved)return;const v=p(),t=total(v),A=placed[0]==null?null:op()[placed[0]],B=placed[1]==null?null:op()[placed[1]],ok=eq(A,[v.a,t])&&eq(B,[v.b,t]);
  if(!A||!B)message='Place two fractions, one for each labelled share.';
  else if(ok){message='Correct! '+v.a+' over '+t+' plus '+v.b+' over '+t+' equals one whole.';solved=true;completed++;checkBtn.disabled=true;nextBtn.disabled=false;}
  else if(eq(A,[v.b,t])&&eq(B,[v.a,t]))message='The parts have been swapped. The first ratio number belongs to '+v.names[0]+'.';
  else if((A[1]===v.b)||(B[1]===v.a))message='You used the other group as the denominator. Count ALL equal parts for each fraction.';
  else message='Not yet. Both denominators must equal '+t+', the total count of equal parts.';
  feedback.className='f614-feedback '+(ok?'good':'bad');api.check(ok,message,{preset:id(),chosen:[A,B],expected:[[v.a,t],[v.b,t]]});emit('correct',{correct:ok,mode:'challenge'});paint();
  if(ok&&!N.reducedMotion()){const s=stage.querySelector('.f614-svg');if(s)M.flash(s,250,315,'result',30);}}
 function hint(){message='Add '+p().a+' and '+p().b+' for the denominator. Then count the A and B boxes separately.';api.hint(message);emit('hintUsed',{preset:id()});paint('point-down','Both fractions share a denominator.');}
 function next(){if(!solved)return;if(idx===ids.length-1){stage.innerHTML='';N.cap(stage,ID,'ALL FRACTIONS TRANSLATED');N.scene.helperStrip(stage,'celebrate','Every part belongs to the same whole!');question.textContent='You completed every ratio-to-fraction challenge.';actions.hidden=true;return;}
  idx++;placed=[null,null];solved=false;message='';feedback.className='f614-feedback';checkBtn.disabled=false;nextBtn.disabled=true;paint();}
 C._challenge={get:()=>({idx,placed:placed.slice(),solved,completed,feedback:message}),place,remove,check,hint,next};paint();}
const DEF={id:ID,title:'Ratio and Fraction Translator',config:C,steps:STEPS,render,explore,challenge,
 alt:'One neon equal-part bar shows a ratio A to B. Two linked fraction bars highlight A and B as fractions of the same whole, displayed in traditional stacked NOVA Chalk notation.',
 staticAlt:'For a 2:3 ratio, the whole has five equal parts. The first fraction is two fifths and the second three fifths. They add to one.',
 spec:{purpose:'Translate each part of a two-part ratio into a fraction of one whole, using equal-part models rather than a memorised rule.',params:'Positive integer ratio parts, names/context, show or conceal explanation, placements and stage.',presets:'Y7-059 sharing, gardens, study subjects and team points. GCSE extension up to three-part ratios.',steps:'Notice ratio → assemble one whole → count equal parts → fraction for first part → fraction for second part → prove sum is one.',interactions:'Drag traditionally stacked fraction tags to A and B with F0 SVG snap, re-grab/return, keyboard A/B/Delete, misconception marking.',traps:'Wrong denominator (other part), reversing share order, using whole as numerator, failing to recognise fractions sum to one.',gcse:'Generalise a:b to a/(a+b) and b/(a+b), and extend to three-part shares.'}};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","p","o"]},exploreFields:{"placed":{"kind":"value","factory":null,"argCount":null},"message":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F6·14',title:DEF.title,spec:DEF.spec,def:DEF,years:'Year 7; GCSE ratio-fraction extension',linked:['F0-02','F0-04','F0-05','F6-03','F5-13']});
window.F614={config:C,math:{total,frac,options,eq},steps:STEPS};
})();
