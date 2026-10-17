/* F8 lesson-record contracts (2026-10-17): algebra states are checked before anything is drawn.
   A lesson state chooses a native preset ("preset") and may override that preset's own JSON fields.
   Every override is type-checked against the native preset, and the algebra is re-checked with a small exact-order evaluator. */
(function(w){'use strict';
const num=x=>typeof x==='number'&&Number.isFinite(x),close=(a,b)=>Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b));
/* ---------- expression evaluator: × ÷ − ² ³ \frac{}{}, implicit multiplication, single-letter variables ---------- */
function norm(s){s=String(s);let k=0;while(/\\frac\{([^{}]*)\}\{([^{}]*)\}/.test(s)&&k++<9)s=s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'(($1)/($2))');
 return s.replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/⁴/g,'^4').replace(/⁵/g,'^5').replace(/⁶/g,'^6').replace(/\s+/g,'');}
function tokens(s){const t=[],re=/(\d+(?:\.\d+)?|\.\d+)|([A-Za-z])|([-+*/^()])/y;let m;re.lastIndex=0;while(re.lastIndex<s.length){m=re.exec(s);if(!m)throw Error('bad symbol in '+s);t.push(m[1]!=null?{n:+m[1]}:m[2]!=null?{v:m[2]}:{o:m[3]});}
 const out=[];for(const x of t){const p=out[out.length-1];if(p&&(p.n!=null||p.v!=null||p.o===')')&&(x.v!=null||x.o==='('||(x.n!=null&&p.n==null)))out.push({o:'*'});out.push(x);}return out;}
function parse(s){const t=tokens(norm(s));let i=0;const peek=()=>t[i],eat=o=>{if(t[i]&&t[i].o===o){i++;return true;}return false;};
 function prim(){const x=t[i++];if(!x)throw Error('incomplete expression');if(x.n!=null)return ()=>x.n;if(x.v!=null)return V=>{if(!(x.v in V))throw Error('unknown '+x.v);return V[x.v];};if(x.o==='('){const e=add();if(!eat(')'))throw Error('missing )');return e;}if(x.o==='-'){const e=pow();return V=>-e(V);}if(x.o==='+')return pow();throw Error('unexpected '+x.o);}
 function pow(){const b=prim();if(eat('^')){const e=unary();return V=>Math.pow(b(V),e(V));}return b;}
 function unary(){if(eat('-')){const e=unary();return V=>-e(V);}if(eat('+'))return unary();return pow();}
 function mul(){let a=unary();for(;;){if(eat('*')){const l=a,r=unary();a=V=>l(V)*r(V);}else if(eat('/')){const l=a,r=unary();a=V=>l(V)/r(V);}else return a;}}
 function add(){let a=mul();for(;;){if(eat('+')){const l=a,r=mul();a=V=>l(V)+r(V);}else if(eat('-')){const l=a,r=mul();a=V=>l(V)-r(V);}else return a;}}
 const e=add();if(i!==t.length)throw Error('unexpected text in '+s);return e;}
