
/* ===== F18-01 RULER & MEASURING TOOLS · NOVA ORIGINAL CORE ===== */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-01';
var C=window.NovaV2Integration.configuration(window.NOVA_F18_01_CONFIG={startMode:'watch',preset:'y7map',events:['value','step','mode','correct','hintUsed'],
 presets:{
 y7map:{label:'Y7-064 · map scale, 1 cm = 5 km',name:'Countryside map',unit:'km',ratio:5,scaleText:'1 cm = 5 km',actual:6.5,result:32.5,kind:'map'},
 y7town:{label:'Y7-064 · town route, 1 cm = 2 km',name:'Town route',unit:'km',ratio:2,scaleText:'1 cm = 2 km',actual:3.5,result:7,kind:'town'},
 plan:{label:'Scale drawing · 1 : 200',name:'Room plan',unit:'m',ratio:2,scaleText:'1 : 200',actual:5.5,result:11,kind:'plan'},
 gcse:{label:'GCSE · OS map, 1 : 25 000',name:'Ordnance map',unit:'km',ratio:.25,scaleText:'1 : 25 000',actual:4.8,result:1.2,kind:'map'}
 }});
function preset(k){return C.presets[k||C.preset]||C.presets.y7map;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rnd(n){return Math.round(n*10)/10;}
function fmt(v){var s=(Math.round(v*100)/100).toFixed(2);return s.replace(/0+$/,'').replace(/\.$/,'');}
function dim(){return window.innerWidth<=510?{w:390,H:502,left:40,right:350,ry:305}:{w:710,H:479,left:65,right:645,ry:303};}
function tx(p,x,y,text,role,size,anchor){return N.chalkText(p,x,y,String(text),{role:role||'given',size:size||18,anchor:anchor||'middle'});}
function valEvent(key,value){N.events.emit('value',{engine:ID,control:key,value:value});}
function path(p,d,role,w,fill){return N.neonPath(p,d,{role:role,width:w||3,fill:!!fill});}
function measureSvg(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("measureSvg",arguments);}
o=o||{};var d=dim(),x0=d.left,x1=d.right,ww=x1-x0,sy=d.ry,unit=ww/10,tip=x0+(s.length==null?0:s.length)*unit;
 var sv=S.root(d.w,d.H,'Neon metric ruler with accurate millimetre markings and adjustable reading '+fmt(s.length)+' centimetres. Scale '+s.p.scaleText+'.');sv.classList.add('f18-plot');
 var scenery=E('g',{'aria-hidden':'true','data-maths':'scale-map'},sv);
 N.neonBox(scenery,x0-10,60,ww+20,147,{role:'support',r:18});
 // Scene drawn from shared premium strokes; all mathematical measurements referenced to the same ruler unit.
 var road=E('g',{},scenery),hi=78,lo=185;
 if(s.p.kind==='plan'){
   var rect='M'+(x0+40)+',91 h'+(ww-80)+' v94 h-'+(ww-80)+' Z';path(road,rect,'given',3,true);
   for(var j=0;j<4;j++){var lx=x0+70+j*(ww-140)/3;N.neonLine(road,lx,100,lx,176,{role:'support',width:1.3,dash:'4 8'});}
   N.neonBox(road,x0+65,114,Math.max(35,ww*.18),46,{role:'unknown',r:8});
   N.neonLine(road,x0+38,180,x0+ww-38,180,{role:'op',width:3});
 }else{
   for(var i=0;i<4;i++){
     var bx=x0+35+i*(ww-70)/3,by=i%2?169:90;
     N.neonRing(road,bx,by,{role:i%2?'support':'given',r:5,pulse:false});
   }
   var dRoad='M'+(x0+36)+',165 C'+(x0+ww*.24)+',110 '+(x0+ww*.33)+',180 '+(x0+ww*.51)+',131 S'+(x0+ww*.76)+',92 '+(x1-25)+',150';
   path(road,dRoad,'support',3.3);
   N.neonRing(road,x0+36,165,{role:'given',r:6,pulse:false});N.neonRing(road,x1-25,150,{role:'focus',r:6,pulse:false});
 }
 // The highlighted A→B straight-line map/plan segment matches the measured blue bar exactly.
 // Curved map roads are scenery only, never claimed as the length measured by a straight ruler.
 if(o.showObject!==false){
   N.neonLine(scenery,x0,189,tip,189,{role:'result',width:3.2});
   N.neonRing(scenery,x0,189,{role:'given',r:4,pulse:false});
   N.neonRing(scenery,tip,189,{role:'focus',r:4,pulse:false});
   tx(scenery,x0+13,183,'A','given',window.innerWidth<=510?20:19);
   tx(scenery,tip-12,183,'B','result',window.innerWidth<=510?20:19);
 }
 tx(sv,d.w/2,90,s.p.name,'given',window.innerWidth<=510?21:24);
 N.neonBox(sv,d.w/2-108,120,216,44,{role:'op',r:13,text:s.p.scaleText,size:20});
 // Measurement aperture with luminous movable endpoint and a glass bar.
 if(o.showObject!==false){
   var bar=E('g',{'data-maths':'object'},sv);
   path(bar,'M'+x0+',221 L'+tip+',221 L'+tip+',267 L'+x0+',267 Z','given',4.4,true);
   N.neonLine(bar,x0,227,tip,227,{role:'op',width:4});
   N.neonLine(bar,x0,222,x0,270,{role:'given',width:3.4});
   N.neonLine(bar,tip,222,tip,271,{role:'focus',width:4});
   N.neonRing(bar,x0,244,{role:'given',r:4,pulse:false});
   var tipGroup=E('g',{'data-maths':'measure-handle',role:'slider',tabindex:'0','aria-label':'Drag the orange measurement end point. Arrow keys adjust by a millimetre.','aria-valuemin':'0','aria-valuemax':'10','aria-valuenow':String(s.length),'aria-valuetext':fmt(s.length)+' centimetres'},sv);
   N.neonRing(tipGroup,tip,244,{role:'focus',r:10,pulse:false});
   path(tipGroup,'M'+(tip-10)+',251 L'+tip+',263 L'+(tip+10)+',251','focus',3);
   if(o.drag){
     // One 1-mm zone per tick. The core handles capture, lift, valid glow, snap-back,
     // pointer cancellation and Escape. Clicking the handle again re-grabs it.
     var zs=[];for(var z=0;z<=100;z++)zs.push({x:x0+z*unit/10-unit/20,y:206,w:unit/10,h:100,id:'mm:'+z,kind:'drop'});
     N.ui.svgDrag(sv,tipGroup,{box:{x:tip-11,y:229,w:22,h:34},zones:function(){return zs;},onDrop:function(id){var next=rnd(Number(id.split(':')[1])/10);s.length=next;valEvent('rulerReading',next);if(o.update)o.update('measure-handle');return true;}});
     // The supplied core moves the node to SVG's end during pickup; that DOM move
     // releases native pointer capture in Chromium. Reassert it AFTER the core's
     // pointerdown handler, retaining the original NOVA drag calculations and snap kit.
     tipGroup.addEventListener('pointerdown',function(ev){if(N.ui._drag&&N.ui._drag.el===tipGroup){try{tipGroup.setPointerCapture(ev.pointerId);}catch(_){}}});
     tipGroup.addEventListener('keydown',function(ev){var q={'ArrowLeft':-.1,'ArrowDown':-.1,'ArrowRight':.1,'ArrowUp':.1,Home:-999,End:999}[ev.key];if(q===undefined)return;ev.preventDefault();s.length=q===-999?0:q===999?10:rnd(clamp(s.length+q,0,10));valEvent('rulerReading',s.length);if(o.update)o.update('measure-handle');});
   }
 }
 // Locked metric ruler: exact 0..10 cm with 100 subdivision ticks.
 var ruler=E('g',{'data-maths':'ruler'},sv);N.neonBox(ruler,x0-11,sy-7,ww+22,87,{role:'op',r:14});
 N.neonLine(ruler,x0,sy+3,x1,sy+3,{role:'op',width:3});
 for(var mm=0;mm<=100;mm++){
  var cx=x0+mm*unit/10,major=mm%10===0,mid=mm%5===0;
  // Straight tick lines from approved neon primitive, with user-space glow filters.
  N.neonLine(ruler,cx,sy+6,cx,sy+(major?37:mid?28:17),{role:major?'given':mid?'support':'op',width:major?2.5:1.05});
  if(major&&(window.innerWidth>510||mm%20===0))tx(ruler,cx,sy+60,String(mm/10),'given',window.innerWidth<=510?21:18);
 }
 tx(ruler,d.w/2,sy+78,'centimetres  •  10 mm = 1 cm','op',window.innerWidth<=510?21:17);
 // Exact correspondence guides connect the reading to the ruler's axis.
 if(o.guides!==false&&o.showObject!==false){N.neonLine(sv,tip,267,tip,sy-8,{role:'focus',width:2,dash:'5 6'});}
 var bottomY=sy+112;
 if(o.showReading!==false){
  N.neonBox(sv,x0,bottomY,Math.min(ww*.44,230),46,{role:'given',r:12,text:fmt(s.length)+' cm',size:22});
  var ix=x0+Math.min(ww*.44,230)+12;
  N.neonBox(sv,ix,bottomY,x1-ix,46,{role:o.showResult?'result':'unknown',r:12,text:o.showResult?fmt(s.length*s.p.ratio)+' '+s.p.unit:'? '+s.p.unit,size:window.innerWidth<=510?21:21});
 }
 stage.appendChild(sv);
 return {svg:sv,tip:tip,object:sv.querySelector('[data-maths="object"]')};
}
function chips(stage,s,o){o=o||{};var bar=h('div',{class:'f18-readouts'});var v=[{label:'Drawing',value:fmt(s.length)+' cm',role:'given'},{label:'Scale',value:s.p.scaleText,role:'op'},{label:'Actual',value:o.showResult?fmt(s.length*s.p.ratio)+' '+s.p.unit:'?',role:o.showResult?'result':'unknown'}];
 v.forEach(function(a){bar.appendChild(N.neonTile(a.label+' · '+a.value,{role:a.role}));});stage.appendChild(bar);}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Ruler & measuring tools',o.tag||'METRIC WORKSHOP');var art=measureSvg(stage,s,o);if(o.readouts!==false)chips(stage,s,o);N.scene.helperStrip(stage,o.pose||'explain',o.say||'Start at zero and check the units.');return art;}
