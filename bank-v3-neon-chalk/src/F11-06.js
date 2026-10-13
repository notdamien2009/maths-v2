/* F11-06 Polygon Angles Turtle — dedicated geometry on the canonical F0/F1 core.
   Exterior turns computed from polygon edges; interior+exterior=180° at each
   convex vertex; total exterior turn=360° for every convex closed polygon.
   Source core untouched. */
const F116_CONFIG=Object.freeze({id:'F11-06',family:'F11',defaultPreset:'y7',presets:{
 y7:{label:'Y7-044 · Quadrilateral walk',n:4,irregular:false},
 y8:{label:'Y8-049 · Regular polygons',n:6,irregular:false},
 y9:{label:'Y9-026 · Irregular polygon proof',n:4,irregular:true},
 triangle:{label:'Equilateral triangle',n:3,irregular:false},
 pentagon:{label:'Regular pentagon',n:5,irregular:false},
 octagon:{label:'Regular octagon',n:8,irregular:false}
},events:{value:['preset','sides','turn','vertex','shape','reason','answer','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F116_CONFIG=F116_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,CFG=F116_CONFIG,ID=CFG.id,TAU=Math.PI*2;
N.premium?.enable?.();
const S={n:4,irregular:false,progress:0,preset:'y7',mode:'watch',custom:null};
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw Error('Undeclared NOVA event '+key);N.events.emit('value',{engine:ID,key,value})};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=n=>Math.round(n*10)/10;
const fmt=n=>Number.isInteger(round(n))?String(round(n)):round(n).toFixed(1);
const deg=n=>fmt(n)+'°';
const btn=(name,fn,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text:name,onclick:fn});
const prose=s=>H('p',{class:'f116-explain f116-wide',text:s});
const card=(lab,value,sub)=>H('section',{class:'f116-card'},[H('div',{class:'f116-eyebrow',text:lab}),H('div',{class:'f116-main',text:String(value)}),H('p',{class:'f116-sub',text:sub})]);
const chalk=(par,x,y,s,role='given',size=27)=>N.chalkText(par,x,y,String(s),{role,size,anchor:'middle'});
const line=(par,x1,y1,x2,y2,role='given',width=6)=>N.neonLine(par,x1,y1,x2,y2,{role,width});
const ring=(par,x,y,r=9,role='given')=>N.neonRing(par,x,y,{r,role,pulse:false});
const V=(x,y,a,r)=>[x+r*Math.cos(a),y+r*Math.sin(a)];
const ang=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0]);
const delta=(a,b)=>(b-a+TAU*2)%TAU;
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
function convex(p){return p.every((v,i)=>cross(p[(i+p.length-1)%p.length],v,p[(i+1)%p.length])>300)}
function polygon(n,irregular=false,custom=null){
 if(irregular)return(custom||[[189,180],[470,131],[552,375],[249,431]]).map(p=>p.slice());
 const radius=n===3?203:n===4?199:195,cx=366,cy=269,offset=n===4?(-Math.PI/4):(-Math.PI/2);
 return Array.from({length:n},(_,i)=>V(cx,cy,offset+i*TAU/n,radius));
}
function facts(p){let n=p.length,turns=[],interiors=[],lengths=[];
 for(let i=0;i<n;i++){let prev=p[(i+n-1)%n],v=p[i],next=p[(i+1)%n];let incoming=ang(prev,v),outgoing=ang(v,next),turn=delta(incoming,outgoing)*180/Math.PI;
 turns.push(turn);interiors.push(180-turn);lengths.push(Math.hypot(next[0]-v[0],next[1]-v[1]));}
 return {n,turns,interiors,lengths,exteriorSum:turns.reduce((a,b)=>a+b,0),interiorSum:interiors.reduce((a,b)=>a+b,0)};
}
function interp(p,t){let n=p.length,edge=t>=n?n-1:Math.max(0,Math.floor(clamp(t,0,n))),pct=t>=n?1:t-edge;let a=p[edge],b=p[(edge+1)%n];return [a[0]+(b[0]-a[0])*pct,a[1]+(b[1]-a[1])*pct]}
function arc(par,centre,r,start,span,role='op',fill=false){
 let end=start+span,from=V(...centre,start,r),to=V(...centre,end,r),large=span>Math.PI?1:0;
 let d=`M ${from[0]} ${from[1]} A ${r} ${r} 0 ${large} 1 ${to[0]} ${to[1]}`;
 if(fill){d=`M ${centre[0]} ${centre[1]} L ${from[0]} ${from[1]} A ${r} ${r} 0 ${large} 1 ${to[0]} ${to[1]} Z`;N.neonPath(par,d,{role,width:2,fill:true});}
 else N.neonPath(par,d,{role,width:5});
}
function turtledraw(par,x,y,heading){
 let g=E('g',{transform:`translate(${x} ${y}) rotate(${heading*180/Math.PI}) scale(1.23)`,class:'f116-turtleglow','data-testid':'f116-turtle-art'},par);
 // Chalk-neon cartographic turtle; head aims along direction of travel.
 for(const [dx,dy] of [[-8,-15],[-8,15],[11,-15],[11,15]]){const pts=`M ${dx-10} ${dy-6} Q ${dx} ${dy-15} ${dx+10} ${dy-5} Q ${dx+7} ${dy+8} ${dx-7} ${dy+8} Z`;N.neonPath(g,pts,{role:'focus',width:2,fill:true})}
 N.neonPath(g,'M -24 0 C -23 -16 -11 -25 3 -22 C 18 -19 22 -6 22 0 C 22 16 6 23 -8 19 C -20 16 -26 9 -24 0 Z',{role:'result',width:3,fill:true});
 N.neonPath(g,'M -20 0 L -7 -16 L 12 -6 L 12 7 L -7 16 Z',{role:'focus',width:2.2,fill:false});
 N.neonPath(g,'M -7 -16 L -7 16 M -7 0 L 12 -6 M -7 0 L 12 7',{role:'result',width:1.8});
 N.neonPath(g,'M 20 -7 C 27 -14 42 -9 43 0 C 42 11 27 14 20 7 Z',{role:'result',width:3,fill:true});
 ring(g,34,-5,2.3,'focus');N.neonPath(g,'M -26 0 L -39 -8 L -36 7 Z',{role:'op',width:2,fill:true});
 return g;
}
function frame(stage){stage.replaceChildren();let sec=H('section',{class:'f116-theatre','data-testid':'f116-stage'});sec.append(H('div',{class:'f116-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f116-tag',text:'NOVA · NEON CHALK'})]));let layout=H('div',{class:'f116-layout'}),plane=H('div',{class:'f116-plane'});
 let svg=N.svg.root(730,555,'Polygon with a travelling turtle, exterior turning angles and interior angle sectors');svg.classList.add('nv-svg','f116-svg');svg.dataset.testid='f116-svg';svg.removeAttribute('width');svg.removeAttribute('height');
 if(window.matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','112 0 507 540');
 plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return {sec,layout,svg,plane};}
