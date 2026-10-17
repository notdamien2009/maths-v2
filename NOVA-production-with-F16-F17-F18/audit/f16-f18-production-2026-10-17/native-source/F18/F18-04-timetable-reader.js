
/* NOVA F18-04 · TIMETABLE READER · canonical F0/F2 shared core inlined above */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-04';
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F18_04_CONFIG={startMode:'watch',preset:'bus',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','service','start','end','answer'],
 presets:{
 bus:{label:'Y7 · City bus timetable',short:'City bus route',places:['Maple Park','Library','Station','Leisure Ctr'],trips:[[495,507,522,538],[525,537,552,568],[555,567,582,598]],names:['A','B','C'],from:0,to:3,selected:0,context:'A bus stops at four points across town.',hint:'Read down ONE service column, never mix two different buses.',theme:'Journey duration'},
 school:{label:'Y7 · School arrival deadline',short:'Get to school',places:['Hill Road','Town Square','Library','School'],trips:[[445,459,467,480],[475,489,497,510],[505,519,527,540]],names:['A','B','C'],from:0,to:3,selected:1,context:'Find a bus that reaches school by 08:30.',hint:'Compare the school arrival row with the deadline before choosing a departure.',theme:'Latest suitable departure'},
 rail:{label:'Y7 · Train connection at a junction',short:'Change trains',places:['West End','Junction in','Junction out','Museum'],trips:[[550,572,null,null],[null,null,580,605],[null,null,600,625]],names:['A','B','C'],from:1,to:2,selected:1,context:'Take train A to Junction, then connect to B or C.',hint:'A valid connection departs AFTER the first train arrives. The wait is departure minus arrival.',theme:'Connection wait'},
 night:{label:'Y7 · Journey across midnight',short:'Overnight journey',places:['Harbour','Town Hall','Airport','Terminal'],trips:[[1400,1434,1454,1469],[1415,1438,1458,1473],[1430,1453,1473,1488]],names:['A','B','C'],from:0,to:3,selected:1,context:'These journeys cross midnight into the next day.',hint:'Keep the next-day hour above 24:00 when subtracting, then display the time as a 24-hour clock reading.',theme:'Next-day arrival'},
 midday:{label:'Y7 · Reading times across noon',short:'Midday services',places:['Park','Town','River','Sports'],trips:[[715,728,743,762],[745,758,773,792],[775,788,803,822]],names:['A','B','C'],from:0,to:3,selected:0,context:'Track a bus from before noon into the afternoon.',hint:'12:00 is noon. 13:00 is one in the afternoon.',theme:'24-hour times'}
 }});
