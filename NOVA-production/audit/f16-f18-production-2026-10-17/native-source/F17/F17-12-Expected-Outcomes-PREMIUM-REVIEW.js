
/* F17-12 Expected Outcomes · Original NOVA core retained unchanged */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const PRESETS={y9:{label:'Y9-045 · Independent events',year:9,a:[3,5],b:[2,5],trials:100,context:'A and B are independent events'}};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_12_CONFIG={startMode:'watch',preset:'y9',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','firstProbability','secondProbability','jointProbability','plannedTrials','expected','observed','completedTrials','slot','prediction','lastTrial','reset','complete'],presets:PRESETS});
const gcd=(a,b)=>b?gcd(b,a%b):a;
const F=(n,d=1)=>{if(!d)throw Error('Denominator zero');const g=gcd(Math.abs(n),Math.abs(d))||1;return [n/g,d/g];};
const val=f=>f[0]/f[1],mul=(a,b)=>F(a[0]*b[0],a[1]*b[1]),fmt=x=>Number.isInteger(x)?String(x):String(Math.round(x*100)/100),mobile=()=>innerWidth<=500;
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('undeclared event key '+key);NOVA.events.emit('value',{engine:'F17-12',key,value});};
const chalk=(p,x,y,t,role='given',size=24)=>NOVA.chalkText(p,x,y,String(t),{role,size});
const line=(p,x,y,X,Y,role='op',width=4)=>NOVA.neonLine(p,x,y,X,Y,{role,width});
const path=(p,d,role='op',fill=false,width=4)=>NOVA.neonPath(p,d,{role,fill,width});
function makeModel(p){return {a:[...p.a],b:[...p.b],planned:p.trials,actual:0,success:0,atA:0,atB:0,predicted:null,seed:17212026,last:'—',selected:0,flash:false};}
const expected=m=>m.planned*val(mul(m.a,m.b));
function picks(m){let k=expected(m),a=[k,m.planned*val(m.a),m.planned*val(m.b),m.planned];a=a.map(n=>Math.round(n*100000)/100000);let u=[...new Set(a)];for(let i=0;u.length<4&&i<12;i++){let t=Math.round((k+(i+1)*m.planned*.07)*100000)/100000;if(!u.includes(t))u.push(t);}return u.slice(0,4).sort((a,b)=>a-b);}
function rng(m){m.seed^=m.seed<<13;m.seed^=m.seed>>>17;m.seed^=m.seed<<5;return (m.seed>>>0)/4294967296;}
function run(m,n){for(let i=0;i<n;i++){let a=rng(m)<val(m.a),b=rng(m)<val(m.b);if(a)m.atA++;if(b)m.atB++;if(a&&b)m.success++;m.actual++;m.last=a?(b?'A and B':'A only'):(b?'B only':'Neither');}emit('observed',m.success);emit('completedTrials',m.actual);emit('lastTrial',m.last);}
function clearResults(m){m.actual=0;m.success=0;m.atA=0;m.atB=0;m.last='—';m.predicted=null;emit('reset','observations');}
function layout(){return mobile()?{W:440,H:1152,a:{x:24,y:143,w:182,h:143},b:{x:234,y:143,w:182,h:143},join:{x:105,y:354,w:230,h:158},expected:{x:31,y:629,w:378,h:53},observed:{x:31,y:736,w:378,h:53},slotX:[72,170,269,368],slotY:927,slotW:88,tray:{x:24,y:1053,w:208,h:78},remove:{x:254,y:1053,w:163,h:78},tokenX:126,tokenY:1091}: {W:960,H:1015,a:{x:85,y:104,w:310,h:145},b:{x:566,y:104,w:310,h:145},join:{x:351,y:303,w:258,h:161},expected:{x:77,y:559,w:808,h:54},observed:{x:77,y:680,w:808,h:54},slotX:[209,390,572,753],slotY:849,slotW:144,tray:{x:88,y:930,w:265,h:61},remove:{x:660,y:930,w:211,h:61},tokenX:220,tokenY:961};}
function fractionSVG(p,x,y,f,role='result',size=29){chalk(p,x,y-10,f[0],role,size);line(p,x-27,y+7,x+27,y+7,role,3);chalk(p,x,y+43,f[1],role,size);}
function fractionHTML(f){let n=h('span',{class:'f1712-frac','aria-label':`${f[0]} over ${f[1]}`});n.append(h('b',{text:String(f[0])}),h('i',{'aria-hidden':'true'}),h('b',{text:String(f[1])}));return n;}
function stat(title,v,role='given',frac=false){let b=h('div',{class:'f1712-stat','data-role':role},[h('span',{class:'lab',text:title})]);b.append(frac?fractionHTML(v):h('strong',{class:'val',text:String(v)}));return b;}
function drawBar(svg,box,n,d,role){const x=box.x,y=box.y,w=box.w,h=box.h;
 NOVA.neonBox(svg,x,y,w,h,{role:'given',r:17});
 const pct=Math.max(0,Math.min(1,d?n/d:0)); if(pct>0)NOVA.neonBox(svg,x+4,y+5,Math.max(6,(w-8)*pct),h-10,{role,r:13});
 const count=10;for(let i=1;i<count;i++){let xx=x+w*i/count;line(svg,xx,y+8,xx,y+h-8,'given',1.3);} }
