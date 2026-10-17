
/* NOVA F18-03 · ANALOGUE CLOCK · uses embedded canonical shared NOVA core */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-03';
var C=window.NovaV2Integration.configuration(window.NOVA_F18_03_CONFIG={startMode:'watch',preset:'time',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','hour','minute','answer','hand'],
 presets:{
  time:{label:'Y7-050 · read an analogue clock',kind:'time',h:7,m:25,story:'Read the analogue clock accurately.',labelShort:'Reading the clock',say:'The long hand shows twenty-five minutes; the short hand has moved beyond seven.'},
  set:{label:'Y7-050 · set a time',kind:'time',h:4,m:40,story:'Set the clock to twenty to five.',labelShort:'Set the hands',say:'Forty minutes is eight minute-mark steps; the hour hand is between four and five.'},
  pm:{label:'Y7-050 · 24-hour time',kind:'24',h:16,m:40,story:'It is four forty in the afternoon.',labelShort:'12 h / 24 h',say:'After midday, write sixteen forty in the twenty-four-hour clock.'},
  right:{label:'Y7-040 · right-angle clock',kind:'angle',h:3,m:0,story:'Find the smaller angle between the hands.',labelShort:'Clock-face angles',say:'Each hour interval is thirty degrees; three intervals make ninety degrees.'},
  offset:{label:'F11-12 · moving hour hand',kind:'angle',h:2,m:20,story:'Find the smaller angle at two twenty.',labelShort:'Moving hour hand',say:'The hour hand is ten degrees past two, and the minute hand is at one hundred and twenty degrees.'},
  narrow:{label:'F11-12 · small angle',kind:'angle',h:4,m:20,story:'Find the smaller angle at four twenty.',labelShort:'Ten-degree angle',say:'At four twenty, the short hand has moved ten degrees beyond four: the hands are ten degrees apart.'},
  reflex:{label:'F11-12 · reflex angle',kind:'reflex',h:8,m:0,story:'Find the reflex angle between the hands.',labelShort:'Reflex angle',say:'The smaller angle at eight o clock is one hundred and twenty degrees. Subtract from a full turn.'}
 }});
