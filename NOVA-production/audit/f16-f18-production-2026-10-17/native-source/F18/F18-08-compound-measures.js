
/* NOVA F18-08 · Compound measures. Built on original NOVA shared core, unchanged. */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-08';
var C=window.NovaV2Integration.configuration(window.NOVA_F18_08_CONFIG={preset:'speed',startMode:'watch',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','variable','operand','operandRemoved','reset','answer'],presets:{
 speed:{label:'Speed · distance and time',topic:'speed',top:'Distance',left:'Speed',right:'Time',syms:['D','S','T'],values:[150,60,2.5],units:['km','km h⁻¹','h'],target:1,description:'A train travels 150 kilometres in 2.5 hours. Speed is distance divided by time.',hint:'Start with distance travelled, then divide by the time in hours.'},
 density:{label:'Density · mass and volume',topic:'density',top:'Mass',left:'Density',right:'Volume',syms:['m','ρ','V'],values:[540,2.7,200],units:['g','g cm⁻³','cm³'],target:1,description:'A metal piece has mass 540 grams and volume 200 cubic centimetres. Density is mass per unit volume.',hint:'Divide the mass by the volume, using matching units.'},
 conversion:{label:'Convert rates · km/h to m/s',topic:'conversion',top:'Speed in km/h',left:'Speed in m/s',right:'Conversion factor',syms:['km/h','m/s','k'],values:[90,25,3.6],units:['km h⁻¹','m s⁻¹',''],target:1,description:'Convert 90 kilometres per hour to metres per second. The factor is 3.6 because 1 kilometre is 1000 metres and 1 hour is 3600 seconds.',hint:'To change km/h to m/s, divide the number by 3.6.'},
 multistep:{label:'Two-step speed · minutes to hours',topic:'speed',top:'Distance',left:'Speed',right:'Time',syms:['D','S','T'],values:[36,48,0.75],clockMinutes:45,units:['km','km h⁻¹','h'],target:1,description:'A cyclist covers 36 kilometres in 45 minutes. Convert 45 minutes to 0.75 hours before dividing.',hint:'Convert minutes into hours first; 45 minutes is 0.75 hours.'},
 mass:{label:'Find mass · density × volume',topic:'density',top:'Mass',left:'Density',right:'Volume',syms:['m','ρ','V'],values:[20,800,0.025],units:['kg','kg m⁻³','m³'],target:0,description:'A liquid occupies 0.025 cubic metres and has density 800 kilograms per cubic metre. Multiply density by volume to obtain its mass.',hint:'When finding the top quantity, multiply the two bottom quantities.'},
 pressure:{label:'Pressure · force and area',topic:'pressure',top:'Force',left:'Pressure',right:'Area',syms:['F','P','A'],values:[250,500,0.5],units:['N','Pa','m²'],target:1,description:'A force of 250 newtons acts over an area of 0.5 square metres. Pressure is force divided by area.',hint:'Pressure in pascals equals newtons divided by square metres.'}
 }});
