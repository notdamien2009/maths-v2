/* NOVA F17-11 Bag & Counter Experiments — canonical embedded NOVA core retained */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const PRESETS={
 y7:{label:'Y7-076 · Experimental probability',year:7,red:3,blue:2,gold:1,replace:true,draws:1,context:'Single random counter · Red event'},
 y8:{label:'Y8-071 · Independent draws',year:8,red:2,blue:3,gold:1,replace:true,draws:2,context:'Two ordered draws · Red then Blue'}
};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_11_CONFIG={startMode:'watch',preset:'y7',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','red','blue','gold','total','replacement','trials','successes','theoreticalProbability','relativeFrequency','lastOutcome','slot','draw','reset','complete'],presets:PRESETS});
const TYPES=['red','blue','gold'],TNAME={red:'RED',blue:'BLUE',gold:'GOLD'},ROLES={red:'error',blue:'given',gold:'focus'};
const BANK=[...Array(5)].map((_,i)=>({id:'r'+i,type:'red'})).concat([...Array(4)].map((_,i)=>({id:'b'+i,type:'blue'})),[...Array(3)].map((_,i)=>({id:'g'+i,type:'gold'})));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),mobile=()=>innerWidth<=500;
const num=(a)=>a.reduce((x,y)=>x+y,0),gcd=(a,b)=>b?gcd(b,a%b):a;
const fraction=(n,d)=>{if(!d)return [0,1];let g=gcd(Math.abs(n),Math.abs(d))||1;return [n/g,d/g];};
const speakFraction=v=>v[0]+' out of '+v[1];
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('Undeclared NOVA key '+key);NOVA.events.emit('value',{engine:'F17-11',key,value});};
const chalk=(p,x,y,v,role='op',size=23)=>NOVA.chalkText(p,x,y,String(v),{role,size});
const line=(p,x,y,X,Y,role='op',width=4)=>NOVA.neonLine(p,x,y,X,Y,{role,width});
const path=(p,d,role='op',fill=false,width=4)=>NOVA.neonPath(p,d,{role,fill,width});
const counts=m=>TYPES.map(t=>BANK.filter(k=>k.type===t&&m.placed.has(k.id)).length);
function probability(m){const [r,b,g]=counts(m),t=r+b+g;if(!t)return [0,1];if(m.draws===1)return fraction(r,t);const second=m.replace?b/t:b/(t-1);if(t<2)return [0,1];return fraction(r*(m.replace?b:b),t*(m.replace?t:t-1));}
const probabilityValue=m=>{let p=probability(m);return p[0]/p[1];};
function newModel(p){let placed=new Map();for(let t of TYPES){let list=BANK.filter(k=>k.type===t),count=p[t];for(let i=0;i<count;i++)placed.set(list[i].id,placed.size);}return {placed,replace:p.replace,draws:p.draws,trials:0,successes:0,last:'—',history:[],selected:'r0',seed:738291,step:0,flash:false};}
function resetResults(m){m.trials=0;m.successes=0;m.history=[];m.last='—';emit('reset','trials');}
function recompute(m){let a=counts(m);return {red:a[0],blue:a[1],gold:a[2],total:num(a),p:probability(m),relative:m.trials?m.successes/m.trials:null};}
function randomUnit(m){m.seed^=m.seed<<13;m.seed^=m.seed>>>17;m.seed^=m.seed<<5;return (m.seed>>>0)/4294967296;}
function trial(m){const pool=BANK.filter(k=>m.placed.has(k.id)),t=pool.length;if(!t)return null;let a=pool[Math.min(t-1,Math.floor(randomUnit(m)*t))];let b=null;if(m.draws===2){if(!m.replace&&pool.length<2)return null;let candidate=m.replace?pool:pool.filter(k=>k.id!==a.id);b=candidate[Math.min(candidate.length-1,Math.floor(randomUnit(m)*candidate.length))];}let ok=m.draws===1?a.type==='red':a.type==='red'&&b.type==='blue';m.trials++;if(ok)m.successes++;m.last=(a.type==='red'?'R':a.type==='blue'?'B':'G')+(b?' → '+(b.type==='red'?'R':b.type==='blue'?'B':'G'):'');m.history.push(ok?1:0);if(m.history.length>300)m.history.shift();return {first:a.type,second:b?.type||null,ok};}
function runTrials(m,n){let data=[];for(let i=0;i<n;i++){let t=trial(m);if(!t)break;data.push(t);}emit('trials',m.trials);emit('successes',m.successes);emit('lastOutcome',m.last);emit('relativeFrequency',m.trials?m.successes/m.trials:null);return data;}
function L(){if(mobile())return {W:440,H:1030,bag:{x:32,y:140,w:376,h:409},shelf:{x:25,y:678,w:390,h:223},remove:{x:240,y:929,w:176,h:67},supply:{x:24,y:929,w:198,h:67},slots:Array.from({length:12},(_,i)=>({x:99+(i%4)*80,y:280+Math.floor(i/4)*78})),tray:Array.from({length:12},(_,i)=>({x:65+(i%6)*62,y:741+Math.floor(i/6)*94})),radius:25};return {W:960,H:745,bag:{x:55,y:89,w:547,h:538},shelf:{x:657,y:126,w:274,h:399},remove:{x:710,y:616,w:220,h:73},supply:{x:657,y:536,w:273,h:66},slots:Array.from({length:12},(_,i)=>({x:172+(i%4)*98,y:298+Math.floor(i/4)*95})),tray:Array.from({length:12},(_,i)=>({x:701+(i%4)*63,y:239+Math.floor(i/4)*86})),radius:32};}
function svgFraction(parent,x,y,n,d,size=30,role='result'){
 chalk(parent,x,y-12,n,role,size);line(parent,x-29,y+4,x+29,y+4,role,3.4);chalk(parent,x,y+40,d,role,size);}
