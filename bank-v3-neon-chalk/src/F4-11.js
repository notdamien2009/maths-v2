/* NOVA F4-11 Word-Problem Highlighter · Run 10. No shared core changes. */
const F411_CONFIG={id:'F4-11',startMode:'watch',preset:'Y7-034',parameters:{maxPhrases:3,roles:['whole','part','difference'],maxGroup:5},
 presets:{
  'Y7-034':{label:'Y7-034 · From words to an expression',kind:'expression',n:3,extra:4,total:null,expected:'3x+4',lesson:'Y7-034',context:'Three equal bags of counters and four loose counters form one collection. Write an expression for the total, where x means the number of counters in one bag.',segments:[
   {text:'A club has '},{id:'part',text:'three identical bags',short:'3 equal bags'},{text:' of counters and '},{id:'difference',text:'four extra counters',short:'4 extra'},{text:'. '},{id:'whole',text:'All counters together',short:'Whole collection'},{text:' make the total. Write an expression using x for one bag.'}]},
  'Y7-034B':{label:'Y7 · Another expression',kind:'expression',n:2,extra:5,total:null,expected:'2x+5',context:'Two equal boxes contain pencils, with five extra pencils. Write the total as an expression.',segments:[
   {text:'A teacher has '},{id:'part',text:'two equal pencil boxes',short:'2 boxes'},{text:' and '},{id:'difference',text:'five extra pencils',short:'5 extra'},{text:'. '},{id:'whole',text:'All the pencils',short:'Whole collection'},{text:' are counted together. Let x be the pencils in one box.'}]},
  'COMPARE':{label:'Comparison · Finding the gap',kind:'comparison',n:1,extra:5,total:19,expected:'19-5',context:'Tara has 19 stickers. Leo has five fewer. Work out how many Leo has.',segments:[
   {text:'Tara has '},{id:'whole',text:'19 stickers',short:'19 stickers'},{text:'. '},{id:'part',text:'Leo has some stickers',short:'Leo’s stickers'},{text:', which is '},{id:'difference',text:'five fewer',short:'5 fewer'},{text:' than Tara. How many has Leo?'}]},
  'PART-WHOLE':{label:'Part–whole · Finding the missing part',kind:'partwhole',n:1,extra:11,total:36,expected:'36-11',context:'A box contains 36 books. Eleven are hardback, the others paperback. Work out how many are paperback.',segments:[
   {text:'A box has '},{id:'whole',text:'36 books',short:'36 books'},{text:'. '},{id:'difference',text:'11 hardback books',short:'11 hardback'},{text:' are known. '},{id:'part',text:'The rest are paperback',short:'Paperbacks'},{text:'. Find the number of paperback books.'}]}
 },
 challenge:[{preset:'Y7-034',label:'Turn a story into algebra'},{preset:'COMPARE',label:'Find a comparison quantity'},{preset:'PART-WHOLE',label:'Find a missing part'}],
 events:{value:['preset','tool','highlight','unhighlight','place','remove','expression','check','reset'],types:['step','correct','hintUsed','mode']}};
