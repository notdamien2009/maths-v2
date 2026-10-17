
/* ===== F12-02 CONFIG: parameters + named presets ===== */
var NOVA_F12_02_CONFIG={
  startMode:'watch',
  preset:'one',
  props:{
    ra:  {short:'a right angle',label:'has a right angle',key:'ra',min:1},
    eq:  {short:'all sides equal',label:'has all sides equal',key:'allEq',min:1},
    par2:{short:'2+ parallel pairs',label:'has 2 or more pairs of parallel sides',key:'par',min:2},
    par1:{short:'1+ parallel pair',label:'has at least 1 pair of parallel sides',key:'par',min:1},
    sym: {short:'line symmetry',label:'has line symmetry',key:'sym',min:1},
    sym1:{short:'exactly 1 mirror line',label:'has exactly 1 line of symmetry',key:'sym',min:1,max:1},
    rot: {short:'rotation symmetry',label:'has rotational symmetry (order 2 or more)',key:'rot',min:2},
    tri: {short:'is a triangle',label:'is a triangle',key:'sides',min:3,max:3},
    quad:{short:'4 sides',label:'has 4 sides',key:'sides',min:4,max:4}
  },
  presets:{
    one:{label:'One property: Yes / No',kind:'one',a:'ra'},
    carroll:{label:'Two properties: Carroll diagram',kind:'carroll',a:'par2',b:'eq'}
  }
};
/* ===== F12-02 ENGINE ===== */
(function(){
var h=NOVA.h,S=NOVA.svg,U=NOVA.ui,F=NOVA.f12,C=window.NovaV2Integration.configuration(NOVA_F12_02_CONFIG),PR=C.props,strip=F.strip;
function has(k,id){var q=PR[id],v=F.SHAPES[k].p[q.key];return v>=q.min&&(q.max==null||v<=q.max);}
function cap1(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function names(keys){return (keys.length?keys.map(function(k){return F.SHAPES[k].name;}).join(', '):'none').replace(/-/g,'\u2011');}
function tip(sv,k){var g=sv.querySelector('[data-maths="'+k+'"]');if(g){var t=S.el('title',{},g);t.textContent=F.SHAPES[k].name;}}
function cell(sv,keys,x,y,w,hgt,cols,sp,sc,hl,top){var rows=Math.max(1,Math.ceil(keys.length/cols)),y0=y+top+(hgt-top-rows*(sp-2))/2+(sp-2)/2;keys.forEach(function(k,i){var per=(i>=Math.floor(keys.length/cols)*cols)?keys.length-Math.floor(keys.length/cols)*cols:cols,x0=x+(w-per*sp)/2+sp/2,col=i%cols,cx=x0+col*sp,cy=y0+Math.floor(i/cols)*(sp-2);F.draw(sv,k,cx,cy,sc,{role:hl===k?'focus':'op',tag:k});tip(sv,k);if(hl===k)NOVA.neonRing(sv,cx,cy,{role:'focus',r:sc*62,pulse:false});});}
function drawOne(stage,a,hl){
if(window.NovaLessonComponent?.active){[stage,a,hl]=window.NovaLessonComponent.args("drawOne",arguments);}
var sv=S.root(440,272,'Shape sorter: shapes that '+PR[a].label+' go in YES, the others in NO.');sv.classList.add('f12-sv');
  var yes=F.KEYS.filter(function(k){return has(k,a);}),no=F.KEYS.filter(function(k){return !has(k,a);});
  NOVA.chalkText(sv,220,22,cap1(PR[a].label)+'?',{size:16});
  NOVA.neonBox(sv,10,44,205,208,{role:'result',r:12});NOVA.neonBox(sv,225,44,205,208,{role:'given',r:12});
  S.pill(sv,112,44,'YES · '+yes.length,{role:'result',size:13});S.pill(sv,327,44,'NO · '+no.length,{role:'given',size:13});
  cell(sv,yes,10,44,205,208,3,62,.4,hl,22);cell(sv,no,225,44,205,208,3,62,.4,hl,22);
  stage.appendChild(sv);var r=h('div',{class:'f12-strip'});r.appendChild(NOVA.neonCard(['YES: '+names(yes)],{role:'result'}));r.appendChild(NOVA.neonCard(['NO: '+names(no)],{role:'given'}));stage.appendChild(r);return {yes:yes,no:no};}
function drawCar(stage,a,b,hl){
if(window.NovaLessonComponent?.active){[stage,a,b,hl]=window.NovaLessonComponent.args("drawCar",arguments);}
var sv=S.root(440,334,'Carroll diagram sorting shapes by two properties.');sv.classList.add('f12-sv');
  var X=[58,250],Y=[48,186],W=182,H=130,res={};
  [0,1].forEach(function(ci){S.pill(sv,X[ci]+W/2,24,ci?'no':'yes',{role:'focus',size:13});});[0,1].forEach(function(ri){S.pill(sv,28,Y[ri]+H/2,ri?'no':'yes',{role:'op',size:13});});
  [0,1].forEach(function(ci){[0,1].forEach(function(ri){var keys=F.KEYS.filter(function(k){return has(k,a)===(ci===0)&&has(k,b)===(ri===0);}),both=ci===0&&ri===0,role=!keys.length?'unknown':both?'result':'given';res[ci+''+ri]=keys;
    NOVA.neonBox(sv,X[ci],Y[ri],W,H,{role:role,r:12});if(!keys.length)NOVA.chalkText(sv,X[ci]+W/2,Y[ri]+H/2+6,'no shape',{size:15,role:'unknown'});else cell(sv,keys,X[ci],Y[ri],W,H,4,44,.34,hl,26);});});
  stage.appendChild(sv);
  strip(stage,[['across (A)',PR[a].short,'focus'],['down (B)',PR[b].short,'op']]);
  strip(stage,[['both',names(res['00']),'result']]);return res;}
var steps=[
 {name:'One property: right angle',narration:'Sorting asks one question of every shape: does it have this property? A right angle is a square corner. Rectangles, squares and one triangle have them.',prompt:'How many shapes have a right angle?',st:{kind:'one',a:'ra'},target:'square'},
 {name:'Equal sides',narration:'Now the question is: are all the sides equal? The regular shapes pass, and so do the rhombus and the square. A rectangle fails because its long and short sides differ.',prompt:'Does a rectangle have all sides equal?',st:{kind:'one',a:'eq'},target:'rhombus'},
 {name:'Parallel sides',narration:'Parallel sides never meet, however far they go. Two or more pairs makes a parallelogram family member, and the regular hexagon has three pairs.',prompt:'Is a trapezium in the YES box?',st:{kind:'one',a:'par2'},target:'parallelogram'},
 {name:'Two properties at once',narration:'A Carroll diagram asks two questions. Columns are parallel sides, rows are equal sides. The top left box holds shapes that pass both tests.',prompt:'Which shapes have parallel sides AND equal sides?',st:{kind:'carroll',a:'par2',b:'eq'},target:'rhombus'},
 {name:'An empty box',narration:'Some boxes stay empty. No shape has two pairs of parallel sides and exactly one line of symmetry. An empty box is an answer too.',prompt:'Can you name a shape for the empty box?',st:{kind:'carroll',a:'par2',b:'sym1'}},
 {name:'Triangles and right angles',narration:'Triangles against right angles: only the right-angled triangle is in the top left box. Squares and rectangles have right angles but are not triangles.',prompt:'Which triangle has a right angle?',st:{kind:'carroll',a:'tri',b:'ra'},target:'rightTri'}];
function paint(stage,st,hl){
if(window.NovaLessonComponent?.active){[stage,st,hl]=window.NovaLessonComponent.args("paint",arguments);}
return st.kind==='one'?drawOne(stage,st.a,hl):drawCar(stage,st.a,st.b,hl);}
function render(i,stage){stage.innerHTML='';var s=steps[i];NOVA.cap(stage,'Property sorter · '+s.name,'step '+(i+1)+'/'+steps.length);paint(stage,s.st,null);NOVA.scene.helperStrip(stage,i===steps.length-1?'cheer':'explain',s.name);}
var def={id:'F12-02',title:'Property sorter',config:C,steps:steps,render:render,
 alt:'Property sorter: twelve 2-D shapes sorted into YES and NO boxes for one property, or into a Carroll diagram for two properties.',
 staticAlt:'Right angle: rectangle, square and right-angled triangle in YES. Carroll diagram of parallel sides against equal sides with square, rhombus and regular hexagon in the both box, and an empty box for two pairs of parallel sides with exactly one line of symmetry.',
 exploreIntro:'Explore: choose one or two properties and watch the twelve shapes sort themselves. Pick a shape to ring it and find where it lands.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var kind=C.preset,a=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("a",()=>(C.presets.one.a)):(C.presets.one.a)),b=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("b",()=>(C.presets.carroll.b)):(C.presets.carroll.b)),hl='';
   window.NovaLessonComponent?.applyExploreModels();function pg(){stage.innerHTML='';NOVA.cap(stage,'Explore · '+(kind==='one'?'one property':'two properties'),hl?F.SHAPES[hl].name:'all shapes');paint(stage,{kind:kind,a:a,b:b},hl||null);
     if(hl){var p=F.SHAPES[hl].p;strip(stage,[['sides',p.sides,'given'],['parallel pairs',p.par,'op'],['right angles',p.ra,'result'],['symmetry lines',p.sym,'focus']]);}
     NOVA.scene.helperStrip(stage,'explain',kind==='one'?'Yes or no?':'Two questions');}
   window.NovaLessonComponent?.applyExploreModels();function sel(label,cur,withNone,onc){var s=h('select',{class:'nova-input','aria-label':label});if(withNone)s.appendChild(h('option',{value:'',text:'(none)'}));Object.keys(PR).forEach(function(k){s.appendChild(h('option',{value:k,text:cap1(PR[k].label)}));});s.value=cur;s.onchange=function(){onc(s.value);NOVA.events.emit('value',{engine:'F12-02',control:label,value:s.value});pg();};return s;}
   window.NovaLessonComponent?.applyExploreModels();var mode=h('select',{class:'nova-input','aria-label':'Sort type'});window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){mode.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();mode.value=kind;
   window.NovaLessonComponent?.applyExploreModels();var A=sel('Property A',a,false,function(v){a=v;}),B=sel('Property B',b,false,function(v){b=v;});
   window.NovaLessonComponent?.applyExploreModels();var shp=h('select',{class:'nova-input','aria-label':'Ring a shape'});window.NovaLessonComponent?.applyExploreModels();shp.appendChild(h('option',{value:'',text:'(none)'}));window.NovaLessonComponent?.applyExploreModels();F.KEYS.forEach(function(k){shp.appendChild(h('option',{value:k,text:F.SHAPES[k].name}));});window.NovaLessonComponent?.applyExploreModels();shp.onchange=function(){hl=shp.value;pg();};
   window.NovaLessonComponent?.applyExploreModels();var rowB=h('label',{class:'pr-row'},['Property B (down) ',B]);
   window.NovaLessonComponent?.applyExploreModels();function vis(){rowB.style.display=kind==='carroll'?'':'none';}
   window.NovaLessonComponent?.applyExploreModels();mode.onchange=function(){kind=mode.value;vis();pg();NOVA.events.emit('value',{engine:'F12-02',control:'sort type',value:kind});};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Sort ',mode]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Property A (across) ',A]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(rowB);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Ring a shape ',shp]));window.NovaLessonComponent?.applyExploreModels();vis();window.NovaLessonComponent?.applyExploreModels();pg();},
 challenge:function(panel,api,stage){
   var nRa=F.KEYS.filter(function(k){return has(k,'ra');}).length,nS1=F.KEYS.filter(function(k){return has(k,'sym1');}).length;
   var tasks=[
    {q:'How many of the 12 shapes have a right angle?',build:NOVA.entryTask('Number of shapes','F12-02'),check:function(x){var ok=x===nRa;return [ok,ok?'Yes: the rectangle, the square and the right-angled triangle.':x>nRa?'Too many. A parallelogram leans over, so it has no right angles.':'Look again: count every shape whose box shows a right-angle corner.'];},hint:'Look in the YES box.',solve:function(c){c._A.input.value=String(nRa);}},
    {q:'A four-sided shape has 2 pairs of parallel sides, all sides equal and NO right angles. Which one?',build:NOVA.choiceTask(['Square','Rhombus','Rectangle'],'F12-02'),check:function(x){var ok=x==='Rhombus';return [ok,ok?'Yes: a rhombus is a leaning square.':x==='Square'?'A square has four right angles.':x==='Rectangle'?'A rectangle has right angles and its sides are not all equal.':'Pick one first.'];},hint:'It is the shape that looks like a diamond.',solve:function(c){c._G.set('Rhombus');}},
    {q:'How many shapes have exactly 1 line of symmetry?',build:NOVA.entryTask('Number of shapes','F12-02'),check:function(x){var ok=x===nS1;return [ok,ok?'Yes: the isosceles triangle, the isosceles trapezium and the kite.':x>nS1?'Too many. A rectangle has 2 lines of symmetry, not 1.':'Check the YES box for each shape that folds exactly one way.'];},hint:'Think of shapes that fold in half only one way.',solve:function(c){c._A.input.value=String(nS1);}}];
   function paintC(k){stage.innerHTML='';NOVA.cap(stage,'Challenge '+(k+1)+' of 3',['count','identify','count'][k]);paint(stage,[{kind:'one',a:'ra'},{kind:'carroll',a:'par2',b:'ra'},{kind:'one',a:'sym1'}][k],null);NOVA.scene.helperStrip(stage,'think',['Count them','Which shape?','Count them'][k]);}
   NOVA.challengeRun(panel,api,tasks,paintC,C);}
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F12-02',def,{models:{},tables:{"steps":()=>steps},draws:{"drawOne":["stage","a","hl"],"drawCar":["stage","a","b","hl"],"paint":["stage","st","hl"]},exploreFields:{"a":{"kind":"value","factory":null,"argCount":null},"b":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:'F12-02',num:'F12·02',title:'Property sorter',def:def,linked:['F0-02','F0-11','F0-12','F12-01','F12-03','F11-03'],
 spec:{purpose:'Sort the twelve standard 2-D shapes by properties: sides, parallel sides, right angles, equal sides and symmetry. One property gives a YES / NO sort; two properties give a Carroll diagram, including empty boxes. Pupils meet the idea that a shape can belong to several groups at once.',
  params:'preset (one, carroll), property A and B from a data table (key, min, max), ring-a-shape highlight. Shape data comes from NOVA.f12.SHAPES. Core: NOVA.neonBox / neonShape / neonCard / chalkText. Year groups: KS3 Years 7–9 (12–15).',
  presets:'One property: Yes / No · Two properties: Carroll diagram',
  steps:'One property: right angle → Equal sides → Parallel sides → Two properties at once → An empty box → Triangles and right angles. Each step has a Sir Bob line and a Guided prompt.',
  interactions:'Watch: auto-play. Guided: step with prompts. Explore: choose the sort type, property A and B, and ring any shape; chips list its properties. Challenge (3 tasks): count shapes with a right angle; identify the shape for a Carroll box; count shapes with exactly one line of symmetry. Answers are computed from the shape data. Events: value, correct, step, hintUsed.',
  traps:'Thinking a parallelogram has right angles · a rectangle has equal sides · a rhombus is a square · believing every Carroll box must hold a shape',
  gcse:'Extension: Venn diagrams of shape properties, set notation, quadrilateral proofs; linked: F12-01 family tree, F12-03 geoboard, F11-03 angle facts'}});
var log=document.getElementById('log');var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(addLog);NOVA.events.on('*',addLog);
document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();

