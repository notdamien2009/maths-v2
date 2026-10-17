const {chromium}=require(process.env.NOVA_PLAYWRIGHT||'playwright');const fs=require('fs');const {payload}=require('./f8-questions.cjs');
const token=(text,ans)=>new RegExp('(^|[^0-9A-Za-z.])'+String(ans).replace(/[.+*?^$()[\]{}|\\]/g,'\\$&')+'($|[^0-9A-Za-z.])').test(String(text).replace(/[0-9.]+\s*%/g,' % '));
const ids=(process.env.IDS||'').split(',').filter(Boolean);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const f of fs.readdirSync((process.env.NOVA_ROOT||process.cwd())+'/F8').filter(f=>/^F8-\d\d/.test(f))){const id=f.slice(0,5);if(ids.length&&!ids.includes(id))continue;
const p=await b.newPage({viewport:{width:1440,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,300)));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,200));});
await p.goto('file://'+(process.env.NOVA_ROOT||process.cwd())+'/F8/'+f);await p.waitForFunction(()=>window.NovaLessonComponent);
const qs=[0,1,2,3,4,5].map(j=>payload(id,j));
const out=await p.evaluate(async qs=>{const api=NovaLessonComponent;NOVA.engines[api.id].timeline?.pause?.();const stage=NOVA.engines[api.id].stage;const res=[];
for(const q of qs){const v=api.validate(q);let hidden='',err='';try{await api.render({...q,concealAnswers:true},stage,false);hidden=stage.innerText;}catch(e){err=String(e);}
 const aria=[...stage.querySelectorAll('[aria-label],title')].map(e=>(e.getAttribute('aria-label')||'')+' '+(e.tagName==='title'?e.textContent:'')).join(' ');
 const ph=[];for(const k of [0,2,4,6]){try{await api.render({...q,data:{lesson:{...q.data.lesson,phase:k}}},stage,false);ph.push(stage.innerText.replace(/\s+/g,' ').slice(0,160));}catch(e){ph.push('ERR '+e);}}
 res.push({v,hidden,aria,err,ph});}
 const bad=JSON.parse(JSON.stringify(qs[0]));const s=bad.data.lesson.state;let done=false;for(const k of Object.keys(s)){if(k==='preset')continue;if(typeof s[k]==='number'){s[k]=-999;done=true;break;}if(Array.isArray(s[k])&&typeof s[k][0]==='number'){s[k][0]=-999;done=true;break;}}
 if(!done){for(const k of Object.keys(s)){if(typeof s[k]==='string'){s[k]='%%%';done=true;break;}if(Array.isArray(s[k])&&typeof s[k][0]==='string'){s[k][0]='%%%';done=true;break;}}}
 return {res,bad:api.validate(bad)};},qs);
console.log('#####',id,'errs',errs.slice(0,3),'badRejected',!out.bad.valid,JSON.stringify(out.bad).slice(0,300));
out.res.forEach((r,i)=>{const a=qs[i].privateAnswer;const leak=token(r.hidden,a)||token(r.aria,a);const exp=qs[i].expected.map(x=>r.hidden.includes(x)||r.aria.includes(x));
 console.log(' Q'+(i+1),'valid',r.v.valid,r.v.valid?'':JSON.stringify(r.v).slice(0,300),'ans',a,'LEAK',leak,'exp',exp.join(),r.err);if(leak||!exp.every(Boolean)||!r.v.valid||r.err||process.env.V)console.log('   HIDDEN:',r.hidden.replace(/\s+/g,' ').slice(0,420));if(process.env.V)r.ph.forEach(x=>console.log('   PH:',x));});
await p.close();}await b.close();})();
