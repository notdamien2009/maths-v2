
/* NOVA F18-10 · Estimating in context — original NOVA core, unchanged. */
(function(){'use strict';
var N=NOVA,S=N.svg,E=S.el,M=N.motion,h=N.h,ID='F18-10';
var presets={
 shopping:{label:'Deliveries · rounded mass',context:'A school delivery has six full crates and a partially filled crate, equal to 6.1 full-crate loads. One full crate weighs 19.8 kg.',a:19.8,b:6.1,round:[20,6],bad:[2,60],op:'×',unit:'kg',sig:'Round to easy whole numbers',topic:'Delivery mass',illustration:'crates',why:'Round the mass to twenty kilograms and the number of crates to six. Multiply to make a quick prediction.',speech:'A delivery contains about six crates at about twenty kilograms each. That is roughly one hundred and twenty kilograms.'},
 tickets:{label:'Concert tickets · total cost',context:'Estimate a group cost for 297 tickets priced at £18.90 each.',a:297,b:18.9,round:[300,20],bad:[30,2],op:'×',unit:'£',sig:'Use nearby friendly numbers',topic:'Ticket revenue',illustration:'tickets',why:'Three hundred tickets at about twenty pounds each gives a sensible estimate.',speech:'Nearly three hundred tickets cost nearly twenty pounds each. The estimate is six thousand pounds.'},
 seats:{label:'Arena · seating capacity',context:'A stand has 48 rows with 19 seats in each row.',a:48,b:19,round:[50,20],bad:[5,2],op:'×',unit:'seats',sig:'Round to tens',topic:'Seats in a stand',illustration:'seats',why:'About fifty rows of twenty seats means about one thousand seats.',speech:'Rounding both quantities to a nearby ten makes this calculation much easier.'},
 area:{label:'Garden · approximate area',context:'A rectangular garden measures 15.2 m by 8.9 m.',a:15.2,b:8.9,round:[15,9],bad:[150,90],op:'×',unit:'m²',sig:'Round to whole metres',topic:'Garden area',illustration:'area',why:'Fifteen multiplied by nine is one hundred and thirty-five square metres.',speech:'A sensible area estimate uses fifteen metres by nine metres.'},
 journey:{label:'Journey · approximate speed',context:'A coach travels 205 km in 3.9 hours. Estimate its speed.',a:205,b:3.9,round:[200,4],bad:[20,40],op:'÷',unit:'km/h',sig:'Choose compatible numbers',topic:'Journey speed',illustration:'journey',why:'Two hundred divided by four gives about fifty kilometres per hour.',speech:'First round the distance and the time. Then divide to estimate the speed.'},
 packets:{label:'Warehouse · significant figures',context:'Each parcel has a mass of 0.052 kg and there are 1,980 parcels.',a:0.052,b:1980,round:[0.05,2000],bad:[0.5,200],op:'×',unit:'kg',sig:'One significant figure each',topic:'Parcel shipment',illustration:'packets',why:'Zero point zero five times two thousand gives about one hundred kilograms.',speech:'Use one significant figure for each quantity and keep the place value intact.'}
};
var tests=[
 {label:'School shipment',key:'shopping',a:18.9,b:5.2,round:[20,5],bad:[2,50],unit:'kg',op:'×',q:'A full crate weighs 18.9 kg and the shipment equals 5.2 full-crate loads, including a partial crate. Estimate the mass.'},
 {label:'Theatre booking',key:'tickets',a:308,b:19.6,round:[300,20],bad:[30,2],unit:'£',op:'×',q:'Estimate the price of 308 tickets costing £19.60 each.'},
 {label:'Stadium stand',key:'seats',a:59,b:21,round:[60,20],bad:[6,2],unit:'seats',op:'×',q:'Estimate the number of seats in 59 rows of 21.'},
 {label:'Vegetable patch',key:'area',a:12.9,b:7.1,round:[13,7],bad:[130,70],unit:'m²',op:'×',q:'Estimate the area of a 12.9 m by 7.1 m rectangle.'},
 {label:'Vehicle journey',key:'journey',a:395,b:8.1,round:[400,8],bad:[40,80],unit:'km/h',op:'÷',q:'Estimate average speed for 395 km travelled in 8.1 hours.'},
 {label:'Packaging',key:'packets',a:0.031,b:3030,round:[0.03,3000],bad:[0.3,300],unit:'kg',op:'×',q:'Estimate total mass for 3,030 packages of mass 0.031 kg each.'}
];
var C=window.NovaV2Integration.configuration(window.NOVA_F18_10_CONFIG={preset:'shopping',events:['value','step','correct','hintUsed','mode'],valueKeys:['preset','token','tokenRemoved','reset','answer'],presets:presets,challengeTasks:tests});
function fmt(v){return Number(Number(v).toPrecision(8)).toLocaleString('en-GB',{maximumFractionDigits:6});}
function unit(v,u){return u==='£'?'£'+fmt(v):fmt(v)+' '+u;}
function state(p){return {p:p,slots:[null,null]};}
function estimate(s){var p=s.p;return p.op==='×'?p.round[0]*p.round[1]:p.round[0]/p.round[1];}
function exact(s){var p=s.p;return p.op==='×'?p.a*p.b:p.a/p.b;}
function emit(key,value){N.events.emit('value',{engine:ID,key:key,value:value});}
function nb(par,x,y,w,hh,role,r){return N.neonBox(par,x,y,w,hh,{role:role||'focus',r:r||12});}
function nl(par,x,y,a,b,role,w){return N.neonLine(par,x,y,a,b,{role:role||'support',width:w||2.4});}
function tx(par,x,y,v,role,size){return N.chalkText(par,x,y,String(v),{role:role||'given',size:size||20,anchor:'middle'});}
function roundToken(p,idx,bad){return bad?p.bad[idx]:p.round[idx];}
function tokenKey(idx,bad){return idx+(bad?'w':'c');}
function parseToken(k){return {index:+k[0],wrong:k[1]==='w'};}
function picture(svg,p){var kind=p.illustration;
 // All visible constructions use shared NOVA neonTube/box primitives.
 if(kind==='crates'||kind==='packets'){
   for(var i=0;i<3;i++){var x=103+i*82,y=139+(i%2)*9;nb(svg,x,y,70,58,i%2?'support':'given',8);nl(svg,x+11,y+16,x+59,y+16,'focus',2);tx(svg,x+35,y+47,kind==='crates'?'BOX':'KG','given',16);}
 }else if(kind==='tickets'){
   for(var i=0;i<3;i++){var x=93+88*i;nb(svg,x,139,76,62,'focus',9);nl(svg,x+9,158,x+67,158,'op',2);tx(svg,x+38,186,'£','given',25);}
 }else if(kind==='seats'){
   for(var r=0;r<2;r++)for(var j=0;j<5;j++){var x=94+j*54,y=132+r*46;nb(svg,x,y,46,34,r?'given':'focus',8);}
 }else if(kind==='area'){
   nb(svg,103,131,234,76,'given',8);for(var j=1;j<6;j++)nl(svg,103+j*39,132,103+j*39,206,'support',1.8);for(var k=1;k<3;k++)nl(svg,104,131+k*25,337,131+k*25,'support',1.8);
 }else if(kind==='journey'){
   nb(svg,104,143,232,52,'given',12);nb(svg,142,123,113,28,'support',8);[145,295].forEach(function(x){N.neonRing(svg,x,205,{role:'result',r:8});});
 }
}
function card(parent,label,value,kind){var c=h('div',{class:'f1810-card'});if(kind)c.setAttribute('data-'+kind,'');c.append(h('small',{text:label}),h('strong',{text:value}));parent.appendChild(c);}
function geo(i){return {x:i===0?52:246,y:492,w:142,h:74};}
function wireDrag(svg,el,s,key,box,placed,refresh){var pos=placed?s.slots.indexOf(key):-1;function zones(){if(placed)return [{id:'remove',kind:'remove',x:29,y:726,w:379,h:60}];return [0,1].filter(function(i){return s.slots[i]===null;}).map(function(i){var z=geo(i);return {id:'slot'+i,kind:'drop',x:z.x,y:z.y,w:z.w,h:z.h};});}
 N.ui.svgDrag(svg,el,{box:box,zones:zones,removeTo:{x:box.x+box.w/2,y:box.y+box.h/2},onDrop:function(id){if(placed)return false;var i=Number((id||'').slice(4));if((id==='slot0'||id==='slot1')&&s.slots[i]===null){s.slots[i]=key;emit('token',{key:key,slot:i});refresh();return true;}return false;},onRemove:function(){if(placed){s.slots[pos]=null;emit('tokenRemoved',key);refresh();}}});
 el.addEventListener('pointerdown',function(e){if(N.ui._drag&&N.ui._drag.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});
 el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();if(placed){s.slots[pos]=null;emit('tokenRemoved',key);}else{var i=s.slots.findIndex(function(x){return x===null;});if(i>=0){s.slots[i]=key;emit('token',{key:key,slot:i});}}refresh();}
 else if(placed&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();s.slots[pos]=null;emit('tokenRemoved',key);refresh();}
 else if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();var a=[].slice.call(svg.querySelectorAll('.f1810-token'));var ix=a.indexOf(el),d=(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:1,next=a[(ix+d+a.length)%a.length];if(next)next.focus();}});
}
function graph(svg,s,o){var p=s.p,hide=!!o.hideAnswers,step=o.step||0,chosen=s.slots.filter(Boolean).length;
 tx(svg,220,34,o.interactive?'Drag rounded values into the ring':'Estimate first · calculate later','focus',21);nl(svg,37,51,403,51,'focus',3);
 tx(svg,220,86,p.topic,'given',22);picture(svg,p);
 tx(svg,220,244,'Estimate ring','focus',23);
 var path='M 220 268 A 89 89 0 1 0 220 446 A 89 89 0 1 0 220 268 Z';N.neonPath(svg,path,{role:'focus',width:4,fill:'rgba(15,69,109,.21)'});
 N.neonRing(svg,220,268,{role:'result',r:7});tx(svg,220,318,'≈','op',36);
 if(o.interactive){tx(svg,220,359,chosen===2&& !hide?fmt(roundToken(p,parseToken(s.slots[0]).index,parseToken(s.slots[0]).wrong))+ ' '+p.op+' '+fmt(roundToken(p,parseToken(s.slots[1]).index,parseToken(s.slots[1]).wrong)):'Build the estimate','given',chosen===2?19:22);
  tx(svg,220,397,hide?'Find the result':chosen===2?unit(tokenResult(s),p.unit):'Choose sensible rounds','result',22);
  for(var i=0;i<2;i++){var z=geo(i),v=s.slots[i];nb(svg,z.x,z.y,z.w,z.h,v===null?'support':'result',13);tx(svg,z.x+z.w/2,z.y+21,i===0?'Quantity 1':'Quantity 2','support',16);
   if(v!==null){var q=parseToken(v),g=E('g',{class:'f1810-token','data-token':v,'data-placed':i,tabindex:0,role:'button','aria-label':'Rounded token '+fmt(roundToken(p,q.index,q.wrong))+' placed. Enter or Delete to remove.'},svg);nb(g,z.x+9,z.y+29,z.w-18,36,'result',9);tx(g,z.x+z.w/2,z.y+55,fmt(roundToken(p,q.index,q.wrong)),'result',19);wireDrag(svg,g,s,v,{x:z.x+9,y:z.y+29,w:z.w-18,h:36},true,o.refresh);}
   else tx(svg,z.x+z.w/2,z.y+54,'Drop token','unknown',17);
  }
  tx(svg,220,485,'Round each quantity','given',18);
  var choices=[tokenKey(0,false),tokenKey(1,false),tokenKey(0,true),tokenKey(1,true)];for(var j=0;j<4;j++){var key=choices[j];if(s.slots.includes(key))continue;var v=parseToken(key),x=j%2===0?125:314,y=j<2?614:672;var g=E('g',{class:'f1810-token','data-token':key,'data-source':key,tabindex:0,role:'button','aria-label':'Drag rounded value '+fmt(roundToken(p,v.index,v.wrong))+' or press Enter'},svg);nb(g,x-75,y-21,150,43,'op',10);tx(g,x,y+8,fmt(roundToken(p,v.index,v.wrong)),'op',19);wireDrag(svg,g,s,key,{x:x-75,y:y-21,w:150,h:43},false,o.refresh);}
  if(o.interactive){nl(svg,29,735,410,735,'error',2);tx(svg,220,755,'Remove · drag token here','error',17);tx(svg,220,786,'Keyboard: Enter place · Delete remove','support',16);}
 }else{
  tx(svg,220,360,step>=2?fmt(p.round[0])+' '+p.op+' '+fmt(p.round[1]):'Choose easy numbers','given',22);
  tx(svg,220,399,step>=4?unit(estimate(s),p.unit):'Make a sensible prediction','result',21);
  tx(svg,220,493,step>=3?'The rounded values keep the units.':'Can you round without changing scale?','given',19);
  if(step>=4){nb(svg,70,526,300,67,'result',13);tx(svg,220,567,unit(estimate(s),p.unit),'result',27);}
  else{nb(svg,70,526,300,67,'support',13);tx(svg,220,565,'Estimate ≠ exact answer','support',20);}
 }
}
function tokenResult(s){var a=s.slots[0],b=s.slots[1];if(a===null||b===null)return null;var t1=parseToken(a),t2=parseToken(b);var x=roundToken(s.p,t1.index,t1.wrong),y=roundToken(s.p,t2.index,t2.wrong);return s.p.op==='×'?x*y:x/y;}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Estimating in context',o.tag||'ROUND · REASON · ESTIMATE');var layout=h('div',{class:'f1810-layout'}),main=h('div',{class:'f1810-main'}),aside=h('div',{class:'f1810-side'});layout.append(main,aside);stage.appendChild(layout);
 var svg=S.root(440,o.interactive?808:616,'NOVA neon context illustration with estimate ring and movable rounded-number tokens.');svg.classList.add('f1810-svg');main.appendChild(svg);graph(svg,s,o);var p=s.p;
 card(aside,'ORIGINAL INPUTS',fmt(p.a)+' '+p.op+' '+fmt(p.b),'given');card(aside,'ROUNDING STRATEGY',p.sig,'method');card(aside,'CALCULATE',o.hideAnswers?'Your estimate':o.interactive&&s.slots.filter(Boolean).length<2?'Place both values':fmt(p.round[0])+' '+p.op+' '+fmt(p.round[1]),'working');card(aside,'ESTIMATE',o.hideAnswers?'Work it out':o.interactive&&s.slots.filter(Boolean).length<2?'Waiting for values':unit(estimate(s),p.unit),'answer');
 aside.appendChild(h('p',{class:'f1810-explain',text:o.hideAnswers?'Choose a sensible rounded value for each quantity, then calculate your estimate with units.':p.why}));if(o.interactive)aside.appendChild(h('p',{class:'f1810-progress',text:s.slots.filter(Boolean).length+'/2 tokens placed · correct place value matters more than finding an exact result.'}));
 N.scene.helperStrip(stage,o.pose||'explain',o.say||'Round first, calculate next, and check the unit at the end.');return svg;
}
var steps=[
 {name:'Read the real-world situation',pose:'explain',narration:'We want to estimate the mass of a school delivery. Each crate weighs nineteen point eight kilograms, and the plan is for six point one crates.',prompt:'What are the two quantities?',say:'Find what is being multiplied and keep the kilograms in mind.'},
 {name:'Choose useful rounded numbers',pose:'point-down',narration:'Nineteen point eight is close to twenty. Six point one is close to six.',prompt:'Why are twenty and six helpful?',say:'These friendly numbers are near the originals, without changing their place value.'},
 {name:'Put both values in the ring',pose:'count',narration:'Use twenty multiplied by six to estimate the shipment mass.',prompt:'Which operation belongs here?',say:'This is multiplication, because each crate adds about twenty kilograms.'},
 {name:'Keep the unit',pose:'compare',narration:'The estimate will be measured in kilograms. A unit gives the approximate answer meaning.',prompt:'What will our answer unit be?',say:'Remember to write kilograms. A number without its unit is incomplete.'},
 {name:'Calculate the estimate',pose:'think',narration:'Twenty multiplied by six is one hundred and twenty kilograms. This is an estimate, not the precise mass.',prompt:'Is the result exact or approximate?',say:'About one hundred and twenty kilograms is a sensible prediction.'},
 {name:'Compare and transfer',pose:'celebrate',narration:'The exact calculation gives a little more than our estimate. Estimation helps check whether a later exact result is reasonable.',prompt:'What would make a predicted mass ten times too large?',say:'Check the place value: one wrong zero can make a prediction ten times too large.'}
];
function watch(i,stage){var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.s",(...a)=>state(...a),[presets.shopping]):(state(presets.shopping))),o={title:'How to estimate a real quantity',tag:'STEP '+(i+1)+' / '+steps.length,step:i,pose:steps[i].pose,say:steps[i].say};var svg=scene(stage,s,o);if(i>0)M.flash(svg,220,i>3?369:300,i>3?'result':'focus',19);if(i===4){var out=stage.querySelector('.f1810-card[data-answer] strong');if(out)M.tween(800,function(v){out.textContent=unit(Math.round(120*v),s.p.unit);},M.ease.out);}if(i===5){var ch=N.answerChip('About 120 kg · sensible',true);ch.classList.add('f1810-pop');stage.querySelector('.f1810-side').appendChild(ch);}}
function check(s,raw){var p=s.p,v=String(raw||'').trim().replace(/,/g,'');var a=v.match(/^(£)?\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*([a-zA-Z²/]+)?$/);if(!a)return [false,'Write your estimate as a number with its correct unit.'];var n=Number(a[2]);if(!Number.isFinite(n))return [false,'Enter a finite number.'];var u=(a[1]||a[3]||'').toLowerCase();var expectedUnit=p.unit.toLowerCase();var aliases={'£':['£','gbp','pounds'],'kg':['kg','kilograms','kilogram'],'seats':['seats','seat'],'m²':['m²','m2'],'km/h':['km/h','kmh','kph']};if(!(aliases[expectedUnit]||[expectedUnit]).includes(u))return [false,'Include the correct unit: '+p.unit+'.'];var expected=estimate(s);if(Math.abs(n-expected)>1e-6*Math.max(1,Math.abs(expected))){if(Math.abs(n-exact(s))<.0001)return [false,'That is the exact calculation. The question asks for an estimate using rounded values.'];if(Math.abs(n-expected*10)<.0001||Math.abs(n-expected/10)<.0001)return [false,'Your estimate is ten times too big or too small. Check the place value in your rounding.'];if(p.op==='÷'&&Math.abs(n-(p.round[0]*p.round[1]))<.0001)return [false,'Speed is distance divided by time, not multiplied.'];return [false,'Recheck your rounded numbers and calculate again; an estimate is not necessarily the exact answer.'];}
 if(s.slots.some(function(x){return x===null;}))return [false,'The numerical estimate is correct. Place both rounded-number tokens into the ring slots as well.'];for(var i=0;i<2;i++){var t=parseToken(s.slots[i]);if(t.wrong)return [false,'One token has the wrong place value. A rounding step must keep the size of the original number.'];if(t.index!==i)return [false,'Check the order: first original quantity in the first slot, second quantity in the second slot.'];}
 return [true,'Correct: rounded values, calculation and unit are all consistent.'];}
var def={id:ID,title:'Estimating in context',config:C,steps:steps,render:watch,alt:'A luminous estimate ring with contextual neon equipment, original measurements and draggable rounded-number tokens.',staticAlt:'Estimation: round each original number to a nearby convenient value while preserving scale; calculate and retain the correct unit.',exploreIntro:'Drag the two sensible rounded values into the estimate ring; try incorrect place values to see why magnitude matters.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",(...a)=>state(...a),[presets[C.preset]]):(state(presets[C.preset]))),select=h('select',{class:'nova-input','aria-label':'Choose real-world estimate'}),feedback=h('p',{class:'f1810-status','aria-live':'polite'});window.NovaLessonComponent?.applyExploreModels();Object.keys(presets).forEach(function(k){select.appendChild(h('option',{value:k,text:presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();select.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();function redraw(){scene(stage,s,{title:'Estimate with sensible numbers',tag:'DRAG · ROUND · CHECK',interactive:true,refresh:redraw,pose:'point-down',say:'Try rounding each input. The ring helps you compare the approximate calculation.'});feedback.textContent=s.slots.every(function(v){return v!==null;})?'Estimate built. Compare the rounded calculation to the original quantities.':'Choose the two rounded values; the alternatives deliberately have incorrect place value.';}
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'f1810-control'},['Situation ',select]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('button',{class:'nova-btn',text:'Clear estimate ring',onclick:function(){s.slots=[null,null];emit('reset','tokens');redraw();}}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(feedback);window.NovaLessonComponent?.applyExploreModels();select.onchange=function(){C.preset=select.value;s=state(presets[C.preset]);emit('preset',C.preset);redraw();};window.NovaLessonComponent?.applyExploreModels();redraw();window.NovaLessonComponent?.applyExploreModels();C._explore={select:function(k){select.value=k;select.onchange();},state:function(){return {preset:C.preset,slots:s.slots.slice(),estimate:estimate(s),exact:exact(s)};},place:function(key,slot){s.slots[slot]=key;redraw();},remove:function(slot){s.slots[slot]=null;redraw();}};
 },
 challenge:function(panel,api,stage){var i=0,timer=null,s,q=h('p',{class:'pr-task'}),entry=h('input',{class:'nova-input',type:'text',placeholder:'Number + unit','aria-label':'Your estimated answer and unit'}),status=h('p',{class:'f1810-status','aria-live':'polite'});
 function redraw(won){scene(stage,s,{title:'Estimate challenge · '+(i+1)+' / '+tests.length,tag:'ROUND · CALCULATE · VERIFY',interactive:true,hideAnswers:true,refresh:redraw,pose:won?'celebrate':'read-tablet',say:won?'Your approximation and units are both right.': 'Do not calculate exactly first. Round each quantity and check your place value.'});}
 function load(){var t=tests[i],base=presets[t.key];s=state(Object.assign({},base,t,{topic:t.label}));q.textContent=(i+1)+' / '+tests.length+' · '+t.q;entry.value='';status.textContent='';status.removeAttribute('data-good');status.removeAttribute('data-bad');redraw();}
 function submit(){var out=check(s,entry.value);status.textContent=out[1];status.toggleAttribute('data-good',out[0]);status.toggleAttribute('data-bad',!out[0]);emit('answer',entry.value);api.check(out[0],out[1],{task:i});if(out[0]){redraw(true);var ch=N.answerChip(unit(estimate(s),s.p.unit)+' · correct',true);ch.classList.add('f1810-pop');stage.querySelector('.f1810-side').appendChild(ch);N.neonRing(stage.querySelector('.f1810-svg'),220,270,{role:'result',r:11});if(i<tests.length-1){if(timer)clearTimeout(timer);timer=setTimeout(function(){i++;load();},1700);}}}
 panel.append(q,h('label',{class:'f1810-control'},['Answer + unit ',entry]),h('div',{class:'f1810-actions'},[h('button',{class:'nova-btn primary',text:'Check estimate',onclick:submit}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint('Use nearby friendly numbers. Keep each number close in size to the original. Then '+(s.p.op==='÷'?'divide.':'multiply.') );}}),h('button',{class:'nova-btn',text:'Reset question',onclick:load})]),status);
 load();api.onCleanup(function(){if(timer)clearTimeout(timer);});C._challenge={tasks:tests,state:function(){return {index:i,slots:s.slots.slice(),expected:estimate(s),unit:s.p.unit};},task:function(j){if(timer)clearTimeout(timer);i=Math.max(0,Math.min(tests.length-1,j));load();},place:function(key,slot){s.slots[slot]=key;redraw();},check:function(raw){return check(s,raw);},solve:function(){s.slots=['0c','1c'];entry.value=unit(estimate(s),s.p.unit);redraw();return entry.value;}};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"presets":()=>presets,"tests":()=>tests,"steps":()=>steps},draws:{"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"factory","factory":"state","argCount":1},"watch.s":{"kind":"factory","factory":"state","argCount":1}}});
N.bankMount({id:ID,num:'F18·10',title:'Estimating in context',def:def,years:'KS3 Year 7 estimation and Year 8 significant figures; GCSE order-of-magnitude extension.',linked:['F0-02','F0-03','F0-04','F1-05','F18-08'],spec:{purpose:'Reason from a real-world context to sensible rounded numbers and an estimate with meaningful units.',params:'Original values, rounded values, multiplication or division, units, selected approximation and context.',presets:'Six settings: school delivery, concert tickets, arena seating, garden area, journey speed, warehouse mass.',steps:'Understand context → choose rounded values → build calculation → check units → calculate → compare reasonableness.',interactions:'Six-step WATCH with Bob narration, GUIDED prompts, mouse/keyboard drag of rounded-number tokens, six CHALLENGE tasks with diagnostics.',traps:'Exact answer substituted for estimate, tenfold place-value drift, wrong operation, missing units, wrong order.',gcse:'Use one significant figure and order of magnitude to sanity-check products and quotients.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4200);};N.events.history().forEach(add);N.events.on('*',add);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();

