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

/* NOVA F7-03 — Collecting Like Terms. Canonical F0 drawing, timeline, narration and SVG drag. */
const F703_CONFIG={id:'F7-03',startMode:'watch',preset:'Y7-029',parameters:{types:['x2','x','one'],maxTiles:10,maxPerType:8},
 presets:{
 'Y7-029':{label:'Y7-029 · First like terms',title:'x + 3 + 2x + 1',tokens:[['x',1],['one',1],['x',1],['one',1],['x',1],['one',1],['one',1]],purpose:'Three x rods and four units remain separate families.'},
 'Y7-SIGNED':{label:'Year 7 · Signed coefficients',title:'3x − x + 4 − 2',tokens:[['x',1],['one',1],['x',-1],['x',1],['one',-1],['x',1],['one',1],['one',1],['one',1],['one',-1]],purpose:'Keep the minus sign with the term when collecting.'},
 'Y8-REVISIT':{label:'Year 8 · Variable and constants',title:'−x + 5 + 2x − 1',tokens:[['x',-1],['one',1],['x',1],['one',1],['x',1],['one',1],['one',1],['one',1],['one',-1]],purpose:'Opposite signed x terms combine to x, while constants combine to four.'},
 'GCSE-X2':{label:'GCSE bridge · Quadratic terms',title:'x² + 2x + x² − x + 2',tokens:[['x2',1],['x',1],['one',1],['x2',1],['x',-1],['one',1],['x',1]],purpose:'Keep x squared, x and constants in three distinct groups.'},
 'GCSE-SIGNS':{label:'GCSE bridge · Signed powers',title:'−x² + 3x − x + 2',tokens:[['x2',-1],['x',1],['x',1],['one',1],['x',-1],['x',1],['one',1]],purpose:'A negative x squared tile is not a negative x tile.'}
 },
 challenge:[
 {label:'Like terms',prompt:'Collect x + 3 + 2x + 1',tokens:[['x',1],['one',1],['x',1],['one',1],['x',1],['one',1],['one',1]],answer:{x2:0,x:3,one:4}},
 {label:'A minus sign',prompt:'Collect 3x − x + 4 − 2',tokens:[['x',1],['one',1],['x',-1],['x',1],['one',-1],['x',1],['one',1],['one',1],['one',1],['one',-1]],answer:{x2:0,x:2,one:2}},
 {label:'Negative result',prompt:'Collect x − 3x + 4 − 1',tokens:[['x',1],['one',-1],['x',-1],['one',1],['x',-1],['one',1],['x',-1],['one',1],['one',1]],answer:{x2:0,x:-2,one:3}},
 {label:'Three families',prompt:'Collect x² + x² + 2x − x + 1',tokens:[['x2',1],['x',1],['x2',1],['one',1],['x',-1],['x',1]],answer:{x2:2,x:1,one:1}}
 ],events:{value:['preset','sort','return','undo','reset','keyboard','answer','proof','round','hint'],types:['step','correct','hintUsed','mode']}};
