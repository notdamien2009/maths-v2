/* F9-06 Geometric Sequence | inherited NOVA F0/F1/F2/F9-01 v3 visuals, no local shell/mascot overrides. */
const F906_CONFIG={id:'F9-06',family:'F9',startMode:'watch',preset:'Y8-020-geometric-sequences',presets:{
 'Y8-020-geometric-sequences':{label:'Y8 · Doubling',a:2,r:2,terms:5,rule:'×2',context:'Geometric sequences'},
 'Y9-014-exponential-decay':{label:'Y9 · Halving',a:64,r:0.5,terms:5,rule:'÷2',context:'Exponential decay'},
 'Y9-014-exponential-growth':{label:'Y9 · Tripling',a:2,r:3,terms:5,rule:'×3',context:'Exponential growth'}
 },events:{value:['preset','position','ratio','term','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,C=F906_CONFIG,H=N.h,E=N.svg.el,id=C.id;
const small=()=>window.innerWidth<=760,WIDTH=()=>small()?430:760,term=(p,n)=>p.a*Math.pow(p.r,n-1);
const steps=[
 {name:'see-the-first-term',pose:'explain',text:'Start with two. That is term one, not the amount we add each time.',prompt:'Read the first value. What could make it grow?'},
 {name:'multiply-once',pose:'point-right',text:'Multiply two by two to reach four. The bar doubles.',prompt:'Why does multiplication give the next bar?'},
 {name:'multiply-again',pose:'count',text:'Multiply by two again. Four becomes eight.',prompt:'What operation stays the same?'},
 {name:'keep-the-ratio',pose:'think',text:'Every step doubles: two, four, eight, sixteen, thirty-two. The jumps get bigger, but the multiplier is unchanged.',prompt:'Do we add the same number each time?'},
 {name:'halving-contrast',pose:'point-right',text:'Geometric sequences can shrink too. Sixty-four divided by two becomes thirty-two, then sixteen, then eight.',prompt:'How can you tell that each value is halved?'},
 {name:'generalise-the-growth',pose:'celebrate',text:'The next term is found by multiplying by the same factor each time. For doubling, term n is two times two to the power n minus one.',prompt:'Explain why a fixed multiplier is not the same as a fixed difference.'}
];
let presetKey='Y8-020-geometric-sequences',visible=5,challengeIndex=0,placed={},kbChoice=null,stageRef=null,panelRef=null,apiRef=null;
const TASKS=[
 {title:'01 · Double the sequence',guide:'Sequence 3, 6, 12, 24, … Choose the common ratio and the next term.',a:3,r:2,ratio:'×2',next:'48',ratios:['×2','+3','×3'],terms:['48','27','36'],traps:{' +3':'The sequence is not adding a fixed amount.','+3':'Three to six adds three, but six to twelve adds six. The addition changes.','×3':'Three multiplied by three is nine, not six.','27':'Adding three again does not continue the doubling.','36':'Adding twelve is not the rule for every step.','48':'Correct.'}},
 {title:'02 · Multiply by three',guide:'Sequence 2, 6, 18, 54, … Place the common ratio and term five.',a:2,r:3,ratio:'×3',next:'162',ratios:['×3','+4','×2'],terms:['162','58','108'],traps:{'+4':'The increase from 6 to 18 is twelve, not four.','×2':'Two doubled is four, not six.','58':'Adding four does not continue the pattern.','108':'This is twice fifty-four. We need three times fifty-four.'}},
 {title:'03 · A sequence that halves',guide:'Sequence 64, 32, 16, 8, … Drag the shrinking rule and fifth term.',a:64,r:.5,ratio:'÷2',next:'4',ratios:['÷2','−8','×2'],terms:['4','0','16'],traps:{'−8':'Sixty-four to thirty-two is a decrease of thirty-two, not eight.','×2':'Multiplying by two grows the terms. These bars shrink.','0':'Subtracting eight works once only, not for the full sequence.','16':'That repeats the third term. Halve eight to find the fifth.'}}
];
function event(key,value){if(!C.events.value.includes(key))throw Error('Unknown F906 event '+key);N.events.emit('value',{engine:id,key,value});}
function text(svg,x,y,s,size=20,role='given',anchor='middle'){return N.chalkText(svg,x,y,String(s),{size,role,anchor});}
function box(svg,x,y,w,h,s,role='given',size=20){return N.neonBox(svg,x,y,w,h,{role,text:s,size,r:12});}
function btn(label,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:label,onclick:fn});}
function root(alt,challenge=false){let svg=N.svg.root(WIDTH(),challenge?925:795,alt);svg.setAttribute('role','img');svg.setAttribute('class','nv-svg f906-svg');return svg;}
function clear(stage){stage.replaceChildren();N.cap(stage,'Sequence workshop','Geometric sequence');}
function card(label,val,gold=false){const math=H('div',{class:'f906-maths'+(gold?' f906-maths--gold':'')});math.appendChild(typeof val==='string'||typeof val==='number'?document.createTextNode(String(val)):val);return H('div',{class:'f906-card'+(gold?' f906-card--gold':'')},[H('div',{class:'f906-eyebrow',text:label}),math]);}
function note(label,val){return H('div',{class:'f906-card f906-card--full'},[H('div',{class:'f906-eyebrow',text:label}),H('div',{class:'f906-body',text:String(val)})]);}
function mount(stage,svg,cards,pose,say){stage.appendChild(H('div',{class:'f906-stage'},[svg,H('aside',{class:'f906-side'},cards)]));N.scene.helperStrip(stage,pose,say);}
function coords(){const w=WIDTH(),padding=small()?52:100,gap=(w-padding*2)/4;return Array.from({length:5},(_,i)=>padding+i*gap);}
/* Main visual: bars have true relative value within the sequence; the core neonBox provides glass edge, fill, glow and highlights. */
function drawBars(svg,p,count,options={}){
 let x=coords(),base=options.challenge?410:438;
 let max=0;for(let i=1;i<=5;i++)max=Math.max(max,term(p,i));
 let maxH=options.challenge?230:260,barW=small()?34:50;
 let actual=options.challenge?4:count;
 N.neonLine(svg,x[0]-35,base+3,x[4]+35,base+3,{role:'support',width:2});
 for(let i=0;i<5;i++){
    const k=i+1,v=term(p,k),shown=i<actual;
    if(shown){
      let h=Math.max(13,Math.round(maxH*v/max));
      let g=E('g',{'data-bar':String(k)},svg);
      N.neonBox(g,x[i]-barW/2,base-h,barW,h,{role:i===actual-1?'focus':'op',r:9});
      text(svg,x[i],base-h-18,String(v),small()?19:23,i===actual-1?'result':'given');
      text(svg,x[i],base+40,small()?'n = '+k:'Term '+k,small()?20:17,'support');
      if(!N.reducedMotion()&&i===actual-1&&options.animate){
        const g0=g,scale=h;N.motion.tween(470,(v)=>{if(g0.isConnected){g0.style.opacity=String(.08+.92*v);g0.setAttribute('transform','translate(0,'+(base*(1-v)).toFixed(1)+') scale(1,'+v.toFixed(3)+')');}},N.motion.ease.out,()=>g0.removeAttribute('transform'));
      }
    }else if(options.challenge&&i===4){
      N.neonRing(svg,x[i],base-32,{role:'unknown',r:17,pulse:false});
      text(svg,x[i],base-26,'?',small()?23:27,'focus');text(svg,x[i],base+40,small()?'n = 5':'Term 5',small()?20:17,'support');
    }else if(options.ghost){
      N.neonRing(svg,x[i],base-32,{role:'support',r:12,pulse:false});text(svg,x[i],base-26,'?',17,'support');text(svg,x[i],base+40,small()?'n = '+k:'Term '+k,small()?20:17,'support');
    }
 }
 if(options.hops){
  for(let i=0;i<Math.min(actual-1,4);i++){
    // All hops use the canonical NOVA.svg.hop primitive; maths sits BELOW the bar region with no overlaps.
    let hop=N.svg.hop(svg,x[i]+17,x[i+1]-17,base+123,{role:i===actual-2?'focus':'op',height:small()?48:57,label:options.hideRule?'?':p.rule});
    if(options.animate&&i===actual-2&&!N.reducedMotion()){hop.style.opacity='.12';N.motion.tween(440,v=>{if(hop.isConnected)hop.style.opacity=String(.12+.88*v);},N.motion.ease.out);}
  }
 }
 return {x,base};
}
function teach(idx,stage){
 const info=steps[Math.min(idx,steps.length-1)],isDecay=idx===4,
 p=C.presets[isDecay?'Y9-014-exponential-decay':'Y8-020-geometric-sequences'],
 count=idx===0?1:idx===1?2:idx===2?3:idx===3?5:idx===4?4:5;
 clear(stage);const svg=root('Glowing glass bars showing a geometric sequence; curved multiplication hops show the common ratio.');
 text(svg,WIDTH()/2,47,isDecay?'HALVE THE PREVIOUS TERM':'BUILD THE MULTIPLIER',small()?25:31,'support');
 text(svg,WIDTH()/2,87,['Begin with the first term','Multiply to make the next bar','Repeat the same operation','Every step doubles — no fixed addition','A constant ratio can make bars shrink','A fixed multiplier builds a geometric sequence'][idx],small()?16:19,'support');
 drawBars(svg,p,count,{hops:idx>0,ghost:idx<3,animate:true});
 if(idx===3)N.svg.pill(svg,WIDTH()/2,688,'×2 repeated · not +2',{role:'focus',size:small()?18:21});
 else if(idx===4)N.svg.pill(svg,WIDTH()/2,688,'÷2 each time',{role:'focus',size:small()?20:22});
 else if(idx===5){N.neonBox(svg,WIDTH()*.16,649,WIDTH()*.68,77,{role:'result',r:19});text(svg,WIDTH()/2-18,700,'T(n) = 2 × 2',small()?22:27,'result');text(svg,WIDTH()/2+(small()?76:97),676,'n−1',small()?15:17,'result');text(svg,WIDTH()/2,754,'n − 1 counts the number of multiplying steps',small()?17:18,'support');}
 else text(svg,WIDTH()/2,690,idx===0?'What could turn two into four?':idx===1?'Multiply again to predict term three.':idx===2?'The jumps grow: add two, then add four.':'What will happen on the next step?',small()?17:19,'support');
 const cards=[card('COMMON RATIO',idx===0?'Predict it':p.rule,idx>0),card('LATEST TERM',term(p,count)),note('LOOK CLOSELY',idx===4?'Every term is half the previous term. The same operation works for every hop.':idx===3?'The gaps increase by two, four, eight and sixteen; there is no constant difference.':'Read each value and use the same operation to build the next one.')];
 if(idx===5)cards.push(card('POSITION RULE',H('span',{},['2 × 2',H('sup',{text:'n−1'})]),true));
 mount(stage,svg,cards,info.pose,info.text);
}
function explore(stage){
 const p=C.presets[presetKey];clear(stage);const svg=root('Explore growing and shrinking geometric sequences with true relative-height neon glass bars.');
 text(svg,WIDTH()/2,45,'COMPARE THE RATIOS',small()?25:30,'support');
 text(svg,WIDTH()/2,84,p.label+' · adjust how many terms are revealed',small()?16:19,'support');
 drawBars(svg,p,visible,{hops:true,ghost:true});
 N.svg.pill(svg,WIDTH()/2,687,'Each hop = '+p.rule,{role:'focus',size:small()?19:24});
 const next=term(p,visible+1);
 text(svg,WIDTH()/2,745,'Next term after '+term(p,visible)+' is '+next,small()?17:20,'result');
 const details=p.r<1?'Halving is division by two. A fixed fraction of the previous value is retained, so the bars shrink.':p.r===2?'Doubling increases by different amounts, but every hop multiplies by exactly two.':'Tripling is not adding three; each term is three times the previous one.';
 mount(stage,svg,[card('RATIO',p.rule,true),card('REVEALED',visible+' terms'),card('NEXT TERM',next),note('WHAT TO NOTICE',details)],p.r<1?'think':'idea',p.r<1?'Each hop halves the previous term.':'Multiplication remains the rule, even when the bars grow quickly.');
}
function task(){return TASKS[challengeIndex];}
const ruleZone=()=>({x:small()?43:176,y:595,w:small()?145:160,h:61,id:'ratio',kind:'drop'});
const termZone=()=>({x:small()?244:430,y:595,w:small()?145:160,h:61,id:'term',kind:'drop'});
const removeZone=()=>({x:small()?26:165,y:846,w:small()?378:430,h:52,id:'remove',kind:'remove'});
function status(s){let t=panelRef&&panelRef.querySelector('.f906-status');if(t)t.textContent=s;}
function diagnostic(kind,v){let t=task();if(v===(kind==='ratio'?t.ratio:t.next))return '';
 return t.traps[v]||(kind==='ratio'?'Check all three hops. The same multiplication or division must work each time.':'Apply the ratio once more to the last given term.');
}
function place(kind,v){const t=task(),expected=kind==='ratio'?t.ratio:t.next;
 if(v!==expected){apiRef.check(false,diagnostic(kind,v),{task:challengeIndex,slot:kind,answer:v});status('That choice does not work across the sequence.');return false;}
 placed[kind]=v;kbChoice=null;event('placed',{slot:kind,value:v});drawChallenge();status('Correct card placed. Check the other gap.');return true;
}
function remove(kind){delete placed[kind];kbChoice=null;event('placed',{slot:kind,value:null});drawChallenge();status('Removed. You can replace the card.');}
/* F0 drag uses pointer capture. Keep the same fast-pointer bridge proven on F9-05. */
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pointerId=e.pointerId;let done=false;
  const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
  function move(e){if(done)return;if(N.ui._drag!==drag){clean();return;}if(e.pointerId!==pointerId||g.contains(e.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons}));}
  function up(e){if(e.pointerId!==pointerId)return;if(N.ui._drag===drag&&drag.up)drag.up(e);clean();}
  function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
  window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function source(svg,kind,v,x,y,w,h){const g=E('g',{'data-source':kind+':'+v,tabindex:0,role:'button','aria-label':'Choose '+v+' for '+kind},svg);
 box(g,x,y,w,h,v,kind==='ratio'?'focus':'given',small()?17:20);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();kbChoice={kind,value:v};status('Selected '+v+'. Press Enter on the '+kind+' gap.');}});
 g.addEventListener('click',()=>{kbChoice={kind,value:v};status('Selected '+v+'. Press Enter on the '+kind+' gap.');});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[kind==='ratio'?ruleZone():termZone(),removeZone()],onDrop:(id)=>id===kind?place(kind,v):false,onRemove:()=>{kbChoice=null;status('Card returned to tray.');},removeTo:{x:WIDTH()/2,y:removeZone().y+26}});fastBridge(g);
}
function placedCard(svg,kind,v){const z=kind==='ratio'?ruleZone():termZone(),g=E('g',{'data-placed':kind,tabindex:0,role:'button','aria-label':'Placed '+v+'. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,v,'result',small()?22:24);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(kind);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[removeZone()],onDrop:()=>false,onRemove:()=>remove(kind),removeTo:{x:WIDTH()/2,y:removeZone().y+26}});fastBridge(g);
}
function target(svg,kind){const z=kind==='ratio'?ruleZone():termZone();if(placed[kind]){placedCard(svg,kind,placed[kind]);return;}
 box(svg,z.x,z.y,z.w,z.h,'?','unknown',26);
 const hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':kind,tabindex:0,role:'button','aria-label':'Place the '+kind+' card here'},svg);
 function go(){if(kbChoice){if(kbChoice.kind!==kind){status('Select the matching '+kind+' card.');return;}place(kind,kbChoice.value);}else status('Select a '+kind+' card first.');}
 hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});hit.addEventListener('click',go);
}
function drawChallenge(){
 if(!stageRef)return;
 const t=task(),p={a:t.a,r:t.r,rule:t.ratio},svg=root('Geometric sequence challenge: compare the first four glass bars and place the ratio and fifth term.',true);
 clear(stageRef);
 text(svg,WIDTH()/2,43,'FIND THE COMMON RATIO',small()?24:30,'support');
 text(svg,WIDTH()/2,82,'A fixed multiplier connects every term',small()?16:20,'support');
 drawBars(svg,p,4,{challenge:true,hops:true,hideRule:true});
 text(svg,WIDTH()/2,557,'Choose the rule and predict term five',small()?17:20,'support');
 text(svg,ruleZone().x+ruleZone().w/2,580,'MULTIPLY / DIVIDE',small()?15:18,'support');
 text(svg,termZone().x+termZone().w/2,580,'NEXT TERM',small()?15:18,'support');
 target(svg,'ratio');target(svg,'term');
 text(svg,small()?26:145,684,'RULE CARDS',small()?15:18,'support','start');
 const x0=small()?45:183,w=small()?96:116,gap=small()?27:38;
 t.ratios.forEach((v,i)=>{if(placed.ratio===v)return;source(svg,'ratio',v,x0+i*(w+gap),696,w,43);});
 text(svg,small()?26:145,766,'TERM CARDS',small()?15:18,'support','start');
 t.terms.forEach((v,i)=>{if(placed.term===v)return;source(svg,'term',v,x0+i*(w+gap),776,w,43);});
 const rz=removeZone();box(svg,rz.x,rz.y,rz.w,rz.h,'RED REMOVE TRAY','error',small()?17:19);
 const side=[card('PLACED',Object.keys(placed).length+' / 2',true),note('KEY IDEA','Multiplication uses the same factor for every hop. The amount added will usually change.'),note('KEYBOARD','Press Enter on a card, then Enter on its empty gap. Delete removes a placed card.')];
 mount(stageRef,svg,side,challengeIndex===2?'think':'point-right','Check the operation from term to term. It must work every time.');
}
const def={id,title:'Geometric sequence',config:C,
 alt:'Geometric sequences represented by proportional glowing neon glass bars and multiplication hops.',
 staticAlt:'Doubling: 2, 4, 8, 16, 32; halving: 64, 32, 16, 8, 4. Geometric rules multiply or divide by a constant ratio.',
 steps:steps.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){teach(Math.min(i,5),stage);},
 exploreIntro:'Choose doubling, halving or tripling. Watch how the size changes, but the ratio remains constant.',
 explore(panel,stage,api){presetKey='Y8-020-geometric-sequences';visible=4;
   const info=H('p',{class:'f906-instruction',text:'Switch between growth and decay. Reveal more bars and predict the next value.'});
   const choices=H('div',{class:'f906-choices'});
   for(const [key,p] of Object.entries(C.presets))choices.append(btn(p.label,()=>{presetKey=key;event('preset',key);explore(stage);},'nova-btn ghost'));
   const range=H('input',{type:'range',min:'2',max:'5',value:'4','aria-label':'Number of visible terms'}),out=H('output',{class:'f906-micro',text:'4 terms'});
   range.addEventListener('input',()=>{visible=+range.value;out.textContent=visible+' terms';event('position',visible);explore(stage);});
   panel.append(info,choices,H('div',{class:'f906-control'},[H('label',{},['Reveal terms ',range]),out]));explore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placed={};kbChoice=null;stageRef=stage;panelRef=panel;apiRef=api;
   const heading=H('h3',{class:'f906-taskhead'}),guide=H('p',{class:'f906-instruction'}),actions=H('div',{class:'f906-control'}),help=H('p',{class:'f906-status',role:'status'});
   function load(){const t=task();heading.textContent=t.title;guide.textContent=t.guide;actions.replaceChildren();help.textContent='Drag the two correct cards, or use keyboard Enter.';api.fb.textContent='';api.fb.className='nova-fb';
     actions.append(btn('Check pattern',()=>{
      if(placed.ratio!==t.ratio||placed.term!==t.next){api.check(false,'Place the correct ratio AND term before checking.',{task:challengeIndex});return;}
      // Strict maths check — never allow an inconsistent configured challenge.
      if(String(term(t,5))!==t.next){api.check(false,'Internal configuration error. Stop and report this component.',{task:challengeIndex});return;}
      event('ratio',t.ratio);event('term',Number(t.next));api.check(true,'Correct. The '+t.ratio+' rule produces term five = '+t.next+'.',{task:challengeIndex,score:challengeIndex+1});
      if(challengeIndex===2){heading.textContent='All three patterns complete';guide.textContent='You recognised doubling, tripling and halving as geometric sequences.';actions.replaceChildren(H('p',{class:'f906-maths f906-maths--gold',text:'3 / 3 · Ratios secured'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
      actions.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed={};kbChoice=null;load();},'nova-btn primary'));
     },'nova-btn primary'),btn('Reset cards',()=>{placed={};kbChoice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('Compare term two ÷ term one, then check the SAME rule works for every hop.'),'nova-btn ghost'));
     event('challengeTask',{index:challengeIndex});drawChallenge();
   }
   panel.append(heading,guide,actions,help);load();
 },
 onRestore(){presetKey='Y8-020-geometric-sequences';visible=5;challengeIndex=0;placed={};kbChoice=null;stageRef=null;panelRef=null;apiRef=null;}
};
N.registry.add({id,title:'Geometric sequence',topics:['sequences','geometric sequences','ratio','exponential growth','exponential decay'],deps:['F0-02','F0-04','F0-07','F0-08','F0-13']});
N.bankMount({id,num:'06',title:'Geometric sequence · Premium Edition',def,linked:['F9-02','F9-04','F9-07','F9-09'],years:'Year 8 geometric sequences · Year 9 exponential contexts · GCSE extension',spec:{
 purpose:'See a constant multiplicative ratio in growing and shrinking geometric sequences using proportional glass bars.',
 params:'Start a; positive ratio r; geometric term T(n)=a×r^(n−1); five terms and three source presets.',
 presets:'Y8-020 doubling 2,4,8,16,32; Y9-014 decay 64,32,16,8,4; Y9-014 growth 2,6,18,54,162.',
 steps:'First term → ratio hop → multiply again → notice changing differences → halve → generalise using n−1 repeated multiplications.',
 interactions:'Watch/Guided/Explore/Challenge; preset buttons, slider, drag rule and fifth-term cards, snap/remove/re-grab, Enter/Delete keyboard, misconceptions.',
 traps:'Confusing additive difference with multiplicative ratio; reversing halving; choosing two-steps-ahead terms or repeating earlier terms.',
 gcse:'Bridge to exponential rules and compound-growth contexts without implying continuous values between discrete terms.'
}});
window.F906_ENGINE=N.engines[id];
const c=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);[...c.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));c.appendChild(dev);
const heading=c.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>c.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(c,{childList:true,subtree:true});
})();
