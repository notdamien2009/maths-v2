/* F16-07 Mean Explorer — component logic only; all scene artwork, drag, narration and shell use original NOVA F0/F2 core. */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,M=NOVA.motion,ID='F16-07';
const C=window.NovaV2Integration.configuration(window.NOVA_F16_07_CONFIG={preset:'y7-fair-share',events:['value','transfer','frequency','remove','reset','preset','step','mode','hintUsed','correct'],presets:{
 'y7-fair-share':{lesson:'Y7-069',label:'Y7-069 · Fair-share mean',kind:'individual',title:'Five stacks · one total',context:'Move cubes until everyone has the same amount.',scores:[2,7,4,6,6]},
 'y8-grouped':{lesson:'Y8-065',label:'Y8-065 · Estimated grouped mean',kind:'grouped',title:'Journey times · grouped minutes',context:'We know only class frequencies, not the original exact journey times.',midpoints:[5,15,25,35],intervals:['0 ≤ t < 10','10 ≤ t < 20','20 ≤ t < 30','30 ≤ t < 40'],frequencies:[2,5,4,1]}
}});
const STEPS=[
{name:'Start with the observations',pose:'count',narration:'Every observation contributes to the total.',prompt:'What is being counted?'},
{name:'Build equal-size units',pose:'point-down',narration:'Use equal-size cubes so height represents quantity.',prompt:'What does each cube mean?'},
{name:'Complete the towers',pose:'compare',narration:'Every value must appear, including repeated values.',prompt:'How many towers are there?'},
{name:'Count the combined total',pose:'count',narration:'The total stays the same when you move a cube.',prompt:'What is the total?'},
{name:'Find a fair-share level',pose:'ruler',narration:'The mean is the level each group would have if we shared evenly.',prompt:'Where should the mean line be?'},
{name:'Move a unit, not the total',pose:'point-down',narration:'A cube moved between two towers keeps the combined total unchanged.',prompt:'What moves and what stays the same?'},
{name:'Compare the balanced result',pose:'compare',narration:'Balance means identical heights, not removing any cubes.',prompt:'Are the towers equal now?'},
{name:'Write the calculation',pose:'idea',narration:'Divide the sum of all values by the number of observations.',prompt:'Which number is the divisor?'},
{name:'Interpret the meaning',pose:'celebrate',narration:'Explain what the mean tells us and what it does not.',prompt:'Is the mean always an observed score?'}
];
const d=()=>C.presets[C.preset];const isGrouped=()=>d().kind==='grouped';
const sum=a=>a.reduce((n,x)=>n+x,0),mean=a=>sum(a)/a.length;
const groupedTotal=f=>sum(f),weighted=(f,p=d())=>f.reduce((n,x,i)=>n+x*p.midpoints[i],0),gmean=(f,p=d())=>groupedTotal(f)?weighted(f,p)/groupedTotal(f):NaN;
const fmt=(n,dec=2)=>Number.isInteger(n)?String(n):(+n.toFixed(dec)).toString();
let ex=null,ch=null;function fresh(p=d()){return p.kind==='individual'?{heights:p.scores.slice()}:{freq:p.frequencies.slice()};}
function emit(key,value){NOVA.events.emit('value',{engine:ID,key,control:key,value});}
const txt=(p,x,y,t,role='given',sz=24,anchor='middle')=>NOVA.chalkText(p,x,y,String(t),{role,size:sz,anchor});
function view(){let mobile=window.innerWidth<=540;return mobile?{mobile,W:450,H:790,base:470,one:41,top:105,remove:{x:262,y:731,w:160,h:52},cube:55,xs:[68,146,224,302,380]}:{mobile,W:770,H:790,base:470,one:41,top:105,remove:{x:558,y:719,w:172,h:52},cube:87,xs:[115,250,385,520,655]};}
function cube(sv,x,y,w,h,role='given',o={}){
 const g=E('g',{class:'f167-cube'},sv);
 // Front face, raised luminous top and right side: drawn only using NOVA neon primitives.
 NOVA.neonBox(g,x-w/2,y,w,h,{role,r:6});
 NOVA.neonPath(g,`M${x-w/2},${y} l${Math.min(8,w*.14)},-8 h${w} l${-Math.min(8,w*.14)},8 Z`,{role,width:1.6,fill:true});
 NOVA.neonPath(g,`M${x+w/2},${y} l${Math.min(8,w*.14)},-8 v${h} l${-Math.min(8,w*.14)},8 Z`,{role,width:1.6,fill:true});
 if(o.text!=null)txt(g,x,y+h*.66,o.text,role,Math.max(19,Math.min(25,w*.38)));
 return g;
}
function stagedView(p,phase){if(p.kind==='grouped')return p.frequencies.slice();if(phase===5)return [3,6,4,6,6];if(phase>=6)return [5,5,5,5,5];return p.scores.slice();}
function axis(sv,a,base,unit,limit){
 const bottom=base+4;
 NOVA.neonLine(sv,a.mobile?24:53,bottom,a.mobile?427:718,bottom,{role:'given',width:3});
 for(let v=0;v<=limit;v+=(limit<=12?2:5)){
   const y=base-v*unit;const l=NOVA.neonLine(sv,a.mobile?24:53,y,a.mobile?427:718,y,{role:v===0?'given':'support',width:1.6});l.style.opacity=v===0?'0.6':'.19';
   if(v>0&&(!a.mobile||v%4===0))txt(sv,a.mobile?27:62,y+5,String(v),'support',a.mobile?18:21,'start');
 }
}
function drawUnitBoard(sv,a,heights,o){const p=d(),base=a.base,unit=a.one;const total=sum(heights),avg=mean(heights);axis(sv,a,base,unit,10);
 txt(sv,a.W/2,48,'Balance the stacks','focus',a.mobile?27:33);
 txt(sv,a.W/2,81,o.phase===0?'Every score contributes to the total':o.phase>=6&&!(o.interactive||o.challenge)?'Fair shares: same total, equal height':'One cube represents 1 score unit','support',a.mobile?25:26);
 const visible=o.interactive||o.challenge?heights:o.phase===0?heights.map(()=>0):o.phase===1?heights.map(n=>Math.min(1,n)):heights;
 // Before constructing the towers, display the unsorted data cards rather than a completed solution.
 if(o.phase===0&&!o.interactive&&!o.challenge){txt(sv,a.W/2,173,'Five original observations','support',a.mobile?26:29);p.scores.forEach((score,i)=>NOVA.neonBox(sv,a.xs[i]-a.cube/2,229,a.cube,98,{role:i%2?'focus':'given',text:String(score),size:a.mobile?31:37}));}
 // Each tower has an unambiguous vertical target, and only its top cube is movable.
 visible.forEach((v,i)=>{
  let x=a.xs[i],w=a.cube,role=i%2===0?'given':'focus';
  for(let j=0;j<v;j++){
    let y=base-(j+1)*unit+3;
    const cg=cube(sv,x,y,w,unit-5,role);
    if(o.phase>=1&&!o.interactive&&!o.challenge&&o.phase<=3&&j===v-1)M.arrive(cg,0,13,370);
    if(o.interactive&&j===v-1&&v>0||o.challenge&&o.task===0&&j===v-1&&v>0){
      cg.setAttribute('data-transfer',String(i));cg.setAttribute('role','button');cg.setAttribute('tabindex','0');cg.setAttribute('aria-label',`Top cube of tower ${i+1}. Move it to a different tower, or use the transfer controls.`);
      const zones=()=>a.xs.map((xx,k)=>({id:'tower:'+k,kind:'drop',x:xx-(a.mobile?38:60),y:120,w:a.mobile?76:120,h:base-99})).filter(z=>true);
      NOVA.ui.svgDrag(sv,cg,{box:{x:x-w/2,y:y-8,w:w+12,h:unit+14},zones,onDrop:id=>{
         const target=Number(id.split(':')[1]);if(!id.startsWith('tower:')||target===i||!Number.isInteger(target)||target<0||target>4||heights[i]<=0)return false;
         heights[i]--;heights[target]++;emit('transfer',{from:i,to:target,total:sum(heights)});o.update();return true;
       }});
      cg.addEventListener('pointerdown',e=>{try{cg.setPointerCapture(e.pointerId)}catch(_){}});
      cg.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();const to=i+(e.key==='ArrowLeft'?-1:1);if(to<0||to>=5)return;heights[i]--;heights[to]++;emit('transfer',{from:i,to,total:sum(heights)});o.update();});
    }
  }
  txt(sv,x,base+39,`P${i+1}`,'support',a.mobile?28:28);
  txt(sv,x,base+71,String(o.phase===0&&!o.interactive&&!o.challenge?p.scores[i]:v),i%2?'focus':'given',a.mobile?29:32);
 });
 // The mean guide uses the arithmetic mean, never a rounded-up tower height.
 if((o.phase>=4||o.interactive)&&!(o.challenge&&o.task===0)){
  const y=base-avg*unit,l=NOVA.neonLine(sv,a.mobile?34:71,y,a.mobile?414:701,y,{role:'result',width:3});l.style.opacity='.85';
  NOVA.neonRing(sv,a.mobile?420:707,y,{role:'result',r:8,pulse:o.phase===4});
  txt(sv,a.W/2,137,`Mean = ${fmt(avg)}`,'result',a.mobile?28:32);
 }
 const bandY=a.mobile?610:596;
 NOVA.neonBox(sv,a.mobile?28:68,bandY,a.mobile?190:292,58,{role:'focus'});
 NOVA.neonBox(sv,a.mobile?234:407,bandY,a.mobile?188:294,58,{role:'result'});
 txt(sv,a.mobile?123:214,bandY+23,'Total cubes','support',a.mobile?20:23);
 txt(sv,a.mobile?123:214,bandY+47,o.phase<3&&!o.interactive&&!o.challenge?'?':String(total),'focus',a.mobile?28:30);
 txt(sv,a.mobile?328:554,bandY+23,'Number of pupils','support',a.mobile?20:23);
 txt(sv,a.mobile?328:554,bandY+47,String(heights.length),'result',a.mobile?27:30);
 if(o.challenge&&o.task===0)txt(sv,a.W/2,a.mobile?696:677,'Transfer cubes until all five heights match.','focus',a.mobile?18:24);
 else txt(sv,a.W/2,a.mobile?700:689,o.challenge?'Use total ÷ number of pupils':o.phase<7&&!o.interactive?'Move cubes; keep the same total':`${total} ÷ ${heights.length} = ${fmt(avg)}`,'result',a.mobile?25:32);
}
function groupedGeometry(a){const mobile=a.mobile;
 return {base:470,step:mobile?32.8:50.5,left:mobile?43:105,unit:39,bw:mobile?28:43,blockH:36};}
