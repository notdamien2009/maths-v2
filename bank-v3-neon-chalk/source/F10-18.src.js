/* NOVA Maths F10-18 · Piecewise & Non-standard Graph Builder · F0 core, F10 single-board */
const F118_CONFIG=Object.freeze({
 id:'F10-18',family:'F10',startMode:'watch',defaultPreset:'Y9-015',
 bounds:{x:[0,8],y:[0,8],grid:1},
 presets:{
 'Y9-015':{label:'Y9-015 · Rise / flat / fall',context:'A cyclist travels, rests, then returns towards the starting point.',kind:'continuous',nodes:[['A',0,1,1],['B',3,5,1],['C',5,5,1],['D',8,2,1]],edges:[['A','B'],['B','C'],['C','D']]},
 'Y9-015-JOURNEY':{label:'Y9-015 · Journey graph',context:'The distance rises during travel, stays fixed while resting, and then reduces on the return.',kind:'continuous',nodes:[['A',0,0,1],['B',2,6,1],['C',5,6,1],['D',8,0,1]],edges:[['A','B'],['B','C'],['C','D']]},
 'Y9-015-CHARGE':{label:'Y9-015 · Changing charges',context:'A starting charge, a rising price, a period without extra cost, and a later increase.',kind:'continuous',nodes:[['A',0,2,1],['B',3,5,1],['C',5,5,1],['D',8,8,1]],edges:[['A','B'],['B','C'],['C','D']]},
 'Y9-015-V':{label:'Y9-015 · V-shaped rule',context:'The quantity falls to a turning point then rises: one graph, two straight-line rules.',kind:'continuous',nodes:[['A',0,7,1],['B',4,1,1],['C',8,7,1]],edges:[['A','B'],['B','C']]},
 'Y9-015-STEP':{label:'Y9-015 · Step change',context:'A value stays at two up to a change, then jumps to five. The filled endpoint determines the exact value at the join.',kind:'jump',nodes:[['A',0,2,1],['B',3,2,0],['C',3,5,1],['D',8,5,1]],edges:[['A','B'],['C','D']]},
 'Y9-015-JUMP':{label:'Y9-015 · Two-rule jump',context:'Before the change the value is increasing; at the change it switches to a lower starting value.',kind:'jump',nodes:[['A',0,1,1],['B',4,5,0],['C',4,2,1],['D',8,6,1]],edges:[['A','B'],['C','D']]},
 'GCSE-OPEN':{label:'GCSE EXT · Open and closed limits',context:'A line can approach one value without including its endpoint. The filled dot is the actual value at the boundary.',kind:'jump',nodes:[['A',0,2,1],['B',4,6,0],['C',4,3,1],['D',8,7,1]],edges:[['A','B'],['C','D']]}
 },events:{value:['preset','node','readX','card','reset','challengeValue'],types:['step','mode','correct','hintUsed']}
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F118_CONFIG,ID=C.id;
N.premium?.enable?.();
const S={preset:C.defaultPreset,nodes:[],edges:[],selected:'B',readX:3,showReading:true,correct:false,attempt:0,selectedRule:null,feedback:'',mode:'watch',showSolution:false};
const mobile=()=>matchMedia('(max-width:760px)').matches;
const fmt=n=>String(Math.round(n*100)/100).replaceAll('-','−');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const emit=(k,v)=>N.events.emit('value',{engine:ID,key:k,value:v});
function setPreset(id=C.defaultPreset,announce=true){const p=C.presets[id]||C.presets[C.defaultPreset];S.preset=C.presets[id]?id:C.defaultPreset;S.nodes=p.nodes.map(([key,x,y,closed])=>({key,x,y,closed:!!closed}));S.edges=p.edges.map(e=>e.slice());S.selected=S.nodes[1]?.key||S.nodes[0].key;S.readX=p.kind==='jump'?(S.nodes[1].x):3;S.correct=false;S.showSolution=false;S.selectedRule=null;S.feedback='';if(announce)emit('preset',S.preset)}
const preset=()=>C.presets[S.preset];
const node=id=>S.nodes.find(n=>n.key===id);
const nodeIndex=id=>S.nodes.findIndex(n=>n.key===id);
const seg=(i)=>{const e=S.edges[i];return e?[node(e[0]),node(e[1])]:null};
const slope=(a,b)=>(b.y-a.y)/(b.x-a.x);
function readAt(x){const exact=S.nodes.filter(n=>n.x===x&&n.closed);if(exact.length)return exact[exact.length-1].y;
 for(let i=0;i<S.edges.length;i++){const [a,b]=seg(i);if(x>a.x&&x<b.x){return a.y+(x-a.x)*slope(a,b)}}return null}
function meaning(i){const q=seg(i);if(!q)return 'No segment';const m=slope(...q);return Math.abs(m)<1e-9?'STAYS LEVEL':m>0?'INCREASES':'DECREASES'}
function exactSlope(m){
 const d2=Math.round(m*100)/100;if(Math.abs(m-d2)<1e-9)return fmt(m);
 for(let d=2;d<=8;d++){const n=Math.round(m*d);if(Math.abs(m-n/d)<1e-9)return '('+fmt(n)+' ÷ '+d+')'}
 return '≈ '+fmt(m)
}
function equation(i){const q=seg(i);if(!q)return '—';const [a,b]=q,m=slope(a,b),c=a.y-m*a.x;
 let coefficient=m===1?'':m===-1?'−':exactSlope(m);
 let rule=m===0?fmt(c):(coefficient+'x'+(Math.abs(c)<1e-9?'':c>0?' + '+fmt(c):' − '+fmt(-c)));
 return 'y = '+rule}

const GEO={w:820,h:715,left:112,top:75,plotW:624,plotH:526,xlo:0,xhi:8,ylo:0,yhi:8};
const XY=(x,y)=>[GEO.left+(x-GEO.xlo)*GEO.plotW/8,GEO.top+(GEO.yhi-y)*GEO.plotH/8];
const EXY=(p)=>XY(p.x,p.y);
function chalk(svg,x,y,text,role='support',size=32,anchor='start'){return N.chalkText(svg,x,y,String(text),{size,role,anchor})}
function line(svg,a,b,role='focus',width=5,dash){return N.neonPath(svg,'M'+a.map(v=>v.toFixed(2)).join(',')+'L'+b.map(v=>v.toFixed(2)).join(','),{role,width,dash})}
const COLORS=['focus','op','result','unknown'];
function drawBoard(opt){const {phase=9,interactive=false,challenge=false,correct=false,hideAnswers=false}=opt;
 const svg=N.svg.root(GEO.w,GEO.h,'NOVA piecewise graph on coordinate axes. Each coloured neon segment has a distinct gradient, and open or filled markers show endpoint membership.');svg.classList.add('nv-svg','f118-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f118-grid';svg.setAttribute('viewBox','30 1 766 710');
 let frame={x0:GEO.left,y0:GEO.top,w:GEO.plotW,h:GEO.plotH,x:[0,8],y:[0,8],xStep:1,yStep:1};const grid=N.neonPlot(svg,frame);grid?.g?.classList.add('f118-grid');grid?.g?.querySelectorAll('text').forEach(t=>t.remove());
 const ax=N.svg.axes(svg,{x:GEO.left,y:GEO.top,w:GEO.plotW,h:GEO.plotH,xmin:0,xmax:8,ymin:0,ymax:8,ticks:1});ax?.g?.classList.add('f118-grid');ax?.g?.querySelectorAll('text').forEach(t=>t.remove());
 for(let x=0;x<=8;x+=1){const [xx]=XY(x,0);chalk(svg,xx,GEO.top+GEO.plotH+39,fmt(x),'support',34,'middle')}
 for(let y=0;y<=8;y++){const [,yy]=XY(0,y);chalk(svg,GEO.left-25,yy+10,fmt(y),'support',34,'end')}
 chalk(svg,GEO.left+GEO.plotW/2,GEO.top+GEO.plotH+93,'INPUT • x','op',39,'middle');chalk(svg,GEO.left+6,GEO.top-33,'OUTPUT • y','op',39);
 const defs=E('defs',{},svg);const clip=E('clipPath',{id:'f118-clip'},defs);E('rect',{x:GEO.left,y:GEO.top,width:GEO.plotW,height:GEO.plotH},clip);
 const ink=E('g',{'clip-path':'url(#f118-clip)'},svg);
 const count=phase===0?0:phase===1?1:phase===2?2:phase===3?3:S.edges.length;
 for(let i=0;i<Math.min(count,S.edges.length);i++){
 const [a,b]=seg(i);const role=COLORS[i%COLORS.length];const la=EXY(a),lb=EXY(b);
 // Halo and glass-like depth are supplied by the F0 neonPath helper.
 const stroke=line(ink,la,lb,role,7);stroke.classList.add('f118-graph-edge');stroke.dataset.edge=String(i);
 if((phase===1&&i===0)||(phase===2&&i===1)||(phase>=3&&i===2)){
  if(!N.reducedMotion()){try{N.motion.trail(svg,stroke,role,530)}catch(_){}}
 }
 if(phase>=5||interactive||challenge){let mp=XY((a.x+b.x)/2,(a.y+b.y)/2),value=hideAnswers?'m = ?':Math.abs(slope(a,b))<1e-8?'flat · 0':'m = '+exactSlope(slope(a,b));chalk(svg,mp[0]+(Math.abs(slope(a,b))<1e-8?0:i===0?-23:-8),mp[1]-(Math.abs(slope(a,b))<1e-8?31:82),value,role,32,'middle')}
 }
 if(phase>=1||interactive||challenge){
   const visibleNodes=new Set();for(let i=0;i<Math.min(count,S.edges.length);i++){S.edges[i].forEach(k=>visibleNodes.add(k))}
   for(const p of S.nodes){if(!visibleNodes.has(p.key))continue;const [x,y]=EXY(p),role=p.closed?'result':'unknown';
     N.neonRing(ink,x,y,{r:10,role,pulse:correct});
     if(p.closed){E('circle',{cx:x,cy:y,r:6,fill:'#6ef0bb',stroke:'#d4fff5','stroke-width':1.5},ink)}
     else E('circle',{cx:x,cy:y,r:7,fill:'#08172d',stroke:'#ffd179','stroke-width':3.5},ink);
     if((interactive||phase>=6)&&(!hideAnswers||!challenge)){chalk(svg,x+({B:-20,D:-18}[p.key]??16),y+(p.key==='B'?-45:p.y>6?36:-20),p.key+'('+fmt(p.x)+', '+fmt(p.y)+')',p.closed?'result':'unknown',29,['B','D'].includes(p.key)?'end':'start')}
     if(interactive){const hit=E('g',{class:'f118-handle','data-testid':'f118-handle-'+p.key,tabindex:'0',role:'button','aria-label':'Drag point '+p.key+' to adjust its coordinates. Arrow keys also work.','aria-keyshortcuts':'ArrowLeft ArrowRight ArrowUp ArrowDown'},svg);
       E('circle',{cx:x,cy:y,r:27,fill:'rgba(255,204,95,.13)'},hit);N.neonRing(hit,x,y,{r:15,role:p.key===S.selected?'unknown':'focus'});
       if(!p.closed)E('circle',{cx:x,cy:y,r:8,fill:'#09172a',stroke:'#ffd179','stroke-width':3.5},hit);
       E('circle',{cx:x,cy:y,r:25,class:'f118-focus'},hit);
       const apply=(xx,yy,source)=>{moveNode(p.key,xx,yy);emit('node',{id:p.key,x:node(p.key).x,y:node(p.key).y,source});S.selected=p.key;refreshExplore?.();queueMicrotask(()=>document.querySelector('#F10-18 [data-testid="f118-handle-'+p.key+'"]')?.focus({preventScroll:true}))};
       hit.addEventListener('keydown',e=>{if(e.key==='Escape'){N.ui._drag?.cancel?.();return}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();apply(p.x+({'ArrowLeft':-1,'ArrowRight':1}[e.key]||0),p.y+({'ArrowDown':-1,'ArrowUp':1}[e.key]||0),'keyboard')});
       const rangeX=moveRange(p.key),zones=[];for(let xx=rangeX[0];xx<=rangeX[1];xx++){for(let yy=0;yy<=8;yy++){let [zx,zy]=XY(xx,yy);zones.push({id:xx+','+yy,kind:'drop',x:zx-14,y:zy-14,w:28,h:28})}}
       N.ui.svgDrag(svg,hit,{box:{x:x-26,y:y-26,w:52,h:52},zones:()=>zones,onDrop:id=>{const [xx,yy]=id.split(',').map(Number);apply(xx,yy,'pointer');return true}});
     }
   }
 }
 // Marker reading: only show result when it belongs to graph; open endpoints never count.
 if(phase>=7||interactive||challenge){const value=readAt(S.readX),base=XY(S.readX,0),end=XY(S.readX,value??0);
  if(value!==null){const path=N.neonPath(svg,`M${base[0]},${base[1]}L${end[0]},${end[1]}`,{role:'unknown',width:2,dash:'6 7'});path.classList.add('f118-read-guide');N.neonRing(svg,...end,{r:9,role:'unknown'});}
  if(interactive){const [hx,hy]=end;const handle=E('g',{class:'f118-read-handle',tabindex:'0',role:'slider','aria-label':'Move the reading position along the x axis','aria-valuemin':'0','aria-valuemax':'8','aria-valuenow':String(S.readX),'data-testid':'f118-read-handle'},svg);E('circle',{cx:hx,cy:hy,r:22,fill:'rgba(255,203,91,.12)'},handle);N.neonRing(handle,hx,hy,{r:12,role:'unknown'});
    const change=(xx,source)=>{S.readX=clamp(Math.round(xx*2)/2,0,8);emit('readX',{value:S.readX,y:readAt(S.readX),source});refreshExplore?.();queueMicrotask(()=>document.querySelector('#F10-18 [data-testid="f118-read-handle"]')?.focus({preventScroll:true}))};
    handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();change(S.readX+(['ArrowLeft','ArrowDown'].includes(e.key)?-.5:.5),'keyboard')});
    const zones=[];for(let xx=0;xx<=8;xx+=.5){const [zx]=XY(xx,0);zones.push({id:String(xx),kind:'drop',x:zx-15,y:GEO.top,w:30,h:GEO.plotH})}N.ui.svgDrag(svg,handle,{box:{x:hx-21,y:hy-21,w:42,h:42},zones:()=>zones,onDrop:id=>{change(+id,'pointer');return true}});
  }
 }
 return svg
}
function moveRange(key){const p=node(key),i=nodeIndex(key),a=S.nodes;
 if(!p)return [0,8];const group=S.nodes.filter(n=>n.x===p.x),first=Math.min(...group.map(n=>nodeIndex(n.key))),last=Math.max(...group.map(n=>nodeIndex(n.key)));if(first===0||last===a.length-1)return[p.x,p.x];
 const low=a[first-1].x+1,high=a[last+1].x-1;return [Math.min(high,low),Math.max(low,high)]}
function moveNode(id,x,y){const p=node(id);if(!p)return;const [low,high]=moveRange(id),xx=clamp(Math.round(x),low,high);const same=S.nodes.filter(n=>n.x===p.x);if(same.length>1){for(const q of same)q.x=xx}else p.x=xx;p.y=clamp(Math.round(y),0,8)}
function statCard(header,val,note,role='regular'){return H('div',{class:'f118-stat',...(role==='result'?{'data-role':'result'}:{})},[H('div',{class:'f118-stat-label',text:header}),H('div',{class:'f118-stat-val',text:val}),H('div',{class:'f118-stat-note',text:note})])}
function scene(stage,opt={}){
 const q={phase:9,editable:false,challenge:false,correct:false,pose:'explain',caption:'Follow each interval in order. A graph may use more than one rule.',focus:0,...opt};
 stage.replaceChildren();const theatre=H('section',{class:'f118-theatre','data-testid':'f118-theatre'});
 theatre.append(H('div',{class:'f118-topline'},[H('span',{text:'F10 · PIECEWISE GRAPH STUDIO'}),H('span',{class:'f118-brand',text:'NOVA · NEON CHALK'})]));
 const main=H('div',{class:'f118-layout'}),plane=H('div',{class:'f118-plane'});
 plane.append(drawBoard({phase:q.phase,interactive:q.editable,challenge:q.challenge,correct:q.correct,hideAnswers:q.challenge&&!q.correct}));
 let title=q.phase===0?'One grid. More than one rule.':q.phase===1?'First interval · '+meaning(0):q.phase===2?'The rule changes':q.phase===3?'Different interval, different gradient':q.phase>=9&&preset().kind==='jump'?'Check the OPEN and FILLED endpoint':'Read the graph one interval at a time';
 if(q.editable)title='Move the points · watch each segment change';if(q.challenge)title='Study the graph. Explain the evidence.';
 plane.append(H('h3',{class:'f118-chalk-title',text:title}));
 const reading=readAt(S.readX),readText=reading===null?'No value at this x':'('+fmt(S.readX)+', '+fmt(reading)+')';
 let subtitle=q.phase<4?'A new segment can rise, fall, or remain level.':q.phase<7?'Follow the join. Does the rate change or does the graph jump?':q.challenge&&!q.correct?'Read the scale and inspect the interval before answering.':'At x = '+fmt(S.readX)+', the reading is '+readText+'.';
 if(q.editable)subtitle='Open rings exclude an endpoint. Filled rings include it. Read x first, then y.';
 plane.append(H('p',{class:'f118-chalk-sub',text:subtitle}));main.append(plane);
 const info=H('aside',{class:'f118-info','aria-label':'Piecewise graph mathematical evidence'}),p=preset(),hidden=q.challenge&&!q.correct;
 if(q.phase===0&&!q.editable&&!q.challenge){info.append(statCard('HOW TO READ','x → then y','Move horizontally first, then read the height.'))}
 else for(let i=0;i<S.edges.length;i++){
 const [a,b]=seg(i),s=slope(a,b),rule=equation(i),isVisible=q.editable||q.challenge||q.phase>=i+1;
 if(!isVisible)continue;
 let val=hidden?'Find its rule':rule,note='x from '+fmt(a.x)+' to '+fmt(b.x)+' · '+meaning(i).toLowerCase();
 if(q.phase<=i+2&&!q.editable&&!q.challenge){val=meaning(i);note='Look at the direction of this section.'}
 info.append(statCard('SEGMENT '+(i+1),val,note));}
 if(q.phase>=7||q.editable||q.challenge){info.append(statCard('READING AT x = '+fmt(S.readX),hidden?'Find the graph value':readText,reading===null?'An excluded endpoint gives no value here.':'Go up from x until you meet the INCLUDED graph.','result'))}
 if(q.phase>=8||q.editable||q.challenge){const i=Math.min(q.focus,S.edges.length-1);info.append(statCard('KEY IDEA',hidden?'Compare the endpoints':preset().kind==='jump'?'A jump is a real gap.':'At a join, compare the gradients.',preset().kind==='jump'?'A filled point gives the value at the boundary.':'A continuous join does not guarantee a constant gradient.'))}
 main.append(info);theatre.append(main);stage.append(theatre);
 N.scene.helperStrip(stage,q.correct?'cheer':q.pose,q.caption);return stage;
}
const STORY=[
 ['Read the axes','explain','Each graph starts with a horizontal input and a vertical output. Read across first, then up.','Y9-015',0,'Where do we read the input?'],
 ['Build the first section','point','Start at the first point. This section rises steadily as the input increases.','Y9-015',1,'Does the first part rise or fall?'],
 ['Add a new rule','count','The next section is horizontal. The graph stays at the same height even while the input increases.','Y9-015',2,'What is the gradient of a flat line?'],
 ['Finish the journey','point','The last section slopes downwards. A smaller output appears at later inputs.','Y9-015',3,'Does this final section increase or decrease?'],
 ['Follow the entire path','magnify','A piecewise graph can show a different behaviour on each interval. Read each interval separately.','Y9-015',4,'How many separate straight sections can you see?'],
 ['Compare the gradients','count','The first interval rises, the second stays level, and the third falls. The gradients are not all the same.','Y9-015',5,'Which section has gradient zero?'],
 ['Investigate the joins','point','Here the pieces meet exactly. Their endpoints join even though the gradients change.','Y9-015',6,'What does continuous mean at the join?'],
 ['Read a coordinate','magnify','Choose input three. The point at the join has output five. Read across to x then up to y.','Y9-015',7,'At input three, what is the output?'],
 ['Interpret a journey','explain','For a journey, a flat distance-time section means resting. A falling section means coming back towards the start.','Y9-015-JOURNEY',8,'Does a flat distance-time graph mean zero distance?'],
 ['Identify a step jump','point','Now the two pieces do not meet. At the change, one value ends and a higher one begins.','Y9-015-STEP',9,'Is the value at the change two or five?'],
 ['Open versus filled','magnify','The hollow ring marks a value excluded from that interval. The filled dot gives the actual value at the join.','Y9-015-STEP',10,'Which marker tells us the included value?'],
 ['Two rules, one input','count','Near the join the earlier section approaches one height, but at the join the filled point belongs to the next section.','Y9-015-JUMP',11,'What is the actual value at input four?'],
 ['The V-shaped model','point','A V-shaped graph decreases until a turning point, then increases. It changes gradient without a jump.','Y9-015-V',12,'Is there a gap at the turning point?'],
 ['Build your own rules','explain','In Explore you can drag the points and read the graph. Joining the points keeps the segments mathematically connected.','Y9-015-CHARGE',13,'Which control point would you move to create a plateau?'],
 ['GCSE extension: boundary','magnify','Open and filled endpoint markers help specify strict intervals. The included point decides the value at the boundary.','GCSE-OPEN',14,'Which point is included at input four?']
];
const STEPS=STORY.map(([name,mood,narration,,,prompt])=>({name,mood,narration,prompt}));
function render(i,stage){const row=STORY[i];setPreset(row[3],false);S.readX=row[3]==='Y9-015-STEP'?3:row[3]==='Y9-015-JUMP'||row[3]==='GCSE-OPEN'?4:3;
 scene(stage,{phase:row[4],pose:row[1],caption:row[2],focus:row[4]===3?2:row[4]===2?1:0});}
let refreshExplore=null;
function explore(panel,stage){S.mode='explore';panel.classList.add('f118-controls');
 function redraw(){panel.replaceChildren();const sel=H('select',{class:'nova-input','data-testid':'f118-preset','aria-label':'Select piecewise graph model'});
 for(const [id,p] of Object.entries(C.presets))sel.append(H('option',{value:id,text:p.label}));sel.value=S.preset;sel.onchange=()=>{setPreset(sel.value);redraw()};
 panel.append(H('label',{class:'f118-wide f118-control-label'},[H('strong',{text:'CHOOSE A PIECEWISE GRAPH'}),sel]));
 const read=H('input',{type:'range',min:'0',max:'8',step:'.5',value:String(S.readX),'aria-label':'Reading x position','data-testid':'f118-read-range'});read.oninput=()=>{S.readX=+read.value;emit('readX',{value:S.readX,y:readAt(S.readX),source:'slider'});redraw()};
 const readLabel=H('div',{class:'f118-control-head'},[H('span',{text:'READ THE GRAPH AT INPUT x'}),H('strong',{text:fmt(S.readX)})]);
 panel.append(H('label',{class:'f118-wide f118-control-label'},[readLabel,read]));
 const tools=H('section',{class:'f118-editor f118-wide'});tools.append(H('h4',{text:'MOVE A CONTROL POINT'}));
 const row=H('div',{class:'f118-points'});for(const p of S.nodes){row.append(H('button',{type:'button',class:'f118-point-btn'+(p.key===S.selected?' is-selected':''),text:p.key+' ('+fmt(p.x)+', '+fmt(p.y)+')','data-testid':'f118-choose-'+p.key,onclick:()=>{S.selected=p.key;emit('node',{selection:p.key});redraw()}}))}tools.append(row);
 const p=node(S.selected),ctl=H('div',{class:'f118-editor-actions'});for(const [label,dx,dy,desc] of [['← X',-1,0,'left'],['X →',1,0,'right'],['↓ Y',0,-1,'down'],['Y ↑',0,1,'up']]){ctl.append(H('button',{type:'button',class:'nova-btn','data-testid':'f118-nudge-'+desc,text:label,onclick:()=>{moveNode(S.selected,p.x+dx,p.y+dy);emit('node',{id:S.selected,x:node(S.selected).x,y:node(S.selected).y,source:'button'});redraw()}}))};
 tools.append(ctl,H('p',{class:'f118-help',text:'Drag any glowing point on the graph or focus it and use arrow keys. Positions snap to whole squares. A red remove zone below returns a selected edit to the starting model.'}));
 const zone=H('button',{type:'button',class:'f118-return','data-testid':'f118-return',text:'↶ RESTORE THIS GRAPH TO ITS PRESET',onclick:()=>{setPreset(S.preset);redraw()}});tools.append(zone);panel.append(tools);
 const reading=readAt(S.readX);const comment=reading===null?'No included value at that input. Check the open endpoint.':'At input '+fmt(S.readX)+' the graph reads '+fmt(reading)+'.';
 scene(stage,{phase:14,editable:true,pose:'point',caption:comment});}
 refreshExplore=redraw;setPreset(S.preset,false);redraw();}
const TASKS=[
 {pre:'Y9-015',x:3,answer:5,q:'At x = 3, what is y on the rise / flat / fall graph?',hint:'Find three on the x axis. Follow the neon graph to its y height.',wrong:'At x = three the graph reaches the first join, at height five.'},
 {pre:'Y9-015',x:4,answer:5,q:'During the flat interval, what is the output when x = 4?',hint:'A horizontal section holds the same y value.',wrong:'The output does not keep rising on a plateau.'},
 {pre:'Y9-015',x:7,answer:3,q:'On the final falling segment, what is y when x = 7?',hint:'Follow the line down: from (5, 5) to (8, 2).',wrong:'From the join, each step right reduces y by one.'},
 {pre:'Y9-015-JOURNEY',x:4,answer:6,q:'A journey has reached six units of distance. What distance remains at x = 4?',hint:'Between x = two and x = five, the journey graph is horizontal.',wrong:'A rest means distance stays fixed, not that distance becomes zero.'},
 {pre:'Y9-015-JOURNEY',x:8,answer:0,q:'When x = 8, how far is the traveller from the start?',hint:'Read the last endpoint of the graph.',wrong:'At the end, the graph has returned to height zero.'},
 {pre:'Y9-015-CHARGE',x:6,answer:6,q:'On the changing-charge model, what is the cost when x = 6?',hint:'The last section rises from (5, 5) with gradient one.',wrong:'The later interval resumes increasing, rather than remaining at the plateau.'},
 {pre:'Y9-015-V',x:4,answer:1,q:'At the turning point of the V-shaped graph, what is y?',hint:'The turning point is the bottom of the V.',wrong:'Do not read the height at x = zero; use the vertex x = four.'},
 {pre:'Y9-015-STEP',x:3,answer:5,q:'At the step change x = 3, which y value is INCLUDED?',hint:'The hollow ring means excluded; the filled ring means included.',wrong:'The open endpoint at y = two is excluded. Read the filled point at y = five.'},
 {pre:'Y9-015-JUMP',x:4,answer:2,q:'At x = 4, the upper point is open. What is the actual y value?',hint:'Find the FILLED endpoint at x = four.',wrong:'An open point cannot count as the function value at the boundary.'},
 {pre:'GCSE-OPEN',x:4,answer:3,q:'GCSE extension: at x = 4 which y value is included?',hint:'Compare hollow and solid endpoints at x = four.',wrong:'The open endpoint at y = six is not included: choose the solid endpoint.'}
];
function challenge(panel,api,stage){S.mode='challenge';const tasks=TASKS.map((t,i)=>({q:t.q,build:ctl=>{setPreset(t.pre,false);S.readX=t.x;const field=H('input',{type:'text',inputmode:'decimal',class:'nova-input','data-testid':'f118-answer',placeholder:'Enter y value','aria-label':'Numerical graph reading'});ctl.append(H('label',{class:'f118-task'},[H('span',{text:'YOUR ANSWER · y'}),field]));field.oninput=()=>emit('challengeValue',{task:i,value:field.value});return()=>field.value},check:val=>{const raw=String(val??'').trim().replaceAll('−','-'),number=Number(raw);let pass=raw!==''&&Number.isFinite(number)&&Math.abs(number-t.answer)<.001;
 if(pass){S.correct=true;N.events.emit('correct',{engine:ID,key:'challenge',value:{task:i,answer:number}});scene(stage,{phase:14,challenge:true,correct:true,pose:'cheer',caption:'Correct. You read the included graph value at the chosen input.'})}else S.attempt++;return[pass,pass?'Correct. At x = '+fmt(t.x)+', y = '+fmt(t.answer)+'.':raw===''?'Enter a numerical y value first.':t.wrong]},hint:t.hint,solve:()=>{S.correct=true;scene(stage,{phase:14,challenge:true,correct:true,pose:'explain',caption:'Read from x = '+fmt(t.x)+' to y = '+fmt(t.answer)+'.'})}}));
 N.challengeRun(panel,api,tasks,i=>{setPreset(TASKS[i].pre,false);S.readX=TASKS[i].x;S.correct=false;scene(stage,{phase:14,challenge:true,pose:'think',caption:'Read the correct included value. At a jump, an open endpoint is not the answer.'})},C)
}
const def={id:ID,title:'Piecewise and Non-standard Graph Builder',config:C,steps:STEPS,render,explore,challenge,
 alt:'NOVA piecewise graph board with axes zero to eight, glowing joined or separate line segments, open and solid endpoints, movable snapped graph points, and a reading guide.',
 staticAlt:'Piecewise graphs use different rules on intervals. Flat segments have gradient zero; rising and falling parts differ in gradient. A hollow endpoint is excluded, a solid endpoint is included. Read the correct point at jumps.',
 exploreIntro:'Choose a real-world or abstract piecewise model, move snapped control points, read x and y, and compare open versus closed boundary values.',onRestore:()=>setPreset(C.defaultPreset)};
N.registry.add({id:ID,title:'Piecewise and Non-standard Graph Builder',family:'F10',topics:['piecewise','graph intervals','non-standard graphs','jump','endpoint','open circle','closed circle','gradient'],deps:['F0-02','F0-14','F10-17']});
N.bankMount({id:ID,num:'18',title:'Piecewise and Non-standard Graph Builder · Premium Edition',def,linked:['F0-14','F10-17'],years:'Y9-015 · GCSE extension',spec:{purpose:'Interpret and build piecewise graphs with changing rates, flat intervals, jumps, and included/excluded endpoints.',params:'Nodes (x,y), edge connections, endpoint inclusion, grid limits, read position x, editable joined control points.',presets:'Y9-015 original, journey, charges, V-shape, step change, jump; GCSE endpoint extension.',steps:'15 narrated teaching stages, with mathematical evidence revealed when needed.',interactions:'Four modes: Watch, Guided, Explore (drag/snap nodes, arrow keys, read slider, reset), and 10 marked Challenge tasks.',traps:'Flat graph is not a return to zero, continuity is not constant gradient, hollow points are excluded, and the filled point gives an included boundary value.',gcse:'Open/closed interval endpoints are clearly labelled as GCSE extension.'}});
const fixAlt=()=>document.querySelectorAll('#F10-18 .face img').forEach(img=>{if(!img.alt)img.alt='Sir Bob, NOVA maths tutor'});fixAlt();window.addEventListener('load',fixAlt,{once:true});
})();
