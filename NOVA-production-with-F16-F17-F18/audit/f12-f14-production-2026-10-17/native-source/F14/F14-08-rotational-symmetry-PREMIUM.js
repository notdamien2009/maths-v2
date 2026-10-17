/* ===== F14-08 ROTATIONAL SYMMETRY · CANONICAL NOVA F0/F2 PREMIUM CORE ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
function regular(n,r,phase){var q=[];for(var i=0;i<n;i++){var a=(phase+i*360/n)*Math.PI/180;q.push([r*Math.cos(a),r*Math.sin(a)]);}return q;}
function pinwheel(){var arr=[],n=3;for(var i=0;i<n;i++){var b=i*2*Math.PI/n;[[0.5,0],[3.9,-.4],[3.5,1.15],[1.55,1.35]].forEach(function(v){var a=b;arr.push([v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a)]);});}return arr;}
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_08_CONFIG={startMode:'watch',preset:'square',events:['value','step','mode','hintUsed','correct'],presets:{
 square:{label:'Square · order 4',name:'Square',vertices:[[-3,-3],[3,-3],[3,3],[-3,3]],centre:[0,0],order:4},
 rectangle:{label:'Rectangle · order 2',name:'Non-square rectangle',vertices:[[-4,-2.3],[4,-2.3],[4,2.3],[-4,2.3]],centre:[0,0],order:2},
 triangle:{label:'Equilateral triangle · order 3',name:'Equilateral triangle',vertices:regular(3,3.8,90),centre:[0,0],order:3},
 pentagon:{label:'Regular pentagon · order 5',name:'Regular pentagon',vertices:regular(5,3.9,90),centre:[0,0],order:5},
 hexagon:{label:'Regular hexagon · order 6',name:'Regular hexagon',vertices:regular(6,4,0),centre:[0,0],order:6},
 parallelogram:{label:'Parallelogram · order 2',name:'Parallelogram',vertices:[[-4,-2],[2,-2],[4,2],[-2,2]],centre:[0,0],order:2},
 kite:{label:'Kite · order 1',name:'Kite',vertices:[[0,4],[3,0],[0,-3],[-3,0]],centre:[0,.5],order:1},
 irregular:{label:'Irregular L-shape · order 1',name:'Irregular L-shape',vertices:[[-3,-3],[3,-3],[3,-1],[-1,-1],[-1,2],[-3,2]],centre:[0,0],order:1},
 pinwheel:{label:'Three-bladed spinner · order 3',name:'Three-bladed spinner',vertices:pinwheel(),centre:[0,0],order:3},
 shifted:{label:'Off-centre rectangle · order 2',name:'Shifted rectangle',vertices:[[-2,-3],[4,-3],[4,1],[-2,1]],centre:[1,-1],order:2}
}});
var DESKTOP={W:670,H:490,ox:335,oy:250,sp:33,minx:-6,maxx:6,miny:-5,maxy:5},MOBILE={W:390,H:490,ox:195,oy:250,sp:29,minx:-6,maxx:6,miny:-5,maxy:5};
function P(){return innerWidth<=500?MOBILE:DESKTOP;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function round(v){return Math.round(v*1e5)/1e5;}
function xy(p,v){return [p.ox+p.sp*v[0],p.oy-p.sp*v[1]];}
function path(p,vs){return 'M'+vs.map(function(v){return xy(p,v).join(',')}).join(' L')+' Z';}
function emit(k,v){NOVA.events.emit('value',{engine:'F14-08',key:k,value:v});}
function fmt(v){return String(round(v)).replace('-', '−');}
function chalk(svg,x,y,txt,role,size,anchor){return NOVA.chalkText(svg,x,y,txt,{role:role||'unknown',size:size||20,anchor:anchor||'middle'});}
function copy(q){return JSON.parse(JSON.stringify(q));}
function norm(a){var v=((a%360)+360)%360;return v<.00001?0:round(v);}
function state(k){return {key:k,angle:0,pivot:CONFIG.presets[k].centre.slice(),showMatches:false,showRays:false};}
function rot(v,c,a){var r=a*Math.PI/180,x=v[0]-c[0],y=v[1]-c[1];return [c[0]+Math.cos(r)*x-Math.sin(r)*y,c[1]+Math.sin(r)*x+Math.cos(r)*y];}
function exact(vs,c,a){var eps=.045;return vs.every(function(v){var q=rot(v,c,a);return vs.some(function(u){return Math.hypot(q[0]-u[0],q[1]-u[1])<eps;});});}
function matches(st,a){var vs=CONFIG.presets[st.key].vertices;return exact(vs,st.pivot,a==null?st.angle:a);}
function geomOrder(d){var k=0;for(var i=1;i<=12;i++){if(exact(d.vertices,d.centre,360/i))k=i;}return k;}
function refCentre(st){var c=CONFIG.presets[st.key].centre;return Math.hypot(c[0]-st.pivot[0],c[1]-st.pivot[1])<.025;}
function grid(svg,p){var x=p.ox+p.minx*p.sp,y=p.oy-p.maxy*p.sp,w=(p.maxx-p.minx)*p.sp,ht=(p.maxy-p.miny)*p.sp;S.grid(E('g',{'aria-hidden':'true'},svg),x,y,w,ht,p.sp);S.axes(svg,{x:x,y:y,w:w,h:ht,xmin:p.minx,xmax:p.maxx,ymin:p.miny,ymax:p.maxy,ticks:1});}
function glass(svg,p,vertices,role,opacity,angle,c){var g=E('g',{'data-maths':'rotating-shape'},svg);var pic=NOVA.neonPath(g,path(p,vertices),{role:role,width:4.8,fill:true});if(opacity!=null)g.style.opacity=String(opacity);if(angle){var pos=xy(p,c);g.setAttribute('transform','rotate('+(-angle)+' '+pos[0]+' '+pos[1]+')')}return g;}
function rings(svg,p,st){var c=xy(p,st.pivot),role=matches(st)?'result':'unknown';var radius=p.sp*4.25,parts=[];for(var j=0;j<4;j++){var a=j*Math.PI/2;parts.push([c[0]+Math.cos(a)*radius,c[1]-Math.sin(a)*radius]);}
 var d='M'+(c[0]+radius)+','+c[1]+' A'+radius+','+radius+' 0 0 0 '+(c[0]-radius)+','+c[1]+' A'+radius+','+radius+' 0 0 0 '+(c[0]+radius)+','+c[1];NOVA.neonPath(svg,d,{role:'unknown',width:1.15,dash:'4 10'}).style.opacity='.38';NOVA.neonRing(svg,c[0],c[1],{role:'unknown',r:9,pulse:false});return c;}
function angleArc(svg,p,st){var c=xy(p,st.pivot),r=52,ang=norm(st.angle),a0=[c[0]+r,c[1]],d='M'+a0.join(',');if(ang>.01){var end=[c[0]+r*Math.cos(ang*Math.PI/180),c[1]-r*Math.sin(ang*Math.PI/180)];d+=' A'+r+','+r+' 0 '+(ang>180?'1':'0')+',0 '+end.join(',');NOVA.neonPath(svg,d,{role:'unknown',width:3});}if(ang>0){var pt=[c[0]+87*Math.cos(ang*Math.PI/360),c[1]-87*Math.sin(ang*Math.PI/360)];chalk(svg,clamp(pt[0],48,p.W-45),clamp(pt[1],60,p.H-44),fmt(ang)+'°','unknown',p===MOBILE?16:19)}return c;}
function rays(svg,p,st){var d=CONFIG.presets[st.key],c=xy(p,st.pivot);d.vertices.slice(0,3).forEach(function(v){var pt=xy(p,v);NOVA.neonPath(svg,'M'+c.join(',')+' L'+pt.join(','),{role:'unknown',width:1.6,dash:'5 7'}).style.opacity='.55'});}
function allMatchRays(svg,p,st){var d=CONFIG.presets[st.key],c=d.centre,order=geomOrder(d),ref=d.vertices[0];for(var i=0;i<order;i++){var q=rot(ref,c,i*360/order),a=xy(p,q),cc=xy(p,c);NOVA.neonPath(svg,'M'+cc.join(',')+' L'+a.join(','),{role:i%2?'result':'unknown',width:1.8,dash:'5 7'}).style.opacity='.8';NOVA.neonRing(svg,a[0],a[1],{role:'result',r:5,pulse:false});}}
function zones(p){var zs=[];for(var x=p.minx;x<=p.maxx;x++)for(var y=p.miny;y<=p.maxy;y++){var a=xy(p,[x,y]);zs.push({id:'z'+x+','+y,x:a[0]-p.sp*.5,y:a[1]-p.sp*.5,w:p.sp,h:p.sp,kind:'drop'});}return zs;}
function svgPt(svg,e){var q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(svg.getScreenCTM().inverse());}
function dragAngle(svg,p,st,render){var c=xy(p,st.pivot),a=st.angle*Math.PI/180,r=p.sp*4.25,pos=[c[0]+r*Math.cos(a),c[1]-r*Math.sin(a)];var g=E('g',{'data-maths':'angle-drag',tabindex:0,role:'button','aria-label':'Drag the gold circle around the centre to rotate the shape. Left/right arrows change by 15 degrees, up/down arrows by 90 degrees. Escape cancels.'},svg);NOVA.neonRing(g,pos[0],pos[1],{role:'unknown',r:11,pulse:false});E('circle',{cx:pos[0],cy:pos[1],r:19,fill:'transparent','pointer-events':'all',style:'touch-action:none;cursor:grab'},g);
 var init=null,last=null;g.addEventListener('pointerdown',function(e){init=svgPt(svg,e);last=init},true);g.addEventListener('pointermove',function(e){if(init)last=svgPt(svg,e)},true);g.addEventListener('pointerup',function(e){if(init)last=svgPt(svg,e)},true);
 function setAngle(deg){st.angle=norm(Math.round(deg));emit('angle',st.angle);render('angle-drag');return true;}
 NOVA.ui.svgDrag(svg,g,{box:{x:pos[0]-22,y:pos[1]-22,w:44,h:44},zones:function(){return zones(p)},onDrop:function(){if(!init||!last)return false;var start=Math.atan2(c[1]-init.y,init.x-c[0])*180/Math.PI,end=Math.atan2(c[1]-last.y,last.x-c[0])*180/Math.PI;return setAngle(st.angle+((end-start+540)%360-180));}});
 g.addEventListener('keydown',function(e){var n={ArrowLeft:-15,ArrowRight:15,ArrowDown:-90,ArrowUp:90}[e.key];if(n){e.preventDefault();setAngle(st.angle+n)}});return g;}
function dragPivot(svg,p,st,render){var c=xy(p,st.pivot),g=E('g',{'data-maths':'centre-drag',tabindex:0,role:'button','aria-label':'Drag the centre of rotation; arrow keys move it one grid square. Escape cancels.'},svg);NOVA.neonRing(g,c[0],c[1],{role:'unknown',r:12,pulse:false});E('circle',{cx:c[0],cy:c[1],r:20,fill:'transparent','pointer-events':'all',style:'touch-action:none;cursor:grab'},g);
 var init=null,last=null;g.addEventListener('pointerdown',function(e){init=svgPt(svg,e);last=init},true);g.addEventListener('pointermove',function(e){if(init)last=svgPt(svg,e)},true);g.addEventListener('pointerup',function(e){if(init)last=svgPt(svg,e)},true);
 function mv(dx,dy){var v=[clamp(Math.round(st.pivot[0]+dx),-3,3),clamp(Math.round(st.pivot[1]+dy),-3,3)];if(v[0]===st.pivot[0]&&v[1]===st.pivot[1])return false;st.pivot=v;emit('centre',v.slice());render('centre-drag');return true;}
 NOVA.ui.svgDrag(svg,g,{box:{x:c[0]-23,y:c[1]-23,w:46,h:46},zones:function(){return zones(p)},onDrop:function(){if(!init||!last)return false;return mv(Math.round((last.x-init.x)/p.sp),Math.round((init.y-last.y)/p.sp));}});
 g.addEventListener('keydown',function(e){var a={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowDown:[0,-1],ArrowUp:[0,1]}[e.key];if(a){e.preventDefault();mv(a[0],a[1]);}});return g;}
function dragShape(svg,p,st,render){var d=CONFIG.presets[st.key],c=xy(p,st.pivot),pts=d.vertices.map(function(q){return rot(q,st.pivot,st.angle)}),g=glass(svg,p,pts,'result',1,0,st.pivot);var a=xy(p,pts[0]);E('path',{d:path(p,pts),fill:'transparent',stroke:'transparent','stroke-width':14,'pointer-events':'all',style:'cursor:grab;touch-action:none'},g);g.setAttribute('data-maths','shape-drag');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label','Drag the green shape around the centre to rotate. Arrow keys rotate in 15 degree turns.');
 // Bind a generous transparent hit area to the already-rotated world coordinates.
 var overlay=g.lastChild;overlay.setAttribute('d',path(p,pts));
 var init=null,last=null;g.addEventListener('pointerdown',function(e){init=svgPt(svg,e);last=init},true);g.addEventListener('pointermove',function(e){if(init)last=svgPt(svg,e)},true);g.addEventListener('pointerup',function(e){if(init)last=svgPt(svg,e)},true);
 function move(a){st.angle=norm(Math.round(a));emit('angle',st.angle);render('shape-drag');return true;}
 NOVA.ui.svgDrag(svg,g,{zones:function(){return zones(p)},onDrop:function(){if(!init||!last)return false;var aa=Math.atan2(c[1]-init.y,init.x-c[0])*180/Math.PI,bb=Math.atan2(c[1]-last.y,last.x-c[0])*180/Math.PI;return move(st.angle+((bb-aa+540)%360-180));}});
 g.addEventListener('keydown',function(e){var v={ArrowLeft:-15,ArrowRight:15,ArrowUp:90,ArrowDown:-90}[e.key];if(v){e.preventDefault();move(st.angle+v);}});return g;}
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};stage.innerHTML='';var p=P(),d=CONFIG.presets[st.key],angle=norm(st.angle),isMatch=matches(st),mini=p===MOBILE;
 NOVA.cap(stage,(o.cap||'Rotational symmetry')+' · '+(o.sub||d.name),o.tag||'TURN · MATCH');
 var svg=S.root(p.W,p.H,d.name+': compare the original shape with the same shape rotated about a chosen centre.');svg.classList.add('f14-plot');grid(svg,p);
 chalk(svg,p.W/2,39,o.headline||'When will the shape match?', 'unknown',mini?17.5:21);
 if(o.allRays)allMatchRays(svg,p,st);
 // A faint, static original underneath the independently rotating glass image.
 var ghost=glass(svg,p,d.vertices,'given',.26,0,st.pivot);ghost.setAttribute('pointer-events','none');
 if(o.guide!==false){rings(svg,p,st);if(o.rays)rays(svg,p,st);angleArc(svg,p,st);}
 if(o.dragShape)dragShape(svg,p,st,o.redraw);else {var movable=glass(svg,p,d.vertices,'result',o.imageAlpha==null?1:o.imageAlpha,angle,st.pivot);movable.setAttribute('pointer-events','none');if(o.animateAngle){var target=angle,c=xy(p,st.pivot);movable.setAttribute('transform','rotate(0 '+c.join(' ')+')');M.tween(1200,function(t){if(!movable.isConnected)return;movable.setAttribute('transform','rotate('+(-target*t)+' '+c[0]+' '+c[1]+')');},M.ease.inOut);}}
 if(o.guide!==false){if(o.dragAngle)dragAngle(svg,p,st,o.redraw);if(o.dragPivot)dragPivot(svg,p,st,o.redraw);}
 if(o.showScore){var msg=isMatch?(angle===0?'Start position matches':'Exact match!'):'Not matched yet';chalk(svg,p.W/2,p.H-19,msg,isMatch?'result':'unknown',mini?16:19);}
 if(o.stars&&isMatch){var centre=xy(p,st.pivot);NOVA.neonRing(svg,centre[0],centre[1],{role:'result',r:19,pulse:true});}
 stage.appendChild(svg);
 if(o.readout){var row=h('div',{class:'f14-readouts'});row.appendChild(NOVA.neonTile('Turn: '+fmt(angle)+'°',{role:'unknown'}));row.appendChild(NOVA.neonTile(o.showOrder?'Order: '+d.order:(isMatch?'Exact match':'Still turning'),{role:isMatch?'result':'given'}));stage.appendChild(row)}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Turn the green shape around the golden centre. Watch when it covers the blue shape exactly.');return svg;}
var STEPS=[
{name:'Begin with a square',pose:'explain',prompt:'Can a square turn and still match?',narration:'The green square starts on top of its blue outline. Rotational symmetry is about turning, not folding.'},
{name:'Locate the centre',pose:'point-down',prompt:'Where must the shape turn?',narration:'The centre of rotation is the centre of the square. All corners travel around this fixed point.'},
{name:'Predict a quarter-turn',pose:'think',prompt:'Will a quarter-turn match?',narration:'Try turning the square ninety degrees anticlockwise. Think where every corner will go.'},
{name:'Rotate through ninety degrees',pose:'compare',prompt:'Do all four sides match again?',narration:'After a quarter-turn, the green square matches the blue one exactly. That is one quarter of a complete turn.'},
{name:'Count all the matches',pose:'count',prompt:'How many matching positions in one full turn?',narration:'The square matches at ninety, one hundred and eighty, two hundred and seventy, and three hundred and sixty degrees.'},
{name:'Name the order',pose:'celebrate',prompt:'How do you state rotational symmetry?',narration:'A square has rotational symmetry of order four. We count the complete turn, but not the starting position twice.'}
];
function stepRender(i,stage){var k=clamp(i|0,0,5),st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("stepRender.st",(...a)=>state(...a),['square']):(state('square'))),angles=[0,0,45,90,270,90],say=[
'Blue is the original. Green is the same square ready to turn.',
'Find the golden centre. Every corner turns around it.',
'Predict what happens after a 90° anticlockwise turn.',
'At 90°, the green image covers the blue shape exactly.',
'The square fits at 90°, 180°, 270° and 360°.',
'Four matching positions in a complete turn means order 4.'
];st.angle=angles[k];draw(stage,st,{cap:'Discover rotational symmetry',sub:STEPS[k].name,tag:'STEP '+(k+1)+'/6',headline:k===5?'Four matches · order four':k===4?'Count the matching turns':'Which turns make an exact match?',guide:k>=1,animateAngle:k===3,readout:k>=3,showOrder:k>=4,allRays:k>=4,rays:k===2,showScore:k>=3,pose:STEPS[k].pose,say:say[k],stars:k===5});}
var DEF={id:'F14-08',title:'Rotational symmetry',config:CONFIG,steps:STEPS,render:stepRender,
 alt:'A neon-glass shape rotates around its centre over a fixed outline. Matching positions count towards its rotational order.',
 staticAlt:'A square has rotational symmetry of order four, a non-square rectangle order two, an equilateral triangle order three, and an irregular L-shape order one.',
 exploreIntro:'Choose a shape, spin it around its centre using the gold handle or green shape, and discover each exact matching position. Move the centre to see why the correct pivot matters.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>state(...a),[CONFIG.preset]):(state(CONFIG.preset))),sel=h('select',{class:'nova-input','aria-label':'Rotational symmetry shape preset'}),status=h('div',{class:'f14-status'}),all=false;
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){sel.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}))});window.NovaLessonComponent?.applyExploreModels();sel.value=st.key;
 window.NovaLessonComponent?.applyExploreModels();function btn(t,fn){return h('button',{class:'nova-btn',text:t,onclick:fn});}
 window.NovaLessonComponent?.applyExploreModels();var angle=h('input',{type:'range',min:0,max:360,step:1,value:'0','aria-label':'Rotation angle slider'}),lbl=h('span',{class:'f14-a-label',text:'0°'});
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){draw(stage,st,{cap:'Explore',sub:CONFIG.presets[st.key].name,tag:'SPIN · COMPARE · COUNT',headline:'When does the image fit exactly?',guide:true,dragShape:true,dragAngle:true,dragPivot:true,allRays:all,showScore:true,readout:true,showOrder:all,stars:matches(st)&&st.angle!==0,pose:matches(st)?'point-right':'think',say:matches(st)?'The outlines fit. This is one of the matching positions!':'Keep turning. Do the corners and edges line up with the blue outline?',redraw:paint});angle.value=String(st.angle);lbl.textContent=fmt(st.angle)+'°';status.className='f14-status'+(matches(st)?' okay':'');status.textContent=matches(st)?'Exact match at '+fmt(st.angle)+'°. '+(st.angle===0?'Try turning to find the next match.':'The shape has turned onto itself.'):'Not a match at '+fmt(st.angle)+'°. Move the pivot back to the centre and try another turn.';if(focus){var el=stage.querySelector('[data-maths="'+focus+'"]');if(el)el.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=function(){st=state(sel.value);CONFIG.preset=sel.value;all=false;reveal.textContent='Reveal matching turns';emit('preset',sel.value);paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Shape preset ',sel]));
 window.NovaLessonComponent?.applyExploreModels();angle.oninput=function(){st.angle=+angle.value;emit('angle',st.angle);paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Rotation angle ',angle,lbl]));
 window.NovaLessonComponent?.applyExploreModels();var row=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();[['−15°',-15],['+15°',15],['Quarter-turn',90],['Half-turn',180]].forEach(function(q){row.appendChild(btn(q[0],function(){st.angle=norm(st.angle+q[1]);emit('angle',st.angle);paint();}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row);
 window.NovaLessonComponent?.applyExploreModels();var reveal=btn('Reveal matching turns',function(){all=!all;reveal.textContent=all?'Hide matching turns':'Reveal matching turns';paint();}),next=btn('Next exact match',function(){var d=CONFIG.presets[st.key];st.pivot=d.centre.slice();var k=360/d.order;st.angle=norm(Math.floor(st.angle/k+.0001)*k+k);emit('angle',st.angle);paint();}),reset=btn('Reset shape and centre',function(){st=state(sel.value);all=false;reveal.textContent='Reveal matching turns';paint();});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[next,reveal,reset]));
 window.NovaLessonComponent?.applyExploreModels();var mv=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();[['Centre left',-1,0],['Centre right',1,0],['Centre up',0,1],['Centre down',0,-1]].forEach(function(q){mv.appendChild(btn(q[0],function(){st.pivot=[clamp(st.pivot[0]+q[1],-3,3),clamp(st.pivot[1]+q[2],-3,3)];emit('centre',st.pivot.slice());paint();}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(mv);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:function(){return st;},preset:function(v){sel.value=v;sel.onchange();},spin:function(v){st.angle=norm(v);paint();},paint:paint,next:function(){next.click();},reveal:function(){reveal.click()}};
 },
 challenge:function(panel,api,stage){var turn=state('square'),centre=state('shifted');turn.angle=45;centre.angle=180;centre.pivot=[0,-1];var choice=function(items){return NOVA.choiceTask(items.map(function(q){return {label:q[0],value:q[1]}}),'F14-08');};
 var tasks=[
 {q:'What is the order of rotational symmetry of this square?',build:choice([['4','yes'],['2','two'],['8','eight'],['1','one']]),check:function(v){return [v==='yes',v==='yes'?'Correct. It fits at 90°, 180°, 270° and 360°.':v==='two'?'You have missed the quarter-turn matches.':'Count the distinct matching positions in one complete turn, including 360°.'];},hint:'Try rotating by 90 degrees each time.'},
 {q:'What is the rotational order of this non-square rectangle?',build:choice([['2','yes'],['4','four'],['1','one'],['0','zero']]),check:function(v){return [v==='yes',v==='yes'?'Correct. It fits again at 180° and 360°.':v==='four'?'A 90° turn swaps the long and short sides. They cannot fit.':v==='zero'?'Every shape matches after a full 360° turn.':'A half-turn matches, but a quarter-turn does not.'];},hint:'Check 90°, then 180°, then 360°.'},
 {q:'How many degrees is the smallest positive turn that matches an equilateral triangle?',build:choice([['120°','yes'],['60°','sixty'],['90°','ninety'],['180°','half']]),check:function(v){return [v==='yes',v==='yes'?'Correct. 360° ÷ 3 = 120°.':v==='sixty'?'The triangle has three vertices, not six.':'Count its three matching rotations in one complete turn.'];},hint:'Divide 360° by the rotational order of an equilateral triangle.'},
 {q:'What is the rotational order of this regular pentagon?',build:choice([['5','yes'],['4','four'],['10','ten'],['2','two']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Five turns of 72° complete the circle.':'Use 360° ÷ 72° to count the matching positions.'];},hint:'A regular pentagon matches at every 72° turn.'},
 {q:'What is the rotational order of this irregular L-shape?',build:choice([['1','yes'],['0','zero'],['2','two'],['4','four']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Only a full turn maps it onto itself.':v==='zero'?'Even an irregular shape matches after 360°, so order is one.':'The arms do not align after a half-turn or quarter-turn.'];},hint:'Order one means no matching turn smaller than 360°.'},
 {q:'What is the smallest matching angle for a regular hexagon?',build:choice([['60°','yes'],['120°','hundred'],['30°','thirty'],['180°','half']]),check:function(v){return [v==='yes',v==='yes'?'Correct. A hexagon has order 6, so 360° ÷ 6 = 60°.':'Use 360° divided by six matching positions.'];},hint:'360 degrees divided by its six equally spaced positions.'},
 {q:'Use the gold rotation handle to turn the square by 90° anticlockwise.',build:function(){return function(){return turn.angle;}},check:function(v){var ok=v===90;return [ok,ok?'Correct. The green square sits exactly over the blue outline after a quarter-turn.':v===270?'That is a quarter-turn clockwise, not anticlockwise.':v===180?'A half-turn matches, but the task asks for 90°.':'Rotate to exactly 90° anticlockwise using the dial or keyboard.'];},hint:'Use the +15° keys six times, or the Up arrow for a quarter-turn.'},
 {q:'Move the gold centre onto the exact centre of this shifted rectangle.',build:function(){return function(){return centre.pivot.slice();}},check:function(v){var ok=v[0]===1&&v[1]===-1;return [ok,ok?'Excellent. The centre is (1, −1), halfway between opposite corners.':v[0]!==1?'The shape is shifted one square right of the y-axis.':'The centre is one square below the x-axis, at y = −1.'];},hint:'Find the midpoint of the left and right edges, then the midpoint of the top and bottom.'}
 ];
 function task(i){var k=['square','rectangle','triangle','pentagon','irregular','hexagon','square','shifted'][i],st=i===6?turn:i===7?centre:state(k);draw(stage,st,{cap:'Challenge '+(i+1),sub:i===6?'Rotate to a quarter-turn':i===7?'Locate the true centre':'Count the matching turns',tag:i>=6?'DRAG · CHECK':'ORDER · CHECK',headline:i===7?'Where must this rectangle turn?':i===6?'Rotate exactly 90° anticlockwise':'How often does this shape match?',guide:i>=6,dragAngle:i===6,dragPivot:i===7,showScore:false,readout:false,stars:false,pose:'think',say:i===6?'Turn the gold handle anticlockwise through ninety degrees.':i===7?'Move the gold centre to the midpoint of the rectangle.':'Picture the shape turning. Count only the positions where the whole outline matches.',redraw:function(){task(i)}});}
 NOVA.challengeRun(panel,api,tasks,task,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-08',DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"state","argCount":1},"stepRender.st":{"kind":"factory","factory":"state","argCount":1}}});
NOVA.bankMount({id:'F14-08',num:'F14·08',title:'Rotational symmetry',def:DEF,years:'KS3 Year 7 · Y7-055 Symmetry, extending to Years 8–9.',linked:['F0-02','F0-03','F0-04','F0-05','F14-02','F14-07'],spec:{
 purpose:'Identify and construct rotational symmetry; calculate order and smallest matching angle by turning a shape around a fixed centre.',
 params:'Polygon vertices, centre of rotation, rotation angle, matching tolerance, shape presets and optional centre offset.',
 presets:'Square (4), non-square rectangle (2), equilateral triangle (3), regular pentagon (5), hexagon (6), parallelogram (2), kite (1), irregular L-shape (1), three-bladed spinner (3), shifted rectangle (2).',
 steps:'See the original → locate the centre → predict the turn → rotate into alignment → count matches → name the order.',
 interactions:'Watch, Guided, Explore, Challenge; rotate the green image or the gold handle, move the centre, reveal exact matching positions and show misconception-specific feedback.',
 traps:'Confusing rotation with reflection; calling order one order zero; counting the 0° starting position separately; assuming any 90° turn fits a rectangle; selecting the wrong centre of rotation.',
 gcse:'Extension to rotational symmetry of regular polygons, off-origin centres and proving order with coordinate geometry.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000)};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent=''};}
})();
