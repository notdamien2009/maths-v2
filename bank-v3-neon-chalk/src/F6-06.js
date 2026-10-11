/* NOVA F6-06 Best-Buy Comparer. Additive to approved F0 Neon Tube/Chalk core. */
const F606_CONFIG={
 id:'F6-06',startMode:'watch',preset:'Y7-061',parameters:{currency:'GBP',precisionPence:2,baseUnits:['100 g','100 ml','item']},
 presets:{
  'Y7-061':{label:'Y7-061 · Pasta packs',context:'Two pasta packs. Which buys more food for each pound?',title:'PASTA PACKS',category:'bag',unit:'g',compareAmount:100,compareLabel:'100 g',items:[{name:'PACK A',pricePence:180,amount:500},{name:'PACK B',pricePence:240,amount:750}]},
  'Y7-061-cereal':{label:'Y7-061 · Cereal boxes',context:'Compare breakfast cereal prices per 100 grams.',title:'BREAKFAST CEREAL',category:'box',unit:'g',compareAmount:100,compareLabel:'100 g',items:[{name:'BOX A',pricePence:220,amount:400},{name:'BOX B',pricePence:300,amount:600}]},
  'Y7-061-juice':{label:'Y7-061 · Juice cartons',context:'Compare juice cartons sold in different sizes.',title:'FRUIT JUICE',category:'carton',unit:'ml',compareAmount:100,compareLabel:'100 ml',items:[{name:'JUICE A',pricePence:180,amount:1000},{name:'JUICE B',pricePence:255,amount:1500}]},
  'Y7-061-soap':{label:'Y7-061 · Hand soap',context:'The bigger bottle is not necessarily better value.',title:'HAND SOAP',category:'bottle',unit:'ml',compareAmount:100,compareLabel:'100 ml',items:[{name:'SOAP A',pricePence:125,amount:250},{name:'SOAP B',pricePence:220,amount:400}]},
  'Y7-061-equal':{label:'Y7-061 · Equal value',context:'Two bars multipacks: is there always just one best buy?',title:'OAT BAR PACKS',category:'bar',unit:'bars',compareAmount:1,compareLabel:'1 bar',items:[{name:'SIX PACK',pricePence:270,amount:6},{name:'TEN PACK',pricePence:450,amount:10}]}
 },events:{types:['value','step','correct','hintUsed'],names:['preset','selection','removed','check','hint','reset']}
};window.F606_CONFIG=F606_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=F606_CONFIG,ID=C.id;
/* F0 drag-state release defence scoped to this engine: if pointerup is outside the SVG, release its local marker. */
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f606-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
const STEPS=[
 {name:'Two prices, two pack sizes',caption:'Look at both price and amount.',pose:'explain',narration:'The shelf prices are different, and so are the pack sizes. We cannot decide which one is best just from the total price.'},
 {name:'Choose a common unit',caption:'Compare the same amount.',pose:'point',narration:'Pick one fair unit to compare. We will find out how much each pack costs for exactly the same quantity.'},
 {name:'Find the first unit price',caption:'Divide before you compare.',pose:'count',narration:'For the first pack, divide its price by its size, then multiply by the common comparison amount.'},
 {name:'Find the second unit price',caption:'Same method for both.',pose:'count',narration:'Do exactly the same calculation for the second pack. Keep both answers in pence for the same quantity.'},
 {name:'Make the price bars',caption:'Shorter means less cost.',pose:'checking',narration:'Now place the two unit prices side by side. A shorter price bar means less money for the same amount.'},
 {name:'Prove the best buy',caption:'Choose with mathematical evidence.',pose:'celebrate',narration:'The smaller unit price is the better value, even when its shelf price is higher. If they match, both packs give equal value.'}
];
function unit(p,i){return p.items[i].pricePence*p.compareAmount/p.items[i].amount;}
function round(v){return Math.round((v+Number.EPSILON)*100)/100;}
function pf(v){return round(v).toFixed(2).replace(/\.00$/,'.00');}
function pounds(p){return '£'+(p/100).toFixed(2);}
function winner(p){let a=unit(p,0),b=unit(p,1);return Math.abs(a-b)<1e-8?'equal':a<b?'A':'B';}
function evidence(p){return {a:round(unit(p,0)),b:round(unit(p,1)),winner:winner(p)};}
function emit(key,v){N.events.emit('value',{engine:ID,key,value:v});}
function chalk(parent,x,y,t,role='given',size=26){return N.chalkText(parent,x,y,String(t),{role,size});}
function card(title,value,desc,role){return N.neonCard([H('p',{class:'f606-card-label',text:title}),H('p',{class:'f606-card-value',text:value}),H('p',{class:'f606-card-desc',text:desc})],{role});}
function coords(mobile){return mobile?{w:480,h:1040,cardX:[19,248],cardY:118,cardW:212,cardH:360,unitTop:608,barX:152,barW:258,barYs:[688,769],ringX:84,ringY:518,trayX:312,trayY:495,insY:859,proofY:991}:
 {w:1120,h:1020,cardX:[75,630],cardY:126,cardW:416,cardH:346,unitTop:565,barX:350,barW:600,barYs:[634,724],ringX:270,ringY:899,trayX:810,trayY:860,insY:829,proofY:984};}
