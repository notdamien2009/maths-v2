const {chromium}=require('/workspace/codex-fix3/work/root/integration/node_modules/playwright');
const [file,tag]=process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const w of [390,1024,1440]){const p=await b.newPage({viewport:{width:w,height:1000}});await p.goto('file://'+file);await p.evaluate(()=>showStage('learn'));await p.waitForTimeout(2500);
const f=await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame();
const r=await f.evaluate(()=>[...document.querySelectorAll('svg')].filter(s=>s.getBoundingClientRect().width>200&&s.getBoundingClientRect().height>50).map(s=>{const vb=s.viewBox.baseVal;const g=s.getBBox();const sr=s.getBoundingClientRect();return {vb:[vb.width,vb.height],contentBottom:Math.round(g.y+g.height),band:Math.round(vb.height-(g.y+g.height)),px:[Math.round(sr.width),Math.round(sr.height)]};}));
console.log(tag,w,JSON.stringify(r));
const el=await p.locator('#stageLearn iframe');await el.screenshot({path:`/workspace/codex-fix3/shots/${tag}/F4-10-still-${w}.png`});await p.close();}
await b.close();})();
