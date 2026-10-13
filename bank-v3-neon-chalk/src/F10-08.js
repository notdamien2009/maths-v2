/* NOVA F10-08 Graph Intersections — premium coordinate teaching studio.
   Five master lesson presets, exact roots, estimates, cautious extrapolation. */
const F108_CONFIG={id:'F10-08',family:'F10',defaultPreset:'Y8-029',startMode:'watch',
 presets:{
  'Y8-029':{label:'Y8-029 · Simultaneous equations',year:8,context:'Two linear equations meet in one solution',A:[0,1,1],B:[0,-1,5],domain:[-5,5,-5,5],kind:'linear',note:'Equal y-values solve both equations simultaneously.'},
  'Y8-031':{label:'Y8-031 · Quadratic features',year:8,context:'A quadratic crosses the x-axis twice',A:[1,0,-4],B:[0,0,0],domain:[-5,5,-5,5],kind:'roots',note:'The roots are where y = 0; the turning point is different.'},
  'Y8-033':{label:'Y8-033 · Graphical problem solving',year:8,context:'Two water levels: one rises, one falls',A:[0,1,1],B:[0,-1,7],domain:[-5,5,-5,5],kind:'context',note:'Only t ≥ 0 is meaningful in this water-level model.'},
  'Y9-018':{label:'Y9-018 · Graphical modelling',year:9,context:'Line and parabola cross at two approximate solutions',A:[1,0,-2],B:[0,1,2],domain:[-5,5,-5,5],kind:'mixed',note:'Estimate the intersections: neither x-value is a neat integer.'},
  'Y9-051':{label:'Y9-051 · Best-fit prediction',year:9,context:'Illustrative fitted trend meets y = 3',A:[0,.5,1],B:[0,0,3],domain:[-5,5,-5,5],kind:'trend',measured:[0,1,2,3],note:'Measured x-values end at 3. Reading x = 4 is extrapolation.'}
 },events:{value:['preset','candidate','shift','variant','answer','reset','card','marker'],types:['mode','step','correct','hintUsed']},
 challenge:{tasks:['single-coordinate','quadratic-roots','story-crossing','approximate-coordinate','extrapolation']}};
