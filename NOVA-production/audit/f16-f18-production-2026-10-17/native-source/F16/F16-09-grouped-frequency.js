/* F16-09 Grouped Frequency — exact pinned NOVA F0/F2 shared runtime; no replacement shell. */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,M=NOVA.motion,ID='F16-09';
const C=window.NovaV2Integration.configuration(window.NOVA_F16_09_CONFIG={preset:'y8-tables',events:['value','frequency','observation','preset','mode','step','hintUsed','correct','reset'],presets:{
 'y8-tables':{lesson:'Y8-064',label:'Y8-064 · Grouped frequencies',title:'Journeys to school',context:'How are journey times distributed across equal ten-minute intervals?',bounds:[0,10,20,30,40],frequencies:[3,5,4,2],raw:[6,15,24,3,34,14,26,19,11,22,9,37,18,27],unit:'minutes'},
 'y8-mean':{lesson:'Y8-065',label:'Y8-065 · Estimated mean',title:'Grouped travel times',context:'Use class midpoints and frequencies to estimate a mean time.',bounds:[0,10,20,30,40],frequencies:[2,5,4,1],raw:[2,11,25,15,4,32,12,21,19,26,24,17],unit:'minutes'},
 'y9-repr':{lesson:'Y9-047',label:'Y9-047 · Represent grouped data',title:'Practice scores',context:'Choose a scale, read grouped bars and use class midpoints cautiously.',bounds:[0,10,20,30,40,50],frequencies:[2,3,6,4,1],raw:[2,14,25,33,8,22,45,19,29,16,31,23,38,27,36,24],unit:'marks'}
}});
const STEPS=[
 {name:'Collect the observations',pose:'count',narration:'Each measurement belongs to exactly one class interval.',prompt:'How many individual observations were collected?'},
 {name:'Set continuous class boundaries',pose:'ruler',narration:'The lower boundary belongs to each class; the upper boundary begins the next class.',prompt:'Where would an exact score of twenty belong?'},
 {name:'Count the first class',pose:'point-left',narration:'Count values from zero inclusive to ten exclusive. Write one frequency.',prompt:'How many values belong in the first class?'},
 {name:'Build the full frequency table',pose:'count',narration:'Tally every observation once. The frequencies together equal the number of data points.',prompt:'Do the frequencies add up to the sample size?'},
 {name:'Raise the grouped frequency bars',pose:'point-down',narration:'Bar height shows frequency. Intervals have equal widths and remain in numerical order.',prompt:'Which class occurs most often?'},
 {name:'Check the total frequency',pose:'compare',narration:'Adding the class frequencies gives the sample size, not the sum of measurements.',prompt:'What does the frequency total count?'},
 {name:'Find class midpoints',pose:'think',narration:'A class midpoint is halfway between the two class boundaries.',prompt:'What is the midpoint of twenty to thirty?'},
 {name:'Weight midpoint by frequency',pose:'idea',narration:'Multiply each class midpoint by its frequency and add those products.',prompt:'Why must we use the frequency as a weight?'},
 {name:'Interpret the estimate',pose:'celebrate',narration:'Divide the weighted midpoint total by the total frequency. Without the original values, this is an estimate.',prompt:'Why is the grouped mean not necessarily exact?'}
];
const p=()=>C.presets[C.preset],sum=a=>a.reduce((t,v)=>t+v,0),mids=pr=>pr.bounds.slice(0,-1).map((b,i)=>(b+pr.bounds[i+1])/2),weighted=(f,pr)=>sum(f.map((n,i)=>n*mids(pr)[i])),fmt=x=>Number(x.toFixed(2)).toString(),mean=(f,pr)=>sum(f)?weighted(f,pr)/sum(f):0;
const fresh=()=>({freq:p().frequencies.slice()});
const emit=(key,value)=>NOVA.events.emit('value',{engine:ID,key,value});
const text=(sv,x,y,value,role='given',size=24,anchor='middle')=>NOVA.chalkText(sv,x,y,String(value),{role,size,anchor});
const shape=(sv,x,y,w,h,role='given',r=9)=>NOVA.neonBox(sv,x,y,w,h,{role,r});
const interval=(pr,i)=>`${pr.bounds[i]}–${pr.bounds[i+1]}`;
const rect={};
function layout(){const mobile=innerWidth<=540;return mobile?{
 mobile,W:450,H:952,table:{x:24,y:117,w:402,rowH:50,headH:52,footH:46},graph:{x:52,y:548,w:348,h:240},trayY:842,remove:{x:298,y:890,w:126,h:43},barBase:788,barTop:552
 }:{mobile,W:790,H:780,table:{x:34,y:178,w:356,rowH:61,headH:54,footH:51},graph:{x:442,y:218,w:295,h:360},trayY:660,remove:{x:600,y:690,w:150,h:48},barBase:578,barTop:218};}
