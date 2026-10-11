/* NOVA F4-04 · Multi-Step Bar Model · Premium Run 04.
   Exact existing NOVA F0 core, shared F2 interaction, no new SVG primitive or style family. */
const F404_CONFIG={id:'F4-04',startMode:'watch',preset:'Y8-038',
 parameters:{maxMoney:5000,roundToPenny:true,steps:2},
 presets:{
 'Y8-038':{label:'Y8-038 · Increase 15%, then decrease 10%',start:200,changes:[15,-10],context:'Start with £200. Increase by 15%, then reduce the NEW amount by 10%.'},
 'discount':{label:'Two successive discounts',start:80,changes:[-25,-10],context:'A £80 jacket gets 25% off, then another 10% off the reduced price.'},
 'interest':{label:'Two years at different rates',start:150,changes:[10,20],context:'A balance grows by 10%, then by 20% on the new balance.'},
 'reverse':{label:'Reverse the route from the final price',start:100,changes:[20,-25],context:'A final price of £90 follows an increase of 20%, then a decrease of 25%.'}
 },
 challenge:[
 {title:'Increase, then decrease',start:200,changes:[15,-10],context:'£200 increases by 15%, then decreases by 10%. Find the amount after each step.',fields:['Amount after step 1 (£)','Final amount (£)']},
 {title:'Two successive discounts',start:80,changes:[-25,-10],context:'A £80 price is discounted by 25%, then 10% off the new price. Find BOTH new prices.',fields:['Price after first discount (£)','Price after second discount (£)']},
 {title:'Work backwards',reverse:true,start:100,knownFinal:90,changes:[20,-25],context:'The final amount is £90 after a 20% increase followed by a 25% decrease. Find the ORIGINAL amount and the amount after the first step.',fields:['Original amount (£)','Amount after step 1 (£)']}
 ],
 events:{value:['preset','start','firstPercent','secondPercent','stepOne','final','carry','removeCarry','answer','proof','reset'],types:['step','correct','hintUsed','mode']}
};window.F404_CONFIG=F404_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F404_CONFIG,ID=C.id;
const S={w:1100,h:1160,left:177,width:758,ys:[198,462,725],bh:95,carry:{x:525,y:979,w:235,h:86},slot:{x:737,y:744,w:182,h:111},remove:{x:822,y:1015,w:213,h:93}};
const money=n=>'£'+(Math.round(n*100)/100).toFixed(2).replace(/\.00$/,'');
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const apply=(n,p)=>round(n*(100+p)/100);
function compute(start,changes){let nums=[start];for(const p of changes)nums.push(apply(nums.at(-1),p));return nums;}
function reverse(final,changes){let v=final;for(let i=changes.length-1;i>=0;i--)v=round(v/(1+changes[i]/100));return compute(v,changes);}
function expected(task){const a=compute(task.start,task.changes);return task.reverse?[a[0],a[1]]:[a[1],a[2]];}
function validate(task,fields,carried){const ans=expected(task);const vals=fields.map(v=>v===''||v===null?null:Number(v));
 if(vals.some(v=>v===null||!Number.isFinite(v)))return {ok:false,text:'Enter both step amounts before checking.'};
 if(vals.some(v=>v<0))return {ok:false,text:'An amount of money in this context cannot be negative.'};
 if(vals.some(v=>Math.abs(v*100-Math.round(v*100))>1e-6))return {ok:false,text:'Use pounds and pence, with at most two decimal places.'};
 if(Math.abs(vals[0]-ans[0])>.001){const p=task.changes[0];return {ok:false,text:task.reverse?'Undo the final 25% decrease FIRST, then divide by 1.20 to find the original.':'Step 1 is '+(p<0?'a decrease':'an increase')+' on the ORIGINAL amount. Find that step before continuing.'};}
 if(Math.abs(vals[1]-ans[1])>.001){return {ok:false,text:task.reverse?'Undo the last percentage change to find the amount AFTER the first step.':'The second percentage is applied to the NEW amount after step 1, not to the original.'};}
 if(!carried)return {ok:false,text:'The arithmetic is right. Carry the value after step 1 into the next bar to show how the steps connect.'};
 return {ok:true,text:'Correct: the result of step 1 becomes the base for step 2. Each percentage acts on its own base.'};
}
function misconception(task,fields){const [a,b]=fields.map(Number),[base,mid,last]=compute(task.start,task.changes);if(!task.reverse&&Number.isFinite(b)){
  const wrongCombined=apply(base,task.changes[0]+task.changes[1]);if(Math.abs(b-wrongCombined)<.001&&Math.abs(wrongCombined-last)>.001)return 'You combined the percentages on the original. Step 2 must use the new amount.';
  const wrongFixed=round(mid+base*task.changes[1]/100);if(Math.abs(b-wrongFixed)<.001&&Math.abs(wrongFixed-last)>.001)return 'You calculated the second change using the starting amount. Use the step-1 amount.';
 }return '';
}
function report(task,fields,carried){const generic=validate(task,fields,carried);if(!generic.ok){const more=misconception(task,fields);if(more)return {ok:false,text:more};}return generic;}
function evt(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' event: '+key);N.events.emit('value',{engine:ID,key,value});}
const button=(text,fn,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});
function chalk(p,x,y,v,size=52,role='given'){return N.chalkText(p,x,y,String(v),{role,size});}
function helper(stage,key){const poses={start:['explain','Follow the steps!'],base:['show-one','Start here!'],split:['count','One tenth first!'],grow:['point','Build on the base!'],carry:['point-down','Pass it on!'],change:['compare','New amount, new base!'],final:['celebrate','Both steps done!'],prove:['idea','Two stages, one route!'],explore:['think','Try another route!'],ready:['think','Work each step!'],picked:['show-one','Carry that value!'],remove:['oops','Try it again!'],wrong:['not-yet','Check the new base!'],right:['celebrate','You proved it!'],hint:['idea','One step at a time!']};const q=poses[key]||poses.ready;N.scene.helperStrip(stage,q[0],q[1]);}
function drag(svg,g,o){N.ui.svgDrag(svg,g,o);g.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===g){try{g.setPointerCapture(e.pointerId)}catch(_){}}});return g;}
function card(head,value,note,role){return N.neonCard([H('p',{class:'f404-card-label',text:head}),H('div',{class:'f404-card-value',text:value}),H('p',{class:'f404-card-note',text:note})],{role});}
function stageNums(data,o){const vals=compute(data.start,data.changes);
 if(o.interactive&&!o.won){if(o.task?.reverse){return [null,null,o.task.knownFinal]}return [data.start,null,null];}
 if(o.step!==undefined){return [o.step>=0?vals[0]:null,o.step>=3?vals[1]:null,o.step>=5?vals[2]:null];}
 return vals;}
