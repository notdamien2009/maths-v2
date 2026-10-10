/* F3-10 Index Law Animator — approved NOVA F0 core only. */
const F310_CONFIG={id:'F3-10',preset:'Y8-002-MULTIPLY',startMode:'watch',parameters:{bases:[2,3,4,5],maxExpandedFactors:8},
 presets:{
  'Y8-001':{label:'Repeated multiplication',kind:'multiply',base:2,m:2,n:2},
  'Y8-002-MULTIPLY':{label:'Multiply powers',kind:'multiply',base:2,m:3,n:2},
  'Y8-002-DIVIDE':{label:'Divide powers',kind:'divide',base:3,m:5,n:2},
  'F8-13':{label:'Algebraic index laws',kind:'power',base:'a',m:2,n:3},
  'Y9-003':{label:'Fractional indices',kind:'fraction',base:27,m:2,n:3}},
 challenge:[
  {kind:'multiply',base:2,m:3,n:2,answer:5,rule:'add'},
  {kind:'divide',base:3,m:5,n:2,answer:3,rule:'subtract'},
  {kind:'power',base:2,m:2,n:3,answer:6,rule:'multiply'},
  {kind:'fraction',base:27,m:2,n:3,answer:9,rule:'root-then-power'}],
 events:{value:['preset','base','firstPower','secondPower','law','join','cancel','group','fractionStep','undo','reset','answer','proof'],types:['step','correct','hintUsed','mode']}};
