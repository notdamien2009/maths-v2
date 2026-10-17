/* NOVA F16-16 · Data-collection Designer · pinned original F0/F2 core unchanged. */
(function(){'use strict';
const H=NOVA.h,E=NOVA.svg.el,ID='F16-16',R=['given','focus','op','result'];
const CFG=window.NovaV2Integration.configuration(window.NOVA_F16_16_CONFIG={preset:'y7-065',events:['value','question','audience','recorded','removed','preset','step','correct','hintUsed','mode','reset'],presets:{
 'y7-065':{lesson:'Y7-065',label:'Y7-065 · Collect and organise',title:'Design a class survey',subtitle:'Which after-school activity is most popular?',groups:['Reading','Sport','Art','Music'],data:[1,0,3,1,2,1,0,3,2,1,3,1],question:['Which activity do you enjoy most after school?','Everyone loves sport. Is it your favourite?','Which sports and books do you like?'],audience:['Across the class','Only the sports club'],venue:'school classroom',totals:[2,5,2,3]},
 'y9-052':{lesson:'Y9-052',label:'Y9-052 · Sampling and bias',title:'Design a travel survey',subtitle:'How do pupils usually travel to school?',groups:['Walk','Bus','Cycle','Car'],data:[2,0,1,2,0,3,1,2,0,1,0,2],question:['How do you usually get to school?','Cycling is best. Do you agree?','How do you walk and cycle to school?'],audience:['Across the whole school','Only the cycle shelter'],venue:'school gates and classes',totals:[4,3,4,1]}
 }});
const STEPS=[
{name:'Start with a survey goal',pose:'explain',narration:'Before collecting any numbers, decide exactly what you want to find out.',prompt:'What is the question asking?'},
{name:'Write a neutral question',pose:'think',narration:'A neutral survey question must not push pupils toward one answer.',prompt:'Which wording avoids suggesting an answer?'},
{name:'Use one clear choice',pose:'show-one',narration:'These options do not overlap. Each pupil chooses one answer.',prompt:'Could somebody fit two categories at once?'},
{name:'Decide whom to ask',pose:'compare',narration:'The people we ask should represent the population that our conclusion is about.',prompt:'Who is missing if we ask only one club?'},
{name:'Collect an observation',pose:'count',narration:'Each response is recorded once in its own category.',prompt:'Which row should this observation enter?'},
{name:'Build groups of five',pose:'point-down',narration:'Tallies are grouped in fives. Four straight marks and a fifth diagonal mark make five.',prompt:'Why are groups of five helpful?'},
{name:'Finish the frequency table',pose:'count',narration:'Each frequency is the number of observations in that category.',prompt:'Do all frequencies add up to the sample size?'},
{name:'Check the total',pose:'magnify',narration:'The sum of every frequency must equal the number of responses collected.',prompt:'What happens if a response is counted twice?'},
{name:'Spot a leading question',pose:'not-yet',narration:'A leading question or an unsuitable audience can bias a survey, even when the table is counted correctly.',prompt:'Can correct arithmetic repair a biased sample?'},
{name:'Make a fair conclusion',pose:'celebrate',narration:'Report what the data actually says, alongside the survey question and how the pupils were selected.',prompt:'What evidence supports the claim?'}
];
const p=()=>CFG.presets[CFG.preset],counts=records=>{const n=[0,0,0,0];records.forEach((v,i)=>{if(v)n[p().data[i]]++});return n;},total=a=>a.reduce((x,y)=>x+y,0);
function emit(key,value){NOVA.events.emit('value',{engine:ID,key,value});}
function layout(){const mobile=innerWidth<=540;const W=mobile?480:800,H=mobile?1150:1195;return {mobile,W,H,header:mobile?126:129,question:mobile?{x:29,y:124,w:422,h:120}:{x:34,y:139,w:355,h:191},audience:mobile?{x:29,y:254,w:422,h:99}:{x:411,y:139,w:355,h:191},table:mobile?{x:29,y:366,w:422,h:317}:{x:34,y:368,w:443,h:441},tray:mobile?{x:29,y:697,w:422,h:170}:{x:501,y:368,w:265,h:441},remove:mobile?{x:317,y:879,w:133,h:49}:{x:637,y:819,w:129,h:66},preview:mobile?{x:29,y:941,w:422,h:177}:{x:34,y:908,w:732,h:238}};}
const say=(svg,x,y,str,role='given',size=28,anchor='middle')=>NOVA.chalkText(svg,x,y,String(str),{role,size,anchor});
const box=(svg,x,y,w,h,role='given',rad=13)=>NOVA.neonBox(svg,x,y,w,h,{role,r:rad});
const line=(svg,x,y,X,Y,role='given',w=3)=>NOVA.neonLine(svg,x,y,X,Y,{role,width:w});
function short(s,max){const out=[''];for(const word of String(s).split(/\s+/)){const j=out.length-1,combined=(out[j]+' '+word).trim();if(combined.length>max)out.push(word);else out[j]=combined;}return out;}
function badgeText(svg,x,y,str,role='given',size=23){say(svg,x,y,str,role,size,'start');}
function drawResponseTag(svg,x,y,id,group,interactive,onUpdate,removal,l,w,h){const g=E('g',{},svg);g.dataset.cardId=String(id);g.setAttribute('role','button');g.setAttribute('tabindex',interactive?'0':'-1');g.setAttribute('aria-label',`${p().groups[group]} response number ${id+1}. Drag onto the matching frequency row, or press Space to record it.`);
 box(g,x,y,w,h,R[group],9);say(g,x+w/2,y+Math.round(h*.67),p().groups[group],R[group],l.mobile?21:20);
 if(interactive){g.addEventListener('keydown',ev=>{if(ev.key===' '||ev.key==='Enter'){ev.preventDefault();onUpdate('record',id,group)}});NOVA.ui.svgDrag(svg,g,{box:{x,y,w,h},zones:()=>[...l.rows.map((v,i)=>({id:'row'+i,kind:'drop',...v})),{id:'remove',kind:'remove',...removal}],onDrop:dest=>{if(!dest?.startsWith('row'))return false;return onUpdate('record',id,Number(dest.slice(3)))},onRemove:()=>false});g.addEventListener('pointerdown',ev=>{try{g.setPointerCapture(ev.pointerId)}catch(_){};});}return g;}
function stageScene(stage,{records=Array(12).fill(false),question=0,audience=0,phase=9,interactive=false,challenge=false,speech='',pose='count',onUpdate=()=>false}={}){
window.NovaLessonComponent?.applyModels();

 stage.innerHTML='';let l=layout(),q=p(),svg=NOVA.svg.root(l.W,l.H,'A working survey designer: editable question and audience, response cards, true tally groups of five, frequency table and a live chart.');svg.classList.add('f1616-svg');svg.setAttribute('role','img');
 say(svg,l.W/2,53,q.title,'focus',l.mobile?34:43);say(svg,l.W/2,97,q.subtitle,'support',l.mobile?23:29);
 // Question design: correct/leading/double-barrelled are genuinely different.
 const Q=l.question;box(svg,Q.x,Q.y,Q.w,Q.h,question===0?'focus':'op',16);
 badgeText(svg,Q.x+19,Q.y+32,'Survey question', 'focus',l.mobile?25:27);
 short(q.question[question],l.mobile?28:23).slice(0,3).forEach((t,i)=>say(svg,Q.x+Q.w/2,Q.y+(l.mobile?68:81)+i*(l.mobile?26:33),t,question===0?'given':'op',l.mobile?24:26));
 const A=l.audience;box(svg,A.x,A.y,A.w,A.h,audience===0?'result':'op',16);
 badgeText(svg,A.x+19,A.y+36,'Who will be asked?', 'focus',l.mobile?24:28);
 short(q.audience[audience],30).forEach((t,i)=>say(svg,A.x+A.w/2,A.y+(l.mobile?79:94)+i*(l.mobile?25:32),t,audience===0?'result':'op',l.mobile?24:27));
 if(!l.mobile){say(svg,A.x+A.w/2,A.y+156,audience===0?'Broader coverage':'Selection bias risk',audience===0?'result':'op',23);}
 // Frequency ledger: table geometry shares positions with drag targets.
 const T=l.table;box(svg,T.x,T.y,T.w,T.h,'given',17);
 const colLabel=T.x+(l.mobile?19:21),tallyStart=T.x+(l.mobile?160:175),freqX=T.x+T.w-(l.mobile?34:45);
 badgeText(svg,colLabel,T.y+40,'Data collection sheet','focus',l.mobile?26:29);
 const headY=T.y+84;badgeText(svg,colLabel,headY,'Answer','given',l.mobile?23:24);say(svg,tallyStart+77,headY,'Tally','given',l.mobile?24:26);say(svg,freqX,headY,'Freq','given',l.mobile?23:26);
 line(svg,T.x+18,T.y+100,T.x+T.w-18,T.y+100,'given',2.5);
 const C=counts(records),rows=[]; const rowH=l.mobile?42:71,first=T.y+(l.mobile?106:111);
 for(let i=0;i<4;i++){
 const y=first+i*rowH,x=T.x+11,w=T.w-22,h=rowH-3;rows.push({x,y,w,h});
 box(svg,x,y,w,h,R[i],10);badgeText(svg,colLabel,y+rowH*.63,q.groups[i],R[i],l.mobile?24:26);
 const placed=records.map((v,id)=>v&&q.data[id]===i?id:null).filter(v=>v!==null);
 // Conventional tally grouping; the fifth diagonal stroke has a clear hit area.
 placed.forEach((id,k)=>{
  const grp=Math.floor(k/5),at=k%5,bx=tallyStart+grp*(l.mobile?121:131)+at*(l.mobile?20:22),ty=y+14,hy=rowH-26;
  let xx=bx;if(at===4)xx=bx-80;
  const g=E('g',{},svg);g.dataset.placedId=String(id);g.setAttribute('role','button');g.setAttribute('tabindex',interactive?'0':'-1');g.setAttribute('aria-label',`Recorded ${q.groups[i]} response ${id+1}. Press Space to remove it or drag to red Remove.`);
  if(at===4){line(g,xx-7,ty+hy,xx+78,ty,R[i],3.5);}
  else line(g,xx,ty,xx,ty+hy,R[i],4);
  const hit=E('rect',{x:at===4?xx-8:xx-8,y:ty-8,width:at===4?95:18,height:hy+16,fill:'transparent',opacity:'0',style:'pointer-events:all'},g);
  if(interactive){g.addEventListener('keydown',ev=>{if(ev.key===' '||ev.key==='Enter'){ev.preventDefault();onUpdate('remove',id)}});NOVA.ui.svgDrag(svg,g,{box:{x:at===4?xx-8:xx-9,y:ty-7,w:at===4?94:18,h:hy+14},zones:()=>[{id:'remove',kind:'remove',...l.remove}],onDrop:()=>false,onRemove:()=>onUpdate('remove',id)});g.addEventListener('pointerdown',ev=>{try{g.setPointerCapture(ev.pointerId)}catch(_){}})}
 });
 say(svg,freqX,y+rowH*.67,C[i],R[i],l.mobile?28:30);
 }
 l.rows=rows;
 const footY=first+4*rowH+(l.mobile?38:40);
 say(svg,T.x+T.w/2,Math.min(T.y+T.h-(l.mobile?7:15),footY),`Total ${total(C)} of ${q.data.length}`,'result',l.mobile?25:29);
 // Response source cards stay individual observations, not prefilled totals.
 const P=l.tray;box(svg,P.x,P.y,P.w,P.h,'given',17);
 badgeText(svg,P.x+15,P.y+37,'Response cards','focus',l.mobile?26:28);
 const cols=l.mobile?4:3,cardGap=l.mobile?7:6,cardW=l.mobile?94:74,cardH=l.mobile?38:54,startX=P.x+(l.mobile?13:14),startY=P.y+(l.mobile?48:58);
 const rem=l.remove;
 q.data.forEach((cat,id)=>{const ci=id%cols,ri=Math.floor(id/cols),x=startX+ci*(cardW+cardGap),y=startY+ri*(cardH+(l.mobile?3:4));if(!records[id])drawResponseTag(svg,x,y,id,cat,interactive,onUpdate,rem,l,cardW,cardH);else {box(svg,x,y,cardW,cardH,'given',8);say(svg,x+cardW/2,y+36,'✓','result',l.mobile?25:25);}});
 box(svg,rem.x,rem.y,rem.w,rem.h,'op',14);say(svg,rem.x+rem.w/2,rem.y+(l.mobile?33:44),'Remove','op',l.mobile?25:27);
 if(l.mobile)say(svg,P.x+138,908,'Re-grab a tally to remove','support',21);
 else say(svg,P.x+P.w/2,P.y+P.h-17,'Drag each answer into its row','support',21);
 // An interpretive, not decorative, summary.
 const S=l.preview;box(svg,S.x,S.y,S.w,S.h,'focus',17);badgeText(svg,S.x+18,S.y+(l.mobile?32:37),'Live survey results','focus',l.mobile?25:29);
 const max=Math.max(1,...C),plotLeft=S.x+(l.mobile?86:126),plotWidth=S.w-(l.mobile?147:236),rY=S.y+(l.mobile?56:71),step=l.mobile?24:35;
 q.groups.forEach((name,i)=>{const y=rY+i*step;badgeText(svg,S.x+17,y+9,name,R[i],l.mobile?22:24);const w=Math.max(2,plotWidth*C[i]/Math.max(6,max));box(svg,plotLeft,y-8,plotWidth,17,'given',7);if(C[i])box(svg,plotLeft,y-8,w,17,R[i],7);say(svg,plotLeft+plotWidth+(l.mobile?17:35),y+9,C[i],'given',l.mobile?23:25);});
 const note=question!==0?'Question wording may bias answers.':audience!==0?'The selected audience may exclude pupils.':total(C)<q.data.length?'Survey still in progress.':'Counts checked. Interpret only the sample.';
 say(svg,S.x+S.w/2,S.y+S.h-(l.mobile?10:19),note,question!==0||audience!==0?'op':'result',l.mobile?20:24);
 stage.append(svg);
 let tiles=H('div',{class:'f1616-readouts'});tiles.append(NOVA.neonTile(`${total(C)} / 12 counted`,{role:'result'}),NOVA.neonTile(question===0?'Neutral wording':'Question bias risk',{role:question===0?'focus':'op'}),NOVA.neonTile(audience===0?'Audience coverage':'Selection bias risk',{role:audience===0?'result':'op'}));stage.append(tiles);
 NOVA.scene.helperStrip(stage,pose,speech||'Design a fair question, choose an audience and record each response once.');return svg;
}
const byStep=i=>Math.min(12,Math.max(0,i===0||i===1||i===2||i===3?0:i===4?1:i===5?5:i===6?10:12));
function watch(i,stage){const q=p(),records=q.data.map((_,id)=>id<byStep(i)),question=i===8?1:0,audience=i===8?1:0;stageScene(stage,{records,question,audience,phase:i,pose:STEPS[i].pose,speech:STEPS[i].narration});}
function selection(label,opts){const s=H('select',{class:'nova-input','aria-label':label});for(const [value,text] of opts)s.append(H('option',{value,text}));return s;}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();let records=Array(p().data.length).fill(false),question=0,audience=0;window.NovaLessonComponent?.applyExploreModels();const lesson=selection('Lesson preset',Object.entries(CFG.presets).map(([k,v])=>[k,v.label])),questionSel=selection('Question wording',p().question.map((v,i)=>[String(i),v])),audienceSel=selection('Audience selection',p().audience.map((v,i)=>[String(i),v]));window.NovaLessonComponent?.applyExploreModels();lesson.value=CFG.preset;
 window.NovaLessonComponent?.applyExploreModels();const reset=H('button',{class:'nova-btn ghost',text:'Clear responses'}),demo=H('button',{class:'nova-btn',text:'Record all 12'}),status=H('p',{class:'f1616-status',role:'status'});
 window.NovaLessonComponent?.applyExploreModels();function render(){let speech=question!==0?'That wording risks steering the answers. How could you ask neutrally?':audience!==0?'People outside that location may never be asked.':total(counts(records))===12?'All twelve answers are recorded. Check the frequencies total twelve.':'Place every response in the correct row. Each is counted once.';stageScene(stage,{records,question,audience,interactive:true,pose:question||audience?'think':'count',speech,onUpdate:modify});const C=counts(records);status.textContent=`${total(C)} / 12 recorded · ${p().groups.map((g,i)=>g+': '+C[i]).join(' · ')}`;}
 window.NovaLessonComponent?.applyExploreModels();function modify(type,id,row){if(type==='record'){if(records[id])return false;if(row!==p().data[id]){status.textContent=`Not yet. That response belongs in ${p().groups[p().data[id]]}, not ${p().groups[row]}.`;emit('hintUsed',{id,wrongRow:row});return false;}records[id]=true;emit('recorded',{id,row,count:total(counts(records))});render();return true;}if(type==='remove'){if(!records[id])return false;records[id]=false;emit('removed',{id,count:total(counts(records))});render();return true;}return false;}
 window.NovaLessonComponent?.applyExploreModels();lesson.onchange=()=>{CFG.preset=lesson.value;question=0;audience=0;records=Array(p().data.length).fill(false);questionSel.replaceChildren(...p().question.map((x,i)=>H('option',{value:String(i),text:x})));audienceSel.replaceChildren(...p().audience.map((x,i)=>H('option',{value:String(i),text:x})));questionSel.value='0';audienceSel.value='0';emit('preset',CFG.preset);render();};
 window.NovaLessonComponent?.applyExploreModels();questionSel.onchange=()=>{question=Number(questionSel.value);emit('question',question);render();};window.NovaLessonComponent?.applyExploreModels();audienceSel.onchange=()=>{audience=Number(audienceSel.value);emit('audience',audience);render();};
 window.NovaLessonComponent?.applyExploreModels();demo.onclick=()=>{records.fill(true);emit('recorded',{all:true});render();};window.NovaLessonComponent?.applyExploreModels();reset.onclick=()=>{records.fill(false);emit('reset',true);render();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(H('p',{class:'f1616-help',text:'Choose the wording and audience. The response cards are a fixed example dataset; changing the survey design does not change existing answers. Drag each answer into its row. Re-grab a tally to remove it. Keyboard: press Space to record or remove a focused card.'}),H('div',{class:'f1616-controls'},[H('label',{},['Lesson',lesson]),H('label',{},['Question wording',questionSel]),H('label',{},['Audience',audienceSel]),demo,reset]),status);
 window.NovaLessonComponent?.applyExploreModels();render();window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({preset:CFG.preset,records:[...records],counts:counts(records),question,audience,total:total(counts(records))}),record:id=>modify('record',id,p().data[id]),wrong:(id,row)=>modify('record',id,row),remove:id=>modify('remove',id),setQuestion:v=>{questionSel.value=String(v);questionSel.onchange()},setAudience:v=>{audienceSel.value=String(v);audienceSel.onchange()},setLesson:id=>{lesson.value=id;lesson.onchange()},clear:()=>reset.click()};
}
function challenge(panel,api,stage){let records=Array(p().data.length).fill(false),question=1,audience=1,task=0;const q=p();
 function modify(type,id,row){if(task!==0)return false;if(type==='record'){if(records[id]||row!==q.data[id])return false;records[id]=true;emit('recorded',{challenge:true,id,row});render();return true;}if(type==='remove'&&records[id]){records[id]=false;emit('removed',{challenge:true,id});render();return true;}return false;}
 function render(){stageScene(stage,{records:task===0?records:Array(12).fill(true),question:task===0?0:question,audience:task===2?audience:0,interactive:task===0,pose:task===0?'count':task===1?'compare':'think',speech:task===0?'Record each observation in its correct category. Every response counts once.':task===1?'A trustworthy survey question must be neutral and single-purpose.':'A convenient audience can make the results biased, even when all calculations are right.',onUpdate:modify});}
 const tasks=[
 {q:'Collect all twelve observations in the correct rows. What does the total frequency need to equal?',build:ctl=>{ctl.append(H('p',{class:'f1616-help',text:'Drag or use Space to record the twelve response cards shown in the stage.'}));return ()=>({total:total(counts(records)),counts:counts(records)});},check:v=>{if(v.total===12&&v.counts.every((x,i)=>x===q.data.filter(z=>z===i).length))return [true,'Correct: one tally per response and the frequencies sum to twelve.'];return [false,`You have ${v.total} correct records. Every response belongs in exactly one category and the total must equal twelve.`];},hint:'Count each answer once in its own category. Add all four frequencies.',solve:()=>{}},
 {q:'Choose the survey question that avoids leading and double-barrelled wording.',build:ctl=>{let s=selection('Select question',q.question.map((v,i)=>[String(i),v]));s.value='';s.prepend(H('option',{value:'',text:'Choose your question…'}));s.dataset.questionChoice='1';ctl.append(H('label',{class:'f1616-choice'},['Survey question',s]));return ()=>s.value;},check:v=>[v==='0',v==='1'?'That wording suggests which answer to give. Keep it neutral.':v==='2'?'That question combines ideas that may need different answers.':'Correct. This wording is neutral and asks one thing.'],hint:'One clear idea, with no preferred answer.',solve:()=>{}},
 {q:'Which audience gives the fairest basis for a school-wide conclusion?',build:ctl=>{let s=selection('Survey audience',[["",'Choose an audience…'],['0',q.audience[0]],['1',q.audience[1]]]);s.dataset.audienceChoice='1';ctl.append(H('label',{class:'f1616-choice'},['Survey audience',s]));return ()=>s.value;},check:v=>[v==='0',v==='1'?'That location systematically excludes pupils who do not go there.':'Correct. A broader, planned sample avoids that convenient subgroup.'],hint:'Whom might you miss if you only ask pupils in one place?',solve:()=>{}}
 ];panel.append(H('p',{class:'f1616-help',text:'This assessment checks data accuracy, question wording and sampling bias separately. A perfectly counted table does not remove bias.'}));NOVA.challengeRun(panel,api,tasks,k=>{task=k;render();},CFG);render();CFG._challengeState=()=>({preset:CFG.preset,task,records:[...records],counts:counts(records),question,audience});}
const DEF={id:ID,title:'Data-Collection Designer',config:CFG,steps:STEPS,render:watch,alt:'Survey design cards, respondent audience, movable response cards, tally marks grouped by five and a live frequency table.',staticAlt:'A valid survey has neutral wording, a suitable audience and one correct tally per response. Data collection and sample bias must be evaluated separately.',exploreIntro:'Choose a question and an audience. File individual answer cards into an interactive tally sheet.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"R":()=>R,"STEPS":()=>STEPS},draws:{},exploreFields:{}});
NOVA.bankMount({id:ID,num:'F16·16',title:'Data-Collection Designer',def:DEF,years:'Years 7 and 9 KS3 · GCSE survey-bias extension',linked:['F0-02','F0-04','F16-01','F16-15'],spec:{purpose:'Design clear survey questions, choose an appropriate population and collect categorical responses accurately.',params:'Two lesson presets, four non-overlapping categories, twelve observed responses, three question styles and two audience choices.',presets:'Y7-065 collecting and organising data; Y9-052 sampling and bias.',steps:'Survey goal → neutral wording → categories → target audience → observations → tally groups of five → frequency totals → total check → wording bias → cautious conclusion.',interactions:'Native NOVA drag of response cards to correct tally row; reject invalid destinations; re-grab recorded tallies and remove; keyboard equivalents; wording and audience selectors.',traps:'Leading questions, double-barrelled questions, convenience samples, responses recorded twice, wrong tally row or incorrect total.',gcse:'Sampling frame, construct validity and bias in inference.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,3500)};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog').onclick=()=>log.textContent='';}
})();
