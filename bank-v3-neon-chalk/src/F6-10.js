/* F6-10 Speed–Distance–Time — additive NOVA component. F0 CORE REMAINS UNCHANGED. */
const F610_CONFIG={id:'F6-10',preset:'Y8-041',startMode:'watch',parameters:{distanceUnit:'km',timeUnit:'h',speedUnit:'km/h',allowZeroTime:false,precision:3},presets:{
 'Y8-041':{label:'Y8-041 · Find the speed',title:'A JOURNEY AT STEADY SPEED',distance:90,time:1.5,target:'speed',legs:[{d:45,t:.75},{d:45,t:.75}],context:'A coach travels 90 kilometres in 1.5 hours. Find its average speed.'},
 'Y9-016':{label:'Y9-016 · Read a whole journey',title:'THE COMPLETE JOURNEY',distance:180,time:3,target:'speed',legs:[{d:60,t:1},{d:30,t:1},{d:90,t:1}],context:'A journey has three stages. The whole route covers 180 kilometres in 3 hours. Find the average speed.'},
 'Y9-022-distance':{label:'Y9-022 · Find the distance',title:'HOW FAR DID IT TRAVEL?',distance:180,time:2.5,target:'distance',legs:[{d:72,t:1},{d:108,t:1.5}],context:'A vehicle travels at 72 kilometres per hour for 2.5 hours. Find its distance.'},
 'Y9-022-time':{label:'Y9-022 · Find the time',title:'HOW LONG IS THE JOURNEY?',distance:165,time:3,target:'time',legs:[{d:55,t:1},{d:110,t:2}],context:'A vehicle travels 165 kilometres at 55 kilometres per hour. Find its time.'}
 },events:['value','correct','step','hintUsed']};window.F610_CONFIG=F610_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=F610_CONFIG,ID='F6-10';
// Local pointer-release fallback: no change to the locked shared F0 system.
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f610-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
const STEPS=[
 {name:'See the journey',pose:'explain',caption:'What do we know?',narration:'A journey has a distance and a time. We use these together to find its average speed.'},
 {name:'Watch the movement',pose:'point',caption:'Follow the route.',narration:'Watch the position ring move along the route. Distance grows as the journey continues.'},
 {name:'Measure the distance',pose:'count',caption:'Read the distance.',narration:'Distance tells us how far the journey travels. We measure the complete route, not just a short part.'},
 {name:'Measure the time',pose:'checking',caption:'Read the clock.',narration:'Time is how long the complete journey takes. Match the distance with the same time interval.'},
 {name:'Choose the unknown',pose:'think',caption:'What is missing?',narration:'Cover the quantity you need to calculate in the formula triangle. Distance equals speed multiplied by time.'},
 {name:'Show the calculation',pose:'point-down',caption:'Use the correct units.',narration:'To find average speed, divide the total distance by the total time. To find distance, multiply speed by time. To find time, divide distance by speed.'},
 {name:'Check the answer',pose:'celebrate',caption:'Does the journey fit?',narration:'Check the units and put the result back into the formula. The three quantities must agree.'}
];
function pFor(id){return C.presets[id||C.preset];}
function fmt(n){return Number(Number(n).toFixed(3)).toString();}
function emit(type,obj){N.events.emit(type,{engine:ID,...obj});}
function value(p,t){return t==='speed'?p.distance/p.time:t==='time'?p.time:p.distance;}
function units(t){return t==='speed'?'km/h':t==='distance'?'km':'h';}
function label(t){return t==='speed'?'SPEED':t==='time'?'TIME':'DISTANCE';}
function chalk(svg,x,y,text,role='given',size=25){return N.chalkText(svg,x,y,String(text),{role,size});}
function card(title,big,desc,role='given'){return N.neonCard([H('p',{class:'f610-card-label',text:title}),H('p',{class:'f610-card-number',text:big}),H('p',{class:'f610-card-desc',text:desc})],{role});}
function dims(mob){return mob?{mob:true,w:480,h:1250,head:48,trackX:57,trackW:365,trackY:650,tickY:1040,triX:244,triTop:191,triH:248,returnX:77,returnY:330,chipY:1030,insY:1180}:
 {mob:false,w:1120,h:1045,head:61,trackX:105,trackW:545,trackY:435,tickY:820,triX:869,triTop:238,triH:250,returnX:888,returnY:821,chipY:655,insY:987};}
