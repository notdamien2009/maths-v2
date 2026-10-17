/* F16-08 Range and Spread — NOVA core primitives only, F0/F2 core preserved unchanged. */
(function(){'use strict';
const H=NOVA.h, E=NOVA.svg.el, M=NOVA.motion, ID='F16-08';
const C=window.NovaV2Integration.configuration(window.NOVA_F16_08_CONFIG={preset:'y7-range',events:['value','observation','endpoint','reset','preset','step','mode','hintUsed','correct'],presets:{
 'y7-range':{lesson:'Y7-069',label:'Y7-069 · Find the range',title:'Range of test scores',context:'Find the distance from the smallest score to the largest score.',scale:[0,16],a:[6,3,8,5,9,7,4],units:'marks',ext:12},
 'y7-compare':{lesson:'Y7-070',label:'Y7-070 · Compare distributions',title:'Two reading groups',context:'Compare how widely the scores are spread across two groups.',scale:[0,16],a:[8,4,10,7,6,9,5],b:[7,2,13,4,11,6,8],units:'books'},
 'y8-compare':{lesson:'Y8-069',label:'Y8-069 · Compare spread',title:'Two sports teams',context:'Identify which team has a greater range before drawing a conclusion.',scale:[0,16],a:[8,3,11,5,7,4,9],b:[7,1,13,5,9,3,11],units:'points'},
 'y9-outlier':{lesson:'Y9-048',label:'Y9-048 · Spread and outliers',title:'Investigate an outlier',context:'An unusual value can widen the range without shifting most observations.',scale:[0,22],a:[9,5,11,8,20,7,6,10],b:[8,4,10,12,6,9,7,8],units:'minutes',outlier:20}
 }});
const STEPS=[
 {name:'Gather the observations',pose:'count',narration:'Every observation matters. Start with the collected values.',prompt:'What is the smallest observation?'},
 {name:'Place the numbers in order',pose:'compare',narration:'Order the data so the extreme values are easy to identify.',prompt:'Which values are at the ends?'},
 {name:'Plot each observation',pose:'point-down',narration:'Show each value at its exact position on the shared number line.',prompt:'What does one marker represent?'},
 {name:'Locate the smallest value',pose:'point-left',narration:'The minimum is the smallest observation, not the first number you happen to read.',prompt:'Where is the minimum?'},
 {name:'Locate the largest value',pose:'point-right',narration:'The maximum is the greatest observation, not the number of observations.',prompt:'Where is the maximum?'},
 {name:'Stretch the range bracket',pose:'ruler',narration:'Connect the two extreme values. The bracket shows the full spread.',prompt:'Which values bound the bracket?'},
 {name:'Subtract the endpoints',pose:'idea',narration:'Range equals maximum minus minimum. Do not add the extremes.',prompt:'What is the numerical difference?'},
 {name:'Compare a second set',pose:'compare',narration:'A larger range means a wider distance between extremes, not necessarily a higher typical score.',prompt:'Which distribution is more spread out?'},
 {name:'Explain an outlier',pose:'think',narration:'A very unusual extreme value can make the range much larger.',prompt:'What happens if the outlier is removed?'}
];
const p=()=>C.presets[C.preset];const sorted=a=>a.slice().sort((x,y)=>x-y),min=a=>Math.min(...a),max=a=>Math.max(...a),range=a=>max(a)-min(a);
const stats=a=>({min:min(a),max:max(a),range:range(a)});const sum=a=>a.reduce((v,x)=>v+x,0);
const role=(k)=>k===0?'given':'focus';
const emit=(key,value)=>NOVA.events.emit('value',{engine:ID,key,control:key,value});
const txt=(p,x,y,v,c='given',sz=23,anchor='middle')=>NOVA.chalkText(p,x,y,String(v),{role:c,size:sz,anchor});
const fresh=()=>({a:p().a.slice(),b:p().b?p().b.slice():null,pins:{a:[min(p().a),max(p().a)],b:p().b?[min(p().b),max(p().b)]:[min(p().a),max(p().a)]}});
const geom=()=>{let mobile=innerWidth<=540;return {W:mobile?450:770,H:mobile?760:760,mobile,x0:mobile?49:90,x1:mobile?416:702,sourceY:118,ay:mobile?250:250,by:mobile?520:520,soloY:mobile?352:352};};
const xFor=(v,g,p0=p())=>g.x0+(v-p0.scale[0])*(g.x1-g.x0)/(p0.scale[1]-p0.scale[0]);
function line(sv,g,y,pr){
 const nl=NOVA.numberLine(sv,{x:g.x0,y,w:g.x1-g.x0,min:pr.scale[0],max:pr.scale[1],major:pr.scale[1]>18?2:2,minor:1,arrows:false,labelSize:g.mobile?24:21,label:v=>v%2===0?v:''});return nl;
}
function bracket(sv,g,y,low,high,settings={}){
 const l=xFor(low,g),r=xFor(high,g),by=y+75;
 NOVA.neonLine(sv,l,by,r,by,{role:'result',width:5});
 NOVA.neonLine(sv,l,by-19,l,by+15,{role:'result',width:4});NOVA.neonLine(sv,r,by-19,r,by+15,{role:'result',width:4});
 NOVA.neonRing(sv,l,by,{role:'focus',r:8,pulse:settings.pulse});NOVA.neonRing(sv,r,by,{role:'result',r:8,pulse:settings.pulse});
 if(settings.reveal!==false){
  txt(sv,l,by-26,low,'focus',g.mobile?24:28);txt(sv,r,by-26,high,'result',g.mobile?24:28);
  txt(sv,(l+r)/2,by+45,`${high} − ${low} = ${high-low}`,'result',g.mobile?28:31);
 }
}
function makeDot(sv,g,y,v,k,i,interactive,update,state){
 const grouped=E('g',{class:'f168-point'},sv);const x=xFor(v,g);const yy=y-35-k*27; 
 NOVA.neonBox(grouped,x-13,yy-13,26,26,{role:role(i),r:8});
 txt(grouped,x,yy+8,v,role(i),21);
 if(interactive){
  grouped.setAttribute('data-observation',`${state.which}:${i}`);grouped.setAttribute('role','button');grouped.setAttribute('tabindex','0');grouped.setAttribute('aria-label',`Move observation ${i+1}, value ${v}. Arrow keys change its value.`);
  const targetZones=()=>{const pr=p(),zones=[];for(let z=pr.scale[0];z<=pr.scale[1];z++){let cx=xFor(z,g);zones.push({id:'value:'+z,kind:'drop',x:cx-((g.x1-g.x0)/(pr.scale[1]-pr.scale[0]))/2,y:y-85,w:(g.x1-g.x0)/(pr.scale[1]-pr.scale[0]),h:104});}return zones;};
  NOVA.ui.svgDrag(sv,grouped,{box:{x:x-13,y:yy-13,w:26,h:26},zones:targetZones,onDrop:id=>{if(!id.startsWith('value:'))return false;const n=Number(id.slice(6));if(!Number.isInteger(n))return false;state.data[i]=n;emit('observation',{group:state.which,index:i,value:n});update();return true;}});
  grouped.addEventListener('pointerdown',e=>{try{grouped.setPointerCapture(e.pointerId)}catch(_){}});
  grouped.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const n=state.data[i]+(e.key==='ArrowRight'?1:-1);if(n<p().scale[0]||n>p().scale[1])return;state.data[i]=n;emit('observation',{group:state.which,index:i,value:n});update();});
 }
 return grouped;
}
function dataLine(sv,g,which,arr,y,o){
 const pr=p(),s=stats(arr),selected=o.pins?.[which]||[s.min,s.max];
 txt(sv,g.x0-14,y-83,which==='a'?'A':'B',role(which==='b'?1:0),g.mobile?28:32,'middle');
 line(sv,g,y,pr);
 const vis=(o.phase>=2||o.interactive||o.challenge);if(vis){
  const xs={};arr.forEach((v,i)=>{let k=((v%2)+2*(xs[v]||0));xs[v]=(xs[v]||0)+1;const item=makeDot(sv,g,y,v,k,i,!!o.interactive,{...o}.update||(()=>{}),{which,data:arr});if(!o.interactive&&!o.challenge&&o.phase>=2&&o.phase<4)M.arrive(item,0,15,300);});
 }
 if(o.phase>=3||o.interactive||o.challenge){
  const left=xFor(s.min,g),right=xFor(s.max,g);
  if(o.phase>=3||o.interactive||o.challenge)NOVA.neonRing(sv,left,y,{role:'focus',r:8,pulse:o.phase===3});
  if(o.phase>=4||o.interactive||o.challenge)NOVA.neonRing(sv,right,y,{role:'result',r:8,pulse:o.phase===4});
 }
 if(o.phase>=5||o.interactive||o.challenge){
  let showTrue=!o.challenge||o.task!==0;
  if(o.interactive||o.challenge){
   const pin=o.pins?.[which]||[s.min,s.max]; bracket(sv,g,y,pin[0],pin[1],{reveal:!o.challenge||o.task!==0});
   // Movable end handles use the canonical F2 svgDrag; nearest integer is the only valid snap.
   [0,1].forEach(k=>{let vx=pin[k],x=xFor(vx,g),yy=y+75;
    const el=NOVA.neonBox(sv,x-16,yy-16,32,32,{role:k===0?'focus':'result',r:13});
    txt(el,x,yy+8,k===0?'L':'R',k===0?'focus':'result',23);
    el.setAttribute('data-handle',`${which}:${k}`);el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label',`Move ${k===0?'minimum':'maximum'} bracket handle; arrow keys adjust.`);
    const zones=()=>{const z=[];for(let n=pr.scale[0];n<=pr.scale[1];n++){const xx=xFor(n,g);z.push({id:'pin:'+n,kind:'drop',x:xx-(g.x1-g.x0)/(pr.scale[1]-pr.scale[0])/2,y:yy-42,w:(g.x1-g.x0)/(pr.scale[1]-pr.scale[0]),h:84});}return z;};
    const apply=n=>{if(k===0&&n>=pin[1]||k===1&&n<=pin[0])return false;pin[k]=n;emit('endpoint',{group:which,handle:k,value:n});o.update();return true;};
    NOVA.ui.svgDrag(sv,el,{box:{x:x-16,y:yy-16,w:32,h:32},zones,onDrop:id=>id.startsWith('pin:')&&apply(+id.slice(4))});
    el.addEventListener('pointerdown',e=>{try{el.setPointerCapture(e.pointerId)}catch(_){}});
    el.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();apply(vx+(e.key==='ArrowRight'?1:-1));});
   });
  }else bracket(sv,g,y,s.min,s.max,{pulse:o.phase===5,reveal:showTrue});
 }
}
function rawRow(sv,g,a,b,phase){
 const pr=p(),sets=[a,b].filter(Boolean);
 if(phase>1){txt(sv,g.W/2,82,pr.outlier?'One extreme can change the spread':pr.b?'Compare both extremes on one scale':'Minimum to maximum is a distance','support',g.mobile?22:26);return;}
 sets.forEach((arr,k)=>{
  const headingY=sets.length>1?(k?266:137):188, rowY=sets.length>1?(k?293:164):220;
  txt(sv,g.W/2,headingY,`${sets.length===1?'The data':'Set '+(k?'B':'A')} · ${phase===0?'unsorted observations':'ordered from least to greatest'}`,'focus',g.mobile?22:27);
  const sequence=phase===0?arr:sorted(arr),w=Math.min(g.mobile?49:66,(g.W-80)/arr.length);
  sequence.forEach((v,i)=>{const x=(g.W-arr.length*w)/2+i*w;NOVA.neonBox(sv,x+2,rowY,w-5,g.mobile?46:54,{role:k?'focus':'given',text:v,size:g.mobile?24:29});});
 });
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}

 stage.innerHTML='';const g=geom(),pr=p(),state=o.state||fresh(),phase=o.phase==null?8:o.phase;
 NOVA.cap(stage,pr.context,`${pr.lesson} · RANGE & SPREAD`);
 const sv=NOVA.svg.root(g.W,g.H,'Ordered data on two NOVA number lines with neon minimum and maximum brackets; adjustable observations show how range changes.');sv.classList.add('f168-svg');
 txt(sv,g.W/2,41,pr.title,'focus',g.mobile?31:37);rawRow(sv,g,state.a,state.b,phase);
 const interactive=!!o.interactive,challenge=!!o.challenge;
 const topY=state.b?g.ay:g.soloY;
 if(phase>=2||interactive||challenge){dataLine(sv,g,'a',state.a,topY,{...o,phase,interactive,challenge,pins:state.pins});if(state.b)dataLine(sv,g,'b',state.b,g.by,{...o,phase,interactive,challenge,pins:state.pins});}
 if(!state.b&&phase>=2){ // A second visual: individual ordered values as a neon measurement strip.
  const s=stats(state.a),py=572;
  txt(sv,g.W/2,py-64,'Distance between extremes','support',g.mobile?22:26);
  NOVA.neonLine(sv,xFor(s.min,g),py,xFor(s.max,g),py,{role:'focus',width:5});
  NOVA.neonRing(sv,xFor(s.min,g),py,{role:'focus',r:8});NOVA.neonRing(sv,xFor(s.max,g),py,{role:'result',r:8});
  txt(sv,g.W/2,py+49,phase>=6||interactive?`Range = ${s.range} ${pr.units}`:'Distance = ?','result',g.mobile?28:32);
  if(phase>=5||interactive){NOVA.neonBox(sv,g.mobile?41:95,677,g.mobile?367:580,49,{role:'focus'});txt(sv,g.W/2,709,`From ${s.min} to ${s.max}: ${s.range} units apart`,'support',g.mobile?22:27);}
 }
 if(phase<2&&!interactive&&!challenge){const yy=480;NOVA.neonBox(sv,g.mobile?42:102,yy-63,g.mobile?366:566,120,{role:'given'});txt(sv,g.W/2,yy-12,phase===0?'Find both extremes':'Order first, then compare','focus',g.mobile?27:32);txt(sv,g.W/2,yy+29,phase===0?'First does not mean smallest.':'Read the two ordered ends.','support',g.mobile?23:27);}
 if(state.b&&phase>=7||interactive&&state.b){const ra=range(state.a),rb=range(state.b);txt(sv,g.W/2,683,ra===rb?'Both sets have the same range':`${ra>rb?'Set A':'Set B'} has the greater range`,'result',g.mobile?23:31);}
 if(pr.outlier&&phase>=8&&!interactive&&!challenge)txt(sv,g.W/2,722,`Without 20, set A range = ${range(state.a.filter(x=>x!==20))}`,'support',g.mobile?20:25);
 stage.appendChild(sv);
 const chips=H('div',{class:'f168-stats'});
 if(!challenge||o.task>0)if(phase>=3||interactive||challenge){let a=stats(state.a);chips.append(NOVA.neonTile(`A min ${a.min}`,{role:'given'}));if(phase>=4||interactive||challenge)chips.append(NOVA.neonTile(`A max ${a.max}`,{role:'focus'}));if(phase>=6||interactive&&!(challenge&&o.task===0))chips.append(NOVA.neonTile(`A range ${a.range}`,{role:'result'}));if(state.b&&(phase>=7||interactive)){chips.append(NOVA.neonTile(`B range ${range(state.b)}`,{role:'result'}));}}
 stage.appendChild(chips);
 NOVA.scene.helperStrip(stage,o.pose||'compare',o.speech||'The range measures the gap from the minimum to the maximum.');return sv;
}
function watch(i,stage){let pr=p(),b=!!pr.b;
 const speech=[
  `These observations were collected in no special order. We must include all the values.`,
  `First sort the values from smallest to largest. Repetitions are kept.`,
  `Each dot is placed at its numerical value on the original NOVA scale.`,
  `Find the minimum, the smallest observation in the data set.`,
  `Find the maximum, the largest recorded observation.`,
  `The range bracket connects the minimum to the maximum.`,
  `Subtract the smallest from the largest. This gives the range in ${pr.units}.`,
  b?`Compare both ranges: set A is ${range(pr.a)} and set B is ${range(pr.b)}. Larger range means wider extremes.`:`A larger range means the observations can cover a greater distance.`,
  pr.outlier?`The twenty is an outlier. If it is removed, the remaining range is ${range(pr.a.filter(v=>v!==20))}, not ${range(pr.a)}.`:`Range tells us the overall distance. It does not describe every value inside that gap.`
 ];scene(stage,{state:fresh(),phase:i,pose:STEPS[i].pose,speech:speech[i]});}
