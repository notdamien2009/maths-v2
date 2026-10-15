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

/* NOVA F8-06 — Rearranging Formulae. Independent engine on the canonical F0 runtime.
   Visuals use F0 Neon Tube primitives, embedded NOVA Chalk, maths operations and core drag kit.
   No previous F8 attempt or private core is imported. */
window.F806_CONFIG=Object.freeze({id:'F8-06',title:'Rearranging Formulae',family:'F8',startMode:'guided',preset:'Y8-016-L',
 parameters:{target:'chosen subject',nonzeroDenominators:true,yearGroups:['8','9'],namedPresets:5},
 events:{value:['preset','operation','undo','reset','choice','numericCheck'],system:['correct','step','hintUsed','mode']},
 references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F8-01','F8-03','F8-05']});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(window.F806_CONFIG),ID=C.id,eps=1e-8;
const row=(L,R,lf,rf)=>({L,R,lf,rf});
const ops={
 sub2w:{short:'− 2w',title:'Subtract 2w from both sides',note:'The 2w term disappears because it is subtracted from BOTH sides.'},
 div2:{short:'÷ 2',title:'Divide both sides by 2',note:'Divide the entire left-hand expression by two, not just the last term.'},
 sub5:{short:'− 5',title:'Subtract 5 from both sides',note:'Undo the addition by subtracting five from each side.'},
 div3:{short:'÷ 3',title:'Divide both sides by 3',note:'The WHOLE numerator must be divided by three.'},
 mul2:{short:'× 2',title:'Multiply both sides by 2',note:'Multiplying by two clears the denominator of the entire fraction.'},
 divb:{short:'÷ b',title:'Divide both sides by b',note:'Divide by b only when b is non-zero.'},
 divx:{short:'÷ x',title:'Divide both sides by x',note:'Divide by x only when x is non-zero.'},
 mulx:{short:'× x',title:'Multiply both sides by x',note:'Multiply both sides by non-zero x to remove the denominator.'},
 swap:{short:'Swap =',title:'Swap the sides of the equation',note:'If A equals B, then B also equals A. The subject now appears on the left.'},
 add2w:{short:'+ 2w',title:'Add 2w to both sides',note:'Adding two w does not undo the term we need to remove.'},
 mulb:{short:'× b',title:'Multiply both sides by b',note:'That operation will not isolate h at this stage.'},
 divxWrong:{short:'÷ k',title:'Divide both sides by k',note:'Check which term actually multiplies the subject.'},
 div2early:{short:'÷ 2?',title:'Divide before clearing other terms',note:'You need to undo the outermost operation first.'},
 add5:{short:'+ 5',title:'Add five to both sides',note:'Adding five does not undo the existing plus five.'}
};
const lessons={
 'Y8-016-L':{name:'Perimeter · make l the subject',lesson:'Y8-016',target:'l',context:'Change the subject of P = 2l + 2w. Keep P and w as symbols.',condition:'The rectangle has length l and width w.',steps:['sub2w','div2','swap'],pool:['sub2w','div2','swap','add2w','div2early'],
 rows:[row('P','2l + 2w',v=>v.P,v=>2*v.l+2*v.w),row('P − 2w','2l',v=>v.P-2*v.w,v=>2*v.l),row('\\frac{P-2w}{2}','l',v=>(v.P-2*v.w)/2,v=>v.l),row('l','\\frac{P-2w}{2}',v=>v.l,v=>(v.P-2*v.w)/2)],
 ratio:[1,.5,-1],inputs:{P:26,w:4},make:v=>({...v,l:(v.P-2*v.w)/2}),targetFn:v=>(v.P-2*v.w)/2,
 final:'l=\\frac{P-2w}{2}',choices:[{t:'l=\\frac{P-2w}{2}',correct:true},{t:'l=\\frac{P+2w}{2}'},{t:'l=\\frac{P-2w}{4}'}],
 bob:['A perimeter adds two lengths and two widths. Our target is l.','Subtract two widths from BOTH sides.','Divide all of P minus two w by two.','Swap the equality so the subject l is on the left.','Check the formula with a real perimeter and width.'],
 tips:['Circle the letter to isolate.','Remove the width contribution.','Divide the complete expression.','Write l on the left.']},
 'Y8-016-G':{name:'Linear rule · make x the subject',lesson:'Y8-016',target:'x',context:'Rearrange y = 3x + 5 to make x the subject.',condition:'Undo addition first; multiplication second.',steps:['sub5','div3','swap'],pool:['sub5','div3','swap','add5','div2early'],
 rows:[row('y','3x + 5',v=>v.y,v=>3*v.x+5),row('y − 5','3x',v=>v.y-5,v=>3*v.x),row('\\frac{y-5}{3}','x',v=>(v.y-5)/3,v=>v.x),row('x','\\frac{y-5}{3}',v=>v.x,v=>(v.y-5)/3)],ratio:[1,1/3,-1],inputs:{y:29},make:v=>({...v,x:(v.y-5)/3}),targetFn:v=>(v.y-5)/3,
 final:'x=\\frac{y-5}{3}',choices:[{t:'x=\\frac{y+5}{3}'},{t:'x=\\frac{y-5}{3}',correct:true},{t:'x=y-\\frac{5}{3}'}],
 bob:['The output y comes from multiplying x by three and then adding five.','Undo the final plus five first.','Divide the WHOLE quantity y minus five by three.','Swap the sides so x is the subject.','Substitute a value for y and check the rule.'],tips:['Track the operation order.','Undo the addition.','Divide the entire expression.','Place the subject on the left.']},
 'Y8-016-A':{name:'Triangle area · make h the subject',lesson:'Y8-016',target:'h',context:'Rearrange A = bh ÷ 2 to make h the subject.',condition:'The base b must be non-zero.',steps:['mul2','divb','swap'],pool:['mul2','divb','swap','div2','mulb'],
 rows:[row('A','\\frac{bh}{2}',v=>v.A,v=>v.b*v.h/2),row('2A','bh',v=>2*v.A,v=>v.b*v.h),row('\\frac{2A}{b}','h',v=>2*v.A/v.b,v=>v.h),row('h','\\frac{2A}{b}',v=>v.h,v=>2*v.A/v.b)],ratio:[2,v=>1/v.b,-1],inputs:{A:42,b:7},make:v=>({...v,h:2*v.A/v.b}),targetFn:v=>2*v.A/v.b,
 final:'h=\\frac{2A}{b}',choices:[{t:'h=\\frac{A}{2b}'},{t:'h=\\frac{2A}{b}',correct:true},{t:'h=\\frac{Ab}{2}'}],
 bob:['A triangle is half the base multiplied by the height. We need h.','Multiply BOTH sides by two to clear the fraction.','Now divide BOTH sides by the non-zero base b.','Swap the sides to write h as the subject.','Verify the original area with the derived height.'],tips:['Target the height.','Clear the fraction first.','Divide by the base, not by two again.','Remember b cannot be zero.']},
 'Y9-019-D':{name:'Inverse proportion · make y the subject',lesson:'Y9-019',target:'y',context:'For k = xy, rearrange to make y the subject.',condition:'Assume x is non-zero.',steps:['divx','swap'],pool:['divx','swap','divxWrong','mulx'],
 rows:[row('k','xy',v=>v.k,v=>v.x*v.y),row('\\frac{k}{x}','y',v=>v.k/v.x,v=>v.y),row('y','\\frac{k}{x}',v=>v.y,v=>v.k/v.x)],ratio:[v=>1/v.x,-1],inputs:{k:60,x:5},make:v=>({...v,y:v.k/v.x}),targetFn:v=>v.k/v.x,
 final:'y=\\frac{k}{x}',choices:[{t:'y=kx'},{t:'y=\\frac{k}{x}',correct:true},{t:'y=\\frac{x}{k}'}],
 bob:['For inverse proportion the product x times y stays constant at k.','Divide both sides by non-zero x to isolate y.','Swap the sides to make y the subject.','If x doubles, y halves for the same non-zero k.'],tips:['Identify the constant product.','Divide by x to leave y.','Move y to the left.']},
 'Y9-019-R':{name:'Inverse proportion · make k the subject',lesson:'Y9-019',target:'k',context:'From y = k ÷ x, rearrange to make k the subject.',condition:'Assume x is non-zero.',steps:['mulx','swap'],pool:['mulx','swap','divx','divxWrong'],
 rows:[row('y','\\frac{k}{x}',v=>v.y,v=>v.k/v.x),row('xy','k',v=>v.x*v.y,v=>v.k),row('k','xy',v=>v.k,v=>v.x*v.y)],ratio:[v=>v.x,-1],inputs:{x:6,y:8},make:v=>({...v,k:v.x*v.y}),targetFn:v=>v.x*v.y,
 final:'k=xy',choices:[{t:'k=\\frac{y}{x}'},{t:'k=xy',correct:true},{t:'k=\\frac{x}{y}'}],
 bob:['The formula describes inverse proportion. We need the constant k.','Multiply both sides by non-zero x; the division disappears.','Swap the equality so k is the subject.','Check that x times y matches k.'],tips:['Choose the constant k.','Undo the division by x.','Write k first.']}
};
const order=Object.keys(lessons),close=(a,b)=>Math.abs(a-b)<eps;
function evaluateRow(r,v){return [r.lf(v),r.rf(v)];}
function difference(r,v){const z=evaluateRow(r,v);return z[0]-z[1];}
function ratioAt(p,i,v){const r=p.ratio[i];return typeof r==='function'?r(v):r;}
function validate(p,v){for(let i=0;i<p.steps.length;i++)if(!close(difference(p.rows[i+1],v),difference(p.rows[i],v)*ratioAt(p,i,v)))return false;return p.rows.every(r=>close(...evaluateRow(r,v)));}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F8-06 event '+key);N.events.emit('value',{engine:ID,key,value});}
function txt(root,x,y,t,role='given',size=25,anchor='middle'){const g=N.chalkText(root,x,y,String(t),{role,size,anchor});g.setAttribute('text-anchor',anchor);return g;}
function box(root,x,y,w,h,role='given',rad=15){return N.neonBox(root,x,y,w,h,{role,r:rad});}
function ln(root,x,y,X,Y,role='given',width=3){return N.neonLine(root,x,y,X,Y,{role,width});}
function math(root,x,y,value,role='given',font=25,anchor='middle'){
 // One traditional stacked fraction per teaching expression; NOVA Chalk numerals and the shared neon bar.
 const expr=String(value),m=/\\frac\{([^{}]+)\}\{([^{}]+)\}/.exec(expr);
 if(!m)return txt(root,x,y,expr,role,font,anchor);
 const before=expr.slice(0,m.index),after=expr.slice(m.index+m[0].length),pfx=before.length*font*.55,sfx=after.length*font*.55;
 const fw=Math.max(44,Math.max(m[1].length,m[2].length)*font*.59+18),full=pfx+fw+sfx+(after?3:0);
 let cx=(anchor==='middle'?x-full/2:anchor==='end'?x-full:x);
 if(before){txt(root,cx,y,before,role,font,'start');cx+=pfx;}
 txt(root,cx+fw/2,y-font*.47,m[1],role,font*.73);
 ln(root,cx+3,y-font*.19,cx+fw-3,y-font*.19,role,2.4);
 txt(root,cx+fw/2,y+font*.48,m[2],role,font*.73);cx+=fw+3;
 if(after)txt(root,cx,y,after,role,font*.92,'start');
}
const STEPS=[
 {name:'Notice the subject',prompt:'Which variable must be isolated?'},
 {name:'Identify the outer operation',prompt:'What operation currently holds the subject?'},
 {name:'Undo the first operation',prompt:'Perform the inverse on both sides.'},
 {name:'Continue rearranging',prompt:'What transformation comes next?'},
 {name:'Make the subject',prompt:'Read the rearranged formula.'},
 {name:'Substitute to verify',prompt:'Does the new formula reproduce the original?'}
];
const active={preset:order[0],mode:'guided',phase:0};
function dims(p,interact){const mobile=innerWidth<=760, n=p.steps.length;
 const D=mobile?{mobile,w:440,h:1000,x:20,wide:400,headY:96,formulaY:195,subjectY:94,socket:{x:141,y:299,w:158,h:62},firstRowY:399,rowH:91,rowGap:99,proofH:105,trayW:97,trayH:52}:
 {mobile,w:1080,h:950,x:66,wide:948,headY:92,formulaY:174,subjectY:98,socket:{x:434,y:267,w:213,h:61},firstRowY:363,rowH:72,rowGap:80,proofH:92,trayW:145,trayH:55};
 D.proofY=D.firstRowY+(n+1)*D.rowGap+8;
 D.trayY=D.proofY+D.proofH+20;
 D.removeY=D.trayY+(mobile? (p.pool.length>4?126:70):0);
 D.h=interact?D.removeY+(mobile?60:68):D.proofY+D.proofH+15;
 D.h+=mobile?10:12;return D;}
function selectable(g,label,fun){g.classList.add('f806-pickable');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',label);
 g.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();fun();}});g.addEventListener('click',()=>fun());}
