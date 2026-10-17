/* F17-10 · Complement and AND/OR · single-file component using canonical embedded NOVA core */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const presets={
 y7complement:{label:'Y7-073 · Complements',a:'Rain',b:'Wind',context:'20 weather days · A rain · B wind',counts:[4,3,5,8],focus:'notA'},
 y7table:{label:'Y7-077 · Two-way tables',a:'Bus',b:'Late',context:'40 journeys · A bus · B late',counts:[12,10,8,10],focus:'or'},
 y8frequency:{label:'Y8-068 · Frequency trees',a:'Hot',b:'Vegetarian',context:'60 lunches · A hot · B vegetarian',counts:[18,12,10,20],focus:'notA'},
 y8sample:{label:'Y8-070 · Combined events',a:'Even',b:'Greater 3',context:'12 equally likely outcomes · A even · B greater than 3',counts:[4,2,3,3],focus:'and'},
 y8independent:{label:'Y8-071 · Independent events',a:'Red',b:'Head',context:'25 equally likely paired trials · A red · B heads',counts:[9,6,4,6],focus:'and'},
 y8venn:{label:'Y8-072 · Set notation',a:'Even',b:'Multiple 3',context:'16 set outcomes · A even · B multiple of 3',counts:[4,2,6,4],focus:'or'},
 y9sets:{label:'Y9-044 · Union / intersection',a:'Prime',b:'Even',context:'20 outcomes · A prime · B even',counts:[5,3,7,5],focus:'or'},
 y9independent:{label:'Y9-045 · Independent events',a:'Red',b:'Heads',context:'100 equally likely pairs · A red · B heads',counts:[18,12,28,42],focus:'and'}
};
const operators={
 and:{name:'A AND B',mark:['both'],reason:'Only the overlap satisfies BOTH properties.'},
 or:{name:'A OR B',mark:['a','both','b'],reason:'OR includes A only, the overlap and B only. Count the overlap once.'},
 notA:{name:'NOT A',mark:['b','none'],reason:'NOT A includes everything outside A, including B only and neither.'},
 notB:{name:'NOT B',mark:['a','none'],reason:'NOT B includes everything outside B.'},
 neither:{name:'NEITHER',mark:['none'],reason:'Neither means NOT A AND NOT B: outside both circles.'},
 a:{name:'A',mark:['a','both'],reason:'A includes its own crescent AND the overlap.'},
 b:{name:'B',mark:['both','b'],reason:'B includes its own crescent AND the overlap.'},
 xor:{name:'A OR B, NOT BOTH',mark:['a','b'],reason:'Exactly one event: the two crescents, excluding the intersection.'},
 notAorB:{name:'NOT A OR B',mark:['both','b','none'],reason:'NOT A OR B leaves out only A-only.'}
};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_10_CONFIG={preset:'y8venn',startMode:'watch',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','operator','region','marked','favourable','probability','complete','reset','independent'],presets,operators});
const mobile=()=>innerWidth<=500,clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),REGIONS=['a','both','b','none'];
const sum=a=>a.reduce((s,x)=>s+x,0),gcd=(a,b)=>b?gcd(b,a%b):a,fr=(a,b)=>{let g=gcd(a,b)||1;return [a/g,b/g];};
const evaluate=(p,op)=>{let regionCounts=Object.fromEntries(REGIONS.map((r,i)=>[r,p.counts[i]])),selected=operators[op].mark,good=selected.reduce((s,r)=>s+regionCounts[r],0),total=sum(p.counts),both=p.counts[1],pA=(p.counts[0]+both)/total,pB=(both+p.counts[2])/total;return {regionCounts,good,total,prob:fr(good,total),independent:Math.abs(both/total-pA*pB)<1e-10,pA,pB,both};};
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('Unknown event key '+key);NOVA.events.emit('value',{engine:'F17-10',key,value});};
const chalk=(p,x,y,text,role='op',size=20,anchor='middle')=>NOVA.chalkText(p,x,y,String(text),{role,size,anchor});
const frac=(p,x,y,nums,role='result',sz=23)=>{chalk(p,x,y-9,nums[0],role,sz);NOVA.neonLine(p,x-sz*.8,y,x+sz*.8,y,{role,width:3.5});chalk(p,x,y+sz+8,nums[1],role,sz);};
const fracDOM=a=>{let v=h('span',{class:'f1710-frac','aria-label':a[0]+' over '+a[1]});v.append(h('b',{text:String(a[0])}),h('i',{'aria-hidden':'true'}),h('b',{text:String(a[1])}));return v;};
const stat=(name,val,role='focus',fraction=false)=>{let c=h('div',{class:'f1710-stat','data-role':role});c.append(h('span',{class:'lab',text:name}),fraction?fracDOM(val):h('span',{class:'val',text:String(val)}));return c;};
const newState=(p)=>({op:p.focus,assigned:new Map(),selected:0,checked:false,reveal:false});
const correct=(m,op)=>{let expected=new Set(operators[op].mark),marked=new Set(m.assigned.values());return expected.size===marked.size&&[...expected].every(r=>marked.has(r));};
const L=()=>mobile()?{W:430,H:986,U:{x:16,y:145,w:398,h:445},cxA:162,cxB:268,cy:367,r:125,zoneY:658,zoneXs:[58,162,266,370],zoneW:96,zoneH:95,tokenXs:[62,162,268,368],trayY:836,remove:{x:259,y:910,w:148,h:57},tray:{x:21,y:910,w:205,h:57}}:{W:900,H:968,U:{x:24,y:136,w:852,h:470},cxA:357,cxB:543,cy:375,r:172,zoneY:669,zoneXs:[132,342,558,767],zoneW:186,zoneH:93,tokenXs:[138,342,558,762],trayY:844,remove:{x:660,y:902,w:190,h:58},tray:{x:45,y:902,w:224,h:58}};
const circle=(x,y,r)=>`M ${x-r},${y} A ${r},${r} 0 1,0 ${x+r},${y} A ${r},${r} 0 1,0 ${x-r},${y} Z`;
const lens=(l)=>{let x=(l.cxA+l.cxB)/2,dx=(l.cxB-l.cxA)/2,dy=Math.sqrt(l.r*l.r-dx*dx);return `M ${x},${l.cy-dy} A ${l.r},${l.r} 0 0,1 ${x},${l.cy+dy} A ${l.r},${l.r} 0 0,1 ${x},${l.cy-dy} Z`;};
function picture(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("picture",arguments);}

 stage.replaceChildren();let l=L(),sm=mobile(),current=evaluate(p,m.op),assigned=new Set(m.assigned.values()),selected=o.model?new Set(operators[m.op].mark):assigned,reveal=o.reveal||m.reveal;
 NOVA.cap(stage,o.title||'Set logic · complement, AND and OR',o.tag||'EVENT OPERATORS · EXACT PROBABILITY');
 let svg=S.root(l.W,l.H,'Neon Venn event-logic engine. Four regions represent A only, both A and B, B only and neither. Drag selection tokens into the four region targets.');svg.classList.add('f1710-plot');svg.setAttribute('data-engine-plot','F17-10');
 chalk(svg,l.W/2,37,p.context,'focus',sm?18:23);
 chalk(svg,l.W/2,83,o.challenge?'Analyse the regions. Calculate the event probability.':operators[m.op].name,'result',sm?28:35);
 chalk(svg,l.W/2,113,o.challenge?'All four region counts are shown below.':'Select exactly the regions that satisfy the event.','given',sm?17:22);
 NOVA.neonBox(svg,l.U.x,l.U.y,l.U.w,l.U.h,{role:'given',r:26});
 // The canonical neonPath renders glass-filled circles and the overlap lens.
 NOVA.neonPath(svg,circle(l.cxA,l.cy,l.r),{role:'focus',fill:true,width:5});
 NOVA.neonPath(svg,circle(l.cxB,l.cy,l.r),{role:'op',fill:true,width:5});
 NOVA.neonPath(svg,lens(l),{role:'purple',fill:true,width:4});
 // Selected regions are marked with bright neon rings; no custom SVG path / filters.
 const marks={a:[l.cxA-(sm?58:84),l.cy+11],both:[l.W/2,l.cy+13],b:[l.cxB+(sm?59:84),l.cy+12],none:[l.W/2,l.U.y+l.U.h-34]};
 for(let r of REGIONS){if(selected.has(r)){let [x,y]=marks[r];NOVA.neonRing(svg,x,y,{role:'result',r:sm?18:24,width:5});}}
 chalk(svg,l.cxA-(sm?54:85),l.cy-l.r+39,'A','focus',sm?27:34);
 chalk(svg,l.cxB+(sm?54:85),l.cy-l.r+39,'B','op',sm?27:34);
 chalk(svg,l.U.x+19,l.U.y+32,'U','given',sm?22:28,'start');
 let names=['A ONLY','A AND B','B ONLY','NEITHER'];
 let zones=[];
 for(let i=0;i<4;i++){
   const r=REGIONS[i],x=l.zoneXs[i],y=l.zoneY,w=l.zoneW,z={id:r,kind:'drop',x:x-w/2,y:y-8,w,h:l.zoneH};zones.push(z);
   NOVA.neonBox(svg,z.x,z.y,z.w,z.h,{role:selected.has(r)?'result':i===1?'purple':i%2?'op':'focus',r:17});
   chalk(svg,x,y+22,names[i],selected.has(r)?'result':'given',sm?15.5:22);
   if(!o.hideCounts)chalk(svg,x,y+67,p.counts[i],'focus',sm?26:30);
   if(selected.has(r))NOVA.neonRing(svg,x,y+67,{role:'result',r:sm?26:30,width:2.5});
 }
 chalk(svg,l.W/2,630,'FOUR DISJOINT REGIONS · NO DOUBLE COUNTING','given',sm?16:21);
 zones.push({...l.remove,id:'remove',kind:'remove'});
 if(o.interact){
  for(let i=0;i<4;i++){
   let target=m.assigned.get(i),where=target?{x:l.zoneXs[REGIONS.indexOf(target)],y:l.zoneY+67}:{x:l.tokenXs[i],y:l.trayY};let w=sm?62:100,hh=sm?53:64;
   let g=E('g',{'data-event-chip':String(i),role:'button',tabindex:m.selected===i?0:-1,'aria-label':'Selection token '+(i+1)+(target?', marking '+target:', in tray')},svg);
   NOVA.neonBox(g,where.x-w/2,where.y-hh/2,w,hh,{role:target?'result':'op',r:14});chalk(g,where.x,where.y+9,target?'✓':'MARK',target?'result':'focus',sm?24:25);
   NOVA.ui.svgDrag(svg,g,{box:{x:where.x-w/2,y:where.y-hh/2,w,h:hh},zones:()=>zones,removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+l.remove.h/2},onDrop:id=>{
      if(!REGIONS.includes(id))return false;
      for(let [k,v] of m.assigned)if(k!==i&&v===id)m.assigned.delete(k);
      m.assigned.set(i,id);m.selected=i;m.checked=false;emit('region',id);o.changed();return true;
    },onRemove:()=>{m.assigned.delete(i);m.checked=false;emit('region','tray');o.changed();}});
   g.addEventListener('keydown',ev=>{if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();m.assigned.delete(i);o.changed();return;}let d={ArrowRight:1,ArrowLeft:-1,ArrowDown:2,ArrowUp:-2}[ev.key];if(d){ev.preventDefault();let next=clamp(i+d,0,3);m.selected=next;g.tabIndex=-1;let n=svg.querySelector('[data-event-chip="'+next+'"]');if(n){n.tabIndex=0;n.focus();}}});
  }
  NOVA.neonBox(svg,l.tray.x,l.tray.y,l.tray.w,l.tray.h,{role:'focus',r:16,text:'EVENT MARKERS',size:sm?19:23});
  NOVA.neonBox(svg,l.remove.x,l.remove.y,l.remove.w,l.remove.h,{role:'error',r:16,text:'REMOVE',size:sm?19:23});
 }else{
  NOVA.neonBox(svg,l.tray.x,l.tray.y,l.tray.w,l.tray.h,{role:'focus',r:16,text:'SET OPERATORS',size:sm?19:23});
  NOVA.neonBox(svg,l.remove.x,l.remove.y,l.remove.w,l.remove.h,{role:'result',r:16,text:'CHECK ALL REGIONS',size:sm?16:22});
  if(o.model)chalk(svg,l.W/2,817,'MARKED REGIONS GLOW GREEN','result',sm?20:23);
 }
 stage.append(svg);
 let stats=h('div',{class:'f1710-readouts'}),nr=assigned.size;let fav=[...assigned].reduce((s,r)=>s+current.regionCounts[r],0);
 stats.append(stat('TOTAL OUTCOMES',current.total,'given'),stat('FAVOURABLE',o.challenge?'?':o.interact?fav:o.model?current.good:0,'focus'),o.challenge?stat('EVENT PROBABILITY','?','result'):stat('P('+operators[m.op].name+')',o.interact?fr(fav,current.total):reveal||o.model?current.prob:['?','?'],'result',true));
 stage.append(stats);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Every outcome is in exactly one region. AND keeps the overlap; OR includes both crescents and the overlap; NOT means outside.');
 if(o.flash)M.flash(svg,l.W/2,l.cy,'result',98);
 return {svg,layout:l,counts:current,assigned:[...assigned],favourable:fav};
}
const steps=[
 {name:'Define the whole sample space',pose:'explain',narration:'Begin with all the possible outcomes. The outer universe rectangle contains every one of them.',prompt:'What is our denominator?'},
 {name:'Split into distinct regions',pose:'count',narration:'A only, both A and B, B only, and neither are four distinct regions. Every outcome belongs to one of the four.',prompt:'Do the four counts add to the universe total?'},
 {name:'Understand AND',pose:'compare',narration:'A AND B means both events happen. Use only the overlapping part of the diagram.',prompt:'Which part satisfies both conditions?'},
 {name:'Understand OR',pose:'point-down',narration:'A OR B includes A only, both together, and B only. The overlap must only be counted once.',prompt:'Why should we not double-count the overlap?'},
 {name:'Take a complement',pose:'think',narration:'NOT A means every outcome outside A. The complement of A includes B only and neither.',prompt:'Is the overlap part of NOT A?'},
 {name:'Compare exact probabilities',pose:'celebrate',narration:'Count the favourable outcomes in your selected regions. Divide by all possible outcomes. For independent events, the AND probability also equals the product of their separate probabilities.',prompt:'Can you justify both the numerator and the denominator?'}
];
function watch(i,stage){const idx=clamp(i,0,5),p=presets[CFG.preset],m=newState(p);m.op=['a','a','and','or','notA',p.focus][idx];m.reveal=idx===5;picture(stage,p,m,{title:steps[idx].name,tag:'STEP '+(idx+1)+'/6',model:idx>=2,hideCounts:idx===0,pose:steps[idx].pose,reveal:idx===5,flash:idx===5,say:[
 'We always count favourable outcomes from the same complete universe.',
 'No outcome can belong to two of these four disjoint regions.',
 'AND keeps just the overlap, not the whole of either circle.',
 'OR is inclusive in probability. It includes the overlap exactly once.',
 'The complement is everything outside the selected event.',
 'These region counts give the exact probability. Explain your chosen numerator.'
 ][idx]});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(presets[CFG.preset])):(presets[CFG.preset])),m=newState(p);
 window.NovaLessonComponent?.applyExploreModels();const sel=h('select',{class:'nova-input','aria-label':'Lesson preset'}),op=h('select',{class:'nova-input','aria-label':'Choose event operator'});window.NovaLessonComponent?.applyExploreModels();Object.entries(presets).forEach(([k,v])=>sel.append(h('option',{value:k,text:v.label})));window.NovaLessonComponent?.applyExploreModels();Object.entries(operators).forEach(([k,v])=>op.append(h('option',{value:k,text:v.name})));
 window.NovaLessonComponent?.applyExploreModels();const tok=h('select',{class:'nova-input','aria-label':'Choose event marker'}),dest=h('select',{class:'nova-input','aria-label':'Choose event region'});window.NovaLessonComponent?.applyExploreModels();for(let i=0;i<4;i++)tok.append(h('option',{value:String(i),text:'Marker '+(i+1)}));window.NovaLessonComponent?.applyExploreModels();REGIONS.forEach((r,i)=>dest.append(h('option',{value:r,text:['A only','Both A and B','B only','Neither'][i]})));
 window.NovaLessonComponent?.applyExploreModels();const status=h('p',{class:'f1710-status',role:'status','aria-live':'polite'}),B=(name,fn)=>h('button',{class:'nova-btn',text:name,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function redraw(){let c=evaluate(p,m.op),picked=new Set(m.assigned.values()),good=correct(m,m.op),fav=[...picked].reduce((s,r)=>s+c.regionCounts[r],0);picture(stage,p,m,{interact:true,title:'Build an event with region markers',tag:'COMPLEMENT · AND · OR',changed:redraw,pose:m.checked?good?'celebrate':'not-yet':'point-down',say:m.checked?good?'Yes! You have selected exactly the right regions. Now explain the numerator.':'Check each region against the event. AND, OR and NOT use different regions.':operators[m.op].reason});
 status.className='f1710-status'+(m.checked&&good?' good':'');status.textContent=m.checked?(good?`Correct region selection. ${fav} favourable outcomes from ${c.total}, so P = ${c.prob.join('/')}.`:`Not quite. ${operators[m.op].reason} Your selection has ${fav} of ${c.total} outcomes.`):`${picked.size} of 4 regions marked · ${fav} favourable outcomes from ${c.total}.`;
 emit('marked',picked.size);emit('favourable',fav);emit('probability',fav/c.total);
 }
 window.NovaLessonComponent?.applyExploreModels();function setPreset(id){NOVA.ui.cancelDrag();CFG.preset=id;p=presets[id];m=newState(p);sel.value=id;op.value=p.focus;emit('preset',id);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function place(i,r){i=Number(i);if(!Number.isInteger(i)||i<0||i>3||!REGIONS.includes(r))return false;for(let [k,v]of m.assigned)if(k!==i&&v===r)m.assigned.delete(k);m.assigned.set(i,r);m.checked=false;emit('region',r);redraw();return true;}
 window.NovaLessonComponent?.applyExploreModels();let controls=h('div',{class:'f1710-controls'},[h('label',{class:'f1710-label'},['Lesson ',sel]),h('label',{class:'f1710-label'},['Event ',op]),B('Check marked regions',()=>{m.checked=true;emit('complete',correct(m,m.op));redraw();if(correct(m,m.op))M.flash(stage.querySelector('svg.f1710-plot'),L().W/2,L().cy,'result',90);}),B('Show correct regions',()=>{m.assigned=new Map(operators[m.op].mark.map((r,i)=>[i,r]));m.checked=true;redraw();}),B('Clear markers',()=>{NOVA.ui.cancelDrag();m.assigned.clear();m.checked=false;emit('reset','clear');redraw();})]);
 window.NovaLessonComponent?.applyExploreModels();let alt=h('div',{class:'f1710-controls'},[h('label',{class:'f1710-label'},['Marker ',tok]),h('label',{class:'f1710-label'},['Into ',dest]),B('Place / move',()=>place(tok.value,dest.value)),B('Return to tray',()=>{m.assigned.delete(Number(tok.value));m.checked=false;redraw();})]);
 window.NovaLessonComponent?.applyExploreModels();let indep=h('p',{class:'f1710-explain','data-independent':'true'});window.NovaLessonComponent?.applyExploreModels();function setInd(){let e=evaluate(p,m.op);indep.textContent=`Model check: P(A) = ${fr(p.counts[0]+p.counts[1],e.total).join('/')} · P(B) = ${fr(p.counts[1]+p.counts[2],e.total).join('/')} · P(A AND B) = ${fr(p.counts[1],e.total).join('/')} · ${e.independent?'These events are independent: P(A AND B) = P(A) × P(B).':'These events are not independent: P(A AND B) differs from P(A) × P(B).'} `;emit('independent',e.independent);}
 window.NovaLessonComponent?.applyExploreModels();sel.addEventListener('change',()=>{setPreset(sel.value);setInd();});window.NovaLessonComponent?.applyExploreModels();op.addEventListener('change',()=>{m.op=op.value;m.assigned.clear();m.checked=false;emit('operator',m.op);redraw();});
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f1710-explain',text:'Drag MARK tiles onto the four disjoint region targets. A = left circle, B = right circle. The number in each region is its frequency, not a probability.'}),controls,alt,indep,status);
 window.NovaLessonComponent?.applyExploreModels();setPreset(CFG.preset);window.NovaLessonComponent?.applyExploreModels();setInd();window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,operator:m.op,assignments:Object.fromEntries(m.assigned),favourable:[...new Set(m.assigned.values())].reduce((s,r)=>s+evaluate(p,m.op).regionCounts[r],0),total:evaluate(p,m.op).total,correct:correct(m,m.op)}),setPreset:(id)=>{if(!presets[id])return false;setPreset(id);setInd();return true;},setOperator:id=>{if(!operators[id])return false;m.op=id;op.value=id;m.assigned.clear();redraw();return true;},place,remove:i=>{m.assigned.delete(+i);redraw();},reset:()=>{m.assigned.clear();redraw();},reveal:()=>{m.assigned=new Map(operators[m.op].mark.map((r,i)=>[i,r]));redraw();}};
}
function challenge(panel,api,stage){let cases=[
 {id:'y7complement',op:'notA',q:'Of 20 days, 7 had rain. What is the probability of NOT rain? Enter a fraction or decimal.',label:'P(NOT rain)',wrong:[[7/20,'That is P(rain), not its complement.'],[8/20,'Neither rain nor wind is only part of NOT rain. Include wind-only days.']]},
 {id:'y8sample',op:'and',q:'From 12 outcomes, 2 satisfy BOTH event A and event B. What is P(A AND B)?',label:'P(A AND B)',wrong:[[9/12,'That counts more than the overlap. AND means both properties.'],[4/12,'A only does not satisfy B. Use just the overlap.']]},
 {id:'y9sets',op:'or',q:'Among 20 outcomes, 5 are A only, 3 both, and 7 B only. Find P(A OR B).',label:'P(A OR B)',wrong:[[18/20,'The overlap was counted twice. Include each region once.'],[3/20,'That is AND, not OR. Include both crescents too.']]},
 {id:'y9independent',op:'and',q:'Independent events A and B have probabilities 3/10 and 2/5. Find P(A AND B).',label:'P(A AND B)',wrong:[[7/10,'You added the event probabilities. For independent AND, multiply them.'],[3/10,'This is only P(A), not both events.']]}
 ];
 const tasks=cases.map(c=>{let v=evaluate(presets[c.id],c.op).good/evaluate(presets[c.id],c.op).total;return {q:c.q,build:NOVA.entryTask(c.label,'F17-10'),check:x=>{let ok=Math.abs(x-v)<1e-6,bad=c.wrong.find(([n])=>Math.abs(x-n)<1e-6);return [ok,ok?'Correct. The favourable regions and denominator match the event.':bad?bad[1]:'Re-check AND (overlap), OR (union including overlap once), or NOT (the complement).'];},hint:operators[c.op].reason};});
 function draw(i){let c=cases[i],p=presets[c.id],m=newState(p);m.op=c.op;picture(stage,p,m,{title:'Challenge '+(i+1)+' · '+operators[c.op].name,tag:'QUESTION '+(i+1)+'/4',challenge:true,hideCounts:false,pose:'think',say:'Use the four region frequencies. The probability answer stays hidden until you submit.'});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 let off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-10')return;let dock=stage.querySelector('.nv-dock');if(dock)dock.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'Great reasoning. You chose the correct event regions.':'Check the words AND, OR and NOT before you count.');if(e.detail.correct){let svg=stage.querySelector('svg.f1710-plot');if(svg)M.flash(svg,L().W/2,L().cy,'result',96);}});api.onCleanup(off);
}
const DEF={id:'F17-10',title:'Complement and AND/OR',config:CFG,steps,render:watch,alt:'Interactive neon Venn diagram with four frequency regions, Boolean event operators, draggable selection tokens and exact probability.',staticAlt:'The four regions of two sets are A only, both A and B, B only, and neither. AND means overlap, OR means union, NOT means complement.',exploreIntro:'Choose an event operator, drag MARK chips onto the satisfying disjoint regions, check your choice and compare exact probabilities.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-10',DEF,{models:{},tables:{"presets":()=>presets,"REGIONS":()=>REGIONS,"steps":()=>steps},draws:{"picture":["stage","p","m","o"]},exploreFields:{"p":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:'F17-10',num:'F17·10',title:'Complement and AND/OR',def:DEF,years:'KS3 Years 7–9; GCSE independent and complementary events.',linked:['F0-02','F0-04','F17-01','F17-05','F17-07','F17-08','F17-09'],spec:{purpose:'Represent complements, unions, intersections and independence using disjoint Venn regions and exact probabilities.',params:'Four non-negative region frequencies; 9 named event operators; 8 lesson presets; draggable selection tokens.',presets:'Y7-073, Y7-077, Y8-068, Y8-070, Y8-071, Y8-072, Y9-044, Y9-045.',steps:'Universe → distinct regions → AND → OR → NOT → compare probabilities.',interactions:'Canonical NOVA neonPath/neonRing, svgDrag with green snap targets, red removal, keyboard-equivalent placement and exact region calculation.',traps:'OR excludes overlap; OR double-counts overlap; AND counts entire circles; NOT means neither; independent means mutually exclusive.',gcse:'Independent events satisfy P(A AND B) = P(A) × P(B); complements P(not A) = 1 − P(A).'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4800);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