window.F703_CONFIG=F703_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F703_CONFIG),ID=C.id;
const SPEECH={scatter:'Which tiles match?',sort:'Match the same shapes!',count:'Count each family!',result:'Write the shorter sum!',explore:'Sort them by type!',place:'That matches!',wrong:'Not the same kind!',undo:'One move back!',reset:'Ready to sort again!',hint:'Check the tile shape!',ready:'Your sorting turn!',right:'Well collected!',win:'Excellent grouping!'};
const POSES={scatter:'explain',sort:'point',count:'count',result:'cheer',explore:'explain',place:'point',wrong:'oops',undo:'think',reset:'point',hint:'think',ready:'think',right:'cheer',win:'cheer'};
const STEPS=[
 {name:'Notice the mixed expression',cue:'scatter',narration:'The expression contains x rods and unit squares mixed together. The rods are lengths, and the smaller squares are single units. Different kinds cannot be added as if they were the same.'},
 {name:'Sort matching terms',cue:'sort',narration:'Move all the x rods into the x group and all the unit squares into the unit group. The kind and sign of each tile stay exactly the same.'},
 {name:'Count each signed group',cue:'count',narration:'In the x group, count three positive x rods. In the units group, count four positive units. Each kind gets its own coefficient.'},
 {name:'Write the simplified expression',cue:'result',narration:'Three x rods plus four unit squares simplify to three x plus four. We have combined like terms only, preserving the original value.'}
];
function emit(key,value){if(!C.events.value.includes(key))throw Error('F7-03 unexpected event '+key);N.events.emit('value',{engine:ID,key,value});}
const phrase=(g,x,y,t,role='given',size=43,anchor='middle')=>N.chalkText(g,x,y,String(t),{role,size,anchor});
const glass=(g,x,y,w,h,role='given',r=18)=>N.neonBox(g,x,y,w,h,{role,r});
const button=(t,f,important=false)=>H('button',{class:'nova-btn'+(important?' primary':''),text:t,onclick:f});
let serial=0;
function createTiles(rows){if(rows.length>C.parameters.maxTiles)throw Error('Too many tiles');return rows.map(([type,sign])=>{if(!C.parameters.types.includes(type)||![-1,1].includes(sign))throw Error('Invalid tile');return {id:'l'+(++serial),type,sign,home:'scatter'};});}
function coeffs(tiles){let c={x2:0,x:0,one:0};for(const t of tiles){if(!Object.hasOwn(c,t.type)||![-1,1].includes(t.sign))throw Error('Bad tile');c[t.type]+=t.sign;}return c;}
function algebra(c){const out=[];for(const [key,b] of [['x2','x²'],['x','x'],['one','']]){let n=c[key];if(!n)continue;let body=key==='one'?String(Math.abs(n)):(Math.abs(n)===1?'':Math.abs(n))+b;out.push({body,sign:Math.sign(n)});}return out.length?out.map((v,i)=>(i?(v.sign<0?' − ':' + '):(v.sign<0?'−':''))+v.body).join(''):'0';}
function compare(a,b){return ['x2','x','one'].every(k=>a[k]===b[k]);}
// A collected expression has at most one occurrence of each power of x.
function parseAnswer(input){let s=String(input||'').trim().replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/\s+/g,'').replace(/\*/g,'');if(!s)return {error:'Write your simplified expression before checking.'};if(s==='0')return{values:{x2:0,x:0,one:0}};
 if(s[0]!=='-'&&s[0]!=='+')s='+'+s;
 const tokens=s.match(/[+-](?:\d*x(?:\^2)?|\d+)/gi)||[];if(!tokens.length||tokens.join('')!==s)return{error:'Use terms such as 2x² − x + 3. Do not multiply unlike terms.'};
 const result={x2:0,x:0,one:0},seen=new Set();for(const token of tokens){const sign=token[0]==='-'?-1:1,part=token.slice(1);const m=part.match(/^(\d*)(x(?:\^2)?)?$/i);if(!m)return{error:'Check the mathematical notation.'};const type=!m[2]?'one':m[2].toLowerCase()==='x^2'?'x2':'x';if(seen.has(type))return{error:`You still have separate ${type==='one'?'number':type==='x2'?'x²':'x'} terms. Combine them into one coefficient.`};seen.add(type);let n=m[1]?Number(m[1]):1;if(type==='one'&&!m[1])return{error:'A number is missing.'};if(!Number.isSafeInteger(n)||n>1000)return{error:'Use whole-number coefficients.'};result[type]=sign*n;}
 return{values:result};}
function diagnose(guess,expected){const parsed=parseAnswer(guess);if(parsed.error)return parsed.error;const a=parsed.values;
 if(compare(a,expected))return '';
 if(a.x2!==expected.x2){if(a.x===expected.x+expected.x2)return'You have put an x² square into the x group. x² and x are different powers.';return`The x² coefficient should be ${expected.x2}. Count the square tiles separately.`;}
 if(a.x!==expected.x){if(a.x===-expected.x)return'Check the plus and minus signs on the x rods. Negative x reduces the x coefficient.';if(a.x===expected.x+expected.one)return'You cannot turn unit squares into x rods. Keep the number terms apart.';return`Your x coefficient is ${a.x}; count the signed x rods again.`;}
 if(a.one!==expected.one){if(a.one===-expected.one)return'The units have the wrong sign. Positive and negative units must be counted with their signs.';return`Your constant is ${a.one}. Count only the small unit squares.`;}
 return'Check your algebraic groups.';}
