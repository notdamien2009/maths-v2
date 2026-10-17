/* NOVA MATHS V2 — F17-09 FREQUENCY TREE. The NOVA core remains embedded and unchanged. */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const DATA={
  y7table:{label:'Y7-077 · Journeys to school',year:7,a:'Bus',na:'Walk',b:'On time',nb:'Late',context:'40 journeys · Bus / Walk · On time / Late',counts:[16,6,14,4],focus:'late'},
  y8table:{label:'Y8-067 · Activity survey',year:8,a:'Indoor',na:'Outdoor',b:'Team',nb:'Solo',context:'48 pupils · Indoor / Outdoor · Team / Solo',counts:[18,9,8,13],focus:'team'},
  y8tree:{label:'Y8-068 · School lunches',year:8,a:'Hot',na:'Cold',b:'Vegetarian',nb:'Other',context:'60 lunches · Hot / Cold · Vegetarian / Other',counts:[12,24,18,6],focus:'vegetarian'},
  y8venn:{label:'Y8-072 · Set membership',year:8,a:'Set A',na:'Not A',b:'Set B',nb:'Not B',context:'50 outcomes · A / Not A · B / Not B',counts:[8,12,9,21],focus:'union'},
  y9sets:{label:'Y9-044 · Sets and events',year:9,a:'A',na:'Not A',b:'B',nb:'Not B',context:'80 outcomes · A / Not A · B / Not B',counts:[20,26,14,20],focus:'union'}
};
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_09_CONFIG={preset:'y8tree',startMode:'watch',events:['value','correct','step','hintUsed','mode'],valueKeys:['preset','count','cell','placed','total','favourable','probability','event','reset','complete'],presets:DATA});
const mob=()=>innerWidth<=500,clamp=(v,l,u)=>Math.min(u,Math.max(l,v));
const fractions=(n,d)=>{function gcd(a,b){return b?gcd(b,a%b):a;}let g=gcd(n,d)||1;return [n/g,d/g];};
const fracWord=(v)=>v[0]+' over '+v[1];
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('Unregistered value event '+key);NOVA.events.emit('value',{engine:'F17-09',key,value});};
const sum=v=>v.reduce((a,b)=>a+b,0);
const model=arr=>({total:sum(arr),first:arr[0]+arr[1],second:arr[2]+arr[3],b:arr[0]+arr[2],notB:arr[1]+arr[3],inter:arr[0],union:sum(arr)-arr[3],neither:arr[3]});
const fav=(v,q)=>q==='first'?v[0]+v[1]:q==='second'?v[2]+v[3]:q==='team'||q==='vegetarian'||q==='b'?v[0]+v[2]:q==='late'||q==='notb'?v[1]+v[3]:q==='intersection'?v[0]:q==='union'?sum(v)-v[3]:q==='neither'?v[3]:v[0];
const qs={first:'First category',second:'Second category',team:'Team',vegetarian:'Vegetarian',b:'B',late:'Late',notb:'Not B',intersection:'A and B',union:'A or B',neither:'Neither A nor B'};
const newState=()=>({assign:new Map(),counts:null,focus:DATA[CFG.preset].focus,selected:0,checked:false});
const exact=(p,m)=>m.counts||p.counts;
const tally=(p,m)=>{let a=exact(p,m),t=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("tally.t",(...a)=>model(...a),[a]):(model(a))),good=0;for(let [item,target] of m.assign){if(a[+item]===a[+target])good++;}return {...t,correct:good,placed:m.assign.size,complete:good===4&&m.assign.size===4,prob:fractions(fav(a,m.focus),t.total)};};
const ctext=(g,x,y,t,role='op',size=21,anchor='middle')=>NOVA.chalkText(g,x,y,String(t),{role,size,anchor});
function fracHtml(r){let e=h('span',{class:'f179-frac','aria-label':fracWord(r)});e.append(h('b',{text:String(r[0])}),h('i',{'aria-hidden':'true'}),h('b',{text:String(r[1])}));return e;}
function badge(n,v,role='given',isFrac=false){let el=h('div',{class:'f179-stat','data-role':role});el.append(h('span',{class:'f179-caption',text:n}),isFrac?fracHtml(v):h('span',{class:'f179-value',text:String(v)}));return el;}
function L(){return mob()?{
 W:440,H:1060,root:{x:16,y:399,w:103,h:94},mids:[{x:146,y:222,w:95,h:85},{x:146,y:602,w:95,h:85}],leaves:[{x:283,y:100,w:141,h:102},{x:283,y:310,w:141,h:102},{x:283,y:514,w:141,h:102},{x:283,y:728,w:141,h:102}],tray:[{x:59,y:902},{x:166,y:902},{x:274,y:902},{x:381,y:902}],remove:{x:272,y:968,w:149,h:60},reset:{x:21,y:968,w:205,h:60},labelSize:21
 }:{W:960,H:1020,root:{x:39,y:398,w:151,h:99},mids:[{x:322,y:218,w:158,h:98},{x:322,y:612,w:158,h:98}],leaves:[{x:675,y:100,w:227,h:105},{x:675,y:312,w:227,h:105},{x:675,y:519,w:227,h:105},{x:675,y:729,w:227,h:105}],tray:[{x:173,y:903},{x:372,y:903},{x:571,y:903},{x:770,y:903}],remove:{x:700,y:953,w:199,h:54},reset:{x:58,y:953,w:229,h:54},labelSize:25};}
