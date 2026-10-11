/* F8-05 Both-sides Equation Solver · Fresh NOVA F0 Neon + Chalk build.
   Derived ONLY from master F8-05 spec and F0 shared helper contract.
   This file registers its own maths engine; it never modifies F8-01..04 or core. */
window.F805_CONFIG=Object.freeze({
 id:'F8-05',title:'Both-sides Equation Solver',family:'F8',startMode:'guided',preset:'Y7-033',
 parameters:{lessons:['Y7-033','Y7-035','Y8-013','Y8-014','Y8-015'],equationForm:'linear affine',presets:5},
 events:{value:['preset','operation','undo','challengeStep','solution','reset'],system:['correct','step','hintUsed','mode']},
 references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F7-08','F8-01']
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.F805_CONFIG,ID=C.id;
// A line carries a *mathematical* affine representation, independent of its display text.
// This permits machine checks of every written equality and intermediate transformation.
const line=(L,R,a,b,c,d)=>({L,R,a,b,c,d});
const operations={
  expand:{short:'Expand',title:'Expand the bracket',kind:'expand',by:0,meaning:'Distribute across the bracket; the expression changes form, not value.'},
  sub2x:{short:'− 2x',title:'Subtract 2x from each side',kind:'addX',by:-2,meaning:'Remove two x terms from each side, preserving equality.'},
  sub2:{short:'− 2',title:'Subtract 2 from each side',kind:'add',by:-2,meaning:'Subtract two from both sides.'},
  sub3:{short:'− 3',title:'Subtract 3 from each side',kind:'add',by:-3,meaning:'Subtract three from both sides to remove the constant.'},
  sub4:{short:'− 4',title:'Subtract 4 from each side',kind:'add',by:-4,meaning:'Subtract four from each side.'},
  sub5:{short:'− 5',title:'Subtract 5 from each side',kind:'add',by:-5,meaning:'Subtract five from both sides.'},
  sub6:{short:'− 6',title:'Subtract 6 from each side',kind:'add',by:-6,meaning:'Subtract six from both sides.'},
  sub7:{short:'− 7',title:'Subtract 7 from each side',kind:'add',by:-7,meaning:'Subtract seven from both sides.'},
  div2:{short:'÷ 2',title:'Divide both sides by 2',kind:'divide',by:2,meaning:'Divide every term on both sides by two.'},
  div3:{short:'÷ 3',title:'Divide both sides by 3',kind:'divide',by:3,meaning:'Divide every term on both sides by three.'},
  div4:{short:'÷ 4',title:'Divide both sides by 4',kind:'divide',by:4,meaning:'Divide every term on both sides by four.'},
  mul3:{short:'× 3',title:'Multiply both sides by 3',kind:'multiply',by:3,meaning:'Multiply both sides by three to undo division by three.'},
  mul4:{short:'× 4',title:'Multiply both sides by 4',kind:'multiply',by:4,meaning:'Multiply both sides by four to undo division by four.'},
  add3:{short:'+ 3',title:'Add 3 to each side',kind:'add',by:3,meaning:'Adding three keeps equality, but does not isolate x here.'},
  add5:{short:'+ 5',title:'Add 5 to each side',kind:'add',by:5,meaning:'Adding five does not undo a positive five.'},
  div5:{short:'÷ 5',title:'Divide both sides by 5',kind:'divide',by:5,meaning:'Every term must be divided. This does not isolate x at this step.'}
};
const lessons={
 'Y7-033':{title:'One- and two-step equations',focus:'UNDO · KEEP EQUALITY',context:'Solve 3x + 5 = 20 by keeping both sides equal.',steps:['sub5','div3'],pool:['sub5','div3','add5','div5'],
  rows:[line('3x + 5','20',3,5,0,20),line('3x','15',3,0,0,15),line('x','5',1,0,0,5)],solution:5,
  teacher:['The equal sign is a promise: the two sides have the same value.','Subtract five from BOTH sides. The balance stays level.','Divide BOTH sides by three. The unknown is isolated.','Replace x with five to check the original equality.'],short:['Same value, both sides!','Take five off each!','Three equal parts!','Prove the answer!'],
  challenge:{rows:[line('4x + 7','31',4,7,0,31),line('4x','24',4,0,0,24),line('x','6',1,0,0,6)],steps:['sub7','div4'],pool:['sub7','div4','sub5','mul4'],solution:6,context:'4x + 7 = 31'}},
 'Y7-035':{title:'Equations from real contexts',focus:'FORM · UNDO · CHECK',context:'Two equal tickets and a £6 fee cost £18 in total.',steps:['sub6','div2'],pool:['sub6','div2','add3','div3'],
  rows:[line('2x + 6','18',2,6,0,18),line('2x','12',2,0,0,12),line('x','6',1,0,0,6)],solution:6,
  teacher:['Let x be the price of one ticket. Two tickets plus six pounds are eighteen.','Take away the fixed fee from BOTH sides.','Share the remaining twelve pounds into two equal parts.','Two tickets at six pounds each, plus the fee, makes eighteen.'],short:['Name the unknown!','Remove the fixed fee!','Share equally!','Check the total!'],
  challenge:{rows:[line('3x + 4','22',3,4,0,22),line('3x','18',3,0,0,18),line('x','6',1,0,0,6)],steps:['sub4','div3'],pool:['sub4','div3','add3','mul3'],solution:6,context:'Three items plus a £4 fee cost £22.'}},
 'Y8-013':{title:'Equations with brackets',focus:'EXPAND · BALANCE · SOLVE',context:'Expand the bracket first, then solve the equation.',steps:['expand','sub6','div2'],pool:['expand','sub6','div2','add3','div3'],
  rows:[line('2(x + 3)','18',2,6,0,18),line('2x + 6','18',2,6,0,18),line('2x','12',2,0,0,12),line('x','6',1,0,0,6)],solution:6,
  teacher:['The bracket means two groups of x plus three. Every part is multiplied.','Expand the bracket. Both forms have exactly the same value.','Now subtract six from BOTH sides to remove the constant.','Divide BOTH sides by two, then check the original bracket.'],short:['Every term is multiplied!','Same expression, expanded!','Take away six each!','Isolate x!'],
  challenge:{rows:[line('3(x + 2)','24',3,6,0,24),line('3x + 6','24',3,6,0,24),line('3x','18',3,0,0,18),line('x','6',1,0,0,6)],steps:['expand','sub6','div3'],pool:['expand','sub6','div3','add3','mul3'],solution:6,context:'3(x + 2) = 24'}},
 'Y8-014':{title:'Unknowns on both sides',focus:'COLLECT x · BALANCE · SOLVE',context:'First remove the smaller x term from both sides.',steps:['sub2x','sub3','div3'],pool:['sub2x','sub3','div3','add3','div5'],
  rows:[line('5x + 3','2x + 21',5,3,2,21),line('3x + 3','21',3,3,0,21),line('3x','18',3,0,0,18),line('x','6',1,0,0,6)],solution:6,
  teacher:['There are x terms on both sides. Remove the smaller group of x first.','Subtract two x from BOTH sides, not just from one.','Subtract three from each side to clear the remaining constant.','Divide both sides by three. Check x is six in the original equation.'],short:['Compare the x groups!','Take two x from each!','Remove the constant!','Divide into three!'],
  challenge:{rows:[line('6x + 5','2x + 29',6,5,2,29),line('4x + 5','29',4,5,0,29),line('4x','24',4,0,0,24),line('x','6',1,0,0,6)],steps:['sub2x','sub5','div4'],pool:['sub2x','sub5','div4','add5','div3'],solution:6,context:'6x + 5 = 2x + 29'}},
 'Y8-015':{title:'Equations with fractions',focus:'CLEAR · MULTIPLY · VERIFY',context:'A third of x plus two is seven.',steps:['sub2','mul3'],pool:['sub2','mul3','div3','add3'],
  rows:[line('\\frac{x}{3} + 2','7',1/3,2,0,7),line('\\frac{x}{3}','5',1/3,0,0,5),line('x','15',1,0,0,15)],solution:15,
  teacher:['The stacked fraction means x divided by three. Keep the full equation balanced.','Subtract two from BOTH sides first. That leaves one third of x.','Multiply BOTH sides by three to undo the division.','Fifteen divided by three plus two equals seven.'],short:['Read one third of x!','Undo plus two!','Multiply by three!','Check the fraction!'],
  challenge:{rows:[line('\\frac{x}{4} + 3','8',.25,3,0,8),line('\\frac{x}{4}','5',.25,0,0,5),line('x','20',1,0,0,20)],steps:['sub3','mul4'],pool:['sub3','mul4','div4','add3'],solution:20,context:'x divided by 4, then add 3, gives 8.'}}
};
const lessonIds=Object.keys(lessons);const STEPS=[
 {name:'Notice the balance',prompt:'Why must both sides stay equal?',narration:'Both sides of the equation must always represent the same value.'},
 {name:'Choose the first change',prompt:'What is the first valid transformation?',narration:'Choose an operation that keeps equality.'},
 {name:'Show the next equation',prompt:'How does the equation change?',narration:'Apply the same operation to both sides of the equation.'},
 {name:'Isolate the unknown',prompt:'What must be done next?',narration:'Keep working until x is alone.'},
 {name:'Read the solution',prompt:'What value makes the original equation true?',narration:'The solution makes both sides equal.'},
 {name:'Substitute to verify',prompt:'How can we prove the solution?',narration:'Substitute the solution back into the original equation to check.'}
];
let active={preset:'Y7-033',mode:'guided',phase:0};
const close=(a,b)=>Math.abs(a-b)<1e-9;
function equationValue(r,x){return [r.a*x+r.b,r.c*x+r.d];}
function resultFor(r){return (r.d-r.b)/(r.a-r.c);}
function sameEquation(a,b){return close(a.a,b.a)&&close(a.b,b.b)&&close(a.c,b.c)&&close(a.d,b.d);}
function nextState(r,key){const o=operations[key];if(!o)return null;switch(o.kind){
 case 'expand':return {...r};
 case 'add':return {...r,b:r.b+o.by,d:r.d+o.by};
 case 'addX':return {...r,a:r.a+o.by,c:r.c+o.by};
 case 'divide':return {...r,a:r.a/o.by,b:r.b/o.by,c:r.c/o.by,d:r.d/o.by};
 case 'multiply':return {...r,a:r.a*o.by,b:r.b*o.by,c:r.c*o.by,d:r.d*o.by};
 default:return null;
 }}
function validateTrack(p,challenge=false){const q=challenge?p.challenge:p;return q.steps.every((key,i)=>sameEquation(nextState(q.rows[i],key),q.rows[i+1])) && q.rows.every(r=>{const v=equationValue(r,q.solution);return close(v[0],v[1])&&close(resultFor(r),q.solution);});}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F8-05 event '+key);N.events.emit('value',{engine:ID,key,value});}
function view(){return innerWidth<=760?{
 m:true,w:440,h:1110,upper:{left:[18,150,182,113],right:[240,150,182,113]},balY:287,targets:{x:147,y:322,w:146,h:64},rowsY: [422,515,608,701],rowX:20,rowW:400,rowH:82,proof:{x:20,y:809,w:400,h:91},tray:{y:940,w:102,h:48,gap:4},remove:{x:23,y:1061,w:394,h:43},math:26
 }:{m:false,w:1080,h:840,upper:{left:[70,105,430,147],right:[580,105,430,147]},balY:286,targets:{x:434,y:315,w:215,h:65},rowsY:[398,485,572,659],rowX:70,rowW:940,rowH:74,proof:{x:70,y:752,w:940,h:70},tray:{y:34,w:135,h:49,gap:11},remove:{x:863,y:308,w:165,h:52},math:35};}
function txt(root,x,y,str,role='given',size=27,anchor='middle'){const t=N.chalkText(root,x,y,String(str),{role,size,anchor});t.setAttribute('text-anchor',anchor);return t;}
function glass(root,x,y,w,h,role='given',r=17){return N.neonBox(root,x,y,w,h,{role,r});}
function segment(root,x1,y1,x2,y2,role='given',width=3){return N.neonLine(root,x1,y1,x2,y2,{role,width});}
function math(root,x,y,expr,role='given',font=28,anchor='middle'){
 const value=String(expr),pat=/\\frac\{([^{}]+)\}\{([^{}]+)\}/;const m=pat.exec(value);
 if(!m)return txt(root,x,y,value,role,font,anchor);
 const pre=value.slice(0,m.index),post=value.slice(m.index+m[0].length);const prefix=pre.length*font*.57,suffix=post.length*font*.56;
 const fw=Math.max(46,Math.max(m[1].length,m[2].length)*font*.65+12),total=prefix+fw+suffix+15;
 let cursor=anchor==='middle'?x-total/2:anchor==='end'?x-total:x;
 if(pre){txt(root,cursor,y,pre,role,font,'start');cursor+=prefix;}
 txt(root,cursor+fw/2,y-font*.40,m[1],role,font*.78,'middle');
 segment(root,cursor+3,y-font*.16,cursor+fw-3,y-font*.16,role,2.2);
 txt(root,cursor+fw/2,y+font*.56,m[2],role,font*.78,'middle');cursor+=fw+12;
 if(post)txt(root,cursor,y,post,role,font*.94,'start');
}
function pickable(g,label,act){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',label);g.classList.add('f805-pickable');g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});g.addEventListener('click',e=>{if(!e.detail||e.detail>=1)act();});}
function repairCapture(el){el.addEventListener('pointerdown',e=>{try{el.setPointerCapture(e.pointerId)}catch(_){}});}
function draw(stage,opts){const q=lessons[opts.preset||active.preset],path=opts.challenge?q.challenge:q,mode=opts.mode||active.mode,challenge=mode==='challenge',interact=challenge||mode==='explore',n=path.steps.length,V=view();
 let completed=Math.max(0,Math.min(opts.progress??0,n)),shown=completed;
 // Stage layout follows the actual number of justified working lines; no fixed empty band.
 V.proof.y=V.rowsY[n]+V.rowH+13;
 if(V.m){
   if(interact){V.tray.y=V.proof.y+V.proof.h+32;V.remove.y=V.tray.y+(path.pool.length>4?115:85);V.h=V.remove.y+V.remove.h+21;}
   else V.h=V.proof.y+V.proof.h+18;
 }else{V.h=interact?Math.max(805,V.proof.y+V.proof.h+18):V.proof.y+V.proof.h+18;}
 stage.innerHTML='';stage.classList.add('f805-stage');N.cap(stage,'F8-05 · EQUATION BALANCE',challenge?'CHALLENGE THE METHOD':interact?'TRY AN OPERATION':'KEEP BOTH SIDES EQUAL');
 const svg=N.svg.root(V.w,V.h,'An algebra equation balance with both sides and a step-by-step equivalent working column.');svg.classList.add('f805-svg');svg.setAttribute('data-preset',opts.preset||active.preset);svg.setAttribute('data-mode',mode);svg.setAttribute('data-step-count',String(completed));svg.setAttribute('data-maths-correct',String(validateTrack(q,challenge)));
 const current=path.rows[completed],lhs=V.upper.left,rhs=V.upper.right;
 txt(svg,V.w/2,36,challenge?'SOLVE THE EQUATION':'EQUAL CHANGES · EQUAL VALUES','support',V.m?20:22);
 // A genuine visible balance beam; no extra decorative dark frame around the whole diagram.
 segment(svg,V.m?28:82,V.balY,V.m?410:995,V.balY,'given',V.m?5:7);
 N.neonPath(svg,`M ${V.w/2-33} ${V.balY+20} L ${V.w/2} ${V.balY+3} L ${V.w/2+33} ${V.balY+20} Z`,{role:'support',width:3,fill:'rgba(27,53,86,.6)'});
 [lhs,rhs].forEach((b,j)=>{glass(svg,...b,j===0?'given':'op',20);const [x,y,w,h]=b;txt(svg,x+w/2,y+28,j===0?'LEFT SIDE':'RIGHT SIDE','support',V.m?21:20);const display=challenge&&completed===n&&!opts.solved&&j===1?'?':j===0?current.L:current.R;math(svg,x+w/2,y+87,display,j===0?'given':'op',V.m?(String(display).length>13?23:28):String(display).length>14?30:40);});
 glass(svg,V.w/2-(V.m?24:30),V.m?191:161,V.m?48:60,V.m?45:58,'result',15);txt(svg,V.w/2,V.m?224:203,'=','result',V.m?30:42);
 // Keep the fulcrum visually unobstructed; the neon drop socket below is the shared both-sides target.
 glass(svg,V.targets.x,V.targets.y,V.targets.w,V.targets.h,interact?'focus':'support',15);
 const opLabel=completed>0?operations[path.steps[completed-1]].short:interact?'DROP OPERATION':'STEP BY STEP';
 txt(svg,V.targets.x+V.targets.w/2,V.targets.y+V.targets.h*.69,opLabel,completed>0?'result':'unknown',V.m?23:26);
 if(completed>0&&path.steps[completed-1]!=='expand'){
  txt(svg,V.m?47:170,V.targets.y+V.targets.h*.73,'BOTH','focus',V.m?21:20);
  txt(svg,V.m?389:915,V.targets.y+V.targets.h*.73,'BOTH','focus',V.m?21:20);
 }
 // Working cards connect each valid equivalent equation. In Challenge the final unknown stays hidden.
 const positions=V.rowsY,rows=path.rows;
 rows.forEach((r,i)=>{
  const y=positions[i],seen=i<=shown,activeRow=i===shown,canSee=seen && !(challenge && i===n&&!opts.solved),role=seen?(activeRow?'focus':i===n?'result':'given'):'support';
  const cg=glass(svg,V.rowX,y,V.rowW,V.rowH,role,14);cg.setAttribute('data-working-line',String(i));cg.setAttribute('data-revealed',String(seen));
  txt(svg,V.rowX+23,y+31,String(i+1).padStart(2,'0'),seen?'given':'support',V.m?19:22,'start');
  let f=V.m?22:32;
  if(seen){
   const leftText=challenge&&i===n&&!opts.solved?'x':r.L,rightText=challenge&&i===n&&!opts.solved?'?':r.R;
   const lx=V.m?V.rowX+145:V.rowX+320,rx=V.m?V.rowX+305:V.rowX+695;
   math(svg,lx,y+(V.m?51:49),leftText,'given',f,'middle');
   txt(svg,V.rowX+V.rowW/2,y+(V.m?53:51),'=','result',V.m?24:29);
   math(svg,rx,y+(V.m?51:49),rightText,i===n&&opts.solved?'result':'op',f,'middle');
   if(i>0){const op=operations[path.steps[i-1]].short;txt(svg,V.rowX+V.rowW-(V.m?15:24),y+26,op,'support',V.m?21:20,'end');}
  }else{txt(svg,V.rowX+V.rowW/2,y+52,i===shown+1?'?  NEXT EQUIVALENT LINE':'· · ·','unknown',V.m?20:25);}
 });
 const [px,py,pw,ph]=[V.proof.x,V.proof.y,V.proof.w,V.proof.h];glass(svg,px,py,pw,ph,'support',12);
 const shortProof={sub2:'SUBTRACT TWO FROM BOTH SIDES',expand:'EXPAND THE WHOLE BRACKET',sub2x:'REMOVE TWO x FROM BOTH SIDES',sub3:'SUBTRACT THREE FROM BOTH SIDES',sub4:'SUBTRACT FOUR FROM BOTH SIDES',sub5:'SUBTRACT FIVE FROM BOTH SIDES',sub6:'SUBTRACT SIX FROM BOTH SIDES',sub7:'SUBTRACT SEVEN FROM BOTH SIDES',div2:'DIVIDE BOTH SIDES BY TWO',div3:'DIVIDE BOTH SIDES BY THREE',div4:'DIVIDE BOTH SIDES BY FOUR',mul3:'MULTIPLY BOTH SIDES BY THREE',mul4:'MULTIPLY BOTH SIDES BY FOUR'};
 const proof=challenge?(opts.solved?'SOLUTION VERIFIED':'CHOOSE A VALID TRANSFORMATION'):mode==='explore'?(completed===n?'NOW SUBSTITUTE TO CHECK':'SAME CHANGE TO BOTH SIDES'):completed===0?'KEEP BOTH SIDES EQUAL':completed===n?'SUBSTITUTE TO CHECK':shortProof[path.steps[completed-1]];
 txt(svg,px+pw/2,py+(V.m?37:39),proof,'support',V.m?21:(proof.length>48?18:21));
 if(!challenge && completed===n){const a=equationValue(path.rows[0],path.solution);txt(svg,px+pw/2,py+(V.m?70:64),`CHECK · ${a[0]} = ${a[1]}`,'result',V.m?21:24);}
 // A compact F2-style palette of real operation tiles: target highlights; return tray removes the latest.
 if(interact){
  const pool=path.pool,tw=V.tray.w,th=V.tray.h,positions2=pool.map((key,i)=>({key,x:V.m?16+(i%4)*(tw+V.tray.gap):65+i*(tw+V.tray.gap),y:V.m?V.tray.y+Math.floor(i/4)*54:V.tray.y}));
  positions2.forEach(({key,x,y})=>{const g=E('g',{'data-op-card':key},svg);glass(g,x,y,tw,th,'op',11);txt(g,x+tw/2,y+th*.68,operations[key].short,'given',V.m?20:23);
    pickable(g,operations[key].title+'; press Enter to apply the next step.',()=>opts.onChoose&&opts.onChoose(key));
    N.ui.svgDrag(svg,g,{box:{x,y,w:tw,h:th},zones:()=>[{id:'apply',kind:'drop',...V.targets},{id:'return',kind:'remove',...V.remove}],onDrop:where=>{if(where==='apply')return !!(opts.onChoose&&opts.onChoose(key));return false;},onRemove:()=>{}});repairCapture(g);
  });
  glass(svg,...[V.remove.x,V.remove.y,V.remove.w,V.remove.h],'focus',10);
  txt(svg,V.remove.x+V.remove.w/2,V.remove.y+V.remove.h*.72,'RETURN / UNDO','focus',V.m?19:19);
  if(completed>0){const k=path.steps[completed-1],g=E('g',{'data-placed-operation':k},svg);glass(g,V.targets.x,V.targets.y,V.targets.w,V.targets.h,'result',15);txt(g,V.targets.x+V.targets.w/2,V.targets.y+V.targets.h*.68,operations[k].short,'result',V.m?23:28);
   pickable(g,'Undo '+operations[k].title+'; press Enter or Delete to return.',()=>opts.onUndo&&opts.onUndo());g.addEventListener('keydown',ev=>{if(ev.key==='Backspace'||ev.key==='Delete'){ev.preventDefault();opts.onUndo&&opts.onUndo();}});
   N.ui.svgDrag(svg,g,{box:V.targets,zones:()=>[{id:'return',kind:'remove',...V.remove}],onRemove:()=>opts.onUndo&&opts.onUndo()});repairCapture(g);
  }
 }
 stage.appendChild(svg);
 const idx=Math.min(3,opts.phase??completed);const say=challenge?(opts.solved?'You kept the balance!':opts.feedbackBad?'Check BOTH sides.':'Which operation preserves equality?'):mode==='explore'?(completed===n?'Substitute to prove it!':opts.feedbackBad?'Try the inverse step!':'Make the same change!'):q.short[idx];
 N.scene.helperStrip(stage,opts.solved?'celebrate':opts.feedbackBad?'not-yet':['explain','point-down','count','celebrate'][idx],say);
 const div=H('div',{class:'f805-proof'});div.appendChild(H('strong',{text:challenge?'Reason carefully':mode==='explore'?'Mathematical evidence':'Sir Bob explains'}));
 div.appendChild(H('span',{text:challenge?'A valid algebraic transformation preserves equality. The final value remains hidden until you check it.':mode==='explore'?completed===0?'Start by selecting a valid inverse operation.':'Every completed line is algebraically equivalent to the starting equation.':q.teacher[Math.min(idx,3)]}));stage.appendChild(div);
 if(challenge&&N.helperImg){const im=N.helperImg(opts.solved?'victory':'think','teen');const row=H('div',{class:'f805-peer','aria-label':'Izaac, challenge peer'});row.appendChild(H('span',{text:opts.solved?'Izaac · That checks out!':'Izaac · Show your method.'}));row.appendChild(H('img',{src:im.src,alt:im.alt,width:64,height:64}));stage.appendChild(row);}
 if(!interact&&completed>0&&N.motion&&!N.reducedMotion()&&svg.isConnected){N.motion.flash(svg,V.w/2,V.balY-38,'result',40);}
 return svg;
}
function spec(){return {purpose:'Show how equivalent linear equations preserve equality when an operation is applied to both sides.',params:'Linear equation coefficients, initial context, named transformations, explanation, target solution and solution check.',presets:'Y7-033, Y7-035, Y8-013, Y8-014, Y8-015; each has a separate Challenge equation.',steps:'Notice equality → apply a correct change → display a new equivalent line → isolate x → check the original.',interactions:'Apply neon operation cards to both sides, undo via return tray, Enter/Delete keyboard equivalent and Challenge solution entry.',traps:'One-sided operations; incorrect inverse; treating bracket expansion as only the first term; failing to remove both x terms; dividing instead of multiplying a fraction.',gcse:'Extendable to unknowns both sides with negative coefficients and more complex fractional equations.',linked:C.references};}
function narration(i){const p=lessons[active.preset];return p.teacher[Math.min(3,i)];}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:'Y7-033'},steps:STEPS.map((item,i)=>Object.defineProperty({...item},'narration',{get:()=>narration(i),enumerable:true})),
 alt:'Neon balance beam with mathematical expressions on either side and a worked-equation column beneath.',staticAlt:'Perform the same operation on both sides of an equation. Keep equality through every transformation, then substitute to check.',
 render(i,stage){active.phase=i;const p=lessons[active.preset];draw(stage,{preset:active.preset,mode:active.mode,phase:i,progress:i===0?0:Math.min(p.steps.length,i)});},
 exploreIntro:'Choose a lesson and apply transformations to both sides of the equation.',
 explore(panel,stage,api){active.mode='explore';let preset=active.preset,progress=0,warning='',wrong=false;const tools=H('div',{class:'f805-tools'}),choices=H('div',{class:'f805-choices','aria-label':'Tap an operation instead of dragging'}),sel=H('select',{class:'f805-select','aria-label':'Choose equation preset'}),undo=H('button',{class:'nova-btn',text:'Undo last operation'}),reset=H('button',{class:'nova-btn ghost',text:'Reset equation'}),fb=H('div',{class:'f805-feedback','aria-live':'polite'});
 lessonIds.forEach(id=>sel.appendChild(H('option',{value:id,text:id+' · '+lessons[id].title})));sel.value=preset;
 function refresh(msg='',bad=false){active.preset=preset;wrong=bad;draw(stage,{preset,progress,mode:'explore',feedbackBad:wrong,onChoose:choose,onUndo:back});choices.replaceChildren();lessons[preset].pool.forEach(key=>choices.appendChild(H('button',{class:'nova-btn f805-op-button',text:operations[key].short,'aria-label':operations[key].title,onclick:()=>choose(key)})));fb.textContent=msg||'Choose an operation, drag it onto BOTH SIDES or press Enter.';fb.dataset.status=bad?'wrong':progress===lessons[preset].steps.length?'correct':'';}
 function choose(key){const p=lessons[preset],want=p.steps[progress];if(!want){refresh('All transformations are complete. Check your solution in the original equation.',false);return false;}
 if(key!==want){const msg=key==='expand'&&want!=='expand'?'Expanding is appropriate only when there is a bracket to expand.':want==='expand'?'Expand every term in the bracket before applying inverse operations.':key==='sub2x'?'Subtract x terms only when the equation has unknowns on both sides.':key.startsWith('div')&&want.startsWith('mul')?'A fraction means division: multiply both sides to undo it.': 'That operation keeps equality, but it does not correctly isolate x at this step. '+operations[want].meaning;refresh(msg,true);return false;}
 progress++;emit('operation',{preset,operation:key,progress});refresh('Correct. '+operations[key].meaning,false);return true;}
 function back(){if(progress>0){progress--;emit('undo',{preset,progress});refresh('Last operation returned. The previous equivalent equation is restored.');}}
 sel.onchange=()=>{preset=sel.value;progress=0;emit('preset',preset);refresh();};undo.onclick=back;reset.onclick=()=>{progress=0;emit('reset',preset);refresh();};
 tools.appendChild(sel);tools.appendChild(undo);tools.appendChild(reset);panel.appendChild(tools);panel.appendChild(choices);panel.appendChild(fb);refresh();},
 challengeIntro:'Prove the transformation sequence, solve for x and check the original equation.',
 challenge(panel,api,stage){active.mode='challenge';let task=0,progress=0,solved=false,wrong=0,bad=false;const head=H('div',{class:'f805-ch-head'}),row=H('div',{class:'f805-ch-row'}),choices=H('div',{class:'f805-choices','aria-label':'Tap an operation instead of dragging'}),field=H('input',{type:'number',class:'f805-answer',inputmode:'decimal','aria-label':'Your solution for x',placeholder:'x = ?'}),check=H('button',{class:'nova-btn primary',text:'Check solution'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),undo=H('button',{class:'nova-btn',text:'Undo'}),next=H('button',{class:'nova-btn',text:'Next equation'}),fb=H('div',{class:'f805-feedback','aria-live':'polite'});
 const p=()=>lessons[lessonIds[task]];function refresh(msg='',status=''){head.textContent='Challenge '+(task+1)+' of '+lessonIds.length+' · '+p().title;active.preset=lessonIds[task];draw(stage,{preset:active.preset,mode:'challenge',challenge:true,solved,progress,feedbackBad:status==='wrong',onChoose:choose,onUndo:back});choices.replaceChildren();p().challenge.pool.forEach(key=>{const b=H('button',{class:'nova-btn f805-op-button',text:operations[key].short,'aria-label':operations[key].title,onclick:()=>choose(key)});b.disabled=solved;choices.appendChild(b);});check.disabled=solved||progress!==p().challenge.steps.length;field.disabled=solved;next.hidden=!solved;next.style.display=solved?'':'none';fb.textContent=msg||'Apply the valid operations to both sides before entering your value for x.';fb.dataset.status=status;}
 function mistake(key){const want=p().challenge.steps[progress];return want==='expand'?'Expand the ENTIRE bracket before you subtract or divide.':want==='sub2x'?'Unknowns appear on both sides. Take the same x terms from each side.':want.startsWith('mul')?'The unknown is divided by a number, so multiply both sides to isolate it.':key.startsWith('div')?'You cannot divide first while a constant is still added.':'Try undoing the added constant before dividing the coefficient.';}
 function choose(key){if(solved)return false;const want=p().challenge.steps[progress];if(key!==want){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'operation',operation:key,task});refresh('Not yet. '+mistake(key),'wrong');return false;}progress++;emit('challengeStep',{task,operation:key,progress});refresh('Correct transformation: '+operations[key].meaning,'correct');return true;}
 function back(){if(progress>0&&!solved){progress--;emit('undo',{task,progress});refresh('Last operation returned.');}}
 check.onclick=()=>{if(solved)return;const value=field.value.trim(),guess=Number(value);if(progress!==p().challenge.steps.length){refresh('Finish the transformations before checking.','wrong');return;}
 if(!value||!Number.isFinite(guess)||!close(guess,p().challenge.solution)){wrong++;N.events.emit('correct',{engine:ID,correct:false,reason:'solution',task});refresh('Not yet. Substitute your value for x into BOTH sides of the original equation.','wrong');return;}
 solved=true;emit('solution',{task,x:guess});N.events.emit('correct',{engine:ID,correct:true,task,solution:guess});refresh('Correct. The same value is obtained on both sides of the original equation.','correct');};
 hint.onclick=()=>{const want=p().challenge.steps[Math.min(progress,p().challenge.steps.length-1)];api.hint('Look for the next inverse operation. '+operations[want].meaning);};
 undo.onclick=back;next.onclick=()=>{if(!solved)return;if(task<lessonIds.length-1){task++;progress=0;solved=false;field.value='';refresh();}else{next.disabled=true;next.style.display='none';fb.textContent='All five equation families completed. Incorrect attempts corrected: '+wrong+'.';}};
 row.appendChild(field);row.appendChild(check);row.appendChild(hint);row.appendChild(undo);row.appendChild(next);panel.appendChild(head);panel.appendChild(row);panel.appendChild(choices);panel.appendChild(fb);refresh();}
};
N.events.on('mode',ev=>{const d=ev.detail||{};if(d.engine===ID)active.mode=d.mode;});
if(N.registry)N.registry.add({id:ID,title:C.title,kind:'engine',topics:['algebra','equations'],deps:C.references,events:['value','correct','step','hintUsed']});
const engine=N.bankMount({id:ID,num:'05',title:C.title,spec:spec(),years:'KS3 Years 7–9',linked:C.references,def:DEF});
window.F805_ENGINE=engine;
window.F805_TEST={operations,lessons,nextState,resultFor,equationValue,validateTrack,sameEquation,close,config:C,setMode:engine.setMode,state:()=>({...active})};
})();