function makeSVG(stage,p,o={}){
 const mob=window.innerWidth<=1000,g=dims(mob),mode=o.mode||'watch',step=o.step??6,solved=!!o.solved,challenge=mode==='challenge',target=challenge?p.target:(o.cover||p.target),cover=o.cover||p.target,progress=Math.min(1,Math.max(0,o.progress??(step===0?0:step===1?.68:1))),show=(v)=>!challenge||solved||p.target!==v;
 stage.innerHTML='';N.cap(stage,ID,challenge?'SOLVE THE UNKNOWN':mode==='explore'?'EXPLORE THE JOURNEY':'THE SPEED–DISTANCE–TIME CONNECTION');
 const layout=H('div',{class:'f610-layout'}),art=H('div',{class:'f610-art'}),aside=H('aside',{class:'f610-aside','aria-label':'Journey evidence'});
 const svg=N.svg.root(g.w,g.h,'Neon journey track with movable car, labelled time number line and speed-distance-time formula triangle.');svg.classList.add('f610-svg');svg.dataset.mode=mode;svg.dataset.preset=o.id||C.preset;svg.dataset.progress=fmt(progress);svg.dataset.cover=cover;
 chalk(svg,g.w/2,g.head,challenge?'FIND THE MISSING QUANTITY':'ONE JOURNEY · THREE QUANTITIES','given',mob?30:41);
 chalk(svg,g.w/2,g.head+52,'DISTANCE = SPEED × TIME','focus',mob?22:29);
 // The geometry follows the house NEON primitives; labels use genuine NOVA chalk text.
 const cx=g.triX,ty=g.triTop,h=g.triH,tri=`M ${cx} ${ty} L ${cx-136} ${ty+h} L ${cx+136} ${ty+h} Z`;
 chalk(svg,cx,ty-34,'FORMULA TRIANGLE','given',mob?23:29);
 N.neonPath(svg,tri,{role:'given',width:3.1});N.neonLine(svg,cx-75,ty+114,cx+75,ty+114,{role:'op',width:2.2});N.neonLine(svg,cx,ty+114,cx,ty+h-5,{role:'op',width:2.2});
 const points={distance:[cx,ty+84],speed:[cx-60,ty+199],time:[cx+60,ty+199]};
 const mask=function(k){return cover===k&&(challenge&&!solved||mode==='explore');};
 ['distance','speed','time'].forEach(k=>{
  const [xx,yy]=points[k];if(mask(k)){N.neonRing(svg,xx,yy-11,{role:'focus',r:27,pulse:false});chalk(svg,xx,yy,'?','focus',38);}else chalk(svg,xx,yy,k==='distance'?'D':k==='speed'?'S':'T',k==='distance'?'result':k==='speed'?'given':'op',36);
 });
 const hintY=ty+h+43;
 chalk(svg,cx,hintY,cover==='distance'?'D = S × T':cover==='speed'?'S = D ÷ T':'T = D ÷ S','focus',mob?26:30);
 // NEON distance route and clear spatial progression.
 const x0=g.trackX,x1=x0+g.trackW,yy=g.trackY,carX=x0+progress*g.trackW;
 chalk(svg,x0+g.trackW/2,yy-(mob?127:148),challenge?'MEASURE THE JOURNEY':'THE JOURNEY TRACK','given',mob?25:32);
 N.neonBox(svg,x0-13,yy-68,g.trackW+26,112,{role:'given',r:18});
 N.neonLine(svg,x0,yy,x1,yy,{role:'given',width:4});
 if(progress>0)N.neonLine(svg,x0,yy,carX,yy,{role:'result',width:5});
 N.neonRing(svg,x0,yy,{role:'op',r:11,pulse:false});N.neonRing(svg,x1,yy,{role:'result',r:11,pulse:false});
 chalk(svg,x0+21,yy+79,'START','given',mob?22:24);
 chalk(svg,x1-18,yy+79,'FINISH','result',mob?22:24);
 // Genuine meaningful progress ring (not a star-shaped positional glyph).
 // Leg checkpoints model a whole journey; Y9 journeys have different gradients per leg.
 if(p.legs.length>1){let dist=0;p.legs.slice(0,-1).forEach((leg,i)=>{dist+=leg.d;const xx=x0+dist/p.distance*g.trackW;N.neonRing(svg,xx,yy,{role:'op',r:9,pulse:false});chalk(svg,xx,yy-83,mob?`L${i+1}`:`LEG ${i+1}`,'op',mob?22:21);});}
 // The active position marker is drawn last so checkpoint rings cannot intercept pointer input.
 let car=E('g',{class:'f610-car'+(mode==='explore'?' f610-drag':''),'data-car':'1',role:mode==='explore'?'button':null,tabindex:mode==='explore'?0:null,'aria-label':mode==='explore'?'Drag the journey marker to a progress stop. Use left and right arrows; Delete resets.':'Position on journey'},svg);
 N.neonRing(car,carX,yy,{role:'focus',r:22,pulse:false});N.neonRing(car,carX,yy,{role:'given',r:6,pulse:false});

 const covered=p.distance*progress,elapsed=p.time*(p.legs.length>1?(function(){let remaining=covered,t=0;for(const leg of p.legs){const share=Math.min(remaining,leg.d);t+=share/leg.d*leg.t;remaining-=share;if(remaining<=.00001)break;}return t/p.time;})():progress);
 const dataX=x0+g.trackW/2;
 chalk(svg,dataX,yy+144,challenge&&!solved&&p.target==='distance'?'DISTANCE · ? km':`DISTANCE · ${fmt(covered)} km`, 'result',mob?22:26);
 // Time numberline must be F0 primitive. For unknown time it has proportional stages not answer-revealing hour labels.
 const timeMax=challenge&&!solved&&p.target==='time'?1:p.time;
 const majors=timeMax===1?.25:timeMax===1.5?.5:timeMax===2.5?.5:timeMax===3?.5:1;
 chalk(svg,dataX,g.tickY-87,challenge&&!solved&&p.target==='time'?'TIME PROGRESS (FRACTION)':'TIME ELAPSED IN HOURS','given',mob?22:27);
 N.numberLine(svg,{x:x0,y:g.tickY,w:g.trackW,min:0,max:timeMax,major:majors,minor:0,labelSize:mob?22:21,arrows:true});
 // The timeline is honest: progress marker is the time of the actual journey, not distance fraction.
 const fractionTime=p.time?elapsed/p.time:0;
 N.neonRing(svg,x0+fractionTime*g.trackW,g.tickY,{role:'focus',r:12,pulse:false});
 chalk(svg,dataX,g.tickY+78,challenge&&!solved&&p.target==='time'?'FIND THE TOTAL HOURS':`ELAPSED · ${fmt(elapsed)} h`,'op',mob?22:25);
 if(mode==='explore'){
  // Drag help is visible in the accessible Explore instructions below the SVG.
  const zones=[0,.25,.5,.75,1].map((v,i)=>({id:String(v),kind:'drop',x:x0+v*g.trackW-23,y:yy+145,w:46,h:64}));
  zones.forEach((z,i)=>{const px=x0+(i/4)*g.trackW;N.neonRing(svg,px,yy+172,{role:Math.abs(i/4-progress)<.01?'result':'unknown',r:11,pulse:false});chalk(svg,px,yy+216,`${i*25}%`,'focus',mob?22:19);});
  N.neonBox(svg,g.returnX-76,g.returnY-29,152,58,{role:'error',r:12});chalk(svg,g.returnX,g.returnY+9,'RETURN','error',24);
  zones.push({id:'return',kind:'remove',x:g.returnX-76,y:g.returnY-29,w:152,h:58});
  car.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();o.onProgress(Math.max(0,Math.min(1,Math.round(progress*4+(e.key==='ArrowRight'?1:-1))/4)));}if(e.key==='Delete'||e.key==='Escape'){e.preventDefault();o.onReset();}});
  N.ui.svgDrag(svg,car,{box:{x:carX-26,y:yy-26,w:52,h:52},zones:()=>zones,onDrop:id=>{const v=Number(id);if(Number.isFinite(v)){Promise.resolve().then(()=>o.onProgress(v));return true;}return false;},onRemove:()=>o.onReset()});
  // Second, independent draggable object: unknown cover, with honest triangle slots and red return zone.
  const selection=E('g',{class:'f610-drag f610-cover','data-cover':'1',role:'button',tabindex:0,'aria-label':'Move unknown cover to D, S or T on the formula triangle. Left and right arrows choose. Delete removes the cover.'},svg);
  const coverX=mob?408:727,coverY=mob?330:572;
  N.neonRing(selection,coverX,coverY,{role:'focus',r:24,pulse:false});chalk(selection,coverX,coverY+11,'?','focus',31);
  ['distance','speed','time'].forEach((k,i)=>{let [px,py]=points[k];N.neonRing(svg,px,py-11,{role:k===cover?'result':'unknown',r:29,pulse:false});});
  selection.addEventListener('keydown',e=>{let names=['distance','speed','time'],ix=names.indexOf(cover);if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();o.onCover(names[(ix+(e.key==='ArrowRight'?1:2))%3]);}if(e.key==='Delete'||e.key==='Escape'){e.preventDefault();o.onCover(p.target);}});
  const z2=['distance','speed','time'].map(k=>({id:k,kind:'drop',x:points[k][0]-35,y:points[k][1]-50,w:70,h:70}));z2.push({id:'remove',kind:'remove',x:g.returnX-76,y:g.returnY-29,w:152,h:58});
  N.ui.svgDrag(svg,selection,{box:{x:coverX-26,y:coverY-26,w:52,h:52},zones:()=>z2,onDrop:k=>{if(points[k]){Promise.resolve().then(()=>o.onCover(k));return true;}return false;},onRemove:()=>o.onCover(p.target)});
 }
 chalk(svg,g.w/2,g.insY,challenge&&!solved?'CHOOSE THE FORMULA AND SHOW YOUR UNITS':'THE THREE QUANTITIES MUST AGREE','focus',mob?22:25);
 const key=t=>show(t)?fmt(value(p,t))+' '+units(t):'? '+units(t);
 aside.append(card('DISTANCE · D',key('distance'),'Total route travelled, in kilometres.','result'),card('SPEED · S',key('speed'),'Average distance per hour.','given'),card('TIME · T',key('time'),'Duration of the complete route.','op'),card('RELATIONSHIP',cover==='distance'?'D = S × T':cover==='time'?'T = D ÷ S':'S = D ÷ T','Use the same journey interval each time.','focus'));
 layout.append(art,aside);art.append(svg);stage.append(layout);N.scene.helperStrip(stage,o.pose||'checking',o.caption||'Match the distance with the time.');return {svg,car,progress,g,carX,x0};
}
function teach(i,stage){const p=pFor();const r=makeSVG(stage,p,{mode:'watch',step:i,progress:i===0?0:i===1?.7:1,cover:i<=3?'speed':p.target,pose:STEPS[i].pose,caption:STEPS[i].caption});
 if(i===1&&!N.reducedMotion()){
  // NOVA.motion timeline, with reduced-motion instant fallback and stale-DOM guard.
  const car=r.car,svg=r.svg;
  M.tween(720,t=>{if(!car.isConnected)return;const dx=(1-.7)*r.g.trackW*t;car.setAttribute('transform',`translate(${dx.toFixed(2)},0)`);},M.ease.inOut);
 }
 if(i===6)M.flash(r.svg,r.g.triX,r.g.triTop+85,'result',38);
 emit('step',{preset:C.preset,index:i,name:STEPS[i].name});}
