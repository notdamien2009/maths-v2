
/* ===== F12-03 CONFIG: parameters + named presets ===== */
var NOVA_F12_03_CONFIG={
  startMode:'watch',
  preset:'own',
  pegs:8,
  presets:{
    own:      {label:'Build your own',verts:[],closed:false},
    rectangle:{label:'Rectangle 4 by 3',verts:[[1,1],[5,1],[5,4],[1,4]],closed:true},
    triangle: {label:'Right-angled triangle',verts:[[1,1],[5,1],[1,4]],closed:true},
    parallelogram:{label:'Parallelogram',verts:[[1,1],[5,1],[7,4],[3,4]],closed:true},
    lshape:   {label:'L-shape (compound)',verts:[[1,1],[6,1],[6,3],[3,3],[3,6],[1,6]],closed:true},
    kite:     {label:'Kite',verts:[[3,1],[5,3],[3,6],[1,3]],closed:true}
  }
};
/* ===== F12-03 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_03_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone;
var KB=false,viaKey=false,N=C.pegs,PAD=26,GAP=40,W=PAD*2+GAP*(N-1);
function px(x){return PAD+x*GAP;}function py(y){return PAD+(N-1-y)*GAP;}
function same(a,b){return a[0]===b[0]&&a[1]===b[1];}
function rectilinear(V){for(var i=0;i<V.length;i++){var a=V[i],b=V[(i+1)%V.length];if(a[0]!==b[0]&&a[1]!==b[1])return false;}return V.length>=4;}
function simp(l2){for(var f=Math.floor(Math.sqrt(l2));f>=1;f--){if(l2%(f*f)===0)return [f,l2/(f*f)];}return [1,l2];}
function lenTxt(a,b){var l2=Math.pow(b[0]-a[0],2)+Math.pow(b[1]-a[1],2),s=simp(l2);return s[1]===1?String(s[0]):(s[0]>1?s[0]:'')+'\u221a'+s[1];}
function exact(V){var ints=0,rad={};for(var i=0;i<V.length;i++){var a=V[i],b=V[(i+1)%V.length],s=simp(Math.pow(b[0]-a[0],2)+Math.pow(b[1]-a[1],2));if(s[1]===1)ints+=s[0];else rad[s[1]]=(rad[s[1]]||0)+s[0];}
  var parts=[];if(ints)parts.push(String(ints));Object.keys(rad).sort(function(x,y){return x-y;}).forEach(function(m){parts.push((rad[m]>1?rad[m]:'')+'\u221a'+m);});return parts.join(' + ')||'0';}
function hasRad(V){return exact(V).indexOf('\u221a')>=0;}
function segX(a,b,c,d){function o(p,q,r){return (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);}var o1=o(a,b,c),o2=o(a,b,d),o3=o(c,d,a),o4=o(c,d,b);return o1*o2<0&&o3*o4<0;}
function crosses(V,closing){var n=V.length;for(var i=0;i<n-1;i++){var a=V[i],b=V[i+1];for(var j=i+2;j<n-1;j++){if(segX(a,b,V[j],V[j+1]))return true;}if(closing&&i>0&&segX(a,b,V[n-1],V[0]))return true;}return false;}
function board(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("board",arguments);}
o=o||{};var V=st.verts,pts=V.map(function(q){return [px(q[0]),py(q[1])];}),sv=S.root(W,W,'Geoboard of '+N+' by '+N+' pegs'+(V.length?' with '+(st.closed?'a closed shape':'a band')+' through '+V.map(function(q){return '('+q[0]+', '+q[1]+')';}).join(', '):'')+'.');sv.classList.add('f12-sv');sv.classList.add('f12-board');sv.style.maxWidth='520px';
  var rect=st.closed&&rectilinear(V);
  NOVA.neonCells(sv,px(0),py(N-1),N-1,N-1,GAP,{role:'result',hatch:'dots',cells:rect?function(c,r){return F.pip([c+.5,(N-1)-r-.5],V);}:null});
  if(V.length>=2){var g=NOVA.neonShape(sv,pts,{role:'op',open:!st.closed,hatch:st.closed?'diag':null,width:3.2});g.setAttribute('data-maths','shape');}
  if(o.lens&&st.closed)V.forEach(function(q,i){var b=V[(i+1)%V.length],ol=F.outward(pts,i,17);S.pill(sv,ol[0],ol[1],lenTxt(q,b),{role:'given',size:11});});
  for(var x=0;x<N;x++)for(var y=0;y<N;y++){var g2=S.el('g',{class:'f12-peg'},sv);S.el('circle',{cx:px(x),cy:py(y),r:3.4,css:'fill:#cfe6ff;opacity:.8'},g2);
    if(o.onPeg){(function(x,y){var hit=S.el('circle',{class:'hit',cx:px(x),cy:py(y),r:17,css:'fill:transparent;stroke:transparent'},g2);hit.addEventListener('click',function(){o.onPeg(x,y);});})(x,y);}}
  var cxm=0,cym=0;pts.forEach(function(p){cxm+=p[0]/pts.length;cym+=p[1]/pts.length;});
  V.forEach(function(q,i){NOVA.neonRing(sv,px(q[0]),py(q[1]),{role:i===0?'focus':'result',r:8,pulse:false});var dx=px(q[0])-cxm,dy=py(q[1])-cym,dl=Math.hypot(dx,dy),ox=st.closed&&dl>1?dx/dl*20:14,oy=st.closed&&dl>1?dy/dl*20+5:-12;NOVA.chalkText(sv,px(q[0])+ox,py(q[1])+oy,'ABCDEFGH'.charAt(i),{size:14,role:'focus'});});
  if(o.cursor&&o.onPeg){NOVA.neonRing(sv,px(o.cursor[0]),py(o.cursor[1]),{role:'unknown',r:13,pulse:false});}
  stage.appendChild(sv);return sv;}
function info(stage,st,extra){var V=st.verts;if(!st.closed){strip(stage,[['corners',V.length,'given'],['next','tap a peg','focus']]);return;}
  var A=Math.abs(F.area(V)),Pm=F.perim(V),ex=exact(V);strip(stage,[['shape',F.classify(V),'op'],['area',fmt(A)+' unit squares','result'],['perimeter',hasRad(V)?ex+' ≈ '+fmt(Math.round(Pm*100)/100):ex,'focus']].concat(extra||[]));}
var steps=[
 {name:'The board',narration:'A geoboard is a grid of pegs. Stretch a band round some pegs to make a shape. Every peg sits on whole-number coordinates, so lengths and areas are easy to count.',prompt:'How many pegs are in one row?',st:{verts:[],closed:false}},
 {name:'A rectangle',narration:'This rectangle is 4 wide and 3 tall. Count the unit squares inside: 12. Add the four sides, 4 and 3 and 4 and 3: 14.',prompt:'How many unit squares fit inside?',st:P.rectangle,lens:true,target:'shape'},
 {name:'Area is not perimeter',narration:'Area counts the squares inside: 12 square units. Perimeter measures the band all the way round: 14 units. Different jobs, different answers.',prompt:'Which one is measured in square units?',st:P.rectangle,lens:true,target:'shape'},
 {name:'A triangle is half',narration:'Draw a diagonal and the 4 by 3 rectangle gives a right-angled triangle. Its area is half the rectangle: 6. The slanting side is 5, so the perimeter is 12.',prompt:'What is half of 12?',st:P.triangle,lens:true,target:'shape'},
 {name:'Diagonals are longer',narration:'A diagonal across a unit square is longer than its side. For a 2 by 2 square corner the slanting side is root 8, which is 2 root 2, about 2.83.',prompt:'Is the slanting side longer than 2?',st:{verts:[[1,1],[3,1],[3,3]],closed:true},lens:true,target:'shape'},
 {name:'A compound shape',narration:'The L-shape is a 5 by 5 square with a 3 by 3 corner removed. Area: 25 minus 9 is 16. The perimeter is the same as the big square: 20.',prompt:'How is the L-shape made from a square?',st:P.lshape,lens:true,target:'shape'},
 {name:'Name the shape',narration:'Opposite sides parallel and equal, but no right angles: this is a parallelogram. Its area is base times height: 4 times 3, which is 12.',prompt:'What is this shape called?',st:P.parallelogram,lens:true,target:'shape'}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Geoboard · '+s.name,'step '+(i+1)+'/'+steps.length);board(stage,s.st,{lens:s.lens});info(stage,s.st);NOVA.scene.helperStrip(stage,i===steps.length-1?'cheer':'explain',s.name);}
/* shared interactive state machine */
function mk(onChange){var st={verts:[],closed:false,msg:''};
  return {st:st,place:function(x,y){var V=st.verts,p=[x,y];st.msg='';
    if(st.closed){st.verts=[p];st.closed=false;onChange('start');return;}
    if(V.length>=3&&same(p,V[0])){if(crosses(V,true)){st.msg='The band crosses itself. Undo and try another corner.';onChange('bad');return;}st.closed=true;onChange('close');return;}
    if(V.length&&same(p,V[V.length-1]))return;
    for(var i=0;i<V.length;i++)if(same(p,V[i])){st.msg='That peg is already a corner.';onChange('bad');return;}
    V.push(p);if(crosses(V,false)){V.pop();st.msg='The band would cross itself.';onChange('bad');return;}onChange('add');},
   close:function(){if(st.verts.length>=3&&!st.closed){if(crosses(st.verts,true)){st.msg='The band crosses itself.';onChange('bad');return;}st.closed=true;st.msg='';onChange('close');}},
   undo:function(){st.msg='';if(st.closed)st.closed=false;else st.verts.pop();onChange('undo');},
   clear:function(){st.verts=[];st.closed=false;st.msg='';onChange('clear');},
   load:function(o){st.verts=clone(o.verts);st.closed=o.closed;st.msg='';onChange('load');}};}