window.F411_CONFIG=F411_CONFIG;
(function(){'use strict';const N=window.NOVA,H=N.h,E=N.svg.el,C=F411_CONFIG,ID=C.id,ROLES=C.parameters.roles;
const roleLabel={whole:'Whole',part:'Part',difference:'Extra / gap'};
const roleColour={whole:'given',part:'focus',difference:'unknown'};
const btn=(text,click,primary=false)=>H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:click});
function chalk(p,x,y,s,size=44,role='given'){return N.chalkText(p,x,y,String(s),{size,role});}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F4-11 event '+key);N.events.emit('value',{engine:ID,key,value});}
function normalise(s){return String(s||'').replace(/\s+/g,'').toLowerCase().replace(/[×*]/g,'').replace(/−/g,'-');}
function maths(o){if(o.n<1||o.n>5||o.extra<0||o.extra>50)throw Error('Bad maths preset');const expected=o.expected;const trueAnswer=o.kind==='expression'?null:o.kind==='comparison'?o.total-o.extra:o.total-o.extra;return {expected,trueAnswer,whole:o.total==null?`${o.n}x + ${o.extra}`:o.total,known:o.extra};}
function misconception(o,raw){const s=normalise(raw);if(!s)return 'Write an expression or calculation after building the bar.';
 if(o.kind==='expression'){
  if(s===`${o.n}(x+${o.extra})`)return `That multiplies the extra ${o.extra} by ${o.n}. The extra counters are added ONCE, after the ${o.n} equal groups.`;
  if(s===`${o.n}+x+${o.extra}`)return `${o.n} equal bags means ${o.n} copies of x, so use ${o.n}x rather than ${o.n}+x.`;
  if(s===`${o.n}x-${o.extra}`)return `The story says extra, so ADD ${o.extra} rather than subtract it.`;
  return 'Count the equal groups of x, then add the extra objects once. Keep the bar sections separate.';
 }
 if(s===`${o.total}+${o.extra}`)return `The unknown is smaller than the whole. Subtract the ${o.extra} gap or known part, do not add it.`;
 if(s===String(o.extra))return `That is the gap or known part, not the missing quantity. Start with the whole ${o.total}.`;
 return `Use the whole ${o.total} and remove the known ${o.extra}. The missing part is what remains.`;
}
function validate(o,marks,placed,raw){const m=maths(o);for(const r of ROLES){if(marks[r]!==r)return {ok:false,kind:'mark',message:`The phrase for ${roleLabel[r]} has not been highlighted correctly. Read which quantity it describes.`};}
 for(const r of ROLES){if(placed[r]!==r)return {ok:false,kind:'model',message:`Move the ${roleLabel[r]} phrase into its matching bar-model slot. A highlight alone does not build the model.`};}
 if(normalise(raw)!==normalise(m.expected))return {ok:false,kind:'expression',message:misconception(o,raw)};
 return {ok:true,kind:'proof',message:o.kind==='expression'?`Correct: ${o.n} equal bags give ${o.n}x, with ${o.extra} extra counted once. The whole is ${o.n}x + ${o.extra}.`:`Correct: the missing part is ${m.trueAnswer}. ${o.total} − ${o.extra} = ${m.trueAnswer}. The bar's sections agree.`};}
