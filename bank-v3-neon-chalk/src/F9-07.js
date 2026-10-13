/* F9-07 Special Sequences · F0/F1/F2/F9-01 v3 visual family, no shared-shell overrides. */
const F907_CONFIG={id:'F9-07',family:'F9',startMode:'watch',presets:{
 'Y7-036-sequence-structures':{label:'Y7 · Shapes & patterns',defaultKind:'square',context:'square, triangular, cube and Fibonacci sequence structures'},
 'Y8-020-compare-geometric':{label:'Y8 · Compare rules',defaultKind:'cube',context:'recognise patterns that are not constant-ratio geometric sequences'}
 },events:{value:['preset','pattern','position','count','placed','challengeTask'],types:['step','correct','hintUsed','mode']}};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F907_CONFIG,id=C.id;
const small=()=>window.innerWidth<=760,W=()=>small()?430:760;
const kindList=['square','triangle','cube','fibonacci'];
const names={square:'SQUARE NUMBERS',triangle:'TRIANGULAR NUMBERS',cube:'CUBE NUMBERS',fibonacci:'FIBONACCI NUMBERS'};
const series={square:[1,4,9,16,25,36],triangle:[1,3,6,10,15,21],cube:[1,8,27,64,125,216],fibonacci:[1,1,2,3,5,8]};
const STEPS=[
 {name:'square-arrays-grow',kind:'square',n:3,pose:'explain',text:'Start with square arrays. Three rows of three dots make nine.',prompt:'What changes in each new square?'},
 {name:'square-rule',kind:'square',n:4,pose:'count',text:'Four rows of four dots make sixteen. Square numbers multiply the position by itself.',prompt:'Why does four squared give sixteen?'},
 {name:'triangular-rows',kind:'triangle',n:4,pose:'point-down',text:'Triangle numbers grow by adding a new row: one, then two, then three, then four.',prompt:'How many dots altogether in the fourth triangle?'},
 {name:'cubic-layers',kind:'cube',n:3,pose:'point-right',text:'Cube numbers add depth. Three layers of three-by-three dots make twenty-seven.',prompt:'How many dots are in each layer?'},
 {name:'fibonacci-two-before',kind:'fibonacci',n:6,pose:'idea',text:'The Fibonacci rule is different. Add the two previous terms: three and five make eight.',prompt:'Which two terms combine to make eight?'},
 {name:'compare-structure',kind:'compare',n:4,pose:'celebrate',text:'Square numbers make arrays, triangular numbers make rows, cubes add layers, and Fibonacci adds the last two terms.',prompt:'Choose the structure that explains each sequence.'}
];
const TASKS=[
 {kind:'square',title:'01 · Recognise the square pattern',guide:'Look at the equal rows and columns. Match the pattern to its number sequence.'},
 {kind:'triangle',title:'02 · Recognise the triangular pattern',guide:'Each new triangular shape adds a longer row. Match the sequence.'},
 {kind:'cube',title:'03 · Recognise the cube pattern',guide:'This pattern grows in three dimensions, with layers of dots. Match the sequence.'},
 {kind:'fibonacci',title:'04 · Recognise the Fibonacci pattern',guide:'Each new count comes from adding the previous two. Match the sequence.'}
];
const val=(kind,n)=>series[kind][n-1],label=(kind,n)=>kind==='square'?n+' × '+n:kind==='triangle'?'1 + 2 + … + '+n:kind==='cube'?n+' × '+n+' × '+n:'Previous two terms added';
let selectedKind='square',presetKey='Y7-036-sequence-structures',position=4,challengeIndex=0,placed=null,kbChoice=null,stageRef=null,apiRef=null,panelRef=null;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9-07 event '+key);N.events.emit('value',{engine:id,key,value});}
function text(p,x,y,t,size=19,role='given',anchor='middle'){return N.chalkText(p,x,y,String(t),{size,role,anchor});}
function box(p,x,y,w,h,t,role='given',size=18){return N.neonBox(p,x,y,w,h,{role,text:t,size,r:13});}
function btn(t,fn,cls='nova-btn ghost'){return H('button',{class:cls,text:t,onclick:fn});}
function root(alt,challenge=false){const svg=N.svg.root(W(),challenge?1040:790,alt);svg.classList.add('nv-svg','f907-svg');svg.setAttribute('role','img');return svg;}
function clear(stage){stage.replaceChildren();N.cap(stage,'Sequence workshop','Special sequences');}
function card(title,value,gold=false){return H('div',{class:'f907-card'+(gold?' f907-card--gold':'')},[H('div',{class:'f907-eyebrow',text:title}),H('div',{class:'f907-maths'+(gold?' f907-maths--gold':''),text:String(value)})]);}
function note(title,value){return H('div',{class:'f907-card f907-card--full'},[H('div',{class:'f907-eyebrow',text:title}),H('div',{class:'f907-body',text:String(value)})]);}
function mount(stage,svg,cards,pose,say){stage.appendChild(H('div',{class:'f907-stage'},[svg,H('aside',{class:'f907-side'},cards)]));N.scene.helperStrip(stage,pose,say);}
function dot(svg,x,y,role='op',r=6){return N.neonRing(svg,x,y,{role,r,pulse:false});}
function squareDots(svg,n,cx,cy,size,mini=false){const g=E('g',{'data-pattern':'square'},svg),d=size/Math.max(1,n-1),x0=cx-(n-1)*d/2,y0=cy-(n-1)*d/2;
 for(let row=0;row<n;row++)for(let col=0;col<n;col++)dot(g,x0+col*d,y0+row*d,row===n-1?'focus':'op',mini?3.7:5.5);
 if(!mini && n>=2){N.neonLine(g,x0-17,y0-18,x0+(n-1)*d+17,y0-18,{role:'support',width:2.2});N.neonLine(g,x0-20,y0-17,x0-20,y0+(n-1)*d+17,{role:'support',width:2.2});}
 return g;
}
function triangleDots(svg,n,cx,cy,size,mini=false){const g=E('g',{'data-pattern':'triangle'},svg),d=size/Math.max(1,n-1),x0=cx,top=cy-(n-1)*d/2;
 for(let row=0;row<n;row++)for(let j=0;j<=row;j++)dot(g,x0+(j-row/2)*d,top+row*d,row===n-1?'focus':'op',mini?3.5:5.6);
 return g;
}
function cubeDots(svg,n,cx,cy,size,mini=false){const g=E('g',{'data-pattern':'cube'},svg),d=size/Math.max(1,n-1),dx=d*.9,dy=d*.31,dz=d*.92;
 const anchorX=cx,anchorY=cy+(n-1)*(dz-dy)/2;
 // 3D projection: each stacked layer is a complete n×n square of dots; exact n cubed points.
 for(let k=0;k<n;k++)for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  let x=anchorX+(i-j)*dx,y=anchorY+(i+j)*dy-k*dz;
  dot(g,x,y,k===n-1?'focus':'op',mini?2.8:4.4);
 }
 if(!mini){let m=(n-1);const proj=(i,j,k)=>[anchorX+(i-j)*dx,anchorY+(i+j)*dy-k*dz];
   const edges=[[0,0,0,m,0,0],[0,0,0,0,m,0],[0,0,0,0,0,m],[m,m,0,m,0,0],[m,m,0,0,m,0],[m,m,0,m,m,m],[0,0,m,m,0,m],[0,0,m,0,m,m],[m,0,m,m,m,m],[0,m,m,m,m,m],[m,0,0,m,0,m],[0,m,0,0,m,m]];
   for(let [a,b,c,d1,e,f] of edges){let p=proj(a,b,c),q=proj(d1,e,f);N.neonLine(g,p[0],p[1],q[0],q[1],{role:'support',width:mini?1:2});}
 }
 return g;
}
function fibDots(svg,n,cx,cy,size,mini=false){const g=E('g',{'data-pattern':'fibonacci'},svg),v=val('fibonacci',n),w=Math.min(250,size*1.9),cols=Math.max(1,Math.ceil(Math.sqrt(v))),rows=Math.ceil(v/cols),step=Math.min(31,w/Math.max(1,cols));
 const x0=cx-(cols-1)*step/2,y0=cy-(rows-1)*step/2;
 if(!mini)box(g,cx-w*.61,cy-w*.48,w*1.22,w*.98,null,'support');
 for(let i=0;i<v;i++){const ix=i%cols,iy=Math.floor(i/cols);dot(g,x0+ix*step,y0+iy*step,'op',mini?3.4:5.6);}
 return g;
}
const DRAW={square:squareDots,triangle:triangleDots,cube:cubeDots,fibonacci:fibDots};
function scenePattern(svg,kind,n,{challenge=false,compare=false}={}){
 const w=W(),cx=w/2;
 if(compare){
  const pairs=[['square',w*.28,220],['triangle',w*.73,220],['cube',w*.28,495],['fibonacci',w*.73,495]];
  for(let [k,x,y] of pairs){DRAW[k](svg,k==='fibonacci'?5:k==='cube'?3:4,x,y,100,true);text(svg,x,y+112,{square:'SQUARES',triangle:'TRIANGLES',cube:'CUBES',fibonacci:'FIBONACCI'}[k],small()?19:21,'support');text(svg,x,y+148,series[k].slice(0,4).join(', '),small()?20:21,'result');}
  return;
 }
 const focusN=n;
 DRAW[kind](svg,focusN,cx,challenge?304:306,kind==='cube'?180:210,false);
 const labelsY=challenge?488:489;
 if(!challenge){
  text(svg,w/2,labelsY,'Stage '+focusN+'   ·   '+val(kind,focusN)+' dots',small()?21:26,'result');
  const xs=[w*.15,w*.38,w*.62,w*.85],nValues=kind==='fibonacci'?[2,3,4,5]:[1,2,3,4],miniY=kind==='cube'?575:573;
  for(let i=0;i<4;i++){
   const nn=nValues[i],pX=xs[i];
   DRAW[kind](svg,nn,pX,miniY,small()?41:54,true);
   text(svg,pX,654,'Stage '+nn,small()?19:18,'support');
   text(svg,pX,687,String(val(kind,nn)),small()?22:25,i===3?'result':'given');
  }
 }else{
  text(svg,cx,labelsY,'Which sequence describes these growing shapes?',small()?18:22,'support');
 }
}
function teach(i,stage){const s=STEPS[Math.min(i,5)],k=s.kind,w=W();clear(stage);
 const svg=root('Neon dot patterns for square, triangular, cube and Fibonacci sequences.');
 text(svg,w/2,50,i===5?'FOUR PATTERNS · FOUR RULES':names[k],small()?23:29,'support');
 text(svg,w/2,93,[ 'Equal rows and columns form a square','Position times itself','Add one more dot in each new row','Add another layer of dots','Add the previous two numbers','Use the structure to recognise the rule'][i],small()?16:19,'support');
 scenePattern(svg,k,s.n,{compare:i===5});
 if(i===5)text(svg,w/2,734,'Which pattern uses the previous two terms?',small()?19:20,'support');
 else if(i===4){N.svg.pill(svg,w/2,730,'3 + 5 = 8',{role:'focus',size:small()?22:25});}
 else N.svg.pill(svg,w/2,735,label(k,s.n)+' = '+val(k,s.n),{role:'focus',size:small()?17:22});
 let cards=[];
 if(i===5){cards=[card('SQUARES','1, 4, 9, 16'),card('TRIANGLES','1, 3, 6, 10',true),card('CUBES','1, 8, 27, 64'),card('FIBONACCI','1, 1, 2, 3, 5, 8'),note('NOTICE','A pattern may use shape, position or the previous two terms. Check the explanation, not just a few numbers.')];}
 else cards=[card('DOT COUNT',val(k,s.n)),card('PATTERN',names[k],true),note('MATHEMATICAL EVIDENCE',i===0?'Rows of three dots: 3 × 3 = 9.':i===1?'Four rows of four: 4 × 4 = 16.':i===2?'Four rows with 1, 2, 3 and 4 dots: 1 + 2 + 3 + 4 = 10.':i===3?'Three layers. Each has 3 × 3 = 9 dots. Total 3 × 9 = 27.':'Each term is the sum of the two before it: 3 + 5 = 8.')];
 mount(stage,svg,cards,s.pose,s.text);
 if(!N.reducedMotion()){let dots=[...svg.querySelectorAll('.nv-ring')];dots.forEach((g,j)=>{g.style.opacity='0';N.motion.tween(220+Math.min(j,28)*22,v=>{if(g.isConnected)g.style.opacity=String(v);},N.motion.ease.out);});}
}
function explore(stage){clear(stage);const w=W(),svg=root('Explore geometric and Fibonacci dot patterns by switching pattern type and stage.');
 text(svg,w/2,45,names[selectedKind],small()?25:29,'support');
 text(svg,w/2,86,'Change the stage · see the new dots appear',small()?16:20,'support');
 const n=Math.max(selectedKind==='fibonacci'?2:1,position);
 scenePattern(svg,selectedKind,n,{});
 N.svg.pill(svg,w/2,739,label(selectedKind,n)+' = '+val(selectedKind,n),{role:'focus',size:small()?17:21});
 const cards=[card('TOTAL DOTS',val(selectedKind,n),true),card('STAGE',n),note('WHY THIS WORKS',selectedKind==='square'?'n rows of n dots give n squared.':selectedKind==='triangle'?'Keep adding the next whole-number row: 1 + 2 + … + n.':selectedKind==='cube'?'n layers each hold n × n dots, so total n cubed.':'The next count is the sum of the previous TWO counts.')];
 mount(stage,svg,cards,selectedKind==='fibonacci'?'idea':'point-right','Look at the construction. Find the rule from how the dots grow.');
}
function task(){return TASKS[challengeIndex];}
const dest=()=>({x:small()?60:225,y:596,w:small()?310:310,h:62,id:'sequence',kind:'drop'});
const bin=()=>({x:small()?50:198,y:967,w:small()?330:364,h:54,id:'remove',kind:'remove'});
function status(s){let el=panelRef&&panelRef.querySelector('.f907-status');if(el)el.textContent=s;}
function diagnostic(chosen){const actual=task().kind;
 const descriptions={square:'square arrays have n rows of n, giving 1, 4, 9, 16.',triangle:'triangular arrangements grow by adding 1, then 2, then 3, then 4 dots.',cube:'cubes grow with depth: n × n × n, not just an n × n square.',fibonacci:'Fibonacci adds the previous TWO terms instead of counting equal rows or layers.'};
 return 'Not this one. '+descriptions[chosen]+' Look again at the shape in the centre.';
}
function place(v){let target=task().kind;
 if(v!==target){apiRef.check(false,diagnostic(v),{task:challengeIndex,choice:v});status('That card describes a different structure.');return false;}
 placed=v;kbChoice=null;ev('placed',{kind:v});drawChallenge();status('Matched correctly. Check your answer.');return true;
}
function remove(){placed=null;kbChoice=null;ev('placed',{kind:null});drawChallenge();status('Removed. Try another card.');}
function fastBridge(g){g.addEventListener('pointerdown',e=>{const drag=N.ui._drag;if(!drag||drag.el!==g)return;const pid=e.pointerId;let done=false;
 const clean=()=>{if(done)return;done=true;window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',up,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('blur',cancel,true);};
 function move(e){if(done)return;if(N.ui._drag!==drag){clean();return;}if(e.pointerId!==pid||g.contains(e.target))return;g.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:pid,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons}));}
 function up(e){if(e.pointerId!==pid)return;if(N.ui._drag===drag&&drag.up)drag.up(e);clean();}
 function cancel(){if(N.ui._drag===drag)drag.cancel();clean();}
 window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('blur',cancel,true);
 });}
