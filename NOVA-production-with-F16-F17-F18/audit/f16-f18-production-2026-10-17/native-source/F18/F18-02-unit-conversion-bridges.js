
/* ===== F18-02 · UNIT CONVERSION BRIDGES · NOVA ORIGINAL CORE ===== */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-02';
var C=window.NovaV2Integration.configuration(window.NOVA_F18_02_CONFIG={startMode:'watch',preset:'length',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','factor','amount','answer'],
 presets:{
  time:{label:'Y7-050 · minutes to hours',context:'Time and timetables',short:'Time / duration',story:'A journey takes 150 minutes.',from:'min',to:'h',amount:150,factor:1/60,choices:['× 60','÷ 60','× 100'],correct:1,relation:'60 minutes = 1 hour',rule:'Divide the number of minutes by 60.',why:'There are 60 minutes in one hour.',kind:'time',explain:'150 minutes = 2.5 hours = 2 hours 30 minutes.'},
  length:{label:'Y7-051 · metres to centimetres',context:'Length conversion',short:'Metric length',story:'A beam is 3.2 metres long.',from:'m',to:'cm',amount:3.2,factor:100,choices:['÷ 100','× 100','× 10'],correct:1,relation:'1 m = 100 cm',rule:'Multiply metres by 100.',why:'Each metre contains one hundred centimetres.',kind:'length',explain:'3.2 m = 320 cm.'},
  area:{label:'Y7-051 · square centimetres to square millimetres',context:'Area conversion',short:'Square units',story:'A tile has area 7.5 square centimetres.',from:'cm²',to:'mm²',amount:7.5,factor:100,choices:['× 10','× 100','× 1,000'],correct:1,relation:'1 cm² = 100 mm²',rule:'Square the length factor: 10 × 10 = 100.',why:'One square centimetre covers a ten-by-ten grid of square millimetres.',kind:'area',explain:'7.5 cm² = 750 mm².'},
  volume:{label:'Y7-051 · litres to millilitres',context:'Capacity conversion',short:'Capacity',story:'A jug contains 1.75 litres.',from:'L',to:'mL',amount:1.75,factor:1000,choices:['× 100','÷ 1,000','× 1,000'],correct:2,relation:'1 L = 1,000 mL',rule:'Multiply litres by 1,000.',why:'Each litre contains exactly one thousand millilitres.',kind:'volume',explain:'1.75 L = 1,750 mL.'},
  euro:{label:'Y8-039 · pounds to euros',context:'Given currency rate',short:'Currency exchange',story:'Exchange £80 at the stated rate.',from:'GBP',to:'EUR',amount:80,factor:1.25,choices:['÷ 1.25','× 1.25','× 100'],correct:1,relation:'GIVEN: £1 = €1.25',rule:'Multiply the pound amount by euros per pound.',why:'Each pound buys 1.25 euros at this stated example rate.',kind:'currency',explain:'£80 × 1.25 = €100. This is a teaching rate, not a live quote.'},
  speed:{label:'Y8-043 · km/h to m/s',context:'Compound speed',short:'Speed conversion',story:'A vehicle travels at 72 kilometres per hour.',from:'km/h',to:'m/s',amount:72,factor:1/3.6,choices:['× 3.6','÷ 3.6','÷ 60'],correct:1,relation:'1 km/h = 1 ÷ 3.6 m/s',rule:'Multiply kilometres by 1,000 and hours by 3,600: divide the speed by 3.6.',why:'Both the distance and the time units must change.',kind:'speed',explain:'72 km/h ÷ 3.6 = 20 m/s.'},
  density:{label:'Y9-024 · g/cm³ to kg/m³',context:'Mixed compound units',short:'Density conversion',story:'The density is 1.5 grams per cubic centimetre.',from:'g/cm³',to:'kg/m³',amount:1.5,factor:1000,choices:['× 100','× 1,000','÷ 1,000'],correct:1,relation:'1 g/cm³ = 1,000 kg/m³',rule:'Change grams to kilograms AND cubic centimetres to cubic metres.',why:'1 g = 0.001 kg, but 1 cm³ = 0.000001 m³, so 0.001 ÷ 0.000001 = 1,000.',kind:'density',explain:'1.5 g/cm³ = 1,500 kg/m³.'},
  dollar:{label:'F18-09 / F6-12 · pounds to dollars',context:'Currency-exchange preset',short:'Exchange bridge',story:'Exchange £60 at the stated rate.',from:'GBP',to:'USD',amount:60,factor:1.30,choices:['× 0.77','× 1.30','× 100'],correct:1,relation:'GIVEN: £1 = $1.30',rule:'Multiply pounds by the given dollars-per-pound rate.',why:'One pound converts to 1.30 dollars in this illustrative exercise.',kind:'currency',explain:'£60 × 1.30 = $78. This is a teaching rate, not a live quote.'}
 }});
