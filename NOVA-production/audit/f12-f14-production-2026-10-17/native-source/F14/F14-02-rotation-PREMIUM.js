/* ===== F14-02 ROTATION: NOVA F0/F2 premium core + shared stage and dock ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_02_CONFIG={
 startMode:'watch',preset:'y7',events:['value','step','mode','hintUsed','correct'],
 presets:{
  y7:{label:'Year 7 · 90° anticlockwise about (0, 0)',angle:90,centre:[0,0],shape:[[1,1],[3,1],[2,3]]},
  y8:{label:'Year 8 · 90° clockwise about (1, −1)',angle:-90,centre:[1,-1],shape:[[2,0],[4,0],[3,2]]},
  half:{label:'Half-turn · 180° about the origin',angle:180,centre:[0,0],shape:[[1,1],[3,1],[2,3]]},
  gcse:{label:'Extension · 270° anticlockwise about (−1, 1)',angle:270,centre:[-1,1],shape:[[0,2],[2,2],[1,4]]}
 }
});
var SIZE={desktop:{W:670,H:475,ox:335,oy:240,sp:34,minx:-6,maxx:6,miny:-5,maxy:5},mobile:{W:390,H:485,ox:195,oy:243,sp:27,minx:-6,maxx:6,miny:-5,maxy:5}};
function P(){return window.innerWidth<=500?SIZE.mobile:SIZE.desktop;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function stateOf(v){return {shape:clone(v.shape),centre:clone(v.centre),angle:v.angle,imgOff:[0,0]};}
function rot(pt,c,a){var ang=(((a%360)+360)%360),x=pt[0]-c[0],y=pt[1]-c[1],out;
 if(ang===0)out=[x,y];else if(ang===90)out=[-y,x];else if(ang===180)out=[-x,-y];else if(ang===270)out=[y,-x];else{var d=a*Math.PI/180;out=[Math.round(x*Math.cos(d)-y*Math.sin(d)),Math.round(x*Math.sin(d)+y*Math.cos(d))];}
 return [out[0]+c[0],out[1]+c[1]];}
function angleText(a){return a===-90?'90° clockwise':a===270?'270° anticlockwise':a===180?'180° half-turn':a+'° anticlockwise';}
function shortAngle(a){return a===-90?'90° CW':a===270?'270° ACW':a===180?'180°':'90° ACW';}
function pair(q){return '('+q[0]+', '+q[1]+')';}
function coord(pr,pt){return [pr.ox+pt[0]*pr.sp,pr.oy-pt[1]*pr.sp];}
function poly(pr,pts){return 'M'+pts.map(function(p){var xy=coord(pr,p);return xy.join(',');}).join(' L')+' Z';}
function txt(p,x,y,str,role,size,anchor){return NOVA.chalkText(p,x,y,str,{role:role,size:size||19,anchor:anchor||'middle'});}
function vertexLabels(sv,pr,pts,role,prime){var cx=pts.reduce(function(t,p){return t+p[0];},0)/pts.length,cy=pts.reduce(function(t,p){return t+p[1];},0)/pts.length;pts.forEach(function(p,i){var xy=coord(pr,p),dx=p[0]-cx,dy=p[1]-cy,len=Math.hypot(dx,dy)||1,dist=pr===SIZE.mobile?22:23;txt(sv,xy[0]+dx/len*dist,xy[1]-dy/len*dist,'ABC'[i]+(prime?'′':''),role,pr===SIZE.mobile?20:19);});}
function emit(k,v){NOVA.events.emit('value',{engine:'F14-02',key:k,control:k,value:v});}
function tiles(stage,arr){
if(window.NovaLessonComponent?.active){[stage,arr]=window.NovaLessonComponent.args("tiles",arguments);}
var box=h('div',{class:'f14-readouts'});arr.forEach(function(a){box.appendChild(NOVA.neonTile(a.label+': '+a.value,{role:a.role}));});stage.appendChild(box);}
function rangeZones(pr){var z=[];for(var x=pr.minx;x<=pr.maxx;x++)for(var y=pr.miny;y<=pr.maxy;y++){var p=coord(pr,[x,y]);z.push({x:p[0]-pr.sp*.52,y:p[1]-pr.sp*.52,w:pr.sp*1.04,h:pr.sp*1.04,id:'cell:'+x+','+y,kind:'drop'});}return z;}
function pointerOf(sv,e){var pt=sv.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(sv.getScreenCTM().inverse());}
function track(sv,pr,c,a,pt,drawArc){var cc=coord(pr,c),aa=coord(pr,pt),bb=coord(pr,rot(pt,c,a));
 NOVA.neonPath(sv,'M'+cc.join(',')+' L'+aa.join(','),{role:'support',width:2,dash:'4 9'});
 NOVA.neonPath(sv,'M'+cc.join(',')+' L'+bb.join(','),{role:'support',width:2,dash:'4 9'});
 if(!drawArc)return;
 var radius=Math.min(Math.hypot(aa[0]-cc[0],aa[1]-cc[1]),pr.sp*2.2),a0=Math.atan2(aa[1]-cc[1],aa[0]-cc[0]),a1=a0-a*Math.PI/180;
 var sx=cc[0]+radius*Math.cos(a0),sy=cc[1]+radius*Math.sin(a0),ex=cc[0]+radius*Math.cos(a1),ey=cc[1]+radius*Math.sin(a1);
 var large=Math.abs(a)>180?1:0,sweep=a>0?0:1;
 // An arc with a chalk/neon tube but no filled wedge: same shared NOVA.neonPath as F0-02.
 NOVA.neonPath(sv,'M'+sx.toFixed(2)+','+sy.toFixed(2)+' A'+radius.toFixed(2)+','+radius.toFixed(2)+' 0 '+large+' '+sweep+' '+ex.toFixed(2)+','+ey.toFixed(2),{role:'unknown',width:3.2});
}

function plot(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("plot",arguments);}
o=o||{};var pr=P(),left=pr.ox+pr.minx*pr.sp,top=pr.oy-pr.maxy*pr.sp,w=(pr.maxx-pr.minx)*pr.sp,height=(pr.maxy-pr.miny)*pr.sp;
 var sv=S.root(pr.W,pr.H,'Coordinate rotation diagram with an original blue triangle, gold centre of rotation, rotation arc and green image.');sv.classList.add('f14-plot');
 S.grid(E('g',{'aria-hidden':'true'},sv),left,top,w,height,pr.sp);S.axes(sv,{x:left,y:top,w:w,h:height,xmin:pr.minx,xmax:pr.maxx,ymin:pr.miny,ymax:pr.maxy,ticks:1});
 var small=pr===SIZE.mobile;
 txt(sv,pr.W/2,top-28,'Rotation workshop  ·  '+shortAngle(st.angle),'unknown',small?22:21);
 var cc=coord(pr,st.centre),base=st.shape,target=base.map(function(q){return rot(q,st.centre,st.angle);}),real=target.map(function(q){return [q[0]+st.imgOff[0],q[1]+st.imgOff[1]];});
 var guides=E('g',{'data-maths':'rotation-guide'},sv);
 if(o.guide!==false){track(guides,pr,st.centre,st.angle,base[0],true);if(o.allGuides){base.slice(1).forEach(function(q){track(guides,pr,st.centre,st.angle,q,false);});}}
 var object=E('g',{'data-maths':'object'},sv);NOVA.neonPath(object,poly(pr,base),{role:'given',width:4.4,fill:true});
 base.forEach(function(q){var p=coord(pr,q);NOVA.neonRing(sv,p[0],p[1],{role:'given',r:3.3,pulse:false});});vertexLabels(sv,pr,base,'given',false);
 var image=null;if(o.showImage!==false){image=E('g',{'data-maths':'image'},sv);NOVA.neonPath(image,poly(pr,real),{role:'result',width:4.6,fill:true});if(o.ghost)image.style.opacity='.45';real.forEach(function(q){var p=coord(pr,q);NOVA.neonRing(image,p[0],p[1],{role:'result',r:3.4,pulse:false});});vertexLabels(image,pr,real,'result',true);}
 var cg=E('g',{'data-maths':'centre'},sv);NOVA.neonRing(cg,cc[0],cc[1],{role:'unknown',r:7,pulse:false});
 NOVA.neonPath(cg,'M'+(cc[0]-14)+','+cc[1]+' L'+(cc[0]+14)+','+cc[1]+' M'+cc[0]+','+(cc[1]-14)+' L'+cc[0]+','+(cc[1]+14),{role:'unknown',width:2});
 txt(sv,cc[0]-17,cc[1]+25,'O','unknown',small?18:19,'end');
 if(o.dragCentre){
  var hit=E('circle',{cx:cc[0],cy:cc[1],r:22,fill:'transparent','pointer-events':'all'},cg);cg.setAttribute('role','slider');cg.setAttribute('tabindex','0');cg.setAttribute('aria-label','Move the gold centre of rotation; arrow keys move it by one unit.');cg.setAttribute('aria-valuetext',pair(st.centre));
  var a=null,b=null;cg.addEventListener('pointerdown',function(e){a=pointerOf(sv,e);b=a;},true);cg.addEventListener('pointermove',function(e){if(a)b=pointerOf(sv,e);},true);cg.addEventListener('pointerup',function(e){if(a)b=pointerOf(sv,e);},true);
  NOVA.ui.svgDrag(sv,cg,{box:{x:cc[0]-20,y:cc[1]-20,w:40,h:40},zones:function(){return rangeZones(pr);},onDrop:function(){if(!a||!b)return false;var dx=Math.round((b.x-a.x)/pr.sp),dy=Math.round((a.y-b.y)/pr.sp);st.centre=[clamp(st.centre[0]+dx,-2,2),clamp(st.centre[1]+dy,-2,2)];st.imgOff=[0,0];emit('centre',clone(st.centre));o.update();return true;}});
  cg.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();st.centre=[clamp(st.centre[0]+d[0],-2,2),clamp(st.centre[1]+d[1],-2,2)];st.imgOff=[0,0];emit('centre',clone(st.centre));o.update('centre');});
 }
 if(o.dragImage&&image){var hit2=E('g',{'data-maths':'image-drag',tabindex:'0',role:'button','aria-label':'Drag green rotated triangle or move with arrow keys.'},sv);E('path',{d:poly(pr,real),fill:'transparent',stroke:'transparent','stroke-width':14,'pointer-events':'all',css:'cursor:grab;touch-action:none'},hit2);
  var a2=null,b2=null,zones=rangeZones(pr),boxPts=real.map(function(q){return coord(pr,q);}),minx=Math.min.apply(null,boxPts.map(function(q){return q[0]})),maxx=Math.max.apply(null,boxPts.map(function(q){return q[0]})),miny=Math.min.apply(null,boxPts.map(function(q){return q[1]})),maxy=Math.max.apply(null,boxPts.map(function(q){return q[1]}));
  var tray={x:pr.W-109,y:pr.H-39,w:98,h:28};NOVA.neonBox(sv,tray.x,tray.y,tray.w,tray.h,{role:'error',r:10,text:'Reset',size:14});zones.push({x:tray.x,y:tray.y,w:tray.w,h:tray.h,id:'tray',kind:'remove'});
  hit2.addEventListener('pointerdown',function(e){a2=pointerOf(sv,e);b2=a2;},true);hit2.addEventListener('pointermove',function(e){if(a2)b2=pointerOf(sv,e);},true);hit2.addEventListener('pointerup',function(e){if(a2)b2=pointerOf(sv,e);},true);
  NOVA.ui.svgDrag(sv,hit2,{box:{x:minx-12,y:miny-12,w:maxx-minx+24,h:maxy-miny+24},zones:function(){return zones;},onDrop:function(){if(!a2||!b2)return false;var dx=Math.round((b2.x-a2.x)/pr.sp),dy=Math.round((a2.y-b2.y)/pr.sp);st.imgOff=[clamp(st.imgOff[0]+dx,-5,5),clamp(st.imgOff[1]+dy,-5,5)];emit('imageOffset',clone(st.imgOff));o.update();return true;},onRemove:function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);o.update();},removeTo:{x:tray.x+tray.w/2,y:tray.y+tray.h/2}});
  hit2.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();st.imgOff=[clamp(st.imgOff[0]+d[0],-5,5),clamp(st.imgOff[1]+d[1],-5,5)];emit('imageOffset',clone(st.imgOff));o.update('image');});
 }
 stage.appendChild(sv);return sv;
}
function scene(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';NOVA.cap(stage,(o.cap||'Rotation')+' · '+(o.subtitle||angleText(st.angle)),o.tag||'live');var sv=plot(stage,st,o);
 if(o.readout!==false){var q=rot(st.shape[0],st.centre,st.angle);q=[q[0]+st.imgOff[0],q[1]+st.imgOff[1]];tiles(stage,[{label:'turn',value:shortAngle(st.angle),role:'unknown'},{label:'centre',value:pair(st.centre),role:'given'},{label:'A′',value:o.showImage===false?'?':pair(q),role:o.showImage===false?'unknown':'result'}]);}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Turn the shape around the gold point without changing its size.');return sv;}
var steps=[
 {name:'Original shape',pose:'explain',narration:'Here is triangle A B C. We are going to rotate it anticlockwise through ninety degrees.',prompt:'Which triangle is the original?'},
 {name:'Choose the centre',pose:'point-down',narration:'A rotation must have a fixed centre. The gold ring marks the origin, zero, zero.',prompt:'Find the gold centre O.'},
 {name:'Trace the turning arc',pose:'count',narration:'Imagine a circular track around O. Each vertex stays the same distance from O as it turns.',prompt:'What stays fixed when we rotate?'},
 {name:'Turn the whole triangle',pose:'compare',narration:'Watch the whole triangle turn ninety degrees anticlockwise. The blue original stays where it began.',prompt:'Which way is anticlockwise?'},
 {name:'Read the new vertices',pose:'think',narration:'A point at one, one becomes negative one, one. Every vertex turns by the same angle.',prompt:'Where has vertex A landed?'},
 {name:'Describe it precisely',pose:'celebrate',narration:'The triangle has rotated ninety degrees anticlockwise about the origin. Always give the angle, direction, and centre.',prompt:'Say the complete transformation description.'}
];
function renderAt(index,stage){var i=clamp(Math.round(index),0,steps.length-1),st=stateOf(CONFIG.presets.y7),step=steps[i];var sv=scene(stage,st,{cap:'Rotation',subtitle:step.name,tag:'STEP '+(i+1)+'/'+steps.length,showImage:i>=3,guide:i>=2,allGuides:i>=2,pose:step.pose,say:[
 'We will turn, not slide or flip.','O is the point that does not move.','Follow the curved paths around O.','The green image turns into position.','Every vertex keeps its distance from O.','Say angle, direction and centre.'][i]});
 if(i===2){var pr=P(),cc=coord(pr,st.centre),vertex=coord(pr,st.shape[0]),marks=[];st.shape.forEach(function(q){var xy=coord(pr,q);marks.push(NOVA.neonRing(sv,xy[0],xy[1],{role:'unknown',r:5,pulse:false}));});
  M.tween(900,function(t){marks.forEach(function(g,j){if(!g.isConnected)return;var p=st.shape[j],a=st.angle*t*Math.PI/180,v=[p[0]-st.centre[0],p[1]-st.centre[1]],x=v[0]*Math.cos(a)-v[1]*Math.sin(a)+st.centre[0],y=v[0]*Math.sin(a)+v[1]*Math.cos(a)+st.centre[1],initial=coord(pr,p),moving=coord(pr,[x,y]);g.setAttribute('transform','translate('+(moving[0]-initial[0]).toFixed(1)+','+(moving[1]-initial[1]).toFixed(1)+')');});},M.ease.inOut);}
 if(i===3){var pr=P(),cc=coord(pr,st.centre),image=sv.querySelector('[data-maths="image"]');if(image)M.tween(980,function(t){if(!image.isConnected)return;var a=st.angle*(t-1);image.setAttribute('transform','rotate('+a.toFixed(3)+' '+cc.join(' ')+')');image.style.opacity=String(.48+.52*t);},M.ease.inOut,function(){if(image&&image.isConnected){image.removeAttribute('transform');image.style.opacity='';}});}
}
var def={id:'F14-02',title:'Rotation',config:CONFIG,steps:steps,render:renderAt,
 alt:'Interactive rotation on a NOVA neon coordinate grid. Blue given triangle, green rotated image, a fixed gold centre, curved angle guides and coordinate labels.',
 staticAlt:'90 degrees anticlockwise about (0, 0) maps (1, 1) to (−1, 1), (3, 1) to (−1, 3), and (2, 3) to (−3, 2). A rotation preserves distances from its centre, side lengths and angles.',
 exploreIntro:'Choose an angle and centre, drag the gold centre and green image or use arrow keys, and watch the shape rotate without changing size.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=stateOf(CONFIG.presets[CONFIG.preset]);window.NovaLessonComponent?.applyExploreModels();var preset=h('select',{class:'nova-input','aria-label':'Choose rotation lesson preset'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){preset.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();preset.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();var ang=h('select',{class:'nova-input','aria-label':'Rotation angle and direction'});
 window.NovaLessonComponent?.applyExploreModels();[[90,'90° anticlockwise'],[-90,'90° clockwise'],[180,'180° half-turn'],[270,'270° anticlockwise']].forEach(function(item){ang.appendChild(h('option',{value:item[0],text:item[1]}));});window.NovaLessonComponent?.applyExploreModels();ang.value=String(st.angle);
 window.NovaLessonComponent?.applyExploreModels();var msg=h('div',{class:'f14-status'}),rows=h('div',{class:'pr-row'}),guides=true;
 window.NovaLessonComponent?.applyExploreModels();function repaint(focus){draw();if(focus){var x=stage.querySelector('[data-maths="'+(focus==='centre'?'centre':'image-drag')+'"]');if(x)x.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();function draw(){scene(stage,st,{cap:'Explore',subtitle:'rotation',tag:'DRAG + TURN',showImage:true,guide:guides,allGuides:guides,dragImage:true,dragCentre:true,pose:'point-down',say:st.imgOff.every(function(x){return x===0;})?'A turn keeps every vertex the same distance from O.':'Is the green image still a precise rotation?',update:repaint});var ok=st.imgOff.every(function(x){return x===0;});msg.className='f14-status '+(ok?'okay':'');msg.textContent=ok?'The green image is exactly rotated.':'Image offset: '+st.imgOff[0]+' horizontally, '+st.imgOff[1]+' vertically. Restore it to a correct rotation.';}
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=function(){CONFIG.preset=preset.value;st=stateOf(CONFIG.presets[CONFIG.preset]);ang.value=String(st.angle);emit('preset',CONFIG.preset);draw();};window.NovaLessonComponent?.applyExploreModels();ang.onchange=function(){st.angle=Number(ang.value);st.imgOff=[0,0];emit('angle',st.angle);draw();};
 window.NovaLessonComponent?.applyExploreModels();var guideInput=h('input',{type:'checkbox'});window.NovaLessonComponent?.applyExploreModels();guideInput.checked=true;window.NovaLessonComponent?.applyExploreModels();guideInput.onchange=function(){guides=guideInput.checked;draw();};
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',preset]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Turn ',ang]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},[guideInput,' Show circular paths and rays']));
 window.NovaLessonComponent?.applyExploreModels();function button(s,fn){return h('button',{class:'nova-btn',text:s,onclick:fn});}
 window.NovaLessonComponent?.applyExploreModels();[['← image',[-1,0]],['image →',[1,0]],['image ↑',[0,1]],['image ↓',[0,-1]]].forEach(function(a){rows.appendChild(button(a[0],function(){st.imgOff=[clamp(st.imgOff[0]+a[1][0],-5,5),clamp(st.imgOff[1]+a[1][1],-5,5)];emit('imageOffset',clone(st.imgOff));draw();}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(rows);
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[button('Snap to rotation',function(){st.imgOff=[0,0];emit('imageOffset',[0,0]);draw();}),button('Centre ←',function(){st.centre[0]=clamp(st.centre[0]-1,-2,2);st.imgOff=[0,0];emit('centre',clone(st.centre));draw();}),button('Centre →',function(){st.centre[0]=clamp(st.centre[0]+1,-2,2);st.imgOff=[0,0];emit('centre',clone(st.centre));draw();}),button('Centre ↑',function(){st.centre[1]=clamp(st.centre[1]+1,-2,2);st.imgOff=[0,0];emit('centre',clone(st.centre));draw();}),button('Centre ↓',function(){st.centre[1]=clamp(st.centre[1]-1,-2,2);st.imgOff=[0,0];emit('centre',clone(st.centre));draw();})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(msg);
 window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={state:function(){return st;},paint:draw,select:function(k){preset.value=k;preset.onchange();},angle:function(a){ang.value=String(a);ang.onchange();}};
 },
 challenge:function(panel,api,stage){var challengeState=stateOf(CONFIG.presets.y7);challengeState.imgOff=[-2,1];
 var tasks=[
 {q:'Rotate triangle ABC 90° anticlockwise about O (0, 0). Drag the green image into its correct position.',build:function(){return function(){return clone(challengeState.imgOff);};},check:function(v){var ok=v[0]===0&&v[1]===0;return [ok,ok?'Perfect rotation! Every vertex stays the same distance from O.':v[0]!==0?'The angle is right, but the x-positions are shifted. Follow the circular path from O.':'Check the heights of the matching vertices; rotating is not reflecting.'];},hint:'Vertex A at (1, 1) must land at (−1, 1). Move the whole green triangle until A′ matches.',solve:function(){challengeState.imgOff=[0,0];drawTask(0);}},
 {q:'Rotate point A = (2, 1) by 90° anticlockwise about the origin. Where is A′?',build:NOVA.choiceTask([{label:'(1, −2)',value:'1,-2'},{label:'(−1, 2)',value:'-1,2'},{label:'(2, −1)',value:'2,-1'},{label:'(−2, 1)',value:'-2,1'}],'F14-02'),check:function(v){var ok=v==='-1,2';return [ok,ok?'Yes! A 90° anticlockwise turn sends (x, y) to (−y, x).':v==='1,-2'?'That turns clockwise instead of anticlockwise.':v==='2,-1'?'Changing one sign is not a quarter-turn. Follow the circular path.':v==='-2,1'?'That is a reflection in the y-axis, not a quarter-turn.':'The point moves one square left and two squares up from O.'];},hint:'From the origin A is two right and one up. After an anticlockwise quarter-turn it is one left and two up.',solve:function(ctl){var bs=ctl.querySelectorAll('button');if(bs[1])bs[1].click();}},
 {q:'Rotate A = (3, 0) through 90° clockwise about centre (1, −1). Where is A′?',build:NOVA.choiceTask([{label:'(−2, 3)',value:'-2,3'},{label:'(0, 1)',value:'0,1'},{label:'(2, −3)',value:'2,-3'},{label:'(3, −2)',value:'3,-2'}],'F14-02'),check:function(v){var ok=v==='2,-3';return [ok,ok?'Exactly! Relative to (1, −1) the point turns from (2, 1) to (1, −2), so A′ is (2, −3).':v==='-2,3'?'That rotates about the origin and in the wrong direction.':v==='0,1'?'You turned anticlockwise. A clockwise turn goes down and right from this centre.':v?'First subtract the centre, rotate, then add the centre back.':'The centre is (1, −1), not the origin.'];},hint:'From centre (1, −1), point A is two right and one up. Turn clockwise: one right and two down.',solve:function(ctl){var bs=ctl.querySelectorAll('button');if(bs[2])bs[2].click();}}
 ];
 function drawTask(k){var st=k===0?challengeState:k===1?{angle:90,centre:[0,0],shape:[[2,1],[3,1],[2,2]],imgOff:[0,0]}:{angle:-90,centre:[1,-1],shape:[[3,0],[4,0],[3,1]],imgOff:[0,0]};scene(stage,st,{cap:'Task '+(k+1),subtitle:angleText(st.angle),tag:k===0?'DRAG THE IMAGE':'FIND A′',showImage:k===0,guide:true,allGuides:k===0,dragImage:k===0,pose:k===0?'think':'question',say:k===0?'Keep every point the same distance from the gold centre.':'Turn around the gold centre, not another point.',update:function(){drawTask(k);},readout:k===0});}
 NOVA.challengeRun(panel,api,tasks,drawTask,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-02',def,{models:{},tables:{"steps":()=>steps},draws:{"tiles":["stage","arr"],"plot":["stage","st","o"],"scene":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F14-02',num:'F14·02',title:'Rotation',def:def,years:'Year 7 and Year 8; GCSE Foundation and Higher extensions.',linked:['F0-02','F0-03','F0-04','F14-01','F14-03','F14-08'],
 spec:{purpose:'Premium neon-and-chalk coordinate rotation engine with a draggable centre, exact vertex rotation, angle arcs and a draggable rotated image. Keeps shape size, side lengths, angles and centre-to-vertex distance constant.',
 params:'Integer centre (cx, cy); 90° anticlockwise / 90° clockwise / 180° half-turn / 270° anticlockwise; polygon vertices; draggable image offset; optional circular guides.',
 presets:'Year 7: 90° anticlockwise about origin; Year 8: 90° clockwise about (1, −1); 180° half-turn; 270° anticlockwise GCSE extension.',
 steps:'Original shape → Choose the centre → Trace the turning arc → Turn the whole triangle → Read the new vertices → Describe it precisely. Six narrated Bob steps.',
 interactions:'Four modes. Explore uses shared F2 pointer-capture drag on centre and image, grid snapping, cancellation and keyboard fallback; angle/direction select; Challenge tests exact shape placement, a 90° anticlockwise coordinate rotation and a clockwise rotation about an offset centre.',
 traps:'Clockwise/anticlockwise confusion; rotating about origin rather than specified centre; reflecting instead of rotating; changing only one coordinate; translating without changing orientation.',
 gcse:'Rotation about centres other than (0, 0), quarter/half/three-quarter turns, coordinate descriptions.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