function renderMath(svg,points,opt={}){
 let old=svg.querySelector('[data-layer="geometry"]');old?.remove();let g=E('g',{'data-layer':'geometry','data-testid':'f116-geometry'},svg),f=facts(points),n=f.n,prog=clamp(opt.progress??0,0,n),completed=clamp(Math.floor(prog+1e-5),0,n),sel=opt.selectVertex??(completed%n),phase=opt.phase??4,free=!!opt.free,hide=!!opt.hide;
 const path='M '+points.map((q,i)=>(i?'L ':'')+q[0].toFixed(2)+' '+q[1].toFixed(2)).join(' ')+' Z';
 // Fill is approved NOVA neon glass primitive; neutral outlines do not conceal the maths.
 N.neonPath(g,path,{role:'given',width:6,fill:true});
 if(phase>=1){points.forEach((v,i)=>{let next=points[(i+1)%n];line(g,...v,...next,i<Math.ceil(prog-0.0001)?'result':'given',i<Math.ceil(prog-0.0001)?8:4)});}
 if(phase>=1)points.forEach((v,i)=>{ring(g,...v,8,'focus');let c=[366,265],away=Math.atan2(v[1]-c[1],v[0]-c[0]),num=V(...v,away,27);if(!hide||i!==sel)chalk(g,num[0],num[1]+7, String.fromCharCode(65+i),'given',25)});
 if(phase>=2||free){points.forEach((v,i)=>{let a=ang(v,points[(i+1)%n]),back=ang(v,points[(i+n-1)%n]);let span=delta(a,back);
 if(i===sel||opt.showAll){arc(g,v,40,a,span,i===sel?'focus':'given',i===sel);if(i===sel&&!hide)chalk(g,...V(...v,a+span/2,63),deg(f.interiors[i]),'focus',25)} });}
 if(phase>=3||free){points.forEach((v,i)=>{let prev=points[(i+n-1)%n],incoming=ang(prev,v),turn=f.turns[i]*Math.PI/180;
 if(i===sel||opt.showAll){let out=V(...v,incoming,82);line(g,...v,...out,'op',3);arc(g,v,51,incoming,turn,i===sel?'op':'given',i===sel);if(i===sel&&!hide){let label=V(...v,incoming+turn/2,99);chalk(g,label[0],label[1]+5,deg(f.turns[i]),'op',26);}}
 });}
 const at=interp(points,prog);let edge=Math.min(n-1,Math.floor(prog===n?n-1:prog)),headed=prog>=n-1e-6?ang(points[0],points[1]):ang(points[edge],points[(edge+1)%n]);
 if(phase>=0){turtledraw(g,...at,headed);}
 let legend=phase>=2?'INTERIOR + EXTERIOR = 180°':'Follow the path around the shape';chalk(g,366,519,legend,'focus',28);
 if((phase>=4||free)&&!hide){chalk(g,365,45,completed===n?'FULL TURN = 360°':`TURNS SO FAR: ${deg(f.turns.slice(1,completed+1).reduce((a,b)=>a+b,completed===n?f.turns[0]:0))}`,'result',31)}
 let handle=svg.querySelector(':scope > [data-testid="f116-turtle-handle"]');if(opt.interactive){if(!handle){handle=E('circle',{r:31,fill:'transparent',stroke:'transparent',tabindex:0,role:'slider',class:'f116-turtle-target','data-testid':'f116-turtle-handle','aria-label':'Move turtle around polygon. Left and right arrow keys move between vertices.','aria-valuemin':0,'aria-valuemax':n,style:'touch-action:none'},svg)}handle.setAttribute('cx',at[0]);handle.setAttribute('cy',at[1]);handle.setAttribute('aria-valuenow',String(round(prog)));handle.setAttribute('aria-valuetext',`${completed} completed turns of ${n}`);}
 return f;
}
function draw(stage,opt={}){
 let {sec,layout,svg}=frame(stage),n=opt.n||S.n,irregular=!!opt.irregular,points=polygon(n,irregular,opt.custom),phase=opt.phase??4,progress=clamp(opt.progress??0,0,n),f=facts(points);
 let reveal=(phase>=4||opt.free)&&!opt.hide;let boxes=H('aside',{class:'f116-aside','data-testid':'f116-aside'}),cards=[
 card('POLYGON',`${f.n} sides`,irregular?'An irregular quadrilateral: angles change when vertices move.':'Equal sides make a regular polygon.'),
 card('EXTERIOR TURN',(phase>=3||opt.free)&&!opt.hide?deg(f.turns[opt.selectVertex??Math.min(n-1,Math.floor(progress))]):'?',`Interior and exterior at one vertex total 180°.`),
 card('TOTAL EXTERIOR TURN',reveal?'360°':'?',reveal?'One complete circuit always turns through 360°.':'What happens to the turtle’s heading after one circuit?'),
 card('INTERIOR ANGLE TOTAL',reveal?deg(f.interiorSum):'?',reveal?`(n − 2) × 180° = ${deg(f.interiorSum)}`:'(n − 2) × 180°')];boxes.append(...cards);layout.append(boxes);
 const repaint=(p=progress,pointsNow=points,selected=opt.selectVertex)=>{f=renderMath(svg,pointsNow,{...opt,phase,progress:p,selectVertex:selected,interactive:!!opt.free});let current=selected??Math.min(n-1,Math.floor(p===n?n-1:p));if(!opt.hide){cards[1].querySelector('.f116-main').textContent=deg(f.turns[current]);cards[3].querySelector('.f116-main').textContent=deg(f.interiorSum);}opt.onMetrics?.({p,f,points:pointsNow});};
 repaint();N.scene.helperStrip(sec,opt.pose||'explain',opt.caption||'Follow the turtle. Every corner adds an exterior turn.');
 return {svg,sec,points,f,repaint};
}
const STEPS=[
 {name:'Notice the polygon',n:4,phase:0,progress:0,pose:'explain',narration:'A polygon is a closed shape made from straight sides. Our turtle begins at one corner.'},
 {name:'Walk the first side',n:4,phase:1,progress:.75,pose:'point-right',narration:'The turtle travels straight along one side before reaching the next corner.'},
 {name:'Meet a corner',n:4,phase:2,progress:1,pose:'magnify',narration:'Look inside this corner. This interior angle measures ninety degrees in a square.'},
 {name:'Make the exterior turn',n:4,phase:3,progress:1,pose:'think',narration:'The turtle turns clockwise to face along the next side. That turn is the exterior angle.'},
 {name:'One right-angle turn',n:4,phase:4,progress:1,pose:'count',narration:'At a square corner the turtle turns through ninety degrees.'},
 {name:'Halfway around',n:4,phase:4,progress:2,pose:'point-down',narration:'Two ninety-degree turns make one hundred and eighty degrees so far.'},
 {name:'Complete the square',n:4,phase:4,progress:4,pose:'celebrate',narration:'Four right-angle turns bring the turtle back to its starting direction: a full three hundred and sixty degrees.'},
 {name:'Change to a triangle',n:3,phase:4,progress:1,pose:'show-three',narration:'In an equilateral triangle, each exterior turn is one hundred and twenty degrees.'},
 {name:'Triangle full circuit',n:3,phase:4,progress:3,pose:'idea',narration:'Three one-hundred-and-twenty-degree turns also make a full turn of three hundred and sixty degrees.'},
 {name:'Try a regular pentagon',n:5,phase:4,progress:2,pose:'compare',narration:'Five equal exterior turns share three hundred and sixty degrees. Each turn is seventy-two degrees.'},
 {name:'Interior and exterior pair',n:5,phase:4,progress:5,pose:'ruler',narration:'At one vertex, the interior and exterior angle make a straight angle: one hundred and eighty degrees.'},
 {name:'Interior angle sum',n:6,phase:4,progress:6,pose:'count',narration:'For six sides, four triangles fit inside. That makes an interior-angle total of seven hundred and twenty degrees.'},
 {name:'Irregular still makes a circuit',n:4,irregular:true,phase:4,progress:4,pose:'compare',narration:'Even when the angles are not equal, their exterior turns add to three hundred and sixty degrees.'},
 {name:'Explain the rule',n:8,phase:4,progress:8,pose:'celebrate',narration:'A regular polygon has exterior angle three hundred and sixty divided by its number of sides. The interior-angle sum is sides minus two, multiplied by one hundred and eighty.'}
];
function render(i,stage){let s=STEPS[i]||STEPS[0];draw(stage,{...s,caption:s.narration,selectVertex:s.progress===s.n?0:Math.floor(s.progress)})}
function SVGPoint(svg,e){let p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function nearestOnEdges(points,pos){let nearest=0,best=Infinity;points.forEach((a,i)=>{let b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((pos[0]-a[0])*dx+(pos[1]-a[1])*dy)/(dx*dx+dy*dy),0,1),x=a[0]+t*dx,y=a[1]+t*dy,d=(x-pos[0])**2+(y-pos[1])**2;if(d<best){best=d;nearest=i+t}});return nearest}
function pointerDrag(handle,svg,project,onMove,onCommit){let dragging=null;
 handle.addEventListener('pointerdown',e=>{if(N.ui._drag||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();e.stopPropagation();let id=e.pointerId,start=handle.getAttribute('aria-valuenow'),raf=0,last=null;dragging={cancel:()=>cancel(),captured:true,moved:true};N.ui._drag=dragging;
 let flush=()=>{raf=0;if(last!==null){onMove(last);last=null}};
 let move=ev=>{if(ev.pointerId!==id)return;ev.preventDefault();last=project(SVGPoint(svg,ev));if(!raf)raf=requestAnimationFrame(flush)};
 let clean=()=>{cancelAnimationFrame(raf);let old=dragging;dragging=null;if(N.ui._drag===old)N.ui._drag=null;handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{handle.releasePointerCapture(id)}catch(_){}};
 let up=ev=>{if(ev.pointerId!==id)return;let t=project(SVGPoint(svg,ev));clean();onCommit(t)};
 let cancel=()=>{clean();onCommit(Number(start))};let lost=()=>{if(dragging)cancel()},key=e=>{if(e.key==='Escape'){e.preventDefault();cancel()}};
 handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);
 try{handle.setPointerCapture(id)}catch(_){}});
 handle.addEventListener('keydown',e=>{let dir=(e.key==='ArrowRight'||e.key==='ArrowUp')?1:(e.key==='ArrowLeft'||e.key==='ArrowDown')?-1:0;if(dir){e.preventDefault();onCommit(Number(handle.getAttribute('aria-valuenow'))+dir*(e.shiftKey?2:1))}});
}
function vertexDrag(handle,svg,points,getPoints,commit){
 let active=null;
 const apply=pos=>{let next=getPoints().map(a=>a.slice());next[1]=[clamp(pos[0],385,533),clamp(pos[1],110,268)];if(!convex(next))return false;commit(next,true);handle.setAttribute('cx',next[1][0]);handle.setAttribute('cy',next[1][1]);return true;};
 handle.addEventListener('pointerdown',e=>{if(N.ui._drag||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();e.stopPropagation();let id=e.pointerId,before=getPoints().map(a=>a.slice()),raf=0,pending=null;
 active={cancel:()=>cancel(),captured:true,moved:true};N.ui._drag=active;
 const flush=()=>{raf=0;if(pending){apply(pending);pending=null}};
 const move=ev=>{if(ev.pointerId!==id)return;ev.preventDefault();let p=SVGPoint(svg,ev);pending=[p.x,p.y];if(!raf)raf=requestAnimationFrame(flush)};
 const clean=()=>{cancelAnimationFrame(raf);pending=null;let old=active;active=null;if(N.ui._drag===old)N.ui._drag=null;handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{handle.releasePointerCapture(id)}catch(_){}};
 const up=ev=>{if(ev.pointerId!==id)return;let p=SVGPoint(svg,ev);apply([p.x,p.y]);let end=getPoints().map(a=>a.slice());end[1]=end[1].map(x=>Math.round(x/5)*5);if(convex(end))commit(end,false);clean()};
 const cancel=()=>{commit(before,false);handle.setAttribute('cx',before[1][0]);handle.setAttribute('cy',before[1][1]);clean()};const lost=()=>{if(active)cancel()},key=ev=>{if(ev.key==='Escape'){ev.preventDefault();cancel()}};
 handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);try{handle.setPointerCapture(id)}catch(_){}});
 handle.addEventListener('keydown',e=>{let dx=0,dy=0,step=e.shiftKey?10:5;if(e.key==='ArrowRight')dx=step;else if(e.key==='ArrowLeft')dx=-step;else if(e.key==='ArrowDown')dy=step;else if(e.key==='ArrowUp')dy=-step;if(dx||dy){e.preventDefault();let p=getPoints()[1];apply([p[0]+dx,p[1]+dy])}});
}
function explore(panel,stage){panel.classList.add('f116-tools');let s={n:S.n,irregular:S.irregular,progress:0,custom:S.custom?S.custom.map(a=>a.slice()):null,preset:S.preset};let box=null,controls={};
 let preset=H('select',{class:'nova-input','data-testid':'f116-preset','aria-label':'Choose polygon example'});Object.entries(CFG.presets).forEach(([key,v])=>preset.append(H('option',{value:key,text:v.label})));preset.value=s.preset;
 let count=H('input',{type:'range',min:3,max:10,value:s.n,step:1,'data-testid':'f116-sides','aria-label':'Number of polygon sides'}),countRead=H('strong',{class:'f116-inline-val',text:String(s.n)});
 let step=H('input',{type:'range',min:0,max:s.n,step:1,value:0,'data-testid':'f116-progress','aria-label':'Turtle turns completed'}),turnRead=H('strong',{class:'f116-stepread','data-testid':'f116-turn-display',text:'0 / '+s.n+' turns'});
 panel.append(H('label',{class:'f116-wide'},['POLYGON PRESET',preset]),H('label',{},['NUMBER OF SIDES',count]),countRead,H('label',{class:'f116-wide'},['FOLLOW THE TURTLE',step]),turnRead);
 let go=H('div',{class:'f116-actions f116-wide'});panel.append(go);
 function redraw(recreate=true){if(recreate){box=draw(stage,{...s,phase:4,free:true,pose:'ruler',caption:s.irregular?'Drag the highlighted vertex, or move the turtle around each side. Exterior turns still total 360°.':'Drag the turtle around the polygon. At each vertex it makes an exterior turn.',onMetrics:({p,f})=>{s.progress=p;step.value=String(Math.floor(p+1e-5));turnRead.textContent=Math.floor(p+1e-5)+' / '+f.n+' turns'}});
 let h=stage.querySelector('[data-testid=f116-turtle-handle]');pointerDrag(h,box.svg,where=>nearestOnEdges(box.points,[where.x,where.y]),v=>box.repaint(clamp(v,0,s.n),box.points),v=>{s.progress=clamp(Math.round(v),0,s.n);S.progress=s.progress;emit('turn',s.progress);box.repaint(s.progress,box.points)});
 if(s.irregular){let vh=E('circle',{r:24,fill:'transparent','data-testid':'f116-vertex-handle',class:'f116-vertex-target',tabindex:0,role:'slider','aria-label':'Drag upper right vertex to change an irregular quadrilateral',style:'touch-action:none'},box.svg);
 const vertex=()=>{vh.setAttribute('cx',box.points[1][0]);vh.setAttribute('cy',box.points[1][1])};vertex();vertexDrag(vh,box.svg,box.points,()=>box.points,(candidate,live)=>{box.points=candidate;s.custom=candidate.map(a=>a.slice());S.custom=candidate.map(a=>a.slice());box.repaint(s.progress,candidate);vertex();if(!live)emit('vertex',candidate[1])});}
 }else box.repaint(s.progress,box.points);}
 function setSides(v){s.n=clamp(Number(v),3,10);s.irregular=false;s.custom=null;s.progress=0;S.n=s.n;S.irregular=false;count.value=String(s.n);countRead.textContent=s.n;step.max=String(s.n);step.value='0';turnRead.textContent='0 / '+s.n+' turns';emit('sides',s.n);redraw()}
 count.oninput=()=>setSides(count.value);
 preset.onchange=()=>{let p=CFG.presets[preset.value];s={n:p.n,irregular:p.irregular,progress:0,custom:null,preset:preset.value};Object.assign(S,s);count.value=String(s.n);countRead.textContent=s.n;step.max=String(s.n);step.value='0';emit('preset',s.preset);redraw()};
 step.oninput=()=>{s.progress=Number(step.value);emit('turn',s.progress);box.repaint(s.progress,box.points)};
 go.append(btn('Previous turn',()=>{s.progress=clamp(Math.floor(s.progress)-1,0,s.n);step.value=s.progress;box.repaint(s.progress,box.points)},'nova-btn ghost'),btn('Next turn',()=>{s.progress=clamp(Math.floor(s.progress)+1,0,s.n);step.value=s.progress;box.repaint(s.progress,box.points)},'nova-btn primary'),btn('Complete the circuit',()=>{s.progress=s.n;step.value=s.n;box.repaint(s.progress,box.points);emit('turn',s.progress)},'nova-btn ghost'),btn('Reset turtle',()=>{s.progress=0;step.value=0;box.repaint(0,box.points);emit('reset',s.n)},'nova-btn ghost'));
 panel.append(prose('The turn is the exterior angle, not the interior corner. When the turtle returns to its starting direction, the total turn is 360°.'));
 redraw();
}
const REASONS={regular:'A regular polygon has equal exterior angles: 360° ÷ sides',straight:'Interior + exterior at a vertex = 180°',sum:'The exterior turns around a convex polygon total 360°',triangles:'An n-sided polygon splits into (n − 2) triangles'};
const TASKS=[
 {n:3,kind:'exterior',answer:120,reason:'regular',q:'An equilateral triangle has three equal exterior turns. How many degrees is one exterior turn?',hint:'Share 360° equally between three corners.'},
 {n:5,kind:'exterior',answer:72,reason:'regular',q:'A regular pentagon has five equal exterior angles. Calculate one exterior angle.',hint:'Divide one whole turn by five.'},
 {n:6,kind:'interior',answer:120,reason:'straight',q:'A regular hexagon has exterior angles of 60°. Calculate its interior angle.',hint:'The interior angle and exterior turn lie on a straight line.'},
 {n:8,kind:'exterior',answer:45,reason:'regular',q:'A regular octagon has eight sides. What is each exterior turning angle?',hint:'One complete circuit is 360°.'},
 {n:7,kind:'sumInterior',answer:900,reason:'triangles',q:'A heptagon has seven sides. What is its total of interior angles?',hint:'Seven sides can be split into five triangles.'},
 {n:4,irregular:true,kind:'sumExterior',answer:360,reason:'sum',q:'An irregular convex quadrilateral has four different exterior angles. What is their total?',hint:'The turtle ends up facing its original direction.'},
 {n:10,kind:'interior',answer:144,reason:'straight',q:'A regular decagon turns 36° at each corner. What is its interior angle?',hint:'Subtract its exterior angle from 180°.'},
 {n:9,kind:'exterior',answer:40,reason:'regular',q:'A regular nonagon has nine sides. Calculate each exterior angle.',hint:'Divide a complete revolution by nine.'}
];
function cardDrag(btn,text,target,choose){let drag=null;btn.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;let id=e.pointerId,x=e.clientX,y=e.clientY,ghost=null;drag={cancel:()=>cancel(),captured:true,moved:true};
 const move=ev=>{if(ev.pointerId!==id)return;if(Math.hypot(ev.clientX-x,ev.clientY-y)>7&&!ghost){ghost=H('div',{class:'f116-ghost',text});document.body.append(ghost);N.ui._drag=drag}if(ghost){ev.preventDefault();ghost.style.left=(ev.clientX+12)+'px';ghost.style.top=(ev.clientY+12)+'px';let r=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)}};
 const clean=()=>{ghost?.remove();target.dataset.hover='false';if(N.ui._drag===drag)N.ui._drag=null;drag=null;btn.removeEventListener('pointermove',move);btn.removeEventListener('pointerup',up);btn.removeEventListener('pointercancel',cancel);btn.removeEventListener('lostpointercapture',lost);window.removeEventListener('keydown',key);window.removeEventListener('blur',cancel);try{btn.releasePointerCapture(id)}catch(_){}};
 const up=ev=>{if(ev.pointerId!==id)return;let r=target.getBoundingClientRect(),valid=ghost&&ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;clean();if(valid)choose()};let cancel=()=>clean(),lost=()=>{if(drag)cancel()},key=e=>{if(e.key==='Escape'){e.preventDefault();cancel()}};
 btn.addEventListener('pointermove',move);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',cancel);btn.addEventListener('lostpointercapture',lost);window.addEventListener('keydown',key);window.addEventListener('blur',cancel);try{btn.setPointerCapture(id)}catch(_){}});}
