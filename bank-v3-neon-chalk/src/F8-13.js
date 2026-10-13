/* F8-13 PREMIUM PRESET VIEW. Production: patch the existing F3-10 source using build/extend-f3-10.py.
   Standalone review wrapper shows the same F3-10 mathematical factor model with an algebraic preset view.
   Do not register this wrapper as a second production engine. */
window.F813_CONFIG={id:'F8-13',engine:'F3-10',kind:'preset-preview',startMode:'guided',preset:'Y8-002-M1',events:{value:['preset','law','join','cancel','group','undo','reset','check','attempt','drop','step'],types:['step','correct','hintUsed','mode']},parameters:{symbols:['a','b','x','y','m','p'],maxVisualFactors:8},links:['F0-02','F0-04','F0-05','F3-10','F3-09']};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.F813_CONFIG,ID=C.id;
const P={
 'Y8-002-M1':{lesson:'Y8-002',label:'Multiply · a³ × a²',kind:'multiply',base:'a',m:3,n:2},
 'Y8-002-D1':{lesson:'Y8-002',label:'Divide · b⁵ ÷ b²',kind:'divide',base:'b',m:5,n:2},
 'Y8-002-P1':{lesson:'Y8-002',label:'Power · (x²)³',kind:'power',base:'x',m:2,n:3},
 'Y8-002-M2':{lesson:'Y8-002',label:'Multiply · y² × y⁴',kind:'multiply',base:'y',m:2,n:4},
 'Y8-002-D2':{lesson:'Y8-002',label:'Divide · p⁶ ÷ p³',kind:'divide',base:'p',m:6,n:3},
 'Y8-002-P2':{lesson:'Y8-002',label:'Power · (m³)²',kind:'power',base:'m',m:3,n:2}
};const ORDER=Object.keys(P);
const STEPS=['Meet the same base','Expand the first power','Expand the second power','Join, cancel or repeat','Count the factor evidence','Write the resulting index'];
let modeState={mode:'guided',preset:ORDER[0],step:0};
function exponent(p){return p.kind==='multiply'?p.m+p.n:p.kind==='divide'?p.m-p.n:p.m*p.n}
function law(p){return p.kind==='multiply'?'ADD THE INDICES':p.kind==='divide'?'SUBTRACT THE INDICES':'MULTIPLY THE INDICES'}
function operation(p){return p.kind==='multiply'?'JOIN':p.kind==='divide'?'CANCEL':'GROUP'}
function expression(p,answer=false){const b=p.base;if(answer)return `${b}⁽${exponent(p)}⁾`;
 return p.kind==='multiply'?`${b}${su(p.m)} × ${b}${su(p.n)}`:p.kind==='divide'?`${b}${su(p.m)} ÷ ${b}${su(p.n)}`:`(${b}${su(p.m)})${su(p.n)}`}
function su(i){return String(i).replace(/\d/g,ch=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(ch)])}
function teaching(p){let b=p.base;if(p.kind==='multiply')return [`Both powers have the same base ${b}.`,`Expand ${b} to the power of ${p.m}: ${p.m} factors.`,`Expand the second power: ${p.n} more factors of ${b}.`,`Joining the strips keeps every factor.`,`There are ${p.m} plus ${p.n} factors: ${exponent(p)} in total.`,`Keep the base ${b}; the new index is ${exponent(p)}.`];
 if(p.kind==='divide')return [`Both powers have the same base ${b}. ${b} cannot be zero.`,`Expand ${p.m} factors of ${b} in the numerator.`,`Expand ${p.n} factors of ${b} in the denominator.`,`Cancel ${p.n} matching non-zero factors.`,`There are ${p.m} minus ${p.n}: ${exponent(p)} factors left.`,`The result is ${b} to the power ${exponent(p)}.`];
 return [`A power is raised to another power.`,`Each group contains ${p.m} factors of ${b}.`,`There are ${p.n} such groups.`,`Repeat the group ${p.n} times.`,`Count ${p.m} times ${p.n}: ${exponent(p)} factors.`,`Keep the base ${b} and multiply the indices.`]}