function preset(k){return C.presets[k]||C.presets.time;}
function mod(x,n){return ((x%n)+n)%n;}
function hourDeg(hh,mm){return mod(hh,12)*30+mm*.5;}
function minuteDeg(mm){return mod(mm,60)*6;}
function smallAngle(hh,mm){var a=Math.abs(hourDeg(hh,mm)-minuteDeg(mm));return Math.min(a,360-a);}
function resultAngle(hh,mm,reflex){return reflex?360-smallAngle(hh,mm):smallAngle(hh,mm);}
function pad(x){return String(x).padStart(2,'0');}
function time12(hh,mm){return (mod(hh-1,12)+1)+':'+pad(mm);}
function time24(hh,mm){return pad(mod(hh,24))+':'+pad(mm);}
function timeText(s){return s.p.kind==='24'?time24(s.h,s.m):time12(s.h,s.m);}
function fire(key,value){N.events.emit('value',{engine:ID,key:key,value:value});}
function tx(g,x,y,t,role,sz,anchor){return N.chalkText(g,x,y,String(t),{role:role||'given',size:sz||21,anchor:anchor||'middle'});}
function ln(g,x,y,x2,y2,role,w){return N.neonLine(g,x,y,x2,y2,{role:role||'op',width:w||3});}
function path(g,d,role,w,fill){return N.neonPath(g,d,{role:role||'op',width:w||3,fill:!!fill});}
function geo(){return window.innerWidth<=560?{W:400,H:568,cx:200,cy:267,r:160}:{W:620,H:532,cx:310,cy:243,r:187};}
function polar(cx,cy,r,d){var a=d*Math.PI/180;return {x:cx+Math.sin(a)*r,y:cy-Math.cos(a)*r};}
function circle(cx,cy,r){return 'M'+(cx-r)+','+cy+' a'+r+','+r+' 0 1,0 '+(2*r)+',0 a'+r+','+r+' 0 1,0 '+(-2*r)+',0';}
function arcFor(s,d){var a=hourDeg(s.h,s.m),b=minuteDeg(s.m),diff=mod(b-a,360),large=s.p.kind==='reflex',change=large?360-smallAngle(s.h,s.m):smallAngle(s.h,s.m);if(change<.1)return null;var begin,end,sweep=1;if(large){if(diff>=180){begin=a;end=b;}else{begin=b;end=a;}}else{if(diff<=180){begin=a;end=b;}else{begin=b;end=a;}}var p1=polar(d.cx,d.cy,d.r*.43,begin),p2=polar(d.cx,d.cy,d.r*.43,end);return 'M'+p1.x.toFixed(2)+','+p1.y.toFixed(2)+' A'+(d.r*.43)+','+(d.r*.43)+' 0 '+(change>180?1:0)+' '+sweep+' '+p2.x.toFixed(2)+','+p2.y.toFixed(2);}
function readout(s){if(s.p.kind==='angle'||s.p.kind==='reflex')return resultAngle(s.h,s.m,s.p.kind==='reflex')+'°';return timeText(s);}
function setClock(s,hh,mm,notify){s.h=mod(Math.round(hh),24);s.m=mod(Math.round(mm),60);if(notify){fire('hour',s.h);fire('minute',s.m);}}
function drawHand(svg,d,s,kind,o){var isMin=kind==='minute',angle=isMin?minuteDeg(s.m):hourDeg(s.h,s.m),length=d.r*(isMin?.78:.56),tail=isMin?22:17,w=isMin?8:13,role=isMin?'op':'given';
 var arm=E('g',{'data-hand-art':kind,'aria-hidden':'true',transform:'rotate('+angle+' '+d.cx+' '+d.cy+')'},svg);
 path(arm,'M'+(d.cx-w)+','+(d.cy+tail/2)+' Q'+(d.cx-w-1)+','+(d.cy+8)+' '+(d.cx-w*.65)+','+(d.cy-15)+' L'+d.cx+','+(d.cy-length)+' Q'+(d.cx+w*.65)+','+(d.cy-15)+' '+(d.cx+w)+','+(d.cy+tail/2)+' Z',role,isMin?3.1:3.5,true);
 // tiny directional hub seam; neon artwork is the shared primitive, not a new drawing library
 ln(arm,d.cx,d.cy-26,d.cx,d.cy-length+18,role,isMin?2.3:3.2);
 if(!o.drag)return;
 var pick=polar(d.cx,d.cy,length*.89,angle),grip=E('g',{'data-hand':kind,tabindex:'0',role:'slider','aria-label':(isMin?'Minute':'Hour')+' hand. Drag around the clock, or use arrow keys.', 'aria-valuemin':isMin?'0':'1','aria-valuemax':isMin?'59':'12','aria-valuenow':isMin?String(s.m):String(mod(s.h-1,12)+1),'aria-valuetext':isMin?s.m+' minutes':(mod(s.h-1,12)+1)+' hours',class:'f1803-handgrip'},svg);
 N.neonRing(grip,pick.x,pick.y,{role:role,r:11,pulse:false});
 var dxy=null,cur=null,wrap=0,previous=s.m,captured=false;
 function relative(ev){var q=svg.createSVGPoint();q.x=ev.clientX;q.y=ev.clientY;var mat=svg.getScreenCTM();return mat?q.matrixTransform(mat.inverse()):{x:d.cx,y:d.cy};}
 function anglePoint(ev){var q=relative(ev);return mod(Math.atan2(q.x-d.cx,d.cy-q.y)*180/Math.PI,360);}
 function maybePreview(ev){if(!N.ui._drag||N.ui._drag.el!==grip)return;var deg=anglePoint(ev);cur=isMin?mod(Math.round(deg/6),60):mod(Math.round(deg/30),12);if(isMin){if(previous>=54&&cur<=6)wrap++;if(previous<=6&&cur>=54)wrap--;previous=cur;}var ah=isMin?hourDeg(s.h+wrap,cur):mod(cur*30+s.m*.5,360);var am=isMin?cur*6:minuteDeg(s.m);var hh=svg.querySelector('[data-hand-art="hour"]'),mm=svg.querySelector('[data-hand-art="minute"]');if(hh)hh.setAttribute('transform','rotate('+ah+' '+d.cx+' '+d.cy+')');if(mm)mm.setAttribute('transform','rotate('+am+' '+d.cx+' '+d.cy+')');}
 svg.addEventListener('pointermove',maybePreview,true);
 svg.addEventListener('pointerup',function(ev){if(N.ui._drag&&N.ui._drag.el===grip){dxy=anglePoint(ev);}},true);
 // The shared NOVA F2 drag kit is responsible for capture, lift, release and spring-back.
 // Use the entire clock surface as a valid rotating target, with the angular snap determined by actual pointer position.
 N.ui.svgDrag(svg,grip,{box:{x:pick.x-13,y:pick.y-13,w:26,h:26},zones:function(){return [{id:'dial',kind:'drop',x:d.cx-d.r-10,y:d.cy-d.r-10,w:2*d.r+20,h:2*d.r+20}];},
  onDrop:function(){if(dxy==null)return false;var nearest=isMin?mod(Math.round(dxy/6),60):mod(Math.round(dxy/30),12);if(isMin){s.h=mod(s.h+wrap,24);s.m=nearest;fire('hour',s.h);fire('minute',nearest);}else{var period=s.h>=12?12:0;s.h=nearest+period;fire('hour',s.h);}fire('hand',kind);o.refresh(kind);return true;}});
 // Re-establish pointer capture after the core re-parents the SVG group, matching the approved F18-02 patch.
 grip.addEventListener('pointerdown',function(ev){dxy=null;wrap=0;previous=s.m;if(N.ui._drag&&N.ui._drag.el===grip){try{grip.setPointerCapture(ev.pointerId);captured=true;}catch(_){}}});
 grip.addEventListener('keydown',function(ev){var k=ev.key;if(k==='ArrowRight'||k==='ArrowUp'||k==='ArrowLeft'||k==='ArrowDown'){ev.preventDefault();var inc=(k==='ArrowRight'||k==='ArrowUp')?1:-1;
  if(isMin){var v=s.m+inc*(ev.shiftKey?5:1);if(v>=60){s.h=mod(s.h+1,24);fire('hour',s.h);}if(v<0){s.h=mod(s.h-1,24);fire('hour',s.h);}s.m=mod(v,60);fire('minute',s.m);}
  else{s.h=mod(s.h+inc,24);fire('hour',s.h);}fire('hand',kind);o.refresh(kind);}
  if(k==='Escape'&&N.ui._drag)N.ui.cancelDrag();});
 return grip;}
