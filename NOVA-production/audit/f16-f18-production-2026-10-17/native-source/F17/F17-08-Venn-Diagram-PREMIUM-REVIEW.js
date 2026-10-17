/* NOVA MATHS V2 · F17-08 VENN DIAGRAM — local engine only, original NOVA core inherited intact. */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const sets={
 survey:{label:'Y8-067 · Sports survey',year:8,universe:Array.from({length:12},(_,i)=>i+1),A:[1,3,4,5,7],B:[2,3,5,6,8,11],a:'Football',b:'Basketball',context:'12 pupils surveyed · A football · B basketball',focus:'union'},
 notation:{label:'Y8-072 · Even and multiples of 3',year:8,universe:Array.from({length:12},(_,i)=>i+1),A:[2,4,6,8,10,12],B:[3,6,9,12],a:'Even',b:'×3',context:'Numbers 1 to 12 · A even · B multiples of three',focus:'intersection'},
 prime:{label:'Y9-044 · Prime and even',year:9,universe:Array.from({length:12},(_,i)=>i+1),A:[2,3,5,7,11],B:[2,4,6,8,10,12],a:'Prime',b:'Even',context:'Numbers 1 to 12 · A prime · B even',focus:'union'}
};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_08_CONFIG={preset:'survey',startMode:'watch',events:['value','correct','step','hintUsed','mode'],valueKeys:['preset','outcome','region','placedCount','correctCount','eventProbability','focusRegion','complete','reset'],presets:sets});
const mobile=()=>innerWidth<=500,clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const region=(p,id)=>{let a=p.A.includes(id),b=p.B.includes(id);return a&&b?'both':a?'a':b?'b':'none';};
const members=(p,r)=>p.universe.filter(v=>region(p,v)===r);
const relevant=(p,q)=>p.universe.filter(v=>q==='intersection'?region(p,v)==='both':q==='union'?region(p,v)!=='none':q==='complement'?region(p,v)==='none':q==='a-only'?region(p,v)==='a':q==='b-only'?region(p,v)==='b':q==='a'?p.A.includes(v):p.B.includes(v));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const rational=(a,b)=>{const g=gcd(a,b)||1;return [a/g,b/g]};
const fmt=ar=>ar.join(' over ');
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('Unregistered F17-08 value key: '+key);NOVA.events.emit('value',{engine:'F17-08',key,value});};
const empty=()=>({placed:new Map(),focus:'union',selected:1,checked:false,revealed:false});
function calc(p,m,q){let placed=m.placed.size,ok=[...m.placed].filter(([n,r])=>r===region(p,n)).length,k=members(p,'both').length;return {total:p.universe.length,placed,correct:ok,allCorrect:ok===p.universe.length&&placed===p.universe.length,regionCounts:{a:members(p,'a').length,b:members(p,'b').length,both:k,none:members(p,'none').length},prob:rational(relevant(p,q).length,p.universe.length),markedEvent:[...m.placed].filter(([n,r])=>q==='union'?r!=='none':q==='intersection'?r==='both':q==='complement'?r==='none':q==='a-only'?r==='a':q==='b-only'?r==='b':q==='a'?(r==='a'||r==='both'):(r==='b'||r==='both')).length};}
const chalk=(g,x,y,word,role='op',size=20,anchor='middle')=>NOVA.chalkText(g,x,y,String(word),{role,size,anchor});
function fracSvg(parent,x,y,pr,role='op',sz=19){chalk(parent,x,y-9,pr[0],role,sz);NOVA.neonLine(parent,x-sz*.7,y+2,x+sz*.7,y+2,{role,width:3});chalk(parent,x,y+sz+9,pr[1],role,sz);}
function fracHTML(ar){let e=h('span',{class:'f178-frac','aria-label':fmt(ar)});e.append(h('b',{text:String(ar[0])}),h('i',{'aria-hidden':'true'}),h('b',{text:String(ar[1])}));return e;}
function metric(name,value,role='given',isfrac=false){let e=h('div',{class:'f178-card','data-role':role});e.append(h('span',{class:'lab',text:name}),isfrac?fracHTML(value):h('span',{class:'val',text:String(value)}));return e;}
const regions={a:'A only',both:'A and B',b:'B only',none:'Neither A nor B'};
function layout(){let sm=mobile();return sm?{W:420,H:927,U:{x:17,y:118,w:386,h:458},cxA:153,cxB:267,cy:336,r:122,top:625,trayX:42,trayStep:57,remove:{x:242,y:819,w:144,h:56},clear:{x:32,y:819,w:174,h:56},slotW:38,slotH:36,slots:{a:[[92,285],[135,285],[92,330],[135,330],[92,375],[135,375]],both:[[190,285],[230,285],[190,330],[230,330],[190,375],[230,375]],b:[[285,285],[328,285],[285,330],[328,330],[285,375],[328,375]],none:[[77,511],[129,511],[181,511],[233,511],[285,511],[337,511]]}}:{W:860,H:965,U:{x:30,y:115,w:800,h:470},cxA:332,cxB:528,cy:345,r:174,top:650,trayX:111,trayStep:125,remove:{x:598,y:835,w:188,h:58},clear:{x:69,y:835,w:188,h:58},slotW:56,slotH:45,slots:{a:[[218,297],[286,297],[218,350],[286,350],[218,403],[286,403]],both:[[403,297],[457,297],[403,350],[457,350],[403,403],[457,403]],b:[[574,297],[642,297],[574,350],[642,350],[574,403],[642,403]],none:[[145,543],[248,543],[351,543],[454,543],[557,543],[660,543]]}};}
function circPath(cx,cy,r){return `M ${cx-r},${cy} A ${r},${r} 0 1,0 ${cx+r},${cy} A ${r},${r} 0 1,0 ${cx-r},${cy} Z`}
function lensPath(L){let mid=(L.cxA+L.cxB)/2,off=(L.cxB-L.cxA)/2,r=L.r,hh=Math.sqrt(r*r-off*off),top=L.cy-hh,bot=L.cy+hh;return `M ${mid},${top} A ${r},${r} 0 0,1 ${mid},${bot} A ${r},${r} 0 0,1 ${mid},${top} Z`}
function validZone(L){return [
 {id:'a',kind:'drop',x:L.cxA-L.r+20,y:L.cy-105,w:mobile()?114:170,h:220},
 {id:'both',kind:'drop',x:mobile()?180:388,y:L.cy-110,w:mobile()?61:84,h:220},
 {id:'b',kind:'drop',x:mobile()?266:565,y:L.cy-105,w:mobile()?110:176,h:220},
 {id:'none',kind:'drop',x:L.U.x+14,y:L.cy+L.r+16,w:L.U.w-28,h:mobile()?80:58},
 {...L.remove,id:'remove',kind:'remove'}];}