function state(){return {progress:0,answer:'',wrong:false,solved:false,tries:0,history:[],message:'Drag the highlighted strip to the target or use the matching button.'}}
function needed(p){return p.kind==='multiply'?1:p.n}
function apply(p,s){if(s.solved||s.progress>=needed(p))return false;s.history.push(s.progress);s.progress++;s.message=s.progress>=needed(p)?'Structure complete. Count the remaining factors.':'Good. Continue the factor operation.';s.wrong=false;return true}
function undo(s){if(s.solved||!s.history.length)return false;s.progress=s.history.pop();s.wrong=false;s.message='Undone. Try another factor move.';return true}
function reset(s){Object.assign(s,state());return true}
function check(p,s,input){s.tries++;let v=String(input).trim();s.wrong=true;if(s.progress<needed(p))s.message='Finish the factor proof before checking the final index.';
 else if(!v)s.message='Enter the final index.';
 else if(!/^\d+$/.test(v))s.message='Enter the integer index, not an entire equation.';
 else if(Number(v)===exponent(p)){s.wrong=false;s.solved=true;s.message='Correct. The factor evidence proves '+p.base+' to the power '+exponent(p)+'.'}
 else if(p.kind==='multiply'&&Number(v)===p.m*p.n)s.message='That multiplies the indices. For matching bases that multiply, JOIN and ADD factors.';
 else if(p.kind==='divide'&&Number(v)===p.m+p.n)s.message='Division cancels matching non-zero factors. SUBTRACT indices.';
 else if(p.kind==='power'&&Number(v)===p.m+p.n)s.message='A power raised to a power repeats entire groups. MULTIPLY indices.';
 else if(p.kind==='divide'&&Number(v)===p.m/p.n)s.message='Cancel factor pairs. Do not divide the two indices.';
 else s.message='Recount the factor tiles and check the same-base rule.';
 return s.solved}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unknown '+key);N.events.emit('value',{engine:ID,key,value})}
function txt(p,x,y,t,role='given',size=28){return N.chalkText(p,x,y,String(t),{role,size})}
function tile(svg,x,y,w,h,t,role='op',size=32){const g=E('g',{'class':'f813-tile'},svg);N.neonBox(g,x,y,w,h,{role,r:11});txt(g,x+w/2,y+h/2+11,t,role,size);return g}
function lay(mob){return mob?{w:460,h:1000,titleY:58,formulaY:134,topY:266,botY:433,joinY:635,stripW:366,tile:49,gap:7,actionY:766,proofY:959,srcY:766,drop:{x:35,y:605,w:390,h:147},tray:{x:280,y:819,w:145,h:75}}:
 {w:1100,h:850,titleY:65,formulaY:145,topY:289,botY:448,joinY:627,stripW:790,tile:66,gap:12,actionY:714,proofY:818,srcY:714,drop:{x:175,y:590,w:755,h:115},tray:{x:870,y:721,w:180,h:73}}}
