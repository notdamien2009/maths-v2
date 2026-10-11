/* NOVA F4-08 Algebra Bar · Run 08. F4-10 is a preset of this engine. Canonical F0/F2 core unchanged. */
const F408_CONFIG={id:'F4-08',startMode:'watch',preset:'Y7-035',parameters:{minX:1,maxX:5,maxConstant:12,integerSolutions:true},
 presets:{
  'Y7-034':{label:'Y7 · Expressions from contexts',mode:'expression',n:2,b:4,total:null,context:'Two identical mystery packs and four loose counters. Build the expression.',names:['Mystery packs','Loose counters']},
  'Y7-035':{label:'Y7 · Form and solve equations',mode:'equation',n:3,b:5,total:26,context:'Three identical mystery packs and five loose counters have a total of twenty-six.',names:['Unknown packs','Known counters']},
  'F4-10':{label:'F4-10 · Bar to equation',mode:'translator',n:2,b:5,total:19,context:'Two identical mystery packs and five loose counters together make nineteen. Match the model to the equation.',names:['Mystery packs','Known counters']},
  'F7-11':{label:'F7-11 · Bar-model equation',mode:'bar-equation',n:3,b:5,total:26,context:'Three identical mystery packs plus five known counters have a total value of twenty-six. Model the relationship, subtract the known part, and find one mystery pack.',names:['Equal mystery packs','Known counters'],lesson:'Y7-034'}
 },
 challenge:[
  {label:'Form the expression',mode:'expression',n:2,b:4,total:null,context:'Two mystery packs plus four counters. Build the bar and write its algebraic expression.'},
  {label:'Solve using the bar',mode:'equation',n:3,b:5,total:26,context:'Three mystery packs plus five counters make twenty-six. Build, balance and solve.'},
  {label:'Translate and solve',mode:'translator',n:2,b:5,total:19,context:'Two mystery packs plus five counters make nineteen. Build, complete the equation and solve.'}
 ],f711Challenge:[
  {label:'A story becomes an equation',mode:'bar-equation',n:2,b:3,total:13,context:'Two identical book bundles plus three separate books contain thirteen books. Find the number in each bundle.'},
  {label:'Subtract the known amount first',mode:'bar-equation',n:3,b:5,total:26,context:'Three identical mystery packs and five loose tokens have value twenty-six. Find one pack.'},
  {label:'Avoid dividing the whole too early',mode:'bar-equation',n:4,b:2,total:22,context:'Four identical boxes plus two loose counters contain twenty-two altogether. Find each box.'},
  {label:'Check by substitution',mode:'bar-equation',n:2,b:7,total:19,context:'Two identical bags plus seven single beads contain nineteen. Find each bag and verify the total.'}
 ],events:{value:['preset','add','remove','balance','divide','expression','remaining','x','term','check','reset'],types:['step','correct','hintUsed','mode']}
};if(document.body?.dataset.f711==='1')F408_CONFIG.preset='F7-11';window.F408_CONFIG=F408_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F408_CONFIG,ID=C.id;
function solve(o){if(!Number.isInteger(o.n)||o.n<1||o.n>5||!Number.isInteger(o.b)||o.b<0||o.b>12)throw Error('Out-of-range algebra preset');if(o.total==null)return {n:o.n,b:o.b,total:null,remainder:null,x:null};if(!Number.isInteger(o.total)||o.total<=o.b||(o.total-o.b)%o.n!==0)throw Error('Invalid exact equation preset');return {n:o.n,b:o.b,total:o.total,remainder:o.total-o.b,x:(o.total-o.b)/o.n};}
function terms(o){return [`${o.n}x`,`+ ${o.b}`,`= ${o.total}`];}
function parseExpression(s){const x=String(s||'').toLowerCase().replace(/\s+/g,'').replace(/×/g,'').replace(/\*/g,'');return x;}
function checkMath(o,v){const m=solve(o);if(v.count!==o.n)return {ok:false,kind:'model',message:`Build ${o.n} equal unknown x-parts. You currently have ${v.count}. Each x-part must represent the SAME unknown amount.`};
 if(!v.known)return {ok:false,kind:'model',message:`The known +${o.b} also belongs in the bar. Add its blue value block.`};
 if(o.mode==='expression'){const ok=parseExpression(v.expression)===`${o.n}x+${o.b}`;return ok?{ok:true,message:`Correct: ${o.n} equal x-parts and ${o.b} extra gives ${o.n}x + ${o.b}.`}:{ok:false,kind:'expression',message:`Use ${o.n} copies of x, then ADD the known ${o.b}. Do not multiply ${o.b} by x.`};}
 if(!v.balanced)return {ok:false,kind:'balance',message:`Show a balanced subtraction first: subtract ${o.b} from BOTH sides of the equation.`};
 if(!Number.isFinite(Number(v.remaining))||String(v.remaining).trim()==='')return {ok:false,kind:'remaining',message:'Enter the total left after removing the known amount from both sides.'};
 if(Number(v.remaining)!==m.remainder)return {ok:false,kind:'remaining',message:`Subtract the known ${o.b} from the whole ${o.total}. The remainder belongs to ${o.n} equal x-parts.`};
 if(!v.divided)return {ok:false,kind:'divide',message:`Now divide the remaining amount among ALL ${o.n} identical x-parts.`};
 if(String(v.x).trim()===''||Number(v.x)!==m.x)return {ok:false,kind:'x',message:`${m.remainder} is shared between ${o.n} equal unknown parts. Find ONE part; do not divide the original total.`};
 if(o.mode==='translator'&&v.slots.join('|')!==terms(o).join('|'))return {ok:false,kind:'terms',message:'Match every part of the bar to its equation: x-parts first, known addition second, whole total third.'};
 return {ok:true,message:`Proved: ${o.n} × ${m.x} + ${o.b} = ${o.total}. Both sides balance.`};}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared value event '+key);N.events.emit('value',{engine:ID,key,value});}
