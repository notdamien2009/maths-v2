/* NOVA F9-09 Quadratic Sequence · 2nd differences and a n² + b n + c. */
const F909_CONFIG={id:'F9-09',family:'F9',startMode:'watch',presets:{
 'Y8-021-quadratic-spotting':{label:'Y8 · Spot second differences',a:2,b:3,c:1,context:'First differences change. Second differences stay at four.'},
 'Y9-008-quadratic-structure':{label:'Y9 · Quadratic structure',a:1,b:-2,c:4,context:'The linear remainder can be negative.'},
 'KS3-perfect-squares':{label:'KS3 · Square pattern',a:1,b:2,c:1,context:'The square numbers 4, 9, 16, 25, 36 also form a quadratic sequence.'}
 },events:{value:['preset','position','coefficient','difference','remainder','challengeTask','placed'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F909_CONFIG,id=C.id;
const small=()=>innerWidth<=760, W=()=>small()?430:760;
const val=(p,n)=>p.a*n*n+p.b*n+p.c;
const signed=(n)=>n<0?'−'+Math.abs(n):'+'+n;
const eq=(p)=>`${p.a===1?'':p.a}n² ${p.b<0?'−':'+'} ${Math.abs(p.b)===1?'':Math.abs(p.b)}n ${p.c<0?'−':'+'} ${Math.abs(p.c)}`;
const ps=Object.keys(C.presets);const lead=C.presets[ps[0]];
const STEPS=[
 {name:'read-the-terms',preset:ps[0],phase:0,pose:'explain',text:'Six, fifteen, twenty-eight, forty-five, sixty-six. Notice how the gaps grow.',prompt:'Compare each pair of terms. Do the gaps stay the same?'},
 {name:'find-first-differences',preset:ps[0],phase:1,pose:'count',text:'The jumps are nine, thirteen, seventeen and twenty-one. The first differences are changing.',prompt:'What is happening to the jumps?'},
 {name:'constant-second-differences',preset:ps[0],phase:2,pose:'point-down',text:'The jumps increase by four each time. That constant second difference signals a quadratic pattern.',prompt:'Find the constant second difference.'},
 {name:'find-the-squared-part',preset:ps[0],phase:3,pose:'idea',text:'The second difference is twice the n-squared coefficient. Half of four is two.',prompt:'Why is the n-squared coefficient two, not four?'},
 {name:'subtract-the-squared-part',preset:ps[0],phase:4,pose:'think',text:'Take two n squared away from each term. The remainder is four, seven, ten, thirteen, sixteen.',prompt:'What simple linear rule remains?'},
 {name:'build-the-general-rule',preset:ps[0],phase:5,pose:'celebrate',text:'The remainder is three n plus one. Add back two n squared: that is the complete rule.',prompt:'Check the rule by finding the fifth term.'}
];
const TASKS=[
 {preset:ps[2],heading:'01 · Find the square pattern rule',guide:'4, 9, 16, 25, 36. Find a from the second differences, then find b and c.',options:{a:[1,2,3],b:[1,2,4],c:[0,1,2]}},
 {preset:ps[0],heading:'02 · Identify the quadratic coefficients',guide:'6, 15, 28, 45, 66. Use the second differences, then subtract a n².',options:{a:[2,4,1],b:[3,4,2],c:[0,2,1]}},
 {preset:ps[1],heading:'03 · Include the negative linear term',guide:'3, 4, 7, 12, 19. The remainder after removing n² is decreasing.',options:{a:[1,2,3],b:[-1,-2,2],c:[2,3,4]}}
];
let presetKey=ps[0],termCount=5,stepIndex=0,challengeIndex=0,placed={a:null,b:null,c:null},choice=null,stageRef=null,apiRef=null,statusRef=null;
function ev(k,v){if(!C.events.value.includes(k))throw Error('Unregistered F9-09 event '+k);N.events.emit('value',{engine:id,key:k,value:v});}
function txt(p,x,y,s,size=20,role='given',anchor='middle'){return N.chalkText(p,x,y,String(s),{size,role,anchor});}
function box(p,x,y,w,h,s,role='given',size=18){return N.neonBox(p,x,y,w,h,{role,text:s,size,r:12});}
function btn(s,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:s,onclick:fn});}
function root(alt,challenge=false){const svg=N.svg.root(W(),small()?(challenge?1115:940):(challenge?970:775),alt);svg.setAttribute('class','nv-svg f909-svg');svg.setAttribute('role','img');return svg;}
function clear(stage){stage.replaceChildren();N.cap(stage,'Sequence workshop','Quadratic sequence');}
function card(h,v,gold=false){return H('div',{class:'f909-card'+(gold?' f909-card--gold':'')},[H('div',{class:'f909-eyebrow',text:h}),H('div',{class:'f909-maths'+(gold?' f909-maths--gold':''),text:String(v)})]);}
function note(h,v){return H('div',{class:'f909-card f909-card--full'},[H('div',{class:'f909-eyebrow',text:h}),H('div',{class:'f909-body',text:String(v)})]);}
function mount(stage,svg,cards,pose,speech){stage.appendChild(H('div',{class:'f909-stage'},[svg,H('aside',{class:'f909-side'},cards)]));N.scene.helperStrip(stage,pose,speech);}
function numbers(p,count=5){return Array.from({length:count},(_,i)=>val(p,i+1));}
function differences(xs){return xs.slice(1).map((v,i)=>v-xs[i]);}
function chalkCell(svg,x,y,w,h,text,role='given',size=18){box(svg,x,y,w,h,text,role,size);}
function table(svg,p,phase,n=5,{challenge=false}={}){
 const sm=small(),w=W(),cw=sm?58:80,labelW=sm?100:134,x0=(w-labelW-5*cw)/2,top=sm?117:99,rowH=sm?62:56,gap=sm?8:8;
 const values=numbers(p),d1=differences(values),d2=differences(d1);
 const remainder=values.map((v,i)=>v-p.a*(i+1)*(i+1));
 const rows=[{label:'Position n',v:[1,2,3,4,5],seen:true,role:'given'},
 {label:'Term',v:values,seen:true,role:'given'},
 {label:'First Δ',v:d1,seen:phase>=1,role:'focus'},
 {label:'Second Δ',v:d2,seen:phase>=2,role:'result'},
 {label:'a n²',v:values.map((v,i)=>p.a*(i+1)*(i+1)),seen:phase>=3,role:'focus'},
 {label:'Remainder',v:remainder,seen:phase>=4,role:'result'}];
 rows.forEach((r,ri)=>{
  const y=top+ri*(rowH+gap),fs=sm?15:18,show=r.seen;
  chalkCell(svg,x0,y,labelW-5,rowH,r.label,'support',ri>=2&&sm?13:fs);
  r.v.forEach((v,ci)=>{const ix=x0+labelW+ci*cw;
   let text=show&&ci<n?String(v):'·'; if((ri===2&&ci>=4)||(ri===3&&ci>=3))text='';
   if(challenge && ri>=3 && !show)text='?';
   if(text)chalkCell(svg,ix,y,cw-6,rowH,text,show?r.role:'unknown',sm?18:21);
  });
 });
 return {x0,yEnd:top+rows.length*(rowH+gap)-gap,values,d1,d2,remainder};
}
function dot(svg,x,y,role='op',radius=4.5){return N.neonRing(svg,x,y,{role,r:radius,pulse:false});}
function squareDots(svg,x0,y0,n,role,spacing){for(let r=0;r<n;r++)for(let c=0;c<n;c++)dot(svg,x0+c*spacing,y0+r*spacing,role,4.3);}
function evidence(svg,p,phase,{position=2}={}){
 const sm=small(),w=W(),startY=sm?585:527;
 // The dot evidence is a concrete decomposition for n = 2. The square term uses a×(n×n) dots.
 if(phase<3){
  txt(svg,w/2,startY,'DOT PATTERN AT POSITION TWO',sm?20:23,'support');
  const dots=val(p,2),cols=5,spacing=22,rows=Math.ceil(dots/cols),x0=w/2-2*spacing,y0=startY+48;
  for(let i=0;i<dots;i++)dot(svg,x0+(i%cols)*spacing,y0+Math.floor(i/cols)*spacing,'op',4.2);
  txt(svg,w/2,startY+132,'Position 2 has '+dots+' dots',sm?18:22,'support');
  return;
 }
 txt(svg,w/2,startY,'A QUADRATIC HAS AN n² PART',sm?20:23,'support');
 const n=2, layers=p.a,delta=sm?72:82,startX=w/2-(layers*delta)/2+14;
 for(let layer=0;layer<Math.min(layers,3);layer++){
   const x=startX+layer*delta-14;
   squareDots(svg,x,startY+57,n,phase>=3?'focus':'op',22);
 }
 txt(svg,w/2,startY+132,`${p.a===1?'One':'Two'} 2 × 2 ${p.a===1?'square':'squares'} = ${p.a*4} dots`,sm?17:20,'support');
 if(phase>=4){
  txt(svg,w/2,startY+177,'Subtract a n² from the terms',sm?17:20,'support');
  const r1=val(p,1)-p.a,r2=val(p,2)-4*p.a;
  txt(svg,w/2,startY+219,`Remainder: ${r1}, ${r2}, ${val(p,3)-9*p.a}, ...`,sm?18:22,'result');
 }
 if(phase>=5){N.svg.pill(svg,w/2,startY+280,'T(n) = '+eq(p),{role:'focus',size:sm?18:23});}
}
function renderLearning(i,stage){stepIndex=i;const s=STEPS[i],p=C.presets[s.preset],w=W();clear(stage);
 const svg=root('Quadratic term table with first and second difference rows, square-dot evidence and a quadratic nth-term rule.');
 txt(svg,w/2,43,'LOOK FOR A CONSTANT SECOND DIFFERENCE',small()?19:25,'support');
 txt(svg,w/2,77,['Read each term','Compare the first jumps','Now compare the jumps','Half the second difference','Subtract the square part','Complete the nth-term rule'][i],small()?16:20,'support');
 const tb=table(svg,p,s.phase,5);
 evidence(svg,p,s.phase);
 const cards=[card('FIRST DIFFERENCES',i>=1?tb.d1.join(', '):'Not yet'),card('SECOND DIFFERENCE',i>=2?String(2*p.a):'Discover it',i>=2),note('WHY THIS WORKS',i<2?'An arithmetic sequence has constant first differences. This one does not.':i<4?'For T(n)=an²+bn+c, the second difference is always 2a.':i===4?'The remaining values form a linear sequence once an² is removed.':'Now T(n)=' + eq(p) + '. Check by substitution.')];
 if(i>=4)cards.splice(2,0,card('REMAINDER',tb.remainder.slice(0,4).join(', '),true));
 mount(stage,svg,cards,s.pose,s.text);
 if(!N.reducedMotion() && i>=1){
 const rows=[...svg.querySelectorAll('.nv-neon-box')].slice(6+Math.max(0,i-1)*5,11+Math.max(0,i-1)*5);
 rows.forEach((node,k)=>{node.style.opacity='.08';N.motion.tween(290+k*92,v=>{if(node.isConnected)node.style.opacity=String(.08+.92*v);},N.motion.ease.out);});
 }
}
function renderExplore(stage){clear(stage);const p=C.presets[presetKey],w=W(),svg=root('Explore quadratic sequences and their first and second differences.');
 txt(svg,w/2,43,'CHANGE THE TERMS · KEEP THE STRUCTURE',small()?19:25,'support');
 txt(svg,w/2,77,p.context,small()?15:19,'support');
 const tb=table(svg,p,5,termCount);
 evidence(svg,p,5);
 mount(stage,svg,[card('CONSTANT SECOND Δ',2*p.a,true),card('COEFFICIENT a',p.a),note('SQUARE PART',p.a+' × n²'),note('LINEAR REMAINDER',p.b+'n '+signed(p.c)+'. The remainder changes by '+p.b+' each time.'),note('CHECK',`T(${termCount}) = ${val(p,termCount)}`)],'point-down','Take away the square part. The leftover terms follow a linear rule.');
 ev('position',termCount);ev('preset',presetKey);
}
function currentTask(){return TASKS[challengeIndex];}
function currentP(){return C.presets[currentTask().preset];}
function slotPos(k){const sm=small(),w=W(),slotW=sm?98:140,gap=sm?18:35,x0=w/2-(1.5*slotW+gap),y=sm?620:558,idx={a:0,b:1,c:2}[k];return {x:x0+idx*(slotW+gap),y,w:slotW,h:60,id:k,kind:'drop'};}
function removeZone(){const sm=small();return {x:sm?23:135,y:sm?1051:898,w:sm?384:490,h:58,id:'remove',kind:'remove'};}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pid=e.pointerId;let done=false;
 const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
 function move(ev){if(done)return;if(N.ui._drag!==drag){clean();return;}if(ev.pointerId!==pid||g.contains(ev.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pid,clientX:ev.clientX,clientY:ev.clientY,buttons:ev.buttons}));}
 function up(ev){if(ev.pointerId!==pid)return;if(N.ui._drag===drag&&drag.up)drag.up(ev);clean();}
 function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function setStatus(s){if(statusRef)statusRef.textContent=s;}