function fracHtml(v){let q=h('span',{class:'f1711-frac','aria-label':speakFraction(v)});q.append(h('b',{text:String(v[0])}),h('i',{'aria-hidden':'true'}),h('b',{text:String(v[1])}));return q;}
function stat(k,v,role='given',isFraction=false){let z=h('div',{class:'f1711-stat'});z.append(h('span',{class:'f1711-label',text:k}),isFraction?fracHtml(v):h('strong',{class:'f1711-value',text:String(v)}));return z;}
function drawCounter(svg,x,y,t,r,attr={}){
 let g=E('g',attr,svg),role=ROLES[t],col=NOVA.svg.c(role);
 E('circle',{cx:x,cy:y+5,r:r+7,opacity:.25,css:'fill:#020817;filter:url(#nv-shadow)'},g);
 NOVA.neonRing(g,x,y,{role,r:r-5,pulse:false});
 E('circle',{cx:x,cy:y,r:r-13,opacity:.24,css:'fill:'+col},g);
 E('path',{d:`M${x-r*.5} ${y-r*.3} Q${x} ${y-r*.82} ${x+r*.5} ${y-r*.3}`,'stroke-width':3,fill:'none',opacity:.83,css:'stroke:#fff'},g);
 chalk(g,x,y+8,t==='red'?'R':t==='blue'?'B':'G','result',Math.round(r*.8));return g;}
