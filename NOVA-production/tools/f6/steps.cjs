const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));const {payload}=require('./f6-questions.cjs');
const rows=JSON.parse(fs.readFileSync(root+'/integration/component-adapters.json')).filter(r=>(process.env.IDS||'').split(',').includes(r.id));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const row of rows){const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('file://'+path.join(root,row.path));await p.waitForFunction(()=>window.NovaLessonComponent);
const q=payload(row.id,0);const out=await p.evaluate(async q=>{const api=NovaLessonComponent;window[api.id.replace('-','_')]?.timeline?.pause();const stage=NOVA.engines[api.id].stage;const res=[];
for(let k=0;k<8;k++){await api.render({...q,data:{lesson:{...q.data.lesson,phase:k}}},stage,false);res.push(stage.innerText.replace(/\s+/g,' '));}return res;},q);
console.log('#####',row.id,'answer',q.privateAnswer);out.forEach((t,k)=>console.log(' step',k,':',t.slice(0,420)));await p.close();}await b.close();})();
