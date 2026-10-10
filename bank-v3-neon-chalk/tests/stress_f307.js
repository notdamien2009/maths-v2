/* F3-07 deterministic arithmetic + Venn assignment stress (run in the engine's browser window). */
window.F307_STRESS=function(){
 const M=window.F307_MATH;let assertions=0,failures=[],pairs=0;
 function check(ok,msg){assertions++;if(!ok)failures.push(msg);}
 for(let a=2;a<=120;a++)for(let b=2;b<=120;b++){
   const r=M.results(a,b),map=M.correctMap(a,b),parts=M.tokens(a,b);
   check(r.hcf===M.gcd(a,b),`${a},${b} HCF`);
   check(r.lcm===a*b/M.gcd(a,b),`${a},${b} LCM`);
   check(M.checkMap(a,b,map),`${a},${b} placement`);
   check(parts.length===r.all.length,`${a},${b} nonduplicated Venn union`);
   if(parts.length){const tampered={...map};delete tampered[parts[0].id];check(!M.checkMap(a,b,tampered),`${a},${b} missing prime rejected`);}
   pairs++;
 }
 return {pairs,assertions,failed:failures.length,failures:failures.slice(0,20)};
};