function bagShape(svg,l,sm){let b=l.bag,c=b.x+b.w/2,top=b.y+12,bot=b.y+b.h-20,left=b.x+20,right=b.x+b.w-20;
 // Bag construction uses shared neonPath and neonBox primitives, not a new drawing library.
 path(svg,`M${left+85} ${top+53} C${left+45} ${top+126} ${left-12} ${bot-130} ${left+53} ${bot-43} Q${c} ${bot+43} ${right-53} ${bot-43} C${right+18} ${bot-129} ${right-37} ${top+126} ${right-84} ${top+53} Z`,'op',true,5.6);
 path(svg,`M${left+85} ${top+53} C${left+45} ${top+126} ${left-12} ${bot-130} ${left+53} ${bot-43}`,'focus',false,3);
 path(svg,`M${right-84} ${top+53} C${right-38} ${top+126} ${right+18} ${bot-130} ${right-53} ${bot-43}`,'given',false,3);
 // luminous top lip and folds
 path(svg,`M${left+85} ${top+53} Q${c} ${top-16} ${right-84} ${top+53} Q${c} ${top+100} ${left+85} ${top+53} Z`,'focus',true,5);
 path(svg,`M${c-42} ${top+14} Q${c} ${top+31} ${c+42} ${top+14}`,'result',false,3);
 chalk(svg,c,top+(sm?-15:14),'COUNTER BAG','focus',sm?25:29);
 chalk(svg,c,bot+28,'WHAT IS INSIDE?','given',sm?19:24);
}
function drawScene(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("drawScene",arguments);}

 stage.replaceChildren();const l=L(),sm=mobile(),info=recompute(m),interact=!!o.interact;
 NOVA.cap(stage,o.title||'Bag experiments · build and draw',o.tag||'PROBABILITY · OBSERVED FREQUENCY');
 let svg=S.root(l.W,l.H,'Premium neon counter bag containing draggable red, blue and gold counters, plus a supply area, results and removal target.');svg.classList.add('f1711-plot');svg.setAttribute('data-engine-plot','F17-11');
 chalk(svg,l.W/2,sm?55:40,p.context,'focus',sm?20:25);
 chalk(svg,l.W/2,sm?94:76,o.subtitle||'Build your bag, then draw at random.','given',sm?19:23);
 bagShape(svg,l,sm);
 const shelf=l.shelf;NOVA.neonBox(svg,shelf.x,shelf.y,shelf.w,shelf.h,{role:'given',r:21});
 chalk(svg,shelf.x+shelf.w/2,shelf.y+38,'COUNTER SUPPLY','focus',sm?20:23);
 if(!sm)chalk(svg,shelf.x+shelf.w/2,shelf.y+72,'DRAG INTO BAG','given',19);
 if(!sm)chalk(svg,shelf.x+shelf.w/2,shelf.y+shelf.h-13,'UP TO TWELVE COUNTERS','given',19);
 let zones=l.slots.map((pt,i)=>({id:'bag'+i,kind:'drop',x:pt.x-(sm?35:40),y:pt.y-(sm?37:44),w:sm?70:80,h:sm?74:88}));zones.push({...l.remove,id:'remove',kind:'remove'});
 // Empty bag snap targets, visible green during drag courtesy of shared kit.
 for(let i=0;i<12;i++){
  let pt=l.slots[i];NOVA.neonRing(svg,pt.x,pt.y,{role:'given',r:sm?25:30,pulse:false});
  if(interact){let node=svg.querySelector('g:last-child');if(node)node.style.opacity=m.placed.has(BANK[0].id)?'.26':'.45';}
 }
 for(let i=0;i<BANK.length;i++){
  let token=BANK[i],slot=m.placed.get(token.id),pos=slot===undefined?l.tray[i]:l.slots[slot],r=l.radius;
  if(interact){let g=drawCounter(svg,pos.x,pos.y,token.type,r,{'data-counter':token.id,role:'button',tabindex:token.id===m.selected?0:-1,'aria-label':`${TNAME[token.type]} counter ${token.id}, ${slot===undefined?'in supply':'in bag position '+(slot+1)}`});
   NOVA.ui.svgDrag(svg,g,{box:{x:pos.x-r,y:pos.y-r,w:r*2,h:r*2},zones:()=>zones,removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+l.remove.h/2},onDrop:id=>{
      if(!/^bag\d+$/.test(id))return false;let dest=+id.slice(3);for(let [key,value] of m.placed){if(key!==token.id&&value===dest)m.placed.delete(key);}m.placed.set(token.id,dest);m.selected=token.id;resetResults(m);emit('slot',dest);o.changed();return true;
   },onRemove:()=>{m.placed.delete(token.id);resetResults(m);emit('slot','supply');o.changed();}});
   g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();m.placed.delete(token.id);resetResults(m);o.changed();return;}if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();let di={ArrowRight:1,ArrowDown:4,ArrowLeft:-1,ArrowUp:-4}[e.key],next=clamp(i+di,0,11);m.selected=BANK[next].id;g.tabIndex=-1;const target=svg.querySelector(`[data-counter="${BANK[next].id}"]`);if(target){target.tabIndex=0;target.focus();}}});
  } else {drawCounter(svg,pos.x,pos.y,token.type,r,{'data-watch-counter':token.id});}
 }
 NOVA.neonBox(svg,l.supply.x,l.supply.y,l.supply.w,l.supply.h,{role:'focus',r:18,text:sm?'DRAG COUNTERS':'BUILD YOUR BAG',size:sm?19:23});
 NOVA.neonBox(svg,l.remove.x,l.remove.y,l.remove.w,l.remove.h,{role:'error',r:18,text:'REMOVE',size:sm?22:26});
 if(interact){chalk(svg,l.W/2,sm?634:710,sm?'COUNTER COLOURS CHANGE CHANCE':'YOUR EXPERIMENT · EVERY COUNTER MATTERS','given',sm?19:21);}
 stage.append(svg);
 let row=h('div',{class:'f1711-readouts'});row.append(stat('IN THE BAG',info.total),stat('RED · BLUE · GOLD',`${info.red} · ${info.blue} · ${info.gold}`,'focus'));
 if(o.challenge){row.append(stat('PROBABILITY','?','result'))}else if(o.step>=3||interact){row.append(stat(m.draws===1?'P(RED)':'P(RED, THEN BLUE)',info.p,'result',true));}else row.append(stat('PROBABILITY','?','result'));
 stage.append(row);
 if((interact||o.step>=4)&&!o.challenge){let readings=h('div',{class:'f1711-readouts'});readings.append(stat('TRIALS',m.trials,'given'),stat('FAVOURABLE',m.successes,'focus'),stat('RELATIVE FREQUENCY',m.trials?(m.successes/m.trials).toFixed(3):'—','result'));stage.append(readings);}
 if(interact){let bar=h('div',{class:'f1711-bars','aria-label':'Experiment frequencies'});let k=0;for(let t of TYPES){let ratio=info.total?info[t]/info.total:0;bar.append(h('div',{class:'f1711-band'},[h('span',{text:TNAME[t]}),h('div',{class:'f1711-track'},[h('i',{class:'f1711-fill '+t,style:`width:${ratio*100}%`})]),h('b',{text:String(info[t])})]));k++;}stage.append(bar);}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Every counter has one equally likely chance of being picked on a single random draw.');
 if(o.flash)M.flash(svg,l.bag.x+l.bag.w/2,l.bag.y+l.bag.h/2,'result',100);
 return {svg,layout:l,info};
}
const steps=[
 {name:'Meet the counter bag',pose:'explain',narration:'This bag holds red, blue and gold counters. Each counter is equally likely to be selected. Count all the counters first.',prompt:'What is the total number of counters?'},
 {name:'Count the different colours',pose:'count',narration:'The red counters are favourable for a red draw. Blue and gold are not. The denominator is every counter in the bag.',prompt:'How many red counters are in the bag?'},
 {name:'Choose the drawing rule',pose:'point-down',narration:'With replacement means put each drawn counter back before drawing again. Without replacement, the first counter stays out until the second draw.',prompt:'Which rule keeps the chance on the second draw unchanged?'},
 {name:'Calculate a theoretical chance',pose:'think',narration:'Find the exact theoretical probability by counting favourable outcomes, then divide by all the equally likely counters. For two independent draws, multiply the two probabilities.',prompt:'What belongs in the numerator and denominator?'},
 {name:'Carry out repeated trials',pose:'compare',narration:'Now make random selections and record how often the event happens. The observed fraction may differ from the theoretical probability.',prompt:'Does one short experiment always match theory?'},
 {name:'Compare results and explain',pose:'celebrate',narration:'Relative frequency is successful trials divided by all trials. Many trials often give a closer estimate, but the results can still fluctuate.',prompt:'How could you improve the reliability of your estimate?'}
];
function renderStep(i,stage){i=clamp(i,0,5);let p=PRESETS[CFG.preset],m=newModel(p);m.step=i;if(i>=4){m.seed=41711;runTrials(m,i===4?14:120);}drawScene(stage,p,m,{step:i,title:steps[i].name,tag:`TEACHING STEP ${i+1} / 6`,pose:steps[i].pose,subtitle:i<3?'Observe the bag and its composition.':i===3?'Calculate from the counters, not the trials.':'Observe how the experimental frequency changes.',say:steps[i].narration,flash:i===5});if(i===4&&!NOVA.reducedMotion()){let l=L(),g=stage.querySelector('[data-watch-counter="r0"]');if(g){M.tween(850,t=>{let e=M.ease.inOut(t);g.setAttribute('transform',`translate(${(mobile()?112:220)*e} ${-(mobile()?65:125)*Math.sin(e*Math.PI)})`);},M.ease.inOut,()=>{g.removeAttribute('transform');});}}}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(PRESETS[CFG.preset])):(PRESETS[CFG.preset])),m=newModel(p),busy=false;
 window.NovaLessonComponent?.applyExploreModels();const select=h('select',{class:'nova-input','aria-label':'Lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(PRESETS).forEach(([key,v])=>select.append(h('option',{value:key,text:v.label})));
 window.NovaLessonComponent?.applyExploreModels();const replacement=h('select',{class:'nova-input','aria-label':'Replacement rule'},[h('option',{value:'yes',text:'With replacement'}),h('option',{value:'no',text:'Without replacement'})]);
 window.NovaLessonComponent?.applyExploreModels();const token=h('select',{class:'nova-input','aria-label':'Choose counter token'});window.NovaLessonComponent?.applyExploreModels();BANK.forEach((q,i)=>token.append(h('option',{value:q.id,text:`${TNAME[q.type]} ${i+1}`})));
 window.NovaLessonComponent?.applyExploreModels();const target=h('select',{class:'nova-input','aria-label':'Choose bag position'});window.NovaLessonComponent?.applyExploreModels();for(let i=0;i<12;i++)target.append(h('option',{value:String(i),text:'Bag slot '+(i+1)}));
 window.NovaLessonComponent?.applyExploreModels();const status=h('p',{class:'f1711-status',role:'status','aria-live':'polite'}),details=h('div',{class:'f1711-info'});
 window.NovaLessonComponent?.applyExploreModels();const btn=(text,onclick)=>h('button',{class:'nova-btn',text,onclick});
 window.NovaLessonComponent?.applyExploreModels();function explain(){let z=recompute(m);if(z.total===0)return 'Put at least one counter in the bag before conducting an experiment.';let t=m.draws===1?`P(red) = ${z.p[0]}/${z.p[1]}.`:`P(red then blue) = ${z.p[0]}/${z.p[1]}, ${m.replace?'because the first counter goes back':'because the second draw has one fewer counter'}.`;return `${z.total} equally likely counters. ${t} ${m.trials?`Observed ${m.successes} successes from ${m.trials} trials.`:'Run random trials to compare with theory.'}`;}
 window.NovaLessonComponent?.applyExploreModels();function draw(){let z=recompute(m);drawScene(stage,p,m,{interact:true,step:5,changed:draw,pose:m.flash?'celebrate':'count',say:m.flash?'Good experiment! The theoretical chance and observed frequency serve different purposes.':'Drag counters into the bag, or remove them, to change the theoretical probability. Random draw buttons sample the bag fairly.'});status.textContent=explain();details.textContent=`Last outcome: ${m.last} · ${m.replace?'With replacement':'Without replacement'} · ${m.draws} draw${m.draws>1?'s':''} per trial.`;emit('total',z.total);emit('theoreticalProbability',z.p[0]/z.p[1]);for(let t of TYPES)emit(t,z[t]);}
 window.NovaLessonComponent?.applyExploreModels();function setPreset(id){if(!PRESETS[id])return false;NOVA.ui.cancelDrag();CFG.preset=id;p=PRESETS[id];m=newModel(p);select.value=id;replacement.value=m.replace?'yes':'no';emit('preset',id);draw();return true;}
 window.NovaLessonComponent?.applyExploreModels();function place(id,j){j=+j;if(!BANK.some(q=>q.id===id)||!Number.isInteger(j)||j<0||j>=12)return false;for(let [k,v]of m.placed){if(k!==id&&v===j)m.placed.delete(k);}m.placed.set(id,j);resetResults(m);emit('slot',j);draw();return true;}
 window.NovaLessonComponent?.applyExploreModels();function remove(id){if(!m.placed.has(id))return false;m.placed.delete(id);resetResults(m);draw();return true;}
 window.NovaLessonComponent?.applyExploreModels();function trialBatch(n){if(busy)return;if(recompute(m).total<(m.draws===2&&!m.replace?2:1)){status.textContent='Add enough counters for the selected experiment.';return;}busy=true;let results=runTrials(m,n);busy=false;m.flash=results.some(r=>r.ok);draw();m.flash=false;if(results.some(r=>r.ok))M.flash(stage.querySelector('svg.f1711-plot'),L().bag.x+L().bag.w/2,L().bag.y+L().bag.h/2,'result',86);}
 window.NovaLessonComponent?.applyExploreModels();select.addEventListener('change',()=>setPreset(select.value));window.NovaLessonComponent?.applyExploreModels();replacement.addEventListener('change',()=>{m.replace=replacement.value==='yes';resetResults(m);emit('replacement',m.replace);draw();});
 window.NovaLessonComponent?.applyExploreModels();const row=h('div',{class:'f1711-controls'},[h('label',{class:'f1711-field'},['Lesson ',select]),h('label',{class:'f1711-field'},['Drawing rule ',replacement]),btn('Draw 1 trial',()=>trialBatch(1)),btn('Draw 10',()=>trialBatch(10)),btn('Draw 100',()=>trialBatch(100)),btn('Reset results',()=>{resetResults(m);draw();})]);
 window.NovaLessonComponent?.applyExploreModels();const keyboard=h('div',{class:'f1711-controls'},[h('label',{class:'f1711-field'},['Counter ',token]),h('label',{class:'f1711-field'},['Bag location ',target]),btn('Place / re-place',()=>place(token.value,target.value)),btn('Return to supply',()=>remove(token.value))]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f1711-info',text:'Build the bag by moving counters into the slots. For unbiased experiments, use the random trial buttons: intentionally choosing a counter is NOT a random trial. Changing the bag or replacement rule resets the trial history.'}),row,keyboard,details,status);
 window.NovaLessonComponent?.applyExploreModels();setPreset(CFG.preset);window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,...recompute(m),replace:m.replace,draws:m.draws,trials:m.trials,successes:m.successes,placed:Object.fromEntries(m.placed),last:m.last}),setPreset,place,remove,setReplacement:v=>{m.replace=!!v;replacement.value=m.replace?'yes':'no';resetResults(m);draw();return true;},run:trialBatch,reset:()=>{resetResults(m);draw();},clearBag:()=>{m.placed.clear();resetResults(m);draw();}};
}
function challenge(panel,api,stage){let cases=[
 {preset:'y7',q:'A bag has 3 red, 2 blue and 1 gold counter. What is P(red) on one random draw?',ans:1/2,label:'P(red)',bad:[[3/5,'The denominator is not just red and blue. Include the gold counter.'],[1/3,'There are three red counters, not two.']],hint:'Count red counters and divide by every counter in the bag.'},
 {preset:'y7',q:'The same bag has 3 red, 2 blue and 1 gold counter. What is P(NOT blue)?',ans:2/3,label:'P(not blue)',bad:[[1/3,'That is the chance of blue, not the complement.'],[1/2,'You counted only red. NOT blue also includes gold.']],hint:'NOT blue includes red or gold. Count all six counters.'},
 {preset:'y8',q:'A bag has 2 red, 3 blue and 1 gold counter. With replacement, find P(red THEN blue).',ans:1/6,label:'P(red then blue)',bad:[[1/5,'That uses a five-counter denominator for the second draw, which means NO replacement.'],[1/3,'That is only the probability of red first. Multiply by the chance of blue second.']],hint:'Multiply 2/6 by 3/6 because the counter is replaced.'},
 {preset:'y8',q:'A bag has 2 red, 3 blue and 1 gold counter. Without replacement, find P(red THEN blue).',ans:1/5,label:'P(red then blue without replacement)',bad:[[1/6,'That assumes you replaced the first counter. Five counters remain for draw two.'],[3/5,'That is only the second conditional chance after red. Include the first red draw too.']],hint:'Multiply the chance of red first, 2/6, by blue second, 3/5.'}
 ];
 let tasks=cases.map(c=>({q:c.q,build:NOVA.entryTask(c.label,'F17-11'),check:v=>{let ok=Number.isFinite(v)&&Math.abs(v-c.ans)<1e-7,bad=c.bad.find(([a])=>Math.abs(v-a)<1e-7);return [ok,ok?'Correct. You used the right favourable count and replacement rule.':bad?bad[1]:'Check the total counters, which colour is favourable and whether the first counter goes back.'];},hint:c.hint}));
 function reveal(i){let c=cases[i],p=PRESETS[c.preset],m=newModel(p);m.replace=i===2;drawScene(stage,p,m,{challenge:true,step:4,title:'Challenge '+(i+1)+' · Bag outcomes',tag:'PROBABILITY QUESTION '+(i+1)+'/4',subtitle:i===3?'Draw two counters, WITHOUT replacement.':'Count what is favourable.',pose:'think',say:'Count the favourable outcomes and consider whether the counter is returned before the next draw.'});}
 NOVA.challengeRun(panel,api,tasks,reveal,CFG);
 let off=NOVA.events.on('correct',e=>{let d=e.detail||{};if(d.engine!=='F17-11')return;let old=stage.querySelector('.nv-dock');if(old)old.remove();NOVA.scene.helperStrip(stage,d.correct?'celebrate':'not-yet',d.correct?'Correct! Your fraction is based on the actual contents of the bag.':'Try again. Draws with replacement and without replacement do not have the same second denominator.');if(d.correct){let q=stage.querySelector('svg.f1711-plot');if(q)M.flash(q,L().bag.x+L().bag.w/2,L().bag.y+L().bag.h/2,'result',95);}});api.onCleanup(off);
}
const DEF={id:'F17-11',title:'Bag and Counter Experiments',config:CFG,steps,render:renderStep,alt:'Premium neon counter bag with twelve target positions, separate supply counters in three colours, empirical tally and exact theoretical probability.',staticAlt:'Year 7: three red, two blue, one gold, P(red)=3/6. Year 8: two red, three blue, one gold, P(red then blue)=1/6 with replacement and 1/5 without.',exploreIntro:'Drag counters from supply into the bag. Randomly draw with or without replacement to compare theoretical chance with relative frequency.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-11',DEF,{models:{},tables:{"PRESETS":()=>PRESETS,"TYPES":()=>TYPES,"steps":()=>steps},draws:{"drawScene":["stage","p","m","o"]},exploreFields:{"p":{"kind":"value","factory":null,"argCount":null}}});
NOVA.bankMount({id:'F17-11',num:'F17·11',title:'Bag and Counter Experiments',def:DEF,years:'KS3 Years 7–8; GCSE extensions in sampling with and without replacement.',linked:['F0-02','F0-03','F0-04','F0-06','F17-03','F17-04','F17-07'],spec:{purpose:'Explore how the composition of a bag determines theoretical probability and how observed relative frequency changes over independent experimental trials.',params:'Up to 12 draggable counters in three colours; one or two random draws; with/without replacement; 1, 10 or 100 trials; two lesson presets.',presets:'Y7-076 single random counter, Y8-071 independent repeated draws.',steps:'Count outcomes → count colours → choose replacement rule → theoretical chance → experimental outcomes → compare estimates.',interactions:'Neon-glass counters using NOVA.neonRing and NOVA.svgDrag; 12 green bag snap targets, red removal zone, keyboard-equivalent placement; seeded random trials and detailed tally.',traps:'Wrong denominator, neglecting gold in complement, assuming independence without replacement, confusing chosen counter moves with random trials.',gcse:'Conditional probability on without-replacement two-stage experiments.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4800);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
