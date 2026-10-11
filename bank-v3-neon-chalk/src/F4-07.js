/* NOVA F4-07 · Ratio Bar · Run 07 · uses unchanged F0 shared helpers and F2 svgDrag. */
const F407_CONFIG={id:'F4-07',startMode:'watch',preset:'Y7-059',
 parameters:{maximumUnitCount:10,maxRatioTerm:10,precision:3},
 presets:{
  'Y7-058':{a:6,b:9,total:null,mode:'simplify',label:'Year 7 · simplify 6 : 9',context:'Six to nine has a common factor of three. What equal-unit comparison is simplest?',names:['Blue','Violet']},
  'Y7-059':{a:2,b:3,total:60,mode:'share',label:'Year 7 · £60 shared 2 : 3',context:'Divide sixty pounds in the ratio two to three.',names:['Ava','Izaac']},
  'Y8-034':{a:1.5,b:2.5,total:64,mode:'share',label:'Year 8 · 1.5 : 2.5 of £64',context:'Turn the decimal ratio into whole-number equal units, then share sixty-four pounds.',names:['Group A','Group B']}
 },
 challenge:[
  {a:6,b:9,total:null,mode:'simplify',label:'Simplify 6 : 9',context:'Build the smallest whole-number ratio equal to 6 : 9, then write it as a ratio.',names:['A','B']},
  {a:2,b:3,total:60,mode:'share',label:'Share £60 in 2 : 3',context:'Build 2 and 3 units. Find the value of ONE unit, then both shares.',names:['Ava','Izaac']},
  {a:1.5,b:2.5,total:64,mode:'share',label:'Share £64 in 1.5 : 2.5',context:'Convert the decimal parts into equal integer units, then share £64 accurately.',names:['Group A','Group B']}
 ],
 events:{value:['preset','ratio','unit','added','moved','removed','check','answer','reset','reveal'],types:['step','correct','hintUsed','mode']}
}; window.F407_CONFIG=F407_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F407_CONFIG,ID=C.id;
function gcd(a,b){a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b){let t=b;b=a%b;a=t;}return a||1;}
function ratio(a,b){if(!Number.isFinite(a)||!Number.isFinite(b)||a<=0||b<=0)throw Error('Ratio terms must be positive');
 let p=Math.max(0,...[a,b].map(v=>((String(v).split('.')[1]||'').length)));if(p>3)throw Error('At most three decimal places');const scale=10**p,A=Math.round(a*scale),B=Math.round(b*scale),d=gcd(A,B);return [A/d,B/d];}
function totals(o){const [a,b]=ratio(o.a,o.b),count=a+b,unit=o.total==null?null:o.total/count;return {a,b,count,unit,A:unit==null?null:a*unit,B:unit==null?null:b*unit};}
function correctMath(o,ans){const r=totals(o),eq=(x,y)=>Number.isFinite(Number(x))&&Math.abs(Number(x)-y)<1e-8;
 if(!eq(ans.a,r.a)||!eq(ans.b,r.b))return {ok:false,message:'The bars must show the simplest whole-number ratio. Divide both original terms by the SAME factor.'};
 if(!ans.built||ans.built[0]!==r.a||ans.built[1]!==r.b)return {ok:false,message:'Build both bars from equal units: '+r.a+' in the first, '+r.b+' in the second.'};
 if(o.total!=null){if(!eq(ans.unit,r.unit))return {ok:false,message:'Count ALL '+r.count+' equal units. One unit = total ÷ '+r.count+'.'};
   if(!ans.unitPlaced)return {ok:false,message:'Your unit value is correct. Place its chip on one equal unit to prove what each tile represents.'};
   if(!eq(ans.shareA,r.A)||!eq(ans.shareB,r.B))return {ok:false,message:'Each share is its number of equal units multiplied by the ONE-unit value.'};
   if(Math.abs(r.A+r.B-o.total)>1e-8)return {ok:false,message:'The two shares must add back to the total.'};}
 return {ok:true,message:o.total==null?`Correct. ${o.a} : ${o.b} simplifies to ${r.a} : ${r.b}.`:`Correct. ${r.count} equal units, ${money(r.unit)} each; ${money(r.A)} + ${money(r.B)} = ${money(o.total)}.`};}
