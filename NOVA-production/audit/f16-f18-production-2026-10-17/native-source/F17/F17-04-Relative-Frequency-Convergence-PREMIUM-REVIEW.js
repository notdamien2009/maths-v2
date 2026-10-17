/* F17-04 RELATIVE-FREQUENCY CONVERGENCE — NOVA F0/F2 core consumer */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_04_CONFIG={startMode:'watch',preset:'y7',events:['value','correct','step','mode','hintUsed'],valueKeys:['preset','experiment','trials','successes','relativeFrequency','theoreticalProbability','prediction','predictionCorrect','lastOutcome','reset'],presets:{
 y7:{label:'Y7-076 · Coin toss convergence',year:7,kind:'coin',pNum:1,pDen:2,space:2,event:'Heads',description:'A fair coin, heads',seed:'coinY7'},
 y8:{label:'Y8-073 · Experimental vs theory',year:8,kind:'die',pNum:2,pDen:6,space:6,event:'Roll 5 or 6',description:'Two winning faces on a fair six-sided die',seed:'dieY8'},
 y9model:{label:'Y9-042 · Theoretical probability model',year:9,kind:'eight',pNum:3,pDen:8,space:8,event:'Choose 1, 2 or 3',description:'Three equal likely outcomes among eight',seed:'modelY9'},
 y9relative:{label:'Y9-046 · Two-dice convergence',year:9,kind:'pair',pNum:6,pDen:36,space:36,event:'Sum = 7',description:'Six ordered pairs from thirty-six dice pairs',seed:'pairY9'}
 }});
const CHOICES=[{n:1,d:6},{n:1,d:4},{n:1,d:3},{n:3,d:8},{n:1,d:2}], copy=x=>JSON.parse(JSON.stringify(x)),clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),isMobile=()=>innerWidth<=500,preset=()=>CFG.presets[CFG.preset]||CFG.presets.y7;
const gcd=(a,b)=>b?gcd(b,a%b):a, frac=(n,d)=>{const g=gcd(n,d);return[n/g,d/g]}, dec=(v,dp=3)=>v===null?'—':(+v.toFixed(dp)).toString();
function Pval(p){return p.pNum/p.pDen;}
function createModel(p){return {preset:CFG.preset,history:[],prediction:null,seed:p.seed,rng:NOVA.rng.create('F17-04-'+p.seed),running:false,last:null};}
function sample(p,m){let r=m.rng.next(),out,win;if(p.kind==='coin'){out=r<.5?'H':'T';win=out==='H';}
 else if(p.kind==='die'){out=1+Math.floor(r*6);win=out>=5;}
 else if(p.kind==='eight'){out=1+Math.floor(r*8);win=out<=3;}
 else {const a=1+Math.floor(r*6),b=1+Math.floor(m.rng.next()*6);out=[a,b];win=a+b===7;}
 return {out,win};}
