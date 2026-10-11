/* F9-01 · Matchstick Pattern Builder · NOVA Neon + Chalk. Uses F0 foundation API and F3 v3.6.2 interaction core. */
const F901_CONFIG={
 id:'F9-01',family:'F9',startMode:'watch',preset:'Y7-036-sequence-structure',
 minStage:1,maxStage:7,firstTerm:4,difference:3,
 presets:{'Y7-036-sequence-structure':{label:'Year 7 · Sequence rules',shape:'joined-squares',minStage:1,maxStage:7,difference:3}},
 events:{value:['stage','stick','count','rule','target','challengeTask','placed'],types:['step','correct','hintUsed','mode']},
 challenge:{targets:[13,16,22]}
};
(function(){'use strict';
const N=window.NOVA,C=F901_CONFIG,E=N.svg.el,H=N.h,id=C.id;
// Use the shared F0 helper-picker selection; never override it locally.
const isSmall=()=>window.innerWidth<=760;
const speech=[
 {name:'first-square',pose:'explain',skin:'pip',text:'Start with one square. Count its four sticks.',prompt:'Count all four sides of the first square.',shown:1,add:0},
 {name:'share-side',pose:'point-right',skin:'pip',text:'A second square shares one side. We only add three sticks.',prompt:'Predict the total before counting the second square.',shown:2,add:1},
 {name:'third-square',pose:'think',skin:'pip',text:'Watch the next square. Again, three new sticks, not four.',prompt:'What stayed the same when the pattern grew?',shown:3,add:2},
 {name:'notice-difference',pose:'idea',skin:'pip',text:'The totals are four, seven and ten. Each step grows by three.',prompt:'How much is added each time? Look at the differences.',shown:3,add:2},
 {name:'fourth-square',pose:'point-right',skin:'pip',text:'Add one more square. Ten plus three makes thirteen.',prompt:'Predict the number of sticks in stage four.',shown:4,add:3},
 {name:'rule',pose:'celebrate',skin:'pip',text:'Three for every stage, plus one starting side. The total is three n plus one.',prompt:'Explain why the rule is three n plus one.',shown:4,add:3}
];
let active=0,exploreStage=4,placed={top:false,right:false,bottom:false},challengeIndex=0;
function ev(key,value){if(!C.events.value.includes(key))throw Error('Unregistered F9 event '+key);N.events.emit('value',{engine:id,key,value});}
function answer(n){return 3*n+1;}
function txt(p,x,y,t,size=22,role='given',anchor='middle'){return N.chalkText(p,x,y,String(t),{size,role,anchor});}
function line(p,x1,y1,x2,y2,role='op',width=8){return N.neonLine(p,x1,y1,x2,y2,{role,width});}
function box(p,x,y,w,h,role='given',text=null,size=20){return N.neonBox(p,x,y,w,h,{role,text,size,r:11});}
function hbtn(t,fn,cls='nova-btn'){return H('button',{class:cls,text:t,onclick:fn});}
function glyph(p,x1,y1,x2,y2,role='op',w=9){return line(p,x1,y1,x2,y2,role,w);}
function stateRoot(alt){let sm=isSmall();let svg=N.svg.root(sm?430:760,sm?485:463,alt);svg.setAttribute('class','nv-svg f901-svg');svg.setAttribute('role','img');return svg;}
function reset(stage){stage.innerHTML='';N.cap(stage,'Sequence workshop','Matchstick pattern builder');}
function mainSticks(p,x,y,s,n,newIndex=-1,width=10){for(let i=0;i<n;i++){
 const a=x+i*s,b=x+(i+1)*s,hot=i===newIndex?'focus':'op';
 glyph(p,a,y,b,y,hot,width);glyph(p,a,y+s,b,y+s,hot,width);glyph(p,b,y,b,y+s,hot,width);
 }glyph(p,x,y,x,y+s,'op',width);}
function showMini(p,x,y,n,shown){const s=20,base=x-n*s/2;
 if(shown){for(let i=0;i<n;i++){let lx=base+i*s;glyph(p,lx,y,lx+s,y,'op',3);glyph(p,lx,y+s,lx+s,y+s,'op',3);glyph(p,lx+s,y,lx+s,y+s,'op',3);}glyph(p,base,y,base,y+s,'op',3);}
 txt(p,x,y+49,shown?answer(n):'?',20,shown?'result':'support');
 txt(p,x,y-18,'Stage '+n,14,'support');
}
function infoTable(max){const table=H('table',{class:'f901-table','aria-label':'Matchstick counts by stage'}),head=H('tr');['Stage','1','2','3','4'].forEach(t=>head.appendChild(H('th',{text:t})));const row=H('tr');row.appendChild(H('td',{text:'Sticks'}));for(let i=1;i<=4;i++)row.appendChild(H('td',{class:i>max?'unknown':i===max?'added':'',text:i>max?'?':String(answer(i))}));table.append(head,row);return table;}
function sideCard(label,text,cls=''){return H('div',{class:'f901-card '+cls},[H('div',{class:'f901-eyebrow',text:label}),H('div',{class:'f901-maths',text})]);}
function renderLearning(step,stage,options={}){
 const data=speech[Math.min(step,speech.length-1)],visible=options.exploreStage||data.shown,emphasis=step===5?'rule':step>=3?'growth':'count';
 reset(stage);const wrap=H('div',{class:'f901-stage'}),svg=stateRoot('Connected matchstick squares. Stage '+visible+' contains '+answer(visible)+' sticks.');
 const W=isSmall()?430:760,cx=W/2,sm=isSmall(),s=Math.min(sm?87:114,(W-62)/Math.max(4,visible)),x=cx-visible*s/2,y=sm?128:127;
 N.svg.pill(svg,W/2,33,'Stage '+visible,{role:'given',size:18});
 if(step===0){txt(svg,W/2,73,'Four sides make the first square',sm?18:21,'support');}
 else if(step<3){txt(svg,W/2,73,step===1?'One side is shared':'Only three new sticks',19,'support');}
 else if(step<5){txt(svg,W/2,73,step===3?'Spot the repeating +3':'Predict, then count',19,'support');}
 else txt(svg,W/2,73,'Every new square adds three',19,'support');
 mainSticks(svg,x,y,s,visible,step>=1&&step!==3?visible-1:-1,sm?10:12);
 txt(svg,W/2,y+s+38,answer(visible)+' sticks',sm?29:31,'result');
 if(visible>1){for(let k=1;k<visible;k++){
  if(k===visible-1||step===3){let xx=x+(k+.5)*s;N.svg.pill(svg,xx,y-21,'+3',{role:step>=3?'focus':'support',size:sm?14:17});}
 }}
 const lineY=sm?373:365; if(sm)txt(svg,W/2,lineY-48, 'How the pattern grows',19,'support');
 for(let n=1;n<=4;n++){
  let xx=(W/4)*(n-.5),show=n<=visible;
  showMini(svg,xx,lineY,n,show);
 }
 if(step>=3){N.svg.pill(svg,W/2,sm?452:433,'Difference = +3',{role:'focus',size:18});}
 const side=H('aside',{class:'f901-side'});
 side.appendChild(sideCard('STICK COUNT',String(answer(visible)), ''));
 if(emphasis==='rule') side.appendChild(sideCard('Nth TERM','3n + 1','f901-card--gold'));
 else if(emphasis==='growth')side.appendChild(sideCard('ADD EACH TIME','+3','f901-card--gold'));
 else side.appendChild(sideCard('WHAT TO NOTICE',visible===1?'4 sides': 'One shared side','f901-card--gold'));
 const tc=H('div',{class:'f901-card f901-card--full'});tc.appendChild(H('div',{class:'f901-eyebrow',text:'TERM TABLE'}));tc.appendChild(infoTable(visible));side.appendChild(tc);
 if(step<5){const reflection=['Count the four edges. Where could a second square connect?','One old edge belongs to both squares. Point to that shared side.','Compare seven with ten. Which three pieces were added?','Look at four, seven and ten. Predict the next total.','Four squares need thirteen sticks. Can you justify the extra one?'][step];side.appendChild(H('div',{class:'f901-card f901-card--full f901-predict'},[H('div',{class:'f901-eyebrow',text:'YOUR NEXT THOUGHT'}),H('div',{class:'f901-body',text:reflection})]));}
 if(step===5){side.appendChild(H('div',{class:'f901-card f901-card--full f901-predict'},[H('div',{class:'f901-eyebrow',text:'PROVE THE RULE'}),H('div',{class:'f901-body',text:'Can you explain where the one extra starting side comes from?'})]));}
 wrap.append(svg,side);stage.appendChild(wrap);N.scene.helperStrip(stage,data.pose,data.text);
 if(step===5){let eq=H('div',{class:'f901-trail'},[H('span',{text:'3 sticks per square'}),H('span',{text:'+'}),H('span',{text:'1 starting side'}),H('span',{text:'='}),H('span',{text:'3n + 1'})]);side.appendChild(eq);}
 if(!N.reducedMotion()&&step>0&&step!==3){let added=svg.querySelectorAll('.nv-neon-tube');let j=0;for(let el of [...added].slice(-3)){el.style.opacity='0.1';N.motion.tween(420,(v)=>{el.style.opacity=String(.1+.9*v);},N.motion.ease.out);j++;}}
}
function renderChallenge(stage,stepState){
 reset(stage);const sm=isSmall(),W=sm?430:760,svg=stateRoot('Complete the fourth square by adding its three missing matchsticks.');
 const x=sm?25:162,s=sm?89:109,y=sm?104:104;
 txt(svg,W/2,39,'Build the fourth square',sm?22:25,'support');
 mainSticks(svg,x,y,s,3,-1,sm?9:10);
 // The shared side is already visible; only top, outer-right and bottom pieces are missing.
 const coords={top:[x+3*s,y,x+4*s,y],right:[x+4*s,y,x+4*s,y+s],bottom:[x+3*s,y+s,x+4*s,y+s]};
 const labels={top:'top stick',right:'right stick',bottom:'bottom stick'};
 const targets=[];for(const part of Object.keys(coords)){
  let [x1,y1,x2,y2]=coords[part];const rect={x:Math.min(x1,x2)-11,y:Math.min(y1,y2)-11,w:Math.abs(x2-x1)+22,h:Math.abs(y2-y1)+22};
  if(!placed[part]){
   N.neonPath(svg,`M${x1},${y1}L${x2},${y2}`,{role:'unknown',width:5,dash:'6 12'});
   const tg=E('rect',{x:rect.x,y:rect.y,width:rect.w,height:rect.h,rx:6,fill:'transparent','class':'f901-dropbtn','data-slot':part,tabindex:'0',role:'button','aria-label':'Place the '+labels[part]+' using keyboard'},svg);
   tg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setPiece(part,true);} });
   tg.addEventListener('click',()=>setPiece(part,true));
  }else{
    let g=E('g',{'data-placed':part,tabindex:0,role:'button','aria-label':labels[part]+'. Drag to red removal tray or press Delete to remove.'},svg);
    glyph(g,x1,y1,x2,y2,'result',sm?10:11);
    g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();setPiece(part,false);}});
    // Re-grab an already placed stick and drag it to the tray to remove.
    N.ui.svgDrag(svg,g,{box:rect,zones:()=>[{x:sm?22:170,y:sm?335:330,w:sm?390:420,h:87,id:'remove',kind:'remove'}],onDrop:()=>false,onRemove:()=>setPiece(part,false),removeTo:{x:W/2,y:390}});
  }
  targets.push({id:part,...rect});
 }
 const trayY=sm?335:330;box(svg,sm?22:170,trayY,sm?390:420,87,'error',null);
 txt(svg,W/2,trayY+20,'Drag sticks to gaps  ·  Red tray removes',sm?14:16,'support');
 const keys=Object.keys(coords);keys.forEach((part,index)=>{if(placed[part])return;
  const px=sm?80+index*131:250+index*135,py=trayY+54,vertical=part==='right';
  let g=E('g',{'class':'f901-tray-piece','data-tray':part,tabindex:0,role:'button','aria-label':'Drag '+labels[part]+' or press Enter to place it.'},svg);
  let x1=px-(vertical?0:30),x2=px+(vertical?0:30),y1=py-(vertical?28:0),y2=py+(vertical?28:0);
  glyph(g,x1,y1,x2,y2,'focus',sm?9:10);
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setPiece(part,true);}});
  N.ui.svgDrag(svg,g,{box:{x:px-34,y:py-31,w:68,h:62},zones:()=>targets.filter(z=>z.id===part&&!placed[part]).map(z=>({...z,kind:'drop'})),onDrop:()=>{requestAnimationFrame(()=>setPiece(part,true));return true;},onRemove:()=>{},removeTo:{x:W/2,y:390}});
 });
 txt(svg,W/2,sm?299:299,'10 built + '+Object.values(placed).filter(Boolean).length+' added',sm?26:29,'result');
 const side=H('aside',{class:'f901-side'});
 side.appendChild(sideCard('TARGET COUNT','13 sticks'));
 side.appendChild(sideCard('ADDED STICKS',Object.values(placed).filter(Boolean).length+' of 3','f901-card--gold'));
 side.appendChild(H('div',{class:'f901-card f901-card--full f901-predict'},[H('div',{class:'f901-eyebrow',text:'LOOK FOR THE SHARED SIDE'}),H('div',{class:'f901-body',text:'The shared side is already there. Add only the three missing sticks.'})]));
 const wrap=H('div',{class:'f901-stage'},[svg,side]);stage.appendChild(wrap);
 const evidence=H('div',{class:'f901-challenge-evidence'},[
    H('span',{text:'Stage one: 4'}),H('span',{text:'Stage two: 7'}),H('span',{text:'Stage three: 10'}),H('span',{class:'f901-next',text:'Stage four: ?'})]);stage.appendChild(evidence);
 N.scene.helperStrip(stage,'think','Add only what is missing. Do not build the shared side twice.');
 }