window.F411_MATH={maths,normalise,validate,misconception};
const HELPER={read:['explain','Read the story!'],whole:['point','Find the whole!'],part:['count','Spot the groups!'],difference:['think','See what changes!'],map:['point-down','Match the bars!'],proof:['celebrate','Great evidence!'],explore:['magnify','Find the clues!'],ready:['think','Your turn!'],right:['celebrate','Nicely reasoned!'],wrong:['not-yet','Check the roles!'],hint:['idea','Find the whole!'],placed:['point','That part fits!'],reset:['explain','Try a new story!']};
function mascot(stage,key){const pair=HELPER[key]||HELPER.ready;N.scene.helperStrip(stage,pair[0],pair[1]);}
function stageCard(head,val,note,role='given'){return N.neonCard([H('p',{class:'f411-card-h',text:head}),H('p',{class:'f411-card-val',text:val}),H('p',{class:'f411-card-note',text:note})],{role});}
function drag(svg,el,o){N.ui.svgDrag(svg,el,o);el.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(e.pointerId)}catch(_){}}});}
const GEO={W:1000,H:946,left:122,wholeY:155,width:756,barH:96,partY:388,partWidth:530,extraX:664,trayY:710,removeX:742};
function scene(o,v){const g=GEO,isPlay=!!v.interactive&&!v.won,marks=v.marks||{},placed=v.placed||{},step=v.step??0,showAll=!!v.won||(!v.interactive&&step>=5),revealOnWatch=r=>!v.interactive&&step>=({whole:2,part:3,difference:4}[r]);
 const isThere=r=>!!v.won||placed[r]===r||revealOnWatch(r);
 const svg=N.svg.root(g.W,g.H,'The story maps to a bar model: a whole on top, an equal-groups or known part beneath it, and an extra or difference section. The three phrases can be dragged to their roles.');svg.classList.add('f411-svg');svg.dataset.placed=ROLES.filter(r=>placed[r]===r).join(',');svg.dataset.won=String(!!v.won);svg.dataset.mode=v.task?'challenge':isPlay?'explore':'watch';
 chalk(svg,500,65,showAll?'The words now agree with the bar':'Which words tell us the mathematics?',43,'given');
 // The single whole has mathematical width. A labelled glass bar is evidence, not a decorative border.
 const boxes={whole:{x:g.left,y:g.wholeY,w:g.width,h:g.barH},part:{x:g.left,y:g.partY,w:g.partWidth,h:g.barH},difference:{x:g.extraX,y:g.partY,w:214,h:g.barH}};
 for(const r of ROLES){const b=boxes[r],on=isThere(r),clr=r==='whole'?'given':r==='part'?'focus':'unknown';
  chalk(svg,b.x+b.w/2,b.y-24,roleLabel[r].toUpperCase(),46,clr);
  if(on){N.neonBox(svg,b.x,b.y,b.w,b.h,{role:clr,r:14});if(!v.interactive&&!v.won&&step===({whole:2,part:3,difference:4}[r]))N.motion.arrive(svg.lastChild,r==='whole'?0:r==='part'?-28:26,0);
   const txt=r==='whole'?(o.total==null?'Whole collection':String(o.total)):
    r==='part'?(o.kind==='expression'?`${o.n} × x`:o.kind==='comparison'?'Unknown smaller part':'Unknown remaining part'):
    o.kind==='comparison'?`− ${o.extra}`:o.kind==='partwhole'?`${o.extra}`:`+ ${o.extra}`;
   if(r==='part'&&o.kind==='expression'){for(let k=1;k<o.n;k++){let u=b.x+b.w*k/o.n;N.neonLine(svg,u,b.y+14,u,b.y+b.h-14,{role:'focus',width:2});}for(let k=0;k<o.n;k++)chalk(svg,b.x+(k+.5)*b.w/o.n,b.y+64,'x',49,'focus');}
   else chalk(svg,b.x+b.w/2,b.y+62,txt,46,clr);
  }else{N.neonPath(svg,`M${b.x+6},${b.y+5} h${b.w-12} v${b.h-10} h-${b.w-12} Z`,{role:clr,width:2.7});chalk(svg,b.x+b.w/2,b.y+64,'?',48,'unknown');}
 }
 N.neonPath(svg,`M${g.left},${g.wholeY+g.barH+18} v20 h${g.width} v-20`,{role:'op',width:3});
 chalk(svg,500,556,showAll?(o.kind==='expression'?`${o.n}x + ${o.extra}`:`${o.total} − ${o.extra} = ${maths(o).trueAnswer}`):'WHOLE = PART + EXTRA / GAP',42,showAll?'result':'op');
 chalk(svg,500,622,isPlay?'Highlight words above. Drag their chips below into the model.':showAll?'The complete model explains the calculation.':'Match each phrase to its role.',37,'given');
 if(isPlay){
  chalk(svg,500,677,'HIGHLIGHTED PHRASES · DRAG OR USE KEYBOARD',33,'given');
  const red={x:g.removeX,y:844,w:153,h:82,id:'remove',kind:'remove'};
  N.neonBox(svg,red.x,red.y,red.w,red.h,{role:'error',r:13});chalk(svg,red.x+red.w/2,red.y+52,'RETURN',37,'error');
  // Tray contains the phrases the child highlighted, in sentence order, not answers to insert automatically.
  ROLES.forEach((r,i)=>{const picked=marks[r];if(!picked)return;const placedHere=placed[r]===r;const b=boxes[r];const area=placedHere?{x:b.x+17,y:b.y+15,w:Math.max(125,b.w-34),h:b.h-30}:{x:100+i*290,y:723,w:255,h:83};
   const el=E('g',{class:'f411-chip',role:'button',tabindex:'0','data-phrase':r,'data-mark':picked,'data-placed':String(placedHere),'aria-label':`${o.segments.find(p=>p.id===r).short}, ${placedHere?'placed, Delete returns to tray':'highlighted '+roleLabel[picked]+'. Enter to place in model'}`},svg);
   // Place on top of its actual mathematical shape with transparent chip treatment so the bar remains visible.
   N.neonBox(el,area.x,area.y,area.w,area.h,{role:picked===r?'op':'error',r:12});chalk(el,area.x+area.w/2,area.y+area.h/2+14,o.segments.find(p=>p.id===r).short,38,picked===r?'given':'error');
   const zones=()=>[placedHere?red:{...b,id:r,kind:'drop'}];
   drag(svg,el,{box:area,zones,onDrop:id=>{if(id!==r||picked!==r){Promise.resolve().then(()=>v.onInvalid(r,picked));return false;}Promise.resolve().then(()=>v.onPlace(r,true));return true;},onRemove:()=>Promise.resolve().then(()=>v.onPlace(r,false)),removeTo:{x:red.x+65,y:red.y+40}});
   el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!placedHere){e.preventDefault();if(picked!==r)v.onInvalid(r,picked);else v.onPlace(r,true);}if((e.key==='Delete'||e.key==='Backspace')&&placedHere){e.preventDefault();v.onPlace(r,false);}});
  });
 }else if(showAll){N.neonRing(svg,500,843,{role:'result',r:21});chalk(svg,500,919,'Evidence complete',36,'result');}
 return svg;
}
function story(o,v){const wrap=H('div',{class:'f411-paper'});wrap.append(H('p',{class:'f411-paper-title'},[H('span',{text:'Read the story · select a highlighting tool'}),H('span',{text:'Find 3 clues'})]));const p=H('p',{class:'f411-story'});
 for(const seg of o.segments){if(!seg.id){p.append(document.createTextNode(seg.text));continue;}const marked=(v.marks||{})[seg.id]||(!v.interactive&&v.step>=({whole:2,part:1,difference:2}[seg.id])?seg.id:'');
  const chip=H('button',{class:'f411-phrase',type:'button',text:seg.text,...(v.interactive&&!v.won?{}:{disabled:true}),tabindex:v.interactive&&!v.won?'0':'-1','data-phrase':seg.id,'data-mark':marked,'aria-label':`${seg.text}. ${marked?'Highlighted '+roleLabel[marked]:'Not highlighted'}. Select a highlighter role then click this phrase.`,onclick:()=>v.onMark?.(seg.id)});p.append(chip);}
 wrap.append(p);return wrap;}
