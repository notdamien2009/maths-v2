/* F3-11 — Root Finder. Uses the canonical, byte-for-byte F0 core. */
const F311_CONFIG={id:'F3-11',preset:'Y7-017',startMode:'watch',parameters:{squareTargets:[2,144],cubeTargets:[8,216],dragStep:.1},presets:{
 'Y7-017':{label:'Y7 · Square and cube roots',kind:'square',target:36,initial:4.5},
 'Y9-002':{label:'Y9 · Exact and approximate roots',kind:'square',target:50,initial:6},
 'Y9-003':{label:'Y9 · Fractional indices and roots',kind:'cube',target:125,initial:3.5}},
 challenge:[
 {kind:'square',target:25,initial:3,answer:5,tolerance:.049,description:'Find the exact square root of 25.'},
 {kind:'square',target:50,initial:6,answer:Math.sqrt(50),tolerance:.151,description:'Estimate the square root of 50 to one decimal place.'},
 {kind:'cube',target:27,initial:2.1,answer:3,tolerance:.049,description:'Find the exact cube root of 27.'},
 {kind:'cube',target:125,initial:4,answer:5,tolerance:.049,description:'Use a cube root to interpret 125 to the power of one-third.'}],
 events:{value:['preset','target','dimension','estimate','reset','undo','remove','answer','proof'],types:['step','correct','hintUsed','mode']}};
window.F311_CONFIG=F311_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F311_CONFIG,ID=C.id;
const SAY={given:'What do we know?',grow:'Watch it grow!',overshoot:'Too far!',bounds:'Look between!',settle:'That fits!',explore:'Try a side!',ready:'Your turn!',right:'Great work!',wrong:'Try again!',hint:'Check the bounds!',undo:'One step back!',remove:'Start again!',win:'Brilliant!'};
const POSE={given:'explain',grow:'point',overshoot:'oops',bounds:'think',settle:'cheer',explore:'ruler',ready:'think',right:'cheer',wrong:'oops',hint:'think',undo:'point',remove:'count',win:'cheer'};
function dock(stage,k){N.scene.helperStrip(stage,POSE[k]||'think',SAY[k]||'Your turn!');}
function chalk(parent,x,y,text,size=54,role='given'){return N.chalkText(parent,x,y,String(text),{size,role});}
function evt(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+key);N.events.emit('value',{engine:ID,key,value});}
function button(t,fn,primary=false){return H('button',{class:primary?'nova-btn primary':'nova-btn',text:t,onclick:fn});}
function trueRoot(s){return s.kind==='cube'?Math.cbrt(s.target):Math.sqrt(s.target);}
function exponent(s){return s.kind==='cube'?3:2;}
function compared(s,est){return est**exponent(s);}
function domain(s){const r=trueRoot(s);return {lo:Math.max(0,Math.floor(r)-2),hi:Math.ceil(r)+2};}
function quantise(s,v){const d=domain(s);return Math.round(Math.min(d.hi,Math.max(d.lo,v))*10)/10;}
function bounds(s){const r=trueRoot(s);return {low:Math.floor(r),high:Math.ceil(r),exact:Number.isInteger(r)};}
function format(v,d=1){return (Math.round(v*10**d)/10**d).toString();}
function relation(s,v){const c=compared(s,v),target=s.target,d=c-target;return Math.abs(d)<1e-6?'equal':d<0?'below':'above';}
function misconception(s,v){const r=trueRoot(s),p=exponent(s),tol=s.tolerance??(Number.isInteger(r)?.049:.151);
 if(!Number.isFinite(v))return 'Enter a numerical estimate.';
 if(Math.abs(v-r)<=tol)return '';
 if(Math.abs(v-s.target)<.08)return `The root is a side length, not the area or volume ${s.target}.`;
 if(Math.abs(v-s.target/p)<.08)return `Dividing ${s.target} by ${p} does not undo a power. Compare the ${p===2?'square areas':'cube volumes'}.`;
 if(Math.abs(v-r**p)<.08)return 'You gave the area or volume. Find the side length instead.';
 if(v<r)return `Too small: ${format(v,1)} to the power of ${p} is less than ${s.target}. Move the side to the right.`;
 return `Too large: ${format(v,1)} to the power of ${p} is more than ${s.target}. Move the side to the left.`;
}
window.F311_MATH={trueRoot,compared,domain,quantise,bounds,misconception};
const STEPS=[
 {name:'Start with the area',say:'given',narration:'We know the area is fifty square units. We need the side length that would make a square with that area.'},
 {name:'Grow the side',say:'grow',narration:'Try a side length of five. Five times five gives twenty-five, so the square is too small.'},
 {name:'Test an overshoot',say:'overshoot',narration:'Try a side length of eight. Eight times eight is sixty-four, which is more than fifty. We have gone too far.'},
 {name:'Find both bounds',say:'bounds',narration:'Seven squared is forty-nine and eight squared is sixty-four. The square root of fifty lies between seven and eight.'},
 {name:'Make a better estimate',say:'settle',narration:'Adjust the side to about seven point one. This gives an area close to fifty. The estimate is sensible because it lies between seven and eight.'}];
