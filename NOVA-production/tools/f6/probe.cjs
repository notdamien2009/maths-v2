const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));const {payload}=require('./f6-questions.cjs');
const rows=JSON.parse(fs.readFileSync(root+'/integration/component-adapters.json')).filter(r=>(process.env.IDS||'').split(',').includes(r.id));
const token=(text,ans)=>new RegExp('(^|[^0-9A-Za-z.])'+String(ans).replace(/[.+*?^$()[\]{}|\\]/g,'\\$&')+'($|[^0-9A-Za-z.])').test(String(text).replace(/[0-9.]+\s*%/g,' % '));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const row of rows){const p=await b.newPage({viewport:{width:1440,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
await p.goto('file://'+path.join(root,row.path));await p.waitForFunction(()=>window.NovaLessonComponent);
const qs=[0,1,2,3,4,5].map(j=>payload(row.id,j));
const out=await p.evaluate(async qs=>{const api=NovaLessonComponent;window[api.id.replace('-','_')]?.timeline?.pause();const stage=NOVA.engines[api.id].stage;const res=[];
for(const q of qs.slice(0,2)){const v=api.validate(q);await api.render({...q,concealAnswers:true},stage,false);const t=stage.innerText,aria=[...stage.querySelectorAll('[aria-label],title')].map(e=>(e.getAttribute('aria-label')||'')+' '+(e.tagName==='title'?e.textContent:'')).join(' '),data=[...stage.querySelectorAll('svg,svg *')].flatMap(e=>[...e.attributes].filter(a=>a.name.startsWith('data-')).map(a=>a.value)).join(' ');
await api.render({...q},stage,false);res.push({valid:v,hidden:t,aria,data,full:stage.innerText});}
return {res,valid:qs.map(q=>api.validate(q).valid)};},qs);
console.log('#####',row.id,'valid',out.valid.join(),'errs',errs);
out.res.forEach((r,i)=>{const a=qs[i].privateAnswer;console.log(' Q'+(i+1),'ans',a,'leak text/aria/data',token(r.hidden,a),token(r.aria,a),token(r.data,a),'expected',qs[i].expected.map(x=>r.hidden.includes(x)||r.aria.includes(x)));console.log('   HIDDEN:',r.hidden.replace(/\s+/g,' ').slice(0,500));if(token(r.aria,a))console.log('   ARIA:',r.aria.replace(/\s+/g,' ').slice(0,400));if(token(r.data,a))console.log('   DATA:',r.data.slice(0,300));console.log('   FULL:',r.full.replace(/\s+/g,' ').slice(0,250));});
await p.close();}await b.close();})();
