/* Regenerates the F10 component-adapters rows from the built files (register metadata + live describe()). Values are real JSON lists/objects. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');const root=path.resolve(__dirname,'../..'),src=process.env.NOVA_F10_ORIGINALS||path.resolve(root,'../src');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));
const h=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const reg=JSON.parse(fs.readFileSync(root+'/integration/component-adapters.json'));const out=[];
(async()=>{const b=await chromium.launch({executablePath:process.env.NOVA_CHROMIUM_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const row of reg.filter(r=>r.id.startsWith('F10-'))){const file=path.join(root,row.path),srcFile=path.join(src,path.basename(row.path));
 const r={...row,original_sha256:h(srcFile),previous_sha256:row.sha256,sha256:h(file)};
 const s=fs.readFileSync(file,'utf8');const m=s.match(/register\(ID,def,\{validate:.*?,models:(\{.*?\}),tables:\{(.*?)\},draws:(\{.*?\}),exploreFields:(\{.*?\})\}\);/s);if(!m)throw Error('register metadata not found in '+row.path);
 const p=await b.newPage();await p.goto('file://'+file);await p.waitForFunction(()=>window.NovaLessonComponent);
 const d=await p.evaluate(()=>{const a=NovaLessonComponent;return {engineId:a.id,steps:a.nativeSteps.map(s=>Object.keys(s).filter(k=>k!=='lesson'))};});await p.close();
 r.models=(m[1].match(/"(\w+)"/g)||[]).map(x=>x.replace(/"/g,''));r.tables=(m[2].match(/"(\w+)"/g)||[]).map(x=>x.replace(/"/g,''));
 r.draws=(0,eval)('('+m[3].replace(/:\(\)=>\w+/g,':0')+')');r.exploreFields=(0,eval)('('+m[4]+')');r.nativeFieldsByStep=d.steps;
 for(const k of ['verification','verifiedBinding'])if(typeof r[k]==='string'){try{r[k]=JSON.parse(r[k]);}catch(_){}}
 if(d.engineId!==row.id)r.engineId=d.engineId;r.f10Production={date:'2026-10-17',lessonData:'data.lesson {state, phase, motion, title}',contracts:'integration/nova-f10-contracts.js',runtime:['integration/nova-f4-runtime.js','integration/nova-f10-runtime.js']};out.push(r);}
fs.writeFileSync(path.join(__dirname,'F10-adapter-rows.json'),JSON.stringify(out,null,2));console.log(out.length,'rows');await b.close();})();