function errorFor(k,v){const p=currentP(),correct=p[k];if(k==='a')return v===2*p.a?'Second difference is 2a. Divide it by two to find a.':'The coefficient a is half the constant second difference, not a first difference.';
 if(k==='b')return v===-correct?'Check the direction of the linear remainder. The sign of b matters.':'After subtracting a n², find the difference between consecutive remainders. That is b.';
 return v===val(p,1)?'c is not the first term. Subtract a and b at position one.':'Use term one: T(1) = a + b + c. Subtract a and b to find c.';}
function choose(k,v){choice={k,v};setStatus('Chosen '+k+' = '+v+'. Select the corresponding gap with Enter, or drag the card.');}
function place(k,v){const p=currentP();if(p[k]!==v){if(apiRef)apiRef.check(false,errorFor(k,v),{task:challengeIndex,coefficient:k,chosen:v});setStatus(errorFor(k,v));return false;}
 placed[k]=v;ev('placed',{slot:k,value:v});ev('coefficient',{k,v});drawChallenge();return true;}
function remove(k){placed[k]=null;ev('placed',{slot:k,value:null});drawChallenge();setStatus('Removed '+k+'. Drag or choose another card.');}
function source(svg,k,v,x,y,w,h){const g=E('g',{tabindex:0,role:'button','data-source':k+'-'+v,'aria-label':'Choose '+k+' equals '+v},svg);box(g,x,y,w,h,String(v),'focus',small()?21:25);
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(k,v);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[slotPos(k),removeZone()],onDrop:z=>z===k&&place(k,v),onRemove:()=>{setStatus('Use the red tray for cards already in the rule.');},removeTo:{x:W()/2,y:removeZone().y+20}});fastBridge(g);
}
function target(svg,k){const z=slotPos(k),v=placed[k];if(v!==null){const g=E('g',{tabindex:0,role:'button','data-placed':k,'aria-label':'Placed '+k+' equals '+v+'. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,String(v),'result',small()?24:29);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove(k);}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[removeZone()],onDrop:()=>false,onRemove:()=>remove(k),removeTo:{x:W()/2,y:removeZone().y+20}});fastBridge(g);return;}
 box(svg,z.x,z.y,z.w,z.h,'?', 'unknown',small()?24:29);
 const hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:12,fill:'transparent','data-slot':k,tabindex:0,role:'button','aria-label':'Place selected '+k+' coefficient here'},svg);
 function insert(){if(choice&&choice.k===k){place(k,choice.v);}else setStatus('Choose a card for '+k+' first.');}
 hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();insert();}});hit.addEventListener('click',insert);
}
function drawChallenge(){if(!stageRef)return;const p=currentP(),t=currentTask(),w=W();clear(stageRef);const svg=root('Quadratic sequence coefficient puzzle with draggable a, b and c cards.',true);
 txt(svg,w/2,43,'BUILD T(n) = an² + bn + c',small()?23:28,'support');
 txt(svg,w/2,81,'First differences → second differences → coefficient a',small()?15:20,'support');
 table(svg,p,2,5,{challenge:true});
 const start=small()?590:531;
 txt(svg,w/2,start,'FIT ALL THREE COEFFICIENTS',small()?19:25,'support');
 ['a','b','c'].forEach(k=>target(svg,k));
 txt(svg,w/2,small()?715:650,'CHOOSE A VALUE FOR EACH SLOT',small()?19:23,'support');
 const sm=small(),srcX=sm?24:116,cardW=sm?112:150,gap=sm?21:39;
 const config=[['a',t.options.a,small()?744:681],['b',t.options.b,small()?846:761],['c',t.options.c,small()?948:841]];
 config.forEach(([k,opts,y])=>{
  txt(svg,sm?27:117,y-8,k+'  ·  '+(k==='a'?'SQUARED':k==='b'?'LINEAR':'CONSTANT'),sm?15:18,'support','start');
  opts.forEach((v,j)=>{if(placed[k]===v)return;source(svg,k,v,srcX+j*(cardW+gap),y,cardW,54);});
 });
 const bin=removeZone();box(svg,bin.x,bin.y,bin.w,bin.h,'RED REMOVE TRAY','error',sm?18:20);
 mount(stageRef,svg,[card('SECOND DIFFERENCE',2*p.a,true),note('YOUR METHOD','Find a by halving the second difference. Then subtract a n² and find the linear remainder.'),note('KEYBOARD','Enter on a candidate, then Enter on a gap. Press Delete on a placed number to remove it.'),note('FINAL CHECK','Your three coefficients must recreate all five sequence terms.')],challengeIndex===2?'think':'point-down','The second difference fixes the squared part. Find the linear part next.');
}
const def={id,title:'Quadratic sequence',config:C,
 alt:'Quadratic sequence table showing terms, first differences, second differences, n squared contribution and linear remainder.',
 staticAlt:'For T(n)=an²+bn+c, the constant second difference equals 2a. Subtract an² from terms, then find b and c from the remaining linear sequence.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){renderLearning(i,stage);},
 exploreIntro:'Switch quadratic patterns and reveal how constant second differences determine the squared coefficient.',
 explore(panel,stage){presetKey=ps[0];termCount=5;const pre=H('div',{class:'f909-choices'}),info=H('p',{class:'f909-instruction',text:'Choose a sequence, then vary the number of revealed terms to compare differences and the rule.'});
  const rng=H('input',{type:'range',min:3,max:5,value:5,'aria-label':'Visible number of terms'}),out=H('output',{class:'f909-micro',text:'5 terms'});
  Object.entries(C.presets).forEach(([k,p])=>pre.appendChild(btn(p.label,()=>{presetKey=k;renderExplore(stage);},'nova-btn ghost')));
  rng.addEventListener('input',()=>{termCount=+rng.value;out.textContent=termCount+' terms';renderExplore(stage);});
  panel.append(info,pre,H('div',{class:'f909-control'},[H('label',{},['Terms ',rng]),out,btn('Show five terms',()=>{termCount=5;rng.value='5';out.textContent='5 terms';renderExplore(stage);},'nova-btn primary')]));renderExplore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placed={a:null,b:null,c:null};choice=null;stageRef=stage;apiRef=api;
  const heading=H('h3',{class:'f909-taskhead'}),guide=H('p',{class:'f909-instruction'}),controls=H('div',{class:'f909-control'}),status=H('p',{class:'f909-status',role:'status'});statusRef=status;
  function load(){const t=currentTask(),p=currentP();heading.textContent=t.heading;guide.textContent=t.guide;controls.replaceChildren();status.textContent='Build the expression by placing a, b and c.';api.fb.textContent='';api.fb.className='nova-fb';
   controls.append(btn('Check nth-term rule',()=>{
    if(['a','b','c'].some(k=>placed[k]!==p[k])){api.check(false,'Complete all three coefficient gaps. Check the second difference and the linear remainder.',{task:challengeIndex});return;}
    const verified=Array.from({length:5},(_,i)=>{const n=i+1;return placed.a*n*n+placed.b*n+placed.c===val(p,n);}).every(Boolean);
    if(!verified){api.check(false,'Check your rule against every position.',{task:challengeIndex});return;}
    api.check(true,'Correct. The full nth term is '+eq(p)+'. It matches all five terms.',{task:challengeIndex,score:challengeIndex+1});
    if(challengeIndex===2){heading.textContent='All three quadratic rules proven';guide.textContent='You found the constant second difference, isolated an² and completed each rule.';controls.replaceChildren(H('p',{class:'f909-maths f909-maths--gold',text:'3 / 3 · Quadratic rules proven'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
    controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed={a:null,b:null,c:null};choice=null;load();},'nova-btn primary'));
   },'nova-btn primary'),btn('Reset coefficients',()=>{placed={a:null,b:null,c:null};choice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('The second difference is twice a. Remove an² first; the remainder gives b and c.'),'nova-btn ghost'));
   ev('challengeTask',{index:challengeIndex});drawChallenge();
  }
  panel.append(heading,guide,controls,status);load();
 },
 onRestore(){presetKey=ps[0];termCount=5;challengeIndex=0;placed={a:null,b:null,c:null};choice=null;stageRef=null;apiRef=null;statusRef=null;}
};
N.registry.add({id,title:'Quadratic sequence',topics:['sequences','second differences','quadratic patterns','nth term'],deps:['F0-02','F0-04','F0-07','F0-08','F0-13']});
N.bankMount({id,num:'09',title:'Quadratic sequence · Premium Edition',def,linked:['F9-04','F9-05','F9-07','F9-08'],years:'Y8 quadratic spotting, Y9 quadratic structure and GCSE foundation bridge',spec:{
 purpose:'Identify constant second differences, derive a from 2a, subtract an² to find a linear remainder, then build T(n)=an²+bn+c.',
 params:'Integer a>0, integer b and c, positions 1–5; first differences and second differences; visual square-dot evidence.',
 presets:'Y8-021 Quadratic pattern spotting; Y9-008 Quadratic pattern structure; KS3 Square pattern (unnumbered extension).',
 steps:'Term row → first differences → constant second differences → a n² → linear remainder → full nth term.',
 interactions:'Watch, Guided, Explore presets/term reveal, Challenge draggable a/b/c coefficients with remove/re-grab/keyboard and three tasks.',
 traps:'Mistaking the second difference for a (instead of 2a), wrong sign of b, assuming c is term 1, stopping at an².',
 gcse:'Bridge to deriving quadratic nth terms via difference tables and checking the quadratic expression against terms.'
}});
window.F909_ENGINE=N.engines[id];
const component=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...component.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));component.appendChild(dev);
const heading=component.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>component.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(component,{childList:true,subtree:true});
})();
