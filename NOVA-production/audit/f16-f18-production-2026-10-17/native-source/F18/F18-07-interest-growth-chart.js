
/* NOVA F18-07 · Interest growth chart. Original NOVA shared core, unchanged. */
(function(){'use strict';
var N=NOVA,h=N.h,S=N.svg,E=S.el,M=N.motion,ID='F18-07';
var C=window.NovaV2Integration.configuration(window.NOVA_F18_07_CONFIG={preset:'first',startMode:'watch',events:['value','step','mode','correct','hintUsed'],valueKeys:['preset','principal','rate','years','yearSelection','reset','answer'],presets:{
 first:{label:'First savings · 5% for 5 years',p:20000,bp:500,years:5,desc:'Start with £200 and earn five percent each year. Simple interest always uses the original £200.'},
 holiday:{label:'Holiday fund · 8% for 3 years',p:15000,bp:800,years:3,desc:'A £150 savings goal earns eight percent. Compare the same yearly add-on with interest on the growing balance.'},
 regular:{label:'Junior saver · 3% for 5 years',p:40000,bp:300,years:5,desc:'Small annual percentages still build over time. Calculate three percent of the original £400.'},
 smaller:{label:'Low rate · 2% for 4 years',p:80000,bp:200,years:4,desc:'Two percent of £800 is £16. The simple-interest amount repeats every year.'},
 gcse:{label:'GCSE extension · 6% for 5 years',p:120000,bp:600,years:5,desc:'With compound interest, each new yearly percentage is calculated on the updated balance.'}
 }});
function fmt(n){return '£'+(n/100).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});}
function calc(p){var b=Math.round(p.p),rate=p.bp;var a=[{year:0,s:b,c:b,si:0,ci:0}];var c=b,each=Math.round(b*rate/10000);for(var y=1;y<=p.years;y++){c+=Math.round(c*rate/10000);a.push({year:y,s:b+each*y,c:c,si:each*y,ci:c-b});}return a;}
function emit(key,value){N.events.emit('value',{engine:ID,key:key,value:value});}
function data(k){return Object.assign({},C.presets[k]||C.presets.first);}
function state(k){return {key:k,p:data(k),chosen:null,placed:false,notice:''};}
function size(){return innerWidth<=590?{w:440,h:712,top:161,base:420,bottom:620,barMax:250}:{w:674,h:708,top:161,base:420,bottom:620,barMax:250};}
function box(q,x,y,w,hh,role,r){return N.neonBox(q,x,y,w,hh,{role:role||'given',r:r||12});}
function line(q,x,y,xx,yy,role,width){return N.neonLine(q,x,y,xx,yy,{role:role||'support',width:width||2.1});}
function tx(q,x,y,value,role,size,anchor){return N.chalkText(q,x,y,String(value),{role:role||'given',size:size||21,anchor:anchor||'middle'});}
function addCard(parent,label,value,role){var c=h('div',{class:'f1807-card'});if(role)c.setAttribute('data-'+role,'');c.appendChild(h('small',{text:label}));c.appendChild(h('strong',{text:value}));parent.appendChild(c);}
function chart(svg,d,s,opt){var p=s.p,arr=calc(p),mx=Math.max(arr[arr.length-1].ci,arr[arr.length-1].si),upper=Math.max(1,Math.ceil(mx/1000)*1000),n=p.years;var xx=function(y){return d.w*(d.w===440?.17:.145)+(y-1)*(d.w*(d.w===440?.66:.73)/(n-1||1));};
 // Original deposit is separate from earned interest. This axis reports the gain only.
 tx(svg,d.w/2,31,'Where does the interest come from?','focus',d.w===440?23:27);
 line(svg,32,48,d.w-32,48,'focus',3.2);
 box(svg,39,65,d.w-78,63,'given',14);tx(svg,d.w/2,91,'Starting savings   '+fmt(p.p),'given',d.w===440?21:24);tx(svg,d.w/2,115,(p.bp/100).toFixed(p.bp%100===0?0:2)+'% per year','op',20);
 tx(svg,d.w/2,151,'Interest earned (not the original savings)','given',d.w===440?19:21);
 line(svg,57,d.top,57,d.base,'support',2.3);line(svg,57,d.base,d.w-30,d.base,'support',3);
 for(var i=0;i<=3;i++){var v=Math.round(upper*i/3),y=d.base-d.barMax*i/3;line(svg,59,y,d.w-29,y,'support',1);tx(svg,49,y+6,'£'+Math.round(v/100),'support',d.w===440?20:18,'end');}
 var labelsRevealed=opt.reveal==null?n:opt.reveal, bw=d.w===440?(n>=6?13:n>=5?17:23):n>=6?23:29;
 for(var yr=1;yr<=n;yr++){
  if(yr>labelsRevealed)continue;
  var v=arr[yr],x=xx(yr),hs=v.si/upper*d.barMax,hc=v.ci/upper*d.barMax;
  // Two original neon/glass blocks via the core, no custom SVG boxes.
  box(svg,x-bw-2,d.base-hs,bw,Math.max(hs,3),'op',5);box(svg,x+3,d.base-hc,bw,Math.max(hc,3),'support',5);if(hc>20)line(svg,x+3+bw/2,d.base-hc+9,x+3+bw/2,d.base-7,'support',1.1);
  tx(svg,x,d.base+32,'Y'+yr,'given',d.w===440?21:21);
  if(yr===s.chosen){line(svg,x,d.top+7,x,d.base+3,'result',2);N.neonRing(svg,x,d.base+32,{role:'result',r:8});}
  if(opt.clickable){var hit=E('rect',{x:x-bw-8,y:d.top,width:bw*2+21,height:d.base-d.top+44,fill:'transparent','data-year':yr,tabindex:'0',role:'button','aria-label':'Inspect year '+yr},svg);
   hit.style.cursor='pointer';hit.addEventListener('click',function(event){var t=+event.currentTarget.getAttribute('data-year');choose(s,t,opt.refresh);});hit.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(s,+e.currentTarget.getAttribute('data-year'),opt.refresh);}});}
 }
 tx(svg,d.w/2,d.base+64,'Cyan = simple interest   Purple = compound','given',d.w===440?20:20);
 if(opt.drag){
  box(svg,36,554,d.w-72,112,'given',15);
  tx(svg,d.w/2,580,'Inspect a particular year','given',20);
  var selected=s.placed?s.chosen:null;
  if(selected){tx(svg,d.w/2,651,'Year '+selected+' placed — compare its growth','result',19);}
  else tx(svg,d.w/2,635,'Drag a year chip here','unknown',19);
  var trayY=518, chipW=d.w===440?52:68;
  for(var q=1;q<=n;q++){
   if(s.placed&&q===selected)continue;
   var px=xx(q),g=E('g',{class:'f1807-chip','data-year':q,'data-kind':'source',tabindex:'0',role:'button','aria-label':'Drag year '+q+' to inspection dock or press Enter'},svg);
   box(g,px-chipW/2,trayY-22,chipW,39,'op',10);tx(g,px,trayY+4,'Y'+q,'op',d.w===440?21:19);
   bindChip(svg,g,s,q,{x:px-chipW/2,y:trayY-22,w:chipW,h:39},{x:38,y:554,w:d.w-76,h:110},opt);
  }
  if(s.placed){var x=d.w/2,yr=s.chosen,gr=E('g',{class:'f1807-chip','data-year':yr,'data-kind':'placed',tabindex:'0',role:'button','aria-label':'Year '+yr+' in dock. Drag to red return zone or press Delete'},svg);
   box(gr,x-35,587,70,43,'result',10);tx(gr,x,614,'Y'+yr,'result',22);
   bindChip(svg,gr,s,yr,{x:x-35,y:587,w:70,h:43},{x:38,y:481,w:d.w-76,h:67},opt,true);
  }
  tx(svg,d.w/2,692,'Keyboard: focus year chip → Enter · Delete to return', 'support',d.w===440?15:18);
 }
}
function choose(s,y,refresh){s.chosen=y;s.placed=true;emit('yearSelection',y);refresh();}
function bindChip(svg,el,s,yr,bounds,target,opt,isPlaced){N.ui.svgDrag(svg,el,{box:bounds,zones:function(){return [{x:target.x,y:target.y,w:target.w,h:target.h,id:isPlaced?'remove':'dock',kind:isPlaced?'remove':'drop'}];},removeTo:{x:bounds.x+bounds.w/2,y:bounds.y+bounds.h/2},onDrop:function(z){if(!isPlaced&&z==='dock'){choose(s,yr,opt.refresh);return true;}return false;},onRemove:function(){if(isPlaced){s.chosen=null;s.placed=false;emit('yearSelection',null);opt.refresh();}}});
 el.addEventListener('pointerdown',function(e){if(N.ui._drag&&N.ui._drag.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});
 el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();if(isPlaced){s.chosen=null;s.placed=false;emit('yearSelection',null);opt.refresh();}else choose(s,yr,opt.refresh);}else if(isPlaced&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();s.chosen=null;s.placed=false;emit('yearSelection',null);opt.refresh();}else if(e.key.startsWith('Arrow')){e.preventDefault();var items=[].slice.call(svg.querySelectorAll('.f1807-chip'));var j=items.indexOf(el);var a=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1;var next=items[(j+a+items.length)%items.length];if(next)next.focus();}});
}
function scene(stage,s,o){
if(window.NovaLessonComponent?.active){[stage,s,o]=window.NovaLessonComponent.args("scene",arguments);}
o=o||{};stage.innerHTML='';N.cap(stage,o.title||'Interest growth chart',o.tag||'COMPARE · CALCULATE · VERIFY');var lay=h('div',{class:'f1807-layout'}),main=h('div',{class:'f1807-main'}),aside=h('div',{class:'f1807-side'});lay.appendChild(main);lay.appendChild(aside);stage.appendChild(lay);var d=size();if(!o.drag)d.h=603;var svg=S.root(d.w,d.h,'Premium neon bar chart showing simple and compound interest earned in pounds above original capital, over years.');svg.classList.add('f1807-svg');main.appendChild(svg);chart(svg,d,s,o);
 var a=calc(s.p),at=s.placed?s.chosen:s.p.years,v=a[at],hide=!!o.hideAnswers;
 addCard(aside,'STARTING CAPITAL',fmt(s.p.p));addCard(aside,'ANNUAL RATE',(s.p.bp/100)+'%');addCard(aside,'SIMPLE INTEREST AFTER '+at+' YRS',hide?'Find the amount':fmt(v.si),'simple');addCard(aside,'COMPOUND INTEREST AFTER '+at+' YRS',hide?'Compare the heights':fmt(v.ci),'compound');addCard(aside,'DIFFERENCE',hide?'Calculate first':fmt(v.ci-v.si),'result');
 aside.appendChild(h('div',{class:'f1807-note',text:hide?'Bars show the interest only. The original savings are not included in their heights.':s.p.desc}));
 if(o.drag)aside.appendChild(h('div',{class:'f1807-progress',text:s.placed?'Inspecting year '+s.chosen+'. Return it to the tray to pick another year.':'Drag a year to the inspection dock to reveal its values.'}));
 N.scene.helperStrip(stage,o.pose||'explain',o.say||'Simple interest uses the original saving each year. Compound interest uses the updated balance.');return svg;}