function drawing(box,s,o){o=o||{};var d=geo(),label=o.hideAnswers?'Analogue clock with a short hour hand, a long minute hand and numbered hour markers. Read the positions.':'Premium analogue clock. '+time12(s.h,s.m)+'. The smaller angle is '+smallAngle(s.h,s.m)+' degrees.',svg=S.root(d.W,d.H,label);svg.classList.add('f1803-drawing');
 var bg=E('g',{'aria-hidden':'true',style:'pointer-events:none'},svg);
 // Dial: layered glass rings and luminous radial precision. Geometric paths via approved neonPath.
 path(bg,circle(d.cx,d.cy,d.r+3),'support',6,true);
 path(bg,circle(d.cx,d.cy,d.r-9),'op',2.4);
 path(bg,circle(d.cx,d.cy,d.r-23),'support',1.9);
 path(bg,circle(d.cx,d.cy,d.r*.81),'support',1.2);
 // 60 accurately spaced subdivisions; 5-minute divisions and hour numerals receive stronger NOVA neon.
 for(var i=0;i<60;i++){var big=i%5===0,x1=polar(d.cx,d.cy,d.r-(big?29:24),i*6),x2=polar(d.cx,d.cy,d.r-(big?12:16),i*6);ln(bg,x1.x,x1.y,x2.x,x2.y,big?'op':'support',big?3:1.25);}
 for(var n=1;n<=12;n++){var q=polar(d.cx,d.cy,d.r*.67,n*30);tx(svg,q.x,q.y+7,String(n),n%3===0?'op':'given',25);}
 if(o.angle){var dd=arcFor(s,d);if(dd){path(svg,dd,'unknown',5);var mid=(hourDeg(s.h,s.m)+minuteDeg(s.m))/2,centerQ=polar(d.cx,d.cy,d.r*.39,mid);N.neonRing(svg,centerQ.x,centerQ.y,{role:'unknown',r:5,pulse:false});}}
 drawHand(svg,d,s,'hour',o);drawHand(svg,d,s,'minute',o);
 N.neonRing(svg,d.cx,d.cy,{role:'result',r:7,pulse:false});
 // Four separated readouts, outside of the moving hand sweep.
 N.neonBox(svg,20,17,d.W-40,43,{role:'op',r:13,text:o.top||'60 minute marks · 12 hour markers',size:d.W===400?17:19});
 if(o.reveal){N.neonBox(svg,46,d.H-82,d.W-92,58,{role:'result',r:14,text:o.display||readout(s),size:d.W===400?28:33});}
 else{N.neonBox(svg,46,d.H-82,d.W-92,58,{role:'unknown',r:14,text:o.display||'Read the hands',size:d.W===400?21:24});}
 box.appendChild(svg);return svg;}