function strips(svg,p,G,step,s,interactive,done,cb){const visible=(i)=>interactive||step>=i;
 const count=(p.kind==='power'?p.m:p.m),other=(p.kind==='power'?p.m:p.n),factorTile=(base,x,y,role,size)=>tile(svg,x,y,size,size,base,role,Math.floor(size*.57));
 const factorRow=(num,y,role)=>{let ts=G.tile,g=G.gap,tot=num*ts+(num-1)*g,sx=G.w/2-tot/2;let arr=[];for(let i=0;i<num;i++)arr.push(factorTile(p.base,sx+i*(ts+g),y,role,ts));return arr};
 if(visible(1)){factorRow(count,G.topY,'op');txt(svg,G.w/2,G.topY-19,p.kind==='power'?'ONE COMPLETE GROUP':'FIRST POWER', 'support',G.w===460?19:23)}
 if(visible(2)){factorRow(other,G.botY,'focus');txt(svg,G.w/2,G.botY-19,p.kind==='power'?'REPEAT THIS GROUP':'SECOND POWER', 'support',G.w===460?19:23)}
 let prog=interactive?s.progress:(step<=2?0:step===3?Math.min(1,needed(p)):needed(p));let completed=prog>=needed(p);
 N.neonBox(svg,G.drop.x,G.drop.y,G.drop.w,G.drop.h,{role:completed?'result':'support',r:19});
 let disp='DRAG FACTORS HERE',evidence='';if(p.kind==='multiply'){evidence=`${p.m} + ${p.n} = ${exponent(p)} factors`;disp=completed?'JOINED FACTOR STRIP':'JOIN THE TWO FACTOR STRIPS'}else if(p.kind==='divide'){evidence=`${p.m} − ${p.n} = ${exponent(p)} left`;disp=completed?'MATCHING PAIRS CANCELLED':`${prog} of ${p.n} PAIRS CANCELLED`}else{evidence=`${p.m} × ${p.n} = ${exponent(p)} factors`;disp=completed?'EVERY GROUP INCLUDED':`${prog} of ${p.n} GROUPS INCLUDED`}
 txt(svg,G.w/2,G.joinY-3,disp,completed?'result':'given',G.w===460?22:27);
 if(completed){let no=Math.min(exponent(p),8),w=G.w===460?39:52,gap=G.w===460?5:9,total=no*w+(no-1)*gap,sx=G.w/2-total/2;for(let i=0;i<no;i++)tile(svg,sx+i*(w+gap),G.joinY+16,w,w,p.base,'result',Math.floor(w*.63));}
 else if(!interactive&&step>=3)txt(svg,G.w/2,G.joinY+42,'WATCH HOW THE FACTORS CHANGE','focus',G.w===460?18:25);
 let showEvidence=done||!interactive&&step>=4;
 txt(svg,G.w/2,done?G.proofY-72:G.proofY-1,showEvidence?evidence:'COUNT THE FACTORS TO PROVE THE LAW',showEvidence?'result':'support',G.w===460?22:30);
 if(interactive&&!done){N.neonBox(svg,G.tray.x,G.tray.y,G.tray.w,G.tray.h,{role:'error',r:13});txt(svg,G.tray.x+G.tray.w/2,G.tray.y+46,'RETURN', 'error',G.w===460?20:23);
  if(!completed){const drag=E('g',{'class':'f813-drag','data-f813-source':'1',role:'button',tabindex:0,'aria-label':'Drag factor strip into the highlighted target; press Enter to place it'},svg),n=Math.min(p.kind==='power'?p.m:p.n,3),w=G.w===460?44:52,tot=n*w+(n-1)*9,sx=G.w===460?34:103,y=G.actionY;for(let i=0;i<n;i++){N.neonBox(drag,sx+i*(w+9),y,w,w,{role:'focus',r:10});txt(drag,sx+i*(w+9)+w/2,y+w/2+10,p.base,'focus',26)}
    let label=G.w===460?'DRAG → TARGET':'DRAG THE HIGHLIGHTED FACTORS INTO THE PROOF';txt(svg,G.w/2,G.actionY-16,label,'focus',G.w===460?18:20);drag.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cb('advance')}});
    N.ui.svgDrag(svg,drag,{box:{x:sx-5,y:G.actionY-5,w:tot+10,h:w+10},zones:()=>[{id:'proof',kind:'drop',...G.drop},{id:'return',kind:'remove',...G.tray}],onDrop:()=>cb('advance'),onRemove:()=>cb('undo')});
  }else{const drag=E('g',{'class':'f813-drag','data-f813-undo':'1',role:'button',tabindex:0,'aria-label':'Return completed factor operation to the tray'},svg);N.neonBox(drag,42,G.actionY,128,58,{role:'focus',r:12});txt(drag,106,G.actionY+39,'UNDO','focus',25);drag.addEventListener('keydown',e=>{if(e.key==='Enter'){cb('undo')}});N.ui.svgDrag(svg,drag,{box:{x:42,y:G.actionY,w:128,h:58},zones:()=>[{id:'return',kind:'remove',...G.tray}],onRemove:()=>cb('undo')});}
 }
 return {progress:prog,complete:completed,evidence};}