function zones(m){return m?{
  scatter:{x:17,y:155,w:426,h:323},x2:{x:18,y:500,w:425,h:185},x:{x:18,y:699,w:425,h:185},one:{x:18,y:898,w:425,h:185},return:{x:255,y:1100,w:188,h:72},W:460,V:1200,
 }: {scatter:{x:27,y:154,w:947,h:193},x2:{x:28,y:367,w:300,h:316},x:{x:350,y:367,w:300,h:316},one:{x:672,y:367,w:300,h:316},return:{x:749,y:727,w:223,h:82},W:1000,V:848};}
function slots(tiles,z,m){const placements={};const rows={scatter:[],x2:[],x:[],one:[]};for(const t of tiles)rows[t.home].push(t);
 for(const t of tiles){const pool=rows[t.home],i=pool.indexOf(t),loc=z[t.home];if(t.home==='scatter'){
  const col=i%(m?2:6),row=Math.floor(i/(m?2:6));placements[t.id]={x:loc.x+(m?23:22)+col*(m?196:151),y:loc.y+(m?46:65)+row*(m?56:87)};
 }else{
  const col=i%(m?4:3),row=Math.floor(i/(m?4:3));placements[t.id]={x:loc.x+(m?18:17)+col*(m?98:91),y:loc.y+(m?56:102)+row*(m?65:75)};
 }}return placements;}
function tileShape(g,type,sgn,x,y,m){const role=sgn===1?'result':'error',d=type==='x2'?{w:m?60:69,h:m?60:69}:type==='x'?{w:m?86:84,h:m?43:46}:{w:m?53:58,h:m?53:58};
 glass(g,x,y,d.w,d.h,role,11);N.neonLine(g,x+7,y+9,x+d.w-7,y+9,{role,width:2.2,opacity:.74});
 if(sgn<0)for(let i=8;i<Math.min(d.w,d.h);i+=12){N.neonLine(g,x+6+i,y+13,x+13+i,y+6,{role:'error',width:1.8,opacity:.65});}
 let label=type==='x2'?'x':type==='x'?'x':'1';phrase(g,x+d.w/2-(type==='x2'?4:0),y+d.h/2+14,(sgn<0?'−':'')+label,role,m?38:40);
 if(type==='x2')phrase(g,x+d.w/2+21,y+d.h/2-11,'2',role,m?25:26);
 return {x,y,w:d.w,h:d.h};}