const btn=(text,onclick,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick});
function chalk(p,x,y,s,size=47,role='given'){return N.chalkText(p,x,y,String(s),{size,role});}
function card(heading,value,note,role='given'){return N.neonCard([H('p',{class:'f408-card-h',text:heading}),H('p',{class:'f408-card-v',text:value}),H('p',{class:'f408-card-n',text:note})],{role});}
const SAY={start:['explain','Notice the whole!'],parts:['show-three','Find the x parts!'],known:['point','Here is what we know!'],balance:['compare','Keep both sides equal!'],remove:['point-down','Take off the knowns!'],divide:['count','Share equally!'],answer:['idea','One x is revealed!'],proof:['celebrate','You proved it!'],explore:['point','Build your model!'],ready:['think','Your turn!'],wrong:['not-yet','Check both sides!'],hint:['idea','Look at the knowns!'],placed:['point-down','Part in place!'],success:['celebrate','Brilliant proof!']};
function helper(stage,k){const a=SAY[k]||SAY.ready;N.scene.helperStrip(stage,a[0],a[1]);}
function draggable(svg,el,o){N.ui.svgDrag(svg,el,o);el.addEventListener('pointerdown',ev=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(ev.pointerId);}catch(_){}}});}
const GEO={W:1000,H:898,left:131,width:740,wholeY:170,partY:342,barH:112,trayY:693,slotY:571};
function diagram(o,v){const m=solve(o),g=GEO,interactive=!!v.interactive,active=v.step??0,translator=o.mode==='translator',xW=Math.min(212,(g.width-148)/Math.max(o.n,3)),knownW=g.width-o.n*xW,x=g.left,partY=g.partY;
 const svg=N.svg.root(g.W,g.H,'Algebra bar with an upper whole and lower equal x-part boxes plus a known amount. Build identical x-units, subtract knowns from both sides, and translate to an equation.');svg.classList.add('f408-svg');svg.dataset.count=String(v.count??0);svg.dataset.known=String(!!v.known);svg.dataset.balanced=String(!!v.balanced);svg.dataset.divided=String(!!v.divided);svg.dataset.mode=v.task?'challenge':interactive?'explore':'watch';
 const visibleCount=v.won?m.n:interactive?v.count:active>=1?m.n:0,visibleKnown=v.won?true:interactive?v.known:active>=2,showResult=m.x!==null&&((!interactive&&active>=6)||!!v.won);
 chalk(svg,500,65,translator?'FROM BAR TO EQUATION':o.mode==='expression'?'BUILD AN EXPRESSION':o.mode==='bar-equation'?'FROM STORY TO EQUATION':'THE WHOLE AND ITS PARTS',49,'given');
 chalk(svg,500,125,v.task?'BUILD THE MODEL · PROVE THE ANSWER':o.mode==='expression'?`${o.n} equal x-parts plus ${o.b} known`:m.total==null?`${o.n}x + ${o.b}`:`${o.n}x + ${o.b} = ${o.total}`,44,'focus');
 // The top is a single full bar. It does not collapse the equation to an unexplained procedure.
 N.neonBox(svg,x,g.wholeY,g.width,103,{role:'given',r:15});chalk(svg,500,g.wholeY+68,m.total==null?'WHOLE = THE EXPRESSION':`WHOLE = ${m.total}`,51,'given');
 N.neonPath(svg,`M${x},${g.wholeY-17} v-12 h${g.width} v12`,{role:'op',width:3});
 chalk(svg,500,g.partY-20,'SAME WHOLE · PARTS BELOW',43,'given');
 for(let i=0;i<o.n;i++){
  const bx=x+i*xW,box={x:bx,y:partY,w:xW-5,h:g.barH};let real=i<visibleCount;
  if(real){const tile=E('g',{class:'f408-tile',tabindex:interactive&&!v.won?'0':undefined,role:interactive&&!v.won?'button':undefined,'aria-label':`x part ${i+1}. Press Delete to return it to the tray.`, 'data-type':'x','data-index':String(i)},svg);
   N.neonBox(tile,bx,partY,box.w,box.h,{role:showResult?'result':'unknown',r:12});chalk(tile,bx+box.w/2,partY+75,showResult?String(m.x):'x',61,showResult?'result':'unknown');if(!interactive&&!v.won&&active===1)N.motion.arrive(tile,0,-26);
   if(interactive&&!v.won){const ret={x:680,y:g.trayY,w:190,h:95,id:'remove-x',kind:'remove'};
    draggable(svg,tile,{box,zones:()=>[ret],onRemove:()=>Promise.resolve().then(()=>v.onRemove('x')),removeTo:{x:760,y:g.trayY+50}});
    tile.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();v.onRemove('x');}});
   }
  }else{N.neonPath(svg,`M${bx+11} ${partY+9} h${box.w-22} v${g.barH-18} h-${box.w-22} Z`,{role:'unknown',width:2.3});chalk(svg,bx+box.w/2,partY+72,'?',54,'unknown');}
 }
 const kx=x+o.n*xW,kw=knownW-5;
 if(visibleKnown){const tile=E('g',{class:'f408-tile',tabindex:interactive&&!v.won?'0':undefined,role:interactive&&!v.won?'button':undefined,'aria-label':`Known ${o.b}. Press Delete to return it.`, 'data-type':'known'},svg);
 N.neonBox(tile,kx,partY,kw,g.barH,{role:'given',r:12});chalk(tile,kx+kw/2,partY+75,'+ '+o.b,56,'given');if(!interactive&&!v.won&&active===2)N.motion.arrive(tile,36,0);
 if(interactive&&!v.won){const ret={x:680,y:g.trayY,w:190,h:95,id:'remove-known',kind:'remove'};draggable(svg,tile,{box:{x:kx,y:partY,w:kw,h:g.barH},zones:()=>[ret],onRemove:()=>Promise.resolve().then(()=>v.onRemove('known')),removeTo:{x:760,y:g.trayY+50}});tile.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();v.onRemove('known');}});}
 }else{N.neonPath(svg,`M${kx+8} ${partY+9} h${kw-16} v${g.barH-18} h-${kw-16} Z`,{role:'given',width:2.2});chalk(svg,kx+kw/2,partY+72,'?',48,'given');}
 chalk(svg,500,partY+160,((v.won||(!interactive&&active>=2))?`${o.n} × x   +   ${o.b}`:interactive?(v.count?`${v.count} x-part${v.count===1?'':'s'}`:'Add equal x-parts')+(v.known?` and +${o.b}`:' and a known block'):'What pieces make the whole?'),44,(v.won||active>=2)?'op':'given');
 // Evidence: explicitly balanced subtraction, then equal division; never imply removing a left part only is sufficient.
 const balanced=!!v.won||(interactive?!!v.balanced:active>=4),divided=!!v.won||(interactive?!!v.divided:active>=5);
 if(!interactive&&!v.won&&active===4&&o.total!=null)N.motion.flash(svg,kx+kw/2,partY+50,'error',40);if(!interactive&&!v.won&&active===6&&m.x!=null)N.motion.flash(svg,x+xW/2,partY+55,'result',42);
 if(o.mode==='expression')chalk(svg,500,556,interactive?'FORM AN EXPRESSION · NOT AN EQUATION':active>=3?`${o.n}x + ${o.b} describes the whole`:'What does the diagram tell us?',42,'op');
 else if(balanced){
  N.neonBox(svg,147,526,706,80,{role:'op',r:13});chalk(svg,500,578,`${o.total} − ${o.b} = ${interactive?(String(v.remaining).trim()||'?'):m.remainder}`,48,interactive&&!v.won?'unknown':'op');
  chalk(svg,500,651,divided?`${interactive?(String(v.remaining).trim()||'?'):m.remainder} ÷ ${o.n} = ${showResult?m.x:'?'}`:`SUBTRACT ${o.b} ON BOTH SIDES`,42,divided?'result':'given');
 }else chalk(svg,500,561,'SAME CHANGE ON BOTH SIDES',44,'op');
 if(translator){
  // Three semantic slots: coefficient term, additive term, equals whole. No leaked answers in Challenge.
  const eqY=675;
  for(let i=0;i<3;i++){
   const ex=109+i*264,ey=eqY,w=246,h=79,t=v.slots?.[i]||'';
   N.neonBox(svg,ex,ey,w,h,{role:t?'result':'unknown',r:11});chalk(svg,ex+w/2,ey+53,t||['x-TERM','+ KNOWN','= WHOLE'][i],t?50:40,t?'result':'unknown');
  }
  if(interactive&&!v.won){const tm=terms(o);for(let i=0;i<3;i++){
   let xx=130+i*272, yy=787,ch=E('g',{class:'f408-eqchip',tabindex:0,role:'button','aria-label':`Equation term ${tm[i]}. Drag onto equation slot ${i+1} or press ${i+1} after focusing.`,'data-term':String(i)},svg);
   N.neonBox(ch,xx,yy,215,71,{role:'focus',r:12});chalk(ch,xx+107,yy+50,tm[i],50,'focus');
   draggable(svg,ch,{box:{x:xx,y:yy,w:215,h:71},zones:()=>[0,1,2].map(j=>({x:109+j*264,y:eqY,w:246,h:79,id:'slot:'+j,kind:'drop'})),onDrop:id=>{const j=Number(id.slice(5));if(!Number.isInteger(j)||j<0||j>2)return false;Promise.resolve().then(()=>v.onTerm(i,j));return true;}});
   ch.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '||['1','2','3'].includes(e.key)){e.preventDefault();v.onTerm(i,e.key==='Enter'||e.key===' '?i:Number(e.key)-1);}});
  }}
 }else if(interactive&&!v.won){
  // Physical source objects, never a dead decorative tray; snap and keyboard equivalents.
  for(const [i,kind] of ['x','known'].entries()){
   const xx=i===0?134:370,yy=g.trayY,source=E('g',{class:'f408-supply',tabindex:0,role:'button','aria-label':`Add ${kind==='x'?'an x part':`the known ${o.b} block`} by dragging or pressing Enter.`, 'data-supply':kind},svg);
   N.neonBox(source,xx,yy,209,90,{role:kind==='x'?'unknown':'given',r:13});chalk(source,xx+104,yy+61,kind==='x'?'+ x':`+ ${o.b}`,53,kind==='x'?'unknown':'given');
   const area=kind==='x'?{x,y:partY,w:Math.max(190,o.n*xW),h:g.barH}:{x:kx,y:partY,w:kw,h:g.barH};
   draggable(svg,source,{box:{x:xx,y:yy,w:209,h:90},zones:()=>[{...area,kind:'drop',id:'add-'+kind}],onDrop:id=>{if(id!=='add-'+kind)return false;Promise.resolve().then(()=>v.onAdd(kind));return true;}});
   source.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();v.onAdd(kind);}});
  }
  N.neonBox(svg,680,g.trayY,190,90,{role:'error',r:12});chalk(svg,775,g.trayY+58,'RETURN',43,'error');
 }else{
  chalk(svg,500,766,o.mode==='expression'?`${o.n}x + ${o.b}`:showResult?`${o.n} × ${m.x} + ${o.b} = ${o.total}`:active>=5?`${m.remainder} SHARED INTO ${o.n} GROUPS`:'EQUAL x-PARTS · ONE KNOWN PART',45,showResult?'result':'given');
 }
 if(o.mode==='bar-equation'&&interactive&&!v.won&&divided&&m.x!==null){
   // Three draggable numerical tokens and a real x-dock; signed/shape cues also remain in the F0 drawing.
   const values=Array.from(new Set([m.x+o.b,m.x,m.total/o.n].filter(Number.isInteger)));
   for(let candidate=m.x+1;values.length<3;candidate++)if(!values.includes(candidate))values.push(candidate);
   const dock={x:739,y:784,w:134,h:70,id:'answer',kind:'drop'};N.neonBox(svg,dock.x,dock.y,dock.w,dock.h,{role:v.chosenX!==''?'result':'focus',r:12});
   chalk(svg,dock.x+67,dock.y+46,v.chosenX!==''?`x = ${v.chosenX}`:'x = ?',40,v.chosenX!==''?'result':'focus');
   values.slice(0,3).forEach((number,i)=>{const xx=116+i*195, yy=788,ch=E('g',{class:'f408-answer-chip',tabindex:0,role:'button','aria-label':`Choose x equals ${number}. Drag into the answer dock, or press Enter.`,'data-answer':String(number)},svg);
     N.neonBox(ch,xx,yy,165,66,{role:'unknown',r:12});chalk(ch,xx+82,yy+44,String(number),45,'unknown');
     draggable(svg,ch,{box:{x:xx,y:yy,w:165,h:66},zones:()=>[dock],onDrop:zone=>{if(zone!=='answer')return false;Promise.resolve().then(()=>v.onChoose?.(number));return true;}});
     ch.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();v.onChoose?.(number);}});
   });
 }
 if(!translator&&!(o.mode==='bar-equation'&&interactive&&divided&&!v.won))chalk(svg,500,858,o.mode==='expression'?'COUNT THE EQUAL x PARTS':showResult?'ONE x-PART REVEALED':'A BALANCED EQUATION TELLS THE SAME STORY',40,showResult?'result':'given');
 return svg;
}
function present(stage,o,v){stage.innerHTML='';const m=solve(o);
 N.cap(stage,o.mode==='bar-equation'?'Bar-model equation':'Algebra Bar',v.task?'CHALLENGE':v.interactive?'CONSTRUCT & PROVE':v.title||'Unknown parts · balanced working');
 const lay=H('div',{class:'f408-layout'}),art=H('div',{class:'f408-art'}),side=H('div',{class:'f408-side'});art.append(diagram(o,v));
 side.append(card('UNKNOWN GROUPS',(!v.task&&!v.interactive)||v.won?`${o.n} equal x`:(v.interactive?`${v.count} built`:'?'),'Every x-box is the same quantity','unknown'));
 side.append(card('KNOWN PART',(!v.task&&!v.interactive)||v.known?`+ ${o.b}`:'Not placed','Adds to the unknown parts','given'));
 side.append(card('TOTAL / PROOF',m.total==null?'Expression only':v.won?`${o.n} × ${m.x} + ${o.b} = ${m.total}`:`${m.total} altogether`,m.total==null?'No equals sign without a total':'Balance both sides before solving',v.won?'result':'op'));
 lay.append(art,side);stage.append(lay);helper(stage,v.pose||'ready');}