function fmt(n){return Number(n.toPrecision(7)).toString();}
function display(v,u){return fmt(v)+(u?' '+u:'');}
function labelValue(s,i){return s.key==='multistep'&&i===2?(s.p.clockMinutes+' min'):display(s.p.values[i],s.p.units[i]);}
function datum(k){return C.presets[k]||C.presets.speed;}
function state(k,target){var p=datum(k);return {key:k,p:p,target:target===undefined?p.target:target,slots:[null,null],notice:''};}
function pair(s){return s.target===0?[1,2]:s.target===1?[0,2]:[0,1];}
function operation(s){return s.target===0?'×':'÷';}
function answer(s){var p=s.p,t=s.target,ab=pair(s);return t===0?p.values[1]*p.values[2]:p.values[0]/p.values[t===1?2:1];}
function emit(key,value){N.events.emit('value',{engine:ID,key:key,value:value});}
function nb(parent,x,y,w,hh,role,r){return N.neonBox(parent,x,y,w,hh,{role:role||'given',r:r||11});}
function nl(parent,x1,y1,x2,y2,role,width){return N.neonLine(parent,x1,y1,x2,y2,{role:role||'support',width:width||2.5});}
function nt(parent,x,y,text,role,size){return N.chalkText(parent,x,y,String(text),{role:role||'given',size:size||20,anchor:'middle'});}
function card(parent,label,value,role){var x=h('div',{class:'f1808-card'});if(role)x.setAttribute('data-'+role,'');x.append(h('small',{text:label}),h('strong',{text:value}));parent.appendChild(x);}
function zoneGeometry(slot){return {x:slot===0?56:247,y:447,w:138,h:72};}
function dropChip(svg,el,s,role,bounds,placed,opts){var slot=placed? s.slots.indexOf(role):-1;
 function zones(){if(placed){return [{x:36,y:620,w:368,h:64,id:'remove',kind:'remove'}];}return [0,1].filter(function(i){return s.slots[i]===null;}).map(function(i){var b=zoneGeometry(i);return {x:b.x,y:b.y,w:b.w,h:b.h,id:'s'+i,kind:'drop'};});}
 N.ui.svgDrag(svg,el,{box:bounds,zones:zones,removeTo:{x:bounds.x+bounds.w/2,y:bounds.y+bounds.h/2},onDrop:function(id){if(placed)return false;var index=+(id||'').slice(1);if((id==='s0'||id==='s1')&&s.slots[index]===null){s.slots[index]=role;emit('operand',{role:role,slot:index});opts.refresh();return true;}return false;},onRemove:function(){if(placed){s.slots[slot]=null;emit('operandRemoved',role);opts.refresh();}}});
 // Preserve capture across the shared core drag lift/reparent step.
 el.addEventListener('pointerdown',function(e){if(N.ui._drag&&N.ui._drag.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});
 el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();if(placed){s.slots[slot]=null;emit('operandRemoved',role);}else{var i=s.slots.findIndex(function(v){return v===null;});if(i>=0){s.slots[i]=role;emit('operand',{role:role,slot:i});}}opts.refresh();}
 else if(placed&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();s.slots[slot]=null;emit('operandRemoved',role);opts.refresh();}
 else if(e.key.startsWith('Arrow')){e.preventDefault();var a=[].slice.call(svg.querySelectorAll('.f1808-chip'));var ix=a.indexOf(el),delta=(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:1;var next=a[(ix+delta+a.length)%a.length];if(next)next.focus();}});
}
function triangle(svg,s,opts){var p=s.p,t=s.target,abbr=p.syms,found=opts.revealAnswer===true,unknown=!!opts.hideAnswers;
 nt(svg,220,31,'Which quantity is missing?','focus',22);
 nl(svg,35,48,405,48,'focus',3.3);
 nt(svg,220,78,p.topic==='pressure'?'Force, pressure and contact area':p.topic==='density'?'Mass, density and volume':p.topic==='conversion'?'Speed unit conversion':'Distance, speed and time','given',19);
 // Precision frame is a neon polygon drawn entirely by the canonical core helpers.
 N.neonPath(svg,'M 220 105 L 62 352 L 378 352 Z',{role:'focus',width:4,fill:'rgba(23,94,147,.16)'});
 nl(svg,115,269,325,269,'support',3);nl(svg,220,269,220,352,'support',3);
 [{x:220,y:186},{x:157,y:309},{x:285,y:309}].forEach(function(pt,i){nb(svg,pt.x-(i===0?68:59),pt.y-39,i===0?136:118,71,i===t?'unknown':(i===0?'focus':'given'),13);
  nt(svg,pt.x,pt.y-10,abbr[i],i===t?'unknown':'focus',25);
  nt(svg,pt.x,pt.y+18,(i===t&&!found)?'?':labelValue(s,i),i===t?(unknown?'unknown':'result'):'given',i===0?15:15);
 });
 nt(svg,220,394, t===0?'Top quantity = bottom × bottom':'Bottom quantity = top ÷ other bottom','op',20);
 if(opts.interactive){
  nt(svg,220,430,'Build the calculation','given',20);
  for(var i=0;i<2;i++){var pos=zoneGeometry(i),active=s.slots[i];nb(svg,pos.x,pos.y,pos.w,pos.h,active===null?'support':'result',13);nt(svg,pos.x+pos.w/2,pos.y+20,i===0?'First value':'Second value','support',15);
   if(active!==null){var gg=E('g',{class:'f1808-chip','data-role':active,'data-placed':i,tabindex:'0',role:'button','aria-label':'Placed '+p.top+' formula operand. Press Delete to remove.'},svg);nb(gg,pos.x+7,pos.y+26,pos.w-14,38,'result',10);nt(gg,pos.x+pos.w/2,pos.y+51,labelValue(s,active),'result',16);dropChip(svg,gg,s,active,{x:pos.x+7,y:pos.y+26,w:pos.w-14,h:38},true,opts);}
   else nt(svg,pos.x+pos.w/2,pos.y+53,'Drop value','unknown',17);
  }
  nt(svg,220,495,operation(s),'op',27);nt(svg,220,538,'Choose the given values from the tray','given',18);
  var roles=pair(s);roles.forEach(function(role,i){if(s.slots.indexOf(role)>=0)return;var x=i===0?130:310,yy=576,chip=E('g',{class:'f1808-chip','data-role':role,'data-source':role,tabindex:'0',role:'button','aria-label':'Drag '+p.syms[role]+' to a formula slot or press Enter'},svg);
   nb(chip,x-78,yy-25,156,54,'op',12);nt(chip,x,yy-3,abbr[role]+' = '+(s.key==='multistep'&&role===2?s.p.clockMinutes+' min':fmt(p.values[role])),'op',19);nt(chip,x,yy+16,(s.key==='multistep'&&role===2?'convert to h':p.units[role]||'factor'),'given',15);
   dropChip(svg,chip,s,role,{x:x-78,y:yy-25,w:156,h:54},false,opts);
  });
  nl(svg,38,620,402,620,'error',2.3);nt(svg,220,646,'Return zone · drag back to remove','error',18);nt(svg,220,681,'Keyboard: Enter to place · Delete to remove','support',17);
 }else{
  nt(svg,220,455,'The two known values determine the missing one.','given',19);
  if(opts.step>=2){nb(svg,66,488,308,67,'op',14);nt(svg,220,513,labelValue(s,pair(s)[0]),'op',19);nt(svg,220,540,operation(s)+'  '+labelValue(s,pair(s)[1]),'op',19);}
  if(opts.step>=4){nb(svg,66,566,308,60,'result',13);nt(svg,220,602,'Answer  '+display(answer(s),p.units[s.target]),'result',22);}
  else{nt(svg,220,607,'Explain which operation matches the triangle.','support',17);}
 }
}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Compound measures',o.tag||'BUILD · CHECK · REASON');
 var layout=h('div',{class:'f1808-layout'}),main=h('div',{class:'f1808-main'}),aside=h('div',{class:'f1808-side'});layout.append(main,aside);stage.appendChild(layout);
 var svg=S.root(440,o.interactive?700:650,'Premium neon relationship triangle showing two known quantities and the missing compound measure, plus draggable operand chips.');svg.classList.add('f1808-svg');main.appendChild(svg);
 triangle(svg,s,o);var p=s.p,hide=!!o.hideAnswers;
 card(aside,'KNOWN ONE',labelValue(s,pair(s)[0]),'given');card(aside,'KNOWN TWO',labelValue(s,pair(s)[1]),'given');
 card(aside,'CALCULATION',''+operation(s)+'  '+(s.target===0?'multiply the bottom pair':'top ÷ known bottom'),'method');
 card(aside,'FIND '+(s.target===0?p.top:s.target===1?p.left:p.right),hide?'Work it out':display(answer(s),p.units[s.target]),'answer');
 aside.appendChild(h('p',{class:'f1808-explain',text:hide?'The formula tells you how the given quantities connect. Work out the missing value and include its units.':p.description}));
 if(o.interactive)aside.appendChild(h('p',{class:'f1808-progress',text:s.slots.filter(function(x){return x!==null;}).length+'/2 known values placed. '+(s.slots[0]!==null&&s.slots[1]!==null?'Now compare their order with the formula.':'Drag the glowing tokens into the calculation slots.')}));
 N.scene.helperStrip(stage,o.pose||'explain',o.say||'First name the quantity you need. Then choose the matching formula.');return svg;
}
var steps=[
 {name:'Name the three quantities',pose:'explain',narration:'Distance is how far something travels. Speed tells us how far it travels in each hour. Time tells us how long the journey takes.',prompt:'Which quantity measures how far something goes?',say:'Distance, speed and time are connected; the triangle makes their relationship visible.'},
 {name:'Find what is missing',pose:'point-down',narration:'We know a train travels one hundred and fifty kilometres in two and a half hours. We want the speed in kilometres per hour.',prompt:'Which two values are already known?',say:'The distance is one hundred and fifty kilometres. The time is two and a half hours.'},
 {name:'Reveal the calculation',pose:'count',narration:'To find speed, use distance divided by time. The units become kilometres per hour.',prompt:'Why do we divide instead of multiply?',say:'Divide distance by time to find the distance travelled in each hour.'},
 {name:'Check the unit',pose:'compare',narration:'We divide one hundred and fifty kilometres by two and a half hours. The distance per hour is our answer unit.',prompt:'What unit must speed have?',say:'Check the unit: kilometres per hour. Units tell us what the calculation means.'},
 {name:'Count up to the result',pose:'think',narration:'One hundred and fifty divided by two and a half is sixty. The speed is sixty kilometres per hour.',prompt:'Can you check by working backwards?',say:'Sixty kilometres each hour for two and a half hours gives one hundred and fifty kilometres.'},
 {name:'Generalise and transfer',pose:'celebrate',narration:'To find the top quantity, multiply the two bottom quantities. To find either bottom quantity, divide the top by the other bottom.',prompt:'How would you find mass from density and volume?',say:'The same structure works for density and pressure. Keep your units consistent.'}
];
function watch(i,stage){var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.s",(...a)=>state(...a),['speed']):(state('speed')));var o={title:'Watch the formula come alive',tag:'STEP '+(i+1)+' / '+steps.length,pose:steps[i].pose,say:steps[i].say,step:i,revealAnswer:i>=4,hideAnswers:i<4};var svg=scene(stage,s,o);if(i>=1){M.flash(svg,220,i>=4?589:i>=2?493:285,i>=4?'result':'focus',24);}if(i===4){var out=stage.querySelector('.f1808-card[data-answer] strong');if(out)M.tween(720,function(v){out.textContent=display(Math.round(60*v*100)/100,'km h⁻¹');},M.ease.out);}if(i===5){N.neonRing(svg,367,573,{role:'result',r:8});var chip=N.answerChip('60 km/h · correct',true);chip.classList.add('f1808-pop');stage.querySelector('.f1808-side').appendChild(chip);}}
function parseAnswer(raw,unit){var str=String(raw==null?'':raw).trim().replace(/,/g,'');var m=str.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))\s*(.*)$/);if(!m)return {ok:false,msg:'Enter a number followed by its unit.'};var n=Number(m[1]);if(!Number.isFinite(n))return {ok:false,msg:'Enter a finite number.'};var u=m[2].trim().toLowerCase().replace(/\s+/g,'').replace(/\^3/g,'³').replace(/\^2/g,'²').replace(/\u2212/g,'-');var aliases={
 'km h⁻¹':['km/h','kmh-1','kmh⁻¹','kmperhour','kph'],
 'g cm⁻³':['g/cm³','gcm-3','gcm⁻³','g/cm3','gpercm3'],
 'm s⁻¹':['m/s','ms-1','ms⁻¹','mpersecond'],
 'kg m⁻³':['kg/m³','kgm-3','kgm⁻³','kg/m3'],
 'cm³':['cm³','cm3'], 'm³':['m³','m3'],'h':['h','hr','hrs','hour','hours'],
 'km':['km','kilometre','kilometres'],'kg':['kg','kilogram','kilograms'], 'Pa':['pa','pascal','pascals'], 'g':['g','gram','grams'],'N':['n','newton','newtons'],'m²':['m²','m2']};
 var wanted=unit||'',valid=(aliases[wanted]||[wanted.toLowerCase()]).map(function(x){return x.toLowerCase().replace(/\s+/g,'')});if(!u||!valid.includes(u))return {ok:false,msg:'Include the correct compound unit: '+(wanted||'the factor')+'. For example, km/h or m/s are accepted.'};return {ok:true,value:n};}