window.F108_CONFIG=F108_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F108_CONFIG,ID=C.id,BOX={w:680,h:565,left:116,top:57,width:440,height:440};
if(N.premium?.enable)N.premium.enable();
const STORIES=[
 ['The shared coordinate plane','explain','Two relationships share the same axes. The intersection is where both give the same output.','What do the two graphs share?'],
 ['Draw the first graph','point','Read the first equation. Its points form one continuous neon line or curve.','What does a point on this graph satisfy?'],
 ['Draw the second graph','point','Plot the second rule on the very same axes, not a separate grid.','Where could both rules be true?'],
 ['Notice their meeting place','magnify','Look where the two graphs cross. One coordinate pair lies on both.','How many intersections can you see?'],
 ['Mark a common coordinate','count','The intersection has one x-value and one y-value that satisfy both equations.','Do we read x first or y first?'],
 ['Read x and y from the axes','point','Project to the axes. Read the horizontal coordinate first, then the vertical.','Can you explain both readings?'],
 ['Prove both equations','think','Substitute the x-value into each rule. They must give the same y-value.','Why is a point on only one graph insufficient?'],
 ['Quadratics may meet twice','magnify','A curved graph can meet a line more than once: read each intersection separately.','Can two different x-values both be solutions?'],
 ['A model needs interpretation','count','Intersection means equal model predictions, but context decides whether the values make sense.','Are negative times meaningful for a water-level story?'],
 ['Predict with care','cheer','Line-of-best-fit intersections are estimates. Outside the observed data range, prediction is extrapolation.','Why is extrapolating less secure?']
];
const STEPS=STORIES.map((r,i)=>({name:r[0],narration:r[2],prompt:r[3],mood:r[1],view:i}));
const S={preset:C.defaultPreset,shift:0,candidate:1.5,variant:'normal',task:0,solved:false,wrong:0,entry:['',''],marker:true,card:{A:null,B:null},selected:null};
const near=(a,b,t=.001)=>Math.abs(a-b)<t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),snap=(v,st=.25)=>Math.round(v/st)*st;
const fmt=n=>Number.isFinite(n)?((Math.abs(n)<1e-8?'0':String(Math.round(Math.abs(n)*100)/100)).replace(/^/,(n<0?'−':''))):'undefined';
const pointText=q=>'('+fmt(q[0])+', '+fmt(q[1])+')';
const emit=(key,value)=>{if(!C.events.value.includes(key))throw Error('Undeclared F10-08 event '+key);N.events.emit('value',{engine:ID,key,value})};
const pset=()=>C.presets[S.preset];
const evaluate=(co,x)=>co[0]*x*x+co[1]*x+co[2];
const modified=()=>{const p=pset(),a=[...p.A],b=[...p.B];if(S.variant==='parallel'&&p.kind!=='roots'&&p.kind!=='mixed'){b[0]=a[0];b[1]=a[1];b[2]=a[2]+2;}else if(S.variant==='coincident'){b.splice(0,3,...a)}else if(S.variant==='tangent'&&a[0]&&!b[0]){const da=a[0],db=a[1]-b[1];b[2]=a[2]-db*db/(4*da)}else if(S.variant==='none'&&a[0]&&!b[0]){const da=a[0],db=a[1]-b[1];b[2]=a[2]-db*db/(4*da)-1}else b[2]+=S.shift;return {a,b}};
function intersections(a,b,d=[-5,5,-5,5]){
 const A=a[0]-b[0],B=a[1]-b[1],D=a[2]-b[2],pts=[];
 let xs=[];
 if(Math.abs(A)<1e-10){if(Math.abs(B)<1e-10)return {kind:Math.abs(D)<1e-10?'coincident':'parallel',pts:[]};xs=[-D/B]}
 else {const disc=B*B-4*A*D;if(disc<-1e-9)return {kind:'none',pts:[]};if(Math.abs(disc)<1e-9)xs=[-B/(2*A)];else xs=[(-B-Math.sqrt(disc))/(2*A),(-B+Math.sqrt(disc))/(2*A)];}
 for(const x of xs){const y=evaluate(a,x);if(x>=d[0]-1e-7&&x<=d[1]+1e-7&&y>=d[2]-1e-7&&y<=d[3]+1e-7)pts.push([x,y]);}
 return {kind:pts.length===0?'none':pts.length===1?'single':'double',pts:pts.sort((x,y)=>x[0]-y[0])};
}
function reset(k=C.defaultPreset){S.preset=k;S.shift=0;S.variant='normal';S.candidate=1.5;S.solved=false;S.wrong=0;S.entry=['',''];S.marker=true;S.card={A:null,B:null};S.selected=null;emit('preset',k)}
reset();
const mobile=()=>window.matchMedia('(max-width:760px)').matches;
const pixel=(x,y,d)=>[BOX.left+(x-d[0])/(d[1]-d[0])*BOX.width,BOX.top+(d[3]-y)/(d[3]-d[2])*BOX.height];
const txt=(s,x,y,t,size=26,role='given',opts={})=>N.chalkText(s,x,y,String(t),{size:mobile()?Math.max(26,size):size,role,...opts});
function drawGrid(svg,d){
 const p=N.neonPlot(svg,{x0:BOX.left,y0:BOX.top,w:BOX.width,h:BOX.height,x:[d[0],d[1]],y:[d[2],d[3]],xStep:1,yStep:1});p.g.classList.add('f108-grid');p.g.querySelectorAll('text').forEach(e=>e.remove());
 const q=N.svg.axes(svg,{x:BOX.left,y:BOX.top,w:BOX.width,h:BOX.height,xmin:d[0],xmax:d[1],ymin:d[2],ymax:d[3],ticks:1});q.g.classList.add('f108-grid');q.g.querySelectorAll('text').forEach(e=>e.remove());
 const origin=pixel(0,0,d),skip=mobile()?2:1;
 for(let x=-4;x<=4;x++){if(!x||Math.abs(x)%skip)continue;txt(svg,pixel(x,0,d)[0],origin[1]+30,fmt(x),23,'support',{anchor:'middle'})}
 for(let y=-4;y<=4;y++){if(!y||Math.abs(y)%skip)continue;txt(svg,origin[0]-18,pixel(0,y,d)[1]+6,fmt(y),23,'support',{anchor:'end'})}
 txt(svg,origin[0]-19,origin[1]+30,'0',25,'support',{anchor:'end'});txt(svg,BOX.left+BOX.width+16,origin[1]-12,'x',31,'op');txt(svg,origin[0]+18,BOX.top-17,'y',31,'op');
}
function clip(svg){const defs=E('defs',{},svg),c=E('clipPath',{id:'f108-plot-clip'},defs);E('rect',{x:BOX.left-1,y:BOX.top-1,width:BOX.width+2,height:BOX.height+2},c)}
function curve(svg,coeff,role='focus',d=[-5,5,-5,5],width=5.5){let seq='';for(let i=0;i<=300;i++){const x=d[0]+(d[1]-d[0])*i/300,y=evaluate(coeff,x),p=pixel(x,y,d);seq+=(i?'L':'M')+p[0].toFixed(2)+','+p[1].toFixed(2)}
 const layer=E('g',{'clip-path':'url(#f108-plot-clip)'},svg);N.neonPath(layer,seq,{role,width});return seq;}