function raw(sv,pr,l,phase){
 const nums=pr.raw,cols=l.mobile?7:8,cellW=l.mobile?55:74,cellH=l.mobile?57:62,blockW=cols*cellW,x0=(l.W-blockW)/2,y0=l.mobile?238:220;
 text(sv,l.W/2,165,phase===0?'Collected observations':'Build the class boundaries','focus',l.mobile?34:39);
 shape(sv,l.mobile?20:65,190,l.mobile?410:660,l.mobile?315:270,'given',21);
 for(let k=0;k<nums.length;k++){
  const col=k%cols,row=Math.floor(k/cols),x=x0+col*cellW+3,y=y0+row*(cellH+10);
  shape(sv,x,y,cellW-6,cellH,k%2?'given':'focus',10);
  text(sv,x+(cellW-6)/2,y+cellH*.68,nums[k],k%2?'given':'focus',l.mobile?27:31);
 }
 const y=l.mobile?560:530;
 shape(sv,l.mobile?27:98,y,l.mobile?396:594,110,'focus',16);
 text(sv,l.W/2,y+39,phase===0?`${nums.length} individual measurements`:'Each boundary belongs to one class','given',l.mobile?25:32);
 text(sv,l.W/2,y+82,phase===0?'No value should be counted twice.':'10 belongs in 10–20, not 0–10.','result',l.mobile?24:28);
 if(phase===1){
  pr.bounds.slice(0,-1).forEach((b,i)=>{
   let rows=l.mobile?3:5,col=i%rows,row=Math.floor(i/rows),ww=l.mobile?124:126;
   let cx=(l.W-rows*ww)/2+(col+.5)*ww,by=l.mobile?715+row*55:700;
   shape(sv,cx-ww/2+4,by,ww-8,47,i%2?'focus':'given',9);
   text(sv,cx,by+31,interval(pr,i),i%2?'focus':'given',l.mobile?23:25);
  });
 }else{
  text(sv,l.W/2,l.mobile?746:715,'Next: sort them into intervals','support',l.mobile?26:32);
 }
}

