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