function marker(svg,q,r=17,role='result',pulse=false){const p=pixel(...q,pset().domain);N.neonRing(svg,...p,{r,role,pulse});return p}
function projected(svg,q,d){const a=pixel(...q,d),p0=pixel(q[0],0,d),p1=pixel(0,q[1],d);N.neonLine(svg,...a,...p0,{role:'support',width:2,dash:'5 7'});N.neonLine(svg,...a,...p1,{role:'support',width:2,dash:'5 7'});/* The axis already carries tick labels; don't duplicate them at the projection foot. */}
function handle(svg,d,onChange){const a=modified().a,x=S.candidate,y=evaluate(a,x);if(y<d[2]||y>d[3])return;const [cx,cy]=pixel(x,y,d);
 const el=E('g',{class:'f108-handle','data-testid':'f108-candidate-handle',role:'slider',tabindex:'0','aria-label':'Move the reading marker horizontally to inspect graphs','aria-valuemin':String(d[0]),'aria-valuemax':String(d[1]),'aria-valuenow':String(x)},svg);
 E('circle',{cx,cy,r:25,fill:'rgba(30,203,203,.14)'},el);N.neonRing(el,cx,cy,{r:15,role:'result',pulse:false});E('circle',{cx,cy,r:25,class:'f108-focus'},el);
 const upd=(v,source)=>{S.candidate=snap(clamp(v,d[0],d[1]));emit('candidate',{value:S.candidate,source});onChange();queueMicrotask(()=>document.querySelector('#F10-08 [data-testid="f108-candidate-handle"]')?.focus());};
 el.addEventListener('keydown',e=>{const z=e.key==='ArrowLeft'?-.25:e.key==='ArrowDown'?-.25:e.key==='ArrowRight'?.25:e.key==='ArrowUp'?.25:null;if(z===null)return;e.preventDefault();e.stopPropagation();upd(S.candidate+z,'keyboard')});
 const zones=[];for(let v=d[0];v<=d[1]+.001;v+=.25){const yy=evaluate(a,v);if(yy<d[2]||yy>d[3])continue;const p=pixel(v,yy,d);zones.push({id:String(snap(v)),kind:'drop',x:p[0]-5,y:p[1]-22,w:10,h:44});}
 N.ui.svgDrag(svg,el,{box:{x:cx-19,y:cy-19,w:38,h:38},zones:()=>zones,onDrop:id=>{upd(Number(id),'pointer');return true}});
}
function outcomeText(result){return result.kind==='double'?'TWO INTERSECTIONS':result.kind==='single'?'ONE INTERSECTION':result.kind==='coincident'?'COINCIDENT GRAPHS':result.kind==='parallel'?'PARALLEL · NO SOLUTION':'NO INTERSECTION IN THIS VIEW'}
function graphLabel(co){const a=co[0],b=co[1],c=co[2];if(!a){const term=Math.abs(b)<1e-9?'':near(b,1)?'x':near(b,-1)?'−x':fmt(b)+'x';return 'y = '+(term?term+(Math.abs(c)<1e-9?'':(c>=0?' + ':' − ')+fmt(Math.abs(c))):fmt(c))};let base='y = x²';if(a!==1)base='y = '+fmt(a)+'x²';if(b)base+=(b<0?' − ':' + ')+fmt(Math.abs(b))+'x';if(c)base+=(c<0?' − ':' + ')+fmt(Math.abs(c));return base}
function sideCard(label,content){return H('div',{class:'f108-card'},[H('div',{class:'f108-eyebrow',text:label}),content])}
function scene(stage,options={}){
 const o={step:9,editable:false,challenge:false,correct:false,pose:'explain',caption:'Find the coordinates that both graphs share.',...options};
 const reveal=!o.challenge||o.correct;stage.innerHTML='';const p=pset(),d=p.domain,{a,b}=modified(),ints=intersections(a,b,d),sStep=o.challenge?9:o.step;
 const frame=H('section',{class:'f108-theatre','data-topic':'geometry','data-testid':'f108-premium-theatre','data-correct':String(o.correct)});
 frame.appendChild(H('div',{class:'f108-topline'},[H('span',{text:'F10 · GRAPH INTERSECTION STUDIO'}),H('span',{class:'f108-tag',text:o.challenge?'CHALLENGE · FIND THE SOLUTION':p.kind==='trend'?'ESTIMATED TREND · CAUTION':'NOVA · NEON CHALK'})]));
 const layout=H('div',{class:'f108-layout'}),plane=H('div',{class:'f108-plane'}),svg=N.svg.root(BOX.w,BOX.h,'Four-quadrant coordinate plot. Two neon graph functions with mathematical intersections, reading marker and projection lines.');svg.classList.add('nv-svg','f108-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f108-coordinate-board';
 if(mobile())svg.setAttribute('viewBox','55 5 605 548');
 clip(svg);drawGrid(svg,d);
 const showA=sStep>=1||o.editable||o.challenge,showB=sStep>=2||o.editable||o.challenge;
 if(showA)curve(svg,a,'focus',d,5.6);if(showB)curve(svg,b,'result',d,5.6);
 /* Graphs are identified by their orange/green formula cards, never by floating labels unrelated to the plotted curve. */
 if(p.kind==='trend'&&showA){for(const xx of p.measured){const dy=[.12,-.12,.06,-.07][xx],y=evaluate(a,xx)+dy;if(y<d[2]||y>d[3])continue;const [mx,my]=pixel(xx,y,d);N.neonRing(svg,mx,my,{r:6,role:'op',pulse:false});}}
 if(reveal&&(sStep>=3||o.editable)&&ints.pts.length){for(const pt of ints.pts)marker(svg,pt,17,'result',o.correct);}
 if(reveal&&(sStep>=5||o.editable)&&ints.pts.length)projected(svg,ints.pts[ints.pts.length-1],d);
 if(o.editable&&S.marker)handle(svg,d,()=>{scene(stage,{...o});if(o.editable)window.NOVA_F108_REFRESH?.()});
 if(o.correct&&ints.pts.length){const q=ints.pts[ints.pts.length-1];marker(svg,q,31,'result',true)}
 plane.appendChild(svg);
 const tiles=H('div',{class:'f108-pills'},[N.neonTile('GRAPH A',{role:'focus'}),N.neonTile('GRAPH B',{role:'result'}),N.neonTile('READ BOTH AXES',{role:'op'})]);plane.appendChild(tiles);layout.appendChild(plane);
 const info=H('aside',{class:'f108-info','aria-label':'Graph intersection evidence'});
 info.appendChild(sideCard('TWO RELATIONSHIPS',H('div',{class:'f108-minirow'},[H('div',{},[H('small',{text:'A · FIRST GRAPH'}),H('b',{text:graphLabel(a)})]),H('div',{},[H('small',{text:'B · SECOND GRAPH'}),H('b',{text:graphLabel(b)})])])));
 const out=H('div',{class:'f108-formula','data-testid':'f108-outcome',text:reveal?outcomeText(ints):'FIND THEIR MEETING POINT'});info.appendChild(sideCard('THE INTERSECTION',out));
 const answers=H('div',{class:'f108-solution','data-testid':'f108-solutions'});if(!reveal)answers.appendChild(H('span',{class:'f108-hidden',text:'Read the graph and check your answer. Exact values remain hidden.'}));else if(ints.pts.length)for(const q of ints.pts)answers.appendChild(H('span',{class:'f108-result-pill',text:pointText(q)}));else answers.appendChild(H('span',{class:'f108-hidden',text:ints.kind==='coincident'?'Infinitely many shared points.':'No shared coordinate here.'}));
 info.appendChild(sideCard('COMMON COORDINATES',answers));
 const xa=clamp(S.candidate,d[0],d[1]),ya=evaluate(a,xa),yb=evaluate(b,xa),gap=Math.abs(ya-yb);
 const inspect=H('div',{class:'f108-detail','data-testid':'f108-reading',text:o.challenge&&!o.correct?'Find where both rules give the same output.':`At x = ${fmt(xa)}: A = ${fmt(ya)}, B = ${fmt(yb)}. Gap = ${fmt(gap)}.`});
 info.appendChild(sideCard('COMPARE AT THE SAME x',inspect));
 layout.appendChild(info);frame.appendChild(layout);
 frame.appendChild(H('div',{class:'f108-takeaway',html:o.challenge&&!o.correct?'Your task: identify the <em>shared coordinates</em>, not just a point on one graph.':p.kind==='trend'?'The intersection x = 4 lies beyond measured x = 0 to 3. <em>Extrapolation is uncertain.</em>':p.kind==='roots'?'The x-intercepts are <em>roots</em>; the turning point at (0, −4) is not a root.':ints.kind==='parallel'?'Distinct parallel lines do not meet: <em>no simultaneous solution.</em>':ints.kind==='coincident'?'The rules describe the same graph: <em>infinitely many shared points.</em>':p.note}));
 if(o.challenge){const face=N.helperImg(o.correct?'cheer':S.wrong?'oops':'think','teen');frame.appendChild(H('div',{class:'f108-izaac'},[H('img',{src:face.src,alt:o.correct?'Izaac celebrating correct graph reasoning':'Izaac considering two intersecting graphs'}),H('span',{text:o.correct?'Izaac: The shared coordinate is proved.':S.wrong?'Izaac: Check both equations, not just one.':'Izaac: The answer must be on both graphs.'})]));}
 stage.appendChild(frame);N.scene.helperStrip(stage,o.pose,o.caption);return svg;
}
function motionTrace(c,d){let result='',started=false;for(let i=0;i<=140;i++){const x=d[0]+(d[1]-d[0])*i/140,y=evaluate(c,x),inside=y>=d[2]&&y<=d[3];if(!inside){started=false;continue}const pt=pixel(x,y,d);result+=(started?'L':'M')+pt[0].toFixed(1)+','+pt[1].toFixed(1);started=true;}return result;}
function render(i,stage){let saved=S.preset;if(i===7)S.preset='Y8-031';else if(i===8)S.preset='Y8-033';else if(i===9)S.preset='Y9-051';else S.preset='Y8-029';const t=STEPS[i];const sv=scene(stage,{step:i,pose:t.mood,caption:t.narration});S.preset=saved;
 if(i>0&&!N.reducedMotion()){const p=C.presets[i>=9?'Y9-051':i===8?'Y8-033':i===7?'Y8-031':'Y8-029'],z=intersections(p.A,p.B,p.domain);if([1,2,7,8,9].includes(i)){const d=motionTrace(i===2?p.B:p.A,p.domain);if(d)N.motion.trail(sv,d,i===2?'result':'focus',550);}if(i>2&&z.pts.length){const q=pixel(...z.pts[0],p.domain);N.motion.flash(sv,...q,'result',19)}}}
function matchingStudio(panel){
 const wrap=H('div',{class:'f108-match f108-span','data-testid':'f108-matching'});
 wrap.appendChild(H('h4',{text:'MATCH THE EQUATION TO THE GRAPH'}));
 const status=H('div',{class:'f108-match-status','aria-live':'polite',text:'Select an equation, then drop it onto the orange or green graph target.'});
 const cards=H('div',{class:'f108-match-cards'}),targets=H('div',{class:'f108-match-targets'});
 const explain={A:'Graph A uses the orange neon curve.',B:'Graph B uses the green neon curve.'};
 function feedback(v){status.textContent=v;}
 function select(k){S.selected=k;feedback('Selected the '+k+' equation. Now choose a graph target or use the red return tray.');redraw()}
 function put(key,target){if(!key){feedback('Select an equation first.');return}if(key!==target){feedback('Not yet: the '+key+' equation belongs to '+(key==='A'?'the orange graph A':'the green graph B')+'. Compare the coefficients and curve.');return}S.card[target]=key;S.selected=null;emit('card',{key,target,action:'matched'});feedback('Matched! '+explain[target]+' Press another card or remove it with the red tray.');redraw()}
 function remove(key){if(!key){feedback('Select an equation to return, or drag a matched card to this tray.');return}if(S.card[key]){S.card[key]=null;emit('card',{key,action:'removed'})}S.selected=null;feedback('Equation '+key+' returned to the tray. You can match it again.');redraw()}
 function acceptDrag(el,fn){el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('f108-dragover')});el.addEventListener('dragleave',()=>el.classList.remove('f108-dragover'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('f108-dragover');fn(e.dataTransfer?.getData('text/plain')||S.selected)})}
 function redraw(){cards.innerHTML='';targets.innerHTML='';for(const k of ['A','B']){
  const assigned=!!S.card[k],btn=H('button',{class:'f108-match-card'+(S.selected===k?' selected':''),type:'button','data-testid':'f108-card-'+k,'aria-pressed':String(S.selected===k),text:(k==='A'?'ORANGE A · ':'GREEN B · ')+graphLabel(k==='A'?modified().a:modified().b)});
  btn.draggable=false;btn.style.touchAction='none';btn.onclick=()=>select(k);
  btn.addEventListener('pointerdown',e=>{if(e.button!==0)return;const pointerId=e.pointerId,start=[e.clientX,e.clientY];let moved=false,glowing=null;
   const clearGlow=()=>{if(glowing)glowing.classList.remove('f108-dragover');glowing=null};
   const finish=()=>{document.removeEventListener('pointermove',onMove,true);document.removeEventListener('pointerup',onUp,true);document.removeEventListener('pointercancel',onCancel,true);clearGlow()};
   const at=(x,y)=>document.elementFromPoint(x,y)?.closest?.('[data-testid^="f108-target-"], [data-testid="f108-remove"]');
   const onMove=q=>{if(q.pointerId!==pointerId)return;if(Math.hypot(q.clientX-start[0],q.clientY-start[1])>9)moved=true;if(!moved)return;
      const zone=at(q.clientX,q.clientY);if(zone!==glowing){clearGlow();glowing=zone;if(zone)zone.classList.add('f108-dragover')}};
   const onUp=q=>{if(q.pointerId!==pointerId)return;const target=moved?at(q.clientX,q.clientY):null;finish();if(!target)return;
      if(target.dataset.testid==='f108-remove')remove(k);else if(target.dataset.testid==='f108-target-A')put(k,'A');else if(target.dataset.testid==='f108-target-B')put(k,'B');};
   const onCancel=q=>{if(q.pointerId===pointerId)finish()};
   document.addEventListener('pointermove',onMove,true);document.addEventListener('pointerup',onUp,true);document.addEventListener('pointercancel',onCancel,true);
  });cards.appendChild(btn);
  const zone=H('button',{class:'f108-match-target'+(assigned?' filled':''),type:'button','data-testid':'f108-target-'+k,'aria-label':'Graph '+k+' drop target '+(k==='A'?'orange':'green'),text:(k==='A'?'ORANGE GRAPH A':'GREEN GRAPH B')+(assigned?' · ✓ MATCHED':' · DROP HERE')});zone.onclick=()=>put(S.selected,k);acceptDrag(zone,v=>put(v,k));targets.appendChild(zone);
 }
 }
 const removeZone=H('button',{class:'f108-return-zone',type:'button','data-testid':'f108-remove','aria-label':'Red return tray: remove selected equation',text:'↶ RED RETURN TRAY · REMOVE / RETRY'});removeZone.onclick=()=>remove(S.selected);acceptDrag(removeZone,remove);
 wrap.append(cards,targets,removeZone,status);panel.appendChild(wrap);redraw();
}
function controls(panel,stage){panel.classList.add('f108-controls');function draw(){panel.innerHTML='';const select=H('select',{class:'nova-input','aria-label':'Lesson preset','data-testid':'f108-preset'});for(const [k,v] of Object.entries(C.presets))select.appendChild(H('option',{value:k,text:v.label}));select.value=S.preset;
 select.onchange=()=>{reset(select.value);draw();scene(stage,{editable:true,pose:'point',caption:'Study how graphs meet on one shared grid.'})};panel.appendChild(H('label',{class:'f108-span'},['Lesson preset',select]));
 const shift=H('input',{type:'range',min:'-4',max:'4',step:'.25',value:String(S.shift),'aria-label':'Shift graph B vertically','data-testid':'f108-shift'});shift.oninput=()=>{S.shift=Number(shift.value);S.variant='normal';emit('shift',S.shift);draw();scene(stage,{editable:true,pose:'point',caption:'Moving graph B changes the number and position of crossings.'})};panel.appendChild(H('label',{},[H('div',{class:'f108-ctl-head'},[H('span',{text:'Move graph B up or down'}),H('span',{class:'f108-slider-value',text:fmt(S.shift)})]),shift]));
 const cand=H('input',{type:'range',min:'-3',max:'3',step:'.25',value:String(S.candidate),'aria-label':'Reading marker x coordinate','data-testid':'f108-candidate'});cand.oninput=()=>{S.candidate=Number(cand.value);emit('candidate',S.candidate);draw();scene(stage,{editable:true,pose:'magnify',caption:'Read both y-values at the same x.'})};panel.appendChild(H('label',{},[H('div',{class:'f108-ctl-head'},[H('span',{text:'Reading marker · x'}),H('span',{class:'f108-slider-value',text:fmt(S.candidate)})]),cand]));
 const actions=H('div',{class:'f108-actions f108-span'});function button(label,fn){actions.appendChild(H('button',{class:'nova-btn ghost',text:label,onclick:()=>{fn();draw();scene(stage,{editable:true,pose:'magnify',caption:'Compare the number of intersections carefully.'})}}))}
 if(!pset().A[0])button('No solution · parallel',()=>{S.variant='parallel';S.shift=0;emit('variant','parallel')});button('Same graph',()=>{S.variant='coincident';S.shift=0;emit('variant','coincident')});
 if(pset().A[0]){button('Touch once · tangent',()=>{S.variant='tangent';S.shift=0;emit('variant','tangent')});button('No crossings',()=>{S.variant='none';S.shift=0;emit('variant','none')})}
 button('Restore',()=>{reset(S.preset);emit('reset',S.preset)});panel.appendChild(actions);
 const lab=H('div',{class:'f108-note f108-span',text:'Drag the teal reading marker along graph A, use arrow keys, or use the x slider. The second graph can move without changing its mathematical shape. Escape cancels a drag.'});panel.appendChild(lab);matchingStudio(panel);
 }
 window.NOVA_F108_REFRESH=draw;draw();scene(stage,{editable:true,pose:'point',caption:'Slide graph B and find where both rules give the same result.'});}