const vars=s=>[...new Set((norm(s).match(/[A-Za-z]/g)||[]))];
function relation(s){const parts=String(s).split(/(≡|≤|≥|<=|>=|<|>|=)/).map(x=>x.trim());const sides=[],ops=[];parts.forEach((p,i)=>i%2?ops.push(p):sides.push(p));return {sides,ops};}
const cmp={'=':(a,b)=>close(a,b),'≡':(a,b)=>close(a,b),'<':(a,b)=>a<b-1e-9,'>':(a,b)=>a>b+1e-9,'≤':(a,b)=>a<=b+1e-9,'<=':(a,b)=>a<=b+1e-9,'≥':(a,b)=>a>=b-1e-9,'>=':(a,b)=>a>=b-1e-9};
function truth(s,V){const r=relation(s),f=r.sides.map(parse);for(let k=0;k<r.ops.length;k++)if(!cmp[r.ops[k]](f[k](V),f[k+1](V)))return false;return true;}
const SAMPLES=[[1.7,-2.3,3.1],[-0.6,2.9,1.3],[4.1,0.7,-1.9]];
function sample(names,j){const V={};names.forEach((n,i)=>V[n]=SAMPLES[j][i%3]+0.11*i);return V;}
function same(a,b){const fa=parse(a),fb=parse(b),ns=[...new Set([...vars(a),...vars(b)])];for(let j=0;j<3;j++){const V=sample(ns,j);if(!close(fa(V),fb(V)))return false;}return true;}
function linRoot(L,R){const f=parse(L),g=parse(R),ns=[...new Set([...vars(L),...vars(R)])];if(ns.length!==1)return null;const h=x=>f({[ns[0]]:x})-g({[ns[0]]:x}),a=h(0),b=h(1),c=h(2);if(!close(c-b,b-a)||close(b,a))return null;return {v:ns[0],x:-a/(b-a)};}
/* A chain of working lines: expressions must keep one value, equations one solution, identities must hold. */
function chain(lines){const e=[];let expr=null,root=null;lines.forEach((s,i)=>{try{const r=relation(s);if(!r.ops.length){if(expr!==null&&!same(expr,s))e.push('line '+(i+1)+' does not keep the value of the line before');expr=expr??s;return;}
  if(r.ops.every(o=>o==='≡')){if(!r.sides.slice(1).every(x=>same(r.sides[0],x)))e.push('line '+(i+1)+' is not an identity');if(expr!==null&&!same(expr,r.sides[0]))e.push('line '+(i+1)+' changes the expression');return;}
  if(r.ops.length===1&&r.ops[0]==='='){const ns=vars(s);if(!ns.length){if(!close(parse(r.sides[0])({}),parse(r.sides[1])({})))e.push('line '+(i+1)+' is a false statement');return;}const z=linRoot(r.sides[0],r.sides[1]);if(!z){e.push('line '+(i+1)+' must be a linear equation in one unknown');return;}if(root&&!close(root.x,z.x))e.push('line '+(i+1)+' changes the solution');root=root||z;return;}
  e.push('line '+(i+1)+' uses an unsupported relation');}catch(err){e.push('line '+(i+1)+': '+err.message);}});return {errors:e,root};}
