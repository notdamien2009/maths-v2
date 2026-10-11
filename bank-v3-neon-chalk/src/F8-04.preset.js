/* F8-04 TWO-WAY FUNCTION MACHINE — ADDITIVE PRESENTATION PRESET OF F8-03.
   Injected inside canonical F8-03 IIFE; shares operations/apply/calc, source config,
   core drawing/drag/narration, and F8-03 engine registration. No independent engine. */
const F804_PRESETS={
 'Y8-016':{id:'Y8-016',title:'Rearrange y = 5x − 4',algebra:'y = 5x − 4',input:5,
  forward:['m5','s4'],inverse:['a4','d5'],pool:['m5','s4','a4','d5','m4','a5','s3','d2'],challengeInput:7,
  explanation:['A two-way function must preserve the original input when it travels back.','Multiply x by five to enter the first machine.','Subtract four from that result to obtain y.','To reverse the route, undo the LAST forward step first: add four.','Then undo multiplication by five: divide by five.','Our return value equals the original x. Both machines agree.'],
  tips:['Spot the two machines.','Multiply by five first!','Then subtract four!','Undo subtract four!','Divide by five!','Back to the beginning!'],
  incorrect:'Undo subtraction before multiplication. Add four, then divide by five. A different order will not cancel the forward steps.'},
 'Y8-016-b':{id:'Y8-016-b',title:'Solve y = 2x + 3',algebra:'y = 2x + 3',input:6,
  forward:['m2','a3'],inverse:['s3','d2'],pool:['m2','a3','s3','d2','a2','m3','s4','d5'],challengeInput:8,
  explanation:['The two forward operations make a composite rule.','Double the input first.','Add three second, to find the output.','Reverse by subtracting three, undoing the final operation.','Divide by two last, undoing the first forward operation.','The recovered input matches the one we supplied.'],
  tips:['Follow the arrows.','Double the input!','Add three!','Subtract three!','Divide by two!','The input returns!'],
  incorrect:'The inverse has to start with minus three, then divide by two. Dividing before subtracting changes the result.'},
 'Y8-016-c':{id:'Y8-016-c',title:'Solve y = 5(x + 4)',algebra:'y = 5(x + 4)',input:2,
  forward:['a4','m5'],inverse:['d5','s4'],pool:['a4','m5','d5','s4','m4','a5','s3','d2'],challengeInput:3,
  explanation:['Brackets mean add four BEFORE you multiply by five.','Add four to the input. The bracket is evaluated first.','Multiply the new quantity by five. This gives y.','Reverse the final multiplication by dividing by five.','Then subtract four to undo the original bracket operation.','The recovered input proves that the two routes are inverses.'],
  tips:['Read the brackets!','Add four first!','Now multiply!','Divide by five!','Then subtract four!','Both paths agree!'],
  incorrect:'Brackets change the operation order. Forward is add four THEN multiply five; reverse is divide five THEN subtract four.'}
};
const F804_IDS=Object.keys(F804_PRESETS);
const F804_STATE={preset:'Y8-016',mode:'guided',step:0,slots:[null,null,null,null],input:5,solved:false};
const F804_MATH={
 chain:(x,seq)=>calc(x,seq),
 inverseOf:key=>{const op=operations[key];if(!op)return null;const type={add:'sub',sub:'add',mul:'div',div:'mul'}[op.type];return Object.keys(operations).find(k=>operations[k].type===type&&operations[k].n===op.n)||null;},
 inverseSequence:seq=>seq.slice().reverse().map(k=>F804_MATH.inverseOf(k)),
 solve:(cfg,x)=>({middle:apply(cfg.forward[0],x),output:calc(x,cfg.forward),undoMiddle:apply(cfg.inverse[0],calc(x,cfg.forward)),recovered:calc(calc(x,cfg.forward),cfg.inverse)}),
 validate:(cfg,x,slots,output,recovered)=>Number.isFinite(x)&&Array.isArray(slots)&&slots.length===4&&slots.every((k,i)=>k===[...cfg.forward,...cfg.inverse][i])&&F804_MATH.inverseSequence(slots.slice(0,2)).every((k,i)=>k===slots[2+i])&&Number.isFinite(output)&&Number.isFinite(recovered)&&output===calc(x,slots.slice(0,2))&&recovered===calc(output,slots.slice(2))&&recovered===x
};
function f804Emit(key,val){emit(key,{preset:'F8-04',value:val});}
function f804Coords(){return innerWidth<=760?{
 w:440,h:1140,m:true,top:46,header:83,input:{x:125,y:110,w:190,h:66},forward:[{x:66,y:201,w:308,h:89},{x:66,y:321,w:308,h:89}],out:{x:125,y:443,w:190,h:65},reverse:[{x:66,y:588,w:308,h:90},{x:66,y:714,w:308,h:90}],restored:{x:125,y:832,w:190,h:64},rowLabel:558,ruleTop:926,cardW:87,cardH:52,cols:[23,127,231,335],row2:992,remove:{x:37,y:1057,w:366,h:43},proofY:1130,
 }:{w:1110,h:900,m:false,top:49,header:91,input:{x:31,y:205,w:148,h:100},forward:[{x:240,y:179,w:246,h:153},{x:613,y:179,w:246,h:153}],out:{x:925,y:205,w:151,h:100},reverse:[{x:613,y:432,w:246,h:153},{x:240,y:432,w:246,h:153}],restored:{x:31,y:458,w:148,h:100},rowLabel:653,ruleTop:695,cardW:114,cardH:59,cols:[67,199,331,463],row2:765,remove:{x:713,y:701,w:314,h:67},proofY:850,
 };}
