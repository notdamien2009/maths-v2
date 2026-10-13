/* F9-11 Spot-the-rule puzzle · NOVA Neon + Chalk, original F9/F3 core, no shell overrides. */
const F911_CONFIG={id:'F9-11',family:'F9',startMode:'watch',presets:{
 'Y7-036-sequence-structure':{label:'Y7-036 · Rule detective',kind:'add',first:5,k:3,shown:5},
 'Y7-036-backwards':{label:'Y7-036 · Decreasing',kind:'add',first:24,k:-4,shown:5},
 'Y7-036-doubling':{label:'Y7-036 · Doubling',kind:'mult',first:2,k:2,shown:5}},
 events:{value:['preset','term','trial','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F911_CONFIG,id=C.id;
const small=()=>innerWidth<=760,W=()=>small()?430:760;
const STEPS=[
 {name:'the-mystery',preset:'Y7-036-sequence-structure',visible:3,showRule:false,kind:'mystery',pose:'question',text:'Five, eight, eleven. What might the hidden rule be?',prompt:'Read the numbers. What changes every time?'},
 {name:'check-every-hop',preset:'Y7-036-sequence-structure',visible:4,showRule:false,kind:'differences',pose:'point-right',text:'The first difference is three. Check the next jump too.',prompt:'Does adding three work twice in a row?'},
 {name:'test-a-false-rule',preset:'Y7-036-sequence-structure',visible:4,showRule:false,kind:'false',pose:'think',text:'If we doubled five, we would get ten, not eight. That rule fails.',prompt:'Why does multiply by two fail the very first step?'},
 {name:'the-matched-rule',preset:'Y7-036-sequence-structure',visible:5,showRule:true,kind:'correct',pose:'idea',text:'Add three works on every jump. Now the mystery rule is proven.',prompt:'Use the rule to predict the next term.'},
 {name:'a-reverse-mystery',preset:'Y7-036-backwards',visible:5,showRule:true,kind:'reverse',pose:'point-down',text:'This mystery gets smaller by four each time. Every hop subtracts four.',prompt:'What is twenty minus four, then sixteen minus four?'},
 {name:'multiplying-instead',preset:'Y7-036-doubling',visible:5,showRule:true,kind:'multiply',pose:'celebrate',text:'Two, four, eight, sixteen. The amounts added change, but doubling works every time.',prompt:'Why is add two not the rule for the whole sequence?'}
];
const TASKS=[
 {preset:'Y7-036-sequence-structure',heading:'01 · Which rule always works?',guide:'Mystery sequence: 5, 8, 11, 14, 17. Choose the same operation for every jump.',choices:['+3','+4','×2'],answer:'+3',trap:{'+4':'Adding four to five gives nine, not eight. Try the first jump again.','×2':'Doubling five gives ten, not eight. Multiplying is not this rule.'}},
 {preset:'Y7-036-backwards',heading:'02 · A shrinking pattern',guide:'Mystery sequence: 24, 20, 16, 12, 8. Each term is smaller. Find the fixed change.',choices:['−4','+4','÷2'],answer:'−4',trap:{'+4':'The terms are shrinking. Adding four would make them bigger.','÷2':'Half of twenty-four is twelve, not twenty. This is a fixed subtraction.'}},
 {preset:'Y7-036-doubling',heading:'03 · What makes it double?',guide:'Mystery sequence: 2, 4, 8, 16, 32. The gaps change; the rule must not.',choices:['×2','+2','×3'],answer:'×2',trap:{'+2':'Two plus two gives four, but four plus two is six, not eight. The rule must work twice.','×3':'Two times three gives six, not four. Test the first jump.'}}
];
let chosen='Y7-036-sequence-structure',termsShown=5,trial=null,challengeIndex=0,placed=null,kb=null,stageRef=null,statusRef=null,apiRef=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered value event '+key);N.events.emit('value',{engine:id,key,value});}
function values(p){return Array.from({length:5},(_,i)=>p.kind==='add'?p.first+i*p.k:p.first*Math.pow(p.k,i));}
function rule(p){return p.kind==='mult'?'×'+p.k:p.k>=0?'+'+p.k:'−'+(-p.k);}
function apply(v,r){let m=String(r).match(/^([+−×÷])([0-9]+)$/);if(!m)return NaN;const k=+m[2];return m[1]==='+'?v+k:m[1]==='−'?v-k:m[1]==='×'?v*k:v/k;}
function checkRule(p,r){const a=values(p);return a.slice(0,-1).every((v,i)=>apply(v,r)===a[i+1]);}
function txt(p,x,y,t,size=21,role='given',anchor='middle'){return N.chalkText(p,x,y,String(t),{size,role,anchor});}
function box(p,x,y,w,h,t,role='given',size=19){return N.neonBox(p,x,y,w,h,{text:t,role,size,r:13});}
function btn(t,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:t,onclick:fn});}
function root(alt){const svg=N.svg.root(W(),small()?745:705,alt);svg.setAttribute('class','nv-svg f911-svg');svg.setAttribute('role','img');return svg;}
function clear(stage){stage.replaceChildren();N.cap(stage,'Sequence workshop','Spot-the-rule puzzle');}
function card(head,value,gold=false){return H('div',{class:'f911-card'+(gold?' f911-card--gold':'')},[H('div',{class:'f911-eyebrow',text:head}),H('div',{class:'f911-maths'+(gold?' f911-maths--gold':''),text:String(value)})]);}
function note(head,value){return H('div',{class:'f911-card f911-card--full'},[H('div',{class:'f911-eyebrow',text:head}),H('div',{class:'f911-body',text:String(value)})]);}
function mount(stage,svg,cards,pose,speech){stage.appendChild(H('div',{class:'f911-stage'},[svg,H('aside',{class:'f911-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function xval(i){const w=W();return (small()?51:91)+(w-(small()?102:182))*i/4;}
function sequence(svg,p,{visible=5,showRule=false,stage='teaching',title='MYSTERY SEQUENCE',hideRule=false}={}){
 const arr=values(p),w=W(),y=small()?247:231,cw=small()?73:115,ch=small()?84:93,role=showRule?'focus':'support';
 txt(svg,w/2,57,title,small()?23:29,'support');
 txt(svg,w/2,100,showRule?'One rule works from start to finish':'Read the numbers before testing a rule',small()?16:20,'support');
 for(let i=0;i<4;i++){
  const x1=xval(i)+cw*.4,x2=xval(i+1)-cw*.4;
  const hop=N.svg.hop(svg,x1,x2,y-50,{role:showRule?'focus':'support',height:small()?44:51});
  if(showRule && i<visible-1){N.svg.pill(svg,(xval(i)+xval(i+1))/2,y-(small()?100:107),rule(p),{role:'focus',size:small()?14:18});}
  if(stage==='challenge')hop.setAttribute('data-mystery-hop',String(i+1));
 }
 for(let i=0;i<5;i++){
  let x=xval(i),shown=i<visible;
  let g=E('g',{'class':'f911-term','data-term':i+1,'data-value':shown?arr[i]:'?'},svg);
  box(g,x-cw/2,y-ch/2,cw,ch,shown?arr[i]:'?',shown?'given':'unknown',small()?24:32);
  txt(svg,x,y+ch/2+38,'Term '+(i+1),small()?14:17,'support');
  if(shown){N.neonRing(svg,x,y-ch/2-12,{role:showRule?'result':'support',r:small()?6:8,pulse:showRule});}
 }
 return {values:arr,y};
}
function proof(svg,p,texts,role='focus',y=440){
 const w=W(),st=small()?15:21;
 txt(svg,w/2,y,texts[0],small()?18:24,'support');
 const x=[w*.21,w*.50,w*.79];
 texts.slice(1,4).forEach((v,i)=>box(svg,x[i]-(small()?56:90),y+22,small()?112:180,small()?70:74,v,role,st));
}
function teaching(i,stage){const s=STEPS[i],p=C.presets[s.preset],w=W(),sm=small();clear(stage);
 const svg=root('Five terms of a mystery number sequence, connected by hop arcs. Try one mathematical rule on every jump.');
 sequence(svg,p,{visible:s.visible,showRule:s.showRule,title:i===5?'MULTIPLICATION MYSTERY':i===4?'DECREASING MYSTERY':'FIND THE HIDDEN RULE'});
 if(i===0){proof(svg,p,['THE RULE IS STILL HIDDEN','5  →  8','8  →  11','???'],'support',445);}
 if(i===1){proof(svg,p,['COMPARE TWO JUMPS','8 − 5 = 3','11 − 8 = 3','Same gap'],'focus',445);}
 if(i===2){proof(svg,p,['TEST A POSSIBLE RULE','5 × 2 = 10','But next is 8','RULE FAILS'],'error',445);}
 if(i===3){proof(svg,p,['TEST IT AGAIN','5 + 3 = 8','8 + 3 = 11','IT MATCHES'],'result',445);}
 if(i===4){proof(svg,p,['THE SAME SUBTRACTION','24 − 4 = 20','20 − 4 = 16','−4 again'],'result',445);}
 if(i===5){proof(svg,p,['THE ADDITIONS CHANGE','2 + 2 = 4','4 + 4 = 8','×2 works'],'result',445);}
 N.svg.pill(svg,w/2,sm?649:627,i<3?'Ask: does it work on EVERY jump?':i===3?'Proved: add three each time':i===4?'Proved: subtract four each time':'Proved: multiply by two each time',{role:i<3?'unknown':'result',size:sm?16:21});
 const side=[card('MYSTERY TERMS',values(p).slice(0,s.visible).join('   ·   ')),card('RULE STATUS',i<3?'NOT PROVEN':rule(p)+'  ·  MATCH',i>=3),note('TEST THE PATTERN',i===2?'The first attempt fails: 5 × 2 is not 8. A rule must work at every step.':i<3?'Compare consecutive terms. Test one rule on all visible gaps.':'Check the same rule between each consecutive pair.'),note('YOUR TURN',s.prompt)];
 mount(stage,svg,side,s.pose,s.text);
 if(!N.reducedMotion()){
  [...svg.querySelectorAll('.f911-term')].slice(0,s.visible).forEach((g,j)=>{g.style.opacity='0';N.motion.tween(220+j*85,t=>{if(g.isConnected)g.style.opacity=String(t);},N.motion.ease.out);});
 }
}
function exploreDraw(stage){clear(stage);const p=C.presets[chosen],svg=root('Explore a rule by changing which mystery sequence is visible and testing a candidate on every jump.');
 sequence(svg,p,{visible:termsShown,showRule:trial===rule(p),title:'RULE DETECTIVE LAB'});
 const w=W(),attempt=trial===null?'Pick a possible rule':checkRule(p,trial)?'The rule matches every jump.':'The rule fails a jump.';
 txt(svg,w/2,440,'TEST THE RULE',small()?21:25,'support');
 N.svg.pill(svg,w/2,518,trial===null?'CHOOSE BELOW':'TRY '+trial,{role:trial===null?'unknown':checkRule(p,trial)?'result':'error',size:small()?19:26});
 txt(svg,w/2,603,attempt,small()?18:22,trial===null?'support':checkRule(p,trial)?'result':'error');
 const side=[card('TERMS SHOWN',termsShown),card('YOUR TRIAL',trial||'?'),note('RULE TEST',trial===null?'Choose a rule, then compare it against every pair of visible terms.':checkRule(p,trial)?'It works all the way along. Try switching to another sequence.':'The trial fails. Test the first two jumps to find why.'),note('TRY NEXT',p.kind==='mult'?'Does adding a fixed amount keep working as values double?':'Can one fixed amount explain all adjacent differences?')];
 mount(stage,svg,side,'idea',trial===null?'Try a rule. It must work on every step.':checkRule(p,trial)?'That rule matches all the terms. Well spotted!':'Try again. The rule must work across every hop.');
}
function ruleError(r,t){return t.trap[r]||'That rule does not generate every next term. Test it on the first two jumps.';}
function focusInfo(s){if(statusRef)statusRef.textContent=s;}
function target(){return {x:W()/2-(small()?116:163),y:420,w:small()?232:326,h:86,id:'rule',kind:'drop'};}
function tray(){return {x:small()?26:155,y:small()?663:615,w:small()?377:450,h:63,id:'remove',kind:'remove'};}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pid=e.pointerId;let done=false;
 function clean(){if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);}
 function move(ev){if(done)return;if(N.ui._drag!==drag){clean();return;}if(ev.pointerId!==pid||g.contains(ev.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pid,clientX:ev.clientX,clientY:ev.clientY,buttons:ev.buttons}));}
 function up(ev){if(ev.pointerId!==pid)return;if(N.ui._drag===drag&&drag.up)drag.up(ev);clean();}
 function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function choose(v){kb=v;focusInfo('Rule '+v+' selected. Press Enter on the empty rule socket, or drag it into place.');}
function set(v){const t=TASKS[challengeIndex],p=C.presets[t.preset];if(v!==t.answer||!checkRule(p,v)){const msg=ruleError(v,t);focusInfo(msg);apiRef.check(false,msg,{task:challengeIndex,rule:v});return false;}
 placed=v;kb=null;ev('placed',{slot:'rule',value:v});challengeDraw();return true;}
function remove(){placed=null;kb=null;ev('placed',{slot:'rule',value:null});focusInfo('Rule removed. Test another card.');challengeDraw();}
function source(svg,v,x,y){const ww=small()?106:152,hh=68,g=E('g',{'data-source':'rule-'+v,tabindex:0,role:'button','aria-label':'Select rule '+v},svg);
 box(g,x,y,ww,hh,v,'focus',small()?23:28);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(v);}});g.addEventListener('click',()=>choose(v));
 N.ui.svgDrag(svg,g,{box:{x,y,w:ww,h:hh},zones:()=>[target(),tray()],onDrop:key=>key==='rule'?set(v):false,onRemove:()=>focusInfo('Card returned to the tray.'),removeTo:{x:W()/2,y:tray().y+30}});fastBridge(g);}
function challengeDraw(){if(!stageRef)return;const t=TASKS[challengeIndex],p=C.presets[t.preset],svg=root('Read the mystery sequence. Drag a rule card into the socket to test that it works on every jump.'),w=W(),s=small();clear(stageRef);
 sequence(svg,p,{visible:5,showRule:placed!==null,stage:'challenge',title:'MYSTERY '+(challengeIndex+1)+'  ·  SPOT THE RULE'});
 txt(svg,w/2,386,'MATCH ONE RULE TO ALL FOUR HOPS',s?18:24,'support');
 const z=target();if(placed===null){box(svg,z.x,z.y,z.w,z.h,'DROP THE RULE HERE','unknown',s?19:23);
  E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':'rule',tabindex:0,role:'button','aria-label':'Place selected rule into empty socket'},svg)
   .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(kb===null)focusInfo('Select one rule card first.');else set(kb);}});
 }else{const g=E('g',{'data-placed':'rule','aria-label':'Placed '+placed+'. Press Delete to remove.',tabindex:0,role:'button'},svg);
  box(g,z.x,z.y,z.w,z.h,placed+'   ·   MATCHED','result',s?22:28);
  g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove();}});
  N.ui.svgDrag(svg,g,{box:z,zones:()=>[tray()],onDrop:()=>false,onRemove:remove,removeTo:{x:w/2,y:tray().y+28}});fastBridge(g);
 }
 txt(svg,w/2,530,'CHOOSE ONE RULE',s?18:25,'support');
 const first=s?29:98,gap=s?19:46;for(let i=0;i<t.choices.length;i++){const v=t.choices[i];if(v===placed)continue;source(svg,v,first+i*((s?106:152)+gap),548);}
 const r=tray();box(svg,r.x,r.y,r.w,r.h,'RED REMOVE TRAY','error',s?19:22);
 mount(stageRef,svg,[card('MYSTERY',values(p).join('  ·  ')),card('RULE FOUND',placed||'?',placed!==null),note('HOW TO TEST','A real rule generates each next term. Test two or more jumps, not just the first.'),note('KEYBOARD','Enter on a rule card; Enter on the socket. Delete on a placed card removes it.')],placed?'celebrate':'question',placed?'Every jump matches. You have proved the rule.':'Test every hop before choosing.');
 stageRef.appendChild(H('div',{class:'f911-evidence'},[H('span',{text:'Read the terms'}),H('span',{text:'Test the rule'}),H('span',{class:'f911-focus',text:placed?'Match proven':'Find the match'})]));}
