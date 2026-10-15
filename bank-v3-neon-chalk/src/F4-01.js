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


/* NOVA F4-01 · Part–Whole Bar · Run 01 review · canonical F0/F2 core only.
   Canonical core remains unmodified. All drawing is through NOVA.neon* and NOVA.svg.*. */
const F401_CONFIG={
  id:'F4-01', startMode:'watch', preset:'Y7-035',
  parameters:{minWhole:8,maxWhole:150,integerOnly:true,snap:1},
  presets:{
    'Y7-035':{label:'Year 7 · Whole 18, known 7',whole:18,known:[7],context:'A whole contains a known part and a missing part.'},
    'twoKnown':{label:'Two known parts · Whole 30',whole:30,known:[8,5],context:'Two known parts belong inside one whole.'},
    'largeNumbers':{label:'Larger quantities · Whole 120',whole:120,known:[48,27],context:'Use subtraction to find what is not yet accounted for.'}
  },
  challenge:[
    {whole:18,known:[7],context:'A whole of 18 contains 7 and one missing part.',label:'Missing part'},
    {whole:30,known:[8,5],context:'A whole of 30 contains 8, 5 and one missing part.',label:'Three-part whole'},
    {whole:120,known:[48,27],context:'A whole of 120 contains 48, 27 and one missing part.',label:'Multi-part whole'}
  ],
  events:{value:['preset','whole','known','part','remove','resize','answer','reset','proof'],types:['mode','step','correct','hintUsed']}
};
window.F401_CONFIG=F401_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F401_CONFIG),ID=C.id;
const PX={x:82,w:836,wholeY:121,partY:355,barH:106,lowerH:109};
function sum(a){return a.reduce((t,x)=>t+x,0);}
function missing(s){return s.whole-sum(s.known);}
function valid(s){return Number.isInteger(s.whole)&&s.whole>=C.parameters.minWhole&&s.whole<=C.parameters.maxWhole&&Array.isArray(s.known)&&s.known.length>=1&&s.known.every(x=>Number.isInteger(x)&&x>0)&&missing(s)>=0;}
function checkPart(s,v){return Number.isInteger(v)&&valid(s)&&v===missing(s)&&sum(s.known)+v===s.whole;}
function trap(s,v){const k=sum(s.known),m=missing(s);if(!Number.isFinite(v))return 'Choose a part or enter a whole number.';
 if(!Number.isInteger(v))return 'These parts count whole units, so enter an integer.';
 if(v<0)return 'A missing part cannot contain a negative number of these units.';
 if(v===m)return '';
 if(v===s.whole)return `That is the whole (${s.whole}), not the missing part. The whole contains the known parts too.`;
 if(v===k)return `You have counted the known parts (${k}) again. The missing part is what remains.`;
 if(v===s.whole+k)return 'Adding the known parts to the whole double-counts them. Subtract the known quantity instead.';
 if(v===s.whole-s.known[0]&&s.known.length>1)return 'You subtracted only one known part. Both known parts belong inside the whole.';
 if(v>m)return 'Too large: the known and proposed missing parts would exceed the whole.';
 return 'Too small: there would still be a gap inside the whole.';
}
function choices(s){const k=sum(s.known),correct=missing(s);let arr=[correct,s.whole,k,s.whole+k,s.whole-s.known[0]];arr=[...new Set(arr.filter(n=>n>=0&&Number.isInteger(n)))];for(let n=1;arr.length<4;n++)if(!arr.includes(correct+n))arr.push(correct+n);return [arr[1],arr[0],arr[3],arr[2]].slice(0,4);}
function button(text,fn,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});}
function evt(key,value){if(!C.events.value.includes(key))throw Error('F4-01 undeclared event '+key);N.events.emit('value',{engine:ID,key,value});}
function dock(stage,k){
if(window.NovaLessonComponent?.active){[stage,k]=window.NovaLessonComponent.args("dock",arguments);}
const states={notice:['explain','Find the whole.'],split:['point','Watch it split.'],known:['count','Name the parts.'],predict:['think','What is missing?'],subtract:['idea','Subtract what you know.'],prove:['cheer','The parts make the whole!'],explore:['point','Try another part.'],ready:['think','Work it out!'],wrong:['oops','Check the total.'],right:['cheer','You proved it!'],resize:['ruler','Compare the lengths.'],remove:['point','Try a new piece.']};const [pose,text]=states[k]||states.explore;N.scene.helperStrip(stage,pose,text);}
function chalk(p,x,y,text,size=52,role='given'){return N.chalkText(p,x,y,String(text),{size,role});}
function brace(p,x,y,w,role='given'){N.neonPath(p,`M${x},${y}v14 Q${x},${y+24} ${x+14},${y+24}h${w/2-29}q15,0 15,13q0,-13 15,-13h${w/2-29}q14,0 14,-10v-14`,{role,width:3});}
function upper(s,svg,step){const {x,w,wholeY,barH}=PX;
 if(step<0)return;
 const wholeBar=N.neonBox(svg,x,wholeY,w,barH,{role:'given',r:21});
 if(step===0&&svg.dataset.animate==='true')N.motion.tween(580,e=>wholeBar.setAttribute('transform',`translate(${x} 0) scale(${Math.max(.02,e).toFixed(3)} 1) translate(${-x} 0)`),N.motion.ease.out,()=>wholeBar.removeAttribute('transform'));
 chalk(svg,x+w/2,wholeY+67,String(s.whole),69,'given');
 chalk(svg,500,87,'THE WHOLE',47,'given');
 brace(svg,x,wholeY+barH+18,w,'given');
}
function lower(s,svg,step,opts){const {x,w,partY,lowerH}=PX,known=s.known,unknown=missing(s);
 if(step<1)return;
 chalk(svg,500,partY-35,known.length>1?'KNOWN PARTS + MISSING PART':'KNOWN PART + MISSING PART',49,'given');
 let pos=x;
 known.forEach((value,i)=>{const width=w*value/s.whole;const piece=N.neonBox(svg,pos,partY,width,lowerH,{role:i%2===0?'op':'given',r:width<75?5:13});
  if(step===1&&svg.dataset.animate==='true')N.motion.arrive(piece,-48,0,510,N.motion.ease.out);
  if(step>=2)chalk(svg,pos+width/2,partY+73,String(value),Math.min(65,Math.max(40,width*.42)),i%2===0?'op':'given');
  pos+=width;
 });
 let uw=x+w-pos;const revealed=opts.won||(!opts.interactive&&!opts.challenge&&step>=5);const selected=opts.selected;
 const shown=revealed?String(unknown):selected!==null?String(selected):'?';
 const unknownBar=N.neonBox(svg,pos,partY,uw,lowerH,{role:revealed?'result':'unknown',r:uw<75?5:13});
 if(step===1&&svg.dataset.animate==='true')N.motion.arrive(unknownBar,48,0,510,N.motion.ease.out);
 chalk(svg,pos+uw/2,partY+72,shown,Math.max(43,Math.min(71,uw*.37)),revealed?'result':'unknown');
 if(step>=3&&!revealed)N.neonRing(svg,pos+uw-24,partY+23,{role:'unknown',r:11,pulse:true});
 if(svg.dataset.animate==='true'&&step===3)N.motion.flash(svg,pos+uw/2,partY+55,'unknown',36);
 if(opts.checkMarker!==undefined){N.neonMark(svg,pos+uw/2,partY+119,opts.checkMarker,{size:17});}
 brace(svg,x,partY+lowerH+15,w,'given');
 if(opts.resize&&!opts.challenge&&known.length===1){const bx=x+w*known[0]/s.whole;
  const handler=E('g',{role:'slider',tabindex:0,'aria-label':'Resize known part','aria-valuemin':1,'aria-valuemax':s.whole-1,'aria-valuenow':known[0],'aria-valuetext':`${known[0]} units`,class:'f401-divider'},svg);
  N.neonBox(handler,bx-22,partY-4,44,lowerH+8,{role:'focus',r:11});N.neonRing(handler,bx,partY-30,{role:'focus',r:15});
  const zoneWidth=w/s.whole;
  const zones=()=>Array.from({length:s.whole-1},(_,i)=>({id:'resize:'+String(i+1),kind:'drop',x:x+zoneWidth*(i+.5),y:partY-45,w:zoneWidth+1,h:lowerH+73}));
  N.ui.svgDrag(svg,handler,{box:{x:bx-22,y:partY-35,w:44,h:lowerH+44},zones,
   onDrop:id=>{const v=Number(id.split(':')[1]);if(!Number.isInteger(v)||v<=0||v>=s.whole)return false;Promise.resolve().then(()=>opts.onResize(v));return true;},
   canStart:()=>opts.canStart?.()!==false});
  handler.addEventListener('keydown',e=>{const m={ArrowLeft:-1,ArrowRight:1};if(e.key in m||['Home','End'].includes(e.key)){e.preventDefault();const v=e.key==='Home'?1:e.key==='End'?s.whole-1:Math.max(1,Math.min(s.whole-1,known[0]+m[e.key]));opts.onResize(v);}});
 }
 return {x:pos,y:partY,w:uw,h:lowerH};
}
function tray(s,svg,opts,unknownSlot){if(!opts.interactive)return;
 const vals=choices(s),n=vals.length,slotW=172,gap=18,left=(1000-(n*slotW+(n-1)*gap))/2;
 chalk(svg,500,618,opts.challenge?'CHOOSE THE PART THAT FITS':'BUILD THE MISSING PART',49,'given');
 vals.forEach((v,i)=>{const x=left+i*(slotW+gap),y=647;const g=E('g',{class:'f401-piece',role:'button',tabindex:0,'aria-label':'Place candidate '+v,'data-value':v},svg);
  N.neonBox(g,x,y,slotW,79,{role:'focus',r:18,text:String(v),size:53});
  N.ui.svgDrag(svg,g,{box:{x,y,w:slotW,h:79},zones:()=>[{id:'put',kind:'drop',x:unknownSlot.x,y:unknownSlot.y-12,w:unknownSlot.w,h:unknownSlot.h+22},{id:'remove',kind:'remove',x:380,y:744,w:240,h:70}],
  onDrop:id=>{if(id!=='put')return false;Promise.resolve().then(()=>opts.onPlace(v));return true;},onRemove:()=>opts.onRemove(),removeTo:{x:500,y:776}});
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opts.onPlace(v);}});
 });
 N.neonBox(svg,380,746,240,62,{role:'error',r:15,text:'RETURN',size:40});
 if(opts.selected!==null&&unknownSlot.w>75){const x=unknownSlot.x+unknownSlot.w/2,y=PX.partY+PX.lowerH/2;const g=E('g',{class:'f401-placed',role:'button',tabindex:0,'aria-label':'Remove placed part '+opts.selected},svg);
  N.neonRing(g,x,y,{role:'focus',r:30,pulse:false});
  N.ui.svgDrag(svg,g,{box:{x:x-39,y:y-40,w:78,h:80},zones:()=>[{id:'remove',kind:'remove',x:380,y:744,w:240,h:70}],onRemove:()=>opts.onRemove(),removeTo:{x:500,y:776}});
  g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();opts.onRemove();}});
 }
}
function sceneSVG(s,opts={}){
 const step=opts.step===undefined?5:opts.step;
 const svg=N.svg.root(1000,826,'A neon glass part-whole bar. The top bar is the complete total. Below, the aligned coloured known parts and a gold unknown part have lengths proportional to their values.');
 svg.classList.add('f401-svg');svg.dataset.animate=String(!!opts.animate);svg.dataset.whole=String(s.whole);svg.dataset.known=String(sum(s.known));svg.dataset.missing=String(missing(s));
 upper(s,svg,step);const slot=lower(s,svg,step,opts);
 if(step>=4){const exposed=opts.won||(!opts.interactive&&!opts.challenge&&step>=5);const sentence=exposed?`${s.whole} − ${sum(s.known)} = ${missing(s)}`:`${s.whole} − ${sum(s.known)} = ?`;
  chalk(svg,500,566,sentence,58,exposed?'result':'unknown');}
 if(!opts.interactive){
   // Evidence line fills the teaching stage with a second, algebra-ready proof representation.
   // Its states progress with the bar; nothing is pre-solved for the learner.
   const left=step>=2?String(sum(s.known)):'?';
   const right=step>=5?String(missing(s)):'?';
   const whole=String(s.whole);
   N.neonBox(svg,95,650,230,96,{role:step>=2?'op':'unknown',r:19,text:left,size:67});
   chalk(svg,373,716,'+',72,'given');
   N.neonBox(svg,417,650,230,96,{role:step>=5?'result':'unknown',r:19,text:right,size:67});
   chalk(svg,682,716,'=',72,'given');
   N.neonBox(svg,724,650,196,96,{role:'given',r:19,text:whole,size:67});
   chalk(svg,500,805,step>=5?'CHECK: THE PARTS MATCH THE WHOLE':'PART + PART = WHOLE',46,'given');
 }
 if(opts.interactive&&slot)tray(s,svg,opts,slot);
 if(opts.won){const ring=N.neonRing(svg,893,161,{role:'result',r:25});if(opts.animate)N.motion.pop(ring,893,161);}else if(opts.animate&&step===5)N.motion.flash(svg,700,411,'result',42);
 return svg;
}
function sideCard(k,v,desc,role){return N.neonCard([H('p',{class:'f401-sidek',text:k}),H('div',{class:'f401-sidev',text:v}),H('p',{class:'f401-sidesub',text:desc})],{role});}
function present(stage,s,opts={}){
if(window.NovaLessonComponent?.active){[stage,s,opts]=window.NovaLessonComponent.args("present",arguments);}
stage.innerHTML='';N.cap(stage,'Part–Whole',opts.challenge?'CHALLENGE':opts.interactive?'EXPLORE':opts.subtitle||'Watch the evidence');
 const layout=H('div',{class:'f401-layout'}),canvas=H('div',{class:'f401-apparatus'}),side=H('aside',{class:'f401-side','aria-label':'Mathematical evidence'});
 canvas.appendChild(sceneSVG(s,opts));
 const reveal=opts.won||(!opts.interactive&&!opts.challenge&&opts.step>=5);
 side.append(sideCard('WHOLE',String(s.whole),'All the parts together.','given'),
  sideCard('KNOWN',s.known.join(' + '),'These parts are already counted.','op'),
  sideCard('MISSING',reveal?String(missing(s)):opts.selected===null?'?':String(opts.selected),'Whole minus known parts.','unknown'));
 layout.append(canvas,side);stage.append(layout);
 if(opts.won)stage.append(H('div',{class:'f401-proof','aria-label':'Proof',text:`Check: ${s.known.join(' + ')} + ${missing(s)} = ${s.whole}. The lengths and totals agree.`}));
 dock(stage,opts.pose||'ready');return canvas;
}
function putOptions(panel,s,up){const sel=H('select',{'aria-label':'Curriculum example'});
 for(const [k,v] of Object.entries(C.presets))sel.add(new Option(v.label,k));sel.value=C.preset;sel.onchange=()=>up(sel.value);panel.append(H('label',{class:'f401-field'},['Choose a model',sel]));}
