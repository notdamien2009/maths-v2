/* NOVA F4-09 Before-and-After Bar · Run 09. Extends the canonical F0/F2 visual engine; NO shared core changes. */
const F409_CONFIG={id:'F4-09',startMode:'watch',preset:'Y8-008',parameters:{minRate:1,maxRate:75,maxAmount:2000,currency:'GBP'},
 presets:{
  'Y8-008':{label:'Year 8 · Reverse percentage',kind:'increase',before:150,rate:20,unknown:'before',context:'A coat costs £180 after a 20% increase. What was its original price?',lesson:'Y8-008'},
  'INC-15':{label:'Increase · Find the after amount',kind:'increase',before:200,rate:15,unknown:'after',context:'A £200 item rises by 15%. What is the new price?'},
  'DEC-15':{label:'Decrease · Find the after amount',kind:'decrease',before:180,rate:15,unknown:'after',context:'A £180 item is reduced by 15%. What is its sale price?'},
  'REV-DEC':{label:'Reverse decrease · Find original',kind:'decrease',before:160,rate:15,unknown:'before',context:'After a 15% discount, an item costs £136. What did it cost before?'}
 },
 challenge:[
  {label:'Increase — new amount',kind:'increase',before:200,rate:25,unknown:'after',context:'A bicycle cost £200. Its price increased by 25%. What is the new price?'},
  {label:'Decrease — sale amount',kind:'decrease',before:240,rate:15,unknown:'after',context:'A £240 jacket has a 15% discount. What is its sale price?'},
  {label:'Reverse increase — original',kind:'increase',before:150,rate:20,unknown:'before',context:'A final price of £180 includes a 20% increase. Find the original price.'},
  {label:'Reverse decrease — original',kind:'decrease',before:200,rate:15,unknown:'before',context:'A £170 final price follows a 15% reduction. Find the original price.'}
 ],
 events:{value:['preset','amount','change','changeRemoved','valuePlaced','valueRemoved','check','reset'],types:['step','correct','hintUsed','mode']}
};window.F409_CONFIG=F409_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F409_CONFIG,ID=C.id;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
function calc(o){const {before,rate,kind}=o;if(!(Number.isFinite(before)&&before>0&&before<=C.parameters.maxAmount&&Number.isFinite(rate)&&rate>=C.parameters.minRate&&rate<=C.parameters.maxRate&&['increase','decrease'].includes(kind)&&['before','after'].includes(o.unknown)))throw Error('Invalid before-and-after configuration');const multiplier=kind==='increase'?1+rate/100:1-rate/100;const delta=round(before*rate/100);const after=round(before*multiplier);return {before,after,delta,rate,multiplier,basePercent:100,afterPercent:round(multiplier*100),direction:kind==='increase'?1:-1,unknown:o.unknown,kind};}
const format=n=>'£'+round(n).toFixed(2).replace(/\.00$/,'');
function expected(o){const a=calc(o);return a[o.unknown];}
function misconception(o,n){const m=calc(o);if(!Number.isFinite(n)||n<0)return 'Enter a positive numerical amount.';
 if(o.unknown==='before'){
  if(Math.abs(n-round(m.after*(m.kind==='increase'?1-m.rate/100:1+m.rate/100)))<.005)return 'You applied the percentage to the FINAL amount. The change is a percentage of the ORIGINAL whole. Divide by the correct multiplier.';
  if(Math.abs(n-m.delta)<.005)return 'That is the change, not the original amount.';
  return `The final price is ${m.afterPercent}% of the original. Divide ${format(m.after)} by ${m.multiplier.toFixed(2)}.`;
 }
 if(Math.abs(n-m.delta)<.005)return 'You calculated the change only. Include the original whole to find the AFTER amount.';
 if(Math.abs(n-round(m.before*(m.kind==='increase'?1-m.rate/100:1+m.rate/100)))<.005)return 'Check the direction. An increase makes the after bar longer; a decrease makes it shorter.';
 return `Calculate ${m.rate}% of the ORIGINAL ${format(m.before)}, then ${m.kind==='increase'?'add':'subtract'} that change.`;
}
function validate(o,raw,changePlaced,valuePlaced){if(String(raw).trim()==='')return {ok:false,kind:'empty',message:'Enter the missing amount first.'};const x=Number(raw);if(!Number.isFinite(x)||x<0||Math.abs(x*100-Math.round(x*100))>1e-5)return {ok:false,kind:'format',message:'Enter a valid non-negative amount, to at most two decimal places.'};if(Math.abs(x-expected(o))>.005)return {ok:false,kind:'math',message:misconception(o,x)};if(!changePlaced)return {ok:false,kind:'change',message:'Your amount is right. Show the percentage-change segment on the bar to prove the change.'};if(!valuePlaced)return {ok:false,kind:'placement',message:'Now place the missing value on its before or after bar to complete the comparison.'};const a=calc(o);return {ok:true,kind:'proved',message:`Correct. ${format(a.before)} ${o.kind==='increase'?'+':'−'} ${format(a.delta)} = ${format(a.after)}. The change is ${a.rate}% of the original ${format(a.before)}.`};}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' event '+key);N.events.emit('value',{engine:ID,key,value});}
const btn=(text,fn,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});
function chalk(p,x,y,s,size=45,role='given'){return N.chalkText(p,x,y,String(s),{size,role});}
function info(head,val,note,role='given'){return N.neonCard([H('p',{class:'f409-card-label',text:head}),H('p',{class:'f409-card-value',text:val}),H('p',{class:'f409-card-note',text:note})],{role});}
const POSES={start:['explain','Spot the original!'],whole:['point','Find one hundred!'],change:['show-one','See the change!'],after:['compare','Look at both bars!'],work:['count','Use the original!'],solve:['idea','Try the multiplier!'],proof:['celebrate','The bars agree!'],explore:['point','Move a value!'],ready:['think','Your turn!'],placed:['point-down','Snapped in place!'],wrong:['not-yet','Check the whole!'],right:['celebrate','Great comparison!'],hint:['idea','Find 100% first!'],remove:['oops','Try once more!']};
function mascot(stage,key){const x=POSES[key]||POSES.ready;N.scene.helperStrip(stage,x[0],x[1]);}
function drag(svg,el,o){N.ui.svgDrag(svg,el,o);el.addEventListener('pointerdown',ev=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(ev.pointerId);}catch(_){}}});}
const GEO={w:1000,h:880,x:118,yBefore:236,yAfter:411,hBar:97,maxW:765,trayY:714,trayX:136,returnX:688,slotY:595};
function graphic(o,v){const m=calc(o),g=GEO,interactive=!!v.interactive&&!v.won,step=v.step??7,won=!!v.won,showAll=won||(!v.interactive&&step>=6),max=Math.max(m.before,m.after),beforeW=m.before/max*g.maxW,afterW=m.after/max*g.maxW,deltaW=Math.abs(afterW-beforeW),deltaX=g.x+Math.min(beforeW,afterW),positive=m.kind==='increase',changeRole=positive?'result':'error',unknown=o.unknown;
 const svg=N.svg.root(g.w,g.h,`Two aligned before and after bars. ${m.rate}% ${m.kind} from the original whole. Compare the original and final quantities, then calculate the missing amount.`);svg.classList.add('f409-svg');svg.dataset.mode=v.task?'challenge':interactive?'explore':'watch';svg.dataset.placedChange=String(!!v.changePlaced);svg.dataset.placedValue=String(!!v.valuePlaced);svg.dataset.won=String(won);svg.dataset.unknown=unknown;svg.dataset.kind=m.kind;
 chalk(svg,500,73,'WHAT CHANGED?',54,'given');chalk(svg,500,130,`${m.rate}% ${positive?'INCREASE':'DECREASE'}  ·  WHOLE = 100%`,43,positive?'result':'focus');
 // Both bars start at exactly the same x: the mathematical evidence is their different lengths.
 chalk(svg,g.x+130,g.yBefore-34,'BEFORE · 100%',43,'given');
 if(step>=0||interactive){N.neonBox(svg,g.x,g.yBefore,beforeW,g.hBar,{role:'given',r:14});if(!positive&&(step>=2||interactive)){N.neonBox(svg,deltaX,g.yBefore+7,Math.max(10,deltaW),g.hBar-14,{role:v.changePlaced||!interactive?'error':'unknown',r:10});}}
 if(!interactive&&step<1){chalk(svg,g.x+beforeW/2,g.yBefore+62,'THE ORIGINAL WHOLE',40,'given');}
 else {const beforeLabel=(unknown==='before'&&!showAll)?'£ ?':format(m.before);chalk(svg,g.x+beforeW/2,g.yBefore+65,beforeLabel,51,unknown==='before'&&!showAll?'unknown':'given');}
 // Arrow is a core primitive; no hand-drawn custom filter or isolated per-engine style.
 if(step>=1||interactive){N.svg.arrow(svg,g.x+g.maxW/2,g.yBefore+g.hBar+31,g.x+g.maxW/2,g.yAfter-36,{role:'op',width:3});chalk(svg,510,380,positive?'+ CHANGE':'− CHANGE',32,'op');}
 if(step>=2||interactive){chalk(svg,g.x+130,g.yAfter-34,`AFTER · ${m.afterPercent}%`,43,'given');N.neonBox(svg,g.x,g.yAfter,afterW,g.hBar,{role:'given',r:14});if(positive){N.neonBox(svg,deltaX,g.yAfter+7,Math.max(10,deltaW),g.hBar-14,{role:v.changePlaced||!interactive?'result':'unknown',r:10});}
  const afterLabel=unknown==='after'&&!showAll?'£ ?':format(m.after);
  // The after-label is intentionally centred in the unchanged portion, not over the small change segment.
  chalk(svg,g.x+Math.min(beforeW,afterW)/2,g.yAfter+65,afterLabel,50,unknown==='after'&&!showAll?'unknown':'given');
 }
 if(step>=3||interactive){const y=positive?g.yAfter:g.yBefore,role=interactive&&!v.changePlaced?'unknown':changeRole;
  N.neonPath(svg,`M ${deltaX} ${y+g.hBar+14} v17 h${Math.max(10,deltaW)} v-17`,{role:'op',width:3});
  chalk(svg,deltaX+deltaW/2,y+g.hBar+70,`${positive?'+':'−'}${m.rate}%`,43,role);
 }
 const equation=step>=4||interactive?unknown==='before'?(showAll?`${format(m.after)} ÷ ${m.multiplier.toFixed(2)} = ${format(m.before)}`:`${format(m.after)} ÷ ${m.multiplier.toFixed(2)} = ?`):showAll?`${format(m.before)} ${positive?'+':'−'} ${format(m.delta)} = ${format(m.after)}`:`${format(m.before)} ${positive?'+':'−'} CHANGE = ?`:'THE SAME WHOLE · TWO DIFFERENT AMOUNTS';
 chalk(svg,500,574,equation,41,showAll?'result':'focus');
 if(interactive&&!showAll)chalk(svg,500,638,`CHANGE = ${m.rate}% OF THE ORIGINAL`,35,'op');
 // Live app: mathematical apparatus receives physical labels and the change section.
 if(interactive){const changeZone={x:deltaX-22,y:(positive?g.yAfter:g.yBefore)-10,w:Math.max(deltaW+44,94),h:g.hBar+25,id:'change',kind:'drop'};
  const valueZone={x:g.x+Math.min(beforeW,afterW)*.33,y:(unknown==='before'?g.yBefore:g.yAfter)-16,w:Math.max(135,Math.min(beforeW,afterW)*.5),h:g.hBar+33,id:'value',kind:'drop'};
  const red={x:g.returnX,y:g.trayY,w:165,h:95,id:'remove',kind:'remove'};
  N.neonBox(svg,g.returnX,g.trayY,165,95,{role:'error',r:14});chalk(svg,g.returnX+82,g.trayY+60,'RETURN',39,'error');
  const sources=[{type:'change',text:`${positive?'+':'−'}${m.rate}%`,placed:!!v.changePlaced,zone:changeZone,role:changeRole,x:g.trayX,w:195},
   ...(String(v.raw||'').trim()!==''?[{type:'value',text:format(Number(v.raw)),placed:!!v.valuePlaced,zone:valueZone,role:'focus',x:g.trayX+240,w:232}]:[])];
  for(const item of sources){const from=item.placed?{x:item.zone.x+12,y:item.zone.y+12,w:item.zone.w-24,h:83}:{x:item.x,y:g.trayY,w:item.w,h:77};
   const tile=E('g',{class:'f409-drag',tabindex:0,role:'button','data-type':item.type,'data-placed':String(item.placed),'aria-label':`${item.type==='change'?'Change segment':'Missing value'} ${item.placed?'placed, drag to return zone or press Delete':'from tray, drag onto '+item.type+' target or press Enter'}`},svg);
   N.neonBox(tile,from.x,from.y,Math.max(70,from.w),from.h,{role:item.role,r:12});chalk(tile,from.x+Math.max(70,from.w)/2,from.y+from.h/2+16,item.text,41,item.role);
   const zones=()=>[item.placed?red:item.zone];
   drag(svg,tile,{box:{x:from.x,y:from.y,w:Math.max(70,from.w),h:from.h},zones,
    onDrop:id=>{if(id!==item.type)return false;Promise.resolve().then(()=>v.onPlace(item.type,true));return true;},
    onRemove:()=>Promise.resolve().then(()=>v.onPlace(item.type,false)),removeTo:{x:g.returnX+80,y:g.trayY+46}});
   tile.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!item.placed){e.preventDefault();v.onPlace(item.type,true);}if((e.key==='Delete'||e.key==='Backspace')&&item.placed){e.preventDefault();v.onPlace(item.type,false);}});
  }
 }else if(showAll){chalk(svg,500,719,`${m.rate}% OF ${format(m.before)} = ${format(m.delta)}  ·  ${m.afterPercent}% = ${format(m.after)}`,37,'result');}
 else if(step>=4){chalk(svg,500,719,unknown==='before'?'FINAL PRICE IS NOT THE 100% WHOLE':'THE CHANGE IS BASED ON THE BEFORE AMOUNT',36,'op');}
 return svg;
}
function present(stage,o,v){stage.innerHTML='';const m=calc(o);N.cap(stage,'Before → After',v.task?'CHALLENGE':v.interactive?'BUILD & COMPARE':v.heading||'Original · change · new amount');
 const wrap=H('div',{class:'f409-layout'}),art=H('div',{class:'f409-art'}),side=H('div',{class:'f409-side'});art.append(graphic(o,v));
 const reveal=!!v.won||(!v.interactive&&(v.step??0)>=6);
 side.append(info('ORIGINAL · 100%',o.unknown==='before'&&!reveal?'?':format(m.before),'Percent change always uses this whole',o.unknown==='before'&&!reveal?'unknown':'given'));
 side.append(info('CHANGE',`${o.kind==='increase'?'+':'−'}${o.rate}%`,o.kind==='increase'?'The extra section is added':'The missing section is taken away',o.kind==='increase'?'result':'error'));
 side.append(info('AFTER',o.unknown==='after'&&!reveal?'?':format(m.after),reveal?'Both amounts agree with the model':`This is ${m.afterPercent}% of the original`,reveal?'result':'given'));
 wrap.append(art,side);stage.append(wrap);mascot(stage,v.pose||'ready');}
