const {chromium}=require('/usr/local/lib/pnpm/5/.pnpm/playwright@1.63.0-alpha-2026-08-31/node_modules/playwright');
const [file,out,id]=process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('file://'+file);await p.evaluate(()=>showStage('learn'));await p.waitForTimeout(2500);
const f=await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame();
await f.locator('.nova-stage svg').first().screenshot({path:`${out}/${id}-load1440.png`});
await p.setViewportSize({width:390,height:1000});await p.waitForTimeout(900);await f.locator('.nova-stage svg').first().screenshot({path:`${out}/${id}-resized390.png`});await b.close();})();
