/* F17-07 TREE DIAGRAM BUILDER — canonical NOVA Neon + Chalk / F0-F2 embedded core */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_07_CONFIG={startMode:'watch',preset:'y7',events:['value','correct','step','mode','hintUsed'],valueKeys:['preset','path','markedCount','pathProbability','eventProbability','totalProbability','complete','reset','firstProbability','secondProbability'],presets:{
 y7:{label:'Y7-075 · Two fair coins',year:7,first:['H','T'],second:['H','T'],a:[1,1],b:[1,1],event:'Exactly one head',kind:'ONE HEAD',win:(a,b)=>a!==b,context:'Coin 1 then coin 2'},
 y8:{label:'Y8-071 · Two biased spins',year:8,first:['R','B'],second:['R','B'],a:[2,3],b:[2,3],event:'Red, then red',kind:'R THEN R',win:(a,b)=>a==='R'&&b==='R',context:'Independent spins'},
 y9spaces:{label:'Y9-043 · Parity and colour',year:9,first:['E','O'],second:['R','B','G'],a:[1,1],b:[1,1,1],event:'Even, then Blue',kind:'EVEN AND BLUE',win:(a,b)=>a==='E'&&b==='B',context:'Die parity then spinner'},
 y9ind:{label:'Y9-045 · Independent A and B',year:9,first:['A','¬A'],second:['B','¬B'],a:[7,3],b:[2,3],event:'A, then B',kind:'A AND B',win:(a,b)=>a==='A'&&b==='B',context:'Independent events'}
 }});
const mobile=()=>innerWidth<=500,clip=(x,a,b)=>Math.max(a,Math.min(b,x));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const F=(a,b=1)=>{if(b===0)throw Error('Zero denominator');let v=gcd(a,b);return [a/v,b/v];};
const fmtFrac=v=>F(v[0],v[1]).join(' over ');
const add=(x,y)=>F(x[0]*y[1]+y[0]*x[1],x[1]*y[1]),mul=(x,y)=>F(x[0]*y[0],x[1]*y[1]);
const frac=(vals,i)=>F(vals[i],vals.reduce((a,b)=>a+b,0));
const prob=(p,r,c)=>mul(frac(p.a,r),frac(p.b,c));
const keys=p=>p.first.flatMap((a,r)=>p.second.map((b,c)=>r+'-'+c));
const pair=(p,r,c)=>p.first[r]+' → '+p.second[c];
const parse=k=>k.split('-').map(Number);
const winners=p=>keys(p).filter(k=>{let [r,c]=parse(k);return p.win(p.first[r],p.second[c]);});
const eventProb=p=>winners(p).reduce((v,k)=>{let [r,c]=parse(k);return add(v,prob(p,r,c));},[0,1]);
const totals=p=>keys(p).reduce((v,k)=>{let [r,c]=parse(k);return add(v,prob(p,r,c));},[0,1]);
const emit=(key,value)=>{if(!CFG.valueKeys.includes(key))throw Error('F17-07 invalid event key: '+key);NOVA.events.emit('value',{engine:'F17-07',key,value});};
const state=()=>({marked:new Set(),focus:'0-0',revealed:false});
function result(p,m){const w=winners(p);return {total:keys(p).length,favourable:w.length,marked:m.marked.size,correct:m.marked.size===w.length&&[...m.marked].every(k=>w.includes(k)),markedProbability:[...m.marked].reduce((v,k)=>{let [r,c]=parse(k);return add(v,prob(p,r,c));},[0,1]),eventProbability:eventProb(p),totalProbability:totals(p)};}
function signal(p,m){let z=result(p,m);emit('preset',CFG.preset);emit('markedCount',z.marked);emit('eventProbability',z.eventProbability[0]/z.eventProbability[1]);emit('totalProbability',z.totalProbability[0]/z.totalProbability[1]);emit('complete',z.correct);}
function txt(g,x,y,text,role='op',sz=20,anchor='middle'){return NOVA.chalkText(g,x,y,String(text),{role,size:sz,anchor});}
function fracSVG(g,x,y,p,role='op',sz=18){let [n,d]=p;txt(g,x,y-7,n,role,sz);NOVA.neonLine(g,x-sz*.64,y+4,x+sz*.64,y+4,{role,width:3});txt(g,x,y+sz+9,d,role,sz);}
function fracHTML(n,d){let x=h('span',{class:'f177-frac','aria-label':n+' over '+d});x.append(h('b',{text:String(n)}),h('i',{'aria-hidden':'true'}),h('b',{text:String(d)}));return x;}
function metric(name,value,role,den){let c=h('div',{class:'f177-card','data-role':role});c.append(h('span',{class:'lab',text:name}),den===undefined?h('span',{class:'val',text:String(value)}):fracHTML(value,den));return c;}
function positions(p){const small=mobile(),three=p.second.length===3;const W=small?420:860,H=three?969:880;let rootX=small?42:84,firstX=small?154:260,endX=small?346:690;
 const ys=three?(small?[[152,252,352],[494,594,694]]:[[156,248,340],[494,586,678]]):(small?[[205,315],[495,605]]:[[205,305],[475,575]]);
 let firstY=ys.map(a=>(a[0]+a.at(-1))/2),rootY=(firstY[0]+firstY[1])/2;
 return {W,H,rootX,firstX,endX,ys,firstY,rootY,palY:three?888:794,probY:three?808:716};}
