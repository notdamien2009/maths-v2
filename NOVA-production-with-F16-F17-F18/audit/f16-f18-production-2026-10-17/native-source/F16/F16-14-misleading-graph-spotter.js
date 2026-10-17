/* F16-14 · NOVA Maths V2 — Misleading Graph Spotter. Original pinned NOVA runtime unchanged. */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,ID='F16-14';
const CONFIG=window.NovaV2Integration.configuration(window.NOVA_F16_14_CONFIG={preset:'y7-bar',events:['value','repair','preset','mode','step','correct','hintUsed','reset'],presets:{
 'y7-pictogram':{lesson:'Y7-066',label:'Y7-066 · Pictogram key',title:'Reading a picture chart',kind:'pictogram',desc:'Every icon represents three pupils, but the misleading key claims six.',names:['Apples','Bananas','Pears'],counts:[12,18,9],trueKey:3,falseKey:6,expected:18,wrong:36,fault:'An incorrect pictogram key exaggerates every category.',repair:'One symbol = 3 pupils. The key agrees with the frequency data.',prompt:'Which key makes the symbols match the source counts?',options:['The key must agree with frequencies','More symbols always mean the key is correct','A pictogram needs no key'],correct:0},
 'y7-bar':{lesson:'Y7-071',label:'Y7-071 · Cropped bar axis',title:'A very dramatic bar chart?',kind:'bar',desc:'A vertical scale starting at 48 makes a difference of seven look enormous.',names:['Oak','Ash','Elm'],counts:[52,56,59],expected:7,wrong:59,fault:'The axis begins at 48, making small differences look much larger.',repair:'The vertical scale now starts at zero; the same values are plotted.',prompt:'What changed when the graph was repaired?',options:['The underlying values changed','The vertical axis now starts at zero','The categories were renamed'],correct:1},
 'y9-distribution':{lesson:'Y9-049',label:'Y9-049 · Comparing spread',title:'Same mean, different spread',kind:'spread',desc:'Two teams have the same mean, but very different ranges.',sets:[[6,8,10,12,14],[9,9,10,11,11]],expected:8,wrong:2,fault:'The claim compares only means and ignores a much wider range for Team A.',repair:'Both means are 10, but Team A has range 8 and Team B range 2.',prompt:'Which statement is justified by both datasets?',options:['Equal means prove the spreads are equal','Team B has a greater mean','The means are equal but Team A has greater spread'],correct:2},
 'y9-correlation':{lesson:'Y9-050',label:'Y9-050 · Correlation and causation',title:'Association is not proof',kind:'scatter',desc:'Six pairs show positive association but not proof that one variable causes another.',points:[[2,35],[3,42],[4,56],[5,59],[6,70],[7,73]],expected:6,wrong:73,fault:'The title claims the graph proves a causal relationship.',repair:'The pattern shows positive association; other variables may be involved.',prompt:'What conclusion follows from the scatter graph alone?',options:['There is positive association, not proven causation','Every extra hour must cause ten extra marks','The two measures have no relationship'],correct:0},
 'y9-sampling':{lesson:'Y9-052',label:'Y9-052 · Sampling bias',title:'Who was actually asked?',kind:'sample',desc:'Sixteen of twenty members of a sports club preferred an activity. It does not describe the entire school.',names:['Yes','No'],counts:[16,4],expected:80,wrong:100,fault:'The caption generalises twenty club members to every school pupil.',repair:'80% of twenty surveyed sports-club members preferred it; the school-wide result is unknown.',prompt:'Which limitation must be reported?',options:['Twenty surveyed people represent every pupil','One club may not represent the whole school','The sample had no respondents'],correct:1}
}});
const p=()=>CONFIG.presets[CONFIG.preset];
const STEPS=[
{name:'Start with recorded observations',pose:'count',narration:'Before believing any graph, inspect the data and ask where it came from.',prompt:'What data were collected?'},
{name:'Choose a visual representation',pose:'point-down',narration:'A chart should preserve the meaning of the original observations.',prompt:'What must stay truthful?'},
{name:'Build the graph',pose:'count',narration:'Add each category or plotted observation in the correct position.',prompt:'What does each mark represent?'},
{name:'Read the completed graph',pose:'magnify',narration:'Read the title, scale, key, plotted values and source before making a claim.',prompt:'What might be easy to miss?'},
{name:'Locate the misleading feature',pose:'think',narration:'A graph can display real numbers and still create a deceptive impression.',prompt:'Which part of the presentation is suspect?'},
{name:'Explain why it matters',pose:'question',narration:'Ask whether the fault changes how we interpret the size, context or strength of the result.',prompt:'Why does this mislead the reader?'},
{name:'Repair the presentation',pose:'ruler',narration:'Correct the scale, symbol key, comparison or claim while keeping the original data intact.',prompt:'What must stay unchanged?'},
{name:'Compare the two interpretations',pose:'compare',narration:'Compare the original claim with the accurate interpretation. Evidence is stronger than visual drama.',prompt:'What does the data really show?'},
{name:'Defend an evidence-based conclusion',pose:'celebrate',narration:'State a conclusion supported by the data and acknowledge the limits of that evidence.',prompt:'How would you explain the correction?'}
];
const say=(svg,x,y,text,role='given',size=26,anchor='middle')=>NOVA.chalkText(svg,x,y,String(text),{role,size,anchor});
const box=(svg,x,y,w,h,role='focus',r=12)=>NOVA.neonBox(svg,x,y,Math.max(2,w),Math.max(2,h),{role,r});
const ln=(svg,x,y,X,Y,role='given',w=3)=>NOVA.neonLine(svg,x,y,X,Y,{role,width:w});
const emit=(key,value)=>NOVA.events.emit('value',{engine:ID,key,value});
const mobile=()=>innerWidth<=540;
function layout(){let m=mobile();return {m,W:m?450:800,H:m?1280:1160,plot:{x:m?68:134,y:m?300:286,w:m?336:540,h:m?350:365},faultY:m?866:851,repairY:m?1100:1050,remove:{x:m?313:639,y:m?1106:1057,w:m?112:126,h:58}};}
function plotAxes(svg,l,min,max,xtitle,ytitle,ticks){let g=l.plot;
 NOVA.neonPlot(svg,{x0:g.x,y0:g.y,w:g.w,h:g.h,x:[min,max],y:[0,Math.max(1,ticks)],xStep:(max-min)/4,yStep:Math.max(1,ticks/4),grid:true});
 say(svg,g.x+g.w/2,g.y+g.h+76,xtitle,'support',l.m?24:28);
 say(svg,g.x+5,g.y-25,ytitle,'support',l.m?22:24,'start');}
