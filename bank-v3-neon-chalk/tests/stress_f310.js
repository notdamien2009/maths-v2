'use strict';
// Independent data-first mathematical stress suite. Browser integration is tested separately.
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
let tested=0, failures=[];
function check(ok,context){tested++;if(!ok)failures.push(context);}
for(const b of [2,3,4,5])for(let m=1;m<=5;m++)for(let n=1;n<=5;n++){
 if(m+n<=8){check(b**m*b**n===b**(m+n),`product ${b},${m},${n}`);check(m+n===Array(m+n).fill(b).length,`product count ${b},${m},${n}`);}
 if(m>n){check(b**m/b**n===b**(m-n),`quotient ${b},${m},${n}`);check(m-n===Array(m).fill(b).slice(n).length,`quotient count ${b},${m},${n}`);}
 if(m*n<=8){check((b**m)**n===b**(m*n),`power ${b},${m},${n}`);check(Array(n).fill(0).flatMap(()=>Array(m).fill(b)).length===m*n,`power count ${b},${m},${n}`);}
}
for(const b of [8,27,64,125,216,343])for(const m of [1,2,3]){let rt=Math.round(Math.cbrt(b));check(rt**3===b,`cube root ${b}`);check(rt**m===Math.round(Math.cbrt(b))**m,`fraction ${b},${m}`);}
check(2+2===2*2,'coincidental arithmetic equality must not be flagged as misconception');
const output={checks:tested,failures,failed:failures.length};fs.writeFileSync(path.join(__dirname,'STRESS-NODE-RESULTS.json'),JSON.stringify(output,null,2));
console.log(JSON.stringify(output));assert.equal(failures.length,0);
