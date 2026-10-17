
/* ===== F12-06 CONFIG: parameters + named presets ===== */
var NOVA_F12_06_CONFIG={
  startMode:'watch',
  preset:'cut',
  unit:'cm',
  presets:{
    cut:  {label:'Cut and move',b:6,h:4,s:3,k:0,t:0,mode:'cut'},
    shear:{label:'Slide the top (shear)',b:6,h:4,s:3,k:0,t:0,mode:'shear'},
    wide: {label:'Wide and low',b:8,h:3,s:2,k:0,t:0,mode:'cut'},
    tall: {label:'Narrow and tall',b:4,h:6,s:2,k:0,t:0,mode:'cut'}
  }
};
/* ===== F12-06 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_06_CONFIG),P=C.presets,strip=F.strip,fmt=F.fmt,clone=F.clone,UN=C.unit,VW=440,VH=270;
function r2(x){return Math.round(x*100)/100;}
/* st={b,h,s,k (shear 0..1),t (cut-and-move 0..1),mode,o:{slant,height,box}} */
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var b=st.b,hh=st.h,se=st.s*(1-(st.k||0)),m=F.map([[0,0],[b+st.s,0],[b+st.s,-hh],[0,-hh]],VW,VH,50,46),T=function(Pp){return m(Pp);},
  sv=S.root(VW,VH,'Parallelogram with base '+b+' '+UN+' and perpendicular height '+hh+' '+UN+(st.k?', sheared '+Math.round(st.k*100)+' percent toward a rectangle':'')+'.');sv.classList.add('f12-sv');
  var par=[[0,0],[b,0],[b+se,-hh],[se,-hh]],base=T([[0,0],[b,0]]);
  if(o.rect||st.k>0||st.t>0){var x0=st.mode==='cut'?st.s:0;NOVA.neonShape(sv,T([[x0,0],[x0+b,0],[x0+b,-hh],[x0,-hh]]),{role:'unknown',fill:false,width:1.6,dash:'8 6'});}
  if(st.mode==='cut'&&st.s>0&&st.t>=0&&st.s<=b){var tri=[[0,0],[st.s,0],[st.s,-hh]],mv=tri.map(function(q){return [q[0]+st.t*b,q[1]];}),rest=[[st.s,0],[b,0],[b+st.s,-hh],[st.s,-hh]];
    NOVA.neonShape(sv,T(rest),{role:'op',hatch:null,width:3});var g=NOVA.neonShape(sv,T(mv),{role:'focus',hatch:'diag',width:3});g.setAttribute('data-maths','piece');
    if(st.t<1)F.dash(sv,T([[st.s,0]])[0],T([[st.s,-hh]])[0],'unknown',1.8);}
  else{var g2=NOVA.neonShape(sv,T(par),{role:'op',hatch:'cross',width:3});g2.setAttribute('data-maths','shape');}
  var bx=st.mode==='cut'?st.t*st.s:0,B=T([[bx,0],[bx+b,0]]);NOVA.dimLine(sv,B[0][0],B[0][1],B[1][0],B[1][1],r2(b)+' '+UN,{role:'given',off:26});
  if(o.height!==false){var ap=T([[se,-hh]])[0],ft=T([[se,0]])[0];if(!(st.mode==='cut'&&st.t>0)||o.height)F.hmark(sv,ap,ft,B[0],B[1],r2(hh)+' '+UN,{role:'focus',dx:ft[0]<110?32:-30});}
  if(o.slant){var P2=T([[b,0],[b+se,-hh]]),mx=(P2[0][0]+P2[1][0])/2+34,my=(P2[0][1]+P2[1][1])/2;S.pill(sv,mx,my,r2(Math.hypot(st.s*(1-(st.k||0)),hh))+' '+UN,{role:'error',size:12});}
  stage.appendChild(sv);return {area:b*hh};}