window.F310_CONFIG=F310_CONFIG;
(function(){'use strict';const N=window.NOVA,H=N.h,E=N.svg.el,C=F310_CONFIG,ID=C.id;
const STEPS=[
 {name:'Expand the first power',say:'expand',narration:'An index counts repeated factors of the same base. Two cubed means two multiplied by two multiplied by two. Expand each power so every factor can be seen.'},
 {name:'Join the factor strips',say:'join',narration:'Both powers share the base two. Join the three factors to the two factors. This gives five factors of two without changing the multiplication.'},
 {name:'Recount the factors',say:'count',narration:'Count the joined factors carefully. There are five factors, not six. With the same base, adding powers counts the factors.'},
 {name:'Compress into an index',say:'compress',narration:'Five factors of two can be written as two to the power of five. We keep the base and add the indices.'},
 {name:'Apply the law',say:'proof',narration:'For multiplication with the same base, a to the power of m times a to the power of n is a to the power of m plus n. We have proved this by counting the factors.'}
];
const SAY={expand:'See the factors!',join:'Bring them together!',count:'Count carefully!',compress:'Nice and tidy!',proof:'You proved it!',explore:'Try a law!',ready:'Your turn!',right:'Great work!',wrong:'Try again!',hint:'Count the factors!',undo:'Try another way!',win:'Brilliant!',cancel:'Match the pairs!',group:'Another group!',fraction:'Roots first!',reset:'Fresh start!'};
const POSE={expand:'explain',join:'point',count:'count',compress:'think',proof:'cheer',explore:'point',ready:'think',right:'cheer',wrong:'oops',hint:'think',undo:'point',win:'cheer',cancel:'count',group:'point',fraction:'think',reset:'explain'};
function dock(st,k){N.scene.helperStrip(st,POSE[k]||'think',SAY[k]||'Your turn!');}
function chalk(p,x,y,text,size=52,role='given'){return N.chalkText(p,x,y,String(text),{size,role});}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' value event '+key);N.events.emit('value',{engine:ID,key,value});}
function btn(s,fn,main){return H('button',{class:main?'nova-btn primary':'nova-btn',text:s,onclick:fn});}
function form(s){return String(s).replaceAll('a','a');}
function maths(s){let {kind,base:b,m,n}=s;if(kind==='multiply')return {exp:m+n,val:typeof b==='number'?b**(m+n):null,law:'Add indices',notation:`${b}^{${m}}\\times ${b}^{${n}}=${b}^{${m+n}`};if(kind==='divide')return {exp:m-n,val:typeof b==='number'?b**(m-n):null,law:'Subtract indices',notation:`${b}^{${m}}\\div ${b}^{${n}}=${b}^{${m-n}`};if(kind==='power')return {exp:m*n,val:typeof b==='number'?b**(m*n):null,law:'Multiply indices',notation:`(${b}^{${m}})^{${n}}=${b}^{${m*n}`};if(kind==='fraction'){let r=Math.round(b**(1/n));if(r**n!==b)throw Error('Fraction preset requires perfect nth root');return {exp:null,val:r**m,root:r,law:'Root then power',notation:`${b}^{\\frac{${m}}{${n}}}=${r}^{${m}}=${r**m}`};}throw Error('Unknown kind '+kind);}
function trap(s,v){const correct=maths(s);if(!Number.isInteger(v))return 'Use a whole-number answer for this question.';if(s.kind==='fraction'){
  if(v===correct.val)return '';
  if(v===s.base)return 'A fractional index changes the value. Start by finding the root.';
  if(v===maths(s).root)return 'That is the root. Now raise it to the numerator power.';
  return `Find the ${s.n===3?'cube':'square'} root first, then take the power ${s.m}.`;
 }
 if(v===correct.exp)return '';
 if(s.kind==='multiply'&&v===s.m*s.n)return 'The indices add: count the factors, do not multiply the powers.';
 if(s.kind==='multiply'&&v===s.m+s.n+1)return 'One factor was counted twice. Recount both strips.';
 if(s.kind==='divide'&&v===s.m+s.n)return 'Division cancels matched factors. Subtract the indices.';
 if(s.kind==='divide'&&v===s.m/s.n)return 'You divide matching factors, not the indices.';
 if(s.kind==='power'&&v===s.m+s.n)return 'There are repeated groups. Multiply the indices, do not add.';
 if(s.kind==='power'&&v===s.m**s.n)return 'Count the factors across every repeated group.';
 return `Expand the factor strips and count the ${s.kind==='divide'?'uncancelled':'remaining'} factors.`;
}
window.F310_MATH={maths,trap};
function pow(p,x,y,b,exp,role='given',scale=1){const t=chalk(p,x-12*scale,y,String(b),76*scale,role);chalk(p,x+44*scale,y-39*scale,String(exp),Math.max(45,45*scale),'focus');return t;}
function factor(parent,x,y,b,role='op',index=null,size=96){const g=E('g',{class:'f310-unit'},parent);N.neonBox(g,x-size/2,y-size/2,size,size,{role,r:19});chalk(g,x,y+17,String(b),63,role);if(index!=null)chalk(g,x-37,y-67,String(index),29,'given');return g;}
function strip(parent,n,b,y,role='op',opt={}){const count=n,w=96,gap=Math.min(18,(880-n*w)/Math.max(1,n-1)),total=n*w+(n-1)*gap,x0=500-total/2+w/2,arr=[];for(let i=0;i<n;i++){let g=factor(parent,x0+i*(w+gap),y,b,role,opt.numbers?i+1:null,w);if(opt.dimmed?.includes(i))g.style.opacity='.23';arr.push({g,x:x0+i*(w+gap),y,w});}return arr;}
function resultBoard(svg,s,ready,answerHidden,show){const m=maths(s);N.neonBox(svg,154,960,692,115,{role:ready&&show&&!answerHidden?'result':'support',r:25});let lhs=s.kind==='fraction'?`${s.base} root then power`:`${s.base} to a power`;
 chalk(svg,500,1014,ready&&show&&!answerHidden?(s.kind==='fraction'?`root ${m.root}  then  square ${m.val}`:`${s.base}  to the power of ${m.exp}`):'Count the remaining factors',51,ready&&show&&!answerHidden?'result':'given');
 if(ready&&show&&!answerHidden){const ring=N.neonRing(svg,788,1014,{role:'result',r:14});ring.style.pointerEvents='none';}
}
function draw(s,opt={}){
 const kind=s.kind,m=s.m,n=s.n,b=s.base,interactive=!!opt.interactive,step=opt.step==null?(interactive?0:4):opt.step,progress=Number(opt.progress||0),full=!!opt.full,hide=!!opt.hideAnswer;
 const svg=N.svg.root(1000,1110,`Index laws using ${kind}: expanded factors and raised indices show why the resulting power is correct.`);svg.classList.add('f310-svg');svg.dataset.law=kind;svg.dataset.progress=progress;
 chalk(svg,500,91,kind==='multiply'?'Multiplying powers':kind==='divide'?'Dividing powers':kind==='power'?'A power of a power':'Fractional powers',67,'given');
 let eq=kind==='multiply'?`${b}^${m}    ×    ${b}^${n}`:kind==='divide'?`${b}^${m}    ÷    ${b}^${n}`:kind==='power'?`(${b}^${m})^${n}`:`${b} raised to two-thirds`;
 if(kind!=='fraction'){
   if(kind==='power'){chalk(svg,295,207,'(',70,'given');pow(svg,401,204,b,m,'given',.76);chalk(svg,492,207,')',70,'given');chalk(svg,539,157,String(n),45,'focus');}
   else{pow(svg,320,202,b,m,'given',.83);chalk(svg,505,200,kind==='multiply'?'×':'÷',70,'focus');pow(svg,680,202,b,n,'given',.83);}
 }else{chalk(svg,500,196,`${b}  →  cube root  →  square`,49,'given');}
 if(kind==='multiply'){
   strip(svg,m,b,328,'op');if(!interactive||progress>=1)strip(svg,n,b,476,'focus');
   chalk(svg,108,343,`${m} factors`,45,'op');chalk(svg,108,493,`${n} more`,45,'focus');
   const joined=step>=1||interactive&&progress>=1;
   if(joined){strip(svg,m+n,b,682,'result',{numbers:false});chalk(svg,500,805,hide?'Count every factor':`${m} + ${n} = ${m+n} factors`,63,hide?'given':'result');}
   else{N.neonBox(svg,112,617,776,139,{role:'support',r:23});chalk(svg,500,704,'Join both strips here',50,'given');}
   if(interactive&&!joined){const src=E('g',{'aria-label':'Drag the second factor strip into the join area'},svg);let a=strip(src,n,b,476,'focus');svg.querySelectorAll('.f310-unit').forEach(x=>{if(!src.contains(x))x.style.pointerEvents='none'});src.dataset.action='join';N.ui.svgDrag(svg,src,{box:{x:500-(n*110)/2,y:414,w:n*110,h:124},zones:()=>[{id:'join',kind:'drop',x:112,y:611,w:776,h:155}],onDrop:id=>opt.act?.('join')});}
   if(joined&&interactive){N.neonBox(svg,700,825,210,96,{role:'error',r:19});chalk(svg,805,889,'Remove',45,'error');let handles=svg.querySelectorAll('.f310-unit');const tgt=handles[handles.length-1];if(tgt)N.ui.svgDrag(svg,tgt,{box:{x:390,y:622,w:110,h:110},zones:()=>[{id:'remove',kind:'remove',x:700,y:825,w:210,h:96}],onRemove:()=>opt.act?.('undo')});}
   resultBoard(svg,s,joined,hide,step>=3||interactive); 
 }else if(kind==='divide'){
   const cancel=interactive?progress:(step<=0?0:step===1?Math.min(1,n):n);
   const top=strip(svg,m,b,340,'op',{dimmed:Array.from({length:cancel},(_,i)=>i)});
   const bot=strip(svg,n,b,532,'focus',{dimmed:Array.from({length:cancel},(_,i)=>i)});
   for(let i=0;i<cancel;i++){N.neonMark(svg,top[i].x,top[i].y,false,{size:22});N.neonMark(svg,bot[i].x,bot[i].y,false,{size:22});}
   if(cancel>0&&opt.animate&&!N.reducedMotion()){[top[cancel-1].g,bot[cancel-1].g].forEach(g=>{g.style.opacity='1';N.motion.tween(460,e=>{if(g.isConnected)g.style.opacity=String(1-.77*e);},N.motion.ease.inOut);});}
   chalk(svg,500,663,hide?`${cancel} cancelled · count the rest`:`${cancel} cancelled · ${m-cancel} left`,55,'given');
   if(cancel===n){strip(svg,m-n,b,814,'result');}else{N.neonBox(svg,148,743,703,133,{role:'support',r:19});chalk(svg,500,813,'Uncancelled factors appear here',45,'given');}
   if(interactive&&cancel<n){const idx=cancel,g=bot[idx].g;g.dataset.action='cancel';N.ui.svgDrag(svg,g,{box:{x:bot[idx].x-52,y:480,w:104,h:104},zones:()=>[{id:'cancel',kind:'drop',x:top[idx].x-61,y:277,w:122,h:126}],onDrop:()=>opt.act?.('cancel')});}
   if(interactive&&cancel>0){N.neonBox(svg,748,873,172,80,{role:'error',r:15});chalk(svg,834,929,'Remove',45,'error');const unit=bot[cancel-1].g;N.ui.svgDrag(svg,unit,{box:{x:bot[cancel-1].x-49,y:477,w:100,h:108},zones:()=>[{id:'remove',kind:'remove',x:748,y:873,w:172,h:80}],onRemove:()=>opt.act?.('undo')});}
   resultBoard(svg,s,cancel===n,hide,step>=3||interactive);
 }else if(kind==='power'){
   const ct=interactive?progress:(step===0?1:step===1?2:n);
   for(let row=0;row<n;row++){const y=295+row*182;if(row<ct){let a=strip(svg,m,b,y,row%2?'focus':'op');chalk(svg,132,y+14,`group ${row+1}`,45,'given');}else{N.neonBox(svg,218,y-57,562,113,{role:'support',r:18});chalk(svg,500,y+19,interactive&&row===ct?'Drop group here':'Matching group',45,'given');}}
   chalk(svg,500,771,`${ct} groups  ×  ${m} factors`,47,'given');
   if(interactive&&ct<n){const source=E('g',{'aria-label':'Drag another group of base factors onto the empty group'},svg);strip(source,m,b,875,'focus');const y=295+ct*182;N.ui.svgDrag(svg,source,{box:{x:500-m*58,y:813,w:m*116,h:128},zones:()=>[{id:'group',kind:'drop',x:216,y:y-65,w:567,h:134}],onDrop:()=>opt.act?.('group')});}
   if(interactive&&ct>0){N.neonBox(svg,770,875,180,83,{role:'error',r:16});chalk(svg,860,929,'Remove',45,'error');const u=[...svg.querySelectorAll('.f310-unit')].at(-1);if(u)N.ui.svgDrag(svg,u,{box:{x:450,y:295+(ct-1)*182-49,w:105,h:101},zones:()=>[{id:'remove',kind:'remove',x:770,y:875,w:180,h:83}],onRemove:()=>opt.act?.('undo')});}
   resultBoard(svg,s,ct===n,hide,step>=3||interactive);
 }else{
   const root=maths(s).root,phase=interactive?progress:(step<=0?0:step===1?1:2);
   chalk(svg,500,308,`${b}  =  ${root} × ${root} × ${root}`,52,'op');
   const a=strip(svg,3,root,424,'op');
   N.neonBox(svg,138,585,320,151,{role:phase>=1?'result':'support',r:24});chalk(svg,300,643,phase>=1?`root = ${root}`:'Cube root',45,phase>=1?'result':'given');
   N.neonBox(svg,546,585,320,151,{role:phase>=2?'result':'support',r:24});chalk(svg,706,643,phase>=2?`${root}² = ${root*root}`:'Then square',45,phase>=2?'result':'given');
   if(interactive&&phase<2){const src=E('g',{'aria-label':'Drag the root or square factor card to the highlighted region'},svg);N.neonBox(src,353,778,290,110,{role:'focus',r:20});chalk(src,498,849,phase===0?'Cube root':'Now square',45,'focus');const target=phase===0?{x:138,y:585,w:320,h:151}:{x:546,y:585,w:320,h:151};N.ui.svgDrag(svg,src,{box:{x:353,y:778,w:290,h:110},zones:()=>[{id:'advance',kind:'drop',...target}],onDrop:()=>opt.act?.('fractionStep')});}
   if(interactive&&phase>0){N.neonBox(svg,765,816,190,88,{role:'error',r:16});chalk(svg,860,873,'Remove',45,'error');const src=E('g',{},svg);N.neonBox(src,45,801,140,88,{role:'focus',r:17});chalk(src,114,855,'Undo',45,'focus');N.ui.svgDrag(svg,src,{box:{x:45,y:801,w:140,h:88},zones:()=>[{id:'remove',kind:'remove',x:765,y:816,w:190,h:88}],onRemove:()=>opt.act?.('undo')});}
   resultBoard(svg,s,phase===2,hide,step>=3||interactive);
 }
 if(opt.animate&&!N.reducedMotion()){
   const units=[...svg.querySelectorAll('.f310-unit')];units.slice(-Math.min(units.length,4)).forEach((g,i)=>N.motion.arrive(g,0,25,360+i*80,N.motion.ease.out));
 }
 return svg;
}
function present(stage,s,opt={}){stage.innerHTML='';N.cap(stage,'Index Law Animator',opt.caption||'Expand. Rearrange. Recount. Compress.');const holder=H('div',{class:'f310-scene'}),side=H('aside',{class:'f310-side'}),svg=draw(s,opt),m=maths(s);
 const card=(label,val,desc,role)=>N.neonCard([H('div',{class:'f310-title',text:label}),H('p',{class:'f310-value',text:val}),H('p',{class:'f310-desc',text:desc})],{role});
 side.append(card('MATHEMATICAL LAW',m.law,s.kind==='multiply'?'Same base: collect all factors.':s.kind==='divide'?'Same base: cancel matching factors.':s.kind==='power'?'Repeat groups of equal factors.':'Roots and powers undo each other.','op'),card('EXPANDED FORM',s.kind==='fraction'?`${s.base} → ${m.root} → ${m.val}`:`${s.m} ${s.kind==='divide'?'minus':s.kind==='power'?'groups of':'plus'} ${s.n}`, 'Count the factors rather than guessing a rule.','focus'),card('TARGET',opt.hideAnswer?'Prove the rule':s.kind==='fraction'?String(m.val):`${s.base}^${m.exp}`,'Match the visual evidence to the expression.','result'));
 holder.append(svg,side);stage.append(holder);
 if(s.kind==='fraction'){const frac=H('div',{class:'f310-fraction'});frac.append(N.neonTile(`${s.base}^{\\frac{${s.m}}{${s.n}}}${opt.hideAnswer?'':`=${m.root}^{${s.m}}=${m.val}`}`,{role:'result'}));frac.append(H('span',{text:'The denominator is the root; the numerator is the power.'}));stage.append(frac);}
 dock(stage,opt.say||'explore');return svg;}
