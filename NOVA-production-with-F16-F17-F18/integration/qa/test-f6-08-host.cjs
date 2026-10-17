/* F6-08 (direct proportion, preset-only) hosted by F10-05: host handshake, preset parity with the F6-08 file, lesson mounting of all four presets
   (revealed view draws y = kx through the origin), and the c = 0 rule. Concealed Challenge rounds for these presets are F10-05 rounds 1-4 in test-f10-production.cjs. */
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));
const f6=process.env.NOVA_F608_FILE||path.join(root,'F6/F6-08-direct-proportion-GALLERY-PREVIEW.html');
const host=path.join(root,'F10',fs.readdirSync(path.join(root,'F10')).find(f=>/F10-05/.test(f)));
const http=require('http');const fixture=path.join(__dirname,'fixtures','F10-05.html');
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');if(q.url.startsWith('/host/'))return r.end(fs.readFileSync(fixture));if(q.url.startsWith('/native/'))return r.end(fs.readFileSync(host));r.statusCode=404;r.end();});
const s6=fs.readFileSync(f6,'utf8');const KEYS=['Y7-060','Y8-035','Y8-036','Y9-020'];
const f6Presets={};for(const k of KEYS){const m=s6.match(new RegExp("'"+k+"':Object\\.freeze\\((\\{[^}]*\\})\\)"))||s6.match(new RegExp('"'+k+'":(\\{[^}]*\\})'));f6Presets[k]=m?(0,eval)('('+m[1]+')'):null;}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;const b=await chromium.launch({executablePath:process.env.NOVA_CHROMIUM_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});const checks=[],errors=[];
const check=(n,v,d)=>{checks.push({name:n,pass:!!v,detail:d});if(!v)console.log('F6-08 FAIL',n,JSON.stringify(d||'').slice(0,300));};
const p=await b.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(String(e).slice(0,300)));
await p.goto('file://'+host);await p.waitForFunction(()=>window.NovaLessonComponent&&window.NOVA_F608_PRESET);
const r=await p.evaluate(async KEYS=>{const a=NovaLessonComponent,n=window[a.id.replace('-','_')];n.timeline.pause();NOVA.reducedMotion=()=>true;const f=window.NOVA_F608_PRESET,stage=NOVA.engines[a.id].stage;
 const out={id:f.id,kind:f.kind,parent:f.parentEngine,presets:JSON.parse(JSON.stringify(f.presets))};
 try{const h=f.prepareForHost({id:a.id});out.handshake={hostId:h.hostId,reg:h.registrationId,keys:Object.keys(h.presets),constraints:h.rendererConstraints,modes:h.requiredModes};}catch(e){out.handshake={error:String(e)};}
 try{f.prepareForHost({id:'F10-04'});out.wrongHost='accepted';}catch(e){out.wrongHost='rejected';}
 out.host=JSON.parse(JSON.stringify(n.config.presets?Object.fromEntries(KEYS.map(k=>[k,n.config.presets[k]])):{}));
 return out;},KEYS);
/* lesson mounting through the real template (same fixture and NovaNative.renderRecord path as the production test) */
await p.goto(origin+'/host/F10-05');await p.evaluate(()=>showStage('learn'));await p.waitForFunction(()=>document.querySelector('#stageLearn iframe')?.contentWindow?.NovaNative);const fr=await(await p.locator('#stageLearn iframe').elementHandle()).contentFrame();await fr.waitForFunction(()=>window.NovaLessonComponent&&NOVA.engines[NovaLessonComponent.id]);
r.mount=await fr.evaluate(async KEYS=>{const a=NovaLessonComponent,stage=NOVA.engines[a.id].stage;window[a.id.replace('-','_')].timeline.pause();const o={};for(const k of KEYS){const rec={nativeIndex:0,data:{lesson:{state:{preset:k},phase:5}}};const v=a.validate(rec);let text='',hid='',err=null;
 try{await NovaNative.renderRecord(rec,stage,false);text=stage.innerText.replace(/\s+/g,' ');await NovaNative.renderRecord({...rec,concealAnswers:true},stage,false);hid=stage.innerText.replace(/\s+/g,' ');}catch(e){err=String(e);}
 const bad=a.validate({nativeIndex:0,data:{lesson:{state:{preset:k,c:2},phase:5}}});o[k]={valid:v.valid,errors:v.errors,err,text:text.slice(0,600),hid:hid.slice(0,600),badRejected:!bad.valid,badErrors:bad.errors};}return o;},KEYS);
check('F10-05 publishes the F6-08 preset object',r.id==='F6-08'&&r.kind==='preset'&&r.parent==='F10-05',{id:r.id,kind:r.kind,parent:r.parent});
check('prepareForHost accepts F10-05 with the four presets and y = kx constraints',r.handshake.hostId==='F10-05'&&JSON.stringify(r.handshake.keys)===JSON.stringify(KEYS)&&r.handshake.constraints&&r.handshake.constraints.interceptMustEqualZero===true,r.handshake);
check('prepareForHost rejects any other host',r.wrongHost==='rejected',r.wrongHost);
const par=KEYS.map(k=>{const a=f6Presets[k],h=r.presets[k];return {k,found:!!a,same:!!a&&JSON.stringify(a)===JSON.stringify(h)};});
check('preset values match the F6-08 file exactly',par.every(x=>x.found&&x.same),par);
const hostPar=KEYS.map(k=>{const a=f6Presets[k],h=r.host[k]||{};return {k,m:h.m,slope:a&&a.slope,c:h.c,proportion:h.proportion,ok:!!a&&h.m===a.slope&&(h.c||0)===0&&!!h.proportion};});
check('F10-05 native presets carry the F6-08 gradient with c = 0 and proportion on',hostPar.every(x=>x.ok),hostPar);
const fmtK=x=>String(x).replace(/^0\./,'0.');
for(const k of KEYS){const m=r.mount[k],kk=f6Presets[k].slope;check(k+': lesson state validates and mounts in F10-05 through the template',m.valid&&!m.err&&m.text.length>0,{errors:m.errors,err:m.err});
 const ruleRe=new RegExp('y = '+String(kk).replace('.','\\.')+'x(?![0-9.])');check(k+': revealed view draws y = '+kk+'x through the origin (no intercept term)',ruleRe.test(m.text)&&!/y = [^ ]+x [+−-] /.test(m.text.match(ruleRe)?m.text.slice(m.text.search(ruleRe),m.text.search(ruleRe)+14):''),m.text.slice(0,400));
 check(k+': concealed view hides k',!ruleRe.test(m.hid)&&/y = kx/.test(m.hid),m.hid.slice(0,400));
 check(k+': c ≠ 0 is rejected for a direct-proportion preset',m.badRejected,m.badErrors);}
check('no page errors',!errors.length,errors);
const res={id:'F6-08',host:'F10-05',hostFile:path.relative(root,host),f6File:path.basename(f6),checks,errors,mountText:Object.fromEntries(KEYS.map(k=>[k,{revealed:r.mount[k].text.slice(0,300),concealed:r.mount[k].hid.slice(0,300)}]))};
fs.writeFileSync(path.join(__dirname,'f6-08-host.json'),JSON.stringify(res,null,1));console.log('F6-08 host',checks.filter(c=>c.pass).length+'/'+checks.length);await b.close();server.close();})();