const STEPS=[
 {name:'Notice the original whole',narration:'The first bar stands for the entire original amount. It is always one hundred percent.',prompt:'Which amount is the one hundred percent whole?'},
 {name:'Name the percentage change',narration:'An increase or a decrease is calculated from the original, not from the new amount.',prompt:'Why must we use the original whole?'},
 {name:'Compare two aligned bars',narration:'Both bars begin at the same place. One is longer or shorter because of the change.',prompt:'What does the extra or missing section represent?'},
 {name:'Mark the change segment',narration:'The extra section is twenty percent of the original. Compare its length with the whole.',prompt:'How does a twenty percent section compare with the original bar?'},
 {name:'Link the percentages',narration:'An increase of twenty percent produces one hundred and twenty percent of the original.',prompt:'Which percentage does the after bar represent?'},
 {name:'Work backwards',narration:'When we know the final amount, divide by the multiplier to recover the original hundred percent.',prompt:'Why is subtracting twenty percent of the final amount incorrect?'},
 {name:'Reveal the missing amount',narration:'One hundred and eighty pounds divided by one point two gives one hundred and fifty pounds.',prompt:'How do we find the original from the final price?'},
 {name:'Prove the relationship',narration:'Twenty percent of one hundred and fifty pounds is thirty pounds. Adding thirty gives one hundred and eighty pounds.',prompt:'Can you check the original and final amounts using the change?'}
];
function workshop(panel,stage,task,api){let o={...(task||C.presets[C.preset])},raw='',changePlaced=false,valuePlaced=false,won=false,feedback='Use the original whole. Enter the missing amount, then drag both chips onto the bar.',mood='ready';
 function update(s,k='explore'){feedback=s;mood=k;redraw();}
 function place(kind,on){if(won)return false;if(kind==='value'&&on&&!String(raw).trim()){update('Enter the missing value before placing its chip.','wrong');return false;}if(kind==='change'){changePlaced=on;emit(on?'change':'changeRemoved',{rate:o.rate,kind:o.kind});}else{valuePlaced=on;emit(on?'valuePlaced':'valueRemoved',{raw});}update(on?`${kind==='change'?'Change segment':'Value'} snapped into the bar.`:`${kind==='change'?'Change':'Value'} returned to the tray.`,on?'placed':'remove');return true;}
 function setAmount(s){raw=s;valuePlaced=false;emit('amount',raw);update('Value recorded. Place its chip on the missing bar.','ready');}
 function hint(){const t=o.unknown==='before'?`The final is ${calc(o).afterPercent}% of the original. Divide the FINAL price by ${calc(o).multiplier.toFixed(2)}.`:`Find ${o.rate}% of the BEFORE amount, then ${o.kind==='increase'?'add':'subtract'} the change.`;api?.hint(t);update(t,'hint');}
 function check(){const res=validate(o,raw,changePlaced,valuePlaced);emit('check',{ok:res.ok,kind:res.kind});api?.check(res.ok,res.message);if(res.ok){won=true;update(res.message,'right');}else update(res.message,'wrong');return res.ok;}
 function reset(){raw='';changePlaced=false;valuePlaced=false;won=false;emit('reset',true);update('Start again with the 100% original whole.','ready');}
 function select(id){if(!C.presets[id])return;C.preset=id;o={...C.presets[id]};emit('preset',id);reset();}
 function redraw(){panel.innerHTML='';present(stage,o,{interactive:!won,task:!!task,won,raw,changePlaced,valuePlaced,pose:mood,onPlace:place});
  if(!task){const pick=H('select',{'aria-label':'Choose a before and after example'});Object.entries(C.presets).forEach(([k,p])=>pick.add(new Option(p.label,k)));pick.value=C.preset;pick.onchange=()=>select(pick.value);panel.append(H('label',{class:'f409-field'},['Example / lesson preset',pick]));}
  panel.append(H('p',{class:'f409-prompt',text:o.context}));
  if(!won){const fields=H('div',{class:'f409-fields'});const label=o.unknown==='before'?'Original amount (£)':'After amount (£)';const input=H('input',{type:'number',step:'0.01',min:'0',value:raw,'aria-label':label});input.onchange=()=>setAmount(input.value);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();input.blur();}});fields.append(H('label',{class:'f409-field'},[label,input]));panel.append(fields);
   panel.append(H('div',{class:'f409-controls'},[btn(changePlaced?'Return change':'Place change',()=>place('change',!changePlaced)),btn(valuePlaced?'Return value':'Place value',()=>place('value',!valuePlaced)),btn('Check my model',check,true),btn('Hint',hint),btn('Reset',reset)]));
  }else panel.append(H('p',{class:'f409-done',text:'Both aligned bars, the percentage-change segment and the correct original/final amounts have been proved.'}));
  panel.append(H('p',{class:'f409-guide',text:'Drag the percentage-change chip onto the highlighted difference; place the missing-value chip into the correct bar. Drag placed chips to the red RETURN tray, or use Enter/Delete and the labelled buttons. A final answer must match the maths AND the diagram.'}));
  panel.append(H('p',{class:'f409-status'+(mood==='wrong'?' bad':mood==='right'?' good':''),role:'status',text:feedback}));
 }
 redraw();return {setAmount,place,check,reset,select,state:()=>({raw,changePlaced,valuePlaced,won})};
}
const def={id:ID,title:'Before-and-After Bar',config:C,steps:STEPS,
 alt:'Two translucent neon-glass bars start at the same point. The longer or shorter bar shows the effect of a percentage change from the original whole; the difference is a coloured segment.',
 staticAlt:'£150 increased by 20% gives £180. Reverse: £180 ÷ 1.20 = £150. Verify £150 + £30 = £180. Decrease: £180 − 15% = £153.',
 render(i,stage){present(stage,C.presets['Y8-008'],{step:i,pose:['start','whole','after','change','work','solve','solve','proof'][i],heading:STEPS[i].name});},
 exploreIntro:'Change context, calculate the missing amount and prove it by placing the value and the change segment.',
 explore(panel,stage){workshop(panel,stage,null,null);},
 challenge(panel,api,stage){let idx=0;function next(){panel.innerHTML='';if(idx>=C.challenge.length){present(stage,C.presets['Y8-008'],{step:7,won:true,pose:'proof',heading:'All percentage-change challenges solved'});panel.append(H('p',{class:'f409-done',text:'Four challenges proved: increase, decrease, reverse increase and reverse decrease.'}));return;}
  if(idx>0){api.fb.textContent='';api.fb.className='nova-fb';api.bob('Find the original whole first.',{mood:'think'});}
  const o={...C.challenge[idx]};panel.append(H('p',{class:'f409-prompt',text:`Challenge ${idx+1} of ${C.challenge.length} · ${o.label}`}));const slot=H('div');panel.append(slot);
  const proxy={hint:s=>api.hint(s),check:(ok,s)=>{api.check(ok,s,{task:idx+1});if(ok)Promise.resolve().then(()=>slot.append(H('div',{class:'f409-next'},[btn(idx+1<C.challenge.length?'Next problem →':'Finish challenges →',()=>{idx++;next();},true)])));}};
  workshop(slot,stage,o,proxy);
 }next();}
};
N.registry.add({id:ID,title:'Before-and-After Bar',topics:['percentage increases','percentage decreases','reverse percentage','original amounts','multipliers'],deps:['F0-01','F0-02','F0-08','F4-06']});
N.bankMount({id:ID,num:'09',title:'Before-and-After Bar · Run 09 Review',def,years:'Years 7–9 · Reverse percentages, multipliers, GCSE Foundation/Higher',linked:['F4-04','F4-06','F5-16','F18-07'],spec:{purpose:'Two aligned bars make additive/subtractive percentage change visible, with the original 100% as the invariant reference.',params:'Increase/decrease, original/final unknown, rates 1–75%, amounts up to £2000; exact two-decimal answers.',presets:'Y8-008 reverse percentage; increase/decrease examples; reverse decrease example. Additional contexts are not verified Year 7/8 mappings.',steps:'Identify the whole → name change → compare lengths → mark segment → connect to multiplier → reverse operation → solve → check.',interactions:'F2 svgDrag change segment and missing-value chips into visual zones; red return tray; mouse/touch/keyboard. Wrong-answer diagnostics and four challenge proofs.',traps:'Subtracting change percentage from the final instead of reversing multiplier; finding only change instead of final; reversing increase/decrease; wrong percentage base.',gcse:'Reverse percentage, multiplier reasoning, compound context groundwork.'}});
window.F409_MATH={calc,expected,round,format,misconception,validate};
const root=document.getElementById(ID);const dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