const center=r=>({x:r.x+r.w/2,y:r.y+r.h/2});
function plotLine(svg,a,b,role){NOVA.neonLine(svg,a.x,a.y,b.x,b.y,{role,width:4.8});}
function rectLabel(svg,r,caption,value,role,size,sub){NOVA.neonBox(svg,r.x,r.y,r.w,r.h,{role,r:17});let c=center(r);ctext(svg,c.x,r.y+30,caption,role,Math.min(size,caption.length>11?19:size)); if(value!==null&&value!==undefined){ctext(svg,c.x,r.y+70,value,'result',Math.max(24,size+3));}else if(sub){ctext(svg,c.x,r.y+73,sub,'given',size);}}
function itemPos(l,idx,slot){if(slot!==undefined&&slot!==null){let r=l.leaves[slot],c=center(r);return {x:c.x,y:r.y+75};}return l.tray[idx];}
function render(stage,p,m,opt={}){
if(window.NovaLessonComponent?.active){[stage,p,m,opt]=window.NovaLessonComponent.args("render",arguments);}

 stage.replaceChildren();let A=exact(p,m),T=tally(p,m),l=L(),sm=mob(),step=opt.step??5;
 NOVA.cap(stage,opt.title||'Frequency trees · follow the totals',opt.tag||'COUNTS · BRANCHES · CONDITIONAL GROUPS');
 let svg=S.root(l.W,l.H,'Two-stage neon frequency tree: one total, two first groups, four terminal groups; place the numeric count tiles on the correct endpoints.');svg.classList.add('f179-plot');svg.setAttribute('data-engine-plot','F17-09');
 ctext(svg,l.W/2,39,p.context,'focus',sm?19:24);
 ctext(svg,l.W/2,79,opt.challenge?'Use the branch counts to answer.':'Every split must add back to its parent total.','given',sm?19:22);
 const rC=center(l.root),mC=l.mids.map(center),leafC=l.leaves.map(center);
 if(step>=1)for(let j=0;j<2;j++)plotLine(svg,{x:l.root.x+l.root.w,y:rC.y},{x:l.mids[j].x,y:mC[j].y},j?'op':'focus');
 if(step>=2)for(let j=0;j<2;j++){for(let k=0;k<2;k++){if(step===2&&j!==0)continue;plotLine(svg,{x:l.mids[j].x+l.mids[j].w,y:mC[j].y},{x:l.leaves[2*j+k].x,y:leafC[2*j+k].y},k?'op':'focus');}}
 rectLabel(svg,l.root,'TOTAL',T.total,'given',sm?21:25);
 if(step>=1)for(let j=0;j<2;j++)rectLabel(svg,l.mids[j],j?p.na:p.a,j?T.second:T.first,j?'op':'focus',sm?20:25);
 const labels=[p.b,p.nb,p.b,p.nb];
 const zones=l.leaves.map((r,j)=>({id:'leaf'+j,kind:'drop',x:r.x,y:r.y,w:r.w,h:r.h}));zones.push({...l.remove,id:'remove',kind:'remove'});
 for(let j=0;j<4;j++){
  if(step<2||(step===2&&j>=2))continue;
  let r=l.leaves[j],point=center(r),occupant=[...m.assign].find(([,where])=>where===j),placed=occupant!==undefined;
  rectLabel(svg,r,labels[j],undefined,j%2?'op':'focus',sm?22:25,opt.challenge?'':'');
  // On a worked example all values can be visible; in Explore only validly placed tiles display inside the card.
  if(!opt.interact){let visible=step>=3||(step===2&&j<2);ctext(svg,point.x,r.y+80,visible?A[j]:'?',visible?'result':'given',sm?26:29);}else if(!placed){ctext(svg,point.x,r.y+82,'?', 'given',sm?24:27);}
 }
 if(opt.interact){
  for(let idx=0;idx<4;idx++){
   let where=m.assign.get(idx),pt=itemPos(l,idx,where),win=where===idx||A[where]===A[idx],sw=sm?71:107,sh=sm?57:62;
   let g=E('g',{'data-frequency-item':String(idx),role:'button',tabindex:m.selected===idx?0:-1,'aria-label':'Count tile '+A[idx]+(where===undefined?', in tray':', placed at branch '+(where+1))},svg);
   NOVA.neonBox(g,pt.x-sw/2,pt.y-sh/2,sw,sh,{role:where===undefined?'focus':m.checked?(win?'result':'error'):'op',r:14});
   ctext(g,pt.x,pt.y+9,A[idx],where===undefined?'focus':'result',sm?27:30);
   NOVA.ui.svgDrag(svg,g,{box:{x:pt.x-sw/2,y:pt.y-sh/2,w:sw,h:sh},zones:()=>zones,removeTo:{x:l.remove.x+l.remove.w/2,y:l.remove.y+l.remove.h/2},onDrop:id=>{
     if(!/^leaf[0-3]$/.test(id))return false;let j=+id.slice(4);for(let [other,otherPlace] of m.assign){if(other!==idx&&otherPlace===j)m.assign.delete(other);}m.assign.set(idx,j);m.selected=idx;m.checked=false;emit('cell',j);emit('count',A[idx]);opt.changed();return true;
   },onRemove:()=>{m.assign.delete(idx);m.checked=false;emit('cell','tray');opt.changed();}});
   g.addEventListener('keydown',e=>{if(['Delete','Backspace'].includes(e.key)){e.preventDefault();m.assign.delete(idx);opt.changed();return;}let d={ArrowRight:1,ArrowLeft:-1,ArrowDown:2,ArrowUp:-2}[e.key];if(d){e.preventDefault();let next=clamp(idx+d,0,3);m.selected=next;g.tabIndex=-1;let target=svg.querySelector('[data-frequency-item="'+next+'"]');if(target){target.tabIndex=0;target.focus();}}});
  }
  NOVA.neonBox(svg,l.reset.x,l.reset.y,l.reset.w,l.reset.h,{role:'focus',r:15,text:'COUNT TILES',size:sm?19:22});
  NOVA.neonBox(svg,l.remove.x,l.remove.y,l.remove.w,l.remove.h,{role:'error',r:15,text:'REMOVE',size:sm?20:23});
 }else{
  NOVA.neonBox(svg,l.reset.x,l.reset.y,l.reset.w,l.reset.h,{role:'focus',r:15,text:'ADD BRANCH COUNTS',size:sm?18:21});
  NOVA.neonBox(svg,l.remove.x,l.remove.y,l.remove.w,l.remove.h,{role:'result',r:15,text:'TOTALS MATCH',size:sm?18:21});
 }
 ctext(svg,l.W/2,866,sm?'DRAG THE COUNTS INTO ENDPOINTS':'FOUR ENDPOINT COUNTS · PARENT TOTALS ADD UP','given',sm?19:22);
 stage.append(svg);
 let read=h('div',{class:'f179-readouts'});
 read.append(badge('TOTAL',T.total),badge('PLACED',opt.interact?T.placed:step>=3?4:0,'focus'),opt.challenge?badge('EVENT CHANCE','?','result'):badge('P('+ (qs[m.focus]||m.focus) +')',T.prob,'result',true));
 stage.append(read);
 NOVA.scene.helperStrip(stage,opt.pose||'explain',opt.say||'Begin with the total. The two first groups add to it, and the final four counts add to those groups.');
 if(opt.flash)M.flash(svg,mob()?220:480,sm?440:475,'result',95);
 return {svg,layout:l,totals:T};
}
const steps=[
 {name:'Start with the full group',pose:'explain',narration:'We start with the total frequency. Every person or outcome in the study is counted exactly once.',prompt:'What does the total tell us?'},
 {name:'Divide into two groups',pose:'point-down',narration:'Split the total into two first groups. Their frequencies must add up to the starting total.',prompt:'Do the two branch totals match the whole?'},
 {name:'Follow the first branch',pose:'count',narration:'From the first group, split into the two outcomes of the second category. Those endpoint counts must add to that group.',prompt:'How many are in the first pair of endpoints?'},
 {name:'Complete the second branch',pose:'compare',narration:'Now make the same second split for the other group. All four endpoints together must add to the original total.',prompt:'Have we missed or double-counted anyone?'},
 {name:'Gather favourable frequencies',pose:'think',narration:'To find an event, combine the endpoint counts that match it. Some events cross both first branches.',prompt:'Which endpoints count towards our event?'},
 {name:'Find the exact probability',pose:'celebrate',narration:'The probability is the favourable frequency divided by the total number. Do not divide by one subgroup unless a conditional probability is asked.',prompt:'Why is the denominator the whole population here?'}
];
function renderStep(i,stage){let p=DATA[CFG.preset],m=newState(),k=clamp(i,0,5);render(stage,p,m,{title:steps[k].name,tag:'STEP '+(k+1)+'/6',step:k,flash:k===5,pose:steps[k].pose,say:[
 'The root is our whole data set. Nothing has been divided yet.',
 'The first two numbers are subgroups of one total. Check their sum.',
 'Follow the first group to its two endpoints. Each is a frequency, not a probability.',
 'Now every endpoint is accounted for. Each pair matches its parent total.',
 'Pick the endpoints matching the event. Sum favourable counts, not branch labels.',
 'Divide the favourable total by the original total. The counts remain consistent.'
 ][k]});}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(DATA[CFG.preset])):(DATA[CFG.preset])),m=newState(),status=h('p',{class:'f179-status',role:'status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();const sel=h('select',{class:'nova-input','aria-label':'Lesson preset'});window.NovaLessonComponent?.applyExploreModels();Object.entries(DATA).forEach(([id,d])=>sel.append(h('option',{value:id,text:d.label})));
 window.NovaLessonComponent?.applyExploreModels();const evt=h('select',{class:'nova-input','aria-label':'Probability event'});window.NovaLessonComponent?.applyExploreModels();Object.entries(qs).forEach(([k,v])=>evt.append(h('option',{value:k,text:v})));
 window.NovaLessonComponent?.applyExploreModels();const tile=h('select',{class:'nova-input','aria-label':'Select count tile'}),leaf=h('select',{class:'nova-input','aria-label':'Select tree endpoint'});
 window.NovaLessonComponent?.applyExploreModels();[0,1,2,3].forEach(j=>{tile.append(h('option',{value:String(j),text:'Tile '+(j+1)}));leaf.append(h('option',{value:String(j),text:'Endpoint '+(j+1)}));});
 window.NovaLessonComponent?.applyExploreModels();const button=(txt,fn)=>h('button',{class:'nova-btn',text:txt,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function report(){let t=tally(p,m),bad=[...m.assign].find(([a,b])=>exact(p,m)[a]!==exact(p,m)[b]),missing=[0,1,2,3].find(j=>![...m.assign.values()].includes(j));emit('placed',t.placed);emit('total',t.total);emit('favourable',fav(exact(p,m),m.focus));emit('probability',t.prob[0]/t.prob[1]);status.className='f179-status'+(t.complete?' good':'');status.textContent=m.checked?(bad?`Tile ${bad[0]+1} does not match endpoint ${bad[1]+1}. Follow its first category, then its second category.`:missing!==undefined?`Endpoint ${missing+1} is missing a frequency. Every branch needs a count.`:'All four counts are correct. Each pair adds to its parent total.'):`${t.placed}/4 endpoint counts placed · ${t.correct} in the expected positions · Total ${t.total}.`;}
 window.NovaLessonComponent?.applyExploreModels();function redraw(){render(stage,p,m,{interact:true,title:'Build a complete frequency tree',tag:'INTERACTIVE COUNTS',changed:()=>{report();redraw();},pose:m.checked?tally(p,m).complete?'celebrate':'not-yet':'count',say:m.checked?'First check that each pair of endpoints adds to its parent total.':'Drag each number from the tray to a leaf. Every row must respect the two category labels. Use the accessible controls below if you prefer.'});report();}
 window.NovaLessonComponent?.applyExploreModels();function setPreset(k){NOVA.ui.cancelDrag();CFG.preset=k;p=DATA[k];m=newState();m.focus=p.focus;sel.value=k;evt.value=p.focus;m.selected=0;emit('preset',k);redraw();}
 window.NovaLessonComponent?.applyExploreModels();function place(i,j){i=Number(i);j=Number(j);if(i<0||i>3||j<0||j>3)return;for(let [a,b] of m.assign){if(a!==i&&b===j)m.assign.delete(a);}m.assign.set(i,j);m.checked=false;emit('count',exact(p,m)[i]);emit('cell',j);redraw();}
 window.NovaLessonComponent?.applyExploreModels();const row=h('div',{class:'f179-controls'},[h('label',{class:'f179-label'},['Lesson ',sel]),h('label',{class:'f179-label'},['Event ',evt]),button('Check tree',()=>{m.checked=true;let t=tally(p,m);emit('complete',t.complete);redraw();if(t.complete)M.flash(stage.querySelector('svg.f179-plot'),220,440,'result',105);}),button('Show completed tree',()=>{m.assign=new Map([[0,0],[1,1],[2,2],[3,3]]);m.checked=true;redraw();}),button('Reset placements',()=>{NOVA.ui.cancelDrag();m.assign.clear();m.checked=false;emit('reset','placements');redraw();})]);
 window.NovaLessonComponent?.applyExploreModels();const alt=h('div',{class:'f179-controls'},[h('label',{class:'f179-label'},['Count ',tile]),h('label',{class:'f179-label'},['Endpoint ',leaf]),button('Place / move',()=>place(tile.value,leaf.value)),button('Remove tile',()=>{m.assign.delete(+tile.value);redraw();})]);
 window.NovaLessonComponent?.applyExploreModels();const editors=h('div',{class:'f179-editors'});window.NovaLessonComponent?.applyExploreModels();editors.append(h('span',{class:'f179-explain',text:'Change the data: adjust endpoint counts, then rebuild the same frequency tree. Parent totals and probabilities update automatically.'}));
 window.NovaLessonComponent?.applyExploreModels();const edrow=h('div',{class:'f179-controls'});window.NovaLessonComponent?.applyExploreModels();const edits=[];window.NovaLessonComponent?.applyExploreModels();for(let i=0;i<4;i++){let inp=h('input',{type:'number',min:'0',max:'99',step:'1',value:String(p.counts[i]),class:'nova-input','aria-label':'Endpoint '+(i+1)+' count'});edits.push(inp);edrow.append(h('label',{class:'f179-label'},['Leaf '+(i+1),inp]));}
 window.NovaLessonComponent?.applyExploreModels();edrow.append(button('Apply frequencies',()=>{let v=edits.map(e=>Number(e.value));if(v.some(n=>!Number.isInteger(n)||n<0||n>99)||sum(v)===0){status.textContent='Enter four whole-number frequencies from 0 to 99 with a positive total.';return;}m.counts=v;m.assign.clear();m.checked=false;emit('reset','new data');redraw();}));
 window.NovaLessonComponent?.applyExploreModels();editors.append(edrow);window.NovaLessonComponent?.applyExploreModels();sel.addEventListener('change',()=>{setPreset(sel.value);edits.forEach((e,i)=>e.value=String(p.counts[i]));});window.NovaLessonComponent?.applyExploreModels();evt.addEventListener('change',()=>{m.focus=evt.value;emit('event',m.focus);redraw();});
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f179-explain',text:'A frequency tree counts actual outcomes, not branch probabilities. Parent count = left endpoint + right endpoint. Event probability uses the whole total unless the question explicitly conditions on a group.'}),row,alt,editors,status);
 window.NovaLessonComponent?.applyExploreModels();setPreset(CFG.preset);window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({...tally(p,m),counts:exact(p,m).slice(),assignments:Object.fromEntries(m.assign),preset:CFG.preset,focus:m.focus}),setPreset,place,remove:i=>{m.assign.delete(Number(i));redraw();},reset:()=>{m.assign.clear();m.checked=false;redraw();},reveal:()=>{m.assign=new Map([[0,0],[1,1],[2,2],[3,3]]);redraw();},setCounts:v=>{if(!Array.isArray(v)||v.length!==4||v.some(x=>!Number.isInteger(x)||x<0)||!sum(v))return false;m.counts=v.slice();m.assign.clear();redraw();return true;}};
}
function challenge(panel,api,stage){let cases=[
 {preset:'y7table',q:'Of 40 journeys, 6 bus users and 4 walkers were late. What is P(late)? Enter a fraction or decimal.',label:'Chance of being late',ans:1/4,focus:'late',conf:[[6/40,'Only bus late was counted. Include walkers who were late too.'],[4/40,'Only walking late was counted. Combine both late endpoints.'],[10/22,'This denominator is just the bus group. The question asks about all 40 journeys.']],hint:'Add the late counts across both branches, then divide by 40.'},
 {preset:'y8table',q:'The indoor team frequency is 18 and the outdoor team frequency is 8. How many of the 48 pupils chose a team activity?',label:'Combined team frequency',ans:26,focus:'team',conf:[[18,'That is only indoor team. Include the outdoor team frequency too.'],[8,'That is only outdoor team. Include the indoor team frequency too.'],[48,'That is the total sample, not the team subgroup.']],hint:'Follow the Team leaf on each first branch: 18 + 8.'},
 {preset:'y8tree',q:'Of 60 lunches, 12 hot meals and 18 cold meals were vegetarian. What is P(vegetarian)? Enter a fraction or decimal.',label:'Chance of vegetarian lunch',ans:1/2,focus:'vegetarian',conf:[[12/60,'That only counts hot vegetarian lunches.'],[18/60,'That only counts cold vegetarian lunches.'],[30/36,'The denominator must be all 60 lunches, not the hot meal branch.']],hint:'Add both vegetarian endpoint counts, then divide by the total 60.'},
 {preset:'y9sets',q:'Of 80 outcomes, 20 are A and B, 26 are A only, 14 are B only, and 20 are neither. What is P(A union B)? Enter a fraction or decimal.',label:'Probability of A union B',ans:3/4,focus:'union',conf:[[20/80,'That only counts the intersection A and B.'],[46/80,'That only counts set A. Include B only as well.'],[40/80,'For the union, include all outcomes except neither.']],hint:'A union B contains A and B together, A only, and B only. Count the overlap once.'}
 ];
 const tasks=cases.map(c=>({q:c.q,build:NOVA.entryTask(c.label,'F17-09'),check:v=>{let ok=Math.abs(v-c.ans)<1e-5,bad=c.conf.find(([a])=>Math.abs(v-a)<1e-5);return [ok,ok?'Correct. You combined the relevant endpoints with the appropriate denominator.':bad?bad[1]:'Look at both first branches. Count the favourable endpoints, and check whether the answer asks for a count or a probability.'];},hint:c.hint}));
 function draw(i){let c=cases[i],p=DATA[c.preset],m=newState();m.focus=c.focus;render(stage,p,m,{title:'Challenge '+(i+1)+' · '+c.label,tag:'QUESTION '+(i+1)+'/4',challenge:true,pose:'think',say:'Follow both branches. An endpoint is a count; use the full total when finding an unconditional probability.'});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);let off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-09')return;let d=stage.querySelector('.nv-dock');if(d)d.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'That is right. Your branch counts and total agree.':'Check both sides of the tree. The total is not the same as one branch.');if(e.detail.correct){let g=stage.querySelector('svg.f179-plot');if(g)M.flash(g,mob()?220:480,460,'result',95);}});api.onCleanup(off);
}
const DEF={id:'F17-09',title:'Frequency Tree',config:CFG,steps,render:renderStep,alt:'Neon branching frequency tree. A population divides into two first groups then four final subgroups; draggable tiles represent the four frequencies.',staticAlt:'The overall frequency equals the two first-group frequencies and the sum of all four endpoint frequencies.',exploreIntro:'Move numerical counts to the four endpoints. Check first-branch totals, change the dataset and calculate event probabilities.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-09',DEF,{models:{"model":()=>model},tables:{"DATA":()=>DATA,"steps":()=>steps},draws:{"render":["stage","p","m","opt"]},exploreFields:{"p":{"kind":"value","factory":null,"argCount":null},"tally.t":{"kind":"factory","factory":"model","argCount":1}}});
NOVA.bankMount({id:'F17-09',num:'F17·09',title:'Frequency Tree',def:DEF,years:'KS3 Years 7–9; GCSE two-way counts and conditional probability foundations.',linked:['F0-02','F0-04','F17-05','F17-06','F17-07','F17-08'],spec:{purpose:'Show counts through successive category splits, enforce conservation of frequencies and compute exact probabilities from counted endpoints.',params:'Four adjustable non-negative integer leaf counts; 2 first branches; one population total; selected events and draggable leaf values.',presets:'Y7-077 journeys, Y8-067 activities, Y8-068 lunches, Y8-072 sets, Y9-044 combined event sets.',steps:'Total → first split → first second split → all endpoints → favourable endpoints → chance.',interactions:'NOVA neon primitives, four SVG draggable count tiles with green targets and red remove zone, snap, keyboard equivalent, editable counts and live summation.',traps:'Treating frequency like probability, incorrect parent sums, missing the other branch, wrong denominator, double-counting union.',gcse:'Conditional counts and probabilities using the correct subgroup denominators.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4800);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
