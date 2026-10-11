/** NOVA F3-15 reproducible stress suite; Python/Chromium via Playwright, no JS-browser installation required. */
'use strict';
const path=require('path'),fs=require('fs'),{spawnSync}=require('child_process');
const root=__dirname, tests=[
 ['math_qa.py','MATH-RESULTS.json'],
 ['browser_qa.py','BROWSER-RESULTS.json'],
 ['challenge_qa.py','CHALLENGE-RESULTS.json'],
 ['drag_qa.py','DRAG-RESULTS.json'],
 ['drag_normal_qa.py','DRAG-NORMAL-RESULTS.json']];
let failed=0; const rerun=process.argv.includes('--rerun');
for(const [script,out] of tests){
 if(rerun){const run=spawnSync('python3',[path.join(root,script)],{encoding:'utf8',timeout:180000,maxBuffer:8*1024*1024});
 if(run.status!==0){console.error('FAIL',script,(run.stderr||run.stdout||'').slice(-1400));failed++;continue;}}
 let r=JSON.parse(fs.readFileSync(path.join(root,out),'utf8'));
 const ok=script==='math_qa.py'?r.failureCount===0:script==='browser_qa.py'?r.length===8&&r.every(v=>!v.errors.length&&!v.horizontalOverflow&&v.svg===1):script==='challenge_qa.py'?r.completions===8:r.passed===r.assertions;
 console.log(ok?'PASS':'FAIL',script,script==='math_qa.py'?r.assertions:script==='browser_qa.py'?r.length:script==='challenge_qa.py'?r.completions:r.assertions,'assertions or completions');if(!ok)failed++;
}
console.log('F3-15 recorded-test verification failures:',failed,'stranded pieces reported:',failed?'review required':0);
console.log(rerun?'Fresh tests executed':'Existing test-result files verified. Use --rerun for full browser stress.');process.exit(failed?1:0);