function drawBar(svg,n,y,index,o){const amountVisible=o.values[index],hasNumber=amountVisible!==null&&amountVisible!==undefined,rawVal=o.math[index];
 const scale=720/Math.max(...o.math,1);const width=Math.max(170,Math.min(720,rawVal*scale));
 const schematic=o.interactive&&!o.won;const boxWidth=schematic?[560,640,596][index]:width;
 const role=index===0?'given':index===1?'op':'result';
 chalk(svg,S.left+175,y-26,['ORIGINAL','AFTER STEP 1','AFTER STEP 2'][index],49,'given');
 const fill=N.neonBox(svg,S.left,y,boxWidth,S.bh,{role,r:17});
 if(o.animated&&o.step===(index===0?0:index===1?3:5))N.motion.arrive(fill,-50,0);
 if(!schematic){for(let i=1;i<10;i++)N.neonLine(svg,S.left+boxWidth*i/10,y+11,S.left+boxWidth*i/10,y+S.bh-11,{role,width:1.2});}
 chalk(svg,S.left+boxWidth/2,y+69,hasNumber?money(amountVisible):'?',60,hasNumber?role:'unknown');
 if(o.won&&index>0)N.neonRing(svg,S.left+boxWidth+10,y+49,{role:'result',r:15});
 return {w:boxWidth,y};
}
function scene(data,o){const values=stageNums(data,o),math=compute(data.start,data.changes),interactive=!!o.interactive,svg=N.svg.root(S.w,S.h,'Three linked NOVA glass bars show a starting amount, an intermediate amount and a final amount. The second percentage is applied to the intermediate amount, not to the original.');svg.classList.add('f404-svg');
 svg.dataset.mode=o.task?'challenge':interactive?'explore':'watch';svg.dataset.carried=String(!!o.carried);
 if(!o.task&&(!interactive||o.won)){svg.dataset.base=String(math[0]);svg.dataset.mid=String(math[1]);svg.dataset.final=String(math[2]);}
 const draw={math,values,interactive,won:o.won,animated:o.animated,step:o.step};
 chalk(svg,550,81,interactive?'BUILD A TWO-STEP ROUTE':'ONE STEP FEEDS THE NEXT',54,'given');
 const lines=values.map((_,i)=>drawBar(svg,_,S.ys[i],i,draw));
 for(let i=0;i<2;i++){
  const from=S.ys[i]+S.bh,to=S.ys[i+1],x=955;
  if(!interactive&&o.step!==undefined&&o.step<(i?4:2))continue;
  N.neonLine(svg,x,from+12,x,to-32,{role:'focus',width:4});N.neonRing(svg,x,to-22,{role:'focus',r:13});
  const pct=data.changes[i],label=(pct>0?'+':'−')+Math.abs(pct)+'%';
  N.neonBox(svg,x-154,(from+to)/2-37,145,77,{role:pct>0?'result':'error',r:14});
  chalk(svg,x-83,(from+to)/2+17,label,54,pct>0?'result':'error');
  if(!interactive&&o.step!==undefined&&o.step===(i?4:2))N.motion.flash(svg,x-86,(from+to)/2,pct>0?'result':'error',42);
 }
 if(interactive){
  chalk(svg,550,930,o.carried?'THE STEP-1 VALUE HAS BEEN CARRIED':'CARRY STEP 1 INTO STEP 2',44,o.carried?'result':'focus');
  N.neonBox(svg,S.slot.x,S.slot.y,S.slot.w,S.slot.h,{role:o.carried?'result':'unknown',r:15});
  chalk(svg,S.slot.x+S.slot.w/2,S.slot.y+73,o.carried?'✓':'DROP HERE',48,o.carried?'result':'unknown');
  const chipText=o.carryValue===null?'ENTER VALUE':money(o.carryValue);
  if(o.carryValue!==null&&!o.won){const x=o.carried?S.slot.x+12:S.carry.x,y=o.carried?S.slot.y+12:S.carry.y,w=o.carried?S.slot.w-24:S.carry.w,h=o.carried?S.slot.h-24:S.carry.h;
    const chip=E('g',{class:'f404-chip','data-placed':o.carried?'true':'false','aria-label':o.carried?'Carried amount '+chipText:'Carry amount '+chipText,role:'button',tabindex:0},svg);
    N.neonBox(chip,x,y,w,h,{role:'focus',r:14});chalk(chip,x+w/2,y+h/2+19,chipText,48,'focus');
    drag(svg,chip,{box:{x,y,w,h},zones:()=>[{id:'slot',kind:'drop',x:S.slot.x,y:S.slot.y,w:S.slot.w,h:S.slot.h},...(o.carried?[{id:'return',kind:'remove',...S.remove}]:[])],onDrop:id=>{if(id!=='slot')return false;Promise.resolve().then(()=>o.onCarry());return true;},onRemove:()=>o.onRemove(),removeTo:{x:S.remove.x+S.remove.w/2,y:S.remove.y+S.remove.h/2}});
    chip.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onCarry();}else if((e.key==='Delete'||e.key==='Backspace')&&o.carried){e.preventDefault();o.onRemove();}});
  }
  if(o.carried){N.neonBox(svg,S.remove.x,S.remove.y,S.remove.w,S.remove.h,{role:'error',r:14});chalk(svg,S.remove.x+S.remove.w/2,S.remove.y+63,'RETURN',48,'error');}
  if(!o.won&&o.task)chalk(svg,550,1116,'MODEL NOT TO SCALE',48,'unknown');
 }else if(o.step>=6){
  const vals=compute(data.start,data.changes);
  chalk(svg,550,1041,`${money(vals[0])} → ${money(vals[1])} → ${money(vals[2])}`,56,'result');
  chalk(svg,550,1130,'EACH STEP USES THE PREVIOUS RESULT',42,'given');
 }
 return svg;
}
function present(stage,data,o){stage.innerHTML='';N.cap(stage,'Multi-Step Bar Model',o.task?'CHALLENGE':o.interactive?'EXPLORE & BUILD':o.subtitle||'Linked stages · percentage change');
 const shell=H('div',{class:'f404-layout'}),draw=H('div',{class:'f404-apparatus'}),aside=H('div',{class:'f404-side'});draw.append(scene(data,o));
 const values=stageNums(data,o),pct1=data.changes[0],pct2=data.changes[1],v=(n)=>n==null?'?':money(n);
 aside.append(card('STEP 1',(pct1>0?'+':'−')+Math.abs(pct1)+'%', 'Applied to the original',pct1>0?'result':'error'));
 aside.append(card('CARRIED RESULT',o.interactive&&!o.won?(o.carried?money(o.carryValue):'?'):v(values[1]),'Becomes the next base',o.carried||o.won?'result':'focus'));
 aside.append(card('STEP 2',(pct2>0?'+':'−')+Math.abs(pct2)+'%','Applied to step 1, not the start',pct2>0?'result':'error'));
 shell.append(draw,aside);stage.append(shell);helper(stage,o.pose||'start');}