function keys(sv,m,cur,repaint){sv.setAttribute('tabindex','0');sv.setAttribute('role','application');sv.setAttribute('aria-label','Geoboard. Arrow keys move the cursor, Enter places a corner, Backspace undoes.');
  sv.addEventListener('keydown',function(e){var k=e.key,d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[k];if(!d&&k!=='Enter'&&k!==' '&&k!=='Backspace')return;e.preventDefault();KB=true;viaKey=true;if(d){cur[0]=NOVA.clamp(cur[0]+d[0],0,N-1);cur[1]=NOVA.clamp(cur[1]+d[1],0,N-1);repaint();}else if(k==='Enter'||k===' '){m.place(cur[0],cur[1]);}else{m.undo();}});}
var def={id:'F12-03',title:'Geoboard builder',config:C,steps:steps,render:render,
 alt:'Geoboard builder: an 8 by 8 grid of pegs; tap pegs to make a shape and read its area, perimeter and name.',
 staticAlt:'Geoboard shapes: a 4 by 3 rectangle (area 12, perimeter 14), a right-angled triangle (area 6, perimeter 12), a right isosceles triangle, an L-shape (area 16, perimeter 20) and a parallelogram (area 12, perimeter 8 + 2 root 13).',
 exploreIntro:'Explore: tap pegs to place corners, tap the first corner (or Close shape) to finish. Use arrow keys and Enter on the keyboard. The chips give the name, area and perimeter.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var cur=[3,3],m;
   window.NovaLessonComponent?.applyExploreModels();function paint(why){stage.innerHTML='';var st=m.st;NOVA.cap(stage,'Explore · geoboard',st.msg||(st.closed?F.classify(st.verts):'tap pegs to place corners'));var sv=board(stage,st,{lens:true,onPeg:function(x,y){cur=[x,y];m.place(x,y);},cursor:KB?cur:null});keys(sv,m,cur,function(){paint();});if(viaKey){viaKey=false;sv.focus({preventScroll:true});}
     info(stage,st);NOVA.scene.helperStrip(stage,'explain',st.closed?F.classify(st.verts):'Geoboard');}
   window.NovaLessonComponent?.applyExploreModels();m=mk(function(why){paint();var st=m.st;NOVA.events.emit('value',{engine:'F12-03',control:'geoboard',value:why,corners:st.verts.length,closed:st.closed});if(st.closed&&why==='close')NOVA.events.emit('value',{engine:'F12-03',control:'shape',value:F.classify(st.verts),area:Math.abs(F.area(st.verts))});});
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Preset'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=C.preset;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){m.load(P[pre.value]);};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Preset ',pre]));
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row',role:'group','aria-label':'Board actions'},[h('button',{class:'nova-btn',text:'Undo',onclick:function(){m.undo();}}),h('button',{class:'nova-btn',text:'Close shape',onclick:function(){m.close();}}),h('button',{class:'nova-btn ghost',text:'Clear',onclick:function(){pre.value='own';m.clear();}})]));
   window.NovaLessonComponent?.applyExploreModels();m.load(P[C.preset]);window.NovaLessonComponent?.applyExploreModels();C._explore={load:function(k){pre.value=k;m.load(P[k]);}};},
 challenge:function(panel,api,stage){var m=null,cur=[3,3],k0=0;
   var tasks=[
    {q:'Build a rectangle with area 12 AND perimeter 14.',build:function(ctl){m=mk(function(){paintC(0);});ctl.appendChild(h('div',{class:'pr-row'},[h('button',{class:'nova-btn',text:'Undo',onclick:function(){m.undo();}}),h('button',{class:'nova-btn',text:'Close shape',onclick:function(){m.close();}}),h('button',{class:'nova-btn ghost',text:'Clear',onclick:function(){m.clear();}})]));return function(){return clone(m.st);};},
     check:function(s){if(!s||!s.closed)return [false,'Finish the shape first: tap the first corner again, or press Close shape.'];var V=s.verts,A=Math.abs(F.area(V)),Pm=F.perim(V),nm=F.classify(V);
       if((nm==='Rectangle'||nm==='Square')&&A===12&&Pm===14)return [true,'Yes: 4 by 3 has area 12 and perimeter 14.'];if(nm!=='Rectangle'&&nm!=='Square')return [false,'That is a '+nm.toLowerCase()+'. Make a rectangle.'];if(A!==12)return [false,'Area is '+fmt(A)+'. You need 12 unit squares.'];return [false,'Area is 12 but the perimeter is '+fmt(Pm)+'. Try different side lengths: two numbers that multiply to 12 and add to 7.'];},
     hint:'Which two numbers multiply to 12 and add to 7?',solve:function(){m.load({verts:[[1,1],[5,1],[5,4],[1,4]],closed:true});}},
    {q:'What is the area of the parallelogram?',build:NOVA.entryTask('Area (square units)','F12-03'),check:function(x){var ok=x===12;return [ok,ok?'Yes: base 4 times height 3 is 12.':x===14?'14 is not the area. Use base times PERPENDICULAR height, not the slanted side.':'Use base times height. The height is the straight up distance, 3.'];},hint:'Base times perpendicular height: count along the bottom, then straight up.',solve:function(c){c._A.input.value='12';}},
    {q:'A 3 by 4 rectangle has area 12 and perimeter 14. What is the PERIMETER of a 2 by 6 rectangle?',build:NOVA.entryTask('Perimeter','F12-03'),check:function(x){var ok=x===16;return [ok,ok?'Yes: 2 + 6 + 2 + 6 = 16. Same area, bigger perimeter.':x===12?'12 is the area. Perimeter is the distance round: 2 + 6 + 2 + 6.':x===8?'You added two sides only. All four sides count.':'Add all four sides: 2 + 6 + 2 + 6.'];},hint:'Walk round the band: 2, 6, 2, 6.',solve:function(c){c._A.input.value='16';}}];
   var T=[null,{verts:[[1,1],[5,1],[6,4],[2,4]],closed:true},{verts:[[1,1],[7,1],[7,3],[1,3]],closed:true}];
   function paintC(k){k0=k;stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['build','area','perimeter'][k]);
     if(k===0){var st=m.st;var sv=board(stage,st,{lens:true,onPeg:function(x,y){cur=[x,y];m.place(x,y);},cursor:KB?cur:null});keys(sv,m,cur,function(){paintC(0);});if(viaKey){viaKey=false;sv.focus({preventScroll:true});}info(stage,st,st.msg?[['note',st.msg,'error']]:[]);}
     else{board(stage,T[k],{lens:k===1?false:true});strip(stage,k===1?[['base','4','given'],['slanted side','shown as a band','op']]:[['rectangle','2 by 6','given']]);}
     NOVA.scene.helperStrip(stage,'think',['Build it','Find the area','Find the perimeter'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-03',def,{models:{},tables:{"steps":()=>steps},draws:{"board":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F12-03',num:'F12·03',title:'Geoboard builder',def:def,linked:['F0-02','F0-04','F0-11','F0-12','F12-01','F12-04','F12-05','F12-10'],
 spec:{purpose:'A virtual geoboard: an 8 by 8 grid of pegs on which pupils stretch a band into polygons. Area is read by counting unit squares (rectilinear shapes) or by structure; perimeter is added from side lengths, with root lengths for diagonals; the shape is named from its properties. Used for properties of 2-D shapes, perimeter, and compound area and perimeter.',
  params:'pegs (8), presets (own, rectangle, triangle, parallelogram, L-shape, kite) as vertex lists, closed flag. Name from NOVA.f12.classify; area and perimeter from NOVA.f12.area / perim with exact surd text. Core: NOVA.neonCells / neonShape / neonRing / chalkText / neonTile. Year groups: KS3 Years 7–9 (12–15).',
  presets:'Build your own · Rectangle 4 by 3 · Right-angled triangle · Parallelogram · L-shape · Kite',
  steps:'The board → A rectangle → Area is not perimeter → A triangle is half → Diagonals are longer → A compound shape → Name the shape. Each step has a Sir Bob line and a Guided prompt; the helper points to the shape.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: tap pegs or use arrow keys and Enter; Undo, Close shape, Clear, presets. A band that would cross itself is refused with a message. Challenge (3 tasks): build a rectangle with area 12 and perimeter 14; read the area of a parallelogram; find the perimeter of a 2 by 6 rectangle. Events: value, correct, step, hintUsed.',
  traps:'Area and perimeter mixed up · using the slanted side as the height · counting pegs instead of gaps · thinking equal area means equal perimeter · treating a diagonal as the same length as a side',
  gcse:'Extension: Pythagoras for diagonal lengths (surds), Pick-style area reasoning, compound area by subtraction; linked: F12-04 perimeter tracer, F12-10 compound shapes, F15-02 Pythagoras'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