function btn(t,fn,cls='nova-btn'){return H('button',{class:cls,text:t,onclick:fn});}
function explore(panel,stage){let id=C.preset,progress=.5,cover=pFor(id).target,message='Drag the journey marker to a percentage stop, then select the unknown in the formula triangle.';
 const sel=H('select',{'aria-label':'Journey preset'});Object.entries(C.presets).forEach(([k,v])=>sel.append(H('option',{value:k,text:v.label})));sel.value=id;
 const tools=H('div',{class:'f610-controls'}),fb=H('p',{class:'f610-feedback','aria-live':'polite'});
 tools.append(H('label',{class:'f610-choice'},['Choose journey',sel]),btn('Check formula',check,'nova-btn primary'),btn('Hint',hint),btn('Reset',reset));
 panel.append(tools,H('p',{class:'f610-info',text:'Drag the position ring to a journey stop. Drag the ? ring to D, S or T. Keyboard: Left/Right on each ring; Delete returns it.'}),fb);
 function paint(pose='checking',caption='Notice what changes.') {makeSVG(stage,pFor(id),{mode:'explore',id,progress,cover,onProgress:setProgress,onCover:setCover,onReset:reset,pose,caption});fb.textContent=message;}
 function setProgress(v){if(v<0||v>1)return;progress=v;message='Position '+fmt(progress*100)+'% of the route. The distance and elapsed time move together.';emit('value',{preset:id,progress,distance:fmt(pFor(id).distance*progress)});paint('count','Follow the route.');}
 function setCover(v){if(!['distance','speed','time'].includes(v))return;cover=v;message='Cover '+label(v)+'. '+(v==='distance'?'Multiply speed by time.':v==='time'?'Divide distance by speed.':'Divide distance by time.');emit('value',{preset:id,cover:v});paint('point-down','Choose the right calculation.');}
 function reset(){progress=.5;cover=pFor(id).target;message='Both markers have returned to their starting values.';paint('explain','Start with the givens.');}
 function check(){const correct=cover===pFor(id).target;message=correct?'Correct. '+label(cover)+' is missing. Use '+(cover==='distance'?'S × T.':cover==='speed'?'D ÷ T.':'D ÷ S.'): 'That covers a different quantity. Choose the value asked for in this journey.';fb.classList.toggle('good',correct);fb.classList.toggle('bad',!correct);emit('correct',{preset:id,correct});paint(correct?'celebrate':'not-yet',correct?'Well chosen!':'Find the unknown.');}
 function hint(){message='Distance equals speed multiplied by time. Cover the unknown, then choose the matching calculation.';emit('hintUsed',{preset:id});paint('point','Use the formula triangle.');}
 sel.onchange=()=>{id=sel.value;C.preset=id;progress=.5;cover=pFor(id).target;message=pFor(id).context;paint('explain','A different journey.');};
 C._explore={get:()=>({id,progress,cover,message}),setProgress,setCover,reset,check,hint,setPreset:v=>{sel.value=v;sel.onchange();}};paint();}