const STEPS=[
{name:'Begin with the whole',narration:'Start with two hundred pounds. This is the original amount before any change.',prompt:'Which number is the starting amount?'},
{name:'See the unit pieces',narration:'The original bar is split into equal tenths. Ten percent is one tenth of the original.',prompt:'What is ten percent of two hundred?'},
{name:'Apply the first change',narration:'Fifteen percent of two hundred is thirty. That amount is added to the original.',prompt:'Where does the extra amount come from?'},
{name:'Carry the first result',narration:'The new amount is two hundred and thirty. Carry that exact amount into the next step.',prompt:'Which amount becomes the next base?'},
{name:'Change the new amount',narration:'The next ten percent is found from two hundred and thirty, not from two hundred.',prompt:'What base does the second percentage use?'},
{name:'Reveal the final amount',narration:'Ten percent of two hundred and thirty is twenty three. Take it away to get two hundred and seven.',prompt:'How much remains after both changes?'},
{name:'Connect both calculations',narration:'The first calculation feeds the second. You cannot simply combine these two percentage changes.',prompt:'Why is the second base different?'},
{name:'Check the misconception',narration:'Adding fifteen percent and subtracting ten percent on the original would give the wrong final result. The amounts are changing each time.',prompt:'What changes between the two steps?'}
];
function live(panel,stage,task,api){let preset=C.presets[C.preset],data=task||{...preset},fields=['',''],carried=false,won=false,message=task?'Find both missing amounts and carry the step-one result into the second bar.':'Enter the step-one and final amounts. Carry the intermediate value to prove the link.',status='ready';
 const getCarry=()=>{const raw=fields[data.reverse?1:0];if(raw===''||!Number.isFinite(Number(raw)))return null;return Number(raw);};
 function show(msg,kind){message=msg;status=kind;render();}
 function assign(field,value){fields[field]=value;carried=false;evt(field===0?'stepOne':'final',value);show('Value recorded. Carry the step-one amount into the next bar.','picked');}
 function carry(){if(won)return false;const v=getCarry();if(v===null){show('Enter the amount after step 1 before carrying it.','wrong');return false;}carried=true;evt('carry',v);show('Carried '+money(v)+' into the next bar. Now check both stages.','carry');return true;}
 function removeCarry(){if(!carried)return false;carried=false;evt('removeCarry',true);show('Removed the carried value. You can try a different step-one amount.','remove');return true;}
 function reset(){fields=['',''];carried=false;won=false;evt('reset',true);show('Both answer fields cleared. Work through the route again.','base');}
 function hint(){const text=data.reverse?'Reverse the last change by dividing the final amount by 0.75. Then undo the first 20% increase.':'Calculate step 1 from the given base, then apply step 2 to your new step-one result.';api?.hint(text);show(text,'hint');}
 function check(){evt('answer',{first:fields[0],second:fields[1],carried});const r=report(data,fields,carried);if(!r.ok){api?.check(false,r.text);show(r.text,'wrong');return false;}won=true;evt('proof',{correct:true,first:Number(fields[0]),second:Number(fields[1]),carried});api?.check(true,r.text);show(r.text,'right');return true;}
 function setPreset(id){C.preset=id;const p=C.presets[id];data={...p};fields=['',''];carried=false;won=false;evt('preset',id);show(p.context,'base');}
 function render(){panel.innerHTML='';present(stage,data,{interactive:!won,won,task:task||null,pose:status,carried,carryValue:getCarry(),onCarry:carry,onRemove:removeCarry});
  if(!task){const select=H('select',{'aria-label':'Choose route preset'});Object.entries(C.presets).forEach(([id,o])=>select.add(new Option(o.label,id)));select.value=C.preset;select.onchange=()=>setPreset(select.value);panel.append(H('label',{class:'f404-field'},['Choose a two-step route',select]));}
  panel.append(H('p',{class:'f404-prompt',text:data.context||'Each percentage acts on the amount created by the previous step.'}));
  if(!won){const labels=task?.fields||['Amount after step 1 (£)','Final amount (£)'];const row=H('div',{class:'f404-controls'});
   for(let i=0;i<2;i++){const input=H('input',{type:'number',step:'0.01',min:'0','aria-label':labels[i],placeholder:'?',value:fields[i]});input.onchange=()=>assign(i,input.value);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();input.blur();}};const lab=H('label',{class:'f404-field'},[labels[i],input]);row.append(lab);}
   row.append(button(carried?'Carry again →':'Carry step 1 →',carry),button('Check both steps',check,true),button('Hint',hint),button('Reset',reset));if(carried)row.append(button('Remove carried value',removeCarry));panel.append(row);
  }else panel.append(H('p',{class:'f404-success',text:'Route complete — both stages verified.'}));
  panel.append(H('p',{class:'f404-guide',text:'Solve step 1 before step 2. Drag its answer chip into the marked slot (or use Carry step 1). A carried chip can be returned to the red zone or removed with Delete.'}));
  panel.append(H('p',{class:'f404-status'+(status==='wrong'?' bad':status==='right'?' good':''),role:'status',text:message}));
 }
 render();return {getState:()=>({fields:[...fields],carried,won,preset:C.preset}),assign,carry,removeCarry,check,reset,setPreset};
}
const def={id:ID,title:'Multi-Step Bar Model',config:C,steps:STEPS,
alt:'A series of three linked glass bars. Two hundred pounds increases by fifteen percent to two hundred and thirty, then decreases by ten percent to two hundred and seven.',
staticAlt:'£200 × 1.15 = £230; £230 × 0.90 = £207. Each percentage uses the amount immediately before it.',
render(i,stage){const poses=['base','split','grow','carry','change','final','prove','prove'];present(stage,C.presets['Y8-038'],{step:i,subtitle:STEPS[i].name,pose:poses[i],animated:true});},
exploreIntro:'Change the route, calculate both amounts and transfer the step-one result.',
explore(panel,stage){live(panel,stage,null,null);},
challenge(panel,api,stage){let index=0;function next(){panel.innerHTML='';if(index===C.challenge.length){present(stage,C.presets['Y8-038'],{step:7,won:true,pose:'right',subtitle:'All three routes complete'});panel.append(H('div',{class:'f404-finish',text:'You completed three linked-bar problems, including a reverse calculation.'}));return;}
 const ch=C.challenge[index],area=H('div');panel.append(H('p',{class:'f404-progress',text:`Problem ${index+1} of ${C.challenge.length} · ${ch.title}`}),area);
 const remote={hint:msg=>api.hint(msg),check:(ok,msg)=>{api.check(ok,msg,{task:index+1});if(ok)Promise.resolve().then(()=>area.append(H('div',{class:'f404-next'},[button('Next problem →',()=>{index++;next()},true)])));}};
 live(area,stage,ch,remote);
 }next();}
};
N.registry.add({id:ID,title:'Multi-Step Bar Model',topics:['multi-step percentages','reverse percentages','multipliers','word problems'],deps:['F0-01','F0-02','F0-08','F0-13']});
N.bankMount({id:ID,num:'04',title:'Multi-Step Bar Model · Run 04 Review',def,years:'Year 8 · Percentage-change problem solving; Year 7–9 and GCSE links.',linked:['F4-01','F4-02','F4-06','F4-09','F5-14'],spec:{purpose:'Prove that each stage of a multi-step percentage problem uses the previous result as its base.',params:'Original, intermediate and final amounts; two signed percentage changes; forward or reverse; pence rounding.',presets:'Y8-038 £200 +15% then −10%; two discounts; two growth rates; reverse £90 to original.',steps:'Original → tenths → first change → carry result → second change → final → verify → misconception.',interactions:'Drag stage-one chip to stage-two slot, re-grab or return to tray, keyboard carry/remove, type intermediate and final, three checked challenges.',traps:'Adding signed percentages as if they share a base; computing second change from original; reversal by subtraction instead of division.',gcse:'Compound percentage changes, inverse multipliers, iterative financial contexts.'}});
window.F404_MATH={round,apply,compute,reverse,expected,validate,misconception,report};
const root=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