function drawGrouped(sv,a,f,o){const p=d(),g=groupedGeometry(a);const total=groupedTotal(f),ws=weighted(f,p),avg=gmean(f,p);
 txt(sv,a.W/2,46,'Grouped journeys','focus',a.mobile?28:33);
 txt(sv,a.W/2,82,'One cube = five minutes','support',a.mobile?26:28);
 txt(sv,a.W/2,115,'Scores use class midpoints','support',a.mobile?25:26);
 // Each original observation is unknown: one narrow tower for each frequency assumed at the midpoint.
 if(o.phase===0&&!o.interactive&&!o.challenge){p.frequencies.forEach((v,k)=>{let x=a.mobile?[77,175,273,370][k]:[160,310,460,610][k];NOVA.neonBox(sv,x-(a.mobile?40:60),232,a.mobile?80:120,110,{role:k%2?'focus':'given',text:`f ${v}`,size:32});txt(sv,x,373,`mid ${p.midpoints[k]}`,'support',a.mobile?24:28);});}
 if(o.phase===1&&!o.interactive&&!o.challenge){p.midpoints.forEach((v,k)=>{let x=a.mobile?[77,175,273,370][k]:[160,310,460,610][k];for(let i=0;i<v/5;i++)cube(sv,x,g.base-(i+1)*g.unit+3,g.bw,g.blockH,k%2?'focus':'given');});}
 let col=0;if(o.phase>=2||o.interactive||o.challenge)for(let k=0;k<4;k++){
   for(let n=0;n<f[k];n++){
    const x=g.left+col*g.step;col++;
    if(col>17)break;
    const cubes=p.midpoints[k]/5;
    for(let u=0;u<cubes;u++){
       const y=g.base-(u+1)*g.unit+3;
       const cg=cube(sv,x,y,g.bw,g.blockH,k%2?'focus':'given');
       if(!o.interactive&&!o.challenge&&o.phase>=2&&o.phase<4&&u===cubes-1)M.arrive(cg,0,14,380);
    }
   }
 }
 NOVA.neonLine(sv,a.mobile?21:55,g.base+2,a.mobile?435:721,g.base+2,{role:'given',width:3});
 // Four class groups are delineated with neon braces; stacked midpoint towers are NOT individual raw measurements.
 const groupX=[];let old=0;for(let k=0;k<4;k++){
  const left=g.left+old*g.step-g.bw/2-3,right=g.left+(old+Math.max(1,f[k])-1)*g.step+g.bw/2+3;
  let cx=g.left+(old+(f[k]-1)/2)*g.step;cx=Math.max(a.mobile?41:93,Math.min(a.mobile?413:686,cx));groupX.push(cx);old+=f[k];
  NOVA.neonPath(sv,`M${left},${g.base+14} v9 H${right} v-9`,{role:k%2?'focus':'given',width:2});
  txt(sv,cx,g.base+58,`${k*10}–${(k+1)*10}`,'support',a.mobile?25:24);
  txt(sv,cx,g.base+87,`f ${f[k]}`,'focus',a.mobile?25:25);
 }
 if(total>0&&(o.phase>=4||o.interactive||o.challenge)){
  const y=g.base-(avg/5)*g.unit;
  if(!(o.challenge&&o.task<3)){
   const line=NOVA.neonLine(sv,a.mobile?28:67,y,a.mobile?425:707,y,{role:'result',width:3});line.style.opacity='.92';
   NOVA.neonRing(sv,a.mobile?432:715,y,{role:'result',r:7,pulse:o.phase===6});
   txt(sv,a.W/2,149,`Estimated mean ≈ ${fmt(avg)}`,'result',a.mobile?25:30);
  }
 }
 const by=a.mobile?610:591;
 // Labels show assumptions explicitly; exact source scores are unknown.
 NOVA.neonBox(sv,a.mobile?22:70,by,a.mobile?190:291,58,{role:'given'});
 NOVA.neonBox(sv,a.mobile?235:409,by,a.mobile?195:290,58,{role:'focus'});
 txt(sv,a.mobile?117:215,by+24,'Total frequency','support',a.mobile?19:23);
 txt(sv,a.mobile?117:215,by+48,String(total),'given',a.mobile?27:30);
 txt(sv,a.mobile?332:554,by+24,'Σ(f × midpoint)','support',a.mobile?18:23);
 txt(sv,a.mobile?332:554,by+48,(o.challenge&&o.task<2||o.phase<4&&!o.interactive&&!o.challenge)?'?':String(ws),'focus',a.mobile?26:29);
 if(o.interactive||o.challenge&&o.task===0){
  const ry=a.mobile?681:664;
  for(let k=0;k<4;k++){
    const cx=groupX[k];const token=NOVA.neonBox(sv,cx-30,ry,60,39,{role:k%2?'focus':'given',text:'+1',size:23});
    token.setAttribute('data-bundle',String(k));token.setAttribute('tabindex','0');token.setAttribute('role','button');token.setAttribute('aria-label',`Transfer one frequency from class ${p.intervals[k]} to another class; use arrow keys.`);
    const zones=()=>groupX.map((xx,i)=>({id:'class:'+i,kind:'drop',x:xx-(a.mobile?30:37),y:ry-10,w:a.mobile?60:74,h:58}))
           .concat({id:'remove',kind:'remove',...a.remove});
    NOVA.ui.svgDrag(sv,token,{box:{x:cx-30,y:ry,w:60,h:39},zones,onDrop:id=>{
      let k2=Number(id.split(':')[1]);if(!id.startsWith('class:')||k2===k||!Number.isInteger(k2)||f[k]<=0)return false;
      f[k]--;f[k2]++;emit('frequency',{from:k,to:k2,frequencies:f.slice()});o.update();return true;
    },onRemove:()=>{if(f[k]<=0||sum(f)<=1)return;f[k]--;emit('remove',{class:k,frequencies:f.slice()});o.update();},removeTo:{x:a.remove.x+a.remove.w/2,y:a.remove.y+23}});
    token.addEventListener('pointerdown',e=>{try{token.setPointerCapture(e.pointerId)}catch(_){}});
    token.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='Delete')return;e.preventDefault();if(f[k]<=0)return;f[k]--;if(e.key!=='Delete'){let target=(k+(e.key==='ArrowLeft'?3:1))%4;f[target]++;}emit('frequency',{class:k,frequencies:f.slice()});o.update();});
  }
  NOVA.neonBox(sv,a.remove.x,a.remove.y,a.remove.w,a.remove.h,{role:'error'});
  txt(sv,a.remove.x+a.remove.w/2,a.remove.y+32,'Remove 1 pupil','error',a.mobile?21:24);
 }else{
  txt(sv,a.W/2,a.mobile?717:690,o.phase>=7?`Estimate = ${ws} ÷ ${total} ≈ ${fmt(avg)}`:'Weighted total = frequency × midpoint','result',a.mobile?22:28);
 }
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';const a=view(),p=d(),state=o.state||fresh(p),phase=o.phase==null?8:o.phase;
 NOVA.cap(stage,p.context,`${p.lesson} · ${p.kind==='grouped'?'GROUPED ESTIMATE':'FAIR SHARE'}`);
 const sv=NOVA.svg.root(a.W,a.H,p.kind==='grouped'?'Towers of assumed class-midpoint journey times; frequencies change the estimated mean.':'Five neon stacks of cubes representing five pupils; transferring cubes preserves the combined total.');sv.classList.add('f167-svg');
 if(p.kind==='individual')drawUnitBoard(sv,a,state.heights,{...o,phase});else drawGrouped(sv,a,state.freq,{...o,phase});
 stage.appendChild(sv);
 const n=p.kind==='individual'?state.heights.length:sum(state.freq),total=p.kind==='individual'?sum(state.heights):weighted(state.freq,p),avg=p.kind==='individual'?mean(state.heights):gmean(state.freq,p);
 const caps=H('div',{class:'f167-caps'});caps.append(NOVA.neonTile(phase<3&&!o.interactive&&!o.challenge?'Σ = ?':p.kind==='individual'?`Σ = ${total}`:`Σ fm = ${total}`,{role:'focus'}),NOVA.neonTile(`n = ${n}`,{role:'given'}));
 if(!(o.challenge&&o.task<3)&&(phase>=7||o.interactive))caps.appendChild(NOVA.neonTile(`${p.kind==='grouped'?'Estimate':'Mean'} = ${fmt(avg)}`,{role:'result'}));stage.appendChild(caps);
 NOVA.scene.helperStrip(stage,o.pose||'count',o.speech||'The total must be counted correctly before dividing by the number of observations.');return sv;
}
function watch(i,stage){const p=d(),o=fresh(p),group=p.kind==='grouped',messages=group?[
 'We only have grouped times, not the original exact journeys. The estimate must not be called exact.',
 'The groups cover ten-minute intervals. The midpoint of each class represents its assumed values.',
 'A cube stands for five minutes. Frequency decides how many midpoint towers to place in each class.',
 'Count frequencies: there are twelve journeys in all, even when class counts differ.',
 'For each class multiply its midpoint by its frequency, then add the four products.',
 'The four weighted contributions are ten, seventy-five, one hundred and thirty-five.',
 'Put the mean level at the weighted total divided by total frequency. A fractional level is allowed.',
 'Two hundred and twenty divided by twelve gives an estimated mean of about eighteen point three three.',
 'Because real times within each interval are unknown, this is an estimate, not an exact mean.'
 ]:[
 'These five scores are two, seven, four, six and six. We must include each one.',
 'Build one tower per pupil. Every equal-size cube represents one score unit.',
 'The towers have different heights. We must keep all twenty-five cubes.',
 'There are twenty-five units shared among five pupils. The total is not the tallest tower.',
 'The fair-share height is five cubes. Mean is the equal height after sharing.',
 'Transfer one cube from the second tower to the first. The total still stays twenty-five.',
 'Continue sharing until all five towers have five cubes each. No cubes are lost.',
 'Calculate the mean: twenty-five divided by five equals five.',
 'Mean five is a balance point, not necessarily a score someone actually achieved.'
 ];
 const state=p.kind==='individual'?{heights:stagedView(p,i)}:o;
 scene(stage,{state,phase:i,pose:STEPS[i].pose,speech:messages[i]});}