const F711_STEPS=[
 {name:'Read the story',narration:'Three matching packs, plus five loose counters, have a total of twenty-six. The story gives one whole and several parts.',prompt:'What is known, and which packs are unknown?'},
 {name:'Show the equal unknowns',narration:'Place three equal x-boxes under the whole. Each x must have the same value.',prompt:'Why are all three x-boxes identical?'},
 {name:'Add the known counters',narration:'Put the five loose counters at the end of the bar. The pieces must exactly represent the story.',prompt:'Which part is the known addition?'},
 {name:'Form the equation',narration:'Read the bar as three x plus five equals twenty-six. The parts and the whole say the same thing.',prompt:'How do we write the bar as an equation?'},
 {name:'Subtract the known part',narration:'Subtract five from both sides, not just the left. Three x is twenty-one.',prompt:'Why must both sides lose five?'},
 {name:'Share among the equal x parts',narration:'Divide twenty-one equally among the three boxes. Each box represents seven.',prompt:'What do you divide after subtracting five?'},
 {name:'Reveal one x',narration:'One x-box is seven. The area and equation now agree.',prompt:'How much does one mystery pack contain?'},
 {name:'Check the story',narration:'Three groups of seven make twenty-one, and five more make twenty-six. Our answer fits the original story.',prompt:'How can substitution prove our answer?'}
];
const STEPS=[
 {name:'Notice the whole',narration:'The entire top bar represents twenty six. Underneath, we need to explain how its pieces make that whole.',prompt:'What does the top bar represent?'},
 {name:'Make equal unknown parts',narration:'The first three boxes all represent x. They must be the same size because they stand for equal unknown groups.',prompt:'Why are the three x-boxes equal?'},
 {name:'Show the known amount',narration:'Five more counters are outside those x-boxes. Now the model says three x plus five equals twenty six.',prompt:'Which part is already known?'},
 {name:'Build the equation',narration:'Read the picture: three identical unknown groups plus five gives twenty six.',prompt:'How does the bar become an equation?'},
 {name:'Subtract on both sides',narration:'Remove five from the left, and subtract five from the right as well. Twenty six minus five leaves twenty one.',prompt:'Why must we subtract the same amount on both sides?'},
 {name:'Share the remainder equally',narration:'Twenty one is shared by three identical x-parts. Twenty one divided by three gives one x-part.',prompt:'How do the three equal bars help us find x?'},
 {name:'Reveal x',narration:'Each unknown part is seven. The diagram and the arithmetic agree.',prompt:'What is the value of one x-box?'},
 {name:'Check and generalise',narration:'Three lots of seven make twenty one. Add five and we get twenty six. Always check against the original whole.',prompt:'How do we prove the answer is correct?'}
];
function workshop(panel,stage,task,api){let o=task?{...task}:{...C.presets[C.preset]};let count=0,known=false,balanced=false,divided=false,remaining='',x='',expression='',slots=['','',''],won=false,feedback='Drag x-boxes and the known part from the tray to build the expression or equation.',pose='ready';
 function change(message,p='explore'){feedback=message;pose=p;redraw();}
 function add(kind){if(won)return;if(kind==='x'){if(count>=C.parameters.maxX){change('Maximum five unknown parts.','wrong');return;}count++;}else known=true;balanced=false;divided=false;slots=['','',''];emit('add',{kind,count,known});change(kind==='x'?'One equal x-part placed.':'The known block is now in the bar.','placed');}
 function remove(kind){if(won)return;if(kind==='x'){if(!count)return;count--;}else known=false;balanced=false;divided=false;slots=['','',''];emit('remove',{kind,count,known});change('Block returned to the tray.','explore');}
 function balance(){if(o.total==null){change('An expression has no equals sign to balance.','wrong');return;}if(count!==o.n||!known){change('Build the original bar before subtracting known amounts.','wrong');return;}balanced=true;divided=false;emit('balance',{subtract:o.b,from:'both sides'});change(`Subtract ${o.b} from BOTH sides. Now enter the remaining total.`,'balance');}
 function divide(){if(!balanced){change('Subtract knowns on both sides before dividing.','wrong');return;}if(String(remaining).trim()===''||Number(remaining)!==o.total-o.b){change('First enter the correct remainder: the whole minus the known part.','wrong');return;}divided=true;emit('divide',{groups:o.n,remainder:Number(remaining)});change(`Share the remainder equally across ${o.n} x-parts. Enter one x.`,'divide');}
 function chooseX(value){if(!divided){change('Subtract the known amount, then divide before choosing one x.','wrong');return;}x=String(value);emit('x',value);change('Value placed in the x dock. Check by substituting into the original equation.','placed');}
 function term(i,j){if(!known||count!==o.n){change('Build the original bar before translating its terms.','wrong');return;}slots[j]=terms(o)[i];emit('term',{source:i,slot:j,term:terms(o)[i]});change('An equation term snapped into slot '+(j+1)+'.','placed');}
 function hint(){const t=o.mode==='expression'?`Count the identical x-boxes first, then add the loose ${o.b}.`:`Take ${o.b} away from BOTH sides. Then share the remainder among ${o.n} equal boxes.`;api?.hint(t);change(t,'hint');}
 function check(){const result=checkMath(o,{count,known,balanced,divided,remaining,x,expression,slots});emit('check',{ok:result.ok,kind:result.kind||'proved'});api?.check(result.ok,result.message);if(result.ok){won=true;change(result.message,'success');}else change(result.message,'wrong');return result.ok;}
 function reset(){count=0;known=false;balanced=false;divided=false;remaining='';x='';expression='';slots=['','',''];won=false;emit('reset',true);change('Model cleared. Begin with x and the known part.','ready');}
 function field(label,value,set,kind='number'){let input=H('input',{type:kind,value,step:'any','aria-label':label,'autocomplete':'off'});input.onchange=()=>{set(input.value);emit(kind==='text'?'expression':label==='Remainder'?'remaining':'x',input.value);refreshStage();};input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();input.blur();}});return H('label',{class:'f408-field'},[label,input]);}
 function refreshStage(){present(stage,o,{interactive:!won,task:!!task,count,known,balanced,divided,remaining,slots,chosenX:x,won,pose,onAdd:add,onRemove:remove,onTerm:term,onChoose:chooseX});}
 function redraw(){panel.innerHTML='';refreshStage();
  if(!task){let choice=H('select',{'aria-label':'Choose algebra preset'});Object.entries(C.presets).forEach(([k,p])=>choice.add(new Option(p.label,k)));choice.value=C.preset;choice.onchange=()=>{C.preset=choice.value;o={...C.presets[C.preset]};reset();emit('preset',C.preset);};panel.append(H('label',{class:'f408-field'},['Lesson / component preset',choice]));}
  panel.append(H('p',{class:'f408-prompt',text:o.context}));
  if(!won){let controls=H('div',{class:'f408-controls'},[btn('+ x part',()=>add('x')),btn(`+ known ${o.b}`,()=>add('known')),btn('− x part',()=>remove('x')),btn('Remove known',()=>remove('known')),btn('Reset',reset)]);panel.append(controls);
   const inputs=H('div',{class:'f408-inputs'});
   if(o.mode==='expression')inputs.append(field('Algebraic expression',expression,v=>expression=v,'text'));
   else {inputs.append(field('Remainder',remaining,v=>remaining=v),field('Value of x',x,v=>x=v));}
   panel.append(inputs);
   const actions=H('div',{class:'f408-controls'});
   if(o.mode!=='expression')actions.append(btn(balanced?'Knowns subtracted':'Subtract knowns on BOTH sides',balance),btn(divided?'Remainder divided':'Divide into x-parts',divide));
   if(o.mode==='translator')actions.append(btn('Arrange equation terms',()=>{for(let i=0;i<3;i++)slots[i]=terms(o)[i];emit('term',{keyboard:true,slots});change('Equation terms placed in matching slots.','placed');}));
   actions.append(btn('Check my proof',check,true),btn('Hint',hint));panel.append(actions);
  }else panel.append(H('p',{class:'f408-done',text:o.mode==='expression'?'The algebraic expression matches the physical bar model.':'Model, equation and balanced mathematical proof verified.'}));
  panel.append(H('p',{class:'f408-guide',text:o.mode==='bar-equation'?'Move x-boxes and the known value into the bar; press Delete or drag a placed object into RETURN. Subtract knowns from both sides, divide the remainder and drag one numerical x value into its dock. Press Enter on a value chip for keyboard selection.':'Use mouse, touch or keyboard: drag x/known tiles onto the bar; drag placed tiles back to the red RETURN zone, or focus a tile and press Delete. For the F4-10 preset, drag equation terms into their slots or use the labelled keyboard button. Always subtract the known amount from both sides.'}));
  panel.append(H('p',{class:'f408-status'+(pose==='wrong'?' bad':pose==='success'?' good':''),role:'status',text:feedback}));
 }
 redraw();return {add,remove,balance,divide,term,check,reset,state:()=>({count,known,balanced,divided,remaining,x,expression,slots,won})};}
