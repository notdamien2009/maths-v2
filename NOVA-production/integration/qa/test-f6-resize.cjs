/* 390/1024/1440 resize test inside the lesson template: the layout after resizing to a width must equal a fresh load at that width
   (main SVG viewBox), with no horizontal overflow, in the default view and in Challenge (F0-12 host kept). */
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));
const dir=path.join(__dirname,'fixtures');const ids=(process.env.NOVA_ONLY_IDS||fs.readdirSync(dir).filter(f=>/^F6-\d\d\.html$/.test(f)).map(f=>f.slice(0,5)).join(',')).split(',');
const W=[390,1024,1440];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});let pass=0,fail=0;const rep=[];
const open=async(id,w,challenge)=>{const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto('file://'+path.join(dir,id+'.html'));await p.evaluate(()=>showStage('learn'));await p.waitForTimeout(1500);
 const fr=await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame();if(challenge){await fr.evaluate(()=>window[NovaLessonComponent.id.replace('-','_')].setMode('challenge'));await fr.locator('.f012-game-host').waitFor();await p.waitForTimeout(500);}return {p,fr,errs};};
const look=fr=>fr.evaluate(()=>{const svgs=[...document.querySelectorAll('.nova-stage svg')].filter(s=>s.getAttribute('viewBox')&&s.getBoundingClientRect().width>150).map(s=>s.getAttribute('viewBox'));return {iw:innerWidth,vb:svgs.sort((a,b)=>b.split(' ')[2]-a.split(' ')[2])[0]||'',over:document.documentElement.scrollWidth-innerWidth,host:document.querySelectorAll('.f012-game-host .f012-chart-area svg').length};});
for(const id of ids){for(const challenge of [false,true]){const fresh={};for(const w of W){const o=await open(id,w,challenge);fresh[w]=await look(o.fr);await o.p.close();}
 for(const w0 of W){const o=await open(id,w0,challenge);for(const w1 of W.filter(x=>x!==w0)){await o.p.setViewportSize({width:w1,height:900});await o.p.waitForTimeout(700);const r=await look(o.fr);const ok=r.vb===fresh[w1].vb&&r.over<=1&&(!challenge||r.host>0);ok?pass++:fail++;rep.push({id,challenge,from:w0,to:w1,ok,got:r,fresh:fresh[w1]});if(!ok)console.log(id,'FAIL',challenge?'challenge':'learn',w0,'->',w1,JSON.stringify(r),'fresh',fresh[w1].vb);}
  if(o.errs.length){fail++;console.log(id,'PAGEERROR',o.errs[0].slice(0,200));}await o.p.close();}}
 const mine=rep.filter(x=>x.id===id);console.log(id,mine.filter(x=>x.ok).length+'/'+mine.length);}
fs.writeFileSync(path.join(__dirname,'resize-390-1024-1440.json'),JSON.stringify({pass,fail,rep},null,1));console.log('TOTAL',pass,'pass',fail,'fail');await b.close();})();