function setPiece(part,on){if(placed[part]===on)return;N.ui.cancelDrag();placed[part]=on;ev('stick',{part,placed:on});ev('placed',Object.values(placed).filter(Boolean).length);challengeDraw&&challengeDraw();}
let challengeDraw=null;
function showEquation(stage,n,hideValue=false){
 reset(stage);const W=isSmall()?430:760,svg=stateRoot('Connected square pattern at stage '+n+'. Three sticks are added for each new square.');
 const m=isSmall();txt(svg,W/2,52,'Count the pattern',m?26:28,'support');
 const squares=Math.min(n,6),s=Math.min(m?62:92,(W-60)/Math.max(4,squares)),x=W/2-squares*s/2,y=135;
 mainSticks(svg,x,y,s,squares,squares-1,9);if(n>squares){txt(svg,W/2,292,'The pattern carries on to stage '+n,20,'support');}
 txt(svg,W/2,345,hideValue?'3 × '+n+' + 1 = ?':String(answer(n))+' sticks',m?25:31,'result');
 N.svg.pill(svg,W/2,411,'3n + 1',{role:'focus',size:20});
 const side=H('aside',{class:'f901-side'},[sideCard('STAGE',String(n)),sideCard('GROWTH RULE','3n + 1','f901-card--gold')]);
 stage.appendChild(H('div',{class:'f901-stage'},[svg,side]));N.scene.helperStrip(stage,'point-right','Three for every square, then add the starting side.');
}
const def={id,title:'Matchstick pattern builder',config:C,
 alt:'One square needs four matchsticks; each new joined square shares a side and adds three. Stage n needs 3n+1.',
 staticAlt:'Stages 1, 2, 3, 4 use 4, 7, 10, 13 matchsticks; general rule 3n+1.',
 steps:speech.map((d,i)=>({name:d.name,narration:d.text,prompt:d.prompt,mood:i===5?'pleased':'focus'})),
 render(i,stage){active=Math.min(i,speech.length-1);renderLearning(active,stage);},
 exploreIntro:'Build and compare connected-square stages. Count each shared side only once.',
 explore(panel,stage,api){
  exploreStage=4;
  const start=H('p',{class:'f901-instruction',text:'Change the stage. Compare the number of sticks with the rule.'});
  const slide=H('input',{type:'range',min:'1',max:'7',value:'4','aria-label':'Pattern stage 1 to 7'}),out=H('output',{class:'f901-micro',text:'Stage 4'});
  function draw(){let n=exploreStage;renderLearning(5,stage,{exploreStage:n});out.textContent='Stage '+n+' · '+answer(n)+' sticks';ev('stage',n);ev('count',answer(n));}
  slide.addEventListener('input',()=>{exploreStage=Number(slide.value);draw();});
  panel.append(start,H('div',{class:'f901-control'},[H('label',{},['Stage ',slide]),out,hbtn('Next stage',()=>{slide.value=String(exploreStage===7?1:exploreStage+1);exploreStage=+slide.value;draw();})]));
  draw();
 },
 challenge(panel,api,stage){
   challengeIndex=0;placed={top:false,right:false,bottom:false};let tries=0;
   const header=H('h3',{class:'f901-taskhead'}),guide=H('p',{class:'f901-instruction'}),controls=H('div',{class:'f901-control'}),status=H('p',{class:'f901-status',role:'status'});
   // The existing NOVA helper dock is the ONE mascot for the component; never add a second portrait to the panel.
   function load(){controls.innerHTML='';api.fb.textContent='';api.fb.className='nova-fb';
     header.textContent=['01 · Complete stage four','02 · Work out stage five','03 · Use the nth term'][challengeIndex];
     guide.textContent=['Build the next joined square: drag three sticks onto the dashed gaps.','How many sticks will stage five need? Use the growing pattern.','The general rule is 3n + 1. How many sticks at stage seven?'][challengeIndex];
     if(challengeIndex===0){
       challengeDraw=()=>renderChallenge(stage);
       controls.append(H('p',{class:'f901-instruction',text:'Keyboard: select a dashed gap and press Enter. Delete on a placed stick removes it.'}));
       ['top','right','bottom'].forEach(q=>controls.appendChild(hbtn('Place '+q,()=>setPiece(q,true),'nova-btn ghost')));
       controls.append(hbtn('Reset sticks',()=>{placed={top:false,right:false,bottom:false};challengeDraw();},'nova-btn ghost'),
        hbtn('Check pattern',()=>{
          let k=Object.values(placed).filter(Boolean).length;
          if(k!==3){tries++;api.check(false,k===0?'The fourth square shares a side. Add the three missing sticks.':'Count the missing edges. You need all three, not '+k+'.',{task:challengeIndex});return;}
          succeed('You built thirteen sticks: ten already there, plus three new sticks.');},'nova-btn primary'));
       challengeDraw();
     }else{
       challengeDraw=null;let n=challengeIndex===1?5:7,target=answer(n),field=H('input',{type:'number',min:0,max:300,step:1,'aria-label':'Number of sticks in stage '+n,placeholder:'?'});
       controls.append(H('div',{class:'f901-workrow'},[H('label',{},['Sticks ',field]),hbtn('Check answer',()=>{
        let v=Number(field.value);if(field.value.trim()===''||!Number.isFinite(v)){api.check(false,'Enter a whole-number answer.',{task:challengeIndex});return;}
        if(v===target){succeed(challengeIndex===1?'Correct: thirteen plus three makes sixteen.':'Exactly: three times seven, plus one, equals twenty-two.');return;}
        tries++;api.check(false,v===(n*4)?'Each new square SHARES one side. Do not add four each time.':v===3*n?'You have the three sticks per square, but the first starting side is still needed.':'Use the pattern: each stage adds three sticks, then count the first side.',{task:challengeIndex});
       },'nova-btn primary'),hbtn('Hint',()=>api.hint(challengeIndex===1?'Stage four uses thirteen. Add three more.':'Multiply seven by three, then add one.'),'nova-btn ghost') ]));
       field.addEventListener('keydown',e=>{if(e.key==='Enter')controls.querySelector('.nova-btn.primary').click();});
       showEquation(stage,n,true);
     }
   }
   function succeed(message){ev('challengeTask',{index:challengeIndex,correct:true});api.check(true,message,{task:challengeIndex,score:challengeIndex+1});
     if(challengeIndex===2){header.textContent='All three challenges complete';guide.textContent='You built, counted and generalised the same growing pattern.';controls.replaceChildren(H('p',{class:'f901-maths f901-maths--gold',text:'3 / 3 · Pattern proven'}));N.moment&&N.moment(document.getElementById(id),'correct',{ms:1100});return;}
     const next=challengeIndex+1;controls.append(hbtn('Continue to challenge '+(next+1),()=>{challengeIndex=next;ev('challengeTask',{index:challengeIndex});load();},'nova-btn primary'));
   }
   panel.append(header,guide,controls,status);ev('challengeTask',{index:challengeIndex});load();
 },
 onRestore(){exploreStage=4;challengeIndex=0;placed={top:false,right:false,bottom:false};}
};
N.registry.add({id,title:'Matchstick pattern builder',topics:['sequences','visual patterns','term-to-term','nth term'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08']});
N.bankMount({id,num:'01',title:'Matchstick pattern builder · Premium Edition',def,linked:['F9-02','F9-03','F9-05','F9-12'],years:'Year 7 sequence structure, Year 8 generalisation, GCSE bridge',spec:{
 purpose:'Build joined-square matchstick structures, recognise the +3 term-to-term rule, and justify the nth term 3n+1.',
 params:'Stage 1–7; 4,7,10,13,…; common difference 3; shared-side patterns with a modelled starting edge.',
 presets:'Y7-036 Sequence rules and structure, growing connected squares.',
 steps:'First square → share a side → third square → compare +3 → fourth square → derive 3n+1.',
 interactions:'Watch, Guided, Explore slider, Challenge stick drag with snap/remove/re-grab/keyboard; count and nth-term entry.',
 traps:'Adding four each time, counting shared sides twice, using 3n without the extra side, confusing stage with total.',
 gcse:'Foundation for linear nth term, common difference and visual proof (F9-03, F9-05).'
}});
window.F901_ENGINE=N.engines[id];
// Keep developer-only metadata off the learning surface.
const card=document.getElementById(id),spec=H('details',{class:'nv-dev'},[H('summary',{text:'Developer: component specification'})]);
[...card.querySelectorAll('details.nova-spec, p.purpose')].forEach(x=>spec.appendChild(x));card.appendChild(spec);
const gc=card.querySelector('h3');if(gc)gc.textContent='Interactive maths workshop';
const patchBobAlt=()=>card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.setAttribute('alt','Sir Bob Maximus, maths tutor');});patchBobAlt();new MutationObserver(patchBobAlt).observe(card,{childList:true,subtree:true});
})();