function icon(svg,kind,cx,cy,role){const g=E('g',{'aria-hidden':'true',class:'f606-product-icon'},svg);
 if(kind==='bottle'){
  N.neonBox(g,cx-33,cy-46,66,112,{role,r:15});N.neonBox(g,cx-17,cy-60,34,17,{role,r:5});N.neonLine(g,cx-26,cy+10,cx+26,cy+10,{role,width:3});N.neonRing(g,cx,cy-4,{role,r:12,pulse:false});
 }else if(kind==='carton'){
  N.neonPath(g,`M${cx-45} ${cy-30} L${cx-5} ${cy-68} L${cx+43} ${cy-30} L${cx+43} ${cy+60} L${cx-45} ${cy+60}Z`,{role,width:3.4});N.neonLine(g,cx-45,cy-30,cx+43,cy-30,{role,width:2.4});N.neonLine(g,cx-5,cy-68,cx-5,cy-30,{role,width:2});N.neonRing(g,cx,cy+14,{role,r:15,pulse:false});
 }else if(kind==='box'){
  N.neonBox(g,cx-44,cy-61,88,125,{role,r:8});N.neonBox(g,cx-33,cy-42,66,36,{role:'focus',r:6});N.neonLine(g,cx-29,cy+24,cx+29,cy+24,{role,width:3});N.neonLine(g,cx-24,cy+40,cx+24,cy+40,{role,width:2});
 }else if(kind==='bar'){
  for(let i=0;i<3;i++){const xx=cx-53+i*38;N.neonBox(g,xx,cy-25,33,77,{role,r:9});N.neonLine(g,xx+7,cy+10,xx+26,cy+10,{role,width:2});}
 }else{
  N.neonPath(g,`M${cx-50} ${cy-56} Q${cx} ${cy-71} ${cx+50} ${cy-56} L${cx+38} ${cy+61} Q${cx} ${cy+68} ${cx-38} ${cy+61}Z`,{role,width:3.4});N.neonPath(g,`M${cx-39} ${cy-18} Q${cx} ${cy-35} ${cx+39} ${cy-18}`,{role,width:2});N.neonLine(g,cx-32,cy+18,cx+32,cy+18,{role,width:2});
 }
 return g;
}
function row(svg,p,i,G,{reveal,barStep=false,selected=false,marked=false}={}){
 const y=G.barYs[i],role=i===0?'given':'op',u=unit(p,i),barMax=Math.max(unit(p,0),unit(p,1))*1.12||1;
 chalk(svg,G.w===480?72:160,y+8,i===0?'PACK A':'PACK B',role,G.w===480?23:34);
 // fixed endpoints form a readable exact scale for both bars; equal values use identical lengths.
 N.neonLine(svg,G.barX,y+1,G.barX+G.barW,y+1,{role:'focus',width:1.8});
 const full=G.barW*(u/barMax),shown=reveal||marked;
 if(shown){const g=E('g',{'data-price-bar':i,'data-unit-pence':pf(u)},svg);N.neonBox(g,G.barX,y-20,full,42,{role:selected?'result':role,r:8});
 const label=chalk(svg,G.barX+Math.max(full/2,43),y+8,pf(u)+'p',selected?'result':role,G.w===480?22:33);
 if(barStep&&!N.reducedMotion()){
  g.style.opacity='0.25';M.delay(i*190,()=>{if(!g.isConnected)return;M.tween(600,t=>{if(g.isConnected)g.style.opacity=String(.25+.75*t);},M.ease.out);});
 }
 }else{N.neonBox(svg,G.barX,y-21,G.barW,43,{role:'unknown',r:8});chalk(svg,G.barX+G.barW/2,y+8,'? p','unknown',G.w===480?24:34);}
}
function draw(stage,p,o={}){
 const mobile=innerWidth<=760,G=coords(mobile),step=o.step??5,mode=o.mode||'watch',challenge=mode==='challenge',explore=mode==='explore',chosen=o.chosen??null,solved=!!o.solved;
 stage.innerHTML='';N.cap(stage,ID,p.title,challenge?'FIND THE BEST BUY':explore?'COMPARE THE SAME AMOUNT':'UNIT PRICE EVIDENCE');
 const layout=H('div',{class:'f606-layout'}),art=H('div',{class:'f606-art'}),aside=H('aside',{class:'f606-cards','aria-label':'Unit-price evidence'});
 const svg=N.svg.root(G.w,G.h,'Two differently priced neon product packages compared using prices per equal quantities, with two price bars and an interactive best-buy marker.');svg.classList.add('f606-svg');svg.dataset.mode=mode;svg.dataset.preset=o.id||C.preset;svg.dataset.step=String(step);
 chalk(svg,G.w/2,53,challenge?'WHICH IS THE BEST VALUE?':'TWO PACKS · ONE FAIR COMPARISON','given',mobile?29:37);
 chalk(svg,G.w/2,91,'COMPARE THE COST PER '+p.compareLabel.toUpperCase(),'focus',mobile?21:29);
 p.items.forEach((a,i)=>{
  const x=G.cardX[i],y=G.cardY,w=G.cardW,h=G.cardH,role=i===0?'given':'op';
  N.neonBox(svg,x,y,w,h,{role:chosen===(i===0?'A':'B')?'result':role,r:18});
  // A fine etched separator is part of the product card, not a decorative frame around mathematics.
  chalk(svg,x+w/2,y+44,a.name,role,mobile?24:36);
  icon(svg,p.category,x+w/2,y+(mobile?159:155),role);
  N.neonLine(svg,x+18,y+h-133,x+w-18,y+h-133,{role,width:2});
  chalk(svg,x+w/2,y+h-92,pounds(a.pricePence),'focus',mobile?36:50);
  chalk(svg,x+w/2,y+h-43,a.amount+' '+p.unit,'given',mobile?27:37);
  if(chosen===(i===0?'A':'B')||(chosen==='equal'&&solved)){
    const g=E('g',{class:'f606-drag','data-placed':i===0?'A':'B',role:'button',tabindex:0,'aria-label':'Best-buy marker placed on '+a.name+'. Press Delete to remove.'},svg);
    N.neonRing(g,x+w-33,y+30,{role:'result',r:22,pulse:false});N.neonRing(g,x+w-33,y+30,{role:'focus',r:10,pulse:false});
    if(explore){g.addEventListener('keydown',e=>{if(['Delete','Backspace','Escape'].includes(e.key)){e.preventDefault();o.onRemove();}});
     N.ui.svgDrag(svg,g,{box:{x:x+w-66,y:y+2,w:63,h:62},zones:()=>[{id:'return',kind:'remove',x:G.trayX,y:G.trayY,w:mobile?144:220,h:72}],onRemove:()=>o.onRemove(),onDrop:()=>false});}
  }
 });
 chalk(svg,G.w/2,G.unitTop,'UNIT PRICE · PENCE PER '+p.compareLabel.toUpperCase(),'focus',mobile?22:29);
 const reveal=(explore ||(!challenge && step>=4)||solved),showA=explore||(!challenge&&step>=2)||solved,showB=explore||(!challenge&&step>=3)||solved;
 row(svg,p,0,G,{reveal:showA,selected:solved&&winner(p)==='A',barStep:!challenge&&step===4});
 row(svg,p,1,G,{reveal:showB,selected:solved&&winner(p)==='B',barStep:!challenge&&step===4});
 if(explore){
   const ring=E('g',{class:'f606-drag',tabindex:0,role:'button','data-best-buy-ring':'1','aria-label':'Drag the best-buy marker to a product. Press A or B to choose, E if they have equal unit prices.'},svg);
   N.neonRing(ring,G.ringX,G.ringY,{role:'result',r:29,pulse:false});N.neonRing(ring,G.ringX,G.ringY,{role:'focus',r:12,pulse:false});
   chalk(svg,G.ringX,G.ringY+(mobile?46:57),'BEST BUY','result',mobile?23:30);
   ring.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if('abe'.includes(k)&&k.length===1){e.preventDefault();o.onChoose(k==='e'?'equal':k.toUpperCase());}});
   N.ui.svgDrag(svg,ring,{box:{x:G.ringX-36,y:G.ringY-36,w:72,h:72},zones:()=>[...G.cardX.map((x,i)=>({id:i===0?'A':'B',kind:'drop',x,y:G.cardY,w:G.cardW,h:G.cardH})),{id:'return',kind:'remove',x:G.trayX,y:G.trayY,w:mobile?144:220,h:72}],onDrop:id=>{if(id==='A'||id==='B'){Promise.resolve().then(()=>o.onChoose(id));return true;}return false;},onRemove:()=>o.onRemove()});
   N.neonBox(svg,G.trayX,G.trayY,mobile?144:220,72,{role:'error',r:14});chalk(svg,G.trayX+(mobile?72:110),G.trayY+44,'RETURN','error',mobile?22:29);
   chalk(svg,G.w/2,G.insY,'DRAG THE RING TO THE BETTER VALUE','focus',mobile?18:27);
   // Equal values cannot be represented by one ring on two cards; explicit equal keyboard/HTML control is provided below.
 }else{
   chalk(svg,G.w/2,G.insY,challenge?'WORK OUT BOTH UNIT PRICES FIRST':step>=5?'SMALLER UNIT PRICE = BETTER VALUE':'DIVIDE PRICE BY QUANTITY','focus',mobile?20:27);
   if(!challenge&&step>=5){const best=winner(p),text=best==='equal'?'EQUAL VALUE':best==='A'?'PACK A IS BEST VALUE':'PACK B IS BEST VALUE';chalk(svg,G.w/2,G.proofY,text,'result',mobile?26:37);}
 }
 art.append(svg);
 const safe=explore||solved||(!challenge&&step>=2),safeB=explore||solved||(!challenge&&step>=3);
 aside.append(card('FAIR COMPARISON',p.compareLabel,'Both bars use the very same quantity.','focus'),
   card('PACK A · PER '+p.compareLabel,safe?pf(unit(p,0))+'p':'? p','£'+(p.items[0].pricePence/100).toFixed(2)+' for '+p.items[0].amount+' '+p.unit,'given'),
   card('PACK B · PER '+p.compareLabel,safeB?pf(unit(p,1))+'p':'? p','£'+(p.items[1].pricePence/100).toFixed(2)+' for '+p.items[1].amount+' '+p.unit,'op'),
   card('MATHEMATICAL VERDICT',explore?(chosen?(chosen==='equal'?'Both packs':chosen+' selected'):'Your choice?'):solved||(!challenge&&step>=5)?(winner(p)==='equal'?'Equal value':'Pack '+winner(p)):'?','The lowest pence per equal amount wins.','result'));
 layout.append(art,aside);stage.append(layout);N.scene.helperStrip(stage,o.pose||'explain',o.caption||'Compare the same quantity for a fair result.');return svg;
}
function teach(i,stage){const p=C.presets[C.preset];
 const messages=[
  `Pack A costs ${pounds(p.items[0].pricePence)} for ${p.items[0].amount} ${p.unit}. Pack B costs ${pounds(p.items[1].pricePence)} for ${p.items[1].amount} ${p.unit}. Which is really cheaper for the same quantity?`,
  `We will compare them per ${p.compareLabel}. Both packs must use the same comparison amount so this is fair.`,
  `For Pack A, divide ${p.items[0].pricePence} pence by ${p.items[0].amount}, then multiply by ${p.compareAmount}. That is ${pf(unit(p,0))} pence per ${p.compareLabel}.`,
  `Now repeat for Pack B: ${p.items[1].pricePence} divided by ${p.items[1].amount}, multiplied by ${p.compareAmount}, is ${pf(unit(p,1))} pence per ${p.compareLabel}.`,
  'Draw both bars for the same comparison amount. The shorter cost bar shows which pack offers better value, not which one has the lowest shelf price.',
  winner(p)==='equal'?'The unit prices are equal. That means either pack is equally good value.':`Pack ${winner(p)} is the better buy because its cost for each ${p.compareLabel} is lower. Always show the unit-price evidence.`
 ];STEPS[i].narration=messages[i];emit('step',{preset:C.preset,index:i});draw(stage,p,{step:i,mode:'watch',pose:STEPS[i].pose,caption:STEPS[i].caption});}