function draw(stage,p,opt={}){stage.innerHTML='';const mob=innerWidth<=760,G=lay(mob),mode=opt.mode||'guided',interactive=mode==='explore'||mode==='challenge',s=opt.s||state(),step=opt.step??0,done=s.solved||!interactive&&step>=5,hidden=mode==='challenge'&&!s.solved;
 N.cap(stage,'F8-13','ALGEBRAIC INDEX LAWS',interactive?'BUILD A FACTOR PROOF':STEPS[step].toUpperCase());
 const svg=N.svg.root(G.w,G.h,'NOVA algebra index laws: same-base factor strips join, cancel, or repeat to justify resulting index.');svg.classList.add('f813-svg');svg.dataset.preset=Object.keys(P).find(k=>P[k]===p)||'';svg.dataset.mode=mode;svg.dataset.progress=s.progress;
 txt(svg,G.w/2,G.titleY,law(p),'op',mob?23:34);
 N.neonBox(svg,mob?25:235,G.formulaY-43,mob?410:630,97,{role:'given',r:18});txt(svg,G.w/2,G.formulaY+14,expression(p), 'given',mob?38:55);
 
 let proof=strips(svg,p,G,step,s,interactive,done,opt.action||(()=>{}));
 let show=done&&!hidden;let boxY=mob?953:814;
 if(show){N.neonRing(svg,mob?415:989,boxY-19,{role:'result',r:13});txt(svg,G.w/2,G.proofY-6,`RESULT · ${p.base}${su(exponent(p))}`,'result',mob?28:32)}
 stage.append(svg);
 const role=s.solved?'celebrate':s.wrong?'not-yet':interactive?'point-right':['explain','count','point-down','point-right','count','celebrate'][step];N.scene.helperStrip(stage,role,s.solved?'Index law proved!':s.wrong?'Check your factor count.':interactive?'Build the proof!':['Same base!','Expand the factors.','Show the next power.','Join or cancel.','Count what remains.','State the index.'][step]);
 const speak=interactive?(s.solved?'Every factor checks out. Keep the same base and use the correct index law.':`Prove why ${expression(p)} simplifies using factor groups and the ${p.kind==='divide'?'non-zero cancelling':'same-base'} rule.`):teaching(p)[step];
 stage.append(H('div',{class:'f813-teach'},[H('b',{text:'SIR BOB · '+(interactive?'FACTOR PROOF':'STAGE '+(step+1))}),H('span',{text:speak})]));
 if(mode==='challenge'&&N.helperImg){const im=N.helperImg(s.solved?'victory':'think','teen');stage.append(H('div',{class:'f813-peer'},[H('img',{src:im.src,alt:im.alt,width:48,height:48}),H('span',{text:s.solved?'Izaac · You proved the law.':'Izaac · Prove each exponent.'})]));}
 if(s.solved&&!N.reducedMotion()&&N.motion?.flash)N.motion.flash(svg,G.w/2,G.joinY,'result',22);
 return svg;}