var tasks=[
 {key:'speed',values:[180,60,3],target:1,q:'A coach travels 180 km in 3 h. Calculate its speed.',hint:'Distance divided by time.'},
 {key:'density',values:[315,2.1,150],target:1,q:'A sample has mass 315 g and volume 150 cm³. Find its density.',hint:'Divide mass by volume.'},
 {key:'conversion',values:[72,20,3.6],target:1,q:'Convert 72 km/h into m/s using the factor 3.6.',hint:'Divide kilometres per hour by 3.6.'},
 {key:'multistep',values:[84,72,70/60],target:1,q:'A vehicle travels 84 km in 70 minutes. Calculate its average speed in km/h.',hint:'Convert 70 minutes to hours before calculating distance ÷ time.'},
 {key:'mass',values:[20,800,0.025],target:0,q:'A material has density 800 kg/m³ and volume 0.025 m³. Find its mass.',hint:'Multiply density by volume.'},
 {key:'pressure',values:[250,500,0.5],target:1,q:'250 newtons act over 0.5 m². Calculate the pressure in pascals.',hint:'Pressure is force divided by area.'}
];
function taskState(i){var t=tasks[i],p=Object.assign({},datum(t.key),{values:t.values.slice(),clockMinutes:t.key==='multistep'?70:undefined});var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("taskState.s",(...a)=>state(...a),[t.key,t.target]):(state(t.key,t.target)));s.p=p;return s;}
function diagnose(s,raw){var p=s.p,v=parseAnswer(raw,p.units[s.target]);if(!v.ok)return [false,v.msg];var expected=answer(s),eps=1e-6;if(Math.abs(v.value-expected)>eps*Math.max(1,Math.abs(expected))){var a=pair(s),x=p.values[a[0]],y=p.values[a[1]];if(Math.abs(v.value-(x*y))<eps*Math.max(1,Math.abs(x*y))&&s.target!==0)return [false,'You multiplied, but this bottom quantity needs the top divided by the other bottom value.'];if(s.target!==0&&Math.abs(v.value-(y/x))<eps*Math.max(1,Math.abs(y/x)))return [false,'The order is reversed: start with the value at the TOP of the triangle.'];if(s.key==='multistep'&&Math.abs(v.value-(p.values[0]/70))<.000001)return [false,'You treated 70 minutes as 70 hours. Convert minutes to hours first.'];if(s.key==='conversion'&&Math.abs(v.value-(p.values[0]*3.6))<.000001)return [false,'That goes in the opposite direction. To convert km/h to m/s, divide by 3.6.'];return [false,'Recheck the multiplication or division, the given values and their units.'];}
 if(s.slots[0]===null||s.slots[1]===null)return [false,'Your numerical answer is correct. Place both known values into the calculation slots as well.'];var roles=pair(s);
 if(s.target!==0&&(s.slots[0]!==roles[0]||s.slots[1]!==roles[1]))return [false,'Your numerical answer is correct, but the formula order is reversed. The TOP quantity comes first when dividing.'];
 if(s.target===0&&!roles.every(function(r){return s.slots.indexOf(r)>=0;}))return [false,'Place the two correct known values. Both bottom values are multiplied.'];
 return [true,'Correct: the mathematical relationship, units and value all agree.'];}
