/* F9 sequences domain checks for lesson records: finite numbers everywhere, and for the lessonScene draw of each engine the
   native value ranges (positions, coefficients, ratios, iterations) so a lesson cannot draw an off-board or undefined pattern. */
(function(w){'use strict';const I=Number.isInteger,between=(v,a,b)=>I(v)&&v>=a&&v<=b;
function walk(v,path,errors){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',errors));return;}
 for(const k of Object.keys(v)){const x=v[k];if(typeof x==='number'&&!Number.isFinite(x))errors.push(path+'.'+k+' must be finite');if(x&&typeof x==='object')walk(x,path+'.'+k,errors);}}
const S={
 'F9-01':p=>between(p.stage,1,5)&&between(p.ask,6,40)||'F9-01 needs stage 1–5 drawn and ask 6–40',
 'F9-02':p=>(p.type==='arith'?between(p.a1,-50,99)&&between(p.step,-20,20)&&p.step!==0:p.type==='geom'&&between(p.a1,1,20)&&between(p.ratio,2,5))&&between(p.visible,3,4)||'F9-02 needs arith (a1, step ≠ 0) or geom (a1 1–20, ratio 2–5) and 3–4 visible terms',
 'F9-03':p=>between(p.a,1,9)&&between(p.b,-9,20)&&between(p.ask,6,50)||'F9-03 needs a 1–9, b −9..20, ask position 6–50',
 'F9-04':p=>(p.kind==='linear'?between(p.a,-5,5)&&p.a!==0&&between(p.b,-10,30):p.kind==='quadratic'&&between(p.a,1,3)&&between(p.b,-5,5)&&between(p.c,-5,10))&&between(p.visible,3,4)||'F9-04 needs linear a ≠ 0 / quadratic a 1–3 and 3–4 plotted terms',
 'F9-05':p=>between(p.a,-9,9)&&p.a!==0&&between(p.c,-20,30)||'F9-05 needs a −9..9 (≠ 0) and c −20..30',
 'F9-06':p=>between(p.a,1,100)&&[2,3,4,0.5].includes(p.r)&&between(p.shown,2,4)&&(p.r>=1||(p.a*Math.pow(.5,p.shown)%1===0))||'F9-06 needs a 1–100, r 2, 3, 4 or ½ (whole terms) and 2–4 shown bars',
 'F9-07':p=>['square','triangle','cube','fibonacci'].includes(p.kind)&&between(p.n,p.kind==='fibonacci'?2:1,4)&&between(p.ask,5,6)||'F9-07 needs kind square/triangle/cube/fibonacci, stage n ≤ 4 and ask 5–6',
 'F9-08':p=>between(p.n,2,6)&&between(p.ask,5,20)&&p.ask>p.n||'F9-08 needs stage n 2–6 and ask 5–20 beyond it',
 'F9-09':p=>between(p.a,1,3)&&between(p.b,-6,6)&&between(p.c,-6,10)||'F9-09 needs a 1–3, b −6..6, c −6..10',
 'F9-10':p=>(p.ask==='centre'&&[2,4,6].includes(p.rows-1))||(p.ask==='nextSum'&&between(p.rows,3,6))||'F9-10 needs ask centre (rows 3, 5, 7) or nextSum (rows 3–6)',
 'F9-11':p=>p.kind==='add'&&between(p.first,-20,120)&&between(Math.abs(p.k),6,15)||'F9-11 needs an add rule with |k| 6–15',
 'F9-12':p=>(p.operation==='add'?between(p.first,-50,99)&&between(p.step,-20,20)&&p.step!==0:p.operation==='multiply'&&between(p.first,1,20)&&between(p.factor,2,5))||'F9-12 needs add (step ≠ 0) or multiply (factor 2–5)',
 'F9-13':p=>['sierpinski','koch'].includes(p.kind)&&between(p.n,0,2)&&between(p.ask,2,4)&&p.ask>p.n||'F9-13 needs kind sierpinski/koch, drawn iteration 0–2 and ask 2–4 beyond it'};
w.NovaF9Contracts={validate(id,r){const e=[];if(!r||typeof r!=='object')return e;const sc=r.scene||{};
 if(sc.function==='lessonScene'&&S[id]){const p=(sc.arguments||{}).p;if(!p||typeof p!=='object')e.push(id+' lessonScene needs p');else{const ok=S[id](p);if(ok!==true)e.push(ok);}}
 for(const k of ['data','nativeData','config'])if(r[k])walk(r[k],k,e);if(sc.arguments)walk(sc.arguments,'scene',e);if(r.explore)walk(r.explore.value,'explore',e);return e;}};})(window);