function money(n){return '£'+(Math.round((n+Number.EPSILON)*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});}
function ev(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' event: '+key);N.events.emit('value',{engine:ID,key,value});}
const btn=(txt,fn,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text:txt,onclick:fn});
function chalk(p,x,y,s,size=36,role='given'){return N.chalkText(p,x,y,String(s),{role,size:innerWidth<=600?Math.round(size*1.20):size});}
const STATES={start:['explain','Compare the units!'],a:['count','Build the first bar!'],b:['show-two','Match unit sizes!'],total:['count','Count ALL the parts!'],unit:['idea','One part first!'],shares:['point','Build the shares!'],compare:['compare','Same relationship!'],done:['celebrate','You proved it!'],explore:['point','Try the units!'],wrong:['not-yet','Check your units!'],ready:['think','Your turn!'],hint:['idea','Find one unit!'],remove:['oops','Try again!'],placed:['point-down','Value in place!']};
function helper(stage,state){const x=STATES[state]||STATES.ready;N.scene.helperStrip(stage,x[0],x[1]);}
function card(head,val,note,role='given'){return N.neonCard([H('p',{class:'f407-card-label',text:head}),H('p',{class:'f407-card-number',text:val}),H('p',{class:'f407-card-note',text:note})],{role});}
function configFor(o){const {a,b}=totals(o);return {w:1000,h:902,x:168,yA:232,yB:438,cellH:115,cellGap:5,unitW:Math.min(184,750/Math.max(4,a,b)),max:Math.max(4,a,b),trayY:721,showY:650};}
function rounded(n){return Math.round((n+Number.EPSILON)*1000)/1000;}
function stageGraphic(o,v){if(v.won)v={...v,step:7};const r=totals(o),g=configFor(o),view=N.svg.root(g.w,g.h,'Two neon glass ratio bars, with matching equal-width units and a total-unit brace. Drag equal tiles from the tray into either bar and return them to remove.');
 view.classList.add('f407-svg');view.dataset.countA=String(v.countA??0);view.dataset.countB=String(v.countB??0);view.dataset.placed=String(!!v.unitPlaced);view.dataset.mode=v.task?'challenge':v.interactive?'explore':'watch';
 const displayed=[Math.max(0,Math.min(C.parameters.maximumUnitCount,v.countA??r.a)),Math.max(0,Math.min(C.parameters.maximumUnitCount,v.countB??r.b))],maxN=Math.max(g.max,...displayed,4),unitW=Math.min(184,760/maxN),x=g.x,ys=[g.yA,g.yB],names=o.names||['Part A','Part B'];
 chalk(view,500,68,v.task?'BUILD THE EQUAL UNITS':'RATIO BARS · SAME SIZE UNIT',45,'given');
 chalk(view,500,125,v.task?(o.total==null?'Simplify the relationship':`Total = ${money(o.total)}`):`${o.a} : ${o.b}${o.total!=null?'  ·  '+money(o.total)+' total':''}`,43,'focus');
 // Both bar tracks are identical in unit size. Gold dashed cells show remaining possible construction positions, not answers.
 for(let row=0;row<2;row++){
  const y=ys[row],actual=displayed[row],showLabel=!v.task||v.won;
  chalk(view,68,y+71,names[row],35,'given');
  const cells=v.interactive?Math.min(C.parameters.maximumUnitCount,Math.max(actual+1,r.a,r.b,4)):actual;
  for(let i=0;i<cells;i++){
   const box={x:x+i*unitW,y,w:unitW-g.cellGap,h:g.cellH};
   if(i<actual){const role=row===0?'given':'focus',group=E('g',{class:'f407-unit',tabindex:v.interactive?'0':undefined,role:v.interactive?'button':undefined,'aria-label':`Unit ${i+1} in ${names[row]}. Press Delete to remove or Arrow${row===0?'Down':'Up'} to transfer.`,'data-row':String(row)},view);
    N.neonBox(group,box.x,box.y,box.w,box.h,{role,r:11});chalk(group,box.x+box.w/2,box.y+69,(v.unitPlaced&&row===0&&i===0&&o.total!=null)?money(Number(v.rawUnit)):(!v.task||v.won)?'1':'•',v.unitPlaced&&row===0&&i===0?38:42,role);
    if(v.interactive&&v.onTransfer){
      const opposite={id:'move:'+String(1-row),kind:'drop',x,y:ys[1-row]-18,w:unitW*Math.max(4,cells),h:g.cellH+36},remove={id:'remove',kind:'remove',x:690,y:g.trayY,w:195,h:95};
      draggable(view,group,{box,zones:()=>[opposite,remove],onDrop:id=>{if(!id.startsWith('move:'))return false;Promise.resolve().then(()=>v.onTransfer(row,1-row));return true;},onRemove:()=>v.onRemove(row),removeTo:{x:remove.x+90,y:remove.y+40}});
      group.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();v.onRemove(row);}if((row===0&&e.key==='ArrowDown')||(row===1&&e.key==='ArrowUp')){e.preventDefault();v.onTransfer(row,1-row);}});
    }
   }else if(v.interactive){N.neonBox(view,box.x+6,box.y+9,box.w-12,box.h-18,{role:'unknown',r:8});}
  }
  const extent=Math.max(unitW,actual*unitW);
  N.neonLine(view,x,ys[row]+g.cellH+18,x+extent,ys[row]+g.cellH+18,{role:row===0?'given':'focus',width:2.8});
  N.neonLine(view,x,ys[row]+g.cellH+8,x,ys[row]+g.cellH+28,{role:'given',width:2.5});
  N.neonLine(view,x+extent,ys[row]+g.cellH+8,x+extent,ys[row]+g.cellH+28,{role:'given',width:2.5});
  if(!v.task||v.won){chalk(view,x+Math.max(unitW,actual*unitW)/2,y-13,actual+' units',35,row===0?'given':'focus');}
 }
 const visibleTotal=(v.interactive?v.countA+v.countB:displayed[0]+displayed[1]),braceY=617,barEnd=x+Math.max(displayed[0],displayed[1],1)*unitW;
 N.neonPath(view,`M${x},${braceY-15} v15 h${barEnd-x} v-15`,{role:'op',width:3.3});
 if(v.interactive||v.step>=3)chalk(view,500,braceY+44,`TOTAL: ${visibleTotal} EQUAL UNIT${visibleTotal===1?'':'S'}`,37,'op');
 // In Challenge, unit size and shares remain unknown until the student demonstrates the work.
 if(o.total!=null&&!v.interactive&&v.step>=4){const safeUnit=v.unitPlaced&&Number.isFinite(Number(v.rawUnit))?Number(v.rawUnit):r.unit;
   chalk(view,500,715,`ONE UNIT = ${money(safeUnit)}`,39,'result');
 }
 if(v.interactive){
   for(let i=0;i<2;i++){
     const xx=i===0?180:400,rr=i===0?'given':'focus';const tile=E('g',{class:'f407-source','data-kind':'add',tabindex:0,role:'button','aria-label':`Drag a new unit tile to ${names[i]} or press Enter to add a unit.`},view);
     N.neonBox(tile,xx,g.trayY,184,86,{role:rr,r:12});chalk(tile,xx+92,g.trayY+54,`+ ${names[i]}`,35,rr);
     draggable(view,tile,{box:{x:xx,y:g.trayY,w:184,h:86},zones:()=>[{id:'add:'+i,kind:'drop',x,y:ys[i]-20,w:Math.max(600,unitW*maxN),h:156}],onDrop:id=>{if(id!=='add:'+i)return false;Promise.resolve().then(()=>v.onAdd(i));return true;}});
     tile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();v.onAdd(i);}});
   }
   const zone={x:690,y:g.trayY,w:195,h:95};N.neonBox(view,zone.x,zone.y,zone.w,zone.h,{role:'error',r:13});chalk(view,zone.x+zone.w/2,zone.y+59,'RETURN',35,'error');
   if(o.total!=null&&v.rawUnit!==''&&!v.unitPlaced){const bx=365,by=819,chip=E('g',{class:'f407-valuechip',tabindex:0,role:'button','aria-label':'Drag one-unit value to a bar or press Enter to place'},view);
    N.neonBox(chip,bx,by,262,73,{role:'op',r:12});chalk(chip,bx+131,by+50,`UNIT ${money(Number(v.rawUnit))}`,34,'op');
    draggable(view,chip,{box:{x:bx,y:by,w:262,h:73},zones:()=>[{id:'unit',kind:'drop',x,y:ys[0],w:unitW*Math.max(4,displayed[0]),h:g.cellH}],onDrop:id=>{if(id!=='unit')return false;Promise.resolve().then(()=>v.onPlace());return true;}});
    chip.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();v.onPlace();}});
   }
  }else{
   chalk(view,500,798,v.step>=5&&o.total!=null?`${money(r.A)} + ${money(r.B)} = ${money(o.total)}`:'EQUAL PARTS · MULTIPLICATIVE RELATIONSHIP',37,v.step>=5?'result':'given');
   chalk(view,500,868,v.step>=7?`${r.a*2} : ${r.b*2} = ${r.a} : ${r.b}`:v.step>=6?'THE TWO SHARES ADD TO THE WHOLE':'SAME-SIZED UNIT IN BOTH BARS',35,v.step>=6?'result':'given');
  }
 return view;
}
function draggable(svg,el,o){N.ui.svgDrag(svg,el,o);el.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});}
function present(stage,o,v){stage.innerHTML='';const r=totals(o);
 N.cap(stage,'Ratio Bar',v.task?'CHALLENGE':v.interactive?'BUILD & COMPARE':v.heading||'Equal units · one whole relationship');
 const lay=H('div',{class:'f407-layout'}),art=H('div',{class:'f407-apparatus'}),aside=H('div',{class:'f407-side'});
 art.append(stageGraphic(o,v));
 const counts=[v.countA??r.a,v.countB??r.b],showValues=(!!v.won)||(!v.task&&!v.interactive);const revealUnit=!!v.won||(!v.interactive&&v.step>=4);
 aside.append(card('RATIO',showValues?`${r.a} : ${r.b}`:'?',`Two quantities in the same unit length`,'given'));
 aside.append(card('TOTAL PARTS',v.interactive?String(counts[0]+counts[1]):v.won||v.step>=3?String(r.count):'?' ,`Add both groups of equal parts`,'op'));
 aside.append(card('VALUE OF ONE',o.total==null?'Simplest form':revealUnit?money(r.unit):(v.unitPlaced?money(Number(v.rawUnit)):'?'),o.total==null?'Divide both terms by the common factor':'One equal share of the total',showValues?'result':'unknown'));
 lay.append(art,aside);stage.append(lay);helper(stage,v.pose||'ready');
}
const STEPS=[
 {name:'Read the relationship',narration:'We are sharing sixty pounds in the ratio two to three. Each square is one equal unit.',prompt:'Which quantities are being compared?'},
 {name:'Build the first bar',narration:'Draw two equal-sized units for Ava. The size of each unit matters.',prompt:'Why must both units be equal?'},
 {name:'Build the second bar',narration:'Draw three units of exactly the same size for Izaac. The bars now show two to three.',prompt:'How do the bars represent the ratio?'},
 {name:'Count the total units',narration:'Two plus three makes five equal parts altogether.',prompt:'How many units are there across BOTH bars?'},
 {name:'Find one part',narration:'Divide sixty pounds by five units. Each unit is worth twelve pounds.',prompt:'Why do we divide the total by five, not by two or three?'},
 {name:'Build both shares',narration:'Two units are worth twenty four pounds. Three units are worth thirty six pounds.',prompt:'What is the value of each bar?'},
 {name:'Prove the total',narration:'Twenty four pounds plus thirty six pounds makes sixty pounds. The two shares match the whole.',prompt:'How can you check that nothing was lost?'},
 {name:'Generalise',narration:'To share in a ratio, count every equal unit, find the value of one unit, and multiply for each share.',prompt:'Will doubling both ratio numbers change the shares?'}
];
function workshop(panel,stage,task,api){let o={...(task||C.presets[C.preset])};let r=totals(o),countA=0,countB=0,rawA='',rawB='',rawUnit='',shareA='',shareB='',unitPlaced=false,won=false,feedback='Drag equal units from the tray to build both bars.',pose='ready',lock=false;
 function say(msg,state){feedback=msg;pose=state;redraw();}
 function update(){r=totals(o);}
 function add(row){if(won||lock)return;const count=row===0?countA:countB;if(count>=C.parameters.maximumUnitCount){say('Maximum ten units per bar. Use the simplest relationship.','wrong');return;}if(row===0)countA++;else countB++;unitPlaced=false;ev('added',{row,counts:[countA,countB]});say('One equal unit added to '+(o.names||['A','B'])[row]+'.','explore');}
 function remove(row){if(won||lock)return;let c=row===0?countA:countB;if(c<=0)return;if(row===0)countA--;else countB--;unitPlaced=false;ev('removed',{row,counts:[countA,countB]});say('A unit returned to the tray.','remove');}
 function move(from,to){if(won||lock)return false;if(from===to)return false;if((from===0?countA:countB)===0||(to===0?countA:countB)>=10)return false;
  if(from===0){countA--;countB++;}else{countB--;countA++;}unitPlaced=false;ev('moved',{from,to,counts:[countA,countB]});say('One unit transferred: the total stays the same.','explore');return true;}
 function place(){if(rawUnit.trim()===''){say('Enter one-unit value before placing its chip.','wrong');return;}unitPlaced=true;ev('unit',{value:rawUnit,placed:true});say('Unit value placed on the first bar. Now check both shares.','placed');}
 function setPreset(id){if(!C.presets[id])return;C.preset=id;o={...C.presets[id]};update();reset(false);ev('preset',id);}
 function reset(emit=true){countA=0;countB=0;rawA='';rawB='';rawUnit='';shareA='';shareB='';unitPlaced=false;won=false;feedback='Build the simplest equal-unit bars to represent the ratio.';pose='ready';if(emit)ev('reset',true);redraw();}
 function hint(){let hint=o.total==null?'Both terms have a factor of three. Divide BOTH by three.':'Add the unit counts in both bars first. Divide the TOTAL by that sum.';api?.hint(hint);say(hint,'hint');}
 function check(){const ans={a:rawA,b:rawB,unit:rawUnit,unitPlaced,shareA,shareB,built:[countA,countB]};ev('answer',ans);const x=correctMath(o,ans);ev('check',x.ok);api?.check(x.ok,x.message);if(x.ok){won=true;say(x.message,'done');}else say(x.message,'wrong');return x.ok;}
 function field(label,val,set,type='number'){let inp=H('input',{type,value:val,step:'any',min:'0','aria-label':label});inp.addEventListener('change',()=>{set(inp.value);ev('ratio',{field:label,value:inp.value});if(label==='One unit (£)')refreshStage();});inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();inp.blur();}});return H('label',{class:'f407-field'},[label,inp]);}
 function refreshStage(){present(stage,o,{interactive:!won,won,task:!!task,countA,countB,unitPlaced,rawUnit,pose,heading:'Equal units',onAdd:add,onRemove:remove,onTransfer:move,onPlace:place});}
 function redraw(){panel.innerHTML='';refreshStage();
  if(!task){let choose=H('select',{'aria-label':'Choose ratio lesson'});Object.entries(C.presets).forEach(([k,p])=>choose.add(new Option(p.label,k)));choose.value=C.preset;choose.onchange=()=>setPreset(choose.value);panel.append(H('label',{class:'f407-field'},['Choose a lesson context',choose]));}
  panel.append(H('p',{class:'f407-prompt',text:o.context}));
  if(!won){let bar=H('div',{class:'f407-controls'});
   bar.append(btn('+ Unit A',()=>add(0)),btn('+ Unit B',()=>add(1)),btn('− Unit A',()=>remove(0)),btn('− Unit B',()=>remove(1)),btn('Reset',()=>reset()));panel.append(bar);
   const entries=H('div',{class:'f407-entry'});
   entries.append(field('Simplified A',rawA,v=>rawA=v),field('Simplified B',rawB,v=>rawB=v));
   if(o.total!=null){entries.append(field('One unit (£)',rawUnit,v=>{rawUnit=v;unitPlaced=false;}),field('Share A (£)',shareA,v=>shareA=v),field('Share B (£)',shareB,v=>shareB=v));}
   panel.append(entries);
   let actions=H('div',{class:'f407-controls'});if(o.total!=null)actions.append(btn(unitPlaced?'Unit chip placed':'Place unit value',place));actions.append(btn('Check model',check,true),btn('Hint',hint));panel.append(actions);
  }else panel.append(H('p',{class:'f407-finish',text:'Ratio and physical equal-unit proof confirmed.'}));
  panel.append(H('p',{class:'f407-guide',text:'Drag or keyboard: add tiles to a row, transfer by dragging a placed tile to the other row, return a tile to the red tray or press Delete on it. Equal units must be the same size. In share problems, place the value-of-one-unit chip too.'}));
  panel.append(H('p',{class:'f407-status'+(pose==='wrong'?' bad':pose==='done'?' good':''),role:'status',text:feedback}));
 }
 redraw();return {add,remove,move,place,check,reset,state:()=>({countA,countB,unitPlaced,won,rawUnit,rawA,rawB,shareA,shareB})};
}
const def={id:ID,title:'Ratio Bar',config:C,steps:STEPS,
 alt:'Two glass bars align at the same left edge; all units have the same horizontal width so the ratio is seen as unit counts rather than colours.',
 staticAlt:'£60 split 2:3: total five units; one unit £12; two units £24; three units £36. Simplify 6:9 by dividing both by 3 to get 2:3.',
 render(i,stage){const o=C.presets['Y7-059'],r=totals(o),a=i>=1?r.a:0,b=i>=2?r.b:0;present(stage,o,{countA:a,countB:b,step:i,pose:['start','a','b','total','unit','shares','compare','done'][i],heading:STEPS[i].name});},
 exploreIntro:'Build the bars and decide what one equal part is worth.',
 explore(panel,stage){workshop(panel,stage,null,null);},
 challenge(panel,api,stage){let i=0;function next(){panel.innerHTML='';if(i>=C.challenge.length){present(stage,C.presets['Y7-059'],{countA:2,countB:3,step:7,won:true,pose:'done',heading:'Three ratio challenges complete'});panel.append(H('p',{class:'f407-finish',text:'All three equal-unit proofs complete: simplest whole-number ratio, whole-number sharing, and decimal ratio sharing.'}));return;}
 const o={...C.challenge[i]};if(i>0){api.fb.textContent='';api.fb.className='nova-fb';api.bob('New question. Build the parts first.',{mood:'think'});}panel.append(H('p',{class:'f407-progress',text:`Challenge ${i+1} of ${C.challenge.length}: ${o.label}`}));let body=H('div');panel.append(body);
 const remote={hint:t=>api.hint(t),check:(good,message)=>{api.check(good,message,{task:i+1});if(good)Promise.resolve().then(()=>body.append(H('div',{class:'f407-next'},[btn('Next problem →',()=>{i++;next();},true)])));}};
 workshop(body,stage,o,remote);
 }next();}
};
N.registry.add({id:ID,title:'Ratio Bar',topics:['ratio notation','simplifying ratios','sharing in a ratio','decimal ratio'],deps:['F0-01','F0-02','F0-08','F0-13']});
N.bankMount({id:ID,num:'07',title:'Ratio Bar · Run 07 Review',def,years:'Years 7–9 · comparison, sharing in a ratio; GCSE and Functional Skills links.',linked:['F4-01','F4-03','F4-04','F4-06','F6-01','F6-04'],spec:{purpose:'Prove a multiplicative relationship with identical unit lengths, simplify its integer form and share a total proportionally.',params:'Positive ratio terms up to three decimal places, unit count 1–10 per bar, known or unknown total.',presets:'Y7-058: simplify 6:9; Y7-059: share £60 in 2:3; Y8-034: decimal 1.5:2.5 of £64.',steps:'Read → first bar → second bar → count all parts → find one part → calculate shares → check → generalise.',interactions:'Drag new unit tiles to bar; drag placed units to opposite bar or red return zone; keyboard add, delete and transfer; drag or keyboard-place value chip.',traps:'Unequal unit size, adding ratio terms to amounts, not dividing the total by all parts, simplifying one side only, treating decimal terms as shares.',gcse:'Proportional division and equivalent integer ratios, including decimal ratio terms.'}});
window.F407_MATH={gcd,ratio,totals,correctMath,money};
const root=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
