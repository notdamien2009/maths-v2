/* F9-02 · Term-to-term animator · NOVA Neon + Chalk. */
const F902_CONFIG={
 id:'F9-02',family:'F9',startMode:'watch',preset:'Y7-036-sequence-structure',
 presets:{
  'Y7-036-sequence-structure':{label:'Year 7 · +3 pattern',type:'arith',a1:4,step:3,terms:5,focus:'Term-to-term rule'},
  'Y8-019-arithmetic-sequences':{label:'Year 8 · −5 pattern',type:'arith',a1:30,step:-5,terms:5,focus:'Arithmetic sequence'},
  'Y8-020-geometric-sequences':{label:'Year 8 · ×2 pattern',type:'geom',a1:3,ratio:2,terms:5,focus:'Geometric sequence'}
 },
 events:{value:['preset','term','rule','challengeTask','placed'],types:['step','correct','hintUsed','mode']}
};
(function(){'use strict';
const N=window.NOVA,C=F902_CONFIG,E=N.svg.el,H=N.h,id=C.id;
const isSmall=()=>window.innerWidth<=760;
const speech=[
 {name:'notice-terms',preset:'Y7-036-sequence-structure',pose:'explain',skin:'pip',text:'Look at the terms: four, seven, ten. Something is repeating.',prompt:'What changes from one term to the next?'},
 {name:'reveal-hop',preset:'Y7-036-sequence-structure',pose:'point-right',skin:'pip',text:'From four to seven, and seven to ten, we add three each time.',prompt:'Say the term-to-term rule out loud.'},
 {name:'predict-next',preset:'Y7-036-sequence-structure',pose:'idea',skin:'pip',text:'If the rule is add three, the next term after ten is thirteen.',prompt:'Predict the next term before it appears.'},
 {name:'decreasing',preset:'Y8-019-arithmetic-sequences',pose:'think',skin:'pip',text:'A term-to-term rule can also decrease. Here the sequence goes down by five.',prompt:'How do you know the rule is subtract five?'},
 {name:'geometric',preset:'Y8-020-geometric-sequences',pose:'point-right',skin:'nova',text:'Some sequences multiply. Three, six, twelve, twenty-four doubles each time.',prompt:'What makes this different from an arithmetic sequence?'},
 {name:'compare',preset:'Y8-020-geometric-sequences',pose:'celebrate',skin:'pip',text:'Arithmetic sequences add or subtract a fixed amount. Geometric sequences multiply by a fixed factor.',prompt:'Compare add three, subtract five and multiply by two.'}
];
let active=0,currentPreset='Y7-036-sequence-structure',exploreVisible=4,challengeIndex=0;
let challengeState={rule:null,term:null};
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9 event '+key);N.events.emit('value',{engine:id,key,value});}
function seqValue(preset,n){return preset.type==='arith'?preset.a1+(n-1)*preset.step:preset.a1*Math.pow(preset.ratio,n-1);} 
function ruleLabel(preset){if(preset.type==='arith'){return (preset.step>=0?'+':'−')+Math.abs(preset.step);}return '×'+preset.ratio;}
function nextValue(preset,visible){return seqValue(preset,visible+1);} 
function txt(p,x,y,t,size=22,role='given',anchor='middle'){return N.chalkText(p,x,y,String(t),{size,role,anchor});}
function box(p,x,y,w,h,role='given',text=null,size=20){return N.neonBox(p,x,y,w,h,{role,text,size,r:11});}
function hbtn(t,fn,cls='nova-btn'){return H('button',{class:cls,text:t,onclick:fn});}
function stateRoot(alt){let sm=isSmall();let svg=N.svg.root(sm?430:760,sm?520:440,alt);svg.setAttribute('class','nv-svg f902-svg');svg.setAttribute('role','img');return svg;}
function reset(stage){stage.innerHTML='';N.cap(stage,'Sequence workshop','Term-to-term animator');}
function sideCard(label,text,cls=''){return H('div',{class:'f902-card '+cls},[H('div',{class:'f902-eyebrow',text:label}),H('div',{class:'f902-maths',text})]);}
function node(svg,x,y,val,role='given',r=16){N.neonRing(svg,x,y,{role,r,pulse:false});txt(svg,x,y+6,val,18,role);} 
function sequenceCoords(W,count){let pad=isSmall()?44:78; let gap=(W-2*pad)/(count-1); return Array.from({length:count},(_,i)=>pad+i*gap);} 
function drawSequence(svg,preset,o={}){
 const W=isSmall()?430:760,sm=isSmall(),baseY=sm?212:198,count=o.count||5,xs=sequenceCoords(W,count);
 if(o.title)txt(svg,W/2,50,o.title,sm?23:26,'support');
 if(o.subtitle)txt(svg,W/2,84,o.subtitle,sm?16:18,'support');
 for(let i=0;i<count-1;i++){
   const label=(o.showRule && i<Math.max(1,(o.visible||count)-1))?ruleLabel(preset):(o.showBlanks?'?':'');
   let role=o.showRule?'focus':'support';
   let hop=N.svg.hop(svg,xs[i]+18,xs[i+1]-18,baseY-40,{role,label:label||null,height:sm?54:64});
   if(o.ruleZone && i===1){ // central rule zone over second hop
     const rx=(xs[i]+xs[i+1])/2-46, ry=hop.peak-20, rw=92,rh=36;
     if(!challengeState.rule){
       E('rect',{x:rx,y:ry,width:rw,height:rh,rx:18,fill:'transparent','class':'f902-dropbtn','data-slot':'rule',tabindex:'0',role:'button','aria-label':'Place the rule on the hop'},svg)
         .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();}});
       N.neonBox(svg,rx,ry,rw,rh,{role:'unknown',text:'Drop rule',size:13,r:18});
     }
   }
 }
 for(let i=0;i<count;i++){
   const show=i < (o.visible||count);
   if(o.hideLast && i===count-1){
     N.neonRing(svg,xs[i],baseY,{role:'unknown',r:18,pulse:false});
     if(o.termZone){
       const rw=62,rh=42,rx=xs[i]-rw/2,ry=baseY+34;
       if(!challengeState.term){
         N.neonBox(svg,rx,ry,rw,rh,{role:'unknown',text:'Next',size:14,r:14});
         E('rect',{x:rx,y:ry,width:rw,height:rh,rx:14,fill:'transparent','class':'f902-dropbtn','data-slot':'term',tabindex:'0',role:'button','aria-label':'Place the next term'},svg)
           .addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();}});
       }
     } else txt(svg,xs[i],baseY+7,'?',19,'support');
   } else if(show){
     node(svg,xs[i],baseY,seqValue(preset,i+1), i===o.highlightIndex?'focus':'given', sm?14:16);
     txt(svg,xs[i],baseY+39,'Term '+(i+1),12,'support');
   } else {
     N.neonRing(svg,xs[i],baseY,{role:'support',r:18,pulse:false}); txt(svg,xs[i],baseY+7,'…',18,'support');
   }
 }
 return {xs,baseY};
}
function renderLearning(step,stage){
 const info=speech[Math.min(step,speech.length-1)],preset=C.presets[info.preset],visible=step<2?3:4;
 currentPreset=info.preset; ev('preset',currentPreset); reset(stage);
 const sm=isSmall(),svg=stateRoot('Terms in a sequence connected by hops labelled with a term-to-term rule.');
 const note=step===0?'Spot the change':step===1?'Each hop shows the same rule':step===2?'Use the rule to predict the next term':step===3?'The terms decrease by five':step===4?'Each term doubles': 'Compare the three rule types';
 drawSequence(svg,preset,{title:preset.label,subtitle:note,visible,showRule:step>0,showBlanks:false,highlightIndex:Math.min(2,visible-1)});
 if(step===2){ N.svg.pill(svg,(isSmall()?430:760)/2,355,'Next term = '+nextValue(preset,3),{role:'result',size:18}); }
 if(step===5){
   const W=isSmall()?430:760;
   N.svg.pill(svg,W*.25,352,'+3',{role:'focus',size:18});
   N.svg.pill(svg,W*.5,352,'−5',{role:'focus',size:18});
   N.svg.pill(svg,W*.75,352,'×2',{role:'focus',size:18});
   txt(svg,W/2,394,'Same idea: one fixed rule from term to term',sm?16:18,'support');
 }
 const side=H('aside',{class:'f902-side'});
 side.appendChild(sideCard('RULE',ruleLabel(preset), 'f902-card--gold'));
 side.appendChild(sideCard('NEXT TERM',String(nextValue(preset,visible-1))));
 side.appendChild(H('div',{class:'f902-card f902-card--full'},[
   H('div',{class:'f902-eyebrow',text:'WHAT TO NOTICE'}),
   H('div',{class:'f902-body',text:step<4?'The same change happens between every pair of terms.':'Multiplying by two is different from adding a fixed amount.'})
 ]));
 stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));
 N.scene.helperStrip(stage,info.pose,info.text);
 if(!N.reducedMotion()){
   const hops=[...svg.querySelectorAll('.nv-hop')];
   hops.forEach((el,i)=>{el.style.opacity='0.12'; N.motion.tween(260+120*i,v=>{el.style.opacity=String(.12+.88*v);},N.motion.ease.out);});
 }
}
function renderExplore(stage,panel){
 reset(stage); const preset=C.presets[currentPreset],svg=stateRoot('Explore different term-to-term rules and sequence types.');
 drawSequence(svg,preset,{title:preset.label,subtitle:'Use the preset buttons and slider to compare rules',visible:exploreVisible,showRule:true});
 const side=H('aside',{class:'f902-side'},[
   sideCard('TYPE',preset.type==='arith'?(preset.step>=0?'Arithmetic ↑':'Arithmetic ↓'):'Geometric','f902-card--gold'),
   sideCard('RULE',ruleLabel(preset)),
   sideCard('NEXT TERM',String(nextValue(preset,exploreVisible))),
   H('div',{class:'f902-card f902-card--full'},[H('div',{class:'f902-eyebrow',text:'THINK LIKE BOB'}),H('div',{class:'f902-body',text:preset.type==='arith'?'Compare one term with the next and check that the same amount is added or subtracted each time.':'Check whether each term is multiplied by the same factor.'})])
 ]);
 stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));
 N.scene.helperStrip(stage,preset.type==='geom'?'idea':'point-right',preset.type==='geom'?'This one multiplies each time.':'A term-to-term rule is the same for every hop.');
}
function taskData(i){
 return [
  {preset:'Y7-036-sequence-structure', seqVisible:4, correctRule:'+3', correctTerm:'16', ruleChoices:['+3','+4','×2'], termChoices:['16','15','17'], misconception:{'+4':'That would jump too far. Seven to ten is +3, not +4.','×2':'This sequence is not doubling; it adds the same amount each time.','15':'Add 3 to 13 once more.','17':'You have gone one jump too far.'}, title:'01 · Arithmetic rule and next term', guide:'Sequence: 4, 7, 10, 13, … Drag the correct rule onto the hop and the next term onto the final node.'},
  {preset:'Y8-019-arithmetic-sequences', seqVisible:4, correctRule:'−5', correctTerm:'10', ruleChoices:['−5','+5','÷5'], termChoices:['10','15','5'], misconception:{'+5':'The sequence is decreasing, not increasing.','÷5':'Dividing by 5 would give 6, not 25.','15':'Subtract five again from 15 to get the next term.','5':'That is two steps ahead.'}, title:'02 · Decreasing arithmetic sequence', guide:'Sequence: 30, 25, 20, 15, … Show the subtract-five rule and the next term.'},
  {preset:'Y8-020-geometric-sequences', seqVisible:4, correctRule:'×2', correctTerm:'24', ruleChoices:['×2','+6','+12'], termChoices:['24','18','30'], misconception:{'+6':'The increases are not constant; 6 to 12 is also doubling.','+12':'Adding 12 only works once here. The rule must work every time.','18':'Double 12 to get the next term.','30':'That is too large for one more step.'}, title:'03 · Geometric sequence', guide:'Sequence: 3, 6, 12, … Show the multiply-by-two rule and the next term.'}
 ][i];
}
function clearSlot(slot){challengeState[slot]=null; ev('placed',{slot,value:null});}
function setSlot(slot,value){challengeState[slot]=value; ev('placed',{slot,value});}
function tryPlace(slot,value,api){const t=taskData(challengeIndex); const expected=slot==='rule'?t.correctRule:t.correctTerm; if(value!==expected){api.check(false,t.misconception[value]||'Try again.',{task:challengeIndex,slot,value}); return false;} setSlot(slot,value); return true;}
function challengeTrayItem(svg,opt,slot,x,y,w,h,api){
 const g=E('g',{tabindex:0,role:'button','aria-label':'Choose '+opt+' for the '+slot},svg);
 N.neonBox(g,x,y,w,h,{role:slot==='rule'?'focus':'given',text:opt,size:isSmall()?15:17,r:16});
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); tryPlace(slot,opt,api)&&drawChallenge(api._stage,api);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=> slot==='rule'?[{x:api._ruleZone.x,y:api._ruleZone.y,w:api._ruleZone.w,h:api._ruleZone.h,id:'rule',kind:'drop'},{x:api._removeZone.x,y:api._removeZone.y,w:api._removeZone.w,h:api._removeZone.h,id:'remove',kind:'remove'}]:[{x:api._termZone.x,y:api._termZone.y,w:api._termZone.w,h:api._termZone.h,id:'term',kind:'drop'},{x:api._removeZone.x,y:api._removeZone.y,w:api._removeZone.w,h:api._removeZone.h,id:'remove',kind:'remove'}],
   onDrop:(id)=>{if(id!==slot)return false; const ok=tryPlace(slot,opt,api); if(ok)drawChallenge(api._stage,api); return ok;},
   onRemove:()=>false, removeTo:{x:api._removeZone.x+api._removeZone.w/2,y:api._removeZone.y+api._removeZone.h/2}
 });
}
function placedItem(svg,label,slot,x,y,w,h,api){
 const g=E('g',{tabindex:0,role:'button','aria-label':label+'. Press Delete to remove.'},svg);
 N.neonBox(g,x,y,w,h,{role:'result',text:label,size:isSmall()?15:17,r:16});
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault(); clearSlot(slot); drawChallenge(api._stage,api);}});
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[{x:api._removeZone.x,y:api._removeZone.y,w:api._removeZone.w,h:api._removeZone.h,id:'remove',kind:'remove'}],onDrop:()=>false,onRemove:()=>{clearSlot(slot); drawChallenge(api._stage,api);},removeTo:{x:api._removeZone.x+api._removeZone.w/2,y:api._removeZone.y+api._removeZone.h/2}});
}
function drawChallenge(stage,api){
 api._stage=stage; reset(stage); const t=taskData(challengeIndex), preset=C.presets[t.preset], sm=isSmall(), W=sm?430:760, svg=stateRoot(t.guide);
 const seq=drawSequence(svg,preset,{title:preset.label,subtitle:'Complete the rule and next term',visible:t.seqVisible,showRule:false,showBlanks:false,hideLast:true,ruleZone:true,termZone:true,count:5});
 api._ruleZone={x:(seq.xs[1]+seq.xs[2])/2-46,y:sm?82:72,w:92,h:36};
 api._termZone={x:seq.xs[4]-31,y:seq.baseY+34,w:62,h:42};
 api._removeZone={x:sm?20:180,y:sm?380:344,w:sm?390:390,h:78};
 if(challengeState.rule) placedItem(svg,challengeState.rule,'rule',api._ruleZone.x,api._ruleZone.y,api._ruleZone.w,api._ruleZone.h,api);
 if(challengeState.term) placedItem(svg,challengeState.term,'term',api._termZone.x,api._termZone.y,api._termZone.w,api._termZone.h,api);
 N.neonBox(svg,api._removeZone.x,api._removeZone.y,api._removeZone.w,api._removeZone.h,{role:'error',text:null,r:14});
 txt(svg,W/2,api._removeZone.y+18,'Drag here to remove · Keyboard: Enter to place, Delete to remove',sm?13:15,'support');
 txt(svg,sm?95:118,api._removeZone.y+49,'Rules',15,'focus');
 txt(svg,sm?95:118,api._removeZone.y+88,'Next terms',15,'given');
 const ruleY=api._removeZone.y+28, termY=api._removeZone.y+66, startX=sm?145:245, gap=sm?92:112;
 t.ruleChoices.forEach((opt,i)=>{if(challengeState.rule===opt) return; challengeTrayItem(svg,opt,'rule',startX+i*gap,ruleY,78,32,api);});
 t.termChoices.forEach((opt,i)=>{if(challengeState.term===opt) return; challengeTrayItem(svg,opt,'term',startX+i*gap,termY,78,32,api);});
 const side=H('aside',{class:'f902-side'},[
   sideCard('TARGET RULE',t.correctRule,'f902-card--gold'),
   sideCard('TARGET NEXT TERM',t.correctTerm),
   H('div',{class:'f902-card f902-card--full'},[H('div',{class:'f902-eyebrow',text:'COMMON TRAP'}),H('div',{class:'f902-body',text:challengeIndex===2?'Do not use addition just because the numbers are getting bigger.':'The term-to-term rule must work for every hop, not just one pair.'})])
 ]);
 stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));
 stage.appendChild(H('div',{class:'f902-evidence'},[
  H('span',{text:'Rule'}),H('span',{text:challengeState.rule||'?' }),H('span',{text:'Next'}),H('span',{class:'f902-next',text:challengeState.term||'?'})
 ]));
 N.scene.helperStrip(stage,preset.type==='geom'?'idea':'think',preset.type==='geom'?'Multiplying by the same amount is a geometric rule.':'Look for the same change each time.');
 }