function key(k){return CONFIG.presets[k]||CONFIG.presets.bus;}
function pad(v){return String(v).padStart(2,'0');}
function hhmm(v){if(v==null)return '—';return pad(Math.floor(v/60)%24)+':'+pad(v%60);}
function day(v){return v>=1440?' +1 day':'';}
function span(a,b){return (a==null||b==null)?null:b-a;}
function fire(k,v){N.events.emit('value',{engine:ID,key:k,value:v});}
function label(g,x,y,t,role,size,anchor){return N.chalkText(g,x,y,String(t),{role:role||'given',size:size||19,anchor:anchor||'middle'});}
function line(g,x,y,x2,y2,role,w){return N.neonLine(g,x,y,x2,y2,{role:role||'support',width:w||2.5});}
function path(g,d,role,w,fill){return N.neonPath(g,d,{role:role||'op',width:w||3,fill:!!fill});}
function dims(){return window.innerWidth<=560?{W:400,H:638,x:16,rowsY:175,rowH:60,stopW:130,colW:77,slotY:515,tokenY:590}: {W:620,H:635,x:20,rowsY:173,rowH:62,stopW:184,colW:124,slotY:503,tokenY:575};}
function centre(d,c){return d.x+d.stopW+d.colW*(c+.5);}
function headerY(d){return d.rowsY-44;}
function itemBox(d,c,row){return {x:d.x+d.stopW+d.colW*c+4,y:d.rowsY+d.rowH*row+4,w:d.colW-8,h:d.rowH-8};}
function setService(s,i){s.service=i;fire('service',i==null?null:s.p.names[i]);}
function drawToken(svg,d,s,i,o){var on=s.service===i,cx=on?d.W*.5:d.W*(i+1)/4,cy=on?d.slotY:d.tokenY,w=d.W===400?86:106;
 var group=E('g',{class:'f1804-dragtoken','data-service':String(i),tabindex:o.drag?'0':'-1',role:o.drag?'button':'img','aria-label':'Service '+s.p.names[i]+(on?', selected. Press Enter to return it to the tray':'. Drag or press Enter to select'),'aria-pressed':on?'true':'false','data-drag':'service'},svg);
 N.neonBox(group,cx-w/2,cy-24,w,48,{role:on?'result':'op',r:13});label(group,cx,cy+8,'Service '+s.p.names[i],on?'result':'op',d.W===400?20:21);
 if(!o.drag)return group;
 var gate={id:'gate',kind:'drop',x:d.W*.5-67,y:d.slotY-32,w:134,h:64},remove={id:'tray',kind:'remove',x:d.x+2,y:d.tokenY-34,w:d.W-2*d.x-4,h:69};
 N.ui.svgDrag(svg,group,{box:{x:cx-w/2,y:cy-24,w:w,h:48},zones:function(){return on?[gate,remove]:[gate];},removeTo:{x:d.W*(i+1)/4,y:d.tokenY},onDrop:function(z){if(z!=='gate')return false;setService(s,i);o.refresh(i);return true;},onRemove:function(){s.service=null;fire('service',null);o.refresh(i);}});
 group.addEventListener('pointerdown',function(ev){if(N.ui._drag&&N.ui._drag.el===group){try{group.setPointerCapture(ev.pointerId);}catch(_){}}});
 group.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();setService(s,on?null:i);o.refresh(i);}
 if((ev.key==='Delete'||ev.key==='Backspace')&&on){ev.preventDefault();setService(s,null);o.refresh(i);}
 if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();var j=(i+(ev.key==='ArrowRight'?1:2))%3;var next=svg.querySelector('[data-service="'+j+'"]');if(next)next.focus();}
 if(ev.key==='Escape'&&N.ui._drag){N.ui.cancelDrag();}
 });return group;
}
function draw(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};var d=dims(),p=s.p,W=d.W;
 var svg=S.root(W,d.H,'Neon travel timetable showing '+p.places.join(', ')+'. Three service columns A, B, C have 24-hour arrival times. '+(s.service==null?'No service selected.':'Selected service '+p.names[s.service]+'.'));
 svg.classList.add('f1804-drawing');
 var back=E('g',{'aria-hidden':'true',style:'pointer-events:none'},svg);
 line(back,18,62,W-18,62,'support',2.6);
 N.neonRing(back,39,62,{role:'op',r:6,pulse:false});N.neonRing(back,W-39,62,{role:'op',r:6,pulse:false});
 label(svg,W/2,39,p.short,'op',26);
 label(svg,W/2,84,'Read the stops down one column','given',d.W===400?19:21);
 // One glass header, one stop rail, and luminous time cells; exact values derive from minute-of-day integers.
 N.neonBox(svg,d.x,headerY(d)-25,d.stopW+3*d.colW,54,{role:'support',r:13});
 label(svg,d.x+11,headerY(d)+7,'STOP','given',d.W===400?21:20,'start');
 for(var c=0;c<3;c++)label(svg,centre(d,c),headerY(d)+7,p.names[c],s.service===c?'result':'op',23);
 for(var r=0;r<4;r++){
  var ry=d.rowsY+r*d.rowH,stop=E('g',{'style':'pointer-events:none'},svg);
  N.neonBox(stop,d.x,ry,d.stopW-5,d.rowH-5,{role:'given',r:9});
  label(stop,d.x+11,ry+d.rowH*.57,p.places[r],'given',d.W===400?21:20,'start');
  for(var col=0;col<3;col++){var box=itemBox(d,col,r),t=p.trips[col][r],active=s.service===col,near=(r===(s.from==null?p.from:s.from)||r===(s.to==null?p.to:s.to)),role=(active&&near)?'result':active?'op':t==null?'support':'given';
   N.neonBox(svg,box.x,box.y,box.w,box.h,{role:role,r:10});
   label(svg,box.x+box.w/2,box.y+box.h*.57,hhmm(t),role,d.W===400?21:21);
   if(t!=null&&t>=1440){label(svg,box.x+box.w/2,box.y+box.h-5,'+1',role,18);}
  }
 }
 // Itinerary trace follows the active service (except transfer where distinct services form two stages).
 if(s.service!=null){var x=centre(d,s.service),y0=d.rowsY+d.rowH*.5,y1=d.rowsY+3*d.rowH+d.rowH*.5;
  var valid=p.trips[s.service].map(function(t,j){return t!=null?j:-1;}).filter(function(j){return j>=0;});
  if(valid.length>1){var ya=d.rowsY+valid[0]*d.rowH+d.rowH*.5,yb=d.rowsY+valid[valid.length-1]*d.rowH+d.rowH*.5;
   line(svg,x-23,ya,x-23,yb,'result',3.5);N.neonRing(svg,x-23,ya,{role:'result',r:5,pulse:false});N.neonRing(svg,x-23,yb,{role:'result',r:5,pulse:false});}}
 var slot=E('g',{'aria-hidden':'true','style':'pointer-events:none'},svg);
 N.neonBox(slot,W*.5-76,d.slotY-33,152,66,{role:'unknown',r:16});
 if(s.service==null)label(slot,W*.5,d.slotY+7,'Drop service','unknown',21);
 label(svg,20,d.slotY+8,'CHOOSE','given',d.W===400?16:18,'start');
 // Token tray: keyboard and pointer alternatives share one state and validation.
 for(var k=0;k<3;k++)drawToken(svg,d,s,k,o);
 stage.appendChild(svg);return svg;
}
function displayDuration(s){var p=s.p,v=s.service,from=s.from==null?p.from:s.from,to=s.to==null?p.to:s.to;if(v==null)return null;if(p===CONFIG.presets.rail){return s.service===1?span(p.trips[0][1],p.trips[1][2]):s.service===2?span(p.trips[0][1],p.trips[2][2]):null;}
 return span(p.trips[v][from],p.trips[v][to]);}
