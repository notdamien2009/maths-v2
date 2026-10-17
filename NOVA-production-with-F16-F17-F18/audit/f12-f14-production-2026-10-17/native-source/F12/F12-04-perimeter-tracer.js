
/* ===== F12-04 CONFIG: parameters + named presets ===== */
var NOVA_F12_04_CONFIG={
  startMode:'watch',
  preset:'rect',
  unit:'cm',
  presets:{
    rect:{label:'Rectangle',kind:'rect',a:8,b:5,params:[['Length','a',2,12,1],['Width','b',2,12,1]]},
    lshape:{label:'L-shape (missing sides)',kind:'L',W:6,H:5,nw:3,nh:3,params:[['Width','W',5,9,1],['Height','H',5,9,1],['Notch width','nw',1,4,1],['Notch height','nh',1,4,1]]},
    tri:{label:'Isosceles triangle',kind:'tri',b:6,a:7,params:[['Base','b',4,10,1],['Equal sides','a',6,12,1]]},
    para:{label:'Parallelogram',kind:'para',a:7,b:4,params:[['Base','a',3,10,1],['Slanted side','b',3,8,1]]},
    reg:{label:'Regular polygon',kind:'reg',n:6,s:4,params:[['Sides','n',3,8,1],['Side length','s',2,9,1]]}
  }
};
/* ===== F12-04 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_04_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone,UN=C.unit,VW=420,VH=300;
function shape(st){var k=st.kind,pts,len;
  if(k==='rect'){pts=[[0,0],[st.a,0],[st.a,st.b],[0,st.b]];len=[st.a,st.b,st.a,st.b];return {pts:pts,len:len,given:[1,1,1,1]};}
  if(k==='L'){pts=[[0,0],[st.W,0],[st.W,st.H-st.nh],[st.W-st.nw,st.H-st.nh],[st.W-st.nw,st.H],[0,st.H]];len=[st.W,st.H-st.nh,st.nw,st.nh,st.W-st.nw,st.H];return {pts:pts,len:len,given:[1,1,0,0,1,1]};}
  if(k==='tri'){var hh=Math.sqrt(st.a*st.a-st.b*st.b/4);pts=[[0,0],[st.b,0],[st.b/2,-hh]];return {pts:pts,len:[st.b,st.a,st.a],given:[1,1,1]};}
  if(k==='para'){var lean=2,hp=Math.sqrt(st.b*st.b-lean*lean);pts=[[0,0],[st.a,0],[st.a+lean,-hp],[lean,-hp]];return {pts:pts,len:[st.a,st.b,st.a,st.b],given:[1,1,1,1]};}
  var n=st.n,R=st.s/(2*Math.sin(Math.PI/n));pts=[];for(var i=0;i<n;i++){var t=-Math.PI/2+i*2*Math.PI/n+(n===4?Math.PI/4:0);pts.push([R*Math.cos(t),R*Math.sin(t)]);}len=[];for(var j=0;j<n;j++){len.push(st.s);}return {pts:pts,len:len,given:len.map(function(){return 1;})};}
function total(len,t){var s=0,parts=[];for(var i=0;i<len.length&&i<Math.floor(t+1e-9);i++){s+=len[i];parts.push(len[i]);}return {sum:s,parts:parts};}
/* draw: o={t:trace position 0..n, hide:true shows ? for all sides, box:true dashed bounding rectangle} */
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var sh=shape(st),n=sh.len.length,t=o.t==null?n:o.t,fit=F.fit(sh.pts,VW,VH,64,70),Q=fit.pts,
  sv=S.root(VW,VH,'Shape with '+n+' sides to trace for perimeter.');sv.classList.add('f12-sv');
  NOVA.neonShape(sv,Q,{role:'support',width:1.6});
  if(o.box){var xs=Q.map(function(q){return q[0];}),ys=Q.map(function(q){return q[1];}),x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys);NOVA.neonShape(sv,[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],{role:'unknown',width:2,dash:'8 6',fill:false});}
  var done=Math.floor(t+1e-9),fr=t-done;
  for(var i=0;i<n;i++){var a=Q[i],b=Q[(i+1)%n],full=i<done,cur=i===done&&fr>1e-6&&done<n;
    NOVA.neonLine(sv,a[0],a[1],b[0],b[1],{role:full?'result':'given',width:full?4:3});
    if(cur)NOVA.neonLine(sv,a[0],a[1],a[0]+(b[0]-a[0])*fr,a[1]+(b[1]-a[1])*fr,{role:'focus',width:5});
    var ol=F.outward(Q,i,24),known=!o.hide&&(sh.given[i]||full),txt=known?fmt(Math.round(sh.len[i]*100)/100)+' '+UN:'?';
    S.pill(sv,ol[0],ol[1],txt,{role:cur?'focus':full?'result':(sh.given[i]&&!o.hide)?'given':'unknown',size:12});}
  var pi=Math.min(done,n-1),pa=Q[pi],pb=Q[(pi+1)%n],pos=done>=n?Q[0]:[pa[0]+(pb[0]-pa[0])*fr,pa[1]+(pb[1]-pa[1])*fr];
  var rg=NOVA.neonRing(sv,pos[0],pos[1],{role:'focus',r:9,pulse:false});if(rg)rg.setAttribute('data-maths','runner');
  stage.appendChild(sv);return {sh:sh,t:t,done:done};}
