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


/* NOVA F8-01 — Step-by-step Working Animator. Fresh October 2026 build.
   Uses the established F0 core; no changes to canonical shared helpers. */
window.F801_CONFIG = Object.freeze({
  id:'F8-01', title:'Step-by-step Working Animator', family:'F8',
  startMode:'guided', preset:'Y7-018',
  parameters:{lessons:['Y7-018','Y8-011','Y8-012','Y8-015'], steps:3, allowKeyboard:true},
  events:{value:['preset','workingStep','operation','remove','choice','reset','variant'],system:['step','mode','correct','hintUsed']},
  references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F0-13','F3-02','F7-03']
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F8-01',C=window.NovaV2Integration.configuration(window.F801_CONFIG);
const presets={
  'Y7-018': {title:'Priority of operations',eyebrow:'BRACKETS · MULTIPLY · SUBTRACT',lesson:'Y7 · ORDER OF OPERATIONS',
    lines:['18 − 3 × (2 + 4)','18 − 3 × 6','18 − 18','0'],
    ops:['Brackets','Multiply','Subtract'],roles:['focus','op','given'],
    focus:['(2 + 4)','3 × 6','18 − 18'],
    short:['Brackets first.','Multiply before subtracting.','Now subtract.','Zero is the result.'],
    why:['The expression inside brackets is one whole calculation.','Multiplication must happen before the final subtraction.','Only subtraction remains. The value stays equal at every step.'],
    traps:[['18 − 3 × 2 + 4','You ignored the bracket. Evaluate 2 + 4 together.'],['15 × 6','You subtracted before multiplying. Multiply 3 × 6 first.'],['36','Recheck the subtraction: 18 minus 18 is zero.']]},
  'Y8-011': {title:'Expanding double brackets',eyebrow:'DISTRIBUTE · GROUP · SIMPLIFY',lesson:'Y8 · ALGEBRAIC EXPANSION',
    lines:['(x + 3)(x + 2)','x² + 2x + 3x + 6','x² + (2 + 3)x + 6','x² + 5x + 6'],
    ops:['Distribute','Group terms','Simplify'],roles:['op','focus','result'],
    focus:['Each term × each term','2x + 3x','2 + 3'],
    short:['Every term meets every term.','Find the like terms.','Combine the x terms.','Four products, one expression.'],
    why:['Multiply x by x and 2, then 3 by x and 2. All four products must appear.','Only terms with the same variable and power can combine.','The coefficient 2 + 3 becomes 5. The x squared and constant terms remain.'],
    traps:[['x² + 6','You missed the two cross-products: 2x and 3x.'],['x² + 6x + 6','2x + 3x gives 5x, not 6x.'],['x² + 5 + 6','The x must stay attached to the coefficient 5.']]},
  'Y8-012': {title:'Factorising common factors',eyebrow:'FIND · DIVIDE · PROVE',lesson:'Y8 · FACTORISING',
    lines:['12x + 18','6 × 2x + 6 × 3','6(2x + 3)','12x + 18 ≡ 6(2x + 3)'],
    ops:['Find factor 6','Factor out 6','Show identity'],roles:['focus','op','result'],
    focus:['12x and 18','Both terms contain 6','Expand to check'],
    short:['Six divides both terms.','Write the common factor.','Keep what remains inside.','Expansion proves the identity.'],
    why:['Six is a common factor of 12 and 18. We can express both terms as multiples of six.','Place the common six outside a bracket and write 2x and 3 inside.','Distributing 6 across the bracket gives the original expression for every x.'],
    traps:[['6(12x + 18)','You must divide both original terms by 6 inside the bracket.'],['6(2x + 18)','You divided 12x, but forgot to divide 18.'],['6(2x + 3) = 12x + 3','Distribute 6 to both terms. Six times three equals eighteen.']]},
  'Y8-015': {title:'Equations with fractions',eyebrow:'UNDO · MULTIPLY · VERIFY',lesson:'Y8 · SOLVING EQUATIONS',
    lines:['\\frac{x}{3} + 2 = 7','\\frac{x}{3} = 5','x = 15','\\frac{15}{3} + 2 = 7'],
    ops:['Subtract 2','Multiply by 3','Substitute to check'],roles:['op','focus','result'],
    focus:['+ 2','x divided by 3','x = 15'],
    short:['Undo the plus two.','Multiply both sides by three.','The unknown is fifteen.','Substitution checks the answer.'],
    why:['Subtract two from both sides, keeping the equation balanced.','Multiply both sides by three to undo division by three.','When x is fifteen, the original left side becomes five plus two, which is seven.'],
    traps:[['\\frac{x}{3} = 9','Subtract 2 from 7, not add it.'],['x = \\frac{5}{3}','Undo division by three by multiplying by three.'],['\\frac{15}{3} + 2 = 5','Evaluate the whole original expression, including plus two.']]}
};
const presetIds=Object.keys(presets);const pose=['explain','point-down','count','point-right','think','show-one','celebrate'];
const state={preset:'Y7-018',mode:'guided',visible:0,step:0,selected:null,pending:null,challenge:0,choice:-1,score:0,feedback:'',mistakes:0};
function emit(key,value){if(!C.events.value.includes(key))throw Error('F8-01 event not declared '+key);N.events.emit('value',{engine:ID,key,value});}
function spec(){return {purpose:'Show each mathematically valid transformation on a structured chalk working column, so pupils can identify what changed and why.',params:'Preset, current transformation, valid operation, equation/expression form, challenge response.',presets:presetIds.map(k=>k+' · '+presets[k].title).join('; '),steps:'Start → focus → next line → focus → next line → focus → conclusion.',interactions:'Drag operation pills to the next working line, return/undo a placed operation, choose equivalent next line, keyboard and touch alternatives.',traps:'Wrong operation order; lost cross-products; missed common factor; inverse operations applied incorrectly.',gcse:'Higher extensions: non-linear rearrangement and longer worked chains; this run covers the four named KS3 lesson presets.'};}
function roleColor(role){return N.svg.c(role||'given');}
function view(){return innerWidth<=760?{w:440,h:690,x:19,card:402,rowH:100,rows:[60,178,296,414],font:27,pillW:154,pillH:39,trayY:582,opX:247}: {w:1040,h:650,x:34,card:971,rowH:101,rows:[57,174,291,408],font:38,pillW:221,pillH:47,trayY:541,opX:765};}
function svgText(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,t,{role:role||'given',size:size||26,anchor:anchor||'start'});}
function drawEquation(svg,text,x,baseline,font){
  const frac=String(text).match(/\\frac\{([^{}]+)\}\{([^{}]+)\}/);
  if(!frac){const t=svgText(svg,x,baseline,text,'given',font,'start');t.setAttribute('text-anchor','start');return;}
  const before=text.slice(0,frac.index),after=text.slice(frac.index+frac[0].length),prefixWidth=before.length*font*.61;
  if(before){const pre=svgText(svg,x,baseline,before,'given',font,'start');pre.setAttribute('text-anchor','start');}
  const fx=x+prefixWidth,fw=Math.max(font*1.15,Math.max(frac[1].length,frac[2].length)*font*.58+18);
  const a=svgText(svg,fx+fw/2,baseline-font*.47,frac[1],'given',font*.79,'middle');a.setAttribute('text-anchor','middle');
  const b=svgText(svg,fx+fw/2,baseline+font*.5,frac[2],'given',font*.79,'middle');b.setAttribute('text-anchor','middle');
  N.neonLine(svg,fx+3,baseline-font*.19,fx+fw-3,baseline-font*.19,{role:'given',width:2.2});
  if(after){const post=svgText(svg,fx+fw+13,baseline,after,'given',font*.93,'start');post.setAttribute('text-anchor','start');}
}
function surface(stage){
if(window.NovaLessonComponent?.active){[stage]=window.NovaLessonComponent.args("surface",arguments);}
stage.innerHTML='';stage.classList.add('f801-stage');}
function pill(svg,x,y,text,role,config){const g=N.neonBox(svg,x,y,config.w,config.h,{role:role||'op',r:12});g.classList.add('f801-pill');
 const t=svgText(g,x+config.w/2,y+config.h/2+7,text,role||'op',config.font||18,'middle');t.setAttribute('text-anchor','middle');return g;}
function clickable(g,name,cb){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',name);g.classList.add('f801-click');g.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();cb();}});g.addEventListener('click',cb);return g;}
function renderStage(stage,opts={}){
if(window.NovaLessonComponent?.active){[stage,opts]=window.NovaLessonComponent.args("renderStage",arguments);}

  const p=presets[opts.preset||state.preset],V=view();surface(stage);
  N.cap(stage,'F8-01 · '+p.title,opts.mode==='challenge'?'CHECK THE METHOD':opts.mode==='explore'?'BUILD THE WORKING':'FOLLOW THE WORKING');
  const svg=N.svg.root(V.w,V.h,'Four maths working lines showing valid equivalent transformations for '+p.title+'.');svg.classList.add('f801-svg');svg.setAttribute('data-preset',opts.preset||state.preset);svg.setAttribute('data-mode',opts.mode||state.mode);
  const idx=opts.phase==null?6:opts.phase,limit=opts.limit==null?Math.min(3,Math.floor((idx+1)/2)):opts.limit;
  const focus=(idx%2===1)?Math.floor(idx/2):-1;
  svgText(svg,V.x+10,31,p.lesson,'support',V.font*.64,'start');
  const cX=V.x+10,cW=V.card-20;
  N.neonLine(svg,cX+22,V.rows[0]+81,cX+22,V.rows[3]-10,{role:'given',width:2.7});
  for(let i=0;i<4;i++){
    const y=V.rows[i],seen=i<=limit,upcoming=i>limit;
    if(!seen&&!upcoming)continue;
    const role=seen?(i===limit?'focus':i===3?'result':'given'):'unknown';
    const card=N.neonBox(svg,cX,y,cW,V.rowH,{role,r:17});card.classList.add('f801-work-card');if(seen&&i===limit)card.classList.add('f801-reveal');
    if(!seen)card.setAttribute('opacity',i===limit+1?'.34':'.20');
    N.neonRing(svg,cX+22,y+23,{role:seen?'given':'support',r:7,pulse:false});
    svgText(svg,cX+48,y+31,'LINE '+(i+1),'support',V.font*.52,'start');
    if(seen){drawEquation(svg,p.lines[i],cX+25,y+V.rowH*.77, V.font*(p.lines[i].length>24?.73: p.lines[i].length>18?.82:1));}
    else{svgText(svg,cX+25,y+V.rowH*.74,i===limit+1?'?   Next justified line':'···   Working to follow','unknown',V.font*.71,'start');}
    if(i<3&&seen){const opLabel=p.ops[i];const opacity=focus===i?1:i<limit?0.9:.36;
      if(opts.mode!=='challenge'&&opts.mode!=='explore' || i<limit){const chip=pill(svg,V.opX,y+9,opLabel,i<limit?'op':'focus',{w:V.pillW,h:V.pillH,font:V.w<600?17:23});chip.setAttribute('opacity',String(opacity));
        if(opts.mode==='explore'&&i<limit&&opts.onUndo){clickable(chip,'Return operation '+opLabel+' to the tray',()=>opts.onUndo(i));N.ui.svgDrag(svg,chip,{box:{x:V.opX,y:y+9,w:V.pillW,h:V.pillH},zones:()=>[{id:'return',kind:'remove',x:V.x+10,y:V.trayY-12,w:V.card-20,h:84}],onRemove:()=>opts.onUndo(i)});}}
    }
    if(i===focus&&opts.mode!=='challenge'&&opts.mode!=='explore'){
       const fragment=p.focus[i]||'',raw=p.lines[i].replaceAll(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'$1/$2'),at=raw.indexOf(fragment);
       const lineX=cX+25+(at>=0?at*V.font*.47:8),lineLen=(at>=0?Math.max(43,fragment.length*V.font*.49):Math.min(180,cW*.38));
       N.neonLine(svg,lineX,y+V.rowH-7,Math.min(cX+cW-18,lineX+lineLen),y+V.rowH-7,{role:'focus',width:3});
       const g=E('rect',{x:cX+5,y:y+6,width:cW-10,height:V.rowH-12,rx:14,class:'f801-focus-glow','pointer-events':'none'},svg);g.style.stroke=roleColor('focus');}
  }
  const isInteractive=opts.mode==='explore'||opts.mode==='challenge';
  if(isInteractive){
    const step=Math.min(limit,2),taskComplete=limit>=3;
    if(!taskComplete){
      svgText(svg,cX+3,V.trayY-18,'CHOOSE THE NEXT OPERATION','support',V.font*.56,'start');
      const choices=opts.opChoices||[p.ops[step], 'Add 1', 'Divide by 2'];
      const width=V.w<600?120:218;const gap=V.w<600?8:15;
      choices.forEach((value,i)=>{
        const x=cX+i*(width+gap),y=V.trayY,box=pill(svg,x,y,value,i===0?'op':'given',{w:width,h:V.w<600?45:51,font:V.w<600?14.5:20});
        const activate=()=>opts.onPick&&opts.onPick(value,step);
        clickable(box,'Choose '+value+' as the next operation',activate);
        if(opts.onPick)N.ui.svgDrag(svg,box,{box:{x,y,w:width,h:V.w<600?45:51},zones:()=>[{id:'slot',kind:'drop',x:V.opX,y:V.rows[Math.min(3,step+1)]+40,w:V.pillW,h:V.pillH+35}],onDrop:()=>{activate();return true;}});
      });
      N.neonBox(svg,V.opX,V.rows[Math.min(step+1,3)]+42,V.pillW,V.pillH,{role:'unknown'});
    }else{pill(svg,cX+40,V.trayY,'WORKING COMPLETE','result',{w:V.w<600?290:430,h:V.w<600?48:55,font:V.w<600?22:30});}
  }else{
    if(idx>=6){pill(svg,cX+30,V.trayY-1,state.preset==='Y8-015'?'SAME SOLUTIONS THROUGHOUT':'EACH LINE KEEPS THE SAME VALUE','result',{w:V.w<600?342:720,h:55,font:V.w<600?18:27});}
    else{const lineIdx=focus>=0?focus:Math.max(0,Math.floor(idx/2)-1);const hint=p.why[Math.min(2,lineIdx)];svgText(svg,cX+15,V.trayY+35,hint.length>48?hint.slice(0,48)+'…':hint,'support',V.w<600?15:20,'start');}
  }
  stage.appendChild(svg);
  const react=opts.message||(opts.mode==='explore'?p.short[Math.min(limit,3)]:opts.mode==='challenge'?'Find the next valid move.':p.short[Math.min(3,Math.floor(idx/2))]);
  N.scene.helperStrip(stage,opts.pose||(idx===6?'celebrate':pose[idx]||'explain'),react);
  const summary=H('div',{class:'f801-summary'});
  const label=idx===6?'Why this works':opts.mode==='challenge'?'Prove each step':opts.mode==='explore'?'What changes?':'Mathematical evidence';
  summary.appendChild(H('strong',{text:label}));
  const reason=opts.mode==='challenge'?'Choose a valid operation and the mathematically equivalent next line.': opts.mode==='explore'?'Drag an operation pill onto the outlined next line, or use Enter on the pill.':p.why[Math.min(2,focus>=0?focus:Math.max(0,Math.floor(idx/2)-1))];
  summary.appendChild(H('span',{text:reason}));stage.appendChild(summary);
  if(opts.mode==='challenge'&&N.helperImg){
    const peer=N.helperImg('read-tablet','teen');
    const peerRow=H('div',{class:'f801-challenge-peer','aria-label':'Izaac challenge peer'});
    peerRow.appendChild(H('span',{text:'Izaac · '+p.short[Math.min(limit,3)]}));
    peerRow.appendChild(H('img',{src:peer.src,alt:peer.alt,width:62,height:62}));
    stage.appendChild(peerRow);
  }
  return svg;
}
const STEPS=[
 {name:'Read the first line',mood:'focus',prompt:'What does the expression tell us?',narration:'Read the first line. We keep its value as the working develops.'},
 {name:'Identify the first operation',mood:'think',prompt:'Which operation belongs first?',narration:'Choose the first operation. Highlight the terms it will change.'},
 {name:'Write the next line',mood:'focus',prompt:'What stays the same?',narration:'Write the next line. Keep every unchanged part in place.'},
 {name:'Identify the second operation',mood:'think',prompt:'What changes next?',narration:'Now choose the next valid operation, not just any operation.'},
 {name:'Write the third line',mood:'focus',prompt:'Is this line equal to the last?',narration:'The third line must have exactly the same value as the one before.'},
 {name:'Identify the final step',mood:'think',prompt:'What final operation proves the result?',narration:'Finish the method, and check the mathematical meaning.'},
 {name:'Finish and check',mood:'happy',prompt:'How can you verify every line?',narration:'Each transformation is justified. You can check the result against the original.'}
];
// Separate per-preset narration: short prompt for character, mathematical detail spoken by Sir Bob.
function teachingNarration(idx){const p=presets[state.preset];if(idx===0)return 'We begin with '+p.title+'. Read the first expression and predict the first useful move.';
 if(idx===6)return p.why[2]+' Check the conclusion against the starting expression.';
 const op=Math.floor((idx-1)/2);return idx%2?p.why[op]:p.short[Math.min(op+1,3)]+' All unchanged terms stay on the new line.';}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:'Y7-018'},steps:STEPS.map((x,i)=>Object.defineProperty({...x},'narration',{get:()=>teachingNarration(i),enumerable:true})),alt:'A connected sequence of four equivalent mathematical expressions, with operation choices.',staticAlt:'Each working line is explained in the text below the diagram.',
  render(i,stage){state.visible=i;renderStage(stage,{phase:i,mode:state.mode,preset:state.preset});const bob=document.querySelector('#F8-01 .bubble');if(bob&&state.mode==='guided'){}},
  exploreIntro:'Build the mathematics, one valid operation at a time.',
  explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();state.mode='explore';window.NovaLessonComponent?.applyExploreModels();let progress=0;window.NovaLessonComponent?.applyExploreModels();const header=H('div',{class:'f801-controls'}),sel=H('select',{class:'f801-select','aria-label':'Choose a lesson preset'}),msg=H('p',{class:'f801-interact-feedback','aria-live':'polite'}),undo=H('button',{class:'nova-btn',text:'Undo previous step'}),reset=H('button',{class:'nova-btn ghost',text:'Start again'});
    window.NovaLessonComponent?.applyExploreModels();presetIds.forEach(id=>sel.appendChild(H('option',{value:id,text:presets[id].title})));window.NovaLessonComponent?.applyExploreModels();sel.value=state.preset;
    window.NovaLessonComponent?.applyExploreModels();const redraw=(message,good=false)=>{renderStage(stage,{preset:state.preset,limit:progress,mode:'explore',message,pose:good?'celebrate':'explain',onPick:(choice,j)=>{const p=presets[state.preset];if(choice!==p.ops[progress]){msg.textContent='That operation does not justify the next line. '+p.why[progress];msg.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,mode:'explore',step:progress});return;}progress++;emit('operation',choice);emit('workingStep',progress);msg.textContent=p.why[progress-1];msg.dataset.status='correct';N.events.emit('correct',{engine:ID,correct:true,mode:'explore',step:progress});redraw(p.short[Math.min(progress,3)],true);},onUndo:j=>{progress=Math.min(progress,j);emit('remove',j);msg.textContent='Step returned to the operation tray.';redraw('Try again.');}});undo.disabled=progress===0;};
    window.NovaLessonComponent?.applyExploreModels();sel.onchange=()=>{state.preset=sel.value;progress=0;emit('preset',state.preset);msg.textContent='';redraw();};window.NovaLessonComponent?.applyExploreModels();undo.onclick=()=>{if(progress){progress--;emit('remove',progress);redraw();}};window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{progress=0;emit('reset',true);msg.textContent='';redraw();};
    window.NovaLessonComponent?.applyExploreModels();header.appendChild(H('label',{text:'Lesson preset'}));window.NovaLessonComponent?.applyExploreModels();header.appendChild(sel);window.NovaLessonComponent?.applyExploreModels();header.appendChild(undo);window.NovaLessonComponent?.applyExploreModels();header.appendChild(reset);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(header);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(msg);window.NovaLessonComponent?.applyExploreModels();redraw();},
  challenge(panel,api,stage){state.mode='challenge';let task=0,progress=0,wrong=0,locked=false,opPicked=false,score=0;
    const tasks=[
      {id:'Y7-018',ops:['Brackets','Multiply','Subtract'],next:['18 − 3 × 6','18 − 18','0'],distractors:[['18 − 3 × 2 + 4','18 − 3 × 6','18 − 6 × 4'],['15 × 6','18 − 18','15'],['18','36','0']]},
      {id:'Y8-011',ops:['Distribute','Group terms','Simplify'],next:['x² + 2x + 3x + 6','x² + (2 + 3)x + 6','x² + 5x + 6'],distractors:[['x² + 6','x² + 2x + 3x + 6','x² + 6x'],['x² + (2 + 3)x + 6','x² + 6x + 6','x² + (2 + 3) + 6'],['x² + 5 + 6','x² + 6x','x² + 5x + 6']]},
      {id:'Y8-012',ops:['Find factor 6','Factor out 6','Show identity'],next:['6 × 2x + 6 × 3','6(2x + 3)','12x + 18 ≡ 6(2x + 3)'],distractors:[['6 × 2x + 6 × 3','6 × 12x + 6 × 18','6 × 2x + 18'],['6(12x + 18)','6(2x + 3)','6(2x + 18)'],['12x + 18 ≡ 6(2x + 3)','12x + 18 ≡ 6(2x + 18)','12x + 18 ≡ 6(12x + 3)']]},
      {id:'Y8-015',ops:['Subtract 2','Multiply by 3','Substitute to check'],next:['\\frac{x}{3} = 5','x = 15','\\frac{15}{3} + 2 = 7'],distractors:[['\\frac{x}{3} = 9','\\frac{x}{3} = 5','\\frac{x}{3} = 7'],['x = 15','x = \\frac{5}{3}','x = 8'],['\\frac{15}{3} + 2 = 5','\\frac{15}{3} + 2 = 7','\\frac{15}{3} = 7']]}
    ];
    const hdr=H('div',{class:'f801-challenge-header'}),row=H('div',{class:'f801-answer-buttons'}),feedback=H('div',{class:'f801-interact-feedback','aria-live':'polite'}),check=H('button',{class:'nova-btn primary',text:'Check this line'}),hint=H('button',{class:'nova-btn ghost',text:'Why this operation?'}),next=H('button',{class:'nova-btn',text:'Next problem'});
    const choices=[];let selected=-1;
    function candidate(s){if(!String(s).includes('\\frac'))return s.replace(/\s+/g,' ');return s.replaceAll('\\frac{x}{3}','x ÷ 3').replaceAll('\\frac{5}{3}','5 ÷ 3').replaceAll('\\frac{15}{3}','15 ÷ 3');}
    function refresh(){const data=tasks[task];state.preset=data.id;
      hdr.textContent='Challenge '+(task+1)+' of '+tasks.length+' · Step '+(Math.min(progress+1,3))+' of 3 · '+presets[data.id].title;
      row.innerHTML='';selected=-1;locked=false;opPicked=false;next.hidden=true;next.style.display='none';check.disabled=false;feedback.textContent='First choose the operation, then select the correct next line.';feedback.dataset.status='';
      if(progress>=3){feedback.textContent='All three steps verified. You have proved this method.';feedback.dataset.status='correct';check.disabled=true;next.hidden=false;next.style.display='';
        renderStage(stage,{mode:'challenge',preset:data.id,limit:3,message:'Well reasoned!',pose:'celebrate'});return;}
      renderStage(stage,{mode:'challenge',preset:data.id,limit:progress,message:'Choose the next move.',onPick:(picked)=>{if(locked)return;opPicked=picked===data.ops[progress];emit('operation',picked);if(opPicked){feedback.textContent='Operation selected. Now check the equivalent next line.';feedback.dataset.status='correct';}else{wrong++;feedback.textContent='Try another operation. '+presets[data.id].why[progress];feedback.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,trap:'operation'});}}});
      data.distractors[progress].forEach((option,i)=>{const btn=H('button',{class:'nova-btn f801-answer',text:candidate(option),'data-option':String(i),'aria-pressed':'false'});btn.onclick=()=>{selected=i;row.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));emit('choice',option);};row.appendChild(btn);});
    }
    check.onclick=()=>{if(locked||progress>=3)return;const d=tasks[task],val=selected>=0?d.distractors[progress][selected]:null;
      if(!opPicked){feedback.textContent='Choose the correct operation pill first.';feedback.dataset.status='wrong';return;}
      if(val!==d.next[progress]){wrong++;const idx=d.distractors[progress].indexOf(val);const trap=presets[d.id].traps[progress];feedback.textContent=val===null?'Choose a next line before checking.':trap[1];feedback.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,step:progress,trap:trap[0]});return;}
      score++;progress++;N.events.emit('correct',{engine:ID,correct:true,step:progress,task});emit('workingStep',progress);locked=true;feedback.textContent='Correct — the next line preserves the mathematics.';feedback.dataset.status='correct';
      if(progress===3){setTimeout(()=>{if(!stage.isConnected)return;refresh();},350);}else{setTimeout(()=>{if(!stage.isConnected)return;refresh();},350);}
    };
    hint.onclick=()=>api.hint(presets[tasks[task].id].why[Math.min(2,progress)]);
    next.onclick=()=>{if(progress<3)return;if(task<tasks.length-1){task++;progress=0;refresh();}else{feedback.textContent='Challenge complete. '+score+' valid steps checked; '+wrong+' incorrect attempts corrected.';next.hidden=true;next.disabled=true;check.disabled=true;}};
    panel.appendChild(hdr);panel.appendChild(H('p',{class:'f801-mini-label',text:'Choose the next equivalent line'}));panel.appendChild(row);panel.appendChild(H('div',{class:'f801-challenge-actions'},[check,hint,next]));panel.appendChild(feedback);refresh();}
};
N.events.on('mode',event=>{const d=event.detail||{};if(d.engine===ID)state.mode=d.mode;});
N.registry&&N.registry.add({id:ID,title:C.title,kind:'engine',topics:['algebra','number'],deps:C.references,events:['value','correct','step','hintUsed']});
const eng=
/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{"state":()=>state},tables:{"presets":()=>presets,"pose":()=>pose,"STEPS":()=>STEPS},draws:{"surface":["stage"],"renderStage":["stage","opts"]},exploreFields:{}});
N.bankMount({id:ID,num:'01',title:C.title,spec:spec(),years:'KS3 Years 7–9',linked:C.references,def:DEF});
window.F801_ENGINE=eng;window.F801_PRESETS=presets;
// Stable debug/test-only interface: neither changes the core nor bypasses challenge marking.
window.F801_TEST={presets,config:C,getState:()=>({preset:state.preset,mode:state.mode,visible:state.visible}),pickPreset:id=>{if(presets[id]){state.preset=id;eng.setMode('explore');}},setMode:eng.setMode};
// Sir Bob wording is specific to the current lesson and reveal stage.
// Narration comes from the current-preset step getter; no duplicate speech on step events.
})();