function board(tiles,opt={}){const m=innerWidth<=700,z=zones(m),interactive=!!opt.interactive,sorted=tiles.filter(t=>t.home!=='scatter').length;
 const s=N.svg.root(z.W,z.V,'A neon-glass sorting workshop with mixed algebra tiles and three like-term groups for x squared area tiles, x rods and unit squares. Signed tiles are positive green or negatively hatched red.');s.classList.add('f703-svg');s.dataset.sorted=String(sorted);s.dataset.total=String(tiles.length);s.dataset.value=algebra(coeffs(tiles));s.dataset.mode=opt.mode||'watch';
 phrase(s,m?24:35,m?54:61,'COLLECT LIKE TERMS','given',m?40:60,'start');phrase(s,m?24:37,m?111:119,opt.title||'Same type, same power.','support',m?29:45,'start');
 const titles={scatter:'MIXED EXPRESSION',x2:'x²  ·  SQUARES',x:'x  ·  RODS',one:'1  ·  UNITS'};
 for(const name of ['scatter','x2','x','one']){const a=z[name],role=name==='scatter'?'op':name==='x2'?'focus':name==='x'?'given':'result';glass(s,a.x,a.y,a.w,a.h,role,20);phrase(s,a.x+18,a.y+43,titles[name],role,m?32:42,'start');
  const count=tiles.filter(t=>t.home===name).length;if(name!=='scatter'&&count===0)phrase(s,a.x+a.w/2,a.y+a.h/2+24,m?'Drop here':'Drop here','support',m?29:30);
  if(name!=='scatter'&&(opt.showCount||opt.correct)&&count){let c=tiles.filter(t=>t.home===name).reduce((n,t)=>n+t.sign,0);phrase(s,a.x+a.w-20,a.y+42,(c>=0?'+':'−')+Math.abs(c),c>=0?'result':'error',m?35:38,'end');}
 }
 const pts=slots(tiles,z,m);
 for(const t of tiles){let p=pts[t.id];const g=E('g',{'data-f703-id':t.id,'data-type':t.type,'data-home':t.home,'data-sign':t.sign,tabindex:interactive?0:-1,role:'button','aria-label':(t.sign<0?'Negative ':'Positive ')+(t.type==='x2'?'x squared':t.type==='x'?'x':'unit')+' tile. Press 1 for x squared, 2 for x, 3 for units; R returns a tile to the unsorted pool.'},s);
  const b=tileShape(g,t.type,t.sign,p.x,p.y,m);
  if(opt.animate&&!N.reducedMotion())N.motion.arrive(g,0,t.home==='scatter'?-26:45,460);
  if(interactive){g.addEventListener('keydown',e=>{const dest=({Digit1:'x2',Digit2:'x',Digit3:'one',Numpad1:'x2',Numpad2:'x',Numpad3:'one',Enter:t.type,KeyR:'scatter',Backspace:'scatter',Delete:'scatter'})[e.code];if(dest){e.preventDefault();opt.onMove?.(t.id,dest,'keyboard');}});
   N.ui.svgDrag(s,g,{box:b,zones:()=>[{id:'x2',kind:'drop',...z.x2},{id:'x',kind:'drop',...z.x},{id:'one',kind:'drop',...z.one},{id:'scatter',kind:'drop',...z.scatter},{id:'return',kind:'remove',...z.return}],onDrop:id=>!!opt.onMove?.(t.id,id,'drag'),onRemove:()=>opt.onMove?.(t.id,'scatter','drag'),canStart:()=>!opt.busy?.()});
  }
 }
 if(interactive){glass(s,z.return.x,z.return.y,z.return.w,z.return.h,'error',14);phrase(s,z.return.x+z.return.w/2,z.return.y+z.return.h/2+13,'RETURN','error',m?37:40);
  if(!m)phrase(s,33,790,'Drag each tile to its matching family.', 'support',38,'start');}
 if(opt.celebrate)N.motion.flash(s,z.W/2,m?1030:515,'result',63);
 return s;}
function dock(stage,k){
if(window.NovaLessonComponent?.active){[stage,k]=window.NovaLessonComponent.args("dock",arguments);}
N.scene.helperStrip(stage,POSES[k]||'think',SPEECH[k]||'Find the matching tiles!');}
function show(stage,tiles,opt={}){
if(window.NovaLessonComponent?.active){[stage,tiles,opt]=window.NovaLessonComponent.args("show",arguments);}
stage.textContent='';N.cap(stage,'Like-term sorter',opt.caption||'Group matching algebra terms before simplifying.');
 const layout=H('div',{class:'f703-layout'}),side=H('aside',{class:'f703-aside'}),svg=board(tiles,opt);
 side.append(N.neonCard([H('strong',{text:'What makes terms alike?'}),H('p',{text:'Only the same variable with the same power belongs in one group. x² is an area tile, x a length rod, and 1 a unit square.'})],{role:'focus'}),N.neonCard([H('strong',{text:'Keep each sign'}),H('p',{text:'Red hatched tiles have a negative value. Sorting changes position, not sign or value; the expression remains equivalent.'})],{role:'op'}));
 layout.append(svg,side);stage.append(layout);
 const f=H('div',{class:'f703-proof'+(opt.correct?' success':'')}),sum=opt.hideAnswer?'Sort the tiles, then enter the collected expression.':opt.proof??algebra(coeffs(tiles));f.append(H('span',{class:'f703-proof-label',text:opt.hideAnswer?'Challenge':'Simplified expression'}),H('span',{text:sum}));stage.append(f);dock(stage,opt.cue||'scatter');return svg;}
function watch(i,stage){const src=createTiles(C.presets['Y7-029'].tokens);if(i===1){let first=0;for(const t of src){if((t.type==='x'||t.type==='one')&&first++<4)t.home=t.type;}}if(i>=2)src.forEach(t=>t.home=t.type);
 show(stage,src,{caption:STEPS[i].name,title:['What kinds can you see?','Move matching shapes together.','Count each family.','Same value · fewer terms.'][i],cue:STEPS[i].cue,showCount:i>=2,proof:i===3?'3x + 4':i===2?'3 x tiles and 4 units':'x + 3 + 2x + 1',animate:i===1||i===2,celebrate:i===3});}