function pget(k){return C.presets[k||C.preset]||C.presets.length;}
function fmt(n){if(!isFinite(n))return '?';return (Math.round(n*1e5)/1e5).toLocaleString('en-GB',{maximumFractionDigits:5});}
function val(p,n,unit){var t=unit||p.from;if(t==='GBP')return '£'+fmt(n);if(t==='EUR')return '€'+fmt(n);if(t==='USD')return '$'+fmt(n);return fmt(n)+' '+t;}
function valueEvent(key,value){N.events.emit('value',{engine:ID,key:key,value:value});}
function tx(g,x,y,text,role,size,anchor){return N.chalkText(g,x,y,String(text),{role:role||'given',size:size||20,anchor:anchor||'middle'});}
function ln(g,x,y,x2,y2,role,w){return N.neonLine(g,x,y,x2,y2,{role:role||'op',width:w||3});}
function path(g,d,role,w,fill){return N.neonPath(g,d,{role:role||'op',width:w||3,fill:!!fill});}
function metrics(){return window.innerWidth<=560?{W:400,H:538,L:20,R:221,bw:159,ty:164,mid:201,tokenY:409,gateY:316,bottom:495}: {W:650,H:515,L:29,R:350,bw:268,ty:159,mid:325,tokenY:401,gateY:310,bottom:480};}
function tokenW(d){return d.W===400?111:165;}
function makeToken(svg,d,s,i,x,y,atGate,o){var p=s.p,g=E('g',{'data-factor-index':i,'data-token':p.choices[i],role:'button',tabindex:'0','aria-label':p.choices[i]+(atGate?', currently on the bridge':', choose or drag onto the bridge'),'aria-pressed':s.selected===i?'true':'false'},svg);
 var w=tokenW(d),xx=x-w/2,yy=y-27;N.neonBox(g,xx,yy,w,54,{role:atGate?(i===p.correct?'result':'error'):'op',r:12});
 tx(g,x,y+7,p.choices[i],atGate?(i===p.correct?'result':'error'):'op',d.W===400?18:22);
 if(o.drag){var gate={x:d.mid-101,y:d.gateY-34,w:202,h:74,id:'gate',kind:'drop'},tray={x:13,y:d.tokenY-46,w:d.W-26,h:101,id:'tray',kind:'remove'};
  N.ui.svgDrag(svg,g,{box:{x:xx,y:yy,w:w,h:54},zones:function(){return atGate?[gate,tray]:[gate];},removeTo:{x:d.mid,y:d.tokenY},onDrop:function(id){if(id!=='gate')return false;s.selected=i;valueEvent('factor',p.choices[i]);if(o.refresh)o.refresh();return true;},onRemove:function(){s.selected=null;valueEvent('factor',null);if(o.refresh)o.refresh();}});
  // Core reorders the moving node. Restore pointer capture after its pointerdown listener.
  g.addEventListener('pointerdown',function(ev){if(N.ui._drag&&N.ui._drag.el===g){try{g.setPointerCapture(ev.pointerId);}catch(_){}}});
 }
 g.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();s.selected=atGate?null:i;valueEvent('factor',s.selected==null?null:p.choices[i]);if(o.refresh)o.refresh(i);return;}
  if((ev.key==='Delete'||ev.key==='Backspace')&&atGate){ev.preventDefault();s.selected=null;valueEvent('factor',null);if(o.refresh)o.refresh();return;}
  if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();var a=[...svg.querySelectorAll('[data-factor-index]')];var j=a.findIndex(q=>q===g);if(j>=0)a[(j+(ev.key==='ArrowRight'?1:-1)+a.length)%a.length].focus();}
 });return g;
}
function createDrawing(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("createDrawing",arguments);}
o=o||{};var p=s.p,d=metrics(),svg=S.root(d.W,d.H,'Neon unit-conversion bridge: '+val(p,s.amount)+' to '+p.to+' using '+p.relation+'. '+(s.selected==null?'Factor slot empty.':'Placed factor '+p.choices[s.selected]+'.'));svg.classList.add('f1802-drawing');
 var bg=E('g',{'aria-hidden':'true'},svg);
 // All principal glass surfaces and luminous curves are approved NOVA core shapes.
 path(bg,'M18 87 Q'+(d.mid-140)+' 81 '+(d.mid-105)+' 84 M'+(d.mid+105)+' 84 Q'+(d.mid+140)+' 81 '+(d.W-18)+' 87','support',2.7);
 ln(bg,24,120,d.W-24,120,'support',1.5);
 N.neonRing(bg,d.mid,83,{role:'op',r:7,pulse:false});
 tx(svg,d.mid,67,p.short,'op',25);
 N.neonBox(svg,d.mid-134,89,268,47,{role:'op',r:15,text:p.relation,size:d.W===400?18:20});
 // Left chamber and right chamber are different semantic roles and patterns.
 var q1=E('g',{'data-maths':'known-value'},svg),q2=E('g',{'data-maths':'converted-value'},svg);
 N.neonBox(q1,d.L,d.ty,d.bw,119,{role:'given',r:19});
 N.neonBox(q2,d.R,d.ty,d.bw,119,{role:o.showAnswer?'result':'unknown',r:19});
 tx(q1,d.L+d.bw/2,d.ty+34,'From','given',18);
 tx(q1,d.L+d.bw/2,d.ty+88,val(p,s.amount), 'given',d.W===400?26:29);
 tx(q2,d.R+d.bw/2,d.ty+34,'To',o.showAnswer?'result':'unknown',18);
 tx(q2,d.R+d.bw/2,d.ty+88,o.showAnswer?val(p,s.amount*p.factor,p.to):'? '+p.to,o.showAnswer?'result':'unknown',d.W===400?25:29);
 // A continuous neon bridge: the dock is mathematically the converter, not scenery.
 path(bg,'M'+(d.L+d.bw/2)+','+(d.ty+120)+' C'+(d.L+d.bw/2)+',299 '+(d.mid-96)+',291 '+d.mid+',291 C'+(d.mid+96)+',291 '+(d.R+d.bw/2)+',299 '+(d.R+d.bw/2)+','+(d.ty+120),'op',4);
 N.neonRing(bg,d.L+d.bw/2,d.ty+121,{role:'given',r:6,pulse:false});N.neonRing(bg,d.R+d.bw/2,d.ty+121,{role:'result',r:6,pulse:false});
 var gate=E('g',{'data-maths':'factor-target'},svg);
 N.neonBox(gate,d.mid-101,d.gateY-34,202,72,{role:s.selected===p.correct?'result':s.selected!=null?'error':'unknown',r:18});
 if(s.selected==null)tx(gate,d.mid,d.gateY+8,'Drop a factor', 'unknown',19);
 // Choice 0,1,2 travel from the lower tray to a central glowing gate.
 var positions=d.W===400?[69,200,331]:[d.mid-205,d.mid,d.mid+205];
 for(var i=0;i<3;i++){if(s.selected===i)continue;makeToken(svg,d,s,i,positions[i],d.tokenY,false,o);}
 if(s.selected!=null)makeToken(svg,d,s,s.selected,d.mid,d.gateY,true,o);
 tx(svg,d.mid,d.tokenY-46,'Choose a multiplier or divisor','op',18);
 path(bg,'M18 '+(d.tokenY+46)+' H'+(d.W-18),'support',2.2);
 var outText=o.showAnswer?val(p,s.amount)+'  =  '+val(p,s.amount*p.factor,p.to):'Complete the bridge to convert the units';
 if(s.selected!=null&&!o.showAnswer){outText=s.selected===p.correct?'Factor selected · ready to convert':'Think: does this factor match the units?';}
 N.neonBox(svg,20,d.bottom-24,d.W-40,51,{role:o.showAnswer?'result':s.selected===p.correct?'op':'unknown',r:14,text:outText,size:d.W===400?16:20});
 stage.appendChild(svg);return svg;
}
function sidecards(box,s,o){var p=s.p,side=h('div',{class:'f1802-side','data-maths':'conversion-explainer'});
 var chips=[['GIVEN UNIT',p.from,'given'],['TARGET UNIT',p.to,'result'],['RELATION',p.relation,'op'],['OPERATION',s.selected==null?'Choose a factor':p.choices[s.selected],s.selected===p.correct?'result':s.selected==null?'unknown':'error']];
 chips.forEach(function(v){var card=h('div',{class:'f1802-sidecard'},[h('span',{class:'f1802-card-label',text:v[0]}),h('strong',{class:'f1802-card-value f1802-'+v[2],text:v[1]})]);side.appendChild(card);});
 if(o.showAnswer)side.appendChild(h('div',{class:'f1802-check',text:p.explain}));
 box.appendChild(side);return side;
}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Unit-conversion bridges',o.tag||'UNITS LAB');var layout=h('div',{class:'f1802-layout'});stage.appendChild(layout);var plot=h('div',{class:'f1802-plot'});layout.appendChild(plot);var svg=createDrawing(plot,s,o);sidecards(layout,s,o);
 var feedback=h('div',{class:'f1802-feedback','aria-live':'polite'});if(o.feedback){feedback.textContent=o.feedback;stage.appendChild(feedback);}
 N.scene.helperStrip(stage,o.pose||'explain',o.say||pget().rule);return svg;}