var steps=[
 {name:'Begin with the capital',pose:'explain',narration:'We are saving two hundred pounds at five percent a year. The original deposit is called the capital.',prompt:'What does five percent of two hundred pounds mean?',say:'Five percent means five in every hundred. Find that part of the original saving.'},
 {name:'Find one year of simple interest',pose:'count',narration:'Five percent of two hundred pounds is ten pounds. Simple interest adds ten pounds for each year.',prompt:'How much interest is earned in the first year?',say:'Two hundred pounds times five percent is ten pounds. The first year earns ten pounds.'},
 {name:'Repeat the same yearly gain',pose:'point-down',narration:'At two years, simple interest is twenty pounds. At three years, it is thirty pounds. The amount added each year stays ten pounds.',prompt:'Why are the cyan bars increasing at a steady pace?',say:'Simple interest always uses the starting amount, not last year’s total.'},
 {name:'Compare compounding',pose:'compare',narration:'Compound interest is different: after year one, we calculate the next five percent from two hundred and ten pounds.',prompt:'What would five percent of two hundred and ten pounds be?',say:'With compounding, the next year can earn more because previous interest is included.'},
 {name:'Reveal the growing difference',pose:'think',narration:'Over five years the purple compound bars grow slightly faster. Look at how their height separates from the cyan bars.',prompt:'Which method begins to earn more interest over time?',say:'The gap grows because compound interest earns interest on earlier interest.'},
 {name:'Calculate, compare and verify',pose:'celebrate',narration:'After five years, simple interest is fifty pounds. The compound gain, with annual penny rounding, is fifty-five pounds and twenty-seven pence.',prompt:'What must you add to either interest amount to find the final savings balance?',say:'Add the original two hundred pounds to the interest gained. Never confuse interest with final balance.'}
];
function watch(i,stage){var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.s",(...a)=>state(...a),['first']):(state('first')));s.chosen=i>=5?5:i>=3?3:i>=2?2:1;s.placed=true;var svg=scene(stage,s,{title:'Watch interest build year by year',tag:'STEP '+(i+1)+' / '+steps.length,pose:steps[i].pose,say:steps[i].say,reveal:i===0?1:i===1?1:i===2?3:i===3?3:i===4?5:5});var d=size();M.flash(svg,d.w/2,i<2?100:270,i>3?'unknown':'focus',27);if(i===5){N.neonRing(svg,d.w-42,101,{role:'result',r:10});var aside=stage.querySelector('.f1807-side');if(aside){var chip=N.answerChip('Compound gain  '+fmt(5527),true);chip.classList.add('f1807-answer');aside.appendChild(chip);var display=aside.querySelector('.f1807-card[data-compound] strong');if(display)M.tween(680,function(v){display.textContent=fmt(Math.round(5527*v));},M.ease.out);}}}
function parseMoney(v){var t=String(v||'').trim(),m=t.match(/^£\s*(\d{1,7})(?:\.(\d{1,2}))?$/);if(m)return {ok:true,v:+m[1]*100+ +(m[2]||'').padEnd(2,'0')};m=t.match(/^(\d{1,9})\s*(?:p|pence)$/i);if(m)return {ok:true,v:+m[1]};return {ok:false,msg:'Include money units, such as £50.00 or 5000p.'};}
var tasks=[
 {key:'first',year:3,kind:'simple',q:'£200 is saved at 5% simple interest for three years. How much INTEREST is earned? Select year 3.',hint:'Calculate 5% of £200, then add that amount three times.'},
 {key:'holiday',year:3,kind:'simple',q:'£150 at 8% simple interest for three years. What is the final BALANCE including the starting money?',hint:'Calculate the interest across three years, then add the original £150.' ,balance:true},
 {key:'regular',year:5,kind:'simple',q:'£400 earns 3% simple interest for five years. How much total INTEREST is earned?',hint:'Find £400 × 0.03; multiply the answer by five.'},
 {key:'smaller',year:4,kind:'simple',q:'£800 earns 2% simple interest over four years. What is the final BALANCE?',hint:'Simple interest each year is 2% of £800. Add four years of that to the capital.',balance:true},
 {key:'first',year:5,kind:'compound',q:'Extension: £200 earns 5% COMPOUND interest for five years, rounded to the nearest penny each year. How much INTEREST is earned?',hint:'Apply 5% to the new balance each year and subtract the original £200.'},
 {key:'gcse',year:5,kind:'difference',q:'Extension: £1,200 at 6% over five years. How much MORE interest is earned by compound than simple interest?',hint:'Work out the total interest for each method and subtract simple from compound.'}
];
function target(t){var a=calc(data(t.key))[t.year];return t.kind==='difference'?a.ci-a.si:t.kind==='compound'?(t.balance?a.c:a.ci):(t.balance?a.s:a.si);}
function diagnose(t,answer,s){var z=parseMoney(answer);if(!z.ok)return [false,z.msg];var p=data(t.key),a=calc(p)[t.year],e=target(t);if(z.v!==e){if(z.v===p.p&&(e!==p.p))return [false,'That is the original capital, not the answer. The question asks for interest or final balance.'];if(!t.balance&&z.v===p.p+e)return [false,'You included the starting money. The question asks only for the interest earned.'];if(t.balance&&z.v===e-p.p)return [false,'That is interest only. Add the starting savings to get the final balance.'];if(t.kind==='simple'&&z.v===a.ci)return [false,'That uses compound interest. Simple interest is based on the ORIGINAL amount every year.'];if(t.kind==='compound'&&z.v===a.si)return [false,'That uses simple interest. For compounding, recalculate interest on the new balance each year.'];if(t.kind==='difference'&&z.v===a.ci)return [false,'You found compound interest itself. Compare it with simple interest to get the difference.'];if(z.v===Math.round(p.p*p.bp/10000))return [false,'That is one year of interest. Multiply by the number of years for simple interest.'];return [false,'Check the rate, number of years and whether the question wants interest alone or the final balance.'];}
 if(!s.placed||s.chosen!==t.year)return [false,'The money answer is right. Select and place year '+t.year+' in the inspection dock as well.'];return [true,'Correct. The money value, method and selected year all agree.'];}
var def={id:ID,title:'Interest growth chart',config:C,steps:steps,render:watch,alt:'Neon comparative bars of simple and compound interest for up to six years.',staticAlt:'Simple interest is principal multiplied by the yearly rate multiplied by years. Compound interest recalculates using the updated annual balance.',
 exploreIntro:'Drag a year marker into the inspection dock, or press Enter on it. Change the deposit, rate and duration to compare simple with compound growth.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var s=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("s",(...a)=>state(...a),[C.preset]):(state(C.preset))),select=h('select',{class:'nova-input','aria-label':'Savings example'});window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){select.appendChild(h('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();select.value=s.key;
 window.NovaLessonComponent?.applyExploreModels();var principal=h('input',{type:'range',min:'50',max:'1500',step:'50',value:String(s.p.p/100),'aria-label':'Starting capital in pounds'}),rate=h('input',{type:'range',min:'1',max:'12',step:'1',value:String(s.p.bp/100),'aria-label':'Annual interest rate in percent'}),years=h('input',{type:'range',min:'2',max:'6',step:'1',value:String(s.p.years),'aria-label':'Number of years'}),live=h('p',{class:'f1807-status','aria-live':'polite'}),values=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("values",()=>([])):([]));
 window.NovaLessonComponent?.applyExploreModels();function ctrl(name,input){var out=h('output',{text:''});var l=h('label',{class:'f1807-control'},[name,' ',input,out]);panel.appendChild(l);values.push([out,input,name]);}
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'f1807-row'},['Preset ',select]));window.NovaLessonComponent?.applyExploreModels();ctrl('Capital',principal);window.NovaLessonComponent?.applyExploreModels();ctrl('Annual rate',rate);window.NovaLessonComponent?.applyExploreModels();ctrl('Years',years);
 window.NovaLessonComponent?.applyExploreModels();function render(){s.p.years=+years.value;s.p.p=+principal.value*100;s.p.bp=+rate.value*100;values.forEach(function(a){a[0].textContent=a[2]==='Capital'?fmt(s.p.p):a[2]==='Annual rate'?(s.p.bp/100)+'%':s.p.years+' years';});scene(stage,s,{title:'Investigate interest over time',tag:'DRAG · COMPARE · EXPLAIN',drag:true,refresh:render,pose:s.placed?'compare':'point-down',say:s.placed?'Compare the year '+s.chosen+' gain from simple interest against compounding.':'Select a year. Simple interest gains the same amount annually; compound interest gradually accelerates.'});var a=calc(s.p),v=a[s.placed?s.chosen:s.p.years];live.textContent=s.placed?'Year '+s.chosen+': simple gain '+fmt(v.si)+'; compound gain '+fmt(v.ci)+'. Difference '+fmt(v.ci-v.si)+'.':'Move one year chip into the inspection dock to compare the figures.';}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=function(){s=state(select.value);C.preset=s.key;principal.value=s.p.p/100;rate.value=s.p.bp/100;years.value=s.p.years;emit('preset',s.key);render();};
 window.NovaLessonComponent?.applyExploreModels();[[principal,'principal'],[rate,'rate'],[years,'years']].forEach(function(v){v[0].oninput=function(){s.placed=false;s.chosen=null;emit(v[1],+v[0].value);render();};});
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('button',{class:'nova-btn',text:'Reset year selection',onclick:function(){s.chosen=null;s.placed=false;emit('reset','selection');render();}}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(live);window.NovaLessonComponent?.applyExploreModels();render();
 window.NovaLessonComponent?.applyExploreModels();C._explore={state:function(){var a=calc(s.p);return {preset:s.key,p:Object.assign({},s.p),chosen:s.chosen,placed:s.placed,table:a};},select:function(k){select.value=k;select.onchange();},choose:function(y){choose(s,y,render);},clear:function(){s.placed=false;s.chosen=null;render();},adjust:function(p,bp,yr){principal.value=p/100;rate.value=bp/100;years.value=yr;s.chosen=null;s.placed=false;render();}};},
 challenge:function(panel,api,stage){var i=0,t=tasks[0],s=state(t.key),timer=null;var question=h('p',{class:'pr-task'}),answer=h('input',{class:'nova-input',type:'text',placeholder:'Type amount with £ or p','aria-label':'Money answer, with pounds or pence'}),status=h('p',{class:'f1807-status','aria-live':'polite'});
 function render(win){scene(stage,s,{title:'Interest challenge '+(i+1)+' / '+tasks.length,tag:'READ · SELECT YEAR · SOLVE',drag:true,hideAnswers:true,refresh:render,pose:win?'celebrate':'read-tablet',say:win?'Excellent. You chose the correct year and calculated the right money amount.':'Read whether the task asks for interest only or the final balance. They are different amounts.'});}
 function load(){t=tasks[i];s=state(t.key);question.textContent=(i+1)+' / '+tasks.length+' · '+t.q;answer.value='';status.textContent='';status.removeAttribute('data-good');status.removeAttribute('data-bad');render();}
 function check(){var v=diagnose(t,answer.value,s);status.textContent=v[1];status.toggleAttribute('data-good',v[0]);status.toggleAttribute('data-bad',!v[0]);emit('answer',answer.value);api.check(v[0],v[1],{task:i,year:t.year});if(v[0]){render(true);var msg=N.answerChip(fmt(target(t))+' correct',true);msg.classList.add('f1807-answer');stage.querySelector('.f1807-side').appendChild(msg);N.neonRing(stage.querySelector('.f1807-svg'),size().w-43,90,{role:'result',r:9});if(i<tasks.length-1){if(timer)clearTimeout(timer);timer=setTimeout(function(){i++;load();},1600);}}}
 panel.appendChild(question);panel.appendChild(h('label',{class:'f1807-row'},['Money answer ',answer]));panel.appendChild(h('div',{class:'f1807-actions'},[h('button',{class:'nova-btn primary',text:'Check interest',onclick:check}),h('button',{class:'nova-btn ghost',text:'Hint',onclick:function(){api.hint(t.hint);}}),h('button',{class:'nova-btn',text:'Reset question',onclick:load})]));panel.appendChild(status);load();api.onCleanup(function(){if(timer)clearTimeout(timer);});
 C._challenge={tasks:tasks,state:function(){return {i:i,preset:t.key,expected:target(t),selected:s.chosen,placed:s.placed,answer:answer.value};},task:function(j){if(timer)clearTimeout(timer);i=Math.max(0,Math.min(tasks.length-1,j));load();},select:function(y){choose(s,y,render);},check:function(v){return diagnose(t,v==null?answer.value:v,s);},solve:function(){choose(s,t.year,render);answer.value=fmt(target(t));return answer.value;}};
 }};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{},tables:{"steps":()=>steps,"tasks":()=>tasks},draws:{"scene":["stage","s","o"]},exploreFields:{"s":{"kind":"factory","factory":"state","argCount":1},"values":{"kind":"value","factory":null,"argCount":null},"watch.s":{"kind":"factory","factory":"state","argCount":1}}});
N.bankMount({id:ID,num:'F18·07',title:'Interest growth chart',def:def,years:'KS3 Year 7 simple interest and Year 8–9 compound interest extension.',linked:['F0-02','F0-03','F0-04','F18-05','F18-06'],spec:{purpose:'Calculate fixed annual simple interest and compare it with the accumulating gain from compound interest.',params:'Starting capital in pounds, annual rate, duration in years, method and annual pence rounding.',presets:'Five named UK savings examples, with an explicit GCSE compound-interest extension.',steps:'Identify capital → find yearly percentage → repeat simple gain → compound an updated balance → compare bars → calculate and verify.',interactions:'Animated WATCH timeline, scaffolded GUIDED, draggable year chips and editable values in EXPLORE, six checked money-and-year CHALLENGE tasks.',traps:'Confusing interest gained with savings balance, forgetting to multiply by years, calculating simple interest from the new balance, answering without money units.',gcse:'Compound comparison, annual-rounding policy and difference between simple and compound gains.'}});
var log=document.getElementById('log');if(log){var add=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4200);};N.events.history().forEach(add);N.events.on('*',add);document.getElementById('clearlog').onclick=function(){log.textContent='';};}
})();

