/* NOVA Maths F10-16 · Circle on a Grid · standalone premium engine; F0 shared core */
const F116_CONFIG=Object.freeze({
 id:'F10-16',family:'F10',startMode:'watch',defaultPreset:'Y9-040',
 presets:{
  'Y9-040':{label:'Y9-040 · Coordinate geometry',centre:[1,-1],radius:3,context:'Use coordinates and symmetry to describe this circle.',level:'Year 9 · CORE'},
  'Y9-040-SYMMETRY':{label:'Y9-040 · Four equal radii',centre:[-2,1],radius:2,context:'Every marked point has the same distance from the centre.',level:'Year 9 · CORE'},
  'Y9-040-DIAMETER':{label:'Y9-040 · Diameter and radius',centre:[0,0],radius:4,context:'A diameter crosses the centre and measures twice the radius.',level:'Year 9 · CORE'},
  'Y9-040-PYTH':{label:'Y9-040 · Coordinate distance',centre:[0,0],radius:5,context:'A 3–4–5 right triangle reaches a point on the circle.',level:'Year 9 · CORE'},
  'GCSE-ORIGIN':{label:'GCSE EXT · x² + y² = r²',centre:[0,0],radius:4,context:'Every point satisfies x² + y² = 16.',level:'GCSE · EXTENSION'},
  'GCSE-SHIFT':{label:'GCSE EXT · Translated circle',centre:[-2,-1],radius:3,context:'For a centre away from the origin, subtract its coordinates before squaring.',level:'GCSE · EXTENSION'}
 },events:{value:['preset','radius','centre','card','answer','reset'],types:['mode','step','correct','hintUsed']}
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F116_CONFIG,ID=C.id;
if(N.premium?.enable)N.premium.enable();
const mobile=()=>matchMedia('(max-width:760px)').matches;
const P={preset:'Y9-040',centre:[1,-1],radius:3,wrong:0,solved:false,selected:null,matches:{},step:0};
const fmt=n=>String(Math.round(n*100)/100).replaceAll('-','−');
const bound=(n,a,b)=>Math.max(a,Math.min(b,n));
const geom=()=>mobile()?{w:760,h:795,left:111,top:96,size:532}:{w:760,h:720,left:110,top:66,size:520};
const XY=(x,y,g=geom())=>[g.left+(x+6)*g.size/12,g.top+(6-y)*g.size/12];
function emit(k,v){N.events.emit('value',{engine:ID,key:k,value:v})}
function limitRadius(){return Math.min(5.5,6-Math.abs(P.centre[0]),6-Math.abs(P.centre[1]));}
function reset(key=C.defaultPreset,notify=true){const r=C.presets[key]||C.presets[C.defaultPreset];P.preset=key in C.presets?key:C.defaultPreset;P.centre=[...r.centre];P.radius=r.radius;P.solved=false;P.wrong=0;P.matches={};P.selected=null;if(notify)emit('preset',P.preset)}
function setRadius(n,source='slider'){const max=limitRadius();P.radius=bound(Math.round(n*2)/2,1,max);emit('radius',{value:P.radius,source});return P.radius}
function atAngle(angle){const a=angle*Math.PI/180;return [P.centre[0]+P.radius*Math.cos(a),P.centre[1]+P.radius*Math.sin(a)]}
function chalk(svg,x,y,text,size=32,role='support',opts={}){return N.chalkText(svg,x,y,String(text),{size:Math.max(mobile()?36:30,size),role,...opts})}
function graphGrid(svg){const g=geom(),f={x0:g.left,y0:g.top,w:g.size,h:g.size,x:[-6,6],y:[-6,6],xStep:1,yStep:1};
 const plot=N.neonPlot(svg,f);if(plot?.g){plot.g.classList.add('f116-grid');plot.g.querySelectorAll('text').forEach(el=>el.remove())}
 const ax=N.svg.axes(svg,{x:g.left,y:g.top,w:g.size,h:g.size,xmin:-6,xmax:6,ymin:-6,ymax:6,ticks:1});ax.g.classList.add('f116-grid');ax.g.querySelectorAll('text').forEach(el=>el.remove());
 for(let x=-6;x<=6;x+=2){const [sx]=XY(x,0,g);chalk(svg,sx,g.top+g.size+(mobile()?39:27),fmt(x),31,'support',{anchor:'middle'})}
 for(let y=-6;y<=6;y+=2){if(!y)continue;const [,sy]=XY(0,y,g);chalk(svg,g.left-18,sy+9,fmt(y),30,'support',{anchor:'end'})}
 chalk(svg,g.left+g.size/2,g.top+g.size+(mobile()?70:87),'HORIZONTAL · x',35,'op',{anchor:'middle'});
 chalk(svg,g.left+8,g.top-29,'VERTICAL · y',33,'op',{anchor:'start'});
 return g;
}
function pathCircle(g=geom(),rad=P.radius,c=P.centre){let d='';for(let i=0;i<=220;i++){const t=2*Math.PI*i/220;const [x,y]=XY(c[0]+rad*Math.cos(t),c[1]+rad*Math.sin(t),g);d+=(i?'L':'M')+x.toFixed(2)+','+y.toFixed(2)+' '}return d+'Z'}
function line(g,x1,y1,x2,y2,role='op',w=3,dash){const a=XY(x1,y1,g),b=XY(x2,y2,g);return N.neonPath(g.svg,'M'+a.join(',')+'L'+b.join(','),{role,width:w,dash})}
function equation(){const term=(s,v)=>v===0?s+'²':'('+s+(v>0?' − '+fmt(v):' + '+fmt(-v))+')²';return term('x',P.centre[0])+' + '+term('y',P.centre[1])+' = '+fmt(P.radius*P.radius)}
function card(header,text,kind='normal',testId=''){return H('div',{class:'f116-card',...(testId?{'data-testid':testId}:{})},[H('div',{class:'f116-eyebrow',text:header}),H('div',{class:kind==='note'?'f116-note':kind==='answer'?'f116-answer':'f116-proof',text:text})])}
const STORY=[
 ['Start with the grid','explain','The x coordinate goes across and the y coordinate goes up or down. Read both axes before placing a point.','Y9-040',0,'What does the first coordinate tell you?'],
 ['Mark the centre','point','This circle is centred at one, negative one. The centre stays fixed as we measure outwards.','Y9-040',1,'Where is the centre?'],
 ['One radius','count','Measure from the centre to the edge, not from the y axis. The distance is three units.','Y9-040',2,'What does radius mean?'],
 ['Sweep a circle','explain','Keep that distance fixed and turn all the way around. Every point on the circle is the same distance from the centre.','Y9-040',3,'What stays the same as we turn?'],
 ['Four equal radii','point','Right, up, left and down: four different points but exactly the same distance from the centre.','Y9-040-SYMMETRY',4,'How many units from the centre?'],
 ['Mirror across the centre','magnify','Opposite points pair up across the centre. Their midpoint is the centre of the circle.','Y9-040-SYMMETRY',5,'What is halfway between opposite points?'],
 ['Diameter crosses the centre','count','A diameter travels across the whole circle through its centre. Two radii make one diameter.','Y9-040-DIAMETER',6,'If radius is four, what is diameter?'],
 ['A point at three, four','point','From the origin travel three right, then four up. That point is five units away along the diagonal.','Y9-040-PYTH',7,'What is the direct distance?'],
 ['Prove the five-unit radius','explain','The right angle gives three squared plus four squared equals twenty five. The radius is five.','Y9-040-PYTH',8,'Which right triangle proves the radius?'],
 ['Change the radius','count','The centre stays where it is while the radius changes the size of the circle. Try dragging the golden handle in Explore.','Y9-040',9,'What changes when you increase the radius?'],
 ['Inside, on, and outside','magnify','A point on the boundary is exactly one radius away. An inside point is closer; an outside point is farther.','Y9-040',10,'What does on the circle mean?'],
 ['GCSE extension: origin','point','At the origin, distance gives x squared plus y squared equals radius squared. For radius four the right side is sixteen.','GCSE-ORIGIN',11,'What number is radius squared?'],
 ['GCSE extension: shifted centre','explain','When the centre is negative two, negative one, we measure x plus two and y plus one. Both are squared.','GCSE-SHIFT',12,'What changes when the centre moves?']
];
const STEPS=STORY.map(([name,mood,narration,,,prompt])=>({name,mood,narration,prompt}));
function scene(stage,opt={}){
 const q={phase:10,editable:false,challenge:false,correct:false,caption:'Move around the circle and notice what stays equal.',pose:'point',...opt};
 stage.replaceChildren();const g=geom();const section=H('section',{class:'f116-theatre','data-testid':'f116-theatre'});
 section.append(H('div',{class:'f116-topline'},[H('span',{text:'F10 · CIRCLE GEOMETRY STUDIO'}),H('span',{class:'f116-badge',text:P.preset.startsWith('GCSE')?'GCSE EXTENSION':'NOVA · NEON CHALK'})]));
 const layout=H('div',{class:'f116-layout'}),plane=H('div',{class:'f116-plane'});
 const svg=N.svg.root(g.w,g.h,'Coordinate grid from negative six to positive six, showing a circle, its centre and a radius handle.');svg.classList.add('nv-svg','f116-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f116-graph';svg.setAttribute('viewBox',mobile()?'35 -4 690 775':'35 -5 690 720');g.svg=svg;
 graphGrid(svg);
 const [cx,cy]=XY(...P.centre,g),rPix=P.radius*g.size/12,showCircle=q.editable||q.challenge||q.phase>=3;
 const clip=E('clipPath',{id:'f116-plotclip'},E('defs',{},svg));E('rect',{x:g.left,y:g.top,width:g.size,height:g.size},clip);
 const draw=E('g',{'clip-path':'url(#f116-plotclip)'},svg);
 if(showCircle||q.phase===0){const cp=pathCircle(g);
   E('path',{d:cp,fill:'#2b80de',opacity:q.phase===0?'.024':'.075',class:'f116-glow'},draw);
   const ring=N.neonPath(draw,cp,{role:q.correct?'result':'focus',width:q.phase===0?2:6});if(q.phase===0)ring.setAttribute('opacity','.23');
 }
 if(q.phase>=1||q.editable||q.challenge){
   N.neonRing(draw,cx,cy,{r:9,role:'result',pulse:false});
   chalk(svg,cx+18,cy+32,'C('+fmt(P.centre[0])+', '+fmt(P.centre[1])+')',33,'result',{anchor:'start'});
 }
 if(q.phase>=2||q.editable||q.challenge){
   const [ex,ey]=XY(P.centre[0]+P.radius,P.centre[1],g);
   N.neonPath(draw,'M'+cx+','+cy+'L'+ex+','+ey,{role:'unknown',width:5});
   const hidden=q.challenge&&!q.correct;
   chalk(svg,(cx+ex)/2,cy-21,hidden?'r = ?':'r = '+fmt(P.radius),37,'unknown',{anchor:'middle'});
   if(q.editable){const handle=E('g',{class:'f116-handle',role:'slider',tabindex:'0','aria-label':'Circle radius handle; left or right arrows change radius','aria-valuemin':'1','aria-valuemax':String(limitRadius()),'aria-valuenow':String(P.radius),'data-testid':'f116-radius-handle'},svg);
     E('circle',{cx:ex,cy:ey,r:30,fill:'rgba(255,199,95,.16)'},handle);N.neonRing(handle,ex,ey,{r:14,role:'unknown',pulse:false});E('circle',{cx:ex,cy:ey,r:27,class:'f116-focus'},handle);
     const modify=(nr,source)=>{setRadius(nr,source);scene(stage,{...q,editable:true});queueMicrotask(()=>stage.querySelector('[data-testid="f116-radius-handle"]')?.focus())};
     handle.addEventListener('keydown',e=>{if(e.key==='Escape'){N.ui._drag?.cancel?.();return}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();modify(P.radius+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-.5:.5),'keyboard')});
     const zones=[];for(let rv=1;rv<=limitRadius()+.001;rv+=.5){const [zx,zy]=XY(P.centre[0]+rv,P.centre[1],g);zones.push({id:String(rv),kind:'drop',x:zx-12,y:zy-45,w:24,h:90})}
     N.ui.svgDrag(svg,handle,{box:{x:ex-25,y:ey-25,w:50,h:50},zones:()=>zones,onDrop:id=>{modify(+id,'pointer');return true}});
   }else N.neonRing(draw,ex,ey,{r:9,role:'unknown',pulse:false});
 }
 if(q.phase===4||q.phase===5){[0,90,180,270].forEach(a=>{const end=atAngle(a),[px,py]=XY(...end,g);N.neonPath(draw,`M${cx},${cy}L${px},${py}`,{role:a%180===0?'unknown':'op',width:3});N.neonRing(draw,px,py,{r:9,role:'result',pulse:false})})}
 if(q.phase===6){const [ax,ay]=XY(P.centre[0]-P.radius,P.centre[1],g),[bx,by]=XY(P.centre[0]+P.radius,P.centre[1],g);N.neonPath(draw,`M${ax},${ay}L${bx},${by}`,{role:'op',width:5});chalk(svg,cx,cy-50,'d = '+fmt(P.radius*2),39,'op',{anchor:'middle'})}
 if(q.phase===7||q.phase===8){const [tx,ty]=XY(3,4,g),[fx,fy]=XY(3,0,g),[ox,oy]=XY(0,0,g);N.neonPath(draw,`M${ox},${oy}L${fx},${fy}L${tx},${ty}L${ox},${oy}`,{role:'op',width:3});N.neonRing(draw,tx,ty,{r:9,role:'result'});chalk(svg,tx+23,ty-9,'(3, 4)',35,'result');chalk(svg,(ox+fx)/2,oy+35,'3',38,'unknown',{anchor:'middle'});chalk(svg,fx+19,(fy+ty)/2,'4',38,'op');}
 if(q.phase===10){const on=XY(P.centre[0]+P.radius,P.centre[1],g);const inside=XY(P.centre[0]+P.radius*.5,P.centre[1]+.5,g);const out=XY(P.centre[0]+P.radius+.6,P.centre[1]+.5,g);N.neonRing(draw,...inside,{r:9,role:'result'});N.neonRing(draw,...on,{r:8,role:'unknown'});N.neonRing(draw,...out,{r:8,role:'error'});}
 plane.append(svg);
 const cp=P.centre,rad=P.radius,diam=2*rad,hidden=q.challenge&&!q.correct;
 let major='Centre ('+fmt(cp[0])+', '+fmt(cp[1])+')',explain='Every boundary point is '+fmt(rad)+' units from its centre.';
 if(q.phase===0)major='Read across x, then up y';
 else if(q.phase===1)major='Centre C ('+fmt(cp[0])+', '+fmt(cp[1])+')';
 else if(q.phase===2)major='One radius = '+fmt(rad)+' units';
 else if(q.phase===5)major='Midpoint = the centre';
 else if(q.phase===6)major='Diameter = '+fmt(diam)+' units';
 else if(q.phase===7||q.phase===8)major='3² + 4² = 5²';
 else if(q.phase>=11)major=equation();
 else if(q.phase===9||q.editable)major='Radius = '+fmt(rad)+' units';
 if(q.challenge&&!q.correct)major='Use the diagram to calculate';
 plane.append(H('p',{class:'f116-textline','data-testid':'f116-plain-annotation',text:major}));
 plane.append(H('p',{class:'f116-subline',text:q.phase>=11?'GCSE extension: distance from the centre':P.preset==='Y9-040-PYTH'?'A right triangle proves the five-unit radius':q.phase===6?'A diameter runs through the centre.': 'Points on the circle share one centre-to-edge distance.'}));
 layout.append(plane);
 const aside=H('aside',{class:'f116-info','aria-label':'Circle mathematics evidence'});
 aside.append(card('CENTRE',`C (${fmt(cp[0])}, ${fmt(cp[1])})`,'normal','f116-centre'));
 aside.append(card('RADIUS · CENTRE TO EDGE',hidden?'Find the length':q.phase<2&&!q.editable?'Measure from centre':fmt(rad)+' units','answer','f116-radius'));
 aside.append(card('DIAMETER · EDGE TO EDGE',hidden?'Two equal radii':q.phase<6&&!q.editable?'Across the centre':fmt(diam)+' units','answer','f116-diameter'));
 if(P.preset.startsWith('GCSE')){const val=equation();aside.append(card('GCSE · CIRCLE EQUATION',hidden?'Build the distance rule':val,'normal','f116-equation'));}
 else aside.append(card('MATHEMATICAL FEATURE',q.phase===5?'The centre is the midpoint of every diameter.':q.phase===7||q.phase===8?'Horizontal 3, vertical 4, diagonal 5.': 'All boundary points are equally far from C.','note','f116-feature'));
 aside.append(card('WHY THIS MATTERS',C.presets[P.preset].context,'note'));
 layout.append(aside);section.append(layout);
 if(q.challenge){const img=N.helperImg(q.correct?'cheer':P.wrong?'oops':'think','teen');section.append(H('div',{class:'f116-teen-note',style:'font:750 .77rem var(--nova-font-ui);color:#b9eafa;padding:6px 10px'},[H('img',{src:img.src,alt:'Izaac, teen mascot studying coordinate geometry',style:'height:44px;width:44px;object-fit:contain;vertical-align:middle'}),H('span',{text:q.correct?' Izaac: That distance is exact.':' Izaac: Start at the centre and count squares carefully.'})]))}
 stage.append(section);N.scene.helperStrip(stage,q.correct?'cheer':q.pose,q.caption);return svg;
}
function render(i,stage){const old={preset:P.preset,centre:[...P.centre],radius:P.radius,solved:P.solved,wrong:P.wrong};const row=STORY[i];reset(row[3],false);P.step=i;const svg=scene(stage,{phase:row[4],pose:row[1],caption:row[2]});
 if(!N.reducedMotion()&&i>=3){const cp=pathCircle();N.motion.trail(svg,cp,'focus',390)}Object.assign(P,old)}
function cardMatch(panel){const root=H('section',{class:'f116-matches f116-wide','data-testid':'f116-matching'}),status=H('p',{class:'f116-status','aria-live':'polite',text:'Choose an idea, then its matching meaning.'});root.append(H('h4',{text:'MATCH THE MATHEMATICAL IDEA TO ITS DEFINITION'}));
 const meanings={radius:'Centre to boundary',diameter:'Across through centre',centre:'Equally distant from all points on the circle'},words={radius:'RADIUS',diameter:'DIAMETER',centre:'CENTRE'},keys=Object.keys(words),choices=H('div',{style:'display:grid;gap:6px'}),targets=H('div',{style:'display:grid;gap:6px'});
 function choose(k){P.selected=k;status.textContent='Selected '+words[k]+'. Now choose its definition.';draw()}
 function place(k,t){if(!k){status.textContent='Select an idea first.';return}if(k!==t){status.textContent='Not quite. The radius ends at the edge; the diameter passes through the centre.';return}P.matches[k]=true;P.selected=null;emit('card',{key:k,target:t,action:'matched'});status.textContent='Correct match: '+words[k];draw()}
 function remove(k){P.matches[k]=false;P.selected=null;status.textContent='Moved '+words[k]+' back to the tray.';emit('card',{key:k,action:'removed'});draw()}
 function draw(){choices.replaceChildren();targets.replaceChildren();for(const k of keys){let b=H('button',{type:'button',text:words[k],class:(P.selected===k?'selected ':'')+(P.matches[k]?'matched':''),'data-testid':'f116-card-'+k,onclick:()=>choose(k)});choices.append(b);
  b.addEventListener('pointerdown',e=>{if(e.button>0)return;let id=e.pointerId,start=[e.clientX,e.clientY],moved=false,over=null;const hit=(x,y)=>document.elementFromPoint(x,y)?.closest?.('[data-testid^="f116-target-"],[data-testid="f116-return"]');const glow=v=>{over?.classList.remove('over');over=v;over?.classList.add('over')};const clean=()=>{document.removeEventListener('pointermove',mv,true);document.removeEventListener('pointerup',up,true);document.removeEventListener('pointercancel',cn,true);window.removeEventListener('blur',bl);glow(null)};const mv=v=>{if(v.pointerId!==id)return;if(Math.hypot(v.clientX-start[0],v.clientY-start[1])>7)moved=true;if(moved)glow(hit(v.clientX,v.clientY))};const up=v=>{if(v.pointerId!==id)return;const tar=moved?hit(v.clientX,v.clientY):null;clean();if(!tar)return;const token=tar.dataset.testid;if(token==='f116-return')remove(k);else if(token?.startsWith('f116-target-'))place(k,token.slice('f116-target-'.length))};const cn=v=>{if(v.pointerId===id)clean()};const bl=()=>clean();document.addEventListener('pointermove',mv,true);document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',cn,true);window.addEventListener('blur',bl)})}
 for(const k of keys){targets.append(H('button',{type:'button',class:P.matches[k]?'matched':'','data-testid':'f116-target-'+k,text:meanings[k]+(P.matches[k]?' ✓':''),onclick:()=>place(P.selected,k)}))}}
 root.append(choices,targets,H('button',{type:'button',class:'f116-remove',text:'↶ REMOVE / TRY AGAIN','data-testid':'f116-return',onclick:()=>P.selected?remove(P.selected):status.textContent='Choose a matched item to remove.'}),status);panel.append(root);draw()}
function explore(panel,stage){panel.classList.add('f116-controls');
 function redraw(pose='point',caption='The centre stays fixed. Every point on the edge is one radius away.'){panel.replaceChildren();const pre=H('select',{class:'nova-input','aria-label':'Circle lesson preset','data-testid':'f116-preset'});for(const [key,val] of Object.entries(C.presets))pre.append(H('option',{value:key,text:val.label}));pre.value=P.preset;pre.onchange=()=>{reset(pre.value);redraw('explain',C.presets[P.preset].context)};panel.append(H('label',{class:'f116-wide'},['CHOOSE LESSON OR GCSE EXTENSION',pre]));
 const max=limitRadius(),range=H('input',{type:'range',min:'1',max:String(max),step:'.5',value:String(P.radius),'data-testid':'f116-radius-slider','aria-label':'Set the circle radius'});range.oninput=()=>{setRadius(+range.value,'slider');redraw('count','Increasing radius makes a wider circle; the centre has not moved.')};panel.append(H('label',{class:'f116-wide'},[H('div',{class:'f116-controlhead'},[H('span',{text:'RADIUS · DRAG HANDLE OR USE ARROW KEYS'}),H('strong',{text:fmt(P.radius)+' units'})]),range]));
 const centreH=H('input',{type:'range',min:'-3',max:'3',step:'1',value:String(P.centre[0]),'data-testid':'f116-centre-x','aria-label':'Centre horizontal coordinate'}),centreV=H('input',{type:'range',min:'-3',max:'3',step:'1',value:String(P.centre[1]),'data-testid':'f116-centre-y','aria-label':'Centre vertical coordinate'});
 for(const [idx,inp,key] of [[0,centreH,'x'],[1,centreV,'y']]){inp.oninput=()=>{P.centre[idx]=Number(inp.value);P.radius=bound(P.radius,1,limitRadius());emit('centre',{x:P.centre[0],y:P.centre[1]});redraw('point','Moving the centre changes position, not the fact that all radii are equal.')}}
 panel.append(H('label',{},[H('div',{class:'f116-controlhead'},[H('span',{text:'CENTRE · x'}),H('strong',{text:fmt(P.centre[0])})]),centreH]),H('label',{},[H('div',{class:'f116-controlhead'},[H('span',{text:'CENTRE · y'}),H('strong',{text:fmt(P.centre[1])})]),centreV]));
 panel.append(H('p',{class:'f116-instruction f116-wide',text:'Move the golden handle on the radius, or focus it and use the arrow keys. Outside drops spring home. The stage displays labels as plain chalk text, never as decorative pills.'}));cardMatch(panel);scene(stage,{phase:9,editable:true,pose,caption})}
 reset(P.preset,false);redraw('point','Drag the golden radius handle, or use the controls to move the centre and change the radius.')}
const TASKS=[
 {pre:'Y9-040',q:'Centre (1, −1), boundary point (4, −1). What is the radius?',ans:3,hint:'Count horizontally from x = 1 to x = 4.',wrong:'The radius begins at the centre, not at the origin.',explain:'The horizontal distance is 4 − 1 = 3.'},
 {pre:'Y9-040',q:'For radius 3, what is the diameter?',ans:6,hint:'A diameter is made from two radii.',wrong:'A diameter crosses the centre: double the radius.',explain:'Diameter = 2 × 3 = 6.'},
 {pre:'Y9-040-SYMMETRY',q:'Centre (−2, 1), radius 2. What is the x-coordinate of the rightmost point?',ans:0,hint:'Go two right from x = −2.',wrong:'Do not start from x = 0; start from the centre at −2.',explain:'−2 + 2 = 0.'},
 {pre:'Y9-040-SYMMETRY',q:'Centre (−2, 1), radius 2. What is the highest y-coordinate?',ans:3,hint:'Add the radius to the centre y-coordinate.',wrong:'The highest y-coordinate is 1 + 2, not 2.',explain:'1 + 2 = 3.'},
 {pre:'Y9-040-DIAMETER',q:'A circle has a diameter of 8. What is its radius?',ans:4,hint:'A radius is half a diameter.',wrong:'Divide the diameter by two, do not double it.',explain:'8 ÷ 2 = 4.'},
 {pre:'Y9-040-PYTH',q:'From (0,0) to (3,4), what is the exact distance?',ans:5,hint:'Square 3 and 4, add, and take the square root.',wrong:'Do not add 3 + 4; use Pythagoras for the diagonal.',explain:'√(3² + 4²) = √25 = 5.'},
 {pre:'Y9-040-PYTH',q:'In a 3–4–5 triangle, what is r²?',ans:25,hint:'Square the length 5.',wrong:'r² = 3² + 4² = 25.',explain:'The radius is 5, so r² = 25.'},
 {pre:'Y9-040',q:'Centre (1, −1), radius 3. What is the lowest y-coordinate?',ans:-4,hint:'Move down by 3 from y = −1.',wrong:'Going down means subtracting: −1 − 3.',explain:'−1 − 3 = −4.'},
 {pre:'GCSE-ORIGIN',q:'GCSE EXT: if x² + y² = 16, what is the radius?',ans:4,hint:'Find the square root of 16.',wrong:'The equation uses radius squared, not diameter squared.',explain:'r² = 16, so r = 4.'},
 {pre:'GCSE-SHIFT',q:'GCSE EXT: for (x + 2)² + (y + 1)² = 9, what is the radius?',ans:3,hint:'The right-hand side is r².',wrong:'The centre changes the brackets, but the radius comes from √9.',explain:'r = √9 = 3.'}
];
function challenge(panel,api,stage){const tasks=TASKS.map((t,i)=>({q:t.q,build:ctl=>{reset(t.pre,false);const input=H('input',{class:'nova-input',type:'text',inputmode:'decimal',placeholder:'Numerical answer','aria-label':'Circle geometry numerical answer','data-testid':'f116-answer'});ctl.append(H('label',{class:'f116-task'},[H('span',{text:'YOUR ANSWER'}),input]));input.oninput=()=>emit('answer',{task:i,value:input.value});return()=>input.value},check:value=>{const raw=String(value??'').trim().replaceAll('−','-'),v=Number(raw),good=raw!==''&&Number.isFinite(v)&&Math.abs(v-t.ans)<.001;if(good){P.solved=true;scene(stage,{phase:10,challenge:true,correct:true,pose:'cheer',caption:t.explain})}else P.wrong++;return[good,good?t.explain:raw===''?'Enter a numerical answer before checking.':t.wrong]},hint:t.hint,solve:()=>{P.solved=true;scene(stage,{phase:10,challenge:true,correct:true,pose:'cheer',caption:t.explain})}}));
 N.challengeRun(panel,api,tasks,i=>{reset(TASKS[i].pre,false);scene(stage,{phase:10,challenge:true,pose:'think',caption:'Find the exact coordinate distance from the centre. Read carefully before entering a value.'})},C)
}
const def={id:ID,title:'Circle on a Grid',config:C,steps:STEPS,render,explore,challenge,alt:'A single-board neon coordinate geometry studio: a circle on a signed Cartesian grid, a centre point, golden draggable radius and symmetric markers.',staticAlt:'A circle is the set of points at a fixed distance r from a centre C. Diameter d = 2r. Origin-centred equation x² + y² = r² is a GCSE extension.',exploreIntro:'Choose a centre and radius. Drag the golden edge handle, use arrow keys, or adjust the labelled controls. Match circle terms to their meanings.',onRestore:()=>reset()};
N.registry.add({id:ID,title:'Circle on a Grid',family:'F10',topics:['circle','radius','diameter','coordinate geometry','Pythagoras','equation of a circle'],deps:['F0-02','F0-14','F10-03']});
N.bankMount({id:ID,num:'16',title:'Circle on a Grid · Premium Edition',def,linked:['F0-14','F10-03'],years:'Y9-040 · GCSE extension',spec:{purpose:'Plot a coordinate circle and reason about centre, equal radii, diameter, midpoint and coordinate distance.',params:'Centre (h,k), radius r (in units), circle point positions, optional equation (x−h)²+(y−k)²=r².',presets:'Four Y9-040 coordinate-geometry presets; two clearly labelled GCSE equation extensions.',steps:'13 teaching stages: centre, radius, sweep, symmetry, diameter, Pythagoras, classification and GCSE.',interactions:'Watch, Guided, Explore, Challenge; draggable golden radius, arrow-key control, centre/radius sliders and term-matching tray; 10 marked challenges.',traps:'Radius must be measured from centre; diameter twice radius; x and y coordinates are signed; diagonal distance uses Pythagoras; circle equations GCSE only.',gcse:'Origin-centred and translated circle equations are separately labelled as GCSE EXTENSION.'}});
const bobAlt=()=>document.querySelectorAll('#F10-16 .face img').forEach(img=>{if(!img.alt)img.alt='Sir Bob, NOVA mathematics tutor'});bobAlt();window.addEventListener('load',bobAlt,{once:true});
})();
