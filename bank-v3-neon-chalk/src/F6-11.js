/* F6-11 Rates-of-Change Tank: additive build, original F0 core unchanged. */
const F611_CONFIG={id:'F6-11',preset:'Y8-028',startMode:'watch',parameters:{precision:3,levelPositions:[0,.25,.5,.75,1],rateFactors:[.5,1,1.5,2],independentVariable:'time or volume'},presets:{
 'Y8-028':{label:'Y8-028 · Graph gradient',title:'WATER LEVEL RISING',kind:'flow',rate:3,xMax:8,xUnit:'min',yUnit:'cm',rateUnit:'cm/min',quantity:'WATER DEPTH',context:'The water rises at a steady number of centimetres each minute. Find the gradient.',unitDescription:'cm of height per minute'},
 'Y8-041':{label:'Y8-041 · Speed as a rate',title:'SAME RATE · NEW CONTEXT',kind:'journey',rate:12,xMax:5,xUnit:'min',yUnit:'km',rateUnit:'km/min',quantity:'DISTANCE METRE',context:'A distance meter gains kilometres as time passes. Read the rate of change, like water rising in a tank.',unitDescription:'kilometres per minute'},
 'Y8-042':{label:'Y8-042 · Density',title:'MASS PER LITRE',kind:'density',rate:2,xMax:8,xUnit:'L',yUnit:'kg',rateUnit:'kg/L',quantity:'TANK CONTENTS',context:'Each extra litre adds the same mass. The gradient of a mass–volume graph gives density.',unitDescription:'kilograms per litre'},
 'Y9-022':{label:'Y9-022 · Compound speed',title:'INTERPRETING A FASTER RATE',kind:'journey',rate:9,xMax:8,xUnit:'min',yUnit:'km',rateUnit:'km/min',quantity:'DISTANCE METRE',context:'The distance meter fills faster when the rate is higher. Compare steep and shallow gradients.',unitDescription:'kilometres per minute'},
 'Y9-023':{label:'Y9-023 · Density reasoning',title:'COMPARE TWO MATERIALS',kind:'density',rate:1.5,xMax:8,xUnit:'L',yUnit:'kg',rateUnit:'kg/L',quantity:'MASS ADDED',context:'Two materials can occupy the same volume yet have different mass. Compare their gradient.',unitDescription:'kilograms per litre'}
},events:['value','correct','step','hintUsed']};window.F611_CONFIG=F611_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=F611_CONFIG,ID='F6-11',FACTORS=C.parameters.rateFactors;
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f611-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
const STEPS=[
 {name:'Notice the tank',pose:'explain',caption:'Look at the two measurements.',narration:'Look at the container and the graph. We can measure how one quantity changes as another quantity increases.'},
 {name:'Open the tap',pose:'point-down',caption:'Start the flow.',narration:'When the flow starts, the height of the liquid begins to rise.'},
 {name:'Compare intervals',pose:'count',caption:'Compare equal intervals.',narration:'In equal time intervals, the same flow rate adds the same amount. Equal steps help us see the rate.'},
 {name:'Watch the depth rise',pose:'point',caption:'Follow the rising level.',narration:'The level climbs at a steady speed. A faster flow gives a larger change over the same time.'},
 {name:'Trace the graph',pose:'checking',caption:'Look at the slope.',narration:'Put the measurements on a graph. The gradient shows how much the quantity increases for one unit along the horizontal axis.'},
 {name:'Calculate the rate',pose:'think',caption:'Rise divided by run.',narration:'Find the change on the vertical axis and divide by the change on the horizontal axis. Remember the units.'},
 {name:'Test a new rate',pose:'magnify',caption:'What if the rate doubles?',narration:'Keep the same horizontal interval. Doubling the rate doubles the vertical change and makes the graph steeper.'},
 {name:'Check the evidence',pose:'celebrate',caption:'Both representations agree.',narration:'Check that the tank, graph and rate calculation all tell the same story.'}
];
const fmt=x=>Number(Number(x).toFixed(3)).toString();const preset=id=>C.presets[id||C.preset];const emit=(type,detail)=>N.events.emit(type,{engine:ID,...detail});
function colorText(svg,x,y,s,role='given',size=22){return N.chalkText(svg,x,y,String(s),{role,size});}
function button(t,f,cls='nova-btn'){return H('button',{class:cls,text:t,onclick:f});}
function dims(mobile){return mobile?{mobile:true,w:520,h:1580,tx:165,ty:210,tw:206,th:270,gx:98,gy:665,gw:345,gh:267,sliderY:1180,sliderX:87,sliderW:354,chipsY:1420,returnX:95,returnY:1299,matchX:289,matchY:1299,noteY:1540}:
 {mobile:false,w:1120,h:1165,tx:195,ty:247,tw:238,th:325,gx:630,gy:262,gw:395,gh:318,sliderY:830,sliderX:627,sliderW:400,chipsY:1000,returnX:147,returnY:845,matchX:380,matchY:845,noteY:1120};}