function detail(box,s,o){var angle=smallAngle(s.h,s.m),cards=[['HOUR HAND',((hourDeg(s.h,s.m)/30)%12).toFixed(s.m?2:0)+' hour marks','given'],['MINUTE HAND',s.m+' min','op'],['ANGLE FROM 12',minuteDeg(s.m)+'° for minutes','unknown'],['HANDS SEPARATION',(s.p.kind==='reflex'?360-angle:angle)+'°','result']];if(o.hideAnswers){cards=[['HOUR HAND','Read the short hand','given'],['MINUTE HAND','Read the long hand','op'],['CLOCK RULE','60 min per turn','unknown'],['YOUR ANSWER','Work it out','result']];}var side=h('div',{class:'f1803-side'});cards.forEach(function(v){side.appendChild(h('div',{class:'f1803-sidecard'},[h('span',{class:'f1803-side-label',text:v[0]}),h('strong',{class:'f1803-side-value f1803-'+v[2],text:v[1]})]));});if(o.reveal)side.appendChild(h('div',{class:'f1803-sideanswer',text:'Minute hand: 6° per minute. Hour hand: 30° per hour, plus 0.5° each minute.'}));box.appendChild(side);}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Analogue clock',o.tag||'TIME · ANGLES');var layout=h('div',{class:'f1803-layout'}),plot=h('div',{class:'f1803-plot'});stage.appendChild(layout);layout.appendChild(plot);var svg=drawing(plot,s,o);detail(layout,s,o);if(o.feedback)stage.appendChild(h('div',{class:'f1803-feedback','aria-live':'polite',text:o.feedback}));N.scene.helperStrip(stage,o.pose||'explain',o.say||s.p.say);return svg;}
var steps=[
 {name:'Notice the dial',pose:'explain',narration:'An analogue clock has twelve hour numbers and sixty minute divisions. The hands do different jobs.',prompt:'Which hand travels furthest in one hour?',say:'The long hand reads minutes. The short hand reads hours, but it never jumps suddenly to the next number.'},
 {name:'Follow the short hand',pose:'point-right',narration:'The hour hand points to seven at seven o clock. It will gradually move toward eight as the minutes pass.',prompt:'Where does the short hand point at half past seven?',say:'The short hand travels thirty degrees in one hour, so it also moves half a degree per minute.'},
 {name:'Place the minute hand',pose:'point-down',narration:'Five, ten, fifteen, twenty, twenty-five. The long hand points at the five to show twenty-five minutes.',prompt:'Why does the number five indicate twenty-five minutes?',say:'Each labelled number represents five minutes for the long hand. Count five sets of five.'},
 {name:'Watch the hour move',pose:'think',narration:'At seven twenty-five, the hour hand is already past seven. It moves with every minute.',prompt:'Does the hour hand remain exactly on seven until eight o clock?',say:'After twenty-five minutes, the hour hand has moved twelve and a half degrees beyond seven.'},
 {name:'Read the time',pose:'count',narration:'The clock reads seven twenty-five. Both hands agree with that reading.',prompt:'Read the whole time aloud, including the minutes.',say:'Use the long hand to find minutes, then check where the short hand sits between the hours.'},
 {name:'Check the angles',pose:'celebrate',narration:'Between each hour number is thirty degrees. Each minute is six degrees. At seven twenty-five the hour hand has moved from seven.',prompt:'How could you find an angle between the hands?',say:'Calculate each hand’s angle from twelve. Remember that the hour hand moves continuously, then compare.'}
];
function watchRender(i,stage){var p=preset('time'),s={p:p,h:i===0?12:7,m:i<2?0:25};var d=geo();var svg=scene(stage,s,{title:'Watch the analogue clock',tag:'STEP '+(i+1)+'/6',pose:steps[i].pose,say:steps[i].say,reveal:i>=4,angle:i===5,display:i===5?'7:25 · hour hand +12.5°':null});
 if(i===1){M.flash(svg,d.cx,d.cy-d.r*.55,'given',23);}if(i===2||i===3){M.flash(svg,d.cx,d.cy,'op',24);var grp=svg.querySelector('[data-hand-art="minute"]');if(grp&&i===2&&!N.reducedMotion()){var a=minuteDeg(s.m);M.tween(900,function(k){grp.setAttribute('transform','rotate('+(a*k)+' '+d.cx+' '+d.cy+')');},M.ease.inOut);}}
 if(i===4){var bb=svg.querySelectorAll('.nv-neon-box'),last=bb[bb.length-1];if(last){M.pop(last,d.cx,d.H-54);var txt=last.querySelector('text');if(txt&&!N.reducedMotion()){M.tween(700,function(q){txt.textContent='7:'+pad(Math.round(25*q));},M.ease.inOut,function(){txt.textContent='7:25';});}}}if(i===5)M.flash(svg,d.cx,d.cy,'result',32);
}
function parseTime(v,kind){var z=String(v||'').trim().replace(/\s+/g,'').match(/^(\d{1,2}):(\d{2})$/);if(!z)return null;var hh=+z[1],mm=+z[2];if(mm>59)return null;if(kind==='24'){if(hh>23)return null;}else if(hh<1||hh>12)return null;return {h:hh,m:mm};}
function parseDeg(v){var m=String(v||'').trim().match(/^([\d]+(?:\.\d+)?)\s*(°|degrees?|deg)$/i);return m?+m[1]:null;}
function judge(s,value,requiresSet){var type=s.p.kind;if(type==='angle'||type==='reflex'){var a=parseDeg(value);if(a==null)return [false,'Include a degree unit, such as 90°.'];var expected=resultAngle(s.p.h,s.p.m,type==='reflex');if(Math.abs(a-expected)<.001)return [true,'Correct. The hour hand moves 0.5° each minute, and the answer includes degrees.'];var same=smallAngle(s.p.h,s.p.m);if(type==='reflex'&&Math.abs(a-same)<.001)return [false,'That is the smaller angle. For a reflex angle subtract it from 360°.'];var fixed=Math.abs(mod(s.p.h,12)*30-s.p.m*6);fixed=Math.min(fixed,360-fixed);if(Math.abs(a-fixed)<.001)return [false,'The hour hand does not stay on an exact hour number. Add 0.5° for every minute.'];if(Math.abs(a-(360-expected))<.001)return [false,'Check whether the question asks for the smaller or the reflex angle.'];return [false,'Find the hour hand angle using 30° per hour and 0.5° per minute. The minute hand moves 6° per minute.'];}
 var x=parseTime(value,type);if(!x)return [false,type==='24'?'Use 24-hour time with a colon, for example 16:40.':'Enter hours and minutes, for example 7:25.'];var th=s.p.h,tm=s.p.m;
 var match=type==='24'?(x.h===th&&x.m===tm):(mod(x.h,12)===mod(th,12)&&x.m===tm);
 if(!match){if(x.m===tm&&mod(x.h,12)!==mod(th,12))return [false,'Your minutes are right. Check where the shorter hour hand points.'];if(x.h===th&&x.m!==tm)return [false,'Your hour is right. Count the minute divisions in fives and ones.'];if(type==='24'&&x.h===mod(th,12)&&x.m===tm)return [false,'That is the 12-hour reading. The question asks for 24-hour time.'];return [false,'Use the minute hand to read the minutes and the short hand for the hour.'];}
 if(requiresSet&&(mod(s.h,12)!==mod(th,12)||s.m!==tm))return [false,'Your written answer is correct, but the clock hands are not set to that time yet. Drag both hands into place.'];return [true,'Correct. '+(type==='24'?'The afternoon time is written using 24-hour notation.':'Both hands match the hours and minutes.')];}