function initial(s){return s.kind==='multiply'?0:s.kind==='divide'?0:s.kind==='power'?0:0;}
function need(s){return s.kind==='multiply'?1:s.kind==='divide'?s.n:s.kind==='power'?s.n:2;}
function actionName(s){return s.kind==='multiply'?'join':s.kind==='divide'?'cancel':s.kind==='power'?'group':'fractionStep';}
function actionLabel(s){return s.kind==='multiply'?'Join strips':s.kind==='divide'?'Cancel pair':s.kind==='power'?'Add group':'Next operation';}
function explain(s){return s.kind==='multiply'?`Join ${s.m} and ${s.n} factors of the same base.`:s.kind==='divide'?`Cancel each of the ${s.n} denominator factors with one numerator factor.`:s.kind==='power'?`Repeat ${s.m} base factors in each of ${s.n} groups.`:`Take the cube root first, then raise it to the power ${s.m}.`;}
function live(stage,panel,s0,challenge=false,api=null){let s={...s0},progress=0,feedback=explain(s),wrong=false,speech='ready',guess='',done=false;let presetKey=C.preset;
 const preset=H('select',{'aria-label':'Index law preset'}),baseInput=H('select',{'aria-label':'Base'}),mInput=H('input',{type:'number',min:1,max:5,value:s.m,'aria-label':'First index'}),nInput=H('input',{type:'number',min:1,max:5,value:s.n,'aria-label':'Second index'}),ans=H('input',{type:'number','aria-label':'Resulting index or numerical value'}),status=H('p',{class:'f310-status',role:'status'});
 Object.entries(C.presets).forEach(([k,v])=>preset.add(new Option(v.label,k)));[2,3,4,5].forEach(v=>baseInput.add(new Option(String(v),String(v))));
 function message(text,k='right',bad=false){feedback=text;wrong=bad;speech=bad?'wrong':k;}
 function act(a){if(done)return false;let op=actionName(s);if(a==='undo'){progress=Math.max(0,progress-1);message('One step undone.','undo');emit('undo',progress);render();return true;}
  if(a!==op)return false;if(progress>=need(s))return false;progress++;emit(op,progress);message(progress>=need(s)?'Structure complete!':'Keep going!',a==='cancel'?'cancel':a==='group'?'group':a==='fractionStep'?'fraction':'join');render();return true;}
 function reset(){progress=0;guess='';done=false;message(explain(s),'reset');emit('reset',true);render();}
 function check(){let v=Number(ans.value);guess=ans.value;emit('answer',v);if(!ans.value.trim()){message('Enter an answer to check.','wrong',true);render();return false;}
  if(progress<need(s)){let t=`Finish the factor structure first: ${progress} of ${need(s)} steps.`;message(t,'wrong',true);api?.check(false,t);render();return false;}
  let err=trap(s,v);if(err){message(err,'wrong',true);api?.check(false,err);render();return false;}
  const correct=s.kind==='fraction'?maths(s).val:maths(s).exp;if(v!==correct){message('Recheck the factor count.','wrong',true);api?.check(false,feedback);render();return false;}
  api?.check(true,'Correct! The factor structure proves the result.');emit('proof',{kind:s.kind,result:v});done=true;message('You proved it!','proof');render();return true;}
 function render(){panel.innerHTML='';const hide=challenge&&!done;present(stage,s,{caption:challenge?'Build the factor proof':`Explore · ${maths(s).law}`,say:speech,interactive:!done,progress,full:done,hideAnswer:hide,act,animate:progress>0});
  const complete=progress>=need(s);
  if(!challenge){preset.value=presetKey;baseInput.value=String(s.base);mInput.value=s.m;nInput.value=s.n;
   panel.append(H('div',{class:'f310-row'},[H('label',{},['Preset',preset]),...(s.kind!=='fraction'&&s.base!=='a'?[H('label',{},['Base',baseInput])]:[]),...(s.kind!=='fraction'?[H('label',{},['First power',mInput]),H('label',{},['Second power',nInput])]:[])]));}
  panel.append(H('p',{class:'f310-help',text:`${explain(s)} Drag the highlighted group or factor to its matching target. Keyboard: use ${actionLabel(s)}.`}),H('div',{class:'f310-row'},[btn(actionLabel(s),()=>act(actionName(s)),true),btn('Undo',()=>act('undo')),btn('Reset',reset),btn('Hint',()=>{api?.hint(explain(s));message('Count the factors!','hint');render();})]));
  if(challenge){panel.append(H('div',{class:'f310-row'},[H('label',{},[s.kind==='fraction'?'Numerical result?':'Resulting index?',ans]),btn('Check proof',check,true)]));ans.value=guess;ans.oninput=()=>guess=ans.value;}
  if(done)panel.append(H('div',{class:'f310-win',text:challenge?'Proof complete. The index law follows from the factors!':'Excellent — you completed the law.'}));
  status.textContent=feedback;status.classList.toggle('bad',wrong);panel.append(status);}
 preset.onchange=()=>{presetKey=preset.value;C.preset=presetKey;s={...C.presets[presetKey]};emit('preset',presetKey);reset();};
 baseInput.onchange=()=>{s.base=Number(baseInput.value);emit('base',s.base);reset();};
 mInput.onchange=()=>{s.m=Math.min(5,Math.max(1,Math.round(Number(mInput.value)||2)));if(s.kind==='divide'&&s.m<=s.n)s.m=s.n+1;if(s.m+s.n>8&&s.kind==='multiply')s.m=8-s.n;if(s.m*s.n>8&&s.kind==='power')s.m=Math.max(1,Math.floor(8/s.n));emit('firstPower',s.m);reset();};
 nInput.onchange=()=>{s.n=Math.min(4,Math.max(1,Math.round(Number(nInput.value)||2)));if(s.kind==='divide'&&s.n>=s.m)s.n=s.m-1;if(s.kind==='multiply'&&s.m+s.n>8)s.n=8-s.m;if(s.kind==='power'&&s.m*s.n>8)s.n=Math.max(1,Math.floor(8/s.m));emit('secondPower',s.n);reset();};
 render();return {check,act,reset,done:()=>done,progress:()=>progress};}
