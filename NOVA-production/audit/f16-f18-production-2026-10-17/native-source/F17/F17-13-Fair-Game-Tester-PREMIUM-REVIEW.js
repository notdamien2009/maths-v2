/* F17-13 Fair Game Tester · actual NOVA shared core retained verbatim */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const PRESETS={
 y9:{label:'Y9-046 · Fair games & experimental probability',prize:3,stake:1,faces:[0,2],trials:120}
};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_13_CONFIG={startMode:'watch',preset:'y9',events:['value','correct','step','hintUsed','mode'],valueKeys:['preset','winningFaces','winningCount','probability','entryCost','payout','expectedNet','fairness','completedTrials','wins','observedNet','prediction','reset'],presets:PRESETS});
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('F17-13 undeclared value key '+key);NOVA.events.emit('value',{engine:'F17-13',key,value});};
const money=n=>{const x=Math.round(n*100)/100;return (x<0?'−':'')+'£'+Math.abs(x).toFixed(2)};
const round=n=>Math.round(n*1000000)/1000000;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const mobile=()=>innerWidth<=500;
const chalk=(p,x,y,t,role='given',size=24)=>NOVA.chalkText(p,x,y,String(t),{role,size});
const line=(p,x,y,X,Y,role='given',width=4)=>NOVA.neonLine(p,x,y,X,Y,{role,width});
const path=(p,d,role='given',fill=false,width=4)=>NOVA.neonPath(p,d,{role,fill,width});
function initial(){const p=PRESETS[CFG.preset];return {win:new Set(p.faces),prize:p.prize,stake:p.stake,tries:0,success:0,earned:0,seed:170713,chosen:0,flash:false,last:'—'};}
const chance=m=>m.win.size/6, expected=m=>chance(m)*m.prize-m.stake;
const classify=m=>Math.abs(expected(m))<1e-9?'FAIR GAME':expected(m)<0?'HOUSE ADVANTAGE':'PLAYER ADVANTAGE';
function clear(m){m.tries=0;m.success=0;m.earned=0;m.last='—';emit('reset','experiments');}
function rng(m){m.seed^=m.seed<<13;m.seed^=m.seed>>>17;m.seed^=m.seed<<5;return (m.seed>>>0)/4294967296;}
function run(m,n){for(let i=0;i<n;i++){const face=Math.min(5,Math.floor(rng(m)*6));const win=m.win.has(face);m.tries++;m.success+=win?1:0;m.earned+=(win?m.prize:0)-m.stake;m.last='Die '+(face+1)+' — '+(win?'WIN':'LOSE');}emit('completedTrials',m.tries);emit('wins',m.success);emit('observedNet',round(m.earned));}
function layout(){return mobile()?{W:440,H:1130,top:38,hub:{x:220,y:226,r:104},wheelLabelY:362,faceX:[86,220,354],faceY:[482,610],faceW:116,faceH:108,formulaY:745,gauge:{x:38,y:781,w:364,h:84},tray:{x:27,y:943,w:210,h:79},remove:{x:260,y:943,w:153,h:79},token:{x:131,y:982},footerY:1092}:{W:960,H:955,top:38,hub:{x:256,y:244,r:142},wheelLabelY:424,faceX:[529,695,861],faceY:[172,310],faceW:144,faceH:119,formulaY:556,gauge:{x:94,y:670,w:772,h:90},tray:{x:99,y:839,w:285,h:80},remove:{x:656,y:839,w:207,h:80},token:{x:238,y:879},footerY:951};}
function svgFraction(p,x,y,n,d,role='result',size=27){const g=gcd(n,d)||1;chalk(p,x,y-9,n/g,role,size);line(p,x-25,y+8,x+25,y+8,role,3);chalk(p,x,y+41,d/g,role,size);}
function fracNode(n,d){let q=h('span',{class:'f1713-frac','aria-label':n+' over '+d});let g=gcd(n,d)||1;q.append(h('b',{text:String(n/g)}),h('i',{'aria-hidden':'true'}),h('b',{text:String(d/g)}));return q;}
function metric(name,value,role='given',fraction=false){const e=h('div',{class:'f1713-metric','data-role':role},[h('span',{class:'lab',text:name})]);e.append(fraction?fracNode(value,6):h('strong',{class:'val',text:String(value)}));return e;}
function scene(stage,m,o={}){
if(window.NovaLessonComponent?.active){[stage,m,o]=window.NovaLessonComponent.args("scene",arguments);}

 stage.replaceChildren();const l=layout(),sm=mobile(),p=chance(m),ev=expected(m),cls=classify(m),inter=!!o.interact;
 NOVA.cap(stage,o.title||'Fair game laboratory · win and loss',o.tag||'F17 · EXPERIMENTAL PROBABILITY');
 const svg=S.root(l.W,l.H,'Premium NOVA probability apparatus. A six-faced game wheel and six numbered outcome slots show which die faces win. One reusable WIN marker can be dragged from the tray to a face, re-grabbed, moved or dropped into the removal zone. An expected net gain gauge compares the total prize return to the one-pound entry cost.');
 svg.classList.add('f1713-plot');svg.setAttribute('data-engine-plot','F17-13');
 chalk(svg,l.W/2,l.top,sm?'SIX EQUALLY LIKELY OUTCOMES':'GAME LAB · SIX EQUALLY LIKELY OUTCOMES','given',sm?22:28);
 const cx=l.hub.x,cy=l.hub.y,r=l.hub.r;
 // The numbered glowing game wheel is mathematical artwork drawn exclusively through approved NOVA primitives.
 for(let j=0;j<6;j++){
   const a=-Math.PI/2+j*Math.PI/3,b=a+Math.PI/3;
   const X=cx+r*Math.cos(a),Y=cy+r*Math.sin(a),XX=cx+r*Math.cos(b),YY=cy+r*Math.sin(b);
   const d=`M ${cx} ${cy} L ${X} ${Y} A ${r} ${r} 0 0 1 ${XX} ${YY} Z`;
   path(svg,d,m.win.has(j)?'result':'given',true,3.6);
   const am=(a+b)/2,tx=cx+(r*.71)*Math.cos(am),ty=cy+(r*.71)*Math.sin(am);
   chalk(svg,tx,ty+8,j+1,m.win.has(j)?'result':'given',sm?25:29);
 }
 NOVA.neonRing(svg,cx,cy,{role:'focus',r:sm?25:33,pulse:!!o.flash});
 chalk(svg,cx,cy+8,'D6','focus',sm?24:27);
 chalk(svg,cx,l.wheelLabelY,sm?'SIX-SIDED GAME WHEEL':'EACH FACE HAS THE SAME CHANCE','given',sm?21:24);
 if(!sm){chalk(svg,250,519,'REPLACE WIN MARKERS TO CHANGE THE GAME','focus',22);}
 else{chalk(svg,l.W/2,405,'ASSIGN WINNING FACES','focus',23);}
 const zones=[];
 l.faceY.forEach((y,rr)=>l.faceX.forEach((x,cc)=>{
   const k=rr*3+cc,winner=m.win.has(k),bw=l.faceW,bh=l.faceH;
   NOVA.neonBox(svg,x-bw/2,y-bh/2,bw,bh,{role:winner?'result':'given',r:19});
   chalk(svg,x,y-(sm?14:22),'FACE '+(k+1),'given',sm?22:24);
   chalk(svg,x,y+(sm?31:28),winner?'WIN':'LOSE',winner?'result':'support',sm?24:26);
   if(winner)NOVA.neonRing(svg,x+bw*.37,y-bh*.31,{role:'result',r:sm?7:9});
   zones.push({id:'face'+k,kind:'drop',x:x-bw/2,y:y-bh/2,w:bw,h:bh});
 }));
 const fy=sm?716:596;
 chalk(svg,l.W/2,fy,`${m.win.size} winning ${m.win.size===1?'face':'faces'} from 6 · ${money(m.prize)} gross prize`,'given',sm?21:27);
 if(!o.hideAnswer){
   chalk(svg,l.W/2,fy+(sm?35:43),`EXPECTED NET PER PLAY = ${money(ev)}`,Math.abs(ev)<1e-9?'result':ev<0?'error':'focus',sm?24:28);
 }else{chalk(svg,l.W/2,fy+(sm?35:43),'IS THE GAME FAIR? EXPLAIN WHY.','unknown',sm?24:29);}
 const g=l.gauge;
 NOVA.neonBox(svg,g.x,g.y,g.w,g.h,{role:ev===0?'result':ev<0?'error':'focus',r:22});
 chalk(svg,g.x+g.w/2,g.y+31,o.hideAnswer?'COMPARE RETURN WITH COST':cls,ev===0?'result':ev<0?'error':'focus',sm?23:31);
 chalk(svg,g.x+g.w/2,g.y+67,sm?`CHANCE × PRIZE − ENTRY COST`:`PROBABILITY × PRIZE  −  ENTRY COST ${money(m.stake)}`,'given',sm?21:26);
 const rm=l.remove,tr=l.tray;
 NOVA.neonBox(svg,tr.x,tr.y,tr.w,tr.h,{role:'given',r:15});
 NOVA.neonBox(svg,rm.x,rm.y,rm.w,rm.h,{role:'error',r:15,text:'REMOVE',size:sm?23:25});
 chalk(svg,tr.x+tr.w/2,tr.y-13,'WIN MARKER SUPPLY','given',sm?18:22);
 const mount=(x,y,source,face)=>{
   const token=E('g',{'data-win-marker':source?'source':'placed','data-face':face===null?'':String(face),tabindex:0,role:'button','aria-label':source?'Drag winning marker to a numbered face. Keyboard: use the face buttons beneath the diagram.':`Winning face ${face+1}. Drag to change the winning face, or to the red REMOVE zone.`},svg);
   NOVA.neonRing(token,x,y,{role:'unknown',r:sm?24:27});chalk(token,x,y+8,'W','result',sm?22:24);
   NOVA.ui.svgDrag(svg,token,{box:{x:x-29,y:y-29,w:58,h:58},zones:()=>[...zones,{...rm,id:'remove',kind:'remove'}],removeTo:{x:rm.x+rm.w/2,y:rm.y+rm.h/2},onDrop:id=>{
     const k=Number(id.replace('face',''));if(!/^face[0-5]$/.test(id))return false;
     if(face!==null)m.win.delete(face);m.win.add(k);clear(m);emit('winningFaces',[...m.win].sort());emit('winningCount',m.win.size);o.changed();return true;
   },onRemove:()=>{if(face!==null){m.win.delete(face);clear(m);emit('winningFaces',[...m.win].sort());emit('winningCount',m.win.size);o.changed();}}});
   token.addEventListener('keydown',e=>{
    if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();if(face!==null){m.win.delete(face);clear(m);o.changed();}return;}
    if(/[1-6]/.test(e.key)&&e.key.length===1){e.preventDefault();const k=Number(e.key)-1;if(face!==null)m.win.delete(face);m.win.add(k);clear(m);o.changed();return;}
   });return token;
 };
 if(inter){for(const k of [...m.win].sort()){const x=l.faceX[k%3]+(sm?31:36),y=l.faceY[Math.floor(k/3)]+9;mount(x,y,false,k);}mount(l.token.x,l.token.y,true,null);}
 else{for(const k of m.win){const x=l.faceX[k%3]+(sm?31:36),y=l.faceY[Math.floor(k/3)]+9;NOVA.neonRing(svg,x,y,{role:'unknown',r:sm?24:27});chalk(svg,x,y+8,'W','result',sm?22:24);}NOVA.neonRing(svg,l.token.x,l.token.y,{role:'unknown',r:sm?24:27});chalk(svg,l.token.x,l.token.y+8,'W','result',sm?22:24);}
 chalk(svg,l.W/2,l.footerY,sm?'CHANCE IS NOT A GUARANTEE':'REAL TRIALS CAN DIFFER FROM THE EXPECTED AVERAGE','given',sm?18:24);
 stage.append(svg);
 const result=h('div',{class:'f1713-metrics'});
 result.append(metric('WIN PROBABILITY',m.win.size,'result',true),metric('THEORETICAL NET',o.hideAnswer?'?':money(ev),ev<0?'error':'result'),metric('OBSERVED NET',money(m.earned),'focus'),metric('TRIALS',m.tries,'given'));
 stage.append(result);
 NOVA.scene.helperStrip(stage,o.pose||'think',o.say||'Count winning faces. Multiply the chance of winning by the gross prize, then subtract the entry cost. A fair game has expected net gain of zero.');
 if(o.flash){const wheel=svg;M.flash(wheel,cx,cy,'result',65);}
 return {svg,math:{win:m.win.size,p,expected:ev,classification:cls}};
}
const steps=[
 {name:'What makes a game fair?',pose:'explain',narration:'A fair game gives neither side an advantage over many plays. We must compare the expected gross prize with the entry cost.',prompt:'Does winning half the time always mean a fair game?'},
 {name:'Count winning outcomes',pose:'count',narration:'The die has six equally likely outcomes. Two winning faces give a probability of two sixths, or one third.',prompt:'How many of the six faces win?'},
 {name:'Calculate the return',pose:'point-down',narration:'Multiply the probability of winning by the gross prize. With a three pound prize and one-third chance, the expected return is one pound.',prompt:'What is the expected prize return?'},
 {name:'Subtract the entry cost',pose:'think',narration:'The net expected gain is expected return minus the cost to enter. One pound minus one pound equals zero. That is a fair game.',prompt:'Why do we subtract the cost?'},
 {name:'Compare with simulated results',pose:'compare',narration:'Run actual random games. Even for a fair game the total net gain may be above or below zero after a few trials.',prompt:'Does a fair game guarantee a break-even result after ten trials?'},
 {name:'Make the game unfair, then rebalance',pose:'celebrate',narration:'Changing the number of winning faces or the prize changes expected value. To make the game fair, balance probability times gross prize with the entry cost.',prompt:'How can you make an unfair game fair?'}
];
function showStep(i,stage){i=Math.max(0,Math.min(5,i));const m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("showStep.m",(...a)=>initial(...a),[]):(initial()));if(i===0)m.win=new Set([0]);if(i===4)run(m,30);if(i===5){m.win=new Set([0,2,4]);m.prize=2;}scene(stage,m,{title:steps[i].name,tag:`TEACHING STEP ${i+1} / 6`,pose:steps[i].pose,say:steps[i].narration,flash:i===5,hideAnswer:i<=1});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();const m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("m",(...a)=>initial(...a),[]):(initial()));
 window.NovaLessonComponent?.applyExploreModels();let prize=h('select',{class:'nova-input','aria-label':'Gross prize for a win'});window.NovaLessonComponent?.applyExploreModels();[2,3,4,6,12].forEach(k=>prize.append(h('option',{value:String(k),text:'£'+k+' gross prize'})));window.NovaLessonComponent?.applyExploreModels();prize.value='3';
 window.NovaLessonComponent?.applyExploreModels();let st=h('p',{class:'f1713-status',role:'status','aria-live':'polite'}),detail=h('p',{class:'f1713-info'});
 window.NovaLessonComponent?.applyExploreModels();const button=(txt,fn)=>h('button',{class:'nova-btn',text:txt,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();const faceButtons=h('div',{class:'f1713-face-buttons',role:'group','aria-label':'Keyboard equivalents: choose which die faces win'});
 window.NovaLessonComponent?.applyExploreModels();const faceNodes=[...Array(6)].map((_,i)=>button('Face '+(i+1),()=>toggle(i)));
 window.NovaLessonComponent?.applyExploreModels();faceButtons.append(...faceNodes);
 window.NovaLessonComponent?.applyExploreModels();function toggle(i){if(m.win.has(i))m.win.delete(i);else m.win.add(i);clear(m);emit('winningFaces',[...m.win]);draw();}
 window.NovaLessonComponent?.applyExploreModels();function draw(){scene(stage,m,{interact:true,changed:draw,flash:m.flash,pose:m.flash?'celebrate':'compare',say:m.flash?'Nice experiment. Short-run results need not match the expected value.':'Change the winning faces or prize to balance the return against the entry cost.'});
  const p=chance(m),ev=expected(m);
  st.textContent=`${classify(m)} · chance ${m.win.size}/6 · gross prize ${money(m.prize)} · entry ${money(m.stake)} · expected net ${money(ev)} per play.`;
  detail.textContent=`Observed ${m.success} wins from ${m.tries} plays · net ${money(m.earned)} · ${m.last}. Experimental return may not exactly match theory.`;
  faceNodes.forEach((b,i)=>{b.setAttribute('aria-pressed',m.win.has(i)?'true':'false');b.textContent='Face '+(i+1)+(m.win.has(i)?' · WIN':' · LOSE');});
  emit('winningCount',m.win.size);emit('probability',p);emit('payout',m.prize);emit('entryCost',m.stake);emit('expectedNet',round(ev));emit('fairness',classify(m));}
 window.NovaLessonComponent?.applyExploreModels();function sim(n){run(m,n);m.flash=true;draw();m.flash=false;const svg=stage.querySelector('svg.f1713-plot');if(svg)M.flash(svg,layout().hub.x,layout().hub.y,'focus',100);}
 window.NovaLessonComponent?.applyExploreModels();prize.addEventListener('change',()=>{m.prize=Number(prize.value);clear(m);draw();});
 window.NovaLessonComponent?.applyExploreModels();const row=h('div',{class:'f1713-controls'},[h('label',{class:'f1713-field'},['Gross prize paid for a win',prize]),button('Fair setup · 2 wins, £3',()=>{m.win=new Set([0,2]);m.prize=3;prize.value='3';clear(m);draw();}),button('Unfair setup · 1 win, £3',()=>{m.win=new Set([1]);m.prize=3;prize.value='3';clear(m);draw();})]);
 window.NovaLessonComponent?.applyExploreModels();const trials=h('div',{class:'f1713-controls'},[button('Simulate 1',()=>sim(1)),button('Simulate 10',()=>sim(10)),button('Simulate 100',()=>sim(100)),button('Reset results',()=>{clear(m);draw();})]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f1713-info',text:'WIN markers change which die faces pay the gross prize. Drag a WIN marker from the supply to an outcome; re-grab an existing marker to move it, or drop it in REMOVE. The face buttons provide a keyboard alternative. The entry cost is always £1 per play.'}),row,faceButtons,trials,st,detail);
 window.NovaLessonComponent?.applyExploreModels();draw();window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({win:[...m.win].sort(),prize:m.prize,stake:m.stake,tries:m.tries,success:m.success,earned:m.earned,expected:expected(m),fair:classify(m)}),set:(w,pr)=>{m.win=new Set(w);if(pr){m.prize=pr;prize.value=String(pr);}clear(m);draw();},toggle,run:sim,reset:()=>{clear(m);draw();}};
}
function challenge(panel,api,stage){const tasks=[
 {q:'A game costs £1. Two of six equally likely faces pay a £3 gross prize; the other faces pay nothing. What is the expected NET gain per play in pounds?',f:[0,2],prize:3,ans:0,bad:[[1,'That is expected gross prize return. Subtract the £1 entry cost.'],[3,'A prize of £3 is not guaranteed. Multiply by the winning probability first.']],hint:'Use 2/6 × 3 − 1.'},
 {q:'A £1 game pays a £3 gross prize if a die shows 6, and £0 otherwise. What is the expected NET gain per play in pounds?',f:[5],prize:3,ans:-0.5,bad:[[0.5,'You found the expected gross return. Subtract the £1 entry cost.'],[0,'One winning face out of six is not enough to make a £3 gross prize fair.']],hint:'Use 1/6 × 3 − 1.'},
 {q:'A £1 game pays a £4 gross prize on three of six equally likely faces. What is the expected NET gain in pounds per play?',f:[0,2,4],prize:4,ans:1,bad:[[2,'That is the expected gross return. Subtract the £1 cost.'],[-1,'A player has a positive advantage in this game.']],hint:'Use 3/6 × 4 − 1.'},
 {q:'A £1 game pays a £2 gross prize for every winning face on a fair six-sided die. How many winning faces would make the game FAIR?',f:[],prize:2,ans:3,bad:[[2,'Two sixths times £2 is only two-thirds of a pound.'],[6,'With every face winning, the player has an advantage.']],hint:'A fair game has expected net gain zero: (winning faces / 6) × 2 = 1.'}
 ];
 const items=tasks.map((t,i)=>({q:t.q,build:NOVA.entryTask(i===3?'Winning faces':'Expected net gain (£)','F17-13'),check:v=>{let ok=Number.isFinite(v)&&Math.abs(v-t.ans)<1e-6,bad=t.bad.find(([x])=>Math.abs(v-x)<1e-6);return [ok,ok?'Correct. The theoretical return balances the prize, chance and entry cost.':bad?bad[1]:'Multiply chance by gross prize, subtract £1, and keep the sign of your net gain.'];},hint:t.hint}));
 function reveal(i){let t=tasks[i],m=initial();m.win=new Set(t.f);m.prize=t.prize;scene(stage,m,{title:'Challenge '+(i+1)+' · Fair game?',tag:'QUESTION '+(i+1)+' / 4',hideAnswer:true,pose:'think',say:'Work from the winning faces and gross prize. Remember the entry cost is one pound.'});}
 NOVA.challengeRun(panel,api,items,reveal,CFG);
 const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-13')return;stage.querySelector('.nv-dock')?.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'Exactly! The expected NET is based on the whole game, not one lucky trial.':'Check the winning chance, gross prize and the one-pound entry cost.');if(e.detail.correct){const svg=stage.querySelector('svg.f1713-plot');if(svg)M.flash(svg,layout().hub.x,layout().hub.y,'result',80);}});api.onCleanup(off);
}
const DEF={id:'F17-13',title:'Fair Game Tester',config:CFG,steps,render:showStep,alt:'Premium neon six-sector dice wheel with 6 glass outcome bays, drag-and-drop winning markers, theoretical net fairness gauge and observed experiment readouts.',staticAlt:'A £1 game with 2 winning die faces from 6 and £3 gross prize is fair: (2/6) × £3 − £1 = £0.',exploreIntro:'Assign WIN markers to die faces, change a gross prize, and test the predicted average net return against 1, 10 or 100 random plays.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-13',DEF,{models:{},tables:{"PRESETS":()=>PRESETS,"steps":()=>steps},draws:{"scene":["stage","m","o"]},exploreFields:{"m":{"kind":"factory","factory":"initial","argCount":0},"showStep.m":{"kind":"factory","factory":"initial","argCount":0}}});
NOVA.bankMount({id:'F17-13',num:'F17·13',title:'Fair Game Tester',def:DEF,years:'Year 9; GCSE expected value extension.',linked:['F0-02','F0-03','F0-04','F17-03','F17-04','F17-12'],spec:{purpose:'Compare theoretical fair, house-favoured and player-favoured games via expected net return and experimental outcomes.',params:'Six equally likely die faces; 0–6 winning faces; £1 entry cost; £2, £3, £4, £6 or £12 gross prize; experiment in 1, 10 or 100 trials.',presets:'Y9-046 Experimental probability and relative frequency, with fair and unfair adjustable configurations within one engine.',steps:'Define fair → count favourable faces → expected gross return → subtract entry cost → simulate → rebalance.',interactions:'Core NOVA neonPath/neonBox/neonRing/chalkText artwork; svgDrag markers to six outcome targets and a red removal zone, recovery and keyboard controls; reproducible random trials.',traps:'Treating win chance of one half as automatically fair; confusing prize with net profit; omitting entry fee; expecting every random sample to break even.',gcse:'Expected value and weighted return of discrete games.'}});
const log=document.getElementById('log');if(log){let add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
