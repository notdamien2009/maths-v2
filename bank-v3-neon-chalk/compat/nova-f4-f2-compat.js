/* NOVA F4 Run14 compatibility overlay. Extracted verbatim from canonical pre-F12 F0 core; no shared core edits. */
/* ===== v3.5 LOCKED NUMBER LINE (F0-03 style) =====
   The ONLY way to draw a number line, scale line, log/power line or zoom line in any engine.
   Neon glass tube + lit core with arrowheads at both ends; a straight, evenly sized neon line at every MAJOR value
   (glow 7 + core 2.6, from 13 above to 15 below); optional MINOR values as SHORTER straight lines in the same style
   (never dots or beads); chalk-draw digits centred under each major line.
   o:{x,y,w,min,max,major,minor,label:false|fn(v)->string|{base,sup},labelSize,vertical,side:'left'|'right' (vertical labels),arrows(true)}
   Horizontal: (x,y) is the left end of the line, w its length. Vertical: (x,y) is the TOP end, w its length, labels to the right.
   Returns {g,s(v),sx(v),inv(px),y0,x0}. */
NOVA.numberLine=function(p,o){var E=NOVA.svg.el,g=E('g',{class:'nv-numberline'},p),V=!!o.vertical,L=o.w,min=o.min,max=o.max;
  var s=function(v){var f=(v-min)/(max-min);return V?o.y+L-f*L:o.x+f*L;},inv=function(px){return V?min+(o.y+L-px)/L*(max-min):min+(px-o.x)/L*(max-min);};
  var A=V?o.x:o.y,ar=o.arrows===false?{}:{'marker-end':'url(#nv-arr-ink)','marker-start':'url(#nv-arr-ink)'};
  var a0=(V?o.y:o.x)-8,a1=(V?o.y:o.x)+L+8;
  function seg(p1,p2,attrs){return V?E('line',Object.assign({x1:A+p1[1],y1:p1[0],x2:A+p2[1],y2:p2[0]},attrs),g):E('line',Object.assign({x1:p1[0],y1:A+p1[1],x2:p2[0],y2:A+p2[1]},attrs),g);}
  if(V)E('rect',{x:A-9,y:a0-4,width:18,height:L+24,rx:9,css:'fill:url(#nv-glass-track);stroke:#67b8e5',filter:'url(#nv-neon-soft)'},g);else E('rect',{x:a0-4,y:A-9,width:L+24,height:18,rx:9,css:'fill:url(#nv-glass-track);stroke:#67b8e5',filter:'url(#nv-neon-soft)'},g);
  if(V)E('rect',{x:A-5,y:a0,width:10,height:L+16,rx:5,css:'fill:none;stroke:#59ddff3d'},g);else E('rect',{x:a0,y:A-5,width:L+16,height:10,rx:5,css:'fill:none;stroke:#59ddff3d'},g);
  var core=V?E('line',Object.assign({x1:A,y1:a1,x2:A,y2:a0,'stroke-width':2.8,'stroke-linecap':'round',filter:'url(#nv-neon)',css:'stroke:url(#nv-ink-lit)'},ar),g):E('line',Object.assign({x1:a0,y1:A,x2:a1,y2:A,'stroke-width':2.8,'stroke-linecap':'round',filter:'url(#nv-neon)',css:'stroke:url(#nv-ink-lit)'},ar),g);
  function tick(v,big){var c=Math.round(s(v))+.5,u=big?13:7,d=big?15:8;seg([c,-u],[c,d],{'stroke-width':big?7:5,'stroke-linecap':'round',css:'stroke:#59ddff;opacity:.28'});seg([c,-u],[c,d],{'stroke-width':big?2.6:1.8,'stroke-linecap':'butt',css:'stroke:#e8fbff'});return c;}
  var eps=(max-min)*1e-7,mj=o.major||1,mn=o.minor||0,i,v;
  if(mn)for(i=0;(v=min+i*mn)<=max+eps;i++){var r=(v-min)/mj;if(Math.abs(r-Math.round(r))>1e-6)tick(v,false);}
  for(i=0;(v=min+i*mj)<=max+eps;i++){v=+v.toPrecision(12);var c=tick(v,true);if(o.label===false)continue;var lb=o.label?o.label(v):NOVA.svg.num(v);if(lb==null||lb==='')continue;var sz=o.labelSize||14;
    var t=V?NOVA.svg.label(g,o.side==='left'?A-26:A+26,c+5,'',{size:sz,maths:true,anchor:o.side==='left'?'end':'start'}):NOVA.svg.label(g,c,A+34,'',{size:sz,maths:true});
    if(typeof lb==='object'){t.textContent=lb.base;var sp=E('tspan',{dy:-7,'font-size':Math.round(sz*.68)},t);sp.textContent=String(lb.sup).replace('-','\u2212');}else t.textContent=lb;}
  return {g:g,s:s,sx:s,sy:s,inv:inv,y0:V?null:A,x0:V?A:null};};

