
/* ===== F12-13 CONFIG: parameters + named presets ===== */
var NOVA_F12_13_CONFIG={
  startMode:'watch',
  preset:'quarter',
  unit:'cm',
  presets:{
    quarter:  {label:'Quarter circle (90°)',r:6,a:90},
    semi:     {label:'Semicircle (180°)',r:6,a:180},
    sixth:    {label:'Sixth of a circle (60°)',r:6,a:60},
    threeq:   {label:'Three-quarter circle (270°)',r:6,a:270},
    custom:   {label:'Choose your own angle',r:6,a:135}
  }
};
/* ===== F12-13 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_13_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone,UN=C.unit,VW=440,VH=290,PI=Math.PI;
function r2(x){return fmt(Math.round(x*100)/100);}
function gcd(a,b){return b?gcd(b,a%b):a;}
function frac(a){var g=gcd(a,360);return (a/g)+'/'+(360/g);}
function circ(sv,cx,cy,R,role,w,dash){return NOVA.neonPath(sv,'M'+(cx-R)+','+cy+' a'+R+','+R+' 0 1,0 '+2*R+',0 a'+R+','+R+' 0 1,0 '+(-2*R)+',0',{role:role,width:w||3,dash:dash});}
function pt(cx,cy,R,rad){return [cx+R*Math.cos(rad),cy+R*Math.sin(rad)];}
/* sector symmetric about the upward direction; st={r,a}; o:{bar,labels} */
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var R=88,cx=220,cy=128,a=st.a,th=a*PI/180,mid=-PI/2,a0=mid-th/2,a1=mid+th/2,sv=S.root(VW,VH,'Circle of radius '+st.r+' '+UN+' with a sector of '+a+' degrees: arc '+r2(a/360*2*PI*st.r)+' '+UN+', area '+r2(a/360*PI*st.r*st.r)+' '+UN+' squared.');sv.classList.add('f12-sv');
  circ(sv,cx,cy,R,'support',1.8);
  var k=Math.max(4,Math.ceil(a/6)),pts=[[cx,cy]],arc=[];for(var i=0;i<=k;i++){var an=a0+th*i/k,q=pt(cx,cy,R,an);pts.push(q);arc.push(q);}
  var g=NOVA.neonShape(sv,a>=359.9?arc:pts,{role:'op',hatch:'cross',width:3});g.setAttribute('data-maths','sector');
  NOVA.neonPath(sv,'M'+arc.map(function(q){return q[0]+','+q[1];}).join(' L'),{role:'result',width:5.5});
  var an0=pt(cx,cy,26,a0),an1=pt(cx,cy,26,a1);NOVA.neonPath(sv,'M'+an0[0]+','+an0[1]+' A26,26 0 '+(a>180?1:0)+',1 '+an1[0]+','+an1[1],{role:'focus',width:2.6});
  var ip=pt(cx,cy,a>=60?R*.56:R*.62,mid);S.pill(sv,ip[0],ip[1]+(a<60?0:0),a+'°',{role:'focus',size:13});
  var op=pt(cx,cy,R+22,mid);S.pill(sv,op[0],Math.max(16,op[1]),'arc '+r2(a/360*2*PI*st.r)+' '+UN,{role:'result',size:12});
  var rp=pt(cx,cy,R*.5,a1);if(a<300)S.pill(sv,rp[0]+(Math.cos(a1)>0?22:-22),rp[1]+8,'r = '+st.r,{role:'given',size:11});
  if(o.bar!==false){var bx=60,by=258,bw=320,bh=18;NOVA.neonShape(sv,[[bx,by],[bx+bw,by],[bx+bw,by+bh],[bx,by+bh]],{role:'unknown',fill:false,width:1.8,dash:'6 5'});NOVA.neonShape(sv,[[bx,by],[bx+bw*a/360,by],[bx+bw*a/360,by+bh],[bx,by+bh]],{role:'op',hatch:'cross',width:2.4});S.pill(sv,bx+bw/2,by-14,a+' ÷ 360 = '+frac(a)+' of the circle',{role:'op',size:12});}
  stage.appendChild(sv);}
function chips(stage,st,o){o=o||{};var r=st.r,a=st.a,f=a/360,arc=f*2*PI*r,ar=f*PI*r*r,items=[['fraction',frac(a),'op']];
  if(o.arc)items.push(['arc length',frac(a)+' × 2π × '+r+' = '+r2(arc)+' '+UN,'result']);if(o.area)items.push(['sector area',frac(a)+' × π × '+r+'² = '+r2(ar)+' '+UN+'²','result']);if(o.per)items.push(['sector perimeter',r2(arc)+' + '+r+' + '+r+' = '+r2(arc+2*r)+' '+UN,'focus']);
  if(!o.arc&&!o.area&&!o.per)items.push(['radius',r+' '+UN,'given']);strip(stage,items);}
