/* F17 runtime bridge (same contract as the F5 runtime) + layout-class redraw on resize: canonical-API validation hook, Challenge answer concealment, narrow F0-12 layout and accessible grouping.
   Draws nothing new: it only hides answer readouts produced by the original renderer while a Challenge question is unanswered. */
(function(w){'use strict';
const RESULT=/m-result|#4fe2a1/i;
function norm(t){return String(t??'').replace(/\s+/g,' ').trim();}
function answerForms(a){if(a==null)return null;const s=norm(a);const m=s.match(/^(-?\d+)\s*\/\s*(\d+)$/);return {text:s,frac:m?{n:m[1],d:m[2]}:null};}
function givenTokens(r){return new Set(String(r.prompt||'').match(/-?\d+(?:\.\d+)?/g)||[]);}
function mask(el){if(el.dataset)el.dataset.novaConcealed='1';else el.setAttribute('data-nova-concealed','1');el.textContent='?';}
function conceal(stage,r){if(!stage||!r||!r.concealAnswers)return 0;let n=0;
 // The scale and spinner readouts are computed answers, not their original outcome givens. Keep native stacked bars but mask both fraction cells.
 const selector={'F17-01':'.f17-readouts .f17-fraction,.f17-decimalval','F17-02':'.f172-readouts .f172-frac,.f172-readouts .val'}[w.NovaLessonComponent?.id];
 if(selector)for(const el of stage.querySelectorAll(selector)){if(el.querySelector('*')){for(const x of el.querySelectorAll('*'))if(!x.children.length&&/\d/.test(x.textContent)){x.textContent='?';x.setAttribute('data-nova-concealed','1');}}else el.textContent='?';if(el.hasAttribute('aria-label'))el.setAttribute('aria-label','unknown probability');el.removeAttribute('title');n++;}
const A=answerForms(r.privateAnswer),given=givenTokens(r);
 const nodes=[...stage.querySelectorAll('svg text, svg tspan')].filter(e=>!e.querySelector('tspan'));
 for(const t of nodes){if(t.closest('.nv-helper,.nova-helper,[class*="mascot"],[data-nova-given]'))continue;const style=(t.getAttribute('fill')||'')+(t.getAttribute('style')||'')+(t.parentNode.getAttribute?.('style')||'');const tx=norm(t.textContent);if(!tx||tx==='?'||/m-given|m-support|v-muted/.test(style))continue;
  /* Result-role colour alone is not an answer signal (F17 drawings also colour given hypotenuses and labels with the result role). */
  if(A&&tx===A.text&&!given.has(tx)){mask(t);n++;}}
 if(A&&A.frac&&!given.has(A.frac.n)){for(const g of stage.querySelectorAll('g[aria-label]')){if(norm(g.getAttribute('aria-label'))===A.frac.n+' over '+A.frac.d){g.setAttribute('aria-label','unknown fraction');g.querySelectorAll('text').forEach(mask);n++;}}}
 for(const el of stage.querySelectorAll('.answer-chip,.nv-answer,[data-answer]')){el.textContent='?';n++;}
 if(A){const re=new RegExp('(^|[^\\d.])'+A.text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&')+'(?![\\d.])','g');for(const el of stage.querySelectorAll('title,[aria-label]')){const attr=el.tagName==='title'?null:'aria-label',v=attr?el.getAttribute(attr):el.textContent;if(v&&!given.has(A.text)&&re.test(v)){const nv=v.replace(re,'$1?');attr?el.setAttribute(attr,nv):el.textContent=nv;n++;}}}
 if(A&&!given.has(A.text)){const esc=A.text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&'),re2=new RegExp('(=\\s*)'+esc+'(?![\\d.])','g'),tw=stage.ownerDocument.createTreeWalker(stage,4);let node;while(node=tw.nextNode()){if(node.parentElement&&node.parentElement.closest('svg'))continue;if(re2.test(node.nodeValue)){node.nodeValue=node.nodeValue.replace(re2,'$1?');n++;}re2.lastIndex=0;}}
 /* F17: right-triangle, trig and circle drawings print computed values ("c = 13", "sin θ = 0.60", "−0.866", "36.9°"). While a
    question is unanswered, every number token NUMERICALLY EQUIVALENT to the private answer at its own printed precision is masked in
    the stage text and in aria-label/title (a token with d decimals matches when |token − answer| ≤ ½·10^−d, and a MORE precise token matches when it equals the answer ("−1.000" for −1) or, for rounded answers, rounds to it; whole-number tokens
    match only whole-number answers; U+2212 minus is read as a sign). Numbers the prompt itself gives are never masked, and if the
    answer value is in the prompt nothing is masked. Working (givens, labels, formula) stays visible; only the answer is hidden. */
 if(A&&r.privateAnswer!=null&&isFinite(Number(r.privateAnswer))){const av=Number(r.privateAnswer);const gv=[...given].map(Number);
  if(!gv.some(g=>Math.abs(g-av)<1e-9)){const TOK=/(^|[^\w.\d])([\u2212\-]?)(\d+(?:\.\d+)?)(?![\d.]*\d)(?!\.\d)/g;
   const dA=r.tolerance?Math.max(0,Math.round(-Math.log10(2*r.tolerance))):(String(r.privateAnswer).split('.')[1]||'').length;const hitTok=(sg,num)=>{const v=(sg?-1:1)*Number(num),d=(num.split('.')[1]||'').length;if(gv.some(g=>Math.abs(g-v)<1e-9))return false;if(d>dA)return Math.abs(v-av)<1e-9||(dA>0||!!r.tolerance)&&Math.abs(v-av)<=0.5*Math.pow(10,-dA)+1e-9;if(d===0&&!Number.isInteger(av))return false;return Math.abs(v-av)<=0.5*Math.pow(10,-d)+1e-9&&(d>0||v===av);};
   const rep=s=>{let hit=0;const o=s.replace(TOK,(m,pre,sg,num)=>{if(hitTok(sg,num)){hit++;return pre+'?';}return m;});return hit?o:null;};
   const tw=stage.ownerDocument.createTreeWalker(stage,4);let node;const hit=[];while(node=tw.nextNode()){const pe=node.parentElement;if(!pe||pe.closest('.f012-game-host,script,style,.nv-helper,.nova-helper,[data-nova-given]'))continue;const st=pe.closest('text');if(st&&/m-given|m-support|v-muted/.test((st.getAttribute('style')||'')+(st.getAttribute('fill')||'')))continue;if(rep(node.nodeValue)!==null)hit.push(node);}
   for(const t of hit){t.nodeValue=rep(t.nodeValue);const pe=t.parentElement;if(pe&&pe.dataset)pe.dataset.novaConcealed='1';n++;}
   for(const el of stage.querySelectorAll('[aria-label],[title]'))for(const at of ['aria-label','title']){const v=el.getAttribute(at);if(!v)continue;const nv=rep(v);if(nv!==null){el.setAttribute(at,nv);n++;}}}}
 return n;}
function finish(stage){if(!stage)return;const log=stage.ownerDocument.getElementById('log');if(log)log.tabIndex=0;for(const e of stage.querySelectorAll('[tabindex="0"][aria-hidden="true"]'))e.removeAttribute('aria-hidden');for(const e of stage.querySelectorAll('svg path[aria-label]:not([role])')){e.setAttribute('role','button');e.setAttribute('tabindex','0');if(!e.__novaKeyboard){e.__novaKeyboard=true;e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();e.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});}}for(const e of stage.querySelectorAll('[role="button"][aria-label]')){const walker=stage.ownerDocument.createTreeWalker(e,4);let parts=[],node;while(node=walker.nextNode())if(node.textContent.trim())parts.push(node.textContent.trim());const text=parts.join(' ').replace(/\s+/g,' '),label=e.getAttribute('aria-label');if(text&&!label.toLowerCase().includes(text.toLowerCase()))e.setAttribute('aria-label',label+' ('+text+')');}if(w.innerWidth<=590)for(const t of stage.querySelectorAll('svg text')){if(t.closest('.nv-helper,.nova-helper,[aria-hidden="true"]'))continue;const sv=t.ownerSVGElement,vb=sv?.viewBox.baseVal,rect=sv?.getBoundingClientRect();if(!vb?.width||!rect?.width)continue;const scale=rect.width/vb.width,fs=parseFloat(w.getComputedStyle(t).fontSize)||+t.getAttribute('font-size')||0,target=String(t.textContent).trim().length<=14?11.2:8.5;if(scale>0&&fs*scale<target){t.setAttribute('font-size',Math.ceil(target/scale));t.style.setProperty('font-size',Math.ceil(target/scale)+'px','important');}}const d=stage.ownerDocument;if(!d.getElementById('nova-f17-mobile')){const s=d.createElement('style');s.id='nova-f17-mobile';s.textContent='@media(max-width:420px){.gw-q{grid-template-columns:minmax(0,1fr)!important;height:auto!important;padding:12px!important}.gw-q>.p{min-width:0}.gw-q>.a{justify-self:end}}';d.head.append(s);}
 for(const e of stage.querySelectorAll('[role="null"]'))e.removeAttribute('role');for(const g of stage.querySelectorAll('svg g[aria-label]:not([role])'))g.setAttribute('role','group');
 for(const svg of stage.querySelectorAll('svg'))if(svg.querySelector('[tabindex="0"],[role="button"],[role="slider"]'))svg.setAttribute('role','group');}
/* Layout-class redraw: engines choose phone/desktop layout from innerWidth when they draw. When the frame crosses a layout
   breakpoint, redraw the current state (lesson record, or current native step) so a 390px frame shows the phone layout. */
const BP=[480,500,540,600,700,720,760,820,1024];const cls=()=>BP.filter(b=>w.innerWidth<=b).join(',');let last={kind:null,cls:cls(),record:null,stage:null,id:null},timer=null;
/* F17: a record can be on screen in more than one stage at once (the lesson stage and multi-view boxes), so every connected stage
   that currently shows a record is repainted, not only the most recent one. */
const recs=new Map();
function paint(api,stage,record){const keep=[...stage.querySelectorAll('.f012-game-host,.f012-game-caption')].filter(e=>!e.parentElement.closest('.f012-game-host')).map(e=>({e,parent:e.parentElement}));keep.forEach(k=>k.e.remove());
 /* The Challenge game moves the stage drawing into its own chart area (between question and answer box); after a layout repaint the
    new drawing is moved there the same way, so the game never shows a stale desktop drawing or a second copy below it. */
 const done=()=>{for(const k of keep){if(!k.e.isConnected)(k.parent.isConnected?k.parent:stage).append(k.e);const area=k.e.querySelector('.f012-chart-area');if(area&&k.e.parentElement===stage){const vis=[...stage.childNodes].filter(n=>n!==k.e&&!keep.some(q=>q.e===n)&&!(n.nodeType===1&&n.matches('.nv-dock')));if(vis.length){area.replaceChildren(...vis);stage.prepend(k.e);}}}};Promise.resolve(api.render(record,stage,false)).then(done,done);done();}
function redraw(){const now=cls();if(now===last.cls)return;last.cls=now;const id=last.id||w.NovaLessonComponent?.id,api=w.NovaLessonComponent;if(!api)return;
 try{const nat=w.NOVA?.engines?.[id]?.stage,L={...last};let any=false;
  const list=[...recs.entries()].filter(([st])=>{if(!st.isConnected){recs.delete(st);return false;}return L.kind==='record'||st!==nat;}).sort((a,b)=>(a[0]===L.stage)-(b[0]===L.stage));
  for(const [st,rec] of list){paint(api,st,rec);any=true;}
  if(any){last={...L,cls:now};}
  if(L.kind==='record'){if(any)w.NOVA?.events?.emit('value',{engine:id,key:'layoutRedraw',value:now});return;}
  const eng=w[String(id).replace('-','_')],tl=eng&&eng.timeline,mode=last.mode;
  if(eng&&tl&&(!mode||mode==='watch'||mode==='guided')){const i=tl.i||0;if(typeof tl.go==='function')tl.go(i,'resize');}
  else if(eng&&mode&&(relayout()||replay())){}
  else if(eng&&mode&&typeof eng.setMode==='function')eng.setMode(mode);
  w.NOVA?.events?.emit('value',{engine:id,key:'layoutRedraw',value:now});}catch(e){console.warn('layout redraw',e);}}
/* State-preserving redraw for native Explore/Challenge: each stage draw function is wrapped (outermost calls only) and its most
   recent call is remembered with its live arguments. A layout redraw replays those calls in their original order, so the stage
   is repainted in the new layout from the pupil's current state; the panel (inputs, choices, progress) is never rebuilt. */
let seq=0,depth=0,calls=new Map();
function wrapDraw(name,fn){if(typeof fn!=='function'||fn.__f17wrapped)return fn;const f=function(){if(depth===0)calls.set(name,{n:++seq,fn,self:this,args:Array.from(arguments)});depth++;try{return fn.apply(this,arguments);}finally{depth--;if(depth===0&&arguments[0]?.nodeType)finish(arguments[0]);}};f.__f17wrapped=true;f.__f17name=name;return f;}
function replay(){const list=[...calls.values()].sort((a,b)=>a.n-b.n);if(!list.length)return false;try{if(w.NOVA?.ui?._drag)w.NOVA.ui.cancelDrag();}catch(e){}
 for(const c of list){depth++;try{c.fn.apply(c.self,c.args);}finally{depth--;if(c.args[0]?.nodeType)finish(c.args[0]);}}w.NOVA?.events?.emit('value',{engine:last.id,key:'statePreservedRedraw',value:list.map(c=>c.name).join(',')});return true;}
/* Engines whose Explore/Challenge keep their own live drawing handle (a closure 'box' with repaint and bound drag handles) register
   a relayout hook instead: it rebuilds that handle from the pupil's live state, so later drags and controls keep working after the resize. */
let hooks=new Map();function onRelayout(key,fn,alive){if(typeof fn==='function')hooks.set(key,{fn,alive:typeof alive==='function'?alive:()=>true});}
function relayout(){const live=[...hooks.entries()].filter(([k,h])=>{try{return h.alive();}catch(e){return false;}});if(!live.length)return false;try{if(w.NOVA?.ui?._drag)w.NOVA.ui.cancelDrag();}catch(e){}
 for(const [k,h] of live){try{h.fn();}catch(e){console.warn('relayout',e);}}
 w.NOVA?.events?.emit('value',{engine:last.id,key:'statePreservedRedraw',value:'relayout:'+live.map(x=>x[0]).join(',')});return true;}
w.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(redraw,180);});
try{const ro=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(redraw,180);});ro.observe(w.document.documentElement);}catch(e){}
/* Kept from the F13 runtime (harmless where unused): some engines update a neon tile live with textContent (e.g. a strip value after a slider move). A full render formats the
   same value with NOVA.mt.render (math italics, non-breaking units) and sets a matching aria-label, so a live update left a stale
   aria-label (screen readers heard the old value) and a different look. Re-render such tiles with the core formatter. */
