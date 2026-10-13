/* F9-08 Triangular numbers dot arrays · NOVA premium F0 foundation / F9-01 v3 background. */
const F908_CONFIG={id:'F9-08',family:'F9',startMode:'watch',presets:{
 'Y7-036-sequence-structure':{label:'Y7 · Growing rows',mode:'triangle',stage:4,context:'Count one more dot in each new row'},
 'KS3-triangular-visual-proof':{label:'KS3 · Double & halve',mode:'rectangle',stage:5,context:'Use two copies to derive a general formula'}
},events:{value:['preset','position','view','count','row','answer','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F908_CONFIG,id=C.id;
const small=()=>innerWidth<=760,W=()=>small()?430:760;
const T=n=>n*(n+1)/2;
const STEPS=[
 {name:'start-from-one-row',n:3,kind:'triangle',pose:'explain',text:'Each row has one more dot. One, two, three: that makes six dots.',prompt:'Count each row before finding the total.'},
 {name:'add-the-fourth-row',n:4,kind:'triangle',pose:'count',text:'Add a new row of four. Six plus four makes ten.',prompt:'Can you see exactly which four dots are new?'},
 {name:'another-row',n:5,kind:'triangle',pose:'point-down',text:'The fifth row adds five more. Ten plus five gives fifteen.',prompt:'How many will the sixth row add?'},
 {name:'double-the-triangle',n:4,kind:'rectangle',pose:'idea',text:'Copy the triangle, then turn the copy around. The two triangles make a four-by-five rectangle.',prompt:'How many dots are in the rectangle? How many are original?'},
 {name:'half-the-rectangle',n:5,kind:'rectangle',pose:'point-right',text:'Five rows and six columns make thirty dots. Half belongs to one triangle: fifteen.',prompt:'Why does the rectangle contain twice as many dots?'},
 {name:'general-rule',n:6,kind:'rectangle',pose:'celebrate',text:'For position n, double the dots to get n times n plus one. Divide by two for one triangle.',prompt:'Use n times n plus one divided by two for the sixth triangle.'}
];
const TASKS=[
 {n:4,prev:6,choices:[3,4,5],counts:[10,16,9],heading:'01 · Build the fourth triangle',guide:'Three rows contain six dots. Add the missing row, then choose the total.'},
 {n:5,prev:10,choices:[4,5,6],counts:[15,25,14],heading:'02 · Build the fifth triangle',guide:'Four rows contain ten dots. Add the fifth row and choose the new total.'},
 {n:6,prev:15,choices:[5,6,7],counts:[21,36,20],heading:'03 · Build the sixth triangle',guide:'Five rows contain fifteen dots. Extend the pattern and find the total.'}
];
let currentView='triangle',presetKey='Y7-036-sequence-structure',position=4,challengeIndex=0,placedRow=null,placedCount=null,kbChoice=null,stageRef=null,apiRef=null,statusRef=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9-08 event '+key);N.events.emit('value',{engine:id,key,value});}
function txt(p,x,y,s,size=19,role='given',anchor='middle'){return N.chalkText(p,x,y,String(s),{size,role,anchor});}
function box(p,x,y,w,h,s,role='given',size=19){return N.neonBox(p,x,y,w,h,{role,text:s,size,r:13});}
function btn(s,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:s,onclick:fn});}
function root(alt,challenge=false){const svg=N.svg.root(W(),challenge?1085:830,alt);svg.setAttribute('class','nv-svg f908-svg');svg.setAttribute('role','img');return svg;}
function clear(stage){stage.replaceChildren();N.cap(stage,'Sequence workshop','Triangular numbers dot arrays');}
function card(h,v,gold=false){return H('div',{class:'f908-card'+(gold?' f908-card--gold':'')},[H('div',{class:'f908-eyebrow',text:h}),H('div',{class:'f908-maths'+(gold?' f908-maths--gold':''),text:String(v)})]);}
function note(h,v){return H('div',{class:'f908-card f908-card--full'},[H('div',{class:'f908-eyebrow',text:h}),H('div',{class:'f908-body',text:String(v)})]);}
function mount(stage,svg,cards,pose,speech){stage.appendChild(H('div',{class:'f908-stage'},[svg,H('aside',{class:'f908-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function dot(p,x,y,role='op',r=5.5){return N.neonRing(p,x,y,{role,r,pulse:false});}
function spacing(n,challenge=false){return Math.min(small()?45:56,235/Math.max(1,n-1));}
function triangle(svg,n,cx,top,step,{newest=false,mini=false,ghost=false,rows=null}={}){
 const g=E('g',{'data-pattern':'triangle','data-stage':n},svg);
 for(let i=0;i<(rows==null?n:rows);i++)for(let j=0;j<=i;j++){
  let role=newest&&i===n-1?'focus':'op';
  if(ghost&&i===n-1)role='unknown';
  const d=dot(g,cx+(j-i/2)*step,top+i*step,role,mini?3.3:(small()?5.9:6.3));
  if(ghost&&i===n-1)d.style.opacity='.42';
 }
 return g;
}
function rectangle(svg,n,cx,top,step,{animated=false}={}){
 const g=E('g',{'data-pattern':'rectangle','data-stage':n},svg),x0=cx-n*step/2;
 for(let i=0;i<n;i++)for(let j=0;j<=n;j++){
  // Each triangular half occupies n(n+1)/2 dots, shown by opposite neon role colours.
  const role=j<=i?'op':'focus';
  const node=dot(g,x0+j*step,top+i*step,role,small()?5.3:5.9);
  node.setAttribute('data-half',role==='op'?'original':'flipped-copy');
  if(animated&&role==='focus'&&!N.reducedMotion()){
   node.style.opacity='0';N.motion.tween(420+(i+j)*75,v=>{if(node.isConnected)node.style.opacity=String(v);},N.motion.ease.out);
  }
 }
 return g;
}
function mini(svg,n,cx,cy){const d=Math.min(15,53/Math.max(1,n-1));triangle(svg,n,cx,cy-(n-1)*d/2,d,{mini:true});txt(svg,cx,cy+68,'Stage '+n,small()?16:17,'support');txt(svg,cx,cy+99,T(n),small()?21:25,'result');}
function evidence(svg,n,kind,{animate=false}={}){
 const w=W(),cx=w/2,step=spacing(n);
 if(kind==='triangle'){
  triangle(svg,n,cx,165,step,{newest:true});
  txt(svg,cx,165+n*step+42,'1 + 2 + … + '+n+' = '+T(n),small()?22:26,'result');
  const y=535;
  [1,2,3,4].forEach((v,i)=>mini(svg,v,w*(.14+i*.24),y));
  N.svg.pill(svg,cx,745,'Add row '+n+' = previous total + '+n,{role:'focus',size:small()?16:21});
 }else{
  rectangle(svg,n,cx,165,step,{animated:animate});
  txt(svg,cx,165+n*step+44,'n rows   ×   (n + 1) columns',small()?19:23,'support');
  const y=590;
  txt(svg,cx,y,'Two equal triangles = '+n+' × '+(n+1)+' = '+n*(n+1),small()?20:26,'given');
  txt(svg,cx,y+56,'One triangle = '+n*(n+1)+' ÷ 2 = '+T(n),small()?22:29,'result');
  N.svg.pill(svg,cx,743,'T(n) = n(n + 1) ÷ 2',{role:'focus',size:small()?18:24});
 }
}
function renderLearning(i,stage){const s=STEPS[i],w=W();clear(stage);const svg=root('Triangular dots, one through n in growing rows; duplicated copy forms n by n plus one rectangle.');
 txt(svg,w/2,51,s.kind==='triangle'?'BUILD A TRIANGLE':'DOUBLE IT INTO A RECTANGLE',small()?22:28,'support');
 txt(svg,w/2,94,['Row lengths: one, two, three','One more row adds four dots','One more row adds five dots','Each colour is one equal triangle','Divide the full rectangle by two','General rule for any position n'][i],small()?16:20,'support');
 evidence(svg,s.n,s.kind,{animate:i===3});
 const cards=s.kind==='triangle'?[card('POSITION · n',s.n),card('TOTAL DOTS',T(s.n),true),note('COUNT THE ROWS','1 + 2 + … + '+s.n+' = '+T(s.n)),note('NEXT STEP','A new row contributes exactly '+(s.n+1)+' more dots.')]:[card('RECTANGLE DOTS',s.n*(s.n+1)),card('ONE TRIANGLE',T(s.n),true),note('WHY DIVIDE BY TWO?','The cyan and gold triangles contain exactly the same number of dots.'),note('GENERAL RULE','T(n) = n(n + 1) ÷ 2')];
 mount(stage,svg,cards,s.pose,s.text);
 if(!N.reducedMotion()&&s.kind==='triangle'){
   svg.querySelectorAll('.nv-ring').forEach((node,k)=>{
     node.style.opacity='0';N.motion.tween(150+Math.min(k,35)*30,v=>{if(node.isConnected)node.style.opacity=String(v);},N.motion.ease.out);
   });
 }
}
function renderExplore(stage){clear(stage);const w=W(),svg=root('Explore triangular dot patterns and the doubled rectangle.');
 txt(svg,w/2,51,currentView==='triangle'?'GROW BY ADDING ROWS':'TWO TRIANGLES · ONE RECTANGLE',small()?22:27,'support');
 txt(svg,w/2,94,C.presets[presetKey].context,small()?17:19,'support');
 evidence(svg,position,currentView);
 const cards=[card('STAGE · n',position),card('TRIANGLE DOTS',T(position),true),note('CHECK YOUR COUNT',currentView==='triangle'?'Add the row sizes 1 + 2 + … + '+position+'.':'Double the triangle to form '+position+' × '+(position+1)+' dots.'),note('USEFUL LINK','The increase from stage '+position+' to stage '+(position+1)+' is '+(position+1)+' more dots.')];
 mount(stage,svg,cards,currentView==='rectangle'?'show-two':'point-down',currentView==='rectangle'?'The second copy is equal to the first. Halve the total.':'Every new row contains one more dot than before.');
}
function task(){return TASKS[challengeIndex];}
function destRow(){const n=task().n,d=spacing(n,true),cx=W()/2;return {x:cx-(n-1)*d/2-20,y:185+(n-1)*d-20,w:(n-1)*d+40,h:40,id:'row',kind:'drop'};}
function destCount(){return {x:W()/2-95,y:570,w:190,h:58,id:'count',kind:'drop'};}
function bin(){return {x:small()?26:125,y:1024,w:small()?376:510,h:53,id:'remove',kind:'remove'};}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pid=e.pointerId;let done=false;
  const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
  function move(ev){if(done)return;if(N.ui._drag!==drag){clean();return;}if(ev.pointerId!==pid||g.contains(ev.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pid,clientX:ev.clientX,clientY:ev.clientY,buttons:ev.buttons}));}
  function up(ev){if(ev.pointerId!==pid)return;if(N.ui._drag===drag&&drag.up)drag.up(ev);clean();}
  function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
  window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function status(t){if(statusRef)statusRef.textContent=t;}
function misconception(slot,val){const t=task();if(slot==='row')return val<t.n?'That row is too short. Row '+t.n+' needs '+t.n+' dots, not '+val+'.':'That row is too long. The next row is one dot longer than row '+(t.n-1)+'.';
 if(val===t.n*t.n)return 'That is a square number: '+t.n+' × '+t.n+'. Our dots form a triangle, not a square.';
 if(val===T(t.n)-1)return 'Count the new row carefully. One more dot is still needed.';
 return 'Add the rows from one to '+t.n+', or halve '+t.n+' × '+(t.n+1)+'.';}
function place(slot,v){const t=task(),ok=slot==='row'?v===t.n:v===T(t.n);
 if(!ok){const message=misconception(slot,v);apiRef.check(false,message,{task:challengeIndex,slot,value:v});status(message);return false;}
 if(slot==='row')placedRow=v;else placedCount=v;
 ev('placed',{slot,value:v});status(slot==='row'?'Row '+v+' snapped in. Now find the full dot total.':'Correct total placed. Check your two choices.');drawChallenge();return true;
}
function remove(slot){if(slot==='row')placedRow=null;else placedCount=null;ev('placed',{slot,value:null});status('Card removed. You can choose again.');drawChallenge();}
function drawDotRow(svg,x,y,w,n,role='focus',mini=false){const g=E('g',{'data-dot-row':n},svg),sep=Math.min(23,(w-30)/Math.max(1,n-1));for(let j=0;j<n;j++)dot(g,x+w/2+(j-(n-1)/2)*sep,y,role,mini?4.1:5.1);return g;}
function source(svg,slot,v,x,y,w,h){const g=E('g',{'data-source':slot+'-'+v,tabindex:0,role:'button','aria-label':slot==='row'?'Choose row of '+v+' dots':'Choose total '+v},svg);
 box(g,x,y,w,h,slot==='row'?null:String(v),slot==='row'?'focus':'given',small()?21:23);
 if(slot==='row')drawDotRow(g,x,y+h/2,w,v,'focus',true);
 const choose=()=>{kbChoice={slot,value:v};status('Selected '+(slot==='row'?v+'-dot row':'total '+v)+'. Press Enter on the matching gap.');};
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});g.addEventListener('click',choose);
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[slot==='row'?destRow():destCount(),bin()],onDrop:key=>key===slot?place(slot,v):false,onRemove:()=>{kbChoice=null;status('Card returned to tray.');},removeTo:{x:W()/2,y:bin().y+16}});fastBridge(g);
}
function placed(svg,slot,v){const z=slot==='row'?destRow():destCount(),g=E('g',{'data-placed':slot,tabindex:0,role:'button','aria-label':'Placed '+slot+'. Press Delete to remove.'},svg);
 if(slot==='row')drawDotRow(g,z.x,z.y+z.h/2,z.w,v,'result');else box(g,z.x,z.y,z.w,z.h,String(v),'result',small()?25:27);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(slot);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[bin()],onDrop:()=>false,onRemove:()=>remove(slot),removeTo:{x:W()/2,y:bin().y+20}});fastBridge(g);
}
function slot(svg,kind){const z=kind==='row'?destRow():destCount(),v=kind==='row'?placedRow:placedCount;
 if(v!=null){placed(svg,kind,v);return;}
 if(kind==='count')box(svg,z.x,z.y,z.w,z.h,'TOTAL = ?','unknown',small()?22:25);
 else {N.neonPath(svg,'M'+z.x+','+(z.y+z.h/2)+' L'+(z.x+z.w)+','+(z.y+z.h/2),{role:'unknown',dash:'6 10',width:3});}
 const hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':kind,tabindex:0,role:'button','aria-label':'Place chosen '+kind+' here'},svg);
 const go=()=>{if(kbChoice&&kbChoice.slot===kind)place(kind,kbChoice.value);else status('Choose a '+kind+' card first.');};
 hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});hit.addEventListener('click',go);
}
function drawChallenge(){if(!stageRef)return;const t=task(),w=W();clear(stageRef);const svg=root('Complete the missing row of triangular dots and choose its total count.',true);
 txt(svg,w/2,48,'BUILD TRIANGLE '+t.n,small()?25:30,'support');
 txt(svg,w/2,86,'Use one more dot than the row before',small()?17:20,'support');
 const d=spacing(t.n,true);
 triangle(svg,t.n,w/2,185,d,{rows:t.n-1});
 txt(svg,w/2,485,'MISSING ROW · DRAG DOTS INTO PLACE',small()?16:21,'support');
 slot(svg,'row');
 txt(svg,w/2,543,'HOW MANY DOTS ALTOGETHER?',small()?17:21,'support');slot(svg,'count');
 txt(svg,small()?29:122,696,'CHOOSE THE NEW ROW',small()?18:19,'support','start');
 const x0=small()?29:122,cardW=small()?116:145,gap=small()?12:24;
 t.choices.forEach((v,i)=>{if(placedRow===v)return;source(svg,'row',v,x0+i*(cardW+gap),710,cardW,62);});
 txt(svg,small()?29:122,803,'CHOOSE THE TOTAL DOTS',small()?18:19,'support','start');
 t.counts.forEach((v,i)=>{if(placedCount===v)return;source(svg,'count',v,x0+i*(cardW+gap),819,cardW,62);});
 const b=bin();box(svg,b.x,b.y,b.w,b.h,'RED REMOVE TRAY','error',small()?17:20);
 mount(stageRef,svg,[card('STAGE',t.n,true),card('DOTS SO FAR',t.prev),note('WHAT TO DISCOVER','Add a complete new row, then count all rows. The number of dots must match your growing triangle.'),note('KEYBOARD','Enter on a row or total card, then Enter on its gap. Delete on a placed card removes it.')],challengeIndex===2?'think':'point-down','One new row grows the whole triangle. Count all the dots.');
}
const def={id,title:'Triangular numbers dot arrays',config:C,
 alt:'Triangular numbers grow in rows of 1, 2, 3, and so on. Doubling the dots forms a rectangle n rows by n plus one columns, so T(n)=n(n+1)/2.',
 staticAlt:'Triangular numbers: 1, 3, 6, 10, 15, 21, 28; at position n, T(n)=n(n+1)/2.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){renderLearning(i,stage);},
 exploreIntro:'Compare a triangular dot pattern with its doubled-rectangle proof. Move the stage slider to test the rule.',
 explore(panel,stage){currentView='triangle';position=4;presetKey='Y7-036-sequence-structure';
  const info=H('p',{class:'f908-instruction',text:'Change the stage, then flip between one triangle and the doubled rectangle to explain the formula.'}),presets=H('div',{class:'f908-choices'}),views=H('div',{class:'f908-choices'});
  Object.entries(C.presets).forEach(([key,p])=>presets.appendChild(btn(p.label,()=>{presetKey=key;currentView=p.mode;position=p.stage;range.value=String(position);out.textContent='Stage '+position;ev('preset',key);renderExplore(stage);},'nova-btn ghost')));
  [['triangle','One triangle'],['rectangle','Double into rectangle']].forEach(([k,v])=>views.appendChild(btn(v,()=>{currentView=k;ev('view',k);renderExplore(stage);},'nova-btn ghost')));
  const range=H('input',{type:'range',min:1,max:8,value:4,'aria-label':'Triangular pattern stage'}),out=H('output',{class:'f908-micro',text:'Stage 4'});
  range.addEventListener('input',()=>{position=+range.value;out.textContent='Stage '+position;ev('position',position);ev('count',T(position));renderExplore(stage);});
  panel.append(info,presets,views,H('div',{class:'f908-control'},[H('label',{},['Stage ',range]),out,btn('Next stage',()=>{position=position>=8?1:position+1;range.value=String(position);out.textContent='Stage '+position;renderExplore(stage);},'nova-btn primary')]));renderExplore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placedRow=null;placedCount=null;kbChoice=null;stageRef=stage;apiRef=api;
  const heading=H('h3',{class:'f908-taskhead'}),guide=H('p',{class:'f908-instruction'}),controls=H('div',{class:'f908-control'}),statusEl=H('p',{class:'f908-status',role:'status'});statusRef=statusEl;
  function load(){const t=task();heading.textContent=t.heading;guide.textContent=t.guide;controls.replaceChildren();statusEl.textContent='Drag a dot row, then drag the number of dots. You can also use Enter.';api.fb.textContent='';api.fb.className='nova-fb';
   controls.append(btn('Check triangle',()=>{
    if(placedRow!==t.n||placedCount!==T(t.n)){api.check(false,'Place both the correct new row and the correct total before checking.',{task:challengeIndex});return;}
    api.check(true,'Exactly: '+t.prev+' dots plus '+t.n+' new dots makes '+T(t.n)+'.',{task:challengeIndex,score:challengeIndex+1});ev('count',T(t.n));
    if(challengeIndex===2){heading.textContent='Three growing triangles completed';guide.textContent='You built each new row and counted triangular totals correctly.';controls.replaceChildren(H('p',{class:'f908-maths f908-maths--gold',text:'3 / 3 · Triangles proved'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
    controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placedRow=null;placedCount=null;kbChoice=null;load();},'nova-btn primary'));
   },'nova-btn primary'),btn('Reset cards',()=>{placedRow=null;placedCount=null;kbChoice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('Count the existing dots, then add the new row of '+t.n+'. The triangle total is NOT '+t.n+' squared.'),'nova-btn ghost'));
   ev('challengeTask',{index:challengeIndex});drawChallenge();
  }
  panel.append(heading,guide,controls,statusEl);load();
 },
 onRestore(){currentView='triangle';position=4;presetKey='Y7-036-sequence-structure';challengeIndex=0;placedRow=null;placedCount=null;kbChoice=null;stageRef=null;apiRef=null;statusRef=null;}
};
N.registry.add({id,title:'Triangular numbers dot arrays',topics:['sequences','triangular numbers','dot patterns','figurate numbers','visual proof'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F0-13']});
N.bankMount({id,num:'08',title:'Triangular numbers dot arrays · Premium Edition',def,linked:['F9-07','F9-09','F9-05','F9-12'],years:'KS3 Years 7–9 sequence structures and GCSE visual-proof extension',spec:{
 purpose:'Build triangular numbers as growing rows, prove the doubled rectangle is n×(n+1), and derive n(n+1)/2.',
 params:'Position 1–8; T(n)=n(n+1)/2; row additions +1,+2,...,+n; complementary duplicate triangles in n by n+1 rectangular grid.',
 presets:'Y7-036 Sequence rules and structure; KS3 triangular-number visual-proof exploration (no unverified lesson ID).',
 steps:'Three rows → fourth row → fifth row → flip duplicate → divide rectangle by two → generalise.',
 interactions:'Watch, Guided, Explore stage slider + shape/rectangle views, Challenge three row and count drags with remove/re-grab/keyboard.',
 traps:'Confusing triangular and square numbers; counting one new row short; forgetting to halve the doubled rectangle.',
 gcse:'Visual proof and algebraic expression n(n+1)/2 with index substitution. Linked to F9-07 and F9-09.'
}});
window.F908_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const heading=component.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