function table(sv,l,o){let pr=p(),f=o.state.freq,T=l.table,n=f.length,head=T.y,headH=T.headH,rowH=T.rowH;
 const shown=o.interactive||o.challenge?n:o.phase>=3?n:o.phase===2?1:0;
 text(sv,T.x+T.w/2,head-21,'Grouped frequency table','focus',l.mobile?27:32);
 shape(sv,T.x,head,T.w,headH,'given',13);
 const split=T.x+T.w*.37,split2=T.x+T.w*.65;
 text(sv,T.x+T.w*.18,head+34,'Class', 'given',l.mobile?23:25);
 text(sv,T.x+T.w*.51,head+34,'Frequency','focus',l.mobile?21:24);
 text(sv,T.x+T.w*.82,head+34,'Midpoint','support',l.mobile?21:23);
 const dropZones=[];
 for(let i=0;i<n;i++){
  let y=head+headH+i*rowH,v=shown>i?f[i]:null,mid=mids(pr)[i],color=i%2?'focus':'given';
  shape(sv,T.x,y,T.w,rowH-3,color,10);
  text(sv,T.x+T.w*.18,y+rowH*.63,interval(pr,i),'given',l.mobile?23:25);
  text(sv,T.x+T.w*.81,y+rowH*.63,(o.phase>=6||o.interactive||o.challenge)?mid:'·','support',l.mobile?25:26);
  const fx=T.x+T.w*.51;
  if(o.interactive||(o.challenge&&o.task===0)){
   const token=shape(sv,fx-25,y+8,50,rowH-17,'focus',12);
   text(token,fx,y+rowH*.62,v,'focus',l.mobile?28:29);
   token.dataset.token=String(i);token.setAttribute('tabindex','0');token.setAttribute('role','button');
   token.setAttribute('aria-label',`Frequency ${f[i]} in class ${interval(pr,i)}. Drag to another class to transfer one observation, delete removes one.`);
   const zones=()=>dropZones.concat({id:'remove',kind:'remove',...l.remove});
   const transfer=dest=>{if(dest===i||f[i]<1||!Number.isInteger(dest)||dest<0||dest>=n)return false;f[i]--;f[dest]++;emit('frequency',{from:i,to:dest,values:f.slice()});o.update();return true;};
   NOVA.ui.svgDrag(sv,token,{box:{x:fx-25,y:y+8,w:50,h:rowH-17},zones,onDrop:id=>id.startsWith('class:')&&transfer(+id.slice(6)),onRemove:()=>{if(f[i]<1||sum(f)<=2)return;f[i]--;emit('frequency',{removed:i,values:f.slice()});o.update();},removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+22}});
   token.addEventListener('pointerdown',e=>{try{token.setPointerCapture(e.pointerId)}catch(_){}});
   token.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete'].includes(e.key))return;e.preventDefault();if(f[i]<1)return;if(e.key==='Delete'){if(sum(f)<=2)return;f[i]--;emit('frequency',{removed:i,values:f.slice()});o.update();return;}
    const dest=(i+(e.key==='ArrowLeft'||e.key==='ArrowUp'?n-1:1))%n;transfer(dest);});
  }else{text(sv,fx,y+rowH*.63,v===null?'?':v,'focus',l.mobile?29:31);}
  dropZones.push({id:'class:'+i,kind:'drop',x:T.x+4,y:y+3,w:T.w-8,h:rowH-6});
 }
 const yy=head+headH+n*rowH;
 shape(sv,T.x,yy,T.w,T.footH,'result',11);
 text(sv,T.x+T.w*.18,yy+T.footH*.68,'Total','support',l.mobile?24:26);
 text(sv,T.x+T.w*.51,yy+T.footH*.68,shown===n?sum(f):'?','result',l.mobile?28:31);
 text(sv,T.x+T.w*.82,yy+T.footH*.68,'Σ f','support',l.mobile?24:25);
}
function graph(sv,l,o){const pr=p(),freq=o.state.freq,n=freq.length,g=l.graph,mx=Math.max(8,...freq)+1,base=l.barBase,unitH=g.h/mx,
 chartTop=l.barTop,regionW=g.w/n;
 text(sv,g.x+g.w/2,l.mobile?511:176,'Grouped frequency diagram','focus',l.mobile?26:29);
 const P=NOVA.neonPlot(sv,{x0:g.x,y0:chartTop,w:g.w,h:g.h,x:[0,n],y:[0,mx],xStep:1,yStep:1,grid:true,categories:pr.bounds.slice(0,-1)});
 for(let v=0;v<=mx;v+=2){let y=P.Y(v);NOVA.neonLine(sv,g.x-5,y,g.x+g.w,y,{role:'support',width:1.3});text(sv,g.x-20,y+8,v,'support',l.mobile?23:20);}
 NOVA.neonLine(sv,g.x,base,g.x+g.w,base,{role:'given',width:3});
 NOVA.neonLine(sv,g.x,chartTop-6,g.x,base,{role:'given',width:3});
 text(sv,g.x-17,chartTop-17,'f','support',23);
 for(let i=0;i<n;i++){
  let f=(o.interactive||o.challenge||o.phase>=4)?freq[i]:o.phase===3?freq[i]:0;
  const w=regionW-7,x=g.x+i*regionW+3.5,height=f*unitH,y=base-height,col=i%2?'focus':'given';
  if(f>0){let bar=shape(sv,x,y,w,height,col,3); if(!o.interactive&&!o.challenge&&o.phase===4)M.arrive(bar,0,15+i*8,300);
   if(i%2)for(let stripe=1;stripe<f;stripe++)NOVA.neonLine(sv,x+4,base-stripe*unitH,x+w-4,base-stripe*unitH,{role:'focus',width:1});}
  text(sv,x+w/2,base+31,interval(pr,i),'given',l.mobile?23:21);
  if(f>0||o.interactive||o.challenge)text(sv,x+w/2,y-10,f,'focus',l.mobile?25:27);
  if(o.interactive){const by=y-22,handle=shape(sv,x+w/2-15,by,30,28,'result',12);text(handle,x+w/2,by+21,'↕','result',25);
   handle.dataset.bar=String(i);handle.setAttribute('role','button');handle.setAttribute('tabindex','0');handle.setAttribute('aria-label',`Adjust height of class ${interval(pr,i)}, current frequency ${freq[i]}; arrow keys change frequency.`);
   NOVA.ui.svgDrag(sv,handle,{box:{x:x+w/2-15,y:by,w:30,h:28},zones:()=>Array.from({length:mx},(_,v)=>({id:'height:'+v,kind:'drop',x:x-3,y:base-v*unitH-unitH/2,w:w+6,h:unitH})),onDrop:id=>{if(!id.startsWith('height:'))return false;let k=+id.slice(7);if(k===freq[i])return false;freq[i]=k;emit('frequency',{class:i,value:k,values:freq.slice()});o.update();return true;}});
   handle.addEventListener('pointerdown',e=>{try{handle.setPointerCapture(e.pointerId)}catch(_){}});
   handle.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();freq[i]=Math.min(mx-1,Math.max(0,freq[i]+(e.key==='ArrowUp'?1:-1)));emit('frequency',{class:i,value:freq[i],values:freq.slice()});o.update();});
  }
 }
 // Clear teaching annotation remains below the bars, above the drag/recycle controls.
 text(sv,g.x+g.w/2,base+75,(o.phase>=5||o.interactive||o.challenge)?`Total frequency = ${sum(freq)}`:'Count each observation once','result',l.mobile?23:25);
}
function extras(sv,l,o){const pr=p(),freq=o.state.freq,total=sum(freq),ws=weighted(freq,pr),av=mean(freq,pr),active=o.interactive||o.challenge,phase=o.phase,n=freq.length;
 const yy=l.mobile?828:648;
 if(active){
  shape(sv,l.remove.x,l.remove.y,l.remove.w,l.remove.h,'error',10);
  text(sv,l.remove.x+l.remove.w/2,l.remove.y+29,'Remove −1','error',l.mobile?20:24);
 }else if(phase===0||phase===1){
  text(sv,l.W/2,l.mobile?895:698,phase===0?`${pr.raw.length} observations collected`:'Boundary values start the next class','support',l.mobile?23:29);
 }else{
  text(sv,l.W/2,l.mobile?884:695,phase>=8?`Estimated mean ≈ ${fmt(av)} ${pr.unit}`:phase>=7?`Σ(f × midpoint) = ${ws}`:phase>=6?'Midpoints represent class centres':'One observation → one class','result',l.mobile?24:28);
 }
}
function scene(stage,o={}){
if(window.NovaLessonComponent?.active){[stage,o]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';let pr=p(),l=layout(),phase=o.phase??8,state=o.state||fresh();
 NOVA.cap(stage,pr.context,`${pr.lesson} · GROUPED FREQUENCY`);
 const sv=NOVA.svg.root(l.W,l.H,'A premium NOVA grouped frequency table and matching frequency bars. Class midpoint calculations estimate rather than recover original observations.');sv.classList.add('f169-svg');
 // Avoid duplicating raw-data cards over the table heading: raw values appear as a top collection, then in a source strip for reference.
 if(phase<2&&!o.interactive&&!o.challenge)raw(sv,pr,l,phase);
 else{ text(sv,l.W/2,39,pr.title,'focus',l.mobile?31:37);table(sv,l,{...o,phase,state});graph(sv,l,{...o,phase,state});extras(sv,l,{...o,phase,state}); }stage.append(sv);
 const chips=H('div',{class:'f169-info'});if(phase>=5||o.interactive||o.challenge){chips.append(NOVA.neonTile(`n = ${sum(state.freq)}`,{role:'given'}));}
 if((phase>=6||o.interactive)&&!(o.challenge&&o.task<2))chips.append(NOVA.neonTile(`Σ(f × midpoint) = ${weighted(state.freq,pr)}`,{role:'focus'}));
 if((phase>=8||o.interactive)&&!(o.challenge&&o.task<3))chips.append(NOVA.neonTile(`Estimated mean ≈ ${fmt(mean(state.freq,pr))}`,{role:'result'}));
 stage.append(chips);NOVA.scene.helperStrip(stage,o.pose||'count',o.speech||'Each value belongs to one class. The total frequency counts observations.');return sv;
}
const speeches=[
 'These are measurements in their collected order. We need sensible class intervals before grouping.',
 'Each interval includes its lower boundary, but not its upper boundary. A score of twenty belongs in twenty to thirty.',
 'Begin with the first class. Each observation counted here appears just once in the frequency table.',
 'Count all class frequencies. Every measurement must appear in exactly one group.',
 'Watch the glowing bars rise. Their heights match the table frequencies, not the class midpoints.',
 'The total frequency is the number of observations, not the sum of their measured values.',
 'A midpoint lies halfway between boundaries. It represents the whole class only for estimation.',
 'Multiply each frequency by its class midpoint and add those contributions.',
 'Divide the weighted sum by the frequency total. Grouping loses precise values, so call the result an estimate.'
];
function watch(i,stage){scene(stage,{phase:i,state:fresh(),pose:STEPS[i].pose,speech:speeches[i]});}
function select(label,entries){const el=H('select',{class:'nova-input','aria-label':label});entries.forEach(([v,t])=>el.append(H('option',{value:String(v),text:t})));return el;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let st=fresh(),pr=p();window.NovaLessonComponent?.applyExploreModels();const preset=select('Lesson preset',Object.entries(C.presets).map(([k,v])=>[k,v.label]));window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;
 window.NovaLessonComponent?.applyExploreModels();const from=select('Move frequency from',[]),to=select('Move frequency to',[]),plus=H('button',{class:'nova-btn primary',text:'Transfer one'}),add=H('button',{class:'nova-btn',text:'Add one'}),remove=H('button',{class:'nova-btn',text:'Remove one'}),reset=H('button',{class:'nova-btn',text:'Reset table'}),stat=H('p',{class:'f169-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();function options(){pr=p();from.innerHTML='';to.innerHTML='';pr.frequencies.forEach((_,i)=>{from.append(H('option',{value:i,text:interval(pr,i)}));to.append(H('option',{value:i,text:interval(pr,i)}));});to.value='1';}
 window.NovaLessonComponent?.applyExploreModels();function render(){scene(stage,{phase:9,state:st,interactive:true,pose:'point-down',speech:'Drag a class frequency token onto another table row, or lift a bar-height handle. Watch the grouped table and bars change together.',update:render});stat.textContent=`${sum(st.freq)} measurements; class frequencies ${st.freq.join(', ')}; estimated mean ${fmt(mean(st.freq,p()))} ${p().unit}.`;}
 window.NovaLessonComponent?.applyExploreModels();plus.onclick=()=>{let a=+from.value,b=+to.value;if(a===b||!st.freq[a]){stat.textContent='Choose different classes and a source with at least one observation.';return;}st.freq[a]--;st.freq[b]++;emit('frequency',{from:a,to:b,values:st.freq.slice()});render();};
 window.NovaLessonComponent?.applyExploreModels();add.onclick=()=>{let a=+to.value;if(st.freq[a]>=8){stat.textContent='This scale displays at most eight observations per class.';return;}st.freq[a]++;emit('frequency',{added:a,values:st.freq.slice()});render();};
 window.NovaLessonComponent?.applyExploreModels();remove.onclick=()=>{let a=+from.value;if(st.freq[a]<1||sum(st.freq)<=2)return;st.freq[a]--;emit('frequency',{removed:a,values:st.freq.slice()});render();};
 window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{st=fresh();emit('reset',true);render();};window.NovaLessonComponent?.applyExploreModels();preset.onchange=()=>{C.preset=preset.value;st=fresh();options();emit('preset',C.preset);render();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f169-help',text:'Transfer one frequency between class rows by dragging the glowing table tiles. Raise or lower a bar with its ↕ handle. The red tray removes a counted observation. Arrow keys and the selectors provide equivalent controls.'}),H('div',{class:'f169-action'},[H('label',{class:'f169-control'},['Lesson',preset]),H('label',{class:'f169-control'},['From class',from]),H('label',{class:'f169-control'},['To class',to]),plus,add,remove,reset]),stat);window.NovaLessonComponent?.applyExploreModels();options();window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:()=>({preset:C.preset,frequencies:st.freq.slice(),total:sum(st.freq),weighted:weighted(st.freq,p()),estimate:mean(st.freq,p())}),select:key=>{preset.value=key;preset.onchange()},transfer:(a,b)=>{if(a===b||st.freq[a]<1)return;st.freq[a]--;st.freq[b]++;render();},set:(i,v)=>{if(!Number.isInteger(v)||v<0||v>8||i<0||i>=st.freq.length)return;st.freq[i]=v;render();},reset:()=>{st=fresh();render();}};
}
function challenge(panel,api,stage){const pr=p();let task=0,st=fresh();st.freq[1]++;st.freq[2]--;const stat=H('p',{class:'f169-status',role:'status'}),from=select('Challenge transfer source class',pr.frequencies.map((_,i)=>[i,interval(pr,i)])),to=select('Challenge transfer destination class',pr.frequencies.map((_,i)=>[i,interval(pr,i)]));from.value='1';to.value='2';
 const transfer=H('button',{class:'nova-btn primary',text:'Move one observation'}),row=H('div',{class:'f169-action'},[H('label',{class:'f169-control'},['From',from]),H('label',{class:'f169-control'},['To',to]),transfer]);
 function render(){scene(stage,{phase:9,state:st,challenge:true,task,pose:task===0?'count':task===1?'ruler':'think',speech:task===0?'One value was assigned to the wrong class. Transfer it back and keep the total frequency.':task===1?'The midpoint is halfway between the two class boundaries.':'Estimate from weighted class midpoints, not from class labels alone.',update:render});stat.textContent=`Current grouped frequencies: ${st.freq.join(', ')}.`;row.style.display=task===0?'flex':'none';}
 transfer.onclick=()=>{let i=+from.value,j=+to.value;if(i===j||st.freq[i]<=0){stat.textContent='Choose a non-empty source and a different destination.';return;}st.freq[i]--;st.freq[j]++;emit('frequency',{from:i,to:j,values:st.freq.slice()});render();};
 panel.append(H('p',{class:'f169-help',text:'Use the neon frequency tokens to repair the table. Then interpret the class midpoint and estimate a mean from grouped data. No individual values are treated as known from the grouped table.'}),row,stat);
 const second=Math.min(2,pr.frequencies.length-1),correct=pr.frequencies.slice(),mid=mids(pr)[second],estimate=mean(correct,pr);
 const qs=[
  {q:`One value was put in ${interval(pr,1)} instead of ${interval(pr,2)}. Transfer it and restore the original grouped frequencies.`,build:()=>()=>st.freq.every((v,i)=>v===correct[i]),check:v=>[v===true,v?'Correct: each class frequency matches the observations, and the total is preserved.':'The second class has one extra observation and the third class is short of one. Transfer rather than changing the total.'],hint:'Drag the frequency tile from the second class to the third, or use the source and destination selectors.',solve:()=>{st.freq=correct.slice();render();}},
  {q:`Find the midpoint of the class ${interval(pr,second)}.`,build:NOVA.entryTask('Class midpoint',ID),check:v=>[v===mid,v===mid?`Correct: (${pr.bounds[second]} + ${pr.bounds[second+1]}) ÷ 2 = ${mid}.`:v===pr.bounds[second+1]?'That is an upper boundary, not the midpoint.':'Find the number halfway between the two class boundaries.'],hint:'Add the two class boundaries and divide by two.',solve:()=>{}},
  {q:`Using class midpoints, estimate the mean ${pr.unit === 'minutes'?'time':'score'} to 2 decimal places.`,build:NOVA.entryTask('Estimated grouped mean',ID),check:v=>{const ok=Number.isFinite(v)&&Math.abs(v-estimate)<=.011;return [ok,ok?`Correct: the estimated mean is ${fmt(estimate)} ${pr.unit}.`:v===weighted(correct,pr)?'That is the weighted total, not the estimate. Divide by total frequency.':v===sum(correct)?'That is total frequency, not estimated mean. Weight each midpoint then divide by frequency.':'Use Σ(f × midpoint) ÷ Σf. It is an estimate, not an exact mean.'];},hint:`Multiply class midpoints by their frequencies, sum the products, then divide by ${sum(correct)}.`,solve:()=>{}}
 ];
 NOVA.challengeRun(panel,api,qs,k=>{task=k;render();},C);C._challengeState=()=>({task,frequencies:st.freq.slice(),target:correct.slice(),midpoint:mid,estimate});
}
const DEF={id:ID,title:'Grouped Frequency',config:C,steps:STEPS,render:watch,alt:'Grouped frequency table with illuminated adjacent interval-frequency bars; interactive frequency tokens and bar heights.',staticAlt:'Each measurement belongs in exactly one class; total frequency is the sample size and the grouped midpoint mean is an estimate.',exploreIntro:'Transfer counted observations between class intervals, resize the frequency bars and compare the live grouped estimate.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS,"speeches":()=>speeches},draws:{"scene":["stage","o"]},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·09',title:'Grouped Frequency',def:DEF,years:'Year 8 and Year 9 KS3, GCSE preparation.',linked:['F0-02','F0-03','F0-04','F16-02','F16-07','F16-12'],spec:{purpose:'Create, read and check grouped frequency tables and interval-frequency diagrams, and distinguish exact counts from midpoint-based estimates.',params:'Continuous non-overlapping class boundaries; 4 or 5 equal-width intervals, live frequency counts, weighted midpoint estimate.',presets:'Y8-064 grouped frequency tables; Y8-065 estimating mean from grouped data; Y9-047 grouped data representations.',steps:'Gather → boundaries → first group → full frequency table → bars → total → midpoints → weights → interpret estimate.',interactions:'Core NOVA SVG drag of table frequency tokens into other rows, bar height adjustment with snapping, red removal tray, Escape and keyboard equivalents.',traps:'Overlapping boundaries; skipping values; treating frequency as the midpoint; dividing weighted total by class count; calling a grouped estimate exact.',gcse:'Frequency-weighted grouped estimate and evidence-based display selection.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