function present(stage,o,v){stage.innerHTML='';N.cap(stage,'Words → bar model',v.task?'CHALLENGE':v.interactive?'HIGHLIGHTER WORKSHOP':v.heading||'Read · Notice · Build');stage.append(story(o,v));const layout=H('div',{class:'f411-layout'}),art=H('div',{class:'f411-art'}),side=H('div',{class:'f411-side'});art.append(scene(o,v));
 const placed=v.placed||{},got=r=>!!v.won||placed[r]===r||(!v.interactive&&(v.step??0)>=({whole:2,part:3,difference:4}[r]));
 side.append(stageCard('WHOLE',got('whole')?(o.total==null?'All together':String(o.total)):'?',got('whole')?'The full quantity or collection':'Find the total meaning','given'));
 side.append(stageCard('PART',got('part')?(o.kind==='expression'?`${o.n} equal x-parts`:'Unknown quantity'):'?',got('part')?'One part of the whole':'A known or repeated part','focus'));
 side.append(stageCard('EXTRA / GAP',got('difference')?String(o.extra):'?',got('difference')?'What is added or taken away':'Look for change words','unknown'));
 layout.append(art,side);stage.append(layout);mascot(stage,v.pose||'ready');}
const STEPS=[
 {name:'Read the problem',narration:'Read the whole story before choosing an operation. We need to work out what the total contains.',prompt:'Which words tell us what we are finding?'},
 {name:'Notice the repeated groups',narration:'Three identical bags means three equal copies of an unknown quantity. Call one bag x.',prompt:'Where does the repeated part appear in the story?'},
 {name:'Identify the whole and extra',narration:'The whole is every counter together. Four extras are separate from the three bags.',prompt:'Which phrase describes the whole, and which describes the extras?'},
 {name:'Build the parts bar',narration:'Put three equal parts on the bar. Each part represents the same x. The bar shows what is known and unknown.',prompt:'Why do the x boxes need the same size?'},
 {name:'Add the extra part once',narration:'Add the four loose counters once. They do not belong inside each bag.',prompt:'Would three times x plus four match the story?'},
 {name:'Generalise from the model',narration:'The total is three x plus four. Each piece of that expression now has a meaning in the diagram.',prompt:'Explain the meaning of each term.'}
];
function workshop(panel,stage,challenge,api){let o={...(challenge||C.presets[C.preset])},tool='whole',marks={},placed={},answer='',won=false,feedback='Choose a highlighter, select three phrases, then drag their chips onto the matching bars.',pose='ready';
 function update(message,key='ready'){feedback=message;pose=key;render();}
 function mark(r){if(won)return;if(marks[r]===tool){delete marks[r];delete placed[r];emit('unhighlight',r);update('Highlight removed. Choose a colour and select the phrase again.','reset');return;}
  marks[r]=tool;delete placed[r];emit('highlight',{phrase:r,role:tool});update(`${o.segments.find(x=>x.id===r).short} highlighted as ${roleLabel[tool]}. Drag it to the model, or press Enter on its chip.`,r);}
 function place(r,yes){if(won)return;if(yes&&marks[r]!==r){invalid(r,marks[r]);return;}if(yes)placed[r]=r;else delete placed[r];emit(yes?'place':'remove',{phrase:r,role:marks[r]});update(yes?'The phrase has moved to its mathematical role.':'The phrase has returned to the highlighted tray.',yes?'placed':'reset');}
 function invalid(r,chosen){update(`That phrase does not represent ${roleLabel[chosen]||'this role'}. Try ${roleLabel[r]}. The piece springs back so no value is stranded.`,'wrong');}
 function setAnswer(t){answer=t;emit('expression',answer);update('Your expression was recorded. Check that its terms match the bar.','ready');}
 function check(){const result=validate(o,marks,placed,answer);emit('check',{ok:result.ok,kind:result.kind});api?.check(result.ok,result.message);if(result.ok){won=true;update(result.message,'right');}else update(result.message,'wrong');return result.ok;}
 function hint(){let next=ROLES.find(r=>marks[r]!==r)||ROLES.find(r=>placed[r]!==r);const m=next?`Look for the phrase that means ${roleLabel[next]}. Compare the words and the bar, not just the colour.`:o.kind==='expression'?'Three equal groups of x, then four extra, means three x plus four.':'You know the whole and one part. Remove the known part to find what remains.';api?.hint(m);update(m,'hint');}
 function reset(){marks={};placed={};answer='';won=false;emit('reset',true);update('New attempt. Read the full story before highlighting.','reset');}
 function select(k){if(!C.presets[k])return;C.preset=k;o={...C.presets[k]};emit('preset',k);reset();}
 function render(){panel.innerHTML='';present(stage,o,{interactive:!won,task:!!challenge,won,marks,placed,pose,onMark:mark,onPlace:place,onInvalid:invalid});
 if(!challenge){const picker=H('select',{'aria-label':'Choose a word problem'});Object.entries(C.presets).forEach(([key,p])=>picker.add(new Option(p.label,key)));picker.value=C.preset;picker.onchange=()=>select(picker.value);panel.append(H('label',{class:'f411-field'},['Example / lesson preset',picker]));}
 if(!won){panel.append(H('p',{class:'f411-step',text:'1 · Choose a highlighter and mark one meaningful phrase at a time.'}));const tools=H('div',{class:'f411-tools'});
  ROLES.forEach(r=>{const b=H('button',{class:'f411-tool',type:'button',text:roleLabel[r], 'data-role':r,'aria-pressed':String(tool===r),onclick:()=>{tool=r;emit('tool',r);render();}});tools.append(b);});panel.append(tools);
  panel.append(H('p',{class:'f411-note',text:'Tap any highlighted phrase again with the same tool to clear it. Correctly highlighted phrases become draggable neon chips; drop them into the labelled bars or focus a chip and press Enter. Press Delete to return a placed chip.'}));
  panel.append(H('p',{class:'f411-step',text:'2 · Model the relationships, then write the expression or calculation.'}));
  const field=H('label',{class:'f411-field'},['Your expression or calculation',H('input',{type:'text',value:answer,placeholder:'Write your expression','aria-label':'Your mathematical expression',oninput:e=>{answer=e.target.value;emit('expression',answer);}})]);panel.append(field);
  const actions=H('div',{class:'f411-actions'},[btn('Check my model',check,true),btn('Hint',hint),btn('Reset',reset)]);panel.append(actions);
 }else panel.append(H('p',{class:'f411-done',text:'The written expression and all three mathematical roles have been proved.'}));
 panel.append(H('p',{class:'f411-status'+(pose==='wrong'?' bad':pose==='right'?' good':''),role:'status',text:feedback}));
 }
 render();return {mark,place,check,select,setAnswer,reset,hint,state:()=>({marks:{...marks},placed:{...placed},answer,won,o})};}
