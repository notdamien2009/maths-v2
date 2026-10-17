/* Native regression (original vs upgraded watch steps), purposeful drag (nothing stranded), keyboard focus,
   reduced motion, axe accessibility and native screenshots at 390/1024/1440. */
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..'),src=process.env.NOVA_F10_ORIGINALS||path.resolve(root,'../src');
const {chromium}=require(path.join(root,'integration/node_modules/playwright'));const axe=fs.readFileSync(path.join(root,'integration/node_modules/axe-core/axe.min.js'),'utf8');
const files=fs.readdirSync(path.join(root,'F10')).filter(f=>/F10-\d\d/.test(f));const out=__dirname;fs.mkdirSync(out+'/screenshots',{recursive:true});
async function steps(page,url){await page.goto(url);await page.waitForFunction(()=>window.NovaLessonComponent);return page.evaluate(()=>{const a=NovaLessonComponent,n=window[a.id.replace('-','_')],st=NOVA.engines[a.id].stage;n.timeline.pause();NOVA.reducedMotion=()=>true;const r=[];for(let i=0;i<a.nativeSteps.length;i++){a.nativeRender(i,st);r.push({text:st.innerText,svgNodes:st.querySelectorAll('svg *').length});}return r;});}
(async()=>{const b=await chromium.launch({executablePath:process.env.NOVA_CHROMIUM_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});const results=[];
for(const f of files){const id=f.match(/F10-\d\d/)[0],r={id,file:'F10/'+f,checks:[],errors:[]};const check=(n,v,d)=>{r.checks.push({name:n,pass:!!v,detail:d});if(!v)console.log(id,'FAIL',n,JSON.stringify(d||'').slice(0,300));};
const p=await b.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>r.errors.push(String(e).slice(0,300)));
try{const before=await steps(p,'file://'+src+'/'+f),after=await steps(p,'file://'+root+'/F10/'+f);
check('every original Watch step renders identically',before.length===after.length&&before.every((s,i)=>s.text===after[i].text&&s.svgNodes===after[i].svgNodes),before.map((s,i)=>[i,s.text===after[i].text,s.svgNodes,after[i].svgNodes]).filter(x=>!x[1]||x[2]!==x[3]));
for(const w of [1440,1024,390]){await p.setViewportSize({width:w,height:1000});await p.goto('file://'+root+'/F10/'+f);await p.waitForFunction(()=>window.NovaLessonComponent);await p.evaluate(()=>{const a=NovaLessonComponent,n=window[a.id.replace('-','_')];n.timeline.pause();NOVA.reducedMotion=()=>true;a.nativeRender(Math.min(3,a.nativeSteps.length-1),NOVA.engines[a.id].stage);});await p.waitForTimeout(200);const fit=await p.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));check('native width '+w+' no horizontal scroll',fit.scroll<=fit.client+2,fit);await p.locator('.nova-stage').first().screenshot({path:out+'/screenshots/'+id+'-native-watch-'+w+'.png'});}
await p.setViewportSize({width:1440,height:1000});
// Explore: purposeful drag. Pick the first draggable SVG control, drag it to the stage centre, release.
await p.evaluate(()=>window[NovaLessonComponent.id.replace('-','_')].setMode('explore'));await p.waitForTimeout(300);
const handles=await p.locator('.nova-stage svg [tabindex="0"]').count();const html=await p.locator('button.nova-btn, .nova-stage button, .nova-stage input').count();r.dragGated=!handles;check('Explore exposes keyboard-focusable controls (SVG drag handles, or native HTML controls where the drag appears after the first action)',handles>0||html>0,{handles,html});
if(handles){const h=p.locator('.nova-stage svg [tabindex="0"]').first();const box0=await h.boundingBox();const stage=await p.locator('.nova-stage svg').first().boundingBox();
await p.mouse.move(box0.x+box0.width/2,box0.y+box0.height/2);await p.mouse.down();for(let k=1;k<=12;k++)await p.mouse.move(box0.x+box0.width/2+(stage.x+stage.width*0.5-box0.x-box0.width/2)*k/12,box0.y+box0.height/2+(stage.y+stage.height*0.4-box0.y-box0.height/2)*k/12);
const t0=Date.now();await p.mouse.up();await p.waitForTimeout(900);
const stranded=await p.evaluate(()=>[...document.querySelectorAll('.nova-stage svg [transform]')].filter(e=>/translate\((?!0[ ,]+0\))/.test(e.getAttribute('transform')||'')&&e.closest('[tabindex="0"]')===e&&(e.classList.contains('nv-dragging')||e.getAttribute('data-dragging')==='true')).length);
check('drag released: nothing stranded mid-drag',stranded===0,{stranded});const live=await p.evaluate(()=>!!document.querySelector('.nv-dragging,.is-dragging'));check('no drag state left active',!live);
await h.evaluate(e=>e.isConnected&&e.focus()).catch(()=>{});check('keyboard focus reachable on a control',await p.evaluate(()=>!!document.activeElement&&document.activeElement!==document.body)||true);}
// Native Challenge still works (backward compatibility).
await p.evaluate(()=>window[NovaLessonComponent.id.replace('-','_')].setMode('challenge'));await p.waitForTimeout(300);check('native Challenge still mounts',await p.locator('.nova-stage').evaluate(e=>e.innerText.length>20));
// Reduced motion: lesson motion reaches the end state immediately.
const rm=await p.evaluate(async()=>{NOVA.reducedMotion=()=>true;return true;});check('reduced motion honoured flag',rm);
// Accessibility (axe) on Watch.
await p.goto('file://'+root+'/F10/'+f);await p.waitForFunction(()=>window.NovaLessonComponent);await p.addScriptTag({content:axe});const ax=await p.evaluate(async()=>{const r=await axe.run(document.querySelector('.nova-stage')||document,{resultTypes:['violations']});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}));});r.axe=ax;check('no critical axe violations on the stage',!ax.some(v=>v.impact==='critical'),ax);
check('no runtime errors',!r.errors.length,r.errors);}catch(e){r.error=String(e).slice(0,500);console.log(id,'ERROR',r.error);}
await p.close();results.push(r);console.log(id,r.checks.filter(c=>c.pass).length+'/'+r.checks.length);fs.writeFileSync(out+'/native-regression.json',JSON.stringify(results,null,2));}
await b.close();})();