function button(text,on,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:on})}
function interactive(mode,panel,api,stage){let ix=0,id=mode==='challenge'?ORDER[0]:modeState.preset,p=P[id],s=state(),ans='';let sel=H('select',{class:'f813-select','aria-label':'Choose index law preset'});for(let k of ORDER)sel.append(H('option',{value:k,text:P[k].label}));sel.value=id;
 const info=H('p',{class:'f813-info'}),controls=H('div',{class:'f813-controls'}),field=H('input',{type:'number',min:'0',step:'1','aria-label':'Resulting exponent',placeholder:'Resulting index'}),feedback=H('p',{class:'f813-feedback',role:'status','aria-live':'polite'}),task=H('p',{class:'f813-task'}),btnAct=button('Advance factor proof',()=>action('advance'),true),btnUndo=button('Undo',()=>action('undo')),btnReset=button('Reset',()=>action('reset')),btnHint=button('Hint',()=>action('hint')),btnCheck=button('Check index',()=>action('check'),true);
 const buttons=H('div',{class:'f813-controls'},[btnAct,btnUndo,btnReset,btnHint]);controls.append(H('label',{},['Preset ',sel]));if(mode==='explore')panel.append(controls);panel.append(task,buttons,H('div',{class:'f813-entry'},[H('label',{},['Resulting index ',field]),btnCheck]),info,feedback);
 sel.onchange=()=>{id=sel.value;p=P[id];s=state();field.value='';emit('preset',id);redraw()};field.oninput=()=>ans=field.value;
 function redraw(){p=P[id];sel.value=id;task.textContent=mode==='challenge'?(ix>=ORDER.length?'ALL SIX FACTOR PROOFS COMPLETED':'Challenge '+(ix+1)+' of '+ORDER.length+' · '+p.label):p.label+' · YEAR 8 INDEX LAWS';if(mode==='challenge'&&ix>=ORDER.length){buttons.style.display='none';panel.querySelector('.f813-entry').style.display='none';}else{buttons.style.display='flex';panel.querySelector('.f813-entry').style.display='flex';}btnAct.textContent=(p.kind==='multiply'?'Join strips':p.kind==='divide'?'Cancel factor pair':'Add factor group')+' · '+s.progress+'/'+needed(p);btnAct.disabled=s.solved||s.progress>=needed(p);btnUndo.disabled=s.solved||!s.history.length;btnCheck.disabled=s.solved;info.textContent=s.solved?'Proof checked and recorded.':s.progress>=needed(p)?'Factor proof ready. Enter the resulting index.':'Complete the factor proof before checking the index.';feedback.textContent=s.message;feedback.dataset.status=s.solved?'correct':s.wrong?'wrong':'neutral';draw(stage,p,{mode,s,action})}
 function action(a){if(a==='advance'){if(apply(p,s))emit(p.kind==='multiply'?'join':p.kind==='divide'?'cancel':'group',s.progress)}else if(a==='undo'){if(undo(s))emit('undo',s.progress)}else if(a==='reset'){reset(s);field.value='';ans='';emit('reset',id)}else if(a==='hint'){api?.hint('Expand each power into factors; '+(p.kind==='multiply'?'join the strips.':p.kind==='divide'?'cancel the pairs.':'repeat the groups.'));s.message='Look at the factor tiles, not only the superscripts.'}else if(a==='check'){let ok=check(p,s,field.value);emit('check',{preset:id,correct:ok,attempt:s.tries});if(api?.check)api.check(ok,s.message,{preset:id});if(ok&&mode==='challenge'){ix++;if(ix<ORDER.length){id=ORDER[ix];s=state();field.value='';ans='';}}}
 redraw()}
 redraw();return {action,read:()=>({preset:id,...s}),choose:(key)=>{id=key;s=state();field.value='';redraw()},input:field};}
const BEATS=STEPS.map((name,i)=>({name,narration:teaching(P[ORDER[0]])[i],caption:name}));
const DEF={id:ID,title:'Index Laws in Algebra · F3-10 Preset Preview',config:{startMode:'guided',preset:ORDER[0]},steps:BEATS,alt:'Expanded algebraic factor strips show multiplication as joining factors, division as cancellation, and a power of a power as repeated groups.',staticAlt:'Same-base multiplication adds indices, division subtracts indices if the base is nonzero, and a power raised to a power multiplies indices.',render(i,stage){modeState.step=i;draw(stage,P[modeState.preset],{mode:'guided',step:i})},exploreIntro:'Change the algebraic factor law and build each proof using the same NOVA factor model.',explore(panel,stage){interactive('explore',panel,null,stage)},challenge(panel,api,stage){interactive('challenge',panel,api,stage)},onRestore(){}};
N.events.on('mode',ev=>{let d=ev.detail||{};if(d.engine===ID)modeState.mode=d.mode});
N.registry?.add({id:ID,title:DEF.title,kind:'preset-preview',topics:['index laws','algebra','same-base factors'],deps:C.links});
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(d?.el?.classList?.contains('f813-drag'))queueMicrotask(()=>{if(N.ui._drag===d)d.up(ev)})},true);
const mount=N.bankMount({id:ID,num:'13',title:'Algebraic Index Laws · F3-10 Preset',years:'Year 8 / GCSE extension',linked:C.links,def:DEF,spec:{purpose:'Algebraic presentation presets of the established F3-10 factor-strip index animator.',params:'Same algebraic base; 1–6 first and second indices, 8 maximum on-screen result factor tiles.',presets:'Six Year 8 examples: multiply, divide, and power-of-power with letters.',steps:'Meet base → expand strips → join/cancel/group → count → write index.',interactions:'Drag factors, keyboard placement, Undo, Reset; Challenge checks factor proof and resulting exponent.',traps:'Do not multiply exponents during same-base multiplication; do not add exponents during division; division requires a non-zero base.',gcse:'Zero/negative indices and further algebraic power laws require separate presets.'}});
window.F813_TEST={presets:P,exponent,law,state,apply,undo,reset,check,draw,setMode:mount.setMode,needed};
})();
