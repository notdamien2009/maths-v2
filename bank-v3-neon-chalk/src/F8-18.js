/* NOVA F8-18 — Iteration & Trial-and-Improvement. Canonical F0 helpers and visual language only. */
window.F818_CONFIG={id:'F8-18',title:'Iteration & Trial-and-Improvement',preset:'SQUARE-TWO',startMode:'guided',parameters:{challengePrecision:[2,3],maxTrials:24},events:{value:['preset','guess','trial','lower','upper','undo','reset','answer','hint'],types:['step','correct','hintUsed','mode']},linked:['F0-02','F0-03','F0-05','F0-07','F0-08','F8-09','F8-11','F8-12']};
(function(){'use strict';
const N=window.NOVA,E=N.svg.el,H=N.h,C=window.F818_CONFIG,ID=C.id;
const CASES={
 'SQUARE-TWO':{label:'Square root of two',short:'x² = 2',formula:'f(x) = x² − 2',context:'Find the positive solution to x² = 2.',f:x=>x*x-2,lo:1,hi:2,dp:3,level:'GCSE extension',trap:'Squaring a negative is possible, but here we are finding the positive solution.'},
 'SQUARE-FIVE':{label:'Square root of five',short:'x² = 5',formula:'f(x) = x² − 5',context:'Find the positive solution to x² = 5.',f:x=>x*x-5,lo:2,hi:3,dp:2,level:'GCSE extension',trap:'A decimal answer needs a proven bracket at the required accuracy.'},
 'CUBE-FIVE':{label:'Cube root of five',short:'x³ = 5',formula:'f(x) = x³ − 5',context:'Find x where x cubed equals five.',f:x=>x*x*x-5,lo:1,hi:2,dp:3,level:'GCSE extension',trap:'A cube root is not the same as dividing by three.'},
 'CUBIC-X':{label:'Cubic with two terms',short:'x³ − x = 2',formula:'f(x) = x³ − x − 2',context:'Find the root of x cubed minus x equals two.',f:x=>x*x*x-x-2,lo:1,hi:2,dp:2,level:'GCSE extension',trap:'Evaluate x³ and x separately before combining.'},
 'DOUBLE-SQUARE':{label:'Twice a square',short:'2x² = 7',formula:'f(x) = 2x² − 7',context:'Find the positive solution of twice x squared equals seven.',f:x=>2*x*x-7,lo:1,hi:2,dp:3,level:'GCSE extension',trap:'Two x squared means two times x squared, not (2x) squared.'},
 'CUBIC-SUM':{label:'Cubic plus x',short:'x³ + x = 4',formula:'f(x) = x³ + x − 4',context:'Solve x cubed plus x equals four by trial and improvement.',f:x=>x*x*x+x-4,lo:1,hi:2,dp:2,level:'GCSE extension',trap:'If f(x) is negative, the trial value was too low for these increasing functions.'}
};
const ORDER=Object.keys(CASES),BEATS=['Establish a bracket','Choose a sensible trial','Calculate f(x)','Decide high or low','Narrow the interval','State the accuracy'];
const SAY=['There is a root between these values.','Try halfway first!','Calculate carefully!','Is the result high or low?','Keep the root inside!','Prove the rounding!'];
const POSES=['explain','point','count','think','point','cheer'];
const eps=1e-9,fix=(v,d=4)=>{const t=Number(v).toFixed(d);return t.includes('.')?(t.replace(/0+$/,'').replace(/\.$/,'')||'0'):t;};
const round=(v,d)=>Number(v.toFixed(d));
function init(p){return {lo:p.lo,hi:p.hi,guess:(p.lo+p.hi)/2,history:[],undo:[],done:false,answer:'',feedback:'Drag the glowing guess ring along the NOVA number line, then test the value.',status:'neutral',selected:false};}
function validPreset(p){return p.lo<p.hi&&p.f(p.lo)<0&&p.f(p.hi)>0&&[2,3].includes(p.dp);}
for(const p of Object.values(CASES))if(!validPreset(p))throw Error('Invalid interval preset '+p.label);
function narrow(s,p){return (s.lo===s.hi&&s.history.length>=1)||(round(s.lo,p.dp)===round(s.hi,p.dp)&&s.history.length>=3);}
function trial(s,p,x){if(s.done)return false;if(!Number.isFinite(x)||x<s.lo+eps||x>s.hi-eps){s.status='bad';s.feedback='Keep the trial strictly between the current lower and upper bounds.';return false}
 const v=p.f(x);if(!Number.isFinite(v))return false;
 s.undo.push({lo:s.lo,hi:s.hi,guess:s.guess,history:s.history.slice()});
 const status=Math.abs(v)<1e-11?'exact':v<0?'low':'high';
 if(status==='low')s.lo=x;else if(status==='high')s.hi=x;else{s.lo=x;s.hi=x;}
 s.history.push({x,v,status,lo:s.lo,hi:s.hi});s.guess=(s.lo+s.hi)/2;s.selected=false;
 s.status=narrow(s,p)?'good':'neutral';s.feedback=status==='low'?'f(x) is below zero. Raise the lower bound.':status==='high'?'f(x) is above zero. Lower the upper bound.':'The trial gives zero: the root is exact.';
 if(narrow(s,p))s.feedback='Both boundaries now round to the same value. The accuracy is justified; enter your answer.';
 return true;
}
function undo(s){if(s.done)return false;const item=s.undo.pop();if(!item)return false;Object.assign(s,item,{done:false,status:'neutral',feedback:'Previous interval restored. Try another point.'});return true;}
function verify(s,p,answer){const val=Number(answer);if(!String(answer).trim()||!Number.isFinite(val)){s.status='bad';s.feedback='Enter a numerical value to the required decimal places.';return false;}
 if(!narrow(s,p)){s.status='bad';s.feedback='Your bracket is still too wide. Narrow it until both ends round to the same value.';return false;}
 const correct=round(s.lo,p.dp);if(Math.abs(val-correct)>10**(-p.dp)/100){s.status='bad';s.feedback='Your value does not match the rounded interval. Count the decimal places carefully.';return false;}
 s.done=true;s.status='good';s.feedback='Accurate! The root is bracketed to the requested decimal places.';return true;
}
function demo(p,n){let s=init(p);for(let i=0;i<Math.min(n,24);i++){if(narrow(s,p))break;trial(s,p,(s.lo+s.hi)/2)}return s;}
function allTrials(p){let s=demo(p,24);if(!narrow(s,p))throw Error('Unable to prove rounding for '+p.label);return s;}
const DEMO=Object.fromEntries(ORDER.map(k=>[k,allTrials(CASES[k])]));
window.F818_TEST={CASES,ORDER,init,trial,undo,narrow,round,verify,demo,allTrials};
const chalk=(el,x,y,t,size=42,role='given')=>N.chalkText(el,x,y,String(t),{role,size,anchor:'middle'});
const box=(el,x,y,w,h,role='support',r=19)=>N.neonBox(el,x,y,w,h,{role,r});
const neon=(el,x,y,X,Y,role='op',width=4)=>N.neonLine(el,x,y,X,Y,{role,width});
const btn=(name,action,primary=false)=>H('button',{class:'nova-btn'+(primary?' primary':''),text:name,onclick:action});
const emit=(key,v)=>N.events.emit('value',{engine:ID,key,value:v});
function numberline(svg,p,s,opt){
 const view={x:116,y:490,w:728},range=Math.max(s.hi-s.lo,.00008);let padding=range*.08,min=s.lo-padding,max=s.hi+padding;
 // Use only the canonical F0 number-line helper. The major/minor spacing is derived from the current bracket.
 const nice=10**Math.floor(Math.log10((max-min)/5));const major=(max-min)/nice/5>5?5*nice:(max-min)/nice/5>2?2*nice:nice;
 const nl=N.numberLine(svg,{...view,min,max,major,minor:major/2,labelSize:40});
 const x=val=>nl.s(val),A=x(s.lo),B=x(s.hi),Y=view.y;
 // Bracket endpoints are marked with distinctive neon rings, never stars or bead ticks.
 neon(svg,A,Y-49,A,Y+51,'focus',4);neon(svg,B,Y-49,B,Y+51,'focus',4);
 N.neonRing(svg,A,Y,{r:14,role:'op'});N.neonRing(svg,B,Y,{r:14,role:'op'});
 chalk(svg,A,Y-79,fix(s.lo,Math.max(p.dp+2,5)),37,'given');chalk(svg,B,Y-79,fix(s.hi,Math.max(p.dp+2,5)),37,'given');
 const mid=Math.min(s.hi,Math.max(s.lo,s.guess));const tx=x(mid);
 if(s.done){N.neonRing(svg,tx,Y,{r:25,role:'result'});chalk(svg,480,Y+135,`PROVEN TO ${p.dp} DECIMAL PLACES`,47,'result');return}
 const g=E('g',{class:'f818-guess','data-guess':fix(mid,6),role:'button',tabindex:0,'aria-label':'Draggable guess ring. Arrow keys move the guess and Enter tests it.'},svg);
 N.neonRing(g,tx,Y,{r:25,role:'focus'});box(g,tx-65,Y-134,130,49,'focus',16);chalk(g,tx,Y-99,fix(mid,Math.max(p.dp+2,5)),37,'focus');
 chalk(svg,480,Y+113,'MOVE THE GLOWING RING FOR YOUR TRIAL','given',43);
 if(opt.live){
 const increment=10**(-p.dp-1);const setGuess=v=>opt.onMove?.(Math.min(s.hi-0.0000001,Math.max(s.lo+0.0000001,v)));
 g.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();setGuess(mid+(e.key==='ArrowLeft'?-increment:increment))}else if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onTry?.()} });
 N.ui.svgDrag(svg,g,{box:{x:tx-33,y:Y-33,w:66,h:66},zones:()=>[{id:'line',kind:'drop',x:view.x-10,y:Y-42,w:view.w+20,h:84},{id:'return',kind:'remove',x:117,y:1300,w:727,h:84}],onDrop:()=>{const e=window.__F818_LAST_POINTER;if(!e)return false;const pt=svg.createSVGPoint();pt.x=e.x;pt.y=e.y;const matrix=svg.getScreenCTM();if(!matrix)return false;const q=pt.matrixTransform(matrix.inverse());const result=Math.max(s.lo+1e-6,Math.min(s.hi-1e-6,nl.inv(q.x)));setGuess(Number(result.toFixed(p.dp+3)));return true;},onRemove:()=>opt.onMove?.((s.lo+s.hi)/2)});
 }
}
function draw(stage,p,s,opt={}){
 const mode=opt.mode||'guided',step=opt.step??5,live=!!opt.live;
 stage.innerHTML='';N.cap(stage,'TRIAL & IMPROVE',mode==='challenge'?'CLOSE THE BRACKET':mode==='explore'?'INVESTIGATE THE ROOT':BEATS[Math.min(5,step)]);
 const svg=N.svg.root(960,live&&!s.done?1460:1340,'A neon number line with labelled lower and upper trial bounds, a draggable trial ring and a shrinking interval. A glass table tracks tested values.');svg.classList.add('f818-svg');svg.dataset.preset=opt.key;svg.dataset.mode=mode;svg.dataset.low=s.lo;svg.dataset.high=s.hi;svg.dataset.trials=s.history.length;svg.dataset.certified=String(narrow(s,p));
 chalk(svg,480,73,p.short,68,'given');chalk(svg,480,141,p.formula,52,'focus');
 box(svg,88,159,784,177,'support',28);chalk(svg,480,224,'CURRENT ROOT INTERVAL',47,'focus');chalk(svg,480,305,`${fix(s.lo,Math.max(3,p.dp+2))}  <  x  <  ${fix(s.hi,Math.max(3,p.dp+2))}`,65,'given');
 numberline(svg,p,s,opt);
 box(svg,89,671,782,174,'support',22);
 const words=p.context.split(' ');let lines=[''];for(const word of words){let j=lines.length-1;if((lines[j]+' '+word).trim().length>34&&lines[j])lines.push(word);else lines[j]=(lines[j]+' '+word).trim();}lines.slice(0,2).forEach((l,i)=>chalk(svg,480,727+i*47,l,43,'given'));
 let item=s.history.at(-1);
 chalk(svg,480,827,item?`f(${fix(item.x,p.dp+3)}) = ${fix(item.v,6)} · ${item.status==='low'?'TOO LOW':item.status==='high'?'TOO HIGH':'EXACT'}`:'RESULT: BELOW ZERO OR ABOVE ZERO?',41,item?'result':'focus');
 // A compact three-row glass table retains the most recent trials without hiding earlier history in the UI controls.
 box(svg,91,879,778,332,'support',23);
 let widths=[168,180,204,173],left=116;for(let i=0;i<4;i++){chalk(svg,left+widths[i]/2,947,['TRIAL x','f(x)','SIGN','WIDTH'][i],43,'focus');left+=widths[i];}
 neon(svg,114,966,849,966,'op',3);
 const recent=s.history.slice(-3);for(let i=0;i<3;i++){
  const it=recent[i],yy=1032+i*76;if(!it){chalk(svg,480,yy,'—  AWAITING A TRIAL  —',41,'given');continue}
  const data=[fix(it.x,p.dp+3),fix(it.v,5),it.status==='low'?'LOW  ↑':it.status==='high'?'HIGH  ↓':'EXACT',fix(it.hi-it.lo,Math.max(4,p.dp+2))];let pos=106;
  data.forEach((t,j)=>{chalk(svg,pos+widths[j]/2,yy,t,j===2?43:44,it.status==='exact'?'result':j===2?'focus':'given');pos+=widths[j];});
 }
 if(live&&!s.done){const rm=box(svg,117,1300,727,84,'error',18);rm?.querySelectorAll?.('[filter]').forEach(x=>x.removeAttribute('filter'));const ret=chalk(svg,480,1352,'RETURN ZONE · RESET THE TRIAL RING',44,'error');ret.removeAttribute('filter');}
 else chalk(svg,480,1274,s.done?'ROOT CONFIRMED · NICE REASONING':'EACH TRIAL KEEPS THE ROOT INSIDE',45,s.done?'result':'focus');
 stage.append(svg);
 if(!N.reducedMotion()&&!live){const pulse=svg.querySelector('.f818-svg [data-guess]')||svg.querySelector('svg g');if(pulse)N.motion.arrive(pulse,0,13,300,N.motion.ease.out);}
 N.scene.helperStrip(stage,s.done?'cheer':s.status==='bad'?'oops':!live?POSES[Math.min(5,step)]:item?'point':'think',s.done?'You found it!':s.status==='bad'?'Try a value inside!':!live?SAY[Math.min(5,step)]:item?'Narrow the gap!':'Start between the bounds!');return svg;
}
let lastPointer=null;window.addEventListener('pointerup',ev=>{lastPointer={x:ev.clientX,y:ev.clientY};window.__F818_LAST_POINTER=lastPointer;},true);
function interactive(mode,panel,api,stage){const isChallenge=mode==='challenge';let key=isChallenge?ORDER[0]:C.preset,index=0,s=init(CASES[key]);let guessText='',answerText='';
 const root=H('div',{class:'f818-ui'}),preset=H('select',{'aria-label':'Trial equation preset',class:'f818-select'}),heading=H('h3',{class:'f818-heading'}),context=H('p',{class:'f818-context'}),top=H('div',{class:'f818-row'}),row=H('div',{class:'f818-row'}),message=H('div',{class:'f818-status',role:'status','aria-live':'polite'}),proof=H('p',{class:'f818-proof'}),entry=H('input',{type:'number',step:'any','aria-label':'Trial x value',class:'f818-input'}),ans=H('input',{type:'number',step:'any','aria-label':'Rounded final answer',class:'f818-input'});
 ORDER.forEach(k=>preset.append(H('option',{value:k,text:CASES[k].label})));preset.onchange=()=>{key=preset.value;s=init(CASES[key]);guessText='';answerText='';emit('preset',key);render();};
 const setGuess=x=>{if(s.done)return;s.guess=x;s.selected=true;guessText=String(Number(x.toFixed(CASES[key].dp+3)));emit('guess',x);render();};
 const doTrial=()=>{const p=CASES[key],x=Number(entry.value);if(!entry.value.trim()||!Number.isFinite(x)){s.feedback='Enter a trial number between the bounds.';s.status='bad';render();return}
 const ok=trial(s,p,x);if(ok){emit('trial',{x,f:p.f(x)});emit('lower',s.lo);emit('upper',s.hi);}guessText=String(Number(s.guess.toFixed(p.dp+3)));render()};
 const checkAnswer=()=>{const ok=verify(s,CASES[key],ans.value);emit('answer',{answer:ans.value,ok});if(isChallenge)api?.check?.(ok,s.feedback,{preset:key,trials:s.history.length});render();};
 let next=btn('Next challenge',()=>{if(!s.done||index>=ORDER.length-1)return;index++;key=ORDER[index];s=init(CASES[key]);guessText='';answerText='';render()},true);
 const undoBtn=btn('Undo trial',()=>{undo(s);guessText=String(Number(s.guess.toFixed(CASES[key].dp+3)));emit('undo',s.history.length);render()});
 const resetBtn=btn('Restore defaults',()=>{s=init(CASES[key]);guessText='';answerText='';emit('reset',key);render()});
 const hintBtn=btn('Hint',()=>{let m='Try the midpoint: add the two bounds and divide by two. Then use the sign of f(x) to keep the root inside.';s.feedback=m;s.status='neutral';emit('hint',key);api?.hint?.(m);render()});
 entry.oninput=()=>{guessText=entry.value};ans.oninput=()=>{answerText=ans.value};
 top.append(preset,undoBtn,resetBtn,hintBtn);
 row.append(H('label',{class:'f818-field'},[H('span',{text:'TRIAL VALUE'}),entry]),btn('Test this trial',doTrial,true),H('label',{class:'f818-field'},[H('span',{text:'FINAL ANSWER'}),ans]),btn('Check accuracy',checkAnswer,true));
 root.append(heading,context,top,row,message,proof,next);panel.append(root);
 function render(){const p=CASES[key];C.preset=key;heading.textContent=isChallenge?`Challenge ${index+1} of ${ORDER.length} · ${p.label}`:`Explore · ${p.label}`;context.textContent=p.context;preset.value=key;preset.hidden=isChallenge;
  entry.value=guessText||String(Number(s.guess.toFixed(p.dp+3)));ans.value=answerText;entry.disabled=s.done;ans.disabled=s.done;
  const hintDone=narrow(s,p);proof.textContent=s.done?`Confirmed answer: ${round(s.lo,p.dp).toFixed(p.dp)}. The two interval bounds round to the same value.`:`Trial ${s.history.length} · target ${p.dp} decimal places · ${hintDone?'ACCURACY PROVED':'narrow the interval until BOTH endpoints round alike.'}`;
  message.textContent=s.feedback;message.dataset.status=s.status;next.hidden=!isChallenge||!s.done||index>=ORDER.length-1;
  draw(stage,p,s,{mode,key,live:true,onMove:setGuess,onTry:doTrial});
 }
 render();return {state:()=>s,choose:setGuess,trial:doTrial,check:checkAnswer,render};
}
const STEPS=BEATS.map((name,i)=>({name,say:POSES[i],narration:[
 'Check the function at two endpoints. One value is below zero and one is above, so the root lies between them.',
 'Make a sensible trial. Halving the interval is a reliable strategy.',
 'Substitute the trial into the function and calculate the signed result carefully.',
 'A negative result is too low for this increasing function, while a positive one is too high.',
 'Replace only the endpoint on the same side as your trial. Keep the root between the bounds.',
 'Continue until both limits round to the same answer to the requested decimal places.'
][i]}));
function watchState(i,p){const complete=DEMO[C.preset]||DEMO['SQUARE-TWO'];if(i===0)return init(p);if(i===1)return demo(p,1);if(i===2)return demo(p,2);if(i===3)return demo(p,3);if(i===4)return demo(p,Math.max(4,Math.floor(complete.history.length/2)));return demo(p,24);}
const DEF={id:ID,title:C.title,config:C,steps:STEPS,alt:'A neon number line shows an interval shrinking around an equation root. A draggable guess ring and three-row trial table help decide which bound to replace.',staticAlt:'If f(lower) is negative and f(upper) is positive for an increasing continuous function, try between them and replace the bound that has the same sign as the trial. Repeat until the interval determines the required rounded answer.',
 render(i,stage){const p=CASES[C.preset]||CASES['SQUARE-TWO'];let s=watchState(i,p);if(i===5){s.done=true;}draw(stage,p,s,{key:C.preset,mode:'guided',step:i});},
 exploreIntro:'Test values, read their signs and narrow the interval around a root.',
 explore(panel,stage){interactive('explore',panel,null,stage)},challenge(panel,api,stage){interactive('challenge',panel,api,stage)},onRestore(){}};
