
/* ===== F12-08 CONFIG: parameters + named presets ===== */
var NOVA_F12_08_CONFIG={
  startMode:'watch',
  preset:'general',
  unit:'cm',
  presets:{
    general:{label:'Trapezium',a:4,b:8,h:5,x0:1,th:0,mode:'double'},
    isos:   {label:'Isosceles trapezium',a:4,b:8,h:5,x0:2,th:0,mode:'double'},
    right:  {label:'Right-angled trapezium',a:3,b:7,h:4,x0:0,th:0,mode:'double'},
    midline:{label:'Mean width method',a:4,b:8,h:5,x0:1,th:0,mode:'mid'}
  }
};
/* ===== F12-08 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_08_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone,UN=C.unit,VW=440,VH=270;
/* A(0,0) B(b,0) C(x0+a,-h) D(x0,-h); copy turned 180° about the middle of leg BC */
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var a=st.a,b=st.b,hh=st.h,x0=st.x0,A=[0,0],B=[b,0],Cc=[x0+a,-hh],D=[x0,-hh],Mi=[(B[0]+Cc[0])/2,(B[1]+Cc[1])/2],
  Ap=[B[0]+Cc[0]-A[0],B[1]+Cc[1]-A[1]],Dp=[B[0]+Cc[0]-D[0],B[1]+Cc[1]-D[1]],trap=[A,B,Cc,D],uni=[A,B,Cc,D,Ap,Dp];if(st.mode==='double')[45,90,135].forEach(function(d){uni=uni.concat(F.rot(trap,Mi,d));});var m=F.map(uni,VW,VH,50,40),cp=F.rot(trap,Mi,st.th),
  sv=S.root(VW,VH,'Trapezium with parallel sides '+a+' '+UN+' and '+b+' '+UN+' and height '+hh+' '+UN+'.');sv.classList.add('f12-sv');
  if(st.mode==='double'){if(st.th>=180)NOVA.neonShape(sv,m([A,Dp,Ap,D]),{role:'result',fill:false,width:2,dash:'8 6'});if(st.th>0||o.ghost){var g2=NOVA.neonShape(sv,m(cp),{role:'focus',hatch:'diag',width:3});g2.setAttribute('data-maths','copy');}}
  var g=NOVA.neonShape(sv,m(trap),{role:'op',hatch:(st.mode==='double'&&st.th>0)?null:'cross',width:3});g.setAttribute('data-maths','shape');
  if(st.mode==='mid'||o.mid){var ml=m([[ (A[0]+D[0])/2,-hh/2],[(B[0]+Cc[0])/2,-hh/2]]);NOVA.neonLine(sv,ml[0][0],ml[0][1],ml[1][0],ml[1][1],{role:'result',width:3});S.pill(sv,ml[0][0]+(ml[1][0]-ml[0][0])*.8,ml[0][1],fmt((a+b)/2)+' '+UN,{role:'result',size:12});}
  var Tm=m([D,Cc]),Bm=m([A,B]);NOVA.dimLine(sv,Tm[0][0],Tm[0][1],Tm[1][0],Tm[1][1],fmt(a)+' '+UN,{role:'op',off:-24});NOVA.dimLine(sv,Bm[0][0],Bm[0][1],Bm[1][0],Bm[1][1],fmt(b)+' '+UN,{role:'given',off:26});
  NOVA.parTick(sv,Tm[0][0],Tm[0][1],Tm[1][0],Tm[1][1],1,{role:'support'});NOVA.parTick(sv,Bm[0][0],Bm[0][1],Bm[1][0],Bm[1][1],1,{role:'support'});
  var ft=m([[x0,0]])[0],ap=m([D])[0];F.hmark(sv,ap,ft,Bm[0],Bm[1],fmt(hh)+' '+UN,{role:'focus',dx:x0<b/2?28:-28});
  stage.appendChild(sv);}
function chips(stage,st,o){var area=(st.a+st.b)*st.h/2,items=[['parallel sides',st.a+' and '+st.b,'given'],['height',st.h+' '+UN,'focus']];
  if(st.mode==='double'&&st.th>=180)items.push(['parallelogram','('+st.a+' + '+st.b+') × '+st.h+' = '+(st.a+st.b)*st.h,'result']);
  if(st.mode==='mid')items.push(['mean width','('+st.a+' + '+st.b+') ÷ 2 = '+fmt((st.a+st.b)/2),'result']);
  items.push(['trapezium','½ × ('+st.a+' + '+st.b+') × '+st.h+' = '+fmt(area)+' '+UN+'²',(st.mode==='mid'||st.th>=180)?'result':'op']);strip(stage,items);}
