/* NOVA F9-04 · Sequence on a graph · built on the F0/F3 common drawing and motion API. */
const F904_CONFIG={id:'F9-04',family:'F9',startMode:'watch',preset:'Y7-037-linear-nth-term',
 presets:{
 'Y7-037-linear-nth-term':{label:'Y7 · 2n + 1',year:'Year 7',kind:'linear',a:2,b:1,yMax:14,yStep:2,formula:'2n + 1',objective:'Plot a linear nth-term sequence and read the constant difference.'},
 'Y8-019-arithmetic-sequences':{label:'Y8 · 14 − 2n',year:'Year 8',kind:'linear',a:-2,b:14,yMax:14,yStep:2,formula:'14 − 2n',objective:'See how a negative constant difference makes the sequence fall.'},
 'Y8-021-quadratic-pattern-spotting':{label:'Y8 · n² + 1',year:'Year 8',kind:'quadratic',a:1,b:0,c:1,yMax:30,yStep:5,formula:'n² + 1',objective:'Plot growing first differences and constant second differences.'},
 'Y9-008-quadratic-pattern-structure':{label:'Y9 · n² − n + 2',year:'Year 9',kind:'quadratic',a:1,b:-1,c:2,yMax:25,yStep:5,formula:'n² − n + 2',objective:'Use the second-difference structure to recognise a simple quadratic pattern.'}
 },events:{value:['preset','position','term','placed','challengeTask','rule'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';const N=window.NOVA,C=F904_CONFIG,H=N.h,E=N.svg.el,id=C.id;
const small=()=>innerWidth<=760;const wide=()=>small()?430:760;
const height=(challenge=false)=>small()?(challenge?820:655):(challenge?790:607);
const preset=(key)=>C.presets[key];
const term=(p,n)=>p.kind==='linear'?p.a*n+p.b:p.a*n*n+p.b*n+p.c;
const sequence=(p)=>Array.from({length:5},(_,i)=>term(p,i+1));
const diffs=(v)=>N.table.diffs(v);
const steps=[
 {name:'plot-the-first-point',preset:'Y7-037-linear-nth-term',visible:1,trend:false,pose:'explain',text:'On this graph, the horizontal axis gives the position. The vertical axis gives the term value.',prompt:'Find position one. How high should we plot its term?'},
 {name:'plot-the-next-term',preset:'Y7-037-linear-nth-term',visible:2,trend:false,pose:'point-right',text:'Move one place to the right, then plot the next term two units higher.',prompt:'Compare the positions and term values.'},
 {name:'see-the-common-difference',preset:'Y7-037-linear-nth-term',visible:4,trend:false,pose:'count',text:'The terms grow by two each time. The points rise by the same amount.',prompt:'What is the change in term value for each one-step move?'},
 {name:'reveal-the-linear-trend',preset:'Y7-037-linear-nth-term',visible:5,trend:true,pose:'idea',text:'These plotted terms lie on a straight trend. Only whole-number positions are sequence terms.',prompt:'Do the points make a straight pattern?'},
 {name:'plot-a-decreasing-sequence',preset:'Y8-019-arithmetic-sequences',visible:5,trend:true,pose:'point-right',text:'A constant negative difference makes the points fall as the position grows.',prompt:'Why does this graph slope down?'},
 {name:'compare-a-quadratic-pattern',preset:'Y8-021-quadratic-pattern-spotting',visible:5,trend:true,pose:'celebrate',text:'These points curve upward. The first differences grow, but the second differences stay at two.',prompt:'Why is the quadratic graph not a straight pattern?'}];
let active=0,chosen='Y7-037-linear-nth-term',reveal=5,showTrend=true,challengeTask=0,placed={},keyboardPick=null,challengePanel=null,challengeApi=null,challengeStage=null,challengeDone=false;
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9 event '+key);N.events.emit('value',{engine:id,key,value});}
function mathText(parent,x,y,value,size=18,role='given',anchor='middle'){return N.chalkText(parent,x,y,String(value),{size,role,anchor});}
function nbox(parent,x,y,w,h,value,role='given',size=18){return N.neonBox(parent,x,y,w,h,{role,text:value,size,r:13});}
function btn(text,click,cls='nova-btn ghost'){return H('button',{class:cls,text,onclick:click});}
function svgRoot(alt,challenge=false){const svg=N.svg.root(wide(),height(challenge),alt);svg.setAttribute('class','nv-svg f904-svg');svg.setAttribute('role','img');return svg;}
function reset(stage){stage.innerHTML='';N.cap(stage,'Sequence workshop','Sequence on a graph');}
function card(label,value,gold=false){return H('div',{class:'f904-card'+(gold?' f904-card--gold':'')},[H('div',{class:'f904-eyebrow',text:label}),H('div',{class:'f904-maths'+(gold?' f904-maths--gold':''),text:String(value)})]);}
function note(label,text){return H('div',{class:'f904-card f904-card--full'},[H('div',{class:'f904-eyebrow',text:label}),H('div',{class:'f904-body',text})]);}
function wrap(stage,svg,cards,pose,speech){stage.appendChild(H('div',{class:'f904-stage'},[svg,H('aside',{class:'f904-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function plotScene(svg,p,opt={}){
 const W=wide(),sm=small(),challenge=!!opt.challenge;
 const origin={x:sm?65:99,y:sm?138:125,w:sm?333:550,h:sm?340:340};
 const ymax=p.yMax;
 mathText(svg,W/2,43,opt.title||'POSITION n  →  TERM T(n)',sm?23:28,'support');
 mathText(svg,W/2,76,opt.subtitle||'Plot discrete sequence terms',sm?16:19,'support');
 const P=N.neonPlot(svg,{x0:origin.x,y0:origin.y,w:origin.w,h:origin.h,x:[0,6],y:[0,ymax],xStep:1,yStep:p.yStep,xLabel:null,yLabel:null,grid:true});
 // Axes/plot/grid are the F0 plotting primitive, rather than a new SVG drawing style.
 mathText(svg,origin.x+origin.w-56,origin.y+origin.h+26,'Position n',sm?15:19,'support');
 mathText(svg,origin.x+67,origin.y-14,'Term value',sm?15:19,'support');
 const values=sequence(p),visibility=opt.visible??5,hide=opt.hide||[];
 const xs=Array.from({length:5},(_,i)=>P.X(i+1)),ys=values.map(v=>P.Y(v));
 // A trend is a guide ONLY. The mathematical sequence exists at integer n.
 if(opt.trend){const points=values.slice(0,visibility).map((v,i)=>[i+1,v]);
   if(points.length>1){ const traced=p.kind==='quadratic'?Array.from({length:41},(_,i)=>{let n=1+(visibility-1)*i/40;return [n,term(p,n)];}):points; const d=traced.map((q,i)=>(i?'L':'M')+P.X(q[0]).toFixed(2)+','+P.Y(q[1]).toFixed(2)).join(' ');
     const path=N.neonPath(svg,d,{role:'focus',width:sm?3.1:3.9,dash:'6 8'});path.classList.add('f904-guide'); }
 }
 values.forEach((v,i)=>{
  if(i>=visibility)return;
  const n=i+1,isHidden=hide.includes(n),x=xs[i],y=ys[i];
  if(isHidden){
   N.neonRing(svg,x,y,{role:'unknown',r:sm?15:18,pulse:false});
   E('rect',{x:x-22,y:y-22,width:44,height:44,rx:14,fill:'transparent',class:'f904-slot-hit','data-slot':'point-'+n,tabindex:0,role:'button','aria-label':'Plot the point at position '+n},svg);
   return;
  }
  N.neonRing(svg,x,y,{role:i===visibility-1?'result':'given',r:sm?12:14,pulse:false});
  // Coordinate labels are drawn with NOVA Chalk, not the F0 plot's small default label font.
  const offset=(i===0?31:sm?23:28);
  mathText(svg,x,y-offset,'('+n+', '+v+')',sm?14:16,i===visibility-1?'result':'support');
  if(opt.newIndex===i&&!N.reducedMotion())N.motion.flash(svg,x,y,'result',18);
 });
 if(opt.showEvidence&&!challenge){
  let a=diffs(values),b=diffs(a),Y=sm?555:538;
  mathText(svg,W/2,Y,'FIRST DIFFERENCES: '+a.map(v=>(v>0?'+':'')+v).join('  ·  '),sm?17:20,'focus');
  if(p.kind==='quadratic')mathText(svg,W/2,Y+36,'SECOND DIFFERENCES: '+b.map(v=>(v>0?'+':'')+v).join('  ·  '),sm?16:20,'result');
  else mathText(svg,W/2,Y+36,'A constant difference gives a straight pattern',sm?16:20,'support');
 }else if(!challenge){mathText(svg,W/2,sm?565:551,opt.bottomText||'Each plotted point is (position, term)',sm?17:19,'support');}
 return {P,values,xs,ys,origin};
}
function renderLearning(index,stage){active=index;const s=steps[index],p=preset(s.preset);reset(stage);emit('preset',s.preset);
 const scene=svgRoot('Sequence values plotted as neon points on a coordinate graph.');
 let subtitle=['Start at the first position','Now compare the second term','Notice the equal vertical changes','Reveal the straight-line guide','The terms decrease each time','The changes themselves grow'][index];
 plotScene(scene,p,{title:p.label,subtitle,visible:s.visible,trend:s.trend,newIndex:s.visible-1,showEvidence:index>=2&&index!==4,bottomText:index===0?'Term one is at (1, 3)':index===1?'The second term is at (2, 5)':'Each dot is one integer term'});
 let side=[card('RULE',index<3?'Spot the pattern':p.formula,index>=3),card('POINTS PLOTTED',String(s.visible))];
 side.push(note('WHAT TO NOTICE',index===0?'Horizontal position one pairs with vertical term three.':index<3?'The vertical rise is two for each one-step movement to the right.':index===3?'The dashed line is only a visual trend. The actual sequence is the discrete dots.':index===4?'The points fall because each next term is two lower.':'Quadratic first differences grow by two, so the plotted pattern bends upward.'));
 wrap(stage,scene,side,s.pose,s.text);
}
function renderExplore(stage){reset(stage);const p=preset(chosen),svg=svgRoot(p.label+' plotted on core graph axes.');plotScene(svg,p,{title:p.label,subtitle:'Change preset or number of terms',visible:reveal,trend:showTrend,showEvidence:showTrend});
 wrap(stage,svg,[card('FORMULA',p.formula,true),card('FIFTH TERM',String(term(p,5))),note('GRAPH PATTERN',p.kind==='linear'?'A linear nth term has a constant first difference.':'A quadratic nth term has constant second differences.')],p.kind==='quadratic'?'idea':'point-right',p.kind==='quadratic'?'The curved pattern has growing gaps.':'Every sequence term has a position and a value.');
}
const tasks=[
 {key:'Y7-037-linear-nth-term',title:'01 · Plot a growing linear sequence',guide:'Plot the missing fourth and fifth terms of 3, 5, 7, 9, 11.',show:[3,5,7],missing:[4,5],choices:[[4,9],[4,8],[4,10],[5,11],[5,10],[5,12]],traps:{'4,8':'Position four needs the next +2 jump from seven: it is nine.','4,10':'Count one jump of two, not three, from seven.','5,10':'That does not keep the +2 difference.','5,12':'You have gone one too high: eleven follows nine.'}},
 {key:'Y8-019-arithmetic-sequences',title:'02 · Plot a falling linear sequence',guide:'Plot the missing terms for 12, 10, 8, 6, 4. The graph slopes down.',show:[12,10,8],missing:[4,5],choices:[[4,6],[4,4],[4,10],[5,4],[5,6],[5,2]],traps:{'4,4':'Four is the FIFTH term, not the fourth.','4,10':'The terms fall by two; do not go back to term two.','5,6':'Six belongs at position four.','5,2':'Subtract two only once more after term four.'}},
 {key:'Y8-021-quadratic-pattern-spotting',title:'03 · Plot a quadratic sequence',guide:'Plot the missing values of 2, 5, 10, 17, 26. The gaps grow.',show:[2,5,10],missing:[4,5],choices:[[4,17],[4,15],[4,16],[5,26],[5,22],[5,25]],traps:{'4,15':'The difference is not always five. Here the next gap is seven.','4,16':'n² alone misses the extra one.','5,22':'This misses the growing differences. Try the fifth-square value plus one.','5,25':'You have worked out n² but missed the +1 adjustment.'}}
];
let testSelected=null;
function task(){return tasks[challengeTask];}
function trap(slot,choice){const t=task(),key=choice.join(',');if(choice[0]!==Number(slot.split('-')[1]))return 'Check the horizontal coordinate. This card belongs to a different position.';return t.traps[key]||'That is not the correct term. Follow the same sequence rule from the earlier points.';}
function pickCard(label){keyboardPick=label;const s=challengePanel&&challengePanel.querySelector('.f904-status');if(s)s.textContent='Selected ('+label[0]+', '+label[1]+'). Now press Enter on its graph position.';}
function place(slot,choice){const t=task();if(!slot||!choice)return false;const n=Number(slot.split('-')[1]),p=preset(t.key),needed=term(p,n),correct=n===choice[0]&&choice[1]===needed;
 if(!correct){challengeApi.check(false,trap(slot,choice),{task:challengeTask,slot,choice});return false;}
 placed[slot]=choice;keyboardPick=null;emit('placed',{slot,choice});drawChallenge();return true;
}
function clear(slot){delete placed[slot];emit('placed',{slot,choice:null});drawChallenge();}
function wireFastDrag(g){ // bridge when SVG group fails to retain pointer capture on fast mouse motion; shared drag stays authoritative
 g.addEventListener('pointerdown',ev=>{const a=N.ui._drag;if(!a||a.el!==g)return;const id=ev.pointerId;
 let ended=false;const finish=()=>{if(ended)return;ended=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
 function move(e){if(ended)return;if(N.ui._drag!==a){finish();return;}if(e.pointerId!==id||g.contains(e.target))return;if(a.el===g){const dragEvt=new PointerEvent('pointermove',{bubbles:true,pointerId:id,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons});g.dispatchEvent(dragEvt);}}
 function up(e){if(ended)return;if(e.pointerId!==id)return;if(N.ui._drag===a&&typeof a.up==='function')a.up(e);finish();}
 function cancel(){if(N.ui._drag===a)a.cancel();finish();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });
}
function drawChallenge(){if(!challengeStage)return;const t=task(),p=preset(t.key),sm=small(),W=wide();reset(challengeStage);
 const svg=svgRoot('Plot missing sequence points by dragging coordinate cards onto the graph.',true);
 const graph=plotScene(svg,p,{title:p.label,subtitle:'Drag two coordinates to their exact graph locations',visible:5,trend:false,hide:t.missing,challenge:true});
 const remY=sm?744:719;
 // zone over each target. Graph marker position is math-derived from core mapping.
 const zones={};t.missing.forEach(n=>{const x=graph.P.X(n),y=graph.P.Y(term(p,n));zones['point-'+n]={x:x-26,y:y-26,w:52,h:52,id:'point-'+n,kind:'drop'};
  const hit=svg.querySelector('[data-slot="point-'+n+'"]');
  hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(keyboardPick)place('point-'+n,keyboardPick);else if(challengePanel){let st=challengePanel.querySelector('.f904-status');if(st)st.textContent='Select a coordinate card first.';}}});
  hit.addEventListener('click',()=>{if(keyboardPick)place('point-'+n,keyboardPick);});
  if(placed['point-'+n]){hit.remove();const pg=E('g',{'data-placed':'point-'+n,tabindex:0,role:'button','aria-label':'Placed point ('+n+', '+term(p,n)+'). Press Delete to remove.'},svg);
    N.neonRing(pg,x,y,{role:'result',r:sm?13:16,pulse:false});mathText(pg,x,y-25,'('+n+', '+term(p,n)+')',sm?14:17,'result');
    pg.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();clear('point-'+n);}});
    N.ui.svgDrag(svg,pg,{box:{x:x-20,y:y-22,w:40,h:44},zones:()=>[{x:sm?22:181,y:remY,w:sm?386:400,h:54,id:'remove',kind:'remove'}],onRemove:()=>clear('point-'+n),onDrop:()=>false,removeTo:{x:W/2,y:remY+30}});wireFastDrag(pg);
  }
 });
 const paletteY=sm?554:540,chipW=sm?109:115,chipH=42,gap=sm?9:16,x0=sm?30:145;
 mathText(svg,W/2,paletteY-19,'COORDINATE CARDS — DRAG INTO PLACE',sm?15:19,'support');
 const remove={x:sm?20:180,y:remY,w:sm?390:400,h:50};
 N.neonBox(svg,remove.x,remove.y,remove.w,remove.h,{role:'error',text:'REMOVE / RESET',size:sm?16:18,r:13});
 t.choices.forEach((v,i)=>{const slot='point-'+v[0];if(placed[slot]&&placed[slot][0]===v[0]&&placed[slot][1]===v[1])return;
  const row=Math.floor(i/3),col=i%3, x=x0+col*(chipW+gap),y=paletteY+row*(chipH+18);
  const g=E('g',{'data-source':v.join(','),tabindex:0,role:'button','aria-label':'Coordinate '+v.join(', ')+'; press Enter to select'},svg);
  nbox(g,x,y,chipW,chipH,'('+v[0]+', '+v[1]+')','given',sm?17:21);
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pickCard(v);}});g.addEventListener('click',()=>pickCard(v));
  N.ui.svgDrag(svg,g,{box:{x,y,w:chipW,h:chipH},zones:()=>[...Object.values(zones),{...remove,id:'remove',kind:'remove'}],onDrop:target=>place(target,v),onRemove:()=>{keyboardPick=null;},removeTo:{x:W/2,y:remY+24}});wireFastDrag(g);
 });
 const known=t.show.join(', ');
 wrap(challengeStage,svg,[card('GIVEN TERMS',known),card('POINTS TO PLOT',Object.keys(placed).length+' / 2',true),note('REMEMBER',p.kind==='quadratic'?'First differences change. A straight trend is not a reliable rule here.':'Read right for position, up for term. Each card uses that exact ordered pair.')],p.kind==='quadratic'?'think':'point-right','Plot at integer positions only. Check both coordinates.');
}
const def={id,title:'Sequence on a graph',config:C,
 alt:'A coordinate graph showing discrete sequence terms. Horizontal axis is position n; vertical axis is the term value.',
 staticAlt:'Linear sequence plots form a straight pattern. Quadratic sequence plots curve; the domain remains integer positions.',
 steps:steps.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(index,stage){renderLearning(index,stage);},
 exploreIntro:'Compare a rising linear sequence, a falling linear sequence and two quadratic sequences on the same axes system.',
 explore(panel,stage,api){chosen='Y7-037-linear-nth-term';reveal=5;showTrend=true;
  const bar=H('div',{class:'f904-control'}),chooser=H('div',{class:'f904-choices'});
  Object.entries(C.presets).forEach(([key,p])=>chooser.appendChild(btn(p.label,()=>{chosen=key;emit('preset',key);renderExplore(stage);},'nova-btn ghost')));
  const slide=H('input',{type:'range',min:2,max:5,step:1,value:5,'aria-label':'How many terms are plotted'}),output=H('output',{text:'5 points'});
  slide.addEventListener('input',()=>{reveal=Number(slide.value);output.textContent=reveal+' points';emit('position',reveal);renderExplore(stage);});
  const toggle=H('input',{type:'checkbox',checked:true,'aria-label':'Show trend guide'});toggle.addEventListener('change',()=>{showTrend=toggle.checked;renderExplore(stage);});
  panel.append(H('p',{class:'f904-instruction',text:'Select one of the four lesson presets, reveal points, or hide the dashed trend guide.'}),chooser,bar);
  bar.append(H('label',{},['Terms ',slide]),output,H('label',{},[toggle,' Show dashed guide']));renderExplore(stage);
 },
 challenge(panel,api,stage){challengeTask=0;placed={};keyboardPick=null;challengeStage=stage;challengePanel=panel;challengeApi=api;challengeDone=false;
  const header=H('h3',{class:'f904-taskhead'}),guide=H('p',{class:'f904-instruction'}),controls=H('div',{class:'f904-control'}),status=H('p',{class:'f904-status',role:'status'});
  function load(){const t=task();header.textContent=t.title;guide.textContent=t.guide;controls.replaceChildren();status.textContent='Keyboard: Enter on a coordinate card, then Enter on its graph location. Delete removes a placed point.';
   api.fb.textContent='';api.fb.className='nova-fb';
   controls.append(btn('Check the two points',()=>{let missing=t.missing.filter(n=>!placed['point-'+n]);
    if(missing.length){api.check(false,'Both missing terms must be plotted. Check positions '+missing.join(' and ')+'.',{task:challengeTask});return;}
    api.check(true,challengeTask===2?'Correct! The quadratic points follow growing first differences.':'Correct! Both points follow the sequence rule.',{task:challengeTask,score:challengeTask+1});
    N.moment&&N.moment(document.getElementById(id),'correct',{ms:900});
    if(challengeTask===2){header.textContent='All three graph challenges complete';guide.textContent='You have plotted linear rise, linear fall and quadratic growth.';controls.replaceChildren(H('strong',{class:'f904-maths f904-maths--gold',text:'3 / 3 · Graphs secured'}));challengeDone=true;return;}
    controls.append(btn('Continue to challenge '+(challengeTask+2),()=>{challengeTask++;placed={};keyboardPick=null;emit('challengeTask',challengeTask);load();},'nova-btn primary'));
   },'nova-btn primary'),btn('Reset points',()=>{placed={};keyboardPick=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint(challengeTask===2?'Use the first three terms: differences are +3 and +5, so the next are +7 and +9.':'Move one place right, then apply the same change to the term value.'),'nova-btn ghost'));
   drawChallenge();emit('challengeTask',challengeTask);
  }
  panel.append(header,guide,controls,status);load();
 },
 onRestore(){active=0;chosen='Y7-037-linear-nth-term';reveal=5;showTrend=true;challengeTask=0;placed={};keyboardPick=null;challengeStage=null;challengePanel=null;challengeApi=null;}
};
N.registry.add({id,title:'Sequence on a graph',topics:['sequences','graphs','nth term','arithmetic sequences','quadratic sequences'],deps:['F0-02','F0-07','F0-14']});
N.bankMount({id,num:'04',title:'Sequence on a graph · Premium Edition',def,linked:['F9-03','F9-05','F9-08','F9-09'],years:'Year 7–9 linear and quadratic sequence graphs',spec:{
 purpose:'Plot discrete sequence terms as ordered pairs (position, value); connect first differences to straight patterns and second differences to quadratic curves.',
 params:'Position n=1–5; 4 named presets; integer graph locations; compare first and second differences; selectable guide.',
 presets:'Y7-037 (2n+1), Y8-019 (14−2n), Y8-021 (n²+1), Y9-008 (n²−n+2).',
 steps:'Axis meaning → first points → differences → straight trend → decreasing trend → quadratic pattern.',
 interactions:'Watch, Guided, Explore presets and point slider, Challenge drag/keyboard plot 2 missing points per task with remove and reset.',
 traps:'Reversing position and term, wrong difference sign, treating quadratic growth as linear, missing +1 in n²+1.',
 gcse:'Prepares discrete nth-term graphs and comparisons of linear/quadratic growth; linked to F9-03, F9-05, F9-09.'}});
window.F904_ENGINE=N.engines[id];
const cardEl=document.getElementById(id),spec=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...cardEl.querySelectorAll('details.nova-spec, p.purpose')].forEach(el=>spec.appendChild(el));cardEl.appendChild(spec);
const gc=cardEl.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const patchAlt=()=>cardEl.querySelectorAll('.face img').forEach(el=>{if(!el.getAttribute('alt'))el.setAttribute('alt','Sir Bob Maximus, maths tutor');});patchAlt();new MutationObserver(patchAlt).observe(cardEl,{childList:true,subtree:true});
})();