function challenge(panel,api,stage){const ids=Object.keys(C.presets);let index=0,solved=false,correctCount=0,attempts=0;
 const question=H('p',{class:'f610-question'}),inputs=H('div',{class:'f610-inputs'}),numeric=H('input',{type:'text',inputmode:'decimal',placeholder:'Enter your answer','aria-label':'Numeric answer'}),unitSelect=H('select',{'aria-label':'Unit of the answer'});
 ['km/h','km','h','m/s','min'].forEach(v=>unitSelect.append(H('option',{text:v,value:v})));
 inputs.append(H('label',{class:'f610-field'},[H('span',{text:'YOUR ANSWER'}),numeric]),H('label',{class:'f610-field'},[H('span',{text:'UNIT'}),unitSelect]));
 const controls=H('div',{class:'f610-controls'}),checkBtn=btn('Check answer',check,'nova-btn primary'),hintBtn=btn('Hint',hint),nextBtn=btn('Next journey',next);nextBtn.disabled=true;controls.append(checkBtn,hintBtn,nextBtn);
 const fb=H('p',{class:'f610-feedback','aria-live':'polite'}),count=H('p',{class:'f610-progress'});panel.append(question,inputs,controls,fb,count);
 function current(){return C.presets[ids[index]];}
 function paint(){const p=current();question.textContent=`Journey ${index+1} of ${ids.length}. ${p.context} Enter the missing ${p.target} and its correct unit.`;count.textContent='Journeys solved: '+correctCount+' / '+ids.length;makeSVG(stage,p,{mode:'challenge',id:ids[index],cover:p.target,progress:solved?1:.6,solved,pose:solved?'celebrate':'think',caption:solved?'You used the correct formula.':'Use the givens and units.'});}
 function parse(){const s=numeric.value.trim().replace(',','.');return s&&Number.isFinite(Number(s))?Number(s):null;}
 function check(){if(solved)return;attempts++;const p=current(),val=parse(),u=unitSelect.value,exp=value(p,p.target),rightUnit=units(p.target);let ok=false,msg='';
 if(val===null)msg='Enter a number to complete this calculation.';
 else if(u!==rightUnit)msg='Check the unit. '+label(p.target)+' is measured in '+rightUnit+'.';
 else if(Math.abs(val-exp)<=.005){ok=true;msg='Correct! '+(p.target==='speed'?fmt(p.distance)+' ÷ '+fmt(p.time):p.target==='time'?fmt(p.distance)+' ÷ '+fmt(p.distance/p.time):fmt(p.distance/p.time)+' × '+fmt(p.time))+' = '+fmt(exp)+' '+rightUnit+'.';}
 else if(p.target==='speed'&&Math.abs(val-p.time/p.distance)<=.01)msg='The division is reversed. Speed is distance divided by time, not time divided by distance.';
 else if(p.target==='speed'&&Math.abs(val-p.distance*p.time)<=.01)msg='That is multiplication. To find speed, divide distance by the same journey time.';
 else if(p.target==='time'&&Math.abs(val-p.distance*(p.distance/p.time))<=.01)msg='You multiplied instead of dividing. Time is distance divided by speed.';
 else if(p.target==='distance'&&Math.abs(val-(p.distance/p.time)/p.time)<=.01)msg='You divided. Distance is speed multiplied by time.';
 else msg='Not yet: cover '+label(p.target)+' in the formula triangle, then calculate using the given quantities.';
 api.check(ok,msg,{preset:ids[index],target:p.target,attempt:val,unit:u});fb.textContent=msg;fb.classList.toggle('good',ok);fb.classList.toggle('bad',!ok);emit('correct',{preset:ids[index],correct:ok,value:val,unit:u});if(ok){solved=true;correctCount++;checkBtn.disabled=true;nextBtn.disabled=false;paint();M.flash(stage.querySelector('svg'),240,240,'result',40);}}
 function hint(){const p=current();const msg=p.target==='speed'?'Speed = distance ÷ time.':p.target==='distance'?'Distance = speed × time.':'Time = distance ÷ speed.';api.hint(msg);fb.textContent=msg;emit('hintUsed',{preset:ids[index]});}
 function next(){if(!solved)return;if(index>=ids.length-1){question.textContent='All journeys completed!';inputs.hidden=true;controls.hidden=true;stage.innerHTML='';N.cap(stage,ID,'SPEED · DISTANCE · TIME COMPLETE');N.scene.helperStrip(stage,'celebrate','Your units and calculations match.');fb.textContent='Brilliant! You matched each unknown to its correct relationship.';return;}index++;solved=false;numeric.value='';unitSelect.value=units(current().target);checkBtn.disabled=false;nextBtn.disabled=true;fb.textContent='';paint();}
 numeric.addEventListener('keydown',e=>{if(e.key==='Enter')check();});unitSelect.value=units(current().target);
 C._challenge={get:()=>({index,solved,correctCount,attempts,feedback:fb.textContent}),setAnswers:(v,u)=>{numeric.value=String(v);unitSelect.value=u;},check,hint,next};paint();}