function side(layout,s,o){var p=s.p,from=s.from==null?p.from:s.from,to=s.to==null?p.to:s.to,c=h('div',{class:'f1804-side'}),chosen=s.service==null?'None':p.names[s.service],duration=displayDuration(s),cards=[['ROUTE',p.places[from]+' → '+p.places[to],'given'],['SERVICE',chosen,'op'],['READING',p===CONFIG.presets.rail?'Connect at junction':p.theme,'unknown'],['RESULT',o.hideAnswers?'Find from the timetable':duration==null?'Select a service':duration+' min','result']];
 cards.forEach(function(v){var item=h('div',{class:'f1804-sidecard'},[h('span',{class:'f1804-side-label',text:v[0]}),h('span',{class:'f1804-side-value f1804-'+v[2],text:v[1]})]);c.appendChild(item);});
 if(!o.hideAnswers){c.appendChild(h('div',{class:'f1804-note',text:p===CONFIG.presets.rail?'The first train reaches the junction at 09:32. Train '+chosen+' must leave after that arrival.':s.service==null?'Select a service and read its timetable column.':'Subtract the starting time from the finishing time. Use 60 minutes per hour.'}));}
 layout.appendChild(c);
}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Timetable reader',o.tag||'ROUTE · DEPART · ARRIVE');var layout=h('div',{class:'f1804-layout'}),plot=h('div',{class:'f1804-plot'});stage.appendChild(layout);layout.appendChild(plot);var svg=draw(plot,s,o);side(layout,s,o);N.scene.helperStrip(stage,o.pose||'explain',o.say||s.p.hint);return svg;}
var steps=[
 {name:'Read the route',pose:'explain',narration:'A timetable has stops in rows and journeys in columns. Start by finding the departure stop.',prompt:'Which column stays with the same bus?',say:'Each column is one vehicle and one journey. You cannot mix its times with another bus.'},
 {name:'Choose the service',pose:'point-down',narration:'Service A leaves Maple Park at eight fifteen. Keep your finger on service A as you read down.',prompt:'Why is it wrong to jump from the A column to the B column?',say:'The service letter is your guide. Stay in the same column all the way to the destination.'},
 {name:'Locate departure',pose:'point-right',narration:'At Maple Park, service A departs at eight fifteen. Write the start time.',prompt:'What is the starting time for service A?',say:'Use the top stop row. Eight fifteen is the departure time, not the duration.'},
 {name:'Locate arrival',pose:'count',narration:'The same service reaches the Leisure Centre at eight fifty-eight. Keep the start and finish in the same column.',prompt:'Where is the arrival time in the A column?',say:'Follow the luminous journey trace down to Leisure Centre: eight fifty-eight.'},
 {name:'Calculate duration',pose:'think',narration:'Subtract eight fifteen from eight fifty-eight. The difference is forty-three minutes.',prompt:'How many minutes pass from fifteen minutes past eight to fifty-eight minutes past eight?',say:'These times are in the same hour, so subtract the minutes: fifty-eight minus fifteen.'},
 {name:'Check the journey',pose:'celebrate',narration:'Forty-three minutes is the journey time. The answer is a duration, so it needs the unit minutes.',prompt:'Why must we put minutes after forty-three?',say:'Arrival time is a clock reading. Journey time is a duration: forty-three minutes.'}
];
function watchRender(i,stage){var p=CONFIG.presets.bus,s={p:p,service:i>=1?0:null},svg=scene(stage,s,{title:'Watch the timetable',tag:'STEP '+(i+1)+' / '+steps.length,pose:steps[i].pose,say:steps[i].say,hideAnswers:i<5,drag:false});var d=dims();if(i===1)M.flash(svg,centre(d,0),headerY(d),'op',22);if(i===2||i===3)M.flash(svg,centre(d,0),d.rowsY+(i===2?.5:3.5)*d.rowH,'given',24);if(i===4||i===5){M.flash(svg,centre(d,0),d.rowsY+3.5*d.rowH,'result',28);if(i===5){var cells=svg.querySelectorAll('.nv-neon-box');if(cells.length)M.pop(cells[cells.length-1],d.W/2,d.H-90);}}}
function parseDuration(value){var m=String(value||'').trim().match(/^(\d{1,3})\s*(min|mins|minutes)$/i);return m?+m[1]:null;}
function parseTime(value){var m=String(value||'').trim().match(/^(\d{1,2}):(\d{2})$/);if(!m||+m[1]>23||+m[2]>59)return null;return (+m[1])*60+(+m[2]);}
var tasks=[
 {preset:'bus',q:'Service A: how long from Maple Park to Leisure Centre? Give minutes.',service:0,unit:'min',expected:43,kind:'duration',hint:'Read 08:15 at Maple Park and 08:58 at Leisure Centre in column A.'},
 {preset:'school',q:'Choose the latest bus that reaches school by 08:30. Enter its Hill Road departure time (HH:MM).',service:1,unit:'time',expected:475,kind:'deadline',hint:'Compare the school arrival row: A at 08:00, B at 08:30 and C at 09:00.'},
 {preset:'rail',q:'Train A reaches Junction at 09:32. Choose the earliest onward train and enter the wait in minutes.',service:1,unit:'min',expected:8,kind:'connection',hint:'One onward train departs at 09:40; another at 10:00. Compare them with 09:32.'},
 {preset:'night',q:'Service B leaves Harbour at 23:35 and arrives Terminal next day at 00:33. How long is the journey? Give minutes.',service:1,unit:'min',expected:58,kind:'overnight',hint:'Continue past 24:00: 23:35 → 24:00 takes 25 minutes and 00:00 → 00:33 takes 33.'},
 {preset:'midday',q:'Service A: how long from Park to Sports, across noon? Give minutes.',service:0,unit:'min',expected:47,kind:'duration',hint:'Find 11:55 and 12:42. Five minutes to noon, then forty-two more.'},
 {preset:'bus',from:0,to:2,q:'Choose service C. How long from Maple Park to Station? Give minutes.',service:2,unit:'min',expected:27,kind:'duration',hint:'Use 09:15 and 09:42 in column C. Stay in that column.'}
];
function judge(t,value,selected){var v=t.unit==='min'?parseDuration(value):parseTime(value);if(v==null)return [false,t.unit==='min'?'Include the duration unit, for example 43 min.':'Write the departure as a 24-hour time, for example 07:55.'];
 if(selected!==t.service)return [false,'The chosen service is not correct for this question. Choose the service in the timetable before checking.'];
 if(v===t.expected)return [true,'Correct. Your selected service, reading and '+(t.unit==='min'?'minute unit':'24-hour time')+' all match the timetable.'];
 if(t.kind==='overnight'&&(v===-1382||v===1382||v===62))return [false,'The journey crosses midnight. Carry into the next day before subtracting; there are 60 minutes in an hour.'];
 if(t.kind==='connection'&&v===28)return [false,'You picked the later onward train. Train B is the earliest connection after arrival.'];
 if(t.kind==='deadline'&&v===445)return [false,'That earlier bus arrives on time, but the question asks for the LATEST suitable bus.'];
 if(t.kind==='deadline'&&v===505)return [false,'Service C is later, but reaches school at 09:00, beyond the 08:30 deadline.'];
 if(t.unit==='min'&&v===t.expected+60)return [false,'Check the hour change. There are 60 minutes in each hour; do not add an extra full hour.'];
 if(t.unit==='min'&&v===Math.abs(t.expected-60))return [false,'Your subtraction has lost or borrowed an hour incorrectly. Use a timeline or count forward.'];
 if(t.unit==='min'&&v>=1000)return [false,'Clock times are not ordinary decimal numbers. Convert the difference into minutes rather than subtracting HHMM as a whole number.'];
 return [false,'Recheck the departure and arrival in the SAME service column, then count the elapsed minutes. '+(t.kind==='connection'?'Use the interchange arrival and next departure.':'')];}
