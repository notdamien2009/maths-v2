/* F13-03 — PREMIUM ISOMETRIC DRAWING · original NOVA F0/F1/F12 runtime preserved. */
var NOVA_F13_03_CONFIG={startMode:'watch',preset:'lshape',presets:{single:'One unit cube',row:'Two joined cubes',platform:'2 by 2 platform',tower:'Three-high column',lshape:'L-shaped model',stairs:'Staircase',hidden:'Hidden cube challenge'}};
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,F=NOVA.f12,C=NOVA_F13_03_CONFIG,EN='F13-03',N=4;
var PALETTE={cyan:'#2bdcf3',violet:'#9d89ff',blue:'#51aaff',green:'#59eeb3',gold:'#ffce79'};
function blank(){return Array.from({length:N},function(){return Array(N).fill(0);});}
function put(g,places){places.forEach(function(t){g[t[0]][t[1]]=t[2]||1;});return g;}
function model(name){var g=blank();switch(name){case 'single':return put(g,[[1,1,1]]);case 'row':return put(g,[[1,1,1],[2,1,1]]);case 'platform':return put(g,[[1,1,1],[2,1,1],[1,2,1],[2,2,1]]);case 'tower':return put(g,[[1,1,3]]);case 'lshape':return put(g,[[1,1,2],[2,1,1],[1,2,1]]);case 'stairs':return put(g,[[0,1,1],[1,1,2],[2,1,3]]);case 'hidden':return put(g,[[1,1,2],[2,1,2],[1,2,1],[2,2,1]]);default:return g;}}
function same(a,b){return a.every(function(r,x){return r.every(function(v,y){return v===b[x][y];});});}
function total(g){return g.reduce(function(v,r){return v+r.reduce(function(a,b){return a+b;},0);},0);}
function footprint(g){return g.reduce(function(v,r){return v+r.filter(Boolean).length;},0);}
function maxH(g){return g.reduce(function(v,r){return Math.max(v,...r);},0);}
function clone(g){return g.map(function(r){return r.slice();});}
function state(p){return {grid:model(p||'lshape'),focus:[1,1],tool:'add',wire:false,showDots:true,showAxes:true,showNumbers:false,hover:null,drag:null,undo:[],redo:[],preset:p||'lshape',onChange:null};}
function projection(W,H,g){var mobile=W<=450,u=mobile?51:72,OX=W/2,OY=mobile?305:296;
 var high=0;for(var x=0;x<N;x++)for(var y=0;y<N;y++)if(g[x][y]){var yy=OY+((x+y)-N)*u*.5-g[x][y]*u;high=Math.min(yy,high);}
 var topY=OY-N*u*.5-Math.max(1,maxH(g))*u; // fit the model, not an imaginary four-high corner
 var lower=OY+N*u*.5,span=lower-topY;
 if(span>H-85){u*=(H-85)/span;}
 var P=function(x,y,z){return [OX+(x-y)*u*Math.sqrt(3)/2, OY+((x+y)-N)*u*.5-(z||0)*u];};
 // only pan if populated cells approach the cap; do not repeatedly zoom on hover.
 var miny=1e6,maxy=-1e6;for(var i=0;i<=N;i++)for(var j=0;j<=N;j++){var p=P(i,j,0);miny=Math.min(miny,p[1]);maxy=Math.max(maxy,p[1]);}
 for(var a=0;a<N;a++)for(var b=0;b<N;b++)if(g[a][b]){var q=P(a,b,g[a][b]);miny=Math.min(miny,q[1]);}
 var dy=Math.max(0,68-miny); if(maxy+dy>H-30)dy=Math.min(dy,H-30-maxy);OY+=dy;
 return {W:W,H:H,u:u,point:function(x,y,z){return [OX+(x-y)*u*Math.sqrt(3)/2,OY+((x+y)-N)*u*.5-(z||0)*u];},cx:OX,cy:OY};}