function model(p,idx=1,progress=.75){const factor=FACTORS[idx],r=p.rate*factor,x=p.xMax*progress,y=r*x,cap=p.rate*2*p.xMax;return {rate:r,x,y,cap,factor,fill:y/cap};}
function evidenceCard(title,value,note,role='given'){return N.neonCard([H('p',{class:'f611-card-label',text:title}),H('p',{class:'f611-card-value',text:value}),H('p',{class:'f611-card-note',text:note})],{role});}
function makeScene(stage,p,o={}){
 const mobile=window.innerWidth<=1000,d=dims(mobile),mode=o.mode||'watch',step=o.step??7,idx=o.rateIndex??1,progress=o.progress??.75,solved=!!o.solved,challenge=mode==='challenge';if(mode==='explore'){d.h=mobile?1150:890;d.noteY=mobile?1114:850;}else{d.h=mobile?1170:890;d.noteY=mobile?1138:848;}const m=model(p,idx,progress);const teach=mode==='watch'||mode==='guided';const hide=challenge&&!solved;const revealRate=!hide;const isDensity=p.kind==='density';
 stage.innerHTML='';N.cap(stage,ID,challenge?'FIND THE RATE AND MATCH THE GRAPH':mode==='explore'?'CHANGE THE RATE':'TANK · GRAPH · RATE');
 let deck=null;const layout=H('div',{class:'f611-layout'}),art=H('div',{class:'f611-art'}),aside=H('aside',{class:'f611-aside','aria-label':'Rate evidence cards'});const svg=N.svg.root(d.w,d.h,'Interactive glass tank with a fluid level linked to an accurate graph. Change the rate and place the matching gradient card.');svg.classList.add('f611-svg');svg.dataset.mode=mode;svg.dataset.preset=o.id||C.preset;svg.dataset.rateIndex=String(idx);svg.dataset.progress=fmt(progress);
 colorText(svg,d.w/2,55,hide?'FIND THE GRADIENT':'ONE CHANGE · TWO VIEWS','given',mobile?33:41);
 colorText(svg,d.w/2,105,isDensity?'DENSITY = MASS ÷ VOLUME':'RATE = CHANGE ÷ INTERVAL','focus',mobile?24:30);
 const caption=isDensity?'MASS ADDED / VOLUME':p.kind==='journey'?'DISTANCE ADDED / TIME':'DEPTH ADDED / TIME';
 colorText(svg,d.tx+d.tw/2,d.ty-56,mobile?'GLASS TANK':'GLASS RATE TANK','given',mobile?26:30);
 // The transparent apparatus consists of the approved F0 neon boxes, lines and rings.
 N.neonBox(svg,d.tx-10,d.ty-12,d.tw+20,d.th+25,{role:'given',r:23});
 const innerTop=d.ty+8,innerBottom=d.ty+d.th-5,innerH=innerBottom-innerTop,fillRatio=teach&&step===0?0:Math.min(1,m.fill)*(teach&&step===1?.24:teach&&step===2?.45:1);
 if(fillRatio>.003){const waterY=innerBottom-fillRatio*innerH;
  N.neonBox(svg,d.tx+4,waterY,d.tw-8,Math.max(6,innerBottom-waterY),{role:'result',r:7});
  N.neonLine(svg,d.tx+4,waterY,d.tx+d.tw-4,waterY,{role:'focus',width:3.5});
  // Reflective surface rings read as depth markers, not new tick styles.
  N.neonRing(svg,d.tx+d.tw/2,waterY,{role:'focus',r:7,pulse:false});
 }
 colorText(svg,d.tx+d.tw/2,d.ty+d.th+57,p.quantity,'result',mobile?24:24);
 colorText(svg,d.tx+d.tw/2,d.ty+d.th+94,hide?'READ THE LEVEL':`${fmt(m.y)} ${p.yUnit}`,'result',mobile?25:31);
 // Clear physical tap/nozzle, using inherited F0 neon primitives only.
 N.neonLine(svg,d.tx+d.tw/2,d.ty-12,d.tx+d.tw/2,d.ty-38,{role:'op',width:5});
 N.neonRing(svg,d.tx+d.tw/2,d.ty-38,{role:'focus',r:10,pulse:false});
 colorText(svg,d.gx+d.gw/2,d.gy-45,isDensity?'MASS–VOLUME GRAPH':p.kind==='journey'?'DISTANCE–TIME GRAPH':'DEPTH–TIME GRAPH','given',mobile?25:29);
 const axes=N.svg.axes(svg,{x:d.gx,y:d.gy,w:d.gw,h:d.gh,xmin:0,xmax:p.xMax,ymin:0,ymax:p.rate*2*p.xMax,ticks:Math.max(p.xMax,Math.ceil(p.rate*2*p.xMax/6))});
 const plotComplete=!(teach&&step<4);const graphAt=plotComplete?progress:(teach&&step===4?.28:0);
 if(graphAt>.001){const ex=axes.sx(p.xMax*graphAt),ey=axes.sy(m.rate*p.xMax*graphAt);const path=`M ${axes.sx(0)} ${axes.sy(0)} L ${ex} ${ey}`;N.neonPath(svg,path,{role:'result',width:4});N.neonRing(svg,ex,ey,{role:'focus',r:14,pulse:false});}
 // Honest axes: the x and y maxima describe the available graph area, not an unrelated linear scale.
 colorText(svg,d.gx-8,d.gy+d.gh+40,'0','given',20);
 colorText(svg,d.gx+d.gw-10,d.gy+d.gh+42,`${p.xMax} ${p.xUnit}`,'op',mobile?20:22);
 colorText(svg,d.gx-14,d.gy-18,`${fmt(p.rate*2*p.xMax)} ${p.yUnit}`,'result',mobile?20:21);
 colorText(svg,d.gx+d.gw/2,d.gy+d.gh+81,isDensity?'VOLUME (L)':'TIME ('+p.xUnit+')','op',mobile?22:24);
 colorText(svg,d.gx+d.gw/2,d.gy+d.gh+122,hide?'SLOPE = ?':`${fmt(m.rate)} ${p.rateUnit}`,'focus',mobile?25:30);
 if(mode==='explore'){
  deck=N.svg.root(d.w,mobile?440:400,'Draggable rate controls and matching graph-shape cards');deck.classList.add('f611-svg','f611-control-svg');
  Object.assign(d,mobile?{sliderX:88,sliderY:115,sliderW:344,chipsY:360,returnX:110,returnY:223,matchX:353,matchY:223}:{sliderX:355,sliderY:110,sliderW:390,chipsY:330,returnX:275,returnY:206,matchX:841,matchY:206});
  const bx=d.sliderX,by=d.sliderY,bw=d.sliderW;
  colorText(deck,bx+bw/2,by-69,'DRAG TO CHANGE THE FLOW RATE','given',mobile?22:25);
  N.neonLine(deck,bx,by,bx+bw,by,{role:'op',width:5});
  const ratePts=FACTORS.map((v,i)=>{const xx=bx+i*bw/3;N.neonRing(deck,xx,by,{role:i===idx?'result':'unknown',r:10,pulse:false});colorText(deck,xx,by+52,fmt(v)+'×','given',mobile?21:23);return xx;});
  const knobX=ratePts[idx],knob=E('g',{class:'f611-drag','data-rate-knob':'1',role:'button',tabindex:0,'aria-label':'Drag rate knob to half, normal, one and a half or double rate. Arrow keys adjust.'},deck);
  N.neonRing(knob,knobX,by,{role:'focus',r:25,pulse:false});N.neonRing(knob,knobX,by,{role:'given',r:7,pulse:false});
  const zoneRate=ratePts.map((xx,i)=>({id:String(i),kind:'drop',x:xx-27,y:by-30,w:54,h:60}));
  function setIndex(i){if(i>=0&&i<FACTORS.length)o.onRate?.(i);}knob.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setIndex(Math.max(0,Math.min(3,idx+(e.key==='ArrowRight'?1:-1))));}else if(e.key==='Delete'||e.key==='Escape'){e.preventDefault();o.onReset?.();}});
  N.ui.svgDrag(deck,knob,{box:{x:knobX-26,y:by-26,w:52,h:52},zones:()=>zoneRate,onDrop:id=>{Promise.resolve().then(()=>setIndex(Number(id)));return true;},onRemove:()=>o.onReset?.()});
  // Graph-shape chips: steepness is represented by actual line geometry as well as words.
  colorText(deck,d.w/2,d.chipsY-52,'MATCH A GRAPH TO THE TANK','given',mobile?21:25);
  const cardW=mobile?92:94,spacing=mobile?110:113,start=mobile?45:630;
  FACTORS.forEach((factor,i)=>{
   const cx=start+i*spacing+cardW/2,cy=d.chipsY;
   const grp=E('g',{class:'f611-drag f611-shape','data-shape':String(i),role:'button',tabindex:0,'aria-label':`Choose graph ${i+1}, ${fmt(factor)} times the base gradient. Press Enter to match.`},deck);
   N.neonBox(grp,cx-cardW/2,cy-25,cardW,57,{role:'given',r:10});
   N.neonLine(grp,cx-26,cy+17,cx+23,cy+15-factor*16,{role:i===idx?'result':'op',width:3});
   colorText(grp,cx,cy-2,fmt(factor)+'×','given',mobile?19:21);
   grp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onMatch?.(i);}if(e.key==='Delete'||e.key==='Escape'){e.preventDefault();o.onRemove?.();}});
   N.ui.svgDrag(deck,grp,{box:{x:cx-cardW/2,y:cy-26,w:cardW,h:59},zones:()=>[{id:'tank',kind:'drop',x:d.matchX-85,y:d.matchY-38,w:170,h:76},{id:'remove',kind:'remove',x:d.returnX-72,y:d.returnY-35,w:144,h:70}],onDrop:id=>{if(id==='tank'){Promise.resolve().then(()=>o.onMatch?.(i));return true;}return false;},onRemove:()=>o.onRemove?.()});
  });
  N.neonBox(deck,d.matchX-85,d.matchY-38,170,76,{role:'result',r:12});colorText(deck,d.matchX,d.matchY+7,'MATCH HERE','result',mobile?20:22);
  N.neonBox(deck,d.returnX-72,d.returnY-35,144,70,{role:'error',r:12});colorText(deck,d.returnX,d.returnY+7,'RETURN','error',mobile?20:22);
 }
 colorText(svg,d.w/2,d.noteY,hide?'USE THE TWO AXES TO FIND THE RATE':'THE TANK LEVEL AND GRAPH MUST AGREE','focus',mobile?21:25);
 const xRead=hide?'READ THE GRAPH':`${fmt(m.x)} ${p.xUnit}`;const yRead=hide?'READ THE TANK':`${fmt(m.y)} ${p.yUnit}`;
 aside.append(evidenceCard('HORIZONTAL · '+(isDensity?'VOLUME':'TIME'),xRead,'The interval along the horizontal axis.','given'),evidenceCard('VERTICAL · '+(isDensity?'MASS':p.kind==='journey'?'DISTANCE':'DEPTH'),yRead,'What changes over that interval.','result'),evidenceCard('RATE · GRADIENT',hide?'? '+p.rateUnit:fmt(m.rate)+' '+p.rateUnit,'Change ÷ interval. Unit matches the axes.','focus'),evidenceCard('INTERPRET',caption,'Same multiplier, every equal interval.','op'));
 art.append(svg);if(deck)art.append(deck);layout.append(art,aside);stage.append(layout);N.scene.helperStrip(stage,o.pose||'checking',o.caption||'Look at the rate of change.');return {svg,m,d};
}
function teach(i,stage){const p=preset(),progress=i<2?.24:i<4?.6:1,index=i===6?3:1;const sc=makeScene(stage,p,{mode:'watch',step:i,progress,rateIndex:index,pose:STEPS[i].pose,caption:STEPS[i].caption});if(i===3&&!N.reducedMotion()){const mark=sc.svg.querySelector('.nv-neon-box');if(mark)M.flash(sc.svg,sc.d.tx+sc.d.tw/2,sc.d.ty+sc.d.th/2,'result',32);}emit('step',{preset:C.preset,index:i,name:STEPS[i].name});}
function explore(panel,stage){let id=C.preset,rateIndex=1,progress=.75,matched=null,feedback='Move the rate ring, then drag the graph card into MATCH HERE.';
 const sel=H('select',{'aria-label':'Lesson preset'});Object.entries(C.presets).forEach(([k,v])=>sel.append(H('option',{value:k,text:v.label})));sel.value=id;
 const controls=H('div',{class:'f611-controls'}),text=H('p',{class:'f611-feedback','aria-live':'polite'}),progressLabel=H('p',{class:'f611-instruction'});
 controls.append(H('label',{class:'f611-label'},['Choose context',sel]),button('Check match',check,'nova-btn primary'),button('Hint',hint),button('Reset',reset));panel.append(controls,progressLabel,text);
 function paint(pose='checking',caption='Compare the two representations.'){makeScene(stage,preset(id),{mode:'explore',id,progress,rateIndex,pose,caption,onRate:setRate,onMatch:setMatch,onReset:reset,onRemove:remove});progressLabel.textContent=`At ${fmt(progress*100)}% of the interval: the tank adds ${fmt(model(preset(id),rateIndex,progress).y)} ${preset(id).yUnit}. Move the rate ring or use Left/Right arrows.`;text.textContent=feedback;}
 function setRate(i){rateIndex=i;matched=null;feedback='The rate is '+fmt(model(preset(id),rateIndex,progress).rate)+' '+preset(id).rateUnit+'. Find its matching graph card.';emit('value',{preset:id,rateIndex,rate:model(preset(id),rateIndex,progress).rate});paint('count','What happens to the slope?');}
 function setMatch(i){matched=i;feedback='Graph '+(i+1)+' selected. Check whether its slope matches the tank.';emit('value',{preset:id,graphIndex:i});paint('checking','Match the rate to the shape.');}
 function remove(){matched=null;feedback='Graph card returned. Try another slope.';paint('explain','Choose a slope.');}
 function reset(){rateIndex=1;matched=null;progress=.75;feedback='Starting values restored.';paint('explain','Start with the flow.');}
 function check(){const ok=matched!==null&&matched===rateIndex;feedback=matched===null?'Choose a graph card and drop it into MATCH HERE.':ok?'Correct: the graph and tank have the same rate.':'That slope does not match. A steeper line means a greater change per interval.';text.classList.toggle('good',ok);text.classList.toggle('bad',!ok);emit('correct',{preset:id,correct:ok,rateIndex,matched});paint(ok?'celebrate':'not-yet',ok?'Both rates agree!':'Compare equal intervals.');if(ok){const s=stage.querySelector('svg');if(s)M.flash(s,260,260,'result',32);}}
 function hint(){feedback='Gradient is change on the vertical axis ÷ change on the horizontal axis. A larger rate makes a steeper line.';emit('hintUsed',{preset:id});paint('point-down','Compare slopes.');}
 sel.onchange=()=>{id=sel.value;C.preset=id;reset();};C._explore={get:()=>({id,rateIndex,matched,feedback}),setRate,setMatch,remove,reset,check,hint,setPreset:k=>{sel.value=k;sel.onchange();}};paint();}
