/* NOVA F8-01 — Step-by-step Working Animator. Fresh October 2026 build.
   Uses the established F0 core; no changes to canonical shared helpers. */
window.F801_CONFIG = Object.freeze({
  id:'F8-01', title:'Step-by-step Working Animator', family:'F8',
  startMode:'guided', preset:'Y7-018',
  parameters:{lessons:['Y7-018','Y8-011','Y8-012','Y8-015'], steps:3, allowKeyboard:true},
  events:{value:['preset','workingStep','operation','remove','choice','reset','variant'],system:['step','mode','correct','hintUsed']},
  references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F0-13','F3-02','F7-03']
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F8-01',C=window.F801_CONFIG;
const presets={
  'Y7-018': {title:'Priority of operations',eyebrow:'BRACKETS · MULTIPLY · SUBTRACT',lesson:'Y7 · ORDER OF OPERATIONS',
    lines:['18 − 3 × (2 + 4)','18 − 3 × 6','18 − 18','0'],
    ops:['Brackets','Multiply','Subtract'],roles:['focus','op','given'],
    focus:['(2 + 4)','3 × 6','18 − 18'],
    short:['Brackets first.','Multiply before subtracting.','Now subtract.','Zero is the result.'],
    why:['The expression inside brackets is one whole calculation.','Multiplication must happen before the final subtraction.','Only subtraction remains. The value stays equal at every step.'],
    traps:[['18 − 3 × 2 + 4','You ignored the bracket. Evaluate 2 + 4 together.'],['15 × 6','You subtracted before multiplying. Multiply 3 × 6 first.'],['36','Recheck the subtraction: 18 minus 18 is zero.']]},
  'Y8-011': {title:'Expanding double brackets',eyebrow:'DISTRIBUTE · GROUP · SIMPLIFY',lesson:'Y8 · ALGEBRAIC EXPANSION',
    lines:['(x + 3)(x + 2)','x² + 2x + 3x + 6','x² + (2 + 3)x + 6','x² + 5x + 6'],
    ops:['Distribute','Group terms','Simplify'],roles:['op','focus','result'],
    focus:['Each term × each term','2x + 3x','2 + 3'],
    short:['Every term meets every term.','Find the like terms.','Combine the x terms.','Four products, one expression.'],
    why:['Multiply x by x and 2, then 3 by x and 2. All four products must appear.','Only terms with the same variable and power can combine.','The coefficient 2 + 3 becomes 5. The x squared and constant terms remain.'],
    traps:[['x² + 6','You missed the two cross-products: 2x and 3x.'],['x² + 6x + 6','2x + 3x gives 5x, not 6x.'],['x² + 5 + 6','The x must stay attached to the coefficient 5.']]},
  'Y8-012': {title:'Factorising common factors',eyebrow:'FIND · DIVIDE · PROVE',lesson:'Y8 · FACTORISING',
    lines:['12x + 18','6 × 2x + 6 × 3','6(2x + 3)','12x + 18 ≡ 6(2x + 3)'],
    ops:['Find factor 6','Factor out 6','Show identity'],roles:['focus','op','result'],
    focus:['12x and 18','Both terms contain 6','Expand to check'],
    short:['Six divides both terms.','Write the common factor.','Keep what remains inside.','Expansion proves the identity.'],
    why:['Six is a common factor of 12 and 18. We can express both terms as multiples of six.','Place the common six outside a bracket and write 2x and 3 inside.','Distributing 6 across the bracket gives the original expression for every x.'],
    traps:[['6(12x + 18)','You must divide both original terms by 6 inside the bracket.'],['6(2x + 18)','You divided 12x, but forgot to divide 18.'],['6(2x + 3) = 12x + 3','Distribute 6 to both terms. Six times three equals eighteen.']]},
  'Y8-015': {title:'Equations with fractions',eyebrow:'UNDO · MULTIPLY · VERIFY',lesson:'Y8 · SOLVING EQUATIONS',
    lines:['\\frac{x}{3} + 2 = 7','\\frac{x}{3} = 5','x = 15','\\frac{15}{3} + 2 = 7'],
    ops:['Subtract 2','Multiply by 3','Substitute to check'],roles:['op','focus','result'],
    focus:['+ 2','x divided by 3','x = 15'],
    short:['Undo the plus two.','Multiply both sides by three.','The unknown is fifteen.','Substitution checks the answer.'],
    why:['Subtract two from both sides, keeping the equation balanced.','Multiply both sides by three to undo division by three.','When x is fifteen, the original left side becomes five plus two, which is seven.'],
    traps:[['\\frac{x}{3} = 9','Subtract 2 from 7, not add it.'],['x = \\frac{5}{3}','Undo division by three by multiplying by three.'],['\\frac{15}{3} + 2 = 5','Evaluate the whole original expression, including plus two.']]}
};
const presetIds=Object.keys(presets);const pose=['explain','point-down','count','point-right','think','show-one','celebrate'];
const state={preset:'Y7-018',mode:'guided',visible:0,step:0,selected:null,pending:null,challenge:0,choice:-1,score:0,feedback:'',mistakes:0};
function emit(key,value){if(!C.events.value.includes(key))throw Error('F8-01 event not declared '+key);N.events.emit('value',{engine:ID,key,value});}
function spec(){return {purpose:'Show each mathematically valid transformation on a structured chalk working column, so pupils can identify what changed and why.',params:'Preset, current transformation, valid operation, equation/expression form, challenge response.',presets:presetIds.map(k=>k+' · '+presets[k].title).join('; '),steps:'Start → focus → next line → focus → next line → focus → conclusion.',interactions:'Drag operation pills to the next working line, return/undo a placed operation, choose equivalent next line, keyboard and touch alternatives.',traps:'Wrong operation order; lost cross-products; missed common factor; inverse operations applied incorrectly.',gcse:'Higher extensions: non-linear rearrangement and longer worked chains; this run covers the four named KS3 lesson presets.'};}
function roleColor(role){return N.svg.c(role||'given');}
function view(){return innerWidth<=760?{w:440,h:690,x:19,card:402,rowH:100,rows:[60,178,296,414],font:27,pillW:154,pillH:39,trayY:582,opX:247}: {w:1040,h:650,x:34,card:971,rowH:101,rows:[57,174,291,408],font:38,pillW:221,pillH:47,trayY:541,opX:765};}
function svgText(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,t,{role:role||'given',size:size||26,anchor:anchor||'start'});}
function drawEquation(svg,text,x,baseline,font){
  const frac=String(text).match(/\\frac\{([^{}]+)\}\{([^{}]+)\}/);
  if(!frac){const t=svgText(svg,x,baseline,text,'given',font,'start');t.setAttribute('text-anchor','start');return;}
  const before=text.slice(0,frac.index),after=text.slice(frac.index+frac[0].length),prefixWidth=before.length*font*.61;
  if(before){const pre=svgText(svg,x,baseline,before,'given',font,'start');pre.setAttribute('text-anchor','start');}
  const fx=x+prefixWidth,fw=Math.max(font*1.15,Math.max(frac[1].length,frac[2].length)*font*.58+18);
  const a=svgText(svg,fx+fw/2,baseline-font*.47,frac[1],'given',font*.79,'middle');a.setAttribute('text-anchor','middle');
  const b=svgText(svg,fx+fw/2,baseline+font*.5,frac[2],'given',font*.79,'middle');b.setAttribute('text-anchor','middle');
  N.neonLine(svg,fx+3,baseline-font*.19,fx+fw-3,baseline-font*.19,{role:'given',width:2.2});
  if(after){const post=svgText(svg,fx+fw+13,baseline,after,'given',font*.93,'start');post.setAttribute('text-anchor','start');}
}
function surface(stage){stage.innerHTML='';stage.classList.add('f801-stage');}
function pill(svg,x,y,text,role,config){const g=N.neonBox(svg,x,y,config.w,config.h,{role:role||'op',r:12});g.classList.add('f801-pill');
 const t=svgText(g,x+config.w/2,y+config.h/2+7,text,role||'op',config.font||18,'middle');t.setAttribute('text-anchor','middle');return g;}
function clickable(g,name,cb){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',name);g.classList.add('f801-click');g.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();cb();}});g.addEventListener('click',cb);return g;}
function renderStage(stage,opts={}){
  const p=presets[opts.preset||state.preset],V=view();surface(stage);
  N.cap(stage,'F8-01 · '+p.title,opts.mode==='challenge'?'CHECK THE METHOD':opts.mode==='explore'?'BUILD THE WORKING':'FOLLOW THE WORKING');
  const svg=N.svg.root(V.w,V.h,'Four maths working lines showing valid equivalent transformations for '+p.title+'.');svg.classList.add('f801-svg');svg.setAttribute('data-preset',opts.preset||state.preset);svg.setAttribute('data-mode',opts.mode||state.mode);
  const idx=opts.phase==null?6:opts.phase,limit=opts.limit==null?Math.min(3,Math.floor((idx+1)/2)):opts.limit;
  const focus=(idx%2===1)?Math.floor(idx/2):-1;
  svgText(svg,V.x+10,31,p.lesson,'support',V.font*.64,'start');
  const cX=V.x+10,cW=V.card-20;
  N.neonLine(svg,cX+22,V.rows[0]+81,cX+22,V.rows[3]-10,{role:'given',width:2.7});
  for(let i=0;i<4;i++){
    const y=V.rows[i],seen=i<=limit,upcoming=i>limit;
    if(!seen&&!upcoming)continue;
    const role=seen?(i===limit?'focus':i===3?'result':'given'):'unknown';
    const card=N.neonBox(svg,cX,y,cW,V.rowH,{role,r:17});card.classList.add('f801-work-card');if(seen&&i===limit)card.classList.add('f801-reveal');
    if(!seen)card.setAttribute('opacity',i===limit+1?'.34':'.20');
    N.neonRing(svg,cX+22,y+23,{role:seen?'given':'support',r:7,pulse:false});
    svgText(svg,cX+48,y+31,'LINE '+(i+1),'support',V.font*.52,'start');
    if(seen){drawEquation(svg,p.lines[i],cX+25,y+V.rowH*.77, V.font*(p.lines[i].length>24?.73: p.lines[i].length>18?.82:1));}
    else{svgText(svg,cX+25,y+V.rowH*.74,i===limit+1?'?   Next justified line':'···   Working to follow','unknown',V.font*.71,'start');}
    if(i<3&&seen){const opLabel=p.ops[i];const opacity=focus===i?1:i<limit?0.9:.36;
      if(opts.mode!=='challenge'&&opts.mode!=='explore' || i<limit){const chip=pill(svg,V.opX,y+9,opLabel,i<limit?'op':'focus',{w:V.pillW,h:V.pillH,font:V.w<600?17:23});chip.setAttribute('opacity',String(opacity));
        if(opts.mode==='explore'&&i<limit&&opts.onUndo){clickable(chip,'Return operation '+opLabel+' to the tray',()=>opts.onUndo(i));N.ui.svgDrag(svg,chip,{box:{x:V.opX,y:y+9,w:V.pillW,h:V.pillH},zones:()=>[{id:'return',kind:'remove',x:V.x+10,y:V.trayY-12,w:V.card-20,h:84}],onRemove:()=>opts.onUndo(i)});}}
    }
    if(i===focus&&opts.mode!=='challenge'&&opts.mode!=='explore'){
       const fragment=p.focus[i]||'',raw=p.lines[i].replaceAll(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'$1/$2'),at=raw.indexOf(fragment);
       const lineX=cX+25+(at>=0?at*V.font*.47:8),lineLen=(at>=0?Math.max(43,fragment.length*V.font*.49):Math.min(180,cW*.38));
       N.neonLine(svg,lineX,y+V.rowH-7,Math.min(cX+cW-18,lineX+lineLen),y+V.rowH-7,{role:'focus',width:3});
       const g=E('rect',{x:cX+5,y:y+6,width:cW-10,height:V.rowH-12,rx:14,class:'f801-focus-glow','pointer-events':'none'},svg);g.style.stroke=roleColor('focus');}
  }
  const isInteractive=opts.mode==='explore'||opts.mode==='challenge';
  if(isInteractive){
    const step=Math.min(limit,2),taskComplete=limit>=3;
    if(!taskComplete){
      svgText(svg,cX+3,V.trayY-18,'CHOOSE THE NEXT OPERATION','support',V.font*.56,'start');
      const choices=opts.opChoices||[p.ops[step], 'Add 1', 'Divide by 2'];
      const width=V.w<600?120:218;const gap=V.w<600?8:15;
      choices.forEach((value,i)=>{
        const x=cX+i*(width+gap),y=V.trayY,box=pill(svg,x,y,value,i===0?'op':'given',{w:width,h:V.w<600?45:51,font:V.w<600?14.5:20});
        const activate=()=>opts.onPick&&opts.onPick(value,step);
        clickable(box,'Choose '+value+' as the next operation',activate);
        if(opts.onPick)N.ui.svgDrag(svg,box,{box:{x,y,w:width,h:V.w<600?45:51},zones:()=>[{id:'slot',kind:'drop',x:V.opX,y:V.rows[Math.min(3,step+1)]+40,w:V.pillW,h:V.pillH+35}],onDrop:()=>{activate();return true;}});
      });
      N.neonBox(svg,V.opX,V.rows[Math.min(step+1,3)]+42,V.pillW,V.pillH,{role:'unknown'});
    }else{pill(svg,cX+40,V.trayY,'WORKING COMPLETE','result',{w:V.w<600?290:430,h:V.w<600?48:55,font:V.w<600?22:30});}
  }else{
    if(idx>=6){pill(svg,cX+30,V.trayY-1,state.preset==='Y8-015'?'SAME SOLUTIONS THROUGHOUT':'EACH LINE KEEPS THE SAME VALUE','result',{w:V.w<600?342:720,h:55,font:V.w<600?18:27});}
    else{const lineIdx=focus>=0?focus:Math.max(0,Math.floor(idx/2)-1);const hint=p.why[Math.min(2,lineIdx)];svgText(svg,cX+15,V.trayY+35,hint.length>48?hint.slice(0,48)+'…':hint,'support',V.w<600?15:20,'start');}
  }
  stage.appendChild(svg);
  const react=opts.message||(opts.mode==='explore'?p.short[Math.min(limit,3)]:opts.mode==='challenge'?'Find the next valid move.':p.short[Math.min(3,Math.floor(idx/2))]);
  N.scene.helperStrip(stage,opts.pose||(idx===6?'celebrate':pose[idx]||'explain'),react);
  const summary=H('div',{class:'f801-summary'});
  const label=idx===6?'Why this works':opts.mode==='challenge'?'Prove each step':opts.mode==='explore'?'What changes?':'Mathematical evidence';
  summary.appendChild(H('strong',{text:label}));
  const reason=opts.mode==='challenge'?'Choose a valid operation and the mathematically equivalent next line.': opts.mode==='explore'?'Drag an operation pill onto the outlined next line, or use Enter on the pill.':p.why[Math.min(2,focus>=0?focus:Math.max(0,Math.floor(idx/2)-1))];
  summary.appendChild(H('span',{text:reason}));stage.appendChild(summary);
  if(opts.mode==='challenge'&&N.helperImg){
    const peer=N.helperImg('read-tablet','teen');
    const peerRow=H('div',{class:'f801-challenge-peer','aria-label':'Izaac challenge peer'});
    peerRow.appendChild(H('span',{text:'Izaac · '+p.short[Math.min(limit,3)]}));
    peerRow.appendChild(H('img',{src:peer.src,alt:peer.alt,width:62,height:62}));
    stage.appendChild(peerRow);
  }
  return svg;
}
const STEPS=[
 {name:'Read the first line',mood:'focus',prompt:'What does the expression tell us?',narration:'Read the first line. We keep its value as the working develops.'},
 {name:'Identify the first operation',mood:'think',prompt:'Which operation belongs first?',narration:'Choose the first operation. Highlight the terms it will change.'},
 {name:'Write the next line',mood:'focus',prompt:'What stays the same?',narration:'Write the next line. Keep every unchanged part in place.'},
 {name:'Identify the second operation',mood:'think',prompt:'What changes next?',narration:'Now choose the next valid operation, not just any operation.'},
 {name:'Write the third line',mood:'focus',prompt:'Is this line equal to the last?',narration:'The third line must have exactly the same value as the one before.'},
 {name:'Identify the final step',mood:'think',prompt:'What final operation proves the result?',narration:'Finish the method, and check the mathematical meaning.'},
 {name:'Finish and check',mood:'happy',prompt:'How can you verify every line?',narration:'Each transformation is justified. You can check the result against the original.'}
];
// Separate per-preset narration: short prompt for character, mathematical detail spoken by Sir Bob.
function teachingNarration(idx){const p=presets[state.preset];if(idx===0)return 'We begin with '+p.title+'. Read the first expression and predict the first useful move.';
 if(idx===6)return p.why[2]+' Check the conclusion against the starting expression.';
 const op=Math.floor((idx-1)/2);return idx%2?p.why[op]:p.short[Math.min(op+1,3)]+' All unchanged terms stay on the new line.';}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:'Y7-018'},steps:STEPS.map((x,i)=>Object.defineProperty({...x},'narration',{get:()=>teachingNarration(i),enumerable:true})),alt:'A connected sequence of four equivalent mathematical expressions, with operation choices.',staticAlt:'Each working line is explained in the text below the diagram.',
  render(i,stage){state.visible=i;renderStage(stage,{phase:i,mode:state.mode,preset:state.preset});const bob=document.querySelector('#F8-01 .bubble');if(bob&&state.mode==='guided'){}},
  exploreIntro:'Build the mathematics, one valid operation at a time.',
  explore(panel,stage,api){state.mode='explore';let progress=0;const header=H('div',{class:'f801-controls'}),sel=H('select',{class:'f801-select','aria-label':'Choose a lesson preset'}),msg=H('p',{class:'f801-interact-feedback','aria-live':'polite'}),undo=H('button',{class:'nova-btn',text:'Undo previous step'}),reset=H('button',{class:'nova-btn ghost',text:'Start again'});
    presetIds.forEach(id=>sel.appendChild(H('option',{value:id,text:presets[id].title})));sel.value=state.preset;
    const redraw=(message,good=false)=>{renderStage(stage,{preset:state.preset,limit:progress,mode:'explore',message,pose:good?'celebrate':'explain',onPick:(choice,j)=>{const p=presets[state.preset];if(choice!==p.ops[progress]){msg.textContent='That operation does not justify the next line. '+p.why[progress];msg.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,mode:'explore',step:progress});return;}progress++;emit('operation',choice);emit('workingStep',progress);msg.textContent=p.why[progress-1];msg.dataset.status='correct';N.events.emit('correct',{engine:ID,correct:true,mode:'explore',step:progress});redraw(p.short[Math.min(progress,3)],true);},onUndo:j=>{progress=Math.min(progress,j);emit('remove',j);msg.textContent='Step returned to the operation tray.';redraw('Try again.');}});undo.disabled=progress===0;};
    sel.onchange=()=>{state.preset=sel.value;progress=0;emit('preset',state.preset);msg.textContent='';redraw();};undo.onclick=()=>{if(progress){progress--;emit('remove',progress);redraw();}};reset.onclick=()=>{progress=0;emit('reset',true);msg.textContent='';redraw();};
    header.appendChild(H('label',{text:'Lesson preset'}));header.appendChild(sel);header.appendChild(undo);header.appendChild(reset);panel.appendChild(header);panel.appendChild(msg);redraw();},
  challenge(panel,api,stage){state.mode='challenge';let task=0,progress=0,wrong=0,locked=false,opPicked=false,score=0;
    const tasks=[
      {id:'Y7-018',ops:['Brackets','Multiply','Subtract'],next:['18 − 3 × 6','18 − 18','0'],distractors:[['18 − 3 × 2 + 4','18 − 3 × 6','18 − 6 × 4'],['15 × 6','18 − 18','15'],['18','36','0']]},
      {id:'Y8-011',ops:['Distribute','Group terms','Simplify'],next:['x² + 2x + 3x + 6','x² + (2 + 3)x + 6','x² + 5x + 6'],distractors:[['x² + 6','x² + 2x + 3x + 6','x² + 6x'],['x² + (2 + 3)x + 6','x² + 6x + 6','x² + (2 + 3) + 6'],['x² + 5 + 6','x² + 6x','x² + 5x + 6']]},
      {id:'Y8-012',ops:['Find factor 6','Factor out 6','Show identity'],next:['6 × 2x + 6 × 3','6(2x + 3)','12x + 18 ≡ 6(2x + 3)'],distractors:[['6 × 2x + 6 × 3','6 × 12x + 6 × 18','6 × 2x + 18'],['6(12x + 18)','6(2x + 3)','6(2x + 18)'],['12x + 18 ≡ 6(2x + 3)','12x + 18 ≡ 6(2x + 18)','12x + 18 ≡ 6(12x + 3)']]},
      {id:'Y8-015',ops:['Subtract 2','Multiply by 3','Substitute to check'],next:['\\frac{x}{3} = 5','x = 15','\\frac{15}{3} + 2 = 7'],distractors:[['\\frac{x}{3} = 9','\\frac{x}{3} = 5','\\frac{x}{3} = 7'],['x = 15','x = \\frac{5}{3}','x = 8'],['\\frac{15}{3} + 2 = 5','\\frac{15}{3} + 2 = 7','\\frac{15}{3} = 7']]}
    ];
    const hdr=H('div',{class:'f801-challenge-header'}),row=H('div',{class:'f801-answer-buttons'}),feedback=H('div',{class:'f801-interact-feedback','aria-live':'polite'}),check=H('button',{class:'nova-btn primary',text:'Check this line'}),hint=H('button',{class:'nova-btn ghost',text:'Why this operation?'}),next=H('button',{class:'nova-btn',text:'Next problem'});
    const choices=[];let selected=-1;
    function candidate(s){if(!String(s).includes('\\frac'))return s.replace(/\s+/g,' ');return s.replaceAll('\\frac{x}{3}','x ÷ 3').replaceAll('\\frac{5}{3}','5 ÷ 3').replaceAll('\\frac{15}{3}','15 ÷ 3');}
    function refresh(){const data=tasks[task];state.preset=data.id;
      hdr.textContent='Challenge '+(task+1)+' of '+tasks.length+' · Step '+(Math.min(progress+1,3))+' of 3 · '+presets[data.id].title;
      row.innerHTML='';selected=-1;locked=false;opPicked=false;next.hidden=true;next.style.display='none';check.disabled=false;feedback.textContent='First choose the operation, then select the correct next line.';feedback.dataset.status='';
      if(progress>=3){feedback.textContent='All three steps verified. You have proved this method.';feedback.dataset.status='correct';check.disabled=true;next.hidden=false;next.style.display='';
        renderStage(stage,{mode:'challenge',preset:data.id,limit:3,message:'Well reasoned!',pose:'celebrate'});return;}
      renderStage(stage,{mode:'challenge',preset:data.id,limit:progress,message:'Choose the next move.',onPick:(picked)=>{if(locked)return;opPicked=picked===data.ops[progress];emit('operation',picked);if(opPicked){feedback.textContent='Operation selected. Now check the equivalent next line.';feedback.dataset.status='correct';}else{wrong++;feedback.textContent='Try another operation. '+presets[data.id].why[progress];feedback.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,trap:'operation'});}}});
      data.distractors[progress].forEach((option,i)=>{const btn=H('button',{class:'nova-btn f801-answer',text:candidate(option),'data-option':String(i),'aria-pressed':'false'});btn.onclick=()=>{selected=i;row.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));emit('choice',option);};row.appendChild(btn);});
    }
    check.onclick=()=>{if(locked||progress>=3)return;const d=tasks[task],val=selected>=0?d.distractors[progress][selected]:null;
      if(!opPicked){feedback.textContent='Choose the correct operation pill first.';feedback.dataset.status='wrong';return;}
      if(val!==d.next[progress]){wrong++;const idx=d.distractors[progress].indexOf(val);const trap=presets[d.id].traps[progress];feedback.textContent=val===null?'Choose a next line before checking.':trap[1];feedback.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,step:progress,trap:trap[0]});return;}
      score++;progress++;N.events.emit('correct',{engine:ID,correct:true,step:progress,task});emit('workingStep',progress);locked=true;feedback.textContent='Correct — the next line preserves the mathematics.';feedback.dataset.status='correct';
      if(progress===3){setTimeout(()=>{if(!stage.isConnected)return;refresh();},350);}else{setTimeout(()=>{if(!stage.isConnected)return;refresh();},350);}
    };
    hint.onclick=()=>api.hint(presets[tasks[task].id].why[Math.min(2,progress)]);
    next.onclick=()=>{if(progress<3)return;if(task<tasks.length-1){task++;progress=0;refresh();}else{feedback.textContent='Challenge complete. '+score+' valid steps checked; '+wrong+' incorrect attempts corrected.';next.hidden=true;next.disabled=true;check.disabled=true;}};
    panel.appendChild(hdr);panel.appendChild(H('p',{class:'f801-mini-label',text:'Choose the next equivalent line'}));panel.appendChild(row);panel.appendChild(H('div',{class:'f801-challenge-actions'},[check,hint,next]));panel.appendChild(feedback);refresh();}
};
N.events.on('mode',event=>{const d=event.detail||{};if(d.engine===ID)state.mode=d.mode;});
N.registry&&N.registry.add({id:ID,title:C.title,kind:'engine',topics:['algebra','number'],deps:C.references,events:['value','correct','step','hintUsed']});
const eng=N.bankMount({id:ID,num:'01',title:C.title,spec:spec(),years:'KS3 Years 7–9',linked:C.references,def:DEF});
window.F801_ENGINE=eng;window.F801_PRESETS=presets;
// Stable debug/test-only interface: neither changes the core nor bypasses challenge marking.
window.F801_TEST={presets,config:C,getState:()=>({preset:state.preset,mode:state.mode,visible:state.visible}),pickPreset:id=>{if(presets[id]){state.preset=id;eng.setMode('explore');}},setMode:eng.setMode};
// Sir Bob wording is specific to the current lesson and reveal stage.
// Narration comes from the current-preset step getter; no duplicate speech on step events.
})();