function render(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("render",arguments);}

 stage.replaceChildren();let A=positions(p),z=result(p,m),three=p.second.length===3;
 NOVA.cap(stage,o.title||'Build a probability tree',o.tag||'WEIGHTED BRANCHES');
 let svg=S.root(A.W,A.H,'Weighted probability tree, with first and second events, complementary branch probabilities, and multiplied path probabilities. Drag an event marker onto a leaf.');svg.classList.add('f177-plot');svg.setAttribute('data-engine-plot','F17-07');
 txt(svg,A.W/2,48,p.event,'focus',mobile()?24:28);
 txt(svg,A.W/2,86,'FIRST EVENT  →  SECOND EVENT  →  OUTCOMES','given',mobile()?14:19);
 const shown=o.revealCount??z.total;
 // Construct true branches from the common root with the core Neon Tube helpers.
 NOVA.neonRing(svg,A.rootX,A.rootY,{role:'focus',r:mobile()?12:17,pulse:false});
 txt(svg,A.rootX,A.rootY-26,'START','given',mobile()?16:21);
 const zones=[],outcomeBox=mobile()?61:82;
 for(let i=0;i<2;i++){
   let y=A.firstY[i],labelX=A.firstX;NOVA.neonLine(svg,A.rootX+13,A.rootY,A.firstX-28,y,{role:i?'purple':'focus',width:4});
   if(o.showWeights!==false)fracSVG(svg,(A.rootX+A.firstX)/2, (A.rootY+y)/2+(i?23:-25),frac(p.a,i),'focus',mobile()?19:22);
   NOVA.neonBox(svg,A.firstX-28,y-26,56,52,{role:'focus',r:15});txt(svg,labelX,y+8,p.first[i],'op',mobile()?24:27);
   NOVA.neonRing(svg,A.firstX+31,y,{role:'focus',r:5,pulse:false});
   for(let c=0;c<p.second.length;c++){
     let key=i+'-'+c,yy=A.ys[i][c],selected=m.marked.has(key),winning=p.win(p.first[i],p.second[c]);
     let lineEnd=A.endX-(outcomeBox/2)-3;
     NOVA.neonLine(svg,A.firstX+34,y,lineEnd,yy,{role:selected?'result':c===1?'op':'given',width:selected?5:3.6});
     const branchX=A.firstX+(lineEnd-A.firstX)*.54,branchY=y+(yy-y)*.54;
     if(o.showWeights!==false)fracSVG(svg,branchX,branchY+(c===0?-16:c===2?16:((i===0)?-3:3)),frac(p.b,c),selected?'result':'op',mobile()?18:20);
     const open=o.revealCount===undefined||(i*p.second.length+c)<shown;
     let x=A.endX-outcomeBox/2,boxH=o.showPath&&open?84:50,ybox=yy-boxH/2;
     let g=E('g',{'data-path':key,tabindex:o.interact&&m.focus===key?0:-1,role:o.interact?'button':'img','aria-label':pair(p,i,c)+(selected?', selected':', not selected'),'aria-pressed':o.interact?String(selected):undefined},svg);
     NOVA.neonBox(g,x,ybox,outcomeBox,boxH,{role:selected?'result':o.showFavourites&&winning?'focus':open?'given':'unknown',r:13});
     txt(g,A.endX,o.showPath&&open?yy-17:yy+8,open?p.second[c]:'?',selected?'result':'op',mobile()?23:26);
     if(selected)NOVA.neonRing(g,o.showPath?A.endX-outcomeBox/2+9:A.endX,yy+16,{role:'result',r:mobile()?7:9,pulse:false});
     if(open&&o.showPath){let ff=prob(p,i,c);fracSVG(g,A.endX,yy+9,ff,selected?'result':'focus',mobile()?18:20);}
     zones.push({x:x+2,y:ybox+1,w:outcomeBox-4,h:boxH-2,id:key,kind:'drop'});
     if(o.interact){
      g.addEventListener('click',()=>{NOVA.ui.cancelDrag();o.toggle(key);});
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.toggle(key);return;}let dd={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]}[e.key];if(dd){e.preventDefault();let nr=clip(i+dd[0],0,1),nc=clip(c+dd[1],0,p.second.length-1),kk=nr+'-'+nc,g2=svg.querySelector('[data-path="'+kk+'"]');if(g2){g.tabIndex=-1;g2.tabIndex=0;m.focus=kk;g2.focus();}}});
     }
   }
 }
 txt(svg,A.W/2,A.probY-52,o.challenge?'FOLLOW THE BRANCHES — DO NOT GUESS':'MULTIPLY ALONG EACH PATH','given',mobile()?17:20);
 if(o.challenge||o.hideAnswer)txt(svg,A.W/2,A.probY,'P('+p.kind+')  =  ?','focus',mobile()?21:25);
 else{txt(svg,A.W/2-45,A.probY,'P('+p.kind+') =','focus',mobile()?21:25);fracSVG(svg,A.W/2+88,A.probY-13,o.showFavourites||m.revealed?z.eventProbability:z.markedProbability,o.showFavourites?'result':'op',mobile()?20:23);}
 let rm={x:mobile()?237:555,y:A.palY-26,w:mobile()?135:175,h:54,id:'remove',kind:'remove'},pl={x:mobile()?33:185,y:A.palY-26,w:mobile()?145:184,h:54};
 if(o.interact){
   NOVA.neonBox(svg,rm.x,rm.y,rm.w,rm.h,{role:'error',r:14,text:'REMOVE',size:mobile()?17:20});
   let token=E('g',{'data-tree-token':'1',role:'button',tabindex:0,'aria-label':'Drag MARK to a tree endpoint, or use Select path controls.'},svg);NOVA.neonBox(token,pl.x,pl.y,pl.w,pl.h,{role:'focus',r:14,text:'MARK PATH',size:mobile()?18:21});
   let zz=[...zones,rm];
   NOVA.ui.svgDrag(svg,token,{box:pl,zones:()=>zz,removeTo:{x:rm.x+rm.w/2,y:rm.y+rm.h/2},onDrop:id=>{if(!id||id==='remove')return false;m.marked.add(id);emit('path',id);o.changed();return true;},onRemove:()=>{}});
   for(let k of m.marked){let [i,c]=parse(k),xx=A.endX-(o.showPath?outcomeBox/2-9:0),yy=A.ys[i][c]+16,rr=mobile()?12:14;
     let g=E('g',{'data-placed':k,role:'button',tabindex:0,'aria-label':'Selected path '+pair(p,i,c)+'. Drag to move, red REMOVE to delete, or Delete key.'},svg);
     NOVA.neonRing(g,xx,yy,{role:'result',r:rr,pulse:false});
     NOVA.ui.svgDrag(svg,g,{box:{x:xx-rr,y:yy-rr,w:rr*2,h:rr*2},zones:()=>zz,removeTo:{x:rm.x+rm.w/2,y:rm.y+rm.h/2},onDrop:id=>{if(!id||id==='remove')return false;m.marked.delete(k);m.marked.add(id);emit('path',id);o.changed();return true;},onRemove:()=>{m.marked.delete(k);o.changed();}});
     g.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();m.marked.delete(k);o.changed();}});
   }
 }else{
    NOVA.neonBox(svg,pl.x,pl.y,pl.w,pl.h,{role:'focus',r:14,text:'FIRST × SECOND',size:mobile()?16:20});
    NOVA.neonBox(svg,rm.x,rm.y,rm.w,rm.h,{role:'result',r:14,text:'PATH = PRODUCT',size:mobile()?15:20});
 }
 stage.append(svg);
 let reads=h('div',{class:'f177-readouts'});
 reads.append(metric('POSSIBLE PATHS',z.total,'unknown'),metric('PATHS MARKED',z.marked,'focus'));
 if(o.challenge||o.hideAnswer)reads.append(metric('EVENT CHANCE','?','result'));
 else{let f=(o.showFavourites||m.revealed)?z.eventProbability:z.markedProbability;reads.append(metric(o.showFavourites||m.revealed?'TRUE CHANCE':'MARKED CHANCE',f[0],'result',f[1]));}
 stage.append(reads);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Multiply along a path. Add probabilities across paths that satisfy the event.');
 if(o.flash)M.flash(svg,A.endX,A.ys[0][0],'result',72);
 return {svg,zones,layout:A,counts:z};
}
const steps=[
 {name:'Start with an experiment',pose:'explain',narration:'The tree shows two successive events. Start at the left and follow each possible result of the first event.',prompt:'Which outcomes belong to the first split?'},
 {name:'First probabilities',pose:'point-down',narration:'Every set of branches from one node must add to one. These first two probabilities are complements.',prompt:'What must the two first-stage probabilities add to?'},
 {name:'Second independent event',pose:'count',narration:'An independent second event has the same probabilities whichever first branch occurred. Follow every branch.',prompt:'Do the second-stage probabilities change after the first result?'},
 {name:'Multiply along paths',pose:'compare',narration:'To find an AND probability, multiply the branch probabilities along the path. Do not add them along one path.',prompt:'Which two fractions multiply for this outcome?'},
 {name:'Add favourable paths',pose:'think',narration:'When several different paths satisfy the event, add their path probabilities. No endpoint is counted twice.',prompt:'How many separate paths meet the event condition?'},
 {name:'Check the whole model',pose:'celebrate',narration:'All endpoint probabilities must add to one. Compare your event probability with the full probability model.',prompt:'How can you check the completed tree is a valid model?'}
];
function renderStep(i,stage){let p=CFG.presets[CFG.preset],k=clip(i,0,5),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("renderStep.m",(...a)=>state(...a),[]):(state())),w=winners(p),z=result(p,m);
 if(k>=4){m.marked=new Set(w);m.revealed=true;}
 render(stage,p,m,{title:steps[k].name,tag:'STEP '+(k+1)+'/6',revealCount:k===0?0:k===1?0:k===2?p.second.length:z.total,showWeights:k>=1,showPath:k>=3,showFavourites:k>=4,hideAnswer:k<4,pose:steps[k].pose,flash:k===5,say:[
 'Start with the first event. Every first outcome must have a route.',
 'The first branch probabilities add to one. Complementary outcomes leave nothing out.',
 'Repeat the second event at each first branch. Independence means the weights stay the same.',
 'Multiply the fractions along the chosen path to get its probability.',
 'Add the probabilities of all '+w.length+' favourable endpoints — not the branch labels.',
 'The endpoint chances sum to one. Our event chance is '+fmtFrac(z.eventProbability)+'.'
 ][k]});
}
function explore(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();let p=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("p",()=>(CFG.presets[CFG.preset])):(CFG.presets[CFG.preset])),m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("m",(...a)=>state(...a),[]):(state()));
 window.NovaLessonComponent?.applyExploreModels();const pres=h('select',{class:'nova-input','aria-label':'Lesson preset'}),pick=h('select',{class:'nova-input','aria-label':'Tree outcome path'}),status=h('div',{class:'f177-status',role:'status','aria-live':'polite'});
 window.NovaLessonComponent?.applyExploreModels();for(let [key,v] of Object.entries(CFG.presets))pres.append(h('option',{value:key,text:v.label}));
 window.NovaLessonComponent?.applyExploreModels();const button=(name,fn)=>h('button',{class:'nova-btn',text:name,onclick:fn});
 window.NovaLessonComponent?.applyExploreModels();function repaint(){const z=result(p,m);render(stage,p,m,{title:'Drag a marker to the winning paths',tag:'INTERACTIVE TREE',interact:true,showWeights:true,showPath:m.revealed,showFavourites:m.revealed,pose:z.correct?'celebrate':z.marked?'compare':'explain',toggle,changed:()=>{signal(p,m);repaint();},say:z.correct?'Correct: you marked every favourable path. Follow the branch weights and check your sum.':z.marked?'You have '+z.marked+' marked paths. Multiply the probabilities and check whether each path matches the event.':'Drag the MARK PATH token onto an endpoint, or choose a path below. Check the fractions on every branch.'});
 status.textContent=z.marked+' marked · '+z.favourable+' favourable · '+(z.correct?'every winning path found':'look for missing or extra paths');status.className='f177-status'+(z.correct?' good':'');}
 window.NovaLessonComponent?.applyExploreModels();function toggle(k){m.focus=k;if(m.marked.has(k))m.marked.delete(k);else m.marked.add(k);emit('path',k);signal(p,m);repaint();}
 window.NovaLessonComponent?.applyExploreModels();function change(v){NOVA.ui.cancelDrag();CFG.preset=v;p={...CFG.presets[v],a:[...CFG.presets[v].a],b:[...CFG.presets[v].b]};m=state();pres.value=v;pick.replaceChildren();keys(p).forEach(k=>{let [i,c]=parse(k);pick.append(h('option',{value:k,text:pair(p,i,c)}));});emit('reset','preset');signal(p,m);repaint();}
 window.NovaLessonComponent?.applyExploreModels();const top=h('div',{class:'f177-box'},[h('label',{class:'f177-label'},['Lesson preset ',pres]),button('Clear markers',()=>{NOVA.ui.cancelDrag();m.marked.clear();m.revealed=false;signal(p,m);repaint();}),button('Reveal path weights',()=>{m.revealed=true;signal(p,m);repaint();})]);
 window.NovaLessonComponent?.applyExploreModels();const bottom=h('div',{class:'f177-box'},[h('label',{class:'f177-label'},['Outcome path ',pick]),button('Mark / unmark',()=>toggle(pick.value)),button('Remove selected',()=>{m.marked.delete(pick.value);signal(p,m);repaint();})]);
 window.NovaLessonComponent?.applyExploreModels();const adjust=h('div',{class:'f177-extra'});
 window.NovaLessonComponent?.applyExploreModels();function slider(name,index){let v=p[index][0]/p[index].reduce((a,b)=>a+b,0),inp=h('input',{type:'range',min:1,max:9,step:1,value:Math.round(10*v),'aria-label':name}),val=h('span',{text:Math.round(10*v)+' / 10'});inp.oninput=()=>{let n=Number(inp.value);p[index]=[n,10-n];val.textContent=n+' / 10';emit(index==='a'?'firstProbability':'secondProbability',n/10);m.marked.clear();m.revealed=false;signal(p,m);repaint();};return h('label',{class:'f177-label'},[name,inp,val]);}
 window.NovaLessonComponent?.applyExploreModels();if(CFG.preset==='y9ind'){} // built dynamically on change
 window.NovaLessonComponent?.applyExploreModels();const originalChange=change;
 window.NovaLessonComponent?.applyExploreModels();function showAdjust(){adjust.replaceChildren();if(CFG.preset==='y9ind'){adjust.append(slider('P(A)', 'a'),slider('P(B)','b'));}else adjust.append(h('span',{class:'f177-info',text:'This preset uses fixed fair outcomes or fixed stated weights. Switch to Y9 independent events to adjust branch weights.'}));}
 window.NovaLessonComponent?.applyExploreModels();pres.onchange=()=>{change(pres.value);showAdjust();};
 window.NovaLessonComponent?.applyExploreModels();panel.append(h('p',{class:'f177-info',text:'An independent probability tree multiplies along paths and adds separate favourable paths. Drag MARK PATH to an outcome or use the keyboard path selector. The red REMOVE zone discards a marked path.'}),top,adjust,bottom,status);
 window.NovaLessonComponent?.applyExploreModels();change(CFG.preset);window.NovaLessonComponent?.applyExploreModels();showAdjust();window.NovaLessonComponent?.applyExploreModels();api.onCleanup(()=>NOVA.ui.cancelDrag());
 window.NovaLessonComponent?.applyExploreModels();CFG._explore={get:()=>({...result(p,m),preset:CFG.preset,marked:[...m.marked],winners:winners(p),branchA:p.a.slice(),branchB:p.b.slice()}),setPreset:v=>{change(v);showAdjust();},toggle,clear:()=>{m.marked.clear();signal(p,m);repaint();},reveal:()=>{m.marked=new Set(winners(p));m.revealed=true;signal(p,m);repaint();}};
}
function challenge(panel,api,stage){const tasks=[
 {q:'Two fair coins are tossed. What is the probability of Head followed by Head? Enter a fraction or decimal.',build:NOVA.entryTask('Probability of HH','F17-07'),check:v=>[Math.abs(v-.25)<.0001,Math.abs(v-.25)<.0001?'Correct. One half multiplied by one half is one quarter.':Math.abs(v-.5)<.0001?'That is the probability of one head on one toss; multiply both branches.':v===1?'Adding one half and one half is incorrect along a single path.':'Follow H then H and multiply its branch probabilities.'],hint:'Take the first one half branch, then multiply by the second one half branch.'},
 {q:'P(red) is 2/5 on each independent spin. What is the probability of red then red?',build:NOVA.entryTask('Red then red','F17-07'),check:v=>[Math.abs(v-4/25)<.0001,Math.abs(v-4/25)<.0001?'Correct. Two fifths times two fifths is four twenty-fifths.':Math.abs(v-.4)<.0001?'Two fifths is the chance on just one spin. Two independent spins multiply.':Math.abs(v-.8)<.0001?'You have added two fifths and two fifths; multiply for AND.':'Multiply the red branch chance by itself.'],hint:'For two independent red results, multiply 2/5 by 2/5.'},
 {q:'A fair die is even with probability 1/2; a fair three-colour spinner lands Blue with probability 1/3. Find P(even AND blue).',build:NOVA.entryTask('Even and blue','F17-07'),check:v=>[Math.abs(v-1/6)<.0001,Math.abs(v-1/6)<.0001?'Correct. One half multiplied by one third is one sixth.':Math.abs(v-5/6)<.0001?'Adding one half and one third is incorrect for independent AND events.':Math.abs(v-1/3)<.0001?'That is just the spinner probability. Include the die branch too.':'Multiply the chance of even by the chance of blue.'],hint:'Follow the EVEN branch, then the BLUE branch, and multiply.'},
 {q:'Two events are independent: P(A)=7/10 and P(B)=2/5. What is P(A AND B)?',build:NOVA.entryTask('A and B','F17-07'),check:v=>[Math.abs(v-.28)<.0001,Math.abs(v-.28)<.0001?'Correct. Seven tenths times two fifths equals fourteen fiftieths, or seven twenty-fifths.':Math.abs(v-.7)<.0001?'That is only P(A). Multiply by P(B) too.':Math.abs(v-.4)<.0001?'That is only P(B). Both events must occur.':v>1?'A probability cannot exceed one. Do not add independent AND probabilities.':'Multiply 7/10 by 2/5, then simplify.'],hint:'Multiply numerators (7 × 2) and denominators (10 × 5), then simplify.'}
 ];
 function draw(i){let preset=['y7','y8','y9spaces','y9ind'][i],p=CFG.presets[preset];if(i===0)p={...p,event:'Head, then head',kind:'H AND H',win:(a,b)=>a==='H'&&b==='H'};render(stage,p,state(),{title:'Challenge '+(i+1)+' · independent branches',tag:'TASK '+(i+1)+'/4',challenge:true,hideAnswer:true,showWeights:true,pose:'think',say:'For an AND event, follow one full route and multiply its fractions. Check your result lies between zero and one.'});}
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 const off=NOVA.events.on('correct',e=>{if(e.detail?.engine!=='F17-07')return;let d=stage.querySelector('.nv-dock');if(d)d.remove();NOVA.scene.helperStrip(stage,e.detail.correct?'celebrate':'not-yet',e.detail.correct?'That is correct. Each branch weight matters.':'Check the full route: multiply for AND. Add only across different winning routes.');if(e.detail.correct){let svg=stage.querySelector('svg.f177-plot');if(svg)M.flash(svg,310,220,'result',64);}});api.onCleanup(off);
}
const DEF={id:'F17-07',title:'Tree Diagram Builder',config:CFG,steps,render:renderStep,alt:'Premium NOVA Neon + Chalk probability tree. Every branch carries a probability; path chances multiply and independent favourable outcomes are added.',staticAlt:'Tree branches record first and second independent-event probabilities. Multiply along a path; add the probabilities of favourable distinct paths. Probabilities from any node sum to one.',exploreIntro:'Choose an experiment, trace the weighted branches and drag a marker onto favourable outcomes.',explore,challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-07',DEF,{models:{"state":()=>state},tables:{"steps":()=>steps},draws:{"render":["stage","p","m","o"]},exploreFields:{"p":{"kind":"value","factory":null,"argCount":null},"m":{"kind":"factory","factory":"state","argCount":0},"renderStep.m":{"kind":"factory","factory":"state","argCount":0}}});
NOVA.bankMount({id:'F17-07',num:'F17·07',title:'Tree Diagram Builder',def:DEF,years:'KS3 Years 7–9; GCSE independent event trees.',linked:['F0-02','F0-03','F0-04','F17-05','F17-06','F17-08'],spec:{purpose:'Build two-stage independent probability trees, multiply along paths and add mutually exclusive winning paths.',params:'Branch probabilities as exact fractions with complement totals one; two or three branches at second stage; marked endpoints; adjustable independent weights in Y9 preset.',presets:'Y7-075 Two fair coins, Y8-071 Biased independent spins, Y9-043 Parity and colour, Y9-045 Independent A and B.',steps:'Identify events → check first branch weights → expand second branches → multiply paths → add favourable paths → validate total probability one.',interactions:'Original F0 four-mode shell, NOVA neon branch primitives, svgDrag token and placed rings, snap and re-grab/remove, keyboard selection, exact fraction calculations.',traps:'Adding along one path, failing to include repeated event, wrong denominator for biased probabilities, treating independent branches as conditional, double counting outcomes.',gcse:'Probabilistic AND/OR reasoning, independent events, weighted trees and complement checks.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5200);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);document.getElementById('clearlog')?.addEventListener('click',()=>log.textContent='');}
})();