const DEF={id:ID,title:'Speed–Distance–Time',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'Neon journey track with moving position ring, a core NOVA time number line and a labelled speed-distance-time formula triangle. Drag the journey ring and unknown cover in Explore.',
 staticAlt:'Speed = total distance divided by total time. Distance = speed times time. Time = distance divided by speed. Use km, h and km/h appropriately. A full journey can have legs with different speeds but only one average speed.',
 spec:{purpose:'Link distance, elapsed time and average speed through a moving journey and formula triangle.',params:'Total kilometres, hours, journey segments, target unknown D/S/T, timeline position, units.',presets:'Y8-041 speed; Y9-016 whole-journey average; Y9-022 distance; Y9-022 time.',steps:'See journey → watch movement → read distance → read time → cover unknown → calculate → verify.',interactions:'Drag the neon position ring between journey progress stops and drag the unknown cover onto D/S/T; red return tray, keyboard arrows and Delete, four task Challenge.',traps:'Swapped division, multiplying instead of dividing, not using whole journey, confusing speed/time/distance units.',gcse:'Compound measures, multiple-leg journeys, average speed, multi-step speed calculations.'}};
N.bankMount({id:ID,num:'F6·10',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 8 and 9; GCSE compound measures',linked:['F0-02','F0-03','F0-04','F6-02','F6-09','F18-08']});
})();