const TASKS=[
 {preset:'Y8-029',type:'pair',q:'The two straight lines meet at one point. Enter its x and y coordinates.',expected:[2,3],hint:'Solve x + 1 = −x + 5. Find x first, then use either line for y.',explain:'x + 1 = −x + 5 gives 2x = 4, so x = 2 and y = 3.'},
 {preset:'Y8-031',type:'roots',q:'The parabola crosses the x-axis twice. Enter both x-values, lowest first.',expected:[-2,2],hint:'Roots occur where y = 0. Set x² − 4 = 0. The turning point is not the root.',explain:'x² − 4 = 0 means x = −2 or x = 2.'},
 {preset:'Y8-033',type:'pair',q:'A water level rises while another falls. At what time x and level y are they equal?',expected:[3,4],hint:'Set x + 1 equal to −x + 7; negative time would not be meaningful.',explain:'2x = 6 gives x = 3 and both water levels equal 4.'},
 {preset:'Y9-018',type:'pair',q:'Estimate the POSITIVE-x intersection of y = x² − 2 and y = x + 2, to two decimal places.',expected:[(1+Math.sqrt(17))/2,(5+Math.sqrt(17))/2],tol:.055,hint:'Equate x² − 2 and x + 2, solve x² − x − 4 = 0, and select the positive root.',explain:'The positive intersection is approximately (2.56, 4.56). The negative root is another valid crossing but is not the one requested.'},
 {preset:'Y9-051',type:'choice',q:'The trend was measured for x = 0 to 3. Its intersection with y = 3 is at x = 4. Is this interpolation or extrapolation?',expected:'extrapolation',hint:'Check whether x = 4 lies inside or outside the observed range [0, 3].',explain:'This is extrapolation because x = 4 lies outside the observed x-values; the prediction is less secure.'}
];
function challenge(panel,api,stage){const specs=TASKS.map((t,i)=>({q:t.q,build:ctl=>{reset(t.preset);S.task=i;S.wrong=0;S.solved=false;S.entry=['',''];
 if(t.type==='choice'){const select=H('select',{class:'nova-input','aria-label':'Choose interpolation or extrapolation'},[H('option',{value:'',text:'Choose one'}),H('option',{value:'interpolation',text:'Interpolation'}),H('option',{value:'extrapolation',text:'Extrapolation'}),H('option',{value:'neither',text:'Neither'})]);select.onchange=()=>S.entry[0]=select.value;ctl.appendChild(select);return()=>S.entry[0]}
 const wrap=H('div',{class:'f108-answerpair'});for(const [j,label] of (t.type==='roots'?['Lower x root','Higher x root']:['x coordinate','y coordinate']).entries()){
 const input=H('input',{type:'text',class:'nova-input',inputmode:'decimal',placeholder:label,'aria-label':label});input.oninput=()=>{S.entry[j]=input.value;emit('answer',{task:i,index:j,value:input.value})};wrap.appendChild(H('label',{},[H('span',{text:label}),input]));}ctl.appendChild(wrap);return()=>S.entry.slice()},
 check:ans=>{let ok=false,feedback='';if(t.type==='choice'){ok=ans===t.expected;feedback=ok?t.explain:'Interpolation stays inside the data range. At x = 4 we are predicting outside x = 0 to 3.'}
 else{const raw=Array.isArray(ans)?ans:[];const v=raw.map(x=>Number(String(x).trim().replace(/−/g,'-'))),notEmpty=raw.length===2&&raw.every(x=>String(x).trim()!=='');ok=notEmpty&&v.every(Number.isFinite)&&v.every((x,j)=>near(x,t.expected[j],t.tol||.03));
 feedback=ok?t.explain:!notEmpty?'Enter both values to form one coordinate pair.':t.type==='roots'?'There are two roots. Solve x² − 4 = 0 and enter the negative root first.':t.type==='pair'&&i===3?'Use the positive intersection and give each coordinate to two decimal places.':i===2?'Both water levels must be equal at the same positive time.':'At a solution, the same (x, y) satisfies BOTH graph equations.'}
 if(ok){S.solved=true;scene(stage,{challenge:true,correct:true,pose:'cheer',caption:t.explain});}else S.wrong++;return [ok,feedback]},
 hint:t.hint,solve:()=>{S.solved=true;scene(stage,{challenge:true,correct:true,pose:'cheer',caption:t.explain})}}));
 N.challengeRun(panel,api,specs,i=>{reset(TASKS[i].preset);S.task=i;S.solved=false;S.wrong=0;scene(stage,{challenge:true,correct:false,pose:'think',caption:'Find the common coordinate without revealing its exact value.'})},C);
}
const def={id:ID,title:'Graph intersections',config:C,steps:STEPS,render,explore:controls,challenge,
 alt:'Two neon graphs plotted on the same mathematical coordinate grid, with a separate movable reading marker and solution rings.',
 staticAlt:'A graph intersection is a shared (x,y) satisfying both relationships. Curves can meet twice, tangent once, or not at all. Best-fit extrapolation is uncertain.',
 exploreIntro:'Switch among five authentic lesson contexts; drag a reading marker; move graph B; examine zero, one and two solutions.',
 onRestore:()=>reset()};
