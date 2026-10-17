
/* ===== F12-12 CONFIG: parameters + named presets ===== */
var NOVA_F12_12_CONFIG={
  startMode:'watch',
  preset:'eight',
  unit:'cm',
  presets:{
    eight:{label:'8 slices',r:5,n:8,m:0},
    many: {label:'32 slices, opened out',r:5,n:32,m:1},
    fine: {label:'64 slices, opened out',r:5,n:64,m:1}
  }
};
/* ===== F12-12 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_12_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone,UN=C.unit,VW=440,VH=280,PI=Math.PI;
function r2(x){return fmt(Math.round(x*100)/100);}
function wrap(a){while(a>PI)a-=2*PI;while(a<=-PI)a+=2*PI;return a;}
/* st={r,n (even),m (0 circle .. 1 interlocked)}; o.dims shows pi r and r; o.rad={txt,diam} labels the circle */
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var n=st.n,R=66,al=2*PI/n,rs=R*Math.sin(al/2),W=(n+1)*rs,m=st.m,CX=220,CY=118,yTop=CY-R/2,x0=CX-W/2+rs,
  sv=S.root(VW,VH,'A circle cut into '+n+' equal slices, '+(m>.98?'rearranged into a shape close to a rectangle':m>0?'opening out':'still a circle')+'.');sv.classList.add('f12-sv');
  if(m>.98&&o.dims!==false){NOVA.neonShape(sv,[[CX-PI*R/2,yTop],[CX+PI*R/2,yTop],[CX+PI*R/2,yTop+R],[CX-PI*R/2,yTop+R]],{role:'unknown',fill:false,width:1.8,dash:'8 6'});}
  for(var i=0;i<n;i++){var up=i%2===0,ti=i*al,tt=up?PI/2:-PI/2,th=ti+m*wrap(tt-ti),ax=CX+m*((x0+i*rs)-CX),ay=CY+m*((up?yTop:yTop+R*Math.cos(al/2))-CY),pts=[[ax,ay]],k=Math.max(3,Math.ceil(al/(PI/30)));
    for(var j=0;j<=k;j++){var b=-al/2+al*j/k;pts.push([ax+R*Math.cos(th+b),ay+R*Math.sin(th+b)]);}
    var role=up?'op':'focus';
    if(n<=16){var g=NOVA.neonShape(sv,pts,{role:role,hatch:up?null:'diag',width:2});if(i===0)g.setAttribute('data-maths','slice');}
    else{var c=S.c(role),d='M'+pts.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' L')+'Z';S.el('path',{d:d,css:'fill:'+c+';fill-opacity:.38;stroke:'+c+';stroke-width:.9;stroke-opacity:.9'},sv);}}
  if(m<.02&&o.rad){var e=[CX+R,CY],s=o.rad.diam?[CX-R,CY]:[CX,CY];NOVA.neonLine(sv,s[0],s[1],e[0],e[1],{role:'focus',width:3.4});S.pill(sv,CX+(o.rad.diam?0:R/2),CY-18,o.rad.txt,{role:'focus',size:12});}
  if(m>.98&&o.dims!==false){NOVA.dimLine(sv,CX-PI*R/2,yTop+R,CX+PI*R/2,yTop+R,'½ circumference = π × r',{role:'focus',off:24});NOVA.dimLine(sv,CX+PI*R/2,yTop+R,CX+PI*R/2,yTop,'r',{role:'op',off:22});}
  stage.appendChild(sv);}
function chips(stage,st,o){o=o||{};var r=st.r,items=[['radius',r+' '+UN,'given'],['slices',st.n,'op']];
  if(st.m>.98){items.push(['width','≈ '+r2(st.n*Math.sin(PI/st.n))+' × r  (π = '+r2(PI)+')','focus']);if(o.area)items.push(['area','π × '+r+' × '+r+' = '+r2(PI*r*r)+' '+UN+'²','result']);}else items.push(['area','?','unknown']);strip(stage,items);}