function makeSelect(label,arr){const s=H('select',{class:'nova-input','aria-label':label});for(const [v,n] of arr)s.appendChild(H('option',{value:v,text:n}));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();ex=fresh();window.NovaLessonComponent?.applyExploreModels();const preset=makeSelect('Lesson',Object.entries(C.presets).map(([v,p])=>[v,p.label]));window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();const from=makeSelect('Source tower',[]),to=makeSelect('Destination tower',[]),status=H('p',{class:'f167-status',role:'status'}),btn=H('button',{class:'nova-btn primary',text:'Transfer one cube'}),restore=H('button',{class:'nova-btn',text:'Reset values'}),plus=H('button',{class:'nova-btn',text:'Add 1 to chosen class'}),minus=H('button',{class:'nova-btn',text:'Remove 1 from source'});
 window.NovaLessonComponent?.applyExploreModels();const pickRow=H('div',{class:'f167-actions'},[H('label',{class:'f167-label'},['Preset',preset]),H('label',{class:'f167-label'},['Move from',from]),H('label',{class:'f167-label'},['Move to',to]),btn,plus,minus,restore]);
 window.NovaLessonComponent?.applyExploreModels();function options(){const p=d(),g=p.kind==='individual';from.innerHTML='';to.innerHTML='';(g?p.scores:p.midpoints).forEach((v,i)=>{let lab=g?`Pupil ${i+1}`:p.intervals[i];from.appendChild(H('option',{value:i,text:lab}));to.appendChild(H('option',{value:i,text:lab}));});to.value='1';btn.textContent=g?'Transfer one cube':'Transfer one pupil';plus.style.display=minus.style.display=g?'none':'';}
 window.NovaLessonComponent?.applyExploreModels();function render(){const p=d();scene(stage,{state:ex,phase:9,interactive:true,pose:p.kind==='individual'?'point-down':'compare',speech:p.kind==='individual'?'Grab the top cube of a taller tower and drop it onto another tower. The total stays constant.':'Each column shows an assumed midpoint. Drag a +1 frequency token to a different class. Removing one pupil changes the sample size.',update:render});status.textContent=p.kind==='individual'?`Total ${sum(ex.heights)}; current mean ${fmt(mean(ex.heights))}; balanced: ${ex.heights.every(x=>x===ex.heights[0])?'yes':'not yet'}.`:`Frequency ${sum(ex.freq)}; weighted sum ${weighted(ex.freq)}; estimated mean ${fmt(gmean(ex.freq))} minutes.`;}
 window.NovaLessonComponent?.applyExploreModels();function transfer(){let k=+from.value,j=+to.value,arr=isGrouped()?ex.freq:ex.heights;if(k===j||arr[k]<=0){status.textContent='Choose a different destination and a non-empty source.';return;}arr[k]--;arr[j]++;emit('transfer',{from:k,to:j,total:sum(arr)});render();}
 window.NovaLessonComponent?.applyExploreModels();btn.onclick=transfer;window.NovaLessonComponent?.applyExploreModels();restore.onclick=()=>{ex=fresh();render();emit('reset',true)};
 window.NovaLessonComponent?.applyExploreModels();plus.onclick=()=>{if(!isGrouped())return;const j=+to.value;if(sum(ex.freq)>=12){status.textContent='This diagram supports at most 12 pupils.';return;}ex.freq[j]++;emit('frequency',ex.freq.slice());render();};window.NovaLessonComponent?.applyExploreModels();minus.onclick=()=>{if(!isGrouped())return;let i=+from.value;if(ex.freq[i]<=0||sum(ex.freq)<=1){status.textContent='At least one grouped observation must remain.';return;}ex.freq[i]--;emit('frequency',ex.freq.slice());render();};
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{C.preset=preset.value;ex=fresh();options();render();emit('preset',C.preset);};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f167-guidance',text:'Use mouse or touch to move a top cube (Year 7) or a +1 frequency token (Year 8). Arrow keys adjust the same objects; the controls below provide an alternative. Only the Year 8 estimate uses class midpoints.'}),pickRow,status);
 window.NovaLessonComponent?.applyExploreModels();options();window.NovaLessonComponent?.applyExploreModels();render();window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({...structuredClone(ex),kind:d().kind,total:isGrouped()?sum(ex.freq):sum(ex.heights),mean:isGrouped()?gmean(ex.freq):mean(ex.heights)}),select:key=>{preset.value=key;preset.onchange();},move:(i,j)=>{from.value=String(i);to.value=String(j);transfer();},set:(i,v)=>{if(!Number.isInteger(v)||v<0)return;const a=isGrouped()?ex.freq:ex.heights;if(isGrouped()&&sum(a)-a[i]+v>17)return;a[i]=v;render();},reset:()=>{ex=fresh();render();}};
}
function challenge(panel,api,stage){const p=d(),group=p.kind==='grouped';let task=0;ch=group?{freq:[2,5,3,2]}:fresh(p);let updated=null;
 const status=H('p',{class:'f167-status',role:'status'});
 const sel1=makeSelect('Transfer source',[]),sel2=makeSelect('Transfer destination',[]),move=H('button',{class:'nova-btn',text:group?'Transfer pupil':'Transfer cube'});
 (group?p.midpoints:p.scores).forEach((n,i)=>{sel1.appendChild(H('option',{value:i,text:group?p.intervals[i]:`Pupil ${i+1}`}));sel2.appendChild(H('option',{value:i,text:group?p.intervals[i]:`Pupil ${i+1}`}));});sel2.value='1';
 const row=H('div',{class:'f167-actions'},[H('label',{class:'f167-label'},['From',sel1]),H('label',{class:'f167-label'},['To',sel2]),move]);
 function show(){scene(stage,{state:ch,phase:9,challenge:true,task,pose:task===0?'think':task===1?'ruler':'idea',speech:task===0?(group?'The class frequencies should be two, five, four, one. Move exactly one pupil from the final class to the third.':'Make every stack the same height by transferring cubes. Keep all twenty-five cubes.'):(group?'Use class midpoints and frequency to calculate; these are assumed midpoints.':'Add all the original scores and divide by the number of pupils.'),update:show});status.textContent=group?`Current frequencies: ${ch.freq.join(', ')}; total ${sum(ch.freq)}.`:`Current tower heights: ${ch.heights.join(', ')}; total ${sum(ch.heights)}.`;row.style.display=task===0?'flex':'none';}
 move.onclick=()=>{let i=+sel1.value,j=+sel2.value,arr=group?ch.freq:ch.heights;if(i===j||arr[i]<=0){status.textContent='Select a non-empty source and a different destination.';return;}arr[i]--;arr[j]++;emit('transfer',{from:i,to:j});show();};
 panel.append(H('p',{class:'f167-guidance',text:group?'Reconstruct the original class frequencies, then calculate the class midpoint and the estimated mean. This is an estimate because individual measurements are unknown.':'Balance the five towers without removing any cubes. Then calculate the original mean and explore how increasing one score affects it.'}),row,status);
 const tasks=group?[
 {q:'Reconstruct the frequencies 2, 5, 4, 1. Transfer one pupil from 30–40 to 20–30.',build:()=>()=>ch.freq.join(',')==='2,5,4,1',check:v=>[v===true,v?'Correct: every class now matches the recorded frequency.':'The third class needs four pupils and the final class needs one. Total frequency must remain twelve.'],hint:'Move one +1 token from the final group to the third group.',solve:()=>{ch.freq=[2,5,4,1];show();}},
 {q:'What midpoint represents the class 20 ≤ t < 30?',build:NOVA.entryTask('Class midpoint',ID),check:v=>[v===25,v===25?'Correct: halfway between 20 and 30 is 25.':v===30?'Thirty is the upper boundary, not the midpoint.':'Add the two class boundaries and divide by two.'],hint:'The midpoint is halfway between the lower and upper class boundaries.',solve:()=>{}},
 {q:'Using midpoints and frequencies, estimate the mean journey time to 2 decimal places (minutes).',build:NOVA.entryTask('Estimated mean (2 d.p.)',ID),check:v=>[Number.isFinite(v)&&Math.abs(v-220/12)<=.01,Math.abs(v-220/12)<=.01?'Correct: 220 ÷ 12 ≈ 18.33 minutes.':v===220?'That is the sum of frequency × midpoint; divide by total frequency twelve.':v===20?'That is an unweighted midpoint guess. Multiply every class midpoint by its frequency first.':'Calculate Σ(f × midpoint) ÷ Σf. The answer is approximate.'],hint:'Calculate 2×5 + 5×15 + 4×25 + 1×35, then divide by twelve.',solve:()=>{}}
 ]:[
 {q:'Make all five pupils’ towers equal using the 25 cubes. Do not remove any cubes.',build:()=>()=>ch.heights.every(x=>x===5)&&sum(ch.heights)===25,check:v=>[v===true,v?'Balanced: five towers of five, with the same 25 cubes.':sum(ch.heights)!==25?'You lost a cube: fair sharing keeps the total at twenty-five.':'The towers are not equal yet. Move cubes from taller towers to shorter ones.'],hint:'The level will be twenty-five shared between five pupils.',solve:()=>{ch.heights=[5,5,5,5,5];show();}},
 {q:'The original scores were 2, 7, 4, 6, 6. What is their mean?',build:NOVA.entryTask('Original mean',ID),check:v=>[v===5,v===5?'Correct: (2+7+4+6+6) ÷ 5 = 5.':v===25?'Twenty-five is the total, not the mean. Divide by the five pupils.':v===7?'Seven is the largest score, not the mean.':'Find the total of all five scores and divide by five.'],hint:'Sum all original scores first, then divide by the number of scores.',solve:()=>{}},
 {q:'If the final score rose from 6 to 11, what would the new mean be?',build:NOVA.entryTask('New mean',ID),check:v=>[v===6,v===6?'Correct: the new total is thirty and 30 ÷ 5 = 6.':v===5?'The total has increased by five while the number of observations stays five.':'Replace one score of six with eleven, then recompute the total and mean.'],hint:'The total rises from twenty-five to thirty. Still divide by five.',solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,tasks,k=>{task=k;show();},C);
 C._challengeState=()=>({task,kind:p.kind,values:structuredClone(ch)});
}
const DEF={id:ID,title:'Mean Explorer',config:C,steps:STEPS,render:watch,
 alt:'NOVA neon fair-share towers built of luminous cubes, or grouped data represented by class-midpoint stacks.',staticAlt:'The arithmetic mean is sum of observations divided by their count. The grouped estimate uses frequency-weighted class midpoints.',exploreIntro:'Transfer cubes without changing the total or move grouped frequency tokens, then observe the mean.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·07',title:'Mean Explorer',def:DEF,years:'Year 7 / Year 8 KS3; grouped-mean GCSE preparation.',linked:['F0-02','F0-03','F0-04','F2-03','F16-06','F16-09'],spec:{
 purpose:'Demonstrate mean as redistribution at constant total; distinguish exact individual mean from estimated grouped mean.',params:'Five individual scores with cubes, or four grouped classes with midpoint/frequency data. Drag transfers; total-conserving fair shares.',presets:'Y7-069 mean, median, mode and range · Y8-065 estimating grouped mean.',steps:'Collect → construct towers → complete → total → mean guide → transfer → balance/compare → calculation → interpret.',interactions:'Core SVG drag with valid target glow, invalid spring-back, re-grab, Escape cancellation, keyboard alternative and live arithmetic; grouped removal where appropriate.',traps:'Mean confused with sum or maximum; moving cubes changes total; midpoint assumed to be exact original; grouped estimate divided by number of classes rather than frequency.',gcse:'Frequency-weighted class-midpoint estimates with explicitly approximate results.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