function source(svg,k,x,y,w,h){const textValue=series[k].slice(0,k==='fibonacci'?6:4).join(', '),g=E('g',{'data-source':k,tabindex:0,role:'button','aria-label':'Choose '+textValue},svg);
 box(g,x,y,w,h,textValue,'given',small()?20:21);
 function choose(){kbChoice=k;status('Selected '+textValue+'. Now press Enter on the pattern gap.');}
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
 g.addEventListener('click',choose);
 N.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[dest(),bin()],onDrop:(id)=>id==='sequence'?place(k):false,onRemove:()=>{kbChoice=null;status('Card returned to tray.');},removeTo:{x:W()/2,y:bin().y+20}});fastBridge(g);
}
function placedCard(svg){const z=dest(),g=E('g',{'data-placed':'sequence',tabindex:0,role:'button','aria-label':'Placed sequence. Press Delete to remove.'},svg);
 box(g,z.x,z.y,z.w,z.h,series[placed].slice(0,placed==='fibonacci'?6:4).join(', '),'result',small()?20:22);
 g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove();}});
 N.ui.svgDrag(svg,g,{box:z,zones:()=>[bin()],onDrop:()=>false,onRemove:remove,removeTo:{x:W()/2,y:bin().y+20}});fastBridge(g);
}
function target(svg){const z=dest();if(placed){placedCard(svg);return;}
 box(svg,z.x,z.y,z.w,z.h,'Drop sequence card here','unknown',small()?18:21);
 const hit=E('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:13,fill:'transparent','data-slot':'sequence',tabindex:0,role:'button','aria-label':'Place the chosen sequence here'},svg);
 function go(){if(kbChoice)place(kbChoice);else status('Choose a sequence card first.');}
 hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});hit.addEventListener('click',go);
}
function drawChallenge(){if(!stageRef)return;clear(stageRef);
 const t=task(),w=W(),svg=root('Match the four special sequence dot patterns with their numerical sequences.',true);
 text(svg,w/2,40,'MATCH THE GROWING PATTERN',small()?23:29,'support');
 text(svg,w/2,79,'Count the dots · choose the matching sequence',small()?16:19,'support');
 scenePattern(svg,t.kind,t.kind==='cube'?3:t.kind==='fibonacci'?6:4,{challenge:true});
 text(svg,w/2,563,'SEQUENCE CARD TARGET',small()?16:19,'support');target(svg);
 text(svg,small()?28:148,717,'PICK THE NUMBER PATTERN',small()?16:19,'support','start');
 const x0=small()?29:149,cardW=small()?175:220,gap=small()?20:22;
 kindList.forEach((k,i)=>{if(placed===k)return;source(svg,k,x0+(i%2)*(cardW+gap),733+Math.floor(i/2)*77,cardW,56);});
 const r=bin();box(svg,r.x,r.y,r.w,r.h,'RED REMOVE TRAY','error',small()?18:20);
 mount(stageRef,svg,[card('TASK',challengeIndex+1+' of 4',true),note('WHAT TO CHECK','Match the structure in the drawing to its sequence. Do not guess by one term.'),note('KEYBOARD','Enter on a sequence card, then Enter on the gap. Delete a placed card to remove it.')],challengeIndex===3?'think':'point-right','Look at how each stage grows. The dots hold the evidence.');
}
const def={id,title:'Special sequences',config:C,
 alt:'Square numbers as square dot arrays, triangular numbers as growing rows, cube numbers as stacked 3D dot lattices, Fibonacci as counts built from the previous two terms.',
 staticAlt:'Square: 1, 4, 9, 16. Triangular: 1, 3, 6, 10. Cube: 1, 8, 27, 64. Fibonacci: 1, 1, 2, 3, 5, 8.',
 steps:STEPS.map((s,i)=>({name:s.name,narration:s.text,prompt:s.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){teach(i,stage);},
 exploreIntro:'Change between square, triangular, cube and Fibonacci structures. Adjust the position and examine how the dots grow.',
 explore(panel,stage,api){selectedKind='square';presetKey='Y7-036-sequence-structures';position=4;
   const info=H('p',{class:'f907-instruction',text:'Choose a lesson preset and a sequence family, then use the slider to build more dots.'});
   const lessons=H('div',{class:'f907-choices'}),families=H('div',{class:'f907-choices'});
   Object.entries(C.presets).forEach(([key,p])=>lessons.appendChild(btn(p.label,()=>{presetKey=key;selectedKind=p.defaultKind;ev('preset',key);explore(stage);},'nova-btn ghost')));
   kindList.forEach(k=>families.appendChild(btn(names[k].replace(' NUMBERS','').toLowerCase(),()=>{selectedKind=k;if(selectedKind==='fibonacci'&&position<2)position=2;ev('pattern',k);explore(stage);},'nova-btn ghost')));
   const range=H('input',{type:'range',min:1,max:4,value:4,'aria-label':'Sequence stage'}),out=H('output',{class:'f907-micro',text:'Stage 4'});
   range.addEventListener('input',()=>{position=+range.value;if(selectedKind==='fibonacci'&&position<2)position=2;out.textContent='Stage '+position;ev('position',position);explore(stage);});
   panel.append(info,lessons,families,H('div',{class:'f907-control'},[H('label',{},['Stage ',range]),out,btn('Next stage',()=>{position=position>=4?1:position+1;if(selectedKind==='fibonacci'&&position<2)position=2;range.value=position;out.textContent='Stage '+position;explore(stage);},'nova-btn primary')]));explore(stage);
 },
 challenge(panel,api,stage){challengeIndex=0;placed=null;kbChoice=null;stageRef=stage;panelRef=panel;apiRef=api;
   const heading=H('h3',{class:'f907-taskhead'}),guide=H('p',{class:'f907-instruction'}),controls=H('div',{class:'f907-control'}),statusEl=H('p',{class:'f907-status',role:'status'});
   function load(){const t=task();heading.textContent=t.title;guide.textContent=t.guide;controls.replaceChildren();statusEl.textContent='Drag one matching sequence card, or use Enter to select and place it.';api.fb.textContent='';api.fb.className='nova-fb';
     controls.append(btn('Check match',()=>{if(placed!==t.kind){api.check(false,'You need to place the correct sequence card first.',{task:challengeIndex});return;}
      api.check(true,'Correct! '+names[t.kind].toLowerCase()+' have the structure you just matched.',{task:challengeIndex,score:challengeIndex+1});ev('count',val(t.kind,t.kind==='fibonacci'?6:t.kind==='cube'?3:4));
      if(challengeIndex===3){heading.textContent='Four special sequences recognised';guide.textContent='You matched squares, triangles, cubes and Fibonacci using mathematical structure.';controls.replaceChildren(H('p',{class:'f907-maths f907-maths--gold',text:'4 / 4 · Structures recognised'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
      controls.append(btn('Continue to challenge '+(challengeIndex+2),()=>{challengeIndex++;placed=null;kbChoice=null;load();},'nova-btn primary'));
     },'nova-btn primary'),btn('Reset card',()=>{placed=null;kbChoice=null;drawChallenge();},'nova-btn ghost'),btn('Hint',()=>api.hint('Count or group the dots. Does the picture make equal square rows, a triangle, a layered cube, or a sum of two previous terms?'),'nova-btn ghost'));
     ev('challengeTask',{index:challengeIndex});drawChallenge();
   }
   panel.append(heading,guide,controls,statusEl);load();
 },
 onRestore(){selectedKind='square';presetKey='Y7-036-sequence-structures';position=4;challengeIndex=0;placed=null;kbChoice=null;stageRef=null;panelRef=null;apiRef=null;}
};
N.registry.add({id,title:'Special sequences',topics:['sequences','square numbers','cube numbers','triangular numbers','Fibonacci numbers'],deps:['F0-02','F0-04','F0-07','F0-08','F0-13']});
N.bankMount({id,num:'07',title:'Special sequences · Premium Edition',def,linked:['F9-02','F9-06','F9-08','F9-09'],years:'Year 7 sequences and structure · Year 8 geometric contrast · GCSE extension',spec:{
 purpose:'Recognise square, triangular, cube and Fibonacci sequences from the mathematical structure of dot and array patterns.',
 params:'Square n²; triangular n(n+1)/2; cube n³; Fibonacci F1=F2=1 and each next term equals the sum of the two preceding terms.',
 presets:'Y7-036 sequence structures; Y8-020 compare with geometric sequence rules.',
 steps:'Square array growth → square-rule evidence → triangular rows → cube layers → Fibonacci sums → compare and generalise.',
 interactions:'Four modes; Explore preset, pattern family and position; Challenge four drag-to-match tasks with remove/re-grab and keyboard equivalents.',
 traps:'Confusing n² and n³; mistaking triangular numbers for square numbers; assuming Fibonacci has a fixed difference or ratio.',
 gcse:'Foundations for figurate numbers, nth term distinctions, and sequence classification. No false geometric-ratio claim about Fibonacci.'
}});
window.F907_ENGINE=N.engines[id];
const c=document.getElementById(id),dev=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);[...c.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>dev.appendChild(x));c.appendChild(dev);
const heading=c.querySelector('h3');if(heading)heading.textContent='Interactive maths workshop';
const ensureAlt=()=>c.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});ensureAlt();new MutationObserver(ensureAlt).observe(c,{childList:true,subtree:true});
})();
