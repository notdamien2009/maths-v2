/* NOVA F17-03 Dice and Coin Simulators — F0/F2 canonical core with F17-02 capture repair */
(function(){'use strict';
const h=NOVA.h, S=NOVA.svg, E=S.el, M=NOVA.motion;
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_03_CONFIG={startMode:'watch',preset:'y7space',
 events:['value','correct','step','mode','hintUsed'],valueKeys:['preset','eventA','eventB','experiment','trials','favourable','sampleSpace','theoreticalProbability','relativeFrequency','lastOutcome','reset'],
 presets:{
  y7space:{label:'Y7-074 · Systematic sample spaces',year:7,kind:'diecoin',events:['EVEN','HEADS'],pool:['EVEN','ODD','HIGH','LOW','HEADS','TAILS'],about:'ONE DIE × ONE COIN',expected:'3 favourable of 12'},
  y7experiment:{label:'Y7-076 · Experimental probability',year:7,kind:'coin',events:['HEADS',null],pool:['HEADS','TAILS'],about:'FAIR COIN TRIALS',expected:'heads: 1 of 2'},
  y8compare:{label:'Y8-073 · Experiment vs theory',year:8,kind:'die',events:['HIGH',null],pool:['EVEN','ODD','HIGH','LOW'],about:'FAIR SIX-SIDED DIE',expected:'5 or 6: 2 of 6'},
  y9relative:{label:'Y9-046 · Relative-frequency prediction',year:9,kind:'twodice',events:['SUM7',null],pool:['SUM7','SUM8','DOUBLES','ODDSUM'],about:'TWO INDEPENDENT DICE',expected:'sum of 7: 6 of 36'}
 }});
const EVENTS={EVEN:{text:'EVEN',name:'even die number',kind:'die'},ODD:{text:'ODD',name:'odd die number',kind:'die'},HIGH:{text:'5 OR 6',name:'5 or 6 on die',kind:'die'},LOW:{text:'1 TO 3',name:'1, 2 or 3 on die',kind:'die'},HEADS:{text:'HEADS',name:'heads on coin',kind:'coin'},TAILS:{text:'TAILS',name:'tails on coin',kind:'coin'},SUM7:{text:'SUM = 7',name:'sum of seven',kind:'pair'},SUM8:{text:'SUM = 8',name:'sum of eight',kind:'pair'},DOUBLES:{text:'DOUBLES',name:'equal dice',kind:'pair'},ODDSUM:{text:'ODD SUM',name:'odd dice sum',kind:'pair'}};
const copy=v=>JSON.parse(JSON.stringify(v)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mobile=()=>innerWidth<=500,preset=()=>CFG.presets[CFG.preset]||CFG.presets.y7space;
const R=NOVA.rng.create('F17-03-dice-coin');
function outcomes(kind){let o=[];if(kind==='coin'){for(const c of ['H','T'])o.push({c});}if(kind==='die'){for(let a=1;a<=6;a++)o.push({a});}if(kind==='diecoin'){for(let a=1;a<=6;a++)for(const c of ['H','T'])o.push({a,c});}if(kind==='twodice'){for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)o.push({a,b});}return o;}
function testEvent(k,o){switch(k){case'EVEN':return o.a%2===0;case'ODD':return o.a%2===1;case'HIGH':return o.a>=5;case'LOW':return o.a<=3;case'HEADS':return o.c==='H';case'TAILS':return o.c==='T';case'SUM7':return o.a+o.b===7;case'SUM8':return o.a+o.b===8;case'DOUBLES':return o.a===o.b;case'ODDSUM':return(o.a+o.b)%2===1;default:return true;}}
function applicable(ev,kind){const k=EVENTS[ev]?.kind;return k==='die'&&['die','diecoin'].includes(kind)||k==='coin'&&['coin','diecoin'].includes(kind)||k==='pair'&&kind==='twodice';}
function slotAllowed(ev,slot,kind){if(!applicable(ev,kind))return false;if(kind==='diecoin')return slot===0?EVENTS[ev].kind==='die':EVENTS[ev].kind==='coin';if(kind==='twodice')return slot===0||slot===1;return slot===0;}
function makeModel(p){return {kind:p.kind,events:p.events.slice(),history:[],last:null,tumble:false,selected:p.pool[0]};}
function favourable(m){if(!m.events.some(Boolean))return null;return outcomes(m.kind).filter(o=>m.events.every(e=>e==null||testEvent(e,o))).length;}
function theory(m){const f=favourable(m);return f===null?null:f/outcomes(m.kind).length;}
function empirical(m){return m.history.length?m.history.filter(x=>x.win).length/m.history.length:null;}
function gcf(a,b){while(b){let t=a%b;a=b;b=t;}return a||1;}
function fmt(x){return x==null?'—':String(+x.toFixed(4));}
function emit(k,v){if(!CFG.valueKeys.includes(k))throw Error('Unknown F17-03 event '+k);NOVA.events.emit('value',{engine:'F17-03',key:k,value:v});}
function emitState(m){emit('eventA',m.events[0]);emit('eventB',m.events[1]);emit('favourable',favourable(m));emit('sampleSpace',outcomes(m.kind).length);emit('theoreticalProbability',theory(m));}
function say(p,x,y,t,role='op',size=20,anchor='middle'){return NOVA.chalkText(p,x,y,t,{role,size,anchor});}
function frac(n,d){const q=gcf(n,d),top=n/q,bot=d/q,el=h('span',{class:'f173-frac','aria-label':top+' out of '+bot});el.appendChild(h('b',{text:String(top)}));el.appendChild(h('i',{'aria-hidden':'true'}));el.appendChild(h('b',{text:String(bot)}));return el;}
function metric(label,value,role,den){const card=h('div',{class:'f173-card','data-role':role||'given'});card.appendChild(h('span',{class:'lab',text:label}));if(den!=null&&value!=null)card.appendChild(frac(value,den));else card.appendChild(h('span',{class:'val',text:String(value)}));return card;}
function L(){return mobile()?{W:390,H:690,small:true,ax:110,ay:205,az:230,bx:296,by:201,bz:186,coinR:83,tx:97,ty:492,ux:287,uy:492,paletteX:101,paletteY:600,removeX:282,removeY:600,tallyY:371}: {W:760,H:542,small:false,ax:230,ay:173,az:274,bx:545,by:173,bz:215,coinR:108,tx:176,ty:482,ux:552,uy:482,paletteX:345,paletteY:482,removeX:690,removeY:482,tallyY:366};}
function die(svg,x,y,size,value,id){const g=E('g',{'data-device':id,'aria-label':'Six-sided die shows '+value},svg),s=size/2,left=x-s/2,top=y-s/2,dx=s*.27;
 // Three luminously layered 3D faces, all made from canonical neonPath primitives.
 NOVA.neonPath(g,`M${left},${top} L${left+dx},${top-dx} L${left+s+dx},${top-dx} L${left+s},${top} Z`,{role:'unknown',fill:true,width:3.1});
 NOVA.neonPath(g,`M${left+s},${top} L${left+s+dx},${top-dx} L${left+s+dx},${top+s-dx} L${left+s},${top+s} Z`,{role:'focus',fill:true,width:3.3});
 NOVA.neonPath(g,`M${left},${top} L${left+s},${top} L${left+s},${top+s} L${left},${top+s} Z`,{role:'given',fill:true,width:4});
 // Die pip arrangements, numerically accurate from 1 through 6.
 const pip={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1]]}[value]||[[0,0]];
 for(const [px,py] of pip){let a=left+s/2+px*s*.27,b=top+s/2+py*s*.27;NOVA.neonRing(g,a,b,{role:'result',r:Math.max(6,s*.077),pulse:false});}
 return g;}