function challenge(panel,api,stage){const ids=Object.keys(C.presets);let i=0,solved=false,correctCount=0,attempts=0;
 const question=H('p',{class:'f611-question'}),number=H('input',{type:'text',inputmode:'decimal',placeholder:'Your rate','aria-label':'Rate answer'}),unit=H('select',{'aria-label':'Rate unit'}),shape=H('select',{'aria-label':'Matching graph steepness'}),inputs=H('div',{class:'f611-inputs'});
 ['cm/min','km/min','kg/L','cm','km','kg','L/min'].forEach(x=>unit.append(H('option',{value:x,text:x})));
 ['Half rate','Normal rate','One-and-a-half rate','Double rate'].forEach((x,ix)=>shape.append(H('option',{value:String(ix),text:x})));
 inputs.append(H('label',{class:'f611-label'},[H('span',{text:'RATE'}),number]),H('label',{class:'f611-label'},[H('span',{text:'UNITS'}),unit]),H('label',{class:'f611-label'},[H('span',{text:'GRAPH SHAPE'}),shape]));
 const controls=H('div',{class:'f611-controls'}),checkBtn=button('Check answer',check,'nova-btn primary'),nextBtn=button('Next context',next),hintBtn=button('Hint',hint),fb=H('p',{class:'f611-feedback','aria-live':'polite'}),count=H('p',{class:'f611-progress'});nextBtn.disabled=true;controls.append(checkBtn,hintBtn,nextBtn);panel.append(question,inputs,controls,fb,count);
 const correctIndex=[1,2,0,3,1];function current(){return preset(ids[i]);}function state(){return model(current(),correctIndex[i],1);}
 function paint(){const p=current();question.textContent=`Context ${i+1} of ${ids.length}. ${p.context} Calculate the rate from the graph and select its matching slope.`;count.textContent=`Solved: ${correctCount} / ${ids.length}`;makeScene(stage,p,{mode:'challenge',id:ids[i],rateIndex:correctIndex[i],progress:1,solved,pose:solved?'celebrate':'think',caption:solved?'Tank and graph agree.':'Read the axes carefully.'});}
 function check(){if(solved)return;attempts++;const p=current(),expected=state().rate,attempt=Number(number.value.replace(',','.')),valid=number.value.trim()!==''&&Number.isFinite(attempt),givenUnit=unit.value,ix=Number(shape.value);let ok=false,msg='';
 if(!valid)msg='Enter a numerical rate to continue.';
 else if(givenUnit!==p.rateUnit)msg='Check the units: use '+p.rateUnit+' because those are the two graph axes.';
 else if(Math.abs(attempt-expected)>.005){if(Math.abs(attempt-1/expected)<.006)msg='You inverted the rate. Divide the vertical change by the horizontal interval.';else if(Math.abs(attempt-expected*p.xMax)<.006)msg='That is the total change, not the change per unit. Divide by the horizontal interval.';else msg='Not yet: find the graph rise, divide by its run, then keep the correct units.';}
 else if(ix!==correctIndex[i])msg='Your rate is correct, but that graph card has a different steepness. Compare equal intervals.';
 else{ok=true;msg='Correct! '+fmt(state().y)+' '+p.yUnit+' ÷ '+fmt(state().x)+' '+p.xUnit+' = '+fmt(expected)+' '+p.rateUnit+'.';}
 api.check(ok,msg,{preset:ids[i],answer:valid?attempt:null,unit:givenUnit,graph:ix});fb.textContent=msg;fb.classList.toggle('good',ok);fb.classList.toggle('bad',!ok);emit('correct',{preset:ids[i],correct:ok});if(ok){solved=true;correctCount++;checkBtn.disabled=true;nextBtn.disabled=false;paint();}}
 function hint(){const p=current();const msg='Find the total '+p.yUnit+' on the vertical axis and the matching '+p.xUnit+' on the horizontal axis. Gradient is rise ÷ run.';api.hint(msg);fb.textContent=msg;emit('hintUsed',{preset:ids[i]});}
 function next(){if(!solved)return;if(i===ids.length-1){question.textContent='All rate challenges completed!';inputs.hidden=true;controls.hidden=true;stage.innerHTML='';N.cap(stage,ID,'RATE CHALLENGES COMPLETE');N.scene.helperStrip(stage,'celebrate','You matched tank, graph and gradient.');fb.textContent='All five contexts solved.';return;}
 i++;solved=false;number.value='';checkBtn.disabled=false;nextBtn.disabled=true;fb.textContent='';shape.value='0';unit.value=current().rateUnit;paint();}
 number.addEventListener('keydown',e=>{if(e.key==='Enter')check();});shape.value=String(0);unit.value=current().rateUnit;
 C._challenge={get:()=>({index:i,solved,correctCount,attempts,feedback:fb.textContent}),setAnswers:(v,u,j)=>{number.value=String(v);unit.value=u;shape.value=String(j);},check,next,hint};paint();}