const def={id,title:'Term-to-term animator',config:C,
 alt:'Sequence terms are connected by hops labelled with a rule such as +3, −5 or ×2. The next term follows the same term-to-term rule.',
 staticAlt:'Examples compare arithmetic and geometric sequences using repeated term-to-term rules.',
 steps:speech.map((d,i)=>({name:d.name,narration:d.text,prompt:d.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){active=Math.min(i,speech.length-1); renderLearning(active,stage);},
 exploreIntro:'Compare arithmetic and geometric sequences using reusable term-to-term rules.',
 explore(panel,stage,api){
   currentPreset='Y7-036-sequence-structure'; exploreVisible=4;
   const start=H('p',{class:'f902-instruction',text:'Pick a preset, then change how many terms you can see. Compare the rule and the next term.'});
   const presetBar=H('div',{class:'f902-presetbar'});
   Object.entries(C.presets).forEach(([key,p])=>presetBar.appendChild(hbtn(p.label,()=>{currentPreset=key; renderExplore(stage,panel); ev('preset',key);},'nova-btn ghost')));
   const slide=H('input',{type:'range',min:'3',max:'5',value:'4','aria-label':'Visible terms from 3 to 5'}),out=H('output',{class:'f902-micro',text:'Visible terms: 4'});
   function redraw(){out.textContent='Visible terms: '+exploreVisible; renderExplore(stage,panel); ev('term',exploreVisible);} 
   slide.addEventListener('input',()=>{exploreVisible=Number(slide.value); redraw();});
   panel.append(start,presetBar,H('div',{class:'f902-control'},[H('label',{},['Terms ',slide]),out,hbtn('Next preset',()=>{const ks=Object.keys(C.presets);let idx=(ks.indexOf(currentPreset)+1)%ks.length; currentPreset=ks[idx]; renderExplore(stage,panel);},'nova-btn primary')]));
   redraw();
 },
 challenge(panel,api,stage){
   challengeIndex=0; challengeState={rule:null,term:null};
   const header=H('h3',{class:'f902-taskhead'}),guide=H('p',{class:'f902-instruction'}),controls=H('div',{class:'f902-control'}),status=H('p',{class:'f902-status',role:'status'});
   function load(){ const t=taskData(challengeIndex); header.textContent=t.title; guide.textContent=t.guide; controls.innerHTML=''; api.fb.textContent=''; api.fb.className='nova-fb';
     controls.append(hbtn('Check answer',()=>{
       if(challengeState.rule!==t.correctRule || challengeState.term!==t.correctTerm){
         api.check(false, !challengeState.rule||!challengeState.term ? 'Place both the rule and the next term first.' : 'One or both choices are still wrong. Recheck the pattern.',{task:challengeIndex}); return;
       }
       api.check(true, challengeIndex===2?'Correct. ×2 gives the next term 24.':'Correct. The same term-to-term rule works across the whole sequence.',{task:challengeIndex,score:challengeIndex+1});
       if(challengeIndex===2){ header.textContent='All three challenges complete'; guide.textContent='You identified increasing, decreasing and multiplicative sequence rules.'; controls.replaceChildren(H('p',{class:'f902-maths f902-maths--gold',text:'3 / 3 · Rules secured'})); N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100}); return; }
       controls.append(hbtn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++; challengeState={rule:null,term:null}; load();},'nova-btn primary'));
     },'nova-btn primary'), hbtn('Reset placements',()=>{challengeState={rule:null,term:null}; drawChallenge(stage,api);},'nova-btn ghost'), hbtn('Hint',()=>{api.hint(challengeIndex===2?'Check whether each term doubles.':'Compare one term with the next, then use the same step again.');},'nova-btn ghost'));
     drawChallenge(stage,api); ev('challengeTask',{index:challengeIndex});
   }
   panel.append(header,guide,controls,status); load();
 },
 onRestore(){currentPreset='Y7-036-sequence-structure'; exploreVisible=4; challengeIndex=0; challengeState={rule:null,term:null};}
};
N.registry.add({id,title:'Term-to-term animator',topics:['sequences','term-to-term','arithmetic sequences','geometric sequences'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08']});
N.bankMount({id,num:'02',title:'Term-to-term animator · Premium Edition',def,linked:['F9-01','F9-03','F9-04','F9-05'],years:'Year 7 and Year 8 sequences, GCSE bridge',spec:{
 purpose:'Recognise and apply term-to-term rules in arithmetic and geometric sequences, then predict the next term.',
 params:'Arithmetic +3, arithmetic −5, geometric ×2; visible terms 3–5; next-term prediction linked to the rule.',
 presets:'Y7-036 Sequence rules and structure; Y8-019 Arithmetic sequences; Y8-020 Geometric sequences.',
 steps:'Notice terms → reveal hop rule → predict next term → decreasing sequence → geometric sequence → compare rule types.',
 interactions:'Watch, Guided, Explore preset buttons and slider, Challenge drag-and-drop rule and next-term cards with keyboard placement/removal.',
 traps:'Using the wrong operation, using a rule that works only once, treating geometric sequences like additive patterns, jumping too many steps.',
 gcse:'Bridge to nth term and special-sequence work; links to F9-03, F9-04 and F9-05.'
}});
window.F902_ENGINE=N.engines[id];
const card=document.getElementById(id),spec=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...card.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>spec.appendChild(x));card.appendChild(spec);
const gc=card.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const patchBobAlt=()=>card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});patchBobAlt();new MutationObserver(patchBobAlt).observe(card,{childList:true,subtree:true});
})();
