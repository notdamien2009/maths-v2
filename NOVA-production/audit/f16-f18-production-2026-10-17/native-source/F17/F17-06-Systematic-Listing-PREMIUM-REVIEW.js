/* F17-06 SYSTEMATIC LISTING — original NOVA Neon + Chalk / F0-F2 shared core */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_06_CONFIG={startMode:'watch',preset:'y7',events:['value','correct','step','mode','hintUsed'],valueKeys:['preset','outcome','markedCount','favourableCount','totalOutcomes','probability','completed','lastMoved','reset'],presets:{
 y7:{label:'Y7-074 · Coin × 3-colour spinner',year:7,first:['H','T'],second:['R','B','G'],names:['COIN','COLOUR'],event:'Heads AND Blue',kind:'H × B',win:(a,b)=>a==='H'&&b==='B'},
 y8:{label:'Y8-070 · Coin × die',year:8,first:['H','T'],second:['1','2','3','4','5','6'],names:['COIN','DIE'],event:'Heads AND Even',kind:'H × EVEN',win:(a,b)=>a==='H'&&Number(b)%2===0},
 y9:{label:'Y9-043 · Two fair dice',year:9,first:['1','2','3','4','5','6'],second:['1','2','3','4','5','6'],names:['DIE A','DIE B'],event:'Sum equals seven',kind:'SUM 7',win:(a,b)=>Number(a)+Number(b)===7}
 }});