function barScene(svg,l,q,correct,phase){const g=l.plot,ys=correct?0:48,top=64;
 // use the canonical NOVA plot for grid and axes, then use NOVA Chalk to label the corrected ticks
 NOVA.neonPlot(svg,{x0:g.x,y0:g.y,w:g.w,h:g.h,x:[0,3],y:[ys,top],xStep:1,yStep:(top-ys)/4,grid:true});
 for(let t=0;t<=4;t++){let v=ys+t*(top-ys)/4,y=g.y+g.h-t*g.h/4;say(svg,g.x-17,y+7,v,'given',l.m?22:25,'end');}
 say(svg,g.x+6,g.y-26,correct?'Scale starts at 0':'Scale starts at 48','focus',l.m?23:26,'start');
 q.counts.forEach((v,i)=>{if(phase<2&&i>0)return;if(phase===2&&i>1)return;
 let ww=g.w/4,x=g.x+(i+.25)*g.w/3,y=g.y+(top-v)/(top-ys)*g.h,h=g.y+g.h-y;
 box(svg,x,y,ww,h,['focus','op','result'][i],9);say(svg,x+ww/2,y-16,v,'result',l.m?25:27);say(svg,x+ww/2,g.y+g.h+40,q.names[i],'given',l.m?24:27);});
 say(svg,l.W/2,g.y+g.h+105,correct?'Bars show the actual differences':'Short axis exaggerates the difference','support',l.m?24:26);
}
function pictogramScene(svg,l,q,correct,phase){let yy=l.plot.y+15,step=l.m?43:64,xx=l.m?140:236,iconSpacing=l.m?34:48,displayKey=correct?3:6;
 ['Apples','Bananas','Pears'].forEach((label,i)=>{let y=yy+i*122;if(phase<2&&i>0)return;if(phase===2&&i>1)return;
 say(svg,l.m?90:148,y+32,label,'given',l.m?24:30);
 for(let k=0;k<q.counts[i]/3;k++){let x=xx+k*iconSpacing;const g=E('g',{},svg);NOVA.neonRing(g,x,y+23,{role:['given','focus','op'][i],r:l.m?10:14});ln(g,x-5,y+9,x+3,y+1,'support',2);}
 say(svg,l.W-(l.m?24:91),y+33,q.counts[i],'result',l.m?23:29,'end');});
 box(svg,l.m?67:175,l.plot.y+385,l.m?316:444,93,correct?'result':'focus',16);
 say(svg,l.W/2,l.plot.y+422,'1 symbol = '+displayKey+' pupils',correct?'result':'focus',l.m?29:34);
 say(svg,l.W/2,l.plot.y+458,correct?'The key matches the counts':'The key contradicts the counts',correct?'result':'support',l.m?22:26);
}
function spreadScene(svg,l,q,correct,phase){const g=l.plot,xx=v=>g.x+(v-4)*g.w/12;
 NOVA.neonPlot(svg,{x0:g.x,y0:g.y,w:g.w,h:g.h,x:[4,16],y:[0,2],xStep:2,yStep:1,grid:true});
 for(let i=0;i<2;i++){if(i===1&&phase<3)continue;
 const y=g.y+(i===0?.34:.73)*g.h; say(svg,g.x+52,y-40,'Team '+(i?'B':'A'),'given',l.m?22:27);
 let counts={};q.sets[i].forEach(v=>{let k=counts[v]||0;counts[v]=k+1;NOVA.neonRing(svg,xx(v),y-k*23,{role:i?'focus':'op',r:l.m?9:11});});
 }
 for(let v=4;v<=16;v+=2)say(svg,xx(v),g.y+g.h+42,v,'given',l.m?22:27);
 say(svg,l.W/2,g.y+g.h+94,'Both means = 10','focus',l.m?27:31);
 if(correct){say(svg,l.W/2,g.y+g.h+135,'Range A = 8 · Range B = 2','result',l.m?23:29);}else say(svg,l.W/2,g.y+g.h+131,'Claim: Their spread must be equal!','support',l.m?23:29);
}
function scatterScene(svg,l,q,correct,phase){const g=l.plot;NOVA.neonPlot(svg,{x0:g.x,y0:g.y,w:g.w,h:g.h,x:[0,8],y:[0,80],xStep:2,yStep:20,grid:true});
 const xx=x=>g.x+x*g.w/8,yy=y=>g.y+g.h-y*g.h/80;
 [0,2,4,6,8].forEach(v=>say(svg,xx(v),g.y+g.h+40,v,'given',l.m?22:25));
 [0,20,40,60,80].forEach(v=>say(svg,g.x-16,yy(v)+7,v,'given',l.m?22:25,'end'));
 let shown=phase<=1?1:phase===2?3:q.points.length;
 q.points.slice(0,shown).forEach(([x,y])=>{NOVA.neonRing(svg,xx(x),yy(y),{role:'focus',r:l.m?10:12});});
 if(correct||phase>5)ln(svg,xx(1.5),yy(32),xx(7.6),yy(79),'result',3);
 say(svg,l.W/2,g.y+g.h+87,'Hours studied','support',l.m?24:29);
 say(svg,g.x+4,g.y-22,'Test score','support',l.m?22:26,'start');
 say(svg,l.W/2,g.y+g.h+130,correct?'Association does not prove cause':'Claim: studying ALWAYS causes',correct?'result':'focus',l.m?22:26); if(!correct)say(svg,l.W/2,g.y+g.h+163,'higher marks','focus',l.m?22:26);
}
function sampleScene(svg,l,q,correct,phase){const g=l.plot;
 NOVA.neonPlot(svg,{x0:g.x,y0:g.y,w:g.w,h:g.h,x:[0,2],y:[0,20],xStep:1,yStep:5,grid:true});
 const ww=l.m?102:160;
 q.counts.forEach((v,i)=>{if(i===1&&phase<2)return;let x=g.x+(i+.4)*g.w/2,y=g.y+g.h-v*g.h/20;
 box(svg,x,y,ww,v*g.h/20,i?'op':'focus',12);say(svg,x+ww/2,y-17,v,'result',l.m?25:31);say(svg,x+ww/2,g.y+g.h+44,i?'No':'Yes','given',l.m?26:29);});
 say(svg,l.W/2,g.y+g.h+94,'16 of 20 = 80%','result',l.m?27:33);
 say(svg,l.W/2,g.y+g.h+139,correct?'Only the 20 club respondents':'Claim: 80% of the whole school!',correct?'result':'focus',l.m?23:29);
}
const draws={bar:barScene,pictogram:pictogramScene,spread:spreadScene,scatter:scatterScene,sample:sampleScene};
function hotspot(l,q){if(q.kind==='bar')return {x:l.plot.x-41,y:l.plot.y+l.plot.h*.57,w:51,h:55};
 if(q.kind==='pictogram')return {x:l.W-68,y:l.plot.y+389,w:53,h:55};
 return {x:l.W-69,y:l.plot.y+l.plot.h+115,w:54,h:55};}