function workspace(panel,stage,mode,api){let idx=0,preset=C.preset,tiles=[],history=[],bad=false,msg='',cue=mode==='challenge'?'ready':'explore',done=false;
 function load(){const v=mode==='challenge'?C.challenge[idx]:C.presets[preset];tiles=createTiles(v.tokens);history=[];bad=false;done=false;cue=mode==='challenge'?'ready':'explore';msg='Drag a tile into its matching group, or use keys 1 (x²), 2 (x), 3 (units).';}
 function snapshot(){history.push(tiles.map(t=>({...t})));if(history.length>45)history.shift();}
 function move(id,dest,how){const t=tiles.find(t=>t.id===id);if(!t||done)return false;
  if(dest==='return')dest='scatter';if(!['scatter','x2','x','one'].includes(dest))return false;
  if(dest!=='scatter'&&dest!==t.type){bad=true;cue='wrong';msg=t.type==='x2'?'The square is x², not an x rod or unit.':t.type==='x'?'An x rod goes in the x family, never with x² or units.':'A small unit square can combine only with other numbers.';updateControls();return false;}
  if(dest===t.home)return true;
  if(dest!=='scatter'&&tiles.filter(x=>x.home===dest).length>=C.parameters.maxPerType){bad=true;cue='wrong';msg='This group is full. Choose a different example.';updateControls();return false;}
  snapshot();t.home=dest;bad=false;cue=dest==='scatter'?'undo':'place';msg=dest==='scatter'?'Tile returned to the unsorted area.':'Correct family. Keep each tile’s sign unchanged.';
  emit(how==='keyboard'?'keyboard':dest==='scatter'?'return':'sort',{id,dest,type:t.type,sign:t.sign,sorted:tiles.filter(x=>x.home!=='scatter').length});render();return true;}
 function undo(){if(!history.length)return;tiles=history.pop();cue='undo';bad=false;msg='Last sort move undone.';emit('undo',{mode,count:tiles.length});render();}
 function reset(){load();emit('reset',{mode});render();}
 function hint(){const t=tiles.find(t=>t.home==='scatter');msg=t?`Find the matching ${t.type==='x2'?'square (x²)':t.type==='x'?'rod (x)':'unit (1)'} family. Keep its ${t.sign>0?'positive':'negative'} sign.`:'All tiles are sorted. Now collect each signed coefficient.';cue='hint';bad=false;api?.hint(msg);emit('hint',{mode,idx});render();}
 function next(){if(idx+1<C.challenge.length){idx++;load();render();}else{done=true;cue='win';msg='All four rounds completed. You have separated and collected the algebraic terms correctly.';render();}}
 function check(){if(done)return;const task=C.challenge[idx],total=tiles.length,placed=tiles.filter(x=>x.home!=='scatter').length;
 if(placed<total){bad=true;cue='wrong';msg=`Sort all ${total} tiles first. You still have ${total-placed} in the mixed area.`;api.check(false,msg,{round:idx});render();return;}
 const val=String(panel.querySelector('#f703-answer')?.value||'');emit('answer',{round:idx,answer:val,terms:coeffs(tiles)});const error=diagnose(val,task.answer);
 if(error){bad=true;cue='wrong';msg=error;api.check(false,msg,{round:idx});render(val);return;}
 api.check(true,'Correct. Equal types and powers were combined without changing any sign.',{round:idx});emit('proof',{round:idx,expression:algebra(task.answer)});cue='right';bad=false;msg='Correct: '+algebra(task.answer)+' is the collected expression.';next();}
 function updateControls(saved){panel.textContent='';if(done){panel.append(H('p',{class:'f703-win',text:'All four collecting-like-terms challenges complete. You kept x², x and constants distinct.'}));return;}
 if(mode==='explore'){const select=H('select',{'aria-label':'Choose a collecting like terms preset'});Object.entries(C.presets).forEach(([k,v])=>select.add(new Option(v.label,k)));select.value=preset;
  panel.append(H('div',{class:'f703-controls'},[H('label',{},['Teaching example',select]),button('Undo',undo),button('Reset',reset),button('Hint',hint)]));
  select.onchange=()=>{preset=select.value;C.preset=preset;load();emit('preset',preset);render();};
 }else{
  const task=C.challenge[idx];panel.append(H('p',{class:'f703-hint',text:`Challenge ${idx+1} of ${C.challenge.length} · ${task.prompt}. Sort every tile, then write the simplified expression.`}));
  const input=H('input',{id:'f703-answer',type:'text',class:'nova-input','aria-label':'Your simplified expression',placeholder:'e.g. 3x + 4',value:saved||''});input.autocomplete='off';input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check();}});
  panel.append(H('div',{class:'f703-controls'},[H('label',{},['Simplified expression',input]),button('Check expression',check,true),button('Hint',hint),button('Reset round',reset)]));
 }
 panel.append(H('p',{class:'f703-hint',text:'Drag each tile to x², x, or 1. Keyboard: focus a tile, then press 1 for x², 2 for x, 3 for units, or R to return it. Undo restores the last move.'}));
 panel.append(H('p',{class:'f703-status'+(bad?' bad':''),role:'status',text:msg}));
 // Accessible sorting controls are independent of pointer drag.
 const first=tiles.find(t=>t.home==='scatter');if(first)panel.append(H('div',{class:'f703-actions'},[button('Sort next matching tile',()=>move(first.id,first.type,'keyboard'))]));
 }
 function render(saved){const task=mode==='challenge'?C.challenge[idx]:C.presets[preset];show(stage,tiles,{interactive:!done,mode,cue,title:mode==='challenge'?task.prompt:task.title,caption:mode==='challenge'?`Challenge ${idx+1} · ${task.label}`:`Explore · ${task.label}`,hideAnswer:mode==='challenge'&&!done,showCount:mode==='explore',correct:done,onMove:move,celebrate:done});updateControls(saved);}
 load();render();}
