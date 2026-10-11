/* F6-12 interactive NOVA F0 gallery demonstrator only. Parent F18-02 not implemented.
 * Every diagram is drawn by the approved F0 neon and chalk primitives.
 */
(function(){'use strict';
const N=window.NOVA,P=window.NOVA_F612_PRESET,H=N.h,E=N.svg.el,M=N.motion,ID='F6-12';
const C={id:ID,preset:'Y8-039',startMode:'watch',presets:P.presets,previewOnly:true,parentEngine:'F18-02',events:['step','value','correct','hintUsed']};window.F612_CONFIG=C;
const STEPS=[
 {name:'Read the starting unit',pose:'explain',caption:'Start with the unit.',narration:'Read the starting quantity and the unit printed beside it. We must keep track of the unit at every stage.'},
 {name:'Find the first conversion factor',pose:'point-down',caption:'Which factor fits?',narration:'Look at the given conversion. Decide whether this step needs multiplication or division.'},
 {name:'Cross the first bridge',pose:'count',caption:'Apply one factor.',narration:'Cross the first bridge. Apply its factor and write the correct new unit.'},
 {name:'Check the next unit',pose:'point',caption:'Check each new unit.',narration:'If there is another bridge, cross it now. Otherwise check that the first conversion has given the final unit.'},
 {name:'Check the final unit',pose:'checking',caption:'Does the unit match?',narration:'The last card shows the converted quantity. Check the value and the new unit are both sensible.'},
 {name:'Reverse to verify',pose:'celebrate',caption:'Work backwards.',narration:'Reverse the steps to check. Multiplication going forward becomes division going backward, and vice versa.'}
];
const fmt=(x,d=6)=>Number(Number(x).toFixed(d)).toLocaleString('en-GB',{maximumFractionDigits:d});
const close=(a,b)=>Math.abs(a-b)<=Math.max(0.000005,Math.abs(b)*0.0000001);
const emit=(t,detail={})=>N.events.emit(t,{engine:ID,preset:C.preset,...detail});
const preset=id=>P.presets[id||C.preset];
const txt=(p,x,y,s,role='given',size=29)=>N.chalkText(p,x,y,String(s),{role,size});
const btn=(s,action,cls='nova-btn')=>H('button',{text:s,class:cls,onclick:action});
const calc=(p,amount)=>p.factors.reduce((v,f)=>v*f,amount);
const values=(p,amount)=>p.factors.reduce((a,f)=>{a.push(a[a.length-1]*f);return a;},[amount]);
function choices(p){let list=p.ops.map((s,i)=>({key:'right-'+i,label:s,factor:p.factors[i]}));let extra=p.traps.slice(0,2).filter(x=>!p.ops.includes(x));
 for(let label of extra){const n=Number(label.replace(/[^0-9.]/g,''));let factor=label.startsWith('÷')?1/n:n;list.push({key:'other-'+list.length,label,factor});}
 if(list.length<3)list.push({key:'other-'+list.length,label:'÷1.18',factor:1/1.18});return list;}
// Do not modify F0 pointer handling; clean up only F6-12 drag if released beyond the SVG.
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f612-pill'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
function card(title,val,foot,role='given'){return N.neonCard([H('p',{class:'f612-cardkey',text:title}),H('p',{class:'f612-cardnum',text:val}),H('p',{class:'f612-carddesc',text:foot})],{role});}
function draw(stage,p,opt={}){
 const mode=opt.mode||'watch',teach=mode==='watch'||mode==='guided',mobile=window.innerWidth<=980,challenge=mode==='challenge',hidden=challenge&&!opt.solved;
 const amount=challenge?p.query:p.start,steps=values(p,amount),numBridges=p.factors.length,vis=teach?(opt.step??5):5;
 const selectedFactors=choices(p),placed=opt.placed||[],exploreVals=[amount];
 for(let i=0;i<numBridges;i++){const selected=placed[i];exploreVals.push(selected==null?null:exploreVals[i]==null?null:exploreVals[i]*selectedFactors[selected].factor);}
 const w=mobile?520:1120,h=mobile?(numBridges===1?790:980):670;
 const svg=N.svg.root(w,h,'NOVA glass unit-conversion bridge: '+amount+' '+p.units[0]+' converts to '+fmt(calc(p,amount))+' '+p.units[p.units.length-1]+' via '+p.ops.join(' and '));svg.classList.add('f612-svg');svg.dataset.preset=opt.id||C.preset;svg.dataset.mode=mode;
 const layout=H('div',{class:'f612-layout'}),art=H('div',{class:'f612-art'}),aside=H('aside',{class:'f612-aside'});
 stage.innerHTML='';N.cap(stage,ID,challenge?'CONVERT THE UNITS':mode==='explore'?'BUILD YOUR UNIT BRIDGE':'UNIT BY UNIT · THE BRIDGE');
 txt(svg,w/2,56,'ONE JOURNEY · NEW UNITS','given',mobile?32:45);
 txt(svg,w/2,115,p.kind==='currency'?'CURRENCY CONVERSION':'COMPOUND UNIT CONVERSION','focus',mobile?25:34);
 const positions=mobile? (numBridges===1?[[260,270],[260,640]]:[[260,245],[260,514],[260,787]]):
 (numBridges===1?[[286,350],[830,350]]:[[180,352],[565,352],[950,352]]);
 const cardWidth=mobile?338:(numBridges===1?275:240),cardH=mobile?154:165;
 positions.forEach(([cx,cy],i)=>{
  if(teach&&i>vis) return;
  const role=i===0?'given':i===positions.length-1?'result':'focus';
  const x=cx-cardWidth/2,y=cy-cardH/2;
  N.neonBox(svg,x,y,cardWidth,cardH,{role,r:16});
  txt(svg,cx,cy-48,i===0?'START':i===positions.length-1?'FINISH':'CHANGE THE UNIT',role,mobile?20:22);
  let showValue= !hidden && (!teach || i===0 || vis>=i+1);
  if(mode==='explore'&&i>0)showValue=exploreVals[i]!=null;
  const rendered=showValue?fmt(mode==='explore'?exploreVals[i]:steps[i],p.precision):'?';
  const val=txt(svg,cx,cy+10,rendered,showValue?'result':'unknown',mobile?35:38);if(val)val.setAttribute('data-bridge-value',String(i));
  txt(svg,cx,cy+68,p.units[i],role,mobile?25:26);
  const badge=N.neonRing(svg,x+14,y+11,{role,r:5,pulse:false});if(badge)badge.style.pointerEvents='none';
 });
 for(let i=0;i<numBridges;i++){
  const [ax,ay]=positions[i],[bx,by]=positions[i+1];let fx,fy;
  if(mobile){fx=w/2;fy=(ay+by)/2;N.svg.arrow(svg,fx,ay+86,fx,by-85,{role:'op',width:3.5});N.svg.arc(svg,fx+92,fy,34,38,145,{role:'focus',rightMark:false});}
  else{fx=(ax+bx)/2;fy=283;N.svg.arrow(svg,ax+cardWidth/2+17,ay,bx-cardWidth/2-17,by,{role:'op',width:3.3});N.svg.arc(svg,fx,fy-23,38,25,155,{role:'focus',rightMark:false});}
  const factorVisible=!teach||vis>=i+1;
  const factorText=(mode==='explore'||challenge&&!opt.solved)?(opt.placed?.[i]!=null?choices(p)[opt.placed[i]]?.label||'?':'?'):(teach&&!factorVisible?'?':p.ops[i]);
  txt(svg,fx,fy,factorText,teach&&!factorVisible?'unknown':'op',mobile?29:28);
  if(mode==='explore'&&opt.placed?.[i]==null)N.neonRing(svg,fx,fy-38,{role:'unknown',r:10,pulse:false});
 }
 const footer=hidden?'SHOW THE STEPS WITH YOUR ANSWER':mode==='explore'?'PLACE A FACTOR · SEE THE RESULT':p.rateNote.toUpperCase();
 txt(svg,w/2,h-44,footer,'focus',mobile?20:23);
 // All side-card maths derived from preset factors, not duplicate manually typed answers.
 aside.append(card('STARTING QUANTITY',fmt(amount)+' '+p.units[0],'Read both the number and its unit.','given'));
 aside.append(card('UNIT BRIDGES',hidden?'CHOOSE THE FACTORS':p.ops.join('  then  '),p.rateNote,'focus'));
 const canShowFinal=!hidden&&(!teach||vis>=4)&&(mode!=='explore'||exploreVals.at(-1)!=null);
 const seenFinal=mode==='explore'?exploreVals.at(-1):calc(p,amount);
 aside.append(card('FINAL QUANTITY',canShowFinal?fmt(seenFinal,p.precision)+' '+p.units.at(-1):'? '+p.units.at(-1),canShowFinal?'Each bridge changes a unit.':'Work forwards before you reveal the result.','result'));
 if(teach)aside.append(card('CHECK IT',vis===5?'REVERSE THE STEPS':'FOLLOW THE FACTORS','Undo each factor to recover the start.','op'));
 art.append(svg);
 if(mode==='explore'||challenge){const dock=makeDock(p,mode,opt,mobile);art.append(dock);}
 layout.append(art,aside);stage.append(layout);N.scene.helperStrip(stage,opt.pose||'point',opt.caption||'Read the unit at every step.');
 return {svg,positions};
}
function makeDock(p,mode,opt,mobile){
 const w=mobile?520:1120,h=mobile?490:335,deck=N.svg.root(w,h,'Interactive factor cards. Drag each factor into a bridge slot, or focus a card and press the bridge number. Use Delete to return the card.');
 deck.classList.add('f612-svg','f612-dock');deck.dataset.kind='factor-dock';
 txt(deck,w/2,49,mode==='challenge'?'CHOOSE THE CORRECT FACTORS':'DRAG FACTORS TO THE BRIDGES','given',mobile?26:34);
 const n=p.factors.length,slots=mobile?(n===1?[[260,130]]:[[137,130],[382,130]]):(n===1?[[515,127]]:[[350,127],[735,127]]);
 const red=mobile?[260,249]:[935,125];
 const candidates=choices(p),pads=mobile?candidates.map((_,i)=>[i%2?390:130,358+Math.floor(i/2)*94]):candidates.map((_,i)=>[175+i*240,260]);
 slots.forEach(([x,y],i)=>{N.neonBox(deck,x-(mobile?105:117),y-40,mobile?210:234,80,{role:'result',r:13});txt(deck,x,y-51,'BRIDGE '+(i+1),'given',mobile?20:23);txt(deck,x,y+11,opt.placed?.[i]!=null?candidates[opt.placed[i]]?.label:'DROP HERE',opt.placed?.[i]!=null?'result':'unknown',mobile?22:24);});
 N.neonBox(deck,red[0]-(mobile?100:86),red[1]-38,mobile?200:173,77,{role:'error',r:12});txt(deck,red[0],red[1]+11,'RETURN','error',mobile?22:24);
 candidates.forEach((item,index)=>{
  const [cx,cy]=pads[index],placedSlot=(opt.placed||[]).findIndex(k=>k===index);
  const grp=E('g',{class:'f612-pill',tabindex:'0',role:'button','aria-label':item.label+'. Drag to bridge slot or press 1 or 2 to place. Delete removes.','data-chip':String(index)},deck);
  N.neonBox(grp,cx-81,cy-29,162,59,{role:placedSlot>=0?'result':index<n?'focus':'given',r:11});txt(grp,cx,cy+10,item.label,placedSlot>=0?'result':'given',mobile?23:25);
  const zones=[...slots.map(([x,y],i)=>({id:'slot:'+i,kind:'drop',x:x-94,y:y-36,w:188,h:73})),{id:'remove',kind:'remove',x:red[0]-94,y:red[1]-36,w:188,h:73}];
  N.ui.svgDrag(deck,grp,{box:{x:cx-81,y:cy-29,w:162,h:59},zones:()=>zones,
   onDrop:id=>{if(!id.startsWith('slot:'))return false;const slot=+id.slice(5);Promise.resolve().then(()=>opt.onPlace?.(index,slot));return true;},
   onRemove:()=>{Promise.resolve().then(()=>opt.onRemove?.(index));}});
  grp.addEventListener('keydown',e=>{const digit=['1','2'].indexOf(e.key);if(digit>=0&&digit<n){e.preventDefault();opt.onPlace?.(index,digit);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();const vacant=Array.from({length:n},(_,i)=>i).find(i=>opt.placed?.[i]==null)??0;opt.onPlace?.(index,vacant);}else if(e.key==='Backspace'||e.key==='Delete'||e.key==='Escape'){e.preventDefault();opt.onRemove?.(index);}});
 });
 return deck;
}
function teach(step,stage){const p=preset(),s=STEPS[step];const view=draw(stage,p,{mode:'watch',step,pose:s.pose,caption:s.caption});emit('step',{index:step,name:s.name});if(step===4&&!N.reducedMotion())M.flash(view.svg,view.positions.at(-1)[0],view.positions.at(-1)[1],'result',36);}
function explore(panel,stage){let id=C.preset,placed=Array(preset(id).factors.length).fill(null),feedback='Drag the factor pills onto numbered bridge slots. Keyboard: focus a pill, press 1 or 2.';
 const selector=H('select',{'aria-label':'Lesson preset'});Object.entries(P.presets).forEach(([key,p])=>selector.append(H('option',{value:key,text:p.label})));selector.value=id;
 const menu=H('div',{class:'f612-menu'}),actions=H('div',{class:'f612-buttonbar'}),fb=H('p',{class:'f612-feedback','aria-live':'polite'});
 menu.append(H('label',{},['Lesson context ',selector]));actions.append(btn('Check bridge',check,'nova-btn primary'),btn('Hint',hint),btn('Reset',reset));panel.append(menu,H('p',{class:'f612-help',text:'Place a factor on each bridge. Different factors give different results. The red RETURN area removes a factor.'}),actions,fb);
 function paint(pose='point',caption='Change one unit at a time.'){draw(stage,preset(id),{mode:'explore',id,placed,onPlace:place,onRemove:remove,pose,caption});fb.textContent=feedback;}
 function place(index,slot){if(!Number.isInteger(slot)||slot<0||slot>=placed.length)return;placed=placed.map(v=>v===index?null:v);placed[slot]=index;feedback='Factor '+choices(preset(id))[index].label+' placed on bridge '+(slot+1)+'.';emit('value',{preset:id,slot,factor:choices(preset(id))[index].label});paint('point','Compare the factor with the units.');}
 function remove(index){const old=placed.indexOf(index);if(old<0)return;placed[old]=null;feedback='Factor returned to the tray.';emit('value',{removed:index});paint('explain','Try another factor.');}
 function check(){const p=preset(id),list=choices(p);const ok=placed.length===p.factors.length&&placed.every((ix,i)=>ix!=null&&close(list[ix].factor,p.factors[i]));feedback=placed.some(x=>x==null)?'Complete every bridge before checking.':ok?'Correct! Every change has the right multiplier or divisor.':'Not yet: check the direction of each conversion. For a denominator change, divide by the number of smaller time units.';fb.className='f612-feedback '+(ok?'good':'bad');emit('correct',{correct:ok,placed:placed.slice()});paint(ok?'celebrate':'not-yet',ok?'Both units and values match!':'Check the direction of the bridge.');if(ok){const s=stage.querySelector('svg');if(s)M.flash(s,260,220,'result',32);}}
 function hint(){feedback=preset(id).kind==='currency'?'A given rate of £1 = €1.18 means multiply pounds by 1.18 to find euros.':'Convert the top quantity using ×1000, then divide by how many seconds the time unit contains.';emit('hintUsed',{});paint('point-down','Look at both units.');}
 function reset(){placed=Array(preset(id).factors.length).fill(null);feedback='Bridge reset. Place the conversion factors.';paint('explain','Start at the beginning.');}
 selector.onchange=()=>{id=selector.value;C.preset=id;reset();};C._explore={get:()=>({id,placed:[...placed],feedback}),setPreset:key=>{selector.value=key;selector.onchange();},place,remove,check,hint,reset};paint();}
function challenge(panel,api,stage){const ids=Object.keys(P.presets);let index=0,solved=false,count=0,attempts=0,placed=[],message='';
 const prompt=H('p',{class:'f612-question'}),entry=H('input',{class:'f612-answer',type:'text',inputmode:'decimal',placeholder:'Your converted value','aria-label':'Converted value'}),unit=H('select',{'aria-label':'Final unit'}),box=H('div',{class:'f612-challengeinput'}),actions=H('div',{class:'f612-buttonbar'}),fb=H('p',{class:'f612-feedback','aria-live':'polite'}),progress=H('p',{class:'f612-progress'}),checkButton=btn('Check answer',check,'nova-btn primary'),nextButton=btn('Next conversion',next);nextButton.disabled=true;
 unit.append(H('option',{value:'',text:'Choose unit'}));['EUR','GBP','km/h','m/s','m/h','mL/s','L/min','mL/min'].forEach(u=>unit.append(H('option',{value:u,text:u})));
 box.append(H('label',{},['New quantity ',entry]),H('label',{},['New unit ',unit]));actions.append(checkButton,btn('Hint',hint),nextButton);panel.append(prompt,box,actions,fb,progress);
 function p(){return preset(ids[index]);}
 function paint(){const cur=p();prompt.textContent=(index+1)+' / '+ids.length+' · '+cur.context+' Convert '+fmt(cur.query)+' '+cur.units[0]+'.';progress.textContent='Conversions completed: '+count+' / '+ids.length;draw(stage,cur,{mode:'challenge',id:ids[index],solved,placed,onPlace:place,onRemove:remove,pose:solved?'celebrate':'think',caption:solved?'Both factor and units are correct.':'Apply the given factors.'});fb.textContent=message;}
 function place(idx,slot){if(solved)return;placed=placed.map(x=>x===idx?null:x);placed[slot]=idx;emit('value',{bridge:slot,choice:idx});message='Factor placed. Now calculate the converted value.';paint();}
 function remove(idx){if(solved)return;const at=placed.indexOf(idx);if(at<0)return;placed[at]=null;message='Factor returned.';paint();}
 function check(){if(solved)return;attempts++;const cur=p(),v=entry.value.trim().replace(',','.'),n=v!==''?Number(v):NaN,correct=calc(cur,cur.query),items=choices(cur);
 let ok=false,m='';if(!Number.isFinite(n))m='Enter a numerical converted value.';
 else if(unit.value!==cur.units.at(-1))m='The unit is incorrect. Read the label on the final bridge card.';
 else if(Math.abs(n-correct)>0.00001){const backward=cur.factors.reduce((v,f)=>v/f,cur.query);if(close(n,backward))m='You reversed the conversion factors. Check which direction the arrows point.';else if(close(n,cur.query))m='The starting quantity was copied unchanged. Use the conversion factors.';else m='Check the calculation. For compound rates, change the numerator and denominator separately.';}
 else if(placed.length!==cur.factors.length||placed.some(x=>x==null))m='Your number is correct. Complete the factor bridges too.';
 else if(!placed.every((ix,i)=>items[ix]&&close(items[ix].factor,cur.factors[i])))m='Your number is correct but a bridge factor is incorrect. Fix the direction of the operation.';
 else{ok=true;m='Correct! '+fmt(cur.query)+' '+cur.units[0]+' converts to '+fmt(correct,cur.precision)+' '+cur.units.at(-1)+'.';}
 api.check(ok,m,{preset:ids[index],actual:{value:Number.isFinite(n)?n:null,unit:unit.value,placed:[...placed]},expected:{value:correct,unit:cur.units.at(-1)}});emit('correct',{correct:ok,preset:ids[index]});message=m;fb.className='f612-feedback '+(ok?'good':'bad');if(ok){solved=true;count++;checkButton.disabled=true;nextButton.disabled=false;paint();let s=stage.querySelector('svg');if(s)M.flash(s,260,300,'result',33);}else paint();}
 function hint(){message=p().kind==='currency'?'This is a stated classroom exchange rate. Multiply the pounds by 1.18.':'Multiply to change a larger distance/volume unit to a smaller one, then divide to change the time denominator.';api.hint(message);emit('hintUsed',{preset:ids[index]});paint();}
 function next(){if(!solved)return;if(index===ids.length-1){prompt.textContent='All three unit conversions completed.';box.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'CONVERSIONS COMPLETE');N.scene.helperStrip(stage,'celebrate','You built every bridge correctly.');return;}index++;solved=false;placed=Array(p().factors.length).fill(null);entry.value='';unit.value='';checkButton.disabled=false;nextButton.disabled=true;message='';paint();}
 entry.addEventListener('keydown',ev=>{if(ev.key==='Enter')check();});placed=Array(p().factors.length).fill(null);unit.value='';
 C._challenge={get:()=>({index,solved,count,attempts,placed:[...placed],feedback:message}),setAnswers:(v,u)=>{entry.value=String(v);unit.value=u;},place,remove,check,hint,next};paint();}
const DEF={id:ID,title:'Currency & Unit Bridges · F18-02 Preset Preview',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'Connected NOVA neon unit cards with one or two conversion factors. Multiply or divide at each bridge to convert currency or compound units.',
 staticAlt:'Currency: given rate £1 = €1.18; £25 equals €29.50. Speed: 72 km/h = 72000 m/h = 20 m/s. Flow: 1.8 L/min = 1800 mL/min = 30 mL/s.',
 spec:{purpose:'Build conceptual bridges between stated currency rates and compound unit changes; teach the numerator and denominator separately.',params:'Start quantity, intermediate units, named factors, operation direction, given FX rate and precision.',presets:'Y8-039 currency; Y8-043 km/h to m/s; Y9-024 L/min to mL/s.',steps:'Start unit → choose factor → cross bridge → cross denominator bridge → final value → reverse check.',interactions:'Drag or keyboard-place factor pills into numbered bridge slots, red return tray, numerical conversion marking.',traps:'Reversing the factor, multiplying both numerator and denominator, forgetting time conversion, incorrect destination unit.',gcse:'Compound measures, fractional unit factors, ratio consistency.'}};
N.bankMount({id:ID,num:'F6·12',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 8–9; GCSE compound-rate extension',linked:['F0-02','F0-04','F6-05','F6-11','F18-02 (host pending)']});
window.F612_PREVIEW={config:C,math:{convert:(p,x)=>calc(p,x),steps:(p,x)=>values(p,x),close},choices};
})();
