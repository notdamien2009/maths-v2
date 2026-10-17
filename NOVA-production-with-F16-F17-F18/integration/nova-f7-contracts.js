/* F7 algebra domain checks for lesson records: finite numbers, integer coefficients/tile counts in the native ranges. */
(function(w){'use strict';const isInt=Number.isInteger;
const COEF=/^(a|b|c|d|k|n|xConst|yConst|factor|constant|x2|x|one|count|demo|power)$/;
function walk(v,path,errors){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',errors));return;}
 for(const k of Object.keys(v)){const x=v[k];if(typeof x==='number'){if(!Number.isFinite(x))errors.push(path+'.'+k+' must be finite');else if(COEF.test(k)&&(!isInt(x)||Math.abs(x)>144))errors.push(path+'.'+k+' must be an integer −144..144');}
  if(k==='type'&&typeof x==='string'&&!['x2','x','one'].includes(x))errors.push(path+'.type must be x2, x or one');
  if(k==='sign'&&x!==1&&x!==-1)errors.push(path+'.sign must be 1 or −1');
  if(x&&typeof x==='object')walk(x,path+'.'+k,errors);}}
w.NovaF7Contracts={validate(id,r){const e=[];if(!r||typeof r!=='object')return e;const A=r.scene&&r.scene.arguments||{},P=A.p||{};
 if(id==='F7-06'&&A.p){const ok=[P.k,P.a,P.b].every(v=>Number.isInteger(v)&&v>0)&&P.k<=4&&P.a<=3&&P.b<=4&&P.k*(P.a+P.b)<=18;if(!ok)e.push('F7-06 needs whole k≤4, a≤3, b≤4 and k(a+b)≤18 tiles');}
 if(id==='F7-07'&&A.p){if(!Number.isInteger(P.n)||!Number.isInteger(P.c)||P.n<2||P.n>4||P.c<0||P.c>P.n*P.n)e.push('F7-07 needs n 2–4 and 0≤c≤n²');}
 if(id==='F7-13'&&A.p){if(!Number.isInteger(+P.b)||P.b<1||P.b>5||!(+P.demo>+P.b+1))e.push('F7-13 needs b 1–5 and demo > b+1');}
for(const k of ['data','nativeData','config'])if(r[k])walk(r[k],k,e);if(r.scene&&r.scene.arguments)walk(r.scene.arguments,'scene',e);if(r.explore)walk(r.explore.value,'explore',e);return e;}};})(window);