function capture(g){g.addEventListener('pointerdown',ev=>{try{g.setPointerCapture(ev.pointerId)}catch(e){};});}
function draw(stage,o){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("draw",arguments);}
const p=lessons[o.preset||active.preset],chall=o.mode==='challenge',interact=chall||o.mode==='explore',path=p.rows;
 const progress=Math.max(0,Math.min(o.progress||0,p.steps.length)),d=dims(p,interact);stage.replaceChildren();N.cap(stage,'F8-06 · FORMULA STUDIO',chall?'FIND THE NEW SUBJECT':interact?'UNDO THE OUTERMOST OPERATION':'KEEP THE EQUALITY TRUE');
 const svg=N.svg.root(d.w,d.h,'A neon formula workspace with a circled subject, equivalent algebra steps, and inverse operations applied to both sides.');svg.classList.add('f806-svg');
 svg.dataset.preset=o.preset||active.preset;svg.dataset.mode=o.mode||active.mode;svg.dataset.stepCount=String(progress);svg.dataset.mathsCorrect=String(validate(p,p.make({...p.inputs})));
 txt(svg,d.w/2,36,'REARRANGE · PROVE · VERIFY','support',d.mobile?21:25);
 // Target variable marker is the canonical F0 neon ring, not a star.
 const subX=d.mobile?40:103,sy=d.subjectY;N.neonRing(svg,subX,sy,{role:'focus',r:8});txt(svg,subX+35,sy+9,p.target,'result',d.mobile?28:32);
 txt(svg,d.mobile?270:260,sy+8,'MAKE THE SUBJECT','support',d.mobile?22:25,'middle');
 if(!d.mobile){txt(svg,d.w-190,sy+8,p.lesson+' · VARIABLE ISOLATION','support',21);}
 // Linked term cards at the top show the current equality.
 const r=path[progress],bw=d.mobile?178:421,leftX=d.mobile?27:85,rightX=d.mobile?235:575;
 [leftX,rightX].forEach((x,k)=>{box(svg,x,d.formulaY,bw,d.mobile?88:82,k?'op':'given',17);
   txt(svg,x+bw/2,d.formulaY+24,k?'RIGHT SIDE':'LEFT SIDE','support',d.mobile?19:19);
   const v=chall&&!o.solved&&progress===p.steps.length?(k?'?':p.target):(k?r.R:r.L);math(svg,x+bw/2,d.formulaY+(d.mobile?65:62),v,k?'op':'given',d.mobile?(v.length>12?26:29):(v.length>16?30:36));});
 box(svg,d.w/2-24,d.formulaY+(d.mobile?21:18),48,46,'result',13);txt(svg,d.w/2,d.formulaY+(d.mobile?54:51),'=','result',32);
 // Same operation applies to both sides; the glowing socket accepts inverse cards.
 ln(svg,d.mobile?40:105,d.socket.y+31,d.socket.x-14,d.socket.y+31,'focus',3);ln(svg,d.socket.x+d.socket.w+14,d.socket.y+31,d.mobile?400:972,d.socket.y+31,'focus',3);
 box(svg,d.socket.x,d.socket.y,d.socket.w,d.socket.h,interact?'focus':'support',16);
 const prev=progress?ops[p.steps[progress-1]].short:interact?'DROP / TAP':'INVERSE STEP';txt(svg,d.w/2,d.socket.y+41,prev,progress?'result':'unknown',d.mobile?22:26);
 // Mathematical evidence: one row per algebraic equivalence, progressively revealed.
 for(let i=0;i<path.length;i++){const y=d.firstRowY+i*d.rowGap,seen=i<=progress,chosen=seen&&i===progress,role=chosen?'focus':seen?'given':'support';
  const g=box(svg,d.x,y,d.wide,d.rowH,role,14);g.setAttribute('data-row',String(i));g.setAttribute('data-revealed',String(seen));
  txt(svg,d.x+18,y+29,String(i+1).padStart(2,'0'),'support',d.mobile?18:20,'start');
  if(seen){const L=(chall&&!o.solved&&i===p.steps.length)?p.target:path[i].L,R=(chall&&!o.solved&&i===p.steps.length)?'?':path[i].R,fx=d.mobile?27:32;
   math(svg,d.mobile?d.x+140:d.x+293,y+(d.mobile?55:48),L,'given',fx);
   txt(svg,d.w/2,y+(d.mobile?55:48),'=','result',d.mobile?25:29);
   math(svg,d.mobile?d.x+296:d.x+690,y+(d.mobile?55:48),R,i===p.steps.length?'result':'op',fx);
   if(i>0)txt(svg,d.x+d.wide-(d.mobile?17:25),y+27,ops[p.steps[i-1]].short,'support',d.mobile?19:20,'end');
  }else{txt(svg,d.w/2,y+(d.mobile?56:48),i===progress+1?'?  NEXT EQUIVALENT LINE':'· · ·','unknown',d.mobile?21:25);}
 }
 box(svg,d.x,d.proofY,d.wide,d.proofH,'support',15);
 const caption=chall?(o.solved?'FORMULA VERIFIED':'YOUR TARGET STAYS HIDDEN'):progress===p.steps.length?'CHECK THE ORIGINAL':progress?'EQUAL CHANGES · BOTH SIDES':'HIGHLIGHT THE SUBJECT';
 txt(svg,d.w/2,d.proofY+38,caption,progress===p.steps.length&&o.solved?'result':'focus',d.mobile?20:26);
 const proof=chall?(o.solved?'A correct expression and check.':'Choose valid inverse operations.'):
 progress===p.steps.length?('SUBJECT: '+p.target+' · READY TO VERIFY'):(progress?ops[p.steps[progress-1]].note:p.condition);
 txt(svg,d.w/2,d.proofY+(d.mobile?76:69),proof,'support',d.mobile?(proof.length>49?15:17):(proof.length>83?17:20));
 if(interact){const pool=p.pool,positions=pool.map((k,i)=>({key:k,x:d.mobile?16+(i%4)*104:38+i*157,y:d.trayY+(d.mobile?Math.floor(i/4)*59:0)}));
  positions.forEach(({key,x,y})=>{const g=E('g',{'data-op-card':key},svg);box(g,x,y,d.trayW,d.trayH,'op',11);txt(g,x+d.trayW/2,y+d.trayH*.67,ops[key].short,'given',d.mobile?20:24);
   selectable(g,ops[key].title,()=>o.onApply&&o.onApply(key));
   N.ui.svgDrag(svg,g,{box:{x,y,w:d.trayW,h:d.trayH},zones:()=>[{id:'apply',kind:'drop',...d.socket},{id:'remove',kind:'remove',x:d.mobile?22:863,y:d.removeY,w:d.mobile?396:177,h:50}],onDrop:target=>target==='apply'?!!(o.onApply&&o.onApply(key)):false,onRemove:()=>{}});capture(g);
  });
  const rx=d.mobile?22:863,rw=d.mobile?396:177;box(svg,rx,d.removeY,rw,49,'focus',10);txt(svg,rx+rw/2,d.removeY+32,'RETURN / UNDO','focus',d.mobile?19:18);
  if(progress){const last=p.steps[progress-1],g=E('g',{'data-placed-operation':last},svg);box(g,d.socket.x,d.socket.y,d.socket.w,d.socket.h,'result',14);txt(g,d.w/2,d.socket.y+40,ops[last].short,'result',d.mobile?22:27);
   selectable(g,'Undo the last operation',()=>o.onUndo&&o.onUndo());g.addEventListener('keydown',e=>{if(['Delete','Backspace'].includes(e.key)){e.preventDefault();o.onUndo&&o.onUndo();}});
   N.ui.svgDrag(svg,g,{box:d.socket,zones:()=>[{id:'remove',kind:'remove',x:rx,y:d.removeY,w:rw,h:49}],onRemove:()=>o.onUndo&&o.onUndo()});capture(g);
  }
 }
 stage.appendChild(svg);
 const idx=Math.min(progress,p.tips.length-1),line=chall?(o.solved?'That formula works!':o.wrong?'Check the inverse move!':'Which operation undoes this?'):
 o.mode==='explore'?(o.wrong?'Try the correct inverse!':progress===p.steps.length?'Check the original!':p.tips[idx]):p.tips[Math.min(o.phase||0,p.tips.length-1)];
 N.scene.helperStrip(stage,o.solved?'celebrate':o.wrong?'not-yet':['explain','point-down','count','celebrate'][idx],line);
 const proofRow=H('div',{class:'f806-explain'});proofRow.append(H('strong',{text:chall?'Mathematical reasoning':o.mode==='explore'?'Why this works':'Sir Bob explains'}));proofRow.append(H('span',{text:chall?'The final rearrangement stays hidden until you prove the steps and choose a correct formula.':o.mode==='explore'?progress?'Both sides were changed by the same valid inverse operation.':'Choose the subject and undo operations from outside in.':p.bob[Math.min(p.bob.length-1,o.phase||0)]}));stage.appendChild(proofRow);
 if(chall&&N.helperImg){const im=N.helperImg(o.solved?'victory':'think','teen');const peer=H('div',{class:'f806-peer','aria-label':'Izaac, challenge peer'});peer.append(H('span',{text:o.solved?'Izaac · Proof accepted.':'Izaac · Show every step.'}));peer.append(H('img',{src:im.src,alt:im.alt,width:67,height:67}));stage.appendChild(peer);}
 if(N.motion&&N.motion.flash&&!N.reducedMotion()&&(o.solved||(progress&&!interact)))N.motion.flash(svg,o.solved?subX:d.w/2,o.solved?sy:d.socket.y+20,'result',28);
}
function spec(){return {purpose:'Change the subject of a formula while preserving equivalence and domain restrictions.',parameters:'Symbolic terms, target variable, inverse operations, named lessons, non-zero denominator conditions and substitution evidence.',presets:'Year 8 perimeter, algebraic rule and triangle-area formulae; Year 9 inverse proportion in both directions.',steps:'Notice subject → identify outer operation → undo → repeat → write subject → numerical verification.',interactions:'Drag inverse operation tiles to a both-sides socket, tap/Enter alternative, undo/remove, inspect each equivalent line, challenge formula selection.',traps:'Subtracting on one side only; dividing only one term; clearing a fraction incorrectly; dividing by a variable without checking non-zero; assuming direct proportion.',gcse:'Symbolic parameter rearrangements and inverse proportion with explicit non-zero variables.',linked:C.references};}
function renderChoices(root,options,onSelect,selected,solved){root.replaceChildren();options.forEach((c,i)=>{const b=H('button',{class:'nova-btn f806-choice',type:'button',onclick:()=>onSelect(i),'aria-label':'Formula option '+(i+1)});b.appendChild(H('small',{text:'OPTION '+(i+1)}));const display=H('span',{class:'f806-formula'});richFormula(display,c.t);b.appendChild(display);b.classList.toggle('selected',selected===i);b.disabled=solved;root.appendChild(b);});}
function richFormula(container,s){const m=/\\frac\{([^{}]+)\}\{([^{}]+)\}/.exec(s);if(!m){container.textContent=s;return;}if(m.index)container.appendChild(H('span',{text:s.slice(0,m.index)}));const fraction=H('span',{class:'f806-stack'});fraction.append(H('span',{text:m[1]}),H('span',{text:m[2]}));container.appendChild(fraction);if(s.slice(m.index+m[0].length))container.appendChild(H('span',{text:s.slice(m.index+m[0].length)}));}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:order[0]},steps:STEPS.map((z,i)=>({...z,get narration(){return lessons[active.preset].bob[Math.min(i,lessons[active.preset].bob.length-1)];}})),
 alt:'Neon term cards show equivalent formulae, a target subject ring, inverse-operation cards and a stacked chalk working column.',
 staticAlt:'Change the subject by applying inverse operations to both sides in reverse order and verifying the new formula by substitution.',
 render(i,stage){active.phase=i;const p=lessons[active.preset];draw(stage,{preset:active.preset,mode:active.mode,phase:i,progress:Math.max(0,Math.min(p.steps.length,i===0?0:i))});},
 exploreIntro:'Choose a real KS3 formula. Use valid inverse operations to isolate the target variable.',
 explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();active.mode='explore';window.NovaLessonComponent?.applyExploreModels();let id=active.preset,progress=0;
 window.NovaLessonComponent?.applyExploreModels();const controls=H('div',{class:'f806-controls'}),sel=H('select',{class:'f806-select','aria-label':'Choose formula preset'}),undo=H('button',{class:'nova-btn',text:'Undo last step'}),reset=H('button',{class:'nova-btn ghost',text:'Reset formula'}),choices=H('div',{class:'f806-buttons'}),fb=H('div',{class:'f806-feedback','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();order.forEach(k=>sel.appendChild(H('option',{value:k,text:k+' · '+lessons[k].name})));window.NovaLessonComponent?.applyExploreModels();sel.value=id;
 window.NovaLessonComponent?.applyExploreModels();function refresh(msg='',status=''){active.preset=id;draw(stage,{preset:id,mode:'explore',progress,wrong:status==='wrong',onApply:apply,onUndo:back});choices.replaceChildren();lessons[id].pool.forEach(key=>{const b=H('button',{class:'nova-btn f806-op-button',text:ops[key].short,'aria-label':ops[key].title,onclick:()=>apply(key)});choices.appendChild(b);});fb.textContent=msg||'Choose a tile. Drag it onto the centre socket, or tap to apply it.';fb.dataset.status=status;}
 window.NovaLessonComponent?.applyExploreModels();function wrongMessage(key){const expected=lessons[id].steps[progress];return expected==='divb'||expected==='divx'?'The divisor must be non-zero. '+ops[expected].note:key==='swap'?'Swapping sides is valid, but the subject has not been isolated yet.':key==='div2early'?'Undo the outermost operation first.':'That does not isolate the subject at this stage. '+ops[expected].note;}
 window.NovaLessonComponent?.applyExploreModels();function apply(key){const p=lessons[id],want=p.steps[progress];if(!want){refresh('Rearranged. Use the numeric check to prove the formula.','correct');return false;}if(key!==want){refresh(wrongMessage(key),'wrong');return false;}progress++;emit('operation',{preset:id,operation:key,progress});refresh(ops[key].note,progress===p.steps.length?'correct':'');return true;}
 window.NovaLessonComponent?.applyExploreModels();function back(){if(progress){progress--;emit('undo',{preset:id,progress});refresh('Previous equivalent formula restored.');}}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=()=>{id=sel.value;progress=0;emit('preset',id);refresh();};window.NovaLessonComponent?.applyExploreModels();undo.onclick=back;window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{progress=0;emit('reset',id);refresh();};window.NovaLessonComponent?.applyExploreModels();controls.append(sel,undo,reset);window.NovaLessonComponent?.applyExploreModels();panel.append(controls,choices,fb);window.NovaLessonComponent?.applyExploreModels();refresh();},
 challengeIntro:'Use valid inverse operations; then identify the correct new formula and verify with values.',
 challenge(panel,api,stage){active.mode='challenge';let task=0,progress=0,selected=null,solved=false,wrong=0;
 const head=H('div',{class:'f806-head'}),buttons=H('div',{class:'f806-buttons'}),choiceLabel=H('div',{class:'f806-subhead',text:'Choose the formula with the correct subject'}),optionList=H('div',{class:'f806-formula-options'}),numberLabel=H('div',{class:'f806-number'}),field=H('input',{class:'f806-answer',type:'number',step:'any',inputmode:'decimal','aria-label':'Calculate the subject using the given values',placeholder:'Your calculated value'}),verify=H('button',{class:'nova-btn primary',text:'Check formula and value'}),undo=H('button',{class:'nova-btn',text:'Undo'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next formula'}),fb=H('div',{class:'f806-feedback','aria-live':'polite'});
 const p=()=>lessons[order[task]];
 function refresh(msg='',status=''){const z=p();active.preset=order[task];head.textContent='Challenge '+(task+1)+' of '+order.length+' · '+z.name;draw(stage,{preset:order[task],mode:'challenge',progress,solved,wrong:status==='wrong',onApply:apply,onUndo:back});buttons.replaceChildren();z.pool.forEach(key=>{const b=H('button',{class:'nova-btn f806-op-button',text:ops[key].short,'aria-label':ops[key].title,onclick:()=>apply(key)});b.disabled=solved;buttons.appendChild(b);});
 renderChoices(optionList,z.choices,choose,selected,solved);
 choiceLabel.hidden=progress!==z.steps.length;optionList.hidden=progress!==z.steps.length;const tokens=Object.entries(z.inputs).map(([k,v])=>k+' = '+v).join('   ·   ');numberLabel.textContent='CHECK WITH: '+tokens;
 numberLabel.hidden=progress!==z.steps.length;field.hidden=progress!==z.steps.length;verify.disabled=progress!==z.steps.length||solved;field.disabled=solved;next.hidden=!solved;next.style.display=solved?'':'none';fb.textContent=msg||'Apply each valid inverse operation. The final formula stays hidden until your reasoning is complete.';fb.dataset.status=status;}
 function apply(key){if(solved)return false;const z=p(),want=z.steps[progress];if(!want){refresh('Select the correct symbolic formula and calculate the subject.');return false;}
 if(key!==want){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'operation',task});const msg=want==='mul2'?'The fraction is divided by two: multiply BOTH sides by two.':want==='divb'||want==='divx'?'Divide by the coefficient of the target variable, provided it is not zero.':want==='swap'?'First isolate the subject, then swap the equality.':'Undo the OUTERMOST operation from both sides.';refresh(msg,'wrong');return false;}
 progress++;emit('operation',{task,operation:key,progress});refresh('Correct inverse step. '+ops[key].note,'correct');return true;}
 function back(){if(progress&&!solved){progress--;selected=null;emit('undo',{task,progress});refresh('Last operation undone.');}}
 function choose(i){if(solved)return;selected=i;emit('choice',{task,index:i});refresh('Formula selected. Calculate the subject using the given values.');}
 verify.onclick=()=>{const z=p();if(progress!==z.steps.length)return;const v=field.value.trim(),number=Number(v),expected=z.targetFn(z.inputs);
 if(selected===null){refresh('Choose an algebraic formula before checking.','wrong');return;}
 if(!z.choices[selected].correct){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'formula',task});refresh('Not yet. Your expression does not preserve every operation. Recheck signs and the whole fraction numerator.','wrong');return;}
 if(!v||!Number.isFinite(number)||!close(number,expected)){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'numeric',task});refresh('Your formula choice is correct. Recalculate carefully with the supplied values.','wrong');return;}
 solved=true;emit('numericCheck',{task,value:number});N.events.emit('correct',{engine:ID,correct:true,task});refresh('Correct — symbolic formula and numerical substitution both verified.','correct');};
 hint.onclick=()=>{const want=p().steps[Math.min(progress,p().steps.length-1)];api.hint('Undo the outermost operation on BOTH sides. '+ops[want].note);};undo.onclick=back;
 next.onclick=()=>{if(!solved)return;if(task<order.length-1){task++;progress=0;selected=null;solved=false;field.value='';refresh();}else{next.style.display='none';fb.textContent='All formula challenges completed. Corrections made: '+wrong+'.';}};
 panel.append(head,buttons,choiceLabel,optionList,numberLabel,field,verify,undo,hint,next,fb);refresh();}
};
N.events.on('mode',ev=>{const d=ev.detail||{};if(d.engine===ID)active.mode=d.mode;});
if(N.registry)N.registry.add({id:ID,title:C.title,kind:'engine',topics:['algebra','formulae','inverse-proportion'],deps:C.references,events:['value','correct','step','hintUsed']});
const engine=
/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","o"]},exploreFields:{}});
N.bankMount({id:ID,num:'06',title:C.title,spec:spec(),years:'KS3 Years 8–9',linked:C.references,def:DEF});
window.F806_TEST={lessons,ops,order,close,validate,evaluateRow,difference,ratioAt,config:C,state:()=>({...active}),setMode:engine.setMode};
})();
