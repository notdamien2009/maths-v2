/* NOVA F9-12 · Sequence Continuer · Neon drawings + Chalk writing, established F3 runtime. */
const F912_CONFIG={id:'F9-12',family:'F9',startMode:'watch',presets:{
 'Y7-036-sequence-structure':{label:'Y7-036 · Add three',operation:'add',first:4,step:3,terms:5},
 'Y7-036-decreasing':{label:'Y7-036 · Subtract four',operation:'add',first:24,step:-4,terms:5},
 'Y7-036-doubling':{label:'Y7-036 · Double each term',operation:'multiply',first:2,factor:2,terms:5}},
 events:{value:['preset','term','reveal','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F912_CONFIG,id=C.id;
const sm=()=>innerWidth<=760,W=()=>sm()?430:760;
const STEPS=[
 {name:'look-for-a-pattern',preset:'Y7-036-sequence-structure',visible:3,hop:0,kind:'notice',pose:'question',text:'Four, seven, ten. What would you expect to come next?',prompt:'Find what changes between each pair of numbers.'},
 {name:'check-the-same-hop',preset:'Y7-036-sequence-structure',visible:3,hop:2,kind:'compare',pose:'point-right',text:'Four plus three is seven. Seven plus three is ten. Same hop, twice.',prompt:'Explain why the rule adds three each time.'},
 {name:'fill-the-next-slot',preset:'Y7-036-sequence-structure',visible:4,hop:3,kind:'first-fill',pose:'count',text:'Ten plus three gives thirteen. The first empty slot is filled.',prompt:'Predict the next term before it appears.'},
 {name:'continue-again',preset:'Y7-036-sequence-structure',visible:5,hop:4,kind:'complete',pose:'idea',text:'Now thirteen plus three makes sixteen. We continued the same sequence twice.',prompt:'How could you check both new terms?'},
 {name:'continue-a-decrease',preset:'Y7-036-decreasing',visible:5,hop:4,kind:'decreasing',pose:'point-down',text:'A sequence can shrink. Subtract four again to continue this pattern.',prompt:'Why is twelve followed by eight?'},
 {name:'continue-a-double',preset:'Y7-036-doubling',visible:5,hop:4,kind:'doubling',pose:'celebrate',text:'Doubling is different from adding. Two, four, eight, sixteen, thirty-two.',prompt:'Explain why a fixed addition cannot generate every term.'}
];
const TASKS=[
 {preset:'Y7-036-sequence-structure',title:'01 · Finish the growing sequence',guide:'4, 7, 10, __, __. Use the same add-three rule for both spaces.',options:[13,16,14,17,10],expected:[13,16],trap:{14:'Fourteen is four more than ten. This rule adds three, not four.',17:'Seventeen is four more than thirteen. Check the hop size.',10:'Ten is already the third term. Continue forward, not backwards.'}},
 {preset:'Y7-036-decreasing',title:'02 · Keep subtracting four',guide:'24, 20, 16, __, __. Both missing terms must keep the same subtraction.',options:[12,8,10,4,20],expected:[12,8],trap:{10:'Sixteen subtract four gives twelve, not ten.',4:'Four is too many steps ahead. Continue one hop at a time.',20:'Twenty already appears as term two. Continue downwards.'}},
 {preset:'Y7-036-doubling',title:'03 · Double to continue',guide:'2, 4, 8, __, __. Check what happens to the multiplication rule each time.',options:[16,32,12,24,18],expected:[16,32],trap:{12:'Eight plus four gives twelve, but the sequence doubles instead.',24:'Twenty-four is eight more than sixteen. Doubling gives thirty-two.',18:'Eighteen is not twice eight. Try multiplication by two.'}}
];
let chosen='Y7-036-sequence-structure',termReveal=3,stageRef=null,apiRef=null,statusRef=null,task=0,placed={3:null,4:null},selected=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered NOVA F9-12 event '+key);N.events.emit('value',{engine:id,key,value});}
function value(p,n){return p.operation==='add'?p.first+(n-1)*p.step:p.first*Math.pow(p.factor,n-1);}
function values(p){return Array.from({length:5},(_,i)=>value(p,i+1));}
function rule(p){return p.operation==='multiply'?'×'+p.factor:p.step<0?'−'+Math.abs(p.step):'+'+p.step;}
function txt(p,x,y,t,size=22,role='given'){return N.chalkText(p,x,y,String(t),{size,role});}
function box(p,x,y,w,h,label,role='given',size=23){return N.neonBox(p,x,y,w,h,{role,text:label,size,r:15});}
function btn(t,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:t,onclick:fn});}
function root(alt){const v=N.svg.root(W(),sm()?730:660,alt);v.setAttribute('class','nv-svg f912-svg');v.setAttribute('role','img');return v;}
function clear(stage){stage.replaceChildren();N.cap(stage,'Sequence workshop','Sequence continuer');}
function card(title,val,focus=false){return H('div',{class:'f912-card'+(focus?' f912-card--gold':'')},[H('div',{class:'f912-eyebrow',text:title}),H('div',{class:'f912-maths'+(focus?' f912-maths--gold':''),text:String(val)})]);}
function note(head,content){return H('div',{class:'f912-card f912-card--full'},[H('div',{class:'f912-eyebrow',text:head}),H('div',{class:'f912-body',text:content})]);}
function mount(stage,svg,cards,pose,speech){stage.appendChild(H('div',{class:'f912-stage'},[svg,H('aside',{class:'f912-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function center(i){return (sm()?48:86)+i*((W()-(sm()?96:172))/4);}
function row(svg,p,{visible=3,hop=0,challenge=false,title='CONTINUE THE SEQUENCE',showRule=false}={}){
 const y=sm()?244:249,w=sm()?69:112,h=sm()?92:96,arr=values(p);
 txt(svg,W()/2,56,title,sm()?25:30,'support');
 txt(svg,W()/2,100,challenge?'Find both missing terms, one hop at a time':showRule?'Every hop follows the SAME rule':'Notice what changes from term to term',sm()?17:20,'support');
 for(let i=0;i<4;i++){
  const a=center(i)+9,b=center(i+1)-9;
  const arc=N.svg.hop(svg,a,b,y-h/2-9,{role:i<hop?'focus':'support',height:sm()?36:47});
  if(i<hop&&showRule)N.svg.pill(svg,(center(i)+center(i+1))/2,y-(sm()?100:110),rule(p),{role:'focus',size:sm()?14:18});
  if(i>=2&&i>=hop&&!challenge)arc.classList.add('f912-unrevealed-hop');
 }
 for(let i=0;i<5;i++){
  const known=challenge?i<3:i<visible;
  const g=E('g',{'class':'f912-term','data-term':i+1,'data-value':known?arr[i]: '?'},svg);
  box(g,center(i)-w/2,y-h/2,w,h,known?String(arr[i]):'?',known?i>2?'result':'given':'unknown',sm()?27:33);
  txt(svg,center(i),y+h/2+38,'Term '+(i+1),sm()?20:18,'support');
  if(i<3||known&&i>=3)N.neonRing(svg,center(i),y-h/2-13,{role:i>2?'result':'support',r:sm()?6:8,pulse:i>2});
 }
 return {y,w,h,arr};
}
function stepDraw(i,stage){const d=STEPS[i],p=C.presets[d.preset],w=W();clear(stage);
 const svg=root('A five-term sequence linked with repeated jump arrows. Empty slots become correct next terms.');
 row(svg,p,{visible:d.visible,hop:d.hop,showRule:i>0,title:i<4?'GROWING BY THREE':i===4?'DECREASING PATTERN':'MULTIPLYING PATTERN'});
 if(i===0){txt(svg,w/2,423,'What could the missing terms be?',sm()?21:27,'support');box(svg,w*.18,459,w*.64,67,'4   →   7   →   10','support',sm()?23:28);}
 if(i===1){txt(svg,w/2,420,'TEST THE CHANGE TWICE',sm()?21:26,'support');box(svg,w*.07,456,w*.40,76,'7 − 4 = 3','focus',sm()?21:26);box(svg,w*.53,456,w*.40,76,'10 − 7 = 3','focus',sm()?21:26);}
 if(i===2){txt(svg,w/2,421,'FILL THE FIRST SPACE',sm()?21:26,'support');box(svg,w*.16,460,w*.68,73,'10 + 3 = 13','result',sm()?25:30);}
 if(i===3){txt(svg,w/2,420,'CHECK BOTH NEW TERMS',sm()?20:26,'support');box(svg,w*.04,460,w*.44,74,'10 + 3 = 13','result',sm()?20:26);box(svg,w*.52,460,w*.44,74,'13 + 3 = 16','result',sm()?20:26);}
 if(i===4){txt(svg,w/2,420,'THE SAME STEP, BUT BACKWARDS',sm()?17:25,'support');box(svg,w*.07,460,w*.40,74,'16 − 4 = 12','result',sm()?19:25);box(svg,w*.53,460,w*.40,74,'12 − 4 = 8','result',sm()?20:25);}
 if(i===5){txt(svg,w/2,420,'MULTIPLY, DO NOT ADD A FIXED GAP',sm()?17:23,'support');box(svg,w*.06,460,w*.41,74,'8 × 2 = 16','result',sm()?21:25);box(svg,w*.53,460,w*.41,74,'16 × 2 = 32','result',sm()?20:25);}
 N.svg.pill(svg,w/2,sm()?625:590,i===0?'Two empty slots waiting':i===1?'Rule found: +3':i===2?'First slot complete':i===3?'Both slots correct':i===4?'Rule found: −4':'Rule found: ×2',{role:i===0?'unknown':i===1?'focus':'result',size:sm()?17:21});
 let cards=[card('SEQUENCE',values(p).slice(0,d.visible).join('   ·   ')),card('REPEATED RULE',i===0?'Discover it':rule(p),i>0),note('LOOK CLOSELY',i===0?'Do not guess from one jump. Compare the first three terms.':i===1?'The same addition must work between all consecutive terms.':i===2?'You filled term four using the rule. Keep it for term five.':i===3?'Both new terms can be checked by the same operation.':i===4?'Every next term is four less than the previous one.':'Multiplying by two gives each next term; adding a constant does not.'),note('YOUR TURN',d.prompt)];
 mount(stage,svg,cards,d.pose,d.text);
 if(!N.reducedMotion()){
  [...svg.querySelectorAll('.f912-term')].slice(0,d.visible).forEach((g,j)=>{g.style.opacity='0';N.motion.tween(250+j*100,t=>{if(g.isConnected)g.style.opacity=String(t);},N.motion.ease.out);});
 }
}
function exploreDraw(stage){const p=C.presets[chosen];clear(stage);const svg=root('Explore an additive, subtractive or multiplicative sequence with five terms and two missing continuation positions.');
 row(svg,p,{visible:termReveal,hop:Math.max(0,termReveal-1),showRule:true,title:'SEQUENCE EXPLORER'});
 txt(svg,W()/2,427,'CONTINUE WITH THE SAME RULE',sm()?20:26,'support');
 box(svg,W()*.17,463,W()*.66,70,'Term '+(termReveal+1)+' = '+(termReveal===5?'?':value(p,termReveal+1)),termReveal===5?'unknown':'result',sm()?20:25);
 N.svg.pill(svg,W()/2,sm()?625:590,''+rule(p)+'  ·  every term',{role:'focus',size:sm()?19:24});
 mount(stage,svg,[card('PATTERN',p.label),card('RULE',rule(p),true),card('FIVE-TERM SERIES',values(p).join(' · ')),note('CHECK','Find the difference, or check whether each term multiplies by the same number.')],'point-right','Keep the operation the same as the pattern grows.');
}
function status(text){if(statusRef)statusRef.textContent=text;}
function target(n){return {id:String(n),kind:'drop',x:center(n)-(sm()?36:61),y:(sm()?244:249)-(sm()?48:50),w:sm()?72:122,h:sm()?96:100};}
function removeZone(){return {id:'remove',kind:'remove',x:sm()?30:155,y:sm()?625:563,w:sm()?370:448,h:62};}
function guardFast(g){/* Supplement for very fast mouse movement escaping an SVG element's capture boundary. */
 g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pointer=e.pointerId;let done=false;
 function clean(){if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);}
 function move(e2){if(done)return;if(N.ui._drag!==drag){clean();return;}if(e2.pointerId!==pointer||g.contains(e2.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pointer,clientX:e2.clientX,clientY:e2.clientY,buttons:e2.buttons}));}
 function up(e2){if(e2.pointerId!==pointer)return;if(N.ui._drag===drag&&drag.up)drag.up(e2);clean();}
 function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });
}
function fail(v,slot){const t=TASKS[task],p=C.presets[t.preset],right=t.expected[slot-3],earlier=slot===4?placed[3]:value(p,3),d=p.operation==='multiply'?'multiply by two':p.step<0?'subtract four':'add three';
 if(t.trap[v])return t.trap[v];
 if(v===t.expected[1-(slot-3)])return 'That value belongs in the OTHER empty slot. Continue in order, one term at a time.';
 if(slot===4&&placed[3]===null)return 'Fill term four first, then continue from it to term five.';
 if(v===earlier)return 'This repeats the previous term. You need to '+d+' to continue.';
 return 'Check term '+(slot+1)+'. You should '+d+' from the previous term to get '+right+'.';
}
function place(v,slot){if(placed[slot]!==null)return false;if(slot===4&&placed[3]===null){let msg='Complete the first empty slot before the second one.';status(msg);apiRef.check(false,msg,{task,slot,value:v});return false;}
 if(v!==TASKS[task].expected[slot-3]){const msg=fail(v,slot);status(msg);apiRef.check(false,msg,{task,slot,value:v});return false;}
 placed[slot]=v;selected=null;ev('placed',{slot,value:v});status('Term '+(slot+1)+' placed. '+(slot===3?'Now complete the second space.':'Both terms are ready to check.'));drawChallenge();return true;
}
function unplace(slot){N.ui.cancelDrag();if(placed[slot]===null)return;placed[slot]=null;if(slot===3&&placed[4]!==null){placed[4]=null;ev('placed',{slot:4,value:null});}selected=null;ev('placed',{slot,value:null});status('Card removed. Place the terms in sequence order.');drawChallenge();}
function source(svg,v,x,y){const bw=sm()?70:104,bh=66,g=E('g',{tabindex:0,role:'button','data-source':'term-'+v,'aria-label':'Select term '+v},svg);
 box(g,x,y,bw,bh,String(v),'focus',sm()?23:30);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=v;status('Term '+v+' selected. Press Enter on the first available empty slot.');}});
 g.addEventListener('click',()=>{selected=v;status('Term '+v+' selected. Press Enter on an empty slot.');});
 N.ui.svgDrag(svg,g,{box:{x,y,w:bw,h:bh},zones:()=>[target(3),target(4),removeZone()],onDrop:slot=>slot==='3'||slot==='4'?place(v,Number(slot)):false,onRemove:()=>status('Card returned to the choice tray.'),removeTo:{x:W()/2,y:removeZone().y+30}});guardFast(g);
}
function challengeSlot(svg,n){let z=target(n);if(placed[n]===null){box(svg,z.x,z.y,z.w,z.h,'?','unknown',sm()?31:37);
 E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':String(n),tabindex:0,role:'button','aria-label':'Place selected term in empty slot '+(n+1)},svg)
 .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(selected===null)status('Select a number card first.');else place(selected,n);}});
 }else{let g=E('g',{tabindex:0,role:'button','data-placed':String(n),'aria-label':'Placed term '+placed[n]+' in slot '+(n+1)+'. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,String(placed[n]),'result',sm()?29:35);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();unplace(n);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[removeZone()],onDrop:()=>false,onRemove:()=>unplace(n),removeTo:{x:W()/2,y:removeZone().y+30}});guardFast(g);
 }
}
function drawChallenge(){if(!stageRef)return;const t=TASKS[task],p=C.presets[t.preset],svg=root('Complete the two empty positions by dragging the next-term cards into the gaps.'),w=W();clear(stageRef);
 txt(svg,w/2,57,'FINISH THE NUMBER PATTERN',sm()?22:30,'support');
 txt(svg,w/2,100,'Fill term four, then term five',sm()?18:23,'support');
 const y=sm()?244:249,ww=sm()?69:112,hh=sm()?92:96;
 for(let i=0;i<4;i++){
  const arc=N.svg.hop(svg,center(i)+9,center(i+1)-9,y-hh/2-9,{role:'support',height:sm()?36:47});
  if(i<2)N.svg.pill(svg,(center(i)+center(i+1))/2,y-(sm()?100:110),'?',{role:'unknown',size:sm()?15:18});
 }
 for(let i=0;i<3;i++){
  let g=E('g',{'class':'f912-term','data-term':i+1},svg);
  box(g,center(i)-ww/2,y-hh/2,ww,hh,String(value(p,i+1)),'given',sm()?27:33);
  txt(svg,center(i),y+hh/2+38,'Term '+(i+1),sm()?20:18,'support');
 }
 for(let n=3;n<=4;n++){challengeSlot(svg,n);txt(svg,center(n),y+hh/2+38,'Term '+(n+1),sm()?20:18,'support');}
 txt(svg,w/2,412,'CHOOSE THE NEXT TERMS',sm()?20:27,'support');
 const bw=sm()?70:104,bh=66,dx=sm()?13:55,gap=sm()?16:36;
 for(let i=0;i<t.options.length;i++){
  const v=t.options[i];if(Object.values(placed).includes(v))continue;
  source(svg,v,dx+i*(bw+gap),450);
 }
 const rz=removeZone();box(svg,rz.x,rz.y,rz.w,rz.h,'RED TRAY · REMOVE','error',sm()?18:23);
 N.svg.pill(svg,w/2,sm()?708:643,placed[3]!==null&&placed[4]!==null?'Two terms ready to check':'Choose each term in order',{role:placed[3]!==null&&placed[4]!==null?'result':'unknown',size:sm()?15:19});
 mount(stageRef,svg,[card('TERMS GIVEN',values(p).slice(0,3).join('   ·   ')),card('TERMS ADDED',(placed[3]===null?0:1)+(placed[4]===null?0:1)+' of 2',placed[3]!==null&&placed[4]!==null),note('WHAT TO DO','Use the first three terms to find the rule. Fill the next two terms in sequence order.'),note('KEYBOARD','Enter on a number card, Enter on the slot. Delete on a placed card to remove.')],placed[3]!==null&&placed[4]!==null?'celebrate':'think',placed[3]!==null&&placed[4]!==null?'Both new terms follow the pattern. Check them!':'Use the same step from one term to the next.');
 stageRef.appendChild(H('div',{class:'f912-evidence'},[H('span',{text:'Find the rule'}),H('span',{text:'Continue twice'}),H('span',{class:'f912-focus',text:'Check both terms'})]));
}
const def={id,title:'Sequence continuer',config:C,
 alt:'A five-term sequence with neon number slots and hop arcs. Work out the operation between known terms and fill two missing terms.',
 staticAlt:'Examples: 4,7,10,13,16; 24,20,16,12,8; 2,4,8,16,32. Continue each sequence with the same term-to-term rule.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){stepDraw(i,stage);},
 exploreIntro:'Compare sequences that grow by addition, shrink by subtraction or double by multiplication.',
 explore(panel,stage){chosen='Y7-036-sequence-structure';termReveal=3;
  const h=H('p',{class:'f912-instruction',text:'Choose a sequence. Reveal terms gradually, then use the rule to predict the next one.'});
  const buttons=H('div',{class:'f912-choices'}),range=H('input',{type:'range',min:3,max:5,value:3,'aria-label':'How many terms are revealed'}),output=H('output',{text:'3 terms'});
  Object.entries(C.presets).forEach(([key,p])=>buttons.appendChild(btn(p.label,()=>{chosen=key;ev('preset',key);exploreDraw(stage);},'nova-btn ghost')));
  range.addEventListener('input',()=>{termReveal=+range.value;output.textContent=termReveal+' terms';ev('reveal',termReveal);exploreDraw(stage);});
  panel.append(h,buttons,H('div',{class:'f912-controls'},[H('label',{},['Reveal terms ',range]),output,btn('Show next term',()=>{termReveal=termReveal===5?3:termReveal+1;range.value=String(termReveal);output.textContent=termReveal+' terms';exploreDraw(stage);},'nova-btn primary')]));
  exploreDraw(stage);
 },
 challenge(panel,api,stage){task=0;placed={3:null,4:null};selected=null;stageRef=stage;apiRef=api;
  const header=H('h3',{class:'f912-taskhead'}),guide=H('p',{class:'f912-instruction'}),controls=H('div',{class:'f912-controls'}),statusEl=H('p',{class:'f912-status',role:'status'});statusRef=statusEl;
  function load(){const t=TASKS[task];header.textContent=t.title;guide.textContent=t.guide;controls.replaceChildren();api.fb.textContent='';api.fb.className='nova-fb';status('Fill term four, then term five.');
    controls.append(btn('Check both terms',()=>{if(placed[3]!==t.expected[0]||placed[4]!==t.expected[1]){api.check(false,'Place both missing terms in the correct order before checking.',{task});return;}
      api.check(true,'Exactly. Both new terms follow the same rule.',{task,score:task+1});
      if(task===2){header.textContent='All three sequences continued';guide.textContent='You continued growing, decreasing and doubling patterns correctly.';controls.replaceChildren(H('p',{class:'f912-maths f912-maths--gold',text:'3 / 3 · Sequences continued'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
      controls.append(btn('Continue to challenge '+(task+2),()=>{task++;placed={3:null,4:null};selected=null;load();},'nova-btn primary'));
    },'nova-btn primary'),btn('Reset cards',()=>{placed={3:null,4:null};selected=null;status('Cards cleared. Start with term four.');drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint(task===0?'Compare four and seven, then seven and ten. Apply the same difference again.':task===1?'The sequence gets four smaller each time.':'The numbers double each time. Multiply by two again.'),'nova-btn ghost'));
    ev('challengeTask',{index:task});drawChallenge();
  }
  panel.append(header,guide,controls,statusEl);load();
 },
 onRestore(){chosen='Y7-036-sequence-structure';termReveal=3;stageRef=null;apiRef=null;statusRef=null;task=0;placed={3:null,4:null};selected=null;}
};
N.registry.add({id,title:'Sequence continuer',topics:['sequences','missing terms','arithmetic rules','multiplicative patterns'],deps:['F0-02','F0-04','F0-07','F0-08']});
N.bankMount({id,num:'12',title:'Sequence continuer · Premium Edition',def,linked:['F9-01','F9-02','F9-03','F9-11'],years:'Year 7 sequence rules and structure, Year 8 extension',spec:{
 purpose:'Continue number sequences accurately by applying the same term-to-term rule to successive missing slots.',
 params:'Five terms, two missing terms, positive and negative constant differences, simple geometric doubling.',
 presets:'Y7-036 Sequence rules and structure with growing, decreasing and doubling sub-presets.',
 steps:'Notice terms → verify repeated hop → fill next slot → fill another → subtracting sequence → doubling sequence.',
 interactions:'Four modes; Explore preset/reveal controls; Challenge drag number cards into two empty slots with keyboard access and red removal tray.',
 traps:'Adding an incorrect gap, applying the second term too early, repeating a term, confusing addition with multiplication.',
 gcse:'Preparation for linear term-to-term generalisation, nth-term rules and geometric sequences.'
}});
window.F912_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const gc=component.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
