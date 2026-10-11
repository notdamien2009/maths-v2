/* Execute against a loaded F3-12 browser page with Playwright's page.evaluate().
   Checks each rule's implemented evidence against its mathematically independent criterion. */
(() => {
 const M=window.F312_MATH, R=[2,3,4,5,6,9,10];let count=0,failed=[],edges=[];
 for(let n=10;n<=9999;n++){
  const digits=String(n).split('').map(Number),last=digits.at(-1),sum=digits.reduce((s,v)=>s+v,0),last2=n%100;
  const truth={2:last%2===0,3:sum%3===0,4:last2%4===0,5:last===0||last===5,6:last%2===0&&sum%3===0,9:sum%9===0,10:last===0};
  for(const r of R){count++;const actual=M.correct(n,r),explained=M.evidence(n,r).divides;
   if(actual!==truth[r]||explained!==truth[r]){failed.push({n,r,truth:truth[r],actual,explained});if(failed.length>12)break;}}
  if(failed.length>12)break;
 }
 // No basic dividers does not establish primality. 437 is 19 × 23.
 const noSimple=[2,3,4,5,6,9,10].every(r=>!M.correct(437,r));
 if(!noSimple||19*23!==437)failed.push({edge:'437 composite screening'});
 for(const n of [12,135,234,360,437,729,9999]){
  const buckets=Object.fromEntries(R.map(r=>[r,M.correct(n,r)?'yes':'no']));
  const ok=M.full(n,buckets),incomplete=M.full(n,Object.fromEntries(Object.entries(buckets).slice(1)));
  edges.push({n,ok,incomplete});if(!ok||incomplete)failed.push({edge:'classification completeness',n});
 }
 return {mathAssertions:count,edgeCases:edges.length,failures:failed,composite437:19*23===437,allGood:failed.length===0};
})();