function coin(svg,x,y,r,val,id){const g=E('g',{'data-device':id,'aria-label':'Coin shows '+(val==='H'?'heads':'tails')},svg);
 const circ=(r,a)=>`M${x-r},${y} A${r},${r} 0 1 0 ${x+r},${y} A${r},${r} 0 1 0 ${x-r},${y} Z`;
 NOVA.neonPath(g,circ(r),{role:'unknown',fill:true,width:4});NOVA.neonRing(g,x,y,{role:'unknown',r:r*.84,pulse:false});
 NOVA.neonRing(g,x,y,{role:'focus',r:r*.70,pulse:false});say(g,x,y+Math.min(r*.26,23),val,'op',Math.max(43,r*.84));
 return g;}
function drawSlot(svg,x,y,id,value,interactive){const w=140,hg=55;
 let role=value?'result':'given';NOVA.neonBox(svg,x-w/2,y-hg/2,w,hg,{role,r:14,text:value?EVENTS[value].text:'DROP EVENT',size:value?18:16});
 say(svg,x,y-43,id==='s0'?'EVENT A':'EVENT B',role,18);
 if(interactive&&value){const g=E('g',{'data-slot-token':id,tabindex:'0',role:'button','aria-label':EVENTS[value].name+' assigned to event '+(id==='s0'?'A':'B')+'. Drag to another slot or REMOVE. Delete removes.'},svg);
 NOVA.neonBox(g,x-w/2+1,y-hg/2+1,w-2,hg-2,{role:'result',r:13,text:EVENTS[value].text,size:18});
 return g;}
 return null;
}
function present(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("present",arguments);}
stage.innerHTML='';const A=L(),pair=['diecoin','twodice'].includes(m.kind);
 NOVA.cap(stage,'Dice & Coin Lab · '+(o.title||p.about.toLowerCase()),o.tag||'LIVE');
 const svg=S.root(A.W,A.H,'Premium NOVA neon 3D dice and coin probability apparatus, two event regions, recent trial outcomes and a tally of successes.');svg.classList.add('f173-plot');svg.setAttribute('data-engine-plot','F17-03');
 let v=m.last?.out|| (m.kind==='coin'?{c:'H'}:m.kind==='die'?{a:5}:m.kind==='diecoin'?{a:4,c:'H'}:{a:3,b:4});
 const leftCoin=m.kind==='coin';const single=!pair;
 const xA=single?(A.small?195:265):A.ax, yA=A.ay;
 const xB=A.bx,yB=A.by;
 let ga=leftCoin?coin(svg,xA,yA,A.small?111:129,v.c,'coin-a'):die(svg,xA,yA,single?(A.small?300:312):A.az,v.a||4,'die-a');
 let gb=null;
 if(pair)gb=m.kind==='diecoin'?coin(svg,xB,yB,A.coinR,v.c||'H','coin-b'):die(svg,xB,yB,A.bz,v.b||2,'die-b');
 else if(!A.small) {say(svg,577,210,'FAIR '+(leftCoin?'COIN':'DIE'),'unknown',23);say(svg,567,245,leftCoin?'H or T':'1 to 6','op',24);say(svg,567,280,'equally likely','given',20);}
 if(pair){say(svg,xA,A.small?327:325,'A · '+(m.kind==='twodice'?'DIE 1':'DIE'),'op',A.small?18:21);say(svg,xB,A.small?316:322,'B · '+(m.kind==='twodice'?'DIE 2':'COIN'),'op',A.small?18:21);}
 let wins=m.history.filter(x=>x.win).length,total=m.history.length;
 say(svg,A.small?195:380,A.tallyY-24,'RESULT TALLY','given',A.small?17:20);
 const recent=m.history.slice(-10),spacing=A.small?30:37,base=A.W/2-(9*spacing)/2;
 for(let i=0;i<10;i++){
   const x=base+i*spacing,y=A.tallyY+9,pv=recent[i];
   NOVA.neonRing(svg,x,y,{role:pv==null?'given':pv.win?'result':'unknown',r:A.small?8:10,pulse:false});
   if(pv!=null){say(svg,x,y+28,pv.win?'W':'×',pv.win?'result':'unknown',A.small?14:16);}
 }
 if(!A.small){say(svg,380,412,total?'Wins '+wins+' in '+total+' trials':'Start a run to record the outcomes','result',19);}
 const interactive=!!o.interact,slotAX=single&&A.small?195:A.tx, slots=[{x:slotAX,y:A.ty,w:146,h:60,id:'s0',kind:'drop'},{x:A.ux,y:A.uy,w:146,h:60,id:'s1',kind:'drop'}];
 const validZone=slot=>{if(m.kind==='diecoin')return true;return slot.id==='s0';};
 const tray={x:A.removeX-65,y:A.removeY-25,w:130,h:53,id:'remove',kind:'remove'};
 const redraw=()=>o.onChange?.();
 const tokens=[];
 m.events.forEach((ev,j)=>{
   if(j===1&&!pair)return;
   const sx=j===0?slotAX:A.ux,sy=j===0?A.ty:A.uy,g=drawSlot(svg,sx,sy,'s'+j,ev,interactive);
   if(g)tokens.push({g,j,x:sx,y:sy,ev});
 });
 if(m.kind==='diecoin'&&interactive){say(svg,A.tx,A.ty+49,'DIE RULE','given',15);say(svg,A.ux,A.uy+49,'COIN RULE','given',15);}
 if(m.kind==='twodice'&&interactive){say(svg,A.tx,A.ty+49,'TWO DICE','given',15);}
 if(interactive){
   const px=A.paletteX,py=A.paletteY,g=E('g',{'data-palette':'1',role:'button',tabindex:'0','aria-label':'Selected event rule. Drag into a compatible event target or use keyboard controls below.'},svg);
   NOVA.neonBox(g,px-66,py-25,132,50,{role:'result',r:13,text:'+'+EVENTS[m.selected].text,size:16});
   const allowed=[...slots.filter(z=>z.id==='s0'||pair&&z.id==='s1'),tray];
   const boxFor=(x,y)=>({x:x-65,y:y-26,w:130,h:52});
   NOVA.ui.svgDrag(svg,g,{box:boxFor(px,py),zones:()=>allowed,removeTo:{x:A.removeX,y:A.removeY},onDrop:id=>{
     const j=id==='s0'?0:1;if(!slotAllowed(m.selected,j,m.kind))return false;m.events[j]=m.selected;redraw();return true;},onRemove:()=>{}});
   tokens.forEach(t=>{
     NOVA.ui.svgDrag(svg,t.g,{box:boxFor(t.x,t.y),zones:()=>allowed,removeTo:{x:A.removeX,y:A.removeY},onDrop:id=>{
       const j=id==='s0'?0:1;if(!slotAllowed(t.ev,j,m.kind))return false;
       if(j!==t.j){m.events[t.j]=null;m.events[j]=t.ev;}redraw();return true;},onRemove:()=>{m.events[t.j]=null;redraw();}});
     t.g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();m.events[t.j]=null;redraw();}});
   });
   NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'error',r:12,text:'REMOVE',size:17});
   if(!A.small){say(svg,A.paletteX,A.paletteY-39,'DRAG EVENT','given',16);}
   /* Compact mobile stage leaves the palette labelled by its own glowing event name. */
 }
 if(o.flash)M.flash(svg,xA,yA,'result',55);
 stage.appendChild(svg);
 const f=favourable(m),space=outcomes(m.kind).length,rd=h('div',{class:'f173-readouts'});
 rd.appendChild(metric('FAVOURABLE',f, 'result',f==null?null:space));
 rd.appendChild(metric('THEORETICAL',fmt(theory(m)),'unknown'));
 rd.appendChild(metric('EXPERIMENTAL',fmt(empirical(m)),'focus'));
 stage.appendChild(rd);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'List all equally likely outcomes first. Then count the favourable outcomes.');
 return {svg,ga,gb,A,slots,tray};
}
const steps=[
{name:'Meet the apparatus',pose:'explain',mood:'neutral',narration:'A fair die has six equally likely faces and a fair coin has two equally likely sides. Our apparatus shows these outcomes clearly.',prompt:'How many different faces can this die show?'},
{name:'List possible outcomes',pose:'count',mood:'focus',narration:'For a die and a coin, pair each of the six die numbers with heads and tails. That makes twelve equally likely pairs.',prompt:'Can you list the twelve outcomes without missing a pair?'},
{name:'Choose a favourable event',pose:'point-down',mood:'focus',narration:'An even number occurs on three faces. Heads occurs on one coin side. Three of the twelve pairs are favourable.',prompt:'Why are there three favourable pairs, not six?'},
{name:'Observe one trial',pose:'think',mood:'focus',narration:'A trial gives one result. A fair apparatus does not guarantee that a favourable event happens in any particular trial.',prompt:'Can you predict the next die and coin result with certainty?'},
{name:'Collect the results',pose:'compare',mood:'focus',narration:'Count the favourable outcomes actually observed, and divide by the number of trials. This is experimental relative frequency.',prompt:'Why may observed frequency differ from theoretical probability?'},
{name:'Compare and predict',pose:'celebrate',mood:'cheer',narration:'Theoretical probability comes from all equally likely outcomes, while relative frequency comes from trials. Use larger experiments to investigate the difference.',prompt:'Which measurement should stay fixed as you run more trials?'}];
function drawStep(i,stage){let p=preset(),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("drawStep.m",(...a)=>makeModel(...a),[p]):(makeModel(p))),n=clamp(i,0,steps.length-1),s=steps[n],speech=[
 'Look closely: both the die and coin are fair.',
 'Six die faces and two coin sides make twelve pairs.',
 'Even AND heads gives three favourable pairs.',
 'One result is evidence, but not a guarantee.',
 'The tally records what actually happened.',
 'The theoretical chance stays fixed as trials grow.' ];
 if(n===0){m.events=[null,null];}
 if(n===1)m.events=[null,null];
 if(n===3){m.last={out:m.kind==='coin'?{c:'H'}:m.kind==='die'?{a:6}:m.kind==='diecoin'?{a:4,c:'T'}:{a:3,b:4},win:false};}
 if(n>=4){const pool=outcomes(p.kind),sample=[...pool,...pool].slice(0,14);m.history=sample.map((out,k)=>({out,win:m.events.some(Boolean)&&m.events.every(e=>!e||testEvent(e,out))}));m.last=m.history.at(-1);}
 const o=present(stage,p,m,{title:s.name,tag:'STEP '+(n+1)+'/6',pose:s.pose,say:speech[n],flash:n===3});
 if(n===3){const dx=o.A.small?o.A.ax:o.A.ax;M.flash(o.svg,dx,o.A.ay,'unknown',55);if(!NOVA.reducedMotion())M.tween(850,t=>{const q=Math.sin(t*Math.PI*8)*(1-t);o.ga.setAttribute('transform','rotate('+(q*14).toFixed(2)+' '+o.A.ax+' '+o.A.ay+')');if(o.gb)o.gb.setAttribute('transform','rotate('+(-q*14).toFixed(2)+' '+o.A.bx+' '+o.A.by+')');},M.ease.inOut,()=>{o.ga.removeAttribute('transform');o.gb?.removeAttribute('transform');});}
}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=preset(),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("m",(...a)=>makeModel(...a),[p]):(makeModel(p))),animation=null;
 window.NovaLessonComponent?.applyExploreModels();const btn=(txt,fn,cls='nova-btn')=>h('button',{class:cls,text:txt,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();const pres=h('select',{class:'nova-input','aria-label':'Lesson preset'}),eventSel=h('select',{class:'nova-input','aria-label':'Event token'}),slotSel=h('select',{class:'nova-input','aria-label':'Event target'}),status=h('div',{class:'f173-status',role:'status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();Object.entries(CFG.presets).forEach(([k,v])=>pres.appendChild(h('option',{value:k,text:v.label})));
 window.NovaLessonComponent?.applyExploreModels();const row1=h('div',{class:'f173-box'}),row2=h('div',{class:'f173-box'}),row3=h('div',{class:'f173-box'});
 window.NovaLessonComponent?.applyExploreModels();function choices(){let old=eventSel.value;eventSel.innerHTML='';p.pool.forEach(v=>eventSel.appendChild(h('option',{value:v,text:EVENTS[v].name})));eventSel.value=p.pool.includes(old)?old:p.pool[0];m.selected=eventSel.value;
  const olds=slotSel.value;slotSel.innerHTML='';slotSel.appendChild(h('option',{value:'0',text:'Event A'}));if(['diecoin','twodice'].includes(p.kind))slotSel.appendChild(h('option',{value:'1',text:'Event B'}));slotSel.value=olds==='1'&&slotSel.options.length>1?'1':'0';}
 window.NovaLessonComponent?.applyExploreModels();function redraw(flash){const a=present(stage,p,m,{title:'edit event rules · simulate outcomes',tag:'DRAG + SNAP',interact:true,flash,pose:m.last?.win?'celebrate':'compare',say:m.last?.win?'That trial met the event rule. Try more trials and compare.':m.history.length?'The tally is experimental evidence. The theoretical probability is fixed by the model.':'Drag the selected rule into a valid event region. Re-grab, move or remove it.' ,onChange:()=>{m.history=[];m.last=null;emit('reset','event changed');emitState(m);redraw();}});
  status.textContent='Outcomes '+outcomes(m.kind).length+' · Favourable '+(favourable(m)??'choose an event')+' · Trials '+m.history.length+' · Wins '+m.history.filter(x=>x.win).length;
  status.className='f173-status'+(m.last?.win?' good':'');return a;}
 window.NovaLessonComponent?.applyExploreModels();function stopSpin(){if(animation&&animation.stop)animation.stop();animation=null;m.tumble=false;}
 window.NovaLessonComponent?.applyExploreModels();function setPreset(k){stopSpin();CFG.preset=k;p=preset();m=makeModel(p);pres.value=k;choices();emit('preset',k);emit('experiment',p.kind);emitState(m);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function assign(){let v=eventSel.value,j=+slotSel.value;if(!slotAllowed(v,j,m.kind)){status.textContent='This event does not match that apparatus or slot.';return false;}m.events[j]=v;m.history=[];m.last=null;emit('reset','event changed');emitState(m);redraw();return true;}
 window.NovaLessonComponent?.applyExploreModels();function remove(){m.events[+slotSel.value]=null;m.history=[];m.last=null;emit('reset','event changed');emitState(m);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function sample(){const c=Math.floor(R.next()*2),a=1+Math.floor(R.next()*6),b=1+Math.floor(R.next()*6);if(m.kind==='coin')return{c:c?'H':'T'};if(m.kind==='die')return{a};if(m.kind==='diecoin')return{a,c:c?'H':'T'};return{a,b};}
 window.NovaLessonComponent?.applyExploreModels();function run(n){if(m.tumble)return;if(!m.events.some(Boolean)){status.textContent='Choose a favourable event before running trials.';return;}
  const data=Array.from({length:n},()=>{const out=sample();return {out,win:m.events.every(e=>!e||testEvent(e,out))};});
  const before=m.last?.out||{a:1,b:3,c:'H'},first=stage.querySelector('[data-device]'),second=stage.querySelectorAll('[data-device]')[1],start=Date.now();
  function finish(){m.history.push(...data);m.last=data.at(-1);m.tumble=false;animation=null;emit('trials',m.history.length);emit('lastOutcome',m.last.out);emit('relativeFrequency',empirical(m));const scene=redraw(m.last.win);M.flash(scene.svg,scene.A.small?scene.A.ax:scene.A.ax,scene.A.ay,m.last.win?'result':'unknown',49);}
  m.tumble=true;const rm=NOVA.reducedMotion();if(rm){finish();return;}
  animation=M.tween(n===1?1040:650,e=>{
    const q=Math.sin(e*Math.PI*9)*(1-e),rot=q*18,scale=1+Math.abs(q)*.12;
    if(first)first.setAttribute('transform','translate('+((1-scale)* (L().ax||200)).toFixed(2)+' '+((1-scale)*(L().ay||200)).toFixed(2)+') rotate('+rot.toFixed(2)+' '+(L().ax||200)+' '+(L().ay||200)+') scale('+scale.toFixed(3)+')');
    if(second)second.setAttribute('transform','rotate('+(-rot).toFixed(2)+' '+L().bx+' '+L().by+')');
  },M.ease.inOut,finish);
 }
 window.NovaLessonComponent?.applyExploreModels();pres.onchange=()=>setPreset(pres.value);window.NovaLessonComponent?.applyExploreModels();eventSel.onchange=()=>{m.selected=eventSel.value;redraw();};
 window.NovaLessonComponent?.applyExploreModels();row1.appendChild(h('label',{class:'f173-label'},['Lesson preset ',pres]));window.NovaLessonComponent?.applyExploreModels();row2.appendChild(eventSel);window.NovaLessonComponent?.applyExploreModels();row2.appendChild(slotSel);window.NovaLessonComponent?.applyExploreModels();row2.appendChild(btn('Place event',assign));window.NovaLessonComponent?.applyExploreModels();row2.appendChild(btn('Remove event',remove));
 window.NovaLessonComponent?.applyExploreModels();row3.appendChild(btn('Run 1 trial',()=>run(1)));window.NovaLessonComponent?.applyExploreModels();row3.appendChild(btn('Run 20 trials',()=>run(20)));window.NovaLessonComponent?.applyExploreModels();row3.appendChild(btn('Run 100 trials',()=>run(100)));window.NovaLessonComponent?.applyExploreModels();row3.appendChild(btn('Clear trials',()=>{stopSpin();m.history=[];m.last=null;emit('reset','trials');redraw();}));window.NovaLessonComponent?.applyExploreModels();row3.appendChild(btn('Reset model',()=>setPreset(CFG.preset)));
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row1);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('p',{class:'f173-info',text:'Choose an event rule. Drag the glowing event tile into EVENT A or B, move a placed event, or drag it into the red REMOVE tray. The controls provide a keyboard alternative.'}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row2);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row3);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);
 window.NovaLessonComponent?.applyExploreModels();choices();window.NovaLessonComponent?.applyExploreModels();pres.value=CFG.preset;window.NovaLessonComponent?.applyExploreModels();emitState(m);window.NovaLessonComponent?.applyExploreModels();redraw();
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,model:copy(m),favourable:favourable(m),space:outcomes(m.kind).length,theoretical:theory(m),relativeFrequency:empirical(m)}),setPreset,choose:k=>{if(p.pool.includes(k)){eventSel.value=k;eventSel.onchange();}},assign:(k,j)=>{if(!slotAllowed(k,j,m.kind))return false;m.events[j]=k;m.history=[];m.last=null;emit('reset','event changed');emitState(m);redraw();return true;},run,reset:()=>setPreset(CFG.preset)};
 window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>{stopSpin();NOVA.ui.cancelDrag();});
}
function challenge(panel,api,stage){let index=0;
 const tasks=[
  {q:'A six-sided die is rolled and a fair coin is tossed. How many different equally likely outcome PAIRS are possible?',build:NOVA.entryTask('Number of pairs','F17-03'),check:v=>[v===12,v===12?'Correct. Six die faces each pair with two coin sides: 6 × 2 = 12.':v===8?'Adding six and two misses the pairings. Multiply the number of choices.':v===6?'You counted the die faces but forgot the two coin outcomes.':'Pair every die face with both heads and tails.'],hint:'Write (1,H), (1,T), (2,H), (2,T), and continue to six.',solve:c=>c.querySelector('input')&&(c.querySelector('input').value='12')},
  {q:'In 40 fair coin tosses, heads occurred 14 times. Enter the EXPERIMENTAL relative frequency as a decimal.',build:NOVA.entryTask('Experimental relative frequency','F17-03'),check:v=>[Math.abs(v-.35)<1e-8,v===.5?'One half is the theoretical probability, not the experimental result from this experiment.':Math.abs(v-.35)<1e-8?'Correct. 14 ÷ 40 is 0.35.':'Divide the observed heads count, 14, by all 40 trials.'],hint:'Relative frequency = favourable observations ÷ total observations.',solve:c=>c.querySelector('input')&&(c.querySelector('input').value='.35')},
  {q:'A fair die has six faces. How many faces meet the rule “5 or 6”?',build:NOVA.choiceTask([{label:'1 face',value:'1'},{label:'2 faces',value:'2'},{label:'3 faces',value:'3'},{label:'5 faces',value:'5'}],'F17-03'),check:v=>[v==='2',v==='2'?'Correct. Exactly faces five and six meet the condition.':'Count only faces five and six; the die still has six equally likely faces.'],hint:'Count the numbers in this set: {5, 6}.',solve:c=>c.querySelector('button')?.click()},
  {q:'Two fair dice are rolled. Out of all 36 ordered pairs, how many have a sum of exactly 7?',build:NOVA.entryTask('Favourable ordered pairs','F17-03'),check:v=>[v===6,v===6?'Correct: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). The probability is one sixth.':v===3?'Ordered pairs are distinct. Include both (1,6) and (6,1).':v===7?'Seven is the target sum, not the number of favourable pairs.':'List the ordered pairs systematically from (1,6) to (6,1).'],hint:'Start with (1,6), then increase the first die by one while decreasing the second.',solve:c=>c.querySelector('input')&&(c.querySelector('input').value='6')}
 ];
 function draw(i){index=i;let keys=['y7space','y7experiment','y8compare','y9relative'],p=CFG.presets[keys[i]],m=makeModel(p);
  if(i===1){const out=Array.from({length:40},(_,j)=>({c:j<14?'H':'T'}));m.history=out.map(o=>({out:o,win:o.c==='H'}));m.last=m.history.at(-1);} 
  present(stage,p,m,{title:'challenge '+(i+1)+' · reason and calculate',tag:'TASK '+(i+1)+'/4',pose:'think',say:['Pair each die face with both coin sides.','The result of this experiment may differ from theory.','Count only the favourable die faces.','List ordered pairs without missing the reverse orders.'][i]});
 }
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 const off=NOVA.events.on('correct',e=>{const d=e.detail||{};if(d.engine!=='F17-03')return;const dock=stage.querySelector('.nv-dock');if(dock)dock.remove();NOVA.scene.helperStrip(stage,d.correct?'celebrate':'not-yet',d.correct?'Exactly. Your sample-space reasoning is correct.':'Look again at whether the question asks for pairs, theoretical chance, or observed frequency.');if(d.correct){const svg=stage.querySelector('svg.f173-plot');if(svg){let t=L();M.flash(svg,t.ax,t.ay,'result',50);}}});api.onCleanup(off);
}
const DEF={id:'F17-03',title:'Dice and Coin Simulators',config:CFG,steps,render:drawStep,
 alt:'Interactive premium NOVA neon three-dimensional fair dice and coins, complete sample-space theoretical calculations, tally of trial successes and draggable event conditions.',
 staticAlt:'A fair die and coin have 12 equally likely pairs; die even with coin heads gives 3 favourable pairs out of 12. One fair die has six outcomes, two independent dice have 36 ordered pairs; six pairs have a sum of seven.',
 exploreIntro:'Choose the lesson experiment; drag conditions into event regions; run trials and compare observed relative frequency with theoretical probability.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-03',DEF,{models:{},tables:{"steps":()=>steps},draws:{"present":["stage","p","m","o"]},exploreFields:{"m":{"kind":"factory","factory":"makeModel","argCount":1},"drawStep.m":{"kind":"factory","factory":"makeModel","argCount":1}}});
