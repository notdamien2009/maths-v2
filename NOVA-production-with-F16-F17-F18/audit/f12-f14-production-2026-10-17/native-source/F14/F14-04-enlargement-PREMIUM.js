/* ===== F14-04 ENLARGEMENT · CANONICAL NOVA F0/F2 PREMIUM CORE ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_04_CONFIG={startMode:'watch',preset:'y7',events:['value','step','mode','hintUsed','correct'],presets:{
 y7:{label:'Year 7 · ×2 from (−3, −3)',factor:2,origin:[-3,-3],shape:[[-2,-2],[0,-2],[-2,0]]},
 maps:{label:'Scale drawings · ×3',factor:3,origin:[-4,-2],shape:[[-3,-1],[-2,-1],[-3,0]]},
 y8:{label:'Year 8 · reduce ×0.5',factor:.5,origin:[3,-2],shape:[[-3,0],[1,0],[-3,4]]},
 y9:{label:'Year 9 · ×1.5 similarity',factor:1.5,origin:[-4,-2],shape:[[-2,0],[0,0],[-2,2]]}
}});
var SIZE={desktop:{W:670,H:475,ox:335,oy:240,sp:34,minx:-6,maxx:6,miny:-5,maxy:5},mobile:{W:390,H:485,ox:195,oy:243,sp:30,minx:-6,maxx:6,miny:-5,maxy:5}};
function P(){return window.innerWidth<=500?SIZE.mobile:SIZE.desktop;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function fmt(n){return Number.isInteger(n)?String(n):String(+n.toFixed(3));}
function pair(p){return '('+fmt(p[0])+', '+fmt(p[1])+')';}
function stateOf(p){return {shape:clone(p.shape),origin:clone(p.origin),factor:p.factor,imgOff:[0,0]};}
function target(pt,st){return [st.origin[0]+st.factor*(pt[0]-st.origin[0]),st.origin[1]+st.factor*(pt[1]-st.origin[1])];}
function imagePts(st){return st.shape.map(function(pt){var q=target(pt,st);return [q[0]+st.imgOff[0],q[1]+st.imgOff[1]];});}
function coord(pr,pt){return [pr.ox+pt[0]*pr.sp,pr.oy-pt[1]*pr.sp];}
function poly(pr,pts){return 'M'+pts.map(function(p){return coord(pr,p).join(',');}).join(' L')+' Z';}
function midpoint(pts){return [pts.reduce(function(a,p){return a+p[0];},0)/pts.length,pts.reduce(function(a,p){return a+p[1];},0)/pts.length];}
function txt(p,x,y,str,role,size,anchor){return NOVA.chalkText(p,x,y,str,{role:role,size:size||18,anchor:anchor||'middle'});}
function outlineVertices(parent,pr,pts,role,prime){var c=midpoint(pts);pts.forEach(function(q,i){var xy=coord(pr,q),vx=q[0]-c[0],vy=q[1]-c[1],l=Math.hypot(vx,vy)||1,off=pr===SIZE.mobile?21:23;var x=clamp(xy[0]+vx/l*off,21,pr.W-21),y=clamp(xy[1]-vy/l*off,28,pr.H-16);txt(parent,x,y,'ABC'[i]+(prime?'′':''),role,pr===SIZE.mobile?20:19);});}
function emit(k,v){NOVA.events.emit('value',{engine:'F14-04',key:k,control:k,value:v});}
function tiles(stage,a){
if(window.NovaLessonComponent?.active){[stage,a]=window.NovaLessonComponent.args("tiles",arguments);}
var r=h('div',{class:'f14-readouts'});a.forEach(function(q){r.appendChild(NOVA.neonTile(q.label+': '+q.value,{role:q.role}));});stage.appendChild(r);}
function zoneList(pr){var a=[];for(var x=pr.minx;x<=pr.maxx;x++)for(var y=pr.miny;y<=pr.maxy;y++){var p=coord(pr,[x,y]);a.push({x:p[0]-pr.sp*.5,y:p[1]-pr.sp*.5,w:pr.sp,h:pr.sp,id:'grid:'+x+','+y,kind:'drop'});}return a;}
function mousePoint(svg,e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
function inBounds(st,pr){var all=st.shape.concat([st.origin]).concat(imagePts(st));return all.every(function(q){return q[0]>=pr.minx-.0001&&q[0]<=pr.maxx+.0001&&q[1]>=pr.miny-.0001&&q[1]<=pr.maxy+.0001;});}
function drawRays(parent,pr,st){var c=coord(pr,st.origin);st.shape.forEach(function(q,i){var pt=coord(pr,target(q,st));NOVA.neonPath(parent,'M'+c.join(',')+' L'+pt.join(','),{role:'support',width:2.1,dash:'8 9'});});return c;}
function crossCentre(parent,pr,st,large){var c=coord(pr,st.origin);NOVA.neonRing(parent,c[0],c[1],{role:'unknown',r:large?8:5,pulse:false});NOVA.neonPath(parent,'M'+(c[0]-10)+','+c[1]+' L'+(c[0]+10)+','+c[1]+' M'+c[0]+','+(c[1]-10)+' L'+c[0]+','+(c[1]+10),{role:'unknown',width:2.2});return c;}
function drawPlot(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("drawPlot",arguments);}
o=o||{};var pr=P(),small=pr===SIZE.mobile,left=pr.ox+pr.minx*pr.sp,top=pr.oy-pr.maxy*pr.sp,w=(pr.maxx-pr.minx)*pr.sp,hh=(pr.maxy-pr.miny)*pr.sp;
 var sv=S.root(pr.W,pr.H,'Enlargement coordinate grid: blue original triangle, gold centre of enlargement and purple rays to the green scaled image.');sv.classList.add('f14-plot');
 S.grid(E('g',{'aria-hidden':'true'},sv),left,top,w,hh,pr.sp);S.axes(sv,{x:left,y:top,w:w,h:hh,xmin:pr.minx,xmax:pr.maxx,ymin:pr.miny,ymax:pr.maxy,ticks:1});
 txt(sv,pr.W/2,top-28,o.topText||('Enlargement workshop  ·  scale factor '+fmt(st.factor)),'unknown',small?21:20);
 var base=st.shape,img=imagePts(st),cx=coord(pr,st.origin),rays=null;
 if(o.rays!==false){rays=E('g',{'data-maths':'rays'},sv);drawRays(rays,pr,st);}
 var org=E('g',{'data-maths':'object'},sv);NOVA.neonPath(org,poly(pr,base),{role:'given',width:4.4,fill:true});base.forEach(function(q){var p=coord(pr,q);NOVA.neonRing(org,p[0],p[1],{role:'given',r:3.2,pulse:false});});outlineVertices(org,pr,base,'given',false);
 var im=null;if(o.showImage!==false){im=E('g',{'data-maths':'image'},sv);NOVA.neonPath(im,poly(pr,img),{role:'result',width:4.6,fill:true});img.forEach(function(q){var p=coord(pr,q);NOVA.neonRing(im,p[0],p[1],{role:'result',r:3.2,pulse:false});});outlineVertices(im,pr,img,'result',true);if(o.ghost)im.style.opacity='.5';}
 var centreGroup=null;if(o.centre!==false){centreGroup=E('g',{'data-maths':'centre'},sv);crossCentre(centreGroup,pr,st,true);var lx=clamp(cx[0]-14,19,pr.W-60),ly=clamp(cx[1]+31,35,pr.H-19);txt(sv,lx,ly,'Centre', 'unknown',small?18:18,'middle');}
 // Using the unmodified shared F2 v3.6.2 drag helper with cancellation, lift, zones and spring-back.
 if(o.dragCentre&&centreGroup){var cg=E('g',{'data-maths':'centre-handle',tabindex:'0',role:'button','aria-label':'Drag the gold centre of enlargement to another grid point, or press an arrow key.'},sv);
 NOVA.neonRing(cg,cx[0],cx[1],{role:'unknown',r:8,pulse:false});var a=null,b=null;
 cg.addEventListener('pointerdown',function(e){a=mousePoint(sv,e);b=a;},true);cg.addEventListener('pointermove',function(e){if(a)b=mousePoint(sv,e);},true);cg.addEventListener('pointerup',function(e){if(a)b=mousePoint(sv,e);},true);
 NOVA.ui.svgDrag(sv,cg,{box:{x:cx[0]-19,y:cx[1]-19,w:38,h:38},zones:function(){return zoneList(pr);},onDrop:function(){if(!a||!b)return false;var d=[Math.round((b.x-a.x)/pr.sp),Math.round((a.y-b.y)/pr.sp)],next=clone(st);next.origin=[st.origin[0]+d[0],st.origin[1]+d[1]];next.imgOff=[0,0];if(!inBounds(next,pr))return false;st.origin=next.origin;st.imgOff=[0,0];emit('centre',clone(st.origin));o.update();return true;}});
 cg.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();var next=clone(st);next.origin=[st.origin[0]+d[0],st.origin[1]+d[1]];next.imgOff=[0,0];if(inBounds(next,pr)){st.origin=next.origin;st.imgOff=[0,0];emit('centre',clone(st.origin));o.update('centre');}});
 }
 if(o.dragImage&&im){var hit=E('g',{'data-maths':'image-drag',tabindex:'0',role:'button','aria-label':'Drag the green enlarged shape onto the correct position or use arrow keys. Press Escape to cancel.'},sv);
 E('path',{d:poly(pr,img),fill:'transparent',stroke:'transparent','stroke-width':14,'pointer-events':'all',css:'cursor:grab;touch-action:none'},hit);
 var pts=img.map(function(q){return coord(pr,q);}),minx=Math.min.apply(null,pts.map(function(q){return q[0]})),maxx=Math.max.apply(null,pts.map(function(q){return q[0]})),miny=Math.min.apply(null,pts.map(function(q){return q[1]})),maxy=Math.max.apply(null,pts.map(function(q){return q[1]})),a2=null,b2=null;
 var tray={x:pr.W-107,y:pr.H-38,w:96,h:27};NOVA.neonBox(sv,tray.x,tray.y,tray.w,tray.h,{role:'error',r:10,text:'Reset',size:14});var zones=zoneList(pr);zones.push({x:tray.x,y:tray.y,w:tray.w,h:tray.h,id:'tray',kind:'remove'});
 hit.addEventListener('pointerdown',function(e){a2=mousePoint(sv,e);b2=a2;},true);hit.addEventListener('pointermove',function(e){if(a2)b2=mousePoint(sv,e);},true);hit.addEventListener('pointerup',function(e){if(a2)b2=mousePoint(sv,e);},true);
 NOVA.ui.svgDrag(sv,hit,{box:{x:minx-12,y:miny-12,w:maxx-minx+24,h:maxy-miny+24},zones:function(){return zones;},onDrop:function(){if(!a2||!b2)return false;var d=[Math.round((b2.x-a2.x)/pr.sp),Math.round((a2.y-b2.y)/pr.sp)],next=clone(st);next.imgOff=[st.imgOff[0]+d[0],st.imgOff[1]+d[1]];if(!inBounds(next,pr))return false;st.imgOff=next.imgOff;emit('imageOffset',clone(st.imgOff));o.update();return true;},onRemove:function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);o.update();},removeTo:{x:tray.x+tray.w/2,y:tray.y+tray.h/2}});
 hit.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();var next=clone(st);next.imgOff=[next.imgOff[0]+d[0],next.imgOff[1]+d[1]];if(inBounds(next,pr)){st.imgOff=next.imgOff;emit('imageOffset',clone(st.imgOff));o.update('image');}});
 }
 // The centre always remains available when an overlapping green shape is on the grid.
 var handle=sv.querySelector('[data-maths="centre-handle"]');if(handle)sv.appendChild(handle);
 stage.appendChild(sv);return sv;
}
function scene(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';NOVA.cap(stage,(o.cap||'Enlargement')+' · '+(o.subtitle||('Scale factor '+fmt(st.factor))),o.tag||'live');var sv=drawPlot(stage,st,o);
 if(o.readout!==false){tiles(stage,[{label:'Factor',value:'×'+fmt(st.factor),role:'unknown'},{label:'Centre',value:pair(st.origin),role:'support'},{label:'A′',value:o.showImage===false?'?':pair(imagePts(st)[0]),role:o.showImage===false?'unknown':'result'}]);}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Draw a ray from the centre through each vertex. Multiply each distance by the same scale factor.');return sv;}
var STEPS=[
 {name:'Start with the original',pose:'explain',narration:'We are going to enlarge the blue triangle without changing its shape or its angles. First, find the original vertices.',prompt:'Which triangle is the original one?'},
 {name:'Find the centre',pose:'point-down',narration:'The gold marker shows the centre of enlargement. The enlarged vertices lie along straight lines drawn from this point.',prompt:'Where do all enlargement rays begin?'},
 {name:'Draw the rays',pose:'compare',narration:'Draw a ray from the centre through each original vertex, then continue it outward.',prompt:'Why must each ray pass through the centre and a matching vertex?'},
 {name:'Apply scale factor two',pose:'count',narration:'Scale factor two means the new distance from the centre is twice the original distance. This rule is true for all three vertices.',prompt:'If a point is three units from the centre, how far away will its image be?'},
 {name:'Watch the enlargement',pose:'point-right',narration:'The image grows away from the centre. Each corresponding vertex stays on its ray, and the triangle keeps its angles.',prompt:'Does enlargement preserve the angles?'},
 {name:'Describe the result',pose:'celebrate',narration:'An enlargement needs both a centre and a scale factor. This one has centre negative three, negative three, and scale factor two.',prompt:'State the centre and the scale factor precisely.'}
];
function renderAt(index,stage){var i=clamp(Math.round(index),0,STEPS.length-1),st=stateOf(CONFIG.presets.y7),step=STEPS[i];var sv=scene(stage,st,{cap:'Enlargement',subtitle:step.name,tag:'STEP '+(i+1)+'/'+STEPS.length,showImage:i>=4,rays:i>=2,centre:i>=1,pose:step.pose,say:[
 'Begin with the blue triangle.','The centre is our anchor point.','Every ray begins at this gold centre.','Each new point is twice as far away.','Watch the whole shape grow from the centre.','Centre and scale factor describe the enlargement.'][i]});
 if(i===2){var rays=sv.querySelector('[data-maths="rays"]');if(rays)M.pop(rays,coord(P(),st.origin)[0],coord(P(),st.origin)[1]);}
 if(i===3){var pr=P(),c=coord(pr,st.origin),dots=st.shape.map(function(q){var p=coord(pr,q);return NOVA.neonRing(sv,p[0],p[1],{role:'unknown',r:5,pulse:false});});M.tween(950,function(t){dots.forEach(function(n,j){if(!n.isConnected)return;var dx=(st.shape[j][0]-st.origin[0])*pr.sp*t,dy=-(st.shape[j][1]-st.origin[1])*pr.sp*t;n.setAttribute('transform','translate('+dx.toFixed(2)+','+dy.toFixed(2)+')');});},M.ease.inOut);}
 if(i===4){var image=sv.querySelector('[data-maths="image"]');if(image){var xy=coord(P(),st.origin);image.style.opacity='.6';M.tween(1100,function(t){if(!image.isConnected)return;var sc=(1+(st.factor-1)*t)/st.factor;image.setAttribute('transform','translate('+xy.join(' ')+') scale('+sc.toFixed(4)+') translate('+(-xy[0])+' '+(-xy[1])+')');image.style.opacity=String(.6+.4*t);},M.ease.inOut,function(){if(image&&image.isConnected){image.removeAttribute('transform');image.style.opacity='';}});}}
}
var def={id:'F14-04',title:'Enlargement',config:CONFIG,steps:STEPS,render:renderAt,
 alt:'Coordinate enlargement: original blue triangle, gold centre, purple corresponding rays and green enlarged image.',
 staticAlt:'For centre (−3, −3) and scale factor 2, A (−2, −2) maps to A′ (−1, −1), B (0, −2) maps to B′ (3, −1), and C (−2, 0) maps to C′ (−1, 3).',
 exploreIntro:'Choose a lesson preset and scale factor. Drag the gold centre or green image. Arrow keys also adjust the selected control. All image points stay on the same rays from the centre.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=stateOf(CONFIG.presets[CONFIG.preset]),presets=h('select',{class:'nova-input','aria-label':'Enlargement lesson preset'}),msg=h('div',{class:'f14-status'}),guides=true;
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){presets.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();presets.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();function repaint(focus){draw();if(focus){var e=stage.querySelector('[data-maths="'+(focus==='centre'?'centre-handle':'image-drag')+'"]');if(e)e.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();function draw(){scene(stage,st,{cap:'Explore',subtitle:'enlarge from a centre',tag:'DRAG + SCALE',showImage:true,rays:guides,centre:true,dragCentre:true,dragImage:true,pose:'point-down',say:st.imgOff[0]===0&&st.imgOff[1]===0?'Change the scale factor or move the centre to see the rays change.':'Every green vertex must sit exactly on its matching enlargement ray.',update:repaint});var ok=st.imgOff[0]===0&&st.imgOff[1]===0;msg.className='f14-status '+(ok?'okay':'');msg.textContent=ok?'Correct enlargement: scale factor '+fmt(st.factor)+' about '+pair(st.origin)+'.':'Your image is shifted by '+pair(st.imgOff)+'. Check each line from the centre to its matching vertex.';}
 window.NovaLessonComponent?.applyExploreModels();presets.onchange=function(){CONFIG.preset=presets.value;st=stateOf(CONFIG.presets[CONFIG.preset]);emit('preset',CONFIG.preset);draw();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',presets]));
 window.NovaLessonComponent?.applyExploreModels();var factor=h('select',{class:'nova-input','aria-label':'Scale factor'});window.NovaLessonComponent?.applyExploreModels();[.5,1,1.5,2,3].forEach(function(k){factor.appendChild(h('option',{value:String(k),text:'×'+fmt(k)}));});
 window.NovaLessonComponent?.applyExploreModels();factor.value=String(st.factor);window.NovaLessonComponent?.applyExploreModels();factor.onchange=function(){var next=clone(st);next.factor=+factor.value;next.imgOff=[0,0];if(inBounds(next,P())){st.factor=next.factor;st.imgOff=[0,0];emit('factor',st.factor);draw();}else{factor.value=String(st.factor);msg.className='f14-status';msg.textContent='That scale factor would place part of the image outside this coordinate grid. Choose another factor.';}};
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Scale factor ',factor]));window.NovaLessonComponent?.applyExploreModels();presets.addEventListener('change',function(){factor.value=String(st.factor);});
 window.NovaLessonComponent?.applyExploreModels();var check=h('input',{type:'checkbox'});window.NovaLessonComponent?.applyExploreModels();check.checked=true;window.NovaLessonComponent?.applyExploreModels();check.onchange=function(){guides=check.checked;draw();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},[check,' Show construction rays']));
 window.NovaLessonComponent?.applyExploreModels();function btn(label,cb){return h('button',{class:'nova-btn',text:label,onclick:cb});}
 window.NovaLessonComponent?.applyExploreModels();var move=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();[['Centre ←',[-1,0]],['Centre →',[1,0]],['Centre ↑',[0,1]],['Centre ↓',[0,-1]]].forEach(function(q){move.appendChild(btn(q[0],function(){var next=clone(st);next.origin=[st.origin[0]+q[1][0],st.origin[1]+q[1][1]];next.imgOff=[0,0];if(inBounds(next,P())){st.origin=next.origin;st.imgOff=[0,0];emit('centre',clone(st.origin));draw();}}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(move);
 window.NovaLessonComponent?.applyExploreModels();var moveImg=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();[['Image ←',[-1,0]],['Image →',[1,0]],['Image ↑',[0,1]],['Image ↓',[0,-1]]].forEach(function(q){moveImg.appendChild(btn(q[0],function(){var next=clone(st);next.imgOff=[st.imgOff[0]+q[1][0],st.imgOff[1]+q[1][1]];if(inBounds(next,P())){st.imgOff=next.imgOff;emit('imageOffset',clone(st.imgOff));draw();}}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(moveImg);
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[btn('Snap image to exact enlargement',function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);draw();}),btn('Reset preset',function(){st=stateOf(CONFIG.presets[CONFIG.preset]);factor.value=String(st.factor);draw();})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(msg);window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={state:function(){return st;},paint:draw,select:function(k){presets.value=k;presets.onchange();},moveCentre:function(d){var n=clone(st);n.origin=[st.origin[0]+d[0],st.origin[1]+d[1]];n.imgOff=[0,0];if(inBounds(n,P())){st=n;draw();}},setFactor:function(k){factor.value=String(k);factor.onchange();}};
 },
 challenge:function(panel,api,stage){var cs=stateOf(CONFIG.presets.y7);cs.imgOff=[-1,1];
 var tasks=[
 {q:'Enlarge ABC by scale factor 2 about centre (−3, −3). Drag the green image onto the exact enlarged position.',build:function(){return function(){return clone(cs.imgOff);};},check:function(v){var ok=v[0]===0&&v[1]===0;return [ok,ok?'Exactly! A′ is at (−1, −1) and each image point is twice as far from the centre.':v[0]!==0?'Check A′ horizontally: centre (−3, −3), A (−2, −2), so A′ has x = −1.':'Check A′ vertically: its enlarged y-coordinate is −1, not '+fmt(imagePts(cs)[0][1])+'.'];},hint:'Draw the ray from (−3, −3) through A (−2, −2). Double the one-right, one-up journey: A′ = (−1, −1).',solve:function(){cs.imgOff=[0,0];drawTask(0);}},
 {q:'The centre is (−4, −2). Point A = (−2, 0) is enlarged by scale factor 2. Where is A′?',build:NOVA.choiceTask([{label:'(0, 2)',value:'0,2'},{label:'(−1, 1)',value:'-1,1'},{label:'(−4, 0)',value:'-4,0'},{label:'(2, 0)',value:'2,0'}],'F14-04'),check:function(v){var ok=v==='0,2';return [ok,ok?'Yes. From the centre to A is (2, 2). Double this to (4, 4), giving A′ (0, 2).':v==='-1,1'?'That is a scale factor of 1.5, not 2.':v==='-4,0'?'You moved vertically without multiplying the complete centre-to-point vector.':v==='2,0'?'An enlargement scales the distance from the specified centre, not the coordinate numbers from zero.':'Calculate the movement from the centre first.'];},hint:'From the centre (−4, −2) to A (−2, 0): two right and two up. Double both movements.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click();}},
 {q:'The centre is (−3, −2). A = (−2, −2) becomes A′ = (0, −2). What is the scale factor?',build:NOVA.choiceTask([{label:'×2',value:'2'},{label:'×3',value:'3'},{label:'×0.5',value:'.5'},{label:'×4',value:'4'}],'F14-04'),check:function(v){var ok=v==='3';return [ok,ok?'Correct. The original distance was 1 unit and the image distance is 3 units: scale factor 3.':v==='2'?'The image is three squares from the centre, not two.':v==='.5'?'A reduction would put A′ closer to the centre, not farther away.':'Divide image distance by original distance, both measured from the centre.'];},hint:'Original distance from centre to A = 1. Image distance to A′ = 3. Divide 3 by 1.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[1])a[1].click();}},
 {q:'On a scale drawing, a line of length 4 cm is enlarged to 6 cm. What is the positive scale factor?',build:NOVA.choiceTask([{label:'×0.5',value:'.5'},{label:'×1.5',value:'1.5'},{label:'×2',value:'2'},{label:'×10',value:'10'}],'F14-04'),check:function(v){var ok=v==='1.5';return [ok,ok?'Well done. Divide new length by original length: 6 ÷ 4 = 1.5.':v==='.5'?'That makes the image smaller. Here the new length is larger.':v==='2'?'Doubling 4 cm gives 8 cm, not 6 cm.':'Scale factor equals image length divided by original length.'];},hint:'The multiplier is 6 divided by 4.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[1])a[1].click();}}
 ];
 function drawTask(k){var st=k===0?cs:k===1?{origin:[-4,-2],factor:2,shape:[[-2,0],[-1,0],[-2,1]],imgOff:[0,0]}:k===2?{origin:[-3,-2],factor:3,shape:[[-2,-2],[-2,-1],[-1,-2]],imgOff:[0,0]}:stateOf(CONFIG.presets.y9);
 scene(stage,st,{cap:'Task '+(k+1),subtitle:k===0?'position the image':k===1?'find A′':k===2?'find the scale factor':'scale a length',tag:k===0?'DRAG THE IMAGE':'THINK + CHECK',showImage:k!==1,rays:true,centre:true,dragImage:k===0,pose:k===0?'think':'question',say:k===0?'Start at the centre and double each centre-to-vertex distance.':k===1?'Scale the movement from C, not the coordinates themselves.':k===2?'Compare the two distances from the centre.':'Divide the new length by the original length.',update:function(){drawTask(k);},readout:k===0});}
 NOVA.challengeRun(panel,api,tasks,drawTask,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-04',def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"tiles":["stage","a"],"drawPlot":["stage","st","o"],"scene":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F14-04',num:'F14·04',title:'Enlargement',def:def,years:'KS3 Years 7–9: Y7-054, Y7-064, Y8-055, Y9-021. Positive scale factors only.',linked:['F0-02','F0-03','F0-04','F0-05','F14-01','F14-02','F14-03','F14-10','F14-11'],spec:{
 purpose:'Enlarge or reduce a coordinate shape from a marked centre: blue original, gold centre, purple construction rays and green scaled image. Angles remain unchanged and corresponding distances scale together.',
 params:'Centre (cx, cy), scale factor 0.5 / 1 / 1.5 / 2 / 3, polygon vertices, target coordinates, draggable centre and image offset, optional rays.',
 presets:'Year 7 Enlargement ×2; Year 7 Scale Drawings ×3; Year 8 Reduction ×0.5; Year 9 Similarity ×1.5.',
 steps:'Original → Centre → Rays through vertices → Multiply each centre-to-point distance → Shape grows along rays → Name centre and factor.',
 interactions:'Watch, Guided, Explore and Challenge. F2 drag system, exact grid snapping, red Reset tray, Escape recovery and keyboard alternatives. Four misconception-specific questions.',
 traps:'Scaling around the origin instead of specified centre; adding a constant instead of multiplying distances; reversing the factor; incorrectly changing angles; confusing reduction with enlargement.',
 gcse:'Extension: arbitrary positive fractional scale factors and finding the centre or scale factor from corresponding points.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
