/* Standalone concealment probe: every QA question is validated, drawn concealed (text, aria and data checked for the answer) and at phases 0/2/4/6. */
const path=require('path');const W=process.env.NOVA_F10_WORK||path.resolve(__dirname,'..');const {chromium}=require(process.env.NOVA_PLAYWRIGHT||W+'/probe/pw');const fs=require('fs');const {payload,Q}=require(process.env.NOVA_F10_QUESTIONS||'./f10-questions.cjs');
const token1=(text,ans)=>new RegExp('(^|[^0-9A-Za-z.])'+String(ans).replace(/[.+*?^$()[\]{}|\\]/g,'\\$&')+'($|[^0-9A-Za-z.])').test(String(text).replace(/[0-9.]+\s*%/g,' % '));
const token=(text,ans)=>token1(text,ans)||token1(String(text).replace(/[−–]/g,'-'),ans);
const ids=(process.env.IDS||'').split(',').filter(Boolean);const DIR=(process.env.NOVA_ROOT||W+'/root')+'/F10';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const f of fs.readdirSync(DIR).filter(f=>/F10-\d\d/.test(f)&&!/gallery/i.test(f))){const id=f.match(/F10-\d\d/)[0];if(ids.length&&!ids.includes(id))continue;if(!Q[id]){console.log('#####',id,'no questions');continue;}
const p=await b.newPage({viewport:{width:+(process.env.WIDTH||1440),height:1000}});const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,300)));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,200));});
await p.goto('file://'+DIR+'/'+f);await p.waitForFunction(()=>window.NovaLessonComponent);
const qs=Q[id].map((_,j)=>payload(id,j));
const out=await p.evaluate(async qs=>{const api=NovaLessonComponent;NOVA.engines[api.id].timeline?.pause?.();const stage=NOVA.engines[api.id].stage;const res=[];
for(const q of qs){const v=api.validate(q);let hidden='',marks=0,err='',aria='',data='';try{await api.render({...q,concealAnswers:true},stage,false);hidden=stage.innerText;
 aria=[...stage.querySelectorAll('[aria-label],[aria-valuetext],title')].map(e=>(e.getAttribute('aria-label')||'')+' '+(e.getAttribute('aria-valuetext')||'')+' '+(e.tagName==='title'?e.textContent:'')).join(' ');
 data=[...stage.querySelectorAll('svg,svg *')].flatMap(e=>[...e.attributes].filter(a=>a.name.startsWith('data-')&&!/^nova-view-/.test(a.value)).map(a=>a.value)).join(' ');marks=stage.querySelectorAll('.is-matched,.is-focus,.is-selected').length;}catch(e){err=String(e);}
 const ph=[];for(const k of [0,2,4,6]){try{await api.render({...q,data:{lesson:{...q.data.lesson,phase:k}}},stage,false);ph.push(stage.innerText.replace(/\s+/g,' '));}catch(e){ph.push('ERR '+e);}}
 res.push({v,marks,hidden,aria,data,err,ph});}
 const bad=JSON.parse(JSON.stringify(qs[0]));const s=bad.data.lesson.state;let done=false;for(const k of Object.keys(s)){if(k==='preset')continue;if(typeof s[k]==='number'){s[k]=-999;done=true;break;}if(Array.isArray(s[k])&&typeof s[k][0]==='number'){s[k][0]=-999;done=true;break;}}
 if(!done)s.preset='%%%';
 return {res,bad:api.validate(bad)};},qs);
console.log('#####',id,'errs',errs.slice(0,3),'badRejected',!out.bad.valid,JSON.stringify(out.bad.errors).slice(0,200));
const norm=t=>t.replace(/\s+/g,' ');console.log('  distinct Q1/Q2',norm(out.res[0].hidden)!==norm(out.res[1].hidden),'rounds distinct',new Set(out.res.map(r=>norm(r.hidden))).size+'/'+out.res.length,'phases distinct(Q2)',new Set(out.res[1].ph).size);
out.res.forEach((r,i)=>{const a=qs[i].privateAnswer;const leak=qs[i].answerType==='choice'?[r.marks>0,/PROVED|Correct|matches graph/i.test(r.hidden),false]:[r.hidden,r.aria,r.data].map(t=>token(t,a));const exp=qs[i].expected.map(x=>r.hidden.includes(x)||r.aria.includes(x));
 console.log(' Q'+(i+1),'valid',r.v.valid,r.v.valid?'':JSON.stringify(r.v.errors).slice(0,300),'ans',a,'LEAK',leak.join(),'exp',exp.join(),r.err);if(leak.some(Boolean)||!exp.every(Boolean)||!r.v.valid||r.err||process.env.V)console.log('   HIDDEN:',r.hidden.replace(/\s+/g,' ').slice(0,500),'\n   ARIA:',r.aria.slice(0,300));if(process.env.V)r.ph.forEach(x=>console.log('   PH:',x.slice(0,300)));});
await p.close();}await b.close();})();