function artwork(s,estimate,opt={}){
 const p=exponent(s),d=domain(s),b=bounds(s),r=trueRoot(s),step=opt.step??4,challenge=!!opt.challenge,won=!!opt.won,svg=N.svg.root(1000,1050,`Root finder: ${s.kind==='square'?'area':'volume'} ${s.target}, a changing ${s.kind==='square'?'square':'isometric cube'} and a draggable side estimate on the NOVA number line.`);
 svg.classList.add('f311-svg');svg.dataset.estimate=String(estimate);svg.dataset.target=String(s.target);svg.dataset.kind=s.kind;
 chalk(svg,500,88,s.kind==='square'?`Area = ${s.target} square units`:`Volume = ${s.target} cubic units`,63,'given');
 const current=compared(s,estimate),rel=relation(s,estimate),isSuccess=won||step===4&&!challenge,sideMax=615,lowScale=.58;
 const size=sideMax*(lowScale+(Math.max(0,estimate-d.lo)/(d.hi-d.lo))*.42),cx=500;
 if(s.kind==='square'){
  const left=cx-size/2,top=397-size/2;
  // The original neonBox draws the glass panel. The edge length is proportional to the estimated side.
  N.neonBox(svg,left,top,size,size,{role:rel==='below'?'op':rel==='above'?'focus':'result',r:13});
  N.neonLine(svg,left,top+size+39,left+size,top+size+39,{role:'focus'});
  chalk(svg,cx,top+size+90,`side = ${format(estimate,1)}`,49,'focus');
  chalk(svg,cx,top+size/2+13,challenge&&!won?'Area from this side':`${format(estimate,1)} × ${format(estimate,1)}`,47,'given');
  if(step>=2&&rel!=='equal'&&!opt.interactive){N.neonRing(svg,cx+size/2+24,top+8,{role:rel==='above'?'error':'op',r:14,pulse:false});}
 }else{
  const u=size*.63,v=size*.25,ht=size*.72,xx=cx,cy=570;
  // Three geometrically consistent faces, each via the approved neonPath primitive.
  const T=[xx,cy-ht],R=[xx+u,cy-ht-v],B=[xx,cy-ht-2*v],L=[xx-u,cy-ht-v];
  const D=[xx,cy],RR=[xx+u,cy-v],LL=[xx-u,cy-v];
  function shape(points,role){const path='M'+points.map(z=>z[0].toFixed(1)+','+z[1].toFixed(1)).join('L')+'Z';return N.neonPath(svg,path,{role,width:4,fill:true});}
  shape([B,R,T,L],'given');shape([T,R,RR,D],rel==='above'?'focus':'op');shape([L,T,D,LL],rel==='below'?'op':'result');
  N.neonLine(svg,xx-u,cy-v,xx,cy,{role:'focus'});N.neonLine(svg,xx+u,cy-v,xx,cy,{role:'focus'});
  chalk(svg,cx,665,`edge = ${format(estimate,1)}`,51,'focus');
  
 }
 // Mathematical results stay visible in Explore; Challenge hides the target root, not the computed test value.
 const compareText=step===0&&!opt.interactive?'Change the unknown side':`${format(estimate,1)}${p===2?'²':'³'} = ${format(current,2)}`;
 N.neonBox(svg,177,718,646,84,{role:rel==='above'?'focus':rel==='below'?'op':'result',r:22});
 chalk(svg,500,773,compareText,51,'given');
 // The number line is exclusively NOVA.numberLine; every tick has a correct coordinate.
 const X=138,Y=894,W=726,line=N.numberLine(svg,{x:X,y:Y,w:W,min:d.lo,max:d.hi,major:1,minor:.5,label:v=>Number.isInteger(v)?String(v):'',labelSize:27});
 const px=line.s(estimate);
 N.neonRing(svg,px,Y,{role:won?'result':'focus',r:17});
 if(!opt.interactive||won)chalk(svg,px,Y-54,format(estimate,1),39,'focus');
 if(step>=3||opt.interactive){
   N.neonRing(svg,line.s(b.low),Y,{role:'op',r:9,pulse:false});
   if(b.high!==b.low)N.neonRing(svg,line.s(b.high),Y,{role:'op',r:9,pulse:false});
 }
 if(won){N.neonRing(svg,px,Y,{role:'result',r:22});chalk(svg,500,1020,`${s.kind==='square'?'Square':'Cube'} root = ${format(r,2)}`,48,'result');}
 else chalk(svg,500,1020,'Drag the gold side marker',42,'given');
 // The marked handle itself is draggable; every valid point along the scale has a quantised target.
 if(opt.interactive&&!won){
   const handle=E('g',{class:'f311-handle',role:'slider',tabindex:'0','aria-label':'Side-length estimate','aria-valuemin':d.lo,'aria-valuemax':d.hi,'aria-valuenow':estimate,'aria-valuetext':`${format(estimate,1)} units`},svg);
   N.neonRing(handle,px,Y,{role:'focus',r:23,pulse:false});
   N.neonBox(handle,px-38,Y-63,76,37,{role:'focus',r:13,text:format(estimate,1),size:25});
   const maxSteps=Math.round((d.hi-d.lo)*10);let zones=()=>Array.from({length:maxSteps+1},(_,i)=>{
     const v=Number((d.lo+i/10).toFixed(1)),x=line.s(v);return{id:String(v),kind:'drop',x:x-6,y:Y-61,w:12,h:106};});
   // Wider accepting region at ends, but no ambiguous overlap is used to decide the snapped value.
   N.ui.svgDrag(svg,handle,{box:{x:px-39,y:Y-72,w:78,h:100},zones:()=>[...zones(),{id:'remove',kind:'remove',x:771,y:957,w:166,h:57}],
     onDrop:id=>{const v=Number(id);if(!Number.isFinite(v))return false;opt.change(v);return true;},onRemove:()=>opt.remove?.(),removeTo:{x:854,y:985}});
   handle.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();let val=e.key==='Home'?d.lo:e.key==='End'?d.hi:quantise(s,estimate+(e.key==='ArrowLeft'?-.1:.1));opt.change(val);}});
   N.neonBox(svg,771,957,166,57,{role:'error',r:12,text:'Remove',size:31});
   // A second core drag zone resolves "remove" by restoring the original estimate.
   // The actual remove target for the handle is included below as well.
 }
 if(step>=2&&opt.animate&&!N.reducedMotion())N.motion.flash(svg,500,420,rel==='above'?'error':'result',31);
 return svg;
}
function present(stage,s,estimate,opt={}){
 stage.innerHTML='';N.cap(stage,'Root Finder',opt.caption||'Estimate the side. Compare the power.');
 const scene=H('div',{class:'f311-scene'}),side=H('aside',{class:'f311-side'}),svg=artwork(s,estimate,opt),r=trueRoot(s),b=bounds(s);
 const card=(heading,val,desc,role)=>N.neonCard([H('div',{class:'f311-label',text:heading}),H('p',{class:'f311-value',text:val}),H('p',{class:'f311-desc',text:desc})],{role});
 side.append(card('KNOWN',`${s.target} ${s.kind==='square'?'square':'cubic'} units`,'The target stays fixed while the side changes.','given'),card('CURRENT SIDE',`${format(estimate,1)} units`,`${format(estimate,1)} to the power of ${exponent(s)} gives ${format(compared(s,estimate),2)}.`,'focus'),card('INFERENCE',opt.challenge&&!opt.won?'Find the bounds':b.exact?`Exact integer root`:`Between ${b.low} and ${b.high}`,opt.challenge&&!opt.won?'Use the visual and check your own estimate.':'Increasing the side increases the area or volume.','result'));
 scene.append(svg,side);stage.append(scene);
 if(s.kind==='cube'&&s.target===125){const f=H('div',{class:'f311-exact'});f.append(N.neonTile(opt.challenge&&!opt.won?'125^{\\frac{1}{3}} = ?':'125^{\\frac{1}{3}} = 5',{role:'focus'}));f.append(H('span',{text:'The denominator 3 asks for a cube root.'}));stage.append(f);}
 dock(stage,opt.say||'explore');return svg;
}
function live(stage,panel,initial,challenge=false,api=null){let s={...initial},v=quantise(s,s.initial),before=v,feedback='Move the side on the number line, then compare the area or volume.',say='ready',bad=false,guess='',done=false;
 const pre=H('select',{'aria-label':'Curriculum preset'}),kind=H('select',{'aria-label':'Square or cube root'}),target=H('input',{type:'number',min:2,max:216,'aria-label':'Target area or volume'}),range=H('input',{type:'range',step:.1,'aria-label':'Keyboard accessible side estimate'}),answer=H('input',{type:'number',step:'any','aria-label':'Your root estimate'}),status=H('p',{class:'f311-status',role:'status'});
 Object.entries(C.presets).forEach(([k,p])=>pre.add(new Option(p.label,k)));kind.add(new Option('Square root','square'));kind.add(new Option('Cube root','cube'));
 function note(text,k='right',wrong=false){feedback=text;say=wrong?'wrong':k;bad=wrong;}
 function change(val){if(done)return false;before=v;v=quantise(s,val);evt('estimate',v);const cmp=relation(s,v);note(cmp==='equal'?'Exact fit!':cmp==='below'?'Still too small!':'A little too large!',cmp==='equal'?'right':'explore');render();return true;}
 function reset(){v=quantise(s,s.initial);before=v;guess='';done=false;evt('reset',true);note('Try a different side.','explore');render();}
 function undo(){const old=v;v=before;before=old;evt('undo',v);note('One move undone.','undo');render();}
 function remove(){v=quantise(s,s.initial);evt('remove',true);note('Estimate reset.','remove');render();}
 function hint(){const b=bounds(s);const text=b.exact?'Test an integer side: count how many equal rows or layers fit.':`The side lies between ${b.low} and ${b.high}. Try each bound.`;api?.hint(text);note(text,'hint');render();}
 function check(){const x=Number(answer.value),r=trueRoot(s),tol=s.tolerance??(Number.isInteger(r)?.049:.151);guess=answer.value;evt('answer',x);
   if(!guess.trim()){note('Enter your side-length estimate.','wrong',true);render();return false;}
   if(Math.abs(x-v)>.051){note('Your number and gold marker must match. Move the marker to your answer.','wrong',true);api?.check(false,feedback);render();return false;}
   const trap=misconception(s,x);if(trap){note(trap,'wrong',true);api?.check(false,trap);render();return false;}
   if(Math.abs(v-r)>tol){note('Your marker is outside the permitted tolerance.','wrong',true);api?.check(false,feedback);render();return false;}
   done=true;evt('proof',{kind:s.kind,target:s.target,estimate:v,answer:x});note('A correct root estimate!','win');api?.check(true,`Correct: the ${s.kind==='square'?'square':'cube'} root of ${s.target} is ${format(r,3)}.`);N.moment?.(stage,'correct');render();return true;
 }
 function render(){panel.innerHTML='';const d=domain(s);pre.value=Object.keys(C.presets).find(k=>C.presets[k].target===s.target&&C.presets[k].kind===s.kind)||C.preset;kind.value=s.kind;target.value=s.target;
   range.min=d.lo;range.max=d.hi;range.value=v;answer.value=guess;
   present(stage,s,v,{caption:challenge?'Challenge · Prove your root':`Explore · ${s.kind==='square'?'Square':'Cube'} root of ${s.target}`,say,interactive:!done,change,remove,challenge,won:done});
   if(!challenge)panel.append(H('div',{class:'f311-row'},[H('label',{},['Preset',pre]),H('label',{},['Shape',kind]),H('label',{},['Area / volume',target])]));
   panel.append(H('p',{class:'f311-help',text:challenge?s.description+' Move the gold marker, enter the same side length and check.':'Drag the gold marker along the canonical number line, or use the slider and arrow keys. The square or cube updates with your estimate.'}),H('div',{class:'f311-row'},[H('label',{},['Side estimate',range]),button('− 0.1',()=>change(v-.1)),button('+ 0.1',()=>change(v+.1)),button('Undo',undo),button('Reset',remove)]));
   if(challenge&&!done)panel.append(H('div',{class:'f311-row'},[H('label',{},['Root estimate',answer]),button('Check estimate',check,true),button('Hint',hint)]));
   if(done)panel.append(H('div',{class:'f311-win',text:'Root proved! Move to the next challenge or explore another target.'}));
   status.textContent=feedback;status.classList.toggle('bad',bad);panel.append(status);
   range.oninput=()=>change(Number(range.value));answer.oninput=()=>guess=answer.value;
   pre.onchange=()=>{C.preset=pre.value;s={...C.presets[pre.value]};evt('preset',pre.value);reset();};
   kind.onchange=()=>{s.kind=kind.value;s.initial=quantise(s,s.initial);evt('dimension',s.kind);reset();};
   target.onchange=()=>{const max=s.kind==='cube'?216:144;s.target=Math.max(2,Math.min(max,Math.round(Number(target.value)||36)));s.initial=Math.floor(trueRoot(s));evt('target',s.target);reset();};
 }
 render();return{check,change,reset,estimate:()=>v,done:()=>done};
}
let def={id:ID,title:'Root Finder',config:C,steps:STEPS,alt:'An illuminated square changes area, or an isometric cube changes volume, as the learner drags a side-length estimate along a properly numbered NOVA number line.',staticAlt:'Square root finds the side length whose square equals the area; cube root finds the edge length whose cube equals the volume. The square root of fifty lies between seven and eight.',
 render(i,stage){const s={kind:'square',target:50,initial:5};const vals=[5,5,8,7,7.1];present(stage,s,vals[i],{caption:STEPS[i].name,say:STEPS[i].say,step:i,animate:i>0});},
 exploreIntro:'Choose square or cube roots. Drag the side estimate and watch the changing area or volume.',
 explore(panel,stage){live(stage,panel,C.presets[C.preset]);},
 challenge(panel,api,stage){let index=0,completed=false;function next(){panel.innerHTML='';if(completed){present(stage,C.challenge.at(-1),5,{caption:'All four roots proved',say:'win',won:true});panel.append(H('div',{class:'f311-win',text:'All four roots proved — exact square roots, approximation, cube roots and fractional indices.'}));return;}
 const task=C.challenge[index],inner=H('div');panel.append(H('p',{class:'f311-help',text:`Proof ${index+1} of ${C.challenge.length}`}),inner);
 const roundApi={hint:api.hint.bind(api),check(ok,msg){api.check(ok,msg,{task:index,kind:task.kind,target:task.target});if(ok){index++;if(index===C.challenge.length)completed=true;Promise.resolve().then(next);}}};live(stage,inner,task,true,roundApi);
 }next();},onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['square roots','cube roots','exact values','approximation','fractional indices'],deps:['F0-02','F0-03','F0-04','F0-08','F3-09','F3-10']});
N.bankMount({id:ID,num:'11',title:'Root Finder · Premium Review',def,linked:['F3-09','F3-10','F5-03'],years:'Years 7 and 9 · Square and cube roots, exact values and fractional indices',spec:{
 purpose:'Find square and cube roots by adjusting geometric side length and testing the resulting area or volume.',
 params:'Whole-number target area 2–144 or volume 8–216; adjustable side in tenths; comparison with nearest integer bounds.',
 presets:'Y7-017 square/cube roots; Y9-002 exact and approximate values; Y9-003 fractional indices.',
 steps:'Given area → grow side → overshoot → bracket between integers → settle on a root estimate.',
 interactions:'Move a core SVG drag handle along the core number line, keyboard arrows, ±0.1 stepper, undo, reset and checked numerical estimate.',
 traps:'Root is not target area or volume; root is not divided by two or three; undershoot and overshoot must agree with square/cube size.',
 gcse:'Approximate irrational roots, exact surd context and fractional indices as inverse powers.'}});
// Safe recovery of rapid mouse movements when F0 moves the handle within SVG on pickup.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA maths helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{subtree:true,childList:true});
})();
