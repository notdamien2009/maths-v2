/* F13 runtime bridge (same contract as the F5 runtime) + layout-class redraw on resize: canonical-API validation hook, Challenge answer concealment, narrow F0-12 layout and accessible grouping.
   Draws nothing new: it only hides answer readouts produced by the original renderer while a Challenge question is unanswered. */
(function(w){'use strict';
const RESULT=/m-result|#4fe2a1/i;
function norm(t){return String(t??'').replace(/\s+/g,' ').trim();}
function answerForms(a){if(a==null)return null;const s=norm(a);const m=s.match(/^(-?\d+)\s*\/\s*(\d+)$/);return {text:s,frac:m?{n:m[1],d:m[2]}:null};}
function givenTokens(r){return new Set(String(r.prompt||'').match(/-?\d+(?:\.\d+)?/g)||[]);}
function mask(el){if(el.dataset)el.dataset.novaConcealed='1';else el.setAttribute('data-nova-concealed','1');el.textContent='?';}
function conceal(stage,r){if(!stage||!r||!r.concealAnswers)return 0;let n=0;const A=answerForms(r.privateAnswer),given=givenTokens(r);
 const nodes=[...stage.querySelectorAll('svg text, svg tspan')].filter(e=>!e.querySelector('tspan'));
 for(const t of nodes){if(t.closest('.nv-helper,.nova-helper,[class*="mascot"]'))continue;const style=(t.getAttribute('fill')||'')+(t.getAttribute('style')||'')+(t.parentNode.getAttribute?.('style')||'');const tx=norm(t.textContent);if(!tx||tx==='?')continue;
  /* F13: green is the positive-tile colour, so result-role colour alone is not an answer signal. */
  if(A&&tx===A.text&&!given.has(tx)){mask(t);n++;}}
 if(A&&A.frac&&!given.has(A.frac.n)){for(const g of stage.querySelectorAll('g[aria-label]')){if(norm(g.getAttribute('aria-label'))===A.frac.n+' over '+A.frac.d){g.setAttribute('aria-label','unknown fraction');g.querySelectorAll('text').forEach(mask);n++;}}}
 for(const el of stage.querySelectorAll('.answer-chip,.nv-answer,[data-answer]')){el.textContent='?';n++;}
 if(A){const re=new RegExp('(^|[^\\d.])'+A.text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&')+'(?![\\d.])','g');for(const el of stage.querySelectorAll('title,[aria-label]')){const attr=el.tagName==='title'?null:'aria-label',v=attr?el.getAttribute(attr):el.textContent;if(v&&!given.has(A.text)&&re.test(v)){const nv=v.replace(re,'$1?');attr?el.setAttribute(attr,nv):el.textContent=nv;n++;}}}
 if(A&&!given.has(A.text)){const esc=A.text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&'),re2=new RegExp('(=\\s*)'+esc+'(?![\\d.])','g'),tw=stage.ownerDocument.createTreeWalker(stage,4);let node;while(node=tw.nextNode()){if(node.parentElement&&node.parentElement.closest('svg'))continue;if(re2.test(node.nodeValue)){node.nodeValue=node.nodeValue.replace(re2,'$1?');n++;}re2.lastIndex=0;}}
 /* F13: solid-measure drawings print their computed results inside readout text ("24 units³", "VOLUME 30"). While a question is
    unanswered every whole-number token equal to the private answer is masked in the stage (SVG and HTML text), unless the prompt
    itself gives that number. The working (dimensions, formula) stays visible; only the answer value is hidden. */
 if(A&&!given.has(A.text)){const esc=A.text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&'),re3=new RegExp('(^|[^\\d.])'+esc+'(?![\\d.])','g'),tw=stage.ownerDocument.createTreeWalker(stage,4);let node;const hit=[];while(node=tw.nextNode()){const pe=node.parentElement;if(!pe||pe.closest('.f012-game-host,script,style'))continue;re3.lastIndex=0;if(re3.test(node.nodeValue))hit.push(node);}
  for(const t of hit){re3.lastIndex=0;t.nodeValue=t.nodeValue.replace(re3,'$1?');const pe=t.parentElement;if(pe&&pe.dataset)pe.dataset.novaConcealed='1';n++;}}
 return n;}
function finish(stage){if(!stage)return;const d=stage.ownerDocument;if(!d.getElementById('nova-f13-mobile')){const s=d.createElement('style');s.id='nova-f13-mobile';s.textContent='@media(max-width:420px){.gw-q{grid-template-columns:minmax(0,1fr)!important;height:auto!important;padding:12px!important}.gw-q>.p{min-width:0}.gw-q>.a{justify-self:end}}';d.head.append(s);}
 for(const e of stage.querySelectorAll('[role="null"]'))e.removeAttribute('role');for(const g of stage.querySelectorAll('svg g[aria-label]:not([role])'))g.setAttribute('role','group');
 for(const svg of stage.querySelectorAll('svg'))if(svg.querySelector('[tabindex="0"],[role="button"],[role="slider"]'))svg.setAttribute('role','group');}
/* Layout-class redraw: engines choose phone/desktop layout from innerWidth when they draw. When the frame crosses a layout
   breakpoint, redraw the current state (lesson record, or current native step) so a 390px frame shows the phone layout. */
const BP=[480,580,600,700,720,760,820,1024];const cls=()=>BP.filter(b=>w.innerWidth<=b).join(',');let last={kind:null,cls:cls(),record:null,stage:null,id:null},timer=null;
function redraw(){const now=cls();if(now===last.cls)return;last.cls=now;const id=last.id||w.NovaLessonComponent?.id,api=w.NovaLessonComponent;if(!api)return;
 try{if(last.kind==='record'&&last.record&&last.stage&&last.stage.isConnected){const keep=[...last.stage.querySelectorAll('.f012-game-host,.f012-game-caption')].filter(e=>!e.parentElement.closest('.f012-game-host')).map(e=>({e,parent:e.parentElement}));keep.forEach(k=>k.e.remove());const done=()=>{for(const k of keep)if(!k.e.isConnected)(k.parent.isConnected?k.parent:last.stage).append(k.e);};Promise.resolve(api.render(last.record,last.stage,false)).then(done,done);done();w.NOVA?.events?.emit('value',{engine:id,key:'layoutRedraw',value:now});return;}
  const eng=w[String(id).replace('-','_')],tl=eng&&eng.timeline,mode=last.mode;
  if(eng&&tl&&(!mode||mode==='watch'||mode==='guided')){const i=tl.i||0;if(typeof tl.go==='function')tl.go(i,'resize');}
  else if(eng&&mode&&(relayout()||replay())){}
  else if(eng&&mode&&typeof eng.setMode==='function')eng.setMode(mode);
  w.NOVA?.events?.emit('value',{engine:id,key:'layoutRedraw',value:now});}catch(e){console.warn('layout redraw',e);}}
/* State-preserving redraw for native Explore/Challenge: each stage draw function is wrapped (outermost calls only) and its most
   recent call is remembered with its live arguments. A layout redraw replays those calls in their original order, so the stage
   is repainted in the new layout from the pupil's current state; the panel (inputs, choices, progress) is never rebuilt. */
let seq=0,depth=0,calls=new Map();
function wrapDraw(name,fn){if(typeof fn!=='function'||fn.__f13wrapped)return fn;const f=function(){if(depth===0)calls.set(name,{n:++seq,fn,self:this,args:Array.from(arguments)});depth++;try{return fn.apply(this,arguments);}finally{depth--;}};f.__f13wrapped=true;f.__f13name=name;return f;}
function replay(){const list=[...calls.values()].sort((a,b)=>a.n-b.n);if(!list.length)return false;try{if(w.NOVA?.ui?._drag)w.NOVA.ui.cancelDrag();}catch(e){}
 for(const c of list){depth++;try{c.fn.apply(c.self,c.args);}finally{depth--;}}w.NOVA?.events?.emit('value',{engine:last.id,key:'statePreservedRedraw',value:list.map(c=>c.name).join(',')});return true;}
/* Engines whose Explore/Challenge keep their own live drawing handle (a closure 'box' with repaint and bound drag handles) register
   a relayout hook instead: it rebuilds that handle from the pupil's live state, so later drags and controls keep working after the resize. */
let hooks=new Map();function onRelayout(key,fn,alive){if(typeof fn==='function')hooks.set(key,{fn,alive:typeof alive==='function'?alive:()=>true});}
function relayout(){const live=[...hooks.entries()].filter(([k,h])=>{try{return h.alive();}catch(e){return false;}});if(!live.length)return false;try{if(w.NOVA?.ui?._drag)w.NOVA.ui.cancelDrag();}catch(e){}
 for(const [k,h] of live){try{h.fn();}catch(e){console.warn('relayout',e);}}
 w.NOVA?.events?.emit('value',{engine:last.id,key:'statePreservedRedraw',value:'relayout:'+live.map(x=>x[0]).join(',')});return true;}
w.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(redraw,180);});
try{const ro=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(redraw,180);});ro.observe(w.document.documentElement);}catch(e){}
/* F13: some engines update a neon tile live with textContent (e.g. a strip value after a slider move). A full render formats the
   same value with NOVA.mt.render (math italics, non-breaking units) and sets a matching aria-label, so a live update left a stale
   aria-label (screen readers heard the old value) and a different look. Re-render such tiles with the core formatter. */
function tileText(v){return String(v).replace(/-/g,'\u2011').replace(/ /g,'\u00A0\u200B');}
function syncTiles(root){const R=w.NOVA&&w.NOVA.mt&&w.NOVA.mt.render;if(!R||!root||!root.querySelectorAll)return 0;let n=0;
 for(const m of root.querySelectorAll('.nv-ntile > [role="math"]')){const raw=m.textContent;let e;try{e=R(tileText(raw));}catch(x){continue;}if(!e||e.nodeType!==1)continue;
  const al=e.getAttribute('aria-label');if(m.innerHTML!==e.innerHTML||(al!=null&&m.getAttribute('aria-label')!==al)){m.innerHTML=e.innerHTML;if(al!=null)m.setAttribute('aria-label',al);n++;}}return n;}
let syncing=false;
try{const mo=new MutationObserver(recs=>{if(syncing)return;if(!recs.some(r=>{const t=r.target.nodeType===1?r.target:r.target.parentElement;return t&&t.closest&&t.closest('.nv-ntile');}))return;syncing=true;try{const roots=new Set(recs.map(r=>{const t=r.target.nodeType===1?r.target:r.target.parentElement;return t&&t.closest('.nv-ntile');}).filter(Boolean));roots.forEach(t=>syncTiles(t.parentNode||t));}finally{syncing=false;}});
 const start=()=>mo.observe(w.document.body||w.document.documentElement,{subtree:true,childList:true,characterData:true});if(w.document.body)start();else w.addEventListener('DOMContentLoaded',start);}catch(e){}
w.NovaF13Runtime={conceal,syncTiles,finish,redraw,wrapDraw,replay,onRelayout,relayout,state:()=>({...last,draws:[...calls.keys()]})};
const I=w.NovaV2Integration;if(!I||I.__f13)return;I.__f13=true;const reg=I.register;
I.register=function(id,def,scope){scope=scope||{};if(!scope.validate&&w.NovaF13Contracts)scope.validate=r=>w.NovaF13Contracts.validate(id,r);const api=reg.call(this,id,def,scope);const render=api.render.bind(api);
 api.render=function(r,stage,animate){last={...last,kind:'record',record:r,stage:stage||w.NOVA?.engines?.[id]?.stage,id,cls:cls()};const p=render(r,stage,animate);const st=stage||w.NOVA?.engines?.[id]?.stage;finish(st);conceal(st,r);const again=()=>{finish(st);conceal(st,r);};return Promise.resolve(p).then(v=>{again();return v;},e=>{throw e;});};
 w.NOVA?.events?.on('mode',e=>{if(!e.detail||e.detail.engine===id){last.kind='native';last.mode=e.detail&&e.detail.mode;calls.clear();last.cls=cls();last.id=id;}});w.NOVA?.events?.on('step',e=>{if(e.detail?.source!=='resize'&&(!e.detail||e.detail.engine===id)&&last.kind!=='record'){last.kind='native';last.id=id;}});
 return api;};
})(window);