const def={id:ID,title:'Collecting Like Terms',config:C,steps:STEPS,alt:'Mixed neon-glass algebra tiles are sorted into x squared area-square, x rod and unit-square zones. Positive and negative tiles have distinct colouring and hatching.',staticAlt:'Three x tiles and four unit tiles remain separate groups; x + 3 + 2x + 1 simplifies to 3x + 4.',render:watch,exploreIntro:'Sort the mixed algebra tiles into matching groups.',explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();return workspace(panel,stage,'explore',null);},challenge(panel,api,stage){return workspace(panel,stage,'challenge',api);},onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['algebra','like terms','coefficients','equivalent expressions'],deps:['F0-02','F0-03','F0-04','F0-08','F7-01','F7-02']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"dock":["stage","k"],"show":["stage","tiles","opt"]},exploreFields:{}});
N.bankMount({id:ID,num:'03',title:'Collecting Like Terms · Premium Review',def,linked:['F7-01','F7-02','F7-06'],years:'Year 7 collecting like terms; Year 8 consolidation; GCSE quadratic extension',spec:{purpose:'Show how only equal types and powers combine, including signed coefficients and x².',params:'x² square, x rod and unit tile; up to 10 per unsorted expression; signs retain pattern cue.',presets:'Y7-029, Y7 signed, Year 8 revisit, GCSE quadratic and signed-extension examples.',steps:'Scatter mixed terms → sort into groups → count signed coefficients → write equivalent simplified expression.',interactions:'Drag tiles into mathematically correct zones, invalid drops spring home, return to red tray, keyboard 1/2/3/R, undo, preset reset, expression entry.',traps:'x² versus x, numbers versus x, forgetting negative coefficients, leaving terms uncollected.',gcse:'GCSE bridge: quadratic terms, signed coefficients and additive inverses.'}});
// Preserve the original SVG drag transaction if browser SVG reparenting loses pointer capture.
(function(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const el=e.target.closest?.('[data-drag="1"]');if(el&&host.contains(el))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>pointer=null);
})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('alt'))img.alt='NOVA mathematics helper';});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{childList:true,subtree:true});
window.F703_MATH={createTiles,coeffs,algebra,compare,parseAnswer,diagnose};
})();
