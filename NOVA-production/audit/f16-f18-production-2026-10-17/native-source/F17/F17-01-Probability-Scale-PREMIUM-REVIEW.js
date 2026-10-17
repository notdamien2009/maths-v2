/* NOVA F17-01 · PROBABILITY SCALE · original bank v3.6.2 core; standalone review build */
(function(){'use strict';
const H=NOVA.h, S=NOVA.svg, E=S.el, M=NOVA.motion;
const CONFIG=window.NovaV2Integration.configuration(window.NOVA_F17_01_CONFIG={
 startMode:'watch',preset:'y7',events:['value','correct','step','mode','hintUsed'],
 presets:{
  y7:{label:'Year 7 · Probability and complements',year:7,context:'TEN EQUALLY LIKELY COUNTERS',total:10,good:3,kind:'green',favourable:'green counter',other:'blue counter',minor:.1,unit:.1},
  y9:{label:'Year 9 · Theoretical probability models',year:9,context:'EIGHT EQUALLY LIKELY TICKETS',total:8,good:5,kind:'winning',favourable:'winning ticket',other:'other ticket',minor:.125,unit:.125}
 }
});
const within=(v,a,b)=>Math.max(a,Math.min(b,v));
const model=p=>p.good/p.total;
const nearly=(a,b)=>Math.abs(a-b)<1e-7;
const fmt=v=>String(+v.toFixed(3));
const params=()=>CONFIG.presets[CONFIG.preset]||CONFIG.presets.y7;
const layout=()=>window.innerWidth<=500?{W:390,H:515,x:34,w:322,y:329,tokenTop:98,tokenGap:50,wordA:239,wordB:271,unitSize:18,mobile:true}:{W:710,H:488,x:55,w:600,y:306,tokenTop:93,tokenGap:65,wordA:216,wordB:248,unitSize:19,mobile:false};
function emit(key,value){NOVA.events.emit('value',{engine:'F17-01',key:key,value:value});}
function chalk(p,x,y,text,role,size,anchor){return NOVA.chalkText(p,x,y,text,{role:role||'op',size:size||19,anchor:anchor||'middle'});}
function frac(num,den){let el=H('span',{class:'f17-fraction','aria-label':num+' out of '+den});el.appendChild(H('span',{class:'f17-num',text:String(num)}));el.appendChild(H('span',{class:'f17-fbar','aria-hidden':'true'}));el.appendChild(H('span',{class:'f17-den',text:String(den)}));return el;}
function fractionTile(label,n,d,role){let tile=H('div',{class:'f17-metric','data-role':role||'result'});tile.appendChild(H('span',{class:'f17-metlabel',text:label}));tile.appendChild(frac(n,d));return tile;}
function outlineCircle(cx,cy,r){return 'M'+(cx-r)+','+cy+' a'+r+','+r+' 0 1 0 '+(2*r)+',0 a'+r+','+r+' 0 1 0 '+(-2*r)+',0 Z';}
function drawOutcomes(svg,p,opts){const L=layout(),count=p.total,cols=L.mobile?5:count,step=L.mobile?56:55,rows=Math.ceil(count/cols),start=L.W/2-(Math.min(cols,count)-1)*step/2;
 chalk(svg,L.W/2,42,p.context,'given',L.mobile?18:22);
 let firstY=L.mobile?92:96;
 for(let i=0;i<count;i++){
   const row=Math.floor(i/cols),col=i%cols,cx=start+col*step,cy=firstY+row*54;
   const show=opts.showOutcomes===true || i<opts.showCount;
   const role=i<p.good?'result':'given';
   const cell=E('g',{'data-outcome':i+1,'aria-label':(i+1)+' of '+count+': '+(i<p.good?p.favourable:p.other)},svg);
   let face=NOVA.neonPath(cell,outlineCircle(cx,cy,L.mobile?18:20),{role:role,width:3.6,fill:true});
   chalk(cell,cx,cy+7,String(i+1),role,19);
   if(!show)cell.style.opacity='.12';
   else if(opts.animateOutcomes && i===opts.showCount-1){M.pop(cell,cx,cy);}
 }
 if(opts.showOutcomes||opts.showCount>0){
  const yy=L.mobile?202:165;
  chalk(svg,L.W/2,yy,p.good+' favourable  ·  '+(p.total-p.good)+' other','op',L.mobile?19:21);
 }
}
function drawBackground(svg,L){
 // Full-size NOVA glass-neon mathematical composition. Individual components use original core primitives.
 const bg=E('g',{'aria-hidden':'true',class:'f17-likelihood-field'},svg);
 NOVA.neonPath(bg,'M'+L.x+','+(L.y-35)+' L'+(L.x+L.w)+','+(L.y-35),{role:'support',width:1.3,dash:'4 12'});
}
function drawScale(svg,p,opts){const L=layout();drawBackground(svg,L);
 // LOCKED number-line primitive. No custom drawn main line, ticks or numbers.
 const nl=NOVA.numberLine(svg,{x:L.x,y:L.y,w:L.w,min:0,max:1,major:.25,minor:p.minor,label:v=>fmt(v),labelSize:L.unitSize,arrows:true});
 const lx=v=>nl.s(v);
 chalk(svg,lx(0),L.wordA,'Impossible','error',L.mobile?17:19);
 chalk(svg,lx(.5),L.wordA,'Even chance','unknown',L.mobile?17:20);
 chalk(svg,lx(1),L.wordA,'Certain','result',L.mobile?17:20);
 chalk(svg,lx(.25),L.wordB,'Unlikely','given',L.mobile?17:19);
 chalk(svg,lx(.75),L.wordB,'Likely','result',L.mobile?17:19);
 // A faint glass face communicates the 0–1 probability continuum without replacing any core tick.
 if(opts.showComplement){
  const a=lx(opts.complementFrom||model(p)),b=lx(1);
  NOVA.neonPath(svg,'M'+a+','+(L.y+73)+' L'+b+','+(L.y+73),{role:'unknown',width:4});
  NOVA.neonRing(svg,b,L.y+73,{role:'unknown',r:5,pulse:false});
  chalk(svg,(a+b)/2,L.y+104,'complement','unknown',L.mobile?16:19);
 }
 return {L,nl,lx};
}
function readout(stage,p,opts){
if(window.NovaLessonComponent?.active){[stage,p,opts]=window.NovaLessonComponent.args("readout",arguments);}

 const line=H('div',{class:'f17-readouts'});
 line.appendChild(fractionTile('FAVOURABLE',p.good,p.total,'result'));
 const likelihood=H('div',{class:'f17-metric f17-decimal','data-role':'unknown'},[H('span',{class:'f17-metlabel',text:'PROBABILITY'}),H('span',{class:'f17-decimalval',text:fmt(model(p))})]);line.appendChild(likelihood);
 line.appendChild(fractionTile('COMPLEMENT',p.total-p.good,p.total,'given'));
 stage.appendChild(line);
}
function scene(stage,p,opts){
if(window.NovaLessonComponent?.active){[stage,p,opts]=window.NovaLessonComponent.args("scene",arguments);}
opts=opts||{};stage.innerHTML='';const L=layout();
 NOVA.cap(stage,'Probability Scale · '+(opts.subtitle||'0 to 1'),opts.tag||'LIVE');
 const svg=S.root(L.W,L.H,'NOVA probability number line, labelled from zero impossible to one certain, with '+p.good+' favourable cases out of '+p.total+' equally likely outcomes.');
 svg.classList.add('f17-plot');svg.setAttribute('data-engine-plot','F17-01');
 drawOutcomes(svg,p,opts);
 const sc=drawScale(svg,p,opts);
 if(opts.showMarker!==false){
   const value=opts.value==null?model(p):opts.value;
   const x=sc.lx(value), yy=L.y-9, group=E('g',{'data-maths':'probability-marker','role':opts.draggable?'slider':'img','tabindex':opts.draggable?'0':'-1','aria-label':'Probability marker at '+fmt(value)+'. Use Left and Right arrow keys to move it.', 'aria-valuemin':'0','aria-valuemax':'1','aria-valuenow':fmt(value)},svg);
   const box=NOVA.neonBox(group,x-37,L.y-100,74,38,{role:'unknown',r:13,text:fmt(value),size:L.mobile?20:23});box.classList.add('f17-tile');
   const stem=NOVA.neonPath(group,'M'+x+','+(L.y-61)+' L'+x+','+(L.y-26),{role:'unknown',width:3.2});
   NOVA.neonRing(group,x,yy,{role:'result',r:14,pulse:!opts.draggable});
   if(opts.draggable){
    let steps=Math.round(1/p.unit),zones=[];
    for(let i=0;i<=steps;i++){
      const x1=sc.lx(i*p.unit),width=L.w/steps;
      zones.push({x:x1-width*.47,y:L.y-105,w:width*.94,h:134,id:'snap:'+i,kind:'drop'});
    }
    const tray={x:L.W/2-55,y:L.H-50,w:110,h:34};
    NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'error',r:12,text:'Reset',size:17});
    zones.push({x:tray.x,y:tray.y,w:tray.w,h:tray.h,id:'tray',kind:'remove'});
    group.setAttribute('aria-valuetext',fmt(value)+' on the probability scale');
    NOVA.ui.svgDrag(svg,group,{box:{x:x-38,y:L.y-103,w:76,h:112},zones:()=>zones,
      onDrop:id=>{if(!id.startsWith('snap:'))return false;const n=Number(id.slice(5));opts.onMove(+((n*p.unit).toFixed(6)));return true;},
      onRemove:()=>opts.onMove(.5),removeTo:{x:tray.x+tray.w/2,y:tray.y+17}});
    group.addEventListener('keydown',e=>{let nv=null;
       if(e.key==='ArrowLeft'||e.key==='ArrowDown')nv=value-p.unit;
       if(e.key==='ArrowRight'||e.key==='ArrowUp')nv=value+p.unit;
       if(e.key==='Home')nv=0;if(e.key==='End')nv=1;
       if(nv!==null){e.preventDefault();opts.onMove(+within(nv,0,1).toFixed(6),'focus');}
    });
   }
   if(opts.animateMarker){M.arrive(group,-(x-sc.lx(.5)),0,780,M.ease.inOut);}
 }
 stage.appendChild(svg);
 readout(stage,p,opts);
 NOVA.scene.helperStrip(stage,opts.pose||'explain',opts.say||'Every probability sits between impossible and certain.');
 return svg;
}
const steps=[
 {name:'Meet the probability scale',pose:'explain',mood:'neutral',narration:'Probability has a scale from zero to one. Zero means impossible; one means certain.',prompt:'Point to zero, one half and one. What does each mean?'},
 {name:'Inspect equally likely outcomes',pose:'point-down',mood:'focus',narration:'Here are ten equally likely counters. Three are green, and seven are blue.',prompt:'Count every outcome. Why is the total ten, not three?'},
 {name:'Count favourable outcomes',pose:'count',mood:'focus',narration:'Three of the ten equally likely outcomes are favourable. The probability is three tenths.',prompt:'Which number is the numerator, and which is the denominator?'},
 {name:'Locate the exact probability',pose:'compare',mood:'focus',narration:'Three tenths is zero point three. It belongs between zero point two five and zero point five on the scale.',prompt:'Why does three tenths sit to the left of one half?'},
 {name:'Find its complement',pose:'think',mood:'focus',narration:'The remaining seven outcomes are not green. Their probability is seven tenths, or zero point seven. Both probabilities total one.',prompt:'Explain why the two complementary probabilities must add to one.'},
 {name:'Justify your probability',pose:'celebrate',mood:'cheer',narration:'The rule is favourable outcomes divided by all equally likely outcomes. Now try the model with eight tickets.',prompt:'State the probability, its complement, and the reason for your answers.'}
];
function drawStep(idx,stage){const p=params(),q=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("drawStep.q",(...a)=>model(...a),[p]):(model(p))),i=within(idx,0,steps.length-1),st=steps[i];
  const captions=[
   'An impossible event is zero. A certain event is one.',
   'Every ticket or counter is equally likely to be selected.',
   'Count favourable outcomes first, then count all outcomes.',
   'Place the result at its exact decimal location.',
   'A complement is what does not happen. Together they make one.',
   'Probability = favourable outcomes ÷ all equally likely outcomes.'
  ];
  const sv=scene(stage,p,{subtitle:st.name,tag:'STEP '+(i+1)+'/'+steps.length,showCount:i>=1? (i>=3?p.total:i===1?Math.max(1,Math.floor(p.total/2)):p.good):0,showOutcomes:i>=3,value:q,showMarker:i>=3,showComplement:i>=4,pose:st.pose,say:captions[i],animateMarker:i===3,animateOutcomes:i===2});
  if(i===4){M.flash(sv,layout().x+layout().w*(1-q),layout().y,'unknown',28);}
}
const def={id:'F17-01',title:'Probability Scale',config:CONFIG,steps:steps,render:drawStep,
 alt:'A premium glass-neon probability scale from zero to one using the NOVA core number-line renderer. Counts of equally likely outcomes, colourful probability chips and a draggable result marker.',
 staticAlt:'An event with 3 favourable outcomes out of 10 equally likely outcomes has probability 0.3. Its complement has probability 0.7. Their sum is 1.',
 exploreIntro:'Choose Year 7 counters or Year 9 tickets. Drag the luminous marker to any probability; compare the position with the theoretical model.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=params(),val=.5,showComplement=false;
   window.NovaLessonComponent?.applyExploreModels();const options=H('select',{class:'nova-input','aria-label':'Probability lesson preset'});
   window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(k=>options.appendChild(H('option',{value:k,text:CONFIG.presets[k].label})));
   window.NovaLessonComponent?.applyExploreModels();options.value=CONFIG.preset;
   window.NovaLessonComponent?.applyExploreModels();const status=H('div',{class:'f17-status','aria-live':'polite'});
   window.NovaLessonComponent?.applyExploreModels();const row=H('div',{class:'pr-row'});
   window.NovaLessonComponent?.applyExploreModels();const btn=(label,fn)=>H('button',{class:'nova-btn',text:label,onclick:fn});
   window.NovaLessonComponent?.applyExploreModels();const check=H('input',{type:'checkbox'});window.NovaLessonComponent?.applyExploreModels();check.checked=false;
   window.NovaLessonComponent?.applyExploreModels();function paint(focus){p=params();scene(stage,p,{subtitle:'drag and compare',tag:'DRAG + SNAP',showOutcomes:true,showMarker:true,draggable:true,value:val,showComplement:showComplement,pose:nearly(val,model(p))?'celebrate':'compare',say:nearly(val,model(p))?'Excellent — your marker matches the theoretical probability.':'The model is '+p.good+' favourable cases out of '+p.total+'. Where should its marker sit?',onMove:move});
     status.textContent='Marker: '+fmt(val)+' · Model: '+fmt(model(p))+(nearly(val,model(p))?' · Exact match.':' · Move the marker to compare.');
     status.className='f17-status'+(nearly(val,model(p))?' okay':'');
     if(focus){const item=stage.querySelector('[data-maths="probability-marker"]');if(item)item.focus({preventScroll:true});}
   }
   window.NovaLessonComponent?.applyExploreModels();function move(v,focus){val=+within(v,0,1).toFixed(6);emit('probability',val);paint(focus);}
   window.NovaLessonComponent?.applyExploreModels();options.onchange=()=>{CONFIG.preset=options.value;p=params();val=.5;emit('preset',CONFIG.preset);paint();};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('label',{class:'pr-row'},['Lesson preset ',options]));
   window.NovaLessonComponent?.applyExploreModels();check.onchange=()=>{showComplement=check.checked;paint();};
   window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('label',{class:'pr-row'},[check,' Show the complementary section']));
   window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('← move',()=>move(val-p.unit)));window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('move →',()=>move(val+p.unit)));
   window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('Place at model value',()=>{move(model(p));const sc=stage.querySelector('.f17-plot');if(sc){M.flash(sc,layout().x+layout().w*val,layout().y,'result',30);}}));
   window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('Reset',()=>move(.5)));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);
   window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:()=>val,move:move,select:k=>{options.value=k;options.onchange();},status:()=>status.textContent};
   window.NovaLessonComponent?.applyExploreModels();paint();
 },
 challenge:function(panel,api,stage){let qval=.5,activeTask=0;
   const tasks=[
    {q:'There are 3 green counters among 10 equally likely counters. Drag the marker to the probability of green. The arrow keys also work.',
     build:()=>()=>qval,
     check:v=>{let ok=nearly(v,.3);return [ok,ok?'Correct. Three favourable out of ten gives 0.3.':nearly(v,.7)?'You placed the complement: 0.7 is the chance of blue, not green.':v<.3?'Too far left. Three out of ten is larger than '+fmt(v)+'.':'Too far right. Three out of ten is below '+fmt(v)+'.'];},
     hint:'Divide 3 by 10. Place the marker exactly at 0.3, between 0.25 and 0.5.',solve:()=>{qval=.3;drawChallenge(0);}},
    {q:'The chance of green is 0.3. What is the probability of NOT choosing green?',
     build:NOVA.choiceTask([{label:'0.7',value:'.7'},{label:'0.3',value:'.3'},{label:'1.3',value:'1.3'},{label:'0.07',value:'.07'}],'F17-01'),
     check:v=>{let ok=v==='.7';return [ok,ok?'Correct. The complement is 1 − 0.3 = 0.7.':v==='.3'?'That repeats the original event. Complements add to one.':v==='1.3'?'A probability cannot exceed one. Subtract 0.3 from one.':v==='.07'?'Check the place value. Seven tenths is 0.7, not 0.07.':'Choose the probability that totals one with 0.3.'];},
     hint:'The complement is 1 minus the original probability.',solve:ctl=>{let b=ctl.querySelectorAll('button');if(b[0])b[0].click();}},
    {q:'Year 9 model: 5 of 8 equally likely tickets are winners. Enter the exact probability as a decimal.',
     build:NOVA.entryTask('Probability as a decimal','F17-01'),
     check:v=>{let ok=typeof v==='number'&&nearly(v,.625);return [ok,ok?'Correct. Five divided by eight equals 0.625, and 3 out of 8 is the complement.':v!=null&&nearly(v,.375)?'That is the complement: three eighths, not five eighths.':v!=null&&v>1?'Probability must stay between zero and one.':v==null?'Enter a decimal, for example 0.5.':'Divide the number of winners, five, by the total number of tickets, eight.'];},
     hint:'5 ÷ 8 = 0.625. There are eight equally likely possibilities.',solve:ctl=>{let a=ctl.querySelector('input');if(a){a.value='0.625';a.dispatchEvent(new Event('input',{bubbles:true}));}}}
   ];
   function drawChallenge(k){activeTask=k;let p=k===2?CONFIG.presets.y9:CONFIG.presets.y7;
     scene(stage,p,{subtitle:'Task '+(k+1)+' · '+(k===2?'theoretical model':'complements'),tag:'CHALLENGE '+(k+1)+'/3',showOutcomes:true,draggable:k===0,showMarker:k===0,value:k===0?qval:model(p),showComplement:k===1,pose:'think',say:k===0?'Place the marker at three tenths.':k===1?'What chance is left after three tenths?':'Count five winning tickets from the eight equally likely tickets.',onMove:v=>{qval=v;emit('probability',v);drawChallenge(0);}});
   }
   NOVA.challengeRun(panel,api,tasks,drawChallenge,CONFIG);
   CONFIG._challengeValue=()=>qval;
   NOVA.events.on('correct',evt=>{let d=evt.detail||{};if(d.engine!=='F17-01')return;const old=stage.querySelector('.nv-dock');if(old)old.remove();const happy=d.correct;
       NOVA.scene.helperStrip(stage,happy?'celebrate':'not-yet',happy?'You checked the outcome count correctly. Well done!':'Try again. Check which event the question asks for.');
       const svg=stage.querySelector('.f17-plot');if(happy&&svg)M.flash(svg,layout().x+layout().w*model(activeTask===2?CONFIG.presets.y9:CONFIG.presets.y7),layout().y,'result',30);
   });
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-01',def,{models:{"model":()=>model},tables:{"steps":()=>steps},draws:{"readout":["stage","p","opts"],"scene":["stage","p","opts"]},exploreFields:{"drawStep.q":{"kind":"factory","factory":"model","argCount":1}}});
NOVA.bankMount({id:'F17-01',num:'F17·01',title:'Probability Scale',def:def,
 years:'KS3 Year 7 and Year 9; GCSE Foundation and Higher probability models.',linked:['F0-02','F0-03','F0-04','F1-01','F17-02','F17-05','F17-10'],
 spec:{purpose:'Place probabilities between 0 (impossible) and 1 (certain). Compare equally likely outcomes, an event and its complement; use theoretically correct counts and decimal locations.',
 params:'total outcomes; favourable outcomes; exact decimal probability; complement; discrete 0–1 scale intervals; accessible marker location.',
 presets:'Year 7 Y7-073: 3 green of 10 equally likely counters (0.3 and complement 0.7). Year 9 Y9-042: 5 winning tickets of 8 equally likely (0.625 and complement 0.375).',
 steps:'Set up 0–1 scale → inspect equally likely outcomes → count favourable → animate chip to theoretical probability → find complement → justify. Watch/Guided step timeline with Sir Bob narration.',
 interactions:'Watch/Guided animated steps and scrub; Explore real NOVA.ui.svgDrag snapping, re-grab, keyboard arrows, Home/End, remove tray, model alignment; Challenge drag + complement choice + decimal entry. Emits mode, step, value, correct and hintUsed.',
 traps:'Confusing event with complement; placing probability on wrong interval; treating favourable count as denominator; interpreting 0.7 as 0.07; answers greater than one.',
 gcse:'Compare exact theoretical probabilities from non-decimal fractions; model outcome spaces, complements, and conditional extensions (linked engines).'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>{log.textContent='';};}
})();