function drawScene(stage,m,o={}){
if(window.NovaLessonComponent?.active){[stage,m,o]=window.NovaLessonComponent.args("drawScene",arguments);}

 stage.replaceChildren();const L=layout(),sm=mobile(),ind=mul(m.a,m.b),e=expected(m),choices=picks(m),isInteractive=!!o.interact;
 NOVA.cap(stage,o.title||'Expected outcomes · probability prediction',o.tag||'F17 · CHANCE × TRIALS');
 let svg=S.root(L.W,L.H,'Two probability gates A and B combine into their independent intersection. The lower comparison bars represent expected successes from planned trials and observed successes from real simulated trials. A draggable forecast token snaps into one of four expected outcome slots.');svg.classList.add('f1712-plot');svg.setAttribute('data-engine-plot','F17-12');
 chalk(svg,L.W/2,sm?49:42,'INDEPENDENT EVENTS','focus',sm?26:32);
 chalk(svg,L.W/2,sm?94:80,'Each trial needs A AND B','given',sm?21:27);
 for(const [letter,box,prob,role]of [['A',L.a,m.a,'given'],['B',L.b,m.b,'focus']]){
  NOVA.neonBox(svg,box.x,box.y,box.w,box.h,{role,r:20});
  chalk(svg,box.x+box.w/2,box.y+34,'EVENT '+letter,role,sm?23:25);
  fractionSVG(svg,box.x+box.w/2,box.y+84,prob,'result',sm?25:30);
 }
 // Existing NOVA neon paths construct the causal convergence lines.
 const ax=L.a.x+L.a.w/2,bx=L.b.x+L.b.w/2,jx=L.join.x+L.join.w/2;
 path(svg,`M${ax} ${L.a.y+L.a.h+4} Q${ax} ${L.join.y-26} ${jx} ${L.join.y+4}`,'given',false,5);
 path(svg,`M${bx} ${L.b.y+L.b.h+4} Q${bx} ${L.join.y-26} ${jx} ${L.join.y+4}`,'focus',false,5);
 NOVA.neonRing(svg,jx,L.join.y+6,{role:'result',r:10,pulse:o.flash===true});
 NOVA.neonBox(svg,L.join.x,L.join.y+19,L.join.w,L.join.h-20,{role:'op',r:22});
 chalk(svg,jx,L.join.y+55,'A AND B','op',sm?27:31);
 fractionSVG(svg,jx,L.join.y+108,ind,'result',sm?25:29);
 const explY=sm?557:503;
 chalk(svg,L.W/2,explY,`${m.planned} planned trials · expected ${o.hideAnswer?'?':fmt(e)} successes`,'focus',sm?19:27);
 const rate=val(ind);
 drawBar(svg,L.expected,rate,1,'result');
 drawBar(svg,L.observed,m.success,Math.max(m.actual,1),'focus');
 chalk(svg,L.expected.x+L.expected.w/2,L.expected.y-17,'EXPECTED RATE','result',sm?23:24);
 chalk(svg,L.observed.x+L.observed.w/2,L.observed.y-17,'OBSERVED RATE','focus',sm?23:24);
 const labelY=sm?861:797;
 chalk(svg,L.W/2,labelY,o.hideAnswer?'PREDICT THE EXPECTED NUMBER':'SNAP YOUR FORECAST','given',sm?24:27);
 const zones=[];
 choices.forEach((n,i)=>{const x=L.slotX[i],y=L.slotY,r=L.slotW/2;
  NOVA.neonBox(svg,x-r,y-29,L.slotW,62,{role:m.predicted===i?'result':'given',r:15});
  if(!o.hideAnswer)chalk(svg,x,y+12,fmt(n),m.predicted===i?'result':'given',sm?25:28);
  else chalk(svg,x,y+12,'?', 'given',sm?27:30);
  zones.push({id:'choice'+i,kind:'drop',x:x-r,y:y-37,w:L.slotW,h:80});
 });
 const tray=L.tray,remove=L.remove;
 NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'given',r:16});
 NOVA.neonBox(svg,remove.x,remove.y,remove.w,remove.h,{role:'error',r:16,text:'REMOVE',size:sm?23:25});
 chalk(svg,tray.x+tray.w/2,tray.y-14,'FORECAST TOKEN','given',sm?20:21);
 let where=(m.predicted===null)?{x:L.tokenX,y:L.tokenY}:{x:L.slotX[m.predicted],y:L.slotY};
 if(isInteractive){
  let token=E('g',{'data-forecast':'marker',tabindex:0,role:'button','aria-label':'Drag the forecast token into an expected outcome slot; arrow keys navigate choices, Enter confirms placement, Escape cancels drag.'},svg);
  NOVA.neonRing(token,where.x,where.y,{role:'unknown',r:sm?23:25,pulse:false});
  chalk(token,where.x,where.y+7,'E','result',sm?21:23);
  zones.push({...remove,id:'remove',kind:'remove'});
  NOVA.ui.svgDrag(svg,token,{box:{x:where.x-27,y:where.y-27,w:54,h:54},zones:()=>zones,removeTo:{x:remove.x+remove.w/2,y:remove.y+remove.h/2},onDrop:id=>{if(!/^choice[0-3]$/.test(id))return false; m.predicted=Number(id.slice(6));emit('prediction',choices[m.predicted]);emit('slot',m.predicted);o.changed();return true;},onRemove:()=>{m.predicted=null;emit('slot','tray');o.changed();}});
  token.addEventListener('keydown',ev=>{if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(ev.key)){ev.preventDefault();m.selected=(m.selected+(['ArrowLeft','ArrowUp'].includes(ev.key)?3:1))%4; m.predicted=m.selected;emit('prediction',choices[m.predicted]);o.changed(true);} else if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();m.predicted=m.selected;emit('prediction',choices[m.predicted]);o.changed(true);} else if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();m.predicted=null;o.changed(true);}});
 }else{
  NOVA.neonRing(svg,where.x,where.y,{role:'unknown',r:sm?23:25});chalk(svg,where.x,where.y+7,'E','result',sm?21:23);
 }
 stage.append(svg);
 let read=h('div',{class:'f1712-readouts'});
 read.append(stat('P(A AND B)',ind,'focus',true),stat('EXPECTED COUNT',o.hideAnswer?'?':fmt(e),'result'),stat('OBSERVED COUNT',`${m.success} of ${m.actual}`,'given'));
 stage.append(read);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Multiply the two event chances, then multiply by the planned number of trials. The observed result may be different.');
 if(o.flash)M.flash(svg,L.join.x+L.join.w/2,L.join.y+68,'result',70);
 return {svg,choices,prob:ind,expected:e};
}
const steps=[
 {name:'Define the independent events',pose:'explain',narration:'Independent means the result of A does not change the probability of B. Both events must happen for a success.',prompt:'What does independent mean?'},
 {name:'Show the two probabilities',pose:'point-down',narration:'Read the exact probabilities of A and B. Each is a fraction between zero and one.',prompt:'Which fractions describe the two events?'},
 {name:'Combine A AND B',pose:'think',narration:'For independent events, multiply the two probabilities. The result is the chance that both A and B happen in a single trial.',prompt:'Do we add or multiply for independent A AND B?'},
 {name:'Choose a number of trials',pose:'count',narration:'An expected outcome is the planned number of trials multiplied by the probability of a success. It is an average prediction, not a guarantee.',prompt:'Why do we multiply the probability by trials?'},
 {name:'Simulate the experiment',pose:'compare',narration:'Trials generate real results. Even if the expected success count is twenty four, the observed count can be higher or lower.',prompt:'Why can the two bars differ?'},
 {name:'Explain expected versus observed',pose:'celebrate',narration:'The expected count is a theoretical average. A random experiment varies, and the expected count does not need to be a whole number.',prompt:'Is an expected count a promised outcome?'}
];
function renderStep(i,stage){i=Math.max(0,Math.min(5,i));const m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("renderStep.m",(...a)=>makeModel(...a),[PRESETS.y9]):(makeModel(PRESETS.y9)));if(i>=4){run(m,i===4?25:100);}drawScene(stage,m,{step:i,title:steps[i].name,tag:`TEACHING STEP ${i+1} / 6`,pose:steps[i].pose,say:steps[i].narration,flash:i===5,hideAnswer:i<3});if(i===4&&!NOVA.reducedMotion()){const bar=stage.querySelector('svg.f1712-plot');if(bar){M.flash(bar,layout().W/2,layout().observed.y+20,'focus',90);}}}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();const m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("m",(...a)=>makeModel(...a),[PRESETS.y9]):(makeModel(PRESETS.y9)));
 window.NovaLessonComponent?.applyExploreModels();const choicesA=[[3,5],[1,2],[2,3],[4,5]],choicesB=[[2,5],[1,3],[1,2],[3,4]];
 window.NovaLessonComponent?.applyExploreModels();const choose=(options,label)=>{let node=h('select',{class:'nova-input','aria-label':label});options.forEach(f=>node.append(h('option',{value:`${f[0]}-${f[1]}`,text:`${f[0]} of ${f[1]}`})));return node;};
 window.NovaLessonComponent?.applyExploreModels();let aSel=choose(choicesA,'Probability A'),bSel=choose(choicesB,'Probability B');
 window.NovaLessonComponent?.applyExploreModels();let tSel=h('select',{class:'nova-input','aria-label':'Planned trials'});window.NovaLessonComponent?.applyExploreModels();[25,50,60,100,120,200,500].forEach(n=>tSel.append(h('option',{value:String(n),text:`${n} trials`})));window.NovaLessonComponent?.applyExploreModels();tSel.value='100';
 window.NovaLessonComponent?.applyExploreModels();let slot=h('select',{class:'nova-input','aria-label':'Expected outcome target'});window.NovaLessonComponent?.applyExploreModels();let status=h('p',{class:'f1712-status',role:'status','aria-live':'polite'}),detail=h('p',{class:'f1712-info'});
 window.NovaLessonComponent?.applyExploreModels();const button=(txt,fn)=>h('button',{class:'nova-btn',text:txt,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function updateChoices(){const old=slot.value;slot.replaceChildren();picks(m).forEach((n,i)=>slot.append(h('option',{value:String(i),text:`Expected ${fmt(n)}`})));slot.value=old&&Number(old)<4?old:'0';}
 window.NovaLessonComponent?.applyExploreModels();function draw(preserveFocus=false){drawScene(stage,m,{interact:true,changed:draw,pose:m.flash?'celebrate':'think',say:m.flash?'Good. Notice the expected count can differ from your actual experiment.':'Place the forecast token, then run trials to test the expectation.'});let pp=mul(m.a,m.b),correct=expected(m),chosen=m.predicted===null?null:picks(m)[m.predicted];status.textContent=`Theoretical probability ${Math.round(val(pp)*10000)/100}% · Expect ${fmt(correct)} successes in ${m.planned} trials. ${chosen===null?'Choose a forecast.':(Math.abs(chosen-correct)<1e-7?'Forecast matches theory.':'Forecast differs from theory.')}`;detail.textContent=`Observed ${m.success} successes in ${m.actual} trials · A happened ${m.atA} times · B happened ${m.atB} times · Last pair: ${m.last}.`;emit('jointProbability',val(pp));emit('expected',correct);emit('plannedTrials',m.planned);if(preserveFocus)stage.querySelector('[data-forecast]')?.focus();}
 window.NovaLessonComponent?.applyExploreModels();function input(){m.a=aSel.value.split('-').map(Number);m.b=bSel.value.split('-').map(Number);m.planned=Number(tSel.value);clearResults(m);updateChoices();emit('firstProbability',val(m.a));emit('secondProbability',val(m.b));draw();}
 window.NovaLessonComponent?.applyExploreModels();function chooseSlot(i){let j=Number(i);if(!Number.isInteger(j)||j<0||j>=4)return false;m.predicted=j;m.selected=j;emit('prediction',picks(m)[j]);draw();return true;}
 window.NovaLessonComponent?.applyExploreModels();function launch(n){run(m,n);m.flash=true;draw();m.flash=false;let l=layout();M.flash(stage.querySelector('svg.f1712-plot'),l.W/2,l.observed.y+24,'focus',85);}
 window.NovaLessonComponent?.applyExploreModels();function replay(){clearResults(m);draw();}
 window.NovaLessonComponent?.applyExploreModels();aSel.addEventListener('change',input);window.NovaLessonComponent?.applyExploreModels();bSel.addEventListener('change',input);window.NovaLessonComponent?.applyExploreModels();tSel.addEventListener('change',input);
 window.NovaLessonComponent?.applyExploreModels();let row=h('div',{class:'f1712-controls'},[h('label',{class:'f1712-field'},['Probability of A',aSel]),h('label',{class:'f1712-field'},['Probability of B',bSel]),h('label',{class:'f1712-field'},['Number of trials',tSel])]);
 window.NovaLessonComponent?.applyExploreModels();let row2=h('div',{class:'f1712-controls'},[button('Simulate 1',()=>launch(1)),button('Simulate 10',()=>launch(10)),button('Simulate 100',()=>launch(100)),button('Reset trials',replay)]);
 window.NovaLessonComponent?.applyExploreModels();let row3=h('div',{class:'f1712-controls'},[h('label',{class:'f1712-field'},['Keyboard forecast target',slot]),button('Place forecast',()=>chooseSlot(slot.value)),button('Remove forecast',()=>{m.predicted=null;draw();})]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f1712-info',text:'A success occurs only when both independent events happen. Drag the E token to predict the expected number; or use the accessible forecast controls below. Run independent simulated trials to compare observed success counts. Changing the model clears previous trials.'}),row,row2,row3,status,detail);
 window.NovaLessonComponent?.applyExploreModels();updateChoices();window.NovaLessonComponent?.applyExploreModels();draw(); window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({...m,a:[...m.a],b:[...m.b],choices:picks(m),prob:mul(m.a,m.b),expected:expected(m)}),set:a=>{if(a.a){m.a=[...a.a];aSel.value=m.a.join('-');}if(a.b){m.b=[...a.b];bSel.value=m.b.join('-');}if(a.planned){m.planned=a.planned;tSel.value=String(m.planned);}clearResults(m);updateChoices();draw();},choose:chooseSlot,remove:()=>{m.predicted=null;draw();},run:launch,reset:replay};
}
function challenge(panel,api,stage){let tasksData=[
 {q:'If independent event A has probability three fifths and event B has probability two fifths, how many joint successes are expected in 100 trials?',a:[3,5],b:[2,5],n:100,ans:24,wrong:[[40,'Forty uses the probability of B alone; multiply both probabilities first.'],[60,'Sixty uses the probability of A alone.'],[100,'Not every trial is a success; multiply the trials by both chances.']],hint:'Multiply the probability of A by the probability of B, then by 100.'},
 {q:'The probability of A is one half and the independent probability of B is one third. How many joint successes are expected in 60 trials?',a:[1,2],b:[1,3],n:60,ans:10,wrong:[[30,'That counts A alone.'],[20,'That counts B alone.'],[50,'Do not add the expected counts.']],hint:'The combined chance is one-sixth. Multiply by 60.'},
 {q:'Independent event A has probability two thirds and event B has probability three quarters. What is the expected number of joint successes in 80 trials?',a:[2,3],b:[3,4],n:80,ans:40,wrong:[[60,'Sixty counts B, not A AND B.'],[80,'Not every outcome is a success.'],[53.33,'That is A alone. Multiply by B too.']],hint:'Multiply two-thirds by three-quarters, then multiply by 80.'},
 {q:'Independent event A has probability one half and event B has probability one third. In 25 trials, how many joint successes are expected? Give a decimal to 2 places.',a:[1,2],b:[1,3],n:25,ans:25/6,wrong:[[4,'The theoretical expectation is not necessarily a whole number.'],[12.5,'That counts A alone.'],[8.33,'That counts B alone.']],hint:'Multiply 25 by one sixth, then round the expected count to two decimal places.'}
 ];
 let tasks=tasksData.map((q,i)=>({q:q.q,build:NOVA.entryTask('Expected successes','F17-12'),check:v=>{let ok=Number.isFinite(v)&&Math.abs(v-q.ans)<(i===3?.011:1e-7),bad=q.wrong.find(([n])=>Math.abs(v-n)<.02);return [ok,ok?'Correct. You multiplied the two independent chances by the number of trials.':bad?bad[1]:'Find P(A AND B) by multiplying, then multiply by the planned trials.'];},hint:q.hint}));
 function show(i){let q=tasksData[i],m=makeModel({a:q.a,b:q.b,trials:q.n});drawScene(stage,m,{title:`Challenge ${i+1} · Expected outcomes`,tag:`QUESTION ${i+1} / 4`,hideAnswer:true,pose:'think',say:'Two independent events: first multiply the chances, then multiply by the planned trial count.'});}
 NOVA.challengeRun(panel,api,tasks,show,CFG);
 let off=NOVA.events.on('correct',ev=>{let d=ev.detail||{};if(d.engine!=='F17-12')return;stage.querySelector('.nv-dock')?.remove();NOVA.scene.helperStrip(stage,d.correct?'celebrate':'not-yet',d.correct?'That is the expected average. A real experiment may differ.':'Check that you multiplied both probabilities before the trial count.');if(d.correct){let l=layout();M.flash(stage.querySelector('svg.f1712-plot'),l.W/2,l.join.y+72,'result',85);}});api.onCleanup(off);
}
const DEF={id:'F17-12',title:'Expected Outcomes',config:CFG,steps,render:renderStep,alt:'Neon two-gate independent-event probability machine, theoretically expected and observed rate bars, four target slots and one draggable forecast token.',staticAlt:'Independent A and B with probabilities 3/5 and 2/5. Combined probability 6/25. Expected 24 successes in 100 trials.',exploreIntro:'Choose two independent probabilities, vary the number of trials, forecast successes with a draggable token and compare with actual simulations.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-12',DEF,{models:{},tables:{"PRESETS":()=>PRESETS,"steps":()=>steps},draws:{"drawScene":["stage","m","o"]},exploreFields:{"m":{"kind":"factory","factory":"makeModel","argCount":1},"renderStep.m":{"kind":"factory","factory":"makeModel","argCount":1}}});
NOVA.bankMount({id:'F17-12',num:'F17·12',title:'Expected Outcomes',def:DEF,years:'Year 9 and GCSE extensions.',linked:['F0-02','F0-03','F0-04','F0-06','F17-04','F17-07','F17-11'],spec:{purpose:'Expected number of independent A AND B successes from number of trials × product of event probabilities; compare expectation and observed frequency.',params:'Exact fractions for each event; 25–500 planned trials; 4 snapped prediction targets; reproducible random simulation; four assessment contexts.',presets:'Y9-045 Independent events (one canonical lesson preset; adjustable examples).',steps:'Identify independence → show each fraction → multiply for AND → expected count → simulate → compare outcomes.',interactions:'NOVA neonBox/path/ring/chalkText constructions; svgDrag forecast token with four green drop zones and red removal, cancel/regrab and keyboard equivalent.',traps:'Adding independent probabilities, using only A or only B, treating expected as guaranteed, rounding theoretical expected count to integer.',gcse:'Expected frequencies and joint probabilities with independence.'}});
const log=document.getElementById('log');if(log){let add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4800);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();