function zoneFromBox(b){return {id:'repair',kind:'drop',x:b.x,y:b.y,w:b.w,h:b.h};}
function scene(stage,opt={}){
if(window.NovaLessonComponent?.active){[stage,opt]=window.NovaLessonComponent.args("scene",arguments);}
stage.innerHTML='';const q=p(),l=layout(),phase=opt.phase??8,repaired=opt.state?.repaired??(phase>=6&&!opt.interactive&&!opt.challenge),show=phase>=4||opt.interactive||opt.challenge;
 const svg=NOVA.svg.root(l.W,l.H,'Premium NOVA graph with labelled misleading features, source evidence and interactive repair target.');svg.classList.add('f1614-svg');
 say(svg,l.W/2,61,q.title,'focus',l.m?31:39);
 function wrap(t,n){let words=t.split(' '),out=[''];for(const w of words){let j=out.length-1;if((out[j]+' '+w).trim().length>n)out.push(w);else out[j]=(out[j]+' '+w).trim();}return out;}
 wrap(q.desc,l.m?29:54).slice(0,3).forEach((t,i)=>say(svg,l.W/2,107+i*(l.m?31:34),t,'support',l.m?21:25));
 if(phase<=1&&!opt.interactive&&!opt.challenge){say(svg,l.W/2,191,phase===0?'The evidence first':'Build from the source','result',l.m?27:33);
 let values=q.counts||q.sets?.flat()||q.points?.map(v=>`(${v.join(', ')})`)||[];
 const K=l.m?4:6,cellW=l.m?87:102;
 values.slice(0,16).forEach((value,i)=>{let x=l.W/2-K*cellW/2+i%K*cellW,y=251+Math.floor(i/K)*78;box(svg,x,y,cellW-7,58,i%2?'given':'focus');say(svg,x+(cellW-7)/2,y+40,value,'given',l.m?23:27);});
 say(svg,l.W/2,l.m?675:630,'These observations stay unchanged','result',l.m?24:29);
 }else draws[q.kind](svg,l,q,repaired,phase);
 const hz=hotspot(l,q);
 if(show){let outline=E('g',{},svg);outline.dataset.hotspot='fault';outline.setAttribute('aria-label','Misleading feature and repair target');
 NOVA.neonRing(outline,hz.x+hz.w/2,hz.y+hz.h/2,{role:repaired?'result':'focus',r:15});
 say(outline,hz.x+hz.w/2,hz.y+hz.h/2+7,repaired?'✓':'!',repaired?'result':'focus',l.m?25:30);
 }
 if(phase>=5||opt.interactive||opt.challenge){
  let cy=l.faultY+9;
  say(svg,l.W/2,cy,repaired?'CORRECTED INTERPRETATION':'MISLEADING IMPRESSION',repaired?'result':'focus',l.m?22:27);
  const caption=repaired?q.repair:q.fault;
  wrap(caption,l.m?27:50).slice(0,5).forEach((t,i)=>say(svg,l.W/2,cy+43+i*34,t,repaired?'result':'given',l.m?21:26));
 }
 if(opt.interactive||opt.challenge){
  const tray={x:l.m?49:132,y:l.repairY,w:l.m?157:188,h:62};
  const rem=l.remove;box(svg,rem.x,rem.y,rem.w,rem.h,'op',15);say(svg,rem.x+rem.w/2,rem.y+38,'Remove','op',l.m?22:24);
  const iconLoc=repaired?{x:hz.x+hz.w/2-48,y:hz.y+hz.h/2-22}:{x:tray.x,y:tray.y};
  const tile=E('g',{},svg);tile.setAttribute('data-repair-card','1');tile.setAttribute('role','button');tile.setAttribute('tabindex','0');tile.setAttribute('aria-label',repaired?'Repair lens placed. Press Space to remove; drag to red Remove zone.':'Repair lens. Drag to the highlighted fault. Press Space to apply.');
  box(tile,iconLoc.x,iconLoc.y,repaired?96:122,50,'result',12);say(tile,iconLoc.x+(repaired?48:61),iconLoc.y+34,repaired?'Fixed':'Repair lens','result',l.m?23:24);
  function setRepair(v){opt.state.repaired=v;emit('repair',{preset:CONFIG.preset,repaired:v});opt.update();}
  NOVA.ui.svgDrag(svg,tile,{box:{x:iconLoc.x,y:iconLoc.y,w:repaired?96:122,h:50},zones:()=>[zoneFromBox(hz),{id:'remove',kind:'remove',...rem}],onDrop:id=>id==='repair'&&(!repaired?(setRepair(true),true):false),onRemove:()=>setRepair(false)});
  tile.addEventListener('pointerdown',e=>{try{tile.setPointerCapture(e.pointerId)}catch(_){}});
  tile.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();setRepair(!repaired);}});
  if(!repaired)say(svg,tray.x+61,tray.y-18,'Drag to repair', 'support',l.m?21:23);
 }
 stage.append(svg);
 const read=H('div',{class:'f1614-readouts'});if(show||phase>1){read.append(NOVA.neonTile(q.lesson,{role:'given'}),NOVA.neonTile(repaired?'Evidence repaired':'Spot the distortion',{role:repaired?'result':'focus'}));}
 else read.append(NOVA.neonTile('Use the original observations',{role:'given'}));stage.append(read);
 NOVA.scene.helperStrip(stage,opt.pose||'think',opt.speech||'Read the data, question the display, then repair its interpretation.');return svg;
}
function watch(i,stage){scene(stage,{phase:i,pose:STEPS[i].pose,speech:i===8?p().repair:STEPS[i].narration});}
function select(label,items){let s=H('select',{class:'nova-input','aria-label':label});items.forEach(([id,title])=>s.append(H('option',{value:id,text:title})));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let state=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("state",()=>({repaired:false})):({repaired:false}));window.NovaLessonComponent?.applyExploreModels();const lesson=select('Lesson preset',Object.entries(CONFIG.presets).map(([k,v])=>[k,v.label])),apply=H('button',{class:'nova-btn primary',text:'Apply repair'}),reset=H('button',{class:'nova-btn',text:'Restore misleading view'}),status=H('p',{class:'f1614-status',role:'status'});window.NovaLessonComponent?.applyExploreModels();lesson.value=CONFIG.preset;
 window.NovaLessonComponent?.applyExploreModels();function render(){scene(stage,{phase:8,interactive:true,state,update:render,pose:state.repaired?'celebrate':'magnify',speech:state.repaired?p().repair:'Try the repair lens on the highlighted misleading feature. Then compare the corrected claim.'});status.textContent=state.repaired?p().repair:p().fault;}
 window.NovaLessonComponent?.applyExploreModels();lesson.onchange=()=>{CONFIG.preset=lesson.value;state={repaired:false};render();emit('preset',CONFIG.preset);};window.NovaLessonComponent?.applyExploreModels();apply.onclick=()=>{state.repaired=true;render();emit('repair',true);};window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{state.repaired=false;render();emit('reset',true);};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f1614-help',text:'Drag the Repair lens onto the misleading feature, then compare the evidence. Drag it to the red Remove zone to restore the distortion, or use the keyboard buttons.'}),H('div',{class:'f1614-controls'},[H('label',{},['Lesson',lesson]),apply,reset]),status);
 window.NovaLessonComponent?.applyExploreModels();render();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={select:key=>{lesson.value=key;lesson.onchange();},get:()=>({preset:CONFIG.preset,repaired:state.repaired,kind:p().kind,actual:p().expected,wrong:p().wrong}),repair:v=>{state.repaired=!!v;render();},reset:()=>reset.onclick()};}
