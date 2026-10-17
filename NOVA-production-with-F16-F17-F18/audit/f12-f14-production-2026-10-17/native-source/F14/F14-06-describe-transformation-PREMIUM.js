/* ===== F14-06 DESCRIBE THE TRANSFORMATION · EXACT NOVA F0/F2 PREMIUM CORE ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_06_CONFIG={startMode:'watch',preset:'y7Rotation',events:['value','step','correct','hintUsed','mode'],presets:{
 y7Rotation:{label:'Y7 · Quarter turn',kind:'rotate',angle:-90,centre:[0,0],shape:[[-3,1],[-1,1],[-3,3]]},
 y8Rotation:{label:'Y8 · Off-centre turn',kind:'rotate',angle:90,centre:[1,0],shape:[[-2,-2],[0,-2],[-2,0]]},
 translation:{label:'Compare · Translation',kind:'translate',vector:[5,3],shape:[[-3,-2],[-1,-2],[-3,0]]},
 reflection:{label:'Compare · Vertical reflection',kind:'reflect',axis:'x',line:1,shape:[[-3,-3],[-1,-3],[-3,-1]]},
 enlargement:{label:'Extension · Enlargement',kind:'enlarge',centre:[-2,-1],scale:2,shape:[[-1,-1],[0,-1],[-1,0]]},
 horizontal:{label:'Compare · Horizontal reflection',kind:'reflect',axis:'y',line:1,shape:[[-3,-2],[-1,-2],[-3,0]]}
}});
var DESKTOP={W:670,H:490,ox:335,oy:247,sp:34,minx:-6,maxx:6,miny:-5,maxy:5};
var MOBILE={W:390,H:490,ox:195,oy:247,sp:30,minx:-6,maxx:6,miny:-5,maxy:5};
function P(){return innerWidth<=500?MOBILE:DESKTOP;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function cp(s){var p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("cp.p",(...a)=>clone(...a),[s]):(clone(s)));p.offset=[0,0];return p;}
function fmt(n){return Math.abs(n)<1e-8?'0':Number.isInteger(n)?''+n:(+n.toFixed(2)).toString();}
function pair(p){return '('+fmt(p[0])+', '+fmt(p[1])+')';}
function em(key,val){NOVA.events.emit('value',{engine:'F14-06',key:key,control:key,value:val});}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function transform(pt,st){var x=pt[0],y=pt[1];if(st.kind==='translate')return [x+st.vector[0],y+st.vector[1]];
 if(st.kind==='reflect')return st.axis==='x'?[2*st.line-x,y]:[x,2*st.line-y];
 if(st.kind==='enlarge')return [st.centre[0]+st.scale*(x-st.centre[0]),st.centre[1]+st.scale*(y-st.centre[1])];
 var a=st.angle*Math.PI/180,u=x-st.centre[0],v=y-st.centre[1];return [Math.round((st.centre[0]+u*Math.cos(a)-v*Math.sin(a))*1000)/1000,Math.round((st.centre[1]+u*Math.sin(a)+v*Math.cos(a))*1000)/1000];}
function transformed(st){return st.shape.map(function(q){return transform(q,st)});}
function shifted(st){return transformed(st).map(function(q){return [q[0]+st.offset[0],q[1]+st.offset[1]]});}
function inBounds(st){var pr=P(),pts=st.shape.concat(shifted(st));if(st.centre)pts.push(st.centre);return pts.every(function(q){return q[0]>=pr.minx&&q[0]<=pr.maxx&&q[1]>=pr.miny&&q[1]<=pr.maxy;});}
function at(pr,q){return [pr.ox+pr.sp*q[0],pr.oy-pr.sp*q[1]];}
function vectorPath(pr,pts){return 'M'+pts.map(function(q){return at(pr,q).join(',')}).join(' L')+' Z';}
function average(p){return [p.reduce(function(a,q){return a+q[0]},0)/p.length,p.reduce(function(a,q){return a+q[1]},0)/p.length];}
function chalk(g,x,y,v,role,n,anchor){return NOVA.chalkText(g,x,y,v,{role:role||'unknown',size:n||19,anchor:anchor||'middle'});}
function labelVertices(g,pr,pts,suffix,role){var c=average(pts),mobile=pr===MOBILE;pts.forEach(function(q,i){var v=at(pr,q),dx=q[0]-c[0],dy=q[1]-c[1],len=Math.hypot(dx,dy)||1;chalk(g,clamp(v[0]+dx/len*21,20,pr.W-20),clamp(v[1]-dy/len*22,40,pr.H-22),'ABC'[i]+suffix,role,mobile?18:20);});}
function shape(svg,pr,pts,role,suffix,dim){var g=E('g',{'data-maths':suffix?'image':'original'},svg);NOVA.neonPath(g,vectorPath(pr,pts),{role:role,width:4.3,fill:true});pts.forEach(function(q){var v=at(pr,q);NOVA.neonRing(g,v[0],v[1],{role:role,r:3,pulse:false});});labelVertices(g,pr,pts,suffix,role);if(dim)g.style.opacity='.43';return g;}
function msg(st){if(st.kind==='rotate')return 'Rotation '+Math.abs(st.angle)+'° '+(st.angle<0?'clockwise':'anticlockwise')+' about '+pair(st.centre);
 if(st.kind==='translate')return 'Translation '+(st.vector[0]>=0?st.vector[0]+' right':' '+Math.abs(st.vector[0])+' left')+' and '+(st.vector[1]>=0?st.vector[1]+' up':Math.abs(st.vector[1])+' down');
 if(st.kind==='reflect')return 'Reflection in '+st.axis+' = '+fmt(st.line);
 return 'Enlargement, scale factor '+fmt(st.scale)+', centre '+pair(st.centre);}
function guide(svg,pr,st){var target=transformed(st);if(st.kind==='translate'){
 var a=at(pr,average(st.shape)),b=at(pr,average(target));NOVA.neonPath(svg,'M'+a.join(',')+' L'+b.join(','),{role:'unknown',width:3,dash:'8 7'});NOVA.neonRing(svg,b[0],b[1],{role:'unknown',r:7,pulse:false});
 chalk(svg,(a[0]+b[0])/2,(a[1]+b[1])/2-24,'('+st.vector.join(', ')+')','unknown',19);return;}
 if(st.kind==='reflect'){
 if(st.axis==='x'){var u=at(pr,[st.line,pr.maxy]),v=at(pr,[st.line,pr.miny]);NOVA.neonPath(svg,'M'+u.join(',')+' L'+v.join(','),{role:'unknown',width:3.5,dash:'10 7'});chalk(svg,clamp(u[0]+35,38,pr.W-35),u[1]+23,'x = '+st.line,'unknown',20);}
 else{var l=at(pr,[pr.minx,st.line]),r=at(pr,[pr.maxx,st.line]);NOVA.neonPath(svg,'M'+l.join(',')+' L'+r.join(','),{role:'unknown',width:3.5,dash:'10 7'});chalk(svg,r[0]-42,r[1]-20,'y = '+st.line,'unknown',20);}return;}
 var centre=at(pr,st.centre);NOVA.neonRing(svg,centre[0],centre[1],{role:'unknown',r:8,pulse:false});chalk(svg,clamp(centre[0]+40,37,pr.W-37),clamp(centre[1]+29,46,pr.H-27),'O','unknown',20);
 for(var j=0;j<3;j++){var a=at(pr,st.shape[j]),b=at(pr,target[j]);if(st.kind==='enlarge'){
 var ext=at(pr,[st.centre[0]+(st.shape[j][0]-st.centre[0])*2.65,st.centre[1]+(st.shape[j][1]-st.centre[1])*2.65]);NOVA.neonPath(svg,'M'+centre.join(',')+' L'+ext.join(','),{role:'unknown',width:2,dash:'8 9'});}
 else{NOVA.neonPath(svg,'M'+centre.join(',')+' L'+a.join(',')+' M'+centre.join(',')+' L'+b.join(','),{role:'unknown',width:2.1,dash:'7 8'});}}
 if(st.kind==='rotate'){var a=at(pr,st.shape[0]),u=Math.atan2(a[1]-centre[1],a[0]-centre[0]),v=-st.angle*Math.PI/180,r=43,large=Math.abs(st.angle)>180?1:0;
 var d='M'+(centre[0]+r*Math.cos(u))+','+(centre[1]+r*Math.sin(u))+' A'+r+','+r+' 0 '+large+' '+(v>0?1:0)+' '+(centre[0]+r*Math.cos(u+v))+','+(centre[1]+r*Math.sin(u+v));NOVA.neonPath(svg,d,{role:'unknown',width:3.2});
 chalk(svg,clamp(centre[0]-70,36,pr.W-36),clamp(centre[1]-57,50,pr.H-50),Math.abs(st.angle)+'°','unknown',19);}
}
function zones(pr){var a=[];for(var x=pr.minx;x<=pr.maxx;x++)for(var y=pr.miny;y<=pr.maxy;y++){var q=at(pr,[x,y]);a.push({x:q[0]-pr.sp/2,y:q[1]-pr.sp/2,w:pr.sp,h:pr.sp,id:'grid:'+x+','+y,kind:'drop'})}return a;}
function svgPt(svg,e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
function dragImage(svg,pr,st,redraw){var pts=shifted(st),xy=pts.map(function(q){return at(pr,q)}),left=Math.min.apply(0,xy.map(function(q){return q[0]})),right=Math.max.apply(0,xy.map(function(q){return q[0]})),top=Math.min.apply(0,xy.map(function(q){return q[1]})),bottom=Math.max.apply(0,xy.map(function(q){return q[1]}));
 var g=E('g',{'data-maths':'image-drag',role:'button',tabindex:0,'aria-label':'Drag the green image. Arrow keys move one grid square; Escape cancels.'},svg);E('path',{d:vectorPath(pr,pts),fill:'transparent',stroke:'transparent','stroke-width':12,'pointer-events':'all',style:'cursor:grab;touch-action:none'},g);
 var p0=null,p1=null;g.addEventListener('pointerdown',function(e){p0=svgPt(svg,e);p1=p0;},true);g.addEventListener('pointermove',function(e){if(p0)p1=svgPt(svg,e);},true);g.addEventListener('pointerup',function(e){if(p0)p1=svgPt(svg,e);},true);
 function move(d,focus){var v=clone(st);v.offset=[v.offset[0]+d[0],v.offset[1]+d[1]];if(!inBounds(v))return false;st.offset=v.offset;em('offset',clone(v.offset));redraw(focus||'image-drag');return true;}
 var tray={x:pr.W-110,y:pr.H-43,w:100,h:30};NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'error',r:10,text:'Reset',size:14});var zz=zones(pr);zz.push({x:tray.x,y:tray.y,w:tray.w,h:tray.h,id:'tray',kind:'remove'});
 NOVA.ui.svgDrag(svg,g,{box:{x:left-12,y:top-12,w:right-left+24,h:bottom-top+24},zones:function(){return zz;},onDrop:function(){if(!p0||!p1)return false;var d=[Math.round((p1.x-p0.x)/pr.sp),Math.round((p0.y-p1.y)/pr.sp)];return move(d);},onRemove:function(){st.offset=[0,0];em('offset',[0,0]);redraw();},removeTo:{x:tray.x+50,y:tray.y+15}});
 g.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();move(d,'image-drag');});return g;}
function dragParam(svg,pr,st,redraw){var kind=st.kind==='translate'?'vector':st.kind==='reflect'?'line':'centre',q;
 if(kind==='vector'){var a=average(st.shape);q=at(pr,[a[0]+st.vector[0]*.5,a[1]+st.vector[1]*.5]);}
 else if(kind==='line')q=at(pr,st.axis==='x'?[st.line,0]:[0,st.line]);else q=at(pr,st.centre);
 var g=E('g',{'data-maths':kind+'-drag',tabindex:'0',role:'button','aria-label':'Drag the '+kind+' handle or move using arrow keys.'},svg);NOVA.neonRing(g,q[0],q[1],{role:'unknown',r:10,pulse:false});E('circle',{cx:q[0],cy:q[1],r:16,fill:'transparent',stroke:'transparent','pointer-events':'all',style:'cursor:grab;touch-action:none'},g);
 var p0=null,p1=null;g.addEventListener('pointerdown',function(e){p0=svgPt(svg,e);p1=p0;},true);g.addEventListener('pointermove',function(e){if(p0)p1=svgPt(svg,e);},true);g.addEventListener('pointerup',function(e){if(p0)p1=svgPt(svg,e);},true);
 function move(d){var v=clone(st);if(kind==='vector')v.vector=[v.vector[0]+d[0],v.vector[1]+d[1]];else if(kind==='line')v.line+=st.axis==='x'?d[0]:d[1];else v.centre=[v.centre[0]+d[0],v.centre[1]+d[1]];v.offset=[0,0];if(!inBounds(v))return false;Object.assign(st,v);em(kind,kind==='vector'?clone(st.vector):kind==='line'?st.line:clone(st.centre));redraw(kind+'-drag');return true;}
 NOVA.ui.svgDrag(svg,g,{box:{x:q[0]-19,y:q[1]-19,w:38,h:38},zones:function(){return zones(pr)},onDrop:function(){if(!p0||!p1)return false;return move([Math.round((p1.x-p0.x)/pr.sp),Math.round((p0.y-p1.y)/pr.sp)]);}});
 g.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();move(d);});return g;}
function buildStage(stage,st,opt){
if(window.NovaLessonComponent?.active){[stage,st,opt]=window.NovaLessonComponent.args("buildStage",arguments);}
opt=opt||{};stage.innerHTML='';var pr=P();NOVA.cap(stage,(opt.cap||'Describe the transformation')+' · '+(opt.sub||'Read the object and its image'),opt.tag||'LOOK CLOSELY');
 var svg=S.root(pr.W,pr.H,'Coordinate grid with blue triangle ABC and its green image A prime B prime C prime. Identify the transformation by comparing corresponding vertices.');svg.classList.add('f14-plot');
 var x=pr.ox+pr.minx*pr.sp,y=pr.oy-pr.maxy*pr.sp,w=(pr.maxx-pr.minx)*pr.sp,ht=(pr.maxy-pr.miny)*pr.sp;
 S.grid(E('g',{'aria-hidden':'true'},svg),x,y,w,ht,pr.sp);S.axes(svg,{x:x,y:y,w:w,h:ht,xmin:pr.minx,xmax:pr.maxx,ymin:pr.miny,ymax:pr.maxy,ticks:1});
 chalk(svg,pr.W/2,y-24,'Original ABC   →   Image A′B′C′','unknown',pr===MOBILE?18:20);
 if(opt.guide)guide(svg,pr,st);
 shape(svg,pr,st.shape,'given','',false);
 if(opt.image!==false){var g=shape(svg,pr,shifted(st),'result','′',false);if(opt.fade)g.style.opacity='.63';}
 if(opt.dragImage)dragImage(svg,pr,st,opt.redraw);
 if(opt.dragParam)dragParam(svg,pr,st,opt.redraw);
 stage.appendChild(svg);
 if(opt.readout){var rr=h('div',{class:'f14-readouts'});var entries=[['Object','ABC','given'],['Image','A′B′C′','result']];entries.forEach(function(k){rr.appendChild(NOVA.neonTile(k[0]+': '+k[1],{role:k[2]}))});stage.appendChild(rr);}
 NOVA.scene.helperStrip(stage,opt.pose||'explain',opt.say||'Compare corresponding vertices. What stayed the same? What moved?');return svg;}
var STEP_DEFS=[
 {name:'Read the two shapes',pose:'explain',prompt:'Which is the original and which is the image?',narration:'The blue triangle is the original. We will reveal its green image in the next step, then describe the movement precisely.'},
 {name:'Inspect corresponding vertices',pose:'magnify',prompt:'Follow A to A prime. How did the position change?',narration:'Compare matching vertices. Describe where each vertex has moved, and whether the shape has turned.'},
 {name:'Find the centre',pose:'point-down',prompt:'Is there a fixed point about which the figure has turned?',narration:'The image is a quarter turn clockwise about the origin. The origin is the centre of rotation.'},
 {name:'Trace the turn',pose:'compare',prompt:'How many degrees? Which direction?',narration:'Watch the turn from the blue triangle to the green triangle. It is ninety degrees clockwise.'},
 {name:'Reveal the complete image',pose:'count',prompt:'Check the mapped position of A.',narration:'For a clockwise quarter turn about the origin, the coordinate negative three, one goes to one, three.'},
 {name:'Give the precise description',pose:'celebrate',prompt:'State transformation, angle, direction and centre.',narration:'A precise answer is: rotation ninety degrees clockwise about the origin. Give every detail, not only the transformation type.'}
];
function animateImage(svg,st){var g=svg.querySelector('[data-maths="image"]');if(!g)return;var pr=P();var c=at(pr,st.centre||[0,0]);if(st.kind==='rotate'){
 var a=st.angle;g.style.opacity='.46';g.setAttribute('transform','rotate('+(-a)+' '+c.join(' ')+')');M.tween(1000,function(t){if(!g.isConnected)return;g.setAttribute('transform','rotate('+(-a*(1-t))+' '+c.join(' ')+')');g.style.opacity=String(.46+.54*t);},M.ease.inOut,function(){if(g.isConnected)g.removeAttribute('transform');});
 }else {var v=at(pr,average(st.shape)),d=at(pr,average(transformed(st)));g.style.opacity='.5';M.tween(900,function(t){if(!g.isConnected)return;g.setAttribute('transform','translate('+((v[0]-d[0])*(1-t))+','+((v[1]-d[1])*(1-t))+')');g.style.opacity=String(.5+.5*t);},M.ease.inOut,function(){if(g.isConnected)g.removeAttribute('transform');});}}
function renderStep(i,stage){var st=cp(CONFIG.presets.y7Rotation),n=clamp(Math.round(i),0,5),o={cap:'Discover the transformation',sub:STEP_DEFS[n].name,tag:'STEP '+(n+1)+'/6',image:n>=1,guide:n>=2,readout:n>=4,showDesc:n>=5,pose:STEP_DEFS[n].pose,say:[
 'Start with ABC in blue. Predict where its image could land.','Look carefully at A and A′. Compare their coordinates.','A turn needs a centre. This one turns around the origin.','Trace a quarter turn clockwise. Which way is that?','A goes from (−3, 1) to (1, 3). Check B and C too.','Say it fully: rotate 90° clockwise about (0, 0).'][n]};var sv=buildStage(stage,st,o);if(n===3)animateImage(sv,st);}
var DEF={id:'F14-06',title:'Describe the transformation challenge',config:CONFIG,steps:STEP_DEFS,render:renderStep,
 alt:'A premium neon coordinate-grid transformation identification engine: compare an original triangle with its image and describe its exact mathematical transformation.',
 staticAlt:'A(−3,1), B(−1,1), C(−3,3) rotate 90 degrees clockwise about the origin to A′(1,3), B′(1,1), C′(3,3). A complete description includes the transformation type, angle, direction and centre.',
 exploreIntro:'Select a Year 7, Year 8 or comparison preset. Drag the image and transformation handle or move them one square with the arrow keys; reveal the guide only after predicting the transformation.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=cp(CONFIG.presets[CONFIG.preset]),sel=h('select',{class:'nova-input','aria-label':'Transformation example preset'}),status=h('div',{class:'f14-status'}),showGuide=false,showDesc=false;
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){sel.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}))});window.NovaLessonComponent?.applyExploreModels();sel.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();function btn(t,fn){return h('button',{class:'nova-btn',text:t,onclick:fn})}
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){buildStage(stage,st,{cap:'Explore',sub:'Identify the complete transformation',tag:'DRAG + DESCRIBE',guide:showGuide,readout:true,showDesc:showDesc,dragImage:true,dragParam:true,pose:'point-right',say:showDesc?msg(st):'Use the matching vertices. Then name the kind of movement.',redraw:paint});var ok=st.offset[0]===0&&st.offset[1]===0;status.className='f14-status '+(ok?'okay':'');status.textContent=showDesc?'Exact description: '+msg(st):ok?'The image is correctly placed. Describe it before revealing the answer.':'The green image is displaced. Align its corresponding vertices, then describe the move.';if(focus){var el=stage.querySelector('[data-maths="'+focus+'"]');if(el)el.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=function(){CONFIG.preset=sel.value;st=cp(CONFIG.presets[CONFIG.preset]);showDesc=false;showGuide=false;em('preset',CONFIG.preset);paint()};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',sel]));
 window.NovaLessonComponent?.applyExploreModels();var reveal=btn('Reveal construction guide',function(){showGuide=!showGuide;reveal.textContent=showGuide?'Hide construction guide':'Reveal construction guide';paint()}),answer=btn('Reveal exact description',function(){showDesc=!showDesc;answer.textContent=showDesc?'Hide description':'Reveal exact description';paint()}),reset=btn('Reset positions',function(){st=cp(CONFIG.presets[CONFIG.preset]);showDesc=false;showGuide=false;reveal.textContent='Reveal construction guide';answer.textContent='Reveal exact description';paint()});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[reveal,answer,reset]));
 window.NovaLessonComponent?.applyExploreModels();var row=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();[['Image ←',[-1,0]],['Image →',[1,0]],['Image ↑',[0,1]],['Image ↓',[0,-1]]].forEach(function(z){row.appendChild(btn(z[0],function(){var v=clone(st);v.offset=[st.offset[0]+z[1][0],st.offset[1]+z[1][1]];if(inBounds(v)){st.offset=v.offset;em('offset',clone(st.offset));paint();}}))});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:function(){return st},preset:function(k){sel.value=k;sel.onchange()},paint:paint};},
 challenge:function(panel,api,stage){var moving=cp(CONFIG.presets.y8Rotation);moving.offset=[-1,1];
 var choice=function(arr){return NOVA.choiceTask(arr.map(function(x){return {label:x[0],value:x[1]}}),'F14-06')};
 var tasks=[
 {q:'Describe the transformation from blue ABC to green A′B′C′. Include every detail.',build:choice([['Rotation 90° clockwise about (0, 0)','yes'],['Rotation 90° anticlockwise about (0, 0)','anti'],['Reflection in y = 0','reflect'],['Translation by (4, 2)','shift']]),check:function(v){return [v==='yes',v==='yes'?'Correct. It is a rotation of 90° clockwise about (0, 0).':v==='anti'?'Look at A(−3, 1) moving to A′(1, 3): that is clockwise, not anticlockwise.':v==='reflect'?'A reflection has a mirror line; here every vertex has turned about the fixed origin.':'The shape changes orientation. Translation cannot turn it.'];},hint:'Follow A(−3, 1) to A′(1, 3) around the origin.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click()}},
 {q:'The green triangle is a 90° turn anticlockwise. What is the exact centre of rotation?',build:choice([['(1, 0)','yes'],['(0, 0)','origin'],['(−1, 0)','negative'],['(1, 1)','up']]),check:function(v){return [v==='yes',v==='yes'?'Correct. The centre is (1, 0).':v==='origin'?'Rotations do not always turn about the origin. Trace matching corners to find the actual fixed centre.':v==='negative'?'The x-coordinate of the centre is positive 1, not negative 1.':'Look at the centre level: it is on the x-axis, so y = 0.'];},hint:'The point (1, 0) is equally far from each vertex and its image.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click()}},
 {q:'Describe the translation mapping ABC to A′B′C′. Which vector is correct?',build:choice([['(5, 3)','yes'],['(5, −3)','down'],['(−5, 3)','left'],['(3, 5)','swap']]),check:function(v){return [v==='yes',v==='yes'?'Exactly: every vertex moves 5 right and 3 up.':v==='down'?'Up is positive on the coordinate grid. The second component must be +3.':v==='left'?'A to A′ goes right, not left. The first component must be +5.':'The horizontal and vertical components have been swapped. Count right first, then up.'];},hint:'From A(−3, −2) to A′(2, 1) is +5 in x and +3 in y.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click()}},
 {q:'What is the precise mirror line that maps blue ABC to green A′B′C′?',build:choice([['x = 1','yes'],['x = 0','zero'],['y = 1','horizontal'],['x = −1','negative']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Each pair of corresponding vertices lies equally far either side of x = 1.':v==='zero'?'The midpoint of x = −3 and x = 5 is x = 1, not the y-axis.':v==='horizontal'?'This is a vertical mirror line, so its equation begins with x.':'The line must lie halfway between A and A′. Check the midpoint carefully.'];},hint:'The x-values −3 and 5 have midpoint 1.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click()}},
 {q:'The green triangle is an enlargement of blue ABC. Describe the scale factor and centre.',build:choice([['Scale factor 2, centre (−2, −1)','yes'],['Scale factor 2, centre (0, 0)','origin'],['Scale factor ½, centre (−2, −1)','half'],['Scale factor 3, centre (−2, −1)','three']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Every distance from (−2, −1) doubles, so the scale factor is 2.':v==='origin'?'The corresponding vertices line up through (−2, −1), not through the origin.':v==='half'?'The green triangle is larger than the blue one. The factor must be greater than 1.':'Compare a side length. The green side is twice the blue one, not three times.'];},hint:'Blue AB is 1 grid unit long. Green A′B′ is 2 units. Rays meet at (−2, −1).',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click()}},
 {q:'Rotation 90° anticlockwise about (1, 0). Drag the green A′B′C′ triangle to its exact position.',build:function(){return function(){return clone(moving.offset)}},check:function(v){var ok=v[0]===0&&v[1]===0;return [ok,ok?'Excellent. The complete 90° anticlockwise image is correctly positioned.':v[0]!==0?'Compare A′ with its correct x-coordinate 3. The green shape is horizontally misaligned.':'Compare A′ with its correct y-coordinate −3. Check the vertical position.'];},hint:'A(−2, −2) rotates about (1, 0) to A′(3, −3). Place every corresponding corner.',solve:function(){moving.offset=[0,0];paintTask(5)}}
 ];
 function paintTask(i){var k=['y7Rotation','y8Rotation','translation','reflection','enlargement','y8Rotation'][i],st=i===5?moving:cp(CONFIG.presets[k]);buildStage(stage,st,{cap:'Challenge '+(i+1),sub:i===5?'Position the rotated image':'Identify the exact movement',tag:i===5?'DRAG + CHECK':'DESCRIBE + CHECK',guide:false,readout:true,showDesc:false,dragImage:i===5,pose:i===5?'question':'think',say:i===5?'Use the centre (1, 0). Drag or use arrow keys to align the image.':'Look at the original and image. Choose the precise description.',redraw:function(){paintTask(i)}});}
 NOVA.challengeRun(panel,api,tasks,paintTask,CONFIG);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-06',DEF,{models:{},tables:{"STEP_DEFS":()=>STEP_DEFS},draws:{"buildStage":["stage","st","opt"]},exploreFields:{"cp.p":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F14-06',num:'F14·06',title:'Describe the transformation challenge',def:DEF,years:'KS3 Year 7 Y7-053 Rotation and Year 8 Y8-054 Rotation; comparison examples include reflection, translation and enlargement.',linked:['F0-02','F0-03','F0-04','F0-05','F14-01','F14-02','F14-03','F14-04','F14-05'],spec:{
 purpose:'Read original and image coordinates to identify a transformation and give its full precise description, not just its name.',
 params:'Original vertices, transformation type, clockwise/anticlockwise angle and centre, translation vector, reflection axis and line, enlargement centre/scale, image offset.',
 presets:'Year 7 90° clockwise turn about origin; Year 8 anticlockwise turn about (1, 0); translations, vertical/horizontal reflections and enlargement for comparison.',
 steps:'Read blue object → identify green image → investigate fixed point → trace direction and turn → match vertices → reveal exact mathematical description.',
 interactions:'Four NOVA modes; guide reveal only when requested in Explore; drag shape and active guide handle on grid; keyboard arrows, red reset, six progressively varied challenge questions.',
 traps:'Wrong clockwise/anticlockwise direction, omitting centre, swapping vector components, wrong reflection-line midpoint, wrong enlargement centre or factor.',
 gcse:'Extend to non-origin centres, negative/fractional enlargement factors, sequences and numerical proof from corresponding coordinates.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000)};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