function btn(text,fn,cls='nova-btn'){return H('button',{text,class:cls,onclick:fn});}
function explore(panel,stage){let id=C.preset,chosen=null,message='Drag the best-buy ring to Pack A or Pack B. Work out unit prices first.';
 const select=H('select',{'aria-label':'Best-buy scenario'});Object.entries(C.presets).forEach(([k,p])=>select.append(H('option',{value:k,text:p.label})));select.value=id;
 const controls=H('div',{class:'f606-controls'}),actions=H('div',{class:'f606-controls'}),feedback=H('p',{class:'f606-feedback','aria-live':'polite'});
 controls.append(H('label',{class:'f606-field'},['Product comparison',select]));actions.append(btn('Check choice',check,'nova-btn primary'),btn('Equal value',()=>choose('equal')),btn('Hint',hint),btn('Remove marker',remove),btn('Reset',reset));
 panel.append(controls,actions,H('p',{class:'f606-instructions',text:'Drag the glowing ring onto a product. Keyboard: focus it and press A, B or E (equal). Press Delete to remove a placed ring. Red RETURN zone removes it too.'}),feedback);
 function p(){return C.presets[id];}function paint(pose='point',caption='Find the smaller unit price.'){
  draw(stage,p(),{mode:'explore',id,chosen,onChoose:choose,onRemove:remove,pose,caption});feedback.textContent=message;}
 function choose(w){chosen=w;message=w==='equal'?'You selected equal value. Check whether both pence-per-unit prices really match.':'You selected Pack '+w+'. Check the cost for the same amount on both packs.';emit('selection',{preset:id,choice:chosen});paint('checking','Now prove it using the bars.');}
 function remove(){chosen=null;message='Marker returned. Compare the price per '+p().compareLabel+' again.';emit('removed',id);paint('not-yet','Try a different comparison.');}
 function check(){const good=chosen===winner(p());let msg;
 if(chosen==null)msg='Choose Pack A, Pack B or Equal value before checking.';
 else if(good)msg='Correct! Pack '+(chosen==='equal'?'A and Pack B give equal value.':chosen+' is cheaper for the same '+p().compareLabel+'.')+' Show the unit prices as evidence.';
 else if(chosen==='equal')msg='Not quite: these unit prices differ. Calculate price ÷ amount × '+p().compareAmount+' for each.';
 else{const q=p(),pick=chosen==='A'?0:1,other=1-pick;msg=q.items[pick].pricePence<q.items[other].pricePence?'You may have chosen the lower shelf price. Compare both packs per '+q.compareLabel+'.':'The pack size may look better. Compare the actual price PER '+q.compareLabel+'.';}
 message=msg;emit('check',{correct:good,chosen,expected:winner(p()),preset:id});N.events.emit('correct',{engine:ID,correct:good,mode:'explore'});paint(good?'celebrate':'not-yet',good?'Excellent unit-price reasoning.':'Think in equal units.');feedback.classList.toggle('good',good);feedback.classList.toggle('bad',!good);if(good){const svg=stage.querySelector('svg');if(svg)M.flash(svg,coords(innerWidth<=760).w/2,coords(innerWidth<=760).unitTop,'result',65);}}
 function hint(){message='Find the cost of '+p().compareLabel+': price in pence ÷ pack amount × '+p().compareAmount+'. Lower unit price means better value.';emit('hint',id);N.events.emit('hintUsed',{engine:ID,preset:id});paint('idea','Same quantity for both products.');}
 function reset(){chosen=null;message='Both choices cleared. Decide from the cost per '+p().compareLabel+'.';emit('reset',id);paint('explain','Start with a fair comparison.');}
 select.onchange=()=>{id=select.value;C.preset=id;chosen=null;message=p().context;emit('preset',id);paint('explain','Compare the same amount.');};
 C._explore={get:()=>({id,chosen,message}),choose,remove,check,hint,reset,setPreset:k=>{select.value=k;select.onchange();}};paint();}