function challenge(panel,api,stage){const q=p(),state={repaired:false};let step=0;
 function render(){scene(stage,{phase:8,challenge:true,state,update:render,pose:step===0?'think':step===1?'count':'compare',speech:step===0?'Repair the misleading feature. A believable graph must respect the source data.':step===1?'Use the actual numbers. Do not read an exaggerated axis or unsupported claim.':'Choose the conclusion that the original data really justify.'});}
 const questions=[
  {q:'The display contains a misleading feature. Drag the Repair lens onto the highlighted feature, then Check.',build:()=>()=>state.repaired,check:v=>[v===true,v?'Correct. You repaired the representation without changing the data.':'The misleading feature is still present. Move the Repair lens to the highlighted target, or press Space on the lens.'],hint:'Find the highlighted chart fault. A keyboard user can focus the Repair lens and press Space.',solve:()=>{state.repaired=true;render();}},
  {q:q.kind==='bar'?'How many more pupils does Elm have than Oak?':q.kind==='pictogram'?'How many pupils chose Bananas?':q.kind==='spread'?'What is the range for Team A?':q.kind==='scatter'?'How many paired observations were recorded?':'What percentage of the club survey answered Yes?',build:NOVA.entryTask('Answer from the source data',ID),check:v=>[Number(v)===q.expected,Number(v)===q.expected?'Correct: this figure comes from the original data, not from a misleading impression.':Number(v)===q.wrong?'That is a tempting number from the misleading claim. Recheck the source values.':'Use the actual data to calculate your answer, not the visual impression.'],hint:q.kind==='bar'?'Subtract 52 from 59.':q.kind==='pictogram'?'Six symbols, each representing three pupils.':q.kind==='spread'?'Subtract 6 from 14.':q.kind==='scatter'?'Count the plotted (x, y) pairs.':'Compute 16 ÷ 20 × 100.',solve:()=>{}},
  {q:q.prompt,build:panel=>{let s=select('Choose justified interpretation',[['-1','Choose an answer…'],...q.options.map((v,i)=>[String(i),v])]);panel.append(H('label',{class:'f1614-choice'},['Select your conclusion',s]));s.value='-1';return()=>+s.value;},check:v=>[v===q.correct,v===q.correct?'Correct. That conclusion is supported by the available observations.':'This interpretation claims more than the evidence supports. Look again at the repaired graph and source.'],hint:'Choose only what the data and sampling method support.',solve:()=>{}}
 ];
 panel.append(H('p',{class:'f1614-help',text:'Find the distortion, calculate from real data, then select the justified interpretation. All three tasks must be correct.'}));
 NOVA.challengeRun(panel,api,questions,i=>{step=i;render();},CONFIG);render();
 CONFIG._challengeState=()=>({preset:CONFIG.preset,task:step,repaired:state.repaired,expected:q.expected,correctOption:q.correct});}