var def={id:ID,title:'Timetable reader',config:CONFIG,steps:steps,render:watchRender,alt:'NOVA neon glass timetable with journey tracing, 24-hour readings and draggable service tokens.',staticAlt:'Follow one service down a bus timetable. 08:15 to 08:58 is 43 minutes.',
 exploreIntro:'Select a timetable and drag a service into the highlighted dock. Trace the same service column from departure to arrival. Press Enter on a service tile for keyboard selection.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var chosen=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("chosen",()=>(CONFIG.preset)):(CONFIG.preset)),s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",()=>({p:key(chosen),service:null})):({p:key(chosen),service:null})),pick=h('select',{class:'nova-input','aria-label':'Timetable learning preset'}),readout=h('div',{class:'f1804-status','aria-live':'polite'});window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){pick.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();pick.value=chosen;
 window.NovaLessonComponent?.applyExploreModels();function render(focus){var v=displayDuration(s),t=s.service==null?'Pick a service, then find its times.':'Service '+s.p.names[s.service]+(v==null?': this service alone does not cover the whole journey.':': '+v+' minutes for the marked route.');scene(stage,s,{title:'Explore the timetable',tag:'DRAG · SNAP · REGRAB',pose:s.service==null?'point-down':v!=null?'count':'think',say:s.service==null?'Look along the column headers to choose a departure.':s.p===CONFIG.presets.rail?'At this junction, one train comes in and another carries the journey onward.':'Read down the selected column. Keep departures and arrivals together.',drag:true,refresh:render});readout.textContent=s.p.context+'  '+t;if(focus!=null){var el=stage.querySelector('[data-service="'+focus+'"]');if(el)el.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();pick.onchange=function(){chosen=pick.value;CONFIG.preset=chosen;s={p:key(chosen),service:null};fire('preset',chosen);render();};
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Journey preset ',pick]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[h('button',{class:'nova-btn',text:'Clear service',onclick:function(){s.service=null;fire('service',null);render();}}),h('button',{class:'nova-btn',text:'Choose A',onclick:function(){setService(s,0);render();}}),h('button',{class:'nova-btn',text:'Choose B',onclick:function(){setService(s,1);render();}}),h('button',{class:'nova-btn',text:'Choose C',onclick:function(){setService(s,2);render();}})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(readout);window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={state:function(){return {preset:chosen,selected:s.service,duration:displayDuration(s)};},select:function(k){pick.value=k;pick.onchange();},place:function(n){setService(s,n);render();},clear:function(){s.service=null;render();}};
 },
 challenge:function(panel,api,stage){var j=0,t=tasks[j],s={p:key(t.preset),service:null},q=h('p',{class:'pr-task'}),input=h('input',{class:'nova-input',type:'text',placeholder:'value with unit, or HH:MM','aria-label':'Your answer with required unit'}),feedback=h('div',{class:'f1804-status','aria-live':'polite'});
 function render(focus){scene(stage,s,{title:'Timetable challenge '+(j+1)+' / '+tasks.length,tag:'SELECT SERVICE · READ · CHECK',hideAnswers:true,drag:true,refresh:render,pose:'read-tablet',say:'Choose the correct journey column, then calculate from the timetable. Answers are not shown here.'});if(focus!=null){var el=stage.querySelector('[data-service="'+focus+'"]');if(el)el.focus({preventScroll:true});}}
 function load(){t=tasks[j];s={p:key(t.preset),service:null,from:t.from,to:t.to};q.textContent=(j+1)+' / '+tasks.length+' · '+t.q;input.value='';feedback.textContent='';render();}
 var bar=h('div',{class:'pr-row'},[h('button',{class:'nova-btn primary',text:'Check timetable',onclick:function(){var out=judge(t,input.value,s.service);feedback.textContent=out[1];fire('answer',input.value);api.check(out[0],out[1],{task:j,preset:t.preset});if(out[0]&&j<tasks.length-1){var timer=setTimeout(function(){j++;load();},1000);api.onCleanup(function(){clearTimeout(timer);});}}}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(t.hint);}}),h('button',{class:'nova-btn',text:'Start again',onclick:function(){j=0;load();}})]);
 panel.appendChild(q);panel.appendChild(h('label',{class:'pr-row'},['Your answer ',input]));panel.appendChild(bar);panel.appendChild(feedback);load();
 CONFIG._challenge={tasks:tasks,state:function(){return {task:j,preset:t.preset,service:s.service,entry:input.value};},select:function(i){setService(s,i);render();},solve:function(){setService(s,t.service);input.value=t.unit==='min'?t.expected+' min':hhmm(t.expected);render();},check:function(value,service){return judge(t,value,service==null?s.service:service);},next:function(){j=Math.min(j+1,tasks.length-1);load();},task:function(i){j=Math.max(0,Math.min(i,tasks.length-1));load();}};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"steps":()=>steps,"tasks":()=>tasks},draws:{"draw":["stage","s","o"],"scene":["stage","s","o"]},exploreFields:{"chosen":{"kind":"value","factory":null,"argCount":null},"s":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F18·04',title:'Timetable reader',def:def,years:'KS3 Year 7 time, clocks and timetables; later journey planning extension.',linked:['F0-02','F0-03','F0-04','F18-02','F18-03'],spec:{purpose:'Interpret real 24-hour journey timetables, follow one service, calculate elapsed time and make arrival-deadline or connection decisions.',params:'Four labelled stops, three service columns, exact minute-of-day time values, chosen route, chosen service and destination.',presets:'City buses, school arrival by a deadline, rail connection, midnight crossing and midday 24-hour service.',steps:'Identify stop rows → choose column → read departure → read arrival → calculate elapsed time → check minutes.',interactions:'WATCH narrated teaching sequence; GUIDED step-by-step prompts; EXPLORE pointer/keyboard service selection with snap and removal; CHALLENGE six unit- and journey-checked tasks.',traps:'Switching service columns, HHMM subtraction, neglecting 60 minutes per hour, crossing midnight, selecting an earlier rather than latest eligible bus, an invalid connection, or dropping the duration unit.',gcse:'Connections, midnight crossing and route planning with multiple services.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5000);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

