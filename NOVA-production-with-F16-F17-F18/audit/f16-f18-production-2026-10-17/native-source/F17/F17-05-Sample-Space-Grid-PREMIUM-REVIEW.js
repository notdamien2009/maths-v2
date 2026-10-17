/* F17-05 SAMPLE-SPACE GRID — NOVA F0/F2/F17 actual shared-core consumer */
(function(){'use strict';
const h=NOVA.h, S=NOVA.svg, E=S.el, M=NOVA.motion;
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_05_CONFIG={startMode:'watch',preset:'y7list',events:['value','correct','step','mode','hintUsed'],valueKeys:['preset','outcome','selected','markedCount','favourableCount','totalOutcomes','probability','completed','lastMoved','reset'],presets:{
 y7list:{label:'Y7-074 · Coin and three-colour spinner',year:7,rows:['H','T'],cols:['R','B','G'],rowTitle:'COIN',colTitle:'SPINNER',event:'Heads with blue',description:'Coin × 3 equal spinner sectors',isWin:(a,b)=>a==='H'&&b==='B'},
 y7events:{label:'Y7-075 · Two fair coins',year:7,rows:['H','T'],cols:['H','T'],rowTitle:'COIN A',colTitle:'COIN B',event:'Exactly one head',description:'Coin A × Coin B',isWin:(a,b)=>(a==='H')!==(b==='H')},
 y8:{label:'Y8-070 · Coin and die',year:8,rows:['H','T'],cols:['1','2','3','4','5','6'],rowTitle:'COIN',colTitle:'DIE',event:'Heads AND an even number',description:'Coin × six-sided die',isWin:(a,b)=>a==='H'&&Number(b)%2===0},
 y9:{label:'Y9-043 · Two fair dice',year:9,rows:['1','2','3','4','5','6'],cols:['1','2','3','4','5','6'],rowTitle:'DIE A',colTitle:'DIE B',event:'Sum equals seven',description:'Die A × Die B',isWin:(a,b)=>Number(a)+Number(b)===7}
 }});
const preset=()=>CFG.presets[CFG.preset]||CFG.presets.y7list;
const isMobile=()=>innerWidth<=500;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const key=(r,c)=>r+'-'+c;
const coords=(s)=>s.split('-').map(Number);
const allCells=(p)=>p.rows.flatMap((_,r)=>p.cols.map((_,c)=>key(r,c)));
const favourable=(p)=>allCells(p).filter(k=>{let [r,c]=coords(k);return p.isWin(p.rows[r],p.cols[c]);});
const getCounts=(p,marked)=>({selected:marked.size,total:p.rows.length*p.cols.length,correct:favourable(p).length,hits:[...marked].filter(k=>favourable(p).includes(k)).length,exact:marked.size===favourable(p).length&&[...marked].every(k=>favourable(p).includes(k))});
const gcd=(a,b)=>b?gcd(b,a%b):a;
const reduce=(n,d)=>{if(!d)return [0,1];let g=gcd(n,d);return [n/g,d/g]};
const say=(g,x,y,t,role='op',size=20,anchor='middle')=>NOVA.chalkText(g,x,y,String(t),{role,size,anchor});
function fractionSVG(g,x,y,n,d,role='op',size=21){const [a,b]=[n,d];say(g,x,y-6,a,role,size);NOVA.neonLine(g,x-size*.67,y+3,x+size*.67,y+3,{role,width:2.6});say(g,x,y+size+6,b,role,size);}
function fracSpan(n,d,raw=false){const [a,b]=raw?[n,d]:reduce(n,d);let x=h('span',{class:'f175-frac','aria-label':a+' over '+b});x.append(h('b',{text:String(a)}),h('i',{'aria-hidden':'true'}),h('b',{text:String(b)}));return x;}
function metric(label,value,role,den,raw=false){let x=h('div',{class:'f175-card','data-role':role});x.appendChild(h('span',{class:'lab',text:label}));x.appendChild(den===undefined?h('span',{class:'val',text:String(value)}):fracSpan(value,den,raw));return x;}
function emit(k,v){if(!CFG.valueKeys.includes(k))throw Error('F17-05 invalid value key '+k);NOVA.events.emit('value',{engine:'F17-05',key:k,value:v});}
function signal(p,m){const n=getCounts(p,m.marked);emit('preset',CFG.preset);emit('markedCount',n.selected);emit('totalOutcomes',n.total);emit('favourableCount',n.correct);emit('probability',n.correct/n.total);emit('completed',n.exact);}
function newModel(){return {marked:new Set(),last:null,reveal:false,focusKey:'0-0'};}
function layout(p){let mobile=isMobile(),max=Math.max(p.rows.length,p.cols.length);return mobile?{W:390,H:743,gridX:67,gridY:175,gridW:275,gridH:max>=6?288:265,headY:71,descY:101,infoY:502,fracY:584,palY:679,palX:115,remX:293,cellMin:18}:
 {W:840,H:678,gridX:161,gridY:137,gridW:516,gridH:max>=6?342:342,headY:53,descY:90,infoY:509,fracY:592,palY:635,palX:273,remX:660,cellMin:21};}
function outcome(p,r,c){return p.rows[r]+' , '+p.cols[c]};
function renderStage(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("renderStage",arguments);}

 stage.innerHTML='';const A=layout(p),n=getCounts(p,m.marked),C=p.cols.length,R=p.rows.length,cw=A.gridW/C,ch=A.gridH/R;
 NOVA.cap(stage,o.title||'Two-event sample space',o.tag||'SAMPLE SPACE');
 const svg=S.root(A.W,A.H,'NOVA neon sample-space grid with all '+n.total+' ordered outcomes, labelled row and column events, and selectable favourable-event chips.');svg.classList.add('f175-plot');svg.setAttribute('data-engine-plot','F17-05');
 say(svg,A.W/2,A.headY,p.event,'focus',isMobile()?21:24);
 if(isMobile())say(svg,A.W/2,A.descY,'EQUALLY LIKELY ORDERED OUTCOMES','given',15);
 // Outer neon construction; mathematically, rows × columns generates every ordered outcome exactly once.
 NOVA.neonBox(svg,A.gridX-6,A.gridY-6,A.gridW+12,A.gridH+12,{role:'given',r:17});
 const labelSize=isMobile()?19:22;
 for(let c=0;c<C;c++)say(svg,A.gridX+(c+.5)*cw,A.gridY-17,p.cols[c],'op',labelSize);
 for(let r=0;r<R;r++)say(svg,A.gridX-29,A.gridY+(r+.5)*ch+8,p.rows[r],'op',labelSize);
 say(svg,A.gridX-31,A.gridY-34,p.rowTitle,'given',isMobile()?14:18,'middle');
 say(svg,A.gridX+A.gridW/2,A.gridY-43,p.colTitle,'given',isMobile()?15:19);
 const zones=[];
 for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  const k=key(r,c),x=A.gridX+c*cw,y=A.gridY+r*ch,here=m.marked.has(k),correct=p.isWin(p.rows[r],p.cols[c]),uncovered=o.revealAll||o.showWin&&correct,hidden=o.revealCount!==undefined&&(r*C+c)>=o.revealCount;
  const role=here?'result':uncovered?'focus':hidden?'unknown':'given';
  const group=E('g',{'data-cell':k,tabindex:o.interact&&m.focusKey===k?0:-1,role:o.interact?'button':'img','aria-label':outcome(p,r,c)+(here?', selected as favourable':', not marked'),'aria-pressed':o.interact?String(here):undefined},svg);
  NOVA.neonBox(group,x+3,y+3,cw-6,ch-6,{role,r:Math.min(12,cw/6)});
  if(!hidden){
   const v=outcome(p,r,c);const font=isMobile()?(C>=6?18:21):(C>=6?21:24);
   say(group,x+cw/2,y+ch/2+(here?-10:7),v,here?'result':uncovered?'focus':'op',font);
   if(here){NOVA.neonRing(group,x+cw/2,y+ch/2+Math.min(21,ch*.23),{role:'result',r:Math.min(8,ch*.11),pulse:false});}
   else if(o.showWin&&correct){NOVA.neonRing(group,x+cw/2,y+ch/2+Math.min(21,ch*.23),{role:'focus',r:Math.min(8,ch*.11),pulse:false});}
  }else{say(group,x+cw/2,y+ch/2+7,'?', 'unknown',Math.max(19,labelSize));}
  if(o.interact){group.addEventListener('click',()=>{NOVA.ui.cancelDrag();o.toggle(k);});group.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();o.toggle(k);}
    const delta={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]}[e.key];
    if(delta){e.preventDefault();const nk=key(clamp(r+delta[0],0,R-1),clamp(c+delta[1],0,C-1));const next=svg.querySelector('[data-cell="'+nk+'"]');if(next){group.setAttribute('tabindex','-1');next.setAttribute('tabindex','0');m.focusKey=nk;next.focus();}}
   });}
  zones.push({x:x+2,y:y+2,w:cw-4,h:ch-4,id:k,kind:'drop'});
 }
 // World positioning stays within the same glowing stage, with no extra stage-splitting row.
 say(svg,A.W/2,A.infoY,(o.helpLabel||'MARKED FAVOURABLE OUTCOMES')+'   '+n.selected+' / '+n.total,'given',isMobile()?15:20);
 say(svg,A.W/2,A.fracY-45,'P(EVENT)','focus',isMobile()?18:22);
 fractionSVG(svg,A.W/2,A.fracY+4,o.challenge||o.hideAnswer?'?':n.selected,n.total,m.reveal||o.showWin?'result':'op',isMobile()?19:25);
 const removeZone={x:A.remX-(isMobile()?60:74),y:A.palY-29,w:isMobile()?120:148,h:56,id:'remove',kind:'remove'};
 if(o.interact){
  const toggle=k=>o.toggle(k);
  // Green snap target on pickup is managed by core SVG drag kit, not a custom gesture handler.
  const tray=E('g',{'data-mark-palette':'1',tabindex:0,role:'button','aria-label':'Drag a favourable outcome token onto the grid, or choose a cell and press Mark outcome.'},svg);
  NOVA.neonBox(tray,A.palX-(isMobile()?66:80),A.palY-26,isMobile()?132:160,52,{role:'focus',r:14,text:'MARK',size:19});
  NOVA.neonBox(svg,removeZone.x,removeZone.y,removeZone.w,removeZone.h,{role:'error',r:14,text:'REMOVE',size:18});
  // Avoid overlapping zones; the removal tray is exclusively at the bottom-right.
  const z=[...zones,removeZone];
  NOVA.ui.svgDrag(svg,tray,{box:{x:A.palX-66,y:A.palY-26,w:132,h:52},zones:()=>z,removeTo:{x:A.remX,y:A.palY},onDrop:(id)=>{if(!id||id==='remove')return false;m.marked.add(id);emit('lastMoved',id);o.onChange();return true;},onRemove:()=>{}});
  for(let k of m.marked){let [r,c]=coords(k),x=A.gridX+(c+.5)*cw,y=A.gridY+(r+.5)*ch,rr=Math.min(cw,ch)*.26;
   const piece=E('g',{'data-placed':k,tabindex:0,role:'button','aria-label':'Marked outcome '+outcome(p,r,c)+'. Drag to another cell or red removal tray. Delete removes it.'},svg);
   NOVA.neonRing(piece,x,y+Math.min(21,ch*.23),{role:'result',r:Math.max(9,rr),pulse:false});
   NOVA.ui.svgDrag(svg,piece,{box:{x:x-rr,y:y+Math.min(21,ch*.23)-rr,w:rr*2,h:rr*2},zones:()=>z,removeTo:{x:A.remX,y:A.palY},onDrop:id=>{if(!id||id==='remove')return false;m.marked.delete(k);m.marked.add(id);emit('lastMoved',id);o.onChange();return true;},onRemove:()=>{m.marked.delete(k);o.onChange();}});
   piece.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();m.marked.delete(k);o.onChange();}});
  }
 }else{
  const x0=A.palX;NOVA.neonBox(svg,x0-87,A.palY-27,174,54,{role:'focus',r:14,text:'ROWS × COLUMNS',size:17});
  NOVA.neonBox(svg,A.remX-78,A.palY-27,156,54,{role:'result',r:14,text:R+' × '+C+' = '+n.total,size:19});
 }
 stage.appendChild(svg);
 const metrics=h('div',{class:'f175-readouts'});
 metrics.append(metric('OUTCOMES',n.total,'unknown'),metric('MARKED',n.selected,'focus'));if(o.challenge||o.hideAnswer)metrics.append(metric('FIND P(EVENT)','?','result'));else if(m.reveal||o.showWin)metrics.append(metric('EVENT CHANCE',n.correct,'result',n.total));else metrics.append(metric('MARKED CHANCE',n.selected,'result',n.total,true));stage.append(metrics);
 let speech=o.say||('Count '+R+' rows and '+C+' columns: '+n.total+' distinct ordered outcomes.');
 NOVA.scene.helperStrip(stage,o.pose||'explain',speech);
 if(o.flash)M.flash(svg,A.gridX+A.gridW*.75,A.gridY+A.gridH*.45,'result',62);
 return {svg,layout:A,count:n,zones};
}
const steps=[
 {name:'Start with two events',pose:'explain',narration:'A sample space records every possible combination when two events happen. Rows represent the first event and columns represent the second.',prompt:'What will each row represent?'},
 {name:'Build one ordered pair',pose:'point-down',narration:'Choose a row and a column. Their intersection gives one ordered outcome. The order matters when the two events are distinct.',prompt:'Which pair is in the top-left cell?'},
 {name:'Complete the grid',pose:'count',narration:'Systematic listing means no gaps and no repeats. The number of equally likely outcomes is rows multiplied by columns.',prompt:'How many cells are there in total?'},
 {name:'Apply the event condition',pose:'compare',narration:'Decide which ordered outcomes match the exact event. Mark only those cells, and remember AND means both conditions must hold.',prompt:'Do all outcomes satisfy the event?'},
 {name:'Count favourable outcomes',pose:'think',narration:'Count the highlighted favourable combinations. Then compare this count with all cells in the entire sample space.',prompt:'What is the denominator of the probability?'},
 {name:'Find the exact probability',pose:'celebrate',narration:'For equally likely outcomes, probability equals the favourable count divided by the full sample space count. Simplify your answer.',prompt:'Why is it important to include every possible outcome?'}
];
function drawStep(i,stage){let p=preset(),f=favourable(p),m=newModel();let k=clamp(i,0,5),n=p.rows.length*p.cols.length;if(k>=3)m.marked=new Set(f.slice(0,k===3?Math.min(1,f.length):f.length));
 renderStage(stage,p,m,{title:steps[k].name,tag:'STEP '+(k+1)+'/6',hideAnswer:k<4,revealCount:[0,1,n,n,n,n][k],showWin:k>=4,pose:steps[k].pose,flash:k===5,say:[
 'Use one axis for each event. Every intersection will be an ordered outcome.',
 'The first outcome uses the first row and first column.',
 'There are '+p.rows.length+' × '+p.cols.length+' = '+n+' possible ordered pairs.',
 'Read the event condition carefully; mark one qualifying pair.',
 'Count '+f.length+' favourable pairs in a full grid of '+n+' outcomes.',
 'Probability is '+reduce(f.length,n)[0]+' over '+reduce(f.length,n)[1]+'; every cell had equal chance.'
 ][k]});
}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=preset(),m=newModel();window.NovaLessonComponent?.applyExploreModels();const pres=h('select',{class:'nova-input','aria-label':'Lesson preset'}),cellSelect=h('select',{class:'nova-input','aria-label':'Outcome cell'}),status=h('div',{class:'f175-status',role:'status','aria-live':'polite'}),first=h('div',{class:'f175-box'}),second=h('div',{class:'f175-box'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([k,x])=>pres.appendChild(h('option',{value:k,text:x.label})));
 window.NovaLessonComponent?.applyExploreModels();const btn=(label,fn)=>h('button',{class:'nova-btn',text:label,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function redraw(){const s=renderStage(stage,p,m,{title:'Mark outcomes that match the event',tag:'LIVE SAMPLE SPACE',interact:true,onChange:()=>{signal(p,m);redraw();},toggle,say:m.marked.size?'You marked '+m.marked.size+' combinations. Check every cell against “'+p.event+'”.':'Work across rows and down columns. Mark every ordered pair that meets the condition.',pose:m.marked.size?'compare':'explain'});
  let a=getCounts(p,m.marked);status.textContent=a.selected+' marked / '+a.total+' total · '+a.hits+' correct marked · '+(a.exact?'all favourable outcomes found':'keep checking for missing or incorrect outcomes');status.className='f175-status'+(a.exact?' good':'');return s;}
 window.NovaLessonComponent?.applyExploreModels();function toggle(k){m.focusKey=k;if(m.marked.has(k))m.marked.delete(k);else m.marked.add(k);emit('outcome',k);signal(p,m);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function setPreset(k){NOVA.ui.cancelDrag();CFG.preset=k;p=preset();m=newModel();cellSelect.innerHTML='';allCells(p).forEach(k=>{let [r,c]=coords(k);cellSelect.appendChild(h('option',{value:k,text:outcome(p,r,c)}));});pres.value=k;emit('reset','preset');signal(p,m);redraw();}
 window.NovaLessonComponent?.applyExploreModels();first.appendChild(h('label',{class:'f175-label'},['Lesson preset ',pres]));window.NovaLessonComponent?.applyExploreModels();first.append(btn('Clear markers',()=>{NOVA.ui.cancelDrag();m.marked.clear();emit('reset','markers');signal(p,m);redraw();}),btn('Reveal correct event',()=>{m.marked=new Set(favourable(p));m.reveal=true;signal(p,m);redraw();}),btn('Reset model',()=>setPreset(CFG.preset)));
 window.NovaLessonComponent?.applyExploreModels();second.appendChild(h('label',{class:'f175-label'},['Outcome to mark ',cellSelect]));window.NovaLessonComponent?.applyExploreModels();second.append(btn('Mark / unmark',()=>toggle(cellSelect.value)),btn('Remove selected',()=>{m.marked.delete(cellSelect.value);signal(p,m);redraw();}));
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f175-info',text:'Each grid cell is an ordered pair. Drag the glowing MARK chip to a cell, drag an existing marker to move it, or drag it to REMOVE. Tap a cell or use the accessible outcome selector below. Green markers are your selection — check the event condition before deciding.'}),first,second,status);
 window.NovaLessonComponent?.applyExploreModels();pres.onchange=()=>setPreset(pres.value);window.NovaLessonComponent?.applyExploreModels();setPreset(CFG.preset);
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,marked:[...m.marked],...getCounts(p,m.marked),favourable:favourable(p),probability:favourable(p).length/(p.rows.length*p.cols.length)}),setPreset,toggle,clear:()=>{m.marked.clear();signal(p,m);redraw();},reveal:()=>{m.marked=new Set(favourable(p));signal(p,m);redraw();}};
 window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
}
function challenge(panel,api,stage){
 const tasks=[
  {q:'Toss a coin and spin three equal colours. How many ordered combinations are possible?',build:NOVA.entryTask('Number of outcomes','F17-05'),check:v=>[v===6,v===6?'Correct. Two coin results multiplied by three colours gives six.':v===5?'Use multiplication, not addition: two rows of three.':'Count all cells: rows multiplied by columns.'],hint:'Two possible coin results and three equal spinner sectors.'},
  {q:'Two fair coins are tossed. How many ordered outcomes have exactly ONE head?',build:NOVA.entryTask('Favourable outcomes','F17-05'),check:v=>[v===2,v===2?'Correct. HT and TH are the two favourable ordered outcomes.':v===1?'HT and TH are distinct outcomes.':'List HH, HT, TH and TT, then count the pairs with one head.'],hint:'List all four ordered pairs; distinguish HT from TH.'},
  {q:'A fair coin and a fair die are used. How many outcomes show Heads AND an even number?',build:NOVA.entryTask('Favourable outcomes','F17-05'),check:v=>[v===3,v===3?'Correct. H2, H4 and H6 give three outcomes from twelve.':v===6?'You counted every die face, but only even values qualify.':v===9?'Both conditions must be true, so include only heads with even die outcomes.':'Look along the Heads row and mark 2, 4 and 6 only.'],hint:'Read the Heads row; the even faces are 2, 4 and 6.'},
  {q:'Two fair dice are rolled. What is the probability that their sum is 7? Enter a fraction or decimal.',build:NOVA.entryTask('Probability of sum seven','F17-05'),check:v=>[Math.abs(v-1/6)<.0001,Math.abs(v-1/6)<.0001?'Correct. Six favourable ordered pairs out of thirty-six, simplified to one sixth.':v===7?'Seven is the SUM, not the probability.':v===6?'Six is a favourable count, not a probability; divide by 36.':v===1/12?'There are six ordered pairs, because reverses also count.':'Find all six ways of making seven, then divide by thirty-six.'],hint:'The ordered pairs are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1).'}
 ];
 function draw(i){let p=CFG.presets[['y7list','y7events','y8','y9'][i]],m=newModel();renderStage(stage,p,m,{title:'Challenge '+(i+1)+' · check each combination',tag:'TASK '+(i+1)+'/4',challenge:true,pose:'think',say:'Count each ordered pair once. Use rows multiplied by columns for the whole sample space.'});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-05')return;let dock=stage.querySelector('.nv-dock');if(dock)dock.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'Good systematic counting. Every outcome was included exactly once.':'Check the row and column combinations; do not confuse outcomes with probability.');if(e.detail.correct){let svg=stage.querySelector('svg.f175-plot');if(svg){let A=layout(preset());M.flash(svg,A.gridX+A.gridW*.74,A.gridY+A.gridH*.4,'result',60);}}});api.onCleanup(off);
}
const DEF={id:'F17-05',title:'Sample-Space Grid',config:CFG,steps,render:drawStep,
 alt:'Premium glowing sample-space matrix crossing two independent events, each ordered pair in a labelled cell, with draggable outcome markers and a stacked probability fraction.',
 staticAlt:'For two fair independent events, every ordered pair appears once in the sample-space grid. P(event) equals favourable outcomes divided by the number of all equally likely outcomes.',
 exploreIntro:'Build a complete outcome grid and mark the favourable combinations. Drag, click, or use the keyboard and selector to check every pair.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-05',DEF,{models:{},tables:{"steps":()=>steps},draws:{"renderStage":["stage","p","m","o"]},exploreFields:{}});
NOVA.bankMount({id:'F17-05',num:'F17·05',title:'Sample-Space Grid',def:DEF,years:'KS3 Years 7–9; GCSE combined events, systematic listing and probability.',linked:['F0-02','F0-03','F0-04','F0-16','F17-02','F17-03','F17-04','F17-06'],spec:{purpose:'Systematically list all ordered outcomes for two fair events and calculate exact combined-event probability.',params:'Two or six rows and two, three or six columns; 4/6/12/36 equally likely combinations; event predicate; movable outcome markers.',presets:'Y7-074 coin × three-colour spinner; Y7-075 two coins; Y8-070 coin × die; Y9-043 two dice.',steps:'Set axes → locate one ordered pair → finish all rows and columns → test condition → count favourable → calculate probability.',interactions:'Watch, Guided, Explore and Challenge. Real SVG drag with drop, re-grab, removal and invalid return; cell click and keyboard or select/button equivalent; four checked tasks.',traps:'Adding instead of multiplying possible outcomes; overlooking reversed ordered pairs; confusing AND with OR; counting favourable outcomes without a complete sample space; dividing by only the favourable count.',gcse:'Two-step independent experiments, ordered pairs, probability of combined events and systematic enumeration.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5300);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