var steps=[
 {name:'See the context',pose:'explain',narration:'We are converting from metres to centimetres. The beam is three point two metres long.',prompt:'Which unit are we starting with?',say:'Start by reading both units. A length can have different numerical values in different units.'},
 {name:'Read the relation',pose:'compare',narration:'One metre contains one hundred centimetres. This relationship tells us how the units connect.',prompt:'How many centimetres make one metre?',say:'The unit relationship is our bridge. We do not choose the operation by guesswork.'},
 {name:'Choose the factor',pose:'think',narration:'We want smaller centimetre units, so the number of units becomes one hundred times bigger.',prompt:'Should we multiply or divide the number of metres?',say:'Each metre contains one hundred centimetres, so select multiply by one hundred.'},
 {name:'Move across the bridge',pose:'point-down',narration:'Multiply three point two by one hundred. Each whole metre becomes one hundred centimetres.',prompt:'Explain why the factor is one hundred, not ten.',say:'The same physical length is being renamed using smaller units.'},
 {name:'Reveal the answer',pose:'count',narration:'Three point two multiplied by one hundred equals three hundred and twenty centimetres.',prompt:'What is the length in centimetres?',say:'The answer is three hundred and twenty centimetres. The physical beam has not changed.'},
 {name:'Check the units',pose:'celebrate',narration:'Our converted number is larger because centimetres are smaller than metres. Label the answer centimetres.',prompt:'What error happens if you write three hundred and twenty metres?',say:'The units are essential. Three hundred and twenty metres would describe a very different beam.'}
];
function watchRender(i,stage){var p=pget('length'),s={p:p,amount:p.amount,selected:i>=3?p.correct:null},d=metrics();var svg=scene(stage,s,{title:'Watch the unit bridge',tag:'STEP '+(i+1)+'/6',pose:steps[i].pose,say:steps[i].say,showAnswer:i>=4});
 if(i===1)M.flash(svg,d.mid,114,'op',18);if(i===2)M.flash(svg,d.mid,d.gateY,'unknown',18);
 if(i===3){var g=svg.querySelector('[data-factor-index="'+s.p.correct+'"]');if(g)M.arrive(g,0,55,680);}
 if(i===4){var g2=svg.querySelector('[data-maths="converted-value"]');if(g2){M.pop(g2,d.R+d.bw/2,d.ty+65);var t=g2.querySelectorAll('text')[1];if(t&&!N.reducedMotion()){M.tween(650,function(k){t.textContent=fmt(s.amount*p.factor*k)+' '+p.to;},M.ease.inOut,function(){t.textContent=val(p,s.amount*p.factor,p.to);});}}}
 if(i===5)M.flash(svg,d.R+d.bw/2,d.ty+65,'result',24);
}
function parseAnswer(text,p){var v=String(text||'').trim().replace(/,/g,'').replace(/−/g,'-');var match=v.match(/^([£€$])\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*$/);if(match){return {valid:true,value:Number(match[2]),unit:({'£':'GBP','€':'EUR','$':'USD'})[match[1]]};}
 match=v.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*(g\/cm³|kg\/m³|km\/h|m\/s|cm²|mm²|(?:[a-zA-Z]+))\s*$/i);if(!match)return {valid:false,unit:'',value:NaN};var unit=match[2],aliases={hours:'h',hour:'h',hrs:'h',hr:'h',minutes:'min',minute:'min',litres:'L',litre:'L',ml:'mL',eur:'EUR',usd:'USD',gbp:'GBP'};unit=aliases[unit.toLowerCase()]||unit;return {valid:true,value:Number(match[1]),unit:unit};}