const def={id:ID,title:'Algebra Bar',config:C,steps:C.preset==='F7-11'?F711_STEPS:STEPS,
 alt:'One glass bar gives the whole, with equal x-parts and a separate blue known-value block beneath; balanced subtraction leaves equal unknown parts.',
 staticAlt:'Three identical x-parts plus five equals twenty-six. Subtract five from both sides: 3x = 21. Divide by three: x = 7. Check 3 × 7 + 5 = 26.',
 render(i,stage){let o=C.presets[C.preset==='F7-11'?'F7-11':'Y7-035'];const seq=C.preset==='F7-11'?F711_STEPS:STEPS;present(stage,o,{step:i,count:i>=1?o.n:0,known:i>=2,pose:['start','parts','known','balance','remove','divide','answer','proof'][i],title:seq[i].name});},
 exploreIntro:'Build the equal unknown parts, balance both sides and prove the result.',
 explore(panel,stage){workshop(panel,stage,null,null);},
 challenge(panel,api,stage){let idx=0;const tasks=C.preset==='F7-11'?C.f711Challenge:C.challenge;function next(){panel.innerHTML='';if(idx>=tasks.length){const finish=C.preset==='F7-11'?C.presets['F7-11']:C.presets['Y7-035'];present(stage,finish,{count:finish.n,known:true,step:7,won:true,pose:'success',title:'All algebra challenges proved'});panel.append(H('p',{class:'f408-done',text:`All ${tasks.length} algebra-bar challenges proved. Each answer was checked against the original whole.`}));return;}
 let o={...tasks[idx]};if(idx>0){api.fb.textContent='';api.fb.className='nova-fb';api.bob('Build the model, then prove it.',{mood:'think'});}
 panel.append(H('p',{class:'f408-step',text:`Challenge ${idx+1} of ${tasks.length} · ${o.label}`}));let block=H('div');panel.append(block);
 const proxy={hint:t=>api.hint(t),check:(ok,msg)=>{api.check(ok,msg,{task:idx+1});if(ok)Promise.resolve().then(()=>block.append(H('div',{class:'f408-next'},[btn(idx+1<tasks.length?'Next problem →':'Finish challenges →',()=>{idx++;next();},true)])));}};
 workshop(block,stage,o,proxy);
 }next();}
};
N.registry.add({id:ID,title:'Algebra Bar',topics:['forming algebraic expressions','solving one-step and two-step equations','bar to equation'],deps:['F0-01','F0-02','F0-08','F0-13','F4-01']});
N.bankMount({id:ID,num:C.preset==='F7-11'?'11':'08',title:C.preset==='F7-11'?'Bar-Model Equation · F7 Run 11 Review':'Algebra Bar · Run 08 Review',def,years:'Year 7–9 expressions, linear equations, GCSE Foundation and Higher.',linked:['F4-01','F4-04','F4-10','F7-01','F7-11'],spec:{purpose:'Represent equal unknown quantities as linked physical bars; prove a balanced equation through subtraction and equal division. F4-10 is an in-engine translator preset. F7-11 is the Year 7 story-to-equation bar preset with real x-answer drag chips.',params:'One–five x-parts; integer known 0–12; whole totals admit exact positive integer x.',presets:'Y7-034 expression 2x+4; Y7-035 3x+5=26; F4-10 preset 2x+5=19 with semantic equation slots.',steps:'Whole → equal x-parts → known term → equation → subtract both sides → divide equally → value of x → substitution check.',interactions:'F2 svgDrag source x/known blocks and red return tray, Delete keyboard equivalent; independent term-chip drag into F4-10 equation slots; inputs with misconception-specific checking.',traps:'Treating 3x as x+3, subtracting on only one side, dividing the original 26 not the remainder 21, missing known term, reversing equation terms.',gcse:'Linear equations with equal groups, balanced operations and substitution checks.'}});
window.F408_MATH={solve,terms,parseExpression,checkMath};
const root=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