/* ===== v3.6 PLACE COLOUR TOKENS (separate from maths role colours) =====
   A place colour says WHICH COLUMN something belongs to (thousands … thousandths). It never means given/unknown/result etc.
   Maths role colours (NOVA.tokens.maths) keep their fixed meaning on top: gold highlight = focus/placeholder, green = result. */
NOVA.place={'3':{short:'Th',name:'Thousands',cssVar:'--pv-th',hex:'#a78bfa'},'2':{short:'H',name:'Hundreds',cssVar:'--pv-h',hex:'#818cf8'},'1':{short:'T',name:'Tens',cssVar:'--pv-t',hex:'#60a5fa'},'0':{short:'O',name:'Ones',cssVar:'--pv-o',hex:'#2dd4bf'},
  '-1':{short:'t',name:'Tenths',cssVar:'--pv-t1',hex:'#c084fc'},'-2':{short:'h',name:'Hundredths',cssVar:'--pv-h1',hex:'#f472b6'},'-3':{short:'th',name:'Thousandths',cssVar:'--pv-th1',hex:'#fb923c'}};
NOVA.placeColour=function(p){return (NOVA.place[String(p)]||{hex:'#7dd3fc'}).hex;};
NOVA.placeKey=function(places){var h=NOVA.h,d=h('div',{class:'nv-pvkey','aria-label':'Place key'});places.forEach(function(p){var q=NOVA.place[String(p)];d.appendChild(h('span',{text:q.short+' = '+q.name,style:'color:'+q.hex+';text-shadow:0 0 8px '+q.hex+'88'}));});return d;};
/* ===== v3.6 MOTION KIT: eased/spring tweens, glow trails, flashes; all instant under reduced motion ===== */
NOVA.motion={
  ease:{out:function(t){return 1-Math.pow(1-t,3);},inOut:function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;},
    spring:function(t){return 1-Math.exp(-6.5*t)*Math.cos(10*t);},back:function(t){var c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);}},
  tween:function(ms,fn,ease,done){ease=ease||NOVA.motion.ease.out;if(NOVA.reducedMotion()||!ms){fn(1,1);if(done)done();return {stop:function(){}};}
    var t0=null,stop=false,R=NOVA.motion.raf||function(cb){return requestAnimationFrame(cb);};function f(t){if(stop)return;t0=t0||t;var q=Math.min(1,(t-t0)/ms);fn(ease(q),q);if(q<1)R(f);else if(done)done();}R(f);return {stop:function(){stop=true;}};},
  /* test hook: NOVA.motion.raf can be replaced (e.g. a 16 ms setTimeout clock for headless frame capture) */
  raf:null,
  seq:function(list,done){var i=0;(function n(){if(i>=list.length){if(done)done();return;}list[i++](n);})();},
  delay:function(ms,fn){if(NOVA.reducedMotion())return fn();setTimeout(fn,ms);},
  /* glow trail: a neon path that fades away */
  trail:function(svg,d,colour,ms){if(NOVA.reducedMotion())return;var g=NOVA.neonPath(svg,d,{role:colour,width:3});if(!g)return;g.style.pointerEvents='none';NOVA.motion.tween(ms||650,function(e){g.style.opacity=String(1-e);},null,function(){if(g.parentNode)g.parentNode.removeChild(g);});},
  /* flash: expanding glowing ring */
  flash:function(svg,x,y,colour,r){var E=NOVA.svg.el,c=E('circle',{cx:x,cy:y,r:4,fill:'none','stroke-width':4,filter:'url(#nv-neon)',css:'stroke:'+NOVA.svg.c(colour||'unknown')+';pointer-events:none'},svg);
    NOVA.motion.tween(520,function(e){c.setAttribute('r',4+(r||34)*e);c.style.opacity=String(1-e);},null,function(){if(c.parentNode)c.parentNode.removeChild(c);});},
  /* move an SVG element by translate from (dx0,dy0) to (0,0) */
  arrive:function(el,dx0,dy0,ms,ease,done){NOVA.motion.tween(ms||520,function(e){el.setAttribute('transform','translate('+(dx0*(1-e)).toFixed(2)+','+(dy0*(1-e)).toFixed(2)+')');},ease||NOVA.motion.ease.spring,function(){el.removeAttribute('transform');if(done)done();});},
  /* pop: scale up then settle with a spring */
  pop:function(el,cx,cy,done){NOVA.motion.tween(460,function(e){var s=1+0.35*(1-e)*Math.cos(e*8);el.setAttribute('transform','translate('+cx+','+cy+') scale('+s.toFixed(3)+') translate('+(-cx)+','+(-cy)+')');},NOVA.motion.ease.out,function(){el.removeAttribute('transform');if(done)done();});}
};
/* ===== v3.6.2 SVG DRAG RULES (shared by all F2 engines) =====
   NOVA.ui.svgDrag(svg, el, o)
     o.box      {x,y,w,h}  hit area in SVG units (padded more on touch/coarse pointers)
     o.zones()  -> [{x,y,w,h,id,kind:'drop'|'remove'}]  valid targets (only these ever highlight)
     o.onDrop(id) -> true if accepted (engine updates state + redraws, snap/pop is the engine's)
     o.onRemove()  called after the fade-to-tray animation when dropped on a 'remove' zone
     o.removeTo {x,y} where the fade-to-tray goes;  o.canStart() -> false blocks pickup (e.g. mid-exchange)
   Rules: every drop resolves to exactly ONE outcome: land in a drop zone, remove on a remove zone,
   or animate back to origin. Never left outside. One drag at a time. pointercancel / lostpointercapture /
   window blur / scroll / Escape all cancel back to origin. Lift = scale + shadow + top z-order; follow has slight lag + tilt. */
