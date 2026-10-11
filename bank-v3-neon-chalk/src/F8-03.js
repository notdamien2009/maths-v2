/* NOVA F8-03 · Function Machine · independent fresh Oct 2026 production.
   Underlying F8-03 engine supports future F8-02/F8-04 presets, never duplicate core. */
window.F803_CONFIG=Object.freeze({
 id:'F8-03',title:'Function Machine',family:'F8',startMode:'guided',preset:'Y7-028',
 parameters:{lessons:['Y7-028','Y7-030','Y7-033','Y8-016'],view:['forward','reverse'],twoStage:true},
 events:{value:['preset','input','rule','remove','output','variant','reset','direction'],system:['correct','step','mode','hintUsed']},
 references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F0-15','F7-12'],
 presetExtensions:['F7-12','F8-02','F8-04']
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.F803_CONFIG,ID=C.id;
const operations={
 m3:{label:'× 3',name:'multiply by three',type:'mul',n:3},a2:{label:'+ 2',name:'add two',type:'add',n:2},
 m2:{label:'× 2',name:'multiply by two',type:'mul',n:2},a5:{label:'+ 5',name:'add five',type:'add',n:5},
 a3:{label:'+ 3',name:'add three',type:'add',n:3},m5:{label:'× 5',name:'multiply by five',type:'mul',n:5},
 s4:{label:'− 4',name:'subtract four',type:'sub',n:4},s3:{label:'− 3',name:'subtract three',type:'sub',n:3},
 d2:{label:'÷ 2',name:'divide by two',type:'div',n:2},a4:{label:'+ 4',name:'add four',type:'add',n:4},
 d5:{label:'÷ 5',name:'divide by five',type:'div',n:5},s2:{label:'− 2',name:'subtract two',type:'sub',n:2},
 m4:{label:'× 4',name:'multiply by four',type:'mul',n:4}
};
const lessons={
 'Y7-028':{title:'Algebraic notation',sub:'FROM A VALUE TO AN EXPRESSION',rule:'y = 3x + 2',ops:['m3','a2'],inputs:[1,2,3,4],chosen:4,
  question:'What does three times a number, then add two mean?',teacher:['A letter can stand for a number. The machine shows what three x plus two means.','Three lots of the input are made first, rather than adding three.','Add two after multiplication. The order of the gears matters.','Match every input with the output. The same rule works for every row.'],
  short:['Read the rule!','Three groups first!','Now add two!','One rule, many values!'],pose:['explain','count','point-right','celebrate'],
  challenge:{input:3,want:11,opPool:['m3','a2','a3','m2'],trap:'Multiplication and addition are not interchangeable. Multiply the input by three first, then add two.'}},
 'Y7-030':{title:'Substitution into formulae',sub:'PUT THE NUMBER IN FOR x',rule:'y = 2x + 5',ops:['m2','a5'],inputs:[-2,0,3,5],chosen:3,
  question:'When x is three, what does the formula give?',teacher:['The input number replaces x. Read two x plus five as multiply, then add.','Two times three gives six. Substitution must respect the operation.','Add five to the result from the first gear.','Try other x values. Negative inputs are allowed too.'],
  short:['Replace x!','Multiply first!','Add five!','Check each pair!'],pose:['explain','count','point-right','celebrate'],
  challenge:{input:5,want:15,opPool:['m2','a5','a2','m3'],trap:'Substitution follows the written rule. Two times five plus five is fifteen.'}},
 'Y7-033':{title:'Inverse operations',sub:'UNDO AN EQUATION',rule:'2x + 3 = 15',ops:['m2','a3'],reverseOps:['s3','d2'],reverse:true,inputs:[3,5,6,9],chosen:6,
  question:'Which input gives an output of fifteen?',teacher:['A two-step equation can be read through a function machine. We know its output.','To go backwards, undo the last operation first: subtract three.','Next undo multiplication by two, by dividing by two.','Check by running the answer forwards: twice six plus three is fifteen.'],
  short:['Start at fifteen!','Undo plus three!','Now divide by two!','Check it forwards!'],pose:['think','point-left','count','celebrate'],
  challenge:{givenOutput:19,want:8,opPool:['s3','d2','a3','m2'],trap:'Inverse operations go in reverse order. Start by subtracting three; only then divide by two.'}},
 'Y8-016':{title:'Rearranging formulae',sub:'MAKE x THE SUBJECT',rule:'y = 5x − 4',ops:['m5','s4'],reverseOps:['a4','d5'],reverse:true,inputs:[1,3,5,7],chosen:5,
  question:'If y is twenty-one, how can we recover x?',teacher:['We want to make x the subject. Work backwards from the value of y.','Undo subtract four by adding four to the output.','Undo multiply by five by dividing by five.','The recovered input is five. Put it back into the original formula to verify.'],
  short:['Find the input!','Undo subtraction!','Divide by five!','Prove it forwards!'],pose:['think','point-left','count','celebrate'],
  challenge:{givenOutput:31,want:7,opPool:['a4','d5','s4','m5'],trap:'To rearrange y equals five x minus four, add four first and divide by five second.'}}
};
const lessonIds=Object.keys(lessons);
let active={preset:'Y7-028',mode:'guided',view:'forward',runInput:null,slots:[null,null],phase:0,challengeIndex:0};
function apply(id,x){const o=operations[id];if(!o)return null;switch(o.type){case 'mul':return x*o.n;case 'div':return x/o.n;case 'add':return x+o.n;case 'sub':return x-o.n;}};
function calc(x,ids){return ids.reduce((v,id)=>v==null?null:apply(id,v),x);}
function expectedForward(p,x){return calc(x,p.ops);}
function currentOps(p){return p.reverse?p.reverseOps:p.ops;}
function correctInput(p){return p.chosen;}
function challengeTarget(p){return p.challenge.want;}
function emit(k,v){if(!C.events.value.includes(k))throw Error('Unregistered F8-03 value event '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
function userResult(input,slots){return input===null||slots.some(x=>!x)?null:calc(input,slots);}
function coords(){return innerWidth<=760?{
 w:440,h:1150,m:true,hopper:{x:115,y:190,w:212,h:113},body:{x:28,y:344,w:385,h:283},gear:[[128,465],[302,465]],slot:[[49,533],[228,533]],out:{x:125,y:694,w:190,h:86},table:{x:30,y:795,w:380,h:153},tray:[{x:25,y:75},{x:126,y:75},{x:227,y:75},{x:328,y:75}],ruleTray:[[38,995],[139,995],[240,995],[341,995]],remove:{x:25,y:1085,w:390,h:46}
 }:{w:1090,h:710,m:false,hopper:{x:55,y:184,w:199,h:130},body:{x:288,y:155,w:516,h:332},gear:[[434,304],[658,304]],slot:[[330,380],[577,380]],out:{x:849,y:205,w:198,h:131},table:{x:73,y:516,w:933,h:133},tray:[{x:50,y:86},{x:162,y:86},{x:274,y:86},{x:386,y:86}],ruleTray:[[570,87],[693,87],[816,87],[939,87]],remove:{x:873,y:657,w:182,h:43}};}
function tx(p,x,y,value,role='given',size=24,anchor='middle'){const t=N.chalkText(p,x,y,String(value),{role,size,anchor});t.setAttribute('text-anchor',anchor);return t;}
function box(p,x,y,w,h,role='given',rad=15){return N.neonBox(p,x,y,w,h,{role,r:rad});}
function line(p,a,b,c,d,role='given',width=3){return N.neonLine(p,a,b,c,d,{role,width});}
function svgButton(g,aria,fn){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',aria);g.classList.add('f803-pickable');g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});g.addEventListener('click',fn);}
/* Restore pointer capture after F0 drag helper lifts a nested SVG card to the SVG root.
   Without this local step, Chromium can lose capture across SVG DOM reparenting. */
function repairCapture(el){el.addEventListener('pointerdown',e=>{try{el.setPointerCapture(e.pointerId);}catch(_){}});}
function arcPath(cx,cy,r,start,end){const a=start*Math.PI/180,b=end*Math.PI/180;const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b);return `M ${x1} ${y1} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${x2} ${y2}`;}
function gear(svg,cx,cy,rad,role,index,on){
 const teeth=12,pts=[];for(let i=0;i<teeth*4;i++){const ang=(i/(teeth*4))*Math.PI*2-Math.PI/2, rr=(i%4===1||i%4===2)?rad:rad*.88;pts.push([cx+rr*Math.cos(ang),cy+rr*Math.sin(ang)]);}const path='M '+pts.map(v=>v.map(n=>n.toFixed(1)).join(',')).join(' L ')+' Z';
 const outer=N.neonPath(svg,path,{role,width:3,fill:'rgba(11,29,51,.78)'});outer.classList.add('f803-gear');outer.setAttribute('data-gear',String(index));
 N.neonPath(svg,`M ${cx-rad*.49},${cy} a ${rad*.49},${rad*.49} 0 1,0 ${rad*.98},0 a ${rad*.49},${rad*.49} 0 1,0 ${-rad*.98},0`,{role:'support',width:2.5});
 
 return outer;
}
function paint(model={}){
 const p=lessons[model.preset||active.preset],V=coords(),mode=model.mode||active.mode,phase=model.phase??3,interactive=(mode==='explore'||mode==='challenge'),challenge=mode==='challenge';
 const given=challenge?(p.challenge.givenOutput??p.challenge.input):(p.reverse?expectedForward(p,p.chosen):p.chosen);
 const input=interactive?(model.input??null):given;
 const correctOps=currentOps(p),slots=interactive?(model.slots||[null,null]):correctOps.map((v,i)=>phase>=i+1?v:null);
 const pool=challenge?p.challenge.opPool:Array.from(new Set([...correctOps,...p.challenge.opPool]));
 const shownIn=!interactive||input!==null,showGear=interactive||phase>=1,showOut=interactive?userResult(input,slots)!==null:phase>=2;
 const outcome=interactive?userResult(input,slots):calc(given,correctOps);
 const reveal=challenge?Boolean(model.solved):true;
 const stage=model.stage;stage.innerHTML='';stage.classList.add('f803-stage');
 N.cap(stage,'F8-03 · '+p.title,challenge?'FIND THE RULE AND OUTPUT':mode==='explore'?'BUILD AND TEST':'FOLLOW THE FUNCTION');
 const svg=N.svg.root(V.w,V.h,p.title+' machine: input hopper, two operation gears, an output chute and a value table.');svg.classList.add('f803-svg');svg.setAttribute('data-preset',model.preset||active.preset);svg.setAttribute('data-mode',mode);svg.setAttribute('data-phase',String(phase));
 const cap=V.m?22:29;tx(svg,V.m?220:542,cap,p.sub,'support',V.m?22:27);
 const tray=V.tray,chipW=V.m?86:98,chipH=V.m?57:58;
 if(V.m){box(svg,V.remove.x,V.remove.y,V.remove.w,V.remove.h,'focus',11);tx(svg,220,V.remove.y+31,'RETURN / CLEAR','focus',18);}else{box(svg,V.remove.x,V.remove.y,V.remove.w,V.remove.h,'focus',10);tx(svg,V.remove.x+V.remove.w/2,V.remove.y+29,'RETURN / CLEAR','focus',16);}
 const inputChoices=challenge?[p.challenge.givenOutput??p.challenge.input]:(p.reverse?p.inputs.map(x=>expectedForward(p,x)):p.inputs);
 const inputCards=inputChoices.map((number,i)=>({number,i,x:tray[i%4].x,y:tray[i%4].y}));
 for(const c of inputCards){let assigned=interactive&&input===c.number,px=assigned?(V.hopper.x+V.hopper.w/2-chipW/2):c.x,py=assigned?(V.hopper.y+35):c.y;
  if(!interactive&&phase>0&&c.number===given){px=V.hopper.x+V.hopper.w/2-chipW/2;py=V.hopper.y+35;assigned=true;}
  const g=E('g',{'data-input':String(c.number),'data-placed':assigned?'hopper':'tray'},svg);
  box(g,px,py,chipW,chipH,assigned?'result':'given',13);tx(g,px+chipW/2,py+37,c.number,'given',V.m?32:33);
  if(interactive&&(!assigned||mode==='explore')){const choose=()=>{if(assigned){model.onRemoveInput&&model.onRemoveInput();}else{model.onInput&&model.onInput(c.number);}};svgButton(g,assigned?'Placed input '+c.number+'. Press Enter or Delete to remove.':'Input '+c.number+'. Place in hopper.',choose);if(assigned)g.addEventListener('keydown',ev=>{if(['Delete','Backspace'].includes(ev.key)){ev.preventDefault();model.onRemoveInput&&model.onRemoveInput();}});
   N.ui.svgDrag(svg,g,{box:{x:px,y:py,w:chipW,h:chipH},zones:()=>assigned?[{id:'return',kind:'remove',...V.remove}]:[{id:'hopper',kind:'drop',...V.hopper},{id:'return',kind:'remove',...V.remove}],onDrop:id=>{if(id==='hopper'){choose();return true;}return false;},onRemove:()=>model.onRemoveInput&&model.onRemoveInput()});repairCapture(g);
  }
 }
 tx(svg,V.hopper.x+V.hopper.w/2,V.hopper.y-16,V.m?'INPUT HOPPER':'INPUT  →  HOPPER','support',V.m?19:19);
 // Hopper: open mouth with luminous walls, not a flat boxed diagram.
 const hx=V.hopper.x,hy=V.hopper.y,hw=V.hopper.w,hh=V.hopper.h;
 const funnel=`M ${hx+20},${hy+4} L ${hx+hw-20},${hy+4} L ${hx+hw-65},${hy+hh-12} L ${hx+65},${hy+hh-12} Z`;
 const funnelEl=N.neonPath(svg,funnel,{role:'given',width:3.7,fill:'rgba(28,74,104,.12)'});funnelEl.classList.add('f803-funnel');funnelEl.style.pointerEvents='none';
 if(!V.m){line(svg,hx+hw-8,hy+hh/2,V.body.x-4,V.body.y+85,'support',4);}
 else {line(svg,220,hy+hh,220,V.body.y-3,'support',4);}
 // The machine occupies most of the central stage, with actual gears and drop wells.
 box(svg,V.body.x,V.body.y,V.body.w,V.body.h,'given',30);
 box(svg,V.body.x+13,V.body.y+13,V.body.w-26,V.body.h-26,'support',20);
 tx(svg,V.body.x+V.body.w/2,V.body.y+41,'NOVA FUNCTION ENGINE','support',V.m?19:25);
 for(let i=0;i<2;i++){
  const [cx,cy]=V.gear[i];gear(svg,cx,cy,V.m?59:82,i?'op':'focus',i,showGear&&(!interactive||Boolean(slots[i])));
  tx(svg,cx,cy+7,(interactive?slots[i]:phase>=i+1?correctOps[i]:null)?operations[(interactive?slots[i]:correctOps[i])].label:'?',(interactive?slots[i]:phase>=i+1?correctOps[i]:null)?'given':'unknown',V.m?29:39);
 }
 line(svg,V.gear[0][0]+(V.m?68:91),V.gear[0][1],V.gear[1][0]-(V.m?68:91),V.gear[1][1],'result',3);
 const ruleDest=[];for(let i=0;i<2;i++){const [x,y]=V.slot[i],w=V.m?160:197,h=V.m?60:62;ruleDest.push({x,y,w,h});box(svg,x,y,w,h,slots[i]?'result':'op',15);tx(svg,x+w/2,y+20,'RULE '+(i+1),'support',V.m?16:19);
 tx(svg,x+w/2,y+48,slots[i]?operations[slots[i]].label:'DROP RULE',slots[i]?'result':'unknown',V.m?25:24);
 if(interactive&&slots[i]){const g=E('g',{'data-placed-rule':String(i),'data-rule':slots[i]},svg);box(g,x,y,w,h,'result',13);tx(g,x+w/2,y+42,operations[slots[i]].label,'result',V.m?25:27);
 svgButton(g,'Placed '+operations[slots[i]].name+'. Press Delete or Enter to remove.',()=>model.onRemoveRule&&model.onRemoveRule(i));g.addEventListener('keydown',ev=>{if(['Delete','Backspace'].includes(ev.key)){ev.preventDefault();model.onRemoveRule&&model.onRemoveRule(i);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[{id:'return',kind:'remove',...V.remove}],onRemove:()=>model.onRemoveRule&&model.onRemoveRule(i)});repairCapture(g);
 }}
 if(!V.m){line(svg,V.body.x+V.body.w+7,V.body.y+165,V.out.x-8,V.body.y+165,'result',4);}else line(svg,220,V.body.y+V.body.h+4,220,V.out.y-10,'result',4);
 const outputBox=V.out;box(svg,outputBox.x,outputBox.y,outputBox.w,outputBox.h,showOut?'result':'focus',21);
 tx(svg,outputBox.x+outputBox.w/2,outputBox.y+30,p.reverse?'RECOVER x':'OUTPUT y','support',V.m?17:20);
 const finalLabel=!showOut||!reveal?'?':Math.abs(outcome)<=1e9&&outcome!==null?String(outcome):'?';
 tx(svg,outputBox.x+outputBox.w/2,outputBox.y+(V.m?69:91),finalLabel,showOut&&reveal?'result':'unknown',V.m?41:54);
 if(V.m){line(svg,220,outputBox.y+outputBox.h+4,220,V.table.y-8,'support',2.6);}
 // Rounded-glass table: visible rules, not a list of arbitrary unrelated answers.
 box(svg,V.table.x,V.table.y,V.table.w,V.table.h,'support',16);
 tx(svg,V.table.x+V.table.w/2,V.table.y+26,challenge?'WHAT VALUE GOES THROUGH THE MACHINE?':'INPUT → OUTPUT TABLE','support',V.m?17:20);
 const rowLabels=challenge?[[p.reverse?'y':'x',given],[p.reverse?'x':'y',model.solved?outcome:'?']]:p.inputs.slice(0,4).map(x=>{const val=p.reverse?expectedForward(p,x):x;const output=interactive?(slots.every(Boolean)?calc(val,slots):null):(phase===3?calc(val,correctOps):null);return [val,output];});
 if(challenge){tx(svg,V.table.x+V.table.w*.3,V.table.y+91,`${rowLabels[0][0]} = ${rowLabels[0][1]}`,'given',V.m?26:32);tx(svg,V.table.x+V.table.w*.73,V.table.y+91,`${rowLabels[1][0]} = ${rowLabels[1][1]}`,model.solved?'result':'unknown',V.m?26:32);}
 else{for(let i=0;i<4;i++){const [x,out]=rowLabels[i],colX=V.table.x+(i+.5)*V.table.w/4;tx(svg,colX,V.table.y+63,String(x),'given',V.m?26:30);if(out!==null)tx(svg,colX,V.table.y+104,String(out),'result',V.m?27:30);else tx(svg,colX,V.table.y+104,'?','unknown',V.m?26:29);}tx(svg,V.table.x+11,V.table.y+61,p.reverse?'y':'x','support',V.m?15:18,'start');tx(svg,V.table.x+11,V.table.y+105,p.reverse?'x':'y','support',V.m?15:18,'start');}
 // Operation cards, only on interactive screens; the machine's insets are their snap zones.
 if(interactive){for(let i=0;i<pool.length;i++){
  const key=pool[i],g=E('g',{'data-rule-card':key,'data-placed':'tray'},svg),pos=V.ruleTray[i%4],rw=V.m?87:110,rh=V.m?54:55;
  box(g,pos[0],pos[1],rw,rh,i<2?'op':'given',12);tx(g,pos[0]+rw/2,pos[1]+37,operations[key].label,'given',V.m?27:29);
  const choose=()=>{const free=(model.slots||[null,null]).findIndex(v=>v===null);model.onRule&&model.onRule(key,free<0?0:free);};
  svgButton(g,'Rule card '+operations[key].name+'. Enter to place in next empty gear.',choose);
  N.ui.svgDrag(svg,g,{box:{x:pos[0],y:pos[1],w:rw,h:rh},zones:()=>ruleDest.map((r,j)=>({id:String(j),kind:'drop',...r})).concat([{id:'return',kind:'remove',...V.remove}]),onDrop:id=>{model.onRule&&model.onRule(key,+id);return true;},onRemove:()=>{}});repairCapture(g);
  }
  if(V.m)tx(svg,220,V.ruleTray[0][1]-10,'DRAG RULE CARDS INTO THE GEARS','support',16);
  else tx(svg,V.ruleTray[0][0]+235,V.ruleTray[0][1]-12,'RULE CARD TRAY · DRAG INTO THE GEARS','support',17);
 }
 stage.appendChild(svg);
 const reactions=mode==='challenge'?(model.solved?'That rule checks out!':'Prove the whole rule.'):mode==='explore'?(showOut?'The output follows your rule.':input===null?'Choose an input first!':'Now place the two rules!'):p.short[Math.min(phase,3)];
 N.scene.helperStrip(stage,model.solved?'celebrate':p.pose[Math.min(phase,3)],reactions);
 const statement=H('div',{class:'f803-proof'});
 const why=mode==='challenge'?'Place both rules and provide the final value. The output stays hidden until your answer is marked.':mode==='explore'?'Try other inputs or change an operation. The table keeps showing the selected formula.':p.teacher[Math.min(phase,3)];
 statement.appendChild(H('strong',{text:mode==='challenge'?'Prove your rule':mode==='explore'?'Explore the machine':'Mathematical evidence'}));statement.appendChild(H('span',{text:why}));stage.appendChild(statement);
 if(challenge&&N.helperImg){const im=N.helperImg(model.solved?'victory':'read-tablet','teen');const row=H('div',{class:'f803-peer','aria-label':'Izaac, your challenge peer'});row.appendChild(H('span',{text:model.solved?'Izaac · You proved it!':'Izaac · Show me the method.'}));row.appendChild(H('img',{src:im.src,alt:im.alt,width:70,height:70}));stage.appendChild(row);}
 if(mode==='guided'&&phase>0){const g=svg.querySelector('[data-gear="'+(phase===1?0:1)+'"]');if(g&&g.isConnected&&!N.reducedMotion()){const c=V.gear[phase===1?0:1];N.motion.flash(svg,c[0],c[1],phase===1?'focus':'op',50);}}
 return svg;
}
function spec(){return {purpose:'Turn algebraic rules into a visible two-stage input/output machine, including inverse reasoning.',params:'Input number, two ordered operation rules, direction, table values and challenge targets.',presets:'Y7-028 Algebraic notation; Y7-030 Substitution; Y7-033 Inverse operations; Y8-016 Rearranging formulae. Shared engine designed for F7-12/F8-02/F8-04 presets.',steps:'Drop input → First gear → Second gear / output → Add value to the x/y table.',interactions:'Drag input cards to hopper; drag rule cards to either of two gear wells; regrab and return cards; keyboard Enter and Delete; Challenge marks rule and computed value.',traps:'Reversing operation order, treating 3x as x+3, combining numbers incorrectly, and using forward operations when solving backwards.',gcse:'Extension-compatible with chained rules, algebraic inverse notation and composition; later presets reuse this engine.'};}
const STEPS=[{name:'Feed a number',prompt:'What is the input?',narration:'Read the rule carefully. An input enters the hopper.'},
 {name:'Turn the first gear',prompt:'What happens first?',narration:'The first gear applies the first operation.'},
 {name:'Turn the second gear',prompt:'What happens next?',narration:'The second operation uses the result from the first gear.'},
 {name:'Build the value table',prompt:'Does the rule work for every input?',narration:'Each input has exactly one output for this rule.'}];
function narration(i){const p=lessons[active.preset];return p.teacher[Math.min(3,i)];}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:'Y7-028'},steps:STEPS.map((o,i)=>Object.defineProperty({...o},'narration',{get:()=>narration(i),enumerable:true})),alt:'Neon two-gear function machine with input, output and a table of values.',staticAlt:'For a rule with two operations, apply the first operation to an input, then the second, to get its output.',
 render(i,stage){active.phase=i;paint({stage,phase:i,preset:active.preset,mode:active.mode});},
 exploreIntro:'Build the machine by placing a number and two operation cards.',
 explore(panel,stage,api){active.mode='explore';let input=null,slots=[null,null];const controls=H('div',{class:'f803-ctrl'}),picker=H('select',{class:'f803-select','aria-label':'Choose lesson preset'}),reset=H('button',{class:'nova-btn',text:'Reset machine'}),swap=H('button',{class:'nova-btn ghost',text:'Explore inverse'}),status=H('div',{class:'f803-feedback','aria-live':'polite'});
  lessonIds.forEach(id=>picker.appendChild(H('option',{value:id,text:lessons[id].title})));picker.value=active.preset;
  function draw(message){const p=lessons[active.preset];paint({stage,preset:active.preset,mode:'explore',phase:3,input,slots,onInput:n=>{input=n;emit('input',n);draw('Number placed. Now choose the first rule.');},onRule:(key,index)=>{if(index<0||index>1)return;slots[index]=key;emit('rule',{slot:index,operation:key});draw('Gear '+(index+1)+' set to '+operations[key].label+'.');},onRemoveInput:()=>{input=null;emit('remove','input');draw('Input returned to tray.');},onRemoveRule:i=>{slots[i]=null;emit('remove','rule-'+i);draw('Rule returned to tray.');}});const completed=slots.every(Boolean)&&input!==null;status.textContent=(message?message+' ':'')+(completed?'Output: '+userResult(input,slots)+'. Change a rule to test another function.':input===null?'Choose an input card and put it in the hopper.':'Now place one rule card in each gear.');status.dataset.status=slots.every(Boolean)&&input!==null?'correct':'';}
  picker.onchange=()=>{active.preset=picker.value;input=null;slots=[null,null];emit('preset',active.preset);draw('New lesson preset selected.');};
  reset.onclick=()=>{input=null;slots=[null,null];emit('reset',true);draw('Everything returned to the tray.');};
  swap.onclick=()=>{active.preset=lessons[active.preset].reverse?'Y7-028':'Y7-033';picker.value=active.preset;input=null;slots=[null,null];emit('direction',lessons[active.preset].reverse?'reverse':'forward');draw(lessons[active.preset].reverse?'Work backwards through inverse operations.':'Explore a forward rule.');};
  controls.appendChild(H('label',{text:'Lesson preset'}));controls.appendChild(picker);controls.appendChild(reset);controls.appendChild(swap);panel.appendChild(controls);panel.appendChild(status);draw();},
 challenge(panel,api,stage){active.mode='challenge';let task=0,slots=[null,null],guess='',done=false,wrong=0;
  const heading=H('div',{class:'f803-challenge-heading'}),ctrl=H('div',{class:'f803-challenge-controls'}),field=H('input',{class:'f803-number','aria-label':'Your final output or recovered input',type:'number',inputmode:'decimal',placeholder:'Final value'}),check=H('button',{class:'nova-btn primary',text:'Check rule and value'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),next=H('button',{class:'nova-btn',text:'Next function'}),status=H('div',{class:'f803-feedback','aria-live':'polite'});
  next.hidden=true;next.style.display='none';
  function redraw(message,good){const p=lessons[lessonIds[task]],given=p.challenge.givenOutput??p.challenge.input;active.preset=lessonIds[task];const displayInput=given;
    paint({stage,preset:active.preset,mode:'challenge',phase:3,input:displayInput,slots,solved:done,onInput:()=>{},onRule:(key,i)=>{if(done)return;slots[i]=key;emit('rule',{slot:i,operation:key});redraw('Rule '+(i+1)+' selected.');},onRemoveRule:i=>{if(done)return;slots[i]=null;emit('remove','rule-'+i);redraw('Rule removed.');}});
    heading.textContent='Challenge '+(task+1)+' of '+lessonIds.length+' · '+p.title+' · '+(p.reverse?'Recover the input x':'Calculate the output y');
    status.textContent=message||'Drag the two rules into the gears, then enter the missing value.';status.dataset.status=good?'correct':message?'warning':'';
    check.disabled=done;next.hidden=!done;next.style.display=done?'':'none';}
  check.onclick=()=>{if(done)return;const p=lessons[lessonIds[task]],exp=currentOps(p),target=challengeTarget(p);
    if(slots.some(x=>x===null)){status.textContent='Place an operation card in both gear wells.';status.dataset.status='wrong';return;}
    const wrongSlot=slots.findIndex((x,i)=>x!==exp[i]);if(wrongSlot>=0){wrong++;const expected=exp[wrongSlot],got=slots[wrongSlot];status.textContent=wrongSlot===0?'Check the first operation. '+p.challenge.trap:'The second gear acts on the first gear’s result. '+p.challenge.trap;status.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,reason:'rule',step:wrongSlot,selected:got});return;}
    const val=field.value.trim(),n=Number(val);if(!val||!Number.isFinite(n)||n!==target){wrong++;status.textContent='Both operation cards are right. '+(p.reverse?'Reverse the last operation first and check your recovered input.':'Carry out the first multiplication, then the second operation.');status.dataset.status='wrong';N.events.emit('correct',{engine:ID,correct:false,reason:'value'});return;}
    done=true;emit('output',target);N.events.emit('correct',{engine:ID,correct:true,task:task,value:n});redraw('Correct. Your operations and calculated value agree.',true);
  };
  hint.onclick=()=>api.hint(lessons[lessonIds[task]].reverse?'The inverse sequence undoes the last forward operation first.':'Read the formula from left to right: multiply before adding or subtracting.');
  next.onclick=()=>{if(!done)return;if(task<lessonIds.length-1){task++;slots=[null,null];done=false;field.value='';redraw();}else{status.textContent='All four function machines proved. '+wrong+' incorrect checks were resolved.';next.disabled=true;next.style.display='none';}};
  ctrl.appendChild(field);ctrl.appendChild(check);ctrl.appendChild(hint);ctrl.appendChild(next);panel.appendChild(heading);panel.appendChild(ctrl);panel.appendChild(status);redraw();}
};
N.events.on('mode',ev=>{const d=ev.detail||{};if(d.engine===ID)active.mode=d.mode;});
if(N.registry)N.registry.add({id:ID,title:C.title,kind:'engine',topics:['algebra','functions'],deps:C.references,events:['value','correct','step','hintUsed']});
const engine=N.bankMount({id:ID,num:'03',title:C.title,spec:spec(),years:'KS3 Year 7–9',linked:C.references,def:DEF});
window.F803_ENGINE=engine;
window.F803_TEST={operations,lessons,calc,expectedForward,currentOps,userResult,challengeTarget,config:C,setMode:engine.setMode,selectPreset:id=>{if(lessons[id]){active.preset=id;engine.setMode('explore');}},state:()=>({...active})};
})();