const DEF={id:ID,title:'Rates-of-Change Tank',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'A NOVA neon-glass tank fills in direct proportion to a rate, beside an accurate graph with a slope reflecting the same rate. In Explore, drag the tap control and match graph-shape tiles to the tank.',
 staticAlt:'Gradient equals vertical change divided by horizontal change. Depth per minute for water; distance per minute for journeys; mass per litre for density. A steeper straight line means a greater rate.',
 spec:{purpose:'Make rate of change visible as a changing tank level and a graph gradient; transfer between time–depth, distance–time and mass–volume relationships.',params:'Context, baseline rate, slider multiplier, time/volume, units, fill and graph progress.',presets:'Y8-028 depth/time; Y8-041 speed; Y8-042 density; Y9-022 speed; Y9-023 density.',steps:'Notice → flow begins → equal intervals → level rises → line traces → rate calculation → compare slope → verify.',interactions:'Drag the tap rate slider between four levels; drag graph-shape tiles onto match bay; red remove zone, keyboard arrows/Enter/Delete.',traps:'Gradient vs final quantity, swapped division, incorrect axis units, slope reversal, different intervals.',gcse:'Gradient, compound measures, linear proportionality, density/mass/volume comparisons.'}};
N.bankMount({id:ID,num:'F6·11',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 8–9; GCSE compound rates',linked:['F0-02','F0-04','F6-09','F6-10','F10-05','F18-08']});
})();