const DEF={id:ID,title:'Misleading Graph Spotter',config:CONFIG,steps:STEPS,render:watch,alt:'Five graphical examples of distorted statistical presentations. Highlight and repair the specific misleading feature.',staticAlt:'Check scales, picture-chart keys, spread as well as centre, correlation versus causation, and the representativeness of samples.',exploreIntro:'Inspect deceptive statistics then drag the repair lens onto the fault to restore the correct interpretation.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"scene":["stage","opt"]},exploreFields:{"state":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:ID,num:'F16·14',title:'Misleading Graph Spotter',def:DEF,years:'Years 7–9 KS3 with GCSE critical statistical literacy extension',linked:['F0-02','F0-04','F16-01','F16-02','F16-10'],spec:{purpose:'Detect and repair misleading statistical displays and claims using source observations.',params:'Five independent lesson-context presets; pictogram keys, scaled bar axes, spread comparisons, scatter claims and sampling statements.',presets:'Y7-066, Y7-071, Y9-049, Y9-050, Y9-052',steps:'Source → diagram → reveal data → inspect fault → repair → compare → justify.',interactions:'Drag a NOVA neon repair lens to the faulty graph region, reverse in the red removal zone, answer numeric and reasoning tasks.',traps:'Incorrect key, truncated axis, equal centre means equal spread, correlation implies causation, sample equals population.',gcse:'Misleading scales and sampling, evidence-based comparative language and limits of correlational claims.'}});
const log=document.getElementById('log');if(log){let add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();