function path(p){return 'M'+p.map(function(a){return a[0].toFixed(2)+','+a[1].toFixed(2);}).join('L')+'Z';}
function ptIn(px,py,arr){var hit=false;for(var i=0,j=arr.length-1;i<arr.length;j=i++){var a=arr[i],b=arr[j];if((a[1]>py)!==(b[1]>py)&&px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
function el(p,tag,attrs){return S.el(tag,attrs,p);}
function fmt(n){return Math.round(n*100)/100;}
function grad(sv){var d=sv.querySelector('defs')||el(sv,'defs',{});
 var specs=[['top','#bffcff','#3980af','#082849'],['right','#acb9ff','#6a68b6','#171c55'],['left','#aefff1','#267d85','#092c50']];
 specs.forEach(function(x){var gr=el(d,'linearGradient',{id:'iso-'+x[0],x1:'9%',y1:'3%',x2:'94%',y2:'94%'});el(gr,'stop',{offset:0,'stop-color':x[1],'stop-opacity':.85});el(gr,'stop',{offset:'.28','stop-color':x[2],'stop-opacity':.66});el(gr,'stop',{offset:1,'stop-color':x[3],'stop-opacity':.94});});
 var glow=el(d,'radialGradient',{id:'iso-halo'});el(glow,'stop',{offset:0,'stop-color':'#2bdcf3','stop-opacity':.24});el(glow,'stop',{offset:1,'stop-color':'#2bdcf3','stop-opacity':0});
}
function lines(sv,geom,pts,role,width){return NOVA.neonPath(geom,path(pts),{role:role||'op',width:width||2.2});}
function addBg(sv,pj,st){var W=pj.W,H=pj.H;
 el(sv,'ellipse',{cx:W/2,cy:H*.58,rx:W*.39,ry:H*.48,fill:'url(#iso-halo)',opacity:1});
 var backing=el(sv,'g',{class:'f13-iso-background',opacity:.6});
 for(var t=0;t<=N;t++){var aa=pj.point(t,0,0),bb=pj.point(t,N,0),cc=pj.point(0,t,0),dd=pj.point(N,t,0);
  el(backing,'path',{d:'M'+aa[0]+','+aa[1]+'L'+bb[0]+','+bb[1],stroke:'#2d728e','stroke-width':t===0||t===N?1.35:.8,fill:'none',opacity:t===0||t===N?.66:.37});
  el(backing,'path',{d:'M'+cc[0]+','+cc[1]+'L'+dd[0]+','+dd[1],stroke:'#2d728e','stroke-width':t===0||t===N?1.35:.8,fill:'none',opacity:t===0||t===N?.66:.37});}
 if(st.showDots){var dots=el(sv,'g',{class:'f13-iso-dots'});for(var x=0;x<=N;x++)for(var y=0;y<=N;y++){
 var a=pj.point(x,y,0);el(dots,'circle',{cx:a[0],cy:a[1],r:2.9,fill:'#9cfaff',opacity:.82,filter:'url(#nv-neon-soft)'});el(dots,'circle',{cx:a[0],cy:a[1],r:1.2,fill:'#e2feff'});}}
 if(st.showAxes){var x0=pj.point(0,0,0),xp=pj.point(1.05,0,0),yp=pj.point(0,1.05,0),zp=pj.point(0,0,1.05);
 [['x',xp,'given'],['y',yp,'focus'],['height',zp,'result']].forEach(function(a){NOVA.chalkText(sv,a[1][0]+(a[0]==='y'?-13:14),a[1][1]+(a[0]==='height'?0:10),a[0],{role:a[2],size:16});});
 NOVA.neonLine(sv,x0[0],x0[1],xp[0],xp[1],{role:'given',width:1.6});NOVA.neonLine(sv,x0[0],x0[1],yp[0],yp[1],{role:'focus',width:1.6});NOVA.neonLine(sv,x0[0],x0[1],zp[0],zp[1],{role:'result',width:1.6});}}
function topPts(pj,x,y,z){return [pj.point(x,y,z),pj.point(x+1,y,z),pj.point(x+1,y+1,z),pj.point(x,y+1,z)];}
function tintFace(parent,pts,role,visible,wire,focus,color){var g=el(parent,'g',{class:'f13-iso-face','data-iso-face':role});var colorFill='url(#iso-'+role+')';el(g,'path',{d:path(pts),fill:wire?'#102e4d38':colorFill,stroke:'none',opacity:wire?.37:1});
 var edge=focus?'focus':(role==='top'?'given':role==='right'?'op':'result');lines(parent,g,pts,edge,focus?2.95:2.25);
 if(!wire&&role==='top'){el(g,'path',{d:'M'+pts[0][0]+','+pts[0][1]+'L'+pts[1][0]+','+pts[1][1]+'L'+pts[2][0]+','+pts[2][1],fill:'none',stroke:'#fff',opacity:.23,'stroke-width':1.05});}
 return g;}
function drawCubes(layer,pj,st){var cells=[];for(var x=0;x<N;x++)for(var y=0;y<N;y++)for(var z=0;z<st.grid[x][y];z++)cells.push([x,y,z]);
 cells.sort(function(a,b){return (a[0]+a[1]+a[2]*.7)-(b[0]+b[1]+b[2]*.7);});
 var cubeGrp=el(layer,'g',{class:'f13-iso-cubes','data-maths':'isometric-stack'}),vis={top:0,right:0,left:0};
 cells.forEach(function(c){var x=c[0],y=c[1],z=c[2],ce=el(cubeGrp,'g',{'data-cube':x+','+y+','+z,role:'img','aria-label':'Unit cube at column '+(x+1)+', row '+(y+1)+', level '+(z+1)}),focus=st.focus[0]===x&&st.focus[1]===y;
 // Only exterior faces are drawn; touching faces belong inside the solid.
 var top=z===st.grid[x][y]-1,
  xSide=x===N-1||st.grid[x+1][y]<=z,ySide=y===N-1||st.grid[x][y+1]<=z;
 var A=pj.point(x,y,z),B=pj.point(x+1,y,z),C=pj.point(x+1,y+1,z),D=pj.point(x,y+1,z),E=pj.point(x,y,z+1),F=pj.point(x+1,y,z+1),G=pj.point(x+1,y+1,z+1),H=pj.point(x,y+1,z+1);
 if(xSide){tintFace(ce,[B,C,G,F],'right',true,st.wire,focus);vis.right++;}
 if(ySide){tintFace(ce,[D,C,G,H],'left',true,st.wire,focus);vis.left++;}
 if(top){tintFace(ce,[E,F,G,H],'top',true,st.wire,focus);vis.top++;if(st.showNumbers){var mid=[(E[0]+F[0]+G[0]+H[0])/4,(E[1]+F[1]+G[1]+H[1])/4];NOVA.chalkText(ce,mid[0],mid[1]+5,String(z+1),{role:'given',size:16,anchor:'middle'});}}
 });return vis;}
function visual(stage,st,caption,pose,interactive){if(stage._f13Cleanup)stage._f13Cleanup();stage.replaceChildren();NOVA.cap(stage,'ISOMETRIC DRAWING · '+(C.presets[st.preset]||'Build your own'),interactive?'tap or drag to draw':'isometric dot paper');
 var mobile=window.innerWidth<=580,W=mobile?420:760,H=mobile?510:465;
 var sv=S.root(W,H,'Isometric dot paper and a model built from '+total(st.grid)+' unit cubes. Exposed faces and three axes at thirty degree diagonals.');sv.classList.add('f13-iso-svg');sv.setAttribute('role','group');sv.setAttribute('tabindex','0');sv.style.touchAction='none';stage.appendChild(sv);grad(sv);
 var root=el(sv,'g',{'data-isometric-root':'true'}),pj=null,targets=[];
 function draw(){root.replaceChildren();pj=projection(W,H,st.grid);addBg(root,pj,st);if(st.markedTargets){var ghost=el(root,'g',{class:'f13-iso-task-footprints'});st.markedTargets.forEach(function(cell){var poly=topPts(pj,cell[0],cell[1],0);el(ghost,'path',{d:path(poly),fill:'#ffc56b19',stroke:'#ffce79','stroke-width':2,'stroke-dasharray':'8 6',filter:'url(#nv-neon-soft)',opacity:.72});});}drawCubes(root,pj,st);
  var markers=el(root,'g',{class:'f13-iso-hits'});targets=[];
  for(var x=0;x<N;x++)for(var y=0;y<N;y++){
   var top=st.grid[x][y],poly=topPts(pj,x,y,top),cent=[poly.reduce(function(v,p){return v+p[0];},0)/4,poly.reduce(function(v,p){return v+p[1];},0)/4],focused=st.focus[0]===x&&st.focus[1]===y;
   targets.push({x:x,y:y,poly:poly,centre:cent,height:top});
   if((focused||st.hover&&st.hover[0]===x&&st.hover[1]===y)&&interactive){var col=focused?'#ffd177':'#65eed1';el(markers,'path',{d:path(poly),fill:focused?'#f5cf6924':'#5dffc024',stroke:col,'stroke-width':2.6,'stroke-dasharray':focused?'6 4':'4 5',filter:'url(#nv-neon-soft)',opacity:.92,'pointer-events':'none'});NOVA.neonRing(markers,cent[0],cent[1],{role:focused?'focus':'result',r:5,pulse:false});}
   if(interactive){el(markers,'path',{d:path(poly),fill:'transparent',stroke:'transparent','pointer-events':'all','data-cell':x+','+y,'aria-label':'Column '+(x+1)+', row '+(y+1)+' contains '+top+' cubes'});}}
  if(st.showNumbers&&interactive){NOVA.chalkText(root,W*.87,H*.15,total(st.grid)+' cubes',{size:18,role:'result',anchor:'middle'});}var tiles=stage.querySelectorAll('.f12-strip .nv-ntile .mt');[total(st.grid),footprint(st.grid),maxH(st.grid)].forEach(function(v,i){if(tiles[i]){tiles[i].textContent=String(v);tiles[i].setAttribute('aria-label',String(v));}});}
 draw();var unlisten=function(){};
 if(interactive){var ac=new AbortController(),dpr=false,schedule=false;stage._f13Cleanup=function(){ac.abort();};
  function pointerCoordinates(ev){var r=sv.getBoundingClientRect();return [(ev.clientX-r.left)*(W/r.width),(ev.clientY-r.top)*(H/r.height)];}
  function targetPoint(pt){var t=targets.filter(function(t){return ptIn(pt[0],pt[1],t.poly);}).sort(function(a,b){return (b.x+b.y+b.height*.7)-(a.x+a.y+a.height*.7);});return t[0]||null;}
  function rerender(){if(schedule)return;schedule=true;requestAnimationFrame(function(){schedule=false;if(stage.contains(sv))draw();});}
  function apply(pt,source){var a=targetPoint(pt);if(!a||!st.drag)return;var k=a.x+','+a.y;if(st.drag.visited.has(k))return;st.drag.visited.add(k);var v=st.grid[a.x][a.y],next=st.tool==='remove'?Math.max(0,v-1):st.tool==='inspect'?v:Math.min(4,v+1);
   if(next===v&&st.tool==='inspect'&&st.onInspect)st.onInspect({x:a.x,y:a.y,level:v});if(next!==v){if(!st.drag.saved){st.undo.push(clone(st.grid));if(st.undo.length>40)st.undo.shift();st.redo=[];st.drag.saved=true;}st.grid[a.x][a.y]=next;st.focus=[a.x,a.y];if(st.onChange)st.onChange({x:a.x,y:a.y,level:next,source:source});NOVA.events.emit('value',{engine:EN,control:'cube',value:[a.x,a.y,next],source:source});rerender();}}
  sv.addEventListener('pointerdown',function(ev){if(ev.pointerType==='mouse'&&ev.button!==0)return;var pt=pointerCoordinates(ev);st.drag={id:ev.pointerId,visited:new Set(),saved:false};try{sv.setPointerCapture(ev.pointerId);}catch(e){}sv.classList.add('f13-grabbing');apply(pt,'pointer');ev.preventDefault();},{signal:ac.signal});
  sv.addEventListener('pointermove',function(ev){var pt=pointerCoordinates(ev);if(st.drag&&st.drag.id===ev.pointerId){apply(pt,'drag');return;}var t=targetPoint(pt),hover=t?[t.x,t.y]:null;if(JSON.stringify(hover)!==JSON.stringify(st.hover)){st.hover=hover;rerender();}},{signal:ac.signal});
  function end(ev){if(!st.drag||ev.pointerId!==st.drag.id)return;st.drag=null;sv.classList.remove('f13-grabbing');try{if(sv.hasPointerCapture(ev.pointerId))sv.releasePointerCapture(ev.pointerId);}catch(e){}rerender();}
  sv.addEventListener('pointerup',end,{signal:ac.signal});sv.addEventListener('pointercancel',end,{signal:ac.signal});sv.addEventListener('lostpointercapture',function(ev){if(st.drag&&ev.pointerId===st.drag.id){st.drag=null;sv.classList.remove('f13-grabbing');rerender();}},{signal:ac.signal});
  function keyadd(tool){var x=st.focus[0],y=st.focus[1],n=st.grid[x][y],next=tool==='remove'?Math.max(0,n-1):Math.min(4,n+1);if(next!==n){st.undo.push(clone(st.grid));st.redo=[];st.grid[x][y]=next;NOVA.events.emit('value',{engine:EN,control:'cube',value:[x,y,next],source:'keyboard'});if(st.onChange)st.onChange({x:x,y:y,level:next,source:'keyboard'});}draw();}
  sv.addEventListener('keydown',function(ev){var a=st.focus.slice(),key=ev.key;
   if(key==='ArrowLeft')a[0]=Math.max(0,a[0]-1);if(key==='ArrowRight')a[0]=Math.min(N-1,a[0]+1);if(key==='ArrowUp')a[1]=Math.max(0,a[1]-1);if(key==='ArrowDown')a[1]=Math.min(N-1,a[1]+1);
   if(key.startsWith('Arrow')){ev.preventDefault();st.focus=a;draw();return;}if(key==='Enter'||key===' '){ev.preventDefault();keyadd(st.tool==='inspect'?'add':st.tool);}else if(key==='Backspace'||key==='Delete'){ev.preventDefault();keyadd('remove');}else if(key==='Escape'){st.drag=null;sv.classList.remove('f13-grabbing');draw();}
  },{signal:ac.signal});window.addEventListener('blur',function(){st.drag=null;sv.classList.remove('f13-grabbing');},{signal:ac.signal});sv.f13Draw=draw;sv.f13Hit=targetPoint;sv.f13P=pj.point;st._svg=sv;
 }
 F.strip(stage,[['cubes',total(st.grid),'given'],['columns',footprint(st.grid),'focus'],['height',maxH(st.grid),'result']]);NOVA.scene.helperStrip(stage,pose||'explain',caption||'Draw along the dots. Build one cube at a time.');return sv;}
var STEPS=[
{name:'The isometric dot grid',preset:'single',focus:[1,1],showDots:true,showAxes:true,wire:true,narration:'These isometric dots guide three directions. Both ground directions slope at thirty degrees, and height goes straight up.',prompt:'Which direction shows height?',pose:'explain'},
{name:'Three directions make a cube',preset:'single',focus:[1,1],showDots:true,showAxes:true,wire:false,narration:'One cube has a top face and two visible side faces in this view. Trace the slanting edges and the upright edges.',prompt:'How many faces of the cube can we see?',pose:'point-right'},
{name:'Draw the edges carefully',preset:'single',focus:[1,1],showDots:true,showAxes:false,wire:true,narration:'Draw along the sloping and vertical lines. Keep parallel edges parallel: no freehand leaning edges.',prompt:'Why must the slanting lines stay parallel?',pose:'think'},
{name:'Two cubes share a face',preset:'row',focus:[2,1],showDots:true,showAxes:false,narration:'A second cube joins the first. Their touching faces become inside faces, so we do not draw a dark line around the hidden join.',prompt:'How many cubes make this row?',pose:'explain'},
{name:'Build a two-by-two platform',preset:'platform',focus:[2,2],showDots:true,showAxes:false,narration:'Four unit cubes cover a two-by-two footprint. The grid tells us how far across and how far back the platform reaches.',prompt:'How many unit cubes cover this base?',pose:'point-right'},
{name:'Height adds a third dimension',preset:'tower',focus:[1,1],showDots:true,showAxes:true,narration:'Stack three cubes in one column. The upright edges now show a height of three units, not three squares along the ground.',prompt:'What is the height of the stack?',pose:'think'},
{name:'Draw an L-shaped solid',preset:'lshape',focus:[1,1],showDots:true,showAxes:false,narration:'The L-shaped model has four cubes. One cube sits above another. Count both visible and hidden cubes in the drawing.',prompt:'How many unit cubes are in the model?',pose:'explain'},
{name:'A staircase rises',preset:'stairs',focus:[2,1],showDots:true,showAxes:true,narration:'The first column is one cube high, the next is two, and the last is three. One plus two plus three gives six unit cubes.',prompt:'What is one plus two plus three?',pose:'celebrate'},
{name:'Count the hidden cubes',preset:'hidden',focus:[1,1],showDots:true,showAxes:false,narration:'Some cubes are behind or beneath other cubes. Remember their full columns before you count the total.',prompt:'What is the total number of cubes?',pose:'think'}];
function watchState(step){var z=STEPS[step],st=state(z.preset);st.focus=z.focus.slice();st.wire=!!z.wire;st.showAxes=!!z.showAxes;st.showDots=z.showDots!==false;return st;}
var def={id:EN,title:'Isometric drawing studio',config:C,steps:STEPS,alt:'Isometric dot paper with accurate thirty degree axes, showing visible faces of models made from unit cubes.',staticAlt:'Isometric cube: three equal edge directions, with ground diagonals at 30 degrees and height vertical. Adjacent cubes share hidden faces. A three-step staircase with heights 1, 2, 3 contains 6 unit cubes.',
 render:function(i,stage){var z=STEPS[i],st=watchState(i);visual(stage,st,z.name,z.pose,false);},
 exploreIntro:'Make your own 3-D drawings on exact isometric dot paper. Place cubes, stack columns, and inspect edges.',
 explore:function(panel,stage,api){var st=state('lshape'),sv;
  if(api.onCleanup)api.onCleanup(function(){if(stage._f13Cleanup)stage._f13Cleanup();});
  function paint(){sv=visual(stage,st,'Try drawing, then compare the hidden and visible faces.',st.tool==='inspect'?'think':'explain',true);}
  var selector=h('select',{class:'nova-input','aria-label':'Choose isometric drawing preset'});Object.keys(C.presets).forEach(function(k){selector.appendChild(h('option',{value:k,text:C.presets[k]}));});selector.value='lshape';
  selector.onchange=function(){st.grid=model(selector.value);st.preset=selector.value;st.undo=[];st.redo=[];paint();NOVA.events.emit('value',{engine:EN,control:'preset',value:st.preset});};
  panel.appendChild(h('div',{class:'pr-row f13-panel-row'},[h('label',{},['MODEL ',selector])]));
  var bar=h('div',{class:'pr-row','aria-label':'Drawing tools'}),btns={};[['add','＋ Add cube'],['remove','− Erase top'],['inspect','⌕ Inspect']].forEach(function(a){var btn=h('button',{class:'nova-btn'+(st.tool===a[0]?' primary':''),text:a[1],onclick:function(){st.tool=a[0];Object.keys(btns).forEach(function(k){btns[k].classList.toggle('primary',k===st.tool);});paint();NOVA.events.emit('value',{engine:EN,control:'tool',value:st.tool});}});btns[a[0]]=btn;bar.appendChild(btn);});panel.appendChild(bar);
  function undo(){if(!st.undo.length)return;st.redo.push(clone(st.grid));st.grid=st.undo.pop();paint();}
  function redo(){if(!st.redo.length)return;st.undo.push(clone(st.grid));st.grid=st.redo.pop();paint();}
  panel.appendChild(h('div',{class:'pr-row'},[h('button',{class:'nova-btn',text:'↶ Undo',onclick:undo}),h('button',{class:'nova-btn',text:'↷ Redo',onclick:redo}),h('button',{class:'nova-btn ghost',text:'Clear drawing',onclick:function(){st.undo.push(clone(st.grid));st.grid=blank();st.redo=[];st.preset='own';st.focus=[1,1];paint();}}),h('button',{class:'nova-btn ghost',text:'Reset model',onclick:function(){st.grid=model(selector.value);st.undo=[];st.redo=[];paint();}})]));
  var toggles=h('div',{class:'pr-row'});[['wire','Pencil edges'],['showDots','Isometric dots'],['showAxes','Show 3 axes'],['showNumbers','Height labels']].forEach(function(item){var x=item[0],input=h('input',{type:'checkbox','aria-label':item[1]});input.checked=st[x];input.onchange=function(){st[x]=input.checked;paint();};toggles.appendChild(h('label',{class:'f13-toggle'},[input,' '+item[1]]));});panel.appendChild(toggles);
  panel.appendChild(h('p',{class:'f13-teach-note',text:'Select Add cube and tap a dot-paper tile. Tap the same column again to stack up to four cubes. Drag across columns to draw quickly. Use arrow keys to move the gold cursor, Enter to add and Delete to erase.'}));
  st.onInspect=function(e){api.hint('Column '+(e.x+1)+', row '+(e.y+1)+' is '+e.level+' cubes high.');};paint();C._explore={state:st,preset:function(k){selector.value=k;selector.onchange();},undo:undo,redo:redo,reset:function(){st.grid=blank();paint();}};
 },
 challenge:function(panel,api,stage){var tasks=[
  {name:'Three-high column',target:put(blank(),[[1,1,3]]),q:'Draw ONE column THREE cubes high in the highlighted middle cell. No other cubes.',hint:'Place a cube on the gold marker three times. All three cubes must be in one column.',wrong:'A column means three cubes stacked in the same position, not three cubes side by side.'},
  {name:'A two-cube row',target:put(blank(),[[1,1,1],[2,1,1]]),q:'Draw a row of TWO cubes on the two highlighted neighbouring cells. Each column is ONE high.',hint:'Put one cube in each of the two marked cells.',wrong:'A row contains separate columns at the same level. Do not stack both cubes in one column.'},
  {name:'The three-step staircase',target:put(blank(),[[0,1,1],[1,1,2],[2,1,3]]),q:'Draw a three-step staircase across the highlighted row: heights ONE, TWO and THREE from left to right.',hint:'Stack one cube in the first cell, two in the next, and three in the last.',wrong:'Remember that the second and third columns contain hidden supporting cubes.'}
 ];
  var selected=0,st=state('single'),caption=h('p',{class:'f13-teach-note'}),question=h('p',{class:'pr-task'}),actions=h('div',{class:'pr-row'}),taskCount=h('span',{class:'f13-progress',text:''});
  function load(i){selected=i;st.grid=blank();st.undo=[];st.redo=[];st.preset='own';st.markedTargets=[];tasks[i].target.forEach(function(row,x){row.forEach(function(k,y){if(k)st.markedTargets.push([x,y]);});});st.focus=tasks[i].target.reduce(function(f,row,x){var y=row.findIndex(function(n){return n>0;});return f||(y>=0?[x,y]:null);},null)||[1,1];question.textContent=(i+1)+' / '+tasks.length+' · '+tasks[i].q;caption.textContent='Gold outline marks the current drawing cell. Build the required solid by tapping the grid. '+(i===2?'Some cubes will be hidden beneath other cubes.':'');st.onChange=function(){taskCount.textContent=total(st.grid)+' cubes drawn';};taskCount.textContent='0 cubes drawn';visual(stage,st,'Follow the construction instructions.','think',true);}
  panel.appendChild(question);panel.appendChild(caption);panel.appendChild(h('div',{class:'pr-row'},[h('button',{class:'nova-btn primary',text:'Check drawing',onclick:function(){var t=tasks[selected],ok=same(st.grid,t.target),need=total(t.target),got=total(st.grid),msg=ok?'Correct. Your model has '+need+' cubes in the correct columns.':got!==need?'You have '+got+' cubes; the drawing needs '+need+'. '+t.wrong:'Your total is '+got+', but their positions or heights do not match. '+t.wrong;api.check(ok,msg,{task:selected,cubes:got});if(ok&&selected<tasks.length-1){var tm=setTimeout(function(){load(selected+1);},950);api.onCleanup&&api.onCleanup(function(){clearTimeout(tm);});}}}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(tasks[selected].hint);}}),h('button',{class:'nova-btn ghost',text:'Clear drawing',onclick:function(){st.grid=blank();st.undo=[];st.redo=[];st.onChange();visual(stage,st,'Start from empty isometric paper.','think',true);}}),taskCount]));
  panel.appendChild(h('p',{class:'f13-teach-note',text:'Use Enter on the focused isometric board to add cubes and Delete to remove them. All checking uses exact cube positions and stack heights, not just the total.'}));load(0);
  C._challenge={state:st,task:function(){return selected;},load:load,check:function(){return same(st.grid,tasks[selected].target);},targets:tasks};
 }};
NOVA.bankMount({id:EN,num:'F13·03',title:'Isometric drawing studio',def:def,linked:['F0-01','F0-02','F0-03','F0-04','F0-05','F12-03','F13-01','F13-02'],spec:{purpose:'Premium isometric dot-paper construction and unit-cube drawing for Y8-059. Three mathematically exact projected axes, snapping cube builder and hidden-face-aware rendering.',params:'4 by 4 footprint · cell heights 0–4 · drawing tool · preset · pencil/solid mode · grid dots · axis labels · height labels.',presets:'One cube · joined row · 2×2 platform · three-high tower · L model · staircase · hidden-cube construction.',steps:STEPS.map(function(a){return a.name;}).join(' → ')+'. Every beat has narration and pupil prediction.',interactions:'Watch 9 explanatory stages; Guided prompts; Explore placement, stack, eraser, inspect, presets, pointer capture, fast drag, undo/redo, keyboard controls; three drawn-and-marked challenges.',traps:'Isometric ground axes are not horizontal · visible faces are not the cube count · side-by-side cubes are not a vertical tower · hidden supporting cubes must be counted.',gcse:'Transfer to plans and elevations in F13-04, scale drawings and 3D geometry.'}});
var log=document.getElementById('log'),addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();