N.registry.add({id:ID,title:C.title,topics:['iteration','trial-and-improvement','numerical methods','equations'],deps:['F0-02','F0-03','F0-05','F0-07','F8-09','F8-11','F8-12']});
N.bankMount({id:ID,num:'18',title:'Iteration & Trial-and-Improvement · Premium Review',def:DEF,linked:C.linked,years:'GCSE extension · no specific KS3 lesson mapping',spec:{purpose:'Use an interval, midpoint trials and sign checks to estimate a continuous increasing function root to the required decimal places.',params:'Equation preset, initial bracket, target precision and up to 24 trials.',presets:'Six demonstration equations, both quadratic and cubic, each with a verified positive root.',steps:'Establish bracket → choose guess → evaluate → compare sign → narrow → prove rounding.',interactions:'Drag a trial ring, choose a trial by keyboard or input, evaluate, undo, reset and check rounded result.',traps:'Confusing too high/low, forgetting the sign of the output, quoting digits without a proven bracket.',gcse:'Numerical methods and trial-and-improvement for non-factorisable equations.'}});
// Local F0 pointer-recovery guard. The shared core can lose SVG pointer capture when it lifts the ring.
(function recoverPointer(){let pid=null;const host=()=>document.getElementById(ID);
 window.addEventListener('pointerdown',ev=>{const g=ev.target.closest?.('[data-drag="1"]');if(g&&host()?.contains(g))pid=ev.pointerId;},true);
 window.addEventListener('pointermove',ev=>{const d=N.ui._drag;if(pid!==ev.pointerId||!d?.el||!host()?.contains(d.el))return;
 if(d.el.contains(ev.target)||d.el.hasPointerCapture?.(ev.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:ev.pointerId,pointerType:ev.pointerType,isPrimary:ev.isPrimary,clientX:ev.clientX,clientY:ev.clientY,button:ev.button,buttons:ev.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',ev=>{if(pid!==ev.pointerId)return;const d=N.ui._drag;
 if(d?.el&&host()?.contains(d.el)&&!d.el.contains(ev.target))d.up(ev);pid=null;},true);
 window.addEventListener('pointercancel',ev=>{if(pid!==ev.pointerId)return;pid=null;const d=N.ui._drag;if(d?.el&&host()?.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pid=null;const d=N.ui._drag;if(d?.el&&host()?.contains(d.el))N.ui.cancelDrag();});
})();
const card=document.getElementById(ID);if(card){const dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);new MutationObserver(()=>card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA teaching helper'})).observe(card,{subtree:true,childList:true});}
})();
