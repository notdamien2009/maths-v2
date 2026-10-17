const {chromium}=require('/workspace/codex-fix3/work/root/integration/node_modules/playwright');const fs=require('fs');
const id=process.argv[2]||'F5-11';const file='/workspace/codex-f5/merge/NOVA-F0-F3-production/test-lessons/f5/'+id+'-challenge-test-lesson.html';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
async function look(p,tag){const f=await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame();console.log(tag,await f.evaluate(()=>({iw:innerWidth,vb:[...document.querySelectorAll('.nova-stage svg')].map(s=>s.getAttribute('viewBox')).slice(0,3)})));}
for(const [w0,w1] of [[390,390],[1440,390],[390,1440]]){const p=await b.newPage({viewport:{width:w0,height:900}});await p.goto('file://'+file);await p.evaluate(()=>showStage('learn'));await p.waitForTimeout(1500);await look(p,'start '+w0);if(w1!==w0){await p.setViewportSize({width:w1,height:900});await p.waitForTimeout(800);await look(p,'resized '+w1);}await p.close();}
await b.close();})();
