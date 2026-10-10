var NOVA_F5_04_CONFIG={startMode:'guided',preset:'quarters',events:['preset','numerator','denominator','factor','dragPosition','jump','reset'],presets:{
 quarters:{label:'Three quarters',n:3,d:4,min:0,max:2,factor:2},
 halves:{label:'One half',n:1,d:2,min:0,max:2,factor:2},
 thirds:{label:'Two thirds',n:2,d:3,min:0,max:2,factor:3},
 improper:{label:'Five thirds (beyond one)',n:5,d:3,min:0,max:2,factor:2},
 negative:{label:'Minus two thirds',n:-2,d:3,min:-1,max:1,factor:2},
 eighths:{label:'Seven eighths',n:7,d:8,min:0,max:2,factor:2},
 aboveTwo:{label:'Seven thirds (above two)',n:7,d:3,min:0,max:3,factor:2}
 }};
(function(){'use strict';
var N=NOVA,S=N.svg,E=S.el,H=N.h,M=N.motion,C=NOVA_F5_04_CONFIG,ID='F5-04',live=null;
function send(key,value){if(C.events.indexOf(key)<0)throw Error('unregistered value key '+key);N.events.emit('value',{engine:ID,key:key,value:value});}
function lab(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,String(t),{role:role||'support',size:size||22,anchor:anchor||'middle'});}
function stack(p,x,y,n,d,role,size){var g=E('g',{'aria-label':(n<0?'minus ':'')+Math.abs(n)+' over '+d},p),z=size||26;
 if(d===1){lab(g,x,y+6,n,role,z);return g;}
 lab(g,x,y-z*.34,n,role,z);N.neonLine(g,x-z*.66,y+2,x+z*.66,y+2,{role:role,width:2});lab(g,x,y+z*.88,d,role,z);return g;}
function dataOf(key){var p=C.presets[key]||C.presets.quarters;return {n:p.n,d:p.d,min:p.min,max:p.max,factor:p.factor};}
function norm(o){var d=Math.max(2,Math.min(8,Math.round(o.d))),n=Math.max(o.min*d,Math.min(o.max*d,Math.round(o.n))),factor=Math.max(2,Math.min(3,Math.round(o.factor)));return {n:n,d:d,min:o.min,max:o.max,factor:factor};}
function readFraction(o){return (o.n<0?'minus ':'')+Math.abs(o.n)+' over '+o.d;}
function mkGlow(s){var defs=E('defs',{},s);var g=E('linearGradient',{id:'fnl-metal',x1:'0%',y1:'0%',x2:'0%',y2:'100%'},defs);[['0%','#93b5cb'],['21%','#2c5977'],['46%','#102640'],['85%','#234861'],['100%','#a2c2d7']].forEach(function(a){E('stop',{offset:a[0],'stop-color':a[1]},g);});}
function draw(stage,state,opt){opt=opt||{};if(live)live.dead=true;var current={dead:false};live=current;
 var o=norm(state),small=window.innerWidth<=670,W=small?420:1100,V=small?790:662;
 stage.innerHTML='';N.cap(stage,'F5-04 · '+(opt.caption||'Fraction positions'),'PREMIUM');
 var svg=S.root(W,V,'F1-01 number-line fractions preset. Two aligned NOVA.numberLine axes use '+o.d+' and '+(o.d*o.factor)+' equal intervals per whole. The rings mark '+readFraction(o)+'.');svg.classList.add('fnl-svg');mkGlow(svg);
 var x=small?58:180,w=small?308:748,y1=small?257:234,y2=small?477:429,center=small?210:550,px=function(n){return x+w*(n-o.min*o.d)/(o.d*(o.max-o.min));},where=px(o.n),hidden=!!opt.hide,phase=opt.phase||'same';
 lab(svg,center,small?44:46,'One scale · two partitions','support',small?25:31);
 lab(svg,center,small?88:92,'A finer scale does not move the number','given',small?19:22);
 // Allow the top stacked-fraction callout its own clear area; do not place a panel behind it.
 if(phase==='whole')lab(svg,center,small?168:176,'Equal gaps · fixed unit','focus',small?18:20);
 var first=E('g',{'data-scale':'primary'},svg),second=E('g',{'data-scale':'refined'},svg);
 // Both scales use the single v3.5-locked NOVA.numberLine primitive, never custom tick loops.
 var top=N.numberLine(first,{x:x,y:y1,w:w,min:o.min,max:o.max,major:1,minor:1/o.d,labelSize:small?20:19});
 var bottom=N.numberLine(second,{x:x,y:y2,w:w,min:o.min,max:o.max,major:1,minor:1/(o.d*o.factor),labelSize:small?20:19});
 lab(svg,x-3,small?231:206,o.d+' equal parts / whole','focus',small?18:19,'start');
 lab(svg,x-3,small?432:380,(o.d*o.factor)+' equal parts / whole','result',small?18:19,'start');
 // The same endpoint x proves numerical equality on the shared scale.
 if(phase!=='whole'){
  // Same origin and same endpoint: these are genuine equal distances, not a palette comparison.
  if(Math.abs(top.s(0)-where)>1){N.neonLine(svg,top.s(0),y1-15,where,y1-15,{role:'focus',width:2.8});N.neonLine(svg,bottom.s(0),y2-15,where,y2-15,{role:'result',width:2.8});}
  N.neonLine(svg,where,y1-24,where,y2+20,{role:'op',width:2});
  var high=E('g',{'data-marker':'top',class:'fnl-handle',role:opt.interactive?'slider':'img',tabindex:opt.interactive?0:null,'aria-label':'Fraction position marker, numerator '+o.n+', denominator '+o.d,'aria-valuemin':o.min*o.d,'aria-valuemax':o.max*o.d,'aria-valuenow':o.n},svg);
  N.neonRing(high,where,y1,{role:'focus',r:small?11:13,pulse:false});N.neonRing(svg,where,y2,{role:'result',r:small?11:13,pulse:false});
  if(hidden){lab(svg,center,y1-82,'Find the right tick','unknown',small?18:20);}else{
   N.neonBox(svg,Math.max(x-6,Math.min(x+w-136,where-68)),y1-128,136,65,{role:'focus',r:13});
   stack(svg,Math.max(x+62,Math.min(x+w-68,where)),y1-94,o.n,o.d,'focus',small?24:26);
   // The refined stacked fraction is already displayed in the result strip below.
   // Keeping it there avoids a floating card colliding with the lower axis/result border.
  }
  if(opt.jump&&!opt.interactive){var zero=top.s(0);if(Math.abs(zero-where)>1){var j=S.hop(svg,zero,where,y1-18,{role:'op',height:Math.min(small?38:57,Math.abs(zero-where)*.21+17)});j.setAttribute('data-jump','yes');}}
  if(opt.interactive){
   var zones=[];for(var k=o.min*o.d;k<=o.max*o.d;k++){var zx=px(k),gw=Math.max(12,Math.min(28,w/(o.d*(o.max-o.min))*0.86));zones.push({id:'numerator:'+k,kind:'drop',x:zx-gw/2,y:y1-37,w:gw,h:70});}
   high.addEventListener('keydown',function(e){var step=e.key==='ArrowRight'||e.key==='ArrowUp'?1:e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:0;
    if(step||e.key==='Home'||e.key==='End'){e.preventDefault();var next=e.key==='Home'?o.min*o.d:e.key==='End'?o.max*o.d:Math.max(o.min*o.d,Math.min(o.max*o.d,o.n+step));opt.change(next,'keyboard');}});
   N.ui.svgDrag(svg,high,{box:{x:where-17,y:y1-17,w:34,h:34},canStart:function(){return !current.dead;},zones:function(){return zones;},onDrop:function(id){opt.change(+id.split(':')[1],'drag');return true;}});
  }
  if(opt.animate){second.style.opacity='0';M.tween(1050,function(e){if(!current.dead)second.style.opacity=String(e);},M.ease.inOut,function(){if(!current.dead)M.flash(svg,where,y2,'result',38);});}
 }else{second.style.opacity='0.17';}
 var ry=small?638:596;N.neonBox(svg,small?36:199,small?566:539,small?348:705,small?169:105,{role:phase==='whole'?'support':'result',r:16});
 if(phase==='whole'){lab(svg,center,small?606:583,'Each 0 → 1 gap represents one whole','support',small?19:21);lab(svg,center,small?642:619,'Each matching gap has equal length','focus',small?18:19);}
 else{lab(svg,center,small?603:572,hidden?'Both marks use one position':'Equivalent positions · equal distance','result',small?19:21);
  if(hidden)lab(svg,center,small?646:612,'Count the equal intervals from zero','support',small?17:19);
  else if(small){stack(svg,132,694,o.n,o.d,'focus',24);lab(svg,207,699,'=', 'support',27);stack(svg,298,694,o.n*o.factor,o.d*o.factor,'result',24);}
  else{stack(svg,443,616,o.n,o.d,'focus',21);lab(svg,545,619,'=', 'support',29);stack(svg,648,616,o.n*o.factor,o.d*o.factor,'result',21);}
 }
 stage.appendChild(svg);
 N.scene.helperStrip(stage,opt.pose||'point',opt.helper||'The rings share one position.');
 return {svg:svg,where:where,o:o};
}
var steps=[
 {name:'Fix the whole',o:{n:0,d:2,min:0,max:2,factor:2},phase:'whole',mood:'neutral',pose:'explain',helper:'The gap from zero to one is one whole.',prompt:'Which tick is exactly one whole?',narration:'Look at the whole numbers. The distance from zero to one is one whole. No matter how many parts we choose, that whole length never changes.'},
 {name:'Partition into halves',o:{n:1,d:2,min:0,max:2,factor:2},phase:'position',mood:'focus',pose:'point',helper:'One of two equal steps reaches one half.',prompt:'Is one half exactly midway?',narration:'Cut the whole into two equal parts. One half is one equal step after zero, exactly in the middle.'},
 {name:'Count quarter steps',o:{n:3,d:4,min:0,max:2,factor:2},phase:'position',mood:'think',pose:'count',helper:'Count three small steps after zero.',prompt:'Why is the ring at three quarters?',narration:'Each gap now represents one quarter. Count three quarter steps from zero. The marker sits at three quarters.'},
 {name:'Refine the partitions',o:{n:3,d:4,min:0,max:2,factor:2},phase:'same',animate:true,mood:'focus',pose:'compare',helper:'The point stays fixed as eighths appear.',prompt:'Why does three quarters equal six eighths?',narration:'Divide each quarter into two equal parts. The bottom number line now has eighths. Six eighths lies at exactly the same position as three quarters.'},
 {name:'Move past one',o:{n:5,d:3,min:0,max:2,factor:2},phase:'same',mood:'think',pose:'point',helper:'Keep counting beyond one whole.',prompt:'Why is five thirds greater than one?',narration:'Three thirds makes one whole. Two more thirds takes us to five thirds, beyond one.'},
 {name:'Travel left of zero',o:{n:-2,d:3,min:-1,max:1,factor:2},phase:'same',mood:'cheer',pose:'compare',helper:'Negative fractions are to the left of zero.',prompt:'How do negative two thirds and positive two thirds differ?',narration:'From zero, count two third-steps left. The fraction is negative two thirds. A negative fraction has a direction as well as a size.'}
];
function guided(i,stage){var t=steps[i];draw(stage,t.o,{caption:t.name,phase:t.phase,animate:!!t.animate,jump:i===2||i===4||i===5,pose:t.pose,helper:t.helper});}
function explore(panel,stage,api){var o=dataOf(C.preset),summary=H('p',{class:'fnl-feedback'}),pre=H('select',{class:'nova-input','aria-label':'Choose fraction number-line preset'}),den=H('select',{class:'nova-input','aria-label':'Denominator'}),fact=H('select',{class:'nova-input','aria-label':'Subdivision factor'});
 Object.keys(C.presets).forEach(function(k){pre.appendChild(H('option',{value:k,text:C.presets[k].label}));});pre.value=C.preset;
 [2,3,4,5,6,8].forEach(function(d){den.appendChild(H('option',{value:d,text:d+' parts per whole'}));});[2,3].forEach(function(f){fact.appendChild(H('option',{value:f,text:'×'+f+' finer'}));});
 var controls=H('div',{class:'fnl-controls'}),dec=H('button',{class:'nova-btn',text:'−','aria-label':'One fraction step left'}),inc=H('button',{class:'nova-btn',text:'+','aria-label':'One fraction step right'}),reset=H('button',{class:'nova-btn ghost',text:'Reset position'});
 function setN(n,src){o.n=Math.max(o.min*o.d,Math.min(o.max*o.d,n));send(src==='drag'?'dragPosition':'numerator',o.n);paint(src==='keyboard');}
 function paint(focus){o=norm(o);summary.textContent='At '+readFraction(o)+' of the whole; refine by ×'+o.factor+' and the ring remains at the same mathematical position.';
  draw(stage,o,{caption:'Explore · snap to an equal part',interactive:true,jump:true,pose:'compare',helper:'Drag the upper ring, or use the arrow keys.',change:setN});
  if(focus){var el=stage.querySelector('[data-marker="top"]');if(el)el.focus();}}
 pre.onchange=function(){C.preset=pre.value;o=dataOf(C.preset);den.value=o.d;fact.value=o.factor;send('preset',C.preset);paint();};
 den.onchange=function(){var current=o.n/o.d;o.d=+den.value;o.n=Math.max(o.min*o.d,Math.min(o.max*o.d,Math.round(current*o.d)));send('denominator',o.d);paint();};
 fact.onchange=function(){o.factor=+fact.value;send('factor',o.factor);paint();};
 dec.onclick=function(){setN(o.n-1,'stepper');};inc.onclick=function(){setN(o.n+1,'stepper');};reset.onclick=function(){o.n=0;send('reset',true);paint();};
 controls.appendChild(H('label',{text:'Example'}));controls.appendChild(pre);controls.appendChild(H('label',{text:'Partition'}));controls.appendChild(den);controls.appendChild(H('label',{text:'Refine'}));controls.appendChild(fact);panel.appendChild(controls);
 panel.appendChild(H('div',{class:'fnl-controls'},[dec,inc,reset]));panel.appendChild(summary);
 den.value=o.d;fact.value=o.factor;C._explore={get:function(){return Object.assign({},o);},set:function(n,d,min,max,factor){o={n:n,d:d,min:min,max:max,factor:factor||2};den.value=o.d;fact.value=o.factor;paint();},place:setN};paint();
}
function challenge(panel,api,stage){var tasks=[
 {min:0,max:2,d:4,n:3,question:'Place the ring at three quarters. Count the quarter steps from zero.',hint:'Three quarter-length gaps after zero.'},
 {min:0,max:2,d:3,n:5,question:'Place the ring at five thirds, beyond one whole.',hint:'Count three thirds to one, then two thirds more.'},
 {min:-1,max:1,d:3,n:-2,question:'Place the ring at negative two thirds, to the left of zero.',hint:'Count two third-steps to the left from zero.'}
 ],ix=0,o,wrong=0,taskText=H('p',{class:'fnl-feedback'}),status=H('p',{class:'fnl-feedback',role:'status','aria-live':'polite'}),peerImg=H('img',{src:N.helperImg('read-tablet','teen').src,alt:N.helperImg('read-tablet','teen').alt}),peerText=H('span',{text:'Izaac is watching your number line.'}),bMinus=H('button',{class:'nova-btn',text:'−'}),bPlus=H('button',{class:'nova-btn',text:'+'}),check=H('button',{class:'nova-btn primary',text:'Check position'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'});
 function pose(k,text){var p=N.helperImg(k,'teen');peerImg.src=p.src;peerImg.alt=p.alt;peerText.textContent=text;}
 function change(n,src){o.n=n;paint(src==='keyboard');}
 function paint(focus){draw(stage,o,{caption:'Challenge · place the fraction',interactive:true,hide:true,pose:'think',helper:'Read the task; find the correct tick.',change:change});if(focus){var el=stage.querySelector('[data-marker="top"]');if(el)el.focus();}}
 function load(){var t=tasks[ix];wrong=0;o={min:t.min,max:t.max,d:t.d,n:0,factor:2};taskText.textContent='Challenge '+(ix+1)+' of 3 · '+t.question;status.textContent='Move the ring, then check your position.';pose('read-tablet','Izaac is following your selection.');api.fb.textContent='';paint();}
 bMinus.onclick=function(){change(Math.max(o.min*o.d,o.n-1),'stepper');};bPlus.onclick=function(){change(Math.min(o.max*o.d,o.n+1),'stepper');};
 hint.onclick=function(){api.hint(tasks[ix].hint);pose('idea','Izaac has a clue.');status.textContent=tasks[ix].hint;};
 check.onclick=function(){var t=tasks[ix],ok=o.n===t.n;api.check(ok,ok?'Correct. The ring is '+readFraction(o)+' from zero.':'Try again. Count the fraction-sized gaps from zero.');if(ok){pose(ix===2?'proud':'idea','Exactly the right position.');status.textContent='Correct: the point is exactly where it belongs.';if(ix<2){ix++;M.delay(560,load);}else{pose('victory','Three out of three. Excellent!');check.disabled=true;}}
 else{wrong++;if(wrong>=2)pose('worried','Count the little gaps, not the large ticks.');}};
 panel.appendChild(taskText);panel.appendChild(H('div',{class:'fnl-controls'},[bMinus,bPlus,check,hint]));panel.appendChild(status);panel.appendChild(H('div',{class:'fnl-peer'},[peerImg,peerText]));
 C._challenge={get:function(){return {task:ix,n:o.n,d:o.d};},place:function(n){change(n,'api');},task:function(){return ix;}};load();}
var DEF={id:ID,title:'Fractions on a Number Line · F1-01 fractions preset',config:C,steps:steps,render:guided,explore:explore,challenge:challenge,
 alt:'F1-01 locked neon number lines have identical whole-number scale. One has denominator d and the other denominator d times a factor. Two connected neon rings align at exactly the same numerical position.',
 staticAlt:'Three quarters and six eighths sit at the same position. Five thirds lies beyond one; negative two thirds is left of zero.',
 exploreIntro:'Move the top marker by drag, arrows or the stepper. Both equivalent rings stay vertically aligned on the same whole-number scale.'};
N.registry.add({id:ID,title:DEF.title,kind:'preset-adapter',family:'F5',topics:['fraction positions','equivalent fractions','number line'],deps:['F1-01','F0-02','F0-04','F0-05']});
N.bankMount({id:ID,num:'F5·04',title:DEF.title,def:DEF,years:'KS3 Years 7–9',linked:['F1-01','F5-02','F5-05'],
 spec:{purpose:'Fraction positions as equal units on one locked v3.5 number-line scale. F5-04 maps to F1-01 as its fractions preset, not a separate maths drawing primitive.',
 params:'Signed integer numerator, denominator 2–8, factor ×2 or ×3, exact rational tick snapping, whole-number bounds −1..1 / 0..2 / 0..3.',
 presets:'Halves, thirds, quarters, eighths, improper fractions above one/two, negative fractions.',
 steps:'Whole length → halves → quarters → fixed-point equivalence → improper fractions → negative fractions.',
 interactions:'Watch/Guided timeline; Explore drag-snap ring using NOVA.ui.svgDrag; keyboard/stepper; Challenge 3 guided point placements; event value keys declared.',
 traps:'Confusing denominator with a whole number; changing the endpoint during subdivision; placing an improper fraction inside 0..1; wrong sign/direction.',
 gcse:'Signed rational numbers, ordering and equivalent rational representations. Implementation uses NOVA.numberLine twice, which is the locked shared primitive. F1-01 original source remains unmodified; this F5-04 page is a separately mountable adapter, not a patched F1-01 view.'}});
var log=document.getElementById('log'),appendLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,3800);};N.events.history().forEach(appendLog);N.events.on('*',appendLog);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();