function select(aria,items){const e=H('select',{class:'nova-input','aria-label':aria});items.forEach(([v,t])=>e.appendChild(H('option',{value:String(v),text:t})));return e;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let data=fresh();window.NovaLessonComponent?.applyExploreModels();const preset=select('Lesson preset',Object.entries(C.presets).map(([k,v])=>[k,v.label]));window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();const group=select('Data set',[['a','Set A'],['b','Set B']]),item=select('Observation',[]),low=select('Set minimum bracket pin',[]),high=select('Set maximum bracket pin',[]);
 window.NovaLessonComponent?.applyExploreModels();const minus=H('button',{class:'nova-btn',text:'−1'}),plus=H('button',{class:'nova-btn primary',text:'+1'}),reset=H('button',{class:'nova-btn',text:'Reset data'}),setPins=H('button',{class:'nova-btn',text:'Set bracket pins'}),stat=H('p',{class:'f168-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();const ctl=H('div',{class:'f168-actions'},[H('label',{class:'f168-label'},['Lesson',preset]),H('label',{class:'f168-label'},['Data set',group]),H('label',{class:'f168-label'},['Observation',item]),minus,plus,H('label',{class:'f168-label'},['Min pin',low]),H('label',{class:'f168-label'},['Max pin',high]),setPins,reset]);
 window.NovaLessonComponent?.applyExploreModels();function makeOptions(){group.querySelector('[value=b]').disabled=!data.b;if(!data.b)group.value='a';item.innerHTML='';const arr=data[group.value];arr.forEach((v,i)=>item.append(H('option',{value:String(i),text:`Observation ${i+1}: ${v}`})));low.innerHTML='';high.innerHTML='';for(let v=p().scale[0];v<=p().scale[1];v++){low.append(H('option',{value:v,text:String(v)}));high.append(H('option',{value:v,text:String(v)}));}low.value=data.pins[group.value][0];high.value=data.pins[group.value][1];}
 window.NovaLessonComponent?.applyExploreModels();function render(){scene(stage,{state:data,phase:9,interactive:true,pose:'ruler',speech:'Drag a score to another number. Drag L and R to move the bracket ends, then compare that selection with the true range.',update:()=>{makeOptions();render();}});let sa=stats(data.a);stat.textContent=`Set A: min ${sa.min}, max ${sa.max}, range ${sa.range}.`+(data.b?` Set B range: ${range(data.b)}.`:'');}
 window.NovaLessonComponent?.applyExploreModels();function move(dt){const arr=data[group.value],i=+item.value,newValue=arr[i]+dt;if(newValue<p().scale[0]||newValue>p().scale[1]){stat.textContent='That value is outside the marked scale.';return;}arr[i]=newValue;emit('observation',{group:group.value,index:i,value:newValue});makeOptions();item.value=String(i);render();}
 window.NovaLessonComponent?.applyExploreModels();minus.onclick=()=>move(-1);window.NovaLessonComponent?.applyExploreModels();plus.onclick=()=>move(1);window.NovaLessonComponent?.applyExploreModels();setPins.onclick=()=>{let a=+low.value,b=+high.value;if(a>=b){stat.textContent='The minimum handle must be strictly left of the maximum.';return;}data.pins[group.value]=[a,b];emit('endpoint',{group:group.value,pins:[a,b]});render();};
 window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{data=fresh();makeOptions();render();emit('reset',true);};window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{C.preset=preset.value;data=fresh();makeOptions();render();emit('preset',C.preset)};window.NovaLessonComponent?.applyExploreModels();group.onchange=()=>{makeOptions();render();};window.NovaLessonComponent?.applyExploreModels();item.onchange=render;
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f168-guidance',text:'Drag an observation on the NOVA number line or adjust its value with the buttons. Drag the two bracket handles to investigate the minimum and maximum. Keyboard arrows work on either draggable object.'}),ctl,stat);
 window.NovaLessonComponent?.applyExploreModels();makeOptions();window.NovaLessonComponent?.applyExploreModels();render();window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:C.preset,state:structuredClone(data),rangeA:range(data.a),rangeB:data.b?range(data.b):null}),select:key=>{preset.value=key;preset.onchange()},move:(which,i,v)=>{if(!data[which]||!Number.isInteger(v)||v<p().scale[0]||v>p().scale[1])return;data[which][i]=v;render();},setPin:(which,k,v)=>{data.pins[which][k]=v;render();},reset:()=>{data=fresh();render();}};
}
function challenge(panel,api,stage){let pr=p(),state=fresh(),task=0;
 state.pins.a=[pr.scale[0]+1,pr.scale[1]-1];if(state.b)state.pins.b=[pr.scale[0]+1,pr.scale[1]-1];
 const stat=H('p',{class:'f168-status',role:'status'}),minSel=select('Left range handle',[]),maxSel=select('Right range handle',[]),set=H('button',{class:'nova-btn',text:'Place bracket handles'}),row=H('div',{class:'f168-actions'},[H('label',{class:'f168-label'},['Min marker',minSel]),H('label',{class:'f168-label'},['Max marker',maxSel]),set]);
 for(let z=pr.scale[0];z<=pr.scale[1];z++){minSel.append(H('option',{value:z,text:z}));maxSel.append(H('option',{value:z,text:z}));}
 function draw(){scene(stage,{state,phase:9,challenge:true,task,pose:task===0?'ruler':task===1?'think':'compare',speech:task===0?'Move the bracket ends to the true smallest and largest observations.':task===1?'Range is maximum minus minimum, not their sum.':pr.outlier?'Remove the unusual extreme mentally, then calculate the remaining range.':'Compare the second range with the first.',update:draw});stat.textContent=`Bracket L ${state.pins.a[0]}, R ${state.pins.a[1]}.`;row.style.display=task===0?'flex':'none';minSel.value=String(state.pins.a[0]);maxSel.value=String(state.pins.a[1]);}
 set.onclick=()=>{const a=+minSel.value,b=+maxSel.value;if(a>=b){stat.textContent='The left endpoint must be smaller than the right endpoint.';return;}state.pins.a=[a,b];emit('endpoint',{group:'a',pins:[a,b]});draw();};
 panel.append(H('p',{class:'f168-guidance',text:'Use the glowing bracket handles or the accessible selectors. The range is checked against the actual plotted observations.'}),row,stat);
 const a=stats(pr.a),b=pr.b?stats(pr.b):null;
 const after=pr.outlier?range(pr.a.filter(v=>v!==pr.outlier)):pr.b?b.range:pr.ext-a.min;
 const questions=[
  {q:'Place the left and right handles on the true minimum and maximum of set A.',build:()=>()=>state.pins.a[0]===a.min&&state.pins.a[1]===a.max,check:v=>[v===true,v?'Correct: both markers match the real extremes.':'The markers do not match the smallest and largest plotted values. Do not use the number of observations.'],hint:'Read the smallest and greatest score in set A, then drag the L and R handles to those two values.',solve:()=>{state.pins.a=[a.min,a.max];draw();}},
  {q:'What is the numerical range of set A?',build:NOVA.entryTask('Range of set A',ID),check:v=>[v===a.range,v===a.range?`Correct: ${a.max} − ${a.min} = ${a.range}.`:v===a.max?'That is the maximum, not the distance between the ends.':v===a.max+a.min?'You added the endpoints. Subtract the minimum from the maximum.':'Find maximum minus minimum, not the count of data points.'],hint:`Subtract ${a.min} from ${a.max}.`,solve:()=>{}},
  {q:pr.outlier?'If the outlier of 20 is excluded, what is the new range of set A?':b?'What is the numerical range of set B?':`If the highest value were ${pr.ext}, what would the new range be?`,build:NOVA.entryTask('New / comparison range',ID),check:v=>[v===after,v===after?'Correct: the difference between the extremes is now '+after+'.':v===a.range?'You reused set A’s original range. Look at the updated or second data set.':'Read the correct smallest and largest values before subtracting.'],hint:pr.outlier?'Exclude only the unusually large value and find the next-highest score.':b?`Set B extends from ${b.min} to ${b.max}.`:`Use ${pr.ext} as the new maximum and ${a.min} as the minimum.`,solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,questions,k=>{task=k;draw();},C);C._challengeState=()=>({task,preset:C.preset,pins:structuredClone(state.pins),ranges:{a:a.range,b:b?.range??null,after}});
}
const DEF={id:ID,title:'Range and Spread',config:C,steps:STEPS,render:watch,
 alt:'NOVA premium neon number lines showing individual observations and luminous brackets between the smallest and largest data values.',staticAlt:'Range is the maximum value minus the minimum value; extreme outliers can change the range substantially.',exploreIntro:'Drag observation markers and bracket endpoints to investigate how the overall spread changes.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·08',title:'Range and Spread',def:DEF,years:'Year 7, Year 8 and Year 9 KS3.',linked:['F0-02','F0-03','F0-04','F1-01','F16-05','F16-06','F16-13'],spec:{
 purpose:'Identify minimum and maximum, calculate the range, compare spread and explain the sensitivity of range to outliers.',params:'One or two integer-valued data sets on a shared scale, with draggable observations and range brackets.',presets:'Y7-069 averages and range · Y7-070 comparing distributions · Y8-069 comparing distributions · Y9-048 spread and outliers.',steps:'Gather → sort → plot → minimum → maximum → bracket → subtract → compare → interpret.',interactions:'Canonical F2 SVG drag, snapping to number-line values, end-handle drag, cancellation recovery and keyboard alternatives.',traps:'Adding min and max; taking maximum as range; using count as minimum; assuming larger range means greater mean; outliers ignored.',gcse:'Compare evidence from range alongside typical values and the effect of outliers.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