function challenge(panel,api,stage){panel.classList.add('f116-tools');let k=0;
 function show(){let t=TASKS[k];panel.replaceChildren();panel.append(H('div',{class:'pr-task f116-wide',text:`CHALLENGE ${k+1} / ${TASKS.length}`}),prose(t.q));
 let answer=H('input',{class:'nova-input','data-testid':'f116-answer',type:'number',step:'any',placeholder:'Degrees','aria-label':'Answer in degrees'});panel.append(H('label',{class:'f116-wide'},['ANGLE / TOTAL (°)',answer]));
 let choices=H('div',{class:'f116-reasons f116-wide'}),drop=H('div',{class:'f116-drop f116-wide','data-testid':'f116-reason-drop',text:'Choose or drag the mathematical reason here'}),chosen=null;
 let pick=reason=>{chosen=reason;drop.textContent=REASONS[reason];drop.dataset.set='true';emit('reason',reason);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===reason)))};
 for(let [reason,txt] of Object.entries(REASONS)){let b=H('button',{type:'button',class:'f116-reason','data-reason':reason,'aria-pressed':'false',text:txt,onclick:()=>pick(reason)});choices.append(b);cardDrag(b,txt,drop,()=>pick(reason))}panel.append(choices,drop);
 let actions=H('div',{class:'f116-actions f116-wide'});panel.append(actions);
 let paint=(reveal=false)=>draw(stage,{n:t.n,irregular:!!t.irregular,phase:4,progress:reveal?t.n:0,selectVertex:0,hide:!reveal,caption:reveal?'Good proof. The turn and the reason both agree.':'Study the polygon carefully, work out the angle, then choose the mathematical reason.',pose:reveal?'celebrate':'think'});
 actions.append(btn('Check answer + reason',()=>{let v=Number(answer.value),m='';if(!answer.value.trim()||!Number.isFinite(v))m='Enter an angle in degrees.';else if(Math.abs(v-t.answer)>.01){if(v===180-t.answer)m='That is the supplementary interior/exterior angle. Recheck what the question asks.';else if(v===360&&t.kind==='exterior')m='360° is the whole circuit, not one equal turn. Divide by the number of sides.';else if(v===180*t.n)m='Use n − 2 triangles, not n triangles.';else m=t.kind==='sumInterior'?'Each triangle adds 180°. Count n − 2 triangles.':t.kind==='sumExterior'?'A complete circuit always turns 360°.':'Use the correct relationship between exterior turn, sides, and interior angle.';}else if(chosen!==t.reason)m='The numerical angle is correct but the selected reason does not prove it.';
 if(m){api.check(false,m,{task:k+1});return;}api.check(true,`${fmt(t.answer)}°. ${REASONS[t.reason]}.`,{task:k+1,answer:t.answer,reason:chosen});emit('answer',{task:k+1,answer:v,reason:chosen});paint(true);actions.replaceChildren();if(k===TASKS.length-1)actions.append(H('strong',{class:'f116-complete f116-fullresult',text:'8 / 8 · POLYGON ANGLES MASTERED'}));else actions.append(btn('Next challenge →',()=>{k++;emit('task',k+1);show()},'nova-btn primary'))},'nova-btn primary'),btn('Hint',()=>api.hint(t.hint)));
 answer.addEventListener('keydown',e=>{if(e.key==='Enter')actions.querySelector('button')?.click()});paint(false);
 }show();}
