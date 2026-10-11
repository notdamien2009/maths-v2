/* NOVA F8-06 — Rearranging Formulae. Independent engine on the canonical F0 runtime.
   Visuals use F0 Neon Tube primitives, embedded NOVA Chalk, maths operations and core drag kit.
   No previous F8 attempt or private core is imported. */
window.F806_CONFIG=Object.freeze({id:'F8-06',title:'Rearranging Formulae',family:'F8',startMode:'guided',preset:'Y8-016-L',
 parameters:{target:'chosen subject',nonzeroDenominators:true,yearGroups:['8','9'],namedPresets:5},
 events:{value:['preset','operation','undo','reset','choice','numericCheck'],system:['correct','step','hintUsed','mode']},
 references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F8-01','F8-03','F8-05']});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.F806_CONFIG,ID=C.id,eps=1e-8;
const row=(L,R,lf,rf)=>({L,R,lf,rf});
const ops={
 sub2w:{short:'− 2w',title:'Subtract 2w from both sides',note:'The 2w term disappears because it is subtracted from BOTH sides.'},
 div2:{short:'÷ 2',title:'Divide both sides by 2',note:'Divide the entire left-hand expression by two, not just the last term.'},
 sub5:{short:'− 5',title:'Subtract 5 from both sides',note:'Undo the addition by subtracting five from each side.'},
 div3:{short:'÷ 3',title:'Divide both sides by 3',note:'The WHOLE numerator must be divided by three.'},
 mul2:{short:'× 2',title:'Multiply both sides by 2',note:'Multiplying by two clears the denominator of the entire fraction.'},
 divb:{short:'÷ b',title:'Divide both sides by b',note:'Divide by b only when b is non-zero.'},
 divx:{short:'÷ x',title:'Divide both sides by x',note:'Divide by x only when x is non-zero.'},
 mulx:{short:'× x',title:'Multiply both sides by x',note:'Multiply both sides by non-zero x to remove the denominator.'},
 swap:{short:'Swap =',title:'Swap the sides of the equation',note:'If A equals B, then B also equals A. The subject now appears on the left.'},
 add2w:{short:'+ 2w',title:'Add 2w to both sides',note:'Adding two w does not undo the term we need to remove.'},
 mulb:{short:'× b',title:'Multiply both sides by b',note:'That operation will not isolate h at this stage.'},
 divxWrong:{short:'÷ k',title:'Divide both sides by k',note:'Check which term actually multiplies the subject.'},
 div2early:{short:'÷ 2?',title:'Divide before clearing other terms',note:'You need to undo the outermost operation first.'},
 add5:{short:'+ 5',title:'Add five to both sides',note:'Adding five does not undo the existing plus five.'}
};
const lessons={
 'Y8-016-L':{name:'Perimeter · make l the subject',lesson:'Y8-016',target:'l',context:'Change the subject of P = 2l + 2w. Keep P and w as symbols.',condition:'The rectangle has length l and width w.',steps:['sub2w','div2','swap'],pool:['sub2w','div2','swap','add2w','div2early'],
 rows:[row('P','2l + 2w',v=>v.P,v=>2*v.l+2*v.w),row('P − 2w','2l',v=>v.P-2*v.w,v=>2*v.l),row('\\frac{P-2w}{2}','l',v=>(v.P-2*v.w)/2,v=>v.l),row('l','\\frac{P-2w}{2}',v=>v.l,v=>(v.P-2*v.w)/2)],
 ratio:[1,.5,-1],inputs:{P:26,w:4},make:v=>({...v,l:(v.P-2*v.w)/2}),targetFn:v=>(v.P-2*v.w)/2,
 final:'l=\\frac{P-2w}{2}',choices:[{t:'l=\\frac{P-2w}{2}',correct:true},{t:'l=\\frac{P+2w}{2}'},{t:'l=\\frac{P-2w}{4}'}],
 bob:['A perimeter adds two lengths and two widths. Our target is l.','Subtract two widths from BOTH sides.','Divide all of P minus two w by two.','Swap the equality so the subject l is on the left.','Check the formula with a real perimeter and width.'],
 tips:['Circle the letter to isolate.','Remove the width contribution.','Divide the complete expression.','Write l on the left.']},
 'Y8-016-G':{name:'Linear rule · make x the subject',lesson:'Y8-016',target:'x',context:'Rearrange y = 3x + 5 to make x the subject.',condition:'Undo addition first; multiplication second.',steps:['sub5','div3','swap'],pool:['sub5','div3','swap','add5','div2early'],
 rows:[row('y','3x + 5',v=>v.y,v=>3*v.x+5),row('y − 5','3x',v=>v.y-5,v=>3*v.x),row('\\frac{y-5}{3}','x',v=>(v.y-5)/3,v=>v.x),row('x','\\frac{y-5}{3}',v=>v.x,v=>(v.y-5)/3)],ratio:[1,1/3,-1],inputs:{y:29},make:v=>({...v,x:(v.y-5)/3}),targetFn:v=>(v.y-5)/3,
 final:'x=\\frac{y-5}{3}',choices:[{t:'x=\\frac{y+5}{3}'},{t:'x=\\frac{y-5}{3}',correct:true},{t:'x=y-\\frac{5}{3}'}],
 bob:['The output y comes from multiplying x by three and then adding five.','Undo the final plus five first.','Divide the WHOLE quantity y minus five by three.','Swap the sides so x is the subject.','Substitute a value for y and check the rule.'],tips:['Track the operation order.','Undo the addition.','Divide the entire expression.','Place the subject on the left.']},
 'Y8-016-A':{name:'Triangle area · make h the subject',lesson:'Y8-016',target:'h',context:'Rearrange A = bh ÷ 2 to make h the subject.',condition:'The base b must be non-zero.',steps:['mul2','divb','swap'],pool:['mul2','divb','swap','div2','mulb'],
 rows:[row('A','\\frac{bh}{2}',v=>v.A,v=>v.b*v.h/2),row('2A','bh',v=>2*v.A,v=>v.b*v.h),row('\\frac{2A}{b}','h',v=>2*v.A/v.b,v=>v.h),row('h','\\frac{2A}{b}',v=>v.h,v=>2*v.A/v.b)],ratio:[2,v=>1/v.b,-1],inputs:{A:42,b:7},make:v=>({...v,h:2*v.A/v.b}),targetFn:v=>2*v.A/v.b,
 final:'h=\\frac{2A}{b}',choices:[{t:'h=\\frac{A}{2b}'},{t:'h=\\frac{2A}{b}',correct:true},{t:'h=\\frac{Ab}{2}'}],
 bob:['A triangle is half the base multiplied by the height. We need h.','Multiply BOTH sides by two to clear the fraction.','Now divide BOTH sides by the non-zero base b.','Swap the sides to write h as the subject.','Verify the original area with the derived height.'],tips:['Target the height.','Clear the fraction first.','Divide by the base, not by two again.','Remember b cannot be zero.']},
 'Y9-019-D':{name:'Inverse proportion · make y the subject',lesson:'Y9-019',target:'y',context:'For k = xy, rearrange to make y the subject.',condition:'Assume x is non-zero.',steps:['divx','swap'],pool:['divx','swap','divxWrong','mulx'],
 rows:[row('k','xy',v=>v.k,v=>v.x*v.y),row('\\frac{k}{x}','y',v=>v.k/v.x,v=>v.y),row('y','\\frac{k}{x}',v=>v.y,v=>v.k/v.x)],ratio:[v=>1/v.x,-1],inputs:{k:60,x:5},make:v=>({...v,y:v.k/v.x}),targetFn:v=>v.k/v.x,
 final:'y=\\frac{k}{x}',choices:[{t:'y=kx'},{t:'y=\\frac{k}{x}',correct:true},{t:'y=\\frac{x}{k}'}],
 bob:['For inverse proportion the product x times y stays constant at k.','Divide both sides by non-zero x to isolate y.','Swap the sides to make y the subject.','If x doubles, y halves for the same non-zero k.'],tips:['Identify the constant product.','Divide by x to leave y.','Move y to the left.']},
 'Y9-019-R':{name:'Inverse proportion · make k the subject',lesson:'Y9-019',target:'k',context:'From y = k ÷ x, rearrange to make k the subject.',condition:'Assume x is non-zero.',steps:['mulx','swap'],pool:['mulx','swap','divx','divxWrong'],
 rows:[row('y','\\frac{k}{x}',v=>v.y,v=>v.k/v.x),row('xy','k',v=>v.x*v.y,v=>v.k),row('k','xy',v=>v.k,v=>v.x*v.y)],ratio:[v=>v.x,-1],inputs:{x:6,y:8},make:v=>({...v,k:v.x*v.y}),targetFn:v=>v.x*v.y,
 final:'k=xy',choices:[{t:'k=\\frac{y}{x}'},{t:'k=xy',correct:true},{t:'k=\\frac{x}{y}'}],
 bob:['The formula describes inverse proportion. We need the constant k.','Multiply both sides by non-zero x; the division disappears.','Swap the equality so k is the subject.','Check that x times y matches k.'],tips:['Choose the constant k.','Undo the division by x.','Write k first.']}
};
const order=Object.keys(lessons),close=(a,b)=>Math.abs(a-b)<eps;
function evaluateRow(r,v){return [r.lf(v),r.rf(v)];}
function difference(r,v){const z=evaluateRow(r,v);return z[0]-z[1];}
function ratioAt(p,i,v){const r=p.ratio[i];return typeof r==='function'?r(v):r;}
function validate(p,v){for(let i=0;i<p.steps.length;i++)if(!close(difference(p.rows[i+1],v),difference(p.rows[i],v)*ratioAt(p,i,v)))return false;return p.rows.every(r=>close(...evaluateRow(r,v)));}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F8-06 event '+key);N.events.emit('value',{engine:ID,key,value});}
function txt(root,x,y,t,role='given',size=25,anchor='middle'){const g=N.chalkText(root,x,y,String(t),{role,size,anchor});g.setAttribute('text-anchor',anchor);return g;}
function box(root,x,y,w,h,role='given',rad=15){return N.neonBox(root,x,y,w,h,{role,r:rad});}
function ln(root,x,y,X,Y,role='given',width=3){return N.neonLine(root,x,y,X,Y,{role,width});}
function math(root,x,y,value,role='given',font=25,anchor='middle'){
 // One traditional stacked fraction per teaching expression; NOVA Chalk numerals and the shared neon bar.
 const expr=String(value),m=/\\frac\{([^{}]+)\}\{([^{}]+)\}/.exec(expr);
 if(!m)return txt(root,x,y,expr,role,font,anchor);
 const before=expr.slice(0,m.index),after=expr.slice(m.index+m[0].length),pfx=before.length*font*.55,sfx=after.length*font*.55;
 const fw=Math.max(44,Math.max(m[1].length,m[2].length)*font*.59+18),full=pfx+fw+sfx+(after?3:0);
 let cx=(anchor==='middle'?x-full/2:anchor==='end'?x-full:x);
 if(before){txt(root,cx,y,before,role,font,'start');cx+=pfx;}
 txt(root,cx+fw/2,y-font*.47,m[1],role,font*.73);
 ln(root,cx+3,y-font*.19,cx+fw-3,y-font*.19,role,2.4);
 txt(root,cx+fw/2,y+font*.48,m[2],role,font*.73);cx+=fw+3;
 if(after)txt(root,cx,y,after,role,font*.92,'start');
}
const STEPS=[
 {name:'Notice the subject',prompt:'Which variable must be isolated?'},
 {name:'Identify the outer operation',prompt:'What operation currently holds the subject?'},
 {name:'Undo the first operation',prompt:'Perform the inverse on both sides.'},
 {name:'Continue rearranging',prompt:'What transformation comes next?'},
 {name:'Make the subject',prompt:'Read the rearranged formula.'},
 {name:'Substitute to verify',prompt:'Does the new formula reproduce the original?'}
];
const active={preset:order[0],mode:'guided',phase:0};
function dims(p,interact){const mobile=innerWidth<=760, n=p.steps.length;
 const D=mobile?{mobile,w:440,h:1000,x:20,wide:400,headY:96,formulaY:195,subjectY:94,socket:{x:141,y:299,w:158,h:62},firstRowY:399,rowH:91,rowGap:99,proofH:105,trayW:97,trayH:52}:
 {mobile,w:1080,h:950,x:66,wide:948,headY:92,formulaY:174,subjectY:98,socket:{x:434,y:267,w:213,h:61},firstRowY:363,rowH:72,rowGap:80,proofH:92,trayW:145,trayH:55};
 D.proofY=D.firstRowY+(n+1)*D.rowGap+8;
 D.trayY=D.proofY+D.proofH+20;
 D.removeY=D.trayY+(mobile? (p.pool.length>4?126:70):0);
 D.h=interact?D.removeY+(mobile?60:68):D.proofY+D.proofH+15;
 D.h+=mobile?10:12;return D;}
function selectable(g,label,fun){g.classList.add('f806-pickable');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',label);
 g.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();fun();}});g.addEventListener('click',()=>fun());}