var steps=[
 {name:'A trapezium',mood:'neutral',narration:'A trapezium has one pair of parallel sides. Here they are 4 and 8, and the distance between them, the height, is 5.',prompt:'Which sides are parallel?',st:{a:4,b:8,h:5,x0:1,th:0,mode:'double'},o:{}},
 {name:'Make a copy',mood:'focus',narration:'Make an exact copy of the trapezium. We will half-turn it and fit it against the first one.',prompt:'How big is the copy?',st:{a:4,b:8,h:5,x0:1,th:0,mode:'double'},o:{ghost:1}},
 {name:'Turn the copy',mood:'think',narration:'Half-turn the copy about the middle of the slanted side. Its short side lines up beside the long side of the first one.',prompt:'Which side joins which?',st:{a:4,b:8,h:5,x0:1,th:90,mode:'double'},o:{},target:'copy'},
 {name:'A parallelogram',mood:'cheer',narration:'Together they make a parallelogram. Its base is 4 plus 8, which is 12, and its height is still 5. Area: 12 times 5 is 60.',prompt:'What is the base of the parallelogram?',st:{a:4,b:8,h:5,x0:1,th:180,mode:'double'},o:{},target:'copy'},
 {name:'Half of it',mood:'cheer',narration:'The trapezium is half of the parallelogram. Half times (4 + 8) times 5: half of 60 is 30 square centimetres.',prompt:'What is half of 60?',st:{a:4,b:8,h:5,x0:1,th:180,mode:'double'},o:{},target:'shape'},
 {name:'Mean width',mood:'think',narration:'Another view: add the parallel sides and halve, 4 plus 8 over 2 is 6. That is the average width, halfway up. Average width times height: 6 times 5 is 30.',prompt:'What is the average of 4 and 8?',st:{a:4,b:8,h:5,x0:1,th:0,mode:'mid'},o:{}},
 {name:'Right-angled trapezium',mood:'think',narration:'The rule works for any trapezium, even one with a vertical side. Parallel sides 3 and 7, height 4: half times 10 times 4 is 20.',prompt:'Which side is the height here?',st:{a:3,b:7,h:4,x0:0,th:180,mode:'double'},o:{}}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Trapezium area · '+s.name,'step '+(i+1)+'/'+steps.length);draw(stage,s.st,s.o);chips(stage,s.st);NOVA.scene.helperStrip(stage,i===steps.length-1?'think':'explain',s.name);}
var def={id:'F12-08',title:'Trapezium area',config:C,steps:steps,render:render,
 alt:'Trapezium area: a copy is half-turned to make a parallelogram of base a plus b, so the area is half of (a + b) times the height; the mean width method gives the same answer.',
 staticAlt:'Trapezium parallel sides 4 and 8, height 5: two copies make a parallelogram of base 12 and area 60, so the trapezium has area 30. Mean width 6 times height 5 is also 30.',
 exploreIntro:'Explore: change the parallel sides, height and slant. Drag the turn slider to double the trapezium, or switch to the mean-width method.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset,st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[P[key]]):(clone(P[key]))),box=h('div');
   window.NovaLessonComponent?.applyExploreModels();function pg(){stage.innerHTML='';NOVA.cap(stage,'Explore · '+P[key].label,st.mode==='mid'?'mean width':'turn '+Math.round(st.th)+'°');draw(stage,st,{ghost:st.mode==='double'});chips(stage,st);NOVA.scene.helperStrip(stage,'explain','½ × (a + b) × h');}
   window.NovaLessonComponent?.applyExploreModels();function build(){box.innerHTML='';
     box.appendChild(U.slider({label:'Top side a',min:2,max:8,step:1,value:st.a,engine:'F12-08',onChange:function(v){st.a=v;pg();}}));
     box.appendChild(U.slider({label:'Bottom side b',min:3,max:10,step:1,value:st.b,engine:'F12-08',onChange:function(v){st.b=v;pg();}}));
     box.appendChild(U.slider({label:'Height',min:2,max:6,step:1,value:st.h,engine:'F12-08',onChange:function(v){st.h=v;pg();}}));
     box.appendChild(U.slider({label:'Slant (top corner position)',min:0,max:6,step:1,value:st.x0,engine:'F12-08',onChange:function(v){st.x0=v;pg();}}));
     if(st.mode==='double')box.appendChild(U.slider({label:'Turn the copy (degrees)',min:0,max:180,step:5,value:st.th,unit:'°',engine:'F12-08',onChange:function(v){st.th=v;pg();}}));}
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Trapezium'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=key;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){key=pre.value;st=clone(P[key]);mo.value=st.mode;build();pg();NOVA.events.emit('value',{engine:'F12-08',control:'preset',value:key});};
   window.NovaLessonComponent?.applyExploreModels();var mo=h('select',{class:'nova-input','aria-label':'Method'});window.NovaLessonComponent?.applyExploreModels();[['double','Double it (parallelogram)'],['mid','Mean width']].forEach(function(o){mo.appendChild(h('option',{value:o[0],text:o[1]}));});window.NovaLessonComponent?.applyExploreModels();mo.value=st.mode;
   window.NovaLessonComponent?.applyExploreModels();mo.onchange=function(){st.mode=mo.value;if(st.mode==='mid')st.th=0;build();pg();NOVA.events.emit('value',{engine:'F12-08',control:'method',value:st.mode});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Trapezium ',pre]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Method ',mo]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(box);window.NovaLessonComponent?.applyExploreModels();build();window.NovaLessonComponent?.applyExploreModels();pg();},
 challenge:function(panel,api,stage){var T1={a:5,b:9,h:4,x0:1,th:0,mode:'double'},T2={a:7,b:5,h:6,x0:0,th:0,mode:'double'},T3={a:6,b:10,h:3,x0:2,th:0,mode:'double'};
   var tasks=[
    {q:'A trapezium has parallel sides 5 cm and 9 cm and height 4 cm. What is its area?',build:NOVA.entryTask('Area (cm²)','F12-08'),check:function(x){var ok=x===28;return [ok,ok?'Yes: ½ × (5 + 9) × 4 = 28 cm².':x===56?'56 is the doubled parallelogram. The trapezium is half of it.':x===36?'That is 9 × 4. Use the AVERAGE of the two parallel sides.':'Half of (5 + 9) times 4.'];},hint:'Add the parallel sides: 14. Multiply by the height, then halve.',solve:function(c){c._A.input.value='28';}},
    {q:'A trapezium has area 36 cm² and parallel sides 7 cm and 5 cm. How tall is it?',build:NOVA.entryTask('Height (cm)','F12-08'),check:function(x){var ok=x===6;return [ok,ok?'Yes: (7 + 5) × 6 = 72, half of 72 is 36.':x===3?'That halved twice. Double the area first: 72 ÷ 12 = 6.':x===24?'Check: area × 2 ÷ (7 + 5).':'Double the area (72) then divide by 7 + 5.'];},hint:'Double 36, then divide by (7 + 5).',solve:function(c){c._A.input.value='6';}},
    {q:'Parallel sides 6 cm and 10 cm, height 3 cm. Which is the area?',build:NOVA.choiceTask(['24 cm²','48 cm²','30 cm²'],'F12-08'),check:function(x){var ok=x==='24 cm²';return [ok,ok?'Yes: ½ × 16 × 3 = 24 cm².':x==='48 cm²'?'48 forgot the half: that is the parallelogram.':x==='30 cm²'?'30 is 10 × 3. Use the average width, 8.':'Pick one first.'];},hint:'Average width is 8. Times the height 3.',solve:function(c){c._G.set('24 cm²');}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['area','work backwards','which area'][k]);var s=[T1,T2,T3][k];draw(stage,s,{});strip(stage,k===1?[['area','36 cm²','result'],['height','?','unknown']]:[['find','the area','focus']]);NOVA.scene.helperStrip(stage,'think',['½ (a + b) h','Work backwards','Which?'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-08',def,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F12-08',num:'F12·08',title:'Trapezium area',def:def,linked:['F0-02','F0-11','F12-06','F12-07','F12-09','F12-10'],
 spec:{purpose:'Why the area of a trapezium is half of (a + b) times h. A copy is half-turned about the middle of a slanted side to make a parallelogram with base a + b, so the trapezium is half of it; the mean-width view (average of the parallel sides times height) is shown as the same result.',
  params:'preset (general, isosceles, right, midline); parallel sides a and b, height h, slant x0, turn angle, method (double, mean width). Geometry by NOVA.f12.rot / map / hmark; core NOVA.neonShape / dimLine / parTick. Unit cm. Year groups: KS3 Years 7–9 (12–15).',
  presets:'Trapezium · Isosceles trapezium · Right-angled trapezium · Mean width method',
  steps:'A trapezium → Make a copy → Turn the copy → A parallelogram → Half of it → Mean width → Right-angled trapezium. Each step has a Sir Bob line and a Guided prompt; the helper points at the copy.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: preset, method, a, b, height, slant and a turn slider; chips show the parallelogram and trapezium areas. Challenge (3 tasks): area from a, b and h; height from area; choose the correct area from three, one of which forgets the half. Events: value, correct, step, hintUsed.',
  traps:'Forgetting to halve · multiplying only one parallel side by the height · using the slanted side as the height · halving twice when working backwards',
  gcse:'Extension: area of trapezia with algebraic sides, compound shapes with trapezia, rearranging the formula; linked: F12-06 parallelogram, F12-07 triangle, F12-10 compound shapes'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