function tileText(v){return String(v).replace(/-/g,'\u2011').replace(/ /g,'\u00A0\u200B');}
function syncTiles(root){const R=w.NOVA&&w.NOVA.mt&&w.NOVA.mt.render;if(!R||!root||!root.querySelectorAll)return 0;let n=0;
 for(const m of root.querySelectorAll('.nv-ntile > [role="math"]')){const raw=m.textContent;let e;try{e=R(tileText(raw));}catch(x){continue;}if(!e||e.nodeType!==1)continue;
  const al=e.getAttribute('aria-label');if(m.innerHTML!==e.innerHTML||(al!=null&&m.getAttribute('aria-label')!==al)){m.innerHTML=e.innerHTML;if(al!=null)m.setAttribute('aria-label',al);n++;}}return n;}
let syncing=false;
try{const mo=new MutationObserver(recs=>{if(syncing)return;if(!recs.some(r=>{const t=r.target.nodeType===1?r.target:r.target.parentElement;return t&&t.closest&&t.closest('.nv-ntile');}))return;syncing=true;try{const roots=new Set(recs.map(r=>{const t=r.target.nodeType===1?r.target:r.target.parentElement;return t&&t.closest('.nv-ntile');}).filter(Boolean));roots.forEach(t=>syncTiles(t.parentNode||t));}finally{syncing=false;}});
 const start=()=>mo.observe(w.document.body||w.document.documentElement,{subtree:true,childList:true,characterData:true});if(w.document.body)start();else w.addEventListener('DOMContentLoaded',start);}catch(e){}