var steps=[
 {name:'Sector and arc',mood:'neutral',narration:'A sector is a slice of a circle, like a slice of pizza. It is bounded by two radii and a piece of the edge. That piece of the edge is called an arc.',prompt:'Which part of the sector is the arc?',st:{r:6,a:90},c:{},target:'sector'},
 {name:'What fraction?',mood:'focus',narration:'The angle at the centre tells us what fraction of the whole circle we have. A full turn is 360 degrees, so 90 degrees is 90 out of 360, which is one quarter.',prompt:'What fraction of the circle is 90 degrees?',st:{r:6,a:90},c:{}},
 {name:'Arc length',mood:'think',narration:'The arc is the same fraction of the circumference. Radius 6 gives circumference 2 × π × 6, about 37.7. One quarter of that is about 9.42 centimetres.',prompt:'What is a quarter of 37.7?',st:{r:6,a:90},c:{arc:1}},
 {name:'Sector area',mood:'think',narration:'The sector is the same fraction of the whole circle area. The area of the circle is π × 6², about 113.1. One quarter of that is about 28.27 square centimetres.',prompt:'What is a quarter of 113.1?',st:{r:6,a:90},c:{area:1,arc:1}},
 {name:'Another angle',mood:'cheer',narration:'Try 60 degrees. That is 60 out of 360, which is one sixth. Arc length: a sixth of 37.7 is 6.28. Sector area: a sixth of 113.1 is 18.85.',prompt:'What fraction is 60 degrees?',st:{r:6,a:60},c:{area:1,arc:1}},
 {name:'Sector perimeter',mood:'think',narration:'The perimeter of a sector is not just the arc. Walk right round it: the arc, then back along both radii. 6.28 + 6 + 6 = 18.28 centimetres.',prompt:'Why add two radii?',st:{r:6,a:60},c:{per:1,arc:1}},
 {name:'Big sectors',mood:'cheer',narration:'The method works above 180 degrees too. 270 degrees is three quarters of the circle: arc 28.27, area 84.82.',prompt:'What fraction is 270 degrees?',st:{r:6,a:270},c:{area:1,arc:1}}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Arc and sector explorer · '+s.name,'step '+(i+1)+'/'+steps.length);draw(stage,s.st);chips(stage,s.st,s.c);NOVA.scene.helperStrip(stage,i===steps.length-1?'cheer':'explain',s.name);}
var def={id:'F12-13',title:'Arc and sector explorer',config:C,steps:steps,render:render,
 alt:'Arc and sector explorer: a sector of angle a is a/360 of a circle, so its arc is a/360 of the circumference and its area is a/360 of the circle area.',
 staticAlt:'Radius 6 cm, 90 degree sector: fraction 1/4, arc about 9.42 cm, area about 28.27 cm², perimeter about 21.42 cm. Radius 6, 60 degrees: one sixth, arc 6.28, area 18.85.',
 exploreIntro:'Explore: change the angle and the radius. The bar shows the fraction of the circle; the chips give the arc, the area and the perimeter of the sector.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset,st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[P[key]]):(clone(P[key]))),box=h('div');
   window.NovaLessonComponent?.applyExploreModels();function pg(){stage.innerHTML='';NOVA.cap(stage,'Explore · sector',st.a+'°');draw(stage,st);chips(stage,st,{arc:1,area:1,per:1});NOVA.scene.helperStrip(stage,'explain',frac(st.a)+' of a circle');}
   window.NovaLessonComponent?.applyExploreModels();function build(){box.innerHTML='';box.appendChild(U.slider({label:'Angle',min:15,max:345,step:15,value:st.a,unit:'°',engine:'F12-13',onChange:function(v){st.a=v;pg();}}));box.appendChild(U.slider({label:'Radius',min:2,max:9,step:1,value:st.r,engine:'F12-13',onChange:function(v){st.r=v;pg();}}));}
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Preset'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=key;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){key=pre.value;st=clone(P[key]);build();pg();NOVA.events.emit('value',{engine:'F12-13',control:'preset',value:key});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Preset ',pre]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(box);window.NovaLessonComponent?.applyExploreModels();build();window.NovaLessonComponent?.applyExploreModels();pg();},
 challenge:function(panel,api,stage){var A={r:9,a:120},B={r:6,a:150},Cc={r:5,a:180},arcA=120/360*2*PI*9,areaB=150/360*PI*36,perC=PI*5+10;
   var tasks=[
    {q:'A sector has radius 9 cm and angle 120°. What is the arc length? (1 decimal place)',build:NOVA.entryTask('Arc length (cm)','F12-13'),check:function(x){var ok=Math.abs(x-arcA)<.15;return [ok,ok?'Yes: ⅓ × 2 × π × 9 ≈ 18.8 cm.':Math.abs(x-56.55)<.3?'That is the whole circumference. Take the fraction 120/360 = ⅓ of it.':Math.abs(x-254.5)<1?'That is the circle AREA. Arc length is a fraction of the circumference.':Math.abs(x-84.8)<.5?'That is the sector area, not the arc.':'Fraction of the circumference: 120/360 × 2πr.'];},hint:'Circumference is 2 × π × 9. Take ⅓ of it.',solve:function(c){c._A.input.value=String(Math.round(arcA*10)/10);}},
    {q:'A sector has radius 6 cm and angle 150°. What is its area? (1 decimal place)',build:NOVA.entryTask('Sector area (cm²)','F12-13'),check:function(x){var ok=Math.abs(x-areaB)<.25;return [ok,ok?'Yes: 150/360 × π × 6² ≈ 47.1 cm².':Math.abs(x-113.1)<.4?'That is the whole circle. Take 150/360 of it.':Math.abs(x-15.7)<.3?'That is the arc length. For the area use π r².':'Fraction of the circle area: 150/360 × π × r².'];},hint:'Circle area is π × 36. Multiply by 150/360.',solve:function(c){c._A.input.value=String(Math.round(areaB*10)/10);}},
    {q:'A semicircular sector has radius 5 cm. What is its perimeter? (1 decimal place)',build:NOVA.entryTask('Perimeter (cm)','F12-13'),check:function(x){var ok=Math.abs(x-perC)<.2;return [ok,ok?'Yes: the arc 5π ≈ 15.7, plus two radii, 10, is 25.7 cm.':Math.abs(x-15.7)<.2?'That is only the arc. Add the two straight edges (the radii), 5 + 5.':Math.abs(x-39.3)<.3?'That is the semicircle AREA. Perimeter is the distance round.':'Arc + radius + radius.'];},hint:'Arc is half of 2π × 5. Then add 5 + 5.',solve:function(c){c._A.input.value=String(Math.round(perC*10)/10);}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['arc length','sector area','sector perimeter'][k]);var s=[A,B,Cc][k];draw(stage,s,{});strip(stage,[['radius',s.r+' cm','given'],['angle',s.a+'°','focus']]);NOVA.scene.helperStrip(stage,'think',['Fraction × circumference','Fraction × area','Don\u2019t forget the radii'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-13',def,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F12-13',num:'F12·13',title:'Arc and sector explorer',def:def,linked:['F0-02','F0-11','F12-10','F12-11','F12-12'],
 spec:{purpose:'Arc length and sector area as a fraction of the circle. The angle at the centre over 360 gives the fraction; the arc is that fraction of the circumference and the sector that fraction of the circle area. Sector perimeter adds the two radii. Includes sectors beyond a semicircle.',
  params:'preset (quarter, semi, sixth, three-quarter, custom); radius r; angle a (15 to 345 in steps of 15); unit cm. The sector is drawn symmetric about the upward direction with an arc highlight, an angle marker and a fraction bar. Core: NOVA.neonShape / neonPath / svg.pill / neonTile. Year groups: KS3 Years 7–9 (12–15).',
  presets:'Quarter circle · Semicircle · Sixth of a circle · Three-quarter circle · Choose your own angle',
  steps:'Sector and arc → What fraction? → Arc length → Sector area → Another angle → Sector perimeter → Big sectors. Each step has a Sir Bob line and a Guided prompt; the helper points at the sector.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: preset, angle and radius sliders; the bar shows the fraction and the chips show arc, area and perimeter. Challenge (3 tasks): arc length; sector area; sector perimeter. Answers accept calculator-pi and 3.14. Events: value, correct, step, hintUsed.',
  traps:'Using the whole circumference or area · forgetting to add the two radii to the arc for the perimeter · mixing arc length with sector area · treating the fraction as a/180 · using the diameter for r',
  gcse:'Extension: answers in terms of π, radians, segment area (sector minus triangle), composite shapes with sectors; linked: F12-11 circumference, F12-12 circle area, F12-10 compound shapes'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

