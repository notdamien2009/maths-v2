/* NOVA F17-14 Combinations and Arrangements. Engine-only; original NOVA core embedded unchanged. */
(function(){'use strict';
const H=NOVA.h,S=NOVA.svg,X=S.el,M=NOVA.motion,ID='F17-14';
const PRESETS={
 arr3:{label:'Three tiles · ordered',items:['A','B','C'],k:3,ordered:true,context:'Place 3 distinct tiles in 3 ordered positions.',event:'A in the first slot',lesson:'Foundations · arrangements'},
 comb4:{label:'Choose two · unordered',items:['A','B','C','D'],k:2,ordered:false,context:'Choose 2 of 4 distinct tiles. Order does not matter.',event:'A is chosen',lesson:'Foundations · combinations'},
 arr4:{label:'Podium · ordered',items:['A','B','C','D'],k:3,ordered:true,context:'Award gold, silver and bronze to 3 of 4 runners.',event:'A takes gold',lesson:'Extension · ordered selections'},
 comb5:{label:'Choose three · unordered',items:['A','B','C','D','E'],k:3,ordered:false,context:'Choose a team of 3 from 5 candidates.',event:'A is chosen',lesson:'Extension · unordered selections'}
};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_14_CONFIG={startMode:'watch',preset:'arr3',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','slot','item','removed','completed','total','favourable','probability','checked','reset','selection','focus'],presets:PRESETS});
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a)||1,frac=(a,b)=>{let d=gcd(a,b);return [a/d,b/d]};
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('F17-14 undeclared '+key);NOVA.events.emit('value',{engine:ID,key,value});};
const mobile=()=>innerWidth<=500;
const W=440,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const exact=(p)=>{let out=[];function gen(prefix,remaining){if(prefix.length===p.k){out.push(prefix.slice());return;}for(let i=0;i<remaining.length;i++)gen([...prefix,remaining[i]],remaining.filter((_,j)=>j!==i));}gen([],p.items);if(!p.ordered){const unique=new Map();out.forEach(x=>{let q=x.slice().sort();unique.set(q.join(''),q)});out=[...unique.values()].sort((a,b)=>a.join('').localeCompare(b.join('')));}return out;};
const favorable=(p,a)=>p.ordered?a[0]==='A':a.includes('A');
const calculate=p=>{let all=exact(p),good=all.filter(x=>favorable(p,x));return {all,good,total:all.length,goodN:good.length,prob:frac(good.length,all.length)};};
const state=p=>({placed:Array(p.k).fill(null),selected:0,checked:false,flash:false});
function place(p,m,item,slot){if(!p.items.includes(item)||slot<0||slot>=p.k)return false;let src=m.placed.indexOf(item),other=m.placed[slot];if(src===slot)return true;if(other&&src<0)return false;if(src>=0)m.placed[src]=other||null;m.placed[slot]=item;m.selected=p.items.indexOf(item);m.checked=false;emit('slot',slot);emit('item',item);return true;}
const completed=(p,m)=>m.placed.length===p.k&&m.placed.every(Boolean)&&new Set(m.placed).size===p.k;
const selection=(p,m)=>completed(p,m)?(p.ordered?m.placed.join(''):m.placed.slice().sort().join('')):null;
const ln=(svg,x,y,x2,y2,role='op',width=3)=>NOVA.neonLine(svg,x,y,x2,y2,{role,width});
const box=(svg,x,y,w,h,role='given',r=12)=>NOVA.neonBox(svg,x,y,w,h,{role,r});
const ch=(svg,x,y,text,role='given',size=22,anchor)=>NOVA.chalkText(svg,x,y,String(text),{role,size,anchor});
const path=(svg,d,role='op',width=4)=>NOVA.neonPath(svg,d,{role,width,fill:true});
function dims(){const sm=mobile();return sm?{W:440,H:920,slotY:212,slotW:107,slotH:105,slotXs:[88,220,352],previewY:396,previewCols:5,previewW:75,previewStep:82,trayY:718,removeY:822,itemXs:[55,138,221,304,387],chipW:65,chipH:63}: {W:900,H:796,slotY:192,slotW:168,slotH:114,slotXs:[230,450,670],previewY:369,previewCols:6,previewW:112,previewStep:128,trayY:624,removeY:727,itemXs:[180,315,450,585,720],chipW:104,chipH:66};}
const pos=(D,p,slot)=>{let delta=p.k===2?(D.slotXs[1]-D.slotXs[0])/2:0;let xs=p.k===2?[D.slotXs[0]+delta,D.slotXs[2]-delta]:D.slotXs;return {x:xs[slot],y:D.slotY};};
const hit=(x,y,w,h,id,kind='drop')=>({x:x-w/2-3,y:y-h/2-3,w:w+6,h:h+6,id,kind});
function fracSVG(svg,x,y,num,den,role='result',sm=true){ch(svg,x,y-13,num,role,sm?24:29);ln(svg,x-28,y+2,x+28,y+2,role,3);ch(svg,x,y+35,den,role,sm?24:29);}
function showNumber(n){return Number.isInteger(n)?String(n):String(Math.round(n*100)/100)}
function fracHTML(a,b){let f=frac(a,b),span=H('span',{class:'f1714-frac','aria-label':f[0]+' over '+f[1]});span.append(H('b',{text:f[0]+''}),H('i',{'aria-hidden':'true'}),H('b',{text:f[1]+''}));return span;}
function stat(label,value,role){let d=H('div',{class:'f1714-stat','data-role':role||'given'},[H('span',{class:'f1714-stat-label',text:label})]);d.append(typeof value==='object'?fracHTML(value[0],value[1]):H('strong',{class:'f1714-stat-val',text:String(value)}));return d;}
function scene(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("scene",arguments);}

 stage.replaceChildren();let D=dims(),sm=mobile(),c=calculate(p),all=c.all,interact=!!o.interact;
 NOVA.cap(stage,o.title||'Combinations & arrangements',o.tag||'F17 · COUNTING OUTCOMES');
 const svg=S.root(D.W,D.H,'Interactive neon arrangement slots. Drag each distinct tile into an empty slot, or move it to another slot. Order matters for arrangements; it does not matter for combinations.');svg.classList.add('f1714-plot');svg.setAttribute('data-engine-plot',ID);
 ch(svg,D.W/2,43,p.ordered?'ARRANGEMENTS':'COMBINATIONS','focus',sm?27:33);
 ch(svg,D.W/2,82,p.ordered?'ORDER MATTERS':'ORDER DOES NOT MATTER','op',sm?20:26);
 ch(svg,D.W/2,114,'Select '+p.k+' from '+p.items.length+' distinct tiles','given',sm?18:23);
 const slots=[];
 for(let j=0;j<p.k;j++){
  let P=pos(D,p,j),w=D.slotW,h=D.slotH,role=m.placed[j]?'focus':'op';
  box(svg,P.x-w/2,P.y-h/2,w,h,role,17);
  if(!m.placed[j]){ch(svg,P.x,P.y+12,'?', 'focus',sm?40:51);} 
  ch(svg,P.x,P.y+h/2+30,p.ordered?(p.k===3?['1ST','2ND','3RD'][j]:['1ST','2ND'][j]):'PICK '+(j+1),'given',sm?18:22);
  slots.push({...hit(P.x,P.y,w-10,h-5,String(j)),center:P});
 }
 ch(svg,D.W/2,sm?335:316,'ALL DISTINCT OUTCOMES','given',sm?20:25);
 let preview=all.slice(0,sm?10:12);const previewRows=Math.ceil(preview.length/D.previewCols);
 preview.forEach((arr,i)=>{
  let col=i%D.previewCols,row=Math.floor(i/D.previewCols),gx=(D.W-(D.previewCols-1)*D.previewStep)/2+col*D.previewStep,gy=D.previewY+row*(sm?70:73),k=arr.join('');
  let active=k===selection(p,m),selectedGood=favorable(p,arr);
  box(svg,gx-D.previewW/2,gy-27,D.previewW,54,active?'result':'given',11);
  if(active)NOVA.neonRing(svg,gx-D.previewW/2+9,gy-20,{role:'result',r:5});
  ch(svg,gx,gy+7,k,active?'result':(selectedGood&&!o.hideAnswer)?'op':'given',sm?21:25);
 });
 ch(svg,D.W/2,(sm?562:537),all.length>preview.length?'Showing '+preview.length+' of '+all.length+' valid outcomes':all.length+' valid outcomes', 'given',sm?17:20);
 // A key teaching rule: the collection is combinatorial, not an arbitrary ordering of a single result.
 ch(svg,D.W/2,(sm?596:571),'TARGET: '+p.event.toUpperCase(),'focus',sm?18:23);
 ch(svg,D.W/2,(sm?651:586),'DRAG THE TILES INTO SLOTS','op',sm?18:22);
 box(svg,sm?18:65,D.trayY-51,sm?404:770,sm?103:90,'given',18);
 let xs=p.items.map((_,i)=>p.items.length===5?D.itemXs[i]:D.itemXs[i+Math.floor((5-p.items.length)/2)]);
 const used=p.items.map(item=>m.placed.indexOf(item));
 const zones=slots.map(z=>({x:z.x,y:z.y,w:z.w,h:z.h,id:z.id,kind:'drop'}));
 zones.push({x:sm?244:530,y:D.removeY-38,w:sm?174:282,h:sm?77:62,id:'remove',kind:'remove'});
 p.items.forEach((item,index)=>{
  let slot=used[index],z=slot<0?{x:xs[index],y:D.trayY}:{...pos(D,p,slot)},w=D.chipW,h=D.chipH;
  const g=X('g',{'data-tile':item,role:'button',tabindex:interact&&m.selected===index?0:-1,'aria-label':'Tile '+item+(slot>=0?' in slot '+(slot+1):' in tray')},svg);
  box(g,z.x-w/2,z.y-h/2,w,h,slot>=0?'focus':'op',13);
  ch(g,z.x,z.y+11,item,'given',sm?29:37);
  if(interact){
   NOVA.ui.svgDrag(svg,g,{box:{x:z.x-w/2,y:z.y-h/2,w,h},zones:()=>zones,removeTo:{x:sm?330:670,y:D.removeY},onDrop:(id)=>{
    let target=Number(id);if(!Number.isInteger(target)||!place(p,m,item,target))return false;
    o.changed();return true;
   },onRemove:()=>{let a=m.placed.indexOf(item);if(a>=0){m.placed[a]=null;emit('removed',item);m.checked=false;}o.changed();}});
   g.addEventListener('keydown',e=>{
    if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();let a=m.placed.indexOf(item);if(a>=0){m.placed[a]=null;emit('removed',item);o.changed();}return;}
    let delta={'ArrowRight':1,'ArrowDown':1,'ArrowLeft':-1,'ArrowUp':-1}[e.key];if(delta){e.preventDefault();let next=(index+delta+p.items.length)%p.items.length;m.selected=next;g.tabIndex=-1;let other=svg.querySelector('[data-tile="'+p.items[next]+'"]');if(other){other.tabIndex=0;other.focus();}}
   });
  }
 });
 box(svg,sm?22:104,D.removeY-38,sm?187:276,sm?77:62,'focus',15);
 ch(svg,sm?114:242,D.removeY+7,'TILE TRAY','given',sm?19:22);
 box(svg,sm?244:530,D.removeY-38,sm?174:282,sm?77:62,'error',15);
 ch(svg,sm?331:671,D.removeY+7,'REMOVE','error',sm?20:24);
 ch(svg,D.W/2,D.H-18,'One tile cannot fill two positions','given',sm?17:21);
 stage.appendChild(svg);
 let reads=H('div',{class:'f1714-stats'});
 reads.append(stat('POSSIBLE',o.hideAnswer?'?':c.total,'given'),stat('FAVOURABLE',o.hideAnswer?'?':c.goodN,'focus'),o.hideAnswer?stat('PROBABILITY','?','result'):stat('PROBABILITY',c.prob,'result'));
 stage.append(reads);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Order changes arrangements. For combinations, the same chosen group is counted once.');
 if(o.celebrate)M.flash(svg,D.W/2,D.slotY,'result',98);
 return {svg,zones,summary:c};
}
const steps=[
 {name:'Choose the distinct objects',pose:'explain',narration:'Every tile is distinct. Start with three letters. We can use each tile at most once in an arrangement.',prompt:'How many choices are there for the first position?'},
 {name:'Fill the first position',pose:'point-down',narration:'There are three possible first choices. After you use a tile, you must not use it twice.',prompt:'Why does using one tile leave fewer choices?'},
 {name:'Fill the remaining positions',pose:'count',narration:'With no repeats allowed, there are fewer choices each time. Multiply the choices for the positions.',prompt:'How many choices remain for the last position?'},
 {name:'Reverse the order',pose:'compare',narration:'A followed by B is different from B followed by A when the positions have meaning.',prompt:'Why are AB and BA different arrangements?'},
 {name:'Count unordered groups',pose:'think',narration:'If we only choose a team, AB and BA represent the same group. We should count that group once.',prompt:'When would order not matter?'},
 {name:'Calculate the probability',pose:'celebrate',narration:'Count the favourable selections. Divide by the total number of equally likely distinct outcomes.',prompt:'Which outcomes satisfy the target event?'}
];
function showStep(i,stage){let k=clamp(i,0,5),p=k===4?PRESETS.comb4:PRESETS.arr3,m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("showStep.m",(...a)=>state(...a),[p]):(state(p)));if(k>=1)m.placed[0]='A';if(k>=2)m.placed[1]='B';if(k>=3)m.placed[2]='C';if(k===4)m.placed=[null,null];scene(stage,p,m,{title:steps[k].name,tag:'STEP '+(k+1)+' / 6',hideAnswer:k<5,pose:steps[k].pose,celebrate:k===5,say:[
 'Start with the distinct tiles. Every choice matters if the slots have different positions.',
 'Place A first. There are still two unused tiles available to follow it.',
 'With A first, B can follow. Only one tile is left for the last position.',
 'Compare ABC with ACB. These are different arrangements because positions differ.',
 'Now choose two from four. In combinations, AB and BA count as one selection.',
 'List each distinct selection once. Count the favourable ones and compare with the total.'
 ][k]});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(PRESETS[CFG.preset])):(PRESETS[CFG.preset])),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("m",(...a)=>state(...a),[p]):(state(p))),status=H('p',{class:'f1714-status',role:'status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();const preset=H('select',{class:'nova-input','aria-label':'Select counting preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(PRESETS).forEach(([key,v])=>preset.append(H('option',{value:key,text:v.label})));
 window.NovaLessonComponent?.applyExploreModels();const tile=H('select',{class:'nova-input','aria-label':'Select tile'}),slot=H('select',{class:'nova-input','aria-label':'Select destination slot'});
 window.NovaLessonComponent?.applyExploreModels();const button=(text,fn)=>H('button',{class:'nova-btn',text,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function report(){let c=calculate(p),count=m.placed.filter(Boolean).length;emit('completed',completed(p,m));emit('total',c.total);emit('favourable',c.goodN);emit('probability',c.prob[0]/c.prob[1]);if(m.checked){status.textContent=completed(p,m)?'Correctly built: '+selection(p,m)+(p.ordered?'. Every position has meaning.':'. This unordered group is counted once.'):'Fill all '+p.k+' slots with different tiles before checking.';}else status.textContent=count+' of '+p.k+' positions filled · '+c.total+' possible '+(p.ordered?'arrangements':'combinations')+'. '+(p.ordered?'Order matters.':'Order does not matter.');}
 window.NovaLessonComponent?.applyExploreModels();function paint(celebrate=false){scene(stage,p,m,{interact:true,checked:m.checked,celebrate,pose:celebrate?'celebrate':m.checked?'compare':'point-down',changed:()=>paint(),say:celebrate?'Your selection is valid. Now compare it against all the possible outcomes.':'Drag a tile from the glowing tray into a numbered slot. Re-grab tiles to rearrange them; drop onto red to remove.'});report();}
 window.NovaLessonComponent?.applyExploreModels();function setPreset(id){NOVA.ui.cancelDrag();CFG.preset=id;p=PRESETS[id];m=state(p);preset.value=id;tile.replaceChildren();p.items.forEach(t=>tile.append(H('option',{value:t,text:'Tile '+t})));slot.replaceChildren();for(let j=0;j<p.k;j++)slot.append(H('option',{value:j+'',text:'Slot '+(j+1)}));emit('preset',id);emit('reset','preset');paint();}
 window.NovaLessonComponent?.applyExploreModels();function put(){let t=tile.value,j=Number(slot.value);let ok=place(p,m,t,j);if(!ok)status.textContent='Slot occupied. Re-grab its tile first or choose an empty slot.';else{emit('selection',selection(p,m));paint();}}
 window.NovaLessonComponent?.applyExploreModels();const toolbar=H('div',{class:'f1714-controls'},[H('label',{class:'f1714-field'},['Model ',preset]),button('Check arrangement',()=>{m.checked=true;let valid=completed(p,m);emit('checked',valid);paint(valid);}),button('Show example',()=>{m.placed=p.items.slice(0,p.k);m.checked=true;paint(true);}),button('Clear slots',()=>{NOVA.ui.cancelDrag();m=state(p);emit('reset','clear');paint();})]);
 window.NovaLessonComponent?.applyExploreModels();const accessibility=H('div',{class:'f1714-controls'},[H('label',{class:'f1714-field'},['Tile ',tile]),H('label',{class:'f1714-field'},['Position ',slot]),button('Place selected tile',put),button('Remove selected tile',()=>{const x=m.placed.indexOf(tile.value);if(x>=0){m.placed[x]=null;emit('removed',tile.value);paint();}})]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(toolbar,accessibility,status);
 window.NovaLessonComponent?.applyExploreModels();preset.addEventListener('change',()=>setPreset(preset.value));window.NovaLessonComponent?.applyExploreModels();setPreset(CFG.preset);window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
}
function challenge(panel,api,stage){const data=[
 {preset:'arr3',q:'Three distinct letters A, B and C fill three numbered positions. How many different arrangements are possible?',label:'Number of arrangements',answer:6,bad:[[3,'Three is the number of tiles, not the number of orders.'],[9,'You cannot use one letter twice.']],hint:'Count the choices: 3 for the first, then 2, then 1.'},
 {preset:'comb4',q:'Choose two distinct pupils from A, B, C and D. Order does not matter. How many different pairs?',label:'Number of combinations',answer:6,bad:[[12,'That is the count if AB and BA were considered different. For a pair, they are the same.'],[4,'Four is the number of pupils, not the number of different pairs.']],hint:'There are 4 × 3 ordered picks, but each unordered pair appears twice.'},
 {preset:'arr4',q:'Four different runners compete for gold, silver and bronze. How many possible medal orders?',label:'Medal orders',answer:24,bad:[[12,'You need a third position as well: 4 × 3 × 2.'],[4,'Each first-place winner has multiple orders for the other two medals.']],hint:'There are 4 choices for gold, then 3 for silver, then 2 for bronze.'},
 {preset:'comb5',q:'A team of 3 is selected randomly from 5 pupils A, B, C, D and E. What is the probability that A is selected? Enter a fraction or decimal.',label:'Probability A is chosen',answer:3/5,bad:[[1/5,'There are three selected places, so A can be included in more than one group.'],[6,'Six favourable groups is a count; divide by the 10 possible teams.']],hint:'There are 10 different teams; count the 6 teams containing A.'}
 ];
 const tasks=data.map(d=>({q:d.q,build:NOVA.entryTask(d.label,ID),check:x=>{let ok=Number.isFinite(x)&&Math.abs(x-d.answer)<1e-7,bad=d.bad.find(([n])=>Math.abs(x-n)<1e-7);return [ok,ok?'Correct. Count each valid outcome exactly once.':bad?bad[1]:'Decide whether order matters, then count without reusing a tile.'];},hint:d.hint}));
 function reveal(i){let d=data[i],p=PRESETS[d.preset];scene(stage,p,state(p),{title:'Challenge '+(i+1)+' · '+(p.ordered?'Arrangements':'Combinations'),tag:'QUESTION '+(i+1)+' / 4',hideAnswer:true,pose:'think',say:'Choose the counting rule first. Are the positions different, or is this an unordered group?'});}
 NOVA.challengeRun(panel,api,tasks,reveal,CFG);
 const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!==ID)return;stage.querySelector('.nv-dock')?.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'You counted distinct outcomes correctly.':'Try again: the order rule determines whether choices are counted separately.');if(e.detail.correct){let svg=stage.querySelector('svg.f1714-plot');if(svg)M.flash(svg,dims().W/2,dims().slotY,'result',90);}});api.onCleanup(off);
}
const DEF={id:ID,title:'Combinations and Arrangements',config:CFG,steps,render:showStep,alt:'Neon counting machine with labelled slots, drag-and-drop distinct tiles and an enumerated list of possible ordered or unordered outcomes.',staticAlt:'Three different tiles have 3 × 2 × 1 = 6 arrangements. Choosing 2 from 4 without order gives 6 combinations. Sample uniformly from the distinct outcomes to calculate probabilities.',exploreIntro:'Build distinct ordered arrangements or unordered groups; drag, reorder and remove tiles, then compare the count of total and favourable outcomes.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{"state":()=>state},tables:{"PRESETS":()=>PRESETS,"steps":()=>steps},draws:{"scene":["stage","p","m","o"]},exploreFields:{"p":{"kind":"value","factory":null,"argCount":null},"m":{"kind":"factory","factory":"state","argCount":1},"showStep.m":{"kind":"factory","factory":"state","argCount":1}}});
NOVA.bankMount({id:ID,num:'F17·14',title:'Combinations and Arrangements',def:DEF,years:'Reusable KS3 probability and GCSE counting-principle extension; no specific lesson identifiers named in the master.',linked:['F0-02','F0-03','F0-04','F17-05','F17-06','F17-07'],spec:{purpose:'Build and enumerate permutations and combinations without replacement, decide when order matters, and calculate probability from equally likely selections.',params:'3–5 distinct tiles; 2–3 slots; four named reusable presets; ordered or unordered count; target event and exact reduced probability.',presets:'Three tiles arranged; choose two of four; podium orders; choose three of five. The master does not assign a named lesson to F17-14.',steps:'Identify objects → fill slots → multiply choices → compare orders → remove duplicate orders → favourable/total probability.',interactions:'NOVA core neonBox/path/ring/chalkText and svgDrag, green destination highlights, red removal zone, re-grabbing, cancellation recovery and accessible keyboard placement.',traps:'Counting AB and BA separately when order does not matter; ignoring distinctness; replacing a tile; counting only first-choice outcomes; treating a count as a probability.',gcse:'nPr and nCr counting, without-replacement sample spaces and probability of inclusion.'}});
let log=document.getElementById('log');if(log){let add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4800);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
window.NOVA_F17_14_TEST={PRESETS,CFG,exact,calculate,place,state,selection,completed,frac};
})();