const def={id:ID,title:'Polygon Angles Turtle',config:CFG,steps:STEPS,render,explore,challenge,alt:'Animated glowing turtle tracing regular and irregular polygons while exterior turning angles accumulate to 360 degrees.',staticAlt:'The exterior turning angles of a convex polygon total 360 degrees. At each vertex the interior and exterior angles add to 180 degrees. The interior angle sum is 180(n minus 2).',exploreIntro:'Drag the turtle through each vertex to discover why the complete exterior turn is always 360°.',onRestore:()=>{Object.assign(S,{n:4,irregular:false,progress:0,preset:'y7',custom:null});emit('reset','y7')}};
N.registry.add({id:ID,title:'Polygon Angles Turtle',family:'F11',topics:['exterior angles','interior angles','polygons','turtle','regular polygon'],deps:['F0-02','F0-04','F0-07','F0-08','F11-04']});
N.bankMount({id:ID,num:'06',title:'Polygon Angles Turtle · Premium Edition',def,linked:['F11-04','F11-07','F11-11'],years:'Year 7–9 · Angle sums and exterior turns',spec:{purpose:'Show geometrically why the exterior turning angles of any convex polygon sum to one full 360° turn.',params:'Sides 3–10, regular or draggable convex irregular quadrilateral, turtle location, interior/exterior arcs.',presets:'Y7-044 quadrilateral, Y8-049 regular polygon, Y9-026 irregular proof, triangle, pentagon, octagon.',steps:'14 named storyboard states, from one exterior turn to the full 360° circuit and irregular proof.',interactions:'Fast pointer-captured turtle walk, draggable irregular vertex with convexity check, slider, keyboard, exact angle + reason challenges.',traps:'Confusing interior with exterior, forgetting to divide by number of sides, assuming exterior sum changes with side count.',gcse:'Formal polygon-angle arguments for irregular and regular cases.'}});
})();