function live(panel,stage,seed,challenge=false,api){let s={...seed,known:[...seed.known]},selected=null,entry='',message=challenge?'Work out the missing part. Use the diagram as evidence.':'Drag a number into the gold part or use the controls below.',pose='ready',won=false,attempts=0;
 const status=H('p',{class:'f401-status',role:'status'});
 function update(msg,p='explore'){message=msg;pose=p;render();}
 function place(v){if(won)return;selected=v;evt('part',v);update('You placed '+v+'. Does the whole equal the sum of its parts?','predict');}
 function remove(){if(won)return;selected=null;entry='';evt('remove',true);update('The gold part is empty again.','remove');}
 function resize(n){if(challenge||won||s.known.length!==1)return;s.known=[Math.max(1,Math.min(s.whole-1,n))];selected=null;entry='';evt('resize',s.known[0]);update('The known section is now '+s.known[0]+'. What remains?','resize');}
 function reset(){selected=null;entry='';won=false;attempts=0;evt('reset',true);update('Model reset. Build the missing part.','ready');}
 function hint(){const msg=s.known.length===1?'Start with the whole. Take away the known part.':'Add BOTH known parts first. Then subtract that combined amount from the whole.';api?.hint(msg);update(msg,'predict');}
 function check(){const v=entry.trim()?Number(entry):selected;attempts++;evt('answer',v);
  if(entry.trim()&&selected!==null&&v!==selected){const m='Your entered value differs from the placed card. Make both agree before checking.';api?.check(false,m,{task:s.whole});update(m,'wrong');return false;}
  const error=trap(s,v);if(error){api?.check(false,error,{task:s.whole});update(error,'wrong');return false;}
  if(!checkPart(s,v)){const m='That value does not complete the whole.';api?.check(false,m,{task:s.whole});update(m,'wrong');return false;}
  selected=v;won=true;evt('proof',{whole:s.whole,parts:[...s.known,v],correct:true});const success=`Correct: ${s.known.join(' + ')} + ${v} = ${s.whole}.`;
  api?.check(true,success,{task:s.whole});update(success,'right');return true;
 }
 function setPreset(k){C.preset=k;s={...C.presets[k],known:[...C.presets[k].known]};evt('preset',k);reset();}
 function render(){panel.innerHTML='';present(stage,s,{subtitle:challenge?'Challenge · Find and prove the missing value':'Explore · The whole is the sum of its parts',step:5,interactive:!won,challenge,selected,won,pose,resize:!challenge,onResize:resize,onPlace:place,onRemove:remove,canStart:()=>!won});
   if(!challenge)putOptions(panel,s,setPreset);
   panel.append(H('p',{class:'f401-instruction',text:s.context||'Move parts to build an equal total.'}));
   const row=H('div',{class:'f401-controls'}),field=H('label',{class:'f401-field'},['Missing part',H('input',{type:'number',step:1,min:0,max:s.whole,'aria-label':'Missing part numeric answer'})]);
   const inp=field.querySelector('input');inp.value=entry;inp.oninput=()=>{entry=inp.value;};
   if(!won){row.append(field,button('Place answer',()=>{const n=Number(inp.value);if(inp.value.trim()&&Number.isInteger(n))place(n);}),button('Check',check,true),button('Hint',hint),button('Clear',remove));}
   else row.append(button('Try again',reset),H('span',{class:'f401-complete',text:'Proof complete'}));
   panel.append(row);
   if(!challenge&&s.known.length===1)panel.append(H('div',{class:'f401-controls'},[button('Known −1',()=>resize(s.known[0]-1)),button('Known +1',()=>resize(s.known[0]+1)),H('span',{class:'f401-help',text:'Resize the neon divider, or use these keyboard-friendly controls.'})]));
   status.className='f401-status'+(pose==='wrong'?' bad':pose==='right'?' good':'');status.textContent=message;panel.append(status);
 }
 render();return {check,place,resize,reset,getState:()=>({whole:s.whole,known:[...s.known],missing:missing(s),selected,won,attempts})};
}
const STEPS=[
 {name:'Notice the whole',narration:'Eighteen is the whole amount. Every part must fit inside this total.',prompt:'What total are we trying to make?'},
 {name:'Split the whole',narration:'A whole can be split into parts. The two parts must have the same total length as the whole.',prompt:'Does splitting change the total?'},
 {name:'Name the known part',narration:'We know one part is seven. The other part is missing.',prompt:'Which part do we know?'},
 {name:'Predict the missing part',narration:'The unknown part fills the remaining space. Predict whether it is greater than seven.',prompt:'Why is a missing piece needed?'},
 {name:'Subtract what is known',narration:'Start at eighteen. Subtract seven, because seven is already part of the whole.',prompt:'How could subtraction find the missing part?'},
 {name:'Prove with addition',narration:'Eighteen minus seven is eleven. Check it backwards: seven plus eleven equals eighteen. The parts exactly match the whole.',prompt:'How does addition prove the answer?'}
];
const def={id:ID,title:'Part–Whole Bar',config:C,steps:STEPS,alt:'A glass whole bar above proportional coloured known and missing parts. The missing value follows from whole minus the sum of known parts.',staticAlt:'The whole is equal to the sum of its parts. For example, if the whole is 18 and one known part is 7, the unknown part is 11. Check: 7 + 11 = 18.',
 render(i,stage){const s=C.presets['Y7-035'];const poses=['notice','split','known','predict','subtract','prove'];present(stage,s,{step:i,selected:null,pose:poses[i],subtitle:STEPS[i].name,animate:true});},
 exploreIntro:'Drag a number into the unknown segment, or resize the known part and work out what remains.',
 explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();live(panel,stage,C.presets[C.preset],false,null);},
 challenge(panel,api,stage){let index=0;function next(){panel.innerHTML='';if(index>=C.challenge.length){present(stage,{...C.challenge[C.challenge.length-1],known:[...C.challenge[C.challenge.length-1].known]},{step:5,won:true,selected:missing(C.challenge.at(-1)),pose:'right',subtitle:'All three challenges complete'});panel.append(H('div',{class:'f401-finish',text:'All three part–whole proofs completed. You used subtraction to find the missing part and addition to verify the whole.'}));return;}
    const task=C.challenge[index],round=H('div');panel.append(H('p',{class:'f401-progress',text:`Problem ${index+1} of ${C.challenge.length} · ${task.label}`}),round);
    const localApi={hint:msg=>api.hint(msg),check:(ok,msg)=>{api.check(ok,msg,{task:index+1});if(ok){Promise.resolve().then(()=>{const continueButton=button('Next problem →',()=>{index++;next();},true);round.append(H('div',{class:'f401-next'},[continueButton]));});}}};live(round,stage,task,true,localApi);
 }next();}
};
N.registry.add({id:ID,title:'Part–Whole Bar',topics:['part whole','addition','subtraction','missing values','forming equations'],deps:['F0-01','F0-02','F0-04','F0-05','F0-08','F0-09','F0-13']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"dock":["stage","k"],"present":["stage","s","opts"]},exploreFields:{}});
N.bankMount({id:ID,num:'01',title:'Part–Whole Bar · Run 01 Review',def,years:'Year 7 · Forming and solving equations from contexts; KS3 reusable.',linked:['F0-02','F0-04','F2-01','F4-02','F4-08'],spec:{
 purpose:'Make a missing part visible as the difference between a whole and its already known parts. Prove whole = sum of parts, not just a procedure.',
 params:'Integer whole 8–150, one or two known positive parts; dependent unknown; divider snapping to whole units.',
 presets:'Y7-035 whole 18 with known 7; two known parts 30 with 8 and 5; larger numbers 120 with 48 and 27.',
 steps:'Notice the whole → split → name known part → predict missing → subtract → verify by addition.',
 interactions:'Watch and Guided teaching; Explore: draggable part value, divider snap/resize, numeric entry, instant evidence; Challenge: 3 checked problems, typed/drag answer, misconceptions and hints.',
 traps:'Confusing known with unknown; treating the whole as a part; subtracting only one of two known parts; adding the whole to the known; an unexplained gap in the bar.',
 gcse:'Foundation and Higher: missing quantity, equation modelling and bar reasoning; F4-08 algebra bar is the dedicated unknown-variable follow-up.'
}});
window.F401_MATH={sum,missing,valid,checkPart,trap,choices};
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));card.append(dev);
card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();

