
/* ===== F12-07 CONFIG: parameters + named presets ===== */
var NOVA_F12_07_CONFIG={
  startMode:'watch',
  preset:'acute',
  unit:'cm',
  presets:{
    acute: {label:'Acute-angled triangle',b:6,h:4,p:2,th:0},
    right: {label:'Right-angled triangle',b:6,h:4,p:0,th:0},
    obtuse:{label:'Obtuse triangle (height outside)',b:4,h:4,p:7,th:0},
    wide:  {label:'Wide and flat',b:9,h:3,p:4,th:0}
  }
};
/* ===== F12-07 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_07_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone,UN=C.unit,VW=440,VH=270;
/* st={b,h,p (apex x),th (turn angle 0..180)}; triangle A(0,0) B(b,0) C(p,-h); turn a copy 180° about the midpoint M of AC */
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var b=st.b,hh=st.h,p=st.p,A=[0,0],B=[b,0],Cc=[p,-hh],M=[(B[0]+Cc[0])/2,(B[1]+Cc[1])/2],Ap=[B[0]+Cc[0],B[1]+Cc[1]],
  tri=[A,B,Cc],uni=[A,B,Cc,Ap,[p,0]].concat(o.p2!=null?[[o.p2,-hh],[o.p2,0]]:[]);[45,90,135].forEach(function(d){uni=uni.concat(F.rot(tri,M,d));});var m=F.map(uni,VW,VH,54,46),cp=F.rot(tri,M,st.th),
  sv=S.root(VW,VH,'Triangle with base '+b+' '+UN+' and height '+hh+' '+UN+(st.th>=180?', doubled into a parallelogram':'')+'.');sv.classList.add('f12-sv');
  if(st.th>=180){NOVA.neonShape(sv,m([A,B,Ap,Cc]),{role:'result',fill:false,width:2,dash:'8 6'});}
  if(st.th>0||o.ghost){var g2=NOVA.neonShape(sv,m(cp),{role:'focus',hatch:'diag',width:3});g2.setAttribute('data-maths','copy');}
  if(o.p2!=null){NOVA.neonShape(sv,m([A,B,[o.p2,-hh]]),{role:'result',hatch:'dots',width:3});F.dash(sv,m([[o.p2,-hh]])[0],m([[o.p2,0]])[0],'result',2);}
  var g=NOVA.neonShape(sv,m(tri),{role:'op',hatch:st.th>0?null:'cross',width:3});g.setAttribute('data-maths','shape');
  var Bm=m([A,B]);NOVA.dimLine(sv,Bm[0][0],Bm[0][1],Bm[1][0],Bm[1][1],fmt(b)+' '+UN,{role:'given',off:26});
  if(o.height!==false){var ap=m([Cc])[0],ft=m([[p,0]])[0];F.hmark(sv,ap,ft,Bm[0],Bm[1],fmt(hh)+' '+UN,{role:'focus',dx:p>b?-30:p<0?30:(p<b/2?30:-30)});}
  stage.appendChild(sv);}
function chips(stage,st,o){o=o||{};var tri=st.b*st.h/2,items=[['base',fmt(st.b)+' '+UN,'given'],['height',fmt(st.h)+' '+UN,'focus']];
  if(st.th>=180)items.push(['parallelogram',st.b+' × '+st.h+' = '+st.b*st.h+' '+UN+'²','result']);items.push(['triangle','½ × '+st.b+' × '+st.h+' = '+fmt(tri)+' '+UN+'²',st.th>=180?'result':'op']);strip(stage,items);}
