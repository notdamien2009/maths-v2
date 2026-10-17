/* ===== F14-01 REFLECTION: built on the supplied NOVA F0/F2 core ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var C=window.NovaV2Integration.configuration(window.NOVA_F14_01_CONFIG={
  startMode:'watch',preset:'y7',events:['value','step','mode','hintUsed','correct'],
  presets:{
    y7:{label:'Year 7 · reflect in the y-axis',kind:'vertical',k:0,shape:[[-4,1],[-2,1],[-3,3]]},
    x1:{label:'Year 8 · reflect in x = 1',kind:'vertical',k:1,shape:[[-4,1],[-2,1],[-3,3]]},
    xaxis:{label:'Reflection in the x-axis',kind:'horizontal',k:0,shape:[[-4,1],[-2,1],[-3,3]]},
    diag:{label:'Extension · reflect in y = x',kind:'diagonal',k:0,shape:[[2,-3],[3,-3],[2,-2]]}
  }
});
var WIDES={desktop:{W:670,H:475,ox:335,oy:240,sp:34,minx:-6,maxx:6,miny:-5,maxy:5},mobile:{W:390,H:485,ox:195,oy:243,sp:27,minx:-6,maxx:6,miny:-5,maxy:5}};
function P(){return window.innerWidth<=500?WIDES.mobile:WIDES.desktop;}
function cp(v){return JSON.parse(JSON.stringify(v));}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function refl(pt,kind,k){if(kind==='vertical')return [2*k-pt[0],pt[1]];if(kind==='horizontal')return [pt[0],2*k-pt[1]];return [pt[1],pt[0]];}
function desc(kind,k){return kind==='vertical'?'x = '+k:kind==='horizontal'?'y = '+k:'y = x';}
function fmtPair(q){return '('+q[0]+', '+q[1]+')';}
function env(src){return {shape:cp(src.shape),kind:src.kind,k:src.k,imgOff:[0,0]};}
function coord(pr,pt){return [pr.ox+pt[0]*pr.sp,pr.oy-pt[1]*pr.sp];}
function polygon(pr,pts){return 'M'+pts.map(function(pt){var q=coord(pr,pt);return q[0]+','+q[1];}).join(' L')+' Z';}
function txt(p,x,y,str,role,size,anchor){return NOVA.chalkText(p,x,y,str,{role:role,size:size||18,anchor:anchor||'middle'});}
function emit(key,val){NOVA.events.emit('value',{engine:'F14-01',key:key,control:key,value:val});}
function info(stage,items){var box=h('div',{class:'f14-readouts'});items.forEach(function(x){box.appendChild(NOVA.neonTile(x.label+': '+x.value,{role:x.role}));});stage.appendChild(box);}
function blink(sv,x,y){M.flash(sv,x,y,'result',24);}
function mirrorPath(pr,kind,k){
 if(kind==='vertical'){var x=pr.ox+k*pr.sp;return ['M'+x+','+(pr.oy+pr.miny*pr.sp*-1)+' L'+x+','+(pr.oy-pr.maxy*pr.sp),x,pr.oy];}
 if(kind==='horizontal'){var y=pr.oy-k*pr.sp;return ['M'+(pr.ox+pr.minx*pr.sp)+','+y+' L'+(pr.ox+pr.maxx*pr.sp)+','+y,pr.ox,y];}
 return ['M'+(pr.ox+pr.minx*pr.sp)+','+(pr.oy-pr.minx*pr.sp)+' L'+(pr.ox+pr.maxx*pr.sp)+','+(pr.oy-pr.maxx*pr.sp),pr.ox,pr.oy];
}
function plot(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("plot",arguments);}
o=o||{};var pr=P(),sv=S.root(pr.W,pr.H,'A neon coordinate grid showing a triangle, the mirror line '+desc(st.kind,st.k)+' and its reflection.'),left=pr.ox+pr.minx*pr.sp,top=pr.oy-pr.maxy*pr.sp,w=(pr.maxx-pr.minx)*pr.sp,he=(pr.maxy-pr.miny)*pr.sp;
 sv.classList.add('f14-plot');
 var background=E('g',{'aria-hidden':'true'},sv);S.grid(background,left,top,w,he,pr.sp);
 var A=S.axes(sv,{x:left,y:top,w:w,h:he,xmin:pr.minx,xmax:pr.maxx,ymin:pr.miny,ymax:pr.maxy,ticks:1});
 // The supplied core draws axes and numbers. All additions use its approved neon/chalk primitives.
 var axisLabel=pr===WIDES.mobile?19:18;
 txt(sv,pr.W/2,top-28,'Mirror workshop  ·  '+desc(st.kind,st.k),'unknown',pr===WIDES.mobile?22:21);
 var base=st.shape,expected=base.map(function(q){return refl(q,st.kind,st.k);}),real=expected.map(function(q){return [q[0]+st.imgOff[0],q[1]+st.imgOff[1]];});
 var d0=polygon(pr,base),d1=polygon(pr,real);
 var ghost=E('g',{'aria-hidden':'true'},sv);
 if(o.showMirror!==false){
  var path=mirrorPath(pr,st.kind,st.k);var lg=E('g',{'data-maths':'mirror','aria-label':'Mirror line '+desc(st.kind,st.k)},sv);
  NOVA.neonPath(lg,path[0],{role:'unknown',width:4,dash:'9 8'});
  if(st.kind!=='diagonal'){
   var anchors=[];for(var kk=-1;kk<=1;kk++){
    if(st.kind==='vertical')anchors.push({x:pr.ox+kk*pr.sp-pr.sp*.42,y:top,w:pr.sp*.84,h:he,id:'mirror:'+kk,kind:'drop'});
    else anchors.push({x:left,y:pr.oy-kk*pr.sp-pr.sp*.42,w:w,h:pr.sp*.84,id:'mirror:'+kk,kind:'drop'});
   }
   if(o.dragMirror){
    lg.setAttribute('role','slider');lg.setAttribute('tabindex','0');lg.setAttribute('aria-label','Drag mirror line. Arrow keys change its position.');lg.setAttribute('aria-valuemin','-1');lg.setAttribute('aria-valuemax','1');lg.setAttribute('aria-valuenow',String(st.k));
    NOVA.ui.svgDrag(sv,lg,{box:st.kind==='vertical'?{x:path[1]-10,y:top,w:20,h:he}:{x:left,y:path[2]-10,w:w,h:20},zones:function(){return anchors;},onDrop:function(id){st.k=+id.split(':')[1];st.imgOff=[0,0];emit('mirror',desc(st.kind,st.k));o.update();return true;}});
    lg.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();var delta=(e.key==='ArrowLeft'||e.key==='ArrowDown')?-1:1;st.k=clamp(st.k+delta,-1,1);st.imgOff=[0,0];emit('mirror',desc(st.kind,st.k));o.update('mirror');}});
   }
  }
 }
 // Gold given shape with filled glass face and lifted neon tube edges.
 var given=E('g',{'data-maths':'object'},sv);NOVA.neonPath(given,d0,{role:'given',width:4.4,fill:true});
 var realGroup=null;
 if(o.guides){base.forEach(function(q,i){var a=coord(pr,q),b=coord(pr,expected[i]);NOVA.neonPath(ghost,'M'+a[0]+','+a[1]+' L'+b[0]+','+b[1],{role:'support',width:2,dash:'5 8'});var mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(st.kind!=='diagonal')NOVA.neonRing(ghost,mid[0],mid[1],{role:'unknown',r:2.8,pulse:false});});}
 if(o.showImage!==false){
  realGroup=E('g',{'data-maths':'image'},sv);
  var face=NOVA.neonPath(realGroup,d1,{role:'result',width:4.8,fill:true});
  if(o.translucent){realGroup.style.opacity='.48';}
 }
 var labSize=pr===WIDES.mobile?21:19;
 if(o.labels!==false){base.forEach(function(q,i){var xy=coord(pr,q),sign=q[0]<0?-1:1;txt(sv,xy[0]+(sign<0?-13:0),xy[1]+(q[1]>=0?-17:23),'ABC'[i],'given',labSize);});
 if(o.showImage!==false)real.forEach(function(q,i){var xy=coord(pr,q);txt(realGroup,xy[0]+(q[0]>0?14:-14),xy[1]+(q[1]>=0?-17:25),'ABC'[i]+'′','result',labSize);});}
 if(o.showImage!==false){real.forEach(function(q){var xy=coord(pr,q);NOVA.neonRing(realGroup,xy[0],xy[1],{role:'result',r:3.5,pulse:false});});}
 if(o.showImage!==false&&o.dragImage){
   var bxs=real.map(function(q){return coord(pr,q);}),loX=Math.min.apply(null,bxs.map(function(q){return q[0]})),hiX=Math.max.apply(null,bxs.map(function(q){return q[0]})),loY=Math.min.apply(null,bxs.map(function(q){return q[1]})),hiY=Math.max.apply(null,bxs.map(function(q){return q[1]}));
   // Single marker over the whole movable image uses the exact shared pointer kit.
   var hit=E('g',{'data-maths':'image-drag',tabindex:'0',role:'button','aria-label':'Move the green reflected triangle. Arrow keys move it one grid square.'},sv);
   NOVA.neonPath(hit,d1,{role:'result',width:2.3,fill:true});
   var start=null,last=null,zones=[];for(var xx=pr.minx;xx<=pr.maxx;xx++)for(var yy=pr.miny;yy<=pr.maxy;yy++){var qq=coord(pr,[xx,yy]);zones.push({x:qq[0]-pr.sp*.54,y:qq[1]-pr.sp*.54,w:pr.sp*1.08,h:pr.sp*1.08,id:'cell:'+xx+','+yy,kind:'drop'});}
   // The red tray is a reset/drop-away target, not a second mathematics row.
   var tr={x:pr.W-105,y:pr.H-40,w:93,h:30};NOVA.neonBox(sv,tr.x,tr.y,tr.w,tr.h,{role:'error',r:10,text:'Reset',size:14});zones.push({x:tr.x,y:tr.y,w:tr.w,h:tr.h,id:'tray',kind:'remove'});
   function pt(e){var p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(sv.getScreenCTM().inverse());}
   hit.addEventListener('pointerdown',function(e){start=pt(e);last=start;},true);
   hit.addEventListener('pointermove',function(e){if(start)last=pt(e);},true);
   hit.addEventListener('pointerup',function(e){if(start)last=pt(e);},true);
   NOVA.ui.svgDrag(sv,hit,{box:{x:loX-12,y:loY-12,w:hiX-loX+24,h:hiY-loY+24},zones:function(){return zones;},onDrop:function(id){if(!start||!last)return false;var dx=Math.round((last.x-start.x)/pr.sp),dy=Math.round((start.y-last.y)/pr.sp);st.imgOff=[clamp(st.imgOff[0]+dx,-4,4),clamp(st.imgOff[1]+dy,-4,4)];emit('imageOffset',st.imgOff.slice());o.update();return true;},onRemove:function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);o.update();},removeTo:{x:tr.x+tr.w/2,y:tr.y+tr.h/2}});
   hit.addEventListener('keydown',function(e){var del={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!del)return;e.preventDefault();st.imgOff=[clamp(st.imgOff[0]+del[0],-4,4),clamp(st.imgOff[1]+del[1],-4,4)];emit('imageOffset',st.imgOff.slice());o.update('image');});
 }
 stage.appendChild(sv);
 return sv;
}
function createScene(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("createScene",arguments);}
o=o||{};stage.innerHTML='';
 NOVA.cap(stage,(o.cap||'Reflection')+' · '+(o.subtitle||desc(st.kind,st.k)),o.tag||'live');
 var sv=plot(stage,st,o);
 if(o.readout!==false)info(stage,[{label:'mirror',value:desc(st.kind,st.k),role:'unknown'},{label:'A',value:fmtPair(st.shape[0]),role:'given'}, {label:'A′',value:o.showImage===false?'?':fmtPair(refl(st.shape[0],st.kind,st.k).map(function(x,i){return x+st.imgOff[i]})),role:o.showImage===false?'unknown':'result'}]);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'The image matches the original across the mirror.');return sv;
}
var steps=[
 {name:'Meet the shape',mood:'neutral',pose:'explain',narration:'Look at triangle A B C on our coordinate grid. We will reflect it in the y-axis.',prompt:'Before moving anything, point to vertex A.'},
 {name:'The mirror line',mood:'focus',pose:'point-down',narration:'The mirror line is x equals zero. The image will be on the other side, equally far from this line.',prompt:'Which side of the mirror will the new triangle appear?'},
 {name:'Trace every vertex',mood:'focus',pose:'count',narration:'Each vertex travels straight across, at right angles to the mirror. It lands the same distance away.',prompt:'If a point is four squares left, where does it land?'},
 {name:'Reveal the image',mood:'neutral',pose:'compare',narration:'The green shape is a reflection, not a slide. It faces the opposite way but keeps its size and angles.',prompt:'What changes, and what stays the same?'},
 {name:'Compare coordinates',mood:'think',pose:'point-right',narration:'Across the y-axis, the x coordinate changes sign, and the y coordinate stays the same.',prompt:'What happens to the x coordinate of A?'},
 {name:'Describe it precisely',mood:'cheer',pose:'celebrate',narration:'We reflected triangle A B C in the line x equals zero. Always name the mirror line when describing a reflection.',prompt:'Say the full mathematical description aloud.'}
];
var defaultState=function(){return env(C.presets.y7);};
function renderAt(index,stage){var i=clamp(Math.round(index),0,steps.length-1),st=defaultState(),poses=steps[i];var showMirror=i>=1,showImage=i>=3,showGuides=i>=2;
 var sv=createScene(stage,st,{cap:'Reflection',subtitle:poses.name,tag:'STEP '+(i+1)+'/'+steps.length,showMirror:showMirror,showImage:showImage,guides:showGuides,pose:poses.pose,say:['This triangle is our starting shape.','The mirror sits at x = 0.','Follow each vertex across.','The new green triangle is its reflection.','A and A′ are equally far from the line.','Describe the reflection by naming its mirror line.'][i]});
 if(i===2){ // three mathematically exact perpendicular point traces; core motion only
  var pr=P(),pts=st.shape,refs=pts.map(function(q){return refl(q,st.kind,st.k);}),marks=[];
  pts.forEach(function(q){var xy=coord(pr,q);marks.push(NOVA.neonRing(sv,xy[0],xy[1],{role:'support',r:4.5,pulse:false}));});
  M.tween(980,function(t){marks.forEach(function(g,n){if(!g.isConnected)return;var a=coord(pr,pts[n]),b=coord(pr,refs[n]);g.setAttribute('transform','translate('+((b[0]-a[0])*t).toFixed(1)+','+((b[1]-a[1])*t).toFixed(1)+')');});},M.ease.inOut);
 }
 if(i===3){ // a genuine flip about the exact y-axis, rather than a translation
  var pr=P(),shape=sv.querySelector('[data-maths="image"]');
  if(shape)M.tween(960,function(t){if(!shape.isConnected)return;var q=-1+2*t,mirrorX=pr.ox+st.k*pr.sp;shape.setAttribute('transform','translate('+((1-q)*mirrorX).toFixed(2)+',0) scale('+q.toFixed(4)+',1)');shape.style.opacity=String(.48+.52*t);},M.ease.inOut,function(){if(shape&&shape.isConnected){shape.removeAttribute('transform');shape.style.opacity='';}});
 }
}

var def={id:'F14-01',title:'Reflection',config:C,steps:steps,render:renderAt,
 alt:'A glass-neon coordinate grid, the original blue triangle, a gold mirror line, violet perpendicular construction guides and a reflected green triangle. The line and image can be moved and snap to the coordinate grid.',
 staticAlt:'Reflection in x = 0 sends (−4, 1) to (4, 1), (−2, 1) to (2, 1), and (−3, 3) to (3, 3). A reflection preserves lengths and angles and reverses orientation.',
 exploreIntro:'Move the mirror line or reflected triangle. Use arrow keys after focusing the diagram, or use the arrow controls. Reflections preserve size and equal perpendicular distance.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=env(C.presets[C.preset]);
  window.NovaLessonComponent?.applyExploreModels();var preset=h('select',{class:'nova-input','aria-label':'Reflection lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){preset.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
  window.NovaLessonComponent?.applyExploreModels();var count=h('div',{class:'f14-status'}),sides=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();var guide=true;
  window.NovaLessonComponent?.applyExploreModels();function upd(focus){paint();if(focus){var x=stage.querySelector('[data-maths="'+(focus==='mirror'?'mirror':'image-drag')+'"]');if(x)x.focus({preventScroll:true});}}
  window.NovaLessonComponent?.applyExploreModels();function paint(){createScene(stage,st,{cap:'Explore',subtitle:'reflection',tag:'DRAG + SNAP',guides:guide,showImage:true,dragImage:true,dragMirror:st.kind!=='diagonal',pose:'point-down',say:st.imgOff[0]===0&&st.imgOff[1]===0?'Notice the equal distance on both sides.':'Is the green triangle still the same distance from the mirror?',update:upd});var okay=st.imgOff.every(function(q){return q===0});count.textContent=okay?'The green image is correctly reflected.':'The green image has moved: '+st.imgOff[0]+' horizontally, '+st.imgOff[1]+' vertically.';count.className='f14-status '+(okay?'okay':'');}
  window.NovaLessonComponent?.applyExploreModels();preset.onchange=function(){C.preset=preset.value;st=env(C.presets[C.preset]);emit('preset',C.preset);paint();};
  window.NovaLessonComponent?.applyExploreModels();var guideBox=h('input',{type:'checkbox'});window.NovaLessonComponent?.applyExploreModels();guideBox.checked=true;window.NovaLessonComponent?.applyExploreModels();guideBox.onchange=function(){guide=guideBox.checked;paint();};
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',preset]));
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},[guideBox,' Show equal-distance guides']));
  window.NovaLessonComponent?.applyExploreModels();function btn(t,fn){return h('button',{class:'nova-btn',text:t,onclick:fn});}
  window.NovaLessonComponent?.applyExploreModels();sides.appendChild(btn('← image',function(){st.imgOff[0]=clamp(st.imgOff[0]-1,-4,4);emit('imageOffset',st.imgOff.slice());paint();}));window.NovaLessonComponent?.applyExploreModels();sides.appendChild(btn('image →',function(){st.imgOff[0]=clamp(st.imgOff[0]+1,-4,4);emit('imageOffset',st.imgOff.slice());paint();}));
  window.NovaLessonComponent?.applyExploreModels();sides.appendChild(btn('image ↑',function(){st.imgOff[1]=clamp(st.imgOff[1]+1,-4,4);emit('imageOffset',st.imgOff.slice());paint();}));window.NovaLessonComponent?.applyExploreModels();sides.appendChild(btn('image ↓',function(){st.imgOff[1]=clamp(st.imgOff[1]-1,-4,4);emit('imageOffset',st.imgOff.slice());paint();}));
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(sides);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[btn('Snap to reflection',function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);paint();}),btn('Mirror −1',function(){st.k=clamp(st.k-1,-1,1);st.imgOff=[0,0];emit('mirror',desc(st.kind,st.k));paint();}),btn('Mirror +1',function(){st.k=clamp(st.k+1,-1,1);st.imgOff=[0,0];emit('mirror',desc(st.kind,st.k));paint();})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(count);
  window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){return st;},paint:paint,select:function(k){preset.value=k;preset.onchange();}};
 },
 challenge:function(panel,api,stage){var challengeState={kind:'vertical',k:0,shape:cp(C.presets.y7.shape),imgOff:[-2,1]};
  var tasks=[
   {q:'The mirror is x = 0. Drag the green triangle to its exact reflected position. You can also use the arrow keys.',build:function(){return function(){return challengeState.imgOff.slice();};},check:function(v){var yes=v[0]===0&&v[1]===0;return [yes,yes?'Exactly! All corresponding vertices match their reflected positions.':v[0]!==0?'Check horizontal distances to the mirror line. Every point must be equally far on the other side.':'Check the height. Reflection in a vertical mirror keeps each y coordinate unchanged.'];},hint:'Reflect in x = 0: the x coordinate changes sign, but the y coordinate stays the same.',solve:function(){challengeState.imgOff=[0,0];paintCh(0);}},
   {q:'Point A is (−3, 2). Reflect A in the line x = 1. Which is A′?',build:NOVA.choiceTask([{label:'(5, 2)',value:'5,2'},{label:'(3, 2)',value:'3,2'},{label:'(−1, 2)',value:'-1,2'},{label:'(5, −2)',value:'5,-2'}],'F14-01'),check:function(v){var ok=v==='5,2';return [ok,ok?'Yes! x′ = 2 × 1 − (−3) = 5; y stays 2.':v==='3,2'?'You reflected in the y-axis, but the mirror here is x = 1.':v==='-1,2'?'You translated two squares. A reflection crosses the mirror and lands equally far away.':v==='5,-2'?'A vertical mirror does not change the y coordinate.':'Choose the position the same distance across x = 1.'];},hint:'The point is four squares left of x = 1, so it must be four squares to its right.',solve:function(ctl){var b=ctl.querySelectorAll('button');if(b[0])b[0].click();}},
   {q:'Point A is (2, −3). Reflect A in y = x. Where is A′?',build:NOVA.choiceTask([{label:'(−2, 3)',value:'-2,3'},{label:'(3, −2)',value:'3,-2'},{label:'(−3, 2)',value:'-3,2'},{label:'(2, 3)',value:'2,3'}],'F14-01'),check:function(v){var ok=v==='-3,2';return [ok,ok?'Yes! Reflecting in y = x swaps the two coordinates.':v==='-2,3'?'That changes both signs. The mirror y = x swaps x and y instead.':v==='3,-2'?'The coordinates are swapped, but not in the same order: (y, x) is (−3, 2).':v?'Do not just change a sign: interchange the coordinate positions.':'Choose the coordinates after swapping x and y.'];},hint:'For y = x, (x, y) becomes (y, x).',solve:function(ctl){var b=ctl.querySelectorAll('button');if(b[2])b[2].click();}}
  ];
  function paintCh(k){var st=k===0?challengeState:k===1?{kind:'vertical',k:1,shape:[[-3,2],[-2,2],[-3,3]],imgOff:[0,0]}:{kind:'diagonal',k:0,shape:[[2,-3],[3,-3],[2,-2]],imgOff:[0,0]};createScene(stage,st,{cap:'Task '+(k+1),subtitle:desc(st.kind,st.k),tag:k===0?'DRAG THE IMAGE':'FIND THE IMAGE',showImage:k===0,dragImage:k===0,guides:k===0,pose:k===0?'think':'question',say:k===0?'Place every green vertex exactly opposite its blue partner.':'Measure the mirror distance before choosing.',update:function(){paintCh(k);},readout:k===0});}
  NOVA.challengeRun(panel,api,tasks,paintCh,C);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-01',def,{models:{},tables:{"steps":()=>steps},draws:{"plot":["stage","st","o"],"createScene":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F14-01',num:'F14·01',title:'Reflection',def:def,years:'KS3 Years 7–9; GCSE Foundation and Higher extensions.',linked:['F0-02','F0-03','F0-04','F0-14','F14-02','F14-03'],
 spec:{purpose:'Premium interactive reflection lab for coordinate grids: original shape, mirror line, reflected image, equal-distance construction lines. Includes draggable mirror handle, reflected image and mathematical challenge checking.',
 params:'Mirror line type: vertical (x = k), horizontal (y = k), diagonal (y = x); integer k; polygon vertices; optional perpendicular construction guides; position of reflected image.',
 presets:'Year 7: y-axis; Year 8: x = 1; additional x-axis; GCSE extension: y = x.',
 steps:'Meet the shape → The mirror line → Trace every vertex → Reveal the image → Compare coordinates → Describe it precisely. Sir Bob narration and Guided prompts.',
 interactions:'Watch / Guided animated steps; Explore: F2 shared core SVG drag-snap for image and mirror; keyboard controls, image position reset; Challenge: place reflected polygon, solve x = 1 coordinate reflection, solve y = x coordinate reflection. Events: value, correct, step, hintUsed.',
 traps:'Translation mistaken for reflection; wrong mirror line; y changes in vertical reflection; changing signs rather than swapping coordinates for y = x.',
 gcse:'Coordinate reflections in y = x, and named lines parallel to axes.'}});
var log=document.getElementById('log');if(log){var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