N.registry.add({id:ID,title:'Graph Intersections',family:'F10',topics:['simultaneous equations','quadratic roots','graphical solutions','estimation','extrapolation'],deps:['F0-02','F0-14','F10-04','F10-05','F10-07']});
N.bankMount({id:ID,num:'08',title:'Graph Intersections · Premium Edition',def,linked:['F0-14','F10-04','F10-05','F10-07'],years:'Y8-029 · Y8-031 · Y8-033 · Y9-018 · Y9-051',spec:{
 purpose:'Find shared coordinate solutions where two equations or real-world relationships intersect, distinguishing exact and estimated solutions.',
 params:'Graphs A and B: quadratic or linear coefficients; one graph-B vertical shift; sampled reading marker x; five named lesson contexts.',
 presets:'Y8-029, Y8-031, Y8-033, Y9-018 and Y9-051, plus explore-only coincidence, parallel and quadratic tangent/no-crossing variants.',
 steps:'Shared axes → first graph → second graph → locate crossing → ring common coordinate → project axes → substitute → two roots → context → cautious prediction.',
 interactions:'Watch, Guided, Explore, Challenge; drag reading marker, keyboard arrows, x and B-offset sliders, five marked challenges and mathematical diagnostics.',
 traps:'Reading x/y in reverse; using a point on only one graph; treating turning points as roots; assuming all quadratics meet twice; treating extrapolation as certain.',
 gcse:'Y9 graphical approximations and two-root quadratic intersections connect to GCSE algebra and modelling.'}});
const card=document.getElementById(ID);if(card){const h=card.querySelector('h3');if(h)h.textContent='Shared coordinates · roots · real-world crossings';card.querySelectorAll('.face img').forEach(img=>{if(!img.alt)img.alt='NOVA educational maths mascot'})}
})();