var steps=[
 {name:'A triangle',mood:'neutral',narration:'This triangle has a base of 6 and a perpendicular height of 4. The height goes straight up from the base to the top corner, at a right angle.',prompt:'Where does the height meet the base?',st:{b:6,h:4,p:2,th:0},o:{}},
 {name:'Make a copy',mood:'focus',narration:'Make an exact copy of the triangle. We will turn the copy upside down and fit it against the first one.',prompt:'Is the copy the same size?',st:{b:6,h:4,p:2,th:0},o:{ghost:1}},
 {name:'Turn the copy',mood:'think',narration:'Half-turn the copy about the middle of the longest side. It swings round to fill the gap beside the first triangle.',prompt:'Where is the copy heading?',st:{b:6,h:4,p:2,th:90},o:{},target:'copy'},
 {name:'A parallelogram',mood:'cheer',narration:'The two triangles make a parallelogram with base 6 and height 4. Its area is 6 times 4, which is 24.',prompt:'What is the area of the parallelogram?',st:{b:6,h:4,p:2,th:180},o:{},target:'copy'},
 {name:'Half of it',mood:'cheer',narration:'The triangle is exactly half of the parallelogram. So the area of a triangle is half times base times height: half of 24 is 12.',prompt:'What is half of 24?',st:{b:6,h:4,p:2,th:180},o:{},target:'shape'},
 {name:'A right-angled triangle',mood:'think',narration:'For a right-angled triangle the height is one of the sides. Two copies make a rectangle 6 by 4. The triangle is half of it: 12.',prompt:'What is the height here?',st:{b:6,h:4,p:0,th:180},o:{}},
 {name:'The height can sit outside',mood:'think',narration:'In an obtuse triangle the top corner leans past the base. Extend the base with a dotted line and measure straight up to it. The rule still works: half times 4 times 4 is 8.',prompt:'Why extend the base?',st:{b:4,h:4,p:7,th:180},o:{}}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Triangle area by doubling · '+s.name,'step '+(i+1)+'/'+steps.length);draw(stage,s.st,s.o);chips(stage,s.st);NOVA.scene.helperStrip(stage,i===steps.length-1?'think':'explain',s.name);}
var def={id:'F12-07',title:'Triangle area by doubling',config:C,steps:steps,render:render,
 alt:'Triangle area by doubling: a copy of a triangle is half-turned to make a parallelogram, so the triangle area is half base times height.',
 staticAlt:'Triangle base 6, height 4: two copies make a parallelogram of area 24, so the triangle has area 12. Works for acute, right-angled and obtuse triangles.',
 exploreIntro:'Explore: pick a triangle, change its base, height and top corner, then drag the turn slider to half-turn the copy. The area is always half of base times height.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset,st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[P[key]]):(clone(P[key]))),box=h('div');
   window.NovaLessonComponent?.applyExploreModels();function pg(){stage.innerHTML='';NOVA.cap(stage,'Explore · '+P[key].label,'turn '+Math.round(st.th)+'°');draw(stage,st,{ghost:true});chips(stage,st);NOVA.scene.helperStrip(stage,'explain','½ × base × height');}
   window.NovaLessonComponent?.applyExploreModels();function build(){box.innerHTML='';
     box.appendChild(U.slider({label:'Base',min:3,max:10,step:1,value:st.b,engine:'F12-07',onChange:function(v){st.b=v;pg();}}));
     box.appendChild(U.slider({label:'Height',min:2,max:6,step:1,value:st.h,engine:'F12-07',onChange:function(v){st.h=v;pg();}}));
     box.appendChild(U.slider({label:'Top corner position',min:-3,max:12,step:1,value:st.p,engine:'F12-07',onChange:function(v){st.p=v;pg();}}));
     box.appendChild(U.slider({label:'Turn the copy (degrees)',min:0,max:180,step:5,value:st.th,unit:'°',engine:'F12-07',onChange:function(v){st.th=v;pg();}}));}
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Triangle'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=key;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){key=pre.value;st=clone(P[key]);build();pg();NOVA.events.emit('value',{engine:'F12-07',control:'preset',value:key});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Triangle ',pre]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(box);window.NovaLessonComponent?.applyExploreModels();build();window.NovaLessonComponent?.applyExploreModels();pg();},
 challenge:function(panel,api,stage){var T1={b:10,h:6,p:4,th:0},T2={b:8,h:5,p:3,th:0},T3={b:6,h:4,p:1,th:0};
   var tasks=[
    {q:'A triangle has base 10 cm and height 6 cm. What is its area?',build:NOVA.entryTask('Area (cm²)','F12-07'),check:function(x){var ok=x===30;return [ok,ok?'Yes: ½ × 10 × 6 = 30 cm².':x===60?'60 is base × height, which is the parallelogram. The triangle is half of it.':x===16?'Do not add. Multiply, then halve.':'Half of base times height.'];},hint:'Base times height first, then halve it.',solve:function(c){c._A.input.value='30';}},
    {q:'A triangle has area 20 cm² and base 8 cm. How tall is it?',build:NOVA.entryTask('Height (cm)','F12-07'),check:function(x){var ok=x===5;return [ok,ok?'Yes: 8 × 5 = 40, and half of 40 is 20.':x===2.5?'That halved again. Double the area first: 40 ÷ 8 = 5.':x===12?'That is 20 − 8. Work backwards: double the area, then divide by the base.':'Double the area (40), then divide by the base.'];},hint:'Double 20, then divide by 8.',solve:function(c){c._A.input.value='5';}},
    {q:'Two triangles have the same base and the same height, but different top corners. Which has the bigger area?',build:NOVA.choiceTask(['Neither: they are equal','The leaning one','The upright one'],'F12-07'),check:function(x){var ok=x==='Neither: they are equal';return [ok,ok?'Yes: area only depends on base and height.':x==='The leaning one'?'It looks bigger because it stretches out, but its height is no bigger.':x==='The upright one'?'Same base and same height give the same area.':'Pick one first.'];},hint:'Area = ½ × base × height. Did the base or height change?',solve:function(c){c._G.set('Neither: they are equal');}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['area','work backwards','same base and height'][k]);
     if(k===2){draw(stage,T3,{p2:5});strip(stage,[['both','base 6, height 4','given']]);}
     else{draw(stage,k===0?T1:T2,{height:true});strip(stage,k===0?[['find','the area','focus']]:[['area','20 cm²','result'],['height','?','unknown']]);}
     NOVA.scene.helperStrip(stage,'think',['Half × base × height','Work backwards','Equal?'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-07',def,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F12-07',num:'F12·07',title:'Triangle area by doubling',def:def,linked:['F0-02','F0-11','F12-05','F12-06','F12-08','F12-10'],
 spec:{purpose:'Why a triangle has half the area of the parallelogram built from two copies. A copy of the triangle is half-turned about the middle of one side to make a parallelogram with the same base and height, so the area is half base times height. Works for acute, right-angled and obtuse triangles, including a height that falls outside the base.',
  params:'preset (acute, right, obtuse, wide); base, height, top-corner position; turn angle 0 to 180. Geometry by NOVA.f12.rot / map / hmark; core NOVA.neonShape / dimLine. Unit cm. Year groups: KS3 Years 7–9 (12–15).',
  presets:'Acute-angled · Right-angled · Obtuse (height outside) · Wide and flat',
  steps:'A triangle → Make a copy → Turn the copy → A parallelogram → Half of it → A right-angled triangle → The height can sit outside. Each step has a Sir Bob line and a Guided prompt; the helper points at the copy.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: triangle type, base, height, top-corner position and a turn slider; chips show parallelogram and triangle areas. Challenge (3 tasks): area from base and height; height from area and base; same base and height means same area. Events: value, correct, step, hintUsed.',
  traps:'Forgetting to halve · using a slanted side as the height · thinking a leaning triangle is bigger · halving twice when working backwards',
  gcse:'Extension: area ½ab sin C, Heron preview, area of triangles on coordinate grids; linked: F12-06 parallelogram, F12-08 trapezium, F11-03 angles'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