let def={id:ID,title:'Index Law Animator',config:C,steps:STEPS,
 alt:'Neon glass factor tiles expand powers of the same base. Multiplication joins strips; division cancels pairs; a power of a power repeats groups; fractional indices show a root followed by a power.',
 staticAlt:'When multiplying the same-base powers, add their indices. When dividing, subtract the indices. A power of a power multiplies the indices. For a fractional index, apply the denominator root, then the numerator power.',
 render(i,stage){let s={...C.presets['Y8-002-MULTIPLY']};present(stage,s,{step:i,caption:STEPS[i].name,say:STEPS[i].say,animate:i>0});},
 exploreIntro:'Explore each index law by moving factor strips, cancelling pairs, repeating groups and applying roots.',
 explore(panel,stage){live(stage,panel,C.presets[C.preset]||C.presets['Y8-002-MULTIPLY']);},
 challenge(panel,api,stage){let ix=0,liveUI=null,finished=false,body=H('div');function round(){panel.innerHTML='';if(finished){present(stage,C.challenge.at(-1),{progress:need(C.challenge.at(-1)),say:'win',full:true});panel.append(H('div',{class:'f310-win',text:'Four index laws proved. Excellent mathematical reasoning!'}));return;}
  const task=C.challenge[ix];panel.append(H('p',{class:'f310-help',text:`Proof ${ix+1} of 4. ${explain(task)} Complete the structural action before checking the index or value.`}),body);
  const roundApi={hint:api.hint.bind(api),check(ok,msg){api.check(ok,msg,{task:ix,kind:task.kind});if(ok){ix++;if(ix===C.challenge.length)finished=true;Promise.resolve().then(round);}}};
  liveUI=live(stage,body,task,true,roundApi);
 }round();}, onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['indices','powers','index laws','algebra','fractional indices'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F3-09']});
N.bankMount({id:ID,num:'10',title:'Index Law Animator · Premium Review',def,linked:['F3-09','F3-11','F8-13'],years:'Year 8 / Year 9 · Indices and roots',spec:{
 purpose:'Prove powers of the same base by expanding neon factor strips; demonstrate addition, subtraction, multiplication of indices, and fractional indices as roots and powers.',
 params:'Base 2–5 or algebraic a; first and second indices 1–5 with eight-factor visual cap; single validated fractional-index preset.',
 presets:'Y8-001 repeated multiplication; Y8-002 multiply/divide; F8-13 index laws in algebra; Y9-003 fractional indices.',
 steps:'Expand → join / cancel → recount → compress → apply law.',
 interactions:'Drag a factor strip to join; drag tiles to cancel; drag repeated groups; root-then-power progression; keyboard equivalents; Undo and Reset.',
 traps:'Powers of same base: multiplication adds exponents, division subtracts, a power of a power multiplies; do not multiply base by exponent.',
 gcse:'Fractional indices as roots and powers; algebraic index-law preset.'}});
// Work around Chromium losing pointer capture when F0 reorders SVG elements on pickup.
// Forward movement safely to the core drag helper; canonical core is never edited.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function alt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA mathematics helper');});}alt();new MutationObserver(alt).observe(card,{subtree:true,childList:true});
})();