function challenge(panel,api,stage){const keys=Object.keys(C.presets);let ix=0,done=0,ok=false,attempts=0;
 const title=H('p',{class:'f606-question'}),progress=H('p',{class:'f606-progress'}),fields=H('div',{class:'f606-fields'});
 const a=H('input',{type:'text',inputmode:'decimal',placeholder:'Enter pence','aria-label':'Pack A pence per comparison amount'}),b=H('input',{type:'text',inputmode:'decimal',placeholder:'Enter pence','aria-label':'Pack B pence per comparison amount'});
 const pick=H('select',{'aria-label':'Best buy choice'});[['','Choose one…'],['A','Pack A'],['B','Pack B'],['equal','Equal value']].forEach(([v,t])=>pick.append(H('option',{value:v,text:t})));
 const aLab=H('label',{class:'f606-answer-field'},[H('span',{text:'PACK A · pence per '+C.presets[keys[0]].compareLabel}),a]),bLab=H('label',{class:'f606-answer-field'},[H('span',{text:'PACK B · pence per '+C.presets[keys[0]].compareLabel}),b]),cLab=H('label',{class:'f606-answer-field'},[H('span',{text:'BEST BUY'}),pick]);fields.append(aLab,bLab,cLab);
 const feedback=H('p',{class:'f606-feedback','aria-live':'polite'}),actions=H('div',{class:'f606-controls'}),checkBtn=btn('Check best buy',verify,'nova-btn primary'),nextBtn=btn('Next comparison',next),hintBtn=btn('Hint',hint);nextBtn.disabled=true;actions.append(checkBtn,hintBtn,nextBtn);panel.append(title,fields,actions,feedback,progress);
 function p(){return C.presets[keys[ix]];}
 function drawC(){const q=p();title.textContent='Comparison '+(ix+1)+' of '+keys.length+' · '+q.context+' Calculate unit prices in pence.';progress.textContent='Comparisons solved: '+done+' / '+keys.length; aLab.querySelector('span').textContent='PACK A · pence per '+q.compareLabel;bLab.querySelector('span').textContent='PACK B · pence per '+q.compareLabel;draw(stage,q,{mode:'challenge',id:keys[ix],step:ok?5:1,solved:ok,pose:ok?'celebrate':'think',caption:ok?'Unit prices show the best buy!':'Find the unit costs before choosing.'});}
 function number(input){const t=input.value.trim().replace(',','.').replace(/p$/i,'').trim();return t!==''&&Number.isFinite(Number(t))?Number(t):null;}
 function verify(){if(ok)return;attempts++;const q=p(),va=number(a),vb=number(b),ea=unit(q,0),eb=unit(q,1);let msg='',good=false;
 if(va==null||vb==null)msg='Enter BOTH prices in pence per '+q.compareLabel+', not total shelf prices.';
 else if(Math.abs(va-ea)>.011||Math.abs(vb-eb)>.011){
  const i=Math.abs(va-ea)>.011?0:1,val=i===0?va:vb,item=q.items[i],trueVal=i===0?ea:eb;
  if(Math.abs(val-item.pricePence/100)<.011)msg='You wrote pounds instead of pence. Convert the shelf price to pence before calculating.';
  else if(Math.abs(val-item.pricePence)<.011)msg='That is the whole shelf price. Divide by the pack amount, then multiply by '+q.compareAmount+'.';
  else if(Math.abs(val-item.amount/item.pricePence*q.compareAmount)<.011)msg='You have inverted the division. It is price ÷ amount, not amount ÷ price.';
  else msg='Recheck Pack '+(i?'B':'A')+': '+item.pricePence+' pence ÷ '+item.amount+' '+q.unit+' × '+q.compareAmount+' = price per '+q.compareLabel+'.';
 }else if(!pick.value)msg='Both unit prices are correct. Now choose the pack with the lower unit price, or Equal value if they match.';
 else if(pick.value!==winner(q))msg='Your unit prices are correct, but the decision is not. Compare '+pf(ea)+'p and '+pf(eb)+'p per '+q.compareLabel+'.';
 else{good=true;msg='Correct! '+pf(ea)+'p versus '+pf(eb)+'p per '+q.compareLabel+'. '+(winner(q)==='equal'?'Both packs offer equal value.':'Pack '+winner(q)+' is the better value.');}
 api.check(good,msg,{preset:keys[ix],expected:{unitA:round(ea),unitB:round(eb),best:winner(q)},answers:[va,vb,pick.value]});emit('check',{preset:keys[ix],correct:good});feedback.textContent=msg;feedback.classList.toggle('good',good);feedback.classList.toggle('bad',!good);if(good){ok=true;done++;checkBtn.disabled=true;nextBtn.disabled=false;drawC();}}
 function hint(){const q=p();const msg='Use pence per '+q.compareLabel+'. For each pack: price in pence ÷ pack size × '+q.compareAmount+'. Compare the answers, not the shelf prices.';api.hint(msg);emit('hint',keys[ix]);N.events.emit('hintUsed',{engine:ID,preset:keys[ix]});feedback.textContent=msg;}
 function next(){if(!ok)return;if(ix===keys.length-1){title.textContent='You have compared all five pairs with mathematical evidence.';fields.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'BEST-BUY EXPERT');N.scene.helperStrip(stage,'celebrate','Brilliant comparing!');feedback.textContent='Unit prices let you compare unequal pack sizes fairly.';return;}
 ix++;ok=false;[a,b].forEach(x=>x.value='');pick.value='';feedback.textContent='';checkBtn.disabled=false;nextBtn.disabled=true;drawC();}
 [a,b,pick].forEach(x=>x.addEventListener('keydown',e=>{if(e.key==='Enter')verify();}));C._challenge={get:()=>({index:ix,done,ok,attempts,feedback:feedback.textContent}),setAnswers:(va,vb,w)=>{a.value=va;b.value=vb;pick.value=w;},check:verify,hint,next};drawC();}