var def={id:ID,title:'Analogue clock',config:C,steps:steps,render:watchRender,alt:'Premium neon analogue clock with continuous hour hand, precise minute divisions and draggable hand grips.',staticAlt:'For a clock at 2:20 the minute hand is 120 degrees from 12 and the hour hand is 70 degrees from 12; the smaller separation is 50 degrees.',
 exploreIntro:'Drag the glowing hand tips to a new time; the hour hand advances continuously with the minutes. Use arrow keys on a hand for precise one-unit adjustments (Shift for five minutes).',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var key=C.preset in C.presets?C.preset:'time',p=preset(key),s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",()=>({p:p,h:p.h,m:p.m})):({p:p,h:p.h,m:p.m})),pick=h('select',{class:'nova-input','aria-label':'Clock lesson preset'}),status=h('div',{class:'f1803-status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){pick.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();pick.value=key;
 window.NovaLessonComponent?.applyExploreModels();var hour=h('input',{class:'nova-input f1803-input',type:'number',min:'0',max:'23',step:'1',value:String(s.h),'aria-label':'Hours, 0 to 23'}),minute=h('input',{class:'nova-input f1803-input',type:'number',min:'0',max:'59',step:'1',value:String(s.m),'aria-label':'Minutes, 0 to 59'});
 window.NovaLessonComponent?.applyExploreModels();function refresh(focus){scene(stage,s,{title:'Explore the clock',tag:'DRAG HANDS · SNAP · KEYBOARD',drag:true,refresh:refresh,angle:s.p.kind==='angle'||s.p.kind==='reflex',reveal:true,pose:'point-down',say:'Try '+s.p.labelShort+'. '+s.p.say});hour.value=s.h;minute.value=s.m;status.textContent='Analogue: '+time12(s.h,s.m)+' · 24-hour: '+time24(s.h,s.m)+' · smaller angle: '+smallAngle(s.h,s.m)+'°'+(s.p.kind==='reflex'?' · reflex: '+resultAngle(s.h,s.m,true)+'°':'');if(focus){var grip=stage.querySelector('[data-hand="'+focus+'"]');if(grip)grip.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();pick.onchange=function(){key=pick.value;C.preset=key;p=preset(key);s={p:p,h:p.h,m:p.m};fire('preset',key);refresh();};
 window.NovaLessonComponent?.applyExploreModels();function inputs(){var a=Number(hour.value),b=Number(minute.value);if(!Number.isInteger(a)||a<0||a>23||!Number.isInteger(b)||b<0||b>59){hour.value=s.h;minute.value=s.m;return;}setClock(s,a,b,true);refresh();}window.NovaLessonComponent?.applyExploreModels();hour.onchange=inputs;window.NovaLessonComponent?.applyExploreModels();minute.onchange=inputs;
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',pick]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('div',{class:'pr-row'},[h('label',{class:'pr-row'},['Hours ',hour]),h('label',{class:'pr-row'},['Minutes ',minute]),h('button',{class:'nova-btn',text:'Back 5 min',onclick:function(){var mm=s.m-5;if(mm<0)s.h=mod(s.h-1,24);s.m=mod(mm,60);fire('minute',s.m);refresh();}}),h('button',{class:'nova-btn',text:'Forward 5 min',onclick:function(){var mm=s.m+5;if(mm>=60)s.h=mod(s.h+1,24);s.m=mod(mm,60);fire('minute',s.m);refresh();}})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();refresh();
 window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){return {preset:key,h:s.h,m:s.m,smaller:smallAngle(s.h,s.m),reflex:resultAngle(s.h,s.m,true)};},select:function(k){pick.value=k;pick.onchange();},set:function(hh,mm){setClock(s,hh,mm,true);refresh();},reset:function(){s.h=p.h;s.m=p.m;refresh();}};
 },
 challenge:function(panel,api,stage){var keys=['time','set','pm','right','offset','narrow','reflex'],j=0,p=preset(keys[j]),s={p:p,h:p.h,m:p.m},stat=h('div',{class:'f1803-status','aria-live':'polite'}),question=h('p',{class:'pr-task'}),entry=h('input',{class:'nova-input',type:'text','aria-label':'Answer including time or degrees',placeholder:'e.g. 7:25 or 90°'});
 var requiresSet=function(){return keys[j]==='set';};
 function render(focus){scene(stage,s,{title:'Clock challenge '+(j+1)+' / '+keys.length,tag:'READ · SET · CHECK',drag:requiresSet(),refresh:render,angle:p.kind==='angle'||p.kind==='reflex',reveal:false,hideAnswers:true,pose:'read-tablet',say:requiresSet()?'Place the short and long hands first. The hour hand must sit between hour numbers.':p.kind==='angle'||p.kind==='reflex'?'Find each hand’s angle from twelve before comparing.':'Read the long minute hand first, then locate the hour.'});if(focus){var grip=stage.querySelector('[data-hand="'+focus+'"]');if(grip)grip.focus({preventScroll:true});}}
 function load(){p=preset(keys[j]);s={p:p,h:requiresSet()?12:p.h,m:requiresSet()?0:p.m};question.textContent=(j+1)+' / '+keys.length+' · '+p.story+' '+(requiresSet()?'Set both hands to '+time12(p.h,p.m)+' and enter that time.':p.kind==='angle'||p.kind==='reflex'?'Give the angle with the degree symbol.':p.kind==='24'?'Answer in 24-hour notation.':'Write the time using hours and minutes.');entry.value='';stat.textContent='';render();}
 var buttons=h('div',{class:'pr-row'},[h('button',{class:'nova-btn primary',text:'Check clock',onclick:function(){var out=judge(s,entry.value,requiresSet());stat.textContent=out[1];fire('answer',entry.value);api.check(out[0],out[1],{task:j,preset:keys[j]});if(out[0]&&j<keys.length-1){var tim=setTimeout(function(){j++;load();},1100);api.onCleanup(function(){clearTimeout(tim);});}}}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(p.kind==='angle'||p.kind==='reflex'?'Use 6° per minute and 30° per hour plus 0.5° per minute. '+(p.kind==='reflex'?'Then find 360° minus the smaller angle.':''):p.kind==='24'?'Afternoon hours from 1 pm are 13 through 23 in the 24-hour system.':'The long hand moves five minutes between each numbered hour marker.');}}),h('button',{class:'nova-btn',text:'Restart challenge',onclick:function(){j=0;load();}})]);
 panel.appendChild(question);panel.appendChild(h('label',{class:'pr-row'},['Your answer ',entry]));panel.appendChild(buttons);panel.appendChild(stat);load();
 C._challenge={state:function(){return {task:j,preset:keys[j],h:s.h,m:s.m};},tasks:keys.slice(),solve:function(){if(requiresSet()){setClock(s,p.h,p.m,false);render();}entry.value=p.kind==='angle'||p.kind==='reflex'?resultAngle(p.h,p.m,p.kind==='reflex')+'°':p.kind==='24'?time24(p.h,p.m):time12(p.h,p.m);},check:function(value,hour,minute){if(hour!=null)setClock(s,hour,minute,false);return judge(s,value,requiresSet());},next:function(){j=Math.min(keys.length-1,j+1);load();},select:function(key){var i=keys.indexOf(key);if(i>=0){j=i;load();}}};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"steps":()=>steps},draws:{"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"value","factory":null,"argCount":null}}});
N.bankMount({id:ID,num:'F18·03',title:'Analogue clock',def:def,years:'Year 7 time and angles, KS3 extension and GCSE clock-face angles.',linked:['F0-02','F0-03','F0-04','F11-12','F18-01','F18-02'],spec:{purpose:'Read, set and reason about analogue time. Calculate exact angles between continually moving hour and minute hands, including smaller and reflex angles.',params:'Hour (0–23), minute (0–59), 12/24-hour notation, angle kind (smaller/reflex), draggable hour and minute hand tips.',presets:'Y7-050 reading, setting and 24-hour time; Y7-040 right angle; F11-12 moving-hour, ten-degree and reflex-angle clock-face presets included here.',steps:'Recognise dial → Hour hand → Count minute marks → Hour hand advances → Read time → Verify clock-face angles.',interactions:'WATCH narrated teaching; GUIDED prompts; EXPLORE live hands via NOVA SVG drag and keyboard with exact readings; CHALLENGE seven time/angle/unit-checked questions including hand setting.',traps:'Misread 5-minute markers as numbers; keep the hour hand fixed at whole hours; confuse 12/24-hour time; forget degree units; report a smaller angle instead of a reflex angle.',gcse:'Exact angles 6°/minute for minute hand, 0.5°/minute for hour hand and reflex/separation reasoning.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5000);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

