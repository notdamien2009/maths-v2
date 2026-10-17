/* Bounded lesson/native parameters. No alternative mathematical renderer. */
(function(w){'use strict';w.NovaF2Contracts={validate(id,r,C,local){const e=[],n=+id.slice(3),l=r.data?.lesson||r.nativeData?.lesson,a=r.scene?.arguments||{},d=r.data||r.nativeData||{};
const finite=(v,k)=>{if(v!==undefined&&(typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>1e9))e.push(k+' must be finite within ±1 billion');},int=(v,lo,hi,k)=>{if(v!==undefined&&(!Number.isInteger(v)||v<lo||v>hi))e.push(k+' must be an integer '+lo+' to '+hi);},decimal=(v,k,dp=3)=>{if(v!==undefined&&(!new RegExp('^\\d{1,4}(?:\\.\\d{1,'+dp+'})?$').test(String(v))))e.push(k+' supports nonnegative values through thousands and '+dp+' decimal places');};
function counts(c,places,max){if(!c||typeof c!=='object'||Array.isArray(c)){e.push('Supply a native count map');return;}for(const[k,v]of Object.entries(c)){if(!places.map(String).includes(k))e.push('Unknown native place '+k);if(v!==null)int(v,0,max,'count '+k);}}
function state(s){if(!s||typeof s!=='object')return;
if(n===1){if(s.c)counts(s.c,[3,2,1,0,-1,-2,-3],9);if(s.v!==undefined)decimal(s.v,'place-value number');}
if(n===2&&s.c)counts(s.c,[2,1,0,-1,-2],20);
if(n===3){if(s.sc&&!['whole','decimal'].includes(s.sc))e.push('Scale must be whole or decimal');if(s.c){counts(s.c,['f','r','u'],26);int(s.c.f,0,9,'flats');int(s.c.u,0,20,'units');}}
if(n===5){if(s.c)counts(s.c,[2,1,0,-1,-2],11);if(s.g)counts(s.g,[3,2,1,0,-1,-2],9);}
if(n===8){decimal(s.v,'expanded number');if(s.e!==undefined&&(s.e<0||s.e>1))e.push('Expansion phase must be 0–1');if(s.form&&!['add','mult','pow','words'].includes(s.form))e.push('Unknown expansion form');}
if(n===9){if(s.m!==undefined&&(!/^\d(?:\.\d{1,3})?$/.test(String(s.m))||+s.m<1||+s.m>=10))e.push('Standard-form mantissa must be 1 ≤ m < 10 with up to three decimal places');int(s.n,-6,6,'standard-form exponent');if(s.m!==undefined&&s.n!==undefined&&s.n-(String(s.m).replace('.','').length-1)<-6)e.push('Significant digits leave the native scaler');if(s.cmp)state(s.cmp);}
if(n===10){if(s.view&&!['square','cube','chain','law'].includes(s.view))e.push('Unknown powers view');int(s.n,1,10,'side length');int(s.base,1,10,'base');int(s.a,0,8,'first index');int(s.b,0,8,'second index');if(s.view==='law'&&s.op==='÷'&&s.a<s.b)e.push('Native cancellation model requires first index ≥ second index');if(s.view==='law'&&s.a+s.b>8)e.push('Native chain supports up to eight factors');}
if(n===12){int(s.pos,0,10,'positive counters');int(s.neg,0,10,'negative counters');}
if(n===13){int(s.frames,1,2,'ten frames');if(s.unit!==undefined&&![.1,1,10].includes(s.unit))e.push('Native frame unit must be 0.1, 1 or 10');int(s.a,0,10*(s.frames||2),'filled cells');}
if(n===14){int(s.at,0,100,'hundred-square marker');int(s.mult,1,100,'multiple');}
if(n===15){if(s.base!==undefined&&![2,3,5,8,10].includes(s.base))e.push('Supported bases are 2, 3, 5, 8, 10');if(s.d){if(!Array.isArray(s.d)||s.d.length!==(s.base===2?8:4))e.push('Binary uses eight places; other bases use four');else s.d.forEach(v=>int(v,0,s.base-1,'base digit'));}}
if(n===16){const cards=[...(s.cards||s.tray||[])];for(const list of Object.values(s.placed||{}))cards.push(...list);if(cards.length>12)e.push('At most twelve classification cards');for(const card of cards)try{local.home(card);}catch(x){e.push(String(x.message||x));}}
}
const native=r.native||{},st=a.st||d.st;if(st)state(st);if(r.explore?.name==='st')state(r.explore.value);if(n===1&&d.v!==undefined)decimal(d.v,'place-value number');if(n===2&&d.c)state({c:d.c});
function calc(v){if(!v)return;decimal(v.a,'first operand',2);decimal(v.b,'second operand',2);if(n===6){if(v.op&&!['+','-'].includes(v.op))e.push('Column operation must be + or -');if(v.op==='-'&&+v.a<+v.b)e.push('This native subtraction requires a ≥ b');if(v.op==='+'&&+v.a + +v.b>=10000)e.push('Column result exceeds thousands');}if(n===7){if(v.kind&&!['grid','div'].includes(v.kind))e.push('Use grid or div');if(v.kind==='div'){int(+v.b,1,9,'short divisor');if(v.a!==undefined&&v.b>0&&local.division&&(!local.division(v.a,+v.b).exact||local.division(v.a,+v.b).lo<-3))e.push('Native short division requires a terminating quotient within three decimal places');}else if([v.a,v.b].some(x=>String(x).replace(/[.0]/g,'').length>4))e.push('Native grid supports at most four nonzero parts per operand');}}
if(n===6||n===7){if(l)calc(l);if(n===7&&d.a!==undefined)calc(d);if(n===6&&d.pl)calc({a:d.pl.A,b:d.pl.B,op:d.pl.op});if(n===7&&a.a!==undefined)calc({a:a.a,b:a.b,kind:a.k});}
if(n===11){const expression=(r.explore?.name==='expression'?r.explore.value:undefined)??l?.expression??d.e??a.st?.src;if(expression!==undefined)try{local.expression(expression);}catch(x){e.push(String(x.message||x));}}
if(l){if(!l||typeof l!=='object'||Array.isArray(l))e.push('lesson must be an object');else{state(l.state||{});if(n===1)decimal(l.value,'place-value number');if(n===8)decimal(l.value??l.state?.v,'expanded number');if(n===16&&l.cards)state({cards:l.cards});int(l.upto,0,30,'native stage count');if(l.actions){if(!Array.isArray(l.actions)||l.actions.length>20)e.push('At most twenty native actions');else for(const action of l.actions){if(!local.actions.includes(action.method))e.push('Unsupported native action '+action.method);if(action.args!==undefined&&!Array.isArray(action.args))e.push('Action arguments must be an array');for(const key of ['delayMs','waitMs'])if(action[key]!==undefined&&(!Number.isFinite(action[key])||action[key]<0||action[key]>60000))e.push('Action delay must be 0–60000 ms');}}}}

if(l&&typeof l==='object'){
 const required={1:['value'],6:['a','b'],7:['a','b'],11:['expression']};for(const field of required[n]||[])if(l[field]===undefined)e.push('lesson.'+field+' is required');
 if([2,3,5,9,10,12,13,14,15].includes(n)&&(!l.state||typeof l.state!=='object'))e.push('Supply the native lesson.state');
 if(n===8&&l.value===undefined&&l.state?.v===undefined)e.push('Supply an expanded number');
 if(n===16&&!l.cards&&!l.state)e.push('Supply classification cards or state');
 const requiredState={2:['c'],3:['sc','c'],5:[l.view==='gattegno'?'g':'c'],9:['m','n'],10:l.state?.view==='law'?['view','base','a','b','op']:l.state?.view==='chain'?['view','base','a']:['view','n'],12:['pos','neg'],13:['frames','unit','a'],14:['at'],15:['base','d']};for(const field of requiredState[n]||[])if(l.state?.[field]===undefined)e.push('lesson.state.'+field+' is required');
 for(const action of Array.isArray(l.actions)?l.actions:[]){const args=action.args||[],v=args[0],key=action.method;const needsArg=['shift','exchange','breakOne','to','setN','grow','build','fill','jump','multiples','setAt','add','fillTo','drop','glow','ff'];if(needsArg.includes(key)&&args.length!==1)e.push(key+' requires exactly one argument');if(key==='build')int(v,0,8,'factor count');
 if(['shift'].includes(key))int(v,-3,3,'shift amount');
 if(['exchange','breakOne'].includes(key)){if(n===3){if(!(key==='exchange'?['u','r']:['f','r']).includes(v))e.push('Unknown block exchange unit');}else int(v,n===5?-2:-2,2,'exchange column');}
 if(key==='to'&&![0,1].includes(v))e.push('Expansion target must be 0 or 1');
 if(key==='grow')int(v,1,10,'growth target');if(key==='setN')int(v,-6,6,'exponent');
 if(key==='fill')int(v,0,(l.state?.frames||1)*10,'filled cells');
 if(key==='setAt')int(v,1,100,'square marker');if(key==='jump')int(v,-99,99,'square jump');if(key==='multiples')int(v,1,100,'multiple');if(key==='ff')int(v,0,30,'stage count');
 if(key==='add'&&n===15)int(v,0,l.state?.d?.length-1,'base column');if(key==='glow'&&!['N','Z','Q','I','R'].includes(v))e.push('Unknown set');if(key==='fillTo')state({base:l.state?.base,d:v});
 if(key==='drop'){if(!Array.isArray(v))e.push('Drop expects cards');else state({cards:v});}
 }
}
const cfg=r.config||{};if(n===10)int(cfg.maxN,1,10,'maximum side length');if(cfg.visiblePlaces!==undefined&&cfg.visiblePlaces!==null){const allowed=n===1?[3,2,1,0,-1,-2,-3]:n===2?[2,1,0,-1,-2]:n===5?[3,2,1,0,-1,-2]:[];if(!allowed.length||!Array.isArray(cfg.visiblePlaces)||!cfg.visiblePlaces.length||new Set(cfg.visiblePlaces).size!==cfg.visiblePlaces.length||cfg.visiblePlaces.some(p=>!allowed.includes(p)))e.push('visiblePlaces must be a nonempty unique subset of native columns/rows');}
for(const preset of Object.values(cfg.presets||{})){if([6,7].includes(n))calc(preset);else if(n===1){if(preset.value!=='')decimal(preset.value,'preset number');}else if(n===3)state({sc:preset.scale,c:preset.c});else if(n===11)try{local.expression(preset.e);}catch(x){e.push(String(x.message||x));}else state(preset);}
for(const key of ['places','rods','rows'])if(cfg[key]!==undefined&&C[key]&&JSON.stringify(cfg[key])!==JSON.stringify(C[key]))e.push('Keep native '+key+' unchanged; use visiblePlaces to focus the apparatus');
return e;
}};})(window);
