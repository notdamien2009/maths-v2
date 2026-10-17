/* ===== F14-03 TRANSLATION · ORIGINAL F0/F2 PREMIUM CORE ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_03_CONFIG={startMode:'watch',preset:'y7',events:['value','step','mode','hintUsed','correct'],presets:{
 y7:{label:'Year 7 · 4 right, 2 up',vector:[4,2],shape:[[-4,-1],[-2,-1],[-3,1]]},
 y8:{label:'Year 8 · 4 left, 3 down',vector:[-4,-3],shape:[[2,2],[4,2],[3,4]]},
 down:{label:'Straight down · 3 units',vector:[0,-3],shape:[[-2,2],[0,2],[-1,4]]},
 gcse:{label:'Extension · 3 left, 2 up',vector:[-3,2],shape:[[2,-1],[4,-1],[3,1]]}
}});
var SIZE={desktop:{W:670,H:475,ox:335,oy:240,sp:34,minx:-6,maxx:6,miny:-5,maxy:5},mobile:{W:390,H:485,ox:195,oy:243,sp:27,minx:-6,maxx:6,miny:-5,maxy:5}};
function P(){return window.innerWidth<=500?SIZE.mobile:SIZE.desktop;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function stateOf(v){return {shape:clone(v.shape),vector:clone(v.vector),imgOff:[0,0]};}
function add(a,b){return [a[0]+b[0],a[1]+b[1]];}
function pair(p){return '('+p[0]+', '+p[1]+')';}
function signed(n){return (n>0?'+':'')+n;}
function vectorText(v){return '('+signed(v[0])+', '+signed(v[1])+')';}
function direction(v){return (v[0]===0?'no horizontal move':Math.abs(v[0])+(Math.abs(v[0])===1?' square ':' squares ')+(v[0]>0?'right':'left'))+'; '+(v[1]===0?'no vertical move':Math.abs(v[1])+(Math.abs(v[1])===1?' square ':' squares ')+(v[1]>0?'up':'down'));}
function coord(pr,pt){return [pr.ox+pt[0]*pr.sp,pr.oy-pt[1]*pr.sp];}
function poly(pr,pts){return 'M'+pts.map(function(p){return coord(pr,p).join(',');}).join(' L')+' Z';}
function centre(pts){return [pts.reduce(function(a,p){return a+p[0];},0)/pts.length,pts.reduce(function(a,p){return a+p[1];},0)/pts.length];}
function txt(p,x,y,str,role,size,anchor){return NOVA.chalkText(p,x,y,str,{role:role,size:size||19,anchor:anchor||'middle'});}
function labelVertices(sv,pr,pts,role,prime){var c=centre(pts);pts.forEach(function(q,i){var xy=coord(pr,q),vx=q[0]-c[0],vy=q[1]-c[1],len=Math.hypot(vx,vy)||1,dist=pr===SIZE.mobile?23:24;txt(sv,xy[0]+vx/len*dist,xy[1]-vy/len*dist,'ABC'[i]+(prime?'′':''),role,pr===SIZE.mobile?20:19);});}
function emit(k,v){NOVA.events.emit('value',{engine:'F14-03',key:k,control:k,value:v});}
function tiles(stage,arr){
if(window.NovaLessonComponent?.active){[stage,arr]=window.NovaLessonComponent.args("tiles",arguments);}
var b=h('div',{class:'f14-readouts'});arr.forEach(function(a){b.appendChild(NOVA.neonTile(a.label+': '+a.value,{role:a.role}));});stage.appendChild(b);}
function rangeZones(pr){var z=[];for(var x=pr.minx;x<=pr.maxx;x++)for(var y=pr.miny;y<=pr.maxy;y++){var p=coord(pr,[x,y]);z.push({x:p[0]-pr.sp*.52,y:p[1]-pr.sp*.52,w:pr.sp*1.04,h:pr.sp*1.04,id:'cell:'+x+','+y,kind:'drop'});}return z;}
function pointOf(sv,e){var pt=sv.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(sv.getScreenCTM().inverse());}
function inBounds(pts,vec,off,pr){return pts.every(function(q){var p=[q[0]+vec[0]+off[0],q[1]+vec[1]+off[1]];return p[0]>=pr.minx&&p[0]<=pr.maxx&&p[1]>=pr.miny&&p[1]<=pr.maxy;});}
function arrowGuide(sv,pr,shape,vec,withTrail){var c=centre(shape),end=add(c,vec),a=coord(pr,c),b=coord(pr,end);
 if(Math.hypot(b[0]-a[0],b[1]-a[1])>1){S.arrow(sv,a[0],a[1],b[0],b[1],{role:'unknown',width:4.4});}
 if(withTrail){shape.forEach(function(q){var s=coord(pr,q),t=coord(pr,add(q,vec));NOVA.neonPath(sv,'M'+s.join(',')+' L'+t.join(','),{role:'support',width:2,dash:'5 11'});});}
 // The exact displacement is already shown in the large chalk heading and the readout, leaving the grid unobscured.

 return {a:a,b:b,mid:[(a[0]+b[0])/2,(a[1]+b[1])/2]};}
function topOf(pr){return pr.oy-pr.maxy*pr.sp;}
function drawPlot(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("drawPlot",arguments);}
o=o||{};var pr=P(),left=pr.ox+pr.minx*pr.sp,top=topOf(pr),w=(pr.maxx-pr.minx)*pr.sp,height=(pr.maxy-pr.miny)*pr.sp,small=pr===SIZE.mobile;
 var sv=S.root(pr.W,pr.H,'NOVA coordinate translation: blue original triangle, gold displacement vector and green translated triangle.');sv.classList.add('f14-plot');
 S.grid(E('g',{'aria-hidden':'true'},sv),left,top,w,height,pr.sp);S.axes(sv,{x:left,y:top,w:w,h:height,xmin:pr.minx,xmax:pr.maxx,ymin:pr.miny,ymax:pr.maxy,ticks:1});
 txt(sv,pr.W/2,top-28,o.topText||('Translation workshop  ·  '+vectorText(st.vector)),'unknown',small?22:21);
 var base=st.shape,correct=base.map(function(q){return add(q,st.vector);}),real=correct.map(function(q){return add(q,st.imgOff);});
 var guide=null;
 if(o.guide!==false){guide=E('g',{'data-maths':'vector-guide'},sv);arrowGuide(guide,pr,base,st.vector,!!o.trails);}
 var original=E('g',{'data-maths':'object'},sv);NOVA.neonPath(original,poly(pr,base),{role:'given',width:4.4,fill:true});base.forEach(function(q){var pt=coord(pr,q);NOVA.neonRing(original,pt[0],pt[1],{role:'given',r:3.5,pulse:false});});labelVertices(original,pr,base,'given',false);
 var image=null;
 if(o.showImage!==false){image=E('g',{'data-maths':'image'},sv);NOVA.neonPath(image,poly(pr,real),{role:'result',width:4.6,fill:true});real.forEach(function(q){var pt=coord(pr,q);NOVA.neonRing(image,pt[0],pt[1],{role:'result',r:3.5,pulse:false});});labelVertices(image,pr,real,'result',true);if(o.ghost)image.style.opacity='.48';}
 // The vector control is a separate handle on the guide midpoint, and uses the original NOVA F2 svgDrag engine.
 if(o.dragVector&&guide){var mid=centre(base),head=add(mid,[st.vector[0]*.5,st.vector[1]*.5]),xy=coord(pr,head);
 var hg=E('g',{'data-maths':'vector-handle',tabindex:'0',role:'slider','aria-label':'Drag the gold vector handle to change the horizontal and vertical displacement; arrow keys move one unit.','aria-valuetext':vectorText(st.vector)},sv);
 NOVA.neonRing(hg,xy[0],xy[1],{role:'unknown',r:7,pulse:false});
 var a=null,b=null;hg.addEventListener('pointerdown',function(e){a=pointOf(sv,e);b=a;},true);hg.addEventListener('pointermove',function(e){if(a)b=pointOf(sv,e);},true);hg.addEventListener('pointerup',function(e){if(a)b=pointOf(sv,e);},true);
 NOVA.ui.svgDrag(sv,hg,{box:{x:xy[0]-18,y:xy[1]-18,w:36,h:36},zones:function(){return rangeZones(pr);},onDrop:function(){if(!a||!b)return false;var dx=Math.round((b.x-a.x)/pr.sp),dy=Math.round((a.y-b.y)/pr.sp);var nv=[clamp(st.vector[0]+dx,-5,5),clamp(st.vector[1]+dy,-4,4)];if(!inBounds(st.shape,nv,[0,0],pr))return false;st.vector=nv;st.imgOff=[0,0];emit('vector',clone(st.vector));o.update();return true;}});
 hg.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();var v=[clamp(st.vector[0]+d[0],-5,5),clamp(st.vector[1]+d[1],-4,4)];if(inBounds(st.shape,v,[0,0],pr)){st.vector=v;st.imgOff=[0,0];emit('vector',clone(st.vector));o.update('vector');}});
 }
 if(o.dragImage&&image){var hit=E('g',{'data-maths':'image-drag',tabindex:'0',role:'button','aria-label':'Move the green image by dragging, or use the arrow keys for one-square movements.'},sv);
 E('path',{d:poly(pr,real),fill:'transparent',stroke:'transparent','stroke-width':14,'pointer-events':'all',css:'cursor:grab;touch-action:none'},hit);
 var a2=null,b2=null,pts=real.map(function(q){return coord(pr,q);}),minx=Math.min.apply(null,pts.map(function(q){return q[0]})),maxx=Math.max.apply(null,pts.map(function(q){return q[0]})),miny=Math.min.apply(null,pts.map(function(q){return q[1]})),maxy=Math.max.apply(null,pts.map(function(q){return q[1]}));
 var tray={x:pr.W-109,y:pr.H-39,w:98,h:28};NOVA.neonBox(sv,tray.x,tray.y,tray.w,tray.h,{role:'error',r:10,text:'Reset',size:14});var zones=rangeZones(pr);zones.push({x:tray.x,y:tray.y,w:tray.w,h:tray.h,id:'tray',kind:'remove'});
 hit.addEventListener('pointerdown',function(e){a2=pointOf(sv,e);b2=a2;},true);hit.addEventListener('pointermove',function(e){if(a2)b2=pointOf(sv,e);},true);hit.addEventListener('pointerup',function(e){if(a2)b2=pointOf(sv,e);},true);
 NOVA.ui.svgDrag(sv,hit,{box:{x:minx-12,y:miny-12,w:maxx-minx+24,h:maxy-miny+24},zones:function(){return zones;},onDrop:function(){if(!a2||!b2)return false;var dx=Math.round((b2.x-a2.x)/pr.sp),dy=Math.round((a2.y-b2.y)/pr.sp);var next=[st.imgOff[0]+dx,st.imgOff[1]+dy];if(!inBounds(st.shape,st.vector,next,pr))return false;st.imgOff=next;emit('imageOffset',clone(st.imgOff));o.update();return true;},onRemove:function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);o.update();},removeTo:{x:tray.x+tray.w/2,y:tray.y+tray.h/2}});
 hit.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();var next=add(st.imgOff,d);if(inBounds(st.shape,st.vector,next,pr)){st.imgOff=next;emit('imageOffset',clone(st.imgOff));o.update('image');}});
 }
 if(typeof hg!=="undefined"&&hg&&hg.parentNode===sv)sv.appendChild(hg); // the vector knob stays accessible above the image drag surface
 stage.appendChild(sv);return sv;
}
function scene(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';NOVA.cap(stage,(o.cap||'Translation')+' · '+(o.subtitle||direction(st.vector)),o.tag||'live');var sv=drawPlot(stage,st,o);
 if(o.readout!==false){var first=add(add(st.shape[0],st.vector),st.imgOff);tiles(stage,[{label:'vector',value:vectorText(st.vector),role:'unknown'},{label:'A',value:pair(st.shape[0]),role:'given'},{label:'A′',value:o.showImage===false?'?':pair(first),role:o.showImage===false?'unknown':'result'}]);}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Slide the whole shape: every point moves by the same vector.');return sv;}
var steps=[
 {name:'Start with the shape',pose:'explain',narration:'This is our starting triangle. A translation moves the whole shape without turning or flipping it.',prompt:'Which triangle is the original?'},
 {name:'Count sideways first',pose:'count',narration:'Move four squares to the right. The horizontal change is positive four.',prompt:'Does right mean positive or negative?'},
 {name:'Count up next',pose:'point-down',narration:'Now move two squares upwards. The vertical change is positive two.',prompt:'How far do we go upwards?'},
 {name:'Trace each vertex',pose:'compare',narration:'Every vertex travels the same distance and direction. Notice the matching parallel paths.',prompt:'Do all three points travel together?'},
 {name:'Slide into place',pose:'point-right',narration:'Watch the green image slide onto its translated position. The blue shape stays in place.',prompt:'Did the triangle change its orientation?'},
 {name:'Describe the vector',pose:'celebrate',narration:'We have translated the triangle by the vector positive four, positive two. Four right, two up.',prompt:'Give the exact horizontal and vertical displacement.'}
];
function renderAt(index,stage){var i=clamp(Math.round(index),0,steps.length-1),st=stateOf(CONFIG.presets.y7),step=steps[i];var sv=scene(stage,st,{cap:'Translation',subtitle:step.name,tag:'STEP '+(i+1)+'/'+steps.length,showImage:i>=4,guide:i>=2,trails:i>=3,pose:step.pose,say:[
 'A slide never turns or flips the shape.','Start with the horizontal change.','Now count the vertical change.','Look at the three parallel journeys.','The green copy slides into place.','Write horizontal first, vertical second.'][i]});
 if(i===1||i===2||i===3){var pr=P(),base=st.shape,amt=i===1?[st.vector[0],0]:st.vector,marks=base.map(function(q){var xy=coord(pr,q);return NOVA.neonRing(sv,xy[0],xy[1],{role:'unknown',r:4.5,pulse:false});});
 M.tween(850,function(t){marks.forEach(function(g,j){if(!g.isConnected)return;g.setAttribute('transform','translate('+(amt[0]*pr.sp*t).toFixed(2)+','+(-amt[1]*pr.sp*t).toFixed(2)+')');});},M.ease.inOut);}
 if(i===4){var image=sv.querySelector('[data-maths="image"]'),pr=P();if(image)M.tween(1000,function(t){if(!image.isConnected)return;image.setAttribute('transform','translate('+((t-1)*st.vector[0]*pr.sp).toFixed(2)+','+((1-t)*st.vector[1]*pr.sp).toFixed(2)+')');image.style.opacity=String(.5+.5*t);},M.ease.inOut,function(){if(image&&image.isConnected){image.removeAttribute('transform');image.style.opacity='';}});}
}
var def={id:'F14-03',title:'Translation',config:CONFIG,steps:steps,render:renderAt,
 alt:'Interactive coordinate translation: blue original shape, gold displacement vector, a green image and neon arrows on a coordinate grid.',
 staticAlt:'The translation vector (+4, +2) takes A from (−4, −1) to (0, 1), B from (−2, −1) to (2, 1), and C from (−3, 1) to (1, 3). The shape is not turned, flipped or resized.',
 exploreIntro:'Select a translation, drag the green image or gold vector control, and compare every pair of vertices. Use the arrow keys instead of dragging if preferred.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=stateOf(CONFIG.presets[CONFIG.preset]),select=h('select',{class:'nova-input','aria-label':'Translation lesson preset'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){select.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();select.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();var msg=h('div',{class:'f14-status'}),rows=h('div',{class:'pr-row'}),guides=true;
 window.NovaLessonComponent?.applyExploreModels();function repaint(focus){draw();if(focus){var t=stage.querySelector('[data-maths="'+(focus==='vector'?'vector-handle':'image-drag')+'"]');if(t)t.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();function draw(){scene(stage,st,{cap:'Explore',subtitle:'move by a vector',tag:'DRAG + SLIDE',showImage:true,guide:guides,trails:guides,dragImage:true,dragVector:guides,pose:'point-down',say:st.imgOff.every(function(v){return v===0;})?'The whole green shape has moved by '+direction(st.vector)+'.':'Check the image: each green vertex should be the same move from its blue partner.',update:repaint});var ok=st.imgOff.every(function(v){return v===0;});msg.className='f14-status '+(ok?'okay':'');msg.textContent=ok?'Correct translation: all three vertices move by '+vectorText(st.vector)+'.':'The image is displaced by '+vectorText(st.imgOff)+' from the correct translation. Move it back to align.';}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=function(){CONFIG.preset=select.value;st=stateOf(CONFIG.presets[select.value]);emit('preset',CONFIG.preset);draw();};
 window.NovaLessonComponent?.applyExploreModels();var check=h('input',{type:'checkbox'});window.NovaLessonComponent?.applyExploreModels();check.checked=true;window.NovaLessonComponent?.applyExploreModels();check.onchange=function(){guides=check.checked;draw();};
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',select]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},[check,' Show the vector and parallel travel paths']));
 window.NovaLessonComponent?.applyExploreModels();function btn(label,action){return h('button',{class:'nova-btn',text:label,onclick:action});}
 window.NovaLessonComponent?.applyExploreModels();[['← image',[-1,0]],['image →',[1,0]],['image ↑',[0,1]],['image ↓',[0,-1]]].forEach(function(q){rows.appendChild(btn(q[0],function(){var next=add(st.imgOff,q[1]);if(inBounds(st.shape,st.vector,next,P())){st.imgOff=next;emit('imageOffset',clone(next));draw();}}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(rows);
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[btn('Snap to vector',function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);draw();}),btn('vector ←',function(){moveVector([-1,0]);}),btn('vector →',function(){moveVector([1,0]);}),btn('vector ↑',function(){moveVector([0,1]);}),btn('vector ↓',function(){moveVector([0,-1]);})]));
 window.NovaLessonComponent?.applyExploreModels();function moveVector(d){var v=add(st.vector,d);if(inBounds(st.shape,v,[0,0],P())){st.vector=v;st.imgOff=[0,0];emit('vector',clone(v));draw();}}
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(msg);window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={state:function(){return st;},paint:draw,select:function(k){select.value=k;select.onchange();},moveVector:moveVector};
 },
 challenge:function(panel,api,stage){var cs=stateOf(CONFIG.presets.y7);cs.imgOff=[-2,1];
 var tasks=[
 {q:'Translate ABC 4 squares right and 2 squares up. Drag the green image into the correct position.',build:function(){return function(){return clone(cs.imgOff);};},check:function(v){var ok=v[0]===0&&v[1]===0;return [ok,ok?'Excellent! Every vertex has travelled four right and two up.':v[0]!==0?'Check the horizontal distance between A and A′. All vertices must move four squares right.':'Check the vertical distance. A translation of (+4, +2) moves the image two squares up.'];},hint:'Point A starts at (−4, −1), so A′ must finish at (0, 1). Use the parallel displacement paths.',solve:function(){cs.imgOff=[0,0];drawTask(0);}},
 {q:'Point A is at (−2, 1). Translate it by vector (+4, −3). Where is A′?',build:NOVA.choiceTask([{label:'(−6, 4)',value:'-6,4'},{label:'(2, 4)',value:'2,4'},{label:'(2, −2)',value:'2,-2'},{label:'(−2, −2)',value:'-2,-2'}],'F14-03'),check:function(v){var ok=v==='2,-2';return [ok,ok?'Yes. Add four to x and subtract three from y. A′ is (2, −2).':v==='-6,4'?'That reverses both directions: the vector goes right and down.':v==='2,4'?'You moved right correctly, but went up instead of down.':v==='-2,-2'?'You changed the y-coordinate but forgot the four-square move to the right.':'Apply the vector to each coordinate.'];},hint:'Add 4 to −2 for the new x coordinate. Subtract 3 from 1 for the new y coordinate.',solve:function(ctl){var x=ctl.querySelectorAll('button');if(x[2])x[2].click();}},
 {q:'A moves from (3, 2) to A′ = (−1, −1). Which translation vector describes the movement?',build:NOVA.choiceTask([{label:'(−4, +3)',value:'-4,3'},{label:'(+4, −3)',value:'4,-3'},{label:'(−4, −3)',value:'-4,-3'},{label:'(−3, −4)',value:'-3,-4'}],'F14-03'),check:function(v){var ok=v==='-4,-3';return [ok,ok?'Correct. The x coordinate falls by four and y falls by three: (−4, −3).':v==='-4,3'?'The vertical direction is wrong; A′ is below A.':v==='4,-3'?'The horizontal direction is wrong; A′ is left of A.':v==='-3,-4'?'The distances are reversed. Horizontal displacement is written first.':'Subtract the original coordinate from the image coordinate.'];},hint:'For horizontal change, −1 minus 3 is −4. For vertical change, −1 minus 2 is −3.',solve:function(ctl){var x=ctl.querySelectorAll('button');if(x[2])x[2].click();}}
 ];
 function drawTask(k){var st=k===0?cs:k===1?{shape:[[-2,1],[-1,1],[-2,2]],vector:[4,-3],imgOff:[0,0]}:{shape:[[3,2],[4,2],[3,3]],vector:[-4,-3],imgOff:[0,0]};scene(stage,st,{cap:'Task '+(k+1),subtitle:k===2?'describe the translation':direction(st.vector),tag:k===0?'DRAG THE IMAGE':k===1?'FIND A′':'FIND THE VECTOR',topText:k===2?'From A to A′  ·  find the vector':null,showImage:k!==1,guide:k!==2,trails:k===0,dragImage:k===0,pose:k===0?'think':'question',say:k===0?'Every vertex needs the same four-right, two-up move.':k===1?'Horizontal first, then vertical.':'Subtract starting coordinates from finishing coordinates.',update:function(){drawTask(k);},readout:k===0});}
 NOVA.challengeRun(panel,api,tasks,drawTask,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-03',def,{models:{},tables:{"steps":()=>steps},draws:{"tiles":["stage","arr"],"drawPlot":["stage","st","o"],"scene":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F14-03',num:'F14·03',title:'Translation',def:def,years:'Year 7 and Year 8; GCSE vector notation extension.',linked:['F0-02','F0-03','F0-04','F14-01','F14-02','F14-05','F14-12'],spec:{
 purpose:'Interactive coordinate translation: a neon blue starting shape, gold displacement vector, parallel travel paths and a green image which preserves orientation and size.',
 params:'Integer vector (dx, dy), three source vertices, exact grid snapping, draggable image offset, draggable vector handle and configurable guide visibility.',
 presets:'Year 7: (+4,+2). Year 8: (−4,−3). Straight down: (0,−3). GCSE extension: (−3,+2).',
 steps:'Original shape → Count horizontal movement → Count vertical movement → Trace corresponding vertices → Slide entire shape → Describe the vector.',
 interactions:'Watch / Guided / Explore / Challenge. F2 pointer-capture draggable image, vector handle, grid snap, Reset tray, keyboard alternative and exact checks. Three challenge tasks.',
 traps:'Swapping dx and dy, reversing a sign, moving only one coordinate, mistaking translation for reflection or rotation, changing the triangle size.',
 gcse:'Column-vector language, signed displacements, describing transformations from corresponding coordinate pairs.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