function runTrials(p,m,n){for(let i=0;i<n;i++){const t=sample(p,m);m.history.push(t);m.last=t;}}
function success(m){return m.history.reduce((n,o)=>n+(o.win?1:0),0);}
function observed(m){return m.history.length?success(m)/m.history.length:null;}
function emit(k,v){if(!CFG.valueKeys.includes(k))throw Error('Invalid F17-04 event key '+k);NOVA.events.emit('value',{engine:'F17-04',key:k,value:v});}
function emitModel(p,m){emit('preset',CFG.preset);emit('experiment',p.kind);emit('trials',m.history.length);emit('successes',success(m));emit('relativeFrequency',observed(m));emit('theoreticalProbability',Pval(p));emit('prediction',m.prediction);emit('predictionCorrect',m.prediction===null?null:Math.abs(CHOICES[m.prediction].n/CHOICES[m.prediction].d-Pval(p))<1e-9);}
function say(g,x,y,t,role='op',size=20,anchor='middle'){return NOVA.chalkText(g,x,y,t,{role,size,anchor});}
function stackFrac(g,x,y,n,d,role='op',size=19){const f=frac(n,d);say(g,x,y-5,String(f[0]),role,size);NOVA.neonLine(g,x-size*.66,y+2,x+size*.66,y+2,{role,width:2.3});say(g,x,y+size+2,String(f[1]),role,size);}
function fracSpan(n,d){const f=frac(n,d),g=h('span',{class:'f174-frac','aria-label':f[0]+' out of '+f[1]});g.append(h('b',{text:String(f[0])}),h('i',{'aria-hidden':'true'}),h('b',{text:String(f[1])}));return g;}
function metric(lbl,value,role='focus',den=null){const c=h('div',{class:'f174-card','data-role':role});c.appendChild(h('span',{class:'lab',text:lbl}));if(den!==null){c.appendChild(fracSpan(value,den));}else{c.appendChild(h('span',{class:'val',text:String(value)}));}return c;}
function L(){return isMobile()?{W:390,H:752,x:62,y:105,w:296,h:295,slotsY:545,slotXs:[46,120,194,268,342],slotW:64,palX:112,palY:663,remX:298,remY:663,plotTitleX:195,trailLabelY:85}:{W:840,H:675,x:80,y:85,w:680,h:300,slotsY:525,slotXs:[111,264,418,572,725],slotW:112,palX:250,palY:613,remX:660,remY:613,plotTitleX:420,trailLabelY:54};}
function plotDraw(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("plotDraw",arguments);}

 stage.innerHTML='';const A=L(),n=m.history.length,v=Pval(p);
 NOVA.cap(stage,'Relative Frequency · '+(o.title||p.description),o.tag||'LIVE GRAPH');
 const svg=S.root(A.W,A.H,'NOVA premium relative-frequency chart. A green horizontal line marks exact theoretical probability; a neon cyan path tracks cumulative successful trials divided by total trials. A draggable probability prediction can be placed into the five labelled fraction slots.');svg.classList.add('f174-plot');svg.setAttribute('data-engine-plot','F17-04');
 const graph=NOVA.plot.frame(svg,{x0:A.x,y0:A.y,w:A.w,h:A.h,x:[0,Math.max(20,Math.ceil(n/20)*20)],y:[0,1],grid:false,xStep:Math.max(5,Math.ceil(n/80)*20),yStep:.25});
 // F0 neon drawing helpers: mathematical axes, grid and experimental trace.
 const P=graph,px=x=>P.X(x),py=y=>P.Y(y);
 say(svg,A.plotTitleX,A.trailLabelY,'TRIALS  →  RELATIVE FREQUENCY','given',isMobile()?19:23);
 for(let q=0;q<=4;q++){let z=q/4;NOVA.neonLine(svg,A.x,py(z),A.x+A.w,py(z),{role:z===0?'given':'unknown',width:z===0?2.6:1.25,dash:z===0?'':'4 10'});say(svg,A.x-17,py(z)+5,dec(z,2),'given',isMobile()?15:18,'end');}
 const xmax=Math.max(20,Math.ceil(n/20)*20);for(const t of [0,Math.round(xmax/2),xmax])say(svg,px(t),A.y+A.h+28,String(t),'given',isMobile()?16:18);
 say(svg,A.x+A.w/2,A.y+A.h+59,'NUMBER OF TRIALS','unknown',isMobile()?16:19);
 const expectedY=py(v);
 NOVA.neonPath(svg,`M${A.x},${expectedY} L${A.x+A.w},${expectedY}`,{role:'result',width:3.4,dash:'10 9'});
 NOVA.neonRing(svg,A.x+A.w,expectedY,{role:'result',r:8,pulse:false});
 const markerX=clamp(A.x+A.w-(isMobile()?74:120),A.x+62,A.x+A.w-36);
 say(svg,markerX,expectedY-15,'THEORY', 'result',isMobile()?15:19);
 if(n){const d=m.history.map((s,i)=>[i+1,s.win?1:0]);let total=0;const points=d.map(([i,s])=>{total+=s;return [i,total/i]});
  const path=points.map(([k,f],i)=>(i?'L':'M')+px(k).toFixed(2)+','+py(f).toFixed(2)).join(' ');
  const neon=NOVA.neonPath(svg,path,{role:'focus',width:isMobile()?3.6:4.4});neon.setAttribute('data-experimental-curve','1');
  const last=points[points.length-1],lastX=px(last[0]),lastY=py(last[1]);
  NOVA.neonRing(svg,lastX,lastY,{role:'focus',r:isMobile()?9:12,pulse:false});
  // Observe points at intervals without cluttering the plotted curve.
  const stride=Math.max(1,Math.ceil(points.length/18));for(let i=stride-1;i<points.length-1;i+=stride)NOVA.neonRing(svg,px(points[i][0]),py(points[i][1]),{role:'focus',r:2.8,pulse:false});
  if(o.animate&&!NOVA.reducedMotion()) {neon.style.opacity='0';M.tween(750,t=>neon.style.opacity=String(t),M.ease.inOut);}
 }
 if(o.interact){
  say(svg,A.plotTitleX,A.slotsY-(isMobile()?52:53),'SNAP YOUR THEORETICAL PREDICTION','given',isMobile()?16:19);
  const zones=[];
  CHOICES.forEach((c,i)=>{
   const cx=A.slotXs[i],cy=A.slotsY,w=A.slotW,hg=isMobile()?62:68;
   const current=m.prediction===i;
   NOVA.neonBox(svg,cx-w/2,cy-hg/2,w,hg,{role:current?'result':'given',r:13});
   stackFrac(svg,cx,cy-9,c.n,c.d,current?'result':'op',isMobile()?18:22);
   zones.push({x:cx-w/2,y:cy-hg/2,w,h:hg,id:'p'+i,kind:'drop'});
  });
  const tray={x:A.remX-72,y:A.remY-28,w:144,h:58,id:'remove',kind:'remove'};
  NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'error',r:13,text:'REMOVE',size:19});
  const palette=E('g',{tabindex:0,role:'button','aria-label':'Draggable prediction token. Drag onto a probability fraction or use the keyboard controls below.','data-pred-palette':'1'},svg);
  NOVA.neonBox(palette,A.palX-69,A.palY-26,138,52,{role:'focus',r:13,text:'PREDICT',size:19});
  const activeZones=[...zones,tray];
  function place(id){let idx=+String(id).slice(1);if(!Number.isInteger(idx)||idx<0||idx>=CHOICES.length)return false;m.prediction=idx;emit('prediction',idx);emit('predictionCorrect',Math.abs(CHOICES[idx].n/CHOICES[idx].d-v)<1e-9);o.onChange?.();return true;}
  NOVA.ui.svgDrag(svg,palette,{box:{x:A.palX-69,y:A.palY-26,w:138,h:52},zones:()=>activeZones,removeTo:{x:A.remX,y:A.remY},onDrop:place,onRemove:()=>{}});
  if(m.prediction!==null){const cx=A.slotXs[m.prediction],cy=A.slotsY,token=E('g',{tabindex:0,role:'button', 'aria-label':'Placed prediction token. Drag to another fraction or REMOVE. Press Delete to remove.','data-pred-placed':'1'},svg);
    // Luminous ring protects the fraction's legibility while remaining grabbable.
    NOVA.neonRing(token,cx,cy,{role:'result',r:isMobile()?33:40,pulse:false});
    NOVA.ui.svgDrag(svg,token,{box:{x:cx-32,y:cy-28,w:64,h:56},zones:()=>activeZones,removeTo:{x:A.remX,y:A.remY},onDrop:place,onRemove:()=>{m.prediction=null;emit('prediction',null);o.onChange?.();}});
    token.addEventListener('keydown',e=>{if(['Delete','Backspace'].includes(e.key)){e.preventDefault();m.prediction=null;emit('prediction',null);o.onChange?.();}});
  }
  say(svg,A.palX,A.palY-45,'DRAG THE CHIP','focus',isMobile()?14:16);
 } else {
  // A compact outcome strip gives a visually useful legend in Watch / Guided.
  const y=A.slotsY-8; say(svg,A.plotTitleX,y-53,'MOST RECENT EXPERIMENT OUTCOMES','given',isMobile()?15:19);
  const last=m.history.slice(-10),jump=isMobile()?31:48,x0=A.plotTitleX-jump*4.5;
  for(let i=0;i<10;i++){const q=last[i],x=x0+i*jump;NOVA.neonRing(svg,x,y,{role:q==null?'given':q.win?'result':'unknown',r:isMobile()?11:14,pulse:false});if(q)say(svg,x,y+31,q.win?'W':'N',q.win?'result':'unknown',isMobile()?15:17);}
  say(svg,A.plotTitleX,A.palY+8,n?'Wins '+success(m)+' of '+n+' trials':'Theoretical target '+dec(v,4),'focus',isMobile()?19:23);
 }
 stage.appendChild(svg);
 const metrics=h('div',{class:'f174-readouts'});
 metrics.appendChild(metric('THEORETICAL',p.pNum,'result',p.pDen));metrics.appendChild(metric('OBSERVED',n?dec(observed(m),4):'—','focus'));metrics.appendChild(metric('TRIALS / WINS',n+' / '+success(m),'unknown'));
 stage.appendChild(metrics);
 const msg=o.say||(n?'The observed line moves as trials accumulate; the theoretical line does not.':'Theoretical probability is fixed by the equally likely sample space.');
 NOVA.scene.helperStrip(stage,o.pose||'explain',msg);
 if(o.flash)M.flash(svg,px(Math.max(1,n)),py(n?observed(m):v),'result',56);
 return {svg,layout:A,graph,model:m,preset:p};
}
const steps=[
{name:'Meet the probability model',pose:'explain',mood:'neutral',narration:'The theoretical probability is fixed by all equally likely outcomes. This horizontal green line shows the value we expect in the long run.',prompt:'What is fixed before any trials are run?'},
{name:'Predict each trial',pose:'point-down',mood:'focus',narration:'An individual trial may succeed or fail. Even when a coin is fair, the results do not have to alternate between heads and tails.',prompt:'Must every second coin toss give heads?'},
{name:'Run the experiment',pose:'count',mood:'focus',narration:'As we conduct trials, we count successes and divide by the total so far. This creates an observed relative frequency.',prompt:'Why does the graph jump more at the beginning?'},
{name:'Watch the changing curve',pose:'compare',mood:'focus',narration:'The experimental line may be above or below the theoretical level. A short sequence can be misleading.',prompt:'Does experimental probability always equal theoretical probability?'},
{name:'Collect more evidence',pose:'think',mood:'focus',narration:'Larger samples often give a steadier estimate. However, the experimental line need not get closer after every single new trial.',prompt:'Can the gap briefly increase, even after many trials?'},
{name:'Compare and generalise',pose:'celebrate',mood:'cheer',narration:'Use the theoretical chance to predict, and relative frequency to evaluate the evidence. The two values have different jobs.',prompt:'Which is a long-run model, and which comes from collected data?'}
];
function demo(p,n){const m=createModel(p);runTrials(p,m,n);return m;}
function drawStep(i,stage){const n=clamp(i,0,5),p=preset(),m=demo(p,[20,20,30,50,160,400][n]),msg=[
'Follow the straight green theoretical reference; it will not drift.',
'Individual outcomes are random even when their probabilities are known.',
'Add successes, then divide by the number of trials.',
'Compare the luminous observed line with the steady green reference.',
'Large samples can still move temporarily away from the expected value.',
'Theory describes a model. Experiments supply evidence.'
][n];plotDraw(stage,p,m,{title:steps[n].name,tag:'STEP '+(n+1)+'/6',say:msg,pose:steps[n].pose,animate:n===2,flash:n===5});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=preset(),m=createModel(p),animation=null;
 window.NovaLessonComponent?.applyExploreModels();const btn=(txt,fn)=>h('button',{class:'nova-btn',text:txt,onclick:fn}),pres=h('select',{class:'nova-input','aria-label':'Lesson preset'}),pred=h('select',{class:'nova-input','aria-label':'Prediction fraction'}),status=h('div',{class:'f174-status',role:'status','aria-live':'polite'}),batches=h('div',{class:'f174-box'}),options=h('div',{class:'f174-box'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([key,val])=>pres.appendChild(h('option',{value:key,text:val.label})));
 window.NovaLessonComponent?.applyExploreModels();CHOICES.forEach((c,i)=>pred.appendChild(h('option',{value:String(i),text:frac(c.n,c.d).join(' over ')})));
 window.NovaLessonComponent?.applyExploreModels();function redraw(flash=false){let scene=plotDraw(stage,p,m,{title:p.description,tag:'LIVE EXPERIMENT',interact:true,flash,pose:m.prediction===null?'think':m.prediction!==null&&Math.abs(CHOICES[m.prediction].n/CHOICES[m.prediction].d-Pval(p))<1e-9?'compare':'encourage',say:m.prediction===null?'Which theoretical probability belongs to this experiment? Drag PREDICT into a fraction slot.':'Read the live curve: after '+m.history.length+' trials, the observed frequency is '+(observed(m)==null?'unknown':dec(observed(m),4))+'.',onChange:()=>{emitModel(p,m);redraw();}});
  const n=m.history.length,w=success(m);status.textContent=n+' trials · '+w+' successes · observed '+dec(observed(m),4)+' · theoretical '+dec(Pval(p),4)+(m.prediction!==null?(Math.abs(CHOICES[m.prediction].n/CHOICES[m.prediction].d-Pval(p))<1e-9?' · prediction correct':' · check your prediction'):'');
  status.className='f174-status'+(m.prediction!==null&&Math.abs(CHOICES[m.prediction].n/CHOICES[m.prediction].d-Pval(p))<1e-9?' good':'');return scene;}
 window.NovaLessonComponent?.applyExploreModels();function stop(){if(animation?.stop)animation.stop();animation=null;m.running=false;NOVA.ui.cancelDrag();}
 window.NovaLessonComponent?.applyExploreModels();function setPreset(k){stop();CFG.preset=k;p=preset();m=createModel(p);runTrials(p,m,16);pres.value=k;emitModel(p,m);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function setPrediction(i){m.prediction=i==null?null:clamp(+i,0,CHOICES.length-1);emitModel(p,m);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function run(n){if(m.running)return;
  // Each trial recorded exactly once. Batch animation reveals genuine observations.
  const before=m.history.length;runTrials(p,m,n);emit('lastOutcome',m.last?.out);emitModel(p,m);
  if(NOVA.reducedMotion()||n>100){redraw(true);return;}
  m.running=true;const prev=copy(m.history);m.history.length=before;
  animation=M.tween(n===1?570:720,t=>{let target=before+Math.max(1,Math.floor(t*n));m.history=prev.slice(0,target);redraw();},M.ease.inOut,()=>{m.history=prev;m.running=false;animation=null;emitModel(p,m);redraw(true);});
 }
 window.NovaLessonComponent?.applyExploreModels();pres.onchange=()=>setPreset(pres.value);
 window.NovaLessonComponent?.applyExploreModels();const place=btn('Place prediction',()=>setPrediction(+pred.value));window.NovaLessonComponent?.applyExploreModels();const remove=btn('Remove prediction',()=>setPrediction(null));
 window.NovaLessonComponent?.applyExploreModels();options.appendChild(h('label',{class:'f174-label'},['Lesson preset ',pres]));window.NovaLessonComponent?.applyExploreModels();options.appendChild(h('label',{class:'f174-label'},['Theoretical prediction ',pred]));window.NovaLessonComponent?.applyExploreModels();options.append(place,remove);
 window.NovaLessonComponent?.applyExploreModels();batches.append(btn('Run 1 trial',()=>run(1)),btn('Run 20 trials',()=>run(20)),btn('Run 100 trials',()=>run(100)),btn('Run 500 trials',()=>run(500)),btn('Clear trials',()=>{stop();m.history=[];m.last=null;emit('reset','trials');emitModel(p,m);redraw();}),btn('Reset model',()=>setPreset(CFG.preset)));
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f174-info',text:'Compare the jagged experimental frequency with the fixed green theoretical line. Drag the PREDICT chip onto a fraction, re-grab to move it, or drop it into REMOVE. Equivalent keyboard controls are below.'}),options,batches,status);
 window.NovaLessonComponent?.applyExploreModels();pres.value=CFG.preset;window.NovaLessonComponent?.applyExploreModels();runTrials(p,m,16);window.NovaLessonComponent?.applyExploreModels();emitModel(p,m);window.NovaLessonComponent?.applyExploreModels();redraw();
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,model:{history:copy(m.history),prediction:m.prediction,last:m.last},trials:m.history.length,wins:success(m),relative:observed(m),theoretical:Pval(p),correctPrediction:m.prediction===null?null:Math.abs(CHOICES[m.prediction].n/CHOICES[m.prediction].d-Pval(p))<1e-9}),setPreset,placePrediction:setPrediction,run:(n)=>{stop();runTrials(p,m,n);emitModel(p,m);redraw();},reset:()=>setPreset(CFG.preset)};
 window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>{stop();});
}
function challenge(panel,api,stage){
 const tasks=[
  {q:'A fair coin lands heads 9 times in 20 tosses. What is the EXPERIMENTAL relative frequency? Enter a decimal.',build:NOVA.entryTask('Experimental relative frequency','F17-04'),check:v=>[Math.abs(v-.45)<1e-9,Math.abs(v-.45)<1e-9?'Correct. 9 ÷ 20 = 0.45.':v===.5?'One half is the theoretical chance, not the observed frequency in these 20 tosses.':v===9?'Nine is the number of successes; divide it by all twenty trials.':'Use successful results divided by the total number of trials.'],hint:'Nine successful results out of twenty trials: calculate 9 ÷ 20.'},
  {q:'An experiment has 8 successes in 24 trials. What is the relative frequency as a decimal? (Enter to at least 3 decimal places.)',build:NOVA.entryTask('Relative frequency','F17-04'),check:v=>[Math.abs(v-1/3)<.0006,Math.abs(v-1/3)<.0006?'Correct. The observed frequency is one third.':v===.5?'Half is not obtained from eight out of twenty-four.':'Divide eight successes by twenty-four trials, then convert to decimal.'],hint:'Reduce eight over twenty-four before dividing.'},
  {q:'Two fair dice give 36 equally likely ordered pairs, and 6 have sum 7. How many favourable pairs are there?',build:NOVA.entryTask('Favourable pairs','F17-04'),check:v=>[v===6,v===6?'Correct. Six out of thirty-six pairs have sum seven.':v===7?'Seven is the required SUM, not the number of favourable pairs.':v===3?'Remember (1,6) and (6,1) are different ordered pairs.':'List (1,6), (2,5), (3,4) and their reverses.'],hint:'Count both (1,6) and (6,1).'},
  {q:'When the number of fair trials increases, must relative frequency move closer to the theoretical probability after EVERY trial?',build:NOVA.choiceTask([{label:'Yes — every added trial closes the gap.',value:'yes'},{label:'No — it can temporarily move further away.',value:'no'},{label:'It must match theory after exactly 100 trials.',value:'100'}],'F17-04'),check:v=>[v==='no',v==='no'?'Correct. Long-run stabilisation is not a promise of improvement on every trial.':v==='100'?'There is no exact trial count that guarantees agreement.':'A new outcome can temporarily increase the difference.'],hint:'The law of large numbers describes long-run behaviour, not a strictly decreasing error after every trial.'}
 ];
 function draw(i){const keys=['y7','y8','y9relative','y9model'],p=CFG.presets[keys[i]],m=demo(p,[20,24,36,100][i]);if(i===0){m.history=Array.from({length:20},(_,j)=>({out:j<9?'H':'T',win:j<9}));}if(i===1){m.history=Array.from({length:24},(_,j)=>({out:j<8?5:1,win:j<8}));}
  plotDraw(stage,p,m,{title:'Challenge '+(i+1)+' · work from the evidence',tag:'TASK '+(i+1)+'/4',pose:'think',say:['Use the outcomes observed, not the probability you expected.','Eight successes out of twenty-four trials is a relative frequency.','Ordered pairs: two dice give thirty-six possible outcomes.','The observed line may temporarily move away from theory.'][i]});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-04')return;const dock=stage.querySelector('.nv-dock');if(dock)dock.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'Exactly. You have distinguished theoretical probability from observed outcomes.':'Use the observed successes and the full trial count; check what the question asks.');if(e.detail.correct){const svg=stage.querySelector('svg.f174-plot');if(svg){const A=L();M.flash(svg,A.x+A.w*.82,A.y+A.h*.46,'result',60);}}});api.onCleanup(off);
}
const DEF={id:'F17-04',title:'Relative-Frequency Convergence',config:CFG,steps,render:drawStep,
 alt:'Interactive glowing frequency convergence chart showing recorded successes per trial, a fixed theoretical probability line, labelled axes and draggable prediction cards.',staticAlt:'Relative frequency equals successful trials divided by total trials. With more fair independent trials it tends to the theoretical probability, but not necessarily closer after each trial.',exploreIntro:'Simulate trials and watch cumulative relative frequency fluctuate around the true probability. Drag a prediction token to the matching probability fraction.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-04',DEF,{models:{},tables:{"CHOICES":()=>CHOICES,"steps":()=>steps},draws:{"plotDraw":["stage","p","m","o"]},exploreFields:{}});
NOVA.bankMount({id:'F17-04',num:'F17·04',title:'Relative-Frequency Convergence',def:DEF,years:'KS3 Years 7, 8 and 9; GCSE experimental probability and law of large numbers.',linked:['F0-02','F0-03','F0-04','F0-14','F17-01','F17-02','F17-03','F17-05'],spec:{purpose:'Make relative-frequency convergence visible through genuine independent trials and compare sample estimates with the underlying probability model.',params:'Fair coin, six-face die, eight equally likely outcomes, pair of dice; trial counts 1/20/100/500; live cumulative frequency, seed and drag prediction.',presets:'Y7-076 fair coin heads, probability 1/2; Y8-073 roll 5 or 6, probability 1/3; Y9-042 3 favourable of 8, probability 3/8; Y9-046 sum 7 with two dice, probability 1/6.',steps:'Meet model → trial variation → simulate → track changing curve → increase trials → generalise. Six narrated steps, F0 timeline, reduced-motion safe.',interactions:'Watch, Guided, Explore and Challenge. Real independent trials, neon graph, five fraction targets; drag/re-grab prediction, red remove, green valid snap, keyboard prediction select; four checked Challenges.',traps:'Treating experimental proportion as a fixed theoretical chance, believing a fair coin alternates, confusing favourable counts and chances, expecting strict monotonic convergence, counting ordered dice pairs incorrectly.',gcse:'Law of large numbers, unbiased simulations, long-run predictions and interpretation of noisy sample estimates.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5500);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