const DEF={id:ID,title:'Best-Buy Comparer · Unit Price',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'Two neon-glass product packs with shelf price and quantity, two linked neon unit-price bars, and a draggable best-buy ring. Selecting a pack requires a fair equal-unit comparison.',
 staticAlt:'Fair comparison: price per shared unit = shelf price in pence divided by pack amount, multiplied by the comparison amount. Choose the smaller price per unit, or recognise equal value.',
 spec:{purpose:'Compare different pack sizes by calculating and interpreting unit prices in pence per equal quantity.',params:'Two shelf prices in pence, two pack quantities, unit of measure, comparison quantity, product display category, five realistic contexts.',presets:'Y7-061 unit price and best buy: pasta, cereal, juice, soap and equal-value oat bars.',steps:'Inspect both packs → choose comparison unit → calculate first unit price → calculate second unit price → draw linked price bars → prove best value.',interactions:'Drag a neon-ring selector to one of two product cards; re-grab and remove in red tray; A/B/E keyboard selection; HTML Equal Value button; two numeric unit-price inputs and best-buy answer selection in Challenge.',traps:'Comparing shelf prices instead of same quantity, assuming largest pack wins, price-amount division reversal, pounds/pence conversion, failure to recognise equal unit prices.',gcse:'Extend to discounts, multi-buy, price per kilogram/litre, currency conversion, algebraic rates and percentage saving.'}};
N.bankMount({id:ID,num:'F6·06',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Year 7; GCSE unit price extension',linked:['F0-02','F0-04','F0-05','F0-08','F5-14','F6-01','F6-02','F6-03','F6-05']});
})();