NOVA.ui._drag=null;
NOVA.ui.cancelDrag=function(){if(NOVA.ui._drag)NOVA.ui._drag.cancel();};
(function(){if(typeof window==='undefined')return;var c=function(){NOVA.ui.cancelDrag();};window.addEventListener('blur',c);window.addEventListener('scroll',function(){if(NOVA.ui._drag&&NOVA.ui._drag.moved)return;c();},true);
  window.addEventListener('keydown',function(e){if(e.key==='Escape')c();});
  window.addEventListener('pointerup',function(e){if(NOVA.ui._drag&&!NOVA.ui._drag.captured)NOVA.ui._drag.up(e);});})();
NOVA.ui.svgDrag=function(svg,el,o){o=o||{};var E=NOVA.svg.el,coarse=window.matchMedia&&matchMedia('(pointer:coarse)').matches,pad=coarse?12:4;
  el.setAttribute('data-drag','1');el.style.cursor='grab';el.style.touchAction='none';
  if(o.box){var b=o.box;E('rect',{class:'nv-hit',x:b.x-pad,y:b.y-pad,width:b.w+2*pad,height:b.h+2*pad,fill:'transparent',css:'pointer-events:all'},el);}
  var cx=o.box?o.box.x+o.box.w/2:0,cy=o.box?o.box.y+o.box.h/2:0;
  function pt(e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;var m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):{x:0,y:0};}
  function inZ(z,x,y){return x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h;}
  function setT(dx,dy,rot,sc){el.setAttribute('transform','translate('+dx.toFixed(1)+','+dy.toFixed(1)+') rotate('+rot.toFixed(1)+','+cx+','+cy+') translate('+cx+','+cy+') scale('+sc.toFixed(3)+') translate('+(-cx)+','+(-cy)+')');}
  function clearT(){el.removeAttribute('transform');el.classList.remove('nv-drag-lift');el.style.cursor='grab';}
  el.addEventListener('pointerdown',function(e){if(NOVA.ui._drag||(o.canStart&&!o.canStart())||e.button>0)return;e.preventDefault();e.stopPropagation();
    var st={x0:pt(e).x,y0:pt(e).y,tx:0,ty:0,dx:0,dy:0,rot:0,id:e.pointerId,hl:null,zone:null,moved:false,captured:false,done:false,raf:0,last:null};
    try{el.setPointerCapture(e.pointerId);st.captured=el.hasPointerCapture?el.hasPointerCapture(e.pointerId):true;}catch(_){st.captured=false;}
    var home=el.parentNode,next=el.nextSibling;svg.appendChild(el);el.classList.add('nv-drag-lift');el.style.cursor='grabbing';var rm=NOVA.reducedMotion();
    function frame(){if(st.done)return;var k=rm?1:.38;var vx=st.tx-st.dx;st.dx+=vx*k;st.dy+=(st.ty-st.dy)*k;st.rot+=((rm?0:Math.max(-10,Math.min(10,vx*.5)))-st.rot)*.3;setT(st.dx,st.dy,st.rot,1.12);if(!rm)st.raf=requestAnimationFrame(frame);}
    setT(0,0,0,1.12);
    function hl(z){if(st.zone===z)return;st.zone=z;if(st.hl&&st.hl.parentNode)st.hl.parentNode.removeChild(st.hl);st.hl=null;
      if(z){st.hl=E('rect',{class:'nv-drop-hl '+(z.kind==='remove'?'nv-drop-remove':'nv-drop-ok'),x:z.x-3,y:z.y-3,width:z.w+6,height:z.h+6,rx:14,filter:'url(#nv-neon)'},svg);svg.insertBefore(st.hl,el);}}
    st.move=function(ev){if(st.done||ev.pointerId!==st.id)return;var q=pt(ev);st.tx=q.x-st.x0;st.ty=q.y-st.y0;st.moved=st.moved||Math.abs(st.tx)+Math.abs(st.ty)>3;
      if(rm)frame();else if(!st.raf)st.raf=requestAnimationFrame(frame);var zs=o.zones?o.zones():[],z=null;zs.forEach(function(Z){if(inZ(Z,q.x,q.y))z=Z;});hl(z);};
    function finish(){st.done=true;cancelAnimationFrame(st.raf);hl(null);NOVA.ui._drag=null;try{el.releasePointerCapture(st.id);}catch(_){}
      el.removeEventListener('pointermove',st.move);el.removeEventListener('pointerup',st.up);el.removeEventListener('pointercancel',st.cancel);el.removeEventListener('lostpointercapture',st.lost);window.removeEventListener('pointermove',st.move);}
    function goHome(){clearT();if(home&&home.isConnected&&el.parentNode!==home){try{home.insertBefore(el,next&&next.parentNode===home?next:null);}catch(_){home.appendChild(el);}}}
    function back(){var dx=st.dx,dy=st.dy,r=st.rot;finish();if(!el.isConnected)return;NOVA.motion.tween(380,function(e2){setT(dx*(1-e2),dy*(1-e2),r*(1-e2),1.12-.12*e2);},NOVA.motion.ease.spring,goHome);}
    st.cancel=function(){if(!st.done)back();};
    st.lost=function(){if(!st.done)setTimeout(function(){if(!st.done&&st.captured)back();},0);};
    st.up=function(ev){if(st.done)return;if(ev&&ev.pointerId!=null&&ev.pointerId!==st.id)return;var q=ev&&ev.clientX!=null?pt(ev):null,z=null;
      if(q){st.tx=q.x-st.x0;st.ty=q.y-st.y0;st.dx=st.tx;st.dy=st.ty;(o.zones?o.zones():[]).forEach(function(Z){if(inZ(Z,q.x,q.y))z=Z;});}
      if(z&&z.kind==='drop'){var dx=st.dx,dy=st.dy;finish();var ok=false;try{ok=!!(o.onDrop&&o.onDrop(z.id));}catch(err){ok=false;}if(!ok){st.dx=dx;st.dy=dy;st.done=false;back();}else if(el.isConnected)goHome();return;}
      if(z&&z.kind==='remove'&&o.onRemove){var sx=st.dx,sy=st.dy,to=o.removeTo||{x:z.x+z.w/2,y:z.y+z.h/2};finish();
        NOVA.motion.tween(300,function(e2){setT(sx+(to.x-cx-sx)*e2,sy+(to.y-cy-sy)*e2,0,1.12-.8*e2);el.style.opacity=String(1-e2);},NOVA.motion.ease.inOut,function(){el.style.opacity='';goHome();o.onRemove();});return;}
      back();};
    el.addEventListener('pointermove',st.move);el.addEventListener('pointerup',st.up);el.addEventListener('pointercancel',st.cancel);el.addEventListener('lostpointercapture',st.lost);
    if(!st.captured)window.addEventListener('pointermove',st.move);
    NOVA.ui._drag={cancel:st.cancel,up:st.up,get moved(){return st.moved;},get captured(){return st.captured;},el:el};});
  return el;};
