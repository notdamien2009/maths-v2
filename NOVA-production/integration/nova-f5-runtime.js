/* F5 runtime bridge: canonical-API validation hook, Challenge answer concealment, narrow F0-12 layout and accessible grouping.
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
  if(RESULT.test(style)&&/\d|equal|different|correct/i.test(tx)){mask(t);n++;continue;}
  if(A&&tx===A.text&&!given.has(tx)){mask(t);n++;}}
 if(A&&A.frac&&!given.has(A.frac.n)){for(const g of stage.querySelectorAll('g[aria-label]')){if(norm(g.getAttribute('aria-label'))===A.frac.n+' over '+A.frac.d){g.setAttribute('aria-label','unknown fraction');g.querySelectorAll('text').forEach(mask);n++;}}}
 for(const el of stage.querySelectorAll('.answer-chip,.nv-answer,[data-answer]')){el.textContent='?';n++;}
 if(A){const re=new RegExp('(^|[^\\d.])'+A.text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&')+'(?![\\d.])','g');for(const el of stage.querySelectorAll('title,[aria-label]')){const attr=el.tagName==='title'?null:'aria-label',v=attr?el.getAttribute(attr):el.textContent;if(v&&!given.has(A.text)&&re.test(v)){const nv=v.replace(re,'$1?');attr?el.setAttribute(attr,nv):el.textContent=nv;n++;}}}
 return n;}
function finish(stage){if(!stage)return;const d=stage.ownerDocument;if(!d.getElementById('nova-f5-mobile')){const s=d.createElement('style');s.id='nova-f5-mobile';s.textContent='@media(max-width:420px){.gw-q{grid-template-columns:minmax(0,1fr)!important;height:auto!important;padding:12px!important}.gw-q>.p{min-width:0}.gw-q>.a{justify-self:end}}';d.head.append(s);}
 for(const e of stage.querySelectorAll('[role="null"]'))e.removeAttribute('role');for(const g of stage.querySelectorAll('svg g[aria-label]:not([role])'))g.setAttribute('role','group');
 for(const svg of stage.querySelectorAll('svg'))if(svg.querySelector('[tabindex="0"],[role="button"],[role="slider"]'))svg.setAttribute('role','group');}
w.NovaF5Runtime={conceal,finish};
const I=w.NovaV2Integration;if(!I||I.__f5)return;I.__f5=true;const reg=I.register,cfg=I.configuration;
/* Reserved lesson-owned preset: lessons set exact values with record.config {presets:{lesson:{...}},preset:'lesson'}; native preset schema is kept. */
I.configuration=function(x){const c=cfg.call(this,x);try{if(c&&c.presets&&c.presets[c.preset]&&!c.presets.lesson)c.presets.lesson=Object.assign({},c.presets[c.preset],{label:'Lesson values'});}catch(e){}return c;};
I.register=function(id,def,scope){scope=scope||{};if(!scope.validate&&w.NovaF5Contracts)scope.validate=r=>w.NovaF5Contracts.validate(id,r);const api=reg.call(this,id,def,scope);const render=api.render.bind(api);
 api.render=function(r,stage,animate){const st0=stage||w.NOVA?.engines?.[id]?.stage;w.NovaF5Runtime.beginRecord?.(r,st0);let p;try{p=render(r,stage,animate);}finally{w.NovaF5Runtime.endRecord?.();}const st=stage||w.NOVA?.engines?.[id]?.stage;finish(st);conceal(st,r);const again=()=>{finish(st);conceal(st,r);};return Promise.resolve(p).then(v=>{again();return v;},e=>{throw e;});};
 return api;};
})(window);
/* F5 relayout (2026-10-17): F5 drawings choose their phone or desktop geometry from innerWidth when drawn.
   Record the last layout-dependent draw per stage; when the width crosses that engine's breakpoint, replay it
   with the same live state so the original apparatus redraws in the right layout. F0-12 host and answer concealment are preserved. */
(function(w){'use strict';const R=w.NovaF5Runtime;if(!R||R.record)return;const entries=new Map();let bps=[670],replaying=false,timer=null,inRecord=null;
const side=x=>bps.map(b=>x<=b).join();
R.breakpoints=function(list){if(Array.isArray(list)&&list.length)bps=list.slice();};
R.record=function(fn,self,args){const st=args&&args[0];if(!st||!st.nodeType)return;const prev=entries.get(st);if(prev&&prev.tick&&prev.fn!==fn)return;/* nested helper draw inside the same outer draw */entries.set(st,{fn,self,args:Array.from(args),tick:(queueMicrotask(()=>{const e=entries.get(st);if(e)e.tick=false;}),true),width:w.innerWidth,record:inRecord&&inRecord.stage===st?inRecord.r:(entries.get(st)?.inRender?entries.get(st).record:null)});};
R.beginRecord=(r,stage)=>{inRecord={r,stage};};R.endRecord=()=>{inRecord=null;};
R.relayout=function(force){let n=0;for(const[st,e]of [...entries]){if(!st.isConnected){entries.delete(st);continue;}if(!force&&side(e.width)===side(w.innerWidth))continue;
 const host=[...st.children].find(c=>c.classList&&c.classList.contains('f012-game-host'));if(host)host.remove();const rm=w.NOVA.reducedMotion;w.NOVA.reducedMotion=()=>true;replaying=true;
 try{e.fn.apply(e.self,e.args);}catch(err){console.error('F5 relayout',err);}finally{replaying=false;w.NOVA.reducedMotion=rm;}
 const now=entries.get(st);if(now){now.width=w.innerWidth;now.record=e.record;}R.finish(st);if(e.record)R.conceal(st,e.record);
 if(host){const area=host.querySelector('.f012-chart-area');const nodes=[...st.childNodes].filter(x=>!(x.nodeType===1&&x.matches('.nv-dock')));if(area)area.replaceChildren(...nodes);st.prepend(host);}n++;}return n;};
w.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>R.relayout(false),120);});
})(window);