var steps=[
 {name:'Slice the circle',mood:'neutral',narration:'Cut a circle into equal slices, like a pizza, and colour them in turn. These are 8 sectors. We want the area of the circle, so we will rearrange the slices into a shape we know.',prompt:'How many slices are there?',st:{r:5,n:8,m:0},o:{rad:{txt:'r = 5 cm'}},c:{},target:'slice'},
 {name:'Open them out',mood:'focus',narration:'Open the slices out and turn every second slice upside down, so the points slot between each other.',prompt:'What do you notice about the two colours?',st:{r:5,n:8,m:.5},o:{},c:{}},
 {name:'Interlock',mood:'think',narration:'Slotted together the 8 slices make a bumpy shape, a bit like a parallelogram. The wiggly top and bottom are the curved edges of the slices.',prompt:'Is it a perfect parallelogram?',st:{r:5,n:8,m:1},o:{dims:false},c:{}},
 {name:'More slices',mood:'cheer',narration:'Use 32 slices and the bumps nearly vanish. The shape is almost a rectangle. With even more slices it would be exactly a rectangle.',prompt:'What happens to the bumps with more slices?',st:{r:5,n:32,m:1},o:{dims:false},c:{}},
 {name:'A rectangle',mood:'cheer',narration:'The height is the radius, r. The top and bottom together were the whole circumference, so each is half of it: half of 2πr is π times r. The width is π × r.',prompt:'What is the width of the rectangle?',st:{r:5,n:64,m:1},o:{},c:{area:1}},
 {name:'Use it',mood:'focus',narration:'Area of the rectangle is width times height: π × r times r, which is π × r × r, written π r squared. For radius 5: π × 25 is about 78.5 square centimetres.',prompt:'What is 5 × 5?',st:{r:5,n:64,m:1},o:{},c:{area:1}},
 {name:'Area or circumference?',mood:'think',narration:'Do not mix them up. Area is π times radius squared, 78.5, in square units. Circumference is 2 times π times radius, 31.4, in plain units. Square the radius, do not double it.',prompt:'Which one uses r squared?',st:{r:5,n:16,m:0},o:{rad:{txt:'r = 5 cm'}},c:{both:1}}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Circle area unwrap · '+s.name,'step '+(i+1)+'/'+steps.length);draw(stage,s.st,s.o);if(s.c.both)strip(stage,[['area π r²','π × 5² = '+r2(PI*25)+' '+UN+'²','result'],['circumference 2πr','2 × π × 5 = '+r2(2*PI*5)+' '+UN,'focus']]);else chips(stage,s.st,s.c);NOVA.scene.helperStrip(stage,i===steps.length-1?'think':'explain',s.name);}
var def={id:'F12-12',title:'Circle area unwrap',config:C,steps:steps,render:render,
 alt:'Circle area unwrap: a circle is cut into slices that are rearranged into an almost-rectangle of width half the circumference and height r, giving area pi r squared.',
 staticAlt:'Circle cut into 8, 32 or 64 slices and rearranged into a near-rectangle π × r wide and r tall; area π r², for r = 5 about 78.5 cm².',
 exploreIntro:'Explore: change the radius and the number of slices, then drag the open-out slider. With more slices the shape gets closer to a rectangle π r wide and r tall.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset,st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[P[key]]):(clone(P[key]))),box=h('div');
   window.NovaLessonComponent?.applyExploreModels();function pg(){stage.innerHTML='';NOVA.cap(stage,'Explore · '+st.n+' slices',st.m>.98?'rectangle':'open '+Math.round(st.m*100)+'%');draw(stage,st,{rad:{txt:'r = '+st.r+' cm'}});chips(stage,st,{area:1});NOVA.scene.helperStrip(stage,'explain','π r²');}
   window.NovaLessonComponent?.applyExploreModels();function build(){box.innerHTML='';box.appendChild(U.slider({label:'Radius',min:1,max:10,step:.5,value:st.r,engine:'F12-12',onChange:function(v){st.r=v;pg();}}));
     box.appendChild(U.slider({label:'Slices',min:4,max:64,step:4,value:st.n,engine:'F12-12',onChange:function(v){st.n=v;pg();}}));
     box.appendChild(U.slider({label:'Open out (0 to 1)',min:0,max:1,step:.05,value:st.m,engine:'F12-12',onChange:function(v){st.m=Math.round(v*100)/100;pg();}}));}
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Preset'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=key;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){key=pre.value;st=clone(P[key]);build();pg();NOVA.events.emit('value',{engine:'F12-12',control:'preset',value:key});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Preset ',pre]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(box);window.NovaLessonComponent?.applyExploreModels();build();window.NovaLessonComponent?.applyExploreModels();pg();},
 challenge:function(panel,api,stage){var A={r:6,n:16,m:0},B={r:5,n:16,m:0},Cc={r:5,n:16,m:0};
   var tasks=[
    {q:'A circle has radius 6 cm. What is its area? (1 decimal place)',build:NOVA.entryTask('Area (cm²)','F12-12'),check:function(x){var ok=Math.abs(x-113.1)<.4;return [ok,ok?'Yes: π × 6² = π × 36 ≈ 113.1 cm².':Math.abs(x-37.7)<.4?'That is the circumference (2 × π × 6). Area uses r squared.':Math.abs(x-226.2)<.6?'You doubled it. Area is π × r × r, with 6 × 6 = 36.':x===36?'That is r². Multiply by π as well.':Math.abs(x-452.4)<1?'You squared the diameter. Square the RADIUS, 6.':'Area = π × r².'];},hint:'r² = 36. Then multiply by π.',solve:function(c){c._A.input.value='113.1';}},
    {q:'A circle has area 78.5 cm². What is its radius? (nearest whole number)',build:NOVA.entryTask('Radius (cm)','F12-12'),check:function(x){var ok=Math.abs(x-5)<.1;return [ok,ok?'Yes: 78.5 ÷ π = 25, and the square root of 25 is 5.':x===25?'25 is r². Take the square root to get r.':Math.abs(x-10)<.1?'10 is the diameter. The radius is half of that.':x===12.5?'Divide by π, then square root. Do not just halve.':'Divide the area by π, then take the square root.'];},hint:'Divide by π to get r², then square root.',solve:function(c){c._A.input.value='5';}},
    {q:'A circle has diameter 10 cm. Which is its area?',build:NOVA.choiceTask(['π × 5² = 78.5 cm²','π × 10² = 314 cm²','π × 10 = 31.4 cm'],'F12-12'),check:function(x){var ok=x==='π × 5² = 78.5 cm²';return [ok,ok?'Yes: the radius is half the diameter, 5, and then π × 5².':x==='π × 10² = 314 cm²'?'You squared the diameter. Halve it first to get the radius, 5.':x==='π × 10 = 31.4 cm'?'That is the circumference, and it is not in square units.':'Pick one first.'];},hint:'Radius is half the diameter.',solve:function(c){c._G.set('π × 5² = 78.5 cm²');}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['area','work backwards','which area'][k]);draw(stage,[A,B,Cc][k],{rad:k===0?{txt:'r = 6 cm'}:k===2?{txt:'d = 10 cm',diam:true}:null});strip(stage,k===1?[['area','78.5 cm²','result'],['radius','?','unknown']]:[['find','the area','focus']]);NOVA.scene.helperStrip(stage,'think',['π r²','Work backwards','Radius first'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-12',def,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F12-12',num:'F12·12',title:'Circle area unwrap',def:def,linked:['F0-02','F0-11','F12-10','F12-11','F12-13','F13-08','F13-06'],
 spec:{purpose:'Where πr² comes from. A circle is cut into equal slices that are opened out and interlocked into a shape that tends to a rectangle of width half the circumference (π r) and height r, so area = π r × r. Also shows area versus circumference and working backwards from an area.',
  params:'preset (8, 32, 64 slices); radius r; number of slices n (even); open-out progress m (0 circle, 1 interlocked); unit cm. Each slice is a sector rotated and moved from its place in the circle to its place in the interlocked strip (apexes alternate up and down, spaced r sin(180°/n)). Core: NOVA.neonShape / dimLine / neonTile. Year groups: KS3 Years 7–9 (12–15).',
  presets:'8 slices · 32 slices, opened out · 64 slices, opened out',
  steps:'Slice the circle → Open them out → Interlock → More slices → A rectangle → Use it → Area or circumference? Each step has a Sir Bob line and a Guided prompt; the helper points at a slice.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: radius, slices and an open-out slider; chips show the width factor (approaching pi) and the area. Challenge (3 tasks): area from radius; radius from area; choose the right area for a circle given its diameter. Events: value, correct, step, hintUsed.',
  traps:'Using diameter instead of radius · doubling instead of squaring the radius · mixing up area with circumference · forgetting units are squared · stopping at r² without multiplying by π · taking the square root too early when working backwards',
  gcse:'Extension: answers in terms of π, area of sectors and annuli, composite shapes with circles, volume of a cylinder as base area × height; linked: F12-11 circumference, F12-13 arcs and sectors, F13-08 cylinder unroll, F13-06 prism volume'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