var steps=[
 {name:'Read the scale',mood:'neutral',pose:'explain',narration:'This map has a scale. One centimetre on the drawing stands for five kilometres in the real world.',prompt:'What does one centimetre on this map represent?'},
 {name:'Line up zero',mood:'focus',pose:'point-down',narration:'Align the start of the drawing exactly with zero on the ruler. Do not start at the edge of the plastic.',prompt:'Why must we line up with the zero tick, not the ruler edge?'},
 {name:'Measure the route',mood:'focus',pose:'count',narration:'Count the whole centimetres first, then the smaller millimetre ticks for the fraction of a centimetre.',prompt:'How many millimetres make one centimetre?'},
 {name:'Use the map scale',mood:'focus',pose:'compare',narration:'To convert the map distance, multiply the measured centimetres by five kilometres per centimetre.',prompt:'Why do we multiply rather than add five?'},
 {name:'Calculate the distance',mood:'neutral',pose:'count',narration:'The answer is thirty-two point five kilometres. Notice that the final answer uses real-world units.',prompt:'Which unit belongs in the answer, centimetres or kilometres?'},
 {name:'Check and explain',mood:'cheer',pose:'celebrate',narration:'The ruler measures the drawing. The scale tells us the actual distance. Both steps matter.',prompt:'Describe the two steps you use to find a real-world distance.'}
];
function render(i,stage){i=clamp(Math.round(i),0,5);var p=preset('y7map'),s={p:p,length:i<2?0:i===2?6.5:6.5},o={title:'Ruler & map scale',tag:'STEP '+(i+1)+'/6',pose:steps[i].pose,showObject:i>=1,showReading:i>=2,showResult:i>=4,readouts:i>=2,say:[
 'First, read what one centimetre represents.','The zero mark is our starting point.','Follow the millimetre ticks to 6.5 cm.','Now multiply by the map scale.','The real distance is 32.5 km.','Keep drawing units and real units distinct.'
 ][i]};var a=scene(stage,s,o);
 if(i===1){var g=a.object;if(g){M.arrive(g,-45,0,650);}}
 if(i===2){var tip=a.svg.querySelector('[data-maths="measure-handle"]');if(tip)M.arrive(tip,-35,0,740);}
 if(i===3){M.flash(a.svg,a.tip,272,'focus',30);}
 if(i===4){var last=a.svg.querySelectorAll('.nv-neon-box');if(last.length)M.pop(last[last.length-1],a.tip,442);}
 if(i===5){M.flash(a.svg,a.tip,244,'result',22);}
}
var def={id:ID,title:'Ruler and measuring tools',config:C,steps:steps,render:render,
 alt:'A luminous glass metric ruler with labelled centimetres and millimetre graduations, a draggable end marker, a scale-drawing context and a real-world distance readout.',
 staticAlt:'The ruler has 100 millimetres between 0 and 10 centimetres. On a map with 1 cm representing 5 km, a 6.5 cm drawn line represents 32.5 km.',
 exploreIntro:'Choose a scale drawing, then drag the orange endpoint. Each division is one millimetre. Use the arrows for fine adjustment.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset in C.presets?C.preset:'y7map';window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",()=>({p:preset(key),length:preset(key).actual})):({p:preset(key),length:preset(key).actual}));window.NovaLessonComponent?.applyExploreModels();var selected=h('select',{class:'nova-input','aria-label':'Measurement context preset'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){selected.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();selected.value=key;
 window.NovaLessonComponent?.applyExploreModels();var caption=h('div',{class:'f18-status','aria-live':'polite'}),buttons=h('div',{class:'pr-row'});
 window.NovaLessonComponent?.applyExploreModels();function repaint(focus){scene(stage,s,{title:'Explore the ruler',tag:'DRAG · 1 mm SNAP',drag:true,showResult:true,pose:'point-down',say:'Measure '+fmt(s.length)+' centimetres. Use the scale to find the real distance.',update:repaint});caption.textContent='Reading: '+fmt(s.length)+' cm  →  actual length: '+fmt(s.length*s.p.ratio)+' '+s.p.unit+' ('+s.p.scaleText+').';if(focus){var el=stage.querySelector('[data-maths="measure-handle"]');if(el)el.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();function button(label,fn){buttons.appendChild(h('button',{class:'nova-btn',text:label,onclick:fn}));}
 window.NovaLessonComponent?.applyExploreModels();selected.onchange=function(){key=selected.value;C.preset=key;s={p:preset(key),length:preset(key).actual};valEvent('preset',key);repaint();};
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Measurement preset ',selected]));window.NovaLessonComponent?.applyExploreModels();button('− 1 mm',function(){s.length=rnd(clamp(s.length-.1,0,10));valEvent('rulerReading',s.length);repaint();});window.NovaLessonComponent?.applyExploreModels();button('+ 1 mm',function(){s.length=rnd(clamp(s.length+.1,0,10));valEvent('rulerReading',s.length);repaint();});window.NovaLessonComponent?.applyExploreModels();button('Reset reading',function(){s.length=s.p.actual;repaint();});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(buttons);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(caption);window.NovaLessonComponent?.applyExploreModels();repaint();window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){return {preset:key,length:s.length,real:s.length*s.p.ratio};},select:function(k){selected.value=k;selected.onchange();},set:function(n){s.length=rnd(clamp(n,0,10));repaint();}};
 },
 challenge:function(panel,api,stage){var st={p:preset('y7map'),length:4.5};var tasks=[
 {q:'Set the ruler to exactly 6.5 cm. Then enter the drawing length with its unit (for example: 2 cm).',preset:'y7map',shown:4.5,target:6.5,answer:6.5,unit:'cm',kind:'drag',hint:'Line up at zero; each small ruler division is 1 mm, so 6.5 cm lies halfway between 6 and 7.',
  check:function(v){var parsed=parseAnswer(v.text,'cm');if(!parsed.unitOk)return [false,'Include the correct unit: cm. The ruler reads centimetres, not kilometres.'];if(!parsed.valid)return [false,'Enter a number followed by cm.'];if(Math.abs(v.len-6.5)>.001)return [false,v.len<6.5?'The orange marker is too far left. Move it to the 6.5 cm tick.':'The orange marker has passed 6.5 cm. Move it left to the halfway tick.'];if(Math.abs(parsed.value-6.5)>.001)return [false,'The endpoint is correct, but the written length must match the ruler reading.'];return [true,'Correct: the drawing measures exactly 6.5 cm.'];}},
 {q:'On the countryside map, 1 cm represents 5 km. A line measures 3.5 cm. What is the real distance? Include km.',preset:'y7map',shown:3.5,answer:17.5,unit:'km',hint:'Multiply 3.5 by 5. The centimetres cancel: your answer is in kilometres.',
  check:function(v){var a=parseAnswer(v.text,'km');if(!a.unitOk)return [false,'The question asks for actual distance in kilometres. Enter km, not cm.'];if(!a.valid)return [false,'Write the distance as a number followed by km.'];if(Math.abs(a.value-17.5)<.001)return [true,'Exactly. 3.5 × 5 = 17.5 km.'];if(Math.abs(a.value-8.5)<.001)return [false,'You added 5 instead of multiplying by 5. A scale represents a conversion factor.'];if(Math.abs(a.value-3.5)<.001)return [false,'That is the distance on the paper, not the real distance. Use the scale.'];return [false,'Check 3.5 centimetres × 5 kilometres per centimetre.'];}},
 {q:'A room plan uses scale 1 : 200. A wall is 5.5 cm on paper. How long is the actual wall? Include m.',preset:'plan',shown:5.5,answer:11,unit:'m',hint:'5.5 × 200 = 1,100 cm. Convert centimetres to metres by dividing by 100.',
  check:function(v){var a=parseAnswer(v.text,'m');if(!a.unitOk)return [false,'The answer must be in metres (m). Be careful not to leave your result in cm.'];if(!a.valid)return [false,'Enter a number followed by m.'];if(Math.abs(a.value-11)<.001)return [true,'Correct: 5.5 × 200 = 1,100 cm = 11 m.'];if(Math.abs(a.value-1100)<.001)return [false,'1,100 is the length in centimetres, not metres. Divide by 100.'];if(Math.abs(a.value-5.5)<.001)return [false,'That is only the plan length. Apply the scale factor 200.'];return [false,'Multiply 5.5 by 200, then convert centimetres into metres.'];}}
 ];
 var k=0,question=h('p',{class:'pr-task'}),input=h('input',{class:'nova-input',type:'text',inputmode:'text','aria-label':'Answer including unit',placeholder:'Value and unit (e.g. 7 km)'}),ctrl=h('div',{class:'pr-row'});
 function parseAnswer(v,unit){v=String(v||'').trim().toLowerCase().replace(/,/g,'');var m=v.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*([a-z]+)$/);return {valid:!!m,value:m?+m[1]:NaN,unitOk:!!m&&m[2]===unit};}
 function repaint(focus){scene(stage,st,{title:'Challenge '+(k+1),tag:'ACCURATE MEASUREMENT',drag:k===0,showResult:false,pose:'think',say:k===0?'Can you put the endpoint exactly at six and a half centimetres?':'The ruler gives centimetres. What does the scale give us?',update:repaint});if(focus){var g=stage.querySelector('[data-maths="measure-handle"]');if(g)g.focus({preventScroll:true});}}
 function load(){var t=tasks[k];st={p:preset(t.preset),length:t.shown};question.textContent=(k+1)+' / '+tasks.length+' · '+t.q;input.value='';input.setAttribute('data-task',String(k));repaint();}
 ctrl.appendChild(input);panel.appendChild(question);panel.appendChild(ctrl);
 panel.appendChild(h('div',{class:'pr-row'},[
 h('button',{class:'nova-btn primary',text:'Check answer',onclick:function(){var t=tasks[k],v={len:st.length,text:input.value},r=t.check(v);api.check(r[0],r[1],{task:k});if(r[0]&&k<tasks.length-1){var tmr=setTimeout(function(){k++;load();},850);api.onCleanup(function(){clearTimeout(tmr);});}}}),
 h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(tasks[k].hint);}}),
 h('button',{class:'nova-btn',text:'− 1 mm',onclick:function(){if(k!==0)return;st.length=rnd(clamp(st.length-.1,0,10));repaint();}}),
 h('button',{class:'nova-btn',text:'+ 1 mm',onclick:function(){if(k!==0)return;st.length=rnd(clamp(st.length+.1,0,10));repaint();}})
 ]));C._challenge={task:function(){return k;},solve:function(){st.length=tasks[k].target||tasks[k].shown;input.value=String(tasks[k].answer)+' '+tasks[k].unit;repaint();},state:function(){return {task:k,length:st.length,entry:input.value};}};load();
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"steps":()=>steps},draws:{"measureSvg":["stage","s","o"],"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F18·01',title:'Ruler and measuring tools',def:def,years:'KS3 Year 7, scale drawings and maps; KS3 Years 8–9 and GCSE extension.',linked:['F0-02','F0-03','F0-04','F2-03','F18-02','F18-11'],spec:{purpose:'Measure accurately with a millimetre-graded ruler, map scale and scale drawing. Explain how actual length follows from drawing length and scale factor.',params:'Ruler 0–10 cm in 1 mm divisions; draggable 0.1 cm endpoint; map/plan scale, display unit and conversion factor.',presets:'Y7-064 countryside map 1 cm = 5 km; Y7 town map 1 cm = 2 km; room plan 1 : 200; GCSE OS map 1 : 25 000.',steps:'Read scale → Line up zero → Measure → Multiply by scale → Calculate actual distance → Check units.',interactions:'WATCH narration, play and scrub; GUIDED scaffolded prompts; EXPLORE ruler drag with keyboard equivalent, fine nudge and presets; CHALLENGE three unit-checked problems.',traps:'Starting at plastic ruler edge; skipping millimetre subdivisions; adding instead of multiplying; confusing drawing cm and actual km; failing cm-to-m conversion.',gcse:'1 : 25 000 maps and length conversion.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5000);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