const def={id:ID,title:'Word-Problem Highlighter',config:C,steps:STEPS,
 alt:'A full word problem is annotated to locate the whole, part and extra or gap, and its phrases physically map to a matching neon bar model.',
 staticAlt:'Three identical bags of counters and four extra counters form the whole. If one bag has x counters, the total is 3x + 4.',
 render(i,stage){present(stage,C.presets['Y7-034'],{step:i,pose:['read','part','whole','map','difference','proof'][i],heading:STEPS[i].name});},
 exploreIntro:'Highlight quantities, build the bar from the same words, and check the expression.',
 explore(panel,stage){workshop(panel,stage,null,null);},
 challenge(panel,api,stage){let idx=0;function next(){panel.innerHTML='';if(idx>=C.challenge.length){present(stage,C.presets['Y7-034'],{step:5,won:true,pose:'right',heading:'Three contexts proved'});panel.append(H('p',{class:'f411-done',text:'All three word problems have been translated into matching bar models and correct expressions.'}));return;}
 const spec=C.challenge[idx],o={...C.presets[spec.preset]};if(idx){api.fb.textContent='';api.fb.className='nova-fb';api.bob('Read each quantity and find its role.',{mood:'think'});}
 panel.append(H('p',{class:'f411-step',text:`Challenge ${idx+1} of ${C.challenge.length} · ${spec.label}`}));let content=H('div');panel.append(content);
 const proxy={hint:t=>api.hint(t),check:(ok,msg)=>{api.check(ok,msg,{challenge:idx+1});if(ok)Promise.resolve().then(()=>content.append(H('div',{class:'f411-next'},[btn(idx+1<C.challenge.length?'Next problem →':'Finish challenges →',()=>{idx++;next();},true)])));}};
 workshop(content,stage,o,proxy);
 }next();}
};
N.registry.add({id:ID,title:'Word-Problem Highlighter',topics:['word problems','bar model','forming expressions'],deps:['F0-01','F0-02','F0-08','F4-01','F4-08']});
N.bankMount({id:ID,num:'11',title:'Word-Problem Highlighter · Run 10 Review',def,years:'Year 7–9; forming expressions; extension to comparison, arithmetic and GCSE algebra word problems.',linked:['F4-01','F4-02','F4-08','F4-10'],spec:{purpose:'Identify whole, part and extra/difference phrases in word problems and map them to an evidence-based mathematical bar model.',params:'Three tagged mathematical phrases per problem; one–five equal groups; exact integer known extras; whole may be algebraic.',presets:'Y7-034 3x+4; Y7-034B 2x+5; comparison 19−5; part-whole 36−11.',steps:'Read → spot repeated groups → identify whole and extra → build bar → add extra once → generalise an expression.',interactions:'HTML chalk-write phrase highlighting with keyboard; F2 svgDrag source phrase chips → bar role zones; invalid springback; red return zone; Escape and blur cancellation; misconception-specific checking.',traps:'Treating 3x as 3+x; multiplying the extra once per group; adding when a gap is subtracted; confusing the whole with a part.',gcse:'Construct expressions and solve algebraic word problems by translating real-world quantities into visual equality.'}});
const root=document.getElementById(ID);if(root){const dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));root.querySelectorAll('details.nova-spec,p.purpose').forEach(e=>dev.append(e));root.append(dev);root.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});}
})();