function feedbackFor(p,v,selected){if(selected!==p.correct)return [false,selected==null?'The bridge is empty. Place the correct factor in the glowing dock first.':'The selected factor changes the units in the wrong direction. Compare the two unit sizes and the stated relation.'];var a=parseAnswer(v,p);if(!a.valid)return [false,'Write a numerical answer followed by its target unit: '+p.to+'.'];if(a.unit!==p.to)return [false,'Check the unit. You must give your converted answer in '+p.to+', not '+(a.unit||'a different unit')+'.'];var expected=p.amount*p.factor,tol=Math.max(.00001,Math.abs(expected)*1e-6);if(Math.abs(a.value-expected)<=tol)return [true,'Correct: '+p.explain];
 if(Math.abs(a.value-p.amount)<tol)return [false,'You copied the original numerical value without converting it. Use the unit relationship.'];
 if(Math.abs(a.value-p.amount/p.factor)<=Math.max(tol,.0001))return [false,'You reversed the conversion factor. Check whether the target unit is larger or smaller.'];
 if(p.kind==='area'&&Math.abs(a.value-p.amount*10)<tol)return [false,'That is the length conversion factor. Area is square units: 10 × 10 = 100.'];
 if(p.kind==='volume'&&Math.abs(a.value-p.amount*100)<tol)return [false,'Capacity uses 1,000 millilitres per litre, not 100.'];
 if(p.kind==='speed'&&Math.abs(a.value-p.amount/60)<tol)return [false,'You changed only the time unit. Convert both kilometres and hours.'];
 if(p.kind==='density'&&Math.abs(a.value-p.amount*.001)<tol)return [false,'You changed grams to kilograms but ignored the volume unit, cubic centimetres to cubic metres.'];
 if(p.kind==='currency'&&Math.abs(a.value-(p.amount+p.factor))<tol)return [false,'An exchange rate is multiplicative. Multiply by the given rate, do not add it.'];
 return [false,'Your units are correct, but the value is not. '+p.rule];}
