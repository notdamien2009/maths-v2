/* Regenerates the F6 component-adapters rows from the built files (register metadata + live describe()). */
const fs=require('fs'),path=require('path'),crypto=require('crypto');const root=path.resolve(__dirname,'../..');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));
const h=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const reg=JSON.parse(fs.readFileSync(root+'/integration/component-adapters.json'));const out=[];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const row of reg.filter(r=>r.id.startsWith('F6-'))){const file=path.join(root,row.path),srcFile=path.join('/workspace/codex-f6/src',path.basename(row.path));
 const r={...row,original_sha256:h(srcFile),previous_sha256:row.sha256,sha256:h(file)};
 if(['F6-08','F6-12','F6-13'].includes(row.id)){r.presetOnly=true;r.hostEngine={'F6-08':'F10-05','F6-12':'F18-02','F6-13':'F14-11'}[row.id];r.status='config-only preset; host engine not yet built';r.previous_sha256=row.sha256;r.sha256=h(srcFile);out.push(r);continue;}
 const s=fs.readFileSync(file,'utf8');const m=s.match(/register\(ID,DEF,\{validate:.*?,models:(\{.*?\}),tables:\{(.*?)\},draws:(\{.*?\}),exploreFields:(\{.*?\})\}\);/s);
 const p=await b.newPage();await p.goto('file://'+file);await p.waitForFunction(()=>window.NovaLessonComponent);
 const d=await p.evaluate(()=>{const a=NovaLessonComponent;return {steps:a.nativeSteps.map(s=>Object.keys(s).filter(k=>k!=='lesson'))};});await p.close();
 r.tables=String(JSON.stringify((m[2].match(/"(\w+)"/g)||[]).map(x=>x.replace(/"/g,'')))).replace(/"/g,"'");r.draws=m[3];r.exploreFields=m[4];r.nativeFieldsByStep=JSON.stringify(d.steps).replace(/"/g,"'");
 r.f6Production={date:'2026-10-17',lessonData:'data.lesson {state, phase, motion, title}',contracts:'integration/nova-f6-contracts.js',runtime:['integration/nova-f4-runtime.js','integration/nova-f6-runtime.js']};out.push(r);}
fs.writeFileSync(path.join(__dirname,'F6-adapter-rows.json'),JSON.stringify(out,null,2));console.log(out.length,'rows');await b.close();})();
