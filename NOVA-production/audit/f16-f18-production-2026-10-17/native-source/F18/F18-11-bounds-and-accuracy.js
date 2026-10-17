
/* NOVA F18-11 — Bounds and accuracy. Uses unmodified shared NOVA core. */
(function(){'use strict';
var N=NOVA,S=N.svg,E=S.el,M=N.motion,h=N.h,ID='F18-11';
// Step is the increment used when a measurement was rounded. Calculations retain unrounded arithmetic.
var presets={
 ruler:{label:'Length · nearest centimetre',v:12,step:1,u:'cm',context:'A pencil is recorded as 12 cm to the nearest centimetre.',ext:null},
 decimal:{label:'Length · nearest tenth',v:3.7,step:.1,u:'m',context:'A ribbon is recorded as 3.7 m to the nearest tenth of a metre.',ext:null},
 mass:{label:'Mass · nearest 10 grams',v:250,step:10,u:'g',context:'A parcel has a recorded mass of 250 g to the nearest 10 g.',ext:null},
 map:{label:'Distance · nearest 100 metres',v:1200,step:100,u:'m',context:'A map records a distance of 1,200 m to the nearest 100 m.',ext:null},
 rectangle:{label:'Area · two rounded lengths',v:8,step:1,u:'m',context:'One side of a rectangle measures 8 m and the other measures 5 m, each to the nearest metre.',ext:{kind:'area',other:5,otherStep:1}},
 speed:{label:'Speed · limits from measurements',v:2,step:.1,u:'h',context:'A journey takes 2.0 h to the nearest 0.1 h; the distance is 120 km to the nearest kilometre.',ext:{kind:'speed',distance:120,distanceStep:1}}
};
var tasks=[
 {key:'ruler',v:16,step:1,u:'cm',q:'A board measures 16 cm to the nearest centimetre. Find its lower and upper bounds.'},
 {key:'decimal',v:5.3,step:.1,u:'m',q:'A rope is 5.3 m to the nearest tenth of a metre. Find its error interval.'},
 {key:'mass',v:470,step:10,u:'g',q:'A package is 470 g to the nearest 10 g. Give the bounds.'},
 {key:'map',v:1800,step:100,u:'m',q:'A road is measured as 1,800 m to the nearest 100 m. Give its error interval.'},
 {key:'rectangle',v:9,step:1,u:'m',ext:{kind:'area',other:4,otherStep:1},q:'A garden length is 9 m, rounded to the nearest metre. Give the bounds of this length.'},
 {key:'speed',v:3.2,step:.1,u:'h',ext:{kind:'speed',distance:150,distanceStep:1},q:'A journey time is 3.2 h to the nearest 0.1 h. Give the bounds of the time.'}
];
var C=window.NovaV2Integration.configuration(window.NOVA_F18_11_CONFIG={preset:'ruler',events:['value','correct','step','hintUsed','mode'],valueKeys:['preset','lowerMarker','upperMarker','reset','answer','removed'],presets:presets,challengeTasks:tasks});
function fmt(n){return Number(Number(n).toPrecision(11)).toLocaleString('en-GB',{maximumFractionDigits:5});}
function unit(n,p){return fmt(n)+' '+p.u;}
function lower(p){return +(p.v-p.step/2).toPrecision(12);}function upper(p){return +(p.v+p.step/2).toPrecision(12);}
function ab(p){if(!p.ext)return null;var e=p.ext;if(e.kind==='area')return [(p.v-p.step/2)*(e.other-e.otherStep/2),(p.v+p.step/2)*(e.other+e.otherStep/2),'m²'];
 return [(e.distance-e.distanceStep/2)/(p.v+p.step/2),(e.distance+e.distanceStep/2)/(p.v-p.step/2),'km/h'];}
function state(p){return {p:p,index:[0,4],notice:''};} // five candidate ticks, accurate ticks are index 1 and 3.
function emit(k,v){N.events.emit('value',{engine:ID,key:k,value:v});}
function nt(pa,x,y,t,role,z){return N.chalkText(pa,x,y,String(t),{role:role||'given',size:z||19,anchor:'middle'});}
function nl(pa,x,y,x2,y2,role,w){return N.neonLine(pa,x,y,x2,y2,{role:role||'given',width:w||3});}
function nb(pa,x,y,w,hh,role){return N.neonBox(pa,x,y,w,hh,{role:role||'focus',r:11});}
function tickValue(p,i){return +(p.v+p.step*(i-2)/2).toPrecision(12);}
function xPos(i){return 48+i*86;}
function card(side,label,value,type){var c=h('div',{class:'f1811-card'});if(type)c.setAttribute('data-'+type,'');c.append(h('small',{text:label}),h('strong',{text:value}));side.appendChild(c);return c;}
function controls(sv,grp,s,which,refresh){var p=s.p,idx=s.index[which],placed=idx!==null,colour=which===0?'focus':'op';var px=placed?xPos(idx):(which===0?140:300),py=placed?254:554;
 var el=E('g',{class:'f1811-handle','data-bound':which===0?'lower':'upper','data-index':idx===null?'removed':String(idx),tabindex:0,role:'button','aria-label':(which===0?'Lower bound':'Upper bound')+'. Drag left or right to adjust. Arrow keys adjust, Delete removes, Enter restores.'},sv);
 var line=E('g',{'aria-hidden':'true','pointer-events':'none'},el);
 if(placed){nl(line,px,208,px,275,colour,4);if(which===0){N.neonRing(line,px,253,{role:colour,r:10,pulse:false});}else{N.neonPath(line,'M '+(px-10)+' 253 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0',{role:colour,width:3});}}
 nb(el,px-38,py-18,76,38,colour);nt(el,px,py+7,which===0?'LOWER':'UPPER',colour,15);
 var start={x:px-39,y:py-20,w:78,h:42};
 var zones=function(){var z=[0,1,2,3,4].map(function(i){return {id:'t'+i,kind:'drop',x:xPos(i)-40,y:186,w:80,h:126};});z.push({id:'remove',kind:'remove',x:39,y:506,w:362,h:90});return z;};
 N.ui.svgDrag(sv,el,{box:start,zones:zones,removeTo:{x:px,y:py},onDrop:function(id){if(id[0]==='t'){var next=+id.slice(1);s.index[which]=next;emit(which?'upperMarker':'lowerMarker',tickValue(p,next));refresh();return true;}return false;},onRemove:function(){s.index[which]=null;emit('removed',which===0?'lower':'upper');refresh();}});
 // Restore capture after the shared helper's drag lift when a browser moves an SVG element in the DOM.
 el.addEventListener('pointerdown',function(e){try{el.setPointerCapture(e.pointerId);}catch(_){}});
 el.addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowLeft'||k==='ArrowDown'||k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();var d=(k==='ArrowLeft'||k==='ArrowDown')?-1:1;s.index[which]=Math.max(0,Math.min(4,(s.index[which]===null?2:s.index[which])+d));emit(which?'upperMarker':'lowerMarker',tickValue(p,s.index[which]));refresh();}
 else if(k==='Delete'||k==='Backspace'){e.preventDefault();s.index[which]=null;emit('removed',which===0?'lower':'upper');refresh();}
 else if(k==='Enter'||k===' '){e.preventDefault();s.index[which]=which===0?0:4;emit(which?'upperMarker':'lowerMarker',tickValue(p,s.index[which]));refresh();}});
}
function visual(svg,s,o){var p=s.p,lo=lower(p),hi=upper(p),idx=s.index,show=!!o.showAnswers,challenge=!!o.challenge,interactive=!!o.interactive;
 nt(svg,220,36,'What could the measurement be?','focus',22);nl(svg,41,52,399,52,'focus',3.2);
 nb(svg,94,75,252,69,'given');nt(svg,220,102,unit(p.v,p),'given',30);nt(svg,220,125,'rounded to nearest '+fmt(p.step)+' '+p.u,'support',16);
 nt(svg,220,172,'Half a rounding step on either side','support',17);
 // Single canonical NOVA core number line — no custom axis/ticks/subdivisions.
 var tmin=tickValue(p,0),tmax=tickValue(p,4);var nline=N.numberLine(svg,{x:48,y:254,w:344,min:tmin,max:tmax,major:p.step/2,labelSize:16,arrows:false,label:function(v){return (Math.abs(v-tmin)<p.step*1e-7||Math.abs(v-tmax)<p.step*1e-7)?'':fmt(v);}});
 nt(svg,48,316,fmt(tmin),'support',15);nt(svg,392,316,fmt(tmax),'support',15);
 // The luminous interval beam is a mathematical construction, not a second scale.
 var v0=idx[0]===null?null:tickValue(p,idx[0]),v1=idx[1]===null?null:tickValue(p,idx[1]);
 if(v0!==null&&v1!==null&&v1>v0){var bx=xPos(idx[0]),ex=xPos(idx[1]);nb(svg,bx,215,ex-bx,20,(show&&idx[0]===1&&idx[1]===3)?'result':'support');}
 if(show){nl(svg,xPos(1),305,xPos(1),349,'given',2);nl(svg,xPos(3),305,xPos(3),349,'op',2);}
 nt(svg,220,342,challenge?'Select the two possible boundary values':show?'Lower included · upper excluded':'Move the handles to the half-way positions','focus',17);
 if(interactive){
  nl(svg,43,505,397,505,'error',2.8);nb(svg,52,518,336,56,'error');nt(svg,220,552,'Remove handles here','error',19);
  nt(svg,220,617,'Drag markers · Arrow keys adjust','support',17);nt(svg,220,642,'Delete removes · Enter restores','support',16);
  controls(svg,null,s,0,o.refresh);controls(svg,null,s,1,o.refresh);
 }else{
  if(show){nb(svg,49,374,342,68,'result');nt(svg,220,400,fmt(lo)+'  ≤  x  <  '+fmt(hi),'result',23);nt(svg,220,430,'The upper bound is not included','support',16);}
  else nt(svg,220,423,'Where do the neighbouring rounding values meet?','given',18);
 }
}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Bounds and accuracy',o.tag||'ROUND · INTERVAL · REASON');var layout=h('div',{class:'f1811-layout'}),main=h('div',{class:'f1811-main'}),aside=h('div',{class:'f1811-side'});layout.append(main,aside);stage.appendChild(layout);
 var svg=S.root(440,o.interactive?680:476,'Neon bounds number line using the NOVA core, with movable lower and upper markers, showing the lower inclusive and upper exclusive interval.');svg.classList.add('f1811-svg');main.appendChild(svg);visual(svg,s,o);
 var p=s.p,conceal=(!!o.challenge&&!o.won)||(typeof o.step==='number'&&o.step<4);card(aside,'RECORDED',unit(p.v,p),'recorded');card(aside,'ROUNDING INCREMENT',unit(p.step,p),'increment');
 card(aside,'LOWER BOUND',conceal?'Work it out':unit(lower(p),p),'lower');card(aside,'UPPER BOUND',conceal?'Work it out':unit(upper(p),p),'upper');
 var ext=ab(p);if(ext&&!conceal){card(aside,ext[2]==='m²'?'AREA LOWER LIMIT':'SPEED LOWER LIMIT',fmt(ext[0])+' '+ext[2],'calc');card(aside,ext[2]==='m²'?'AREA UPPER LIMIT':'SPEED UPPER LIMIT',fmt(ext[1])+' '+ext[2],'calc');}
 aside.appendChild(h('p',{class:'f1811-explain',text:conceal?'Find halfway points either side of the recorded value. The lower end is included; the upper end is excluded.':ext?(ext[2]==='m²'?'For positive side lengths, multiply the two lower bounds for minimum area and the two upper bounds for maximum area.':'For positive quantities, minimum speed uses the smallest distance and largest time; maximum speed uses the largest distance and smallest time.'):'A rounded result represents every value from the halfway point below up to, but not including, the halfway point above.'}));
 if(o.interactive)aside.appendChild(h('p',{class:'f1811-progress',text:'Marker positions: '+s.index.map(function(i,j){return (j?'Upper ':'Lower ')+(i===null?'removed':unit(tickValue(p,i),p));}).join(' · ')}));
 N.scene.helperStrip(stage,o.pose||'explain',o.say||'Rounding hides a range of measurements. Find the two halfway points.');return svg;
}
var steps=[
 {name:'Start with a measurement',pose:'explain',narration:'A length is given as twelve centimetres to the nearest centimetre. It might not have been exactly twelve centimetres.',prompt:'Does twelve centimetres describe one exact length?',say:'Rounded measurements stand for a whole interval, not just one exact value.'},
 {name:'Find the rounding increment',pose:'count',narration:'The rounding increment is one centimetre. Half of one centimetre is zero point five centimetres.',prompt:'What is half of the rounding increment?',say:'The halfway distance is half the step. Here that is half a centimetre.'},
 {name:'Find the lower endpoint',pose:'point-down',narration:'Take half a centimetre away from twelve. The lower bound is eleven point five centimetres and it is included.',prompt:'Is the lower endpoint part of the interval?',say:'Eleven point five rounds up to twelve, so the lower endpoint is included.'},
 {name:'Find the upper endpoint',pose:'compare',narration:'Add half a centimetre to twelve. The upper bound is twelve point five, but twelve point five rounds to thirteen, not twelve.',prompt:'Why is the upper boundary excluded?',say:'The upper boundary is open. Values can get close, but cannot reach it.'},
 {name:'Write the interval',pose:'think',narration:'We write eleven point five is less than or equal to x, and x is less than twelve point five. Keep centimetres as the unit.',prompt:'Which inequality symbol is strict?',say:'Lower bound included; upper bound excluded. The signs are different.'},
 {name:'Transfer to another accuracy',pose:'celebrate',narration:'The same idea works for decimals and for rounding to ten or one hundred. Change the rounding step, then halve it.',prompt:'What changes if a measurement is given to the nearest tenth?',say:'For tenths, the halfway margin is zero point zero five. The rule still works.'}
];
function watch(i,stage){var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.s",(...a)=>state(...a),[presets.ruler]):(state(presets.ruler)));s.index=[i>=2?1:0,i>=3?3:4];var o={title:'The hidden interval',tag:'STEP '+(i+1)+' / '+steps.length,step:i,pose:steps[i].pose,say:steps[i].say,showAnswers:i>=4};var svg=scene(stage,s,o);if(i>=2)M.flash(svg,xPos(i>=3?3:1),254,'focus',18);if(i===4){var answer=stage.querySelector('.f1811-card[data-lower] strong');if(answer)M.tween(620,function(v){answer.textContent=unit(11.5*v,s.p);},M.ease.out);}if(i===5){var chip=N.answerChip('11.5 ≤ x < 12.5 cm',true);chip.classList.add('f1811-pop');stage.querySelector('.f1811-side').appendChild(chip);}}
function parse(raw,p){var m=String(raw||'').trim().replace(/,/g,'').match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))\s*(cm|centimetres?|m|metres?|g|grams?|h|hours?)$/i);if(!m)return {ok:false,msg:'Enter a number followed by the correct unit (for example 11.5 cm).'};var units={cm:['cm','centimetre','centimetres'],m:['m','metre','metres'],g:['g','gram','grams'],h:['h','hour','hours']};if(!units[p.u].includes(m[2].toLowerCase()))return {ok:false,msg:'Incorrect measurement unit. Use '+p.u+'.'};return {ok:true,n:+m[1]};}
function validate(s,a,b){var p=s.p,A=parse(a,p),B=parse(b,p);if(!A.ok)return [false,'Lower bound: '+A.msg];if(!B.ok)return [false,'Upper bound: '+B.msg];var lo=lower(p),hi=upper(p),eps=p.step*1e-6;if(Math.abs(A.n-lo)>eps||Math.abs(B.n-hi)>eps){if(Math.abs(A.n-hi)<eps&&Math.abs(B.n-lo)<eps)return [false,'The endpoints are reversed. The lower bound is smaller than the upper bound.'];if(Math.abs(A.n-(p.v-p.step))<eps&&Math.abs(B.n-(p.v+p.step))<eps)return [false,'Use HALF of the rounding increment, not the entire increment.'];if(Math.abs(A.n-p.v)<eps||Math.abs(B.n-p.v)<eps)return [false,'The recorded value is in the middle, not at either endpoint.'];return [false,'Recheck each halfway point: recorded value ± half the rounding increment.'];}
 if(s.index[0]!==1||s.index[1]!==3){if(s.index.some(function(i){return i===null;}))return [false,'The numbers are correct; restore both markers and position them on the interval endpoints.'];return [false,'The numbers are correct; now place both neon handles on the two halfway ticks.'];}
 return [true,'Correct. Lower bound included, upper bound excluded. Both values carry the correct unit.'];}