function position(L,r,i){const v=L.slots[r],p=v[i%v.length];return {x:p[0],y:p[1]};}
function eventName(q){return {'union':'A ∪ B','intersection':'A ∩ B','complement':'(A ∪ B)′','a-only':'A only','b-only':'B only','a':'A','b':'B'}[q];}
function render(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("render",arguments);}

 stage.replaceChildren();const L=layout(),sm=mobile(),q=o.focus||m.focus,c=calc(p,m,q);NOVA.cap(stage,o.title||'Venn diagrams · sort outcomes into sets',o.tag||'TWO SETS · FOUR REGIONS');
 let svg=S.root(L.W,L.H,'A premium two-circle Venn diagram inside a universe rectangle. Sort outcomes into A only, A and B, B only, or neither.');svg.classList.add('f178-plot');svg.setAttribute('data-engine-plot','F17-08');
 chalk(svg,L.W/2,46,p.context,'focus',sm?17:22);
 chalk(svg,L.W/2,86,o.challenge?'Use the sets. Find the correct region.':'The outer rectangle is the whole universe U.','given',sm?17:19);
 NOVA.neonBox(svg,L.U.x,L.U.y,L.U.w,L.U.h,{role:'given',r:24});
 // Luminous glass circles and lens drawn with canonical core neonPath and neonRing paths.
 NOVA.neonPath(svg,circPath(L.cxA,L.cy,L.r),{role:'focus',fill:true,width:5});
 NOVA.neonPath(svg,circPath(L.cxB,L.cy,L.r),{role:'op',fill:true,width:5});
 NOVA.neonPath(svg,lensPath(L),{role:q==='intersection'?'result':'purple',fill:true,width:3.2});
 chalk(svg,L.cxA-sm*2-(sm?36:68),L.cy-L.r+41,'A',q==='a'||q==='union'?'result':'focus',sm?24:31);
 chalk(svg,L.cxB+(sm?35:68),L.cy-L.r+41,'B',q==='b'||q==='union'?'result':'op',sm?24:31);
 chalk(svg,L.W/2,L.cy-L.r-10,'SET REGIONS','given',sm?17:21);
 chalk(svg,L.U.x+20,L.U.y+30,'U','given',sm?19:24,'start');
 chalk(svg,L.W/2,L.U.y+L.U.h+30,'NEITHER · OUTSIDE BOTH CIRCLES','given',sm?14:18);
 const ordered=[...p.universe].sort((a,b)=>a-b),allocated={a:0,b:0,both:0,none:0},pending=[];
 for(let n of ordered){let r=m.placed.get(n);if(!r)pending.push(n);}
 const zones=validZone(L),itemG=[];
 for(let n of ordered){let rr=m.placed.get(n),z;if(rr){z=position(L,rr,allocated[rr]++);}else{const idx=pending.indexOf(n),cols=6;z={x:L.trayX+(idx%cols)*L.trayStep,y:L.top+45+Math.floor(idx/cols)*(sm?51:57)};}
  const sw=L.slotW,sh=L.slotH,good=rr===region(p,n),stroke=rr?'op':'given';
  let g=E('g',{'data-venn-item':String(n),role:'button',tabindex:o.interact&&m.selected===n?0:-1,'aria-label':'Outcome '+n+', '+(rr?regions[rr]:'unsorted')+(rr?(good?', correct region':', check its set membership'):'')},svg);
  NOVA.neonBox(g,z.x-sw/2,z.y-sh/2,sw,sh,{role:rr?(o.checked?(good?'result':'error'):'focus'):'op',r:10});
  chalk(g,z.x,z.y+(sm?7:8),n,rr?'op':'focus',sm?23:25);
  if(o.interact){
    const box={x:z.x-sw/2,y:z.y-sh/2,w:sw,h:sh};
    NOVA.ui.svgDrag(svg,g,{box,zones:()=>zones,removeTo:{x:L.remove.x+L.remove.w/2,y:L.remove.y+L.remove.h/2},onDrop:id=>{if(!regions[id])return false;m.placed.set(n,id);m.selected=n;m.checked=false;emit('outcome',n);emit('region',id);o.changed();return true;},onRemove:()=>{m.placed.delete(n);m.checked=false;emit('outcome',n);emit('region','tray');o.changed();}});
    g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();m.placed.delete(n);o.changed();return;}let dx={ArrowRight:1,ArrowLeft:-1,ArrowDown:6,ArrowUp:-6}[e.key];if(dx){e.preventDefault();let kk=clamp(p.universe.indexOf(n)+dx,0,p.universe.length-1),nn=p.universe[kk];m.selected=nn;g.tabIndex=-1;let ng=svg.querySelector('[data-venn-item="'+nn+'"]');if(ng){ng.tabIndex=0;ng.focus();}}});
  }
  itemG.push(g);
 }
 if(o.interact){
  NOVA.neonBox(svg,L.clear.x,L.clear.y,L.clear.w,L.clear.h,{role:'focus',r:14,text:'UNSORTED TRAY',size:sm?17:21});
  NOVA.neonBox(svg,L.remove.x,L.remove.y,L.remove.w,L.remove.h,{role:'error',r:14,text:'REMOVE',size:sm?18:22});
 }else{
  NOVA.neonBox(svg,L.clear.x,L.clear.y,L.clear.w,L.clear.h,{role:'focus',r:14,text:o.challenge?'READ BOTH SETS':'SORT EACH ITEM',size:sm?17:21});
  NOVA.neonBox(svg,L.remove.x,L.remove.y,L.remove.w,L.remove.h,{role:'result',r:14,text:'CHECK THE SETS',size:sm?16:20});
 }
 chalk(svg,L.W/2,L.top-1,o.challenge?'UNIVERSE OUTCOMES':'OUTCOMES TO SORT', 'given',sm?16:19);
 if(!o.challenge&&!o.hideAnswer){chalk(svg,L.W/2, L.H-12,'P('+eventName(q)+')', 'focus',sm?20:23);fracSvg(svg,L.W/2+(sm?110:165),L.H-26,c.prob,'result',sm?19:23);}else{
  chalk(svg,L.W/2,L.H-17,'P('+eventName(q)+') = ?', 'focus',sm?22:25);
 }
 stage.append(svg);
 let reads=h('div',{class:'f178-readouts'});
 reads.append(metric('IN UNIVERSE',c.total,'given'),metric('SORTED',c.placed,'focus'),o.challenge?metric('EVENT PROBABILITY','?','result'):metric(m.checked?'RIGHT PLACE':'REGIONS READY',m.checked?c.correct:'4','result'));
 stage.append(reads);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Sort every outcome once. The overlap is in both A and B; outside belongs to neither set.');
 if(o.flash)M.flash(svg,L.W/2,L.cy,'result',95);
 return {svg,zones,layout:L,counts:c};
}
const steps=[
 {name:'Define the universe',pose:'explain',narration:'Begin with the universe: every outcome under discussion. Inside it, two overlapping circles represent sets A and B.',prompt:'Which outcomes belong in the rectangular universe?'},
 {name:'Sort set A only',pose:'point-down',narration:'An outcome in A but not in B belongs only in the left crescent. This is the region A only.',prompt:'Which outcomes belong only to A?'},
 {name:'Identify the overlap',pose:'compare',narration:'The shared lens is the intersection of sets A and B. Every outcome in the overlap belongs to both sets.',prompt:'Which outcomes satisfy both properties?'},
 {name:'Complete the four regions',pose:'count',narration:'Sort the B only and neither outcomes next. Every member of the universe must appear once in exactly one region.',prompt:'What remains outside both circles?'},
 {name:'Union and intersection',pose:'think',narration:'The union means A or B or both. The intersection means A and B. Do not count the overlap twice in a union.',prompt:'How are A union B and A intersection B different?'},
 {name:'Calculate exact probabilities',pose:'celebrate',narration:'Count favourable outcomes and divide by the total in the universe. The overlap counts once, not twice.',prompt:'Why does a union not add the overlap twice?'}
];
function renderStep(i,stage){let p=sets[CFG.preset],m=empty(),k=clamp(i,0,5);m.focus=k===2?'intersection':'union';const groupOrder=p.universe.slice().sort((a,b)=>{const order={a:0,both:1,b:2,none:3};return order[region(p,a)]-order[region(p,b)];});let n=[0,members(p,'a').length,members(p,'a').length+members(p,'both').length,p.universe.length,p.universe.length,p.universe.length][k];for(const id of groupOrder.slice(0,n))m.placed.set(id,region(p,id));m.checked=k===5;
 render(stage,p,m,{title:steps[k].name,tag:'STEP '+(k+1)+'/6',focus:m.focus,pose:steps[k].pose,flash:k===5,hideAnswer:k<5,say:[
 'Every outcome belongs somewhere in the universe. Start with the two property circles.',
 'A only means in A, but not in B. Keep these outcomes out of the overlap.',
 'The intersection is shared. Every outcome here satisfies both rules.',
 'Finish with B only and neither. No outcome appears twice.',
 'The union covers both circles. The overlap counts once, not twice.',
 'Count favourable outcomes over the full universe. Your regions now form a complete partition.'
 ][k]});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(sets[CFG.preset])):(sets[CFG.preset])),m=empty(),status=h('p',{class:'f178-status',role:'status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();const sel=h('select',{class:'nova-input','aria-label':'Lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(sets).forEach(([k,v])=>sel.append(h('option',{value:k,text:v.label})));
 window.NovaLessonComponent?.applyExploreModels();const vPick=h('select',{class:'nova-input','aria-label':'Select outcome'}),rPick=h('select',{class:'nova-input','aria-label':'Choose Venn region'});window.NovaLessonComponent?.applyExploreModels();Object.entries(regions).forEach(([k,v])=>rPick.append(h('option',{value:k,text:v})));
 window.NovaLessonComponent?.applyExploreModels();const ePick=h('select',{class:'nova-input','aria-label':'Event to calculate'});window.NovaLessonComponent?.applyExploreModels();Object.entries({'union':'A union B','intersection':'A intersection B','complement':'Neither A nor B','a-only':'A only','b-only':'B only','a':'Set A','b':'Set B'}).forEach(([k,v])=>ePick.append(h('option',{value:k,text:v})));
 window.NovaLessonComponent?.applyExploreModels();const button=(title,fn)=>h('button',{class:'nova-btn',text:title,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function report(){let c=calc(p,m,m.focus);emit('placedCount',c.placed);emit('correctCount',c.correct);emit('eventProbability',c.prob[0]/c.prob[1]);status.className='f178-status'+(c.allCorrect?' good':'');if(m.checked){let wrong=[...m.placed].find(([id,r])=>region(p,id)!==r);let missing=p.universe.find(id=>!m.placed.has(id));status.textContent=wrong?`Check ${wrong[0]}: it belongs in ${regions[region(p,wrong[0])]}, not ${regions[wrong[1]]}.`:missing?`You have not placed ${missing}. Every outcome must be included.`:'All outcomes are sorted correctly. The four regions add to the universe.';}else status.textContent=`${c.placed} of ${c.total} outcomes placed · ${c.correct} currently in the correct region. ${eventName(m.focus)} is the selected event.`;}
 window.NovaLessonComponent?.applyExploreModels();function repaint(){render(stage,p,m,{interact:true,checked:m.checked,title:'Drag each outcome into the correct set region',tag:'INTERACTIVE VENN',focus:m.focus,pose:m.checked&&calc(p,m,m.focus).allCorrect?'celebrate':m.checked?'not-yet':'compare',changed:()=>{report();repaint();},say:m.checked?'Check membership against both set rules, including outcomes outside both circles.':'Pick up an outcome in the tray and move it into A only, the overlap, B only or neither. Use the controls below for keyboard access.'});report();}
 window.NovaLessonComponent?.applyExploreModels();function change(k){NOVA.ui.cancelDrag();CFG.preset=k;p=sets[k];m=empty();m.focus=p.focus;sel.value=k;ePick.value=m.focus;vPick.replaceChildren();p.universe.forEach(n=>vPick.append(h('option',{value:String(n),text:'Outcome '+n})));rPick.value='a';m.selected=p.universe[0];emit('reset','preset');emit('preset',k);repaint();}
 window.NovaLessonComponent?.applyExploreModels();function move(n,r){n=Number(n);if(!p.universe.includes(n)||!regions[r])return;m.placed.set(n,r);m.selected=n;m.checked=false;emit('outcome',n);emit('region',r);repaint();}
 window.NovaLessonComponent?.applyExploreModels();const row=h('div',{class:'f178-controls'},[h('label',{class:'f178-label'},['Lesson ',sel]),h('label',{class:'f178-label'},['Event ',ePick]),button('Check arrangement',()=>{m.checked=true;const c=calc(p,m,m.focus);emit('complete',c.allCorrect);repaint();if(c.allCorrect)M.flash(stage.querySelector('svg.f178-plot'),210,340,'result',95);}),button('Reveal model',()=>{p.universe.forEach(n=>m.placed.set(n,region(p,n)));m.checked=true;emit('complete',true);repaint();}),button('Clear all',()=>{NOVA.ui.cancelDrag();m.placed.clear();m.checked=false;emit('reset','clear');repaint();})]);
 window.NovaLessonComponent?.applyExploreModels();const control=h('div',{class:'f178-controls'},[h('label',{class:'f178-label'},['Outcome ',vPick]),h('label',{class:'f178-label'},['Place in ',rPick]),button('Place / move',()=>move(vPick.value,rPick.value)),button('Return to tray',()=>{m.placed.delete(Number(vPick.value));m.checked=false;repaint();})]);
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=()=>change(sel.value);window.NovaLessonComponent?.applyExploreModels();ePick.onchange=()=>{m.focus=ePick.value;emit('focusRegion',m.focus);repaint();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f178-explain',text:'Sort once, with no duplicates. A ∩ B means BOTH properties. A ∪ B includes A only, B only and the overlap. The outside region contains members of neither set.'}),row,control,status);window.NovaLessonComponent?.applyExploreModels();change(CFG.preset);window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({...calc(p,m,m.focus),preset:CFG.preset,selected:m.selected,assignments:Object.fromEntries(m.placed),focus:m.focus}),setPreset:change,place:move,remove:n=>{m.placed.delete(Number(n));repaint();},check:()=>{m.checked=true;repaint();},reveal:()=>{p.universe.forEach(n=>m.placed.set(n,region(p,n)));m.checked=true;repaint();},clear:()=>{m.placed.clear();m.checked=false;repaint();}};
}
function challenge(panel,api,stage){const cases=[
 {q:'A survey of 12 pupils finds 5 play football, 6 play basketball, and 2 play both. How many play neither?',label:'Neither sport',ans:3,confusions:[[9,'That is the union count, not the number outside both circles.'],[2,'Two is the overlap. First calculate the union, then subtract from 12.'],[1,'Do not subtract the overlap twice. It belongs to both circles.']],hint:'First find the union: 5 + 6 − 2. Then subtract this from 12.',preset:'survey',focus:'complement'},
 {q:'Numbers 1 to 12. A is even numbers; B is multiples of 3. What is P(A union B)? Enter a fraction or decimal.',label:'Probability of union',ans:2/3,confusions:[[5/6,'You added the set sizes without removing the overlap.'],[1/3,'That counts the overlap or just part of the union. Include every outcome in either circle.'],[1/6,'The overlap contains two numbers, but a union is larger.']],hint:'There are 6 even numbers and 4 multiples of 3, with 2 in both. Count the union once.',preset:'notation',focus:'union'},
 {q:'From 1 to 12, A is prime numbers and B is even numbers. What is P(A intersection B)? Enter a fraction or decimal.',label:'Probability of intersection',ans:1/12,confusions:[[5/12,'That counts every prime, not the overlap.'],[1/2,'That is the proportion of even numbers. Find outcomes that are prime AND even.'],[10/12,'That is the union, not the intersection.']],hint:'Only one number between 1 and 12 is both prime and even.',preset:'prime',focus:'intersection'},
 {q:'With the same prime/even sets from 1 to 12, what is P(neither prime nor even)? Enter a fraction or decimal.',label:'Probability of neither',ans:1/6,confusions:[[5/6,'That is the probability of belonging to at least one circle. Neither is its complement.'],[1/12,'You have missed one number outside both circles.'],[1/2,'Half are odd, but some odd numbers are prime.']],hint:'Find the outcomes outside BOTH sets. The numbers 1 and 9 are neither prime nor even.',preset:'prime',focus:'complement'}
 ];
 const tasks=cases.map(c=>({q:c.q,build:NOVA.entryTask(c.label,'F17-08'),check:v=>{let good=Math.abs(v-c.ans)<.00001,near=c.confusions.find(([n])=>Math.abs(v-n)<.00001);return [good,good?'Correct. Your set regions and the full universe agree.':near?near[1]:'Check all four regions. Each outcome counts exactly once and the denominator is the full universe.'];},hint:c.hint}));
 function draw(i){let x=cases[i];render(stage,sets[x.preset],empty(),{title:'Challenge '+(i+1)+' · '+x.label,tag:'QUESTION '+(i+1)+'/4',challenge:true,hideAnswer:true,focus:x.focus,pose:'think',say:'Sketch the membership first. Count the intersection once, and use the entire universe for probability.'});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-08')return;let d=stage.querySelector('.nv-dock');if(d)d.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'Correct. Each outcome was counted once.':'Recheck the overlap. AND is the intersection; OR includes both circles.');if(e.detail.correct){let svg=stage.querySelector('svg.f178-plot');if(svg)M.flash(svg,210,340,'result',94);}});api.onCleanup(off);
}
const DEF={id:'F17-08',title:'Venn Diagram',config:CFG,steps,render:renderStep,alt:'Two overlapping neon Venn circles inside a universe rectangle. Drag labelled outcomes into A only, A intersect B, B only, or neither.',staticAlt:'A Venn diagram divides the universe into four disjoint regions: A only, both, B only, and neither. Intersection means AND; union means OR with the intersection counted once.',exploreIntro:'Sort labelled outcomes into Venn regions, check their membership and investigate exact set probabilities.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-08',DEF,{models:{},tables:{"steps":()=>steps},draws:{"render":["stage","p","m","o"]},exploreFields:{"p":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:'F17-08',num:'F17·08',title:'Venn Diagram',def:DEF,years:'KS3 Years 8–9; GCSE sets and probability.',linked:['F0-02','F0-04','F17-05','F17-06','F17-07','F17-10'],spec:{purpose:'Classify every outcome once in A only, both, B only or neither; calculate unions, intersections and complements.',params:'Universal set of 12 labelled outcomes; exact A and B membership; event selector; draggable per-outcome placement; four region counts; rational probabilities.',presets:'Y8-067 sports-survey two-way counts, Y8-072 even numbers and multiples of three, Y9-044 prime and even sets.',steps:'Universe → A only → intersection → complete four regions → compare union and intersection → compute exact chance.',interactions:'Core neon glass circles and frames; twelve draggable tokens, green valid drop regions, red removal zone, snapping and re-grabbing, keyboard region selector, event highlighting and feedback.',traps:'Double-counting the overlap in a union; confusing union with intersection; omitting neither; counting outcomes twice; incorrect universe denominator.',gcse:'Sets, complement, inclusion–exclusion and the four regions of two overlapping sets.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5200);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
