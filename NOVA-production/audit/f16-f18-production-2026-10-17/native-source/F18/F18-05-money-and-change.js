
/* NOVA F18-05 MONEY AND CHANGE · Engine only; shared core embedded unchanged */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-05';
var DENOMS=[2000,1000,500,200,100,50,20,10,5,2,1];
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F18_05_CONFIG={startMode:'watch',preset:'till',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','coin','amount','offer','answer'],presets:{
 till:{label:'Y7 · Correct change at the till',short:'Till · £10 payment',type:'change',cost:635,paid:1000,amount:365,denoms:[200,100,50,20,10,5],caption:'Notebook and pencils',note:'Pay £10.00 for a £6.35 purchase. Build the change from the coins.'},
 cafe:{label:'Y7 · Notes, coins and mixed change',short:'Café · £20 payment',type:'change',cost:1385,paid:2000,amount:615,denoms:[500,100,50,20,10,5],caption:'Lunch at the café',note:'A lunch costs £13.85. Pay with £20.00 and count back the change.'},
 unit:{label:'Y7 · Best buy and unit prices',short:'Shop · Best buy',type:'unit',amount:5,offers:[{name:'Pack A',count:4,price:320},{name:'Pack B',count:6,price:450}],correctOffer:1,denoms:[100,50,20,10,5,1],caption:'Compare yogurt multipacks',note:'Four yogurts cost £3.20; six cost £4.50. Compare the price PER yogurt.'},
 budget:{label:'Y8 · Wages and spending budget',short:'Budget · Weekly wages',type:'budget',gross:9800,bills:2565,amount:7235,denoms:[5000,2000,200,100,20,10,5],caption:'Weekly spending budget',note:'Your weekly wages are £98.00. Allow £25.65 for travel and food. What remains?'},
 discount:{label:'Y8 · Sale price and change',short:'Sale · 15% discount',type:'discount',cost:2000,percentage:15,amount:1700,denoms:[1000,500,200,100,20,10],caption:'Jacket sale',note:'A £20.00 jacket is reduced by 15%. Work out the new price, not the reduction.'},
 cash:{label:'Y8 · Checkout subtraction',short:'Checkout · £20 payment',type:'change',cost:1290,paid:2000,amount:710,denoms:[500,200,100,50,20,10],caption:'Sports equipment',note:'The total is £12.90 and the customer pays £20.00. Count back exactly.'}
}});
function pkey(k){return CONFIG.presets[k]||CONFIG.presets.till;}
function money(v){return '£'+(v/100).toFixed(2);}
function coinName(v){return v>=100?'£'+(v/100).toFixed(v%100?2:0):v+'p';}
function fire(key,value){N.events.emit('value',{engine:ID,key:key,value:value});}
function label(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,String(t),{role:role||'given',size:size||20,anchor:anchor||'middle'});}
function line(p,x,y,x2,y2,role,w){return N.neonLine(p,x,y,x2,y2,{role:role||'support',width:w||2.5});}
function path(p,d,role,w,fill){return N.neonPath(p,d,{role:role||'op',width:w||3,fill:!!fill});}
function dims(){return window.innerWidth<=560?{W:400,H:681,margin:19,deskY:85,deskH:130,tokenY:[318,388],bayY:445,bayH:189,tokenR:34}: {W:654,H:655,margin:25,deskY:83,deskH:128,tokenY:[315,390],bayY:448,bayH:165,tokenR:34};}
function state(k){return {key:k,p:pkey(k),placed:[],offer:null,message:''};}
function sum(s){return s.placed.reduce(function(a,b){return a+b;},0);}
function setCoin(s,v,op){if(op==='add'){if(s.placed.length>=9){s.message='Choose a larger coin or note first: the counting mat has nine places.';return false;}s.placed.push(v);}else{var i=s.placed.indexOf(v);if(i<0)return false;s.placed.splice(i,1);}s.message='';fire('coin',op+' '+coinName(v));fire('amount',sum(s));return true;}
function circle(p,cx,cy,r,role){return path(p,'M '+(cx-r)+' '+cy+' a '+r+' '+r+' 0 1 0 '+(2*r)+' 0 a '+r+' '+r+' 0 1 0 -'+(2*r)+' 0',role,3,true);}
function stampToken(svg,d,v,x,y,kind,idx,o){var note=v>=500,role=v>=500?'given':v>=100?'focus':v>=20?'op':'result';var w=note?86:66,hh=note?55:66,group=E('g',{class:'f1805-coin',tabindex:o.drag?'0':'-1',role:o.drag?'button':'img','data-value':v,'data-kind':kind,'aria-label':coinName(v)+(kind==='source'?' available. Drag or press Enter to add.':' placed. Drag to cash tray or press Delete to remove.')},svg);
 if(note){N.neonBox(group,x-w/2,y-hh/2,w,hh,{role:role,r:10});E('rect',{x:x-w/2+7,y:y-hh/2+7,width:14,height:hh-14,rx:5,css:'fill:'+S.c(role)+'33;pointer-events:none'},group);label(group,x+7,y+6,coinName(v),role,19);}else{circle(group,x,y,29,role);circle(group,x,y,23,'given');label(group,x,y+7,coinName(v),role,19);}
 if(!o.drag)return group;
 var source=kind==='source',tray={id:'tray',kind:'remove',x:18,y:d.tokenY[0]-39,w:d.W-36,h:125},bay={id:'bay',kind:'drop',x:24,y:d.bayY+9,w:d.W-48,h:d.bayH-18};
 N.ui.svgDrag(svg,group,{box:{x:x-w/2,y:y-hh/2,w:w,h:hh},zones:function(){return source?[bay]:[bay,tray];},removeTo:{x:x,y:y},onDrop:function(z){if(z!=='bay')return false;if(source){var ok=setCoin(o.state,v,'add');if(ok){o.refresh();return true;}return false;}return true;},onRemove:function(){if(!source){o.state.placed.splice(idx,1);fire('coin','remove '+coinName(v));fire('amount',sum(o.state));o.state.message='';o.refresh();}}});
 // Match the F18-01/02 local capture stabilisation; pointer capture stays with the SVG token.
 group.addEventListener('pointerdown',function(ev){if(N.ui._drag&&N.ui._drag.el===group){try{group.setPointerCapture(ev.pointerId);}catch(_){}}});
 group.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();if(source){setCoin(o.state,v,'add');o.refresh();}else{setCoin(o.state,v,'remove');o.refresh();}}else if((ev.key==='Delete'||ev.key==='Backspace')&&!source){ev.preventDefault();o.state.placed.splice(idx,1);fire('coin','remove '+coinName(v));fire('amount',sum(o.state));o.refresh();}else if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();var nodes=[].slice.call(svg.querySelectorAll('[data-kind="'+kind+'"]'));if(nodes.length){var j=nodes.indexOf(group),next=nodes[(j+(ev.key==='ArrowRight'?1:-1)+nodes.length)%nodes.length];if(next)next.focus();}}});
 return group;
}
function calcText(s,hide){var p=s.p;
 if(p.type==='unit')return hide?'Which pack costs less per item?':('Pack B saves '+coinName(p.amount)+' per yogurt');
 if(p.type==='budget')return hide?'Work out the money remaining':money(p.gross)+' − '+money(p.bills)+' = '+money(p.amount);
 if(p.type==='discount')return hide?'Find the sale price':('15% of '+money(p.cost)+' = '+money(p.cost*p.percentage/100)+' off');
 return hide?'Count up from the price':money(p.paid)+' − '+money(p.cost)+' = '+money(p.amount);
}
function receipt(svg,d,s,o){var p=s.p,hide=!!o.hideAnswers,mid=d.W/2,NW=d.W-2*d.margin;
 N.neonBox(svg,d.margin,d.deskY,NW,d.deskH,{role:'given',r:16});
 label(svg,mid,d.deskY+30,p.caption,'given',21);
 line(svg,d.margin+21,d.deskY+42,d.W-d.margin-21,d.deskY+42,'support',1.6);
 if(p.type==='unit'){
  label(svg,mid-87,d.deskY+69,'4 for £3.20','focus',19);label(svg,mid+87,d.deskY+69,'6 for £4.50','op',19);
  label(svg,mid-88,d.deskY+100,'Pack A','given',18);label(svg,mid+86,d.deskY+100,'Pack B','given',18);
 }else if(p.type==='budget'){
  label(svg,mid-91,d.deskY+70,'Wages','given',19);label(svg,mid+89,d.deskY+70,'Spending','given',19);
  label(svg,mid-88,d.deskY+102,money(p.gross),'focus',23);label(svg,mid+89,d.deskY+102,money(p.bills),'op',23);
 }else if(p.type==='discount'){
  label(svg,mid-88,d.deskY+68,'Original','given',19);label(svg,mid+90,d.deskY+68,'Sale reduction','given',19);
  label(svg,mid-88,d.deskY+99,money(p.cost),'focus',23);label(svg,mid+88,d.deskY+99,p.percentage+'%','op',23);
 }else{
  label(svg,mid-90,d.deskY+68,'Price','given',19);label(svg,mid+90,d.deskY+68,'You pay','given',19);
  label(svg,mid-90,d.deskY+99,money(p.cost),'focus',23);label(svg,mid+90,d.deskY+99,money(p.paid),'op',23);
 }
}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Money and change',o.tag||'COUNT · PAY · CHECK');var wrap=h('div',{class:'f1805-layout'}),plot=h('div',{class:'f1805-plot'}),side=h('div',{class:'f1805-side'});wrap.appendChild(plot);wrap.appendChild(side);stage.appendChild(wrap);var d=dims(),svg=S.root(d.W,d.H,'NOVA money and change: neon coins and notes on an interactive cash counting mat');svg.classList.add('f1805-svg');plot.appendChild(svg);var p=s.p,hide=!!o.hideAnswers,active=s.placed.length;
 label(svg,d.W/2,35,'Money and change','op',27);
 line(svg,d.margin+12,56,d.W-d.margin-12,56,'focus',3.1);
 receipt(svg,d,s,o);
 N.neonBox(svg,d.margin+8,230,d.W-2*d.margin-16,49,{role:hide?'unknown':'result',r:12});
 label(svg,d.W/2,261,hide?'Find the correct amount':(o.countValue!=null?money(o.countValue):calcText(s,false)),hide?'unknown':'result',d.W===400?20:22);
 var values=p.denoms.filter(function(v){return v>0;});values.forEach(function(v,i){var x=d.W*(i%3+1)/4,y=d.tokenY[Math.floor(i/3)%2];stampToken(svg,d,v,x,y,'source',i,{drag:o.drag,state:s,refresh:o.refresh});});
 N.neonBox(svg,d.margin,d.bayY,d.W-2*d.margin,d.bayH,{role:'result',r:17});
 label(svg,d.W/2,d.bayY+29,'Change counting mat','given',21);
 if(s.placed.length){s.placed.forEach(function(v,i){var c=i%4,row=Math.floor(i/4),x=d.margin+48+(d.W-2*d.margin-96)*c/3,y=d.bayY+80+row*73;stampToken(svg,d,v,x,y,'placed',i,{drag:o.drag,state:s,refresh:o.refresh});});}
 else label(svg,d.W/2,d.bayY+109,o.drag?'Drag or Enter to add money':'Watch the coins arrive','unknown',18);
 if(!hide){label(svg,d.W/2,d.bayY+d.bayH-19,'Counted: '+money(sum(s)),'result',21);}
 else {label(svg,d.W/2,d.bayY+d.bayH-19,active?'Coins selected: '+active:'Build your answer','unknown',19);}
 function sidecard(k,v,kind){var card=h('div',{class:'f1805-card'});if(kind)card.setAttribute('data-'+kind,'');card.appendChild(h('small',{text:k}));card.appendChild(h('strong',{text:v}));side.appendChild(card);}
 sidecard('SCENARIO',p.type==='unit'?'Compare unit prices':p.type==='budget'?'Weekly money plan':p.type==='discount'?'Percent discount':'Cash transaction');
 sidecard('KNOWN',p.type==='unit'?'£3.20 for 4 · £4.50 for 6':p.type==='budget'?money(p.gross)+' gross':p.type==='discount'?'15% off £20':money(p.paid)+' paid');
 sidecard('METHOD',p.type==='unit'?'Price ÷ number':p.type==='budget'?'Wages − spending':p.type==='discount'?'Original − discount':'Payment − price');
 sidecard('ANSWER',hide?'Calculate it':calcText(s,false),hide?'hidden':'result');
 side.appendChild(h('div',{class:'f1805-note',text:hide?'Find the value yourself, enter it with its money unit, and match it with the coins.':p.note}));
 N.scene.helperStrip(stage,o.pose||'explain',o.say||'The amount of money matters, and the units matter too.');
 return svg;
}
var steps=[
 {name:'Look at the purchase',pose:'explain',narration:'A notebook and pencils cost six pounds and thirty-five pence. We pay using a ten-pound note.',prompt:'What is the item cost?',say:'First check the price tag. Six pounds and thirty-five pence is the cost.'},
 {name:'Show the payment',pose:'point-down',narration:'The customer pays ten pounds. The shop must return the difference.',prompt:'Is the amount paid larger than the price?',say:'The customer gives ten pounds, so we need to find what remains after paying.'},
 {name:'Find the difference',pose:'think',narration:'Subtract the six pounds and thirty-five pence from ten pounds. The change is three pounds and sixty-five pence.',prompt:'Why do we subtract the price from the payment?',say:'Change is payment minus cost. Keep pounds and pence aligned as you subtract.'},
 {name:'Count the pounds',pose:'count',narration:'Start counting the change with two pounds, then add one more pound.',prompt:'What total do two pounds and one pound make?',say:'Two pounds and another pound give three pounds. We still need sixty-five pence.'},
 {name:'Count the pence',pose:'point-right',narration:'Add fifty pence, ten pence and five pence. Together these make sixty-five pence.',prompt:'Which smaller coins complete the change?',say:'Fifty, ten and five pence make sixty-five pence exactly.'},
 {name:'Check the answer',pose:'celebrate',narration:'Three pounds and sixty-five pence plus six pounds and thirty-five pence makes ten pounds. The change is correct.',prompt:'How can you prove the change is right?',say:'Check by adding the price and the change. We land back on ten pounds.'}
];
function watchRender(i,stage){var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watchRender.s",(...a)=>state(...a),['till']):(state('till'))),values=[200,100,50,10,5],n=i<3?0:i===3?2:i===4?5:5;s.placed=values.slice(0,n);var svg=scene(stage,s,{title:'Watch money being counted',tag:'STEP '+(i+1)+' / '+steps.length,hideAnswers:i<2,pose:steps[i].pose,say:steps[i].say,countValue:i<3?0:sum(s)});var d=dims();if(i===0||i===1){M.flash(svg,d.W/2,d.deskY+100,'given',22);}if(i===2){M.flash(svg,d.W/2,252,'op',26);}if(i>=3){M.flash(svg,d.W/2,d.bayY+65,'result',25);}if(i===5){var counted=[].slice.call(svg.querySelectorAll('text')).find(function(t){return t.textContent.indexOf('Counted: ')===0;});if(counted)M.tween(750,function(k){counted.textContent='Counted: '+money(Math.round(365*k));},M.ease.out);N.neonRing(svg,d.W-35,d.bayY+25,{role:'result',r:8});}}
function parseAnswer(input,per){var x=String(input||'').trim().replace(/\s+/g,' ').toLowerCase();var m=x.match(/^(£\s*)?(\d{1,5})(?:\.(\d{1,2}))?\s*(p|pence|pounds?|gbp)?(?:\s*(?:per|\/)\s*(?:item|yogurt|each))?$/);if(!m)return {ok:false,why:'Enter pounds or pence explicitly, for example £3.65 or 365p.'};var sign=!!m[1],unit=m[4]||'',decimal=m[3]||'',n=Number(m[2]);if(sign&&unit==='p')return {ok:false,why:'Use one consistent unit. £ and p cannot both prefix the same amount.'};if(!sign&&!unit)return {ok:false,why:'Include £ or p. Money needs a unit.'};if(decimal&&!sign&&(/^(p|pence)$/.test(unit)))return {ok:false,why:'Enter pence as a whole number, such as 5p.'};var cents=sign||/^(pounds?|gbp)$/.test(unit)?n*100+Number((decimal+'00').slice(0,2)):n; if(!Number.isInteger(cents))return {ok:false,why:'Use an exact money amount.'};if(per&&!/(?:per|\/)\s*(?:item|yogurt|each)$/.test(x))return {ok:false,why:'State the unit rate, for example 5p per item.'};return {ok:true,cents:cents};}
function diagnosis(task,raw,selected,coins){var p=pkey(task.preset),parsed=parseAnswer(raw,task.unit),actual=coins==null?null:coins;
 if(!parsed.ok)return [false,parsed.why];
 if(task.unit&&selected!==p.correctOffer)return [false,'For best buy, compare cost PER item. Pack A costs 80p each; Pack B costs 75p each. Select the better-value pack.'];
 if(parsed.cents!==task.expected){var v=parsed.cents;
  if(task.preset==='discount'&&v===300)return [false,'£3.00 is the discount, not the sale price. Subtract £3.00 from £20.00.'];
  if(task.preset==='unit'&&(v===75||v===80))return [false,'That is one pack’s price per yogurt. The question asks how much cheaper the best-value pack is per yogurt.'];
  if(task.preset==='budget'&&v===2565)return [false,'£25.65 is the spending, not the balance remaining after spending.'];
  if((p.type==='change')&&v===p.cost)return [false,'That is the price, not the change. Subtract the cost from what the customer paid.'];
  if(p.type==='change'&&v===p.paid+p.cost)return [false,'Adding the payment and the price does not give change. Subtract the price.'];
  if(v===task.expected*100)return [false,'Check pounds and pence: one pound contains 100 pence. You may have multiplied by 100 twice.'];
  if(v*100===task.expected)return [false,'You may have entered pounds as pence. Check the £ or p unit carefully.'];
  return [false,'Recheck the amounts: '+(p.type==='unit'?'price per item is pack cost divided by item count.':p.type==='budget'?'deduct spending from wages.':p.type==='discount'?'subtract the reduction from the original price.':'change is money paid minus the price.')];}
 if(actual!==task.expected)return [false,actual===0?'Place coins or notes into the counting mat as well as entering the answer.':'Your written answer is right, but your coins total '+money(actual)+'. Check your denominations.'];
 return [true,'Correct: the written amount, units and money in the counting mat all agree.'];}
var tasks=[
 {preset:'till',q:'A purchase costs £6.35. You pay £10.00. Build the change and enter it with £ or p.',expected:365,hint:'Count £6.35 up to £10.00, or subtract in pence: 1000p − 635p.'},
 {preset:'cafe',q:'Lunch costs £13.85. Pay with £20.00. How much change? Build and enter the amount.',expected:615,hint:'£20.00 is 2000p. Take away 1385p, then express your result in money.'},
 {preset:'unit',q:'Which yogurt pack is better value, and by how much per item? Choose a pack, build the saving and enter pence per item.',expected:5,unit:true,hint:'Divide £3.20 by 4 and £4.50 by 6, then compare those two unit prices.'},
 {preset:'budget',q:'You earn £98.00 and spend £25.65. Build the balance and write the money remaining.',expected:7235,hint:'Think of pounds and pence as integer pence: 9800 − 2565.'},
 {preset:'discount',q:'A £20.00 jacket is 15% off. Build the NEW price and enter the answer.',expected:1700,hint:'15% of £20 is £3. Do not mistake the discount for the price after discount.'},
 {preset:'cash',q:'Sports equipment costs £12.90. A customer pays £20.00. Build and enter the change.',expected:710,hint:'Subtract £12.90 from £20.00, then use the notes and coins to represent the result.'}
];
var def={id:ID,title:'Money and change',config:CONFIG,steps:steps,render:watchRender,alt:'Premium neon coins and notes, glass receipt, counting mat and one stage mascot.',staticAlt:'A £6.35 purchase paid using £10.00 gives £3.65 change.',
 exploreIntro:'Select a shopping preset. Drag coins and notes to the counting mat or use Enter. Re-grab money to remove it, or use Delete. Compare your amount with the scenario.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",(...a)=>state(...a),[CONFIG.preset]):(state(CONFIG.preset))),select=h('select',{class:'nova-input','aria-label':'Money learning preset'}),status=h('div',{class:'f1805-status','aria-live':'polite'});window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){select.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();select.value=s.key;
 window.NovaLessonComponent?.applyExploreModels();function render(){scene(stage,s,{title:'Explore the money',tag:'DRAG · COUNT · REGRAB',drag:true,state:s,refresh:render,pose:sum(s)?'count':'point-down',say:s.message||(!s.placed.length?'Pick a denomination from the tray and place it on the counting mat.':'You have '+money(sum(s))+'. Compare that total with the amount you need.')});status.textContent=s.message||(s.p.note+'  You have counted '+money(sum(s))+'. '+(sum(s)===s.p.amount?'That matches the target.':'Target: '+money(s.p.amount)+'.'));status.toggleAttribute('data-good',sum(s)===s.p.amount);}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=function(){s=state(select.value);CONFIG.preset=select.value;fire('preset',select.value);render();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'f1805-row'},['Money preset ',select]));window.NovaLessonComponent?.applyExploreModels();var controls=h('div',{class:'f1805-controls'},[h('button',{class:'nova-btn',text:'Clear counting mat',onclick:function(){s.placed=[];fire('amount',0);render();}}),h('button',{class:'nova-btn',text:'Undo last coin',onclick:function(){if(s.placed.length){var v=s.placed.pop();fire('coin','undo '+coinName(v));fire('amount',sum(s));render();}}})]);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(controls);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={state:function(){return {preset:s.key,coins:s.placed.slice(),total:sum(s),target:s.p.amount};},select:function(k){select.value=k;select.onchange();},add:function(v){if(s.p.denoms.indexOf(v)>=0)setCoin(s,v,'add');render();},clear:function(){s.placed=[];render();},remove:function(v){setCoin(s,v,'remove');render();}};
 },
 challenge:function(panel,api,stage){var i=0,t=tasks[0],s=state(t.preset),question=h('p',{class:'pr-task'}),answer=h('input',{class:'nova-input',type:'text',placeholder:'Answer including £ or p','aria-label':'Your answer with money unit'}),offerbox=h('div',{class:'f1805-controls'}),status=h('div',{class:'f1805-status','aria-live':'polite'}),timer=null;
 function selectOffer(n){s.offer=n;fire('offer',n);offerbox.querySelectorAll('button').forEach(function(b,k){b.setAttribute('aria-pressed',String(n===k));});}
 function render(celebrate){scene(stage,s,{title:'Money challenge '+(i+1)+' / '+tasks.length,tag:'BUILD · CALCULATE · CHECK',hideAnswers:true,drag:true,refresh:render,pose:celebrate?'celebrate':'read-tablet',say:celebrate?'Great work! The money in the counting mat agrees with your written amount.':'Work out the money yourself. Add coins that match, then enter the amount with its unit.'});}
 function load(){t=tasks[i];s=state(t.preset);question.textContent=(i+1)+' / '+tasks.length+' · '+t.q;answer.value='';status.textContent='';status.removeAttribute('data-good');status.removeAttribute('data-bad');offerbox.innerHTML='';if(t.unit){offerbox.appendChild(h('span',{text:'Better value: '}));s.p.offers.forEach(function(o,n){offerbox.appendChild(h('button',{class:'nova-btn',text:o.name,'aria-pressed':'false',onclick:function(){selectOffer(n);}}));});}render();}
 function check(){var out=diagnosis(t,answer.value,s.offer,sum(s));status.textContent=out[1];status.toggleAttribute('data-good',out[0]);status.toggleAttribute('data-bad',!out[0]);fire('answer',answer.value);api.check(out[0],out[1],{task:i,preset:t.preset});if(out[0]){render(true);N.neonRing(stage.querySelector('.f1805-svg'),dims().W-32,240,{role:'result',r:9});if(i<tasks.length-1){if(timer)clearTimeout(timer);timer=setTimeout(function(){i++;load();},1250);}}}
 panel.appendChild(question);panel.appendChild(offerbox);panel.appendChild(h('label',{class:'f1805-row'},['Money answer ',answer]));panel.appendChild(h('div',{class:'f1805-controls'},[h('button',{class:'nova-btn primary',text:'Check money',onclick:check}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(t.hint);}}),h('button',{class:'nova-btn',text:'Reset question',onclick:load})]));panel.appendChild(status);load();api.onCleanup(function(){if(timer)clearTimeout(timer);});
 CONFIG._challenge={tasks:tasks,state:function(){return {task:i,preset:t.preset,coins:s.placed.slice(),total:sum(s),answer:answer.value,offer:s.offer};},task:function(k){if(timer)clearTimeout(timer);i=Math.max(0,Math.min(tasks.length-1,k));load();},add:function(v){if(s.p.denoms.indexOf(v)>=0)setCoin(s,v,'add');render();},offer:function(v){selectOffer(v);},solve:function(){s.placed=[];var a=t.expected;[...s.p.denoms].sort(function(x,y){return y-x;}).forEach(function(v){while(v<=a&&s.placed.length<9){s.placed.push(v);a-=v;}});if(t.unit)selectOffer(1);answer.value=t.unit?'5p per item':money(t.expected);render();return a;},check:function(txt,co,of){return diagnosis(t,txt==null?answer.value:txt,of==null?s.offer:of,co==null?sum(s):co);}};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"DENOMS":()=>DENOMS,"steps":()=>steps,"tasks":()=>tasks},draws:{"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"factory","factory":"state","argCount":1},"watchRender.s":{"kind":"factory","factory":"state","argCount":1}}});
N.bankMount({id:ID,num:'F18·05',title:'Money and change',def:def,years:'KS3 Year 7 unit price and best buy; Year 8 wages, deductions, spending and budgets.',linked:['F0-02','F0-03','F0-04','F18-02','F18-04'],spec:{purpose:'Represent exact amounts of money, calculate change in pence, compare unit prices and solve budget/sale-price problems.',params:'Integer-pence amounts, cash given, purchase price, available denominations, discount percentage, unit pack prices, wages and spending.',presets:'Till change; café change; unit-price best buy; weekly wages budget; sale discount; sports checkout.',steps:'Read price → identify payment → subtract → count pound coins → count pence → add back to check.',interactions:'WATCH narrated six-step animated demonstration; GUIDED scaffolded reasoning; EXPLORE real pointer and keyboard coin/notes placement; CHALLENGE six numerical and physical-money tasks.',traps:'Confusing price with change, adding instead of subtracting, incorrect pounds/pence conversions, selecting pack price rather than unit price, discount amount mistaken for discounted price, and failing to include monetary units.',gcse:'Compound budgeting, multi-buy comparison and multi-step percentage reductions.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5000);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