function capture(g){g.addEventListener('pointerdown',ev=>{try{g.setPointerCapture(ev.pointerId)}catch(e){};});}
function draw(stage,o){const p=lessons[o.preset||active.preset],chall=o.mode==='challenge',interact=chall||o.mode==='explore',path=p.rows;
 const progress=Math.max(0,Math.min(o.progress||0,p.steps.length)),d=dims(p,interact);stage.replaceChildren();N.cap(stage,'F8-06 · FORMULA STUDIO',chall?'FIND THE NEW SUBJECT':interact?'UNDO THE OUTERMOST OPERATION':'KEEP THE EQUALITY TRUE');
 const svg=N.svg.root(d.w,d.h,'A neon formula workspace with a circled subject, equivalent algebra steps, and inverse operations applied to both sides.');svg.classList.add('f806-svg');
 svg.dataset.preset=o.preset||active.preset;svg.dataset.mode=o.mode||active.mode;svg.dataset.stepCount=String(progress);svg.dataset.mathsCorrect=String(validate(p,p.make({...p.inputs})));
 txt(svg,d.w/2,36,'REARRANGE · PROVE · VERIFY','support',d.mobile?21:25);
 // Target variable marker is the canonical F0 neon ring, not a star.
 const subX=d.mobile?40:103,sy=d.subjectY;N.neonRing(svg,subX,sy,{role:'focus',r:8});txt(svg,subX+35,sy+9,p.target,'result',d.mobile?28:32);
 txt(svg,d.mobile?270:260,sy+8,'MAKE THE SUBJECT','support',d.mobile?22:25,'middle');
 if(!d.mobile){txt(svg,d.w-190,sy+8,p.lesson+' · VARIABLE ISOLATION','support',21);}
 // Linked term cards at the top show the current equality.
 const r=path[progress],bw=d.mobile?178:421,leftX=d.mobile?27:85,rightX=d.mobile?235:575;
 [leftX,rightX].forEach((x,k)=>{box(svg,x,d.formulaY,bw,d.mobile?88:82,k?'op':'given',17);
   txt(svg,x+bw/2,d.formulaY+24,k?'RIGHT SIDE':'LEFT SIDE','support',d.mobile?19:19);
   const v=chall&&!o.solved&&progress===p.steps.length?(k?'?':p.target):(k?r.R:r.L);math(svg,x+bw/2,d.formulaY+(d.mobile?65:62),v,k?'op':'given',d.mobile?(v.length>12?26:29):(v.length>16?30:36));});
 box(svg,d.w/2-24,d.formulaY+(d.mobile?21:18),48,46,'result',13);txt(svg,d.w/2,d.formulaY+(d.mobile?54:51),'=','result',32);
 // Same operation applies to both sides; the glowing socket accepts inverse cards.
 ln(svg,d.mobile?40:105,d.socket.y+31,d.socket.x-14,d.socket.y+31,'focus',3);ln(svg,d.socket.x+d.socket.w+14,d.socket.y+31,d.mobile?400:972,d.socket.y+31,'focus',3);
 box(svg,d.socket.x,d.socket.y,d.socket.w,d.socket.h,interact?'focus':'support',16);
 const prev=progress?ops[p.steps[progress-1]].short:interact?'DROP / TAP':'INVERSE STEP';txt(svg,d.w/2,d.socket.y+41,prev,progress?'result':'unknown',d.mobile?22:26);
 // Mathematical evidence: one row per algebraic equivalence, progressively revealed.
 for(let i=0;i<path.length;i++){const y=d.firstRowY+i*d.rowGap,seen=i<=progress,chosen=seen&&i===progress,role=chosen?'focus':seen?'given':'support';
  const g=box(svg,d.x,y,d.wide,d.rowH,role,14);g.setAttribute('data-row',String(i));g.setAttribute('data-revealed',String(seen));
  txt(svg,d.x+18,y+29,String(i+1).padStart(2,'0'),'support',d.mobile?18:20,'start');
  if(seen){const L=(chall&&!o.solved&&i===p.steps.length)?p.target:path[i].L,R=(chall&&!o.solved&&i===p.steps.length)?'?':path[i].R,fx=d.mobile?27:32;
   math(svg,d.mobile?d.x+140:d.x+293,y+(d.mobile?55:48),L,'given',fx);
   txt(svg,d.w/2,y+(d.mobile?55:48),'=','result',d.mobile?25:29);
   math(svg,d.mobile?d.x+296:d.x+690,y+(d.mobile?55:48),R,i===p.steps.length?'result':'op',fx);
   if(i>0)txt(svg,d.x+d.wide-(d.mobile?17:25),y+27,ops[p.steps[i-1]].short,'support',d.mobile?19:20,'end');
  }else{txt(svg,d.w/2,y+(d.mobile?56:48),i===progress+1?'?  NEXT EQUIVALENT LINE':'· · ·','unknown',d.mobile?21:25);}
 }
 box(svg,d.x,d.proofY,d.wide,d.proofH,'support',15);
 const caption=chall?(o.solved?'FORMULA VERIFIED':'YOUR TARGET STAYS HIDDEN'):progress===p.steps.length?'CHECK THE ORIGINAL':progress?'EQUAL CHANGES · BOTH SIDES':'HIGHLIGHT THE SUBJECT';
 txt(svg,d.w/2,d.proofY+38,caption,progress===p.steps.length&&o.solved?'result':'focus',d.mobile?20:26);
 const proof=chall?(o.solved?'A correct expression and check.':'Choose valid inverse operations.'):
 progress===p.steps.length?('SUBJECT: '+p.target+' · READY TO VERIFY'):(progress?ops[p.steps[progress-1]].note:p.condition);
 txt(svg,d.w/2,d.proofY+(d.mobile?76:69),proof,'support',d.mobile?(proof.length>49?15:17):(proof.length>83?17:20));
 if(interact){const pool=p.pool,positions=pool.map((k,i)=>({key:k,x:d.mobile?16+(i%4)*104:38+i*157,y:d.trayY+(d.mobile?Math.floor(i/4)*59:0)}));
  positions.forEach(({key,x,y})=>{const g=E('g',{'data-op-card':key},svg);box(g,x,y,d.trayW,d.trayH,'op',11);txt(g,x+d.trayW/2,y+d.trayH*.67,ops[key].short,'given',d.mobile?20:24);
   selectable(g,ops[key].title,()=>o.onApply&&o.onApply(key));
   N.ui.svgDrag(svg,g,{box:{x,y,w:d.trayW,h:d.trayH},zones:()=>[{id:'apply',kind:'drop',...d.socket},{id:'remove',kind:'remove',x:d.mobile?22:863,y:d.removeY,w:d.mobile?396:177,h:50}],onDrop:target=>target==='apply'?!!(o.onApply&&o.onApply(key)):false,onRemove:()=>{}});capture(g);
  });
  const rx=d.mobile?22:863,rw=d.mobile?396:177;box(svg,rx,d.removeY,rw,49,'focus',10);txt(svg,rx+rw/2,d.removeY+32,'RETURN / UNDO','focus',d.mobile?19:18);
  if(progress){const last=p.steps[progress-1],g=E('g',{'data-placed-operation':last},svg);box(g,d.socket.x,d.socket.y,d.socket.w,d.socket.h,'result',14);txt(g,d.w/2,d.socket.y+40,ops[last].short,'result',d.mobile?22:27);
   selectable(g,'Undo the last operation',()=>o.onUndo&&o.onUndo());g.addEventListener('keydown',e=>{if(['Delete','Backspace'].includes(e.key)){e.preventDefault();o.onUndo&&o.onUndo();}});
   N.ui.svgDrag(svg,g,{box:d.socket,zones:()=>[{id:'remove',kind:'remove',x:rx,y:d.removeY,w:rw,h:49}],onRemove:()=>o.onUndo&&o.onUndo()});capture(g);
  }
 }
 stage.appendChild(svg);
 const idx=Math.min(progress,p.tips.length-1),line=chall?(o.solved?'That formula works!':o.wrong?'Check the inverse move!':'Which operation undoes this?'):
 o.mode==='explore'?(o.wrong?'Try the correct inverse!':progress===p.steps.length?'Check the original!':p.tips[idx]):p.tips[Math.min(o.phase||0,p.tips.length-1)];
 N.scene.helperStrip(stage,o.solved?'celebrate':o.wrong?'not-yet':['explain','point-down','count','celebrate'][idx],line);
 const proofRow=H('div',{class:'f806-explain'});proofRow.append(H('strong',{text:chall?'Mathematical reasoning':o.mode==='explore'?'Why this works':'Sir Bob explains'}));proofRow.append(H('span',{text:chall?'The final rearrangement stays hidden until you prove the steps and choose a correct formula.':o.mode==='explore'?progress?'Both sides were changed by the same valid inverse operation.':'Choose the subject and undo operations from outside in.':p.bob[Math.min(p.bob.length-1,o.phase||0)]}));stage.appendChild(proofRow);
 if(chall&&N.helperImg){const im=N.helperImg(o.solved?'victory':'think','teen');const peer=H('div',{class:'f806-peer','aria-label':'Izaac, challenge peer'});peer.append(H('span',{text:o.solved?'Izaac · Proof accepted.':'Izaac · Show every step.'}));peer.append(H('img',{src:im.src,alt:im.alt,width:67,height:67}));stage.appendChild(peer);}
 if(N.motion&&N.motion.flash&&!N.reducedMotion()&&(o.solved||(progress&&!interact)))N.motion.flash(svg,o.solved?subX:d.w/2,o.solved?sy:d.socket.y+20,'result',28);
}
function spec(){return {purpose:'Change the subject of a formula while preserving equivalence and domain restrictions.',parameters:'Symbolic terms, target variable, inverse operations, named lessons, non-zero denominator conditions and substitution evidence.',presets:'Year 8 perimeter, algebraic rule and triangle-area formulae; Year 9 inverse proportion in both directions.',steps:'Notice subject → identify outer operation → undo → repeat → write subject → numerical verification.',interactions:'Drag inverse operation tiles to a both-sides socket, tap/Enter alternative, undo/remove, inspect each equivalent line, challenge formula selection.',traps:'Subtracting on one side only; dividing only one term; clearing a fraction incorrectly; dividing by a variable without checking non-zero; assuming direct proportion.',gcse:'Symbolic parameter rearrangements and inverse proportion with explicit non-zero variables.',linked:C.references};}
function renderChoices(root,options,onSelect,selected,solved){root.replaceChildren();options.forEach((c,i)=>{const b=H('button',{class:'nova-btn f806-choice',type:'button',onclick:()=>onSelect(i),'aria-label':'Formula option '+(i+1)});b.appendChild(H('small',{text:'OPTION '+(i+1)}));const display=H('span',{class:'f806-formula'});richFormula(display,c.t);b.appendChild(display);b.classList.toggle('selected',selected===i);b.disabled=solved;root.appendChild(b);});}
function richFormula(container,s){const m=/\\frac\{([^{}]+)\}\{([^{}]+)\}/.exec(s);if(!m){container.textContent=s;return;}if(m.index)container.appendChild(H('span',{text:s.slice(0,m.index)}));const fraction=H('span',{class:'f806-stack'});fraction.append(H('span',{text:m[1]}),H('span',{text:m[2]}));container.appendChild(fraction);if(s.slice(m.index+m[0].length))container.appendChild(H('span',{text:s.slice(m.index+m[0].length)}));}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:order[0]},steps:STEPS.map((z,i)=>({...z,get narration(){return lessons[active.preset].bob[Math.min(i,lessons[active.preset].bob.length-1)];}})),
 alt:'Neon term cards show equivalent formulae, a target subject ring, inverse-operation cards and a stacked chalk working column.',
 staticAlt:'Change the subject by applying inverse operations to both sides in reverse order and verifying the new formula by substitution.',
 render(i,stage){active.phase=i;const p=lessons[active.preset];draw(stage,{preset:active.preset,mode:active.mode,phase:i,progress:Math.max(0,Math.min(p.steps.length,i===0?0:i))});},
 exploreIntro:'Choose a real KS3 formula. Use valid inverse operations to isolate the target variable.',
 explore(panel,stage,api){active.mode='explore';let id=active.preset,progress=0;
 const controls=H('div',{class:'f806-controls'}),sel=H('select',{class:'f806-select','aria-label':'Choose formula preset'}),undo=H('button',{class:'nova-btn',text:'Undo last step'}),reset=H('button',{class:'nova-btn ghost',text:'Reset formula'}),choices=H('div',{class:'f806-buttons'}),fb=H('div',{class:'f806-feedback','aria-live':'polite'});
 order.forEach(k=>sel.appendChild(H('option',{value:k,text:k+' · '+lessons[k].name})));sel.value=id;
 function refresh(msg='',status=''){active.preset=id;draw(stage,{preset:id,mode:'explore',progress,wrong:status==='wrong',onApply:apply,onUndo:back});choices.replaceChildren();lessons[id].pool.forEach(key=>{const b=H('button',{class:'nova-btn f806-op-button',text:ops[key].short,'aria-label':ops[key].title,onclick:()=>apply(key)});choices.appendChild(b);});fb.textContent=msg||'Choose a tile. Drag it onto the centre socket, or tap to apply it.';fb.dataset.status=status;}
 function wrongMessage(key){const expected=lessons[id].steps[progress];return expected==='divb'||expected==='divx'?'The divisor must be non-zero. '+ops[expected].note:key==='swap'?'Swapping sides is valid, but the subject has not been isolated yet.':key==='div2early'?'Undo the outermost operation first.':'That does not isolate the subject at this stage. '+ops[expected].note;}
 function apply(key){const p=lessons[id],want=p.steps[progress];if(!want){refresh('Rearranged. Use the numeric check to prove the formula.','correct');return false;}if(key!==want){refresh(wrongMessage(key),'wrong');return false;}progress++;emit('operation',{preset:id,operation:key,progress});refresh(ops[key].note,progress===p.steps.length?'correct':'');return true;}
 function back(){if(progress){progress--;emit('undo',{preset:id,progress});refresh('Previous equivalent formula restored.');}}
 sel.onchange=()=>{id=sel.value;progress=0;emit('preset',id);refresh();};undo.onclick=back;reset.onclick=()=>{progress=0;emit('reset',id);refresh();};controls.append(sel,undo,reset);panel.append(controls,choices,fb);refresh();},
 challengeIntro:'Use valid inverse operations; then identify the correct new formula and verify with values.',
 challenge(panel,api,stage){active.mode='challenge';let task=0,progress=0,selected=null,solved=false,wrong=0;
 const head=H('div',{class:'f806-head'}),buttons=H('div',{class:'f806-buttons'}),choiceLabel=H('div',{class:'f806-subhead',text:'Choose the formula with the correct subject'}),optionList=H('div',{class:'f806-formula-options'}),numberLabel=H('div',{class:'f806-number'}),field=H('input',{class:'f806-answer',type:'number',step:'any',inputmode:'decimal','aria-label':'Calculate the subject using the given values',placeholder:'Your calculated value'}),verify=H('button',{class:'nova-btn primary',text:'Check formula and value'}),undo=H('button',{class:'nova-btn',text:'Undo'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next formula'}),fb=H('div',{class:'f806-feedback','aria-live':'polite'});
 const p=()=>lessons[order[task]];
 function refresh(msg='',status=''){const z=p();active.preset=order[task];head.textContent='Challenge '+(task+1)+' of '+order.length+' · '+z.name;draw(stage,{preset:order[task],mode:'challenge',progress,solved,wrong:status==='wrong',onApply:apply,onUndo:back});buttons.replaceChildren();z.pool.forEach(key=>{const b=H('button',{class:'nova-btn f806-op-button',text:ops[key].short,'aria-label':ops[key].title,onclick:()=>apply(key)});b.disabled=solved;buttons.appendChild(b);});
 renderChoices(optionList,z.choices,choose,selected,solved);
 choiceLabel.hidden=progress!==z.steps.length;optionList.hidden=progress!==z.steps.length;const tokens=Object.entries(z.inputs).map(([k,v])=>k+' = '+v).join('   ·   ');numberLabel.textContent='CHECK WITH: '+tokens;
 numberLabel.hidden=progress!==z.steps.length;field.hidden=progress!==z.steps.length;verify.disabled=progress!==z.steps.length||solved;field.disabled=solved;next.hidden=!solved;next.style.display=solved?'':'none';fb.textContent=msg||'Apply each valid inverse operation. The final formula stays hidden until your reasoning is complete.';fb.dataset.status=status;}
 function apply(key){if(solved)return false;const z=p(),want=z.steps[progress];if(!want){refresh('Select the correct symbolic formula and calculate the subject.');return false;}
 if(key!==want){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'operation',task});const msg=want==='mul2'?'The fraction is divided by two: multiply BOTH sides by two.':want==='divb'||want==='divx'?'Divide by the coefficient of the target variable, provided it is not zero.':want==='swap'?'First isolate the subject, then swap the equality.':'Undo the OUTERMOST operation from both sides.';refresh(msg,'wrong');return false;}
 progress++;emit('operation',{task,operation:key,progress});refresh('Correct inverse step. '+ops[key].note,'correct');return true;}
 function back(){if(progress&&!solved){progress--;selected=null;emit('undo',{task,progress});refresh('Last operation undone.');}}
 function choose(i){if(solved)return;selected=i;emit('choice',{task,index:i});refresh('Formula selected. Calculate the subject using the given values.');}
 verify.onclick=()=>{const z=p();if(progress!==z.steps.length)return;const v=field.value.trim(),number=Number(v),expected=z.targetFn(z.inputs);
 if(selected===null){refresh('Choose an algebraic formula before checking.','wrong');return;}
 if(!z.choices[selected].correct){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'formula',task});refresh('Not yet. Your expression does not preserve every operation. Recheck signs and the whole fraction numerator.','wrong');return;}
 if(!v||!Number.isFinite(number)||!close(number,expected)){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'numeric',task});refresh('Your formula choice is correct. Recalculate carefully with the supplied values.','wrong');return;}
 solved=true;emit('numericCheck',{task,value:number});N.events.emit('correct',{engine:ID,correct:true,task});refresh('Correct — symbolic formula and numerical substitution both verified.','correct');};
 hint.onclick=()=>{const want=p().steps[Math.min(progress,p().steps.length-1)];api.hint('Undo the outermost operation on BOTH sides. '+ops[want].note);};undo.onclick=back;
 next.onclick=()=>{if(!solved)return;if(task<order.length-1){task++;progress=0;selected=null;solved=false;field.value='';refresh();}else{next.style.display='none';fb.textContent='All formula challenges completed. Corrections made: '+wrong+'.';}};
 panel.append(head,buttons,choiceLabel,optionList,numberLabel,field,verify,undo,hint,next,fb);refresh();}
};
N.events.on('mode',ev=>{const d=ev.detail||{};if(d.engine===ID)active.mode=d.mode;});
if(N.registry)N.registry.add({id:ID,title:C.title,kind:'engine',topics:['algebra','formulae','inverse-proportion'],deps:C.references,events:['value','correct','step','hintUsed']});
const engine=N.bankMount({id:ID,num:'06',title:C.title,spec:spec(),years:'KS3 Years 8–9',linked:C.references,def:DEF});
window.F806_TEST={lessons,ops,order,close,validate,evaluateRow,difference,ratioAt,config:C,state:()=>({...active}),setMode:engine.setMode};
})();
