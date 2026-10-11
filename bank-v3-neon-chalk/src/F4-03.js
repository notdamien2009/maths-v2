/* NOVA F4-03 · Cuisenaire-Rod Builder · Run 03 Premium Review.
   Canonical F0/F2 core, unchanged. All diagram shapes and maths use NOVA drawing helpers. */
const F403_CONFIG={
 id:'F4-03',startMode:'watch',preset:'Y7-019',
 parameters:{minRod:1,maxRod:10,maxTrainUnits:10,unitPixels:76},
 presets:{
 'Y7-019':{label:'Year 7 · Equal partitions of a whole',a:[6],b:[2,2,2],prompt:'A six-unit whole equals three equal two-unit parts.'},
 'five':{label:'Five in two different ways',a:[5],b:[2,3],prompt:'Two plus three makes the same length as five.'},
 'ten':{label:'Ten made from two and five',a:[10],b:[5,5],prompt:'Two five-unit rods match one ten-unit rod.'},
 'fraction':{label:'One half by matching lengths',a:[5,5],b:[2,3],prompt:'The shorter five-unit train is half as long as the ten-unit train.'}
 },
 challenge:[
 {title:'Three equal parts',context:'Top: make 6 with one rod. Bottom: make the same 6 with THREE equal rods.',a:6,b:6,kind:'three-equal'},
 {title:'Different ways to make eight',context:'Top: make 8 with TWO different rods. Bottom: match it with a SINGLE 8 rod.',a:8,b:8,kind:'two-different'},
 {title:'Exactly one half',context:'Bottom: build 10. Top: build HALF its length using at least TWO rods.',a:5,b:10,kind:'half'}
 ],
 events:{value:['preset','activeTrain','rodAdd','rodMove','rodRemove','rodOrder','reset','proof','answer'],types:['step','correct','hintUsed','mode']}
};window.F403_CONFIG=F403_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F403_CONFIG,ID=C.id;
const W=1100,T={x:177,w:760,unit:76,a:225,b:416,h:91},TRAY={left:71,gap:194,y1:675,y2:834,w:174,h:144},RET={x:448,y:1002,w:210,h:103};
const ROLES=['given','focus','op','support','unknown','result','focus','given','op','support','result'];
const rRole=n=>ROLES[n];
const total=a=>a.reduce((s,r)=>s+(typeof r==='number'?r:r.n),0);
const lengths=a=>a.map(r=>typeof r==='number'?r:r.n);
const equal=(a,b)=>total(a)===total(b);
const within=(a,n=0)=>Number.isInteger(n)&&total(a)+n<=C.parameters.maxTrainUnits;
const asTrain=a=>a.map((n,i)=>({id:i+1,n}));
function checkTask(ch,s){
 const a=lengths(s.a),b=lengths(s.b),ta=total(a),tb=total(b);
 if(ta!==ch.a||tb!==ch.b)return {ok:false,text:ch.kind==='half'?`Bottom must be ten units and top exactly half as long. Your lengths: A = ${ta}, B = ${tb}.`:`Measure both trains. A must be ${ch.a} units and B ${ch.b} units. Right now: A = ${ta}, B = ${tb}.`};
 if(ch.kind==='three-equal'&&(a.length!==1||b.length!==3||!b.every(n=>n===b[0])))return {ok:false,text:'The whole needs one rod; below, use three rods of EQUAL length.'};
 if(ch.kind==='two-different'&&(a.length!==2||a[0]===a[1]||b.length!==1||b[0]!==8))return {ok:false,text:'Top: two rods with different lengths. Bottom: a single eight-unit rod.'};
 if(ch.kind==='half'&&(a.length<2||tb!==2*ta))return {ok:false,text:'The five-unit top train must use at least two rods and measure half of the bottom train.'};
 return {ok:true,text:ch.kind==='half'?'Ten is twice five: the shorter train is one half of the longer.':ch.kind==='three-equal'?'Two + two + two equals six: three equal parts fit the whole.':'Two different pieces can equal a single eight-unit rod.'};
}
function hintTask(ch,s){if(ch.kind==='three-equal')return 'Try a six-unit rod above. Which rod fits exactly THREE times below it?';if(ch.kind==='two-different')return 'Choose two different lengths that add to eight. Use one eight below.';return 'Half of ten is five. Which two rods can make five?';}
function emit(key,value){if(!C.events.value.includes(key))throw Error(ID+' unknown event '+key);N.events.emit('value',{engine:ID,key,value});}
function b(text,fn,primary){return H('button',{class:primary?'nova-btn primary':'nova-btn',text,onclick:fn});}
function chalk(p,x,y,v,size=49,role='given'){return N.chalkText(p,x,y,String(v),{role,size});}
function drag(svg,el,opt){N.ui.svgDrag(svg,el,opt);el.addEventListener('pointerdown',e=>{if(N.ui._drag?.el===el){try{el.setPointerCapture(e.pointerId);}catch(_){}}});return el;}
function mascot(stage,step){const M={start:['explain','Make a whole!'],whole:['show-one','Here is six!'],part:['count','One part is two!'],build:['count','Keep building!'],finish:['celebrate','The ends line up!'],relate:['idea','Three equal parts!'],explore:['point','Try new trains!'],choose:['think','Pick a rod!'],placed:['point','Snap it in!'],moved:['ruler','Same length, new place!'],remove:['oops','Try another!'],wrong:['not-yet','Check the lengths!'],right:['celebrate','Perfect match!'],reset:['explain','Start fresh!'],hint:['idea','Look at the units!']};const z=M[step]||M.choose;N.scene.helperStrip(stage,z[0],z[1]);}
function srcZone(){return [{id:'return',kind:'remove',...RET}];}
function zones(s,from=null){const z=[];
 for(const lane of ['a','b']){
  const dest=s[lane],hasSelf=from?.lane===lane;
  if(total(dest)+(hasSelf?0:from?.n||0)>10)continue;
  for(let k=0;k<10;k++)z.push({kind:'drop',id:`${lane}:${k}`,x:T.x+k*T.unit,y:T[lane]-34,w:T.unit+1,h:T.h+72});
 }
 return z.concat(srcZone());
}
function insertionIndex(a,unit){let acc=0;for(let i=0;i<a.length;i++){const len=a[i].n;if(unit<acc+len/2)return i;acc+=len;}return a.length;}
function caps(side,heading,value,note,role){return N.neonCard([H('p',{class:'f403-side-label',text:heading}),H('div',{class:'f403-side-value',text:value}),H('p',{class:'f403-side-note',text:note})],{role});}
function trackDrawing(svg,lane,list,o){const y=T[lane],sum=total(list),left=T.x,end=left+sum*T.unit;
 chalk(svg,102,y+57,lane.toUpperCase(),61,lane==='a'?'given':'op');
 // A one-unit snap grid from the approved F0 svg.grid helper, not a handmade number line.
 N.svg.grid(svg,left,y-8,T.w,T.h+17,T.unit);
 N.neonLine(svg,left-10,y+T.h+16,left+T.w+12,y+T.h+16,{role:lane==='a'?'given':'op',width:3});
 N.neonRing(svg,left-6,y+T.h+16,{role:'given',r:7,pulse:false});
 if(o.target){const target=o.target[lane];N.svg.pill(svg,left+T.w-66,y-42,'TARGET '+(o.task?.kind==='half'&&lane==='a'?'?':target),{role:'unknown',size:25});}
 else chalk(svg,left+T.w-85,y-38,sum+' UNITS',37,lane==='a'?'given':'op');
 let used=0;
 for(const r of list){const x=T.x+used*T.unit,w=r.n*T.unit,group=E('g',{class:'f403-rod','data-lane':lane,'data-length':r.n,'data-id':r.id,'aria-label':'Train '+lane.toUpperCase()+' rod length '+r.n,role:o.interactive?'button':'img',tabindex:o.interactive?0:-1},svg);
  const plate=N.neonBox(group,x+3,y+4,w-6,T.h-8,{role:rRole(r.n),r:15});
  chalk(group,x+w/2,y+63,r.n,Math.min(w<90?59:67,67),rRole(r.n));
  // Mathematical marking: the given length, plus a tactile boundary at every rod end.
  N.neonLine(group,x+w-3,y+12,x+w-3,y+T.h-8,{role:'given',width:2.7});
  if(o.interactive){const from={lane,id:r.id,n:r.n};drag(svg,group,{box:{x:x+3,y:y+4,w:w-6,h:T.h-8},zones:()=>zones(o.s,from),onDrop:dest=>{if(dest==='return')return false;Promise.resolve().then(()=>o.onMove(from,dest));return true;},onRemove:()=>o.onRemove(lane,r.id),removeTo:{x:RET.x+RET.w/2,y:RET.y+RET.h/2}});
   group.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();o.onRemove(lane,r.id);}else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();o.onReorder(lane,r.id,e.key==='ArrowLeft'?-1:1);}else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();o.onSwitch(lane,r.id);}});
  }
  if(o.animated&&o.fresh===r.id)N.motion.arrive(plate,-32,0);
  used+=r.n;
 }
 return end;
}
function mainSvg(s,o){const svg=N.svg.root(W,o.interactive?1190:o.step>=6?925:840,'Two ten-unit tracks accept Cuisenaire rods. Each rod is labelled by its length, and matching train endpoints prove equal lengths.');svg.classList.add('f403-svg');svg.dataset.a=String(total(s.a));svg.dataset.b=String(total(s.b));svg.dataset.rodsA=lengths(s.a).join('+');svg.dataset.rodsB=lengths(s.b).join('+');
 const ta=total(s.a),tb=total(s.b);
 chalk(svg,550,74,o.interactive?'BUILD AND COMPARE LENGTHS':'SAME WHOLE · DIFFERENT PARTS',49,'given');
 chalk(svg,548,134,'EACH SQUARE MARKS ONE UNIT',38,'op');
 const ea=trackDrawing(svg,'a',s.a,{...o,s}),eb=trackDrawing(svg,'b',s.b,{...o,s});
 const relationship=o.interactive?ta&&tb?ta===tb?'MATCHING LENGTHS':ta*2===tb?'A IS HALF OF B':tb*2===ta?'B IS HALF OF A':'COMPARE THE ENDS':'BUILD TWO TRAINS':o.step>=5?'EQUAL ENDPOINTS · EQUAL LENGTHS':'WATCH THE SECOND TRAIN GROW';
 if(ta&&tb&&ta===tb){N.neonLine(svg,ea,T.a-4,eb,T.b+T.h+4,{role:o.won?'result':'focus',width:3});if(o.won||(!o.interactive&&o.step>=5))N.neonRing(svg,ea,350,{role:'result',r:13});}
 else if(ta&&tb){N.neonRing(svg,ea,351,{role:'given',r:9});N.neonRing(svg,eb,351,{role:'op',r:9});}
 chalk(svg,550,565,relationship,43,ta===tb&&ta>0?'result':'focus');
 if(!o.interactive&&o.step===6){N.svg.brace(svg,T.x,T.b+T.h+122,T.x+2*T.unit,T.b+T.h+122,{role:'unknown',depth:15});chalk(svg,550,696,'ONE OF THREE EQUAL PARTS',40,'unknown');}
 if(o.interactive){chalk(svg,550,641,'CHOOSE A ROD · SNAP IT INTO A TRAIN',39,'given');
   for(let i=0;i<=9;i++){const n=i+1,col=i%5,row=i>=5?1:0,x=TRAY.left+col*TRAY.gap,y=row?TRAY.y2:TRAY.y1;
    const g=E('g',{class:'f403-rod f403-tray','data-length':n,role:'button',tabindex:0,'aria-label':'Add rod '+n+' units to active train'},svg);
    N.neonBox(g,x,y,TRAY.w,TRAY.h,{role:rRole(n),r:15});
    N.neonBox(g,x+11,y+41,n*12.7,59,{role:rRole(n),r:8});
    chalk(g,x+151,y+88,n,n===10?39:52,rRole(n));
    drag(svg,g,{box:{x,y,w:TRAY.w,h:TRAY.h},zones:()=>zones(s,{n}),onDrop:id=>{if(id==='return')return false;Promise.resolve().then(()=>o.onAdd(n,id));return true;}});
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.onAdd(n,o.active+':10');}});
   }
   N.neonBox(svg,RET.x,RET.y,RET.w,RET.h,{role:'error',r:11,text:'RETURN ROD',size:36});
   chalk(svg,550,1150,'DRAG HERE TO REMOVE',33,'error');
 } else if(o.step>=5){
    chalk(svg,550,o.step>=6?782:715,`${ta} UNITS = ${tb} UNITS`,55,'result');
    if(o.step>=6)chalk(svg,550,866,'THREE PARTS OF TWO MAKE SIX',41,'unknown');
 }
 return svg;}