var def={id:ID,title:'Bounds and accuracy',config:C,steps:steps,render:watch,alt:'Core NOVA neon number line representing a rounded measurement, with draggable lower and upper bound markers.',staticAlt:'For rounded value v to nearest step d, the error interval starts at v − d/2 inclusive and ends at v + d/2 exclusive.',exploreIntro:'Drag the lower and upper markers to the halfway ticks. Compare ordinary measurements, decimal precision and calculated limits.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",(...a)=>state(...a),[presets[C.preset]]):(state(presets[C.preset]))),select=h('select',{class:'nova-input','aria-label':'Choose measurement context'}),status=h('p',{class:'f1811-status','aria-live':'polite'});window.NovaLessonComponent?.applyExploreModels();Object.keys(presets).forEach(function(k){select.appendChild(h('option',{value:k,text:presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();select.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();function redraw(){scene(stage,s,{title:'Explore the error interval',tag:'DRAG · SNAP · REASON',interactive:true,refresh:redraw,showAnswers:true,pose:'point-down',say:'Position each handle at the halfway point, not the rounded number.'});status.textContent= s.index[0]===1&&s.index[1]===3?'Both markers are on the correct halfway ticks.':'Try to place each marker at the correct halfway tick.';}
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('label',{class:'f1811-control'},['Measurement ',select]),h('button',{class:'nova-btn',text:'Reset handles',onclick:function(){s.index=[0,4];emit('reset','handles');redraw();}}),status);
 window.NovaLessonComponent?.applyExploreModels();select.onchange=function(){C.preset=select.value;s=state(presets[C.preset]);emit('preset',C.preset);redraw();};window.NovaLessonComponent?.applyExploreModels();redraw();window.NovaLessonComponent?.applyExploreModels();C._explore={select:function(k){select.value=k;select.onchange();},state:function(){return {preset:C.preset,index:s.index.slice(),lower:lower(s.p),upper:upper(s.p),derived:ab(s.p)};},place:function(side,tick){s.index[side]=tick;redraw();},remove:function(side){s.index[side]=null;redraw();}};
 },
 challenge:function(panel,api,stage){var i=0,s,timer=null,q=h('p',{class:'pr-task'}),A=h('input',{type:'text',class:'nova-input',placeholder:'Number and unit','aria-label':'Lower bound with unit'}),B=h('input',{type:'text',class:'nova-input',placeholder:'Number and unit','aria-label':'Upper bound with unit'}),status=h('p',{class:'f1811-status','aria-live':'polite'});
 function redraw(won){scene(stage,s,{title:'Bounds challenge · '+(i+1)+' / '+tasks.length,tag:'READ · PLACE · CHECK',interactive:true,refresh:redraw,challenge:true,won:!!won,pose:won?'celebrate':'read-tablet',say:won?'You checked both endpoints and the unit. Well done.':'Use half of the rounding step to find the possible range.'});}
 function load(){s=state(Object.assign({},presets[tasks[i].key],tasks[i]));q.textContent=(i+1)+' / '+tasks.length+' · '+tasks[i].q;A.value='';B.value='';status.textContent='';redraw();}
 function submit(){var res=validate(s,A.value,B.value);status.textContent=res[1];status.toggleAttribute('data-good',res[0]);status.toggleAttribute('data-bad',!res[0]);emit('answer',{lower:A.value,upper:B.value});api.check(res[0],res[1],{task:i});if(res[0]){redraw(true);var ch=N.answerChip(unit(lower(s.p),s.p)+' ≤ x < '+unit(upper(s.p),s.p),true);ch.classList.add('f1811-pop');stage.querySelector('.f1811-side').appendChild(ch);M.flash(stage.querySelector('.f1811-svg'),220,253,'result',35);if(i<tasks.length-1){timer=setTimeout(function(){i++;load();},1700);}}}
 panel.append(q,h('label',{class:'f1811-control'},['Lower bound ',A]),h('label',{class:'f1811-control'},['Upper bound ',B]),h('div',{class:'f1811-actions'},[h('button',{class:'nova-btn primary',text:'Check both bounds',onclick:submit}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint('Halve the stated rounding increment. Subtract for the lower bound; add for the upper bound.');}}),h('button',{class:'nova-btn',text:'Reset question',onclick:load})]),status);load();api.onCleanup(function(){if(timer)clearTimeout(timer);});
 C._challenge={tasks:tasks,state:function(){return {index:i,lower:lower(s.p),upper:upper(s.p),selected:s.index.slice()};},task:function(j){if(timer)clearTimeout(timer);i=Math.max(0,Math.min(tasks.length-1,j));load();},place:function(side,tick){s.index[side]=tick;redraw();},remove:function(side){s.index[side]=null;redraw();},check:function(a,b){return validate(s,a,b);},solve:function(){s.index=[1,3];redraw();A.value=unit(lower(s.p),s.p);B.value=unit(upper(s.p),s.p);return [A.value,B.value];}}
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"presets":()=>presets,"tasks":()=>tasks,"steps":()=>steps},draws:{"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"factory","factory":"state","argCount":1},"watch.s":{"kind":"factory","factory":"state","argCount":1}}});
N.bankMount({id:ID,num:'F18·11',title:'Bounds and accuracy',def:def,years:'KS3 Year 8 error intervals and Year 9 measurement error; GCSE composite quantity bounds extension.',linked:['F0-02','F0-03','F0-04','F1-01','F18-01','F18-10'],spec:{purpose:'Represent the full interval of possible values for a rounded measurement, then reason about its endpoints and computed accuracy.',params:'Measured value, rounding increment, unit, lower/upper endpoint and optional second measurement for area or speed.',presets:'Six settings: centimetres, tenths, 10 grams, 100 metres, two-sided rectangle and speed.',steps:'Introduce the rounded measurement → halve the increment → identify lower → upper → write the half-open interval → transfer to other accuracy.',interactions:'NOVA number line, two movable endpoint handles with snap/keyboard support, WATCH with narration, GUIDED and six checked challenges.',traps:'Assuming the rounded value is exact; full rather than half increment; reversed endpoints; inclusive upper bound; missing/wrong units.',gcse:'Composite area and speed bounds, with maximum speed using largest distance divided by smallest time.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4200);};N.events.history().forEach(add);N.events.on('*',add);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();

