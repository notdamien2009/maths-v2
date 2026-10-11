/* F8-02 INVERSE-OPERATIONS FLOWCHART — PRESENTATION PRESET of F8-03.
   This module is inserted INSIDE the existing F8-03 engine closure, before bankMount.
   Shares F8-03 operations, numeric evaluation, event contract, helpers, registry and F0 core.
   Does NOT register another engine or mutate the F8-03 source on disk. */
const F802_PRESETS={
 'Y7-033':{id:'Y7-033',title:'Solve two-step equations',forward:['m2','a3'],inverse:['s3','d2'],out:15,x:6,challengeOut:19,challengeX:8,
   details:['The machine makes twice x, then adds three.','We know the output. Start here and travel backwards.','Undo the LAST operation first: subtract three.','Undo multiplication by two: divide by two.','Prove it: six multiplied by two, then plus three, gives fifteen.'],
   short:['Read the forward route.','Start at the output!','Undo plus three!','Now divide by two!','Both routes agree!'],
   challengeText:'To reverse twice x plus three, subtract three first, then divide by two.'},
 'Y8-016':{id:'Y8-016',title:'Rearrange formulae',forward:['m5','s4'],inverse:['a4','d5'],out:21,x:5,challengeOut:31,challengeX:7,
   details:['The rule multiplies x by five, then subtracts four.','We can undo the rule from a known value of y.','Undo subtract four by adding four.','Undo multiply by five by dividing by five.','Prove it: five multiplied by five, then subtract four, gives twenty-one.'],
   short:['Spot the two steps.','Travel backwards!','Add four to undo!','Then divide by five!','Check the forward way!'],
   challengeText:'Undo subtraction before multiplication: add four, then divide by five.'}
};
const F802_IDS=Object.keys(F802_PRESETS);
let F802_ACTIVE={preset:'Y7-033',mode:'guided',step:0,slots:[null,null],output:15,solved:false};
const F802_MATH={
 inverseType:(type)=>({add:'sub',sub:'add',mul:'div',div:'mul'})[type],
 inverseOf:(key)=>{const o=operations[key];return Object.keys(operations).find(k=>operations[k].type===F802_MATH.inverseType(o.type)&&operations[k].n===o.n)||null;},
 inverseKeys:(keys)=>keys.slice().reverse().map(F802_MATH.inverseOf),
 forward:(cfg,x)=>calc(x,cfg.forward),
 backwards:(cfg,y,keys=cfg.inverse)=>calc(y,keys),
 verify:(cfg,y,keys,x)=>Array.isArray(keys)&&keys.length===2&&keys.every((k,i)=>k===cfg.inverse[i])&&Number.isFinite(x)&&F802_MATH.backwards(cfg,y,keys)===x&&F802_MATH.forward(cfg,x)===y
};
function f802Coords(){return innerWidth<=760?{
 w:440,h:1050,m:true,titleY:52,forwardY:256,reverseY:628,boxes:[{x:18,y:256,w:105,h:83},{x:167,y:256,w:105,h:83},{x:316,y:256,w:105,h:83}],
 rboxes:[{x:18,y:628,w:105,h:83},{x:167,y:628,w:105,h:83},{x:316,y:628,w:105,h:83}],
 forwardOps:[{x:106,y:182,w:86,h:60},{x:254,y:182,w:86,h:60}],
 slots:[{x:252,y:531,w:106,h:61},{x:82,y:531,w:106,h:61}],
 tray:[{x:15,y:808,w:91,h:58},{x:122,y:808,w:91,h:58},{x:229,y:808,w:91,h:58},{x:336,y:808,w:91,h:58}],
 remove:{x:48,y:941,w:344,h:50},midY:445,reasonY:1019
 }:{w:1110,h:730,m:false,titleY:46,forwardY:174,reverseY:416,
 boxes:[{x:62,y:174,w:183,h:112},{x:465,y:174,w:183,h:112},{x:864,y:174,w:183,h:112}],
 rboxes:[{x:62,y:416,w:183,h:112},{x:465,y:416,w:183,h:112},{x:864,y:416,w:183,h:112}],
 forwardOps:[{x:290,y:174,w:130,h:70},{x:691,y:174,w:130,h:70}],
 slots:[{x:686,y:431,w:137,h:77},{x:287,y:431,w:137,h:77}],
 tray:[{x:198,y:606,w:129,h:62},{x:345,y:606,w:129,h:62},{x:492,y:606,w:129,h:62},{x:639,y:606,w:129,h:62}],
 remove:{x:845,y:606,w:191,h:62},midY:352,reasonY:704
 };
}
function f802Txt(svg,x,y,value,role='given',sz=23){return tx(svg,x,y,value,role,sz);}
function f802Box(svg,r,role='given'){return box(svg,r.x,r.y,r.w,r.h,role,Math.min(20,r.h*.21));}
function f802Arrow(svg,x1,y1,x2,y2,role='op'){const a=N.svg.arrow(svg,x1,y1,x2,y2,{role,width:3.6});a.style.pointerEvents='none';return a;}
function f802Node(svg,r,title,value,role,show=true,m=false){
 f802Box(svg,r,role);f802Txt(svg,r.x+r.w/2,r.y+29,title,'support',m?20:20);
 f802Txt(svg,r.x+r.w/2,r.y+r.h-20,show?String(value):'?',show?role:'unknown',m?31:42);
}
function f802Paint(state){
 const cfg=F802_PRESETS[state.preset||F802_ACTIVE.preset],V=f802Coords(),mode=state.mode||'guided',step=state.step??4;
 /* All four modes keep the same stage size: the lower teaching-work cards prevent empty bands. */
 const interactive=mode==='explore'||mode==='challenge',challenge=mode==='challenge',out=Number(state.output??cfg.out),slots=state.slots||[null,null];
 const reveal=challenge?!!state.solved:true;
 const actualMid=interactive?(slots[0]?apply(slots[0],out):null):step>=2?apply(cfg.inverse[0],out):null;
 const actualX=interactive?(slots[0]&&slots[1]?calc(out,slots):null):step>=3?F802_MATH.backwards(cfg,out):null;
 const hasProof=challenge?!!state.solved:mode==='explore'?(slots.every(Boolean)&&F802_MATH.forward(cfg,F802_MATH.backwards(cfg,out,slots))===out):step>=4;
 const forwardX=hasProof?F802_MATH.backwards(cfg,out):null;
 const forwardMid=forwardX===null?null:apply(cfg.forward[0],forwardX);
 const stage=state.stage;stage.innerHTML='';stage.classList.add('f802-stage');
 N.cap(stage,'INVERSE OPERATIONS · TWO-WAY ROUTE',challenge?'FIND THE ORIGINAL INPUT':mode==='explore'?'CHANGE THE RULE PATH':'FORWARD THEN BACK AGAIN');
 const svg=N.svg.root(V.w,V.h,'Two-row flowchart: upper route runs forwards from x to y; lower route runs backwards from y through inverse operation cards to recover x.');
 svg.classList.add('f802-svg');svg.dataset.preset=cfg.id;svg.dataset.mode=mode;svg.dataset.step=String(step);
 f802Txt(svg,V.w/2,V.titleY,cfg.id==='Y7-033'?('2x + 3 = '+out):'y = 5x − 4','given',V.m?28:36);
 f802Txt(svg,V.m?220:556,V.m?126:108,'FORWARD  ·  INPUT → OUTPUT','support',V.m?21:25);
 // Forward route: x → first gear → intermediate → second gear → y, no duplicated arithmetic code.
 const f=V.boxes,yf=f[0].y+f[0].h/2;
 f802Arrow(svg,f[0].x+f[0].w+5,yf,f[1].x-8,yf,'focus');f802Arrow(svg,f[1].x+f[1].w+5,yf,f[2].x-8,yf,'op');
 f802Node(svg,f[0],'INPUT x',forwardX??'?',forwardX!==null?'given':'unknown',forwardX!==null,V.m);
 f802Node(svg,f[1],V.m?'STEP 1':'AFTER STEP 1',forwardMid??'?',forwardMid!==null?'focus':'unknown',forwardMid!==null,V.m);
 f802Node(svg,f[2],'OUTPUT y',out,'result',true,V.m);
 cfg.forward.forEach((key,i)=>{const r=V.forwardOps[i];f802Box(svg,r,i?'op':'focus');f802Txt(svg,r.x+r.w/2,r.y+r.h*.71,operations[key].label,'given',V.m?25:30);});
 f802Txt(svg,V.w/2,V.midY,V.m?'INVERSE · BACK TO x':'INVERSE · WORK FROM THE OUTPUT BACK TO x','support',V.m?21:24);
 // Reverse direction is right-to-left and operations are in reverse *order*.
 const b=V.rboxes,yr=b[0].y+b[0].h/2;
 f802Arrow(svg,b[2].x-7,yr,b[1].x+b[1].w+7,yr,'focus');f802Arrow(svg,b[1].x-7,yr,b[0].x+b[0].w+7,yr,'op');
 f802Node(svg,b[2],'KNOWN y',out,'result',true,V.m);
 f802Node(svg,b[1],V.m?'AFTER 1':'AFTER FIRST',actualMid,'focus',actualMid!==null&&reveal,V.m);
 f802Node(svg,b[0],'RECOVER x',actualX,'result',actualX!==null&&reveal,V.m);
 const interactiveSlots=[];
 for(let i=0;i<2;i++){
  const r=V.slots[i];interactiveSlots.push(r);
  const value=interactive?slots[i]:(step>=i+2?cfg.inverse[i]:null);
  f802Box(svg,r,value?'result':'op');
  f802Txt(svg,r.x+r.w/2,r.y+20,'UNDO '+(i+1),'support',V.m?20:19);
  f802Txt(svg,r.x+r.w/2,r.y+r.h-13,value?operations[value].label:(V.m?'PLACE':'PLACE CARD'),value?'result':'unknown',value?(V.m?25:27):(V.m?22:21));
  if(interactive&&value){const g=E('g',{'data-inverse-slot':String(i),'data-operation':value,'data-placed':'slot'},svg);
   f802Box(g,r,'result');f802Txt(g,r.x+r.w/2,r.y+r.h*.7,operations[value].label,'result',V.m?25:32);
   svgButton(g,'Undo step '+(i+1)+' '+operations[value].name+'. Press Delete or Enter to return.',()=>state.remove&&state.remove(i));
   g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();state.remove&&state.remove(i);}});
   N.ui.svgDrag(svg,g,{box:r,zones:()=>[{id:'remove',kind:'remove',...V.remove}],onRemove:()=>state.remove&&state.remove(i)});repairCapture(g);
  }
 }
 // Contextual evidence at the bottom of the stage, inside maths rather than generic filler.
 if(!interactive){
  const statement=step===0?'READ THE ORIGINAL OPERATION ORDER':step===1?'START WITH THE KNOWN OUTPUT':step===2?'LAST FORWARD STEP = FIRST STEP TO UNDO':step===3?'THE ORIGINAL INPUT HAS BEEN RECOVERED':'CHECK FORWARDS TO PROVE YOUR ANSWER';
  f802Txt(svg,V.w/2,V.m?759:575,(V.m?(['READ THE FORWARD OPERATIONS','START AT THE OUTPUT','UNDO THE LAST OPERATION','RECOVER THE INPUT','CHECK BY GOING FORWARDS'][Math.min(4,step)]):statement),'support',V.m?20:23);
  // Three genuine working/evidence cards fill the same footprint as Explore's operation tray.
  // In Guided, values are revealed only after the corresponding mathematical step.
  const first=apply(cfg.inverse[0],out),answer=apply(cfg.inverse[1],first);
  const firstLine=out+' '+operations[cfg.inverse[0]].label+' = '+first;
  const secondLine=first+' '+operations[cfg.inverse[1]].label+' = '+answer;
  const proofLine=answer+' '+operations[cfg.forward[0]].label+' '+operations[cfg.forward[1]].label+' = '+out;
  const evidence=[step>=2?firstLine:(step===0?'KNOWN OUTPUT · y = '+out:'START AT y = '+out),
                  step>=3?secondLine:(step>=2?'NEXT · UNDO '+operations[cfg.forward[0]].label:'HOW DO WE GET BACK?'),
                  step>=4?proofLine:step>=3?'CHECK WITH THE FORWARD RULE':'INPUT x IS STILL UNKNOWN'];
  for(let ei=0;ei<3;ei++){
   const r=V.m?{x:43,y:802+ei*69,w:354,h:60}:{x:73+ei*330,y:625,w:297,h:70};
   f802Box(svg,r,ei===2&&step>=4?'result':ei===1?'op':'focus');
   f802Txt(svg,r.x+r.w/2,r.y+r.h*.67,evidence[ei],ei===2&&step>=4?'result':'given',V.m?22:23);
  }

 }
 if(interactive){
  const pool=cfg.id==='Y7-033'?['s3','d2','a3','m2']:['a4','d5','s4','m5'];
  for(let i=0;i<pool.length;i++){
   const key=pool[i],r=V.tray[i],g=E('g',{'data-inverse-card':key,'data-placed':'tray'},svg);
   f802Box(g,r,i<2?'focus':'given');f802Txt(g,r.x+r.w/2,r.y+r.h*.7,operations[key].label,'given',V.m?27:32);
   const place=()=>state.place&&state.place(key,(slots[0]===null?0:slots[1]===null?1:0));
   svgButton(g,'Operation '+operations[key].name+'. Press Enter to place in next empty inverse step.',place);
   N.ui.svgDrag(svg,g,{box:r,zones:()=>[...interactiveSlots.map((s,j)=>({id:String(j),kind:'drop',...s})),{id:'remove',kind:'remove',...V.remove}],onDrop:id=>{state.place&&state.place(key,Number(id));return true;},onRemove:()=>{}});repairCapture(g);
  }
  f802Txt(svg,V.w/2,V.m?790:594,V.m?'DRAG INVERSE CARDS INTO SLOTS':'DRAG THE INVERSE OPERATIONS TO THE TWO UNDO STEPS','support',V.m?21:21);
  f802Box(svg,V.remove,'focus');f802Txt(svg,V.remove.x+V.remove.w/2,V.remove.y+V.remove.h*.65,'RETURN / CLEAR','focus',V.m?19:21);
  f802Txt(svg,V.w/2,V.reasonY,challenge?'PROVE BOTH STEPS · ENTER x':(V.m?'FOLLOW THE NUMBERS':'TRY THE RULES · FOLLOW THE NUMBERS'),'support',V.m?20:19);
 }
 stage.appendChild(svg);
 const speech=state.solved?'You found the input!':challenge?'Undo the last step first!':mode==='explore'?(actualX===null?'Choose two undo steps!':'Check by going forwards!'):cfg.short[Math.min(4,step)];
 N.scene.helperStrip(stage,state.solved?'celebrate':challenge?'think':mode==='explore'?'point-left':['explain','think','point-left','point-right','celebrate'][Math.min(4,step)],speech);
 const note=H('div',{class:'f802-proof'});note.appendChild(H('strong',{text:challenge?'Prove the original input':mode==='explore'?'Follow the chosen operations':'Mathematical evidence'}));
 const info=mode==='challenge'?'The answer is hidden until both inverse cards and the recovered input are checked.':mode==='explore'?'Each selected inverse card acts on the number to its right. Change the order and see what happens.':cfg.details[Math.min(4,step)];
 note.appendChild(H('span',{text:info}));stage.appendChild(note);
 if(challenge&&N.helperImg){const img=N.helperImg(state.solved?'celebrate':'think','teen'),peer=H('div',{class:'f802-peer'});peer.appendChild(H('span',{text:state.solved?'Izaac · Nice proof!':'Izaac · Show your steps.'}));peer.appendChild(H('img',{src:img.src,alt:img.alt,width:64,height:64}));stage.appendChild(peer);}
 if(!interactive&&step>1&&!N.reducedMotion()){const mark=V.slots[Math.min(1,step-2)];N.motion.flash(svg,mark.x+mark.w/2,mark.y+mark.h/2,'focus',30);}
 return svg;
}
function f802Spec(){return {purpose:'Use a forward chain and a reverse chain to show why inverse operations solve two-step equations and rearrange formulae.',params:'Two ordered forward operations, their mathematically reversed counterparts, known output, unknown input.',presets:'Y7-033 linear equations and Y8-016 rearranging formulae, sharing F8-03 lesson data.',steps:'Read forward rule → locate known output → undo final operation → undo first operation → prove by forward substitution.',interactions:'Drag inverse operation cards into the reversed chain. Return placed cards to tray; keyboard Enter/Del, number-field input, immediate Explore recalculation.',traps:'Applying forward rules backwards, reversing operation signs incorrectly, reversing direction but not order, solving using only one inverse step.',gcse:'Forward/reverse function chains generalise to GCSE rearranging, multi-stage inverse mappings and composition.'};}
const F802_STEPS=[
 {name:'Read the forward machine',prompt:'What is the final forward operation?',narration:'Look at the forward machine first. We are multiplying, then adding or subtracting.'},
 {name:'Start at the known output',prompt:'Where does the reverse journey begin?',narration:'The output is known. To find the input, begin from the right-hand end.'},
 {name:'Undo the last operation',prompt:'Which inverse operation belongs first?',narration:'Undo the last forward operation first, not the first. That is the key to solving backwards.'},
 {name:'Undo the first operation',prompt:'How do you recover x?',narration:'Now undo the original first operation. You have recovered x.'},
 {name:'Verify using the forward rule',prompt:'Does the recovered input reproduce the output?',narration:'Check by running your answer forwards through both operations.'}
];
const F802_DEF={
 title:'Inverse-operations flowchart',config:{startMode:'guided',preset:'Y7-033'},
 steps:F802_STEPS.map((o,i)=>Object.defineProperty({...o},'narration',{get:()=>F802_PRESETS[F802_ACTIVE.preset].details[i],enumerable:true})),
 staticAlt:'Forward: input x, two sequential operations, output y. Reverse: from y apply the inverse of the last operation, then the inverse of the first, to recover x.',
 render(i,stage){F802_ACTIVE.step=i;F802_ACTIVE.mode='guided';f802Paint({stage,step:i,preset:F802_ACTIVE.preset,output:F802_PRESETS[F802_ACTIVE.preset].out});},
 exploreIntro:'Try the reverse route: undo the last operation first.',
 explore(panel,stage,api){F802_ACTIVE.mode='explore';let preset=F802_ACTIVE.preset,out=F802_PRESETS[preset].out,slots=[null,null];
  const controls=H('div',{class:'f802-controls'}),picker=H('select',{class:'f802-select','aria-label':'Choose inverse-operations lesson'}),value=H('input',{class:'f802-number',type:'number',inputmode:'decimal','aria-label':'Known output y',value:String(out)}),reset=H('button',{class:'nova-btn',text:'Reset inverse route'}),status=H('div',{class:'f802-feedback','aria-live':'polite'});
  for(const id of F802_IDS)picker.appendChild(H('option',{value:id,text:F802_PRESETS[id].title}));picker.value=preset;
  function draw(msg){const cfg=F802_PRESETS[preset];f802Paint({stage,preset,mode:'explore',output:out,slots,place:(key,i)=>{slots[i]=key;emit('rule',{slot:i,operation:key,preset:'F8-02'});draw('Operation placed.');},remove:i=>{slots[i]=null;emit('remove',{slot:i,preset:'F8-02'});draw('Operation returned.');}});
   const x=slots.every(Boolean)?F802_MATH.backwards(cfg,out,slots):null,valid=x!==null&&F802_MATH.forward(cfg,x)===out;
   status.dataset.status=x===null?'':valid?'correct':'warning';status.textContent=(msg?msg+' ':'')+(x===null?'Place an inverse card in each undo step.':valid?'Recovered input: '+x+'. The forward check agrees.':'Check the arithmetic and try a different inverse sequence.');}
  picker.onchange=()=>{preset=picker.value;F802_ACTIVE.preset=preset;out=F802_PRESETS[preset].out;value.value=out;slots=[null,null];emit('preset',preset);draw('Lesson changed.');};
  value.onchange=()=>{const n=Number(value.value);if(value.value.trim()!==''&&Number.isFinite(n)&&Math.abs(n)<=100000){out=n;emit('input',out);draw('Known output changed.');}else{value.value=String(out);status.textContent='Choose a finite output with absolute value at most one hundred thousand.';}};
  reset.onclick=()=>{slots=[null,null];out=F802_PRESETS[preset].out;value.value=out;emit('reset',true);draw('Route reset.');};
  controls.appendChild(H('label',{text:'Lesson'}));controls.appendChild(picker);controls.appendChild(H('label',{text:'Known output y'}));controls.appendChild(value);controls.appendChild(reset);panel.appendChild(controls);panel.appendChild(status);draw();
 },
 challenge(panel,api,stage){F802_ACTIVE.mode='challenge';let task=0,slots=[null,null],solved=false,wrong=0;
  const heading=H('div',{class:'f802-heading'}),ctrl=H('div',{class:'f802-controls'}),answer=H('input',{class:'f802-number',type:'number',inputmode:'decimal','aria-label':'Recovered original input x',placeholder:'Your x'}),check=H('button',{class:'nova-btn primary',text:'Check inverse steps'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next reverse challenge'}),status=H('div',{class:'f802-feedback','aria-live':'polite'});
  function draw(msg,ok=false){const cfg=F802_PRESETS[F802_IDS[task]];F802_ACTIVE.preset=cfg.id;f802Paint({stage,preset:cfg.id,mode:'challenge',output:cfg.challengeOut,slots,solved,place:(key,i)=>{if(solved)return;slots[i]=key;emit('rule',{slot:i,operation:key,preset:'F8-02'});draw('Inverse operation placed.');},remove:i=>{if(solved)return;slots[i]=null;emit('remove',{slot:i,preset:'F8-02'});draw('Inverse operation returned.');}});
   heading.textContent='Challenge '+(task+1)+' of '+F802_IDS.length+' · '+cfg.title+' · y = '+cfg.challengeOut;
   check.disabled=solved;next.hidden=!solved||task===F802_IDS.length-1;next.style.display=next.hidden?'none':'';status.dataset.status=ok?'correct':msg?'warning':'';
   status.textContent=msg||'Put the inverse cards in reverse order, then enter the recovered x.';}
  check.onclick=()=>{if(solved)return;const cfg=F802_PRESETS[F802_IDS[task]];
   if(slots.some(v=>v===null)){status.textContent='Complete both undo steps before checking.';status.dataset.status='wrong';return;}
   const wrongStep=slots.findIndex((k,i)=>k!==cfg.inverse[i]);if(wrongStep!==-1){wrong++;status.textContent=(wrongStep===0?'Undo the last forward operation first. ':'The second reverse step undoes the first forward operation. ')+cfg.challengeText;status.dataset.status='wrong';api.check(false,status.textContent,{reason:'inverse-step',step:wrongStep,preset:'F8-02'});return;}
   const n=Number(answer.value);if(answer.value.trim()===''||!Number.isFinite(n)||!F802_MATH.verify(cfg,cfg.challengeOut,slots,n)){wrong++;status.textContent='Both inverse rules are right. Work through the numbers and verify the result forwards.';status.dataset.status='wrong';api.check(false,status.textContent,{reason:'value',preset:'F8-02'});return;}
   solved=true;emit('output',n);api.check(true,'Correct! Both inverse steps recover x and the forward rule confirms it.',{preset:'F8-02',task:task,value:n});draw('Both directions check. The original input is '+n+'.',true);
  };
  hint.onclick=()=>api.hint(F802_PRESETS[F802_IDS[task]].challengeText);
  next.onclick=()=>{if(!solved||task>=F802_IDS.length-1)return;task++;slots=[null,null];solved=false;answer.value='';draw();};
  ctrl.appendChild(answer);ctrl.appendChild(check);ctrl.appendChild(hint);ctrl.appendChild(next);panel.appendChild(heading);panel.appendChild(ctrl);panel.appendChild(status);draw();
 }
};
Object.assign(DEF,{title:F802_DEF.title,config:F802_DEF.config,steps:F802_DEF.steps,staticAlt:F802_DEF.staticAlt,render:F802_DEF.render,exploreIntro:F802_DEF.exploreIntro,explore:F802_DEF.explore,challenge:F802_DEF.challenge});
window.F802_TEST={presets:F802_PRESETS,math:F802_MATH,operations,selectPreset:id=>{if(F802_PRESETS[id]){F802_ACTIVE.preset=id;const e=window.F803_ENGINE;e&&e.setMode('guided');}},state:()=>({...F802_ACTIVE})};
window.F802_SPEC=f802Spec();
/* END F8-02 PRESET */