function present(stage,s,o){stage.innerHTML='';N.cap(stage,'Cuisenaire Rods',o.challenge?'CHALLENGE':o.interactive?'BUILD & EXPLORE':o.subtitle||'Equal length · different partitions');
 const layout=H('div',{class:'f403-layout'}),apparatus=H('div',{class:'f403-apparatus'}),side=H('aside',{class:'f403-side','aria-label':'Train length evidence'});
 apparatus.append(mainSvg(s,o));const a=total(s.a),bTotal=total(s.b);
 side.append(caps(side,'TRAIN A',a+' units',s.a.length?lengths(s.a).join(' + '):'Empty · choose a rod','given'),caps(side,'TRAIN B',bTotal+' units',s.b.length?lengths(s.b).join(' + '):'Empty · choose a rod','op'),caps(side,'RELATION',a&&bTotal?a===bTotal?'EQUAL':a*2===bTotal?'HALF':bTotal*2===a?'B IS HALF':'NOT YET':'?',a&&bTotal?a===bTotal?'The ends align.':'Compare both lengths.':'Build both trains.','result'));
 layout.append(apparatus,side);stage.append(layout);if(!o.interactive&&o.step===6&&!o.won){const fraction=H('div',{class:'f403-fraction-equation'});fraction.append(N.mt.render('\\frac{2}{6}=\\frac{1}{3}'));stage.append(fraction);}if(o.won)stage.append(H('p',{class:'f403-proof',text:o.proof||'Lengths proven.'}));mascot(stage,o.pose||'choose');}