function chips(stage,st,o){o=o||{};var items=[['base',fmt(st.b)+' '+UN,'given'],['height',fmt(st.h)+' '+UN,'focus']];if(o.slant)items.push(['slanted side',fmt(r2(Math.hypot(st.s*(1-(st.k||0)),st.h)))+' '+UN,'error']);items.push(['area',st.b+' × '+st.h+' = '+st.b*st.h+' '+UN+'²','result']);strip(stage,items);}
var base={b:6,h:4,s:3};
var steps=[
 {name:'The parallelogram',mood:'neutral',narration:'This parallelogram has a base of 6 and a perpendicular height of 4. The height is measured straight up at a right angle, not along the slanted side.',prompt:'Which line shows the height?',st:{b:6,h:4,s:3,k:0,t:0,mode:'shear'},o:{}},
 {name:'Slide the top halfway',mood:'focus',narration:'Slide the top edge to the left. The base is still 6, the height is still 4. Does the amount of space inside change? No.',prompt:'What has stayed the same?',st:{b:6,h:4,s:3,k:.5,t:0,mode:'shear'},o:{}},
 {name:'It becomes a rectangle',mood:'cheer',narration:'Slide all the way and the parallelogram becomes a 6 by 4 rectangle. Same base, same height, same area: 6 times 4 is 24.',prompt:'What is the area of the rectangle?',st:{b:6,h:4,s:3,k:1,t:0,mode:'shear'},o:{rect:1}},
 {name:'Cut the triangle',mood:'think',narration:'Another way: cut a triangle off the left side along the dashed line. It is just the right size to fill the gap on the right.',prompt:'Where will the triangle go?',st:{b:6,h:4,s:3,k:0,t:0,mode:'cut'},o:{},target:'piece'},
 {name:'Move the triangle',mood:'cheer',narration:'Slide the triangle across to the right side. Now it is a rectangle, 6 by 4, with the same area as the parallelogram: base times height.',prompt:'Did any area go missing?',st:{b:6,h:4,s:3,k:0,t:1,mode:'cut'},o:{rect:1,height:true},target:'piece'},
 {name:'The slanted side is a trap',mood:'think',narration:'The slanted side is 5 long, but it is not the height. 6 times 5 gives 30, which is too big. Use the straight-up height: 6 times 4 is 24.',prompt:'Why is 6 × 5 wrong?',st:{b:6,h:4,s:3,k:0,t:0,mode:'shear'},o:{slant:1}}];
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Parallelogram shear · '+s.name,'step '+(i+1)+'/'+steps.length);draw(stage,s.st,s.o);chips(stage,s.st,s.o);NOVA.scene.helperStrip(stage,i===steps.length-1?'think':'explain',s.name);}
var def={id:'F12-06',title:'Parallelogram shear',config:C,steps:steps,render:render,
 alt:'Parallelogram shear: a parallelogram is slid into a rectangle, or a triangle is cut off and moved, showing that area is base times perpendicular height.',
 staticAlt:'Parallelogram base 6, height 4, slanted side 5: area 6 × 4 = 24. Sliding the top edge or cutting and moving a triangle makes a 6 by 4 rectangle with the same area.',
 exploreIntro:'Explore: change the base, height and lean, then slide the top edge or cut and move the triangle. Watch the area chip: it only depends on base and height.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset,st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>clone(...a),[P[key]]):(clone(P[key]))),box=h('div');
   window.NovaLessonComponent?.applyExploreModels();function pg(){stage.innerHTML='';NOVA.cap(stage,'Explore · '+P[key].label,'area '+st.b*st.h);draw(stage,st,{slant:true,rect:st.k>=1||st.t>=1});chips(stage,st,{slant:true});NOVA.scene.helperStrip(stage,'explain','Base × height');}
   window.NovaLessonComponent?.applyExploreModels();function build(){box.innerHTML='';var sl={};
     box.appendChild(U.slider({label:'Base',min:3,max:9,step:1,value:st.b,engine:'F12-06',onChange:function(v){st.b=v;st.s=Math.min(st.s,v);pg();}}));
     box.appendChild(U.slider({label:'Height',min:2,max:6,step:1,value:st.h,engine:'F12-06',onChange:function(v){st.h=v;pg();}}));
     box.appendChild(U.slider({label:'Lean',min:1,max:st.b,step:1,value:Math.min(st.s,st.b),engine:'F12-06',onChange:function(v){st.s=Math.min(v,st.b);pg();}}));
     box.appendChild(st.mode==='shear'?U.slider({label:'Slide top (0 to 1)',min:0,max:1,step:.05,value:st.k,engine:'F12-06',onChange:function(v){st.k=v;pg();}}):U.slider({label:'Move triangle (0 to 1)',min:0,max:1,step:.05,value:st.t,engine:'F12-06',onChange:function(v){st.t=v;pg();}}));}
   window.NovaLessonComponent?.applyExploreModels();var pre=h('select',{class:'nova-input','aria-label':'Preset'});window.NovaLessonComponent?.applyExploreModels();Object.keys(P).forEach(function(k){pre.appendChild(h('option',{value:k,text:P[k].label}));});window.NovaLessonComponent?.applyExploreModels();pre.value=key;
   window.NovaLessonComponent?.applyExploreModels();pre.onchange=function(){key=pre.value;st=clone(P[key]);build();pg();NOVA.events.emit('value',{engine:'F12-06',control:'preset',value:key});};
   window.NovaLessonComponent?.applyExploreModels();var mo=h('select',{class:'nova-input','aria-label':'Method'});window.NovaLessonComponent?.applyExploreModels();[['cut','Cut and move'],['shear','Slide the top']].forEach(function(o){mo.appendChild(h('option',{value:o[0],text:o[1]}));});window.NovaLessonComponent?.applyExploreModels();mo.value=st.mode;
   window.NovaLessonComponent?.applyExploreModels();mo.onchange=function(){st.mode=mo.value;st.k=0;st.t=0;build();pg();NOVA.events.emit('value',{engine:'F12-06',control:'method',value:st.mode});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Preset ',pre]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Method ',mo]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(box);window.NovaLessonComponent?.applyExploreModels();build();window.NovaLessonComponent?.applyExploreModels();pg();},
 challenge:function(panel,api,stage){var A={b:8,h:4,s:3,k:0,t:0,mode:'shear'},Bk={b:9,h:4,s:3,k:0,t:0,mode:'shear'},Cc={b:6,h:4,s:3,k:.5,t:0,mode:'shear'};
   var tasks=[
    {q:'Find the area of this parallelogram. The base is 8 cm and the height is 4 cm.',build:NOVA.entryTask('Area (cm²)','F12-06'),check:function(x){var ok=x===32;return [ok,ok?'Yes: 8 × 4 = 32 cm².':x===40?'40 uses the slanted side (5). Use the straight-up height, 4.':x===12?'Do not add. Area is base × height.':'Multiply the base by the perpendicular height.'];},hint:'The slanted side is a distraction. Base times perpendicular height.',solve:function(c){c._A.input.value='32';}},
    {q:'A parallelogram has area 36 cm² and base 9 cm. How tall is it?',build:NOVA.entryTask('Height (cm)','F12-06'),check:function(x){var ok=x===4;return [ok,ok?'Yes: 36 ÷ 9 = 4 cm.':x===27?'27 is 36 − 9. Work backwards: divide the area by the base.':x===324?'That multiplied. Divide: height = area ÷ base.':'Height = area ÷ base.'];},hint:'Area = base × height, so height = area ÷ base.',solve:function(c){c._A.input.value='4';}},
    {q:'You slide the top edge sideways. What stays the same?',build:NOVA.choiceTask(['The area','The slanted side','The perimeter'],'F12-06'),check:function(x){var ok=x==='The area';return [ok,ok?'Yes: base and height do not change, so the area does not change.':x==='The slanted side'?'The slanted side gets shorter as it stands up straight.':x==='The perimeter'?'The perimeter changes because the slanted sides change length.':'Pick one first.'];},hint:'Check the base and the height.',solve:function(c){c._G.set('The area');}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['area','work backwards','what stays'][k]);var s=[A,Bk,Cc][k];draw(stage,s,{slant:k===0,height:k===1?false:undefined});if(k===0)strip(stage,[['base','8 cm','given'],['height','4 cm','focus'],['slanted side','5 cm','error']]);else if(k===1)strip(stage,[['area','36 cm²','result'],['base','9 cm','given'],['height','?','unknown']]);else strip(stage,[['sliding','halfway','op']]);NOVA.scene.helperStrip(stage,'think',['Base × height','Divide','Which stays?'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-06',def,{models:{},tables:{"steps":()=>steps},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"clone","argCount":1}}});
NOVA.bankMount({id:'F12-06',num:'F12·06',title:'Parallelogram shear',def:def,linked:['F0-02','F0-11','F12-05','F12-07','F12-08','F12-10'],
 spec:{purpose:'Why the area of a parallelogram is base times perpendicular height. Slide the top edge and the shape becomes a rectangle with the same base and height; or cut a triangle off one side and move it to the other. Includes the slanted-side trap.',
  params:'preset (cut, shear, wide, tall); base, height, lean; shear amount k (0 to 1); triangle move t (0 to 1); unit (cm). Core: NOVA.neonShape / dimLine, NOVA.f12.hmark / map / dash. Year groups: KS3 Years 7–9 (12–15).',
  presets:'Cut and move · Slide the top (shear) · Wide and low · Narrow and tall',
  steps:'The parallelogram → Slide the top halfway → It becomes a rectangle → Cut the triangle → Move the triangle → The slanted side is a trap. Each step has a Sir Bob line and a Guided prompt; the helper points at the moving triangle.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: preset, method, base, height, lean and a slide or move slider; chips show base, height, slanted side and area. Challenge (3 tasks): area from base and height with a slanted-side distractor; height from area and base; what stays the same when you shear. Events: value, correct, step, hintUsed.',
  traps:'Using the slanted side as the height · adding base and height · thinking shearing changes the area · multiplying instead of dividing when finding a missing height',
  gcse:'Extension: area of parallelogram with algebraic base and height, sine area formula previews (½ab sin C); linked: F12-07 triangles, F12-08 trapezia, F11-03 angles'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