function f804Text(p,x,y,t,role='given',size=26){return tx(p,x,y,t,role,size);}
function f804Box(p,r,role='given'){return N.neonBox(p,r.x,r.y,r.w,r.h,{role,r:17});}
function f804Arrow(p,a,b,role='given'){const o=N.svg.arrow(p,a[0],a[1],b[0],b[1],{role,width:3.6});o.style.pointerEvents='none';return o;}
function f804LabelNode(svg,r,top,bottom,role='given',size=31){f804Box(svg,r,role);const small=r.h<85;f804Text(svg,r.x+r.w/2,r.y+(small?19:28),top,'support',small?17:19);f804Text(svg,r.x+r.w/2,r.y+r.h-(small?9:21),bottom,role,small?Math.min(size,30):size);}
function f804Machine(svg,r,role,headline,opKey,slotIndex,enabled,onRemove){
 f804Box(svg,r,role);
 // The existing F8-03 gear primitive is the actual mathematical machine mechanism.
 const gx=r.x+(r.w<260?78:83),gy=r.y+r.h*.53,rad=r.w<260?43:36;
 gear(svg,gx,gy,rad,role,slotIndex,Boolean(opKey));
 f804Text(svg,r.x+r.w*.72,r.y+28,headline,'support',r.w<260?18:18);
 f804Text(svg,r.x+r.w*.67,r.y+r.h*.65,opKey?operations[opKey].label:'?',opKey?'given':'unknown',r.w<260?37:36);
 f804Text(svg,r.x+r.w*.68,r.y+r.h-14,enabled&&opKey?'SELECTED':enabled?'DROP A RULE':'FOLLOW THE RULE','support',r.w<260?15:16);
 if(enabled&&opKey&&onRemove){const g=E('g',{'data-rule-slot':String(slotIndex),'data-operation':opKey,'data-placed':'slot'},svg);f804Box(g,r,'result');f804Text(g,r.x+r.w*.53,r.y+r.h*.62,operations[opKey].label,'result',38);
 g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label','Machine '+(slotIndex+1)+': '+operations[opKey].name+'. Press Delete, Backspace or Enter to remove.');g.addEventListener('keydown',e=>{if(['Delete','Backspace','Enter',' '].includes(e.key)){e.preventDefault();onRemove(slotIndex);}});
 N.ui.svgDrag(svg,g,{box:{x:r.x,y:r.y,w:r.w,h:r.h},zones:()=>[{id:'remove',kind:'remove',...f804Coords().remove}],onRemove:()=>onRemove(slotIndex)});repairCapture(g);}
}
function f804Paint(o){
 const cfg=F804_PRESETS[o.preset||F804_STATE.preset],V=f804Coords(),mode=o.mode||'guided',step=o.step??5,interact=mode==='challenge'||mode==='explore',challenge=mode==='challenge',solved=!!o.solved;
 const input=Number(o.input??cfg.input),slots=interact?(o.slots||[null,null,null,null]):[...cfg.forward,...cfg.inverse].map((v,i)=>step>=i+1?v:null);
 const values=F804_MATH.solve(cfg,input),fMid=interact?(slots[0]?apply(slots[0],input):null):(step>=1?values.middle:null),output=interact?(slots[0]&&slots[1]?calc(input,slots.slice(0,2)):null):(step>=2?values.output:null),rMid=interact?(output!==null&&slots[2]?apply(slots[2],output):null):(step>=4?values.undoMiddle:null),back=interact?(rMid!==null&&slots[3]?apply(slots[3],rMid):null):(step>=5?values.recovered:null);
 const verified=output!==null&&back!==null&&back===input&&!slots.some((k,i)=>k!==[...cfg.forward,...cfg.inverse][i]);
 const stage=o.stage;stage.innerHTML='';stage.classList.add('f804-stage');N.cap(stage,'TWO-WAY FUNCTION MACHINE',challenge?'PROVE BOTH DIRECTIONS':mode==='explore'?'BUILD THE COMPOSITE AND ITS INVERSE':'TWO MACHINES · ONE RULE');
 const svg=N.svg.root(V.w,V.h,'Two connected function routes. The upper route applies two operations in order. The lower route applies their inverses in reverse order.');svg.classList.add('f804-svg');svg.dataset.mode=mode;svg.dataset.preset=cfg.id;svg.dataset.step=String(step);svg.dataset.verified=String(verified);
 f804Text(svg,V.w/2,V.top,cfg.algebra,'given',V.m?34:40);f804Text(svg,V.w/2,V.header,'FORWARD · TWO OPERATIONS','support',V.m?21:25);
 const isRevealed=v=>v!==null&&!challenge||solved;
 const topNum=String(input);
 f804LabelNode(svg,V.input,'INPUT x',topNum,'given',V.m?34:37);
 const yReveal=output!==null&&(!challenge||solved);f804LabelNode(svg,V.out,'OUTPUT y',yReveal?String(output):'?','result',V.m?34:37);
 if(V.m){
  f804Arrow(svg,[220,178],[220,193],'focus');f804Arrow(svg,[220,291],[220,313],'op');f804Arrow(svg,[220,412],[220,435],'op');
  f804Arrow(svg,[220,511],[220,580],'result');f804Arrow(svg,[220,680],[220,706],'focus');f804Arrow(svg,[220,808],[220,824],'focus');
 }else{
  f804Arrow(svg,[186,255],[231,255],'focus');f804Arrow(svg,[491,255],[603,255],'op');f804Arrow(svg,[864,255],[919,255],'op');
  f804Arrow(svg,[1000,307],[1000,500],'result');f804Arrow(svg,[915,500],[868,500],'focus');f804Arrow(svg,[609,500],[492,500],'op');f804Arrow(svg,[232,500],[187,500],'focus');
 }
 const f=V.forward, rev=V.reverse;
 f804Machine(svg,f[0],'focus','MACHINE 1',slots[0],0,interact,o.onRemove);
 f804Machine(svg,f[1],'op','MACHINE 2',slots[1],1,interact,o.onRemove);
 f804Text(svg,V.m?220:550,V.m?313:375,fMid===null||challenge&&!solved?'?':String(fMid),'support',V.m?20:25);
 f804Text(svg,V.w/2,V.rowLabel,V.m?'REVERSE · UNDO IN REVERSE ORDER':'REVERSE · UNDO MACHINE 2 BEFORE MACHINE 1','support',V.m?20:22);
 f804Machine(svg,rev[0],'result','UNDO MACHINE 2',slots[2],2,interact,o.onRemove);
 f804Machine(svg,rev[1],'focus','UNDO MACHINE 1',slots[3],3,interact,o.onRemove);
 f804LabelNode(svg,V.restored,'RECOVER x',back!==null&&(!challenge||solved)?String(back):'?','result',V.m?34:37);
 if(V.m){f804Text(svg,220,531,'OUTPUT BECOMES INPUT','support',18);}else{f804Text(svg,548,408,'THE OUTPUT RE-ENTERS THE REVERSE MACHINES','support',20);}
 if(interact){
  const pool=cfg.pool;pool.forEach((key,i)=>{const col=i%4,row=Math.floor(i/4),r={x:V.cols[col],y:row?V.row2:V.ruleTop,w:V.cardW,h:V.cardH},g=E('g',{'data-rule-card':key,'data-placed':'tray','data-drag':'1'},svg);
   f804Box(g,r,i<4?'focus':'given');f804Text(g,r.x+r.w/2,r.y+r.h*.69,operations[key].label,'given',V.m?27:32);
   const place=idx=>{if(idx>=0&&idx<4&&o.onPlace)o.onPlace(key,idx);};
   g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',operations[key].name+'. Drag to a machine or press 1 to 4 to place, Enter for next empty machine.');
   g.addEventListener('keydown',e=>{const n=Number(e.key);if(n>=1&&n<=4){e.preventDefault();place(n-1);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();place(slots.indexOf(null)>=0?slots.indexOf(null):0);}});
   const boxes=[f[0],f[1],rev[0],rev[1]];N.ui.svgDrag(svg,g,{box:r,zones:()=>[...boxes.map((b,i)=>({id:String(i),kind:'drop',...b})),{id:'remove',kind:'remove',...V.remove}],onDrop:id=>{place(Number(id));return true;},onRemove:()=>{}});repairCapture(g);
  });
  f804Box(svg,V.remove,'focus');f804Text(svg,V.remove.x+V.remove.w/2,V.remove.y+V.remove.h*.64,'RETURN / CLEAR','focus',V.m?21:22);
  f804Text(svg,V.w/2,V.proofY,challenge?'SELECT BOTH FORWARD AND INVERSE RULES':'DRAG A RULE INTO ANY MACHINE','support',V.m?20:21);
 }else{
  // Same stage footprint as Explore's operation tray, occupied by meaningful evidence in teaching modes.
  const facts=[step>=1?'x = '+input+' → '+operations[cfg.forward[0]].label+' = '+values.middle:'START WITH INPUT x = '+input,
    step>=2?values.middle+' → '+operations[cfg.forward[1]].label+' = '+values.output:'MACHINE 2 USES MACHINE 1 OUTPUT',
    step>=4?values.output+' → '+operations[cfg.inverse[0]].label+' = '+values.undoMiddle:'THE INVERSE BEGINS AT y',
    step>=5?values.undoMiddle+' → '+operations[cfg.inverse[1]].label+' = '+input:'UNDO THE FIRST MACHINE LAST'];
  for(let i=0;i<4;i++){const col=i%2,row=Math.floor(i/2),r=V.m?{x:19+col*208,y:V.ruleTop+row*68,w:195,h:58}:{x:60+col*520,y:V.ruleTop+row*69,w:480,h:60};
   const mobileFacts=[step>=1?'x = '+input+' → '+values.middle:'START AT x = '+input,step>=2?'OUTPUT y = '+values.output:'APPLY MACHINE 2',step>=4?'UNDO y → '+values.undoMiddle:'REVERSE THE ORDER',step>=5?'RETURN x = '+input:'RECOVER INPUT x'];
   f804Box(svg,r,i===3&&step>=5?'result':'given');f804Text(svg,r.x+r.w/2,r.y+r.h*.63,V.m?mobileFacts[i]:facts[i],i===3&&step>=5?'result':'given',V.m?17:21);
  }
  f804Text(svg,V.w/2,V.proofY,step>=5?'FORWARD THEN INVERSE RETURNS x':'FOLLOW THE STEPS · WATCH EACH GEAR','support',V.m?20:23);
 }
 stage.appendChild(svg);
 if(!interact&&step>0&&!N.reducedMotion()&&N.motion&&N.motion.flash){const index=({1:0,2:1,4:2,5:3})[step];if(index!==undefined){const rect=[...V.forward,...V.reverse][index],mx=rect.x+(rect.w<260?78:83),my=rect.y+rect.h*.53;N.motion.flash(svg,mx,my,index<2?'focus':'result',rect.w<260?43:36);}}
 const speech=solved?'You proved both ways!':challenge?'Check both routes!':mode==='explore'?(verified?'Both paths agree!':'Try both directions!'):cfg.tips[Math.min(step,5)];
 N.scene.helperStrip(stage,solved?'celebrate':challenge?'think':mode==='explore'?'compare':['explain','count','point-right','think','point-left','celebrate'][Math.min(5,step)],speech);
 const note=H('div',{class:'f804-proof'});note.appendChild(H('strong',{text:mode==='challenge'?'Two-way challenge':mode==='explore'?'Compare both directions':'What the maths proves'}));note.appendChild(H('span',{text:challenge?'Place four operation cards and calculate y and the returned x. No result is revealed before checking.':mode==='explore'?verified?'The full chain returns the original x.':(output===null?'Complete both forward machines before checking the inverse.':back===null?'Now complete both inverse machines.':'The chosen rules do not return the original x. Try the true inverses.') :cfg.explanation[Math.min(step,5)]}));stage.appendChild(note);
 if(mode==='challenge'&&N.helperImg){const img=N.helperImg(solved?'celebrate':'think','teen'),peer=H('div',{class:'f804-peer','aria-label':'Izaac challenge peer'});
   peer.appendChild(H('span',{text:solved?'Izaac · Both directions agree!':'Izaac · Prove each operation.'}));peer.appendChild(H('img',{src:img.src,alt:img.alt,width:68,height:68}));stage.appendChild(peer);}
 return {input,slots:slots.slice(),fMid,output,rMid,back,verified};
}
function f804Spec(){return {purpose:'Demonstrate and verify the composition of two mathematical operations and the reverse order of their inverses.',params:'Input, two sequential forward rules, two inverse rules, direction, and the required two-way output.',presets:'Y8-016 rearranging formulae with variations for 5x−4, 2x+3, and 5(x+4).',steps:'Read x → machine 1 → machine 2 → y → undo machine 2 → undo machine 1 → verify x.',interactions:'Drag or keyboard-place operations onto four machine wells; regrab, remove, reset, and change input. Challenge checks ordered rule sequences and both numerical outcomes.',traps:'Wrong operation order; treating an inverse as a sign flip without reversing the order; multiplying before evaluating brackets.',gcse:'Supports composite functions and inverse-operation reasoning, but is not a substitute for a full symbolic inverse-function solver.',linked:'F8-03 shared engine, F8-02 reverse-flowchart preset, F7-12 substitution, F0 core.'};}
const F804_STEPS=[
 {name:'Read the function',prompt:'Where does the input go?',narration:'A two-way function has a forward route and a reverse route. Start with x.'},
 {name:'Apply the first operation',prompt:'What must happen first?',narration:'The input passes through the first machine. Apply its rule before the next.'},
 {name:'Compose the operations',prompt:'How do we obtain y?',narration:'Now apply the second operation to the result from the first. That gives y.'},
 {name:'Begin the reverse route',prompt:'Which operation must we undo first?',narration:'To get back to x, reverse the order of the operations.'},
 {name:'Undo machine two',prompt:'What do we do to y?',narration:'Undo the last forward operation with its inverse.'},
 {name:'Undo machine one',prompt:'Do both routes agree?',narration:'Undo the first forward operation last. If we recover x, the inverse is correct.'}
];
const F804_DEF={
 id:ID,title:'F8-04 · Two-way Function Machine',config:{startMode:'guided',preset:'Y8-016'},steps:F804_STEPS.map((x,i)=>Object.defineProperty({...x},'narration',{enumerable:true,get:()=>F804_PRESETS[F804_STATE.preset].explanation[i]})),
 staticAlt:'An input passes through two sequential operation machines to make an output. The inverse route undoes the second operation first, then the first, returning to the original input.',
 render(i,stage){F804_STATE.step=i;F804_STATE.mode=active.mode;f804Paint({stage,step:i,preset:F804_STATE.preset,input:F804_PRESETS[F804_STATE.preset].input,mode:active.mode});},
 exploreIntro:'Experiment with two chained machines. Reverse the operations to return to the original input.',
 explore(panel,stage,api){F804_STATE.mode='explore';let preset=F804_STATE.preset,input=F804_PRESETS[preset].input,slots=[null,null,null,null];
  const ctrl=H('div',{class:'f804-controls'}),picker=H('select',{class:'f804-select','aria-label':'Choose two-way function preset'}),number=H('input',{class:'f804-number',type:'number',inputmode:'decimal','aria-label':'Original input x',value:String(input)}),reset=H('button',{class:'nova-btn',text:'Reset all four machines'}),status=H('div',{class:'f804-feedback','aria-live':'polite'});
  F804_IDS.forEach(k=>picker.appendChild(H('option',{value:k,text:F804_PRESETS[k].title})));picker.value=preset;
  function draw(msg){const cfg=F804_PRESETS[preset],math=f804Paint({stage,mode:'explore',preset,input,slots,onPlace:(k,i)=>{slots[i]=k;f804Emit('rule',{index:i,operation:k});draw('Machine '+(i+1)+' set to '+operations[k].label+'.');},onRemove:i=>{slots[i]=null;f804Emit('remove',i);draw('Operation returned to the tray.');}});
   status.dataset.status=math.verified?'correct':'';status.textContent=(msg?msg+' ':'')+ (math.verified?'Both routes agree: output '+math.output+', recovered input '+math.back+'.':math.output===null?'Place the two forward rules first.':math.back===null?'The forward output is '+math.output+'. Now complete the two inverse machines.':'Forward output '+math.output+'; reverse ends at '+math.back+'. Make it return to '+input+'.');}
  picker.onchange=()=>{preset=picker.value;F804_STATE.preset=preset;input=F804_PRESETS[preset].input;number.value=input;slots=[null,null,null,null];f804Emit('preset',preset);draw('Variation loaded.');};
  number.onchange=()=>{let n=Number(number.value);if(number.value.trim()===''||!Number.isFinite(n)||Math.abs(n)>1000){number.value=input;status.textContent='Enter a finite input between minus one thousand and one thousand.';return;}input=n;f804Emit('input',n);draw('Input updated.');};
  reset.onclick=()=>{slots=[null,null,null,null];f804Emit('reset',true);draw('All operation cards returned.');};
  ctrl.append(H('label',{text:'Function'}),picker,H('label',{text:'Input x'}),number,reset);panel.append(ctrl,status);draw();
 },
 challenge(panel,api,stage){F804_STATE.mode='challenge';let task=0,slots=[null,null,null,null],solved=false;
  const head=H('div',{class:'f804-heading'}),ctrl=H('div',{class:'f804-controls'}),outField=H('input',{class:'f804-number',type:'number',inputmode:'decimal','aria-label':'Forward output y',placeholder:'Output y'}),backField=H('input',{class:'f804-number',type:'number',inputmode:'decimal','aria-label':'Recovered input x',placeholder:'Return x'}),check=H('button',{class:'nova-btn primary',text:'Check both routes'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next two-way function'}),status=H('div',{class:'f804-feedback','aria-live':'polite'});
  function draw(msg,success=false){let cfg=F804_PRESETS[F804_IDS[task]];F804_STATE.preset=cfg.id;const input=cfg.challengeInput;
   f804Paint({stage,preset:cfg.id,input,slots,mode:'challenge',solved,onPlace:(k,i)=>{if(solved)return;slots[i]=k;f804Emit('rule',{index:i,operation:k});draw('Rule placed.');},onRemove:i=>{if(solved)return;slots[i]=null;f804Emit('remove',i);draw('Rule returned.');}});
   head.textContent='Challenge '+(task+1)+' of '+F804_IDS.length+' · '+cfg.algebra+' · original x = '+input;
   status.textContent=msg||'Choose both forward rules and both inverse rules. Enter the output and the recovered input.';status.dataset.status=success?'correct':msg?'warning':'';check.disabled=solved;next.hidden=!solved||task===F804_IDS.length-1;next.style.display=next.hidden?'none':'';
  }
  check.onclick=()=>{if(solved)return;const cfg=F804_PRESETS[F804_IDS[task]],expected=[...cfg.forward,...cfg.inverse],x=cfg.challengeInput;
   if(slots.some(k=>k===null)){status.textContent='Place all four operation cards before checking.';status.dataset.status='wrong';return;}
   const wrong=slots.findIndex((k,i)=>k!==expected[i]);if(wrong>=0){status.textContent=wrong<2?'Check the forward order: apply the rule inside brackets first where present. '+cfg.incorrect:'The reverse path must undo machine 2 first, then machine 1. '+cfg.incorrect;status.dataset.status='wrong';api.check(false,status.textContent,{reason:'operation-order',slot:wrong,preset:cfg.id});return;}
   const av=outField.value.trim(),bv=backField.value.trim(),out=Number(av),back=Number(bv);
   if(!av||!bv||!Number.isFinite(out)||!Number.isFinite(back)||!F804_MATH.validate(cfg,x,slots,out,back)){
    status.textContent='The rules are correctly placed. Work out both calculations, then confirm you recover the starting x.';status.dataset.status='wrong';api.check(false,status.textContent,{reason:'numeric-result',preset:cfg.id});return;}
   solved=true;f804Emit('output',{output:out,recovered:back});api.check(true,'Correct. The composite and inverse both agree.',{preset:cfg.id,output:out,recovered:back});draw('Both routes proved: the answer returns to '+x+'.',true);
  };
  hint.onclick=()=>api.hint(F804_PRESETS[F804_IDS[task]].incorrect);
  next.onclick=()=>{if(!solved||task>=F804_IDS.length-1)return;task++;slots=[null,null,null,null];solved=false;outField.value='';backField.value='';draw();};
  ctrl.append(outField,backField,check,hint,next);panel.append(head,ctrl,status);draw();
 }
};
Object.assign(DEF,{title:F804_DEF.title,config:F804_DEF.config,steps:F804_DEF.steps,staticAlt:F804_DEF.staticAlt,render:F804_DEF.render,exploreIntro:F804_DEF.exploreIntro,explore:F804_DEF.explore,challenge:F804_DEF.challenge});
window.F804_TEST={presets:F804_PRESETS,math:F804_MATH,config:F804_DEF.config,operations,setMode:mode=>window.F803_ENGINE.setMode(mode),state:()=>({...F804_STATE})};
window.F804_SPEC=f804Spec();
/* END F8-04 PRESENTATION PRESET */