function watchScene(i){const snaps=[{a:[],b:[]},{a:[6],b:[]},{a:[6],b:[2]},{a:[6],b:[2,2]},{a:[6],b:[2,2,2]},{a:[6],b:[2,2,2]},{a:[6],b:[2,2,2]}];return {a:asTrain(snaps[i].a),b:asTrain(snaps[i].b)};}
let seq=100;
function live(panel,stage,task,api){let s={a:[],b:[]},active='a',message=task?'Make the stated lengths and arrangement. Then prove they match.':'Choose a rod in the bottom tray; drag it onto A or B.',state='explore',won=false,attempts=0,lastProof='';
 const done=()=>({a:lengths(s.a),b:lengths(s.b),ta:total(s.a),tb:total(s.b),won,attempts,active});
 function useAdd(n,id){if(won)return false;const [lane,k]=id.split(':');const index=Number(k);if(!['a','b'].includes(lane)||!Number.isInteger(n)||n<1||n>10||!within(s[lane],n))return false;
  const at=insertionIndex(s[lane],index);s[lane].splice(at,0,{id:++seq,n});active=lane;emit('rodAdd',{lane,length:n,at});redraw(`Snapped a ${n}-unit rod into Train ${lane.toUpperCase()}.`,'placed');return true;}
 function useMove(source,id){if(won)return false;const [dest,k]=id.split(':');if(!['a','b'].includes(dest))return false;const orig=s[source.lane],i=orig.findIndex(r=>r.id===source.id);if(i<0)return false;const v=orig[i];if(source.lane!==dest&&!within(s[dest],v.n))return false;
  orig.splice(i,1);let at=insertionIndex(s[dest],Number(k));s[dest].splice(at,0,v);active=dest;emit('rodMove',{from:source.lane,to:dest,length:v.n,at});redraw(`Moved the ${v.n}-unit rod. Check the length again.`,'moved');return true;}
 function remove(lane,id){if(won)return;const i=s[lane].findIndex(r=>r.id===id);if(i===-1)return;const n=s[lane].splice(i,1)[0].n;emit('rodRemove',{lane,length:n});redraw('Rod returned to the tray. Choose another length.','remove');}
 function reorder(lane,id,delta){if(won)return;const arr=s[lane],i=arr.findIndex(x=>x.id===id);if(i<0)return;const to=Math.max(0,Math.min(arr.length-1,i+delta));if(i!==to)arr.splice(to,0,arr.splice(i,1)[0]);emit('rodOrder',{lane,id,index:to});redraw('Rod order changed. The total length stays the same.','moved');}
 function switchLane(lane,id){if(won)return;const arr=s[lane],i=arr.findIndex(r=>r.id===id);if(i<0)return;const n=arr[i].n,to=lane==='a'?'b':'a';if(!within(s[to],n)){redraw('That rod would take Train '+to.toUpperCase()+' beyond ten units.','wrong');return;}useMove({lane,id},to+':10');}
 function changeActive(v){active=v;emit('activeTrain',v);redraw('Adding rods to Train '+v.toUpperCase()+'.','choose');}
 function reset(){s={a:[],b:[]};won=false;attempts=0;emit('reset',true);redraw('Both trains are empty. Build them again.','reset');}
 function hint(){const v=task?hintTask(task,s):'Each small grid square is one unit. Add the rod lengths to compare both endpoints.';api?.hint(v);redraw(v,'hint');}
 function check(){attempts++;emit('answer',{a:lengths(s.a),b:lengths(s.b)});
  const result=task?checkTask(task,s):{ok:total(s.a)>0&&total(s.a)===total(s.b),text:total(s.a)===total(s.b)&&total(s.a)>0?'Both trains have exactly the same length. Different parts can make the same whole.':'Both trains need a positive length and their right ends must align.'};
  if(!result.ok){api?.check(false,result.text);redraw(result.text,'wrong');return false;}
  won=true;lastProof=result.text;emit('proof',{a:lengths(s.a),b:lengths(s.b),correct:true});api?.check(true,result.text);redraw(result.text,'right');return true;}
 function redraw(m,p){message=m;state=p;render();}
 function render(){panel.innerHTML='';present(stage,s,{interactive:!won,won,challenge:!!task,pose:state,active,proof:lastProof,task,target:task?{a:task.a,b:task.b}:null,onAdd:useAdd,onMove:useMove,onRemove:remove,onReorder:reorder,onSwitch:switchLane});
  if(!task){const preset=H('select',{'aria-label':'Rod comparison preset'});Object.entries(C.presets).forEach(([key,v])=>preset.add(new Option(v.label,key)));preset.value=C.preset;preset.onchange=()=>{C.preset=preset.value;const pp=C.presets[C.preset];s={a:asTrain(pp.a),b:asTrain(pp.b)};redraw(pp.prompt,'choose');emit('preset',C.preset);};panel.append(H('label',{class:'f403-field'},['Try a preset',preset]));}
  panel.append(H('p',{class:'f403-prompt',text:task?task.context:'Build two trains up to 10 units each. Can you make the ends align?'}));
  if(!won){const row=H('div',{class:'f403-controls'}),radioA=H('label',{class:'f403-choice'},[H('input',{type:'radio',name:'f403-active',value:'a',checked:active==='a',onchange:()=>changeActive('a')}),'Add to A']),radioB=H('label',{class:'f403-choice'},[H('input',{type:'radio',name:'f403-active',value:'b',checked:active==='b',onchange:()=>changeActive('b')}),'Add to B']);
   const choice=H('select',{'aria-label':'Choose rod length'});for(let n=1;n<=10;n++)choice.add(new Option(n+' units',String(n)));choice.value='2';const fld=H('label',{class:'f403-field'},['Rod length',choice]);radioA.querySelector('input').checked=active==='a';radioB.querySelector('input').checked=active==='b';row.append(radioA,radioB,fld,b('Add rod',()=>useAdd(Number(choice.value),active+':10')),b('Check',check,true),b('Hint',hint),b('Reset trains',reset));panel.append(row);
  }else panel.append(H('div',{class:'f403-controls'},[H('span',{class:'f403-proof',text:'Length relationship proved!'}),...(!task?[b('Build again',reset)]:[])]));
  panel.append(H('p',{class:'f403-help',text:'Drag a numbered rod from the tray into either track. Drag built rods to reorder or move them. Return a rod to the red zone, or use Delete, arrows and Add rod.'}));
  panel.append(H('p',{class:'f403-status'+(state==='wrong'?' bad':state==='right'?' good':''),role:'status',text:message}));
 }
 render();return {getState:done,useAdd,useMove,remove,reorder,switchLane,check,reset};
}
const STEPS=[
 {name:'What is one whole?',narration:'A Cuisenaire rod represents a length. Count the equal unit spaces on the track to measure it.',prompt:'What does one grid square represent?'},
 {name:'A whole rod of six',narration:'This rod covers six equal unit spaces. The full length is our whole.',prompt:'How long is the upper rod?'},
 {name:'First smaller part',narration:'This shorter rod covers two spaces. It is one part of the same whole.',prompt:'Could several of these fit?'},
 {name:'Build another equal part',narration:'A second two-unit rod snaps exactly next to the first. That makes four units so far.',prompt:'How many more units are needed?'},
 {name:'Complete the train',narration:'A third two-unit rod fits the remaining gap. Two plus two plus two equals six.',prompt:'Count the equal parts.'},
 {name:'Equal lengths, different parts',narration:'Both trains end at the same unit. Their lengths are equal, even though one uses one rod and the other uses three.',prompt:'Do the right ends line up?'},
 {name:'Name the fraction relationship',narration:'Each two-unit rod is one of three equal parts of the six-unit whole. That means each is one third of the whole.',prompt:'Why must the three parts be equal?'}
];
const watchPose=['start','whole','part','build','build','finish','relate'];
const def={id:ID,title:'Cuisenaire-Rod Builder',config:C,steps:STEPS,alt:'Two measured rod trains align on a shared unit grid. Three two-unit rods match one six-unit rod; the fraction relation is one third.',staticAlt:'6 units = 2 + 2 + 2 units; each rod is one of three equal parts.',
 render(i,stage){present(stage,watchScene(i),{step:i,interactive:false,subtitle:STEPS[i].name,pose:watchPose[i],animated:true});},
 exploreIntro:'Build, drag, compare, and check equal lengths.',
 explore(panel,stage){live(panel,stage,null,null);},
 challenge(panel,api,stage){let index=0;function next(){panel.innerHTML='';if(index>=C.challenge.length){present(stage,{a:asTrain([5]),b:asTrain([10])},{interactive:false,step:6,won:true,pose:'right',subtitle:'All three challenges complete',proof:'Equal trains, different partitions and one-half relationship proven.'});panel.append(H('p',{class:'f403-finish',text:'You have built equal lengths, used different partitions and proved one-half with real unit lengths.'}));return;}
  let ch=C.challenge[index],wrap=H('div');panel.append(H('p',{class:'f403-progress',text:`Problem ${index+1} of ${C.challenge.length} · ${ch.title}`}),wrap);
  const remote={hint:msg=>api.hint(msg),check:(ok,msg)=>{api.check(ok,msg,{task:index+1});if(ok)Promise.resolve().then(()=>wrap.append(H('div',{class:'f403-next'},[b('Next problem →',()=>{index++;next();},true)])));}};live(wrap,stage,ch,remote);
 }next();}
};
N.registry.add({id:ID,title:'Cuisenaire-Rod Builder',topics:['fractions','equivalent lengths','composition','part-whole'],deps:['F0-01','F0-02','F0-08','F0-13']});
N.bankMount({id:ID,num:'03',title:'Cuisenaire Rods · Run 03 Review',def,years:'Year 7 · Fractions as numbers; supports Years 8–9 proportion and equivalence.',linked:['F4-01','F4-02','F5-01','F5-11'],spec:{purpose:'Prove equivalence, composition, and fractions as equal partitions through measured rod trains.',params:'Rod lengths 1–10, unit snap grid, up to 10 whole units per track; two trains; keyboard reordering and removal.',presets:'Y7-019: six = two+two+two. Five = two+three. Ten = five+five. Five is half of ten.',steps:'Show unit track → reveal whole rod → construct repeated equal parts → align endpoints → generalise fraction.',interactions:'Drag from tray onto either rail, reorder/switch built rods, drop into red return zone, keyboard Add/Delete/arrows, Explore presets and three checked challenges.',traps:'Assuming larger number of rods means longer total; unequal unit lengths; mistaking one third for one of two parts; confusing matching length with identical rod count.',gcse:'Equal partitions and fractional multiples; gateway to equivalent fractions and ratios.'}});
window.F403_MATH={total,lengths,equal,within,checkTask,hintTask,insertionIndex,asTrain};
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(el=>dev.append(el));card.append(dev);
card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.alt='NOVA maths helper';});
})();
