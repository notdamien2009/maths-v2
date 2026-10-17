/* ===== F14-05 COMBINED TRANSFORMATIONS · NOVA F0/F2 PREMIUM CORE ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_05_CONFIG={startMode:'watch',preset:'rotationFirst',events:['value','step','correct','hintUsed','mode'],presets:{
 rotationFirst:{label:'Year 8 · rotate → translate',ops:['rotate','translate'],angle:-90,centre:[0,0],vector:[4,-1],line:-1,shape:[[-4,-3],[-2,-3],[-4,-1]]},
 translationFirst:{label:'Compare · translate → rotate',ops:['translate','rotate'],angle:-90,centre:[0,0],vector:[4,-1],line:-1,shape:[[-4,-3],[-2,-3],[-4,-1]]},
 reflectFirst:{label:'Extension · reflect → translate',ops:['reflect','translate'],angle:0,centre:[0,0],vector:[3,2],line:-1,shape:[[-3,-3],[-1,-3],[-3,-1]]},
 reflectLast:{label:'Extension · translate → reflect',ops:['translate','reflect'],angle:0,centre:[0,0],vector:[3,2],line:-1,shape:[[-3,-3],[-1,-3],[-3,-1]]}
}});
var DESKTOP={W:670,H:485,ox:335,oy:246,sp:34,minx:-6,maxx:6,miny:-5,maxy:5};
var MOBILE={W:390,H:490,ox:195,oy:245,sp:30,minx:-6,maxx:6,miny:-5,maxy:5};
function PR(){return innerWidth<=500?MOBILE:DESKTOP;}
function clone(x){return JSON.parse(JSON.stringify(x));}
function cp(p){return {ops:clone(p.ops),angle:p.angle,centre:clone(p.centre),vector:clone(p.vector),line:p.line,shape:clone(p.shape),midOff:[0,0],finalOff:[0,0]};}
function fmt(x){return Number.isInteger(x)?String(x):String(+x.toFixed(2));}
function pair(p){return '('+fmt(p[0])+', '+fmt(p[1])+')';}
function emit(key,value){NOVA.events.emit('value',{engine:'F14-05',key:key,control:key,value:value});}
function tr(p,kind,st){if(kind==='translate')return [p[0]+st.vector[0],p[1]+st.vector[1]];
 if(kind==='reflect')return [2*st.line-p[0],p[1]];
 var r=st.angle*Math.PI/180,x=p[0]-st.centre[0],y=p[1]-st.centre[1];return [Math.round((st.centre[0]+x*Math.cos(r)-y*Math.sin(r))*1000)/1000,Math.round((st.centre[1]+x*Math.sin(r)+y*Math.cos(r))*1000)/1000];}
function layers(st){var first=st.shape.map(function(p){return tr(p,st.ops[0],st)}),last=first.map(function(p){return tr(p,st.ops[1],st)});return {original:st.shape,mid:first,final:last};}
function displayed(st){var l=layers(st);return {original:l.original,mid:l.mid.map(function(p){return [p[0]+st.midOff[0],p[1]+st.midOff[1]];}),final:l.final.map(function(p){return [p[0]+st.finalOff[0],p[1]+st.finalOff[1]];})};}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function inGrid(st){var l=displayed(st),pr=PR();return l.original.concat(l.mid,l.final,[st.centre]).every(function(p){return p[0]>=pr.minx&&p[0]<=pr.maxx&&p[1]>=pr.miny&&p[1]<=pr.maxy;});}
function screen(pr,p){return [pr.ox+pr.sp*p[0],pr.oy-pr.sp*p[1]];}
function path(pr,pts){return 'M'+pts.map(function(p){return screen(pr,p).join(',');}).join(' L')+' Z';}
function mean(pts){return [pts.reduce(function(a,p){return a+p[0]},0)/pts.length,pts.reduce(function(a,p){return a+p[1]},0)/pts.length];}
function chalk(s,x,y,t,r,sz,anchor){return NOVA.chalkText(s,x,y,t,{role:r,size:sz||19,anchor:anchor||'middle'});}
function zoneList(pr){var zones=[];for(var i=pr.minx;i<=pr.maxx;i++)for(var j=pr.miny;j<=pr.maxy;j++){var q=screen(pr,[i,j]);zones.push({x:q[0]-pr.sp/2,y:q[1]-pr.sp/2,w:pr.sp,h:pr.sp,id:'grid:'+i+','+j,kind:'drop'});}return zones;}
function pt(svg,e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
function labelPoint(svg,pr,pts,tag,role){var c=mean(pts),small=pr===MOBILE;pts.forEach(function(p,i){var xy=screen(pr,p),dx=p[0]-c[0],dy=p[1]-c[1],m=Math.hypot(dx,dy)||1;var lx=clamp(xy[0]+dx/m*22,25,pr.W-25),ly=clamp(xy[1]-dy/m*23,26,pr.H-22);chalk(svg,lx,ly,'ABC'[i]+tag,role,small?18:20);});}
function inkShape(svg,pr,pts,role,tag,dim){var g=E('g',{'data-maths':tag==='′'?'intermediate':tag==='″'?'final':'original'},svg);NOVA.neonPath(g,path(pr,pts),{role:role,width:4.3,fill:true});pts.forEach(function(p){var q=screen(pr,p);NOVA.neonRing(g,q[0],q[1],{role:role,r:3,pulse:false});});labelPoint(g,pr,pts,tag,role);if(dim)g.style.opacity='.52';return g;}
function instruction(st,op){if(op==='rotate')return 'Rotate '+Math.abs(st.angle)+'° '+(st.angle<0?'clockwise':'anticlockwise')+' about '+pair(st.centre);
 if(op==='reflect')return 'Reflect in x = '+fmt(st.line);
 return 'Translate '+(st.vector[0]<0?'left '+Math.abs(st.vector[0]):'right '+st.vector[0])+', '+(st.vector[1]<0?'down '+Math.abs(st.vector[1]):'up '+st.vector[1]);}
function guide(svg,pr,st,op,a,b,role){if(op==='translate'){
  var x=screen(pr,mean(a)),y=screen(pr,mean(b));NOVA.neonPath(svg,'M'+x.join(',')+' L'+y.join(','),{role:role,width:3,dash:'7 6'});NOVA.neonRing(svg,y[0],y[1],{role:role,r:5,pulse:false});return;}
 if(op==='rotate'){var c=screen(pr,st.centre);NOVA.neonRing(svg,c[0],c[1],{role:'unknown',r:8,pulse:false});
  var x=screen(pr,a[0]),y=screen(pr,b[0]);NOVA.neonPath(svg,'M'+c.join(',')+' L'+x.join(',')+' M'+c.join(',')+' L'+y.join(','),{role:role,width:2.1,dash:'7 7'});
  var u=Math.atan2(x[1]-c[1],x[0]-c[0]),v=(st.angle>0?-1:1)*Math.PI/2,r=36;
  NOVA.neonPath(svg,'M'+(c[0]+r*Math.cos(u))+','+(c[1]+r*Math.sin(u))+' A'+r+','+r+' 0 0 '+(v>0?1:0)+' '+(c[0]+r*Math.cos(u+v))+','+(c[1]+r*Math.sin(u+v)),{role:'unknown',width:3});
  chalk(svg,c[0]-63,c[1]-47,Math.abs(st.angle)+'°','unknown',18);return;}
 var mx=screen(pr,[st.line,0])[0],top=screen(pr,[0,pr.maxy])[1],btm=screen(pr,[0,pr.miny])[1];NOVA.neonPath(svg,'M'+mx+','+top+' L'+mx+','+btm,{role:'unknown',width:3,dash:'11 8'});chalk(svg,clamp(mx+30,40,pr.W-46),top+26,'x = '+st.line,'unknown',18);}
function tiles(stage,st,visible){
if(window.NovaLessonComponent?.active){[stage,st,visible]=window.NovaLessonComponent.args("tiles",arguments);}
var l=layers(st),r=h('div',{class:'f14-readouts'});[{label:'First',value:st.ops[0],role:'given'},{label:'Then',value:st.ops[1],role:'support'},{label:'A″',value:visible?pair(l.final[0]):'?',role:'result'}].forEach(function(q){r.appendChild(NOVA.neonTile(q.label+': '+q.value,{role:q.role}));});stage.appendChild(r);}
function dock(stage,pose,msg){
if(window.NovaLessonComponent?.active){[stage,pose,msg]=window.NovaLessonComponent.args("dock",arguments);}
NOVA.scene.helperStrip(stage,pose||'explain',msg||'Use the intermediate image before you apply the next move.');}
function hitDrag(svg,pr,st,pts,which,redraw){var key=which==='mid'?'midOff':'finalOff',xy=pts.map(function(q){return screen(pr,q)}),left=Math.min.apply(null,xy.map(function(q){return q[0]})),right=Math.max.apply(null,xy.map(function(q){return q[0]})),top=Math.min.apply(null,xy.map(function(q){return q[1]})),bottom=Math.max.apply(null,xy.map(function(q){return q[1]}));
 var g=E('g',{'data-maths':which==='mid'?'mid-drag':'final-drag',tabindex:'0',role:'button','aria-label':'Drag the '+(which==='mid'?'purple intermediate':'green final')+' shape to the correct grid position, or use arrow keys; Escape cancels.'},svg);
 E('path',{d:path(pr,pts),fill:'transparent',stroke:'transparent','stroke-width':'12','pointer-events':'all',style:'cursor:grab;touch-action:none'},g);
 var a=null,b=null;g.addEventListener('pointerdown',function(e){a=pt(svg,e);b=a;},true);g.addEventListener('pointermove',function(e){if(a)b=pt(svg,e);},true);g.addEventListener('pointerup',function(e){if(a)b=pt(svg,e);},true);
 var tray={x:pr.W-104,y:pr.H-38,w:98,h:28};if(which==='final')NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'error',r:10,text:'Reset',size:14});
 var z=zoneList(pr);z.push({x:tray.x,y:tray.y,w:tray.w,h:tray.h,id:'tray',kind:'remove'});
 NOVA.ui.svgDrag(svg,g,{box:{x:left-12,y:top-12,w:right-left+24,h:bottom-top+24},zones:function(){return z;},onDrop:function(){if(!a||!b)return false;var d=[Math.round((b.x-a.x)/pr.sp),Math.round((a.y-b.y)/pr.sp)],v=clone(st);v[key]=[v[key][0]+d[0],v[key][1]+d[1]];if(!inGrid(v))return false;st[key]=v[key];emit(key,clone(st[key]));redraw();return true;},onRemove:function(){st[key]=[0,0];emit(key,[0,0]);redraw();},removeTo:{x:tray.x+tray.w/2,y:tray.y+tray.h/2}});
 g.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();var v=clone(st);v[key]=[v[key][0]+d[0],v[key][1]+d[1]];if(inGrid(v)){st[key]=v[key];emit(key,clone(st[key]));redraw(key);}});return g;}
function handle(svg,pr,st,kind,redraw){var val=kind==='centre'?st.centre:[st.line,0],q=screen(pr,val);
 if(kind==='vector'){var ll=layers(st),base=mean(st.ops[0]==='translate'?ll.original:ll.mid);q=screen(pr,[base[0]+st.vector[0]*.5,base[1]+st.vector[1]*.5]);}
 var g=E('g',{tabindex:'0',role:'button','data-maths':kind+'-drag','aria-label':'Drag '+kind+' control. Arrow keys move it one grid unit.'},svg);NOVA.neonRing(g,q[0],q[1],{role:'unknown',r:9,pulse:false});
 var a=null,b=null;g.addEventListener('pointerdown',function(e){a=pt(svg,e);b=a;},true);g.addEventListener('pointermove',function(e){if(a)b=pt(svg,e);},true);g.addEventListener('pointerup',function(e){if(a)b=pt(svg,e);},true);
 function move(d){var s=clone(st);if(kind==='centre')s.centre=[st.centre[0]+d[0],st.centre[1]+d[1]];else if(kind==='vector')s.vector=[st.vector[0]+d[0],st.vector[1]+d[1]];else s.line=st.line+d[0];s.midOff=[0,0];s.finalOff=[0,0];if(!inGrid(s))return false;st.centre=s.centre;st.vector=s.vector;st.line=s.line;st.midOff=s.midOff;st.finalOff=s.finalOff;emit(kind,kind==='centre'?clone(st.centre):kind==='vector'?clone(st.vector):st.line);redraw(kind);return true;}
 NOVA.ui.svgDrag(svg,g,{box:{x:q[0]-18,y:q[1]-18,w:36,h:36},zones:function(){return zoneList(pr)},onDrop:function(){if(!a||!b)return false;return move([Math.round((b.x-a.x)/pr.sp),Math.round((a.y-b.y)/pr.sp)])}});
 g.addEventListener('keydown',function(e){var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();move(d);});return g;}
function draw(stage,st,opt){
if(window.NovaLessonComponent?.active){[stage,st,opt]=window.NovaLessonComponent.args("draw",arguments);}
opt=opt||{};stage.innerHTML='';var pr=PR(),l=displayed(st),raw=layers(st),showMid=opt.showMid!==false,showFinal=opt.showFinal!==false;
 NOVA.cap(stage,(opt.cap||'Combined transformations')+' · '+(opt.sub||'Two moves, one sequence'),opt.tag||'TWO STAGES');
 var sv=S.root(pr.W,pr.H,'Coordinate grid with blue original triangle A B C, purple intermediate triangle A prime and green final triangle A double prime.');sv.classList.add('f14-plot');
 var x=pr.ox+pr.minx*pr.sp,y=pr.oy-pr.maxy*pr.sp,w=(pr.maxx-pr.minx)*pr.sp,hh=(pr.maxy-pr.miny)*pr.sp;
 S.grid(E('g',{'aria-hidden':'true'},sv),x,y,w,hh,pr.sp);S.axes(sv,{x:x,y:y,w:w,h:hh,xmin:pr.minx,xmax:pr.maxx,ymin:pr.miny,ymax:pr.maxy,ticks:1});
 chalk(sv,pr.W/2,y-25,'Original  →  Image 1  →  Image 2','unknown',pr===MOBILE?19:21);
 if(opt.guide1!==false)guide(sv,pr,st,st.ops[0],l.original,showMid?l.mid:raw.mid,'support');
 if(opt.guide2!==false)guide(sv,pr,st,st.ops[1],raw.mid,showFinal?l.final:raw.final,'result');
 inkShape(sv,pr,l.original,'given','',false);
 if(showMid)inkShape(sv,pr,l.mid,'support','′',opt.dimMid!==false&&showFinal);
 if(showFinal)inkShape(sv,pr,l.final,'result','″',false);
 if(opt.dragMid&&showMid)hitDrag(sv,pr,st,l.mid,'mid',opt.redraw);
 if(opt.dragFinal&&showFinal)hitDrag(sv,pr,st,l.final,'final',opt.redraw);
 if(opt.dragCentre&&(st.ops.indexOf('rotate')>=0))handle(sv,pr,st,'centre',opt.redraw);
 if(opt.dragVector&&(st.ops.indexOf('translate')>=0))handle(sv,pr,st,'vector',opt.redraw);
 if(opt.dragLine&&(st.ops.indexOf('reflect')>=0))handle(sv,pr,st,'line',opt.redraw);
 stage.appendChild(sv);
 if(opt.readout!==false)tiles(stage,st,showFinal);
 dock(stage,opt.pose||'explain',opt.say||'Keep the first image. The second move acts on the first image, not on the original.');return sv;}
var STEPS=[
 {name:'Start with ABC',pose:'explain',narration:'Begin with the blue triangle. We will apply two transformations in order. Order matters.',prompt:'Which is the original shape?'},
 {name:'First move: rotate',pose:'point-right',narration:'First, rotate the blue triangle ninety degrees clockwise about the origin. The purple triangle is the intermediate image.',prompt:'What is the centre and direction of this rotation?'},
 {name:'Trace the intermediate image',pose:'compare',narration:'Check A. Negative four, negative three becomes negative three, four after a clockwise quarter turn about the origin.',prompt:'Find A prime on the coordinate grid.'},
 {name:'Second move: translate',pose:'point-down',narration:'Now move each purple vertex four units right and one unit down. Apply the translation to the intermediate image.',prompt:'Which triangle must be translated?'},
 {name:'Reveal the final image',pose:'count',narration:'The green triangle is the final result. Each vertex has followed both instructions, one after the other.',prompt:'Where is A double prime?'},
 {name:'Describe the full sequence',pose:'celebrate',narration:'A combined transformation names the first move, then the second. Reversing them can give a different answer.',prompt:'State both transformations in the correct order.'}
];
function renderAt(i,stage){i=clamp(Math.round(i),0,5);var st=cp(CONFIG.presets.rotationFirst),o={cap:'Combined transformations',sub:STEPS[i].name,tag:'STEP '+(i+1)+'/6',showMid:i>=2,showFinal:i>=4,guide1:i>=1,guide2:i>=3,pose:STEPS[i].pose,say:[
 'Start with the blue triangle. Two transformations follow.',
 'A quarter turn clockwise, about the origin, is the first move.',
 'Keep the purple intermediate image. You will need it.',
 'Now move the purple shape four right and one down.',
 'Each green vertex has completed both transformations.',
 'Describe the moves in order: rotate, then translate.'
 ][i]};var sv=draw(stage,st,o);if(i===2){var mid=sv.querySelector('[data-maths="intermediate"]');if(mid){mid.style.opacity='.5';M.pop(mid,prNumber(PR().ox),prNumber(PR().oy));}}if(i===4){var f=sv.querySelector('[data-maths="final"]');if(f){var pr=PR(),d=[st.vector[0]*pr.sp,-st.vector[1]*pr.sp];f.setAttribute('transform','translate('+(-d[0])+','+(-d[1])+')');M.tween(900,function(t){if(!f.isConnected)return;f.setAttribute('transform','translate('+(-d[0]*(1-t))+','+(-d[1]*(1-t))+')');f.style.opacity=String(.58+.42*t);},M.ease.inOut,function(){if(f.isConnected)f.removeAttribute('transform')});}}}
function prNumber(x){return Number(x);}
var def={id:'F14-05',title:'Combined transformations',config:CONFIG,steps:STEPS,render:renderAt,
 alt:'Coordinate grid showing a blue triangle, a purple intermediate image and a green final image after two transformations.',
 staticAlt:'With A = (−4, −3), a clockwise 90-degree rotation about (0, 0) gives A′ = (−3, 4). Translation by (4, −1) gives A″ = (1, 3). Reversing the order gives A″ = (−4, 0), so the order matters.',
 exploreIntro:'Choose a two-move preset. Drag the purple intermediate image or green final image; move the gold transformation handle when available. Each arrow key moves one grid square. Reverse the order to compare results.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=cp(CONFIG.presets[CONFIG.preset]),which=h('select',{class:'nova-input','aria-label':'Sequence preset'}),msg=h('div',{class:'f14-status'}),guide1=true,guide2=true;
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){which.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();which.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();function btn(t,f){return h('button',{class:'nova-btn',text:t,onclick:f});}
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){draw(stage,st,{cap:'Explore',sub:'Build both transformations',tag:'DRAG + COMBINE',showMid:true,showFinal:true,guide1:guide1,guide2:guide2,dragMid:true,dragFinal:true,dragCentre:true,dragVector:true,dragLine:true,readout:true,pose:'point-right',say:'First '+instruction(st,st.ops[0])+'. Then '+instruction(st,st.ops[1])+'.',redraw:paint});
  var ok=st.midOff.every(function(x){return x===0})&&st.finalOff.every(function(x){return x===0});msg.className='f14-status '+(ok?'okay':'');msg.textContent=ok?'Both stages are in their mathematically exact positions. A″ = '+pair(layers(st).final[0])+'.':'The purple or green image is shifted. Align corresponding vertices with each stage of the sequence.';
  if(focus){var el=stage.querySelector('[data-maths="'+(focus==='midOff'?'mid-drag':focus==='finalOff'?'final-drag':focus+'-drag')+'"]');if(el)el.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();which.onchange=function(){CONFIG.preset=which.value;st=cp(CONFIG.presets[CONFIG.preset]);emit('preset',CONFIG.preset);paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',which]));
 window.NovaLessonComponent?.applyExploreModels();var order=btn('Reverse order',function(){st.ops.reverse();st.midOff=[0,0];st.finalOff=[0,0];emit('order',clone(st.ops));paint();});
 window.NovaLessonComponent?.applyExploreModels();var back=btn('Reset the two moves',function(){st=cp(CONFIG.presets[CONFIG.preset]);paint();});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[order,back]));
 window.NovaLessonComponent?.applyExploreModels();var cb1=h('input',{type:'checkbox'}),cb2=h('input',{type:'checkbox'});window.NovaLessonComponent?.applyExploreModels();cb1.checked=cb2.checked=true;window.NovaLessonComponent?.applyExploreModels();cb1.onchange=function(){guide1=cb1.checked;paint()};window.NovaLessonComponent?.applyExploreModels();cb2.onchange=function(){guide2=cb2.checked;paint()};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[h('label',{},[cb1,' First-move guide']),h('label',{},[cb2,' Second-move guide'])]));
 window.NovaLessonComponent?.applyExploreModels();var moves=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();[['Purple ←','midOff',[-1,0]],['Purple →','midOff',[1,0]],['Purple ↑','midOff',[0,1]],['Purple ↓','midOff',[0,-1]],['Green ←','finalOff',[-1,0]],['Green →','finalOff',[1,0]],['Green ↑','finalOff',[0,1]],['Green ↓','finalOff',[0,-1]]].forEach(function(it){moves.appendChild(btn(it[0],function(){var v=clone(st);v[it[1]]=[v[it[1]][0]+it[2][0],v[it[1]][1]+it[2][1]];if(inGrid(v)){st[it[1]]=v[it[1]];emit(it[1],clone(st[it[1]]));paint();}}));});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(moves);
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[btn('Snap both to exact positions',function(){st.midOff=[0,0];st.finalOff=[0,0];paint();}),btn('Try different order',function(){st.ops.reverse();st.midOff=[0,0];st.finalOff=[0,0];paint();})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(msg);window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={state:function(){return st},paint:paint,select:function(k){which.value=k;which.onchange()},reverse:function(){order.click()}};
 },
 challenge:function(panel,api,stage){var q1=cp(CONFIG.presets.rotationFirst),q4=cp(CONFIG.presets.rotationFirst);q1.midOff=[1,-1];q4.finalOff=[-1,-1];var tasks=[
 {q:'First rotate ABC 90° clockwise about the origin. Drag the purple intermediate image into its exact position.',build:function(){return function(){return clone(q1.midOff)};},check:function(v){var yes=v[0]===0&&v[1]===0;return [yes,yes?'Correct. A′ = (−3, 4). The shape has turned clockwise around (0, 0).':v[0]!==0?'A (−4, −3) rotates to (−3, 4). Check the horizontal coordinate.':'Check the height of A′: the clockwise quarter turn puts it at y = 4.'];},hint:'For a clockwise quarter turn about the origin, (x, y) maps to (y, −x). A′ is (−3, 4).',solve:function(){q1.midOff=[0,0];drawTask(0);}},
 {q:'Start at A = (−4, −3). Rotate 90° clockwise about (0, 0), then translate four right and one down. Where is A″?',build:NOVA.choiceTask([{label:'(1, 3)',value:'1,3'},{label:'(0, −4)',value:'0,-4'},{label:'(−4, 0)',value:'-4,0'},{label:'(−3, 4)',value:'-3,4'}],'F14-05'),check:function(v){return [v==='1,3',v==='1,3'?'Yes! Rotate A to (−3, 4), then add (4, −1) to get (1, 3).':v==='-3,4'?'That is only the first move. You still need to translate.':v==='-4,0'?'That is the result of reversing the order. First rotate, then translate.':'Apply each instruction one at a time and use the intermediate coordinate.'];},hint:'First A′ = (−3, 4). Then add four to x and subtract one from y.',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click();}},
 {q:'What happens if you translate by (4, −1) FIRST, and then rotate 90° clockwise about the origin?',build:NOVA.choiceTask([{label:'A″ = (−4, 0)',value:'-4,0'},{label:'A″ = (1, 3)',value:'1,3'},{label:'A″ = (−3, 4)',value:'-3,4'},{label:'A″ = (0, −4)',value:'0,-4'}],'F14-05'),check:function(v){return [v==='-4,0',v==='-4,0'?'Exactly. Translate A to (0, −4), then rotate to (−4, 0). Order matters.':v==='1,3'?'That is the previous order: rotate first, translate second.':'Translate A to (0, −4) before carrying out the rotation.'];},hint:'Translate (−4, −3) by (4, −1) to (0, −4). A clockwise quarter turn makes (y, −x).',solve:function(ctl){var a=ctl.querySelectorAll('button');if(a[0])a[0].click();}},
 {q:'Apply BOTH moves: rotate 90° clockwise, then translate (4, −1). Drag the green final image to the correct position.',build:function(){return function(){return clone(q4.finalOff);};},check:function(v){var yes=v[0]===0&&v[1]===0;return [yes,yes?'Brilliant. Every green vertex is exactly where both moves place it.':v[0]!==0?'Move the green image until A″ has x = 1.':'A″ should be at y = 3. Check the final vertical position.'];},hint:'For A, first (−3, 4), then (1, 3). Match the whole green triangle to those corresponding points.',solve:function(){q4.finalOff=[0,0];drawTask(3);}}
 ];
 function drawTask(i){var st=i===0?q1:i===3?q4:cp(CONFIG.presets.rotationFirst);draw(stage,st,{cap:'Challenge '+(i+1),sub:i===0?'Position the intermediate image':i===3?'Position the final image':'Read the two moves in order',tag:i===0||i===3?'DRAG + CHECK':'THINK + CHECK',showMid:true,showFinal:i===3,guide1:true,guide2:i===3,dragMid:i===0,dragFinal:i===3,readout:i===3,pose:i===0?'think':i===3?'question':'compare',say:i===0?'Rotate the blue triangle clockwise around the origin.':i===3?'Use the purple image, then make the translation.':'Remember: first transform, then transform the image.',redraw:function(){drawTask(i)}});}
 NOVA.challengeRun(panel,api,tasks,drawTask,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-05',def,{models:{},tables:{"STEPS":()=>STEPS},draws:{"tiles":["stage","st","visible"],"dock":["stage","pose","msg"],"draw":["stage","st","opt"]},exploreFields:{}});
NOVA.bankMount({id:'F14-05',num:'F14·05',title:'Combined transformations',def:def,years:'KS3 Year 8: Y8-054 Rotation. Combines two coordinate transformations in a specified order.',linked:['F0-02','F0-03','F0-04','F0-05','F14-01','F14-02','F14-03','F14-04','F14-06'],spec:{
 purpose:'Track two successive transformations accurately: blue original ABC, purple intermediate A′B′C′ and green final A″B″C″, preserving the mathematical order.',
 params:'Ordered operations (rotate clockwise 90°, translate by integer vector, reflect in x=k), centre, mirror line, vector, original vertices and movable snapped offsets.',
 presets:'Year 8 rotate then translate; compare translate then rotate; extension reflect then translate; compare translate then reflect.',
 steps:'Original → first transformation guide → intermediate image → second guide → final image → full ordered description.',
 interactions:'Four modes; drag intermediate/final images and active rotation/translation/reflection handles; grid snaps, red reset, keyboard arrows, pointer cancellation, step timeline and four challenge questions.',
 traps:'Reversing the order; transforming the original twice rather than the intermediate; reversing clockwise direction; forgetting one vector component; treating an intermediate image as final.',
 gcse:'Extension: mixed sequences with arbitrary rotation centres, mirror lines and scale-factor enlargements.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();