w.NovaF17Runtime={conceal,syncTiles,finish,redraw,wrapDraw,replay,onRelayout,relayout,state:()=>({...last,draws:[...calls.keys()],recordStages:recs.size})};
const I=w.NovaV2Integration;if(!I||I.__f17)return;I.__f17=true;const reg=I.register;
I.register=function(id,def,scope){scope=scope||{};scope.exploreFields={...(scope.exploreFields||{}),...({"F17-01":{"p":{"kind":"value","factory":null,"argCount":null},"value":{"kind":"value","factory":null,"argCount":null},"showComplement":{"kind":"value","factory":null,"argCount":null}},"F17-02":{"m":{"kind":"value","factory":null,"argCount":null}},"F17-04":{"p":{"kind":"value","factory":null,"argCount":null},"m":{"kind":"value","factory":null,"argCount":null}},"F17-05":{"p":{"kind":"value","factory":null,"argCount":null},"m":{"kind":"value","factory":null,"argCount":null}},"F17-08":{"m":{"kind":"value","factory":null,"argCount":null}},"F17-09":{"m":{"kind":"value","factory":null,"argCount":null}},"F17-10":{"m":{"kind":"value","factory":null,"argCount":null}},"F17-11":{"m":{"kind":"value","factory":null,"argCount":null}}})[id]};if(!scope.validate&&w.NovaF17Contracts)scope.validate=r=>w.NovaF17Contracts.validate(id,r);const priorRestore=def.onRestore;let lessonConfig=null;def.onRestore=function(){priorRestore?.apply(this,arguments);if(lessonConfig)for(const[k,v]of Object.entries(lessonConfig))def.config[k]=I.mutable(v);};const api=reg.call(this,id,def,scope);const snapshot=()=>I.mutable(Object.fromEntries(Object.entries(def.config||{}).filter(([k])=>!k.startsWith('_'))));lessonConfig=snapshot();const configure=api.configure.bind(api);api.configure=function(v){configure(v);if(!api.active)lessonConfig=snapshot();};const render=api.render.bind(api);
 api.render=function(r,stage,animate){last={...last,kind:'record',record:r,stage:stage||w.NOVA?.engines?.[id]?.stage,id,cls:cls()};if(last.stage)recs.set(last.stage,r);const p=render(r,stage,animate);const st=stage||w.NOVA?.engines?.[id]?.stage;finish(st);conceal(st,r);const again=()=>{finish(st);conceal(st,r);};return Promise.resolve(p).then(v=>{again();return v;},e=>{throw e;});};
 w.NOVA?.events?.on('mode',e=>{if(!e.detail||e.detail.engine===id){recs.delete(w.NOVA?.engines?.[id]?.stage);last.kind='native';last.mode=e.detail&&e.detail.mode;calls.clear();last.cls=cls();last.id=id;}});w.NOVA?.events?.on('step',e=>{if(e.detail?.source!=='resize'&&(!e.detail||e.detail.engine===id)&&last.kind!=='record'){last.kind='native';last.id=id;}});
 return api;};
})(window);