function chips(stage,sh,t,o){o=o||{};var n=sh.len.length,tt=total(sh.len,t),all=sh.len.reduce(function(a,b){return a+b;},0),exp=tt.parts.map(function(x){return fmt(Math.round(x*100)/100);}).join(' + ');
  var items=[];if(o.hide){items.push(['perimeter',o.hide+' '+UN,'given']);}else if(tt.parts.length)items.push(['so far',exp+' = '+fmt(Math.round(tt.sum*100)/100)+' '+UN,'focus']);
  if(!o.hide&&t>=n-1e-9)items.push(['perimeter',fmt(Math.round(all*100)/100)+' '+UN,'result']);if(o.formula)items.push([o.formula[0],o.formula[1],'op']);
  if(!items.length)items=[['perimeter','the distance all the way round','op']];strip(stage,items);}
var steps=[
 {name:'The outline',mood:'neutral',narration:'The perimeter is the distance all the way round the outside edge of a shape. Put a finger on one corner and get ready to walk round.',prompt:'Where does the perimeter start and end?',st:P.rect,t:0,target:'runner'},
 {name:'Trace a rectangle',mood:'focus',narration:'Walk round the rectangle adding as you go: 8, 5, 8, 5. Opposite sides are equal, so the perimeter is 2 times 8 plus 5, which is 26 centimetres.',prompt:'What is 8 + 5 + 8 + 5?',st:P.rect,t:4,formula:['shortcut','2 × (8 + 5)']},
 {name:'Missing sides',mood:'think',narration:'Two sides of this L-shape are not labelled. The top is 6 and the bottom step is 3, so the gap is 6 minus 3, which is 3. The left is 5 and the right step is 2, so the other gap is 5 minus 2, which is 3.',prompt:'How do you find the two missing sides?',st:P.lshape,t:0},
 {name:'Trace the L-shape',mood:'focus',narration:'Now every side is known. Walk round: 6, 2, 3, 3, 3, 5. They add to 22 centimetres.',prompt:'What do the six sides add up to?',st:P.lshape,t:6},
 {name:'A shortcut',mood:'think',narration:'The dashed rectangle is 6 by 5. Its perimeter is 2 times 6 plus 5, which is 22, exactly the same as the L-shape. The steps do not add any extra distance.',prompt:'Why is the L-shape perimeter equal to the box?',st:P.lshape,t:6,box:true,formula:['box 6 by 5','2 × (6 + 5)']},
 {name:'A regular shape',mood:'cheer',narration:'A regular hexagon has six equal sides of 4 centimetres. Add them all, or multiply: 6 times 4 is 24 centimetres.',prompt:'How many sides does a hexagon have?',st:P.reg,t:6,formula:['multiply','6 × 4']},
 {name:'Work backwards',mood:'think',narration:'A square has perimeter 36 centimetres and four equal sides. Share it out: 36 divided by 4 is 9, so each side is 9 centimetres.',prompt:'What is 36 divided by 4?',st:{kind:'reg',n:4,s:9},t:0,hide:36,formula:['divide','36 ÷ 4 = 9']}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Perimeter tracer · '+s.name,'step '+(i+1)+'/'+steps.length);var r=draw(stage,s.st,{t:s.t,hide:!!s.hide,box:s.box});chips(stage,r.sh,s.t,{hide:s.hide,formula:s.formula});NOVA.scene.helperStrip(stage,i===steps.length-1?'cheer':'explain',s.name);}
var def={id:'F12-04',title:'Perimeter tracer',config:C,steps:steps,render:render,
 alt:'Perimeter tracer: a neon ring walks round the edge of a shape, adding each side to a running total, including L-shapes with missing sides.',
 staticAlt:'Rectangle 8 cm by 5 cm: 8 + 5 + 8 + 5 = 26 cm. L-shape: sides 6, 2, 3, 3, 3, 5 = 22 cm, equal to the 6 by 5 bounding rectangle. Regular hexagon with side 4 cm: 24 cm. Square with perimeter 36 cm has sides 9 cm.',
 exploreIntro:'Explore: pick a shape, change its sides with the sliders, and drag the Trace slider to walk round the edge. The chips add the sides as you go.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset,st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[P[key]]):(clone(P[key]))),tr=0,sl,box=h('div');
   window.NovaLessonComponent?.applyExploreModels();function n(){return shape(st).len.length;}
   window.NovaLessonComponent?.applyExploreModels();function paint(){stage.innerHTML='';var r;NOVA.cap(stage,'Explore · '+P[key].label,'trace '+fmt(Math.round(tr*10)/10)+' / '+n());r=draw(stage,st,{t:tr});chips(stage,r.sh,tr,{formula:key==='rect'?['formula','2 × ('+st.a+' + '+st.b+')']:key==='L'?['formula','2 × ('+st.W+' + '+st.H+')']:key==='reg'?['formula',st.n+' × '+st.s]:null});NOVA.scene.helperStrip(stage,'explain',P[key].label);}
   window.NovaLessonComponent?.applyExploreModels();function build(){box.innerHTML='';st.params.forEach(function(q){box.appendChild(U.slider({label:q[0],min:q[2],max:q[3],step:q[4],value:st[q[1]],engine:'F12-04',onChange:function(v){st[q[1]]=v;if(key==='L'){st.nw=Math.min(st.nw,st.W-1);st.nh=Math.min(st.nh,st.H-1);}tr=Math.min(tr,n());sl.input.max=n();paint();}}));});
     sl=U.slider({label:'Trace',min:0,max:n(),step:.05,value:tr,engine:'F12-04',onChange:function(v){tr=v;paint();}});box.appendChild(sl);}
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Shape'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=key;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){key=pre.value;st=clone(P[key]);tr=0;build();paint();NOVA.events.emit('value',{engine:'F12-04',control:'preset',value:key});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Shape ',pre]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(box);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[h('button',{class:'nova-btn',text:'Trace to end',onclick:function(){tr=n();sl.set(tr);}}),h('button',{class:'nova-btn ghost',text:'Reset trace',onclick:function(){tr=0;sl.set(0);}})]));window.NovaLessonComponent?.applyExploreModels();build();window.NovaLessonComponent?.applyExploreModels();paint();},
 challenge:function(panel,api,stage){var stR=clone(P.rect),stL=clone(P.lshape),stT={kind:'reg',n:3,s:9};
   var tasks=[
    {q:'What is the perimeter of this rectangle, 8 cm by 5 cm?',build:NOVA.entryTask('Perimeter (cm)','F12-04'),check:function(x){var ok=x===26;return [ok,ok?'Yes: 8 + 5 + 8 + 5 = 26 cm.':x===40?'40 is the AREA (8 × 5). Perimeter is the distance round the edge.':x===13?'You added two sides. All four sides count: 2 × (8 + 5).':'Add all four sides: 8 + 5 + 8 + 5.'];},hint:'Opposite sides are equal. Walk round: 8, 5, 8, 5.',solve:function(c){c._A.input.value='26';}},
    {q:'Find the perimeter of the L-shape. Work out the two missing sides first.',build:NOVA.entryTask('Perimeter (cm)','F12-04'),check:function(x){var ok=x===22;return [ok,ok?'Yes: the missing sides are 3 and 3, so 6 + 2 + 3 + 3 + 3 + 5 = 22 cm.':x===16?'The missing sides still count. They are 6 − 3 = 3 and 5 − 2 = 3.':x===30?'30 is the area of the 6 by 5 box. Perimeter adds the sides.':'Find the two missing sides, then add all six.'];},hint:'Missing top step: 6 − 3. Missing side step: 5 − 2.',solve:function(c){c._A.input.value='22';}},
    {q:'An equilateral triangle has perimeter 27 cm. How long is each side?',build:NOVA.entryTask('Side (cm)','F12-04'),check:function(x){var ok=x===9;return [ok,ok?'Yes: 27 ÷ 3 = 9 cm.':x===81?'81 would be 27 × 3. Share the perimeter between 3 equal sides: divide.':x===24?'You took 3 away. Divide by the number of sides.':'Three equal sides share 27: divide by 3.'];},hint:'Three equal sides share the perimeter.',solve:function(c){c._A.input.value='9';}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['rectangle','L-shape','work backwards'][k]);var r=draw(stage,[stR,stL,stT][k],{t:0,hide:k===2});if(k===2)strip(stage,[['perimeter','27 cm','given'],['each side','?','unknown']]);else strip(stage,[['find','the perimeter','focus']]);NOVA.scene.helperStrip(stage,'think',['Add all four','Missing sides','Divide'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-04',def,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F12-04',num:'F12·04',title:'Perimeter tracer',def:def,linked:['F0-02','F0-04','F0-11','F0-12','F12-03','F12-14','F12-10'],
 spec:{purpose:'A neon ring walks round the edge of a shape, adding each side to a running total, so perimeter is seen as a distance, not a formula. Covers rectangles, L-shapes with missing sides, triangles, parallelograms and regular polygons, plus working backwards from a known perimeter.',
  params:'preset (rect, L, tri, para, reg) with named side parameters and slider ranges; trace position t from 0 to the number of sides; unit (cm). Sides come from per-shape geometry; label placement from NOVA.f12.outward. Core: NOVA.neonLine / neonShape / neonRing / svg.pill / neonTile. Year groups: KS3 Years 7–9 (12–15).',
  presets:'Rectangle · L-shape (missing sides) · Isosceles triangle · Parallelogram · Regular polygon',
  steps:'The outline → Trace a rectangle → Missing sides → Trace the L-shape → A shortcut → A regular shape → Work backwards. Each step has a Sir Bob line and a Guided prompt; the helper points at the ring.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: choose a shape, change its sides with sliders, drag the Trace slider to walk round; chips show the running sum and the formula. Challenge (3 tasks): rectangle perimeter; L-shape with two missing sides; side length from an equilateral perimeter. Events: value, correct, step, hintUsed.',
  traps:'Giving the area instead of the perimeter · adding only two sides of a rectangle · ignoring missing sides in a compound shape · multiplying instead of dividing when working backwards',
  gcse:'Extension: perimeter with algebraic sides, composite shapes with curves (arcs), arc length; linked: F12-03 geoboard, F12-10 compound shapes, F12-14 area and perimeter relationship'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