NOVA.bankMount({id:'F17-03',num:'F17·03',title:'Dice and Coin Simulators',def:DEF,
 years:'KS3 Years 7, 8, 9; GCSE probability, sample space and relative frequency.',linked:['F0-02','F0-03','F0-04','F0-06','F17-01','F17-02','F17-04','F17-05','F17-07'],
 spec:{purpose:'Model equiprobable coin and dice outcomes, systematically list sample spaces, assign event conditions and compare experimental relative frequency with theoretical probability.',
 params:'Fair coin H/T, fair six-faced dice, one die plus one coin (12 ordered pairs), two dice (36 ordered pairs), optional favourable event conditions, trial count and seeded randomiser.',
 presets:'Y7-074 die + coin even AND heads (3/12); Y7-076 coin heads (1/2); Y8-073 die 5 or 6 (2/6); Y9-046 two dice sum 7 (6/36).',
 steps:'Meet apparatus → list outcomes → choose event → observe trial → collect result tally → compare prediction. Sir Bob narration slots on all steps.',
 interactions:'Watch and Guided timeline; Explore drag/re-grab event tiles, green valid snap and red remove, keyboard event assignment, run 1/20/100, reset, inspect theory and observations. Four Challenge checks.',
 traps:'Add instead of multiply number of combined outcomes, confuse trial results with theoretical chance, count die outcomes incorrectly, fail to distinguish ordered pairs, mistake target sum for favourable outcome count.',
 gcse:'Independent events and expected relative frequency; unbiased simulation and exhaustive ordered outcomes.'}});
const log=document.getElementById('log');if(log){let append=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5500);};NOVA.events.history().forEach(append);NOVA.events.on('*',append);document.getElementById('clearlog')?.addEventListener('click',()=>{log.textContent='';});}
})();