w.NovaF8Algebra={norm,parse,vars,relation,truth,same,linRoot,chain,close};
})(window);
(function(w){'use strict';const A=w.NovaF8Algebra,num=x=>typeof x==='number'&&Number.isFinite(x),isInt=Number.isInteger,close=A.close;
function walk(v,base,path,e){
 if(base===undefined){e.push(path+' is not a field of this component');return;}
 if(typeof base==='function'){e.push(path+' cannot be replaced');return;}
 if(Array.isArray(v)){if(!Array.isArray(base)){e.push(path+' must not be a list');return;}if(v.length>12)e.push(path+' is too long');v.forEach((x,i)=>walk(x,base.length?base[Math.min(i,base.length-1)]:x,path+'['+i+']',e));return;}
 if(v&&typeof v==='object'){if(!base||typeof base!=='object'||Array.isArray(base)){e.push(path+' must not be an object');return;}for(const k of Object.keys(v))walk(v[k],k in base?base[k]:(Object.keys(base).length&&Object.values(base).every(x=>typeof x===typeof v[k])?v[k]:undefined),path+'.'+k,e);return;}
 if(typeof v==='number'){if(!num(v))e.push(path+' must be a finite number');else if(Math.abs(v)>500)e.push(path+' is outside the range this apparatus can draw');if(base!==null&&typeof base!=='number')e.push(path+' must be a '+typeof base);return;}
 if(base!==null&&typeof base!==typeof v)e.push(path+' must be a '+typeof base);if(typeof v==='string'&&(v.length>160||/%%%|<\/?script/i.test(v)))e.push(path+' is not valid text');}
const T=(f)=>{try{return f();}catch(err){return 'algebra: '+err.message;}};
const chainErr=lines=>A.chain(lines).errors;
const rules={
 'F8-01':(P)=>[P.lines.length!==4&&'lines must hold four working lines',P.ops.length!==3&&'ops must name three operations',...chainErr(P.lines)],
 'F8-02':(P,X)=>[!P.forward.every(k=>X.operations[k])&&'forward must use known operations',JSON.stringify(P.inverse)!==JSON.stringify(X.inv(P.forward))&&'inverse must undo forward in reverse order',
   X.calc(P.x,P.forward)!==P.out&&'out must equal the forward route applied to x',X.calc(P.challengeX,P.forward)!==P.challengeOut&&'challengeOut must equal the forward route applied to challengeX'],
 'F8-03':(P,X)=>{const c=P.challenge,ops=P.ops,e=[!ops.every(k=>X.operations[k])&&'ops must use known operations',!c.opPool.every(k=>X.operations[k])&&'challenge.opPool must use known operations',!P.inputs.includes(P.chosen)&&'chosen must be one of the inputs'];
   if(P.reverse){e.push(!(P.reverseOps||[]).every(k=>X.operations[k])&&'reverseOps must use known operations',X.calc(c.givenOutput,P.reverseOps)!==c.want&&'challenge.want must equal the reverse route applied to givenOutput',X.calc(c.want,ops)!==c.givenOutput&&'challenge.want must map forward onto givenOutput');}
   else e.push(X.calc(c.input,ops)!==c.want&&'challenge.want must equal the rule applied to challenge.input');
   e.push(T(()=>{const r=A.relation(P.rule);if(r.ops.length!==1||r.ops[0]!=='=')return 'rule must be one equation';const side=r.sides.find(s=>A.vars(s).includes('x'));const f=A.parse(side);return P.inputs.every(x=>close(f({x}),X.calc(x,ops)))?false:'rule text does not match the operation gears';}));return e;},
 'F8-04':(P,X)=>[!P.forward.every(k=>X.operations[k])&&'forward must use known operations',!P.pool.every(k=>X.operations[k])&&'pool must use known operations',![P.input,P.challengeInput].every(x=>X.calc(X.calc(x,P.forward),P.inverse)===x)&&'inverse must return every input',
   T(()=>{const r=A.relation(P.algebra),f=A.parse(r.sides[1]);return [P.input,P.challengeInput,1,2].every(x=>close(f({x}),X.calc(x,P.forward)))?false:'algebra text does not match the forward route';})],
 'F8-05':(P,X)=>{const e=[];const rows=(rs,sol,where)=>{rs.forEach((r,i)=>e.push(T(()=>[1.5,-2,3].every(x=>close(A.parse(r.L)({x}),r.a*x+r.b)&&close(A.parse(r.R)({x}),r.c*x+r.d))?false:where+' row '+(i+1)+' text does not match its coefficients'),(r.a===r.c)&&where+' row '+(i+1)+' has no single solution',r.a!==r.c&&!close((r.d-r.b)/(r.a-r.c),sol)&&where+' row '+(i+1)+' does not have the stated solution'));};
   rows(P.rows,P.solution,'');rows(P.challenge.rows,P.challenge.solution,'challenge');e.push(![...P.steps,...P.pool,...P.challenge.steps,...P.challenge.pool].every(k=>X.operations[k])&&'operations must be known operation cards');return e;},
 'F8-06':(P,X)=>[T(()=>{const v=P.make({...P.inputs});return X.validate(P,v)&&num(P.targetFn(P.inputs))?false:'inputs make an invalid or undefined formula';})],
 'F8-07':(P)=>[T(()=>num(A.parse(P.tokens.join(' '))(P.values))?false:'tokens and values do not make a value'),!P.variables.every(v=>v in P.values)&&'values must give every variable'],
 'F8-08':(P)=>[T(()=>A.same(P.left,P.right)!==(P.truth==='equivalent')?'truth does not match the two expressions':false)],
 'F8-09':(P,X)=>[T(()=>{const r=A.relation(P.rule),f=A.parse(r.sides[1]),v=A.vars(r.sides[1])[0]||'x';return [-2,-1,0,1,2,4].every(x=>close(f({[v]:x}),X.value(P,x)))?false:'rule text does not match its coefficients';})],
 'F8-10':(P,X)=>[P.a[0]===P.b[0]&&'the two lines must not be parallel',T(()=>{const s=X.solution(P);return Math.abs(s.x)<=5&&s.y>=-5&&s.y<=7&&isInt(s.x*2)&&isInt(s.y*2)?false:'the intersection must lie on the drawn grid in half-unit steps';})],
 'F8-11':(P,X)=>[!P.a&&'a must be non-zero',T(()=>{const xs=[];for(let x=-9;x<=9;x+=0.5)xs.push(x);return [P.original,...P.steps].every(s=>xs.every(x=>A.truth(s.replace(/^[^:]*:/,''),{x})===X.accepts(P,x)))?false:'the inequality text does not match its numbers';})],
 'F8-12':(P)=>[!P.a&&'a must be non-zero',P.b*P.b-4*P.a*P.c<=0&&'the quadratic must have two real roots'],
 'F8-13':(P)=>[!['multiply','divide','power'].includes(P.kind)&&'kind must be multiply, divide or power',!(isInt(P.m)&&isInt(P.n)&&P.m>=1&&P.n>=1&&P.m<=6&&P.n<=6)&&'indices must be whole numbers from 1 to 6',P.kind==='divide'&&P.m<=P.n&&'divide needs m > n',!/^[a-z]$/.test(P.base)&&'base must be one letter'],
 'F8-14':(P)=>[T(()=>{const t=A.parse(P.top),b=A.parse(P.bottom),a=A.parse(String(P.answer).replace(/÷/g,'/')),ns=[...new Set([...A.vars(P.top),...A.vars(P.bottom)])];for(const x of [1.7,-2.6,3.3]){const V={};ns.forEach((n,i)=>V[n]=x+i*.4);if(!close(t(V)/b(V),a(V)))return 'answer is not the simplified fraction';}const V={};ns.forEach(n=>V[n]=P.exclude);return close(b(V),0)?false:'exclude must make the denominator zero';})],
 'F8-15':(P)=>[!(isInt(P.wrong)&&P.wrong>=0&&P.wrong<P.lines.length)&&'wrong must point at one of the lines',P.correct===P.lines[P.wrong]&&'correct must differ from the wrong line'],
 'F8-16':(P)=>{const m=P.models[P.correct];if(!m)return ['correct must point at a model'];return [m.type==='linear'&&P.kind==='evaluate'&&!close(m.a*P.input+m.b,P.result)&&'result must equal the correct model at the input',m.type==='linear'&&P.kind==='target'&&!close(m.a*P.result+m.b,P.target)&&'result must reach the target',m.type==='intersection'&&!close(m.left.a*P.result+m.left.b,m.right.a*P.result+m.right.b)&&'result must make both sides equal'];},
 'F8-17':(P)=>[P.statements.length!==4&&'a proof has four statements',P.reasons.length!==3&&'a proof has three reasons'],
 'F8-18':(P,X)=>[!X.valid(P)&&'the bracket must contain a sign change and dp must be 2 or 3']};
w.NovaF8Contracts={rules,validate(id,r,ctx){const e=[],l=r&&r.data&&r.data.lesson;if(!l)return [];
 if(l.phase!=null&&!(isInt(l.phase)&&l.phase>=0&&l.phase<=12))e.push('phase must be a whole number from 0 to 12');const m=l.motion;if(m&&!(isInt(m.from)&&isInt(m.to)&&m.from>=0&&m.to<=12&&m.from<=m.to))e.push('motion must run forwards between phases 0 and 12');
 const s=l.state||{},tab=ctx.T,key=s.preset==null?ctx.current:s.preset;if(typeof key!=='string'||key==='__lesson'||!Object.prototype.hasOwnProperty.call(tab,key)||!Object.keys(tab).includes(key))e.push('preset must be one of: '+Object.keys(tab).join(', '));
 else{const base=tab[key];for(const k of Object.keys(s))if(k!=='preset')walk(s[k],base[k],k,e);if(!e.length){const P=w.NovaF8Runtime.merge(base,s);delete P.preset;const f=rules[id];if(f){try{for(const x of f(P,ctx.X||{}))if(x)e.push(x);}catch(err){e.push('state could not be checked: '+err.message);}}}}
 return e;}};})(window);