const def={id,title:'Spot-the-rule puzzle',config:C,
 alt:'A hidden term-to-term rule must work for every jump between consecutive terms in a mystery sequence.',
 staticAlt:'Mysteries: 5, 8, 11, 14, 17 uses add three; 24, 20, 16, 12, 8 uses subtract four; 2, 4, 8, 16, 32 uses multiply by two.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){teaching(i,stage);},
 exploreIntro:'Test a rule against all the terms. Change the mystery to compare adding, subtracting and multiplying.',
 explore(panel,stage){chosen='Y7-036-sequence-structure';termsShown=5;trial=null;
  const head=H('p',{class:'f911-instruction',text:'Switch mystery sequences and test a candidate. Every next term must follow the SAME rule.'});
  const choices=H('div',{class:'f911-choices'}),ruleBtns=H('div',{class:'f911-choices'}),range=H('input',{type:'range',min:3,max:5,value:5,'aria-label':'Number of revealed sequence terms'}),out=H('output',{class:'f911-micro',text:'5 terms'});
  Object.entries(C.presets).forEach(([key,p])=>choices.appendChild(btn(p.label,()=>{chosen=key;trial=null;ev('preset',key);exploreDraw(stage);},'nova-btn ghost')));
  ['+3','+4','−4','×2','+2'].forEach(r=>ruleBtns.appendChild(btn('Try '+r,()=>{trial=r;ev('trial',{rule:r,correct:checkRule(C.presets[chosen],r)});exploreDraw(stage);},'nova-btn ghost')));
  range.addEventListener('input',()=>{termsShown=+range.value;out.textContent=termsShown+' terms';ev('term',termsShown);exploreDraw(stage);});
  panel.append(head,choices,H('p',{class:'f911-instruction',text:'Your rule lab — test it against each hop:'}),ruleBtns,H('div',{class:'f911-controls'},[H('label',{},['Reveal ',range]),out,btn('Reset test',()=>{trial=null;exploreDraw(stage);},'nova-btn primary')]));exploreDraw(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placed=null;kb=null;stageRef=stage;apiRef=api;
  const heading=H('h3',{class:'f911-taskhead'}),guide=H('p',{class:'f911-instruction'}),controls=H('div',{class:'f911-controls'}),statusEl=H('p',{class:'f911-status',role:'status'});statusRef=statusEl;
  function load(){const t=TASKS[challengeIndex];heading.textContent=t.heading;guide.textContent=t.guide;statusEl.textContent='Drag a rule to the socket, or use Enter.';controls.replaceChildren();api.fb.textContent='';api.fb.className='nova-fb';
   controls.append(btn('Check rule',()=>{if(placed!==t.answer){api.check(false,'Choose the rule that works on every jump.',{task:challengeIndex});return;}
    api.check(true,'Yes! '+t.answer+' works for every pair of terms.',{task:challengeIndex,score:challengeIndex+1});
    if(challengeIndex===2){heading.textContent='All three mystery rules solved';guide.textContent='You checked additive, decreasing and multiplicative patterns.';controls.replaceChildren(H('p',{class:'f911-maths f911-maths--gold',text:'3 / 3 · Rule detective'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
    controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed=null;kb=null;load();},'nova-btn primary'));
   },'nova-btn primary'),btn('Remove rule',()=>{if(placed!==null)remove();else focusInfo('No rule has been placed yet.');},'nova-btn ghost'),btn('Hint',()=>api.hint(challengeIndex===2?'Try the rule twice. Adding two works for the first pair, but not the second.':'Compare the first two terms. Does the same change work from the second to third?'),'nova-btn ghost'));
   ev('challengeTask',{index:challengeIndex});challengeDraw();
  }
  panel.append(heading,guide,controls,statusEl);load();
 },
 onRestore(){chosen='Y7-036-sequence-structure';termsShown=5;trial=null;challengeIndex=0;placed=null;kb=null;stageRef=null;statusRef=null;apiRef=null;}
};
N.registry.add({id,title:'Spot-the-rule puzzle',topics:['sequences','term-to-term','rule detection','arithmetic sequences','multiplicative patterns'],deps:['F0-02','F0-04','F0-07','F0-08']});
N.bankMount({id,num:'11',title:'Spot-the-rule puzzle · Premium Edition',def,linked:['F9-02','F9-03','F9-07','F9-12'],years:'Year 7 sequence rules and structure, Years 8–9 extension',spec:{
 purpose:'Recognise a hidden term-to-term rule and verify it against more than one jump.',
 params:'Five terms; additive +3 and −4; geometric ×2; reveal 3–5 terms; three rule trials.',
 presets:'Y7-036 Sequence rules and structure, with decreasing and doubling sub-presets.',
 steps:'Read mystery → compare jumps → reject wrong rule → prove +3 → test subtraction → test multiplication.',
 interactions:'Watch and Guided timeline, Explore preset/reveal/rule controls, Challenge 3 draggable rule cards with removal tray and keyboard placement.',
 traps:'Confusing multiplication and addition, reversing a decreasing sign, judging the rule using one jump only.',
 gcse:'Foundational reasoning for linear nth term and quadratic sequences; linked to F9-02 and F9-09.'
}});
window.F911_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const gc=component.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