const pget=()=>CFG.presets[CFG.preset], mobile=()=>innerWidth<=500, clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),code=(r,c)=>r+'-'+c,decode=k=>k.split('-').map(Number);
const all=p=>p.first.flatMap((_,r)=>p.second.map((_,c)=>code(r,c)));
const wins=p=>all(p).filter(k=>{let [r,c]=decode(k);return p.win(p.first[r],p.second[c]);});
const counts=(p,m)=>{let a=wins(p);return {total:all(p).length,favourable:a.length,selected:m.marked.size,matched:[...m.marked].filter(k=>a.includes(k)).length,complete:m.marked.size===a.length&&[...m.marked].every(k=>a.includes(k))};};
const gcd=(a,b)=>b?gcd(b,a%b):a,reduce=(n,d)=>{let g=gcd(n,d);return [n/g,d/g];};
const say=(g,x,y,t,role='op',size=18,anchor='middle')=>NOVA.chalkText(g,x,y,String(t),{role,size,anchor});
function fractSVG(g,x,y,n,d,role='op',sz=22){say(g,x,y-7,n,role,sz);NOVA.neonLine(g,x-sz*.75,y+3,x+sz*.75,y+3,{role,width:3});say(g,x,y+sz+7,d,role,sz);}
function fractHTML(n,d){let x=h('span',{class:'f176-frac','aria-label':n+' over '+d});x.append(h('b',{text:String(n)}),h('i',{'aria-hidden':'true'}),h('b',{text:String(d)}));return x;}
function metric(label,value,role,den){let x=h('div',{class:'f176-card','data-role':role});x.append(h('span',{class:'lab',text:label}),den===undefined?h('span',{class:'val',text:String(value)}):fractHTML(value,den));return x;}
function emit(key,value){if(!CFG.valueKeys.includes(key))throw Error('Unregistered F17-06 key '+key);NOVA.events.emit('value',{engine:'F17-06',key,value});}
function signal(p,m){let c=counts(p,m);emit('preset',CFG.preset);emit('totalOutcomes',c.total);emit('favourableCount',c.favourable);emit('markedCount',c.selected);emit('probability',c.favourable/c.total);emit('completed',c.complete);}
const state=()=>({marked:new Set(),focus:'0-0',revealed:false});
function layout(p){let mob=mobile(),n=p.first.length,k=p.second.length;if(mob){let gap=n===6?57:188;return {W:390,H:n===6?795:770,trunkX:41,firstX:100,leafX:146,leafW:223,top:n===6?176:220,gap,slot:223/k,rowPanelH:n===6?52:100,topCaption:68,information:n===6?543:529,prob:n===6?635:617,palette:n===6?737:713,addX:119,removeX:297};}let gap=n===6?65:196;return {W:840,H:n===6?820:765,trunkX:100,firstX:180,leafX:284,leafW:485,top:n===6?156:218,gap,slot:485/k,rowPanelH:n===6?58:106,topCaption:60,information:n===6?559:509,prob:n===6?653:600,palette:n===6?759:704,addX:311,removeX:684};}
const pair=(p,r,c)=>p.first[r]+' , '+p.second[c];
function render(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("render",arguments);}

 stage.replaceChildren(); const A=layout(p),c=counts(p,m),N=p.first.length,K=p.second.length,slotW=A.slot;
 NOVA.cap(stage,o.title||'Build a complete systematic list',o.tag||'SYSTEMATIC LISTING');
 const svg=S.root(A.W,A.H,'Branching systematic list of '+c.total+' ordered outcomes. Each first-event branch has every second-event choice, with draggable favourable outcome markers.');svg.classList.add('f176-plot');svg.setAttribute('data-engine-plot','F17-06');
 say(svg,A.W/2,A.topCaption,p.event,'focus',mobile()?22:25);
 say(svg,A.W/2,A.topCaption+34,'EVERY BRANCH. EVERY OUTCOME. ONCE.','given',mobile()?14:18);
 const row0=A.top,rowEnd=row0+(N-1)*A.gap;
 // Real branch construction: one start node, a vertical trunk, and one branch per first outcome.
 NOVA.neonLine(svg,A.trunkX,row0,A.trunkX,rowEnd,{role:'given',width:3});
 NOVA.neonRing(svg,A.trunkX,(row0+rowEnd)/2,{role:'focus',r:10,pulse:false});
 say(svg,A.trunkX,(row0+rowEnd)/2-18,'START','given',mobile()?14:18);
 say(svg,A.firstX,A.top-45,p.names[0],'given',mobile()?16:20);
 say(svg,A.leafX+A.leafW/2,A.top-45,p.names[1],'given',mobile()?16:20);
 let zones=[];
 for(let r=0;r<N;r++){
  const y=row0+r*A.gap,openRow=o.revealCount===undefined||r*K<o.revealCount;
  NOVA.neonLine(svg,A.trunkX+10,y,A.firstX-29,y,{role:'given',width:3});
  NOVA.neonRing(svg,A.firstX-10,y,{role:'op',r:7,pulse:false});
  NOVA.neonBox(svg,A.firstX-25,y-20,50,40,{role:'focus',r:12});
  say(svg,A.firstX,y+7,p.first[r],'op',mobile()?23:24);
  // each row has a family of end branches: these are lists, NOT table intersections
  NOVA.neonLine(svg,A.firstX+27,y,A.leafX-3,y,{role:'given',width:2.4});
  for(let col=0;col<K;col++){
   let key=code(r,col),selected=m.marked.has(key),win=p.win(p.first[r],p.second[col]),known=o.showWinning&&win;
   const x=A.leafX+col*slotW+2, w=slotW-4, yBox=y-(N===6?22:27), ht=N===6?44:54;
   const group=E('g',{'data-outcome':key,tabindex:o.interact&&m.focus===key?0:-1,role:o.interact?'button':'img','aria-label':pair(p,r,col)+(selected?', marked as favourable':', not marked'),'aria-pressed':o.interact?String(selected):undefined},svg);
   NOVA.neonBox(group,x,yBox,w,ht,{role:selected?'result':known?'focus':openRow?'given':'unknown',r:Math.min(12,w*.18)});
   if(openRow){
    say(group,x+w/2,y+(selected?-4:6),K===6?p.second[col]:pair(p,r,col),selected?'result':known?'focus':'op',mobile()?(K===6?24:21):(K===6?24:24));
    if(selected||known)NOVA.neonRing(group,x+w/2,y+Math.min(17,ht*.28),{role:selected?'result':'focus',r:mobile()?8:10,pulse:false});
   }else say(group,x+w/2,y+6,'?','unknown',mobile()?17:20);
   // SVG drag kit uses the same exact selectable end-branch zones as F17-05.
   zones.push({x:x+1,y:yBox+1,w:w-2,h:ht-2,id:key,kind:'drop'});
   if(o.interact){
     group.addEventListener('click',()=>{NOVA.ui.cancelDrag();o.toggle(key);});
     group.addEventListener('keydown',e=>{
       if(e.key==='Enter'||e.key===' '){e.preventDefault();o.toggle(key);return;}
       const d={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]}[e.key];
       if(d){e.preventDefault();let nextKey=code(clamp(r+d[0],0,N-1),clamp(col+d[1],0,K-1));let next=svg.querySelector('[data-outcome="'+nextKey+'"]');if(next){group.setAttribute('tabindex','-1');next.setAttribute('tabindex','0');m.focus=nextKey;next.focus();}}
     });
   }
  }
 }
 say(svg,A.W/2,A.information,'LISTED   '+(o.revealCount===undefined?c.total:Math.min(c.total,o.revealCount))+' / '+c.total+' POSSIBLE','given',mobile()?18:22);
 say(svg,A.W/2,A.prob-48,'P('+p.kind+')', 'focus',mobile()?19:22);
 fractSVG(svg,A.W/2,A.prob+4,o.challenge||o.hideAnswer?'?':o.showWinning?c.favourable:c.selected,c.total,o.showWinning?'result':'op',mobile()?20:23);
 let rm={x:A.removeX-(mobile()?61:80),y:A.palette-27,w:mobile()?122:160,h:55,id:'remove',kind:'remove'};
 if(o.interact){
  NOVA.neonBox(svg,rm.x,rm.y,rm.w,rm.h,{role:'error',r:14,text:'REMOVE',size:mobile()?17:20});
  let palette=E('g',{'data-list-token':'1',tabindex:0,role:'button','aria-label':'Drag MARK token to an outcome, or select an outcome using the controls below.'},svg);
  NOVA.neonBox(palette,A.addX-(mobile()?66:80),A.palette-26,mobile()?132:160,52,{role:'focus',r:14,text:'MARK',size:mobile()?18:20});
  let zz=[...zones,rm];
  NOVA.ui.svgDrag(svg,palette,{box:{x:A.addX-(mobile()?66:80),y:A.palette-26,w:mobile()?132:160,h:52},zones:()=>zz,removeTo:{x:A.removeX,y:A.palette},onDrop:id=>{if(!id||id==='remove')return false;m.marked.add(id);emit('lastMoved',id);o.changed();return true;},onRemove:()=>{}});
  for(let key of m.marked){const [r,j]=decode(key),x=A.leafX+(j+.5)*slotW,y=A.top+r*A.gap+Math.min(17,(N===6?44:54)*.28),rr=mobile()?12:15;
   let piece=E('g',{'data-placed':key,tabindex:0,role:'button','aria-label':'Selected outcome '+pair(p,r,j)+'. Drag to another outcome or red REMOVE. Delete to remove.'},svg);
   // A luminous, fully draggable ring: original core primitive, no replacement handler.
   NOVA.neonRing(piece,x,y,{role:'result',r:rr,pulse:false});
   NOVA.ui.svgDrag(svg,piece,{box:{x:x-rr,y:y-rr,w:2*rr,h:2*rr},zones:()=>zz,removeTo:{x:A.removeX,y:A.palette},onDrop:id=>{if(!id||id==='remove')return false;m.marked.delete(key);m.marked.add(id);emit('lastMoved',id);o.changed();return true;},onRemove:()=>{m.marked.delete(key);o.changed();}});
   piece.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();m.marked.delete(key);o.changed();}});
  }
 }else{
  NOVA.neonBox(svg,A.addX-(mobile()?73:91),A.palette-26,mobile()?146:182,52,{role:'focus',r:14,text:'FIRST × SECOND',size:mobile()?15:18});
  NOVA.neonBox(svg,A.removeX-(mobile()?67:85),A.palette-26,mobile()?134:170,52,{role:'result',r:14,text:N+' × '+K+' = '+c.total,size:mobile()?19:22});
 }
 stage.appendChild(svg);
 const readouts=h('div',{class:'f176-readouts'});
 readouts.append(metric('ALL OUTCOMES',c.total,'unknown'),metric('YOUR MARKS',c.selected,'focus'));
 if(o.challenge||o.hideAnswer)readouts.append(metric('FIND CHANCE','?','result'));
 else if(o.showWinning||m.revealed){let [a,b]=reduce(c.favourable,c.total);readouts.append(metric('TRUE CHANCE',a,'result',b));}
 else readouts.append(metric('MARKED CHANCE',c.selected,'result',c.total));
 stage.append(readouts);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Hold one first outcome fixed, then list every second outcome. Never miss a branch.');
 if(o.flash)M.flash(svg,A.leafX+A.leafW*.63,A.top+(N-1)*A.gap*.55,'result',72);
 return {svg,zones,layout:A,counts:c};
}
const steps=[
{name:'Start with two events',pose:'explain',narration:'Systematic listing uses two events. Start with each result of the first event and branch out to every result of the second.',prompt:'How many results can the first event produce?'},
{name:'Keep one result fixed',pose:'point-down',narration:'Take one result of the first event. Pair it with each result of the second event before moving to the next branch.',prompt:'Which first-event result stays fixed along this branch?'},
{name:'Complete every branch',pose:'count',narration:'Visit every first-event branch, listing all second-event results. Multiplying the two counts gives the total number of ordered outcomes.',prompt:'Why do we multiply the numbers of choices?'},
{name:'Test the condition',pose:'compare',narration:'Now test each pair against the event condition. Check both parts of an AND condition or add the dice values where the question requires it.',prompt:'Is every listed result favourable?'},
{name:'Count favourable pairs',pose:'think',narration:'Find the qualifying ordered pairs. Do not omit reversed dice pairs, because a result on the first die is distinct from one on the second.',prompt:'What belongs in the numerator?'},
{name:'Write the probability',pose:'celebrate',narration:'Divide the favourable number by all equally likely outcomes. Then simplify the fraction, keeping the full systematic list as your evidence.',prompt:'How does your list prove you have not missed an outcome?'}
];
function renderStep(i,stage){let p=pget(),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("renderStep.m",(...a)=>state(...a),[]):(state())),k=clamp(i,0,5),f=wins(p),n=all(p).length;
 if(k>=3){m.marked=new Set(f.slice(0,k===3?1:f.length));m.revealed=k>=4;}
 const reveal=[0,p.second.length,n,n,n,n][k];
 render(stage,p,m,{title:steps[k].name,tag:'STEP '+(k+1)+'/6',hideAnswer:k<4,revealCount:reveal,showWinning:k>=4,pose:steps[k].pose,flash:k===5,say:[
 'Two events make a branching list. Show one family of outcomes for every first result.',
 'Finish the first branch before moving to the next: '+p.second.length+' possible endings.',
 p.first.length+' × '+p.second.length+' = '+n+' ordered outcomes, with no gaps or repeats.',
 'Read “'+p.event+'” carefully and mark only the matching pairs.',
 'There are '+f.length+' favourable results among '+n+' equally likely outcomes.',
 'The probability simplifies to '+reduce(f.length,n).join(' over ')+'. The list proves it.'
 ][k]});
}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=pget(),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("m",(...a)=>state(...a),[]):(state()));window.NovaLessonComponent?.applyExploreModels();const pres=h('select',{class:'nova-input','aria-label':'Lesson preset'}),pick=h('select',{class:'nova-input','aria-label':'Ordered outcome'}),status=h('div',{class:'f176-status',role:'status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();for(let [key,x] of Object.entries(CFG.presets))pres.append(h('option',{value:key,text:x.label}));
 window.NovaLessonComponent?.applyExploreModels();const button=(label,fn)=>h('button',{class:'nova-btn',text:label,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function repaint(){let c=counts(p,m);render(stage,p,m,{title:'List every outcome · mark the event',tag:'INTERACTIVE LIST',interact:true,toggle,changed:()=>{signal(p,m);repaint();},pose:c.complete?'celebrate':c.selected?'compare':'explain',say:c.complete?'All '+c.favourable+' favourable pairs found. Check the full list contains '+c.total+' outcomes.':c.selected?'You have '+c.selected+' marked outcomes. Finish each branch, then decide which pairs are favourable.':'Start with one first-event result. Trace across all its possible endings.'});status.textContent=c.selected+' marked · '+c.matched+' match the event · '+(c.complete?'complete event':'check for missing or extra outcomes');status.className='f176-status'+(c.complete?' good':'');}
 window.NovaLessonComponent?.applyExploreModels();function toggle(k){m.focus=k;if(m.marked.has(k))m.marked.delete(k);else m.marked.add(k);emit('outcome',k);signal(p,m);repaint();}
 window.NovaLessonComponent?.applyExploreModels();function change(k){NOVA.ui.cancelDrag();CFG.preset=k;p=pget();m=state();pres.value=k;pick.replaceChildren();all(p).forEach(k=>{let [r,c]=decode(k);pick.append(h('option',{value:k,text:pair(p,r,c)}));});emit('reset','preset');signal(p,m);repaint();}
 window.NovaLessonComponent?.applyExploreModels();const top=h('div',{class:'f176-box'},[h('label',{class:'f176-label'},['Lesson preset ',pres]),button('Clear marks',()=>{NOVA.ui.cancelDrag();m.marked.clear();m.revealed=false;emit('reset','clear');signal(p,m);repaint();}),button('Reveal event',()=>{m.marked=new Set(wins(p));m.revealed=true;signal(p,m);repaint();})]);
 window.NovaLessonComponent?.applyExploreModels();const bottom=h('div',{class:'f176-box'},[h('label',{class:'f176-label'},['Ordered outcome ',pick]),button('Mark / unmark',()=>toggle(pick.value)),button('Remove selected',()=>{m.marked.delete(pick.value);signal(p,m);repaint();})]);
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f176-info',text:'Each glowing branch shows the first result paired with every possible second result. Drag MARK onto an outcome, drag a placed ring to move it, drop onto the red REMOVE zone, or use the keyboard and selector.'}),top,bottom,status);
 window.NovaLessonComponent?.applyExploreModels();pres.onchange=()=>change(pres.value);window.NovaLessonComponent?.applyExploreModels();change(CFG.preset);window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({...counts(p,m),preset:CFG.preset,marked:[...m.marked],favourable:wins(p),probability:wins(p).length/all(p).length}),setPreset:change,toggle,clear:()=>{m.marked.clear();signal(p,m);repaint();},reveal:()=>{m.marked=new Set(wins(p));m.revealed=true;signal(p,m);repaint();}};
}
function challenge(panel,api,stage){const tasks=[
{q:'A coin and an equal three-colour spinner are used. How many ordered outcomes are possible?',build:NOVA.entryTask('Number of outcomes','F17-06'),check:v=>[v===6,v===6?'Correct: two coin branches and three endings on each.':v===5?'Two plus three is not enough; multiply the possible choices.':'List H-R, H-B, H-G, T-R, T-B, T-G.'],hint:'Hold H fixed and list all three colours, then do the same with T.'},
{q:'A coin and a fair six-sided die are used. How many pairs give Heads AND an even number?',build:NOVA.entryTask('Favourable outcomes','F17-06'),check:v=>[v===3,v===3?'Correct. H-2, H-4 and H-6 are the three favourable outcomes.':v===6?'Only the Heads branch counts, and half its dice outcomes are even.':'Hold H fixed and inspect the outcomes 1 to 6.'],hint:'List H-1 to H-6. Which dice results are even?'},
{q:'Two distinguishable fair dice are rolled. How many ordered pairs have sum 7?',build:NOVA.entryTask('Favourable ordered pairs','F17-06'),check:v=>[v===6,v===6?'Correct. There are six ordered pairs adding to seven.':v===3?'Reversed outcomes are different: (1,6) and (6,1) both count.':'Fix the first die at 1, then 2, then 3, and continue through 6.'],hint:'The first die may show any value 1 to 6, with exactly one matching second value.'},
{q:'Two fair dice are rolled. What is P(sum 7)? Enter a fraction or decimal.',build:NOVA.entryTask('Probability','F17-06'),check:v=>[Math.abs(v-1/6)<0.0001,Math.abs(v-1/6)<0.0001?'Correct: six favourable ordered pairs divided by thirty-six total outcomes.':v===6?'Six is the number of favourable pairs, not a probability.':v===7?'Seven is the target sum, not the probability.':Math.abs(v-1/12)<0.0001?'Do not leave out reversed ordered pairs. There are six.':'Count all 36 ordered pairs and then the six favourable pairs.'],hint:'Six pairs out of 36 are favourable. Simplify six over thirty-six.'}
];
 function draw(i){let p=CFG.presets[['y7','y8','y9','y9'][i]],m=state();render(stage,p,m,{title:'Challenge '+(i+1)+' · list the outcomes',tag:'TASK '+(i+1)+'/4',challenge:true,hideAnswer:true,pose:'think',say:'Build each branch systematically before calculating. Count ordered pairs exactly once.'});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-06')return;const old=stage.querySelector('.nv-dock');if(old)old.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'Exactly right. The complete branch list is your proof.':'Try fixing one first result and listing all its possible endings.');if(e.detail.correct){const svg=stage.querySelector('svg.f176-plot');if(svg)M.flash(svg,layout(pget()).W*.7,layout(pget()).top,'result',65);}});api.onCleanup(off);
}
const DEF={id:'F17-06',title:'Systematic Listing',config:CFG,steps,render:renderStep,alt:'NOVA neon systematic listing tree with branches from the first event to every second-event outcome, labelled in original NOVA Chalk with draggable outcome markers.',staticAlt:'A systematic list holds each first result fixed and pairs it with every second result once. The number of outcomes is the product of the numbers of choices.',exploreIntro:'Trace each branch, list every ordered outcome exactly once and mark the favourable combinations.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-06',DEF,{models:{"state":()=>state},tables:{"steps":()=>steps},draws:{"render":["stage","p","m","o"]},exploreFields:{"m":{"kind":"factory","factory":"state","argCount":0},"renderStep.m":{"kind":"factory","factory":"state","argCount":0}}});
NOVA.bankMount({id:'F17-06',num:'F17·06',title:'Systematic Listing',def:DEF,years:'KS3 Years 7–9; GCSE sample spaces and combined-event probability.',linked:['F0-02','F0-03','F0-04','F0-16','F17-03','F17-05','F17-07'],spec:{purpose:'Construct a complete systematic list of ordered outcomes by fixing each first event outcome and branching to all second outcomes.',params:'2 × 3, 2 × 6, and 6 × 6 independent equally likely outcomes; condition predicate; draggable markers and verified event counts.',presets:'Y7-074 Coin × three-colour spinner, Y8-070 Coin × die, Y9-043 Two fair dice.',steps:'Define two events → hold one fixed → exhaust every branch → mark event matches → count favourable pairs → express and simplify probability.',interactions:'F0 timeline and four modes; neon branches; real svgDrag marker drop, snap, re-grab, removal and keyboard equivalents; four exact mathematical challenges.',traps:'Adding possible choices rather than multiplying; skipping an ending; losing reversed outcomes; confusing sums with counts; dividing by favourable instead of all outcomes.',gcse:'Systematic listing of independent compound experiments and exact classical probability from ordered pairs.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5200);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();

