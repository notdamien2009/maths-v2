/* F16-03 · Line Graph — teaching-specific scene on the unchanged, audited NOVA shared runtime. */
(function(){'use strict';
const H=NOVA.h, S=NOVA.svg, E=S.el, MOT=NOVA.motion, ID='F16-03';
const CFG=window.NovaV2Integration.configuration(window.NOVA_F16_03_CONFIG={
 preset:'temperature',events:['value','step','mode','hintUsed','correct'],
 presets:{
  temperature:{label:'Y7-072 · Line graphs and trends',title:'Temperature across the day',unit:'°C',measure:'Temperature (°C)',timeUnit:'hour',times:[8,10,12,14,16,18],values:[6,10,15,14,12,8],max:18,crop:6,step:3,context:'An outdoor sensor recorded the temperature every two hours.',trend:'Temperature climbs until midday, then falls.'},
  misleading:{label:'Y7-071 · Misleading graphs',title:'Daily library visits',unit:'visits',measure:'Number of visits',timeUnit:'day',times:[1,2,3,4,5,6],labels:['Mon','Tue','Wed','Thu','Fri','Sat'],values:[11,12,13,12,14,15],max:18,crop:10,step:3,context:'The library counted visitors at equally spaced daily observations.',trend:'Visits generally rise, with one dip on Thursday.'}
 },_explore:null,_challenge:null
});
const STEPS=[
 {name:'Read the source observations',pose:'explain',narration:'We begin with measurements taken at equal time intervals. Each pair records a time and a measured value.',prompt:'Which quantity changes over time?'},
 {name:'Read both axes and the units',pose:'ruler',narration:'Time runs from left to right, with equal spacing. The measured quantity uses equally spaced values on the vertical axis.',prompt:'Which axis carries time, and which carries the measurement?'},
 {name:'Plot the first measured point',pose:'point-down',narration:'Go along to the first time, then up to its recorded value. Mark the exact intersection.',prompt:'How do both coordinates locate one observation?'},
 {name:'Plot the next point and join',pose:'count',narration:'Plot the second observation at its own time, then join the two readings with a straight line.',prompt:'Between these two observations, did the value rise or fall?'},
 {name:'Follow the third observation',pose:'point-right',narration:'The third point creates another line segment. Its steepness shows the rate of change between readings.',prompt:'Which interval so far has the greatest change?'},
 {name:'Trace the fourth observation',pose:'compare',narration:'A new segment can rise, fall, or stay level. Reading the numbers matters more than the angle alone.',prompt:'Does the latest segment slope upward or downward?'},
 {name:'Connect every observed reading',pose:'magnify',narration:'Complete the series using real readings. A line graph connects measurements in their actual time order.',prompt:'Where is the highest observed point?'},
 {name:'Identify the turning point',pose:'idea',narration:'The glowing marker identifies the highest observation. Trace the overall pattern from the first to the last time.',prompt:'When is the maximum, and does the series always rise?'},
 {name:'Interpret the trend and scale',pose:'compare',narration:'Check the marked intervals and the labels. Cropping an axis changes the visual steepness but not the observations themselves.',prompt:'Would a cropped axis change any actual data values?'}
];
const current=()=>CFG.presets[CFG.preset];
const pointState=()=>({values:current().values.slice(),baseline:0,selected:2});
let exploreState=pointState(), challengeState=pointState();
function emit(key,value){NOVA.events.emit('value',{engine:ID,key:key,control:key,value:value});}
function say(svg,x,y,value,role,size,anchor){return NOVA.chalkText(svg,x,y,String(value),{role:role||'given',size:size||23,anchor:anchor||'middle'});}
function tile(parent,x,y,w,h,text,role,size){const b=NOVA.neonBox(parent,x,y,w,h,{role:role||'given'});if(text!==undefined)say(parent,x+w/2,y+h/2+6,text,role||'given',size||20);return b;}
function layout(){return innerWidth<=540?
 {mobile:true,W:450,H:752,x:67,y:173,w:344,h:374,foot:547,tip:21,tick:21,marker:10,strip:612}:
 {mobile:false,W:770,H:650,x:112,y:137,w:555,h:363,foot:522,tip:23,tick:22,marker:12,strip:555};}
const timeLabel=(d,i)=>d.labels?d.labels[i]:d.times[i]+':00';
const fmt=(d,v)=>v+' '+d.unit;
function stepY(d,baseline){return baseline===0?d.step:2;}
function scene(stage,options){
if(window.NovaLessonComponent?.active){[stage,options]=window.NovaLessonComponent.args("scene",arguments);}
options=options||{};const data=options.data||current(),state=options.state||pointState();const a=layout();stage.innerHTML='';
 const phase=options.phase===undefined?8:options.phase;
 const baseline=state.baseline||0,drawCount=options.interactive?data.times.length:(phase<=1?0:phase===6||phase>=7?6:phase-1);
 const sv=S.root(a.W,a.H,'Line graph for '+data.title+'. Time horizontal; '+data.measure+' vertical. Source values: '+state.values.join(', ')+'. Graph minimum '+baseline+'.');
 sv.classList.add('f16l-plot');sv.setAttribute('role','img');
 say(sv,a.W/2,43,data.title,'given',a.mobile?26:28);
 // Use the unmodified NOVA plot system as the only mathematical axis/data mapping.
 const frame=NOVA.neonPlot(sv,{x0:a.x,y0:a.y,w:a.w,h:a.h,x:[data.times[0],data.times[5]],y:[baseline,data.max],xStep:data.times[1]-data.times[0],yStep:stepY(data,baseline),grid:true});
 frame.g.classList.add('f16l-core-plot');
 const X=v=>frame.X(v),Y=v=>frame.Y(v);
 // Approved NOVA primitives provide the visible luminous frame, reference guides and plotted graph.
 const major=stepY(data,baseline);
 for(let val=baseline;val<=data.max+.01;val+=major){const yy=Y(val);let g=NOVA.neonLine(sv,a.x,yy,a.x+a.w,yy,{role:val===baseline?'given':'support',width:val===baseline?3:1.5});g.style.opacity=val===baseline?'1':'.24';
  say(sv,a.x-19,yy+6,val,'given',a.tick,'end');}
 NOVA.neonLine(sv,a.x,a.y-6,a.x,a.y+a.h+6,{role:'given',width:3.5});
 for(let i=0;i<6;i++){const x=X(data.times[i]);const g=NOVA.neonLine(sv,x,a.y+2,x,a.y+a.h,{role:'support',width:1.2});g.style.opacity='.13';
  say(sv,x,a.foot+(a.mobile&&(i===0||i===5)?18:0),timeLabel(data,i),'given',a.mobile?21:23);}
 say(sv,a.x,a.y-27,data.measure,'support',a.mobile?19:20,'start');
 say(sv,a.x+a.w/2,a.mobile?582:550,data.timeUnit==='day'?'Day':'Time of day','support',a.mobile?21:23);
 if(phase===0){ // Source cards before any points: no answer line is leaked.
  const cardY=a.mobile?[246,339,432]:[243,355], cw=a.mobile?111:167,ch=a.mobile?75:93;
  for(let i=0;i<6;i++){const col=i%3,row=Math.floor(i/3),cx=a.mobile?120+col*111:214+col*178,cy=cardY[row];
   NOVA.neonBox(sv,cx-cw/2,cy-ch/2,cw,ch,{role:['given','focus','op','result','given','focus'][i]});
   say(sv,cx,cy-10,timeLabel(data,i),'given',a.mobile?20:23);
   say(sv,cx,cy+22,fmt(data,state.values[i]),'result',a.mobile?20:24);
  }
 } else if(phase===1){
  tile(sv,a.mobile?103:225,a.mobile?286:269,a.mobile?278:322,80,'Time →   Value ↑','focus',a.mobile?24:29);
  say(sv,a.W/2,a.mobile?418:409,'Equal intervals on each axis','result',a.mobile?23:27);
 }
 // A luminous continuous path through the real points, never invented intermediate observations.
 if(drawCount>1){const points=state.values.slice(0,drawCount).map((v,i)=>[X(data.times[i]),Y(Math.max(baseline,Math.min(data.max,v)))]);
  const p='M'+points.map((pt,i)=>(i?'L':'')+pt[0].toFixed(2)+','+pt[1].toFixed(2)).join(' ');
  const line=NOVA.neonPath(sv,p,{role:'focus',width:5.2});line.setAttribute('data-line','observations');line.style.pointerEvents='none';
  if(options.animate&&!options.interactive&&drawCount>1){line.style.opacity='.25';MOT.tween(580,t=>{if(line.isConnected)line.style.opacity=String(.25+.75*t)},MOT.ease.out);}
 }
 for(let i=0;i<drawCount;i++){
  const x=X(data.times[i]),value=state.values[i],y=Y(Math.max(baseline,Math.min(data.max,value)));
  if(value<baseline){say(sv,x,a.y+a.h-12,'Below scale','error',20);continue;}
  // Faint guide from the exact coordinate to the horizontal axis; same approved shared primitive.
  if(options.interactive&&state.selected===i){let guide=NOVA.neonLine(sv,x,y,x,a.y+a.h,{role:'support',width:2.3});guide.style.opacity='.46';}
  if(options.interactive){
   const grip=E('g',{'data-point-handle':String(i),'data-time':String(data.times[i]),role:'button',tabindex:'0','aria-label':'Adjust reading at '+timeLabel(data,i)+', currently '+fmt(data,value)+'. Up and down arrows change one unit.'},sv);
   NOVA.neonRing(grip,x,y,{role:i===state.selected?'result':'focus',r:a.marker+2,pulse:false});
   // A luminous mini number capsule follows the point without obscuring adjacent points.
   const laby=y<230?y+41:y-27;
   if(i===state.selected){tile(grip,x-25,laby-18,50,28,String(value),'result',a.mobile?20:23);}
   const zones=[];
   for(let n=baseline;n<=data.max;n++){const yy=Y(n),half=a.h/(data.max-baseline)/2+0.25;zones.push({x:x-34,y:yy-half,w:68,h:half*2,id:'reading:'+n,kind:'drop'});}
   NOVA.ui.svgDrag(sv,grip,{box:{x:x-19,y:y-19,w:38,h:38},zones:()=>zones,onDrop:id=>{
     const n=Number(id.split(':')[1]);if(!Number.isInteger(n)||n<baseline||n>data.max)return false;
     state.values[i]=n;state.selected=i;emit('point:'+i,{time:data.times[i],value:n});
     if(options.onUpdate)options.onUpdate(i);return true;
   }});
   // The approved drag runtime reparents the lifted SVG node. Recapture the real pointer on its new parent.
   grip.addEventListener('pointerdown',e=>{try{grip.setPointerCapture(e.pointerId)}catch(_){} });
   grip.addEventListener('keydown',e=>{
     let n=null;if(e.key==='ArrowUp'||e.key==='ArrowRight')n=Math.min(data.max,state.values[i]+1);
     if(e.key==='ArrowDown'||e.key==='ArrowLeft')n=Math.max(baseline,state.values[i]-1);
     if(e.key==='Home')n=baseline;if(e.key==='End')n=data.max;
     if(n===null)return;e.preventDefault();state.values[i]=n;state.selected=i;emit('point:'+i,{time:data.times[i],value:n});options.onUpdate&&options.onUpdate(i);
   });
  }else{
   NOVA.neonRing(sv,x,y,{role:'focus',r:a.marker,pulse:false});
   if(phase===2||i===drawCount-1){say(sv,x,y<220?y+37:y-27,value,'result',a.mobile?24:27);}
  }
 }
 if(phase>=7&&!options.interactive){const top=Math.max(...state.values),i=state.values.indexOf(top);const yy=Y(top);
  NOVA.neonRing(sv,X(data.times[i]),yy,{role:'result',r:a.marker+10,pulse:true});
  if(phase>=7){tile(sv,a.mobile?135:275,a.mobile?609:569,a.mobile?181:225,45,'Peak: '+timeLabel(data,i),'result',a.mobile?20:22);}
 }
 if(options.interactive){const idx=state.selected;
  tile(sv,a.mobile?65:232,a.mobile?624:571,a.mobile?320:310,a.mobile?49:43,'Selected: '+timeLabel(data,idx)+'  ·  '+fmt(data,state.values[idx]),'result',a.mobile?20:22);
  say(sv,a.W/2,a.mobile?704:630,'Drag a glowing reading up or down','support',a.mobile?20:22);
 } else if(phase===8){say(sv,a.W/2,a.mobile?700:637,data.trend,'result',a.mobile?20:22);}
 // Cropping is disclosed next to the graph; never imply the data values are altered by axis magnification.
 if(baseline>0){tile(sv,a.mobile?87:265,a.mobile?86:66,a.mobile?276:270,40,'Axis cropped at '+baseline,'error',a.mobile?20:20);}
 stage.appendChild(sv);
 if(phase===0){const strip=H('div',{class:'f16l-values'});strip.appendChild(NOVA.neonTile('Six measured observations',{role:'given'}));stage.appendChild(strip);}
 if(phase===8||options.interactive){const start=state.values[0],end=state.values.at(-1),delta=end-start;
  const strip=H('div',{class:'f16l-values'});strip.appendChild(NOVA.neonTile('Start '+fmt(data,start),{role:'given'}));strip.appendChild(NOVA.neonTile('End '+fmt(data,end),{role:'result'}));strip.appendChild(NOVA.neonTile('Overall change '+(delta>0?'+':'')+delta,{role:delta>=0?'result':'op'}));stage.appendChild(strip);}
 NOVA.scene.helperStrip(stage,options.pose||'compare',options.speech||'Read the time, then follow the measurement up to its exact value.');
 return sv;
}
function watch(index,stage){const d=current(),s=pointState();let i=Math.max(0,Math.min(STEPS.length-1,index));
 const narrations=[
  'Look at the source pairs. These are measured readings, not separate bar categories.',
  'The horizontal axis shows '+(d.timeUnit==='day'?'days':'hours')+'. The vertical axis shows '+d.measure+'.',
  'At '+timeLabel(d,0)+' the recorded value is '+fmt(d,s.values[0])+'.',
  'At '+timeLabel(d,1)+' it is '+fmt(d,s.values[1])+'. Join these measured values.',
  'At '+timeLabel(d,2)+' it is '+fmt(d,s.values[2])+'. Compare the slopes.',
  'At '+timeLabel(d,3)+' it is '+fmt(d,s.values[3])+'. It is still one continuous timeline.',
  'Now add the last two observations and follow the completed graph.',
  'The brightest ring marks the highest observed reading. Read the time at that point.',
  'A graph can zoom into a range without changing its measurements. Check the axis labels.'
 ];scene(stage,{data:d,state:s,phase:i,pose:STEPS[i].pose,speech:narrations[i],animate:i>=2&&i<=6});}
function choose(field,options){const s=H('select',{class:'nova-input','aria-label':field});for(const [value,text] of options)s.appendChild(H('option',{value:String(value),text}));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();exploreState=pointState();window.NovaLessonComponent?.applyExploreModels();const preset=choose('Lesson context',Object.entries(CFG.presets).map(([k,p])=>[k,p.label]));window.NovaLessonComponent?.applyExploreModels();preset.value=CFG.preset;
 window.NovaLessonComponent?.applyExploreModels();const crop=choose('Vertical axis view',[[0,'Full scale · Start at zero'],[current().crop,'Zoom view · Start at '+current().crop]]);
 window.NovaLessonComponent?.applyExploreModels();const pick=choose('Choose a reading',current().times.map((v,i)=>[i,timeLabel(current(),i)]));window.NovaLessonComponent?.applyExploreModels();pick.value='2';
 window.NovaLessonComponent?.applyExploreModels();const value=H('input',{class:'nova-input',type:'number',min:0,max:current().max,step:1,'aria-label':'Set selected measured value'});
 window.NovaLessonComponent?.applyExploreModels();const status=H('p',{class:'f16l-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();const meta=H('p',{class:'f16l-hint',text:'Each point belongs to one fixed time. Drag vertically to a whole-number measurement. Use arrow keys or enter an exact value. Cropping the axis is a view change; the observed data stays the same.'});
 window.NovaLessonComponent?.applyExploreModels();function updateControls(){pick.innerHTML='';current().times.forEach((t,i)=>pick.appendChild(H('option',{value:i,text:timeLabel(current(),i)})));pick.value=String(exploreState.selected);value.max=String(current().max);value.min=String(exploreState.baseline);value.value=String(exploreState.values[exploreState.selected]);crop.innerHTML='';[[0,'Full scale · Start at zero'],[current().crop,'Zoom view · Start at '+current().crop]].forEach(([v,text])=>crop.appendChild(H('option',{value:v,text})));crop.value=String(exploreState.baseline);}
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){scene(stage,{data:current(),state:exploreState,phase:8,interactive:true,pose:exploreState.baseline?'think':'ruler',speech:exploreState.baseline?'The axis has been zoomed, but each measurement remains unchanged. Check the displayed minimum.':'Drag a reading straight up or down. Use equal unit spacing and compare the changing slopes.',onUpdate:paint});
  const d=current(),ys=exploreState.values,maximum=Math.max(...ys),minimum=Math.min(...ys);
  status.textContent='Readings: '+ys.join(' · ')+'  |  Highest: '+maximum+'  |  Lowest: '+minimum+'  |  Axis minimum: '+exploreState.baseline;
  pick.value=String(exploreState.selected);if(document.activeElement!==value)value.value=String(ys[exploreState.selected]);
  if(focus!==undefined)stage.querySelector('[data-point-handle="'+focus+'"]')?.focus({preventScroll:true});
 }
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{CFG.preset=preset.value;exploreState=pointState();updateControls();emit('preset',CFG.preset);paint()};
 window.NovaLessonComponent?.applyExploreModels();crop.onchange=()=>{const b=+crop.value;const low=Math.min(...exploreState.values);if(low<b){status.textContent='Some measurements fall below the requested zoom. Restore those values or use the full scale.';crop.value=String(exploreState.baseline);return;}exploreState.baseline=b;emit('baseline',b);updateControls();paint()};
 window.NovaLessonComponent?.applyExploreModels();pick.onchange=()=>{exploreState.selected=+pick.value;paint(exploreState.selected)};
 window.NovaLessonComponent?.applyExploreModels();function setVal(n){n=Number(n);if(!Number.isInteger(n)||n<exploreState.baseline||n>current().max){status.textContent='Choose a whole-number reading between '+exploreState.baseline+' and '+current().max+'.';return;}
  const i=exploreState.selected;exploreState.values[i]=n;emit('point:'+i,{time:current().times[i],value:n});paint(i);}
 window.NovaLessonComponent?.applyExploreModels();const controls=H('div',{class:'f16l-controls'},[
  H('label',{class:'f16l-label'},['Lesson context',preset]),H('label',{class:'f16l-label'},['Vertical axis view',crop]),
  H('label',{class:'f16l-label'},['Selected observation',pick]),H('label',{class:'f16l-label'},['Measurement',value]),
  H('button',{class:'nova-btn primary',text:'Set reading',onclick:()=>setVal(value.value)}),
  H('button',{class:'nova-btn',text:'Decrease −1',onclick:()=>setVal(exploreState.values[exploreState.selected]-1)}),
  H('button',{class:'nova-btn',text:'Increase +1',onclick:()=>setVal(exploreState.values[exploreState.selected]+1)}),
  H('button',{class:'nova-btn ghost',text:'Reset graph',onclick:()=>{exploreState=pointState();updateControls();paint()}})
 ]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(meta,controls,status);window.NovaLessonComponent?.applyExploreModels();updateControls();window.NovaLessonComponent?.applyExploreModels();paint();
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({values:exploreState.values.slice(),baseline:exploreState.baseline,selected:exploreState.selected}),setPreset:k=>{preset.value=k;preset.onchange()},setReading:(i,n)=>{exploreState.selected=i;setVal(n)},setCrop:v=>{crop.value=String(v);crop.onchange()}};
}
function challenge(panel,api,stage){const d=current();challengeState=pointState();const badIdx=2,real=d.values[badIdx];challengeState.values[badIdx]=Math.max(0,real-3);
 let currentIndex=0;const pick=choose('Choose plotted time',d.times.map((t,i)=>[i,timeLabel(d,i)]));pick.value=String(badIdx);
 const val=H('input',{class:'nova-input',type:'number',min:0,max:d.max,step:1,'aria-label':'Correct measured reading'});
 const tools=H('div',{class:'f16l-controls'},[H('label',{class:'f16l-label'},['Observation',pick]),H('label',{class:'f16l-label'},['Measured value',val]),H('button',{class:'nova-btn primary',text:'Plot this reading',onclick:()=>{
 const n=Number(val.value);if(currentIndex!==0||!Number.isInteger(n)||n<0||n>d.max)return;challengeState.selected=Number(pick.value);challengeState.values[challengeState.selected]=n;emit('challenge-point',{index:challengeState.selected,value:n});paint(0);}})]);
 panel.append(H('p',{class:'f16l-hint',text:'Correct an inaccurate plotted point, then interpret the trend and decide what a cropped axis really changes. Drag the glowing point for Task 1 or enter its precise reading.'}),tools);
 const differences=d.values.slice(1).map((v,i)=>v-d.values[i]);const largest=Math.max(...differences);const interval=differences.indexOf(largest);
 const pair=i=>timeLabel(d,i)+' to '+timeLabel(d,i+1);
 const choices=differences.map((v,i)=>({label:pair(i),value:i}));
 const tasks=[
 {q:'Source measurement: '+timeLabel(d,badIdx)+' = '+fmt(d,real)+'. The plotted marker is wrong. Move the marker (or use the inputs) to the correct measured value.',build:()=>()=>challengeState.values[badIdx],check:v=>{
 const ok=v===real;return[ok,ok?'Correct: '+timeLabel(d,badIdx)+' is plotted at '+fmt(d,real)+'.':v===real-1?'One unit below the observed reading. Count up one more interval.':v===real+1?'One unit above the observed reading. Check the scale.':'The value is '+fmt(d,real)+'. Read the stated source measurement, not the nearby line segment.'];},hint:'Move to the '+timeLabel(d,badIdx)+' column, then locate '+fmt(d,real)+' on the vertical axis.',solve:()=>{challengeState.selected=badIdx;challengeState.values[badIdx]=real;paint(0);}},
 {q:'Between which consecutive times does the measured quantity have its GREATEST increase?',build:NOVA.choiceTask(choices,ID),check:v=>{const ok=v!==null&&v!==undefined&&Number(v)===interval;return[ok,ok?'Correct. The change from '+pair(interval)+' is +'+largest+' '+d.unit+'.':v===null?'Select a time interval before checking.':Number(v)<0||Number(v)>4?'Select a consecutive pair of observation times.':'Compare the change in numbers, not the height of the right-hand endpoint. Compute the increase between each pair.'];},hint:'Subtract the earlier measurement from the later measurement for every consecutive pair.',solve:ctl=>{let b=ctl.querySelectorAll('button');b[interval]?.click();}},
 {q:'This graph now displays a labelled vertical axis beginning at '+d.crop+'. Which statement is accurate?',build:NOVA.choiceTask([
 {label:'The zoom can exaggerate the visual change, but the recorded values stay the same.',value:'zoom'},
 {label:'Every line graph must start its vertical axis at zero.',value:'zero'},
 {label:'The measured values each increase by '+d.crop+'.',value:'added'},
 {label:'Equal horizontal time spacing is no longer needed.',value:'spacing'} ],ID),check:v=>{const ok=v==='zoom';return[ok,ok?'Correct. Cropping changes visual emphasis, not the data; the labelled axis tells readers what is shown.':v==='zero'?'Unlike many bar charts, line graphs may use a clearly labelled non-zero vertical minimum.':'Cropping an axis never changes measurements or the time intervals between them.'];},hint:'Read the vertical-axis labels; a graph view is different from a change in the recorded values.',solve:ctl=>{ctl.querySelector('.rs-opts button')?.click()}}
 ];
 function paint(i){currentIndex=i;tools.style.display=i===0?'flex':'none';if(i===0){scene(stage,{data:d,state:challengeState,phase:8,interactive:true,pose:'count',speech:'The source tells us the true value at '+timeLabel(d,badIdx)+'. Place the marker at the matching height.',onUpdate:()=>paint(0)});}else if(i===1){scene(stage,{data:d,state:pointState(),phase:8,pose:'compare',speech:'Read each consecutive pair. The greatest increase is a difference, not simply the biggest value.'});}else {const st=pointState();st.baseline=d.crop;scene(stage,{data:d,state:st,phase:8,pose:'think',speech:'This zoomed axis is labelled. It changes the appearance of the line, but not the observed values.'});}}
 NOVA.challengeRun(panel,api,tasks,paint,CFG);
 CFG._challengeState=()=>({values:challengeState.values.slice(),task:currentIndex,target:real,largestIncrease:largest,interval});
}
const DEF={id:ID,title:'Line graph',config:CFG,steps:STEPS,render:watch,
 alt:'Neon continuous line graph with six measured points, evenly spaced time axis and labelled vertical measurement scale.',
 staticAlt:'A line graph plots ordered readings against time and joins observations in order. An axis crop changes visual emphasis, not measured values.',
 exploreIntro:'Drag measured points vertically to the correct values. Compare trends and a clearly labelled zoomed axis.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","options"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·03',title:'Line graph',def:DEF,
 years:'Year 7 KS3, with Year 8–9/GCSE trend and critical graph-reading extensions.',
 linked:['F0-02','F0-03','F0-04','F16-02','F16-10','F16-14'],
 spec:{purpose:'Plot time-series data on correctly scaled axes, join ordered observations, describe direction/rate and critique cropped scales.',
  params:'Six equally spaced times; integer readings; time units, vertical labels, range and declared zoom baseline.',
  presets:'Y7-072 Temperature across six times · Y7-071 Daily library visits and honest/zoomed comparisons.',
  steps:'Read source measurements → Set both scales → Plot points in sequence → Join segments → Locate maximum → Interpret trend and axis view.',
  interactions:'Move points using the locked SVG drag/snap system, keyboard arrow keys, exact-value entry, preset and full/zoom axis controls.',
  traps:'Confusing highest level with greatest increase; treating observations as unrelated categories; unequal time spacing; interpreting axis cropping as changed data.',
  gcse:'Critique misleading time-series scales, calculate changes between consecutive readings and compare rates.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4500);};
 NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>{log.textContent='';};}
})();
