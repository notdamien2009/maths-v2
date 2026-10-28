/* Challenge game at 390 px: after a 1440→390 resize the game must repaint its apparatus in the narrow layout (same viewBox as a fresh 390 load),
   with the same visible drawing(s) as a fresh 390 load and no hidden copy of the drawing left in the game or the page. */
const fs=require('fs'),path=require('path'),http=require('http');const root=path.resolve(__dirname,'../..'),out=__dirname;
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));
const PFX=process.env.NOVA_FAMILY||'F10';const fix=process.env.NOVA_FIXTURES||path.join(out,'fixtures');const fam=process.env.NOVA_FAMILY_DIR||path.join(root,PFX);
let ids=fs.readdirSync(fix).filter(f=>f.startsWith(PFX+'-')&&f.endsWith('.html')).map(f=>f.slice(0,-5)).sort();if(process.env.NOVA_ONLY_IDS)ids=ids.filter(i=>process.env.NOVA_ONLY_IDS.split(',').includes(i));
const files=fs.readdirSync(fam);const nat=id=>path.join(fam,files.find(f=>f.includes(id+'-')||f.startsWith(id)));
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');const [k,id]=q.url.slice(1).split('/');try{r.end(fs.readFileSync(k==='host'?path.join(fix,id+'.html'):nat(id)));}catch(e){r.statusCode=404;r.end();}});
const snap=fr=>fr.evaluate(()=>{const vis=e=>{if(!e.isConnected)return false;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p&&p.nodeType===1;p=p.parentElement){const c=getComputedStyle(p);if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0)return false;}return true;};
 const big=[...document.querySelectorAll('svg')].filter(s=>!s.parentElement?.closest('svg')&&s.querySelectorAll('*').length>=30);
 const game=document.querySelector('.f012-game-host'),chart=document.querySelector('.f012-chart-area')||game;
 const info=big.map(s=>({inGame:!!(chart&&chart.contains(s)),visible:vis(s),vb:s.getAttribute('viewBox'),w:Math.round(s.getBoundingClientRect().width),nodes:s.querySelectorAll('*').length,sig:[...s.querySelectorAll('text')].map(t=>t.textContent).join('|').slice(0,200)}));
 return {info,docScroll:document.documentElement.scrollWidth,docClient:document.documentElement.clientWidth};});
async function open(p,origin,id){await p.goto(origin+'/host/'+id);await p.evaluate(()=>showStage('learn'));await p.waitForFunction(()=>document.querySelector('#stageLearn iframe')?.contentWindow?.NovaNative);const fr=await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame();await fr.waitForFunction(()=>window.NovaLessonComponent&&NOVA.engines[NovaLessonComponent.id]);await fr.evaluate(()=>window[NovaLessonComponent.id.replace('-','_')].setMode('challenge'));await fr.locator('.f012-game-host').waitFor();await p.waitForTimeout(700);return fr;}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;const b=await chromium.launch({executablePath:process.env.NOVA_CHROMIUM_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});const results=[];
for(const id of ids){const res={id,checks:[],errors:[]};const check=(n,v,d)=>{res.checks.push({name:n,pass:!!v,detail:d});if(!v)console.log(id,'FAIL',n,JSON.stringify(d).slice(0,400));};
 const p=await b.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>res.errors.push(String(e).slice(0,300)));
 try{let fr=await open(p,origin,id);const wide=await snap(fr);await p.setViewportSize({width:390,height:900});await p.waitForTimeout(1200);const after=await snap(fr);
  await p.reload();fr=await open(p,origin,id);const fresh=await snap(fr);
  const gv=s=>s.info.filter(x=>x.inGame&&x.visible),gh=s=>s.info.filter(x=>x.inGame&&!x.visible),oh=s=>s.info.filter(x=>!x.inGame&&!x.visible&&gv(s).some(v=>v.sig&&v.sig===x.sig));
  res.wide=wide;res.after=after;res.fresh=fresh;
  const key=s=>JSON.stringify(gv(s).map(x=>[x.vb,x.sig]));
  check('game shows its apparatus at 390 after resize (same visible drawings as a fresh 390 load; engines with several panels such as F10-17 A/B/C or F10-19 graph + unit circle keep them all)',gv(after).length>=1&&key(after)===key(fresh),{after:gv(after).map(x=>[x.vb,x.w]),fresh:gv(fresh).map(x=>[x.vb,x.w])});
  check('no hidden copy of the drawing inside the game after resize',gh(after).length===0,gh(after));
  check('no hidden duplicate of the game drawing elsewhere on the page after resize',oh(after).length===0,oh(after));
  check('game repainted in the narrow layout (viewBoxes and drawn widths match a fresh 390 load)',gv(after).length===gv(fresh).length&&gv(after).every((x,i)=>x.vb===gv(fresh)[i].vb&&Math.abs(x.w-gv(fresh)[i].w)<=2),{after:gv(after).map(x=>[x.vb,x.w]),fresh:gv(fresh).map(x=>[x.vb,x.w]),wide:gv(wide).map(x=>[x.vb,x.w])});
  check('fresh 390 load: game drawing visible, no hidden copy',gv(fresh).length>=1&&gh(fresh).length===0&&oh(fresh).length===0,{v:gv(fresh).length,h:gh(fresh).length,o:oh(fresh).length});
  check('no horizontal overflow in the game frame at 390',after.docScroll<=after.docClient+2,{scroll:after.docScroll,client:after.docClient});
 }catch(e){res.errors.push(String(e).slice(0,300));check('ran',false,String(e).slice(0,200));}
 check('no page errors',!res.errors.length,res.errors);await p.close();results.push(res);console.log(id,res.checks.filter(c=>c.pass).length+'/'+res.checks.length);}
fs.writeFileSync(path.join(out,(PFX.toLowerCase())+'-game-390.json'),JSON.stringify(results,null,1));await b.close();server.close();})();