var def={id:ID,title:'Unit-conversion bridges',config:C,steps:steps,render:watchRender,alt:'Premium neon conversion bridge between source and target unit chambers with draggable factor tiles, glowing conversion dock and result.',staticAlt:'A conversion uses the given relationship between units. For example, 3.2 metres multiplied by 100 gives 320 centimetres.',
 exploreIntro:'Select a context, drag one factor into the luminous dock, and check the resulting value. Placed factors can be dragged out again; keyboard Enter also places or removes a factor.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset in C.presets?C.preset:'length';window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",()=>({p:pget(key),amount:pget(key).amount,selected:null})):({p:pget(key),amount:pget(key).amount,selected:null}));window.NovaLessonComponent?.applyExploreModels();var pick=h('select',{class:'nova-input','aria-label':'Conversion lesson preset'}),msg=h('div',{class:'f1802-status','aria-live':'polite'}),controls=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){pick.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();pick.value=key;
 window.NovaLessonComponent?.applyExploreModels();var amount=h('input',{class:'nova-input f1802-input',type:'number',step:'any',min:'0','aria-label':'Source value',value:String(s.amount)});
 window.NovaLessonComponent?.applyExploreModels();function refresh(focus){var correct=s.selected===s.p.correct;var fb=s.selected==null?'Place a factor to connect the two units.':correct?'Correct factor. '+s.p.rule:'This operation is not equivalent to the given unit relationship. Try the other factor.';
  scene(stage,s,{title:'Explore conversion bridges',tag:'DRAG · SNAP · REGRAB',pose:correct?'count':s.selected==null?'point-down':'think',say:fb,showAnswer:correct,drag:true,refresh:refresh,feedback:fb});msg.textContent=s.p.story+'  ·  '+(correct?'Converted value: '+val(s.p,s.amount*s.p.factor,s.p.to):'Answer hidden until the correct conversion factor is chosen.');if(focus!=null){var b=stage.querySelector('[data-factor-index="'+focus+'"]');if(b)b.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();pick.onchange=function(){key=pick.value;C.preset=key;s={p:pget(key),amount:pget(key).amount,selected:null};amount.value=String(s.amount);valueEvent('preset',key);refresh();};
 window.NovaLessonComponent?.applyExploreModels();amount.onchange=function(){if(!Number.isFinite(Number(amount.value))||Number(amount.value)<0){amount.value=String(s.amount);return;}s.amount=Number(amount.value);valueEvent('amount',s.amount);refresh();};
 window.NovaLessonComponent?.applyExploreModels();controls.appendChild(h('label',{class:'pr-row'},['Given amount ',amount]));window.NovaLessonComponent?.applyExploreModels();controls.appendChild(h('button',{class:'nova-btn',text:'Clear bridge',onclick:function(){s.selected=null;valueEvent('factor',null);refresh();}}));
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',pick]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(controls);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(msg);window.NovaLessonComponent?.applyExploreModels();refresh();window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){return {preset:key,amount:s.amount,selected:s.selected,result:s.selected===s.p.correct?s.amount*s.p.factor:null};},select:function(k){pick.value=k;pick.onchange();},place:function(i){s.selected=i;refresh();},clear:function(){s.selected=null;refresh();},setAmount:function(n){amount.value=n;amount.onchange();}};
 },
 challenge:function(panel,api,stage){var taskKeys=['time','length','area','volume','euro','speed','density','dollar'],j=0,s={p:pget(taskKeys[j]),amount:pget(taskKeys[j]).amount,selected:null};var q=h('p',{class:'pr-task'}),inp=h('input',{class:'nova-input',type:'text',inputmode:'text','aria-label':'Converted number and target unit',placeholder:'Number and unit'}),stat=h('div',{class:'f1802-status','aria-live':'polite'}),bar=h('div',{class:'pr-row'});
 function repaint(focus){scene(stage,s,{title:'Challenge '+(j+1)+' / '+taskKeys.length,tag:'CHECK THE FACTOR AND THE UNIT',pose:'read-tablet',say:'Choose the factor, then enter the converted value with '+s.p.to+'.',drag:true,refresh:repaint});if(focus!=null){var b=stage.querySelector('[data-factor-index="'+focus+'"]');if(b)b.focus({preventScroll:true});}}
 function load(){var p=pget(taskKeys[j]);s={p:p,amount:p.amount,selected:null};q.textContent=(j+1)+' / '+taskKeys.length+' · '+p.story+' Convert '+p.from+' to '+p.to+'. Use the factor bridge and enter the answer with its unit.';inp.value='';stat.textContent='';repaint();}
 bar.appendChild(h('button',{class:'nova-btn primary',text:'Check conversion',onclick:function(){var out=feedbackFor(s.p,inp.value,s.selected);stat.textContent=out[1];api.check(out[0],out[1],{task:j,preset:taskKeys[j]});valueEvent('answer',inp.value);if(out[0]&&j<taskKeys.length-1){var tmr=setTimeout(function(){j++;load();},900);api.onCleanup(function(){clearTimeout(tmr);});}}}));
 bar.appendChild(h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(s.p.why+' '+s.p.rule);}}));
 bar.appendChild(h('button',{class:'nova-btn',text:'Clear factor',onclick:function(){s.selected=null;repaint();}}));
 panel.appendChild(q);panel.appendChild(h('label',{class:'pr-row'},['Converted answer ',inp]));panel.appendChild(bar);panel.appendChild(stat);load();
 C._challenge={task:function(){return j;},state:function(){return {task:j,key:taskKeys[j],selected:s.selected,entry:inp.value};},solve:function(){s.selected=s.p.correct;inp.value=val(s.p,s.amount*s.p.factor,s.p.to);repaint();},check:function(value,selected){s.selected=selected==null?s.p.correct:selected;return feedbackFor(s.p,value,s.selected);},tasks:taskKeys.slice()};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"steps":()=>steps},draws:{"createDrawing":["stage","s","o"],"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F18·02',title:'Unit-conversion bridges',def:def,years:'KS3 Year 7 to Year 9, plus GCSE compound measures.',linked:['F0-02','F0-03','F0-04','F2-03','F6-12','F18-01','F18-09'],spec:{purpose:'Convert correctly between time, metric, area, capacity, currency and compound units. Choose the operation from a defined unit relation, then give an accurate value with its unit.',params:'Source value, source/target units, stated relationship, conversion factor, three draggable operation choices, unit-aware answer.',presets:'Y7-050 time; Y7-051 length, area and capacity; Y8-039 currency; Y8-043 speed; Y9-024 density; F6-12 and F18-09 currency and unit bridge presets included here.',steps:'Context → Read relationship → Choose multiplier/divisor → Move factor to bridge → Reveal conversion → Check unit.',interactions:'WATCH narrated steps; GUIDED conceptual prompts; EXPLORE drag/re-grab/remove, keyboard factor selection and amount editing; CHALLENGE eight tasks checking selected factor, value and unit.',traps:'Reverse factor; misuse area length factor; miss the cubic conversion; convert speed numerator but not denominator; omit unit; mistake example exchange rate for a live quotation.',gcse:'Compound rates, density, and inverse currency factors.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5000);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

