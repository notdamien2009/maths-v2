(function(){'use strict';
const N=NOVA,E=N.svg.el,M=N.motion,H=N.h,ID='F5-18';
const C=window.NOVA_F5_18_CONFIG={startMode:'guided',preset:'deckA',events:['deck','card','inspect','factorStep','sort','remove','keyboard','reset','mode','step','correct','hint'],presets:{deckA:{label:'Starter · hidden factors',items:[[3,12],[1,6],[6,15],[2,11]]},deckB:{label:'Investigate · deeper factors',items:[[5,30],[7,40],[14,35],[3,14]]},deckC:{label:'Challenge · denominators to check',items:[[11,64],[7,30],[2,125],[21,77]]}}};
let live=null;
function emit(key,value){if(!C.events.includes(key))throw Error('Unregistered F5-18 event: '+key);N.events.emit('value',{engine:ID,key,value});}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){let t=a%b;a=b;b=t;}return a||1;}
function analyse(a,b){a=Number(a);b=Number(b);if(!Number.isInteger(a)||!Number.isInteger(b)||b<1||b>500||a<0||a>500)throw Error('Use a numerator from 0 to 500 and a denominator from 1 to 500.');let k=gcd(a,b),n=a/k,d=b/k,rest=d,two=0,five=0;while(rest%2===0&&rest>1){rest/=2;two++;}while(rest%5===0&&rest>1){rest/=5;five++;}let other=rest,otherPrimes=[];for(let q=3;q*q<=other;q+=2){let pow=0;while(other%q===0){other/=q;pow++;}if(pow)otherPrimes.push(pow===1?String(q):q+'^'+pow);}if(other>1)otherPrimes.push(String(other));return {a,b,n,d,k,two,five,other:rest,otherPrimes,kind:rest===1?'terminating':'recurring',key:a+'/'+b};}
function ch(g,x,y,txt,role='support',sz=22,anchor='middle'){return N.chalkText(g,x,y,String(txt),{role,size:sz,anchor});}
function rct(g,x,y,w,h,fill,extra={}){return E('rect',Object.assign({x,y,width:w,height:h,fill},extra),g);}
function panel(g,x,y,w,h,role='op'){N.neonBox(g,x,y,w,h,{role,r:15});rct(g,x+4,y+4,w-8,h-8,'url(#sort-glass)',{rx:12,stroke:'#406684','stroke-width':1});rct(g,x+13,y+11,w-26,6,'#d7f3ff',{opacity:'.075',rx:3});}
function defs(svg){let d=E('defs',{},svg),grad=E('linearGradient',{id:'sort-glass',x1:'0%',y1:'0%',x2:'0%',y2:'100%'},d);[['0%','#284662'],['50%','#122a46'],['100%','#0a1b31']].forEach(([offset,c])=>E('stop',{offset,'stop-color':c},grad));}
function frac(g,x,y,n,d,role='given',size=26){let group=E('g',{'aria-label':n+' over '+d},g);ch(group,x,y-size*.48,n,role,size);N.neonLine(group,x-size*.84,y+1,x+size*.84,y+1,{role,width:2.6});ch(group,x,y+size*.94,d,role,size);return group;}
function partsLabel(v){if(v.d===1)return 'No denominator factors remain';let p=[];if(v.two)p.push(v.two===1?'2':('2^'+v.two));if(v.five)p.push(v.five===1?'5':('5^'+v.five));if(v.other!==1)p.push(...v.otherPrimes);return p.join(' × ')||'1';}
function scene(stage,mode,st,opts={}){
 if(live){live.dead=true;live.ac.abort();}let sref={dead:false,ac:new AbortController()};live=sref;
 let mobile=innerWidth<=670,W=mobile?420:1120,V=mobile?1460:960;
 stage.textContent='';let svg=N.svg.root(W,V,'Sort reduced fractions as terminating or recurring. Investigate the prime factors of the reduced denominator: only 2s and 5s terminate. Drag fraction cards into the correct glass trays.');svg.classList.add('sort-svg');defs(svg);
 svg.querySelectorAll('filter[filterUnits="userSpaceOnUse"]').forEach(f=>{f.setAttribute('x','-500');f.setAttribute('y','-600');f.setAttribute('width',String(W+1000));f.setAttribute('height',String(V+1500));});
 ch(svg,W/2,mobile?41:44,'Decimal Sorting Studio','support',mobile?26:32);
 let tray=mobile?{x:36,y:85,w:348,h:309}:{x:54,y:96,w:508,h:386}; panel(svg,tray.x,tray.y,tray.w,tray.h,'given');ch(svg,tray.x+tray.w/2,tray.y+38,mode==='challenge'?'Classify this fraction':'Fraction cards · drag or press Enter','support',mobile?21:25);
 let bx=mobile?[{x:36,y:425,w:169,h:244,id:'terminating'},{x:215,y:425,w:169,h:244,id:'recurring'}]:[{x:588,y:96,w:222,h:386,id:'terminating'},{x:836,y:96,w:222,h:386,id:'recurring'}];
 bx.forEach(b=>{panel(svg,b.x,b.y,b.w,b.h,b.id==='terminating'?'result':'focus');ch(svg,b.x+b.w/2,b.y+36,b.id==='terminating'?'Terminating':'Recurring',b.id==='terminating'?'result':'focus',mobile?21:26);ch(svg,b.x+b.w/2,b.y+64,b.id==='terminating'?'Remainder → 0':'Remainder repeats','support',mobile?15:18);N.neonLine(svg,b.x+19,b.y+84,b.x+b.w-19,b.y+84,{role:b.id==='terminating'?'result':'focus',width:2});});
 const items=opts.items||st.items||[],placed=st.placed||{},doSort=opts.onSort,inspectKey=st.inspectKey||items[0]?.key,draggable=!!opts.interactive,locked=mode==='challenge';
 let cardLayout=mobile?{w:157,h:101,x:[47,216],y:[145,258]}:{w:209,h:122,x:[79,320],y:[173,316]};
 if(items.length===1){cardLayout.x=[mobile?130:205];cardLayout.y=[mobile?185:212];cardLayout.w=mobile?160:211;}
 function cardAt(i){let v=items[i],slot=placed[v.key],pos={x:cardLayout.x[i% (items.length===1?1:2)],y:cardLayout.y[Math.floor(i/(items.length===1?1:2))],w:cardLayout.w,h:cardLayout.h};if(slot){let b=bx.find(b=>b.id===slot),idx=items.slice(0,i).filter(a=>placed[a.key]===slot).length;pos={x:b.x+(mobile?12:18),y:b.y+(mobile?103:112)+idx*(mobile?61:89),w:b.w-(mobile?24:36),h:mobile?54:72};}return pos;}
 let hitGroups=[];
 items.forEach((v,i)=>{let p=cardAt(i),slot=placed[v.key],g=E('g',{'data-sort-card':v.key,tabindex:draggable?0:-1,role:'button','aria-label':'Fraction '+v.a+' over '+v.b+'; '+(slot?'sorted '+slot:'unsorted')},svg);panel(g,p.x,p.y,p.w,p.h,slot?(slot==='terminating'?'result':'focus'):'given');
 if(slot){ // fractions remain stacked and legible, even after sorting
   g.textContent='';panel(g,p.x,p.y,p.w,p.h,slot==='terminating'?'result':'focus');frac(g,p.x+(mobile?p.w/2:42),p.y+p.h/2-3,v.a,v.b,slot==='terminating'?'result':'focus',mobile?18:21);
   if(!mobile)ch(g,p.x+p.w*.73,p.y+p.h/2+6,'Sorted','support',21);
 } else {
   ch(g,p.x+p.w/2,p.y+26,'Card '+(i+1),'support',mobile?16:19);frac(g,p.x+p.w/2,p.y+(mobile?59:77),v.a,v.b,'given',mobile?23:29);
 }
 let click=()=>{if(sref.dead||!draggable)return;st.inspectKey=v.key;emit('card',v.key);if(opts.onInspect)opts.onInspect(v.key);};
 g.addEventListener('click',click);g.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();click();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(!doSort)return;let dest=e.key==='ArrowLeft'||e.key==='ArrowUp'?'terminating':'recurring';doSort(v.key,dest,'keyboard');}else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();if(opts.onRemove)opts.onRemove(v.key,'keyboard');}});
 if(draggable){let zones=()=>slot?[{id:'remove-'+v.key,kind:'remove',x:tray.x+15,y:tray.y+66,w:tray.w-30,h:tray.h-82}]:bx.map(b=>({id:b.id,kind:'drop',x:b.x+5,y:b.y+86,w:b.w-10,h:b.h-91}));
   N.ui.svgDrag(svg,g,{box:{x:p.x,y:p.y,w:p.w,h:p.h},canStart:()=>!sref.dead,zones,onDrop:(dest)=>doSort?doSort(v.key,dest,'drag'):false,onRemove:()=>{if(opts.onRemove)opts.onRemove(v.key,'drag');},removeTo:{x:tray.x+tray.w/2,y:tray.y+tray.h/2}});
 }
 hitGroups.push(g);
 });
 bx.forEach(b=>{let count=items.filter(v=>placed[v.key]===b.id).length;if(!count){ch(svg,b.x+b.w/2,b.y+(mobile?151:214),'Drop here','support',mobile?17:21);ch(svg,b.x+b.w/2,b.y+(mobile?184:252),b.id==='terminating'?'Only factors 2 or 5':'Other prime factor','support',mobile?14:18);}else ch(svg,b.x+b.w/2,b.y+b.h-18,count+' placed',b.id==='terminating'?'result':'focus',mobile?17:20);});
 let proof=mobile?{x:36,y:696,w:348,h:547}:{x:54,y:508,w:1004,h:337};panel(svg,proof.x,proof.y,proof.w,proof.h,'op');ch(svg,W/2,proof.y+41,'Denominator investigation','support',mobile?24:30);
 let active=items.find(v=>v.key===inspectKey)||items[0],pstep=opts.proofStep??st.proofStep??0;
 if(active){let reveal=opts.reveal!==false&&!locked;ch(svg,mobile?W/2:proof.x+187,proof.y+(mobile?96:103),'Original fraction','support',mobile?18:23);
 frac(svg,mobile?W/2:proof.x+187,proof.y+(mobile?153:169),active.a,active.b,'given',mobile?27:31);
 if(reveal&&pstep>=1){let xx=mobile?W/2:proof.x+480;ch(svg,xx,proof.y+(mobile?225:103),active.k>1?'Reduce by '+active.k:'Already simplest','support',mobile?19:22);frac(svg,xx,proof.y+(mobile?286:169),active.n,active.d,'op',mobile?27:32);}
 if(reveal&&pstep>=2){let fy=proof.y+(mobile?362:104),xx=mobile?W/2:proof.x+770;ch(svg,xx,fy,'Reduced denominator factors','support',mobile?19:21);ch(svg,xx,fy+(mobile?52:63),partsLabel(active),'focus',mobile?25:29);}
 if(reveal&&pstep>=3){ch(svg,W/2,proof.y+(mobile?451:287),active.kind==='terminating'?'Only 2s and 5s → terminates':'Other prime factor → repeats',active.kind==='terminating'?'result':'focus',mobile?20:25);}
 if(locked){ch(svg,W/2,proof.y+(mobile?321:263),'Simplify first. What factors remain?','support',mobile?22:27);}else if(pstep<3){
    let stageNames=['Reduce','Factor','Sort'],yy=proof.y+(mobile?390:252),pw=mobile?97:188,gap=mobile?9:28,xx=proof.x+(proof.w-(pw*3+gap*2))/2;
    stageNames.forEach((name,i)=>{let x=xx+i*(pw+gap);N.neonBox(svg,x,yy,pw,mobile?59:64,{role:i<=pstep?'result':'given',r:10});ch(svg,x+pw/2,yy+(mobile?37:43),(i+1)+' · '+name,i<=pstep?'result':'support',mobile?17:22);});
    ch(svg,W/2,proof.y+(mobile?498:322),'Follow the proof in order','support',mobile?19:20);
  }
 }
 const footerY=mobile?1280:873;panel(svg,mobile?36:54,footerY,mobile?348:1004,mobile?128:62,'given');if(mobile){
  ch(svg,W/2,footerY+35,mode==='challenge'?'Choose the correct bin':items.length+' cards · '+items.filter(v=>placed[v.key]).length+' sorted','support',20);
  ch(svg,W/2,footerY+75,mode==='challenge'?'The answer is hidden':'Same whole each time','support',19);
  ch(svg,W/2,footerY+110,'Use ← / → to sort','support',18);
 }else ch(svg,W/2,footerY+40,mode==='challenge'?'Choose the correct bin. No answer is shown.':items.length+' cards · '+items.filter(v=>placed[v.key]).length+' sorted · same whole each time','support',23);
 ch(svg,tray.x+tray.w/2,tray.y+tray.h-14,'Return sorted cards here','error',mobile?17:19);
 stage.appendChild(svg);
 N.scene.helperStrip(stage,opts.pose||'compare',opts.caption||'Reduce the fraction before choosing a bin.');
 if(opts.animate&&items.length){M.tween(420,t=>{if(!sref.dead)svg.style.opacity=String(.82+.18*t);},M.ease.inOut);}
 return sref;
}
const guidedSteps=[
 {name:'Spot the two types',caption:'Some divisions end; others repeat.',pose:'question',narration:'We want to discover why some fractions make terminating decimals while others have repeating digits.',proofStep:0,items:[[6,15]]},
 {name:'Reduce first',caption:'Always simplify before testing the denominator.',pose:'explain',narration:'Reduce six fifteenths by three. We get two fifths. It is the denominator of the simplest fraction that matters.',proofStep:1,items:[[6,15]]},
 {name:'Inspect factors',caption:'Five is an allowed denominator factor.',pose:'magnify',narration:'The reduced denominator is five. Fractions whose simplified denominators use only twos and fives have terminating decimals.',proofStep:2,items:[[6,15]]},
 {name:'Place a terminating card',caption:'Two fifths produces a terminating decimal.',pose:'point-right',narration:'Two fifths is zero point four. Put it in the terminating tray.',proofStep:3,items:[[6,15]],sort:true},
 {name:'Find a recurring factor',caption:'The factor three remains in one sixth.',pose:'count',narration:'Now take one sixth. The denominator still includes a factor of three. Its decimal repeats.',proofStep:3,items:[[1,6]]},
 {name:'Generalise the rule',caption:'Reduce, factorise, then sort.',pose:'celebrate',narration:'Only factors two and five in a simplest denominator means terminating. Any other prime factor means recurring.',proofStep:3,items:[[3,12],[1,6]]}
];
function guided(i,stage){let a=guidedSteps[i],v=a.items.map(([n,d])=>analyse(n,d));scene(stage,'guided',{items:v,placed:a.sort?{[v[0].key]:v[0].kind}:{},inspectKey:v[0].key,proofStep:a.proofStep},{items:v,proofStep:a.proofStep,pose:a.pose,caption:a.caption,animate:i>0});}
function explore(panel,stage){let state={items:[],placed:{},inspectKey:null,proofStep:0};let chosen='deckA';let select=H('select',{class:'nova-input','aria-label':'Choose sorting card deck'}),status=H('p',{class:'sort-status',role:'status','aria-live':'polite'});Object.entries(C.presets).forEach(([k,p])=>select.appendChild(H('option',{value:k,text:p.label})));select.value=chosen;
 function reset(k){chosen=k;state.items=C.presets[chosen].items.map(([a,b])=>analyse(a,b));state.placed={};state.inspectKey=state.items[0].key;state.proofStep=0;render(false);}
 function sorted(key,bin,via){let v=state.items.find(x=>x.key===key);if(!v||state.placed[key])return false;
  if(v.kind!==bin){status.textContent='Not quite. Simplify this fraction and inspect the reduced denominator.';emit('hint',key+' needs reducing');return false;}
  state.placed[key]=bin;state.inspectKey=key;state.proofStep=3;emit('sort',{card:key,bin,via});status.textContent='Correct. The reduced denominator has factors '+partsLabel(v)+'. This fraction is '+bin+'.';render(true);return true;}
 function remove(key,via){if(!state.placed[key])return false;delete state.placed[key];emit('remove',{card:key,via});status.textContent='Returned '+key+' to the unsorted tray.';render(false);return true;}
 function inspect(key){state.inspectKey=key;state.proofStep=0;render(false);}
 function step(){state.proofStep=Math.min(3,state.proofStep+1);emit('factorStep',state.proofStep);render(true);}
 function render(animate){scene(stage,'explore',state,{interactive:true,onSort:sorted,onRemove:remove,onInspect:inspect,proofStep:state.proofStep,animate,pose:state.proofStep>1?'magnify':'compare',caption:state.proofStep===3?'The reduced denominator tells the story.':'Find the factors of the reduced denominator.'});let done=Object.keys(state.placed).length;if(done===state.items.length)status.textContent='All four fractions sorted. Change deck to investigate further.';else if(!status.textContent)status.textContent='Drag a fraction to its bin, or focus a card and press ← / →. Tap a card to inspect it.';}
 let next=H('button',{class:'nova-btn primary',text:'Reveal next proof step',onclick:step});let show=H('button',{class:'nova-btn',text:'Show factor proof',onclick:()=>{state.proofStep=3;emit('factorStep',3);render(true);}});let ret=H('button',{class:'nova-btn',text:'Return selected card',onclick:()=>remove(state.inspectKey,'button')});let again=H('button',{class:'nova-btn',text:'Reset this deck',onclick:()=>{emit('reset',chosen);status.textContent='';reset(chosen);}});
 select.addEventListener('change',()=>{emit('deck',select.value);status.textContent='';reset(select.value);});panel.appendChild(H('div',{class:'sort-controls'},[H('label',{text:'Sorting deck'}),select,next,show,ret,again]));panel.appendChild(status);
 C._explore={get:()=>({deck:chosen,placed:{...state.placed},inspectKey:state.inspectKey,proofStep:state.proofStep,items:state.items.map(a=>({...a}))}),sort:(key,bin)=>sorted(key,bin,'test'),remove:(key)=>remove(key,'test'),inspect,advance:step,reset:()=>reset(chosen),setDeck:reset};reset(chosen);
}
function challenge(panel,api,stage){const tasks=[{n:3,d:12,answer:'terminating',hint:'Simplify three twelfths first. Which prime factors remain?'},{n:7,d:30,answer:'recurring',hint:'Thirty includes a factor other than two or five.'},{n:6,d:15,answer:'terminating',hint:'Simplify six fifteenths before looking at the denominator.'}];let index=0,wrong=0,question=H('p',{class:'sort-status'}),feedback=H('p',{class:'sort-status',role:'status','aria-live':'polite'}),peer=H('img',{alt:'Izaac reviewing his tablet'}),peerText=H('span',{text:'Izaac is thinking.'});
 function react(name,label){const x=N.helperImg(name,'teen');peer.src=x.src;peer.alt=x.alt;peerText.textContent=label;}
 function draw(){let a=tasks[index],v=analyse(a.n,a.d);question.textContent='Challenge '+(index+1)+' of 3 · Which decimal type does this fraction have?';scene(stage,'challenge',{items:[v],placed:{},inspectKey:v.key,proofStep:0},{items:[v],reveal:false,interactive:true,onSort:(k,bin)=>answer(bin),pose:'question',caption:'Decide first. The answer is hidden until you check.'});}
 function answer(bin){let a=tasks[index],ok=a.answer===bin;api.check(ok,ok?'Correct. You reduced before classifying.':'Try simplifying the fraction first.');if(ok){react(index===2?'victory':'proud','That is the right denominator test.');emit('correct',{question:index+1,answer:bin});feedback.textContent='Correct. '+(index===2?'You completed all three challenges.':'Next question coming up.');if(index<2){index++;setTimeout(()=>{if(document.querySelector('#F5-18 .nova-tab[data-m="challenge"][aria-selected="true"]')){wrong=0;draw();}},190);}return true;}
 wrong++;react(wrong>=2?'worried':'read-tablet','Think about the reduced denominator.');feedback.textContent='Not yet. The original denominator can mislead you.';return false;}
 function help(){let a=tasks[index];api.hint(a.hint);emit('hint',index+1);feedback.textContent=a.hint;react('idea','Izaac found a useful clue.');}
 panel.appendChild(question);panel.appendChild(H('div',{class:'sort-controls'},[H('button',{class:'nova-btn primary',text:'Terminating',onclick:()=>answer('terminating')}),H('button',{class:'nova-btn primary',text:'Recurring',onclick:()=>answer('recurring')}),H('button',{class:'nova-btn',text:'Hint',onclick:help})]));panel.appendChild(feedback);panel.appendChild(H('div',{class:'sort-peer'},[peer,peerText]));react('read-tablet','Izaac is working on the same question.');C._challenge={index:()=>index,answer,help};draw();
}
const DEF={id:ID,title:'Terminating or Recurring · Decimal Sorting Studio',config:C,steps:guidedSteps,render:guided,explore,challenge,alt:'Glass trays for terminating and recurring fractions, draggable stacked-chalk fraction cards, and an exact prime-factor investigation of the reduced denominator.'};
N.bankMount({id:ID,num:'F5·18',title:DEF.title,def:DEF,years:'KS3 Years 7–9',linked:['F5-17','F5-13'],spec:{purpose:'Sort rational numbers into terminating and recurring decimals by reducing first and factoring the denominator.',params:'Three sets of four fraction cards. Prime-factor criterion on reduced denominators.',presets:'Starter, investigation, and mixed-denominator challenge decks.',animation:'Fraction-card arrival and progressive factor-evidence reveal using the NOVA motion engine.',interaction:'Re-grabbable draggable cards, two valid bins, red return-to-tray, keyboard arrows/Enter and factor proof controls.',misconceptions:'Testing the unreduced denominator gives wrong conclusions. Zero has terminating expansion. Fractions with other prime factors recur.',gcse:'Rational numbers, prime factorisation and explaining recurring-decimal behaviour.'}});
const log=document.getElementById('log');function logIt(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,3500);}N.events.history().forEach(logIt);N.events.on('*',logIt);document.getElementById('clearlog').onclick=()=>log.textContent='';
})();