function choice(parent,label,input){parent.appendChild(h('label',{class:'f1808-control'},[label,input]));}
var def={id:ID,title:'Compound measures',config:C,steps:steps,render:watch,alt:'Interactive neon compound-measures triangle with distance speed and time, density mass and volume, or pressure force and area.',staticAlt:'To find the top quantity, multiply the bottom two. To find a bottom quantity, divide the top by the other bottom. Use consistent units.',exploreIntro:'Drag the two known values into the formula slots, or press Enter on them; reverse a division and watch how the relationship changes.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",(...a)=>state(...a),[C.preset]):(state(C.preset)));window.NovaLessonComponent?.applyExploreModels();var preset=h('select',{class:'nova-input','aria-label':'Compound measure example'});window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){preset.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();preset.value=s.key;
 window.NovaLessonComponent?.applyExploreModels();var variable=h('select',{class:'nova-input','aria-label':'Unknown quantity'}),help=h('p',{class:'f1808-status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();function fillVariable(){variable.innerHTML='';[0,1,2].forEach(function(i){variable.appendChild(h('option',{value:i,text:'Find '+[s.p.top,s.p.left,s.p.right][i]}));});variable.value=s.target;}
 window.NovaLessonComponent?.applyExploreModels();function redraw(){scene(stage,s,{title:'Investigate compound measures',tag:'DRAG · REARRANGE · EXPLAIN',interactive:true,refresh:redraw,pose:'point-down',say:'Place the two known values in the formula slots. For division, the top quantity must go first.'});var roles=pair(s);help.textContent=s.slots.every(function(v){return v!==null;})?'Ready to calculate: '+(s.target===0?'multiply the bottom values':'divide the top by the other bottom value')+'.':'Put both glowing values into the formula channel to build the calculation.';}
 window.NovaLessonComponent?.applyExploreModels();choice(panel,'Teaching example ',preset);window.NovaLessonComponent?.applyExploreModels();choice(panel,'Unknown ',variable);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('button',{class:'nova-btn',text:'Clear formula slots',onclick:function(){s.slots=[null,null];emit('reset','slots');redraw();}}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(help);
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=function(){s=state(preset.value);C.preset=s.key;fillVariable();emit('preset',s.key);redraw();};window.NovaLessonComponent?.applyExploreModels();variable.onchange=function(){s.target=+variable.value;s.slots=[null,null];emit('variable',s.target);redraw();};window.NovaLessonComponent?.applyExploreModels();fillVariable();window.NovaLessonComponent?.applyExploreModels();redraw();
 window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){return {preset:s.key,target:s.target,slots:s.slots.slice(),expected:answer(s),pair:pair(s)};},select:function(k){preset.value=k;preset.onchange();},target:function(t){variable.value=t;variable.onchange();},place:function(role,slot){s.slots[slot]=role;redraw();},clear:function(){s.slots=[null,null];redraw();}};
 },
 challenge:function(panel,api,stage){var i=0,s=taskState(0),timer=null,q=h('p',{class:'pr-task'}),inp=h('input',{class:'nova-input',type:'text',placeholder:'Number and unit','aria-label':'Answer with correct units'}),status=h('p',{class:'f1808-status','aria-live':'polite'});
 function redraw(win){scene(stage,s,{title:'Compound measures · question '+(i+1)+' / '+tasks.length,tag:'DRAG · CALCULATE · VERIFY',interactive:true,hideAnswers:true,refresh:redraw,pose:win?'celebrate':'read-tablet',say:win?'Excellent. Your calculation uses the correct values and correct unit.':'Name what is missing. Arrange the two known values before you answer.'});}
 function load(){s=taskState(i);q.textContent=(i+1)+' / '+tasks.length+' · '+tasks[i].q;inp.value='';status.textContent='';status.removeAttribute('data-good');status.removeAttribute('data-bad');redraw();}
 function check(){var out=diagnose(s,inp.value);status.textContent=out[1];status.toggleAttribute('data-good',out[0]);status.toggleAttribute('data-bad',!out[0]);emit('answer',inp.value);api.check(out[0],out[1],{task:i,target:s.target});if(out[0]){redraw(true);var x=N.answerChip(display(answer(s),s.p.units[s.target])+' · correct',true);x.classList.add('f1808-pop');stage.querySelector('.f1808-side').appendChild(x);N.neonRing(stage.querySelector('.f1808-svg'),374,119,{role:'result',r:9});if(i<tasks.length-1){if(timer)clearTimeout(timer);timer=setTimeout(function(){i++;load();},1600);}}}
 panel.appendChild(q);panel.appendChild(h('label',{class:'f1808-control'},['Answer and units ',inp]));panel.appendChild(h('div',{class:'f1808-actions'},[h('button',{class:'nova-btn primary',text:'Check answer',onclick:check}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(tasks[i].hint);}}),h('button',{class:'nova-btn',text:'Reset question',onclick:load})]));panel.appendChild(status);load();api.onCleanup(function(){if(timer)clearTimeout(timer);});
 C._challenge={tasks:tasks,state:function(){return {index:i,expected:answer(s),unit:s.p.units[s.target],slots:s.slots.slice(),target:s.target};},task:function(j){if(timer)clearTimeout(timer);i=Math.max(0,Math.min(tasks.length-1,j));load();},place:function(role,slot){s.slots[slot]=role;redraw();},check:function(v){return diagnose(s,v);},solve:function(){s.slots=pair(s).slice();inp.value=fmt(answer(s))+' '+s.p.units[s.target];redraw();return inp.value;}};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"steps":()=>steps,"tasks":()=>tasks},draws:{"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"factory","factory":"state","argCount":1},"watch.s":{"kind":"factory","factory":"state","argCount":1},"taskState.s":{"kind":"factory","factory":"state","argCount":2}}});
N.bankMount({id:ID,num:'F18·08',title:'Compound measures',def:def,years:'KS3 Year 8–9 speed, density, compound rates and pressure extension.',linked:['F0-02','F0-03','F0-04','F18-02','F18-03'],spec:{purpose:'Understand and solve linked compound quantities using reversible formula triangles and correct physical units.',params:'Three related quantities, target unknown, units, conversion factor, multiplication or division.',presets:'Six KS3 curriculum-aligned speed, density, rate conversion, multi-step, mass and pressure examples.',steps:'Introduce knowns → identify target → arrange numerator and denominator → preserve units → compute → generalise.',interactions:'Animated WATCH with narration and scrub, GUIDED prompts, core svgDrag chips and unknown-selector in EXPLORE, six checked CHALLENGE questions.',traps:'Multiplication instead of division, reciprocal, treating minutes as hours, reverse rate conversion, wrong or missing units.',gcse:'Find mass, density, volume, pressure and compare mixed compound rates.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4200);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

