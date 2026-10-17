/* 390/1024/1440 resize test inside the lesson template: load at each width, then resize across every width, in the default view and in Challenge. */
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));
const dir=process.env.NOVA_FIXTURES||path.join(root,'audit/f5-production-2026-10-16/fixtures');
const ids=(process.env.NOVA_ONLY_IDS||fs.readdirSync(dir).filter(f=>/^F[45]-\d\d\.html$/.test(f)).map(f=>f.slice(0,5)).join(',')).split(',');
const shots=process.env.NOVA_SHOTS;const W=[390,1024,1440];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});let pass=0,fail=0;const rep=[];
for(const id of ids){const bp=/^F5-01/.test(id)?820:670;
 for(const w0 of W){const p=await b.newPage({viewport:{width:w0,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+path.join(dir,id+'.html'));await p.evaluate(()=>showStage('learn'));await p.waitForTimeout(1800);
  const fr=async()=>(await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame());
  const look=async()=>{const f=await fr();return f.evaluate(()=>{const st=[...document.querySelectorAll('.nova-stage')].filter(s=>s.offsetParent);const svgs=st.flatMap(s=>[...s.querySelectorAll('svg')]).filter(s=>s.getAttribute('viewBox')&&s.getBoundingClientRect().width>150);
   return {iw:innerWidth,vbw:svgs.map(s=>+s.getAttribute('viewBox').split(/[ ,]+/)[2]),over:document.documentElement.scrollWidth-innerWidth,host:document.querySelectorAll('.f012-game-host').length,hostChart:document.querySelectorAll('.f012-game-host .f012-chart-area svg').length};});};
  const chk=(tag,r,want)=>{const mob=r.iw<=bp;const ok=r.vbw.length>0&&(v=>mob?v<=420:v>420)(Math.max(...r.vbw))&&r.over<=1&&(want==null||(r.host===want.host&&r.hostChart>=Math.min(1,want.hostChart)));ok?pass++:fail++;rep.push({id,start:w0,tag,ok,...r});if(!ok)console.log(id,'FAIL',w0,tag,JSON.stringify(r));};
  let r=await look();chk('load',r);
  for(const w1 of [...W.filter(x=>x!==w0),w0]){await p.setViewportSize({width:w1,height:900});await p.waitForTimeout(700);chk('resize '+w1,await look());}
  if(w0===1440||w0===390){const f=await fr();const t=f.locator('button,[role=tab]').filter({hasText:/^\s*Challenge\s*$/i}).first();
   if(await t.count()){await t.click();await p.waitForTimeout(1200);const c=await look();chk('challenge',c);const tgt=w0===390?1440:390;await p.setViewportSize({width:tgt,height:900});await p.waitForTimeout(800);chk('challenge resize '+tgt,await look(),c);
    if(shots){await p.screenshot({path:path.join(shots,id+'-challenge-'+w0+'-to-'+tgt+'.png'),fullPage:false});}}}
  if(shots&&w0!==1024){await p.setViewportSize({width:w0,height:900});await p.waitForTimeout(700);}
  if(errs.length){fail++;console.log(id,'PAGEERROR',errs[0].slice(0,200));}
  await p.close();}
 console.log(id,rep.filter(x=>x.id===id&&x.ok).length+'/'+rep.filter(x=>x.id===id).length);}
fs.writeFileSync(process.env.NOVA_OUT||path.join(root,'audit/f5-production-2026-10-16/resize-390-1024-1440.json'),JSON.stringify({pass,fail,rep},null,1));console.log('TOTAL',pass,'pass',fail,'fail');await b.close();process.exit(fail?1:0);})();
